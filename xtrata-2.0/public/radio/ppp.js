var Qb = Object.defineProperty;
var e1 = (e, t, n) => t in e ? Qb(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ea = (e, t, n) => e1(e, typeof t != "symbol" ? t + "" : t, n);
var Gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function cy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function Fl(e) {
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
      typeof Gn < "u" && Gn || {}, r = {
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
        ], i = ArrayBuffer.isView || function(m) {
          return m && o.indexOf(Object.prototype.toString.call(m)) > -1;
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
      function h(m) {
        this.map = {}, m instanceof h ? m.forEach(function(C, P) {
          this.append(P, C);
        }, this) : Array.isArray(m) ? m.forEach(function(C) {
          if (C.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + C.length);
          this.append(C[0], C[1]);
        }, this) : m && Object.getOwnPropertyNames(m).forEach(function(C) {
          this.append(C, m[C]);
        }, this);
      }
      h.prototype.append = function(m, C) {
        m = a(m), C = c(C);
        var P = this.map[m];
        this.map[m] = P ? P + ", " + C : C;
      }, h.prototype.delete = function(m) {
        delete this.map[a(m)];
      }, h.prototype.get = function(m) {
        return m = a(m), this.has(m) ? this.map[m] : null;
      }, h.prototype.has = function(m) {
        return this.map.hasOwnProperty(a(m));
      }, h.prototype.set = function(m, C) {
        this.map[a(m)] = c(C);
      }, h.prototype.forEach = function(m, C) {
        for (var P in this.map)
          this.map.hasOwnProperty(P) && m.call(C, this.map[P], P, this);
      }, h.prototype.keys = function() {
        var m = [];
        return this.forEach(function(C, P) {
          m.push(P);
        }), u(m);
      }, h.prototype.values = function() {
        var m = [];
        return this.forEach(function(C) {
          m.push(C);
        }), u(m);
      }, h.prototype.entries = function() {
        var m = [];
        return this.forEach(function(C, P) {
          m.push([P, C]);
        }), u(m);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function d(m) {
        if (!m._noBody) {
          if (m.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          m.bodyUsed = !0;
        }
      }
      function w(m) {
        return new Promise(function(C, P) {
          m.onload = function() {
            C(m.result);
          }, m.onerror = function() {
            P(m.error);
          };
        });
      }
      function y(m) {
        var C = new FileReader(), P = w(C);
        return C.readAsArrayBuffer(m), P;
      }
      function v(m) {
        var C = new FileReader(), P = w(C), M = /charset=([A-Za-z0-9_-]+)/.exec(m.type), Z = M ? M[1] : "utf-8";
        return C.readAsText(m, Z), P;
      }
      function x(m) {
        for (var C = new Uint8Array(m), P = new Array(C.length), M = 0; M < C.length; M++)
          P[M] = String.fromCharCode(C[M]);
        return P.join("");
      }
      function L(m) {
        if (m.slice)
          return m.slice(0);
        var C = new Uint8Array(m.byteLength);
        return C.set(new Uint8Array(m)), C.buffer;
      }
      function U() {
        return this.bodyUsed = !1, this._initBody = function(m) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = m, m ? typeof m == "string" ? this._bodyText = m : r.blob && Blob.prototype.isPrototypeOf(m) ? this._bodyBlob = m : r.formData && FormData.prototype.isPrototypeOf(m) ? this._bodyFormData = m : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) ? this._bodyText = m.toString() : r.arrayBuffer && r.blob && s(m) ? (this._bodyArrayBuffer = L(m.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(m) || i(m)) ? this._bodyArrayBuffer = L(m) : this._bodyText = m = Object.prototype.toString.call(m) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof m == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf(m) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
          return this.text().then(B);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var _ = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function A(m) {
        var C = m.toUpperCase();
        return _.indexOf(C) > -1 ? C : m;
      }
      function T(m, C) {
        if (!(this instanceof T))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        C = C || {};
        var P = C.body;
        if (m instanceof T) {
          if (m.bodyUsed)
            throw new TypeError("Already read");
          this.url = m.url, this.credentials = m.credentials, C.headers || (this.headers = new h(m.headers)), this.method = m.method, this.mode = m.mode, this.signal = m.signal, !P && m._bodyInit != null && (P = m._bodyInit, m.bodyUsed = !0);
        } else
          this.url = String(m);
        if (this.credentials = C.credentials || this.credentials || "same-origin", (C.headers || !this.headers) && (this.headers = new h(C.headers)), this.method = A(C.method || this.method || "GET"), this.mode = C.mode || this.mode || null, this.signal = C.signal || this.signal || function() {
          if ("AbortController" in n) {
            var F = new AbortController();
            return F.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && P)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(P), (this.method === "GET" || this.method === "HEAD") && (C.cache === "no-store" || C.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var Z = /\?/;
            this.url += (Z.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      T.prototype.clone = function() {
        return new T(this, { body: this._bodyInit });
      };
      function B(m) {
        var C = new FormData();
        return m.trim().split("&").forEach(function(P) {
          if (P) {
            var M = P.split("="), Z = M.shift().replace(/\+/g, " "), F = M.join("=").replace(/\+/g, " ");
            C.append(decodeURIComponent(Z), decodeURIComponent(F));
          }
        }), C;
      }
      function Y(m) {
        var C = new h(), P = m.replace(/\r?\n[\t ]+/g, " ");
        return P.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var Z = M.split(":"), F = Z.shift().trim();
          if (F) {
            var ge = Z.join(":").trim();
            try {
              C.append(F, ge);
            } catch (ce) {
              console.warn("Response " + ce.message);
            }
          }
        }), C;
      }
      U.call(T.prototype);
      function ee(m, C) {
        if (!(this instanceof ee))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (C || (C = {}), this.type = "default", this.status = C.status === void 0 ? 200 : C.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = C.statusText === void 0 ? "" : "" + C.statusText, this.headers = new h(C.headers), this.url = C.url || "", this._initBody(m);
      }
      U.call(ee.prototype), ee.prototype.clone = function() {
        return new ee(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, ee.error = function() {
        var m = new ee(null, { status: 200, statusText: "" });
        return m.ok = !1, m.status = 0, m.type = "error", m;
      };
      var oe = [301, 302, 303, 307, 308];
      ee.redirect = function(m, C) {
        if (oe.indexOf(C) === -1)
          throw new RangeError("Invalid status code");
        return new ee(null, { status: C, headers: { location: m } });
      }, t.DOMException = n.DOMException;
      try {
        new t.DOMException();
      } catch {
        t.DOMException = function(C, P) {
          this.message = C, this.name = P;
          var M = Error(C);
          this.stack = M.stack;
        }, t.DOMException.prototype = Object.create(Error.prototype), t.DOMException.prototype.constructor = t.DOMException;
      }
      function W(m, C) {
        return new Promise(function(P, M) {
          var Z = new T(m, C);
          if (Z.signal && Z.signal.aborted)
            return M(new t.DOMException("Aborted", "AbortError"));
          var F = new XMLHttpRequest();
          function ge() {
            F.abort();
          }
          F.onload = function() {
            var $ = {
              statusText: F.statusText,
              headers: Y(F.getAllResponseHeaders() || "")
            };
            Z.url.indexOf("file://") === 0 && (F.status < 200 || F.status > 599) ? $.status = 200 : $.status = F.status, $.url = "responseURL" in F ? F.responseURL : $.headers.get("X-Request-URL");
            var j = "response" in F ? F.response : F.responseText;
            setTimeout(function() {
              P(new ee(j, $));
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
          function ce($) {
            try {
              return $ === "" && n.location.href ? n.location.href : $;
            } catch {
              return $;
            }
          }
          if (F.open(Z.method, ce(Z.url), !0), Z.credentials === "include" ? F.withCredentials = !0 : Z.credentials === "omit" && (F.withCredentials = !1), "responseType" in F && (r.blob ? F.responseType = "blob" : r.arrayBuffer && (F.responseType = "arraybuffer")), C && typeof C.headers == "object" && !(C.headers instanceof h || n.Headers && C.headers instanceof n.Headers)) {
            var Ge = [];
            Object.getOwnPropertyNames(C.headers).forEach(function($) {
              Ge.push(a($)), F.setRequestHeader($, c(C.headers[$]));
            }), Z.headers.forEach(function($, j) {
              Ge.indexOf(j) === -1 && F.setRequestHeader(j, $);
            });
          } else
            Z.headers.forEach(function($, j) {
              F.setRequestHeader(j, $);
            });
          Z.signal && (Z.signal.addEventListener("abort", ge), F.onreadystatechange = function() {
            F.readyState === 4 && Z.signal.removeEventListener("abort", ge);
          }), F.send(typeof Z._bodyInit > "u" ? null : Z._bodyInit);
        });
      }
      return W.polyfill = !0, n.fetch || (n.fetch = W, n.Headers = h, n.Request = T, n.Response = ee), t.Headers = h, t.Request = T, t.Response = ee, t.fetch = W, Object.defineProperty(t, "__esModule", { value: !0 }), t;
    })({});
  })(typeof self < "u" ? self : Gn);
})();
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
function o1(...e) {
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
var Xi;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Xi || (Xi = {}));
var zs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(zs || (zs = {}));
var dp;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(dp || (dp = {}));
const s1 = "https://api.mainnet.hiro.so", i1 = "https://api.testnet.hiro.so", a1 = "http://localhost:3999", c1 = ["mainnet", "testnet", "devnet", "mocknet"];
let Yi = class {
  constructor(t) {
    this.version = zs.Mainnet, this.chainId = Xi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === zs.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? o1();
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
Yi.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new ld();
    case "testnet":
      return new l1();
    case "devnet":
      return new u1();
    case "mocknet":
      return new ly();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${c1.join(", ")}`);
  }
};
Yi.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Yi.fromName(e);
let ld = class extends Yi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? s1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = zs.Mainnet, this.chainId = Xi.Mainnet;
  }
}, l1 = class extends Yi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? i1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = zs.Testnet, this.chainId = Xi.Testnet;
  }
}, ly = class extends Yi {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? a1,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = zs.Testnet, this.chainId = Xi.Testnet;
  }
};
const u1 = ly, uy = "xtrata.wallet.bridge.v1", d1 = (e) => typeof e == "object" && e !== null && e.protocol === uy, f1 = (e) => d1(e) && e.kind === "response" && typeof e.id == "string" && e.id.length > 0 && typeof e.ok == "boolean", h1 = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
};
class ka extends Error {
  constructor(t, n) {
    super(n), this.code = t, this.name = "BridgeClientError";
  }
}
const fp = 12e4;
class p1 {
  constructor(t) {
    Ea(this, "pending", /* @__PURE__ */ new Map());
    Ea(this, "listenTarget");
    Ea(this, "closed", !1);
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
    Ea(this, "onMessage", (t) => {
      if (t.origin !== this.options.walletOrigin || t.source !== this.options.frame.contentWindow || !f1(t.data)) return;
      const n = this.pending.get(t.data.id);
      if (n)
        if (this.pending.delete(t.data.id), clearTimeout(n.timer), t.data.ok)
          n.resolve(t.data.result);
        else {
          const r = t.data.error;
          n.reject(
            new ka("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = t, this.listenTarget = t.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(t, n) {
    if (this.closed)
      return Promise.reject(new ka("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new ka("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = h1(), o = { protocol: uy, kind: "request", id: s, method: t, params: n };
    return new Promise((i, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new ka(
            "TIMEOUT",
            `Wallet did not answer "${t}" within ${this.options.timeoutMs ?? fp}ms.`
          )
        );
      }, this.options.timeoutMs ?? fp);
      this.pending.set(s, { resolve: i, reject: a, timer: c }), r.postMessage(o, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, t] of this.pending)
      clearTimeout(t.timer), t.reject(new ka("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const g1 = ["SP", "SM"], y1 = ["ST", "SN"], w1 = (e) => {
  const [t] = e.split(".");
  if (!t || t.length < 2)
    return null;
  const n = t.slice(0, 2).toUpperCase();
  return g1.includes(n) ? "mainnet" : y1.includes(n) ? "testnet" : null;
}, m1 = () => {
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
}, b1 = () => typeof window > "u" || !window.localStorage ? m1() : window.localStorage, Eu = "xtrata.v15.1.wallet.session", hp = "mainnet", cl = { isConnected: !1 }, x1 = (e) => e.address ? w1(e.address) ?? e.network : e.network, dy = (e) => !e.isConnected || !e.address ? { ...cl } : x1(e) !== hp ? { ...cl } : {
  isConnected: !0,
  address: e.address,
  network: hp,
  ...typeof e.publicKey == "string" && /^[0-9a-f]{66}$/i.test(e.publicKey) ? { publicKey: e.publicKey } : {}
}, S1 = (e) => {
  if (!e)
    return { ...cl };
  try {
    const t = JSON.parse(e);
    return dy(t);
  } catch {
    return { ...cl };
  }
}, v1 = (e) => {
  const t = dy(e);
  return JSON.stringify(t);
}, A1 = (e) => {
  const t = b1();
  return {
    load: () => S1(t.getItem(Eu)),
    save: (n) => {
      t.setItem(Eu, v1(n));
    },
    clear: () => {
      t.removeItem(Eu);
    }
  };
}, E1 = "https://browser.blockstack.org/auth", k1 = {
  "@type": "Person",
  "@context": "http://schema.org"
}, fy = ["store_write"], $1 = "blockstack-session", I1 = {
  logLevel: "debug"
}, si = {
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
Object.freeze(si);
class da extends Error {
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
class L1 extends da {
  constructor(t, n = "") {
    super({ code: si.MISSING_PARAMETER, message: n, parameter: t }), this.name = "MissingParametersError";
  }
}
class pp extends da {
  constructor(t = "") {
    super({ code: si.INVALID_DID_ERROR, message: t }), this.name = "InvalidDIDError";
  }
}
class yc extends da {
  constructor(t) {
    const n = `Failed to login: ${t}`;
    super({ code: si.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class gp extends da {
  constructor(t = "Unable to decrypt cipher object.") {
    super({ code: si.FAILED_DECRYPTION_ERROR, message: t }), this.message = t, this.name = "FailedDecryptionError";
  }
}
class ud extends da {
  constructor(t) {
    super({ code: si.INVALID_STATE, message: t }), this.message = t, this.name = "InvalidStateError";
  }
}
class hy extends da {
  constructor(t) {
    super({ code: si.INVALID_STATE, message: t }), this.message = t, this.name = "NoSessionDataError";
  }
}
const yp = ["debug", "info", "warn", "error", "none"], dd = {};
for (let e = 0; e < yp.length; e++) {
  const t = yp[e];
  dd[t] = e;
}
class Hi {
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
    return dd[I1.logLevel] <= dd[t];
  }
}
function C1() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function T1() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function ku(e, t) {
  (e === void 0 || e === "") && (e = "0.0.0"), (t === void 0 || e === "") && (t = "0.0.0");
  const n = e.split(".").map((s) => parseInt(s, 10)), r = t.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < t.length; s++)
    if (s >= e.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function B1() {
  let e = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (e += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t) => {
    const n = (e + Math.random() * 16) % 16 | 0;
    return e = Math.floor(e / 16), (t === "x" ? n : n & 3 | 8).toString(16);
  });
}
function N1() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function M1(e, t, n) {
  return n ? `Use of '${n}' requires \`${t}\` which is unavailable on the '${e}' object within the currently executing environment.` : `\`${t}\` is unavailable on the '${e}' object within the currently executing environment.`;
}
function bf(e, { throwIfUnavailable: t, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = N1(), s) {
      const o = s[e];
      if (o)
        return o;
    }
  } catch (o) {
    Hi.error(`Error getting object '${e}' from global scope '${s}': ${o}`);
  }
  if (t) {
    const o = M1(s, e.toString(), n);
    throw Hi.error(o), new Error(o);
  }
  if (r)
    return {};
}
function vs(e, t) {
  return xf(Hn(e), t);
}
function Hn(e) {
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
  if (Jn(e, Uint8Array))
    return BigInt(`0x${_e(e)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function P1(e) {
  return /^0x/i.test(e) ? e.slice(2) : e;
}
function wp(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function rc(e, t = 8) {
  return (typeof e == "bigint" ? e : Hn(e)).toString(16).padStart(t * 2, "0");
}
function jl(e) {
  return parseInt(e, 16);
}
function xf(e, t = 16) {
  const n = rc(e, t);
  return vt(n);
}
function _1(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function U1(e, t) {
  return e & BigInt(1) << t;
}
function fd(e) {
  return O1(BigInt(`0x${_e(e)}`), BigInt(e.byteLength * 8));
}
function O1(e, t) {
  return U1(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const H1 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function _e(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += H1[n];
  return t;
}
function vt(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof e}`);
  e = P1(e), e = e.length % 2 ? `0${e}` : e;
  const t = new Uint8Array(e.length / 2);
  for (let n = 0; n < t.length; n++) {
    const r = n * 2, s = e.slice(r, r + 2), o = Number.parseInt(s, 16);
    if (Number.isNaN(o) || o < 0)
      throw new Error("Invalid byte sequence");
    t[n] = o;
  }
  return t;
}
function ii(e) {
  return new TextEncoder().encode(e);
}
function oc(e) {
  return new TextDecoder().decode(e);
}
function D1(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function F1(e) {
  return String.fromCharCode.apply(null, e);
}
function j1(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function mp(e) {
  if (e.some(j1))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function uo(...e) {
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
function an(e) {
  return uo(...e.map((t) => typeof t == "number" ? mp([t]) : t instanceof Array ? mp(t) : t));
}
function Jn(e, t) {
  var n, r;
  return e instanceof t || ((r = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === t.name;
}
const py = "https://api.mainnet.hiro.so", gy = "https://api.testnet.hiro.so", yy = "http://localhost:3999", R1 = "https://hub.blockstack.org", z1 = 33, $u = 32;
function G1(e) {
  if (e.length < $u * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + $u * 2), r = e.slice(2 + $u * 2);
  return {
    recoveryId: jl(t),
    r: n,
    s: r
  };
}
function Sf(e) {
  const t = typeof e == "string" ? vt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function K1(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function V1(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function X1(e, t) {
  return e[t];
}
function Y1(e, t, n = 0) {
  return e[n] = t, e;
}
function q1(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function Gs(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
const W1 = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Z1(e, t) {
  const n = {};
  return Object.assign(n, W1, t), await fetch(e, n);
}
function J1(e) {
  let t = Z1, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function Q1(...e) {
  const { fetchLib: t, middlewares: n } = J1(e);
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
class wy {
  constructor(t = fy.slice(), n = ((a) => (a = bf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", o = void 0, i = E1) {
    this.appDomain = n, this.scopes = t, this.redirectPath = r, this.manifestPath = s, this.coreNode = o, this.authenticatorURL = i;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function hd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function e2(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function my(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function t2(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  hd(e.outputLen), hd(e.blockLen);
}
function n2(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function r2(e, t) {
  my(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ms = {
  number: hd,
  bool: e2,
  bytes: my,
  hash: t2,
  exists: n2,
  output: r2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Iu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), Qr = (e, t) => e << 32 - t | e >>> t, o2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!o2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function s2(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function vf(e) {
  if (typeof e == "string" && (e = s2(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let by = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ai(e) {
  const t = (r) => e().update(vf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let xy = class extends by {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ms.hash(t);
    const r = vf(n);
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
    return Ms.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ms.exists(this), Ms.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Rl = (e, t, n) => new xy(e, t).update(n).digest();
Rl.create = (e, t) => new xy(e, t);
function i2(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Af = class extends by {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Iu(this.buffer);
  }
  update(t) {
    Ms.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = vf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Iu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ms.exists(this), Ms.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    i2(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Iu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
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
const a2 = (e, t, n) => e & t ^ ~e & n, c2 = (e, t, n) => e & t ^ e & n ^ t & n, l2 = new Uint32Array([
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
]), Go = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ko = new Uint32Array(64);
let Sy = class extends Af {
  constructor() {
    super(64, 32, 8, !1), this.A = Go[0] | 0, this.B = Go[1] | 0, this.C = Go[2] | 0, this.D = Go[3] | 0, this.E = Go[4] | 0, this.F = Go[5] | 0, this.G = Go[6] | 0, this.H = Go[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      Ko[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Ko[d - 15], y = Ko[d - 2], v = Qr(w, 7) ^ Qr(w, 18) ^ w >>> 3, x = Qr(y, 17) ^ Qr(y, 19) ^ y >>> 10;
      Ko[d] = x + Ko[d - 7] + v + Ko[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Qr(a, 6) ^ Qr(a, 11) ^ Qr(a, 25), y = h + w + a2(a, c, u) + l2[d] + Ko[d] | 0, x = (Qr(r, 2) ^ Qr(r, 13) ^ Qr(r, 22)) + c2(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Ko.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, u2 = class extends Sy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const qi = ai(() => new Sy());
ai(() => new u2());
const d2 = {}, vy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: d2
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const mt = BigInt(0), Xt = BigInt(1), ws = BigInt(2), Oa = BigInt(3), bp = BigInt(8), Nt = Object.freeze({
  a: mt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: Xt,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), xp = (e, t) => (e + t / ws) / t, wc = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(e) {
    const { n: t } = Nt, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -Xt * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), o = n, i = BigInt("0x100000000000000000000000000000000"), a = xp(o * e, t), c = xp(-r * e, t);
    let u = he(e - a * n - c * s, t), h = he(-a * r - c * o, t);
    const d = u > i, w = h > i;
    if (d && (u = t - u), w && (h = t - h), u > i || h > i)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
    return { k1neg: d, k1: u, k2neg: w, k2: h };
  }
}, jr = 32, Ks = 32, Ay = 32, ll = jr + 1, ul = 2 * jr + 1;
function Sp(e) {
  const { a: t, b: n } = Nt, r = he(e * e), s = he(r * e);
  return he(s + t * e + n);
}
const mc = Nt.a === mt;
class Ef extends Error {
  constructor(t) {
    super(t);
  }
}
function vp(e) {
  if (!(e instanceof kt))
    throw new TypeError("JacobianPoint expected");
}
class kt {
  constructor(t, n, r) {
    this.x = t, this.y = n, this.z = r;
  }
  static fromAffine(t) {
    if (!(t instanceof it))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return t.equals(it.ZERO) ? kt.ZERO : new kt(t.x, t.y, Xt);
  }
  static toAffineBatch(t) {
    const n = y2(t.map((r) => r.z));
    return t.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(t) {
    return kt.toAffineBatch(t).map(kt.fromAffine);
  }
  equals(t) {
    vp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t, c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c);
    return h === d && w === y;
  }
  negate() {
    return new kt(this.x, he(-this.y), this.z);
  }
  double() {
    const { x: t, y: n, z: r } = this, s = he(t * t), o = he(n * n), i = he(o * o), a = t + o, c = he(ws * (he(a * a) - s - i)), u = he(Oa * s), h = he(u * u), d = he(h - ws * c), w = he(u * (c - d) - bp * i), y = he(ws * n * r);
    return new kt(d, w, y);
  }
  add(t) {
    vp(t);
    const { x: n, y: r, z: s } = this, { x: o, y: i, z: a } = t;
    if (o === mt || i === mt)
      return this;
    if (n === mt || r === mt)
      return t;
    const c = he(s * s), u = he(a * a), h = he(n * u), d = he(o * c), w = he(he(r * a) * u), y = he(he(i * s) * c), v = he(d - h), x = he(y - w);
    if (v === mt)
      return x === mt ? this.double() : kt.ZERO;
    const L = he(v * v), U = he(v * L), _ = he(h * L), A = he(x * x - U - ws * _), T = he(x * (_ - A) - w * U), B = he(s * a * v);
    return new kt(A, T, B);
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiplyUnsafe(t) {
    const n = kt.ZERO;
    if (typeof t == "bigint" && t === mt)
      return n;
    let r = kp(t);
    if (r === Xt)
      return this;
    if (!mc) {
      let d = n, w = this;
      for (; r > mt; )
        r & Xt && (d = d.add(w)), w = w.double(), r >>= Xt;
      return d;
    }
    let { k1neg: s, k1: o, k2neg: i, k2: a } = wc.splitScalar(r), c = n, u = n, h = this;
    for (; o > mt || a > mt; )
      o & Xt && (c = c.add(h)), a & Xt && (u = u.add(h)), h = h.double(), o >>= Xt, a >>= Xt;
    return s && (c = c.negate()), i && (u = u.negate()), u = new kt(he(u.x * wc.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(t) {
    const n = mc ? 128 / t + 1 : 256 / t + 1, r = [];
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
    !n && this.equals(kt.BASE) && (n = it.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && pd.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = kt.normalizeZ(s), pd.set(n, s)));
    let o = kt.ZERO, i = kt.BASE;
    const a = 1 + (mc ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, d = BigInt(r);
    for (let w = 0; w < a; w++) {
      const y = w * c;
      let v = Number(t & u);
      t >>= d, v > c && (v -= h, t += Xt);
      const x = y, L = y + Math.abs(v) - 1, U = w % 2 !== 0, _ = v < 0;
      v === 0 ? i = i.add(bc(U, s[x])) : o = o.add(bc(_, s[L]));
    }
    return { p: o, f: i };
  }
  multiply(t, n) {
    let r = kp(t), s, o;
    if (mc) {
      const { k1neg: i, k1: a, k2neg: c, k2: u } = wc.splitScalar(r);
      let { p: h, f: d } = this.wNAF(a, n), { p: w, f: y } = this.wNAF(u, n);
      h = bc(i, h), w = bc(c, w), w = new kt(he(w.x * wc.beta), w.y, w.z), s = h.add(w), o = d.add(y);
    } else {
      const { p: i, f: a } = this.wNAF(r, n);
      s = i, o = a;
    }
    return kt.normalizeZ([s, o])[0];
  }
  toAffine(t) {
    const { x: n, y: r, z: s } = this, o = this.equals(kt.ZERO);
    t == null && (t = o ? bp : fa(s));
    const i = t, a = he(i * i), c = he(a * i), u = he(n * a), h = he(r * c), d = he(s * i);
    if (o)
      return it.ZERO;
    if (d !== Xt)
      throw new Error("invZ was invalid");
    return new it(u, h);
  }
}
kt.BASE = new kt(Nt.Gx, Nt.Gy, Xt);
kt.ZERO = new kt(mt, Xt, mt);
function bc(e, t) {
  const n = t.negate();
  return e ? n : t;
}
const pd = /* @__PURE__ */ new WeakMap();
class it {
  constructor(t, n) {
    this.x = t, this.y = n;
  }
  _setWindowSize(t) {
    this._WINDOW_SIZE = t, pd.delete(this);
  }
  hasEvenY() {
    return this.y % ws === mt;
  }
  static fromCompressedHex(t) {
    const n = t.length === 32, r = hr(n ? t : t.subarray(1));
    if (!Zc(r))
      throw new Error("Point is not on curve");
    const s = Sp(r);
    let o = g2(s);
    const i = (o & Xt) === Xt;
    n ? i && (o = he(-o)) : (t[0] & 1) === 1 !== i && (o = he(-o));
    const a = new it(r, o);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(t) {
    const n = hr(t.subarray(1, jr + 1)), r = hr(t.subarray(jr + 1, jr * 2 + 1)), s = new it(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(t) {
    const n = fo(t), r = n.length, s = n[0];
    if (r === jr)
      return this.fromCompressedHex(n);
    if (r === ll && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === ul && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${ll} compressed bytes or ${ul} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(t) {
    return it.BASE.multiply(Vs(t));
  }
  static fromSignature(t, n, r) {
    const { r: s, s: o } = $y(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const i = kf(fo(t)), { n: a } = Nt, c = r === 2 || r === 3 ? s + a : s, u = fa(c, a), h = he(-i * u, a), d = he(o * u, a), w = r & 1 ? "03" : "02", y = it.fromHex(w + ms(c)), v = it.BASE.multiplyAndAddUnsafe(y, h, d);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(t = !1) {
    return bs(this.toHex(t));
  }
  toHex(t = !1) {
    const n = ms(this.x);
    return t ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${ms(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const t = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Zc(n) || !Zc(r))
      throw new Error(t);
    const s = he(r * r), o = Sp(n);
    if (he(s - o) !== mt)
      throw new Error(t);
  }
  equals(t) {
    return this.x === t.x && this.y === t.y;
  }
  negate() {
    return new it(this.x, he(-this.y));
  }
  double() {
    return kt.fromAffine(this).double().toAffine();
  }
  add(t) {
    return kt.fromAffine(this).add(kt.fromAffine(t)).toAffine();
  }
  subtract(t) {
    return this.add(t.negate());
  }
  multiply(t) {
    return kt.fromAffine(this).multiply(t, this).toAffine();
  }
  multiplyAndAddUnsafe(t, n, r) {
    const s = kt.fromAffine(this), o = n === mt || n === Xt || this !== it.BASE ? s.multiplyUnsafe(n) : s.multiply(n), i = kt.fromAffine(t).multiplyUnsafe(r), a = o.add(i);
    return a.equals(kt.ZERO) ? void 0 : a.toAffine();
  }
}
it.BASE = new it(Nt.Gx, Nt.Gy);
it.ZERO = new it(mt, mt);
function Ap(e) {
  return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
}
function Ep(e) {
  if (e.length < 2 || e[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Wi(e)}`);
  const t = e[1], n = e.subarray(2, t + 2);
  if (!t || n.length !== t)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: hr(n), left: e.subarray(t + 2) };
}
function f2(e) {
  if (e.length < 2 || e[0] != 48)
    throw new Error(`Invalid signature tag: ${Wi(e)}`);
  if (e[1] !== e.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: t, left: n } = Ep(e.subarray(2)), { data: r, left: s } = Ep(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Wi(s)}`);
  return { r: t, s: r };
}
class fr {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromCompact(t) {
    const n = t instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof t != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Wi(t) : t;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new fr(dl(s.slice(0, 64)), dl(s.slice(64, 128)));
  }
  static fromDER(t) {
    const n = t instanceof Uint8Array;
    if (typeof t != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = f2(n ? t : bs(t));
    return new fr(r, s);
  }
  static fromHex(t) {
    return this.fromDER(t);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Ji(t))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ji(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const t = Nt.n >> Xt;
    return this.s > t;
  }
  normalizeS() {
    return this.hasHighS() ? new fr(this.r, he(-this.s, Nt.n)) : this;
  }
  toDERRawBytes() {
    return bs(this.toDERHex());
  }
  toDERHex() {
    const t = Ap($a(this.s)), n = Ap($a(this.r)), r = t.length / 2, s = n.length / 2, o = $a(r), i = $a(s);
    return `30${$a(s + r + 4)}02${i}${n}02${o}${t}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return bs(this.toCompactHex());
  }
  toCompactHex() {
    return ms(this.r) + ms(this.s);
  }
}
function gs(...e) {
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
const h2 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Wi(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += h2[e[n]];
  return t;
}
const p2 = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function ms(e) {
  if (typeof e != "bigint")
    throw new Error("Expected bigint");
  if (!(mt <= e && e < p2))
    throw new Error("Expected number 0 <= n < 2^256");
  return e.toString(16).padStart(64, "0");
}
function Zi(e) {
  const t = bs(ms(e));
  if (t.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return t;
}
function $a(e) {
  const t = e.toString(16);
  return t.length & 1 ? `0${t}` : t;
}
function dl(e) {
  if (typeof e != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof e);
  return BigInt(`0x${e}`);
}
function bs(e) {
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
function hr(e) {
  return dl(Wi(e));
}
function fo(e) {
  return e instanceof Uint8Array ? Uint8Array.from(e) : bs(e);
}
function kp(e) {
  if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    return BigInt(e);
  if (typeof e == "bigint" && Ji(e))
    return e;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function he(e, t = Nt.P) {
  const n = e % t;
  return n >= mt ? n : t + n;
}
function vr(e, t) {
  const { P: n } = Nt;
  let r = e;
  for (; t-- > mt; )
    r *= r, r %= n;
  return r;
}
function g2(e) {
  const { P: t } = Nt, n = BigInt(6), r = BigInt(11), s = BigInt(22), o = BigInt(23), i = BigInt(44), a = BigInt(88), c = e * e * e % t, u = c * c * e % t, h = vr(u, Oa) * u % t, d = vr(h, Oa) * u % t, w = vr(d, ws) * c % t, y = vr(w, r) * w % t, v = vr(y, s) * y % t, x = vr(v, i) * v % t, L = vr(x, a) * x % t, U = vr(L, i) * v % t, _ = vr(U, Oa) * u % t, A = vr(_, o) * y % t, T = vr(A, n) * c % t, B = vr(T, ws);
  if (B * B % t !== e)
    throw new Error("Cannot find square root");
  return B;
}
function fa(e, t = Nt.P) {
  if (e === mt || t <= mt)
    throw new Error(`invert: expected positive integers, got n=${e} mod=${t}`);
  let n = he(e, t), r = t, s = mt, o = Xt;
  for (; n !== mt; ) {
    const a = r / n, c = r % n, u = s - o * a;
    r = n, n = c, s = o, o = u;
  }
  if (r !== Xt)
    throw new Error("invert: does not exist");
  return he(s, t);
}
function y2(e, t = Nt.P) {
  const n = new Array(e.length), r = e.reduce((o, i, a) => i === mt ? o : (n[a] = o, he(o * i, t)), Xt), s = fa(r, t);
  return e.reduceRight((o, i, a) => i === mt ? o : (n[a] = he(o * n[a], t), he(o * i, t)), s), n;
}
function w2(e) {
  const t = e.length * 8 - Ks * 8, n = hr(e);
  return t > 0 ? n >> BigInt(t) : n;
}
function kf(e, t = !1) {
  const n = w2(e);
  if (t)
    return n;
  const { n: r } = Nt;
  return n >= r ? n - r : n;
}
let Ki, Ha;
class Ey {
  constructor(t, n) {
    if (this.hashLen = t, this.qByteLen = n, typeof t != "number" || t < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(t).fill(1), this.k = new Uint8Array(t).fill(0), this.counter = 0;
  }
  hmac(...t) {
    return tn.hmacSha256(this.k, ...t);
  }
  hmacSync(...t) {
    return Ha(this.k, ...t);
  }
  checkSync() {
    if (typeof Ha != "function")
      throw new Ef("hmacSha256Sync needs to be set");
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
    return gs(...n);
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
    return gs(...n);
  }
}
function Ji(e) {
  return mt < e && e < Nt.n;
}
function Zc(e) {
  return mt < e && e < Nt.P;
}
function ky(e, t, n, r = !0) {
  const { n: s } = Nt, o = kf(e, !0);
  if (!Ji(o))
    return;
  const i = fa(o, s), a = it.BASE.multiply(o), c = he(a.x, s);
  if (c === mt)
    return;
  const u = he(i * he(t + n * c, s), s);
  if (u === mt)
    return;
  let h = new fr(c, u), d = (a.x === h.r ? 0 : 2) | Number(a.y & Xt);
  return r && h.hasHighS() && (h = h.normalizeS(), d ^= 1), { sig: h, recovery: d };
}
function Vs(e) {
  let t;
  if (typeof e == "bigint")
    t = e;
  else if (typeof e == "number" && Number.isSafeInteger(e) && e > 0)
    t = BigInt(e);
  else if (typeof e == "string") {
    if (e.length !== 2 * Ks)
      throw new Error("Expected 32 bytes of private key");
    t = dl(e);
  } else if (e instanceof Uint8Array) {
    if (e.length !== Ks)
      throw new Error("Expected 32 bytes of private key");
    t = hr(e);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ji(t))
    throw new Error("Expected private key: 0 < key < n");
  return t;
}
function $f(e) {
  return e instanceof it ? (e.assertValidity(), e) : it.fromHex(e);
}
function $y(e) {
  if (e instanceof fr)
    return e.assertValidity(), e;
  try {
    return fr.fromDER(e);
  } catch {
    return fr.fromCompact(e);
  }
}
function sc(e, t = !1) {
  return it.fromPrivateKey(e).toRawBytes(t);
}
function m2(e, t, n, r = !1) {
  return it.fromSignature(e, t, n).toRawBytes(r);
}
function $p(e) {
  const t = e instanceof Uint8Array, n = typeof e == "string", r = (t || n) && e.length;
  return t ? r === ll || r === ul : n ? r === ll * 2 || r === ul * 2 : e instanceof it;
}
function If(e, t, n = !1) {
  if ($p(e))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!$p(t))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = $f(t);
  return r.assertValidity(), r.multiply(Vs(e)).toRawBytes(n);
}
function Iy(e) {
  const t = e.length > jr ? e.slice(0, jr) : e;
  return hr(t);
}
function b2(e) {
  const t = Iy(e), n = he(t, Nt.n);
  return Ly(n < mt ? t : n);
}
function Ly(e) {
  return Zi(e);
}
function Cy(e, t, n) {
  if (e == null)
    throw new Error(`sign: expected valid message hash, not "${e}"`);
  const r = fo(e), s = Vs(t), o = [Ly(s), b2(r)];
  if (n != null) {
    n === !0 && (n = tn.randomBytes(jr));
    const c = fo(n);
    if (c.length !== jr)
      throw new Error(`sign: Expected ${jr} bytes of extra data`);
    o.push(c);
  }
  const i = gs(...o), a = Iy(r);
  return { seed: i, m: a, d: s };
}
function Ty(e, t) {
  const { sig: n, recovery: r } = e, { der: s, recovered: o } = Object.assign({ canonical: !0, der: !0 }, t), i = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return o ? [i, r] : i;
}
async function x2(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Cy(e, t, n.extraEntropy), i = new Ey(Ay, Ks);
  await i.reseed(r);
  let a;
  for (; !(a = ky(await i.generate(), s, o, n.canonical)); )
    await i.reseed();
  return Ty(a, n);
}
function zl(e, t, n = {}) {
  const { seed: r, m: s, d: o } = Cy(e, t, n.extraEntropy), i = new Ey(Ay, Ks);
  i.reseedSync(r);
  let a;
  for (; !(a = ky(i.generateSync(), s, o, n.canonical)); )
    i.reseedSync();
  return Ty(a, n);
}
const S2 = { strict: !0 };
function v2(e, t, n, r = S2) {
  let s;
  try {
    s = $y(e), t = fo(t);
  } catch {
    return !1;
  }
  const { r: o, s: i } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = kf(t);
  let c;
  try {
    c = $f(n);
  } catch {
    return !1;
  }
  const { n: u } = Nt, h = fa(i, u), d = he(a * h, u), w = he(o * h, u), y = it.BASE.multiplyAndAddUnsafe(c, d, w);
  return y ? he(y.x, u) === o : !1;
}
function fl(e) {
  return he(hr(e), Nt.n);
}
class Qi {
  constructor(t, n) {
    this.r = t, this.s = n, this.assertValidity();
  }
  static fromHex(t) {
    const n = fo(t);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = hr(n.subarray(0, 32)), s = hr(n.subarray(32, 64));
    return new Qi(r, s);
  }
  assertValidity() {
    const { r: t, s: n } = this;
    if (!Zc(t) || !Ji(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return ms(this.r) + ms(this.s);
  }
  toRawBytes() {
    return bs(this.toHex());
  }
}
function A2(e) {
  return it.fromPrivateKey(e).toRawX();
}
class By {
  constructor(t, n, r = tn.randomBytes()) {
    if (t == null)
      throw new TypeError(`sign: Expected valid message, not "${t}"`);
    this.m = fo(t);
    const { x: s, scalar: o } = this.getScalar(Vs(n));
    if (this.px = s, this.d = o, this.rand = fo(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(t) {
    const n = it.fromPrivateKey(t), r = n.hasEvenY() ? t : Nt.n - t;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(t, n) {
    return Zi(t ^ hr(n));
  }
  finalizeNonce(t) {
    const n = he(hr(t), Nt.n);
    if (n === mt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: o } = this.getScalar(n);
    return { R: r, rx: s, k: o };
  }
  finalizeSig(t, n, r, s) {
    return new Qi(t.x, he(n + r * s, Nt.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: t, d: n, px: r, rand: s } = this, o = tn.taggedHash, i = this.initNonce(n, await o(ps.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await o(ps.nonce, i, r, t)), h = fl(await o(ps.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return await Py(d, t, r) || this.error(), d;
  }
  calcSync() {
    const { m: t, d: n, px: r, rand: s } = this, o = tn.taggedHashSync, i = this.initNonce(n, o(ps.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(o(ps.nonce, i, r, t)), h = fl(o(ps.challenge, c, r, t)), d = this.finalizeSig(a, u, h, n);
    return _y(d, t, r) || this.error(), d;
  }
}
async function E2(e, t, n) {
  return new By(e, t, n).calc();
}
function k2(e, t, n) {
  return new By(e, t, n).calcSync();
}
function Ny(e, t, n) {
  const r = e instanceof Qi, s = r ? e : Qi.fromHex(e);
  return r && s.assertValidity(), {
    ...s,
    m: fo(t),
    P: $f(n)
  };
}
function My(e, t, n, r) {
  const s = it.BASE.multiplyAndAddUnsafe(t, Vs(n), he(-r, Nt.n));
  return !(!s || !s.hasEvenY() || s.x !== e);
}
async function Py(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Ny(e, t, n), a = fl(await tn.taggedHash(ps.challenge, Zi(r), i.toRawX(), o));
    return My(r, i, s, a);
  } catch {
    return !1;
  }
}
function _y(e, t, n) {
  try {
    const { r, s, m: o, P: i } = Ny(e, t, n), a = fl(tn.taggedHashSync(ps.challenge, Zi(r), i.toRawX(), o));
    return My(r, i, s, a);
  } catch (r) {
    if (r instanceof Ef)
      throw r;
    return !1;
  }
}
const $2 = {
  Signature: Qi,
  getPublicKey: A2,
  sign: E2,
  verify: Py,
  signSync: k2,
  verifySync: _y
};
it.BASE._setWindowSize(8);
const or = {
  node: vy,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ps = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, xc = {}, tn = {
  bytesToHex: Wi,
  hexToBytes: bs,
  concatBytes: gs,
  mod: he,
  invert: fa,
  isValidPrivateKey(e) {
    try {
      return Vs(e), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Zi,
  _normalizePrivateKey: Vs,
  hashToPrivateKey: (e) => {
    e = fo(e);
    const t = Ks + 8;
    if (e.length < t || e.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = he(hr(e), Nt.n - Xt) + Xt;
    return Zi(n);
  },
  randomBytes: (e = 32) => {
    if (or.web)
      return or.web.getRandomValues(new Uint8Array(e));
    if (or.node) {
      const { randomBytes: t } = or.node;
      return Uint8Array.from(t(e));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => tn.hashToPrivateKey(tn.randomBytes(Ks + 8)),
  precompute(e = 8, t = it.BASE) {
    const n = t === it.BASE ? t : new it(t.x, t.y);
    return n._setWindowSize(e), n.multiply(Oa), n;
  },
  sha256: async (...e) => {
    if (or.web) {
      const t = await or.web.subtle.digest("SHA-256", gs(...e));
      return new Uint8Array(t);
    } else if (or.node) {
      const { createHash: t } = or.node, n = t("sha256");
      return e.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (e, ...t) => {
    if (or.web) {
      const n = await or.web.subtle.importKey("raw", e, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = gs(...t), s = await or.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (or.node) {
      const { createHmac: n } = or.node, r = n("sha256", e);
      return t.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (e, ...t) => {
    let n = xc[e];
    if (n === void 0) {
      const r = await tn.sha256(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = gs(r, r), xc[e] = n;
    }
    return tn.sha256(n, ...t);
  },
  taggedHashSync: (e, ...t) => {
    if (typeof Ki != "function")
      throw new Ef("sha256Sync is undefined, you need to set it");
    let n = xc[e];
    if (n === void 0) {
      const r = Ki(Uint8Array.from(e, (s) => s.charCodeAt(0)));
      n = gs(r, r), xc[e] = n;
    }
    return Ki(n, ...t);
  },
  _JacobianPoint: kt
};
Object.defineProperties(tn, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Ki;
    },
    set(e) {
      Ki || (Ki = e);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Ha;
    },
    set(e) {
      Ha || (Ha = e);
    }
  }
});
const I2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: Nt,
  Point: it,
  Signature: fr,
  getPublicKey: sc,
  getSharedSecret: If,
  recoverPublicKey: m2,
  schnorr: $2,
  sign: x2,
  signSync: zl,
  utils: tn,
  verify: v2
}, Symbol.toStringTag, { value: "Module" }));
var ic = {};
ic.byteLength = N2;
var L2 = ic.toByteArray = P2, C2 = ic.fromByteArray = O2, oo = [], Er = [], T2 = typeof Uint8Array < "u" ? Uint8Array : Array, Lu = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Ti = 0, B2 = Lu.length; Ti < B2; ++Ti)
  oo[Ti] = Lu[Ti], Er[Lu.charCodeAt(Ti)] = Ti;
Er[45] = 62;
Er[95] = 63;
function Uy(e) {
  var t = e.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = e.indexOf("=");
  n === -1 && (n = t);
  var r = n === t ? 0 : 4 - n % 4;
  return [n, r];
}
function N2(e) {
  var t = Uy(e), n = t[0], r = t[1];
  return (n + r) * 3 / 4 - r;
}
function M2(e, t, n) {
  return (t + n) * 3 / 4 - n;
}
function P2(e) {
  var t, n = Uy(e), r = n[0], s = n[1], o = new T2(M2(e, r, s)), i = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    t = Er[e.charCodeAt(c)] << 18 | Er[e.charCodeAt(c + 1)] << 12 | Er[e.charCodeAt(c + 2)] << 6 | Er[e.charCodeAt(c + 3)], o[i++] = t >> 16 & 255, o[i++] = t >> 8 & 255, o[i++] = t & 255;
  return s === 2 && (t = Er[e.charCodeAt(c)] << 2 | Er[e.charCodeAt(c + 1)] >> 4, o[i++] = t & 255), s === 1 && (t = Er[e.charCodeAt(c)] << 10 | Er[e.charCodeAt(c + 1)] << 4 | Er[e.charCodeAt(c + 2)] >> 2, o[i++] = t >> 8 & 255, o[i++] = t & 255), o;
}
function _2(e) {
  return oo[e >> 18 & 63] + oo[e >> 12 & 63] + oo[e >> 6 & 63] + oo[e & 63];
}
function U2(e, t, n) {
  for (var r, s = [], o = t; o < n; o += 3)
    r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (e[o + 2] & 255), s.push(_2(r));
  return s.join("");
}
function O2(e) {
  for (var t, n = e.length, r = n % 3, s = [], o = 16383, i = 0, a = n - r; i < a; i += o)
    s.push(U2(e, i, i + o > a ? a : i + o));
  return r === 1 ? (t = e[n - 1], s.push(
    oo[t >> 2] + oo[t << 4 & 63] + "=="
  )) : r === 2 && (t = (e[n - 2] << 8) + e[n - 1], s.push(
    oo[t >> 10] + oo[t >> 4 & 63] + oo[t << 2 & 63] + "="
  )), s.join("");
}
function H2() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const D2 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function F2() {
  if (H2())
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
    throw new Error(D2);
  }
}
class j2 {
  constructor(t, n) {
    this.createCipher = t, this.createDecipher = n;
  }
  async encrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createCipher(t, n, r), i = new Uint8Array(uo(o.update(s), o.final()));
    return Promise.resolve(i);
  }
  async decrypt(t, n, r, s) {
    if (t !== "aes-128-cbc" && t !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${t}"`);
    const o = this.createDecipher(t, n, r), i = new Uint8Array(uo(o.update(s), o.final()));
    return Promise.resolve(i);
  }
}
class R2 {
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
async function Oy() {
  const e = await F2();
  return e.name === "subtleCrypto" ? new R2(e.lib) : new j2(e.lib.createCipheriv, e.lib.createDecipheriv);
}
function z2(e) {
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
  var i = e.length, a = e.charAt(0), c = Math.log(i) / Math.log(256), u = Math.log(256) / Math.log(i);
  function h(y) {
    if (y instanceof Uint8Array || (ArrayBuffer.isView(y) ? y = new Uint8Array(y.buffer, y.byteOffset, y.byteLength) : Array.isArray(y) && (y = Uint8Array.from(y))), !(y instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (y.length === 0)
      return "";
    for (var v = 0, x = 0, L = 0, U = y.length; L !== U && y[L] === 0; )
      L++, v++;
    for (var _ = (U - L) * u + 1 >>> 0, A = new Uint8Array(_); L !== U; ) {
      for (var T = y[L], B = 0, Y = _ - 1; (T !== 0 || B < x) && Y !== -1; Y--, B++)
        T += 256 * A[Y] >>> 0, A[Y] = T % i >>> 0, T = T / i >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      x = B, L++;
    }
    for (var ee = _ - x; ee !== _ && A[ee] === 0; )
      ee++;
    for (var oe = a.repeat(v); ee < _; ++ee)
      oe += e.charAt(A[ee]);
    return oe;
  }
  function d(y) {
    if (typeof y != "string")
      throw new TypeError("Expected String");
    if (y.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, L = 0; y[v] === a; )
      x++, v++;
    for (var U = (y.length - v) * c + 1 >>> 0, _ = new Uint8Array(U); y[v]; ) {
      var A = y.charCodeAt(v);
      if (A > 255)
        return;
      var T = t[A];
      if (T === 255)
        return;
      for (var B = 0, Y = U - 1; (T !== 0 || B < L) && Y !== -1; Y--, B++)
        T += i * _[Y] >>> 0, _[Y] = T % 256 >>> 0, T = T / 256 >>> 0;
      if (T !== 0)
        throw new Error("Non-zero carry");
      L = B, v++;
    }
    for (var ee = U - L; ee !== U && _[ee] === 0; )
      ee++;
    for (var oe = new Uint8Array(x + (U - ee)), W = x; ee !== U; )
      oe[W++] = _[ee++];
    return oe;
  }
  function w(y) {
    var v = d(y);
    if (v)
      return v;
    throw new Error("Non-base" + i + " character");
  }
  return {
    encode: h,
    decodeUnsafe: d,
    decode: w
  };
}
var Hy = z2;
const G2 = Hy, K2 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var V2 = G2(K2);
const X2 = /* @__PURE__ */ cy(V2), Y2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Dy = Uint8Array.from({ length: 16 }, (e, t) => t), q2 = Dy.map((e) => (9 * e + 5) % 16);
let Lf = [Dy], Cf = [q2];
for (let e = 0; e < 4; e++)
  for (let t of [Lf, Cf])
    t.push(t[e].map((n) => Y2[n]));
const Fy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), W2 = Lf.map((e, t) => e.map((n) => Fy[t][n])), Z2 = Cf.map((e, t) => e.map((n) => Fy[t][n])), J2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Q2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Sc = (e, t) => e << t | e >>> 32 - t;
function Ip(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const vc = new Uint32Array(16);
let ex = class extends Af {
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
      vc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = J2[y], L = Q2[y], U = Lf[y], _ = Cf[y], A = W2[y], T = Z2[y];
      for (let B = 0; B < 16; B++) {
        const Y = Sc(r + Ip(y, o, a, u) + vc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Sc(a, 10) | 0, a = o, o = Y;
      }
      for (let B = 0; B < 16; B++) {
        const Y = Sc(s + Ip(v, i, c, h) + vc[_[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Sc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    vc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const tx = ai(() => new ex());
function nx(e) {
  return tx(e);
}
const Ac = BigInt(2 ** 32 - 1), gd = BigInt(32);
function jy(e, t = !1) {
  return t ? { h: Number(e & Ac), l: Number(e >> gd & Ac) } : { h: Number(e >> gd & Ac) | 0, l: Number(e & Ac) | 0 };
}
function rx(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = jy(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const ox = (e, t) => BigInt(e >>> 0) << gd | BigInt(t >>> 0), sx = (e, t, n) => e >>> n, ix = (e, t, n) => e << 32 - n | t >>> n, ax = (e, t, n) => e >>> n | t << 32 - n, cx = (e, t, n) => e << 32 - n | t >>> n, lx = (e, t, n) => e << 64 - n | t >>> n - 32, ux = (e, t, n) => e >>> n - 32 | t << 64 - n, dx = (e, t) => t, fx = (e, t) => e, hx = (e, t, n) => e << n | t >>> 32 - n, px = (e, t, n) => t << n | e >>> 32 - n, gx = (e, t, n) => t << n - 32 | e >>> 64 - n, yx = (e, t, n) => e << n - 32 | t >>> 64 - n;
function wx(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const mx = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), bx = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, xx = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Sx = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, vx = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Ax = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Je = {
  fromBig: jy,
  split: rx,
  toBig: ox,
  shrSH: sx,
  shrSL: ix,
  rotrSH: ax,
  rotrSL: cx,
  rotrBH: lx,
  rotrBL: ux,
  rotr32H: dx,
  rotr32L: fx,
  rotlSH: hx,
  rotlSL: px,
  rotlBH: gx,
  rotlBL: yx,
  add: wx,
  add3L: mx,
  add3H: bx,
  add4L: xx,
  add4H: Sx,
  add5H: Ax,
  add5L: vx
}, [Ex, kx] = Je.split([
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
].map((e) => BigInt(e))), Vo = new Uint32Array(80), Xo = new Uint32Array(80);
let Gl = class extends Af {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Vo[A] = t.getUint32(n), Xo[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Vo[A - 15] | 0, B = Xo[A - 15] | 0, Y = Je.rotrSH(T, B, 1) ^ Je.rotrSH(T, B, 8) ^ Je.shrSH(T, B, 7), ee = Je.rotrSL(T, B, 1) ^ Je.rotrSL(T, B, 8) ^ Je.shrSL(T, B, 7), oe = Vo[A - 2] | 0, W = Xo[A - 2] | 0, m = Je.rotrSH(oe, W, 19) ^ Je.rotrBH(oe, W, 61) ^ Je.shrSH(oe, W, 6), C = Je.rotrSL(oe, W, 19) ^ Je.rotrBL(oe, W, 61) ^ Je.shrSL(oe, W, 6), P = Je.add4L(ee, C, Xo[A - 7], Xo[A - 16]), M = Je.add4H(P, Y, m, Vo[A - 7], Vo[A - 16]);
      Vo[A] = M | 0, Xo[A] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = Je.rotrSH(d, w, 14) ^ Je.rotrSH(d, w, 18) ^ Je.rotrBH(d, w, 41), B = Je.rotrSL(d, w, 14) ^ Je.rotrSL(d, w, 18) ^ Je.rotrBL(d, w, 41), Y = d & y ^ ~d & x, ee = w & v ^ ~w & L, oe = Je.add5L(_, B, ee, kx[A], Xo[A]), W = Je.add5H(oe, U, T, Y, Ex[A], Vo[A]), m = oe | 0, C = Je.rotrSH(r, s, 28) ^ Je.rotrBH(r, s, 34) ^ Je.rotrBH(r, s, 39), P = Je.rotrSL(r, s, 28) ^ Je.rotrBL(r, s, 34) ^ Je.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, Z = s & i ^ s & c ^ i & c;
      U = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = Je.add(u | 0, h | 0, W | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = Je.add3L(m, P, Z);
      r = Je.add3H(F, W, C, M), s = F | 0;
    }
    ({ h: r, l: s } = Je.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Je.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Je.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Je.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = Je.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = Je.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = Je.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: _ } = Je.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, _);
  }
  roundClean() {
    Vo.fill(0), Xo.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, $x = class extends Gl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Ix = class extends Gl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Lx = class extends Gl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Cx = ai(() => new Gl());
ai(() => new $x());
ai(() => new Ix());
ai(() => new Lx());
function Ry(e) {
  return qi(e);
}
function Tx(e) {
  return Cx(e);
}
const Bx = 0;
tn.hmacSha256Sync = (e, ...t) => {
  const n = Rl.create(qi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function Nx() {
  return _e(tn.randomPrivateKey());
}
function Mx(e) {
  const t = qi(qi(e));
  return X2.encode(uo(e, t).slice(0, e.length + 4));
}
function Px(e, t) {
  return Mx(uo(new Uint8Array([e]), t.slice(0, 20)));
}
function zy(e, t = Bx) {
  const n = typeof e == "string" ? vt(e) : e, r = nx(Ry(n));
  return Px(t, r);
}
function Gy(e) {
  const t = Sf(e);
  return _e(sc(t.slice(0, 32), !0));
}
tn.hmacSha256Sync = (e, ...t) => {
  const n = Rl.create(qi, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
var hl;
(function(e) {
  e.InvalidFormat = "InvalidFormat", e.IsNotPoint = "IsNotPoint";
})(hl || (hl = {}));
async function _x(e, t, n) {
  return await (await Oy()).encrypt("aes-256-cbc", t, e, n);
}
async function Ux(e, t, n) {
  return await (await Oy()).decrypt("aes-256-cbc", t, e, n);
}
function Ky(e, t) {
  return Rl(qi, e, t);
}
function Ox(e, t) {
  if (e.length !== t.length)
    return !1;
  let n = 0;
  for (let r = 0; r < e.length; r++)
    n |= e[r] ^ t[r];
  return n === 0;
}
function Vy(e) {
  const t = Tx(e);
  return {
    encryptionKey: t.slice(0, 32),
    hmacKey: t.slice(32)
  };
}
function Hx(e) {
  return e.match(/^[0-9a-f]+$/i) !== null;
}
function Dx(e) {
  const t = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: hl.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: hl.IsNotPoint
  };
  if (e.length !== 66 && e.length !== 130)
    return t;
  const r = e.slice(0, 2);
  if (e.length === 130 && r !== "04" || e.length === 66 && r !== "02" && r !== "03" || !Hx(e))
    return t;
  try {
    return it.fromHex(e).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function Fx(e, t, n, r) {
  const s = Dx(e);
  if (!s.result)
    throw s;
  const o = tn.randomPrivateKey(), i = sc(o, !0);
  let a = If(o, e, !0);
  a = a.slice(1);
  const c = Vy(a), u = tn.randomBytes(16), h = await _x(u, c.encryptionKey, t), d = uo(u, i, h), w = Ky(c.hmacKey, d);
  let y;
  if (!r || r === "hex")
    y = _e(h);
  else if (r === "base64")
    y = C2(h);
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
async function Xy(e, t) {
  if (!t.ephemeralPK)
    throw new gp("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = t.ephemeralPK;
  let r = If(e, n, !0);
  r = r.slice(1);
  const s = Vy(r), o = vt(t.iv);
  let i;
  if (!t.cipherTextEncoding || t.cipherTextEncoding === "hex")
    i = vt(t.cipherText);
  else if (t.cipherTextEncoding === "base64")
    i = L2(t.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${t.cipherText}"`);
  const a = uo(o, vt(n), i), c = Ky(s.hmacKey, a), u = vt(t.mac);
  if (!Ox(u, c))
    throw new gp("Decryption failed: failure in MAC check");
  const h = await Ux(o, s.encryptionKey, i);
  return t.wasString ? oc(h) : h;
}
function jx(e, t) {
  const n = typeof t == "string" ? ii(t) : t, r = Gy(e), s = Ry(n), o = zl(s, e);
  return {
    signature: _e(o),
    publicKey: r
  };
}
async function Rx(e, t) {
  const n = Object.assign({}, t);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = Gy(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof e == "string", o = typeof e == "string" ? ii(e) : e, i = await Fx(n.publicKey, o, s, n.cipherTextEncoding);
  let a = JSON.stringify(i);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = jx(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function zx(e, t) {
  const n = Object.assign({}, t);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(e);
    return Xy(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Tn = {}, ea = {}, Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.decode = Rn.encode = Rn.unescape = Rn.escape = Rn.pad = void 0;
const Yy = ic;
function Tf(e) {
  return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
}
Rn.pad = Tf;
function qy(e) {
  return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Rn.escape = qy;
function Wy(e) {
  return Tf(e).replace(/-/g, "+").replace(/_/g, "/");
}
Rn.unescape = Wy;
function Gx(e) {
  return qy((0, Yy.fromByteArray)(new TextEncoder().encode(e)));
}
Rn.encode = Gx;
function Kx(e) {
  return new TextDecoder().decode((0, Yy.toByteArray)(Tf(Wy(e))));
}
Rn.decode = Kx;
var Kl = {}, Vl = {}, Zy = {}, Jy = {}, Xl = {};
Object.defineProperty(Xl, "__esModule", { value: !0 });
Xl.crypto = void 0;
Xl.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(e) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(e, "__esModule", { value: !0 }), e.wrapXOFConstructorWithOpts = e.wrapConstructorWithOpts = e.wrapConstructor = e.Hash = e.nextTick = e.swap32IfBE = e.byteSwapIfBE = e.swap8IfBE = e.isLE = void 0, e.isBytes = n, e.anumber = r, e.abytes = s, e.ahash = o, e.aexists = i, e.aoutput = a, e.u8 = c, e.u32 = u, e.clean = h, e.createView = d, e.rotr = w, e.rotl = y, e.byteSwap = v, e.byteSwap32 = x, e.bytesToHex = _, e.hexToBytes = B, e.asyncLoop = ee, e.utf8ToBytes = oe, e.bytesToUtf8 = W, e.toBytes = m, e.kdfInputToBytes = C, e.concatBytes = P, e.checkOpts = M, e.createHasher = F, e.createOptHasher = ge, e.createXOFer = ce, e.randomBytes = Ge;
  const t = Xl;
  function n($) {
    return $ instanceof Uint8Array || ArrayBuffer.isView($) && $.constructor.name === "Uint8Array";
  }
  function r($) {
    if (!Number.isSafeInteger($) || $ < 0)
      throw new Error("positive integer expected, got " + $);
  }
  function s($, ...j) {
    if (!n($))
      throw new Error("Uint8Array expected");
    if (j.length > 0 && !j.includes($.length))
      throw new Error("Uint8Array expected of length " + j + ", got length=" + $.length);
  }
  function o($) {
    if (typeof $ != "function" || typeof $.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r($.outputLen), r($.blockLen);
  }
  function i($, j = !0) {
    if ($.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (j && $.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a($, j) {
    s($);
    const ue = j.outputLen;
    if ($.length < ue)
      throw new Error("digestInto() expects output buffer of length at least " + ue);
  }
  function c($) {
    return new Uint8Array($.buffer, $.byteOffset, $.byteLength);
  }
  function u($) {
    return new Uint32Array($.buffer, $.byteOffset, Math.floor($.byteLength / 4));
  }
  function h(...$) {
    for (let j = 0; j < $.length; j++)
      $[j].fill(0);
  }
  function d($) {
    return new DataView($.buffer, $.byteOffset, $.byteLength);
  }
  function w($, j) {
    return $ << 32 - j | $ >>> j;
  }
  function y($, j) {
    return $ << j | $ >>> 32 - j >>> 0;
  }
  e.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v($) {
    return $ << 24 & 4278190080 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 255;
  }
  e.swap8IfBE = e.isLE ? ($) => $ : ($) => v($), e.byteSwapIfBE = e.swap8IfBE;
  function x($) {
    for (let j = 0; j < $.length; j++)
      $[j] = v($[j]);
    return $;
  }
  e.swap32IfBE = e.isLE ? ($) => $ : x;
  const L = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, ($, j) => j.toString(16).padStart(2, "0"));
  function _($) {
    if (s($), L)
      return $.toHex();
    let j = "";
    for (let ue = 0; ue < $.length; ue++)
      j += U[$[ue]];
    return j;
  }
  const A = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function T($) {
    if ($ >= A._0 && $ <= A._9)
      return $ - A._0;
    if ($ >= A.A && $ <= A.F)
      return $ - (A.A - 10);
    if ($ >= A.a && $ <= A.f)
      return $ - (A.a - 10);
  }
  function B($) {
    if (typeof $ != "string")
      throw new Error("hex string expected, got " + typeof $);
    if (L)
      return Uint8Array.fromHex($);
    const j = $.length, ue = j / 2;
    if (j % 2)
      throw new Error("hex string expected, got unpadded hex of length " + j);
    const me = new Uint8Array(ue);
    for (let Ne = 0, xe = 0; Ne < ue; Ne++, xe += 2) {
      const wt = T($.charCodeAt(xe)), Fe = T($.charCodeAt(xe + 1));
      if (wt === void 0 || Fe === void 0) {
        const Be = $[xe] + $[xe + 1];
        throw new Error('hex string expected, got non-hex character "' + Be + '" at index ' + xe);
      }
      me[Ne] = wt * 16 + Fe;
    }
    return me;
  }
  const Y = async () => {
  };
  e.nextTick = Y;
  async function ee($, j, ue) {
    let me = Date.now();
    for (let Ne = 0; Ne < $; Ne++) {
      ue(Ne);
      const xe = Date.now() - me;
      xe >= 0 && xe < j || (await (0, e.nextTick)(), me += xe);
    }
  }
  function oe($) {
    if (typeof $ != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode($));
  }
  function W($) {
    return new TextDecoder().decode($);
  }
  function m($) {
    return typeof $ == "string" && ($ = oe($)), s($), $;
  }
  function C($) {
    return typeof $ == "string" && ($ = oe($)), s($), $;
  }
  function P(...$) {
    let j = 0;
    for (let me = 0; me < $.length; me++) {
      const Ne = $[me];
      s(Ne), j += Ne.length;
    }
    const ue = new Uint8Array(j);
    for (let me = 0, Ne = 0; me < $.length; me++) {
      const xe = $[me];
      ue.set(xe, Ne), Ne += xe.length;
    }
    return ue;
  }
  function M($, j) {
    if (j !== void 0 && {}.toString.call(j) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign($, j);
  }
  class Z {
  }
  e.Hash = Z;
  function F($) {
    const j = (me) => $().update(m(me)).digest(), ue = $();
    return j.outputLen = ue.outputLen, j.blockLen = ue.blockLen, j.create = () => $(), j;
  }
  function ge($) {
    const j = (me, Ne) => $(Ne).update(m(me)).digest(), ue = $({});
    return j.outputLen = ue.outputLen, j.blockLen = ue.blockLen, j.create = (me) => $(me), j;
  }
  function ce($) {
    const j = (me, Ne) => $(Ne).update(m(me)).digest(), ue = $({});
    return j.outputLen = ue.outputLen, j.blockLen = ue.blockLen, j.create = (me) => $(me), j;
  }
  e.wrapConstructor = F, e.wrapConstructorWithOpts = ge, e.wrapXOFConstructorWithOpts = ce;
  function Ge($ = 32) {
    if (t.crypto && typeof t.crypto.getRandomValues == "function")
      return t.crypto.getRandomValues(new Uint8Array($));
    if (t.crypto && typeof t.crypto.randomBytes == "function")
      return Uint8Array.from(t.crypto.randomBytes($));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Jy);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.hmac = e.HMAC = void 0;
  const t = Jy;
  class n extends t.Hash {
    constructor(o, i) {
      super(), this.finished = !1, this.destroyed = !1, (0, t.ahash)(o);
      const a = (0, t.toBytes)(i);
      if (this.iHash = o.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? o.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = o.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
      this.oHash.update(u), (0, t.clean)(u);
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
      const { oHash: i, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: d } = this;
      return o = o, o.finished = c, o.destroyed = u, o.blockLen = h, o.outputLen = d, o.oHash = i._cloneInto(o.oHash), o.iHash = a._cloneInto(o.iHash), o;
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
})(Zy);
const Bi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Qy(e) {
  return e instanceof Uint8Array || ArrayBuffer.isView(e) && e.constructor.name === "Uint8Array";
}
function yd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error("positive integer expected, got " + e);
}
function ci(e, ...t) {
  if (!Qy(e))
    throw new Error("Uint8Array expected");
  if (t.length > 0 && !t.includes(e.length))
    throw new Error("Uint8Array expected of length " + t + ", got length=" + e.length);
}
function Vx(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  yd(e.outputLen), yd(e.blockLen);
}
function wd(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function ew(e, t) {
  ci(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Xx(e) {
  return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
function Yx(e) {
  return new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
}
function pl(...e) {
  for (let t = 0; t < e.length; t++)
    e[t].fill(0);
}
function Jc(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Mr(e, t) {
  return e << 32 - t | e >>> t;
}
function qx(e, t) {
  return e << t | e >>> 32 - t >>> 0;
}
const Bf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Nf(e) {
  return e << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
}
const tw = Bf ? (e) => e : (e) => Nf(e), Wx = tw;
function nw(e) {
  for (let t = 0; t < e.length; t++)
    e[t] = Nf(e[t]);
  return e;
}
const Zx = Bf ? (e) => e : nw, rw = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Jx = /* @__PURE__ */ Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function Mf(e) {
  if (ci(e), rw)
    return e.toHex();
  let t = "";
  for (let n = 0; n < e.length; n++)
    t += Jx[e[n]];
  return t;
}
const ko = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Lp(e) {
  if (e >= ko._0 && e <= ko._9)
    return e - ko._0;
  if (e >= ko.A && e <= ko.F)
    return e - (ko.A - 10);
  if (e >= ko.a && e <= ko.f)
    return e - (ko.a - 10);
}
function Qx(e) {
  if (typeof e != "string")
    throw new Error("hex string expected, got " + typeof e);
  if (rw)
    return Uint8Array.fromHex(e);
  const t = e.length, n = t / 2;
  if (t % 2)
    throw new Error("hex string expected, got unpadded hex of length " + t);
  const r = new Uint8Array(n);
  for (let s = 0, o = 0; s < n; s++, o += 2) {
    const i = Lp(e.charCodeAt(o)), a = Lp(e.charCodeAt(o + 1));
    if (i === void 0 || a === void 0) {
      const c = e[o] + e[o + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + o);
    }
    r[s] = i * 16 + a;
  }
  return r;
}
const ow = async () => {
};
async function eS(e, t, n) {
  let r = Date.now();
  for (let s = 0; s < e; s++) {
    n(s);
    const o = Date.now() - r;
    o >= 0 && o < t || (await ow(), r += o);
  }
}
function Pf(e) {
  if (typeof e != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(e));
}
function tS(e) {
  return new TextDecoder().decode(e);
}
function ac(e) {
  return typeof e == "string" && (e = Pf(e)), ci(e), e;
}
function nS(e) {
  return typeof e == "string" && (e = Pf(e)), ci(e), e;
}
function rS(...e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    const s = e[r];
    ci(s), t += s.length;
  }
  const n = new Uint8Array(t);
  for (let r = 0, s = 0; r < e.length; r++) {
    const o = e[r];
    n.set(o, s), s += o.length;
  }
  return n;
}
function oS(e, t) {
  if (t !== void 0 && {}.toString.call(t) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(e, t);
}
let sw = class {
};
function Yl(e) {
  const t = (r) => e().update(ac(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function iw(e) {
  const t = (r, s) => e(s).update(ac(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
function aw(e) {
  const t = (r, s) => e(s).update(ac(r)).digest(), n = e({});
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = (r) => e(r), t;
}
const sS = Yl, iS = iw, aS = aw;
function cS(e = 32) {
  if (Bi && typeof Bi.getRandomValues == "function")
    return Bi.getRandomValues(new Uint8Array(e));
  if (Bi && typeof Bi.randomBytes == "function")
    return Uint8Array.from(Bi.randomBytes(e));
  throw new Error("crypto.getRandomValues must be defined");
}
const lS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: sw,
  abytes: ci,
  aexists: wd,
  ahash: Vx,
  anumber: yd,
  aoutput: ew,
  asyncLoop: eS,
  byteSwap: Nf,
  byteSwap32: nw,
  byteSwapIfBE: Wx,
  bytesToHex: Mf,
  bytesToUtf8: tS,
  checkOpts: oS,
  clean: pl,
  concatBytes: rS,
  createHasher: Yl,
  createOptHasher: iw,
  createView: Jc,
  createXOFer: aw,
  hexToBytes: Qx,
  isBytes: Qy,
  isLE: Bf,
  kdfInputToBytes: nS,
  nextTick: ow,
  randomBytes: cS,
  rotl: qx,
  rotr: Mr,
  swap32IfBE: Zx,
  swap8IfBE: tw,
  toBytes: ac,
  u32: Yx,
  u8: Xx,
  utf8ToBytes: Pf,
  wrapConstructor: sS,
  wrapConstructorWithOpts: iS,
  wrapXOFConstructorWithOpts: aS
}, Symbol.toStringTag, { value: "Module" }));
function uS(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
function dS(e, t, n) {
  return e & t ^ ~e & n;
}
function fS(e, t, n) {
  return e & t ^ e & n ^ t & n;
}
class hS extends sw {
  constructor(t, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(t), this.view = Jc(this.buffer);
  }
  update(t) {
    wd(this), t = ac(t), ci(t);
    const { view: n, buffer: r, blockLen: s } = this, o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Jc(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    wd(this), ew(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, pl(this.buffer.subarray(i)), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    uS(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Jc(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
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
const Yo = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), qo = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), pS = /* @__PURE__ */ Uint32Array.from([
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
]), Wo = /* @__PURE__ */ new Uint32Array(64);
let _f = class extends hS {
  constructor(t = 32) {
    super(64, t, 8, !1), this.A = Yo[0] | 0, this.B = Yo[1] | 0, this.C = Yo[2] | 0, this.D = Yo[3] | 0, this.E = Yo[4] | 0, this.F = Yo[5] | 0, this.G = Yo[6] | 0, this.H = Yo[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      Wo[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Wo[d - 15], y = Wo[d - 2], v = Mr(w, 7) ^ Mr(w, 18) ^ w >>> 3, x = Mr(y, 17) ^ Mr(y, 19) ^ y >>> 10;
      Wo[d] = x + Wo[d - 7] + v + Wo[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = Mr(a, 6) ^ Mr(a, 11) ^ Mr(a, 25), y = h + w + dS(a, c, u) + pS[d] + Wo[d] | 0, x = (Mr(r, 2) ^ Mr(r, 13) ^ Mr(r, 22)) + fS(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    pl(Wo);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), pl(this.buffer);
  }
}, cw = class extends _f {
  constructor() {
    super(28), this.A = qo[0] | 0, this.B = qo[1] | 0, this.C = qo[2] | 0, this.D = qo[3] | 0, this.E = qo[4] | 0, this.F = qo[5] | 0, this.G = qo[6] | 0, this.H = qo[7] | 0;
  }
};
const gS = /* @__PURE__ */ Yl(() => new _f()), yS = /* @__PURE__ */ Yl(() => new cw()), wS = _f, Uf = gS, mS = cw, bS = yS, xS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: mS,
  SHA256: wS,
  sha224: bS,
  sha256: Uf
}, Symbol.toStringTag, { value: "Module" })), ql = /* @__PURE__ */ Fl(xS), SS = /* @__PURE__ */ Fl(I2);
var ta = {};
Object.defineProperty(ta, "__esModule", { value: !0 });
ta.joseToDer = ta.derToJose = void 0;
const lw = ic, uw = Rn;
function Cu(e) {
  return (e / 8 | 0) + (e % 8 === 0 ? 0 : 1);
}
const vS = {
  ES256: Cu(256),
  ES384: Cu(384),
  ES512: Cu(521)
};
function dw(e) {
  const t = vS[e];
  if (t)
    return t;
  throw new Error(`Unknown algorithm "${e}"`);
}
const gl = 128, fw = 0, AS = 32, ES = 16, kS = 2, hw = ES | AS | fw << 6, yl = kS | fw << 6;
function pw(e) {
  if (e instanceof Uint8Array)
    return e;
  if (typeof e == "string")
    return (0, lw.toByteArray)((0, uw.pad)(e));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function $S(e, t) {
  const n = pw(e), r = dw(t), s = r + 1, o = n.length;
  let i = 0;
  if (n[i++] !== hw)
    throw new Error('Could not find expected "seq"');
  let a = n[i++];
  if (a === (gl | 1) && (a = n[i++]), o - i < a)
    throw new Error(`"seq" specified length of "${a}", only "${o - i}" remaining`);
  if (n[i++] !== yl)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[i++];
  if (o - i - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${o - i - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = i;
  if (i += c, n[i++] !== yl)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[i++];
  if (o - i !== h)
    throw new Error(`"s" specified length of "${h}", expected "${o - i}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const d = i;
  if (i += h, i !== o)
    throw new Error(`Expected to consume entire array, but "${o - i}" bytes remain`);
  const w = r - c, y = r - h, v = new Uint8Array(w + c + y + h);
  for (i = 0; i < w; ++i)
    v[i] = 0;
  v.set(n.subarray(u + Math.max(-w, 0), u + c), i), i = r;
  for (const x = i; i < x + y; ++i)
    v[i] = 0;
  return v.set(n.subarray(d + Math.max(-y, 0), d + h), i), (0, uw.escape)((0, lw.fromByteArray)(v));
}
ta.derToJose = $S;
function Cp(e, t, n) {
  let r = 0;
  for (; t + r < n && e[t + r] === 0; )
    ++r;
  return e[t + r] >= gl && --r, r;
}
function IS(e, t) {
  e = pw(e);
  const n = dw(t), r = e.length;
  if (r !== n * 2)
    throw new TypeError(`"${t}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Cp(e, 0, n), o = Cp(e, n, e.length), i = n - s, a = n - o, c = 2 + i + 1 + 1 + a, u = c < gl, h = new Uint8Array((u ? 2 : 3) + c);
  let d = 0;
  return h[d++] = hw, u ? h[d++] = c : (h[d++] = gl | 1, h[d++] = c & 255), h[d++] = yl, h[d++] = i, s < 0 ? (h[d++] = 0, h.set(e.subarray(0, n), d), d += n) : (h.set(e.subarray(s, n), d), d += n - s), h[d++] = yl, h[d++] = a, o < 0 ? (h[d++] = 0, h.set(e.subarray(n), d)) : h.set(e.subarray(n + o), d), h;
}
ta.joseToDer = IS;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.InvalidTokenError = Mo.MissingParametersError = void 0;
class LS extends Error {
  constructor(t) {
    super(), this.name = "MissingParametersError", this.message = t || "";
  }
}
Mo.MissingParametersError = LS;
class CS extends Error {
  constructor(t) {
    super(), this.name = "InvalidTokenError", this.message = t || "";
  }
}
Mo.InvalidTokenError = CS;
const cc = /* @__PURE__ */ Fl(lS);
Object.defineProperty(Vl, "__esModule", { value: !0 });
Vl.SECP256K1Client = void 0;
const TS = Zy, BS = ql, Qc = SS, Tp = ta, Bp = Mo, Np = cc;
Qc.utils.hmacSha256Sync = (e, ...t) => {
  const n = TS.hmac.create(BS.sha256, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
class gw {
  static derivePublicKey(t, n = !0) {
    return t.length === 66 && (t = t.slice(0, 64)), t.length < 64 && (t = t.padStart(64, "0")), (0, Np.bytesToHex)(Qc.getPublicKey(t, n));
  }
  static signHash(t, n, r = "jose") {
    if (!t || !n)
      throw new Bp.MissingParametersError("a signing input hash and private key are all required");
    const s = Qc.signSync(t, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Np.bytesToHex)(s);
    if (r === "jose")
      return (0, Tp.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(t) {
    return (0, Tp.joseToDer)(t, "ES256");
  }
  static verifyHash(t, n, r) {
    if (!t || !n || !r)
      throw new Bp.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Qc.verify(n, t, r, { strict: !1 });
  }
}
Vl.SECP256K1Client = gw;
gw.algorithmName = "ES256K";
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.cryptoClients = e.SECP256K1Client = void 0;
  const t = Vl;
  Object.defineProperty(e, "SECP256K1Client", { enumerable: !0, get: function() {
    return t.SECP256K1Client;
  } });
  const n = {
    ES256K: t.SECP256K1Client
  };
  e.cryptoClients = n;
})(Kl);
var Xs = {};
const NS = /* @__PURE__ */ Fl(vy);
var MS = Gn && Gn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(Xs, "__esModule", { value: !0 });
Xs.hashSha256Async = Xs.hashSha256 = void 0;
const PS = ql;
function yw(e) {
  return (0, PS.sha256)(e);
}
Xs.hashSha256 = yw;
function _S(e) {
  return MS(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof e == "string" ? new TextEncoder().encode(e) : e, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = NS;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(e).digest());
      }
    } catch (t) {
      return console.log(t), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(yw(e));
    }
  });
}
Xs.hashSha256Async = _S;
var US = Gn && Gn.__awaiter || function(e, t, n, r) {
  function s(o) {
    return o instanceof n ? o : new n(function(i) {
      i(o);
    });
  }
  return new (n || (n = Promise))(function(o, i) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (d) {
        i(d);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (d) {
        i(d);
      }
    }
    function u(h) {
      h.done ? o(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
};
Object.defineProperty(ea, "__esModule", { value: !0 });
ea.TokenSigner = ea.createUnsecuredToken = void 0;
const md = Rn, Mp = Kl, OS = Mo, Pp = Xs;
function bd(e, t) {
  const n = [], r = md.encode(JSON.stringify(t));
  n.push(r);
  const s = md.encode(JSON.stringify(e));
  return n.push(s), n.join(".");
}
function HS(e) {
  return bd(e, { typ: "JWT", alg: "none" }) + ".";
}
ea.createUnsecuredToken = HS;
class DS {
  constructor(t, n) {
    if (!(t && n))
      throw new OS.MissingParametersError("a signing algorithm and private key are required");
    if (typeof t != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (t = t.toUpperCase(), !Mp.cryptoClients.hasOwnProperty(t))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = Mp.cryptoClients[t], this.rawPrivateKey = n;
  }
  header(t = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, t);
  }
  sign(t, n = !1, r = {}) {
    const s = this.header(r), o = bd(t, s), i = (0, Pp.hashSha256)(o);
    return this.createWithSignedHash(t, n, s, o, i);
  }
  signAsync(t, n = !1, r = {}) {
    return US(this, void 0, void 0, function* () {
      const s = this.header(r), o = bd(t, s), i = yield (0, Pp.hashSha256Async)(o);
      return this.createWithSignedHash(t, n, s, o, i);
    });
  }
  createWithSignedHash(t, n, r, s, o) {
    const i = this.cryptoClient.signHash(o, this.rawPrivateKey);
    return n ? {
      header: [md.encode(JSON.stringify(r))],
      payload: JSON.stringify(t),
      signature: [i]
    } : [s, i].join(".");
  }
}
ea.TokenSigner = DS;
var Wl = {};
Object.defineProperty(Wl, "__esModule", { value: !0 });
Wl.TokenVerifier = void 0;
const FS = Rn, _p = Kl, jS = Mo, Ec = Xs;
class RS {
  constructor(t, n) {
    if (!(t && n))
      throw new jS.MissingParametersError("a signing algorithm and public key are required");
    if (typeof t != "string")
      throw "signing algorithm parameter must be a string";
    if (t = t.toUpperCase(), !_p.cryptoClients.hasOwnProperty(t))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = _p.cryptoClients[t], this.rawPublicKey = n;
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
      return (0, Ec.hashSha256Async)(s).then((i) => o(i));
    {
      const i = (0, Ec.hashSha256)(s);
      return o(i);
    }
  }
  verifyExpanded(t, n) {
    const r = [t.header.join("."), FS.encode(t.payload)].join(".");
    let s = !0;
    const o = (i) => (t.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(i, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ec.hashSha256Async)(r).then((i) => o(i));
    {
      const i = (0, Ec.hashSha256)(r);
      return o(i);
    }
  }
}
Wl.TokenVerifier = RS;
var Zl = {};
Object.defineProperty(Zl, "__esModule", { value: !0 });
Zl.decodeToken = void 0;
const kc = Rn;
function zS(e) {
  if (typeof e == "string") {
    const t = e.split("."), n = JSON.parse(kc.decode(t[0])), r = JSON.parse(kc.decode(t[1])), s = t[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof e == "object") {
    if (typeof e.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let t = e.payload;
    e.payload[0] !== "{" && (t = kc.decode(t));
    const n = [];
    return e.header.map((r) => {
      const s = JSON.parse(kc.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(t),
      signature: e.signature
    };
  }
}
Zl.decodeToken = zS;
(function(e) {
  var t = Gn && Gn.__createBinding || (Object.create ? function(r, s, o, i) {
    i === void 0 && (i = o);
    var a = Object.getOwnPropertyDescriptor(s, o);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[o];
    } }), Object.defineProperty(r, i, a);
  } : function(r, s, o, i) {
    i === void 0 && (i = o), r[i] = s[o];
  }), n = Gn && Gn.__exportStar || function(r, s) {
    for (var o in r) o !== "default" && !Object.prototype.hasOwnProperty.call(s, o) && t(s, r, o);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), n(ea, e), n(Wl, e), n(Zl, e), n(Mo, e), n(Kl, e);
})(Tn);
function GS(e) {
  return `did:btc-addr:${e}`;
}
function KS(e) {
  const t = e.split(":");
  if (t.length !== 3)
    throw new pp("Decentralized IDs must have 3 parts");
  if (t[0].toLowerCase() !== "did")
    throw new pp('Decentralized IDs must start with "did"');
  return t[1].toLowerCase();
}
function ww(e) {
  if (e)
    return KS(e) === "btc-addr" ? e.split(":")[2] : void 0;
}
const VS = "1.4.0";
function XS() {
  return Nx();
}
function YS(e, t, n, r = fy.slice(), s, o = C1().getTime(), i = {}) {
  const a = (y) => {
    const v = bf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${y}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  t || (t = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, i, {
    jti: B1(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(o / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: t,
    version: VS,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Tn.SECP256K1Client.derivePublicKey(e);
  c.public_keys = [u];
  const h = zy(u);
  return c.iss = GS(h), new Tn.TokenSigner("ES256k", e).sign(c);
}
async function Up(e, t) {
  const n = oc(vt(t)), r = JSON.parse(n), s = await Xy(e, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function qS(e) {
  const t = Tn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Tn.TokenVerifier("ES256k", r).verify(e);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function WS(e) {
  const t = Tn.decodeToken(e).payload;
  if (typeof t == "string")
    throw new Error("Unexpected token payload type of string");
  const n = t.public_keys, r = ww(t.iss);
  if (n.length === 1) {
    if (zy(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function ZS(e) {
  const t = Tn.decodeToken(e).payload;
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
function JS(e) {
  const t = Tn.decodeToken(e).payload;
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
function QS(e) {
  const t = [
    JS(e),
    ZS(e),
    qS(e),
    WS(e)
  ];
  return Promise.resolve(t.every((n) => n));
}
const Op = "1.0.0";
class xs {
  constructor(t) {
    this.version = Op, this.userData = t.userData, this.transitKey = t.transitKey, this.etags = t.etags ? t.etags : {};
  }
  static fromJSON(t) {
    if (t.version !== Op)
      throw new ud(`JSON data version ${t.version} not supported by SessionData`);
    const n = {
      coreNode: t.coreNode,
      userData: t.userData,
      transitKey: t.transitKey,
      etags: t.etags
    };
    return new xs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class mw {
  constructor(t) {
    if (t) {
      const n = new xs(t);
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
class Hp extends mw {
  constructor(t) {
    super(t), this.sessionData || this.setSessionData(new xs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new hy("No session data was found.");
    return this.sessionData;
  }
  setSessionData(t) {
    return this.sessionData = t, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new xs({})), !0;
  }
}
class Dp extends mw {
  constructor(t) {
    if (super(t), t && t.storeOptions && t.storeOptions.localStorageKey && typeof t.storeOptions.localStorageKey == "string" ? this.key = t.storeOptions.localStorageKey : this.key = $1, !localStorage.getItem(this.key)) {
      const r = new xs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const t = localStorage.getItem(this.key);
    if (!t)
      throw new hy("No session data was found in localStorage");
    const n = JSON.parse(t);
    return xs.fromJSON(n);
  }
  setSessionData(t) {
    return localStorage.setItem(this.key, t.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new xs({})), !0;
  }
}
var Ka;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Ka || (Ka = {}));
var wl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(wl || (wl = {}));
Ka.Mainnet;
var Bo;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Bo || (Bo = {}));
var ao;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ao || (ao = {}));
Bo.Mainnet;
const bw = {
  chainId: Ka.Mainnet,
  transactionVersion: Bo.Mainnet,
  peerNetworkId: wl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ao.MainnetSingleSig,
    multiSig: ao.MainnetMultiSig
  },
  client: { baseUrl: py }
}, xd = {
  chainId: Ka.Testnet,
  transactionVersion: Bo.Testnet,
  peerNetworkId: wl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ao.TestnetSingleSig,
    multiSig: ao.TestnetMultiSig
  },
  client: { baseUrl: gy }
}, el = {
  ...xd,
  addressVersion: { ...xd.addressVersion },
  magicBytes: "id",
  client: { baseUrl: yy }
}, ev = {
  ...el,
  addressVersion: { ...el.addressVersion },
  client: { ...el.client }
};
function tv(e) {
  switch (e) {
    case "mainnet":
      return bw;
    case "testnet":
      return xd;
    case "devnet":
      return el;
    case "mocknet":
      return ev;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function xw(e) {
  return typeof e == "string" ? tv(e) : e;
}
var Fp;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Fp || (Fp = {}));
var jp;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(jp || (jp = {}));
var Pr;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Pr || (Pr = {}));
const Tu = ["onChainOnly", "offChainOnly", "any"];
Tu[0] + "", Pr.OnChainOnly, Tu[1] + "", Pr.OffChainOnly, Tu[2] + "", Pr.Any, Pr.OnChainOnly + "", Pr.OnChainOnly, Pr.OffChainOnly + "", Pr.OffChainOnly, Pr.Any + "", Pr.Any;
var Rp;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(Rp || (Rp = {}));
var zp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(zp || (zp = {}));
var Gp;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Gp || (Gp = {}));
var Co;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Co || (Co = {}));
var Kp;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Kp || (Kp = {}));
var Vp;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Vp || (Vp = {}));
var Xp;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Xp || (Xp = {}));
var Yp;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Yp || (Yp = {}));
var qp;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(qp || (qp = {}));
var Wp;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Wp || (Wp = {}));
var Zp;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Zp || (Zp = {}));
var Jp;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Jp || (Jp = {}));
var Qp;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(Qp || (Qp = {}));
function Sd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function nv(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Sw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function rv(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Sd(e.outputLen), Sd(e.blockLen);
}
function ov(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function sv(e, t) {
  Sw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ps = {
  number: Sd,
  bool: nv,
  bytes: Sw,
  hash: rv,
  exists: ov,
  output: sv
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Bu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), eo = (e, t) => e << 32 - t | e >>> t, iv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!iv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function av(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Of(e) {
  if (typeof e == "string" && (e = av(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let vw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function li(e) {
  const t = (r) => e().update(Of(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let Aw = class extends vw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Ps.hash(t);
    const r = Of(n);
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
    return Ps.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Ps.exists(this), Ps.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Ew = (e, t, n) => new Aw(e, t).update(n).digest();
Ew.create = (e, t) => new Aw(e, t);
function cv(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let Hf = class extends vw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Bu(this.buffer);
  }
  update(t) {
    Ps.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Of(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Bu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Ps.exists(this), Ps.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    cv(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Bu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
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
const lv = (e, t, n) => e & t ^ ~e & n, uv = (e, t, n) => e & t ^ e & n ^ t & n, dv = new Uint32Array([
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
]), Zo = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jo = new Uint32Array(64);
let kw = class extends Hf {
  constructor() {
    super(64, 32, 8, !1), this.A = Zo[0] | 0, this.B = Zo[1] | 0, this.C = Zo[2] | 0, this.D = Zo[3] | 0, this.E = Zo[4] | 0, this.F = Zo[5] | 0, this.G = Zo[6] | 0, this.H = Zo[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      Jo[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = Jo[d - 15], y = Jo[d - 2], v = eo(w, 7) ^ eo(w, 18) ^ w >>> 3, x = eo(y, 17) ^ eo(y, 19) ^ y >>> 10;
      Jo[d] = x + Jo[d - 7] + v + Jo[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = eo(a, 6) ^ eo(a, 11) ^ eo(a, 25), y = h + w + lv(a, c, u) + dv[d] + Jo[d] | 0, x = (eo(r, 2) ^ eo(r, 13) ^ eo(r, 22)) + uv(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    Jo.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, fv = class extends kw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const $w = li(() => new kw());
li(() => new fv());
var ui = {}, Df = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32decode = e.c32normalize = e.c32encode = e.c32 = void 0;
  const t = cc;
  e.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(i, a) {
    if (!i.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    i.length % 2 !== 0 && (i = `0${i}`), i = i.toLowerCase();
    let c = [], u = 0;
    for (let y = i.length - 1; y >= 0; y--)
      if (u < 4) {
        const v = n.indexOf(i[y]) >> u;
        let x = 0;
        y !== 0 && (x = n.indexOf(i[y - 1]));
        const L = 1 + u, U = x % (1 << L) << 5 - L, _ = e.c32[v + U];
        u = L, c.unshift(_);
      } else
        u = 0;
    let h = 0;
    for (let y = 0; y < c.length && c[y] === "0"; y++)
      h++;
    c = c.slice(h);
    const d = new TextDecoder().decode((0, t.hexToBytes)(i)).match(/^\u0000*/), w = d ? d[0].length : 0;
    for (let y = 0; y < w; y++)
      c.unshift(e.c32[0]);
    if (a) {
      const y = a - c.length;
      for (let v = 0; v < y; v++)
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
    const c = i.match(`^${e.c32[0]}*`), u = c ? c[0].length : 0;
    let h = [], d = 0, w = 0;
    for (let x = i.length - 1; x >= 0; x--) {
      w === 4 && (h.unshift(n[d]), w = 0, d = 0);
      const U = (e.c32.indexOf(i[x]) << w) + d, _ = n[U % 16];
      if (w += 1, d = U >> 4, d > 1 << w)
        throw new Error("Panic error in decoding.");
      h.unshift(_);
    }
    h.unshift(n[d]), h.length % 2 === 1 && h.unshift("0");
    let y = 0;
    for (let x = 0; x < h.length && h[x] === "0"; x++)
      y++;
    h = h.slice(y - y % 2);
    let v = h.join("");
    for (let x = 0; x < u; x++)
      v = `00${v}`;
    if (a) {
      const x = a * 2 - v.length;
      for (let L = 0; L < x; L += 2)
        v = `00${v}`;
    }
    return v;
  }
  e.c32decode = o;
})(Df);
var Ys = {};
Object.defineProperty(Ys, "__esModule", { value: !0 });
Ys.c32checkDecode = Ys.c32checkEncode = void 0;
const e0 = ql, t0 = cc, Da = Df;
function Iw(e) {
  const t = (0, e0.sha256)((0, e0.sha256)((0, t0.hexToBytes)(e)));
  return (0, t0.bytesToHex)(t.slice(0, 4));
}
function hv(e, t) {
  if (e < 0 || e >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!t.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  t = t.toLowerCase(), t.length % 2 !== 0 && (t = `0${t}`);
  let n = e.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Iw(`${n}${t}`), s = (0, Da.c32encode)(`${t}${r}`);
  return `${Da.c32[e]}${s}`;
}
Ys.c32checkEncode = hv;
function pv(e) {
  e = (0, Da.c32normalize)(e);
  const t = (0, Da.c32decode)(e.slice(1)), n = e[0], r = Da.c32.indexOf(n), s = t.slice(-8);
  let o = r.toString(16);
  if (o.length === 1 && (o = `0${o}`), Iw(`${o}${t.substring(0, t.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, t.substring(0, t.length - 8)];
}
Ys.c32checkDecode = pv;
var Lw = {}, na = {};
Object.defineProperty(na, "__esModule", { value: !0 });
na.decode = na.encode = void 0;
const ml = ql, n0 = cc, Cw = Hy, Tw = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function gv(e, t = "00") {
  const n = typeof e == "string" ? (0, n0.hexToBytes)(e) : e, r = typeof t == "string" ? (0, n0.hexToBytes)(t) : e;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, ml.sha256)((0, ml.sha256)(new Uint8Array([...r, ...n])));
  return Cw(Tw).encode([...r, ...n, ...s.slice(0, 4)]);
}
na.encode = gv;
function yv(e) {
  const t = Cw(Tw).decode(e), n = t.slice(0, 1), r = t.slice(1, -4), s = (0, ml.sha256)((0, ml.sha256)(new Uint8Array([...n, ...r])));
  return t.slice(-4).forEach((o, i) => {
    if (o !== s[i])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
na.decode = yv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.c32ToB58 = e.b58ToC32 = e.c32addressDecode = e.c32address = e.versions = void 0;
  const t = Ys, n = na, r = cc;
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
  function i(h, d) {
    if (!d.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, t.c32checkEncode)(h, d)}`;
  }
  e.c32address = i;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, t.c32checkDecode)(h.slice(1));
  }
  e.c32addressDecode = a;
  function c(h, d = -1) {
    const w = n.decode(h), y = (0, r.bytesToHex)(w.data), v = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let x;
    return d < 0 ? (x = v, s[v] !== void 0 && (x = s[v])) : x = d, i(x, y);
  }
  e.b58ToC32 = c;
  function u(h, d = -1) {
    const w = a(h), y = w[0], v = w[1];
    let x;
    d < 0 ? (x = y, o[y] !== void 0 && (x = o[y])) : x = d;
    let L = x.toString(16);
    return L.length === 1 && (L = `0${L}`), n.encode(v, L);
  }
  e.c32ToB58 = u;
})(Lw);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.b58ToC32 = e.c32ToB58 = e.versions = e.c32normalize = e.c32addressDecode = e.c32address = e.c32checkDecode = e.c32checkEncode = e.c32decode = e.c32encode = void 0;
  const t = Df;
  Object.defineProperty(e, "c32encode", { enumerable: !0, get: function() {
    return t.c32encode;
  } }), Object.defineProperty(e, "c32decode", { enumerable: !0, get: function() {
    return t.c32decode;
  } }), Object.defineProperty(e, "c32normalize", { enumerable: !0, get: function() {
    return t.c32normalize;
  } });
  const n = Ys;
  Object.defineProperty(e, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(e, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Lw;
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
})(ui);
function wv(e, t) {
  switch (t = xw(t ?? bw), e) {
    case Co.P2PKH:
      switch (t.transactionVersion) {
        case Bo.Mainnet:
          return ao.MainnetSingleSig;
        case Bo.Testnet:
          return ao.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    case Co.P2SH:
    case Co.P2SHNonSequential:
    case Co.P2WPKH:
    case Co.P2WSH:
    case Co.P2WSHNonSequential:
      switch (t.transactionVersion) {
        case Bo.Mainnet:
          return ao.MainnetMultiSig;
        case Bo.Testnet:
          return ao.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${t.transactionVersion} for hashMode ${e}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${e}`);
  }
}
const mv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Bw = Uint8Array.from({ length: 16 }, (e, t) => t), bv = Bw.map((e) => (9 * e + 5) % 16);
let Ff = [Bw], jf = [bv];
for (let e = 0; e < 4; e++)
  for (let t of [Ff, jf])
    t.push(t[e].map((n) => mv[n]));
const Nw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), xv = Ff.map((e, t) => e.map((n) => Nw[t][n])), Sv = jf.map((e, t) => e.map((n) => Nw[t][n])), vv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Av = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), $c = (e, t) => e << t | e >>> 32 - t;
function r0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Ic = new Uint32Array(16);
let Ev = class extends Hf {
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
      Ic[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = vv[y], L = Av[y], U = Ff[y], _ = jf[y], A = xv[y], T = Sv[y];
      for (let B = 0; B < 16; B++) {
        const Y = $c(r + r0(y, o, a, u) + Ic[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = $c(a, 10) | 0, a = o, o = Y;
      }
      for (let B = 0; B < 16; B++) {
        const Y = $c(s + r0(v, i, c, h) + Ic[_[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = $c(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Ic.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const kv = li(() => new Ev()), Lc = BigInt(2 ** 32 - 1), vd = BigInt(32);
function Mw(e, t = !1) {
  return t ? { h: Number(e & Lc), l: Number(e >> vd & Lc) } : { h: Number(e >> vd & Lc) | 0, l: Number(e & Lc) | 0 };
}
function $v(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Mw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const Iv = (e, t) => BigInt(e >>> 0) << vd | BigInt(t >>> 0), Lv = (e, t, n) => e >>> n, Cv = (e, t, n) => e << 32 - n | t >>> n, Tv = (e, t, n) => e >>> n | t << 32 - n, Bv = (e, t, n) => e << 32 - n | t >>> n, Nv = (e, t, n) => e << 64 - n | t >>> n - 32, Mv = (e, t, n) => e >>> n - 32 | t << 64 - n, Pv = (e, t) => t, _v = (e, t) => e, Uv = (e, t, n) => e << n | t >>> 32 - n, Ov = (e, t, n) => t << n | e >>> 32 - n, Hv = (e, t, n) => t << n - 32 | e >>> 64 - n, Dv = (e, t, n) => e << n - 32 | t >>> 64 - n;
function Fv(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const jv = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), Rv = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, zv = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), Gv = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Kv = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Vv = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, Qe = {
  fromBig: Mw,
  split: $v,
  toBig: Iv,
  shrSH: Lv,
  shrSL: Cv,
  rotrSH: Tv,
  rotrSL: Bv,
  rotrBH: Nv,
  rotrBL: Mv,
  rotr32H: Pv,
  rotr32L: _v,
  rotlSH: Uv,
  rotlSL: Ov,
  rotlBH: Hv,
  rotlBL: Dv,
  add: Fv,
  add3L: jv,
  add3H: Rv,
  add4L: zv,
  add4H: Gv,
  add5H: Vv,
  add5L: Kv
}, [Xv, Yv] = Qe.split([
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
].map((e) => BigInt(e))), Qo = new Uint32Array(80), es = new Uint32Array(80);
let Jl = class extends Hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      Qo[A] = t.getUint32(n), es[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = Qo[A - 15] | 0, B = es[A - 15] | 0, Y = Qe.rotrSH(T, B, 1) ^ Qe.rotrSH(T, B, 8) ^ Qe.shrSH(T, B, 7), ee = Qe.rotrSL(T, B, 1) ^ Qe.rotrSL(T, B, 8) ^ Qe.shrSL(T, B, 7), oe = Qo[A - 2] | 0, W = es[A - 2] | 0, m = Qe.rotrSH(oe, W, 19) ^ Qe.rotrBH(oe, W, 61) ^ Qe.shrSH(oe, W, 6), C = Qe.rotrSL(oe, W, 19) ^ Qe.rotrBL(oe, W, 61) ^ Qe.shrSL(oe, W, 6), P = Qe.add4L(ee, C, es[A - 7], es[A - 16]), M = Qe.add4H(P, Y, m, Qo[A - 7], Qo[A - 16]);
      Qo[A] = M | 0, es[A] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = Qe.rotrSH(d, w, 14) ^ Qe.rotrSH(d, w, 18) ^ Qe.rotrBH(d, w, 41), B = Qe.rotrSL(d, w, 14) ^ Qe.rotrSL(d, w, 18) ^ Qe.rotrBL(d, w, 41), Y = d & y ^ ~d & x, ee = w & v ^ ~w & L, oe = Qe.add5L(_, B, ee, Yv[A], es[A]), W = Qe.add5H(oe, U, T, Y, Xv[A], Qo[A]), m = oe | 0, C = Qe.rotrSH(r, s, 28) ^ Qe.rotrBH(r, s, 34) ^ Qe.rotrBH(r, s, 39), P = Qe.rotrSL(r, s, 28) ^ Qe.rotrBL(r, s, 34) ^ Qe.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, Z = s & i ^ s & c ^ i & c;
      U = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = Qe.add(u | 0, h | 0, W | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = Qe.add3L(m, P, Z);
      r = Qe.add3H(F, W, C, M), s = F | 0;
    }
    ({ h: r, l: s } = Qe.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = Qe.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = Qe.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Qe.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = Qe.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = Qe.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = Qe.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: _ } = Qe.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, _);
  }
  roundClean() {
    Qo.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, qv = class extends Jl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Wv = class extends Jl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Zv = class extends Jl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
li(() => new Jl());
li(() => new qv());
li(() => new Wv());
li(() => new Zv());
var bl = { exports: {} };
bl.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, o = "[object Arguments]", i = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", d = "[object GeneratorFunction]", w = "[object Map]", y = "[object Number]", v = "[object Object]", x = "[object Promise]", L = "[object RegExp]", U = "[object Set]", _ = "[object String]", A = "[object Symbol]", T = "[object WeakMap]", B = "[object ArrayBuffer]", Y = "[object DataView]", ee = "[object Float32Array]", oe = "[object Float64Array]", W = "[object Int8Array]", m = "[object Int16Array]", C = "[object Int32Array]", P = "[object Uint8Array]", M = "[object Uint8ClampedArray]", Z = "[object Uint16Array]", F = "[object Uint32Array]", ge = /[\\^$.*+?()[\]{}|]/g, ce = /\w*$/, Ge = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, j = {};
  j[o] = j[i] = j[B] = j[Y] = j[a] = j[c] = j[ee] = j[oe] = j[W] = j[m] = j[C] = j[w] = j[y] = j[v] = j[L] = j[U] = j[_] = j[A] = j[P] = j[M] = j[Z] = j[F] = !0, j[u] = j[h] = j[T] = !1;
  var ue = typeof Gn == "object" && Gn && Gn.Object === Object && Gn, me = typeof self == "object" && self && self.Object === Object && self, Ne = ue || me || Function("return this")(), xe = t && !t.nodeType && t, wt = xe && !0 && e && !e.nodeType && e, Fe = wt && wt.exports === xe;
  function Be(S, N) {
    return S.set(N[0], N[1]), S;
  }
  function Me(S, N) {
    return S.add(N), S;
  }
  function Bn(S, N) {
    for (var z = -1, ye = S ? S.length : 0; ++z < ye && N(S[z], z, S) !== !1; )
      ;
    return S;
  }
  function An(S, N) {
    for (var z = -1, ye = N.length, Ft = S.length; ++z < ye; )
      S[Ft + z] = N[z];
    return S;
  }
  function ft(S, N, z, ye) {
    for (var Ft = -1, En = S ? S.length : 0; ++Ft < En; )
      z = N(z, S[Ft], Ft, S);
    return z;
  }
  function Ct(S, N) {
    for (var z = -1, ye = Array(S); ++z < S; )
      ye[z] = N(z);
    return ye;
  }
  function Mt(S, N) {
    return S == null ? void 0 : S[N];
  }
  function G(S) {
    var N = !1;
    if (S != null && typeof S.toString != "function")
      try {
        N = !!(S + "");
      } catch {
      }
    return N;
  }
  function O(S) {
    var N = -1, z = Array(S.size);
    return S.forEach(function(ye, Ft) {
      z[++N] = [Ft, ye];
    }), z;
  }
  function te(S, N) {
    return function(z) {
      return S(N(z));
    };
  }
  function re(S) {
    var N = -1, z = Array(S.size);
    return S.forEach(function(ye) {
      z[++N] = ye;
    }), z;
  }
  var le = Array.prototype, bt = Function.prototype, Oe = Object.prototype, ze = Ne["__core-js_shared__"], At = function() {
    var S = /[^.]+$/.exec(ze && ze.keys && ze.keys.IE_PROTO || "");
    return S ? "Symbol(src)_1." + S : "";
  }(), He = bt.toString, $e = Oe.hasOwnProperty, Ve = Oe.toString, Ke = RegExp(
    "^" + He.call($e).replace(ge, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Xe = Fe ? Ne.Buffer : void 0, Kt = Ne.Symbol, pn = Ne.Uint8Array, dn = te(Object.getPrototypeOf, Object), Vn = Object.create, Pt = Oe.propertyIsEnumerable, gn = le.splice, yr = Object.getOwnPropertySymbols, Vr = Xe ? Xe.isBuffer : void 0, Dn = te(Object.keys, Object), wr = xr(Ne, "DataView"), yn = xr(Ne, "Map"), Dt = xr(Ne, "Promise"), dt = xr(Ne, "Set"), Lt = xr(Ne, "WeakMap"), ln = xr(Object, "create"), Lr = Xn(wr), yo = Xn(yn), E = Xn(Dt), H = Xn(dt), V = Xn(Lt), D = Kt ? Kt.prototype : void 0, Q = D ? D.valueOf : void 0;
  function ne(S) {
    var N = -1, z = S ? S.length : 0;
    for (this.clear(); ++N < z; ) {
      var ye = S[N];
      this.set(ye[0], ye[1]);
    }
  }
  function Ce() {
    this.__data__ = ln ? ln(null) : {};
  }
  function Se(S) {
    return this.has(S) && delete this.__data__[S];
  }
  function Pe(S) {
    var N = this.__data__;
    if (ln) {
      var z = N[S];
      return z === r ? void 0 : z;
    }
    return $e.call(N, S) ? N[S] : void 0;
  }
  function $t(S) {
    var N = this.__data__;
    return ln ? N[S] !== void 0 : $e.call(N, S);
  }
  function Ze(S, N) {
    var z = this.__data__;
    return z[S] = ln && N === void 0 ? r : N, this;
  }
  ne.prototype.clear = Ce, ne.prototype.delete = Se, ne.prototype.get = Pe, ne.prototype.has = $t, ne.prototype.set = Ze;
  function ht(S) {
    var N = -1, z = S ? S.length : 0;
    for (this.clear(); ++N < z; ) {
      var ye = S[N];
      this.set(ye[0], ye[1]);
    }
  }
  function at() {
    this.__data__ = [];
  }
  function I(S) {
    var N = this.__data__, z = bo(N, S);
    if (z < 0)
      return !1;
    var ye = N.length - 1;
    return z == ye ? N.pop() : gn.call(N, z, 1), !0;
  }
  function ve(S) {
    var N = this.__data__, z = bo(N, S);
    return z < 0 ? void 0 : N[z][1];
  }
  function pt(S) {
    return bo(this.__data__, S) > -1;
  }
  function un(S, N) {
    var z = this.__data__, ye = bo(z, S);
    return ye < 0 ? z.push([S, N]) : z[ye][1] = N, this;
  }
  ht.prototype.clear = at, ht.prototype.delete = I, ht.prototype.get = ve, ht.prototype.has = pt, ht.prototype.set = un;
  function xt(S) {
    var N = -1, z = S ? S.length : 0;
    for (this.clear(); ++N < z; ) {
      var ye = S[N];
      this.set(ye[0], ye[1]);
    }
  }
  function mr() {
    this.__data__ = {
      hash: new ne(),
      map: new (yn || ht)(),
      string: new ne()
    };
  }
  function Xr(S) {
    return Tr(this, S).delete(S);
  }
  function ut(S) {
    return Tr(this, S).get(S);
  }
  function zt(S) {
    return Tr(this, S).has(S);
  }
  function gi(S, N) {
    return Tr(this, S).set(S, N), this;
  }
  xt.prototype.clear = mr, xt.prototype.delete = Xr, xt.prototype.get = ut, xt.prototype.has = zt, xt.prototype.set = gi;
  function Ye(S) {
    this.__data__ = new ht(S);
  }
  function ks() {
    this.__data__ = new ht();
  }
  function br(S) {
    return this.__data__.delete(S);
  }
  function Nn(S) {
    return this.__data__.get(S);
  }
  function Mn(S) {
    return this.__data__.has(S);
  }
  function Yr(S, N) {
    var z = this.__data__;
    if (z instanceof ht) {
      var ye = z.__data__;
      if (!yn || ye.length < n - 1)
        return ye.push([S, N]), this;
      z = this.__data__ = new xt(ye);
    }
    return z.set(S, N), this;
  }
  Ye.prototype.clear = ks, Ye.prototype.delete = br, Ye.prototype.get = Nn, Ye.prototype.has = Mn, Ye.prototype.set = Yr;
  function wo(S, N) {
    var z = Fo(S) || So(S) ? Ct(S.length, String) : [], ye = z.length, Ft = !!ye;
    for (var En in S)
      $e.call(S, En) && !(Ft && (En == "length" || ba(En, ye))) && z.push(En);
    return z;
  }
  function mo(S, N, z) {
    var ye = S[N];
    (!($e.call(S, N) && Ai(ye, z)) || z === void 0 && !(N in S)) && (S[N] = z);
  }
  function bo(S, N) {
    for (var z = S.length; z--; )
      if (Ai(S[z][0], N))
        return z;
    return -1;
  }
  function ma(S, N) {
    return S && Wr(N, be(N), S);
  }
  function $s(S, N, z, ye, Ft, En, Sr) {
    var kn;
    if (ye && (kn = En ? ye(S, Ft, En, Sr) : ye(S)), kn !== void 0)
      return kn;
    if (!q(S))
      return S;
    var Ei = Fo(S);
    if (Ei) {
      if (kn = xi(S), !N)
        return mi(S, kn);
    } else {
      var vo = Br(S), xa = vo == h || vo == d;
      if (K(S))
        return xo(S, N);
      if (vo == v || vo == o || xa && !En) {
        if (G(S))
          return En ? S : {};
        if (kn = Zr(xa ? {} : S), !N)
          return bi(S, ma(kn, S));
      } else {
        if (!j[vo])
          return En ? S : {};
        kn = Do(S, vo, $s, N);
      }
    }
    Sr || (Sr = new Ye());
    var Sa = Sr.get(S);
    if (Sa)
      return Sa;
    if (Sr.set(S, kn), !Ei)
      var l = z ? Ho(S) : be(S);
    return Bn(l || S, function(p, g) {
      l && (g = p, p = S[g]), mo(kn, g, $s(p, N, z, ye, g, S, Sr));
    }), kn;
  }
  function Qn(S) {
    return q(S) ? Vn(S) : {};
  }
  function nn(S, N, z) {
    var ye = N(S);
    return Fo(S) ? ye : An(ye, z(S));
  }
  function Is(S) {
    return Ve.call(S);
  }
  function Cr(S) {
    if (!q(S) || Jr(S))
      return !1;
    var N = X(S) || G(S) ? Ke : Ge;
    return N.test(Xn(S));
  }
  function yi(S) {
    if (!Si(S))
      return Dn(S);
    var N = [];
    for (var z in Object(S))
      $e.call(S, z) && z != "constructor" && N.push(z);
    return N;
  }
  function xo(S, N) {
    if (N)
      return S.slice();
    var z = new S.constructor(S.length);
    return S.copy(z), z;
  }
  function qr(S) {
    var N = new S.constructor(S.byteLength);
    return new pn(N).set(new pn(S)), N;
  }
  function er(S, N) {
    var z = N ? qr(S.buffer) : S.buffer;
    return new S.constructor(z, S.byteOffset, S.byteLength);
  }
  function Uo(S, N, z) {
    var ye = N ? z(O(S), !0) : O(S);
    return ft(ye, Be, new S.constructor());
  }
  function wi(S) {
    var N = new S.constructor(S.source, ce.exec(S));
    return N.lastIndex = S.lastIndex, N;
  }
  function wn(S, N, z) {
    var ye = N ? z(re(S), !0) : re(S);
    return ft(ye, Me, new S.constructor());
  }
  function Oo(S) {
    return Q ? Object(Q.call(S)) : {};
  }
  function Ls(S, N) {
    var z = N ? qr(S.buffer) : S.buffer;
    return new S.constructor(z, S.byteOffset, S.length);
  }
  function mi(S, N) {
    var z = -1, ye = S.length;
    for (N || (N = Array(ye)); ++z < ye; )
      N[z] = S[z];
    return N;
  }
  function Wr(S, N, z, ye) {
    z || (z = {});
    for (var Ft = -1, En = N.length; ++Ft < En; ) {
      var Sr = N[Ft], kn = void 0;
      mo(z, Sr, kn === void 0 ? S[Sr] : kn);
    }
    return z;
  }
  function bi(S, N) {
    return Wr(S, Gt(S), N);
  }
  function Ho(S) {
    return nn(S, be, Gt);
  }
  function Tr(S, N) {
    var z = S.__data__;
    return Cs(N) ? z[typeof N == "string" ? "string" : "hash"] : z.map;
  }
  function xr(S, N) {
    var z = Mt(S, N);
    return Cr(z) ? z : void 0;
  }
  var Gt = yr ? te(yr, Object) : Te, Br = Is;
  (wr && Br(new wr(new ArrayBuffer(1))) != Y || yn && Br(new yn()) != w || Dt && Br(Dt.resolve()) != x || dt && Br(new dt()) != U || Lt && Br(new Lt()) != T) && (Br = function(S) {
    var N = Ve.call(S), z = N == v ? S.constructor : void 0, ye = z ? Xn(z) : void 0;
    if (ye)
      switch (ye) {
        case Lr:
          return Y;
        case yo:
          return w;
        case E:
          return x;
        case H:
          return U;
        case V:
          return T;
      }
    return N;
  });
  function xi(S) {
    var N = S.length, z = S.constructor(N);
    return N && typeof S[0] == "string" && $e.call(S, "index") && (z.index = S.index, z.input = S.input), z;
  }
  function Zr(S) {
    return typeof S.constructor == "function" && !Si(S) ? Qn(dn(S)) : {};
  }
  function Do(S, N, z, ye) {
    var Ft = S.constructor;
    switch (N) {
      case B:
        return qr(S);
      case a:
      case c:
        return new Ft(+S);
      case Y:
        return er(S, ye);
      case ee:
      case oe:
      case W:
      case m:
      case C:
      case P:
      case M:
      case Z:
      case F:
        return Ls(S, ye);
      case w:
        return Uo(S, ye, z);
      case y:
      case _:
        return new Ft(S);
      case L:
        return wi(S);
      case U:
        return wn(S, ye, z);
      case A:
        return Oo(S);
    }
  }
  function ba(S, N) {
    return N = N ?? s, !!N && (typeof S == "number" || $.test(S)) && S > -1 && S % 1 == 0 && S < N;
  }
  function Cs(S) {
    var N = typeof S;
    return N == "string" || N == "number" || N == "symbol" || N == "boolean" ? S !== "__proto__" : S === null;
  }
  function Jr(S) {
    return !!At && At in S;
  }
  function Si(S) {
    var N = S && S.constructor, z = typeof N == "function" && N.prototype || Oe;
    return S === z;
  }
  function Xn(S) {
    if (S != null) {
      try {
        return He.call(S);
      } catch {
      }
      try {
        return S + "";
      } catch {
      }
    }
    return "";
  }
  function vi(S) {
    return $s(S, !0, !0);
  }
  function Ai(S, N) {
    return S === N || S !== S && N !== N;
  }
  function So(S) {
    return k(S) && $e.call(S, "callee") && (!Pt.call(S, "callee") || Ve.call(S) == o);
  }
  var Fo = Array.isArray;
  function b(S) {
    return S != null && Le(S.length) && !X(S);
  }
  function k(S) {
    return ke(S) && b(S);
  }
  var K = Vr || ct;
  function X(S) {
    var N = q(S) ? Ve.call(S) : "";
    return N == h || N == d;
  }
  function Le(S) {
    return typeof S == "number" && S > -1 && S % 1 == 0 && S <= s;
  }
  function q(S) {
    var N = typeof S;
    return !!S && (N == "object" || N == "function");
  }
  function ke(S) {
    return !!S && typeof S == "object";
  }
  function be(S) {
    return b(S) ? wo(S) : yi(S);
  }
  function Te() {
    return [];
  }
  function ct() {
    return !1;
  }
  e.exports = vi;
})(bl, bl.exports);
var Jv = bl.exports;
const Pw = /* @__PURE__ */ cy(Jv);
var Ad;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ad || (Ad = {}));
function Qv(e, t) {
  return { type: Ad.Address, version: e, hash160: t };
}
function eA(e) {
  return ui.c32address(e.version, e.hash160);
}
const tA = (e) => kv($w(e)), nA = (e) => _e(tA(e));
tn.hmacSha256Sync = (e, ...t) => {
  const n = Ew.create($w, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function rA(e, t = "mainnet") {
  t = xw(t), e = typeof e == "string" ? vt(e) : e;
  const n = wv(Co.P2PKH, t), r = Qv(n, nA(e));
  return eA(r);
}
function oA(e, t) {
  const n = Tn.decodeToken(e), r = n.payload;
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
  const s = r.issuer.publicKey, o = rA(s);
  if (t !== s) {
    if (t !== o) throw new Error("Token issuer public key does not match the verifying value");
  }
  const i = new Tn.TokenVerifier(n.header.alg, s);
  if (!i)
    throw new Error("Invalid token verifier");
  if (!i.verify(e))
    throw new Error("Token verification failed");
  return n;
}
function sA(e, t = null) {
  let n;
  t ? n = oA(e, t) : n = Tn.decodeToken(e);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const o0 = "_blockstackDidCheckEchoReply", iA = "echoReply", aA = "authContinuation";
function cA(e) {
  return e ? (/^[?#]/.test(e) ? e.slice(1) : e).split("&").reduce((n, r) => {
    const [s, o] = r.split("=");
    return n[s] = o ? decodeURIComponent(o.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function lA() {
  let e;
  if (typeof self < "u")
    e = self;
  else if (typeof window < "u")
    e = window;
  else
    return !1;
  if (!e.location || !e.localStorage)
    return !1;
  const t = e[o0];
  if (typeof t == "boolean")
    return t;
  const n = cA(e.location.search), r = n[iA];
  if (r) {
    e[o0] = !0;
    const s = `echo-reply-${r}`;
    return e.localStorage.setItem(s, "success"), e.setTimeout(() => {
      const o = n[aA];
      e.location.href = o;
    }, 10), !0;
  }
  return !1;
}
class Ed {
  constructor(t) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), t && t.appConfig)
      this.appConfig = t.appConfig;
    else if (n)
      this.appConfig = new wy();
    else
      throw new L1("You need to specify options.appConfig");
    t && t.sessionStore ? this.store = t.sessionStore : n ? t ? this.store = new Dp(t.sessionOptions) : this.store = new Dp() : t ? this.store = new Hp(t.sessionOptions) : this.store = new Hp();
  }
  makeAuthRequestToken(t, n, r, s, o, i = T1().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new ud("Missing AppConfig");
    return t = t || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, o = o || c.appDomain, YS(t, n, r, s, o, i, a);
  }
  generateAndStoreTransitKey() {
    const t = this.store.getSessionData(), n = XS();
    return t.transitKey = n, this.store.setSessionData(t), n;
  }
  getAuthResponseToken() {
    var r;
    const t = (r = bf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(t).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (lA())
        return Hi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (t) {
      Hi.error(`Error checking for protocol echo reply isSignInPending: ${t}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(t = this.getAuthResponseToken(), n = Q1()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new yc("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const o = Tn.decodeToken(t).payload;
    if (typeof o == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await QS(t))
      throw new yc("Invalid authentication response.");
    let a = o.private_key, c = o.core_token;
    if (ku(o.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (o.private_key !== void 0 && o.private_key !== null)
          try {
            a = await Up(s, o.private_key);
          } catch {
            if (Hi.warn("Failed decryption of appPrivateKey, will try to use as given"), !tn.isValidPrivateKey(o.private_key))
              throw new yc("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Up(s, c);
          } catch {
            Hi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new yc("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = R1, h;
    ku(o.version, "1.2.0") && o.hubUrl !== null && o.hubUrl !== void 0 && (u = o.hubUrl), ku(o.version, "1.3.0") && o.associationToken !== null && o.associationToken !== void 0 && (h = o.associationToken);
    const d = {
      profile: o.profile,
      email: o.email,
      decentralizedID: o.iss,
      identityAddress: ww(o.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: t,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: o.appPrivateKeyFromWalletSalt,
      coreNode: o.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, w = o.profile_url;
    if (!d.profile && w) {
      const y = await n(w);
      if (!y.ok)
        d.profile = Object.assign({}, k1);
      else {
        const v = await y.text(), x = JSON.parse(v);
        d.profile = sA(x[0].token);
      }
    } else
      d.profile = o.profile;
    return r.userData = d, this.store.setSessionData(r), d;
  }
  loadUserData() {
    const t = this.store.getSessionData().userData;
    if (!t)
      throw new ud("No user data found. Did the user sign in?");
    return t;
  }
  encryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Rx(t, r);
  }
  decryptContent(t, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), zx(t, r);
  }
  signUserOut(t) {
    this.store.deleteSessionData(), t && typeof location < "u" && location.href && (location.href = t);
  }
}
Ed.prototype.makeAuthRequest = Ed.prototype.makeAuthRequestToken;
const uA = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], dA = (e = []) => {
  if (typeof window > "u")
    return [];
  const t = uA(), n = e.filter((r) => t.find((o) => o.id === r.id) ? !1 : !!Ql(r.id));
  return t.concat(n);
}, Ql = (e) => e == null ? void 0 : e.split(".").reduce((t, n) => t == null ? void 0 : t[n], window), _w = "STX_PROVIDER", qs = () => typeof window > "u" ? null : window.localStorage.getItem(_w), fA = (e) => {
  typeof window < "u" && window.localStorage.setItem(_w, e);
}, hA = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function pA(e, t) {
  const n = {};
  return Object.assign(n, hA, t), await fetch(e, n);
}
function gA(e) {
  let t = pA, n = [];
  return e.length > 0 && typeof e[0] == "function" && (t = e.shift()), e.length > 0 && (n = e), { fetchLib: t, middlewares: n };
}
function yA(...e) {
  const { fetchLib: t, middlewares: n } = gA(e);
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
var ra;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(ra || (ra = {}));
var Ws;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Ws || (Ws = {}));
var s0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(s0 || (s0 = {}));
const wA = "https://api.mainnet.hiro.so", mA = "https://api.testnet.hiro.so", bA = "http://localhost:3999", xA = ["mainnet", "testnet", "devnet", "mocknet"];
class Zs {
  constructor(t) {
    this.version = Ws.Mainnet, this.chainId = ra.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ws.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = t.url, this.fetchFn = t.fetchFn ?? yA();
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
Zs.fromName = (e) => {
  switch (e) {
    case "mainnet":
      return new kd();
    case "testnet":
      return new $d();
    case "devnet":
      return new SA();
    case "mocknet":
      return new Uw();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${xA.join(", ")}`);
  }
};
Zs.fromNameOrNetwork = (e) => typeof e != "string" && "version" in e ? e : Zs.fromName(e);
class kd extends Zs {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? wA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Mainnet, this.chainId = ra.Mainnet;
  }
}
class $d extends Zs {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? mA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Testnet, this.chainId = ra.Testnet;
  }
}
class Uw extends Zs {
  constructor(t) {
    super({
      url: (t == null ? void 0 : t.url) ?? bA,
      fetchFn: t == null ? void 0 : t.fetchFn
    }), this.version = Ws.Testnet, this.chainId = ra.Testnet;
  }
}
const SA = Uw;
var Js;
(function(e) {
  e[e.Mainnet = 1] = "Mainnet", e[e.Testnet = 2147483648] = "Testnet";
})(Js || (Js = {}));
var xl;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(xl || (xl = {}));
Js.Mainnet;
var Qs;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Qs || (Qs = {}));
var ei;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ei || (ei = {}));
Qs.Mainnet;
const vA = {
  chainId: Js.Mainnet,
  transactionVersion: Qs.Mainnet,
  peerNetworkId: xl.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ei.MainnetSingleSig,
    multiSig: ei.MainnetMultiSig
  },
  client: { baseUrl: py }
}, Id = {
  chainId: Js.Testnet,
  transactionVersion: Qs.Testnet,
  peerNetworkId: xl.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ei.TestnetSingleSig,
    multiSig: ei.TestnetMultiSig
  },
  client: { baseUrl: gy }
}, tl = {
  ...Id,
  addressVersion: { ...Id.addressVersion },
  magicBytes: "id",
  client: { baseUrl: yy }
}, AA = {
  ...tl,
  addressVersion: { ...tl.addressVersion },
  client: { ...tl.client }
};
function EA(e) {
  switch (e) {
    case "mainnet":
      return vA;
    case "testnet":
      return Id;
    case "devnet":
      return tl;
    case "mocknet":
      return AA;
    default:
      throw new Error(`Unknown network name: ${e}`);
  }
}
function kA(e) {
  return typeof e == "string" ? EA(e) : e;
}
function $A(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const i0 = /* @__PURE__ */ new Map();
function Ow(e, t) {
  const n = i0.get(e);
  if (n !== void 0)
    return n(t);
  const r = $A(e);
  return i0.set(e, r), Ow(e, t);
}
let Rt = class {
  constructor(t) {
    this.consumed = 0, this.source = typeof t == "string" ? vt(t) : t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return q1(this.readBytes(4), 0);
  }
  readUInt8() {
    return X1(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return K1(this.readBytes(2), 0);
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
    if (Ow(t, r))
      return r;
    throw n(r);
  }
};
const IA = 128, LA = 128, Hw = 16, Fs = 32, Ld = 80, eu = 65, CA = 32, TA = 64, Sl = 34, BA = 1 + 16 * 1024 * 1024, NA = 165, MA = 16, PA = 16, _A = 20, UA = PA + 2 + _A, OA = UA + 4, HA = BA + (NA + MA * OA);
var It;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(It || (It = {}));
var Cd;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3", e[e.Clarity4 = 4] = "Clarity4", e[e.Clarity5 = 5] = "Clarity5", e[e.Clarity6 = 6] = "Clarity6";
})(Cd || (Cd = {}));
var ar;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(ar || (ar = {}));
const Nu = ["onChainOnly", "offChainOnly", "any"];
Nu[0] + "", ar.OnChainOnly, Nu[1] + "", ar.OffChainOnly, Nu[2] + "", ar.Any, ar.OnChainOnly + "", ar.OnChainOnly, ar.OffChainOnly + "", ar.OffChainOnly, ar.Any + "", ar.Any;
var vl;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny", e[e.Originator = 3] = "Originator";
})(vl || (vl = {}));
var Vt;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible", e[e.Staking = 3] = "Staking", e[e.PoX = 4] = "PoX";
})(Vt || (Vt = {}));
var Qt;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(Qt || (Qt = {}));
var Ot;
(function(e) {
  e[e.P2PKH = 0] = "P2PKH", e[e.P2SH = 1] = "P2SH", e[e.P2WPKH = 2] = "P2WPKH", e[e.P2WSH = 3] = "P2WSH", e[e.P2SHNonSequential = 5] = "P2SHNonSequential", e[e.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Ot || (Ot = {}));
var Wt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Wt || (Wt = {}));
var Fa;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Fa || (Fa = {}));
var Td;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend", e[e.MaybeSent = 18] = "MaybeSent";
})(Td || (Td = {}));
var Bd;
(function(e) {
  e[e.WillNotPerform = 48] = "WillNotPerform", e[e.MayPerform = 49] = "MayPerform", e[e.WillPerform = 50] = "WillPerform";
})(Bd || (Bd = {}));
var zn;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(zn || (zn = {}));
var a0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(a0 || (a0 = {}));
var Nd;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended", e[e.ExtendedRuntime = 2] = "ExtendedRuntime", e[e.ExtendedReadCount = 3] = "ExtendedReadCount", e[e.ExtendedReadLength = 4] = "ExtendedReadLength", e[e.ExtendedWriteCount = 5] = "ExtendedWriteCount", e[e.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Nd || (Nd = {}));
var Hr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Hr || (Hr = {}));
var c0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.ServerFailureDatabase = "ServerFailureDatabase", e.ServerFailureOther = "ServerFailureOther";
})(c0 || (c0 = {}));
let tu = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Di = class extends tu {
  constructor(t) {
    super(t);
  }
}, jn = class extends tu {
  constructor(t) {
    super(t);
  }
}, Al = class extends tu {
  constructor(t) {
    super(t);
  }
}, _s = class extends tu {
  constructor(t) {
    super(t);
  }
};
function Md(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function DA(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Dw(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function FA(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Md(e.outputLen), Md(e.blockLen);
}
function jA(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function RA(e, t) {
  Dw(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Us = {
  number: Md,
  bool: DA,
  bytes: Dw,
  hash: FA,
  exists: jA,
  output: RA
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Mu = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), to = (e, t) => e << 32 - t | e >>> t, zA = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!zA)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function GA(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function Rf(e) {
  if (typeof e == "string" && (e = GA(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let Fw = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function di(e) {
  const t = (r) => e().update(Rf(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
let jw = class extends Fw {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Us.hash(t);
    const r = Rf(n);
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
    return Us.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Us.exists(this), Us.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const Rw = (e, t, n) => new jw(e, t).update(n).digest();
Rw.create = (e, t) => new jw(e, t);
function KA(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let zf = class extends Fw {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Mu(this.buffer);
  }
  update(t) {
    Us.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = Rf(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Mu(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Us.exists(this), Us.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    KA(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Mu(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
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
const VA = (e, t, n) => e & t ^ ~e & n, XA = (e, t, n) => e & t ^ e & n ^ t & n, YA = new Uint32Array([
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
]), ts = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ns = new Uint32Array(64);
let zw = class extends zf {
  constructor() {
    super(64, 32, 8, !1), this.A = ts[0] | 0, this.B = ts[1] | 0, this.C = ts[2] | 0, this.D = ts[3] | 0, this.E = ts[4] | 0, this.F = ts[5] | 0, this.G = ts[6] | 0, this.H = ts[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      ns[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = ns[d - 15], y = ns[d - 2], v = to(w, 7) ^ to(w, 18) ^ w >>> 3, x = to(y, 17) ^ to(y, 19) ^ y >>> 10;
      ns[d] = x + ns[d - 7] + v + ns[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = to(a, 6) ^ to(a, 11) ^ to(a, 25), y = h + w + VA(a, c, u) + YA[d] + ns[d] | 0, x = (to(r, 2) ^ to(r, 13) ^ to(r, 22)) + XA(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, qA = class extends zw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Gf = di(() => new zw());
di(() => new qA());
const WA = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Gw = Uint8Array.from({ length: 16 }, (e, t) => t), ZA = Gw.map((e) => (9 * e + 5) % 16);
let Kf = [Gw], Vf = [ZA];
for (let e = 0; e < 4; e++)
  for (let t of [Kf, Vf])
    t.push(t[e].map((n) => WA[n]));
const Kw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), JA = Kf.map((e, t) => e.map((n) => Kw[t][n])), QA = Vf.map((e, t) => e.map((n) => Kw[t][n])), eE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), tE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Cc = (e, t) => e << t | e >>> 32 - t;
function l0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Tc = new Uint32Array(16);
let nE = class extends zf {
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
      Tc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = eE[y], L = tE[y], U = Kf[y], _ = Vf[y], A = JA[y], T = QA[y];
      for (let B = 0; B < 16; B++) {
        const Y = Cc(r + l0(y, o, a, u) + Tc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Cc(a, 10) | 0, a = o, o = Y;
      }
      for (let B = 0; B < 16; B++) {
        const Y = Cc(s + l0(v, i, c, h) + Tc[_[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Cc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Tc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const rE = di(() => new nE()), Bc = BigInt(2 ** 32 - 1), Pd = BigInt(32);
function Vw(e, t = !1) {
  return t ? { h: Number(e & Bc), l: Number(e >> Pd & Bc) } : { h: Number(e >> Pd & Bc) | 0, l: Number(e & Bc) | 0 };
}
function oE(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Vw(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const sE = (e, t) => BigInt(e >>> 0) << Pd | BigInt(t >>> 0), iE = (e, t, n) => e >>> n, aE = (e, t, n) => e << 32 - n | t >>> n, cE = (e, t, n) => e >>> n | t << 32 - n, lE = (e, t, n) => e << 32 - n | t >>> n, uE = (e, t, n) => e << 64 - n | t >>> n - 32, dE = (e, t, n) => e >>> n - 32 | t << 64 - n, fE = (e, t) => t, hE = (e, t) => e, pE = (e, t, n) => e << n | t >>> 32 - n, gE = (e, t, n) => t << n | e >>> 32 - n, yE = (e, t, n) => t << n - 32 | e >>> 64 - n, wE = (e, t, n) => e << n - 32 | t >>> 64 - n;
function mE(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const bE = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), xE = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, SE = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), vE = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, AE = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), EE = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, et = {
  fromBig: Vw,
  split: oE,
  toBig: sE,
  shrSH: iE,
  shrSL: aE,
  rotrSH: cE,
  rotrSL: lE,
  rotrBH: uE,
  rotrBL: dE,
  rotr32H: fE,
  rotr32L: hE,
  rotlSH: pE,
  rotlSL: gE,
  rotlBH: yE,
  rotlBL: wE,
  add: mE,
  add3L: bE,
  add3H: xE,
  add4L: SE,
  add4H: vE,
  add5H: EE,
  add5L: AE
}, [kE, $E] = et.split([
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
].map((e) => BigInt(e))), rs = new Uint32Array(80), os = new Uint32Array(80);
let nu = class extends zf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      rs[A] = t.getUint32(n), os[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = rs[A - 15] | 0, B = os[A - 15] | 0, Y = et.rotrSH(T, B, 1) ^ et.rotrSH(T, B, 8) ^ et.shrSH(T, B, 7), ee = et.rotrSL(T, B, 1) ^ et.rotrSL(T, B, 8) ^ et.shrSL(T, B, 7), oe = rs[A - 2] | 0, W = os[A - 2] | 0, m = et.rotrSH(oe, W, 19) ^ et.rotrBH(oe, W, 61) ^ et.shrSH(oe, W, 6), C = et.rotrSL(oe, W, 19) ^ et.rotrBL(oe, W, 61) ^ et.shrSL(oe, W, 6), P = et.add4L(ee, C, os[A - 7], os[A - 16]), M = et.add4H(P, Y, m, rs[A - 7], rs[A - 16]);
      rs[A] = M | 0, os[A] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = et.rotrSH(d, w, 14) ^ et.rotrSH(d, w, 18) ^ et.rotrBH(d, w, 41), B = et.rotrSL(d, w, 14) ^ et.rotrSL(d, w, 18) ^ et.rotrBL(d, w, 41), Y = d & y ^ ~d & x, ee = w & v ^ ~w & L, oe = et.add5L(_, B, ee, $E[A], os[A]), W = et.add5H(oe, U, T, Y, kE[A], rs[A]), m = oe | 0, C = et.rotrSH(r, s, 28) ^ et.rotrBH(r, s, 34) ^ et.rotrBH(r, s, 39), P = et.rotrSL(r, s, 28) ^ et.rotrBL(r, s, 34) ^ et.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, Z = s & i ^ s & c ^ i & c;
      U = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = et.add(u | 0, h | 0, W | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = et.add3L(m, P, Z);
      r = et.add3H(F, W, C, M), s = F | 0;
    }
    ({ h: r, l: s } = et.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = et.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = et.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = et.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = et.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = et.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = et.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: _ } = et.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, _);
  }
  roundClean() {
    rs.fill(0), os.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, IE = class extends nu {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, LE = class extends nu {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, CE = class extends nu {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
di(() => new nu());
di(() => new IE());
const TE = di(() => new LE());
di(() => new CE());
var yt;
(function(e) {
  e.Int = "int", e.UInt = "uint", e.Buffer = "buffer", e.BoolTrue = "true", e.BoolFalse = "false", e.PrincipalStandard = "address", e.PrincipalContract = "contract", e.ResponseOk = "ok", e.ResponseErr = "err", e.OptionalNone = "none", e.OptionalSome = "some", e.List = "list", e.Tuple = "tuple", e.StringASCII = "ascii", e.StringUTF8 = "utf8";
})(yt || (yt = {}));
var hn;
(function(e) {
  e[e.int = 0] = "int", e[e.uint = 1] = "uint", e[e.buffer = 2] = "buffer", e[e.true = 3] = "true", e[e.false = 4] = "false", e[e.address = 5] = "address", e[e.contract = 6] = "contract", e[e.ok = 7] = "ok", e[e.err = 8] = "err", e[e.none = 9] = "none", e[e.some = 10] = "some", e[e.list = 11] = "list", e[e.tuple = 12] = "tuple", e[e.ascii = 13] = "ascii", e[e.utf8 = 14] = "utf8";
})(hn || (hn = {}));
function Xf(e) {
  return hn[e];
}
const BE = () => ({ type: yt.BoolTrue }), NE = () => ({ type: yt.BoolFalse }), ME = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: yt.Buffer, value: _e(e) };
}, u0 = BigInt("0xffffffffffffffffffffffffffffffff"), PE = BigInt(0), d0 = BigInt("0x7fffffffffffffffffffffffffffffff"), f0 = BigInt("-170141183460469231731687303715884105728"), _E = (e) => {
  typeof e == "string" && e.toLowerCase().startsWith("0x") && (e = fd(vt(e))), Jn(e, Uint8Array) && (e = fd(e));
  const t = Hn(e);
  if (t > d0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${d0}`);
  if (t < f0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${f0}`);
  return { type: yt.Int, value: t };
}, UE = (e) => {
  const t = Hn(e);
  if (t < PE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > u0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${u0}`);
  return { type: yt.UInt, value: t };
};
function OE(e) {
  return { type: yt.List, value: e };
}
function Xw() {
  return { type: yt.OptionalNone };
}
function Yw(e) {
  return { type: yt.OptionalSome, value: e };
}
var pe;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.Asset = 4] = "Asset", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(pe || (pe = {}));
function HE() {
  return {
    type: pe.Address,
    version: ei.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function h0(e) {
  if (e && rm(e, Sl))
    throw new Error(`Memo exceeds maximum length of ${Sl} bytes`);
  return { type: pe.MemoString, content: e };
}
function Yf(e, t) {
  return {
    type: pe.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function _d(e) {
  if (vt(e).byteLength != eu)
    throw Error("Invalid signature");
  return {
    type: pe.MessageSignature,
    data: e
  };
}
function DE(e, t, n) {
  return typeof e == "string" && (e = tk(e)), typeof n == "string" && (n = h0(n)), {
    type: pe.Payload,
    payloadType: It.TokenTransfer,
    recipient: e,
    amount: Hn(t),
    memo: n ?? h0("")
  };
}
function FE(e, t, n, r) {
  return typeof t == "string" && (t = zr(t)), typeof n == "string" && (n = zr(n)), {
    type: pe.Payload,
    payloadType: It.ContractCall,
    contractAddress: typeof e == "string" ? Es(e) : e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function jE(e) {
  return zr(e, 4, 1e5);
}
function p0(e, t, n) {
  return typeof e == "string" && (e = zr(e)), typeof t == "string" && (t = jE(t)), typeof n == "number" ? {
    type: pe.Payload,
    payloadType: It.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: pe.Payload,
    payloadType: It.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function RE() {
  return { type: pe.Payload, payloadType: It.PoisonMicroblock };
}
function g0(e, t) {
  if (e.byteLength != Fs)
    throw Error(`Coinbase buffer size must be ${Fs} bytes`);
  return t != null ? {
    type: pe.Payload,
    payloadType: It.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: pe.Payload,
    payloadType: It.Coinbase,
    coinbaseBytes: e
  };
}
function zE(e, t, n) {
  if (e.byteLength != Fs)
    throw Error(`Coinbase buffer size must be ${Fs} bytes`);
  if (n.byteLength != Ld)
    throw Error(`VRF proof buffer size must be ${Ld} bytes`);
  return {
    type: pe.Payload,
    payloadType: It.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === yt.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
function GE(e, t, n, r, s, o, i) {
  return {
    type: pe.Payload,
    payloadType: It.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function zr(e, t, n) {
  const r = t || 1, s = n || IA;
  if (rm(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pe.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function KE(e, t, n) {
  return {
    type: pe.Asset,
    address: Es(e),
    contractName: zr(t),
    assetName: zr(n)
  };
}
function Es(e) {
  const t = ui.c32addressDecode(e);
  return {
    type: pe.Address,
    version: t[0],
    hash160: t[1]
  };
}
function VE(e, t) {
  const n = Es(e), r = zr(t);
  return {
    type: pe.Principal,
    prefix: zn.Contract,
    address: n,
    contractName: r
  };
}
function XE(e) {
  const t = Es(e);
  return {
    type: pe.Principal,
    prefix: zn.Standard,
    address: t
  };
}
function Fi(e, t) {
  return {
    pubKeyEncoding: e,
    type: pe.TransactionAuthField,
    contents: t
  };
}
function Io(e) {
  switch (e.type) {
    case pe.Address:
      return lc(e);
    case pe.Principal:
      return qw(e);
    case pe.LengthPrefixedString:
      return sa(e);
    case pe.MemoString:
      return qE(e);
    case pe.Asset:
      return Zw(e);
    case pe.PostCondition:
      return Qw(e);
    case pe.PublicKey:
      return Hd(e);
    case pe.LengthPrefixedList:
      return qf(e);
    case pe.Payload:
      return em(e);
    case pe.TransactionAuthField:
      return ek(e);
    case pe.MessageSignature:
      return Wf(e);
  }
}
function lc(e) {
  const t = [];
  return t.push(vt(rc(e.version, 1))), t.push(vt(e.hash160)), an(t);
}
function oa(e) {
  const t = Jn(e, Rt) ? e : new Rt(e), n = jl(_e(t.readBytes(1))), r = _e(t.readBytes(20));
  return { type: pe.Address, version: n, hash160: r };
}
function qw(e) {
  const t = [];
  return t.push(e.prefix), (e.prefix === zn.Standard || e.prefix === zn.Contract) && t.push(lc(e.address)), e.prefix === zn.Contract && t.push(sa(e.contractName)), an(t);
}
function YE(e) {
  const t = Jn(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(zn, (o) => {
    throw new jn(`Unexpected Principal payload type: ${o}`);
  });
  if (n === zn.Origin)
    return { type: pe.Principal, prefix: n };
  const r = oa(t);
  if (n === zn.Standard)
    return { type: pe.Principal, prefix: n, address: r };
  const s = kr(t);
  return {
    type: pe.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function sa(e) {
  const t = [], n = ii(e.content), r = n.byteLength;
  return t.push(vt(rc(r, e.lengthPrefixBytes))), t.push(n), an(t);
}
function kr(e, t, n) {
  t = t || 1;
  const r = Jn(e, Rt) ? e : new Rt(e), s = jl(_e(r.readBytes(t))), o = oc(r.readBytes(s));
  return zr(o, t, n ?? 128);
}
function qE(e) {
  const t = [], n = ii(e.content), r = Ak(_e(n), Sl * 2);
  return t.push(vt(r)), an(t);
}
function Ww(e) {
  const t = Jn(e, Rt) ? e : new Rt(e);
  let n = oc(t.readBytes(Sl));
  return n = n.replace(/\u0000*$/, ""), { type: pe.MemoString, content: n };
}
function Zw(e) {
  const t = [];
  return t.push(lc(e.address)), t.push(sa(e.contractName)), t.push(sa(e.assetName)), an(t);
}
function Ud(e) {
  const t = Jn(e, Rt) ? e : new Rt(e);
  return {
    type: pe.Asset,
    address: oa(t),
    contractName: kr(t),
    assetName: kr(t)
  };
}
function qf(e) {
  const t = e.values, n = [];
  n.push(vt(rc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Io(r));
  return an(n);
}
function Jw(e, t, n) {
  const r = Jn(e, Rt) ? e : new Rt(e), s = jl(_e(r.readBytes(4))), o = [];
  for (let i = 0; i < s; i++)
    switch (t) {
      case pe.Address:
        o.push(oa(r));
        break;
      case pe.LengthPrefixedString:
        o.push(kr(r));
        break;
      case pe.MemoString:
        o.push(Ww(r));
        break;
      case pe.Asset:
        o.push(Ud(r));
        break;
      case pe.PostCondition:
        o.push(ZE(r));
        break;
      case pe.PublicKey:
        o.push(Dd(r));
        break;
      case pe.TransactionAuthField:
        o.push(QE(r));
        break;
    }
  return Yf(o, n);
}
function WE(e) {
  return _e(Qw(e));
}
function Qw(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(qw(e.principal)), (e.conditionType === Vt.Fungible || e.conditionType === Vt.NonFungible) && t.push(Zw(e.asset)), e.conditionType === Vt.NonFungible && t.push(co(e.assetName)), t.push(e.conditionCode), e.conditionType === Vt.STX || e.conditionType === Vt.Fungible || e.conditionType === Vt.Staking) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Di("The post-condition amount may not be larger than 8 bytes");
    t.push(vs(e.amount, 8));
  }
  return an(t);
}
function ZE(e) {
  const t = Jn(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(Vt, (a) => {
    throw new jn(`Could not read ${a} as PostConditionType`);
  }), r = YE(t);
  let s, o, i;
  switch (n) {
    case Vt.STX:
      return s = t.readUInt8Enum(Fa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${_e(t.readBytes(8))}`), {
        type: pe.PostCondition,
        conditionType: Vt.STX,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Vt.Fungible:
      return o = Ud(t), s = t.readUInt8Enum(Fa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${_e(t.readBytes(8))}`), {
        type: pe.PostCondition,
        conditionType: Vt.Fungible,
        principal: r,
        conditionCode: s,
        amount: i,
        asset: o
      };
    case Vt.NonFungible:
      o = Ud(t);
      const a = so(t);
      return s = t.readUInt8Enum(Td, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: pe.PostCondition,
        conditionType: Vt.NonFungible,
        principal: r,
        conditionCode: s,
        asset: o,
        assetName: a
      };
    case Vt.Staking:
      return s = t.readUInt8Enum(Fa, (c) => {
        throw new jn(`Could not read ${c} as FungibleConditionCode`);
      }), i = BigInt(`0x${_e(t.readBytes(8))}`), {
        type: pe.PostCondition,
        conditionType: Vt.Staking,
        principal: r,
        conditionCode: s,
        amount: i
      };
    case Vt.PoX: {
      const c = t.readUInt8Enum(Bd, (u) => {
        throw new jn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: pe.PostCondition,
        conditionType: Vt.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function em(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case It.TokenTransfer:
      t.push(co(e.recipient)), t.push(vs(e.amount, 8)), t.push(Io(e.memo));
      break;
    case It.ContractCall:
      t.push(Io(e.contractAddress)), t.push(Io(e.contractName)), t.push(Io(e.functionName));
      const n = new Uint8Array(4);
      Gs(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(co(r));
      });
      break;
    case It.SmartContract:
      t.push(Io(e.contractName)), t.push(Io(e.codeBody));
      break;
    case It.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Io(e.contractName)), t.push(Io(e.codeBody));
      break;
    case It.PoisonMicroblock:
      break;
    case It.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case It.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(co(e.recipient));
      break;
    case It.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(co(e.recipient ? Yw(e.recipient) : Xw())), t.push(e.vrfProof);
      break;
    case It.TenureChange:
      t.push(vt(e.tenureHash)), t.push(vt(e.previousTenureHash)), t.push(vt(e.burnViewHash)), t.push(vt(e.previousTenureEnd)), t.push(Gs(new Uint8Array(4), e.previousTenureBlocks)), t.push(Y1(new Uint8Array(1), e.cause)), t.push(vt(e.publicKeyHash));
      break;
  }
  return an(t);
}
function JE(e) {
  const t = Jn(e, Rt) ? e : new Rt(e);
  switch (t.readUInt8Enum(It, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case It.TokenTransfer:
      const r = so(t), s = Hn(t.readBytes(8)), o = Ww(t);
      return DE(r, s, o);
    case It.ContractCall:
      const i = oa(t), a = kr(t), c = kr(t), u = [], h = t.readUInt32BE();
      for (let T = 0; T < h; T++) {
        const B = so(t);
        u.push(B);
      }
      return FE(i, a, c, u);
    case It.SmartContract:
      const d = kr(t), w = kr(t, 4, 1e5);
      return p0(d, w);
    case It.VersionedSmartContract: {
      const T = t.readUInt8Enum(Cd, (ee) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ee}`);
      }), B = kr(t), Y = kr(t, 4, HA);
      return p0(B, Y, T);
    }
    case It.PoisonMicroblock:
      return RE();
    case It.Coinbase: {
      const T = t.readBytes(Fs);
      return g0(T);
    }
    case It.CoinbaseToAltRecipient: {
      const T = t.readBytes(Fs), B = so(t);
      return g0(T, B);
    }
    case It.NakamotoCoinbase: {
      const T = t.readBytes(Fs), B = so(t), Y = t.readBytes(Ld);
      return zE(T, B, Y);
    }
    case It.TenureChange:
      const y = _e(t.readBytes(20)), v = _e(t.readBytes(20)), x = _e(t.readBytes(20)), L = _e(t.readBytes(32)), U = t.readUInt32BE(), _ = t.readUInt8Enum(Nd, (T) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${T}`);
      }), A = _e(t.readBytes(20));
      return GE(y, v, x, L, U, _, A);
  }
}
function Od(e) {
  const t = Jn(e, Rt) ? e : new Rt(e);
  return _d(_e(t.readBytes(eu)));
}
function QE(e) {
  const t = Jn(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(Hr, (r) => {
    throw new jn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Hr.PublicKeyCompressed:
      return Fi(Wt.Compressed, Dd(t));
    case Hr.PublicKeyUncompressed:
      return Fi(Wt.Uncompressed, ha(Pk(Dd(t).data)));
    case Hr.SignatureCompressed:
      return Fi(Wt.Compressed, Od(t));
    case Hr.SignatureUncompressed:
      return Fi(Wt.Uncompressed, Od(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Wf(e) {
  return vt(e.data);
}
function ek(e) {
  const t = [];
  switch (e.contents.type) {
    case pe.PublicKey:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Hr.PublicKeyCompressed : Hr.PublicKeyUncompressed), t.push(vt(Mk(e.contents.data)));
      break;
    case pe.MessageSignature:
      t.push(e.pubKeyEncoding === Wt.Compressed ? Hr.SignatureCompressed : Hr.SignatureUncompressed), t.push(Wf(e.contents));
      break;
  }
  return an(t);
}
function Hd(e) {
  return e.data.slice();
}
function Dd(e) {
  const t = Jn(e, Rt) ? e : new Rt(e), n = t.readUInt8(), r = n === 4 ? TA : CA;
  return ha(an([n, t.readBytes(r)]));
}
function Zf(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ot.P2PKH || t === Ot.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ot.P2WPKH || t === Ot.P2WSH || t === Ot.P2WSHNonSequential) && !r.map((s) => s.data).every(pa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ot.P2PKH:
      return Nc(e, Ek(r[0].data));
    case Ot.P2WPKH:
      return Nc(e, kk(r[0].data));
    case Ot.P2SH:
    case Ot.P2SHNonSequential:
      return Nc(e, $k(n, r.map(Hd)));
    case Ot.P2WSH:
    case Ot.P2WSHNonSequential:
      return Nc(e, Ik(n, r.map(Hd)));
  }
}
function Nc(e, t) {
  return { type: pe.Address, version: e, hash160: t };
}
function Jf(e) {
  return ui.c32address(e.version, e.hash160);
}
function y0(e) {
  const [t, n, r] = e.split(/\.|::/);
  return KE(t, n, r);
}
function Ia(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return VE(t, n);
  } else
    return XE(e);
}
function tk(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return ok(t, n);
  } else
    return nk(e);
}
function nk(e) {
  const t = Es(e);
  return { type: yt.PrincipalStandard, value: Jf(t) };
}
function rk(e) {
  return { type: yt.PrincipalStandard, value: Jf(e) };
}
function ok(e, t) {
  const n = Es(e), r = zr(t);
  return tm(n, r);
}
function tm(e, t) {
  if (ii(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: yt.PrincipalContract,
    value: `${Jf(e)}.${t.content}`
  };
}
function sk(e) {
  return { type: yt.ResponseErr, value: e };
}
function ik(e) {
  return { type: yt.ResponseOk, value: e };
}
const ak = (e) => ({ type: yt.StringASCII, value: e }), ck = (e) => ({ type: yt.StringUTF8, value: e });
function lk(e) {
  for (const t in e)
    if (!Lk(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: yt.Tuple, value: e };
}
function so(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new Rt(vt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new Rt(e) : t = e;
  switch (t.readUInt8Enum(hn, (r) => {
    throw new jn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case hn.int:
      return _E(fd(t.readBytes(16)));
    case hn.uint:
      return UE(t.readBytes(16));
    case hn.buffer:
      const r = t.readUInt32BE();
      return ME(t.readBytes(r));
    case hn.true:
      return BE();
    case hn.false:
      return NE();
    case hn.address:
      const s = oa(t);
      return rk(s);
    case hn.contract:
      const o = oa(t), i = kr(t);
      return tm(o, i);
    case hn.ok:
      return ik(so(t));
    case hn.err:
      return sk(so(t));
    case hn.none:
      return Xw();
    case hn.some:
      return Yw(so(t));
    case hn.list:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(so(t));
      return OE(c);
    case hn.tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = kr(t).content;
        if (L === void 0)
          throw new jn('"content" is undefined');
        h[L] = so(t);
      }
      return lk(h);
    case hn.ascii:
      const d = t.readUInt32BE(), w = F1(t.readBytes(d));
      return ak(w);
    case hn.utf8:
      const y = t.readUInt32BE(), v = oc(t.readBytes(y));
      return ck(v);
    default:
      throw new jn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function ho(e, t) {
  return an([Xf(e), t]);
}
function uk(e) {
  return new Uint8Array([Xf(e.type)]);
}
function dk(e) {
  return e.type === yt.OptionalNone ? new Uint8Array([Xf(e.type)]) : ho(e.type, co(e.value));
}
function fk(e) {
  const t = new Uint8Array(4);
  return Gs(t, Math.ceil(e.value.length / 2), 0), ho(e.type, uo(t, vt(e.value)));
}
function hk(e) {
  const t = xf(_1(BigInt(e.value), BigInt(LA)), Hw);
  return ho(e.type, t);
}
function pk(e) {
  const t = xf(BigInt(e.value), Hw);
  return ho(e.type, t);
}
function gk(e) {
  return ho(e.type, lc(Es(e.value)));
}
function yk(e) {
  const [t, n] = Ck(e.value);
  return ho(e.type, uo(lc(Es(t)), sa(zr(n))));
}
function wk(e) {
  return ho(e.type, co(e.value));
}
function mk(e) {
  const t = [], n = new Uint8Array(4);
  Gs(n, e.value.length, 0), t.push(n);
  for (const r of e.value) {
    const s = co(r);
    t.push(s);
  }
  return ho(e.type, an(t));
}
function bk(e) {
  const t = [], n = new Uint8Array(4);
  Gs(n, Object.keys(e.value).length, 0), t.push(n);
  const r = Object.keys(e.value).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = zr(s);
    t.push(sa(o));
    const i = co(e.value[s]);
    t.push(i);
  }
  return ho(e.type, an(t));
}
function nm(e, t) {
  const n = [], r = t == "ascii" ? D1(e.value) : ii(e.value), s = new Uint8Array(4);
  return Gs(s, r.length, 0), n.push(s), n.push(r), ho(e.type, an(n));
}
function xk(e) {
  return nm(e, "ascii");
}
function Sk(e) {
  return nm(e, "utf8");
}
function w0(e) {
  return _e(co(e));
}
function co(e) {
  switch (e.type) {
    case yt.BoolTrue:
    case yt.BoolFalse:
      return uk(e);
    case yt.OptionalNone:
    case yt.OptionalSome:
      return dk(e);
    case yt.Buffer:
      return fk(e);
    case yt.UInt:
      return pk(e);
    case yt.Int:
      return hk(e);
    case yt.PrincipalStandard:
      return gk(e);
    case yt.PrincipalContract:
      return yk(e);
    case yt.ResponseOk:
    case yt.ResponseErr:
      return wk(e);
    case yt.List:
      return mk(e);
    case yt.Tuple:
      return bk(e);
    case yt.StringASCII:
      return xk(e);
    case yt.StringUTF8:
      return Sk(e);
    default:
      throw new Di("Unable to serialize. Invalid Clarity Value.");
  }
}
const vk = (e) => e.length % 2 ? `0${e}` : e, Ak = (e, t) => e.padEnd(t, "0"), rm = (e, t) => e ? ii(e).length > t : !1;
function Fd(e) {
  return Pw(e);
}
const Va = (e) => rE(Gf(e)), Qf = (e) => _e(TE(e)), Ek = (e) => _e(Va(e)), kk = (e) => {
  const t = Va(e), n = uo(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Va(n);
  return _e(r);
}, $k = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = an(n), s = Va(r);
  return _e(s);
}, Ik = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = an(n), s = Gf(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = an(o), a = Va(i);
  return _e(a);
};
function Lk(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function Ck(e) {
  const [t, n] = e.split(".");
  if (!t || !n)
    throw new Error(`Invalid contract identifier: ${e}`);
  return [t, n];
}
tn.hmacSha256Sync = (e, ...t) => {
  const n = Rw.create(Gf, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function ha(e) {
  return e = typeof e == "string" ? vt(e) : e, {
    type: pe.PublicKey,
    data: e
  };
}
function Tk(e, t, n = Wt.Compressed) {
  const r = G1(t), s = new fr(wp(r.r), wp(r.s)), o = it.fromSignature(e, s, r.recoveryId), i = n === Wt.Compressed;
  return o.toHex(i);
}
function Bk(e) {
  return typeof e == "string" ? e : _e(e);
}
const eh = Bk;
function om(e) {
  return (typeof e == "string" ? e.length / 2 : e.byteLength) === z1;
}
function pa(e) {
  return !eh(e).startsWith("04");
}
function Nk(e) {
  e = Sf(e);
  const t = om(e);
  return _e(sc(e.slice(0, 32), t));
}
function Mk(e) {
  return it.fromHex(eh(e)).toHex(!0);
}
function Pk(e) {
  return it.fromHex(eh(e)).toHex(!1);
}
function _k(e, t) {
  e = Sf(e);
  const [n, r] = zl(t, e.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return rc(r, 1) + fr.fromHex(n).toCompactHex();
}
function th() {
  return {
    type: pe.MessageSignature,
    data: _e(new Uint8Array(eu))
  };
}
function sm(e, t, n, r) {
  const s = Zf(0, e, 1, [ha(t)]).hash160, o = pa(t) ? Wt.Compressed : Wt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Hn(n),
    fee: Hn(r),
    keyEncoding: o,
    signature: th()
  };
}
function Xa(e) {
  return "signature" in e;
}
function m0(e) {
  return e === Ot.P2SH || e === Ot.P2WSH;
}
function Uk(e) {
  return e === Ot.P2SHNonSequential || e === Ot.P2WSHNonSequential;
}
function b0(e) {
  const t = Fd(e);
  return t.nonce = 0, t.fee = 0, Xa(t) ? t.signature = th() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Ok(e) {
  const t = [
    e.hashMode,
    vt(e.signer),
    vs(e.nonce, 8),
    vs(e.fee, 8),
    e.keyEncoding,
    Wf(e.signature)
  ];
  return an(t);
}
function Hk(e) {
  const t = [
    e.hashMode,
    vt(e.signer),
    vs(e.nonce, 8),
    vs(e.fee, 8)
  ], n = Yf(e.fields);
  t.push(qf(n));
  const r = new Uint8Array(2);
  return V1(r, e.signaturesRequired, 0), t.push(r), an(t);
}
function Dk(e, t) {
  const n = _e(t.readBytes(20)), r = BigInt(`0x${_e(t.readBytes(8))}`), s = BigInt(`0x${_e(t.readBytes(8))}`), o = t.readUInt8Enum(Wt, (a) => {
    throw new jn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ot.P2WPKH && o != Wt.Compressed)
    throw new jn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = Od(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function Fk(e, t) {
  const n = _e(t.readBytes(20)), r = BigInt("0x" + _e(t.readBytes(8))), s = BigInt("0x" + _e(t.readBytes(8))), o = Jw(t, pe.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case pe.PublicKey:
        pa(u.contents.data) || (i = !0);
        break;
      case pe.MessageSignature:
        if (u.pubKeyEncoding === Wt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new _s("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ot.P2WSH || e === Ot.P2WSHNonSequential))
    throw new _s("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Pu(e) {
  return Xa(e) ? Ok(e) : Hk(e);
}
function _u(e) {
  const t = e.readUInt8Enum(Ot, (n) => {
    throw new jn(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ot.P2PKH || t === Ot.P2WPKH ? Dk(t, e) : Fk(t, e);
}
function im(e, t, n, r) {
  const o = e + _e(new Uint8Array([t])) + _e(vs(n, 8)) + _e(vs(r, 8));
  if (vt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Qf(vt(o));
}
function am(e, t, n) {
  const r = 33 + eu, s = pa(t.data) ? Wt.Compressed : Wt.Uncompressed, o = e + vk(s.toString(16)) + n, i = vt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Qf(i);
}
function jk(e, t, n, r, s) {
  const o = im(e, t, n, r), i = _k(s, o), a = ha(Nk(s)), c = am(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function cm(e, t, n, r, s, o) {
  const i = im(e, t, n, r), a = ha(Tk(i, o, s)), c = am(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function Rk() {
  const e = sm(Ot.P2PKH, "", 0, 0);
  return e.signer = HE().hash160, e.keyEncoding = Wt.Compressed, e.signature = th(), e;
}
function x0(e, t, n) {
  return Xa(e) ? zk(e, t, n) : Gk(e, t, n);
}
function zk(e, t, n) {
  const { pubKey: r, nextSigHash: s } = cm(t, n, e.fee, e.nonce, e.keyEncoding, e.signature.data), o = Zf(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new _s(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function Gk(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case pe.PublicKey:
        pa(c.contents.data) || (o = !0), r.push(c.contents);
        break;
      case pe.MessageSignature:
        c.pubKeyEncoding === Wt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = cm(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents.data);
        if (m0(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new _s("Too many signatures");
        break;
    }
  if (m0(e.hashMode) && i !== e.signaturesRequired || Uk(e.hashMode) && i < e.signaturesRequired)
    throw new _s("Incorrect number of signatures");
  if (o && (e.hashMode === Ot.P2WSH || e.hashMode === Ot.P2WSHNonSequential))
    throw new _s("Uncompressed keys are not allowed in this hash mode");
  const a = Zf(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new _s(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function lm(e) {
  return {
    authType: Qt.Standard,
    spendingCondition: e
  };
}
function um(e, t) {
  return {
    authType: Qt.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || sm(Ot.P2PKH, "0".repeat(66), 0, 0)
  };
}
function S0(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case Qt.Standard:
        return lm(b0(e.spendingCondition));
      case Qt.Sponsored:
        return um(b0(e.spendingCondition), Rk());
      default:
        throw new Al("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function Kk(e, t) {
  switch (e.authType) {
    case Qt.Standard:
      return x0(e.spendingCondition, t, Qt.Standard);
    case Qt.Sponsored:
      return x0(e.spendingCondition, t, Qt.Standard);
    default:
      throw new Al("Invalid origin auth type");
  }
}
function Vk(e, t) {
  switch (e.authType) {
    case Qt.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Hn(t)
      };
      return { ...e, spendingCondition: n };
    case Qt.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Hn(t)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function Xk(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function Yk(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Hn(t)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function qk(e, t) {
  const n = {
    ...t,
    nonce: Hn(t.nonce),
    fee: Hn(t.fee)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function Wk(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case Qt.Standard:
      t.push(Pu(e.spendingCondition));
      break;
    case Qt.Sponsored:
      t.push(Pu(e.spendingCondition)), t.push(Pu(e.sponsorSpendingCondition));
      break;
  }
  return an(t);
}
function Zk(e) {
  const t = e.readUInt8Enum(Qt, (r) => {
    throw new jn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case Qt.Standard:
      return n = _u(e), lm(n);
    case Qt.Sponsored:
      n = _u(e);
      const r = _u(e);
      return um(n, r);
  }
}
class Jk {
  constructor({ auth: t, payload: n, postConditions: r = Yf([]), postConditionMode: s = vl.Deny, transactionVersion: o, chainId: i, network: a = "mainnet" }) {
    a = kA(a), this.transactionVersion = o ?? a.transactionVersion, this.chainId = i ?? a.chainId, this.auth = t, "amount" in n ? this.payload = {
      ...n,
      amount: Hn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = ar.Any;
  }
  signBegin() {
    const t = Fd(this);
    return t.auth = S0(t.auth), t.txid();
  }
  verifyBegin() {
    const t = Fd(this);
    return t.auth = S0(t.auth), t.txid();
  }
  verifyOrigin() {
    return Kk(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, Qt.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === Qt.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, Qt.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = typeof t == "object" && "type" in t ? t : ha(t), r = this.auth.spendingCondition;
    if (r && !Xa(r)) {
      const s = pa(n.data);
      r.fields.push(Fi(s ? Wt.Compressed : Wt.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = jk(n, r, t.fee, t.nonce, s);
    if (Xa(t))
      t.signature = _d(o);
    else {
      const a = om(s);
      t.fields.push(Fi(a ? Wt.Compressed : Wt.Uncompressed, _d(o)));
    }
    return i;
  }
  txid() {
    const t = this.serializeBytes();
    return Qf(t);
  }
  setSponsor(t) {
    if (this.auth.authType != Qt.Sponsored)
      throw new Al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = qk(this.auth, t);
  }
  setFee(t) {
    this.auth = Vk(this.auth, t);
  }
  setNonce(t) {
    this.auth = Xk(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != Qt.Sponsored)
      throw new Al("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Yk(this.auth, t);
  }
  serialize() {
    return _e(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Di('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Di('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Di('"auth" is undefined');
    if (this.payload === void 0)
      throw new Di('"payload" is undefined');
    const t = [];
    t.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Gs(n, this.chainId, 0), t.push(n), t.push(Wk(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push(qf(this.postConditions)), t.push(em(this.payload)), an(t);
  }
}
function Qk(e) {
  const t = Jn(e, Rt) ? e : new Rt(e), n = t.readUInt8Enum(Qs, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = Zk(t), o = t.readUInt8Enum(ar, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), i = t.readUInt8Enum(vl, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Jw(t, pe.PostCondition), c = JE(t), u = new Jk({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: i
  });
  return u.anchorMode = o, u;
}
const v0 = BigInt("18446744073709551615");
function Uu(e) {
  const t = Hn(e);
  if (t < 0n || t > v0)
    throw new RangeError(`Post-condition amount must be between 0 and ${v0} (u64 max), received: ${t}`);
  return t;
}
var jd;
(function(e) {
  e[e.eq = 1] = "eq", e[e.gt = 2] = "gt", e[e.lt = 4] = "lt", e[e.gte = 3] = "gte", e[e.lte = 5] = "lte", e[e.sent = 16] = "sent", e[e["not-sent"] = 17] = "not-sent", e[e["maybe-sent"] = 18] = "maybe-sent";
})(jd || (jd = {}));
var Rd;
(function(e) {
  e[e["will-not-perform"] = 48] = "will-not-perform", e[e["may-perform"] = 49] = "may-perform", e[e["will-perform"] = 50] = "will-perform";
})(Rd || (Rd = {}));
function e3(e) {
  switch (e.type) {
    case "stx-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Vt.STX,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: zn.Origin } : Ia(e.address),
        conditionCode: Mc(e.condition),
        amount: Uu(e.amount)
      };
    case "ft-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Vt.Fungible,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: zn.Origin } : Ia(e.address),
        conditionCode: Mc(e.condition),
        amount: Uu(e.amount),
        asset: y0(e.asset)
      };
    case "nft-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Vt.NonFungible,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: zn.Origin } : Ia(e.address),
        conditionCode: Mc(e.condition),
        asset: y0(e.asset),
        assetName: e.assetId
      };
    case "staking-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Vt.Staking,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: zn.Origin } : Ia(e.address),
        conditionCode: Mc(e.condition),
        amount: Uu(e.amount)
      };
    case "pox-postcondition":
      return {
        type: pe.PostCondition,
        conditionType: Vt.PoX,
        principal: e.address === "origin" ? { type: pe.Principal, prefix: zn.Origin } : Ia(e.address),
        conditionCode: t3(e.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function Mc(e) {
  return jd[e];
}
function t3(e) {
  return Rd[e];
}
function dm(e) {
  const t = e3(e);
  return WE(t);
}
function n3(e, t, n) {
  return rh(fm(e), n);
}
function fm(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Ya(r);
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
    return BigInt(`0x${s3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function nh(e, t = 8) {
  return (typeof e == "bigint" ? e : fm(e)).toString(16).padStart(t * 2, "0");
}
function rh(e, t = 16) {
  const n = nh(e, t);
  return Ya(n);
}
function r3(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
const o3 = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function s3(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += o3[n];
  return t;
}
function Ya(e) {
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
function oh(e) {
  return new TextEncoder().encode(e);
}
function i3(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function a3(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function A0(e) {
  if (e.some(a3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function sh(...e) {
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
function _o(e) {
  return sh(...e.map((t) => typeof t == "number" ? A0([t]) : t instanceof Array ? A0(t) : t));
}
function ru(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var zd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(zd || (zd = {}));
zd.Mainnet;
const c3 = 128, l3 = 128, hm = 16;
var Gd;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Gd || (Gd = {}));
var E0;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(E0 || (E0 = {}));
var k0;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(k0 || (k0 = {}));
var _r;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(_r || (_r = {}));
const Ou = ["onChainOnly", "offChainOnly", "any"];
Ou[0] + "", _r.OnChainOnly, Ou[1] + "", _r.OffChainOnly, Ou[2] + "", _r.Any, _r.OnChainOnly + "", _r.OnChainOnly, _r.OffChainOnly + "", _r.OffChainOnly, _r.Any + "", _r.Any;
var Kd;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Kd || (Kd = {}));
Kd.Mainnet;
var $0;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})($0 || ($0 = {}));
var Bs;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Bs || (Bs = {}));
var I0;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(I0 || (I0 = {}));
var L0;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(L0 || (L0 = {}));
var C0;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(C0 || (C0 = {}));
var T0;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(T0 || (T0 = {}));
var B0;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(B0 || (B0 = {}));
var N0;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(N0 || (N0 = {}));
var Vd;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Vd || (Vd = {}));
var M0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(M0 || (M0 = {}));
var P0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(P0 || (P0 = {}));
function Xd(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function u3(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function pm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function d3(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Xd(e.outputLen), Xd(e.blockLen);
}
function f3(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function h3(e, t) {
  pm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Hu = {
  number: Xd,
  bool: u3,
  bytes: pm,
  hash: d3,
  exists: f3,
  output: h3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Du = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), no = (e, t) => e << 32 - t | e >>> t, p3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!p3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function g3(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function gm(e) {
  if (typeof e == "string" && (e = g3(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
let y3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function fi(e) {
  const t = (r) => e().update(gm(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function w3(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
let ih = class extends y3 {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Du(this.buffer);
  }
  update(t) {
    Hu.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = gm(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Du(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Hu.exists(this), Hu.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    w3(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Du(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
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
const m3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ym = Uint8Array.from({ length: 16 }, (e, t) => t), b3 = ym.map((e) => (9 * e + 5) % 16);
let ah = [ym], ch = [b3];
for (let e = 0; e < 4; e++)
  for (let t of [ah, ch])
    t.push(t[e].map((n) => m3[n]));
const wm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), x3 = ah.map((e, t) => e.map((n) => wm[t][n])), S3 = ch.map((e, t) => e.map((n) => wm[t][n])), v3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), A3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pc = (e, t) => e << t | e >>> 32 - t;
function _0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const _c = new Uint32Array(16);
let E3 = class extends ih {
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
      _c[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = v3[y], L = A3[y], U = ah[y], _ = ch[y], A = x3[y], T = S3[y];
      for (let B = 0; B < 16; B++) {
        const Y = Pc(r + _0(y, o, a, u) + _c[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Pc(a, 10) | 0, a = o, o = Y;
      }
      for (let B = 0; B < 16; B++) {
        const Y = Pc(s + _0(v, i, c, h) + _c[_[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Pc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    _c.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
fi(() => new E3());
const k3 = (e, t, n) => e & t ^ ~e & n, $3 = (e, t, n) => e & t ^ e & n ^ t & n, I3 = new Uint32Array([
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
]), ss = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), is = new Uint32Array(64);
let mm = class extends ih {
  constructor() {
    super(64, 32, 8, !1), this.A = ss[0] | 0, this.B = ss[1] | 0, this.C = ss[2] | 0, this.D = ss[3] | 0, this.E = ss[4] | 0, this.F = ss[5] | 0, this.G = ss[6] | 0, this.H = ss[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      is[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = is[d - 15], y = is[d - 2], v = no(w, 7) ^ no(w, 18) ^ w >>> 3, x = no(y, 17) ^ no(y, 19) ^ y >>> 10;
      is[d] = x + is[d - 7] + v + is[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = no(a, 6) ^ no(a, 11) ^ no(a, 25), y = h + w + k3(a, c, u) + I3[d] + is[d] | 0, x = (no(r, 2) ^ no(r, 13) ^ no(r, 22)) + $3(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, L3 = class extends mm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
fi(() => new mm());
fi(() => new L3());
const Uc = BigInt(2 ** 32 - 1), Yd = BigInt(32);
function bm(e, t = !1) {
  return t ? { h: Number(e & Uc), l: Number(e >> Yd & Uc) } : { h: Number(e >> Yd & Uc) | 0, l: Number(e & Uc) | 0 };
}
function C3(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = bm(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const T3 = (e, t) => BigInt(e >>> 0) << Yd | BigInt(t >>> 0), B3 = (e, t, n) => e >>> n, N3 = (e, t, n) => e << 32 - n | t >>> n, M3 = (e, t, n) => e >>> n | t << 32 - n, P3 = (e, t, n) => e << 32 - n | t >>> n, _3 = (e, t, n) => e << 64 - n | t >>> n - 32, U3 = (e, t, n) => e >>> n - 32 | t << 64 - n, O3 = (e, t) => t, H3 = (e, t) => e, D3 = (e, t, n) => e << n | t >>> 32 - n, F3 = (e, t, n) => t << n | e >>> 32 - n, j3 = (e, t, n) => t << n - 32 | e >>> 64 - n, R3 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function z3(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const G3 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), K3 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, V3 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), X3 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, Y3 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), q3 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, tt = {
  fromBig: bm,
  split: C3,
  toBig: T3,
  shrSH: B3,
  shrSL: N3,
  rotrSH: M3,
  rotrSL: P3,
  rotrBH: _3,
  rotrBL: U3,
  rotr32H: O3,
  rotr32L: H3,
  rotlSH: D3,
  rotlSL: F3,
  rotlBH: j3,
  rotlBL: R3,
  add: z3,
  add3L: G3,
  add3H: K3,
  add4L: V3,
  add4H: X3,
  add5H: q3,
  add5L: Y3
}, [W3, Z3] = tt.split([
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
].map((e) => BigInt(e))), as = new Uint32Array(80), cs = new Uint32Array(80);
let ou = class extends ih {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      as[A] = t.getUint32(n), cs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = as[A - 15] | 0, B = cs[A - 15] | 0, Y = tt.rotrSH(T, B, 1) ^ tt.rotrSH(T, B, 8) ^ tt.shrSH(T, B, 7), ee = tt.rotrSL(T, B, 1) ^ tt.rotrSL(T, B, 8) ^ tt.shrSL(T, B, 7), oe = as[A - 2] | 0, W = cs[A - 2] | 0, m = tt.rotrSH(oe, W, 19) ^ tt.rotrBH(oe, W, 61) ^ tt.shrSH(oe, W, 6), C = tt.rotrSL(oe, W, 19) ^ tt.rotrBL(oe, W, 61) ^ tt.shrSL(oe, W, 6), P = tt.add4L(ee, C, cs[A - 7], cs[A - 16]), M = tt.add4H(P, Y, m, as[A - 7], as[A - 16]);
      as[A] = M | 0, cs[A] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = tt.rotrSH(d, w, 14) ^ tt.rotrSH(d, w, 18) ^ tt.rotrBH(d, w, 41), B = tt.rotrSL(d, w, 14) ^ tt.rotrSL(d, w, 18) ^ tt.rotrBL(d, w, 41), Y = d & y ^ ~d & x, ee = w & v ^ ~w & L, oe = tt.add5L(_, B, ee, Z3[A], cs[A]), W = tt.add5H(oe, U, T, Y, W3[A], as[A]), m = oe | 0, C = tt.rotrSH(r, s, 28) ^ tt.rotrBH(r, s, 34) ^ tt.rotrBH(r, s, 39), P = tt.rotrSL(r, s, 28) ^ tt.rotrBL(r, s, 34) ^ tt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, Z = s & i ^ s & c ^ i & c;
      U = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = tt.add(u | 0, h | 0, W | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = tt.add3L(m, P, Z);
      r = tt.add3H(F, W, C, M), s = F | 0;
    }
    ({ h: r, l: s } = tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = tt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = tt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = tt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = tt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: _ } = tt.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, _);
  }
  roundClean() {
    as.fill(0), cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, J3 = class extends ou {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Q3 = class extends ou {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, e4 = class extends ou {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
fi(() => new ou());
fi(() => new J3());
fi(() => new Q3());
fi(() => new e4());
function t4(e, t, n) {
  const s = c3;
  if (w4(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Gd.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var xn;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(xn || (xn = {}));
let n4 = class extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, xm = class extends n4 {
  constructor(t) {
    super(t);
  }
};
function su(e) {
  const t = [];
  return t.push(Ya(nh(e.version, 1))), t.push(Ya(e.hash160)), _o(t);
}
function r4(e) {
  const t = [];
  return t.push(e.prefix), t.push(su(e.address)), e.prefix === Vd.Contract && t.push(qa(e.contractName)), _o(t);
}
function qa(e) {
  const t = [], n = oh(e.content), r = n.byteLength;
  return t.push(Ya(nh(r, e.lengthPrefixBytes))), t.push(n), _o(t);
}
function o4(e) {
  const t = [];
  return t.push(su(e.address)), t.push(qa(e.contractName)), t.push(qa(e.assetName)), _o(t);
}
function Sm(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(r4(e.principal)), (e.conditionType === Bs.Fungible || e.conditionType === Bs.NonFungible) && t.push(o4(e.assetInfo)), e.conditionType === Bs.NonFungible && t.push(ti(e.assetName)), t.push(e.conditionCode), e.conditionType === Bs.STX || e.conditionType === Bs.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new xm("The post-condition amount may not be larger than 8 bytes");
    t.push(n3(e.amount, !1, 8));
  }
  return _o(t);
}
function po(e, t) {
  return _o([e, t]);
}
function s4(e) {
  return new Uint8Array([e.type]);
}
function i4(e) {
  return e.type === xn.OptionalNone ? new Uint8Array([e.type]) : po(e.type, ti(e.value));
}
function a4(e) {
  const t = new Uint8Array(4);
  return ru(t, e.buffer.length, 0), po(e.type, sh(t, e.buffer));
}
function c4(e) {
  const t = rh(r3(e.value, BigInt(l3)), hm);
  return po(e.type, t);
}
function l4(e) {
  const t = rh(e.value, hm);
  return po(e.type, t);
}
function u4(e) {
  return po(e.type, su(e.address));
}
function d4(e) {
  return po(e.type, sh(su(e.address), qa(e.contractName)));
}
function f4(e) {
  return po(e.type, ti(e.value));
}
function h4(e) {
  const t = [], n = new Uint8Array(4);
  ru(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = ti(r);
    t.push(s);
  }
  return po(e.type, _o(t));
}
function p4(e) {
  const t = [], n = new Uint8Array(4);
  ru(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = t4(s);
    t.push(qa(o));
    const i = ti(e.data[s]);
    t.push(i);
  }
  return po(e.type, _o(t));
}
function vm(e, t) {
  const n = [], r = t == "ascii" ? i3(e.data) : oh(e.data), s = new Uint8Array(4);
  return ru(s, r.length, 0), n.push(s), n.push(r), po(e.type, _o(n));
}
function g4(e) {
  return vm(e, "ascii");
}
function y4(e) {
  return vm(e, "utf8");
}
function ti(e) {
  switch (e.type) {
    case xn.BoolTrue:
    case xn.BoolFalse:
      return s4(e);
    case xn.OptionalNone:
    case xn.OptionalSome:
      return i4(e);
    case xn.Buffer:
      return a4(e);
    case xn.UInt:
      return l4(e);
    case xn.Int:
      return c4(e);
    case xn.PrincipalStandard:
      return u4(e);
    case xn.PrincipalContract:
      return d4(e);
    case xn.ResponseOk:
    case xn.ResponseErr:
      return f4(e);
    case xn.List:
      return h4(e);
    case xn.Tuple:
      return p4(e);
    case xn.StringASCII:
      return g4(e);
    case xn.StringUTF8:
      return y4(e);
    default:
      throw new xm("Unable to serialize. Invalid Clarity Value.");
  }
}
const w4 = (e, t) => e ? oh(e).length > t : !1, m4 = "connect-ui";
let nl, Am, cr = !1, qd = !1;
const Po = (e, t = "") => () => {
}, b4 = (e, t) => () => {
}, x4 = "{visibility:hidden}.hydrated{visibility:inherit}", U0 = {}, S4 = "http://www.w3.org/2000/svg", v4 = "http://www.w3.org/1999/xhtml", A4 = (e) => e != null, lh = (e) => (e = typeof e, e === "object" || e === "function");
function Em(e) {
  var t, n, r;
  return (r = (n = (t = e.head) === null || t === void 0 ? void 0 : t.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const We = (e, t, ...n) => {
  let r = null, s = !1, o = !1;
  const i = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof e != "function" && !lh(r)) && (r = String(r)), s && o ? i[i.length - 1].$text$ += r : i.push(s ? Wd(null, r) : r), o = s);
  };
  if (a(n), t) {
    const u = t.className || t.class;
    u && (t.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Wd(e, null);
  return c.$attrs$ = t, i.length > 0 && (c.$children$ = i), c;
}, Wd = (e, t) => {
  const n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, E4 = {}, k4 = (e) => e && e.$tag$ === E4, $4 = (e, t) => e != null && !lh(e) && t & 4 ? e === "false" ? !1 : e === "" || !!e : e, I4 = (e) => ga(e).$hostElement$, L4 = (e, t, n) => {
  const r = Un.ce(t, n);
  return e.dispatchEvent(r), r;
}, O0 = /* @__PURE__ */ new WeakMap(), C4 = (e, t, n) => {
  let r = El.get(e);
  q4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = t : r.replaceSync(t)) : r = t, El.set(e, r);
}, T4 = (e, t, n, r) => {
  var s;
  let o = km(t);
  const i = El.get(o);
  if (e = e.nodeType === 11 ? e : lo, i)
    if (typeof i == "string") {
      e = e.head || e;
      let a = O0.get(e), c;
      if (a || O0.set(e, a = /* @__PURE__ */ new Set()), !a.has(o)) {
        {
          c = lo.createElement("style"), c.innerHTML = i;
          const u = (s = Un.$nonce$) !== null && s !== void 0 ? s : Em(lo);
          u != null && c.setAttribute("nonce", u), e.insertBefore(c, e.querySelector("link"));
        }
        a && a.add(o);
      }
    } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]);
  return o;
}, B4 = (e) => {
  const t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, s = Po("attachStyles", t.$tagName$), o = T4(n.shadowRoot ? n.shadowRoot : n.getRootNode(), t);
  r & 10 && (n["s-sc"] = o, n.classList.add(o + "-h")), s();
}, km = (e, t) => "sc-" + e.$tagName$, H0 = (e, t, n, r, s, o) => {
  if (n !== r) {
    let i = F0(e, t), a = t.toLowerCase();
    if (t === "class") {
      const c = e.classList, u = D0(n), h = D0(r);
      c.remove(...u.filter((d) => d && !h.includes(d))), c.add(...h.filter((d) => d && !u.includes(d)));
    } else if (!i && t[0] === "o" && t[1] === "n")
      t[2] === "-" ? t = t.slice(3) : F0(iu, a) ? t = a.slice(2) : t = a[2] + t.slice(3), n && Un.rel(e, t, n, !1), r && Un.ael(e, t, r, !1);
    else {
      const c = lh(r);
      if ((i || c && r !== null) && !s)
        try {
          if (e.tagName.includes("-"))
            e[t] = r;
          else {
            const u = r ?? "";
            t === "list" ? i = !1 : (n == null || e[t] != u) && (e[t] = u);
          }
        } catch {
        }
      r == null || r === !1 ? (r !== !1 || e.getAttribute(t) === "") && e.removeAttribute(t) : (!i || o & 4 || s) && !c && (r = r === !0 ? "" : r, e.setAttribute(t, r));
    }
  }
}, N4 = /\s/, D0 = (e) => e ? e.split(N4) : [], $m = (e, t, n, r) => {
  const s = t.$elm$.nodeType === 11 && t.$elm$.host ? t.$elm$.host : t.$elm$, o = e && e.$attrs$ || U0, i = t.$attrs$ || U0;
  for (r in o)
    r in i || H0(s, r, o[r], void 0, n, t.$flags$);
  for (r in i)
    H0(s, r, o[r], i[r], n, t.$flags$);
}, uh = (e, t, n, r) => {
  const s = t.$children$[n];
  let o = 0, i, a;
  if (s.$text$ !== null)
    i = s.$elm$ = lo.createTextNode(s.$text$);
  else {
    if (cr || (cr = s.$tag$ === "svg"), i = s.$elm$ = lo.createElementNS(cr ? S4 : v4, s.$tag$), cr && s.$tag$ === "foreignObject" && (cr = !1), $m(null, s, cr), A4(nl) && i["s-si"] !== nl && i.classList.add(i["s-si"] = nl), s.$children$)
      for (o = 0; o < s.$children$.length; ++o)
        a = uh(e, s, o), a && i.appendChild(a);
    s.$tag$ === "svg" ? cr = !1 : i.tagName === "foreignObject" && (cr = !0);
  }
  return i;
}, Im = (e, t, n, r, s, o) => {
  let i = e, a;
  for (i.shadowRoot && i.tagName === Am && (i = i.shadowRoot); s <= o; ++s)
    r[s] && (a = uh(null, n, s), a && (r[s].$elm$ = a, i.insertBefore(a, t)));
}, Lm = (e, t, n, r, s) => {
  for (; t <= n; ++t)
    (r = e[t]) && (s = r.$elm$, s.remove());
}, M4 = (e, t, n, r) => {
  let s = 0, o = 0, i = t.length - 1, a = t[0], c = t[i], u = r.length - 1, h = r[0], d = r[u], w;
  for (; s <= i && o <= u; )
    a == null ? a = t[++s] : c == null ? c = t[--i] : h == null ? h = r[++o] : d == null ? d = r[--u] : Oc(a, h) ? (Pa(a, h), a = t[++s], h = r[++o]) : Oc(c, d) ? (Pa(c, d), c = t[--i], d = r[--u]) : Oc(a, d) ? (Pa(a, d), e.insertBefore(a.$elm$, c.$elm$.nextSibling), a = t[++s], d = r[--u]) : Oc(c, h) ? (Pa(c, h), e.insertBefore(c.$elm$, a.$elm$), c = t[--i], h = r[++o]) : (w = uh(t && t[o], n, o), h = r[++o], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > i ? Im(e, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, o, u) : o > u && Lm(t, s, i);
}, Oc = (e, t) => e.$tag$ === t.$tag$, Pa = (e, t) => {
  const n = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, o = t.$tag$, i = t.$text$;
  i === null ? (cr = o === "svg" ? !0 : o === "foreignObject" ? !1 : cr, $m(e, t, cr), r !== null && s !== null ? M4(n, r, t, s) : s !== null ? (e.$text$ !== null && (n.textContent = ""), Im(n, null, t, s, 0, s.length - 1)) : r !== null && Lm(r, 0, r.length - 1), cr && o === "svg" && (cr = !1)) : e.$text$ !== i && (n.data = i);
}, P4 = (e, t) => {
  const n = e.$hostElement$, r = e.$vnode$ || Wd(null, null), s = k4(t) ? t : We(null, null, t);
  Am = n.tagName, s.$tag$ = null, s.$flags$ |= 4, e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, nl = n["s-sc"], Pa(r, s);
}, Cm = (e, t) => {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((n) => e.$onRenderResolve$ = n));
}, dh = (e, t) => {
  if (e.$flags$ |= 16, e.$flags$ & 4) {
    e.$flags$ |= 512;
    return;
  }
  return Cm(e, e.$ancestorComponent$), Z4(() => _4(e, t));
}, _4 = (e, t) => {
  const n = Po("scheduleUpdate", e.$cmpMeta$.$tagName$), r = e.$lazyInstance$;
  let s;
  return n(), D4(s, () => U4(e, r, t));
}, U4 = async (e, t, n) => {
  const r = e.$hostElement$, s = Po("update", e.$cmpMeta$.$tagName$), o = r["s-rc"];
  n && B4(e);
  const i = Po("render", e.$cmpMeta$.$tagName$);
  O4(e, t), o && (o.map((a) => a()), r["s-rc"] = void 0), i(), s();
  {
    const a = r["s-p"], c = () => H4(e);
    a.length === 0 ? c() : (Promise.all(a).then(c), e.$flags$ |= 4, a.length = 0);
  }
}, O4 = (e, t, n) => {
  try {
    t = t.render(), e.$flags$ &= -17, e.$flags$ |= 2, P4(e, t);
  } catch (r) {
    Wa(r, e.$hostElement$);
  }
  return null;
}, H4 = (e) => {
  const t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = Po("postUpdate", t), s = e.$ancestorComponent$;
  e.$flags$ & 64 ? r() : (e.$flags$ |= 64, Bm(n), r(), e.$onReadyResolve$(n), s || Tm()), e.$onRenderResolve$ && (e.$onRenderResolve$(), e.$onRenderResolve$ = void 0), e.$flags$ & 512 && hh(() => dh(e, !1)), e.$flags$ &= -517;
}, Tm = (e) => {
  Bm(lo.documentElement), hh(() => L4(iu, "appload", { detail: { namespace: m4 } }));
}, D4 = (e, t) => e && e.then ? e.then(t) : t(), Bm = (e) => e.classList.add("hydrated"), F4 = (e, t) => ga(e).$instanceValues$.get(t), j4 = (e, t, n, r) => {
  const s = ga(e), o = s.$instanceValues$.get(t), i = s.$flags$, a = s.$lazyInstance$;
  n = $4(n, r.$members$[t][0]);
  const c = Number.isNaN(o) && Number.isNaN(n), u = n !== o && !c;
  (!(i & 8) || o === void 0) && u && (s.$instanceValues$.set(t, n), a && (i & 18) === 2 && dh(s, !1));
}, Nm = (e, t, n) => {
  if (t.$members$) {
    const r = Object.entries(t.$members$), s = e.prototype;
    if (r.map(([o, [i]]) => {
      (i & 31 || n & 2 && i & 32) && Object.defineProperty(s, o, {
        get() {
          return F4(this, o);
        },
        set(a) {
          j4(this, o, a, t);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const o = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(i, a, c) {
        Un.jmp(() => {
          const u = o.get(i);
          if (this.hasOwnProperty(u))
            c = this[u], delete this[u];
          else if (s.hasOwnProperty(u) && typeof this[u] == "number" && this[u] == c)
            return;
          this[u] = c === null && typeof this[u] == "boolean" ? !1 : c;
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
}, R4 = async (e, t, n, r, s) => {
  if (!(t.$flags$ & 32)) {
    {
      if (t.$flags$ |= 32, s = Y4(n), s.then) {
        const c = b4();
        s = await s, c();
      }
      s.isProxied || (Nm(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Po("createInstance", n.$tagName$);
      t.$flags$ |= 8;
      try {
        new s(t);
      } catch (c) {
        Wa(c);
      }
      t.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = km(n);
      if (!El.has(c)) {
        const u = Po("registerStyles", n.$tagName$);
        C4(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const o = t.$ancestorComponent$, i = () => dh(t, !0);
  o && o["s-rc"] ? o["s-rc"].push(i) : i();
}, z4 = (e) => {
  if (!(Un.$flags$ & 1)) {
    const t = ga(e), n = t.$cmpMeta$, r = Po("connectedCallback", n.$tagName$);
    if (!(t.$flags$ & 1)) {
      t.$flags$ |= 1;
      {
        let s = e;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Cm(t, t.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [o]]) => {
        if (o & 31 && e.hasOwnProperty(s)) {
          const i = e[s];
          delete e[s], e[s] = i;
        }
      }), R4(e, t, n);
    }
    r();
  }
}, G4 = (e) => {
  Un.$flags$ & 1 || ga(e);
}, K4 = (e, t = {}) => {
  var n;
  const r = Po(), s = [], o = t.exclude || [], i = iu.customElements, a = lo.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ lo.createElement("style"), h = [];
  let d, w = !0;
  Object.assign(Un, t), Un.$resourcesUrl$ = new URL(t.resourcesUrl || "./", lo.baseURI).href, e.map((y) => {
    y[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const L = x.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(_) {
          super(_), _ = this, X4(_, x), x.$flags$ & 1 && _.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          d && (clearTimeout(d), d = null), w ? h.push(this) : Un.jmp(() => z4(this));
        }
        disconnectedCallback() {
          Un.jmp(() => G4(this));
        }
        componentOnReady() {
          return ga(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = y[0], !o.includes(L) && !i.get(L) && (s.push(L), i.define(L, Nm(
        U,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + x4, u.setAttribute("data-styles", "");
    const y = (n = Un.$nonce$) !== null && n !== void 0 ? n : Em(lo);
    y != null && u.setAttribute("nonce", y), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, h.length ? h.map((y) => y.connectedCallback()) : Un.jmp(() => d = setTimeout(Tm, 30)), r();
}, fh = /* @__PURE__ */ new WeakMap(), ga = (e) => fh.get(e), V4 = (e, t) => fh.set(t.$lazyInstance$ = e, t), X4 = (e, t) => {
  const n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), e["s-p"] = [], e["s-rc"] = [], fh.set(e, n);
}, F0 = (e, t) => t in e, Wa = (e, t) => (0, console.error)(e, t), Fu = /* @__PURE__ */ new Map(), Y4 = (e, t, n) => {
  const r = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, o = Fu.get(s);
  if (o)
    return o[r];
  {
    const i = (a) => (Fu.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => zC).then(i, Wa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((i) => (Fu.set(s, i), i[r]), Wa);
}, El = /* @__PURE__ */ new Map(), iu = typeof window < "u" ? window : {}, lo = iu.document || { head: {} }, Un = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (e) => e(),
  raf: (e) => requestAnimationFrame(e),
  ael: (e, t, n, r) => e.addEventListener(t, n, r),
  rel: (e, t, n, r) => e.removeEventListener(t, n, r),
  ce: (e, t) => new CustomEvent(e, t)
}, Mm = (e) => Promise.resolve(e), q4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), j0 = [], Pm = [], W4 = (e, t) => (n) => {
  e.push(n), qd || (qd = !0, Un.$flags$ & 4 ? hh(Zd) : Un.raf(Zd));
}, R0 = (e) => {
  for (let t = 0; t < e.length; t++)
    try {
      e[t](performance.now());
    } catch (n) {
      Wa(n);
    }
  e.length = 0;
}, Zd = () => {
  R0(j0), R0(Pm), (qd = j0.length > 0) && Un.raf(Zd);
}, hh = (e) => Mm().then(e), Z4 = /* @__PURE__ */ W4(Pm), J4 = () => Mm(), Q4 = (e, t) => typeof window > "u" ? Promise.resolve() : J4().then(() => K4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], t));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var e = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(e, [], this.constructor);
    }, HTMLElement.prototype = e.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, e);
  }
})();
var e$ = Object.defineProperty, t$ = Object.defineProperties, n$ = Object.getOwnPropertyDescriptors, kl = Object.getOwnPropertySymbols, _m = Object.prototype.hasOwnProperty, Um = Object.prototype.propertyIsEnumerable, z0 = (e, t, n) => t in e ? e$(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, pr = (e, t) => {
  for (var n in t || (t = {})) _m.call(t, n) && z0(e, n, t[n]);
  if (kl) for (var n of kl(t)) Um.call(t, n) && z0(e, n, t[n]);
  return e;
}, Gr = (e, t) => t$(e, n$(t)), Om = (e, t) => {
  var n = {};
  for (var r in e) _m.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && kl) for (var r of kl(e)) t.indexOf(r) < 0 && Um.call(e, r) && (n[r] = e[r]);
  return n;
};
function Hm() {
  return Ql(qs()) || window.StacksProvider || window.BlockstackProvider;
}
function au(e) {
  return e ? typeof e == "string" ? Zs.fromName(e) : "version" in e ? e : "url" in e ? new kd({ url: e.url }) : e.transactionVersion === Qs.Mainnet ? new kd({ url: e.client.baseUrl }) : new $d({ url: e.client.baseUrl }) : new $d();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var r$ = ((e) => (e.ContractCall = "contract_call", e.ContractDeploy = "smart_contract", e.STXTransfer = "token_transfer", e))(r$ || {}), o$ = ((e) => (e.BUFFER = "buffer", e.UINT = "uint", e.INT = "int", e.PRINCIPAL = "principal", e.BOOL = "bool", e))(o$ || {}), ph = (e) => {
  let t = e;
  if (!t) {
    let n = new wy(["store_write"], document.location.href);
    t = new Ed({ appConfig: n });
  }
  return t;
};
function Dm(e) {
  try {
    return ph(e).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Fm = (e) => {
  let t = ph(e).loadUserData().appPrivateKey, n = Tn.SECP256K1Client.derivePublicKey(t);
  return { privateKey: t, publicKey: n };
};
function s$(e) {
  var t;
  let { stxAddress: n, userSession: r, network: s } = e;
  if (n) return n;
  if (!r || !s) return;
  let o = (t = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : t.stxAddress, i = { [Js.Mainnet]: "mainnet", [Js.Testnet]: "testnet" }, a = au(s);
  return o == null ? void 0 : o[i[a.chainId]];
}
function i$(e) {
  let t = au(e.network), n = ph(e.userSession), r = Gr(pr({}, e), { network: t, userSession: n });
  return pr({ stxAddress: s$(r) }, r);
}
async function a$(e, t) {
  let { postConditions: n } = e;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(dm) : n = n.map((r) => _e(Sm(r)))), new Tn.TokenSigner("ES256k", t).signAsync(Gr(pr({}, e), { postConditions: n }));
}
function c$(e) {
  let { postConditions: t } = e;
  return t && t.length > 0 && typeof t[0] != "string" && (typeof t[0].type == "string" ? t = t.map(dm) : t = t.map((n) => _e(Sm(n)))), Tn.createUnsecuredToken(Gr(pr({}, e), { postConditions: t }));
}
var l$ = async ({ token: e, options: t }, n) => {
  var r, s, o;
  try {
    let i = await n.transactionRequest(e), { txRaw: a } = i, c = vt(a.replace(/^0x/, "")), u = Qk(c);
    if ("sponsored" in t && t.sponsored) {
      (r = t.onFinish) == null || r.call(t, Gr(pr({}, i), { stacksTransaction: u }));
      return;
    }
    (s = t.onFinish) == null || s.call(t, Gr(pr({}, i), { stacksTransaction: u }));
  } catch (i) {
    console.error("[Connect] Error during transaction request", i), (o = t.onCancel) == null || o.call(t);
  }
}, u$ = async (e) => {
  let t = e, { amount: n, appDetails: r, userSession: s } = t, o = Om(t, ["amount", "appDetails", "userSession"]);
  if (Dm(s)) {
    let { privateKey: a, publicKey: c } = Fm(s), u = Gr(pr({}, o), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), a$(u, a);
  }
  let i = Gr(pr({}, o), { amount: n.toString(10), txType: "token_transfer" });
  return r && (i.appDetails = r), c$(i);
};
async function d$(e, t, n) {
  let r = await t(Gr(pr(pr({}, i$(e)), e), { network: au(e.network) }));
  return l$({ token: r, options: e }, n);
}
function f$(e, t = Hm()) {
  if (!t) throw new Error("[Connect] No installed Stacks wallet found");
  return d$(e, u$, t);
}
function jm(e) {
  let { message: t, domain: n } = e;
  return typeof t.type == "string" && typeof n.type == "string" ? Gr(pr({}, e), { message: w0(t), domain: w0(n) }) : Gr(pr({}, e), { message: _e(ti(t)), domain: _e(ti(n)) });
}
async function h$(e, t) {
  return new Tn.TokenSigner("ES256k", t).signAsync(jm(e));
}
async function p$(e) {
  let t = e, { userSession: n } = t, r = Om(t, ["userSession"]);
  if (Dm(n)) {
    let { privateKey: s, publicKey: o } = Fm(n), i = Gr(pr({}, r), { publicKey: o });
    return h$(i, s);
  }
  return Tn.createUnsecuredToken(jm(e));
}
var g$ = ((e) => (e[e.DEFAULT = 0] = "DEFAULT", e[e.ALL = 1] = "ALL", e[e.NONE = 2] = "NONE", e[e.SINGLE = 3] = "SINGLE", e[e.ANYONECANPAY = 128] = "ANYONECANPAY", e))(g$ || {}), Rm = "asigna-stx", G0 = (e, t) => new Promise((n) => {
  function r(s) {
    s.data.source === Rm && s.data[t] && (n(s.data[t]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(w$(e, t), "*");
}), y$ = { authenticationRequest: async (e) => G0(e, "authenticationRequest"), transactionRequest: async (e) => G0(e, "transactionRequest") }, w$ = (e, t) => ({ source: Rm, [t]: e }), m$ = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = y$);
};
m$();
var b$ = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function x$(e, t = !0) {
  return function(n, r) {
    var s;
    if (r) return e(n, r);
    let o = qs(), i = Hm();
    if (o && i) return e(n, i);
    if (typeof window > "u") return;
    Q4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : b$, c = dA(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = t;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let d = () => {
      u.remove(), document.body.style.overflow = h;
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
var Hc = x$(f$);
function As(e, t, n) {
  return gh(Kn(e, t), n);
}
function Kn(e, t) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = Yt(r);
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
      const r = A$(BigInt(`0x${lt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${lt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function K0(e) {
  if (typeof e != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof e}`);
  return BigInt(`0x${e}`);
}
function uc(e, t = 8) {
  return (typeof e == "bigint" ? e : Kn(e, !1)).toString(16).padStart(t * 2, "0");
}
function cu(e) {
  return parseInt(e, 16);
}
function gh(e, t = 16) {
  const n = uc(e, t);
  return Yt(n);
}
function S$(e, t) {
  if (e < -(BigInt(1) << t - BigInt(1)) || (BigInt(1) << t - BigInt(1)) - BigInt(1) < e)
    throw `Unable to represent integer in width: ${t}`;
  return e >= BigInt(0) ? BigInt(e) : e + (BigInt(1) << t);
}
function v$(e, t) {
  return e & BigInt(1) << t;
}
function A$(e, t) {
  return v$(e, t - BigInt(1)) ? e - (BigInt(1) << t) : e;
}
const E$ = Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function lt(e) {
  if (!(e instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let t = "";
  for (const n of e)
    t += E$[n];
  return t;
}
function Yt(e) {
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
function ya(e) {
  return new TextEncoder().encode(e);
}
function yh(e) {
  return new TextDecoder().decode(e);
}
function zm(e) {
  const t = [];
  for (let n = 0; n < e.length; n++)
    t.push(e.charCodeAt(n) & 255);
  return new Uint8Array(t);
}
function k$(e) {
  return String.fromCharCode.apply(null, e);
}
function $$(e) {
  return !Number.isInteger(e) || e < 0 || e > 255;
}
function V0(e) {
  if (e.some($$))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(e);
}
function lu(...e) {
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
function cn(e) {
  return lu(...e.map((t) => typeof t == "number" ? V0([t]) : t instanceof Array ? V0(t) : t));
}
var X0;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(X0 || (X0 = {}));
var Y0;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Y0 || (Y0 = {}));
var q0;
(function(e) {
  e[e.Mainnet = 385875968] = "Mainnet", e[e.Testnet = 4278190080] = "Testnet";
})(q0 || (q0 = {}));
const Gm = 33, ju = 32;
function I$(e) {
  if (e.length < ju * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const t = e.slice(0, 2), n = e.slice(2, 2 + ju * 2), r = e.slice(2 + ju * 2);
  return {
    recoveryId: cu(t),
    r: n,
    s: r
  };
}
function L$(e) {
  const t = typeof e == "string" ? Yt(e) : e;
  if (t.length != 32 && t.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${t.length}`);
  if (t.length == 33 && t[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return t;
}
function C$(e, t) {
  return (e[t + 0] << 8 | e[t + 1]) >>> 0;
}
function T$(e, t, n = 0) {
  return e[n + 0] = t >>> 8, e[n + 1] = t >>> 0, e;
}
function B$(e, t) {
  return e[t];
}
function N$(e, t, n = 0) {
  return e[n] = t, e;
}
function M$(e, t) {
  return e[t] * 2 ** 24 + e[t + 1] * 2 ** 16 + e[t + 2] * 2 ** 8 + e[t + 3];
}
function ni(e, t, n = 0) {
  return e[n + 3] = t, t >>>= 8, e[n + 2] = t, t >>>= 8, e[n + 1] = t, t >>>= 8, e[n] = t, e;
}
var Jd;
(function(e) {
  e[e.Testnet = 2147483648] = "Testnet", e[e.Mainnet = 1] = "Mainnet";
})(Jd || (Jd = {}));
const P$ = Jd.Mainnet, _$ = 128, U$ = 128, Km = 16, js = 32, Qd = 80, uu = 65, O$ = 32, H$ = 64, $l = 34;
var Ie;
(function(e) {
  e[e.Address = 0] = "Address", e[e.Principal = 1] = "Principal", e[e.LengthPrefixedString = 2] = "LengthPrefixedString", e[e.MemoString = 3] = "MemoString", e[e.AssetInfo = 4] = "AssetInfo", e[e.PostCondition = 5] = "PostCondition", e[e.PublicKey = 6] = "PublicKey", e[e.LengthPrefixedList = 7] = "LengthPrefixedList", e[e.Payload = 8] = "Payload", e[e.MessageSignature = 9] = "MessageSignature", e[e.StructuredDataSignature = 10] = "StructuredDataSignature", e[e.TransactionAuthField = 11] = "TransactionAuthField";
})(Ie || (Ie = {}));
var st;
(function(e) {
  e[e.TokenTransfer = 0] = "TokenTransfer", e[e.SmartContract = 1] = "SmartContract", e[e.VersionedSmartContract = 6] = "VersionedSmartContract", e[e.ContractCall = 2] = "ContractCall", e[e.PoisonMicroblock = 3] = "PoisonMicroblock", e[e.Coinbase = 4] = "Coinbase", e[e.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", e[e.TenureChange = 7] = "TenureChange", e[e.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(st || (st = {}));
var ef;
(function(e) {
  e[e.Clarity1 = 1] = "Clarity1", e[e.Clarity2 = 2] = "Clarity2", e[e.Clarity3 = 3] = "Clarity3";
})(ef || (ef = {}));
var Wn;
(function(e) {
  e[e.OnChainOnly = 1] = "OnChainOnly", e[e.OffChainOnly = 2] = "OffChainOnly", e[e.Any = 3] = "Any";
})(Wn || (Wn = {}));
const rl = ["onChainOnly", "offChainOnly", "any"], W0 = {
  [rl[0]]: Wn.OnChainOnly,
  [rl[1]]: Wn.OffChainOnly,
  [rl[2]]: Wn.Any,
  [Wn.OnChainOnly]: Wn.OnChainOnly,
  [Wn.OffChainOnly]: Wn.OffChainOnly,
  [Wn.Any]: Wn.Any
};
function D$(e) {
  if (e in W0)
    return W0[e];
  throw new Error(`Invalid anchor mode "${e}", must be one of: ${rl.join(", ")}`);
}
var Il;
(function(e) {
  e[e.Mainnet = 0] = "Mainnet", e[e.Testnet = 128] = "Testnet";
})(Il || (Il = {}));
Il.Mainnet;
var ia;
(function(e) {
  e[e.Allow = 1] = "Allow", e[e.Deny = 2] = "Deny";
})(ia || (ia = {}));
var Zn;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Zn || (Zn = {}));
var en;
(function(e) {
  e[e.Standard = 4] = "Standard", e[e.Sponsored = 5] = "Sponsored";
})(en || (en = {}));
var Ht;
(function(e) {
  e[e.SerializeP2PKH = 0] = "SerializeP2PKH", e[e.SerializeP2SH = 1] = "SerializeP2SH", e[e.SerializeP2WPKH = 2] = "SerializeP2WPKH", e[e.SerializeP2WSH = 3] = "SerializeP2WSH", e[e.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", e[e.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Ht || (Ht = {}));
var Ll;
(function(e) {
  e[e.MainnetSingleSig = 22] = "MainnetSingleSig", e[e.MainnetMultiSig = 20] = "MainnetMultiSig", e[e.TestnetSingleSig = 26] = "TestnetSingleSig", e[e.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Ll || (Ll = {}));
var Zt;
(function(e) {
  e[e.Compressed = 0] = "Compressed", e[e.Uncompressed = 1] = "Uncompressed";
})(Zt || (Zt = {}));
var Za;
(function(e) {
  e[e.Equal = 1] = "Equal", e[e.Greater = 2] = "Greater", e[e.GreaterEqual = 3] = "GreaterEqual", e[e.Less = 4] = "Less", e[e.LessEqual = 5] = "LessEqual";
})(Za || (Za = {}));
var tf;
(function(e) {
  e[e.Sends = 16] = "Sends", e[e.DoesNotSend = 17] = "DoesNotSend";
})(tf || (tf = {}));
var Ja;
(function(e) {
  e[e.Origin = 1] = "Origin", e[e.Standard = 2] = "Standard", e[e.Contract = 3] = "Contract";
})(Ja || (Ja = {}));
var Z0;
(function(e) {
  e[e.STX = 0] = "STX", e[e.Fungible = 1] = "Fungible", e[e.NonFungible = 2] = "NonFungible";
})(Z0 || (Z0 = {}));
var J0;
(function(e) {
  e.Serialization = "Serialization", e.Deserialization = "Deserialization", e.SignatureValidation = "SignatureValidation", e.FeeTooLow = "FeeTooLow", e.BadNonce = "BadNonce", e.NotEnoughFunds = "NotEnoughFunds", e.NoSuchContract = "NoSuchContract", e.NoSuchPublicFunction = "NoSuchPublicFunction", e.BadFunctionArgument = "BadFunctionArgument", e.ContractAlreadyExists = "ContractAlreadyExists", e.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", e.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", e.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", e.BadAddressVersionByte = "BadAddressVersionByte", e.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", e.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", e.TooMuchChaining = "TooMuchChaining", e.ConflictingNonceInMempool = "ConflictingNonceInMempool", e.BadTransactionVersion = "BadTransactionVersion", e.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", e.TransferAmountMustBePositive = "TransferAmountMustBePositive", e.ServerFailureDatabase = "ServerFailureDatabase", e.EstimatorError = "EstimatorError", e.TemporarilyBlacklisted = "TemporarilyBlacklisted", e.ServerFailureOther = "ServerFailureOther";
})(J0 || (J0 = {}));
function nf(e) {
  if (!Number.isSafeInteger(e) || e < 0)
    throw new Error(`Wrong positive integer: ${e}`);
}
function F$(e) {
  if (typeof e != "boolean")
    throw new Error(`Expected boolean, not ${e}`);
}
function Vm(e, ...t) {
  if (!(e instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (t.length > 0 && !t.includes(e.length))
    throw new TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`);
}
function j$(e) {
  if (typeof e != "function" || typeof e.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  nf(e.outputLen), nf(e.blockLen);
}
function R$(e, t = !0) {
  if (e.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (t && e.finished)
    throw new Error("Hash#digest() has already been called");
}
function z$(e, t) {
  Vm(e);
  const n = t.outputLen;
  if (e.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Os = {
  number: nf,
  bool: F$,
  bytes: Vm,
  hash: j$,
  exists: R$,
  output: z$
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ru = (e) => new DataView(e.buffer, e.byteOffset, e.byteLength), ro = (e, t) => e << 32 - t | e >>> t, G$ = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!G$)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
function K$(e) {
  if (typeof e != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof e}`);
  return new TextEncoder().encode(e);
}
function wh(e) {
  if (typeof e == "string" && (e = K$(e)), !(e instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
  return e;
}
class Xm {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function hi(e) {
  const t = (r) => e().update(wh(r)).digest(), n = e();
  return t.outputLen = n.outputLen, t.blockLen = n.blockLen, t.create = () => e(), t;
}
function V$(e, t, n, r) {
  if (typeof e.setBigUint64 == "function")
    return e.setBigUint64(t, n, r);
  const s = BigInt(32), o = BigInt(4294967295), i = Number(n >> s & o), a = Number(n & o), c = r ? 4 : 0, u = r ? 0 : 4;
  e.setUint32(t + c, i, r), e.setUint32(t + u, a, r);
}
class mh extends Xm {
  constructor(t, n, r, s) {
    super(), this.blockLen = t, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = Ru(this.buffer);
  }
  update(t) {
    Os.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    t = wh(t);
    const o = t.length;
    for (let i = 0; i < o; ) {
      const a = Math.min(s - this.pos, o - i);
      if (a === s) {
        const c = Ru(t);
        for (; s <= o - i; i += s)
          this.process(c, i);
        continue;
      }
      r.set(t.subarray(i, i + a), this.pos), this.pos += a, i += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += t.length, this.roundClean(), this;
  }
  digestInto(t) {
    Os.exists(this), Os.output(t, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: o } = this;
    let { pos: i } = this;
    n[i++] = 128, this.buffer.subarray(i).fill(0), this.padOffset > s - i && (this.process(r, 0), i = 0);
    for (let d = i; d < s; d++)
      n[d] = 0;
    V$(r, s - 8, BigInt(this.length * 8), o), this.process(r, 0);
    const a = Ru(t), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let d = 0; d < u; d++)
      a.setUint32(4 * d, h[d], o);
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
const X$ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Ym = Uint8Array.from({ length: 16 }, (e, t) => t), Y$ = Ym.map((e) => (9 * e + 5) % 16);
let bh = [Ym], xh = [Y$];
for (let e = 0; e < 4; e++)
  for (let t of [bh, xh])
    t.push(t[e].map((n) => X$[n]));
const qm = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((e) => new Uint8Array(e)), q$ = bh.map((e, t) => e.map((n) => qm[t][n])), W$ = xh.map((e, t) => e.map((n) => qm[t][n])), Z$ = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), J$ = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Dc = (e, t) => e << t | e >>> 32 - t;
function Q0(e, t, n, r) {
  return e === 0 ? t ^ n ^ r : e === 1 ? t & n | ~t & r : e === 2 ? (t | ~n) ^ r : e === 3 ? t & r | n & ~r : t ^ (n | ~r);
}
const Fc = new Uint32Array(16);
class Q$ extends mh {
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
      Fc[y] = t.getUint32(n, !0);
    let r = this.h0 | 0, s = r, o = this.h1 | 0, i = o, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, d = this.h4 | 0, w = d;
    for (let y = 0; y < 5; y++) {
      const v = 4 - y, x = Z$[y], L = J$[y], U = bh[y], _ = xh[y], A = q$[y], T = W$[y];
      for (let B = 0; B < 16; B++) {
        const Y = Dc(r + Q0(y, o, a, u) + Fc[U[B]] + x, A[B]) + d | 0;
        r = d, d = u, u = Dc(a, 10) | 0, a = o, o = Y;
      }
      for (let B = 0; B < 16; B++) {
        const Y = Dc(s + Q0(v, i, c, h) + Fc[_[B]] + L, T[B]) + w | 0;
        s = w, w = h, h = Dc(c, 10) | 0, c = i, i = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + w | 0, this.h3 + d + s | 0, this.h4 + r + i | 0, this.h0 + o + c | 0);
  }
  roundClean() {
    Fc.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const e8 = hi(() => new Q$()), t8 = (e, t, n) => e & t ^ ~e & n, n8 = (e, t, n) => e & t ^ e & n ^ t & n, r8 = new Uint32Array([
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
]), ls = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), us = new Uint32Array(64);
class Wm extends mh {
  constructor() {
    super(64, 32, 8, !1), this.A = ls[0] | 0, this.B = ls[1] | 0, this.C = ls[2] | 0, this.D = ls[3] | 0, this.E = ls[4] | 0, this.F = ls[5] | 0, this.G = ls[6] | 0, this.H = ls[7] | 0;
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
    for (let d = 0; d < 16; d++, n += 4)
      us[d] = t.getUint32(n, !1);
    for (let d = 16; d < 64; d++) {
      const w = us[d - 15], y = us[d - 2], v = ro(w, 7) ^ ro(w, 18) ^ w >>> 3, x = ro(y, 17) ^ ro(y, 19) ^ y >>> 10;
      us[d] = x + us[d - 7] + v + us[d - 16] | 0;
    }
    let { A: r, B: s, C: o, D: i, E: a, F: c, G: u, H: h } = this;
    for (let d = 0; d < 64; d++) {
      const w = ro(a, 6) ^ ro(a, 11) ^ ro(a, 25), y = h + w + t8(a, c, u) + r8[d] + us[d] | 0, x = (ro(r, 2) ^ ro(r, 13) ^ ro(r, 22)) + n8(r, s, o) | 0;
      h = u, u = c, c = a, a = i + y | 0, i = o, o = s, s = r, r = y + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, o = o + this.C | 0, i = i + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, o, i, a, c, u, h);
  }
  roundClean() {
    us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class o8 extends Wm {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Sh = hi(() => new Wm());
hi(() => new o8());
const jc = BigInt(2 ** 32 - 1), rf = BigInt(32);
function Zm(e, t = !1) {
  return t ? { h: Number(e & jc), l: Number(e >> rf & jc) } : { h: Number(e >> rf & jc) | 0, l: Number(e & jc) | 0 };
}
function s8(e, t = !1) {
  let n = new Uint32Array(e.length), r = new Uint32Array(e.length);
  for (let s = 0; s < e.length; s++) {
    const { h: o, l: i } = Zm(e[s], t);
    [n[s], r[s]] = [o, i];
  }
  return [n, r];
}
const i8 = (e, t) => BigInt(e >>> 0) << rf | BigInt(t >>> 0), a8 = (e, t, n) => e >>> n, c8 = (e, t, n) => e << 32 - n | t >>> n, l8 = (e, t, n) => e >>> n | t << 32 - n, u8 = (e, t, n) => e << 32 - n | t >>> n, d8 = (e, t, n) => e << 64 - n | t >>> n - 32, f8 = (e, t, n) => e >>> n - 32 | t << 64 - n, h8 = (e, t) => t, p8 = (e, t) => e, g8 = (e, t, n) => e << n | t >>> 32 - n, y8 = (e, t, n) => t << n | e >>> 32 - n, w8 = (e, t, n) => t << n - 32 | e >>> 64 - n, m8 = (e, t, n) => e << n - 32 | t >>> 64 - n;
function b8(e, t, n, r) {
  const s = (t >>> 0) + (r >>> 0);
  return { h: e + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const x8 = (e, t, n) => (e >>> 0) + (t >>> 0) + (n >>> 0), S8 = (e, t, n, r) => t + n + r + (e / 2 ** 32 | 0) | 0, v8 = (e, t, n, r) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0), A8 = (e, t, n, r, s) => t + n + r + s + (e / 2 ** 32 | 0) | 0, E8 = (e, t, n, r, s) => (e >>> 0) + (t >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), k8 = (e, t, n, r, s, o) => t + n + r + s + o + (e / 2 ** 32 | 0) | 0, nt = {
  fromBig: Zm,
  split: s8,
  toBig: i8,
  shrSH: a8,
  shrSL: c8,
  rotrSH: l8,
  rotrSL: u8,
  rotrBH: d8,
  rotrBL: f8,
  rotr32H: h8,
  rotr32L: p8,
  rotlSH: g8,
  rotlSL: y8,
  rotlBH: w8,
  rotlBL: m8,
  add: b8,
  add3L: x8,
  add3H: S8,
  add4L: v8,
  add4H: A8,
  add5H: k8,
  add5L: E8
}, [$8, I8] = nt.split([
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
].map((e) => BigInt(e))), ds = new Uint32Array(80), fs = new Uint32Array(80);
class du extends mh {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: t, Al: n, Bh: r, Bl: s, Ch: o, Cl: i, Dh: a, Dl: c, Eh: u, El: h, Fh: d, Fl: w, Gh: y, Gl: v, Hh: x, Hl: L } = this;
    return [t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L];
  }
  // prettier-ignore
  set(t, n, r, s, o, i, a, c, u, h, d, w, y, v, x, L) {
    this.Ah = t | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = o | 0, this.Cl = i | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = d | 0, this.Fl = w | 0, this.Gh = y | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = L | 0;
  }
  process(t, n) {
    for (let A = 0; A < 16; A++, n += 4)
      ds[A] = t.getUint32(n), fs[A] = t.getUint32(n += 4);
    for (let A = 16; A < 80; A++) {
      const T = ds[A - 15] | 0, B = fs[A - 15] | 0, Y = nt.rotrSH(T, B, 1) ^ nt.rotrSH(T, B, 8) ^ nt.shrSH(T, B, 7), ee = nt.rotrSL(T, B, 1) ^ nt.rotrSL(T, B, 8) ^ nt.shrSL(T, B, 7), oe = ds[A - 2] | 0, W = fs[A - 2] | 0, m = nt.rotrSH(oe, W, 19) ^ nt.rotrBH(oe, W, 61) ^ nt.shrSH(oe, W, 6), C = nt.rotrSL(oe, W, 19) ^ nt.rotrBL(oe, W, 61) ^ nt.shrSL(oe, W, 6), P = nt.add4L(ee, C, fs[A - 7], fs[A - 16]), M = nt.add4H(P, Y, m, ds[A - 7], ds[A - 16]);
      ds[A] = M | 0, fs[A] = P | 0;
    }
    let { Ah: r, Al: s, Bh: o, Bl: i, Ch: a, Cl: c, Dh: u, Dl: h, Eh: d, El: w, Fh: y, Fl: v, Gh: x, Gl: L, Hh: U, Hl: _ } = this;
    for (let A = 0; A < 80; A++) {
      const T = nt.rotrSH(d, w, 14) ^ nt.rotrSH(d, w, 18) ^ nt.rotrBH(d, w, 41), B = nt.rotrSL(d, w, 14) ^ nt.rotrSL(d, w, 18) ^ nt.rotrBL(d, w, 41), Y = d & y ^ ~d & x, ee = w & v ^ ~w & L, oe = nt.add5L(_, B, ee, I8[A], fs[A]), W = nt.add5H(oe, U, T, Y, $8[A], ds[A]), m = oe | 0, C = nt.rotrSH(r, s, 28) ^ nt.rotrBH(r, s, 34) ^ nt.rotrBH(r, s, 39), P = nt.rotrSL(r, s, 28) ^ nt.rotrBL(r, s, 34) ^ nt.rotrBL(r, s, 39), M = r & o ^ r & a ^ o & a, Z = s & i ^ s & c ^ i & c;
      U = x | 0, _ = L | 0, x = y | 0, L = v | 0, y = d | 0, v = w | 0, { h: d, l: w } = nt.add(u | 0, h | 0, W | 0, m | 0), u = a | 0, h = c | 0, a = o | 0, c = i | 0, o = r | 0, i = s | 0;
      const F = nt.add3L(m, P, Z);
      r = nt.add3H(F, W, C, M), s = F | 0;
    }
    ({ h: r, l: s } = nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: o, l: i } = nt.add(this.Bh | 0, this.Bl | 0, o | 0, i | 0), { h: a, l: c } = nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: d, l: w } = nt.add(this.Eh | 0, this.El | 0, d | 0, w | 0), { h: y, l: v } = nt.add(this.Fh | 0, this.Fl | 0, y | 0, v | 0), { h: x, l: L } = nt.add(this.Gh | 0, this.Gl | 0, x | 0, L | 0), { h: U, l: _ } = nt.add(this.Hh | 0, this.Hl | 0, U | 0, _ | 0), this.set(r, s, o, i, a, c, u, h, d, w, y, v, x, L, U, _);
  }
  roundClean() {
    ds.fill(0), fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class L8 extends du {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class C8 extends du {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class T8 extends du {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
hi(() => new du());
hi(() => new L8());
const B8 = hi(() => new C8());
hi(() => new T8());
function Jm(e) {
  if (Yt(e).byteLength != uu)
    throw Error("Invalid signature");
  return {
    type: Ie.MessageSignature,
    data: e
  };
}
function _a(e, t) {
  return { type: Ie.Address, version: e, hash160: t };
}
function ji(e) {
  return ui.c32address(e.version, e.hash160);
}
function ri(e, t, n) {
  const r = t || 1, s = n || _$;
  if (gb(e, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Ie.LengthPrefixedString,
    content: e,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function vh(e) {
  const t = ui.c32addressDecode(e);
  return {
    type: Ie.Address,
    version: t[0],
    hash160: t[1]
  };
}
var ie;
(function(e) {
  e[e.Int = 0] = "Int", e[e.UInt = 1] = "UInt", e[e.Buffer = 2] = "Buffer", e[e.BoolTrue = 3] = "BoolTrue", e[e.BoolFalse = 4] = "BoolFalse", e[e.PrincipalStandard = 5] = "PrincipalStandard", e[e.PrincipalContract = 6] = "PrincipalContract", e[e.ResponseOk = 7] = "ResponseOk", e[e.ResponseErr = 8] = "ResponseErr", e[e.OptionalNone = 9] = "OptionalNone", e[e.OptionalSome = 10] = "OptionalSome", e[e.List = 11] = "List", e[e.Tuple = 12] = "Tuple", e[e.StringASCII = 13] = "StringASCII", e[e.StringUTF8 = 14] = "StringUTF8";
})(ie || (ie = {}));
function N8(e) {
  if (e.type === ie.PrincipalStandard)
    return ji(e.address);
  if (e.type === ie.PrincipalContract)
    return `${ji(e.address)}.${e.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(e)}`);
}
function Qm(e) {
  if (e.includes(".")) {
    const [t, n] = e.split(".");
    return _8(t, n);
  } else
    return M8(e);
}
function M8(e) {
  const t = vh(e);
  return { type: ie.PrincipalStandard, address: t };
}
function P8(e) {
  return { type: ie.PrincipalStandard, address: e };
}
function _8(e, t) {
  const n = vh(e), r = ri(t);
  return eb(n, r);
}
function eb(e, t) {
  if (ya(t.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: ie.PrincipalContract, address: e, contractName: t };
}
function zu(e, t = !1) {
  switch (e.type) {
    case ie.BoolTrue:
      return !0;
    case ie.BoolFalse:
      return !1;
    case ie.Int:
    case ie.UInt:
      return t ? e.value.toString() : e.value;
    case ie.Buffer:
      return `0x${lt(e.buffer)}`;
    case ie.OptionalNone:
      return null;
    case ie.OptionalSome:
      return Dr(e.value);
    case ie.ResponseErr:
      return Dr(e.value);
    case ie.ResponseOk:
      return Dr(e.value);
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return N8(e);
    case ie.List:
      return e.list.map((r) => Dr(r));
    case ie.Tuple:
      const n = {};
      return Object.keys(e.data).forEach((r) => {
        n[r] = Dr(e.data[r]);
      }), n;
    case ie.StringASCII:
      return e.data;
    case ie.StringUTF8:
      return e.data;
  }
}
function Dr(e) {
  switch (e.type) {
    case ie.ResponseErr:
      return { type: ys(e), value: zu(e, !0), success: !1 };
    case ie.ResponseOk:
      return { type: ys(e), value: zu(e, !0), success: !0 };
    default:
      return { type: ys(e), value: zu(e, !0) };
  }
}
function ys(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return "bool";
    case ie.Int:
      return "int";
    case ie.UInt:
      return "uint";
    case ie.Buffer:
      return `(buff ${e.buffer.length})`;
    case ie.OptionalNone:
      return "(optional none)";
    case ie.OptionalSome:
      return `(optional ${ys(e.value)})`;
    case ie.ResponseErr:
      return `(response UnknownType ${ys(e.value)})`;
    case ie.ResponseOk:
      return `(response ${ys(e.value)} UnknownType)`;
    case ie.PrincipalStandard:
    case ie.PrincipalContract:
      return "principal";
    case ie.List:
      return `(list ${e.list.length} ${e.list.length ? ys(e.list[0]) : "UnknownType"})`;
    case ie.Tuple:
      return `(tuple ${Object.keys(e.data).map((t) => `(${t} ${ys(e.data[t])})`).join(" ")})`;
    case ie.StringASCII:
      return `(string-ascii ${zm(e.data).length})`;
    case ie.StringUTF8:
      return `(string-utf8 ${ya(e.data).length})`;
  }
}
const tb = () => ({ type: ie.BoolTrue }), nb = () => ({ type: ie.BoolFalse }), U8 = (e) => e ? tb() : nb(), eg = BigInt("0xffffffffffffffffffffffffffffffff"), O8 = BigInt(0), tg = BigInt("0x7fffffffffffffffffffffffffffffff"), ng = BigInt("-170141183460469231731687303715884105728"), H8 = (e) => {
  const t = Kn(e, !0);
  if (t > tg)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${tg}`);
  if (t < ng)
    throw new RangeError(`Cannot construct clarity integer form value less than ${ng}`);
  return { type: ie.Int, value: t };
}, vn = (e) => {
  const t = Kn(e, !1);
  if (t < O8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (t > eg)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${eg}`);
  return { type: ie.UInt, value: t };
}, rb = (e) => {
  if (e.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: ie.Buffer, buffer: e };
};
function ob() {
  return { type: ie.OptionalNone };
}
function sb(e) {
  return { type: ie.OptionalSome, value: e };
}
function D8(e) {
  return { type: ie.ResponseErr, value: e };
}
function F8(e) {
  return { type: ie.ResponseOk, value: e };
}
function j8(e) {
  return { type: ie.List, list: e };
}
function gr(e) {
  for (const t in e)
    if (!T6(t))
      throw new Error(`"${t}" is not a valid Clarity name`);
  return { type: ie.Tuple, data: e };
}
const Et = (e) => ({ type: ie.StringASCII, data: e }), R8 = (e) => ({ type: ie.StringUTF8, data: e });
class ib extends Xm {
  constructor(t, n) {
    super(), this.finished = !1, this.destroyed = !1, Os.hash(t);
    const r = wh(n);
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
    return Os.exists(this), this.iHash.update(t), this;
  }
  digestInto(t) {
    Os.exists(this), Os.bytes(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy();
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
const ab = (e, t, n) => new ib(e, t).update(n).digest();
ab.create = (e, t) => new ib(e, t);
tn.hmacSha256Sync = (e, ...t) => {
  const n = ab.create(Sh, e);
  return t.forEach((r) => n.update(r)), n.digest();
};
function aa(e) {
  return {
    type: Ie.PublicKey,
    data: Yt(e)
  };
}
function z8(e, t, n = Zt.Compressed) {
  const r = I$(t.data), s = new fr(K0(r.r), K0(r.s)), o = it.fromSignature(e, s, r.recoveryId), i = n === Zt.Compressed;
  return o.toHex(i);
}
function G8(e) {
  return { type: Ie.PublicKey, data: e };
}
function wa(e) {
  return !lt(e.data).startsWith("04");
}
function Cl(e) {
  return e.data.slice();
}
function K8(e) {
  const t = Y8(e), n = sc(t.data.slice(0, 32), t.compressed);
  return aa(lt(n));
}
function V8(e) {
  const t = typeof e == "string" ? e : lt(e), n = it.fromHex(t).toHex(!0);
  return aa(n);
}
function X8(e) {
  const t = typeof e == "string" ? e : lt(e), n = it.fromHex(t).toHex(!1);
  return aa(n);
}
function of(e) {
  const t = e.readUInt8(), n = t === 4 ? H$ : O$;
  return G8(cn([t, e.readBytes(n)]));
}
function Y8(e) {
  const t = L$(e), n = t.length == Gm;
  return { data: t, compressed: n };
}
function q8(e, t) {
  const [n, r] = zl(t, e.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const o = uc(r, 1) + fr.fromHex(n).toCompactHex();
  return Jm(o);
}
function W8(e) {
  return K8(e.data);
}
function Z8(e, t, n) {
  return typeof e == "string" && (e = Qm(e)), typeof n == "string" && (n = sg(n)), {
    type: Ie.Payload,
    payloadType: st.TokenTransfer,
    recipient: e,
    amount: Kn(t, !1),
    memo: n ?? sg("")
  };
}
function J8(e, t, n, r) {
  return typeof e == "string" && (e = vh(e)), typeof t == "string" && (t = ri(t)), typeof n == "string" && (n = ri(n)), {
    type: Ie.Payload,
    payloadType: st.ContractCall,
    contractAddress: e,
    contractName: t,
    functionName: n,
    functionArgs: r
  };
}
function rg(e, t, n) {
  return typeof e == "string" && (e = ri(e)), typeof t == "string" && (t = a6(t)), typeof n == "number" ? {
    type: Ie.Payload,
    payloadType: st.VersionedSmartContract,
    clarityVersion: n,
    contractName: e,
    codeBody: t
  } : {
    type: Ie.Payload,
    payloadType: st.SmartContract,
    contractName: e,
    codeBody: t
  };
}
function Q8() {
  return { type: Ie.Payload, payloadType: st.PoisonMicroblock };
}
function og(e, t) {
  if (e.byteLength != js)
    throw Error(`Coinbase buffer size must be ${js} bytes`);
  return t != null ? {
    type: Ie.Payload,
    payloadType: st.CoinbaseToAltRecipient,
    coinbaseBytes: e,
    recipient: t
  } : {
    type: Ie.Payload,
    payloadType: st.Coinbase,
    coinbaseBytes: e
  };
}
function e6(e, t, n) {
  if (e.byteLength != js)
    throw Error(`Coinbase buffer size must be ${js} bytes`);
  if (n.byteLength != Qd)
    throw Error(`VRF proof buffer size must be ${Qd} bytes`);
  return {
    type: Ie.Payload,
    payloadType: st.NakamotoCoinbase,
    coinbaseBytes: e,
    recipient: t.type === ie.OptionalSome ? t.value : void 0,
    vrfProof: n
  };
}
var sf;
(function(e) {
  e[e.BlockFound = 0] = "BlockFound", e[e.Extended = 1] = "Extended";
})(sf || (sf = {}));
function t6(e, t, n, r, s, o, i) {
  return {
    type: Ie.Payload,
    payloadType: st.TenureChange,
    tenureHash: e,
    previousTenureHash: t,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: o,
    publicKeyHash: i
  };
}
function cb(e) {
  const t = [];
  switch (t.push(e.payloadType), e.payloadType) {
    case st.TokenTransfer:
      t.push(on(e.recipient)), t.push(As(e.amount, !1, 8)), t.push(Lo(e.memo));
      break;
    case st.ContractCall:
      t.push(Lo(e.contractAddress)), t.push(Lo(e.contractName)), t.push(Lo(e.functionName));
      const n = new Uint8Array(4);
      ni(n, e.functionArgs.length, 0), t.push(n), e.functionArgs.forEach((r) => {
        t.push(on(r));
      });
      break;
    case st.SmartContract:
      t.push(Lo(e.contractName)), t.push(Lo(e.codeBody));
      break;
    case st.VersionedSmartContract:
      t.push(e.clarityVersion), t.push(Lo(e.contractName)), t.push(Lo(e.codeBody));
      break;
    case st.PoisonMicroblock:
      break;
    case st.Coinbase:
      t.push(e.coinbaseBytes);
      break;
    case st.CoinbaseToAltRecipient:
      t.push(e.coinbaseBytes), t.push(on(e.recipient));
      break;
    case st.NakamotoCoinbase:
      t.push(e.coinbaseBytes), t.push(on(e.recipient ? sb(e.recipient) : ob())), t.push(e.vrfProof);
      break;
    case st.TenureChange:
      t.push(Yt(e.tenureHash)), t.push(Yt(e.previousTenureHash)), t.push(Yt(e.burnViewHash)), t.push(Yt(e.previousTenureEnd)), t.push(ni(new Uint8Array(4), e.previousTenureBlocks)), t.push(N$(new Uint8Array(1), e.cause)), t.push(Yt(e.publicKeyHash));
      break;
  }
  return cn(t);
}
function n6(e) {
  switch (e.readUInt8Enum(st, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case st.TokenTransfer:
      const n = Ir(e), r = Kn(e.readBytes(8), !1), s = ub(e);
      return Z8(n, r, s);
    case st.ContractCall:
      const o = ca(e), i = $r(e), a = $r(e), c = [], u = e.readUInt32BE();
      for (let A = 0; A < u; A++) {
        const T = Ir(e);
        c.push(T);
      }
      return J8(o, i, a, c);
    case st.SmartContract:
      const h = $r(e), d = $r(e, 4, 1e5);
      return rg(h, d);
    case st.VersionedSmartContract: {
      const A = e.readUInt8Enum(ef, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), T = $r(e), B = $r(e, 4, 1e5);
      return rg(T, B, A);
    }
    case st.PoisonMicroblock:
      return Q8();
    case st.Coinbase: {
      const A = e.readBytes(js);
      return og(A);
    }
    case st.CoinbaseToAltRecipient: {
      const A = e.readBytes(js), T = Ir(e);
      return og(A, T);
    }
    case st.NakamotoCoinbase: {
      const A = e.readBytes(js), T = Ir(e), B = e.readBytes(Qd);
      return e6(A, T, B);
    }
    case st.TenureChange:
      const w = lt(e.readBytes(20)), y = lt(e.readBytes(20)), v = lt(e.readBytes(20)), x = lt(e.readBytes(32)), L = e.readUInt32BE(), U = e.readUInt8Enum(sf, (A) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${A}`);
      }), _ = lt(e.readBytes(20));
      return t6(w, y, v, x, L, U, _);
  }
}
class fu extends Error {
  constructor(t) {
    super(t), this.message = t, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Ns extends fu {
  constructor(t) {
    super(t);
  }
}
class dr extends fu {
  constructor(t) {
    super(t);
  }
}
class Tl extends fu {
  constructor(t) {
    super(t);
  }
}
class Hs extends fu {
  constructor(t) {
    super(t);
  }
}
var Fr;
(function(e) {
  e[e.PublicKeyCompressed = 0] = "PublicKeyCompressed", e[e.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", e[e.SignatureCompressed = 2] = "SignatureCompressed", e[e.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Fr || (Fr = {}));
function af(e) {
  return Jm(lt(e.readBytes(uu)));
}
function Ri(e, t) {
  return {
    pubKeyEncoding: e,
    type: Ie.TransactionAuthField,
    contents: t
  };
}
function r6(e) {
  const t = e.readUInt8Enum(Fr, (n) => {
    throw new dr(`Could not read ${n} as AuthFieldType`);
  });
  switch (t) {
    case Fr.PublicKeyCompressed:
      return Ri(Zt.Compressed, of(e));
    case Fr.PublicKeyUncompressed:
      return Ri(Zt.Uncompressed, X8(of(e).data));
    case Fr.SignatureCompressed:
      return Ri(Zt.Compressed, af(e));
    case Fr.SignatureUncompressed:
      return Ri(Zt.Uncompressed, af(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(t)}`);
  }
}
function Ah(e) {
  return Yt(e.data);
}
function o6(e) {
  const t = [];
  switch (e.contents.type) {
    case Ie.PublicKey:
      t.push(e.pubKeyEncoding === Zt.Compressed ? Fr.PublicKeyCompressed : Fr.PublicKeyUncompressed), t.push(Cl(V8(e.contents.data)));
      break;
    case Ie.MessageSignature:
      t.push(e.pubKeyEncoding === Zt.Compressed ? Fr.SignatureCompressed : Fr.SignatureUncompressed), t.push(Ah(e.contents));
      break;
  }
  return cn(t);
}
function Lo(e) {
  switch (e.type) {
    case Ie.Address:
      return dc(e);
    case Ie.Principal:
      return lb(e);
    case Ie.LengthPrefixedString:
      return la(e);
    case Ie.MemoString:
      return c6(e);
    case Ie.AssetInfo:
      return db(e);
    case Ie.PostCondition:
      return l6(e);
    case Ie.PublicKey:
      return Cl(e);
    case Ie.LengthPrefixedList:
      return $h(e);
    case Ie.Payload:
      return cb(e);
    case Ie.TransactionAuthField:
      return o6(e);
    case Ie.MessageSignature:
      return Ah(e);
  }
}
function s6() {
  return {
    type: Ie.Address,
    version: Ll.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Eh(e, t, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((t === Ht.SerializeP2PKH || t === Ht.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((t === Ht.SerializeP2WPKH || t === Ht.SerializeP2WSH || t === Ht.SerializeP2WSHNonSequential) && !r.every(wa))
    throw Error("Public keys must be compressed for segwit");
  switch (t) {
    case Ht.SerializeP2PKH:
      return _a(e, $6(r[0].data));
    case Ht.SerializeP2WPKH:
      return _a(e, I6(r[0].data));
    case Ht.SerializeP2SH:
    case Ht.SerializeP2SHNonSequential:
      return _a(e, L6(n, r.map(Cl)));
    case Ht.SerializeP2WSH:
    case Ht.SerializeP2WSHNonSequential:
      return _a(e, C6(n, r.map(Cl)));
  }
}
function dc(e) {
  const t = [];
  return t.push(Yt(uc(e.version, 1))), t.push(Yt(e.hash160)), cn(t);
}
function ca(e) {
  const t = cu(lt(e.readBytes(1))), n = lt(e.readBytes(20));
  return { type: Ie.Address, version: t, hash160: n };
}
function lb(e) {
  const t = [];
  return t.push(e.prefix), t.push(dc(e.address)), e.prefix === Ja.Contract && t.push(la(e.contractName)), cn(t);
}
function i6(e) {
  const t = e.readUInt8Enum(Ja, (s) => {
    throw new dr(`Unexpected Principal payload type: ${s}`);
  }), n = ca(e);
  if (t === Ja.Standard)
    return { type: Ie.Principal, prefix: t, address: n };
  const r = $r(e);
  return {
    type: Ie.Principal,
    prefix: t,
    address: n,
    contractName: r
  };
}
function la(e) {
  const t = [], n = ya(e.content), r = n.byteLength;
  return t.push(Yt(uc(r, e.lengthPrefixBytes))), t.push(n), cn(t);
}
function $r(e, t, n) {
  t = t || 1;
  const r = cu(lt(e.readBytes(t))), s = yh(e.readBytes(r));
  return ri(s, t, n ?? 128);
}
function a6(e) {
  return ri(e, 4, 1e5);
}
function sg(e) {
  if (e && gb(e, $l))
    throw new Error(`Memo exceeds maximum length of ${$l} bytes`);
  return { type: Ie.MemoString, content: e };
}
function c6(e) {
  const t = [], n = ya(e.content), r = k6(lt(n), $l * 2);
  return t.push(Yt(r)), cn(t);
}
function ub(e) {
  let t = yh(e.readBytes($l));
  return t = t.replace(/\u0000*$/, ""), { type: Ie.MemoString, content: t };
}
function db(e) {
  const t = [];
  return t.push(dc(e.address)), t.push(la(e.contractName)), t.push(la(e.assetName)), cn(t);
}
function cf(e) {
  return {
    type: Ie.AssetInfo,
    address: ca(e),
    contractName: $r(e),
    assetName: $r(e)
  };
}
function kh(e, t) {
  return {
    type: Ie.LengthPrefixedList,
    lengthPrefixBytes: t || 4,
    values: e
  };
}
function $h(e) {
  const t = e.values, n = [];
  n.push(Yt(uc(t.length, e.lengthPrefixBytes)));
  for (const r of t)
    n.push(Lo(r));
  return cn(n);
}
function fb(e, t, n) {
  const r = cu(lt(e.readBytes(4))), s = [];
  for (let o = 0; o < r; o++)
    switch (t) {
      case Ie.Address:
        s.push(ca(e));
        break;
      case Ie.LengthPrefixedString:
        s.push($r(e));
        break;
      case Ie.MemoString:
        s.push(ub(e));
        break;
      case Ie.AssetInfo:
        s.push(cf(e));
        break;
      case Ie.PostCondition:
        s.push(u6(e));
        break;
      case Ie.PublicKey:
        s.push(of(e));
        break;
      case Ie.TransactionAuthField:
        s.push(r6(e));
        break;
    }
  return kh(s, n);
}
function l6(e) {
  const t = [];
  if (t.push(e.conditionType), t.push(lb(e.principal)), (e.conditionType === Zn.Fungible || e.conditionType === Zn.NonFungible) && t.push(db(e.assetInfo)), e.conditionType === Zn.NonFungible && t.push(on(e.assetName)), t.push(e.conditionCode), e.conditionType === Zn.STX || e.conditionType === Zn.Fungible) {
    if (e.amount > BigInt("0xffffffffffffffff"))
      throw new Ns("The post-condition amount may not be larger than 8 bytes");
    t.push(As(e.amount, !1, 8));
  }
  return cn(t);
}
function u6(e) {
  const t = e.readUInt8Enum(Zn, (i) => {
    throw new dr(`Could not read ${i} as PostConditionType`);
  }), n = i6(e);
  let r, s, o;
  switch (t) {
    case Zn.STX:
      return r = e.readUInt8Enum(Za, (a) => {
        throw new dr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: Ie.PostCondition,
        conditionType: Zn.STX,
        principal: n,
        conditionCode: r,
        amount: o
      };
    case Zn.Fungible:
      return s = cf(e), r = e.readUInt8Enum(Za, (a) => {
        throw new dr(`Could not read ${a} as FungibleConditionCode`);
      }), o = BigInt(`0x${lt(e.readBytes(8))}`), {
        type: Ie.PostCondition,
        conditionType: Zn.Fungible,
        principal: n,
        conditionCode: r,
        amount: o,
        assetInfo: s
      };
    case Zn.NonFungible:
      s = cf(e);
      const i = Ir(e);
      return r = e.readUInt8Enum(tf, (a) => {
        throw new dr(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: Ie.PostCondition,
        conditionType: Zn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: i
      };
  }
}
function go(e, t) {
  return cn([e, t]);
}
function d6(e) {
  return new Uint8Array([e.type]);
}
function f6(e) {
  return e.type === ie.OptionalNone ? new Uint8Array([e.type]) : go(e.type, on(e.value));
}
function h6(e) {
  const t = new Uint8Array(4);
  return ni(t, e.buffer.length, 0), go(e.type, lu(t, e.buffer));
}
function p6(e) {
  const t = gh(S$(e.value, BigInt(U$)), Km);
  return go(e.type, t);
}
function g6(e) {
  const t = gh(e.value, Km);
  return go(e.type, t);
}
function y6(e) {
  return go(e.type, dc(e.address));
}
function w6(e) {
  return go(e.type, lu(dc(e.address), la(e.contractName)));
}
function m6(e) {
  return go(e.type, on(e.value));
}
function b6(e) {
  const t = [], n = new Uint8Array(4);
  ni(n, e.list.length, 0), t.push(n);
  for (const r of e.list) {
    const s = on(r);
    t.push(s);
  }
  return go(e.type, cn(t));
}
function x6(e) {
  const t = [], n = new Uint8Array(4);
  ni(n, Object.keys(e.data).length, 0), t.push(n);
  const r = Object.keys(e.data).sort((s, o) => s.localeCompare(o));
  for (const s of r) {
    const o = ri(s);
    t.push(la(o));
    const i = on(e.data[s]);
    t.push(i);
  }
  return go(e.type, cn(t));
}
function hb(e, t) {
  const n = [], r = t == "ascii" ? zm(e.data) : ya(e.data), s = new Uint8Array(4);
  return ni(s, r.length, 0), n.push(s), n.push(r), go(e.type, cn(n));
}
function S6(e) {
  return hb(e, "ascii");
}
function v6(e) {
  return hb(e, "utf8");
}
function on(e) {
  switch (e.type) {
    case ie.BoolTrue:
    case ie.BoolFalse:
      return d6(e);
    case ie.OptionalNone:
    case ie.OptionalSome:
      return f6(e);
    case ie.Buffer:
      return h6(e);
    case ie.UInt:
      return g6(e);
    case ie.Int:
      return p6(e);
    case ie.PrincipalStandard:
      return y6(e);
    case ie.PrincipalContract:
      return w6(e);
    case ie.ResponseOk:
    case ie.ResponseErr:
      return m6(e);
    case ie.List:
      return b6(e);
    case ie.Tuple:
      return x6(e);
    case ie.StringASCII:
      return S6(e);
    case ie.StringUTF8:
      return v6(e);
    default:
      throw new Ns("Unable to serialize. Invalid Clarity Value.");
  }
}
function A6(e) {
  const t = Object.values(e).filter((r) => typeof r == "number"), n = new Set(t);
  return (r) => n.has(r);
}
const ig = /* @__PURE__ */ new Map();
function pb(e, t) {
  const n = ig.get(e);
  if (n !== void 0)
    return n(t);
  const r = A6(e);
  return ig.set(e, r), pb(e, t);
}
class ja {
  constructor(t) {
    this.consumed = 0, this.source = t;
  }
  readBytes(t) {
    const n = this.source.subarray(this.consumed, this.consumed + t);
    return this.consumed += t, n;
  }
  readUInt32BE() {
    return M$(this.readBytes(4), 0);
  }
  readUInt8() {
    return B$(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return C$(this.readBytes(2), 0);
  }
  readBigUIntLE(t) {
    const n = this.readBytes(t).slice().reverse(), r = lt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(t) {
    const n = this.readBytes(t), r = lt(n);
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
    if (pb(t, r))
      return r;
    throw n(r);
  }
}
function Ir(e) {
  let t;
  if (typeof e == "string") {
    const r = e.slice(0, 2).toLowerCase() === "0x";
    t = new ja(Yt(r ? e.slice(2) : e));
  } else e instanceof Uint8Array ? t = new ja(e) : t = e;
  switch (t.readUInt8Enum(ie, (r) => {
    throw new dr(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ie.Int:
      return H8(t.readBytes(16));
    case ie.UInt:
      return vn(t.readBytes(16));
    case ie.Buffer:
      const r = t.readUInt32BE();
      return rb(t.readBytes(r));
    case ie.BoolTrue:
      return tb();
    case ie.BoolFalse:
      return nb();
    case ie.PrincipalStandard:
      const s = ca(t);
      return P8(s);
    case ie.PrincipalContract:
      const o = ca(t), i = $r(t);
      return eb(o, i);
    case ie.ResponseOk:
      return F8(Ir(t));
    case ie.ResponseErr:
      return D8(Ir(t));
    case ie.OptionalNone:
      return ob();
    case ie.OptionalSome:
      return sb(Ir(t));
    case ie.List:
      const a = t.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Ir(t));
      return j8(c);
    case ie.Tuple:
      const u = t.readUInt32BE(), h = {};
      for (let x = 0; x < u; x++) {
        const L = $r(t).content;
        if (L === void 0)
          throw new dr('"content" is undefined');
        h[L] = Ir(t);
      }
      return gr(h);
    case ie.StringASCII:
      const d = t.readUInt32BE(), w = k$(t.readBytes(d));
      return Et(w);
    case ie.StringUTF8:
      const y = t.readUInt32BE(), v = yh(t.readBytes(y));
      return R8(v);
    default:
      throw new dr("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const E6 = (e) => e.length % 2 == 0 ? e : `0${e}`, k6 = (e, t) => e.padEnd(t, "0"), gb = (e, t) => e ? ya(e).length > t : !1;
function lf(e) {
  return Pw(e);
}
const Qa = (e) => e8(Sh(e)), Ih = (e) => lt(B8(e)), $6 = (e) => lt(Qa(e)), I6 = (e) => {
  const t = Qa(e), n = lu(new Uint8Array([0]), new Uint8Array([t.length]), t), r = Qa(n);
  return lt(r);
}, L6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((o) => {
    n.push(o.length), n.push(o);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Qa(r);
  return lt(s);
}, C6 = (e, t) => {
  if (e > 15 || t.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + e), t.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + t.length), n.push(174);
  const r = cn(n), s = Sh(r), o = [];
  o.push(0), o.push(s.length), o.push(s);
  const i = cn(o), a = Qa(i);
  return lt(a);
};
function T6(e) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(e) && e.length < 128;
}
function yb(e) {
  const t = on(e);
  return `0x${lt(t)}`;
}
function B6(e) {
  return Ir(e);
}
const Vi = (e) => {
  try {
    return ui.c32addressDecode(e), !0;
  } catch {
    return !1;
  }
};
function Lh() {
  return {
    type: Ie.MessageSignature,
    data: lt(new Uint8Array(uu))
  };
}
function wb(e, t, n, r) {
  const s = Eh(0, e, 1, [aa(t)]).hash160, o = wa(aa(t)) ? Zt.Compressed : Zt.Uncompressed;
  return {
    hashMode: e,
    signer: s,
    nonce: Kn(n, !1),
    fee: Kn(r, !1),
    keyEncoding: o,
    signature: Lh()
  };
}
function ec(e) {
  return "signature" in e;
}
function ag(e) {
  return e === Ht.SerializeP2SH || e === Ht.SerializeP2WSH;
}
function N6(e) {
  return e === Ht.SerializeP2SHNonSequential || e === Ht.SerializeP2WSHNonSequential;
}
function cg(e) {
  const t = lf(e);
  return t.nonce = 0, t.fee = 0, ec(t) ? t.signature = Lh() : t.fields = [], {
    ...t,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function M6(e) {
  const t = [
    e.hashMode,
    Yt(e.signer),
    As(e.nonce, !1, 8),
    As(e.fee, !1, 8),
    e.keyEncoding,
    Ah(e.signature)
  ];
  return cn(t);
}
function P6(e) {
  const t = [
    e.hashMode,
    Yt(e.signer),
    As(e.nonce, !1, 8),
    As(e.fee, !1, 8)
  ], n = kh(e.fields);
  t.push($h(n));
  const r = new Uint8Array(2);
  return T$(r, e.signaturesRequired, 0), t.push(r), cn(t);
}
function _6(e, t) {
  const n = lt(t.readBytes(20)), r = BigInt(`0x${lt(t.readBytes(8))}`), s = BigInt(`0x${lt(t.readBytes(8))}`), o = t.readUInt8Enum(Zt, (a) => {
    throw new dr(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (e === Ht.SerializeP2WPKH && o != Zt.Compressed)
    throw new dr("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const i = af(t);
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: o,
    signature: i
  };
}
function U6(e, t) {
  const n = lt(t.readBytes(20)), r = BigInt("0x" + lt(t.readBytes(8))), s = BigInt("0x" + lt(t.readBytes(8))), o = fb(t, Ie.TransactionAuthField).values;
  let i = !1, a = 0;
  for (const u of o)
    switch (u.contents.type) {
      case Ie.PublicKey:
        wa(u.contents) || (i = !0);
        break;
      case Ie.MessageSignature:
        if (u.pubKeyEncoding === Zt.Uncompressed && (i = !0), a += 1, a === 65536)
          throw new Hs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = t.readUInt16BE();
  if (i && (e === Ht.SerializeP2WSH || e === Ht.SerializeP2WSHNonSequential))
    throw new Hs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: e,
    signer: n,
    nonce: r,
    fee: s,
    fields: o,
    signaturesRequired: c
  };
}
function Gu(e) {
  return ec(e) ? M6(e) : P6(e);
}
function Ku(e) {
  const t = e.readUInt8Enum(Ht, (n) => {
    throw new dr(`Could not parse ${n} as AddressHashMode`);
  });
  return t === Ht.SerializeP2PKH || t === Ht.SerializeP2WPKH ? _6(t, e) : U6(t, e);
}
function mb(e, t, n, r) {
  const o = e + lt(new Uint8Array([t])) + lt(As(n, !1, 8)) + lt(As(r, !1, 8));
  if (Yt(o).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ih(Yt(o));
}
function bb(e, t, n) {
  const r = 33 + uu, s = wa(t) ? Zt.Compressed : Zt.Uncompressed, o = e + E6(s.toString(16)) + n.data, i = Yt(o);
  if (i.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ih(i);
}
function O6(e, t, n, r, s) {
  const o = mb(e, t, n, r), i = q8(s, o), a = W8(s), c = bb(o, a, i);
  return {
    nextSig: i,
    nextSigHash: c
  };
}
function xb(e, t, n, r, s, o) {
  const i = mb(e, t, n, r), a = aa(z8(i, o, s)), c = bb(i, a, o);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function H6() {
  const e = wb(Ht.SerializeP2PKH, "", 0, 0);
  return e.signer = s6().hash160, e.keyEncoding = Zt.Compressed, e.signature = Lh(), e;
}
function lg(e, t, n) {
  return ec(e) ? D6(e, t, n) : F6(e, t, n);
}
function D6(e, t, n) {
  const { pubKey: r, nextSigHash: s } = xb(t, n, e.fee, e.nonce, e.keyEncoding, e.signature), o = Eh(0, e.hashMode, 1, [r]).hash160;
  if (o !== e.signer)
    throw new Hs(`Signer hash does not equal hash of public key(s): ${o} != ${e.signer}`);
  return s;
}
function F6(e, t, n) {
  const r = [];
  let s = t, o = !1, i = 0;
  for (const c of e.fields)
    switch (c.contents.type) {
      case Ie.PublicKey:
        wa(c.contents) || (o = !0), r.push(c.contents);
        break;
      case Ie.MessageSignature:
        c.pubKeyEncoding === Zt.Uncompressed && (o = !0);
        const { pubKey: u, nextSigHash: h } = xb(s, n, e.fee, e.nonce, c.pubKeyEncoding, c.contents);
        if (ag(e.hashMode) && (s = h), r.push(u), i += 1, i === 65536)
          throw new Hs("Too many signatures");
        break;
    }
  if (ag(e.hashMode) && i !== e.signaturesRequired || N6(e.hashMode) && i < e.signaturesRequired)
    throw new Hs("Incorrect number of signatures");
  if (o && (e.hashMode === Ht.SerializeP2WSH || e.hashMode === Ht.SerializeP2WSHNonSequential))
    throw new Hs("Uncompressed keys are not allowed in this hash mode");
  const a = Eh(0, e.hashMode, e.signaturesRequired, r).hash160;
  if (a !== e.signer)
    throw new Hs(`Signer hash does not equal hash of public key(s): ${a} != ${e.signer}`);
  return s;
}
function Sb(e) {
  return {
    authType: en.Standard,
    spendingCondition: e
  };
}
function vb(e, t) {
  return {
    authType: en.Sponsored,
    spendingCondition: e,
    sponsorSpendingCondition: t || wb(Ht.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function ug(e) {
  if (e.spendingCondition)
    switch (e.authType) {
      case en.Standard:
        return Sb(cg(e.spendingCondition));
      case en.Sponsored:
        return vb(cg(e.spendingCondition), H6());
      default:
        throw new Tl("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function j6(e, t) {
  switch (e.authType) {
    case en.Standard:
      return lg(e.spendingCondition, t, en.Standard);
    case en.Sponsored:
      return lg(e.spendingCondition, t, en.Standard);
    default:
      throw new Tl("Invalid origin auth type");
  }
}
function R6(e, t) {
  switch (e.authType) {
    case en.Standard:
      const n = {
        ...e.spendingCondition,
        fee: Kn(t, !1)
      };
      return { ...e, spendingCondition: n };
    case en.Sponsored:
      const r = {
        ...e.sponsorSpendingCondition,
        fee: Kn(t, !1)
      };
      return { ...e, sponsorSpendingCondition: r };
  }
}
function z6(e, t) {
  const n = {
    ...e.spendingCondition,
    nonce: Kn(t, !1)
  };
  return {
    ...e,
    spendingCondition: n
  };
}
function G6(e, t) {
  const n = {
    ...e.sponsorSpendingCondition,
    nonce: Kn(t, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function K6(e, t) {
  const n = {
    ...t,
    nonce: Kn(t.nonce, !1),
    fee: Kn(t.fee, !1)
  };
  return {
    ...e,
    sponsorSpendingCondition: n
  };
}
function V6(e) {
  const t = [];
  switch (t.push(e.authType), e.authType) {
    case en.Standard:
      t.push(Gu(e.spendingCondition));
      break;
    case en.Sponsored:
      t.push(Gu(e.spendingCondition)), t.push(Gu(e.sponsorSpendingCondition));
      break;
  }
  return cn(t);
}
function X6(e) {
  const t = e.readUInt8Enum(en, (r) => {
    throw new dr(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (t) {
    case en.Standard:
      return n = Ku(e), Sb(n);
    case en.Sponsored:
      n = Ku(e);
      const r = Ku(e);
      return vb(n, r);
  }
}
class Y6 {
  constructor(t, n, r, s, o, i, a) {
    if (this.version = t, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: Kn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? P$, this.postConditionMode = o ?? ia.Deny, this.postConditions = s ?? kh([]), i)
      this.anchorMode = D$(i);
    else
      switch (r.payloadType) {
        case st.Coinbase:
        case st.CoinbaseToAltRecipient:
        case st.NakamotoCoinbase:
        case st.PoisonMicroblock:
        case st.TenureChange:
          this.anchorMode = Wn.OnChainOnly;
          break;
        case st.ContractCall:
        case st.SmartContract:
        case st.VersionedSmartContract:
        case st.TokenTransfer:
          this.anchorMode = Wn.Any;
          break;
      }
  }
  signBegin() {
    const t = lf(this);
    return t.auth = ug(t.auth), t.txid();
  }
  verifyBegin() {
    const t = lf(this);
    return t.auth = ug(t.auth), t.txid();
  }
  verifyOrigin() {
    return j6(this.auth, this.verifyBegin());
  }
  signNextOrigin(t, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, t, en.Standard, n);
  }
  signNextSponsor(t, n) {
    if (this.auth.authType === en.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, t, en.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(t) {
    const n = this.auth.spendingCondition;
    if (n && !ec(n)) {
      const r = wa(t);
      n.fields.push(Ri(r ? Zt.Compressed : Zt.Uncompressed, t));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(t, n, r, s) {
    const { nextSig: o, nextSigHash: i } = O6(n, r, t.fee, t.nonce, s);
    return ec(t) ? t.signature = o : t.fields.push(Ri(s.data.byteLength === Gm ? Zt.Compressed : Zt.Uncompressed, o)), i;
  }
  txid() {
    const t = this.serialize();
    return Ih(t);
  }
  setSponsor(t) {
    if (this.auth.authType != en.Sponsored)
      throw new Tl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = K6(this.auth, t);
  }
  setFee(t) {
    this.auth = R6(this.auth, t);
  }
  setNonce(t) {
    this.auth = z6(this.auth, t);
  }
  setSponsorNonce(t) {
    if (this.auth.authType != en.Sponsored)
      throw new Tl("Cannot sponsor sign a non-sponsored transaction");
    this.auth = G6(this.auth, t);
  }
  serialize() {
    if (this.version === void 0)
      throw new Ns('"version" is undefined');
    if (this.chainId === void 0)
      throw new Ns('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Ns('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Ns('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Ns('"payload" is undefined');
    const t = [];
    t.push(this.version);
    const n = new Uint8Array(4);
    return ni(n, this.chainId, 0), t.push(n), t.push(V6(this.auth)), t.push(this.anchorMode), t.push(this.postConditionMode), t.push($h(this.postConditions)), t.push(cb(this.payload)), cn(t);
  }
}
function zi(e) {
  let t;
  typeof e == "string" ? e.slice(0, 2).toLowerCase() === "0x" ? t = new ja(Yt(e.slice(2))) : t = new ja(Yt(e)) : e instanceof Uint8Array ? t = new ja(e) : t = e;
  const n = t.readUInt8Enum(Il, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = t.readUInt32BE(), s = X6(t), o = t.readUInt8Enum(Wn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), i = t.readUInt8Enum(ia, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = fb(t, Ie.PostCondition), c = n6(t);
  return new Y6(n, s, c, a, i, o, r);
}
const q6 = U8, Ra = vn, W6 = rb;
const Z6 = /* @__PURE__ */ new Set([4001, -31001]), J6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], Q6 = ["result", "data", "payload", "response", "params"], dg = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], hu = (e) => typeof e == "string" && e.toLowerCase().includes("xverse"), pi = () => {
  if (!(typeof window > "u")) {
    try {
      const e = window.top;
      if (e && e !== window.self && e.location.origin === window.location.origin)
        return e;
    } catch {
    }
    return window;
  }
}, No = (e, t) => {
  if (!(!e || !t))
    return t.split(".").reduce((n, r) => n == null ? void 0 : n[r], e);
}, e5 = (e, t) => e.id === t.id || !!(e.name && t.name && e.name.toLowerCase() === t.name.toLowerCase()), Ab = (e) => {
  if (!e)
    return [];
  const t = e, n = [
    ...t.btc_providers ?? [],
    ...t.webbtc_providers ?? [],
    ...t.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((o) => e5(o, r)) === s
  );
}, Eb = (e) => e ? Ab(pi()).some(
  (t) => {
    var n;
    return t.id === e && (hu(t.id) || ((n = t.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, kb = () => {
  if (typeof window > "u")
    return;
  const e = pi(), t = Ab(e).filter(
    (n) => {
      var r;
      return hu(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of t) {
    const r = No(e, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of J6) {
    const r = No(e, n) ?? (e === window ? void 0 : No(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, t5 = (e) => {
  if (typeof window > "u" || !e)
    return;
  const t = pi(), n = No(t, e) ?? (t === window ? void 0 : No(window, e)) ?? Ql(e);
  if (n)
    return n;
  if (hu(e) || Eb(e))
    return kb();
}, Rc = (e, t) => {
  try {
    e == null || e(t);
  } catch {
  }
}, n5 = ["blockstack-session", "blockstack"], r5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const e of n5) {
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
r5();
const $b = (e) => e.startsWith("0x") || e.startsWith("0X") ? e.slice(2) : e, lr = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim();
  return t.length > 0 ? t : null;
}, o5 = (e) => {
  const t = lr(e);
  if (!t)
    return null;
  const n = $b(t);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : t.startsWith("0x") || t.startsWith("0X") ? t : `0x${n}`;
}, s5 = (e) => {
  const t = lr(e);
  if (!t)
    return null;
  const n = $b(t);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, uf = (e, t = "mainnet") => {
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
      return uf(n.network, t);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return uf(r, t);
  }
  return t;
}, Rs = (e) => {
  if (typeof e > "u" || e === null)
    return;
  if (typeof e == "bigint")
    return e.toString(10);
  if (typeof e == "number")
    return Number.isFinite(e) ? String(e) : void 0;
  const t = String(e).trim();
  return t.length > 0 ? t : void 0;
}, tc = (e, t = 0) => {
  if (t > 8)
    return null;
  if (typeof e == "string") {
    const s = e.trim();
    return Vi(s) ? s : null;
  }
  if (!e)
    return null;
  if (Array.isArray(e)) {
    for (const s of e) {
      const o = tc(s, t + 1);
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
    const o = tc(n[s], t + 1);
    if (o)
      return o;
  }
  return typeof n.mainnet == "string" && Vi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Vi(n.testnet) ? n.testnet.trim() : null;
}, fg = (e) => {
  const t = e && typeof e == "object" && "code" in e ? e.code : void 0, r = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Ib = (e) => {
  if (e && typeof e == "object") {
    const r = "code" in e ? e.code : void 0;
    if (typeof r == "number" && Z6.has(r))
      return !0;
  }
  const n = (e instanceof Error ? e.message : String(e ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, oi = (e) => {
  if (e instanceof Error)
    return e;
  const t = e && typeof e == "object" ? e : {}, n = t.error && typeof t.error == "object" ? t.error : null, r = lr(n == null ? void 0 : n.message) ?? lr(t.message) ?? lr(t.error) ?? lr(e) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? t.code, s.data = (n == null ? void 0 : n.data) ?? t.data, s;
}, ua = (e) => {
  if (e && typeof e == "object") {
    const t = e;
    if (t.error)
      throw oi(t);
    if (t.status === "error")
      throw oi(t.result ?? t);
  }
  return e;
}, hg = async (e, t, n) => {
  if (typeof e.request != "function")
    throw new Error(`Wallet provider does not support request("${t}").`);
  try {
    const r = await e.request(t, n);
    return ua(r);
  } catch (r) {
    throw oi(r);
  }
}, Lb = () => kb(), Ch = () => {
  if (typeof window > "u")
    return;
  const e = pi();
  for (const t of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = No(e, t) ?? (e === window ? void 0 : No(window, t));
    if (n)
      return n;
  }
}, pg = () => {
  if (typeof window > "u")
    return;
  const e = Ch();
  if (typeof (e == null ? void 0 : e.transactionRequest) == "function")
    return e;
  const t = pi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = No(t, n) ?? (t === window ? void 0 : No(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ol = (e) => {
  var r, s;
  const t = qs();
  if (hu(t) || Eb(t))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = pi() ?? window;
  return e === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || e === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || e === Lb();
}, Vu = (e) => {
  const t = s5(e);
  if (!t)
    return null;
  try {
    const n = zi(t).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Bl = (e, t = 0) => {
  if (t > 6 || typeof e > "u" || e === null)
    return null;
  const n = Vu(e), r = o5(e) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? lr(e) ?? void 0 : void 0
    };
  if (Array.isArray(e)) {
    for (const a of e) {
      const c = Bl(a, t + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof e != "object")
    return null;
  const s = e;
  let o = null;
  for (const a of dg)
    if (Vu(s[a])) {
      o = lr(s[a]);
      break;
    }
  const i = lr(s.txId) || lr(s.txid) || lr(s.transactionId);
  if (i)
    return {
      ...s,
      txId: i,
      txid: i,
      txRaw: o ?? lr(s.txRaw) ?? void 0
    };
  for (const a of dg) {
    const c = Vu(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: lr(s[a]) ?? void 0
      };
  }
  for (const a of Q6) {
    const c = s[a], u = Bl(c, t + 1);
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
}, Xu = (e) => {
  const t = Bl(e);
  if (t)
    return t;
  throw new Error("Wallet response did not include a transaction id.");
}, i5 = (e) => {
  const t = Bl(e);
  return t || (e && typeof e == "object" ? e : { result: e });
}, a5 = (e) => ({
  ...e,
  fee: Rs(e.fee),
  nonce: Rs(e.nonce),
  sponsored: e.sponsored === !0
}), gg = (e) => ({
  recipient: e.recipient,
  amount: Rs(e.amount) ?? "0",
  memo: e.memo,
  network: uf(e.network),
  address: e.stxAddress,
  fee: Rs(e.fee),
  nonce: Rs(e.nonce),
  sponsored: e.sponsored ?? !1
}), Cb = "WALLET_ADDRESS_MISMATCH", c5 = 45e3;
let za = null;
const df = (e) => {
  e && (za = { address: e, at: Date.now() });
}, l5 = () => {
  za = null;
}, u5 = () => za && Date.now() - za.at <= c5 ? za.address : null, d5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t.includes("network mismatch") || t.includes("mismatch") && t.includes("network");
}, f5 = async (e) => {
  l5();
  try {
    await e.request("wallet_disconnect");
  } catch {
  }
  const t = ua(await e.request("wallet_connect")), n = tc(t);
  return df(n), n;
}, h5 = async (e, t, n, r) => {
  try {
    return ua(await e.request(t, n));
  } catch (s) {
    const o = oi(s);
    if (!d5(o))
      throw o;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: t,
      message: o.message
    });
    let i = null;
    try {
      i = await f5(e);
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
        { code: i ? Cb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: t, address: i });
    try {
      return ua(await e.request(t, n));
    } catch (a) {
      throw oi(a);
    }
  }
};
let yg = 3e4;
const p5 = (e, t) => {
  let n;
  const r = new Promise((s, o) => {
    n = setTimeout(() => {
      o(
        Object.assign(
          new Error(`Xverse did not answer ${t} within ${yg / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, yg);
  });
  return Promise.race([e, r]).finally(() => {
    n && clearTimeout(n);
  });
}, g5 = async (e, t, n) => {
  const r = (c, u) => {
    if (t && c !== t)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${t}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Cb }
      );
    return c;
  }, s = u5();
  if (s)
    return Rc(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let o = null;
  Rc(n, "account-read");
  try {
    const c = ua(
      await p5(e.request("wallet_getAccount"), "wallet_getAccount")
    );
    o = tc(c), console.info("[wallet:xverse-preflight]", {
      stage: o ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: o
    });
  } catch (c) {
    if (Ib(c))
      throw oi(c);
    Rc(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (o)
    return df(o), r(o, "wallet_getAccount");
  let i;
  Rc(n, "account-reconnect");
  try {
    i = ua(await e.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), oi(c);
  }
  const a = tc(i);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return df(a), r(a, "wallet_connect");
}, y5 = async (e, t) => {
  if (!ol(e)) {
    const o = await hg(
      e,
      "stx_transferStx",
      gg(t)
    );
    return Xu(o);
  }
  const n = Ch();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const o = await hg(
      n,
      "stx_transferStx",
      gg(t)
    );
    return Xu(o);
  }
  const r = Lb();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await g5(r, t.stxAddress);
  const s = await h5(
    r,
    "stx_transferStx",
    {
      recipient: t.recipient,
      amount: Rs(t.amount) ?? "0",
      ...t.memo ? { memo: t.memo } : {},
      ...t.fee !== void 0 ? { fee: Rs(t.fee) } : {}
    },
    t.stxAddress
  );
  return Xu(s);
}, w5 = () => qs(), Tb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const e = qs(), t = e ? t5(e) : void 0;
  if (t)
    return t;
  const n = pi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, wg = (e, t) => {
  const n = Tb(), r = a5({
    ...e,
    onFinish: (s) => {
      var o;
      (o = e.onFinish) == null || o.call(e, i5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Hc(r, t);
  if (ol(n) && !Ch()) {
    const s = pg();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: qs(),
        route: "legacy-transaction-request"
      }), Hc(r, s);
  }
  return void y5(n, e).then((s) => {
    var o;
    (o = e.onFinish) == null || o.call(e, s);
  }).catch((s) => {
    var o, i;
    if (fg(s) && ol(n)) {
      const a = pg();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: qs(),
          route: "legacy-transaction-request"
        }), Hc(r, a);
        return;
      }
    }
    if (fg(s) && !ol(n)) {
      Hc(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Ib(s)) {
      (o = e.onCancel) == null || o.call(e);
      return;
    }
    if (e.onError) {
      e.onError(s);
      return;
    }
    (i = e.onCancel) == null || i.call(e);
  });
}, m5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), mg = (e) => yb(e).replace(/^0x/, ""), bg = "This wallet cannot sign messages. Try Xverse or Leather.", xg = (e) => typeof (e == null ? void 0 : e.request) == "function", Sg = (e) => typeof (e == null ? void 0 : e.structuredDataSignatureRequest) == "function", b5 = (e) => {
  const t = e && typeof e == "object" ? e.code : void 0, n = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return t === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, x5 = (e) => {
  const t = (e instanceof Error ? e.message : String(e ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(t) || t.includes("no longer supported") || t.includes("request() rpc") || t.includes("upgrade to the");
};
async function S5(e, t) {
  const n = await e.request("stx_signStructuredMessage", {
    message: mg(t.message),
    domain: mg(t.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function v5(e, t) {
  const n = await p$({
    domain: t.domain,
    message: t.message,
    network: au(t.network),
    stxAddress: t.stxAddress,
    appDetails: t.appDetails ?? m5()
  }), r = await e.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Yu(e) {
  var s, o;
  const t = w5() || "", n = /xverse/i.test(t);
  let r = Tb();
  if (n && !Sg(r)) {
    const i = window;
    r = ((s = i.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((o = i.xverseProviders) == null ? void 0 : o.StacksProvider);
  }
  if (Sg(r))
    try {
      return await v5(r, e);
    } catch (i) {
      if (n || !xg(r) || !x5(i)) throw i;
    }
  if (!n && xg(r))
    try {
      return await S5(r, e);
    } catch (i) {
      throw b5(i) ? new Error(bg) : i;
    }
  throw new Error(bg);
}
const vg = 1000000n, To = 1000000n, Nl = 50n, sn = 3000n, Kr = 300n, La = 3000n, A5 = 50000n, E5 = 300n, k5 = 200n, pu = 15000n, On = (e) => e + Nl;
function Ur(e) {
  const t = e < 0n ? "-" : "", n = e < 0n ? -e : e;
  return `${t}${n / vg}.${(n % vg).toString().padStart(6, "0")}`;
}
function Ag(e, t = Kr) {
  return e <= sn ? 0 : Number((e - sn) / On(t));
}
function qu(e, t = 0n) {
  const n = To - e - t;
  return n > 0n ? n : 0n;
}
function $5(e, t = Kr) {
  return e > To ? "over" : e < sn + On(t) ? "empty" : e < A5 ? "low" : "ok";
}
const I5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", L5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", C5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function T5(e) {
  var n, r, s, o;
  const t = (e == null ? void 0 : e.success) === !0 ? (n = e.value) == null ? void 0 : n.value : null;
  return !t || ((r = t.version) == null ? void 0 : r.value) !== "1" || ((s = t["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((o = t["receipt-bytes"]) == null ? void 0 : o.value) !== "16" || C5.some((i, a) => {
    var c;
    return ((c = t["core-" + (a + 1)]) == null ? void 0 : c.value) !== I5 + "." + i;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Bb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Wu = 3, B5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", N5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-music-awards-v1-0", Eg = 1, [ff, Nb] = Bb.split("."), Ar = (e) => Array.from(e, (t) => t.toString(16).padStart(2, "0")).join("");
function hf(e) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(e)) throw Error("Invalid encoded data.");
  return Uint8Array.from(e.match(/../g), (t) => parseInt(t, 16));
}
async function M5(e) {
  return Ar(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(e))));
}
async function Ss(e, t = {}) {
  const n = await fetch("/hiro/mainnet" + e, { ...t, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Mb(e, t = []) {
  const n = await Ss(`/v2/contracts/call-read/${ff}/${Nb}/${e}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ff, arguments: t.map((r) => "0x" + Ar(on(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Dr(Ir(n.result));
}
async function P5() {
  const e = await Ss(`/v2/contracts/source/${ff}/${Nb}?proof=0`);
  if (typeof e.source != "string" || await M5(e.source) !== L5) throw Error("Deployed source does not match the tested helper.");
  if (T5(await Mb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Pb(e) {
  return e.startsWith("SP") && Vi(e) && !e.includes(".");
}
async function _5(e) {
  var r;
  if (!Pb(e)) throw Error("Invalid mainnet wallet address.");
  const t = await Ss(`/v2/accounts/${e}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(t.balance) || !Number.isSafeInteger(t.nonce) || t.nonce < 0) throw Error("Malformed account data.");
  const n = await Ss(`/extended/v1/address/${e}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== t.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= t.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(t.balance), nonce: BigInt(t.nonce) };
}
async function U5(e) {
  const t = await Ss(`/v2/accounts/${e}?proof=0`);
  return BigInt(t.balance);
}
async function O5(e, t) {
  var s, o;
  const n = await Mb("get-owner", [Ra(e), Ra(t)]), r = (n == null ? void 0 : n.success) === !0 ? (o = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : o.value : null;
  if (typeof r != "string" || !Pb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function H5(e, t) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: hf(e), signal: AbortSignal.timeout(15e3) });
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
async function D5(e) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(e)) throw Error("Invalid transaction ID.");
  const t = await fetch(`/hiro/mainnet/extended/v1/tx/${e}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (t.status === 404) return null;
  if (!t.ok) throw Error("Transaction lookup unavailable.");
  return t.json();
}
function F5(e) {
  if (!e.raw || e.raw.length > 16384 || !e.txid) throw Error("Missing or oversized signed transaction.");
  const t = zi(hf(e.raw)), n = t.auth, r = t.payload, s = n.spendingCondition;
  if (t.version !== 0 || t.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || ji(_a(Ll.MainnetSingleSig, s.signer)) !== e.address || s.fee !== BigInt(e.fee) || s.nonce !== BigInt(e.nonce) || t.txid() !== e.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (t.verifyOrigin(), e.kind === "play") {
    const o = t.postConditions.values[0];
    if (r.payloadType !== 2 || ji(r.contractAddress) + "." + r.contractName.content !== Bb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Ar(on(r.functionArgs[0])) !== Ar(on(Ra(e.core))) || Ar(on(r.functionArgs[1])) !== Ar(on(Ra(e.song))) || Ar(on(r.functionArgs[2])) !== Ar(on(W6(hf(e.id)))) || e.amount !== "50" || t.postConditionMode !== ia.Deny || t.postConditions.values.length !== 1 || o.conditionType !== 0 || o.amount !== 50n || o.conditionCode !== Za.Equal || o.principal.prefix !== 2 || ji(o.principal.address) !== e.address) throw Error("Saved play protection or master does not match.");
  } else if (e.kind === "like") {
    if (r.payloadType !== 2 || ji(r.contractAddress) + "." + r.contractName.content !== B5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Ar(on(r.functionArgs[0])) !== Ar(on(Ra(e.song))) || typeof e.liked != "boolean" || Ar(on(r.functionArgs[1])) !== Ar(on(q6(e.liked))) || e.amount !== "0" || t.postConditionMode !== ia.Deny || t.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Dr(r.recipient).value !== e.recipient || r.amount !== BigInt(e.amount)) throw Error("Saved withdrawal does not match.");
}
const j5 = "xtrata.xyz/radio/listening-wallet", R5 = "Link a temporary listening wallet for pay-per-play; no spending permission", io = (e) => typeof e == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(e) && Vi(e), z5 = (e) => ({
  domain: gr({ name: Et(j5), version: Et("1"), "chain-id": vn(1) }),
  message: gr({
    purpose: Et(R5),
    main: Et(e.main),
    listening: Et(e.listening),
    issued: vn(e.issued)
  })
}), _b = 100000n, G5 = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function K5(e, t) {
  const n = e.filter((s) => !s || typeof s.sender != "string" || s.sender === t || !io(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= _b).sort(G5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const zc = 50;
function Ml(e) {
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
async function V5(e, t, n = 4) {
  if (!io(e)) return { ok: !1 };
  try {
    const r = (i) => `/extended/v1/address/${e}/stx_inbound?limit=${zc}&offset=${i}`, s = Ml(await t(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let o = Math.max(0, s.total - zc);
    for (let i = 0; i < n; i++) {
      const a = o === 0 && s.total <= zc ? s : Ml(await t(r(o)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = K5(a.transfers, e);
      if (c.ok && c.funder) return o > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (o === 0) return c;
      o = Math.max(0, o - zc);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const $o = 50, X5 = 6, Y5 = 20, kg = (e, t) => e.blockHeight - t.blockHeight || e.txIndex - t.txIndex;
function $g(e, t) {
  const n = e;
  if (!n || typeof n.total != "number" || !Number.isSafeInteger(n.total) || n.total < 0 || !Array.isArray(n.results)) return null;
  const r = [], s = [];
  for (const o of n.results) {
    const i = o && typeof o == "object" && o.tx && typeof o.tx == "object" ? o.tx : o;
    if (!i || typeof i.tx_id != "string" || typeof i.tx_type != "string") return null;
    if (s.push(i.tx_id), i.tx_type !== "token_transfer" || i.sender_address !== t || i.tx_status !== "success") continue;
    const a = i.token_transfer;
    if (!a || typeof a.recipient_address != "string" || typeof a.amount != "string" || !/^\d+$/.test(a.amount)) return null;
    const c = Number(i.block_height), u = Number(i.tx_index ?? 0);
    if (!Number.isSafeInteger(c) || !Number.isSafeInteger(u)) return null;
    r.push({ recipient: a.recipient_address, amount: BigInt(a.amount), txId: i.tx_id, blockHeight: c, txIndex: u });
  }
  return { total: n.total, sent: r, rows: s };
}
async function q5(e, t, n) {
  if (!io(e)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Ml(await t(`/extended/v1/address/${e}/stx_inbound?limit=${$o}&offset=0`));
    if (!s || s.total > X5 * $o) return { ok: !1 };
    for (const i of s.transfers) r.set(i.txId + ":" + i.txIndex, i);
    for (let i = $o; i < s.total; i += $o) {
      const a = Ml(await t(`/extended/v1/address/${e}/stx_inbound?limit=${$o}&offset=${i}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const o = /* @__PURE__ */ new Map();
    if (n) {
      const i = (u) => `/extended/v1/address/${e}/transactions?limit=${$o}&offset=${u}`, a = $g(await t(i(0)), e);
      if (!a || a.total > Y5 * $o) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) o.set(u.txId, u);
      for (let u = $o; u < a.total; u += $o) {
        const h = $g(await t(i(u)), e);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const d of h.rows) c.add(d);
        for (const d of h.sent) o.set(d.txId, d);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...o.values()] };
  } catch {
    return { ok: !1 };
  }
}
function W5(e) {
  const { self: t, balance: n, gift: r } = e;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...e.inbound].filter((d) => d && typeof d.sender == "string" && d.sender !== t && /^\d+$/.test(d.amount) && BigInt(d.amount) > 0n).sort(kg).map((d, w) => {
    const y = BigInt(d.amount);
    return r && d.sender === r.sender ? { sender: d.sender, left: y, kind: "gift", to: r.payer, at: w } : io(d.sender) && y >= _b ? { sender: d.sender, left: y, kind: "deposit", to: d.sender, at: w } : { sender: d.sender, left: y, kind: "dust", to: null, at: w };
  }), o = s.reduce((d, w) => d + w.left, 0n), i = [...e.outgoing].filter((d) => d && d.recipient !== t && io(d.recipient) && d.amount > 0n).sort(kg), a = i.reduce((d, w) => d + w.amount, 0n), c = o - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
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
    const w = u(s.filter((y) => y.to === d.recipient), d.amount);
    w > 0n && u(s, w);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((d, w) => d + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const d of s) {
    if (d.left <= 0n) continue;
    const w = `${d.kind}:${d.to ?? ""}`, y = h.get(w);
    y ? (y.amount += d.left, y.newest = Math.max(y.newest, d.at)) : h.set(w, { to: d.to, kind: d.kind, amount: d.left, newest: d.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((d, w) => d.newest - w.newest),
    hasTopUp: s.some((d) => d.kind === "deposit")
  };
}
function Z5(e, t) {
  const n = e.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = e.find((u) => u.kind === "gift"), s = e.filter((u) => u.kind === "dust"), o = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, h) => u + h.amount, 0n), i = [], a = [], c = o > t;
  return n.forEach((u, h) => {
    if (u.amount <= t) {
      a.push(u);
      return;
    }
    const d = h === n.length - 1 && !c;
    i.push({ to: u.to, kind: "deposit", mode: d ? "all" : "amount", send: u.amount - t });
  }), c ? i.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: o - t }) : (r && a.push(r), a.push(...s)), { steps: i, tooSmall: a };
}
function Ig(e) {
  const t = e.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (t == null ? void 0 : t.to) ?? null;
}
const Gc = 1500n, sl = [100, 250, 500], J5 = (e, t) => BigInt(e) * On(t), Ca = ["prepared", "signed", "unknown", "pending"], Q5 = 30 * 6e4, Pl = 6e4, Ni = (e) => {
  const t = e;
  return (t == null ? void 0 : t.feeRejected) === !0 || /\(400\)/.test((t == null ? void 0 : t.message) ?? "");
}, eI = 3e3, _l = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Zu = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
function tI(e) {
  let t = null, n = -1 / 0, r, s = null, o = null, i, a = -1 / 0, c = null, u = null, h = !1, d = !1, w = !1, y = null, v = !1, x = "", L = "", U = 0, _, A = null, T, B = [], Y, ee = -1 / 0;
  const oe = /* @__PURE__ */ new Set();
  let W = null, m = !1, C = 0, P = null, M = null, Z = !1, F = null, ge = !1, ce = null, Ge = !1, $ = !1, j = !1, ue = !1, me = !1, Ne = 0, xe = null, wt = Promise.resolve();
  const Fe = () => BigInt((t == null ? void 0 : t.limits.playFee) ?? Kr.toString()), Be = (b) => !!o && !(o.features ?? []).includes(b), Me = (b, k) => `xtrata.ppp.v1.${b}:${k}`, Bn = "xtrata.ppp.v1.as-main", An = () => {
    if (e.main()) return;
    const b = e.store.get(Bn);
    return b && io(b) ? b : void 0;
  }, ft = () => e.main() ?? An(), Ct = (b = o == null ? void 0 : o.address) => {
    if (!b) return [];
    try {
      const k = JSON.parse(e.store.get(Me("entries", b)) || "[]");
      return Array.isArray(k) ? k : [];
    } catch {
      return [];
    }
  }, Mt = (b) => {
    const k = [b, ...Ct(b.address).filter((K) => !(K.txid === b.txid && K.kind === b.kind))].slice(0, 200);
    e.store.set(Me("entries", b.address), JSON.stringify(k));
  }, G = (b = o == null ? void 0 : o.address) => !!b && e.store.get(Me("on", b)) !== "0", O = (b) => {
    o != null && o.address && e.store.set(Me("on", o.address), b ? "1" : "0");
  }, te = () => Ct().filter((b) => Ca.includes(b.status)), re = () => Ke() ? [...te(), ...Ct(Ve()).filter((b) => Ca.includes(b.status))] : te(), le = () => bt(o == null ? void 0 : o.address), bt = (b) => {
    if (!b) return null;
    try {
      return JSON.parse(e.store.get(Me("deposit", b)) || "null");
    } catch {
      return null;
    }
  }, Oe = (b, k = o == null ? void 0 : o.address) => {
    k && e.store.set(Me("deposit", k), JSON.stringify(b));
  };
  let ze = null;
  const At = (b = Pl) => {
    const k = e.now();
    ze = { since: ze && k < ze.until ? ze.since : k, until: Math.max((ze == null ? void 0 : ze.until) ?? 0, k + b) };
  }, He = () => !!ze && e.now() < ze.until && (i === void 0 || i < sn + On(Fe())), $e = () => !!le() || He(), Ve = () => Be("rootLike") ? o == null ? void 0 : o.address : (o == null ? void 0 : o.root) ?? (o == null ? void 0 : o.address), Ke = () => !!(o != null && o.address) && Ve() !== o.address, Xe = () => Ke() ? c && c.for === Ve() ? c.value : void 0 : i, Kt = () => Be("likeFee") ? k5 : E5, pn = (b) => b !== void 0 && b < sn + Kt(), dn = () => te().filter((b) => e.now() - b.created > Q5 && oe.has(b.txid)), Vn = () => (t == null ? void 0 : t.passkeyOnly) === !0 && (!ft() || r === ft() && !t.allowed), Pt = () => Vn() && !(o != null && o.linked), gn = () => {
    const b = ft();
    return !Pt() && !!b && !!(o != null && o.linked) && o.linked !== b;
  }, yr = (b) => Me("return-to", b), Vr = (b = o == null ? void 0 : o.address) => {
    if (!b) return;
    const k = e.store.get(yr(b));
    return k && io(k) && k !== b ? k : void 0;
  }, Dn = (b = o == null ? void 0 : o.address) => W && W.for === b ? W.res : null;
  function wr() {
    if (!(o != null && o.address)) return;
    if (o.linked) return { to: o.linked, kind: "linked" };
    const b = Vr();
    if (b) return { to: b, kind: "chosen" };
    const k = Dn();
    if (k != null && k.ok && k.funder) return { to: k.funder, kind: "funder" };
  }
  const yn = (b) => Me("gift", b);
  function Dt() {
    const b = o == null ? void 0 : o.address;
    if (!b) return null;
    if ((F == null ? void 0 : F.for) === b) return F.info;
    try {
      const k = JSON.parse(e.store.get(yn(b)) || "null");
      return k && typeof k.returnTo == "string" && typeof k.treasury == "string" ? k : null;
    } catch {
      return null;
    }
  }
  const dt = () => (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : ((o == null ? void 0 : o.slot) ?? 0) === 0 ? o == null ? void 0 : o.address : void 0;
  let Lt = null, ln = null, Lr = !1;
  const yo = (b) => Me("award-claim", b), E = (b) => Me("award-send", b), H = (b) => {
    try {
      const k = JSON.parse(e.store.get(E(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  }, V = (b) => {
    try {
      const k = JSON.parse(e.store.get(yo(b)) || "null");
      return k && typeof k.txid == "string" && e.now() - k.at < 2 * 36e5 ? k : null;
    } catch {
      return null;
    }
  };
  async function D(b = !1) {
    var ke;
    const k = dt();
    if (!k || !e.awardStatus || Lr) return;
    const K = (Lt == null ? void 0 : Lt.for) === k ? Lt : null, X = K == null ? void 0 : K.view.state, Le = X === "not-a-player" && ((ke = Dt()) == null ? void 0 : ke.drop) === "players", q = K ? Le ? 2e4 : X === "off" || X === "not-a-player" ? 30 * 6e4 : V(k) || H(k) ? 2e4 : X === "claimed" ? 10 * 6e4 : 6e4 : 0;
    if (!(K && !b && e.now() - K.at < q)) {
      Lr = !0;
      try {
        const be = await e.awardStatus(k);
        if (Lt = { for: k, view: be, at: e.now() }, be.state === "claimed" && e.store.set(yo(k), ""), be.state === "claimed" && be.holds === !1 && e.store.set(E(k), ""), be.state === "ready" && e.awardName && (ln == null ? void 0 : ln.for) !== k)
          try {
            ln = { for: k, name: await e.awardName(k), at: e.now() };
          } catch {
            ln = { for: k, name: void 0, at: e.now() };
          }
      } catch {
        Lt = { for: k, view: K && K.view.state !== "off" && K.view.state !== "not-a-player" ? { ...K.view, state: "unavailable" } : { state: "unavailable" }, at: e.now() };
      } finally {
        Lr = !1;
      }
    }
  }
  function Q() {
    const b = dt();
    if (!b || (Lt == null ? void 0 : Lt.for) !== b) return null;
    const k = Lt.view;
    if (k.state === "off" || k.state === "not-a-player") return null;
    const K = k.state === "claimed" ? null : V(b), X = k.state === "claimed" && k.holds !== !1 ? H(b) : null;
    return { ...k, ...(ln == null ? void 0 : ln.for) === b ? { name: ln.name } : {}, ...K ? { claimTx: K.txid } : {}, ...X ? { sendTx: X.txid } : {} };
  }
  async function ne() {
    var Le;
    const b = o == null ? void 0 : o.address;
    if (!b || !e.giftInfo || !((Le = t == null ? void 0 : t.gifts) != null && Le.enabled) || ge) return;
    const k = (F == null ? void 0 : F.for) === b ? F : null, K = k ? k.ok ? k.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (k && e.now() - k.at < K) return;
    ge = !0;
    const X = Dt();
    try {
      const q = await e.giftInfo(b);
      F = { for: b, info: q, ok: !0, at: e.now() }, e.store.set(yn(b), JSON.stringify(q));
    } catch {
      F = { for: b, info: X, ok: !1, at: e.now() };
    } finally {
      ge = !1;
    }
  }
  const Ce = () => Ct().reduce((b, k) => Ca.includes(k.status) ? b + BigInt(k.amount || "0") + BigInt(k.fee || "0") : b, 0n);
  function Se() {
    if (i === void 0) return 0;
    const b = i - Ce() - BigInt(Gt.length) * On(Fe());
    return b > 0n ? Ag(b, Fe()) : 0;
  }
  const Pe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", $t = "EMPTY — ADD STX TO PLAY";
  function Ze() {
    if (!(t != null && t.here)) return null;
    const b = (k, K) => ({ reason: k, text: K });
    switch (xt()) {
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
        return $e() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Ke() ? Pe : $t);
      case "ready":
        return !G() || !(o != null && o.session) || o.session.playsLeft < 1 || o.session.expires <= e.now() ? b("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : j ? Se() < 1 ? b("out", Ke() ? Pe : $t) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const ht = () => {
    var b;
    return !!(o != null && o.address) && Ke() && !!((b = Dt()) != null && b.player);
  };
  function at() {
    return ht() ? { locked: !0, known: !0 } : null;
  }
  const I = 3 * 6e4, ve = () => !!Dt() && !!e.history && !(o != null && o.linked);
  async function pt() {
    const b = o.address, k = Dt(), { balance: K, nonce: X } = await e.chain.account(b), Le = await e.history(b, !0);
    if (!Le.ok) return null;
    const q = W5({ self: b, balance: K, inbound: Le.inbound, outgoing: Le.outgoing, gift: { sender: k.treasury, payer: k.returnTo } });
    if (!q.ok) return null;
    const ke = Z5(q.parts, La);
    return { balance: K, nonce: X, parts: q.parts, steps: ke.steps, tooSmall: ke.tooSmall.length };
  }
  const un = () => Ge ? { state: "unavailable" } : !ce || e.now() - ce.at > I || i !== void 0 && i !== ce.balance ? { state: "none" } : ce.plan;
  function xt() {
    if (!(t != null && t.enabled)) return "off";
    if (!t.here) return "elsewhere";
    const b = ft();
    if (!Pt()) {
      if (!b) return "connect";
      if (!t.allowed) return "not-invited";
    }
    return o ? o.state === "unsupported" ? "unsupported" : o.state === "none" ? "intro" : gn() ? "wrong-wallet" : o.state === "known" ? "locked" : !Pt() && o.linked !== b ? "link" : i === void 0 ? "loading" : i > To && !o.backedUp ? "over" : i < sn + On(Fe()) ? "fund" : "ready" : "loading";
  }
  const mr = () => {
    var b, k, K, X, Le;
    return {
      step: xt(),
      busy: u,
      message: x,
      error: L,
      notice: Xr(),
      gate: t,
      main: ft(),
      mainConnected: !!e.main(),
      standIn: An(),
      listening: o == null ? void 0 : o.address,
      linked: o == null ? void 0 : o.linked,
      award: Q(),
      unproven: !!(o != null && o.unproven),
      phrase: !!(o != null && o.hasBackup),
      backedUp: !!(o != null && o.backedUp),
      balance: i,
      balanceState: i === void 0 ? void 0 : ((q) => q === "over" && (o != null && o.backedUp) ? "ok" : q)($5(i, Fe())),
      // backed up: over 1 STX reads as a healthy balance
      aboveTarget: i !== void 0 && i > To && !!(o != null && o.backedUp),
      playsLeft: i === void 0 ? 0 : Ag(i, Fe()),
      allowance: i === void 0 ? To : qu(i, BigInt(((b = le()) == null ? void 0 : b.amount) ?? "0")),
      session: (o == null ? void 0 : o.session) ?? null,
      payingOn: G(),
      entries: Ct(),
      depositTxid: ((k = le()) == null ? void 0 : k.txid) ?? _,
      depositPending: $e(),
      arrival: $e() ? { since: ((K = le()) == null ? void 0 : K.at) ?? (ze == null ? void 0 : ze.since) ?? e.now(), graceMs: Pl } : null,
      walletOutdated: Be("like"),
      canAnother: !!o && !Be("another"),
      canForget: !!o && !Be("forget"),
      passkeyName: o == null ? void 0 : o.passkeyName,
      hadGift: o != null && o.address && (F == null ? void 0 : F.for) === o.address && F.ok ? !!F.info : null,
      linkedListening: Y && Y === ft() ? B.map((q) => q.listening) : [],
      serverLinked: !!A && T === `${ft()}:${o == null ? void 0 : o.address}`,
      stuck: dn().length,
      armed: ue,
      queued: Gt.length,
      solo: Pt(),
      returnTo: (X = wr()) == null ? void 0 : X.to,
      returnToKind: (Le = wr()) == null ? void 0 : Le.kind,
      funderState: (() => {
        const q = Dn();
        return q ? q.ok ? q.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const q = Dn();
        return !!q && q.ok && q.distinct > 1;
      })(),
      walletCannotSolo: Pt() && Be("standalone"),
      walletCannotMulti: Be("multi"),
      others: ((o == null ? void 0 : o.others) ?? []).filter((q) => q !== ft() && q !== (o == null ? void 0 : o.linked)),
      creditedTo: Pt() && (o != null && o.address) && (P == null ? void 0 : P.for) === o.address && P.main ? P.main : void 0,
      createdHere: !!(o != null && o.address) && e.store.get(Me("created", o.address)) === "1",
      brandNew: !!(o != null && o.address) && i === 0n && (M == null ? void 0 : M.for) === o.address && M.unused,
      gift: (() => {
        const q = Dt();
        return q ? { player: q.player, from: q.from, source: q.source, amount: q.amount, ...q.drop !== void 0 ? { drop: q.drop } : {} } : null;
      })(),
      giftPlays: Dt() ? Se() : 0,
      playCost: On(Fe()),
      giftStop: Ze(),
      albumLock: at(),
      returnPlan: un(),
      slot: (o == null ? void 0 : o.state) === "unlocked" ? o.slot ?? 0 : 0,
      root: (o == null ? void 0 : o.state) === "unlocked" ? o.root ?? o.address : void 0,
      walletCannotAlbums: Be("slots"),
      likeFunds: (() => {
        var be;
        const q = Ve();
        if (!q || (o == null ? void 0 : o.state) !== "unlocked") return null;
        const ke = Xe();
        return { address: q, balance: ke, low: pn(ke), album: Ke(), pending: !!bt(q), txid: (be = bt(q)) == null ? void 0 : be.txid, main: ft() };
      })()
    };
  }, Xr = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ut = (b, k = "") => {
    x = b, L = k, e.changed();
  };
  async function zt(b, k) {
    if (!u) {
      u = b, L = "", e.changed();
      try {
        await k();
      } catch (K) {
        const X = K instanceof Error ? K.message : String(K);
        L = /Cancelled in the listening wallet/.test(X) ? "" : X, L || (x = "Not now. Nothing was signed.", me = !0);
      } finally {
        u = null, await nn(!0);
      }
    }
  }
  const gi = () => !!(t != null && t.enabled) && t.here && (Pt() || !!ft() && t.allowed), Ye = () => gi() && !gn(), ks = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", br = () => {
    if (gn()) throw new Error(ks());
  };
  async function Nn() {
    if (!gi()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(t != null && t.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await e.bridge(t.walletOrigin)), s;
  }
  const Mn = (b) => {
    const k = ft();
    return b.request("listening.status", k ? { main: k } : void 0);
  };
  async function Yr(b = !1) {
    o != null && o.address && (!b && e.now() - a < 3e4 || (i = await e.chain.balance(o.address), a = e.now(), await wo(b)));
  }
  async function wo(b = !1) {
    const k = Ve();
    if (!(!Ke() || !k || (o == null ? void 0 : o.state) !== "unlocked") && !(!b && (c == null ? void 0 : c.for) === k && e.now() - c.at < 3e4))
      try {
        c = { for: k, value: await e.chain.balance(k), at: e.now() };
      } catch {
      }
  }
  async function mo(b) {
    if ((Y !== b || e.now() - ee >= 6e4) && (B = await e.links(b), Y = b, ee = e.now()), (o == null ? void 0 : o.state) !== "unlocked" || o.linked === b) return;
    const k = `${b}:${o.address}`;
    T === k && A || (A = B.find((K) => K.listening === o.address) ?? null, T = k);
  }
  async function bo() {
    const b = o == null ? void 0 : o.address;
    if (!Pt() || !b || o != null && o.linked || !e.funder || m || !i || i <= 0n) return;
    const k = Dn(b);
    if (k != null && k.ok && k.funder) return;
    const K = k != null && k.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, C - 1), 30 * 6e4);
    if (!(W && W.for === b && e.now() - W.at < K)) {
      m = !0;
      try {
        W = { for: b, res: await e.funder(b), at: e.now() };
      } catch {
        W = { for: b, res: { ok: !1 }, at: e.now() };
      } finally {
        m = !1;
      }
      C = W.res.ok ? 0 : C + 1;
    }
  }
  async function ma() {
    const b = o == null ? void 0 : o.address;
    if (!(!Pt() || !b || o != null && o.linked || !e.mainOf || Z) && !(P && P.for === b && (P.ok || e.now() - P.at < 6e4))) {
      Z = !0;
      try {
        P = { for: b, main: await e.mainOf(b), ok: !0, at: e.now() };
      } catch {
        P = { for: b, main: null, ok: !1, at: e.now() };
      } finally {
        Z = !1;
      }
    }
  }
  async function $s() {
    const b = o == null ? void 0 : o.address;
    if (!(!b || (o == null ? void 0 : o.state) !== "unlocked" || i !== 0n || (M == null ? void 0 : M.for) === b) && e.store.get(Me("created", b)) !== "1")
      try {
        M = { for: b, unused: await e.chain.confirmedNonce(b) === 0n };
      } catch {
      }
  }
  async function Qn() {
    var Le;
    const b = o == null ? void 0 : o.address;
    if (!b) return !1;
    let k, K = !1;
    const X = /* @__PURE__ */ new Map();
    for (const q of re())
      try {
        const ke = await e.chain.transaction(q.txid);
        if (!ke) {
          if (oe.add(q.txid), e.now() - q.created > 15 * 6e4 && !X.has(q.address) && X.set(q.address, await e.chain.confirmedNonce(q.address)), k = X.get(q.address), k !== void 0 && k > BigInt(q.nonce)) {
            Mt({ ...q, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((q.status === "unknown" || q.status === "signed") && q.raw)
            try {
              await e.chain.broadcast(q.raw, q.txid), Mt({ ...q, status: "pending" });
            } catch (Te) {
              Ni(Te) && Mt({ ...q, status: "failed", note: Te.message, raw: void 0 });
            }
          continue;
        }
        oe.delete(q.txid);
        const be = String(ke.tx_status);
        if (be === "success" && ke.canonical !== !1 && ke.is_unanchored === !1) {
          if (Mt({ ...q, status: "confirmed", confirmedAt: e.now(), actualFee: String(ke.fee_rate ?? q.fee), raw: void 0 }), K = !0, q.kind === "like" && (v = !0, q.status !== "confirmed" && typeof q.liked == "boolean"))
            try {
              (Le = e.likeConfirmed) == null || Le.call(e, q.song, q.liked);
            } catch {
            }
        } else be.startsWith("abort_") || be.startsWith("dropped_") ? Mt({ ...q, status: "failed", note: be, raw: void 0 }) : q.status !== "pending" && Mt({ ...q, status: "pending" });
      } catch {
      }
    for (const q of Ke() ? [b, Ve()] : [b]) {
      const ke = bt(q);
      if (ke)
        try {
          const be = await e.chain.transaction(ke.txid), Te = String((be == null ? void 0 : be.tx_status) ?? "");
          (Te === "success" && be.is_unanchored === !1 || Te.startsWith("abort_") || Te.startsWith("dropped_") || !be && e.now() - ke.at > 2 * 36e5) && (Oe(null, q), Te === "success" && At(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return K;
  }
  async function nn(b = !1) {
    var k;
    try {
      const K = ft();
      if ((b || !t || r !== K || e.now() - n > 3e5) && (t = await e.config(K), n = e.now(), r = K), !t.enabled || !t.here || !Pt() && (!K || !t.allowed)) {
        s && (o != null && o.session) && await s.request("listening.stop").catch(() => {
        }), ue && xo(), e.changed();
        return;
      }
      await Nn(), o = await Mn(s), gn() && o.state === "unlocked" && (Jr(), await s.request("listening.lock").catch(() => {
      }), i = void 0, o = await Mn(s)), K && t.allowed && await mo(K), await Yr(b), await bo(), await ma(), await $s(), await ne(), await D(), await Qn() && await Yr(!0), await wo(), await bi(), U = 0;
    } catch {
      U++;
    }
    if (xt() === "locked" ? yi() : ue && xo(), v) {
      v = !1;
      try {
        (k = e.likesChanged) == null || k.call(e);
      } catch {
      }
    }
    e.changed(), Gt.length && !Zr && Xn();
  }
  async function Is(b) {
    const k = o == null ? void 0 : o.root;
    if (!k || o != null && o.slot || !(o != null && o.address) || Be("slots")) return;
    const K = Number(e.store.get(Me("slot", k)));
    if (!(!Number.isSafeInteger(K) || K < 1))
      try {
        const { balance: X } = await e.chain.account(o.address);
        if (X >= sn + On(Fe())) return;
        await b.request("listening.openSlot", { slot: K }), o = await Mn(b), i = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Cr(b, k) {
    var q;
    br();
    const K = !(o != null && o.address) || G(o.address), X = o != null && o.linked ? (q = e.nameOf) == null ? void 0 : q.call(e, o.linked) : void 0;
    await b.request("listening.unlock", { mode: "unlock", terms: K ? qr() : void 0, anyPasskey: k, ...ft() ? { main: ft() } : {}, ...X ? { label: X } : {} }), o = await Mn(b), K && (G(o.address) ? await er() : await b.request("listening.stop")), await Is(b), ut(K ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const Le = y;
    y = null, Le && e.now() - Le.at < 12e4 && setTimeout(() => void nn(!0).then(() => So(Le)), 0);
  }
  function yi() {
    ue || u || me || Ne >= 3 || !s || !(o != null && o.address) || (ue = !0, wt = (async () => {
      try {
        await Cr(s, !1), Ne = 0;
      } catch (b) {
        const k = b instanceof Error ? b.message : String(b);
        /Cancelled in the listening wallet/.test(k) ? xe || (me = !0, ut("Not now. Nothing was signed.")) : /did not answer/.test(k) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Ne++, L = k);
      } finally {
        ue = !1;
        const b = xe;
        xe = null, b ? await b() : await nn(!0);
      }
    })());
  }
  async function xo(b) {
    ue && (xe = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await wt), b && await b(), e.changed();
  }
  const qr = () => ({
    fee: Fe().toString(),
    maxPlays: t.limits.maxSessionPlays,
    budget: To.toString(),
    expires: e.now() + t.limits.sessionHours * 36e5
  });
  async function er() {
    if (!(o != null && o.address)) return !1;
    if (j || (j = await e.tabLock(o.address)), !j)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Uo(b, k) {
    const K = o.address, { balance: X, nonce: Le } = k ?? await e.chain.account(K);
    i = X;
    const q = await s.request("listening.prepareReturn", {
      mode: b.mode,
      balance: X.toString(),
      nonce: Le.toString(),
      fee: La.toString(),
      ...b.amount !== void 0 ? { amount: b.amount.toString() } : {},
      ...b.linked ? {} : { destination: b.to }
    });
    if (q.recipient !== b.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ke = b.mode === "amount" ? b.amount : b.mode === "all" ? X - La : X - To - La, be = zi(q.raw);
    if (Dr(be.payload.recipient).value !== b.to || String(be.payload.amount) !== q.amount || ke !== void 0 && q.amount !== ke.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const Te = {
      id: Zu(),
      address: K,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: q.recipient,
      amount: q.amount,
      fee: q.fee,
      nonce: Le.toString(),
      created: e.now(),
      status: "signed",
      raw: q.raw,
      txid: q.txid
    };
    e.validate(Te), Mt(Te);
    try {
      await e.chain.broadcast(q.raw, q.txid), Mt({ ...Te, status: "pending" });
    } catch (ct) {
      throw Mt({ ...Te, status: "unknown", note: ct.message }), ct;
    }
    return q;
  }
  const wi = pu, wn = La;
  async function Oo(b, k, K) {
    if ((o == null ? void 0 : o.state) !== "unlocked" || !o.address) throw new Error("Unlock the listening wallet first.");
    if (Be("slots") || Be("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const X = o.slot ?? 0;
    if (b === k || ![b, k].includes(X) || ![b, k].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const Le = o.root ?? o.address, q = b === 0 ? Le : o.address, ke = k === 0 ? Le : o.address, { balance: be, nonce: Te } = await e.chain.account(q);
    if (be < K + wn + sn) throw new Error(b === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const ct = await s.request("listening.signMove", { from: b, to: k, amount: K.toString(), fee: wn.toString(), nonce: Te.toString(), balance: be.toString() }), S = zi(ct.raw);
    if (ct.from !== q || ct.to !== ke || ct.amount !== K.toString() || Dr(S.payload.recipient).value !== ke || String(S.payload.amount) !== K.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const N = {
      id: Zu(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ke,
      amount: ct.amount,
      fee: ct.fee,
      nonce: Te.toString(),
      created: e.now(),
      status: "signed",
      raw: ct.raw,
      txid: ct.txid
    };
    e.validate(N), Mt(N);
    try {
      await e.chain.broadcast(ct.raw, ct.txid), Mt({ ...N, status: "pending" });
    } catch (z) {
      throw Mt({ ...N, status: "unknown", note: z.message }), z;
    }
    return Oe({ txid: ct.txid, amount: ct.amount, at: e.now() }, ke), ke === Le && Le !== o.address ? c = null : a = -1 / 0, ct;
  }
  let Ls = !1;
  const mi = /* @__PURE__ */ new Map(), Wr = (b) => Me("float", b);
  async function bi() {
    if (Ls || (o == null ? void 0 : o.state) !== "unlocked" || !Ke() || Be("move") || Be("rootLike") || !o.address) return;
    const b = o.address;
    if (e.store.get(Wr(b)) === "1") return;
    const k = Dt();
    if (!(k != null && k.player) || k.state !== "arrived") return;
    const K = Xe();
    if (K === void 0 || i === void 0) return;
    if (!pn(K)) {
      e.store.set(Wr(b), "1");
      return;
    }
    if (bt(Ve()) || Cs() || re().length || i < wi * 4n + sn + wn) return;
    const X = mi.get(b);
    if (!(X && (X.n >= 3 || e.now() - X.at < 5 * 6e4))) {
      Ls = !0, mi.set(b, { n: ((X == null ? void 0 : X.n) ?? 0) + 1, at: e.now() });
      try {
        await Oo(o.slot ?? 0, 0, wi), e.store.set(Wr(b), "1");
      } catch (Le) {
        console.warn("[radio] likes float not sent yet", Le);
      } finally {
        Ls = !1;
      }
    }
  }
  async function Ho(b) {
    if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Be("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const k = await pt().catch(() => null);
    if (!k)
      throw ce = null, Ge = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Ge = !1, i = k.balance;
    const K = { balance: k.balance, nonce: k.nonce };
    if (b === "excess") {
      const be = Ig(k.parts) ?? Vr();
      if (!be) throw new Error("Choose where to send the excess first.");
      await Uo({ mode: "excess", to: be, linked: !1 }, K), ce = null, ut("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const X = k.steps;
    if (!X.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!ce && ce.balance === k.balance && e.now() - ce.at <= I && ce.steps.length === X.length && ce.steps.every((be, Te) => be.to === X[Te].to && be.mode === X[Te].mode && be.send === X[Te].send))) {
      ce = {
        at: e.now(),
        balance: k.balance,
        steps: X,
        parts: k.parts,
        plan: { state: "ready", steps: X.map((be) => ({ to: be.to, kind: be.kind, send: be.send.toString() })), kept: k.tooSmall, excess: Ig(k.parts) }
      }, ut(X.length > 1 ? `This goes back in ${X.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const q = X[0], ke = q.to ?? Vr();
    if (!ke) throw new Error("Choose where to send the rest first.");
    if (q.mode === "amount" && Be("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Uo({ mode: q.mode, to: ke, linked: !1, ...q.mode === "amount" ? { amount: q.send } : {} }, K), ce = null, X.length === 1 ? (O(!1), ut("Returned ✓ Paying is off.")) : ut(`Returned ✓ ${X.length - 1} more ${X.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function Tr() {
    if (!(o != null && o.unproven)) return;
    const b = await Nn();
    await b.request("listening.prove"), o = await Mn(b);
  }
  const xr = {
    forceRefresh: () => nn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (b) => {
      if (!e.main() && !(b !== null && !io(b))) {
        if (b === An()) return nn(!0);
        e.store.set(Bn, b ?? ""), L = "", x = "", i = void 0, a = -1 / 0, c = null, await nn(!0);
      }
    },
    /**
     * Remove the open player from this device (the wallet box asks in its own panel; the passkey is not touched). Only
     * the listener's own player, only when it is empty and nothing is on its way: checked here as well as on the page.
     */
    forget: () => zt("Check the listening wallet…", async () => {
      const b = await Nn();
      if (Be("forget")) throw new Error("The listening wallet box needs an update before it can do this. Try again shortly.");
      if ((o == null ? void 0 : o.state) !== "unlocked" || (o.slot ?? 0) !== 0) throw new Error("Unlock your own player first.");
      if (i === void 0) throw new Error("Could not read what this player holds. Nothing was removed.");
      if (i > BigInt((t == null ? void 0 : t.limits.returnFee) ?? "3000")) throw new Error("Empty this player first. Nothing was removed.");
      if (te().length) throw new Error("Wait for the pending payment to confirm. Nothing was removed.");
      Jr(), await b.request("listening.forget"), i = void 0, o = await Mn(b), O(!1), ut("Removed from this device ✓");
    }),
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (b) => zt("Waiting for your passkey…", async () => {
      const k = await Nn(), K = !!(b != null && b.another) && !e.main() && !Be("another");
      K && (o == null ? void 0 : o.state) === "unlocked" && await k.request("listening.lock"), await k.request("listening.unlock", { mode: "create", terms: qr(), ...e.main() ? { main: e.main() } : {}, ...b != null && b.quick && !e.main() ? { quick: !0 } : {}, ...K ? { another: !0 } : {} }), o = await Mn(k), o.address && e.store.set(Me("created", o.address), "1"), O(!0), ut(Pt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await er();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** The intro song has started for someone claiming a new player: its play waits for the plays to land (30 minutes at most). */
    holdFirstPlay: () => {
      Do = e.now() + xi;
    },
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (b) => {
      b ? At() : ze = null, e.changed();
    },
    giftSent: (b, k) => {
      !(o != null && o.address) || le() || (Oe({ txid: b, amount: k.toString(), at: e.now() }), a = -1 / 0, F = null, Lt && (Lt = { ...Lt, at: -1 / 0 }), ut("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (b) => {
      if (br(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Be("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Nn()).request("listening.bindSlot", { slot: b, issued: e.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (b, k, K, X) => {
      Oe({ txid: K, amount: X.toString(), at: e.now() }, k), F = null, await xr.openAlbum(b), ut("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (b) => zt("Opening…", async () => {
      if (br(), (o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Be("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || d || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((o.slot ?? 0) === b) return;
      Jr(), await s.request("listening.openSlot", { slot: b }), o = await Mn(s), i = void 0, a = -1 / 0, ce = null, Ge = !1;
      const k = o.root;
      k && b > 0 && e.store.set(Me("slot", k), String(b)), ut(b === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (b = !1) => {
      const k = () => zt("Waiting for your passkey…", async () => Cr(await Nn(), b));
      return ue ? b ? Be("cancel") ? (ut("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : xo(async () => {
        (xt() === "locked" || xt() === "intro") && await k();
      }) : wt : k();
    },
    link: () => zt("Sign in your wallet…", async () => {
      br();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      const k = (await e.links(b)).find((K) => K.listening === o.address);
      if (k)
        await s.request("listening.link", { main: b, issued: k.issued, mainSignature: k.mainSignature });
      else {
        const K = { main: b, listening: o.address, issued: e.now() }, X = await e.signWithMain(b, z5(K)), Le = await s.request("listening.link", { main: b, issued: K.issued, mainSignature: X });
        await e.saveLink({ ...K, mainSignature: X, listeningSignature: Le.listeningSignature }), ee = -1 / 0;
      }
      ut("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => o != null && o.unproven ? (await zt("One more passkey check…", Tr), !(o != null && o.unproven)) : !0,
    deposit: () => zt("Approve the deposit in your wallet…", async () => {
      br(), await Tr();
      const b = e.main();
      if (!b || !(o != null && o.address)) throw new Error("Connect your main wallet first.");
      if (le()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (He()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await Yr(!0);
      const k = qu(i ?? 0n);
      if (k <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      _ = await e.deposit(b, o.address, k), _ && Oe({ txid: _, amount: k.toString(), at: e.now() }), ut("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => zt("Approve the top-up in your wallet…", async () => {
      br(), await Tr();
      const b = e.main(), k = Ve();
      if (!b || !k) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (bt(k)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const K = await e.chain.balance(k);
      Ke() ? c = { for: k, value: K, at: e.now() } : (i = K, a = e.now());
      const X = qu(K);
      if (X <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const Le = await e.deposit(b, k, X);
      Le && Oe({ txid: Le, amount: X.toString(), at: e.now() }, k), ut("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (b) => zt("Adding plays…", async () => {
      if (br(), !Ke()) throw new Error("Open the album you want to add plays to first.");
      if (!sl.includes(b)) throw new Error("Choose one of the amounts offered.");
      const k = J5(b, Fe());
      if (h || d || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (re().length || le()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Oo(0, o.slot ?? 0, k), ut("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => zt("Confirm in the listening wallet…", async () => {
      if (!Ye()) throw new Error("Connect your wallet first.");
      await er(), await s.request("listening.approveSession", qr()), O(!0), ut("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => zt("Clearing…", async () => {
      for (const b of dn())
        await e.chain.transaction(b.txid) || Mt({ ...b, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ut("Cleared ✓");
    }),
    switchOff: () => zt("Switching off…", async () => {
      Jr(), await (s == null ? void 0 : s.request("listening.stop")), O(!1), ut("Music support is off. Playback is paused.");
    }),
    /**
     * Write down the backup words. The wallet box shows them and asks three back; this page never sees a word, only
     * that it was done. For a player that has a phrase, while it is open.
     */
    backup: () => zt("Showing your backup words in the box…", async () => {
      if (!(o != null && o.hasBackup)) throw new Error("This player was made before backup words existed, so it has none.");
      const b = await Nn();
      await b.request("listening.backup"), o = await Mn(b), ut("Backed up ✓ Keep those 24 words somewhere safe and private.");
    }),
    /**
     * The open player signs a request about the albums it keeps (releases.ts). No panel: it is a structured message
     * that can move nothing. Rejects when the player is locked or the wallet box is too old.
     */
    signShelf: async (b, k) => {
      if ((o == null ? void 0 : o.state) !== "unlocked") throw new Error("Unlock your player first.");
      if (Be("shelf")) throw new Error("The listening wallet box needs an update before it can keep albums. Try again shortly.");
      return (await Nn()).request("listening.signShelf", { action: b, ...k ? { release: k } : {} });
    },
    /** Ask again where the player's record stands, and what name it would carry (after linking a wallet, say). */
    awardRefresh: async () => {
      ln = null, await D(!0), e.changed();
    },
    /**
     * Claim the player's Music Hero record. The server signs the record (with the name, or the address alone); the
     * wallet box reads it, shows it and signs the claim; this page sends it. The player pays the network fee only.
     */
    claimAward: (b) => zt("Confirm in the listening wallet…", async () => {
      var Te, ct, S, N;
      const k = dt();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if (!e.awardNote) throw new Error("Awards are not available here.");
      if (Be("award")) throw new Error("The listening wallet box needs an update before it can claim a record. Try again shortly.");
      if (V(k)) throw new Error("Your claim is already on its way. It usually confirms in a minute or two.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Claim as soon as it has.");
      await er();
      const K = await e.awardNote(k, b), { balance: X, nonce: Le } = await e.chain.account(k);
      if (X < Gc) throw new Error("Your player needs a little STX for the network fee to claim. Add plays first.");
      const ke = await (await Nn()).request("listening.signAward", {
        cls: K.cls,
        number: K.number,
        plays: K.plays,
        record: K.record,
        signature: K.signature,
        fee: Gc.toString(),
        nonce: Le.toString(),
        balance: X.toString()
      }), be = zi(ke.raw);
      if (ke.hero !== k || ke.number !== K.number || ((ct = (Te = be.payload) == null ? void 0 : Te.functionName) == null ? void 0 : ct.content) !== "claim" || ((N = (S = be.payload) == null ? void 0 : S.contractName) == null ? void 0 : N.content) !== N5.split(".")[1])
        throw new Error("The signed claim does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(ke.raw, ke.txid), e.store.set(yo(k), JSON.stringify({ txid: ke.txid, at: e.now() })), a = -1 / 0, Lt && (Lt = { ...Lt, at: -1 / 0 }), ut("Record claimed ✓ It is being made now: about a minute.");
    }),
    /**
     * Send the player's claimed record to another address. The wallet box shows the inscription and the full address
     * and the listener confirms there; the transaction can move that one inscription and nothing else.
     */
    sendAward: (b) => zt("Confirm in the listening wallet…", async () => {
      var ct, S, N;
      const k = dt(), K = Q();
      if ((o == null ? void 0 : o.state) !== "unlocked" || !k) throw new Error("Unlock your player first.");
      if ((K == null ? void 0 : K.state) !== "claimed" || K.inscription === void 0) throw new Error("There is no record to send yet.");
      if (K.holds === !1) throw new Error("This record has already been sent.");
      if (K.holds !== !0) throw new Error("Could not check that your player still holds the record. Try again shortly.");
      if (H(k)) throw new Error("Your record is already on its way.");
      const X = b.trim();
      if (!io(X)) throw new Error("Enter a Stacks address starting SP. A .btc name will not work here.");
      if (X === k) throw new Error("That is your player itself. Enter the address to send it to.");
      if (Be("sendRecord")) throw new Error("The listening wallet box needs an update before it can send a record. Try again shortly.");
      if (h || d || w || re().length) throw new Error("A payment is still confirming. Send as soon as it has.");
      await er();
      const { balance: Le, nonce: q } = await e.chain.account(k);
      if (Le < Gc) throw new Error("Your player needs a little STX for the network fee. Add plays first.");
      const be = await (await Nn()).request("listening.signSendRecord", { inscription: K.inscription, recipient: X, fee: Gc.toString(), nonce: q.toString(), balance: Le.toString() }), Te = zi(be.raw);
      if (be.from !== k || be.recipient !== X || be.inscription !== K.inscription || ((S = (ct = Te.payload) == null ? void 0 : ct.functionName) == null ? void 0 : S.content) !== "transfer" || Dr((N = Te.payload.functionArgs) == null ? void 0 : N[2]).value !== X)
        throw new Error("The signed send does not match what was asked. Nothing was sent.");
      await e.chain.broadcast(be.raw, be.txid), e.store.set(E(k), JSON.stringify({ txid: be.txid, at: e.now() })), a = -1 / 0, Lt && (Lt = { ...Lt, at: -1 / 0 }), ut("Record sent ✓ It arrives in a minute or two.");
    }),
    lock: () => zt("Locking…", async () => {
      Jr(), await (s == null ? void 0 : s.request("listening.lock")), i = void 0, ut("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (b) => {
      const k = String(b ?? "").trim();
      if (!(o != null && o.address)) return ut("", "Unlock the listening wallet first.");
      if (!io(k)) return ut("", "Enter a standard mainnet address (it starts with SP).");
      if (k === o.address) return ut("", "That is this listening wallet itself. Enter a different address.");
      e.store.set(yr(o.address), k), ut("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      o != null && o.address && e.store.set(yr(o.address), ""), e.changed();
    },
    returnFunds: (b) => zt("Check the return in the listening wallet…", async () => {
      if (!Ye()) throw new Error("Connect your wallet first.");
      if (!(o != null && o.address)) throw new Error("Unlock the listening wallet first.");
      if (ve()) return Ho(b);
      const k = wr();
      if (!k) throw new Error(Pt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (k.kind !== "linked" && Be("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Uo({ mode: b, to: k.to, linked: k.kind === "linked" }), b === "all" && O(!1), ut(b === "all" ? k.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, Gt = [], Br = 10, xi = 30 * 6e4;
  let Zr = !1, Do = 0;
  const ba = (b) => e.now() < Do && (b === "intro" || b === "locked" || b === "link" || b === "fund" && $e()), Cs = () => h || !!u || d || w, Jr = () => {
    Gt.length && (Gt.length = 0, e.changed());
  };
  async function Si(b) {
    if (!Gt.some((k) => k.id === b.id) && !Ct().some((k) => k.id === b.id) && (Gt.push({ ...b, at: e.now() }), Gt.length > Br && Gt.shift()), Cs() || te().length) {
      const k = Gt.length;
      x = `Queued ${k === 1 ? "this song" : k + " songs"}: paid as soon as the wallet is free.`, e.changed();
    }
    await Xn();
  }
  async function Xn() {
    if (!Zr) {
      Zr = !0;
      try {
        for (; Gt.length; ) {
          for (; Gt.length && e.now() - Gt[0].at > xi; ) Gt.shift();
          if (!Gt.length || Cs() || await vi(Gt[0]) === "wait") return;
          Gt.shift();
        }
      } finally {
        Zr = !1, e.changed();
      }
    }
  }
  async function vi(b) {
    var k;
    h = !0;
    try {
      await nn();
      const K = xt();
      if (K === "loading" || ba(K)) return "wait";
      if (K !== "ready" || !G() || !(o != null && o.session) || o.session.playsLeft < 1 || !j) return "done";
      if (te().length) return "wait";
      $ || (await e.chain.verify(), $ = !0);
      const X = o.address, { balance: Le, nonce: q } = await e.chain.account(X);
      i = Le, a = e.now();
      const ke = await e.chain.owner(Wu, b.song);
      if (ke === X || ke === ft()) return "done";
      const be = await s.request("listening.signPlay", {
        core: Wu,
        song: b.song,
        receipt: b.id,
        fee: Fe().toString(),
        nonce: q.toString(),
        balance: Le.toString()
      }), Te = {
        id: b.id,
        address: X,
        kind: "play",
        core: Wu,
        song: b.song,
        recipient: ke,
        amount: "50",
        fee: Fe().toString(),
        nonce: q.toString(),
        created: e.now(),
        status: "signed",
        raw: be.raw,
        txid: be.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(Te), Mt(Te);
      const ct = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`;
      try {
        await e.chain.broadcast(be.raw, be.txid), Mt({ ...Te, status: "pending" }), x = `♪ Paid ${ct}`, L = "";
      } catch (S) {
        Mt({ ...Te, status: Ni(S) ? "failed" : "unknown", note: S.message, ...Ni(S) ? { raw: void 0 } : {} }), L = S.message;
      }
      return o = await Mn(s), "done";
    } catch (K) {
      const X = K instanceof Error ? K.message : "payment unavailable";
      return (k = Dt()) != null && k.player ? (x = "Payment is taking a moment: " + X, "wait") : (x = "This song played free: " + X, "done");
    } finally {
      h = !1, e.changed();
    }
  }
  function Ai(b) {
    return !(t != null && t.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(xt()) || Be("like") ? !1 : (So(b), !0);
  }
  async function So(b) {
    const k = b.title ? `“${b.title}”` : `song #${b.song}`, K = (ye) => {
      var Ft;
      L = ye, x = "";
      try {
        (Ft = e.likeFailed) == null || Ft.call(e, b.song);
      } catch {
      }
      e.changed();
    }, X = Ke(), Le = xt(), q = ft(), ke = X && (Le === "fund" || Le === "over") ? "ready" : Le, be = Pt() ? Ve() : q;
    if (ke === "locked") {
      y = { ...b, at: e.now() }, ut(`Unlock to like ${k}. It sends straight after.`);
      return;
    }
    if (ke === "wrong-wallet") return K(ks());
    if (ke === "link") return K("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (Pt() && Be("standalone")) return K("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ke === "fund") return K("Top up the listening wallet to like: each like or unlike costs 0.0003 STX.");
    if (ke === "over") return K("Return the excess first: the listening wallet holds more than 1 STX.");
    if (X) {
      await wo(!0);
      const ye = Xe();
      if (pn(ye))
        return e.changed(), K(_l);
    }
    if (ke !== "ready" || !be) return K("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(o != null && o.session)) return K("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!j) return K("Pay-per-play is running in another tab. Like from that tab.");
    const Te = Ct(Ve()).find((ye) => ye.kind === "like" && ye.song === b.song);
    if (Te && Ca.includes(Te.status))
      return K(`Your last like for ${k} is still on its way. It can change again once it confirms.`);
    if (d) return K("One like at a time: your last one is still being sent.");
    if ((Te == null ? void 0 : Te.status) === "confirmed" && e.now() - (Te.confirmedAt ?? 0) < eI)
      return K(`Your like for ${k} has only just confirmed. Try again in a moment.`);
    let ct;
    w = !0;
    try {
      ct = e.likeState ? (await e.likeState(be, b.song)).by : b.likedBy ?? [];
    } catch {
      ct = b.likedBy;
    } finally {
      w = !1;
    }
    if (!ct) return K(`Could not check ${k} right now. Try the heart again.`);
    const S = Ve(), z = ((Te == null ? void 0 : Te.status) === "confirmed" && typeof Te.liked == "boolean" && e.now() - (Te.confirmedAt ?? Te.created) < 5 * 6e4 ? Te.liked : void 0) ?? ct.includes(S);
    if (!z && ct.some((ye) => ye !== S)) return K(Pt() ? `${k} was liked from another wallet of yours. Unlike it there.` : `${k} was liked from your main wallet${ct.includes(q) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Fo({ song: b.song, liked: !z, title: b.title, artist: b.artist });
  }
  async function Fo(b) {
    var X, Le, q;
    if (d) {
      ut("Still sending your last like. Try again in a moment.");
      return;
    }
    d = !0;
    const k = b.title ? `“${b.title}”${b.artist ? ` by ${b.artist}` : ""}` : `song #${b.song}`, K = e.wait ?? ((ke) => new Promise((be) => setTimeout(be, ke)));
    try {
      ut(`${b.liked ? "Liking" : "Unliking"} ${k}…`);
      const ke = e.now() + 12e4;
      for (; h || (Ke() ? Ct(Ve()).some((z) => Ca.includes(z.status)) : te().length); ) {
        if (e.now() > ke) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await K(5e3), await nn(!0);
      }
      if (!Ke() && xt() !== "ready" || (o == null ? void 0 : o.state) !== "unlocked" || !o.session) throw new Error("Paying stopped before the like was sent.");
      const be = Ve(), { balance: Te, nonce: ct } = await e.chain.account(be);
      if (Ke() ? c = { for: be, value: Te, at: e.now() } : (i = Te, a = e.now()), pn(Te)) throw new Error(_l);
      const S = await s.request("listening.signLike", {
        song: b.song,
        liked: b.liked,
        fee: Kt().toString(),
        nonce: ct.toString(),
        balance: Te.toString()
      }), N = {
        id: Zu(),
        address: be,
        kind: "like",
        core: 0,
        song: b.song,
        liked: b.liked,
        recipient: "",
        amount: "0",
        fee: Kt().toString(),
        nonce: ct.toString(),
        created: e.now(),
        status: "signed",
        raw: S.raw,
        txid: S.txid,
        ...b.title ? { title: String(b.title).slice(0, 120) } : {},
        ...b.artist ? { artist: String(b.artist).slice(0, 120) } : {}
      };
      e.validate(N), Mt(N);
      try {
        await e.chain.broadcast(S.raw, S.txid), Mt({ ...N, status: "pending" }), x = `${b.liked ? "♥ Liked" : "Unliked"} ${k}`, L = "";
        try {
          (X = e.likeSent) == null || X.call(e, b.song, b.liked);
        } catch {
        }
      } catch (z) {
        if (Mt({ ...N, status: Ni(z) ? "failed" : "unknown", note: z.message, ...Ni(z) ? { raw: void 0 } : {} }), L = z.message, Ni(z)) try {
          (Le = e.likeFailed) == null || Le.call(e, b.song);
        } catch {
        }
      }
      o = await Mn(s);
    } catch (ke) {
      L = "Like not sent: " + (ke instanceof Error ? ke.message : "the listening wallet is unavailable");
      try {
        (q = e.likeFailed) == null || q.call(e, b.song);
      } catch {
      }
    } finally {
      d = !1, e.changed(), Xn();
    }
  }
  return { snapshot: mr, refresh: nn, onListened: Si, heart: Ai, toggleLike: So, ...xr };
}
const Ub = ["Connect", "Passkey", "Link & fund", "Listen"], Ob = ["Passkey", "Add 1 STX", "Listen"], pf = (e) => e ? Ob : Ub;
function nI(e) {
  if (e.solo) return rI(e);
  const t = Ub.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function rI(e) {
  const t = Ob.length, n = (r, s, o = !1) => ({ at: r, blocked: o, caption: r >= t ? s : `Step ${r + 1} of ${t} · ${s}` });
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
function oI(e, t) {
  return !t || t.at >= pf(!!e.solo).length || e.heard || e.step === "wrong-wallet" || e.entries.some((n) => n.kind === "play") || e.creditedTo ? !1 : !(e.step === "locked" && e.linked);
}
const sI = (e) => typeof e == "string" && e.toLowerCase().includes("asigna");
function iI(e = typeof window > "u" ? void 0 : window) {
  if (!e) return !1;
  let t = e;
  try {
    const n = e;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (t = n.top);
  } catch {
  }
  return t.LeatherProvider || t.XverseProviders || t.HiroWalletProvider || t.StacksProvider ? !0 : [t.btc_providers, t.webbtc_providers, t.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !sI(r.id)));
}
const aI = {}, cI = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, lI = (e) => {
  const t = aI;
  return e === "mainnet" ? t.VITE_STACKS_API_MAINNET : t.VITE_STACKS_API_TESTNET;
}, uI = (e) => `/hiro/${e}`, dI = (e) => e.startsWith("/") && typeof window < "u" ? `${window.location.origin}${e}` : e, fI = (e) => {
  const t = lI(e);
  if (t)
    return [dI(t)];
  const n = cI[e];
  return typeof window < "u" ? [`${window.location.origin}${uI(e)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, hI = {}, Lg = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, pI = "xtrata.log.enabled", gI = "xtrata.log.level", yI = "xtrata.log.tags", wI = "xtrata.log.dedupe", Kc = (e) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(e);
  } catch {
    return null;
  }
}, mI = (e) => {
  if (!e)
    return !0;
  const t = e.toLowerCase();
  return t !== "false" && t !== "0" && t !== "off";
}, bI = (e) => {
  if (!e)
    return null;
  const t = e.toLowerCase();
  return t === "debug" || t === "info" || t === "warn" || t === "error" ? t : null;
}, xI = (e) => {
  if (!e)
    return !1;
  const t = e.toLowerCase();
  return t === "true" || t === "1" || t === "on";
}, SI = (e) => {
  if (!e)
    return null;
  const t = e.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return t.length === 0 ? null : t.includes("*") || t.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(t);
}, vI = () => {
  const e = hI ?? {}, t = Kc(pI) ?? e.VITE_LOG_ENABLED, n = Kc(gI) ?? e.VITE_LOG_LEVEL, r = Kc(yI) ?? e.VITE_LOG_TAGS, s = Kc(wI) ?? e.VITE_LOG_DEDUPE;
  return {
    enabled: mI(t),
    level: bI(n) ?? "warn",
    tags: SI(r),
    dedupe: xI(s)
  };
}, AI = (e, t, n) => !e.enabled || Lg[n] < Lg[e.level] ? !1 : !e.tags || e.tags.has("*") ? !0 : e.tags.has(t.toLowerCase()), EI = (e, t, n, r) => {
  const s = vI();
  if (!AI(s, t, e) || $I(s.dedupe))
    return;
  const o = `[xtrata:${t}] ${n}`, i = console[e] ?? console.log;
  r !== void 0 ? i(o, r) : i(o);
}, kI = /* @__PURE__ */ new Set();
let Cg = null;
const $I = (e, t, n, r, s) => (Cg !== e && (kI.clear(), Cg = e), !1), II = (e, t, n) => EI("debug", e, t, n), LI = {}, CI = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, TI = (e) => {
  const t = LI, n = e === "testnet" ? t.VITE_BNSV2_CONTRACT_TESTNET : t.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : CI[e];
}, BI = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, NI = (e) => {
  if (!e)
    return null;
  const t = e.trim();
  if (!t)
    return null;
  const n = t.toLowerCase();
  return BI.test(n) ? n : null;
}, MI = (e) => e.replace(/\/+$/, ""), PI = (e) => e instanceof Error ? e.message || e.name || "Error" : typeof e == "string" ? e : String(e), Tg = (e) => {
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
}, Mi = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : null, _I = (e) => {
  var c, u;
  let t;
  try {
    t = Dr(B6(e));
  } catch {
    return null;
  }
  const n = Mi(t);
  if (!n || n.success === !1)
    return null;
  const r = Mi(n.value), s = Mi(r == null ? void 0 : r.value), o = Mi(s == null ? void 0 : s.value);
  if (!o)
    return null;
  const i = Tg((c = Mi(o.name)) == null ? void 0 : c.value), a = Tg((u = Mi(o.namespace)) == null ? void 0 : u.value);
  return !i || !a ? null : NI(`${i}.${a}`);
}, UI = async (e) => {
  const [t, n] = e.contractId.split("."), r = `${MI(
    e.baseUrl
  )}/v2/contracts/call-read/${t}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: e.address,
      arguments: [yb(Qm(e.address))]
    }),
    signal: e.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const o = await s.json();
  return !(o != null && o.okay) || typeof o.result != "string" ? null : _I(o.result);
}, OI = async (e) => {
  const t = e.address.trim();
  if (!Vi(t))
    return null;
  const n = TI(e.network);
  if (!n)
    return null;
  let r = null;
  for (const s of fI(e.network))
    try {
      return await UI({
        baseUrl: s,
        contractId: n,
        address: t,
        signal: e.signal
      });
    } catch (o) {
      r = o;
    }
  return II("bns", "Primary BNS name lookup unavailable", {
    address: t,
    network: e.network,
    error: PI(r)
  }), null;
};
function HI(e, t, n = {}) {
  const r = n.retryAfterMs ?? 3e4, s = n.now ?? Date.now, o = /* @__PURE__ */ new Map(), i = (a, c) => {
    c.pending = !0, c.failedAt = void 0, Promise.resolve().then(() => e(a)).then((u) => {
      c.pending = !1, u && (c.name = u, t());
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
const Bg = Object.freeze({
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
}), Ng = Object.freeze({ 139: "melophonic" });
function Mg(e, t = "") {
  const n = String(e);
  return Object.hasOwn(Bg, n) ? Bg[n] : Object.hasOwn(Ng, n) ? Ng[n] : t;
}
const Pg = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function _g(e, t = "") {
  return Object.hasOwn(Pg, String(e)) ? Pg[String(e)] : t;
}
const Hb = 10000n, Th = 1000000n, Ul = 3000n, DI = (e, t) => `${e}#gift=${t}`, FI = 100, Ta = (e, t = Kr) => e <= sn ? 0 : Number((e - sn) / On(t)), Ug = (e) => typeof e == "string" && /^[A-Za-z0-9_-]{22}$/.test(e), Bh = "xtrata.xyz/radio/gifts", Ua = FI, jI = "Create a prefunded Xtrata radio gift batch", RI = (e) => ({
  domain: gr({ name: Et(Bh), version: Et("1"), "chain-id": vn(1) }),
  message: gr({
    purpose: Et(jI),
    creator: Et(e.creator),
    count: vn(e.count),
    amount: vn(BigInt(e.amount)),
    label: Et(e.label),
    issued: vn(e.issued),
    ...e.player ? { player: Et(e.player) } : {}
  })
}), Db = (e, t, n = Kr) => sn + BigInt(e) * On(n) + (t ? pu : 0n), zI = (e, t = Kr) => Number((Th - sn - (e ? pu : 0n)) / On(t)), Fb = (e, t) => BigInt(e) * (t + Ul);
function GI(e, t, n, r = Kr) {
  const s = n ? pu : 0n, o = t > sn + s ? t - sn - s : 0n, i = Number(o / On(r));
  return {
    plays: i,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(i) * Nl,
    fees: BigInt(i) * r,
    reserve: sn,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: Ul,
    perCopy: t + Ul,
    total: Fb(e, t)
  };
}
const KI = (e) => e >= Hb && e <= Th, VI = 90, Og = [30, 90], XI = "Extend my prefunded Xtrata radio gift batches; no spending permission", YI = (e) => ({
  domain: gr({ name: Et(Bh), version: Et("1"), "chain-id": vn(1) }),
  message: gr({ purpose: Et(XI), creator: Et(e.creator), batch: Et(e.batch), days: vn(e.days), issued: vn(e.issued) })
}), Hg = 40, qI = "Create an Xtrata radio gift player", gf = (e) => typeof e == "string" && /^[0-9a-f]{16}$/.test(e), WI = /^[^\u0000-\u001f\u007f<>]+$/u;
function Dg(e, t, n) {
  return typeof e != "string" ? !1 : e.length ? e.length <= t && e === e.trim() && WI.test(e) : !n;
}
function jb(e) {
  if (!e || typeof e != "object") throw new Error("A player needs a definition.");
  if (!Dg(e.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!Dg(e.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(e.tracks) || e.tracks.length < 1 || e.tracks.length > Hg) throw new Error(`A player holds 1 to ${Hg} songs.`);
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
const Rb = (e) => {
  const t = [...new Set(e.explicit ?? [])].sort((n, r) => n - r);
  return Mf(Uf(new TextEncoder().encode(JSON.stringify({ title: e.title, subtitle: e.subtitle ?? "", tracks: e.tracks, cover: e.cover ?? null, ...t.length ? { explicit: t } : {} }))));
}, ZI = (e) => ({
  domain: gr({ name: Et(Bh), version: Et("1"), "chain-id": vn(1) }),
  message: gr({
    purpose: Et(qI),
    admin: Et(e.admin),
    player: Et(e.hash),
    issued: vn(e.issued)
  })
}), Rr = (e) => e.tracks.filter((t) => !t.hidden), JI = (e) => e.tracks.find((t) => t.hidden) ?? null, Ju = [300, 500, 1e3], Ga = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], Vc = (e) => typeof e == "string" && Ga.some((t) => t.id === e), Ds = (e) => Ga.find((t) => t.id === e), QI = (e) => Ga.find((t) => e >= t.min) ?? Ga[Ga.length - 1];
function eL(e, t = Kr) {
  return QI(e <= sn ? 0 : Number((e - sn) / On(t)));
}
const zb = [
  { tier: "diamond", plays: 1e3, count: 5 },
  { tier: "gold", plays: 500, count: 10 },
  { tier: "silver", plays: 250, count: 20 },
  { tier: "bronze", plays: 100, count: 100 },
  { tier: "classic", plays: 50, count: 865 }
], tL = "1000 Players";
function Nh(e = Ua) {
  const t = [];
  for (const n of zb) {
    const r = Db(n.plays, !1);
    for (let s = n.count; s > 0; s -= e) {
      const o = Math.min(s, e), i = t.length + 1;
      t.push({ n: i, tier: n.tier, plays: n.plays, count: o, label: `${tL} ${String(i).padStart(2, "0")}`, amount: r, deposit: Fb(o, r) });
    }
  }
  return t;
}
const Mh = (e = Nh()) => ({
  batches: e.length,
  players: e.reduce((t, n) => t + n.count, 0),
  deposit: e.reduce((t, n) => t + n.deposit, 0n),
  tiers: zb.map((t) => ({ id: t.tier, plays: t.plays, count: t.count }))
}), nL = 23 * 36e5, Fg = (e) => ["todo", "unpaid", "confirming", "touched", "live"].indexOf(e);
function rL(e, t) {
  const n = e.view;
  return (n == null ? void 0 : n.status) === "live" ? n.copies.waiting === e.count ? "live" : "touched" : e.txid ? "confirming" : t - e.at < nL ? "unpaid" : "todo";
}
function oL(e, t, n) {
  var a;
  const r = t.filter((c) => c.label === e.label && c.player === null && c.count === e.count && c.amount === e.amount.toString() && c.codes.length === e.count).map((c) => ({ b: c, state: rL(c, n) })).filter((c) => c.state !== "todo").sort((c, u) => Fg(u.state) - Fg(c.state) || u.b.at - c.b.at), s = r[0];
  if (!s) return { step: e, state: "todo", extras: 0, detail: "not made yet" };
  const o = (a = s.b.view) == null ? void 0 : a.copies, i = s.state === "live" ? `live · all ${e.count} waiting to be claimed` : s.state === "touched" ? `live, but only ${(o == null ? void 0 : o.waiting) ?? 0} of ${e.count} still waiting (${(o == null ? void 0 : o.claimed) ?? 0} claimed)` : s.state === "confirming" ? "paid · waiting for the payment to confirm" : "made · links saved · not paid yet";
  return { step: e, state: s.state, batch: s.b, extras: r.length - 1, detail: s.b.error ? `${i} (${s.b.error})` : i };
}
function jg(e, t, n = Nh()) {
  var u;
  const r = n.map((h) => oL(h, e, t)), s = [];
  for (const h of r)
    h.extras && s.push(`Batch ${h.step.n} was made more than once. The extra ${h.extras === 1 ? "one is" : "ones are"} not part of the drop: leave ${h.extras === 1 ? "it" : "them"} unpaid, or if paid the money comes back when the copies run out.`), h.state === "touched" && s.push(`Batch ${h.step.n} has copies that are no longer waiting, so the wall would come up short.`);
  const o = r.every((h) => h.state === "live"), i = o ? r.flatMap((h) => h.batch.codes) : [], a = Mh(n).players;
  o && new Set(i).size !== a && s.push(`The links do not add up: ${new Set(i).size} different links for ${a} players.`);
  const c = o && new Set(i).size === a;
  return { steps: r, next: ((u = r.find((h) => h.state === "todo")) == null ? void 0 : u.step) ?? null, done: r.filter((h) => h.state === "live").length, ready: c, codes: c ? i : [], problems: s };
}
function sL(e, t = Nh()) {
  const n = e;
  if (!n || typeof n.total != "number") return { ok: !1, text: "The wall could not be read just now." };
  const r = Mh(t);
  if (n.total === 0) return { ok: !1, text: "The wall is empty: nothing is loaded." };
  const s = n.total - (n.free ?? 0) - (n.held ?? 0) - (n.claimed ?? 0), o = r.tiers.map((u) => {
    var d;
    const h = (d = n.tiers) == null ? void 0 : d.find((w) => w.plays === u.plays);
    return { ...u, got: (h == null ? void 0 : h.total) ?? 0 };
  }), i = o.map((u) => `${u.got} ${Ds(u.id).name}`).join(", "), a = (n.tiers ?? []).filter((u) => !r.tiers.some((h) => h.plays === u.plays)), c = n.total === r.players && s === 0 && !!n.tiers && o.every((u) => u.got === u.count) && a.length === 0;
  return c ? { ok: c, text: `The wall holds ${n.total.toLocaleString("en-GB")} players: ${i}. ${n.claimed ?? 0} claimed so far${n.state === "paused" ? " · PAUSED" : ""}.` } : { ok: c, text: `The wall is not the 1,000 yet: ${n.total.toLocaleString("en-GB")} spots${n.tiers ? ` (${i}${a.length ? `, and ${a.reduce((u, h) => u + h.total, 0)} of another size` : ""})` : ""}${s ? `, ${s} no longer available` : ""}.` };
}
const Rg = 1800, Qu = /* @__PURE__ */ new Map();
async function iL(e) {
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
function aL(e, t, n, r, s) {
  const o = document.createElement("button");
  return o.type = "button", o.className = r, o.dataset.feedback = e, (() => {
    const a = Qu.get(e), c = !!a && a.until > Date.now();
    o.textContent = c ? a.label : t, o.classList.toggle("is-done", c && a.ok), o.classList.toggle("is-failed", c && !a.ok);
  })(), o.onclick = async () => {
    const a = await n();
    if (a) {
      Qu.set(e, { ...a, until: Date.now() + Rg });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === e && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Qu.delete(e), s();
      }, Rg + 50);
    }
  }, o;
}
const ur = (e, t, n, r, s) => aL(e, t, async () => await iL(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Ts = "xtrata.radio.gift.incoming.v1", zg = (e) => "xtrata.radio.gift.mine.v1:" + e, Gg = (e) => "xtrata.radio.gift.batches.v1:" + e, fe = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, rn = (e, t, n = "") => {
  const r = fe("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Ba = (e, t) => {
  const n = document.createElement("option");
  return n.textContent = e, n.value = t, n;
}, qn = (e) => Ur(e).replace(/\.?0+$/, "");
function cL(e) {
  let t = null;
  const n = (E) => [5e3, 1e4, 2e4, 3e4][E] ?? 6e4, r = (() => {
    try {
      const E = new URL(location.href), H = new URLSearchParams(E.hash.slice(1)).get("gift") ?? E.searchParams.get("gift");
      return H !== null && (E.searchParams.delete("gift"), history.replaceState(null, "", E.pathname + (E.search || ""))), Ug(H) ? H : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const E = JSON.parse(e.store.get(Ts) || "null");
      return Ug(E == null ? void 0 : E.code) ? E.code : null;
    } catch {
      return null;
    }
  })(), o = r ?? s;
  if (o) {
    t = { code: o }, e.store.set(Ts, JSON.stringify({ code: o, at: e.now() }));
    let E = 0;
    const H = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: o }), signal: AbortSignal.timeout(15e3) }).then(async (V) => {
      const D = await V.json().catch(() => ({}));
      if (V.status === 404) {
        e.store.set(Ts, null), t = { ...t, error: (D == null ? void 0 : D.error) || "That gift link is not valid." }, e.changed();
        return;
      }
      if (!V.ok) throw new Error("busy");
      const Q = D;
      t = { ...t, view: Q, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(Q.status) && e.store.set(Ts, null), e.changed();
    }).catch(() => {
      !t || t.view || (t = { ...t, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, e.changed(), setTimeout(() => void H(), n(E++)));
    });
    H();
  }
  const i = () => !!(t != null && t.view) && t.view.status === "live" && !t.done, a = () => {
    const E = t == null ? void 0 : t.view;
    return !(E != null && E.player) || !i() ? null : { player: E.player, from: d(E), plays: Ta(BigInt(E.amount)) };
  }, c = () => {
    const E = t == null ? void 0 : t.view;
    return !E || E.player || !i() ? null : { plays: Ta(BigInt(E.amount)), from: E.from ? e.who(E.from) : null };
  }, u = () => {
    const E = t == null ? void 0 : t.code;
    if (!E) return [];
    const H = `${location.origin}${location.pathname}#gift=${E}`;
    return [ur("gift-pass-on", "Copy the link to pass on", () => H, "primary", e.changed)];
  }, h = () => {
    t = null, e.store.set(Ts, null), e.changed();
  }, d = (E) => E.from ? e.who(E.from) : E.label ? `Xtrata Radio · ${E.label}` : "Xtrata Radio";
  let w = {};
  const y = (E) => {
    if (w.box) return w.box;
    const H = fe("div", "", "ppp-gift-check");
    w.box = H;
    const V = () => {
      const D = window.turnstile;
      !D || w.rendered || (w.rendered = !0, D.render(H, { sitekey: E, callback: (Q) => {
        w.token = Q, e.changed();
      }, "expired-callback": () => {
        w.token = void 0;
      } }));
    };
    if (window.turnstile) V();
    else {
      const D = document.createElement("script");
      D.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", D.async = !0, D.onload = V, document.head.append(D);
    }
    return H;
  }, v = (E) => {
    queueMicrotask(() => void E());
  };
  let x;
  async function L(E) {
    var D, Q, ne, Ce, Se, Pe, $t, Ze, ht;
    if (!t || t.claiming || !E.listening) return;
    const H = !!((D = t.view) != null && D.player);
    if (H && !E.root) return;
    t.claiming = !0, t.error = void 0, (Q = e.claiming) == null || Q.call(e, !0), e.changed();
    const V = async (at) => {
      const I = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: t.code, turnstile: w.token, ...at })
      });
      return { res: I, r: await I.json().catch(() => ({})) };
    };
    try {
      let at = 0, I = E.listening, ve;
      if (H) {
        const xt = Number((ne = await e.json("/radio/gift/slots?root=" + encodeURIComponent(E.root))) == null ? void 0 : ne.next);
        if (!Number.isSafeInteger(xt) || xt < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        at = xt;
        for (let mr = 0; ; mr++) {
          const Xr = await e.album.bind(at);
          if (I = Xr.address, ve = await V({ wallet: I, binding: Xr }), ve.res.status === 409 && /just taken/.test(((Ce = ve.r) == null ? void 0 : Ce.error) || "") && mr < 5) {
            at += 1;
            continue;
          }
          break;
        }
      } else ve = await V({ wallet: I });
      const { res: pt, r: un } = ve;
      if (pt.status === 503 && /sending another gift/.test((un == null ? void 0 : un.error) || "")) {
        t.waiting = !0, (Se = e.claiming) == null || Se.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.waiting = !1, e.changed());
        }, 12e3);
        return;
      }
      if (!pt.ok) {
        const xt = String((un == null ? void 0 : un.error) || "");
        if (pt.status === 404 || pt.status === 410 || pt.status === 409 && /already had a gift|brand-new|already have this album/.test(xt))
          throw e.store.set(Ts, null), new Error(xt || "This gift cannot be opened.");
        if (pt.status === 429 || pt.status === 403 || pt.status === 400 && !/wallet number/i.test(xt)) throw new Error(xt || `Could not open the gift (${pt.status}).`);
        const Xr = /topping up/.test(xt) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(xt) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(xt) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Xr), { retry: !0, slow: /topping up|not paid for yet/.test(xt) });
      }
      t.done = !0, e.store.set(Ts, null), H ? await e.album.arrived(at, I, un.txid, BigInt(un.amount)) : e.giftSent(un.txid, BigInt(un.amount));
    } catch (at) {
      const I = at, ve = I.name === "TypeError" || I.name === "AbortError" || I.name === "TimeoutError" || /wallet number/i.test(I.message);
      if (I.retry || ve) {
        const pt = t.tries ?? 0;
        t.tries = pt + 1, t.retry = { text: I.retry ? I.message : "Still sending your gift… the network is slow, trying again." }, (Pe = e.claiming) == null || Pe.call(e, !0), clearTimeout(x), x = setTimeout(() => {
          t && (t.retry = void 0, e.changed());
        }, I.slow ? 6e4 : n(pt));
      } else
        t.error = I.message, ($t = e.claiming) == null || $t.call(e, !1);
      w.token = void 0;
      try {
        (ht = (Ze = window.turnstile) == null ? void 0 : Ze.reset) == null || ht.call(Ze, w.box);
      } catch {
      }
    } finally {
      t.claiming = !1, e.changed();
    }
  }
  let U = null;
  function _(E) {
    if (!E.listening || !E.depositPending || E.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== E.listening || e.now() - U.at > 3e4) {
      const V = E.listening;
      U = { ...(U == null ? void 0 : U.wallet) === V ? U : {}, wallet: V, at: e.now() }, e.json("/radio/gift/for?wallet=" + encodeURIComponent(V)).then((D) => {
        var Q, ne;
        (U == null ? void 0 : U.wallet) === V && (U.state = (Q = D == null ? void 0 : D.gift) == null ? void 0 : Q.state, U.problem = ((ne = D == null ? void 0 : D.gift) == null ? void 0 : ne.problem) ?? null, e.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const H = fe("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return H.title = `Network reply: ${U.problem}`, [H];
  }
  function A(E, H, V = !1) {
    var Pe, $t;
    const D = H.player, Q = BigInt(H.amount), ne = V ? [] : [fe("p", `🎁 ${d(H)} sent you “${D.title}”${D.subtitle ? ` by ${D.subtitle}` : ""}: ${Rr(D).length} ${Rr(D).length === 1 ? "song" : "songs"} and ${Ta(Q).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!E.root && ["fund", "ready", "over", "link"].includes(E.step))) {
      if (V) return ne;
      if (ne.push(fe("p", E.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : E.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), E.step === "intro") {
        const Ze = document.createElement("details");
        Ze.className = "ppp-how";
        const ht = document.createElement("summary");
        ht.textContent = "How does this work?", Ze.append(ht, fe("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), ne.push(Ze);
      }
      return ne;
    }
    if (E.walletCannotAlbums)
      return ne.push(fe("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), ne;
    const Se = ($t = (Pe = E.gate) == null ? void 0 : Pe.gifts) == null ? void 0 : $t.turnstileSiteKey;
    return Se && !w.token ? ne.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(Se)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), ne.push(...T(E, "Sending your album…")), ne;
  }
  function T(E, H) {
    const V = [];
    return t.claiming || t.waiting ? V.push(fe("p", t.waiting ? "Another gift is on its way out first. Yours is next…" : H, "ppp-cyan")) : t.retry && V.push(fe("p", t.retry.text, "ppp-warn"), rn("Try now", () => {
      clearTimeout(x), t.retry = void 0, L(E);
    }, "quiet")), t.error && /already have this album/i.test(t.error) ? V.push(fe("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")) : t.error && V.push(fe("p", t.error, "ppp-bad"), rn("Try again", () => {
      t.error = void 0, L(E);
    })), V;
  }
  const B = (E) => {
    var H;
    return !!t && !t.done && !t.error && i() && !!E.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(t.claiming || t.waiting || t.retry) || !E.linked && !E.creditedTo && (E.createdHere || E.brandNew || !!((H = t.view) != null && H.player)) && (E.balance ?? 0n) === 0n && !E.entries.length);
  };
  function Y(E, H = {}) {
    var I, ve, pt, un;
    const V = _(E);
    if (!t || ["off", "elsewhere"].includes(E.step)) return V;
    const D = t.view;
    if (t.error && !D) return [fe("p", `🎁 ${t.error}`, "ppp-warn")];
    if (!D) return [fe("p", t.retry ? `🎁 ${t.retry.text}` : "🎁 Checking your gift…", t.retry ? "ppp-warn" : "ppp-mute")];
    if (t.done) return V;
    if (D.status === "claimed" || D.status === "claiming") return [fe("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(D.status)) return [fe("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (D.status === "pending-deposit") return [fe("p", `🎁 ${d(D)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (D.player) return [...A(E, D, !!H.bare), ...V];
    const Q = !!E.listening && (!(E.createdHere || E.brandNew) || !!E.linked || !!E.creditedTo || (E.balance ?? 0n) > 0n || E.entries.length > 0), ne = Q ? ((I = e.claimNew) == null ? void 0 : I.call(e, E)) ?? null : null, Ce = ne ? ((ve = e.replaceOld) == null ? void 0 : ve.call(e, E)) ?? null : null;
    if (ne && Ce)
      return [
        fe("p", "🎁 A free player is waiting, and this device already has a player you made before. Replace the old one to end up with a single player that has 24 backup words: its balance is sent back first, then it is removed from this device. Or keep both as two separate players.", "ppp-mute"),
        rn("Replace my old player", Ce, "primary"),
        rn("Keep both players", ne, "quiet"),
        rn("Not now", h, "quiet")
      ];
    if (ne)
      return [
        fe("p", "🎁 This device already has a player you made before. You can claim this free one as a new, separate player with its own passkey. Your existing player, and anything in it, stays exactly as it is; you can switch between them with “Use a different listening wallet”.", "ppp-mute"),
        rn("Claim it as a new player", ne, "primary"),
        rn("Not now", h, "quiet")
      ];
    if (Q)
      return [fe("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")];
    const Se = BigInt(D.amount), Pe = Ta(Se).toLocaleString(), $t = fe(
      "p",
      `🎁 ${d(D)} sent you ${qn(Se)} STX of on-chain music: about ${Pe} paid plays.`,
      "ppp-gift"
    ), Ze = H.bare ? [] : [$t], ht = !!E.listening && (E.createdHere || E.brandNew) && !E.linked && !E.creditedTo && E.step === "fund" && (E.balance ?? 1n) === 0n && !E.depositPending && !E.entries.length, at = (un = (pt = E.gate) == null ? void 0 : pt.gifts) == null ? void 0 : un.turnstileSiteKey;
    return ht ? (at && !w.token ? Ze.push(fe("p", "One quick check and it is yours:", "ppp-mute"), y(at)) : !t.claiming && !t.error && !t.waiting && !t.retry && v(() => L(E)), Ze.push(...T(E, "Sending your gift…"))) : E.step === "intro" ? H.bare || Ze.push(fe("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : E.listening && E.linked ? Ze.push(fe("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")) : E.listening && (E.balance ?? 0n) > 0n && Ze.push(fe("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), rn("Forget this gift link here", h, "quiet")), Ze;
  }
  async function ee(E, H, V) {
    var D;
    try {
      const Q = await e.json("/radio/gift/for?wallet=" + encodeURIComponent(E));
      if ((D = Q == null ? void 0 : Q.gift) != null && D.returnTo) return { ok: !0, funder: Q.gift.returnTo, txId: Q.gift.txid ?? void 0, amount: Q.gift.amount, distinct: 1 };
    } catch {
      if (V) return { ok: !1 };
    }
    return H();
  }
  const oe = fe("div", "", "ppp-gift-fold");
  let W = 250000n, m = "", C = "";
  const P = (E) => {
    try {
      const H = JSON.parse(e.store.get(zg(E)) || "[]");
      return Array.isArray(H) ? H : [];
    } catch {
      return [];
    }
  }, M = (E, H) => e.store.set(zg(E), JSON.stringify(H.slice(0, 50)));
  async function Z(E) {
    const H = P(E);
    for (const V of H)
      if (!(V.view && ["claimed", "refunded", "expired"].includes(V.view.status)))
        try {
          V.view = !V.view || V.view.status === "pending-deposit" ? await e.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: V.id, ...V.txid ? { txid: V.txid } : {} }) }) : await e.json("/radio/gift?id=" + V.id), V.error = void 0;
        } catch (D) {
          V.error = D.message;
        }
    M(E, H), e.changed();
  }
  async function F(E) {
    if (m) return;
    m = "Starting your gift…", C = "", e.changed();
    let H = null;
    try {
      H = await e.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: E, amount: W.toString() }) });
      const V = P(E);
      V.unshift({ id: H.id, code: H.code, amount: W.toString(), at: e.now() }), M(E, V), m = "Approve the gift in your wallet…", e.changed();
      const D = await e.pay(E, H.depositTo, BigInt(H.deposit), H.memo), Q = P(E), ne = Q.find((Ce) => Ce.id === H.id);
      ne && (ne.txid = D, ne.view = { status: "pending-deposit", amount: W.toString(), source: "friend", from: E, label: "", expires: 0 }), M(E, Q), C = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", Z(E);
    } catch (V) {
      C = V.message || "Not sent.";
    } finally {
      m = "", e.changed();
    }
  }
  const ge = (E) => "xtrata.radio.gift.players.v1:" + E, ce = (E) => {
    try {
      const H = JSON.parse(e.store.get(ge(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id)) : [];
    } catch {
      return [];
    }
  };
  async function Ge(E, H) {
    var V;
    if (!m) {
      m = "Checking the player…", C = "", e.changed();
      try {
        const D = H.tracks.split(/[\s,]+/).filter(Boolean).map((Ze) => Number(Ze.replace(/^#/, ""))), Q = (H.explicit ?? "").split(/[\s,]+/).map((Ze) => Ze.replace(/^#/, "")).filter(Boolean).map(Number), ne = jb({ title: H.title.trim(), subtitle: H.subtitle.trim(), tracks: D, cover: (V = H.cover) != null && V.trim() ? Number(H.cover.trim().replace(/^#/, "")) : null, ...Q.length ? { explicit: Q } : {} });
        m = "Sign in your wallet…", e.changed();
        const Ce = { admin: E, hash: Rb(ne), issued: e.now() }, Se = await e.sign(E, ZI(Ce));
        m = "Making the player…", e.changed();
        const Pe = await e.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: ne, request: Ce, signature: Se }) }), $t = ce(E).filter((Ze) => Ze.id !== Pe.id);
        $t.unshift({ id: Pe.id, title: Pe.title, tracks: Pe.tracks }), e.store.set(ge(E), JSON.stringify($t.slice(0, 30))), C = `${Pe.existing ? "That player already exists" : "Player made"} ✓ “${Pe.title}” · ${Pe.tracks} songs. Pick it below for a batch.`;
      } catch (D) {
        C = D.message || "Not made.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const $ = (E, H) => DI(E || location.origin + "/radio.html", H), j = (E) => {
    try {
      const H = JSON.parse(e.store.get(Gg(E)) || "[]");
      return Array.isArray(H) ? H.filter((V) => V && /^[0-9a-f]{16}$/.test(V.id) && Array.isArray(V.codes)) : [];
    } catch {
      return [];
    }
  }, ue = (E, H) => e.store.set(Gg(E), JSON.stringify([...H.filter((V) => V.codes.length), ...H.filter((V) => !V.codes.length)].slice(0, 80))), me = (E) => !!E.view && E.view.status === "live" && E.view.copies.waiting + E.view.copies.claiming + E.view.copies.refunding === 0, Ne = (E, H) => e.json(E, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(H) });
  let xe = 0;
  async function wt(E) {
    const H = j(E);
    for (const D of H)
      if (!me(D))
        try {
          D.view = !D.view || D.view.status === "pending-deposit" ? await Ne("/radio/gift/batch/confirm", { id: D.id, ...D.txid ? { txid: D.txid } : {} }) : await e.json("/radio/gift/batch?id=" + D.id), D.error = void 0;
        } catch (Q) {
          D.error = Q.message;
        }
    try {
      const D = await e.json("/radio/gift/batches?creator=" + encodeURIComponent(E));
      for (const Q of (D == null ? void 0 : D.batches) ?? []) {
        const ne = H.find((Ce) => Ce.id === Q.id);
        if (ne) {
          ne.error || (ne.view = Q);
          continue;
        }
        H.push({ id: Q.id, codes: [], count: Q.count, amount: Q.amount, label: Q.label, player: Q.player, depositTo: "", deposit: Q.deposit, memo: Q.memo, at: 0, view: Q });
      }
    } catch {
    }
    const V = /* @__PURE__ */ new Map();
    for (const D of j(E)) (!V.has(D.id) || D.codes.length > V.get(D.id).codes.length) && V.set(D.id, D);
    for (const D of H) {
      const Q = V.get(D.id);
      Q ? V.set(D.id, { ...Q, view: D.view ?? Q.view, error: D.error, txid: Q.txid ?? D.txid, codes: Q.codes.length >= D.codes.length ? Q.codes : D.codes, depositTo: Q.depositTo || D.depositTo }) : V.set(D.id, D);
    }
    ue(E, [...V.values()]), e.changed();
  }
  async function Fe(E, H) {
    const V = j(E).find((D) => D.id === H);
    if (!(!V || !V.depositTo || m)) {
      m = "Approve the payment in your wallet…", C = "", e.changed();
      try {
        const D = await e.pay(E, V.depositTo, BigInt(V.deposit), V.memo), Q = j(E), ne = Q.find((Ce) => Ce.id === H);
        ne && (ne.txid = D), ue(E, Q), C = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", m = "", wt(E);
      } catch (D) {
        C = `${/cancel/i.test(D.message) ? "Payment cancelled." : D.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        m = "", e.changed();
      }
    }
  }
  async function Be(E, H, V, D) {
    if (m) return;
    if (!H.ok) {
      C = H.reason, e.changed();
      return;
    }
    m = "Sign in your wallet…", C = "", e.changed();
    let Q = null;
    try {
      const ne = { creator: E, count: H.count, amount: H.amount.toString(), label: V, issued: e.now(), ...D ? { player: D } : {} }, Ce = await e.sign(E, RI(ne));
      m = "Making your links…", e.changed(), Q = await Ne("/radio/gift/batch", { request: ne, signature: Ce });
      const Se = j(E);
      Se.unshift({ id: Q.id, codes: Q.codes, count: H.count, amount: Q.amount, label: V, player: D ?? null, depositTo: Q.depositTo, deposit: Q.deposit, memo: Q.memo, at: e.now() }), ue(E, Se);
    } catch (ne) {
      C = ne.message || "Not made.", m = "", e.changed();
      return;
    }
    m = "", e.changed(), await Fe(E, Q.id);
  }
  async function Me(E, H, V) {
    if (!m) {
      m = "Sign in your wallet (nothing is spent)…", C = "", e.changed();
      try {
        const D = { creator: E, batch: H, days: V, issued: e.now() }, Q = await e.sign(E, YI(D));
        m = "Extending…", e.changed();
        const ne = await Ne("/radio/gift/batch/extend", { request: D, signature: Q }), Ce = j(E);
        for (const Se of (ne == null ? void 0 : ne.batches) ?? []) {
          const Pe = Ce.find(($t) => $t.id === Se.id);
          Pe && (Pe.view = Se, Pe.error = void 0);
        }
        ue(E, Ce), C = ne != null && ne.extended ? `Extended ✓ ${ne.extended === 1 ? "That batch has" : `${ne.extended} batches have`} ${V} more days.` : "There was nothing live to extend.";
      } catch (D) {
        C = /cancel/i.test(D.message || "") ? "Cancelled. Nothing changed." : D.message || "Not extended.";
      } finally {
        m = "", e.changed();
      }
    }
  }
  const Bn = (E) => Math.max(0, Math.ceil((E - e.now()) / 864e5));
  function An(E, H) {
    const V = H.filter((ne) => {
      var Ce;
      return ((Ce = ne.view) == null ? void 0 : Ce.status) === "live" && ne.view.copies.waiting > 0;
    });
    if (!V.length) return null;
    const D = Math.min(...V.map((ne) => ne.view.expires)), Q = fe("p", "", "ppp-batch-extend");
    Q.append(fe("span", `${V.length} live ${V.length === 1 ? "batch" : "batches"} · the first runs out in ${Bn(D)} days. Extend ${V.length === 1 ? "it" : "them all"}: `));
    for (const ne of Og) {
      const Ce = rn(`+${ne} days`, () => void Me(E, "all", ne), "tiny");
      Ce.disabled = !!m, Q.append(Ce);
    }
    return Q;
  }
  const ft = () => Ct(!!Ke.value, Xe.value, Kt.value);
  function Ct(E, H, V) {
    const D = H === "max" ? zI(E) : Number(H), Q = Db(D, E), ne = Number(V);
    return !Number.isInteger(ne) || ne < 1 || ne > Ua ? { ok: !1, reason: `Make 1 to ${Ua} copies at a time.`, album: E, plays: D, amount: Q, count: ne } : KI(Q) ? { ok: !0, reason: "", album: E, plays: D, amount: Q, count: ne, bill: GI(ne, Q, E) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: E, plays: D, amount: Q, count: ne };
  }
  const Mt = () => {
    var E;
    return ((E = e.batchDays) == null ? void 0 : E.call(e)) ?? VI;
  }, G = (E = ft()) => {
    if (!E.ok) return E.reason;
    const H = E.bill;
    return `Each copy: ${E.plays.toLocaleString()} paid plays (${qn(H.holders)} to song holders, ${qn(H.fees)} network fees)${E.album ? `, ${qn(H.float)} for the album’s likes` : ""}, ${qn(H.reserve)} kept so a listener can return what is left, + ${qn(H.sendFee)} to send it = ${qn(H.perCopy)} STX. ${E.count} copies = ${qn(H.total)} STX, paid now in one payment. Copies nobody claims within ${Mt()} days come back to you, and you can extend that at any time.`;
  }, O = (E, H) => H.codes.map((V) => $(E, V)), te = fe("input");
  te.type = "range", te.min = String(Hb), te.max = String(Th), te.step = "10000", te.value = String(W), te.setAttribute("aria-label", "Gift amount");
  const re = fe("p", "", "ppp-gift-amount"), le = rn("", () => {
    const E = e.main();
    E && F(E);
  }, "primary"), bt = () => {
    re.textContent = Oe(), le.textContent = `Gift ${qn(W)} STX`;
  };
  te.oninput = () => {
    W = BigInt(te.value), bt();
  };
  const Oe = () => `${qn(W)} STX · about ${Ta(W).toLocaleString()} paid plays · you pay ${qn(W + Ul)} STX with the network fee`;
  bt();
  const ze = fe("input");
  ze.maxLength = 60, ze.placeholder = "Title, e.g. Proof of Sound", ze.setAttribute("aria-label", "Player title");
  const At = fe("input");
  At.maxLength = 80, At.placeholder = "Artist (optional)", At.setAttribute("aria-label", "Player subtitle");
  const He = fe("textarea");
  He.rows = 3, He.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", He.setAttribute("aria-label", "Songs");
  const $e = fe("input");
  $e.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", $e.setAttribute("aria-label", "Explicit songs");
  const Ve = fe("input");
  Ve.inputMode = "numeric", Ve.placeholder = "Cover inscription number (optional), shown when the album loads", Ve.setAttribute("aria-label", "Cover inscription");
  const Ke = fe("select");
  Ke.setAttribute("aria-label", "Batch album");
  const Xe = fe("select");
  Xe.setAttribute("aria-label", "Plays per copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Ju])].sort((H, V) => H - V)) Xe.append(Ba(`${E.toLocaleString()} plays`, String(E)));
  Xe.append(Ba("Max (1 STX)", "max")), Xe.value = String(Ju[0]);
  const Kt = fe("input");
  Kt.type = "number", Kt.min = "1", Kt.max = String(Ua), Kt.value = "10", Kt.setAttribute("aria-label", "Copies");
  const pn = fe("input");
  pn.maxLength = 40, pn.placeholder = "Label, e.g. Opera launch", pn.setAttribute("aria-label", "Batch label");
  const dn = fe("p", "", "ppp-mute"), Vn = () => {
    dn.textContent = G();
  };
  for (const E of [Ke, Xe, Kt])
    E.oninput = Vn, E.onchange = Vn;
  Vn();
  let Pt = null, gn = 0;
  async function yr() {
    gn = e.now();
    try {
      Pt = sL(await e.json("/radio/giveaway/players"));
    } catch {
      Pt = { ok: !1, text: "The wall could not be read just now." };
    }
    e.changed();
  }
  const Vr = (E, H) => {
    var D;
    if (((D = jg(j(E), e.now()).next) == null ? void 0 : D.n) !== H.n) {
      C = "That batch is already made. Check again.", e.changed();
      return;
    }
    Be(E, Ct(!1, String(H.plays), String(H.count)), H.label);
  };
  function Dn(E) {
    var Ce;
    const H = jg(j(E), e.now()), V = Mh(), D = fe("div", "", "ppp-drop");
    D.append(
      fe("p", `The ${V.players.toLocaleString("en-GB")} players (admin) · ${H.done} of ${V.batches} batches live`, "ppp-cyan"),
      fe("p", `${V.tiers.map((Se) => `${Se.count} ${Ds(Se.id).name}`).join(", ")}. ${V.batches} batches, ${qn(V.deposit)} STX in all, paid from this wallet. One batch at a time, top to bottom: each is a signature, then a payment. The links are saved on this device the moment they are made, so make every batch in this browser.`, "ppp-mute")
    );
    const Q = fe("ol", "", "ppp-gift-list ppp-drop-steps");
    for (const Se of H.steps) {
      const Pe = fe("li"), $t = Se.state === "live" ? "✓" : Se.state === "touched" ? "!" : Se.state === "todo" ? "○" : "…";
      if (Pe.append(fe("span", `${$t} ${Se.step.n}. ${Ds(Se.step.tier).name} · ${Se.step.count} × ${Se.step.plays.toLocaleString("en-GB")} plays · ${qn(Se.step.deposit)} STX`, "t"), fe("span", Se.detail, Se.state === "live" ? "ppp-ok" : Se.state === "touched" ? "ppp-warn" : "ppp-mute")), Se.state === "todo" && ((Ce = H.next) == null ? void 0 : Ce.n) === Se.step.n) {
        const Ze = rn("Sign and pay", () => Vr(E, Se.step), "tiny");
        Ze.disabled = !!m, Pe.append(Ze);
      }
      if (Se.state === "unpaid" && Se.batch) {
        const Ze = rn("Pay now", () => void Fe(E, Se.batch.id), "tiny");
        Ze.disabled = !!m, Pe.append(Ze);
      }
      Q.append(Pe);
    }
    D.append(Q);
    for (const Se of H.problems) D.append(fe("p", Se, "ppp-warn"));
    H.ready ? D.append(
      fe("p", `All ${V.batches} batches are live: ${H.codes.length.toLocaleString("en-GB")} links, none claimed. Copy them, then in Terminal (in the xtrata-2.0 folder) run:  node scripts/load-players-wall.mjs`, "ppp-ok"),
      ur("drop-copy", `Copy the ${H.codes.length.toLocaleString("en-GB")} links`, () => H.codes.join(`
`), "tiny", e.changed)
    ) : D.append(fe("p", "The links can be copied for the wall once every batch is live.", "ppp-mute")), e.now() - gn > 6e4 && yr(), Pt && D.append(fe("p", Pt.text, Pt.ok ? "ppp-ok" : "ppp-mute"));
    const ne = rn("Check again", () => {
      xe = e.now(), wt(E), yr();
    }, "tiny");
    return ne.disabled = !!m, D.append(ne), D;
  }
  function wr(E, H, V) {
    const D = H.view, Q = D == null ? void 0 : D.copies, ne = H.error ? H.error : !D || D.status === "pending-deposit" ? H.txid ? "payment confirming…" : "waiting for your payment" : `${Q.claimed} of ${D.count} claimed${Q.refunding + Q.refunded ? ` · ${Q.refunded} refunded${Q.refunding ? `, ${Q.refunding} on their way` : ""}` : ""}`, Ce = fe("li");
    if (Ce.append(fe("span", `${H.label || "Batch"} · ${H.count} × ${qn(BigInt(H.amount))} STX`, "t"), fe("span", ne, "ppp-mute")), !H.txid && H.depositTo && (!D || D.status === "pending-deposit") && Ce.append(rn("Pay now", () => void Fe(E, H.id), "tiny")), (D == null ? void 0 : D.status) === "live" && Q.waiting > 0) {
      Ce.append(fe("span", `${Bn(D.expires)} days left`, "ppp-mute"));
      for (const Se of Og) {
        const Pe = rn(`+${Se}`, () => void Me(E, H.id, Se), "tiny");
        Pe.title = `Extend this batch by ${Se} days (a signature, no payment)`, Pe.setAttribute("aria-label", `Extend ${H.label || "this batch"} by ${Se} days`), Pe.disabled = !!m, Ce.append(Pe);
      }
    }
    if (H.codes.length && (D == null ? void 0 : D.status) === "live") {
      const Se = O(V, H);
      Ce.append(
        ur("batch-copy:" + H.id, "Copy all links", () => Se.join(`
`), "tiny", e.changed),
        ur("batch-csv:" + H.id, "Copy as CSV", () => ["copy,link", ...Se.map((Pe, $t) => `${$t + 1},${Pe}`)].join(`
`), "tiny", e.changed)
      );
    } else H.codes.length || Ce.append(fe("span", "links were made on another device", "ppp-mute"));
    return Ce;
  }
  const yn = fe("select");
  yn.setAttribute("aria-label", "Plays in each copy");
  for (const E of [.../* @__PURE__ */ new Set([50, 100, 250, ...Ju])].sort((H, V) => H - V)) yn.append(Ba(`${E.toLocaleString()} plays`, String(E)));
  yn.value = "50";
  const Dt = fe("input");
  Dt.type = "number", Dt.min = "1", Dt.max = String(Ua), Dt.value = "10", Dt.setAttribute("aria-label", "How many copies");
  const dt = fe("input");
  dt.maxLength = 40, dt.placeholder = "A note recipients see, e.g. Launch week (optional)", dt.setAttribute("aria-label", "Note for recipients");
  const Lt = fe("p", "", "ppp-mute");
  function ln(E, H, V) {
    const D = () => Ct(!0, yn.value, Dt.value), Q = () => {
      Lt.textContent = G(D());
    };
    for (const ht of [yn, Dt])
      ht.oninput = Q, ht.onchange = Q;
    Q();
    const ne = () => (dt.value.trim() || H.title).replace(/[^ -~]/g, "").slice(0, 40), Ce = rn("Sign, pay and make links", () => {
      Be(E, D(), ne(), H.id);
    }, "primary");
    Ce.disabled = !!m;
    const Se = (ht, at) => {
      const I = fe("label", ht);
      return I.append(at), I;
    }, Pe = [
      fe("p", "Each copy is a link. Whoever opens it gets this album with its own plays, paid for by you. You pay for every copy now, in one payment; copies nobody claims come back to you when their time runs out, and you can extend that.", "ppp-mute"),
      Se("Plays in each ", yn),
      Se("Copies ", Dt),
      dt,
      Lt,
      Ce
    ];
    e.now() - xe > 3e4 && (xe = e.now(), wt(E));
    const $t = j(E).filter((ht) => ht.player === H.id);
    if ($t.length) {
      const ht = fe("ul", "", "ppp-gift-list");
      for (const at of $t.slice(0, 10)) ht.append(wr(E, at, V));
      Pe.push(ht);
    }
    const Ze = An(E, j(E));
    return Ze && Pe.push(Ze), m && Pe.push(fe("p", m, "ppp-cyan")), C && Pe.push(fe("p", C, /✓/.test(C) ? "ppp-ok" : "ppp-warn")), Pe;
  }
  function Lr(E) {
    var Q, ne;
    const H = (Q = E.gate) == null ? void 0 : Q.gifts;
    if (!(H != null && H.enabled) || !H.admin || ["off", "elsewhere", "unsupported"].includes(E.step)) return null;
    const V = e.main(), D = [fe("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!V)
      D.push(fe("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (H.admin) {
      const Ce = fe("div", "", "ppp-gift-admin"), Se = (at, I) => {
        const ve = fe("label", at);
        return ve.append(I), ve;
      }, Pe = ce(V);
      Ce.append(
        fe("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        ze,
        At,
        He,
        Ve,
        $e,
        rn("Sign and make player", () => void Ge(V, { title: ze.value, subtitle: At.value, tracks: He.value, cover: Ve.value, explicit: $e.value }))
      );
      const $t = rn("Sign, pay and make links", () => {
        Be(V, ft(), pn.value.trim(), Ke.value || void 0);
      });
      $t.disabled = !!m;
      const Ze = Ke.value;
      Ke.replaceChildren(Ba("No album (starter copies)", ""), ...Pe.map((at) => Ba(`${at.title} · ${at.tracks} songs`, at.id))), Pe.some((at) => at.id === Ze) && (Ke.value = Ze), Vn(), Ce.append(
        fe("p", `Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after ${Mt()} days unless you extend`, "ppp-cyan"),
        Se("Album ", Ke),
        Se("Plays each ", Xe),
        Se("Copies ", Kt),
        pn,
        dn,
        $t
      ), e.now() - xe > 3e4 && (xe = e.now(), wt(V));
      const ht = j(V);
      if (ht.length) {
        const at = fe("ul", "", "ppp-gift-list");
        for (const ve of ht.slice(0, 20)) at.append(wr(V, ve, ((ne = E.gate) == null ? void 0 : ne.radioUrl) ?? null));
        Ce.append(at);
        const I = An(V, ht);
        I && Ce.append(I);
      }
      Ce.append(Dn(V)), D.push(Ce);
    }
    return m && D.push(fe("p", m, "ppp-cyan")), C && D.push(fe("p", C, /✓/.test(C) ? "ppp-ok" : "ppp-warn")), oe.replaceChildren(...D), oe;
  }
  return { banner: Y, funder: ee, renderFold: Lr, copies: ln, liveGift: i, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => t && !t.done && (!t.view || t.view.status === "live") ? t.code : null, inProgress: B };
}
const lL = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function uL(e) {
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
const dL = (e) => {
  var t, n, r;
  return [(t = e.player) == null ? void 0 : t.title, (n = e.player) == null ? void 0 : n.subtitle, e.label, `#${e.slot}`, ...(((r = e.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function fL(e, t) {
  const n = t.query.toLowerCase().split(/\s+/).filter(Boolean), r = e.filter((o) => (!t.pinnedOnly || t.pins.has(o.slot)) && (() => {
    const i = dL(o);
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
function hL(e, t = 100) {
  const n = Object.entries(e).sort((r, s) => s[1] - r[1]).slice(0, t);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const yf = /* @__PURE__ */ new Set(), Ph = (e) => (yf.add(e), () => {
  yf.delete(e);
}), Ol = () => {
  for (const e of [...yf])
    try {
      e();
    } catch {
    }
}, Kg = "xtrata:al-thumb:v1:", _h = "-", Na = 96, pL = 24 * 1024 * 1024, Sn = /* @__PURE__ */ new Map(), Vg = /* @__PURE__ */ new Set(), wf = [];
let ed = !1, td;
const nc = (e, t) => {
  try {
    if (t === void 0) return window.localStorage.getItem(Kg + e);
    window.localStorage.setItem(Kg + e, t);
  } catch {
  }
  return null;
};
function Uh(e) {
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
          r.width = r.height = Na, s.fillStyle = "#143a40", s.fillRect(0, 0, Na, Na), s.drawImage(o, (o.naturalWidth - a) / 2, (o.naturalHeight - a) / 2, a, a, 0, 0, Na, Na), t(r.toDataURL("image/jpeg", 0.82));
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
async function gL(e) {
  var c, u, h, d, w;
  const t = await fetch("/inscription/" + e, { signal: AbortSignal.timeout(6e4) }), n = (t.headers.get("content-type") || "").toLowerCase();
  if (!t.ok)
    return await ((c = t.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = t.body) == null ? void 0 : u.cancel()), "/inscription/" + e;
  if (!n.includes("text/html"))
    return await ((h = t.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const o = (y) => {
    let v = 0;
    for (; ; ) {
      const x = r.slice(v).search(/<img\b/i);
      if (x < 0)
        return r = y ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const L = v + x, U = r.indexOf(">", L);
      if (U < 0)
        return r = r.slice(L), null;
      const _ = r.slice(L, U + 1), A = _.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (A) return A[1].replace(/&amp;/g, "&");
      const T = _.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (T) return "/inscription/" + T[1];
      v = U + 1;
    }
  }, i = (w = (d = t.body) == null ? void 0 : d.getReader) == null ? void 0 : w.call(d);
  if (!i)
    return r = await t.text(), o(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: y, value: v } = await i.read();
    if (y) break;
    s += v.byteLength, r += a.decode(v, { stream: !0 });
    const x = o(!1);
    if (x)
      return await i.cancel(), x;
    if (s > pL)
      return await i.cancel(), null;
  }
  return r += a.decode(), o(!0) ?? "";
}
async function yL() {
  if (!ed) {
    ed = !0;
    try {
      for (; wf.length; ) {
        const e = wf.shift();
        if (!Sn.has(e))
          try {
            const t = await gL(e);
            if (t === null) continue;
            if (!t) {
              Sn.set(e, ""), nc(e, _h), Ol();
              continue;
            }
            const n = await Uh(t);
            Sn.set(e, n), n.startsWith("data:image/jpeg") && nc(e, n), Ol();
          } catch {
          }
      }
    } finally {
      ed = !1;
    }
  }
}
function Oh(e, t) {
  if (t && !Sn.get(e) ? (Sn.set(e, t), Uh(t).then((r) => {
    r !== t && (Sn.set(e, r), r.startsWith("data:image/jpeg") && nc(e, r), Ol());
  })) : t === "" && !Sn.has(e) && Sn.set(e, ""), Sn.has(e)) return Sn.get(e);
  const n = nc(e);
  if (n != null) {
    const r = n === _h ? "" : n;
    return Sn.set(e, r), r;
  }
  return Vg.has(e) || (Vg.add(e), wf.push(e), td || (td = setTimeout(() => {
    td = void 0, yL();
  }, 1200))), "";
}
function Xg(e) {
  if (Sn.has(e)) return Sn.get(e);
  const t = nc(e);
  if (t == null) return null;
  const n = t === _h ? "" : t;
  return Sn.set(e, n), n;
}
const nd = /* @__PURE__ */ new Map(), rd = /* @__PURE__ */ new Set();
function il(e) {
  return !e || !Number.isSafeInteger(e) || e < 0 ? "" : nd.has(e) ? nd.get(e) : (rd.has(e) || (rd.add(e), fetch("/inscription/" + e, { signal: AbortSignal.timeout(2e4) }).then(async (t) => {
    var r, s, o, i;
    const n = (t.headers.get("content-type") || "").toLowerCase();
    if (!t.ok)
      throw await ((r = t.body) == null ? void 0 : r.cancel()), new Error("no cover");
    return n.startsWith("image/") ? (await ((s = t.body) == null ? void 0 : s.cancel()), "/inscription/" + e) : n.includes("text/html") ? (((o = (await t.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : o[1]) ?? "").replace(/&amp;/g, "&") : (await ((i = t.body) == null ? void 0 : i.cancel()), "");
  }).then((t) => {
    nd.set(e, t), Ol();
  }).catch(() => {
    rd.delete(e);
  })), "");
}
const Pi = 12, wL = 5e3, _n = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, _i = (e, t, n = "") => {
  const r = _n("button", e, n);
  return r.type = "button", r.onclick = t, r;
};
function mL(e) {
  let t, n = [], r = 0, s = !1, o = !1, i = -1 / 0, a = "", c = "recent", u = !1, h = Pi;
  const d = _n("div", "", "ppp-shelf-box");
  Ph(() => e.changed());
  const w = (P) => "xtrata.radio.shelf.pins.v1:" + P, y = (P) => "xtrata.radio.shelf.recent.v1:" + P, v = (P, M) => {
    try {
      return JSON.parse(e.store.get(P) || "null") ?? M;
    } catch {
      return M;
    }
  }, x = (P) => new Set(v(w(P), []).filter((M) => Number.isSafeInteger(M))), L = (P) => {
    const M = v(y(P), {}), Z = {};
    for (const [F, ge] of Object.entries(M)) Number.isSafeInteger(Number(F)) && typeof ge == "number" && (Z[Number(F)] = ge);
    return Z;
  };
  async function U(P) {
    if (!s) {
      s = !0, o = !1;
      try {
        const M = [];
        let Z = 0, F = 0;
        for (let ge = 0; ge < wL / 100 + 1; ge++) {
          const ce = await e.json(`/radio/gift/shelf?root=${encodeURIComponent(P)}&after=${Z}&limit=100`);
          if (M.push(...uL(ce == null ? void 0 : ce.shelf)), F = Number(ce == null ? void 0 : ce.total) || M.length, !(ce != null && ce.next) || !Number.isSafeInteger(ce.next)) break;
          Z = ce.next;
        }
        P === t && (n = M, r = F, i = e.now());
      } catch {
        o = !0;
      } finally {
        s = !1, e.changed();
      }
    }
  }
  const _ = () => {
    i = -1 / 0;
  }, A = _n("input");
  A.type = "search", A.placeholder = "Search title, artist or #", A.setAttribute("aria-label", "Search your albums"), A.oninput = () => {
    a = A.value, h = Pi, e.changed();
  };
  const T = _n("select");
  T.setAttribute("aria-label", "Sort albums");
  for (const P of lL) {
    const M = document.createElement("option");
    M.value = P.value, M.textContent = P.label, T.append(M);
  }
  T.onchange = () => {
    c = T.value, h = Pi, e.changed();
  };
  const B = _i("", () => {
    u = !u, h = Pi, e.changed();
  }, "tiny"), Y = _n("div", "", "ppp-shelf-tools");
  Y.append(A, T, B);
  const ee = _n("div"), oe = _n("div");
  function W(P) {
    const M = P.step === "off" || P.step === "elsewhere" ? void 0 : P.root;
    if (M !== t && (t = M, n = [], r = 0, i = -1 / 0, h = Pi), !M || P.walletCannotAlbums) return null;
    if (!s && e.now() - i > 5 * 6e4 && U(M), !n.length)
      return o ? (oe.replaceChildren(_n("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), _i("Try again", () => {
        i = -1 / 0, e.changed();
      }, "quiet")), d.replaceChildren(oe), d) : null;
    const Z = x(M), F = L(M), ge = fL(n, { query: a, sort: c, pinnedOnly: u, pins: Z, recents: F });
    A.value !== a && (A.value = a), T.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const ce = [];
    if (P.slot > 0 && ce.push(_i("← My player", () => e.open(0), "quiet")), !ge.length) ce.push(_n("p", "No album matches that.", "ppp-mute"));
    else {
      const Ge = _n("ul", "", "ppp-shelf-list");
      for (const $ of ge.slice(0, h)) {
        const j = _n("li", "", $.slot === P.slot ? "now" : ""), ue = Z.has($.slot), me = _i(ue ? "★" : "☆", () => {
          const ft = new Set(Z);
          ue ? ft.delete($.slot) : ft.add($.slot), e.store.set(w(M), JSON.stringify([...ft])), e.changed();
        }, "tiny");
        me.setAttribute("aria-label", ue ? `Unpin ${$.player.title}` : `Pin ${$.player.title}`);
        const Ne = [$.player.subtitle, `${Rr($.player).length} ${Rr($.player).length === 1 ? "song" : "songs"}`, $.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), xe = $.slot === P.slot, wt = _i(xe ? "Playing" : "Select", () => {
          e.store.set(y(M), JSON.stringify(hL({ ...F, [$.slot]: e.now() }))), e.open($.slot);
        }, xe ? "tiny ppp-pick" : "tiny primary ppp-pick");
        wt.disabled = xe, wt.setAttribute("aria-label", xe ? `${$.player.title}, playing now` : `Open ${$.player.title}`);
        const Fe = Rr($.player)[0], Be = $.player.cover ?? (Fe == null ? void 0 : Fe.id), Me = Be ? Oh(String(Be)) : "", Bn = _n("span", "", "ppp-shelf-art");
        if (Me) {
          const ft = document.createElement("img");
          ft.src = Me, ft.alt = "", ft.decoding = "async", Bn.append(ft);
        } else Bn.textContent = "💿";
        const An = _n("span", "", "ppp-shelf-txt");
        An.append(_n("span", $.player.title, "t"), _n("span", Ne, "ppp-mute")), j.append(me, Bn, An, wt), Ge.append(j);
      }
      ce.push(Ge), ge.length > h && ce.push(_i(`Show more (${ge.length - h} left)`, () => {
        h += Pi, e.changed();
      }, "quiet"));
    }
    return o && ce.push(_n("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ee.replaceChildren(...ce), d.firstChild !== Y && d.replaceChildren(Y, ee), d;
  }
  return { render: W, invalidate: _, count: () => r || n.length, latest: () => {
    if (!t || !n.length) return null;
    const P = L(t), M = [...n].filter((Z) => Z.player).sort((Z, F) => (P[F.slot] ?? 0) - (P[Z.slot] ?? 0) || F.slot - Z.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const Yg = "http://www.w3.org/2000/svg", bL = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Hl(e = "", t = !1) {
  const n = document.createElementNS(Yg, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), e && n.setAttribute("class", e);
  for (const [r, s] of bL) {
    const o = document.createElementNS(Yg, "path");
    o.setAttribute("fill-rule", "evenodd"), o.setAttribute("fill", t ? "currentColor" : r), o.setAttribute("d", s), n.append(o);
  }
  return n;
}
const rt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, fn = (e, t, n, r = !1) => {
  const s = rt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Gb = (e) => e.toLocaleString(), qg = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, xL = (e) => e === "gift" || e === "new" ? 1 : e === "arriving" ? 2 : e === "landed" ? 3 : -1;
function Dl(e, t) {
  const n = rt("ol", "al-steps");
  return n.setAttribute("aria-label", t >= e.length ? "All steps done" : `Step ${t + 1} of ${e.length}: ${e[t]}`), e.forEach((r, s) => {
    const o = rt("li", s < t ? "is-done" : s === t ? "is-now" : "");
    o.append(rt("i", "", s < t ? "✓" : String(s + 1)), rt("span", "", r)), n.append(o);
  }), n;
}
function SL() {
  const e = rt("div", "tier-disc tier-disc--mid");
  return e.dataset.tier = "mystery", e.setAttribute("role", "img"), e.setAttribute("aria-label", "A player waiting to be opened"), e.append(rt("span", "tier-disc__mark", "?")), e;
}
const bn = {
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
}, vL = (e) => e ? `Disc ${e} is yours` : bn.gift.title, AL = (e, t, n = !1) => n ? "What is inside? Play it to find out." : e ? `${Gb(e)} plays inside. Every play pays the artist.` : "Every play pays the artist.", EL = (e) => e ? `${Gb(e)} plays. Every one pays the artist.` : "Every play pays the artist.";
function Wg(e, t = !1) {
  const n = rt("div", "al-now" + (t ? " al-now--big" : "")), r = rt("img", "al-now__art");
  r.src = e.art, r.alt = "";
  const s = rt("div", "al-now__t");
  s.append(rt("b", "", e.title || "Playing now"), rt("span", "", e.artist));
  const o = rt("i", "al-now__eq" + (e.playing ? " is-on" : ""));
  return o.setAttribute("aria-hidden", "true"), o.append(rt("s"), rt("s"), rt("s")), n.append(r, s, o), n.setAttribute("role", "group"), n.setAttribute("aria-label", `${e.playing ? "Playing" : "Starting"}: ${e.title || "your first song"}${e.artist ? ` by ${e.artist}` : ""}`), n;
}
const kL = (e) => e ? `You got a ${e.name} player` : bn.landed.title;
function $L(e, t = !0) {
  const n = rt("div", "tier-disc" + (t ? " tier-disc--big" : ""));
  return n.dataset.tier = e.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${e.name} player`), n.append(rt("span", "tier-disc__mark", e.mark)), n;
}
function IL(e) {
  const t = document.documentElement;
  let n = !1;
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(r, s = !1) {
      var h, d;
      if (!r) {
        n && !s && (e.hidden = !0, e.replaceChildren(), delete t.dataset.view, delete t.dataset.asking), n = !1, delete t.dataset.welcome;
        return;
      }
      n = !0, t.dataset.view = "album", t.dataset.welcome = r.mode, r.asking ? t.dataset.asking = "1" : delete t.dataset.asking;
      const o = rt("header", "al-top"), i = rt("a", "al-brand");
      i.href = "/radio", i.append(Hl("al-logo"), rt("span", "", "Xtrata "), rt("b", "", "Music")), o.append(i);
      const a = rt("div", "al-body al-body--welcome"), c = rt("div", "al-welcome"), u = r.mode;
      if (u === "checking")
        c.append(rt("p", "al-welcome-wait", bn.checking));
      else {
        const w = xL(u);
        w >= 0 && c.append(Dl(u === "new" ? qg.fresh : qg.gift, w)), r.tier && (u === "landed" || u === "back" || u === "empty") ? c.append($L(r.tier)) : u === "gift" || u === "arriving" ? c.append(SL()) : u === "new" && c.append(Hl("al-hero-mark"));
        const y = r.now && (u === "gift" || u === "arriving" || u === "landed") ? r.now : null, v = u === "new" && !!r.installed;
        if (c.append(rt("h1", "", u === "landed" ? kL(r.tier) : u === "back" && r.tier ? `Your ${r.tier.name} player` : u === "gift" ? vL(r.spot) : v ? bn.installedNew.title : bn[u].title)), y && u === "arriving" ? c.append(Wg(y, !0)) : c.append(rt("p", "", u === "gift" ? AL(r.plays, r.from, r.mystery) : u === "landed" ? EL(r.plays) : v ? bn.installedNew.body : bn[u].body)), y && u !== "arriving" && c.append(Wg(y)), r.status.length) {
          const x = rt("div", "al-status");
          x.setAttribute("role", "status"), x.append(...r.status), c.append(x);
        }
        if (r.asking) c.append(rt("p", "al-hint al-hint--ask", bn.asking));
        else if (u === "back" && r.claimNew) {
          const x = bn.backClaim;
          c.append(rt("p", "al-hint", x.body)), r.canStart && r.replaceOld ? c.append(fn("al-primary", x.replace, r.replaceOld, r.busy), rt("p", "al-hint", x.replaceHint), fn("al-link", x.both, r.claimNew, r.busy), fn("al-link", x.unlock, r.unlock, r.busy)) : r.canStart && c.append(fn("al-primary", x.primary, r.claimNew, r.busy), rt("p", "al-hint", x.hint), fn("al-link", x.unlock, r.unlock, r.busy)), c.append(fn("al-link", bn.back.full, r.full));
        } else if (u === "gift") {
          const x = bn.gift;
          if (r.canStart) {
            const L = fn("al-primary" + (r.intro ? " al-primary--play" : ""), r.intro ? x.play : x.primary, r.start, r.busy);
            c.append(L, rt("p", "al-hint", x.hint));
          }
          r.canStart ? c.append(fn("al-link", x.returning, r.returning, r.busy)) : c.append(fn("al-link", x.full, r.full));
        } else if (u === "new" && r.installed) {
          const x = bn.installedNew;
          r.canStart && c.append(fn("al-primary", x.primary, r.returning, r.busy), rt("p", "al-hint", x.hint), fn("al-link", x.fresh, r.start, r.busy)), c.append(fn("al-link", bn.new.full, r.full));
        } else if (u === "new" || u === "back") {
          const x = bn[u];
          r.canStart && c.append(fn("al-primary", x.primary, u === "back" ? r.unlock : r.start, r.busy), rt("p", "al-hint", x.hint)), r.canStart && c.append(fn("al-link", x.returning, r.returning, r.busy)), c.append(fn("al-link", x.full, r.full));
        } else if (u === "landed") {
          if (c.append(fn("al-primary", (h = r.now) != null && h.playing ? bn.landed.playing : bn.landed.primary, r.full)), (d = r.albums) != null && d.length && !r.now) {
            c.append(rt("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const x of r.albums) {
              const L = fn("al-album", "", x.run);
              if (x.cover) {
                const _ = rt("img", "al-album__art");
                _.src = x.cover, _.alt = "", L.classList.add("al-album--art"), L.append(_);
              }
              const U = rt("span", "al-album__t");
              U.append(rt("b", "", x.title), rt("span", "", x.by)), L.append(U), c.append(L);
            }
          }
        } else u === "empty" && c.append(fn("al-primary", bn.empty.primary, r.restock), fn("al-link", bn.empty.full, r.full));
      }
      a.append(c), e.hidden = !1, e.replaceChildren(o, a);
    }
  };
}
const LL = 20, CL = ["Album", "Passkey", "Listen"], In = (e, t = 22, n = !1) => `<svg width="${t}" height="${t}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${e}</svg>`, Jt = {
  grid: In('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: In('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: In('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: In('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: In('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: In('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: In('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: In('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: In('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: In('<path d="M6 9l6 6 6-6"/>', 18),
  right: In('<path d="M9 6l6 6-6 6"/>', 16),
  close: In('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: In('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: In('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: In('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: In('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: In('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function se(e, t = {}, ...n) {
  const r = document.createElement(e);
  for (const [s, o] of Object.entries(t))
    o == null || o === !1 || (s === "class" ? r.className = String(o) : s === "html" ? r.innerHTML = String(o) : s.startsWith("on") && typeof o == "function" ? r[s.toLowerCase()] = o : s === "disabled" ? r.disabled = !!o : r.setAttribute(s, o === !0 ? "" : String(o)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const Pn = (e, ...t) => se("button", { type: "button", ...e }, ...t), Xc = (e) => `${Math.floor(e / 60)}:${String(Math.floor(e % 60)).padStart(2, "0")}`, Ma = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`, TL = { music: "My music", device: "This device", gifts: "Albums (admin)" }, BL = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Zg(e, t, n = {}) {
  const r = !!n.list;
  let s = null, o = "", i = !1;
  const a = document.documentElement;
  function c(m) {
    var P, M, Z;
    if (!m || !Number.isSafeInteger(m)) return "";
    const C = (Z = (M = (P = t.radio()) == null ? void 0 : P.getState) == null ? void 0 : M.call(P)) == null ? void 0 : Z.albumCover;
    return C != null && C.url && Number(C.tokenId) === m ? C.url : il(m);
  }
  Ph(() => W());
  function u(m) {
    var P;
    o = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const C = document.querySelector(".side");
    if (m && m !== "more") {
      for (const F of BL[m]) {
        const ge = C == null ? void 0 : C.querySelector(F);
        ge && (ge.open = !0);
      }
      const M = document.getElementById("sheetTitle");
      M && (M.textContent = TL[m]);
      const Z = document.getElementById("sheetExtra");
      Z && Z.replaceChildren(...m === "music" ? [d()] : []), (P = C == null ? void 0 : C.scrollTo) == null || P.call(C, { top: 0 });
    }
    W();
  }
  const h = r ? null : document.getElementById("sheetClose");
  h && (h.onclick = () => u("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && o && a.dataset.view === "album" && u("");
  });
  const d = () => Pn(
    { class: "al-row", onClick: () => {
      u(""), t.openPlayer();
    } },
    se("span", { class: "al-row-i", html: Jt.radio }),
    se("span", { class: "al-row-t" }, se("b", {}, "Xtrata Radio"), se("small", {}, "Every song on-chain · FM, liked, all")),
    se("span", { class: "al-row-go", html: Jt.right })
  );
  let w = null, y = !1;
  const v = () => {
    var C;
    const m = t.radio();
    y || !(m != null && m.subscribe) || (y = !0, m.subscribe((P) => {
      w = P, (s == null ? void 0 : s.mode) === "open" && W();
    }), w = ((C = m.getState) == null ? void 0 : C.call(m)) ?? null);
  };
  r || setInterval(() => {
    var M, Z;
    if ((s == null ? void 0 : s.mode) !== "open" || !(w != null && w.playing)) return;
    const m = (Z = (M = t.radio()) == null ? void 0 : M.getPosition) == null ? void 0 : Z.call(M), C = e.querySelector(".al-bar > i"), P = e.querySelectorAll(".al-times span");
    !m || !C || (C.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", P.length === 2 && (P[0].textContent = Xc(m.current || 0), P[1].textContent = m.duration ? Xc(m.duration) : "–:––"));
  }, 500);
  let x = "", L = null;
  function U(m, C, P = {}) {
    const M = P.song || c(m.cover), F = [M ? se("img", { src: M, alt: P.song ? "Song artwork" : `${m.title} cover` }) : se("div", { class: "al-cover-fallback" }, se("b", {}, m.title), m.subtitle ? se("span", {}, m.subtitle) : null), P.paused ? se("span", { class: "al-paused" }, se("i", { html: Jt.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], ge = "al-cover" + (C ? "" : " al-cover--small") + (P.paused ? " is-paused" : "");
    return P.flip ? (F.push(se("span", { class: "al-flip", "aria-hidden": "true", html: Jt.flip })), Pn({ class: ge + " is-flippable", "aria-label": P.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: P.flip }, ...F)) : se("div", { class: ge }, ...F);
  }
  function _(m) {
    return m.plays === null || m.plays === void 0 ? se("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? se("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : se("span", { class: "al-chip" + (m.plays <= LL ? " al-chip--low" : "") }, `${Ma(m.plays, "play", "plays")} left`);
  }
  function A(m) {
    const C = m.player, P = C.tracks.filter((Z) => !Z.hidden), M = [];
    return m.step !== void 0 && M.push(Dl(CL, m.step)), m.mode === "arrive" && m.from && M.push(se("p", { class: "al-from" }, se("span", { html: Jt.gift }), se("span", {}, se("b", {}, m.from), " sent you an album"))), M.push(U(C, !0)), M.push(se(
      "div",
      { class: "al-intro" },
      se("h1", {}, C.title),
      C.subtitle ? se("p", { class: "al-artist" }, C.subtitle) : null,
      P.length ? se("p", { class: "al-songline" }, P.map((Z) => Z.title || `#${Z.id}`).join(" · ")) : null,
      se("span", { class: "al-chip" }, [Ma(P.length, "song", "songs"), m.offered ? Ma(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && M.push(se("div", { class: "al-status", role: "status" }, ...m.status)), M.push(se("div", { class: "al-grow" })), m.asking ? M.push(se("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && M.push(Pn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, se("span", { html: Jt.playSmall }), m.primary.label)), m.hint && !m.asking && M.push(se("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && M.push(Pn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), M;
  }
  function T(m, C) {
    const { songs: P, current: M, started: Z, own: F, out: ge, waiting: ce } = C, Ge = m.player, $ = t.radio(), j = [];
    j.push(se("div", { class: "al-listhead" }, se("span", {}, se("b", {}, Ge.title), ` · ${Ma(P.length, "song", "songs")}`), _(m)));
    const ue = c(Ge.cover), me = "album:" + Ge.cover;
    ue && !Sn.has(me) && (Sn.set(me, ue), Uh(ue).then((xe) => {
      xe !== ue && (Sn.set(me, xe), W());
    }));
    const Ne = ue ? Sn.get(me) || ue : "";
    return j.push(se("ol", { class: "al-tracks" }, ...P.map((xe, wt) => {
      const Fe = String(xe.id) === M, Be = Oh(String(xe.id), Fe && Z ? F : void 0);
      return se("li", {}, Pn(
        { class: "al-track" + (Fe ? " is-on" : ""), "aria-label": `Play ${xe.title || "#" + xe.id}`, "aria-current": Fe ? "true" : void 0, disabled: ge || ce, onClick: () => {
          var Me;
          return (Me = $ == null ? void 0 : $.playToken) == null ? void 0 : Me.call($, xe.id);
        } },
        se(
          "span",
          { class: "al-th" + (Be ? "" : " is-blank") },
          Be ? se("img", { src: Be, alt: "", decoding: "async" }) : Ne ? se("img", { src: Ne, alt: "", decoding: "async" }) : null,
          Be ? null : se("span", { class: "al-n" }, String(wt + 1)),
          Fe ? se("span", { class: "al-eq", html: Jt.eq }) : null
        ),
        se("span", { class: "al-tt" }, xe.title || `#${xe.id}`, xe.explicit ? se("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), j;
  }
  function B(m) {
    var Be;
    const C = m.player, P = C.tracks.filter((Me) => !Me.hidden), M = t.radio(), Z = w == null ? void 0 : w.nowPlaying, F = Z && C.tracks.some((Me) => String(Me.id) === String(Z.tokenId)) ? String(Z.tokenId) : null, ge = F ? C.tracks.find((Me) => String(Me.id) === F) : null, ce = m.plays === 0 && !m.playsComing, Ge = !!m.playsComing && !m.plays, $ = !!(w != null && w.playing) && !!F, j = w == null ? void 0 : w.heart, ue = F ? (Be = M == null ? void 0 : M.getPosition) == null ? void 0 : Be.call(M) : null;
    F && ($ || ((ue == null ? void 0 : ue.current) ?? 0) > 0.5) && (x = C.id);
    const me = !!F && x === C.id;
    L && L !== F && (L = null);
    const Ne = me ? String((Z == null ? void 0 : Z.cover) || "") : "", xe = !!Ne && L === F, Fe = [U(C, !ce, { song: xe ? "" : Ne, paused: me && !$, flip: Ne ? () => {
      L = L === F ? null : F, W();
    } : void 0, flipped: xe })];
    if (Fe.push(se(
      "div",
      { class: "al-now" },
      se(
        "div",
        { class: "al-now-t" },
        se("div", { class: "al-song" }, ge ? ge.title || (Z == null ? void 0 : Z.title) || `#${ge.id}` : C.title),
        se("div", { class: "al-artist" }, ge ? ge.artist || (Z == null ? void 0 : Z.artist) || C.subtitle : C.subtitle || "Press play")
      ),
      F ? Pn({ class: "al-icon" + (j != null && j.liked ? " is-on" : ""), "aria-label": j != null && j.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(j != null && j.liked)), disabled: !!(j != null && j.pending) || !!(j != null && j.locked) || Ge, onClick: () => {
        var Me;
        return (Me = M == null ? void 0 : M.toggleLike) == null ? void 0 : Me.call(M);
      }, html: j != null && j.liked ? Jt.heartOn : Jt.heart }) : null
    )), ce)
      Fe.push(se(
        "div",
        { class: "al-out" },
        se("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        se("p", { class: "al-out-t" }, "You've played this album out"),
        se("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Y(m, !0)
      ));
    else {
      const Me = ue != null && ue.duration ? Math.min(100, ue.current / ue.duration * 100) : 0;
      Fe.push(se(
        "div",
        { class: "al-prog" },
        se("div", { class: "al-bar" }, se("i", { style: `width: ${Me}%` })),
        se("div", { class: "al-times" }, se("span", {}, Xc((ue == null ? void 0 : ue.current) || 0)), se("span", {}, ue != null && ue.duration ? Xc(ue.duration) : "–:––"))
      ));
    }
    return Fe.push(se(
      "div",
      { class: "al-ctl" + (ce || Ge ? " is-off" : "") },
      Pn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: ce || Ge, onClick: () => {
        var Me;
        return (Me = M == null ? void 0 : M.prev) == null ? void 0 : Me.call(M);
      }, html: Jt.prev }),
      Pn({ class: "al-play", "aria-label": $ ? "Pause" : "Play", disabled: ce || Ge, onClick: () => {
        var Me;
        return (Me = M == null ? void 0 : M.playPause) == null ? void 0 : Me.call(M);
      }, html: $ ? Jt.pause : Jt.play }),
      Pn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: ce || Ge, onClick: () => {
        var Me;
        return (Me = M == null ? void 0 : M.next) == null ? void 0 : Me.call(M);
      }, html: Jt.next })
    )), m.status.length && Fe.push(se("div", { class: "al-status", role: "status" }, ...m.status)), Fe.push(...T(m, { songs: P, current: F, started: me, own: Ne, out: ce, waiting: Ge })), Fe.push(se("div", { class: "al-grow" })), Fe.push(Pn(
      { class: "al-more", "aria-expanded": String(o === "more"), onClick: () => u(o === "more" ? "" : "more") },
      se("span", {}, "More ", se("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      se("span", { html: Jt.down })
    )), Fe;
  }
  function Y(m, C) {
    const P = se("div", { class: "al-topups" + (C ? " al-topups--primary" : "") }), M = C ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const Z of M) {
      const F = m.myPlays !== void 0 && m.myPlays >= Z && !m.playsComing && !m.busy;
      P.append(Pn({ class: "al-topup", disabled: !F, onClick: () => t.topUp(Z) }, C ? `Add ${Z.toLocaleString()} plays` : `+${Z.toLocaleString()}`));
    }
    return C && P.append(Pn({ class: "al-link", onClick: () => u("more") }, "Other amounts")), P;
  }
  function ee(m) {
    const C = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), P = se(
      "div",
      { class: "al-card" },
      se("div", { class: "al-card-h" }, se("b", {}, `Add plays to ${m.player.title}`), se("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      Y(m, !1),
      se("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : C ? `Moved from My player · ${Ma(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !C && !m.playsComing && m.myPlays !== void 0 ? Pn({ class: "al-link", onClick: () => {
        u(""), t.openPlayer();
      } }, "Open My player") : null
    ), M = (F, ge, ce, Ge) => Pn(
      { class: "al-row", onClick: Ge },
      se("span", { class: "al-row-i", html: F }),
      se("span", { class: "al-row-t" }, se("b", {}, ge), se("small", {}, ce)),
      se("span", { class: "al-row-go", html: Jt.right })
    ), Z = se(
      "div",
      { class: "al-how" + (i ? " is-open" : "") },
      M(Jt.info, "How plays work", "Every play counts for the song’s owner", () => {
        i = !i, W();
      }),
      i ? se("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return se(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      se("div", { class: "al-sheet-h" }, se("b", {}, "More"), Pn({ class: "al-icon", "aria-label": "Close", onClick: () => u(""), html: Jt.close })),
      m.mode === "open" ? P : null,
      se(
        "div",
        { class: "al-rows" },
        M(Jt.grid, "My music", "Your albums and the radio", () => u("music")),
        M(Jt.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          u(""), t.openPlayer();
        }),
        m.canMake ? M(Jt.gift, "Albums (admin)", "Make an album and fund copies", () => u("gifts")) : null,
        M(Jt.device, "This device", "Backup, history, Stacks wallet, returns", () => u("device")),
        Z
      )
    );
  }
  function oe(m) {
    var ce, Ge;
    const C = m.player, P = w == null ? void 0 : w.nowPlaying, M = P && C.tracks.some(($) => String($.id) === String(P.tokenId)) ? String(P.tokenId) : null, Z = !!(w != null && w.playing) && !!M, F = M ? (Ge = (ce = t.radio()) == null ? void 0 : ce.getPosition) == null ? void 0 : Ge.call(ce) : null;
    M && (Z || ((F == null ? void 0 : F.current) ?? 0) > 0.5) && (x = C.id);
    const ge = !!M && x === C.id;
    return T(m, {
      songs: C.tracks.filter(($) => !$.hidden),
      current: M,
      started: ge,
      own: ge ? String((P == null ? void 0 : P.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function W() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        e.hidden = !0, e.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      v(), e.hidden = !1, a.dataset.albumlist = "1", e.replaceChildren(...oe(m));
      return;
    }
    if (!m) {
      e.hidden = !0, e.replaceChildren();
      return;
    }
    v(), e.hidden = !1;
    const C = se(
      "header",
      { class: "al-top" },
      se("a", { class: "al-brand", href: "/radio" }, Hl("al-logo"), "Xtrata ", se("b", {}, "Music")),
      m.mode === "open" ? Pn({ class: "al-icon", "aria-label": "My music", onClick: () => u("music"), html: Jt.grid }) : null
    ), P = se("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? B(m) : A(m));
    e.replaceChildren(C, P, ...o === "more" ? [se("div", { class: "al-scrim", onClick: () => u("") }), ee(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, W();
        return;
      }
      const C = !!s;
      s = m, !m && (C || o) && (o = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, W();
    },
    sheet: () => o,
    setSheet: u
  };
}
const NL = "(?:https?:\\/\\/(?:radio\\.)?xtrata\\.xyz)?", ML = (e, t) => {
  if (typeof t != "string") return null;
  const n = t.match(new RegExp(`<(?:${e})\\b[^>]*\\bsrc=["']${NL}\\/inscription\\/(\\d{1,9})["']`, "i"));
  return n ? Number(n[1]) : null;
}, PL = (e) => ML("source|audio", e), _L = 48 * 1024 * 1024;
function UL(e) {
  const t = /^data:(audio\/[^;,]+)[^,]*?(;base64)?,(.*)$/s.exec(e);
  if (!t) throw new Error("unreadable audio");
  if (!t[2]) return e;
  const n = atob(t[3].replace(/\s+/g, "")), r = new Uint8Array(n.length);
  for (let s = 0; s < n.length; s++) r[s] = n.charCodeAt(s);
  return URL.createObjectURL(new Blob([r], { type: t[1] }));
}
function OL(e) {
  const t = e.fetch ?? ((...h) => fetch(...h));
  let n = null, r = null, s = "", o = null;
  const i = (h) => {
    n = h, e.changed();
  }, a = () => {
    var h;
    if (o == null || o.abort(), o = null, r)
      try {
        r.pause(), r.removeAttribute("src"), (h = r.load) == null || h.call(r);
      } catch {
      }
    s.startsWith("blob:") && URL.revokeObjectURL(s), s = "";
  };
  async function c(h, d, w = 0) {
    var A, T, B;
    const y = "/inscription/" + h, v = await t(y, { signal: d }), x = (v.headers.get("content-type") || "").toLowerCase();
    if (!v.ok)
      throw await ((A = v.body) == null ? void 0 : A.cancel()), new Error("not found");
    if (x.startsWith("audio/"))
      return await ((T = v.body) == null ? void 0 : T.cancel()), y;
    if (!x.includes("text/html"))
      throw await ((B = v.body) == null ? void 0 : B.cancel()), new Error("not a song");
    const L = await v.text();
    if (L.length > _L) throw new Error("too large");
    const U = L.match(/<(?:source|audio)\b[^>]*\bsrc=["'](data:audio\/[^"']+)["']/i);
    if (U) return UL(U[1].replace(/&amp;/g, "&"));
    const _ = w === 0 ? PL(L) : null;
    if (_) return c(Number(_), d, 1);
    throw new Error("no audio");
  }
  async function u(h) {
    var w;
    a();
    const d = o = new AbortController();
    i({ id: h, state: "loading" });
    try {
      const y = await c(h, d.signal);
      if (d.signal.aborted) {
        y.startsWith("blob:") && URL.revokeObjectURL(y);
        return;
      }
      if (s = y, r || (r = e.audio ? e.audio() : new Audio(), r.addEventListener("ended", () => {
        (n == null ? void 0 : n.state) === "playing" && (a(), i(null));
      }), r.addEventListener("error", () => {
        if ((n == null ? void 0 : n.state) === "playing") {
          const v = n.id;
          a(), i({ id: v, state: "error" });
        }
      })), (w = e.quiet) == null || w.call(e), r.src = y, await r.play(), d.signal.aborted) return;
      i({ id: h, state: "playing" });
    } catch {
      if (d.signal.aborted) return;
      a(), i({ id: h, state: "error" });
    }
  }
  return {
    state: (h) => (n == null ? void 0 : n.id) === h ? n.state : "idle",
    toggle: (h) => {
      (n == null ? void 0 : n.id) === h && n.state !== "error" ? (a(), i(null)) : u(h);
    },
    stop: () => {
      n && (a(), i(null));
    }
  };
}
const HL = ["Earned", "Claim", "Yours"], DL = ["Connect", "Link", "Name"], Bt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, mn = (e, t, n, r = !1) => {
  const s = Bt("button", e, t);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, Jg = (e, t, n, r = !1) => {
  const s = mn("al-album", "", n, r), o = Bt("span", "al-album__t");
  return o.append(Bt("b", "", e), Bt("span", "", t)), s.append(o), s;
}, FL = (e) => `No. ${String(e).padStart(4, "0")}`, jL = (e) => e.main ? e.linked ? 2 : 1 : 0;
function RL(e) {
  const t = document.documentElement;
  let n = !1, r = "", s = null;
  const o = (i) => {
    if (s && r === i.art) return s;
    r = i.art, s = Bt("div", "aw-art");
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
      const c = Bt("header", "al-top"), u = Bt("a", "al-brand");
      u.href = "/radio", u.append(Hl("al-logo"), Bt("span", "", "Xtrata "), Bt("b", "", "Music")), c.append(u);
      const h = Bt("div", "al-welcome"), d = i.screen, w = i.tier.name, y = typeof i.name == "string" && i.name ? i.name : null;
      if (h.append(d === "have" ? Dl(DL, jL(i)) : Dl(HL, d === "making" ? 2 : d === "yours" ? 3 : 1)), d === "making") {
        const _ = Bt("div", "tier-disc tier-disc--mid");
        _.dataset.tier = i.tier.id, _.append(Bt("span", "tier-disc__mark", i.tier.mark)), h.append(_);
      } else if (d !== "have" && d !== "get") {
        const _ = o(i);
        _.classList.toggle("aw-art--small", d === "name"), h.append(_);
      }
      const v = d === "ready" ? `Your ${w} record is ready` : d === "name" ? "Put your name on it?" : d === "have" ? "Use the name in your wallet" : d === "get" ? "Get a .btc name" : d === "making" ? "Making your record" : "It’s yours";
      h.append(Bt("h1", "", v));
      const x = (_, A = "") => h.append(Bt("p", A, _)), L = [];
      if (d === "ready")
        x(`You’ve paid artists for ${i.need.toLocaleString()} plays. That makes you an Xtrata Music Hero.`), L.push(mn("al-primary", `Claim my ${w} record`, () => i.go("name"), i.busy), Bt("p", "al-hint", "Free. One tap with Face ID or your fingerprint."), mn("al-link", "Later", i.later));
      else if (d === "name")
        y ? (x(`Your record will carry ${y} beside your player’s address.`), L.push(mn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy), mn("al-link", "Use my address only", () => i.claim("none"), i.busy))) : i.name === null ? (x("Right now it will carry your player’s address. A .btc name makes it yours at a glance."), L.push(
          Jg("I have a name in Leather or Xverse", "Connect that wallet and link your player to it", () => i.go("have"), i.busy),
          Jg("I want to get a name", "Where to get one, and how to put it on your player", () => i.go("get"), i.busy),
          mn("al-primary", "Claim with my address", () => i.claim("none"), i.busy)
        )) : (x("Could not check for a .btc name just now.", "ppp-warn"), L.push(mn("al-primary", "Check again", i.refresh, i.busy), mn("al-link", "Claim with my address only", () => i.claim("none"), i.busy))), L.push(Bt("p", "al-hint", "What is on the plaque cannot be changed afterwards.")), L.push(mn("al-link", "Later", i.later));
      else if (d === "have")
        i.main ? !i.linked && i.canLink ? (x(`Link this player to ${i.main}. Your plays and likes are then credited to that wallet’s name. One signature in your wallet: nothing is spent.`), L.push(mn("al-primary", "Link my player", i.link, i.busy))) : i.linked ? y ? (x(`Found it: ${y}. It goes on your plaque beside your player’s address.`), L.push(mn("al-primary", `Claim with ${y}`, () => i.claim("auto"), i.busy))) : (x(i.name === null ? `${i.main} has no primary .btc name yet. Set one in your wallet, then check again.` : "Could not check for the name just now.", i.name === null ? "" : "ppp-warn"), L.push(mn("al-primary", "Check again", i.refresh, i.busy))) : (x(`Linking is not open for ${i.main} right now. You can send a name to your player instead.`, "ppp-warn"), L.push(mn("al-primary", "Show me how", () => i.go("get"), i.busy))) : (x("Connect the Leather or Xverse wallet that holds your .btc name."), L.push(mn("al-primary", "Connect my wallet", i.connect, i.busy))), L.push(mn("al-link", "Back", () => i.go("name")));
      else if (d === "get") {
        const _ = Bt("ol", "aw-steps"), A = Bt("li");
        A.append("Get a name at BNS One. You need a Stacks wallet (Leather or Xverse) with a little STX. ");
        const T = Bt("a", "", "Open BNS One ↗");
        T.href = "https://bns.one", T.target = "_blank", T.rel = "noopener", A.append(T);
        const B = Bt("li");
        B.append("Then come back and choose “I have a name in Leather or Xverse”. Or send the name to your player’s own address:", Bt("span", "ppp-addr-full", i.player), i.copyAddress());
        const Y = Bt("li", "", "Check again, and your name shows on the preview before you claim.");
        _.append(A, B, Y), h.append(_), L.push(mn("al-primary", "I have my name: check again", () => {
          i.refresh(), i.go("name");
        }, i.busy), mn("al-link", "Back", () => i.go("name")));
      } else if (d === "making") {
        if (x("It is being written to Xtrata with your plaque on it. About a minute: keep this page open and it carries on by itself."), i.claimLink) {
          const _ = Bt("p", "al-hint"), A = Bt("a", "", "See the claim on-chain ↗");
          A.href = i.claimLink, A.target = "_blank", A.rel = "noopener", _.append(A), h.append(_);
        }
      } else if (x(`${w} record ${FL(i.number)}${i.inscription !== void 0 ? ` · Xtrata inscription #${i.inscription}` : ""}. In your player now, and yours for good.`), L.push(mn("al-primary", "See it in my player", i.done)), i.inscription !== void 0) {
        const _ = Bt("a", "al-link", "Open it full screen ↗");
        _.href = `/i/${i.inscription}`, _.target = "_blank", _.rel = "noopener", L.push(_);
      }
      if (i.status.length) {
        const _ = Bt("div", "al-status");
        _.setAttribute("role", "status"), _.append(...i.status), h.append(_);
      }
      i.asking ? h.append(Bt("p", "al-hint al-hint--ask", "Continue in the box below.")) : h.append(...L);
      const U = Bt("div", "al-body al-body--welcome");
      U.append(h), e.hidden = !1, e.replaceChildren(c, U);
    }
  };
}
const Kb = "xtrata.xyz/music/release", zL = "Release music on Xtrata Music; no spending permission", GL = (e) => ({
  domain: gr({ name: Et(Kb), version: Et("1"), "chain-id": vn(1) }),
  message: gr({ purpose: Et(zL), artist: Et(e.artist), release: Et(e.hash), issued: vn(e.issued) })
}), KL = "Set the price of my release on Xtrata Music; no spending permission", VL = 100000n, XL = 1000000000n, YL = (e) => e === 0n || e >= VL && e <= XL, qL = (e) => ({
  domain: gr({ name: Et(Kb), version: Et("1"), "chain-id": vn(1) }),
  message: gr({ purpose: Et(KL), artist: Et(e.artist), release: Et(e.release), price: vn(BigInt(e.price)), issued: vn(e.issued) })
}), Ui = (e) => {
  const t = BigInt(e), n = t / 1000000n, r = (t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "");
  return r ? `${n}.${r}` : `${n}`;
}, WL = (e) => {
  const t = /^\s*(\d{1,6})(?:\.(\d{1,6}))?\s*$/.exec(e);
  return t ? BigInt(t[1]) * 1000000n + BigInt((t[2] ?? "").padEnd(6, "0") || "0") : null;
}, we = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, Ln = (e, t, n = "") => {
  const r = we("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, Yc = (e) => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(e) }), Qg = (e) => {
  const t = Rr(e).length;
  return `${t} ${t === 1 ? "song" : "songs"}`;
};
function qc(e, t, n = "", r = "") {
  const s = we("span", "", "ppp-rel-art" + (e ? "" : " is-blank") + (r ? " " + r : "")), o = e || n;
  if (o) {
    const i = document.createElement("img");
    i.src = o, i.alt = "", i.decoding = "async", s.append(i);
  }
  return e || s.append(we("span", t)), s;
}
const od = (e) => !!e && gf(e.id) && typeof e.title == "string" && Array.isArray(e.tracks) && e.tracks.length > 0 && typeof e.artist == "string";
function ZL(e) {
  let t = null, n = { copies: !1, sales: !1 }, r = !1, s = "", o = "";
  const i = (() => {
    try {
      const G = new URLSearchParams(location.search).get("release");
      return gf(G) ? G : null;
    } catch {
      return null;
    }
  })();
  let a = i ? { id: i } : null;
  const c = (G) => "xtrata.radio.releases.shelf.v1:" + G;
  let u = null, h = !1, d = -1 / 0;
  const w = (G, O, te) => {
    const re = Array.isArray(O) ? O.filter(od).map((le) => ({ ...le, hidden: !!le.hidden })) : [];
    u = { for: G, albums: re, fresh: te }, te && e.store.set(c(G), JSON.stringify(re));
  }, y = (G) => {
    try {
      w(G, JSON.parse(e.store.get(c(G)) || "[]"), !1);
    } catch {
      w(G, [], !1);
    }
  }, v = () => {
    const G = e.player().address;
    return G && (u == null ? void 0 : u.for) === G ? u.albums : [];
  };
  async function x(G, O = "") {
    const te = e.player();
    if (!te.address || !te.unlocked)
      return o = "Unlock your player first.", e.changed(), !1;
    if (h) return !1;
    h = !0, o = "", e.changed();
    try {
      const re = await e.signShelf(G, O), le = await e.json("/radio/release/shelf", Yc(re));
      return w(te.address, le == null ? void 0 : le.albums, !0), U(le == null ? void 0 : le.pay) ? A(te.address, le.pay) : G === "add" && A(te.address, null, O), !0;
    } catch (re) {
      return G !== "list" && (o = re.message || "That did not work. Try again."), !1;
    } finally {
      h = !1, e.changed();
    }
  }
  const L = (G) => "xtrata.radio.releases.orders.v1:" + G, U = (G) => !!G && /^[0-9a-f]{16}$/.test(G.order) && gf(G.release) && typeof G.to == "string" && /^\d{1,12}$/.test(G.amount) && typeof G.memo == "string", _ = (G) => {
    if (!G) return {};
    try {
      const O = JSON.parse(e.store.get(L(G)) || "{}");
      return O && typeof O == "object" ? Object.fromEntries(Object.entries(O).filter(([, te]) => U(te))) : {};
    } catch {
      return {};
    }
  };
  function A(G, O, te = (O == null ? void 0 : O.release) ?? "") {
    var le;
    const re = _(G);
    O ? re[O.release] = { ...((le = re[O.release]) == null ? void 0 : le.order) === O.order ? re[O.release] : {}, ...O } : delete re[te], e.store.set(L(G), Object.keys(re).length ? JSON.stringify(re) : null);
  }
  const T = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Map();
  async function Y(G, O, te = !1) {
    var re;
    if (!T.has(O.order)) {
      T.add(O.order), B.set(O.order, e.now()), te && (o = "", e.changed());
      try {
        const le = await e.json("/radio/release/paid", Yc({ order: O.order, ...O.txid ? { txid: O.txid } : {} }));
        (le == null ? void 0 : le.status) === "paid" ? (A(G, null, O.release), ((re = a == null ? void 0 : a.view) == null ? void 0 : re.id) === O.release && (a.view = { ...a.view, added: a.view.added + 1 }), o = "", T.delete(O.order), (u == null ? void 0 : u.for) === G && (u.fresh = !1), e.player().unlocked && await x("list")) : (U(le) && A(G, { ...O, ...le }), te && (le == null ? void 0 : le.status) === "pending" && (o = "No payment found yet. If you have just paid, give it a minute and check again."));
      } catch (le) {
        /did not go through|does not pay this order/.test(le.message || "") && A(G, { ...O, txid: void 0, status: "pending" }), (te || O.txid) && (o = le.message || "The payment could not be checked right now. Nothing is lost.");
      } finally {
        T.delete(O.order), e.changed();
      }
    }
  }
  async function ee(G, O, te) {
    if (!s) {
      s = "Approve the payment in your wallet…", o = "", e.changed();
      try {
        const re = await e.pay(G, te.to, BigInt(te.amount), te.memo), le = { ...te, txid: re || void 0, status: "confirming" };
        A(O, le), s = "", Y(O, le);
      } catch (re) {
        o = /cancel/i.test(re.message || "") ? "Payment cancelled. Nothing was sent." : re.message || "Not paid. Nothing was sent.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  async function oe(G) {
    const O = e.player();
    if (!await x("add", G.id) || !O.address) return;
    const te = _(O.address)[G.id], re = e.main();
    te && re && await ee(re, O.address, te);
  }
  function W() {
    if (r || (r = !0, e.json("/radio/release/config").then((O) => {
      t = (O == null ? void 0 : O.enabled) === !0, n = { copies: t && (O == null ? void 0 : O.copies) === !0, sales: t && (O == null ? void 0 : O.sales) === !0 };
    }, () => {
      t = !1, r = !1;
    }).finally(e.changed)), !t) return;
    if (a && !a.view && !a.error) {
      const O = a;
      O.error = "", e.json("/radio/release/view?id=" + O.id).then(
        (te) => {
          od(te) ? (O.view = te, delete O.error) : O.error = "This release could not be read.";
        },
        (te) => {
          O.error = te.message || "This release could not be opened right now.";
        }
      ).finally(e.changed);
    }
    const G = e.player();
    if (G.address) {
      (u == null ? void 0 : u.for) !== G.address && y(G.address), G.unlocked && !(u != null && u.fresh) && !h && e.now() - d > 6e4 && (d = e.now(), x("list"));
      for (const O of Object.values(_(G.address)))
        if ((O.txid || O.status === "confirming") && !T.has(O.order) && e.now() - (B.get(O.order) ?? -1 / 0) > 2e4) {
          const te = G.address;
          Y(te, O).then(() => {
            setTimeout(() => e.changed(), 20500);
          });
        }
    }
  }
  const m = () => t ? v().filter((G) => !G.hidden) : [];
  function C(G, O) {
    const te = we("ol", "", "ppp-rel-songs");
    return G.forEach((re, le) => {
      const bt = we("li");
      bt.append(qc(e.art.song(re.id, !0) || "", String(le + 1), O), we("span", re.title)), te.append(bt);
    }), te;
  }
  function P() {
    if (!t || !a || a.dismissed) return [];
    if (!a.view) return a.error ? [we("p", `♫ ${a.error}`, "ppp-warn")] : [we("p", "♫ Opening this release…", "ppp-mute")];
    const G = a.view, O = we("div", "", "ppp-release-in"), te = we("p", "", "ppp-release-in__h"), re = BigInt(/^\d{1,12}$/.test(G.price ?? "") ? G.price : "0");
    te.append(we("b", G.title), we("span", `${G.subtitle || e.who(G.artist)} · ${Qg(G)}${re > 0n ? ` · ${Ui(re)} STX` : ""}`));
    const le = Rr(G), bt = e.art.cover(G.cover) || (G.cover ? "" : le[0] && e.art.song(le[0].id, !0) || ""), Oe = we("div", "", "ppp-rel-top");
    Oe.append(qc(bt, "💿", "", "is-cover"), te), O.append(Oe, C(le.map(($e) => ({ id: $e.id, title: $e.title || `#${$e.id}` })), e.art.cover(G.cover))), O.append(we("p", `Released by ${e.who(G.artist)}. ${G.added === 1 ? "1 player has" : `${G.added.toLocaleString()} players have`} added it.`, "ppp-mute"));
    const ze = e.player(), At = v().find(($e) => $e.id === G.id), He = we("div", "", "ppp-award__row");
    if (At)
      O.append(we("p", "In your player ✓ It stays there until you hide or remove it.", "ppp-ok")), He.append(Ln("Play it", () => e.open(G), "primary"));
    else if (!ze.address) O.append(we("p", "Make your player first (above), then add this album to it. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
    else if (!ze.unlocked) O.append(we("p", "Unlock your player to add this album to it.", "ppp-mute"));
    else if (re > 0n) {
      const $e = _(ze.address)[G.id], Ve = e.main(), Ke = `${Ui(($e == null ? void 0 : $e.amount) ?? re)} STX`;
      if ($e != null && $e.txid || ($e == null ? void 0 : $e.status) === "confirming") {
        O.append(we("p", "Payment sent ✓ Waiting for it to confirm (a few minutes). The album appears in your player by itself.", "ppp-ok"));
        const Xe = Ln("Check now", () => void Y(ze.address, $e, !0));
        Xe.disabled = T.has($e.order), He.append(Xe);
      } else if (O.append(we("p", `This album costs ${Ke}. You pay ${e.who(G.artist)} directly: Xtrata takes nothing, never holds the money and cannot refund it. Once paid it is in your player for good, and it plays with your own plays.`, "ppp-mute")), !n.sales && !$e) O.append(we("p", "Buying is paused right now.", "ppp-warn"));
      else if ($e) {
        if (Ve) {
          const dn = Ln(`Pay ${Ke} from my wallet`, () => void ee(Ve, ze.address, $e), "primary");
          dn.disabled = !!s, He.append(dn);
        } else O.append(we("p", "Connect a Stacks wallet (top right) to pay here. Or pay from any wallet, exactly like this:", "ppp-mute"));
        const Xe = we("div", "", "ppp-rel-pay"), Kt = (dn, Vn, Pt) => {
          const gn = we("p");
          return gn.append(we("span", dn), we("code", Vn), ur(`order-${Pt}:${$e.order}`, "Copy", () => Vn, "tiny", e.changed)), gn;
        };
        Xe.append(Kt("Send", Ui($e.amount) + " STX", "amount"), Kt("To", $e.to, "to"), Kt("Memo", $e.memo, "memo")), O.append(Xe, we("p", "The memo is what ties the payment to your player. Without it the album cannot be added.", "ppp-mute"));
        const pn = Ln("I have paid: check", () => void Y(ze.address, $e, !0));
        pn.disabled = T.has($e.order), He.append(pn);
      } else {
        const Xe = Ln(`Buy · ${Ke}`, () => void oe(G), "primary");
        Xe.disabled = h || !!s, He.append(Xe);
      }
    } else {
      O.append(we("p", "Add it and it stays in your player. It plays with your own plays, and every play pays the artist.", "ppp-mute"));
      const $e = Ln("Add to my player", () => {
        x("add", G.id).then((Ve) => {
          Ve && (a != null && a.view) && (a.view = { ...a.view, added: a.view.added + 1 });
        });
      }, "primary");
      $e.disabled = h, He.append($e);
    }
    return He.append(Ln("Not now", () => {
      a && (a.dismissed = !0), e.changed();
    }, "quiet")), O.append(He), s && O.append(we("p", s, "ppp-cyan")), o && O.append(we("p", o, "ppp-warn")), [O];
  }
  let M = !1;
  function Z() {
    const G = t ? v() : [];
    if (!G.length) return null;
    const O = we("details", "", "ppp-release-manage");
    O.open = M, O.ontoggle = () => {
      M = O.open;
    };
    const te = G.filter((le) => le.hidden).length;
    O.append(we("summary", `Albums I added (${G.length}${te ? `, ${te} hidden` : ""})`));
    const re = e.player().unlocked;
    re || O.append(we("p", "Unlock your player to hide or remove an album.", "ppp-mute"));
    for (const le of G) {
      const bt = we("div", "", "ppp-release-row" + (le.hidden ? " is-hidden" : "")), Oe = we("span", "", "ppp-release-row__t");
      Oe.append(we("b", le.title), we("span", `${le.subtitle || e.who(le.artist)}${le.hidden ? " · hidden" : ""}`));
      const ze = Ln(le.hidden ? "Show" : "Hide", () => void x(le.hidden ? "show" : "hide", le.id), "tiny"), At = Ln("Remove", () => void x("remove", le.id), "tiny");
      ze.disabled = At.disabled = !re || h, bt.append(Oe, ze, At), O.append(bt);
    }
    return O.append(we("p", "Hide keeps an album but out of sight. Remove takes it off your player; you can add it again from its link.", "ppp-mute")), o && !a && O.append(we("p", o, "ppp-warn")), O;
  }
  let F = null, ge = [], ce = null;
  const Ge = we("input");
  Ge.maxLength = 60, Ge.placeholder = "Title of the single, EP or album", Ge.setAttribute("aria-label", "Release title");
  const $ = we("input");
  $.maxLength = 80, $.placeholder = "Artist name shown under the title", $.setAttribute("aria-label", "Artist name");
  const j = we("input");
  j.inputMode = "numeric", j.placeholder = "Cover: an inscription number (optional; the first song’s artwork if left empty)", j.setAttribute("aria-label", "Cover inscription number");
  const ue = we("input");
  ue.inputMode = "decimal", ue.placeholder = "Price in STX, e.g. 2 (0 makes it free)", ue.setAttribute("aria-label", "Price in STX");
  let me = null;
  const Ne = (G, O, te = "") => {
    me = (me == null ? void 0 : me.id) === G && me.what === O ? null : { id: G, what: O }, (me == null ? void 0 : me.what) === "price" && (ue.value = te), o = "", e.changed();
  };
  async function xe(G, O) {
    if (s) return;
    const te = WL(ue.value);
    if (te === null || !YL(te)) {
      o = "A price is 0 (free), or 0.1 to 1,000 STX.", e.changed();
      return;
    }
    s = "Sign in your wallet (nothing is spent)…", o = "", e.changed();
    try {
      const re = { artist: G, release: O.id, price: te.toString(), issued: e.now() }, le = await e.sign(G, qL(re));
      s = "Saving the price…", e.changed(), await e.json("/radio/release/price", Yc({ request: re, signature: le })), o = te > 0n ? `Price set ✓ “${O.title}” now costs ${Ui(te)} STX, paid straight to this wallet.` : `“${O.title}” is free again ✓`, me = null, Be(G, !0);
    } catch (re) {
      o = re.message || "The price was not changed.";
    } finally {
      s = "", e.changed();
    }
  }
  const wt = (G) => `${location.origin}${location.pathname}?release=${G}`;
  function Fe(G) {
    F = { for: G, loading: !0 }, ge = [], e.changed(), e.json("/radio/release/songs?wallet=" + encodeURIComponent(G)).then(
      (O) => {
        const te = Array.isArray(O == null ? void 0 : O.songs) ? O.songs.filter((re) => Number.isSafeInteger(re == null ? void 0 : re.id) && typeof re.title == "string") : null;
        F = te ? { for: G, songs: te, more: !!O.more } : { for: G, error: "Your songs could not be read right now." };
      },
      (O) => {
        F = { for: G, error: O.message || "Your songs could not be read right now." };
      }
    ).finally(e.changed);
  }
  function Be(G, O = !1) {
    !O && (ce == null ? void 0 : ce.for) === G && e.now() - ce.at < 6e4 || (ce = { for: G, list: (ce == null ? void 0 : ce.for) === G ? ce.list : [], at: e.now() }, e.json("/radio/release/by?artist=" + encodeURIComponent(G)).then((te) => {
      Array.isArray(te == null ? void 0 : te.releases) && (ce = { for: G, list: te.releases.filter(od), at: e.now() });
    }, () => {
    }).finally(e.changed));
  }
  async function Me(G) {
    if (!s) {
      s = "Checking your release…", o = "", e.changed();
      try {
        const O = j.value.trim().replace(/^#/, ""), te = jb({ title: Ge.value.trim(), subtitle: $.value.trim(), tracks: [...ge], cover: O ? Number(O) : null });
        s = "Sign in your wallet (nothing is spent)…", e.changed();
        const re = { artist: G, hash: Rb(te), issued: e.now() }, le = await e.sign(G, GL(re));
        s = "Releasing…", e.changed();
        const bt = await e.json("/radio/release/create", Yc({ definition: te, request: re, signature: le }));
        o = `${bt.existing ? "Already released" : "Released"} ✓ “${bt.title}”. Its link is below.`, ge = [], Ge.value = "", j.value = "", e.audition.stop(), Be(G, !0);
      } catch (O) {
        o = O.message || "Not released.";
      } finally {
        s = "", e.changed();
      }
    }
  }
  const Bn = () => {
    queueMicrotask(() => e.audition.stop());
  }, An = /* @__PURE__ */ new Set();
  function ft(G) {
    const O = ge.map((Xe) => G.find((Kt) => Kt.id === Xe)).filter((Xe) => !!Xe), te = j.value.trim().replace(/^#/, ""), re = /^\d{1,9}$/.test(te) ? Number(te) : null, le = e.art.cover(re), bt = O[0] ? e.art.song(O[0].id, !0) : null, Oe = we("div", "", "ppp-release-preview");
    Oe.append(we("p", "How it will look", "ppp-featured__h"));
    const ze = we("p", "", "ppp-release-in__h"), At = we("b", Ge.value.trim() || "Untitled"), He = we("span", `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`);
    ze.append(At, He);
    const $e = we("div", "", "ppp-rel-top");
    $e.append(qc(re ? le : bt || "", "💿", "", "is-cover"), ze), Oe.append($e, C(O.map((Xe) => ({ id: Xe.id, title: Xe.title })), le));
    const Ve = O.filter((Xe) => e.art.song(Xe.id, !0) === null).length, Ke = [];
    re && !le && Ke.push(`Looking for an image in #${re}… If none appears, that inscription is not a picture.`), Ve && Ke.push(`Finding artwork for ${Ve} ${Ve === 1 ? "song" : "songs"}…`), !Ve && O.some((Xe) => e.art.song(Xe.id, !1) === "") && Ke.push(`A numbered square is a song with no artwork of its own${le ? ": it shows the cover, dimmed" : ""}.`);
    for (const Xe of Ke) Oe.append(we("p", Xe, "ppp-mute"));
    return Ge.oninput = () => {
      At.textContent = Ge.value.trim() || "Untitled";
    }, $.oninput = () => {
      He.textContent = `${$.value.trim() || e.who(e.main())} · ${O.length} ${O.length === 1 ? "song" : "songs"}`;
    }, j.onchange = () => e.changed(), Oe;
  }
  function Ct() {
    var te;
    const G = e.main();
    if (!t || !G)
      return F && (F = null, ge = [], Bn()), null;
    const O = [we("p", "Put your own songs out as a single, an EP or an album. Listeners add it to their player, and every play pays you. Nothing to pay, and no money passes through Xtrata.", "ppp-mute")];
    if (F && F.for !== G && (F = null, ge = [], An.clear(), Bn()), !F) O.push(Ln("Show the songs in my wallet", () => Fe(G), "primary"));
    else if (F.loading) O.push(we("p", "Reading your wallet…", "ppp-cyan"));
    else if (F.error) O.push(we("p", F.error, "ppp-warn"), Ln("Try again", () => Fe(G)));
    else if (!F.songs.length) O.push(we("p", "No songs found in this wallet. A release is made by the wallet that holds its song masters.", "ppp-mute"));
    else {
      O.push(we("p", "Tap your songs in the order they should play. Tap one again to take it out.", "ppp-cyan"));
      const re = we("div", "", "ppp-release-songs");
      for (const Oe of F.songs) {
        const ze = ge.indexOf(Oe.id), At = we("div", "", "ppp-release-song" + (ze >= 0 ? " is-on" : "")), He = e.audition.state(Oe.id);
        He !== "idle" && An.add(Oe.id);
        const $e = Ln(He === "playing" ? "❚❚" : He === "loading" ? "…" : "▶", () => e.audition.toggle(Oe.id), "ppp-release-hear" + (He === "playing" ? " is-on" : ""));
        $e.setAttribute("aria-label", He === "playing" ? `Stop ${Oe.title}` : `Listen to ${Oe.title}`), $e.title = He === "error" ? "This song could not be played just now" : He === "playing" ? "Stop" : "Listen (free: it is your own song)";
        const Ve = e.art.song(Oe.id, ze >= 0 || An.has(Oe.id)), Ke = Ln("", () => {
          ge = ze >= 0 ? ge.filter((Xe) => Xe !== Oe.id) : [...ge, Oe.id], e.changed();
        }, "ppp-release-pick");
        Ke.setAttribute("aria-pressed", String(ze >= 0)), Ke.append(we("i", ze >= 0 ? String(ze + 1) : "+"), we("b", Oe.title), we("span", He === "error" ? "could not play" : `${Oe.artist ? Oe.artist + " · " : ""}#${Oe.id}`, He === "error" ? "ppp-warn" : "")), At.append($e, qc(Ve || "", Ve === "" ? "♪" : "", ""), Ke), re.append(At);
      }
      O.push(re), F.more && O.push(we("p", "This wallet holds a lot: only the first few hundred inscriptions were looked through.", "ppp-mute")), !$.value && ge.length && ($.value = ((te = F.songs.find((Oe) => Oe.id === ge[0])) == null ? void 0 : te.artist) || "");
      const le = ge.length === 0 ? "release" : ge.length === 1 ? "single" : ge.length <= 6 ? "EP" : "album", bt = Ln(ge.length ? `Sign and release this ${le} · ${ge.length} ${ge.length === 1 ? "song" : "songs"}` : "Pick at least one song", () => void Me(G), "primary");
      bt.disabled = !ge.length || !!s, O.push(Ge, $, j), ge.length && O.push(ft(F.songs)), O.push(bt);
    }
    if (s && O.push(we("p", s, "ppp-cyan")), o && !a && O.push(we("p", o, /✓/.test(o) ? "ppp-ok" : "ppp-warn")), Be(G), (ce == null ? void 0 : ce.for) === G && ce.list.length) {
      O.push(we("p", "Your releases", "ppp-featured__h"));
      for (const re of ce.list) {
        const le = we("div", "", "ppp-release-row"), bt = we("span", "", "ppp-release-row__t"), Oe = BigInt(/^\d{1,12}$/.test(re.price ?? "") ? re.price : "0"), ze = Oe > 0n ? ` · ${Ui(Oe)} STX · ${(re.sold ?? 0).toLocaleString()} sold` : n.sales ? " · free" : "";
        if (bt.append(we("b", re.title), we("span", `${Qg(re)} · added by ${re.added.toLocaleString()} ${re.added === 1 ? "player" : "players"}${ze}`)), le.append(bt, ur("release-link:" + re.id, "Copy link", () => wt(re.id), "tiny", e.changed)), n.sales) {
          const He = Ln("Price", () => Ne(re.id, "price", Oe > 0n ? Ui(Oe) : ""), "tiny");
          He.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === re.id && me.what === "price")), le.append(He);
        }
        if (n.copies && e.copies) {
          const He = Ln("Send copies", () => Ne(re.id, "copies"), "tiny");
          He.setAttribute("aria-expanded", String((me == null ? void 0 : me.id) === re.id && me.what === "copies")), le.append(He);
        }
        if (O.push(le), (me == null ? void 0 : me.id) !== re.id) continue;
        const At = we("div", "", "ppp-release-way");
        if (me.what === "price" && n.sales) {
          const He = Ln("Sign this price", () => void xe(G, re), "primary");
          He.disabled = !!s, At.append(
            we("p", "Put a price on this release. Each listener then pays you that price once to add it, straight to this wallet. Xtrata takes nothing, never holds the money and cannot refund a sale: a refund is between you and the buyer. Players that already have it keep it.", "ppp-mute"),
            ue,
            He
          );
        } else me.what === "copies" && n.copies && e.copies && At.append(...e.copies(G, { id: re.id, title: re.title }));
        At.childNodes.length && O.push(At);
      }
    }
    return O;
  }
  return { sync: W, albums: m, banner: P, manage: Z, fold: Ct, wantsArt: () => t === !0 && (!!(a != null && a.view) && !a.dismissed || !!(F != null && F.songs) && !!e.main()), enabled: () => t === !0 };
}
const sd = "xtrata.radio.replace.v1", Cn = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.textContent = t), n && (r.className = n), r;
}, hs = (e, t, n = "") => {
  const r = Cn("button", e, n);
  return r.type = "button", r.onclick = t, r;
}, ey = (e) => (Number(e) / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 6 });
function JL(e) {
  let n = (() => {
    try {
      const v = JSON.parse(e.store.get(sd) || "null");
      return v && typeof v.old == "string" ? v : null;
    } catch {
      return null;
    }
  })();
  const r = (v) => {
    n = v, e.store.set(sd, v ? JSON.stringify(v) : null), e.changed();
  };
  let s = null, o = !1, i = "", a = !1;
  function c(v) {
    o || (s == null ? void 0 : s.for) === v && (s.n !== null || Date.now() - s.at < 3e4) || (o = !0, e.json("/radio/gift/shelf?root=" + encodeURIComponent(v) + "&limit=1").then(
      (x) => {
        s = { for: v, n: Number.isSafeInteger(x == null ? void 0 : x.total) ? x.total : null, at: Date.now() };
      },
      () => {
        s = { for: v, n: null, at: Date.now() };
      }
    ).finally(() => {
      o = !1, e.changed();
    }));
  }
  const u = () => !!n, h = () => !!(n != null && n.removed);
  function d(v) {
    v.listening && (i = "", r({ old: v.listening }));
  }
  const w = () => {
    i = "", r(null);
  };
  function y(v) {
    var B;
    if (!n) return null;
    n.removed && v.listening === n.old && (n = { old: n.old }, e.store.set(sd, JSON.stringify(n)));
    const x = [], L = (Y, ee) => x.push(Cn("p", `Replacing your old player · step ${Y} of 3 · ${ee}`, "ppp-cyan")), U = () => hs("Stop · keep my old player", w, "quiet");
    if (v.listening && v.listening !== n.old) {
      if (!n.removed)
        return w(), null;
      x.push(Cn("p", "Your new player is ready ✓ Your old one is empty and no longer on this device.", "ppp-ok")), v.phrase && !v.backedUp ? x.push(Cn("p", "First, write down your new player’s 24 backup words. They are the only way back in if this passkey is ever lost."), hs("Back up my player · 24 words", e.backup, "primary")) : v.backedUp && x.push(Cn("p", "Its 24 backup words are written down ✓", "ppp-ok"));
      const Y = v.passkeyName ? `the one called “${v.passkeyName}”` : "the newest one";
      return x.push(Cn("p", `Your phone still has the old player’s passkey. You can delete it in your phone’s saved passwords (search for “xtrata”) if you like: keep ${Y}, which is this new player. Deleting a passkey cannot be undone, so do it only after the backup words are written down, and only if you are sure which is which. Leaving it there does no harm.`, "ppp-mute")), x.push(hs("Done", w, "quiet")), x;
    }
    if (!v.listening || n.removed)
      return n.removed ? (L(3, "claim your new player"), x.push(Cn("p", "Old player removed from this device ✓ Now claim your free player: it is made with a new passkey and comes with 24 backup words.", "ppp-ok")), x.push(hs("Hide this", w, "quiet")), x) : null;
    if (c(n.old), v.step === "locked" || v.step === "intro")
      return L(1, "empty it"), x.push(Cn("p", "Unlock your old player so it can be emptied."), hs("Unlock my old player", e.unlock, "primary"), U()), x;
    const _ = e.keepBoth(v), A = (Y) => (L(1, "empty it"), x.push(Cn("p", Y, "ppp-warn")), _ && x.push(hs("Keep both players instead", () => {
      w(), _();
    }, "primary")), x.push(U()), x);
    if (v.slot !== 0) return A("An album is open. Go back to your own player first.");
    if ((s == null ? void 0 : s.for) !== n.old)
      return L(1, "empty it"), x.push(Cn("p", "Checking what this player has…", "ppp-mute"), U()), x;
    if (s.n === null) return A("Could not check whether this player has albums of its own, so it will not be removed. Try again shortly.");
    if (s.n > 0) return A(`This player has ${s.n === 1 ? "an album" : `${s.n} albums`} of its own. Replacing it would leave ${s.n === 1 ? "it" : "them"} behind, so it stays.`);
    if (((B = v.award) == null ? void 0 : B.state) === "claimed" && v.award.holds !== !1) return A("This player holds a Music Hero record. Send the record to another address first, or keep both players.");
    if (v.depositPending || v.entries.some((Y) => ["prepared", "signed", "unknown", "pending"].includes(String(Y.status))))
      return L(1, "empty it"), x.push(Cn("p", "Something is still on its way in or out of this player. This carries on by itself once it has settled.", "ppp-mute"), U()), x;
    if (v.balance === void 0)
      return L(1, "empty it"), x.push(Cn("p", "Checking what it holds…", "ppp-mute"), U()), x;
    if (v.balance > e.dust(v))
      return L(1, "empty it"), x.push(Cn("p", `It holds ${ey(v.balance)} STX. Send it back${v.returnTo ? ` to ${e.who(v.returnTo)}` : ""} first: nothing may be left in a player you are about to remove.`)), v.returnTo || v.gift ? x.push(hs("Send everything back", e.returnAll, "primary")) : x.push(Cn("p", "There is nowhere set to send it. Connect a Stacks wallet (top right) and link it to this player, then come back here.", "ppp-warn")), x.push(U()), x;
    L(2, "remove it from this device"), x.push(Cn("p", v.balance > 0n ? `Empty ✓ (the ${ey(v.balance)} STX left is less than the network fee to move it).` : "Empty ✓", "ppp-ok")), x.push(Cn("p", "What stays behind with the old player: its likes, its play history and any progress toward a Music Hero award. Your new player starts fresh.", "ppp-mute"));
    const T = hs(a ? "Check the box below…" : "Remove my old player", () => {
      a || (a = !0, i = "", e.changed(), e.forget().then(() => {
        r({ old: n.old, removed: !0 });
      }, (Y) => {
        i = /cancel/i.test((Y == null ? void 0 : Y.message) || "") ? "" : (Y == null ? void 0 : Y.message) || "It was not removed.";
      }).finally(() => {
        a = !1, e.changed();
      }));
    }, "primary");
    return T.disabled = a || !!v.busy, x.push(T, U()), i && x.push(Cn("p", i, "ppp-warn")), x;
  }
  return { active: u, claiming: h, start: d, stop: w, lines: y };
}
const QL = [
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
function eC(e) {
  for (const [t, n] of QL) if (n.test(e)) return t;
  return null;
}
const Vb = (e) => /iP(hone|ad|od)/.test(e) || /Macintosh/.test(e) && /Mobile\//.test(e), Xb = (e) => /Android/.test(e);
function tC(e, t) {
  const n = new URL(e);
  return n.protocol !== "https:" ? null : Vb(t) ? "x-safari-" + n.href : Xb(t) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const nC = (e) => Vb(e) ? "Safari" : Xb(e) ? "Chrome" : "your browser", Oi = "Xtrata Music player", rC = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function ty(e, t = (n) => n) {
  var o, i, a;
  if (e.mainConnected ?? !!e.main) return [];
  if (e.step === "off" || e.step === "elsewhere") return [];
  if (e.gate && (e.gate.enabled === !1 || e.gate.here === !1)) return [];
  if (e.step === "unsupported")
    return ((o = e.gate) == null ? void 0 : o.passkeyOnly) || e.linked || ((i = e.others) == null ? void 0 : i.length) ? [{ action: null, label: Oi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([e.standIn, e.linked, ...e.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = e.standIn === c && rC.has(e.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Oi} · ${t(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${t(c)}.`
    });
  }
  if ((a = e.gate) != null && a.passkeyOnly && e.solo)
    switch (e.step) {
      case "intro":
        r.push({ action: "create", label: Oi, detail: "Make one with Face ID or your fingerprint. Nothing to install." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Oi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Oi, detail: "Face ID or your fingerprint. Nothing to install." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Oi, detail: "Open on this device." });
    }
  return r;
}
const id = "xtrata.radio.novice", Yb = "xtrata.radio.novice.previewed.v1", ny = 6 * 6e4;
function oC(e, t) {
  let n = null;
  try {
    const r = new URLSearchParams(e).get("novice");
    if (r === "1" || r === "preview")
      t.set(id, r), n = r;
    else {
      if (r === "0")
        return t.set(id, null), { on: !1, preview: !1 };
      n = t.get(id);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const sC = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, ry = (e) => sC.test(e ?? ""), iC = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, aC = {
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
}, cC = (e, t) => aC[e] ?? t;
function lC(e, t) {
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
const uC = "Make your player once, with Face ID or your fingerprint, and the music starts.", dC = "Checking your player…", mf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function qb(e) {
  try {
    const t = JSON.parse(e.get(Yb) || "[]");
    return Array.isArray(t) ? t.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function fC(e, t) {
  const n = qb(e).filter((r) => r !== t);
  n.push(t), e.set(Yb, JSON.stringify(n.slice(-50)));
}
function ad(e, t) {
  switch (t.kind) {
    case "offer":
      return e.album === t.album && e.phase !== "idle" ? e : { ...mf(), album: t.album, phase: t.already ? "done" : "open" };
    case "withdraw":
      return e.phase === "idle" ? e : mf();
    case "now":
      return e.phase === "open" && t.playing && t.track ? { ...e, phase: "playing", track: t.track, since: t.at } : e.phase === "playing" && t.track && t.track !== e.track ? { ...e, phase: "done" } : e.phase === "playing" && t.at - e.since > ny ? { ...e, phase: "done" } : e;
    case "listened":
      return e.phase !== "playing" ? e : e.heard >= 1 ? { ...e, phase: "done" } : { ...e, heard: e.heard + 1 };
    case "tick":
      return e.phase === "playing" && t.at - e.since > ny ? { ...e, phase: "done" } : e;
  }
}
const Wc = (e) => e.phase === "open" || e.phase === "playing";
function hC(e = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: e.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: e.sbtc === !0 }
  ];
}
const pC = [100, 250, 500, 1e3], gC = (e, t = Kr) => BigInt(e) * On(t);
function yC(e, t = Kr, n = 0n) {
  const r = To - e - n;
  return r > 0n ? Number(r / On(t)) : 0;
}
function wC(e, t = Kr, n = 0n) {
  const r = e === void 0 ? 0 : yC(e, t, n);
  return pC.map((s) => ({ plays: s, stx: gC(s, t), fits: e !== void 0 && s <= r }));
}
const mC = {
  microSTX: (e) => `${e / 1000000n}.${(e % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (e) => `${e.toLocaleString("en-GB")} sats`,
  pence: (e) => `£${e / 100n}.${(e % 100n).toString().padStart(2, "0")}`
}, bC = (e) => mC[e.unit](e.amount), qt = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, al = (e, t, n) => `${e.toLocaleString()} ${e === 1 ? t : n}`;
function xC(e) {
  if (!e || e.plays < 1) return "";
  const t = [`paid for ${al(e.plays, "play", "plays")}${e.artists > 0 ? ` to ${al(e.artists, "artist", "artists")}` : ""}`];
  return e.likes > 0 && t.push(`saved ${al(e.likes, "like", "likes")}`), `So far your player has ${t.join(" and ")}, all on the public record.`;
}
function SC(e) {
  let t = null, n = 0, r = "stx";
  const s = (i) => {
    var c;
    if (i.some((u) => u.plays === n && u.fits)) return;
    const a = i.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = i[1]) == null ? void 0 : h.plays);
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
    const a = wC(i.balance, i.fee, i.incoming);
    s(a);
    const c = hC(i.switches);
    (y = c.find((v) => v.id === r)) != null && y.on || (r = "stx");
    const u = [], h = qt("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(qt("p", "ppp-restock__left", i.playsLeft === null ? "Checking your player…" : i.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${al(i.playsLeft, "play", "plays")} left.`));
    const d = xC(i.done);
    if (d && u.push(qt("p", "ppp-restock__done", d)), i.arriving)
      u.push(qt("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (i.balance === void 0)
      u.push(qt("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((v) => v.fits))
      u.push(qt("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const v = qt("div", "ppp-restock__packs");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const _ = qt("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        _.type = "button", _.disabled = !U.fits, _.setAttribute("aria-pressed", String(U.plays === n)), _.append(qt("b", "", U.plays.toLocaleString()), qt("span", "", "plays")), _.onclick = () => {
          n = U.plays, o();
        }, v.append(_);
      }
      u.push(v);
      const x = qt("div", "ppp-restock__ways");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const _ = qt("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        _.type = "button", _.disabled = !U.on, _.setAttribute("aria-pressed", String(U.id === r)), _.append(qt("b", "", U.label), qt("span", "", U.on ? U.blurb : "Soon")), _.onclick = () => {
          r = U.id, o();
        }, x.append(_);
      }
      u.push(x);
      const L = a.find((U) => U.plays === n);
      if (L && r === "stx") {
        const U = qt("div", "ppp-restock__pay"), _ = bC({ unit: "microSTX", amount: L.stx }), A = qt("p", "ppp-restock__amount");
        A.append("Send ", qt("b", "", _), " to your player:"), U.append(A, qt("p", "ppp-addr-full ppp-restock__addr", i.address));
        const T = qt("div", "ppp-restock__row");
        T.append(e.copyButton("restock-address", "Copy address", () => i.address, "primary"), e.copyButton("restock-amount", "Copy amount", () => Ur(L.stx), "")), U.append(T), U.append(qt("p", "ppp-restock__note", `From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: ${i.backedUp ? "your player is backed up, though larger amounts are safer in your main wallet" : "your player holds up to 1 STX"}. The plays appear here by themselves, usually within a few minutes, so you can close this.`)), u.push(U);
      }
    }
    u.push(qt("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const w = qt("button", "quiet ppp-connect__cancel", "Close");
    w.type = "button", w.onclick = () => t == null ? void 0 : t.close(), u.push(w), t.replaceChildren(...u);
  }
  return {
    isOpen: () => !!t,
    open() {
      if (t || !e.input()) return;
      t = qt("dialog", "ppp-connect ppp-restock"), t.setAttribute("aria-labelledby", "ppp-restock-title");
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
const Or = (e) => e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), vC = (e) => !e || /^(?:Inscription )?#\d+$/.test(e.trim());
function AC(e, t) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(e) ? e : []) {
    const o = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(o) || o < 0 || n.has(o)) continue;
    n.add(o);
    const i = t(o, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: o, title: vC(i.title) ? `#${o}` : i.title.trim(), artist: (i.artist || "").trim() });
  }
  return r.sort((s, o) => s.id - o.id);
}
function EC(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    if (!n.artist) continue;
    const r = Or(n.artist), s = t.get(r);
    s ? s.songs++ : t.set(r, { name: n.artist, songs: 1 });
  }
  return [...t.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function kC(e, t, n = "", r = 60) {
  const s = Or(t).split(/\s+/).filter(Boolean), o = Or(n);
  if (!s.length && !o) return { songs: [], total: 0 };
  const i = [];
  for (const a of e) {
    const c = Or(a.artist), u = Or(a.title), h = String(a.id);
    if (o && c !== o) continue;
    let d = 0, w = !0;
    for (const y of s) {
      const v = y.replace(/^#/, "");
      if (u.includes(y)) d += u.startsWith(y) ? 0 : 1;
      else if (/^\d+$/.test(v) && h === v) d += 0;
      else if (c.includes(y)) d += 2;
      else if (/^\d+$/.test(v) && h.startsWith(v)) d += 3;
      else {
        w = !1;
        break;
      }
    }
    w && i.push({ s: a, rank: d });
  }
  return i.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: i.slice(0, r).map((a) => a.s), total: i.length };
}
const sr = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, oy = 12, $C = 14, sy = (e) => [...e.trim()].length <= $C;
function IC(e, t) {
  let n = null, r = "idle", s = "", o = "", i = !1;
  const a = sr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = sr("div", "hint"), u = sr("div", "find-artists" + (t.grid ? " find-artists--grid" : "")), h = sr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const d = sr("div", "likesTools");
  d.append(a), e.replaceChildren(d, c, u, h), a.oninput = () => {
    s = a.value, y();
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
    if (a.disabled = v, v) {
      if (c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", t.leaveAlbum) {
        const T = sr("button", "find-back", "Back to My player");
        T.type = "button", T.onclick = () => t.leaveAlbum(), c.append(" ", T);
      }
      u.replaceChildren(), h.replaceChildren();
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
      const T = sr("button", "", "Try again");
      T.type = "button", T.onclick = () => {
        r = "idle", w();
      }, c.append(T), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const x = EC(n), L = (T, B, Y, ee = "", oe = "") => {
      const W = sr("button", "find-chip" + (oe ? " " + oe : "") + (B ? " is-on" : ""), T);
      return W.type = "button", W.setAttribute("aria-pressed", String(B)), ee && (W.title = ee), W.onclick = Y, W;
    }, U = (T, B, Y = "") => L(B, Or(T.name) === Or(o), () => {
      o = Or(T.name) === Or(o) ? "" : T.name, y();
    }, `Show ${T.name}’s ${T.songs === 1 ? "song" : `${T.songs} songs`}`, Y);
    if (t.grid) {
      const T = x.filter((ee) => sy(ee.name)), B = x.filter((ee) => !sy(ee.name)), Y = i ? B : B.filter((ee) => Or(ee.name) === Or(o));
      u.replaceChildren(
        ...T.map((ee) => U(ee, ee.name)),
        ...B.length ? [L(i ? "Fewer artists" : `${B.length} more ${B.length === 1 ? "artist" : "artists"}`, !1, () => {
          i = !i, y();
        }, "", "find-more")] : [],
        ...Y.map((ee) => U(ee, `${ee.name} · ${ee.songs}`, "find-chip--long"))
      );
    } else {
      const T = i ? x : x.slice(0, oy);
      u.replaceChildren(
        ...T.map((B) => U(B, `${B.name} · ${B.songs}`)),
        ...x.length > oy ? [L(i ? "Fewer artists" : `All ${x.length} artists`, !1, () => {
          i = !i, y();
        })] : []
      );
    }
    const _ = kC(n, s, o), A = t.current();
    h.replaceChildren(..._.songs.map((T) => {
      var ee, oe;
      const B = sr("li", "lrow" + (T.id === A ? " now" : "")), Y = sr("button", "lt", T.title);
      if (Y.type = "button", Y.title = `Play “${T.title}”${T.artist ? ` by ${T.artist}` : ""}`, Y.onclick = () => t.play(T.id), (ee = t.explicit) != null && ee.call(t, T.id)) {
        const W = sr("span", "exp", "E");
        W.title = "Explicit lyrics: only plays when you choose it", Y.append(" ", W);
      }
      if ((oe = t.liked) != null && oe.call(t, T.id)) {
        const W = sr("span", "find-liked", "♥");
        W.title = "You like this song", W.setAttribute("role", "img"), W.setAttribute("aria-label", "Liked"), B.append(Y, W);
      } else B.append(Y);
      return B.append(sr("span", "find-by", `${T.artist ? T.artist + " · " : ""}#${T.id}`)), B;
    })), c.textContent = !s.trim() && !o ? `${n.length.toLocaleString()} songs by ${x.length.toLocaleString()} artists. Search, or pick an artist.` : _.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : _.total > _.songs.length ? `Showing ${_.songs.length} of ${_.total.toLocaleString()}. Type more to narrow it down.` : `${_.total} ${_.total === 1 ? "song" : "songs"}${o ? ` by ${o}` : ""}. Tap one to play it.`;
  }
  return { load: w, refresh: y };
}
const iy = (e, t, n) => Mf(Uf(new TextEncoder().encode(`xtrata-music-hero:${e}:${t}:${n}`))).slice(0, 8), LC = 317, CC = (e) => typeof e == "number" && Number.isSafeInteger(e) && e >= 1 && e <= 999999999, TC = 15 * 6e4, BC = (e) => /iPhone|iPad|iPod/.test(e.userAgent) || /Macintosh/.test(e.userAgent) && e.maxTouchPoints > 1;
function cd(e, t) {
  return e.standalone ? null : t ? "prompt" : BC(e) ? "ios" : null;
}
const Gi = {
  label: "Add to Home Screen",
  title: "Add it to your Home Screen",
  body: "Your phone only lets you do this from its own menu. It takes a few taps:",
  close: "Got it"
};
function NC(e) {
  var n;
  return /CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/.test(e) ? "other" : Number(((n = /Version\/(\d+)/.exec(e)) == null ? void 0 : n[1]) ?? 0) >= 26 ? "safari-dots" : "safari";
}
function MC(e) {
  return e === "safari-dots" ? { steps: ["Tap ••• at the bottom right of your screen", "Tap Share", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom-right" } : e === "safari" ? { steps: ["Tap the Share button at the bottom of your screen (a square with an arrow)", "Scroll down and tap “Add to Home Screen”", "Tap Add"], where: "bottom" } : { steps: ["Tap the Share button beside the address bar (a square with an arrow)", "Tap “Add to Home Screen”", "Tap Add"], where: "top-right" };
}
const ir = (e, t = "", n = "") => {
  const r = document.createElement(e);
  return t && (r.className = t), n && (r.textContent = n), r;
}, PC = (e) => {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("viewBox", "0 0 26 26"), t.setAttribute("aria-hidden", "true");
  const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return n.setAttribute("d", e), t.append(n), t;
};
function _C(e, t, n = "safari") {
  const r = MC(n), s = ir("div", "a2hs-sheet a2hs-sheet--" + r.where);
  s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.setAttribute("aria-label", Gi.title);
  const o = ir("div", "a2hs-card"), i = ir("div", "a2hs-head"), a = ir("img", "a2hs-icon");
  a.src = e, a.alt = "";
  const c = ir("div");
  c.append(ir("h2", "", Gi.title), ir("p", "", Gi.body)), i.append(a, c);
  const u = ir("ol", "a2hs-steps");
  r.steps.forEach((w, y) => {
    const v = ir("li");
    v.append(ir("i", "", String(y + 1)), ir("span", "", w)), u.append(v);
  });
  const h = ir("div", "a2hs-arrow");
  h.setAttribute("aria-hidden", "true"), h.append(PC(r.where === "top-right" ? "M13 22V5M6 12l7-7 7 7" : "M13 4v17M6 14l7 7 7-7"));
  const d = ir("button", "a2hs-close", Gi.close);
  return d.type = "button", d.onclick = t, o.append(i, u, d), s.append(o, h), s.onclick = (w) => {
    w.target === s && t();
  }, s;
}
function UC(e) {
  let t = null, n = null, r = !1;
  const s = () => {
    n == null || n.remove(), n = null, e.button.focus();
  }, o = () => {
    const i = r ? null : cd(e.env(), !!t);
    e.button.hidden = !i, e.button.dataset.kind = i ?? "";
  };
  return e.button.setAttribute("aria-label", Gi.label), e.button.title = Gi.label, e.button.onclick = () => {
    var a;
    const i = cd(e.env(), !!t);
    if (i === "prompt" && t) {
      const c = t;
      t = null;
      try {
        c.prompt();
      } catch {
      }
      o();
      return;
    }
    i === "ios" && !n && (n = _C(e.icon, s, NC(e.env().userAgent)), e.mount.append(n), (a = n.querySelector(".a2hs-close")) == null || a.focus());
  }, e.target.addEventListener("beforeinstallprompt", (i) => {
    i.preventDefault(), t = i, o();
  }), e.target.addEventListener("appinstalled", () => {
    r = !0, t = null, s(), o();
  }), o(), { sync: o, kind: () => r ? null : cd(e.env(), !!t) };
}
const ay = document.getElementById("ppp");
ay && OC(ay);
function OC(e) {
  var Sa;
  const t = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = A1(), s = (l) => e.querySelector(l), o = s(".ppp-frame");
  let i = null;
  const a = async (l, p) => {
    const g = await fetch(l, { cache: "no-store", ...p, signal: AbortSignal.timeout(15e3) }), f = await g.json().catch(() => ({}));
    if (!g.ok) throw new Error((f == null ? void 0 : f.error) || `Request failed (${g.status}).`);
    return f;
  }, c = tI({
    now: Date.now,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    config: (l) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(l || "")),
    links: async (l) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(l))).links ?? [],
    mainOf: async (l) => {
      var g;
      const p = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(l))).links;
      return ((g = p == null ? void 0 : p.find((f) => f.listening === l)) == null ? void 0 : g.main) ?? null;
    },
    saveLink: async (l) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(l) });
    },
    bridge: async (l) => {
      i = document.createElement("iframe"), i.title = "Xtrata listening wallet", i.setAttribute("allow", `publickey-credentials-get ${l}; publickey-credentials-create ${l}`), i.referrerPolicy = "no-referrer";
      const p = new Promise((ae, Ae) => {
        i.addEventListener("load", () => ae(), { once: !0 }), setTimeout(() => Ae(new Error("The listening wallet did not load.")), 15e3);
      });
      i.src = l + "/", o.replaceChildren(i), await p;
      const g = new p1({ walletOrigin: l, frame: i, timeoutMs: 30 * 6e4 }), f = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.backup", "listening.signAward", "listening.approveSession", "listening.prepareReturn"]), R = (ae, Ae) => f.has(ae) ? g.request(ae, Ae) : Promise.race([
        g.request(ae, Ae),
        new Promise((Ee, Ue) => setTimeout(() => Ue(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await R("listening.status"), { request: R };
    },
    chain: {
      verify: P5,
      balance: U5,
      account: _5,
      owner: O5,
      broadcast: H5,
      transaction: D5,
      confirmedNonce: async (l) => {
        const p = await Ss(`/v2/accounts/${l}?proof=0`);
        if (!Number.isSafeInteger(p == null ? void 0 : p.nonce) || p.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(p.nonce);
      }
    },
    signWithMain: (l, p) => Yu({ ...p, network: "mainnet", stxAddress: l }),
    deposit: (l, p, g) => new Promise((f, R) => wg({
      recipient: p,
      amount: g.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: l,
      network: new ld(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ae) => f(ae.txId || ""),
      onCancel: () => R(new Error("Deposit cancelled. Nothing was sent.")),
      onError: R
    })),
    validate: F5,
    tabLock: (l) => new Promise((p) => {
      const g = navigator.locks;
      if (!(g != null && g.request)) {
        p(!0);
        return;
      }
      g.request("xtrata-ppp:" + l, { ifAvailable: !0 }, async (f) => {
        p(!!f), f && await new Promise(() => {
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
      set: (l, p) => {
        try {
          localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    changed: () => X(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (l) => {
      var p, g;
      return v.funder(l, () => V5(l, Ss), !!((g = (p = c.snapshot().gate) == null ? void 0 : p.gifts) != null && g.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (l) => {
      const p = await a("/radio/gift/for?wallet=" + encodeURIComponent(l)), g = p == null ? void 0 : p.gift;
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
    awardStatus: async (l) => {
      const p = await a("/radio/awards/status?address=" + encodeURIComponent(l));
      if (typeof (p == null ? void 0 : p.state) != "string") throw new Error("Unreadable award status.");
      return p;
    },
    awardName: async (l) => {
      const p = await a("/radio/awards/name?address=" + encodeURIComponent(l));
      if ((p == null ? void 0 : p.name) !== null && typeof (p == null ? void 0 : p.name) != "string") throw new Error("Unreadable name.");
      return p.name;
    },
    awardNote: async (l, p) => {
      const g = await a("/radio/awards/note", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ address: l, name: p }) });
      if (typeof (g == null ? void 0 : g.record) != "string" || typeof (g == null ? void 0 : g.signature) != "string" || !Number.isSafeInteger(g == null ? void 0 : g.cls) || !Number.isSafeInteger(g == null ? void 0 : g.number) || !Number.isSafeInteger(g == null ? void 0 : g.plays)) throw new Error("Unreadable award note.");
      return { cls: g.cls, number: g.number, plays: g.plays, record: g.record, signature: g.signature, name: typeof g.name == "string" ? g.name : null };
    },
    history: (l, p) => q5(l, (g) => Ss(g), p),
    likesChanged: () => {
      var l, p;
      (p = (l = window.XtrataRadio) == null ? void 0 : l.refreshLikes) == null || p.call(l);
    },
    likeState: async (l, p) => {
      const g = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: l, ids: String(p) })), f = Array.isArray(g == null ? void 0 : g.rows) ? g.rows.find((R) => (R == null ? void 0 : R.id) === p) : null;
      if (!f || typeof f.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: f.liked, by: Array.isArray(f.by) ? f.by.filter((R) => typeof R == "string") : f.liked ? [l] : [] };
    },
    likeSent: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: l, liked: p } })),
    nameOf: (l) => ut(l) ?? void 0,
    likeConfirmed: (l, p) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: l, liked: p } })),
    likeFailed: (l) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: l } }))
  }), u = (l, p, g, f, R, ae) => new Promise((Ae, Ee) => wg({
    recipient: f,
    amount: R.toString(),
    memo: ae,
    stxAddress: g,
    network: new ld(),
    appDetails: { name: l, icon: "/favicon.svg" },
    onFinish: (Ue) => Ae(Ue.txId || ""),
    onCancel: () => Ee(new Error(p)),
    onError: Ee
  })), h = (l) => v.incomingStarter() && l.canAnother && l.hadGift === !1 && !l.main && l.listening && !l.createdHere && !l.brandNew && ["locked", "ready", "fund", "over", "link"].includes(l.step) && !l.busy ? () => void c.create({ quick: !0, another: !0 }) : null, d = (l) => h(l) && l.canForget ? () => {
    w.start(l), X(c.snapshot());
  } : null, w = JL({
    json: a,
    unlock: () => void c.unlock(),
    returnAll: () => void c.returnFunds("all"),
    forget: () => c.forget(),
    backup: () => void c.backup(),
    keepBoth: (l) => h(l),
    who: (l) => Ye(l),
    changed: () => X(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    dust: (l) => {
      var p;
      return BigInt(((p = l.gate) == null ? void 0 : p.limits.returnFee) ?? "3000");
    }
  }), y = () => ({ quick: !!v.incomingStarter(), ...w.claiming() ? { another: !0 } : {} }), v = cL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    pay: (l, p, g, f) => u("Xtrata Radio · gift", "Gift cancelled. Nothing was sent.", l, p, g, f),
    sign: (l, p) => Yu({ ...p, network: "mainnet", stxAddress: l }),
    giftSent: (l, p) => c.giftSent(l, p),
    claiming: (l) => c.giftClaiming(l),
    batchDays: () => {
      var l, p;
      return (p = (l = c.snapshot().gate) == null ? void 0 : l.gifts) == null ? void 0 : p.batchDays;
    },
    claimNew: (l) => h(l),
    replaceOld: (l) => d(l),
    album: { bind: (l) => c.bindAlbum(l), arrived: async (l, p, g, f) => {
      _.invalidate(), await c.albumArriving(l, p, g, f);
    } },
    who: (l) => Ye(l),
    changed: () => X(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now
  }), x = (l) => {
    Promise.resolve(c.openAlbum(l)).then(() => {
      if (!Le()) return;
      const p = c.snapshot();
      window.dispatchEvent(new CustomEvent(p.slot === l && !p.error ? "xtrata:radio-listen" : "xtrata:radio-panel"));
    });
  };
  let L;
  const U = (l) => {
    l !== L && (L = l, window.dispatchEvent(new CustomEvent("xtrata:radio-albums", { detail: { has: l } })));
  }, _ = mL({
    json: a,
    open: x,
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => X(c.snapshot())
  }), A = {
    get: (l) => {
      try {
        return localStorage.getItem(l);
      } catch {
        return null;
      }
    },
    set: (l, p) => {
      try {
        p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
      } catch {
      }
    }
  }, T = oC(location.search, A);
  T.on && (document.documentElement.dataset.novice = T.preview ? "preview" : "1");
  const B = (l) => T.on && l.solo, Y = T.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), ee = Y ? document.getElementById("album") : null, oe = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (l) => void c.topUpAlbum(l),
    openPlayer: () => void c.openAlbum(0)
  }, W = ee ? Zg(ee, oe) : null, m = ZL({
    json: a,
    main: () => {
      const l = r.load();
      return l.isConnected && l.network === "mainnet" ? l.address : void 0;
    },
    sign: (l, p) => Yu({ ...p, network: "mainnet", stxAddress: l }),
    signShelf: (l, p) => c.signShelf(l, p),
    pay: (l, p, g, f) => u("Xtrata Music · album", "Payment cancelled. Nothing was sent.", l, p, g, f),
    copies: (l, p) => {
      var g;
      return v.copies(l, p, ((g = c.snapshot().gate) == null ? void 0 : g.radioUrl) ?? null);
    },
    player: () => {
      const l = c.snapshot(), p = l.slot === 0 ? l.listening : l.root;
      return { address: p, unlocked: !!p && ["ready", "fund", "over", "link"].includes(l.step) };
    },
    open: (l) => Dt(l, !0),
    who: (l) => Ye(l),
    art: { song: (l, p) => p && Oh(String(l)) || Xg(String(l)), cover: (l) => il(l) },
    audition: OL({
      changed: () => X(c.snapshot()),
      quiet: () => {
        var p;
        const l = window.XtrataRadio;
        try {
          (p = l == null ? void 0 : l.getState) != null && p.call(l).playing && l.playPause();
        } catch {
        }
      }
    }),
    changed: () => X(c.snapshot()),
    store: {
      get: (l) => {
        try {
          return localStorage.getItem(l);
        } catch {
          return null;
        }
      },
      set: (l, p) => {
        try {
          p === null ? localStorage.removeItem(l) : localStorage.setItem(l, p);
        } catch {
        }
      }
    },
    now: () => Date.now()
  }), C = () => {
    const l = new Set(gn.map((p) => p.id));
    return [...gn, ...m.albums().filter((p) => !l.has(p.id))];
  }, P = ee ? RL(ee) : null, M = "xtrata.radio.award.later.v1";
  let Z = "ready", F = !1, ge = (() => {
    try {
      return Date.now() - Number(localStorage.getItem(M) || 0) < 24 * 36e5;
    } catch {
      return !1;
    }
  })(), ce = !1;
  const Ge = "xtrata.radio.tier.v1";
  let $ = (() => {
    const l = A.get(Ge);
    return Vc(l) ? Ds(l) : null;
  })();
  const j = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function ue(l) {
    var R;
    if (l.listening && l.slot === 0 && ["fund", "ready", "over"].includes(l.step) && !(l.gift && l.gift.drop === void 0)) {
      let ae = null;
      try {
        ae = l.gift && !l.gift.player && l.gift.drop === "players" ? eL(BigInt(l.gift.amount)) : null;
      } catch {
        ae = null;
      }
      ((R = l.award) == null ? void 0 : R.state) === "claimed" && l.award.holds === !1 && (ae = null), ((ae == null ? void 0 : ae.id) ?? null) !== (($ == null ? void 0 : $.id) ?? null) && ($ = ae, A.set(Ge, ae ? ae.id : null));
    }
    const p = document.documentElement;
    $ ? p.dataset.tier = $.id : delete p.dataset.tier;
    const g = document.querySelector("#ppp .ppp-head h3");
    if (!g) return;
    let f = g.querySelector(".ppp-tier");
    if (!$) {
      f == null || f.remove();
      return;
    }
    f || (f = I("span", "", "ppp-tier"), g.append(f)), f.dataset.tier = $.id, f.textContent = `${$.mark} ${$.name.toUpperCase()} PLAYER`, f.title = `A ${$.name} player from the Xtrata Music giveaway`;
  }
  const me = (() => {
    var l;
    try {
      return !!((l = window.matchMedia) != null && l.call(window, "(display-mode: standalone)").matches) || navigator.standalone === !0;
    } catch {
      return !1;
    }
  })(), Ne = document.getElementById("a2hs");
  Ne && UC({
    button: Ne,
    icon: "/radio/icons/app-192.png",
    mount: document.body,
    target: window,
    env: () => ({ userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, standalone: me })
  });
  let xe = T.on ? LC : null, wt = !1, Fe = 0, Be = "";
  T.on && a("/radio/giveaway/players/intro").then((l) => {
    const p = l && l.song === null ? null : CC(l == null ? void 0 : l.song) ? l.song : xe;
    p !== xe && !wt && (xe = p, X(c.snapshot()));
  }).catch(() => {
  });
  const Me = (() => {
    try {
      const l = Number(new URLSearchParams(location.search).get("n"));
      Number.isSafeInteger(l) && l >= 1 && l <= 1e5 && sessionStorage.setItem("xtrata.radio.spot", String(l));
      const p = Number(sessionStorage.getItem("xtrata.radio.spot"));
      return Number.isSafeInteger(p) && p >= 1 ? p : null;
    } catch {
      return null;
    }
  })(), Bn = (l) => {
    var f, R, ae;
    if (!wt || xe === null) return !1;
    if (Date.now() - Fe > TC || l.step === "ready")
      return l.step !== "ready" && (wt = !1), !1;
    const p = (R = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : R.call(f), g = Number((ae = p == null ? void 0 : p.nowPlaying) == null ? void 0 : ae.tokenId);
    return Date.now() - Fe < 2e4 && !Number.isSafeInteger(g) ? !0 : g !== xe ? (wt = !1, !1) : !0;
  };
  function An() {
    const l = window.XtrataRadio;
    if (!(xe === null || !(l != null && l.playToken))) {
      wt = !0, Fe = Date.now(), c.holdFirstPlay(), X(c.snapshot());
      try {
        l.playToken(xe);
      } catch {
        wt = !1;
      }
    }
  }
  const ft = () => {
    var f, R;
    if (!wt || xe === null) return null;
    const l = (R = (f = window.XtrataRadio) == null ? void 0 : f.getState) == null ? void 0 : R.call(f), p = l != null && l.nowPlaying && Number(l.nowPlaying.tokenId) === xe ? l.nowPlaying : null, g = Ei.get(xe);
    return { title: (p == null ? void 0 : p.title) || (g == null ? void 0 : g.title) || "", artist: (p == null ? void 0 : p.artist) || (g == null ? void 0 : g.artist) || "", art: `/radio/artwork?id=${xe}`, playing: !!(l != null && l.playing) };
  }, Ct = T.on && ee ? IL(ee) : null, Mt = Date.now();
  let G = !1, O = null, te = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const re = () => {
    te = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    X(c.snapshot());
  }, le = (l, p) => {
    var ae;
    if (!Ct || p || te) return null;
    if (!l.gate || l.step === "loading" || (G = !0), !G) return Date.now() - Mt < 1e4 ? "checking" : null;
    if (!B(l) || w.active() && l.step !== "intro") return null;
    if (l.step === "intro" || l.step === "unsupported") return v.incomingStarter() ? "gift" : "new";
    if (l.step === "locked") return "back";
    const f = l.slot === 0 && !((ae = l.gift) != null && ae.player), R = f && !l.entries.some((Ae) => Ae.kind === "play");
    return l.step === "fund" && R ? l.depositPending ? "arriving" : "empty" : l.step === "ready" && f && (O === "landed" || O === "arriving" && (R || wt)) ? "landed" : l.step === "loading" && O !== "checking" ? O : null;
  };
  let bt = !1;
  function Oe(l, p, g = [], f) {
    if (!Ct) return;
    const R = f !== void 0 ? f : le(l, p);
    if (O = R, delete document.documentElement.dataset.noviceBoot, !R) {
      Ct.render(null, p);
      return;
    }
    const ae = [...g];
    R === "arriving" && l.arrival && ae.push(So(l.arrival)), l.step === "unsupported" ? ae.push(I("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : l.error && ae.push(I("p", l.error, "ppp-warn"));
    const Ae = R === "gift" ? v.incomingStarter() : null;
    Ae && xe === null && !bt && l.step === "intro" && !l.busy && !l.armed && !l.error && !zt && (bt = !0, c.create({ quick: !0, ...w.claiming() ? { another: !0 } : {} })), Ct.render({
      mode: R,
      status: ae,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      canStart: (l.step === "intro" || l.step === "locked") && !zt,
      plays: Ae ? Ae.plays : R === "landed" ? l.playsLeft : null,
      from: (Ae == null ? void 0 : Ae.from) ?? null,
      tier: $,
      mystery: j,
      spot: Me,
      installed: me,
      intro: Ae && xe !== null && l.step === "intro" ? { ready: !0 } : null,
      now: ft(),
      albums: R === "landed" ? gn.map((Ee) => ({ title: Ee.title, by: Ee.subtitle, cover: il(Ee.cover), run: () => {
        re(), Dt(Ee, !0);
      } })) : [],
      claimNew: R === "back" ? h(l) : null,
      replaceOld: R === "back" ? d(l) : null,
      start: () => {
        Ae && xe !== null && An(), c.create(y());
      },
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => He(),
      full: () => {
        var _t, gt, ot;
        const Ee = window.XtrataRadio, Ue = R === "landed" && !((gt = (_t = Ee == null ? void 0 : Ee.getState) == null ? void 0 : _t.call(Ee)) != null && gt.playing);
        wt = !1, re(), Ue && ((ot = Ee == null ? void 0 : Ee.playPause) == null || ot.call(Ee));
      }
    });
  }
  Ct && setTimeout(() => {
    G || X(c.snapshot());
  }, 10100), Ph(() => {
    (Ct != null && Ct.showing() || document.documentElement.dataset.asking || m.wantsArt()) && X(c.snapshot());
  });
  const At = SC({
    input: () => {
      var R, ae, Ae, Ee;
      const l = c.snapshot();
      if (!["fund", "ready", "over"].includes(l.step)) return null;
      const p = l.slot === 0 ? { address: l.listening, balance: l.balance } : { address: l.root, balance: (R = l.likeFunds) == null ? void 0 : R.balance };
      if (!p.address) return null;
      const g = l.slot === 0 ? l.entries : [], f = g.filter((Ue) => Ue.kind === "play" && Ue.status === "confirmed");
      return {
        playsLeft: p.balance === void 0 ? null : $t(p.balance),
        balance: p.balance,
        incoming: 0n,
        fee: BigInt(((ae = l.gate) == null ? void 0 : ae.limits.playFee) ?? "300"),
        address: p.address,
        switches: ((Ae = l.gate) == null ? void 0 : Ae.restock) ?? {},
        backedUp: l.backedUp,
        done: f.length ? { plays: f.length, artists: new Set(f.map((Ue) => Ue.recipient)).size, likes: g.filter((Ue) => Ue.kind === "like" && Ue.status === "confirmed" && Ue.liked).length } : null,
        arriving: l.slot === 0 ? l.depositPending : !!((Ee = l.likeFunds) != null && Ee.pending)
      };
    },
    copyButton: (l, p, g, f) => ur(l, p, g, f, () => {
      X(c.snapshot());
    })
  }), He = () => {
    if (!c.snapshot().unproven) {
      At.open();
      return;
    }
    c.prove().then((l) => {
      l && At.open();
    });
  }, $e = document.getElementById("albumList"), Ve = $e ? Zg($e, oe, { list: !0 }) : null, Ke = "xtrata.radio.album.last.v1", Xe = () => {
    try {
      const l = JSON.parse(localStorage.getItem(Ke) || "null");
      return l && typeof l.root == "string" && Number.isSafeInteger(l.slot) && l.slot > 0 && l.player && Array.isArray(l.player.tracks) ? l : null;
    } catch {
      return null;
    }
  };
  let Kt = "";
  const pn = (l) => {
    const p = JSON.stringify(l);
    if (p !== Kt) {
      Kt = p;
      try {
        localStorage.setItem(Ke, p);
      } catch {
      }
    }
  };
  let dn = null;
  window.XtrataRadioLikeHandler = (l) => {
    var g;
    if (!l || !Number.isSafeInteger(l.song) || l.song < 0) return !1;
    (g = c.snapshot().likeFunds) != null && g.album && (Q = !0), Yr();
    const p = wo(l.song, { title: l.title, artist: l.artist });
    return c.heart({ song: l.song, title: p.title || void 0, artist: p.artist || void 0, likedBy: Array.isArray(l.likedBy) ? l.likedBy : void 0 });
  };
  let Vn;
  window.XtrataRadioListeningIdentity = () => {
    const l = c.snapshot();
    return l.solo && l.step !== "off" && l.step !== "elsewhere" ? l.listening : void 0;
  };
  const Pt = (l) => {
    var g, f;
    const p = window.XtrataRadioListeningIdentity();
    p !== Vn && (Vn = p, (f = (g = window.XtrataRadio) == null ? void 0 : g.refreshLikes) == null || f.call(g));
  };
  let gn = [], yr = 0, Vr = !1, Dn = null;
  const wr = (l) => {
    var p, g;
    Vr || !((g = (p = l.gate) == null ? void 0 : p.gifts) != null && g.enabled) || Date.now() - yr < 6e4 || (yr = Date.now(), a("/radio/gift/featured").then((f) => {
      gn = (Array.isArray(f == null ? void 0 : f.players) ? f.players : []).filter((R) => R && typeof R.id == "string" && typeof R.title == "string" && Array.isArray(R.tracks) && R.tracks.length > 0).slice(0, 6), Vr = !0, gn.length && X(c.snapshot());
    }).catch(() => {
    }));
  }, yn = (l) => {
    var p;
    return Dn && l.slot === 0 && !((p = l.gift) != null && p.player) && ["ready", "fund", "loading"].includes(l.step) ? Dn : null;
  }, Dt = (l, p = !1) => {
    var f, R;
    Dn = l, X(c.snapshot());
    const g = l && p ? Rr(l)[0] : null;
    g && ((R = (f = window.XtrataRadio) == null ? void 0 : f.playToken) == null || R.call(f, g.id));
  };
  let dt = mf(), Lt = null;
  const ln = (l) => {
    const p = T.preview && !zt && l.step === "intro" ? v.incomingAlbum() : null;
    return p ? (dt = ad(dt, { kind: "offer", album: p.player.id, already: qb(A).includes(p.player.id) }), Wc(dt) ? p.player : null) : (dt = ad(dt, { kind: "withdraw" }), null);
  }, Lr = (l) => {
    const p = dt.phase;
    dt = ad(dt, l), dt.phase !== p && (dt.album && (dt.phase === "playing" || dt.phase === "done") && fC(A, dt.album), X(c.snapshot()));
  };
  setInterval(() => {
    dt.phase === "playing" && Lr({ kind: "tick", at: Date.now() });
  }, 5e3);
  let yo = "", E, H = !1, V = !1;
  const D = (l, p) => {
    var qe, je, Ut, Yn, tr, jo, Ao, ki;
    const g = window.XtrataRadio;
    if (!(g != null && g.setGiftPlayer) || !(g != null && g.setGiftStop)) return;
    const f = p.depositPending && l.step === "fund" && ((qe = l.giftStop) == null ? void 0 : qe.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : l.giftStop, R = Lt, ae = Bn(l), Ae = f ? B(l) ? cC(f.reason, f.text) : f.text : null, Ee = R || ae ? null : Ae ?? (t && (!((je = l.gate) != null && je.here) || l.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    Ee && Ee !== E && (g.setGiftStop(Ee), E = Ee);
    const Ue = l.step === "off" || l.step === "elsewhere" ? null : ((Ut = l.gift) == null ? void 0 : Ut.player) ?? R ?? yn(l) ?? null, _t = Ue ? Ue.id + ":" + Ue.cover + ":" + Ue.tracks.map((Fn) => Fn.id).join(",") : "";
    _t !== yo && (g.setGiftPlayer(Ue ? { id: Ue.id, title: Ue.title, subtitle: Ue.subtitle, tracks: Rr(Ue).map((Fn) => Fn.id), hidden: ((Yn = JI(Ue)) == null ? void 0 : Yn.id) ?? null, cover: Ue.cover } : null), yo = _t), Ee !== E && (g.setGiftStop(Ee), E = Ee);
    const gt = !ae && (f == null ? void 0 : f.reason) === "arriving";
    gt !== V && ((tr = g.setGiftWait) == null || tr.call(g, gt), V = gt);
    const ot = !!Ue && (!!R || !!((jo = l.albumLock) != null && jo.locked));
    ot !== H && ((Ao = g.setGiftLock) == null || Ao.call(g, ot), H = ot), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(l.step) && ((ki = g.forgetWallets) == null || ki.call(g));
  };
  let Q = !1;
  const ne = /* @__PURE__ */ new Map(), Ce = (l) => {
    if (!(l.step === "fund" && !l.depositPending && !!l.gift && !!l.listening && l.balance === 0n && !l.entries.some((f) => f.kind === "play") && (l.brandNew || l.createdHere))) return null;
    let g = ne.get(l.listening);
    return g === void 0 && (g = Date.now(), ne.set(l.listening, g)), Date.now() - g < Pl ? g : null;
  }, Se = (l) => l.step === "fund" && !l.depositPending && !!l.gift && l.balance === 0n && !l.entries.some((p) => p.kind === "play") && !!l.listening && ne.has(l.listening), Pe = (l) => l ? l.slice(0, 6) + "…" + l.slice(-4) : "", $t = (l) => {
    const p = c.snapshot().playCost || 350n;
    return l > sn ? Number((l - sn) / p) : 0;
  }, Ze = (l) => (Number(l) / 1e6).toFixed(l < 1000n ? 6 : 4), ht = (l) => {
    const p = Math.round((Date.now() - l) / 6e4);
    return p < 1 ? "now" : p < 60 ? `${p}m` : p < 1440 ? `${Math.round(p / 60)}h` : `${Math.round(p / 1440)}d`;
  }, at = (l) => `https://explorer.hiro.so/txid/${l}?chain=mainnet`, I = (l, p = "", g = "") => {
    const f = document.createElement(l);
    return p && (f.textContent = p), g && (f.className = g), f;
  }, ve = (l, p, g = "") => {
    const f = I("button", l, g);
    return f.type = "button", f.onclick = p, f;
  }, pt = (l, p) => {
    const g = I("a", l);
    return g.href = p, g.target = "_blank", g.rel = "noopener", g;
  };
  let un = null, xt = location.hash === "#give";
  xt && history.replaceState(null, "", location.pathname + location.search);
  let mr = !1;
  const Xr = HI((l) => OI({ address: l, network: "mainnet" }), () => X(c.snapshot())), ut = (l) => Xr.get(l), zt = eC(navigator.userAgent), gi = (l, p) => {
    const g = navigator.userAgent, f = nC(g), R = `${location.origin}${location.pathname}${p ? `#gift=${p}` : ""}`, ae = [I("p", `You are in ${l}'s built-in browser, where passkeys often do not work. Open this page in ${f} to make your ${T.on ? "player" : "listening wallet"}${p ? T.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], Ae = I("div", "", "ppp-open-row"), Ee = tC(R, g);
    if (Ee) {
      const Ue = I("a", `Open in ${f}`, "primary ppp-open-in");
      Ue.href = Ee, Ue.dataset.homeAction = "radio:open-in-browser", Ae.append(Ue);
    }
    return Ae.append(ur("copy-page-link", "Copy link", () => R, Ee ? "" : "primary", () => X(c.snapshot()))), ae.push(Ae, I("p", `If that does not open ${f}, use ${l}'s menu (••• or ⋮) and choose "Open in ${f === "your browser" ? "browser" : f}", or paste the copied link there.`, "ppp-mute")), ae;
  }, Ye = (l) => ut(l) ?? Pe(l), ks = (l) => l.slice(0, 2).map(Ye).join(" and ") + (l.length > 2 ? ` and ${l.length - 2} more` : ""), br = /* @__PURE__ */ new Map();
  let Nn = !1;
  const Mn = (l) => !l || /^(?:Inscription )?#\d+$/.test(l.trim()), Yr = () => {
    Nn || (Nn = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : null).then((l) => {
      for (const p of Array.isArray(l == null ? void 0 : l.tracks) ? l.tracks : []) {
        const g = Number(p == null ? void 0 : p.id);
        Number.isSafeInteger(g) && br.set(g, { title: typeof p.title == "string" ? p.title : void 0, artist: typeof p.artist == "string" ? p.artist : void 0 });
      }
      X(c.snapshot());
    }).catch(() => {
      Nn = !1;
    }));
  }, wo = (l, p) => {
    const g = br.get(l), f = _g(l, [g == null ? void 0 : g.title, p == null ? void 0 : p.title].find((ae) => !Mn(ae)) || ""), R = Mg(l, (g == null ? void 0 : g.artist) || (p == null ? void 0 : p.artist) || "");
    return { title: f, artist: R };
  }, mo = (l) => {
    const { title: p, artist: g } = wo(l.song, l);
    return p ? `“${p}”${g ? ` — ${g}` : ""}` : `Song #${l.song}${g ? ` — ${g}` : ""}`;
  }, bo = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ma = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function $s(l) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(l.step) ? ["", ""] : l.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : l.step === "over" ? ["TOO MUCH", "bad"] : l.step === "locked" ? ["LOCKED", "mute"] : l.step === "intro" || l.step === "link" ? ["", ""] : l.step === "fund" ? l.depositPending ? ["ON ITS WAY", "warn"] : l.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : l.payingOn && l.session && l.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Qn(l, p, g = "", f) {
    const R = I("dt", l), ae = I("dd", p, g);
    return f && ae.append(" ", f), [R, ae];
  }
  const nn = document.getElementById("ppp-top"), Is = () => {
    window.dispatchEvent(new CustomEvent("xtrata:radio-panel")), (o.hidden || o.classList.contains("ppp-frame--rest") ? e : o).scrollIntoView({ behavior: "smooth", block: "center" }), e.classList.remove("ppp-flash"), e.offsetWidth, e.classList.add("ppp-flash");
  }, Cr = () => {
    var p;
    const l = window.XtrataRadioConnectStacks;
    l ? l() : (p = document.getElementById("radio-wallet-connect")) == null || p.click();
  }, yi = () => {
    var p, g;
    const l = c.snapshot();
    if (l.step === "connect" || l.step === "wrong-wallet") {
      Cr();
      return;
    }
    if (l.step === "elsewhere" && ((p = l.gate) != null && p.radioUrl)) {
      location.href = l.gate.radioUrl;
      return;
    }
    if (l.step === "locked" && !l.armed && !l.busy && c.unlock(), l.step === "ready" && ((g = l.giftStop) == null ? void 0 : g.reason) === "off" && !l.busy && c.switchOn(), l.step === "fund" && l.solo && !l.depositPending && !l.busy) {
      He();
      return;
    }
    Is();
  };
  nn && (nn.onclick = yi);
  const xo = (l, p, g, f = "") => l.standIn && !l.mainConnected ? ve(`Connect ${Ye(l.standIn)} to add STX`, Cr, f) : ve(p, g, f), qr = (l) => {
    c.useLinked(l).then(() => Is());
  };
  let er = null;
  const Uo = () => {
    const l = ty(c.snapshot(), Ye);
    return l.length ? er || (er = new Promise((p) => {
      var gt;
      const g = I("dialog", "", "ppp-connect");
      g.setAttribute("aria-labelledby", "ppp-connect-title");
      let f = null;
      const R = (ot) => {
        f = ot, g.close();
      };
      g.addEventListener("close", () => {
        g.remove(), er = null, p(f);
      }), g.addEventListener("click", (ot) => {
        ot.target === g && R(null);
      });
      const ae = (ot, qe, je, Ut, Yn = !1) => {
        const tr = I("button", "", "ppp-connect__opt " + je);
        return tr.type = "button", tr.disabled = Yn, tr.onclick = Ut, tr.append(I("b", ot), I("span", qe)), tr;
      }, Ae = I("h2", "Connect to Xtrata Music", "ppp-connect__title");
      Ae.id = "ppp-connect-title";
      const Ee = l.map((ot) => ae(ot.label, ot.detail, "is-music", () => {
        if (R("music"), ot.action === "linked" && ot.main) {
          qr(ot.main);
          return;
        }
        const qe = ty(c.snapshot(), Ye).find((je) => je.action !== "linked");
        (qe == null ? void 0 : qe.action) === "create" ? c.create() : (qe == null ? void 0 : qe.action) === "unlock" && c.unlock(), Is();
      }, !!ot.disabled)), Ue = ae("Xverse or Leather", "If you already use one.", "is-stacks", () => R("stacks")), _t = ve("Cancel", () => R(null), "quiet ppp-connect__cancel");
      g.append(Ae, ...Ee, Ue, _t), document.body.appendChild(g), g.showModal(), (gt = Ee.find((ot) => !ot.disabled)) == null || gt.focus();
    }), er) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Uo;
  function wi(l) {
    if (!nn) return;
    const p = (f, R, ae) => {
      nn.hidden = !1, nn.className = "ppp-top" + (R ? " is-" + R : ""), nn.replaceChildren(I("span", "", "dot"), document.createTextNode(f)), nn.title = ae;
    }, g = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0;
    switch (l.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        nn.hidden = !0;
        return;
      case "elsewhere":
        return p("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        nn.hidden = !0;
        return;
      case "intro":
        return p("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return p(`Connect ${Ye(l.linked)}`, "warn", `This device's listening wallet belongs to ${Ye(l.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return p("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return p("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return l.depositPending ? p("Plays on their way", "quiet", "Plays start by themselves when they land") : p(l.entries.some((f) => f.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return p("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return p("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return l.payingOn && g > 0 && !l.giftStop ? p(`${g.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : p("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const wn = document.getElementById("pppNudge"), Oo = document.getElementById("onair");
  (Sa = wn == null ? void 0 : wn.querySelector("button")) == null || Sa.addEventListener("click", () => yi());
  const Ls = {
    connect: "Connect your player to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, mi = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Set up",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  }, Wr = document.getElementById("claimCard");
  let bi = !1, Ho = 0, Tr = 0;
  function xr(l) {
    if (!Wr) return;
    const p = (l.step === "intro" || l.step === "connect" || l.step === "elsewhere") && !l.gift;
    p && !bi && (bi = !0, a("/radio/giveaway/players").then((f) => {
      (f == null ? void 0 : f.state) !== "open" || typeof f.free != "number" || typeof f.total != "number" || f.free <= 0 || (Ho = f.free, Tr = f.total, xr(c.snapshot()));
    }).catch(() => {
    })), Wr.hidden = !(p && Ho > 0);
    const g = Wr.querySelector(".claim-n");
    g && Ho > 0 && (g.textContent = `${Ho.toLocaleString()} of ${Tr.toLocaleString()} left`);
  }
  const Gt = document.getElementById("youStatus");
  function Br(l) {
    if (!Gt || l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "intro" || l.step === "connect" || l.step === "elsewhere";
    Gt.dataset.on = g ? "1" : "0";
    const R = Gt.querySelector("b"), ae = Gt.querySelector(".you-status__t > span");
    !R || !ae || (R.textContent = g ? "Connected to Xtrata Music" : f ? "No player connected" : "Your player is not connected", ae.textContent = g ? "Every play goes to the artist, and your likes are saved." : f ? "Connect a player to play songs and pay the artists you listen to." : l.step === "locked" ? "Unlock it below to carry on listening." : "See below for what it needs.");
  }
  function xi(l) {
    if (l.step === "loading") return;
    const p = l.session ? Math.min(l.session.playsLeft, l.playsLeft) : 0, g = l.step === "ready" && l.payingOn && p > 0 && !l.giftStop, f = l.step === "fund" && l.depositPending, R = l.step === "elsewhere" && !t, ae = g || f || R ? "" : Ls[l.step] ?? "", Ae = g ? "on" : R ? "free" : ae ? "off" : "";
    Ae ? document.documentElement.dataset.ppp = Ae : delete document.documentElement.dataset.ppp, Oo && (Oo.hidden = !Ae || Ae === "free", Oo.querySelector(".onair-sub").textContent = g ? `${p.toLocaleString()} plays left` : "Plays off"), wn && (wn.hidden = Ae !== "off" && Ae !== "free", wn.classList.toggle("is-free", Ae === "free"), Ae === "free" ? (wn.querySelector(".nudge-t").textContent = "You’re on the free player", wn.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", wn.querySelector("button").textContent = "Get a player") : Ae === "off" && (wn.querySelector(".nudge-t").textContent = ae, wn.querySelector(".nudge-s").textContent = B(l) ? l.step === "intro" ? uC : "" : "This radio requires a funded listening wallet with music support on.", wn.querySelector("button").textContent = mi[l.step] ?? "Start"));
  }
  let Zr = "";
  function Do(l) {
    const p = I("div", "", "ppp-pick");
    l.funderMultiple && l.returnToKind === "funder" && p.append(I("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), l.returnToKind === "funder" && p.append(I("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const g = I("input");
    g.type = "text", g.placeholder = "SP… address to send returns to", g.autocomplete = "off", g.spellcheck = !1, g.setAttribute("aria-label", "Address to return funds to"), g.value = Zr, g.oninput = () => {
      Zr = g.value;
    };
    const f = ve(l.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(g.value), Zr = "";
    }, "tiny");
    return p.append(g, " ", f), l.returnToKind === "chosen" && p.append(" ", ve("Back to the funder", () => c.clearReturnAddress(), "tiny")), p;
  }
  const ba = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Cs() {
    const l = I("p", ba + " ", "ppp-mute");
    return l.append(pt("Xverse", "https://www.xverse.app/download"), " · ", pt("Leather", "https://leather.io/install-extension")), l;
  }
  let Jr = "";
  const Si = (l) => {
    const p = document.documentElement, g = l.solo && !l.main ? l.listening ? Pe(l.listening) : "new" : "", f = iI() ? "1" : "", R = l.standIn && !l.mainConnected ? Ye(l.standIn) : "";
    `${g}|${f}|${R}` !== Jr && (Jr = `${g}|${f}|${R}`, g ? p.dataset.pppSolo = g : delete p.dataset.pppSolo, R ? p.dataset.pppAs = R : delete p.dataset.pppAs, f ? p.dataset.pppWalletInstalled = f : delete p.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const l of [1500, 4e3, 9e3]) setTimeout(() => X(c.snapshot()), l);
  function Xn(l, p = "") {
    const g = I("div", "", "ppp-topup"), f = vi(l);
    g.append(I("span", "Add plays from My player: ", "ppp-mute"));
    for (const R of sl) {
      const ae = ve(`+${R.toLocaleString()}`, () => void c.topUpAlbum(R), p);
      ae.disabled = f === void 0 || f < R || l.depositPending || !!l.busy, g.append(ae);
    }
    return f !== void 0 && f < sl[0] && g.append(I("p", "My player needs plays first (switch to My player above).", "ppp-mute")), g;
  }
  const vi = (l) => {
    var f;
    const p = (f = l.likeFunds) == null ? void 0 : f.balance;
    if (p === void 0 || !l.playCost) return;
    const g = p - sn - 6000n;
    return g > 0n ? Number(g / l.playCost) : 0;
  };
  function Ai(l) {
    const p = l.likeFunds;
    if (!p || !p.album || !p.low && !p.pending) return [];
    if (p.low || (Q = !1), p.low && !Q) return [];
    const g = I("div", "", "ppp-pick ppp-lowbox");
    if (!p.low) {
      if (!p.txid) return [];
      const R = I("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return p.txid && R.append(pt("View", at(p.txid))), g.append(R), [g];
    }
    g.append(I("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), g.append(I("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), g.append(I("p", p.address, "ppp-addr-full"));
    const f = I("div", "", "ppp-open-row");
    if (f.append(ur("copy-likes-address", "Copy address", () => p.address, "primary", () => X(c.snapshot()))), p.main && !l.solo) {
      const R = To - (p.balance ?? 0n);
      R > 0n && f.append(xo(l, `Pay ${Ur(R)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return g.append(f), g.append(I("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [g];
  }
  const So = (l) => {
    const p = I("div", "", "ppp-wait");
    p.dataset.since = String(l.since), p.dataset.grace = String(l.graceMs), p.setAttribute("role", "progressbar"), p.setAttribute("aria-label", "Your plays are arriving");
    const g = I("p", "", "ppp-wait-t"), f = I("div", "", "ppp-wait-track");
    return f.append(I("div", "", "ppp-wait-fill")), p.append(g, f), Fo(p), p;
  };
  function Fo(l) {
    const p = Number(l.dataset.since), g = Number(l.dataset.grace) || 6e4, f = Math.max(0, Date.now() - p), R = l.querySelector(".ppp-wait-fill"), ae = l.querySelector(".ppp-wait-t");
    if (f < g) {
      const Ae = Math.ceil((g - f) / 1e3);
      R.style.width = Math.max(4, Math.min(95, f / g * 100)).toFixed(0) + "%", ae.textContent = `Loading your plays · ${Ae}s`, l.classList.remove("is-long"), l.setAttribute("aria-valuenow", String(Math.round(f / g * 100)));
    } else
      R.style.width = "", ae.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", l.classList.add("is-long"), l.removeAttribute("aria-valuenow");
  }
  let b = 0;
  setInterval(() => {
    const l = document.querySelectorAll(".ppp-wait");
    if (!l.length) {
      b = 0;
      return;
    }
    l.forEach(Fo), ++b % 10 === 0 && X(c.snapshot());
  }, 1e3);
  let k = null;
  function K(l) {
    if (l.step === "loading" && k !== null) return;
    const g = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(l.step) || !!l.busy || l.armed || !!v.pendingCode() && !["ready", "fund", "over"].includes(l.step);
    g !== k && (k = g, g ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function X(l) {
    var Vh, Xh, Yh, qh, Wh, Zh, Jh, Qh, ep, tp, np, rp, op, sp, ip, ap, cp, lp;
    if (m.sync(), dn && ["ready", "fund", "over"].includes(l.step) && !l.busy) {
      const J = dn;
      dn = null, l.root === J.root && l.slot !== J.slot && c.openAlbum(J.slot);
    }
    const p = v.inProgress(l), g = Ce(l), f = p && l.step === "fund" ? { ...l, depositPending: !0 } : g !== null ? { ...l, depositPending: !0, arrival: { since: g, graceMs: Pl } } : l, R = f.error === _l;
    if (Pt(), wr(l), ue(l), Lt = ln(l), D(l, f), K(f), Si(f), !p && v.inProgress(l)) return;
    if (wi(f), xi(f), xr(f), Br(f), t && n && (n.hidden = !["off", "elsewhere", "loading"].includes(f.step), n.textContent = f.step === "loading" || !f.gate ? T.on ? dC : "Checking your listening wallet…" : T.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), e.hidden = f.step === "off", e.hidden) {
      Oe(f, !1);
      return;
    }
    const [ae, Ae] = $s(f), Ee = s(".ppp-state");
    Ee.textContent = ae, Ee.className = "ppp-state" + (Ae ? " ppp-state--" + Ae : ""), Ee.hidden = !ae;
    const Ue = !!f.busy || f.armed, _t = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (Ue || !["intro", "loading"].includes(f.step));
    o.hidden = !_t, o.classList.toggle("ppp-frame--rest", !Ue && !mr);
    const gt = s(".ppp-frame-label");
    gt.hidden = !0;
    const ot = nI(f) ?? un;
    un = ot;
    const qe = "xtrata.radio.ppp.heard.v1", je = (() => {
      try {
        return localStorage.getItem(qe) === "1";
      } catch {
        return !1;
      }
    })();
    if (!je && f.entries.some((J) => J.kind === "play"))
      try {
        localStorage.setItem(qe, "1");
      } catch {
      }
    const Ut = je || f.slot > 0 && ((((Vh = f.likeFunds) == null ? void 0 : Vh.balance) ?? 0n) > 0n || _.count() > 1), Yn = B(f), tr = !Yn && oI({ ...f, heard: Ut }, ot);
    s(".ppp-badge").hidden = !tr;
    const jo = s(".ppp-steps"), Ao = s(".ppp-stage");
    jo.hidden = Ao.hidden = !tr, ot && tr && (jo.replaceChildren(...pf(f.solo).map((J, de) => {
      const Re = I("li", "", de < ot.at ? "done" : de === ot.at ? ot.blocked ? "now blocked" : "now" : "");
      return Re.append(I("span", de < ot.at ? "✓" : String(de + 1), "n"), J), de === ot.at && Re.setAttribute("aria-current", "step"), Re;
    })), Ao.textContent = ot.caption, Ao.className = "ppp-stage " + (ot.at >= pf(f.solo).length ? "ppp-ok" : ot.blocked ? "ppp-bad" : "ppp-cyan"));
    const ki = s(".ppp-facts"), Fn = [];
    f.main && ((Xh = f.gate) != null && Xh.here) && !f.solo && Fn.push(...Qn("Your wallet", Ye(f.main), "ppp-addr-short"));
    const Hh = () => {
      if (!f.listening) return;
      const J = ur("copy-listening", "Copy", () => f.listening || "", "tiny", () => X(c.snapshot()));
      Fn.push(...Qn(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", Pe(f.listening), "ppp-addr-short", J));
    };
    if (f.linked || Hh(), f.listening && f.step !== "intro")
      if (f.linked)
        Fn.push(...Qn("Credited to", `${Ye(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), Hh();
      else if (f.solo) {
        f.creditedTo && Fn.push(...Qn("Credited to", `${Ye(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const J = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${Ye(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Fn.push(...Qn("Returns go to", f.gift ? J : f.returnTo && !ut(f.returnTo) ? J.replace(Pe(f.returnTo), f.returnTo) : J, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Fn.push(...Qn("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((Yh = f.gate) != null && Yh.here)) {
      const J = f.linkedListening.map((de) => Pe(de) + (de === f.listening ? " (this one)" : "")).join(", ");
      Fn.push(...Qn(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", J, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const J = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Fn.push(...Qn("Balance", `${Ur(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, J));
    }
    const va = f.entries.find((J) => J.kind === "play");
    va && Yr(), va && Fn.push(...Qn("Last paid song", `${mo(va)} → ${Ye(va.recipient)}`, bo[va.status] || "")), ki.replaceChildren(...Fn), ki.hidden = !Fn.length;
    const De = [], Tt = [], jt = [], nr = [], Dh = On(BigInt(((qh = f.gate) == null ? void 0 : qh.limits.playFee) ?? "300")), Fh = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${Ur(Nl)} STX to the song holder, plus a ${Ur(Dh - Nl)} STX network fee.`, jh = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (De.push(I("p", "Pay artists as you listen.")), (Wh = f.gate) != null && Wh.radioUrl) {
          const de = I("p");
          de.append(pt("Open the pay-per-play radio →", f.gate.radioUrl)), De.push(de);
        }
        Tt.push(I("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const de = [f.linked, ...f.others];
          De.push(I("p", de.length > 1 ? `This device has listening wallets for ${ks(de)}.` : `This device has a listening wallet for ${Ye(f.linked)}.`)), Tt.push(I("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), de.slice(0, 3).forEach((Re, St) => jt.push(ve(`Open ${Ye(Re)}`, () => qr(Re), St === 0 ? "primary" : "")));
        } else
          De.push(I("p", "Connect your wallet to pay artists as you listen.")), Tt.push(I("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        De.push(I("p", `This device's listening wallet belongs to ${Ye(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Tt.push(I("p", `You are connected as ${Ye(f.main)}. Switch to the linked wallet to continue listening.`)), Tt.push(I("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), jt.push(ve("Switch wallet", Cr, "primary"));
        break;
      case "not-invited":
        De.push(I("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        De.push(I("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        De.push(I("p", "Every play counts for the song’s owner, on-chain.")), Tt.push(I("p", Fh)), Tt.push(I("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Tt.push(I("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (De.push(I("p", `This device already has a listening wallet for ${ks(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Tt.push(I("p", `Otherwise, set up a new listening wallet for ${Ye(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && Tt.push(I("p", `This is the listening wallet for ${Ye(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && Tt.push(I("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const J = v.liveGift();
        jt.push(ve(J ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${Ye(f.main)}` : "Start listening", () => void c.create(w.claiming() ? { another: !0 } : void 0), "primary")), !J && !f.solo && f.main && f.others.length && jt.push(ve("Switch wallet", Cr)), !J && f.solo && jt.push(ve("I have a Stacks wallet", Cr)), jt.push(ve("I already have a listening wallet", () => void c.unlock(!0))), J && jt.push(ve("Not now", () => v.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (De.push(I("p", "Locked.", "ppp-mute")), jt.push(ve("Unlock", () => void c.unlock(), "primary"))), f.standIn ? nr.push(ve("Use a different listening wallet", () => void Uo().then((de) => {
          de === "stacks" && Cr();
        }), "quiet")) : nr.push(ve("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        De.push(I("p", `Link to ${Ye(f.main)} · free`)), Tt.push(I("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Tt.push(I("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), jt.push(ve(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        De.push(I("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && De.push(So(f.arrival)) : Se(f) ? De.push(I("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Zh = f.gift) != null && Zh.player ? De.push(I("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? De.push(I("p", "No plays left · add plays to keep counting", "ppp-bad")) : De.push(I("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Dh)).toLocaleString()} plays`)), f.entries.length && Tt.push(I("p", "Playback is paused until your top-up confirms.")), f.payingOn && !f.entries.length && Tt.push(I("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), p ? Tt.push(I("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : f.depositPending ? Tt.push(I("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : f.solo ? (Tt.push(I("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Tt.push(I("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && jt.push(ur("copy-address", "Copy my address", () => f.listening || "", "primary", () => X(c.snapshot())))) : Tt.push(I("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), f.depositPending && f.depositTxid) {
          const de = I("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          de.append(pt("View", at(f.depositTxid))), De.push(de);
        } else f.allowance > 0n && !f.solo && !f.depositPending && jt.push(xo(f, `Deposit ${Ur(f.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        De.push(I("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.phrase && (De.push(I("p", "Or back up your player. With its 24 words written down it can hold more, because a lost passkey is no longer lost money.", "ppp-mute")), jt.push(ve("Back up my player · 24 words", () => void c.backup(), ""))), f.solo && !f.returnTo && (De.push(I("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), De.push(Do(f))), (!f.solo || f.returnTo) && jt.push(ve("Return excess", () => void c.returnFunds("excess"), "primary"), ve("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0 && ((Jh = f.giftStop) == null ? void 0 : Jh.reason) !== "off") {
          const de = Math.min(f.session.playsLeft, f.playsLeft);
          De.push(I("p", `${de.toLocaleString()} plays left`, "ppp-ok")), Tt.push(I("p", Fh + " The heart likes or unlikes from this wallet for 0.0003 STX.")), jt.push(ve("Switch off", () => void c.switchOff()));
        } else
          De.push(I("p", "Switch on music support to listen.", "ppp-mute")), jt.push(ve("Switch plays on", () => void c.switchOn(), "primary"));
        f.queued && De.push(I("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && De.push(I("p", "Running low on plays", "ppp-warn")), f.aboveTarget && De.push(I("p", "More than 1 STX here · backed up ✓ This player pays from this page as you listen, so keep larger amounts in your main wallet.", "ppp-mute")), f.depositPending ? De.push(I("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && jt.push(xo(f, `Top up ${Ur(f.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (f.solo && f.listening && !f.depositPending) {
      const J = f.step === "fund", de = f.step === "ready" && (f.balanceState === "low" || !!f.gift && f.giftPlays <= 20);
      J ? jt.unshift(ve("Add plays", () => He(), "primary")) : de ? jt.push(ve("Add plays", () => He(), "primary")) : f.step === "ready" && nr.push(ve("Add plays", () => He(), "quiet"));
    }
    if (f.solo && f.walletCannotSolo && Tt.push(I("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && Tt.push(Do(f)), Tt.push(Cs()), f.slot === 0 && f.step === "ready" && f.entries.some((J) => J.kind === "play" && J.status === "confirmed"))) {
      const J = I("p", "New to Stacks? ", "ppp-mute");
      J.append(pt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), De.push(J);
    }
    if (f.walletOutdated && Tt.push(I("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (De.push(I("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), jt.push(ve("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && nr.push(ve(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${Ye(f.returnTo)}`, () => void c.returnFunds("all"), "quiet")), f.slot > 0 && ((Qh = f.gift) != null && Qh.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && nr.push(Xn(f, "quiet")), f.phrase && ["ready", "fund", "over"].includes(f.step) && nr.push(ve(f.backedUp ? "Show my 24 backup words again" : "Back up my player · 24 words", () => void c.backup(), "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && nr.push(ve("Lock", () => void c.lock(), "quiet")), _t && !Ue && nr.push(ve(mr ? "Hide listening wallet box" : "Show listening wallet box", () => {
      mr = !mr, X(c.snapshot());
    }, "quiet")), [...jt, ...nr].forEach((J) => J.disabled = jh), jh && (jt.length = 0), !Yn && f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((ep = f.gift) != null && ep.player)) {
      const J = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", de = De.at(0);
      f.step === "ready" && de ? de.append(I("span", ` · ${Ze(f.balance)} STX`, J)) : De.push(I("p", `Balance ${Ze(f.balance)} STX`, J));
    }
    if (Yn) {
      for (const Re of [...jt, ...nr]) {
        const St = iC[Re.textContent ?? ""];
        St && (Re.textContent = St);
      }
      for (let Re = De.length - 1; Re >= 0; Re--) ry(De[Re].textContent) && Tt.unshift(...De.splice(Re, 1));
      for (let Re = jt.length - 1; Re >= 0; Re--) ry(jt[Re].textContent) && nr.unshift(...jt.splice(Re, 1));
      const J = f.entries.some((Re) => Re.kind === "play"), de = lC(f.step, { played: J, arriving: f.depositPending });
      de.length && De.length && de.shift(), De.push(...de.map((Re) => I("p", Re, "ppp-mute")));
    }
    if ((tp = f.gift) != null && tp.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const J = I("p", "", "ppp-gift");
      J.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && J.append(" · ", f.gift.player.subtitle);
      const de = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? I("span", " · plays on their way", "ppp-warn") : I("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      de && J.append(de);
      const Re = (np = De.at(0)) == null ? void 0 : np.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Re && /STX/.test(Re.textContent ?? "") && Re.remove(), De.unshift(J), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          De.splice(1, 0, I("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Xn(f, "primary"));
        else {
          const St = I("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          St.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), St.append(pt("Xverse", "https://www.xverse.app/download"), " and ", pt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), De.splice(1, 0, St);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const J = f.returnPlan, de = I("div", "", "ppp-pick");
      de.append(I("p", J.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Re = I("ul", "", "ppp-gift-list");
      J.steps.forEach((St, Nr) => {
        const rr = St.kind === "gift" ? "the unused gift" : St.kind === "deposit" ? "what was added to it" : "the rest", $n = I("li");
        $n.append(I("span", `${Nr + 1}. ${Ur(BigInt(St.send))} STX · ${rr}`, "t"), I("span", St.to ? ` → ${Ye(St.to)}` : " → choose an address below", St.to ? "ppp-mute" : "ppp-warn")), Re.append($n);
      }), de.append(Re), J.kept && de.append(I("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), J.steps.some((St) => !St.to) && de.append(Do(f)), de.append(ve(J.steps.length > 1 ? `Confirm part 1 of ${J.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), De.push(de);
    }
    const Ro = q(f), Eo = Y ? Ro : null, $i = le(f, !!Eo), Zb = $i === "gift" || $i === "arriving" || $i === "new", gu = Eo ? null : w.lines(l), yu = gu && !w.claiming() ? gu : [...gu ?? [], ...v.banner(l, { bare: !!Eo || $i === "gift" || $i === "arriving" })], fc = zt && (v.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? gi(zt, v.pendingCode()) : [];
    Eo || (De.unshift(...yu), De.push(...Ai(f)), De.unshift(...fc)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && De.unshift(I("p", `This is ${Ye(f.creditedTo)}'s listening wallet. Plays and likes count for ${Ye(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...De);
    const wu = document.querySelector(".ppp-switch");
    if (wu) {
      const J = _.latest(), de = f.slot > 0, Re = ["fund", "ready", "over"].includes(f.step) && (de || !!J);
      if (wu.hidden = !Re, Re) {
        const St = ($n, pc, gc, Au) => {
          const Ci = ve("", Au, "ppp-tab");
          return Ci.setAttribute("aria-pressed", String(gc)), Ci.append(I("span", $n, "tt"), I("span", pc === void 0 ? "…" : `${$t(pc).toLocaleString()} plays`, "ts")), Ci.disabled = !!f.busy, Ci;
        }, Nr = de ? ((op = (rp = f.gift) == null ? void 0 : rp.player) == null ? void 0 : op.title) ?? "Album" : J.title, rr = ve("View all albums" + (_.count() > 1 ? ` (${_.count()})` : ""), () => {
          if (Le()) {
            window.dispatchEvent(new CustomEvent("xtrata:radio-browse", { detail: { tab: "albums" } }));
            return;
          }
          const $n = document.querySelector(".ppp-shelf");
          $n && ($n.hidden = !1, $n.open = !$n.open, rr.setAttribute("aria-expanded", String($n.open)), $n.open && requestAnimationFrame(() => $n.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        rr.setAttribute("aria-expanded", String(!!((sp = document.querySelector(".ppp-shelf")) != null && sp.open))), wu.replaceChildren(
          St("🎧 My player", de ? (ip = f.likeFunds) == null ? void 0 : ip.balance : f.balance, !de, () => {
            de && c.openAlbum(0);
          }),
          St("💿 " + Nr, de ? f.balance : void 0, de, () => {
            !de && J && c.openAlbum(J.slot);
          }),
          rr
        );
      }
    }
    const zo = _.render(f), Ii = document.querySelector(".ppp-shelf"), hc = Le() ? document.getElementById("shelfBox") : null;
    if (hc)
      zo ? hc.firstChild !== zo && hc.replaceChildren(zo) : hc.replaceChildren(), Ii && (Ii.hidden = !0), U(!!zo);
    else if (Ii) {
      Ii.hidden = !zo;
      const J = Ii.querySelector("summary");
      J && (J.textContent = _.count() > 0 ? `♪ My albums (${_.count()})` : "♪ My albums");
      const de = Ii.querySelector(".ppp-shelf-body");
      zo && de && !de.contains(zo) && de.replaceChildren(zo);
    }
    const Aa = v.renderFold(l);
    if (s(".ppp-gifts").hidden = !Aa, Aa && !s(".ppp-gift-body").contains(Aa) && s(".ppp-gift-body").replaceChildren(Aa), Aa && xt) {
      xt = !1;
      const J = s(".ppp-gifts");
      J.open = !0, requestAnimationFrame(() => J.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const mu = document.querySelector("#ppp .ppp-featured");
    if (mu) {
      const J = C(), de = m.manage(), Re = (J.length > 0 || !!de) && f.slot === 0 && !((ap = f.gift) != null && ap.player) && f.step === "ready";
      mu.hidden = !Re, Re && mu.replaceChildren(...J.length ? [I("p", "Albums in your player", "ppp-featured__h")] : [], ...J.map((St) => {
        const Nr = (Dn == null ? void 0 : Dn.id) === St.id, rr = ve("", () => Dt(Nr ? null : St, !Nr), "ppp-featured__a" + (Nr ? " is-on" : "")), $n = Rr(St).length;
        return rr.append(I("b", St.title), I("span", Nr ? "Playing now · tap to go back to the radio" : `${St.subtitle ? St.subtitle + " · " : ""}${$n} ${$n === 1 ? "song" : "songs"}`)), rr.setAttribute("aria-pressed", String(Nr)), rr.disabled = !!f.busy, rr;
      }), ...de ? [de] : []);
    }
    const bu = document.querySelector("#ppp .ppp-release-in-slot");
    if (bu) {
      const J = ["off", "elsewhere", "unsupported"].includes(f.step) ? [] : m.banner();
      bu.hidden = !J.length, bu.replaceChildren(...J);
    }
    const Li = document.querySelector("#ppp .ppp-release");
    if (Li) {
      const J = ["off", "elsewhere", "unsupported"].includes(f.step) ? null : m.fold();
      if (Li.hidden = !J, J) {
        const de = document.activeElement instanceof HTMLElement && Li.contains(document.activeElement) ? document.activeElement : null, Re = ((cp = Li.querySelector(".ppp-release-songs")) == null ? void 0 : cp.scrollTop) ?? 0;
        (lp = Li.querySelector(".ppp-release-body")) == null || lp.replaceChildren(...J);
        const St = Li.querySelector(".ppp-release-songs");
        St && Re && (St.scrollTop = Re), de && de.isConnected && document.activeElement !== de && de.focus({ preventScroll: !0 });
      }
    }
    ct(f);
    const xu = document.querySelector("#ppp .ppp-yours");
    if (xu) {
      const J = f.solo && !!f.listening && f.slot === 0 && ["fund", "ready"].includes(f.step);
      xu.hidden = !J;
      const de = xu.querySelector(".ppp-yours-body");
      if (J && de && de.getAttribute("data-for") !== f.listening) {
        de.setAttribute("data-for", f.listening);
        const Re = (Au, ...Ci) => {
          const up = I("details", "", "ppp-yours-item");
          return up.append(I("summary", Au), ...Ci), up;
        }, St = I("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        St.append(I("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const Nr = I("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), rr = I("p");
        rr.append(pt("Find a name at BNS One →", "https://bns.one"));
        const $n = I("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), pc = I("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), gc = I("p");
        gc.append(pt("See the giveaway →", "https://xtrata.xyz/giveaway")), de.replaceChildren(
          Re("Give your player a name", St, Nr, I("p", f.listening, "ppp-addr-full"), ur("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => X(c.snapshot())), rr),
          Re("Link it to a wallet you already have", $n),
          Re("Bring a friend in", pc, gc)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Tt), s(".ppp-actions").replaceChildren(...jt), s(".ppp-actions2").replaceChildren(...nr);
    const Su = f.busy || f.message || "", Rh = s(".ppp-msg"), vu = Su && De.some((J) => (J.textContent ?? "").startsWith(Su.replace(/[.✓\s]+$/, ""))) ? "" : Su, zh = !vu && !f.error ? f.notice : R && !vu ? f.error : "";
    Rh.textContent = vu || zh, Rh.classList.toggle("is-warn", !!zh), s(".ppp-err").textContent = R ? "" : f.error;
    const Jb = f.entries.filter((J) => J.kind === "play");
    s(".ppp-recent").hidden = !f.entries.length, s(".ppp-recent-list").replaceChildren(...Jb.slice(0, 5).map((J) => {
      const de = I("li"), Re = J.status === "confirmed" ? "ok" : J.status === "failed" ? "bad" : "warn";
      return de.append(I("span", "", "d " + Re), I("span", mo(J), "t"), I("span", ht(J.created), "ppp-mute")), J.txid && de.append(pt("tx", at(J.txid))), de;
    })), s(".ppp-wallets").hidden = !(ki.childElementCount || nr.length), s(".ppp-more").hidden = !Tt.length;
    const Gh = s(".ppp-history");
    Gh.hidden = !f.entries.length, f.entries.length && Yr(), Gh.replaceChildren(I("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((J) => {
      const de = I("div", "", "ppp-row"), Re = J.kind === "play" ? [I("span", mo(J), "ppp-song"), I("span", ` · ${Ur(BigInt(J.amount))} STX to ${Ye(J.recipient)}`, "ppp-mute")] : J.kind === "like" ? [I("span", `${J.liked ? "♥ Liked" : "Unliked"} ${mo(J)}`, "ppp-song"), I("span", ` · for ${f.linked ? Ye(f.linked) : "this listening wallet"}`, "ppp-mute")] : [I("span", `Returned ${Ur(BigInt(J.amount))} STX`, "ppp-song"), I("span", ` to ${Ye(J.recipient)}`, "ppp-mute")];
      return de.append(
        I("span", ma[J.status] || J.status, "ppp-status " + (bo[J.status] || "")),
        ...Re,
        I("span", ` · ${new Date(J.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), J.txid && de.append(pt("tx ↗", at(J.txid))), de;
    })), W == null || W.render(Eo ? N(f, Eo, [...fc, ...yu]) : null), Oe(f, !!Eo, Zb ? [...fc, ...yu] : fc, $i), Te(f, !!Eo || !!(Ct != null && Ct.showing())), S(f, Eo), At.isOpen() && At.refresh(), kn();
    const Kh = (Ro == null ? void 0 : Ro.mode) === "open" ? null : yn(f);
    Ve == null || Ve.render((Ro == null ? void 0 : Ro.mode) === "open" ? N(f, Ro, []) : Kh ? { ...N(f, { mode: "open", player: Kh }, []), plays: f.balance === void 0 ? null : f.playsLeft } : null);
  }
  function Le() {
    const l = document.documentElement;
    return l.hasAttribute("data-skin") && !l.hasAttribute("data-view") && !!document.getElementById("shelfBox");
  }
  function q(l) {
    var f;
    if (["off", "elsewhere", "not-invited"].includes(l.step)) return null;
    if (l.slot > 0 && ((f = l.gift) != null && f.player) && ["fund", "ready", "over", "link", "loading"].includes(l.step))
      return l.root && pn({ root: l.root, slot: l.slot, player: l.gift.player }), { mode: "open", player: l.gift.player };
    const p = v.incomingAlbum();
    if (p) return { mode: "arrive", player: p.player, from: p.from, offered: p.plays };
    const g = Xe();
    return g && (l.step === "locked" || dn && l.step === "loading") ? { mode: "locked", player: g.player } : null;
  }
  const ke = (l, p, g, f, R) => `/awards/${l.id}#${new URLSearchParams({ n: String(p), a: g, ...R ? { b: R } : {}, p: String(f), s: iy(Eg, p, g) })}`;
  function be(l) {
    const p = l.award;
    return !p || !["ready", "fund", "over", "link"].includes(l.step) ? null : p.claimTx ? F ? "making" : null : p.state === "claimed" ? F && p.inscription !== void 0 ? "yours" : null : p.state !== "ready" || ge || l.step === "link" && Z !== "have" ? null : Z === "making" || Z === "yours" ? "ready" : Z;
  }
  function Te(l, p) {
    if (!P) return;
    const g = l.award, f = g != null && g.cls && Vc(g.cls) ? Ds(g.cls) : null, R = l.slot === 0 ? l.listening : l.root, ae = p || !g || !f || !R || g.number === void 0 ? null : be(l);
    if (!ae || !g || !f || !R) {
      P.render(null, p);
      return;
    }
    ae === "have" && l.linked && !ce && (ce = !0, c.awardRefresh());
    const Ae = typeof g.name == "string" && g.name ? g.name : null, Ee = [];
    l.error && Ee.push(I("p", l.error, "ppp-warn"));
    const Ue = (_t) => {
      Z = _t, _t === "name" && (F = !0), X(c.snapshot());
    };
    P.render({
      screen: ae,
      tier: f,
      number: g.number,
      need: g.need ?? 0,
      player: R,
      name: g.name,
      inscription: g.inscription,
      art: ae === "yours" && g.inscription !== void 0 ? `/i/${g.inscription}` : ke(f, g.number, R, g.need ?? 0, Ae),
      claimLink: g.claimTx ? at(g.claimTx) : void 0,
      status: Ee,
      asking: !!l.busy || l.armed,
      busy: !!l.busy,
      main: l.main ? Ye(l.main) : null,
      canLink: l.step === "link",
      linked: !!l.linked,
      copyAddress: () => ur("award-player-address", "Copy my player’s address", () => R, "tiny", () => X(c.snapshot())),
      go: Ue,
      claim: (_t) => {
        F = !0, c.claimAward(_t);
      },
      refresh: () => void c.awardRefresh(),
      connect: () => {
        var _t;
        return (_t = document.getElementById("radio-wallet-connect")) == null ? void 0 : _t.click();
      },
      link: () => void c.link(),
      later: () => {
        ge = !0;
        try {
          localStorage.setItem(M, String(Date.now()));
        } catch {
        }
        X(c.snapshot());
      },
      done: () => {
        F = !1, Z = "ready", X(c.snapshot());
      }
    }, p);
  }
  function ct(l) {
    var ot;
    const p = document.querySelector("#ppp .ppp-award");
    if (!p) return;
    const g = l.award, f = l.slot === 0 ? l.listening : l.root, R = g != null && g.cls && Vc(g.cls) ? Ds(g.cls) : null, ae = !!g && !!R && !!f && ["ready", "fund", "over"].includes(l.step) && !(g.state === "unavailable" && g.number === void 0);
    if (p.hidden = !ae, !ae || !g || !R || !f) {
      p.replaceChildren();
      return;
    }
    const Ae = JSON.stringify([g, f, !!l.busy]);
    if (p.getAttribute("data-sig") === Ae) return;
    p.setAttribute("data-sig", Ae);
    const Ee = (qe) => {
      const je = I("p", "", "ppp-award__h");
      return je.append(I("b", `${R.mark} Music Hero award`), I("span", qe)), je;
    }, Ue = `No. ${String(g.number ?? 0).padStart(4, "0")}`, _t = (qe) => {
      const je = I("div", "", "ppp-award__art"), Ut = document.createElement("iframe");
      return Ut.src = qe, Ut.title = `${R.name} record`, Ut.setAttribute("sandbox", "allow-scripts"), Ut.setAttribute("loading", "lazy"), je.append(Ut), je;
    }, gt = [];
    if (g.state === "claimed") {
      if (gt.push(Ee(`${R.name} record · ${Ue}`)), g.inscription !== void 0 && gt.push(_t(`/i/${g.inscription}`)), gt.push(I("p", g.holds === !1 ? "You sent this record to another wallet, so your player has gone back to plain. Whoever holds it keeps a record that still names you." : g.holds === null || g.holds === void 0 ? `Yours: Xtrata inscription #${g.inscription}.` : `Yours for good: Xtrata inscription #${g.inscription}. It gives your player its ${R.name} colours.`, g.holds === !1 ? "ppp-mute" : "ppp-ok")), g.inscription !== void 0) {
        const qe = I("p");
        qe.append(pt("Open it full screen ↗", `/i/${g.inscription}`)), gt.push(qe);
      }
      if (g.sendTx) {
        const qe = I("p", "Your record is on its way to its new address. About a minute. ", "ppp-cyan");
        qe.append(pt("View", at(g.sendTx))), gt.push(qe);
      } else if (g.holds === !0 && g.inscription !== void 0) {
        const qe = I("details", "", "ppp-award__send"), je = document.createElement("input");
        je.type = "text", je.placeholder = "SP… address to send it to", je.autocomplete = "off", je.spellcheck = !1, je.setAttribute("aria-label", "Address to send your record to");
        const Ut = ve("Send my record…", () => void c.sendAward(je.value), "");
        Ut.disabled = !!l.busy, qe.append(
          I("summary", "Send this record to someone"),
          I("p", "It is yours to give or sell. Whoever holds it keeps a record that still names you, and your player goes back to plain without it. This cannot be undone.", "ppp-mute"),
          je,
          Ut
        ), gt.push(qe);
      }
    } else if (g.claimTx) {
      gt.push(Ee(`${R.name} record · ${Ue}`));
      const qe = I("p", "Your record is being made: written to Xtrata with your plaque on it. About a minute. ", "ppp-cyan");
      qe.append(pt("View", at(g.claimTx))), gt.push(qe);
    } else if (g.state === "ready") {
      gt.push(Ee(`${R.name} record · ${Ue}`));
      const qe = typeof g.name == "string" && g.name ? g.name : null, je = new URLSearchParams({ n: String(g.number), a: f, ...qe ? { b: qe } : {}, p: String(g.need), s: iy(Eg, g.number, f) });
      gt.push(_t(`/awards/${R.id}#${je}`)), gt.push(I("p", `Your ${R.name} record is ready. You have paid artists for ${(ot = g.need) == null ? void 0 : ot.toLocaleString()} plays: that makes you an Xtrata Music Hero.`));
      const Ut = I("div", "", "ppp-award__row");
      qe ? (gt.push(I("p", `Its plaque will carry ${qe} beside your player’s address. What is on it cannot be changed afterwards.`, "ppp-mute")), Ut.append(ve("Claim my record", () => {
        F = !0, c.claimAward("auto");
      }, "primary"), ve("Use my address only", () => {
        F = !0, c.claimAward("none");
      }, "quiet"))) : g.name === null ? (gt.push(I("p", "Its plaque will carry your player’s address. Want a .btc name on it? Link a wallet that has one (see “Make it yours” below), then check again. What is on it cannot be changed afterwards.", "ppp-mute")), Ut.append(ve("Claim my record", () => {
        F = !0, c.claimAward("none");
      }, "primary"), ve("Check for a name again", () => void c.awardRefresh(), "quiet"))) : (gt.push(I("p", "Could not check for a .btc name just now. Check again, or claim with your player’s address alone.", "ppp-warn")), Ut.append(ve("Check for a name again", () => void c.awardRefresh(), "primary"), ve("Claim with my address only", () => void c.claimAward("none"), "quiet"))), Ut.querySelectorAll("button").forEach((Yn) => {
        Yn.disabled = !!l.busy;
      }), gt.push(Ut, I("p", "Free to claim: your player pays only a tiny network fee.", "ppp-mute"));
    } else if (g.state === "earning" && g.have !== void 0 && g.need) {
      gt.push(Ee(`${g.have.toLocaleString()} of ${g.need.toLocaleString()} paid plays`));
      const qe = I("div", "", "ppp-award__bar"), je = document.createElement("i");
      je.style.width = `${Math.min(100, Math.round(g.have / g.need * 100))}%`, qe.append(je);
      const Ut = g.need - g.have;
      gt.push(qe, I("p", `${Ut.toLocaleString()} more ${Ut === 1 ? "play" : "plays"} and your ${R.name} record is yours to claim.`, "ppp-mute"));
    } else
      gt.push(Ee(`${R.name} record · ${Ue}`)), gt.push(I("p", g.state === "paused" ? "Claiming is paused for a moment. Your record is safe: try again later." : g.state === "class-full" || g.state === "not-open" ? "Claiming is not open for this record right now." : "Can’t check your award right now. Your plays still count: this updates by itself.", "ppp-mute"));
    p.replaceChildren(...gt);
  }
  function S(l, p) {
    var Ee;
    const g = document.querySelector(".ppp-skin");
    if (!g) return;
    if (!p && (P != null && P.showing()) && ((Ee = l.award) != null && Ee.cls) && Vc(l.award.cls) && (l.busy || l.armed)) {
      const Ue = Ds(l.award.cls), _t = I("span", "", "ppp-skin__t");
      _t.append(I("b", `${Ue.name} record · No. ${String(l.award.number ?? 0).padStart(4, "0")}`), I("span", "Xtrata Music Hero")), g.hidden = !1, g.replaceChildren(I("span", Ue.mark, "ppp-skin__art ppp-skin__art--none"), _t);
      return;
    }
    const f = !!p && (!!l.busy || l.armed);
    if (g.hidden = !f, !f || !p) {
      g.replaceChildren();
      return;
    }
    const R = il(p.player.cover), ae = R ? I("img", "", "ppp-skin__art") : I("span", "♪", "ppp-skin__art ppp-skin__art--none");
    R && (ae.src = R, ae.alt = "");
    const Ae = I("span", "", "ppp-skin__t");
    Ae.append(I("b", p.player.title), I("span", p.mode === "arrive" && p.from ? `A gift from ${p.from}` : p.player.subtitle || "Your album")), g.replaceChildren(ae, Ae);
  }
  function N(l, p, g) {
    var Ue, _t, gt, ot, qe;
    const f = !!l.busy || l.armed, R = [...g];
    l.depositPending && l.arrival && R.push(So(l.arrival)), l.error ? R.push(I("p", l.error, l.error === _l ? "ppp-warn" : "ppp-bad")) : l.message && !f ? R.push(I("p", l.message, "ppp-cyan")) : l.notice && R.push(I("p", l.notice, "ppp-warn")), p.mode === "open" && Q && ((Ue = l.likeFunds) != null && Ue.album) && l.likeFunds.low && !l.likeFunds.pending && R.push(I("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ae = "Kept on this device with Face ID or your passkey. No app or account needed.", Ae = null, Ee = null;
    if (p.mode === "locked")
      Ae = { label: "Continue listening", run: () => {
        dn = Xe(), c.unlock();
      } }, Ee = { label: "Use a different passkey", run: () => {
        dn = null, c.unlock(!0);
      } };
    else if (p.mode === "arrive")
      if (l.step === "intro" && Wc(dt) && dt.album === p.player.id) {
        const je = window.XtrataRadio, Ut = Rr(p.player)[0], Yn = dt.phase === "playing";
        Ae = { label: Yn && !!((gt = (_t = je == null ? void 0 : je.getState) == null ? void 0 : _t.call(je)) != null && gt.playing) ? "Pause" : Yn ? "Carry on" : "Play the first song", run: () => {
          var jo, Ao;
          Yn ? (jo = je == null ? void 0 : je.playPause) == null || jo.call(je) : Ut && ((Ao = je == null ? void 0 : je.playToken) == null || Ao.call(je, Ut.id));
        } }, Ee = { label: "Make my player and hear it all", run: () => void c.create() }, ae = "The first song is free. Nothing to set up yet.";
      } else if (l.step === "intro") {
        const je = dt.phase === "done" && dt.album === p.player.id;
        je && !R.length && R.push(I("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), Ae = { label: je ? "Keep listening" : "Open album", run: () => void c.create() }, Ee = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else l.step === "locked" ? (Ae = { label: "Open album", run: () => void c.unlock() }, Ee = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : l.step === "unsupported" ? R.push(I("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : R.length || R.push(I("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: p.mode,
      player: p.player,
      from: p.from,
      offered: p.offered,
      // A newcomer opening a gifted album: where they are, as three lights. Not for someone who already has a player.
      step: p.mode === "arrive" && l.step === "intro" ? 1 : void 0,
      plays: p.mode === "open" ? l.balance === void 0 ? null : l.giftPlays : void 0,
      playsComing: l.depositPending,
      status: R,
      primary: Ae,
      secondary: Ee,
      hint: Ae ? ae : void 0,
      asking: f,
      busy: !!l.busy,
      myPlays: vi(l),
      topUps: sl,
      canMake: !!((qe = (ot = l.gate) == null ? void 0 : ot.gifts) != null && qe.admin)
    };
  }
  const z = document.getElementById("findBox"), ye = document.getElementById("findBody"), Ft = z && ye ? IC(ye, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((l) => l.ok ? l.json() : Promise.reject(new Error("catalogue unavailable"))).then((l) => AC(l == null ? void 0 : l.tracks, (p, g) => ({ title: _g(p, Mn(g.title) ? "" : g.title), artist: Mg(p, g.artist || "") }))),
    play: (l) => {
      var p, g;
      (g = (p = window.XtrataRadio) == null ? void 0 : p.playToken) == null || g.call(p, l);
    },
    current: () => {
      var p, g, f, R;
      const l = Number((R = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.nowPlaying) == null ? void 0 : R.tokenId);
      return Number.isSafeInteger(l) ? l : null;
    },
    locked: () => {
      var l;
      return !!((l = c.snapshot().albumLock) != null && l.locked);
    },
    explicit: (l) => {
      var p, g;
      return !!((g = (p = window.XtrataRadio) == null ? void 0 : p.isExplicit) != null && g.call(p, l));
    },
    liked: (l) => Sr().has(l),
    grid: document.documentElement.hasAttribute("data-skin"),
    // the new look lists artist names three across
    leaveAlbum: () => x(0)
  }) : null;
  z == null || z.addEventListener("toggle", () => {
    z.open && (Ft == null || Ft.load());
  });
  let En = "";
  const Sr = () => {
    var p, g, f;
    const l = (f = (g = (p = window.XtrataRadio) == null ? void 0 : p.getState) == null ? void 0 : g.call(p)) == null ? void 0 : f.likes;
    return new Set(Array.isArray(l) ? l.map((R) => Number(R == null ? void 0 : R.tokenId)).filter(Number.isSafeInteger) : []);
  }, kn = () => {
    var p, g, f, R, ae;
    if (!Ft || !(z != null && z.open)) return;
    const l = `${!!((p = c.snapshot().albumLock) != null && p.locked)}|${((ae = (R = (f = (g = window.XtrataRadio) == null ? void 0 : g.getState) == null ? void 0 : f.call(g)) == null ? void 0 : R.nowPlaying) == null ? void 0 : ae.tokenId) ?? ""}|${[...Sr()].sort((Ae, Ee) => Ae - Ee).join(",")}`;
    l !== En && (En = l, Ft.refresh());
  }, Ei = /* @__PURE__ */ new Map();
  let vo = !1;
  const xa = () => {
    const l = window.XtrataRadio;
    return l != null && l.subscribe ? (l.subscribe((p) => {
      const g = p == null ? void 0 : p.nowPlaying;
      if (g && Number.isSafeInteger(Number(g.tokenId)) && Ei.set(Number(g.tokenId), { title: g.title || void 0, artist: g.artist || void 0 }), kn(), wt) {
        const f = `${(g == null ? void 0 : g.tokenId) ?? ""}|${!!(p != null && p.playing)}`;
        f !== Be && (Be = f, X(c.snapshot()));
      }
      if (Wc(dt)) {
        const f = !!(p != null && p.playing);
        Lr({ kind: "now", track: g && g.tokenId != null ? String(g.tokenId) : null, playing: f, at: Date.now() }), f !== vo && (vo = f, X(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!xa()) {
    const l = setInterval(() => {
      xa() && clearInterval(l);
    }, 500);
    setTimeout(() => clearInterval(l), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (l) => {
    const p = l.detail;
    if (Wc(dt) && Lr({ kind: "listened", at: Date.now() }), p && Number.isSafeInteger(p.song) && typeof p.id == "string" && /^[0-9a-f]{32}$/.test(p.id)) {
      Yr();
      const g = wo(p.song, Ei.get(p.song));
      c.onListened({ song: p.song, id: p.id, title: g.title || void 0, artist: g.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (t || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const HC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", DC = () => {
  const e = !!window.chrome, t = window.navigator, n = t.vendor, r = typeof window.opr < "u", s = t.userAgent.includes("Edge"), o = /CriOS/.exec(t.userAgent), i = t.userAgent.includes("Mobile");
  return o ? !1 : e !== null && typeof e < "u" && n === "Google Inc." && r === !1 && s === !1 && i === !1;
}, FC = () => DC() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, jC = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, RC = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Wb = class {
  constructor(e) {
    V4(this, e), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(e) {
    this.persistSelection && fA(e), this.callback(Ql(e));
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
    var r, s, o, i, a, c, u, h, d, w;
    return n === "IOS" ? (s = (r = e.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(e)) !== null && s !== void 0 ? s : e.webUrl : t === "Chrome" ? (i = (o = e.chromeWebStoreUrl) !== null && o !== void 0 ? o : this.getMobileUrl(e)) !== null && i !== void 0 ? i : e.webUrl : t === "Firefox" ? (c = (a = e.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(e)) !== null && c !== void 0 ? c : e.webUrl : n === "Android" ? (h = (u = e.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(e)) !== null && h !== void 0 ? h : e.webUrl : (w = (d = this.getBrowserUrl(e)) !== null && d !== void 0 ? d : e.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(e);
  }
  render() {
    const e = FC(), t = jC(), n = this.defaultProviders.filter(
      (o) => this.installedProviders.findIndex((i) => i.id === o.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return We("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, We("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), We("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, We("div", { class: "flex flex-col space-y-[10px]" }, We("div", { class: "flex items-center" }, We("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), We("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, We("span", { class: "sr-only" }, "Close popup"), We("img", { src: HC }))), r ? We("p", null, "Select the wallet you want to connect to.") : We("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !t && !e && We("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && We("div", { class: "mt-6" }, We("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), We("ul", { class: "space-y-3" }, this.installedProviders.map((o) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && We("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), We("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(o.id) }, "Connect"))))), s && We("div", { class: "mt-6" }, r ? We("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : We("div", { class: "mb-5 flex justify-between" }, We("p", { class: "text-sm font-medium" }, "Recommended wallets"), We("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, We("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), We("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), We("p", null, "What is a wallet? ", We("span", { class: "align-text-bottom text-[9px]" }, "↗")))), We("ul", { class: "space-y-3" }, n.map((o) => We("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, We("div", { class: "aspect-square basis-9 overflow-hidden" }, We("img", { src: o.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), We("div", { class: "flex-1" }, We("div", { class: "text-sm font-medium text-[#242629]" }, o.name), o.webUrl && We("a", { href: o.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(o.webUrl).hostname)), this.getInstallUrl(o, e, t) && We("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(o, e, t), rel: "noopener noreferrer", target: "_blank" }, o.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return I4(this);
  }
};
Wb.style = RC;
const zC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Wb
}, Symbol.toStringTag, { value: "Module" }));
