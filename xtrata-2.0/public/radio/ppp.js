var Pb = Object.defineProperty;
var Ub = (e, t, n) => t in e ? Pb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var aa = (e, t, n) => Ub(e, typeof t != "symbol" ? t + "" : t, n);
var Hn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Gg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Al(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, o.get ? o : {
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
      typeof Hn < "u" && Hn || {}, r = {
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
      function o(m) {
        return m && DataView.prototype.isPrototypeOf(m);
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
        ], i = ArrayBuffer.isView || function(m) {
          return m && s.indexOf(Object.prototype.toString.call(m)) > -1;
        };
      function a(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function c(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function f(m) {
        var I = {
          next: function() {
            var N = m.shift();
            return { done: N === void 0, value: N };
          }
        };
        return r.iterable && (I[Symbol.iterator] = function() {
          return I;
        }), I;
      }
      function g(m) {
        this.map = {}, m instanceof g ? m.forEach(function(I, N) {
          this.append(N, I);
        }, this) : Array.isArray(m) ? m.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(I) {
          this.append(I, m[I]);
        }, this);
      }
      g.prototype.append = function(m, I) {
        m = a(m), I = c(I);
        var N = this.map[m];
        this.map[m] = N ? N + ", " + I : I;
      }, g.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, g.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, g.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, g.prototype.set = function(m, I) {
        this.map[a(m)] = c(I);
      }, g.prototype.forEach = function(m, I) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && m.call(I, this.map[N], N, this);
      }, g.prototype.keys = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push(N);
        }), f(m);
      }, g.prototype.values = function() {
        var m = [];
        return this.forEach(function(I) {
          m.push(I);
        }), f(m);
      }, g.prototype.entries = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push([N, I]);
        }), f(m);
      }, r.iterable && (g.prototype[Symbol.iterator] = g.prototype.entries);
      function h(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function w(m) {
        return new Promise(function(I, N) {
          m.onload = function() {
            I(m.result);
          }, m.onerror = function() {
            N(m.error);
          };
        });
      }
      function y(m) {
        var I = new FileReader(), N = w(I);
        return I.readAsArrayBuffer(m), N;
      }
      function x(m) {
        var I = new FileReader(), N = w(I), M = /charset=([A-Za-z0-9_-]+)/.exec(m.type), X = M ? M[1] : "utf-8";
        return I.readAsText(m, X), N;
      }
      function S(m) {
        for (var I = new Uint8Array(m), N = new Array(I.length), M = 0; M < I.length; M++)
          N[M] = String.fromCharCode(I[M]);
        return N.join("");
      }
      function C(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
      }
      function B() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && o(m) ? (this._bodyArrayBuffer = C(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = C(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = h(this);
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
            var m = h(this);
            return m || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var m = h(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var P = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function v(m) {
        var I = m.toUpperCase();
        return P.indexOf(I) > -1 ? I : m;
      }
      function T(m, I) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var N = I.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, I.headers || (this.headers = new g(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !N && m._bodyInit != null && (N = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new g(I.headers)), this.method = v(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var F = new AbortController();
            return F.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var X = /\?/;
            this.url += (X.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function _(m) {
        var I = new FormData();
        return m.trim().split("&").forEach(function(N) {
          if (N) {
            var M = N.split("="), X = M.shift().replace(/\+/g, " "), F = M.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(X), decodeURIComponent(F));
          }
        }), I;
      }
      function K(m) {
        var I = new g(), N = m.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var X = M.split(":"), F = X.shift().trim();
          if (F) {
            var oe = X.join(":").trim();
            try {
              I.append(F, oe);
            } catch (ie) {
              console.warn("Response " + ie.message);
            }
          }
        }), I;
      }
      B.call(T.prototype);
      function se(m, I) {
        if (!(this instanceof se))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new g(I.headers), this.url = I.url || "", this._initBody(m);
      }
      B.call(se.prototype), se.prototype.clone = function() {
        return new se(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new g(this.headers),
          url: this.url
        });
      }, se.error = function() {
        var m = new se(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var Q = [301, 302, 303, 307, 308];
      se.redirect = function(m, I) {
        if (Q.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new se(null, { status: I, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(I, N) {
          this.message = I, this.name = N;
          var M = Error(I);
          this.stack = M.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function V(m, I) {
        return new Promise(function(N, M) {
          var X = new T(m, I);
          if (X.signal && X.signal.aborted)
            return M(new t.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function oe() {
            F.abort();
          }
          F.onload = function() {
            var $ = {
              statusText: F.statusText,
              headers: K(F.getAllResponseHeaders() || "")
            };
            X.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? $.status = 200 : $.status = F.status, $.url = "responseURL" in F ? F.responseURL : $.headers.get("X-Request-URL");
            var D = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              N(new se(D, $));
            }, 0);
          }, F.onerror = function() {
            setTimeout(function() {
              M(new TypeError("Network request failed"));
            }, 0);
          }, F.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, F.onabort = function() {
            setTimeout(function() {
              M(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ie($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (F.open(X.method, ie(X.url), !0), X.credentials === "include" ? F.withCredentials = !0 : X.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof g || n.Headers && I.headers instanceof n.Headers)) {
            var Fe = [];
            Object.getOwnPropertyNames(I.headers).forEach(function($) {
              Fe.push(a($)), F.setRequestHeader($, c(I.headers[$]));
            }), X.headers.forEach(function($, D) {
              Fe.indexOf(D) === -1 && F.setRequestHeader(D, $);
            });
          } else
            X.headers.forEach(function($, D) {
              F.setRequestHeader(D, $);
            });
          X.signal && (X.signal.addEventListener("abort", oe), F.onreadystatechange = function() {
            F.readyState === 4 && X.signal.removeEventListener("abort", oe);
          }), F.send(typeof X._bodyInit > "u" ? null : X._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = g, n.Request = T, n.Response = se), t.Headers = g, t.Request = T, t.Response = se, t.fetch = V, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Hn);
})();
const Ob = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Hb(e, t) {
  const n = {};
  return Object.assign(n, Ob, t), await fetch(e, n);
}
function Db(e) {
  let t = Hb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Fb(...e) {
  const { fetchLib: t, middlewares: n } = Db(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var Bi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Bi || (Bi = {}));
var Mo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Mo || (Mo = {}));
var Yh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Yh || (Yh = {}));
const jb = "https://api.mainnet.hiro.so", Rb = "https://api.testnet.hiro.so", zb = "http://localhost:3999", Gb = ["mainnet", "testnet", "devnet", "mocknet"];
let Ni = class {
  constructor(t) {
    this.version = Mo.Mainnet, this.chainId = Bi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Mo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Fb();
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
Ni.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Vu();
    case "testnet":
      return new Kb();
    case "devnet":
      return new Vb();
    case "mocknet":
      return new Kg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Gb.join(", ")}`);
  }
};
Ni.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ni.fromName(e);
let Vu = class extends Ni {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? jb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Mo.Mainnet, this.chainId = Bi.Mainnet;
  }
}, Kb = class extends Ni {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Rb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Mo.Testnet, this.chainId = Bi.Testnet;
  }
}, Kg = class extends Ni {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? zb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Mo.Testnet, this.chainId = Bi.Testnet;
  }
};
const Vb = Kg, Vg = "xtrata.wallet.bridge.v1", Xb = (e) => typeof e == "object" && e !== null && e.protocol === Vg, Yb = (e) => Xb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", qb = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ca extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const qh = 12e4;
class Wb {
  constructor(t) {
    aa(this, "pending", /* @__PURE__ */ new Map());
    aa(this, "listenTarget");
    aa(this, "closed", !1);
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
    aa(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Yb(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new ca("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new ca("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ca("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const o = qb(), s = { protocol: Vg, kind: "request", id: o, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(o), a(
          new ca(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? qh}ms.`
          )
        );
      }, this.options.timeoutMs ?? qh);
      this.pending.set(o, { resolve: i, reject: a, timer: c }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new ca("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Zb = ["SP", "SM"], Jb = ["ST", "SN"], Qb = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return Zb.includes(n) ? "mainnet" : Jb.includes(n) ? "testnet" : null;
}, e1 = () => {
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
}, t1 = () => typeof window > "u" || !window.localStorage ? e1() : window.localStorage, cu = "xtrata.v15.1.wallet.session", Wh = "mainnet", Vc = { isConnected: !1 }, n1 = (e) => e.address ? Qb(e.address) ?? e.network : e.network, Xg = (e) => !e.isConnected || !e.address ? { ...Vc } : n1(e) !== Wh ? { ...Vc } : {
  isConnected: !0,
  address: e.address,
  network: Wh,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, r1 = (e) => {
  if (!e)
    return { ...Vc };
  try {
    const t = JSON.parse(e);
    return Xg(t);
  } catch {
    return { ...Vc };
  }
}, s1 = (e) => {
  const t = Xg(e);
  return JSON.stringify(t);
}, o1 = (e) => {
  const t = t1();
  return {
    load: () => r1(t.getItem(cu)),
    save: (n) => {
      t.setItem(cu, s1(n));
    },
    clear: () => {
      t.removeItem(cu);
    }
  };
}, i1 = "https://browser.blockstack.org/auth", a1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Yg = ["store_write"], c1 = "blockstack-session", l1 = {
  logLevel: "debug"
}, qo = {
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
Object.freeze(qo);
class qi extends Error {
  constructor(t) {
    super();
    let n = t.message, r = `Error Code: ${t.code}`, o = this.stack;
    if (o)
      r += `Stack Trace:
${o}`;
    else
      try {
        throw new Error();
      } catch (s) {
        o = s.stack;
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
class u1 extends qi {
  constructor(t, n = "") {
    super({ code: qo.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class Zh extends qi {
  constructor(t = "") {
    super({ code: qo.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class ec extends qi {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: qo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Jh extends qi {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: qo.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class Xu extends qi {
  constructor(t) {
    super({ code: qo.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class qg extends qi {
  constructor(t) {
    super({ code: qo.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const Qh = ["debug", "info", "warn", "error", "none"], Yu = {};
for (let e = 0; e < Qh.length; e++) {
  const t = Qh[e];
  Yu[t] = e;
}
class Ei {
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
    return Yu[l1.logLevel] <= Yu[t];
  }
}
function d1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function f1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function lu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((o) => parseInt(o, 10)), r = t.split(".").map((o) => parseInt(o, 10));
  for (let o = 0; o < t.length; o++)
    if (o >= e.length && r.push(0), n[o] < r[o])
      return !1;
  return !0;
}
function h1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function p1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function g1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function tf(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = p1(), o) {
      const s = o[e];
      if (s)
        return s;
    }
  } catch (s) {
    Ei.error(`Error getting object '${e}' from global scope '${o}': ${s}`);
  }
  if (t) {
    const s = g1(o, e.toString(), n);
    throw Ei.error(s), new Error(s);
  }
  if (r)
    return {};
}
function co(e, t) {
  return nf(Ln(e), t);
}
function Ln(e) {
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
  if (qn(e, Uint8Array))
    return BigInt(`0x${Te(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function y1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function ep(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Fa(e, t = 8) {
  return (typeof e == "bigint" ? e : Ln(e)).toString(16).padStart(t * 2, "0");
}
function kl(e) {
  return parseInt(e, 16);
}
function nf(e, t = 16) {
  const n = Fa(e, t);
  return pt(n);
}
function w1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function m1(e, t) {
  return e & BigInt(1) << t;
}
function qu(e) {
  return b1(BigInt(`0x${Te(e)}`), BigInt(e.byteLength * 8));
}
function b1(e, t) {
  return m1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const x1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Te(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += x1[n];
  return t;
}
function pt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = y1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function Wo(e) {
  return new TextEncoder().encode(e);
}
function ja(e) {
  return new TextDecoder().decode(e);
}
function S1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function v1(e) {
  return String.fromCharCode.apply(null, e);
}
function E1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function tp(e) {
  if (e.some(E1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Qr(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function nn(e) {
  return Qr(...e.map((t) => typeof t == "number" ? tp([t]) : t instanceof Array ? tp(t) : t));
}
function qn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const Wg = "https://api.mainnet.hiro.so", Zg = "https://api.testnet.hiro.so", Jg = "http://localhost:3999", A1 = "https://hub.blockstack.org", k1 = 33, uu = 32;
function $1(e) {
  if (e.length < uu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + uu * 2), r = e.slice(2 + uu * 2);
  return {
    recoveryId: kl(t),
    r: n,
    s: r
  };
}
function rf(e) {
  const t = typeof e == "string" ? pt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function I1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function L1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function C1(e, t) {
  return e[t];
}
function T1(e, t, n = 0) {
  return e[n] = t, e;
}
function B1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function _o(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const N1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function M1(e, t) {
  const n = {};
  return Object.assign(n, N1, t), await fetch(e, n);
}
function _1(e) {
  let t = M1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function P1(...e) {
  const { fetchLib: t, middlewares: n } = _1(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
class Qg {
  constructor(t = Yg.slice(), n = ((a) => (a = tf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", o = "/manifest.json", s = void 0, i = i1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Wu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function U1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function ey(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function O1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wu(e.outputLen), Wu(e.blockLen);
}
function H1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function D1(e, t) {
  ey(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Eo = {
  number: Wu,
  bool: U1,
  bytes: ey,
  hash: O1,
  exists: H1,
  output: D1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const du = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Rr = (e, t) => e << 32 - t | e >>> t, F1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!F1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function j1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function sf(e) {
  if (typeof e == "string" && (e = j1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let ty = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Zo(e) {
  const t = (r) => e().update(sf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let ny = class extends ty {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Eo.hash(t);
    const r = sf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Eo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Eo.exists(this), Eo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const $l = (e, t, n) => new ny(e, t).update(n).digest();
$l.create = (e, t) => new ny(e, t);
function R1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + f, a, r);
}
let of = class extends ty {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = du(this.buffer);
  }
  update(t) {
    Eo.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = sf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = du(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Eo.exists(this), Eo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let h = i; h < o; h++)
      n[h] = 0;
    R1(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = du(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, g = this.get();
    if (f > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < f; h++)
      a.setUint32(4 * h, g[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const z1 = (e, t, n) => e & t ^ ~e & n, G1 = (e, t, n) => e & t ^ e & n ^ t & n, K1 = new Uint32Array([
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
]), Ts = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Bs = new Uint32Array(64);
let ry = class extends of {
  constructor() {
    super(64, 32, 8, !1), this.A = Ts[0] | 0, this.B = Ts[1] | 0, this.C = Ts[2] | 0, this.D = Ts[3] | 0, this.E = Ts[4] | 0, this.F = Ts[5] | 0, this.G = Ts[6] | 0, this.H = Ts[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Bs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Bs[h - 15], y = Bs[h - 2], x = Rr(w, 7) ^ Rr(w, 18) ^ w >>> 3, S = Rr(y, 17) ^ Rr(y, 19) ^ y >>> 10;
      Bs[h] = S + Bs[h - 7] + x + Bs[h - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: f, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = Rr(a, 6) ^ Rr(a, 11) ^ Rr(a, 25), y = g + w + z1(a, c, f) + K1[h] + Bs[h] | 0, S = (Rr(r, 2) ^ Rr(r, 13) ^ Rr(r, 22)) + G1(r, o, s) | 0;
      g = f, f = c, c = a, a = i + y | 0, i = s, s = o, o = r, r = y + S | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, g = g + this.H | 0, this.set(r, o, s, i, a, c, f, g);
  }
  roundClean() {
    Bs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, V1 = class extends ry {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mi = Zo(() => new ry());
Zo(() => new V1());
const X1 = {}, sy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: X1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const dt = BigInt(0), Ht = BigInt(1), ro = BigInt(2), xa = BigInt(3), np = BigInt(8), It = Object.freeze({
  a: dt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ht,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), rp = (e, t) => (e + t / ro) / t, tc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = It, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ht * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), a = rp(s * e, t), c = rp(-r * e, t);
    let f = fe(e - a * n - c * o, t), g = fe(-a * r - c * s, t);
    const h = f > i, w = g > i;
    if (h && (f = t - f), w && (g = t - g), f > i || g > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: h, k1: f, k2neg: w, k2: g };
  }
}, _r = 32, Po = 32, oy = 32, Xc = _r + 1, Yc = 2 * _r + 1;
function sp(e) {
  const { a: t, b: n } = It, r = fe(e * e), o = fe(r * e);
  return fe(o + t * e + n);
}
const nc = It.a === dt;
class af extends Error {
  constructor(t) {
    super(t);
  }
}
function op(e) {
  if (!(e instanceof mt))
    throw new TypeError("JacobianPoint expected");
}
class mt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof nt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(nt.ZERO) ? mt.ZERO : new mt(t.x, t.y, Ht);
  }
  static toAffineBatch(t) {
    const n = J1(t.map((r) => r.z));
    return t.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(t) {
    return mt.toAffineBatch(t).map(mt.fromAffine);
  }
  equals(t) {
    op(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t, c = fe(o * o), f = fe(a * a), g = fe(n * f), h = fe(s * c), w = fe(fe(r * a) * f), y = fe(fe(i * o) * c);
    return g === h && w === y;
  }
  negate() {
    return new mt(this.x, fe(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, o = fe(t * t), s = fe(n * n), i = fe(s * s), a = t + s, c = fe(ro * (fe(a * a) - o - i)), f = fe(xa * o), g = fe(f * f), h = fe(g - ro * c), w = fe(f * (c - h) - np * i), y = fe(ro * n * r);
    return new mt(h, w, y);
  }
  add(t) {
    op(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: a } = t;
    if (s === dt || i === dt)
      return this;
    if (n === dt || r === dt)
      return t;
    const c = fe(o * o), f = fe(a * a), g = fe(n * f), h = fe(s * c), w = fe(fe(r * a) * f), y = fe(fe(i * o) * c), x = fe(h - g), S = fe(y - w);
    if (x === dt)
      return S === dt ? this.double() : mt.ZERO;
    const C = fe(x * x), B = fe(x * C), P = fe(g * C), v = fe(S * S - B - ro * P), T = fe(S * (P - v) - w * B), _ = fe(o * a * x);
    return new mt(v, T, _);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = mt.ZERO;
    if (typeof t == "bigint" && t === dt)
      return n;
    let r = cp(t);
    if (r === Ht)
      return this;
    if (!nc) {
      let h = n, w = this;
      for (; r > dt; )
        r & Ht && (h = h.add(w)), w = w.double(), r >>= Ht;
      return h;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: a } = tc.splitScalar(r), c = n, f = n, g = this;
    for (; s > dt || a > dt; )
      s & Ht && (c = c.add(g)), a & Ht && (f = f.add(g)), g = g.double(), s >>= Ht, a >>= Ht;
    return o && (c = c.negate()), i && (f = f.negate()), f = new mt(fe(f.x * tc.beta), f.y, f.z), c.add(f);
  }
  precomputeWindow(t) {
    const n = nc ? 128 / t + 1 : 256 / t + 1, r = [];
    let o = this, s = o;
    for (let i = 0; i < n; i++) {
      s = o, r.push(s);
      for (let a = 1; a < 2 ** (t - 1); a++)
        s = s.add(o), r.push(s);
      o = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(mt.BASE) && (n = nt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && Zu.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = mt.normalizeZ(o), Zu.set(n, o)));
    let s = mt.ZERO, i = mt.BASE;
    const a = 1 + (nc ? 128 / r : 256 / r), c = 2 ** (r - 1), f = BigInt(2 ** r - 1), g = 2 ** r, h = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let x = Number(t & f);
      t >>= h, x > c && (x -= g, t += Ht);
      const S = y, C = y + Math.abs(x) - 1, B = w % 2 !== 0, P = x < 0;
      x === 0 ? i = i.add(rc(B, o[S])) : s = s.add(rc(P, o[C]));
    }
    return { p: s, f: i };
  }
  multiply(t, n) {
    let r = cp(t), o, s;
    if (nc) {
      const { k1neg: i, k1: a, k2neg: c, k2: f } = tc.splitScalar(r);
      let { p: g, f: h } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(f, n);
      g = rc(i, g), w = rc(c, w), w = new mt(fe(w.x * tc.beta), w.y, w.z), o = g.add(w), s = h.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      o = i, s = a;
    }
    return mt.normalizeZ([o, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: o } = this, s = this.equals(mt.ZERO);
    t == null && (t = s ? np : Wi(o));
    const i = t, a = fe(i * i), c = fe(a * i), f = fe(n * a), g = fe(r * c), h = fe(o * i);
    if (s)
      return nt.ZERO;
    if (h !== Ht)
      throw new Error("invZ was invalid");
    return new nt(f, g);
  }
}
mt.BASE = new mt(It.Gx, It.Gy, Ht);
mt.ZERO = new mt(dt, Ht, dt);
function rc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const Zu = /* @__PURE__ */ new WeakMap();
class nt {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, Zu.delete(this);
  }
  hasEvenY() {
    return this.y % ro === dt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = cr(n ? t : t.subarray(1));
    if (!Pc(r))
      throw new Error("Point is not on curve");
    const o = sp(r);
    let s = Z1(o);
    const i = (s & Ht) === Ht;
    n ? i && (s = fe(-s)) : (t[0] & 1) === 1 !== i && (s = fe(-s));
    const a = new nt(r, s);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = cr(t.subarray(1, _r + 1)), r = cr(t.subarray(_r + 1, _r * 2 + 1)), o = new nt(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(t) {
    const n = es(t), r = n.length, o = n[0];
    if (r === _r)
      return this.fromCompressedHex(n);
    if (r === Xc && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === Yc && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Xc} compressed bytes or ${Yc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return nt.BASE.multiply(Uo(t));
  }
  static fromSignature(t, n, r) {
    const { r: o, s } = cy(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = cf(es(t)), { n: a } = It, c = r === 2 || r === 3 ? o + a : o, f = Wi(c, a), g = fe(-i * f, a), h = fe(s * f, a), w = r & 1 ? "03" : "02", y = nt.fromHex(w + so(c)), x = nt.BASE.multiplyAndAddUnsafe(y, g, h);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(t = !1) {
    return oo(this.toHex(t));
  }
  toHex(t = !1) {
    const n = so(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${so(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Pc(n) || !Pc(r))
      throw new Error(t);
    const o = fe(r * r), s = sp(n);
    if (fe(o - s) !== dt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new nt(this.x, fe(-this.y));
  }
  double() {
    return mt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return mt.fromAffine(this).add(mt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return mt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const o = mt.fromAffine(this), s = n === dt || n === Ht || this !== nt.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = mt.fromAffine(t).multiplyUnsafe(r), a = s.add(i);
    return a.equals(mt.ZERO) ? void 0 : a.toAffine();
  }
}
nt.BASE = new nt(It.Gx, It.Gy);
nt.ZERO = new nt(dt, dt);
function ip(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function ap(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${_i(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: cr(n), left: e.subarray(t + 2) };
}
function Y1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${_i(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = ap(e.subarray(2)), { data: r, left: o } = ap(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${_i(o)}`);
  return { r: t, s: r };
}
class ar {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const o = n ? _i(t) : t;
    if (o.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new ar(qc(o.slice(0, 64)), qc(o.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = Y1(n ? t : oo(t));
    return new ar(r, o);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Ui(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ui(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = It.n >> Ht;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new ar(this.r, fe(-this.s, It.n)) : this;
  }
  toDERRawBytes() {
    return oo(this.toDERHex());
  }
  toDERHex() {
    const t = ip(la(this.s)), n = ip(la(this.r)), r = t.length / 2, o = n.length / 2, s = la(r), i = la(o);
    return `30${la(o + r + 4)}02${i}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return oo(this.toCompactHex());
  }
  toCompactHex() {
    return so(this.r) + so(this.s);
  }
}
function to(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
const q1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function _i(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += q1[e[n]];
  return t;
}
const W1 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function so(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(dt <= e && e < W1))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Pi(e) {
  const t = oo(so(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function la(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function qc(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function oo(e) {
  if (typeof e != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof e);
  if (e.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + e.length);
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function cr(e) {
  return qc(_i(e));
}
function es(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : oo(e);
}
function cp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Ui(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function fe(e, t = It.P) {
  const n = e % t;
  return n >= dt ? n : t + n;
}
function hr(e, t) {
  const { P: n } = It;
  let r = e;
  for (; t-- > dt; )
    r *= r, r %= n;
  return r;
}
function Z1(e) {
  const { P: t } = It, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, f = c * c * e % t, g = hr(f, xa) * f % t, h = hr(g, xa) * f % t, w = hr(h, ro) * c % t, y = hr(w, r) * w % t, x = hr(y, o) * y % t, S = hr(x, i) * x % t, C = hr(S, a) * S % t, B = hr(C, i) * x % t, P = hr(B, xa) * f % t, v = hr(P, s) * y % t, T = hr(v, n) * c % t, _ = hr(T, ro);
  if (_ * _ % t !== e)
    throw new Error("Cannot find square root");
  return _;
}
function Wi(e, t = It.P) {
  if (e === dt || t <= dt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = fe(e, t), r = t, o = dt, s = Ht;
  for (; n !== dt; ) {
    const a = r / n, c = r % n, f = o - s * a;
    r = n, n = c, o = s, s = f;
  }
  if (r !== Ht)
    throw new Error("invert: does not exist");
  return fe(o, t);
}
function J1(e, t = It.P) {
  const n = new Array(e.length), r = e.reduce((s, i, a) => i === dt ? s : (n[a] = s, fe(s * i, t)), Ht), o = Wi(r, t);
  return e.reduceRight((s, i, a) => i === dt ? s : (n[a] = fe(s * n[a], t), fe(s * i, t)), o), n;
}
function Q1(e) {
  const t = e.length * 8 - Po * 8, n = cr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function cf(e, t = !1) {
  const n = Q1(e);
  if (t)
    return n;
  const { n: r } = It;
  return n >= r ? n - r : n;
}
let Ci, Sa;
class iy {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return qt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return Sa(this.k, ...t);
  }
  checkSync() {
    if (typeof Sa != "function")
      throw new af("hmacSha256Sync needs to be set");
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
    return to(...n);
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
    return to(...n);
  }
}
function Ui(e) {
  return dt < e && e < It.n;
}
function Pc(e) {
  return dt < e && e < It.P;
}
function ay(e, t, n, r = !0) {
  const { n: o } = It, s = cf(e, !0);
  if (!Ui(s))
    return;
  const i = Wi(s, o), a = nt.BASE.multiply(s), c = fe(a.x, o);
  if (c === dt)
    return;
  const f = fe(i * fe(t + n * c, o), o);
  if (f === dt)
    return;
  let g = new ar(c, f), h = (a.x === g.r ? 0 : 2) | Number(a.y & Ht);
  return r && g.hasHighS() && (g = g.normalizeS(), h ^= 1), { sig: g, recovery: h };
}
function Uo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Po)
      throw new Error("Expected 32 bytes of private key");
    t = qc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Po)
      throw new Error("Expected 32 bytes of private key");
    t = cr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ui(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function lf(e) {
  return e instanceof nt ? (e.assertValidity(), e) : nt.fromHex(e);
}
function cy(e) {
  if (e instanceof ar)
    return e.assertValidity(), e;
  try {
    return ar.fromDER(e);
  } catch {
    return ar.fromCompact(e);
  }
}
function Ra(e, t = !1) {
  return nt.fromPrivateKey(e).toRawBytes(t);
}
function e2(e, t, n, r = !1) {
  return nt.fromSignature(e, t, n).toRawBytes(r);
}
function lp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Xc || r === Yc : n ? r === Xc * 2 || r === Yc * 2 : e instanceof nt;
}
function uf(e, t, n = !1) {
  if (lp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!lp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = lf(t);
  return r.assertValidity(), r.multiply(Uo(e)).toRawBytes(n);
}
function ly(e) {
  const t = e.length > _r ? e.slice(0, _r) : e;
  return cr(t);
}
function t2(e) {
  const t = ly(e), n = fe(t, It.n);
  return uy(n < dt ? t : n);
}
function uy(e) {
  return Pi(e);
}
function dy(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = es(e), o = Uo(t), s = [uy(o), t2(r)];
  if (n != null) {
    n === !0 && (n = qt.randomBytes(_r));
    const c = es(n);
    if (c.length !== _r)
      throw new Error(`sign: Expected ${_r} bytes of extra data`);
    s.push(c);
  }
  const i = to(...s), a = ly(r);
  return { seed: i, m: a, d: o };
}
function fy(e, t) {
  const { sig: n, recovery: r } = e, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function n2(e, t, n = {}) {
  const { seed: r, m: o, d: s } = dy(e, t, n.extraEntropy), i = new iy(oy, Po);
  await i.reseed(r);
  let a;
  for (; !(a = ay(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return fy(a, n);
}
function Il(e, t, n = {}) {
  const { seed: r, m: o, d: s } = dy(e, t, n.extraEntropy), i = new iy(oy, Po);
  i.reseedSync(r);
  let a;
  for (; !(a = ay(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return fy(a, n);
}
const r2 = { strict: !0 };
function s2(e, t, n, r = r2) {
  let o;
  try {
    o = cy(e), t = es(t);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const a = cf(t);
  let c;
  try {
    c = lf(n);
  } catch {
    return !1;
  }
  const { n: f } = It, g = Wi(i, f), h = fe(a * g, f), w = fe(s * g, f), y = nt.BASE.multiplyAndAddUnsafe(c, h, w);
  return y ? fe(y.x, f) === s : !1;
}
function Wc(e) {
  return fe(cr(e), It.n);
}
class Oi {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = es(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = cr(n.subarray(0, 32)), o = cr(n.subarray(32, 64));
    return new Oi(r, o);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Pc(t) || !Ui(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return so(this.r) + so(this.s);
  }
  toRawBytes() {
    return oo(this.toHex());
  }
}
function o2(e) {
  return nt.fromPrivateKey(e).toRawX();
}
class hy {
  constructor(t, n, r = qt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = es(t);
    const { x: o, scalar: s } = this.getScalar(Uo(n));
    if (this.px = o, this.d = s, this.rand = es(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = nt.fromPrivateKey(t), r = n.hasEvenY() ? t : It.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Pi(t ^ cr(n));
  }
  finalizeNonce(t) {
    const n = fe(cr(t), It.n);
    if (n === dt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: o, scalar: s } = this.getScalar(n);
    return { R: r, rx: o, k: s };
  }
  finalizeSig(t, n, r, o) {
    return new Oi(t.x, fe(n + r * o, It.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: o } = this, s = qt.taggedHash, i = this.initNonce(n, await s(eo.aux, o)), { R: a, rx: c, k: f } = this.finalizeNonce(await s(eo.nonce, i, r, t)), g = Wc(await s(eo.challenge, c, r, t)), h = this.finalizeSig(a, f, g, n);
    return await yy(h, t, r) || this.error(), h;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: o } = this, s = qt.taggedHashSync, i = this.initNonce(n, s(eo.aux, o)), { R: a, rx: c, k: f } = this.finalizeNonce(s(eo.nonce, i, r, t)), g = Wc(s(eo.challenge, c, r, t)), h = this.finalizeSig(a, f, g, n);
    return wy(h, t, r) || this.error(), h;
  }
}
async function i2(e, t, n) {
  return new hy(e, t, n).calc();
}
function a2(e, t, n) {
  return new hy(e, t, n).calcSync();
}
function py(e, t, n) {
  const r = e instanceof Oi, o = r ? e : Oi.fromHex(e);
  return r && o.assertValidity(), {
    ...o,
    m: es(t),
    P: lf(n)
  };
}
function gy(e, t, n, r) {
  const o = nt.BASE.multiplyAndAddUnsafe(t, Uo(n), fe(-r, It.n));
  return !(!o || !o.hasEvenY() || o.x !== e);
}
async function yy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = py(e, t, n), a = Wc(await qt.taggedHash(eo.challenge, Pi(r), i.toRawX(), s));
    return gy(r, i, o, a);
  } catch {
    return !1;
  }
}
function wy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = py(e, t, n), a = Wc(qt.taggedHashSync(eo.challenge, Pi(r), i.toRawX(), s));
    return gy(r, i, o, a);
  } catch (r) {
    if (r instanceof af)
      throw r;
    return !1;
  }
}
const c2 = {
  Signature: Oi,
  getPublicKey: o2,
  sign: i2,
  verify: yy,
  signSync: a2,
  verifySync: wy
};
nt.BASE._setWindowSize(8);
const tr = {
  node: sy,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, eo = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, sc = {}, qt = {
  bytesToHex: _i,
  hexToBytes: oo,
  concatBytes: to,
  mod: fe,
  invert: Wi,
  isValidPrivateKey(e) {
    try {
      return Uo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Pi,
  _normalizePrivateKey: Uo,
  hashToPrivateKey: (e) => {
    e = es(e);
    const t = Po + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = fe(cr(e), It.n - Ht) + Ht;
    return Pi(n);
  },
  randomBytes: (e = 32) => {
    if (tr.web)
      return tr.web.getRandomValues(new Uint8Array(e));
    if (tr.node) {
      const { randomBytes: t } = tr.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => qt.hashToPrivateKey(qt.randomBytes(Po + 8)),
  precompute(e = 8, t = nt.BASE) {
    const n = t === nt.BASE ? t : new nt(t.x, t.y);
    return n._setWindowSize(e), n.multiply(xa), n;
  },
  sha256: async (...e) => {
    if (tr.web) {
      const t = await tr.web.subtle.digest("SHA-256", to(...e));
      return new Uint8Array(t);
    } else if (tr.node) {
      const { createHash: t } = tr.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (tr.web) {
      const n = await tr.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = to(...t), o = await tr.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(o);
    } else if (tr.node) {
      const { createHmac: n } = tr.node, r = n("sha256", e);
      return t.forEach((o) => r.update(o)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = sc[e];
    if (n === void 0) {
      const r = await qt.sha256(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = to(r, r), sc[e] = n;
    }
    return qt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Ci != "function")
      throw new af("sha256Sync is undefined, you need to set it");
    let n = sc[e];
    if (n === void 0) {
      const r = Ci(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = to(r, r), sc[e] = n;
    }
    return Ci(n, ...t);
  },
  _JacobianPoint: mt
};
Object.defineProperties(qt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ci;
    },
    set(e) {
      Ci || (Ci = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Sa;
    },
    set(e) {
      Sa || (Sa = e);
    }
  }
});
const l2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: It,
  Point: nt,
  Signature: ar,
  getPublicKey: Ra,
  getSharedSecret: uf,
  recoverPublicKey: e2,
  schnorr: c2,
  sign: n2,
  signSync: Il,
  utils: qt,
  verify: s2
}, Symbol.toStringTag, { value: "Module" }));
var za = {};
za.byteLength = p2;
var u2 = za.toByteArray = y2, d2 = za.fromByteArray = b2, Xr = [], yr = [], f2 = typeof Uint8Array < "u" ? Uint8Array : Array, fu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var gi = 0, h2 = fu.length; gi < h2; ++gi)
  Xr[gi] = fu[gi], yr[fu.charCodeAt(gi)] = gi;
yr[45] = 62;
yr[95] = 63;
function my(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function p2(e) {
  var t = my(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function g2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function y2(e) {
  var t, n = my(e), r = n[0], o = n[1], s = new f2(g2(e, r, o)), i = 0, a = o > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = yr[e.charCodeAt(c)] << 18 | yr[e.charCodeAt(c + 1)] << 12 | yr[e.charCodeAt(c + 2)] << 6 | yr[e.charCodeAt(c + 3)], s[i++] = t >> 16 & 255, s[i++] = t >> 8 & 255, s[i++] = t & 255;
  return o === 2 && (t = yr[e.charCodeAt(c)] << 2 | yr[e.charCodeAt(c + 1)] >> 4, s[i++] = t & 255), o === 1 && (t = yr[e.charCodeAt(c)] << 10 | yr[e.charCodeAt(c + 1)] << 4 | yr[e.charCodeAt(c + 2)] >> 2, s[i++] = t >> 8 & 255, s[i++] = t & 255), s;
}
function w2(e) {
  return Xr[e >> 18 & 63] + Xr[e >> 12 & 63] + Xr[e >> 6 & 63] + Xr[e & 63];
}
function m2(e, t, n) {
  for (var r, o = [], s = t; s < n; s += 3)
    r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (e[s + 2] & 255), o.push(w2(r));
  return o.join("");
}
function b2(e) {
  for (var t, n = e.length, r = n % 3, o = [], s = 16383, i = 0, a = n - r; i < a; i += s)
    o.push(m2(e, i, i + s > a ? a : i + s));
  return r === 1 ? (t = e[n - 1], o.push(
    Xr[t >> 2] + Xr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], o.push(
    Xr[t >> 10] + Xr[t >> 4 & 63] + Xr[t << 2 & 63] + "="
  )), o.join("");
}
function x2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const S2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function v2() {
  if (x2())
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
    throw new Error(S2);
  }
}
class E2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createCipher(t, n, r), i = new Uint8Array(Qr(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createDecipher(t, n, r), i = new Uint8Array(Qr(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class A2 {
  constructor(t) {
    this.subtleCrypto = t;
  }
  async encrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["encrypt"]), c = await this.subtleCrypto.encrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
  async decrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const a = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["decrypt"]), c = await this.subtleCrypto.decrypt({ name: s, iv: r }, a, o);
    return new Uint8Array(c);
  }
}
async function by() {
  const e = await v2();
  return e.name === "subtleCrypto" ? new A2(e.lib) : new E2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function k2(e) {
  if (e.length >= 255)
    throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), n = 0; n < t.length; n++)
    t[n] = 255;
  for (var r = 0; r < e.length; r++) {
    var o = e.charAt(r), s = o.charCodeAt(0);
    if (t[s] !== 255)
      throw new TypeError(o + " is ambiguous");
    t[s] = r;
  }
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), f = Math.log(256) / Math.log(i);
  function g(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var x = 0, S = 0, C = 0, B = y.length; C !== B && y[C] === 0; )
      C++, x++;
    for (var P = (B - C) * f + 1 >>> 0, v = new Uint8Array(P); C !== B; ) {
      for (var T = y[C], _ = 0, K = P - 1; (T !== 0 || _ < S) && K !== -1; K--, _++)
        T += 256 * v[K] >>> 0, v[K] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      S = _, C++;
    }
    for (var se = P - S; se !== P && v[se] === 0; )
      se++;
    for (var Q = a.repeat(x); se < P; ++se)
      Q += e.charAt(v[se]);
    return Q;
  }
  function h(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var x = 0, S = 0, C = 0; y[x] === a; )
      S++, x++;
    for (var B = (y.length - x) * c + 1 >>> 0, P = new Uint8Array(B); y[x]; ) {
      var v = y.charCodeAt(x);
      if (v > 255)
        return;
      var T = t[v];
      if (T === 255)
        return;
      for (var _ = 0, K = B - 1; (T !== 0 || _ < C) && K !== -1; K--, _++)
        T += i * P[K] >>> 0, P[K] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      C = _, x++;
    }
    for (var se = B - C; se !== B && P[se] === 0; )
      se++;
    for (var Q = new Uint8Array(S + (B - se)), V = S; se !== B; )
      Q[V++] = P[se++];
    return Q;
  }
  function w(y) {
    var x = h(y);
    if (x)
      return x;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: g,
    decodeUnsafe: h,
    decode: w
  };
}
var xy = k2;
const $2 = xy, I2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var L2 = $2(I2);
const C2 = /* @__PURE__ */ Gg(L2), T2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Sy = Uint8Array.from({ length: 16 }, (e, t) => t), B2 = Sy.map((e) => (9 * e + 5) % 16);
let df = [Sy], ff = [B2];
for (let e = 0; e < 4; e++)
  for (let t of [df, ff])
    t.push(t[e].map((n) => T2[n]));
const vy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), N2 = df.map((e, t) => e.map((n) => vy[t][n])), M2 = ff.map((e, t) => e.map((n) => vy[t][n])), _2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), P2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oc = (e, t) => e << t | e >>> 32 - t;
function up(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const ic = new Uint32Array(16);
let U2 = class extends of {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      ic[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, f = this.h3 | 0, g = f, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const x = 4 - y, S = _2[y], C = P2[y], B = df[y], P = ff[y], v = N2[y], T = M2[y];
      for (let _ = 0; _ < 16; _++) {
        const K = oc(r + up(y, s, a, f) + ic[B[_]] + S, v[_]) + h | 0;
        r = h, h = f, f = oc(a, 10) | 0, a = s, s = K;
      }
      for (let _ = 0; _ < 16; _++) {
        const K = oc(o + up(x, i, c, g) + ic[P[_]] + C, T[_]) + w | 0;
        o = w, w = g, g = oc(c, 10) | 0, c = i, i = K;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + f + w | 0, this.h3 + h + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const O2 = Zo(() => new U2());
function H2(e) {
  return O2(e);
}
const ac = BigInt(2 ** 32 - 1), Ju = BigInt(32);
function Ey(e, t = !1) {
  return t ? { h: Number(e & ac), l: Number(e >> Ju & ac) } : { h: Number(e >> Ju & ac) | 0, l: Number(e & ac) | 0 };
}
function D2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Ey(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const F2 = (e, t) => BigInt(e >>> 0) << Ju | BigInt(t >>> 0), j2 = (e, t, n) => e >>> n, R2 = (e, t, n) => e << 32 - n | t >>> n, z2 = (e, t, n) => e >>> n | t << 32 - n, G2 = (e, t, n) => e << 32 - n | t >>> n, K2 = (e, t, n) => e << 64 - n | t >>> n - 32, V2 = (e, t, n) => e >>> n - 32 | t << 64 - n, X2 = (e, t) => t, Y2 = (e, t) => e, q2 = (e, t, n) => e << n | t >>> 32 - n, W2 = (e, t, n) => t << n | e >>> 32 - n, Z2 = (e, t, n) => t << n - 32 | e >>> 64 - n, J2 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Q2(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const ex = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), tx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, nx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), rx = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, sx = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), ox = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Ye = {
  fromBig: Ey,
  split: D2,
  toBig: F2,
  shrSH: j2,
  shrSL: R2,
  rotrSH: z2,
  rotrSL: G2,
  rotrBH: K2,
  rotrBL: V2,
  rotr32H: X2,
  rotr32L: Y2,
  rotlSH: q2,
  rotlSL: W2,
  rotlBH: Z2,
  rotlBL: J2,
  add: Q2,
  add3L: ex,
  add3H: tx,
  add4L: nx,
  add4H: rx,
  add5H: ox,
  add5L: sx
}, [ix, ax] = Ye.split([
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
].map((e) => BigInt(e))), Ns = new Uint32Array(80), Ms = new Uint32Array(80);
let Ll = class extends of {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: f, El: g, Fh: h, Fl: w, Gh: y, Gl: x, Hh: S, Hl: C } = this;
    return [t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Ns[v] = t.getUint32(n), Ms[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = Ns[v - 15] | 0, _ = Ms[v - 15] | 0, K = Ye.rotrSH(T, _, 1) ^ Ye.rotrSH(T, _, 8) ^ Ye.shrSH(T, _, 7), se = Ye.rotrSL(T, _, 1) ^ Ye.rotrSL(T, _, 8) ^ Ye.shrSL(T, _, 7), Q = Ns[v - 2] | 0, V = Ms[v - 2] | 0, m = Ye.rotrSH(Q, V, 19) ^ Ye.rotrBH(Q, V, 61) ^ Ye.shrSH(Q, V, 6), I = Ye.rotrSL(Q, V, 19) ^ Ye.rotrBL(Q, V, 61) ^ Ye.shrSL(Q, V, 6), N = Ye.add4L(se, I, Ms[v - 7], Ms[v - 16]), M = Ye.add4H(N, K, m, Ns[v - 7], Ns[v - 16]);
      Ns[v] = M | 0, Ms[v] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: f, Dl: g, Eh: h, El: w, Fh: y, Fl: x, Gh: S, Gl: C, Hh: B, Hl: P } = this;
    for (let v = 0; v < 80; v++) {
      const T = Ye.rotrSH(h, w, 14) ^ Ye.rotrSH(h, w, 18) ^ Ye.rotrBH(h, w, 41), _ = Ye.rotrSL(h, w, 14) ^ Ye.rotrSL(h, w, 18) ^ Ye.rotrBL(h, w, 41), K = h & y ^ ~h & S, se = w & x ^ ~w & C, Q = Ye.add5L(P, _, se, ax[v], Ms[v]), V = Ye.add5H(Q, B, T, K, ix[v], Ns[v]), m = Q | 0, I = Ye.rotrSH(r, o, 28) ^ Ye.rotrBH(r, o, 34) ^ Ye.rotrBH(r, o, 39), N = Ye.rotrSL(r, o, 28) ^ Ye.rotrBL(r, o, 34) ^ Ye.rotrBL(r, o, 39), M = r & s ^ r & a ^ s & a, X = o & i ^ o & c ^ i & c;
      B = S | 0, P = C | 0, S = y | 0, C = x | 0, y = h | 0, x = w | 0, { h, l: w } = Ye.add(f | 0, g | 0, V | 0, m | 0), f = a | 0, g = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const F = Ye.add3L(m, N, X);
      r = Ye.add3H(F, V, I, M), o = F | 0;
    }
    ({ h: r, l: o } = Ye.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Ye.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Ye.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: g } = Ye.add(this.Dh | 0, this.Dl | 0, f | 0, g | 0), { h, l: w } = Ye.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: x } = Ye.add(this.Fh | 0, this.Fl | 0, y | 0, x | 0), { h: S, l: C } = Ye.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: B, l: P } = Ye.add(this.Hh | 0, this.Hl | 0, B | 0, P | 0), this.set(r, o, s, i, a, c, f, g, h, w, y, x, S, C, B, P);
  }
  roundClean() {
    Ns.fill(0), Ms.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, cx = class extends Ll {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, lx = class extends Ll {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ux = class extends Ll {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const dx = Zo(() => new Ll());
Zo(() => new cx());
Zo(() => new lx());
Zo(() => new ux());
function Ay(e) {
  return Mi(e);
}
function fx(e) {
  return dx(e);
}
const hx = 0;
qt.hmacSha256Sync = (e, ...t) => {
  const n = $l.create(Mi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function px() {
  return Te(qt.randomPrivateKey());
}
function gx(e) {
  const t = Mi(Mi(e));
  return C2.encode(Qr(e, t).slice(0, e.length + 4));
}
function yx(e, t) {
  return gx(Qr(new Uint8Array([e]), t.slice(0, 20)));
}
function ky(e, t = hx) {
  const n = typeof e == "string" ? pt(e) : e, r = H2(Ay(n));
  return yx(t, r);
}
function $y(e) {
  const t = rf(e);
  return Te(Ra(t.slice(0, 32), !0));
}
qt.hmacSha256Sync = (e, ...t) => {
  const n = $l.create(Mi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var Zc;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(Zc || (Zc = {}));
async function wx(e, t, n) {
  return await (await by()).encrypt("aes-256-cbc", t, e, n);
}
async function mx(e, t, n) {
  return await (await by()).decrypt("aes-256-cbc", t, e, n);
}
function Iy(e, t) {
  return $l(Mi, e, t);
}
function bx(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Ly(e) {
  const t = fx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function xx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Sx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Zc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Zc.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !xx(e))
    return t;
  try {
    return nt.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function vx(e, t, n, r) {
  const o = Sx(e);
  if (!o.result)
    throw o;
  const s = qt.randomPrivateKey(), i = Ra(s, !0);
  let a = uf(s, e, !0);
  a = a.slice(1);
  const c = Ly(a), f = qt.randomBytes(16), g = await wx(f, c.encryptionKey, t), h = Qr(f, i, g), w = Iy(c.hmacKey, h);
  let y;
  if (!r || r === "hex")
    y = Te(g);
  else if (r === "base64")
    y = d2(g);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: Te(f),
    ephemeralPK: Te(i),
    cipherText: y,
    mac: Te(w),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function Cy(e, t) {
  if (!t.ephemeralPK)
    throw new Jh("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = uf(e, n, !0);
  r = r.slice(1);
  const o = Ly(r), s = pt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = pt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = u2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = Qr(s, pt(n), i), c = Iy(o.hmacKey, a), f = pt(t.mac);
  if (!bx(f, c))
    throw new Jh("Decryption failed: failure in MAC check");
  const g = await mx(s, o.encryptionKey, i);
  return t.wasString ? ja(g) : g;
}
function Ex(e, t) {
  const n = typeof t == "string" ? Wo(t) : t, r = $y(e), o = Ay(n), s = Il(o, e);
  return {
    signature: Te(s),
    publicKey: r
  };
}
async function Ax(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = $y(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", s = typeof e == "string" ? Wo(e) : e, i = await vx(n.publicKey, s, o, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Ex(r, a), f = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(f);
  }
  return a;
}
function kx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Cy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var vn = {}, Hi = {}, Un = {};
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.decode = Un.encode = Un.unescape = Un.escape = Un.pad = void 0;
const Ty = za;
function hf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Un.pad = hf;
function By(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Un.escape = By;
function Ny(e) {
  return hf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Un.unescape = Ny;
function $x(e) {
  return By((0, Ty.fromByteArray)(new TextEncoder().encode(e)));
}
Un.encode = $x;
function Ix(e) {
  return new TextDecoder().decode((0, Ty.toByteArray)(hf(Ny(e))));
}
Un.decode = Ix;
var Cl = {}, Tl = {}, My = {}, _y = {}, Bl = {};
Object.defineProperty(Bl, "__esModule", { value: !0 });
Bl.crypto = void 0;
Bl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = o, e.ahash = s, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = f, e.clean = g, e.createView = h, e.rotr = w, e.rotl = y, e.byteSwap = x, e.byteSwap32 = S, e.bytesToHex = P, e.hexToBytes = _, e.asyncLoop = se, e.utf8ToBytes = Q, e.bytesToUtf8 = V, e.toBytes = m, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = M, e.createHasher = F, e.createOptHasher = oe, e.createXOFer = ie, e.randomBytes = Fe;
  const t = Bl;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function o($, ...D) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (D.length > 0 && !D.includes($.length))
      throw new Error("Uint8Array expected of length " + D + ", got length=" + $.length);
  }
  function s($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function i($, D = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (D && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, D) {
    o($);
    const ce = D.outputLen;
    if ($.length < ce)
      throw new Error("digestInto() expects output buffer of length at least " + ce);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function f($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function g(...$) {
    for (let D = 0; D < $.length; D++)
      $[D].fill(0);
  }
  function h($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function w($, D) {
    return $ << 32 - D | $ >>> D;
  }
  function y($, D) {
    return $ << D | $ >>> 32 - D >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? ($) => $ : ($) => x($), e.byteSwapIfBE = e.swap8IfBE;
  function S($) {
    for (let D = 0; D < $.length; D++)
      $[D] = x($[D]);
    return $;
  }
  e.swap32IfBE = e.isLE ? ($) => $ : S;
  const C = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", B = /* @__PURE__ */ Array.from({ length: 256 }, ($, D) => D.toString(16).padStart(2, "0"));
  function P($) {
    if (o($), C)
      return $.toHex();
    let D = "";
    for (let ce = 0; ce < $.length; ce++)
      D += B[$[ce]];
    return D;
  }
  const v = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T($) {
    if ($ >= v._0 && $ <= v._9)
      return $ - v._0;
    if ($ >= v.A && $ <= v.F)
      return $ - (v.A - 10);
    if ($ >= v.a && $ <= v.f)
      return $ - (v.a - 10);
  }
  function _($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (C)
      return Uint8Array.fromHex($);
    const D = $.length, ce = D / 2;
    if (D % 2)
      throw new Error("hex string expected, got unpadded hex of length " + D);
    const ye = new Uint8Array(ce);
    for (let Be = 0, Ne = 0; Be < ce; Be++, Ne += 2) {
      const Pt = T($.charCodeAt(Ne)), He = T($.charCodeAt(Ne + 1));
      if (Pt === void 0 || He === void 0) {
        const Se = $[Ne] + $[Ne + 1];
        throw new Error('hex string expected, got non-hex character "' + Se + '" at index ' + Ne);
      }
      ye[Be] = Pt * 16 + He;
    }
    return ye;
  }
  const K = async () => {
  };
  e.nextTick = K;
  async function se($, D, ce) {
    let ye = Date.now();
    for (let Be = 0; Be < $; Be++) {
      ce(Be);
      const Ne = Date.now() - ye;
      Ne >= 0 && Ne < D || (await (0, e.nextTick)(), ye += Ne);
    }
  }
  function Q($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function V($) {
    return new TextDecoder().decode($);
  }
  function m($) {
    return typeof $ == "string" && ($ = Q($)), o($), $;
  }
  function I($) {
    return typeof $ == "string" && ($ = Q($)), o($), $;
  }
  function N(...$) {
    let D = 0;
    for (let ye = 0; ye < $.length; ye++) {
      const Be = $[ye];
      o(Be), D += Be.length;
    }
    const ce = new Uint8Array(D);
    for (let ye = 0, Be = 0; ye < $.length; ye++) {
      const Ne = $[ye];
      ce.set(Ne, Be), Be += Ne.length;
    }
    return ce;
  }
  function M($, D) {
    if (D !== void 0 && {}.toString.call(D) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, D);
  }
  class X {
  }
  e.Hash = X;
  function F($) {
    const D = (ye) => $().update(m(ye)).digest(), ce = $();
    return D.outputLen = ce.outputLen, D.blockLen = ce.blockLen, D.create = () => $(), D;
  }
  function oe($) {
    const D = (ye, Be) => $(Be).update(m(ye)).digest(), ce = $({});
    return D.outputLen = ce.outputLen, D.blockLen = ce.blockLen, D.create = (ye) => $(ye), D;
  }
  function ie($) {
    const D = (ye, Be) => $(Be).update(m(ye)).digest(), ce = $({});
    return D.outputLen = ce.outputLen, D.blockLen = ce.blockLen, D.create = (ye) => $(ye), D;
  }
  e.wrapConstructor = F, e.wrapConstructorWithOpts = oe, e.wrapXOFConstructorWithOpts = ie;
  function Fe($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(_y);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = _y;
  class n extends t.Hash {
    constructor(s, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(s);
      const a = (0, t.toBytes)(i);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, f = new Uint8Array(c);
      f.set(a.length > c ? s.create().update(a).digest() : a);
      for (let g = 0; g < f.length; g++)
        f[g] ^= 54;
      this.iHash.update(f), this.oHash = s.create();
      for (let g = 0; g < f.length; g++)
        f[g] ^= 106;
      this.oHash.update(f), (0, t.clean)(f);
    }
    update(s) {
      return (0, t.aexists)(this), this.iHash.update(s), this;
    }
    digestInto(s) {
      (0, t.aexists)(this), (0, t.abytes)(s, this.outputLen), this.finished = !0, this.iHash.digestInto(s), this.oHash.update(s), this.oHash.digestInto(s), this.destroy();
    }
    digest() {
      const s = new Uint8Array(this.oHash.outputLen);
      return this.digestInto(s), s;
    }
    _cloneInto(s) {
      s || (s = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash: i, iHash: a, finished: c, destroyed: f, blockLen: g, outputLen: h } = this;
      return s = s, s.finished = c, s.destroyed = f, s.blockLen = g, s.outputLen = h, s.oHash = i._cloneInto(s.oHash), s.iHash = a._cloneInto(s.iHash), s;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
    }
  }
  e.HMAC = n;
  const r = (o, s, i) => new n(o, s).update(i).digest();
  e.hmac = r, e.hmac.create = (o, s) => new n(o, s);
})(My);
const yi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Py(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function Qu(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function Jo(e, ...t) {
  if (!Py(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Lx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Qu(e.outputLen), Qu(e.blockLen);
}
function ed(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function Uy(e, t) {
  Jo(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Cx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function Tx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function Jc(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Uc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Ir(e, t) {
  return e << 32 - t | e >>> t;
}
function Bx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const pf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function gf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Oy = pf ? (e) => e : (e) => gf(e), Nx = Oy;
function Hy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = gf(e[t]);
  return e;
}
const Mx = pf ? (e) => e : Hy, Dy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", _x = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function yf(e) {
  if (Jo(e), Dy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += _x[e[n]];
  return t;
}
const hs = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function dp(e) {
  if (e >= hs._0 && e <= hs._9)
    return e - hs._0;
  if (e >= hs.A && e <= hs.F)
    return e - (hs.A - 10);
  if (e >= hs.a && e <= hs.f)
    return e - (hs.a - 10);
}
function Px(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Dy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = dp(e.charCodeAt(s)), a = dp(e.charCodeAt(s + 1));
    if (i === void 0 || a === void 0) {
      const c = e[s] + e[s + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + s);
    }
    r[o] = i * 16 + a;
  }
  return r;
}
const Fy = async () => {
};
async function Ux(e, t, n) {
  let r = Date.now();
  for (let o = 0; o < e; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < t || (await Fy(), r += s);
  }
}
function wf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Ox(e) {
  return new TextDecoder().decode(e);
}
function Ga(e) {
  return typeof e == "string" && (e = wf(e)), Jo(e), e;
}
function Hx(e) {
  return typeof e == "string" && (e = wf(e)), Jo(e), e;
}
function Dx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    Jo(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Fx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let jy = class {
};
function Nl(e) {
  const t = (r) => e().update(Ga(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Ry(e) {
  const t = (r, o) => e(o).update(Ga(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function zy(e) {
  const t = (r, o) => e(o).update(Ga(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const jx = Nl, Rx = Ry, zx = zy;
function Gx(e = 32) {
  if (yi && typeof yi.getRandomValues == "function")
    return yi.getRandomValues(new Uint8Array(e));
  if (yi && typeof yi.randomBytes == "function")
    return Uint8Array.from(yi.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Kx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: jy,
  abytes: Jo,
  aexists: ed,
  ahash: Lx,
  anumber: Qu,
  aoutput: Uy,
  asyncLoop: Ux,
  byteSwap: gf,
  byteSwap32: Hy,
  byteSwapIfBE: Nx,
  bytesToHex: yf,
  bytesToUtf8: Ox,
  checkOpts: Fx,
  clean: Jc,
  concatBytes: Dx,
  createHasher: Nl,
  createOptHasher: Ry,
  createView: Uc,
  createXOFer: zy,
  hexToBytes: Px,
  isBytes: Py,
  isLE: pf,
  kdfInputToBytes: Hx,
  nextTick: Fy,
  randomBytes: Gx,
  rotl: Bx,
  rotr: Ir,
  swap32IfBE: Mx,
  swap8IfBE: Oy,
  toBytes: Ga,
  u32: Tx,
  u8: Cx,
  utf8ToBytes: wf,
  wrapConstructor: jx,
  wrapConstructorWithOpts: Rx,
  wrapXOFConstructorWithOpts: zx
}, Symbol.toStringTag, { value: "Module" }));
function Vx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + f, a, r);
}
function Xx(e, t, n) {
  return e & t ^ ~e & n;
}
function Yx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class qx extends jy {
  constructor(t, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(t), this.view = Uc(this.buffer);
  }
  update(t) {
    ed(this), t = Ga(t), Jo(t);
    const { view: n, buffer: r, blockLen: o } = this, s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Uc(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    ed(this), Uy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, Jc(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let h = i; h < o; h++)
      n[h] = 0;
    Vx(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Uc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, g = this.get();
    if (f > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < f; h++)
      a.setUint32(4 * h, g[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.destroyed = i, t.finished = s, t.length = o, t.pos = a, o % n && t.buffer.set(r), t;
  }
  clone() {
    return this._cloneInto();
  }
}
const _s = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ps = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), Wx = /* @__PURE__ */ Uint32Array.from([
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
]), Us = /* @__PURE__ */ new Uint32Array(64);
let mf = class extends qx {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = _s[0] | 0, this.B = _s[1] | 0, this.C = _s[2] | 0, this.D = _s[3] | 0, this.E = _s[4] | 0, this.F = _s[5] | 0, this.G = _s[6] | 0, this.H = _s[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Us[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Us[h - 15], y = Us[h - 2], x = Ir(w, 7) ^ Ir(w, 18) ^ w >>> 3, S = Ir(y, 17) ^ Ir(y, 19) ^ y >>> 10;
      Us[h] = S + Us[h - 7] + x + Us[h - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: f, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = Ir(a, 6) ^ Ir(a, 11) ^ Ir(a, 25), y = g + w + Xx(a, c, f) + Wx[h] + Us[h] | 0, S = (Ir(r, 2) ^ Ir(r, 13) ^ Ir(r, 22)) + Yx(r, o, s) | 0;
      g = f, f = c, c = a, a = i + y | 0, i = s, s = o, o = r, r = y + S | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, g = g + this.H | 0, this.set(r, o, s, i, a, c, f, g);
  }
  roundClean() {
    Jc(Us);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Jc(this.buffer);
  }
}, Gy = class extends mf {
  constructor() {
    super(28), this.A = Ps[0] | 0, this.B = Ps[1] | 0, this.C = Ps[2] | 0, this.D = Ps[3] | 0, this.E = Ps[4] | 0, this.F = Ps[5] | 0, this.G = Ps[6] | 0, this.H = Ps[7] | 0;
  }
};
const Zx = /* @__PURE__ */ Nl(() => new mf()), Jx = /* @__PURE__ */ Nl(() => new Gy()), Qx = mf, bf = Zx, eS = Gy, tS = Jx, nS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: eS,
  SHA256: Qx,
  sha224: tS,
  sha256: bf
}, Symbol.toStringTag, { value: "Module" })), Ml = /* @__PURE__ */ Al(nS), rS = /* @__PURE__ */ Al(l2);
var Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.joseToDer = Di.derToJose = void 0;
const Ky = za, Vy = Un;
function hu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const sS = {
  ES256: hu(256),
  ES384: hu(384),
  ES512: hu(521)
};
function Xy(e) {
  const t = sS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const Qc = 128, Yy = 0, oS = 32, iS = 16, aS = 2, qy = iS | oS | Yy << 6, el = aS | Yy << 6;
function Wy(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, Ky.toByteArray)((0, Vy.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function cS(e, t) {
  const n = Wy(e), r = Xy(t), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== qy)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (Qc | 1) && (a = n[i++]), s - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${s - i}" remaining`);
  if (n[i++] !== el)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (s - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${s - i - 2}" available`);
  if (o < c)
    throw new Error(`"r" specified length of "${c}", max of "${o}" is acceptable`);
  const f = i;
  if (i += c, n[i++] !== el)
    throw new Error('Could not find expected "int" for "s"');
  const g = n[i++];
  if (s - i !== g)
    throw new Error(`"s" specified length of "${g}", expected "${s - i}"`);
  if (o < g)
    throw new Error(`"s" specified length of "${g}", max of "${o}" is acceptable`);
  const h = i;
  if (i += g, i !== s)
    throw new Error(`Expected to consume entire array, but "${s - i}" bytes remain`);
  const w = r - c, y = r - g, x = new Uint8Array(w + c + y + g);
  for (i = 0; i < w; ++i)
    x[i] = 0;
  x.set(n.subarray(f + Math.max(-w, 0), f + c), i), i = r;
  for (const S = i; i < S + y; ++i)
    x[i] = 0;
  return x.set(n.subarray(h + Math.max(-y, 0), h + g), i), (0, Vy.escape)((0, Ky.fromByteArray)(x));
}
Di.derToJose = cS;
function fp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= Qc && --r, r;
}
function lS(e, t) {
  e = Wy(e);
  const n = Xy(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = fp(e, 0, n), s = fp(e, n, e.length), i = n - o, a = n - s, c = 2 + i + 1 + 1 + a, f = c < Qc, g = new Uint8Array((f ? 2 : 3) + c);
  let h = 0;
  return g[h++] = qy, f ? g[h++] = c : (g[h++] = Qc | 1, g[h++] = c & 255), g[h++] = el, g[h++] = i, o < 0 ? (g[h++] = 0, g.set(e.subarray(0, n), h), h += n) : (g.set(e.subarray(o, n), h), h += n - o), g[h++] = el, g[h++] = a, s < 0 ? (g[h++] = 0, g.set(e.subarray(n), h)) : g.set(e.subarray(n + s), h), g;
}
Di.joseToDer = lS;
var vs = {};
Object.defineProperty(vs, "__esModule", { value: !0 });
vs.InvalidTokenError = vs.MissingParametersError = void 0;
class uS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
vs.MissingParametersError = uS;
class dS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
vs.InvalidTokenError = dS;
const Ka = /* @__PURE__ */ Al(Kx);
Object.defineProperty(Tl, "__esModule", { value: !0 });
Tl.SECP256K1Client = void 0;
const fS = My, hS = Ml, Oc = rS, hp = Di, pp = vs, gp = Ka;
Oc.utils.hmacSha256Sync = (e, ...t) => {
  const n = fS.hmac.create(hS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class Zy {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, gp.bytesToHex)(Oc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new pp.MissingParametersError("a signing input hash and private key are all required");
    const o = Oc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, gp.bytesToHex)(o);
    if (r === "jose")
      return (0, hp.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, hp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new pp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Oc.verify(n, t, r, { strict: !1 });
  }
}
Tl.SECP256K1Client = Zy;
Zy.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Tl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Cl);
var Oo = {};
const pS = /* @__PURE__ */ Al(sy);
var gS = Hn && Hn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(g) {
      try {
        f(r.next(g));
      } catch (h) {
        i(h);
      }
    }
    function c(g) {
      try {
        f(r.throw(g));
      } catch (h) {
        i(h);
      }
    }
    function f(g) {
      g.done ? s(g.value) : o(g.value).then(a, c);
    }
    f((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Oo, "__esModule", { value: !0 });
Oo.hashSha256Async = Oo.hashSha256 = void 0;
const yS = Ml;
function Jy(e) {
  return (0, yS.sha256)(e);
}
Oo.hashSha256 = Jy;
function wS(e) {
  return gS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = pS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Jy(e));
    }
  });
}
Oo.hashSha256Async = wS;
var mS = Hn && Hn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function a(g) {
      try {
        f(r.next(g));
      } catch (h) {
        i(h);
      }
    }
    function c(g) {
      try {
        f(r.throw(g));
      } catch (h) {
        i(h);
      }
    }
    function f(g) {
      g.done ? s(g.value) : o(g.value).then(a, c);
    }
    f((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.TokenSigner = Hi.createUnsecuredToken = void 0;
const td = Un, yp = Cl, bS = vs, wp = Oo;
function nd(e, t) {
  const n = [], r = td.encode(JSON.stringify(t));
  n.push(r);
  const o = td.encode(JSON.stringify(e));
  return n.push(o), n.join(".");
}
function xS(e) {
  return nd(e, { typ: "JWT", alg: "none" }) + ".";
}
Hi.createUnsecuredToken = xS;
class SS {
  constructor(t, n) {
    if (!(t && n))
      throw new bS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !yp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = yp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const o = this.header(r), s = nd(t, o), i = (0, wp.hashSha256)(s);
    return this.createWithSignedHash(t, n, o, s, i);
  }
  signAsync(t, n = !1, r = {}) {
    return mS(this, void 0, void 0, function* () {
      const o = this.header(r), s = nd(t, o), i = yield (0, wp.hashSha256Async)(s);
      return this.createWithSignedHash(t, n, o, s, i);
    });
  }
  createWithSignedHash(t, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [td.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [o, i].join(".");
  }
}
Hi.TokenSigner = SS;
var _l = {};
Object.defineProperty(_l, "__esModule", { value: !0 });
_l.TokenVerifier = void 0;
const vS = Un, mp = Cl, ES = vs, cc = Oo;
class AS {
  constructor(t, n) {
    if (!(t && n))
      throw new ES.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !mp.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = mp.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), o = r[0] + "." + r[1], s = (i) => {
      const a = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, a, this.rawPublicKey);
    };
    if (n)
      return (0, cc.hashSha256Async)(o).then((i) => s(i));
    {
      const i = (0, cc.hashSha256)(o);
      return s(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), vS.encode(t.payload)].join(".");
    let o = !0;
    const s = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (o = !1);
    }), o);
    if (n)
      return (0, cc.hashSha256Async)(r).then((i) => s(i));
    {
      const i = (0, cc.hashSha256)(r);
      return s(i);
    }
  }
}
_l.TokenVerifier = AS;
var Pl = {};
Object.defineProperty(Pl, "__esModule", { value: !0 });
Pl.decodeToken = void 0;
const lc = Un;
function kS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(lc.decode(t[0])), r = JSON.parse(lc.decode(t[1])), o = t[2];
    return {
      header: n,
      payload: r,
      signature: o
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = lc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const o = JSON.parse(lc.decode(r));
      n.push(o);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Pl.decodeToken = kS;
(function(e) {
  var t = Hn && Hn.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var a = Object.getOwnPropertyDescriptor(o, s);
    (!a || ("get" in a ? !o.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, a);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = Hn && Hn.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && t(o, r, s);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(Hi, e), n(_l, e), n(Pl, e), n(vs, e), n(Cl, e);
})(vn);
function $S(e) {
  return `did:btc-addr:${e}`;
}
function IS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new Zh("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new Zh('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function Qy(e) {
  if (e)
    return IS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const LS = "1.4.0";
function CS() {
  return px();
}
function TS(e, t, n, r = Yg.slice(), o, s = d1().getTime(), i = {}) {
  const a = (y) => {
    const x = tf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), o || (o = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: h1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: t,
    version: LS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), f = vn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [f];
  const g = ky(f);
  return c.iss = $S(g), new vn.TokenSigner("ES256k", e).sign(c);
}
async function bp(e, t) {
  const n = ja(pt(t)), r = JSON.parse(n), o = await Cy(e, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function BS(e) {
  const t = vn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new vn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function NS(e) {
  const t = vn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = Qy(t.iss);
  if (n.length === 1) {
    if (ky(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function MS(e) {
  const t = vn.decodeToken(e).payload;
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
function _S(e) {
  const t = vn.decodeToken(e).payload;
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
function PS(e) {
  const t = [
    _S(e),
    MS(e),
    BS(e),
    NS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const xp = "1.0.0";
class io {
  constructor(t) {
    this.version = xp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== xp)
      throw new Xu(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new io(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class ew {
  constructor(t) {
    if (t) {
      const n = new io(t);
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
class Sp extends ew {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new io({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new qg("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new io({})), !0;
  }
}
class vp extends ew {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = c1, !localStorage.getItem(this.key)) {
      const r = new io({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new qg("No session data was found in localStorage");
    const n = JSON.parse(t);
    return io.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new io({})), !0;
  }
}
var La;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(La || (La = {}));
var tl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(tl || (tl = {}));
La.Mainnet;
var bs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(bs || (bs = {}));
var Wr;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wr || (Wr = {}));
bs.Mainnet;
const tw = {
  chainId: La.Mainnet,
  transactionVersion: bs.Mainnet,
  peerNetworkId: tl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Wr.MainnetSingleSig,
    multiSig: Wr.MainnetMultiSig
  },
  client: { baseUrl: Wg }
}, rd = {
  chainId: La.Testnet,
  transactionVersion: bs.Testnet,
  peerNetworkId: tl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Wr.TestnetSingleSig,
    multiSig: Wr.TestnetMultiSig
  },
  client: { baseUrl: Zg }
}, Hc = {
  ...rd,
  addressVersion: { ...rd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Jg }
}, US = {
  ...Hc,
  addressVersion: { ...Hc.addressVersion },
  client: { ...Hc.client }
};
function OS(e) {
  switch (e) {
    case "mainnet":
      return tw;
    case "testnet":
      return rd;
    case "devnet":
      return Hc;
    case "mocknet":
      return US;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function nw(e) {
  return typeof e == "string" ? OS(e) : e;
}
var Ep;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ep || (Ep = {}));
var Ap;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Ap || (Ap = {}));
var Lr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Lr || (Lr = {}));
const pu = ["onChainOnly", "offChainOnly", "any"];
pu[0] + "", Lr.OnChainOnly, pu[1] + "", Lr.OffChainOnly, pu[2] + "", Lr.Any, Lr.OnChainOnly + "", Lr.OnChainOnly, Lr.OffChainOnly + "", Lr.OffChainOnly, Lr.Any + "", Lr.Any;
var kp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(kp || (kp = {}));
var $p;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})($p || ($p = {}));
var Ip;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Ip || (Ip = {}));
var ws;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ws || (ws = {}));
var Lp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Lp || (Lp = {}));
var Cp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Cp || (Cp = {}));
var Tp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Tp || (Tp = {}));
var Bp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Bp || (Bp = {}));
var Np;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Np || (Np = {}));
var Mp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Mp || (Mp = {}));
var _p;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(_p || (_p = {}));
var Pp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Pp || (Pp = {}));
var Up;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Up || (Up = {}));
function sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function HS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function rw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function DS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  sd(e.outputLen), sd(e.blockLen);
}
function FS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function jS(e, t) {
  rw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ao = {
  number: sd,
  bool: HS,
  bytes: rw,
  hash: DS,
  exists: FS,
  output: jS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), zr = (e, t) => e << 32 - t | e >>> t, RS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!RS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function zS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function xf(e) {
  if (typeof e == "string" && (e = zS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let sw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Qo(e) {
  const t = (r) => e().update(xf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let ow = class extends sw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ao.hash(t);
    const r = xf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Ao.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ao.exists(this), Ao.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const iw = (e, t, n) => new ow(e, t).update(n).digest();
iw.create = (e, t) => new ow(e, t);
function GS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + f, a, r);
}
let Sf = class extends sw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = gu(this.buffer);
  }
  update(t) {
    Ao.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = xf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = gu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ao.exists(this), Ao.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let h = i; h < o; h++)
      n[h] = 0;
    GS(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = gu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, g = this.get();
    if (f > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < f; h++)
      a.setUint32(4 * h, g[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const KS = (e, t, n) => e & t ^ ~e & n, VS = (e, t, n) => e & t ^ e & n ^ t & n, XS = new Uint32Array([
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
]), Os = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Hs = new Uint32Array(64);
let aw = class extends Sf {
  constructor() {
    super(64, 32, 8, !1), this.A = Os[0] | 0, this.B = Os[1] | 0, this.C = Os[2] | 0, this.D = Os[3] | 0, this.E = Os[4] | 0, this.F = Os[5] | 0, this.G = Os[6] | 0, this.H = Os[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Hs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Hs[h - 15], y = Hs[h - 2], x = zr(w, 7) ^ zr(w, 18) ^ w >>> 3, S = zr(y, 17) ^ zr(y, 19) ^ y >>> 10;
      Hs[h] = S + Hs[h - 7] + x + Hs[h - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: f, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = zr(a, 6) ^ zr(a, 11) ^ zr(a, 25), y = g + w + KS(a, c, f) + XS[h] + Hs[h] | 0, S = (zr(r, 2) ^ zr(r, 13) ^ zr(r, 22)) + VS(r, o, s) | 0;
      g = f, f = c, c = a, a = i + y | 0, i = s, s = o, o = r, r = y + S | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, g = g + this.H | 0, this.set(r, o, s, i, a, c, f, g);
  }
  roundClean() {
    Hs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, YS = class extends aw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const cw = Qo(() => new aw());
Qo(() => new YS());
var ei = {}, vf = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = Ka;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], f = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (f < 4) {
        const x = n.indexOf(i[y]) >> f;
        let S = 0;
        y !== 0 && (S = n.indexOf(i[y - 1]));
        const C = 1 + f, B = S % (1 << C) << 5 - C, P = e.c32[x + B];
        f = C, c.unshift(P);
      } else
        f = 0;
    let g = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      g++;
    c = c.slice(g);
    const h = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = h ? h[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let x = 0; x < y; x++)
        c.unshift(e.c32[0]);
    }
    return c.join("");
  }
  e.c32encode = r;
  function o(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = o;
  function s(i, a) {
    if (i = o(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const c = i.match(`^${e.c32[0]}*`), f = c ? c[0].length : 0;
    let g = [], h = 0, w = 0;
    for (let S = i.length - 1; S >= 0; S--) {
      w === 4 && (g.unshift(n[h]), w = 0, h = 0);
      const B = (e.c32.indexOf(i[S]) << w) + h, P = n[B % 16];
      if (w += 1, h = B >> 4, h > 1 << w)
        throw new Error("Panic error in decoding.");
      g.unshift(P);
    }
    g.unshift(n[h]), g.length % 2 === 1 && g.unshift("0");
    let y = 0;
    for (let S = 0; S < g.length && g[S] === "0"; S++)
      y++;
    g = g.slice(y - y % 2);
    let x = g.join("");
    for (let S = 0; S < f; S++)
      x = `00${x}`;
    if (a) {
      const S = a * 2 - x.length;
      for (let C = 0; C < S; C += 2)
        x = `00${x}`;
    }
    return x;
  }
  e.c32decode = s;
})(vf);
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.c32checkDecode = Ho.c32checkEncode = void 0;
const Op = Ml, Hp = Ka, va = vf;
function lw(e) {
  const t = (0, Op.sha256)((0, Op.sha256)((0, Hp.hexToBytes)(e)));
  return (0, Hp.bytesToHex)(t.slice(0, 4));
}
function qS(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = lw(`${n}${t}`), o = (0, va.c32encode)(`${t}${r}`);
  return `${va.c32[e]}${o}`;
}
Ho.c32checkEncode = qS;
function WS(e) {
  e = (0, va.c32normalize)(e);
  const t = (0, va.c32decode)(e.slice(1)), n = e[0], r = va.c32.indexOf(n), o = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), lw(`${s}${t.substring(0, t.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Ho.c32checkDecode = WS;
var uw = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.decode = Fi.encode = void 0;
const nl = Ml, Dp = Ka, dw = xy, fw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function ZS(e, t = "00") {
  const n = typeof e == "string" ? (0, Dp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Dp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, nl.sha256)((0, nl.sha256)(new Uint8Array([...r, ...n])));
  return dw(fw).encode([...r, ...n, ...o.slice(0, 4)]);
}
Fi.encode = ZS;
function JS(e) {
  const t = dw(fw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), o = (0, nl.sha256)((0, nl.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Fi.decode = JS;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Ho, n = Fi, r = Ka;
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
  const o = {};
  o[0] = e.versions.mainnet.p2pkh, o[5] = e.versions.mainnet.p2sh, o[111] = e.versions.testnet.p2pkh, o[196] = e.versions.testnet.p2sh;
  const s = {};
  s[e.versions.mainnet.p2pkh] = 0, s[e.versions.mainnet.p2sh] = 5, s[e.versions.testnet.p2pkh] = 111, s[e.versions.testnet.p2sh] = 196;
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
    const w = n.decode(g), y = (0, r.bytesToHex)(w.data), x = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let S;
    return h < 0 ? (S = x, o[x] !== void 0 && (S = o[x])) : S = h, i(S, y);
  }
  e.b58ToC32 = c;
  function f(g, h = -1) {
    const w = a(g), y = w[0], x = w[1];
    let S;
    h < 0 ? (S = y, s[y] !== void 0 && (S = s[y])) : S = h;
    let C = S.toString(16);
    return C.length === 1 && (C = `0${C}`), n.encode(x, C);
  }
  e.c32ToB58 = f;
})(uw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = vf;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Ho;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = uw;
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
})(ei);
function QS(e, t) {
  switch (t = nw(t ?? tw), e) {
    case ws.P2PKH:
      switch (t.transactionVersion) {
        case bs.Mainnet:
          return Wr.MainnetSingleSig;
        case bs.Testnet:
          return Wr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case ws.P2SH:
    case ws.P2SHNonSequential:
    case ws.P2WPKH:
    case ws.P2WSH:
    case ws.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case bs.Mainnet:
          return Wr.MainnetMultiSig;
        case bs.Testnet:
          return Wr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const ev = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hw = Uint8Array.from({ length: 16 }, (e, t) => t), tv = hw.map((e) => (9 * e + 5) % 16);
let Ef = [hw], Af = [tv];
for (let e = 0; e < 4; e++)
  for (let t of [Ef, Af])
    t.push(t[e].map((n) => ev[n]));
const pw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), nv = Ef.map((e, t) => e.map((n) => pw[t][n])), rv = Af.map((e, t) => e.map((n) => pw[t][n])), sv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ov = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), uc = (e, t) => e << t | e >>> 32 - t;
function Fp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const dc = new Uint32Array(16);
let iv = class extends Sf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      dc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, f = this.h3 | 0, g = f, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const x = 4 - y, S = sv[y], C = ov[y], B = Ef[y], P = Af[y], v = nv[y], T = rv[y];
      for (let _ = 0; _ < 16; _++) {
        const K = uc(r + Fp(y, s, a, f) + dc[B[_]] + S, v[_]) + h | 0;
        r = h, h = f, f = uc(a, 10) | 0, a = s, s = K;
      }
      for (let _ = 0; _ < 16; _++) {
        const K = uc(o + Fp(x, i, c, g) + dc[P[_]] + C, T[_]) + w | 0;
        o = w, w = g, g = uc(c, 10) | 0, c = i, i = K;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + f + w | 0, this.h3 + h + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    dc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const av = Qo(() => new iv()), fc = BigInt(2 ** 32 - 1), od = BigInt(32);
function gw(e, t = !1) {
  return t ? { h: Number(e & fc), l: Number(e >> od & fc) } : { h: Number(e >> od & fc) | 0, l: Number(e & fc) | 0 };
}
function cv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = gw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const lv = (e, t) => BigInt(e >>> 0) << od | BigInt(t >>> 0), uv = (e, t, n) => e >>> n, dv = (e, t, n) => e << 32 - n | t >>> n, fv = (e, t, n) => e >>> n | t << 32 - n, hv = (e, t, n) => e << 32 - n | t >>> n, pv = (e, t, n) => e << 64 - n | t >>> n - 32, gv = (e, t, n) => e >>> n - 32 | t << 64 - n, yv = (e, t) => t, wv = (e, t) => e, mv = (e, t, n) => e << n | t >>> 32 - n, bv = (e, t, n) => t << n | e >>> 32 - n, xv = (e, t, n) => t << n - 32 | e >>> 64 - n, Sv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function vv(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Ev = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Av = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, kv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), $v = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, Iv = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Lv = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, qe = {
  fromBig: gw,
  split: cv,
  toBig: lv,
  shrSH: uv,
  shrSL: dv,
  rotrSH: fv,
  rotrSL: hv,
  rotrBH: pv,
  rotrBL: gv,
  rotr32H: yv,
  rotr32L: wv,
  rotlSH: mv,
  rotlSL: bv,
  rotlBH: xv,
  rotlBL: Sv,
  add: vv,
  add3L: Ev,
  add3H: Av,
  add4L: kv,
  add4H: $v,
  add5H: Lv,
  add5L: Iv
}, [Cv, Tv] = qe.split([
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
].map((e) => BigInt(e))), Ds = new Uint32Array(80), Fs = new Uint32Array(80);
let Ul = class extends Sf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: f, El: g, Fh: h, Fl: w, Gh: y, Gl: x, Hh: S, Hl: C } = this;
    return [t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Ds[v] = t.getUint32(n), Fs[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = Ds[v - 15] | 0, _ = Fs[v - 15] | 0, K = qe.rotrSH(T, _, 1) ^ qe.rotrSH(T, _, 8) ^ qe.shrSH(T, _, 7), se = qe.rotrSL(T, _, 1) ^ qe.rotrSL(T, _, 8) ^ qe.shrSL(T, _, 7), Q = Ds[v - 2] | 0, V = Fs[v - 2] | 0, m = qe.rotrSH(Q, V, 19) ^ qe.rotrBH(Q, V, 61) ^ qe.shrSH(Q, V, 6), I = qe.rotrSL(Q, V, 19) ^ qe.rotrBL(Q, V, 61) ^ qe.shrSL(Q, V, 6), N = qe.add4L(se, I, Fs[v - 7], Fs[v - 16]), M = qe.add4H(N, K, m, Ds[v - 7], Ds[v - 16]);
      Ds[v] = M | 0, Fs[v] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: f, Dl: g, Eh: h, El: w, Fh: y, Fl: x, Gh: S, Gl: C, Hh: B, Hl: P } = this;
    for (let v = 0; v < 80; v++) {
      const T = qe.rotrSH(h, w, 14) ^ qe.rotrSH(h, w, 18) ^ qe.rotrBH(h, w, 41), _ = qe.rotrSL(h, w, 14) ^ qe.rotrSL(h, w, 18) ^ qe.rotrBL(h, w, 41), K = h & y ^ ~h & S, se = w & x ^ ~w & C, Q = qe.add5L(P, _, se, Tv[v], Fs[v]), V = qe.add5H(Q, B, T, K, Cv[v], Ds[v]), m = Q | 0, I = qe.rotrSH(r, o, 28) ^ qe.rotrBH(r, o, 34) ^ qe.rotrBH(r, o, 39), N = qe.rotrSL(r, o, 28) ^ qe.rotrBL(r, o, 34) ^ qe.rotrBL(r, o, 39), M = r & s ^ r & a ^ s & a, X = o & i ^ o & c ^ i & c;
      B = S | 0, P = C | 0, S = y | 0, C = x | 0, y = h | 0, x = w | 0, { h, l: w } = qe.add(f | 0, g | 0, V | 0, m | 0), f = a | 0, g = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const F = qe.add3L(m, N, X);
      r = qe.add3H(F, V, I, M), o = F | 0;
    }
    ({ h: r, l: o } = qe.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = qe.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: g } = qe.add(this.Dh | 0, this.Dl | 0, f | 0, g | 0), { h, l: w } = qe.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: x } = qe.add(this.Fh | 0, this.Fl | 0, y | 0, x | 0), { h: S, l: C } = qe.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: B, l: P } = qe.add(this.Hh | 0, this.Hl | 0, B | 0, P | 0), this.set(r, o, s, i, a, c, f, g, h, w, y, x, S, C, B, P);
  }
  roundClean() {
    Ds.fill(0), Fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Bv = class extends Ul {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Nv = class extends Ul {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Mv = class extends Ul {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Qo(() => new Ul());
Qo(() => new Bv());
Qo(() => new Nv());
Qo(() => new Mv());
var rl = { exports: {} };
rl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", f = "[object Error]", g = "[object Function]", h = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", x = "[object Object]", S = "[object Promise]", C = "[object RegExp]", B = "[object Set]", P = "[object String]", v = "[object Symbol]", T = "[object WeakMap]", _ = "[object ArrayBuffer]", K = "[object DataView]", se = "[object Float32Array]", Q = "[object Float64Array]", V = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", M = "[object Uint8ClampedArray]", X = "[object Uint16Array]", F = "[object Uint32Array]", oe = /[\\^$.*+?()[\]{}|]/g, ie = /\w*$/, Fe = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, D = {};
  D[s] = D[i] = D[_] = D[K] = D[a] = D[c] = D[se] = D[Q] = D[V] = D[m] = D[I] = D[w] = D[y] = D[x] = D[C] = D[B] = D[P] = D[v] = D[N] = D[M] = D[X] = D[F] = !0, D[f] = D[g] = D[T] = !1;
  var ce = typeof Hn == "object" && Hn && Hn.Object === Object && Hn, ye = typeof self == "object" && self && self.Object === Object && self, Be = ce || ye || Function("return this")(), Ne = t && !t.nodeType && t, Pt = Ne && !0 && e && !e.nodeType && e, He = Pt && Pt.exports === Ne;
  function Se(u, p) {
    return u.set(p[0], p[1]), u;
  }
  function Ce(u, p) {
    return u.add(p), u;
  }
  function dn(u, p) {
    for (var d = -1, L = u ? u.length : 0; ++d < L && p(u[d], d, u) !== !1; )
      ;
    return u;
  }
  function Wt(u, p) {
    for (var d = -1, L = p.length, W = u.length; ++d < L; )
      u[W + d] = p[d];
    return u;
  }
  function ot(u, p, d, L) {
    for (var W = -1, le = u ? u.length : 0; ++W < le; )
      d = p(d, u[W], W, u);
    return d;
  }
  function sn(u, p) {
    for (var d = -1, L = Array(u); ++d < u; )
      L[d] = p(d);
    return L;
  }
  function At(u, p) {
    return u == null ? void 0 : u[p];
  }
  function j(u) {
    var p = !1;
    if (u != null && typeof u.toString != "function")
      try {
        p = !!(u + "");
      } catch {
      }
    return p;
  }
  function O(u) {
    var p = -1, d = Array(u.size);
    return u.forEach(function(L, W) {
      d[++p] = [W, L];
    }), d;
  }
  function ee(u, p) {
    return function(d) {
      return u(p(d));
    };
  }
  function J(u) {
    var p = -1, d = Array(u.size);
    return u.forEach(function(L) {
      d[++p] = L;
    }), d;
  }
  var ae = Array.prototype, ft = Function.prototype, Me = Object.prototype, Pe = Be["__core-js_shared__"], bt = function() {
    var u = /[^.]+$/.exec(Pe && Pe.keys && Pe.keys.IE_PROTO || "");
    return u ? "Symbol(src)_1." + u : "";
  }(), De = ft.toString, Ee = Me.hasOwnProperty, je = Me.toString, ze = RegExp(
    "^" + De.call(Ee).replace(oe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Xe = He ? Be.Buffer : void 0, Lt = Be.Symbol, on = Be.Uint8Array, Cn = ee(Object.getPrototypeOf, Object), fn = Object.create, Ct = Me.propertyIsEnumerable, Tn = ae.splice, Wn = Object.getOwnPropertySymbols, vt = Xe ? Xe.isBuffer : void 0, xr = ee(Object.keys, Object), dr = kr(Be, "DataView"), an = kr(Be, "Map"), _t = kr(Be, "Promise"), cn = kr(Be, "Set"), Et = kr(Be, "WeakMap"), Zt = kr(Object, "create"), ss = Zn(dr), Sr = Zn(an), E = Zn(_t), H = Zn(cn), z = Zn(Et), U = Lt ? Lt.prototype : void 0, q = U ? U.valueOf : void 0;
  function te(u) {
    var p = -1, d = u ? u.length : 0;
    for (this.clear(); ++p < d; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function Ie() {
    this.__data__ = Zt ? Zt(null) : {};
  }
  function be(u) {
    return this.has(u) && delete this.__data__[u];
  }
  function k(u) {
    var p = this.__data__;
    if (Zt) {
      var d = p[u];
      return d === r ? void 0 : d;
    }
    return Ee.call(p, u) ? p[u] : void 0;
  }
  function we(u) {
    var p = this.__data__;
    return Zt ? p[u] !== void 0 : Ee.call(p, u);
  }
  function Le(u, p) {
    var d = this.__data__;
    return d[u] = Zt && p === void 0 ? r : p, this;
  }
  te.prototype.clear = Ie, te.prototype.delete = be, te.prototype.get = k, te.prototype.has = we, te.prototype.set = Le;
  function it(u) {
    var p = -1, d = u ? u.length : 0;
    for (this.clear(); ++p < d; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function ut() {
    this.__data__ = [];
  }
  function rt(u) {
    var p = this.__data__, d = Dr(p, u);
    if (d < 0)
      return !1;
    var L = p.length - 1;
    return d == L ? p.pop() : Tn.call(p, d, 1), !0;
  }
  function Jt(u) {
    var p = this.__data__, d = Dr(p, u);
    return d < 0 ? void 0 : p[d][1];
  }
  function Ft(u) {
    return Dr(this.__data__, u) > -1;
  }
  function jt(u, p) {
    var d = this.__data__, L = Dr(d, u);
    return L < 0 ? d.push([u, p]) : d[L][1] = p, this;
  }
  it.prototype.clear = ut, it.prototype.delete = rt, it.prototype.get = Jt, it.prototype.has = Ft, it.prototype.set = jt;
  function yt(u) {
    var p = -1, d = u ? u.length : 0;
    for (this.clear(); ++p < d; ) {
      var L = u[p];
      this.set(L[0], L[1]);
    }
  }
  function Qe() {
    this.__data__ = {
      hash: new te(),
      map: new (an || it)(),
      string: new te()
    };
  }
  function vr(u) {
    return Ar(this, u).delete(u);
  }
  function at(u) {
    return Ar(this, u).get(u);
  }
  function Rt(u) {
    return Ar(this, u).has(u);
  }
  function fo(u, p) {
    return Ar(this, u).set(u, p), this;
  }
  yt.prototype.clear = Qe, yt.prototype.delete = vr, yt.prototype.get = at, yt.prototype.has = Rt, yt.prototype.set = fo;
  function Fn(u) {
    this.__data__ = new it(u);
  }
  function ks() {
    this.__data__ = new it();
  }
  function jn(u) {
    return this.__data__.delete(u);
  }
  function Bn(u) {
    return this.__data__.get(u);
  }
  function Nn(u) {
    return this.__data__.has(u);
  }
  function ho(u, p) {
    var d = this.__data__;
    if (d instanceof it) {
      var L = d.__data__;
      if (!an || L.length < n - 1)
        return L.push([u, p]), this;
      d = this.__data__ = new yt(L);
    }
    return d.set(u, p), this;
  }
  Fn.prototype.clear = ks, Fn.prototype.delete = jn, Fn.prototype.get = Bn, Fn.prototype.has = Nn, Fn.prototype.set = ho;
  function Mn(u, p) {
    var d = Gn(u) || us(u) ? sn(u.length, String) : [], L = d.length, W = !!L;
    for (var le in u)
      Ee.call(u, le) && !(W && (le == "length" || ct(le, L))) && d.push(le);
    return d;
  }
  function Rn(u, p, d) {
    var L = u[p];
    (!(Ee.call(u, p) && ui(L, d)) || d === void 0 && !(p in u)) && (u[p] = d);
  }
  function Dr(u, p) {
    for (var d = u.length; d--; )
      if (ui(u[d][0], p))
        return d;
    return -1;
  }
  function Fr(u, p) {
    return u && cs(p, me(p), u);
  }
  function $s(u, p, d, L, W, le, he) {
    var xe;
    if (L && (xe = le ? L(u, W, le, he) : L(u)), xe !== void 0)
      return xe;
    if (!G(u))
      return u;
    var xt = Gn(u);
    if (xt) {
      if (xe = mo(u), !p)
        return ii(u, xe);
    } else {
      var Ge = fr(u), Ke = Ge == g || Ge == h;
      if (R(u))
        return hn(u, p);
      if (Ge == x || Ge == s || Ke && !le) {
        if (j(u))
          return le ? u : {};
        if (xe = jr(Ke ? {} : u), !p)
          return ra(u, Fr(xe, u));
      } else {
        if (!D[Ge])
          return le ? u : {};
        xe = ci(u, Ge, $s, p);
      }
    }
    he || (he = new Fn());
    var Re = he.get(u);
    if (Re)
      return Re;
    if (he.set(u, xe), !xt)
      var _e = d ? ai(u) : me(u);
    return dn(_e || u, function(wt, ln) {
      _e && (ln = wt, wt = u[ln]), Rn(xe, ln, $s(wt, p, d, L, ln, u, he));
    }), xe;
  }
  function po(u) {
    return G(u) ? fn(u) : {};
  }
  function zn(u, p, d) {
    var L = p(u);
    return Gn(u) ? L : Wt(L, d(u));
  }
  function os(u) {
    return je.call(u);
  }
  function go(u) {
    if (!G(u) || ls(u))
      return !1;
    var p = Z(u) || j(u) ? ze : Fe;
    return p.test(Zn(u));
  }
  function na(u) {
    if (!li(u))
      return xr(u);
    var p = [];
    for (var d in Object(u))
      Ee.call(u, d) && d != "constructor" && p.push(d);
    return p;
  }
  function hn(u, p) {
    if (p)
      return u.slice();
    var d = new u.constructor(u.length);
    return u.copy(d), d;
  }
  function Er(u) {
    var p = new u.constructor(u.byteLength);
    return new on(p).set(new on(u)), p;
  }
  function is(u, p) {
    var d = p ? Er(u.buffer) : u.buffer;
    return new u.constructor(d, u.byteOffset, u.byteLength);
  }
  function yo(u, p, d) {
    var L = p ? d(O(u), !0) : O(u);
    return ot(L, Se, new u.constructor());
  }
  function oi(u) {
    var p = new u.constructor(u.source, ie.exec(u));
    return p.lastIndex = u.lastIndex, p;
  }
  function as(u, p, d) {
    var L = p ? d(J(u), !0) : J(u);
    return ot(L, Ce, new u.constructor());
  }
  function Is(u) {
    return q ? Object(q.call(u)) : {};
  }
  function wo(u, p) {
    var d = p ? Er(u.buffer) : u.buffer;
    return new u.constructor(d, u.byteOffset, u.length);
  }
  function ii(u, p) {
    var d = -1, L = u.length;
    for (p || (p = Array(L)); ++d < L; )
      p[d] = u[d];
    return p;
  }
  function cs(u, p, d, L) {
    d || (d = {});
    for (var W = -1, le = p.length; ++W < le; ) {
      var he = p[W], xe = void 0;
      Rn(d, he, xe === void 0 ? u[he] : xe);
    }
    return d;
  }
  function ra(u, p) {
    return cs(u, Ut(u), p);
  }
  function ai(u) {
    return zn(u, me, Ut);
  }
  function Ar(u, p) {
    var d = u.__data__;
    return bo(p) ? d[typeof p == "string" ? "string" : "hash"] : d.map;
  }
  function kr(u, p) {
    var d = At(u, p);
    return go(d) ? d : void 0;
  }
  var Ut = Wn ? ee(Wn, Object) : $e, fr = os;
  (dr && fr(new dr(new ArrayBuffer(1))) != K || an && fr(new an()) != w || _t && fr(_t.resolve()) != S || cn && fr(new cn()) != B || Et && fr(new Et()) != T) && (fr = function(u) {
    var p = je.call(u), d = p == x ? u.constructor : void 0, L = d ? Zn(d) : void 0;
    if (L)
      switch (L) {
        case ss:
          return K;
        case Sr:
          return w;
        case E:
          return S;
        case H:
          return B;
        case z:
          return T;
      }
    return p;
  });
  function mo(u) {
    var p = u.length, d = u.constructor(p);
    return p && typeof u[0] == "string" && Ee.call(u, "index") && (d.index = u.index, d.input = u.input), d;
  }
  function jr(u) {
    return typeof u.constructor == "function" && !li(u) ? po(Cn(u)) : {};
  }
  function ci(u, p, d, L) {
    var W = u.constructor;
    switch (p) {
      case _:
        return Er(u);
      case a:
      case c:
        return new W(+u);
      case K:
        return is(u, L);
      case se:
      case Q:
      case V:
      case m:
      case I:
      case N:
      case M:
      case X:
      case F:
        return wo(u, L);
      case w:
        return yo(u, L, d);
      case y:
      case P:
        return new W(u);
      case C:
        return oi(u);
      case B:
        return as(u, L, d);
      case v:
        return Is(u);
    }
  }
  function ct(u, p) {
    return p = p ?? o, !!p && (typeof u == "number" || $.test(u)) && u > -1 && u % 1 == 0 && u < p;
  }
  function bo(u) {
    var p = typeof u;
    return p == "string" || p == "number" || p == "symbol" || p == "boolean" ? u !== "__proto__" : u === null;
  }
  function ls(u) {
    return !!bt && bt in u;
  }
  function li(u) {
    var p = u && u.constructor, d = typeof p == "function" && p.prototype || Me;
    return u === d;
  }
  function Zn(u) {
    if (u != null) {
      try {
        return De.call(u);
      } catch {
      }
      try {
        return u + "";
      } catch {
      }
    }
    return "";
  }
  function sa(u) {
    return $s(u, !0, !0);
  }
  function ui(u, p) {
    return u === p || u !== u && p !== p;
  }
  function us(u) {
    return A(u) && Ee.call(u, "callee") && (!Ct.call(u, "callee") || je.call(u) == s);
  }
  var Gn = Array.isArray;
  function b(u) {
    return u != null && ke(u.length) && !Z(u);
  }
  function A(u) {
    return ve(u) && b(u);
  }
  var R = vt || l;
  function Z(u) {
    var p = G(u) ? je.call(u) : "";
    return p == g || p == h;
  }
  function ke(u) {
    return typeof u == "number" && u > -1 && u % 1 == 0 && u <= o;
  }
  function G(u) {
    var p = typeof u;
    return !!u && (p == "object" || p == "function");
  }
  function ve(u) {
    return !!u && typeof u == "object";
  }
  function me(u) {
    return b(u) ? Mn(u) : na(u);
  }
  function $e() {
    return [];
  }
  function l() {
    return !1;
  }
  e.exports = sa;
})(rl, rl.exports);
var _v = rl.exports;
const yw = /* @__PURE__ */ Gg(_v);
var id;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(id || (id = {}));
function Pv(e, t) {
  return { type: id.Address, version: e, hash160: t };
}
function Uv(e) {
  return ei.c32address(e.version, e.hash160);
}
const Ov = (e) => av(cw(e)), Hv = (e) => Te(Ov(e));
qt.hmacSha256Sync = (e, ...t) => {
  const n = iw.create(cw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Dv(e, t = "mainnet") {
  t = nw(t), e = typeof e == "string" ? pt(e) : e;
  const n = QS(ws.P2PKH, t), r = Pv(n, Hv(e));
  return Uv(r);
}
function Fv(e, t) {
  const n = vn.decodeToken(e), r = n.payload;
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
  const o = r.issuer.publicKey, s = Dv(o);
  if (t !== o) {
    if (t !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new vn.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function jv(e, t = null) {
  let n;
  t ? n = Fv(e, t) : n = vn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const jp = "_blockstackDidCheckEchoReply", Rv = "echoReply", zv = "authContinuation";
function Gv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Kv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[jp];
  if (typeof t == "boolean")
    return t;
  const n = Gv(e.location.search), r = n[Rv];
  if (r) {
    e[jp] = !0;
    const o = `echo-reply-${r}`;
    return e.localStorage.setItem(o, "success"), e.setTimeout(() => {
      const s = n[zv];
      e.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class ad {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new Qg();
    else
      throw new u1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new vp(t.sessionOptions) : this.store = new vp() : t ? this.store = new Sp(t.sessionOptions) : this.store = new Sp();
  }
  makeAuthRequestToken(t, n, r, o, s, i = f1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Xu("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), o = o || c.scopes, s = s || c.appDomain, TS(t, n, r, o, s, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = CS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = tf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Kv())
        return Ei.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Ei.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = P1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ec("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = vn.decodeToken(t).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await PS(t))
      throw new ec("Invalid authentication response.");
    let a = s.private_key, c = s.core_token;
    if (lu(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            a = await bp(o, s.private_key);
          } catch {
            if (Ei.warn("Failed decryption of appPrivateKey, will try to use as given"), !qt.isValidPrivateKey(s.private_key))
              throw new ec("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await bp(o, c);
          } catch {
            Ei.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ec("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let f = A1, g;
    lu(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (f = s.hubUrl), lu(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (g = s.associationToken);
    const h = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: Qy(s.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: f,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: g
    }, w = s.profile_url;
    if (!h.profile && w) {
      const y = await n(w);
      if (!y.ok)
        h.profile = Object.assign({}, a1);
      else {
        const x = await y.text(), S = JSON.parse(x);
        h.profile = jv(S[0].token);
      }
    } else
      h.profile = s.profile;
    return r.userData = h, this.store.setSessionData(r), h;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new Xu("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Ax(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), kx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
ad.prototype.makeAuthRequest = ad.prototype.makeAuthRequestToken;
const Vv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Xv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Vv(), n = e.filter((r) => t.find((s) => s.id === r.id) ? !1 : !!Ol(r.id));
  return t.concat(n);
}, Ol = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), ww = "STX_PROVIDER", Do = () => typeof window > "u" ? null : window.localStorage.getItem(ww), Yv = (e) => {
  typeof window < "u" && window.localStorage.setItem(ww, e);
}, qv = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Wv(e, t) {
  const n = {};
  return Object.assign(n, qv, t), await fetch(e, n);
}
function Zv(e) {
  let t = Wv, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Jv(...e) {
  const { fetchLib: t, middlewares: n } = Zv(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
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
var ji;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ji || (ji = {}));
var Fo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Fo || (Fo = {}));
var Rp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Rp || (Rp = {}));
const Qv = "https://api.mainnet.hiro.so", eE = "https://api.testnet.hiro.so", tE = "http://localhost:3999", nE = ["mainnet", "testnet", "devnet", "mocknet"];
class jo {
  constructor(t) {
    this.version = Fo.Mainnet, this.chainId = ji.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Fo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Jv();
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
jo.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new cd();
    case "testnet":
      return new ld();
    case "devnet":
      return new rE();
    case "mocknet":
      return new mw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${nE.join(", ")}`);
  }
};
jo.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : jo.fromName(e);
class cd extends jo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Qv,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Fo.Mainnet, this.chainId = ji.Mainnet;
  }
}
class ld extends jo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? eE,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Fo.Testnet, this.chainId = ji.Testnet;
  }
}
class mw extends jo {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? tE,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Fo.Testnet, this.chainId = ji.Testnet;
  }
}
const rE = mw;
var Ro;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Ro || (Ro = {}));
var sl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(sl || (sl = {}));
Ro.Mainnet;
var zo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(zo || (zo = {}));
var Go;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Go || (Go = {}));
zo.Mainnet;
const sE = {
  chainId: Ro.Mainnet,
  transactionVersion: zo.Mainnet,
  peerNetworkId: sl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Go.MainnetSingleSig,
    multiSig: Go.MainnetMultiSig
  },
  client: { baseUrl: Wg }
}, ud = {
  chainId: Ro.Testnet,
  transactionVersion: zo.Testnet,
  peerNetworkId: sl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Go.TestnetSingleSig,
    multiSig: Go.TestnetMultiSig
  },
  client: { baseUrl: Zg }
}, Dc = {
  ...ud,
  addressVersion: { ...ud.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Jg }
}, oE = {
  ...Dc,
  addressVersion: { ...Dc.addressVersion },
  client: { ...Dc.client }
};
function iE(e) {
  switch (e) {
    case "mainnet":
      return sE;
    case "testnet":
      return ud;
    case "devnet":
      return Dc;
    case "mocknet":
      return oE;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function aE(e) {
  return typeof e == "string" ? iE(e) : e;
}
function cE(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const zp = /* @__PURE__ */ new Map();
function bw(e, t) {
  const n = zp.get(e);
  if (n !== void 0)
    return n(t);
  const r = cE(e);
  return zp.set(e, r), bw(e, t);
}
let Mt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? pt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return B1(this.readBytes(4), 0);
  }
  readUInt8() {
    return C1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return I1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = Te(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = Te(n);
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
    if (bw(t, r))
      return r;
    throw n(r);
  }
};
const lE = 128, uE = 128, xw = 16, To = 32, dd = 80, Hl = 65, dE = 32, fE = 64, ol = 34, hE = 1 + 16 * 1024 * 1024, pE = 165, gE = 16, yE = 16, wE = 20, mE = yE + 2 + wE, bE = mE + 4, xE = hE + (pE + gE * bE);
var St;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(St || (St = {}));
var fd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(fd || (fd = {}));
var nr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(nr || (nr = {}));
const yu = ["onChainOnly", "offChainOnly", "any"];
yu[0] + "", nr.OnChainOnly, yu[1] + "", nr.OffChainOnly, yu[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var il;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(il || (il = {}));
var Ot;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Ot || (Ot = {}));
var Xt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Xt || (Xt = {}));
var Tt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Tt || (Tt = {}));
var Gt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Gt || (Gt = {}));
var Ea;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ea || (Ea = {}));
var hd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(hd || (hd = {}));
var pd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(pd || (pd = {}));
var On;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(On || (On = {}));
var Gp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Gp || (Gp = {}));
var gd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(gd || (gd = {}));
var Br;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Br || (Br = {}));
var Kp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Kp || (Kp = {}));
let Dl = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ai = class extends Dl {
  constructor(t) {
    super(t);
  }
}, Pn = class extends Dl {
  constructor(t) {
    super(t);
  }
}, al = class extends Dl {
  constructor(t) {
    super(t);
  }
}, ko = class extends Dl {
  constructor(t) {
    super(t);
  }
};
function yd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function SE(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Sw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function vE(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  yd(e.outputLen), yd(e.blockLen);
}
function EE(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function AE(e, t) {
  Sw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $o = {
  number: yd,
  bool: SE,
  bytes: Sw,
  hash: vE,
  exists: EE,
  output: AE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const wu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Gr = (e, t) => e << 32 - t | e >>> t, kE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!kE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function $E(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function kf(e) {
  if (typeof e == "string" && (e = $E(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let vw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(e) {
  const t = (r) => e().update(kf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Ew = class extends vw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, $o.hash(t);
    const r = kf(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return $o.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    $o.exists(this), $o.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Aw = (e, t, n) => new Ew(e, t).update(n).digest();
Aw.create = (e, t) => new Ew(e, t);
function IE(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + f, a, r);
}
let $f = class extends vw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = wu(this.buffer);
  }
  update(t) {
    $o.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = kf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = wu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    $o.exists(this), $o.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let h = i; h < o; h++)
      n[h] = 0;
    IE(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = wu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, g = this.get();
    if (f > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < f; h++)
      a.setUint32(4 * h, g[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const LE = (e, t, n) => e & t ^ ~e & n, CE = (e, t, n) => e & t ^ e & n ^ t & n, TE = new Uint32Array([
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
]), js = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Rs = new Uint32Array(64);
let kw = class extends $f {
  constructor() {
    super(64, 32, 8, !1), this.A = js[0] | 0, this.B = js[1] | 0, this.C = js[2] | 0, this.D = js[3] | 0, this.E = js[4] | 0, this.F = js[5] | 0, this.G = js[6] | 0, this.H = js[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Rs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Rs[h - 15], y = Rs[h - 2], x = Gr(w, 7) ^ Gr(w, 18) ^ w >>> 3, S = Gr(y, 17) ^ Gr(y, 19) ^ y >>> 10;
      Rs[h] = S + Rs[h - 7] + x + Rs[h - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: f, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = Gr(a, 6) ^ Gr(a, 11) ^ Gr(a, 25), y = g + w + LE(a, c, f) + TE[h] + Rs[h] | 0, S = (Gr(r, 2) ^ Gr(r, 13) ^ Gr(r, 22)) + CE(r, o, s) | 0;
      g = f, f = c, c = a, a = i + y | 0, i = s, s = o, o = r, r = y + S | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, g = g + this.H | 0, this.set(r, o, s, i, a, c, f, g);
  }
  roundClean() {
    Rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, BE = class extends kw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const If = ti(() => new kw());
ti(() => new BE());
const NE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $w = Uint8Array.from({ length: 16 }, (e, t) => t), ME = $w.map((e) => (9 * e + 5) % 16);
let Lf = [$w], Cf = [ME];
for (let e = 0; e < 4; e++)
  for (let t of [Lf, Cf])
    t.push(t[e].map((n) => NE[n]));
const Iw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), _E = Lf.map((e, t) => e.map((n) => Iw[t][n])), PE = Cf.map((e, t) => e.map((n) => Iw[t][n])), UE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), OE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), hc = (e, t) => e << t | e >>> 32 - t;
function Vp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const pc = new Uint32Array(16);
let HE = class extends $f {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      pc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, f = this.h3 | 0, g = f, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const x = 4 - y, S = UE[y], C = OE[y], B = Lf[y], P = Cf[y], v = _E[y], T = PE[y];
      for (let _ = 0; _ < 16; _++) {
        const K = hc(r + Vp(y, s, a, f) + pc[B[_]] + S, v[_]) + h | 0;
        r = h, h = f, f = hc(a, 10) | 0, a = s, s = K;
      }
      for (let _ = 0; _ < 16; _++) {
        const K = hc(o + Vp(x, i, c, g) + pc[P[_]] + C, T[_]) + w | 0;
        o = w, w = g, g = hc(c, 10) | 0, c = i, i = K;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + f + w | 0, this.h3 + h + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    pc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const DE = ti(() => new HE()), gc = BigInt(2 ** 32 - 1), wd = BigInt(32);
function Lw(e, t = !1) {
  return t ? { h: Number(e & gc), l: Number(e >> wd & gc) } : { h: Number(e >> wd & gc) | 0, l: Number(e & gc) | 0 };
}
function FE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Lw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const jE = (e, t) => BigInt(e >>> 0) << wd | BigInt(t >>> 0), RE = (e, t, n) => e >>> n, zE = (e, t, n) => e << 32 - n | t >>> n, GE = (e, t, n) => e >>> n | t << 32 - n, KE = (e, t, n) => e << 32 - n | t >>> n, VE = (e, t, n) => e << 64 - n | t >>> n - 32, XE = (e, t, n) => e >>> n - 32 | t << 64 - n, YE = (e, t) => t, qE = (e, t) => e, WE = (e, t, n) => e << n | t >>> 32 - n, ZE = (e, t, n) => t << n | e >>> 32 - n, JE = (e, t, n) => t << n - 32 | e >>> 64 - n, QE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function eA(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const tA = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), nA = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, rA = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), sA = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, oA = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), iA = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, We = {
  fromBig: Lw,
  split: FE,
  toBig: jE,
  shrSH: RE,
  shrSL: zE,
  rotrSH: GE,
  rotrSL: KE,
  rotrBH: VE,
  rotrBL: XE,
  rotr32H: YE,
  rotr32L: qE,
  rotlSH: WE,
  rotlSL: ZE,
  rotlBH: JE,
  rotlBL: QE,
  add: eA,
  add3L: tA,
  add3H: nA,
  add4L: rA,
  add4H: sA,
  add5H: iA,
  add5L: oA
}, [aA, cA] = We.split([
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
].map((e) => BigInt(e))), zs = new Uint32Array(80), Gs = new Uint32Array(80);
let Fl = class extends $f {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: f, El: g, Fh: h, Fl: w, Gh: y, Gl: x, Hh: S, Hl: C } = this;
    return [t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      zs[v] = t.getUint32(n), Gs[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = zs[v - 15] | 0, _ = Gs[v - 15] | 0, K = We.rotrSH(T, _, 1) ^ We.rotrSH(T, _, 8) ^ We.shrSH(T, _, 7), se = We.rotrSL(T, _, 1) ^ We.rotrSL(T, _, 8) ^ We.shrSL(T, _, 7), Q = zs[v - 2] | 0, V = Gs[v - 2] | 0, m = We.rotrSH(Q, V, 19) ^ We.rotrBH(Q, V, 61) ^ We.shrSH(Q, V, 6), I = We.rotrSL(Q, V, 19) ^ We.rotrBL(Q, V, 61) ^ We.shrSL(Q, V, 6), N = We.add4L(se, I, Gs[v - 7], Gs[v - 16]), M = We.add4H(N, K, m, zs[v - 7], zs[v - 16]);
      zs[v] = M | 0, Gs[v] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: f, Dl: g, Eh: h, El: w, Fh: y, Fl: x, Gh: S, Gl: C, Hh: B, Hl: P } = this;
    for (let v = 0; v < 80; v++) {
      const T = We.rotrSH(h, w, 14) ^ We.rotrSH(h, w, 18) ^ We.rotrBH(h, w, 41), _ = We.rotrSL(h, w, 14) ^ We.rotrSL(h, w, 18) ^ We.rotrBL(h, w, 41), K = h & y ^ ~h & S, se = w & x ^ ~w & C, Q = We.add5L(P, _, se, cA[v], Gs[v]), V = We.add5H(Q, B, T, K, aA[v], zs[v]), m = Q | 0, I = We.rotrSH(r, o, 28) ^ We.rotrBH(r, o, 34) ^ We.rotrBH(r, o, 39), N = We.rotrSL(r, o, 28) ^ We.rotrBL(r, o, 34) ^ We.rotrBL(r, o, 39), M = r & s ^ r & a ^ s & a, X = o & i ^ o & c ^ i & c;
      B = S | 0, P = C | 0, S = y | 0, C = x | 0, y = h | 0, x = w | 0, { h, l: w } = We.add(f | 0, g | 0, V | 0, m | 0), f = a | 0, g = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const F = We.add3L(m, N, X);
      r = We.add3H(F, V, I, M), o = F | 0;
    }
    ({ h: r, l: o } = We.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = We.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = We.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: g } = We.add(this.Dh | 0, this.Dl | 0, f | 0, g | 0), { h, l: w } = We.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: x } = We.add(this.Fh | 0, this.Fl | 0, y | 0, x | 0), { h: S, l: C } = We.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: B, l: P } = We.add(this.Hh | 0, this.Hl | 0, B | 0, P | 0), this.set(r, o, s, i, a, c, f, g, h, w, y, x, S, C, B, P);
  }
  roundClean() {
    zs.fill(0), Gs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, lA = class extends Fl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, uA = class extends Fl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, dA = class extends Fl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ti(() => new Fl());
ti(() => new lA());
const fA = ti(() => new uA());
ti(() => new dA());
var lt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(lt || (lt = {}));
var un;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(un || (un = {}));
function Tf(e) {
  return un[e];
}
const hA = () => ({ type: lt.BoolTrue }), pA = () => ({ type: lt.BoolFalse }), gA = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: lt.Buffer, value: Te(e) };
}, Xp = BigInt("0xffffffffffffffffffffffffffffffff"), yA = BigInt(0), Yp = BigInt("0x7fffffffffffffffffffffffffffffff"), qp = BigInt("-170141183460469231731687303715884105728"), wA = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = qu(pt(e))), qn(e, Uint8Array) && (e = qu(e));
  const t = Ln(e);
  if (t > Yp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Yp}`);
  if (t < qp)
    throw new RangeError(`Cannot construct clarity integer form value less than ${qp}`);
  return { type: lt.Int, value: t };
}, mA = (e) => {
  const t = Ln(e);
  if (t < yA)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Xp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Xp}`);
  return { type: lt.UInt, value: t };
};
function bA(e) {
  return { type: lt.List, value: e };
}
function Cw() {
  return { type: lt.OptionalNone };
}
function Tw(e) {
  return { type: lt.OptionalSome, value: e };
}
var pe;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(pe || (pe = {}));
function xA() {
  return {
    type: pe.Address,
    version: Go.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Wp(e) {
  if (e && Dw(e, ol))
    throw new Error(`Memo exceeds maximum length of ${ol} bytes`);
  return { type: pe.MemoString, content: e };
}
function Bf(e, t) {
  return {
    type: pe.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function md(e) {
  if (pt(e).byteLength != Hl)
    throw Error("Invalid signature");
  return {
    type: pe.MessageSignature,
    data: e
  };
}
function SA(e, t, n) {
  return typeof e == "string" && (e = OA(e)), typeof n == "string" && (n = Wp(n)), {
    type: pe.Payload,
    payloadType: St.TokenTransfer,
    recipient: e,
    amount: Ln(t),
    memo: n ?? Wp("")
  };
}
function vA(e, t, n, r) {
  return typeof t == "string" && (t = Ur(t)), typeof n == "string" && (n = Ur(n)), {
    type: pe.Payload,
    payloadType: St.ContractCall,
    contractAddress: typeof e == "string" ? uo(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function EA(e) {
  return Ur(e, 4, 1e5);
}
function Zp(e, t, n) {
  return typeof e == "string" && (e = Ur(e)), typeof t == "string" && (t = EA(t)), typeof n == "number" ? {
    type: pe.Payload,
    payloadType: St.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: pe.Payload,
    payloadType: St.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function AA() {
  return { type: pe.Payload, payloadType: St.PoisonMicroblock };
}
function Jp(e, t) {
  if (e.byteLength != To)
    throw Error(`Coinbase buffer size must be ${To} bytes`);
  return t != null ? {
    type: pe.Payload,
    payloadType: St.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: pe.Payload,
    payloadType: St.Coinbase,
    coinbaseBytes: e
  };
}
function kA(e, t, n) {
  if (e.byteLength != To)
    throw Error(`Coinbase buffer size must be ${To} bytes`);
  if (n.byteLength != dd)
    throw Error(`VRF proof buffer size must be ${dd} bytes`);
  return {
    type: pe.Payload,
    payloadType: St.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === lt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function $A(e, t, n, r, o, s, i) {
  return {
    type: pe.Payload,
    payloadType: St.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function Ur(e, t, n) {
  const r = t || 1, o = n || lE;
  if (Dw(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: pe.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function IA(e, t, n) {
  return {
    type: pe.Asset,
    address: uo(e),
    contractName: Ur(t),
    assetName: Ur(n)
  };
}
function uo(e) {
  const t = ei.c32addressDecode(e);
  return {
    type: pe.Address,
    version: t[0],
    hash160: t[1]
  };
}
function LA(e, t) {
  const n = uo(e), r = Ur(t);
  return {
    type: pe.Principal,
    prefix: On.Contract,
    address: n,
    contractName: r
  };
}
function CA(e) {
  const t = uo(e);
  return {
    type: pe.Principal,
    prefix: On.Standard,
    address: t
  };
}
function ki(e, t) {
  return {
    pubKeyEncoding: e,
    type: pe.TransactionAuthField,
    contents: t
  };
}
function gs(e) {
  switch (e.type) {
    case pe.Address:
      return Va(e);
    case pe.Principal:
      return Bw(e);
    case pe.LengthPrefixedString:
      return zi(e);
    case pe.MemoString:
      return BA(e);
    case pe.Asset:
      return Mw(e);
    case pe.PostCondition:
      return Pw(e);
    case pe.PublicKey:
      return Sd(e);
    case pe.LengthPrefixedList:
      return Nf(e);
    case pe.Payload:
      return Uw(e);
    case pe.TransactionAuthField:
      return UA(e);
    case pe.MessageSignature:
      return Mf(e);
  }
}
function Va(e) {
  const t = [];
  return t.push(pt(Fa(e.version, 1))), t.push(pt(e.hash160)), nn(t);
}
function Ri(e) {
  const t = qn(e, Mt) ? e : new Mt(e), n = kl(Te(t.readBytes(1))), r = Te(t.readBytes(20));
  return { type: pe.Address, version: n, hash160: r };
}
function Bw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === On.Standard || e.prefix === On.Contract) && t.push(Va(e.address)), e.prefix === On.Contract && t.push(zi(e.contractName)), nn(t);
}
function TA(e) {
  const t = qn(e, Mt) ? e : new Mt(e), n = t.readUInt8Enum(On, (s) => {
    throw new Pn(`Unexpected Principal payload type: ${s}`);
  });
  if (n === On.Origin)
    return { type: pe.Principal, prefix: n };
  const r = Ri(t);
  if (n === On.Standard)
    return { type: pe.Principal, prefix: n, address: r };
  const o = wr(t);
  return {
    type: pe.Principal,
    prefix: n,
    address: r,
    contractName: o
  };
}
function zi(e) {
  const t = [], n = Wo(e.content), r = n.byteLength;
  return t.push(pt(Fa(r, e.lengthPrefixBytes))), t.push(n), nn(t);
}
function wr(e, t, n) {
  t = t || 1;
  const r = qn(e, Mt) ? e : new Mt(e), o = kl(Te(r.readBytes(t))), s = ja(r.readBytes(o));
  return Ur(s, t, n ?? 128);
}
function BA(e) {
  const t = [], n = Wo(e.content), r = ok(Te(n), ol * 2);
  return t.push(pt(r)), nn(t);
}
function Nw(e) {
  const t = qn(e, Mt) ? e : new Mt(e);
  let n = ja(t.readBytes(ol));
  return n = n.replace(/\u0000*$/, ""), { type: pe.MemoString, content: n };
}
function Mw(e) {
  const t = [];
  return t.push(Va(e.address)), t.push(zi(e.contractName)), t.push(zi(e.assetName)), nn(t);
}
function bd(e) {
  const t = qn(e, Mt) ? e : new Mt(e);
  return {
    type: pe.Asset,
    address: Ri(t),
    contractName: wr(t),
    assetName: wr(t)
  };
}
function Nf(e) {
  const t = e.values, n = [];
  n.push(pt(Fa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(gs(r));
  return nn(n);
}
function _w(e, t, n) {
  const r = qn(e, Mt) ? e : new Mt(e), o = kl(Te(r.readBytes(4))), s = [];
  for (let i = 0; i < o; i++)
    switch (t) {
      case pe.Address:
        s.push(Ri(r));
        break;
      case pe.LengthPrefixedString:
        s.push(wr(r));
        break;
      case pe.MemoString:
        s.push(Nw(r));
        break;
      case pe.Asset:
        s.push(bd(r));
        break;
      case pe.PostCondition:
        s.push(MA(r));
        break;
      case pe.PublicKey:
        s.push(vd(r));
        break;
      case pe.TransactionAuthField:
        s.push(PA(r));
        break;
    }
  return Bf(s, n);
}
function NA(e) {
  return Te(Pw(e));
}
function Pw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Bw(e.principal)), (e.conditionType === Ot.Fungible || e.conditionType === Ot.NonFungible) && t.push(Mw(e.asset)), e.conditionType === Ot.NonFungible && t.push(Zr(e.assetName)), t.push(e.conditionCode), e.conditionType === Ot.STX || e.conditionType === Ot.Fungible || e.conditionType === Ot.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ai("The post-condition amount may not be larger than 8 bytes");
    t.push(co(e.amount, 8));
  }
  return nn(t);
}
function MA(e) {
  const t = qn(e, Mt) ? e : new Mt(e), n = t.readUInt8Enum(Ot, (a) => {
    throw new Pn(`Could not read ${a} as PostConditionType`);
  }), r = TA(t);
  let o, s, i;
  switch (n) {
    case Ot.STX:
      return o = t.readUInt8Enum(Ea, (c) => {
        throw new Pn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Te(t.readBytes(8))}`), {
        type: pe.PostCondition,
        conditionType: Ot.STX,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case Ot.Fungible:
      return s = bd(t), o = t.readUInt8Enum(Ea, (c) => {
        throw new Pn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Te(t.readBytes(8))}`), {
        type: pe.PostCondition,
        conditionType: Ot.Fungible,
        principal: r,
        conditionCode: o,
        amount: i,
        asset: s
      };
    case Ot.NonFungible:
      s = bd(t);
      const a = Yr(t);
      return o = t.readUInt8Enum(hd, (c) => {
        throw new Pn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: pe.PostCondition,
        conditionType: Ot.NonFungible,
        principal: r,
        conditionCode: o,
        asset: s,
        assetName: a
      };
    case Ot.Staking:
      return o = t.readUInt8Enum(Ea, (c) => {
        throw new Pn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${Te(t.readBytes(8))}`), {
        type: pe.PostCondition,
        conditionType: Ot.Staking,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case Ot.PoX: {
      const c = t.readUInt8Enum(pd, (f) => {
        throw new Pn(`Could not read ${f} as PoxConditionCode`);
      });
      return {
        type: pe.PostCondition,
        conditionType: Ot.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function Uw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case St.TokenTransfer:
      t.push(Zr(e.recipient)), t.push(co(e.amount, 8)), t.push(gs(e.memo));
      break;
    case St.ContractCall:
      t.push(gs(e.contractAddress)), t.push(gs(e.contractName)), t.push(gs(e.functionName));
      const n = new Uint8Array(4);
      _o(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Zr(r));
      });
      break;
    case St.SmartContract:
      t.push(gs(e.contractName)), t.push(gs(e.codeBody));
      break;
    case St.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(gs(e.contractName)), t.push(gs(e.codeBody));
      break;
    case St.PoisonMicroblock:
      break;
    case St.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case St.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Zr(e.recipient));
      break;
    case St.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Zr(e.recipient ? Tw(e.recipient) : Cw())), t.push(e.vrfProof);
      break;
    case St.TenureChange:
      t.push(pt(e.tenureHash)), t.push(pt(e.previousTenureHash)), t.push(pt(e.burnViewHash)), t.push(pt(e.previousTenureEnd)), t.push(_o(new Uint8Array(4), e.previousTenureBlocks)), t.push(T1(new Uint8Array(1), e.cause)), t.push(pt(e.publicKeyHash));
      break;
  }
  return nn(t);
}
function _A(e) {
  const t = qn(e, Mt) ? e : new Mt(e);
  switch (t.readUInt8Enum(St, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case St.TokenTransfer:
      const r = Yr(t), o = Ln(t.readBytes(8)), s = Nw(t);
      return SA(r, o, s);
    case St.ContractCall:
      const i = Ri(t), a = wr(t), c = wr(t), f = [], g = t.readUInt32BE();
      for (let T = 0; T < g; T++) {
        const _ = Yr(t);
        f.push(_);
      }
      return vA(i, a, c, f);
    case St.SmartContract:
      const h = wr(t), w = wr(t, 4, 1e5);
      return Zp(h, w);
    case St.VersionedSmartContract: {
      const T = t.readUInt8Enum(fd, (se) => {
        throw new Error(`Cannot recognize ClarityVersion: ${se}`);
      }), _ = wr(t), K = wr(t, 4, xE);
      return Zp(_, K, T);
    }
    case St.PoisonMicroblock:
      return AA();
    case St.Coinbase: {
      const T = t.readBytes(To);
      return Jp(T);
    }
    case St.CoinbaseToAltRecipient: {
      const T = t.readBytes(To), _ = Yr(t);
      return Jp(T, _);
    }
    case St.NakamotoCoinbase: {
      const T = t.readBytes(To), _ = Yr(t), K = t.readBytes(dd);
      return kA(T, _, K);
    }
    case St.TenureChange:
      const y = Te(t.readBytes(20)), x = Te(t.readBytes(20)), S = Te(t.readBytes(20)), C = Te(t.readBytes(32)), B = t.readUInt32BE(), P = t.readUInt8Enum(gd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), v = Te(t.readBytes(20));
      return $A(y, x, S, C, B, P, v);
  }
}
function xd(e) {
  const t = qn(e, Mt) ? e : new Mt(e);
  return md(Te(t.readBytes(Hl)));
}
function PA(e) {
  const t = qn(e, Mt) ? e : new Mt(e), n = t.readUInt8Enum(Br, (r) => {
    throw new Pn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Br.PublicKeyCompressed:
      return ki(Gt.Compressed, vd(t));
    case Br.PublicKeyUncompressed:
      return ki(Gt.Uncompressed, Zi(yk(vd(t).data)));
    case Br.SignatureCompressed:
      return ki(Gt.Compressed, xd(t));
    case Br.SignatureUncompressed:
      return ki(Gt.Uncompressed, xd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Mf(e) {
  return pt(e.data);
}
function UA(e) {
  const t = [];
  switch (e.contents.type) {
    case pe.PublicKey:
      t.push(e.pubKeyEncoding === Gt.Compressed ? Br.PublicKeyCompressed : Br.PublicKeyUncompressed), t.push(pt(gk(e.contents.data)));
      break;
    case pe.MessageSignature:
      t.push(e.pubKeyEncoding === Gt.Compressed ? Br.SignatureCompressed : Br.SignatureUncompressed), t.push(Mf(e.contents));
      break;
  }
  return nn(t);
}
function Sd(e) {
  return e.data.slice();
}
function vd(e) {
  const t = qn(e, Mt) ? e : new Mt(e), n = t.readUInt8(), r = n === 4 ? fE : dE;
  return Zi(nn([n, t.readBytes(r)]));
}
function _f(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Tt.P2PKH || t === Tt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Tt.P2WPKH || t === Tt.P2WSH || t === Tt.P2WSHNonSequential) && !r.map((o) => o.data).every(Ji))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Tt.P2PKH:
      return yc(e, ik(r[0].data));
    case Tt.P2WPKH:
      return yc(e, ak(r[0].data));
    case Tt.P2SH:
    case Tt.P2SHNonSequential:
      return yc(e, ck(n, r.map(Sd)));
    case Tt.P2WSH:
    case Tt.P2WSHNonSequential:
      return yc(e, lk(n, r.map(Sd)));
  }
}
function yc(e, t) {
  return { type: pe.Address, version: e, hash160: t };
}
function Pf(e) {
  return ei.c32address(e.version, e.hash160);
}
function Qp(e) {
  const [t, n, r] = e.split(/\.|::/);
  return IA(t, n, r);
}
function ua(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return LA(t, n);
  } else
    return CA(e);
}
function OA(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return FA(t, n);
  } else
    return HA(e);
}
function HA(e) {
  const t = uo(e);
  return { type: lt.PrincipalStandard, value: Pf(t) };
}
function DA(e) {
  return { type: lt.PrincipalStandard, value: Pf(e) };
}
function FA(e, t) {
  const n = uo(e), r = Ur(t);
  return Ow(n, r);
}
function Ow(e, t) {
  if (Wo(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: lt.PrincipalContract,
    value: `${Pf(e)}.${t.content}`
  };
}
function jA(e) {
  return { type: lt.ResponseErr, value: e };
}
function RA(e) {
  return { type: lt.ResponseOk, value: e };
}
const zA = (e) => ({ type: lt.StringASCII, value: e }), GA = (e) => ({ type: lt.StringUTF8, value: e });
function KA(e) {
  for (const t in e)
    if (!uk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: lt.Tuple, value: e };
}
function Yr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Mt(pt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Mt(e) : t = e;
  switch (t.readUInt8Enum(un, (r) => {
    throw new Pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case un.int:
      return wA(qu(t.readBytes(16)));
    case un.uint:
      return mA(t.readBytes(16));
    case un.buffer:
      const r = t.readUInt32BE();
      return gA(t.readBytes(r));
    case un.true:
      return hA();
    case un.false:
      return pA();
    case un.address:
      const o = Ri(t);
      return DA(o);
    case un.contract:
      const s = Ri(t), i = wr(t);
      return Ow(s, i);
    case un.ok:
      return RA(Yr(t));
    case un.err:
      return jA(Yr(t));
    case un.none:
      return Cw();
    case un.some:
      return Tw(Yr(t));
    case un.list:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(Yr(t));
      return bA(c);
    case un.tuple:
      const f = t.readUInt32BE(), g = {};
      for (let S = 0; S < f; S++) {
        const C = wr(t).content;
        if (C === void 0)
          throw new Pn('"content" is undefined');
        g[C] = Yr(t);
      }
      return KA(g);
    case un.ascii:
      const h = t.readUInt32BE(), w = v1(t.readBytes(h));
      return zA(w);
    case un.utf8:
      const y = t.readUInt32BE(), x = ja(t.readBytes(y));
      return GA(x);
    default:
      throw new Pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ts(e, t) {
  return nn([Tf(e), t]);
}
function VA(e) {
  return new Uint8Array([Tf(e.type)]);
}
function XA(e) {
  return e.type === lt.OptionalNone ? new Uint8Array([Tf(e.type)]) : ts(e.type, Zr(e.value));
}
function YA(e) {
  const t = new Uint8Array(4);
  return _o(t, Math.ceil(e.value.length / 2), 0), ts(e.type, Qr(t, pt(e.value)));
}
function qA(e) {
  const t = nf(w1(BigInt(e.value), BigInt(uE)), xw);
  return ts(e.type, t);
}
function WA(e) {
  const t = nf(BigInt(e.value), xw);
  return ts(e.type, t);
}
function ZA(e) {
  return ts(e.type, Va(uo(e.value)));
}
function JA(e) {
  const [t, n] = dk(e.value);
  return ts(e.type, Qr(Va(uo(t)), zi(Ur(n))));
}
function QA(e) {
  return ts(e.type, Zr(e.value));
}
function ek(e) {
  const t = [], n = new Uint8Array(4);
  _o(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const o = Zr(r);
    t.push(o);
  }
  return ts(e.type, nn(t));
}
function tk(e) {
  const t = [], n = new Uint8Array(4);
  _o(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Ur(o);
    t.push(zi(s));
    const i = Zr(e.value[o]);
    t.push(i);
  }
  return ts(e.type, nn(t));
}
function Hw(e, t) {
  const n = [], r = t == "ascii" ? S1(e.value) : Wo(e.value), o = new Uint8Array(4);
  return _o(o, r.length, 0), n.push(o), n.push(r), ts(e.type, nn(n));
}
function nk(e) {
  return Hw(e, "ascii");
}
function rk(e) {
  return Hw(e, "utf8");
}
function e0(e) {
  return Te(Zr(e));
}
function Zr(e) {
  switch (e.type) {
    case lt.BoolTrue:
    case lt.BoolFalse:
      return VA(e);
    case lt.OptionalNone:
    case lt.OptionalSome:
      return XA(e);
    case lt.Buffer:
      return YA(e);
    case lt.UInt:
      return WA(e);
    case lt.Int:
      return qA(e);
    case lt.PrincipalStandard:
      return ZA(e);
    case lt.PrincipalContract:
      return JA(e);
    case lt.ResponseOk:
    case lt.ResponseErr:
      return QA(e);
    case lt.List:
      return ek(e);
    case lt.Tuple:
      return tk(e);
    case lt.StringASCII:
      return nk(e);
    case lt.StringUTF8:
      return rk(e);
    default:
      throw new Ai("Unable to serialize. Invalid Clarity Value.");
  }
}
const sk = (e) => e.length % 2 ? `0${e}` : e, ok = (e, t) => e.padEnd(t, "0"), Dw = (e, t) => e ? Wo(e).length > t : !1;
function Ed(e) {
  return yw(e);
}
const Ca = (e) => DE(If(e)), Uf = (e) => Te(fA(e)), ik = (e) => Te(Ca(e)), ak = (e) => {
  const t = Ca(e), n = Qr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ca(n);
  return Te(r);
}, ck = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = nn(n), o = Ca(r);
  return Te(o);
}, lk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = nn(n), o = If(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = nn(s), a = Ca(i);
  return Te(a);
};
function uk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function dk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
qt.hmacSha256Sync = (e, ...t) => {
  const n = Aw.create(If, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Zi(e) {
  return e = typeof e == "string" ? pt(e) : e, {
    type: pe.PublicKey,
    data: e
  };
}
function fk(e, t, n = Gt.Compressed) {
  const r = $1(t), o = new ar(ep(r.r), ep(r.s)), s = nt.fromSignature(e, o, r.recoveryId), i = n === Gt.Compressed;
  return s.toHex(i);
}
function hk(e) {
  return typeof e == "string" ? e : Te(e);
}
const Of = hk;
function Fw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === k1;
}
function Ji(e) {
  return !Of(e).startsWith("04");
}
function pk(e) {
  e = rf(e);
  const t = Fw(e);
  return Te(Ra(e.slice(0, 32), t));
}
function gk(e) {
  return nt.fromHex(Of(e)).toHex(!0);
}
function yk(e) {
  return nt.fromHex(Of(e)).toHex(!1);
}
function wk(e, t) {
  e = rf(e);
  const [n, r] = Il(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Fa(r, 1) + ar.fromHex(n).toCompactHex();
}
function Hf() {
  return {
    type: pe.MessageSignature,
    data: Te(new Uint8Array(Hl))
  };
}
function jw(e, t, n, r) {
  const o = _f(0, e, 1, [Zi(t)]).hash160, s = Ji(t) ? Gt.Compressed : Gt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Ln(n),
    fee: Ln(r),
    keyEncoding: s,
    signature: Hf()
  };
}
function Ta(e) {
  return "signature" in e;
}
function t0(e) {
  return e === Tt.P2SH || e === Tt.P2WSH;
}
function mk(e) {
  return e === Tt.P2SHNonSequential || e === Tt.P2WSHNonSequential;
}
function n0(e) {
  const t = Ed(e);
  return t.nonce = 0, t.fee = 0, Ta(t) ? t.signature = Hf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function bk(e) {
  const t = [
    e.hashMode,
    pt(e.signer),
    co(e.nonce, 8),
    co(e.fee, 8),
    e.keyEncoding,
    Mf(e.signature)
  ];
  return nn(t);
}
function xk(e) {
  const t = [
    e.hashMode,
    pt(e.signer),
    co(e.nonce, 8),
    co(e.fee, 8)
  ], n = Bf(e.fields);
  t.push(Nf(n));
  const r = new Uint8Array(2);
  return L1(r, e.signaturesRequired, 0), t.push(r), nn(t);
}
function Sk(e, t) {
  const n = Te(t.readBytes(20)), r = BigInt(`0x${Te(t.readBytes(8))}`), o = BigInt(`0x${Te(t.readBytes(8))}`), s = t.readUInt8Enum(Gt, (a) => {
    throw new Pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Tt.P2WPKH && s != Gt.Compressed)
    throw new Pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = xd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function vk(e, t) {
  const n = Te(t.readBytes(20)), r = BigInt("0x" + Te(t.readBytes(8))), o = BigInt("0x" + Te(t.readBytes(8))), s = _w(t, pe.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const f of s)
    switch (f.contents.type) {
      case pe.PublicKey:
        Ji(f.contents.data) || (i = !0);
        break;
      case pe.MessageSignature:
        if (f.pubKeyEncoding === Gt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new ko("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Tt.P2WSH || e === Tt.P2WSHNonSequential))
    throw new ko("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function mu(e) {
  return Ta(e) ? bk(e) : xk(e);
}
function bu(e) {
  const t = e.readUInt8Enum(Tt, (n) => {
    throw new Pn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Tt.P2PKH || t === Tt.P2WPKH ? Sk(t, e) : vk(t, e);
}
function Rw(e, t, n, r) {
  const s = e + Te(new Uint8Array([t])) + Te(co(n, 8)) + Te(co(r, 8));
  if (pt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Uf(pt(s));
}
function zw(e, t, n) {
  const r = 33 + Hl, o = Ji(t.data) ? Gt.Compressed : Gt.Uncompressed, s = e + sk(o.toString(16)) + n, i = pt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Uf(i);
}
function Ek(e, t, n, r, o) {
  const s = Rw(e, t, n, r), i = wk(o, s), a = Zi(pk(o)), c = zw(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function Gw(e, t, n, r, o, s) {
  const i = Rw(e, t, n, r), a = Zi(fk(i, s, o)), c = zw(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Ak() {
  const e = jw(Tt.P2PKH, "", 0, 0);
  return e.signer = xA().hash160, e.keyEncoding = Gt.Compressed, e.signature = Hf(), e;
}
function r0(e, t, n) {
  return Ta(e) ? kk(e, t, n) : $k(e, t, n);
}
function kk(e, t, n) {
  const { pubKey: r, nextSigHash: o } = Gw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), s = _f(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new ko(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function $k(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case pe.PublicKey:
        Ji(c.contents.data) || (s = !0), r.push(c.contents);
        break;
      case pe.MessageSignature:
        c.pubKeyEncoding === Gt.Uncompressed && (s = !0);
        const { pubKey: f, nextSigHash: g } = Gw(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (t0(e.hashMode) && (o = g), r.push(f), i += 1, i === 65536)
          throw new ko("Too many signatures");
        break;
    }
  if (t0(e.hashMode) && i !== e.signaturesRequired || mk(e.hashMode) && i < e.signaturesRequired)
    throw new ko("Incorrect number of signatures");
  if (s && (e.hashMode === Tt.P2WSH || e.hashMode === Tt.P2WSHNonSequential))
    throw new ko("Uncompressed keys are not allowed in this hash mode");
  const a = _f(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new ko(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function Kw(e) {
  return {
    authType: Xt.Standard,
    spendingCondition: e
  };
}
function Vw(e, t) {
  return {
    authType: Xt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || jw(Tt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function s0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Xt.Standard:
        return Kw(n0(e.spendingCondition));
      case Xt.Sponsored:
        return Vw(n0(e.spendingCondition), Ak());
      default:
        throw new al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Ik(e, t) {
  switch (e.authType) {
    case Xt.Standard:
      return r0(e.spendingCondition, t, Xt.Standard);
    case Xt.Sponsored:
      return r0(e.spendingCondition, t, Xt.Standard);
    default:
      throw new al("Invalid origin auth type");
  }
}
function Lk(e, t) {
  switch (e.authType) {
    case Xt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Ln(t)
      };
      return { ...e, spendingCondition: n };
    case Xt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Ln(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Ck(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Ln(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Tk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Ln(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Bk(e, t) {
  const n = {
    ...t,
    nonce: Ln(t.nonce),
    fee: Ln(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Nk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Xt.Standard:
      t.push(mu(e.spendingCondition));
      break;
    case Xt.Sponsored:
      t.push(mu(e.spendingCondition)), t.push(mu(e.sponsorSpendingCondition));
      break;
  }
  return nn(t);
}
function Mk(e) {
  const t = e.readUInt8Enum(Xt, (r) => {
    throw new Pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Xt.Standard:
      return n = bu(e), Kw(n);
    case Xt.Sponsored:
      n = bu(e);
      const r = bu(e);
      return Vw(n, r);
  }
}
class _k {
  constructor({ auth: t, payload: n, postConditions: r = Bf([]), postConditionMode: o = il.Deny, transactionVersion: s, chainId: i, network: a = "mainnet" }) {
    a = aE(a), this.transactionVersion = s ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Ln(n.amount)
    } : this.payload = n, this.postConditionMode = o, this.postConditions = r, this.anchorMode = nr.Any;
  }
  signBegin() {
    const t = Ed(this);
    return t.auth = s0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Ed(this);
    return t.auth = s0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Ik(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Xt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Xt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Xt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : Zi(t), r = this.auth.spendingCondition;
    if (r && !Ta(r)) {
      const o = Ji(n.data);
      r.fields.push(ki(o ? Gt.Compressed : Gt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = Ek(n, r, t.fee, t.nonce, o);
    if (Ta(t))
      t.signature = md(s);
    else {
      const a = Fw(o);
      t.fields.push(ki(a ? Gt.Compressed : Gt.Uncompressed, md(s)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Uf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Xt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Bk(this.auth, t);
  }
  setFee(t) {
    this.auth = Lk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Ck(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Xt.Sponsored)
      throw new al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Tk(this.auth, t);
  }
  serialize() {
    return Te(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Ai('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Ai('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ai('"auth" is undefined');
    if (this.payload === void 0)
      throw new Ai('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return _o(n, this.chainId, 0), t.push(n), t.push(Nk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Nf(this.postConditions)), t.push(Uw(this.payload)), nn(t);
  }
}
function Pk(e) {
  const t = qn(e, Mt) ? e : new Mt(e), n = t.readUInt8Enum(zo, (g) => {
    throw new Error(`Could not parse ${g} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = Mk(t), s = t.readUInt8Enum(nr, (g) => {
    throw new Error(`Could not parse ${g} as AnchorMode`);
  }), i = t.readUInt8Enum(il, (g) => {
    throw new Error(`Could not parse ${g} as PostConditionMode`);
  }), a = _w(t, pe.PostCondition), c = _A(t), f = new _k({
    transactionVersion: n,
    chainId: r,
    auth: o,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return f.anchorMode = s, f;
}
const o0 = BigInt("18446744073709551615");
function xu(e) {
  const t = Ln(e);
  if (t < 0n || t > o0)
    throw new RangeError(`Post-condition amount must be between 0 and ${o0} (u64 max), received: ${t}`);
  return t;
}
var Ad;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Ad || (Ad = {}));
var kd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(kd || (kd = {}));
function Uk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Ot.STX,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: On.Origin } : ua(e.address),
        conditionCode: wc(e.condition),
        amount: xu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Ot.Fungible,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: On.Origin } : ua(e.address),
        conditionCode: wc(e.condition),
        amount: xu(e.amount),
        asset: Qp(e.asset)
      };
    case "nft-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Ot.NonFungible,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: On.Origin } : ua(e.address),
        conditionCode: wc(e.condition),
        asset: Qp(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Ot.Staking,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: On.Origin } : ua(e.address),
        conditionCode: wc(e.condition),
        amount: xu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Ot.PoX,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: On.Origin } : ua(e.address),
        conditionCode: Ok(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function wc(e) {
  return Ad[e];
}
function Ok(e) {
  return kd[e];
}
function Xw(e) {
  const t = Uk(e);
  return NA(t);
}
function Hk(e, t, n) {
  return Ff(Yw(e), n);
}
function Yw(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ba(r);
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
    return BigInt(`0x${jk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Df(e, t = 8) {
  return (typeof e == "bigint" ? e : Yw(e)).toString(16).padStart(t * 2, "0");
}
function Ff(e, t = 16) {
  const n = Df(e, t);
  return Ba(n);
}
function Dk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Fk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function jk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Fk[n];
  return t;
}
function Ba(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function jf(e) {
  return new TextEncoder().encode(e);
}
function Rk(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function zk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function i0(e) {
  if (e.some(zk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Rf(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function As(e) {
  return Rf(...e.map((t) => typeof t == "number" ? i0([t]) : t instanceof Array ? i0(t) : t));
}
function jl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var $d;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})($d || ($d = {}));
$d.Mainnet;
const Gk = 128, Kk = 128, qw = 16;
var Id;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Id || (Id = {}));
var a0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(a0 || (a0 = {}));
var c0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(c0 || (c0 = {}));
var Cr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Cr || (Cr = {}));
const Su = ["onChainOnly", "offChainOnly", "any"];
Su[0] + "", Cr.OnChainOnly, Su[1] + "", Cr.OffChainOnly, Su[2] + "", Cr.Any, Cr.OnChainOnly + "", Cr.OnChainOnly, Cr.OffChainOnly + "", Cr.OffChainOnly, Cr.Any + "", Cr.Any;
var Ld;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ld || (Ld = {}));
Ld.Mainnet;
var l0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(l0 || (l0 = {}));
var So;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(So || (So = {}));
var u0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(u0 || (u0 = {}));
var d0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(d0 || (d0 = {}));
var f0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(f0 || (f0 = {}));
var h0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(h0 || (h0 = {}));
var p0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(p0 || (p0 = {}));
var g0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(g0 || (g0 = {}));
var Cd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Cd || (Cd = {}));
var y0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(y0 || (y0 = {}));
var w0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(w0 || (w0 = {}));
function Td(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Vk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Ww(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Xk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Td(e.outputLen), Td(e.blockLen);
}
function Yk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function qk(e, t) {
  Ww(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const vu = {
  number: Td,
  bool: Vk,
  bytes: Ww,
  hash: Xk,
  exists: Yk,
  output: qk
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Eu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Kr = (e, t) => e << 32 - t | e >>> t, Wk = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Wk)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Zk(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Zw(e) {
  if (typeof e == "string" && (e = Zk(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Jk = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ni(e) {
  const t = (r) => e().update(Zw(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Qk(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + f, a, r);
}
let zf = class extends Jk {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Eu(this.buffer);
  }
  update(t) {
    vu.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Zw(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = Eu(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    vu.exists(this), vu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let h = i; h < o; h++)
      n[h] = 0;
    Qk(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = Eu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, g = this.get();
    if (f > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < f; h++)
      a.setUint32(4 * h, g[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const e3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jw = Uint8Array.from({ length: 16 }, (e, t) => t), t3 = Jw.map((e) => (9 * e + 5) % 16);
let Gf = [Jw], Kf = [t3];
for (let e = 0; e < 4; e++)
  for (let t of [Gf, Kf])
    t.push(t[e].map((n) => e3[n]));
const Qw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), n3 = Gf.map((e, t) => e.map((n) => Qw[t][n])), r3 = Kf.map((e, t) => e.map((n) => Qw[t][n])), s3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), o3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), mc = (e, t) => e << t | e >>> 32 - t;
function m0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const bc = new Uint32Array(16);
let i3 = class extends zf {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      bc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, f = this.h3 | 0, g = f, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const x = 4 - y, S = s3[y], C = o3[y], B = Gf[y], P = Kf[y], v = n3[y], T = r3[y];
      for (let _ = 0; _ < 16; _++) {
        const K = mc(r + m0(y, s, a, f) + bc[B[_]] + S, v[_]) + h | 0;
        r = h, h = f, f = mc(a, 10) | 0, a = s, s = K;
      }
      for (let _ = 0; _ < 16; _++) {
        const K = mc(o + m0(x, i, c, g) + bc[P[_]] + C, T[_]) + w | 0;
        o = w, w = g, g = mc(c, 10) | 0, c = i, i = K;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + f + w | 0, this.h3 + h + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    bc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ni(() => new i3());
const a3 = (e, t, n) => e & t ^ ~e & n, c3 = (e, t, n) => e & t ^ e & n ^ t & n, l3 = new Uint32Array([
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
]), Ks = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Vs = new Uint32Array(64);
let em = class extends zf {
  constructor() {
    super(64, 32, 8, !1), this.A = Ks[0] | 0, this.B = Ks[1] | 0, this.C = Ks[2] | 0, this.D = Ks[3] | 0, this.E = Ks[4] | 0, this.F = Ks[5] | 0, this.G = Ks[6] | 0, this.H = Ks[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Vs[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Vs[h - 15], y = Vs[h - 2], x = Kr(w, 7) ^ Kr(w, 18) ^ w >>> 3, S = Kr(y, 17) ^ Kr(y, 19) ^ y >>> 10;
      Vs[h] = S + Vs[h - 7] + x + Vs[h - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: f, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = Kr(a, 6) ^ Kr(a, 11) ^ Kr(a, 25), y = g + w + a3(a, c, f) + l3[h] + Vs[h] | 0, S = (Kr(r, 2) ^ Kr(r, 13) ^ Kr(r, 22)) + c3(r, o, s) | 0;
      g = f, f = c, c = a, a = i + y | 0, i = s, s = o, o = r, r = y + S | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, g = g + this.H | 0, this.set(r, o, s, i, a, c, f, g);
  }
  roundClean() {
    Vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, u3 = class extends em {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ni(() => new em());
ni(() => new u3());
const xc = BigInt(2 ** 32 - 1), Bd = BigInt(32);
function tm(e, t = !1) {
  return t ? { h: Number(e & xc), l: Number(e >> Bd & xc) } : { h: Number(e >> Bd & xc) | 0, l: Number(e & xc) | 0 };
}
function d3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = tm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const f3 = (e, t) => BigInt(e >>> 0) << Bd | BigInt(t >>> 0), h3 = (e, t, n) => e >>> n, p3 = (e, t, n) => e << 32 - n | t >>> n, g3 = (e, t, n) => e >>> n | t << 32 - n, y3 = (e, t, n) => e << 32 - n | t >>> n, w3 = (e, t, n) => e << 64 - n | t >>> n - 32, m3 = (e, t, n) => e >>> n - 32 | t << 64 - n, b3 = (e, t) => t, x3 = (e, t) => e, S3 = (e, t, n) => e << n | t >>> 32 - n, v3 = (e, t, n) => t << n | e >>> 32 - n, E3 = (e, t, n) => t << n - 32 | e >>> 64 - n, A3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function k3(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const $3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), I3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, L3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), C3 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, T3 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), B3 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Ze = {
  fromBig: tm,
  split: d3,
  toBig: f3,
  shrSH: h3,
  shrSL: p3,
  rotrSH: g3,
  rotrSL: y3,
  rotrBH: w3,
  rotrBL: m3,
  rotr32H: b3,
  rotr32L: x3,
  rotlSH: S3,
  rotlSL: v3,
  rotlBH: E3,
  rotlBL: A3,
  add: k3,
  add3L: $3,
  add3H: I3,
  add4L: L3,
  add4H: C3,
  add5H: B3,
  add5L: T3
}, [N3, M3] = Ze.split([
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
].map((e) => BigInt(e))), Xs = new Uint32Array(80), Ys = new Uint32Array(80);
let Rl = class extends zf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: f, El: g, Fh: h, Fl: w, Gh: y, Gl: x, Hh: S, Hl: C } = this;
    return [t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Xs[v] = t.getUint32(n), Ys[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = Xs[v - 15] | 0, _ = Ys[v - 15] | 0, K = Ze.rotrSH(T, _, 1) ^ Ze.rotrSH(T, _, 8) ^ Ze.shrSH(T, _, 7), se = Ze.rotrSL(T, _, 1) ^ Ze.rotrSL(T, _, 8) ^ Ze.shrSL(T, _, 7), Q = Xs[v - 2] | 0, V = Ys[v - 2] | 0, m = Ze.rotrSH(Q, V, 19) ^ Ze.rotrBH(Q, V, 61) ^ Ze.shrSH(Q, V, 6), I = Ze.rotrSL(Q, V, 19) ^ Ze.rotrBL(Q, V, 61) ^ Ze.shrSL(Q, V, 6), N = Ze.add4L(se, I, Ys[v - 7], Ys[v - 16]), M = Ze.add4H(N, K, m, Xs[v - 7], Xs[v - 16]);
      Xs[v] = M | 0, Ys[v] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: f, Dl: g, Eh: h, El: w, Fh: y, Fl: x, Gh: S, Gl: C, Hh: B, Hl: P } = this;
    for (let v = 0; v < 80; v++) {
      const T = Ze.rotrSH(h, w, 14) ^ Ze.rotrSH(h, w, 18) ^ Ze.rotrBH(h, w, 41), _ = Ze.rotrSL(h, w, 14) ^ Ze.rotrSL(h, w, 18) ^ Ze.rotrBL(h, w, 41), K = h & y ^ ~h & S, se = w & x ^ ~w & C, Q = Ze.add5L(P, _, se, M3[v], Ys[v]), V = Ze.add5H(Q, B, T, K, N3[v], Xs[v]), m = Q | 0, I = Ze.rotrSH(r, o, 28) ^ Ze.rotrBH(r, o, 34) ^ Ze.rotrBH(r, o, 39), N = Ze.rotrSL(r, o, 28) ^ Ze.rotrBL(r, o, 34) ^ Ze.rotrBL(r, o, 39), M = r & s ^ r & a ^ s & a, X = o & i ^ o & c ^ i & c;
      B = S | 0, P = C | 0, S = y | 0, C = x | 0, y = h | 0, x = w | 0, { h, l: w } = Ze.add(f | 0, g | 0, V | 0, m | 0), f = a | 0, g = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const F = Ze.add3L(m, N, X);
      r = Ze.add3H(F, V, I, M), o = F | 0;
    }
    ({ h: r, l: o } = Ze.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Ze.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Ze.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: g } = Ze.add(this.Dh | 0, this.Dl | 0, f | 0, g | 0), { h, l: w } = Ze.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: x } = Ze.add(this.Fh | 0, this.Fl | 0, y | 0, x | 0), { h: S, l: C } = Ze.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: B, l: P } = Ze.add(this.Hh | 0, this.Hl | 0, B | 0, P | 0), this.set(r, o, s, i, a, c, f, g, h, w, y, x, S, C, B, P);
  }
  roundClean() {
    Xs.fill(0), Ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, _3 = class extends Rl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, P3 = class extends Rl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, U3 = class extends Rl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ni(() => new Rl());
ni(() => new _3());
ni(() => new P3());
ni(() => new U3());
function O3(e, t, n) {
  const o = Gk;
  if (Q3(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Id.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var gn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(gn || (gn = {}));
let H3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, nm = class extends H3 {
  constructor(t) {
    super(t);
  }
};
function zl(e) {
  const t = [];
  return t.push(Ba(Df(e.version, 1))), t.push(Ba(e.hash160)), As(t);
}
function D3(e) {
  const t = [];
  return t.push(e.prefix), t.push(zl(e.address)), e.prefix === Cd.Contract && t.push(Na(e.contractName)), As(t);
}
function Na(e) {
  const t = [], n = jf(e.content), r = n.byteLength;
  return t.push(Ba(Df(r, e.lengthPrefixBytes))), t.push(n), As(t);
}
function F3(e) {
  const t = [];
  return t.push(zl(e.address)), t.push(Na(e.contractName)), t.push(Na(e.assetName)), As(t);
}
function rm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(D3(e.principal)), (e.conditionType === So.Fungible || e.conditionType === So.NonFungible) && t.push(F3(e.assetInfo)), e.conditionType === So.NonFungible && t.push(Ko(e.assetName)), t.push(e.conditionCode), e.conditionType === So.STX || e.conditionType === So.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new nm("The post-condition amount may not be larger than 8 bytes");
    t.push(Hk(e.amount, !1, 8));
  }
  return As(t);
}
function ns(e, t) {
  return As([e, t]);
}
function j3(e) {
  return new Uint8Array([e.type]);
}
function R3(e) {
  return e.type === gn.OptionalNone ? new Uint8Array([e.type]) : ns(e.type, Ko(e.value));
}
function z3(e) {
  const t = new Uint8Array(4);
  return jl(t, e.buffer.length, 0), ns(e.type, Rf(t, e.buffer));
}
function G3(e) {
  const t = Ff(Dk(e.value, BigInt(Kk)), qw);
  return ns(e.type, t);
}
function K3(e) {
  const t = Ff(e.value, qw);
  return ns(e.type, t);
}
function V3(e) {
  return ns(e.type, zl(e.address));
}
function X3(e) {
  return ns(e.type, Rf(zl(e.address), Na(e.contractName)));
}
function Y3(e) {
  return ns(e.type, Ko(e.value));
}
function q3(e) {
  const t = [], n = new Uint8Array(4);
  jl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = Ko(r);
    t.push(o);
  }
  return ns(e.type, As(t));
}
function W3(e) {
  const t = [], n = new Uint8Array(4);
  jl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = O3(o);
    t.push(Na(s));
    const i = Ko(e.data[o]);
    t.push(i);
  }
  return ns(e.type, As(t));
}
function sm(e, t) {
  const n = [], r = t == "ascii" ? Rk(e.data) : jf(e.data), o = new Uint8Array(4);
  return jl(o, r.length, 0), n.push(o), n.push(r), ns(e.type, As(n));
}
function Z3(e) {
  return sm(e, "ascii");
}
function J3(e) {
  return sm(e, "utf8");
}
function Ko(e) {
  switch (e.type) {
    case gn.BoolTrue:
    case gn.BoolFalse:
      return j3(e);
    case gn.OptionalNone:
    case gn.OptionalSome:
      return R3(e);
    case gn.Buffer:
      return z3(e);
    case gn.UInt:
      return K3(e);
    case gn.Int:
      return G3(e);
    case gn.PrincipalStandard:
      return V3(e);
    case gn.PrincipalContract:
      return X3(e);
    case gn.ResponseOk:
    case gn.ResponseErr:
      return Y3(e);
    case gn.List:
      return q3(e);
    case gn.Tuple:
      return W3(e);
    case gn.StringASCII:
      return Z3(e);
    case gn.StringUTF8:
      return J3(e);
    default:
      throw new nm("Unable to serialize. Invalid Clarity Value.");
  }
}
const Q3 = (e, t) => e ? jf(e).length > t : !1, e4 = "connect-ui";
let Fc, om, rr = !1, Nd = !1;
const Es = (e, t = "") => () => {
}, t4 = (e, t) => () => {
}, n4 = "{visibility:hidden}.hydrated{visibility:inherit}", b0 = {}, r4 = "http://www.w3.org/2000/svg", s4 = "http://www.w3.org/1999/xhtml", o4 = (e) => e != null, Vf = (e) => (e = typeof e, e === "object" || e === "function");
function im(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Ve = (e, t, ...n) => {
  let r = null, o = !1, s = !1;
  const i = [], a = (f) => {
    for (let g = 0; g < f.length; g++)
      r = f[g], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((o = typeof e != "function" && !Vf(r)) && (r = String(r)), o && s ? i[i.length - 1].$text$ += r : i.push(o ? Md(null, r) : r), s = o);
  };
  if (a(n), t) {
    const f = t.className || t.class;
    f && (t.class = typeof f != "object" ? f : Object.keys(f).filter((g) => f[g]).join(" "));
  }
  const c = Md(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, Md = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, i4 = {}, a4 = (e) => e && e.$tag$ === i4, c4 = (e, t) => e != null && !Vf(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, l4 = (e) => Qi(e).$hostElement$, u4 = (e, t, n) => {
  const r = $n.ce(t, n);
  return e.dispatchEvent(r), r;
}, x0 = /* @__PURE__ */ new WeakMap(), d4 = (e, t, n) => {
  let r = cl.get(e);
  B4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, cl.set(e, r);
}, f4 = (e, t, n, r) => {
  var o;
  let s = am(t);
  const i = cl.get(s);
  if (e = e.nodeType === 11 ? e : Jr, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = x0.get(e), c;
      if (a || x0.set(e, a = /* @__PURE__ */ new Set()), !a.has(s)) {
        {
          c = Jr.createElement("style"), c.innerHTML = i;
          const f = (o = $n.$nonce$) !== null && o !== void 0 ? o : im(Jr);
          f != null && c.setAttribute("nonce", f), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(s);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return s;
}, h4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, o = Es("attachStyles", t.$tagName$), s = f4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), o();
}, am = (e, t) => "sc-" + e.$tagName$, S0 = (e, t, n, r, o, s) => {
  if (n !== r) {
    let i = E0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, f = v0(n), g = v0(r);
      c.remove(...f.filter((h) => h && !g.includes(h))), c.add(...g.filter((h) => h && !f.includes(h)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : E0(Gl, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && $n.rel(e, t, n, !1), r && $n.ael(e, t, r, !1);
    else {
      const c = Vf(r);
      if ((i || c && r !== null) && !o)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const f = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != f) && (e[t] = f);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || s & 4 || o) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, p4 = /\s/, v0 = (e) => e ? e.split(p4) : [], cm = (e, t, n, r) => {
  const o = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || b0, i = t.$attrs$ || b0;
  for (r in s)
    r in i || S0(o, r, s[r], void 0, n, t.$flags$);
  for (r in i)
    S0(o, r, s[r], i[r], n, t.$flags$);
}, Xf = (e, t, n, r) => {
  const o = t.$children$[n];
  let s = 0, i, a;
  if (o.$text$ !== null)
    i = o.$elm$ = Jr.createTextNode(o.$text$);
  else {
    if (rr || (rr = o.$tag$ === "svg"), i = o.$elm$ = Jr.createElementNS(rr ? r4 : s4, o.$tag$), rr && o.$tag$ === "foreignObject" && (rr = !1), cm(null, o, rr), o4(Fc) && i["s-si"] !== Fc && i.classList.add(i["s-si"] = Fc), o.$children$)
      for (s = 0; s < o.$children$.length; ++s)
        a = Xf(e, o, s), a && i.appendChild(a);
    o.$tag$ === "svg" ? rr = !1 : i.tagName === "foreignObject" && (rr = !0);
  }
  return i;
}, lm = (e, t, n, r, o, s) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === om && (i = i.shadowRoot); o <= s; ++o)
    r[o] && (a = Xf(null, n, o), a && (r[o].$elm$ = a, i.insertBefore(a, t)));
}, um = (e, t, n, r, o) => {
  for (; t <= n; ++t)
    (r = e[t]) && (o = r.$elm$, o.remove());
}, g4 = (e, t, n, r) => {
  let o = 0, s = 0, i = t.length - 1, a = t[0], c = t[i], f = r.length - 1, g = r[0], h = r[f], w;
  for (; o <= i && s <= f; )
    a == null ? a = t[++o] : c == null ? c = t[--i] : g == null ? g = r[++s] : h == null ? h = r[--f] : Sc(a, g) ? (wa(a, g), a = t[++o], g = r[++s]) : Sc(c, h) ? (wa(c, h), c = t[--i], h = r[--f]) : Sc(a, h) ? (wa(a, h), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++o], h = r[--f]) : Sc(c, g) ? (wa(c, g), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], g = r[++s]) : (w = Xf(t && t[s], n, s), g = r[++s], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  o > i ? lm(e, r[f + 1] == null ? null : r[f + 1].$elm$, n, r, s, f) : s > f && um(t, o, i);
}, Sc = (e, t) => e.$tag$ === t.$tag$, wa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, o = t.$children$, s = t.$tag$, i = t.$text$;
  i === null ? (rr = s === "svg" ? !0 : s === "foreignObject" ? !1 : rr, cm(e, t, rr), r !== null && o !== null ? g4(n, r, t, o) : o !== null ? (e.$text$ !== null && (n.textContent = ""), lm(n, null, t, o, 0, o.length - 1)) : r !== null && um(r, 0, r.length - 1), rr && s === "svg" && (rr = !1)) : e.$text$ !== i && (n.data = i);
}, y4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Md(null, null), o = a4(t) ? t : Ve(null, null, t);
  om = n.tagName, o.$tag$ = null, o.$flags$ |= 4, e.$vnode$ = o, o.$elm$ = r.$elm$ = n.shadowRoot || n, Fc = n["s-sc"], wa(r, o);
}, dm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Yf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return dm(e, e.$ancestorComponent$), M4(() => w4(e, t));
}, w4 = (e, t) => {
  const n = Es("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let o;
  return n(), S4(o, () => m4(e, r, t));
}, m4 = async (e, t, n) => {
  const r = e.$hostElement$, o = Es("update", e.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && h4(e);
  const i = Es("render", e.$cmpMeta$.$tagName$);
  b4(e, t), s && (s.map((a) => a()), r["s-rc"] = void 0), i(), o();
  {
    const a = r["s-p"], c = () => x4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, b4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, y4(e, t);
  } catch (r) {
    Ma(r, e.$hostElement$);
  }
  return null;
}, x4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Es("postUpdate", t), o = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, hm(n), r(), e.$onReadyResolve$(n), o || fm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && Wf(() => Yf(e, !1)), e.$flags$ &= -517;
}, fm = (e) => {
  hm(Jr.documentElement), Wf(() => u4(Gl, "appload", { detail: { namespace: e4 } }));
}, S4 = (e, t) => e && e.then ? e.then(t) : t(), hm = (e) => e.classList.add("hydrated"), v4 = (e, t) => Qi(e).$instanceValues$.get(t), E4 = (e, t, n, r) => {
  const o = Qi(e), s = o.$instanceValues$.get(t), i = o.$flags$, a = o.$lazyInstance$;
  n = c4(n, r.$members$[t][0]);
  const c = Number.isNaN(s) && Number.isNaN(n), f = n !== s && !c;
  (!(i & 8) || s === void 0) && f && (o.$instanceValues$.set(t, n), a && (i & 18) === 2 && Yf(o, !1));
}, pm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), o = e.prototype;
    if (r.map(([s, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(o, s, {
        get() {
          return v4(this, s);
        },
        set(a) {
          E4(this, s, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      o.attributeChangedCallback = function(i, a, c) {
        $n.jmp(() => {
          const f = s.get(i);
          if (this.hasOwnProperty(f))
            c = this[f], delete this[f];
          else if (o.hasOwnProperty(f) && typeof this[f] == "number" && this[f] == c)
            return;
          this[f] = c === null && typeof this[f] == "boolean" ? !1 : c;
        });
      }, e.observedAttributes = r.filter(
        ([i, a]) => a[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, a]) => {
        const c = a[1] || i;
        return s.set(c, i), c;
      });
    }
  }
  return e;
}, A4 = async (e, t, n, r, o) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, o = T4(n), o.then) {
        const c = t4();
        o = await o, c();
      }
      o.isProxied || (pm(
        o,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), o.isProxied = !0);
      const a = Es("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new o(t);
      } catch (c) {
        Ma(c);
      }
      t.$flags$ &= -9, a();
    }
    if (o.style) {
      let a = o.style;
      const c = am(n);
      if (!cl.has(c)) {
        const f = Es("registerStyles", n.$tagName$);
        d4(c, a, !!(n.$flags$ & 1)), f();
      }
    }
  }
  const s = t.$ancestorComponent$, i = () => Yf(t, !0);
  s && s["s-rc"] ? s["s-rc"].push(i) : i();
}, k4 = (e) => {
  if (!($n.$flags$ & 1)) {
    const t = Qi(e), n = t.$cmpMeta$, r = Es("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let o = e;
        for (; o = o.parentNode || o.host; )
          if (o["s-p"]) {
            dm(t, t.$ancestorComponent$ = o);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([o, [s]]) => {
        if (s & 31 && e.hasOwnProperty(o)) {
          const i = e[o];
          delete e[o], e[o] = i;
        }
      }), A4(e, t, n);
    }
    r();
  }
}, $4 = (e) => {
  $n.$flags$ & 1 || Qi(e);
}, I4 = (e, t = {}) => {
  var n;
  const r = Es(), o = [], s = t.exclude || [], i = Gl.customElements, a = Jr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), f = /* @__PURE__ */ Jr.createElement("style"), g = [];
  let h, w = !0;
  Object.assign($n, t), $n.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Jr.baseURI).href, e.map((y) => {
    y[1].map((x) => {
      const S = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      S.$members$ = x[2];
      const C = S.$tagName$, B = class extends HTMLElement {
        // StencilLazyHost
        constructor(P) {
          super(P), P = this, C4(P, S), S.$flags$ & 1 && P.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          h && (clearTimeout(h), h = null), w ? g.push(this) : $n.jmp(() => k4(this));
        }
        disconnectedCallback() {
          $n.jmp(() => $4(this));
        }
        componentOnReady() {
          return Qi(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = y[0], !s.includes(C) && !i.get(C) && (o.push(C), i.define(C, pm(
        B,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    f.innerHTML = o + n4, f.setAttribute("data-styles", "");
    const y = (n = $n.$nonce$) !== null && n !== void 0 ? n : im(Jr);
    y != null && f.setAttribute("nonce", y), a.insertBefore(f, c ? c.nextSibling : a.firstChild);
  }
  w = !1, g.length ? g.map((y) => y.connectedCallback()) : $n.jmp(() => h = setTimeout(fm, 30)), r();
}, qf = /* @__PURE__ */ new WeakMap(), Qi = (e) => qf.get(e), L4 = (e, t) => qf.set(t.$lazyInstance$ = e, t), C4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], qf.set(e, n);
}, E0 = (e, t) => t in e, Ma = (e, t) => (0, console.error)(e, t), Au = /* @__PURE__ */ new Map(), T4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), o = e.$lazyBundleId$, s = Au.get(o);
  if (s)
    return s[r];
  {
    const i = (a) => (Au.set(o, a), a[r]);
    switch (o) {
      case "connect-modal":
        return Promise.resolve().then(() => mC).then(i, Ma);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${o}.entry.js`
  ).then((i) => (Au.set(o, i), i[r]), Ma);
}, cl = /* @__PURE__ */ new Map(), Gl = typeof window < "u" ? window : {}, Jr = Gl.document || { head: {} }, $n = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, gm = (e) => Promise.resolve(e), B4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), A0 = [], ym = [], N4 = (e, t) => (n) => {
  e.push(n), Nd || (Nd = !0, $n.$flags$ & 4 ? Wf(_d) : $n.raf(_d));
}, k0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Ma(n);
    }
  e.length = 0;
}, _d = () => {
  k0(A0), k0(ym), (Nd = A0.length > 0) && $n.raf(_d);
}, Wf = (e) => gm().then(e), M4 = /* @__PURE__ */ N4(ym), _4 = () => gm(), P4 = (e, t) => typeof window > "u" ? Promise.resolve() : _4().then(() => I4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var U4 = Object.defineProperty, O4 = Object.defineProperties, H4 = Object.getOwnPropertyDescriptors, ll = Object.getOwnPropertySymbols, wm = Object.prototype.hasOwnProperty, mm = Object.prototype.propertyIsEnumerable, $0 = (e, t, n) => t in e ? U4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, lr = (e, t) => {
  for (var n in t || (t = {})) wm.call(t, n) && $0(e, n, t[n]);
  if (ll) for (var n of ll(t)) mm.call(t, n) && $0(e, n, t[n]);
  return e;
}, Or = (e, t) => O4(e, H4(t)), bm = (e, t) => {
  var n = {};
  for (var r in e) wm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && ll) for (var r of ll(e)) t.indexOf(r) < 0 && mm.call(e, r) && (n[r] = e[r]);
  return n;
};
function xm() {
  return Ol(Do()) || window.StacksProvider || window.BlockstackProvider;
}
function Kl(e) {
  return e ? typeof e == "string" ? jo.fromName(e) : "version" in e ? e : "url" in e ? new cd({ url: e.url }) : e.transactionVersion === zo.Mainnet ? new cd({ url: e.client.baseUrl }) : new ld({ url: e.client.baseUrl }) : new ld();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var D4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(D4 || {}), F4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(F4 || {}), Zf = (e) => {
  let t = e;
  if (!t) {
    let n = new Qg(["store_write"], document.location.href);
    t = new ad({ appConfig: n });
  }
  return t;
};
function Sm(e) {
  try {
    return Zf(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var vm = (e) => {
  let t = Zf(e).loadUserData().appPrivateKey, n = vn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function j4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: o } = e;
  if (n) return n;
  if (!r || !o) return;
  let s = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Ro.Mainnet]: "mainnet", [Ro.Testnet]: "testnet" }, a = Kl(o);
  return s == null ? void 0 : s[i[a.chainId]];
}
function R4(e) {
  let t = Kl(e.network), n = Zf(e.userSession), r = Or(lr({}, e), { network: t, userSession: n });
  return lr({ stxAddress: j4(r) }, r);
}
async function z4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Xw) : n = n.map((r) => Te(rm(r)))), new vn.TokenSigner("ES256k", t).signAsync(Or(lr({}, e), { postConditions: n }));
}
function G4(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Xw) : t = t.map((n) => Te(rm(n)))), vn.createUnsecuredToken(Or(lr({}, e), { postConditions: t }));
}
var K4 = async ({ token: e, options: t }, n) => {
  var r, o, s;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = pt(a.replace(/^0x/, "")), f = Pk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Or(lr({}, i), { stacksTransaction: f }));
      return;
    }
    (o = t.onFinish) == null || o.call(t, Or(lr({}, i), { stacksTransaction: f }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (s = t.onCancel) == null || s.call(t);
  }
}, V4 = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: o } = t, s = bm(t, ["amount", "appDetails", "userSession"]);
  if (Sm(o)) {
    let { privateKey: a, publicKey: c } = vm(o), f = Or(lr({}, s), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (f.appDetails = r), z4(f, a);
  }
  let i = Or(lr({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), G4(i);
};
async function X4(e, t, n) {
  let r = await t(Or(lr(lr({}, R4(e)), e), { network: Kl(e.network) }));
  return K4({ token: r, options: e }, n);
}
function Y4(e, t = xm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return X4(e, V4, t);
}
function Em(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Or(lr({}, e), { message: e0(t), domain: e0(n) }) : Or(lr({}, e), { message: Te(Ko(t)), domain: Te(Ko(n)) });
}
async function q4(e, t) {
  return new vn.TokenSigner("ES256k", t).signAsync(Em(e));
}
async function W4(e) {
  let t = e, { userSession: n } = t, r = bm(t, ["userSession"]);
  if (Sm(n)) {
    let { privateKey: o, publicKey: s } = vm(n), i = Or(lr({}, r), { publicKey: s });
    return q4(i, o);
  }
  return vn.createUnsecuredToken(Em(e));
}
var Z4 = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(Z4 || {}), Am = "asigna-stx", I0 = (e, t) => new Promise((n) => {
  function r(o) {
    o.data.source === Am && o.data[t] && (n(o.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Q4(e, t), "*");
}), J4 = { authenticationRequest: async (e) => I0(e, "authenticationRequest"), transactionRequest: async (e) => I0(e, "transactionRequest") }, Q4 = (e, t) => ({ source: Am, [t]: e }), e$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = J4);
};
e$();
var t$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function n$(e, t = !0) {
  return function(n, r) {
    var o;
    if (r) return e(n, r);
    let s = Do(), i = xm();
    if (s && i) return e(n, i);
    if (typeof window > "u") return;
    P4();
    let a = (o = n == null ? void 0 : n.defaultProviders) != null ? o : t$, c = Xv(a), f = document.createElement("connect-modal");
    f.defaultProviders = a, f.installedProviders = c, f.persistSelection = t;
    let g = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let h = () => {
      f.remove(), document.body.style.overflow = g;
    };
    f.callback = (y) => {
      h(), e(n, y);
    }, f.cancelCallback = () => {
      var y;
      h(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(f);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), f.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var vc = n$(Y4);
function lo(e, t, n) {
  return Jf(Dn(e, t), n);
}
function Dn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Dt(r);
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
      const r = o$(BigInt(`0x${st(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${st(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function L0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Xa(e, t = 8) {
  return (typeof e == "bigint" ? e : Dn(e, !1)).toString(16).padStart(t * 2, "0");
}
function Vl(e) {
  return parseInt(e, 16);
}
function Jf(e, t = 16) {
  const n = Xa(e, t);
  return Dt(n);
}
function r$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function s$(e, t) {
  return e & BigInt(1) << t;
}
function o$(e, t) {
  return s$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const i$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function st(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += i$[n];
  return t;
}
function Dt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e;
  const t = e.length % 2 ? `0${e}` : e, n = new Uint8Array(t.length / 2);
  for (let r = 0; r < n.length; r++) {
    const o = r * 2, s = t.slice(o, o + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    n[r] = i;
  }
  return n;
}
function ea(e) {
  return new TextEncoder().encode(e);
}
function Qf(e) {
  return new TextDecoder().decode(e);
}
function km(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function a$(e) {
  return String.fromCharCode.apply(null, e);
}
function c$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function C0(e) {
  if (e.some(c$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Xl(...e) {
  if (!e.every((r) => r instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (e.length === 1)
    return e[0];
  const t = e.reduce((r, o) => r + o.length, 0), n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function rn(e) {
  return Xl(...e.map((t) => typeof t == "number" ? C0([t]) : t instanceof Array ? C0(t) : t));
}
var T0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(T0 || (T0 = {}));
var B0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(B0 || (B0 = {}));
var N0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(N0 || (N0 = {}));
const $m = 33, ku = 32;
function l$(e) {
  if (e.length < ku * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + ku * 2), r = e.slice(2 + ku * 2);
  return {
    recoveryId: Vl(t),
    r: n,
    s: r
  };
}
function u$(e) {
  const t = typeof e == "string" ? Dt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function d$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function f$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function h$(e, t) {
  return e[t];
}
function p$(e, t, n = 0) {
  return e[n] = t, e;
}
function g$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Vo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Pd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Pd || (Pd = {}));
const y$ = Pd.Mainnet, w$ = 128, m$ = 128, Im = 16, Bo = 32, Ud = 80, Yl = 65, b$ = 32, x$ = 64, ul = 34;
var Ae;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ae || (Ae = {}));
var tt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(tt || (tt = {}));
var Od;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Od || (Od = {}));
var Xn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Xn || (Xn = {}));
const jc = ["onChainOnly", "offChainOnly", "any"], M0 = {
  [jc[0]]: Xn.OnChainOnly,
  [jc[1]]: Xn.OffChainOnly,
  [jc[2]]: Xn.Any,
  [Xn.OnChainOnly]: Xn.OnChainOnly,
  [Xn.OffChainOnly]: Xn.OffChainOnly,
  [Xn.Any]: Xn.Any
};
function S$(e) {
  if (e in M0)
    return M0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${jc.join(", ")}`);
}
var dl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(dl || (dl = {}));
dl.Mainnet;
var Gi;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(Gi || (Gi = {}));
var Yn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Yn || (Yn = {}));
var Yt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Yt || (Yt = {}));
var Bt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Bt || (Bt = {}));
var fl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(fl || (fl = {}));
var Kt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Kt || (Kt = {}));
var _a;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(_a || (_a = {}));
var Hd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(Hd || (Hd = {}));
var Pa;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Pa || (Pa = {}));
var _0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(_0 || (_0 = {}));
var P0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(P0 || (P0 = {}));
function Dd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function v$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Lm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function E$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dd(e.outputLen), Dd(e.blockLen);
}
function A$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function k$(e, t) {
  Lm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Io = {
  number: Dd,
  bool: v$,
  bytes: Lm,
  hash: E$,
  exists: A$,
  output: k$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $u = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Vr = (e, t) => e << 32 - t | e >>> t, $$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function I$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function eh(e) {
  if (typeof e == "string" && (e = I$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Cm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ri(e) {
  const t = (r) => e().update(eh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function L$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), a = Number(n & s), c = r ? 4 : 0, f = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + f, a, r);
}
class th extends Cm {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = $u(this.buffer);
  }
  update(t) {
    Io.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = eh(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const a = Math.min(o - this.pos, s - i);
      if (a === o) {
        const c = $u(t);
        for (; o <= s - i; i += o)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Io.exists(this), Io.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let h = i; h < o; h++)
      n[h] = 0;
    L$(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const a = $u(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const f = c / 4, g = this.get();
    if (f > g.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let h = 0; h < f; h++)
      a.setUint32(4 * h, g[h], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: a } = this;
    return t.length = o, t.pos = a, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
}
const C$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Tm = Uint8Array.from({ length: 16 }, (e, t) => t), T$ = Tm.map((e) => (9 * e + 5) % 16);
let nh = [Tm], rh = [T$];
for (let e = 0; e < 4; e++)
  for (let t of [nh, rh])
    t.push(t[e].map((n) => C$[n]));
const Bm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), B$ = nh.map((e, t) => e.map((n) => Bm[t][n])), N$ = rh.map((e, t) => e.map((n) => Bm[t][n])), M$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), _$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ec = (e, t) => e << t | e >>> 32 - t;
function U0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ac = new Uint32Array(16);
class P$ extends th {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: t, h1: n, h2: r, h3: o, h4: s } = this;
    return [t, n, r, o, s];
  }
  set(t, n, r, o, s) {
    this.h0 = t | 0, this.h1 = n | 0, this.h2 = r | 0, this.h3 = o | 0, this.h4 = s | 0;
  }
  process(t, n) {
    for (let y = 0; y < 16; y++, n += 4)
      Ac[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, a = this.h2 | 0, c = a, f = this.h3 | 0, g = f, h = this.h4 | 0, w = h;
    for (let y = 0; y < 5; y++) {
      const x = 4 - y, S = M$[y], C = _$[y], B = nh[y], P = rh[y], v = B$[y], T = N$[y];
      for (let _ = 0; _ < 16; _++) {
        const K = Ec(r + U0(y, s, a, f) + Ac[B[_]] + S, v[_]) + h | 0;
        r = h, h = f, f = Ec(a, 10) | 0, a = s, s = K;
      }
      for (let _ = 0; _ < 16; _++) {
        const K = Ec(o + U0(x, i, c, g) + Ac[P[_]] + C, T[_]) + w | 0;
        o = w, w = g, g = Ec(c, 10) | 0, c = i, i = K;
      }
    }
    this.set(this.h1 + a + g | 0, this.h2 + f + w | 0, this.h3 + h + o | 0, this.h4 + r + i | 0, this.h0 + s + c | 0);
  }
  roundClean() {
    Ac.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const U$ = ri(() => new P$()), O$ = (e, t, n) => e & t ^ ~e & n, H$ = (e, t, n) => e & t ^ e & n ^ t & n, D$ = new Uint32Array([
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
]), qs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ws = new Uint32Array(64);
class Nm extends th {
  constructor() {
    super(64, 32, 8, !1), this.A = qs[0] | 0, this.B = qs[1] | 0, this.C = qs[2] | 0, this.D = qs[3] | 0, this.E = qs[4] | 0, this.F = qs[5] | 0, this.G = qs[6] | 0, this.H = qs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: a, H: c } = this;
    return [t, n, r, o, s, i, a, c];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = a | 0, this.H = c | 0;
  }
  process(t, n) {
    for (let h = 0; h < 16; h++, n += 4)
      Ws[h] = t.getUint32(n, !1);
    for (let h = 16; h < 64; h++) {
      const w = Ws[h - 15], y = Ws[h - 2], x = Vr(w, 7) ^ Vr(w, 18) ^ w >>> 3, S = Vr(y, 17) ^ Vr(y, 19) ^ y >>> 10;
      Ws[h] = S + Ws[h - 7] + x + Ws[h - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: a, F: c, G: f, H: g } = this;
    for (let h = 0; h < 64; h++) {
      const w = Vr(a, 6) ^ Vr(a, 11) ^ Vr(a, 25), y = g + w + O$(a, c, f) + D$[h] + Ws[h] | 0, S = (Vr(r, 2) ^ Vr(r, 13) ^ Vr(r, 22)) + H$(r, o, s) | 0;
      g = f, f = c, c = a, a = i + y | 0, i = s, s = o, o = r, r = y + S | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, f = f + this.G | 0, g = g + this.H | 0, this.set(r, o, s, i, a, c, f, g);
  }
  roundClean() {
    Ws.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class F$ extends Nm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const sh = ri(() => new Nm());
ri(() => new F$());
const kc = BigInt(2 ** 32 - 1), Fd = BigInt(32);
function Mm(e, t = !1) {
  return t ? { h: Number(e & kc), l: Number(e >> Fd & kc) } : { h: Number(e >> Fd & kc) | 0, l: Number(e & kc) | 0 };
}
function j$(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Mm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const R$ = (e, t) => BigInt(e >>> 0) << Fd | BigInt(t >>> 0), z$ = (e, t, n) => e >>> n, G$ = (e, t, n) => e << 32 - n | t >>> n, K$ = (e, t, n) => e >>> n | t << 32 - n, V$ = (e, t, n) => e << 32 - n | t >>> n, X$ = (e, t, n) => e << 64 - n | t >>> n - 32, Y$ = (e, t, n) => e >>> n - 32 | t << 64 - n, q$ = (e, t) => t, W$ = (e, t) => e, Z$ = (e, t, n) => e << n | t >>> 32 - n, J$ = (e, t, n) => t << n | e >>> 32 - n, Q$ = (e, t, n) => t << n - 32 | e >>> 64 - n, e8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function t8(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const n8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), r8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, s8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), o8 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, i8 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), a8 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Je = {
  fromBig: Mm,
  split: j$,
  toBig: R$,
  shrSH: z$,
  shrSL: G$,
  rotrSH: K$,
  rotrSL: V$,
  rotrBH: X$,
  rotrBL: Y$,
  rotr32H: q$,
  rotr32L: W$,
  rotlSH: Z$,
  rotlSL: J$,
  rotlBH: Q$,
  rotlBL: e8,
  add: t8,
  add3L: n8,
  add3H: r8,
  add4L: s8,
  add4H: o8,
  add5H: a8,
  add5L: i8
}, [c8, l8] = Je.split([
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
].map((e) => BigInt(e))), Zs = new Uint32Array(80), Js = new Uint32Array(80);
class ql extends th {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: a, Dl: c, Eh: f, El: g, Fh: h, Fl: w, Gh: y, Gl: x, Hh: S, Hl: C } = this;
    return [t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, a, c, f, g, h, w, y, x, S, C) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = f | 0, this.El = g | 0, this.Fh = h | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = x | 0, this.Hh = S | 0, this.Hl = C | 0;
  }
  process(t, n) {
    for (let v = 0; v < 16; v++, n += 4)
      Zs[v] = t.getUint32(n), Js[v] = t.getUint32(n += 4);
    for (let v = 16; v < 80; v++) {
      const T = Zs[v - 15] | 0, _ = Js[v - 15] | 0, K = Je.rotrSH(T, _, 1) ^ Je.rotrSH(T, _, 8) ^ Je.shrSH(T, _, 7), se = Je.rotrSL(T, _, 1) ^ Je.rotrSL(T, _, 8) ^ Je.shrSL(T, _, 7), Q = Zs[v - 2] | 0, V = Js[v - 2] | 0, m = Je.rotrSH(Q, V, 19) ^ Je.rotrBH(Q, V, 61) ^ Je.shrSH(Q, V, 6), I = Je.rotrSL(Q, V, 19) ^ Je.rotrBL(Q, V, 61) ^ Je.shrSL(Q, V, 6), N = Je.add4L(se, I, Js[v - 7], Js[v - 16]), M = Je.add4H(N, K, m, Zs[v - 7], Zs[v - 16]);
      Zs[v] = M | 0, Js[v] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: a, Cl: c, Dh: f, Dl: g, Eh: h, El: w, Fh: y, Fl: x, Gh: S, Gl: C, Hh: B, Hl: P } = this;
    for (let v = 0; v < 80; v++) {
      const T = Je.rotrSH(h, w, 14) ^ Je.rotrSH(h, w, 18) ^ Je.rotrBH(h, w, 41), _ = Je.rotrSL(h, w, 14) ^ Je.rotrSL(h, w, 18) ^ Je.rotrBL(h, w, 41), K = h & y ^ ~h & S, se = w & x ^ ~w & C, Q = Je.add5L(P, _, se, l8[v], Js[v]), V = Je.add5H(Q, B, T, K, c8[v], Zs[v]), m = Q | 0, I = Je.rotrSH(r, o, 28) ^ Je.rotrBH(r, o, 34) ^ Je.rotrBH(r, o, 39), N = Je.rotrSL(r, o, 28) ^ Je.rotrBL(r, o, 34) ^ Je.rotrBL(r, o, 39), M = r & s ^ r & a ^ s & a, X = o & i ^ o & c ^ i & c;
      B = S | 0, P = C | 0, S = y | 0, C = x | 0, y = h | 0, x = w | 0, { h, l: w } = Je.add(f | 0, g | 0, V | 0, m | 0), f = a | 0, g = c | 0, a = s | 0, c = i | 0, s = r | 0, i = o | 0;
      const F = Je.add3L(m, N, X);
      r = Je.add3H(F, V, I, M), o = F | 0;
    }
    ({ h: r, l: o } = Je.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Je.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: a, l: c } = Je.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: f, l: g } = Je.add(this.Dh | 0, this.Dl | 0, f | 0, g | 0), { h, l: w } = Je.add(this.Eh | 0, this.El | 0, h | 0, w | 0), { h: y, l: x } = Je.add(this.Fh | 0, this.Fl | 0, y | 0, x | 0), { h: S, l: C } = Je.add(this.Gh | 0, this.Gl | 0, S | 0, C | 0), { h: B, l: P } = Je.add(this.Hh | 0, this.Hl | 0, B | 0, P | 0), this.set(r, o, s, i, a, c, f, g, h, w, y, x, S, C, B, P);
  }
  roundClean() {
    Zs.fill(0), Js.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class u8 extends ql {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class d8 extends ql {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class f8 extends ql {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ri(() => new ql());
ri(() => new u8());
const h8 = ri(() => new d8());
ri(() => new f8());
function _m(e) {
  if (Dt(e).byteLength != Yl)
    throw Error("Invalid signature");
  return {
    type: Ae.MessageSignature,
    data: e
  };
}
function ma(e, t) {
  return { type: Ae.Address, version: e, hash160: t };
}
function $i(e) {
  return ei.c32address(e.version, e.hash160);
}
function Xo(e, t, n) {
  const r = t || 1, o = n || w$;
  if (Zm(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Ae.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function oh(e) {
  const t = ei.c32addressDecode(e);
  return {
    type: Ae.Address,
    version: t[0],
    hash160: t[1]
  };
}
var re;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(re || (re = {}));
function p8(e) {
  if (e.type === re.PrincipalStandard)
    return $i(e.address);
  if (e.type === re.PrincipalContract)
    return `${$i(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Pm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return w8(t, n);
  } else
    return g8(e);
}
function g8(e) {
  const t = oh(e);
  return { type: re.PrincipalStandard, address: t };
}
function y8(e) {
  return { type: re.PrincipalStandard, address: e };
}
function w8(e, t) {
  const n = oh(e), r = Xo(t);
  return Um(n, r);
}
function Um(e, t) {
  if (ea(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: re.PrincipalContract, address: e, contractName: t };
}
function Iu(e, t = !1) {
  switch (e.type) {
    case re.BoolTrue:
      return !0;
    case re.BoolFalse:
      return !1;
    case re.Int:
    case re.UInt:
      return t ? e.value.toString() : e.value;
    case re.Buffer:
      return `0x${st(e.buffer)}`;
    case re.OptionalNone:
      return null;
    case re.OptionalSome:
      return Nr(e.value);
    case re.ResponseErr:
      return Nr(e.value);
    case re.ResponseOk:
      return Nr(e.value);
    case re.PrincipalStandard:
    case re.PrincipalContract:
      return p8(e);
    case re.List:
      return e.list.map((r) => Nr(r));
    case re.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Nr(e.data[r]);
      }), n;
    case re.StringASCII:
      return e.data;
    case re.StringUTF8:
      return e.data;
  }
}
function Nr(e) {
  switch (e.type) {
    case re.ResponseErr:
      return { type: no(e), value: Iu(e, !0), success: !1 };
    case re.ResponseOk:
      return { type: no(e), value: Iu(e, !0), success: !0 };
    default:
      return { type: no(e), value: Iu(e, !0) };
  }
}
function no(e) {
  switch (e.type) {
    case re.BoolTrue:
    case re.BoolFalse:
      return "bool";
    case re.Int:
      return "int";
    case re.UInt:
      return "uint";
    case re.Buffer:
      return `(buff ${e.buffer.length})`;
    case re.OptionalNone:
      return "(optional none)";
    case re.OptionalSome:
      return `(optional ${no(e.value)})`;
    case re.ResponseErr:
      return `(response UnknownType ${no(e.value)})`;
    case re.ResponseOk:
      return `(response ${no(e.value)} UnknownType)`;
    case re.PrincipalStandard:
    case re.PrincipalContract:
      return "principal";
    case re.List:
      return `(list ${e.list.length} ${e.list.length ? no(e.list[0]) : "UnknownType"})`;
    case re.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${no(e.data[t])})`).join(" ")})`;
    case re.StringASCII:
      return `(string-ascii ${km(e.data).length})`;
    case re.StringUTF8:
      return `(string-utf8 ${ea(e.data).length})`;
  }
}
const Om = () => ({ type: re.BoolTrue }), Hm = () => ({ type: re.BoolFalse }), m8 = (e) => e ? Om() : Hm(), O0 = BigInt("0xffffffffffffffffffffffffffffffff"), b8 = BigInt(0), H0 = BigInt("0x7fffffffffffffffffffffffffffffff"), D0 = BigInt("-170141183460469231731687303715884105728"), x8 = (e) => {
  const t = Dn(e, !0);
  if (t > H0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${H0}`);
  if (t < D0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${D0}`);
  return { type: re.Int, value: t };
}, wn = (e) => {
  const t = Dn(e, !1);
  if (t < b8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > O0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${O0}`);
  return { type: re.UInt, value: t };
}, Dm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: re.Buffer, buffer: e };
};
function Fm() {
  return { type: re.OptionalNone };
}
function jm(e) {
  return { type: re.OptionalSome, value: e };
}
function S8(e) {
  return { type: re.ResponseErr, value: e };
}
function v8(e) {
  return { type: re.ResponseOk, value: e };
}
function E8(e) {
  return { type: re.List, list: e };
}
function ur(e) {
  for (const t in e)
    if (!f6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: re.Tuple, data: e };
}
const gt = (e) => ({ type: re.StringASCII, data: e }), A8 = (e) => ({ type: re.StringUTF8, data: e });
class Rm extends Cm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Io.hash(t);
    const r = eh(n);
    if (this.iHash = t.create(), typeof this.iHash.update != "function")
      throw new TypeError("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
    const o = this.blockLen, s = new Uint8Array(o);
    s.set(r.length > o ? t.create().update(r).digest() : r);
    for (let i = 0; i < s.length; i++)
      s[i] ^= 54;
    this.iHash.update(s), this.oHash = t.create();
    for (let i = 0; i < s.length; i++)
      s[i] ^= 106;
    this.oHash.update(s), s.fill(0);
  }
  update(t) {
    return Io.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Io.exists(this), Io.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: a } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = a, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const zm = (e, t, n) => new Rm(e, t).update(n).digest();
zm.create = (e, t) => new Rm(e, t);
qt.hmacSha256Sync = (e, ...t) => {
  const n = zm.create(sh, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Ki(e) {
  return {
    type: Ae.PublicKey,
    data: Dt(e)
  };
}
function k8(e, t, n = Kt.Compressed) {
  const r = l$(t.data), o = new ar(L0(r.r), L0(r.s)), s = nt.fromSignature(e, o, r.recoveryId), i = n === Kt.Compressed;
  return s.toHex(i);
}
function $8(e) {
  return { type: Ae.PublicKey, data: e };
}
function ta(e) {
  return !st(e.data).startsWith("04");
}
function hl(e) {
  return e.data.slice();
}
function I8(e) {
  const t = T8(e), n = Ra(t.data.slice(0, 32), t.compressed);
  return Ki(st(n));
}
function L8(e) {
  const t = typeof e == "string" ? e : st(e), n = nt.fromHex(t).toHex(!0);
  return Ki(n);
}
function C8(e) {
  const t = typeof e == "string" ? e : st(e), n = nt.fromHex(t).toHex(!1);
  return Ki(n);
}
function jd(e) {
  const t = e.readUInt8(), n = t === 4 ? x$ : b$;
  return $8(rn([t, e.readBytes(n)]));
}
function T8(e) {
  const t = u$(e), n = t.length == $m;
  return { data: t, compressed: n };
}
function B8(e, t) {
  const [n, r] = Il(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Xa(r, 1) + ar.fromHex(n).toCompactHex();
  return _m(s);
}
function N8(e) {
  return I8(e.data);
}
function M8(e, t, n) {
  return typeof e == "string" && (e = Pm(e)), typeof n == "string" && (n = R0(n)), {
    type: Ae.Payload,
    payloadType: tt.TokenTransfer,
    recipient: e,
    amount: Dn(t, !1),
    memo: n ?? R0("")
  };
}
function _8(e, t, n, r) {
  return typeof e == "string" && (e = oh(e)), typeof t == "string" && (t = Xo(t)), typeof n == "string" && (n = Xo(n)), {
    type: Ae.Payload,
    payloadType: tt.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function F0(e, t, n) {
  return typeof e == "string" && (e = Xo(e)), typeof t == "string" && (t = z8(t)), typeof n == "number" ? {
    type: Ae.Payload,
    payloadType: tt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ae.Payload,
    payloadType: tt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function P8() {
  return { type: Ae.Payload, payloadType: tt.PoisonMicroblock };
}
function j0(e, t) {
  if (e.byteLength != Bo)
    throw Error(`Coinbase buffer size must be ${Bo} bytes`);
  return t != null ? {
    type: Ae.Payload,
    payloadType: tt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ae.Payload,
    payloadType: tt.Coinbase,
    coinbaseBytes: e
  };
}
function U8(e, t, n) {
  if (e.byteLength != Bo)
    throw Error(`Coinbase buffer size must be ${Bo} bytes`);
  if (n.byteLength != Ud)
    throw Error(`VRF proof buffer size must be ${Ud} bytes`);
  return {
    type: Ae.Payload,
    payloadType: tt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === re.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Rd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Rd || (Rd = {}));
function O8(e, t, n, r, o, s, i) {
  return {
    type: Ae.Payload,
    payloadType: tt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function Gm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case tt.TokenTransfer:
      t.push(en(e.recipient)), t.push(lo(e.amount, !1, 8)), t.push(ys(e.memo));
      break;
    case tt.ContractCall:
      t.push(ys(e.contractAddress)), t.push(ys(e.contractName)), t.push(ys(e.functionName));
      const n = new Uint8Array(4);
      Vo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(en(r));
      });
      break;
    case tt.SmartContract:
      t.push(ys(e.contractName)), t.push(ys(e.codeBody));
      break;
    case tt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(ys(e.contractName)), t.push(ys(e.codeBody));
      break;
    case tt.PoisonMicroblock:
      break;
    case tt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case tt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(en(e.recipient));
      break;
    case tt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(en(e.recipient ? jm(e.recipient) : Fm())), t.push(e.vrfProof);
      break;
    case tt.TenureChange:
      t.push(Dt(e.tenureHash)), t.push(Dt(e.previousTenureHash)), t.push(Dt(e.burnViewHash)), t.push(Dt(e.previousTenureEnd)), t.push(Vo(new Uint8Array(4), e.previousTenureBlocks)), t.push(p$(new Uint8Array(1), e.cause)), t.push(Dt(e.publicKeyHash));
      break;
  }
  return rn(t);
}
function H8(e) {
  switch (e.readUInt8Enum(tt, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case tt.TokenTransfer:
      const n = br(e), r = Dn(e.readBytes(8), !1), o = Vm(e);
      return M8(n, r, o);
    case tt.ContractCall:
      const s = Vi(e), i = mr(e), a = mr(e), c = [], f = e.readUInt32BE();
      for (let v = 0; v < f; v++) {
        const T = br(e);
        c.push(T);
      }
      return _8(s, i, a, c);
    case tt.SmartContract:
      const g = mr(e), h = mr(e, 4, 1e5);
      return F0(g, h);
    case tt.VersionedSmartContract: {
      const v = e.readUInt8Enum(Od, (K) => {
        throw new Error(`Cannot recognize ClarityVersion: ${K}`);
      }), T = mr(e), _ = mr(e, 4, 1e5);
      return F0(T, _, v);
    }
    case tt.PoisonMicroblock:
      return P8();
    case tt.Coinbase: {
      const v = e.readBytes(Bo);
      return j0(v);
    }
    case tt.CoinbaseToAltRecipient: {
      const v = e.readBytes(Bo), T = br(e);
      return j0(v, T);
    }
    case tt.NakamotoCoinbase: {
      const v = e.readBytes(Bo), T = br(e), _ = e.readBytes(Ud);
      return U8(v, T, _);
    }
    case tt.TenureChange:
      const w = st(e.readBytes(20)), y = st(e.readBytes(20)), x = st(e.readBytes(20)), S = st(e.readBytes(32)), C = e.readUInt32BE(), B = e.readUInt8Enum(Rd, (v) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${v}`);
      }), P = st(e.readBytes(20));
      return O8(w, y, x, S, C, B, P);
  }
}
class Wl extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class vo extends Wl {
  constructor(t) {
    super(t);
  }
}
class ir extends Wl {
  constructor(t) {
    super(t);
  }
}
class pl extends Wl {
  constructor(t) {
    super(t);
  }
}
class Lo extends Wl {
  constructor(t) {
    super(t);
  }
}
var Mr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Mr || (Mr = {}));
function zd(e) {
  return _m(st(e.readBytes(Yl)));
}
function Ii(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ae.TransactionAuthField,
    contents: t
  };
}
function D8(e) {
  const t = e.readUInt8Enum(Mr, (n) => {
    throw new ir(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Mr.PublicKeyCompressed:
      return Ii(Kt.Compressed, jd(e));
    case Mr.PublicKeyUncompressed:
      return Ii(Kt.Uncompressed, C8(jd(e).data));
    case Mr.SignatureCompressed:
      return Ii(Kt.Compressed, zd(e));
    case Mr.SignatureUncompressed:
      return Ii(Kt.Uncompressed, zd(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function ih(e) {
  return Dt(e.data);
}
function F8(e) {
  const t = [];
  switch (e.contents.type) {
    case Ae.PublicKey:
      t.push(e.pubKeyEncoding === Kt.Compressed ? Mr.PublicKeyCompressed : Mr.PublicKeyUncompressed), t.push(hl(L8(e.contents.data)));
      break;
    case Ae.MessageSignature:
      t.push(e.pubKeyEncoding === Kt.Compressed ? Mr.SignatureCompressed : Mr.SignatureUncompressed), t.push(ih(e.contents));
      break;
  }
  return rn(t);
}
function ys(e) {
  switch (e.type) {
    case Ae.Address:
      return Ya(e);
    case Ae.Principal:
      return Km(e);
    case Ae.LengthPrefixedString:
      return Xi(e);
    case Ae.MemoString:
      return G8(e);
    case Ae.AssetInfo:
      return Xm(e);
    case Ae.PostCondition:
      return K8(e);
    case Ae.PublicKey:
      return hl(e);
    case Ae.LengthPrefixedList:
      return lh(e);
    case Ae.Payload:
      return Gm(e);
    case Ae.TransactionAuthField:
      return F8(e);
    case Ae.MessageSignature:
      return ih(e);
  }
}
function j8() {
  return {
    type: Ae.Address,
    version: fl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function ah(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Bt.SerializeP2PKH || t === Bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Bt.SerializeP2WPKH || t === Bt.SerializeP2WSH || t === Bt.SerializeP2WSHNonSequential) && !r.every(ta))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Bt.SerializeP2PKH:
      return ma(e, c6(r[0].data));
    case Bt.SerializeP2WPKH:
      return ma(e, l6(r[0].data));
    case Bt.SerializeP2SH:
    case Bt.SerializeP2SHNonSequential:
      return ma(e, u6(n, r.map(hl)));
    case Bt.SerializeP2WSH:
    case Bt.SerializeP2WSHNonSequential:
      return ma(e, d6(n, r.map(hl)));
  }
}
function Ya(e) {
  const t = [];
  return t.push(Dt(Xa(e.version, 1))), t.push(Dt(e.hash160)), rn(t);
}
function Vi(e) {
  const t = Vl(st(e.readBytes(1))), n = st(e.readBytes(20));
  return { type: Ae.Address, version: t, hash160: n };
}
function Km(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ya(e.address)), e.prefix === Pa.Contract && t.push(Xi(e.contractName)), rn(t);
}
function R8(e) {
  const t = e.readUInt8Enum(Pa, (o) => {
    throw new ir(`Unexpected Principal payload type: ${o}`);
  }), n = Vi(e);
  if (t === Pa.Standard)
    return { type: Ae.Principal, prefix: t, address: n };
  const r = mr(e);
  return {
    type: Ae.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Xi(e) {
  const t = [], n = ea(e.content), r = n.byteLength;
  return t.push(Dt(Xa(r, e.lengthPrefixBytes))), t.push(n), rn(t);
}
function mr(e, t, n) {
  t = t || 1;
  const r = Vl(st(e.readBytes(t))), o = Qf(e.readBytes(r));
  return Xo(o, t, n ?? 128);
}
function z8(e) {
  return Xo(e, 4, 1e5);
}
function R0(e) {
  if (e && Zm(e, ul))
    throw new Error(`Memo exceeds maximum length of ${ul} bytes`);
  return { type: Ae.MemoString, content: e };
}
function G8(e) {
  const t = [], n = ea(e.content), r = a6(st(n), ul * 2);
  return t.push(Dt(r)), rn(t);
}
function Vm(e) {
  let t = Qf(e.readBytes(ul));
  return t = t.replace(/\u0000*$/, ""), { type: Ae.MemoString, content: t };
}
function Xm(e) {
  const t = [];
  return t.push(Ya(e.address)), t.push(Xi(e.contractName)), t.push(Xi(e.assetName)), rn(t);
}
function Gd(e) {
  return {
    type: Ae.AssetInfo,
    address: Vi(e),
    contractName: mr(e),
    assetName: mr(e)
  };
}
function ch(e, t) {
  return {
    type: Ae.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function lh(e) {
  const t = e.values, n = [];
  n.push(Dt(Xa(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(ys(r));
  return rn(n);
}
function Ym(e, t, n) {
  const r = Vl(st(e.readBytes(4))), o = [];
  for (let s = 0; s < r; s++)
    switch (t) {
      case Ae.Address:
        o.push(Vi(e));
        break;
      case Ae.LengthPrefixedString:
        o.push(mr(e));
        break;
      case Ae.MemoString:
        o.push(Vm(e));
        break;
      case Ae.AssetInfo:
        o.push(Gd(e));
        break;
      case Ae.PostCondition:
        o.push(V8(e));
        break;
      case Ae.PublicKey:
        o.push(jd(e));
        break;
      case Ae.TransactionAuthField:
        o.push(D8(e));
        break;
    }
  return ch(o, n);
}
function K8(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Km(e.principal)), (e.conditionType === Yn.Fungible || e.conditionType === Yn.NonFungible) && t.push(Xm(e.assetInfo)), e.conditionType === Yn.NonFungible && t.push(en(e.assetName)), t.push(e.conditionCode), e.conditionType === Yn.STX || e.conditionType === Yn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new vo("The post-condition amount may not be larger than 8 bytes");
    t.push(lo(e.amount, !1, 8));
  }
  return rn(t);
}
function V8(e) {
  const t = e.readUInt8Enum(Yn, (i) => {
    throw new ir(`Could not read ${i} as PostConditionType`);
  }), n = R8(e);
  let r, o, s;
  switch (t) {
    case Yn.STX:
      return r = e.readUInt8Enum(_a, (a) => {
        throw new ir(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${st(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Yn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Yn.Fungible:
      return o = Gd(e), r = e.readUInt8Enum(_a, (a) => {
        throw new ir(`Could not read ${a} as FungibleConditionCode`);
      }), s = BigInt(`0x${st(e.readBytes(8))}`), {
        type: Ae.PostCondition,
        conditionType: Yn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: o
      };
    case Yn.NonFungible:
      o = Gd(e);
      const i = br(e);
      return r = e.readUInt8Enum(Hd, (a) => {
        throw new ir(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Ae.PostCondition,
        conditionType: Yn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: o,
        assetName: i
      };
  }
}
function rs(e, t) {
  return rn([e, t]);
}
function X8(e) {
  return new Uint8Array([e.type]);
}
function Y8(e) {
  return e.type === re.OptionalNone ? new Uint8Array([e.type]) : rs(e.type, en(e.value));
}
function q8(e) {
  const t = new Uint8Array(4);
  return Vo(t, e.buffer.length, 0), rs(e.type, Xl(t, e.buffer));
}
function W8(e) {
  const t = Jf(r$(e.value, BigInt(m$)), Im);
  return rs(e.type, t);
}
function Z8(e) {
  const t = Jf(e.value, Im);
  return rs(e.type, t);
}
function J8(e) {
  return rs(e.type, Ya(e.address));
}
function Q8(e) {
  return rs(e.type, Xl(Ya(e.address), Xi(e.contractName)));
}
function e6(e) {
  return rs(e.type, en(e.value));
}
function t6(e) {
  const t = [], n = new Uint8Array(4);
  Vo(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = en(r);
    t.push(o);
  }
  return rs(e.type, rn(t));
}
function n6(e) {
  const t = [], n = new Uint8Array(4);
  Vo(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Xo(o);
    t.push(Xi(s));
    const i = en(e.data[o]);
    t.push(i);
  }
  return rs(e.type, rn(t));
}
function qm(e, t) {
  const n = [], r = t == "ascii" ? km(e.data) : ea(e.data), o = new Uint8Array(4);
  return Vo(o, r.length, 0), n.push(o), n.push(r), rs(e.type, rn(n));
}
function r6(e) {
  return qm(e, "ascii");
}
function s6(e) {
  return qm(e, "utf8");
}
function en(e) {
  switch (e.type) {
    case re.BoolTrue:
    case re.BoolFalse:
      return X8(e);
    case re.OptionalNone:
    case re.OptionalSome:
      return Y8(e);
    case re.Buffer:
      return q8(e);
    case re.UInt:
      return Z8(e);
    case re.Int:
      return W8(e);
    case re.PrincipalStandard:
      return J8(e);
    case re.PrincipalContract:
      return Q8(e);
    case re.ResponseOk:
    case re.ResponseErr:
      return e6(e);
    case re.List:
      return t6(e);
    case re.Tuple:
      return n6(e);
    case re.StringASCII:
      return r6(e);
    case re.StringUTF8:
      return s6(e);
    default:
      throw new vo("Unable to serialize. Invalid Clarity Value.");
  }
}
function o6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const z0 = /* @__PURE__ */ new Map();
function Wm(e, t) {
  const n = z0.get(e);
  if (n !== void 0)
    return n(t);
  const r = o6(e);
  return z0.set(e, r), Wm(e, t);
}
class Aa {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return g$(this.readBytes(4), 0);
  }
  readUInt8() {
    return h$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return d$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = st(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = st(n);
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
    if (Wm(t, r))
      return r;
    throw n(r);
  }
}
function br(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Aa(Dt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Aa(e) : t = e;
  switch (t.readUInt8Enum(re, (r) => {
    throw new ir(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case re.Int:
      return x8(t.readBytes(16));
    case re.UInt:
      return wn(t.readBytes(16));
    case re.Buffer:
      const r = t.readUInt32BE();
      return Dm(t.readBytes(r));
    case re.BoolTrue:
      return Om();
    case re.BoolFalse:
      return Hm();
    case re.PrincipalStandard:
      const o = Vi(t);
      return y8(o);
    case re.PrincipalContract:
      const s = Vi(t), i = mr(t);
      return Um(s, i);
    case re.ResponseOk:
      return v8(br(t));
    case re.ResponseErr:
      return S8(br(t));
    case re.OptionalNone:
      return Fm();
    case re.OptionalSome:
      return jm(br(t));
    case re.List:
      const a = t.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(br(t));
      return E8(c);
    case re.Tuple:
      const f = t.readUInt32BE(), g = {};
      for (let S = 0; S < f; S++) {
        const C = mr(t).content;
        if (C === void 0)
          throw new ir('"content" is undefined');
        g[C] = br(t);
      }
      return ur(g);
    case re.StringASCII:
      const h = t.readUInt32BE(), w = a$(t.readBytes(h));
      return gt(w);
    case re.StringUTF8:
      const y = t.readUInt32BE(), x = Qf(t.readBytes(y));
      return A8(x);
    default:
      throw new ir("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const i6 = (e) => e.length % 2 == 0 ? e : `0${e}`, a6 = (e, t) => e.padEnd(t, "0"), Zm = (e, t) => e ? ea(e).length > t : !1;
function Kd(e) {
  return yw(e);
}
const Ua = (e) => U$(sh(e)), uh = (e) => st(h8(e)), c6 = (e) => st(Ua(e)), l6 = (e) => {
  const t = Ua(e), n = Xl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ua(n);
  return st(r);
}, u6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = rn(n), o = Ua(r);
  return st(o);
}, d6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = rn(n), o = sh(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = rn(s), a = Ua(i);
  return st(a);
};
function f6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Jm(e) {
  const t = en(e);
  return `0x${st(t)}`;
}
function h6(e) {
  return br(e);
}
const Ti = (e) => {
  try {
    return ei.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function dh() {
  return {
    type: Ae.MessageSignature,
    data: st(new Uint8Array(Yl))
  };
}
function Qm(e, t, n, r) {
  const o = ah(0, e, 1, [Ki(t)]).hash160, s = ta(Ki(t)) ? Kt.Compressed : Kt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Dn(n, !1),
    fee: Dn(r, !1),
    keyEncoding: s,
    signature: dh()
  };
}
function Oa(e) {
  return "signature" in e;
}
function G0(e) {
  return e === Bt.SerializeP2SH || e === Bt.SerializeP2WSH;
}
function p6(e) {
  return e === Bt.SerializeP2SHNonSequential || e === Bt.SerializeP2WSHNonSequential;
}
function K0(e) {
  const t = Kd(e);
  return t.nonce = 0, t.fee = 0, Oa(t) ? t.signature = dh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function g6(e) {
  const t = [
    e.hashMode,
    Dt(e.signer),
    lo(e.nonce, !1, 8),
    lo(e.fee, !1, 8),
    e.keyEncoding,
    ih(e.signature)
  ];
  return rn(t);
}
function y6(e) {
  const t = [
    e.hashMode,
    Dt(e.signer),
    lo(e.nonce, !1, 8),
    lo(e.fee, !1, 8)
  ], n = ch(e.fields);
  t.push(lh(n));
  const r = new Uint8Array(2);
  return f$(r, e.signaturesRequired, 0), t.push(r), rn(t);
}
function w6(e, t) {
  const n = st(t.readBytes(20)), r = BigInt(`0x${st(t.readBytes(8))}`), o = BigInt(`0x${st(t.readBytes(8))}`), s = t.readUInt8Enum(Kt, (a) => {
    throw new ir(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Bt.SerializeP2WPKH && s != Kt.Compressed)
    throw new ir("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = zd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function m6(e, t) {
  const n = st(t.readBytes(20)), r = BigInt("0x" + st(t.readBytes(8))), o = BigInt("0x" + st(t.readBytes(8))), s = Ym(t, Ae.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const f of s)
    switch (f.contents.type) {
      case Ae.PublicKey:
        ta(f.contents) || (i = !0);
        break;
      case Ae.MessageSignature:
        if (f.pubKeyEncoding === Kt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Lo("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Bt.SerializeP2WSH || e === Bt.SerializeP2WSHNonSequential))
    throw new Lo("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: c
  };
}
function Lu(e) {
  return Oa(e) ? g6(e) : y6(e);
}
function Cu(e) {
  const t = e.readUInt8Enum(Bt, (n) => {
    throw new ir(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Bt.SerializeP2PKH || t === Bt.SerializeP2WPKH ? w6(t, e) : m6(t, e);
}
function eb(e, t, n, r) {
  const s = e + st(new Uint8Array([t])) + st(lo(n, !1, 8)) + st(lo(r, !1, 8));
  if (Dt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return uh(Dt(s));
}
function tb(e, t, n) {
  const r = 33 + Yl, o = ta(t) ? Kt.Compressed : Kt.Uncompressed, s = e + i6(o.toString(16)) + n.data, i = Dt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return uh(i);
}
function b6(e, t, n, r, o) {
  const s = eb(e, t, n, r), i = B8(o, s), a = N8(o), c = tb(s, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function nb(e, t, n, r, o, s) {
  const i = eb(e, t, n, r), a = Ki(k8(i, s, o)), c = tb(i, a, s);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function x6() {
  const e = Qm(Bt.SerializeP2PKH, "", 0, 0);
  return e.signer = j8().hash160, e.keyEncoding = Kt.Compressed, e.signature = dh(), e;
}
function V0(e, t, n) {
  return Oa(e) ? S6(e, t, n) : v6(e, t, n);
}
function S6(e, t, n) {
  const { pubKey: r, nextSigHash: o } = nb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = ah(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Lo(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function v6(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ae.PublicKey:
        ta(c.contents) || (s = !0), r.push(c.contents);
        break;
      case Ae.MessageSignature:
        c.pubKeyEncoding === Kt.Uncompressed && (s = !0);
        const { pubKey: f, nextSigHash: g } = nb(o, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (G0(e.hashMode) && (o = g), r.push(f), i += 1, i === 65536)
          throw new Lo("Too many signatures");
        break;
    }
  if (G0(e.hashMode) && i !== e.signaturesRequired || p6(e.hashMode) && i < e.signaturesRequired)
    throw new Lo("Incorrect number of signatures");
  if (s && (e.hashMode === Bt.SerializeP2WSH || e.hashMode === Bt.SerializeP2WSHNonSequential))
    throw new Lo("Uncompressed keys are not allowed in this hash mode");
  const a = ah(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Lo(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return o;
}
function rb(e) {
  return {
    authType: Yt.Standard,
    spendingCondition: e
  };
}
function sb(e, t) {
  return {
    authType: Yt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Qm(Bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function X0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Yt.Standard:
        return rb(K0(e.spendingCondition));
      case Yt.Sponsored:
        return sb(K0(e.spendingCondition), x6());
      default:
        throw new pl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function E6(e, t) {
  switch (e.authType) {
    case Yt.Standard:
      return V0(e.spendingCondition, t, Yt.Standard);
    case Yt.Sponsored:
      return V0(e.spendingCondition, t, Yt.Standard);
    default:
      throw new pl("Invalid origin auth type");
  }
}
function A6(e, t) {
  switch (e.authType) {
    case Yt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Dn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Yt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Dn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function k6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Dn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function $6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Dn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function I6(e, t) {
  const n = {
    ...t,
    nonce: Dn(t.nonce, !1),
    fee: Dn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function L6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Yt.Standard:
      t.push(Lu(e.spendingCondition));
      break;
    case Yt.Sponsored:
      t.push(Lu(e.spendingCondition)), t.push(Lu(e.sponsorSpendingCondition));
      break;
  }
  return rn(t);
}
function C6(e) {
  const t = e.readUInt8Enum(Yt, (r) => {
    throw new ir(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Yt.Standard:
      return n = Cu(e), rb(n);
    case Yt.Sponsored:
      n = Cu(e);
      const r = Cu(e);
      return sb(n, r);
  }
}
class T6 {
  constructor(t, n, r, o, s, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Dn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? y$, this.postConditionMode = s ?? Gi.Deny, this.postConditions = o ?? ch([]), i)
      this.anchorMode = S$(i);
    else
      switch (r.payloadType) {
        case tt.Coinbase:
        case tt.CoinbaseToAltRecipient:
        case tt.NakamotoCoinbase:
        case tt.PoisonMicroblock:
        case tt.TenureChange:
          this.anchorMode = Xn.OnChainOnly;
          break;
        case tt.ContractCall:
        case tt.SmartContract:
        case tt.VersionedSmartContract:
        case tt.TokenTransfer:
          this.anchorMode = Xn.Any;
          break;
      }
  }
  signBegin() {
    const t = Kd(this);
    return t.auth = X0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Kd(this);
    return t.auth = X0(t.auth), t.txid();
  }
  verifyOrigin() {
    return E6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Yt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Yt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Yt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !Oa(n)) {
      const r = ta(t);
      n.fields.push(Ii(r ? Kt.Compressed : Kt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = b6(n, r, t.fee, t.nonce, o);
    return Oa(t) ? t.signature = s : t.fields.push(Ii(o.data.byteLength === $m ? Kt.Compressed : Kt.Uncompressed, s)), i;
  }
  txid() {
    const t = this.serialize();
    return uh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Yt.Sponsored)
      throw new pl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = I6(this.auth, t);
  }
  setFee(t) {
    this.auth = A6(this.auth, t);
  }
  setNonce(t) {
    this.auth = k6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Yt.Sponsored)
      throw new pl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = $6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new vo('"version" is undefined');
    if (this.chainId === void 0)
      throw new vo('"chainId" is undefined');
    if (this.auth === void 0)
      throw new vo('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new vo('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new vo('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Vo(n, this.chainId, 0), t.push(n), t.push(L6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(lh(this.postConditions)), t.push(Gm(this.payload)), rn(t);
  }
}
function Li(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new Aa(Dt(e.slice(2))) : t = new Aa(Dt(e)) : e instanceof Uint8Array ? t = new Aa(e) : t = e;
  const n = t.readUInt8Enum(dl, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = C6(t), s = t.readUInt8Enum(Xn, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), i = t.readUInt8Enum(Gi, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Ym(t, Ae.PostCondition), c = H8(t);
  return new T6(n, o, c, a, i, s, r);
}
const B6 = m8, ka = wn, N6 = Dm;
const M6 = /* @__PURE__ */ new Set([4001, -31001]), _6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], P6 = ["result", "data", "payload", "response", "params"], Y0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Zl = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), si = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, Ss = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, U6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), ob = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => U6(s, r)) === o
  );
}, ib = (e) => e ? ob(si()).some(
  (t) => {
    var n;
    return t.id === e && (Zl(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, ab = () => {
  if (typeof window > "u")
    return;
  const e = si(), t = ob(e).filter(
    (n) => {
      var r;
      return Zl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = Ss(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of _6) {
    const r = Ss(e, n) ?? (e === window ? void 0 : Ss(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, O6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = si(), n = Ss(t, e) ?? (t === window ? void 0 : Ss(window, e)) ?? Ol(e);
  if (n)
    return n;
  if (Zl(e) || ib(e))
    return ab();
}, $c = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, H6 = ["blockstack-session", "blockstack"], D6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of H6) {
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
D6();
const cb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, sr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, F6 = (e) => {
  const t = sr(e);
  if (!t)
    return null;
  const n = cb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, j6 = (e) => {
  const t = sr(e);
  if (!t)
    return null;
  const n = cb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Vd = (e, t = "mainnet") => {
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
      return Vd(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Vd(r, t);
  }
  return t;
}, No = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Ha = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const o = e.trim();
    return Ti(o) ? o : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = Ha(o, t + 1);
      if (s)
        return s;
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
  for (const o of r) {
    if (!(o in n))
      continue;
    const s = Ha(n[o], t + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && Ti(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Ti(n.testnet) ? n.testnet.trim() : null;
}, q0 = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, lb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && M6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Yo = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = sr(n == null ? void 0 : n.message) ?? sr(t.message) ?? sr(t.error) ?? sr(e) ?? "Wallet provider request failed.", o = new Error(r);
  return o.code = (n == null ? void 0 : n.code) ?? t.code, o.data = (n == null ? void 0 : n.data) ?? t.data, o;
}, Yi = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Yo(t);
    if (t.status === "error")
      throw Yo(t.result ?? t);
  }
  return e;
}, W0 = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return Yi(r);
  } catch (r) {
    throw Yo(r);
  }
}, ub = () => ab(), fh = () => {
  if (typeof window > "u")
    return;
  const e = si();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Ss(e, t) ?? (e === window ? void 0 : Ss(window, t));
    if (n)
      return n;
  }
}, Z0 = () => {
  if (typeof window > "u")
    return;
  const e = fh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = si();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Ss(t, n) ?? (t === window ? void 0 : Ss(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Rc = (e) => {
  var r, o;
  const t = Do();
  if (Zl(t) || ib(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = si() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) || e === ub();
}, Tu = (e) => {
  const t = j6(e);
  if (!t)
    return null;
  try {
    const n = Li(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, gl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Tu(e), r = F6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? sr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = gl(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const o = e;
  let s = null;
  for (const a of Y0)
    if (Tu(o[a])) {
      s = sr(o[a]);
      break;
    }
  const i = sr(o.txId) || sr(o.txid) || sr(o.transactionId);
  if (i)
    return {
      ...o,
      txId: i,
      txid: i,
      txRaw: s ?? sr(o.txRaw) ?? void 0
    };
  for (const a of Y0) {
    const c = Tu(o[a]);
    if (c)
      return {
        ...o,
        txId: c,
        txid: c,
        txRaw: sr(o[a]) ?? void 0
      };
  }
  for (const a of P6) {
    const c = o[a], f = gl(c, t + 1);
    if (f)
      return {
        ...o,
        ...c && typeof c == "object" ? c : {},
        ...f,
        txId: f.txId,
        txid: f.txid ?? f.txId
      };
  }
  return null;
}, Bu = (e) => {
  const t = gl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, R6 = (e) => {
  const t = gl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, z6 = (e) => ({
  ...e,
  fee: No(e.fee),
  nonce: No(e.nonce),
  sponsored: e.sponsored === !0
}), J0 = (e) => ({
  recipient: e.recipient,
  amount: No(e.amount) ?? "0",
  memo: e.memo,
  network: Vd(e.network),
  address: e.stxAddress,
  fee: No(e.fee),
  nonce: No(e.nonce),
  sponsored: e.sponsored ?? !1
}), db = "WALLET_ADDRESS_MISMATCH", G6 = 45e3;
let $a = null;
const Xd = (e) => {
  e && ($a = { address: e, at: Date.now() });
}, K6 = () => {
  $a = null;
}, V6 = () => $a && Date.now() - $a.at <= G6 ? $a.address : null, X6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, Y6 = async (e) => {
  K6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = Yi(await e.request("wallet_connect")), n = Ha(t);
  return Xd(n), n;
}, q6 = async (e, t, n, r) => {
  try {
    return Yi(await e.request(t, n));
  } catch (o) {
    const s = Yo(o);
    if (!X6(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: s.message
    });
    let i = null;
    try {
      i = await Y6(e);
    } catch (a) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: a instanceof Error ? a.message : String(a)
      }), s;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: i ? db : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return Yi(await e.request(t, n));
    } catch (a) {
      throw Yo(a);
    }
  }
};
let Q0 = 3e4;
const W6 = (e, t) => {
  let n;
  const r = new Promise((o, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${Q0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Q0);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, Z6 = async (e, t, n) => {
  const r = (c, f) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${f}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: db }
      );
    return c;
  }, o = V6();
  if (o)
    return $c(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: o }), r(o, "cached-session");
  let s = null;
  $c(n, "account-read");
  try {
    const c = Yi(
      await W6(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Ha(c), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (c) {
    if (lb(c))
      throw Yo(c);
    $c(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (s)
    return Xd(s), r(s, "wallet_getAccount");
  let i;
  $c(n, "account-reconnect");
  try {
    i = Yi(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Yo(c);
  }
  const a = Ha(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Xd(a), r(a, "wallet_connect");
}, J6 = async (e, t) => {
  if (!Rc(e)) {
    const s = await W0(
      e,
      "stx_transferStx",
      J0(t)
    );
    return Bu(s);
  }
  const n = fh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await W0(
      n,
      "stx_transferStx",
      J0(t)
    );
    return Bu(s);
  }
  const r = ub();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await Z6(r, t.stxAddress);
  const o = await q6(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: No(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: No(t.fee) } : {}
    },
    t.stxAddress
  );
  return Bu(o);
}, Q6 = () => Do(), fb = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const e = Do(), t = e ? O6(e) : void 0;
  if (t)
    return t;
  const n = si() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, eg = (e, t) => {
  const n = fb(), r = z6({
    ...e,
    onFinish: (o) => {
      var s;
      (s = e.onFinish) == null || s.call(e, R6(o));
    }
  });
  if (!n || typeof n.request != "function")
    return vc(r, t);
  if (Rc(n) && !fh()) {
    const o = Z0();
    if (o)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Do(),
        route: "legacy-transaction-request"
      }), vc(r, o);
  }
  return void J6(n, e).then((o) => {
    var s;
    (s = e.onFinish) == null || s.call(e, o);
  }).catch((o) => {
    var s, i;
    if (q0(o) && Rc(n)) {
      const a = Z0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Do(),
          route: "legacy-transaction-request"
        }), vc(r, a);
        return;
      }
    }
    if (q0(o) && !Rc(n)) {
      vc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", o), lb(o)) {
      (s = e.onCancel) == null || s.call(e);
      return;
    }
    if (e.onError) {
      e.onError(o);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, e5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), tg = (e) => Jm(e).replace(/^0x/, ""), ng = "This wallet cannot sign messages. Try Xverse or Leather.", rg = (e) => typeof (e == null ? void 0 : e.request) == "function", sg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", t5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, n5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function r5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: tg(t.message),
    domain: tg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function s5(e, t) {
  const n = await W4({
    domain: t.domain,
    message: t.message,
    network: Kl(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? e5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Nu(e) {
  var o, s;
  const t = Q6() || "", n = /xverse/i.test(t);
  let r = fb();
  if (n && !sg(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (sg(r))
    try {
      return await s5(r, e);
    } catch (i) {
      if (n || !rg(r) || !n5(i)) throw i;
    }
  if (!n && rg(r))
    try {
      return await r5(r, e);
    } catch (i) {
      throw t5(i) ? new Error(ng) : i;
    }
  throw new Error(ng);
}
const og = 1000000n, ms = 1000000n, yl = 50n, tn = 3000n, Hr = 300n, da = 3000n, o5 = 50000n, i5 = 300n, a5 = 200n, Jl = 15000n, In = (e) => e + yl;
function Tr(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / og}.${(n % og).toString().padStart(6, "0")}`;
}
function ig(e, t = Hr) {
  return e <= tn ? 0 : Number((e - tn) / In(t));
}
function Mu(e, t = 0n) {
  const n = ms - e - t;
  return n > 0n ? n : 0n;
}
function c5(e, t = Hr) {
  return e > ms ? "over" : e < tn + In(t) ? "empty" : e < o5 ? "low" : "ok";
}
const l5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", u5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", d5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function f5(e) {
  var n, r, o, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((o = t["holder-payment"]) == null ? void 0 : o.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || d5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== l5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const hb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", _u = 3, h5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", p5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", ag = 1, [Yd, pb] = hb.split("."), gr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function qd(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function g5(e) {
  return gr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function ao(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function gb(e, t = []) {
  const n = await ao(`/v2/contracts/call-read/${Yd}/${pb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Yd, arguments: t.map((r) => "0x" + gr(en(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Nr(br(n.result));
}
async function y5() {
  const e = await ao(`/v2/contracts/source/${Yd}/${pb}?proof=0`);
  if (typeof e.source != "string" || await g5(e.source) !== u5) throw Error("Deployed source does not match the tested helper.");
  if (f5(await gb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function yb(e) {
  return e.startsWith("SP") && Ti(e) && !e.includes(".");
}
async function w5(e) {
  var r;
  if (!yb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await ao(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await ao(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function m5(e) {
  const t = await ao(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function b5(e, t) {
  var o, s;
  const n = await gb("get-owner", [ka(e), ka(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (o = n.value) == null ? void 0 : o.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !yb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function x5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: qd(e), signal: AbortSignal.timeout(15e3) });
  } catch {
    throw Error("Submission outcome unknown. Reconcile the saved transaction before doing anything else.");
  }
  const r = await n.json();
  if (n.status === 400 && (r == null ? void 0 : r.reason) === "FeeTooLow") {
    const o = new Error("Node rejected the fee as too low. No automatic increase. Preview a new test with another fee.");
    throw Object.assign(o, { feeRejected: !0 }), o;
  }
  if (!n.ok || typeof r != "string" || r.replace(/^0x/, "") !== t.replace(/^0x/, "")) throw Error(`Submission unconfirmed (${n.status}). Reconcile or resend the same saved transaction; do not create a replacement.`);
  return r;
}
async function S5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function v5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Li(qd(e.raw)), n = t.auth, r = t.payload, o = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || o.hashMode !== 0 || $i(ma(fl.MainnetSingleSig, o.signer)) !== e.address || o.fee !== BigInt(e.fee) || o.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const s = t.postConditions.values[0];
    if (r.payloadType !== 2 || $i(r.contractAddress) + "." + r.contractName.content !== hb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || gr(en(r.functionArgs[0])) !== gr(en(ka(e.core))) || gr(en(r.functionArgs[1])) !== gr(en(ka(e.song))) || gr(en(r.functionArgs[2])) !== gr(en(N6(qd(e.id)))) || e.amount !== "50" || t.postConditionMode !== Gi.Deny || t.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== _a.Equal || s.principal.prefix !== 2 || $i(s.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || $i(r.contractAddress) + "." + r.contractName.content !== h5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || gr(en(r.functionArgs[0])) !== gr(en(ka(e.song))) || typeof e.liked != "boolean" || gr(en(r.functionArgs[1])) !== gr(en(B6(e.liked))) || e.amount !== "0" || t.postConditionMode !== Gi.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Nr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const E5 = "xtrata.xyz/radio/listening-wallet", A5 = "Link a temporary listening wallet for pay-per-play; no spending permission", qr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Ti(e), k5 = (e) => ({
  domain: ur({ name: gt(E5), version: gt("1"), "chain-id": wn(1) }),
  message: ur({
    purpose: gt(A5),
    main: gt(e.main),
    listening: gt(e.listening),
    issued: wn(e.issued)
  })
}), wb = 100000n, $5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function I5(e, t) {
  const n = e.filter((o) => !o || typeof o.sender != "string" || o.sender === t || !qr(o.sender) || !/^\d+$/.test(o.amount) ? !1 : BigInt(o.amount) >= wb).sort($5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((o) => o.sender)).size };
}
const Ic = 50;
function wl(e) {
  const t = e;
  if (!t || typeof t.total != "number" || !Number.isSafeInteger(t.total) || t.total < 0 || !Array.isArray(t.results)) return null;
  const n = [];
  for (const r of t.results) {
    if (typeof (r == null ? void 0 : r.sender) != "string" || typeof r.amount != "string" || typeof r.tx_id != "string") return null;
    const o = Number(r.block_height), s = Number(r.tx_index ?? 0);
    if (!Number.isSafeInteger(o) || !Number.isSafeInteger(s)) return null;
    n.push({ sender: r.sender, amount: r.amount, txId: r.tx_id, blockHeight: o, txIndex: s });
  }
  return { total: t.total, transfers: n };
}
async function L5(e, t, n = 4) {
  if (!qr(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Ic}&offset=${i}`, o = wl(await t(r(0)));
    if (!o || o.total > 0 && !o.transfers.length) return { ok: !1 };
    if (o.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, o.total - Ic);
    for (let i = 0; i < n; i++) {
      const a = s === 0 && o.total <= Ic ? o : wl(await t(r(s)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = I5(a.transfers, e);
      if (c.ok && c.funder) return s > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (s === 0) return c;
      s = Math.max(0, s - Ic);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const ps = 50, C5 = 6, T5 = 20, cg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function lg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], o = [];
  for (const s of n.results) {
    const i = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (o.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), f = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(f)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: f });
  }
  return { total: n.total, sent: r, rows: o };
}
async function B5(e, t, n) {
  if (!qr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), o = wl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${ps}&offset=0`));
    if (!o || o.total > C5 * ps) return { ok: !1 };
    for (const i of o.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = ps; i < o.total; i += ps) {
      const a = wl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${ps}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== o.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const i = (f) => `/extended/v1/address/${e}/transactions?limit=${ps}&offset=${f}`, a = lg(await t(i(0)), e);
      if (!a || a.total > T5 * ps) return { ok: !1 };
      const c = new Set(a.rows);
      for (const f of a.sent) s.set(f.txId, f);
      for (let f = ps; f < a.total; f += ps) {
        const g = lg(await t(i(f)), e);
        if (!g || !g.rows.length) return { ok: !1 };
        for (const h of g.rows) c.add(h);
        for (const h of g.sent) s.set(h.txId, h);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function N5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const o = [...e.inbound].filter((h) => h && typeof h.sender == "string" && h.sender !== t && /^\d+$/.test(h.amount) && BigInt(h.amount) > 0n).sort(cg).map((h, w) => {
    const y = BigInt(h.amount);
    return r && h.sender === r.sender ? { sender: h.sender, left: y, kind: "gift", to: r.payer, at: w } : qr(h.sender) && y >= wb ? { sender: h.sender, left: y, kind: "deposit", to: h.sender, at: w } : { sender: h.sender, left: y, kind: "dust", to: null, at: w };
  }), s = o.reduce((h, w) => h + w.left, 0n), i = [...e.outgoing].filter((h) => h && h.recipient !== t && qr(h.recipient) && h.amount > 0n).sort(cg), a = i.reduce((h, w) => h + w.amount, 0n), c = s - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const f = (h, w) => {
    let y = w;
    for (const x of h) {
      if (y <= 0n) break;
      const S = x.left < y ? x.left : y;
      x.left -= S, y -= S;
    }
    return y;
  };
  for (const h of i) {
    const w = f(o.filter((y) => y.to === h.recipient), h.amount);
    w > 0n && f(o, w);
  }
  if (f(o, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (o.reduce((h, w) => h + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const g = /* @__PURE__ */ new Map();
  for (const h of o) {
    if (h.left <= 0n) continue;
    const w = `${h.kind}:${h.to ?? ""}`, y = g.get(w);
    y ? (y.amount += h.left, y.newest = Math.max(y.newest, h.at)) : g.set(w, { to: h.to, kind: h.kind, amount: h.left, newest: h.at });
  }
  return {
    ok: !0,
    parts: [...g.values()].sort((h, w) => h.newest - w.newest),
    hasTopUp: o.some((h) => h.kind === "deposit")
  };
}
function M5(e, t) {
  const n = e.filter((f) => f.kind === "deposit").sort((f, g) => f.newest - g.newest), r = e.find((f) => f.kind === "gift"), o = e.filter((f) => f.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + o.reduce((f, g) => f + g.amount, 0n), i = [], a = [], c = s > t;
  return n.forEach((f, g) => {
    if (f.amount <= t) {
      a.push(f);
      return;
    }
    const h = g === n.length - 1 && !c;
    i.push({ to: f.to, kind: "deposit", mode: h ? "all" : "amount", send: f.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - t }) : (r && a.push(r), a.push(...o)), { steps: i, tooSmall: a };
}
function ug(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Lc = 1500n, zc = [100, 250, 500], _5 = (e, t) => BigInt(e) * In(t), fa = ["prepared", "signed", "unknown", "pending"], P5 = 30 * 6e4, ml = 6e4, wi = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, U5 = 3e3, bl = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Pu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function O5(e) {
  let t = null, n = -1 / 0, r, o = null, s = null, i, a = -1 / 0, c = null, f = null, g = !1, h = !1, w = !1, y = null, x = !1, S = "", C = "", B = 0, P, v = null, T, _ = [], K, se = -1 / 0;
  const Q = /* @__PURE__ */ new Set();
  let V = null, m = !1, I = 0, N = null, M = null, X = !1, F = null, oe = !1, ie = null, Fe = !1, $ = !1, D = !1, ce = !1, ye = !1, Be = 0, Ne = null, Pt = Promise.resolve();
  const He = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Hr.toString()), Se = (b) => !!s && !(s.features ?? []).includes(b), Ce = (b, A) => `xtrata.ppp.v1.${b}:${A}`, dn = "xtrata.ppp.v1.as-main", Wt = () => {
    if (e.main()) return;
    const b = e.store.get(dn);
    return b && qr(b) ? b : void 0;
  }, ot = () => e.main() ?? Wt(), sn = (b = s == null ? void 0 : s.address) => {
    if (!b) return [];
    try {
      const A = JSON.parse(e.store.get(Ce("entries", b)) || "[]");
      return Array.isArray(A) ? A : [];
    } catch {
      return [];
    }
  }, At = (b) => {
    const A = [b, ...sn(b.address).filter((R) => !(R.txid === b.txid && R.kind === b.kind))].slice(0, 200);
    e.store.set(Ce("entries", b.address), JSON.stringify(A));
  }, j = (b = s == null ? void 0 : s.address) => !!b && e.store.get(Ce("on", b)) !== "0", O = (b) => {
    s != null && s.address && e.store.set(Ce("on", s.address), b ? "1" : "0");
  }, ee = () => sn().filter((b) => fa.includes(b.status)), J = () => ze() ? [...ee(), ...sn(je()).filter((b) => fa.includes(b.status))] : ee(), ae = () => ft(s == null ? void 0 : s.address), ft = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Ce("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, Me = (b, A = s == null ? void 0 : s.address) => {
    A && e.store.set(Ce("deposit", A), JSON.stringify(b));
  };
  let Pe = null;
  const bt = (b = ml) => {
    const A = e.now();
    Pe = { since: Pe && A < Pe.until ? Pe.since : A, until: Math.max((Pe == null ? void 0 : Pe.until) ?? 0, A + b) };
  }, De = () => !!Pe && e.now() < Pe.until && (i === void 0 || i < tn + In(He())), Ee = () => !!ae() || De(), je = () => Se("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), ze = () => !!(s != null && s.address) && je() !== s.address, Xe = () => ze() ? c && c.for === je() ? c.value : void 0 : i, Lt = () => Se("likeFee") ? a5 : i5, on = (b) => b !== void 0 && b < tn + Lt(), Cn = () => ee().filter((b) => e.now() - b.created > P5 && Q.has(b.txid)), fn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!ot() || r === ot() && !t.allowed), Ct = () => fn() && !(s != null && s.linked), Tn = () => {
    const b = ot();
    return !Ct() && !!b && !!(s != null && s.linked) && s.linked !== b;
  }, Wn = (b) => Ce("return-to", b), vt = (b = s == null ? void 0 : s.address) => {
    if (!b) return;
    const A = e.store.get(Wn(b));
    return A && qr(A) && A !== b ? A : void 0;
  }, xr = (b = s == null ? void 0 : s.address) => V && V.for === b ? V.res : null;
  function dr() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const b = vt();
    if (b) return { to: b, kind: "chosen" };
    const A = xr();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const an = (b) => Ce("gift", b);
  function _t() {
    const b = s == null ? void 0 : s.address;
    if (!b) return null;
    if ((F == null ? void 0 : F.for) === b) return F.info;
    try {
      const A = JSON.parse(e.store.get(an(b)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  const cn = () => (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : ((s == null ? void 0 : s.slot) ?? 0) === 0 ? s == null ? void 0 : s.address : void 0;
  let Et = null, Zt = null, ss = !1;
  const Sr = (b) => Ce("award-claim", b), E = (b) => Ce("award-send", b), H = (b) => {
    try {
      const A = JSON.parse(e.store.get(E(b)) || "null");
      return A && typeof A.txid == "string" && e.now() - A.at < 2 * 36e5 ? A : null;
    } catch {
      return null;
    }
  }, z = (b) => {
    try {
      const A = JSON.parse(e.store.get(Sr(b)) || "null");
      return A && typeof A.txid == "string" && e.now() - A.at < 2 * 36e5 ? A : null;
    } catch {
      return null;
    }
  };
  async function U(b = !1) {
    var ve;
    const A = cn();
    if (!A || !e.awardStatus || ss) return;
    const R = (Et == null ? void 0 : Et.for) === A ? Et : null, Z = R == null ? void 0 : R.view.state, ke = Z === "not-a-player" && ((ve = _t()) == null ? void 0 : ve.drop) === "players", G = R ? ke ? 2e4 : Z === "off" || Z === "not-a-player" ? 30 * 6e4 : z(A) || H(A) ? 2e4 : Z === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(R && !b && e.now() - R.at < G)) {
      ss = !0;
      try {
        const me = await e.awardStatus(A);
        if (Et = { for: A, view: me, at: e.now() }, me.state === "claimed" && e.store.set(Sr(A), ""), me.state === "claimed" && me.holds === !1 && e.store.set(E(A), ""), me.state === "ready" && e.awardName && (Zt == null ? void 0 : Zt.for) !== A)
          try {
            Zt = { for: A, name: await e.awardName(A), at: e.now() };
          } catch {
            Zt = { for: A, name: void 0, at: e.now() };
          }
      } catch {
        Et = { for: A, view: R && R.view.state !== "off" && R.view.state !== "not-a-player" ? { ...R.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        ss = !1;
      }
    }
  }
  function q() {
    const b = cn();
    if (!b || (Et == null ? void 0 : Et.for) !== b) return null;
    const A = Et.view;
    if (A.state === "off" || A.state === "not-a-player") return null;
    const R = A.state === "claimed" ? null : z(b), Z = A.state === "claimed" && A.holds !== !1 ? H(b) : null;
    return { ...A, ...(Zt == null ? void 0 : Zt.for) === b ? { name: Zt.name } : {}, ...R ? { claimTx: R.txid } : {}, ...Z ? { sendTx: Z.txid } : {} };
  }
  async function te() {
    var ke;
    const b = s == null ? void 0 : s.address;
    if (!b || !e.giftInfo || !((ke = t == null ? void 0 : t.gifts) != null && ke.enabled) || oe) return;
    const A = (F == null ? void 0 : F.for) === b ? F : null, R = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && e.now() - A.at < R) return;
    oe = !0;
    const Z = _t();
    try {
      const G = await e.giftInfo(b);
      F = { for: b, info: G, ok: !0, at: e.now() }, e.store.set(an(b), JSON.stringify(G));
    } catch {
      F = { for: b, info: Z, ok: !1, at: e.now() };
    } finally {
      oe = !1;
    }
  }
  const Ie = () => sn().reduce((b, A) => fa.includes(A.status) ? b + BigInt(A.amount || "0") + BigInt(A.fee || "0") : b, 0n);
  function be() {
    if (i === void 0) return 0;
    const b = i - Ie() - BigInt(Ut.length) * In(He());
    return b > 0n ? ig(b, He()) : 0;
  }
  const k = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", we = "EMPTY — ADD STX TO PLAY";
  function Le() {
    if (!(t != null && t.here)) return null;
    const b = (A, R) => ({ reason: A, text: R });
    switch (yt()) {
      case "connect":
      case "wrong-wallet":
        return b("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return b("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return b("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return b("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return b("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return b("locked", "UNLOCK TO LISTEN");
      case "link":
        return b("link", "FINISH SETUP TO LISTEN");
      case "over":
        return b("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Ee() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", ze() ? k : we);
      case "ready":
        return !j() || !(s != null && s.session) || s.session.playsLeft < 1 || s.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : D ? be() < 1 ? b("out", ze() ? k : we) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const it = () => {
    var b;
    return !!(s != null && s.address) && ze() && !!((b = _t()) != null && b.player);
  };
  function ut() {
    return it() ? { locked: !0, known: !0 } : null;
  }
  const rt = 3 * 6e4, Jt = () => !!_t() && !!e.history && !(s != null && s.linked);
  async function Ft() {
    const b = s.address, A = _t(), { balance: R, nonce: Z } = await e.chain.account(b), ke = await e.history(b, !0);
    if (!ke.ok) return null;
    const G = N5({ self: b, balance: R, inbound: ke.inbound, outgoing: ke.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!G.ok) return null;
    const ve = M5(G.parts, da);
    return { balance: R, nonce: Z, parts: G.parts, steps: ve.steps, tooSmall: ve.tooSmall.length };
  }
  const jt = () => Fe ? { state: "unavailable" } : !ie || e.now() - ie.at > rt || i !== void 0 && i !== ie.balance ? { state: "none" } : ie.plan;
  function yt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = ot();
    if (!Ct()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : Tn() ? "wrong-wallet" : s.state === "known" ? "locked" : !Ct() && s.linked !== b ? "link" : i === void 0 ? "loading" : i > ms && !s.backedUp ? "over" : i < tn + In(He()) ? "fund" : "ready" : "loading";
  }
  const Qe = () => {
    var b, A, R, Z, ke;
    return {
      step: yt(),
      busy: f,
      message: S,
      error: C,
      notice: vr(),
      gate: t,
      main: ot(),
      mainConnected: !!e.main(),
      standIn: Wt(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      award: q(),
      unproven: !!(s != null && s.unproven),
      phrase: !!(s != null && s.hasBackup),
      backedUp: !!(s != null && s.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((G) => G === "over" && (s != null && s.backedUp) ? "ok" : G)(c5(i, He())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > ms && !!(s != null && s.backedUp),
      playsLeft: i === void 0 ? 0 : ig(i, He()),
      allowance: i === void 0 ? ms : Mu(i, BigInt(((b = ae()) == null ? void 0 : b.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: j(),
      entries: sn(),
      depositTxid: ((A = ae()) == null ? void 0 : A.txid) ?? P,
      depositPending: Ee(),
      arrival: Ee() ? { since: ((R = ae()) == null ? void 0 : R.at) ?? (Pe == null ? void 0 : Pe.since) ?? e.now(), graceMs: ml } : null,
      walletOutdated: Se("like"),
      canAnother: !!s && !Se("another"),
      canForget: !!s && !Se("forget"),
      passkeyName: s == null ? void 0 : s.passkeyName,
      hadGift: s != null && s.address && (F == null ? void 0 : F.for) === s.address && F.ok ? !!F.info : null,
      linkedListening: K && K === ot() ? _.map((G) => G.listening) : [],
      serverLinked: !!v && T === `${ot()}:${s == null ? void 0 : s.address}`,
      stuck: Cn().length,
      armed: ce,
      queued: Ut.length,
      solo: Ct(),
      returnTo: (Z = dr()) == null ? void 0 : Z.to,
      returnToKind: (ke = dr()) == null ? void 0 : ke.kind,
      funderState: (() => {
        const G = xr();
        return G ? G.ok ? G.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const G = xr();
        return !!G && G.ok && G.distinct > 1;
      })(),
      walletCannotSolo: Ct() && Se("standalone"),
      walletCannotMulti: Se("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((G) => G !== ot() && G !== (s == null ? void 0 : s.linked)),
      creditedTo: Ct() && (s != null && s.address) && (N == null ? void 0 : N.for) === s.address && N.main ? N.main : void 0,
      createdHere: !!(s != null && s.address) && e.store.get(Ce("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && i === 0n && (M == null ? void 0 : M.for) === s.address && M.unused,
      gift: (() => {
        const G = _t();
        return G ? { player: G.player, from: G.from, source: G.source, amount: G.amount, ...G.drop !== void 0 ? { drop: G.drop } : {} } : null;
      })(),
      giftPlays: _t() ? be() : 0,
      playCost: In(He()),
      giftStop: Le(),
      albumLock: ut(),
      returnPlan: jt(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Se("slots"),
      likeFunds: (() => {
        var me;
        const G = je();
        if (!G || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const ve = Xe();
        return { address: G, balance: ve, low: on(ve), album: ze(), pending: !!ft(G), txid: (me = ft(G)) == null ? void 0 : me.txid, main: ot() };
      })()
    };
  }, vr = () => B ? B < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", at = (b, A = "") => {
    S = b, C = A, e.changed();
  };
  async function Rt(b, A) {
    if (!f) {
      f = b, C = "", e.changed();
      try {
        await A();
      } catch (R) {
        const Z = R instanceof Error ? R.message : String(R);
        C = /Cancelled in the listening wallet/.test(Z) ? "" : Z, C || (S = "Not now. Nothing was signed.", ye = !0);
      } finally {
        f = null, await zn(!0);
      }
    }
  }
  const fo = () => !!(t != null && t.enabled) && t.here && (Ct() || !!ot() && t.allowed), Fn = () => fo() && !Tn(), ks = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", jn = () => {
    if (Tn()) throw new Error(ks());
  };
  async function Bn() {
    if (!fo()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return o ?? (o = await e.bridge(t.walletOrigin)), o;
  }
  const Nn = (b) => {
    const A = ot();
    return b.request("listening.status", A ? { main: A } : void 0);
  };
  async function ho(b = !1) {
    s != null && s.address && (!b && e.now() - a < 3e4 || (i = await e.chain.balance(s.address), a = e.now(), await Mn(b)));
  }
  async function Mn(b = !1) {
    const A = je();
    if (!(!ze() || !A || (s == null ? void 0 : s.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === A && e.now() - c.at < 3e4))
      try {
        c = { for: A, value: await e.chain.balance(A), at: e.now() };
      } catch {
      }
  }
  async function Rn(b) {
    if ((K !== b || e.now() - se >= 6e4) && (_ = await e.links(b), K = b, se = e.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === b) return;
    const A = `${b}:${s.address}`;
    T === A && v || (v = _.find((R) => R.listening === s.address) ?? null, T = A);
  }
  async function Dr() {
    const b = s == null ? void 0 : s.address;
    if (!Ct() || !b || s != null && s.linked || !e.funder || m || !i || i <= 0n) return;
    const A = xr(b);
    if (A != null && A.ok && A.funder) return;
    const R = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(V && V.for === b && e.now() - V.at < R)) {
      m = !0;
      try {
        V = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        V = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      I = V.res.ok ? 0 : I + 1;
    }
  }
  async function Fr() {
    const b = s == null ? void 0 : s.address;
    if (!(!Ct() || !b || s != null && s.linked || !e.mainOf || X) && !(N && N.for === b && (N.ok || e.now() - N.at < 6e4))) {
      X = !0;
      try {
        N = { for: b, main: await e.mainOf(b), ok: !0, at: e.now() };
      } catch {
        N = { for: b, main: null, ok: !1, at: e.now() };
      } finally {
        X = !1;
      }
    }
  }
  async function $s() {
    const b = s == null ? void 0 : s.address;
    if (!(!b || (s == null ? void 0 : s.state) !== "unlocked" || i !== 0n || (M == null ? void 0 : M.for) === b) && e.store.get(Ce("created", b)) !== "1")
      try {
        M = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function po() {
    var ke;
    const b = s == null ? void 0 : s.address;
    if (!b) return !1;
    let A, R = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const G of J())
      try {
        const ve = await e.chain.transaction(G.txid);
        if (!ve) {
          if (Q.add(G.txid), e.now() - G.created > 15 * 6e4 && !Z.has(G.address) && Z.set(G.address, await e.chain.confirmedNonce(G.address)), A = Z.get(G.address), A !== void 0 && A > BigInt(G.nonce)) {
            At({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await e.chain.broadcast(G.raw, G.txid), At({ ...G, status: "pending" });
            } catch ($e) {
              wi($e) && At({ ...G, status: "failed", note: $e.message, raw: void 0 });
            }
          continue;
        }
        Q.delete(G.txid);
        const me = String(ve.tx_status);
        if (me === "success" && ve.canonical !== !1 && ve.is_unanchored === !1) {
          if (At({ ...G, status: "confirmed", confirmedAt: e.now(), actualFee: String(ve.fee_rate ?? G.fee), raw: void 0 }), R = !0, G.kind === "like" && (x = !0, G.status !== "confirmed" && typeof G.liked == "boolean"))
            try {
              (ke = e.likeConfirmed) == null || ke.call(e, G.song, G.liked);
            } catch {
            }
        } else me.startsWith("abort_") || me.startsWith("dropped_") ? At({ ...G, status: "failed", note: me, raw: void 0 }) : G.status !== "pending" && At({ ...G, status: "pending" });
      } catch {
      }
    for (const G of ze() ? [b, je()] : [b]) {
      const ve = ft(G);
      if (ve)
        try {
          const me = await e.chain.transaction(ve.txid), $e = String((me == null ? void 0 : me.tx_status) ?? "");
          ($e === "success" && me.is_unanchored === !1 || $e.startsWith("abort_") || $e.startsWith("dropped_") || !me && e.now() - ve.at > 2 * 36e5) && (Me(null, G), $e === "success" && bt(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return R;
  }
  async function zn(b = !1) {
    var A;
    try {
      const R = ot();
      if ((b || !t || r !== R || e.now() - n > 3e5) && (t = await e.config(R), n = e.now(), r = R), !t.enabled || !t.here || !Ct() && (!R || !t.allowed)) {
        o && (s != null && s.session) && await o.request("listening.stop").catch(() => {
        }), ce && hn(), e.changed();
        return;
      }
      await Bn(), s = await Nn(o), Tn() && s.state === "unlocked" && (ls(), await o.request("listening.lock").catch(() => {
      }), i = void 0, s = await Nn(o)), R && t.allowed && await Rn(R), await ho(b), await Dr(), await Fr(), await $s(), await te(), await U(), await po() && await ho(!0), await Mn(), await ra(), B = 0;
    } catch {
      B++;
    }
    if (yt() === "locked" ? na() : ce && hn(), x) {
      x = !1;
      try {
        (A = e.likesChanged) == null || A.call(e);
      } catch {
      }
    }
    e.changed(), Ut.length && !jr && Zn();
  }
  async function os(b) {
    const A = s == null ? void 0 : s.root;
    if (!A || s != null && s.slot || !(s != null && s.address) || Se("slots")) return;
    const R = Number(e.store.get(Ce("slot", A)));
    if (!(!Number.isSafeInteger(R) || R < 1))
      try {
        const { balance: Z } = await e.chain.account(s.address);
        if (Z >= tn + In(He())) return;
        await b.request("listening.openSlot", { slot: R }), s = await Nn(b), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function go(b, A) {
    var G;
    jn();
    const R = !(s != null && s.address) || j(s.address), Z = s != null && s.linked ? (G = e.nameOf) == null ? void 0 : G.call(e, s.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: R ? Er() : void 0, anyPasskey: A, ...ot() ? { main: ot() } : {}, ...Z ? { label: Z } : {} }), s = await Nn(b), R && (j(s.address) ? await is() : await b.request("listening.stop")), await os(b), at(R ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ke = y;
    y = null, ke && e.now() - ke.at < 12e4 && setTimeout(() => void zn(!0).then(() => us(ke)), 0);
  }
  function na() {
    ce || f || ye || Be >= 3 || !o || !(s != null && s.address) || (ce = !0, Pt = (async () => {
      try {
        await go(o, !1), Be = 0;
      } catch (b) {
        const A = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(A) ? Ne || (ye = !0, at("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
        })) : (Be++, C = A);
      } finally {
        ce = !1;
        const b = Ne;
        Ne = null, b ? await b() : await zn(!0);
      }
    })());
  }
  async function hn(b) {
    ce && (Ne = async () => {
    }, await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
    })), await Pt), b && await b(), e.changed();
  }
  const Er = () => ({
    fee: He().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: ms.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function is() {
    if (!(s != null && s.address)) return !1;
    if (D || (D = await e.tabLock(s.address)), !D)
      throw await (o == null ? void 0 : o.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function yo(b, A) {
    const R = s.address, { balance: Z, nonce: ke } = A ?? await e.chain.account(R);
    i = Z;
    const G = await o.request("listening.prepareReturn", {
      mode: b.mode,
      balance: Z.toString(),
      nonce: ke.toString(),
      fee: da.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (G.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ve = b.mode === "amount" ? b.amount : b.mode === "all" ? Z - da : Z - ms - da, me = Li(G.raw);
    if (Nr(me.payload.recipient).value !== b.to || String(me.payload.amount) !== G.amount || ve !== void 0 && G.amount !== ve.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const $e = {
      id: Pu(),
      address: R,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: G.recipient,
      amount: G.amount,
      fee: G.fee,
      nonce: ke.toString(),
      created: e.now(),
      status: "signed",
      raw: G.raw,
      txid: G.txid
    };
    e.validate($e), At($e);
    try {
      await e.chain.broadcast(G.raw, G.txid), At({ ...$e, status: "pending" });
    } catch (l) {
      throw At({ ...$e, status: "unknown", note: l.message }), l;
    }
    return G;
  }
  const oi = Jl, as = da;
  async function Is(b, A, R) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Se("slots") || Se("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = s.slot ?? 0;
    if (b === A || ![b, A].includes(Z) || ![b, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ke = s.root ?? s.address, G = b === 0 ? ke : s.address, ve = A === 0 ? ke : s.address, { balance: me, nonce: $e } = await e.chain.account(G);
    if (me < R + as + tn) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const l = await o.request("listening.signMove", { from: b, to: A, amount: R.toString(), fee: as.toString(), nonce: $e.toString(), balance: me.toString() }), u = Li(l.raw);
    if (l.from !== G || l.to !== ve || l.amount !== R.toString() || Nr(u.payload.recipient).value !== ve || String(u.payload.amount) !== R.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const p = {
      id: Pu(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ve,
      amount: l.amount,
      fee: l.fee,
      nonce: $e.toString(),
      created: e.now(),
      status: "signed",
      raw: l.raw,
      txid: l.txid
    };
    e.validate(p), At(p);
    try {
      await e.chain.broadcast(l.raw, l.txid), At({ ...p, status: "pending" });
    } catch (d) {
      throw At({ ...p, status: "unknown", note: d.message }), d;
    }
    return Me({ txid: l.txid, amount: l.amount, at: e.now() }, ve), ve === ke && ke !== s.address ? c = null : a = -1 / 0, l;
  }
  let wo = !1;
  const ii = /* @__PURE__ */ new Map(), cs = (b) => Ce("float", b);
  async function ra() {
    if (wo || (s == null ? void 0 : s.state) !== "unlocked" || !ze() || Se("move") || Se("rootLike") || !s.address) return;
    const b = s.address;
    if (e.store.get(cs(b)) === "1") return;
    const A = _t();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const R = Xe();
    if (R === void 0 || i === void 0) return;
    if (!on(R)) {
      e.store.set(cs(b), "1");
      return;
    }
    if (ft(je()) || bo() || J().length || i < oi * 4n + tn + as) return;
    const Z = ii.get(b);
    if (!(Z && (Z.n >= 3 || e.now() - Z.at < 5 * 6e4))) {
      wo = !0, ii.set(b, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: e.now() });
      try {
        await Is(s.slot ?? 0, 0, oi), e.store.set(cs(b), "1");
      } catch (ke) {
        console.warn("[radio] likes float not sent yet", ke);
      } finally {
        wo = !1;
      }
    }
  }
  async function ai(b) {
    if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Se("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await Ft().catch(() => null);
    if (!A)
      throw ie = null, Fe = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Fe = !1, i = A.balance;
    const R = { balance: A.balance, nonce: A.nonce };
    if (b === "excess") {
      const me = ug(A.parts) ?? vt();
      if (!me) throw new Error("Choose where to send the excess first.");
      await yo({ mode: "excess", to: me, linked: !1 }, R), ie = null, at("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = A.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ie && ie.balance === A.balance && e.now() - ie.at <= rt && ie.steps.length === Z.length && ie.steps.every((me, $e) => me.to === Z[$e].to && me.mode === Z[$e].mode && me.send === Z[$e].send))) {
      ie = {
        at: e.now(),
        balance: A.balance,
        steps: Z,
        parts: A.parts,
        plan: { state: "ready", steps: Z.map((me) => ({ to: me.to, kind: me.kind, send: me.send.toString() })), kept: A.tooSmall, excess: ug(A.parts) }
      }, at(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const G = Z[0], ve = G.to ?? vt();
    if (!ve) throw new Error("Choose where to send the rest first.");
    if (G.mode === "amount" && Se("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await yo({ mode: G.mode, to: ve, linked: !1, ...G.mode === "amount" ? { amount: G.send } : {} }, R), ie = null, Z.length === 1 ? (O(!1), at("Returned ✓ Paying is off.")) : at(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Ar() {
    if (!(s != null && s.unproven)) return;
    const b = await Bn();
    await b.request("listening.prove"), s = await Nn(b);
  }
  const kr = {
    forceRefresh: () => zn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !qr(b))) {
        if (b === Wt()) return zn(!0);
        e.store.set(dn, b ?? ""), C = "", S = "", i = void 0, a = -1 / 0, c = null, await zn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => Rt("Check the listening wallet…", async () => {
      const b = await Bn();
      if (Se("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((s == null ? void 0 : s.state) !== "unlocked" || (s.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      ls(), await b.request("listening.forget"), i = void 0, s = await Nn(b), O(!1), at("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => Rt("Waiting for your passkey…", async () => {
      const A = await Bn(), R = !!(b != null && b.another) && !e.main() && !Se("another");
      R && (s == null ? void 0 : s.state) === "unlocked" && await A.request("listening.lock"), await A.request("listening.unlock", { mode: "create", terms: Er(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...R ? { another: !0 } : {} }), s = await Nn(A), s.address && e.store.set(Ce("created", s.address), "1"), O(!0), at(Ct() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await is();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      ci = e.now() + mo;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? bt() : Pe = null, e.changed();
    },
    giftSent: (b, A) => {
      !(s != null && s.address) || ae() || (Me({ txid: b, amount: A.toString(), at: e.now() }), a = -1 / 0, F = null, Et && (Et = { ...Et, at: -1 / 0 }), at("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (jn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Se("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Bn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, A, R, Z) => {
      Me({ txid: R, amount: Z.toString(), at: e.now() }, A), F = null, await kr.openAlbum(b), at("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => Rt("Opening…", async () => {
      if (jn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Se("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (g || h || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === b) return;
      ls(), await o.request("listening.openSlot", { slot: b }), s = await Nn(o), i = void 0, a = -1 / 0, ie = null, Fe = !1;
      const A = s.root;
      A && b > 0 && e.store.set(Ce("slot", A), String(b)), at(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const A = () => Rt("Waiting for your passkey…", async () => go(await Bn(), b));
      return ce ? b ? Se("cancel") ? (at("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : hn(async () => {
        (yt() === "locked" || yt() === "intro") && await A();
      }) : Pt : A();
    },
    link: () => Rt("Sign in your wallet…", async () => {
      jn();
      const b = e.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const A = (await e.links(b)).find((R) => R.listening === s.address);
      if (A)
        await o.request("listening.link", { main: b, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const R = { main: b, listening: s.address, issued: e.now() }, Z = await e.signWithMain(b, k5(R)), ke = await o.request("listening.link", { main: b, issued: R.issued, mainSignature: Z });
        await e.saveLink({ ...R, mainSignature: Z, listeningSignature: ke.listeningSignature }), se = -1 / 0;
      }
      at("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => s != null && s.unproven ? (await Rt("One more passkey check…", Ar), !(s != null && s.unproven)) : !0,
    deposit: () => Rt("Approve the deposit in your wallet…", async () => {
      jn(), await Ar();
      const b = e.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (ae()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (De()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await ho(!0);
      const A = Mu(i ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      P = await e.deposit(b, s.address, A), P && Me({ txid: P, amount: A.toString(), at: e.now() }), at("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Rt("Approve the top-up in your wallet…", async () => {
      jn(), await Ar();
      const b = e.main(), A = je();
      if (!b || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ft(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const R = await e.chain.balance(A);
      ze() ? c = { for: A, value: R, at: e.now() } : (i = R, a = e.now());
      const Z = Mu(R);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ke = await e.deposit(b, A, Z);
      ke && Me({ txid: ke, amount: Z.toString(), at: e.now() }, A), at("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => Rt("Adding plays…", async () => {
      if (jn(), !ze()) throw new Error("Open the album you want to add plays to first.");
      if (!zc.includes(b)) throw new Error("Choose one of the amounts offered.");
      const A = _5(b, He());
      if (g || h || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (J().length || ae()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Is(0, s.slot ?? 0, A), at("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Rt("Confirm in the listening wallet…", async () => {
      if (!Fn()) throw new Error("Connect your wallet first.");
      await is(), await o.request("listening.approveSession", Er()), O(!0), at("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Rt("Clearing…", async () => {
      for (const b of Cn())
        await e.chain.transaction(b.txid) || At({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      at("Cleared ✓");
    }),
    switchOff: () => Rt("Switching off…", async () => {
      ls(), await (o == null ? void 0 : o.request("listening.stop")), O(!1), at("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => Rt("Showing your backup words in the box…", async () => {
      if (!(s != null && s.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await Bn();
      await b.request("listening.backup"), s = await Nn(b), at("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, A) => {
      if ((s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Se("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Bn()).request("listening.signShelf", { action: b, ...A ? { release: A } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Zt = null, await U(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => Rt("Confirm in the listening wallet…", async () => {
      var $e, l, u, p;
      const A = cn();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !A) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Se("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (z(A)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (g || h || w || J().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await is();
      const R = await e.awardNote(A, b), { balance: Z, nonce: ke } = await e.chain.account(A);
      if (Z < Lc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ve = await (await Bn()).request("listening.signAward", {
        cls: R.cls,
        number: R.number,
        plays: R.plays,
        record: R.record,
        signature: R.signature,
        fee: Lc.toString(),
        nonce: ke.toString(),
        balance: Z.toString()
      }), me = Li(ve.raw);
      if (ve.hero !== A || ve.number !== R.number || ((l = ($e = me.payload) == null ? void 0 : $e.functionName) == null ? void 0 : l.content) !== "claim" || ((p = (u = me.payload) == null ? void 0 : u.contractName) == null ? void 0 : p.content) !== p5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ve.raw, ve.txid), e.store.set(Sr(A), JSON.stringify({ txid: ve.txid, at: e.now() })), a = -1 / 0, Et && (Et = { ...Et, at: -1 / 0 }), at("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => Rt("Confirm in the listening wallet…", async () => {
      var l, u, p;
      const A = cn(), R = q();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !A) throw new Error("Unlock your player first.");
      if ((R == null ? void 0 : R.state) !== "claimed" || R.inscription === void 0) throw new Error("There is no record to send yet.");
      if (R.holds === !1) throw new Error("This record has already been sent.");
      if (R.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (H(A)) throw new Error("Your record is already on its way.");
      const Z = b.trim();
      if (!qr(Z)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (Z === A) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Se("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (g || h || w || J().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await is();
      const { balance: ke, nonce: G } = await e.chain.account(A);
      if (ke < Lc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const me = await (await Bn()).request("listening.signSendRecord", { inscription: R.inscription, recipient: Z, fee: Lc.toString(), nonce: G.toString(), balance: ke.toString() }), $e = Li(me.raw);
      if (me.from !== A || me.recipient !== Z || me.inscription !== R.inscription || ((u = (l = $e.payload) == null ? void 0 : l.functionName) == null ? void 0 : u.content) !== "transfer" || Nr((p = $e.payload.functionArgs) == null ? void 0 : p[2]).value !== Z)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(me.raw, me.txid), e.store.set(E(A), JSON.stringify({ txid: me.txid, at: e.now() })), a = -1 / 0, Et && (Et = { ...Et, at: -1 / 0 }), at("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => Rt("Locking…", async () => {
      ls(), await (o == null ? void 0 : o.request("listening.lock")), i = void 0, at("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const A = String(b ?? "").trim();
      if (!(s != null && s.address)) return at("", "Unlock the listening wallet first.");
      if (!qr(A)) return at("", "Enter a standard mainnet address (it starts with SP).");
      if (A === s.address) return at("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Wn(s.address), A), at("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && e.store.set(Wn(s.address), ""), e.changed();
    },
    returnFunds: (b) => Rt("Check the return in the listening wallet…", async () => {
      if (!Fn()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (Jt()) return ai(b);
      const A = dr();
      if (!A) throw new Error(Ct() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && Se("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ee().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await yo({ mode: b, to: A.to, linked: A.kind === "linked" }), b === "all" && O(!1), at(b === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Ut = [], fr = 10, mo = 30 * 6e4;
  let jr = !1, ci = 0;
  const ct = (b) => e.now() < ci && (b === "intro" || b === "locked" || b === "link" || b === "fund" && Ee()), bo = () => g || !!f || h || w, ls = () => {
    Ut.length && (Ut.length = 0, e.changed());
  };
  async function li(b) {
    if (!Ut.some((A) => A.id === b.id) && !sn().some((A) => A.id === b.id) && (Ut.push({ ...b, at: e.now() }), Ut.length > fr && Ut.shift()), bo() || ee().length) {
      const A = Ut.length;
      S = `Queued ${A === 1 ? "this song" : A + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Zn();
  }
  async function Zn() {
    if (!jr) {
      jr = !0;
      try {
        for (; Ut.length; ) {
          for (; Ut.length && e.now() - Ut[0].at > mo; ) Ut.shift();
          if (!Ut.length || bo() || await sa(Ut[0]) === "wait") return;
          Ut.shift();
        }
      } finally {
        jr = !1, e.changed();
      }
    }
  }
  async function sa(b) {
    var A;
    g = !0;
    try {
      await zn();
      const R = yt();
      if (R === "loading" || ct(R)) return "wait";
      if (R !== "ready" || !j() || !(s != null && s.session) || s.session.playsLeft < 1 || !D) return "done";
      if (ee().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const Z = s.address, { balance: ke, nonce: G } = await e.chain.account(Z);
      i = ke, a = e.now();
      const ve = await e.chain.owner(_u, b.song);
      if (ve === Z || ve === ot()) return "done";
      const me = await o.request("listening.signPlay", {
        core: _u,
        song: b.song,
        receipt: b.id,
        fee: He().toString(),
        nonce: G.toString(),
        balance: ke.toString()
      }), $e = {
        id: b.id,
        address: Z,
        kind: "play",
        core: _u,
        song: b.song,
        recipient: ve,
        amount: "50",
        fee: He().toString(),
        nonce: G.toString(),
        created: e.now(),
        status: "signed",
        raw: me.raw,
        txid: me.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate($e), At($e);
      const l = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(me.raw, me.txid), At({ ...$e, status: "pending" }), S = `♪ Paid ${l}`, C = "";
      } catch (u) {
        At({ ...$e, status: wi(u) ? "failed" : "unknown", note: u.message, ...wi(u) ? { raw: void 0 } : {} }), C = u.message;
      }
      return s = await Nn(o), "done";
    } catch (R) {
      const Z = R instanceof Error ? R.message : "payment unavailable";
      return (A = _t()) != null && A.player ? (S = "Payment is taking a moment: " + Z, "wait") : (S = "This song played free: " + Z, "done");
    } finally {
      g = !1, e.changed();
    }
  }
  function ui(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(yt()) || Se("like") ? !1 : (us(b), !0);
  }
  async function us(b) {
    const A = b.title ? `“${b.title}”` : `song #${b.song}`, R = (L) => {
      var W;
      C = L, S = "";
      try {
        (W = e.likeFailed) == null || W.call(e, b.song);
      } catch {
      }
      e.changed();
    }, Z = ze(), ke = yt(), G = ot(), ve = Z && (ke === "fund" || ke === "over") ? "ready" : ke, me = Ct() ? je() : G;
    if (ve === "locked") {
      y = { ...b, at: e.now() }, at(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (ve === "wrong-wallet") return R(ks());
    if (ve === "link") return R("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Ct() && Se("standalone")) return R("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ve === "fund") return R("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ve === "over") return R("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Mn(!0);
      const L = Xe();
      if (on(L))
        return e.changed(), R(bl);
    }
    if (ve !== "ready" || !me) return R("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return R("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!D) return R("Pay-per-play is running in another tab. Like from that tab.");
    const $e = sn(je()).find((L) => L.kind === "like" && L.song === b.song);
    if ($e && fa.includes($e.status))
      return R(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (h) return R("One like at a time: your last one is still being sent.");
    if (($e == null ? void 0 : $e.status) === "confirmed" && e.now() - ($e.confirmedAt ?? 0) < U5)
      return R(`Your like for ${A} has only just confirmed. Try again in a moment.`);
    let l;
    w = !0;
    try {
      l = e.likeState ? (await e.likeState(me, b.song)).by : b.likedBy ?? [];
    } catch {
      l = b.likedBy;
    } finally {
      w = !1;
    }
    if (!l) return R(`Could not check ${A} right now. Try the heart again.`);
    const u = je(), d = (($e == null ? void 0 : $e.status) === "confirmed" && typeof $e.liked == "boolean" && e.now() - ($e.confirmedAt ?? $e.created) < 5 * 6e4 ? $e.liked : void 0) ?? l.includes(u);
    if (!d && l.some((L) => L !== u)) return R(Ct() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${l.includes(G) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Gn({ song: b.song, liked: !d, title: b.title, artist: b.artist });
  }
  async function Gn(b) {
    var Z, ke, G;
    if (h) {
      at("Still sending your last like. Try again in a moment.");
      return;
    }
    h = !0;
    const A = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, R = e.wait ?? ((ve) => new Promise((me) => setTimeout(me, ve)));
    try {
      at(`${b.liked ? "Liking" : "Unliking"} ${A}…`);
      const ve = e.now() + 12e4;
      for (; g || (ze() ? sn(je()).some((d) => fa.includes(d.status)) : ee().length); ) {
        if (e.now() > ve) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await R(5e3), await zn(!0);
      }
      if (!ze() && yt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const me = je(), { balance: $e, nonce: l } = await e.chain.account(me);
      if (ze() ? c = { for: me, value: $e, at: e.now() } : (i = $e, a = e.now()), on($e)) throw new Error(bl);
      const u = await o.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Lt().toString(),
        nonce: l.toString(),
        balance: $e.toString()
      }), p = {
        id: Pu(),
        address: me,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Lt().toString(),
        nonce: l.toString(),
        created: e.now(),
        status: "signed",
        raw: u.raw,
        txid: u.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(p), At(p);
      try {
        await e.chain.broadcast(u.raw, u.txid), At({ ...p, status: "pending" }), S = `${b.liked ? "♥ Liked" : "Unliked"} ${A}`, C = "";
        try {
          (Z = e.likeSent) == null || Z.call(e, b.song, b.liked);
        } catch {
        }
      } catch (d) {
        if (At({ ...p, status: wi(d) ? "failed" : "unknown", note: d.message, ...wi(d) ? { raw: void 0 } : {} }), C = d.message, wi(d)) try {
          (ke = e.likeFailed) == null || ke.call(e, b.song);
        } catch {
        }
      }
      s = await Nn(o);
    } catch (ve) {
      C = "Like not sent: " + (ve instanceof Error ? ve.message : "the listening wallet is unavailable");
      try {
        (G = e.likeFailed) == null || G.call(e, b.song);
      } catch {
      }
    } finally {
      h = !1, e.changed(), Zn();
    }
  }
  return { snapshot: Qe, refresh: zn, onListened: li, heart: ui, toggleLike: us, ...kr };
}
const mb = ["Connect", "Passkey", "Link & fund", "Listen"], bb = ["Passkey", "Add 1 STX", "Listen"], Wd = (e) => e ? bb : mb;
function H5(e) {
  if (e.solo) return D5(e);
  const t = mb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(3, "first paid play sent, confirming") : n(3, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function D5(e) {
  const t = bb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
      const r = e.entries.filter((o) => o.kind === "play");
      return r.some((o) => o.status === "confirmed") ? n(t, "Paid plays are taking place") : r.some((o) => ["signed", "pending", "unknown"].includes(o.status)) ? n(2, "first paid play sent, confirming") : n(2, "listen to a song for 30 seconds");
    }
    default:
      return null;
  }
}
function F5(e, t) {
  return !t || t.at >= Wd(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const j5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function R5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !j5(r.id)));
}
const z5 = {}, G5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, K5 = (e) => {
  const t = z5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, V5 = (e) => `/hiro/${e}`, X5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, Y5 = (e) => {
  const t = K5(e);
  if (t)
    return [X5(t)];
  const n = G5[e];
  return typeof window < "u" ? [`${window.location.origin}${V5(e)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, q5 = {}, dg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, W5 = "xtrata.log.enabled", Z5 = "xtrata.log.level", J5 = "xtrata.log.tags", Q5 = "xtrata.log.dedupe", Cc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, eI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, tI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, nI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, rI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, sI = () => {
  const e = q5 ?? {}, t = Cc(W5) ?? e.VITE_LOG_ENABLED, n = Cc(Z5) ?? e.VITE_LOG_LEVEL, r = Cc(J5) ?? e.VITE_LOG_TAGS, o = Cc(Q5) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: eI(t),
    level: tI(n) ?? "warn",
    tags: rI(r),
    dedupe: nI(o)
  };
}, oI = (e, t, n) => !e.enabled || dg[n] < dg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), iI = (e, t, n, r) => {
  const o = sI();
  if (!oI(o, t, e) || cI(o.dedupe))
    return;
  const s = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, aI = /* @__PURE__ */ new Set();
let fg = null;
const cI = (e, t, n, r, o) => (fg !== e && (aI.clear(), fg = e), !1), lI = (e, t, n) => iI("debug", e, t, n), uI = {}, dI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, fI = (e) => {
  const t = uI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : dI[e];
}, hI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, pI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return hI.test(n) ? n : null;
}, gI = (e) => e.replace(/\/+$/, ""), yI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), hg = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.startsWith("0x") ? e.slice(2) : e;
  if (!t || t.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(t))
    return null;
  let n = "";
  for (let r = 0; r < t.length; r += 2) {
    const o = Number.parseInt(t.slice(r, r + 2), 16);
    if (o < 32 || o > 126)
      return null;
    n += String.fromCharCode(o);
  }
  return n;
}, mi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, wI = (e) => {
  var c, f;
  let t;
  try {
    t = Nr(h6(e));
  } catch {
    return null;
  }
  const n = mi(t);
  if (!n || n.success === !1)
    return null;
  const r = mi(n.value), o = mi(r == null ? void 0 : r.value), s = mi(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = hg((c = mi(s.name)) == null ? void 0 : c.value), a = hg((f = mi(s.namespace)) == null ? void 0 : f.value);
  return !i || !a ? null : pI(`${i}.${a}`);
}, mI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${gI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [Jm(Pm(e.address))]
    }),
    signal: e.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : wI(s.result);
}, bI = async (e) => {
  const t = e.address.trim();
  if (!Ti(t))
    return null;
  const n = fI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const o of Y5(e.network))
    try {
      return await mI({
        baseUrl: o,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (s) {
      r = s;
    }
  return lI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: yI(r)
  }), null;
};
function xI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, o = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((f) => {
      c.pending = !1, f && (c.name = f, t());
    }).catch(() => {
      c.pending = !1, c.failedAt = o();
    });
  };
  return {
    get(a) {
      if (!a) return null;
      let c = s.get(a);
      return c ? !c.pending && c.name === null && c.failedAt !== void 0 && o() - c.failedAt >= r && i(a, c) : (c = { name: null, pending: !1 }, s.set(a, c), i(a, c)), c.name;
    }
  };
}
const pg = Object.freeze({
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
}), gg = Object.freeze({ 139: "melophonic" });
function yg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(pg, n) ? pg[n] : Object.hasOwn(gg, n) ? gg[n] : t;
}
const wg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function mg(e, t = "") {
  return Object.hasOwn(wg, String(e)) ? wg[String(e)] : t;
}
const xb = 10000n, hh = 1000000n, xl = 3000n, SI = (e, t) => `${e}#gift=${t}`, vI = 100, ha = (e, t = Hr) => e <= tn ? 0 : Number((e - tn) / In(t)), bg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), ph = "xtrata.xyz/radio/gifts", ba = vI, EI = "Create a prefunded Xtrata radio gift batch", AI = (e) => ({
  domain: ur({ name: gt(ph), version: gt("1"), "chain-id": wn(1) }),
  message: ur({
    purpose: gt(EI),
    creator: gt(e.creator),
    count: wn(e.count),
    amount: wn(BigInt(e.amount)),
    label: gt(e.label),
    issued: wn(e.issued),
    ...e.player ? { player: gt(e.player) } : {}
  })
}), Sb = (e, t, n = Hr) => tn + BigInt(e) * In(n) + (t ? Jl : 0n), kI = (e, t = Hr) => Number((hh - tn - (e ? Jl : 0n)) / In(t)), vb = (e, t) => BigInt(e) * (t + xl);
function $I(e, t, n, r = Hr) {
  const o = n ? Jl : 0n, s = t > tn + o ? t - tn - o : 0n, i = Number(s / In(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * yl,
    fees: BigInt(i) * r,
    reserve: tn,
    float: o,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: xl,
    perCopy: t + xl,
    total: vb(e, t)
  };
}
const II = (e) => e >= xb && e <= hh, LI = 90, xg = [30, 90], CI = "Extend my prefunded Xtrata radio gift batches; no spending permission", TI = (e) => ({
  domain: ur({ name: gt(ph), version: gt("1"), "chain-id": wn(1) }),
  message: ur({ purpose: gt(CI), creator: gt(e.creator), batch: gt(e.batch), days: wn(e.days), issued: wn(e.issued) })
}), Sg = 40, BI = "Create an Xtrata radio gift player", Zd = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), NI = /^[^\u0000-\u001f\u007f<>]+$/u;
function vg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && NI.test(e) : !n;
}
function Eb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!vg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!vg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Sg) throw new Error(`A player holds 1 to ${Sg} songs.`);
  const t = /* @__PURE__ */ new Set();
  for (const o of e.tracks) {
    if (!Number.isSafeInteger(o) || o < 1) throw new Error("Songs are catalogue token numbers.");
    if (t.has(o)) throw new Error("A song appears twice in the list.");
    t.add(o);
  }
  if (e.cover !== null && e.cover !== void 0 && (!Number.isSafeInteger(e.cover) || e.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = e.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const o of n) if (!t.has(o)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((o, s) => o - s);
  return { title: e.title, subtitle: e.subtitle ?? "", tracks: [...e.tracks], cover: e.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const Ab = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return yf(bf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, MI = (e) => ({
  domain: ur({ name: gt(ph), version: gt("1"), "chain-id": wn(1) }),
  message: ur({
    purpose: gt(BI),
    admin: gt(e.admin),
    player: gt(e.hash),
    issued: wn(e.issued)
  })
}), Pr = (e) => e.tracks.filter((t) => !t.hidden), _I = (e) => e.tracks.find((t) => t.hidden) ?? null, Uu = [300, 500, 1e3], Ia = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Tc = (e) => typeof e == "string" && Ia.some((t) => t.id === e), Co = (e) => Ia.find((t) => t.id === e), PI = (e) => Ia.find((t) => e >= t.min) ?? Ia[Ia.length - 1];
function UI(e, t = Hr) {
  return PI(e <= tn ? 0 : Number((e - tn) / In(t)));
}
const kb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], OI = "1000 Players";
function gh(e = ba) {
  const t = [];
  for (const n of kb) {
    const r = Sb(n.plays, !1);
    for (let o = n.count; o > 0; o -= e) {
      const s = Math.min(o, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: s, label: `${OI} ${String(i).padStart(2, "0")}`, amount: r, deposit: vb(s, r) });
    }
  }
  return t;
}
const yh = (e = gh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: kb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), HI = 23 * 36e5, Eg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function DI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < HI ? "unpaid" : "todo";
}
function FI(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: DI(c, n) })).filter((c) => c.state !== "todo").sort((c, f) => Eg(f.state) - Eg(c.state) || f.b.at - c.b.at), o = r[0];
  if (!o) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const s = (a = o.b.view) == null ? void 0 : a.copies, i = o.state === "live" ? `live · all ${e.count} waiting to be claimed` : o.state === "touched" ? `live, but only ${(s == null ? void 0 : s.waiting) ?? 0} of ${e.count} still waiting (${(s == null ? void 0 : s.claimed) ?? 0} claimed)` : o.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: o.state, batch: o.b, extras: r.length - 1, detail: o.b.error ? `${i} (${o.b.error})` : i };
}
function Ag(e, t, n = gh()) {
  var f;
  const r = n.map((g) => FI(g, e, t)), o = [];
  for (const g of r)
    g.extras && o.push(`Batch ${g.step.n} was made more than once. The extra ${g.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${g.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), g.state === "touched" && o.push(`Batch ${g.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const s = r.every((g) => g.state === "live"), i = s ? r.flatMap((g) => g.batch.codes) : [], a = yh(n).players;
  s && new Set(i).size !== a && o.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = s && new Set(i).size === a;
  return { steps: r, next: ((f = r.find((g) => g.state === "todo")) == null ? void 0 : f.step) ?? null, done: r.filter((g) => g.state === "live").length, ready: c, codes: c ? i : [], problems: o };
}
function jI(e, t = gh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = yh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const o = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), s = r.tiers.map((f) => {
    var h;
    const g = (h = n.tiers) == null ? void 0 : h.find((w) => w.plays === f.plays);
    return { ...f, got: (g == null ? void 0 : g.total) ?? 0 };
  }), i = s.map((f) => `${f.got} ${Co(f.id).name}`).join(", "), a = (n.tiers ?? []).filter((f) => !r.tiers.some((g) => g.plays === f.plays)), c = n.total === r.players && o === 0 && !!n.tiers && s.every((f) => f.got === f.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((f, g) => f + g.total, 0)} of another size` : ""})` : ""}${o ? `, ${o} no longer available` : ""}.` };
}
const kg = 1800, Ou = /* @__PURE__ */ new Map();
async function RI(e) {
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
function zI(e, t, n, r, o) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = e, (() => {
    const a = Ou.get(e), c = !!a && a.until > Date.now();
    s.textContent = c ? a.label : t, s.classList.toggle("is-done", c && a.ok), s.classList.toggle("is-failed", c && !a.ok);
  })(), s.onclick = async () => {
    const a = await n();
    if (a) {
      Ou.set(e, { ...a, until: Date.now() + kg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Ou.delete(e), o();
      }, kg + 50);
    }
  }, s;
}
const or = (e, t, n, r, o) => zI(e, t, async () => await RI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, o), xo = "xtrata.radio.gift.incoming.v1", $g = (e) => "xtrata.radio.gift.mine.v1:" + e, Ig = (e) => "xtrata.radio.gift.batches.v1:" + e, de = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Qt = (e, t, n = "") => {
  const r = de("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, pa = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Kn = (e) => Tr(e).replace(/\.?0+$/, "");
function GI(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), H = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return H !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), bg(H) ? H : null;
    } catch {
      return null;
    }
  })(), o = (() => {
    try {
      const E = JSON.parse(e.store.get(xo) || "null");
      return bg(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? o;
  if (s) {
    t = { code: s }, e.store.set(xo, JSON.stringify({ code: s, at: e.now() }));
    let E = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (z) => {
      const U = await z.json().catch(() => ({}));
      if (z.status === 404) {
        e.store.set(xo, null), t = { ...t, error: (U == null ? void 0 : U.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!z.ok) throw new Error("busy");
      const q = U;
      t = { ...t, view: q, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(q.status) && e.store.set(xo, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void H(), n(E++)));
    });
    H();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: h(E), plays: ha(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: ha(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, f = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const H = `${location.origin}${location.pathname}#gift=${E}`;
    return [or("gift-pass-on", "Copy the link to pass on", () => H, "primary", e.changed)];
  }, g = () => {
    t = null, e.store.set(xo, null), e.changed();
  }, h = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let w = {};
  const y = (E) => {
    if (w.box) return w.box;
    const H = de("div", "", "ppp-gift-check");
    w.box = H;
    const z = () => {
      const U = window.turnstile;
      !U || w.rendered || (w.rendered = !0, U.render(H, { sitekey: E, callback: (q) => {
        w.token = q, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const U = document.createElement("script");
      U.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", U.async = !0, U.onload = z, document.head.append(U);
    }
    return H;
  }, x = (E) => {
    queueMicrotask(() => void E());
  };
  let S;
  async function C(E) {
    var U, q, te, Ie, be, k, we, Le, it;
    if (!t || t.claiming || !E.listening) return;
    const H = !!((U = t.view) != null && U.player);
    if (H && !E.root) return;
    t.claiming = !0, t.error = void 0, (q = e.claiming) == null || q.call(e, !0), e.changed();
    const z = async (ut) => {
      const rt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...ut })
      });
      return { res: rt, r: await rt.json().catch(() => ({})) };
    };
    try {
      let ut = 0, rt = E.listening, Jt;
      if (H) {
        const yt = Number((te = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : te.next);
        if (!Number.isSafeInteger(yt) || yt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        ut = yt;
        for (let Qe = 0; ; Qe++) {
          const vr = await e.album.bind(ut);
          if (rt = vr.address, Jt = await z({ wallet: rt, binding: vr }), Jt.res.status === 409 && /just taken/.test(((Ie = Jt.r) == null ? void 0 : Ie.error) || "") && Qe < 5) {
            ut += 1;
            continue;
          }
          break;
        }
      } else Jt = await z({ wallet: rt });
      const { res: Ft, r: jt } = Jt;
      if (Ft.status === 503 && /sending another gift/.test((jt == null ? void 0 : jt.error) || "")) {
        t.waiting = !0, (be = e.claiming) == null || be.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ft.ok) {
        const yt = String((jt == null ? void 0 : jt.error) || "");
        if (Ft.status === 404 || Ft.status === 410 || Ft.status === 409 && /already had a gift|brand-new|already have this album/.test(yt))
          throw e.store.set(xo, null), new Error(yt || "This gift cannot be opened.");
        if (Ft.status === 429 || Ft.status === 403 || Ft.status === 400 && !/wallet number/i.test(yt)) throw new Error(yt || `Could not open the gift (${Ft.status}).`);
        const vr = /topping up/.test(yt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(yt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(yt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(vr), { retry: !0, slow: /topping up|not paid for yet/.test(yt) });
      }
      t.done = !0, e.store.set(xo, null), H ? await e.album.arrived(ut, rt, jt.txid, BigInt(jt.amount)) : e.giftSent(jt.txid, BigInt(jt.amount));
    } catch (ut) {
      const rt = ut, Jt = rt.name === "TypeError" || rt.name === "AbortError" || rt.name === "TimeoutError" || /wallet number/i.test(rt.message);
      if (rt.retry || Jt) {
        const Ft = t.tries ?? 0;
        t.tries = Ft + 1, t.retry = { text: rt.retry ? rt.message : "Still sending your gift… the network is slow, trying again." }, (k = e.claiming) == null || k.call(e, !0), clearTimeout(S), S = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, rt.slow ? 6e4 : n(Ft));
      } else
        t.error = rt.message, (we = e.claiming) == null || we.call(e, !1);
      w.token = void 0;
      try {
        (it = (Le = window.turnstile) == null ? void 0 : Le.reset) == null || it.call(Le, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let B = null;
  function P(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return B = null, [];
    if (!B || B.wallet !== E.listening || e.now() - B.at > 3e4) {
      const z = E.listening;
      B = { ...(B == null ? void 0 : B.wallet) === z ? B : {}, wallet: z, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(z)).then((U) => {
        var q, te;
        (B == null ? void 0 : B.wallet) === z && (B.state = (q = U == null ? void 0 : U.gift) == null ? void 0 : q.state, B.problem = ((te = U == null ? void 0 : U.gift) == null ? void 0 : te.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(B.state === "sending" && B.problem)) return [];
    const H = de("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${B.problem}`, [H];
  }
  function v(E, H, z = !1) {
    var k, we;
    const U = H.player, q = BigInt(H.amount), te = z ? [] : [de("p", `🎁 ${h(H)} sent you “${U.title}”${U.subtitle ? ` by ${U.subtitle}` : ""}: ${Pr(U).length} ${Pr(U).length === 1 ? "song" : "songs"} and ${ha(q).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (z) return te;
      if (te.push(de("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const Le = document.createElement("details");
        Le.className = "ppp-how";
        const it = document.createElement("summary");
        it.textContent = "How does this work?", Le.append(it, de("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), te.push(Le);
      }
      return te;
    }
    if (E.walletCannotAlbums)
      return te.push(de("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), te;
    const be = (we = (k = E.gate) == null ? void 0 : k.gifts) == null ? void 0 : we.turnstileSiteKey;
    return be && !w.token ? te.push(de("p", "One quick check and it is yours:", "ppp-mute"), y(be)) : !t.claiming && !t.error && !t.waiting && !t.retry && x(() => C(E)), te.push(...T(E, "Sending your album…")), te;
  }
  function T(E, H) {
    const z = [];
    return t.claiming || t.waiting ? z.push(de("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : H, "ppp-cyan")) : t.retry && z.push(de("p", t.retry.text, "ppp-warn"), Qt("Try now", () => {
      clearTimeout(S), t.retry = void 0, C(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? z.push(de("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...f(), Qt("Forget this gift link here", g, "quiet")) : t.error && z.push(de("p", t.error, "ppp-bad"), Qt("Try again", () => {
      t.error = void 0, C(E);
    })), z;
  }
  const _ = (E) => {
    var H;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((H = t.view) != null && H.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function K(E, H = {}) {
    var rt, Jt, Ft, jt;
    const z = P(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return z;
    const U = t.view;
    if (t.error && !U) return [de("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!U) return [de("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return z;
    if (U.status === "claimed" || U.status === "claiming") return [de("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(U.status)) return [de("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (U.status === "pending-deposit") return [de("p", `🎁 ${h(U)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (U.player) return [...v(E, U, !!H.bare), ...z];
    const q = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), te = q ? ((rt = e.claimNew) == null ? void 0 : rt.call(e, E)) ?? null : null, Ie = te ? ((Jt = e.replaceOld) == null ? void 0 : Jt.call(e, E)) ?? null : null;
    if (te && Ie)
      return [
        de("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        Qt("Replace my old player", Ie, "primary"),
        Qt("Keep both players", te, "quiet"),
        Qt("Not now", g, "quiet")
      ];
    if (te)
      return [
        de("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        Qt("Claim it as a new player", te, "primary"),
        Qt("Not now", g, "quiet")
      ];
    if (q)
      return [de("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...f(), Qt("Forget this gift link here", g, "quiet")];
    const be = BigInt(U.amount), k = ha(be).toLocaleString(), we = de(
      "p",
      `🎁 ${h(U)} sent you ${Kn(be)} STX of on-chain music: about ${k} paid plays.`,
      "ppp-gift"
    ), Le = H.bare ? [] : [we], it = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, ut = (jt = (Ft = E.gate) == null ? void 0 : Ft.gifts) == null ? void 0 : jt.turnstileSiteKey;
    return it ? (ut && !w.token ? Le.push(de("p", "One quick check and it is yours:", "ppp-mute"), y(ut)) : !t.claiming && !t.error && !t.waiting && !t.retry && x(() => C(E)), Le.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? H.bare || Le.push(de("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? Le.push(de("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...f(), Qt("Forget this gift link here", g, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && Le.push(de("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...f(), Qt("Forget this gift link here", g, "quiet")), Le;
  }
  async function se(E, H, z) {
    var U;
    try {
      const q = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((U = q == null ? void 0 : q.gift) != null && U.returnTo) return { ok: !0, funder: q.gift.returnTo, txId: q.gift.txid ?? void 0, amount: q.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return H();
  }
  const Q = de("div", "", "ppp-gift-fold");
  let V = 250000n, m = "", I = "";
  const N = (E) => {
    try {
      const H = JSON.parse(e.store.get($g(E)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, M = (E, H) => e.store.set($g(E), JSON.stringify(H.slice(0, 50)));
  async function X(E) {
    const H = N(E);
    for (const z of H)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await e.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (U) {
          z.error = U.message;
        }
    M(E, H), e.changed();
  }
  async function F(E) {
    if (m) return;
    m = "Starting your gift…", I = "", e.changed();
    let H = null;
    try {
      H = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: V.toString() }) });
      const z = N(E);
      z.unshift({ id: H.id, code: H.code, amount: V.toString(), at: e.now() }), M(E, z), m = "Approve the gift in your wallet…", e.changed();
      const U = await e.pay(E, H.depositTo, BigInt(H.deposit), H.memo), q = N(E), te = q.find((Ie) => Ie.id === H.id);
      te && (te.txid = U, te.view = { status: "pending-deposit", amount: V.toString(), source: "friend", from: E, label: "", expires: 0 }), M(E, q), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", X(E);
    } catch (z) {
      I = z.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const oe = (E) => "xtrata.radio.gift.players.v1:" + E, ie = (E) => {
    try {
      const H = JSON.parse(e.store.get(oe(E)) || "[]");
      return Array.isArray(H) ? H.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function Fe(E, H) {
    var z;
    if (!m) {
      m = "Checking the player…", I = "", e.changed();
      try {
        const U = H.tracks.split(/[\s,]+/).filter(Boolean).map((Le) => Number(Le.replace(/^#/, ""))), q = (H.explicit ?? "").split(/[\s,]+/).map((Le) => Le.replace(/^#/, "")).filter(Boolean).map(Number), te = Eb({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: U, cover: (z = H.cover) != null && z.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null, ...q.length ? { explicit: q } : {} });
        m = "Sign in your wallet…", e.changed();
        const Ie = { admin: E, hash: Ab(te), issued: e.now() }, be = await e.sign(E, MI(Ie));
        m = "Making the player…", e.changed();
        const k = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: te, request: Ie, signature: be }) }), we = ie(E).filter((Le) => Le.id !== k.id);
        we.unshift({ id: k.id, title: k.title, tracks: k.tracks }), e.store.set(oe(E), JSON.stringify(we.slice(0, 30))), I = `${k.existing ? "That player already exists" : "Player made"} ✓ “${k.title}” · ${k.tracks} songs. Pick it below for a batch.`;
      } catch (U) {
        I = U.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const $ = (E, H) => SI(E || location.origin + "/radio.html", H), D = (E) => {
    try {
      const H = JSON.parse(e.store.get(Ig(E)) || "[]");
      return Array.isArray(H) ? H.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id) && Array.isArray(z.codes)) : [];
    } catch {
      return [];
    }
  }, ce = (E, H) => e.store.set(Ig(E), JSON.stringify([...H.filter((z) => z.codes.length), ...H.filter((z) => !z.codes.length)].slice(0, 80))), ye = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Be = (E, H) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let Ne = 0;
  async function Pt(E) {
    const H = D(E);
    for (const U of H)
      if (!ye(U))
        try {
          U.view = !U.view || U.view.status === "pending-deposit" ? await Be("/radio/gift/batch/confirm", { id: U.id, ...U.txid ? { txid: U.txid } : {} }) : await e.json("/radio/gift/batch?id=" + U.id), U.error = void 0;
        } catch (q) {
          U.error = q.message;
        }
    try {
      const U = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const q of (U == null ? void 0 : U.batches) ?? []) {
        const te = H.find((Ie) => Ie.id === q.id);
        if (te) {
          te.error || (te.view = q);
          continue;
        }
        H.push({ id: q.id, codes: [], count: q.count, amount: q.amount, label: q.label, player: q.player, depositTo: "", deposit: q.deposit, memo: q.memo, at: 0, view: q });
      }
    } catch {
    }
    const z = /* @__PURE__ */ new Map();
    for (const U of D(E)) (!z.has(U.id) || U.codes.length > z.get(U.id).codes.length) && z.set(U.id, U);
    for (const U of H) {
      const q = z.get(U.id);
      q ? z.set(U.id, { ...q, view: U.view ?? q.view, error: U.error, txid: q.txid ?? U.txid, codes: q.codes.length >= U.codes.length ? q.codes : U.codes, depositTo: q.depositTo || U.depositTo }) : z.set(U.id, U);
    }
    ce(E, [...z.values()]), e.changed();
  }
  async function He(E, H) {
    const z = D(E).find((U) => U.id === H);
    if (!(!z || !z.depositTo || m)) {
      m = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const U = await e.pay(E, z.depositTo, BigInt(z.deposit), z.memo), q = D(E), te = q.find((Ie) => Ie.id === H);
        te && (te.txid = U), ce(E, q), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", Pt(E);
      } catch (U) {
        I = `${/cancel/i.test(U.message) ? "Payment cancelled." : U.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Se(E, H, z, U) {
    if (m) return;
    if (!H.ok) {
      I = H.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", I = "", e.changed();
    let q = null;
    try {
      const te = { creator: E, count: H.count, amount: H.amount.toString(), label: z, issued: e.now(), ...U ? { player: U } : {} }, Ie = await e.sign(E, AI(te));
      m = "Making your links…", e.changed(), q = await Be("/radio/gift/batch", { request: te, signature: Ie });
      const be = D(E);
      be.unshift({ id: q.id, codes: q.codes, count: H.count, amount: q.amount, label: z, player: U ?? null, depositTo: q.depositTo, deposit: q.deposit, memo: q.memo, at: e.now() }), ce(E, be);
    } catch (te) {
      I = te.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await He(E, q.id);
  }
  async function Ce(E, H, z) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", I = "", e.changed();
      try {
        const U = { creator: E, batch: H, days: z, issued: e.now() }, q = await e.sign(E, TI(U));
        m = "Extending…", e.changed();
        const te = await Be("/radio/gift/batch/extend", { request: U, signature: q }), Ie = D(E);
        for (const be of (te == null ? void 0 : te.batches) ?? []) {
          const k = Ie.find((we) => we.id === be.id);
          k && (k.view = be, k.error = void 0);
        }
        ce(E, Ie), I = te != null && te.extended ? `Extended ✓ ${te.extended === 1 ? "That batch has" : `${te.extended} batches have`} ${z} more days.` : "There was nothing live to extend.";
      } catch (U) {
        I = /cancel/i.test(U.message || "") ? "Cancelled. Nothing changed." : U.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const dn = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function Wt(E, H) {
    const z = H.filter((te) => {
      var Ie;
      return ((Ie = te.view) == null ? void 0 : Ie.status) === "live" && te.view.copies.waiting > 0;
    });
    if (!z.length) return null;
    const U = Math.min(...z.map((te) => te.view.expires)), q = de("p", "", "ppp-batch-extend");
    q.append(de("span", `${z.length} live ${z.length === 1 ? "batch" : "batches"} · the first runs out in ${dn(U)} days. Extend ${z.length === 1 ? "it" : "them all"}: `));
    for (const te of xg) {
      const Ie = Qt(`+${te} days`, () => void Ce(E, "all", te), "tiny");
      Ie.disabled = !!m, q.append(Ie);
    }
    return q;
  }
  const ot = () => sn(!!ze.value, Xe.value, Lt.value);
  function sn(E, H, z) {
    const U = H === "max" ? kI(E) : Number(H), q = Sb(U, E), te = Number(z);
    return !Number.isInteger(te) || te < 1 || te > ba ? { ok: !1, reason: `Make 1 to ${ba} copies at a time.`, album: E, plays: U, amount: q, count: te } : II(q) ? { ok: !0, reason: "", album: E, plays: U, amount: q, count: te, bill: $I(te, q, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: U, amount: q, count: te };
  }
  const At = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? LI;
  }, j = (E = ot()) => {
    if (!E.ok) return E.reason;
    const H = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${Kn(H.holders)} to song holders, ${Kn(H.fees)} network fees)${E.album ? `, ${Kn(H.float)} for the album’s likes` : ""}, ${Kn(H.reserve)} kept so a listener can return what is left, + ${Kn(H.sendFee)} to send it = ${Kn(H.perCopy)} STX. ${E.count} copies = ${Kn(H.total)} STX, paid now in one payment. Copies nobody claims within ${At()} days come back to you, and you can extend that at any time.`;
  }, O = (E, H) => H.codes.map((z) => $(E, z)), ee = de("input");
  ee.type = "range", ee.min = String(xb), ee.max = String(hh), ee.step = "10000", ee.value = String(V), ee.setAttribute("aria-label", "Gift amount");
  const J = de("p", "", "ppp-gift-amount"), ae = Qt("", () => {
    const E = e.main();
    E && F(E);
  }, "primary"), ft = () => {
    J.textContent = Me(), ae.textContent = `Gift ${Kn(V)} STX`;
  };
  ee.oninput = () => {
    V = BigInt(ee.value), ft();
  };
  const Me = () => `${Kn(V)} STX · about ${ha(V).toLocaleString()} paid plays · you pay ${Kn(V + xl)} STX with the network fee`;
  ft();
  const Pe = de("input");
  Pe.maxLength = 60, Pe.placeholder = "Title, e.g. Proof of Sound", Pe.setAttribute("aria-label", "Player title");
  const bt = de("input");
  bt.maxLength = 80, bt.placeholder = "Artist (optional)", bt.setAttribute("aria-label", "Player subtitle");
  const De = de("textarea");
  De.rows = 3, De.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", De.setAttribute("aria-label", "Songs");
  const Ee = de("input");
  Ee.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ee.setAttribute("aria-label", "Explicit songs");
  const je = de("input");
  je.inputMode = "numeric", je.placeholder = "Cover inscription number (optional), shown when the album loads", je.setAttribute("aria-label", "Cover inscription");
  const ze = de("select");
  ze.setAttribute("aria-label", "Batch album");
  const Xe = de("select");
  Xe.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Uu])].sort((H, z) => H - z)) Xe.append(pa(`${E.toLocaleString()} plays`, String(E)));
  Xe.append(pa("Max (1 STX)", "max")), Xe.value = String(Uu[0]);
  const Lt = de("input");
  Lt.type = "number", Lt.min = "1", Lt.max = String(ba), Lt.value = "10", Lt.setAttribute("aria-label", "Copies");
  const on = de("input");
  on.maxLength = 40, on.placeholder = "Label, e.g. Opera launch", on.setAttribute("aria-label", "Batch label");
  const Cn = de("p", "", "ppp-mute"), fn = () => {
    Cn.textContent = j();
  };
  for (const E of [ze, Xe, Lt])
    E.oninput = fn, E.onchange = fn;
  fn();
  let Ct = null, Tn = 0;
  async function Wn() {
    Tn = e.now();
    try {
      Ct = jI(await e.json("/radio/giveaway/players"));
    } catch {
      Ct = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const vt = (E, H) => {
    var U;
    if (((U = Ag(D(E), e.now()).next) == null ? void 0 : U.n) !== H.n) {
      I = "That batch is already made. Check again.", e.changed();
      return;
    }
    Se(E, sn(!1, String(H.plays), String(H.count)), H.label);
  };
  function xr(E) {
    var Ie;
    const H = Ag(D(E), e.now()), z = yh(), U = de("div", "", "ppp-drop");
    U.append(
      de("p", `The ${z.players.toLocaleString("en-GB")} players (admin) · ${H.done} of ${z.batches} batches live`, "ppp-cyan"),
      de("p", `${z.tiers.map((be) => `${be.count} ${Co(be.id).name}`).join(", ")}. ${z.batches} batches, ${Kn(z.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const q = de("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const be of H.steps) {
      const k = de("li"), we = be.state === "live" ? "✓" : be.state === "touched" ? "!" : be.state === "todo" ? "○" : "…";
      if (k.append(de("span", `${we} ${be.step.n}. ${Co(be.step.tier).name} · ${be.step.count} × ${be.step.plays.toLocaleString("en-GB")} plays · ${Kn(be.step.deposit)} STX`, "t"), de("span", be.detail, be.state === "live" ? "ppp-ok" : be.state === "touched" ? "ppp-warn" : "ppp-mute")), be.state === "todo" && ((Ie = H.next) == null ? void 0 : Ie.n) === be.step.n) {
        const Le = Qt("Sign and pay", () => vt(E, be.step), "tiny");
        Le.disabled = !!m, k.append(Le);
      }
      if (be.state === "unpaid" && be.batch) {
        const Le = Qt("Pay now", () => void He(E, be.batch.id), "tiny");
        Le.disabled = !!m, k.append(Le);
      }
      q.append(k);
    }
    U.append(q);
    for (const be of H.problems) U.append(de("p", be, "ppp-warn"));
    H.ready ? U.append(
      de("p", `All ${z.batches} batches are live: ${H.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      or("drop-copy", `Copy the ${H.codes.length.toLocaleString("en-GB")} links`, () => H.codes.join(`
`), "tiny", e.changed)
    ) : U.append(de("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - Tn > 6e4 && Wn(), Ct && U.append(de("p", Ct.text, Ct.ok ? "ppp-ok" : "ppp-mute"));
    const te = Qt("Check again", () => {
      Ne = e.now(), Pt(E), Wn();
    }, "tiny");
    return te.disabled = !!m, U.append(te), U;
  }
  function dr(E, H, z) {
    const U = H.view, q = U == null ? void 0 : U.copies, te = H.error ? H.error : !U || U.status === "pending-deposit" ? H.txid ? "payment confirming…" : "waiting for your payment" : `${q.claimed} of ${U.count} claimed${q.refunding + q.refunded ? ` · ${q.refunded} refunded${q.refunding ? `, ${q.refunding} on their way` : ""}` : ""}`, Ie = de("li");
    if (Ie.append(de("span", `${H.label || "Batch"} · ${H.count} × ${Kn(BigInt(H.amount))} STX`, "t"), de("span", te, "ppp-mute")), !H.txid && H.depositTo && (!U || U.status === "pending-deposit") && Ie.append(Qt("Pay now", () => void He(E, H.id), "tiny")), (U == null ? void 0 : U.status) === "live" && q.waiting > 0) {
      Ie.append(de("span", `${dn(U.expires)} days left`, "ppp-mute"));
      for (const be of xg) {
        const k = Qt(`+${be}`, () => void Ce(E, H.id, be), "tiny");
        k.title = `Extend this batch by ${be} days (a signature, no payment)`, k.setAttribute("aria-label", `Extend ${H.label || "this batch"} by ${be} days`), k.disabled = !!m, Ie.append(k);
      }
    }
    if (H.codes.length && (U == null ? void 0 : U.status) === "live") {
      const be = O(z, H);
      Ie.append(
        or("batch-copy:" + H.id, "Copy all links", () => be.join(`
`), "tiny", e.changed),
        or("batch-csv:" + H.id, "Copy as CSV", () => ["copy,link", ...be.map((k, we) => `${we + 1},${k}`)].join(`
`), "tiny", e.changed)
      );
    } else H.codes.length || Ie.append(de("span", "links were made on another device", "ppp-mute"));
    return Ie;
  }
  const an = de("select");
  an.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Uu])].sort((H, z) => H - z)) an.append(pa(`${E.toLocaleString()} plays`, String(E)));
  an.value = "50";
  const _t = de("input");
  _t.type = "number", _t.min = "1", _t.max = String(ba), _t.value = "10", _t.setAttribute("aria-label", "How many copies");
  const cn = de("input");
  cn.maxLength = 40, cn.placeholder = "A note recipients see, e.g. Launch week (optional)", cn.setAttribute("aria-label", "Note for recipients");
  const Et = de("p", "", "ppp-mute");
  function Zt(E, H, z) {
    const U = () => sn(!0, an.value, _t.value), q = () => {
      Et.textContent = j(U());
    };
    for (const it of [an, _t])
      it.oninput = q, it.onchange = q;
    q();
    const te = () => (cn.value.trim() || H.title).replace(/[^ -~]/g, "").slice(0, 40), Ie = Qt("Sign, pay and make links", () => {
      Se(E, U(), te(), H.id);
    }, "primary");
    Ie.disabled = !!m;
    const be = (it, ut) => {
      const rt = de("label", it);
      return rt.append(ut), rt;
    }, k = [
      de("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      be("Plays in each ", an),
      be("Copies ", _t),
      cn,
      Et,
      Ie
    ];
    e.now() - Ne > 3e4 && (Ne = e.now(), Pt(E));
    const we = D(E).filter((it) => it.player === H.id);
    if (we.length) {
      const it = de("ul", "", "ppp-gift-list");
      for (const ut of we.slice(0, 10)) it.append(dr(E, ut, z));
      k.push(it);
    }
    const Le = Wt(E, D(E));
    return Le && k.push(Le), m && k.push(de("p", m, "ppp-cyan")), I && k.push(de("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), k;
  }
  function ss(E) {
    var q, te;
    const H = (q = E.gate) == null ? void 0 : q.gifts;
    if (!(H != null && H.enabled) || !H.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const z = e.main(), U = [de("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!z)
      U.push(de("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (H.admin) {
      const Ie = de("div", "", "ppp-gift-admin"), be = (ut, rt) => {
        const Jt = de("label", ut);
        return Jt.append(rt), Jt;
      }, k = ie(z);
      Ie.append(
        de("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Pe,
        bt,
        De,
        je,
        Ee,
        Qt("Sign and make player", () => void Fe(z, { title: Pe.value, subtitle: bt.value, tracks: De.value, cover: je.value, explicit: Ee.value }))
      );
      const we = Qt("Sign, pay and make links", () => {
        Se(z, ot(), on.value.trim(), ze.value || void 0);
      });
      we.disabled = !!m;
      const Le = ze.value;
      ze.replaceChildren(pa("No album (starter copies)", ""), ...k.map((ut) => pa(`${ut.title} · ${ut.tracks} songs`, ut.id))), k.some((ut) => ut.id === Le) && (ze.value = Le), fn(), Ie.append(
        de("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${At()} days unless you extend`, "ppp-cyan"),
        be("Album ", ze),
        be("Plays each ", Xe),
        be("Copies ", Lt),
        on,
        Cn,
        we
      ), e.now() - Ne > 3e4 && (Ne = e.now(), Pt(z));
      const it = D(z);
      if (it.length) {
        const ut = de("ul", "", "ppp-gift-list");
        for (const Jt of it.slice(0, 20)) ut.append(dr(z, Jt, ((te = E.gate) == null ? void 0 : te.radioUrl) ?? null));
        Ie.append(ut);
        const rt = Wt(z, it);
        rt && Ie.append(rt);
      }
      Ie.append(xr(z)), U.push(Ie);
    }
    return m && U.push(de("p", m, "ppp-cyan")), I && U.push(de("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), Q.replaceChildren(...U), Q;
  }
  return { banner: K, funder: se, renderFold: ss, copies: Zt, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: g, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: _ };
}
const KI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function VI(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e) {
    if (!n || !Number.isSafeInteger(n.slot) || n.slot < 1 || typeof n.address != "string") continue;
    const r = n.player, o = r && typeof r.id == "string" && typeof r.title == "string" && Array.isArray(r.tracks) ? r : null;
    o && t.push({
      slot: n.slot,
      address: n.address,
      state: n.state === "arrived" ? "arrived" : "sending",
      amount: String(n.amount ?? "0"),
      label: typeof n.label == "string" ? n.label : "",
      from: typeof n.from == "string" ? n.from : null,
      source: String(n.source ?? ""),
      player: o
    });
  }
  return t;
}
const XI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((o) => !o.hidden).flatMap((o) => [o.title, o.artist])].filter(Boolean).join(" ").toLowerCase();
};
function YI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((s) => (!t.pinnedOnly || t.pins.has(s.slot)) && (() => {
    const i = XI(s);
    return n.every((a) => i.includes(a));
  })()), o = {
    recent: (s, i) => (t.recents[i.slot] ?? 0) - (t.recents[s.slot] ?? 0) || i.slot - s.slot,
    newest: (s, i) => i.slot - s.slot,
    oldest: (s, i) => s.slot - i.slot,
    title: (s, i) => {
      var a, c;
      return (((a = s.player) == null ? void 0 : a.title) ?? "").localeCompare(((c = i.player) == null ? void 0 : c.title) ?? "") || s.slot - i.slot;
    }
  };
  return r.sort((s, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(s.slot)) || o[t.sort](s, i));
}
function qI(e, t = 100) {
  const n = Object.entries(e).sort((r, o) => o[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, o]) => [Number(r), o]));
}
const Jd = /* @__PURE__ */ new Set(), wh = (e) => (Jd.add(e), () => {
  Jd.delete(e);
}), Sl = () => {
  for (const e of [...Jd])
    try {
      e();
    } catch {
    }
}, Lg = "xtrata:al-thumb:v1:", mh = "-", ga = 96, WI = 24 * 1024 * 1024, yn = /* @__PURE__ */ new Map(), Cg = /* @__PURE__ */ new Set(), Qd = [];
let Hu = !1, Du;
const Da = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Lg + e);
    window.localStorage.setItem(Lg + e, t);
  } catch {
  }
  return null;
};
function bh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), o = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!o) return t(e);
      const s = new Image(), i = setTimeout(() => t(e), 8e3);
      s.onload = () => {
        clearTimeout(i);
        try {
          const a = Math.min(s.naturalWidth, s.naturalHeight);
          if (!a) return t(e);
          r.width = r.height = ga, o.fillStyle = "#143a40", o.fillRect(0, 0, ga, ga), o.drawImage(s, (s.naturalWidth - a) / 2, (s.naturalHeight - a) / 2, a, a, 0, 0, ga, ga), t(r.toDataURL("image/jpeg", 0.82));
        } catch {
          t(e);
        }
      }, s.onerror = () => {
        clearTimeout(i), t(e);
      }, s.src = e;
    } catch {
      t(e);
    }
  });
}
async function ZI(e) {
  var c, f, g, h, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((f = t.body) == null ? void 0 : f.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((g = t.body) == null ? void 0 : g.cancel()), "";
  let r = "", o = 0;
  const s = (y) => {
    let x = 0;
    for (; ; ) {
      const S = r.slice(x).search(/<img\b/i);
      if (S < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const C = x + S, B = r.indexOf(">", C);
      if (B < 0)
        return r = r.slice(C), null;
      const P = r.slice(C, B + 1), v = P.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (v) return v[1].replace(/&amp;/g, "&");
      const T = P.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      x = B + 1;
    }
  }, i = (w = (h = t.body) == null ? void 0 : h.getReader) == null ? void 0 : w.call(h);
  if (!i)
    return r = await t.text(), s(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: x } = await i.read();
    if (y) break;
    o += x.byteLength, r += a.decode(x, { stream: !0 });
    const S = s(!1);
    if (S)
      return await i.cancel(), S;
    if (o > WI)
      return await i.cancel(), null;
  }
  return r += a.decode(), s(!0) ?? "";
}
async function JI() {
  if (!Hu) {
    Hu = !0;
    try {
      for (; Qd.length; ) {
        const e = Qd.shift();
        if (!yn.has(e))
          try {
            const t = await ZI(e);
            if (t === null) continue;
            if (!t) {
              yn.set(e, ""), Da(e, mh), Sl();
              continue;
            }
            const n = await bh(t);
            yn.set(e, n), n.startsWith("data:image/jpeg") && Da(e, n), Sl();
          } catch {
          }
      }
    } finally {
      Hu = !1;
    }
  }
}
function xh(e, t) {
  if (t && !yn.get(e) ? (yn.set(e, t), bh(t).then((r) => {
    r !== t && (yn.set(e, r), r.startsWith("data:image/jpeg") && Da(e, r), Sl());
  })) : t === "" && !yn.has(e) && yn.set(e, ""), yn.has(e)) return yn.get(e);
  const n = Da(e);
  if (n != null) {
    const r = n === mh ? "" : n;
    return yn.set(e, r), r;
  }
  return Cg.has(e) || (Cg.add(e), Qd.push(e), Du || (Du = setTimeout(() => {
    Du = void 0, JI();
  }, 1200))), "";
}
function Tg(e) {
  if (yn.has(e)) return yn.get(e);
  const t = Da(e);
  if (t == null) return null;
  const n = t === mh ? "" : t;
  return yn.set(e, n), n;
}
const Fu = /* @__PURE__ */ new Map(), ju = /* @__PURE__ */ new Set();
function Gc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Fu.has(e) ? Fu.get(e) : (ju.has(e) || (ju.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, o, s, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((o = t.body) == null ? void 0 : o.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((s = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : s[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    Fu.set(e, t), Sl();
  }).catch(() => {
    ju.delete(e);
  })), "");
}
const bi = 12, QI = 5e3, kn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, xi = (e, t, n = "") => {
  const r = kn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function eL(e) {
  let t, n = [], r = 0, o = !1, s = !1, i = -1 / 0, a = "", c = "recent", f = !1, g = bi;
  const h = kn("div", "", "ppp-shelf-box");
  wh(() => e.changed());
  const w = (N) => "xtrata.radio.shelf.pins.v1:" + N, y = (N) => "xtrata.radio.shelf.recent.v1:" + N, x = (N, M) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? M;
    } catch {
      return M;
    }
  }, S = (N) => new Set(x(w(N), []).filter((M) => Number.isSafeInteger(M))), C = (N) => {
    const M = x(y(N), {}), X = {};
    for (const [F, oe] of Object.entries(M)) Number.isSafeInteger(Number(F)) && typeof oe == "number" && (X[Number(F)] = oe);
    return X;
  };
  async function B(N) {
    if (!o) {
      o = !0, s = !1;
      try {
        const M = [];
        let X = 0, F = 0;
        for (let oe = 0; oe < QI / 100 + 1; oe++) {
          const ie = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${X}&limit=100`);
          if (M.push(...VI(ie == null ? void 0 : ie.shelf)), F = Number(ie == null ? void 0 : ie.total) || M.length, !(ie != null && ie.next) || !Number.isSafeInteger(ie.next)) break;
          X = ie.next;
        }
        N === t && (n = M, r = F, i = e.now());
      } catch {
        s = !0;
      } finally {
        o = !1, e.changed();
      }
    }
  }
  const P = () => {
    i = -1 / 0;
  }, v = kn("input");
  v.type = "search", v.placeholder = "Search title, artist or #", v.setAttribute("aria-label", "Search your albums"), v.oninput = () => {
    a = v.value, g = bi, e.changed();
  };
  const T = kn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const N of KI) {
    const M = document.createElement("option");
    M.value = N.value, M.textContent = N.label, T.append(M);
  }
  T.onchange = () => {
    c = T.value, g = bi, e.changed();
  };
  const _ = xi("", () => {
    f = !f, g = bi, e.changed();
  }, "tiny"), K = kn("div", "", "ppp-shelf-tools");
  K.append(v, T, _);
  const se = kn("div"), Q = kn("div");
  function V(N) {
    const M = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (M !== t && (t = M, n = [], r = 0, i = -1 / 0, g = bi), !M || N.walletCannotAlbums) return null;
    if (!o && e.now() - i > 5 * 6e4 && B(M), !n.length)
      return s ? (Q.replaceChildren(kn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), xi("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), h.replaceChildren(Q), h) : null;
    const X = S(M), F = C(M), oe = YI(n, { query: a, sort: c, pinnedOnly: f, pins: X, recents: F });
    v.value !== a && (v.value = a), T.value = c, _.textContent = f ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(f));
    const ie = [];
    if (N.slot > 0 && ie.push(xi("← My player", () => e.open(0), "quiet")), !oe.length) ie.push(kn("p", "No album matches that.", "ppp-mute"));
    else {
      const Fe = kn("ul", "", "ppp-shelf-list");
      for (const $ of oe.slice(0, g)) {
        const D = kn("li", "", $.slot === N.slot ? "now" : ""), ce = X.has($.slot), ye = xi(ce ? "★" : "☆", () => {
          const ot = new Set(X);
          ce ? ot.delete($.slot) : ot.add($.slot), e.store.set(w(M), JSON.stringify([...ot])), e.changed();
        }, "tiny");
        ye.setAttribute("aria-label", ce ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Be = [$.player.subtitle, `${Pr($.player).length} ${Pr($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ne = $.slot === N.slot, Pt = xi(Ne ? "Playing" : "Select", () => {
          e.store.set(y(M), JSON.stringify(qI({ ...F, [$.slot]: e.now() }))), e.open($.slot);
        }, Ne ? "tiny ppp-pick" : "tiny primary ppp-pick");
        Pt.disabled = Ne;
        const He = Pr($.player)[0], Se = $.player.cover ?? (He == null ? void 0 : He.id), Ce = Se ? xh(String(Se)) : "", dn = kn("span", "", "ppp-shelf-art");
        if (Ce) {
          const ot = document.createElement("img");
          ot.src = Ce, ot.alt = "", ot.decoding = "async", dn.append(ot);
        } else dn.textContent = "💿";
        const Wt = kn("span", "", "ppp-shelf-txt");
        Wt.append(kn("span", $.player.title, "t"), kn("span", Be, "ppp-mute")), D.append(ye, dn, Wt, Pt), Fe.append(D);
      }
      ie.push(Fe), oe.length > g && ie.push(xi(`Show more (${oe.length - g} left)`, () => {
        g += bi, e.changed();
      }, "quiet"));
    }
    return s && ie.push(kn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), se.replaceChildren(...ie), h.firstChild !== K && h.replaceChildren(K, se), h;
  }
  return { render: V, invalidate: P, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = C(t), M = [...n].filter((X) => X.player).sort((X, F) => (N[F.slot] ?? 0) - (N[X.slot] ?? 0) || F.slot - X.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const Bg = "http://www.w3.org/2000/svg", tL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function vl(e = "", t = !1) {
  const n = document.createElementNS(Bg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, o] of tL) {
    const s = document.createElementNS(Bg, "path");
    s.setAttribute("fill-rule", "evenodd"), s.setAttribute("fill", t ? "currentColor" : r), s.setAttribute("d", o), n.append(s);
  }
  return n;
}
const et = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, En = (e, t, n, r = !1) => {
  const o = et("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, $b = (e) => e.toLocaleString(), Ng = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, nL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function El(e, t) {
  const n = et("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, o) => {
    const s = et("li", o < t ? "is-done" : o === t ? "is-now" : "");
    s.append(et("i", "", o < t ? "✓" : String(o + 1)), et("span", "", r)), n.append(s);
  }), n;
}
function rL() {
  const e = et("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(et("span", "tier-disc__mark", "?")), e;
}
const Vn = {
  gift: { title: "Your disc is ready", primary: "Claim my free player", play: "Play", hint: "Free. Face ID or fingerprint.", returning: "I already have a player", full: "Look around first" },
  new: {
    title: "Music that pays the artist",
    body: "Every play counts for whoever owns the song. Make your player once and you’re in.",
    primary: "Make my player",
    hint: "One tap with Face ID or your fingerprint. No app, no account, no password.",
    returning: "I’ve listened here before",
    full: "Look around first"
  },
  back: { title: "Welcome back", body: "Unlock your player and carry on listening.", primary: "Unlock my player", hint: "One tap with Face ID or your fingerprint.", returning: "Use a different passkey", full: "Look around first" },
  backClaim: {
    title: "A free player is waiting",
    body: "This device already has a player you made before. You can claim the free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is.",
    primary: "Claim it as a new player",
    hint: "One tap with Face ID or your fingerprint. You can switch between your players at any time.",
    unlock: "Open my existing player instead",
    replace: "Replace my old player",
    replaceHint: "Its balance is sent back first, then it is removed from this device. You end up with one player that has 24 backup words.",
    both: "Keep both players"
  },
  arriving: { title: "Your player is made", body: "Your plays are on their way to it. This usually takes about a minute: keep this page open and it carries on by itself.", playing: "Your player is made" },
  landed: { title: "You’re in", primary: "Start listening", playing: "Keep listening" },
  empty: { title: "Your player is ready", body: "It has no plays yet. Add some and every song you hear pays its artist.", primary: "Add plays", full: "Look around the radio" },
  checking: "One moment…",
  asking: "Continue in the box below."
}, sL = (e) => e ? `Disc ${e} is yours` : Vn.gift.title, oL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${$b(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", iL = (e) => e ? `${$b(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function Mg(e, t = !1) {
  const n = et("div", "al-now" + (t ? " al-now--big" : "")), r = et("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const o = et("div", "al-now__t");
  o.append(et("b", "", e.title || "Playing now"), et("span", "", e.artist));
  const s = et("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return s.setAttribute("aria-hidden", "true"), s.append(et("s"), et("s"), et("s")), n.append(r, o, s), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const aL = (e) => e ? `You got a ${e.name} player` : Vn.landed.title;
function cL(e, t = !0) {
  const n = et("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(et("span", "tier-disc__mark", e.mark)), n;
}
function lL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, o = !1) {
      var g, h;
      if (!r) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const s = et("header", "al-top"), i = et("a", "al-brand");
      i.href = "/radio", i.append(vl("al-logo"), et("span", "", "Xtrata "), et("b", "", "Music")), s.append(i);
      const a = et("div", "al-body al-body--welcome"), c = et("div", "al-welcome"), f = r.mode;
      if (f === "checking")
        c.append(et("p", "al-welcome-wait", Vn.checking));
      else {
        const w = nL(f);
        w >= 0 && c.append(El(f === "new" ? Ng.fresh : Ng.gift, w)), r.tier && (f === "landed" || f === "back" || f === "empty") ? c.append(cL(r.tier)) : f === "gift" || f === "arriving" ? c.append(rL()) : f === "new" && c.append(vl("al-hero-mark"));
        const y = r.now && (f === "gift" || f === "arriving" || f === "landed") ? r.now : null;
        if (c.append(et("h1", "", f === "landed" ? aL(r.tier) : f === "back" && r.tier ? `Your ${r.tier.name} player` : f === "gift" ? sL(r.spot) : Vn[f].title)), y && f === "arriving" ? c.append(Mg(y, !0)) : c.append(et("p", "", f === "gift" ? oL(r.plays, r.from, r.mystery) : f === "landed" ? iL(r.plays) : Vn[f].body)), y && f !== "arriving" && c.append(Mg(y)), r.status.length) {
          const x = et("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), c.append(x);
        }
        if (r.asking) c.append(et("p", "al-hint al-hint--ask", Vn.asking));
        else if (f === "back" && r.claimNew) {
          const x = Vn.backClaim;
          c.append(et("p", "al-hint", x.body)), r.canStart && r.replaceOld ? c.append(En("al-primary", x.replace, r.replaceOld, r.busy), et("p", "al-hint", x.replaceHint), En("al-link", x.both, r.claimNew, r.busy), En("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && c.append(En("al-primary", x.primary, r.claimNew, r.busy), et("p", "al-hint", x.hint), En("al-link", x.unlock, r.unlock, r.busy)), c.append(En("al-link", Vn.back.full, r.full));
        } else if (f === "gift") {
          const x = Vn.gift;
          if (r.canStart) {
            const S = En("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            c.append(S, et("p", "al-hint", x.hint));
          }
          r.canStart ? c.append(En("al-link", x.returning, r.returning, r.busy)) : c.append(En("al-link", x.full, r.full));
        } else if (f === "new" || f === "back") {
          const x = Vn[f];
          r.canStart && c.append(En("al-primary", x.primary, f === "back" ? r.unlock : r.start, r.busy), et("p", "al-hint", x.hint)), r.canStart && c.append(En("al-link", x.returning, r.returning, r.busy)), c.append(En("al-link", x.full, r.full));
        } else if (f === "landed") {
          if (c.append(En("al-primary", (g = r.now) != null && g.playing ? Vn.landed.playing : Vn.landed.primary, r.full)), (h = r.albums) != null && h.length && !r.now) {
            c.append(et("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const S = En("al-album", "", x.run);
              if (x.cover) {
                const B = et("img", "al-album__art");
                B.src = x.cover, B.alt = "", S.classList.add("al-album--art"), S.append(B);
              }
              const C = et("span", "al-album__t");
              C.append(et("b", "", x.title), et("span", "", x.by)), S.append(C), c.append(S);
            }
          }
        } else f === "empty" && c.append(En("al-primary", Vn.empty.primary, r.restock), En("al-link", Vn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(s, a);
    }
  };
}
const uL = 20, dL = ["Album", "Passkey", "Listen"], bn = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Vt = {
  grid: bn('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: bn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: bn('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: bn('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: bn('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: bn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: bn('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: bn('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: bn('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: bn('<path d="M6 9l6 6 6-6"/>', 18),
  right: bn('<path d="M9 6l6 6-6 6"/>', 16),
  close: bn('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: bn('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: bn('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: bn('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: bn('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: bn('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function ne(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    s == null || s === !1 || (o === "class" ? r.className = String(s) : o === "html" ? r.innerHTML = String(s) : o.startsWith("on") && typeof s == "function" ? r[o.toLowerCase()] = s : o === "disabled" ? r.disabled = !!s : r.setAttribute(o, s === !0 ? "" : String(s)));
  for (const o of n) o != null && o !== !1 && r.append(o);
  return r;
}
const An = (e, ...t) => ne("button", { type: "button", ...e }, ...t), Bc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, ya = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, fL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, hL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function _g(e, t, n = {}) {
  const r = !!n.list;
  let o = null, s = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var N, M, X;
    if (!m || !Number.isSafeInteger(m)) return "";
    const I = (X = (M = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : M.call(N)) == null ? void 0 : X.albumCover;
    return I != null && I.url && Number(I.tokenId) === m ? I.url : Gc(m);
  }
  wh(() => V());
  function f(m) {
    var N;
    s = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const I = document.querySelector(".side");
    if (m && m !== "more") {
      for (const F of hL[m]) {
        const oe = I == null ? void 0 : I.querySelector(F);
        oe && (oe.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = fL[m]);
      const X = document.getElementById("sheetExtra");
      X && X.replaceChildren(...m === "music" ? [h()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    V();
  }
  const g = r ? null : document.getElementById("sheetClose");
  g && (g.onclick = () => f("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && s && a.dataset.view === "album" && f("");
  });
  const h = () => An(
    { class: "al-row", onClick: () => {
      f(""), t.openPlayer();
    } },
    ne("span", { class: "al-row-i", html: Vt.radio }),
    ne("span", { class: "al-row-t" }, ne("b", {}, "Xtrata Radio"), ne("small", {}, "Every song on-chain · FM, liked, all")),
    ne("span", { class: "al-row-go", html: Vt.right })
  );
  let w = null, y = !1;
  const x = () => {
    var I;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((N) => {
      w = N, (o == null ? void 0 : o.mode) === "open" && V();
    }), w = ((I = m.getState) == null ? void 0 : I.call(m)) ?? null);
  };
  r || setInterval(() => {
    var M, X;
    if ((o == null ? void 0 : o.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (X = (M = t.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : X.call(M), I = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !m || !I || (I.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = Bc(m.current || 0), N[1].textContent = m.duration ? Bc(m.duration) : "–:––"));
  }, 500);
  let S = "", C = null;
  function B(m, I, N = {}) {
    const M = N.song || c(m.cover), F = [M ? ne("img", { src: M, alt: N.song ? "Song artwork" : `${m.title} cover` }) : ne("div", { class: "al-cover-fallback" }, ne("b", {}, m.title), m.subtitle ? ne("span", {}, m.subtitle) : null), N.paused ? ne("span", { class: "al-paused" }, ne("i", { html: Vt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], oe = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (F.push(ne("span", { class: "al-flip", "aria-hidden": "true", html: Vt.flip })), An({ class: oe + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: N.flip }, ...F)) : ne("div", { class: oe }, ...F);
  }
  function P(m) {
    return m.plays === null || m.plays === void 0 ? ne("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? ne("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : ne("span", { class: "al-chip" + (m.plays <= uL ? " al-chip--low" : "") }, `${ya(m.plays, "play", "plays")} left`);
  }
  function v(m) {
    const I = m.player, N = I.tracks.filter((X) => !X.hidden), M = [];
    return m.step !== void 0 && M.push(El(dL, m.step)), m.mode === "arrive" && m.from && M.push(ne("p", { class: "al-from" }, ne("span", { html: Vt.gift }), ne("span", {}, ne("b", {}, m.from), " sent you an album"))), M.push(B(I, !0)), M.push(ne(
      "div",
      { class: "al-intro" },
      ne("h1", {}, I.title),
      I.subtitle ? ne("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? ne("p", { class: "al-songline" }, N.map((X) => X.title || `#${X.id}`).join(" · ")) : null,
      ne("span", { class: "al-chip" }, [ya(N.length, "song", "songs"), m.offered ? ya(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && M.push(ne("div", { class: "al-status", role: "status" }, ...m.status)), M.push(ne("div", { class: "al-grow" })), m.asking ? M.push(ne("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && M.push(An({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, ne("span", { html: Vt.playSmall }), m.primary.label)), m.hint && !m.asking && M.push(ne("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && M.push(An({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), M;
  }
  function T(m, I) {
    const { songs: N, current: M, started: X, own: F, out: oe, waiting: ie } = I, Fe = m.player, $ = t.radio(), D = [];
    D.push(ne("div", { class: "al-listhead" }, ne("span", {}, ne("b", {}, Fe.title), ` · ${ya(N.length, "song", "songs")}`), P(m)));
    const ce = c(Fe.cover), ye = "album:" + Fe.cover;
    ce && !yn.has(ye) && (yn.set(ye, ce), bh(ce).then((Ne) => {
      Ne !== ce && (yn.set(ye, Ne), V());
    }));
    const Be = ce ? yn.get(ye) || ce : "";
    return D.push(ne("ol", { class: "al-tracks" }, ...N.map((Ne, Pt) => {
      const He = String(Ne.id) === M, Se = xh(String(Ne.id), He && X ? F : void 0);
      return ne("li", {}, An(
        { class: "al-track" + (He ? " is-on" : ""), "aria-label": `Play ${Ne.title || "#" + Ne.id}`, "aria-current": He ? "true" : void 0, disabled: oe || ie, onClick: () => {
          var Ce;
          return (Ce = $ == null ? void 0 : $.playToken) == null ? void 0 : Ce.call($, Ne.id);
        } },
        ne(
          "span",
          { class: "al-th" + (Se ? "" : " is-blank") },
          Se ? ne("img", { src: Se, alt: "", decoding: "async" }) : Be ? ne("img", { src: Be, alt: "", decoding: "async" }) : null,
          Se ? null : ne("span", { class: "al-n" }, String(Pt + 1)),
          He ? ne("span", { class: "al-eq", html: Vt.eq }) : null
        ),
        ne("span", { class: "al-tt" }, Ne.title || `#${Ne.id}`, Ne.explicit ? ne("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), D;
  }
  function _(m) {
    var Se;
    const I = m.player, N = I.tracks.filter((Ce) => !Ce.hidden), M = t.radio(), X = w == null ? void 0 : w.nowPlaying, F = X && I.tracks.some((Ce) => String(Ce.id) === String(X.tokenId)) ? String(X.tokenId) : null, oe = F ? I.tracks.find((Ce) => String(Ce.id) === F) : null, ie = m.plays === 0 && !m.playsComing, Fe = !!m.playsComing && !m.plays, $ = !!(w != null && w.playing) && !!F, D = w == null ? void 0 : w.heart, ce = F ? (Se = M == null ? void 0 : M.getPosition) == null ? void 0 : Se.call(M) : null;
    F && ($ || ((ce == null ? void 0 : ce.current) ?? 0) > 0.5) && (S = I.id);
    const ye = !!F && S === I.id;
    C && C !== F && (C = null);
    const Be = ye ? String((X == null ? void 0 : X.cover) || "") : "", Ne = !!Be && C === F, He = [B(I, !ie, { song: Ne ? "" : Be, paused: ye && !$, flip: Be ? () => {
      C = C === F ? null : F, V();
    } : void 0, flipped: Ne })];
    if (He.push(ne(
      "div",
      { class: "al-now" },
      ne(
        "div",
        { class: "al-now-t" },
        ne("div", { class: "al-song" }, oe ? oe.title || (X == null ? void 0 : X.title) || `#${oe.id}` : I.title),
        ne("div", { class: "al-artist" }, oe ? oe.artist || (X == null ? void 0 : X.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      F ? An({ class: "al-icon" + (D != null && D.liked ? " is-on" : ""), "aria-label": D != null && D.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(D != null && D.liked)), disabled: !!(D != null && D.pending) || !!(D != null && D.locked) || Fe, onClick: () => {
        var Ce;
        return (Ce = M == null ? void 0 : M.toggleLike) == null ? void 0 : Ce.call(M);
      }, html: D != null && D.liked ? Vt.heartOn : Vt.heart }) : null
    )), ie)
      He.push(ne(
        "div",
        { class: "al-out" },
        ne("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        ne("p", { class: "al-out-t" }, "You've played this album out"),
        ne("p", { class: "al-out-s" }, "Add plays to keep listening."),
        K(m, !0)
      ));
    else {
      const Ce = ce != null && ce.duration ? Math.min(100, ce.current / ce.duration * 100) : 0;
      He.push(ne(
        "div",
        { class: "al-prog" },
        ne("div", { class: "al-bar" }, ne("i", { style: `width: ${Ce}%` })),
        ne("div", { class: "al-times" }, ne("span", {}, Bc((ce == null ? void 0 : ce.current) || 0)), ne("span", {}, ce != null && ce.duration ? Bc(ce.duration) : "–:––"))
      ));
    }
    return He.push(ne(
      "div",
      { class: "al-ctl" + (ie || Fe ? " is-off" : "") },
      An({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ie || Fe, onClick: () => {
        var Ce;
        return (Ce = M == null ? void 0 : M.prev) == null ? void 0 : Ce.call(M);
      }, html: Vt.prev }),
      An({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: ie || Fe, onClick: () => {
        var Ce;
        return (Ce = M == null ? void 0 : M.playPause) == null ? void 0 : Ce.call(M);
      }, html: $ ? Vt.pause : Vt.play }),
      An({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ie || Fe, onClick: () => {
        var Ce;
        return (Ce = M == null ? void 0 : M.next) == null ? void 0 : Ce.call(M);
      }, html: Vt.next })
    )), m.status.length && He.push(ne("div", { class: "al-status", role: "status" }, ...m.status)), He.push(...T(m, { songs: N, current: F, started: ye, own: Be, out: ie, waiting: Fe })), He.push(ne("div", { class: "al-grow" })), He.push(An(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => f(s === "more" ? "" : "more") },
      ne("span", {}, "More ", ne("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      ne("span", { html: Vt.down })
    )), He;
  }
  function K(m, I) {
    const N = ne("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), M = I ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const X of M) {
      const F = m.myPlays !== void 0 && m.myPlays >= X && !m.playsComing && !m.busy;
      N.append(An({ class: "al-topup", disabled: !F, onClick: () => t.topUp(X) }, I ? `Add ${X.toLocaleString()} plays` : `+${X.toLocaleString()}`));
    }
    return I && N.append(An({ class: "al-link", onClick: () => f("more") }, "Other amounts")), N;
  }
  function se(m) {
    const I = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), N = ne(
      "div",
      { class: "al-card" },
      ne("div", { class: "al-card-h" }, ne("b", {}, `Add plays to ${m.player.title}`), ne("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      K(m, !1),
      ne("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${ya(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !m.playsComing && m.myPlays !== void 0 ? An({ class: "al-link", onClick: () => {
        f(""), t.openPlayer();
      } }, "Open My player") : null
    ), M = (F, oe, ie, Fe) => An(
      { class: "al-row", onClick: Fe },
      ne("span", { class: "al-row-i", html: F }),
      ne("span", { class: "al-row-t" }, ne("b", {}, oe), ne("small", {}, ie)),
      ne("span", { class: "al-row-go", html: Vt.right })
    ), X = ne(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(Vt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, V();
      }),
      i ? ne("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return ne(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      ne("div", { class: "al-sheet-h" }, ne("b", {}, "More"), An({ class: "al-icon", "aria-label": "Close", onClick: () => f(""), html: Vt.close })),
      m.mode === "open" ? N : null,
      ne(
        "div",
        { class: "al-rows" },
        M(Vt.grid, "My music", "Your albums and the radio", () => f("music")),
        M(Vt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          f(""), t.openPlayer();
        }),
        m.canMake ? M(Vt.gift, "Albums (admin)", "Make an album and fund copies", () => f("gifts")) : null,
        M(Vt.device, "This device", "Backup, history, Stacks wallet, returns", () => f("device")),
        X
      )
    );
  }
  function Q(m) {
    var ie, Fe;
    const I = m.player, N = w == null ? void 0 : w.nowPlaying, M = N && I.tracks.some(($) => String($.id) === String(N.tokenId)) ? String(N.tokenId) : null, X = !!(w != null && w.playing) && !!M, F = M ? (Fe = (ie = t.radio()) == null ? void 0 : ie.getPosition) == null ? void 0 : Fe.call(ie) : null;
    M && (X || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (S = I.id);
    const oe = !!M && S === I.id;
    return T(m, {
      songs: I.tracks.filter(($) => !$.hidden),
      current: M,
      started: oe,
      own: oe ? String((N == null ? void 0 : N.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function V() {
    const m = o;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      x(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...Q(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    x(), e.hidden = !1;
    const I = ne(
      "header",
      { class: "al-top" },
      ne("a", { class: "al-brand", href: "/radio" }, vl("al-logo"), "Xtrata ", ne("b", {}, "Music")),
      m.mode === "open" ? An({ class: "al-icon", "aria-label": "My music", onClick: () => f("music"), html: Vt.grid }) : null
    ), N = ne("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? _(m) : v(m));
    e.replaceChildren(I, N, ...s === "more" ? [ne("div", { class: "al-scrim", onClick: () => f("") }), se(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        o = m, V();
        return;
      }
      const I = !!o;
      o = m, !m && (I || s) && (s = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, V();
    },
    sheet: () => s,
    setSheet: f
  };
}
const pL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", gL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${pL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, yL = (e) => gL("source|audio", e), wL = 48 * 1024 * 1024;
function mL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let o = 0; o < n.length; o++) r[o] = n.charCodeAt(o);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function bL(e) {
  const t = e.fetch ?? ((...g) => fetch(...g));
  let n = null, r = null, o = "", s = null;
  const i = (g) => {
    n = g, e.changed();
  }, a = () => {
    var g;
    if (s == null || s.abort(), s = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (g = r.load) == null || g.call(r);
      } catch {
      }
    o.startsWith("blob:") && URL.revokeObjectURL(o), o = "";
  };
  async function c(g, h, w = 0) {
    var v, T, _;
    const y = "/inscription/" + g, x = await t(y, { signal: h }), S = (x.headers.get("content-type") || "").toLowerCase();
    if (!x.ok)
      throw await ((v = x.body) == null ? void 0 : v.cancel()), new Error("not found");
    if (S.startsWith("audio/"))
      return await ((T = x.body) == null ? void 0 : T.cancel()), y;
    if (!S.includes("text/html"))
      throw await ((_ = x.body) == null ? void 0 : _.cancel()), new Error("not a song");
    const C = await x.text();
    if (C.length > wL) throw new Error("too large");
    const B = C.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (B) return mL(B[1].replace(/&amp;/g, "&"));
    const P = w === 0 ? yL(C) : null;
    if (P) return c(Number(P), h, 1);
    throw new Error("no audio");
  }
  async function f(g) {
    var w;
    a();
    const h = s = new AbortController();
    i({ id: g, state: "loading" });
    try {
      const y = await c(g, h.signal);
      if (h.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (o = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const x = n.id;
          a(), i({ id: x, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), h.signal.aborted) return;
      i({ id: g, state: "playing" });
    } catch {
      if (h.signal.aborted) return;
      a(), i({ id: g, state: "error" });
    }
  }
  return {
    state: (g) => (n == null ? void 0 : n.id) === g ? n.state : "idle",
    toggle: (g) => {
      (n == null ? void 0 : n.id) === g && n.state !== "error" ? (a(), i(null)) : f(g);
    },
    stop: () => {
      n && (a(), i(null));
    }
  };
}
const xL = ["Earned", "Claim", "Yours"], SL = ["Connect", "Link", "Name"], $t = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, pn = (e, t, n, r = !1) => {
  const o = $t("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Pg = (e, t, n, r = !1) => {
  const o = pn("al-album", "", n, r), s = $t("span", "al-album__t");
  return s.append($t("b", "", e), $t("span", "", t)), o.append(s), o;
}, vL = (e) => `No. ${String(e).padStart(4, "0")}`, EL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function AL(e) {
  const t = document.documentElement;
  let n = !1, r = "", o = null;
  const s = (i) => {
    if (o && r === i.art) return o;
    r = i.art, o = $t("div", "aw-art");
    const a = document.createElement("iframe");
    return a.src = i.art, a.title = `${i.tier.name} record. Drag to turn it.`, a.setAttribute("sandbox", "allow-scripts"), o.append(a), o;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, a = !1) {
      if (!i) {
        n && !a && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", o = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const c = $t("header", "al-top"), f = $t("a", "al-brand");
      f.href = "/radio", f.append(vl("al-logo"), $t("span", "", "Xtrata "), $t("b", "", "Music")), c.append(f);
      const g = $t("div", "al-welcome"), h = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (g.append(h === "have" ? El(SL, EL(i)) : El(xL, h === "making" ? 2 : h === "yours" ? 3 : 1)), h === "making") {
        const P = $t("div", "tier-disc tier-disc--mid");
        P.dataset.tier = i.tier.id, P.append($t("span", "tier-disc__mark", i.tier.mark)), g.append(P);
      } else if (h !== "have" && h !== "get") {
        const P = s(i);
        P.classList.toggle("aw-art--small", h === "name"), g.append(P);
      }
      const x = h === "ready" ? `Your ${w} record is ready` : h === "name" ? "Put your name on it?" : h === "have" ? "Use the name in your wallet" : h === "get" ? "Get a .btc name" : h === "making" ? "Making your record" : "It’s yours";
      g.append($t("h1", "", x));
      const S = (P, v = "") => g.append($t("p", v, P)), C = [];
      if (h === "ready")
        S(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), C.push(pn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), $t("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), pn("al-link", "Later", i.later));
      else if (h === "name")
        y ? (S(`Your record will carry ${y} beside your player’s address.`), C.push(pn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), pn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (S("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), C.push(
          Pg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Pg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          pn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (S("Could not check for a .btc name just now.", "ppp-warn"), C.push(pn("al-primary", "Check again", i.refresh, i.busy), pn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), C.push($t("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), C.push(pn("al-link", "Later", i.later));
      else if (h === "have")
        i.main ? !i.linked && i.canLink ? (S(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), C.push(pn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (S(`Found it: ${y}. It goes on your plaque beside your player’s address.`), C.push(pn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (S(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), C.push(pn("al-primary", "Check again", i.refresh, i.busy))) : (S(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), C.push(pn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (S("Connect the Leather or Xverse wallet that holds your .btc name."), C.push(pn("al-primary", "Connect my wallet", i.connect, i.busy))), C.push(pn("al-link", "Back", () => i.go("name")));
      else if (h === "get") {
        const P = $t("ol", "aw-steps"), v = $t("li");
        v.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = $t("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", v.append(T);
        const _ = $t("li");
        _.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", $t("span", "ppp-addr-full", i.player), i.copyAddress());
        const K = $t("li", "", "Check again, and your name shows on the preview before you claim.");
        P.append(v, _, K), g.append(P), C.push(pn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), pn("al-link", "Back", () => i.go("name")));
      } else if (h === "making") {
        if (S("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const P = $t("p", "al-hint"), v = $t("a", "", "See the claim on-chain ↗");
          v.href = i.claimLink, v.target = "_blank", v.rel = "noopener", P.append(v), g.append(P);
        }
      } else if (S(`${w} record ${vL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), C.push(pn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const P = $t("a", "al-link", "Open it full screen ↗");
        P.href = `/i/${i.inscription}`, P.target = "_blank", P.rel = "noopener", C.push(P);
      }
      if (i.status.length) {
        const P = $t("div", "al-status");
        P.setAttribute("role", "status"), P.append(...i.status), g.append(P);
      }
      i.asking ? g.append($t("p", "al-hint al-hint--ask", "Continue in the box below.")) : g.append(...C);
      const B = $t("div", "al-body al-body--welcome");
      B.append(g), e.hidden = !1, e.replaceChildren(c, B);
    }
  };
}
const Ib = "xtrata.xyz/music/release", kL = "Release music on Xtrata Music; no spending permission", $L = (e) => ({
  domain: ur({ name: gt(Ib), version: gt("1"), "chain-id": wn(1) }),
  message: ur({ purpose: gt(kL), artist: gt(e.artist), release: gt(e.hash), issued: wn(e.issued) })
}), IL = "Set the price of my release on Xtrata Music; no spending permission", LL = 100000n, CL = 1000000000n, TL = (e) => e === 0n || e >= LL && e <= CL, BL = (e) => ({
  domain: ur({ name: gt(Ib), version: gt("1"), "chain-id": wn(1) }),
  message: ur({ purpose: gt(IL), artist: gt(e.artist), release: gt(e.release), price: wn(BigInt(e.price)), issued: wn(e.issued) })
}), Si = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, NL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, ge = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, xn = (e, t, n = "") => {
  const r = ge("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Nc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Ug = (e) => {
  const t = Pr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Mc(e, t, n = "", r = "") {
  const o = ge("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), s = e || n;
  if (s) {
    const i = document.createElement("img");
    i.src = s, i.alt = "", i.decoding = "async", o.append(i);
  }
  return e || o.append(ge("span", t)), o;
}
const Ru = (e) => !!e && Zd(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function ML(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, o = "", s = "";
  const i = (() => {
    try {
      const j = new URLSearchParams(location.search).get("release");
      return Zd(j) ? j : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (j) => "xtrata.radio.releases.shelf.v1:" + j;
  let f = null, g = !1, h = -1 / 0;
  const w = (j, O, ee) => {
    const J = Array.isArray(O) ? O.filter(Ru).map((ae) => ({ ...ae, hidden: !!ae.hidden })) : [];
    f = { for: j, albums: J, fresh: ee }, ee && e.store.set(c(j), JSON.stringify(J));
  }, y = (j) => {
    try {
      w(j, JSON.parse(e.store.get(c(j)) || "[]"), !1);
    } catch {
      w(j, [], !1);
    }
  }, x = () => {
    const j = e.player().address;
    return j && (f == null ? void 0 : f.for) === j ? f.albums : [];
  };
  async function S(j, O = "") {
    const ee = e.player();
    if (!ee.address || !ee.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (g) return !1;
    g = !0, s = "", e.changed();
    try {
      const J = await e.signShelf(j, O), ae = await e.json("/radio/release/shelf", Nc(J));
      return w(ee.address, ae == null ? void 0 : ae.albums, !0), B(ae == null ? void 0 : ae.pay) ? v(ee.address, ae.pay) : j === "add" && v(ee.address, null, O), !0;
    } catch (J) {
      return j !== "list" && (s = J.message || "That did not work. Try again."), !1;
    } finally {
      g = !1, e.changed();
    }
  }
  const C = (j) => "xtrata.radio.releases.orders.v1:" + j, B = (j) => !!j && /^[0-9a-f]{16}$/.test(j.order) && Zd(j.release) && typeof j.to == "string" && /^\d{1,12}$/.test(j.amount) && typeof j.memo == "string", P = (j) => {
    if (!j) return {};
    try {
      const O = JSON.parse(e.store.get(C(j)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, ee]) => B(ee))) : {};
    } catch {
      return {};
    }
  };
  function v(j, O, ee = (O == null ? void 0 : O.release) ?? "") {
    var ae;
    const J = P(j);
    O ? J[O.release] = { ...((ae = J[O.release]) == null ? void 0 : ae.order) === O.order ? J[O.release] : {}, ...O } : delete J[ee], e.store.set(C(j), Object.keys(J).length ? JSON.stringify(J) : null);
  }
  const T = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Map();
  async function K(j, O, ee = !1) {
    var J;
    if (!T.has(O.order)) {
      T.add(O.order), _.set(O.order, e.now()), ee && (s = "", e.changed());
      try {
        const ae = await e.json("/radio/release/paid", Nc({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (ae == null ? void 0 : ae.status) === "paid" ? (v(j, null, O.release), ((J = a == null ? void 0 : a.view) == null ? void 0 : J.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), s = "", T.delete(O.order), (f == null ? void 0 : f.for) === j && (f.fresh = !1), e.player().unlocked && await S("list")) : (B(ae) && v(j, { ...O, ...ae }), ee && (ae == null ? void 0 : ae.status) === "pending" && (s = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (ae) {
        /did not go through|does not pay this order/.test(ae.message || "") && v(j, { ...O, txid: void 0, status: "pending" }), (ee || O.txid) && (s = ae.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(O.order), e.changed();
      }
    }
  }
  async function se(j, O, ee) {
    if (!o) {
      o = "Approve the payment in your wallet…", s = "", e.changed();
      try {
        const J = await e.pay(j, ee.to, BigInt(ee.amount), ee.memo), ae = { ...ee, txid: J || void 0, status: "confirming" };
        v(O, ae), o = "", K(O, ae);
      } catch (J) {
        s = /cancel/i.test(J.message || "") ? "Payment cancelled. Nothing was sent." : J.message || "Not paid. Nothing was sent.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  async function Q(j) {
    const O = e.player();
    if (!await S("add", j.id) || !O.address) return;
    const ee = P(O.address)[j.id], J = e.main();
    ee && J && await se(J, O.address, ee);
  }
  function V() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const O = a;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (ee) => {
          Ru(ee) ? (O.view = ee, delete O.error) : O.error = "This release could not be read.";
        },
        (ee) => {
          O.error = ee.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const j = e.player();
    if (j.address) {
      (f == null ? void 0 : f.for) !== j.address && y(j.address), j.unlocked && !(f != null && f.fresh) && !g && e.now() - h > 6e4 && (h = e.now(), S("list"));
      for (const O of Object.values(P(j.address)))
        if ((O.txid || O.status === "confirming") && !T.has(O.order) && e.now() - (_.get(O.order) ?? -1 / 0) > 2e4) {
          const ee = j.address;
          K(ee, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? x().filter((j) => !j.hidden) : [];
  function I(j, O) {
    const ee = ge("ol", "", "ppp-rel-songs");
    return j.forEach((J, ae) => {
      const ft = ge("li");
      ft.append(Mc(e.art.song(J.id, !0) || "", String(ae + 1), O), ge("span", J.title)), ee.append(ft);
    }), ee;
  }
  function N() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [ge("p", `♫ ${a.error}`, "ppp-warn")] : [ge("p", "♫ Opening this release…", "ppp-mute")];
    const j = a.view, O = ge("div", "", "ppp-release-in"), ee = ge("p", "", "ppp-release-in__h"), J = BigInt(/^\d{1,12}$/.test(j.price ?? "") ? j.price : "0");
    ee.append(ge("b", j.title), ge("span", `${j.subtitle || e.who(j.artist)} · ${Ug(j)}${J > 0n ? ` · ${Si(J)} STX` : ""}`));
    const ae = Pr(j), ft = e.art.cover(j.cover) || (j.cover ? "" : ae[0] && e.art.song(ae[0].id, !0) || ""), Me = ge("div", "", "ppp-rel-top");
    Me.append(Mc(ft, "💿", "", "is-cover"), ee), O.append(Me, I(ae.map((Ee) => ({ id: Ee.id, title: Ee.title || `#${Ee.id}` })), e.art.cover(j.cover))), O.append(ge("p", `Released by ${e.who(j.artist)}. ${j.added === 1 ? "1 player has" : `${j.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Pe = e.player(), bt = x().find((Ee) => Ee.id === j.id), De = ge("div", "", "ppp-award__row");
    if (bt)
      O.append(ge("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), De.append(xn("Play it", () => e.open(j), "primary"));
    else if (!Pe.address) O.append(ge("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Pe.unlocked) O.append(ge("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (J > 0n) {
      const Ee = P(Pe.address)[j.id], je = e.main(), ze = `${Si((Ee == null ? void 0 : Ee.amount) ?? J)} STX`;
      if (Ee != null && Ee.txid || (Ee == null ? void 0 : Ee.status) === "confirming") {
        O.append(ge("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Xe = xn("Check now", () => void K(Pe.address, Ee, !0));
        Xe.disabled = T.has(Ee.order), De.append(Xe);
      } else if (O.append(ge("p", `This album costs ${ze}. You pay ${e.who(j.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ee) O.append(ge("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ee) {
        if (je) {
          const Cn = xn(`Pay ${ze} from my wallet`, () => void se(je, Pe.address, Ee), "primary");
          Cn.disabled = !!o, De.append(Cn);
        } else O.append(ge("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Xe = ge("div", "", "ppp-rel-pay"), Lt = (Cn, fn, Ct) => {
          const Tn = ge("p");
          return Tn.append(ge("span", Cn), ge("code", fn), or(`order-${Ct}:${Ee.order}`, "Copy", () => fn, "tiny", e.changed)), Tn;
        };
        Xe.append(Lt("Send", Si(Ee.amount) + " STX", "amount"), Lt("To", Ee.to, "to"), Lt("Memo", Ee.memo, "memo")), O.append(Xe, ge("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const on = xn("I have paid: check", () => void K(Pe.address, Ee, !0));
        on.disabled = T.has(Ee.order), De.append(on);
      } else {
        const Xe = xn(`Buy · ${ze}`, () => void Q(j), "primary");
        Xe.disabled = g || !!o, De.append(Xe);
      }
    } else {
      O.append(ge("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ee = xn("Add to my player", () => {
        S("add", j.id).then((je) => {
          je && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      Ee.disabled = g, De.append(Ee);
    }
    return De.append(xn("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(De), o && O.append(ge("p", o, "ppp-cyan")), s && O.append(ge("p", s, "ppp-warn")), [O];
  }
  let M = !1;
  function X() {
    const j = t ? x() : [];
    if (!j.length) return null;
    const O = ge("details", "", "ppp-release-manage");
    O.open = M, O.ontoggle = () => {
      M = O.open;
    };
    const ee = j.filter((ae) => ae.hidden).length;
    O.append(ge("summary", `Albums I added (${j.length}${ee ? `, ${ee} hidden` : ""})`));
    const J = e.player().unlocked;
    J || O.append(ge("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const ae of j) {
      const ft = ge("div", "", "ppp-release-row" + (ae.hidden ? " is-hidden" : "")), Me = ge("span", "", "ppp-release-row__t");
      Me.append(ge("b", ae.title), ge("span", `${ae.subtitle || e.who(ae.artist)}${ae.hidden ? " · hidden" : ""}`));
      const Pe = xn(ae.hidden ? "Show" : "Hide", () => void S(ae.hidden ? "show" : "hide", ae.id), "tiny"), bt = xn("Remove", () => void S("remove", ae.id), "tiny");
      Pe.disabled = bt.disabled = !J || g, ft.append(Me, Pe, bt), O.append(ft);
    }
    return O.append(ge("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !a && O.append(ge("p", s, "ppp-warn")), O;
  }
  let F = null, oe = [], ie = null;
  const Fe = ge("input");
  Fe.maxLength = 60, Fe.placeholder = "Title of the single, EP or album", Fe.setAttribute("aria-label", "Release title");
  const $ = ge("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const D = ge("input");
  D.inputMode = "numeric", D.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", D.setAttribute("aria-label", "Cover inscription number");
  const ce = ge("input");
  ce.inputMode = "decimal", ce.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ce.setAttribute("aria-label", "Price in STX");
  let ye = null;
  const Be = (j, O, ee = "") => {
    ye = (ye == null ? void 0 : ye.id) === j && ye.what === O ? null : { id: j, what: O }, (ye == null ? void 0 : ye.what) === "price" && (ce.value = ee), s = "", e.changed();
  };
  async function Ne(j, O) {
    if (o) return;
    const ee = NL(ce.value);
    if (ee === null || !TL(ee)) {
      s = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    o = "Sign in your wallet (nothing is spent)…", s = "", e.changed();
    try {
      const J = { artist: j, release: O.id, price: ee.toString(), issued: e.now() }, ae = await e.sign(j, BL(J));
      o = "Saving the price…", e.changed(), await e.json("/radio/release/price", Nc({ request: J, signature: ae })), s = ee > 0n ? `Price set ✓ “${O.title}” now costs ${Si(ee)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, ye = null, Se(j, !0);
    } catch (J) {
      s = J.message || "The price was not changed.";
    } finally {
      o = "", e.changed();
    }
  }
  const Pt = (j) => `${location.origin}${location.pathname}?release=${j}`;
  function He(j) {
    F = { for: j, loading: !0 }, oe = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(j)).then(
      (O) => {
        const ee = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((J) => Number.isSafeInteger(J == null ? void 0 : J.id) && typeof J.title == "string") : null;
        F = ee ? { for: j, songs: ee, more: !!O.more } : { for: j, error: "Your songs could not be read right now." };
      },
      (O) => {
        F = { for: j, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Se(j, O = !1) {
    !O && (ie == null ? void 0 : ie.for) === j && e.now() - ie.at < 6e4 || (ie = { for: j, list: (ie == null ? void 0 : ie.for) === j ? ie.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(j)).then((ee) => {
      Array.isArray(ee == null ? void 0 : ee.releases) && (ie = { for: j, list: ee.releases.filter(Ru), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Ce(j) {
    if (!o) {
      o = "Checking your release…", s = "", e.changed();
      try {
        const O = D.value.trim().replace(/^#/, ""), ee = Eb({ title: Fe.value.trim(), subtitle: $.value.trim(), tracks: [...oe], cover: O ? Number(O) : null });
        o = "Sign in your wallet (nothing is spent)…", e.changed();
        const J = { artist: j, hash: Ab(ee), issued: e.now() }, ae = await e.sign(j, $L(J));
        o = "Releasing…", e.changed();
        const ft = await e.json("/radio/release/create", Nc({ definition: ee, request: J, signature: ae }));
        s = `${ft.existing ? "Already released" : "Released"} ✓ “${ft.title}”. Its link is below.`, oe = [], Fe.value = "", D.value = "", e.audition.stop(), Se(j, !0);
      } catch (O) {
        s = O.message || "Not released.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  const dn = () => {
    queueMicrotask(() => e.audition.stop());
  }, Wt = /* @__PURE__ */ new Set();
  function ot(j) {
    const O = oe.map((Xe) => j.find((Lt) => Lt.id === Xe)).filter((Xe) => !!Xe), ee = D.value.trim().replace(/^#/, ""), J = /^\d{1,9}$/.test(ee) ? Number(ee) : null, ae = e.art.cover(J), ft = O[0] ? e.art.song(O[0].id, !0) : null, Me = ge("div", "", "ppp-release-preview");
    Me.append(ge("p", "How it will look", "ppp-featured__h"));
    const Pe = ge("p", "", "ppp-release-in__h"), bt = ge("b", Fe.value.trim() || "Untitled"), De = ge("span", `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    Pe.append(bt, De);
    const Ee = ge("div", "", "ppp-rel-top");
    Ee.append(Mc(J ? ae : ft || "", "💿", "", "is-cover"), Pe), Me.append(Ee, I(O.map((Xe) => ({ id: Xe.id, title: Xe.title })), ae));
    const je = O.filter((Xe) => e.art.song(Xe.id, !0) === null).length, ze = [];
    J && !ae && ze.push(`Looking for an image in #${J}… If none appears, that inscription is not a picture.`), je && ze.push(`Finding artwork for ${je} ${je === 1 ? "song" : "songs"}…`), !je && O.some((Xe) => e.art.song(Xe.id, !1) === "") && ze.push(`A numbered square is a song with no artwork of its own${ae ? ": it shows the cover, dimmed" : ""}.`);
    for (const Xe of ze) Me.append(ge("p", Xe, "ppp-mute"));
    return Fe.oninput = () => {
      bt.textContent = Fe.value.trim() || "Untitled";
    }, $.oninput = () => {
      De.textContent = `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, D.onchange = () => e.changed(), Me;
  }
  function sn() {
    var ee;
    const j = e.main();
    if (!t || !j)
      return F && (F = null, oe = [], dn()), null;
    const O = [ge("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (F && F.for !== j && (F = null, oe = [], Wt.clear(), dn()), !F) O.push(xn("Show the songs in my wallet", () => He(j), "primary"));
    else if (F.loading) O.push(ge("p", "Reading your wallet…", "ppp-cyan"));
    else if (F.error) O.push(ge("p", F.error, "ppp-warn"), xn("Try again", () => He(j)));
    else if (!F.songs.length) O.push(ge("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(ge("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const J = ge("div", "", "ppp-release-songs");
      for (const Me of F.songs) {
        const Pe = oe.indexOf(Me.id), bt = ge("div", "", "ppp-release-song" + (Pe >= 0 ? " is-on" : "")), De = e.audition.state(Me.id);
        De !== "idle" && Wt.add(Me.id);
        const Ee = xn(De === "playing" ? "❚❚" : De === "loading" ? "…" : "▶", () => e.audition.toggle(Me.id), "ppp-release-hear" + (De === "playing" ? " is-on" : ""));
        Ee.setAttribute("aria-label", De === "playing" ? `Stop ${Me.title}` : `Listen to ${Me.title}`), Ee.title = De === "error" ? "This song could not be played just now" : De === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const je = e.art.song(Me.id, Pe >= 0 || Wt.has(Me.id)), ze = xn("", () => {
          oe = Pe >= 0 ? oe.filter((Xe) => Xe !== Me.id) : [...oe, Me.id], e.changed();
        }, "ppp-release-pick");
        ze.setAttribute("aria-pressed", String(Pe >= 0)), ze.append(ge("i", Pe >= 0 ? String(Pe + 1) : "+"), ge("b", Me.title), ge("span", De === "error" ? "could not play" : `${Me.artist ? Me.artist + " · " : ""}#${Me.id}`, De === "error" ? "ppp-warn" : "")), bt.append(Ee, Mc(je || "", je === "" ? "♪" : "", ""), ze), J.append(bt);
      }
      O.push(J), F.more && O.push(ge("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && oe.length && ($.value = ((ee = F.songs.find((Me) => Me.id === oe[0])) == null ? void 0 : ee.artist) || "");
      const ae = oe.length === 0 ? "release" : oe.length === 1 ? "single" : oe.length <= 6 ? "EP" : "album", ft = xn(oe.length ? `Sign and release this ${ae} · ${oe.length} ${oe.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Ce(j), "primary");
      ft.disabled = !oe.length || !!o, O.push(Fe, $, D), oe.length && O.push(ot(F.songs)), O.push(ft);
    }
    if (o && O.push(ge("p", o, "ppp-cyan")), s && !a && O.push(ge("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), Se(j), (ie == null ? void 0 : ie.for) === j && ie.list.length) {
      O.push(ge("p", "Your releases", "ppp-featured__h"));
      for (const J of ie.list) {
        const ae = ge("div", "", "ppp-release-row"), ft = ge("span", "", "ppp-release-row__t"), Me = BigInt(/^\d{1,12}$/.test(J.price ?? "") ? J.price : "0"), Pe = Me > 0n ? ` · ${Si(Me)} STX · ${(J.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (ft.append(ge("b", J.title), ge("span", `${Ug(J)} · added by ${J.added.toLocaleString()} ${J.added === 1 ? "player" : "players"}${Pe}`)), ae.append(ft, or("release-link:" + J.id, "Copy link", () => Pt(J.id), "tiny", e.changed)), n.sales) {
          const De = xn("Price", () => Be(J.id, "price", Me > 0n ? Si(Me) : ""), "tiny");
          De.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === J.id && ye.what === "price")), ae.append(De);
        }
        if (n.copies && e.copies) {
          const De = xn("Send copies", () => Be(J.id, "copies"), "tiny");
          De.setAttribute("aria-expanded", String((ye == null ? void 0 : ye.id) === J.id && ye.what === "copies")), ae.append(De);
        }
        if (O.push(ae), (ye == null ? void 0 : ye.id) !== J.id) continue;
        const bt = ge("div", "", "ppp-release-way");
        if (ye.what === "price" && n.sales) {
          const De = xn("Sign this price", () => void Ne(j, J), "primary");
          De.disabled = !!o, bt.append(
            ge("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ce,
            De
          );
        } else ye.what === "copies" && n.copies && e.copies && bt.append(...e.copies(j, { id: J.id, title: J.title }));
        bt.childNodes.length && O.push(bt);
      }
    }
    return O;
  }
  return { sync: V, albums: m, banner: N, manage: X, fold: sn, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(F != null && F.songs) && !!e.main()), enabled: () => t === !0 };
}
const zu = "xtrata.radio.replace.v1", Sn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Qs = (e, t, n = "") => {
  const r = Sn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Og = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function _L(e) {
  let n = (() => {
    try {
      const x = JSON.parse(e.store.get(zu) || "null");
      return x && typeof x.old == "string" ? x : null;
    } catch {
      return null;
    }
  })();
  const r = (x) => {
    n = x, e.store.set(zu, x ? JSON.stringify(x) : null), e.changed();
  };
  let o = null, s = !1, i = "", a = !1;
  function c(x) {
    s || (o == null ? void 0 : o.for) === x && (o.n !== null || Date.now() - o.at < 3e4) || (s = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(x) + "&limit=1").then(
      (S) => {
        o = { for: x, n: Number.isSafeInteger(S == null ? void 0 : S.total) ? S.total : null, at: Date.now() };
      },
      () => {
        o = { for: x, n: null, at: Date.now() };
      }
    ).finally(() => {
      s = !1, e.changed();
    }));
  }
  const f = () => !!n, g = () => !!(n != null && n.removed);
  function h(x) {
    x.listening && (i = "", r({ old: x.listening }));
  }
  const w = () => {
    i = "", r(null);
  };
  function y(x) {
    var _;
    if (!n) return null;
    n.removed && x.listening === n.old && (n = { old: n.old }, e.store.set(zu, JSON.stringify(n)));
    const S = [], C = (K, se) => S.push(Sn("p", `Replacing your old player · step ${K} of 3 · ${se}`, "ppp-cyan")), B = () => Qs("Stop · keep my old player", w, "quiet");
    if (x.listening && x.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      S.push(Sn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), x.phrase && !x.backedUp ? S.push(Sn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), Qs("Back up my player · 24 words", e.backup, "primary")) : x.backedUp && S.push(Sn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const K = x.passkeyName ? `the one called “${x.passkeyName}”` : "the newest one";
      return S.push(Sn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${K}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), S.push(Qs("Done", w, "quiet")), S;
    }
    if (!x.listening || n.removed)
      return n.removed ? (C(3, "claim your new player"), S.push(Sn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), S.push(Qs("Hide this", w, "quiet")), S) : null;
    if (c(n.old), x.step === "locked" || x.step === "intro")
      return C(1, "empty it"), S.push(Sn("p", "Unlock your old player so it can be emptied."), Qs("Unlock my old player", e.unlock, "primary"), B()), S;
    const P = e.keepBoth(x), v = (K) => (C(1, "empty it"), S.push(Sn("p", K, "ppp-warn")), P && S.push(Qs("Keep both players instead", () => {
      w(), P();
    }, "primary")), S.push(B()), S);
    if (x.slot !== 0) return v("An album is open. Go back to your own player first.");
    if ((o == null ? void 0 : o.for) !== n.old)
      return C(1, "empty it"), S.push(Sn("p", "Checking what this player has…", "ppp-mute"), B()), S;
    if (o.n === null) return v("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (o.n > 0) return v(`This player has ${o.n === 1 ? "an album" : `${o.n} albums`} of its own. Replacing it would leave ${o.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((_ = x.award) == null ? void 0 : _.state) === "claimed" && x.award.holds !== !1) return v("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (x.depositPending || x.entries.some((K) => ["prepared", "signed", "unknown", "pending"].includes(String(K.status))))
      return C(1, "empty it"), S.push(Sn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), B()), S;
    if (x.balance === void 0)
      return C(1, "empty it"), S.push(Sn("p", "Checking what it holds…", "ppp-mute"), B()), S;
    if (x.balance > e.dust(x))
      return C(1, "empty it"), S.push(Sn("p", `It holds ${Og(x.balance)} STX. Send it back${x.returnTo ? ` to ${e.who(x.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), x.returnTo || x.gift ? S.push(Qs("Send everything back", e.returnAll, "primary")) : S.push(Sn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), S.push(B()), S;
    C(2, "remove it from this device"), S.push(Sn("p", x.balance > 0n ? `Empty ✓ (the ${Og(x.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), S.push(Sn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = Qs(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (K) => {
        i = /cancel/i.test((K == null ? void 0 : K.message) || "") ? "" : (K == null ? void 0 : K.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!x.busy, S.push(T, B()), i && S.push(Sn("p", i, "ppp-warn")), S;
  }
  return { active: f, claiming: g, start: h, stop: w, lines: y };
}
const PL = [
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
function UL(e) {
  for (const [t, n] of PL) if (n.test(e)) return t;
  return null;
}
const Lb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Cb = (e) => /Android/.test(e);
function OL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Lb(t) ? "x-safari-" + n.href : Cb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const HL = (e) => Lb(e) ? "Safari" : Cb(e) ? "Chrome" : "your browser", vi = "Xtrata Music Wallet", DL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Hg(e, t = (n) => n) {
  var s, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((s = e.gate) == null ? void 0 : s.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: vi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], o = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of o) {
    const f = e.standIn === c && DL.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${vi} · ${t(c)}`,
      detail: f ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: vi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: vi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: vi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: vi, detail: "Open on this device." });
    }
  return r;
}
const Gu = "xtrata.radio.novice", Tb = "xtrata.radio.novice.previewed.v1", Dg = 6 * 6e4;
function FL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Gu, r), n = r;
    else {
      if (r === "0")
        return t.set(Gu, null), { on: !1, preview: !1 };
      n = t.get(Gu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const jL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Fg = (e) => jL.test(e ?? ""), RL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, zL = {
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
}, GL = (e, t) => zL[e] ?? t;
function KL(e, t) {
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
const VL = "Make your player once, with Face ID or your fingerprint, and the music starts.", XL = "Checking your player…", ef = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Bb(e) {
  try {
    const t = JSON.parse(e.get(Tb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function YL(e, t) {
  const n = Bb(e).filter((r) => r !== t);
  n.push(t), e.set(Tb, JSON.stringify(n.slice(-50)));
}
function Ku(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...ef(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : ef();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Dg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Dg ? { ...e, phase: "done" } : e;
  }
}
const _c = (e) => e.phase === "open" || e.phase === "playing";
function qL(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const WL = [100, 250, 500, 1e3], ZL = (e, t = Hr) => BigInt(e) * In(t);
function JL(e, t = Hr, n = 0n) {
  const r = ms - e - n;
  return r > 0n ? Number(r / In(t)) : 0;
}
function QL(e, t = Hr, n = 0n) {
  const r = e === void 0 ? 0 : JL(e, t, n);
  return WL.map((o) => ({ plays: o, stx: ZL(o, t), fits: e !== void 0 && o <= r }));
}
const eC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, tC = (e) => eC[e.unit](e.amount), zt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Kc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function nC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${Kc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${Kc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${Kc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function rC(e) {
  let t = null, n = 0, r = "stx";
  const o = (i) => {
    var c;
    if (i.some((f) => f.plays === n && f.fits)) return;
    const a = i.filter((f) => f.fits);
    n = ((c = a.find((f) => {
      var g;
      return f.plays === ((g = i[1]) == null ? void 0 : g.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function s() {
    var y;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const a = QL(i.balance, i.fee, i.incoming);
    o(a);
    const c = qL(i.switches);
    (y = c.find((x) => x.id === r)) != null && y.on || (r = "stx");
    const f = [], g = zt("h2", "ppp-connect__title", "Add plays");
    g.id = "ppp-restock-title", f.push(g), f.push(zt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${Kc(i.playsLeft, "play", "plays")} left.`));
    const h = nC(i.done);
    if (h && f.push(zt("p", "ppp-restock__done", h)), i.arriving)
      f.push(zt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      f.push(zt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((x) => x.fits))
      f.push(zt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const x = zt("div", "ppp-restock__packs");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How many plays");
      for (const B of a) {
        const P = zt("button", "ppp-restock__pack" + (B.plays === n ? " is-on" : ""));
        P.type = "button", P.disabled = !B.fits, P.setAttribute("aria-pressed", String(B.plays === n)), P.append(zt("b", "", B.plays.toLocaleString()), zt("span", "", "plays")), P.onclick = () => {
          n = B.plays, s();
        }, x.append(P);
      }
      f.push(x);
      const S = zt("div", "ppp-restock__ways");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How to pay");
      for (const B of c) {
        const P = zt("button", "ppp-restock__way" + (B.id === r ? " is-on" : ""));
        P.type = "button", P.disabled = !B.on, P.setAttribute("aria-pressed", String(B.id === r)), P.append(zt("b", "", B.label), zt("span", "", B.on ? B.blurb : "Soon")), P.onclick = () => {
          r = B.id, s();
        }, S.append(P);
      }
      f.push(S);
      const C = a.find((B) => B.plays === n);
      if (C && r === "stx") {
        const B = zt("div", "ppp-restock__pay"), P = tC({ unit: "microSTX", amount: C.stx }), v = zt("p", "ppp-restock__amount");
        v.append("Send ", zt("b", "", P), " to your player:"), B.append(v, zt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = zt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Tr(C.stx), "")), B.append(T), B.append(zt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), f.push(B);
      }
    }
    f.push(zt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = zt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), f.push(w), t.replaceChildren(...f);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = zt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (a) => {
        a.target === i && i.close();
      }), document.body.appendChild(i), s(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: s,
    close() {
      t == null || t.close();
    }
  };
}
const xs = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), sC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function oC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const o of Array.isArray(e) ? e : []) {
    const s = Number(o == null ? void 0 : o.id);
    if (!Number.isSafeInteger(s) || s < 0 || n.has(s)) continue;
    n.add(s);
    const i = t(s, { title: typeof o.title == "string" ? o.title : void 0, artist: typeof o.artist == "string" ? o.artist : void 0 });
    r.push({ id: s, title: sC(i.title) ? `#${s}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((o, s) => o.id - s.id);
}
function iC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = xs(n.artist), o = t.get(r);
    o ? o.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function aC(e, t, n = "", r = 60) {
  const o = xs(t).split(/\s+/).filter(Boolean), s = xs(n);
  if (!o.length && !s) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = xs(a.artist), f = xs(a.title), g = String(a.id);
    if (s && c !== s) continue;
    let h = 0, w = !0;
    for (const y of o) {
      const x = y.replace(/^#/, "");
      if (f.includes(y)) h += f.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(x) && g === x) h += 0;
      else if (c.includes(y)) h += 2;
      else if (/^\d+$/.test(x) && g.startsWith(x)) h += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: h });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const pr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, jg = 12;
function cC(e, t) {
  let n = null, r = "idle", o = "", s = "", i = !1;
  const a = pr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = pr("div", "hint"), f = pr("div", "find-artists"), g = pr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const h = pr("div", "likesTools");
  h.append(a), e.replaceChildren(h, c, f, g), a.oninput = () => {
    o = a.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((x) => {
      n = x, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const x = t.locked();
    if (a.disabled = x, x) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", f.replaceChildren(), g.replaceChildren();
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
      const T = pr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), f.replaceChildren(), g.replaceChildren();
      return;
    }
    const S = iC(n), C = i ? S : S.slice(0, jg), B = (T, _, K, se = "") => {
      const Q = pr("button", "find-chip" + (_ ? " is-on" : ""), T);
      return Q.type = "button", Q.setAttribute("aria-pressed", String(_)), se && (Q.title = se), Q.onclick = K, Q;
    };
    f.replaceChildren(
      ...C.map((T) => B(`${T.name} · ${T.songs}`, xs(T.name) === xs(s), () => {
        s = xs(T.name) === xs(s) ? "" : T.name, y();
      }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`)),
      ...S.length > jg ? [B(i ? "Fewer artists" : `All ${S.length} artists`, !1, () => {
        i = !i, y();
      })] : []
    );
    const P = aC(n, o, s), v = t.current();
    g.replaceChildren(...P.songs.map((T) => {
      var se, Q;
      const _ = pr("li", "lrow" + (T.id === v ? " now" : "")), K = pr("button", "lt", T.title);
      if (K.type = "button", K.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, K.onclick = () => t.play(T.id), (se = t.explicit) != null && se.call(t, T.id)) {
        const V = pr("span", "exp", "E");
        V.title = "Explicit lyrics: only plays when you choose it", K.append(" ", V);
      }
      if ((Q = t.liked) != null && Q.call(t, T.id)) {
        const V = pr("span", "find-liked", "♥");
        V.title = "You like this song", V.setAttribute("role", "img"), V.setAttribute("aria-label", "Liked"), _.append(K, V);
      } else _.append(K);
      return _.append(pr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), _;
    })), c.textContent = !o.trim() && !s ? `${n.length.toLocaleString()} songs by ${S.length.toLocaleString()} artists. Search, or pick an artist.` : P.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : P.total > P.songs.length ? `Showing ${P.songs.length} of ${P.total.toLocaleString()}. Type more to narrow it down.` : `${P.total} ${P.total === 1 ? "song" : "songs"}${s ? ` by ${s}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const Rg = (e, t, n) => yf(bf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), lC = 317, uC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, dC = 15 * 6e4, zg = document.getElementById("ppp");
zg && fC(zg);
function fC(e) {
  var $e;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = o1(), o = (l) => e.querySelector(l), s = o(".ppp-frame");
  let i = null;
  const a = async (l, u) => {
    const p = await fetch(l, { cache: "no-store", ...u, signal: AbortSignal.timeout(15e3) }), d = await p.json().catch(() => ({}));
    if (!p.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${p.status}).`);
    return d;
  }, c = O5({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var p;
      const u = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((p = u == null ? void 0 : u.find((d) => d.listening === l)) == null ? void 0 : p.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const u = new Promise((W, le) => {
        i.addEventListener("load", () => W(), { once: !0 }), setTimeout(() => le(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", s.replaceChildren(i), await u;
      const p = new Wb({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), L = (W, le) => d.has(W) ? p.request(W, le) : Promise.race([
        p.request(W, le),
        new Promise((he, xe) => setTimeout(() => xe(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await L("listening.status"), { request: L };
    },
    chain: {
      verify: y5,
      balance: m5,
      account: w5,
      owner: b5,
      broadcast: x5,
      transaction: S5,
      confirmedNonce: async (l) => {
        const u = await ao(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(u == null ? void 0 : u.nonce) || u.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(u.nonce);
      }
    },
    signWithMain: (l, u) => Nu({ ...u, network: "mainnet", stxAddress: l }),
    deposit: (l, u, p) => new Promise((d, L) => eg({
      recipient: u,
      amount: p.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new Vu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (W) => d(W.txId || ""),
      onCancel: () => L(new Error("Deposit cancelled. Nothing was sent.")),
      onError: L
    })),
    validate: v5,
    tabLock: (l) => new Promise((u) => {
      const p = navigator.locks;
      if (!(p != null && p.request)) {
        u(!0);
        return;
      }
      p.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (d) => {
        u(!!d), d && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, u) => {
        try {
          localStorage.setItem(l, u);
        } catch {
        }
      }
    },
    changed: () => ct(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var u, p;
      return x.funder(l, () => L5(l, ao), !!((p = (u = c.snapshot().gate) == null ? void 0 : u.gifts) != null && p.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const u = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), p = u == null ? void 0 : u.gift;
      if (!p) return null;
      if (typeof p.returnTo != "string" || typeof p.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: p.returnTo,
        from: typeof p.from == "string" ? p.from : null,
        source: String(p.source ?? ""),
        amount: String(p.amount ?? "0"),
        treasury: p.treasury,
        state: p.state === "sending" ? "sending" : "arrived",
        player: p.player ?? null,
        ...p.drop === "players" || p.drop === null ? { drop: p.drop } : {}
      };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (l) => {
      const u = await a("/radio/awards/status?address=" + encodeURIComponent(l));
      if (typeof (u == null ? void 0 : u.state) != "string") throw new Error("Unreadable award status.");
      return u;
    },
    awardName: async (l) => {
      const u = await a("/radio/awards/name?address=" + encodeURIComponent(l));
      if ((u == null ? void 0 : u.name) !== null && typeof (u == null ? void 0 : u.name) != "string") throw new Error("Unreadable name.");
      return u.name;
    },
    awardNote: async (l, u) => {
      const p = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: u }) });
      if (typeof (p == null ? void 0 : p.record) != "string" || typeof (p == null ? void 0 : p.signature) != "string" || !Number.isSafeInteger(p == null ? void 0 : p.cls) || !Number.isSafeInteger(p == null ? void 0 : p.number) || !Number.isSafeInteger(p == null ? void 0 : p.plays)) throw new Error("Unreadable award note.");
      return { cls: p.cls, number: p.number, plays: p.plays, record: p.record, signature: p.signature, name: typeof p.name == "string" ? p.name : null };
    },
    history: (l, u) => B5(l, (p) => ao(p), u),
    likesChanged: () => {
      var l, u;
      (u = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || u.call(l);
    },
    likeState: async (l, u) => {
      const p = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(u) })), d = Array.isArray(p == null ? void 0 : p.rows) ? p.rows.find((L) => (L == null ? void 0 : L.id) === u) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((L) => typeof L == "string") : d.liked ? [l] : [] };
    },
    likeSent: (l, u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: u } })),
    nameOf: (l) => Ft(l) ?? void 0,
    likeConfirmed: (l, u) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: u } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), f = (l, u, p, d, L, W) => new Promise((le, he) => eg({
    recipient: d,
    amount: L.toString(),
    memo: W,
    stxAddress: p,
    network: new Vu(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (xe) => le(xe.txId || ""),
    onCancel: () => he(new Error(u)),
    onError: he
  })), g = (l) => x.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, h = (l) => g(l) && l.canForget ? () => {
    w.start(l), ct(c.snapshot());
  } : null, w = _L({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => g(l),
    who: (l) => Qe(l),
    changed: () => ct(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, u) => {
        try {
          u === null ? localStorage.removeItem(l) : localStorage.setItem(l, u);
        } catch {
        }
      }
    },
    dust: (l) => {
      var u;
      return BigInt(((u = l.gate) == null ? void 0 : u.limits.returnFee) ?? "3000");
    }
  }), y = () => ({ quick: !!x.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), x = GI({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, u, p, d) => f("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, u, p, d),
    sign: (l, u) => Nu({ ...u, network: "mainnet", stxAddress: l }),
    giftSent: (l, u) => c.giftSent(l, u),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, u;
      return (u = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : u.batchDays;
    },
    claimNew: (l) => g(l),
    replaceOld: (l) => h(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, u, p, d) => {
      S.invalidate(), await c.albumArriving(l, u, p, d);
    } },
    who: (l) => Qe(l),
    changed: () => ct(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, u) => {
        try {
          u === null ? localStorage.removeItem(l) : localStorage.setItem(l, u);
        } catch {
        }
      }
    },
    now: Date.now
  }), S = eL({
    json: a,
    open: (l) => {
      c.openAlbum(l);
    },
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, u) => {
        try {
          u === null ? localStorage.removeItem(l) : localStorage.setItem(l, u);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => ct(c.snapshot())
  }), C = {
    get: (l) => {
      try {
        return localStorage.getItem(l);
      } catch {
        return null;
      }
    },
    set: (l, u) => {
      try {
        u === null ? localStorage.removeItem(l) : localStorage.setItem(l, u);
      } catch {
      }
    }
  }, B = FL(location.search, C);
  B.on && (document.documentElement.dataset.novice = B.preview ? "preview" : "1");
  const P = (l) => B.on && l.solo, v = B.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), T = v ? document.getElementById("album") : null, _ = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, K = T ? _g(T, _) : null, se = ML({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, u) => Nu({ ...u, network: "mainnet", stxAddress: l }),
    signShelf: (l, u) => c.signShelf(l, u),
    pay: (l, u, p, d) => f("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, u, p, d),
    copies: (l, u) => {
      var p;
      return x.copies(l, u, ((p = c.snapshot().gate) == null ? void 0 : p.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), u = l.slot === 0 ? l.listening : l.root;
      return { address: u, unlocked: !!u && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => Wn(l, !0),
    who: (l) => Qe(l),
    art: { song: (l, u) => u && xh(String(l)) || Tg(String(l)), cover: (l) => Gc(l) },
    audition: bL({
      changed: () => ct(c.snapshot()),
      quiet: () => {
        var u;
        const l = window.XtrataRadio;
        try {
          (u = l == null ? void 0 : l.getState) != null && u.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => ct(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, u) => {
        try {
          u === null ? localStorage.removeItem(l) : localStorage.setItem(l, u);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), Q = () => {
    const l = new Set(Lt.map((u) => u.id));
    return [...Lt, ...se.albums().filter((u) => !l.has(u.id))];
  }, V = T ? AL(T) : null, m = "xtrata.radio.award.later.v1";
  let I = "ready", N = !1, M = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(m) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), X = !1;
  const F = "xtrata.radio.tier.v1";
  let oe = (() => {
    const l = C.get(F);
    return Tc(l) ? Co(l) : null;
  })();
  const ie = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Fe(l) {
    var L;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let W = null;
      try {
        W = l.gift && !l.gift.player && l.gift.drop === "players" ? UI(BigInt(l.gift.amount)) : null;
      } catch {
        W = null;
      }
      ((L = l.award) == null ? void 0 : L.state) === "claimed" && l.award.holds === !1 && (W = null), ((W == null ? void 0 : W.id) ?? null) !== ((oe == null ? void 0 : oe.id) ?? null) && (oe = W, C.set(F, W ? W.id : null));
    }
    const u = document.documentElement;
    oe ? u.dataset.tier = oe.id : delete u.dataset.tier;
    const p = document.querySelector("#ppp .ppp-head h3");
    if (!p) return;
    let d = p.querySelector(".ppp-tier");
    if (!oe) {
      d == null || d.remove();
      return;
    }
    d || (d = k("span", "", "ppp-tier"), p.append(d)), d.dataset.tier = oe.id, d.textContent = `${oe.mark} ${oe.name.toUpperCase()} PLAYER`, d.title = `A ${oe.name} player from the Xtrata Music giveaway`;
  }
  let $ = B.on ? lC : null, D = !1, ce = 0, ye = "";
  B.on && a("/radio/giveaway/players/intro").then((l) => {
    const u = l && l.song === null ? null : uC(l == null ? void 0 : l.song) ? l.song : $;
    u !== $ && !D && ($ = u, ct(c.snapshot()));
  }).catch(() => {
  });
  const Be = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const u = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(u) && u >= 1 ? u : null;
    } catch {
      return null;
    }
  })(), Ne = (l) => {
    var d, L, W;
    if (!D || $ === null) return !1;
    if (Date.now() - ce > dC || l.step === "ready")
      return l.step !== "ready" && (D = !1), !1;
    const u = (L = (d = window.XtrataRadio) == null ? void 0 : d.getState) == null ? void 0 : L.call(d), p = Number((W = u == null ? void 0 : u.nowPlaying) == null ? void 0 : W.tokenId);
    return Date.now() - ce < 2e4 && !Number.isSafeInteger(p) ? !0 : p !== $ ? (D = !1, !1) : !0;
  };
  function Pt() {
    const l = window.XtrataRadio;
    if (!($ === null || !(l != null && l.playToken))) {
      D = !0, ce = Date.now(), c.holdFirstPlay(), ct(c.snapshot());
      try {
        l.playToken($);
      } catch {
        D = !1;
      }
    }
  }
  const He = () => {
    var d, L;
    if (!D || $ === null) return null;
    const l = (L = (d = window.XtrataRadio) == null ? void 0 : d.getState) == null ? void 0 : L.call(d), u = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === $ ? l.nowPlaying : null, p = G.get($);
    return { title: (u == null ? void 0 : u.title) || (p == null ? void 0 : p.title) || "", artist: (u == null ? void 0 : u.artist) || (p == null ? void 0 : p.artist) || "", art: `/radio/artwork?id=${$}`, playing: !!(l != null && l.playing) };
  }, Se = B.on && T ? lL(T) : null, Ce = Date.now();
  let dn = !1, Wt = null, ot = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const sn = () => {
    ot = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    ct(c.snapshot());
  }, At = (l, u) => {
    var W;
    if (!Se || u || ot) return null;
    if (!l.gate || l.step === "loading" || (dn = !0), !dn) return Date.now() - Ce < 1e4 ? "checking" : null;
    if (!P(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return x.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const d = l.slot === 0 && !((W = l.gift) != null && W.player), L = d && !l.entries.some((le) => le.kind === "play");
    return l.step === "fund" && L ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && d && (Wt === "landed" || Wt === "arriving" && (L || D)) ? "landed" : l.step === "loading" && Wt !== "checking" ? Wt : null;
  };
  let j = !1;
  function O(l, u, p = [], d) {
    if (!Se) return;
    const L = d !== void 0 ? d : At(l, u);
    if (Wt = L, delete document.documentElement.dataset.noviceBoot, !L) {
      Se.render(null, u);
      return;
    }
    const W = [...p];
    L === "arriving" && l.arrival && W.push(Ut(l.arrival)), l.step === "unsupported" ? W.push(k("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && W.push(k("p", l.error, "ppp-warn"));
    const le = L === "gift" ? x.incomingStarter() : null;
    le && $ === null && !j && l.step === "intro" && !l.busy && !l.armed && !l.error && !jt && (j = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Se.render({
      mode: L,
      status: W,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !jt,
      plays: le ? le.plays : L === "landed" ? l.playsLeft : null,
      from: (le == null ? void 0 : le.from) ?? null,
      tier: oe,
      mystery: ie,
      spot: Be,
      intro: le && $ !== null && l.step === "intro" ? { ready: !0 } : null,
      now: He(),
      albums: L === "landed" ? Lt.map((he) => ({ title: he.title, by: he.subtitle, cover: Gc(he.cover), run: () => {
        sn(), Wn(he, !0);
      } })) : [],
      claimNew: L === "back" ? g(l) : null,
      replaceOld: L === "back" ? h(l) : null,
      start: () => {
        le && $ !== null && Pt(), c.create(y());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => ae(),
      full: () => {
        var xt, Ge, Ke;
        const he = window.XtrataRadio, xe = L === "landed" && !((Ge = (xt = he == null ? void 0 : he.getState) == null ? void 0 : xt.call(he)) != null && Ge.playing);
        D = !1, sn(), xe && ((Ke = he == null ? void 0 : he.playPause) == null || Ke.call(he));
      }
    });
  }
  Se && setTimeout(() => {
    dn || ct(c.snapshot());
  }, 10100), wh(() => {
    (Se != null && Se.showing() || document.documentElement.dataset.asking || se.wantsArt()) && ct(c.snapshot());
  });
  const J = rC({
    input: () => {
      var L, W, le, he;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const u = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (L = l.likeFunds) == null ? void 0 : L.balance };
      if (!u.address) return null;
      const p = l.slot === 0 ? l.entries : [], d = p.filter((xe) => xe.kind === "play" && xe.status === "confirmed");
      return {
        playsLeft: u.balance === void 0 ? null : q(u.balance),
        balance: u.balance,
        incoming: 0n,
        fee: BigInt(((W = l.gate) == null ? void 0 : W.limits.playFee) ?? "300"),
        address: u.address,
        switches: ((le = l.gate) == null ? void 0 : le.restock) ?? {},
        backedUp: l.backedUp,
        done: d.length ? { plays: d.length, artists: new Set(d.map((xe) => xe.recipient)).size, likes: p.filter((xe) => xe.kind === "like" && xe.status === "confirmed" && xe.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((he = l.likeFunds) != null && he.pending)
      };
    },
    copyButton: (l, u, p, d) => or(l, u, p, d, () => {
      ct(c.snapshot());
    })
  }), ae = () => {
    if (!c.snapshot().unproven) {
      J.open();
      return;
    }
    c.prove().then((l) => {
      l && J.open();
    });
  }, ft = document.getElementById("albumList"), Me = ft ? _g(ft, _, { list: !0 }) : null, Pe = "xtrata.radio.album.last.v1", bt = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Pe) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let De = "";
  const Ee = (l) => {
    const u = JSON.stringify(l);
    if (u !== De) {
      De = u;
      try {
        localStorage.setItem(Pe, u);
      } catch {
      }
    }
  };
  let je = null;
  window.XtrataRadioLikeHandler = (l) => {
    var p;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (p = c.snapshot().likeFunds) != null && p.album && (Sr = !0), Fn();
    const u = ks(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: u.title || void 0, artist: u.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let ze;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const Xe = (l) => {
    var p, d;
    const u = window.XtrataRadioListeningIdentity();
    u !== ze && (ze = u, (d = (p = window.XtrataRadio) == null ? void 0 : p.refreshLikes) == null || d.call(p));
  };
  let Lt = [], on = 0, Cn = !1, fn = null;
  const Ct = (l) => {
    var u, p;
    Cn || !((p = (u = l.gate) == null ? void 0 : u.gifts) != null && p.enabled) || Date.now() - on < 6e4 || (on = Date.now(), a("/radio/gift/featured").then((d) => {
      Lt = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((L) => L && typeof L.id == "string" && typeof L.title == "string" && Array.isArray(L.tracks) && L.tracks.length > 0).slice(0, 6), Cn = !0, Lt.length && ct(c.snapshot());
    }).catch(() => {
    }));
  }, Tn = (l) => {
    var u;
    return fn && l.slot === 0 && !((u = l.gift) != null && u.player) && ["ready", "fund", "loading"].includes(l.step) ? fn : null;
  }, Wn = (l, u = !1) => {
    var d, L;
    fn = l, ct(c.snapshot());
    const p = l && u ? Pr(l)[0] : null;
    p && ((L = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || L.call(d, p.id));
  };
  let vt = ef(), xr = null;
  const dr = (l) => {
    const u = B.preview && !jt && l.step === "intro" ? x.incomingAlbum() : null;
    return u ? (vt = Ku(vt, { kind: "offer", album: u.player.id, already: Bb(C).includes(u.player.id) }), _c(vt) ? u.player : null) : (vt = Ku(vt, { kind: "withdraw" }), null);
  }, an = (l) => {
    const u = vt.phase;
    vt = Ku(vt, l), vt.phase !== u && (vt.album && (vt.phase === "playing" || vt.phase === "done") && YL(C, vt.album), ct(c.snapshot()));
  };
  setInterval(() => {
    vt.phase === "playing" && an({ kind: "tick", at: Date.now() });
  }, 5e3);
  let _t = "", cn, Et = !1, Zt = !1;
  const ss = (l, u) => {
    var Re, _e, wt, ln, Jn, Ls, ds, di;
    const p = window.XtrataRadio;
    if (!(p != null && p.setGiftPlayer) || !(p != null && p.setGiftStop)) return;
    const d = u.depositPending && l.step === "fund" && ((Re = l.giftStop) == null ? void 0 : Re.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, L = xr, W = Ne(l), le = d ? P(l) ? GL(d.reason, d.text) : d.text : null, he = L || W ? null : le ?? (t && (!((_e = l.gate) != null && _e.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    he && he !== cn && (p.setGiftStop(he), cn = he);
    const xe = l.step === "off" || l.step === "elsewhere" ? null : ((wt = l.gift) == null ? void 0 : wt.player) ?? L ?? Tn(l) ?? null, xt = xe ? xe.id + ":" + xe.cover + ":" + xe.tracks.map((_n) => _n.id).join(",") : "";
    xt !== _t && (p.setGiftPlayer(xe ? { id: xe.id, title: xe.title, subtitle: xe.subtitle, tracks: Pr(xe).map((_n) => _n.id), hidden: ((ln = _I(xe)) == null ? void 0 : ln.id) ?? null, cover: xe.cover } : null), _t = xt), he !== cn && (p.setGiftStop(he), cn = he);
    const Ge = !W && (d == null ? void 0 : d.reason) === "arriving";
    Ge !== Zt && ((Jn = p.setGiftWait) == null || Jn.call(p, Ge), Zt = Ge);
    const Ke = !!xe && (!!L || !!((Ls = l.albumLock) != null && Ls.locked));
    Ke !== Et && ((ds = p.setGiftLock) == null || ds.call(p, Ke), Et = Ke), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((di = p.forgetWallets) == null || di.call(p));
  };
  let Sr = !1;
  const E = /* @__PURE__ */ new Map(), H = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((d) => d.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let p = E.get(l.listening);
    return p === void 0 && (p = Date.now(), E.set(l.listening, p)), Date.now() - p < ml ? p : null;
  }, z = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((u) => u.kind === "play") && !!l.listening && E.has(l.listening), U = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", q = (l) => {
    const u = c.snapshot().playCost || 350n;
    return l > tn ? Number((l - tn) / u) : 0;
  }, te = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), Ie = (l) => {
    const u = Math.round((Date.now() - l) / 6e4);
    return u < 1 ? "now" : u < 60 ? `${u}m` : u < 1440 ? `${Math.round(u / 60)}h` : `${Math.round(u / 1440)}d`;
  }, be = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, k = (l, u = "", p = "") => {
    const d = document.createElement(l);
    return u && (d.textContent = u), p && (d.className = p), d;
  }, we = (l, u, p = "") => {
    const d = k("button", l, p);
    return d.type = "button", d.onclick = u, d;
  }, Le = (l, u) => {
    const p = k("a", l);
    return p.href = u, p.target = "_blank", p.rel = "noopener", p;
  };
  let it = null, ut = location.hash === "#give";
  ut && history.replaceState(null, "", location.pathname + location.search);
  let rt = !1;
  const Jt = xI((l) => bI({ address: l, network: "mainnet" }), () => ct(c.snapshot())), Ft = (l) => Jt.get(l), jt = UL(navigator.userAgent), yt = (l, u) => {
    const p = navigator.userAgent, d = HL(p), L = `${location.origin}${location.pathname}${u ? `#gift=${u}` : ""}`, W = [k("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${B.on ? "player" : "listening wallet"}${u ? B.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], le = k("div", "", "ppp-open-row"), he = OL(L, p);
    if (he) {
      const xe = k("a", `Open in ${d}`, "primary ppp-open-in");
      xe.href = he, xe.dataset.homeAction = "radio:open-in-browser", le.append(xe);
    }
    return le.append(or("copy-page-link", "Copy link", () => L, he ? "" : "primary", () => ct(c.snapshot()))), W.push(le, k("p", `If that does not open ${d}, use ${l}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), W;
  }, Qe = (l) => Ft(l) ?? U(l), vr = (l) => l.slice(0, 2).map(Qe).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), at = /* @__PURE__ */ new Map();
  let Rt = !1;
  const fo = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Fn = () => {
    Rt || (Rt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const u of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const p = Number(u == null ? void 0 : u.id);
        Number.isSafeInteger(p) && at.set(p, { title: typeof u.title == "string" ? u.title : void 0, artist: typeof u.artist == "string" ? u.artist : void 0 });
      }
      ct(c.snapshot());
    }).catch(() => {
      Rt = !1;
    }));
  }, ks = (l, u) => {
    const p = at.get(l), d = mg(l, [p == null ? void 0 : p.title, u == null ? void 0 : u.title].find((W) => !fo(W)) || ""), L = yg(l, (p == null ? void 0 : p.artist) || (u == null ? void 0 : u.artist) || "");
    return { title: d, artist: L };
  }, jn = (l) => {
    const { title: u, artist: p } = ks(l.song, l);
    return u ? `“${u}”${p ? ` — ${p}` : ""}` : `Song #${l.song}${p ? ` — ${p}` : ""}`;
  }, Bn = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Nn = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function ho(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Mn(l, u, p = "", d) {
    const L = k("dt", l), W = k("dd", u, p);
    return d && W.append(" ", d), [L, W];
  }
  const Rn = document.getElementById("ppp-top"), Dr = () => {
    (s.hidden || s.classList.contains("ppp-frame--rest") ? e : s).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Fr = () => {
    var u;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (u = document.getElementById("radio-wallet-connect")) == null || u.click();
  }, $s = () => {
    var u, p;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Fr();
      return;
    }
    if (l.step === "elsewhere" && ((u = l.gate) != null && u.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((p = l.giftStop) == null ? void 0 : p.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      ae();
      return;
    }
    Dr();
  };
  Rn && (Rn.onclick = $s);
  const po = (l, u, p, d = "") => l.standIn && !l.mainConnected ? we(`Connect ${Qe(l.standIn)} to add STX`, Fr, d) : we(u, p, d), zn = (l) => {
    c.useLinked(l).then(() => Dr());
  };
  let os = null;
  const go = () => {
    const l = Hg(c.snapshot(), Qe);
    return l.length ? os || (os = new Promise((u) => {
      var Ge;
      const p = k("dialog", "", "ppp-connect");
      p.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const L = (Ke) => {
        d = Ke, p.close();
      };
      p.addEventListener("close", () => {
        p.remove(), os = null, u(d);
      }), p.addEventListener("click", (Ke) => {
        Ke.target === p && L(null);
      });
      const W = (Ke, Re, _e, wt, ln = !1) => {
        const Jn = k("button", "", "ppp-connect__opt " + _e);
        return Jn.type = "button", Jn.disabled = ln, Jn.onclick = wt, Jn.append(k("b", Ke), k("span", Re)), Jn;
      }, le = k("h2", "Connect", "ppp-connect__title");
      le.id = "ppp-connect-title";
      const he = l.map((Ke) => W(Ke.label, Ke.detail, "is-music", () => {
        if (L("music"), Ke.action === "linked" && Ke.main) {
          zn(Ke.main);
          return;
        }
        const Re = Hg(c.snapshot(), Qe).find((_e) => _e.action !== "linked");
        (Re == null ? void 0 : Re.action) === "create" ? c.create() : (Re == null ? void 0 : Re.action) === "unlock" && c.unlock(), Dr();
      }, !!Ke.disabled)), xe = W("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => L("stacks")), xt = we("Cancel", () => L(null), "quiet ppp-connect__cancel");
      p.append(le, ...he, xe, xt), document.body.appendChild(p), p.showModal(), (Ge = he.find((Ke) => !Ke.disabled)) == null || Ge.focus();
    }), os) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = go;
  function na(l) {
    if (!Rn) return;
    const u = (d, L, W) => {
      Rn.hidden = !1, Rn.className = "ppp-top" + (L ? " is-" + L : ""), Rn.replaceChildren(k("span", "", "dot"), document.createTextNode(d)), Rn.title = W;
    }, p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Rn.hidden = !0;
        return;
      case "elsewhere":
        return u("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Rn.hidden = !0;
        return;
      case "intro":
        return u("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return u(`Connect ${Qe(l.linked)}`, "warn", `This device's listening wallet belongs to ${Qe(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return u("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return u("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? u("Plays on their way", "quiet", "Plays start by themselves when they land") : u(l.entries.some((d) => d.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return u("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return u("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && p > 0 && !l.giftStop ? u(`${p.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : u("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const hn = document.getElementById("pppNudge"), Er = document.getElementById("onair");
  ($e = hn == null ? void 0 : hn.querySelector("button")) == null || $e.addEventListener("click", () => $s());
  const is = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, yo = {
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
  function oi(l) {
    if (l.step === "loading") return;
    const u = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, p = l.step === "ready" && l.payingOn && u > 0 && !l.giftStop, d = l.step === "fund" && l.depositPending, L = l.step === "elsewhere" && !t, W = p || d || L ? "" : is[l.step] ?? "", le = p ? "on" : L ? "free" : W ? "off" : "";
    le ? document.documentElement.dataset.ppp = le : delete document.documentElement.dataset.ppp, Er && (Er.hidden = !le || le === "free", Er.querySelector(".onair-sub").textContent = p ? `${u.toLocaleString()} plays left` : "Plays off"), hn && (hn.hidden = le !== "off" && le !== "free", hn.classList.toggle("is-free", le === "free"), le === "free" ? (hn.querySelector(".nudge-t").textContent = "You’re on the free player", hn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", hn.querySelector("button").textContent = "Get a player") : le === "off" && (hn.querySelector(".nudge-t").textContent = W, hn.querySelector(".nudge-s").textContent = P(l) ? l.step === "intro" ? VL : "" : "This radio requires a funded listening wallet with music support on.", hn.querySelector("button").textContent = yo[l.step] ?? "Start"));
  }
  let as = "";
  function Is(l) {
    const u = k("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && u.append(k("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && u.append(k("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const p = k("input");
    p.type = "text", p.placeholder = "SP… address to send returns to", p.autocomplete = "off", p.spellcheck = !1, p.setAttribute("aria-label", "Address to return funds to"), p.value = as, p.oninput = () => {
      as = p.value;
    };
    const d = we(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(p.value), as = "";
    }, "tiny");
    return u.append(p, " ", d), l.returnToKind === "chosen" && u.append(" ", we("Back to the funder", () => c.clearReturnAddress(), "tiny")), u;
  }
  const wo = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function ii() {
    const l = k("p", wo + " ", "ppp-mute");
    return l.append(Le("Xverse", "https://www.xverse.app/download"), " · ", Le("Leather", "https://leather.io/install-extension")), l;
  }
  let cs = "";
  const ra = (l) => {
    const u = document.documentElement, p = l.solo && !l.main ? l.listening ? U(l.listening) : "new" : "", d = R5() ? "1" : "", L = l.standIn && !l.mainConnected ? Qe(l.standIn) : "";
    `${p}|${d}|${L}` !== cs && (cs = `${p}|${d}|${L}`, p ? u.dataset.pppSolo = p : delete u.dataset.pppSolo, L ? u.dataset.pppAs = L : delete u.dataset.pppAs, d ? u.dataset.pppWalletInstalled = d : delete u.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => ct(c.snapshot()), l);
  function ai(l, u = "") {
    const p = k("div", "", "ppp-topup"), d = Ar(l);
    p.append(k("span", "Add plays from My player: ", "ppp-mute"));
    for (const L of zc) {
      const W = we(`+${L.toLocaleString()}`, () => void c.topUpAlbum(L), u);
      W.disabled = d === void 0 || d < L || l.depositPending || !!l.busy, p.append(W);
    }
    return d !== void 0 && d < zc[0] && p.append(k("p", "My player needs plays first (switch to My player above).", "ppp-mute")), p;
  }
  const Ar = (l) => {
    var d;
    const u = (d = l.likeFunds) == null ? void 0 : d.balance;
    if (u === void 0 || !l.playCost) return;
    const p = u - tn - 6000n;
    return p > 0n ? Number(p / l.playCost) : 0;
  };
  function kr(l) {
    const u = l.likeFunds;
    if (!u || !u.album || !u.low && !u.pending) return [];
    if (u.low || (Sr = !1), u.low && !Sr) return [];
    const p = k("div", "", "ppp-pick ppp-lowbox");
    if (!u.low) {
      if (!u.txid) return [];
      const L = k("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return u.txid && L.append(Le("View", be(u.txid))), p.append(L), [p];
    }
    p.append(k("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), p.append(k("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), p.append(k("p", u.address, "ppp-addr-full"));
    const d = k("div", "", "ppp-open-row");
    if (d.append(or("copy-likes-address", "Copy address", () => u.address, "primary", () => ct(c.snapshot()))), u.main && !l.solo) {
      const L = ms - (u.balance ?? 0n);
      L > 0n && d.append(po(l, `Pay ${Tr(L)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return p.append(d), p.append(k("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [p];
  }
  const Ut = (l) => {
    const u = k("div", "", "ppp-wait");
    u.dataset.since = String(l.since), u.dataset.grace = String(l.graceMs), u.setAttribute("role", "progressbar"), u.setAttribute("aria-label", "Your plays are arriving");
    const p = k("p", "", "ppp-wait-t"), d = k("div", "", "ppp-wait-track");
    return d.append(k("div", "", "ppp-wait-fill")), u.append(p, d), fr(u), u;
  };
  function fr(l) {
    const u = Number(l.dataset.since), p = Number(l.dataset.grace) || 6e4, d = Math.max(0, Date.now() - u), L = l.querySelector(".ppp-wait-fill"), W = l.querySelector(".ppp-wait-t");
    if (d < p) {
      const le = Math.ceil((p - d) / 1e3);
      L.style.width = Math.max(4, Math.min(95, d / p * 100)).toFixed(0) + "%", W.textContent = `Loading your plays · ${le}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(d / p * 100)));
    } else
      L.style.width = "", W.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let mo = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      mo = 0;
      return;
    }
    l.forEach(fr), ++mo % 10 === 0 && ct(c.snapshot());
  }, 1e3);
  let jr = null;
  function ci(l) {
    if (l.step === "loading" && jr !== null) return;
    const p = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!x.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    p !== jr && (jr = p, p ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ct(l) {
    var Ch, Th, Bh, Nh, Mh, _h, Ph, Uh, Oh, Hh, Dh, Fh, jh, Rh, zh, Gh, Kh, Vh;
    if (se.sync(), je && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const Y = je;
      je = null, l.root === Y.root && l.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const u = x.inProgress(l), p = H(l), d = u && l.step === "fund" ? { ...l, depositPending: !0 } : p !== null ? { ...l, depositPending: !0, arrival: { since: p, graceMs: ml } } : l, L = d.error === bl;
    if (Xe(), Ct(l), Fe(l), xr = dr(l), ss(l, d), ci(d), ra(d), !u && x.inProgress(l)) return;
    if (na(d), oi(d), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? B.on ? XL : "Checking your listening wallet…" : B.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = d.step === "off", e.hidden) {
      O(d, !1);
      return;
    }
    const [W, le] = ho(d), he = o(".ppp-state");
    he.textContent = W, he.className = "ppp-state" + (le ? " ppp-state--" + le : ""), he.hidden = !W;
    const xe = !!d.busy || d.armed, xt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (xe || !["intro", "loading"].includes(d.step));
    s.hidden = !xt, s.classList.toggle("ppp-frame--rest", !xe && !rt);
    const Ge = o(".ppp-frame-label");
    Ge.hidden = !0;
    const Ke = H5(d) ?? it;
    it = Ke;
    const Re = "xtrata.radio.ppp.heard.v1", _e = (() => {
      try {
        return localStorage.getItem(Re) === "1";
      } catch {
        return !1;
      }
    })();
    if (!_e && d.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(Re, "1");
      } catch {
      }
    const wt = _e || d.slot > 0 && ((((Ch = d.likeFunds) == null ? void 0 : Ch.balance) ?? 0n) > 0n || S.count() > 1), ln = P(d), Jn = !ln && F5({ ...d, heard: wt }, Ke);
    o(".ppp-badge").hidden = !Jn;
    const Ls = o(".ppp-steps"), ds = o(".ppp-stage");
    Ls.hidden = ds.hidden = !Jn, Ke && Jn && (Ls.replaceChildren(...Wd(d.solo).map((Y, ue) => {
      const Oe = k("li", "", ue < Ke.at ? "done" : ue === Ke.at ? Ke.blocked ? "now blocked" : "now" : "");
      return Oe.append(k("span", ue < Ke.at ? "✓" : String(ue + 1), "n"), Y), ue === Ke.at && Oe.setAttribute("aria-current", "step"), Oe;
    })), ds.textContent = Ke.caption, ds.className = "ppp-stage " + (Ke.at >= Wd(d.solo).length ? "ppp-ok" : Ke.blocked ? "ppp-bad" : "ppp-cyan"));
    const di = o(".ppp-facts"), _n = [];
    d.main && ((Th = d.gate) != null && Th.here) && !d.solo && _n.push(...Mn("Your wallet", Qe(d.main), "ppp-addr-short"));
    const Sh = () => {
      if (!d.listening) return;
      const Y = or("copy-listening", "Copy", () => d.listening || "", "tiny", () => ct(c.snapshot()));
      _n.push(...Mn(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", U(d.listening), "ppp-addr-short", Y));
    };
    if (d.linked || Sh(), d.listening && d.step !== "intro")
      if (d.linked)
        _n.push(...Mn("Credited to", `${Qe(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), Sh();
      else if (d.solo) {
        d.creditedTo && _n.push(...Mn("Credited to", `${Qe(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${Qe(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        _n.push(...Mn("Returns go to", d.gift ? Y : d.returnTo && !Ft(d.returnTo) ? Y.replace(U(d.returnTo), d.returnTo) : Y, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else _n.push(...Mn("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((Bh = d.gate) != null && Bh.here)) {
      const Y = d.linkedListening.map((ue) => U(ue) + (ue === d.listening ? " (this one)" : "")).join(", ");
      _n.push(...Mn(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const Y = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      _n.push(...Mn("Balance", `${Tr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, Y));
    }
    const oa = d.entries.find((Y) => Y.kind === "play");
    oa && Fn(), oa && _n.push(...Mn("Last paid song", `${jn(oa)} → ${Qe(oa.recipient)}`, Bn[oa.status] || "")), di.replaceChildren(..._n), di.hidden = !_n.length;
    const Ue = [], kt = [], Nt = [], Qn = [], vh = In(BigInt(((Nh = d.gate) == null ? void 0 : Nh.limits.playFee) ?? "300")), Eh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Tr(yl)} STX to the song holder, plus a ${Tr(vh - yl)} STX network fee.`, Ah = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (Ue.push(k("p", "Pay artists as you listen.")), (Mh = d.gate) != null && Mh.radioUrl) {
          const ue = k("p");
          ue.append(Le("Open the pay-per-play radio →", d.gate.radioUrl)), Ue.push(ue);
        }
        kt.push(k("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const ue = [d.linked, ...d.others];
          Ue.push(k("p", ue.length > 1 ? `This device has listening wallets for ${vr(ue)}.` : `This device has a listening wallet for ${Qe(d.linked)}.`)), kt.push(k("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), ue.slice(0, 3).forEach((Oe, ht) => Nt.push(we(`Open ${Qe(Oe)}`, () => zn(Oe), ht === 0 ? "primary" : "")));
        } else
          Ue.push(k("p", "Connect your wallet to pay artists as you listen.")), kt.push(k("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Ue.push(k("p", `This device's listening wallet belongs to ${Qe(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), kt.push(k("p", `You are connected as ${Qe(d.main)}. Switch to the linked wallet to continue listening.`)), kt.push(k("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Nt.push(we("Switch wallet", Fr, "primary"));
        break;
      case "not-invited":
        Ue.push(k("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Ue.push(k("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Ue.push(k("p", "Every play counts for the song’s owner, on-chain.")), kt.push(k("p", Eh)), kt.push(k("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), kt.push(k("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (Ue.push(k("p", `This device already has a listening wallet for ${vr(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), kt.push(k("p", `Otherwise, set up a new listening wallet for ${Qe(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && kt.push(k("p", `This is the listening wallet for ${Qe(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && kt.push(k("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = x.liveGift();
        Nt.push(we(Y ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${Qe(d.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !Y && !d.solo && d.main && d.others.length && Nt.push(we("Switch wallet", Fr)), !Y && d.solo && Nt.push(we("I have a Stacks wallet", Fr)), Nt.push(we("I already have a listening wallet", () => void c.unlock(!0))), Y && Nt.push(we("Not now", () => x.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (Ue.push(k("p", "Locked.", "ppp-mute")), Nt.push(we("Unlock", () => void c.unlock(), "primary"))), d.standIn ? Qn.push(we("Use a different listening wallet", () => void go().then((ue) => {
          ue === "stacks" && Fr();
        }), "quiet")) : Qn.push(we("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        Ue.push(k("p", `Link to ${Qe(d.main)} · free`)), kt.push(k("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), kt.push(k("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Nt.push(we(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        Ue.push(k("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && Ue.push(Ut(d.arrival)) : z(d) ? Ue.push(k("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (_h = d.gift) != null && _h.player ? Ue.push(k("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? Ue.push(k("p", "No plays left · add plays to keep counting", "ppp-bad")) : Ue.push(k("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / vh)).toLocaleString()} plays`)), d.entries.length && kt.push(k("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && kt.push(k("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), u ? kt.push(k("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? kt.push(k("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (kt.push(k("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), kt.push(k("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && Nt.push(or("copy-address", "Copy my address", () => d.listening || "", "primary", () => ct(c.snapshot())))) : kt.push(k("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const ue = k("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          ue.append(Le("View", be(d.depositTxid))), Ue.push(ue);
        } else d.allowance > 0n && !d.solo && !d.depositPending && Nt.push(po(d, `Deposit ${Tr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        Ue.push(k("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.phrase && (Ue.push(k("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Nt.push(we("Back up my player · 24 words", () => void c.backup(), ""))), d.solo && !d.returnTo && (Ue.push(k("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Ue.push(Is(d))), (!d.solo || d.returnTo) && Nt.push(we("Return excess", () => void c.returnFunds("excess"), "primary"), we("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((Ph = d.giftStop) == null ? void 0 : Ph.reason) !== "off") {
          const ue = Math.min(d.session.playsLeft, d.playsLeft);
          Ue.push(k("p", `${ue.toLocaleString()} plays left`, "ppp-ok")), kt.push(k("p", Eh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Nt.push(we("Switch off", () => void c.switchOff()));
        } else
          Ue.push(k("p", "Switch on music support to listen.", "ppp-mute")), Nt.push(we("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && Ue.push(k("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && Ue.push(k("p", "Running low on plays", "ppp-warn")), d.aboveTarget && Ue.push(k("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), d.depositPending ? Ue.push(k("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && Nt.push(po(d, `Top up ${Tr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const Y = d.step === "fund", ue = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      Y ? Nt.unshift(we("Add plays", () => ae(), "primary")) : ue ? Nt.push(we("Add plays", () => ae(), "primary")) : d.step === "ready" && Qn.push(we("Add plays", () => ae(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && kt.push(k("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && kt.push(Is(d)), kt.push(ii()), d.slot === 0 && d.step === "ready" && d.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = k("p", "New to Stacks? ", "ppp-mute");
      Y.append(Le("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Ue.push(Y);
    }
    if (d.walletOutdated && kt.push(k("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (Ue.push(k("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Nt.push(we("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && Qn.push(we(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${Qe(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((Uh = d.gift) != null && Uh.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && Qn.push(ai(d, "quiet")), d.phrase && ["ready", "fund", "over"].includes(d.step) && Qn.push(we(d.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && Qn.push(we("Lock", () => void c.lock(), "quiet")), xt && !xe && Qn.push(we(rt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      rt = !rt, ct(c.snapshot());
    }, "quiet")), [...Nt, ...Qn].forEach((Y) => Y.disabled = Ah), Ah && (Nt.length = 0), !ln && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Oh = d.gift) != null && Oh.player)) {
      const Y = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", ue = Ue.at(0);
      d.step === "ready" && ue ? ue.append(k("span", ` · ${te(d.balance)} STX`, Y)) : Ue.push(k("p", `Balance ${te(d.balance)} STX`, Y));
    }
    if (ln) {
      for (const Oe of [...Nt, ...Qn]) {
        const ht = RL[Oe.textContent ?? ""];
        ht && (Oe.textContent = ht);
      }
      for (let Oe = Ue.length - 1; Oe >= 0; Oe--) Fg(Ue[Oe].textContent) && kt.unshift(...Ue.splice(Oe, 1));
      for (let Oe = Nt.length - 1; Oe >= 0; Oe--) Fg(Nt[Oe].textContent) && Qn.unshift(...Nt.splice(Oe, 1));
      const Y = d.entries.some((Oe) => Oe.kind === "play"), ue = KL(d.step, { played: Y, arriving: d.depositPending });
      ue.length && Ue.length && ue.shift(), Ue.push(...ue.map((Oe) => k("p", Oe, "ppp-mute")));
    }
    if ((Hh = d.gift) != null && Hh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const Y = k("p", "", "ppp-gift");
      Y.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && Y.append(" · ", d.gift.player.subtitle);
      const ue = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? k("span", " · plays on their way", "ppp-warn") : k("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      ue && Y.append(ue);
      const Oe = (Dh = Ue.at(0)) == null ? void 0 : Dh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && Oe && /STX/.test(Oe.textContent ?? "") && Oe.remove(), Ue.unshift(Y), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          Ue.splice(1, 0, k("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), ai(d, "primary"));
        else {
          const ht = k("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ht.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ht.append(Le("Xverse", "https://www.xverse.app/download"), " and ", Le("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Ue.splice(1, 0, ht);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const Y = d.returnPlan, ue = k("div", "", "ppp-pick");
      ue.append(k("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Oe = k("ul", "", "ppp-gift-list");
      Y.steps.forEach((ht, $r) => {
        const er = ht.kind === "gift" ? "the unused gift" : ht.kind === "deposit" ? "what was added to it" : "the rest", mn = k("li");
        mn.append(k("span", `${$r + 1}. ${Tr(BigInt(ht.send))} STX · ${er}`, "t"), k("span", ht.to ? ` → ${Qe(ht.to)}` : " → choose an address below", ht.to ? "ppp-mute" : "ppp-warn")), Oe.append(mn);
      }), ue.append(Oe), Y.kept && ue.append(k("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((ht) => !ht.to) && ue.append(Is(d)), ue.append(we(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), Ue.push(ue);
    }
    const Cs = bo(d), fs = v ? Cs : null, fi = At(d, !!fs), Mb = fi === "gift" || fi === "arriving" || fi === "new", Ql = fs ? null : w.lines(l), eu = Ql && !w.claiming() ? Ql : [...Ql ?? [], ...x.banner(l, { bare: !!fs || fi === "gift" || fi === "arriving" })], qa = jt && (x.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? yt(jt, x.pendingCode()) : [];
    fs || (Ue.unshift(...eu), Ue.push(...kr(d)), Ue.unshift(...qa)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && Ue.unshift(k("p", `This is ${Qe(d.creditedTo)}'s listening wallet. Plays and likes count for ${Qe(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), o(".ppp-key").replaceChildren(...Ue);
    const tu = document.querySelector(".ppp-switch");
    if (tu) {
      const Y = S.latest(), ue = d.slot > 0, Oe = ["fund", "ready", "over"].includes(d.step) && (ue || !!Y);
      if (tu.hidden = !Oe, Oe) {
        const ht = (mn, Ja, Qa, au) => {
          const pi = we("", au, "ppp-tab");
          return pi.setAttribute("aria-pressed", String(Qa)), pi.append(k("span", mn, "tt"), k("span", Ja === void 0 ? "…" : `${q(Ja).toLocaleString()} plays`, "ts")), pi.disabled = !!d.busy, pi;
        }, $r = ue ? ((jh = (Fh = d.gift) == null ? void 0 : Fh.player) == null ? void 0 : jh.title) ?? "Album" : Y.title, er = we("View all albums" + (S.count() > 1 ? ` (${S.count()})` : ""), () => {
          const mn = document.querySelector(".ppp-shelf");
          mn && (mn.hidden = !1, mn.open = !mn.open, er.setAttribute("aria-expanded", String(mn.open)), mn.open && requestAnimationFrame(() => mn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        er.setAttribute("aria-expanded", String(!!((Rh = document.querySelector(".ppp-shelf")) != null && Rh.open))), tu.replaceChildren(
          ht("🎧 My player", ue ? (zh = d.likeFunds) == null ? void 0 : zh.balance : d.balance, !ue, () => {
            ue && c.openAlbum(0);
          }),
          ht("💿 " + $r, ue ? d.balance : void 0, ue, () => {
            !ue && Y && c.openAlbum(Y.slot);
          }),
          er
        );
      }
    }
    const Wa = S.render(d), Za = document.querySelector(".ppp-shelf");
    if (Za) {
      Za.hidden = !Wa;
      const Y = Za.querySelector("summary");
      Y && (Y.textContent = S.count() > 0 ? `♪ My albums (${S.count()})` : "♪ My albums");
      const ue = Za.querySelector(".ppp-shelf-body");
      Wa && ue && !ue.contains(Wa) && ue.replaceChildren(Wa);
    }
    const ia = x.renderFold(l);
    if (o(".ppp-gifts").hidden = !ia, ia && !o(".ppp-gift-body").contains(ia) && o(".ppp-gift-body").replaceChildren(ia), ia && ut) {
      ut = !1;
      const Y = o(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const nu = document.querySelector("#ppp .ppp-featured");
    if (nu) {
      const Y = Q(), ue = se.manage(), Oe = (Y.length > 0 || !!ue) && d.slot === 0 && !((Gh = d.gift) != null && Gh.player) && d.step === "ready";
      nu.hidden = !Oe, Oe && nu.replaceChildren(...Y.length ? [k("p", "Albums in your player", "ppp-featured__h")] : [], ...Y.map((ht) => {
        const $r = (fn == null ? void 0 : fn.id) === ht.id, er = we("", () => Wn($r ? null : ht, !$r), "ppp-featured__a" + ($r ? " is-on" : "")), mn = Pr(ht).length;
        return er.append(k("b", ht.title), k("span", $r ? "Playing now · tap to go back to the radio" : `${ht.subtitle ? ht.subtitle + " · " : ""}${mn} ${mn === 1 ? "song" : "songs"}`)), er.setAttribute("aria-pressed", String($r)), er.disabled = !!d.busy, er;
      }), ...ue ? [ue] : []);
    }
    const ru = document.querySelector("#ppp .ppp-release-in-slot");
    if (ru) {
      const Y = ["off", "elsewhere", "unsupported"].includes(d.step) ? [] : se.banner();
      ru.hidden = !Y.length, ru.replaceChildren(...Y);
    }
    const hi = document.querySelector("#ppp .ppp-release");
    if (hi) {
      const Y = ["off", "elsewhere", "unsupported"].includes(d.step) ? null : se.fold();
      if (hi.hidden = !Y, Y) {
        const ue = document.activeElement instanceof HTMLElement && hi.contains(document.activeElement) ? document.activeElement : null, Oe = ((Kh = hi.querySelector(".ppp-release-songs")) == null ? void 0 : Kh.scrollTop) ?? 0;
        (Vh = hi.querySelector(".ppp-release-body")) == null || Vh.replaceChildren(...Y);
        const ht = hi.querySelector(".ppp-release-songs");
        ht && Oe && (ht.scrollTop = Oe), ue && ue.isConnected && document.activeElement !== ue && ue.focus({ preventScroll: !0 });
      }
    }
    sa(d);
    const su = document.querySelector("#ppp .ppp-yours");
    if (su) {
      const Y = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      su.hidden = !Y;
      const ue = su.querySelector(".ppp-yours-body");
      if (Y && ue && ue.getAttribute("data-for") !== d.listening) {
        ue.setAttribute("data-for", d.listening);
        const Oe = (au, ...pi) => {
          const Xh = k("details", "", "ppp-yours-item");
          return Xh.append(k("summary", au), ...pi), Xh;
        }, ht = k("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ht.append(k("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const $r = k("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), er = k("p");
        er.append(Le("Find a name at BNS One →", "https://bns.one"));
        const mn = k("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ja = k("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Qa = k("p");
        Qa.append(Le("See the giveaway →", "https://xtrata.xyz/giveaway")), ue.replaceChildren(
          Oe("Give your player a name", ht, $r, k("p", d.listening, "ppp-addr-full"), or("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => ct(c.snapshot())), er),
          Oe("Link it to a wallet you already have", mn),
          Oe("Bring a friend in", Ja, Qa)
        );
      }
    }
    o(".ppp-body").replaceChildren(...kt), o(".ppp-actions").replaceChildren(...Nt), o(".ppp-actions2").replaceChildren(...Qn);
    const ou = d.busy || d.message || "", kh = o(".ppp-msg"), iu = ou && Ue.some((Y) => (Y.textContent ?? "").startsWith(ou.replace(/[.✓\s]+$/, ""))) ? "" : ou, $h = !iu && !d.error ? d.notice : L && !iu ? d.error : "";
    kh.textContent = iu || $h, kh.classList.toggle("is-warn", !!$h), o(".ppp-err").textContent = L ? "" : d.error;
    const _b = d.entries.filter((Y) => Y.kind === "play");
    o(".ppp-recent").hidden = !d.entries.length, o(".ppp-recent-list").replaceChildren(..._b.slice(0, 5).map((Y) => {
      const ue = k("li"), Oe = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return ue.append(k("span", "", "d " + Oe), k("span", jn(Y), "t"), k("span", Ie(Y.created), "ppp-mute")), Y.txid && ue.append(Le("tx", be(Y.txid))), ue;
    })), o(".ppp-wallets").hidden = !(di.childElementCount || Qn.length), o(".ppp-more").hidden = !kt.length;
    const Ih = o(".ppp-history");
    Ih.hidden = !d.entries.length, d.entries.length && Fn(), Ih.replaceChildren(k("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((Y) => {
      const ue = k("div", "", "ppp-row"), Oe = Y.kind === "play" ? [k("span", jn(Y), "ppp-song"), k("span", ` · ${Tr(BigInt(Y.amount))} STX to ${Qe(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [k("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${jn(Y)}`, "ppp-song"), k("span", ` · for ${d.linked ? Qe(d.linked) : "this listening wallet"}`, "ppp-mute")] : [k("span", `Returned ${Tr(BigInt(Y.amount))} STX`, "ppp-song"), k("span", ` to ${Qe(Y.recipient)}`, "ppp-mute")];
      return ue.append(
        k("span", Nn[Y.status] || Y.status, "ppp-status " + (Bn[Y.status] || "")),
        ...Oe,
        k("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && ue.append(Le("tx ↗", be(Y.txid))), ue;
    })), K == null || K.render(fs ? us(d, fs, [...qa, ...eu]) : null), O(d, !!fs, Mb ? [...qa, ...eu] : qa, fi), Zn(d, !!fs || !!(Se != null && Se.showing())), ui(d, fs), J.isOpen() && J.refresh(), ke();
    const Lh = (Cs == null ? void 0 : Cs.mode) === "open" ? null : Tn(d);
    Me == null || Me.render((Cs == null ? void 0 : Cs.mode) === "open" ? us(d, Cs, []) : Lh ? { ...us(d, { mode: "open", player: Lh }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function bo(l) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((d = l.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && Ee({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const u = x.incomingAlbum();
    if (u) return { mode: "arrive", player: u.player, from: u.from, offered: u.plays };
    const p = bt();
    return p && (l.step === "locked" || je && l.step === "loading") ? { mode: "locked", player: p.player } : null;
  }
  const ls = (l, u, p, d, L) => `/awards/${l.id}#${new URLSearchParams({ n: String(u), a: p, ...L ? { b: L } : {}, p: String(d), s: Rg(ag, u, p) })}`;
  function li(l) {
    const u = l.award;
    return !u || !["ready", "fund", "over", "link"].includes(l.step) ? null : u.claimTx ? N ? "making" : null : u.state === "claimed" ? N && u.inscription !== void 0 ? "yours" : null : u.state !== "ready" || M || l.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function Zn(l, u) {
    if (!V) return;
    const p = l.award, d = p != null && p.cls && Tc(p.cls) ? Co(p.cls) : null, L = l.slot === 0 ? l.listening : l.root, W = u || !p || !d || !L || p.number === void 0 ? null : li(l);
    if (!W || !p || !d || !L) {
      V.render(null, u);
      return;
    }
    W === "have" && l.linked && !X && (X = !0, c.awardRefresh());
    const le = typeof p.name == "string" && p.name ? p.name : null, he = [];
    l.error && he.push(k("p", l.error, "ppp-warn"));
    const xe = (xt) => {
      I = xt, xt === "name" && (N = !0), ct(c.snapshot());
    };
    V.render({
      screen: W,
      tier: d,
      number: p.number,
      need: p.need ?? 0,
      player: L,
      name: p.name,
      inscription: p.inscription,
      art: W === "yours" && p.inscription !== void 0 ? `/i/${p.inscription}` : ls(d, p.number, L, p.need ?? 0, le),
      claimLink: p.claimTx ? be(p.claimTx) : void 0,
      status: he,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? Qe(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => or("award-player-address", "Copy my player’s address", () => L, "tiny", () => ct(c.snapshot())),
      go: xe,
      claim: (xt) => {
        N = !0, c.claimAward(xt);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var xt;
        return (xt = document.getElementById("radio-wallet-connect")) == null ? void 0 : xt.click();
      },
      link: () => void c.link(),
      later: () => {
        M = !0;
        try {
          localStorage.setItem(m, String(Date.now()));
        } catch {
        }
        ct(c.snapshot());
      },
      done: () => {
        N = !1, I = "ready", ct(c.snapshot());
      }
    }, u);
  }
  function sa(l) {
    var Ke;
    const u = document.querySelector("#ppp .ppp-award");
    if (!u) return;
    const p = l.award, d = l.slot === 0 ? l.listening : l.root, L = p != null && p.cls && Tc(p.cls) ? Co(p.cls) : null, W = !!p && !!L && !!d && ["ready", "fund", "over"].includes(l.step) && !(p.state === "unavailable" && p.number === void 0);
    if (u.hidden = !W, !W || !p || !L || !d) {
      u.replaceChildren();
      return;
    }
    const le = JSON.stringify([p, d, !!l.busy]);
    if (u.getAttribute("data-sig") === le) return;
    u.setAttribute("data-sig", le);
    const he = (Re) => {
      const _e = k("p", "", "ppp-award__h");
      return _e.append(k("b", `${L.mark} Music Hero award`), k("span", Re)), _e;
    }, xe = `No. ${String(p.number ?? 0).padStart(4, "0")}`, xt = (Re) => {
      const _e = k("div", "", "ppp-award__art"), wt = document.createElement("iframe");
      return wt.src = Re, wt.title = `${L.name} record`, wt.setAttribute("sandbox", "allow-scripts"), wt.setAttribute("loading", "lazy"), _e.append(wt), _e;
    }, Ge = [];
    if (p.state === "claimed") {
      if (Ge.push(he(`${L.name} record · ${xe}`)), p.inscription !== void 0 && Ge.push(xt(`/i/${p.inscription}`)), Ge.push(k("p", p.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : p.holds === null || p.holds === void 0 ? `Yours: Xtrata inscription #${p.inscription}.` : `Yours for good: Xtrata inscription #${p.inscription}. It gives your player its ${L.name} colours.`, p.holds === !1 ? "ppp-mute" : "ppp-ok")), p.inscription !== void 0) {
        const Re = k("p");
        Re.append(Le("Open it full screen ↗", `/i/${p.inscription}`)), Ge.push(Re);
      }
      if (p.sendTx) {
        const Re = k("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Re.append(Le("View", be(p.sendTx))), Ge.push(Re);
      } else if (p.holds === !0 && p.inscription !== void 0) {
        const Re = k("details", "", "ppp-award__send"), _e = document.createElement("input");
        _e.type = "text", _e.placeholder = "SP… address to send it to", _e.autocomplete = "off", _e.spellcheck = !1, _e.setAttribute("aria-label", "Address to send your record to");
        const wt = we("Send my record…", () => void c.sendAward(_e.value), "");
        wt.disabled = !!l.busy, Re.append(
          k("summary", "Send this record to someone"),
          k("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          _e,
          wt
        ), Ge.push(Re);
      }
    } else if (p.claimTx) {
      Ge.push(he(`${L.name} record · ${xe}`));
      const Re = k("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Re.append(Le("View", be(p.claimTx))), Ge.push(Re);
    } else if (p.state === "ready") {
      Ge.push(he(`${L.name} record · ${xe}`));
      const Re = typeof p.name == "string" && p.name ? p.name : null, _e = new URLSearchParams({ n: String(p.number), a: d, ...Re ? { b: Re } : {}, p: String(p.need), s: Rg(ag, p.number, d) });
      Ge.push(xt(`/awards/${L.id}#${_e}`)), Ge.push(k("p", `Your ${L.name} record is ready. You have paid artists for ${(Ke = p.need) == null ? void 0 : Ke.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const wt = k("div", "", "ppp-award__row");
      Re ? (Ge.push(k("p", `Its plaque will carry ${Re} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), wt.append(we("Claim my record", () => {
        N = !0, c.claimAward("auto");
      }, "primary"), we("Use my address only", () => {
        N = !0, c.claimAward("none");
      }, "quiet"))) : p.name === null ? (Ge.push(k("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), wt.append(we("Claim my record", () => {
        N = !0, c.claimAward("none");
      }, "primary"), we("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (Ge.push(k("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), wt.append(we("Check for a name again", () => void c.awardRefresh(), "primary"), we("Claim with my address only", () => void c.claimAward("none"), "quiet"))), wt.querySelectorAll("button").forEach((ln) => {
        ln.disabled = !!l.busy;
      }), Ge.push(wt, k("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (p.state === "earning" && p.have !== void 0 && p.need) {
      Ge.push(he(`${p.have.toLocaleString()} of ${p.need.toLocaleString()} paid plays`));
      const Re = k("div", "", "ppp-award__bar"), _e = document.createElement("i");
      _e.style.width = `${Math.min(100, Math.round(p.have / p.need * 100))}%`, Re.append(_e);
      const wt = p.need - p.have;
      Ge.push(Re, k("p", `${wt.toLocaleString()} more ${wt === 1 ? "play" : "plays"} and your ${L.name} record is yours to claim.`, "ppp-mute"));
    } else
      Ge.push(he(`${L.name} record · ${xe}`)), Ge.push(k("p", p.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : p.state === "class-full" || p.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    u.replaceChildren(...Ge);
  }
  function ui(l, u) {
    var he;
    const p = document.querySelector(".ppp-skin");
    if (!p) return;
    if (!u && (V != null && V.showing()) && ((he = l.award) != null && he.cls) && Tc(l.award.cls) && (l.busy || l.armed)) {
      const xe = Co(l.award.cls), xt = k("span", "", "ppp-skin__t");
      xt.append(k("b", `${xe.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), k("span", "Xtrata Music Hero")), p.hidden = !1, p.replaceChildren(k("span", xe.mark, "ppp-skin__art ppp-skin__art--none"), xt);
      return;
    }
    const d = !!u && (!!l.busy || l.armed);
    if (p.hidden = !d, !d || !u) {
      p.replaceChildren();
      return;
    }
    const L = Gc(u.player.cover), W = L ? k("img", "", "ppp-skin__art") : k("span", "♪", "ppp-skin__art ppp-skin__art--none");
    L && (W.src = L, W.alt = "");
    const le = k("span", "", "ppp-skin__t");
    le.append(k("b", u.player.title), k("span", u.mode === "arrive" && u.from ? `A gift from ${u.from}` : u.player.subtitle || "Your album")), p.replaceChildren(W, le);
  }
  function us(l, u, p) {
    var xe, xt, Ge, Ke, Re;
    const d = !!l.busy || l.armed, L = [...p];
    l.depositPending && l.arrival && L.push(Ut(l.arrival)), l.error ? L.push(k("p", l.error, l.error === bl ? "ppp-warn" : "ppp-bad")) : l.message && !d ? L.push(k("p", l.message, "ppp-cyan")) : l.notice && L.push(k("p", l.notice, "ppp-warn")), u.mode === "open" && Sr && ((xe = l.likeFunds) != null && xe.album) && l.likeFunds.low && !l.likeFunds.pending && L.push(k("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let W = "Kept on this device with Face ID or your passkey. No app or account needed.", le = null, he = null;
    if (u.mode === "locked")
      le = { label: "Continue listening", run: () => {
        je = bt(), c.unlock();
      } }, he = { label: "Use a different passkey", run: () => {
        je = null, c.unlock(!0);
      } };
    else if (u.mode === "arrive")
      if (l.step === "intro" && _c(vt) && vt.album === u.player.id) {
        const _e = window.XtrataRadio, wt = Pr(u.player)[0], ln = vt.phase === "playing";
        le = { label: ln && !!((Ge = (xt = _e == null ? void 0 : _e.getState) == null ? void 0 : xt.call(_e)) != null && Ge.playing) ? "Pause" : ln ? "Carry on" : "Play the first song", run: () => {
          var Ls, ds;
          ln ? (Ls = _e == null ? void 0 : _e.playPause) == null || Ls.call(_e) : wt && ((ds = _e == null ? void 0 : _e.playToken) == null || ds.call(_e, wt.id));
        } }, he = { label: "Make my player and hear it all", run: () => void c.create() }, W = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const _e = vt.phase === "done" && vt.album === u.player.id;
        _e && !L.length && L.push(k("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), le = { label: _e ? "Keep listening" : "Open album", run: () => void c.create() }, he = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (le = { label: "Open album", run: () => void c.unlock() }, he = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? L.push(k("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : L.length || L.push(k("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: u.mode,
      player: u.player,
      from: u.from,
      offered: u.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: u.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: u.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: L,
      primary: le,
      secondary: he,
      hint: le ? W : void 0,
      asking: d,
      busy: !!l.busy,
      myPlays: Ar(l),
      topUps: zc,
      canMake: !!((Re = (Ke = l.gate) == null ? void 0 : Ke.gifts) != null && Re.admin)
    };
  }
  const Gn = document.getElementById("findBox"), b = document.getElementById("findBody"), A = Gn && b ? cC(b, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => oC(l == null ? void 0 : l.tracks, (u, p) => ({ title: mg(u, fo(p.title) ? "" : p.title), artist: yg(u, p.artist || "") }))),
    play: (l) => {
      var u, p;
      (p = (u = window.XtrataRadio) == null ? void 0 : u.playToken) == null || p.call(u, l);
    },
    current: () => {
      var u, p, d, L;
      const l = Number((L = (d = (p = (u = window.XtrataRadio) == null ? void 0 : u.getState) == null ? void 0 : p.call(u)) == null ? void 0 : d.nowPlaying) == null ? void 0 : L.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var u, p;
      return !!((p = (u = window.XtrataRadio) == null ? void 0 : u.isExplicit) != null && p.call(u, l));
    },
    liked: (l) => Z().has(l)
  }) : null;
  Gn == null || Gn.addEventListener("toggle", () => {
    Gn.open && (A == null || A.load());
  });
  let R = "";
  const Z = () => {
    var u, p, d;
    const l = (d = (p = (u = window.XtrataRadio) == null ? void 0 : u.getState) == null ? void 0 : p.call(u)) == null ? void 0 : d.likes;
    return new Set(Array.isArray(l) ? l.map((L) => Number(L == null ? void 0 : L.tokenId)).filter(Number.isSafeInteger) : []);
  }, ke = () => {
    var u, p, d, L, W;
    if (!A || !(Gn != null && Gn.open)) return;
    const l = `${!!((u = c.snapshot().albumLock) != null && u.locked)}|${((W = (L = (d = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : d.call(p)) == null ? void 0 : L.nowPlaying) == null ? void 0 : W.tokenId) ?? ""}|${[...Z()].sort((le, he) => le - he).join(",")}`;
    l !== R && (R = l, A.refresh());
  }, G = /* @__PURE__ */ new Map();
  let ve = !1;
  const me = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((u) => {
      const p = u == null ? void 0 : u.nowPlaying;
      if (p && Number.isSafeInteger(Number(p.tokenId)) && G.set(Number(p.tokenId), { title: p.title || void 0, artist: p.artist || void 0 }), ke(), D) {
        const d = `${(p == null ? void 0 : p.tokenId) ?? ""}|${!!(u != null && u.playing)}`;
        d !== ye && (ye = d, ct(c.snapshot()));
      }
      if (_c(vt)) {
        const d = !!(u != null && u.playing);
        an({ kind: "now", track: p && p.tokenId != null ? String(p.tokenId) : null, playing: d, at: Date.now() }), d !== ve && (ve = d, ct(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!me()) {
    const l = setInterval(() => {
      me() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const u = l.detail;
    if (_c(vt) && an({ kind: "listened", at: Date.now() }), u && Number.isSafeInteger(u.song) && typeof u.id == "string" && /^[0-9a-f]{32}$/.test(u.id)) {
      Fn();
      const p = ks(u.song, G.get(u.song));
      c.onListened({ song: u.song, id: u.id, title: p.title || void 0, artist: p.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const hC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", pC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", o = t.userAgent.includes("Edge"), s = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return s ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && o === !1 && i === !1;
}, gC = () => pC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, yC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, wC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Nb = class {
  constructor(e) {
    L4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Yv(e), this.callback(Ol(e));
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
    var r, o, s, i, a, c, f, g, h, w;
    return n === "IOS" ? (o = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Chrome" ? (i = (s = e.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (g = (f = e.googlePlayStoreUrl) !== null && f !== void 0 ? f : this.getBrowserUrl(e)) !== null && g !== void 0 ? g : e.webUrl : (w = (h = this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = gC(), t = yC(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((i) => i.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, o = n.length > 0;
    return Ve("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Ve("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Ve("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Ve("div", { class: "flex flex-col space-y-[10px]" }, Ve("div", { class: "flex items-center" }, Ve("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Ve("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Ve("span", { class: "sr-only" }, "Close popup"), Ve("img", { src: hC }))), r ? Ve("p", null, "Select the wallet you want to connect to.") : Ve("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Ve("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Ve("div", { class: "mt-6" }, Ve("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Ve("ul", { class: "space-y-3" }, this.installedProviders.map((s) => Ve("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ve("div", { class: "aspect-square basis-9 overflow-hidden" }, Ve("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ve("div", { class: "flex-1" }, Ve("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Ve("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), Ve("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), o && Ve("div", { class: "mt-6" }, r ? Ve("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Ve("div", { class: "mb-5 flex justify-between" }, Ve("p", { class: "text-sm font-medium" }, "Recommended wallets"), Ve("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Ve("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Ve("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Ve("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Ve("p", null, "What is a wallet? ", Ve("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Ve("ul", { class: "space-y-3" }, n.map((s) => Ve("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ve("div", { class: "aspect-square basis-9 overflow-hidden" }, Ve("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ve("div", { class: "flex-1" }, Ve("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Ve("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, e, t) && Ve("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, e, t), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return l4(this);
  }
};
Nb.style = wC;
const mC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Nb
}, Symbol.toStringTag, { value: "Module" }));
