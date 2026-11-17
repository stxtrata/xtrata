var Fb = Object.defineProperty;
var jb = (e, t, n) => t in e ? Fb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var da = (e, t, n) => jb(e, typeof t != "symbol" ? t + "" : t, n);
var Hn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function qg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Ll(e) {
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
      function c(m) {
        if (typeof m != "string" && (m = String(m)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(m) || m === "")
          throw new TypeError('Invalid character in header field name: "' + m + '"');
        return m.toLowerCase();
      }
      function l(m) {
        return typeof m != "string" && (m = String(m)), m;
      }
      function u(m) {
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
      function p(m) {
        this.map = {}, m instanceof p ? m.forEach(function(I, N) {
          this.append(N, I);
        }, this) : Array.isArray(m) ? m.forEach(function(I) {
          if (I.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + I.length);
          this.append(I[0], I[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(I) {
          this.append(I, m[I]);
        }, this);
      }
      p.prototype.append = function(m, I) {
        m = c(m), I = l(I);
        var N = this.map[m];
        this.map[m] = N ? N + ", " + I : I;
      }, p.prototype.delete = function(m) {
        delete this.map[c(m)];
      }, p.prototype.get = function(m) {
        return m = c(m), this.has(m) ? this.map[m] : null;
      }, p.prototype.has = function(m) {
        return this.map.hasOwnProperty(c(m));
      }, p.prototype.set = function(m, I) {
        this.map[c(m)] = l(I);
      }, p.prototype.forEach = function(m, I) {
        for (var N in this.map)
          this.map.hasOwnProperty(N) && m.call(I, this.map[N], N, this);
      }, p.prototype.keys = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push(N);
        }), u(m);
      }, p.prototype.values = function() {
        var m = [];
        return this.forEach(function(I) {
          m.push(I);
        }), u(m);
      }, p.prototype.entries = function() {
        var m = [];
        return this.forEach(function(I, N) {
          m.push([N, I]);
        }), u(m);
      }, r.iterable && (p.prototype[Symbol.iterator] = p.prototype.entries);
      function d(m) {
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
      function v(m) {
        var I = new FileReader(), N = w(I), M = /charset=([A-Za-z0-9_-]+)/.exec(m.type), Y = M ? M[1] : "utf-8";
        return I.readAsText(m, Y), N;
      }
      function x(m) {
        for (var I = new Uint8Array(m), N = new Array(I.length), M = 0; M < I.length; M++)
          N[M] = String.fromCharCode(I[M]);
        return N.join("");
      }
      function L(m) {
        if (m.slice)
          return m.slice(0);
        var I = new Uint8Array(m.byteLength);
        return I.set(new Uint8Array(m)), I.buffer;
      }
      function B() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && o(m) ? (this._bodyArrayBuffer = L(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = L(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var m = d(this);
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
            var m = d(this);
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
          var m = d(this);
          if (m)
            return m;
          if (this._bodyBlob)
            return v(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(x(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(P);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(m) {
        var I = m.toUpperCase();
        return _.indexOf(I) > -1 ? I : m;
      }
      function T(m, I) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        I = I || {};
        var N = I.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, I.headers || (this.headers = new p(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !N && m._bodyInit != null && (N = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = I.credentials || this.credentials || "same-origin", (I.headers || !this.headers) && (this.headers = new p(I.headers)), this.method = A(I.method || this.method || "GET"), this.mode = I.mode || this.mode || null, this.signal = I.signal || this.signal || function() {
          if ("AbortController" in n) {
            var j = new AbortController();
            return j.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && N)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(N), (this.method === "GET" || this.method === "HEAD") && (I.cache === "no-store" || I.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Y = /\?/;
            this.url += (Y.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function P(m) {
        var I = new FormData();
        return m.trim().split("&").forEach(function(N) {
          if (N) {
            var M = N.split("="), Y = M.shift().replace(/\+/g, " "), j = M.join("=").replace(/\+/g, " ");
            I.append(decodeURIComponent(Y), decodeURIComponent(j));
          }
        }), I;
      }
      function K(m) {
        var I = new p(), N = m.replace(/\r?\n[\t ]+/g, " ");
        return N.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var Y = M.split(":"), j = Y.shift().trim();
          if (j) {
            var ae = Y.join(":").trim();
            try {
              I.append(j, ae);
            } catch (ce) {
              console.warn("Response " + ce.message);
            }
          }
        }), I;
      }
      B.call(T.prototype);
      function ie(m, I) {
        if (!(this instanceof ie))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (I || (I = {}), this.type = "default", this.status = I.status === void 0 ? 200 : I.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = I.statusText === void 0 ? "" : "" + I.statusText, this.headers = new p(I.headers), this.url = I.url || "", this._initBody(m);
      }
      B.call(ie.prototype), ie.prototype.clone = function() {
        return new ie(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new p(this.headers),
          url: this.url
        });
      }, ie.error = function() {
        var m = new ie(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var ee = [301, 302, 303, 307, 308];
      ie.redirect = function(m, I) {
        if (ee.indexOf(I) === -1)
          throw new RangeError("Invalid status code");
        return new ie(null, { status: I, headers: { location: m } });
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
      function X(m, I) {
        return new Promise(function(N, M) {
          var Y = new T(m, I);
          if (Y.signal && Y.signal.aborted)
            return M(new t.DOMException("Aborted", "AbortError"));
          var j = new XMLHttpRequest();
          function ae() {
            j.abort();
          }
          j.onload = function() {
            var C = {
              statusText: j.statusText,
              headers: K(j.getAllResponseHeaders() || "")
            };
            Y.url.indexOf("file://") === 0 && (j.status < 200 || j.status > 599) ? C.status = 200 : C.status = j.status, C.url = "responseURL" in j ? j.responseURL : C.headers.get("X-Request-URL");
            var F = "response" in j ? j.response : j.responseText;
            setTimeout(function() {
              N(new ie(F, C));
            }, 0);
          }, j.onerror = function() {
            setTimeout(function() {
              M(new TypeError("Network request failed"));
            }, 0);
          }, j.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, j.onabort = function() {
            setTimeout(function() {
              M(new t.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function ce(C) {
            try {
              return C === "" && n.location.href ? n.location.href : C;
            } catch {
              return C;
            }
          }
          if (j.open(Y.method, ce(Y.url), !0), Y.credentials === "include" ? j.withCredentials = !0 : Y.credentials === "omit" && (j.withCredentials = !1), "responseType" in j && (r.blob ? j.responseType = "blob" : r.arrayBuffer && (j.responseType = "arraybuffer")), I && typeof I.headers == "object" && !(I.headers instanceof p || n.Headers && I.headers instanceof n.Headers)) {
            var Ke = [];
            Object.getOwnPropertyNames(I.headers).forEach(function(C) {
              Ke.push(c(C)), j.setRequestHeader(C, l(I.headers[C]));
            }), Y.headers.forEach(function(C, F) {
              Ke.indexOf(F) === -1 && j.setRequestHeader(F, C);
            });
          } else
            Y.headers.forEach(function(C, F) {
              j.setRequestHeader(F, C);
            });
          Y.signal && (Y.signal.addEventListener("abort", ae), j.onreadystatechange = function() {
            j.readyState === 4 && Y.signal.removeEventListener("abort", ae);
          }), j.send(typeof Y._bodyInit > "u" ? null : Y._bodyInit);
        });
      }
      return X.polyfill = !0, n.fetch || (n.fetch = X, n.Headers = p, n.Request = T, n.Response = ie), t.Headers = p, t.Request = T, t.Response = ie, t.fetch = X, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Hn);
})();
const Rb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function zb(e, t) {
  const n = {};
  return Object.assign(n, Rb, t), await fetch(e, n);
}
function Gb(e) {
  let t = zb, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Kb(...e) {
  const { fetchLib: t, middlewares: n } = Gb(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: t,
        ...i
      })) ?? i);
    let c = await t(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var Ui;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Ui || (Ui = {}));
var Oo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Oo || (Oo = {}));
var Qh;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Qh || (Qh = {}));
const Vb = "https://api.mainnet.hiro.so", Xb = "https://api.testnet.hiro.so", Yb = "http://localhost:3999", qb = ["mainnet", "testnet", "devnet", "mocknet"];
let Oi = class {
  constructor(t) {
    this.version = Oo.Mainnet, this.chainId = Ui.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Oo.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? Kb();
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
Oi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new Zu();
    case "testnet":
      return new Wb();
    case "devnet":
      return new Zb();
    case "mocknet":
      return new Wg();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${qb.join(", ")}`);
  }
};
Oi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Oi.fromName(e);
let Zu = class extends Oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Vb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Oo.Mainnet, this.chainId = Ui.Mainnet;
  }
}, Wb = class extends Oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Xb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Oo.Testnet, this.chainId = Ui.Testnet;
  }
}, Wg = class extends Oi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? Yb,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Oo.Testnet, this.chainId = Ui.Testnet;
  }
};
const Zb = Wg, Zg = "xtrata.wallet.bridge.v1", Jb = (e) => typeof e == "object" && e !== null && e.protocol === Zg, Qb = (e) => Jb(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", e1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class fa extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const ep = 12e4;
class t1 {
  constructor(t) {
    da(this, "pending", /* @__PURE__ */ new Map());
    da(this, "listenTarget");
    da(this, "closed", !1);
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
    da(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !Qb(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new fa("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new fa("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new fa("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const o = e1(), s = { protocol: Zg, kind: "request", id: o, method: t, params: n };
    return new Promise((i, c) => {
      const l = setTimeout(() => {
        this.pending.delete(o), c(
          new fa(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? ep}ms.`
          )
        );
      }, this.options.timeoutMs ?? ep);
      this.pending.set(o, { resolve: i, reject: c, timer: l }), r.postMessage(s, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new fa("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const n1 = ["SP", "SM"], r1 = ["ST", "SN"], s1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return n1.includes(n) ? "mainnet" : r1.includes(n) ? "testnet" : null;
}, o1 = () => {
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
}, i1 = () => typeof window > "u" || !window.localStorage ? o1() : window.localStorage, fu = "xtrata.v15.1.wallet.session", tp = "mainnet", Wc = { isConnected: !1 }, a1 = (e) => e.address ? s1(e.address) ?? e.network : e.network, Jg = (e) => !e.isConnected || !e.address ? { ...Wc } : a1(e) !== tp ? { ...Wc } : {
  isConnected: !0,
  address: e.address,
  network: tp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, c1 = (e) => {
  if (!e)
    return { ...Wc };
  try {
    const t = JSON.parse(e);
    return Jg(t);
  } catch {
    return { ...Wc };
  }
}, l1 = (e) => {
  const t = Jg(e);
  return JSON.stringify(t);
}, u1 = (e) => {
  const t = i1();
  return {
    load: () => c1(t.getItem(fu)),
    save: (n) => {
      t.setItem(fu, l1(n));
    },
    clear: () => {
      t.removeItem(fu);
    }
  };
}, d1 = "https://browser.blockstack.org/auth", f1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Qg = ["store_write"], h1 = "blockstack-session", p1 = {
  logLevel: "debug"
}, Qo = {
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
Object.freeze(Qo);
class ea extends Error {
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
class g1 extends ea {
  constructor(t, n = "") {
    super({ code: Qo.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class np extends ea {
  constructor(t = "") {
    super({ code: Qo.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class sc extends ea {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: Qo.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class rp extends ea {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: Qo.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class Ju extends ea {
  constructor(t) {
    super({ code: Qo.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class ey extends ea {
  constructor(t) {
    super({ code: Qo.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const sp = ["debug", "info", "warn", "error", "none"], Qu = {};
for (let e = 0; e < sp.length; e++) {
  const t = sp[e];
  Qu[t] = e;
}
class Ii {
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
    return Qu[p1.logLevel] <= Qu[t];
  }
}
function y1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function w1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function hu(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((o) => parseInt(o, 10)), r = t.split(".").map((o) => parseInt(o, 10));
  for (let o = 0; o < t.length; o++)
    if (o >= e.length && r.push(0), n[o] < r[o])
      return !1;
  return !0;
}
function m1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function b1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function x1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function af(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let o;
  try {
    if (o = b1(), o) {
      const s = o[e];
      if (s)
        return s;
    }
  } catch (s) {
    Ii.error(`Error getting object '${e}' from global scope '${o}': ${s}`);
  }
  if (t) {
    const s = x1(o, e.toString(), n);
    throw Ii.error(s), new Error(s);
  }
  if (r)
    return {};
}
function lo(e, t) {
  return cf(Mn(e), t);
}
function Mn(e) {
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
  if (Xn(e, Uint8Array))
    return BigInt(`0x${_e(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function S1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function op(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Ga(e, t = 8) {
  return (typeof e == "bigint" ? e : Mn(e)).toString(16).padStart(t * 2, "0");
}
function Cl(e) {
  return parseInt(e, 16);
}
function cf(e, t = 16) {
  const n = Ga(e, t);
  return yt(n);
}
function v1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function A1(e, t) {
  return e & BigInt(1) << t;
}
function ed(e) {
  return E1(BigInt(`0x${_e(e)}`), BigInt(e.byteLength * 8));
}
function E1(e, t) {
  return A1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const k1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function _e(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += k1[n];
  return t;
}
function yt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = S1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, o = e.slice(r, r + 2), s = Number.parseInt(o, 16);
    if (Number.isNaN(s) || s < 0)
      throw new Error("Invalid byte sequence");
    t[n] = s;
  }
  return t;
}
function ei(e) {
  return new TextEncoder().encode(e);
}
function Ka(e) {
  return new TextDecoder().decode(e);
}
function $1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function I1(e) {
  return String.fromCharCode.apply(null, e);
}
function L1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function ip(e) {
  if (e.some(L1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Jr(...e) {
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
  return Jr(...e.map((t) => typeof t == "number" ? ip([t]) : t instanceof Array ? ip(t) : t));
}
function Xn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const ty = "https://api.mainnet.hiro.so", ny = "https://api.testnet.hiro.so", ry = "http://localhost:3999", C1 = "https://hub.blockstack.org", T1 = 33, pu = 32;
function B1(e) {
  if (e.length < pu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + pu * 2), r = e.slice(2 + pu * 2);
  return {
    recoveryId: Cl(t),
    r: n,
    s: r
  };
}
function lf(e) {
  const t = typeof e == "string" ? yt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function N1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function M1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function P1(e, t) {
  return e[t];
}
function _1(e, t, n = 0) {
  return e[n] = t, e;
}
function U1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Ho(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const O1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function H1(e, t) {
  const n = {};
  return Object.assign(n, O1, t), await fetch(e, n);
}
function D1(e) {
  let t = H1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function F1(...e) {
  const { fetchLib: t, middlewares: n } = D1(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: t,
        ...i
      })) ?? i);
    let c = await t(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
class sy {
  constructor(t = Qg.slice(), n = ((c) => (c = af("location", { returnEmptyObject: !0 })) == null ? void 0 : c.origin)(), r = "", o = "/manifest.json", s = void 0, i = d1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = o, this.coreNode = s, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function td(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function j1(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function oy(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function R1(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  td(e.outputLen), td(e.blockLen);
}
function z1(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function G1(e, t) {
  oy(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Io = {
  number: td,
  bool: j1,
  bytes: oy,
  hash: R1,
  exists: z1,
  output: G1
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const gu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), jr = (e, t) => e << 32 - t | e >>> t, K1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!K1)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function V1(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function uf(e) {
  if (typeof e == "string" && (e = V1(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let iy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(e) {
  const t = (r) => e().update(uf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let ay = class extends iy {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Io.hash(t);
    const r = uf(n);
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
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: c } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Tl = (e, t, n) => new ay(e, t).update(n).digest();
Tl.create = (e, t) => new ay(e, t);
function X1(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), c = Number(n & s), l = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + l, i, r), e.setUint32(t + u, c, r);
}
let df = class extends iy {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = gu(this.buffer);
  }
  update(t) {
    Io.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = uf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const c = Math.min(o - this.pos, s - i);
      if (c === o) {
        const l = gu(t);
        for (; o <= s - i; i += o)
          this.process(l, i);
        continue;
      }
      r.set(t.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Io.exists(this), Io.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    X1(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = gu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, p = this.get();
    if (u > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      c.setUint32(4 * d, p[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: c } = this;
    return t.length = o, t.pos = c, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const Y1 = (e, t, n) => e & t ^ ~e & n, q1 = (e, t, n) => e & t ^ e & n ^ t & n, W1 = new Uint32Array([
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
]), Bs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ns = new Uint32Array(64);
let cy = class extends df {
  constructor() {
    super(64, 32, 8, !1), this.A = Bs[0] | 0, this.B = Bs[1] | 0, this.C = Bs[2] | 0, this.D = Bs[3] | 0, this.E = Bs[4] | 0, this.F = Bs[5] | 0, this.G = Bs[6] | 0, this.H = Bs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: c, H: l } = this;
    return [t, n, r, o, s, i, c, l];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ns[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Ns[d - 15], y = Ns[d - 2], v = jr(w, 7) ^ jr(w, 18) ^ w >>> 3, x = jr(y, 17) ^ jr(y, 19) ^ y >>> 10;
      Ns[d] = x + Ns[d - 7] + v + Ns[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: c, F: l, G: u, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const w = jr(c, 6) ^ jr(c, 11) ^ jr(c, 25), y = p + w + Y1(c, l, u) + W1[d] + Ns[d] | 0, x = (jr(r, 2) ^ jr(r, 13) ^ jr(r, 22)) + q1(r, o, s) | 0;
      p = u, u = l, l = c, c = i + y | 0, i = s, s = o, o = r, r = y + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, p = p + this.H | 0, this.set(r, o, s, i, c, l, u, p);
  }
  roundClean() {
    Ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Z1 = class extends cy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Hi = ti(() => new cy());
ti(() => new Z1());
const J1 = {}, ly = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: J1
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const ht = BigInt(0), Ft = BigInt(1), so = BigInt(2), Ea = BigInt(3), ap = BigInt(8), Lt = Object.freeze({
  a: ht,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Ft,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), cp = (e, t) => (e + t / so) / t, oc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Lt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Ft * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), s = n, i = BigInt("0x100000000000000000000000000000000"), c = cp(s * e, t), l = cp(-r * e, t);
    let u = ge(e - c * n - l * o, t), p = ge(-c * r - l * s, t);
    const d = u > i, w = p > i;
    if (d && (u = t - u), w && (p = t - p), u > i || p > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: p };
  }
}, Br = 32, Do = 32, uy = 32, Zc = Br + 1, Jc = 2 * Br + 1;
function lp(e) {
  const { a: t, b: n } = Lt, r = ge(e * e), o = ge(r * e);
  return ge(o + t * e + n);
}
const ic = Lt.a === ht;
class ff extends Error {
  constructor(t) {
    super(t);
  }
}
function up(e) {
  if (!(e instanceof xt))
    throw new TypeError("JacobianPoint expected");
}
class xt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof ot))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(ot.ZERO) ? xt.ZERO : new xt(t.x, t.y, Ft);
  }
  static toAffineBatch(t) {
    const n = r2(t.map((r) => r.z));
    return t.map((r, o) => r.toAffine(n[o]));
  }
  static normalizeZ(t) {
    return xt.toAffineBatch(t).map(xt.fromAffine);
  }
  equals(t) {
    up(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: c } = t, l = ge(o * o), u = ge(c * c), p = ge(n * u), d = ge(s * l), w = ge(ge(r * c) * u), y = ge(ge(i * o) * l);
    return p === d && w === y;
  }
  negate() {
    return new xt(this.x, ge(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, o = ge(t * t), s = ge(n * n), i = ge(s * s), c = t + s, l = ge(so * (ge(c * c) - o - i)), u = ge(Ea * o), p = ge(u * u), d = ge(p - so * l), w = ge(u * (l - d) - ap * i), y = ge(so * n * r);
    return new xt(d, w, y);
  }
  add(t) {
    up(t);
    const { x: n, y: r, z: o } = this, { x: s, y: i, z: c } = t;
    if (s === ht || i === ht)
      return this;
    if (n === ht || r === ht)
      return t;
    const l = ge(o * o), u = ge(c * c), p = ge(n * u), d = ge(s * l), w = ge(ge(r * c) * u), y = ge(ge(i * o) * l), v = ge(d - p), x = ge(y - w);
    if (v === ht)
      return x === ht ? this.double() : xt.ZERO;
    const L = ge(v * v), B = ge(v * L), _ = ge(p * L), A = ge(x * x - B - so * _), T = ge(x * (_ - A) - w * B), P = ge(o * c * v);
    return new xt(A, T, P);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = xt.ZERO;
    if (typeof t == "bigint" && t === ht)
      return n;
    let r = hp(t);
    if (r === Ft)
      return this;
    if (!ic) {
      let d = n, w = this;
      for (; r > ht; )
        r & Ft && (d = d.add(w)), w = w.double(), r >>= Ft;
      return d;
    }
    let { k1neg: o, k1: s, k2neg: i, k2: c } = oc.splitScalar(r), l = n, u = n, p = this;
    for (; s > ht || c > ht; )
      s & Ft && (l = l.add(p)), c & Ft && (u = u.add(p)), p = p.double(), s >>= Ft, c >>= Ft;
    return o && (l = l.negate()), i && (u = u.negate()), u = new xt(ge(u.x * oc.beta), u.y, u.z), l.add(u);
  }
  precomputeWindow(t) {
    const n = ic ? 128 / t + 1 : 256 / t + 1, r = [];
    let o = this, s = o;
    for (let i = 0; i < n; i++) {
      s = o, r.push(s);
      for (let c = 1; c < 2 ** (t - 1); c++)
        s = s.add(o), r.push(s);
      o = s.double();
    }
    return r;
  }
  wNAF(t, n) {
    !n && this.equals(xt.BASE) && (n = ot.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let o = n && nd.get(n);
    o || (o = this.precomputeWindow(r), n && r !== 1 && (o = xt.normalizeZ(o), nd.set(n, o)));
    let s = xt.ZERO, i = xt.BASE;
    const c = 1 + (ic ? 128 / r : 256 / r), l = 2 ** (r - 1), u = BigInt(2 ** r - 1), p = 2 ** r, d = BigInt(r);
    for (let w = 0; w < c; w++) {
      const y = w * l;
      let v = Number(t & u);
      t >>= d, v > l && (v -= p, t += Ft);
      const x = y, L = y + Math.abs(v) - 1, B = w % 2 !== 0, _ = v < 0;
      v === 0 ? i = i.add(ac(B, o[x])) : s = s.add(ac(_, o[L]));
    }
    return { p: s, f: i };
  }
  multiply(t, n) {
    let r = hp(t), o, s;
    if (ic) {
      const { k1neg: i, k1: c, k2neg: l, k2: u } = oc.splitScalar(r);
      let { p, f: d } = this.wNAF(c, n), { p: w, f: y } = this.wNAF(u, n);
      p = ac(i, p), w = ac(l, w), w = new xt(ge(w.x * oc.beta), w.y, w.z), o = p.add(w), s = d.add(y);
    } else {
      const { p: i, f: c } = this.wNAF(r, n);
      o = i, s = c;
    }
    return xt.normalizeZ([o, s])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: o } = this, s = this.equals(xt.ZERO);
    t == null && (t = s ? ap : ta(o));
    const i = t, c = ge(i * i), l = ge(c * i), u = ge(n * c), p = ge(r * l), d = ge(o * i);
    if (s)
      return ot.ZERO;
    if (d !== Ft)
      throw new Error("invZ was invalid");
    return new ot(u, p);
  }
}
xt.BASE = new xt(Lt.Gx, Lt.Gy, Ft);
xt.ZERO = new xt(ht, Ft, ht);
function ac(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const nd = /* @__PURE__ */ new WeakMap();
class ot {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, nd.delete(this);
  }
  hasEvenY() {
    return this.y % so === ht;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = lr(n ? t : t.subarray(1));
    if (!Dc(r))
      throw new Error("Point is not on curve");
    const o = lp(r);
    let s = n2(o);
    const i = (s & Ft) === Ft;
    n ? i && (s = ge(-s)) : (t[0] & 1) === 1 !== i && (s = ge(-s));
    const c = new ot(r, s);
    return c.assertValidity(), c;
  }
  static fromUncompressedHex(t) {
    const n = lr(t.subarray(1, Br + 1)), r = lr(t.subarray(Br + 1, Br * 2 + 1)), o = new ot(n, r);
    return o.assertValidity(), o;
  }
  static fromHex(t) {
    const n = Qr(t), r = n.length, o = n[0];
    if (r === Br)
      return this.fromCompressedHex(n);
    if (r === Zc && (o === 2 || o === 3))
      return this.fromCompressedHex(n);
    if (r === Jc && o === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Zc} compressed bytes or ${Jc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return ot.BASE.multiply(Fo(t));
  }
  static fromSignature(t, n, r) {
    const { r: o, s } = hy(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = hf(Qr(t)), { n: c } = Lt, l = r === 2 || r === 3 ? o + c : o, u = ta(l, c), p = ge(-i * u, c), d = ge(s * u, c), w = r & 1 ? "03" : "02", y = ot.fromHex(w + oo(l)), v = ot.BASE.multiplyAndAddUnsafe(y, p, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return io(this.toHex(t));
  }
  toHex(t = !1) {
    const n = oo(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${oo(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Dc(n) || !Dc(r))
      throw new Error(t);
    const o = ge(r * r), s = lp(n);
    if (ge(o - s) !== ht)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new ot(this.x, ge(-this.y));
  }
  double() {
    return xt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return xt.fromAffine(this).add(xt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return xt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const o = xt.fromAffine(this), s = n === ht || n === Ft || this !== ot.BASE ? o.multiplyUnsafe(n) : o.multiply(n), i = xt.fromAffine(t).multiplyUnsafe(r), c = s.add(i);
    return c.equals(xt.ZERO) ? void 0 : c.toAffine();
  }
}
ot.BASE = new ot(Lt.Gx, Lt.Gy);
ot.ZERO = new ot(ht, ht);
function dp(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function fp(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Di(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: lr(n), left: e.subarray(t + 2) };
}
function Q1(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Di(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = fp(e.subarray(2)), { data: r, left: o } = fp(n);
  if (o.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Di(o)}`);
  return { r: t, s: r };
}
class cr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const o = n ? Di(t) : t;
    if (o.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new cr(Qc(o.slice(0, 64)), Qc(o.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s: o } = Q1(n ? t : io(t));
    return new cr(r, o);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!ji(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!ji(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Lt.n >> Ft;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new cr(this.r, ge(-this.s, Lt.n)) : this;
  }
  toDERRawBytes() {
    return io(this.toDERHex());
  }
  toDERHex() {
    const t = dp(ha(this.s)), n = dp(ha(this.r)), r = t.length / 2, o = n.length / 2, s = ha(r), i = ha(o);
    return `30${ha(o + r + 4)}02${i}${n}02${s}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return io(this.toCompactHex());
  }
  toCompactHex() {
    return oo(this.r) + oo(this.s);
  }
}
function no(...e) {
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
const e2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Di(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += e2[e[n]];
  return t;
}
const t2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function oo(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(ht <= e && e < t2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Fi(e) {
  const t = io(oo(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function ha(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function Qc(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function io(e) {
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
function lr(e) {
  return Qc(Di(e));
}
function Qr(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : io(e);
}
function hp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && ji(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function ge(e, t = Lt.P) {
  const n = e % t;
  return n >= ht ? n : t + n;
}
function pr(e, t) {
  const { P: n } = Lt;
  let r = e;
  for (; t-- > ht; )
    r *= r, r %= n;
  return r;
}
function n2(e) {
  const { P: t } = Lt, n = BigInt(6), r = BigInt(11), o = BigInt(22), s = BigInt(23), i = BigInt(44), c = BigInt(88), l = e * e * e % t, u = l * l * e % t, p = pr(u, Ea) * u % t, d = pr(p, Ea) * u % t, w = pr(d, so) * l % t, y = pr(w, r) * w % t, v = pr(y, o) * y % t, x = pr(v, i) * v % t, L = pr(x, c) * x % t, B = pr(L, i) * v % t, _ = pr(B, Ea) * u % t, A = pr(_, s) * y % t, T = pr(A, n) * l % t, P = pr(T, so);
  if (P * P % t !== e)
    throw new Error("Cannot find square root");
  return P;
}
function ta(e, t = Lt.P) {
  if (e === ht || t <= ht)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = ge(e, t), r = t, o = ht, s = Ft;
  for (; n !== ht; ) {
    const c = r / n, l = r % n, u = o - s * c;
    r = n, n = l, o = s, s = u;
  }
  if (r !== Ft)
    throw new Error("invert: does not exist");
  return ge(o, t);
}
function r2(e, t = Lt.P) {
  const n = new Array(e.length), r = e.reduce((s, i, c) => i === ht ? s : (n[c] = s, ge(s * i, t)), Ft), o = ta(r, t);
  return e.reduceRight((s, i, c) => i === ht ? s : (n[c] = ge(s * n[c], t), ge(s * i, t)), o), n;
}
function s2(e) {
  const t = e.length * 8 - Do * 8, n = lr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function hf(e, t = !1) {
  const n = s2(e);
  if (t)
    return n;
  const { n: r } = Lt;
  return n >= r ? n - r : n;
}
let Pi, ka;
class dy {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return Qt.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return ka(this.k, ...t);
  }
  checkSync() {
    if (typeof ka != "function")
      throw new ff("hmacSha256Sync needs to be set");
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
    return no(...n);
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
    return no(...n);
  }
}
function ji(e) {
  return ht < e && e < Lt.n;
}
function Dc(e) {
  return ht < e && e < Lt.P;
}
function fy(e, t, n, r = !0) {
  const { n: o } = Lt, s = hf(e, !0);
  if (!ji(s))
    return;
  const i = ta(s, o), c = ot.BASE.multiply(s), l = ge(c.x, o);
  if (l === ht)
    return;
  const u = ge(i * ge(t + n * l, o), o);
  if (u === ht)
    return;
  let p = new cr(l, u), d = (c.x === p.r ? 0 : 2) | Number(c.y & Ft);
  return r && p.hasHighS() && (p = p.normalizeS(), d ^= 1), { sig: p, recovery: d };
}
function Fo(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Do)
      throw new Error("Expected 32 bytes of private key");
    t = Qc(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Do)
      throw new Error("Expected 32 bytes of private key");
    t = lr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!ji(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function pf(e) {
  return e instanceof ot ? (e.assertValidity(), e) : ot.fromHex(e);
}
function hy(e) {
  if (e instanceof cr)
    return e.assertValidity(), e;
  try {
    return cr.fromDER(e);
  } catch {
    return cr.fromCompact(e);
  }
}
function Va(e, t = !1) {
  return ot.fromPrivateKey(e).toRawBytes(t);
}
function o2(e, t, n, r = !1) {
  return ot.fromSignature(e, t, n).toRawBytes(r);
}
function pp(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === Zc || r === Jc : n ? r === Zc * 2 || r === Jc * 2 : e instanceof ot;
}
function gf(e, t, n = !1) {
  if (pp(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!pp(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = pf(t);
  return r.assertValidity(), r.multiply(Fo(e)).toRawBytes(n);
}
function py(e) {
  const t = e.length > Br ? e.slice(0, Br) : e;
  return lr(t);
}
function i2(e) {
  const t = py(e), n = ge(t, Lt.n);
  return gy(n < ht ? t : n);
}
function gy(e) {
  return Fi(e);
}
function yy(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = Qr(e), o = Fo(t), s = [gy(o), i2(r)];
  if (n != null) {
    n === !0 && (n = Qt.randomBytes(Br));
    const l = Qr(n);
    if (l.length !== Br)
      throw new Error(`sign: Expected ${Br} bytes of extra data`);
    s.push(l);
  }
  const i = no(...s), c = py(r);
  return { seed: i, m: c, d: o };
}
function wy(e, t) {
  const { sig: n, recovery: r } = e, { der: o, recovered: s } = Object.assign({ canonical: !0, der: !0 }, t), i = o ? n.toDERRawBytes() : n.toCompactRawBytes();
  return s ? [i, r] : i;
}
async function a2(e, t, n = {}) {
  const { seed: r, m: o, d: s } = yy(e, t, n.extraEntropy), i = new dy(uy, Do);
  await i.reseed(r);
  let c;
  for (; !(c = fy(await i.generate(), o, s, n.canonical)); )
    await i.reseed();
  return wy(c, n);
}
function Bl(e, t, n = {}) {
  const { seed: r, m: o, d: s } = yy(e, t, n.extraEntropy), i = new dy(uy, Do);
  i.reseedSync(r);
  let c;
  for (; !(c = fy(i.generateSync(), o, s, n.canonical)); )
    i.reseedSync();
  return wy(c, n);
}
const c2 = { strict: !0 };
function l2(e, t, n, r = c2) {
  let o;
  try {
    o = hy(e), t = Qr(t);
  } catch {
    return !1;
  }
  const { r: s, s: i } = o;
  if (r.strict && o.hasHighS())
    return !1;
  const c = hf(t);
  let l;
  try {
    l = pf(n);
  } catch {
    return !1;
  }
  const { n: u } = Lt, p = ta(i, u), d = ge(c * p, u), w = ge(s * p, u), y = ot.BASE.multiplyAndAddUnsafe(l, d, w);
  return y ? ge(y.x, u) === s : !1;
}
function el(e) {
  return ge(lr(e), Lt.n);
}
class Ri {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = Qr(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = lr(n.subarray(0, 32)), o = lr(n.subarray(32, 64));
    return new Ri(r, o);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Dc(t) || !ji(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return oo(this.r) + oo(this.s);
  }
  toRawBytes() {
    return io(this.toHex());
  }
}
function u2(e) {
  return ot.fromPrivateKey(e).toRawX();
}
class my {
  constructor(t, n, r = Qt.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = Qr(t);
    const { x: o, scalar: s } = this.getScalar(Fo(n));
    if (this.px = o, this.d = s, this.rand = Qr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = ot.fromPrivateKey(t), r = n.hasEvenY() ? t : Lt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Fi(t ^ lr(n));
  }
  finalizeNonce(t) {
    const n = ge(lr(t), Lt.n);
    if (n === ht)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: o, scalar: s } = this.getScalar(n);
    return { R: r, rx: o, k: s };
  }
  finalizeSig(t, n, r, o) {
    return new Ri(t.x, ge(n + r * o, Lt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: o } = this, s = Qt.taggedHash, i = this.initNonce(n, await s(to.aux, o)), { R: c, rx: l, k: u } = this.finalizeNonce(await s(to.nonce, i, r, t)), p = el(await s(to.challenge, l, r, t)), d = this.finalizeSig(c, u, p, n);
    return await Sy(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: o } = this, s = Qt.taggedHashSync, i = this.initNonce(n, s(to.aux, o)), { R: c, rx: l, k: u } = this.finalizeNonce(s(to.nonce, i, r, t)), p = el(s(to.challenge, l, r, t)), d = this.finalizeSig(c, u, p, n);
    return vy(d, t, r) || this.error(), d;
  }
}
async function d2(e, t, n) {
  return new my(e, t, n).calc();
}
function f2(e, t, n) {
  return new my(e, t, n).calcSync();
}
function by(e, t, n) {
  const r = e instanceof Ri, o = r ? e : Ri.fromHex(e);
  return r && o.assertValidity(), {
    ...o,
    m: Qr(t),
    P: pf(n)
  };
}
function xy(e, t, n, r) {
  const o = ot.BASE.multiplyAndAddUnsafe(t, Fo(n), ge(-r, Lt.n));
  return !(!o || !o.hasEvenY() || o.x !== e);
}
async function Sy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = by(e, t, n), c = el(await Qt.taggedHash(to.challenge, Fi(r), i.toRawX(), s));
    return xy(r, i, o, c);
  } catch {
    return !1;
  }
}
function vy(e, t, n) {
  try {
    const { r, s: o, m: s, P: i } = by(e, t, n), c = el(Qt.taggedHashSync(to.challenge, Fi(r), i.toRawX(), s));
    return xy(r, i, o, c);
  } catch (r) {
    if (r instanceof ff)
      throw r;
    return !1;
  }
}
const h2 = {
  Signature: Ri,
  getPublicKey: u2,
  sign: d2,
  verify: Sy,
  signSync: f2,
  verifySync: vy
};
ot.BASE._setWindowSize(8);
const tr = {
  node: ly,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, to = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, cc = {}, Qt = {
  bytesToHex: Di,
  hexToBytes: io,
  concatBytes: no,
  mod: ge,
  invert: ta,
  isValidPrivateKey(e) {
    try {
      return Fo(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Fi,
  _normalizePrivateKey: Fo,
  hashToPrivateKey: (e) => {
    e = Qr(e);
    const t = Do + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = ge(lr(e), Lt.n - Ft) + Ft;
    return Fi(n);
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
  randomPrivateKey: () => Qt.hashToPrivateKey(Qt.randomBytes(Do + 8)),
  precompute(e = 8, t = ot.BASE) {
    const n = t === ot.BASE ? t : new ot(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Ea), n;
  },
  sha256: async (...e) => {
    if (tr.web) {
      const t = await tr.web.subtle.digest("SHA-256", no(...e));
      return new Uint8Array(t);
    } else if (tr.node) {
      const { createHash: t } = tr.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (tr.web) {
      const n = await tr.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = no(...t), o = await tr.web.subtle.sign("HMAC", n, r);
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
    let n = cc[e];
    if (n === void 0) {
      const r = await Qt.sha256(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = no(r, r), cc[e] = n;
    }
    return Qt.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Pi != "function")
      throw new ff("sha256Sync is undefined, you need to set it");
    let n = cc[e];
    if (n === void 0) {
      const r = Pi(Uint8Array.from(e, (o) => o.charCodeAt(0)));
      n = no(r, r), cc[e] = n;
    }
    return Pi(n, ...t);
  },
  _JacobianPoint: xt
};
Object.defineProperties(Qt, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Pi;
    },
    set(e) {
      Pi || (Pi = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return ka;
    },
    set(e) {
      ka || (ka = e);
    }
  }
});
const p2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Lt,
  Point: ot,
  Signature: cr,
  getPublicKey: Va,
  getSharedSecret: gf,
  recoverPublicKey: o2,
  schnorr: h2,
  sign: a2,
  signSync: Bl,
  utils: Qt,
  verify: l2
}, Symbol.toStringTag, { value: "Module" }));
var Xa = {};
Xa.byteLength = b2;
var g2 = Xa.toByteArray = S2, y2 = Xa.fromByteArray = E2, Vr = [], wr = [], w2 = typeof Uint8Array < "u" ? Uint8Array : Array, yu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var bi = 0, m2 = yu.length; bi < m2; ++bi)
  Vr[bi] = yu[bi], wr[yu.charCodeAt(bi)] = bi;
wr[45] = 62;
wr[95] = 63;
function Ay(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function b2(e) {
  var t = Ay(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function x2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function S2(e) {
  var t, n = Ay(e), r = n[0], o = n[1], s = new w2(x2(e, r, o)), i = 0, c = o > 0 ? r - 4 : r, l;
  for (l = 0; l < c; l += 4)
    t = wr[e.charCodeAt(l)] << 18 | wr[e.charCodeAt(l + 1)] << 12 | wr[e.charCodeAt(l + 2)] << 6 | wr[e.charCodeAt(l + 3)], s[i++] = t >> 16 & 255, s[i++] = t >> 8 & 255, s[i++] = t & 255;
  return o === 2 && (t = wr[e.charCodeAt(l)] << 2 | wr[e.charCodeAt(l + 1)] >> 4, s[i++] = t & 255), o === 1 && (t = wr[e.charCodeAt(l)] << 10 | wr[e.charCodeAt(l + 1)] << 4 | wr[e.charCodeAt(l + 2)] >> 2, s[i++] = t >> 8 & 255, s[i++] = t & 255), s;
}
function v2(e) {
  return Vr[e >> 18 & 63] + Vr[e >> 12 & 63] + Vr[e >> 6 & 63] + Vr[e & 63];
}
function A2(e, t, n) {
  for (var r, o = [], s = t; s < n; s += 3)
    r = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (e[s + 2] & 255), o.push(v2(r));
  return o.join("");
}
function E2(e) {
  for (var t, n = e.length, r = n % 3, o = [], s = 16383, i = 0, c = n - r; i < c; i += s)
    o.push(A2(e, i, i + s > c ? c : i + s));
  return r === 1 ? (t = e[n - 1], o.push(
    Vr[t >> 2] + Vr[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], o.push(
    Vr[t >> 10] + Vr[t >> 4 & 63] + Vr[t << 2 & 63] + "="
  )), o.join("");
}
function k2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const $2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function I2() {
  if (k2())
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
    throw new Error($2);
  }
}
class L2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createCipher(t, n, r), i = new Uint8Array(Jr(s.update(o), s.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, o) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const s = this.createDecipher(t, n, r), i = new Uint8Array(Jr(s.update(o), s.final()));
    return Promise.resolve(i);
  }
}
class C2 {
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
    const c = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["encrypt"]), l = await this.subtleCrypto.encrypt({ name: s, iv: r }, c, o);
    return new Uint8Array(l);
  }
  async decrypt(t, n, r, o) {
    let s, i;
    if (t === "aes-128-cbc")
      s = "AES-CBC", i = 128;
    else if (t === "aes-256-cbc")
      s = "AES-CBC", i = 256;
    else
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const c = await this.subtleCrypto.importKey("raw", n, { name: s, length: i }, !1, ["decrypt"]), l = await this.subtleCrypto.decrypt({ name: s, iv: r }, c, o);
    return new Uint8Array(l);
  }
}
async function Ey() {
  const e = await I2();
  return e.name === "subtleCrypto" ? new C2(e.lib) : new L2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function T2(e) {
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
  var i = e.length, c = e.charAt(0), l = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function p(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var v = 0, x = 0, L = 0, B = y.length; L !== B && y[L] === 0; )
      L++, v++;
    for (var _ = (B - L) * u + 1 >>> 0, A = new Uint8Array(_); L !== B; ) {
      for (var T = y[L], P = 0, K = _ - 1; (T !== 0 || P < x) && K !== -1; K--, P++)
        T += 256 * A[K] >>> 0, A[K] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = P, L++;
    }
    for (var ie = _ - x; ie !== _ && A[ie] === 0; )
      ie++;
    for (var ee = c.repeat(v); ie < _; ++ie)
      ee += e.charAt(A[ie]);
    return ee;
  }
  function d(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, L = 0; y[v] === c; )
      x++, v++;
    for (var B = (y.length - v) * l + 1 >>> 0, _ = new Uint8Array(B); y[v]; ) {
      var A = y.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var P = 0, K = B - 1; (T !== 0 || P < L) && K !== -1; K--, P++)
        T += i * _[K] >>> 0, _[K] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = P, v++;
    }
    for (var ie = B - L; ie !== B && _[ie] === 0; )
      ie++;
    for (var ee = new Uint8Array(x + (B - ie)), X = x; ie !== B; )
      ee[X++] = _[ie++];
    return ee;
  }
  function w(y) {
    var v = d(y);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: p,
    decodeUnsafe: d,
    decode: w
  };
}
var ky = T2;
const B2 = ky, N2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var M2 = B2(N2);
const P2 = /* @__PURE__ */ qg(M2), _2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), $y = Uint8Array.from({ length: 16 }, (e, t) => t), U2 = $y.map((e) => (9 * e + 5) % 16);
let yf = [$y], wf = [U2];
for (let e = 0; e < 4; e++)
  for (let t of [yf, wf])
    t.push(t[e].map((n) => _2[n]));
const Iy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), O2 = yf.map((e, t) => e.map((n) => Iy[t][n])), H2 = wf.map((e, t) => e.map((n) => Iy[t][n])), D2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), F2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), lc = (e, t) => e << t | e >>> 32 - t;
function gp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const uc = new Uint32Array(16);
let j2 = class extends df {
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
      uc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, c = this.h2 | 0, l = c, u = this.h3 | 0, p = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = D2[y], L = F2[y], B = yf[y], _ = wf[y], A = O2[y], T = H2[y];
      for (let P = 0; P < 16; P++) {
        const K = lc(r + gp(y, s, c, u) + uc[B[P]] + x, A[P]) + d | 0;
        r = d, d = u, u = lc(c, 10) | 0, c = s, s = K;
      }
      for (let P = 0; P < 16; P++) {
        const K = lc(o + gp(v, i, l, p) + uc[_[P]] + L, T[P]) + w | 0;
        o = w, w = p, p = lc(l, 10) | 0, l = i, i = K;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + l | 0);
  }
  roundClean() {
    uc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const R2 = ti(() => new j2());
function z2(e) {
  return R2(e);
}
const dc = BigInt(2 ** 32 - 1), rd = BigInt(32);
function Ly(e, t = !1) {
  return t ? { h: Number(e & dc), l: Number(e >> rd & dc) } : { h: Number(e >> rd & dc) | 0, l: Number(e & dc) | 0 };
}
function G2(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Ly(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const K2 = (e, t) => BigInt(e >>> 0) << rd | BigInt(t >>> 0), V2 = (e, t, n) => e >>> n, X2 = (e, t, n) => e << 32 - n | t >>> n, Y2 = (e, t, n) => e >>> n | t << 32 - n, q2 = (e, t, n) => e << 32 - n | t >>> n, W2 = (e, t, n) => e << 64 - n | t >>> n - 32, Z2 = (e, t, n) => e >>> n - 32 | t << 64 - n, J2 = (e, t) => t, Q2 = (e, t) => e, ex = (e, t, n) => e << n | t >>> 32 - n, tx = (e, t, n) => t << n | e >>> 32 - n, nx = (e, t, n) => t << n - 32 | e >>> 64 - n, rx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function sx(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const ox = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), ix = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, ax = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), cx = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, lx = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), ux = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Ze = {
  fromBig: Ly,
  split: G2,
  toBig: K2,
  shrSH: V2,
  shrSL: X2,
  rotrSH: Y2,
  rotrSL: q2,
  rotrBH: W2,
  rotrBL: Z2,
  rotr32H: J2,
  rotr32L: Q2,
  rotlSH: ex,
  rotlSL: tx,
  rotlBH: nx,
  rotlBL: rx,
  add: sx,
  add3L: ox,
  add3H: ix,
  add4L: ax,
  add4H: cx,
  add5H: ux,
  add5L: lx
}, [dx, fx] = Ze.split([
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
].map((e) => BigInt(e))), Ms = new Uint32Array(80), Ps = new Uint32Array(80);
let Nl = class extends df {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: c, Dl: l, Eh: u, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ms[A] = t.getUint32(n), Ps[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ms[A - 15] | 0, P = Ps[A - 15] | 0, K = Ze.rotrSH(T, P, 1) ^ Ze.rotrSH(T, P, 8) ^ Ze.shrSH(T, P, 7), ie = Ze.rotrSL(T, P, 1) ^ Ze.rotrSL(T, P, 8) ^ Ze.shrSL(T, P, 7), ee = Ms[A - 2] | 0, X = Ps[A - 2] | 0, m = Ze.rotrSH(ee, X, 19) ^ Ze.rotrBH(ee, X, 61) ^ Ze.shrSH(ee, X, 6), I = Ze.rotrSL(ee, X, 19) ^ Ze.rotrBL(ee, X, 61) ^ Ze.shrSL(ee, X, 6), N = Ze.add4L(ie, I, Ps[A - 7], Ps[A - 16]), M = Ze.add4H(N, K, m, Ms[A - 7], Ms[A - 16]);
      Ms[A] = M | 0, Ps[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: c, Cl: l, Dh: u, Dl: p, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: B, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = Ze.rotrSH(d, w, 14) ^ Ze.rotrSH(d, w, 18) ^ Ze.rotrBH(d, w, 41), P = Ze.rotrSL(d, w, 14) ^ Ze.rotrSL(d, w, 18) ^ Ze.rotrBL(d, w, 41), K = d & y ^ ~d & x, ie = w & v ^ ~w & L, ee = Ze.add5L(_, P, ie, fx[A], Ps[A]), X = Ze.add5H(ee, B, T, K, dx[A], Ms[A]), m = ee | 0, I = Ze.rotrSH(r, o, 28) ^ Ze.rotrBH(r, o, 34) ^ Ze.rotrBH(r, o, 39), N = Ze.rotrSL(r, o, 28) ^ Ze.rotrBL(r, o, 34) ^ Ze.rotrBL(r, o, 39), M = r & s ^ r & c ^ s & c, Y = o & i ^ o & l ^ i & l;
      B = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = Ze.add(u | 0, p | 0, X | 0, m | 0), u = c | 0, p = l | 0, c = s | 0, l = i | 0, s = r | 0, i = o | 0;
      const j = Ze.add3L(m, N, Y);
      r = Ze.add3H(j, X, I, M), o = j | 0;
    }
    ({ h: r, l: o } = Ze.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Ze.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: c, l } = Ze.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: u, l: p } = Ze.add(this.Dh | 0, this.Dl | 0, u | 0, p | 0), { h: d, l: w } = Ze.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = Ze.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = Ze.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: _ } = Ze.add(this.Hh | 0, this.Hl | 0, B | 0, _ | 0), this.set(r, o, s, i, c, l, u, p, d, w, y, v, x, L, B, _);
  }
  roundClean() {
    Ms.fill(0), Ps.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hx = class extends Nl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, px = class extends Nl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gx = class extends Nl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const yx = ti(() => new Nl());
ti(() => new hx());
ti(() => new px());
ti(() => new gx());
function Cy(e) {
  return Hi(e);
}
function wx(e) {
  return yx(e);
}
const mx = 0;
Qt.hmacSha256Sync = (e, ...t) => {
  const n = Tl.create(Hi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function bx() {
  return _e(Qt.randomPrivateKey());
}
function xx(e) {
  const t = Hi(Hi(e));
  return P2.encode(Jr(e, t).slice(0, e.length + 4));
}
function Sx(e, t) {
  return xx(Jr(new Uint8Array([e]), t.slice(0, 20)));
}
function Ty(e, t = mx) {
  const n = typeof e == "string" ? yt(e) : e, r = z2(Cy(n));
  return Sx(t, r);
}
function By(e) {
  const t = lf(e);
  return _e(Va(t.slice(0, 32), !0));
}
Qt.hmacSha256Sync = (e, ...t) => {
  const n = Tl.create(Hi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var tl;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(tl || (tl = {}));
async function vx(e, t, n) {
  return await (await Ey()).encrypt("aes-256-cbc", t, e, n);
}
async function Ax(e, t, n) {
  return await (await Ey()).decrypt("aes-256-cbc", t, e, n);
}
function Ny(e, t) {
  return Tl(Hi, e, t);
}
function Ex(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function My(e) {
  const t = wx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function kx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function $x(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: tl.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: tl.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !kx(e))
    return t;
  try {
    return ot.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Ix(e, t, n, r) {
  const o = $x(e);
  if (!o.result)
    throw o;
  const s = Qt.randomPrivateKey(), i = Va(s, !0);
  let c = gf(s, e, !0);
  c = c.slice(1);
  const l = My(c), u = Qt.randomBytes(16), p = await vx(u, l.encryptionKey, t), d = Jr(u, i, p), w = Ny(l.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = _e(p);
  else if (r === "base64")
    y = y2(p);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: _e(u),
    ephemeralPK: _e(i),
    cipherText: y,
    mac: _e(w),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function Py(e, t) {
  if (!t.ephemeralPK)
    throw new rp("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = gf(e, n, !0);
  r = r.slice(1);
  const o = My(r), s = yt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = yt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = g2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const c = Jr(s, yt(n), i), l = Ny(o.hmacKey, c), u = yt(t.mac);
  if (!Ex(u, l))
    throw new rp("Decryption failed: failure in MAC check");
  const p = await Ax(s, o.encryptionKey, i);
  return t.wasString ? Ka(p) : p;
}
function Lx(e, t) {
  const n = typeof t == "string" ? ei(t) : t, r = By(e), o = Cy(n), s = Bl(o, e);
  return {
    signature: _e(s),
    publicKey: r
  };
}
async function Cx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = By(n.privateKey);
  }
  const o = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", s = typeof e == "string" ? ei(e) : e, i = await Ix(n.publicKey, s, o, n.cipherTextEncoding);
  let c = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const l = Lx(r, c), u = {
      signature: l.signature,
      publicKey: l.publicKey,
      cipherText: c
    };
    c = JSON.stringify(u);
  }
  return c;
}
function Tx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Py(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var $n = {}, zi = {}, Un = {};
Object.defineProperty(Un, "__esModule", { value: !0 });
Un.decode = Un.encode = Un.unescape = Un.escape = Un.pad = void 0;
const _y = Xa;
function mf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Un.pad = mf;
function Uy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Un.escape = Uy;
function Oy(e) {
  return mf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Un.unescape = Oy;
function Bx(e) {
  return Uy((0, _y.fromByteArray)(new TextEncoder().encode(e)));
}
Un.encode = Bx;
function Nx(e) {
  return new TextDecoder().decode((0, _y.toByteArray)(mf(Oy(e))));
}
Un.decode = Nx;
var Ml = {}, Pl = {}, Hy = {}, Dy = {}, _l = {};
Object.defineProperty(_l, "__esModule", { value: !0 });
_l.crypto = void 0;
_l.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = o, e.ahash = s, e.aexists = i, e.aoutput = c, e.u8 = l, e.u32 = u, e.clean = p, e.createView = d, e.rotr = w, e.rotl = y, e.byteSwap = v, e.byteSwap32 = x, e.bytesToHex = _, e.hexToBytes = P, e.asyncLoop = ie, e.utf8ToBytes = ee, e.bytesToUtf8 = X, e.toBytes = m, e.kdfInputToBytes = I, e.concatBytes = N, e.checkOpts = M, e.createHasher = j, e.createOptHasher = ae, e.createXOFer = ce, e.randomBytes = Ke;
  const t = _l;
  function n(C) {
    return C instanceof Uint8Array || ArrayBuffer.isView(C) && C.constructor.name === "Uint8Array";
  }
  function r(C) {
    if (!Number.isSafeInteger(C) || C < 0)
      throw new Error("positive integer expected, got " + C);
  }
  function o(C, ...F) {
    if (!n(C))
      throw new Error("Uint8Array expected");
    if (F.length > 0 && !F.includes(C.length))
      throw new Error("Uint8Array expected of length " + F + ", got length=" + C.length);
  }
  function s(C) {
    if (typeof C != "function" || typeof C.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(C.outputLen), r(C.blockLen);
  }
  function i(C, F = !0) {
    if (C.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (F && C.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function c(C, F) {
    o(C);
    const te = F.outputLen;
    if (C.length < te)
      throw new Error("digestInto() expects output buffer of length at least " + te);
  }
  function l(C) {
    return new Uint8Array(C.buffer, C.byteOffset, C.byteLength);
  }
  function u(C) {
    return new Uint32Array(C.buffer, C.byteOffset, Math.floor(C.byteLength / 4));
  }
  function p(...C) {
    for (let F = 0; F < C.length; F++)
      C[F].fill(0);
  }
  function d(C) {
    return new DataView(C.buffer, C.byteOffset, C.byteLength);
  }
  function w(C, F) {
    return C << 32 - F | C >>> F;
  }
  function y(C, F) {
    return C << F | C >>> 32 - F >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(C) {
    return C << 24 & 4278190080 | C << 8 & 16711680 | C >>> 8 & 65280 | C >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? (C) => C : (C) => v(C), e.byteSwapIfBE = e.swap8IfBE;
  function x(C) {
    for (let F = 0; F < C.length; F++)
      C[F] = v(C[F]);
    return C;
  }
  e.swap32IfBE = e.isLE ? (C) => C : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", B = /* @__PURE__ */ Array.from({ length: 256 }, (C, F) => F.toString(16).padStart(2, "0"));
  function _(C) {
    if (o(C), L)
      return C.toHex();
    let F = "";
    for (let te = 0; te < C.length; te++)
      F += B[C[te]];
    return F;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T(C) {
    if (C >= A._0 && C <= A._9)
      return C - A._0;
    if (C >= A.A && C <= A.F)
      return C - (A.A - 10);
    if (C >= A.a && C <= A.f)
      return C - (A.a - 10);
  }
  function P(C) {
    if (typeof C != "string")
      throw new Error("hex string expected, got " + typeof C);
    if (L)
      return Uint8Array.fromHex(C);
    const F = C.length, te = F / 2;
    if (F % 2)
      throw new Error("hex string expected, got unpadded hex of length " + F);
    const le = new Uint8Array(te);
    for (let Ce = 0, Ne = 0; Ce < te; Ce++, Ne += 2) {
      const _t = T(C.charCodeAt(Ne)), je = T(C.charCodeAt(Ne + 1));
      if (_t === void 0 || je === void 0) {
        const Me = C[Ne] + C[Ne + 1];
        throw new Error('hex string expected, got non-hex character "' + Me + '" at index ' + Ne);
      }
      le[Ce] = _t * 16 + je;
    }
    return le;
  }
  const K = async () => {
  };
  e.nextTick = K;
  async function ie(C, F, te) {
    let le = Date.now();
    for (let Ce = 0; Ce < C; Ce++) {
      te(Ce);
      const Ne = Date.now() - le;
      Ne >= 0 && Ne < F || (await (0, e.nextTick)(), le += Ne);
    }
  }
  function ee(C) {
    if (typeof C != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(C));
  }
  function X(C) {
    return new TextDecoder().decode(C);
  }
  function m(C) {
    return typeof C == "string" && (C = ee(C)), o(C), C;
  }
  function I(C) {
    return typeof C == "string" && (C = ee(C)), o(C), C;
  }
  function N(...C) {
    let F = 0;
    for (let le = 0; le < C.length; le++) {
      const Ce = C[le];
      o(Ce), F += Ce.length;
    }
    const te = new Uint8Array(F);
    for (let le = 0, Ce = 0; le < C.length; le++) {
      const Ne = C[le];
      te.set(Ne, Ce), Ce += Ne.length;
    }
    return te;
  }
  function M(C, F) {
    if (F !== void 0 && {}.toString.call(F) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(C, F);
  }
  class Y {
  }
  e.Hash = Y;
  function j(C) {
    const F = (le) => C().update(m(le)).digest(), te = C();
    return F.outputLen = te.outputLen, F.blockLen = te.blockLen, F.create = () => C(), F;
  }
  function ae(C) {
    const F = (le, Ce) => C(Ce).update(m(le)).digest(), te = C({});
    return F.outputLen = te.outputLen, F.blockLen = te.blockLen, F.create = (le) => C(le), F;
  }
  function ce(C) {
    const F = (le, Ce) => C(Ce).update(m(le)).digest(), te = C({});
    return F.outputLen = te.outputLen, F.blockLen = te.blockLen, F.create = (le) => C(le), F;
  }
  e.wrapConstructor = j, e.wrapConstructorWithOpts = ae, e.wrapXOFConstructorWithOpts = ce;
  function Ke(C = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array(C));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes(C));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Dy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = Dy;
  class n extends t.Hash {
    constructor(s, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(s);
      const c = (0, t.toBytes)(i);
      if (this.iHash = s.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const l = this.blockLen, u = new Uint8Array(l);
      u.set(c.length > l ? s.create().update(c).digest() : c);
      for (let p = 0; p < u.length; p++)
        u[p] ^= 54;
      this.iHash.update(u), this.oHash = s.create();
      for (let p = 0; p < u.length; p++)
        u[p] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
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
      const { oHash: i, iHash: c, finished: l, destroyed: u, blockLen: p, outputLen: d } = this;
      return s = s, s.finished = l, s.destroyed = u, s.blockLen = p, s.outputLen = d, s.oHash = i._cloneInto(s.oHash), s.iHash = c._cloneInto(s.iHash), s;
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
})(Hy);
const xi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Fy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function ni(e, ...t) {
  if (!Fy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Mx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  sd(e.outputLen), sd(e.blockLen);
}
function od(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function jy(e, t) {
  ni(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Px(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function _x(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function nl(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Fc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Er(e, t) {
  return e << 32 - t | e >>> t;
}
function Ux(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const bf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function xf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const Ry = bf ? (e) => e : (e) => xf(e), Ox = Ry;
function zy(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = xf(e[t]);
  return e;
}
const Hx = bf ? (e) => e : zy, Gy = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Dx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Sf(e) {
  if (ni(e), Gy)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Dx[e[n]];
  return t;
}
const fs = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function yp(e) {
  if (e >= fs._0 && e <= fs._9)
    return e - fs._0;
  if (e >= fs.A && e <= fs.F)
    return e - (fs.A - 10);
  if (e >= fs.a && e <= fs.f)
    return e - (fs.a - 10);
}
function Fx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (Gy)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let o = 0, s = 0; o < n; o++, s += 2) {
    const i = yp(e.charCodeAt(s)), c = yp(e.charCodeAt(s + 1));
    if (i === void 0 || c === void 0) {
      const l = e[s] + e[s + 1];
      throw new Error('hex string expected, got non-hex character "' + l + '" at index ' + s);
    }
    r[o] = i * 16 + c;
  }
  return r;
}
const Ky = async () => {
};
async function jx(e, t, n) {
  let r = Date.now();
  for (let o = 0; o < e; o++) {
    n(o);
    const s = Date.now() - r;
    s >= 0 && s < t || (await Ky(), r += s);
  }
}
function vf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function Rx(e) {
  return new TextDecoder().decode(e);
}
function Ya(e) {
  return typeof e == "string" && (e = vf(e)), ni(e), e;
}
function zx(e) {
  return typeof e == "string" && (e = vf(e)), ni(e), e;
}
function Gx(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    ni(o), t += o.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, o = 0; r < e.length; r++) {
    const s = e[r];
    n.set(s, o), o += s.length;
  }
  return n;
}
function Kx(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let Vy = class {
};
function Ul(e) {
  const t = (r) => e().update(Ya(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function Xy(e) {
  const t = (r, o) => e(o).update(Ya(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function Yy(e) {
  const t = (r, o) => e(o).update(Ya(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const Vx = Ul, Xx = Xy, Yx = Yy;
function qx(e = 32) {
  if (xi && typeof xi.getRandomValues == "function")
    return xi.getRandomValues(new Uint8Array(e));
  if (xi && typeof xi.randomBytes == "function")
    return Uint8Array.from(xi.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const Wx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Vy,
  abytes: ni,
  aexists: od,
  ahash: Mx,
  anumber: sd,
  aoutput: jy,
  asyncLoop: jx,
  byteSwap: xf,
  byteSwap32: zy,
  byteSwapIfBE: Ox,
  bytesToHex: Sf,
  bytesToUtf8: Rx,
  checkOpts: Kx,
  clean: nl,
  concatBytes: Gx,
  createHasher: Ul,
  createOptHasher: Xy,
  createView: Fc,
  createXOFer: Yy,
  hexToBytes: Fx,
  isBytes: Fy,
  isLE: bf,
  kdfInputToBytes: zx,
  nextTick: Ky,
  randomBytes: qx,
  rotl: Ux,
  rotr: Er,
  swap32IfBE: Hx,
  swap8IfBE: Ry,
  toBytes: Ya,
  u32: _x,
  u8: Px,
  utf8ToBytes: vf,
  wrapConstructor: Vx,
  wrapConstructorWithOpts: Xx,
  wrapXOFConstructorWithOpts: Yx
}, Symbol.toStringTag, { value: "Module" }));
function Zx(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), c = Number(n & s), l = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + l, i, r), e.setUint32(t + u, c, r);
}
function Jx(e, t, n) {
  return e & t ^ ~e & n;
}
function Qx(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class eS extends Vy {
  constructor(t, n, r, o) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(t), this.view = Fc(this.buffer);
  }
  update(t) {
    od(this), t = Ya(t), ni(t);
    const { view: n, buffer: r, blockLen: o } = this, s = t.length;
    for (let i = 0; i < s; ) {
      const c = Math.min(o - this.pos, s - i);
      if (c === o) {
        const l = Fc(t);
        for (; o <= s - i; i += o)
          this.process(l, i);
        continue;
      }
      r.set(t.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    od(this), jy(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, nl(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    Zx(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Fc(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, p = this.get();
    if (u > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      c.setUint32(4 * d, p[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: c } = this;
    return t.destroyed = i, t.finished = s, t.length = o, t.pos = c, o % n && t.buffer.set(r), t;
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
]), Us = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), tS = /* @__PURE__ */ Uint32Array.from([
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
]), Os = /* @__PURE__ */ new Uint32Array(64);
let Af = class extends eS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = _s[0] | 0, this.B = _s[1] | 0, this.C = _s[2] | 0, this.D = _s[3] | 0, this.E = _s[4] | 0, this.F = _s[5] | 0, this.G = _s[6] | 0, this.H = _s[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: c, H: l } = this;
    return [t, n, r, o, s, i, c, l];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Os[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Os[d - 15], y = Os[d - 2], v = Er(w, 7) ^ Er(w, 18) ^ w >>> 3, x = Er(y, 17) ^ Er(y, 19) ^ y >>> 10;
      Os[d] = x + Os[d - 7] + v + Os[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: c, F: l, G: u, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const w = Er(c, 6) ^ Er(c, 11) ^ Er(c, 25), y = p + w + Jx(c, l, u) + tS[d] + Os[d] | 0, x = (Er(r, 2) ^ Er(r, 13) ^ Er(r, 22)) + Qx(r, o, s) | 0;
      p = u, u = l, l = c, c = i + y | 0, i = s, s = o, o = r, r = y + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, p = p + this.H | 0, this.set(r, o, s, i, c, l, u, p);
  }
  roundClean() {
    nl(Os);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), nl(this.buffer);
  }
}, qy = class extends Af {
  constructor() {
    super(28), this.A = Us[0] | 0, this.B = Us[1] | 0, this.C = Us[2] | 0, this.D = Us[3] | 0, this.E = Us[4] | 0, this.F = Us[5] | 0, this.G = Us[6] | 0, this.H = Us[7] | 0;
  }
};
const nS = /* @__PURE__ */ Ul(() => new Af()), rS = /* @__PURE__ */ Ul(() => new qy()), sS = Af, Ef = nS, oS = qy, iS = rS, aS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: oS,
  SHA256: sS,
  sha224: iS,
  sha256: Ef
}, Symbol.toStringTag, { value: "Module" })), Ol = /* @__PURE__ */ Ll(aS), cS = /* @__PURE__ */ Ll(p2);
var Gi = {};
Object.defineProperty(Gi, "__esModule", { value: !0 });
Gi.joseToDer = Gi.derToJose = void 0;
const Wy = Xa, Zy = Un;
function wu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const lS = {
  ES256: wu(256),
  ES384: wu(384),
  ES512: wu(521)
};
function Jy(e) {
  const t = lS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const rl = 128, Qy = 0, uS = 32, dS = 16, fS = 2, ew = dS | uS | Qy << 6, sl = fS | Qy << 6;
function tw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, Wy.toByteArray)((0, Zy.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function hS(e, t) {
  const n = tw(e), r = Jy(t), o = r + 1, s = n.length;
  let i = 0;
  if (n[i++] !== ew)
    throw new Error('Could not find expected "seq"');
  let c = n[i++];
  if (c === (rl | 1) && (c = n[i++]), s - i < c)
    throw new Error(`"seq" specified length of "${c}", only "${s - i}" remaining`);
  if (n[i++] !== sl)
    throw new Error('Could not find expected "int" for "r"');
  const l = n[i++];
  if (s - i - 2 < l)
    throw new Error(`"r" specified length of "${l}", only "${s - i - 2}" available`);
  if (o < l)
    throw new Error(`"r" specified length of "${l}", max of "${o}" is acceptable`);
  const u = i;
  if (i += l, n[i++] !== sl)
    throw new Error('Could not find expected "int" for "s"');
  const p = n[i++];
  if (s - i !== p)
    throw new Error(`"s" specified length of "${p}", expected "${s - i}"`);
  if (o < p)
    throw new Error(`"s" specified length of "${p}", max of "${o}" is acceptable`);
  const d = i;
  if (i += p, i !== s)
    throw new Error(`Expected to consume entire array, but "${s - i}" bytes remain`);
  const w = r - l, y = r - p, v = new Uint8Array(w + l + y + p);
  for (i = 0; i < w; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-w, 0), u + l), i), i = r;
  for (const x = i; i < x + y; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-y, 0), d + p), i), (0, Zy.escape)((0, Wy.fromByteArray)(v));
}
Gi.derToJose = hS;
function wp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= rl && --r, r;
}
function pS(e, t) {
  e = tw(e);
  const n = Jy(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const o = wp(e, 0, n), s = wp(e, n, e.length), i = n - o, c = n - s, l = 2 + i + 1 + 1 + c, u = l < rl, p = new Uint8Array((u ? 2 : 3) + l);
  let d = 0;
  return p[d++] = ew, u ? p[d++] = l : (p[d++] = rl | 1, p[d++] = l & 255), p[d++] = sl, p[d++] = i, o < 0 ? (p[d++] = 0, p.set(e.subarray(0, n), d), d += n) : (p.set(e.subarray(o, n), d), d += n - o), p[d++] = sl, p[d++] = c, s < 0 ? (p[d++] = 0, p.set(e.subarray(n), d)) : p.set(e.subarray(n + s), d), p;
}
Gi.joseToDer = pS;
var Ss = {};
Object.defineProperty(Ss, "__esModule", { value: !0 });
Ss.InvalidTokenError = Ss.MissingParametersError = void 0;
class gS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Ss.MissingParametersError = gS;
class yS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Ss.InvalidTokenError = yS;
const qa = /* @__PURE__ */ Ll(Wx);
Object.defineProperty(Pl, "__esModule", { value: !0 });
Pl.SECP256K1Client = void 0;
const wS = Hy, mS = Ol, jc = cS, mp = Gi, bp = Ss, xp = qa;
jc.utils.hmacSha256Sync = (e, ...t) => {
  const n = wS.hmac.create(mS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class nw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, xp.bytesToHex)(jc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new bp.MissingParametersError("a signing input hash and private key are all required");
    const o = jc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, xp.bytesToHex)(o);
    if (r === "jose")
      return (0, mp.derToJose)(o, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, mp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new bp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return jc.verify(n, t, r, { strict: !1 });
  }
}
Pl.SECP256K1Client = nw;
nw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Pl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Ml);
var jo = {};
const bS = /* @__PURE__ */ Ll(ly);
var xS = Hn && Hn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function c(p) {
      try {
        u(r.next(p));
      } catch (d) {
        i(d);
      }
    }
    function l(p) {
      try {
        u(r.throw(p));
      } catch (d) {
        i(d);
      }
    }
    function u(p) {
      p.done ? s(p.value) : o(p.value).then(c, l);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(jo, "__esModule", { value: !0 });
jo.hashSha256Async = jo.hashSha256 = void 0;
const SS = Ol;
function rw(e) {
  return (0, SS.sha256)(e);
}
jo.hashSha256 = rw;
function vS(e) {
  return xS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = bS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(rw(e));
    }
  });
}
jo.hashSha256Async = vS;
var AS = Hn && Hn.__awaiter || function(e, t, n, r) {
  function o(s) {
    return s instanceof n ? s : new n(function(i) {
      i(s);
    });
  }
  return new (n || (n = Promise))(function(s, i) {
    function c(p) {
      try {
        u(r.next(p));
      } catch (d) {
        i(d);
      }
    }
    function l(p) {
      try {
        u(r.throw(p));
      } catch (d) {
        i(d);
      }
    }
    function u(p) {
      p.done ? s(p.value) : o(p.value).then(c, l);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(zi, "__esModule", { value: !0 });
zi.TokenSigner = zi.createUnsecuredToken = void 0;
const id = Un, Sp = Ml, ES = Ss, vp = jo;
function ad(e, t) {
  const n = [], r = id.encode(JSON.stringify(t));
  n.push(r);
  const o = id.encode(JSON.stringify(e));
  return n.push(o), n.join(".");
}
function kS(e) {
  return ad(e, { typ: "JWT", alg: "none" }) + ".";
}
zi.createUnsecuredToken = kS;
class $S {
  constructor(t, n) {
    if (!(t && n))
      throw new ES.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Sp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Sp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const o = this.header(r), s = ad(t, o), i = (0, vp.hashSha256)(s);
    return this.createWithSignedHash(t, n, o, s, i);
  }
  signAsync(t, n = !1, r = {}) {
    return AS(this, void 0, void 0, function* () {
      const o = this.header(r), s = ad(t, o), i = yield (0, vp.hashSha256Async)(s);
      return this.createWithSignedHash(t, n, o, s, i);
    });
  }
  createWithSignedHash(t, n, r, o, s) {
    const i = this.cryptoClient.signHash(s, this.rawPrivateKey);
    return n ? {
      header: [id.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [o, i].join(".");
  }
}
zi.TokenSigner = $S;
var Hl = {};
Object.defineProperty(Hl, "__esModule", { value: !0 });
Hl.TokenVerifier = void 0;
const IS = Un, Ap = Ml, LS = Ss, fc = jo;
class CS {
  constructor(t, n) {
    if (!(t && n))
      throw new LS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !Ap.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Ap.cryptoClients[t], this.rawPublicKey = n;
  }
  verify(t) {
    return typeof t == "string" ? this.verifyCompact(t, !1) : typeof t == "object" ? this.verifyExpanded(t, !1) : !1;
  }
  verifyAsync(t) {
    return typeof t == "string" ? this.verifyCompact(t, !0) : typeof t == "object" ? this.verifyExpanded(t, !0) : Promise.resolve(!1);
  }
  verifyCompact(t, n) {
    const r = t.split("."), o = r[0] + "." + r[1], s = (i) => {
      const c = this.cryptoClient.loadSignature(r[2]);
      return this.cryptoClient.verifyHash(i, c, this.rawPublicKey);
    };
    if (n)
      return (0, fc.hashSha256Async)(o).then((i) => s(i));
    {
      const i = (0, fc.hashSha256)(o);
      return s(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), IS.encode(t.payload)].join(".");
    let o = !0;
    const s = (i) => (t.signature.map((c) => {
      const l = this.cryptoClient.loadSignature(c);
      this.cryptoClient.verifyHash(i, l, this.rawPublicKey) || (o = !1);
    }), o);
    if (n)
      return (0, fc.hashSha256Async)(r).then((i) => s(i));
    {
      const i = (0, fc.hashSha256)(r);
      return s(i);
    }
  }
}
Hl.TokenVerifier = CS;
var Dl = {};
Object.defineProperty(Dl, "__esModule", { value: !0 });
Dl.decodeToken = void 0;
const hc = Un;
function TS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(hc.decode(t[0])), r = JSON.parse(hc.decode(t[1])), o = t[2];
    return {
      header: n,
      payload: r,
      signature: o
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = hc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const o = JSON.parse(hc.decode(r));
      n.push(o);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Dl.decodeToken = TS;
(function(e) {
  var t = Hn && Hn.__createBinding || (Object.create ? function(r, o, s, i) {
    i === void 0 && (i = s);
    var c = Object.getOwnPropertyDescriptor(o, s);
    (!c || ("get" in c ? !o.__esModule : c.writable || c.configurable)) && (c = { enumerable: !0, get: function() {
      return o[s];
    } }), Object.defineProperty(r, i, c);
  } : function(r, o, s, i) {
    i === void 0 && (i = s), r[i] = o[s];
  }), n = Hn && Hn.__exportStar || function(r, o) {
    for (var s in r) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && t(o, r, s);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(zi, e), n(Hl, e), n(Dl, e), n(Ss, e), n(Ml, e);
})($n);
function BS(e) {
  return `did:btc-addr:${e}`;
}
function NS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new np("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new np('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function sw(e) {
  if (e)
    return NS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const MS = "1.4.0";
function PS() {
  return bx();
}
function _S(e, t, n, r = Qg.slice(), o, s = y1().getTime(), i = {}) {
  const c = (y) => {
    const v = af("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${c("redirectURI")}/`), n || (n = `${c("manifestURI")}/manifest.json`), o || (o = c("appDomain"));
  const l = Object.assign({}, i, {
    jti: m1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(s / 1e3),
    iss: null,
    public_keys: [],
    domain_name: o,
    manifest_uri: n,
    redirect_uri: t,
    version: MS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = $n.SECP256K1Client.derivePublicKey(e);
  l.public_keys = [u];
  const p = Ty(u);
  return l.iss = BS(p), new $n.TokenSigner("ES256k", e).sign(l);
}
async function Ep(e, t) {
  const n = Ka(yt(t)), r = JSON.parse(n), o = await Py(e, r);
  if (typeof o != "string")
    throw new Error("Unable to correctly decrypt private key");
  return o;
}
function US(e) {
  const t = $n.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new $n.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function OS(e) {
  const t = $n.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = sw(t.iss);
  if (n.length === 1) {
    if (Ty(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function HS(e) {
  const t = $n.decodeToken(e).payload;
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
function DS(e) {
  const t = $n.decodeToken(e).payload;
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
function FS(e) {
  const t = [
    DS(e),
    HS(e),
    US(e),
    OS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const kp = "1.0.0";
class ao {
  constructor(t) {
    this.version = kp, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== kp)
      throw new Ju(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new ao(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class ow {
  constructor(t) {
    if (t) {
      const n = new ao(t);
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
class $p extends ow {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new ao({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new ey("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ao({})), !0;
  }
}
class Ip extends ow {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = h1, !localStorage.getItem(this.key)) {
      const r = new ao({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new ey("No session data was found in localStorage");
    const n = JSON.parse(t);
    return ao.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ao({})), !0;
  }
}
var Na;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Na || (Na = {}));
var ol;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(ol || (ol = {}));
Na.Mainnet;
var ms;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(ms || (ms = {}));
var qr;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(qr || (qr = {}));
ms.Mainnet;
const iw = {
  chainId: Na.Mainnet,
  transactionVersion: ms.Mainnet,
  peerNetworkId: ol.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: qr.MainnetSingleSig,
    multiSig: qr.MainnetMultiSig
  },
  client: { baseUrl: ty }
}, cd = {
  chainId: Na.Testnet,
  transactionVersion: ms.Testnet,
  peerNetworkId: ol.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: qr.TestnetSingleSig,
    multiSig: qr.TestnetMultiSig
  },
  client: { baseUrl: ny }
}, Rc = {
  ...cd,
  addressVersion: { ...cd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ry }
}, jS = {
  ...Rc,
  addressVersion: { ...Rc.addressVersion },
  client: { ...Rc.client }
};
function RS(e) {
  switch (e) {
    case "mainnet":
      return iw;
    case "testnet":
      return cd;
    case "devnet":
      return Rc;
    case "mocknet":
      return jS;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function aw(e) {
  return typeof e == "string" ? RS(e) : e;
}
var Lp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Lp || (Lp = {}));
var Cp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Cp || (Cp = {}));
var kr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(kr || (kr = {}));
const mu = ["onChainOnly", "offChainOnly", "any"];
mu[0] + "", kr.OnChainOnly, mu[1] + "", kr.OffChainOnly, mu[2] + "", kr.Any, kr.OnChainOnly + "", kr.OnChainOnly, kr.OffChainOnly + "", kr.OffChainOnly, kr.Any + "", kr.Any;
var Tp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Tp || (Tp = {}));
var Bp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Bp || (Bp = {}));
var Np;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Np || (Np = {}));
var ys;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ys || (ys = {}));
var Mp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Mp || (Mp = {}));
var Pp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Pp || (Pp = {}));
var _p;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(_p || (_p = {}));
var Up;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Up || (Up = {}));
var Op;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Op || (Op = {}));
var Hp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Hp || (Hp = {}));
var Dp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Dp || (Dp = {}));
var Fp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Fp || (Fp = {}));
var jp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(jp || (jp = {}));
function ld(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function zS(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function cw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function GS(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ld(e.outputLen), ld(e.blockLen);
}
function KS(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function VS(e, t) {
  cw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Lo = {
  number: ld,
  bool: zS,
  bytes: cw,
  hash: GS,
  exists: KS,
  output: VS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const bu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Rr = (e, t) => e << 32 - t | e >>> t, XS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!XS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function YS(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function kf(e) {
  if (typeof e == "string" && (e = YS(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let lw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(e) {
  const t = (r) => e().update(kf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let uw = class extends lw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Lo.hash(t);
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
    return Lo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Lo.exists(this), Lo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: c } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const dw = (e, t, n) => new uw(e, t).update(n).digest();
dw.create = (e, t) => new uw(e, t);
function qS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), c = Number(n & s), l = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + l, i, r), e.setUint32(t + u, c, r);
}
let $f = class extends lw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = bu(this.buffer);
  }
  update(t) {
    Lo.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = kf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const c = Math.min(o - this.pos, s - i);
      if (c === o) {
        const l = bu(t);
        for (; o <= s - i; i += o)
          this.process(l, i);
        continue;
      }
      r.set(t.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Lo.exists(this), Lo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    qS(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = bu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, p = this.get();
    if (u > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      c.setUint32(4 * d, p[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: c } = this;
    return t.length = o, t.pos = c, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const WS = (e, t, n) => e & t ^ ~e & n, ZS = (e, t, n) => e & t ^ e & n ^ t & n, JS = new Uint32Array([
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
]), Hs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ds = new Uint32Array(64);
let fw = class extends $f {
  constructor() {
    super(64, 32, 8, !1), this.A = Hs[0] | 0, this.B = Hs[1] | 0, this.C = Hs[2] | 0, this.D = Hs[3] | 0, this.E = Hs[4] | 0, this.F = Hs[5] | 0, this.G = Hs[6] | 0, this.H = Hs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: c, H: l } = this;
    return [t, n, r, o, s, i, c, l];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Ds[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Ds[d - 15], y = Ds[d - 2], v = Rr(w, 7) ^ Rr(w, 18) ^ w >>> 3, x = Rr(y, 17) ^ Rr(y, 19) ^ y >>> 10;
      Ds[d] = x + Ds[d - 7] + v + Ds[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: c, F: l, G: u, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const w = Rr(c, 6) ^ Rr(c, 11) ^ Rr(c, 25), y = p + w + WS(c, l, u) + JS[d] + Ds[d] | 0, x = (Rr(r, 2) ^ Rr(r, 13) ^ Rr(r, 22)) + ZS(r, o, s) | 0;
      p = u, u = l, l = c, c = i + y | 0, i = s, s = o, o = r, r = y + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, p = p + this.H | 0, this.set(r, o, s, i, c, l, u, p);
  }
  roundClean() {
    Ds.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, QS = class extends fw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const hw = ri(() => new fw());
ri(() => new QS());
var si = {}, If = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = qa;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, c) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let l = [], u = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (u < 4) {
        const v = n.indexOf(i[y]) >> u;
        let x = 0;
        y !== 0 && (x = n.indexOf(i[y - 1]));
        const L = 1 + u, B = x % (1 << L) << 5 - L, _ = e.c32[v + B];
        u = L, l.unshift(_);
      } else
        u = 0;
    let p = 0;
    for (let y = 0; y < l.length && l[y] === "0"; y++)
      p++;
    l = l.slice(p);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = d ? d[0].length : 0;
    for (let y = 0; y < w; y++)
      l.unshift(e.c32[0]);
    if (c) {
      const y = c - l.length;
      for (let v = 0; v < y; v++)
        l.unshift(e.c32[0]);
    }
    return l.join("");
  }
  e.c32encode = r;
  function o(i) {
    return i.toUpperCase().replace(/O/g, "0").replace(/L|I/g, "1");
  }
  e.c32normalize = o;
  function s(i, c) {
    if (i = o(i), !i.match(`^[${e.c32}]*$`))
      throw new Error("Not a c32-encoded string");
    const l = i.match(`^${e.c32[0]}*`), u = l ? l[0].length : 0;
    let p = [], d = 0, w = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      w === 4 && (p.unshift(n[d]), w = 0, d = 0);
      const B = (e.c32.indexOf(i[x]) << w) + d, _ = n[B % 16];
      if (w += 1, d = B >> 4, d > 1 << w)
        throw new Error("Panic error in decoding.");
      p.unshift(_);
    }
    p.unshift(n[d]), p.length % 2 === 1 && p.unshift("0");
    let y = 0;
    for (let x = 0; x < p.length && p[x] === "0"; x++)
      y++;
    p = p.slice(y - y % 2);
    let v = p.join("");
    for (let x = 0; x < u; x++)
      v = `00${v}`;
    if (c) {
      const x = c * 2 - v.length;
      for (let L = 0; L < x; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = s;
})(If);
var Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
Ro.c32checkDecode = Ro.c32checkEncode = void 0;
const Rp = Ol, zp = qa, $a = If;
function pw(e) {
  const t = (0, Rp.sha256)((0, Rp.sha256)((0, zp.hexToBytes)(e)));
  return (0, zp.bytesToHex)(t.slice(0, 4));
}
function ev(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = pw(`${n}${t}`), o = (0, $a.c32encode)(`${t}${r}`);
  return `${$a.c32[e]}${o}`;
}
Ro.c32checkEncode = ev;
function tv(e) {
  e = (0, $a.c32normalize)(e);
  const t = (0, $a.c32decode)(e.slice(1)), n = e[0], r = $a.c32.indexOf(n), o = t.slice(-8);
  let s = r.toString(16);
  if (s.length === 1 && (s = `0${s}`), pw(`${s}${t.substring(0, t.length - 8)}`) !== o)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Ro.c32checkDecode = tv;
var gw = {}, Ki = {};
Object.defineProperty(Ki, "__esModule", { value: !0 });
Ki.decode = Ki.encode = void 0;
const il = Ol, Gp = qa, yw = ky, ww = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function nv(e, t = "00") {
  const n = typeof e == "string" ? (0, Gp.hexToBytes)(e) : e, r = typeof t == "string" ? (0, Gp.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const o = (0, il.sha256)((0, il.sha256)(new Uint8Array([...r, ...n])));
  return yw(ww).encode([...r, ...n, ...o.slice(0, 4)]);
}
Ki.encode = nv;
function rv(e) {
  const t = yw(ww).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), o = (0, il.sha256)((0, il.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((s, i) => {
    if (s !== o[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Ki.decode = rv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Ro, n = Ki, r = qa;
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
  function i(p, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(p, d)}`;
  }
  e.c32address = i;
  function c(p) {
    if (p.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (p[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(p.slice(1));
  }
  e.c32addressDecode = c;
  function l(p, d = -1) {
    const w = n.decode(p), y = (0, r.bytesToHex)(w.data), v = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let x;
    return d < 0 ? (x = v, o[v] !== void 0 && (x = o[v])) : x = d, i(x, y);
  }
  e.b58ToC32 = l;
  function u(p, d = -1) {
    const w = c(p), y = w[0], v = w[1];
    let x;
    d < 0 ? (x = y, s[y] !== void 0 && (x = s[y])) : x = d;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(gw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = If;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Ro;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = gw;
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
})(si);
function sv(e, t) {
  switch (t = aw(t ?? iw), e) {
    case ys.P2PKH:
      switch (t.transactionVersion) {
        case ms.Mainnet:
          return qr.MainnetSingleSig;
        case ms.Testnet:
          return qr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case ys.P2SH:
    case ys.P2SHNonSequential:
    case ys.P2WPKH:
    case ys.P2WSH:
    case ys.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case ms.Mainnet:
          return qr.MainnetMultiSig;
        case ms.Testnet:
          return qr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const ov = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), mw = Uint8Array.from({ length: 16 }, (e, t) => t), iv = mw.map((e) => (9 * e + 5) % 16);
let Lf = [mw], Cf = [iv];
for (let e = 0; e < 4; e++)
  for (let t of [Lf, Cf])
    t.push(t[e].map((n) => ov[n]));
const bw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), av = Lf.map((e, t) => e.map((n) => bw[t][n])), cv = Cf.map((e, t) => e.map((n) => bw[t][n])), lv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), uv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pc = (e, t) => e << t | e >>> 32 - t;
function Kp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const gc = new Uint32Array(16);
let dv = class extends $f {
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
      gc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, c = this.h2 | 0, l = c, u = this.h3 | 0, p = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = lv[y], L = uv[y], B = Lf[y], _ = Cf[y], A = av[y], T = cv[y];
      for (let P = 0; P < 16; P++) {
        const K = pc(r + Kp(y, s, c, u) + gc[B[P]] + x, A[P]) + d | 0;
        r = d, d = u, u = pc(c, 10) | 0, c = s, s = K;
      }
      for (let P = 0; P < 16; P++) {
        const K = pc(o + Kp(v, i, l, p) + gc[_[P]] + L, T[P]) + w | 0;
        o = w, w = p, p = pc(l, 10) | 0, l = i, i = K;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + l | 0);
  }
  roundClean() {
    gc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const fv = ri(() => new dv()), yc = BigInt(2 ** 32 - 1), ud = BigInt(32);
function xw(e, t = !1) {
  return t ? { h: Number(e & yc), l: Number(e >> ud & yc) } : { h: Number(e >> ud & yc) | 0, l: Number(e & yc) | 0 };
}
function hv(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = xw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const pv = (e, t) => BigInt(e >>> 0) << ud | BigInt(t >>> 0), gv = (e, t, n) => e >>> n, yv = (e, t, n) => e << 32 - n | t >>> n, wv = (e, t, n) => e >>> n | t << 32 - n, mv = (e, t, n) => e << 32 - n | t >>> n, bv = (e, t, n) => e << 64 - n | t >>> n - 32, xv = (e, t, n) => e >>> n - 32 | t << 64 - n, Sv = (e, t) => t, vv = (e, t) => e, Av = (e, t, n) => e << n | t >>> 32 - n, Ev = (e, t, n) => t << n | e >>> 32 - n, kv = (e, t, n) => t << n - 32 | e >>> 64 - n, $v = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Iv(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const Lv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Cv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, Tv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Bv = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, Nv = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Mv = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Je = {
  fromBig: xw,
  split: hv,
  toBig: pv,
  shrSH: gv,
  shrSL: yv,
  rotrSH: wv,
  rotrSL: mv,
  rotrBH: bv,
  rotrBL: xv,
  rotr32H: Sv,
  rotr32L: vv,
  rotlSH: Av,
  rotlSL: Ev,
  rotlBH: kv,
  rotlBL: $v,
  add: Iv,
  add3L: Lv,
  add3H: Cv,
  add4L: Tv,
  add4H: Bv,
  add5H: Mv,
  add5L: Nv
}, [Pv, _v] = Je.split([
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
].map((e) => BigInt(e))), Fs = new Uint32Array(80), js = new Uint32Array(80);
let Fl = class extends $f {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: c, Dl: l, Eh: u, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Fs[A] = t.getUint32(n), js[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Fs[A - 15] | 0, P = js[A - 15] | 0, K = Je.rotrSH(T, P, 1) ^ Je.rotrSH(T, P, 8) ^ Je.shrSH(T, P, 7), ie = Je.rotrSL(T, P, 1) ^ Je.rotrSL(T, P, 8) ^ Je.shrSL(T, P, 7), ee = Fs[A - 2] | 0, X = js[A - 2] | 0, m = Je.rotrSH(ee, X, 19) ^ Je.rotrBH(ee, X, 61) ^ Je.shrSH(ee, X, 6), I = Je.rotrSL(ee, X, 19) ^ Je.rotrBL(ee, X, 61) ^ Je.shrSL(ee, X, 6), N = Je.add4L(ie, I, js[A - 7], js[A - 16]), M = Je.add4H(N, K, m, Fs[A - 7], Fs[A - 16]);
      Fs[A] = M | 0, js[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: c, Cl: l, Dh: u, Dl: p, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: B, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = Je.rotrSH(d, w, 14) ^ Je.rotrSH(d, w, 18) ^ Je.rotrBH(d, w, 41), P = Je.rotrSL(d, w, 14) ^ Je.rotrSL(d, w, 18) ^ Je.rotrBL(d, w, 41), K = d & y ^ ~d & x, ie = w & v ^ ~w & L, ee = Je.add5L(_, P, ie, _v[A], js[A]), X = Je.add5H(ee, B, T, K, Pv[A], Fs[A]), m = ee | 0, I = Je.rotrSH(r, o, 28) ^ Je.rotrBH(r, o, 34) ^ Je.rotrBH(r, o, 39), N = Je.rotrSL(r, o, 28) ^ Je.rotrBL(r, o, 34) ^ Je.rotrBL(r, o, 39), M = r & s ^ r & c ^ s & c, Y = o & i ^ o & l ^ i & l;
      B = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = Je.add(u | 0, p | 0, X | 0, m | 0), u = c | 0, p = l | 0, c = s | 0, l = i | 0, s = r | 0, i = o | 0;
      const j = Je.add3L(m, N, Y);
      r = Je.add3H(j, X, I, M), o = j | 0;
    }
    ({ h: r, l: o } = Je.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Je.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: c, l } = Je.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: u, l: p } = Je.add(this.Dh | 0, this.Dl | 0, u | 0, p | 0), { h: d, l: w } = Je.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = Je.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = Je.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: _ } = Je.add(this.Hh | 0, this.Hl | 0, B | 0, _ | 0), this.set(r, o, s, i, c, l, u, p, d, w, y, v, x, L, B, _);
  }
  roundClean() {
    Fs.fill(0), js.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Uv = class extends Fl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ov = class extends Fl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Hv = class extends Fl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new Fl());
ri(() => new Uv());
ri(() => new Ov());
ri(() => new Hv());
var al = { exports: {} };
al.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", o = 9007199254740991, s = "[object Arguments]", i = "[object Array]", c = "[object Boolean]", l = "[object Date]", u = "[object Error]", p = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", v = "[object Object]", x = "[object Promise]", L = "[object RegExp]", B = "[object Set]", _ = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", P = "[object ArrayBuffer]", K = "[object DataView]", ie = "[object Float32Array]", ee = "[object Float64Array]", X = "[object Int8Array]", m = "[object Int16Array]", I = "[object Int32Array]", N = "[object Uint8Array]", M = "[object Uint8ClampedArray]", Y = "[object Uint16Array]", j = "[object Uint32Array]", ae = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Ke = /^\[object .+?Constructor\]$/, C = /^(?:0|[1-9]\d*)$/, F = {};
  F[s] = F[i] = F[P] = F[K] = F[c] = F[l] = F[ie] = F[ee] = F[X] = F[m] = F[I] = F[w] = F[y] = F[v] = F[L] = F[B] = F[_] = F[A] = F[N] = F[M] = F[Y] = F[j] = !0, F[u] = F[p] = F[T] = !1;
  var te = typeof Hn == "object" && Hn && Hn.Object === Object && Hn, le = typeof self == "object" && self && self.Object === Object && self, Ce = te || le || Function("return this")(), Ne = t && !t.nodeType && t, _t = Ne && !0 && e && !e.nodeType && e, je = _t && _t.exports === Ne;
  function Me(S, a) {
    return S.set(a[0], a[1]), S;
  }
  function Pe(S, a) {
    return S.add(a), S;
  }
  function Nt(S, a) {
    for (var f = -1, g = S ? S.length : 0; ++f < g && a(S[f], f, S) !== !1; )
      ;
    return S;
  }
  function Sn(S, a) {
    for (var f = -1, g = a.length, h = S.length; ++f < g; )
      S[h + f] = a[f];
    return S;
  }
  function ct(S, a, f, g) {
    for (var h = -1, H = S ? S.length : 0; ++h < H; )
      f = a(f, S[h], h, S);
    return f;
  }
  function Yt(S, a) {
    for (var f = -1, g = Array(S); ++f < S; )
      g[f] = a(f);
    return g;
  }
  function Et(S, a) {
    return S == null ? void 0 : S[a];
  }
  function R(S) {
    var a = !1;
    if (S != null && typeof S.toString != "function")
      try {
        a = !!(S + "");
      } catch {
      }
    return a;
  }
  function O(S) {
    var a = -1, f = Array(S.size);
    return S.forEach(function(g, h) {
      f[++a] = [h, g];
    }), f;
  }
  function J(S, a) {
    return function(f) {
      return S(a(f));
    };
  }
  function re(S) {
    var a = -1, f = Array(S.size);
    return S.forEach(function(g) {
      f[++a] = g;
    }), f;
  }
  var fe = Array.prototype, ut = Function.prototype, Te = Object.prototype, Ue = Ce["__core-js_shared__"], bt = function() {
    var S = /[^.]+$/.exec(Ue && Ue.keys && Ue.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), Re = ut.toString, Ae = Te.hasOwnProperty, qe = Te.toString, Xe = RegExp(
    "^" + Re.call(Ae).replace(ae, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ze = je ? Ce.Buffer : void 0, Ut = Ce.Symbol, dn = Ce.Uint8Array, fn = J(Object.getPrototypeOf, Object), Fn = Object.create, kt = Te.propertyIsEnumerable, an = fe.splice, Sr = Object.getOwnPropertySymbols, Ur = ze ? ze.isBuffer : void 0, fr = J(Object.keys, Object), wt = hr(Ce, "DataView"), hn = hr(Ce, "Map"), Ot = hr(Ce, "Promise"), pn = hr(Ce, "Set"), At = hr(Ce, "WeakMap"), Rt = hr(Object, "create"), Or = Zn(wt), rs = Zn(hn), k = Zn(Ot), U = Zn(pn), G = Zn(At), D = Ut ? Ut.prototype : void 0, W = D ? D.valueOf : void 0;
  function Q(S) {
    var a = -1, f = S ? S.length : 0;
    for (this.clear(); ++a < f; ) {
      var g = S[a];
      this.set(g[0], g[1]);
    }
  }
  function $e() {
    this.__data__ = Rt ? Rt(null) : {};
  }
  function Se(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function He(S) {
    var a = this.__data__;
    if (Rt) {
      var f = a[S];
      return f === r ? void 0 : f;
    }
    return Ae.call(a, S) ? a[S] : void 0;
  }
  function dt(S) {
    var a = this.__data__;
    return Rt ? a[S] !== void 0 : Ae.call(a, S);
  }
  function $(S, a) {
    var f = this.__data__;
    return f[S] = Rt && a === void 0 ? r : a, this;
  }
  Q.prototype.clear = $e, Q.prototype.delete = Se, Q.prototype.get = He, Q.prototype.has = dt, Q.prototype.set = $;
  function he(S) {
    var a = -1, f = S ? S.length : 0;
    for (this.clear(); ++a < f; ) {
      var g = S[a];
      this.set(g[0], g[1]);
    }
  }
  function Fe() {
    this.__data__ = [];
  }
  function lt(S) {
    var a = this.__data__, f = Ln(a, S);
    if (f < 0)
      return !1;
    var g = a.length - 1;
    return f == g ? a.pop() : an.call(a, f, 1), !0;
  }
  function zt(S) {
    var a = this.__data__, f = Ln(a, S);
    return f < 0 ? void 0 : a[f][1];
  }
  function Ht(S) {
    return Ln(this.__data__, S) > -1;
  }
  function cn(S, a) {
    var f = this.__data__, g = Ln(f, S);
    return g < 0 ? f.push([S, a]) : f[g][1] = a, this;
  }
  he.prototype.clear = Fe, he.prototype.delete = lt, he.prototype.get = zt, he.prototype.has = Ht, he.prototype.set = cn;
  function pt(S) {
    var a = -1, f = S ? S.length : 0;
    for (this.clear(); ++a < f; ) {
      var g = S[a];
      this.set(g[0], g[1]);
    }
  }
  function Yn() {
    this.__data__ = {
      hash: new Q(),
      map: new (hn || he)(),
      string: new Q()
    };
  }
  function Hr(S) {
    return Fr(this, S).delete(S);
  }
  function be(S) {
    return Fr(this, S).get(S);
  }
  function qt(S) {
    return Fr(this, S).has(S);
  }
  function ho(S, a) {
    return Fr(this, S).set(S, a), this;
  }
  pt.prototype.clear = Yn, pt.prototype.delete = Hr, pt.prototype.get = be, pt.prototype.has = qt, pt.prototype.set = ho;
  function qn(S) {
    this.__data__ = new he(S);
  }
  function po() {
    this.__data__ = new he();
  }
  function jn(S) {
    return this.__data__.delete(S);
  }
  function In(S) {
    return this.__data__.get(S);
  }
  function gn(S) {
    return this.__data__.has(S);
  }
  function Es(S, a) {
    var f = this.__data__;
    if (f instanceof he) {
      var g = f.__data__;
      if (!hn || g.length < n - 1)
        return g.push([S, a]), this;
      f = this.__data__ = new pt(g);
    }
    return f.set(S, a), this;
  }
  qn.prototype.clear = po, qn.prototype.delete = jn, qn.prototype.get = In, qn.prototype.has = gn, qn.prototype.set = Es;
  function go(S, a) {
    var f = Ao(S) || vo(S) ? Yt(S.length, String) : [], g = f.length, h = !!g;
    for (var H in S)
      Ae.call(S, H) && !(h && (H == "length" || xo(H, g))) && f.push(H);
    return f;
  }
  function li(S, a, f) {
    var g = S[a];
    (!(Ae.call(S, a) && pi(g, f)) || f === void 0 && !(a in S)) && (S[a] = f);
  }
  function Ln(S, a) {
    for (var f = S.length; f--; )
      if (pi(S[f][0], a))
        return f;
    return -1;
  }
  function Wn(S, a) {
    return S && Is(a, me(a), S);
  }
  function ss(S, a, f, g, h, H, ne) {
    var ue;
    if (g && (ue = H ? g(S, h, H, ne) : g(S)), ue !== void 0)
      return ue;
    if (!V(S))
      return S;
    var xe = Ao(S);
    if (xe) {
      if (ue = Ls(S), !a)
        return $s(S, ue);
    } else {
      var Ee = vr(S), St = Ee == p || Ee == d;
      if (z(S))
        return ks(S, a);
      if (Ee == v || Ee == s || St && !H) {
        if (R(S))
          return H ? S : {};
        if (ue = ls(St ? {} : S), !a)
          return aa(S, Wn(ue, S));
      } else {
        if (!F[Ee])
          return H ? S : {};
        ue = bo(S, Ee, ss, a);
      }
    }
    ne || (ne = new qn());
    var it = ne.get(S);
    if (it)
      return it;
    if (ne.set(S, ue), !xe)
      var Ve = f ? fi(S) : me(S);
    return Nt(Ve || S, function(Ge, Be) {
      Ve && (Be = Ge, Ge = S[Be]), li(ue, Be, ss(Ge, a, f, g, Be, S, ne));
    }), ue;
  }
  function Dr(S) {
    return V(S) ? Fn(S) : {};
  }
  function Rn(S, a, f) {
    var g = a(S);
    return Ao(S) ? g : Sn(g, f(S));
  }
  function yo(S) {
    return qe.call(S);
  }
  function wo(S) {
    if (!V(S) || We(S))
      return !1;
    var a = Z(S) || R(S) ? Xe : Ke;
    return a.test(Zn(S));
  }
  function os(S) {
    if (!hi(S))
      return fr(S);
    var a = [];
    for (var f in Object(S))
      Ae.call(S, f) && f != "constructor" && a.push(f);
    return a;
  }
  function ks(S, a) {
    if (a)
      return S.slice();
    var f = new S.constructor(S.length);
    return S.copy(f), f;
  }
  function is(S) {
    var a = new S.constructor(S.byteLength);
    return new dn(a).set(new dn(S)), a;
  }
  function on(S, a) {
    var f = a ? is(S.buffer) : S.buffer;
    return new S.constructor(f, S.byteOffset, S.byteLength);
  }
  function as(S, a, f) {
    var g = a ? f(O(S), !0) : O(S);
    return ct(g, Me, new S.constructor());
  }
  function ui(S) {
    var a = new S.constructor(S.source, ce.exec(S));
    return a.lastIndex = S.lastIndex, a;
  }
  function mo(S, a, f) {
    var g = a ? f(re(S), !0) : re(S);
    return ct(g, Pe, new S.constructor());
  }
  function di(S) {
    return W ? Object(W.call(S)) : {};
  }
  function cs(S, a) {
    var f = a ? is(S.buffer) : S.buffer;
    return new S.constructor(f, S.byteOffset, S.length);
  }
  function $s(S, a) {
    var f = -1, g = S.length;
    for (a || (a = Array(g)); ++f < g; )
      a[f] = S[f];
    return a;
  }
  function Is(S, a, f, g) {
    f || (f = {});
    for (var h = -1, H = a.length; ++h < H; ) {
      var ne = a[h], ue = void 0;
      li(f, ne, ue === void 0 ? S[ne] : ue);
    }
    return f;
  }
  function aa(S, a) {
    return Is(S, Gt(S), a);
  }
  function fi(S) {
    return Rn(S, me, Gt);
  }
  function Fr(S, a) {
    var f = S.__data__;
    return So(a) ? f[typeof a == "string" ? "string" : "hash"] : f.map;
  }
  function hr(S, a) {
    var f = Et(S, a);
    return wo(f) ? f : void 0;
  }
  var Gt = Sr ? J(Sr, Object) : Le, vr = yo;
  (wt && vr(new wt(new ArrayBuffer(1))) != K || hn && vr(new hn()) != w || Ot && vr(Ot.resolve()) != x || pn && vr(new pn()) != B || At && vr(new At()) != T) && (vr = function(S) {
    var a = qe.call(S), f = a == v ? S.constructor : void 0, g = f ? Zn(f) : void 0;
    if (g)
      switch (g) {
        case Or:
          return K;
        case rs:
          return w;
        case k:
          return x;
        case U:
          return B;
        case G:
          return T;
      }
    return a;
  });
  function Ls(S) {
    var a = S.length, f = S.constructor(a);
    return a && typeof S[0] == "string" && Ae.call(S, "index") && (f.index = S.index, f.input = S.input), f;
  }
  function ls(S) {
    return typeof S.constructor == "function" && !hi(S) ? Dr(fn(S)) : {};
  }
  function bo(S, a, f, g) {
    var h = S.constructor;
    switch (a) {
      case P:
        return is(S);
      case c:
      case l:
        return new h(+S);
      case K:
        return on(S, g);
      case ie:
      case ee:
      case X:
      case m:
      case I:
      case N:
      case M:
      case Y:
      case j:
        return cs(S, g);
      case w:
        return as(S, g, f);
      case y:
      case _:
        return new h(S);
      case L:
        return ui(S);
      case B:
        return mo(S, g, f);
      case A:
        return di(S);
    }
  }
  function xo(S, a) {
    return a = a ?? o, !!a && (typeof S == "number" || C.test(S)) && S > -1 && S % 1 == 0 && S < a;
  }
  function So(S) {
    var a = typeof S;
    return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? S !== "__proto__" : S === null;
  }
  function We(S) {
    return !!bt && bt in S;
  }
  function hi(S) {
    var a = S && S.constructor, f = typeof a == "function" && a.prototype || Te;
    return S === f;
  }
  function Zn(S) {
    if (S != null) {
      try {
        return Re.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function ca(S) {
    return ss(S, !0, !0);
  }
  function pi(S, a) {
    return S === a || S !== S && a !== a;
  }
  function vo(S) {
    return E(S) && Ae.call(S, "callee") && (!kt.call(S, "callee") || qe.call(S) == s);
  }
  var Ao = Array.isArray;
  function b(S) {
    return S != null && Ie(S.length) && !Z(S);
  }
  function E(S) {
    return ve(S) && b(S);
  }
  var z = Ur || rt;
  function Z(S) {
    var a = V(S) ? qe.call(S) : "";
    return a == p || a == d;
  }
  function Ie(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= o;
  }
  function V(S) {
    var a = typeof S;
    return !!S && (a == "object" || a == "function");
  }
  function ve(S) {
    return !!S && typeof S == "object";
  }
  function me(S) {
    return b(S) ? go(S) : os(S);
  }
  function Le() {
    return [];
  }
  function rt() {
    return !1;
  }
  e.exports = ca;
})(al, al.exports);
var Dv = al.exports;
const Sw = /* @__PURE__ */ qg(Dv);
var dd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(dd || (dd = {}));
function Fv(e, t) {
  return { type: dd.Address, version: e, hash160: t };
}
function jv(e) {
  return si.c32address(e.version, e.hash160);
}
const Rv = (e) => fv(hw(e)), zv = (e) => _e(Rv(e));
Qt.hmacSha256Sync = (e, ...t) => {
  const n = dw.create(hw, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Gv(e, t = "mainnet") {
  t = aw(t), e = typeof e == "string" ? yt(e) : e;
  const n = sv(ys.P2PKH, t), r = Fv(n, zv(e));
  return jv(r);
}
function Kv(e, t) {
  const n = $n.decodeToken(e), r = n.payload;
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
  const o = r.issuer.publicKey, s = Gv(o);
  if (t !== o) {
    if (t !== s) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new $n.TokenVerifier(n.header.alg, o);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function Vv(e, t = null) {
  let n;
  t ? n = Kv(e, t) : n = $n.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const o = n.payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    o.hasOwnProperty("claim") && (r = o.claim);
  }
  return r;
}
const Vp = "_blockstackDidCheckEchoReply", Xv = "echoReply", Yv = "authContinuation";
function qv(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [o, s] = r.split("=");
    return n[o] = s ? decodeURIComponent(s.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Wv() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[Vp];
  if (typeof t == "boolean")
    return t;
  const n = qv(e.location.search), r = n[Xv];
  if (r) {
    e[Vp] = !0;
    const o = `echo-reply-${r}`;
    return e.localStorage.setItem(o, "success"), e.setTimeout(() => {
      const s = n[Yv];
      e.location.href = s;
    }, 10), !0;
  }
  return !1;
}
class fd {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new sy();
    else
      throw new g1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Ip(t.sessionOptions) : this.store = new Ip() : t ? this.store = new $p(t.sessionOptions) : this.store = new $p();
  }
  makeAuthRequestToken(t, n, r, o, s, i = w1().getTime(), c = {}) {
    const l = this.appConfig;
    if (!l)
      throw new Ju("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || l.redirectURI(), r = r || l.manifestURI(), o = o || l.scopes, s = s || l.appDomain, _S(t, n, r, o, s, i, c);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = PS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = af("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Wv())
        return Ii.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Ii.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = F1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new sc("Existing user session found.");
    const o = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const s = $n.decodeToken(t).payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await FS(t))
      throw new sc("Invalid authentication response.");
    let c = s.private_key, l = s.core_token;
    if (hu(s.version, "1.1.0"))
      if (o !== void 0 && o != null) {
        if (s.private_key !== void 0 && s.private_key !== null)
          try {
            c = await Ep(o, s.private_key);
          } catch {
            if (Ii.warn("Failed decryption of appPrivateKey, will try to use as given"), !Qt.isValidPrivateKey(s.private_key))
              throw new sc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (l != null)
          try {
            l = await Ep(o, l);
          } catch {
            Ii.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new sc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = C1, p;
    hu(s.version, "1.2.0") && s.hubUrl !== null && s.hubUrl !== void 0 && (u = s.hubUrl), hu(s.version, "1.3.0") && s.associationToken !== null && s.associationToken !== void 0 && (p = s.associationToken);
    const d = {
      profile: s.profile,
      email: s.email,
      decentralizedID: s.iss,
      identityAddress: sw(s.iss),
      appPrivateKey: c,
      coreSessionToken: l,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: s.appPrivateKeyFromWalletSalt,
      coreNode: s.blockstackAPIUrl,
      gaiaAssociationToken: p
    }, w = s.profile_url;
    if (!d.profile && w) {
      const y = await n(w);
      if (!y.ok)
        d.profile = Object.assign({}, f1);
      else {
        const v = await y.text(), x = JSON.parse(v);
        d.profile = Vv(x[0].token);
      }
    } else
      d.profile = s.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new Ju("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Cx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Tx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
fd.prototype.makeAuthRequest = fd.prototype.makeAuthRequestToken;
const Zv = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Jv = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = Zv(), n = e.filter((r) => t.find((s) => s.id === r.id) ? !1 : !!jl(r.id));
  return t.concat(n);
}, jl = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), vw = "STX_PROVIDER", zo = () => typeof window > "u" ? null : window.localStorage.getItem(vw), Qv = (e) => {
  typeof window < "u" && window.localStorage.setItem(vw, e);
}, eA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function tA(e, t) {
  const n = {};
  return Object.assign(n, eA, t), await fetch(e, n);
}
function nA(e) {
  let t = tA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function rA(...e) {
  const { fetchLib: t, middlewares: n } = nA(e);
  return async (o, s) => {
    let i = { url: o, init: s ?? {} };
    for (const l of n)
      typeof l.pre == "function" && (i = await Promise.resolve(l.pre({
        fetch: t,
        ...i
      })) ?? i);
    let c = await t(i.url, i.init);
    for (const l of n)
      typeof l.post == "function" && (c = await Promise.resolve(l.post({
        fetch: t,
        url: i.url,
        init: i.init,
        response: (c == null ? void 0 : c.clone()) ?? c
      })) ?? c);
    return c;
  };
}
var Vi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Vi || (Vi = {}));
var Go;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Go || (Go = {}));
var Xp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(Xp || (Xp = {}));
const sA = "https://api.mainnet.hiro.so", oA = "https://api.testnet.hiro.so", iA = "http://localhost:3999", aA = ["mainnet", "testnet", "devnet", "mocknet"];
class Ko {
  constructor(t) {
    this.version = Go.Mainnet, this.chainId = Vi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Go.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, o) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(o)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let o = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (o = `${o}?limit=${r.limit}&offset=${r.offset}`), o;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, o) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${o}?proof=0`, this.getMapEntryUrl = (n, r, o) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${o}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? rA();
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
Ko.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new hd();
    case "testnet":
      return new pd();
    case "devnet":
      return new cA();
    case "mocknet":
      return new Aw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${aA.join(", ")}`);
  }
};
Ko.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Ko.fromName(e);
class hd extends Ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? sA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Go.Mainnet, this.chainId = Vi.Mainnet;
  }
}
class pd extends Ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? oA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Go.Testnet, this.chainId = Vi.Testnet;
  }
}
class Aw extends Ko {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? iA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Go.Testnet, this.chainId = Vi.Testnet;
  }
}
const cA = Aw;
var Vo;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Vo || (Vo = {}));
var cl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(cl || (cl = {}));
Vo.Mainnet;
var Xo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Xo || (Xo = {}));
var Yo;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yo || (Yo = {}));
Xo.Mainnet;
const lA = {
  chainId: Vo.Mainnet,
  transactionVersion: Xo.Mainnet,
  peerNetworkId: cl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Yo.MainnetSingleSig,
    multiSig: Yo.MainnetMultiSig
  },
  client: { baseUrl: ty }
}, gd = {
  chainId: Vo.Testnet,
  transactionVersion: Xo.Testnet,
  peerNetworkId: cl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Yo.TestnetSingleSig,
    multiSig: Yo.TestnetMultiSig
  },
  client: { baseUrl: ny }
}, zc = {
  ...gd,
  addressVersion: { ...gd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: ry }
}, uA = {
  ...zc,
  addressVersion: { ...zc.addressVersion },
  client: { ...zc.client }
};
function dA(e) {
  switch (e) {
    case "mainnet":
      return lA;
    case "testnet":
      return gd;
    case "devnet":
      return zc;
    case "mocknet":
      return uA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function fA(e) {
  return typeof e == "string" ? dA(e) : e;
}
function hA(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Yp = /* @__PURE__ */ new Map();
function Ew(e, t) {
  const n = Yp.get(e);
  if (n !== void 0)
    return n(t);
  const r = hA(e);
  return Yp.set(e, r), Ew(e, t);
}
let Pt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? yt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return U1(this.readBytes(4), 0);
  }
  readUInt8() {
    return P1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return N1(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = _e(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = _e(n);
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
    if (Ew(t, r))
      return r;
    throw n(r);
  }
};
const pA = 128, gA = 128, kw = 16, Po = 32, yd = 80, Rl = 65, yA = 32, wA = 64, ll = 34, mA = 1 + 16 * 1024 * 1024, bA = 165, xA = 16, SA = 16, vA = 20, AA = SA + 2 + vA, EA = AA + 4, kA = mA + (bA + xA * EA);
var vt;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(vt || (vt = {}));
var wd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(wd || (wd = {}));
var rr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(rr || (rr = {}));
const xu = ["onChainOnly", "offChainOnly", "any"];
xu[0] + "", rr.OnChainOnly, xu[1] + "", rr.OffChainOnly, xu[2] + "", rr.Any, rr.OnChainOnly + "", rr.OnChainOnly, rr.OffChainOnly + "", rr.OffChainOnly, rr.Any + "", rr.Any;
var ul;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(ul || (ul = {}));
var Dt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Dt || (Dt = {}));
var Zt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Zt || (Zt = {}));
var Tt;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Tt || (Tt = {}));
var Vt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Vt || (Vt = {}));
var Ia;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ia || (Ia = {}));
var md;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(md || (md = {}));
var bd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(bd || (bd = {}));
var On;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(On || (On = {}));
var qp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(qp || (qp = {}));
var xd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(xd || (xd = {}));
var Lr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Lr || (Lr = {}));
var Wp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Wp || (Wp = {}));
let zl = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Li = class extends zl {
  constructor(t) {
    super(t);
  }
}, _n = class extends zl {
  constructor(t) {
    super(t);
  }
}, dl = class extends zl {
  constructor(t) {
    super(t);
  }
}, Co = class extends zl {
  constructor(t) {
    super(t);
  }
};
function Sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function $A(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function $w(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function IA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sd(e.outputLen), Sd(e.blockLen);
}
function LA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function CA(e, t) {
  $w(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const To = {
  number: Sd,
  bool: $A,
  bytes: $w,
  hash: IA,
  exists: LA,
  output: CA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Su = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), zr = (e, t) => e << 32 - t | e >>> t, TA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!TA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function BA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Tf(e) {
  if (typeof e == "string" && (e = BA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Iw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function oi(e) {
  const t = (r) => e().update(Tf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Lw = class extends Iw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, To.hash(t);
    const r = Tf(n);
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
    return To.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    To.exists(this), To.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: c } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
};
const Cw = (e, t, n) => new Lw(e, t).update(n).digest();
Cw.create = (e, t) => new Lw(e, t);
function NA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), c = Number(n & s), l = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + l, i, r), e.setUint32(t + u, c, r);
}
let Bf = class extends Iw {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Su(this.buffer);
  }
  update(t) {
    To.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = Tf(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const c = Math.min(o - this.pos, s - i);
      if (c === o) {
        const l = Su(t);
        for (; o <= s - i; i += o)
          this.process(l, i);
        continue;
      }
      r.set(t.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    To.exists(this), To.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    NA(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Su(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, p = this.get();
    if (u > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      c.setUint32(4 * d, p[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: c } = this;
    return t.length = o, t.pos = c, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const MA = (e, t, n) => e & t ^ ~e & n, PA = (e, t, n) => e & t ^ e & n ^ t & n, _A = new Uint32Array([
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
]), Rs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zs = new Uint32Array(64);
let Tw = class extends Bf {
  constructor() {
    super(64, 32, 8, !1), this.A = Rs[0] | 0, this.B = Rs[1] | 0, this.C = Rs[2] | 0, this.D = Rs[3] | 0, this.E = Rs[4] | 0, this.F = Rs[5] | 0, this.G = Rs[6] | 0, this.H = Rs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: c, H: l } = this;
    return [t, n, r, o, s, i, c, l];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      zs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = zs[d - 15], y = zs[d - 2], v = zr(w, 7) ^ zr(w, 18) ^ w >>> 3, x = zr(y, 17) ^ zr(y, 19) ^ y >>> 10;
      zs[d] = x + zs[d - 7] + v + zs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: c, F: l, G: u, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const w = zr(c, 6) ^ zr(c, 11) ^ zr(c, 25), y = p + w + MA(c, l, u) + _A[d] + zs[d] | 0, x = (zr(r, 2) ^ zr(r, 13) ^ zr(r, 22)) + PA(r, o, s) | 0;
      p = u, u = l, l = c, c = i + y | 0, i = s, s = o, o = r, r = y + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, p = p + this.H | 0, this.set(r, o, s, i, c, l, u, p);
  }
  roundClean() {
    zs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, UA = class extends Tw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Nf = oi(() => new Tw());
oi(() => new UA());
const OA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bw = Uint8Array.from({ length: 16 }, (e, t) => t), HA = Bw.map((e) => (9 * e + 5) % 16);
let Mf = [Bw], Pf = [HA];
for (let e = 0; e < 4; e++)
  for (let t of [Mf, Pf])
    t.push(t[e].map((n) => OA[n]));
const Nw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), DA = Mf.map((e, t) => e.map((n) => Nw[t][n])), FA = Pf.map((e, t) => e.map((n) => Nw[t][n])), jA = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), RA = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), wc = (e, t) => e << t | e >>> 32 - t;
function Zp(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const mc = new Uint32Array(16);
let zA = class extends Bf {
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
      mc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, c = this.h2 | 0, l = c, u = this.h3 | 0, p = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = jA[y], L = RA[y], B = Mf[y], _ = Pf[y], A = DA[y], T = FA[y];
      for (let P = 0; P < 16; P++) {
        const K = wc(r + Zp(y, s, c, u) + mc[B[P]] + x, A[P]) + d | 0;
        r = d, d = u, u = wc(c, 10) | 0, c = s, s = K;
      }
      for (let P = 0; P < 16; P++) {
        const K = wc(o + Zp(v, i, l, p) + mc[_[P]] + L, T[P]) + w | 0;
        o = w, w = p, p = wc(l, 10) | 0, l = i, i = K;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + l | 0);
  }
  roundClean() {
    mc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const GA = oi(() => new zA()), bc = BigInt(2 ** 32 - 1), vd = BigInt(32);
function Mw(e, t = !1) {
  return t ? { h: Number(e & bc), l: Number(e >> vd & bc) } : { h: Number(e >> vd & bc) | 0, l: Number(e & bc) | 0 };
}
function KA(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Mw(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const VA = (e, t) => BigInt(e >>> 0) << vd | BigInt(t >>> 0), XA = (e, t, n) => e >>> n, YA = (e, t, n) => e << 32 - n | t >>> n, qA = (e, t, n) => e >>> n | t << 32 - n, WA = (e, t, n) => e << 32 - n | t >>> n, ZA = (e, t, n) => e << 64 - n | t >>> n - 32, JA = (e, t, n) => e >>> n - 32 | t << 64 - n, QA = (e, t) => t, eE = (e, t) => e, tE = (e, t, n) => e << n | t >>> 32 - n, nE = (e, t, n) => t << n | e >>> 32 - n, rE = (e, t, n) => t << n - 32 | e >>> 64 - n, sE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function oE(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const iE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), aE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, cE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), lE = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, uE = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), dE = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, Qe = {
  fromBig: Mw,
  split: KA,
  toBig: VA,
  shrSH: XA,
  shrSL: YA,
  rotrSH: qA,
  rotrSL: WA,
  rotrBH: ZA,
  rotrBL: JA,
  rotr32H: QA,
  rotr32L: eE,
  rotlSH: tE,
  rotlSL: nE,
  rotlBH: rE,
  rotlBL: sE,
  add: oE,
  add3L: iE,
  add3H: aE,
  add4L: cE,
  add4H: lE,
  add5H: dE,
  add5L: uE
}, [fE, hE] = Qe.split([
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
].map((e) => BigInt(e))), Gs = new Uint32Array(80), Ks = new Uint32Array(80);
let Gl = class extends Bf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: c, Dl: l, Eh: u, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Gs[A] = t.getUint32(n), Ks[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Gs[A - 15] | 0, P = Ks[A - 15] | 0, K = Qe.rotrSH(T, P, 1) ^ Qe.rotrSH(T, P, 8) ^ Qe.shrSH(T, P, 7), ie = Qe.rotrSL(T, P, 1) ^ Qe.rotrSL(T, P, 8) ^ Qe.shrSL(T, P, 7), ee = Gs[A - 2] | 0, X = Ks[A - 2] | 0, m = Qe.rotrSH(ee, X, 19) ^ Qe.rotrBH(ee, X, 61) ^ Qe.shrSH(ee, X, 6), I = Qe.rotrSL(ee, X, 19) ^ Qe.rotrBL(ee, X, 61) ^ Qe.shrSL(ee, X, 6), N = Qe.add4L(ie, I, Ks[A - 7], Ks[A - 16]), M = Qe.add4H(N, K, m, Gs[A - 7], Gs[A - 16]);
      Gs[A] = M | 0, Ks[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: c, Cl: l, Dh: u, Dl: p, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: B, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = Qe.rotrSH(d, w, 14) ^ Qe.rotrSH(d, w, 18) ^ Qe.rotrBH(d, w, 41), P = Qe.rotrSL(d, w, 14) ^ Qe.rotrSL(d, w, 18) ^ Qe.rotrBL(d, w, 41), K = d & y ^ ~d & x, ie = w & v ^ ~w & L, ee = Qe.add5L(_, P, ie, hE[A], Ks[A]), X = Qe.add5H(ee, B, T, K, fE[A], Gs[A]), m = ee | 0, I = Qe.rotrSH(r, o, 28) ^ Qe.rotrBH(r, o, 34) ^ Qe.rotrBH(r, o, 39), N = Qe.rotrSL(r, o, 28) ^ Qe.rotrBL(r, o, 34) ^ Qe.rotrBL(r, o, 39), M = r & s ^ r & c ^ s & c, Y = o & i ^ o & l ^ i & l;
      B = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = Qe.add(u | 0, p | 0, X | 0, m | 0), u = c | 0, p = l | 0, c = s | 0, l = i | 0, s = r | 0, i = o | 0;
      const j = Qe.add3L(m, N, Y);
      r = Qe.add3H(j, X, I, M), o = j | 0;
    }
    ({ h: r, l: o } = Qe.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = Qe.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: c, l } = Qe.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: u, l: p } = Qe.add(this.Dh | 0, this.Dl | 0, u | 0, p | 0), { h: d, l: w } = Qe.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = Qe.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = Qe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: _ } = Qe.add(this.Hh | 0, this.Hl | 0, B | 0, _ | 0), this.set(r, o, s, i, c, l, u, p, d, w, y, v, x, L, B, _);
  }
  roundClean() {
    Gs.fill(0), Ks.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, pE = class extends Gl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gE = class extends Gl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yE = class extends Gl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
oi(() => new Gl());
oi(() => new pE());
const wE = oi(() => new gE());
oi(() => new yE());
var ft;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(ft || (ft = {}));
var un;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(un || (un = {}));
function _f(e) {
  return un[e];
}
const mE = () => ({ type: ft.BoolTrue }), bE = () => ({ type: ft.BoolFalse }), xE = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ft.Buffer, value: _e(e) };
}, Jp = BigInt("0xffffffffffffffffffffffffffffffff"), SE = BigInt(0), Qp = BigInt("0x7fffffffffffffffffffffffffffffff"), e0 = BigInt("-170141183460469231731687303715884105728"), vE = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = ed(yt(e))), Xn(e, Uint8Array) && (e = ed(e));
  const t = Mn(e);
  if (t > Qp)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Qp}`);
  if (t < e0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${e0}`);
  return { type: ft.Int, value: t };
}, AE = (e) => {
  const t = Mn(e);
  if (t < SE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > Jp)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Jp}`);
  return { type: ft.UInt, value: t };
};
function EE(e) {
  return { type: ft.List, value: e };
}
function Pw() {
  return { type: ft.OptionalNone };
}
function _w(e) {
  return { type: ft.OptionalSome, value: e };
}
var ye;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ye || (ye = {}));
function kE() {
  return {
    type: ye.Address,
    version: Yo.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function t0(e) {
  if (e && Gw(e, ll))
    throw new Error(`Memo exceeds maximum length of ${ll} bytes`);
  return { type: ye.MemoString, content: e };
}
function Uf(e, t) {
  return {
    type: ye.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function Ad(e) {
  if (yt(e).byteLength != Rl)
    throw Error("Invalid signature");
  return {
    type: ye.MessageSignature,
    data: e
  };
}
function $E(e, t, n) {
  return typeof e == "string" && (e = RE(e)), typeof n == "string" && (n = t0(n)), {
    type: ye.Payload,
    payloadType: vt.TokenTransfer,
    recipient: e,
    amount: Mn(t),
    memo: n ?? t0("")
  };
}
function IE(e, t, n, r) {
  return typeof t == "string" && (t = Mr(t)), typeof n == "string" && (n = Mr(n)), {
    type: ye.Payload,
    payloadType: vt.ContractCall,
    contractAddress: typeof e == "string" ? fo(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function LE(e) {
  return Mr(e, 4, 1e5);
}
function n0(e, t, n) {
  return typeof e == "string" && (e = Mr(e)), typeof t == "string" && (t = LE(t)), typeof n == "number" ? {
    type: ye.Payload,
    payloadType: vt.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ye.Payload,
    payloadType: vt.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function CE() {
  return { type: ye.Payload, payloadType: vt.PoisonMicroblock };
}
function r0(e, t) {
  if (e.byteLength != Po)
    throw Error(`Coinbase buffer size must be ${Po} bytes`);
  return t != null ? {
    type: ye.Payload,
    payloadType: vt.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ye.Payload,
    payloadType: vt.Coinbase,
    coinbaseBytes: e
  };
}
function TE(e, t, n) {
  if (e.byteLength != Po)
    throw Error(`Coinbase buffer size must be ${Po} bytes`);
  if (n.byteLength != yd)
    throw Error(`VRF proof buffer size must be ${yd} bytes`);
  return {
    type: ye.Payload,
    payloadType: vt.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ft.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function BE(e, t, n, r, o, s, i) {
  return {
    type: ye.Payload,
    payloadType: vt.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function Mr(e, t, n) {
  const r = t || 1, o = n || pA;
  if (Gw(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: ye.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function NE(e, t, n) {
  return {
    type: ye.Asset,
    address: fo(e),
    contractName: Mr(t),
    assetName: Mr(n)
  };
}
function fo(e) {
  const t = si.c32addressDecode(e);
  return {
    type: ye.Address,
    version: t[0],
    hash160: t[1]
  };
}
function ME(e, t) {
  const n = fo(e), r = Mr(t);
  return {
    type: ye.Principal,
    prefix: On.Contract,
    address: n,
    contractName: r
  };
}
function PE(e) {
  const t = fo(e);
  return {
    type: ye.Principal,
    prefix: On.Standard,
    address: t
  };
}
function Ci(e, t) {
  return {
    pubKeyEncoding: e,
    type: ye.TransactionAuthField,
    contents: t
  };
}
function ps(e) {
  switch (e.type) {
    case ye.Address:
      return Wa(e);
    case ye.Principal:
      return Uw(e);
    case ye.LengthPrefixedString:
      return Yi(e);
    case ye.MemoString:
      return UE(e);
    case ye.Asset:
      return Hw(e);
    case ye.PostCondition:
      return Fw(e);
    case ye.PublicKey:
      return $d(e);
    case ye.LengthPrefixedList:
      return Of(e);
    case ye.Payload:
      return jw(e);
    case ye.TransactionAuthField:
      return jE(e);
    case ye.MessageSignature:
      return Hf(e);
  }
}
function Wa(e) {
  const t = [];
  return t.push(yt(Ga(e.version, 1))), t.push(yt(e.hash160)), rn(t);
}
function Xi(e) {
  const t = Xn(e, Pt) ? e : new Pt(e), n = Cl(_e(t.readBytes(1))), r = _e(t.readBytes(20));
  return { type: ye.Address, version: n, hash160: r };
}
function Uw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === On.Standard || e.prefix === On.Contract) && t.push(Wa(e.address)), e.prefix === On.Contract && t.push(Yi(e.contractName)), rn(t);
}
function _E(e) {
  const t = Xn(e, Pt) ? e : new Pt(e), n = t.readUInt8Enum(On, (s) => {
    throw new _n(`Unexpected Principal payload type: ${s}`);
  });
  if (n === On.Origin)
    return { type: ye.Principal, prefix: n };
  const r = Xi(t);
  if (n === On.Standard)
    return { type: ye.Principal, prefix: n, address: r };
  const o = mr(t);
  return {
    type: ye.Principal,
    prefix: n,
    address: r,
    contractName: o
  };
}
function Yi(e) {
  const t = [], n = ei(e.content), r = n.byteLength;
  return t.push(yt(Ga(r, e.lengthPrefixBytes))), t.push(n), rn(t);
}
function mr(e, t, n) {
  t = t || 1;
  const r = Xn(e, Pt) ? e : new Pt(e), o = Cl(_e(r.readBytes(t))), s = Ka(r.readBytes(o));
  return Mr(s, t, n ?? 128);
}
function UE(e) {
  const t = [], n = ei(e.content), r = uk(_e(n), ll * 2);
  return t.push(yt(r)), rn(t);
}
function Ow(e) {
  const t = Xn(e, Pt) ? e : new Pt(e);
  let n = Ka(t.readBytes(ll));
  return n = n.replace(/\u0000*$/, ""), { type: ye.MemoString, content: n };
}
function Hw(e) {
  const t = [];
  return t.push(Wa(e.address)), t.push(Yi(e.contractName)), t.push(Yi(e.assetName)), rn(t);
}
function Ed(e) {
  const t = Xn(e, Pt) ? e : new Pt(e);
  return {
    type: ye.Asset,
    address: Xi(t),
    contractName: mr(t),
    assetName: mr(t)
  };
}
function Of(e) {
  const t = e.values, n = [];
  n.push(yt(Ga(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(ps(r));
  return rn(n);
}
function Dw(e, t, n) {
  const r = Xn(e, Pt) ? e : new Pt(e), o = Cl(_e(r.readBytes(4))), s = [];
  for (let i = 0; i < o; i++)
    switch (t) {
      case ye.Address:
        s.push(Xi(r));
        break;
      case ye.LengthPrefixedString:
        s.push(mr(r));
        break;
      case ye.MemoString:
        s.push(Ow(r));
        break;
      case ye.Asset:
        s.push(Ed(r));
        break;
      case ye.PostCondition:
        s.push(HE(r));
        break;
      case ye.PublicKey:
        s.push(Id(r));
        break;
      case ye.TransactionAuthField:
        s.push(FE(r));
        break;
    }
  return Uf(s, n);
}
function OE(e) {
  return _e(Fw(e));
}
function Fw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Uw(e.principal)), (e.conditionType === Dt.Fungible || e.conditionType === Dt.NonFungible) && t.push(Hw(e.asset)), e.conditionType === Dt.NonFungible && t.push(Wr(e.assetName)), t.push(e.conditionCode), e.conditionType === Dt.STX || e.conditionType === Dt.Fungible || e.conditionType === Dt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Li("The post-condition amount may not be larger than 8 bytes");
    t.push(lo(e.amount, 8));
  }
  return rn(t);
}
function HE(e) {
  const t = Xn(e, Pt) ? e : new Pt(e), n = t.readUInt8Enum(Dt, (c) => {
    throw new _n(`Could not read ${c} as PostConditionType`);
  }), r = _E(t);
  let o, s, i;
  switch (n) {
    case Dt.STX:
      return o = t.readUInt8Enum(Ia, (l) => {
        throw new _n(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${_e(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Dt.STX,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case Dt.Fungible:
      return s = Ed(t), o = t.readUInt8Enum(Ia, (l) => {
        throw new _n(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${_e(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Dt.Fungible,
        principal: r,
        conditionCode: o,
        amount: i,
        asset: s
      };
    case Dt.NonFungible:
      s = Ed(t);
      const c = Xr(t);
      return o = t.readUInt8Enum(md, (l) => {
        throw new _n(`Could not read ${l} as FungibleConditionCode`);
      }), {
        type: ye.PostCondition,
        conditionType: Dt.NonFungible,
        principal: r,
        conditionCode: o,
        asset: s,
        assetName: c
      };
    case Dt.Staking:
      return o = t.readUInt8Enum(Ia, (l) => {
        throw new _n(`Could not read ${l} as FungibleConditionCode`);
      }), i = BigInt(`0x${_e(t.readBytes(8))}`), {
        type: ye.PostCondition,
        conditionType: Dt.Staking,
        principal: r,
        conditionCode: o,
        amount: i
      };
    case Dt.PoX: {
      const l = t.readUInt8Enum(bd, (u) => {
        throw new _n(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ye.PostCondition,
        conditionType: Dt.PoX,
        principal: r,
        conditionCode: l
      };
    }
  }
}
function jw(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case vt.TokenTransfer:
      t.push(Wr(e.recipient)), t.push(lo(e.amount, 8)), t.push(ps(e.memo));
      break;
    case vt.ContractCall:
      t.push(ps(e.contractAddress)), t.push(ps(e.contractName)), t.push(ps(e.functionName));
      const n = new Uint8Array(4);
      Ho(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(Wr(r));
      });
      break;
    case vt.SmartContract:
      t.push(ps(e.contractName)), t.push(ps(e.codeBody));
      break;
    case vt.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(ps(e.contractName)), t.push(ps(e.codeBody));
      break;
    case vt.PoisonMicroblock:
      break;
    case vt.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case vt.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(Wr(e.recipient));
      break;
    case vt.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(Wr(e.recipient ? _w(e.recipient) : Pw())), t.push(e.vrfProof);
      break;
    case vt.TenureChange:
      t.push(yt(e.tenureHash)), t.push(yt(e.previousTenureHash)), t.push(yt(e.burnViewHash)), t.push(yt(e.previousTenureEnd)), t.push(Ho(new Uint8Array(4), e.previousTenureBlocks)), t.push(_1(new Uint8Array(1), e.cause)), t.push(yt(e.publicKeyHash));
      break;
  }
  return rn(t);
}
function DE(e) {
  const t = Xn(e, Pt) ? e : new Pt(e);
  switch (t.readUInt8Enum(vt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case vt.TokenTransfer:
      const r = Xr(t), o = Mn(t.readBytes(8)), s = Ow(t);
      return $E(r, o, s);
    case vt.ContractCall:
      const i = Xi(t), c = mr(t), l = mr(t), u = [], p = t.readUInt32BE();
      for (let T = 0; T < p; T++) {
        const P = Xr(t);
        u.push(P);
      }
      return IE(i, c, l, u);
    case vt.SmartContract:
      const d = mr(t), w = mr(t, 4, 1e5);
      return n0(d, w);
    case vt.VersionedSmartContract: {
      const T = t.readUInt8Enum(wd, (ie) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ie}`);
      }), P = mr(t), K = mr(t, 4, kA);
      return n0(P, K, T);
    }
    case vt.PoisonMicroblock:
      return CE();
    case vt.Coinbase: {
      const T = t.readBytes(Po);
      return r0(T);
    }
    case vt.CoinbaseToAltRecipient: {
      const T = t.readBytes(Po), P = Xr(t);
      return r0(T, P);
    }
    case vt.NakamotoCoinbase: {
      const T = t.readBytes(Po), P = Xr(t), K = t.readBytes(yd);
      return TE(T, P, K);
    }
    case vt.TenureChange:
      const y = _e(t.readBytes(20)), v = _e(t.readBytes(20)), x = _e(t.readBytes(20)), L = _e(t.readBytes(32)), B = t.readUInt32BE(), _ = t.readUInt8Enum(xd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = _e(t.readBytes(20));
      return BE(y, v, x, L, B, _, A);
  }
}
function kd(e) {
  const t = Xn(e, Pt) ? e : new Pt(e);
  return Ad(_e(t.readBytes(Rl)));
}
function FE(e) {
  const t = Xn(e, Pt) ? e : new Pt(e), n = t.readUInt8Enum(Lr, (r) => {
    throw new _n(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Lr.PublicKeyCompressed:
      return Ci(Vt.Compressed, Id(t));
    case Lr.PublicKeyUncompressed:
      return Ci(Vt.Uncompressed, na(Sk(Id(t).data)));
    case Lr.SignatureCompressed:
      return Ci(Vt.Compressed, kd(t));
    case Lr.SignatureUncompressed:
      return Ci(Vt.Uncompressed, kd(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Hf(e) {
  return yt(e.data);
}
function jE(e) {
  const t = [];
  switch (e.contents.type) {
    case ye.PublicKey:
      t.push(e.pubKeyEncoding === Vt.Compressed ? Lr.PublicKeyCompressed : Lr.PublicKeyUncompressed), t.push(yt(xk(e.contents.data)));
      break;
    case ye.MessageSignature:
      t.push(e.pubKeyEncoding === Vt.Compressed ? Lr.SignatureCompressed : Lr.SignatureUncompressed), t.push(Hf(e.contents));
      break;
  }
  return rn(t);
}
function $d(e) {
  return e.data.slice();
}
function Id(e) {
  const t = Xn(e, Pt) ? e : new Pt(e), n = t.readUInt8(), r = n === 4 ? wA : yA;
  return na(rn([n, t.readBytes(r)]));
}
function Df(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Tt.P2PKH || t === Tt.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Tt.P2WPKH || t === Tt.P2WSH || t === Tt.P2WSHNonSequential) && !r.map((o) => o.data).every(ra))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Tt.P2PKH:
      return xc(e, dk(r[0].data));
    case Tt.P2WPKH:
      return xc(e, fk(r[0].data));
    case Tt.P2SH:
    case Tt.P2SHNonSequential:
      return xc(e, hk(n, r.map($d)));
    case Tt.P2WSH:
    case Tt.P2WSHNonSequential:
      return xc(e, pk(n, r.map($d)));
  }
}
function xc(e, t) {
  return { type: ye.Address, version: e, hash160: t };
}
function Ff(e) {
  return si.c32address(e.version, e.hash160);
}
function s0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return NE(t, n, r);
}
function pa(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return ME(t, n);
  } else
    return PE(e);
}
function RE(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return KE(t, n);
  } else
    return zE(e);
}
function zE(e) {
  const t = fo(e);
  return { type: ft.PrincipalStandard, value: Ff(t) };
}
function GE(e) {
  return { type: ft.PrincipalStandard, value: Ff(e) };
}
function KE(e, t) {
  const n = fo(e), r = Mr(t);
  return Rw(n, r);
}
function Rw(e, t) {
  if (ei(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: ft.PrincipalContract,
    value: `${Ff(e)}.${t.content}`
  };
}
function VE(e) {
  return { type: ft.ResponseErr, value: e };
}
function XE(e) {
  return { type: ft.ResponseOk, value: e };
}
const YE = (e) => ({ type: ft.StringASCII, value: e }), qE = (e) => ({ type: ft.StringUTF8, value: e });
function WE(e) {
  for (const t in e)
    if (!gk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ft.Tuple, value: e };
}
function Xr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Pt(yt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Pt(e) : t = e;
  switch (t.readUInt8Enum(un, (r) => {
    throw new _n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case un.int:
      return vE(ed(t.readBytes(16)));
    case un.uint:
      return AE(t.readBytes(16));
    case un.buffer:
      const r = t.readUInt32BE();
      return xE(t.readBytes(r));
    case un.true:
      return mE();
    case un.false:
      return bE();
    case un.address:
      const o = Xi(t);
      return GE(o);
    case un.contract:
      const s = Xi(t), i = mr(t);
      return Rw(s, i);
    case un.ok:
      return XE(Xr(t));
    case un.err:
      return VE(Xr(t));
    case un.none:
      return Pw();
    case un.some:
      return _w(Xr(t));
    case un.list:
      const c = t.readUInt32BE(), l = [];
      for (let x = 0; x < c; x++)
        l.push(Xr(t));
      return EE(l);
    case un.tuple:
      const u = t.readUInt32BE(), p = {};
      for (let x = 0; x < u; x++) {
        const L = mr(t).content;
        if (L === void 0)
          throw new _n('"content" is undefined');
        p[L] = Xr(t);
      }
      return WE(p);
    case un.ascii:
      const d = t.readUInt32BE(), w = I1(t.readBytes(d));
      return YE(w);
    case un.utf8:
      const y = t.readUInt32BE(), v = Ka(t.readBytes(y));
      return qE(v);
    default:
      throw new _n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function es(e, t) {
  return rn([_f(e), t]);
}
function ZE(e) {
  return new Uint8Array([_f(e.type)]);
}
function JE(e) {
  return e.type === ft.OptionalNone ? new Uint8Array([_f(e.type)]) : es(e.type, Wr(e.value));
}
function QE(e) {
  const t = new Uint8Array(4);
  return Ho(t, Math.ceil(e.value.length / 2), 0), es(e.type, Jr(t, yt(e.value)));
}
function ek(e) {
  const t = cf(v1(BigInt(e.value), BigInt(gA)), kw);
  return es(e.type, t);
}
function tk(e) {
  const t = cf(BigInt(e.value), kw);
  return es(e.type, t);
}
function nk(e) {
  return es(e.type, Wa(fo(e.value)));
}
function rk(e) {
  const [t, n] = yk(e.value);
  return es(e.type, Jr(Wa(fo(t)), Yi(Mr(n))));
}
function sk(e) {
  return es(e.type, Wr(e.value));
}
function ok(e) {
  const t = [], n = new Uint8Array(4);
  Ho(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const o = Wr(r);
    t.push(o);
  }
  return es(e.type, rn(t));
}
function ik(e) {
  const t = [], n = new Uint8Array(4);
  Ho(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Mr(o);
    t.push(Yi(s));
    const i = Wr(e.value[o]);
    t.push(i);
  }
  return es(e.type, rn(t));
}
function zw(e, t) {
  const n = [], r = t == "ascii" ? $1(e.value) : ei(e.value), o = new Uint8Array(4);
  return Ho(o, r.length, 0), n.push(o), n.push(r), es(e.type, rn(n));
}
function ak(e) {
  return zw(e, "ascii");
}
function ck(e) {
  return zw(e, "utf8");
}
function o0(e) {
  return _e(Wr(e));
}
function Wr(e) {
  switch (e.type) {
    case ft.BoolTrue:
    case ft.BoolFalse:
      return ZE(e);
    case ft.OptionalNone:
    case ft.OptionalSome:
      return JE(e);
    case ft.Buffer:
      return QE(e);
    case ft.UInt:
      return tk(e);
    case ft.Int:
      return ek(e);
    case ft.PrincipalStandard:
      return nk(e);
    case ft.PrincipalContract:
      return rk(e);
    case ft.ResponseOk:
    case ft.ResponseErr:
      return sk(e);
    case ft.List:
      return ok(e);
    case ft.Tuple:
      return ik(e);
    case ft.StringASCII:
      return ak(e);
    case ft.StringUTF8:
      return ck(e);
    default:
      throw new Li("Unable to serialize. Invalid Clarity Value.");
  }
}
const lk = (e) => e.length % 2 ? `0${e}` : e, uk = (e, t) => e.padEnd(t, "0"), Gw = (e, t) => e ? ei(e).length > t : !1;
function Ld(e) {
  return Sw(e);
}
const Ma = (e) => GA(Nf(e)), jf = (e) => _e(wE(e)), dk = (e) => _e(Ma(e)), fk = (e) => {
  const t = Ma(e), n = Jr(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Ma(n);
  return _e(r);
}, hk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = rn(n), o = Ma(r);
  return _e(o);
}, pk = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + t.length), n.push(174);
  const r = rn(n), o = Nf(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = rn(s), c = Ma(i);
  return _e(c);
};
function gk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function yk(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
Qt.hmacSha256Sync = (e, ...t) => {
  const n = Cw.create(Nf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function na(e) {
  return e = typeof e == "string" ? yt(e) : e, {
    type: ye.PublicKey,
    data: e
  };
}
function wk(e, t, n = Vt.Compressed) {
  const r = B1(t), o = new cr(op(r.r), op(r.s)), s = ot.fromSignature(e, o, r.recoveryId), i = n === Vt.Compressed;
  return s.toHex(i);
}
function mk(e) {
  return typeof e == "string" ? e : _e(e);
}
const Rf = mk;
function Kw(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === T1;
}
function ra(e) {
  return !Rf(e).startsWith("04");
}
function bk(e) {
  e = lf(e);
  const t = Kw(e);
  return _e(Va(e.slice(0, 32), t));
}
function xk(e) {
  return ot.fromHex(Rf(e)).toHex(!0);
}
function Sk(e) {
  return ot.fromHex(Rf(e)).toHex(!1);
}
function vk(e, t) {
  e = lf(e);
  const [n, r] = Bl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ga(r, 1) + cr.fromHex(n).toCompactHex();
}
function zf() {
  return {
    type: ye.MessageSignature,
    data: _e(new Uint8Array(Rl))
  };
}
function Vw(e, t, n, r) {
  const o = Df(0, e, 1, [na(t)]).hash160, s = ra(t) ? Vt.Compressed : Vt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Mn(n),
    fee: Mn(r),
    keyEncoding: s,
    signature: zf()
  };
}
function Pa(e) {
  return "signature" in e;
}
function i0(e) {
  return e === Tt.P2SH || e === Tt.P2WSH;
}
function Ak(e) {
  return e === Tt.P2SHNonSequential || e === Tt.P2WSHNonSequential;
}
function a0(e) {
  const t = Ld(e);
  return t.nonce = 0, t.fee = 0, Pa(t) ? t.signature = zf() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Ek(e) {
  const t = [
    e.hashMode,
    yt(e.signer),
    lo(e.nonce, 8),
    lo(e.fee, 8),
    e.keyEncoding,
    Hf(e.signature)
  ];
  return rn(t);
}
function kk(e) {
  const t = [
    e.hashMode,
    yt(e.signer),
    lo(e.nonce, 8),
    lo(e.fee, 8)
  ], n = Uf(e.fields);
  t.push(Of(n));
  const r = new Uint8Array(2);
  return M1(r, e.signaturesRequired, 0), t.push(r), rn(t);
}
function $k(e, t) {
  const n = _e(t.readBytes(20)), r = BigInt(`0x${_e(t.readBytes(8))}`), o = BigInt(`0x${_e(t.readBytes(8))}`), s = t.readUInt8Enum(Vt, (c) => {
    throw new _n(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === Tt.P2WPKH && s != Vt.Compressed)
    throw new _n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = kd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function Ik(e, t) {
  const n = _e(t.readBytes(20)), r = BigInt("0x" + _e(t.readBytes(8))), o = BigInt("0x" + _e(t.readBytes(8))), s = Dw(t, ye.TransactionAuthField).values;
  let i = !1, c = 0;
  for (const u of s)
    switch (u.contents.type) {
      case ye.PublicKey:
        ra(u.contents.data) || (i = !0);
        break;
      case ye.MessageSignature:
        if (u.pubKeyEncoding === Vt.Uncompressed && (i = !0), c += 1, c === 65536)
          throw new Co("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = t.readUInt16BE();
  if (i && (e === Tt.P2WSH || e === Tt.P2WSHNonSequential))
    throw new Co("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: l
  };
}
function vu(e) {
  return Pa(e) ? Ek(e) : kk(e);
}
function Au(e) {
  const t = e.readUInt8Enum(Tt, (n) => {
    throw new _n(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Tt.P2PKH || t === Tt.P2WPKH ? $k(t, e) : Ik(t, e);
}
function Xw(e, t, n, r) {
  const s = e + _e(new Uint8Array([t])) + _e(lo(n, 8)) + _e(lo(r, 8));
  if (yt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return jf(yt(s));
}
function Yw(e, t, n) {
  const r = 33 + Rl, o = ra(t.data) ? Vt.Compressed : Vt.Uncompressed, s = e + lk(o.toString(16)) + n, i = yt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return jf(i);
}
function Lk(e, t, n, r, o) {
  const s = Xw(e, t, n, r), i = vk(o, s), c = na(bk(o)), l = Yw(s, c, i);
  return {
    nextSig: i,
    nextSigHash: l
  };
}
function qw(e, t, n, r, o, s) {
  const i = Xw(e, t, n, r), c = na(wk(i, s, o)), l = Yw(i, c, s);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function Ck() {
  const e = Vw(Tt.P2PKH, "", 0, 0);
  return e.signer = kE().hash160, e.keyEncoding = Vt.Compressed, e.signature = zf(), e;
}
function c0(e, t, n) {
  return Pa(e) ? Tk(e, t, n) : Bk(e, t, n);
}
function Tk(e, t, n) {
  const { pubKey: r, nextSigHash: o } = qw(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), s = Df(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new Co(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function Bk(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const l of e.fields)
    switch (l.contents.type) {
      case ye.PublicKey:
        ra(l.contents.data) || (s = !0), r.push(l.contents);
        break;
      case ye.MessageSignature:
        l.pubKeyEncoding === Vt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: p } = qw(o, n, e.fee, e.nonce, l.pubKeyEncoding, l.contents.data);
        if (i0(e.hashMode) && (o = p), r.push(u), i += 1, i === 65536)
          throw new Co("Too many signatures");
        break;
    }
  if (i0(e.hashMode) && i !== e.signaturesRequired || Ak(e.hashMode) && i < e.signaturesRequired)
    throw new Co("Incorrect number of signatures");
  if (s && (e.hashMode === Tt.P2WSH || e.hashMode === Tt.P2WSHNonSequential))
    throw new Co("Uncompressed keys are not allowed in this hash mode");
  const c = Df(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new Co(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return o;
}
function Ww(e) {
  return {
    authType: Zt.Standard,
    spendingCondition: e
  };
}
function Zw(e, t) {
  return {
    authType: Zt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || Vw(Tt.P2PKH, "0".repeat(66), 0, 0)
  };
}
function l0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Zt.Standard:
        return Ww(a0(e.spendingCondition));
      case Zt.Sponsored:
        return Zw(a0(e.spendingCondition), Ck());
      default:
        throw new dl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Nk(e, t) {
  switch (e.authType) {
    case Zt.Standard:
      return c0(e.spendingCondition, t, Zt.Standard);
    case Zt.Sponsored:
      return c0(e.spendingCondition, t, Zt.Standard);
    default:
      throw new dl("Invalid origin auth type");
  }
}
function Mk(e, t) {
  switch (e.authType) {
    case Zt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Mn(t)
      };
      return { ...e, spendingCondition: n };
    case Zt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Mn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Pk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Mn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function _k(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Mn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Uk(e, t) {
  const n = {
    ...t,
    nonce: Mn(t.nonce),
    fee: Mn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Ok(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Zt.Standard:
      t.push(vu(e.spendingCondition));
      break;
    case Zt.Sponsored:
      t.push(vu(e.spendingCondition)), t.push(vu(e.sponsorSpendingCondition));
      break;
  }
  return rn(t);
}
function Hk(e) {
  const t = e.readUInt8Enum(Zt, (r) => {
    throw new _n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Zt.Standard:
      return n = Au(e), Ww(n);
    case Zt.Sponsored:
      n = Au(e);
      const r = Au(e);
      return Zw(n, r);
  }
}
class Dk {
  constructor({ auth: t, payload: n, postConditions: r = Uf([]), postConditionMode: o = ul.Deny, transactionVersion: s, chainId: i, network: c = "mainnet" }) {
    c = fA(c), this.transactionVersion = s ?? c.transactionVersion, this.chainId = i ?? c.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Mn(n.amount)
    } : this.payload = n, this.postConditionMode = o, this.postConditions = r, this.anchorMode = rr.Any;
  }
  signBegin() {
    const t = Ld(this);
    return t.auth = l0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Ld(this);
    return t.auth = l0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Nk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Zt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Zt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Zt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : na(t), r = this.auth.spendingCondition;
    if (r && !Pa(r)) {
      const o = ra(n.data);
      r.fields.push(Ci(o ? Vt.Compressed : Vt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = Lk(n, r, t.fee, t.nonce, o);
    if (Pa(t))
      t.signature = Ad(s);
    else {
      const c = Kw(o);
      t.fields.push(Ci(c ? Vt.Compressed : Vt.Uncompressed, Ad(s)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return jf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Zt.Sponsored)
      throw new dl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Uk(this.auth, t);
  }
  setFee(t) {
    this.auth = Mk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Pk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Zt.Sponsored)
      throw new dl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = _k(this.auth, t);
  }
  serialize() {
    return _e(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Li('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Li('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Li('"auth" is undefined');
    if (this.payload === void 0)
      throw new Li('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ho(n, this.chainId, 0), t.push(n), t.push(Ok(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(Of(this.postConditions)), t.push(jw(this.payload)), rn(t);
  }
}
function Fk(e) {
  const t = Xn(e, Pt) ? e : new Pt(e), n = t.readUInt8Enum(Xo, (p) => {
    throw new Error(`Could not parse ${p} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = Hk(t), s = t.readUInt8Enum(rr, (p) => {
    throw new Error(`Could not parse ${p} as AnchorMode`);
  }), i = t.readUInt8Enum(ul, (p) => {
    throw new Error(`Could not parse ${p} as PostConditionMode`);
  }), c = Dw(t, ye.PostCondition), l = DE(t), u = new Dk({
    transactionVersion: n,
    chainId: r,
    auth: o,
    payload: l,
    postConditions: c,
    postConditionMode: i
  });
  return u.anchorMode = s, u;
}
const u0 = BigInt("18446744073709551615");
function Eu(e) {
  const t = Mn(e);
  if (t < 0n || t > u0)
    throw new RangeError(`Post-condition amount must be between 0 and ${u0} (u64 max), received: ${t}`);
  return t;
}
var Cd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(Cd || (Cd = {}));
var Td;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Td || (Td = {}));
function jk(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Dt.STX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: On.Origin } : pa(e.address),
        conditionCode: Sc(e.condition),
        amount: Eu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Dt.Fungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: On.Origin } : pa(e.address),
        conditionCode: Sc(e.condition),
        amount: Eu(e.amount),
        asset: s0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Dt.NonFungible,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: On.Origin } : pa(e.address),
        conditionCode: Sc(e.condition),
        asset: s0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Dt.Staking,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: On.Origin } : pa(e.address),
        conditionCode: Sc(e.condition),
        amount: Eu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: ye.PostCondition,
        conditionType: Dt.PoX,
        principal: e.address === "origin" ? { type: ye.Principal, prefix: On.Origin } : pa(e.address),
        conditionCode: Rk(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Sc(e) {
  return Cd[e];
}
function Rk(e) {
  return Td[e];
}
function Jw(e) {
  const t = jk(e);
  return OE(t);
}
function zk(e, t, n) {
  return Kf(Qw(e), n);
}
function Qw(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = _a(r);
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
    return BigInt(`0x${Vk(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gf(e, t = 8) {
  return (typeof e == "bigint" ? e : Qw(e)).toString(16).padStart(t * 2, "0");
}
function Kf(e, t = 16) {
  const n = Gf(e, t);
  return _a(n);
}
function Gk(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const Kk = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Vk(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += Kk[n];
  return t;
}
function _a(e) {
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
function Vf(e) {
  return new TextEncoder().encode(e);
}
function Xk(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function Yk(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function d0(e) {
  if (e.some(Yk))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Xf(...e) {
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
  return Xf(...e.map((t) => typeof t == "number" ? d0([t]) : t instanceof Array ? d0(t) : t));
}
function Kl(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Bd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Bd || (Bd = {}));
Bd.Mainnet;
const qk = 128, Wk = 128, em = 16;
var Nd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Nd || (Nd = {}));
var f0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(f0 || (f0 = {}));
var h0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(h0 || (h0 = {}));
var $r;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})($r || ($r = {}));
const ku = ["onChainOnly", "offChainOnly", "any"];
ku[0] + "", $r.OnChainOnly, ku[1] + "", $r.OffChainOnly, ku[2] + "", $r.Any, $r.OnChainOnly + "", $r.OnChainOnly, $r.OffChainOnly + "", $r.OffChainOnly, $r.Any + "", $r.Any;
var Md;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Md || (Md = {}));
Md.Mainnet;
var p0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(p0 || (p0 = {}));
var ko;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(ko || (ko = {}));
var g0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(g0 || (g0 = {}));
var y0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(y0 || (y0 = {}));
var w0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(w0 || (w0 = {}));
var m0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(m0 || (m0 = {}));
var b0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(b0 || (b0 = {}));
var x0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(x0 || (x0 = {}));
var Pd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Pd || (Pd = {}));
var S0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(S0 || (S0 = {}));
var v0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(v0 || (v0 = {}));
function _d(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function Zk(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function tm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function Jk(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  _d(e.outputLen), _d(e.blockLen);
}
function Qk(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function e3(e, t) {
  tm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $u = {
  number: _d,
  bool: Zk,
  bytes: tm,
  hash: Jk,
  exists: Qk,
  output: e3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Iu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Gr = (e, t) => e << 32 - t | e >>> t, t3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!t3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function n3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function nm(e) {
  if (typeof e == "string" && (e = n3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let r3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ii(e) {
  const t = (r) => e().update(nm(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function s3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), c = Number(n & s), l = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + l, i, r), e.setUint32(t + u, c, r);
}
let Yf = class extends r3 {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Iu(this.buffer);
  }
  update(t) {
    $u.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = nm(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const c = Math.min(o - this.pos, s - i);
      if (c === o) {
        const l = Iu(t);
        for (; o <= s - i; i += o)
          this.process(l, i);
        continue;
      }
      r.set(t.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    $u.exists(this), $u.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    s3(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Iu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, p = this.get();
    if (u > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      c.setUint32(4 * d, p[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: c } = this;
    return t.length = o, t.pos = c, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
};
const o3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rm = Uint8Array.from({ length: 16 }, (e, t) => t), i3 = rm.map((e) => (9 * e + 5) % 16);
let qf = [rm], Wf = [i3];
for (let e = 0; e < 4; e++)
  for (let t of [qf, Wf])
    t.push(t[e].map((n) => o3[n]));
const sm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), a3 = qf.map((e, t) => e.map((n) => sm[t][n])), c3 = Wf.map((e, t) => e.map((n) => sm[t][n])), l3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), u3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), vc = (e, t) => e << t | e >>> 32 - t;
function A0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ac = new Uint32Array(16);
let d3 = class extends Yf {
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
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, c = this.h2 | 0, l = c, u = this.h3 | 0, p = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = l3[y], L = u3[y], B = qf[y], _ = Wf[y], A = a3[y], T = c3[y];
      for (let P = 0; P < 16; P++) {
        const K = vc(r + A0(y, s, c, u) + Ac[B[P]] + x, A[P]) + d | 0;
        r = d, d = u, u = vc(c, 10) | 0, c = s, s = K;
      }
      for (let P = 0; P < 16; P++) {
        const K = vc(o + A0(v, i, l, p) + Ac[_[P]] + L, T[P]) + w | 0;
        o = w, w = p, p = vc(l, 10) | 0, l = i, i = K;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + l | 0);
  }
  roundClean() {
    Ac.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ii(() => new d3());
const f3 = (e, t, n) => e & t ^ ~e & n, h3 = (e, t, n) => e & t ^ e & n ^ t & n, p3 = new Uint32Array([
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
]), Vs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xs = new Uint32Array(64);
let om = class extends Yf {
  constructor() {
    super(64, 32, 8, !1), this.A = Vs[0] | 0, this.B = Vs[1] | 0, this.C = Vs[2] | 0, this.D = Vs[3] | 0, this.E = Vs[4] | 0, this.F = Vs[5] | 0, this.G = Vs[6] | 0, this.H = Vs[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: c, H: l } = this;
    return [t, n, r, o, s, i, c, l];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Xs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Xs[d - 15], y = Xs[d - 2], v = Gr(w, 7) ^ Gr(w, 18) ^ w >>> 3, x = Gr(y, 17) ^ Gr(y, 19) ^ y >>> 10;
      Xs[d] = x + Xs[d - 7] + v + Xs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: c, F: l, G: u, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const w = Gr(c, 6) ^ Gr(c, 11) ^ Gr(c, 25), y = p + w + f3(c, l, u) + p3[d] + Xs[d] | 0, x = (Gr(r, 2) ^ Gr(r, 13) ^ Gr(r, 22)) + h3(r, o, s) | 0;
      p = u, u = l, l = c, c = i + y | 0, i = s, s = o, o = r, r = y + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, p = p + this.H | 0, this.set(r, o, s, i, c, l, u, p);
  }
  roundClean() {
    Xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, g3 = class extends om {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ii(() => new om());
ii(() => new g3());
const Ec = BigInt(2 ** 32 - 1), Ud = BigInt(32);
function im(e, t = !1) {
  return t ? { h: Number(e & Ec), l: Number(e >> Ud & Ec) } : { h: Number(e >> Ud & Ec) | 0, l: Number(e & Ec) | 0 };
}
function y3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = im(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const w3 = (e, t) => BigInt(e >>> 0) << Ud | BigInt(t >>> 0), m3 = (e, t, n) => e >>> n, b3 = (e, t, n) => e << 32 - n | t >>> n, x3 = (e, t, n) => e >>> n | t << 32 - n, S3 = (e, t, n) => e << 32 - n | t >>> n, v3 = (e, t, n) => e << 64 - n | t >>> n - 32, A3 = (e, t, n) => e >>> n - 32 | t << 64 - n, E3 = (e, t) => t, k3 = (e, t) => e, $3 = (e, t, n) => e << n | t >>> 32 - n, I3 = (e, t, n) => t << n | e >>> 32 - n, L3 = (e, t, n) => t << n - 32 | e >>> 64 - n, C3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function T3(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const B3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), N3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, M3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), P3 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, _3 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), U3 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: im,
  split: y3,
  toBig: w3,
  shrSH: m3,
  shrSL: b3,
  rotrSH: x3,
  rotrSL: S3,
  rotrBH: v3,
  rotrBL: A3,
  rotr32H: E3,
  rotr32L: k3,
  rotlSH: $3,
  rotlSL: I3,
  rotlBH: L3,
  rotlBL: C3,
  add: T3,
  add3L: B3,
  add3H: N3,
  add4L: M3,
  add4H: P3,
  add5H: U3,
  add5L: _3
}, [O3, H3] = et.split([
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
].map((e) => BigInt(e))), Ys = new Uint32Array(80), qs = new Uint32Array(80);
let Vl = class extends Yf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: c, Dl: l, Eh: u, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Ys[A] = t.getUint32(n), qs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Ys[A - 15] | 0, P = qs[A - 15] | 0, K = et.rotrSH(T, P, 1) ^ et.rotrSH(T, P, 8) ^ et.shrSH(T, P, 7), ie = et.rotrSL(T, P, 1) ^ et.rotrSL(T, P, 8) ^ et.shrSL(T, P, 7), ee = Ys[A - 2] | 0, X = qs[A - 2] | 0, m = et.rotrSH(ee, X, 19) ^ et.rotrBH(ee, X, 61) ^ et.shrSH(ee, X, 6), I = et.rotrSL(ee, X, 19) ^ et.rotrBL(ee, X, 61) ^ et.shrSL(ee, X, 6), N = et.add4L(ie, I, qs[A - 7], qs[A - 16]), M = et.add4H(N, K, m, Ys[A - 7], Ys[A - 16]);
      Ys[A] = M | 0, qs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: c, Cl: l, Dh: u, Dl: p, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: B, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, w, 14) ^ et.rotrSH(d, w, 18) ^ et.rotrBH(d, w, 41), P = et.rotrSL(d, w, 14) ^ et.rotrSL(d, w, 18) ^ et.rotrBL(d, w, 41), K = d & y ^ ~d & x, ie = w & v ^ ~w & L, ee = et.add5L(_, P, ie, H3[A], qs[A]), X = et.add5H(ee, B, T, K, O3[A], Ys[A]), m = ee | 0, I = et.rotrSH(r, o, 28) ^ et.rotrBH(r, o, 34) ^ et.rotrBH(r, o, 39), N = et.rotrSL(r, o, 28) ^ et.rotrBL(r, o, 34) ^ et.rotrBL(r, o, 39), M = r & s ^ r & c ^ s & c, Y = o & i ^ o & l ^ i & l;
      B = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = et.add(u | 0, p | 0, X | 0, m | 0), u = c | 0, p = l | 0, c = s | 0, l = i | 0, s = r | 0, i = o | 0;
      const j = et.add3L(m, N, Y);
      r = et.add3H(j, X, I, M), o = j | 0;
    }
    ({ h: r, l: o } = et.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = et.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: c, l } = et.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: u, l: p } = et.add(this.Dh | 0, this.Dl | 0, u | 0, p | 0), { h: d, l: w } = et.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = et.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: _ } = et.add(this.Hh | 0, this.Hl | 0, B | 0, _ | 0), this.set(r, o, s, i, c, l, u, p, d, w, y, v, x, L, B, _);
  }
  roundClean() {
    Ys.fill(0), qs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, D3 = class extends Vl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, F3 = class extends Vl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, j3 = class extends Vl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ii(() => new Vl());
ii(() => new D3());
ii(() => new F3());
ii(() => new j3());
function R3(e, t, n) {
  const o = qk;
  if (s4(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: Nd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: o
  };
}
var mn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(mn || (mn = {}));
let z3 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, am = class extends z3 {
  constructor(t) {
    super(t);
  }
};
function Xl(e) {
  const t = [];
  return t.push(_a(Gf(e.version, 1))), t.push(_a(e.hash160)), As(t);
}
function G3(e) {
  const t = [];
  return t.push(e.prefix), t.push(Xl(e.address)), e.prefix === Pd.Contract && t.push(Ua(e.contractName)), As(t);
}
function Ua(e) {
  const t = [], n = Vf(e.content), r = n.byteLength;
  return t.push(_a(Gf(r, e.lengthPrefixBytes))), t.push(n), As(t);
}
function K3(e) {
  const t = [];
  return t.push(Xl(e.address)), t.push(Ua(e.contractName)), t.push(Ua(e.assetName)), As(t);
}
function cm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(G3(e.principal)), (e.conditionType === ko.Fungible || e.conditionType === ko.NonFungible) && t.push(K3(e.assetInfo)), e.conditionType === ko.NonFungible && t.push(qo(e.assetName)), t.push(e.conditionCode), e.conditionType === ko.STX || e.conditionType === ko.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new am("The post-condition amount may not be larger than 8 bytes");
    t.push(zk(e.amount, !1, 8));
  }
  return As(t);
}
function ts(e, t) {
  return As([e, t]);
}
function V3(e) {
  return new Uint8Array([e.type]);
}
function X3(e) {
  return e.type === mn.OptionalNone ? new Uint8Array([e.type]) : ts(e.type, qo(e.value));
}
function Y3(e) {
  const t = new Uint8Array(4);
  return Kl(t, e.buffer.length, 0), ts(e.type, Xf(t, e.buffer));
}
function q3(e) {
  const t = Kf(Gk(e.value, BigInt(Wk)), em);
  return ts(e.type, t);
}
function W3(e) {
  const t = Kf(e.value, em);
  return ts(e.type, t);
}
function Z3(e) {
  return ts(e.type, Xl(e.address));
}
function J3(e) {
  return ts(e.type, Xf(Xl(e.address), Ua(e.contractName)));
}
function Q3(e) {
  return ts(e.type, qo(e.value));
}
function e4(e) {
  const t = [], n = new Uint8Array(4);
  Kl(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = qo(r);
    t.push(o);
  }
  return ts(e.type, As(t));
}
function t4(e) {
  const t = [], n = new Uint8Array(4);
  Kl(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = R3(o);
    t.push(Ua(s));
    const i = qo(e.data[o]);
    t.push(i);
  }
  return ts(e.type, As(t));
}
function lm(e, t) {
  const n = [], r = t == "ascii" ? Xk(e.data) : Vf(e.data), o = new Uint8Array(4);
  return Kl(o, r.length, 0), n.push(o), n.push(r), ts(e.type, As(n));
}
function n4(e) {
  return lm(e, "ascii");
}
function r4(e) {
  return lm(e, "utf8");
}
function qo(e) {
  switch (e.type) {
    case mn.BoolTrue:
    case mn.BoolFalse:
      return V3(e);
    case mn.OptionalNone:
    case mn.OptionalSome:
      return X3(e);
    case mn.Buffer:
      return Y3(e);
    case mn.UInt:
      return W3(e);
    case mn.Int:
      return q3(e);
    case mn.PrincipalStandard:
      return Z3(e);
    case mn.PrincipalContract:
      return J3(e);
    case mn.ResponseOk:
    case mn.ResponseErr:
      return Q3(e);
    case mn.List:
      return e4(e);
    case mn.Tuple:
      return t4(e);
    case mn.StringASCII:
      return n4(e);
    case mn.StringUTF8:
      return r4(e);
    default:
      throw new am("Unable to serialize. Invalid Clarity Value.");
  }
}
const s4 = (e, t) => e ? Vf(e).length > t : !1, o4 = "connect-ui";
let Gc, um, sr = !1, Od = !1;
const vs = (e, t = "") => () => {
}, i4 = (e, t) => () => {
}, a4 = "{visibility:hidden}.hydrated{visibility:inherit}", E0 = {}, c4 = "http://www.w3.org/2000/svg", l4 = "http://www.w3.org/1999/xhtml", u4 = (e) => e != null, Zf = (e) => (e = typeof e, e === "object" || e === "function");
function dm(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Ye = (e, t, ...n) => {
  let r = null, o = !1, s = !1;
  const i = [], c = (u) => {
    for (let p = 0; p < u.length; p++)
      r = u[p], Array.isArray(r) ? c(r) : r != null && typeof r != "boolean" && ((o = typeof e != "function" && !Zf(r)) && (r = String(r)), o && s ? i[i.length - 1].$text$ += r : i.push(o ? Hd(null, r) : r), s = o);
  };
  if (c(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((p) => u[p]).join(" "));
  }
  const l = Hd(e, null);
  return l.$attrs$ = t, i.length > 0 && (l.$children$ = i), l;
}, Hd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, d4 = {}, f4 = (e) => e && e.$tag$ === d4, h4 = (e, t) => e != null && !Zf(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, p4 = (e) => sa(e).$hostElement$, g4 = (e, t, n) => {
  const r = Bn.ce(t, n);
  return e.dispatchEvent(r), r;
}, k0 = /* @__PURE__ */ new WeakMap(), y4 = (e, t, n) => {
  let r = fl.get(e);
  U4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, fl.set(e, r);
}, w4 = (e, t, n, r) => {
  var o;
  let s = fm(t);
  const i = fl.get(s);
  if (e = e.nodeType === 11 ? e : Zr, i)
    if (typeof i == "string") {
      e = e.head || e;
      let c = k0.get(e), l;
      if (c || k0.set(e, c = /* @__PURE__ */ new Set()), !c.has(s)) {
        {
          l = Zr.createElement("style"), l.innerHTML = i;
          const u = (o = Bn.$nonce$) !== null && o !== void 0 ? o : dm(Zr);
          u != null && l.setAttribute("nonce", u), e.insertBefore(l, e.querySelector("link"));
        }
        c && c.add(s);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return s;
}, m4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, o = vs("attachStyles", t.$tagName$), s = w4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = s, n.classList.add(s + "-h")), o();
}, fm = (e, t) => "sc-" + e.$tagName$, $0 = (e, t, n, r, o, s) => {
  if (n !== r) {
    let i = L0(e, t), c = t.toLowerCase();
    if (t === "class") {
      const l = e.classList, u = I0(n), p = I0(r);
      l.remove(...u.filter((d) => d && !p.includes(d))), l.add(...p.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : L0(Yl, c) ? t = c.slice(2) : t = c[2] + t.slice(3), n && Bn.rel(e, t, n, !1), r && Bn.ael(e, t, r, !1);
    else {
      const l = Zf(r);
      if ((i || l && r !== null) && !o)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || s & 4 || o) && !l && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, b4 = /\s/, I0 = (e) => e ? e.split(b4) : [], hm = (e, t, n, r) => {
  const o = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || E0, i = t.$attrs$ || E0;
  for (r in s)
    r in i || $0(o, r, s[r], void 0, n, t.$flags$);
  for (r in i)
    $0(o, r, s[r], i[r], n, t.$flags$);
}, Jf = (e, t, n, r) => {
  const o = t.$children$[n];
  let s = 0, i, c;
  if (o.$text$ !== null)
    i = o.$elm$ = Zr.createTextNode(o.$text$);
  else {
    if (sr || (sr = o.$tag$ === "svg"), i = o.$elm$ = Zr.createElementNS(sr ? c4 : l4, o.$tag$), sr && o.$tag$ === "foreignObject" && (sr = !1), hm(null, o, sr), u4(Gc) && i["s-si"] !== Gc && i.classList.add(i["s-si"] = Gc), o.$children$)
      for (s = 0; s < o.$children$.length; ++s)
        c = Jf(e, o, s), c && i.appendChild(c);
    o.$tag$ === "svg" ? sr = !1 : i.tagName === "foreignObject" && (sr = !0);
  }
  return i;
}, pm = (e, t, n, r, o, s) => {
  let i = e, c;
  for (i.shadowRoot && i.tagName === um && (i = i.shadowRoot); o <= s; ++o)
    r[o] && (c = Jf(null, n, o), c && (r[o].$elm$ = c, i.insertBefore(c, t)));
}, gm = (e, t, n, r, o) => {
  for (; t <= n; ++t)
    (r = e[t]) && (o = r.$elm$, o.remove());
}, x4 = (e, t, n, r) => {
  let o = 0, s = 0, i = t.length - 1, c = t[0], l = t[i], u = r.length - 1, p = r[0], d = r[u], w;
  for (; o <= i && s <= u; )
    c == null ? c = t[++o] : l == null ? l = t[--i] : p == null ? p = r[++s] : d == null ? d = r[--u] : kc(c, p) ? (Sa(c, p), c = t[++o], p = r[++s]) : kc(l, d) ? (Sa(l, d), l = t[--i], d = r[--u]) : kc(c, d) ? (Sa(c, d), e.insertBefore(c.$elm$, l.$elm$.nextSibling), c = t[++o], d = r[--u]) : kc(l, p) ? (Sa(l, p), e.insertBefore(l.$elm$, c.$elm$), l = t[--i], p = r[++s]) : (w = Jf(t && t[s], n, s), p = r[++s], w && c.$elm$.parentNode.insertBefore(w, c.$elm$));
  o > i ? pm(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, s, u) : s > u && gm(t, o, i);
}, kc = (e, t) => e.$tag$ === t.$tag$, Sa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, o = t.$children$, s = t.$tag$, i = t.$text$;
  i === null ? (sr = s === "svg" ? !0 : s === "foreignObject" ? !1 : sr, hm(e, t, sr), r !== null && o !== null ? x4(n, r, t, o) : o !== null ? (e.$text$ !== null && (n.textContent = ""), pm(n, null, t, o, 0, o.length - 1)) : r !== null && gm(r, 0, r.length - 1), sr && s === "svg" && (sr = !1)) : e.$text$ !== i && (n.data = i);
}, S4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Hd(null, null), o = f4(t) ? t : Ye(null, null, t);
  um = n.tagName, o.$tag$ = null, o.$flags$ |= 4, e.$vnode$ = o, o.$elm$ = r.$elm$ = n.shadowRoot || n, Gc = n["s-sc"], Sa(r, o);
}, ym = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, Qf = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return ym(e, e.$ancestorComponent$), H4(() => v4(e, t));
}, v4 = (e, t) => {
  const n = vs("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let o;
  return n(), $4(o, () => A4(e, r, t));
}, A4 = async (e, t, n) => {
  const r = e.$hostElement$, o = vs("update", e.$cmpMeta$.$tagName$), s = r["s-rc"];
  n && m4(e);
  const i = vs("render", e.$cmpMeta$.$tagName$);
  E4(e, t), s && (s.map((c) => c()), r["s-rc"] = void 0), i(), o();
  {
    const c = r["s-p"], l = () => k4(e);
    c.length === 0 ? l() : (Promise.all(c).then(l), e.$flags$ |= 4, c.length = 0);
  }
}, E4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, S4(e, t);
  } catch (r) {
    Oa(r, e.$hostElement$);
  }
  return null;
}, k4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = vs("postUpdate", t), o = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, mm(n), r(), e.$onReadyResolve$(n), o || wm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && th(() => Qf(e, !1)), e.$flags$ &= -517;
}, wm = (e) => {
  mm(Zr.documentElement), th(() => g4(Yl, "appload", { detail: { namespace: o4 } }));
}, $4 = (e, t) => e && e.then ? e.then(t) : t(), mm = (e) => e.classList.add("hydrated"), I4 = (e, t) => sa(e).$instanceValues$.get(t), L4 = (e, t, n, r) => {
  const o = sa(e), s = o.$instanceValues$.get(t), i = o.$flags$, c = o.$lazyInstance$;
  n = h4(n, r.$members$[t][0]);
  const l = Number.isNaN(s) && Number.isNaN(n), u = n !== s && !l;
  (!(i & 8) || s === void 0) && u && (o.$instanceValues$.set(t, n), c && (i & 18) === 2 && Qf(o, !1));
}, bm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), o = e.prototype;
    if (r.map(([s, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(o, s, {
        get() {
          return I4(this, s);
        },
        set(c) {
          L4(this, s, c, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const s = /* @__PURE__ */ new Map();
      o.attributeChangedCallback = function(i, c, l) {
        Bn.jmp(() => {
          const u = s.get(i);
          if (this.hasOwnProperty(u))
            l = this[u], delete this[u];
          else if (o.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == l)
            return;
          this[u] = l === null && typeof this[u] == "boolean" ? !1 : l;
        });
      }, e.observedAttributes = r.filter(
        ([i, c]) => c[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i, c]) => {
        const l = c[1] || i;
        return s.set(l, i), l;
      });
    }
  }
  return e;
}, C4 = async (e, t, n, r, o) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, o = _4(n), o.then) {
        const l = i4();
        o = await o, l();
      }
      o.isProxied || (bm(
        o,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), o.isProxied = !0);
      const c = vs("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new o(t);
      } catch (l) {
        Oa(l);
      }
      t.$flags$ &= -9, c();
    }
    if (o.style) {
      let c = o.style;
      const l = fm(n);
      if (!fl.has(l)) {
        const u = vs("registerStyles", n.$tagName$);
        y4(l, c, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const s = t.$ancestorComponent$, i = () => Qf(t, !0);
  s && s["s-rc"] ? s["s-rc"].push(i) : i();
}, T4 = (e) => {
  if (!(Bn.$flags$ & 1)) {
    const t = sa(e), n = t.$cmpMeta$, r = vs("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let o = e;
        for (; o = o.parentNode || o.host; )
          if (o["s-p"]) {
            ym(t, t.$ancestorComponent$ = o);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([o, [s]]) => {
        if (s & 31 && e.hasOwnProperty(o)) {
          const i = e[o];
          delete e[o], e[o] = i;
        }
      }), C4(e, t, n);
    }
    r();
  }
}, B4 = (e) => {
  Bn.$flags$ & 1 || sa(e);
}, N4 = (e, t = {}) => {
  var n;
  const r = vs(), o = [], s = t.exclude || [], i = Yl.customElements, c = Zr.head, l = /* @__PURE__ */ c.querySelector("meta[charset]"), u = /* @__PURE__ */ Zr.createElement("style"), p = [];
  let d, w = !0;
  Object.assign(Bn, t), Bn.$resourcesUrl$ = new URL(t.resourcesUrl || "./", Zr.baseURI).href, e.map((y) => {
    y[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const L = x.$tagName$, B = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, P4(_, x), x.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? p.push(this) : Bn.jmp(() => T4(this));
        }
        disconnectedCallback() {
          Bn.jmp(() => B4(this));
        }
        componentOnReady() {
          return sa(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = y[0], !s.includes(L) && !i.get(L) && (o.push(L), i.define(L, bm(
        B,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = o + a4, u.setAttribute("data-styles", "");
    const y = (n = Bn.$nonce$) !== null && n !== void 0 ? n : dm(Zr);
    y != null && u.setAttribute("nonce", y), c.insertBefore(u, l ? l.nextSibling : c.firstChild);
  }
  w = !1, p.length ? p.map((y) => y.connectedCallback()) : Bn.jmp(() => d = setTimeout(wm, 30)), r();
}, eh = /* @__PURE__ */ new WeakMap(), sa = (e) => eh.get(e), M4 = (e, t) => eh.set(t.$lazyInstance$ = e, t), P4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], eh.set(e, n);
}, L0 = (e, t) => t in e, Oa = (e, t) => (0, console.error)(e, t), Lu = /* @__PURE__ */ new Map(), _4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), o = e.$lazyBundleId$, s = Lu.get(o);
  if (s)
    return s[r];
  {
    const i = (c) => (Lu.set(o, c), c[r]);
    switch (o) {
      case "connect-modal":
        return Promise.resolve().then(() => CC).then(i, Oa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${o}.entry.js`
  ).then((i) => (Lu.set(o, i), i[r]), Oa);
}, fl = /* @__PURE__ */ new Map(), Yl = typeof window < "u" ? window : {}, Zr = Yl.document || { head: {} }, Bn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, xm = (e) => Promise.resolve(e), U4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), C0 = [], Sm = [], O4 = (e, t) => (n) => {
  e.push(n), Od || (Od = !0, Bn.$flags$ & 4 ? th(Dd) : Bn.raf(Dd));
}, T0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Oa(n);
    }
  e.length = 0;
}, Dd = () => {
  T0(C0), T0(Sm), (Od = C0.length > 0) && Bn.raf(Dd);
}, th = (e) => xm().then(e), H4 = /* @__PURE__ */ O4(Sm), D4 = () => xm(), F4 = (e, t) => typeof window > "u" ? Promise.resolve() : D4().then(() => N4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var j4 = Object.defineProperty, R4 = Object.defineProperties, z4 = Object.getOwnPropertyDescriptors, hl = Object.getOwnPropertySymbols, vm = Object.prototype.hasOwnProperty, Am = Object.prototype.propertyIsEnumerable, B0 = (e, t, n) => t in e ? j4(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ur = (e, t) => {
  for (var n in t || (t = {})) vm.call(t, n) && B0(e, n, t[n]);
  if (hl) for (var n of hl(t)) Am.call(t, n) && B0(e, n, t[n]);
  return e;
}, Pr = (e, t) => R4(e, z4(t)), Em = (e, t) => {
  var n = {};
  for (var r in e) vm.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && hl) for (var r of hl(e)) t.indexOf(r) < 0 && Am.call(e, r) && (n[r] = e[r]);
  return n;
};
function km() {
  return jl(zo()) || window.StacksProvider || window.BlockstackProvider;
}
function ql(e) {
  return e ? typeof e == "string" ? Ko.fromName(e) : "version" in e ? e : "url" in e ? new hd({ url: e.url }) : e.transactionVersion === Xo.Mainnet ? new hd({ url: e.client.baseUrl }) : new pd({ url: e.client.baseUrl }) : new pd();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var G4 = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(G4 || {}), K4 = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(K4 || {}), nh = (e) => {
  let t = e;
  if (!t) {
    let n = new sy(["store_write"], document.location.href);
    t = new fd({ appConfig: n });
  }
  return t;
};
function $m(e) {
  try {
    return nh(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Im = (e) => {
  let t = nh(e).loadUserData().appPrivateKey, n = $n.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function V4(e) {
  var t;
  let { stxAddress: n, userSession: r, network: o } = e;
  if (n) return n;
  if (!r || !o) return;
  let s = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Vo.Mainnet]: "mainnet", [Vo.Testnet]: "testnet" }, c = ql(o);
  return s == null ? void 0 : s[i[c.chainId]];
}
function X4(e) {
  let t = ql(e.network), n = nh(e.userSession), r = Pr(ur({}, e), { network: t, userSession: n });
  return ur({ stxAddress: V4(r) }, r);
}
async function Y4(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Jw) : n = n.map((r) => _e(cm(r)))), new $n.TokenSigner("ES256k", t).signAsync(Pr(ur({}, e), { postConditions: n }));
}
function q4(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(Jw) : t = t.map((n) => _e(cm(n)))), $n.createUnsecuredToken(Pr(ur({}, e), { postConditions: t }));
}
var W4 = async ({ token: e, options: t }, n) => {
  var r, o, s;
  try {
    let i = await n.transactionRequest(e), { txRaw: c } = i, l = yt(c.replace(/^0x/, "")), u = Fk(l);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Pr(ur({}, i), { stacksTransaction: u }));
      return;
    }
    (o = t.onFinish) == null || o.call(t, Pr(ur({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (s = t.onCancel) == null || s.call(t);
  }
}, Z4 = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: o } = t, s = Em(t, ["amount", "appDetails", "userSession"]);
  if ($m(o)) {
    let { privateKey: c, publicKey: l } = Im(o), u = Pr(ur({}, s), { amount: n.toString(10), publicKey: l, txType: "token_transfer" });
    return r && (u.appDetails = r), Y4(u, c);
  }
  let i = Pr(ur({}, s), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), q4(i);
};
async function J4(e, t, n) {
  let r = await t(Pr(ur(ur({}, X4(e)), e), { network: ql(e.network) }));
  return W4({ token: r, options: e }, n);
}
function Q4(e, t = km()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return J4(e, Z4, t);
}
function Lm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Pr(ur({}, e), { message: o0(t), domain: o0(n) }) : Pr(ur({}, e), { message: _e(qo(t)), domain: _e(qo(n)) });
}
async function e$(e, t) {
  return new $n.TokenSigner("ES256k", t).signAsync(Lm(e));
}
async function t$(e) {
  let t = e, { userSession: n } = t, r = Em(t, ["userSession"]);
  if ($m(n)) {
    let { privateKey: o, publicKey: s } = Im(n), i = Pr(ur({}, r), { publicKey: s });
    return e$(i, o);
  }
  return $n.createUnsecuredToken(Lm(e));
}
var n$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(n$ || {}), Cm = "asigna-stx", N0 = (e, t) => new Promise((n) => {
  function r(o) {
    o.data.source === Cm && o.data[t] && (n(o.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(s$(e, t), "*");
}), r$ = { authenticationRequest: async (e) => N0(e, "authenticationRequest"), transactionRequest: async (e) => N0(e, "transactionRequest") }, s$ = (e, t) => ({ source: Cm, [t]: e }), o$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = r$);
};
o$();
var i$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function a$(e, t = !0) {
  return function(n, r) {
    var o;
    if (r) return e(n, r);
    let s = zo(), i = km();
    if (s && i) return e(n, i);
    if (typeof window > "u") return;
    F4();
    let c = (o = n == null ? void 0 : n.defaultProviders) != null ? o : i$, l = Jv(c), u = document.createElement("connect-modal");
    u.defaultProviders = c, u.installedProviders = l, u.persistSelection = t;
    let p = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = p;
    };
    u.callback = (y) => {
      d(), e(n, y);
    }, u.cancelCallback = () => {
      var y;
      d(), (y = n.onCancel) == null || y.call(n);
    }, document.body.appendChild(u);
    let w = (y) => {
      y.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var $c = a$(Q4);
function uo(e, t, n) {
  return rh(Dn(e, t), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = jt(r);
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
      const r = u$(BigInt(`0x${at(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${at(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function M0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function Za(e, t = 8) {
  return (typeof e == "bigint" ? e : Dn(e, !1)).toString(16).padStart(t * 2, "0");
}
function Wl(e) {
  return parseInt(e, 16);
}
function rh(e, t = 16) {
  const n = Za(e, t);
  return jt(n);
}
function c$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function l$(e, t) {
  return e & BigInt(1) << t;
}
function u$(e, t) {
  return l$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const d$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function at(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += d$[n];
  return t;
}
function jt(e) {
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
function oa(e) {
  return new TextEncoder().encode(e);
}
function sh(e) {
  return new TextDecoder().decode(e);
}
function Tm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function f$(e) {
  return String.fromCharCode.apply(null, e);
}
function h$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function P0(e) {
  if (e.some(h$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function Zl(...e) {
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
function sn(e) {
  return Zl(...e.map((t) => typeof t == "number" ? P0([t]) : t instanceof Array ? P0(t) : t));
}
var _0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(_0 || (_0 = {}));
var U0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(U0 || (U0 = {}));
var O0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(O0 || (O0 = {}));
const Bm = 33, Cu = 32;
function p$(e) {
  if (e.length < Cu * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + Cu * 2), r = e.slice(2 + Cu * 2);
  return {
    recoveryId: Wl(t),
    r: n,
    s: r
  };
}
function g$(e) {
  const t = typeof e == "string" ? jt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function y$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function w$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function m$(e, t) {
  return e[t];
}
function b$(e, t, n = 0) {
  return e[n] = t, e;
}
function x$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Wo(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Fd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Fd || (Fd = {}));
const S$ = Fd.Mainnet, v$ = 128, A$ = 128, Nm = 16, _o = 32, jd = 80, Jl = 65, E$ = 32, k$ = 64, pl = 34;
var ke;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(ke || (ke = {}));
var st;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(st || (st = {}));
var Rd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(Rd || (Rd = {}));
var Kn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Kn || (Kn = {}));
const Kc = ["onChainOnly", "offChainOnly", "any"], H0 = {
  [Kc[0]]: Kn.OnChainOnly,
  [Kc[1]]: Kn.OffChainOnly,
  [Kc[2]]: Kn.Any,
  [Kn.OnChainOnly]: Kn.OnChainOnly,
  [Kn.OffChainOnly]: Kn.OffChainOnly,
  [Kn.Any]: Kn.Any
};
function $$(e) {
  if (e in H0)
    return H0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${Kc.join(", ")}`);
}
var gl;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(gl || (gl = {}));
gl.Mainnet;
var qi;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(qi || (qi = {}));
var Vn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Vn || (Vn = {}));
var Jt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Jt || (Jt = {}));
var Bt;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Bt || (Bt = {}));
var yl;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(yl || (yl = {}));
var Xt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Xt || (Xt = {}));
var Ha;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Ha || (Ha = {}));
var zd;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(zd || (zd = {}));
var Da;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Da || (Da = {}));
var D0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(D0 || (D0 = {}));
var F0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(F0 || (F0 = {}));
function Gd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function I$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Mm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function L$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Gd(e.outputLen), Gd(e.blockLen);
}
function C$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function T$(e, t) {
  Mm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Bo = {
  number: Gd,
  bool: I$,
  bytes: Mm,
  hash: L$,
  exists: C$,
  output: T$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Tu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Kr = (e, t) => e << 32 - t | e >>> t, B$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!B$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function N$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function oh(e) {
  if (typeof e == "string" && (e = N$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Pm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function ai(e) {
  const t = (r) => e().update(oh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function M$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), c = Number(n & s), l = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + l, i, r), e.setUint32(t + u, c, r);
}
class ih extends Pm {
  constructor(t, n, r, o) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Tu(this.buffer);
  }
  update(t) {
    Bo.exists(this);
    const { view: n, buffer: r, blockLen: o } = this;
    t = oh(t);
    const s = t.length;
    for (let i = 0; i < s; ) {
      const c = Math.min(o - this.pos, s - i);
      if (c === o) {
        const l = Tu(t);
        for (; o <= s - i; i += o)
          this.process(l, i);
        continue;
      }
      r.set(t.subarray(i, i + c), this.pos), this.pos += c, i += c, this.pos === o && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Bo.exists(this), Bo.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: o, isLE: s } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > o - i && (this.process(r, 0), i = 0);
    for (let d = i; d < o; d++)
      n[d] = 0;
    M$(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
    const c = Tu(t), l = this.outputLen;
    if (l % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = l / 4, p = this.get();
    if (u > p.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      c.setUint32(4 * d, p[d], s);
  }
  digest() {
    const { buffer: t, outputLen: n } = this;
    this.digestInto(t);
    const r = t.slice(0, n);
    return this.destroy(), r;
  }
  _cloneInto(t) {
    t || (t = new this.constructor()), t.set(...this.get());
    const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: c } = this;
    return t.length = o, t.pos = c, t.finished = s, t.destroyed = i, o % n && t.buffer.set(r), t;
  }
}
const P$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _m = Uint8Array.from({ length: 16 }, (e, t) => t), _$ = _m.map((e) => (9 * e + 5) % 16);
let ah = [_m], ch = [_$];
for (let e = 0; e < 4; e++)
  for (let t of [ah, ch])
    t.push(t[e].map((n) => P$[n]));
const Um = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), U$ = ah.map((e, t) => e.map((n) => Um[t][n])), O$ = ch.map((e, t) => e.map((n) => Um[t][n])), H$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), D$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ic = (e, t) => e << t | e >>> 32 - t;
function j0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Lc = new Uint32Array(16);
class F$ extends ih {
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
      Lc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, o = r, s = this.h1 | 0, i = s, c = this.h2 | 0, l = c, u = this.h3 | 0, p = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = H$[y], L = D$[y], B = ah[y], _ = ch[y], A = U$[y], T = O$[y];
      for (let P = 0; P < 16; P++) {
        const K = Ic(r + j0(y, s, c, u) + Lc[B[P]] + x, A[P]) + d | 0;
        r = d, d = u, u = Ic(c, 10) | 0, c = s, s = K;
      }
      for (let P = 0; P < 16; P++) {
        const K = Ic(o + j0(v, i, l, p) + Lc[_[P]] + L, T[P]) + w | 0;
        o = w, w = p, p = Ic(l, 10) | 0, l = i, i = K;
      }
    }
    this.set(this.h1 + c + p | 0, this.h2 + u + w | 0, this.h3 + d + o | 0, this.h4 + r + i | 0, this.h0 + s + l | 0);
  }
  roundClean() {
    Lc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const j$ = ai(() => new F$()), R$ = (e, t, n) => e & t ^ ~e & n, z$ = (e, t, n) => e & t ^ e & n ^ t & n, G$ = new Uint32Array([
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
]), Ws = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Zs = new Uint32Array(64);
class Om extends ih {
  constructor() {
    super(64, 32, 8, !1), this.A = Ws[0] | 0, this.B = Ws[1] | 0, this.C = Ws[2] | 0, this.D = Ws[3] | 0, this.E = Ws[4] | 0, this.F = Ws[5] | 0, this.G = Ws[6] | 0, this.H = Ws[7] | 0;
  }
  get() {
    const { A: t, B: n, C: r, D: o, E: s, F: i, G: c, H: l } = this;
    return [t, n, r, o, s, i, c, l];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l) {
    this.A = t | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = c | 0, this.H = l | 0;
  }
  process(t, n) {
    for (let d = 0; d < 16; d++, n += 4)
      Zs[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Zs[d - 15], y = Zs[d - 2], v = Kr(w, 7) ^ Kr(w, 18) ^ w >>> 3, x = Kr(y, 17) ^ Kr(y, 19) ^ y >>> 10;
      Zs[d] = x + Zs[d - 7] + v + Zs[d - 16] | 0;
    }
    let { A: r, B: o, C: s, D: i, E: c, F: l, G: u, H: p } = this;
    for (let d = 0; d < 64; d++) {
      const w = Kr(c, 6) ^ Kr(c, 11) ^ Kr(c, 25), y = p + w + R$(c, l, u) + G$[d] + Zs[d] | 0, x = (Kr(r, 2) ^ Kr(r, 13) ^ Kr(r, 22)) + z$(r, o, s) | 0;
      p = u, u = l, l = c, c = i + y | 0, i = s, s = o, o = r, r = y + x | 0;
    }
    r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, c = c + this.E | 0, l = l + this.F | 0, u = u + this.G | 0, p = p + this.H | 0, this.set(r, o, s, i, c, l, u, p);
  }
  roundClean() {
    Zs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class K$ extends Om {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const lh = ai(() => new Om());
ai(() => new K$());
const Cc = BigInt(2 ** 32 - 1), Kd = BigInt(32);
function Hm(e, t = !1) {
  return t ? { h: Number(e & Cc), l: Number(e >> Kd & Cc) } : { h: Number(e >> Kd & Cc) | 0, l: Number(e & Cc) | 0 };
}
function V$(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let o = 0; o < e.length; o++) {
    const { h: s, l: i } = Hm(e[o], t);
    [n[o], r[o]] = [s, i];
  }
  return [n, r];
}
const X$ = (e, t) => BigInt(e >>> 0) << Kd | BigInt(t >>> 0), Y$ = (e, t, n) => e >>> n, q$ = (e, t, n) => e << 32 - n | t >>> n, W$ = (e, t, n) => e >>> n | t << 32 - n, Z$ = (e, t, n) => e << 32 - n | t >>> n, J$ = (e, t, n) => e << 64 - n | t >>> n - 32, Q$ = (e, t, n) => e >>> n - 32 | t << 64 - n, e8 = (e, t) => t, t8 = (e, t) => e, n8 = (e, t, n) => e << n | t >>> 32 - n, r8 = (e, t, n) => t << n | e >>> 32 - n, s8 = (e, t, n) => t << n - 32 | e >>> 64 - n, o8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function i8(e, t, n, r) {
  const o = (t >>> 0) + (r >>> 0);
  return { h: e + n + (o / 2 ** 32 | 0) | 0, l: o | 0 };
}
const a8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), c8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, l8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), u8 = (e, t, n, r, o) => t + n + r + o + (e / 2 ** 32 | 0) | 0, d8 = (e, t, n, r, o) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), f8 = (e, t, n, r, o, s) => t + n + r + o + s + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: Hm,
  split: V$,
  toBig: X$,
  shrSH: Y$,
  shrSL: q$,
  rotrSH: W$,
  rotrSL: Z$,
  rotrBH: J$,
  rotrBL: Q$,
  rotr32H: e8,
  rotr32L: t8,
  rotlSH: n8,
  rotlSL: r8,
  rotlBH: s8,
  rotlBL: o8,
  add: i8,
  add3L: a8,
  add3H: c8,
  add4L: l8,
  add4H: u8,
  add5H: f8,
  add5L: d8
}, [h8, p8] = tt.split([
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
].map((e) => BigInt(e))), Js = new Uint32Array(80), Qs = new Uint32Array(80);
class Ql extends ih {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: c, Dl: l, Eh: u, El: p, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, o, s, i, c, l, u, p, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = c | 0, this.Dl = l | 0, this.Eh = u | 0, this.El = p | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Js[A] = t.getUint32(n), Qs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Js[A - 15] | 0, P = Qs[A - 15] | 0, K = tt.rotrSH(T, P, 1) ^ tt.rotrSH(T, P, 8) ^ tt.shrSH(T, P, 7), ie = tt.rotrSL(T, P, 1) ^ tt.rotrSL(T, P, 8) ^ tt.shrSL(T, P, 7), ee = Js[A - 2] | 0, X = Qs[A - 2] | 0, m = tt.rotrSH(ee, X, 19) ^ tt.rotrBH(ee, X, 61) ^ tt.shrSH(ee, X, 6), I = tt.rotrSL(ee, X, 19) ^ tt.rotrBL(ee, X, 61) ^ tt.shrSL(ee, X, 6), N = tt.add4L(ie, I, Qs[A - 7], Qs[A - 16]), M = tt.add4H(N, K, m, Js[A - 7], Js[A - 16]);
      Js[A] = M | 0, Qs[A] = N | 0;
    }
    let { Ah: r, Al: o, Bh: s, Bl: i, Ch: c, Cl: l, Dh: u, Dl: p, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: B, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, w, 14) ^ tt.rotrSH(d, w, 18) ^ tt.rotrBH(d, w, 41), P = tt.rotrSL(d, w, 14) ^ tt.rotrSL(d, w, 18) ^ tt.rotrBL(d, w, 41), K = d & y ^ ~d & x, ie = w & v ^ ~w & L, ee = tt.add5L(_, P, ie, p8[A], Qs[A]), X = tt.add5H(ee, B, T, K, h8[A], Js[A]), m = ee | 0, I = tt.rotrSH(r, o, 28) ^ tt.rotrBH(r, o, 34) ^ tt.rotrBH(r, o, 39), N = tt.rotrSL(r, o, 28) ^ tt.rotrBL(r, o, 34) ^ tt.rotrBL(r, o, 39), M = r & s ^ r & c ^ s & c, Y = o & i ^ o & l ^ i & l;
      B = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = tt.add(u | 0, p | 0, X | 0, m | 0), u = c | 0, p = l | 0, c = s | 0, l = i | 0, s = r | 0, i = o | 0;
      const j = tt.add3L(m, N, Y);
      r = tt.add3H(j, X, I, M), o = j | 0;
    }
    ({ h: r, l: o } = tt.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), { h: s, l: i } = tt.add(this.Bh | 0, this.Bl | 0, s | 0, i | 0), { h: c, l } = tt.add(this.Ch | 0, this.Cl | 0, c | 0, l | 0), { h: u, l: p } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, p | 0), { h: d, l: w } = tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = tt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: B, l: _ } = tt.add(this.Hh | 0, this.Hl | 0, B | 0, _ | 0), this.set(r, o, s, i, c, l, u, p, d, w, y, v, x, L, B, _);
  }
  roundClean() {
    Js.fill(0), Qs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class g8 extends Ql {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class y8 extends Ql {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class w8 extends Ql {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
ai(() => new Ql());
ai(() => new g8());
const m8 = ai(() => new y8());
ai(() => new w8());
function Dm(e) {
  if (jt(e).byteLength != Jl)
    throw Error("Invalid signature");
  return {
    type: ke.MessageSignature,
    data: e
  };
}
function va(e, t) {
  return { type: ke.Address, version: e, hash160: t };
}
function Ti(e) {
  return si.c32address(e.version, e.hash160);
}
function Zo(e, t, n) {
  const r = t || 1, o = n || v$;
  if (nb(e, o))
    throw new Error(`String length exceeds maximum bytes ${o}`);
  return {
    type: ke.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: o
  };
}
function uh(e) {
  const t = si.c32addressDecode(e);
  return {
    type: ke.Address,
    version: t[0],
    hash160: t[1]
  };
}
var oe;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(oe || (oe = {}));
function b8(e) {
  if (e.type === oe.PrincipalStandard)
    return Ti(e.address);
  if (e.type === oe.PrincipalContract)
    return `${Ti(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Fm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return v8(t, n);
  } else
    return x8(e);
}
function x8(e) {
  const t = uh(e);
  return { type: oe.PrincipalStandard, address: t };
}
function S8(e) {
  return { type: oe.PrincipalStandard, address: e };
}
function v8(e, t) {
  const n = uh(e), r = Zo(t);
  return jm(n, r);
}
function jm(e, t) {
  if (oa(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: oe.PrincipalContract, address: e, contractName: t };
}
function Bu(e, t = !1) {
  switch (e.type) {
    case oe.BoolTrue:
      return !0;
    case oe.BoolFalse:
      return !1;
    case oe.Int:
    case oe.UInt:
      return t ? e.value.toString() : e.value;
    case oe.Buffer:
      return `0x${at(e.buffer)}`;
    case oe.OptionalNone:
      return null;
    case oe.OptionalSome:
      return Cr(e.value);
    case oe.ResponseErr:
      return Cr(e.value);
    case oe.ResponseOk:
      return Cr(e.value);
    case oe.PrincipalStandard:
    case oe.PrincipalContract:
      return b8(e);
    case oe.List:
      return e.list.map((r) => Cr(r));
    case oe.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Cr(e.data[r]);
      }), n;
    case oe.StringASCII:
      return e.data;
    case oe.StringUTF8:
      return e.data;
  }
}
function Cr(e) {
  switch (e.type) {
    case oe.ResponseErr:
      return { type: ro(e), value: Bu(e, !0), success: !1 };
    case oe.ResponseOk:
      return { type: ro(e), value: Bu(e, !0), success: !0 };
    default:
      return { type: ro(e), value: Bu(e, !0) };
  }
}
function ro(e) {
  switch (e.type) {
    case oe.BoolTrue:
    case oe.BoolFalse:
      return "bool";
    case oe.Int:
      return "int";
    case oe.UInt:
      return "uint";
    case oe.Buffer:
      return `(buff ${e.buffer.length})`;
    case oe.OptionalNone:
      return "(optional none)";
    case oe.OptionalSome:
      return `(optional ${ro(e.value)})`;
    case oe.ResponseErr:
      return `(response UnknownType ${ro(e.value)})`;
    case oe.ResponseOk:
      return `(response ${ro(e.value)} UnknownType)`;
    case oe.PrincipalStandard:
    case oe.PrincipalContract:
      return "principal";
    case oe.List:
      return `(list ${e.list.length} ${e.list.length ? ro(e.list[0]) : "UnknownType"})`;
    case oe.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${ro(e.data[t])})`).join(" ")})`;
    case oe.StringASCII:
      return `(string-ascii ${Tm(e.data).length})`;
    case oe.StringUTF8:
      return `(string-utf8 ${oa(e.data).length})`;
  }
}
const Rm = () => ({ type: oe.BoolTrue }), zm = () => ({ type: oe.BoolFalse }), A8 = (e) => e ? Rm() : zm(), R0 = BigInt("0xffffffffffffffffffffffffffffffff"), E8 = BigInt(0), z0 = BigInt("0x7fffffffffffffffffffffffffffffff"), G0 = BigInt("-170141183460469231731687303715884105728"), k8 = (e) => {
  const t = Dn(e, !0);
  if (t > z0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${z0}`);
  if (t < G0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${G0}`);
  return { type: oe.Int, value: t };
}, xn = (e) => {
  const t = Dn(e, !1);
  if (t < E8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > R0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${R0}`);
  return { type: oe.UInt, value: t };
}, Gm = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: oe.Buffer, buffer: e };
};
function Km() {
  return { type: oe.OptionalNone };
}
function Vm(e) {
  return { type: oe.OptionalSome, value: e };
}
function $8(e) {
  return { type: oe.ResponseErr, value: e };
}
function I8(e) {
  return { type: oe.ResponseOk, value: e };
}
function L8(e) {
  return { type: oe.List, list: e };
}
function dr(e) {
  for (const t in e)
    if (!w6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: oe.Tuple, data: e };
}
const mt = (e) => ({ type: oe.StringASCII, data: e }), C8 = (e) => ({ type: oe.StringUTF8, data: e });
class Xm extends Pm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Bo.hash(t);
    const r = oh(n);
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
    return Bo.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Bo.exists(this), Bo.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
  }
  digest() {
    const t = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(t), t;
  }
  _cloneInto(t) {
    t || (t = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: c } = this;
    return t = t, t.finished = o, t.destroyed = s, t.blockLen = i, t.outputLen = c, t.oHash = n._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Ym = (e, t, n) => new Xm(e, t).update(n).digest();
Ym.create = (e, t) => new Xm(e, t);
Qt.hmacSha256Sync = (e, ...t) => {
  const n = Ym.create(lh, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Wi(e) {
  return {
    type: ke.PublicKey,
    data: jt(e)
  };
}
function T8(e, t, n = Xt.Compressed) {
  const r = p$(t.data), o = new cr(M0(r.r), M0(r.s)), s = ot.fromSignature(e, o, r.recoveryId), i = n === Xt.Compressed;
  return s.toHex(i);
}
function B8(e) {
  return { type: ke.PublicKey, data: e };
}
function ia(e) {
  return !at(e.data).startsWith("04");
}
function wl(e) {
  return e.data.slice();
}
function N8(e) {
  const t = _8(e), n = Va(t.data.slice(0, 32), t.compressed);
  return Wi(at(n));
}
function M8(e) {
  const t = typeof e == "string" ? e : at(e), n = ot.fromHex(t).toHex(!0);
  return Wi(n);
}
function P8(e) {
  const t = typeof e == "string" ? e : at(e), n = ot.fromHex(t).toHex(!1);
  return Wi(n);
}
function Vd(e) {
  const t = e.readUInt8(), n = t === 4 ? k$ : E$;
  return B8(sn([t, e.readBytes(n)]));
}
function _8(e) {
  const t = g$(e), n = t.length == Bm;
  return { data: t, compressed: n };
}
function U8(e, t) {
  const [n, r] = Bl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const s = Za(r, 1) + cr.fromHex(n).toCompactHex();
  return Dm(s);
}
function O8(e) {
  return N8(e.data);
}
function H8(e, t, n) {
  return typeof e == "string" && (e = Fm(e)), typeof n == "string" && (n = X0(n)), {
    type: ke.Payload,
    payloadType: st.TokenTransfer,
    recipient: e,
    amount: Dn(t, !1),
    memo: n ?? X0("")
  };
}
function D8(e, t, n, r) {
  return typeof e == "string" && (e = uh(e)), typeof t == "string" && (t = Zo(t)), typeof n == "string" && (n = Zo(n)), {
    type: ke.Payload,
    payloadType: st.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function K0(e, t, n) {
  return typeof e == "string" && (e = Zo(e)), typeof t == "string" && (t = Y8(t)), typeof n == "number" ? {
    type: ke.Payload,
    payloadType: st.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: ke.Payload,
    payloadType: st.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function F8() {
  return { type: ke.Payload, payloadType: st.PoisonMicroblock };
}
function V0(e, t) {
  if (e.byteLength != _o)
    throw Error(`Coinbase buffer size must be ${_o} bytes`);
  return t != null ? {
    type: ke.Payload,
    payloadType: st.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: ke.Payload,
    payloadType: st.Coinbase,
    coinbaseBytes: e
  };
}
function j8(e, t, n) {
  if (e.byteLength != _o)
    throw Error(`Coinbase buffer size must be ${_o} bytes`);
  if (n.byteLength != jd)
    throw Error(`VRF proof buffer size must be ${jd} bytes`);
  return {
    type: ke.Payload,
    payloadType: st.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === oe.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var Xd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(Xd || (Xd = {}));
function R8(e, t, n, r, o, s, i) {
  return {
    type: ke.Payload,
    payloadType: st.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: o,
    cause: s,
    publicKeyHash: i
  };
}
function qm(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case st.TokenTransfer:
      t.push(tn(e.recipient)), t.push(uo(e.amount, !1, 8)), t.push(gs(e.memo));
      break;
    case st.ContractCall:
      t.push(gs(e.contractAddress)), t.push(gs(e.contractName)), t.push(gs(e.functionName));
      const n = new Uint8Array(4);
      Wo(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(tn(r));
      });
      break;
    case st.SmartContract:
      t.push(gs(e.contractName)), t.push(gs(e.codeBody));
      break;
    case st.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(gs(e.contractName)), t.push(gs(e.codeBody));
      break;
    case st.PoisonMicroblock:
      break;
    case st.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case st.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(tn(e.recipient));
      break;
    case st.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(tn(e.recipient ? Vm(e.recipient) : Km())), t.push(e.vrfProof);
      break;
    case st.TenureChange:
      t.push(jt(e.tenureHash)), t.push(jt(e.previousTenureHash)), t.push(jt(e.burnViewHash)), t.push(jt(e.previousTenureEnd)), t.push(Wo(new Uint8Array(4), e.previousTenureBlocks)), t.push(b$(new Uint8Array(1), e.cause)), t.push(jt(e.publicKeyHash));
      break;
  }
  return sn(t);
}
function z8(e) {
  switch (e.readUInt8Enum(st, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case st.TokenTransfer:
      const n = xr(e), r = Dn(e.readBytes(8), !1), o = Zm(e);
      return H8(n, r, o);
    case st.ContractCall:
      const s = Zi(e), i = br(e), c = br(e), l = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = xr(e);
        l.push(T);
      }
      return D8(s, i, c, l);
    case st.SmartContract:
      const p = br(e), d = br(e, 4, 1e5);
      return K0(p, d);
    case st.VersionedSmartContract: {
      const A = e.readUInt8Enum(Rd, (K) => {
        throw new Error(`Cannot recognize ClarityVersion: ${K}`);
      }), T = br(e), P = br(e, 4, 1e5);
      return K0(T, P, A);
    }
    case st.PoisonMicroblock:
      return F8();
    case st.Coinbase: {
      const A = e.readBytes(_o);
      return V0(A);
    }
    case st.CoinbaseToAltRecipient: {
      const A = e.readBytes(_o), T = xr(e);
      return V0(A, T);
    }
    case st.NakamotoCoinbase: {
      const A = e.readBytes(_o), T = xr(e), P = e.readBytes(jd);
      return j8(A, T, P);
    }
    case st.TenureChange:
      const w = at(e.readBytes(20)), y = at(e.readBytes(20)), v = at(e.readBytes(20)), x = at(e.readBytes(32)), L = e.readUInt32BE(), B = e.readUInt8Enum(Xd, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), _ = at(e.readBytes(20));
      return R8(w, y, v, x, L, B, _);
  }
}
class eu extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class $o extends eu {
  constructor(t) {
    super(t);
  }
}
class ar extends eu {
  constructor(t) {
    super(t);
  }
}
class ml extends eu {
  constructor(t) {
    super(t);
  }
}
class No extends eu {
  constructor(t) {
    super(t);
  }
}
var Tr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Tr || (Tr = {}));
function Yd(e) {
  return Dm(at(e.readBytes(Jl)));
}
function Bi(e, t) {
  return {
    pubKeyEncoding: e,
    type: ke.TransactionAuthField,
    contents: t
  };
}
function G8(e) {
  const t = e.readUInt8Enum(Tr, (n) => {
    throw new ar(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Tr.PublicKeyCompressed:
      return Bi(Xt.Compressed, Vd(e));
    case Tr.PublicKeyUncompressed:
      return Bi(Xt.Uncompressed, P8(Vd(e).data));
    case Tr.SignatureCompressed:
      return Bi(Xt.Compressed, Yd(e));
    case Tr.SignatureUncompressed:
      return Bi(Xt.Uncompressed, Yd(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function dh(e) {
  return jt(e.data);
}
function K8(e) {
  const t = [];
  switch (e.contents.type) {
    case ke.PublicKey:
      t.push(e.pubKeyEncoding === Xt.Compressed ? Tr.PublicKeyCompressed : Tr.PublicKeyUncompressed), t.push(wl(M8(e.contents.data)));
      break;
    case ke.MessageSignature:
      t.push(e.pubKeyEncoding === Xt.Compressed ? Tr.SignatureCompressed : Tr.SignatureUncompressed), t.push(dh(e.contents));
      break;
  }
  return sn(t);
}
function gs(e) {
  switch (e.type) {
    case ke.Address:
      return Ja(e);
    case ke.Principal:
      return Wm(e);
    case ke.LengthPrefixedString:
      return Ji(e);
    case ke.MemoString:
      return q8(e);
    case ke.AssetInfo:
      return Jm(e);
    case ke.PostCondition:
      return W8(e);
    case ke.PublicKey:
      return wl(e);
    case ke.LengthPrefixedList:
      return ph(e);
    case ke.Payload:
      return qm(e);
    case ke.TransactionAuthField:
      return K8(e);
    case ke.MessageSignature:
      return dh(e);
  }
}
function V8() {
  return {
    type: ke.Address,
    version: yl.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function fh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Bt.SerializeP2PKH || t === Bt.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Bt.SerializeP2WPKH || t === Bt.SerializeP2WSH || t === Bt.SerializeP2WSHNonSequential) && !r.every(ia))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Bt.SerializeP2PKH:
      return va(e, h6(r[0].data));
    case Bt.SerializeP2WPKH:
      return va(e, p6(r[0].data));
    case Bt.SerializeP2SH:
    case Bt.SerializeP2SHNonSequential:
      return va(e, g6(n, r.map(wl)));
    case Bt.SerializeP2WSH:
    case Bt.SerializeP2WSHNonSequential:
      return va(e, y6(n, r.map(wl)));
  }
}
function Ja(e) {
  const t = [];
  return t.push(jt(Za(e.version, 1))), t.push(jt(e.hash160)), sn(t);
}
function Zi(e) {
  const t = Wl(at(e.readBytes(1))), n = at(e.readBytes(20));
  return { type: ke.Address, version: t, hash160: n };
}
function Wm(e) {
  const t = [];
  return t.push(e.prefix), t.push(Ja(e.address)), e.prefix === Da.Contract && t.push(Ji(e.contractName)), sn(t);
}
function X8(e) {
  const t = e.readUInt8Enum(Da, (o) => {
    throw new ar(`Unexpected Principal payload type: ${o}`);
  }), n = Zi(e);
  if (t === Da.Standard)
    return { type: ke.Principal, prefix: t, address: n };
  const r = br(e);
  return {
    type: ke.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function Ji(e) {
  const t = [], n = oa(e.content), r = n.byteLength;
  return t.push(jt(Za(r, e.lengthPrefixBytes))), t.push(n), sn(t);
}
function br(e, t, n) {
  t = t || 1;
  const r = Wl(at(e.readBytes(t))), o = sh(e.readBytes(r));
  return Zo(o, t, n ?? 128);
}
function Y8(e) {
  return Zo(e, 4, 1e5);
}
function X0(e) {
  if (e && nb(e, pl))
    throw new Error(`Memo exceeds maximum length of ${pl} bytes`);
  return { type: ke.MemoString, content: e };
}
function q8(e) {
  const t = [], n = oa(e.content), r = f6(at(n), pl * 2);
  return t.push(jt(r)), sn(t);
}
function Zm(e) {
  let t = sh(e.readBytes(pl));
  return t = t.replace(/\u0000*$/, ""), { type: ke.MemoString, content: t };
}
function Jm(e) {
  const t = [];
  return t.push(Ja(e.address)), t.push(Ji(e.contractName)), t.push(Ji(e.assetName)), sn(t);
}
function qd(e) {
  return {
    type: ke.AssetInfo,
    address: Zi(e),
    contractName: br(e),
    assetName: br(e)
  };
}
function hh(e, t) {
  return {
    type: ke.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function ph(e) {
  const t = e.values, n = [];
  n.push(jt(Za(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(gs(r));
  return sn(n);
}
function Qm(e, t, n) {
  const r = Wl(at(e.readBytes(4))), o = [];
  for (let s = 0; s < r; s++)
    switch (t) {
      case ke.Address:
        o.push(Zi(e));
        break;
      case ke.LengthPrefixedString:
        o.push(br(e));
        break;
      case ke.MemoString:
        o.push(Zm(e));
        break;
      case ke.AssetInfo:
        o.push(qd(e));
        break;
      case ke.PostCondition:
        o.push(Z8(e));
        break;
      case ke.PublicKey:
        o.push(Vd(e));
        break;
      case ke.TransactionAuthField:
        o.push(G8(e));
        break;
    }
  return hh(o, n);
}
function W8(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(Wm(e.principal)), (e.conditionType === Vn.Fungible || e.conditionType === Vn.NonFungible) && t.push(Jm(e.assetInfo)), e.conditionType === Vn.NonFungible && t.push(tn(e.assetName)), t.push(e.conditionCode), e.conditionType === Vn.STX || e.conditionType === Vn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new $o("The post-condition amount may not be larger than 8 bytes");
    t.push(uo(e.amount, !1, 8));
  }
  return sn(t);
}
function Z8(e) {
  const t = e.readUInt8Enum(Vn, (i) => {
    throw new ar(`Could not read ${i} as PostConditionType`);
  }), n = X8(e);
  let r, o, s;
  switch (t) {
    case Vn.STX:
      return r = e.readUInt8Enum(Ha, (c) => {
        throw new ar(`Could not read ${c} as FungibleConditionCode`);
      }), s = BigInt(`0x${at(e.readBytes(8))}`), {
        type: ke.PostCondition,
        conditionType: Vn.STX,
        principal: n,
        conditionCode: r,
        amount: s
      };
    case Vn.Fungible:
      return o = qd(e), r = e.readUInt8Enum(Ha, (c) => {
        throw new ar(`Could not read ${c} as FungibleConditionCode`);
      }), s = BigInt(`0x${at(e.readBytes(8))}`), {
        type: ke.PostCondition,
        conditionType: Vn.Fungible,
        principal: n,
        conditionCode: r,
        amount: s,
        assetInfo: o
      };
    case Vn.NonFungible:
      o = qd(e);
      const i = xr(e);
      return r = e.readUInt8Enum(zd, (c) => {
        throw new ar(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ke.PostCondition,
        conditionType: Vn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: o,
        assetName: i
      };
  }
}
function ns(e, t) {
  return sn([e, t]);
}
function J8(e) {
  return new Uint8Array([e.type]);
}
function Q8(e) {
  return e.type === oe.OptionalNone ? new Uint8Array([e.type]) : ns(e.type, tn(e.value));
}
function e6(e) {
  const t = new Uint8Array(4);
  return Wo(t, e.buffer.length, 0), ns(e.type, Zl(t, e.buffer));
}
function t6(e) {
  const t = rh(c$(e.value, BigInt(A$)), Nm);
  return ns(e.type, t);
}
function n6(e) {
  const t = rh(e.value, Nm);
  return ns(e.type, t);
}
function r6(e) {
  return ns(e.type, Ja(e.address));
}
function s6(e) {
  return ns(e.type, Zl(Ja(e.address), Ji(e.contractName)));
}
function o6(e) {
  return ns(e.type, tn(e.value));
}
function i6(e) {
  const t = [], n = new Uint8Array(4);
  Wo(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const o = tn(r);
    t.push(o);
  }
  return ns(e.type, sn(t));
}
function a6(e) {
  const t = [], n = new Uint8Array(4);
  Wo(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((o, s) => o.localeCompare(s));
  for (const o of r) {
    const s = Zo(o);
    t.push(Ji(s));
    const i = tn(e.data[o]);
    t.push(i);
  }
  return ns(e.type, sn(t));
}
function eb(e, t) {
  const n = [], r = t == "ascii" ? Tm(e.data) : oa(e.data), o = new Uint8Array(4);
  return Wo(o, r.length, 0), n.push(o), n.push(r), ns(e.type, sn(n));
}
function c6(e) {
  return eb(e, "ascii");
}
function l6(e) {
  return eb(e, "utf8");
}
function tn(e) {
  switch (e.type) {
    case oe.BoolTrue:
    case oe.BoolFalse:
      return J8(e);
    case oe.OptionalNone:
    case oe.OptionalSome:
      return Q8(e);
    case oe.Buffer:
      return e6(e);
    case oe.UInt:
      return n6(e);
    case oe.Int:
      return t6(e);
    case oe.PrincipalStandard:
      return r6(e);
    case oe.PrincipalContract:
      return s6(e);
    case oe.ResponseOk:
    case oe.ResponseErr:
      return o6(e);
    case oe.List:
      return i6(e);
    case oe.Tuple:
      return a6(e);
    case oe.StringASCII:
      return c6(e);
    case oe.StringUTF8:
      return l6(e);
    default:
      throw new $o("Unable to serialize. Invalid Clarity Value.");
  }
}
function u6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const Y0 = /* @__PURE__ */ new Map();
function tb(e, t) {
  const n = Y0.get(e);
  if (n !== void 0)
    return n(t);
  const r = u6(e);
  return Y0.set(e, r), tb(e, t);
}
class La {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return x$(this.readBytes(4), 0);
  }
  readUInt8() {
    return m$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return y$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = at(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = at(n);
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
    if (tb(t, r))
      return r;
    throw n(r);
  }
}
function xr(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new La(jt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new La(e) : t = e;
  switch (t.readUInt8Enum(oe, (r) => {
    throw new ar(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case oe.Int:
      return k8(t.readBytes(16));
    case oe.UInt:
      return xn(t.readBytes(16));
    case oe.Buffer:
      const r = t.readUInt32BE();
      return Gm(t.readBytes(r));
    case oe.BoolTrue:
      return Rm();
    case oe.BoolFalse:
      return zm();
    case oe.PrincipalStandard:
      const o = Zi(t);
      return S8(o);
    case oe.PrincipalContract:
      const s = Zi(t), i = br(t);
      return jm(s, i);
    case oe.ResponseOk:
      return I8(xr(t));
    case oe.ResponseErr:
      return $8(xr(t));
    case oe.OptionalNone:
      return Km();
    case oe.OptionalSome:
      return Vm(xr(t));
    case oe.List:
      const c = t.readUInt32BE(), l = [];
      for (let x = 0; x < c; x++)
        l.push(xr(t));
      return L8(l);
    case oe.Tuple:
      const u = t.readUInt32BE(), p = {};
      for (let x = 0; x < u; x++) {
        const L = br(t).content;
        if (L === void 0)
          throw new ar('"content" is undefined');
        p[L] = xr(t);
      }
      return dr(p);
    case oe.StringASCII:
      const d = t.readUInt32BE(), w = f$(t.readBytes(d));
      return mt(w);
    case oe.StringUTF8:
      const y = t.readUInt32BE(), v = sh(t.readBytes(y));
      return C8(v);
    default:
      throw new ar("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const d6 = (e) => e.length % 2 == 0 ? e : `0${e}`, f6 = (e, t) => e.padEnd(t, "0"), nb = (e, t) => e ? oa(e).length > t : !1;
function Wd(e) {
  return Sw(e);
}
const Fa = (e) => j$(lh(e)), gh = (e) => at(m8(e)), h6 = (e) => at(Fa(e)), p6 = (e) => {
  const t = Fa(e), n = Zl(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Fa(n);
  return at(r);
}, g6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((s) => {
    n.push(s.length), n.push(s);
  }), n.push(80 + t.length), n.push(174);
  const r = sn(n), o = Fa(r);
  return at(o);
}, y6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((l) => {
    n.push(l.length), n.push(l);
  }), n.push(80 + t.length), n.push(174);
  const r = sn(n), o = lh(r), s = [];
  s.push(0), s.push(o.length), s.push(o);
  const i = sn(s), c = Fa(i);
  return at(c);
};
function w6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function rb(e) {
  const t = tn(e);
  return `0x${at(t)}`;
}
function m6(e) {
  return xr(e);
}
const _i = (e) => {
  try {
    return si.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function yh() {
  return {
    type: ke.MessageSignature,
    data: at(new Uint8Array(Jl))
  };
}
function sb(e, t, n, r) {
  const o = fh(0, e, 1, [Wi(t)]).hash160, s = ia(Wi(t)) ? Xt.Compressed : Xt.Uncompressed;
  return {
    hashMode: e,
    signer: o,
    nonce: Dn(n, !1),
    fee: Dn(r, !1),
    keyEncoding: s,
    signature: yh()
  };
}
function ja(e) {
  return "signature" in e;
}
function q0(e) {
  return e === Bt.SerializeP2SH || e === Bt.SerializeP2WSH;
}
function b6(e) {
  return e === Bt.SerializeP2SHNonSequential || e === Bt.SerializeP2WSHNonSequential;
}
function W0(e) {
  const t = Wd(e);
  return t.nonce = 0, t.fee = 0, ja(t) ? t.signature = yh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function x6(e) {
  const t = [
    e.hashMode,
    jt(e.signer),
    uo(e.nonce, !1, 8),
    uo(e.fee, !1, 8),
    e.keyEncoding,
    dh(e.signature)
  ];
  return sn(t);
}
function S6(e) {
  const t = [
    e.hashMode,
    jt(e.signer),
    uo(e.nonce, !1, 8),
    uo(e.fee, !1, 8)
  ], n = hh(e.fields);
  t.push(ph(n));
  const r = new Uint8Array(2);
  return w$(r, e.signaturesRequired, 0), t.push(r), sn(t);
}
function v6(e, t) {
  const n = at(t.readBytes(20)), r = BigInt(`0x${at(t.readBytes(8))}`), o = BigInt(`0x${at(t.readBytes(8))}`), s = t.readUInt8Enum(Xt, (c) => {
    throw new ar(`Could not parse ${c} as PubKeyEncoding`);
  });
  if (e === Bt.SerializeP2WPKH && s != Xt.Compressed)
    throw new ar("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Yd(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    keyEncoding: s,
    signature: i
  };
}
function A6(e, t) {
  const n = at(t.readBytes(20)), r = BigInt("0x" + at(t.readBytes(8))), o = BigInt("0x" + at(t.readBytes(8))), s = Qm(t, ke.TransactionAuthField).values;
  let i = !1, c = 0;
  for (const u of s)
    switch (u.contents.type) {
      case ke.PublicKey:
        ia(u.contents) || (i = !0);
        break;
      case ke.MessageSignature:
        if (u.pubKeyEncoding === Xt.Uncompressed && (i = !0), c += 1, c === 65536)
          throw new No("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const l = t.readUInt16BE();
  if (i && (e === Bt.SerializeP2WSH || e === Bt.SerializeP2WSHNonSequential))
    throw new No("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: o,
    fields: s,
    signaturesRequired: l
  };
}
function Nu(e) {
  return ja(e) ? x6(e) : S6(e);
}
function Mu(e) {
  const t = e.readUInt8Enum(Bt, (n) => {
    throw new ar(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Bt.SerializeP2PKH || t === Bt.SerializeP2WPKH ? v6(t, e) : A6(t, e);
}
function ob(e, t, n, r) {
  const s = e + at(new Uint8Array([t])) + at(uo(n, !1, 8)) + at(uo(r, !1, 8));
  if (jt(s).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return gh(jt(s));
}
function ib(e, t, n) {
  const r = 33 + Jl, o = ia(t) ? Xt.Compressed : Xt.Uncompressed, s = e + d6(o.toString(16)) + n.data, i = jt(s);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return gh(i);
}
function E6(e, t, n, r, o) {
  const s = ob(e, t, n, r), i = U8(o, s), c = O8(o), l = ib(s, c, i);
  return {
    nextSig: i,
    nextSigHash: l
  };
}
function ab(e, t, n, r, o, s) {
  const i = ob(e, t, n, r), c = Wi(T8(i, s, o)), l = ib(i, c, s);
  return {
    pubKey: c,
    nextSigHash: l
  };
}
function k6() {
  const e = sb(Bt.SerializeP2PKH, "", 0, 0);
  return e.signer = V8().hash160, e.keyEncoding = Xt.Compressed, e.signature = yh(), e;
}
function Z0(e, t, n) {
  return ja(e) ? $6(e, t, n) : I6(e, t, n);
}
function $6(e, t, n) {
  const { pubKey: r, nextSigHash: o } = ab(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), s = fh(0, e.hashMode, 1, [r]).hash160;
  if (s !== e.signer)
    throw new No(`Signer hash does not equal hash of public key(s): ${s} != ${e.signer}`);
  return o;
}
function I6(e, t, n) {
  const r = [];
  let o = t, s = !1, i = 0;
  for (const l of e.fields)
    switch (l.contents.type) {
      case ke.PublicKey:
        ia(l.contents) || (s = !0), r.push(l.contents);
        break;
      case ke.MessageSignature:
        l.pubKeyEncoding === Xt.Uncompressed && (s = !0);
        const { pubKey: u, nextSigHash: p } = ab(o, n, e.fee, e.nonce, l.pubKeyEncoding, l.contents);
        if (q0(e.hashMode) && (o = p), r.push(u), i += 1, i === 65536)
          throw new No("Too many signatures");
        break;
    }
  if (q0(e.hashMode) && i !== e.signaturesRequired || b6(e.hashMode) && i < e.signaturesRequired)
    throw new No("Incorrect number of signatures");
  if (s && (e.hashMode === Bt.SerializeP2WSH || e.hashMode === Bt.SerializeP2WSHNonSequential))
    throw new No("Uncompressed keys are not allowed in this hash mode");
  const c = fh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (c !== e.signer)
    throw new No(`Signer hash does not equal hash of public key(s): ${c} != ${e.signer}`);
  return o;
}
function cb(e) {
  return {
    authType: Jt.Standard,
    spendingCondition: e
  };
}
function lb(e, t) {
  return {
    authType: Jt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || sb(Bt.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function J0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Jt.Standard:
        return cb(W0(e.spendingCondition));
      case Jt.Sponsored:
        return lb(W0(e.spendingCondition), k6());
      default:
        throw new ml("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function L6(e, t) {
  switch (e.authType) {
    case Jt.Standard:
      return Z0(e.spendingCondition, t, Jt.Standard);
    case Jt.Sponsored:
      return Z0(e.spendingCondition, t, Jt.Standard);
    default:
      throw new ml("Invalid origin auth type");
  }
}
function C6(e, t) {
  switch (e.authType) {
    case Jt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Dn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case Jt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Dn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function T6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Dn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function B6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Dn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function N6(e, t) {
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
function M6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Jt.Standard:
      t.push(Nu(e.spendingCondition));
      break;
    case Jt.Sponsored:
      t.push(Nu(e.spendingCondition)), t.push(Nu(e.sponsorSpendingCondition));
      break;
  }
  return sn(t);
}
function P6(e) {
  const t = e.readUInt8Enum(Jt, (r) => {
    throw new ar(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Jt.Standard:
      return n = Mu(e), cb(n);
    case Jt.Sponsored:
      n = Mu(e);
      const r = Mu(e);
      return lb(n, r);
  }
}
class _6 {
  constructor(t, n, r, o, s, i, c) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Dn(r.amount, !1)
    } : this.payload = r, this.chainId = c ?? S$, this.postConditionMode = s ?? qi.Deny, this.postConditions = o ?? hh([]), i)
      this.anchorMode = $$(i);
    else
      switch (r.payloadType) {
        case st.Coinbase:
        case st.CoinbaseToAltRecipient:
        case st.NakamotoCoinbase:
        case st.PoisonMicroblock:
        case st.TenureChange:
          this.anchorMode = Kn.OnChainOnly;
          break;
        case st.ContractCall:
        case st.SmartContract:
        case st.VersionedSmartContract:
        case st.TokenTransfer:
          this.anchorMode = Kn.Any;
          break;
      }
  }
  signBegin() {
    const t = Wd(this);
    return t.auth = J0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Wd(this);
    return t.auth = J0(t.auth), t.txid();
  }
  verifyOrigin() {
    return L6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Jt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Jt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Jt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !ja(n)) {
      const r = ia(t);
      n.fields.push(Bi(r ? Xt.Compressed : Xt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, o) {
    const { nextSig: s, nextSigHash: i } = E6(n, r, t.fee, t.nonce, o);
    return ja(t) ? t.signature = s : t.fields.push(Bi(o.data.byteLength === Bm ? Xt.Compressed : Xt.Uncompressed, s)), i;
  }
  txid() {
    const t = this.serialize();
    return gh(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Jt.Sponsored)
      throw new ml("Cannot sponsor sign a non-sponsored transaction");
    this.auth = N6(this.auth, t);
  }
  setFee(t) {
    this.auth = C6(this.auth, t);
  }
  setNonce(t) {
    this.auth = T6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Jt.Sponsored)
      throw new ml("Cannot sponsor sign a non-sponsored transaction");
    this.auth = B6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new $o('"version" is undefined');
    if (this.chainId === void 0)
      throw new $o('"chainId" is undefined');
    if (this.auth === void 0)
      throw new $o('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new $o('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new $o('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return Wo(n, this.chainId, 0), t.push(n), t.push(M6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(ph(this.postConditions)), t.push(qm(this.payload)), sn(t);
  }
}
function Ni(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new La(jt(e.slice(2))) : t = new La(jt(e)) : e instanceof Uint8Array ? t = new La(e) : t = e;
  const n = t.readUInt8Enum(gl, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), o = P6(t), s = t.readUInt8Enum(Kn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(qi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), c = Qm(t, ke.PostCondition), l = z8(t);
  return new _6(n, o, l, c, i, s, r);
}
const U6 = A8, Ca = xn, O6 = Gm;
const H6 = /* @__PURE__ */ new Set([4001, -31001]), D6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], F6 = ["result", "data", "payload", "response", "params"], Q0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], tu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), ci = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, xs = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, j6 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), ub = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, o) => !!(r != null && r.id) && n.findIndex((s) => j6(s, r)) === o
  );
}, db = (e) => e ? ub(ci()).some(
  (t) => {
    var n;
    return t.id === e && (tu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, fb = () => {
  if (typeof window > "u")
    return;
  const e = ci(), t = ub(e).filter(
    (n) => {
      var r;
      return tu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = xs(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of D6) {
    const r = xs(e, n) ?? (e === window ? void 0 : xs(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, R6 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = ci(), n = xs(t, e) ?? (t === window ? void 0 : xs(window, e)) ?? jl(e);
  if (n)
    return n;
  if (tu(e) || db(e))
    return fb();
}, Tc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, z6 = ["blockstack-session", "blockstack"], G6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of z6) {
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
G6();
const hb = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, or = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, K6 = (e) => {
  const t = or(e);
  if (!t)
    return null;
  const n = hb(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, V6 = (e) => {
  const t = or(e);
  if (!t)
    return null;
  const n = hb(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Zd = (e, t = "mainnet") => {
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
      return Zd(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Zd(r, t);
  }
  return t;
}, Uo = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, Ra = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const o = e.trim();
    return _i(o) ? o : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const o of e) {
      const s = Ra(o, t + 1);
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
    const s = Ra(n[o], t + 1);
    if (s)
      return s;
  }
  return typeof n.mainnet == "string" && _i(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && _i(n.testnet) ? n.testnet.trim() : null;
}, eg = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, pb = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && H6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Jo = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = or(n == null ? void 0 : n.message) ?? or(t.message) ?? or(t.error) ?? or(e) ?? "Wallet provider request failed.", o = new Error(r);
  return o.code = (n == null ? void 0 : n.code) ?? t.code, o.data = (n == null ? void 0 : n.data) ?? t.data, o;
}, Qi = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw Jo(t);
    if (t.status === "error")
      throw Jo(t.result ?? t);
  }
  return e;
}, tg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return Qi(r);
  } catch (r) {
    throw Jo(r);
  }
}, gb = () => fb(), wh = () => {
  if (typeof window > "u")
    return;
  const e = ci();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = xs(e, t) ?? (e === window ? void 0 : xs(window, t));
    if (n)
      return n;
  }
}, ng = () => {
  if (typeof window > "u")
    return;
  const e = wh();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = ci();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = xs(t, n) ?? (t === window ? void 0 : xs(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Vc = (e) => {
  var r, o;
  const t = zo();
  if (tu(t) || db(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ci() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) || e === gb();
}, Pu = (e) => {
  const t = V6(e);
  if (!t)
    return null;
  try {
    const n = Ni(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, bl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Pu(e), r = K6(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? or(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const c of e) {
      const l = bl(c, t + 1);
      if (l)
        return l;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const o = e;
  let s = null;
  for (const c of Q0)
    if (Pu(o[c])) {
      s = or(o[c]);
      break;
    }
  const i = or(o.txId) || or(o.txid) || or(o.transactionId);
  if (i)
    return {
      ...o,
      txId: i,
      txid: i,
      txRaw: s ?? or(o.txRaw) ?? void 0
    };
  for (const c of Q0) {
    const l = Pu(o[c]);
    if (l)
      return {
        ...o,
        txId: l,
        txid: l,
        txRaw: or(o[c]) ?? void 0
      };
  }
  for (const c of F6) {
    const l = o[c], u = bl(l, t + 1);
    if (u)
      return {
        ...o,
        ...l && typeof l == "object" ? l : {},
        ...u,
        txId: u.txId,
        txid: u.txid ?? u.txId
      };
  }
  return null;
}, _u = (e) => {
  const t = bl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, X6 = (e) => {
  const t = bl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, Y6 = (e) => ({
  ...e,
  fee: Uo(e.fee),
  nonce: Uo(e.nonce),
  sponsored: e.sponsored === !0
}), rg = (e) => ({
  recipient: e.recipient,
  amount: Uo(e.amount) ?? "0",
  memo: e.memo,
  network: Zd(e.network),
  address: e.stxAddress,
  fee: Uo(e.fee),
  nonce: Uo(e.nonce),
  sponsored: e.sponsored ?? !1
}), yb = "WALLET_ADDRESS_MISMATCH", q6 = 45e3;
let Ta = null;
const Jd = (e) => {
  e && (Ta = { address: e, at: Date.now() });
}, W6 = () => {
  Ta = null;
}, Z6 = () => Ta && Date.now() - Ta.at <= q6 ? Ta.address : null, J6 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, Q6 = async (e) => {
  W6();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = Qi(await e.request("wallet_connect")), n = Ra(t);
  return Jd(n), n;
}, e5 = async (e, t, n, r) => {
  try {
    return Qi(await e.request(t, n));
  } catch (o) {
    const s = Jo(o);
    if (!J6(s))
      throw s;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: s.message
    });
    let i = null;
    try {
      i = await Q6(e);
    } catch (c) {
      throw console.info("[wallet:xverse-preflight]", {
        stage: "RECOVERY_RECONNECT_FAILED",
        message: c instanceof Error ? c.message : String(c)
      }), s;
    }
    if (!i || r && i !== r)
      throw Object.assign(
        new Error(
          i ? `Xverse reconnected as ${i}, not the expected ${r}. Switch back to that account and retry.` : s.message
        ),
        { code: i ? yb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return Qi(await e.request(t, n));
    } catch (c) {
      throw Jo(c);
    }
  }
};
let sg = 3e4;
const t5 = (e, t) => {
  let n;
  const r = new Promise((o, s) => {
    n = setTimeout(() => {
      s(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${sg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, sg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, n5 = async (e, t, n) => {
  const r = (l, u) => {
    if (t && l !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${l} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: yb }
      );
    return l;
  }, o = Z6();
  if (o)
    return Tc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: o }), r(o, "cached-session");
  let s = null;
  Tc(n, "account-read");
  try {
    const l = Qi(
      await t5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    s = Ra(l), console.info("[wallet:xverse-preflight]", {
      stage: s ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: s
    });
  } catch (l) {
    if (pb(l))
      throw Jo(l);
    Tc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: l instanceof Error ? l.message : String(l)
    });
  }
  if (s)
    return Jd(s), r(s, "wallet_getAccount");
  let i;
  Tc(n, "account-reconnect");
  try {
    i = Qi(await e.request("wallet_connect"));
  } catch (l) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: l instanceof Error ? l.message : String(l)
    }), Jo(l);
  }
  const c = Ra(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: c }), !c)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Jd(c), r(c, "wallet_connect");
}, r5 = async (e, t) => {
  if (!Vc(e)) {
    const s = await tg(
      e,
      "stx_transferStx",
      rg(t)
    );
    return _u(s);
  }
  const n = wh();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const s = await tg(
      n,
      "stx_transferStx",
      rg(t)
    );
    return _u(s);
  }
  const r = gb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await n5(r, t.stxAddress);
  const o = await e5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Uo(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Uo(t.fee) } : {}
    },
    t.stxAddress
  );
  return _u(o);
}, s5 = () => zo(), wb = () => {
  var r, o;
  if (typeof window > "u")
    return;
  const e = zo(), t = e ? R6(e) : void 0;
  if (t)
    return t;
  const n = ci() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((o = n.xverseProviders) == null ? void 0 : o.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, og = (e, t) => {
  const n = wb(), r = Y6({
    ...e,
    onFinish: (o) => {
      var s;
      (s = e.onFinish) == null || s.call(e, X6(o));
    }
  });
  if (!n || typeof n.request != "function")
    return $c(r, t);
  if (Vc(n) && !wh()) {
    const o = ng();
    if (o)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: zo(),
        route: "legacy-transaction-request"
      }), $c(r, o);
  }
  return void r5(n, e).then((o) => {
    var s;
    (s = e.onFinish) == null || s.call(e, o);
  }).catch((o) => {
    var s, i;
    if (eg(o) && Vc(n)) {
      const c = ng();
      if (c) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: zo(),
          route: "legacy-transaction-request"
        }), $c(r, c);
        return;
      }
    }
    if (eg(o) && !Vc(n)) {
      $c(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", o), pb(o)) {
      (s = e.onCancel) == null || s.call(e);
      return;
    }
    if (e.onError) {
      e.onError(o);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, o5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), ig = (e) => rb(e).replace(/^0x/, ""), ag = "This wallet cannot sign messages. Try Xverse or Leather.", cg = (e) => typeof (e == null ? void 0 : e.request) == "function", lg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", i5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, a5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function c5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: ig(t.message),
    domain: ig(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function l5(e, t) {
  const n = await t$({
    domain: t.domain,
    message: t.message,
    network: ql(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? o5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Uu(e) {
  var o, s;
  const t = s5() || "", n = /xverse/i.test(t);
  let r = wb();
  if (n && !lg(r)) {
    const i = window;
    r = ((o = i.XverseProviders) == null ? void 0 : o.StacksProvider) ?? ((s = i.xverseProviders) == null ? void 0 : s.StacksProvider);
  }
  if (lg(r))
    try {
      return await l5(r, e);
    } catch (i) {
      if (n || !cg(r) || !a5(i)) throw i;
    }
  if (!n && cg(r))
    try {
      return await c5(r, e);
    } catch (i) {
      throw i5(i) ? new Error(ag) : i;
    }
  throw new Error(ag);
}
const ug = 1000000n, ws = 1000000n, xl = 50n, nn = 3000n, _r = 300n, ga = 3000n, u5 = 50000n, d5 = 300n, f5 = 200n, nu = 15000n, Nn = (e) => e + xl;
function Ir(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / ug}.${(n % ug).toString().padStart(6, "0")}`;
}
function dg(e, t = _r) {
  return e <= nn ? 0 : Number((e - nn) / Nn(t));
}
function Ou(e, t = 0n) {
  const n = ws - e - t;
  return n > 0n ? n : 0n;
}
function h5(e, t = _r) {
  return e > ws ? "over" : e < nn + Nn(t) ? "empty" : e < u5 ? "low" : "ok";
}
const p5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", g5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", y5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function w5(e) {
  var n, r, o, s;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((o = t["holder-payment"]) == null ? void 0 : o.value) !== "50" || ((s = t["receipt-bytes"]) == null ? void 0 : s.value) !== "16" || y5.some((i, c) => {
    var l;
    return ((l = t["core-" + (c + 1)]) == null ? void 0 : l.value) !== p5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const mb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Hu = 3, m5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", b5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", fg = 1, [Qd, bb] = mb.split("."), yr = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function ef(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function x5(e) {
  return yr(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function co(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function xb(e, t = []) {
  const n = await co(`/v2/contracts/call-read/${Qd}/${bb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Qd, arguments: t.map((r) => "0x" + yr(tn(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Cr(xr(n.result));
}
async function S5() {
  const e = await co(`/v2/contracts/source/${Qd}/${bb}?proof=0`);
  if (typeof e.source != "string" || await x5(e.source) !== g5) throw Error("Deployed source does not match the tested helper.");
  if (w5(await xb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Sb(e) {
  return e.startsWith("SP") && _i(e) && !e.includes(".");
}
async function v5(e) {
  var r;
  if (!Sb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await co(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await co(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function A5(e) {
  const t = await co(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function E5(e, t) {
  var o, s;
  const n = await xb("get-owner", [Ca(e), Ca(t)]), r = (n == null ? void 0 : n.success) === !0 ? (s = (o = n.value) == null ? void 0 : o.value) == null ? void 0 : s.value : null;
  if (typeof r != "string" || !Sb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function k5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: ef(e), signal: AbortSignal.timeout(15e3) });
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
async function $5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function I5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = Ni(ef(e.raw)), n = t.auth, r = t.payload, o = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || o.hashMode !== 0 || Ti(va(yl.MainnetSingleSig, o.signer)) !== e.address || o.fee !== BigInt(e.fee) || o.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const s = t.postConditions.values[0];
    if (r.payloadType !== 2 || Ti(r.contractAddress) + "." + r.contractName.content !== mb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || yr(tn(r.functionArgs[0])) !== yr(tn(Ca(e.core))) || yr(tn(r.functionArgs[1])) !== yr(tn(Ca(e.song))) || yr(tn(r.functionArgs[2])) !== yr(tn(O6(ef(e.id)))) || e.amount !== "50" || t.postConditionMode !== qi.Deny || t.postConditions.values.length !== 1 || s.conditionType !== 0 || s.amount !== 50n || s.conditionCode !== Ha.Equal || s.principal.prefix !== 2 || Ti(s.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || Ti(r.contractAddress) + "." + r.contractName.content !== m5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || yr(tn(r.functionArgs[0])) !== yr(tn(Ca(e.song))) || typeof e.liked != "boolean" || yr(tn(r.functionArgs[1])) !== yr(tn(U6(e.liked))) || e.amount !== "0" || t.postConditionMode !== qi.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Cr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const L5 = "xtrata.xyz/radio/listening-wallet", C5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Yr = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && _i(e), T5 = (e) => ({
  domain: dr({ name: mt(L5), version: mt("1"), "chain-id": xn(1) }),
  message: dr({
    purpose: mt(C5),
    main: mt(e.main),
    listening: mt(e.listening),
    issued: xn(e.issued)
  })
}), vb = 100000n, B5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function N5(e, t) {
  const n = e.filter((o) => !o || typeof o.sender != "string" || o.sender === t || !Yr(o.sender) || !/^\d+$/.test(o.amount) ? !1 : BigInt(o.amount) >= vb).sort(B5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((o) => o.sender)).size };
}
const Bc = 50;
function Sl(e) {
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
async function M5(e, t, n = 4) {
  if (!Yr(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${Bc}&offset=${i}`, o = Sl(await t(r(0)));
    if (!o || o.total > 0 && !o.transfers.length) return { ok: !1 };
    if (o.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let s = Math.max(0, o.total - Bc);
    for (let i = 0; i < n; i++) {
      const c = s === 0 && o.total <= Bc ? o : Sl(await t(r(s)));
      if (!c || !c.transfers.length) return { ok: !1 };
      const l = N5(c.transfers, e);
      if (l.ok && l.funder) return s > 0 ? { ...l, distinct: Math.max(l.distinct, 2) } : l;
      if (s === 0) return l;
      s = Math.max(0, s - Bc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const hs = 50, P5 = 6, _5 = 20, hg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function pg(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], o = [];
  for (const s of n.results) {
    const i = s && typeof s == "object" && s.tx && typeof s.tx == "object" ? s.tx : s;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (o.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const c = i.token_transfer;
    if (!c || typeof c.recipient_address != "string" || typeof c.amount != "string" || !/^\d+$/.test(c.amount)) return null;
    const l = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(l) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: c.recipient_address, amount: BigInt(c.amount), txId: i.tx_id, blockHeight: l, txIndex: u });
  }
  return { total: n.total, sent: r, rows: o };
}
async function U5(e, t, n) {
  if (!Yr(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), o = Sl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${hs}&offset=0`));
    if (!o || o.total > P5 * hs) return { ok: !1 };
    for (const i of o.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = hs; i < o.total; i += hs) {
      const c = Sl(await t(`/extended/v1/address/${e}/stx_inbound?limit=${hs}&offset=${i}`));
      if (!c || !c.transfers.length) return { ok: !1 };
      for (const l of c.transfers) r.set(l.txId + ":" + l.txIndex, l);
    }
    if (r.size !== o.total) return { ok: !1 };
    const s = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${hs}&offset=${u}`, c = pg(await t(i(0)), e);
      if (!c || c.total > _5 * hs) return { ok: !1 };
      const l = new Set(c.rows);
      for (const u of c.sent) s.set(u.txId, u);
      for (let u = hs; u < c.total; u += hs) {
        const p = pg(await t(i(u)), e);
        if (!p || !p.rows.length) return { ok: !1 };
        for (const d of p.rows) l.add(d);
        for (const d of p.sent) s.set(d.txId, d);
      }
      if (l.size !== c.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...s.values()] };
  } catch {
    return { ok: !1 };
  }
}
function O5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const o = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(hg).map((d, w) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: w } : Yr(d.sender) && y >= vb ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: y, kind: "dust", to: null, at: w };
  }), s = o.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && Yr(d.recipient) && d.amount > 0n).sort(hg), c = i.reduce((d, w) => d + w.amount, 0n), l = s - n - c;
  if (l < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (d, w) => {
    let y = w;
    for (const v of d) {
      if (y <= 0n) break;
      const x = v.left < y ? v.left : y;
      v.left -= x, y -= x;
    }
    return y;
  };
  for (const d of i) {
    const w = u(o.filter((y) => y.to === d.recipient), d.amount);
    w > 0n && u(o, w);
  }
  if (u(o, l) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (o.reduce((d, w) => d + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const p = /* @__PURE__ */ new Map();
  for (const d of o) {
    if (d.left <= 0n) continue;
    const w = `${d.kind}:${d.to ?? ""}`, y = p.get(w);
    y ? (y.amount += d.left, y.newest = Math.max(y.newest, d.at)) : p.set(w, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...p.values()].sort((d, w) => d.newest - w.newest),
    hasTopUp: o.some((d) => d.kind === "deposit")
  };
}
function H5(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, p) => u.newest - p.newest), r = e.find((u) => u.kind === "gift"), o = e.filter((u) => u.kind === "dust"), s = ((r == null ? void 0 : r.amount) ?? 0n) + o.reduce((u, p) => u + p.amount, 0n), i = [], c = [], l = s > t;
  return n.forEach((u, p) => {
    if (u.amount <= t) {
      c.push(u);
      return;
    }
    const d = p === n.length - 1 && !l;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), l ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: s - t }) : (r && c.push(r), c.push(...o)), { steps: i, tooSmall: c };
}
function gg(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Nc = 1500n, Xc = [100, 250, 500], D5 = (e, t) => BigInt(e) * Nn(t), ya = ["prepared", "signed", "unknown", "pending"], F5 = 30 * 6e4, vl = 6e4, Si = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, j5 = 3e3, Al = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Du = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function R5(e) {
  let t = null, n = -1 / 0, r, o = null, s = null, i, c = -1 / 0, l = null, u = null, p = !1, d = !1, w = !1, y = null, v = !1, x = "", L = "", B = 0, _, A = null, T, P = [], K, ie = -1 / 0;
  const ee = /* @__PURE__ */ new Set();
  let X = null, m = !1, I = 0, N = null, M = null, Y = !1, j = null, ae = !1, ce = null, Ke = !1, C = !1, F = !1, te = !1, le = !1, Ce = 0, Ne = null, _t = Promise.resolve();
  const je = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? _r.toString()), Me = (b) => !!s && !(s.features ?? []).includes(b), Pe = (b, E) => `xtrata.ppp.v1.${b}:${E}`, Nt = "xtrata.ppp.v1.as-main", Sn = () => {
    if (e.main()) return;
    const b = e.store.get(Nt);
    return b && Yr(b) ? b : void 0;
  }, ct = () => e.main() ?? Sn(), Yt = (b = s == null ? void 0 : s.address) => {
    if (!b) return [];
    try {
      const E = JSON.parse(e.store.get(Pe("entries", b)) || "[]");
      return Array.isArray(E) ? E : [];
    } catch {
      return [];
    }
  }, Et = (b) => {
    const E = [b, ...Yt(b.address).filter((z) => !(z.txid === b.txid && z.kind === b.kind))].slice(0, 200);
    e.store.set(Pe("entries", b.address), JSON.stringify(E));
  }, R = (b = s == null ? void 0 : s.address) => !!b && e.store.get(Pe("on", b)) !== "0", O = (b) => {
    s != null && s.address && e.store.set(Pe("on", s.address), b ? "1" : "0");
  }, J = () => Yt().filter((b) => ya.includes(b.status)), re = () => Xe() ? [...J(), ...Yt(qe()).filter((b) => ya.includes(b.status))] : J(), fe = () => ut(s == null ? void 0 : s.address), ut = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Pe("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, Te = (b, E = s == null ? void 0 : s.address) => {
    E && e.store.set(Pe("deposit", E), JSON.stringify(b));
  };
  let Ue = null;
  const bt = (b = vl) => {
    const E = e.now();
    Ue = { since: Ue && E < Ue.until ? Ue.since : E, until: Math.max((Ue == null ? void 0 : Ue.until) ?? 0, E + b) };
  }, Re = () => !!Ue && e.now() < Ue.until && (i === void 0 || i < nn + Nn(je())), Ae = () => !!fe() || Re(), qe = () => Me("rootLike") ? s == null ? void 0 : s.address : (s == null ? void 0 : s.root) ?? (s == null ? void 0 : s.address), Xe = () => !!(s != null && s.address) && qe() !== s.address, ze = () => Xe() ? l && l.for === qe() ? l.value : void 0 : i, Ut = () => Me("likeFee") ? f5 : d5, dn = (b) => b !== void 0 && b < nn + Ut(), fn = () => J().filter((b) => e.now() - b.created > F5 && ee.has(b.txid)), Fn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!ct() || r === ct() && !t.allowed), kt = () => Fn() && !(s != null && s.linked), an = () => {
    const b = ct();
    return !kt() && !!b && !!(s != null && s.linked) && s.linked !== b;
  }, Sr = (b) => Pe("return-to", b), Ur = (b = s == null ? void 0 : s.address) => {
    if (!b) return;
    const E = e.store.get(Sr(b));
    return E && Yr(E) && E !== b ? E : void 0;
  }, fr = (b = s == null ? void 0 : s.address) => X && X.for === b ? X.res : null;
  function wt() {
    if (!(s != null && s.address)) return;
    if (s.linked) return { to: s.linked, kind: "linked" };
    const b = Ur();
    if (b) return { to: b, kind: "chosen" };
    const E = fr();
    if (E != null && E.ok && E.funder) return { to: E.funder, kind: "funder" };
  }
  const hn = (b) => Pe("gift", b);
  function Ot() {
    const b = s == null ? void 0 : s.address;
    if (!b) return null;
    if ((j == null ? void 0 : j.for) === b) return j.info;
    try {
      const E = JSON.parse(e.store.get(hn(b)) || "null");
      return E && typeof E.returnTo == "string" && typeof E.treasury == "string" ? E : null;
    } catch {
      return null;
    }
  }
  const pn = () => (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : ((s == null ? void 0 : s.slot) ?? 0) === 0 ? s == null ? void 0 : s.address : void 0;
  let At = null, Rt = null, Or = !1;
  const rs = (b) => Pe("award-claim", b), k = (b) => Pe("award-send", b), U = (b) => {
    try {
      const E = JSON.parse(e.store.get(k(b)) || "null");
      return E && typeof E.txid == "string" && e.now() - E.at < 2 * 36e5 ? E : null;
    } catch {
      return null;
    }
  }, G = (b) => {
    try {
      const E = JSON.parse(e.store.get(rs(b)) || "null");
      return E && typeof E.txid == "string" && e.now() - E.at < 2 * 36e5 ? E : null;
    } catch {
      return null;
    }
  };
  async function D(b = !1) {
    var ve;
    const E = pn();
    if (!E || !e.awardStatus || Or) return;
    const z = (At == null ? void 0 : At.for) === E ? At : null, Z = z == null ? void 0 : z.view.state, Ie = Z === "not-a-player" && ((ve = Ot()) == null ? void 0 : ve.drop) === "players", V = z ? Ie ? 2e4 : Z === "off" || Z === "not-a-player" ? 30 * 6e4 : G(E) || U(E) ? 2e4 : Z === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(z && !b && e.now() - z.at < V)) {
      Or = !0;
      try {
        const me = await e.awardStatus(E);
        if (At = { for: E, view: me, at: e.now() }, me.state === "claimed" && e.store.set(rs(E), ""), me.state === "claimed" && me.holds === !1 && e.store.set(k(E), ""), me.state === "ready" && e.awardName && (Rt == null ? void 0 : Rt.for) !== E)
          try {
            Rt = { for: E, name: await e.awardName(E), at: e.now() };
          } catch {
            Rt = { for: E, name: void 0, at: e.now() };
          }
      } catch {
        At = { for: E, view: z && z.view.state !== "off" && z.view.state !== "not-a-player" ? { ...z.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Or = !1;
      }
    }
  }
  function W() {
    const b = pn();
    if (!b || (At == null ? void 0 : At.for) !== b) return null;
    const E = At.view;
    if (E.state === "off" || E.state === "not-a-player") return null;
    const z = E.state === "claimed" ? null : G(b), Z = E.state === "claimed" && E.holds !== !1 ? U(b) : null;
    return { ...E, ...(Rt == null ? void 0 : Rt.for) === b ? { name: Rt.name } : {}, ...z ? { claimTx: z.txid } : {}, ...Z ? { sendTx: Z.txid } : {} };
  }
  async function Q() {
    var Ie;
    const b = s == null ? void 0 : s.address;
    if (!b || !e.giftInfo || !((Ie = t == null ? void 0 : t.gifts) != null && Ie.enabled) || ae) return;
    const E = (j == null ? void 0 : j.for) === b ? j : null, z = E ? E.ok ? E.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (E && e.now() - E.at < z) return;
    ae = !0;
    const Z = Ot();
    try {
      const V = await e.giftInfo(b);
      j = { for: b, info: V, ok: !0, at: e.now() }, e.store.set(hn(b), JSON.stringify(V));
    } catch {
      j = { for: b, info: Z, ok: !1, at: e.now() };
    } finally {
      ae = !1;
    }
  }
  const $e = () => Yt().reduce((b, E) => ya.includes(E.status) ? b + BigInt(E.amount || "0") + BigInt(E.fee || "0") : b, 0n);
  function Se() {
    if (i === void 0) return 0;
    const b = i - $e() - BigInt(Gt.length) * Nn(je());
    return b > 0n ? dg(b, je()) : 0;
  }
  const He = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", dt = "EMPTY — ADD STX TO PLAY";
  function $() {
    if (!(t != null && t.here)) return null;
    const b = (E, z) => ({ reason: E, text: z });
    switch (pt()) {
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
        return Ae() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Xe() ? He : dt);
      case "ready":
        return !R() || !(s != null && s.session) || s.session.playsLeft < 1 || s.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : F ? Se() < 1 ? b("out", Xe() ? He : dt) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const he = () => {
    var b;
    return !!(s != null && s.address) && Xe() && !!((b = Ot()) != null && b.player);
  };
  function Fe() {
    return he() ? { locked: !0, known: !0 } : null;
  }
  const lt = 3 * 6e4, zt = () => !!Ot() && !!e.history && !(s != null && s.linked);
  async function Ht() {
    const b = s.address, E = Ot(), { balance: z, nonce: Z } = await e.chain.account(b), Ie = await e.history(b, !0);
    if (!Ie.ok) return null;
    const V = O5({ self: b, balance: z, inbound: Ie.inbound, outgoing: Ie.outgoing, gift: { sender: E.treasury, payer: E.returnTo } });
    if (!V.ok) return null;
    const ve = H5(V.parts, ga);
    return { balance: z, nonce: Z, parts: V.parts, steps: ve.steps, tooSmall: ve.tooSmall.length };
  }
  const cn = () => Ke ? { state: "unavailable" } : !ce || e.now() - ce.at > lt || i !== void 0 && i !== ce.balance ? { state: "none" } : ce.plan;
  function pt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = ct();
    if (!kt()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return s ? s.state === "unsupported" ? "unsupported" : s.state === "none" ? "intro" : an() ? "wrong-wallet" : s.state === "known" ? "locked" : !kt() && s.linked !== b ? "link" : i === void 0 ? "loading" : i > ws && !s.backedUp ? "over" : i < nn + Nn(je()) ? "fund" : "ready" : "loading";
  }
  const Yn = () => {
    var b, E, z, Z, Ie;
    return {
      step: pt(),
      busy: u,
      message: x,
      error: L,
      notice: Hr(),
      gate: t,
      main: ct(),
      mainConnected: !!e.main(),
      standIn: Sn(),
      listening: s == null ? void 0 : s.address,
      linked: s == null ? void 0 : s.linked,
      award: W(),
      unproven: !!(s != null && s.unproven),
      phrase: !!(s != null && s.hasBackup),
      backedUp: !!(s != null && s.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((V) => V === "over" && (s != null && s.backedUp) ? "ok" : V)(h5(i, je())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > ws && !!(s != null && s.backedUp),
      playsLeft: i === void 0 ? 0 : dg(i, je()),
      allowance: i === void 0 ? ws : Ou(i, BigInt(((b = fe()) == null ? void 0 : b.amount) ?? "0")),
      session: (s == null ? void 0 : s.session) ?? null,
      payingOn: R(),
      entries: Yt(),
      depositTxid: ((E = fe()) == null ? void 0 : E.txid) ?? _,
      depositPending: Ae(),
      arrival: Ae() ? { since: ((z = fe()) == null ? void 0 : z.at) ?? (Ue == null ? void 0 : Ue.since) ?? e.now(), graceMs: vl } : null,
      walletOutdated: Me("like"),
      canAnother: !!s && !Me("another"),
      canForget: !!s && !Me("forget"),
      passkeyName: s == null ? void 0 : s.passkeyName,
      hadGift: s != null && s.address && (j == null ? void 0 : j.for) === s.address && j.ok ? !!j.info : null,
      linkedListening: K && K === ct() ? P.map((V) => V.listening) : [],
      serverLinked: !!A && T === `${ct()}:${s == null ? void 0 : s.address}`,
      stuck: fn().length,
      armed: te,
      queued: Gt.length,
      solo: kt(),
      returnTo: (Z = wt()) == null ? void 0 : Z.to,
      returnToKind: (Ie = wt()) == null ? void 0 : Ie.kind,
      funderState: (() => {
        const V = fr();
        return V ? V.ok ? V.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const V = fr();
        return !!V && V.ok && V.distinct > 1;
      })(),
      walletCannotSolo: kt() && Me("standalone"),
      walletCannotMulti: Me("multi"),
      others: ((s == null ? void 0 : s.others) ?? []).filter((V) => V !== ct() && V !== (s == null ? void 0 : s.linked)),
      creditedTo: kt() && (s != null && s.address) && (N == null ? void 0 : N.for) === s.address && N.main ? N.main : void 0,
      createdHere: !!(s != null && s.address) && e.store.get(Pe("created", s.address)) === "1",
      brandNew: !!(s != null && s.address) && i === 0n && (M == null ? void 0 : M.for) === s.address && M.unused,
      gift: (() => {
        const V = Ot();
        return V ? { player: V.player, from: V.from, source: V.source, amount: V.amount, ...V.drop !== void 0 ? { drop: V.drop } : {} } : null;
      })(),
      giftPlays: Ot() ? Se() : 0,
      playCost: Nn(je()),
      giftStop: $(),
      albumLock: Fe(),
      returnPlan: cn(),
      slot: (s == null ? void 0 : s.state) === "unlocked" ? s.slot ?? 0 : 0,
      root: (s == null ? void 0 : s.state) === "unlocked" ? s.root ?? s.address : void 0,
      walletCannotAlbums: Me("slots"),
      likeFunds: (() => {
        var me;
        const V = qe();
        if (!V || (s == null ? void 0 : s.state) !== "unlocked") return null;
        const ve = ze();
        return { address: V, balance: ve, low: dn(ve), album: Xe(), pending: !!ut(V), txid: (me = ut(V)) == null ? void 0 : me.txid, main: ct() };
      })()
    };
  }, Hr = () => B ? B < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", be = (b, E = "") => {
    x = b, L = E, e.changed();
  };
  async function qt(b, E) {
    if (!u) {
      u = b, L = "", e.changed();
      try {
        await E();
      } catch (z) {
        const Z = z instanceof Error ? z.message : String(z);
        L = /Cancelled in the listening wallet/.test(Z) ? "" : Z, L || (x = "Not now. Nothing was signed.", le = !0);
      } finally {
        u = null, await Rn(!0);
      }
    }
  }
  const ho = () => !!(t != null && t.enabled) && t.here && (kt() || !!ct() && t.allowed), qn = () => ho() && !an(), po = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", jn = () => {
    if (an()) throw new Error(po());
  };
  async function In() {
    if (!ho()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return o ?? (o = await e.bridge(t.walletOrigin)), o;
  }
  const gn = (b) => {
    const E = ct();
    return b.request("listening.status", E ? { main: E } : void 0);
  };
  async function Es(b = !1) {
    s != null && s.address && (!b && e.now() - c < 3e4 || (i = await e.chain.balance(s.address), c = e.now(), await go(b)));
  }
  async function go(b = !1) {
    const E = qe();
    if (!(!Xe() || !E || (s == null ? void 0 : s.state) !== "unlocked") && !(!b && (l == null ? void 0 : l.for) === E && e.now() - l.at < 3e4))
      try {
        l = { for: E, value: await e.chain.balance(E), at: e.now() };
      } catch {
      }
  }
  async function li(b) {
    if ((K !== b || e.now() - ie >= 6e4) && (P = await e.links(b), K = b, ie = e.now()), (s == null ? void 0 : s.state) !== "unlocked" || s.linked === b) return;
    const E = `${b}:${s.address}`;
    T === E && A || (A = P.find((z) => z.listening === s.address) ?? null, T = E);
  }
  async function Ln() {
    const b = s == null ? void 0 : s.address;
    if (!kt() || !b || s != null && s.linked || !e.funder || m || !i || i <= 0n) return;
    const E = fr(b);
    if (E != null && E.ok && E.funder) return;
    const z = E != null && E.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, I - 1), 30 * 6e4);
    if (!(X && X.for === b && e.now() - X.at < z)) {
      m = !0;
      try {
        X = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        X = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      I = X.res.ok ? 0 : I + 1;
    }
  }
  async function Wn() {
    const b = s == null ? void 0 : s.address;
    if (!(!kt() || !b || s != null && s.linked || !e.mainOf || Y) && !(N && N.for === b && (N.ok || e.now() - N.at < 6e4))) {
      Y = !0;
      try {
        N = { for: b, main: await e.mainOf(b), ok: !0, at: e.now() };
      } catch {
        N = { for: b, main: null, ok: !1, at: e.now() };
      } finally {
        Y = !1;
      }
    }
  }
  async function ss() {
    const b = s == null ? void 0 : s.address;
    if (!(!b || (s == null ? void 0 : s.state) !== "unlocked" || i !== 0n || (M == null ? void 0 : M.for) === b) && e.store.get(Pe("created", b)) !== "1")
      try {
        M = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function Dr() {
    var Ie;
    const b = s == null ? void 0 : s.address;
    if (!b) return !1;
    let E, z = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const V of re())
      try {
        const ve = await e.chain.transaction(V.txid);
        if (!ve) {
          if (ee.add(V.txid), e.now() - V.created > 15 * 6e4 && !Z.has(V.address) && Z.set(V.address, await e.chain.confirmedNonce(V.address)), E = Z.get(V.address), E !== void 0 && E > BigInt(V.nonce)) {
            Et({ ...V, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((V.status === "unknown" || V.status === "signed") && V.raw)
            try {
              await e.chain.broadcast(V.raw, V.txid), Et({ ...V, status: "pending" });
            } catch (Le) {
              Si(Le) && Et({ ...V, status: "failed", note: Le.message, raw: void 0 });
            }
          continue;
        }
        ee.delete(V.txid);
        const me = String(ve.tx_status);
        if (me === "success" && ve.canonical !== !1 && ve.is_unanchored === !1) {
          if (Et({ ...V, status: "confirmed", confirmedAt: e.now(), actualFee: String(ve.fee_rate ?? V.fee), raw: void 0 }), z = !0, V.kind === "like" && (v = !0, V.status !== "confirmed" && typeof V.liked == "boolean"))
            try {
              (Ie = e.likeConfirmed) == null || Ie.call(e, V.song, V.liked);
            } catch {
            }
        } else me.startsWith("abort_") || me.startsWith("dropped_") ? Et({ ...V, status: "failed", note: me, raw: void 0 }) : V.status !== "pending" && Et({ ...V, status: "pending" });
      } catch {
      }
    for (const V of Xe() ? [b, qe()] : [b]) {
      const ve = ut(V);
      if (ve)
        try {
          const me = await e.chain.transaction(ve.txid), Le = String((me == null ? void 0 : me.tx_status) ?? "");
          (Le === "success" && me.is_unanchored === !1 || Le.startsWith("abort_") || Le.startsWith("dropped_") || !me && e.now() - ve.at > 2 * 36e5) && (Te(null, V), Le === "success" && bt(2e4), c = -1 / 0, l = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return z;
  }
  async function Rn(b = !1) {
    var E;
    try {
      const z = ct();
      if ((b || !t || r !== z || e.now() - n > 3e5) && (t = await e.config(z), n = e.now(), r = z), !t.enabled || !t.here || !kt() && (!z || !t.allowed)) {
        o && (s != null && s.session) && await o.request("listening.stop").catch(() => {
        }), te && ks(), e.changed();
        return;
      }
      await In(), s = await gn(o), an() && s.state === "unlocked" && (We(), await o.request("listening.lock").catch(() => {
      }), i = void 0, s = await gn(o)), z && t.allowed && await li(z), await Es(b), await Ln(), await Wn(), await ss(), await Q(), await D(), await Dr() && await Es(!0), await go(), await aa(), B = 0;
    } catch {
      B++;
    }
    if (pt() === "locked" ? os() : te && ks(), v) {
      v = !1;
      try {
        (E = e.likesChanged) == null || E.call(e);
      } catch {
      }
    }
    e.changed(), Gt.length && !ls && Zn();
  }
  async function yo(b) {
    const E = s == null ? void 0 : s.root;
    if (!E || s != null && s.slot || !(s != null && s.address) || Me("slots")) return;
    const z = Number(e.store.get(Pe("slot", E)));
    if (!(!Number.isSafeInteger(z) || z < 1))
      try {
        const { balance: Z } = await e.chain.account(s.address);
        if (Z >= nn + Nn(je())) return;
        await b.request("listening.openSlot", { slot: z }), s = await gn(b), i = void 0, c = -1 / 0;
      } catch {
      }
  }
  async function wo(b, E) {
    var V;
    jn();
    const z = !(s != null && s.address) || R(s.address), Z = s != null && s.linked ? (V = e.nameOf) == null ? void 0 : V.call(e, s.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: z ? is() : void 0, anyPasskey: E, ...ct() ? { main: ct() } : {}, ...Z ? { label: Z } : {} }), s = await gn(b), z && (R(s.address) ? await on() : await b.request("listening.stop")), await yo(b), be(z ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Ie = y;
    y = null, Ie && e.now() - Ie.at < 12e4 && setTimeout(() => void Rn(!0).then(() => vo(Ie)), 0);
  }
  function os() {
    te || u || le || Ce >= 3 || !o || !(s != null && s.address) || (te = !0, _t = (async () => {
      try {
        await wo(o, !1), Ce = 0;
      } catch (b) {
        const E = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(E) ? Ne || (le = !0, be("Not now. Nothing was signed.")) : /did not answer/.test(E) ? await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
        })) : (Ce++, L = E);
      } finally {
        te = !1;
        const b = Ne;
        Ne = null, b ? await b() : await Rn(!0);
      }
    })());
  }
  async function ks(b) {
    te && (Ne = async () => {
    }, await (o == null ? void 0 : o.request("listening.cancel").catch(() => {
    })), await _t), b && await b(), e.changed();
  }
  const is = () => ({
    fee: je().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: ws.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function on() {
    if (!(s != null && s.address)) return !1;
    if (F || (F = await e.tabLock(s.address)), !F)
      throw await (o == null ? void 0 : o.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function as(b, E) {
    const z = s.address, { balance: Z, nonce: Ie } = E ?? await e.chain.account(z);
    i = Z;
    const V = await o.request("listening.prepareReturn", {
      mode: b.mode,
      balance: Z.toString(),
      nonce: Ie.toString(),
      fee: ga.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (V.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ve = b.mode === "amount" ? b.amount : b.mode === "all" ? Z - ga : Z - ws - ga, me = Ni(V.raw);
    if (Cr(me.payload.recipient).value !== b.to || String(me.payload.amount) !== V.amount || ve !== void 0 && V.amount !== ve.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Le = {
      id: Du(),
      address: z,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: V.recipient,
      amount: V.amount,
      fee: V.fee,
      nonce: Ie.toString(),
      created: e.now(),
      status: "signed",
      raw: V.raw,
      txid: V.txid
    };
    e.validate(Le), Et(Le);
    try {
      await e.chain.broadcast(V.raw, V.txid), Et({ ...Le, status: "pending" });
    } catch (rt) {
      throw Et({ ...Le, status: "unknown", note: rt.message }), rt;
    }
    return V;
  }
  const ui = nu, mo = ga;
  async function di(b, E, z) {
    if ((s == null ? void 0 : s.state) !== "unlocked" || !s.address) throw new Error("Unlock the listening wallet first.");
    if (Me("slots") || Me("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = s.slot ?? 0;
    if (b === E || ![b, E].includes(Z) || ![b, E].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Ie = s.root ?? s.address, V = b === 0 ? Ie : s.address, ve = E === 0 ? Ie : s.address, { balance: me, nonce: Le } = await e.chain.account(V);
    if (me < z + mo + nn) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const rt = await o.request("listening.signMove", { from: b, to: E, amount: z.toString(), fee: mo.toString(), nonce: Le.toString(), balance: me.toString() }), S = Ni(rt.raw);
    if (rt.from !== V || rt.to !== ve || rt.amount !== z.toString() || Cr(S.payload.recipient).value !== ve || String(S.payload.amount) !== z.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const a = {
      id: Du(),
      address: V,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ve,
      amount: rt.amount,
      fee: rt.fee,
      nonce: Le.toString(),
      created: e.now(),
      status: "signed",
      raw: rt.raw,
      txid: rt.txid
    };
    e.validate(a), Et(a);
    try {
      await e.chain.broadcast(rt.raw, rt.txid), Et({ ...a, status: "pending" });
    } catch (f) {
      throw Et({ ...a, status: "unknown", note: f.message }), f;
    }
    return Te({ txid: rt.txid, amount: rt.amount, at: e.now() }, ve), ve === Ie && Ie !== s.address ? l = null : c = -1 / 0, rt;
  }
  let cs = !1;
  const $s = /* @__PURE__ */ new Map(), Is = (b) => Pe("float", b);
  async function aa() {
    if (cs || (s == null ? void 0 : s.state) !== "unlocked" || !Xe() || Me("move") || Me("rootLike") || !s.address) return;
    const b = s.address;
    if (e.store.get(Is(b)) === "1") return;
    const E = Ot();
    if (!(E != null && E.player) || E.state !== "arrived") return;
    const z = ze();
    if (z === void 0 || i === void 0) return;
    if (!dn(z)) {
      e.store.set(Is(b), "1");
      return;
    }
    if (ut(qe()) || So() || re().length || i < ui * 4n + nn + mo) return;
    const Z = $s.get(b);
    if (!(Z && (Z.n >= 3 || e.now() - Z.at < 5 * 6e4))) {
      cs = !0, $s.set(b, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: e.now() });
      try {
        await di(s.slot ?? 0, 0, ui), e.store.set(Is(b), "1");
      } catch (Ie) {
        console.warn("[radio] likes float not sent yet", Ie);
      } finally {
        cs = !1;
      }
    }
  }
  async function fi(b) {
    if (J().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const E = await Ht().catch(() => null);
    if (!E)
      throw ce = null, Ke = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ke = !1, i = E.balance;
    const z = { balance: E.balance, nonce: E.nonce };
    if (b === "excess") {
      const me = gg(E.parts) ?? Ur();
      if (!me) throw new Error("Choose where to send the excess first.");
      await as({ mode: "excess", to: me, linked: !1 }, z), ce = null, be("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = E.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ce && ce.balance === E.balance && e.now() - ce.at <= lt && ce.steps.length === Z.length && ce.steps.every((me, Le) => me.to === Z[Le].to && me.mode === Z[Le].mode && me.send === Z[Le].send))) {
      ce = {
        at: e.now(),
        balance: E.balance,
        steps: Z,
        parts: E.parts,
        plan: { state: "ready", steps: Z.map((me) => ({ to: me.to, kind: me.kind, send: me.send.toString() })), kept: E.tooSmall, excess: gg(E.parts) }
      }, be(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const V = Z[0], ve = V.to ?? Ur();
    if (!ve) throw new Error("Choose where to send the rest first.");
    if (V.mode === "amount" && Me("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await as({ mode: V.mode, to: ve, linked: !1, ...V.mode === "amount" ? { amount: V.send } : {} }, z), ce = null, Z.length === 1 ? (O(!1), be("Returned ✓ Paying is off.")) : be(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Fr() {
    if (!(s != null && s.unproven)) return;
    const b = await In();
    await b.request("listening.prove"), s = await gn(b);
  }
  const hr = {
    forceRefresh: () => Rn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !Yr(b))) {
        if (b === Sn()) return Rn(!0);
        e.store.set(Nt, b ?? ""), L = "", x = "", i = void 0, c = -1 / 0, l = null, await Rn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => qt("Check the listening wallet…", async () => {
      const b = await In();
      if (Me("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((s == null ? void 0 : s.state) !== "unlocked" || (s.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (J().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      We(), await b.request("listening.forget"), i = void 0, s = await gn(b), O(!1), be("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => qt("Waiting for your passkey…", async () => {
      const E = await In(), z = !!(b != null && b.another) && !e.main() && !Me("another");
      z && (s == null ? void 0 : s.state) === "unlocked" && await E.request("listening.lock"), await E.request("listening.unlock", { mode: "create", terms: is(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...z ? { another: !0 } : {} }), s = await gn(E), s.address && e.store.set(Pe("created", s.address), "1"), O(!0), be(kt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await on();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      bo = e.now() + Ls;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? bt() : Ue = null, e.changed();
    },
    giftSent: (b, E) => {
      !(s != null && s.address) || fe() || (Te({ txid: b, amount: E.toString(), at: e.now() }), c = -1 / 0, j = null, At && (At = { ...At, at: -1 / 0 }), be("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (jn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await In()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, E, z, Z) => {
      Te({ txid: z, amount: Z.toString(), at: e.now() }, E), j = null, await hr.openAlbum(b), be("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => qt("Opening…", async () => {
      if (jn(), (s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Me("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (p || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((s.slot ?? 0) === b) return;
      We(), await o.request("listening.openSlot", { slot: b }), s = await gn(o), i = void 0, c = -1 / 0, ce = null, Ke = !1;
      const E = s.root;
      E && b > 0 && e.store.set(Pe("slot", E), String(b)), be(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const E = () => qt("Waiting for your passkey…", async () => wo(await In(), b));
      return te ? b ? Me("cancel") ? (be("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : ks(async () => {
        (pt() === "locked" || pt() === "intro") && await E();
      }) : _t : E();
    },
    link: () => qt("Sign in your wallet…", async () => {
      jn();
      const b = e.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      const E = (await e.links(b)).find((z) => z.listening === s.address);
      if (E)
        await o.request("listening.link", { main: b, issued: E.issued, mainSignature: E.mainSignature });
      else {
        const z = { main: b, listening: s.address, issued: e.now() }, Z = await e.signWithMain(b, T5(z)), Ie = await o.request("listening.link", { main: b, issued: z.issued, mainSignature: Z });
        await e.saveLink({ ...z, mainSignature: Z, listeningSignature: Ie.listeningSignature }), ie = -1 / 0;
      }
      be("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => s != null && s.unproven ? (await qt("One more passkey check…", Fr), !(s != null && s.unproven)) : !0,
    deposit: () => qt("Approve the deposit in your wallet…", async () => {
      jn(), await Fr();
      const b = e.main();
      if (!b || !(s != null && s.address)) throw new Error("Connect your main wallet first.");
      if (fe()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Re()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Es(!0);
      const E = Ou(i ?? 0n);
      if (E <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      _ = await e.deposit(b, s.address, E), _ && Te({ txid: _, amount: E.toString(), at: e.now() }), be("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => qt("Approve the top-up in your wallet…", async () => {
      jn(), await Fr();
      const b = e.main(), E = qe();
      if (!b || !E) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (ut(E)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const z = await e.chain.balance(E);
      Xe() ? l = { for: E, value: z, at: e.now() } : (i = z, c = e.now());
      const Z = Ou(z);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Ie = await e.deposit(b, E, Z);
      Ie && Te({ txid: Ie, amount: Z.toString(), at: e.now() }, E), be("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => qt("Adding plays…", async () => {
      if (jn(), !Xe()) throw new Error("Open the album you want to add plays to first.");
      if (!Xc.includes(b)) throw new Error("Choose one of the amounts offered.");
      const E = D5(b, je());
      if (p || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (re().length || fe()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await di(0, s.slot ?? 0, E), be("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => qt("Confirm in the listening wallet…", async () => {
      if (!qn()) throw new Error("Connect your wallet first.");
      await on(), await o.request("listening.approveSession", is()), O(!0), be("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => qt("Clearing…", async () => {
      for (const b of fn())
        await e.chain.transaction(b.txid) || Et({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      be("Cleared ✓");
    }),
    switchOff: () => qt("Switching off…", async () => {
      We(), await (o == null ? void 0 : o.request("listening.stop")), O(!1), be("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => qt("Showing your backup words in the box…", async () => {
      if (!(s != null && s.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await In();
      await b.request("listening.backup"), s = await gn(b), be("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, E) => {
      if ((s == null ? void 0 : s.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Me("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await In()).request("listening.signShelf", { action: b, ...E ? { release: E } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      Rt = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => qt("Confirm in the listening wallet…", async () => {
      var Le, rt, S, a;
      const E = pn();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !E) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Me("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (G(E)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (p || d || w || re().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await on();
      const z = await e.awardNote(E, b), { balance: Z, nonce: Ie } = await e.chain.account(E);
      if (Z < Nc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ve = await (await In()).request("listening.signAward", {
        cls: z.cls,
        number: z.number,
        plays: z.plays,
        record: z.record,
        signature: z.signature,
        fee: Nc.toString(),
        nonce: Ie.toString(),
        balance: Z.toString()
      }), me = Ni(ve.raw);
      if (ve.hero !== E || ve.number !== z.number || ((rt = (Le = me.payload) == null ? void 0 : Le.functionName) == null ? void 0 : rt.content) !== "claim" || ((a = (S = me.payload) == null ? void 0 : S.contractName) == null ? void 0 : a.content) !== b5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ve.raw, ve.txid), e.store.set(rs(E), JSON.stringify({ txid: ve.txid, at: e.now() })), c = -1 / 0, At && (At = { ...At, at: -1 / 0 }), be("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => qt("Confirm in the listening wallet…", async () => {
      var rt, S, a;
      const E = pn(), z = W();
      if ((s == null ? void 0 : s.state) !== "unlocked" || !E) throw new Error("Unlock your player first.");
      if ((z == null ? void 0 : z.state) !== "claimed" || z.inscription === void 0) throw new Error("There is no record to send yet.");
      if (z.holds === !1) throw new Error("This record has already been sent.");
      if (z.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (U(E)) throw new Error("Your record is already on its way.");
      const Z = b.trim();
      if (!Yr(Z)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (Z === E) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Me("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (p || d || w || re().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await on();
      const { balance: Ie, nonce: V } = await e.chain.account(E);
      if (Ie < Nc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const me = await (await In()).request("listening.signSendRecord", { inscription: z.inscription, recipient: Z, fee: Nc.toString(), nonce: V.toString(), balance: Ie.toString() }), Le = Ni(me.raw);
      if (me.from !== E || me.recipient !== Z || me.inscription !== z.inscription || ((S = (rt = Le.payload) == null ? void 0 : rt.functionName) == null ? void 0 : S.content) !== "transfer" || Cr((a = Le.payload.functionArgs) == null ? void 0 : a[2]).value !== Z)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(me.raw, me.txid), e.store.set(k(E), JSON.stringify({ txid: me.txid, at: e.now() })), c = -1 / 0, At && (At = { ...At, at: -1 / 0 }), be("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => qt("Locking…", async () => {
      We(), await (o == null ? void 0 : o.request("listening.lock")), i = void 0, be("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const E = String(b ?? "").trim();
      if (!(s != null && s.address)) return be("", "Unlock the listening wallet first.");
      if (!Yr(E)) return be("", "Enter a standard mainnet address (it starts with SP).");
      if (E === s.address) return be("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(Sr(s.address), E), be("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      s != null && s.address && e.store.set(Sr(s.address), ""), e.changed();
    },
    returnFunds: (b) => qt("Check the return in the listening wallet…", async () => {
      if (!qn()) throw new Error("Connect your wallet first.");
      if (!(s != null && s.address)) throw new Error("Unlock the listening wallet first.");
      if (zt()) return fi(b);
      const E = wt();
      if (!E) throw new Error(kt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (E.kind !== "linked" && Me("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (J().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await as({ mode: b, to: E.to, linked: E.kind === "linked" }), b === "all" && O(!1), be(b === "all" ? E.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Gt = [], vr = 10, Ls = 30 * 6e4;
  let ls = !1, bo = 0;
  const xo = (b) => e.now() < bo && (b === "intro" || b === "locked" || b === "link" || b === "fund" && Ae()), So = () => p || !!u || d || w, We = () => {
    Gt.length && (Gt.length = 0, e.changed());
  };
  async function hi(b) {
    if (!Gt.some((E) => E.id === b.id) && !Yt().some((E) => E.id === b.id) && (Gt.push({ ...b, at: e.now() }), Gt.length > vr && Gt.shift()), So() || J().length) {
      const E = Gt.length;
      x = `Queued ${E === 1 ? "this song" : E + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Zn();
  }
  async function Zn() {
    if (!ls) {
      ls = !0;
      try {
        for (; Gt.length; ) {
          for (; Gt.length && e.now() - Gt[0].at > Ls; ) Gt.shift();
          if (!Gt.length || So() || await ca(Gt[0]) === "wait") return;
          Gt.shift();
        }
      } finally {
        ls = !1, e.changed();
      }
    }
  }
  async function ca(b) {
    var E;
    p = !0;
    try {
      await Rn();
      const z = pt();
      if (z === "loading" || xo(z)) return "wait";
      if (z !== "ready" || !R() || !(s != null && s.session) || s.session.playsLeft < 1 || !F) return "done";
      if (J().length) return "wait";
      C || (await e.chain.verify(), C = !0);
      const Z = s.address, { balance: Ie, nonce: V } = await e.chain.account(Z);
      i = Ie, c = e.now();
      const ve = await e.chain.owner(Hu, b.song);
      if (ve === Z || ve === ct()) return "done";
      const me = await o.request("listening.signPlay", {
        core: Hu,
        song: b.song,
        receipt: b.id,
        fee: je().toString(),
        nonce: V.toString(),
        balance: Ie.toString()
      }), Le = {
        id: b.id,
        address: Z,
        kind: "play",
        core: Hu,
        song: b.song,
        recipient: ve,
        amount: "50",
        fee: je().toString(),
        nonce: V.toString(),
        created: e.now(),
        status: "signed",
        raw: me.raw,
        txid: me.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(Le), Et(Le);
      const rt = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(me.raw, me.txid), Et({ ...Le, status: "pending" }), x = `♪ Paid ${rt}`, L = "";
      } catch (S) {
        Et({ ...Le, status: Si(S) ? "failed" : "unknown", note: S.message, ...Si(S) ? { raw: void 0 } : {} }), L = S.message;
      }
      return s = await gn(o), "done";
    } catch (z) {
      const Z = z instanceof Error ? z.message : "payment unavailable";
      return (E = Ot()) != null && E.player ? (x = "Payment is taking a moment: " + Z, "wait") : (x = "This song played free: " + Z, "done");
    } finally {
      p = !1, e.changed();
    }
  }
  function pi(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(pt()) || Me("like") ? !1 : (vo(b), !0);
  }
  async function vo(b) {
    const E = b.title ? `“${b.title}”` : `song #${b.song}`, z = (g) => {
      var h;
      L = g, x = "";
      try {
        (h = e.likeFailed) == null || h.call(e, b.song);
      } catch {
      }
      e.changed();
    }, Z = Xe(), Ie = pt(), V = ct(), ve = Z && (Ie === "fund" || Ie === "over") ? "ready" : Ie, me = kt() ? qe() : V;
    if (ve === "locked") {
      y = { ...b, at: e.now() }, be(`Unlock to like ${E}. It sends straight after.`);
      return;
    }
    if (ve === "wrong-wallet") return z(po());
    if (ve === "link") return z("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (kt() && Me("standalone")) return z("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ve === "fund") return z("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ve === "over") return z("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await go(!0);
      const g = ze();
      if (dn(g))
        return e.changed(), z(Al);
    }
    if (ve !== "ready" || !me) return z("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(s != null && s.session)) return z("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!F) return z("Pay-per-play is running in another tab. Like from that tab.");
    const Le = Yt(qe()).find((g) => g.kind === "like" && g.song === b.song);
    if (Le && ya.includes(Le.status))
      return z(`Your last like for ${E} is still on its way. It can change again once it confirms.`);
    if (d) return z("One like at a time: your last one is still being sent.");
    if ((Le == null ? void 0 : Le.status) === "confirmed" && e.now() - (Le.confirmedAt ?? 0) < j5)
      return z(`Your like for ${E} has only just confirmed. Try again in a moment.`);
    let rt;
    w = !0;
    try {
      rt = e.likeState ? (await e.likeState(me, b.song)).by : b.likedBy ?? [];
    } catch {
      rt = b.likedBy;
    } finally {
      w = !1;
    }
    if (!rt) return z(`Could not check ${E} right now. Try the heart again.`);
    const S = qe(), f = ((Le == null ? void 0 : Le.status) === "confirmed" && typeof Le.liked == "boolean" && e.now() - (Le.confirmedAt ?? Le.created) < 5 * 6e4 ? Le.liked : void 0) ?? rt.includes(S);
    if (!f && rt.some((g) => g !== S)) return z(kt() ? `${E} was liked from another wallet of yours. Unlike it there.` : `${E} was liked from your main wallet${rt.includes(V) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Ao({ song: b.song, liked: !f, title: b.title, artist: b.artist });
  }
  async function Ao(b) {
    var Z, Ie, V;
    if (d) {
      be("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const E = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, z = e.wait ?? ((ve) => new Promise((me) => setTimeout(me, ve)));
    try {
      be(`${b.liked ? "Liking" : "Unliking"} ${E}…`);
      const ve = e.now() + 12e4;
      for (; p || (Xe() ? Yt(qe()).some((f) => ya.includes(f.status)) : J().length); ) {
        if (e.now() > ve) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await z(5e3), await Rn(!0);
      }
      if (!Xe() && pt() !== "ready" || (s == null ? void 0 : s.state) !== "unlocked" || !s.session) throw new Error("Paying stopped before the like was sent.");
      const me = qe(), { balance: Le, nonce: rt } = await e.chain.account(me);
      if (Xe() ? l = { for: me, value: Le, at: e.now() } : (i = Le, c = e.now()), dn(Le)) throw new Error(Al);
      const S = await o.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Ut().toString(),
        nonce: rt.toString(),
        balance: Le.toString()
      }), a = {
        id: Du(),
        address: me,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Ut().toString(),
        nonce: rt.toString(),
        created: e.now(),
        status: "signed",
        raw: S.raw,
        txid: S.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(a), Et(a);
      try {
        await e.chain.broadcast(S.raw, S.txid), Et({ ...a, status: "pending" }), x = `${b.liked ? "♥ Liked" : "Unliked"} ${E}`, L = "";
        try {
          (Z = e.likeSent) == null || Z.call(e, b.song, b.liked);
        } catch {
        }
      } catch (f) {
        if (Et({ ...a, status: Si(f) ? "failed" : "unknown", note: f.message, ...Si(f) ? { raw: void 0 } : {} }), L = f.message, Si(f)) try {
          (Ie = e.likeFailed) == null || Ie.call(e, b.song);
        } catch {
        }
      }
      s = await gn(o);
    } catch (ve) {
      L = "Like not sent: " + (ve instanceof Error ? ve.message : "the listening wallet is unavailable");
      try {
        (V = e.likeFailed) == null || V.call(e, b.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), Zn();
    }
  }
  return { snapshot: Yn, refresh: Rn, onListened: hi, heart: pi, toggleLike: vo, ...hr };
}
const Ab = ["Connect", "Passkey", "Link & fund", "Listen"], Eb = ["Passkey", "Add 1 STX", "Listen"], tf = (e) => e ? Eb : Ab;
function z5(e) {
  if (e.solo) return G5(e);
  const t = Ab.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
function G5(e) {
  const t = Eb.length, n = (r, o, s = !1) => ({ at: r, blocked: s, caption: r >= t ? o : `Step ${r + 1} of ${t} · ${o}` });
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
function K5(e, t) {
  return !t || t.at >= tf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const V5 = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function X5(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !V5(r.id)));
}
const Y5 = {}, q5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, W5 = (e) => {
  const t = Y5;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, Z5 = (e) => `/hiro/${e}`, J5 = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, Q5 = (e) => {
  const t = W5(e);
  if (t)
    return [J5(t)];
  const n = q5[e];
  return typeof window < "u" ? [`${window.location.origin}${Z5(e)}`, ...n.filter((o) => !o.includes("hiro.so"))] : n;
}, eI = {}, yg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, tI = "xtrata.log.enabled", nI = "xtrata.log.level", rI = "xtrata.log.tags", sI = "xtrata.log.dedupe", Mc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, oI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, iI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, aI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, cI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, lI = () => {
  const e = eI ?? {}, t = Mc(tI) ?? e.VITE_LOG_ENABLED, n = Mc(nI) ?? e.VITE_LOG_LEVEL, r = Mc(rI) ?? e.VITE_LOG_TAGS, o = Mc(sI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: oI(t),
    level: iI(n) ?? "warn",
    tags: cI(r),
    dedupe: aI(o)
  };
}, uI = (e, t, n) => !e.enabled || yg[n] < yg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), dI = (e, t, n, r) => {
  const o = lI();
  if (!uI(o, t, e) || hI(o.dedupe))
    return;
  const s = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(s, r) : i(s);
}, fI = /* @__PURE__ */ new Set();
let wg = null;
const hI = (e, t, n, r, o) => (wg !== e && (fI.clear(), wg = e), !1), pI = (e, t, n) => dI("debug", e, t, n), gI = {}, yI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, wI = (e) => {
  const t = gI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : yI[e];
}, mI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, bI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return mI.test(n) ? n : null;
}, xI = (e) => e.replace(/\/+$/, ""), SI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), mg = (e) => {
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
}, vi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, vI = (e) => {
  var l, u;
  let t;
  try {
    t = Cr(m6(e));
  } catch {
    return null;
  }
  const n = vi(t);
  if (!n || n.success === !1)
    return null;
  const r = vi(n.value), o = vi(r == null ? void 0 : r.value), s = vi(o == null ? void 0 : o.value);
  if (!s)
    return null;
  const i = mg((l = vi(s.name)) == null ? void 0 : l.value), c = mg((u = vi(s.namespace)) == null ? void 0 : u.value);
  return !i || !c ? null : bI(`${i}.${c}`);
}, AI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${xI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, o = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [rb(Fm(e.address))]
    }),
    signal: e.signal
  });
  if (!o.ok)
    throw new Error(`BNS primary lookup failed (${o.status})`);
  const s = await o.json();
  return !(s != null && s.okay) || typeof s.result != "string" ? null : vI(s.result);
}, EI = async (e) => {
  const t = e.address.trim();
  if (!_i(t))
    return null;
  const n = wI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const o of Q5(e.network))
    try {
      return await AI({
        baseUrl: o,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (s) {
      r = s;
    }
  return pI("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: SI(r)
  }), null;
};
function kI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, o = n.now ?? Date.now, s = /* @__PURE__ */ new Map(), i = (c, l) => {
    l.pending = !0, l.failedAt = void 0, Promise.resolve().then(() => e(c)).then((u) => {
      l.pending = !1, u && (l.name = u, t());
    }).catch(() => {
      l.pending = !1, l.failedAt = o();
    });
  };
  return {
    get(c) {
      if (!c) return null;
      let l = s.get(c);
      return l ? !l.pending && l.name === null && l.failedAt !== void 0 && o() - l.failedAt >= r && i(c, l) : (l = { name: null, pending: !1 }, s.set(c, l), i(c, l)), l.name;
    }
  };
}
const bg = Object.freeze({
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
}), xg = Object.freeze({ 139: "melophonic" });
function Sg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(bg, n) ? bg[n] : Object.hasOwn(xg, n) ? xg[n] : t;
}
const vg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function Ag(e, t = "") {
  return Object.hasOwn(vg, String(e)) ? vg[String(e)] : t;
}
const kb = 10000n, mh = 1000000n, El = 3000n, $I = (e, t) => `${e}#gift=${t}`, II = 100, wa = (e, t = _r) => e <= nn ? 0 : Number((e - nn) / Nn(t)), Eg = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), bh = "xtrata.xyz/radio/gifts", Aa = II, LI = "Create a prefunded Xtrata radio gift batch", CI = (e) => ({
  domain: dr({ name: mt(bh), version: mt("1"), "chain-id": xn(1) }),
  message: dr({
    purpose: mt(LI),
    creator: mt(e.creator),
    count: xn(e.count),
    amount: xn(BigInt(e.amount)),
    label: mt(e.label),
    issued: xn(e.issued),
    ...e.player ? { player: mt(e.player) } : {}
  })
}), $b = (e, t, n = _r) => nn + BigInt(e) * Nn(n) + (t ? nu : 0n), TI = (e, t = _r) => Number((mh - nn - (e ? nu : 0n)) / Nn(t)), Ib = (e, t) => BigInt(e) * (t + El);
function BI(e, t, n, r = _r) {
  const o = n ? nu : 0n, s = t > nn + o ? t - nn - o : 0n, i = Number(s / Nn(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * xl,
    fees: BigInt(i) * r,
    reserve: nn,
    float: o,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: El,
    perCopy: t + El,
    total: Ib(e, t)
  };
}
const NI = (e) => e >= kb && e <= mh, MI = 90, kg = [30, 90], PI = "Extend my prefunded Xtrata radio gift batches; no spending permission", _I = (e) => ({
  domain: dr({ name: mt(bh), version: mt("1"), "chain-id": xn(1) }),
  message: dr({ purpose: mt(PI), creator: mt(e.creator), batch: mt(e.batch), days: xn(e.days), issued: xn(e.issued) })
}), $g = 40, UI = "Create an Xtrata radio gift player", nf = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), OI = /^[^\u0000-\u001f\u007f<>]+$/u;
function Ig(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && OI.test(e) : !n;
}
function Lb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Ig(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Ig(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > $g) throw new Error(`A player holds 1 to ${$g} songs.`);
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
const Cb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Sf(Ef(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, HI = (e) => ({
  domain: dr({ name: mt(bh), version: mt("1"), "chain-id": xn(1) }),
  message: dr({
    purpose: mt(UI),
    admin: mt(e.admin),
    player: mt(e.hash),
    issued: xn(e.issued)
  })
}), Nr = (e) => e.tracks.filter((t) => !t.hidden), DI = (e) => e.tracks.find((t) => t.hidden) ?? null, Fu = [300, 500, 1e3], Ba = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Pc = (e) => typeof e == "string" && Ba.some((t) => t.id === e), Mo = (e) => Ba.find((t) => t.id === e), FI = (e) => Ba.find((t) => e >= t.min) ?? Ba[Ba.length - 1];
function jI(e, t = _r) {
  return FI(e <= nn ? 0 : Number((e - nn) / Nn(t)));
}
const Tb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], RI = "1000 Players";
function xh(e = Aa) {
  const t = [];
  for (const n of Tb) {
    const r = $b(n.plays, !1);
    for (let o = n.count; o > 0; o -= e) {
      const s = Math.min(o, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: s, label: `${RI} ${String(i).padStart(2, "0")}`, amount: r, deposit: Ib(s, r) });
    }
  }
  return t;
}
const Sh = (e = xh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: Tb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), zI = 23 * 36e5, Lg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function GI(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < zI ? "unpaid" : "todo";
}
function KI(e, t, n) {
  var c;
  const r = t.filter((l) => l.label === e.label && l.player === null && l.count === e.count && l.amount === e.amount.toString() && l.codes.length === e.count).map((l) => ({ b: l, state: GI(l, n) })).filter((l) => l.state !== "todo").sort((l, u) => Lg(u.state) - Lg(l.state) || u.b.at - l.b.at), o = r[0];
  if (!o) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const s = (c = o.b.view) == null ? void 0 : c.copies, i = o.state === "live" ? `live · all ${e.count} waiting to be claimed` : o.state === "touched" ? `live, but only ${(s == null ? void 0 : s.waiting) ?? 0} of ${e.count} still waiting (${(s == null ? void 0 : s.claimed) ?? 0} claimed)` : o.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: o.state, batch: o.b, extras: r.length - 1, detail: o.b.error ? `${i} (${o.b.error})` : i };
}
function Cg(e, t, n = xh()) {
  var u;
  const r = n.map((p) => KI(p, e, t)), o = [];
  for (const p of r)
    p.extras && o.push(`Batch ${p.step.n} was made more than once. The extra ${p.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${p.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), p.state === "touched" && o.push(`Batch ${p.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const s = r.every((p) => p.state === "live"), i = s ? r.flatMap((p) => p.batch.codes) : [], c = Sh(n).players;
  s && new Set(i).size !== c && o.push(`The links do not add up: ${new Set(i).size} different links for ${c} players.`);
  const l = s && new Set(i).size === c;
  return { steps: r, next: ((u = r.find((p) => p.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((p) => p.state === "live").length, ready: l, codes: l ? i : [], problems: o };
}
function VI(e, t = xh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = Sh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const o = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), s = r.tiers.map((u) => {
    var d;
    const p = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (p == null ? void 0 : p.total) ?? 0 };
  }), i = s.map((u) => `${u.got} ${Mo(u.id).name}`).join(", "), c = (n.tiers ?? []).filter((u) => !r.tiers.some((p) => p.plays === u.plays)), l = n.total === r.players && o === 0 && !!n.tiers && s.every((u) => u.got === u.count) && c.length === 0;
  return l ? { ok: l, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: l, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${c.length ? `, and ${c.reduce((u, p) => u + p.total, 0)} of another size` : ""})` : ""}${o ? `, ${o} no longer available` : ""}.` };
}
const Tg = 1800, ju = /* @__PURE__ */ new Map();
async function XI(e) {
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
function YI(e, t, n, r, o) {
  const s = document.createElement("button");
  return s.type = "button", s.className = r, s.dataset.feedback = e, (() => {
    const c = ju.get(e), l = !!c && c.until > Date.now();
    s.textContent = l ? c.label : t, s.classList.toggle("is-done", l && c.ok), s.classList.toggle("is-failed", l && !c.ok);
  })(), s.onclick = async () => {
    const c = await n();
    if (c) {
      ju.set(e, { ...c, until: Date.now() + Tg });
      for (const l of document.querySelectorAll("button[data-feedback]"))
        l.dataset.feedback === e && (l.textContent = c.label, l.classList.remove("is-done", "is-failed", "is-pop"), l.offsetWidth, l.classList.add(c.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ju.delete(e), o();
      }, Tg + 50);
    }
  }, s;
}
const ir = (e, t, n, r, o) => YI(e, t, async () => await XI(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, o), Eo = "xtrata.radio.gift.incoming.v1", Bg = (e) => "xtrata.radio.gift.mine.v1:" + e, Ng = (e) => "xtrata.radio.gift.batches.v1:" + e, pe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, en = (e, t, n = "") => {
  const r = pe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ma = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, Gn = (e) => Ir(e).replace(/\.?0+$/, "");
function qI(e) {
  let t = null;
  const n = (k) => [5e3, 1e4, 2e4, 3e4][k] ?? 6e4, r = (() => {
    try {
      const k = new URL(location.href), U = new URLSearchParams(k.hash.slice(1)).get("gift") ?? k.searchParams.get("gift");
      return U !== null && (k.searchParams.delete("gift"), history.replaceState(null, "", k.pathname + (k.search || ""))), Eg(U) ? U : null;
    } catch {
      return null;
    }
  })(), o = (() => {
    try {
      const k = JSON.parse(e.store.get(Eo) || "null");
      return Eg(k == null ? void 0 : k.code) ? k.code : null;
    } catch {
      return null;
    }
  })(), s = r ?? o;
  if (s) {
    t = { code: s }, e.store.set(Eo, JSON.stringify({ code: s, at: e.now() }));
    let k = 0;
    const U = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: s }), signal: AbortSignal.timeout(15e3) }).then(async (G) => {
      const D = await G.json().catch(() => ({}));
      if (G.status === 404) {
        e.store.set(Eo, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!G.ok) throw new Error("busy");
      const W = D;
      t = { ...t, view: W, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(W.status) && e.store.set(Eo, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void U(), n(k++)));
    });
    U();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, c = () => {
    const k = t == null ? void 0 : t.view;
    return !(k != null && k.player) || !i() ? null : { player: k.player, from: d(k), plays: wa(BigInt(k.amount)) };
  }, l = () => {
    const k = t == null ? void 0 : t.view;
    return !k || k.player || !i() ? null : { plays: wa(BigInt(k.amount)), from: k.from ? e.who(k.from) : null };
  }, u = () => {
    const k = t == null ? void 0 : t.code;
    if (!k) return [];
    const U = `${location.origin}${location.pathname}#gift=${k}`;
    return [ir("gift-pass-on", "Copy the link to pass on", () => U, "primary", e.changed)];
  }, p = () => {
    t = null, e.store.set(Eo, null), e.changed();
  }, d = (k) => k.from ? e.who(k.from) : k.label ? `Xtrata Radio · ${k.label}` : "Xtrata Radio";
  let w = {};
  const y = (k) => {
    if (w.box) return w.box;
    const U = pe("div", "", "ppp-gift-check");
    w.box = U;
    const G = () => {
      const D = window.turnstile;
      !D || w.rendered || (w.rendered = !0, D.render(U, { sitekey: k, callback: (W) => {
        w.token = W, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) G();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = G, document.head.append(D);
    }
    return U;
  }, v = (k) => {
    queueMicrotask(() => void k());
  };
  let x;
  async function L(k) {
    var D, W, Q, $e, Se, He, dt, $, he;
    if (!t || t.claiming || !k.listening) return;
    const U = !!((D = t.view) != null && D.player);
    if (U && !k.root) return;
    t.claiming = !0, t.error = void 0, (W = e.claiming) == null || W.call(e, !0), e.changed();
    const G = async (Fe) => {
      const lt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...Fe })
      });
      return { res: lt, r: await lt.json().catch(() => ({})) };
    };
    try {
      let Fe = 0, lt = k.listening, zt;
      if (U) {
        const pt = Number((Q = await e.json("/radio/gift/slots?root=" + encodeURIComponent(k.root))) == null ? void 0 : Q.next);
        if (!Number.isSafeInteger(pt) || pt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Fe = pt;
        for (let Yn = 0; ; Yn++) {
          const Hr = await e.album.bind(Fe);
          if (lt = Hr.address, zt = await G({ wallet: lt, binding: Hr }), zt.res.status === 409 && /just taken/.test((($e = zt.r) == null ? void 0 : $e.error) || "") && Yn < 5) {
            Fe += 1;
            continue;
          }
          break;
        }
      } else zt = await G({ wallet: lt });
      const { res: Ht, r: cn } = zt;
      if (Ht.status === 503 && /sending another gift/.test((cn == null ? void 0 : cn.error) || "")) {
        t.waiting = !0, (Se = e.claiming) == null || Se.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!Ht.ok) {
        const pt = String((cn == null ? void 0 : cn.error) || "");
        if (Ht.status === 404 || Ht.status === 410 || Ht.status === 409 && /already had a gift|brand-new|already have this album/.test(pt))
          throw e.store.set(Eo, null), new Error(pt || "This gift cannot be opened.");
        if (Ht.status === 429 || Ht.status === 403 || Ht.status === 400 && !/wallet number/i.test(pt)) throw new Error(pt || `Could not open the gift (${Ht.status}).`);
        const Hr = /topping up/.test(pt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(pt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(pt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Hr), { retry: !0, slow: /topping up|not paid for yet/.test(pt) });
      }
      t.done = !0, e.store.set(Eo, null), U ? await e.album.arrived(Fe, lt, cn.txid, BigInt(cn.amount)) : e.giftSent(cn.txid, BigInt(cn.amount));
    } catch (Fe) {
      const lt = Fe, zt = lt.name === "TypeError" || lt.name === "AbortError" || lt.name === "TimeoutError" || /wallet number/i.test(lt.message);
      if (lt.retry || zt) {
        const Ht = t.tries ?? 0;
        t.tries = Ht + 1, t.retry = { text: lt.retry ? lt.message : "Still sending your gift… the network is slow, trying again." }, (He = e.claiming) == null || He.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, lt.slow ? 6e4 : n(Ht));
      } else
        t.error = lt.message, (dt = e.claiming) == null || dt.call(e, !1);
      w.token = void 0;
      try {
        (he = ($ = window.turnstile) == null ? void 0 : $.reset) == null || he.call($, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let B = null;
  function _(k) {
    if (!k.listening || !k.depositPending || k.step !== "fund")
      return B = null, [];
    if (!B || B.wallet !== k.listening || e.now() - B.at > 3e4) {
      const G = k.listening;
      B = { ...(B == null ? void 0 : B.wallet) === G ? B : {}, wallet: G, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(G)).then((D) => {
        var W, Q;
        (B == null ? void 0 : B.wallet) === G && (B.state = (W = D == null ? void 0 : D.gift) == null ? void 0 : W.state, B.problem = ((Q = D == null ? void 0 : D.gift) == null ? void 0 : Q.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(B.state === "sending" && B.problem)) return [];
    const U = pe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return U.title = `Network reply: ${B.problem}`, [U];
  }
  function A(k, U, G = !1) {
    var He, dt;
    const D = U.player, W = BigInt(U.amount), Q = G ? [] : [pe("p", `🎁 ${d(U)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Nr(D).length} ${Nr(D).length === 1 ? "song" : "songs"} and ${wa(W).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!k.root && ["fund", "ready", "over", "link"].includes(k.step))) {
      if (G) return Q;
      if (Q.push(pe("p", k.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : k.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), k.step === "intro") {
        const $ = document.createElement("details");
        $.className = "ppp-how";
        const he = document.createElement("summary");
        he.textContent = "How does this work?", $.append(he, pe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), Q.push($);
      }
      return Q;
    }
    if (k.walletCannotAlbums)
      return Q.push(pe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), Q;
    const Se = (dt = (He = k.gate) == null ? void 0 : He.gifts) == null ? void 0 : dt.turnstileSiteKey;
    return Se && !w.token ? Q.push(pe("p", "One quick check and it is yours:", "ppp-mute"), y(Se)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(k)), Q.push(...T(k, "Sending your album…")), Q;
  }
  function T(k, U) {
    const G = [];
    return t.claiming || t.waiting ? G.push(pe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : U, "ppp-cyan")) : t.retry && G.push(pe("p", t.retry.text, "ppp-warn"), en("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(k);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? G.push(pe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), en("Forget this gift link here", p, "quiet")) : t.error && G.push(pe("p", t.error, "ppp-bad"), en("Try again", () => {
      t.error = void 0, L(k);
    })), G;
  }
  const P = (k) => {
    var U;
    return !!t && !t.done && !t.error && i() && !!k.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !k.linked && !k.creditedTo && (k.createdHere || k.brandNew || !!((U = t.view) != null && U.player)) && (k.balance ?? 0n) === 0n && !k.entries.length);
  };
  function K(k, U = {}) {
    var lt, zt, Ht, cn;
    const G = _(k);
    if (!t || ["off", "elsewhere"].includes(k.step)) return G;
    const D = t.view;
    if (t.error && !D) return [pe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [pe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return G;
    if (D.status === "claimed" || D.status === "claiming") return [pe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [pe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [pe("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(k, D, !!U.bare), ...G];
    const W = !!k.listening && (!(k.createdHere || k.brandNew) || !!k.linked || !!k.creditedTo || (k.balance ?? 0n) > 0n || k.entries.length > 0), Q = W ? ((lt = e.claimNew) == null ? void 0 : lt.call(e, k)) ?? null : null, $e = Q ? ((zt = e.replaceOld) == null ? void 0 : zt.call(e, k)) ?? null : null;
    if (Q && $e)
      return [
        pe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        en("Replace my old player", $e, "primary"),
        en("Keep both players", Q, "quiet"),
        en("Not now", p, "quiet")
      ];
    if (Q)
      return [
        pe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        en("Claim it as a new player", Q, "primary"),
        en("Not now", p, "quiet")
      ];
    if (W)
      return [pe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), en("Forget this gift link here", p, "quiet")];
    const Se = BigInt(D.amount), He = wa(Se).toLocaleString(), dt = pe(
      "p",
      `🎁 ${d(D)} sent you ${Gn(Se)} STX of on-chain music: about ${He} paid plays.`,
      "ppp-gift"
    ), $ = U.bare ? [] : [dt], he = !!k.listening && (k.createdHere || k.brandNew) && !k.linked && !k.creditedTo && k.step === "fund" && (k.balance ?? 1n) === 0n && !k.depositPending && !k.entries.length, Fe = (cn = (Ht = k.gate) == null ? void 0 : Ht.gifts) == null ? void 0 : cn.turnstileSiteKey;
    return he ? (Fe && !w.token ? $.push(pe("p", "One quick check and it is yours:", "ppp-mute"), y(Fe)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(k)), $.push(...T(k, "Sending your gift…"))) : k.step === "intro" ? U.bare || $.push(pe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : k.listening && k.linked ? $.push(pe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), en("Forget this gift link here", p, "quiet")) : k.listening && (k.balance ?? 0n) > 0n && $.push(pe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), en("Forget this gift link here", p, "quiet")), $;
  }
  async function ie(k, U, G) {
    var D;
    try {
      const W = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(k));
      if ((D = W == null ? void 0 : W.gift) != null && D.returnTo) return { ok: !0, funder: W.gift.returnTo, txId: W.gift.txid ?? void 0, amount: W.gift.amount, distinct: 1 };
    } catch {
      if (G) return { ok: !1 };
    }
    return U();
  }
  const ee = pe("div", "", "ppp-gift-fold");
  let X = 250000n, m = "", I = "";
  const N = (k) => {
    try {
      const U = JSON.parse(e.store.get(Bg(k)) || "[]");
      return Array.isArray(U) ? U : [];
    } catch {
      return [];
    }
  }, M = (k, U) => e.store.set(Bg(k), JSON.stringify(U.slice(0, 50)));
  async function Y(k) {
    const U = N(k);
    for (const G of U)
      if (!(G.view && ["claimed", "refunded", "expired"].includes(G.view.status)))
        try {
          G.view = !G.view || G.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: G.id, ...G.txid ? { txid: G.txid } : {} }) }) : await e.json("/radio/gift?id=" + G.id), G.error = void 0;
        } catch (D) {
          G.error = D.message;
        }
    M(k, U), e.changed();
  }
  async function j(k) {
    if (m) return;
    m = "Starting your gift…", I = "", e.changed();
    let U = null;
    try {
      U = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: k, amount: X.toString() }) });
      const G = N(k);
      G.unshift({ id: U.id, code: U.code, amount: X.toString(), at: e.now() }), M(k, G), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(k, U.depositTo, BigInt(U.deposit), U.memo), W = N(k), Q = W.find(($e) => $e.id === U.id);
      Q && (Q.txid = D, Q.view = { status: "pending-deposit", amount: X.toString(), source: "friend", from: k, label: "", expires: 0 }), M(k, W), I = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", Y(k);
    } catch (G) {
      I = G.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const ae = (k) => "xtrata.radio.gift.players.v1:" + k, ce = (k) => {
    try {
      const U = JSON.parse(e.store.get(ae(k)) || "[]");
      return Array.isArray(U) ? U.filter((G) => G && /^[0-9a-f]{16}$/.test(G.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ke(k, U) {
    var G;
    if (!m) {
      m = "Checking the player…", I = "", e.changed();
      try {
        const D = U.tracks.split(/[\s,]+/).filter(Boolean).map(($) => Number($.replace(/^#/, ""))), W = (U.explicit ?? "").split(/[\s,]+/).map(($) => $.replace(/^#/, "")).filter(Boolean).map(Number), Q = Lb({ title: U.title.trim(), subtitle: U.subtitle.trim(), tracks: D, cover: (G = U.cover) != null && G.trim() ? Number(U.cover.trim().replace(/^#/, "")) : null, ...W.length ? { explicit: W } : {} });
        m = "Sign in your wallet…", e.changed();
        const $e = { admin: k, hash: Cb(Q), issued: e.now() }, Se = await e.sign(k, HI($e));
        m = "Making the player…", e.changed();
        const He = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: Q, request: $e, signature: Se }) }), dt = ce(k).filter(($) => $.id !== He.id);
        dt.unshift({ id: He.id, title: He.title, tracks: He.tracks }), e.store.set(ae(k), JSON.stringify(dt.slice(0, 30))), I = `${He.existing ? "That player already exists" : "Player made"} ✓ “${He.title}” · ${He.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        I = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const C = (k, U) => $I(k || location.origin + "/radio.html", U), F = (k) => {
    try {
      const U = JSON.parse(e.store.get(Ng(k)) || "[]");
      return Array.isArray(U) ? U.filter((G) => G && /^[0-9a-f]{16}$/.test(G.id) && Array.isArray(G.codes)) : [];
    } catch {
      return [];
    }
  }, te = (k, U) => e.store.set(Ng(k), JSON.stringify([...U.filter((G) => G.codes.length), ...U.filter((G) => !G.codes.length)].slice(0, 80))), le = (k) => !!k.view && k.view.status === "live" && k.view.copies.waiting + k.view.copies.claiming + k.view.copies.refunding === 0, Ce = (k, U) => e.json(k, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(U) });
  let Ne = 0;
  async function _t(k) {
    const U = F(k);
    for (const D of U)
      if (!le(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Ce("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (W) {
          D.error = W.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(k));
      for (const W of (D == null ? void 0 : D.batches) ?? []) {
        const Q = U.find(($e) => $e.id === W.id);
        if (Q) {
          Q.error || (Q.view = W);
          continue;
        }
        U.push({ id: W.id, codes: [], count: W.count, amount: W.amount, label: W.label, player: W.player, depositTo: "", deposit: W.deposit, memo: W.memo, at: 0, view: W });
      }
    } catch {
    }
    const G = /* @__PURE__ */ new Map();
    for (const D of F(k)) (!G.has(D.id) || D.codes.length > G.get(D.id).codes.length) && G.set(D.id, D);
    for (const D of U) {
      const W = G.get(D.id);
      W ? G.set(D.id, { ...W, view: D.view ?? W.view, error: D.error, txid: W.txid ?? D.txid, codes: W.codes.length >= D.codes.length ? W.codes : D.codes, depositTo: W.depositTo || D.depositTo }) : G.set(D.id, D);
    }
    te(k, [...G.values()]), e.changed();
  }
  async function je(k, U) {
    const G = F(k).find((D) => D.id === U);
    if (!(!G || !G.depositTo || m)) {
      m = "Approve the payment in your wallet…", I = "", e.changed();
      try {
        const D = await e.pay(k, G.depositTo, BigInt(G.deposit), G.memo), W = F(k), Q = W.find(($e) => $e.id === U);
        Q && (Q.txid = D), te(k, W), I = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", _t(k);
      } catch (D) {
        I = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Me(k, U, G, D) {
    if (m) return;
    if (!U.ok) {
      I = U.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", I = "", e.changed();
    let W = null;
    try {
      const Q = { creator: k, count: U.count, amount: U.amount.toString(), label: G, issued: e.now(), ...D ? { player: D } : {} }, $e = await e.sign(k, CI(Q));
      m = "Making your links…", e.changed(), W = await Ce("/radio/gift/batch", { request: Q, signature: $e });
      const Se = F(k);
      Se.unshift({ id: W.id, codes: W.codes, count: U.count, amount: W.amount, label: G, player: D ?? null, depositTo: W.depositTo, deposit: W.deposit, memo: W.memo, at: e.now() }), te(k, Se);
    } catch (Q) {
      I = Q.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await je(k, W.id);
  }
  async function Pe(k, U, G) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", I = "", e.changed();
      try {
        const D = { creator: k, batch: U, days: G, issued: e.now() }, W = await e.sign(k, _I(D));
        m = "Extending…", e.changed();
        const Q = await Ce("/radio/gift/batch/extend", { request: D, signature: W }), $e = F(k);
        for (const Se of (Q == null ? void 0 : Q.batches) ?? []) {
          const He = $e.find((dt) => dt.id === Se.id);
          He && (He.view = Se, He.error = void 0);
        }
        te(k, $e), I = Q != null && Q.extended ? `Extended ✓ ${Q.extended === 1 ? "That batch has" : `${Q.extended} batches have`} ${G} more days.` : "There was nothing live to extend.";
      } catch (D) {
        I = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const Nt = (k) => Math.max(0, Math.ceil((k - e.now()) / 864e5));
  function Sn(k, U) {
    const G = U.filter((Q) => {
      var $e;
      return (($e = Q.view) == null ? void 0 : $e.status) === "live" && Q.view.copies.waiting > 0;
    });
    if (!G.length) return null;
    const D = Math.min(...G.map((Q) => Q.view.expires)), W = pe("p", "", "ppp-batch-extend");
    W.append(pe("span", `${G.length} live ${G.length === 1 ? "batch" : "batches"} · the first runs out in ${Nt(D)} days. Extend ${G.length === 1 ? "it" : "them all"}: `));
    for (const Q of kg) {
      const $e = en(`+${Q} days`, () => void Pe(k, "all", Q), "tiny");
      $e.disabled = !!m, W.append($e);
    }
    return W;
  }
  const ct = () => Yt(!!Xe.value, ze.value, Ut.value);
  function Yt(k, U, G) {
    const D = U === "max" ? TI(k) : Number(U), W = $b(D, k), Q = Number(G);
    return !Number.isInteger(Q) || Q < 1 || Q > Aa ? { ok: !1, reason: `Make 1 to ${Aa} copies at a time.`, album: k, plays: D, amount: W, count: Q } : NI(W) ? { ok: !0, reason: "", album: k, plays: D, amount: W, count: Q, bill: BI(Q, W, k) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: k, plays: D, amount: W, count: Q };
  }
  const Et = () => {
    var k;
    return ((k = e.batchDays) == null ? void 0 : k.call(e)) ?? MI;
  }, R = (k = ct()) => {
    if (!k.ok) return k.reason;
    const U = k.bill;
    return `Each copy: ${k.plays.toLocaleString()} paid plays (${Gn(U.holders)} to song holders, ${Gn(U.fees)} network fees)${k.album ? `, ${Gn(U.float)} for the album’s likes` : ""}, ${Gn(U.reserve)} kept so a listener can return what is left, + ${Gn(U.sendFee)} to send it = ${Gn(U.perCopy)} STX. ${k.count} copies = ${Gn(U.total)} STX, paid now in one payment. Copies nobody claims within ${Et()} days come back to you, and you can extend that at any time.`;
  }, O = (k, U) => U.codes.map((G) => C(k, G)), J = pe("input");
  J.type = "range", J.min = String(kb), J.max = String(mh), J.step = "10000", J.value = String(X), J.setAttribute("aria-label", "Gift amount");
  const re = pe("p", "", "ppp-gift-amount"), fe = en("", () => {
    const k = e.main();
    k && j(k);
  }, "primary"), ut = () => {
    re.textContent = Te(), fe.textContent = `Gift ${Gn(X)} STX`;
  };
  J.oninput = () => {
    X = BigInt(J.value), ut();
  };
  const Te = () => `${Gn(X)} STX · about ${wa(X).toLocaleString()} paid plays · you pay ${Gn(X + El)} STX with the network fee`;
  ut();
  const Ue = pe("input");
  Ue.maxLength = 60, Ue.placeholder = "Title, e.g. Proof of Sound", Ue.setAttribute("aria-label", "Player title");
  const bt = pe("input");
  bt.maxLength = 80, bt.placeholder = "Artist (optional)", bt.setAttribute("aria-label", "Player subtitle");
  const Re = pe("textarea");
  Re.rows = 3, Re.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Re.setAttribute("aria-label", "Songs");
  const Ae = pe("input");
  Ae.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ae.setAttribute("aria-label", "Explicit songs");
  const qe = pe("input");
  qe.inputMode = "numeric", qe.placeholder = "Cover inscription number (optional), shown when the album loads", qe.setAttribute("aria-label", "Cover inscription");
  const Xe = pe("select");
  Xe.setAttribute("aria-label", "Batch album");
  const ze = pe("select");
  ze.setAttribute("aria-label", "Plays per copy");
  for (const k of [.../* @__PURE__ */ new Set([50, 100, 250, ...Fu])].sort((U, G) => U - G)) ze.append(ma(`${k.toLocaleString()} plays`, String(k)));
  ze.append(ma("Max (1 STX)", "max")), ze.value = String(Fu[0]);
  const Ut = pe("input");
  Ut.type = "number", Ut.min = "1", Ut.max = String(Aa), Ut.value = "10", Ut.setAttribute("aria-label", "Copies");
  const dn = pe("input");
  dn.maxLength = 40, dn.placeholder = "Label, e.g. Opera launch", dn.setAttribute("aria-label", "Batch label");
  const fn = pe("p", "", "ppp-mute"), Fn = () => {
    fn.textContent = R();
  };
  for (const k of [Xe, ze, Ut])
    k.oninput = Fn, k.onchange = Fn;
  Fn();
  let kt = null, an = 0;
  async function Sr() {
    an = e.now();
    try {
      kt = VI(await e.json("/radio/giveaway/players"));
    } catch {
      kt = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Ur = (k, U) => {
    var D;
    if (((D = Cg(F(k), e.now()).next) == null ? void 0 : D.n) !== U.n) {
      I = "That batch is already made. Check again.", e.changed();
      return;
    }
    Me(k, Yt(!1, String(U.plays), String(U.count)), U.label);
  };
  function fr(k) {
    var $e;
    const U = Cg(F(k), e.now()), G = Sh(), D = pe("div", "", "ppp-drop");
    D.append(
      pe("p", `The ${G.players.toLocaleString("en-GB")} players (admin) · ${U.done} of ${G.batches} batches live`, "ppp-cyan"),
      pe("p", `${G.tiers.map((Se) => `${Se.count} ${Mo(Se.id).name}`).join(", ")}. ${G.batches} batches, ${Gn(G.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const W = pe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Se of U.steps) {
      const He = pe("li"), dt = Se.state === "live" ? "✓" : Se.state === "touched" ? "!" : Se.state === "todo" ? "○" : "…";
      if (He.append(pe("span", `${dt} ${Se.step.n}. ${Mo(Se.step.tier).name} · ${Se.step.count} × ${Se.step.plays.toLocaleString("en-GB")} plays · ${Gn(Se.step.deposit)} STX`, "t"), pe("span", Se.detail, Se.state === "live" ? "ppp-ok" : Se.state === "touched" ? "ppp-warn" : "ppp-mute")), Se.state === "todo" && (($e = U.next) == null ? void 0 : $e.n) === Se.step.n) {
        const $ = en("Sign and pay", () => Ur(k, Se.step), "tiny");
        $.disabled = !!m, He.append($);
      }
      if (Se.state === "unpaid" && Se.batch) {
        const $ = en("Pay now", () => void je(k, Se.batch.id), "tiny");
        $.disabled = !!m, He.append($);
      }
      W.append(He);
    }
    D.append(W);
    for (const Se of U.problems) D.append(pe("p", Se, "ppp-warn"));
    U.ready ? D.append(
      pe("p", `All ${G.batches} batches are live: ${U.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      ir("drop-copy", `Copy the ${U.codes.length.toLocaleString("en-GB")} links`, () => U.codes.join(`
`), "tiny", e.changed)
    ) : D.append(pe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - an > 6e4 && Sr(), kt && D.append(pe("p", kt.text, kt.ok ? "ppp-ok" : "ppp-mute"));
    const Q = en("Check again", () => {
      Ne = e.now(), _t(k), Sr();
    }, "tiny");
    return Q.disabled = !!m, D.append(Q), D;
  }
  function wt(k, U, G) {
    const D = U.view, W = D == null ? void 0 : D.copies, Q = U.error ? U.error : !D || D.status === "pending-deposit" ? U.txid ? "payment confirming…" : "waiting for your payment" : `${W.claimed} of ${D.count} claimed${W.refunding + W.refunded ? ` · ${W.refunded} refunded${W.refunding ? `, ${W.refunding} on their way` : ""}` : ""}`, $e = pe("li");
    if ($e.append(pe("span", `${U.label || "Batch"} · ${U.count} × ${Gn(BigInt(U.amount))} STX`, "t"), pe("span", Q, "ppp-mute")), !U.txid && U.depositTo && (!D || D.status === "pending-deposit") && $e.append(en("Pay now", () => void je(k, U.id), "tiny")), (D == null ? void 0 : D.status) === "live" && W.waiting > 0) {
      $e.append(pe("span", `${Nt(D.expires)} days left`, "ppp-mute"));
      for (const Se of kg) {
        const He = en(`+${Se}`, () => void Pe(k, U.id, Se), "tiny");
        He.title = `Extend this batch by ${Se} days (a signature, no payment)`, He.setAttribute("aria-label", `Extend ${U.label || "this batch"} by ${Se} days`), He.disabled = !!m, $e.append(He);
      }
    }
    if (U.codes.length && (D == null ? void 0 : D.status) === "live") {
      const Se = O(G, U);
      $e.append(
        ir("batch-copy:" + U.id, "Copy all links", () => Se.join(`
`), "tiny", e.changed),
        ir("batch-csv:" + U.id, "Copy as CSV", () => ["copy,link", ...Se.map((He, dt) => `${dt + 1},${He}`)].join(`
`), "tiny", e.changed)
      );
    } else U.codes.length || $e.append(pe("span", "links were made on another device", "ppp-mute"));
    return $e;
  }
  const hn = pe("select");
  hn.setAttribute("aria-label", "Plays in each copy");
  for (const k of [.../* @__PURE__ */ new Set([50, 100, 250, ...Fu])].sort((U, G) => U - G)) hn.append(ma(`${k.toLocaleString()} plays`, String(k)));
  hn.value = "50";
  const Ot = pe("input");
  Ot.type = "number", Ot.min = "1", Ot.max = String(Aa), Ot.value = "10", Ot.setAttribute("aria-label", "How many copies");
  const pn = pe("input");
  pn.maxLength = 40, pn.placeholder = "A note recipients see, e.g. Launch week (optional)", pn.setAttribute("aria-label", "Note for recipients");
  const At = pe("p", "", "ppp-mute");
  function Rt(k, U, G) {
    const D = () => Yt(!0, hn.value, Ot.value), W = () => {
      At.textContent = R(D());
    };
    for (const he of [hn, Ot])
      he.oninput = W, he.onchange = W;
    W();
    const Q = () => (pn.value.trim() || U.title).replace(/[^ -~]/g, "").slice(0, 40), $e = en("Sign, pay and make links", () => {
      Me(k, D(), Q(), U.id);
    }, "primary");
    $e.disabled = !!m;
    const Se = (he, Fe) => {
      const lt = pe("label", he);
      return lt.append(Fe), lt;
    }, He = [
      pe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Se("Plays in each ", hn),
      Se("Copies ", Ot),
      pn,
      At,
      $e
    ];
    e.now() - Ne > 3e4 && (Ne = e.now(), _t(k));
    const dt = F(k).filter((he) => he.player === U.id);
    if (dt.length) {
      const he = pe("ul", "", "ppp-gift-list");
      for (const Fe of dt.slice(0, 10)) he.append(wt(k, Fe, G));
      He.push(he);
    }
    const $ = Sn(k, F(k));
    return $ && He.push($), m && He.push(pe("p", m, "ppp-cyan")), I && He.push(pe("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), He;
  }
  function Or(k) {
    var W, Q;
    const U = (W = k.gate) == null ? void 0 : W.gifts;
    if (!(U != null && U.enabled) || !U.admin || ["off", "elsewhere", "unsupported"].includes(k.step)) return null;
    const G = e.main(), D = [pe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!G)
      D.push(pe("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (U.admin) {
      const $e = pe("div", "", "ppp-gift-admin"), Se = (Fe, lt) => {
        const zt = pe("label", Fe);
        return zt.append(lt), zt;
      }, He = ce(G);
      $e.append(
        pe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Ue,
        bt,
        Re,
        qe,
        Ae,
        en("Sign and make player", () => void Ke(G, { title: Ue.value, subtitle: bt.value, tracks: Re.value, cover: qe.value, explicit: Ae.value }))
      );
      const dt = en("Sign, pay and make links", () => {
        Me(G, ct(), dn.value.trim(), Xe.value || void 0);
      });
      dt.disabled = !!m;
      const $ = Xe.value;
      Xe.replaceChildren(ma("No album (starter copies)", ""), ...He.map((Fe) => ma(`${Fe.title} · ${Fe.tracks} songs`, Fe.id))), He.some((Fe) => Fe.id === $) && (Xe.value = $), Fn(), $e.append(
        pe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${Et()} days unless you extend`, "ppp-cyan"),
        Se("Album ", Xe),
        Se("Plays each ", ze),
        Se("Copies ", Ut),
        dn,
        fn,
        dt
      ), e.now() - Ne > 3e4 && (Ne = e.now(), _t(G));
      const he = F(G);
      if (he.length) {
        const Fe = pe("ul", "", "ppp-gift-list");
        for (const zt of he.slice(0, 20)) Fe.append(wt(G, zt, ((Q = k.gate) == null ? void 0 : Q.radioUrl) ?? null));
        $e.append(Fe);
        const lt = Sn(G, he);
        lt && $e.append(lt);
      }
      $e.append(fr(G)), D.push($e);
    }
    return m && D.push(pe("p", m, "ppp-cyan")), I && D.push(pe("p", I, /✓/.test(I) ? "ppp-ok" : "ppp-warn")), ee.replaceChildren(...D), ee;
  }
  return { banner: K, funder: ie, renderFold: Or, copies: Rt, liveGift: i, incomingAlbum: c, incomingStarter: l, setAside: p, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: P };
}
const WI = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function ZI(e) {
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
const JI = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((o) => !o.hidden).flatMap((o) => [o.title, o.artist])].filter(Boolean).join(" ").toLowerCase();
};
function QI(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((s) => (!t.pinnedOnly || t.pins.has(s.slot)) && (() => {
    const i = JI(s);
    return n.every((c) => i.includes(c));
  })()), o = {
    recent: (s, i) => (t.recents[i.slot] ?? 0) - (t.recents[s.slot] ?? 0) || i.slot - s.slot,
    newest: (s, i) => i.slot - s.slot,
    oldest: (s, i) => s.slot - i.slot,
    title: (s, i) => {
      var c, l;
      return (((c = s.player) == null ? void 0 : c.title) ?? "").localeCompare(((l = i.player) == null ? void 0 : l.title) ?? "") || s.slot - i.slot;
    }
  };
  return r.sort((s, i) => Number(t.pins.has(i.slot)) - Number(t.pins.has(s.slot)) || o[t.sort](s, i));
}
function eL(e, t = 100) {
  const n = Object.entries(e).sort((r, o) => o[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, o]) => [Number(r), o]));
}
const rf = /* @__PURE__ */ new Set(), vh = (e) => (rf.add(e), () => {
  rf.delete(e);
}), kl = () => {
  for (const e of [...rf])
    try {
      e();
    } catch {
    }
}, Mg = "xtrata:al-thumb:v1:", Ah = "-", ba = 96, tL = 24 * 1024 * 1024, bn = /* @__PURE__ */ new Map(), Pg = /* @__PURE__ */ new Set(), sf = [];
let Ru = !1, zu;
const za = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Mg + e);
    window.localStorage.setItem(Mg + e, t);
  } catch {
  }
  return null;
};
function Eh(e) {
  return new Promise((t) => {
    var n;
    try {
      const r = document.createElement("canvas"), o = (n = r.getContext) == null ? void 0 : n.call(r, "2d");
      if (!o) return t(e);
      const s = new Image(), i = setTimeout(() => t(e), 8e3);
      s.onload = () => {
        clearTimeout(i);
        try {
          const c = Math.min(s.naturalWidth, s.naturalHeight);
          if (!c) return t(e);
          r.width = r.height = ba, o.fillStyle = "#143a40", o.fillRect(0, 0, ba, ba), o.drawImage(s, (s.naturalWidth - c) / 2, (s.naturalHeight - c) / 2, c, c, 0, 0, ba, ba), t(r.toDataURL("image/jpeg", 0.82));
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
async function nL(e) {
  var l, u, p, d, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((l = t.body) == null ? void 0 : l.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((p = t.body) == null ? void 0 : p.cancel()), "";
  let r = "", o = 0;
  const s = (y) => {
    let v = 0;
    for (; ; ) {
      const x = r.slice(v).search(/<img\b/i);
      if (x < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + x, B = r.indexOf(">", L);
      if (B < 0)
        return r = r.slice(L), null;
      const _ = r.slice(L, B + 1), A = _.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = _.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = B + 1;
    }
  }, i = (w = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : w.call(d);
  if (!i)
    return r = await t.text(), s(!0) ?? "";
  const c = new TextDecoder();
  for (; ; ) {
    const { done: y, value: v } = await i.read();
    if (y) break;
    o += v.byteLength, r += c.decode(v, { stream: !0 });
    const x = s(!1);
    if (x)
      return await i.cancel(), x;
    if (o > tL)
      return await i.cancel(), null;
  }
  return r += c.decode(), s(!0) ?? "";
}
async function rL() {
  if (!Ru) {
    Ru = !0;
    try {
      for (; sf.length; ) {
        const e = sf.shift();
        if (!bn.has(e))
          try {
            const t = await nL(e);
            if (t === null) continue;
            if (!t) {
              bn.set(e, ""), za(e, Ah), kl();
              continue;
            }
            const n = await Eh(t);
            bn.set(e, n), n.startsWith("data:image/jpeg") && za(e, n), kl();
          } catch {
          }
      }
    } finally {
      Ru = !1;
    }
  }
}
function kh(e, t) {
  if (t && !bn.get(e) ? (bn.set(e, t), Eh(t).then((r) => {
    r !== t && (bn.set(e, r), r.startsWith("data:image/jpeg") && za(e, r), kl());
  })) : t === "" && !bn.has(e) && bn.set(e, ""), bn.has(e)) return bn.get(e);
  const n = za(e);
  if (n != null) {
    const r = n === Ah ? "" : n;
    return bn.set(e, r), r;
  }
  return Pg.has(e) || (Pg.add(e), sf.push(e), zu || (zu = setTimeout(() => {
    zu = void 0, rL();
  }, 1200))), "";
}
function _g(e) {
  if (bn.has(e)) return bn.get(e);
  const t = za(e);
  if (t == null) return null;
  const n = t === Ah ? "" : t;
  return bn.set(e, n), n;
}
const Gu = /* @__PURE__ */ new Map(), Ku = /* @__PURE__ */ new Set();
function Yc(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : Gu.has(e) ? Gu.get(e) : (Ku.has(e) || (Ku.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, o, s, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((o = t.body) == null ? void 0 : o.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((s = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : s[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    Gu.set(e, t), kl();
  }).catch(() => {
    Ku.delete(e);
  })), "");
}
const Ai = 12, sL = 5e3, Tn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ei = (e, t, n = "") => {
  const r = Tn("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function oL(e) {
  let t, n = [], r = 0, o = !1, s = !1, i = -1 / 0, c = "", l = "recent", u = !1, p = Ai;
  const d = Tn("div", "", "ppp-shelf-box");
  vh(() => e.changed());
  const w = (N) => "xtrata.radio.shelf.pins.v1:" + N, y = (N) => "xtrata.radio.shelf.recent.v1:" + N, v = (N, M) => {
    try {
      return JSON.parse(e.store.get(N) || "null") ?? M;
    } catch {
      return M;
    }
  }, x = (N) => new Set(v(w(N), []).filter((M) => Number.isSafeInteger(M))), L = (N) => {
    const M = v(y(N), {}), Y = {};
    for (const [j, ae] of Object.entries(M)) Number.isSafeInteger(Number(j)) && typeof ae == "number" && (Y[Number(j)] = ae);
    return Y;
  };
  async function B(N) {
    if (!o) {
      o = !0, s = !1;
      try {
        const M = [];
        let Y = 0, j = 0;
        for (let ae = 0; ae < sL / 100 + 1; ae++) {
          const ce = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(N)}&after=${Y}&limit=100`);
          if (M.push(...ZI(ce == null ? void 0 : ce.shelf)), j = Number(ce == null ? void 0 : ce.total) || M.length, !(ce != null && ce.next) || !Number.isSafeInteger(ce.next)) break;
          Y = ce.next;
        }
        N === t && (n = M, r = j, i = e.now());
      } catch {
        s = !0;
      } finally {
        o = !1, e.changed();
      }
    }
  }
  const _ = () => {
    i = -1 / 0;
  }, A = Tn("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    c = A.value, p = Ai, e.changed();
  };
  const T = Tn("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const N of WI) {
    const M = document.createElement("option");
    M.value = N.value, M.textContent = N.label, T.append(M);
  }
  T.onchange = () => {
    l = T.value, p = Ai, e.changed();
  };
  const P = Ei("", () => {
    u = !u, p = Ai, e.changed();
  }, "tiny"), K = Tn("div", "", "ppp-shelf-tools");
  K.append(A, T, P);
  const ie = Tn("div"), ee = Tn("div");
  function X(N) {
    const M = N.step === "off" || N.step === "elsewhere" ? void 0 : N.root;
    if (M !== t && (t = M, n = [], r = 0, i = -1 / 0, p = Ai), !M || N.walletCannotAlbums) return null;
    if (!o && e.now() - i > 5 * 6e4 && B(M), !n.length)
      return s ? (ee.replaceChildren(Tn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ei("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(ee), d) : null;
    const Y = x(M), j = L(M), ae = QI(n, { query: c, sort: l, pinnedOnly: u, pins: Y, recents: j });
    A.value !== c && (A.value = c), T.value = l, P.textContent = u ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(u));
    const ce = [];
    if (N.slot > 0 && ce.push(Ei("← My player", () => e.open(0), "quiet")), !ae.length) ce.push(Tn("p", "No album matches that.", "ppp-mute"));
    else {
      const Ke = Tn("ul", "", "ppp-shelf-list");
      for (const C of ae.slice(0, p)) {
        const F = Tn("li", "", C.slot === N.slot ? "now" : ""), te = Y.has(C.slot), le = Ei(te ? "★" : "☆", () => {
          const ct = new Set(Y);
          te ? ct.delete(C.slot) : ct.add(C.slot), e.store.set(w(M), JSON.stringify([...ct])), e.changed();
        }, "tiny");
        le.setAttribute("aria-label", te ? `Unpin ${C.player.title}` : `Pin ${C.player.title}`);
        const Ce = [C.player.subtitle, `${Nr(C.player).length} ${Nr(C.player).length === 1 ? "song" : "songs"}`, C.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Ne = C.slot === N.slot, _t = Ei(Ne ? "Playing" : "Select", () => {
          e.store.set(y(M), JSON.stringify(eL({ ...j, [C.slot]: e.now() }))), e.open(C.slot);
        }, Ne ? "tiny ppp-pick" : "tiny primary ppp-pick");
        _t.disabled = Ne;
        const je = Nr(C.player)[0], Me = C.player.cover ?? (je == null ? void 0 : je.id), Pe = Me ? kh(String(Me)) : "", Nt = Tn("span", "", "ppp-shelf-art");
        if (Pe) {
          const ct = document.createElement("img");
          ct.src = Pe, ct.alt = "", ct.decoding = "async", Nt.append(ct);
        } else Nt.textContent = "💿";
        const Sn = Tn("span", "", "ppp-shelf-txt");
        Sn.append(Tn("span", C.player.title, "t"), Tn("span", Ce, "ppp-mute")), F.append(le, Nt, Sn, _t), Ke.append(F);
      }
      ce.push(Ke), ae.length > p && ce.push(Ei(`Show more (${ae.length - p} left)`, () => {
        p += Ai, e.changed();
      }, "quiet"));
    }
    return s && ce.push(Tn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ie.replaceChildren(...ce), d.firstChild !== K && d.replaceChildren(K, ie), d;
  }
  return { render: X, invalidate: _, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const N = L(t), M = [...n].filter((Y) => Y.player).sort((Y, j) => (N[j.slot] ?? 0) - (N[Y.slot] ?? 0) || j.slot - Y.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const Ug = "http://www.w3.org/2000/svg", iL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function $l(e = "", t = !1) {
  const n = document.createElementNS(Ug, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, o] of iL) {
    const s = document.createElementNS(Ug, "path");
    s.setAttribute("fill-rule", "evenodd"), s.setAttribute("fill", t ? "currentColor" : r), s.setAttribute("d", o), n.append(s);
  }
  return n;
}
const nt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, ln = (e, t, n, r = !1) => {
  const o = nt("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Bb = (e) => e.toLocaleString(), Og = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, aL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Il(e, t) {
  const n = nt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, o) => {
    const s = nt("li", o < t ? "is-done" : o === t ? "is-now" : "");
    s.append(nt("i", "", o < t ? "✓" : String(o + 1)), nt("span", "", r)), n.append(s);
  }), n;
}
function cL() {
  const e = nt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(nt("span", "tier-disc__mark", "?")), e;
}
const wn = {
  gift: { title: "Your disc is ready", primary: "Claim my free player", play: "Play", hint: "Free. Face ID or fingerprint.", returning: "I already have a player", full: "Look around first" },
  installedNew: { title: "Open your player", body: "Use your face or fingerprint to open the player you already have.", primary: "Open my player", hint: "Face ID or fingerprint.", fresh: "I’m new: make my player" },
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
}, lL = (e) => e ? `Disc ${e} is yours` : wn.gift.title, uL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Bb(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", dL = (e) => e ? `${Bb(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function Hg(e, t = !1) {
  const n = nt("div", "al-now" + (t ? " al-now--big" : "")), r = nt("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const o = nt("div", "al-now__t");
  o.append(nt("b", "", e.title || "Playing now"), nt("span", "", e.artist));
  const s = nt("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return s.setAttribute("aria-hidden", "true"), s.append(nt("s"), nt("s"), nt("s")), n.append(r, o, s), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const fL = (e) => e ? `You got a ${e.name} player` : wn.landed.title;
function hL(e, t = !0) {
  const n = nt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(nt("span", "tier-disc__mark", e.mark)), n;
}
function pL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, o = !1) {
      var p, d;
      if (!r) {
        n && !o && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const s = nt("header", "al-top"), i = nt("a", "al-brand");
      i.href = "/radio", i.append($l("al-logo"), nt("span", "", "Xtrata "), nt("b", "", "Music")), s.append(i);
      const c = nt("div", "al-body al-body--welcome"), l = nt("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        l.append(nt("p", "al-welcome-wait", wn.checking));
      else {
        const w = aL(u);
        w >= 0 && l.append(Il(u === "new" ? Og.fresh : Og.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? l.append(hL(r.tier)) : u === "gift" || u === "arriving" ? l.append(cL()) : u === "new" && l.append($l("al-hero-mark"));
        const y = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (l.append(nt("h1", "", u === "landed" ? fL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? lL(r.spot) : v ? wn.installedNew.title : wn[u].title)), y && u === "arriving" ? l.append(Hg(y, !0)) : l.append(nt("p", "", u === "gift" ? uL(r.plays, r.from, r.mystery) : u === "landed" ? dL(r.plays) : v ? wn.installedNew.body : wn[u].body)), y && u !== "arriving" && l.append(Hg(y)), r.status.length) {
          const x = nt("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), l.append(x);
        }
        if (r.asking) l.append(nt("p", "al-hint al-hint--ask", wn.asking));
        else if (u === "back" && r.claimNew) {
          const x = wn.backClaim;
          l.append(nt("p", "al-hint", x.body)), r.canStart && r.replaceOld ? l.append(ln("al-primary", x.replace, r.replaceOld, r.busy), nt("p", "al-hint", x.replaceHint), ln("al-link", x.both, r.claimNew, r.busy), ln("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && l.append(ln("al-primary", x.primary, r.claimNew, r.busy), nt("p", "al-hint", x.hint), ln("al-link", x.unlock, r.unlock, r.busy)), l.append(ln("al-link", wn.back.full, r.full));
        } else if (u === "gift") {
          const x = wn.gift;
          if (r.canStart) {
            const L = ln("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            l.append(L, nt("p", "al-hint", x.hint));
          }
          r.canStart ? l.append(ln("al-link", x.returning, r.returning, r.busy)) : l.append(ln("al-link", x.full, r.full));
        } else if (u === "new" && r.installed) {
          const x = wn.installedNew;
          r.canStart && l.append(ln("al-primary", x.primary, r.returning, r.busy), nt("p", "al-hint", x.hint), ln("al-link", x.fresh, r.start, r.busy)), l.append(ln("al-link", wn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const x = wn[u];
          r.canStart && l.append(ln("al-primary", x.primary, u === "back" ? r.unlock : r.start, r.busy), nt("p", "al-hint", x.hint)), r.canStart && l.append(ln("al-link", x.returning, r.returning, r.busy)), l.append(ln("al-link", x.full, r.full));
        } else if (u === "landed") {
          if (l.append(ln("al-primary", (p = r.now) != null && p.playing ? wn.landed.playing : wn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            l.append(nt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const L = ln("al-album", "", x.run);
              if (x.cover) {
                const _ = nt("img", "al-album__art");
                _.src = x.cover, _.alt = "", L.classList.add("al-album--art"), L.append(_);
              }
              const B = nt("span", "al-album__t");
              B.append(nt("b", "", x.title), nt("span", "", x.by)), L.append(B), l.append(L);
            }
          }
        } else u === "empty" && l.append(ln("al-primary", wn.empty.primary, r.restock), ln("al-link", wn.empty.full, r.full));
      }
      c.append(l), e.hidden = !1, e.replaceChildren(s, c);
    }
  };
}
const gL = 20, yL = ["Album", "Passkey", "Listen"], An = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Wt = {
  grid: An('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: An('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: An('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: An('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: An('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: An('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: An('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: An('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: An('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: An('<path d="M6 9l6 6 6-6"/>', 18),
  right: An('<path d="M9 6l6 6-6 6"/>', 16),
  close: An('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: An('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: An('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: An('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: An('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: An('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function se(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [o, s] of Object.entries(t))
    s == null || s === !1 || (o === "class" ? r.className = String(s) : o === "html" ? r.innerHTML = String(s) : o.startsWith("on") && typeof s == "function" ? r[o.toLowerCase()] = s : o === "disabled" ? r.disabled = !!s : r.setAttribute(o, s === !0 ? "" : String(s)));
  for (const o of n) o != null && o !== !1 && r.append(o);
  return r;
}
const Cn = (e, ...t) => se("button", { type: "button", ...e }, ...t), _c = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, xa = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, wL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, mL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Dg(e, t, n = {}) {
  const r = !!n.list;
  let o = null, s = "", i = !1;
  const c = document.documentElement;
  function l(m) {
    var N, M, Y;
    if (!m || !Number.isSafeInteger(m)) return "";
    const I = (Y = (M = (N = t.radio()) == null ? void 0 : N.getState) == null ? void 0 : M.call(N)) == null ? void 0 : Y.albumCover;
    return I != null && I.url && Number(I.tokenId) === m ? I.url : Yc(m);
  }
  vh(() => X());
  function u(m) {
    var N;
    s = m, m ? c.dataset.sheet = m : delete c.dataset.sheet;
    const I = document.querySelector(".side");
    if (m && m !== "more") {
      for (const j of mL[m]) {
        const ae = I == null ? void 0 : I.querySelector(j);
        ae && (ae.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = wL[m]);
      const Y = document.getElementById("sheetExtra");
      Y && Y.replaceChildren(...m === "music" ? [d()] : []), (N = I == null ? void 0 : I.scrollTo) == null || N.call(I, { top: 0 });
    }
    X();
  }
  const p = r ? null : document.getElementById("sheetClose");
  p && (p.onclick = () => u("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && s && c.dataset.view === "album" && u("");
  });
  const d = () => Cn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    se("span", { class: "al-row-i", html: Wt.radio }),
    se("span", { class: "al-row-t" }, se("b", {}, "Xtrata Radio"), se("small", {}, "Every song on-chain · FM, liked, all")),
    se("span", { class: "al-row-go", html: Wt.right })
  );
  let w = null, y = !1;
  const v = () => {
    var I;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((N) => {
      w = N, (o == null ? void 0 : o.mode) === "open" && X();
    }), w = ((I = m.getState) == null ? void 0 : I.call(m)) ?? null);
  };
  r || setInterval(() => {
    var M, Y;
    if ((o == null ? void 0 : o.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (Y = (M = t.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : Y.call(M), I = e.querySelector(".al-bar > i"), N = e.querySelectorAll(".al-times span");
    !m || !I || (I.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", N.length === 2 && (N[0].textContent = _c(m.current || 0), N[1].textContent = m.duration ? _c(m.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function B(m, I, N = {}) {
    const M = N.song || l(m.cover), j = [M ? se("img", { src: M, alt: N.song ? "Song artwork" : `${m.title} cover` }) : se("div", { class: "al-cover-fallback" }, se("b", {}, m.title), m.subtitle ? se("span", {}, m.subtitle) : null), N.paused ? se("span", { class: "al-paused" }, se("i", { html: Wt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ae = "al-cover" + (I ? "" : " al-cover--small") + (N.paused ? " is-paused" : "");
    return N.flip ? (j.push(se("span", { class: "al-flip", "aria-hidden": "true", html: Wt.flip })), Cn({ class: ae + " is-flippable", "aria-label": N.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: N.flip }, ...j)) : se("div", { class: ae }, ...j);
  }
  function _(m) {
    return m.plays === null || m.plays === void 0 ? se("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? se("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : se("span", { class: "al-chip" + (m.plays <= gL ? " al-chip--low" : "") }, `${xa(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const I = m.player, N = I.tracks.filter((Y) => !Y.hidden), M = [];
    return m.step !== void 0 && M.push(Il(yL, m.step)), m.mode === "arrive" && m.from && M.push(se("p", { class: "al-from" }, se("span", { html: Wt.gift }), se("span", {}, se("b", {}, m.from), " sent you an album"))), M.push(B(I, !0)), M.push(se(
      "div",
      { class: "al-intro" },
      se("h1", {}, I.title),
      I.subtitle ? se("p", { class: "al-artist" }, I.subtitle) : null,
      N.length ? se("p", { class: "al-songline" }, N.map((Y) => Y.title || `#${Y.id}`).join(" · ")) : null,
      se("span", { class: "al-chip" }, [xa(N.length, "song", "songs"), m.offered ? xa(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && M.push(se("div", { class: "al-status", role: "status" }, ...m.status)), M.push(se("div", { class: "al-grow" })), m.asking ? M.push(se("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && M.push(Cn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, se("span", { html: Wt.playSmall }), m.primary.label)), m.hint && !m.asking && M.push(se("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && M.push(Cn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), M;
  }
  function T(m, I) {
    const { songs: N, current: M, started: Y, own: j, out: ae, waiting: ce } = I, Ke = m.player, C = t.radio(), F = [];
    F.push(se("div", { class: "al-listhead" }, se("span", {}, se("b", {}, Ke.title), ` · ${xa(N.length, "song", "songs")}`), _(m)));
    const te = l(Ke.cover), le = "album:" + Ke.cover;
    te && !bn.has(le) && (bn.set(le, te), Eh(te).then((Ne) => {
      Ne !== te && (bn.set(le, Ne), X());
    }));
    const Ce = te ? bn.get(le) || te : "";
    return F.push(se("ol", { class: "al-tracks" }, ...N.map((Ne, _t) => {
      const je = String(Ne.id) === M, Me = kh(String(Ne.id), je && Y ? j : void 0);
      return se("li", {}, Cn(
        { class: "al-track" + (je ? " is-on" : ""), "aria-label": `Play ${Ne.title || "#" + Ne.id}`, "aria-current": je ? "true" : void 0, disabled: ae || ce, onClick: () => {
          var Pe;
          return (Pe = C == null ? void 0 : C.playToken) == null ? void 0 : Pe.call(C, Ne.id);
        } },
        se(
          "span",
          { class: "al-th" + (Me ? "" : " is-blank") },
          Me ? se("img", { src: Me, alt: "", decoding: "async" }) : Ce ? se("img", { src: Ce, alt: "", decoding: "async" }) : null,
          Me ? null : se("span", { class: "al-n" }, String(_t + 1)),
          je ? se("span", { class: "al-eq", html: Wt.eq }) : null
        ),
        se("span", { class: "al-tt" }, Ne.title || `#${Ne.id}`, Ne.explicit ? se("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), F;
  }
  function P(m) {
    var Me;
    const I = m.player, N = I.tracks.filter((Pe) => !Pe.hidden), M = t.radio(), Y = w == null ? void 0 : w.nowPlaying, j = Y && I.tracks.some((Pe) => String(Pe.id) === String(Y.tokenId)) ? String(Y.tokenId) : null, ae = j ? I.tracks.find((Pe) => String(Pe.id) === j) : null, ce = m.plays === 0 && !m.playsComing, Ke = !!m.playsComing && !m.plays, C = !!(w != null && w.playing) && !!j, F = w == null ? void 0 : w.heart, te = j ? (Me = M == null ? void 0 : M.getPosition) == null ? void 0 : Me.call(M) : null;
    j && (C || ((te == null ? void 0 : te.current) ?? 0) > 0.5) && (x = I.id);
    const le = !!j && x === I.id;
    L && L !== j && (L = null);
    const Ce = le ? String((Y == null ? void 0 : Y.cover) || "") : "", Ne = !!Ce && L === j, je = [B(I, !ce, { song: Ne ? "" : Ce, paused: le && !C, flip: Ce ? () => {
      L = L === j ? null : j, X();
    } : void 0, flipped: Ne })];
    if (je.push(se(
      "div",
      { class: "al-now" },
      se(
        "div",
        { class: "al-now-t" },
        se("div", { class: "al-song" }, ae ? ae.title || (Y == null ? void 0 : Y.title) || `#${ae.id}` : I.title),
        se("div", { class: "al-artist" }, ae ? ae.artist || (Y == null ? void 0 : Y.artist) || I.subtitle : I.subtitle || "Press play")
      ),
      j ? Cn({ class: "al-icon" + (F != null && F.liked ? " is-on" : ""), "aria-label": F != null && F.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(F != null && F.liked)), disabled: !!(F != null && F.pending) || !!(F != null && F.locked) || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.toggleLike) == null ? void 0 : Pe.call(M);
      }, html: F != null && F.liked ? Wt.heartOn : Wt.heart }) : null
    )), ce)
      je.push(se(
        "div",
        { class: "al-out" },
        se("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        se("p", { class: "al-out-t" }, "You've played this album out"),
        se("p", { class: "al-out-s" }, "Add plays to keep listening."),
        K(m, !0)
      ));
    else {
      const Pe = te != null && te.duration ? Math.min(100, te.current / te.duration * 100) : 0;
      je.push(se(
        "div",
        { class: "al-prog" },
        se("div", { class: "al-bar" }, se("i", { style: `width: ${Pe}%` })),
        se("div", { class: "al-times" }, se("span", {}, _c((te == null ? void 0 : te.current) || 0)), se("span", {}, te != null && te.duration ? _c(te.duration) : "–:––"))
      ));
    }
    return je.push(se(
      "div",
      { class: "al-ctl" + (ce || Ke ? " is-off" : "") },
      Cn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ce || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.prev) == null ? void 0 : Pe.call(M);
      }, html: Wt.prev }),
      Cn({ class: "al-play", "aria-label": C ? "Pause" : "Play", disabled: ce || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.playPause) == null ? void 0 : Pe.call(M);
      }, html: C ? Wt.pause : Wt.play }),
      Cn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ce || Ke, onClick: () => {
        var Pe;
        return (Pe = M == null ? void 0 : M.next) == null ? void 0 : Pe.call(M);
      }, html: Wt.next })
    )), m.status.length && je.push(se("div", { class: "al-status", role: "status" }, ...m.status)), je.push(...T(m, { songs: N, current: j, started: le, own: Ce, out: ce, waiting: Ke })), je.push(se("div", { class: "al-grow" })), je.push(Cn(
      { class: "al-more", "aria-expanded": String(s === "more"), onClick: () => u(s === "more" ? "" : "more") },
      se("span", {}, "More ", se("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      se("span", { html: Wt.down })
    )), je;
  }
  function K(m, I) {
    const N = se("div", { class: "al-topups" + (I ? " al-topups--primary" : "") }), M = I ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const Y of M) {
      const j = m.myPlays !== void 0 && m.myPlays >= Y && !m.playsComing && !m.busy;
      N.append(Cn({ class: "al-topup", disabled: !j, onClick: () => t.topUp(Y) }, I ? `Add ${Y.toLocaleString()} plays` : `+${Y.toLocaleString()}`));
    }
    return I && N.append(Cn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), N;
  }
  function ie(m) {
    const I = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), N = se(
      "div",
      { class: "al-card" },
      se("div", { class: "al-card-h" }, se("b", {}, `Add plays to ${m.player.title}`), se("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      K(m, !1),
      se("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : I ? `Moved from My player · ${xa(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !I && !m.playsComing && m.myPlays !== void 0 ? Cn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), M = (j, ae, ce, Ke) => Cn(
      { class: "al-row", onClick: Ke },
      se("span", { class: "al-row-i", html: j }),
      se("span", { class: "al-row-t" }, se("b", {}, ae), se("small", {}, ce)),
      se("span", { class: "al-row-go", html: Wt.right })
    ), Y = se(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(Wt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, X();
      }),
      i ? se("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return se(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      se("div", { class: "al-sheet-h" }, se("b", {}, "More"), Cn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Wt.close })),
      m.mode === "open" ? N : null,
      se(
        "div",
        { class: "al-rows" },
        M(Wt.grid, "My music", "Your albums and the radio", () => u("music")),
        M(Wt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        m.canMake ? M(Wt.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        M(Wt.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        Y
      )
    );
  }
  function ee(m) {
    var ce, Ke;
    const I = m.player, N = w == null ? void 0 : w.nowPlaying, M = N && I.tracks.some((C) => String(C.id) === String(N.tokenId)) ? String(N.tokenId) : null, Y = !!(w != null && w.playing) && !!M, j = M ? (Ke = (ce = t.radio()) == null ? void 0 : ce.getPosition) == null ? void 0 : Ke.call(ce) : null;
    M && (Y || ((j == null ? void 0 : j.current) ?? 0) > 0.5) && (x = I.id);
    const ae = !!M && x === I.id;
    return T(m, {
      songs: I.tracks.filter((C) => !C.hidden),
      current: M,
      started: ae,
      own: ae ? String((N == null ? void 0 : N.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function X() {
    const m = o;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete c.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, c.dataset.albumlist = "1", e.replaceChildren(...ee(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const I = se(
      "header",
      { class: "al-top" },
      se("a", { class: "al-brand", href: "/radio" }, $l("al-logo"), "Xtrata ", se("b", {}, "Music")),
      m.mode === "open" ? Cn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Wt.grid }) : null
    ), N = se("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? P(m) : A(m));
    e.replaceChildren(I, N, ...s === "more" ? [se("div", { class: "al-scrim", onClick: () => u("") }), ie(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        o = m, X();
        return;
      }
      const I = !!o;
      o = m, !m && (I || s) && (s = "", delete c.dataset.sheet), m ? c.dataset.view = "album" : delete c.dataset.view, m != null && m.asking ? c.dataset.asking = "1" : delete c.dataset.asking, X();
    },
    sheet: () => s,
    setSheet: u
  };
}
const bL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", xL = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${bL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, SL = (e) => xL("source|audio", e), vL = 48 * 1024 * 1024;
function AL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let o = 0; o < n.length; o++) r[o] = n.charCodeAt(o);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function EL(e) {
  const t = e.fetch ?? ((...p) => fetch(...p));
  let n = null, r = null, o = "", s = null;
  const i = (p) => {
    n = p, e.changed();
  }, c = () => {
    var p;
    if (s == null || s.abort(), s = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (p = r.load) == null || p.call(r);
      } catch {
      }
    o.startsWith("blob:") && URL.revokeObjectURL(o), o = "";
  };
  async function l(p, d, w = 0) {
    var A, T, P;
    const y = "/inscription/" + p, v = await t(y, { signal: d }), x = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), y;
    if (!x.includes("text/html"))
      throw await ((P = v.body) == null ? void 0 : P.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > vL) throw new Error("too large");
    const B = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (B) return AL(B[1].replace(/&amp;/g, "&"));
    const _ = w === 0 ? SL(L) : null;
    if (_) return l(Number(_), d, 1);
    throw new Error("no audio");
  }
  async function u(p) {
    var w;
    c();
    const d = s = new AbortController();
    i({ id: p, state: "loading" });
    try {
      const y = await l(p, d.signal);
      if (d.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (o = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (c(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          c(), i({ id: v, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), d.signal.aborted) return;
      i({ id: p, state: "playing" });
    } catch {
      if (d.signal.aborted) return;
      c(), i({ id: p, state: "error" });
    }
  }
  return {
    state: (p) => (n == null ? void 0 : n.id) === p ? n.state : "idle",
    toggle: (p) => {
      (n == null ? void 0 : n.id) === p && n.state !== "error" ? (c(), i(null)) : u(p);
    },
    stop: () => {
      n && (c(), i(null));
    }
  };
}
const kL = ["Earned", "Claim", "Yours"], $L = ["Connect", "Link", "Name"], It = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, yn = (e, t, n, r = !1) => {
  const o = It("button", e, t);
  return o.type = "button", o.disabled = r, o.onclick = n, o;
}, Fg = (e, t, n, r = !1) => {
  const o = yn("al-album", "", n, r), s = It("span", "al-album__t");
  return s.append(It("b", "", e), It("span", "", t)), o.append(s), o;
}, IL = (e) => `No. ${String(e).padStart(4, "0")}`, LL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function CL(e) {
  const t = document.documentElement;
  let n = !1, r = "", o = null;
  const s = (i) => {
    if (o && r === i.art) return o;
    r = i.art, o = It("div", "aw-art");
    const c = document.createElement("iframe");
    return c.src = i.art, c.title = `${i.tier.name} record. Drag to turn it.`, c.setAttribute("sandbox", "allow-scripts"), o.append(c), o;
  };
  return {
    showing: () => n,
    /** `otherActive`: an album or a welcome screen owns the mount right now, so this view only steps aside. */
    render(i, c = !1) {
      if (!i) {
        n && !c && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n && (delete t.dataset.award, r = "", o = null), n = !1;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.award = i.screen, i.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const l = It("header", "al-top"), u = It("a", "al-brand");
      u.href = "/radio", u.append($l("al-logo"), It("span", "", "Xtrata "), It("b", "", "Music")), l.append(u);
      const p = It("div", "al-welcome"), d = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (p.append(d === "have" ? Il($L, LL(i)) : Il(kL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const _ = It("div", "tier-disc tier-disc--mid");
        _.dataset.tier = i.tier.id, _.append(It("span", "tier-disc__mark", i.tier.mark)), p.append(_);
      } else if (d !== "have" && d !== "get") {
        const _ = s(i);
        _.classList.toggle("aw-art--small", d === "name"), p.append(_);
      }
      const v = d === "ready" ? `Your ${w} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      p.append(It("h1", "", v));
      const x = (_, A = "") => p.append(It("p", A, _)), L = [];
      if (d === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(yn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), It("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), yn("al-link", "Later", i.later));
      else if (d === "name")
        y ? (x(`Your record will carry ${y} beside your player’s address.`), L.push(yn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), yn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Fg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Fg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          yn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(yn("al-primary", "Check again", i.refresh, i.busy), yn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(It("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(yn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(yn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (x(`Found it: ${y}. It goes on your plaque beside your player’s address.`), L.push(yn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(yn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(yn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(yn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(yn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const _ = It("ol", "aw-steps"), A = It("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = It("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const P = It("li");
        P.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", It("span", "ppp-addr-full", i.player), i.copyAddress());
        const K = It("li", "", "Check again, and your name shows on the preview before you claim.");
        _.append(A, P, K), p.append(_), L.push(yn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), yn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const _ = It("p", "al-hint"), A = It("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", _.append(A), p.append(_);
        }
      } else if (x(`${w} record ${IL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(yn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const _ = It("a", "al-link", "Open it full screen ↗");
        _.href = `/i/${i.inscription}`, _.target = "_blank", _.rel = "noopener", L.push(_);
      }
      if (i.status.length) {
        const _ = It("div", "al-status");
        _.setAttribute("role", "status"), _.append(...i.status), p.append(_);
      }
      i.asking ? p.append(It("p", "al-hint al-hint--ask", "Continue in the box below.")) : p.append(...L);
      const B = It("div", "al-body al-body--welcome");
      B.append(p), e.hidden = !1, e.replaceChildren(l, B);
    }
  };
}
const Nb = "xtrata.xyz/music/release", TL = "Release music on Xtrata Music; no spending permission", BL = (e) => ({
  domain: dr({ name: mt(Nb), version: mt("1"), "chain-id": xn(1) }),
  message: dr({ purpose: mt(TL), artist: mt(e.artist), release: mt(e.hash), issued: xn(e.issued) })
}), NL = "Set the price of my release on Xtrata Music; no spending permission", ML = 100000n, PL = 1000000000n, _L = (e) => e === 0n || e >= ML && e <= PL, UL = (e) => ({
  domain: dr({ name: mt(Nb), version: mt("1"), "chain-id": xn(1) }),
  message: dr({ purpose: mt(NL), artist: mt(e.artist), release: mt(e.release), price: xn(BigInt(e.price)), issued: xn(e.issued) })
}), ki = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, OL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, we = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, En = (e, t, n = "") => {
  const r = we("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Uc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), jg = (e) => {
  const t = Nr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function Oc(e, t, n = "", r = "") {
  const o = we("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), s = e || n;
  if (s) {
    const i = document.createElement("img");
    i.src = s, i.alt = "", i.decoding = "async", o.append(i);
  }
  return e || o.append(we("span", t)), o;
}
const Vu = (e) => !!e && nf(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function HL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, o = "", s = "";
  const i = (() => {
    try {
      const R = new URLSearchParams(location.search).get("release");
      return nf(R) ? R : null;
    } catch {
      return null;
    }
  })();
  let c = i ? { id: i } : null;
  const l = (R) => "xtrata.radio.releases.shelf.v1:" + R;
  let u = null, p = !1, d = -1 / 0;
  const w = (R, O, J) => {
    const re = Array.isArray(O) ? O.filter(Vu).map((fe) => ({ ...fe, hidden: !!fe.hidden })) : [];
    u = { for: R, albums: re, fresh: J }, J && e.store.set(l(R), JSON.stringify(re));
  }, y = (R) => {
    try {
      w(R, JSON.parse(e.store.get(l(R)) || "[]"), !1);
    } catch {
      w(R, [], !1);
    }
  }, v = () => {
    const R = e.player().address;
    return R && (u == null ? void 0 : u.for) === R ? u.albums : [];
  };
  async function x(R, O = "") {
    const J = e.player();
    if (!J.address || !J.unlocked)
      return s = "Unlock your player first.", e.changed(), !1;
    if (p) return !1;
    p = !0, s = "", e.changed();
    try {
      const re = await e.signShelf(R, O), fe = await e.json("/radio/release/shelf", Uc(re));
      return w(J.address, fe == null ? void 0 : fe.albums, !0), B(fe == null ? void 0 : fe.pay) ? A(J.address, fe.pay) : R === "add" && A(J.address, null, O), !0;
    } catch (re) {
      return R !== "list" && (s = re.message || "That did not work. Try again."), !1;
    } finally {
      p = !1, e.changed();
    }
  }
  const L = (R) => "xtrata.radio.releases.orders.v1:" + R, B = (R) => !!R && /^[0-9a-f]{16}$/.test(R.order) && nf(R.release) && typeof R.to == "string" && /^\d{1,12}$/.test(R.amount) && typeof R.memo == "string", _ = (R) => {
    if (!R) return {};
    try {
      const O = JSON.parse(e.store.get(L(R)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, J]) => B(J))) : {};
    } catch {
      return {};
    }
  };
  function A(R, O, J = (O == null ? void 0 : O.release) ?? "") {
    var fe;
    const re = _(R);
    O ? re[O.release] = { ...((fe = re[O.release]) == null ? void 0 : fe.order) === O.order ? re[O.release] : {}, ...O } : delete re[J], e.store.set(L(R), Object.keys(re).length ? JSON.stringify(re) : null);
  }
  const T = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Map();
  async function K(R, O, J = !1) {
    var re;
    if (!T.has(O.order)) {
      T.add(O.order), P.set(O.order, e.now()), J && (s = "", e.changed());
      try {
        const fe = await e.json("/radio/release/paid", Uc({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (fe == null ? void 0 : fe.status) === "paid" ? (A(R, null, O.release), ((re = c == null ? void 0 : c.view) == null ? void 0 : re.id) === O.release && (c.view = { ...c.view, added: c.view.added + 1 }), s = "", T.delete(O.order), (u == null ? void 0 : u.for) === R && (u.fresh = !1), e.player().unlocked && await x("list")) : (B(fe) && A(R, { ...O, ...fe }), J && (fe == null ? void 0 : fe.status) === "pending" && (s = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (fe) {
        /did not go through|does not pay this order/.test(fe.message || "") && A(R, { ...O, txid: void 0, status: "pending" }), (J || O.txid) && (s = fe.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(O.order), e.changed();
      }
    }
  }
  async function ie(R, O, J) {
    if (!o) {
      o = "Approve the payment in your wallet…", s = "", e.changed();
      try {
        const re = await e.pay(R, J.to, BigInt(J.amount), J.memo), fe = { ...J, txid: re || void 0, status: "confirming" };
        A(O, fe), o = "", K(O, fe);
      } catch (re) {
        s = /cancel/i.test(re.message || "") ? "Payment cancelled. Nothing was sent." : re.message || "Not paid. Nothing was sent.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  async function ee(R) {
    const O = e.player();
    if (!await x("add", R.id) || !O.address) return;
    const J = _(O.address)[R.id], re = e.main();
    J && re && await ie(re, O.address, J);
  }
  function X() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (c && !c.view && !c.error) {
      const O = c;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (J) => {
          Vu(J) ? (O.view = J, delete O.error) : O.error = "This release could not be read.";
        },
        (J) => {
          O.error = J.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const R = e.player();
    if (R.address) {
      (u == null ? void 0 : u.for) !== R.address && y(R.address), R.unlocked && !(u != null && u.fresh) && !p && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const O of Object.values(_(R.address)))
        if ((O.txid || O.status === "confirming") && !T.has(O.order) && e.now() - (P.get(O.order) ?? -1 / 0) > 2e4) {
          const J = R.address;
          K(J, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? v().filter((R) => !R.hidden) : [];
  function I(R, O) {
    const J = we("ol", "", "ppp-rel-songs");
    return R.forEach((re, fe) => {
      const ut = we("li");
      ut.append(Oc(e.art.song(re.id, !0) || "", String(fe + 1), O), we("span", re.title)), J.append(ut);
    }), J;
  }
  function N() {
    if (!t || !c || c.dismissed) return [];
    if (!c.view) return c.error ? [we("p", `♫ ${c.error}`, "ppp-warn")] : [we("p", "♫ Opening this release…", "ppp-mute")];
    const R = c.view, O = we("div", "", "ppp-release-in"), J = we("p", "", "ppp-release-in__h"), re = BigInt(/^\d{1,12}$/.test(R.price ?? "") ? R.price : "0");
    J.append(we("b", R.title), we("span", `${R.subtitle || e.who(R.artist)} · ${jg(R)}${re > 0n ? ` · ${ki(re)} STX` : ""}`));
    const fe = Nr(R), ut = e.art.cover(R.cover) || (R.cover ? "" : fe[0] && e.art.song(fe[0].id, !0) || ""), Te = we("div", "", "ppp-rel-top");
    Te.append(Oc(ut, "💿", "", "is-cover"), J), O.append(Te, I(fe.map((Ae) => ({ id: Ae.id, title: Ae.title || `#${Ae.id}` })), e.art.cover(R.cover))), O.append(we("p", `Released by ${e.who(R.artist)}. ${R.added === 1 ? "1 player has" : `${R.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const Ue = e.player(), bt = v().find((Ae) => Ae.id === R.id), Re = we("div", "", "ppp-award__row");
    if (bt)
      O.append(we("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), Re.append(En("Play it", () => e.open(R), "primary"));
    else if (!Ue.address) O.append(we("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!Ue.unlocked) O.append(we("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (re > 0n) {
      const Ae = _(Ue.address)[R.id], qe = e.main(), Xe = `${ki((Ae == null ? void 0 : Ae.amount) ?? re)} STX`;
      if (Ae != null && Ae.txid || (Ae == null ? void 0 : Ae.status) === "confirming") {
        O.append(we("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const ze = En("Check now", () => void K(Ue.address, Ae, !0));
        ze.disabled = T.has(Ae.order), Re.append(ze);
      } else if (O.append(we("p", `This album costs ${Xe}. You pay ${e.who(R.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !Ae) O.append(we("p", "Buying is paused right now.", "ppp-warn"));
      else if (Ae) {
        if (qe) {
          const fn = En(`Pay ${Xe} from my wallet`, () => void ie(qe, Ue.address, Ae), "primary");
          fn.disabled = !!o, Re.append(fn);
        } else O.append(we("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const ze = we("div", "", "ppp-rel-pay"), Ut = (fn, Fn, kt) => {
          const an = we("p");
          return an.append(we("span", fn), we("code", Fn), ir(`order-${kt}:${Ae.order}`, "Copy", () => Fn, "tiny", e.changed)), an;
        };
        ze.append(Ut("Send", ki(Ae.amount) + " STX", "amount"), Ut("To", Ae.to, "to"), Ut("Memo", Ae.memo, "memo")), O.append(ze, we("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const dn = En("I have paid: check", () => void K(Ue.address, Ae, !0));
        dn.disabled = T.has(Ae.order), Re.append(dn);
      } else {
        const ze = En(`Buy · ${Xe}`, () => void ee(R), "primary");
        ze.disabled = p || !!o, Re.append(ze);
      }
    } else {
      O.append(we("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const Ae = En("Add to my player", () => {
        x("add", R.id).then((qe) => {
          qe && (c != null && c.view) && (c.view = { ...c.view, added: c.view.added + 1 });
        });
      }, "primary");
      Ae.disabled = p, Re.append(Ae);
    }
    return Re.append(En("Not now", () => {
      c && (c.dismissed = !0), e.changed();
    }, "quiet")), O.append(Re), o && O.append(we("p", o, "ppp-cyan")), s && O.append(we("p", s, "ppp-warn")), [O];
  }
  let M = !1;
  function Y() {
    const R = t ? v() : [];
    if (!R.length) return null;
    const O = we("details", "", "ppp-release-manage");
    O.open = M, O.ontoggle = () => {
      M = O.open;
    };
    const J = R.filter((fe) => fe.hidden).length;
    O.append(we("summary", `Albums I added (${R.length}${J ? `, ${J} hidden` : ""})`));
    const re = e.player().unlocked;
    re || O.append(we("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const fe of R) {
      const ut = we("div", "", "ppp-release-row" + (fe.hidden ? " is-hidden" : "")), Te = we("span", "", "ppp-release-row__t");
      Te.append(we("b", fe.title), we("span", `${fe.subtitle || e.who(fe.artist)}${fe.hidden ? " · hidden" : ""}`));
      const Ue = En(fe.hidden ? "Show" : "Hide", () => void x(fe.hidden ? "show" : "hide", fe.id), "tiny"), bt = En("Remove", () => void x("remove", fe.id), "tiny");
      Ue.disabled = bt.disabled = !re || p, ut.append(Te, Ue, bt), O.append(ut);
    }
    return O.append(we("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), s && !c && O.append(we("p", s, "ppp-warn")), O;
  }
  let j = null, ae = [], ce = null;
  const Ke = we("input");
  Ke.maxLength = 60, Ke.placeholder = "Title of the single, EP or album", Ke.setAttribute("aria-label", "Release title");
  const C = we("input");
  C.maxLength = 80, C.placeholder = "Artist name shown under the title", C.setAttribute("aria-label", "Artist name");
  const F = we("input");
  F.inputMode = "numeric", F.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", F.setAttribute("aria-label", "Cover inscription number");
  const te = we("input");
  te.inputMode = "decimal", te.placeholder = "Price in STX, e.g. 2 (0 makes it free)", te.setAttribute("aria-label", "Price in STX");
  let le = null;
  const Ce = (R, O, J = "") => {
    le = (le == null ? void 0 : le.id) === R && le.what === O ? null : { id: R, what: O }, (le == null ? void 0 : le.what) === "price" && (te.value = J), s = "", e.changed();
  };
  async function Ne(R, O) {
    if (o) return;
    const J = OL(te.value);
    if (J === null || !_L(J)) {
      s = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    o = "Sign in your wallet (nothing is spent)…", s = "", e.changed();
    try {
      const re = { artist: R, release: O.id, price: J.toString(), issued: e.now() }, fe = await e.sign(R, UL(re));
      o = "Saving the price…", e.changed(), await e.json("/radio/release/price", Uc({ request: re, signature: fe })), s = J > 0n ? `Price set ✓ “${O.title}” now costs ${ki(J)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, le = null, Me(R, !0);
    } catch (re) {
      s = re.message || "The price was not changed.";
    } finally {
      o = "", e.changed();
    }
  }
  const _t = (R) => `${location.origin}${location.pathname}?release=${R}`;
  function je(R) {
    j = { for: R, loading: !0 }, ae = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(R)).then(
      (O) => {
        const J = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((re) => Number.isSafeInteger(re == null ? void 0 : re.id) && typeof re.title == "string") : null;
        j = J ? { for: R, songs: J, more: !!O.more } : { for: R, error: "Your songs could not be read right now." };
      },
      (O) => {
        j = { for: R, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Me(R, O = !1) {
    !O && (ce == null ? void 0 : ce.for) === R && e.now() - ce.at < 6e4 || (ce = { for: R, list: (ce == null ? void 0 : ce.for) === R ? ce.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(R)).then((J) => {
      Array.isArray(J == null ? void 0 : J.releases) && (ce = { for: R, list: J.releases.filter(Vu), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Pe(R) {
    if (!o) {
      o = "Checking your release…", s = "", e.changed();
      try {
        const O = F.value.trim().replace(/^#/, ""), J = Lb({ title: Ke.value.trim(), subtitle: C.value.trim(), tracks: [...ae], cover: O ? Number(O) : null });
        o = "Sign in your wallet (nothing is spent)…", e.changed();
        const re = { artist: R, hash: Cb(J), issued: e.now() }, fe = await e.sign(R, BL(re));
        o = "Releasing…", e.changed();
        const ut = await e.json("/radio/release/create", Uc({ definition: J, request: re, signature: fe }));
        s = `${ut.existing ? "Already released" : "Released"} ✓ “${ut.title}”. Its link is below.`, ae = [], Ke.value = "", F.value = "", e.audition.stop(), Me(R, !0);
      } catch (O) {
        s = O.message || "Not released.";
      } finally {
        o = "", e.changed();
      }
    }
  }
  const Nt = () => {
    queueMicrotask(() => e.audition.stop());
  }, Sn = /* @__PURE__ */ new Set();
  function ct(R) {
    const O = ae.map((ze) => R.find((Ut) => Ut.id === ze)).filter((ze) => !!ze), J = F.value.trim().replace(/^#/, ""), re = /^\d{1,9}$/.test(J) ? Number(J) : null, fe = e.art.cover(re), ut = O[0] ? e.art.song(O[0].id, !0) : null, Te = we("div", "", "ppp-release-preview");
    Te.append(we("p", "How it will look", "ppp-featured__h"));
    const Ue = we("p", "", "ppp-release-in__h"), bt = we("b", Ke.value.trim() || "Untitled"), Re = we("span", `${C.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    Ue.append(bt, Re);
    const Ae = we("div", "", "ppp-rel-top");
    Ae.append(Oc(re ? fe : ut || "", "💿", "", "is-cover"), Ue), Te.append(Ae, I(O.map((ze) => ({ id: ze.id, title: ze.title })), fe));
    const qe = O.filter((ze) => e.art.song(ze.id, !0) === null).length, Xe = [];
    re && !fe && Xe.push(`Looking for an image in #${re}… If none appears, that inscription is not a picture.`), qe && Xe.push(`Finding artwork for ${qe} ${qe === 1 ? "song" : "songs"}…`), !qe && O.some((ze) => e.art.song(ze.id, !1) === "") && Xe.push(`A numbered square is a song with no artwork of its own${fe ? ": it shows the cover, dimmed" : ""}.`);
    for (const ze of Xe) Te.append(we("p", ze, "ppp-mute"));
    return Ke.oninput = () => {
      bt.textContent = Ke.value.trim() || "Untitled";
    }, C.oninput = () => {
      Re.textContent = `${C.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, F.onchange = () => e.changed(), Te;
  }
  function Yt() {
    var J;
    const R = e.main();
    if (!t || !R)
      return j && (j = null, ae = [], Nt()), null;
    const O = [we("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (j && j.for !== R && (j = null, ae = [], Sn.clear(), Nt()), !j) O.push(En("Show the songs in my wallet", () => je(R), "primary"));
    else if (j.loading) O.push(we("p", "Reading your wallet…", "ppp-cyan"));
    else if (j.error) O.push(we("p", j.error, "ppp-warn"), En("Try again", () => je(R)));
    else if (!j.songs.length) O.push(we("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(we("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const re = we("div", "", "ppp-release-songs");
      for (const Te of j.songs) {
        const Ue = ae.indexOf(Te.id), bt = we("div", "", "ppp-release-song" + (Ue >= 0 ? " is-on" : "")), Re = e.audition.state(Te.id);
        Re !== "idle" && Sn.add(Te.id);
        const Ae = En(Re === "playing" ? "❚❚" : Re === "loading" ? "…" : "▶", () => e.audition.toggle(Te.id), "ppp-release-hear" + (Re === "playing" ? " is-on" : ""));
        Ae.setAttribute("aria-label", Re === "playing" ? `Stop ${Te.title}` : `Listen to ${Te.title}`), Ae.title = Re === "error" ? "This song could not be played just now" : Re === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const qe = e.art.song(Te.id, Ue >= 0 || Sn.has(Te.id)), Xe = En("", () => {
          ae = Ue >= 0 ? ae.filter((ze) => ze !== Te.id) : [...ae, Te.id], e.changed();
        }, "ppp-release-pick");
        Xe.setAttribute("aria-pressed", String(Ue >= 0)), Xe.append(we("i", Ue >= 0 ? String(Ue + 1) : "+"), we("b", Te.title), we("span", Re === "error" ? "could not play" : `${Te.artist ? Te.artist + " · " : ""}#${Te.id}`, Re === "error" ? "ppp-warn" : "")), bt.append(Ae, Oc(qe || "", qe === "" ? "♪" : "", ""), Xe), re.append(bt);
      }
      O.push(re), j.more && O.push(we("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !C.value && ae.length && (C.value = ((J = j.songs.find((Te) => Te.id === ae[0])) == null ? void 0 : J.artist) || "");
      const fe = ae.length === 0 ? "release" : ae.length === 1 ? "single" : ae.length <= 6 ? "EP" : "album", ut = En(ae.length ? `Sign and release this ${fe} · ${ae.length} ${ae.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Pe(R), "primary");
      ut.disabled = !ae.length || !!o, O.push(Ke, C, F), ae.length && O.push(ct(j.songs)), O.push(ut);
    }
    if (o && O.push(we("p", o, "ppp-cyan")), s && !c && O.push(we("p", s, /✓/.test(s) ? "ppp-ok" : "ppp-warn")), Me(R), (ce == null ? void 0 : ce.for) === R && ce.list.length) {
      O.push(we("p", "Your releases", "ppp-featured__h"));
      for (const re of ce.list) {
        const fe = we("div", "", "ppp-release-row"), ut = we("span", "", "ppp-release-row__t"), Te = BigInt(/^\d{1,12}$/.test(re.price ?? "") ? re.price : "0"), Ue = Te > 0n ? ` · ${ki(Te)} STX · ${(re.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (ut.append(we("b", re.title), we("span", `${jg(re)} · added by ${re.added.toLocaleString()} ${re.added === 1 ? "player" : "players"}${Ue}`)), fe.append(ut, ir("release-link:" + re.id, "Copy link", () => _t(re.id), "tiny", e.changed)), n.sales) {
          const Re = En("Price", () => Ce(re.id, "price", Te > 0n ? ki(Te) : ""), "tiny");
          Re.setAttribute("aria-expanded", String((le == null ? void 0 : le.id) === re.id && le.what === "price")), fe.append(Re);
        }
        if (n.copies && e.copies) {
          const Re = En("Send copies", () => Ce(re.id, "copies"), "tiny");
          Re.setAttribute("aria-expanded", String((le == null ? void 0 : le.id) === re.id && le.what === "copies")), fe.append(Re);
        }
        if (O.push(fe), (le == null ? void 0 : le.id) !== re.id) continue;
        const bt = we("div", "", "ppp-release-way");
        if (le.what === "price" && n.sales) {
          const Re = En("Sign this price", () => void Ne(R, re), "primary");
          Re.disabled = !!o, bt.append(
            we("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            te,
            Re
          );
        } else le.what === "copies" && n.copies && e.copies && bt.append(...e.copies(R, { id: re.id, title: re.title }));
        bt.childNodes.length && O.push(bt);
      }
    }
    return O;
  }
  return { sync: X, albums: m, banner: N, manage: Y, fold: Yt, wantsArt: () => t === !0 && (!!(c != null && c.view) && !c.dismissed || !!(j != null && j.songs) && !!e.main()), enabled: () => t === !0 };
}
const Xu = "xtrata.radio.replace.v1", kn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, eo = (e, t, n = "") => {
  const r = kn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Rg = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function DL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(Xu) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(Xu, v ? JSON.stringify(v) : null), e.changed();
  };
  let o = null, s = !1, i = "", c = !1;
  function l(v) {
    s || (o == null ? void 0 : o.for) === v && (o.n !== null || Date.now() - o.at < 3e4) || (s = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (x) => {
        o = { for: v, n: Number.isSafeInteger(x == null ? void 0 : x.total) ? x.total : null, at: Date.now() };
      },
      () => {
        o = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      s = !1, e.changed();
    }));
  }
  const u = () => !!n, p = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const w = () => {
    i = "", r(null);
  };
  function y(v) {
    var P;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(Xu, JSON.stringify(n)));
    const x = [], L = (K, ie) => x.push(kn("p", `Replacing your old player · step ${K} of 3 · ${ie}`, "ppp-cyan")), B = () => eo("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      x.push(kn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? x.push(kn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), eo("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && x.push(kn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const K = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return x.push(kn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${K}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), x.push(eo("Done", w, "quiet")), x;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), x.push(kn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), x.push(eo("Hide this", w, "quiet")), x) : null;
    if (l(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), x.push(kn("p", "Unlock your old player so it can be emptied."), eo("Unlock my old player", e.unlock, "primary"), B()), x;
    const _ = e.keepBoth(v), A = (K) => (L(1, "empty it"), x.push(kn("p", K, "ppp-warn")), _ && x.push(eo("Keep both players instead", () => {
      w(), _();
    }, "primary")), x.push(B()), x);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((o == null ? void 0 : o.for) !== n.old)
      return L(1, "empty it"), x.push(kn("p", "Checking what this player has…", "ppp-mute"), B()), x;
    if (o.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (o.n > 0) return A(`This player has ${o.n === 1 ? "an album" : `${o.n} albums`} of its own. Replacing it would leave ${o.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((P = v.award) == null ? void 0 : P.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((K) => ["prepared", "signed", "unknown", "pending"].includes(String(K.status))))
      return L(1, "empty it"), x.push(kn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), B()), x;
    if (v.balance === void 0)
      return L(1, "empty it"), x.push(kn("p", "Checking what it holds…", "ppp-mute"), B()), x;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), x.push(kn("p", `It holds ${Rg(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? x.push(eo("Send everything back", e.returnAll, "primary")) : x.push(kn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), x.push(B()), x;
    L(2, "remove it from this device"), x.push(kn("p", v.balance > 0n ? `Empty ✓ (the ${Rg(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), x.push(kn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = eo(c ? "Check the box below…" : "Remove my old player", () => {
      c || (c = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (K) => {
        i = /cancel/i.test((K == null ? void 0 : K.message) || "") ? "" : (K == null ? void 0 : K.message) || "It was not removed.";
      }).finally(() => {
        c = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = c || !!v.busy, x.push(T, B()), i && x.push(kn("p", i, "ppp-warn")), x;
  }
  return { active: u, claiming: p, start: d, stop: w, lines: y };
}
const FL = [
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
function jL(e) {
  for (const [t, n] of FL) if (n.test(e)) return t;
  return null;
}
const Mb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Pb = (e) => /Android/.test(e);
function RL(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Mb(t) ? "x-safari-" + n.href : Pb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const zL = (e) => Mb(e) ? "Safari" : Pb(e) ? "Chrome" : "your browser", $i = "Xtrata Music Wallet", GL = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function zg(e, t = (n) => n) {
  var s, i, c;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((s = e.gate) == null ? void 0 : s.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: $i, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], o = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((l) => !!l))];
  for (const l of o) {
    const u = e.standIn === l && GL.has(e.step);
    r.push({
      action: "linked",
      main: l,
      label: `${$i} · ${t(l)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(l)}.`
    });
  }
  if ((c = e.gate) != null && c.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: $i, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: $i, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: $i, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: $i, detail: "Open on this device." });
    }
  return r;
}
const Yu = "xtrata.radio.novice", _b = "xtrata.radio.novice.previewed.v1", Gg = 6 * 6e4;
function KL(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(Yu, r), n = r;
    else {
      if (r === "0")
        return t.set(Yu, null), { on: !1, preview: !1 };
      n = t.get(Yu);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const VL = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Kg = (e) => VL.test(e ?? ""), XL = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, YL = {
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
}, qL = (e, t) => YL[e] ?? t;
function WL(e, t) {
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
const ZL = "Make your player once, with Face ID or your fingerprint, and the music starts.", JL = "Checking your player…", of = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function Ub(e) {
  try {
    const t = JSON.parse(e.get(_b) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function QL(e, t) {
  const n = Ub(e).filter((r) => r !== t);
  n.push(t), e.set(_b, JSON.stringify(n.slice(-50)));
}
function qu(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...of(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : of();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > Gg ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > Gg ? { ...e, phase: "done" } : e;
  }
}
const Hc = (e) => e.phase === "open" || e.phase === "playing";
function eC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const tC = [100, 250, 500, 1e3], nC = (e, t = _r) => BigInt(e) * Nn(t);
function rC(e, t = _r, n = 0n) {
  const r = ws - e - n;
  return r > 0n ? Number(r / Nn(t)) : 0;
}
function sC(e, t = _r, n = 0n) {
  const r = e === void 0 ? 0 : rC(e, t, n);
  return tC.map((o) => ({ plays: o, stx: nC(o, t), fits: e !== void 0 && o <= r }));
}
const oC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, iC = (e) => oC[e.unit](e.amount), Kt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, qc = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function aC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${qc(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${qc(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${qc(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function cC(e) {
  let t = null, n = 0, r = "stx";
  const o = (i) => {
    var l;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const c = i.filter((u) => u.fits);
    n = ((l = c.find((u) => {
      var p;
      return u.plays === ((p = i[1]) == null ? void 0 : p.plays);
    }) ?? c.at(-1)) == null ? void 0 : l.plays) ?? 0;
  };
  function s() {
    var y;
    if (!t) return;
    const i = e.input();
    if (!i) {
      t.close();
      return;
    }
    const c = sC(i.balance, i.fee, i.incoming);
    o(c);
    const l = eC(i.switches);
    (y = l.find((v) => v.id === r)) != null && y.on || (r = "stx");
    const u = [], p = Kt("h2", "ppp-connect__title", "Add plays");
    p.id = "ppp-restock-title", u.push(p), u.push(Kt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${qc(i.playsLeft, "play", "plays")} left.`));
    const d = aC(i.done);
    if (d && u.push(Kt("p", "ppp-restock__done", d)), i.arriving)
      u.push(Kt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(Kt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!c.some((v) => v.fits))
      u.push(Kt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = Kt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const B of c) {
        const _ = Kt("button", "ppp-restock__pack" + (B.plays === n ? " is-on" : ""));
        _.type = "button", _.disabled = !B.fits, _.setAttribute("aria-pressed", String(B.plays === n)), _.append(Kt("b", "", B.plays.toLocaleString()), Kt("span", "", "plays")), _.onclick = () => {
          n = B.plays, s();
        }, v.append(_);
      }
      u.push(v);
      const x = Kt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const B of l) {
        const _ = Kt("button", "ppp-restock__way" + (B.id === r ? " is-on" : ""));
        _.type = "button", _.disabled = !B.on, _.setAttribute("aria-pressed", String(B.id === r)), _.append(Kt("b", "", B.label), Kt("span", "", B.on ? B.blurb : "Soon")), _.onclick = () => {
          r = B.id, s();
        }, x.append(_);
      }
      u.push(x);
      const L = c.find((B) => B.plays === n);
      if (L && r === "stx") {
        const B = Kt("div", "ppp-restock__pay"), _ = iC({ unit: "microSTX", amount: L.stx }), A = Kt("p", "ppp-restock__amount");
        A.append("Send ", Kt("b", "", _), " to your player:"), B.append(A, Kt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = Kt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Ir(L.stx), "")), B.append(T), B.append(Kt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(B);
      }
    }
    u.push(Kt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = Kt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), u.push(w), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = Kt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
      const i = t;
      i.addEventListener("close", () => {
        i.remove(), t === i && (t = null);
      }), i.addEventListener("click", (c) => {
        c.target === i && i.close();
      }), document.body.appendChild(i), s(), typeof i.showModal == "function" ? i.showModal() : i.setAttribute("open", "");
    },
    /** The page redrew (a balance changed, plays landed): keep the sheet in step. */
    refresh: s,
    close() {
      t == null || t.close();
    }
  };
}
const bs = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), lC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function uC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const o of Array.isArray(e) ? e : []) {
    const s = Number(o == null ? void 0 : o.id);
    if (!Number.isSafeInteger(s) || s < 0 || n.has(s)) continue;
    n.add(s);
    const i = t(s, { title: typeof o.title == "string" ? o.title : void 0, artist: typeof o.artist == "string" ? o.artist : void 0 });
    r.push({ id: s, title: lC(i.title) ? `#${s}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((o, s) => o.id - s.id);
}
function dC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = bs(n.artist), o = t.get(r);
    o ? o.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function fC(e, t, n = "", r = 60) {
  const o = bs(t).split(/\s+/).filter(Boolean), s = bs(n);
  if (!o.length && !s) return { songs: [], total: 0 };
  const i = [];
  for (const c of e) {
    const l = bs(c.artist), u = bs(c.title), p = String(c.id);
    if (s && l !== s) continue;
    let d = 0, w = !0;
    for (const y of o) {
      const v = y.replace(/^#/, "");
      if (u.includes(y)) d += u.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(v) && p === v) d += 0;
      else if (l.includes(y)) d += 2;
      else if (/^\d+$/.test(v) && p.startsWith(v)) d += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: c, rank: d });
  }
  return i.sort((c, l) => c.rank - l.rank || c.s.id - l.s.id), { songs: i.slice(0, r).map((c) => c.s), total: i.length };
}
const gr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, Vg = 12;
function hC(e, t) {
  let n = null, r = "idle", o = "", s = "", i = !1;
  const c = gr("input", "find-q");
  c.type = "search", c.placeholder = "Search songs, artists or #", c.setAttribute("aria-label", "Search all music"), c.autocomplete = "off";
  const l = gr("div", "hint"), u = gr("div", "find-artists"), p = gr("ol", "likesList find-list");
  l.setAttribute("role", "status");
  const d = gr("div", "likesTools");
  d.append(c), e.replaceChildren(d, l, u, p), c.oninput = () => {
    o = c.value, y();
  };
  function w() {
    r === "loading" || r === "ready" || (r = "loading", y(), t.load().then((v) => {
      n = v, r = "ready", y();
    }, () => {
      r = "failed", y();
    }));
  }
  function y() {
    const v = t.locked();
    if (c.disabled = v, v) {
      l.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", u.replaceChildren(), p.replaceChildren();
      return;
    }
    if (r === "idle") {
      l.textContent = "";
      return;
    }
    if (r === "loading") {
      l.textContent = "Loading the catalogue…";
      return;
    }
    if (r === "failed" || !n) {
      l.textContent = "The catalogue is unavailable right now. ";
      const T = gr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, l.append(T), u.replaceChildren(), p.replaceChildren();
      return;
    }
    const x = dC(n), L = i ? x : x.slice(0, Vg), B = (T, P, K, ie = "") => {
      const ee = gr("button", "find-chip" + (P ? " is-on" : ""), T);
      return ee.type = "button", ee.setAttribute("aria-pressed", String(P)), ie && (ee.title = ie), ee.onclick = K, ee;
    };
    u.replaceChildren(
      ...L.map((T) => B(`${T.name} · ${T.songs}`, bs(T.name) === bs(s), () => {
        s = bs(T.name) === bs(s) ? "" : T.name, y();
      }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`)),
      ...x.length > Vg ? [B(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
        i = !i, y();
      })] : []
    );
    const _ = fC(n, o, s), A = t.current();
    p.replaceChildren(..._.songs.map((T) => {
      var ie, ee;
      const P = gr("li", "lrow" + (T.id === A ? " now" : "")), K = gr("button", "lt", T.title);
      if (K.type = "button", K.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, K.onclick = () => t.play(T.id), (ie = t.explicit) != null && ie.call(t, T.id)) {
        const X = gr("span", "exp", "E");
        X.title = "Explicit lyrics: only plays when you choose it", K.append(" ", X);
      }
      if ((ee = t.liked) != null && ee.call(t, T.id)) {
        const X = gr("span", "find-liked", "♥");
        X.title = "You like this song", X.setAttribute("role", "img"), X.setAttribute("aria-label", "Liked"), P.append(K, X);
      } else P.append(K);
      return P.append(gr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), P;
    })), l.textContent = !o.trim() && !s ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : _.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : _.total > _.songs.length ? `Showing ${_.songs.length} of ${_.total.toLocaleString()}. Type more to narrow it down.` : `${_.total} ${_.total === 1 ? "song" : "songs"}${s ? ` by ${s}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const Xg = (e, t, n) => Sf(Ef(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), pC = 317, gC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, yC = 15 * 6e4, wC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function Wu(e, t) {
  return e.standalone ? null : t ? "prompt" : wC(e) ? "ios" : null;
}
const Mi = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function mC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function bC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const nr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, xC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function SC(e, t, n = "safari") {
  const r = bC(n), o = nr("div", "a2hs-sheet a2hs-sheet--" + r.where);
  o.setAttribute("role", "dialog"), o.setAttribute("aria-modal", "true"), o.setAttribute("aria-label", Mi.title);
  const s = nr("div", "a2hs-card"), i = nr("div", "a2hs-head"), c = nr("img", "a2hs-icon");
  c.src = e, c.alt = "";
  const l = nr("div");
  l.append(nr("h2", "", Mi.title), nr("p", "", Mi.body)), i.append(c, l);
  const u = nr("ol", "a2hs-steps");
  r.steps.forEach((w, y) => {
    const v = nr("li");
    v.append(nr("i", "", String(y + 1)), nr("span", "", w)), u.append(v);
  });
  const p = nr("div", "a2hs-arrow");
  p.setAttribute("aria-hidden", "true"), p.append(xC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = nr("button", "a2hs-close", Mi.close);
  return d.type = "button", d.onclick = t, s.append(i, u, d), o.append(s, p), o.onclick = (w) => {
    w.target === o && t();
  }, o;
}
function vC(e) {
  let t = null, n = null, r = !1;
  const o = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, s = () => {
    const i = r ? null : Wu(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Mi.label), e.button.title = Mi.label, e.button.onclick = () => {
    var c;
    const i = Wu(e.env(), !!t);
    if (i === "prompt" && t) {
      const l = t;
      t = null;
      try {
        l.prompt();
      } catch {
      }
      s();
      return;
    }
    i === "ios" && !n && (n = SC(e.icon, o, mC(e.env().userAgent)), e.mount.append(n), (c = n.querySelector(".a2hs-close")) == null || c.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, s();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, o(), s();
  }), s(), { sync: s, kind: () => r ? null : Wu(e.env(), !!t) };
}
const Yg = document.getElementById("ppp");
Yg && AC(Yg);
function AC(e) {
  var S;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = u1(), o = (a) => e.querySelector(a), s = o(".ppp-frame");
  let i = null;
  const c = async (a, f) => {
    const g = await fetch(a, { cache: "no-store", ...f, signal: AbortSignal.timeout(15e3) }), h = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${g.status}).`);
    return h;
  }, l = R5({
    now: Date.now,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    config: (a) => c("/radio/listening-wallet/config?main=" + encodeURIComponent(a || "")),
    links: async (a) => (await c("/radio/listening-wallet/link?main=" + encodeURIComponent(a))).links ?? [],
    mainOf: async (a) => {
      var g;
      const f = (await c("/radio/listening-wallet/link?listening=" + encodeURIComponent(a))).links;
      return ((g = f == null ? void 0 : f.find((h) => h.listening === a)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (a) => {
      await c("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(a) });
    },
    bridge: async (a) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${a}; publickey-credentials-create ${a}`), i.referrerPolicy = "no-referrer";
      const f = new Promise((ne, ue) => {
        i.addEventListener("load", () => ne(), { once: !0 }), setTimeout(() => ue(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = a + "/", s.replaceChildren(i), await f;
      const g = new t1({ walletOrigin: a, frame: i, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), H = (ne, ue) => h.has(ne) ? g.request(ne, ue) : Promise.race([
        g.request(ne, ue),
        new Promise((xe, Ee) => setTimeout(() => Ee(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await H("listening.status"), { request: H };
    },
    chain: {
      verify: S5,
      balance: A5,
      account: v5,
      owner: E5,
      broadcast: k5,
      transaction: $5,
      confirmedNonce: async (a) => {
        const f = await co(`/v2/accounts/${a}?proof=0`);
        if (!Number.isSafeInteger(f == null ? void 0 : f.nonce) || f.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(f.nonce);
      }
    },
    signWithMain: (a, f) => Uu({ ...f, network: "mainnet", stxAddress: a }),
    deposit: (a, f, g) => new Promise((h, H) => og({
      recipient: f,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: a,
      network: new Zu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ne) => h(ne.txId || ""),
      onCancel: () => H(new Error("Deposit cancelled. Nothing was sent.")),
      onError: H
    })),
    validate: I5,
    tabLock: (a) => new Promise((f) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        f(!0);
        return;
      }
      g.request("xtrata-ppp:" + a, { ifAvailable: !0 }, async (h) => {
        f(!!h), h && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, f) => {
        try {
          localStorage.setItem(a, f);
        } catch {
        }
      }
    },
    changed: () => We(l.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (a) => {
      var f, g;
      return v.funder(a, () => M5(a, co), !!((g = (f = l.snapshot().gate) == null ? void 0 : f.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (a) => {
      const f = await c("/radio/gift/for?wallet=" + encodeURIComponent(a)), g = f == null ? void 0 : f.gift;
      if (!g) return null;
      if (typeof g.returnTo != "string" || typeof g.treasury != "string") throw new Error("Unreadable gift record.");
      return {
        returnTo: g.returnTo,
        from: typeof g.from == "string" ? g.from : null,
        source: String(g.source ?? ""),
        amount: String(g.amount ?? "0"),
        treasury: g.treasury,
        state: g.state === "sending" ? "sending" : "arrived",
        player: g.player ?? null,
        ...g.drop === "players" || g.drop === null ? { drop: g.drop } : {}
      };
    },
    // Music Hero awards: a failed request throws (shown as "can't check"), it is never read as "no award" or "no plays".
    awardStatus: async (a) => {
      const f = await c("/radio/awards/status?address=" + encodeURIComponent(a));
      if (typeof (f == null ? void 0 : f.state) != "string") throw new Error("Unreadable award status.");
      return f;
    },
    awardName: async (a) => {
      const f = await c("/radio/awards/name?address=" + encodeURIComponent(a));
      if ((f == null ? void 0 : f.name) !== null && typeof (f == null ? void 0 : f.name) != "string") throw new Error("Unreadable name.");
      return f.name;
    },
    awardNote: async (a, f) => {
      const g = await c("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: a, name: f }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (a, f) => U5(a, (g) => co(g), f),
    likesChanged: () => {
      var a, f;
      (f = (a = window.XtrataRadio) == null ? void 0 : a.refreshLikes) == null || f.call(a);
    },
    likeState: async (a, f) => {
      const g = await c("/radio/chain-likes?" + new URLSearchParams({ wallet: a, ids: String(f) })), h = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((H) => (H == null ? void 0 : H.id) === f) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((H) => typeof H == "string") : h.liked ? [a] : [] };
    },
    likeSent: (a, f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: a, liked: f } })),
    nameOf: (a) => pt(a) ?? void 0,
    likeConfirmed: (a, f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: a, liked: f } })),
    likeFailed: (a) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: a } }))
  }), u = (a, f, g, h, H, ne) => new Promise((ue, xe) => og({
    recipient: h,
    amount: H.toString(),
    memo: ne,
    stxAddress: g,
    network: new Zu(),
    appDetails: { name: a, icon: "/favicon.svg" },
    onFinish: (Ee) => ue(Ee.txId || ""),
    onCancel: () => xe(new Error(f)),
    onError: xe
  })), p = (a) => v.incomingStarter() && a.canAnother && a.hadGift === !1 && !a.main && a.listening && !a.createdHere && !a.brandNew && ["locked", "ready", "fund", "over", "link"].includes(a.step) && !a.busy ? () => void l.create({ quick: !0, another: !0 }) : null, d = (a) => p(a) && a.canForget ? () => {
    w.start(a), We(l.snapshot());
  } : null, w = DL({
    json: c,
    unlock: () => void l.unlock(),
    returnAll: () => void l.returnFunds("all"),
    forget: () => l.forget(),
    backup: () => void l.backup(),
    keepBoth: (a) => p(a),
    who: (a) => be(a),
    changed: () => We(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, f) => {
        try {
          f === null ? localStorage.removeItem(a) : localStorage.setItem(a, f);
        } catch {
        }
      }
    },
    dust: (a) => {
      var f;
      return BigInt(((f = a.gate) == null ? void 0 : f.limits.returnFee) ?? "3000");
    }
  }), y = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = qI({
    json: c,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    pay: (a, f, g, h) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", a, f, g, h),
    sign: (a, f) => Uu({ ...f, network: "mainnet", stxAddress: a }),
    giftSent: (a, f) => l.giftSent(a, f),
    claiming: (a) => l.giftClaiming(a),
    batchDays: () => {
      var a, f;
      return (f = (a = l.snapshot().gate) == null ? void 0 : a.gifts) == null ? void 0 : f.batchDays;
    },
    claimNew: (a) => p(a),
    replaceOld: (a) => d(a),
    album: { bind: (a) => l.bindAlbum(a), arrived: async (a, f, g, h) => {
      x.invalidate(), await l.albumArriving(a, f, g, h);
    } },
    who: (a) => be(a),
    changed: () => We(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, f) => {
        try {
          f === null ? localStorage.removeItem(a) : localStorage.setItem(a, f);
        } catch {
        }
      }
    },
    now: Date.now
  }), x = oL({
    json: c,
    open: (a) => {
      l.openAlbum(a);
    },
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, f) => {
        try {
          f === null ? localStorage.removeItem(a) : localStorage.setItem(a, f);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => We(l.snapshot())
  }), L = {
    get: (a) => {
      try {
        return localStorage.getItem(a);
      } catch {
        return null;
      }
    },
    set: (a, f) => {
      try {
        f === null ? localStorage.removeItem(a) : localStorage.setItem(a, f);
      } catch {
      }
    }
  }, B = KL(location.search, L);
  B.on && (document.documentElement.dataset.novice = B.preview ? "preview" : "1");
  const _ = (a) => B.on && a.solo, A = B.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), T = A ? document.getElementById("album") : null, P = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (a) => void l.topUpAlbum(a),
    openPlayer: () => void l.openAlbum(0)
  }, K = T ? Dg(T, P) : null, ie = HL({
    json: c,
    main: () => {
      const a = r.load();
      return a.isConnected && a.network === "mainnet" ? a.address : void 0;
    },
    sign: (a, f) => Uu({ ...f, network: "mainnet", stxAddress: a }),
    signShelf: (a, f) => l.signShelf(a, f),
    pay: (a, f, g, h) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", a, f, g, h),
    copies: (a, f) => {
      var g;
      return v.copies(a, f, ((g = l.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const a = l.snapshot(), f = a.slot === 0 ? a.listening : a.root;
      return { address: f, unlocked: !!f && ["ready", "fund", "over", "link"].includes(a.step) };
    },
    open: (a) => fr(a, !0),
    who: (a) => be(a),
    art: { song: (a, f) => f && kh(String(a)) || _g(String(a)), cover: (a) => Yc(a) },
    audition: EL({
      changed: () => We(l.snapshot()),
      quiet: () => {
        var f;
        const a = window.XtrataRadio;
        try {
          (f = a == null ? void 0 : a.getState) != null && f.call(a).playing && a.playPause();
        } catch {
        }
      }
    }),
    changed: () => We(l.snapshot()),
    store: {
      get: (a) => {
        try {
          return localStorage.getItem(a);
        } catch {
          return null;
        }
      },
      set: (a, f) => {
        try {
          f === null ? localStorage.removeItem(a) : localStorage.setItem(a, f);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), ee = () => {
    const a = new Set(fn.map((f) => f.id));
    return [...fn, ...ie.albums().filter((f) => !a.has(f.id))];
  }, X = T ? CL(T) : null, m = "xtrata.radio.award.later.v1";
  let I = "ready", N = !1, M = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(m) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), Y = !1;
  const j = "xtrata.radio.tier.v1";
  let ae = (() => {
    const a = L.get(j);
    return Pc(a) ? Mo(a) : null;
  })();
  const ce = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function Ke(a) {
    var H;
    if (a.listening && a.slot === 0 && ["fund", "ready", "over"].includes(a.step) && !(a.gift && a.gift.drop === void 0)) {
      let ne = null;
      try {
        ne = a.gift && !a.gift.player && a.gift.drop === "players" ? jI(BigInt(a.gift.amount)) : null;
      } catch {
        ne = null;
      }
      ((H = a.award) == null ? void 0 : H.state) === "claimed" && a.award.holds === !1 && (ne = null), ((ne == null ? void 0 : ne.id) ?? null) !== ((ae == null ? void 0 : ae.id) ?? null) && (ae = ne, L.set(j, ne ? ne.id : null));
    }
    const f = document.documentElement;
    ae ? f.dataset.tier = ae.id : delete f.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let h = g.querySelector(".ppp-tier");
    if (!ae) {
      h == null || h.remove();
      return;
    }
    h || (h = $("span", "", "ppp-tier"), g.append(h)), h.dataset.tier = ae.id, h.textContent = `${ae.mark} ${ae.name.toUpperCase()} PLAYER`, h.title = `A ${ae.name} player from the Xtrata Music giveaway`;
  }
  const C = (() => {
    var a;
    try {
      return !!((a = window.matchMedia) != null && a.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), F = document.getElementById("a2hs");
  F && vC({
    button: F,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: C })
  });
  let te = B.on ? pC : null, le = !1, Ce = 0, Ne = "";
  B.on && c("/radio/giveaway/players/intro").then((a) => {
    const f = a && a.song === null ? null : gC(a == null ? void 0 : a.song) ? a.song : te;
    f !== te && !le && (te = f, We(l.snapshot()));
  }).catch(() => {
  });
  const _t = (() => {
    try {
      const a = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(a) && a >= 1 && a <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(a));
      const f = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(f) && f >= 1 ? f : null;
    } catch {
      return null;
    }
  })(), je = (a) => {
    var h, H, ne;
    if (!le || te === null) return !1;
    if (Date.now() - Ce > yC || a.step === "ready")
      return a.step !== "ready" && (le = !1), !1;
    const f = (H = (h = window.XtrataRadio) == null ? void 0 : h.getState) == null ? void 0 : H.call(h), g = Number((ne = f == null ? void 0 : f.nowPlaying) == null ? void 0 : ne.tokenId);
    return Date.now() - Ce < 2e4 && !Number.isSafeInteger(g) ? !0 : g !== te ? (le = !1, !1) : !0;
  };
  function Me() {
    const a = window.XtrataRadio;
    if (!(te === null || !(a != null && a.playToken))) {
      le = !0, Ce = Date.now(), l.holdFirstPlay(), We(l.snapshot());
      try {
        a.playToken(te);
      } catch {
        le = !1;
      }
    }
  }
  const Pe = () => {
    var h, H;
    if (!le || te === null) return null;
    const a = (H = (h = window.XtrataRadio) == null ? void 0 : h.getState) == null ? void 0 : H.call(h), f = a != null && a.nowPlaying && Number(a.nowPlaying.tokenId) === te ? a.nowPlaying : null, g = me.get(te);
    return { title: (f == null ? void 0 : f.title) || (g == null ? void 0 : g.title) || "", artist: (f == null ? void 0 : f.artist) || (g == null ? void 0 : g.artist) || "", art: `/radio/artwork?id=${te}`, playing: !!(a != null && a.playing) };
  }, Nt = B.on && T ? pL(T) : null, Sn = Date.now();
  let ct = !1, Yt = null, Et = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const R = () => {
    Et = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    We(l.snapshot());
  }, O = (a, f) => {
    var ne;
    if (!Nt || f || Et) return null;
    if (!a.gate || a.step === "loading" || (ct = !0), !ct) return Date.now() - Sn < 1e4 ? "checking" : null;
    if (!_(a) || w.active() && a.step !== "intro") return null;
    if (a.step === "intro" || a.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (a.step === "locked") return "back";
    const h = a.slot === 0 && !((ne = a.gift) != null && ne.player), H = h && !a.entries.some((ue) => ue.kind === "play");
    return a.step === "fund" && H ? a.depositPending ? "arriving" : "empty" : a.step === "ready" && h && (Yt === "landed" || Yt === "arriving" && (H || le)) ? "landed" : a.step === "loading" && Yt !== "checking" ? Yt : null;
  };
  let J = !1;
  function re(a, f, g = [], h) {
    if (!Nt) return;
    const H = h !== void 0 ? h : O(a, f);
    if (Yt = H, delete document.documentElement.dataset.noviceBoot, !H) {
      Nt.render(null, f);
      return;
    }
    const ne = [...g];
    H === "arriving" && a.arrival && ne.push(Ls(a.arrival)), a.step === "unsupported" ? ne.push($("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : a.error && ne.push($("p", a.error, "ppp-warn"));
    const ue = H === "gift" ? v.incomingStarter() : null;
    ue && te === null && !J && a.step === "intro" && !a.busy && !a.armed && !a.error && !Yn && (J = !0, l.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Nt.render({
      mode: H,
      status: ne,
      asking: !!a.busy || a.armed,
      busy: !!a.busy,
      canStart: (a.step === "intro" || a.step === "locked") && !Yn,
      plays: ue ? ue.plays : H === "landed" ? a.playsLeft : null,
      from: (ue == null ? void 0 : ue.from) ?? null,
      tier: ae,
      mystery: ce,
      spot: _t,
      installed: C,
      intro: ue && te !== null && a.step === "intro" ? { ready: !0 } : null,
      now: Pe(),
      albums: H === "landed" ? fn.map((xe) => ({ title: xe.title, by: xe.subtitle, cover: Yc(xe.cover), run: () => {
        R(), fr(xe, !0);
      } })) : [],
      claimNew: H === "back" ? p(a) : null,
      replaceOld: H === "back" ? d(a) : null,
      start: () => {
        ue && te !== null && Me(), l.create(y());
      },
      unlock: () => void l.unlock(),
      returning: () => void l.unlock(!0),
      restock: () => Te(),
      full: () => {
        var St, it, Ve;
        const xe = window.XtrataRadio, Ee = H === "landed" && !((it = (St = xe == null ? void 0 : xe.getState) == null ? void 0 : St.call(xe)) != null && it.playing);
        le = !1, R(), Ee && ((Ve = xe == null ? void 0 : xe.playPause) == null || Ve.call(xe));
      }
    });
  }
  Nt && setTimeout(() => {
    ct || We(l.snapshot());
  }, 10100), vh(() => {
    (Nt != null && Nt.showing() || document.documentElement.dataset.asking || ie.wantsArt()) && We(l.snapshot());
  });
  const ut = cC({
    input: () => {
      var H, ne, ue, xe;
      const a = l.snapshot();
      if (!["fund", "ready", "over"].includes(a.step)) return null;
      const f = a.slot === 0 ? { address: a.listening, balance: a.balance } : { address: a.root, balance: (H = a.likeFunds) == null ? void 0 : H.balance };
      if (!f.address) return null;
      const g = a.slot === 0 ? a.entries : [], h = g.filter((Ee) => Ee.kind === "play" && Ee.status === "confirmed");
      return {
        playsLeft: f.balance === void 0 ? null : $e(f.balance),
        balance: f.balance,
        incoming: 0n,
        fee: BigInt(((ne = a.gate) == null ? void 0 : ne.limits.playFee) ?? "300"),
        address: f.address,
        switches: ((ue = a.gate) == null ? void 0 : ue.restock) ?? {},
        backedUp: a.backedUp,
        done: h.length ? { plays: h.length, artists: new Set(h.map((Ee) => Ee.recipient)).size, likes: g.filter((Ee) => Ee.kind === "like" && Ee.status === "confirmed" && Ee.liked).length } : null,
        arriving: a.slot === 0 ? a.depositPending : !!((xe = a.likeFunds) != null && xe.pending)
      };
    },
    copyButton: (a, f, g, h) => ir(a, f, g, h, () => {
      We(l.snapshot());
    })
  }), Te = () => {
    if (!l.snapshot().unproven) {
      ut.open();
      return;
    }
    l.prove().then((a) => {
      a && ut.open();
    });
  }, Ue = document.getElementById("albumList"), bt = Ue ? Dg(Ue, P, { list: !0 }) : null, Re = "xtrata.radio.album.last.v1", Ae = () => {
    try {
      const a = JSON.parse(localStorage.getItem(Re) || "null");
      return a && typeof a.root == "string" && Number.isSafeInteger(a.slot) && a.slot > 0 && a.player && Array.isArray(a.player.tracks) ? a : null;
    } catch {
      return null;
    }
  };
  let qe = "";
  const Xe = (a) => {
    const f = JSON.stringify(a);
    if (f !== qe) {
      qe = f;
      try {
        localStorage.setItem(Re, f);
      } catch {
      }
    }
  };
  let ze = null;
  window.XtrataRadioLikeHandler = (a) => {
    var g;
    if (!a || !Number.isSafeInteger(a.song) || a.song < 0) return !1;
    (g = l.snapshot().likeFunds) != null && g.album && (U = !0), jn();
    const f = In(a.song, { title: a.title, artist: a.artist });
    return l.heart({ song: a.song, title: f.title || void 0, artist: f.artist || void 0, likedBy: Array.isArray(a.likedBy) ? a.likedBy : void 0 });
  };
  let Ut;
  window.XtrataRadioListeningIdentity = () => {
    const a = l.snapshot();
    return a.solo && a.step !== "off" && a.step !== "elsewhere" ? a.listening : void 0;
  };
  const dn = (a) => {
    var g, h;
    const f = window.XtrataRadioListeningIdentity();
    f !== Ut && (Ut = f, (h = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || h.call(g));
  };
  let fn = [], Fn = 0, kt = !1, an = null;
  const Sr = (a) => {
    var f, g;
    kt || !((g = (f = a.gate) == null ? void 0 : f.gifts) != null && g.enabled) || Date.now() - Fn < 6e4 || (Fn = Date.now(), c("/radio/gift/featured").then((h) => {
      fn = (Array.isArray(h == null ? void 0 : h.players) ? h.players : []).filter((H) => H && typeof H.id == "string" && typeof H.title == "string" && Array.isArray(H.tracks) && H.tracks.length > 0).slice(0, 6), kt = !0, fn.length && We(l.snapshot());
    }).catch(() => {
    }));
  }, Ur = (a) => {
    var f;
    return an && a.slot === 0 && !((f = a.gift) != null && f.player) && ["ready", "fund", "loading"].includes(a.step) ? an : null;
  }, fr = (a, f = !1) => {
    var h, H;
    an = a, We(l.snapshot());
    const g = a && f ? Nr(a)[0] : null;
    g && ((H = (h = window.XtrataRadio) == null ? void 0 : h.playToken) == null || H.call(h, g.id));
  };
  let wt = of(), hn = null;
  const Ot = (a) => {
    const f = B.preview && !Yn && a.step === "intro" ? v.incomingAlbum() : null;
    return f ? (wt = qu(wt, { kind: "offer", album: f.player.id, already: Ub(L).includes(f.player.id) }), Hc(wt) ? f.player : null) : (wt = qu(wt, { kind: "withdraw" }), null);
  }, pn = (a) => {
    const f = wt.phase;
    wt = qu(wt, a), wt.phase !== f && (wt.album && (wt.phase === "playing" || wt.phase === "done") && QL(L, wt.album), We(l.snapshot()));
  };
  setInterval(() => {
    wt.phase === "playing" && pn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let At = "", Rt, Or = !1, rs = !1;
  const k = (a, f) => {
    var Ge, Be, Ct, zn, Jn, Cs, us, gi;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const h = f.depositPending && a.step === "fund" && ((Ge = a.giftStop) == null ? void 0 : Ge.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : a.giftStop, H = hn, ne = je(a), ue = h ? _(a) ? qL(h.reason, h.text) : h.text : null, xe = H || ne ? null : ue ?? (t && (!((Be = a.gate) != null && Be.here) || a.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    xe && xe !== Rt && (g.setGiftStop(xe), Rt = xe);
    const Ee = a.step === "off" || a.step === "elsewhere" ? null : ((Ct = a.gift) == null ? void 0 : Ct.player) ?? H ?? Ur(a) ?? null, St = Ee ? Ee.id + ":" + Ee.cover + ":" + Ee.tracks.map((Pn) => Pn.id).join(",") : "";
    St !== At && (g.setGiftPlayer(Ee ? { id: Ee.id, title: Ee.title, subtitle: Ee.subtitle, tracks: Nr(Ee).map((Pn) => Pn.id), hidden: ((zn = DI(Ee)) == null ? void 0 : zn.id) ?? null, cover: Ee.cover } : null), At = St), xe !== Rt && (g.setGiftStop(xe), Rt = xe);
    const it = !ne && (h == null ? void 0 : h.reason) === "arriving";
    it !== rs && ((Jn = g.setGiftWait) == null || Jn.call(g, it), rs = it);
    const Ve = !!Ee && (!!H || !!((Cs = a.albumLock) != null && Cs.locked));
    Ve !== Or && ((us = g.setGiftLock) == null || us.call(g, Ve), Or = Ve), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(a.step) && ((gi = g.forgetWallets) == null || gi.call(g));
  };
  let U = !1;
  const G = /* @__PURE__ */ new Map(), D = (a) => {
    if (!(a.step === "fund" && !a.depositPending && !!a.gift && !!a.listening && a.balance === 0n && !a.entries.some((h) => h.kind === "play") && (a.brandNew || a.createdHere))) return null;
    let g = G.get(a.listening);
    return g === void 0 && (g = Date.now(), G.set(a.listening, g)), Date.now() - g < vl ? g : null;
  }, W = (a) => a.step === "fund" && !a.depositPending && !!a.gift && a.balance === 0n && !a.entries.some((f) => f.kind === "play") && !!a.listening && G.has(a.listening), Q = (a) => a ? a.slice(0, 6) + "…" + a.slice(-4) : "", $e = (a) => {
    const f = l.snapshot().playCost || 350n;
    return a > nn ? Number((a - nn) / f) : 0;
  }, Se = (a) => (Number(a) / 1e6).toFixed(a < 1000n ? 6 : 4), He = (a) => {
    const f = Math.round((Date.now() - a) / 6e4);
    return f < 1 ? "now" : f < 60 ? `${f}m` : f < 1440 ? `${Math.round(f / 60)}h` : `${Math.round(f / 1440)}d`;
  }, dt = (a) => `https://explorer.hiro.so/txid/${a}?chain=mainnet`, $ = (a, f = "", g = "") => {
    const h = document.createElement(a);
    return f && (h.textContent = f), g && (h.className = g), h;
  }, he = (a, f, g = "") => {
    const h = $("button", a, g);
    return h.type = "button", h.onclick = f, h;
  }, Fe = (a, f) => {
    const g = $("a", a);
    return g.href = f, g.target = "_blank", g.rel = "noopener", g;
  };
  let lt = null, zt = location.hash === "#give";
  zt && history.replaceState(null, "", location.pathname + location.search);
  let Ht = !1;
  const cn = kI((a) => EI({ address: a, network: "mainnet" }), () => We(l.snapshot())), pt = (a) => cn.get(a), Yn = jL(navigator.userAgent), Hr = (a, f) => {
    const g = navigator.userAgent, h = zL(g), H = `${location.origin}${location.pathname}${f ? `#gift=${f}` : ""}`, ne = [$("p", `You are in ${a}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your ${B.on ? "player" : "listening wallet"}${f ? B.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], ue = $("div", "", "ppp-open-row"), xe = RL(H, g);
    if (xe) {
      const Ee = $("a", `Open in ${h}`, "primary ppp-open-in");
      Ee.href = xe, Ee.dataset.homeAction = "radio:open-in-browser", ue.append(Ee);
    }
    return ue.append(ir("copy-page-link", "Copy link", () => H, xe ? "" : "primary", () => We(l.snapshot()))), ne.push(ue, $("p", `If that does not open ${h}, use ${a}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), ne;
  }, be = (a) => pt(a) ?? Q(a), qt = (a) => a.slice(0, 2).map(be).join(" and ") + (a.length > 2 ? ` and ${a.length - 2} more` : ""), ho = /* @__PURE__ */ new Map();
  let qn = !1;
  const po = (a) => !a || /^(?:Inscription )?#\d+$/.test(a.trim()), jn = () => {
    qn || (qn = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((a) => a.ok ? a.json() : null).then((a) => {
      for (const f of Array.isArray(a == null ? void 0 : a.tracks) ? a.tracks : []) {
        const g = Number(f == null ? void 0 : f.id);
        Number.isSafeInteger(g) && ho.set(g, { title: typeof f.title == "string" ? f.title : void 0, artist: typeof f.artist == "string" ? f.artist : void 0 });
      }
      We(l.snapshot());
    }).catch(() => {
      qn = !1;
    }));
  }, In = (a, f) => {
    const g = ho.get(a), h = Ag(a, [g == null ? void 0 : g.title, f == null ? void 0 : f.title].find((ne) => !po(ne)) || ""), H = Sg(a, (g == null ? void 0 : g.artist) || (f == null ? void 0 : f.artist) || "");
    return { title: h, artist: H };
  }, gn = (a) => {
    const { title: f, artist: g } = In(a.song, a);
    return f ? `“${f}”${g ? ` — ${g}` : ""}` : `Song #${a.song}${g ? ` — ${g}` : ""}`;
  }, Es = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, go = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function li(a) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(a.step) ? ["", ""] : a.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : a.step === "over" ? ["TOO MUCH", "bad"] : a.step === "locked" ? ["LOCKED", "mute"] : a.step === "intro" || a.step === "link" ? ["", ""] : a.step === "fund" ? a.depositPending ? ["ON ITS WAY", "warn"] : a.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : a.payingOn && a.session && a.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Ln(a, f, g = "", h) {
    const H = $("dt", a), ne = $("dd", f, g);
    return h && ne.append(" ", h), [H, ne];
  }
  const Wn = document.getElementById("ppp-top"), ss = () => {
    (s.hidden || s.classList.contains("ppp-frame--rest") ? e : s).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Dr = () => {
    var f;
    const a = window.XtrataRadioConnectStacks;
    a ? a() : (f = document.getElementById("radio-wallet-connect")) == null || f.click();
  }, Rn = () => {
    var f, g;
    const a = l.snapshot();
    if (a.step === "connect" || a.step === "wrong-wallet") {
      Dr();
      return;
    }
    if (a.step === "elsewhere" && ((f = a.gate) != null && f.radioUrl)) {
      location.href = a.gate.radioUrl;
      return;
    }
    if (a.step === "locked" && !a.armed && !a.busy && l.unlock(), a.step === "ready" && ((g = a.giftStop) == null ? void 0 : g.reason) === "off" && !a.busy && l.switchOn(), a.step === "fund" && a.solo && !a.depositPending && !a.busy) {
      Te();
      return;
    }
    ss();
  };
  Wn && (Wn.onclick = Rn);
  const yo = (a, f, g, h = "") => a.standIn && !a.mainConnected ? he(`Connect ${be(a.standIn)} to add STX`, Dr, h) : he(f, g, h), wo = (a) => {
    l.useLinked(a).then(() => ss());
  };
  let os = null;
  const ks = () => {
    const a = zg(l.snapshot(), be);
    return a.length ? os || (os = new Promise((f) => {
      var it;
      const g = $("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const H = (Ve) => {
        h = Ve, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), os = null, f(h);
      }), g.addEventListener("click", (Ve) => {
        Ve.target === g && H(null);
      });
      const ne = (Ve, Ge, Be, Ct, zn = !1) => {
        const Jn = $("button", "", "ppp-connect__opt " + Be);
        return Jn.type = "button", Jn.disabled = zn, Jn.onclick = Ct, Jn.append($("b", Ve), $("span", Ge)), Jn;
      }, ue = $("h2", "Connect", "ppp-connect__title");
      ue.id = "ppp-connect-title";
      const xe = a.map((Ve) => ne(Ve.label, Ve.detail, "is-music", () => {
        if (H("music"), Ve.action === "linked" && Ve.main) {
          wo(Ve.main);
          return;
        }
        const Ge = zg(l.snapshot(), be).find((Be) => Be.action !== "linked");
        (Ge == null ? void 0 : Ge.action) === "create" ? l.create() : (Ge == null ? void 0 : Ge.action) === "unlock" && l.unlock(), ss();
      }, !!Ve.disabled)), Ee = ne("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => H("stacks")), St = he("Cancel", () => H(null), "quiet ppp-connect__cancel");
      g.append(ue, ...xe, Ee, St), document.body.appendChild(g), g.showModal(), (it = xe.find((Ve) => !Ve.disabled)) == null || it.focus();
    }), os) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = ks;
  function is(a) {
    if (!Wn) return;
    const f = (h, H, ne) => {
      Wn.hidden = !1, Wn.className = "ppp-top" + (H ? " is-" + H : ""), Wn.replaceChildren($("span", "", "dot"), document.createTextNode(h)), Wn.title = ne;
    }, g = a.session ? Math.min(a.session.playsLeft, a.playsLeft) : 0;
    switch (a.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Wn.hidden = !0;
        return;
      case "elsewhere":
        return f("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Wn.hidden = !0;
        return;
      case "intro":
        return f("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return f(`Connect ${be(a.linked)}`, "warn", `This device's listening wallet belongs to ${be(a.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return f("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return f("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return a.depositPending ? f("Plays on their way", "quiet", "Plays start by themselves when they land") : f(a.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return f("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return f("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return a.payingOn && g > 0 && !a.giftStop ? f(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : f("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const on = document.getElementById("pppNudge"), as = document.getElementById("onair");
  (S = on == null ? void 0 : on.querySelector("button")) == null || S.addEventListener("click", () => Rn());
  const ui = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, mo = {
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
  function di(a) {
    if (a.step === "loading") return;
    const f = a.session ? Math.min(a.session.playsLeft, a.playsLeft) : 0, g = a.step === "ready" && a.payingOn && f > 0 && !a.giftStop, h = a.step === "fund" && a.depositPending, H = a.step === "elsewhere" && !t, ne = g || h || H ? "" : ui[a.step] ?? "", ue = g ? "on" : H ? "free" : ne ? "off" : "";
    ue ? document.documentElement.dataset.ppp = ue : delete document.documentElement.dataset.ppp, as && (as.hidden = !ue || ue === "free", as.querySelector(".onair-sub").textContent = g ? `${f.toLocaleString()} plays left` : "Plays off"), on && (on.hidden = ue !== "off" && ue !== "free", on.classList.toggle("is-free", ue === "free"), ue === "free" ? (on.querySelector(".nudge-t").textContent = "You’re on the free player", on.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", on.querySelector("button").textContent = "Get a player") : ue === "off" && (on.querySelector(".nudge-t").textContent = ne, on.querySelector(".nudge-s").textContent = _(a) ? a.step === "intro" ? ZL : "" : "This radio requires a funded listening wallet with music support on.", on.querySelector("button").textContent = mo[a.step] ?? "Start"));
  }
  let cs = "";
  function $s(a) {
    const f = $("div", "", "ppp-pick");
    a.funderMultiple && a.returnToKind === "funder" && f.append($("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), a.returnToKind === "funder" && f.append($("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = $("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = cs, g.oninput = () => {
      cs = g.value;
    };
    const h = he(a.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      l.setReturnAddress(g.value), cs = "";
    }, "tiny");
    return f.append(g, " ", h), a.returnToKind === "chosen" && f.append(" ", he("Back to the funder", () => l.clearReturnAddress(), "tiny")), f;
  }
  const Is = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function aa() {
    const a = $("p", Is + " ", "ppp-mute");
    return a.append(Fe("Xverse", "https://www.xverse.app/download"), " · ", Fe("Leather", "https://leather.io/install-extension")), a;
  }
  let fi = "";
  const Fr = (a) => {
    const f = document.documentElement, g = a.solo && !a.main ? a.listening ? Q(a.listening) : "new" : "", h = X5() ? "1" : "", H = a.standIn && !a.mainConnected ? be(a.standIn) : "";
    `${g}|${h}|${H}` !== fi && (fi = `${g}|${h}|${H}`, g ? f.dataset.pppSolo = g : delete f.dataset.pppSolo, H ? f.dataset.pppAs = H : delete f.dataset.pppAs, h ? f.dataset.pppWalletInstalled = h : delete f.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const a of [1500, 4e3, 9e3]) setTimeout(() => We(l.snapshot()), a);
  function hr(a, f = "") {
    const g = $("div", "", "ppp-topup"), h = Gt(a);
    g.append($("span", "Add plays from My player: ", "ppp-mute"));
    for (const H of Xc) {
      const ne = he(`+${H.toLocaleString()}`, () => void l.topUpAlbum(H), f);
      ne.disabled = h === void 0 || h < H || a.depositPending || !!a.busy, g.append(ne);
    }
    return h !== void 0 && h < Xc[0] && g.append($("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const Gt = (a) => {
    var h;
    const f = (h = a.likeFunds) == null ? void 0 : h.balance;
    if (f === void 0 || !a.playCost) return;
    const g = f - nn - 6000n;
    return g > 0n ? Number(g / a.playCost) : 0;
  };
  function vr(a) {
    const f = a.likeFunds;
    if (!f || !f.album || !f.low && !f.pending) return [];
    if (f.low || (U = !1), f.low && !U) return [];
    const g = $("div", "", "ppp-pick ppp-lowbox");
    if (!f.low) {
      if (!f.txid) return [];
      const H = $("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return f.txid && H.append(Fe("View", dt(f.txid))), g.append(H), [g];
    }
    g.append($("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append($("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append($("p", f.address, "ppp-addr-full"));
    const h = $("div", "", "ppp-open-row");
    if (h.append(ir("copy-likes-address", "Copy address", () => f.address, "primary", () => We(l.snapshot()))), f.main && !a.solo) {
      const H = ws - (f.balance ?? 0n);
      H > 0n && h.append(yo(a, `Pay ${Ir(H)} STX from my wallet`, () => void l.topUpLikes(), "primary"));
    }
    return g.append(h), g.append($("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const Ls = (a) => {
    const f = $("div", "", "ppp-wait");
    f.dataset.since = String(a.since), f.dataset.grace = String(a.graceMs), f.setAttribute("role", "progressbar"), f.setAttribute("aria-label", "Your plays are arriving");
    const g = $("p", "", "ppp-wait-t"), h = $("div", "", "ppp-wait-track");
    return h.append($("div", "", "ppp-wait-fill")), f.append(g, h), ls(f), f;
  };
  function ls(a) {
    const f = Number(a.dataset.since), g = Number(a.dataset.grace) || 6e4, h = Math.max(0, Date.now() - f), H = a.querySelector(".ppp-wait-fill"), ne = a.querySelector(".ppp-wait-t");
    if (h < g) {
      const ue = Math.ceil((g - h) / 1e3);
      H.style.width = Math.max(4, Math.min(95, h / g * 100)).toFixed(0) + "%", ne.textContent = `Loading your plays · ${ue}s`, a.classList.remove("is-long"), a.setAttribute("aria-valuenow", String(Math.round(h / g * 100)));
    } else
      H.style.width = "", ne.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", a.classList.add("is-long"), a.removeAttribute("aria-valuenow");
  }
  let bo = 0;
  setInterval(() => {
    const a = document.querySelectorAll(".ppp-wait");
    if (!a.length) {
      bo = 0;
      return;
    }
    a.forEach(ls), ++bo % 10 === 0 && We(l.snapshot());
  }, 1e3);
  let xo = null;
  function So(a) {
    if (a.step === "loading" && xo !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(a.step) || !!a.busy || a.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(a.step);
    g !== xo && (xo = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function We(a) {
    var Ph, _h, Uh, Oh, Hh, Dh, Fh, jh, Rh, zh, Gh, Kh, Vh, Xh, Yh, qh, Wh, Zh;
    if (ie.sync(), ze && ["ready", "fund", "over"].includes(a.step) && !a.busy) {
      const q = ze;
      ze = null, a.root === q.root && a.slot !== q.slot && l.openAlbum(q.slot);
    }
    const f = v.inProgress(a), g = D(a), h = f && a.step === "fund" ? { ...a, depositPending: !0 } : g !== null ? { ...a, depositPending: !0, arrival: { since: g, graceMs: vl } } : a, H = h.error === Al;
    if (dn(), Sr(a), Ke(a), hn = Ot(a), k(a, h), So(h), Fr(h), !f && v.inProgress(a)) return;
    if (is(h), di(h), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? B.on ? JL : "Checking your listening wallet…" : B.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = h.step === "off", e.hidden) {
      re(h, !1);
      return;
    }
    const [ne, ue] = li(h), xe = o(".ppp-state");
    xe.textContent = ne, xe.className = "ppp-state" + (ue ? " ppp-state--" + ue : ""), xe.hidden = !ne;
    const Ee = !!h.busy || h.armed, St = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (Ee || !["intro", "loading"].includes(h.step));
    s.hidden = !St, s.classList.toggle("ppp-frame--rest", !Ee && !Ht);
    const it = o(".ppp-frame-label");
    it.hidden = !0;
    const Ve = z5(h) ?? lt;
    lt = Ve;
    const Ge = "xtrata.radio.ppp.heard.v1", Be = (() => {
      try {
        return localStorage.getItem(Ge) === "1";
      } catch {
        return !1;
      }
    })();
    if (!Be && h.entries.some((q) => q.kind === "play"))
      try {
        localStorage.setItem(Ge, "1");
      } catch {
      }
    const Ct = Be || h.slot > 0 && ((((Ph = h.likeFunds) == null ? void 0 : Ph.balance) ?? 0n) > 0n || x.count() > 1), zn = _(h), Jn = !zn && K5({ ...h, heard: Ct }, Ve);
    o(".ppp-badge").hidden = !Jn;
    const Cs = o(".ppp-steps"), us = o(".ppp-stage");
    Cs.hidden = us.hidden = !Jn, Ve && Jn && (Cs.replaceChildren(...tf(h.solo).map((q, de) => {
      const De = $("li", "", de < Ve.at ? "done" : de === Ve.at ? Ve.blocked ? "now blocked" : "now" : "");
      return De.append($("span", de < Ve.at ? "✓" : String(de + 1), "n"), q), de === Ve.at && De.setAttribute("aria-current", "step"), De;
    })), us.textContent = Ve.caption, us.className = "ppp-stage " + (Ve.at >= tf(h.solo).length ? "ppp-ok" : Ve.blocked ? "ppp-bad" : "ppp-cyan"));
    const gi = o(".ppp-facts"), Pn = [];
    h.main && ((_h = h.gate) != null && _h.here) && !h.solo && Pn.push(...Ln("Your wallet", be(h.main), "ppp-addr-short"));
    const $h = () => {
      if (!h.listening) return;
      const q = ir("copy-listening", "Copy", () => h.listening || "", "tiny", () => We(l.snapshot()));
      Pn.push(...Ln(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", Q(h.listening), "ppp-addr-short", q));
    };
    if (h.linked || $h(), h.listening && h.step !== "intro")
      if (h.linked)
        Pn.push(...Ln("Credited to", `${be(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), $h();
      else if (h.solo) {
        h.creditedTo && Pn.push(...Ln("Credited to", `${be(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${be(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Pn.push(...Ln("Returns go to", h.gift ? q : h.returnTo && !pt(h.returnTo) ? q.replace(Q(h.returnTo), h.returnTo) : q, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Pn.push(...Ln("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((Uh = h.gate) != null && Uh.here)) {
      const q = h.linkedListening.map((de) => Q(de) + (de === h.listening ? " (this one)" : "")).join(", ");
      Pn.push(...Ln(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const q = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Pn.push(...Ln("Balance", `${Ir(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, q));
    }
    const la = h.entries.find((q) => q.kind === "play");
    la && jn(), la && Pn.push(...Ln("Last paid song", `${gn(la)} → ${be(la.recipient)}`, Es[la.status] || "")), gi.replaceChildren(...Pn), gi.hidden = !Pn.length;
    const Oe = [], $t = [], Mt = [], Qn = [], Ih = Nn(BigInt(((Oh = h.gate) == null ? void 0 : Oh.limits.playFee) ?? "300")), Lh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Ir(xl)} STX to the song holder, plus a ${Ir(Ih - xl)} STX network fee.`, Ch = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (Oe.push($("p", "Pay artists as you listen.")), (Hh = h.gate) != null && Hh.radioUrl) {
          const de = $("p");
          de.append(Fe("Open the pay-per-play radio →", h.gate.radioUrl)), Oe.push(de);
        }
        $t.push($("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const de = [h.linked, ...h.others];
          Oe.push($("p", de.length > 1 ? `This device has listening wallets for ${qt(de)}.` : `This device has a listening wallet for ${be(h.linked)}.`)), $t.push($("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), de.slice(0, 3).forEach((De, gt) => Mt.push(he(`Open ${be(De)}`, () => wo(De), gt === 0 ? "primary" : "")));
        } else
          Oe.push($("p", "Connect your wallet to pay artists as you listen.")), $t.push($("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        Oe.push($("p", `This device's listening wallet belongs to ${be(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), $t.push($("p", `You are connected as ${be(h.main)}. Switch to the linked wallet to continue listening.`)), $t.push($("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Mt.push(he("Switch wallet", Dr, "primary"));
        break;
      case "not-invited":
        Oe.push($("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        Oe.push($("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Oe.push($("p", "Every play counts for the song’s owner, on-chain.")), $t.push($("p", Lh)), $t.push($("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), $t.push($("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (Oe.push($("p", `This device already has a listening wallet for ${qt(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), $t.push($("p", `Otherwise, set up a new listening wallet for ${be(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && $t.push($("p", `This is the listening wallet for ${be(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && $t.push($("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = v.liveGift();
        Mt.push(he(q ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${be(h.main)}` : "Start listening", () => void l.create(w.claiming() ? { another: !0 } : void 0), "primary")), !q && !h.solo && h.main && h.others.length && Mt.push(he("Switch wallet", Dr)), !q && h.solo && Mt.push(he("I have a Stacks wallet", Dr)), Mt.push(he("I already have a listening wallet", () => void l.unlock(!0))), q && Mt.push(he("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (Oe.push($("p", "Locked.", "ppp-mute")), Mt.push(he("Unlock", () => void l.unlock(), "primary"))), h.standIn ? Qn.push(he("Use a different listening wallet", () => void ks().then((de) => {
          de === "stacks" && Dr();
        }), "quiet")) : Qn.push(he("Use a different listening wallet", () => void l.unlock(!0), "quiet"));
        break;
      case "link":
        Oe.push($("p", `Link to ${be(h.main)} · free`)), $t.push($("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), $t.push($("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Mt.push(he(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void l.link(), "primary"));
        break;
      case "loading":
        Oe.push($("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && Oe.push(Ls(h.arrival)) : W(h) ? Oe.push($("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Dh = h.gift) != null && Dh.player ? Oe.push($("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? Oe.push($("p", "No plays left · add plays to keep counting", "ppp-bad")) : Oe.push($("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Ih)).toLocaleString()} plays`)), h.entries.length && $t.push($("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && $t.push($("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), f ? $t.push($("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? $t.push($("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? ($t.push($("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), $t.push($("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && Mt.push(ir("copy-address", "Copy my address", () => h.listening || "", "primary", () => We(l.snapshot())))) : $t.push($("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const de = $("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          de.append(Fe("View", dt(h.depositTxid))), Oe.push(de);
        } else h.allowance > 0n && !h.solo && !h.depositPending && Mt.push(yo(h, `Deposit ${Ir(h.allowance)} STX from my wallet`, () => void l.deposit(), "primary"));
        break;
      }
      case "over":
        Oe.push($("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.phrase && (Oe.push($("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), Mt.push(he("Back up my player · 24 words", () => void l.backup(), ""))), h.solo && !h.returnTo && (Oe.push($("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Oe.push($s(h))), (!h.solo || h.returnTo) && Mt.push(he("Return excess", () => void l.returnFunds("excess"), "primary"), he("Return all", () => void l.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((Fh = h.giftStop) == null ? void 0 : Fh.reason) !== "off") {
          const de = Math.min(h.session.playsLeft, h.playsLeft);
          Oe.push($("p", `${de.toLocaleString()} plays left`, "ppp-ok")), $t.push($("p", Lh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), Mt.push(he("Switch off", () => void l.switchOff()));
        } else
          Oe.push($("p", "Switch on music support to listen.", "ppp-mute")), Mt.push(he("Switch plays on", () => void l.switchOn(), "primary"));
        h.queued && Oe.push($("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && Oe.push($("p", "Running low on plays", "ppp-warn")), h.aboveTarget && Oe.push($("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), h.depositPending ? Oe.push($("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && Mt.push(yo(h, `Top up ${Ir(h.allowance)} STX`, () => void l.deposit()));
        break;
    }
    if (h.solo && h.listening && !h.depositPending) {
      const q = h.step === "fund", de = h.step === "ready" && (h.balanceState === "low" || !!h.gift && h.giftPlays <= 20);
      q ? Mt.unshift(he("Add plays", () => Te(), "primary")) : de ? Mt.push(he("Add plays", () => Te(), "primary")) : h.step === "ready" && Qn.push(he("Add plays", () => Te(), "quiet"));
    }
    if (h.solo && h.walletCannotSolo && $t.push($("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && $t.push($s(h)), $t.push(aa()), h.slot === 0 && h.step === "ready" && h.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = $("p", "New to Stacks? ", "ppp-mute");
      q.append(Fe("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Oe.push(q);
    }
    if (h.walletOutdated && $t.push($("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (Oe.push($("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Mt.push(he("Clear stuck payments", () => void l.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && Qn.push(he(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${be(h.returnTo)}`, () => void l.returnFunds("all"), "quiet")), h.slot > 0 && ((jh = h.gift) != null && jh.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && Qn.push(hr(h, "quiet")), h.phrase && ["ready", "fund", "over"].includes(h.step) && Qn.push(he(h.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void l.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && Qn.push(he("Lock", () => void l.lock(), "quiet")), St && !Ee && Qn.push(he(Ht ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Ht = !Ht, We(l.snapshot());
    }, "quiet")), [...Mt, ...Qn].forEach((q) => q.disabled = Ch), Ch && (Mt.length = 0), !zn && h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((Rh = h.gift) != null && Rh.player)) {
      const q = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", de = Oe.at(0);
      h.step === "ready" && de ? de.append($("span", ` · ${Se(h.balance)} STX`, q)) : Oe.push($("p", `Balance ${Se(h.balance)} STX`, q));
    }
    if (zn) {
      for (const De of [...Mt, ...Qn]) {
        const gt = XL[De.textContent ?? ""];
        gt && (De.textContent = gt);
      }
      for (let De = Oe.length - 1; De >= 0; De--) Kg(Oe[De].textContent) && $t.unshift(...Oe.splice(De, 1));
      for (let De = Mt.length - 1; De >= 0; De--) Kg(Mt[De].textContent) && Qn.unshift(...Mt.splice(De, 1));
      const q = h.entries.some((De) => De.kind === "play"), de = WL(h.step, { played: q, arriving: h.depositPending });
      de.length && Oe.length && de.shift(), Oe.push(...de.map((De) => $("p", De, "ppp-mute")));
    }
    if ((zh = h.gift) != null && zh.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const q = $("p", "", "ppp-gift");
      q.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && q.append(" · ", h.gift.player.subtitle);
      const de = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? $("span", " · plays on their way", "ppp-warn") : $("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      de && q.append(de);
      const De = (Gh = Oe.at(0)) == null ? void 0 : Gh.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && De && /STX/.test(De.textContent ?? "") && De.remove(), Oe.unshift(q), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          Oe.splice(1, 0, $("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), hr(h, "primary"));
        else {
          const gt = $("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          gt.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), gt.append(Fe("Xverse", "https://www.xverse.app/download"), " and ", Fe("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Oe.splice(1, 0, gt);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const q = h.returnPlan, de = $("div", "", "ppp-pick");
      de.append($("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const De = $("ul", "", "ppp-gift-list");
      q.steps.forEach((gt, Ar) => {
        const er = gt.kind === "gift" ? "the unused gift" : gt.kind === "deposit" ? "what was added to it" : "the rest", vn = $("li");
        vn.append($("span", `${Ar + 1}. ${Ir(BigInt(gt.send))} STX · ${er}`, "t"), $("span", gt.to ? ` → ${be(gt.to)}` : " → choose an address below", gt.to ? "ppp-mute" : "ppp-warn")), De.append(vn);
      }), de.append(De), q.kept && de.append($("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((gt) => !gt.to) && de.append($s(h)), de.append(he(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void l.returnFunds("all"), "primary")), Oe.push(de);
    }
    const Ts = hi(h), ds = A ? Ts : null, yi = O(h, !!ds), Hb = yi === "gift" || yi === "arriving" || yi === "new", ru = ds ? null : w.lines(a), su = ru && !w.claiming() ? ru : [...ru ?? [], ...v.banner(a, { bare: !!ds || yi === "gift" || yi === "arriving" })], Qa = Yn && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? Hr(Yn, v.pendingCode()) : [];
    ds || (Oe.unshift(...su), Oe.push(...vr(h)), Oe.unshift(...Qa)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && Oe.unshift($("p", `This is ${be(h.creditedTo)}'s listening wallet. Plays and likes count for ${be(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), o(".ppp-key").replaceChildren(...Oe);
    const ou = document.querySelector(".ppp-switch");
    if (ou) {
      const q = x.latest(), de = h.slot > 0, De = ["fund", "ready", "over"].includes(h.step) && (de || !!q);
      if (ou.hidden = !De, De) {
        const gt = (vn, nc, rc, du) => {
          const mi = he("", du, "ppp-tab");
          return mi.setAttribute("aria-pressed", String(rc)), mi.append($("span", vn, "tt"), $("span", nc === void 0 ? "…" : `${$e(nc).toLocaleString()} plays`, "ts")), mi.disabled = !!h.busy, mi;
        }, Ar = de ? ((Vh = (Kh = h.gift) == null ? void 0 : Kh.player) == null ? void 0 : Vh.title) ?? "Album" : q.title, er = he("View all albums" + (x.count() > 1 ? ` (${x.count()})` : ""), () => {
          const vn = document.querySelector(".ppp-shelf");
          vn && (vn.hidden = !1, vn.open = !vn.open, er.setAttribute("aria-expanded", String(vn.open)), vn.open && requestAnimationFrame(() => vn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        er.setAttribute("aria-expanded", String(!!((Xh = document.querySelector(".ppp-shelf")) != null && Xh.open))), ou.replaceChildren(
          gt("🎧 My player", de ? (Yh = h.likeFunds) == null ? void 0 : Yh.balance : h.balance, !de, () => {
            de && l.openAlbum(0);
          }),
          gt("💿 " + Ar, de ? h.balance : void 0, de, () => {
            !de && q && l.openAlbum(q.slot);
          }),
          er
        );
      }
    }
    const ec = x.render(h), tc = document.querySelector(".ppp-shelf");
    if (tc) {
      tc.hidden = !ec;
      const q = tc.querySelector("summary");
      q && (q.textContent = x.count() > 0 ? `♪ My albums (${x.count()})` : "♪ My albums");
      const de = tc.querySelector(".ppp-shelf-body");
      ec && de && !de.contains(ec) && de.replaceChildren(ec);
    }
    const ua = v.renderFold(a);
    if (o(".ppp-gifts").hidden = !ua, ua && !o(".ppp-gift-body").contains(ua) && o(".ppp-gift-body").replaceChildren(ua), ua && zt) {
      zt = !1;
      const q = o(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const iu = document.querySelector("#ppp .ppp-featured");
    if (iu) {
      const q = ee(), de = ie.manage(), De = (q.length > 0 || !!de) && h.slot === 0 && !((qh = h.gift) != null && qh.player) && h.step === "ready";
      iu.hidden = !De, De && iu.replaceChildren(...q.length ? [$("p", "Albums in your player", "ppp-featured__h")] : [], ...q.map((gt) => {
        const Ar = (an == null ? void 0 : an.id) === gt.id, er = he("", () => fr(Ar ? null : gt, !Ar), "ppp-featured__a" + (Ar ? " is-on" : "")), vn = Nr(gt).length;
        return er.append($("b", gt.title), $("span", Ar ? "Playing now · tap to go back to the radio" : `${gt.subtitle ? gt.subtitle + " · " : ""}${vn} ${vn === 1 ? "song" : "songs"}`)), er.setAttribute("aria-pressed", String(Ar)), er.disabled = !!h.busy, er;
      }), ...de ? [de] : []);
    }
    const au = document.querySelector("#ppp .ppp-release-in-slot");
    if (au) {
      const q = ["off", "elsewhere", "unsupported"].includes(h.step) ? [] : ie.banner();
      au.hidden = !q.length, au.replaceChildren(...q);
    }
    const wi = document.querySelector("#ppp .ppp-release");
    if (wi) {
      const q = ["off", "elsewhere", "unsupported"].includes(h.step) ? null : ie.fold();
      if (wi.hidden = !q, q) {
        const de = document.activeElement instanceof HTMLElement && wi.contains(document.activeElement) ? document.activeElement : null, De = ((Wh = wi.querySelector(".ppp-release-songs")) == null ? void 0 : Wh.scrollTop) ?? 0;
        (Zh = wi.querySelector(".ppp-release-body")) == null || Zh.replaceChildren(...q);
        const gt = wi.querySelector(".ppp-release-songs");
        gt && De && (gt.scrollTop = De), de && de.isConnected && document.activeElement !== de && de.focus({ preventScroll: !0 });
      }
    }
    vo(h);
    const cu = document.querySelector("#ppp .ppp-yours");
    if (cu) {
      const q = h.solo && !!h.listening && h.slot === 0 && ["fund", "ready"].includes(h.step);
      cu.hidden = !q;
      const de = cu.querySelector(".ppp-yours-body");
      if (q && de && de.getAttribute("data-for") !== h.listening) {
        de.setAttribute("data-for", h.listening);
        const De = (du, ...mi) => {
          const Jh = $("details", "", "ppp-yours-item");
          return Jh.append($("summary", du), ...mi), Jh;
        }, gt = $("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        gt.append($("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Ar = $("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), er = $("p");
        er.append(Fe("Find a name at BNS One →", "https://bns.one"));
        const vn = $("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), nc = $("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), rc = $("p");
        rc.append(Fe("See the giveaway →", "https://xtrata.xyz/giveaway")), de.replaceChildren(
          De("Give your player a name", gt, Ar, $("p", h.listening, "ppp-addr-full"), ir("copy-yours-address", "Copy my player’s code", () => l.snapshot().listening || "", "tiny", () => We(l.snapshot())), er),
          De("Link it to a wallet you already have", vn),
          De("Bring a friend in", nc, rc)
        );
      }
    }
    o(".ppp-body").replaceChildren(...$t), o(".ppp-actions").replaceChildren(...Mt), o(".ppp-actions2").replaceChildren(...Qn);
    const lu = h.busy || h.message || "", Th = o(".ppp-msg"), uu = lu && Oe.some((q) => (q.textContent ?? "").startsWith(lu.replace(/[.✓\s]+$/, ""))) ? "" : lu, Bh = !uu && !h.error ? h.notice : H && !uu ? h.error : "";
    Th.textContent = uu || Bh, Th.classList.toggle("is-warn", !!Bh), o(".ppp-err").textContent = H ? "" : h.error;
    const Db = h.entries.filter((q) => q.kind === "play");
    o(".ppp-recent").hidden = !h.entries.length, o(".ppp-recent-list").replaceChildren(...Db.slice(0, 5).map((q) => {
      const de = $("li"), De = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return de.append($("span", "", "d " + De), $("span", gn(q), "t"), $("span", He(q.created), "ppp-mute")), q.txid && de.append(Fe("tx", dt(q.txid))), de;
    })), o(".ppp-wallets").hidden = !(gi.childElementCount || Qn.length), o(".ppp-more").hidden = !$t.length;
    const Nh = o(".ppp-history");
    Nh.hidden = !h.entries.length, h.entries.length && jn(), Nh.replaceChildren($("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((q) => {
      const de = $("div", "", "ppp-row"), De = q.kind === "play" ? [$("span", gn(q), "ppp-song"), $("span", ` · ${Ir(BigInt(q.amount))} STX to ${be(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [$("span", `${q.liked ? "♥ Liked" : "Unliked"} ${gn(q)}`, "ppp-song"), $("span", ` · for ${h.linked ? be(h.linked) : "this listening wallet"}`, "ppp-mute")] : [$("span", `Returned ${Ir(BigInt(q.amount))} STX`, "ppp-song"), $("span", ` to ${be(q.recipient)}`, "ppp-mute")];
      return de.append(
        $("span", go[q.status] || q.status, "ppp-status " + (Es[q.status] || "")),
        ...De,
        $("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && de.append(Fe("tx ↗", dt(q.txid))), de;
    })), K == null || K.render(ds ? b(h, ds, [...Qa, ...su]) : null), re(h, !!ds, Hb ? [...Qa, ...su] : Qa, yi), pi(h, !!ds || !!(Nt != null && Nt.showing())), Ao(h, ds), ut.isOpen() && ut.refresh(), ve();
    const Mh = (Ts == null ? void 0 : Ts.mode) === "open" ? null : Ur(h);
    bt == null || bt.render((Ts == null ? void 0 : Ts.mode) === "open" ? b(h, Ts, []) : Mh ? { ...b(h, { mode: "open", player: Mh }, []), plays: h.balance === void 0 ? null : h.playsLeft } : null);
  }
  function hi(a) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(a.step)) return null;
    if (a.slot > 0 && ((h = a.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(a.step))
      return a.root && Xe({ root: a.root, slot: a.slot, player: a.gift.player }), { mode: "open", player: a.gift.player };
    const f = v.incomingAlbum();
    if (f) return { mode: "arrive", player: f.player, from: f.from, offered: f.plays };
    const g = Ae();
    return g && (a.step === "locked" || ze && a.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const Zn = (a, f, g, h, H) => `/awards/${a.id}#${new URLSearchParams({ n: String(f), a: g, ...H ? { b: H } : {}, p: String(h), s: Xg(fg, f, g) })}`;
  function ca(a) {
    const f = a.award;
    return !f || !["ready", "fund", "over", "link"].includes(a.step) ? null : f.claimTx ? N ? "making" : null : f.state === "claimed" ? N && f.inscription !== void 0 ? "yours" : null : f.state !== "ready" || M || a.step === "link" && I !== "have" ? null : I === "making" || I === "yours" ? "ready" : I;
  }
  function pi(a, f) {
    if (!X) return;
    const g = a.award, h = g != null && g.cls && Pc(g.cls) ? Mo(g.cls) : null, H = a.slot === 0 ? a.listening : a.root, ne = f || !g || !h || !H || g.number === void 0 ? null : ca(a);
    if (!ne || !g || !h || !H) {
      X.render(null, f);
      return;
    }
    ne === "have" && a.linked && !Y && (Y = !0, l.awardRefresh());
    const ue = typeof g.name == "string" && g.name ? g.name : null, xe = [];
    a.error && xe.push($("p", a.error, "ppp-warn"));
    const Ee = (St) => {
      I = St, St === "name" && (N = !0), We(l.snapshot());
    };
    X.render({
      screen: ne,
      tier: h,
      number: g.number,
      need: g.need ?? 0,
      player: H,
      name: g.name,
      inscription: g.inscription,
      art: ne === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : Zn(h, g.number, H, g.need ?? 0, ue),
      claimLink: g.claimTx ? dt(g.claimTx) : void 0,
      status: xe,
      asking: !!a.busy || a.armed,
      busy: !!a.busy,
      main: a.main ? be(a.main) : null,
      canLink: a.step === "link",
      linked: !!a.linked,
      copyAddress: () => ir("award-player-address", "Copy my player’s address", () => H, "tiny", () => We(l.snapshot())),
      go: Ee,
      claim: (St) => {
        N = !0, l.claimAward(St);
      },
      refresh: () => void l.awardRefresh(),
      connect: () => {
        var St;
        return (St = document.getElementById("radio-wallet-connect")) == null ? void 0 : St.click();
      },
      link: () => void l.link(),
      later: () => {
        M = !0;
        try {
          localStorage.setItem(m, String(Date.now()));
        } catch {
        }
        We(l.snapshot());
      },
      done: () => {
        N = !1, I = "ready", We(l.snapshot());
      }
    }, f);
  }
  function vo(a) {
    var Ve;
    const f = document.querySelector("#ppp .ppp-award");
    if (!f) return;
    const g = a.award, h = a.slot === 0 ? a.listening : a.root, H = g != null && g.cls && Pc(g.cls) ? Mo(g.cls) : null, ne = !!g && !!H && !!h && ["ready", "fund", "over"].includes(a.step) && !(g.state === "unavailable" && g.number === void 0);
    if (f.hidden = !ne, !ne || !g || !H || !h) {
      f.replaceChildren();
      return;
    }
    const ue = JSON.stringify([g, h, !!a.busy]);
    if (f.getAttribute("data-sig") === ue) return;
    f.setAttribute("data-sig", ue);
    const xe = (Ge) => {
      const Be = $("p", "", "ppp-award__h");
      return Be.append($("b", `${H.mark} Music Hero award`), $("span", Ge)), Be;
    }, Ee = `No. ${String(g.number ?? 0).padStart(4, "0")}`, St = (Ge) => {
      const Be = $("div", "", "ppp-award__art"), Ct = document.createElement("iframe");
      return Ct.src = Ge, Ct.title = `${H.name} record`, Ct.setAttribute("sandbox", "allow-scripts"), Ct.setAttribute("loading", "lazy"), Be.append(Ct), Be;
    }, it = [];
    if (g.state === "claimed") {
      if (it.push(xe(`${H.name} record · ${Ee}`)), g.inscription !== void 0 && it.push(St(`/i/${g.inscription}`)), it.push($("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${H.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const Ge = $("p");
        Ge.append(Fe("Open it full screen ↗", `/i/${g.inscription}`)), it.push(Ge);
      }
      if (g.sendTx) {
        const Ge = $("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        Ge.append(Fe("View", dt(g.sendTx))), it.push(Ge);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const Ge = $("details", "", "ppp-award__send"), Be = document.createElement("input");
        Be.type = "text", Be.placeholder = "SP… address to send it to", Be.autocomplete = "off", Be.spellcheck = !1, Be.setAttribute("aria-label", "Address to send your record to");
        const Ct = he("Send my record…", () => void l.sendAward(Be.value), "");
        Ct.disabled = !!a.busy, Ge.append(
          $("summary", "Send this record to someone"),
          $("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          Be,
          Ct
        ), it.push(Ge);
      }
    } else if (g.claimTx) {
      it.push(xe(`${H.name} record · ${Ee}`));
      const Ge = $("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      Ge.append(Fe("View", dt(g.claimTx))), it.push(Ge);
    } else if (g.state === "ready") {
      it.push(xe(`${H.name} record · ${Ee}`));
      const Ge = typeof g.name == "string" && g.name ? g.name : null, Be = new URLSearchParams({ n: String(g.number), a: h, ...Ge ? { b: Ge } : {}, p: String(g.need), s: Xg(fg, g.number, h) });
      it.push(St(`/awards/${H.id}#${Be}`)), it.push($("p", `Your ${H.name} record is ready. You have paid artists for ${(Ve = g.need) == null ? void 0 : Ve.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Ct = $("div", "", "ppp-award__row");
      Ge ? (it.push($("p", `Its plaque will carry ${Ge} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Ct.append(he("Claim my record", () => {
        N = !0, l.claimAward("auto");
      }, "primary"), he("Use my address only", () => {
        N = !0, l.claimAward("none");
      }, "quiet"))) : g.name === null ? (it.push($("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Ct.append(he("Claim my record", () => {
        N = !0, l.claimAward("none");
      }, "primary"), he("Check for a name again", () => void l.awardRefresh(), "quiet"))) : (it.push($("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Ct.append(he("Check for a name again", () => void l.awardRefresh(), "primary"), he("Claim with my address only", () => void l.claimAward("none"), "quiet"))), Ct.querySelectorAll("button").forEach((zn) => {
        zn.disabled = !!a.busy;
      }), it.push(Ct, $("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      it.push(xe(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const Ge = $("div", "", "ppp-award__bar"), Be = document.createElement("i");
      Be.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, Ge.append(Be);
      const Ct = g.need - g.have;
      it.push(Ge, $("p", `${Ct.toLocaleString()} more ${Ct === 1 ? "play" : "plays"} and your ${H.name} record is yours to claim.`, "ppp-mute"));
    } else
      it.push(xe(`${H.name} record · ${Ee}`)), it.push($("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    f.replaceChildren(...it);
  }
  function Ao(a, f) {
    var xe;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!f && (X != null && X.showing()) && ((xe = a.award) != null && xe.cls) && Pc(a.award.cls) && (a.busy || a.armed)) {
      const Ee = Mo(a.award.cls), St = $("span", "", "ppp-skin__t");
      St.append($("b", `${Ee.name} record · No. ${String(a.award.number ?? 0).padStart(4, "0")}`), $("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren($("span", Ee.mark, "ppp-skin__art ppp-skin__art--none"), St);
      return;
    }
    const h = !!f && (!!a.busy || a.armed);
    if (g.hidden = !h, !h || !f) {
      g.replaceChildren();
      return;
    }
    const H = Yc(f.player.cover), ne = H ? $("img", "", "ppp-skin__art") : $("span", "♪", "ppp-skin__art ppp-skin__art--none");
    H && (ne.src = H, ne.alt = "");
    const ue = $("span", "", "ppp-skin__t");
    ue.append($("b", f.player.title), $("span", f.mode === "arrive" && f.from ? `A gift from ${f.from}` : f.player.subtitle || "Your album")), g.replaceChildren(ne, ue);
  }
  function b(a, f, g) {
    var Ee, St, it, Ve, Ge;
    const h = !!a.busy || a.armed, H = [...g];
    a.depositPending && a.arrival && H.push(Ls(a.arrival)), a.error ? H.push($("p", a.error, a.error === Al ? "ppp-warn" : "ppp-bad")) : a.message && !h ? H.push($("p", a.message, "ppp-cyan")) : a.notice && H.push($("p", a.notice, "ppp-warn")), f.mode === "open" && U && ((Ee = a.likeFunds) != null && Ee.album) && a.likeFunds.low && !a.likeFunds.pending && H.push($("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ne = "Kept on this device with Face ID or your passkey. No app or account needed.", ue = null, xe = null;
    if (f.mode === "locked")
      ue = { label: "Continue listening", run: () => {
        ze = Ae(), l.unlock();
      } }, xe = { label: "Use a different passkey", run: () => {
        ze = null, l.unlock(!0);
      } };
    else if (f.mode === "arrive")
      if (a.step === "intro" && Hc(wt) && wt.album === f.player.id) {
        const Be = window.XtrataRadio, Ct = Nr(f.player)[0], zn = wt.phase === "playing";
        ue = { label: zn && !!((it = (St = Be == null ? void 0 : Be.getState) == null ? void 0 : St.call(Be)) != null && it.playing) ? "Pause" : zn ? "Carry on" : "Play the first song", run: () => {
          var Cs, us;
          zn ? (Cs = Be == null ? void 0 : Be.playPause) == null || Cs.call(Be) : Ct && ((us = Be == null ? void 0 : Be.playToken) == null || us.call(Be, Ct.id));
        } }, xe = { label: "Make my player and hear it all", run: () => void l.create() }, ne = "The first song is free. Nothing to set up yet.";
      } else if (a.step === "intro") {
        const Be = wt.phase === "done" && wt.album === f.player.id;
        Be && !H.length && H.push($("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), ue = { label: Be ? "Keep listening" : "Open album", run: () => void l.create() }, xe = { label: "I've used Xtrata Music here before", run: () => void l.unlock(!0) };
      } else a.step === "locked" ? (ue = { label: "Open album", run: () => void l.unlock() }, xe = { label: "Use a different passkey", run: () => void l.unlock(!0) }) : a.step === "unsupported" ? H.push($("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : H.length || H.push($("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: f.mode,
      player: f.player,
      from: f.from,
      offered: f.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: f.mode === "arrive" && a.step === "intro" ? 1 : void 0,
      plays: f.mode === "open" ? a.balance === void 0 ? null : a.giftPlays : void 0,
      playsComing: a.depositPending,
      status: H,
      primary: ue,
      secondary: xe,
      hint: ue ? ne : void 0,
      asking: h,
      busy: !!a.busy,
      myPlays: Gt(a),
      topUps: Xc,
      canMake: !!((Ge = (Ve = a.gate) == null ? void 0 : Ve.gifts) != null && Ge.admin)
    };
  }
  const E = document.getElementById("findBox"), z = document.getElementById("findBody"), Z = E && z ? hC(z, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((a) => a.ok ? a.json() : Promise.reject(new Error("catalogue unavailable"))).then((a) => uC(a == null ? void 0 : a.tracks, (f, g) => ({ title: Ag(f, po(g.title) ? "" : g.title), artist: Sg(f, g.artist || "") }))),
    play: (a) => {
      var f, g;
      (g = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || g.call(f, a);
    },
    current: () => {
      var f, g, h, H;
      const a = Number((H = (h = (g = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : g.call(f)) == null ? void 0 : h.nowPlaying) == null ? void 0 : H.tokenId);
      return Number.isSafeInteger(a) ? a : null;
    },
    locked: () => {
      var a;
      return !!((a = l.snapshot().albumLock) != null && a.locked);
    },
    explicit: (a) => {
      var f, g;
      return !!((g = (f = window.XtrataRadio) == null ? void 0 : f.isExplicit) != null && g.call(f, a));
    },
    liked: (a) => V().has(a)
  }) : null;
  E == null || E.addEventListener("toggle", () => {
    E.open && (Z == null || Z.load());
  });
  let Ie = "";
  const V = () => {
    var f, g, h;
    const a = (h = (g = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : g.call(f)) == null ? void 0 : h.likes;
    return new Set(Array.isArray(a) ? a.map((H) => Number(H == null ? void 0 : H.tokenId)).filter(Number.isSafeInteger) : []);
  }, ve = () => {
    var f, g, h, H, ne;
    if (!Z || !(E != null && E.open)) return;
    const a = `${!!((f = l.snapshot().albumLock) != null && f.locked)}|${((ne = (H = (h = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : h.call(g)) == null ? void 0 : H.nowPlaying) == null ? void 0 : ne.tokenId) ?? ""}|${[...V()].sort((ue, xe) => ue - xe).join(",")}`;
    a !== Ie && (Ie = a, Z.refresh());
  }, me = /* @__PURE__ */ new Map();
  let Le = !1;
  const rt = () => {
    const a = window.XtrataRadio;
    return a != null && a.subscribe ? (a.subscribe((f) => {
      const g = f == null ? void 0 : f.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && me.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), ve(), le) {
        const h = `${(g == null ? void 0 : g.tokenId) ?? ""}|${!!(f != null && f.playing)}`;
        h !== Ne && (Ne = h, We(l.snapshot()));
      }
      if (Hc(wt)) {
        const h = !!(f != null && f.playing);
        pn({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: h, at: Date.now() }), h !== Le && (Le = h, We(l.snapshot()));
      }
    }), !0) : !1;
  };
  if (!rt()) {
    const a = setInterval(() => {
      rt() && clearInterval(a);
    }, 500);
    setTimeout(() => clearInterval(a), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (a) => {
    const f = a.detail;
    if (Hc(wt) && pn({ kind: "listened", at: Date.now() }), f && Number.isSafeInteger(f.song) && typeof f.id == "string" && /^[0-9a-f]{32}$/.test(f.id)) {
      jn();
      const g = In(f.song, me.get(f.song));
      l.onListened({ song: f.song, id: f.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void l.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || l.refresh();
  }), setInterval(() => {
    !document.hidden && (t || l.snapshot().step !== "off") && l.refresh();
  }, 15e3), l.refresh();
}
const EC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", kC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", o = t.userAgent.includes("Edge"), s = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return s ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && o === !1 && i === !1;
}, $C = () => kC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, IC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, LC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Ob = class {
  constructor(e) {
    M4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && Qv(e), this.callback(jl(e));
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
    var r, o, s, i, c, l, u, p, d, w;
    return n === "IOS" ? (o = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && o !== void 0 ? o : e.webUrl : t === "Chrome" ? (i = (s = e.chromeWebStoreUrl) !== null && s !== void 0 ? s : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (l = (c = e.mozillaAddOnsUrl) !== null && c !== void 0 ? c : this.getMobileUrl(e)) !== null && l !== void 0 ? l : e.webUrl : n === "Android" ? (p = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && p !== void 0 ? p : e.webUrl : (w = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = $C(), t = IC(), n = this.defaultProviders.filter(
      (s) => this.installedProviders.findIndex((i) => i.id === s.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, o = n.length > 0;
    return Ye("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Ye("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Ye("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Ye("div", { class: "flex flex-col space-y-[10px]" }, Ye("div", { class: "flex items-center" }, Ye("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Ye("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Ye("span", { class: "sr-only" }, "Close popup"), Ye("img", { src: EC }))), r ? Ye("p", null, "Select the wallet you want to connect to.") : Ye("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && Ye("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Ye("div", { class: "mt-6" }, Ye("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Ye("ul", { class: "space-y-3" }, this.installedProviders.map((s) => Ye("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ye("div", { class: "aspect-square basis-9 overflow-hidden" }, Ye("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ye("div", { class: "flex-1" }, Ye("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Ye("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), Ye("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(s.id) }, "Connect"))))), o && Ye("div", { class: "mt-6" }, r ? Ye("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Ye("div", { class: "mb-5 flex justify-between" }, Ye("p", { class: "text-sm font-medium" }, "Recommended wallets"), Ye("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Ye("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Ye("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Ye("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Ye("p", null, "What is a wallet? ", Ye("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Ye("ul", { class: "space-y-3" }, n.map((s) => Ye("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Ye("div", { class: "aspect-square basis-9 overflow-hidden" }, Ye("img", { src: s.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Ye("div", { class: "flex-1" }, Ye("div", { class: "text-sm font-medium text-[#242629]" }, s.name), s.webUrl && Ye("a", { href: s.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(s.webUrl).hostname)), this.getInstallUrl(s, e, t) && Ye("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(s, e, t), rel: "noopener noreferrer", target: "_blank" }, s.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return p4(this);
  }
};
Ob.style = LC;
const CC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Ob
}, Symbol.toStringTag, { value: "Module" }));
