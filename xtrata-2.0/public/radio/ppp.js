var rw = Object.defineProperty;
var sw = (t, e, n) => e in t ? rw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var eo = (t, e, n) => sw(t, typeof e != "symbol" ? e + "" : e, n);
var tn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function f0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function nc(t) {
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
      typeof tn < "u" && tn || {}, r = {
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
      function s($) {
        return $ && DataView.prototype.isPrototypeOf($);
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
        ], o = ArrayBuffer.isView || function($) {
          return $ && i.indexOf(Object.prototype.toString.call($)) > -1;
        };
      function a($) {
        if (typeof $ != "string" && ($ = String($)), /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test($) || $ === "")
          throw new TypeError('Invalid character in header field name: "' + $ + '"');
        return $.toLowerCase();
      }
      function c($) {
        return typeof $ != "string" && ($ = String($)), $;
      }
      function u($) {
        var P = {
          next: function() {
            var M = $.shift();
            return { done: M === void 0, value: M };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function d($) {
        this.map = {}, $ instanceof d ? $.forEach(function(P, M) {
          this.append(M, P);
        }, this) : Array.isArray($) ? $.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : $ && Object.getOwnPropertyNames($).forEach(function(P) {
          this.append(P, $[P]);
        }, this);
      }
      d.prototype.append = function($, P) {
        $ = a($), P = c(P);
        var M = this.map[$];
        this.map[$] = M ? M + ", " + P : P;
      }, d.prototype.delete = function($) {
        delete this.map[a($)];
      }, d.prototype.get = function($) {
        return $ = a($), this.has($) ? this.map[$] : null;
      }, d.prototype.has = function($) {
        return this.map.hasOwnProperty(a($));
      }, d.prototype.set = function($, P) {
        this.map[a($)] = c(P);
      }, d.prototype.forEach = function($, P) {
        for (var M in this.map)
          this.map.hasOwnProperty(M) && $.call(P, this.map[M], M, this);
      }, d.prototype.keys = function() {
        var $ = [];
        return this.forEach(function(P, M) {
          $.push(M);
        }), u($);
      }, d.prototype.values = function() {
        var $ = [];
        return this.forEach(function(P) {
          $.push(P);
        }), u($);
      }, d.prototype.entries = function() {
        var $ = [];
        return this.forEach(function(P, M) {
          $.push([M, P]);
        }), u($);
      }, r.iterable && (d.prototype[Symbol.iterator] = d.prototype.entries);
      function l($) {
        if (!$._noBody) {
          if ($.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          $.bodyUsed = !0;
        }
      }
      function y($) {
        return new Promise(function(P, M) {
          $.onload = function() {
            P($.result);
          }, $.onerror = function() {
            M($.error);
          };
        });
      }
      function p($) {
        var P = new FileReader(), M = y(P);
        return P.readAsArrayBuffer($), M;
      }
      function v($) {
        var P = new FileReader(), M = y(P), V = /charset=([A-Za-z0-9_-]+)/.exec($.type), ct = V ? V[1] : "utf-8";
        return P.readAsText($, ct), M;
      }
      function x($) {
        for (var P = new Uint8Array($), M = new Array(P.length), V = 0; V < P.length; V++)
          M[V] = String.fromCharCode(P[V]);
        return M.join("");
      }
      function T($) {
        if ($.slice)
          return $.slice(0);
        var P = new Uint8Array($.byteLength);
        return P.set(new Uint8Array($)), P.buffer;
      }
      function q() {
        return this.bodyUsed = !1, this._initBody = function($) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = $, $ ? typeof $ == "string" ? this._bodyText = $ : r.blob && Blob.prototype.isPrototypeOf($) ? this._bodyBlob = $ : r.formData && FormData.prototype.isPrototypeOf($) ? this._bodyFormData = $ : r.searchParams && URLSearchParams.prototype.isPrototypeOf($) ? this._bodyText = $.toString() : r.arrayBuffer && r.blob && s($) ? (this._bodyArrayBuffer = T($.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf($) || o($)) ? this._bodyArrayBuffer = T($) : this._bodyText = $ = Object.prototype.toString.call($) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof $ == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf($) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
        }, r.blob && (this.blob = function() {
          var $ = l(this);
          if ($)
            return $;
          if (this._bodyBlob)
            return Promise.resolve(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(new Blob([this._bodyArrayBuffer]));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as blob");
          return Promise.resolve(new Blob([this._bodyText]));
        }), this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            var $ = l(this);
            return $ || (ArrayBuffer.isView(this._bodyArrayBuffer) ? Promise.resolve(
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
          var $ = l(this);
          if ($)
            return $;
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
      var W = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E($) {
        var P = $.toUpperCase();
        return W.indexOf(P) > -1 ? P : $;
      }
      function N($, P) {
        if (!(this instanceof N))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var M = P.body;
        if ($ instanceof N) {
          if ($.bodyUsed)
            throw new TypeError("Already read");
          this.url = $.url, this.credentials = $.credentials, P.headers || (this.headers = new d($.headers)), this.method = $.method, this.mode = $.mode, this.signal = $.signal, !M && $._bodyInit != null && (M = $._bodyInit, $.bodyUsed = !0);
        } else
          this.url = String($);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new d(P.headers)), this.method = E(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var X = new AbortController();
            return X.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && M)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(M), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var V = /([?&])_=[^&]*/;
          if (V.test(this.url))
            this.url = this.url.replace(V, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var ct = /\?/;
            this.url += (ct.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      N.prototype.clone = function() {
        return new N(this, { body: this._bodyInit });
      };
      function B($) {
        var P = new FormData();
        return $.trim().split("&").forEach(function(M) {
          if (M) {
            var V = M.split("="), ct = V.shift().replace(/\+/g, " "), X = V.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(ct), decodeURIComponent(X));
          }
        }), P;
      }
      function tt($) {
        var P = new d(), M = $.replace(/\r?\n[\t ]+/g, " ");
        return M.split("\r").map(function(V) {
          return V.indexOf(`
`) === 0 ? V.substr(1, V.length) : V;
        }).forEach(function(V) {
          var ct = V.split(":"), X = ct.shift().trim();
          if (X) {
            var L = ct.join(":").trim();
            try {
              P.append(X, L);
            } catch (rt) {
              console.warn("Response " + rt.message);
            }
          }
        }), P;
      }
      q.call(N.prototype);
      function et($, P) {
        if (!(this instanceof et))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new d(P.headers), this.url = P.url || "", this._initBody($);
      }
      q.call(et.prototype), et.prototype.clone = function() {
        return new et(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new d(this.headers),
          url: this.url
        });
      }, et.error = function() {
        var $ = new et(null, { status: 200, statusText: "" });
        return $.ok = !1, $.status = 0, $.type = "error", $;
      };
      var K = [301, 302, 303, 307, 308];
      et.redirect = function($, P) {
        if (K.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new et(null, { status: P, headers: { location: $ } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, M) {
          this.message = P, this.name = M;
          var V = Error(P);
          this.stack = V.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function j($, P) {
        return new Promise(function(M, V) {
          var ct = new N($, P);
          if (ct.signal && ct.signal.aborted)
            return V(new e.DOMException("Aborted", "AbortError"));
          var X = new XMLHttpRequest();
          function L() {
            X.abort();
          }
          X.onload = function() {
            var k = {
              statusText: X.statusText,
              headers: tt(X.getAllResponseHeaders() || "")
            };
            ct.url.indexOf("file://") === 0 && (X.status < 200 || X.status > 599) ? k.status = 200 : k.status = X.status, k.url = "responseURL" in X ? X.responseURL : k.headers.get("X-Request-URL");
            var U = "response" in X ? X.response : X.responseText;
            setTimeout(function() {
              M(new et(U, k));
            }, 0);
          }, X.onerror = function() {
            setTimeout(function() {
              V(new TypeError("Network request failed"));
            }, 0);
          }, X.ontimeout = function() {
            setTimeout(function() {
              V(new TypeError("Network request timed out"));
            }, 0);
          }, X.onabort = function() {
            setTimeout(function() {
              V(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function rt(k) {
            try {
              return k === "" && n.location.href ? n.location.href : k;
            } catch {
              return k;
            }
          }
          if (X.open(ct.method, rt(ct.url), !0), ct.credentials === "include" ? X.withCredentials = !0 : ct.credentials === "omit" && (X.withCredentials = !1), "responseType" in X && (r.blob ? X.responseType = "blob" : r.arrayBuffer && (X.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof d || n.Headers && P.headers instanceof n.Headers)) {
            var ne = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(k) {
              ne.push(a(k)), X.setRequestHeader(k, c(P.headers[k]));
            }), ct.headers.forEach(function(k, U) {
              ne.indexOf(U) === -1 && X.setRequestHeader(U, k);
            });
          } else
            ct.headers.forEach(function(k, U) {
              X.setRequestHeader(U, k);
            });
          ct.signal && (ct.signal.addEventListener("abort", L), X.onreadystatechange = function() {
            X.readyState === 4 && ct.signal.removeEventListener("abort", L);
          }), X.send(typeof ct._bodyInit > "u" ? null : ct._bodyInit);
        });
      }
      return j.polyfill = !0, n.fetch || (n.fetch = j, n.Headers = d, n.Request = N, n.Response = et), e.Headers = d, e.Request = N, e.Response = et, e.fetch = j, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : tn);
})();
const iw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function ow(t, e) {
  const n = {};
  return Object.assign(n, iw, e), await fetch(t, n);
}
function aw(t) {
  let e = ow, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function cw(...t) {
  const { fetchLib: e, middlewares: n } = aw(t);
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
var Ii;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ii || (Ii = {}));
var Ms;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ms || (Ms = {}));
var Mf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Mf || (Mf = {}));
const lw = "https://api.mainnet.hiro.so", uw = "https://api.testnet.hiro.so", fw = "http://localhost:3999", dw = ["mainnet", "testnet", "devnet", "mocknet"];
let Li = class {
  constructor(e) {
    this.version = Ms.Mainnet, this.chainId = Ii.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ms.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? cw();
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
Li.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new ul();
    case "testnet":
      return new hw();
    case "devnet":
      return new pw();
    case "mocknet":
      return new d0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${dw.join(", ")}`);
  }
};
Li.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Li.fromName(t);
let ul = class extends Li {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? lw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Mainnet, this.chainId = Ii.Mainnet;
  }
}, hw = class extends Li {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? uw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Testnet, this.chainId = Ii.Testnet;
  }
}, d0 = class extends Li {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? fw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ms.Testnet, this.chainId = Ii.Testnet;
  }
};
const pw = d0, h0 = "xtrata.wallet.bridge.v1", gw = (t) => typeof t == "object" && t !== null && t.protocol === h0, yw = (t) => gw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", ww = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class no extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Nf = 12e4;
class bw {
  constructor(e) {
    eo(this, "pending", /* @__PURE__ */ new Map());
    eo(this, "listenTarget");
    eo(this, "closed", !1);
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
    eo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !yw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new no("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new no("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new no("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = ww(), i = { protocol: h0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new no(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Nf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Nf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new no("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const mw = ["SP", "SM"], xw = ["ST", "SN"], Sw = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return mw.includes(n) ? "mainnet" : xw.includes(n) ? "testnet" : null;
}, Ew = () => {
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
}, Aw = () => typeof window > "u" || !window.localStorage ? Ew() : window.localStorage, Pc = "xtrata.v15.1.wallet.session", Pf = "mainnet", La = { isConnected: !1 }, vw = (t) => t.address ? Sw(t.address) ?? t.network : t.network, p0 = (t) => !t.isConnected || !t.address ? { ...La } : vw(t) !== Pf ? { ...La } : {
  isConnected: !0,
  address: t.address,
  network: Pf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, $w = (t) => {
  if (!t)
    return { ...La };
  try {
    const e = JSON.parse(t);
    return p0(e);
  } catch {
    return { ...La };
  }
}, kw = (t) => {
  const e = p0(t);
  return JSON.stringify(e);
}, Iw = (t) => {
  const e = Aw();
  return {
    load: () => $w(e.getItem(Pc)),
    save: (n) => {
      e.setItem(Pc, kw(n));
    },
    clear: () => {
      e.removeItem(Pc);
    }
  };
}, Lw = "https://browser.blockstack.org/auth", Cw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, g0 = ["store_write"], Tw = "blockstack-session", Bw = {
  logLevel: "debug"
}, Ys = {
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
Object.freeze(Ys);
class Ki extends Error {
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
class Mw extends Ki {
  constructor(e, n = "") {
    super({ code: Ys.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class _f extends Ki {
  constructor(e = "") {
    super({ code: Ys.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class jo extends Ki {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ys.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Uf extends Ki {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ys.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class fl extends Ki {
  constructor(e) {
    super({ code: Ys.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class y0 extends Ki {
  constructor(e) {
    super({ code: Ys.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Hf = ["debug", "info", "warn", "error", "none"], dl = {};
for (let t = 0; t < Hf.length; t++) {
  const e = Hf[t];
  dl[e] = t;
}
class xi {
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
    return dl[Bw.logLevel] <= dl[e];
  }
}
function Nw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Pw() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function _c(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function _w() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Uw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Hw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function gu(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Uw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    xi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Hw(s, t.toString(), n);
    throw xi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function ps(t, e) {
  return yu(Ye(t), e);
}
function Ye(t) {
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
  if (cn(t, Uint8Array))
    return BigInt(`0x${mt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Ow(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Of(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function To(t, e = 8) {
  return (typeof t == "bigint" ? t : Ye(t)).toString(16).padStart(e * 2, "0");
}
function rc(t) {
  return parseInt(t, 16);
}
function yu(t, e = 16) {
  const n = To(t, e);
  return Qt(n);
}
function Dw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Fw(t, e) {
  return t & BigInt(1) << e;
}
function hl(t) {
  return jw(BigInt(`0x${mt(t)}`), BigInt(t.byteLength * 8));
}
function jw(t, e) {
  return Fw(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const zw = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += zw[n];
  return e;
}
function Qt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Ow(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Zs(t) {
  return new TextEncoder().encode(t);
}
function Bo(t) {
  return new TextDecoder().decode(t);
}
function Rw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function Gw(t) {
  return String.fromCharCode.apply(null, t);
}
function Kw(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Df(t) {
  if (t.some(Kw))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
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
function Pe(t) {
  return sr(...t.map((e) => typeof e == "number" ? Df([e]) : e instanceof Array ? Df(e) : e));
}
function cn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const w0 = "https://api.mainnet.hiro.so", b0 = "https://api.testnet.hiro.so", m0 = "http://localhost:3999", Vw = "https://hub.blockstack.org", qw = 33, Uc = 32;
function Ww(t) {
  if (t.length < Uc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Uc * 2), r = t.slice(2 + Uc * 2);
  return {
    recoveryId: rc(e),
    r: n,
    s: r
  };
}
function wu(t) {
  const e = typeof t == "string" ? Qt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Xw(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Yw(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Zw(t, e) {
  return t[e];
}
function Qw(t, e, n = 0) {
  return t[n] = e, t;
}
function Jw(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ns(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const tb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function eb(t, e) {
  const n = {};
  return Object.assign(n, tb, e), await fetch(t, n);
}
function nb(t) {
  let e = eb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function rb(...t) {
  const { fetchLib: e, middlewares: n } = nb(t);
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
class x0 {
  constructor(e = g0.slice(), n = ((a) => (a = gu("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Lw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function S0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ib(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  pl(t.outputLen), pl(t.blockLen);
}
function ob(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ab(t, e) {
  S0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ss = {
  number: pl,
  bool: sb,
  bytes: S0,
  hash: ib,
  exists: ob,
  output: ab
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Kn = (t, e) => t << 32 - e | t >>> e, cb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lb(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function bu(t) {
  if (typeof t == "string" && (t = lb(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let E0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Qs(t) {
  const e = (r) => t().update(bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let A0 = class extends E0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ss.hash(e);
    const r = bu(n);
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
    return Ss.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ss.exists(this), Ss.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const sc = (t, e, n) => new A0(t, e).update(n).digest();
sc.create = (t, e) => new A0(t, e);
function ub(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let mu = class extends E0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hc(this.buffer);
  }
  update(e) {
    Ss.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = bu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Hc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ss.exists(this), Ss.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ub(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Hc(e), c = this.outputLen;
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
const fb = (t, e, n) => t & e ^ ~t & n, db = (t, e, n) => t & e ^ t & n ^ e & n, hb = new Uint32Array([
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
]), Hr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Or = new Uint32Array(64);
let v0 = class extends mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Hr[0] | 0, this.B = Hr[1] | 0, this.C = Hr[2] | 0, this.D = Hr[3] | 0, this.E = Hr[4] | 0, this.F = Hr[5] | 0, this.G = Hr[6] | 0, this.H = Hr[7] | 0;
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
      Or[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Or[l - 15], p = Or[l - 2], v = Kn(y, 7) ^ Kn(y, 18) ^ y >>> 3, x = Kn(p, 17) ^ Kn(p, 19) ^ p >>> 10;
      Or[l] = x + Or[l - 7] + v + Or[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Kn(a, 6) ^ Kn(a, 11) ^ Kn(a, 25), p = d + y + fb(a, c, u) + hb[l] + Or[l] | 0, x = (Kn(r, 2) ^ Kn(r, 13) ^ Kn(r, 22)) + db(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Or.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, pb = class extends v0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ci = Qs(() => new v0());
Qs(() => new pb());
const gb = {}, $0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: gb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Xt = BigInt(0), we = BigInt(1), ls = BigInt(2), uo = BigInt(3), Ff = BigInt(8), oe = Object.freeze({
  a: Xt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: we,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), jf = (t, e) => (t + e / ls) / e, zo = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = oe, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -we * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = jf(i * t, e), c = jf(-r * t, e);
    let u = st(t - a * n - c * s, e), d = st(-a * r - c * i, e);
    const l = u > o, y = d > o;
    if (l && (u = e - u), y && (d = e - d), u > o || d > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: d };
  }
}, Fn = 32, Ps = 32, k0 = 32, Ca = Fn + 1, Ta = 2 * Fn + 1;
function zf(t) {
  const { a: e, b: n } = oe, r = st(t * t), s = st(r * t);
  return st(s + e * t + n);
}
const Ro = oe.a === Xt;
class xu extends Error {
  constructor(e) {
    super(e);
  }
}
function Rf(t) {
  if (!(t instanceof ee))
    throw new TypeError("JacobianPoint expected");
}
class ee {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof jt))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(jt.ZERO) ? ee.ZERO : new ee(e.x, e.y, we);
  }
  static toAffineBatch(e) {
    const n = xb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return ee.toAffineBatch(e).map(ee.fromAffine);
  }
  equals(e) {
    Rf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = st(s * s), u = st(a * a), d = st(n * u), l = st(i * c), y = st(st(r * a) * u), p = st(st(o * s) * c);
    return d === l && y === p;
  }
  negate() {
    return new ee(this.x, st(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = st(e * e), i = st(n * n), o = st(i * i), a = e + i, c = st(ls * (st(a * a) - s - o)), u = st(uo * s), d = st(u * u), l = st(d - ls * c), y = st(u * (c - l) - Ff * o), p = st(ls * n * r);
    return new ee(l, y, p);
  }
  add(e) {
    Rf(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Xt || o === Xt)
      return this;
    if (n === Xt || r === Xt)
      return e;
    const c = st(s * s), u = st(a * a), d = st(n * u), l = st(i * c), y = st(st(r * a) * u), p = st(st(o * s) * c), v = st(l - d), x = st(p - y);
    if (v === Xt)
      return x === Xt ? this.double() : ee.ZERO;
    const T = st(v * v), q = st(v * T), W = st(d * T), E = st(x * x - q - ls * W), N = st(x * (W - E) - y * q), B = st(s * a * v);
    return new ee(E, N, B);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = ee.ZERO;
    if (typeof e == "bigint" && e === Xt)
      return n;
    let r = Vf(e);
    if (r === we)
      return this;
    if (!Ro) {
      let l = n, y = this;
      for (; r > Xt; )
        r & we && (l = l.add(y)), y = y.double(), r >>= we;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = zo.splitScalar(r), c = n, u = n, d = this;
    for (; i > Xt || a > Xt; )
      i & we && (c = c.add(d)), a & we && (u = u.add(d)), d = d.double(), i >>= we, a >>= we;
    return s && (c = c.negate()), o && (u = u.negate()), u = new ee(st(u.x * zo.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = Ro ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(ee.BASE) && (n = jt.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && gl.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = ee.normalizeZ(s), gl.set(n, s)));
    let i = ee.ZERO, o = ee.BASE;
    const a = 1 + (Ro ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), d = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const p = y * c;
      let v = Number(e & u);
      e >>= l, v > c && (v -= d, e += we);
      const x = p, T = p + Math.abs(v) - 1, q = y % 2 !== 0, W = v < 0;
      v === 0 ? o = o.add(Go(q, s[x])) : i = i.add(Go(W, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = Vf(e), s, i;
    if (Ro) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = zo.splitScalar(r);
      let { p: d, f: l } = this.wNAF(a, n), { p: y, f: p } = this.wNAF(u, n);
      d = Go(o, d), y = Go(c, y), y = new ee(st(y.x * zo.beta), y.y, y.z), s = d.add(y), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return ee.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(ee.ZERO);
    e == null && (e = i ? Ff : Vi(s));
    const o = e, a = st(o * o), c = st(a * o), u = st(n * a), d = st(r * c), l = st(s * o);
    if (i)
      return jt.ZERO;
    if (l !== we)
      throw new Error("invZ was invalid");
    return new jt(u, d);
  }
}
ee.BASE = new ee(oe.Gx, oe.Gy, we);
ee.ZERO = new ee(Xt, we, Xt);
function Go(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const gl = /* @__PURE__ */ new WeakMap();
class jt {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, gl.delete(this);
  }
  hasEvenY() {
    return this.y % ls === Xt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = xn(n ? e : e.subarray(1));
    if (!ma(r))
      throw new Error("Point is not on curve");
    const s = zf(r);
    let i = mb(s);
    const o = (i & we) === we;
    n ? o && (i = st(-i)) : (e[0] & 1) === 1 !== o && (i = st(-i));
    const a = new jt(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = xn(e.subarray(1, Fn + 1)), r = xn(e.subarray(Fn + 1, Fn * 2 + 1)), s = new jt(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = ir(e), r = n.length, s = n[0];
    if (r === Fn)
      return this.fromCompressedHex(n);
    if (r === Ca && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ta && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ca} compressed bytes or ${Ta} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return jt.BASE.multiply(_s(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = C0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = Su(ir(e)), { n: a } = oe, c = r === 2 || r === 3 ? s + a : s, u = Vi(c, a), d = st(-o * u, a), l = st(i * u, a), y = r & 1 ? "03" : "02", p = jt.fromHex(y + us(c)), v = jt.BASE.multiplyAndAddUnsafe(p, d, l);
    if (!v)
      throw new Error("Cannot recover signature: point at infinify");
    return v.assertValidity(), v;
  }
  toRawBytes(e = !1) {
    return fs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = us(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${us(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!ma(n) || !ma(r))
      throw new Error(e);
    const s = st(r * r), i = zf(n);
    if (st(s - i) !== Xt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new jt(this.x, st(-this.y));
  }
  double() {
    return ee.fromAffine(this).double().toAffine();
  }
  add(e) {
    return ee.fromAffine(this).add(ee.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return ee.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = ee.fromAffine(this), i = n === Xt || n === we || this !== jt.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = ee.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(ee.ZERO) ? void 0 : a.toAffine();
  }
}
jt.BASE = new jt(oe.Gx, oe.Gy);
jt.ZERO = new jt(Xt, Xt);
function Gf(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Kf(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ti(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: xn(n), left: t.subarray(e + 2) };
}
function yb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ti(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Kf(t.subarray(2)), { data: r, left: s } = Kf(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ti(s)}`);
  return { r: e, s: r };
}
class mn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? Ti(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new mn(Ba(s.slice(0, 64)), Ba(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = yb(n ? e : fs(e));
    return new mn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Mi(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Mi(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = oe.n >> we;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new mn(this.r, st(-this.s, oe.n)) : this;
  }
  toDERRawBytes() {
    return fs(this.toDERHex());
  }
  toDERHex() {
    const e = Gf(ro(this.s)), n = Gf(ro(this.r)), r = e.length / 2, s = n.length / 2, i = ro(r), o = ro(s);
    return `30${ro(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return fs(this.toCompactHex());
  }
  toCompactHex() {
    return us(this.r) + us(this.s);
  }
}
function as(...t) {
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
const wb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ti(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += wb[t[n]];
  return e;
}
const bb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function us(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Xt <= t && t < bb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Bi(t) {
  const e = fs(us(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function ro(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ba(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function fs(t) {
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
function xn(t) {
  return Ba(Ti(t));
}
function ir(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : fs(t);
}
function Vf(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Mi(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function st(t, e = oe.P) {
  const n = t % e;
  return n >= Xt ? n : e + n;
}
function kn(t, e) {
  const { P: n } = oe;
  let r = t;
  for (; e-- > Xt; )
    r *= r, r %= n;
  return r;
}
function mb(t) {
  const { P: e } = oe, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, d = kn(u, uo) * u % e, l = kn(d, uo) * u % e, y = kn(l, ls) * c % e, p = kn(y, r) * y % e, v = kn(p, s) * p % e, x = kn(v, o) * v % e, T = kn(x, a) * x % e, q = kn(T, o) * v % e, W = kn(q, uo) * u % e, E = kn(W, i) * p % e, N = kn(E, n) * c % e, B = kn(N, ls);
  if (B * B % e !== t)
    throw new Error("Cannot find square root");
  return B;
}
function Vi(t, e = oe.P) {
  if (t === Xt || e <= Xt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = st(t, e), r = e, s = Xt, i = we;
  for (; n !== Xt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== we)
    throw new Error("invert: does not exist");
  return st(s, e);
}
function xb(t, e = oe.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Xt ? i : (n[a] = i, st(i * o, e)), we), s = Vi(r, e);
  return t.reduceRight((i, o, a) => o === Xt ? i : (n[a] = st(i * n[a], e), st(i * o, e)), s), n;
}
function Sb(t) {
  const e = t.length * 8 - Ps * 8, n = xn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function Su(t, e = !1) {
  const n = Sb(t);
  if (e)
    return n;
  const { n: r } = oe;
  return n >= r ? n - r : n;
}
let $i, fo;
class I0 {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Be.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return fo(this.k, ...e);
  }
  checkSync() {
    if (typeof fo != "function")
      throw new xu("hmacSha256Sync needs to be set");
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
    return as(...n);
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
    return as(...n);
  }
}
function Mi(t) {
  return Xt < t && t < oe.n;
}
function ma(t) {
  return Xt < t && t < oe.P;
}
function L0(t, e, n, r = !0) {
  const { n: s } = oe, i = Su(t, !0);
  if (!Mi(i))
    return;
  const o = Vi(i, s), a = jt.BASE.multiply(i), c = st(a.x, s);
  if (c === Xt)
    return;
  const u = st(o * st(e + n * c, s), s);
  if (u === Xt)
    return;
  let d = new mn(c, u), l = (a.x === d.r ? 0 : 2) | Number(a.y & we);
  return r && d.hasHighS() && (d = d.normalizeS(), l ^= 1), { sig: d, recovery: l };
}
function _s(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ps)
      throw new Error("Expected 32 bytes of private key");
    e = Ba(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ps)
      throw new Error("Expected 32 bytes of private key");
    e = xn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Mi(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Eu(t) {
  return t instanceof jt ? (t.assertValidity(), t) : jt.fromHex(t);
}
function C0(t) {
  if (t instanceof mn)
    return t.assertValidity(), t;
  try {
    return mn.fromDER(t);
  } catch {
    return mn.fromCompact(t);
  }
}
function Mo(t, e = !1) {
  return jt.fromPrivateKey(t).toRawBytes(e);
}
function Eb(t, e, n, r = !1) {
  return jt.fromSignature(t, e, n).toRawBytes(r);
}
function qf(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ca || r === Ta : n ? r === Ca * 2 || r === Ta * 2 : t instanceof jt;
}
function Au(t, e, n = !1) {
  if (qf(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!qf(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = Eu(e);
  return r.assertValidity(), r.multiply(_s(t)).toRawBytes(n);
}
function T0(t) {
  const e = t.length > Fn ? t.slice(0, Fn) : t;
  return xn(e);
}
function Ab(t) {
  const e = T0(t), n = st(e, oe.n);
  return B0(n < Xt ? e : n);
}
function B0(t) {
  return Bi(t);
}
function M0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = ir(t), s = _s(e), i = [B0(s), Ab(r)];
  if (n != null) {
    n === !0 && (n = Be.randomBytes(Fn));
    const c = ir(n);
    if (c.length !== Fn)
      throw new Error(`sign: Expected ${Fn} bytes of extra data`);
    i.push(c);
  }
  const o = as(...i), a = T0(r);
  return { seed: o, m: a, d: s };
}
function N0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function vb(t, e, n = {}) {
  const { seed: r, m: s, d: i } = M0(t, e, n.extraEntropy), o = new I0(k0, Ps);
  await o.reseed(r);
  let a;
  for (; !(a = L0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return N0(a, n);
}
function ic(t, e, n = {}) {
  const { seed: r, m: s, d: i } = M0(t, e, n.extraEntropy), o = new I0(k0, Ps);
  o.reseedSync(r);
  let a;
  for (; !(a = L0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return N0(a, n);
}
const $b = { strict: !0 };
function kb(t, e, n, r = $b) {
  let s;
  try {
    s = C0(t), e = ir(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = Su(e);
  let c;
  try {
    c = Eu(n);
  } catch {
    return !1;
  }
  const { n: u } = oe, d = Vi(o, u), l = st(a * d, u), y = st(i * d, u), p = jt.BASE.multiplyAndAddUnsafe(c, l, y);
  return p ? st(p.x, u) === i : !1;
}
function Ma(t) {
  return st(xn(t), oe.n);
}
class Ni {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = ir(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = xn(n.subarray(0, 32)), s = xn(n.subarray(32, 64));
    return new Ni(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!ma(e) || !Mi(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return us(this.r) + us(this.s);
  }
  toRawBytes() {
    return fs(this.toHex());
  }
}
function Ib(t) {
  return jt.fromPrivateKey(t).toRawX();
}
class P0 {
  constructor(e, n, r = Be.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = ir(e);
    const { x: s, scalar: i } = this.getScalar(_s(n));
    if (this.px = s, this.d = i, this.rand = ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = jt.fromPrivateKey(e), r = n.hasEvenY() ? e : oe.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Bi(e ^ xn(n));
  }
  finalizeNonce(e) {
    const n = st(xn(e), oe.n);
    if (n === Xt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Ni(e.x, st(n + r * s, oe.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Be.taggedHash, o = this.initNonce(n, await i(os.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(os.nonce, o, r, e)), d = Ma(await i(os.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return await H0(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Be.taggedHashSync, o = this.initNonce(n, i(os.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(os.nonce, o, r, e)), d = Ma(i(os.challenge, c, r, e)), l = this.finalizeSig(a, u, d, n);
    return O0(l, e, r) || this.error(), l;
  }
}
async function Lb(t, e, n) {
  return new P0(t, e, n).calc();
}
function Cb(t, e, n) {
  return new P0(t, e, n).calcSync();
}
function _0(t, e, n) {
  const r = t instanceof Ni, s = r ? t : Ni.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: ir(e),
    P: Eu(n)
  };
}
function U0(t, e, n, r) {
  const s = jt.BASE.multiplyAndAddUnsafe(e, _s(n), st(-r, oe.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function H0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _0(t, e, n), a = Ma(await Be.taggedHash(os.challenge, Bi(r), o.toRawX(), i));
    return U0(r, o, s, a);
  } catch {
    return !1;
  }
}
function O0(t, e, n) {
  try {
    const { r, s, m: i, P: o } = _0(t, e, n), a = Ma(Be.taggedHashSync(os.challenge, Bi(r), o.toRawX(), i));
    return U0(r, o, s, a);
  } catch (r) {
    if (r instanceof xu)
      throw r;
    return !1;
  }
}
const Tb = {
  Signature: Ni,
  getPublicKey: Ib,
  sign: Lb,
  verify: H0,
  signSync: Cb,
  verifySync: O0
};
jt.BASE._setWindowSize(8);
const dn = {
  node: $0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, os = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, Ko = {}, Be = {
  bytesToHex: Ti,
  hexToBytes: fs,
  concatBytes: as,
  mod: st,
  invert: Vi,
  isValidPrivateKey(t) {
    try {
      return _s(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Bi,
  _normalizePrivateKey: _s,
  hashToPrivateKey: (t) => {
    t = ir(t);
    const e = Ps + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = st(xn(t), oe.n - we) + we;
    return Bi(n);
  },
  randomBytes: (t = 32) => {
    if (dn.web)
      return dn.web.getRandomValues(new Uint8Array(t));
    if (dn.node) {
      const { randomBytes: e } = dn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Be.hashToPrivateKey(Be.randomBytes(Ps + 8)),
  precompute(t = 8, e = jt.BASE) {
    const n = e === jt.BASE ? e : new jt(e.x, e.y);
    return n._setWindowSize(t), n.multiply(uo), n;
  },
  sha256: async (...t) => {
    if (dn.web) {
      const e = await dn.web.subtle.digest("SHA-256", as(...t));
      return new Uint8Array(e);
    } else if (dn.node) {
      const { createHash: e } = dn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (dn.web) {
      const n = await dn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = as(...e), s = await dn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (dn.node) {
      const { createHmac: n } = dn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = Ko[t];
    if (n === void 0) {
      const r = await Be.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = as(r, r), Ko[t] = n;
    }
    return Be.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof $i != "function")
      throw new xu("sha256Sync is undefined, you need to set it");
    let n = Ko[t];
    if (n === void 0) {
      const r = $i(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = as(r, r), Ko[t] = n;
    }
    return $i(n, ...e);
  },
  _JacobianPoint: ee
};
Object.defineProperties(Be, {
  sha256Sync: {
    configurable: !1,
    get() {
      return $i;
    },
    set(t) {
      $i || ($i = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return fo;
    },
    set(t) {
      fo || (fo = t);
    }
  }
});
const Bb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: oe,
  Point: jt,
  Signature: mn,
  getPublicKey: Mo,
  getSharedSecret: Au,
  recoverPublicKey: Eb,
  schnorr: Tb,
  sign: vb,
  signSync: ic,
  utils: Be,
  verify: kb
}, Symbol.toStringTag, { value: "Module" }));
var No = {};
No.byteLength = Ub;
var Mb = No.toByteArray = Ob, Nb = No.fromByteArray = jb, Zn = [], Ln = [], Pb = typeof Uint8Array < "u" ? Uint8Array : Array, Oc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var pi = 0, _b = Oc.length; pi < _b; ++pi)
  Zn[pi] = Oc[pi], Ln[Oc.charCodeAt(pi)] = pi;
Ln[45] = 62;
Ln[95] = 63;
function D0(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Ub(t) {
  var e = D0(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Hb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Ob(t) {
  var e, n = D0(t), r = n[0], s = n[1], i = new Pb(Hb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Ln[t.charCodeAt(c)] << 18 | Ln[t.charCodeAt(c + 1)] << 12 | Ln[t.charCodeAt(c + 2)] << 6 | Ln[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Ln[t.charCodeAt(c)] << 2 | Ln[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Ln[t.charCodeAt(c)] << 10 | Ln[t.charCodeAt(c + 1)] << 4 | Ln[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Db(t) {
  return Zn[t >> 18 & 63] + Zn[t >> 12 & 63] + Zn[t >> 6 & 63] + Zn[t & 63];
}
function Fb(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Db(r));
  return s.join("");
}
function jb(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Fb(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    Zn[e >> 2] + Zn[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    Zn[e >> 10] + Zn[e >> 4 & 63] + Zn[e << 2 & 63] + "="
  )), s.join("");
}
function zb() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const Rb = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function Gb() {
  if (zb())
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
    throw new Error(Rb);
  }
}
class Kb {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(sr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(sr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class Vb {
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
async function F0() {
  const t = await Gb();
  return t.name === "subtleCrypto" ? new Vb(t.lib) : new Kb(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function qb(t) {
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
    for (var v = 0, x = 0, T = 0, q = p.length; T !== q && p[T] === 0; )
      T++, v++;
    for (var W = (q - T) * u + 1 >>> 0, E = new Uint8Array(W); T !== q; ) {
      for (var N = p[T], B = 0, tt = W - 1; (N !== 0 || B < x) && tt !== -1; tt--, B++)
        N += 256 * E[tt] >>> 0, E[tt] = N % o >>> 0, N = N / o >>> 0;
      if (N !== 0)
        throw new Error("Non-zero carry");
      x = B, T++;
    }
    for (var et = W - x; et !== W && E[et] === 0; )
      et++;
    for (var K = a.repeat(v); et < W; ++et)
      K += t.charAt(E[et]);
    return K;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var v = 0, x = 0, T = 0; p[v] === a; )
      x++, v++;
    for (var q = (p.length - v) * c + 1 >>> 0, W = new Uint8Array(q); p[v]; ) {
      var E = p.charCodeAt(v);
      if (E > 255)
        return;
      var N = e[E];
      if (N === 255)
        return;
      for (var B = 0, tt = q - 1; (N !== 0 || B < T) && tt !== -1; tt--, B++)
        N += o * W[tt] >>> 0, W[tt] = N % 256 >>> 0, N = N / 256 >>> 0;
      if (N !== 0)
        throw new Error("Non-zero carry");
      T = B, v++;
    }
    for (var et = q - T; et !== q && W[et] === 0; )
      et++;
    for (var K = new Uint8Array(x + (q - et)), j = x; et !== q; )
      K[j++] = W[et++];
    return K;
  }
  function y(p) {
    var v = l(p);
    if (v)
      return v;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: d,
    decodeUnsafe: l,
    decode: y
  };
}
var j0 = qb;
const Wb = j0, Xb = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var Yb = Wb(Xb);
const Zb = /* @__PURE__ */ f0(Yb), Qb = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), z0 = Uint8Array.from({ length: 16 }, (t, e) => e), Jb = z0.map((t) => (9 * t + 5) % 16);
let vu = [z0], $u = [Jb];
for (let t = 0; t < 4; t++)
  for (let e of [vu, $u])
    e.push(e[t].map((n) => Qb[n]));
const R0 = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), tm = vu.map((t, e) => t.map((n) => R0[e][n])), em = $u.map((t, e) => t.map((n) => R0[e][n])), nm = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), rm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Vo = (t, e) => t << e | t >>> 32 - e;
function Wf(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const qo = new Uint32Array(16);
let sm = class extends mu {
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
      qo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, x = nm[p], T = rm[p], q = vu[p], W = $u[p], E = tm[p], N = em[p];
      for (let B = 0; B < 16; B++) {
        const tt = Vo(r + Wf(p, i, a, u) + qo[q[B]] + x, E[B]) + l | 0;
        r = l, l = u, u = Vo(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = Vo(s + Wf(v, o, c, d) + qo[W[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = Vo(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const im = Qs(() => new sm());
function om(t) {
  return im(t);
}
const Wo = BigInt(2 ** 32 - 1), yl = BigInt(32);
function G0(t, e = !1) {
  return e ? { h: Number(t & Wo), l: Number(t >> yl & Wo) } : { h: Number(t >> yl & Wo) | 0, l: Number(t & Wo) | 0 };
}
function am(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = G0(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const cm = (t, e) => BigInt(t >>> 0) << yl | BigInt(e >>> 0), lm = (t, e, n) => t >>> n, um = (t, e, n) => t << 32 - n | e >>> n, fm = (t, e, n) => t >>> n | e << 32 - n, dm = (t, e, n) => t << 32 - n | e >>> n, hm = (t, e, n) => t << 64 - n | e >>> n - 32, pm = (t, e, n) => t >>> n - 32 | e << 64 - n, gm = (t, e) => e, ym = (t, e) => t, wm = (t, e, n) => t << n | e >>> 32 - n, bm = (t, e, n) => e << n | t >>> 32 - n, mm = (t, e, n) => e << n - 32 | t >>> 64 - n, xm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Sm(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Em = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Am = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, vm = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), $m = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, km = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Im = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: G0,
  split: am,
  toBig: cm,
  shrSH: lm,
  shrSL: um,
  rotrSH: fm,
  rotrSL: dm,
  rotrBH: hm,
  rotrBL: pm,
  rotr32H: gm,
  rotr32L: ym,
  rotlSH: wm,
  rotlSL: bm,
  rotlBH: mm,
  rotlBL: xm,
  add: Sm,
  add3L: Em,
  add3H: Am,
  add4L: vm,
  add4H: $m,
  add5H: Im,
  add5L: km
}, [Lm, Cm] = Nt.split([
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
].map((t) => BigInt(t))), Dr = new Uint32Array(80), Fr = new Uint32Array(80);
let oc = class extends mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: v, Hh: x, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Dr[E] = e.getUint32(n), Fr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const N = Dr[E - 15] | 0, B = Fr[E - 15] | 0, tt = Nt.rotrSH(N, B, 1) ^ Nt.rotrSH(N, B, 8) ^ Nt.shrSH(N, B, 7), et = Nt.rotrSL(N, B, 1) ^ Nt.rotrSL(N, B, 8) ^ Nt.shrSL(N, B, 7), K = Dr[E - 2] | 0, j = Fr[E - 2] | 0, $ = Nt.rotrSH(K, j, 19) ^ Nt.rotrBH(K, j, 61) ^ Nt.shrSH(K, j, 6), P = Nt.rotrSL(K, j, 19) ^ Nt.rotrBL(K, j, 61) ^ Nt.shrSL(K, j, 6), M = Nt.add4L(et, P, Fr[E - 7], Fr[E - 16]), V = Nt.add4H(M, tt, $, Dr[E - 7], Dr[E - 16]);
      Dr[E] = V | 0, Fr[E] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: v, Gh: x, Gl: T, Hh: q, Hl: W } = this;
    for (let E = 0; E < 80; E++) {
      const N = Nt.rotrSH(l, y, 14) ^ Nt.rotrSH(l, y, 18) ^ Nt.rotrBH(l, y, 41), B = Nt.rotrSL(l, y, 14) ^ Nt.rotrSL(l, y, 18) ^ Nt.rotrBL(l, y, 41), tt = l & p ^ ~l & x, et = y & v ^ ~y & T, K = Nt.add5L(W, B, et, Cm[E], Fr[E]), j = Nt.add5H(K, q, N, tt, Lm[E], Dr[E]), $ = K | 0, P = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), M = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      q = x | 0, W = T | 0, x = p | 0, T = v | 0, p = l | 0, v = y | 0, { h: l, l: y } = Nt.add(u | 0, d | 0, j | 0, $ | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = Nt.add3L($, M, ct);
      r = Nt.add3H(X, j, P, V), s = X | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Nt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: v } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: x, l: T } = Nt.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: q, l: W } = Nt.add(this.Hh | 0, this.Hl | 0, q | 0, W | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, v, x, T, q, W);
  }
  roundClean() {
    Dr.fill(0), Fr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Tm = class extends oc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Bm = class extends oc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Mm = class extends oc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Nm = Qs(() => new oc());
Qs(() => new Tm());
Qs(() => new Bm());
Qs(() => new Mm());
function K0(t) {
  return Ci(t);
}
function Pm(t) {
  return Nm(t);
}
const _m = 0;
Be.hmacSha256Sync = (t, ...e) => {
  const n = sc.create(Ci, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Um() {
  return mt(Be.randomPrivateKey());
}
function Hm(t) {
  const e = Ci(Ci(t));
  return Zb.encode(sr(t, e).slice(0, t.length + 4));
}
function Om(t, e) {
  return Hm(sr(new Uint8Array([t]), e.slice(0, 20)));
}
function V0(t, e = _m) {
  const n = typeof t == "string" ? Qt(t) : t, r = om(K0(n));
  return Om(e, r);
}
function q0(t) {
  const e = wu(t);
  return mt(Mo(e.slice(0, 32), !0));
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = sc.create(Ci, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var Na;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(Na || (Na = {}));
async function Dm(t, e, n) {
  return await (await F0()).encrypt("aes-256-cbc", e, t, n);
}
async function Fm(t, e, n) {
  return await (await F0()).decrypt("aes-256-cbc", e, t, n);
}
function W0(t, e) {
  return sc(Ci, t, e);
}
function jm(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function X0(t) {
  const e = Pm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function zm(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function Rm(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: Na.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: Na.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !zm(t))
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
async function Gm(t, e, n, r) {
  const s = Rm(t);
  if (!s.result)
    throw s;
  const i = Be.randomPrivateKey(), o = Mo(i, !0);
  let a = Au(i, t, !0);
  a = a.slice(1);
  const c = X0(a), u = Be.randomBytes(16), d = await Dm(u, c.encryptionKey, e), l = sr(u, o, d), y = W0(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = mt(d);
  else if (r === "base64")
    p = Nb(d);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const v = {
    iv: mt(u),
    ephemeralPK: mt(o),
    cipherText: p,
    mac: mt(y),
    wasString: n
  };
  return r && r !== "hex" && (v.cipherTextEncoding = r), v;
}
async function Y0(t, e) {
  if (!e.ephemeralPK)
    throw new Uf("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Au(t, n, !0);
  r = r.slice(1);
  const s = X0(r), i = Qt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Qt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Mb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = sr(i, Qt(n), o), c = W0(s.hmacKey, a), u = Qt(e.mac);
  if (!jm(u, c))
    throw new Uf("Decryption failed: failure in MAC check");
  const d = await Fm(i, s.encryptionKey, o);
  return e.wasString ? Bo(d) : d;
}
function Km(t, e) {
  const n = typeof e == "string" ? Zs(e) : e, r = q0(t), s = K0(n), i = ic(s, t);
  return {
    signature: mt(i),
    publicKey: r
  };
}
async function Vm(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = q0(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Zs(t) : t, o = await Gm(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = Km(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function qm(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return Y0(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var qe = {}, Pi = {}, Qe = {};
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.decode = Qe.encode = Qe.unescape = Qe.escape = Qe.pad = void 0;
const Z0 = No;
function ku(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
Qe.pad = ku;
function Q0(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
Qe.escape = Q0;
function J0(t) {
  return ku(t).replace(/-/g, "+").replace(/_/g, "/");
}
Qe.unescape = J0;
function Wm(t) {
  return Q0((0, Z0.fromByteArray)(new TextEncoder().encode(t)));
}
Qe.encode = Wm;
function Xm(t) {
  return new TextDecoder().decode((0, Z0.toByteArray)(ku(J0(t))));
}
Qe.decode = Xm;
var ac = {}, cc = {}, tp = {}, ep = {}, lc = {};
Object.defineProperty(lc, "__esModule", { value: !0 });
lc.crypto = void 0;
lc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = d, t.createView = l, t.rotr = y, t.rotl = p, t.byteSwap = v, t.byteSwap32 = x, t.bytesToHex = W, t.hexToBytes = B, t.asyncLoop = et, t.utf8ToBytes = K, t.bytesToUtf8 = j, t.toBytes = $, t.kdfInputToBytes = P, t.concatBytes = M, t.checkOpts = V, t.createHasher = X, t.createOptHasher = L, t.createXOFer = rt, t.randomBytes = ne;
  const e = lc;
  function n(k) {
    return k instanceof Uint8Array || ArrayBuffer.isView(k) && k.constructor.name === "Uint8Array";
  }
  function r(k) {
    if (!Number.isSafeInteger(k) || k < 0)
      throw new Error("positive integer expected, got " + k);
  }
  function s(k, ...U) {
    if (!n(k))
      throw new Error("Uint8Array expected");
    if (U.length > 0 && !U.includes(k.length))
      throw new Error("Uint8Array expected of length " + U + ", got length=" + k.length);
  }
  function i(k) {
    if (typeof k != "function" || typeof k.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(k.outputLen), r(k.blockLen);
  }
  function o(k, U = !0) {
    if (k.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (U && k.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(k, U) {
    s(k);
    const xt = U.outputLen;
    if (k.length < xt)
      throw new Error("digestInto() expects output buffer of length at least " + xt);
  }
  function c(k) {
    return new Uint8Array(k.buffer, k.byteOffset, k.byteLength);
  }
  function u(k) {
    return new Uint32Array(k.buffer, k.byteOffset, Math.floor(k.byteLength / 4));
  }
  function d(...k) {
    for (let U = 0; U < k.length; U++)
      k[U].fill(0);
  }
  function l(k) {
    return new DataView(k.buffer, k.byteOffset, k.byteLength);
  }
  function y(k, U) {
    return k << 32 - U | k >>> U;
  }
  function p(k, U) {
    return k << U | k >>> 32 - U >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function v(k) {
    return k << 24 & 4278190080 | k << 8 & 16711680 | k >>> 8 & 65280 | k >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (k) => k : (k) => v(k), t.byteSwapIfBE = t.swap8IfBE;
  function x(k) {
    for (let U = 0; U < k.length; U++)
      k[U] = v(k[U]);
    return k;
  }
  t.swap32IfBE = t.isLE ? (k) => k : x;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", q = /* @__PURE__ */ Array.from({ length: 256 }, (k, U) => U.toString(16).padStart(2, "0"));
  function W(k) {
    if (s(k), T)
      return k.toHex();
    let U = "";
    for (let xt = 0; xt < k.length; xt++)
      U += q[k[xt]];
    return U;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function N(k) {
    if (k >= E._0 && k <= E._9)
      return k - E._0;
    if (k >= E.A && k <= E.F)
      return k - (E.A - 10);
    if (k >= E.a && k <= E.f)
      return k - (E.a - 10);
  }
  function B(k) {
    if (typeof k != "string")
      throw new Error("hex string expected, got " + typeof k);
    if (T)
      return Uint8Array.fromHex(k);
    const U = k.length, xt = U / 2;
    if (U % 2)
      throw new Error("hex string expected, got unpadded hex of length " + U);
    const Ot = new Uint8Array(xt);
    for (let Tt = 0, Yt = 0; Tt < xt; Tt++, Yt += 2) {
      const ie = N(k.charCodeAt(Yt)), S = N(k.charCodeAt(Yt + 1));
      if (ie === void 0 || S === void 0) {
        const _ = k[Yt] + k[Yt + 1];
        throw new Error('hex string expected, got non-hex character "' + _ + '" at index ' + Yt);
      }
      Ot[Tt] = ie * 16 + S;
    }
    return Ot;
  }
  const tt = async () => {
  };
  t.nextTick = tt;
  async function et(k, U, xt) {
    let Ot = Date.now();
    for (let Tt = 0; Tt < k; Tt++) {
      xt(Tt);
      const Yt = Date.now() - Ot;
      Yt >= 0 && Yt < U || (await (0, t.nextTick)(), Ot += Yt);
    }
  }
  function K(k) {
    if (typeof k != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(k));
  }
  function j(k) {
    return new TextDecoder().decode(k);
  }
  function $(k) {
    return typeof k == "string" && (k = K(k)), s(k), k;
  }
  function P(k) {
    return typeof k == "string" && (k = K(k)), s(k), k;
  }
  function M(...k) {
    let U = 0;
    for (let Ot = 0; Ot < k.length; Ot++) {
      const Tt = k[Ot];
      s(Tt), U += Tt.length;
    }
    const xt = new Uint8Array(U);
    for (let Ot = 0, Tt = 0; Ot < k.length; Ot++) {
      const Yt = k[Ot];
      xt.set(Yt, Tt), Tt += Yt.length;
    }
    return xt;
  }
  function V(k, U) {
    if (U !== void 0 && {}.toString.call(U) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(k, U);
  }
  class ct {
  }
  t.Hash = ct;
  function X(k) {
    const U = (Ot) => k().update($(Ot)).digest(), xt = k();
    return U.outputLen = xt.outputLen, U.blockLen = xt.blockLen, U.create = () => k(), U;
  }
  function L(k) {
    const U = (Ot, Tt) => k(Tt).update($(Ot)).digest(), xt = k({});
    return U.outputLen = xt.outputLen, U.blockLen = xt.blockLen, U.create = (Ot) => k(Ot), U;
  }
  function rt(k) {
    const U = (Ot, Tt) => k(Tt).update($(Ot)).digest(), xt = k({});
    return U.outputLen = xt.outputLen, U.blockLen = xt.blockLen, U.create = (Ot) => k(Ot), U;
  }
  t.wrapConstructor = X, t.wrapConstructorWithOpts = L, t.wrapXOFConstructorWithOpts = rt;
  function ne(k = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(k));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(k));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(ep);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = ep;
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
})(tp);
const gi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function np(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Js(t, ...e) {
  if (!np(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function Ym(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  wl(t.outputLen), wl(t.blockLen);
}
function bl(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function rp(t, e) {
  Js(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function Zm(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function Qm(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Pa(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function xa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function _n(t, e) {
  return t << 32 - e | t >>> e;
}
function Jm(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Iu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Lu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const sp = Iu ? (t) => t : (t) => Lu(t), t1 = sp;
function ip(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Lu(t[e]);
  return t;
}
const e1 = Iu ? (t) => t : ip, op = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", n1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ap(t) {
  if (Js(t), op)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += n1[t[n]];
  return e;
}
const xr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function Xf(t) {
  if (t >= xr._0 && t <= xr._9)
    return t - xr._0;
  if (t >= xr.A && t <= xr.F)
    return t - (xr.A - 10);
  if (t >= xr.a && t <= xr.f)
    return t - (xr.a - 10);
}
function r1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (op)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = Xf(t.charCodeAt(i)), a = Xf(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const cp = async () => {
};
async function s1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await cp(), r += i);
  }
}
function Cu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function i1(t) {
  return new TextDecoder().decode(t);
}
function Po(t) {
  return typeof t == "string" && (t = Cu(t)), Js(t), t;
}
function o1(t) {
  return typeof t == "string" && (t = Cu(t)), Js(t), t;
}
function a1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Js(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function c1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let lp = class {
};
function uc(t) {
  const e = (r) => t().update(Po(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function up(t) {
  const e = (r, s) => t(s).update(Po(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function fp(t) {
  const e = (r, s) => t(s).update(Po(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const l1 = uc, u1 = up, f1 = fp;
function d1(t = 32) {
  if (gi && typeof gi.getRandomValues == "function")
    return gi.getRandomValues(new Uint8Array(t));
  if (gi && typeof gi.randomBytes == "function")
    return Uint8Array.from(gi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const h1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: lp,
  abytes: Js,
  aexists: bl,
  ahash: Ym,
  anumber: wl,
  aoutput: rp,
  asyncLoop: s1,
  byteSwap: Lu,
  byteSwap32: ip,
  byteSwapIfBE: t1,
  bytesToHex: ap,
  bytesToUtf8: i1,
  checkOpts: c1,
  clean: Pa,
  concatBytes: a1,
  createHasher: uc,
  createOptHasher: up,
  createView: xa,
  createXOFer: fp,
  hexToBytes: r1,
  isBytes: np,
  isLE: Iu,
  kdfInputToBytes: o1,
  nextTick: cp,
  randomBytes: d1,
  rotl: Jm,
  rotr: _n,
  swap32IfBE: e1,
  swap8IfBE: sp,
  toBytes: Po,
  u32: Qm,
  u8: Zm,
  utf8ToBytes: Cu,
  wrapConstructor: l1,
  wrapConstructorWithOpts: u1,
  wrapXOFConstructorWithOpts: f1
}, Symbol.toStringTag, { value: "Module" }));
function p1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function g1(t, e, n) {
  return t & e ^ ~t & n;
}
function y1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class w1 extends lp {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = xa(this.buffer);
  }
  update(e) {
    bl(this), e = Po(e), Js(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = xa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    bl(this), rp(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Pa(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    p1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = xa(e), c = this.outputLen;
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
const jr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), zr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), b1 = /* @__PURE__ */ Uint32Array.from([
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
]), Rr = /* @__PURE__ */ new Uint32Array(64);
let Tu = class extends w1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = jr[0] | 0, this.B = jr[1] | 0, this.C = jr[2] | 0, this.D = jr[3] | 0, this.E = jr[4] | 0, this.F = jr[5] | 0, this.G = jr[6] | 0, this.H = jr[7] | 0;
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
      Rr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Rr[l - 15], p = Rr[l - 2], v = _n(y, 7) ^ _n(y, 18) ^ y >>> 3, x = _n(p, 17) ^ _n(p, 19) ^ p >>> 10;
      Rr[l] = x + Rr[l - 7] + v + Rr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = _n(a, 6) ^ _n(a, 11) ^ _n(a, 25), p = d + y + g1(a, c, u) + b1[l] + Rr[l] | 0, x = (_n(r, 2) ^ _n(r, 13) ^ _n(r, 22)) + y1(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Pa(Rr);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Pa(this.buffer);
  }
}, dp = class extends Tu {
  constructor() {
    super(28), this.A = zr[0] | 0, this.B = zr[1] | 0, this.C = zr[2] | 0, this.D = zr[3] | 0, this.E = zr[4] | 0, this.F = zr[5] | 0, this.G = zr[6] | 0, this.H = zr[7] | 0;
  }
};
const m1 = /* @__PURE__ */ uc(() => new Tu()), x1 = /* @__PURE__ */ uc(() => new dp()), S1 = Tu, hp = m1, E1 = dp, A1 = x1, v1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: E1,
  SHA256: S1,
  sha224: A1,
  sha256: hp
}, Symbol.toStringTag, { value: "Module" })), fc = /* @__PURE__ */ nc(v1), $1 = /* @__PURE__ */ nc(Bb);
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.joseToDer = _i.derToJose = void 0;
const pp = No, gp = Qe;
function Dc(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const k1 = {
  ES256: Dc(256),
  ES384: Dc(384),
  ES512: Dc(521)
};
function yp(t) {
  const e = k1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const _a = 128, wp = 0, I1 = 32, L1 = 16, C1 = 2, bp = L1 | I1 | wp << 6, Ua = C1 | wp << 6;
function mp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, pp.toByteArray)((0, gp.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function T1(t, e) {
  const n = mp(t), r = yp(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== bp)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (_a | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ua)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ua)
    throw new Error('Could not find expected "int" for "s"');
  const d = n[o++];
  if (i - o !== d)
    throw new Error(`"s" specified length of "${d}", expected "${i - o}"`);
  if (s < d)
    throw new Error(`"s" specified length of "${d}", max of "${s}" is acceptable`);
  const l = o;
  if (o += d, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, p = r - d, v = new Uint8Array(y + c + p + d);
  for (o = 0; o < y; ++o)
    v[o] = 0;
  v.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const x = o; o < x + p; ++o)
    v[o] = 0;
  return v.set(n.subarray(l + Math.max(-p, 0), l + d), o), (0, gp.escape)((0, pp.fromByteArray)(v));
}
_i.derToJose = T1;
function Yf(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= _a && --r, r;
}
function B1(t, e) {
  t = mp(t);
  const n = yp(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = Yf(t, 0, n), i = Yf(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < _a, d = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return d[l++] = bp, u ? d[l++] = c : (d[l++] = _a | 1, d[l++] = c & 255), d[l++] = Ua, d[l++] = o, s < 0 ? (d[l++] = 0, d.set(t.subarray(0, n), l), l += n) : (d.set(t.subarray(s, n), l), l += n - s), d[l++] = Ua, d[l++] = a, i < 0 ? (d[l++] = 0, d.set(t.subarray(n), l)) : d.set(t.subarray(n + i), l), d;
}
_i.joseToDer = B1;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
Lr.InvalidTokenError = Lr.MissingParametersError = void 0;
class M1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Lr.MissingParametersError = M1;
class N1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Lr.InvalidTokenError = N1;
const _o = /* @__PURE__ */ nc(h1);
Object.defineProperty(cc, "__esModule", { value: !0 });
cc.SECP256K1Client = void 0;
const P1 = tp, _1 = fc, Sa = $1, Zf = _i, Qf = Lr, Jf = _o;
Sa.utils.hmacSha256Sync = (t, ...e) => {
  const n = P1.hmac.create(_1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class xp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, Jf.bytesToHex)(Sa.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new Qf.MissingParametersError("a signing input hash and private key are all required");
    const s = Sa.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, Jf.bytesToHex)(s);
    if (r === "jose")
      return (0, Zf.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, Zf.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new Qf.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return Sa.verify(n, e, r, { strict: !1 });
  }
}
cc.SECP256K1Client = xp;
xp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = cc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(ac);
var Us = {};
const U1 = /* @__PURE__ */ nc($0);
var H1 = tn && tn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Us, "__esModule", { value: !0 });
Us.hashSha256Async = Us.hashSha256 = void 0;
const O1 = fc;
function Sp(t) {
  return (0, O1.sha256)(t);
}
Us.hashSha256 = Sp;
function D1(t) {
  return H1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = U1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Sp(t));
    }
  });
}
Us.hashSha256Async = D1;
var F1 = tn && tn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.TokenSigner = Pi.createUnsecuredToken = void 0;
const ml = Qe, td = ac, j1 = Lr, ed = Us;
function xl(t, e) {
  const n = [], r = ml.encode(JSON.stringify(e));
  n.push(r);
  const s = ml.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function z1(t) {
  return xl(t, { typ: "JWT", alg: "none" }) + ".";
}
Pi.createUnsecuredToken = z1;
class R1 {
  constructor(e, n) {
    if (!(e && n))
      throw new j1.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !td.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = td.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = xl(e, s), o = (0, ed.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return F1(this, void 0, void 0, function* () {
      const s = this.header(r), i = xl(e, s), o = yield (0, ed.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [ml.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
Pi.TokenSigner = R1;
var dc = {};
Object.defineProperty(dc, "__esModule", { value: !0 });
dc.TokenVerifier = void 0;
const G1 = Qe, nd = ac, K1 = Lr, Xo = Us;
class V1 {
  constructor(e, n) {
    if (!(e && n))
      throw new K1.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !nd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = nd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Xo.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Xo.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), G1.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Xo.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Xo.hashSha256)(r);
      return i(o);
    }
  }
}
dc.TokenVerifier = V1;
var hc = {};
Object.defineProperty(hc, "__esModule", { value: !0 });
hc.decodeToken = void 0;
const Yo = Qe;
function q1(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Yo.decode(e[0])), r = JSON.parse(Yo.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Yo.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Yo.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
hc.decodeToken = q1;
(function(t) {
  var e = tn && tn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = tn && tn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(Pi, t), n(dc, t), n(hc, t), n(Lr, t), n(ac, t);
})(qe);
function W1(t) {
  return `did:btc-addr:${t}`;
}
function X1(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new _f("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new _f('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ep(t) {
  if (t)
    return X1(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const Y1 = "1.4.0";
function Z1() {
  return Um();
}
function Q1(t, e, n, r = g0.slice(), s, i = Nw().getTime(), o = {}) {
  const a = (p) => {
    const v = gu("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return v == null ? void 0 : v.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: _w(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: Y1,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = qe.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const d = V0(u);
  return c.iss = W1(d), new qe.TokenSigner("ES256k", t).sign(c);
}
async function rd(t, e) {
  const n = Bo(Qt(e)), r = JSON.parse(n), s = await Y0(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function J1(t) {
  const e = qe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new qe.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function t2(t) {
  const e = qe.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ep(e.iss);
  if (n.length === 1) {
    if (V0(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function e2(t) {
  const e = qe.decodeToken(t).payload;
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
function n2(t) {
  const e = qe.decodeToken(t).payload;
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
function r2(t) {
  const e = [
    n2(t),
    e2(t),
    J1(t),
    t2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const sd = "1.0.0";
class ds {
  constructor(e) {
    this.version = sd, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== sd)
      throw new fl(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new ds(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Ap {
  constructor(e) {
    if (e) {
      const n = new ds(e);
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
class id extends Ap {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new ds({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new y0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new ds({})), !0;
  }
}
class od extends Ap {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Tw, !localStorage.getItem(this.key)) {
      const r = new ds({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new y0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return ds.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new ds({})), !0;
  }
}
var bo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(bo || (bo = {}));
var Ha;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ha || (Ha = {}));
bo.Mainnet;
var kr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(kr || (kr = {}));
var tr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(tr || (tr = {}));
kr.Mainnet;
const vp = {
  chainId: bo.Mainnet,
  transactionVersion: kr.Mainnet,
  peerNetworkId: Ha.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: tr.MainnetSingleSig,
    multiSig: tr.MainnetMultiSig
  },
  client: { baseUrl: w0 }
}, Sl = {
  chainId: bo.Testnet,
  transactionVersion: kr.Testnet,
  peerNetworkId: Ha.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: tr.TestnetSingleSig,
    multiSig: tr.TestnetMultiSig
  },
  client: { baseUrl: b0 }
}, Ea = {
  ...Sl,
  addressVersion: { ...Sl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: m0 }
}, s2 = {
  ...Ea,
  addressVersion: { ...Ea.addressVersion },
  client: { ...Ea.client }
};
function i2(t) {
  switch (t) {
    case "mainnet":
      return vp;
    case "testnet":
      return Sl;
    case "devnet":
      return Ea;
    case "mocknet":
      return s2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function $p(t) {
  return typeof t == "string" ? i2(t) : t;
}
var ad;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ad || (ad = {}));
var cd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(cd || (cd = {}));
var Un;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Un || (Un = {}));
const Fc = ["onChainOnly", "offChainOnly", "any"];
Fc[0] + "", Un.OnChainOnly, Fc[1] + "", Un.OffChainOnly, Fc[2] + "", Un.Any, Un.OnChainOnly + "", Un.OnChainOnly, Un.OffChainOnly + "", Un.OffChainOnly, Un.Any + "", Un.Any;
var ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(ld || (ld = {}));
var ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ud || (ud = {}));
var fd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(fd || (fd = {}));
var $r;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})($r || ($r = {}));
var dd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(dd || (dd = {}));
var hd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(hd || (hd = {}));
var pd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(pd || (pd = {}));
var gd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(gd || (gd = {}));
var yd;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(yd || (yd = {}));
var wd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(wd || (wd = {}));
var bd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(bd || (bd = {}));
var md;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(md || (md = {}));
var xd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(xd || (xd = {}));
function El(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function o2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function kp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function a2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  El(t.outputLen), El(t.blockLen);
}
function c2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function l2(t, e) {
  kp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Es = {
  number: El,
  bool: o2,
  bytes: kp,
  hash: a2,
  exists: c2,
  output: l2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const jc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Vn = (t, e) => t << 32 - e | t >>> e, u2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!u2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function f2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bu(t) {
  if (typeof t == "string" && (t = f2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Ip = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ti(t) {
  const e = (r) => t().update(Bu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Lp = class extends Ip {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Es.hash(e);
    const r = Bu(n);
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
    return Es.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Es.exists(this), Es.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Cp = (t, e, n) => new Lp(t, e).update(n).digest();
Cp.create = (t, e) => new Lp(t, e);
function d2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Mu = class extends Ip {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = jc(this.buffer);
  }
  update(e) {
    Es.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = jc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Es.exists(this), Es.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    d2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = jc(e), c = this.outputLen;
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
const h2 = (t, e, n) => t & e ^ ~t & n, p2 = (t, e, n) => t & e ^ t & n ^ e & n, g2 = new Uint32Array([
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
]), Gr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Kr = new Uint32Array(64);
let Tp = class extends Mu {
  constructor() {
    super(64, 32, 8, !1), this.A = Gr[0] | 0, this.B = Gr[1] | 0, this.C = Gr[2] | 0, this.D = Gr[3] | 0, this.E = Gr[4] | 0, this.F = Gr[5] | 0, this.G = Gr[6] | 0, this.H = Gr[7] | 0;
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
      Kr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Kr[l - 15], p = Kr[l - 2], v = Vn(y, 7) ^ Vn(y, 18) ^ y >>> 3, x = Vn(p, 17) ^ Vn(p, 19) ^ p >>> 10;
      Kr[l] = x + Kr[l - 7] + v + Kr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Vn(a, 6) ^ Vn(a, 11) ^ Vn(a, 25), p = d + y + h2(a, c, u) + g2[l] + Kr[l] | 0, x = (Vn(r, 2) ^ Vn(r, 13) ^ Vn(r, 22)) + p2(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Kr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, y2 = class extends Tp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Bp = ti(() => new Tp());
ti(() => new y2());
var ei = {}, Nu = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = _o;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const v = n.indexOf(o[p]) >> u;
        let x = 0;
        p !== 0 && (x = n.indexOf(o[p - 1]));
        const T = 1 + u, q = x % (1 << T) << 5 - T, W = t.c32[v + q];
        u = T, c.unshift(W);
      } else
        u = 0;
    let d = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      d++;
    c = c.slice(d);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let p = 0; p < y; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let v = 0; v < p; v++)
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
    let d = [], l = 0, y = 0;
    for (let x = o.length - 1; x >= 0; x--) {
      y === 4 && (d.unshift(n[l]), y = 0, l = 0);
      const q = (t.c32.indexOf(o[x]) << y) + l, W = n[q % 16];
      if (y += 1, l = q >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      d.unshift(W);
    }
    d.unshift(n[l]), d.length % 2 === 1 && d.unshift("0");
    let p = 0;
    for (let x = 0; x < d.length && d[x] === "0"; x++)
      p++;
    d = d.slice(p - p % 2);
    let v = d.join("");
    for (let x = 0; x < u; x++)
      v = `00${v}`;
    if (a) {
      const x = a * 2 - v.length;
      for (let T = 0; T < x; T += 2)
        v = `00${v}`;
    }
    return v;
  }
  t.c32decode = i;
})(Nu);
var Hs = {};
Object.defineProperty(Hs, "__esModule", { value: !0 });
Hs.c32checkDecode = Hs.c32checkEncode = void 0;
const Sd = fc, Ed = _o, ho = Nu;
function Mp(t) {
  const e = (0, Sd.sha256)((0, Sd.sha256)((0, Ed.hexToBytes)(t)));
  return (0, Ed.bytesToHex)(e.slice(0, 4));
}
function w2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Mp(`${n}${e}`), s = (0, ho.c32encode)(`${e}${r}`);
  return `${ho.c32[t]}${s}`;
}
Hs.c32checkEncode = w2;
function b2(t) {
  t = (0, ho.c32normalize)(t);
  const e = (0, ho.c32decode)(t.slice(1)), n = t[0], r = ho.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Mp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Hs.c32checkDecode = b2;
var Np = {}, Ui = {};
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.decode = Ui.encode = void 0;
const Oa = fc, Ad = _o, Pp = j0, _p = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function m2(t, e = "00") {
  const n = typeof t == "string" ? (0, Ad.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Ad.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Oa.sha256)((0, Oa.sha256)(new Uint8Array([...r, ...n])));
  return Pp(_p).encode([...r, ...n, ...s.slice(0, 4)]);
}
Ui.encode = m2;
function x2(t) {
  const e = Pp(_p).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Oa.sha256)((0, Oa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Ui.decode = x2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Hs, n = Ui, r = _o;
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
    const y = n.decode(d), p = (0, r.bytesToHex)(y.data), v = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let x;
    return l < 0 ? (x = v, s[v] !== void 0 && (x = s[v])) : x = l, o(x, p);
  }
  t.b58ToC32 = c;
  function u(d, l = -1) {
    const y = a(d), p = y[0], v = y[1];
    let x;
    l < 0 ? (x = p, i[p] !== void 0 && (x = i[p])) : x = l;
    let T = x.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(v, T);
  }
  t.c32ToB58 = u;
})(Np);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Nu;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Hs;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Np;
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
})(ei);
function S2(t, e) {
  switch (e = $p(e ?? vp), t) {
    case $r.P2PKH:
      switch (e.transactionVersion) {
        case kr.Mainnet:
          return tr.MainnetSingleSig;
        case kr.Testnet:
          return tr.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case $r.P2SH:
    case $r.P2SHNonSequential:
    case $r.P2WPKH:
    case $r.P2WSH:
    case $r.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case kr.Mainnet:
          return tr.MainnetMultiSig;
        case kr.Testnet:
          return tr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const E2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Up = Uint8Array.from({ length: 16 }, (t, e) => e), A2 = Up.map((t) => (9 * t + 5) % 16);
let Pu = [Up], _u = [A2];
for (let t = 0; t < 4; t++)
  for (let e of [Pu, _u])
    e.push(e[t].map((n) => E2[n]));
const Hp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), v2 = Pu.map((t, e) => t.map((n) => Hp[e][n])), $2 = _u.map((t, e) => t.map((n) => Hp[e][n])), k2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), I2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Zo = (t, e) => t << e | t >>> 32 - e;
function vd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Qo = new Uint32Array(16);
let L2 = class extends Mu {
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
      Qo[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, x = k2[p], T = I2[p], q = Pu[p], W = _u[p], E = v2[p], N = $2[p];
      for (let B = 0; B < 16; B++) {
        const tt = Zo(r + vd(p, i, a, u) + Qo[q[B]] + x, E[B]) + l | 0;
        r = l, l = u, u = Zo(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = Zo(s + vd(v, o, c, d) + Qo[W[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = Zo(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Qo.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const C2 = ti(() => new L2()), Jo = BigInt(2 ** 32 - 1), Al = BigInt(32);
function Op(t, e = !1) {
  return e ? { h: Number(t & Jo), l: Number(t >> Al & Jo) } : { h: Number(t >> Al & Jo) | 0, l: Number(t & Jo) | 0 };
}
function T2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Op(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const B2 = (t, e) => BigInt(t >>> 0) << Al | BigInt(e >>> 0), M2 = (t, e, n) => t >>> n, N2 = (t, e, n) => t << 32 - n | e >>> n, P2 = (t, e, n) => t >>> n | e << 32 - n, _2 = (t, e, n) => t << 32 - n | e >>> n, U2 = (t, e, n) => t << 64 - n | e >>> n - 32, H2 = (t, e, n) => t >>> n - 32 | e << 64 - n, O2 = (t, e) => e, D2 = (t, e) => t, F2 = (t, e, n) => t << n | e >>> 32 - n, j2 = (t, e, n) => e << n | t >>> 32 - n, z2 = (t, e, n) => e << n - 32 | t >>> 64 - n, R2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function G2(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const K2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), V2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, q2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), W2 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, X2 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Y2 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Op,
  split: T2,
  toBig: B2,
  shrSH: M2,
  shrSL: N2,
  rotrSH: P2,
  rotrSL: _2,
  rotrBH: U2,
  rotrBL: H2,
  rotr32H: O2,
  rotr32L: D2,
  rotlSH: F2,
  rotlSL: j2,
  rotlBH: z2,
  rotlBL: R2,
  add: G2,
  add3L: K2,
  add3H: V2,
  add4L: q2,
  add4H: W2,
  add5H: Y2,
  add5L: X2
}, [Z2, Q2] = Pt.split([
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
].map((t) => BigInt(t))), Vr = new Uint32Array(80), qr = new Uint32Array(80);
let pc = class extends Mu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: v, Hh: x, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Vr[E] = e.getUint32(n), qr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const N = Vr[E - 15] | 0, B = qr[E - 15] | 0, tt = Pt.rotrSH(N, B, 1) ^ Pt.rotrSH(N, B, 8) ^ Pt.shrSH(N, B, 7), et = Pt.rotrSL(N, B, 1) ^ Pt.rotrSL(N, B, 8) ^ Pt.shrSL(N, B, 7), K = Vr[E - 2] | 0, j = qr[E - 2] | 0, $ = Pt.rotrSH(K, j, 19) ^ Pt.rotrBH(K, j, 61) ^ Pt.shrSH(K, j, 6), P = Pt.rotrSL(K, j, 19) ^ Pt.rotrBL(K, j, 61) ^ Pt.shrSL(K, j, 6), M = Pt.add4L(et, P, qr[E - 7], qr[E - 16]), V = Pt.add4H(M, tt, $, Vr[E - 7], Vr[E - 16]);
      Vr[E] = V | 0, qr[E] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: v, Gh: x, Gl: T, Hh: q, Hl: W } = this;
    for (let E = 0; E < 80; E++) {
      const N = Pt.rotrSH(l, y, 14) ^ Pt.rotrSH(l, y, 18) ^ Pt.rotrBH(l, y, 41), B = Pt.rotrSL(l, y, 14) ^ Pt.rotrSL(l, y, 18) ^ Pt.rotrBL(l, y, 41), tt = l & p ^ ~l & x, et = y & v ^ ~y & T, K = Pt.add5L(W, B, et, Q2[E], qr[E]), j = Pt.add5H(K, q, N, tt, Z2[E], Vr[E]), $ = K | 0, P = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), M = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      q = x | 0, W = T | 0, x = p | 0, T = v | 0, p = l | 0, v = y | 0, { h: l, l: y } = Pt.add(u | 0, d | 0, j | 0, $ | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = Pt.add3L($, M, ct);
      r = Pt.add3H(X, j, P, V), s = X | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Pt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: v } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: x, l: T } = Pt.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: q, l: W } = Pt.add(this.Hh | 0, this.Hl | 0, q | 0, W | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, v, x, T, q, W);
  }
  roundClean() {
    Vr.fill(0), qr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, J2 = class extends pc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, tx = class extends pc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, ex = class extends pc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ti(() => new pc());
ti(() => new J2());
ti(() => new tx());
ti(() => new ex());
var Da = { exports: {} };
Da.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", d = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", p = "[object Number]", v = "[object Object]", x = "[object Promise]", T = "[object RegExp]", q = "[object Set]", W = "[object String]", E = "[object Symbol]", N = "[object WeakMap]", B = "[object ArrayBuffer]", tt = "[object DataView]", et = "[object Float32Array]", K = "[object Float64Array]", j = "[object Int8Array]", $ = "[object Int16Array]", P = "[object Int32Array]", M = "[object Uint8Array]", V = "[object Uint8ClampedArray]", ct = "[object Uint16Array]", X = "[object Uint32Array]", L = /[\\^$.*+?()[\]{}|]/g, rt = /\w*$/, ne = /^\[object .+?Constructor\]$/, k = /^(?:0|[1-9]\d*)$/, U = {};
  U[i] = U[o] = U[B] = U[tt] = U[a] = U[c] = U[et] = U[K] = U[j] = U[$] = U[P] = U[y] = U[p] = U[v] = U[T] = U[q] = U[W] = U[E] = U[M] = U[V] = U[ct] = U[X] = !0, U[u] = U[d] = U[N] = !1;
  var xt = typeof tn == "object" && tn && tn.Object === Object && tn, Ot = typeof self == "object" && self && self.Object === Object && self, Tt = xt || Ot || Function("return this")(), Yt = e && !e.nodeType && e, ie = Yt && !0 && t && !t.nodeType && t, S = ie && ie.exports === Yt;
  function _(g, C) {
    return g.set(C[0], C[1]), g;
  }
  function J(g, C) {
    return g.add(C), g;
  }
  function O(g, C) {
    for (var D = -1, dt = g ? g.length : 0; ++D < dt && C(g[D], D, g) !== !1; )
      ;
    return g;
  }
  function it(g, C) {
    for (var D = -1, dt = C.length, Ge = g.length; ++D < dt; )
      g[Ge + D] = C[D];
    return g;
  }
  function nt(g, C, D, dt) {
    for (var Ge = -1, nn = g ? g.length : 0; ++Ge < nn; )
      D = C(D, g[Ge], Ge, g);
    return D;
  }
  function It(g, C) {
    for (var D = -1, dt = Array(g); ++D < g; )
      dt[D] = C(D);
    return dt;
  }
  function At(g, C) {
    return g == null ? void 0 : g[C];
  }
  function qt(g) {
    var C = !1;
    if (g != null && typeof g.toString != "function")
      try {
        C = !!(g + "");
      } catch {
      }
    return C;
  }
  function Gt(g) {
    var C = -1, D = Array(g.size);
    return g.forEach(function(dt, Ge) {
      D[++C] = [Ge, dt];
    }), D;
  }
  function vt(g, C) {
    return function(D) {
      return g(C(D));
    };
  }
  function gt(g) {
    var C = -1, D = Array(g.size);
    return g.forEach(function(dt) {
      D[++C] = dt;
    }), D;
  }
  var Lt = Array.prototype, pe = Function.prototype, Dt = Object.prototype, le = Tt["__core-js_shared__"], yt = function() {
    var g = /[^.]+$/.exec(le && le.keys && le.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), Mt = pe.toString, Ct = Dt.hasOwnProperty, Oe = Dt.toString, Mn = RegExp(
    "^" + Mt.call(Ct).replace(L, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), lr = S ? Tt.Buffer : void 0, A = Tt.Symbol, F = Tt.Uint8Array, z = vt(Object.getPrototypeOf, Object), G = Object.create, pt = Dt.propertyIsEnumerable, kt = Lt.splice, de = Object.getOwnPropertySymbols, Wt = lr ? lr.isBuffer : void 0, he = vt(Object.keys, Object), me = I(Tt, "DataView"), ve = I(Tt, "Map"), Zt = I(Tt, "Promise"), Kt = I(Tt, "Set"), zt = I(Tt, "WeakMap"), xe = I(Object, "create"), ue = Me(me), ge = Me(ve), h = Me(Zt), m = Me(Kt), f = Me(zt), H = A ? A.prototype : void 0, lt = H ? H.valueOf : void 0;
  function ft(g) {
    var C = -1, D = g ? g.length : 0;
    for (this.clear(); ++C < D; ) {
      var dt = g[C];
      this.set(dt[0], dt[1]);
    }
  }
  function ut() {
    this.__data__ = xe ? xe(null) : {};
  }
  function Jt(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function Ue(g) {
    var C = this.__data__;
    if (xe) {
      var D = C[g];
      return D === r ? void 0 : D;
    }
    return Ct.call(C, g) ? C[g] : void 0;
  }
  function De(g) {
    var C = this.__data__;
    return xe ? C[g] !== void 0 : Ct.call(C, g);
  }
  function Nn(g, C) {
    var D = this.__data__;
    return D[g] = xe && C === void 0 ? r : C, this;
  }
  ft.prototype.clear = ut, ft.prototype.delete = Jt, ft.prototype.get = Ue, ft.prototype.has = De, ft.prototype.set = Nn;
  function Se(g) {
    var C = -1, D = g ? g.length : 0;
    for (this.clear(); ++C < D; ) {
      var dt = g[C];
      this.set(dt[0], dt[1]);
    }
  }
  function ln() {
    this.__data__ = [];
  }
  function Re(g) {
    var C = this.__data__, D = un(C, g);
    if (D < 0)
      return !1;
    var dt = C.length - 1;
    return D == dt ? C.pop() : kt.call(C, D, 1), !0;
  }
  function He(g) {
    var C = this.__data__, D = un(C, g);
    return D < 0 ? void 0 : C[D][1];
  }
  function En(g) {
    return un(this.__data__, g) > -1;
  }
  function ur(g, C) {
    var D = this.__data__, dt = un(D, g);
    return dt < 0 ? D.push([g, C]) : D[dt][1] = C, this;
  }
  Se.prototype.clear = ln, Se.prototype.delete = Re, Se.prototype.get = He, Se.prototype.has = En, Se.prototype.set = ur;
  function Et(g) {
    var C = -1, D = g ? g.length : 0;
    for (this.clear(); ++C < D; ) {
      var dt = g[C];
      this.set(dt[0], dt[1]);
    }
  }
  function re() {
    this.__data__ = {
      hash: new ft(),
      map: new (ve || Se)(),
      string: new ft()
    };
  }
  function $e(g) {
    return b(this, g).delete(g);
  }
  function An(g) {
    return b(this, g).get(g);
  }
  function vn(g) {
    return b(this, g).has(g);
  }
  function Qi(g, C) {
    return b(this, g).set(g, C), this;
  }
  Et.prototype.clear = re, Et.prototype.delete = $e, Et.prototype.get = An, Et.prototype.has = vn, Et.prototype.set = Qi;
  function $n(g) {
    this.__data__ = new Se(g);
  }
  function fr() {
    this.__data__ = new Se();
  }
  function Rn(g) {
    return this.__data__.delete(g);
  }
  function Br(g) {
    return this.__data__.get(g);
  }
  function Mr(g) {
    return this.__data__.has(g);
  }
  function dr(g, C) {
    var D = this.__data__;
    if (D instanceof Se) {
      var dt = D.__data__;
      if (!ve || dt.length < n - 1)
        return dt.push([g, C]), this;
      D = this.__data__ = new Et(dt);
    }
    return D.set(g, C), this;
  }
  $n.prototype.clear = fr, $n.prototype.delete = Rn, $n.prototype.get = Br, $n.prototype.has = Mr, $n.prototype.set = dr;
  function hr(g, C) {
    var D = Bc(g) || Yy(g) ? It(g.length, String) : [], dt = D.length, Ge = !!dt;
    for (var nn in g)
      Ct.call(g, nn) && !(Ge && (nn == "length" || $t(nn, dt))) && D.push(nn);
    return D;
  }
  function Pn(g, C, D) {
    var dt = g[C];
    (!(Ct.call(g, C) && to(dt, D)) || D === void 0 && !(C in g)) && (g[C] = D);
  }
  function un(g, C) {
    for (var D = g.length; D--; )
      if (to(g[D][0], C))
        return D;
    return -1;
  }
  function pr(g, C) {
    return g && br(C, Mc(C), g);
  }
  function gr(g, C, D, dt, Ge, nn, mr) {
    var rn;
    if (dt && (rn = nn ? dt(g, Ge, nn, mr) : dt(g)), rn !== void 0)
      return rn;
    if (!Do(g))
      return g;
    var Lf = Bc(g);
    if (Lf) {
      if (rn = R(g), !C)
        return fi(g, rn);
    } else {
      var hi = at(g), Cf = hi == d || hi == l;
      if (Qy(g))
        return ci(g, C);
      if (hi == v || hi == i || Cf && !nn) {
        if (qt(g))
          return nn ? g : {};
        if (rn = bt(Cf ? {} : g), !C)
          return di(g, pr(rn, g));
      } else {
        if (!U[hi])
          return nn ? g : {};
        rn = wt(g, hi, gr, C);
      }
    }
    mr || (mr = new $n());
    var Tf = mr.get(g);
    if (Tf)
      return Tf;
    if (mr.set(g, rn), !Lf)
      var Bf = D ? w(g) : Mc(g);
    return O(Bf || g, function(Nc, Fo) {
      Bf && (Fo = Nc, Nc = g[Fo]), Pn(rn, Fo, gr(Nc, C, D, dt, Fo, g, mr));
    }), rn;
  }
  function Nr(g) {
    return Do(g) ? G(g) : {};
  }
  function ai(g, C, D) {
    var dt = C(g);
    return Bc(g) ? dt : it(dt, D(g));
  }
  function Ji(g) {
    return Oe.call(g);
  }
  function ws(g) {
    if (!Do(g) || Ie(g))
      return !1;
    var C = If(g) || qt(g) ? Mn : ne;
    return C.test(Me(g));
  }
  function ke(g) {
    if (!fn(g))
      return he(g);
    var C = [];
    for (var D in Object(g))
      Ct.call(g, D) && D != "constructor" && C.push(D);
    return C;
  }
  function ci(g, C) {
    if (C)
      return g.slice();
    var D = new g.constructor(g.length);
    return g.copy(D), D;
  }
  function Pr(g) {
    var C = new g.constructor(g.byteLength);
    return new F(C).set(new F(g)), C;
  }
  function yr(g, C) {
    var D = C ? Pr(g.buffer) : g.buffer;
    return new g.constructor(D, g.byteOffset, g.byteLength);
  }
  function _r(g, C, D) {
    var dt = C ? D(Gt(g), !0) : Gt(g);
    return nt(dt, _, new g.constructor());
  }
  function wr(g) {
    var C = new g.constructor(g.source, rt.exec(g));
    return C.lastIndex = g.lastIndex, C;
  }
  function li(g, C, D) {
    var dt = C ? D(gt(g), !0) : gt(g);
    return nt(dt, J, new g.constructor());
  }
  function Ur(g) {
    return lt ? Object(lt.call(g)) : {};
  }
  function ui(g, C) {
    var D = C ? Pr(g.buffer) : g.buffer;
    return new g.constructor(D, g.byteOffset, g.length);
  }
  function fi(g, C) {
    var D = -1, dt = g.length;
    for (C || (C = Array(dt)); ++D < dt; )
      C[D] = g[D];
    return C;
  }
  function br(g, C, D, dt) {
    D || (D = {});
    for (var Ge = -1, nn = C.length; ++Ge < nn; ) {
      var mr = C[Ge], rn = void 0;
      Pn(D, mr, rn === void 0 ? g[mr] : rn);
    }
    return D;
  }
  function di(g, C) {
    return br(g, Y(g), C);
  }
  function w(g) {
    return ai(g, Mc, Y);
  }
  function b(g, C) {
    var D = g.__data__;
    return te(C) ? D[typeof C == "string" ? "string" : "hash"] : D.map;
  }
  function I(g, C) {
    var D = At(g, C);
    return ws(D) ? D : void 0;
  }
  var Y = de ? vt(de, Object) : ew, at = Ji;
  (me && at(new me(new ArrayBuffer(1))) != tt || ve && at(new ve()) != y || Zt && at(Zt.resolve()) != x || Kt && at(new Kt()) != q || zt && at(new zt()) != N) && (at = function(g) {
    var C = Oe.call(g), D = C == v ? g.constructor : void 0, dt = D ? Me(D) : void 0;
    if (dt)
      switch (dt) {
        case ue:
          return tt;
        case ge:
          return y;
        case h:
          return x;
        case m:
          return q;
        case f:
          return N;
      }
    return C;
  });
  function R(g) {
    var C = g.length, D = g.constructor(C);
    return C && typeof g[0] == "string" && Ct.call(g, "index") && (D.index = g.index, D.input = g.input), D;
  }
  function bt(g) {
    return typeof g.constructor == "function" && !fn(g) ? Nr(z(g)) : {};
  }
  function wt(g, C, D, dt) {
    var Ge = g.constructor;
    switch (C) {
      case B:
        return Pr(g);
      case a:
      case c:
        return new Ge(+g);
      case tt:
        return yr(g, dt);
      case et:
      case K:
      case j:
      case $:
      case P:
      case M:
      case V:
      case ct:
      case X:
        return ui(g, dt);
      case y:
        return _r(g, dt, D);
      case p:
      case W:
        return new Ge(g);
      case T:
        return wr(g);
      case q:
        return li(g, dt, D);
      case E:
        return Ur(g);
    }
  }
  function $t(g, C) {
    return C = C ?? s, !!C && (typeof g == "number" || k.test(g)) && g > -1 && g % 1 == 0 && g < C;
  }
  function te(g) {
    var C = typeof g;
    return C == "string" || C == "number" || C == "symbol" || C == "boolean" ? g !== "__proto__" : g === null;
  }
  function Ie(g) {
    return !!yt && yt in g;
  }
  function fn(g) {
    var C = g && g.constructor, D = typeof C == "function" && C.prototype || Dt;
    return g === D;
  }
  function Me(g) {
    if (g != null) {
      try {
        return Mt.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Gn(g) {
    return gr(g, !0, !0);
  }
  function to(g, C) {
    return g === C || g !== g && C !== C;
  }
  function Yy(g) {
    return Zy(g) && Ct.call(g, "callee") && (!pt.call(g, "callee") || Oe.call(g) == i);
  }
  var Bc = Array.isArray;
  function kf(g) {
    return g != null && Jy(g.length) && !If(g);
  }
  function Zy(g) {
    return tw(g) && kf(g);
  }
  var Qy = Wt || nw;
  function If(g) {
    var C = Do(g) ? Oe.call(g) : "";
    return C == d || C == l;
  }
  function Jy(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function Do(g) {
    var C = typeof g;
    return !!g && (C == "object" || C == "function");
  }
  function tw(g) {
    return !!g && typeof g == "object";
  }
  function Mc(g) {
    return kf(g) ? hr(g) : ke(g);
  }
  function ew() {
    return [];
  }
  function nw() {
    return !1;
  }
  t.exports = Gn;
})(Da, Da.exports);
var nx = Da.exports;
const Dp = /* @__PURE__ */ f0(nx);
var vl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(vl || (vl = {}));
function rx(t, e) {
  return { type: vl.Address, version: t, hash160: e };
}
function sx(t) {
  return ei.c32address(t.version, t.hash160);
}
const ix = (t) => C2(Bp(t)), ox = (t) => mt(ix(t));
Be.hmacSha256Sync = (t, ...e) => {
  const n = Cp.create(Bp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ax(t, e = "mainnet") {
  e = $p(e), t = typeof t == "string" ? Qt(t) : t;
  const n = S2($r.P2PKH, e), r = rx(n, ox(t));
  return sx(r);
}
function cx(t, e) {
  const n = qe.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = ax(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new qe.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function lx(t, e = null) {
  let n;
  e ? n = cx(t, e) : n = qe.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const $d = "_blockstackDidCheckEchoReply", ux = "echoReply", fx = "authContinuation";
function dx(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function hx() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[$d];
  if (typeof e == "boolean")
    return e;
  const n = dx(t.location.search), r = n[ux];
  if (r) {
    t[$d] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[fx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class $l {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new x0();
    else
      throw new Mw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new od(e.sessionOptions) : this.store = new od() : e ? this.store = new id(e.sessionOptions) : this.store = new id();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Pw().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new fl("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, Q1(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = Z1();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = gu("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (hx())
        return xi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      xi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = rb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new jo("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = qe.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await r2(e))
      throw new jo("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (_c(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await rd(s, i.private_key);
          } catch {
            if (xi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Be.isValidPrivateKey(i.private_key))
              throw new jo("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await rd(s, c);
          } catch {
            xi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new jo("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = Vw, d;
    _c(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), _c(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (d = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ep(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: d
    }, y = i.profile_url;
    if (!l.profile && y) {
      const p = await n(y);
      if (!p.ok)
        l.profile = Object.assign({}, Cw);
      else {
        const v = await p.text(), x = JSON.parse(v);
        l.profile = lx(x[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new fl("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), Vm(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), qm(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
$l.prototype.makeAuthRequest = $l.prototype.makeAuthRequestToken;
const px = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], gx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = px(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!gc(r.id));
  return e.concat(n);
}, gc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), Fp = "STX_PROVIDER", Os = () => typeof window > "u" ? null : window.localStorage.getItem(Fp), yx = (t) => {
  typeof window < "u" && window.localStorage.setItem(Fp, t);
}, wx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function bx(t, e) {
  const n = {};
  return Object.assign(n, wx, e), await fetch(t, n);
}
function mx(t) {
  let e = bx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function xx(...t) {
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
var Hi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Hi || (Hi = {}));
var Ds;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ds || (Ds = {}));
var kd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(kd || (kd = {}));
const Sx = "https://api.mainnet.hiro.so", Ex = "https://api.testnet.hiro.so", Ax = "http://localhost:3999", vx = ["mainnet", "testnet", "devnet", "mocknet"];
class Fs {
  constructor(e) {
    this.version = Ds.Mainnet, this.chainId = Hi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ds.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? xx();
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
Fs.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new kl();
    case "testnet":
      return new Il();
    case "devnet":
      return new $x();
    case "mocknet":
      return new jp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vx.join(", ")}`);
  }
};
Fs.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : Fs.fromName(t);
class kl extends Fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ds.Mainnet, this.chainId = Hi.Mainnet;
  }
}
class Il extends Fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ex,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ds.Testnet, this.chainId = Hi.Testnet;
  }
}
class jp extends Fs {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ax,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ds.Testnet, this.chainId = Hi.Testnet;
  }
}
const $x = jp;
var js;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(js || (js = {}));
var Fa;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Fa || (Fa = {}));
js.Mainnet;
var zs;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(zs || (zs = {}));
var Rs;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Rs || (Rs = {}));
zs.Mainnet;
const kx = {
  chainId: js.Mainnet,
  transactionVersion: zs.Mainnet,
  peerNetworkId: Fa.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Rs.MainnetSingleSig,
    multiSig: Rs.MainnetMultiSig
  },
  client: { baseUrl: w0 }
}, Ll = {
  chainId: js.Testnet,
  transactionVersion: zs.Testnet,
  peerNetworkId: Fa.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Rs.TestnetSingleSig,
    multiSig: Rs.TestnetMultiSig
  },
  client: { baseUrl: b0 }
}, Aa = {
  ...Ll,
  addressVersion: { ...Ll.addressVersion },
  magicBytes: "id",
  client: { baseUrl: m0 }
}, Ix = {
  ...Aa,
  addressVersion: { ...Aa.addressVersion },
  client: { ...Aa.client }
};
function Lx(t) {
  switch (t) {
    case "mainnet":
      return kx;
    case "testnet":
      return Ll;
    case "devnet":
      return Aa;
    case "mocknet":
      return Ix;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Cx(t) {
  return typeof t == "string" ? Lx(t) : t;
}
function Tx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Id = /* @__PURE__ */ new Map();
function zp(t, e) {
  const n = Id.get(t);
  if (n !== void 0)
    return n(e);
  const r = Tx(t);
  return Id.set(t, r), zp(t, e);
}
let fe = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Qt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return Jw(this.readBytes(4), 0);
  }
  readUInt8() {
    return Zw(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Xw(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = mt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = mt(n);
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
    if (zp(e, r))
      return r;
    throw n(r);
  }
};
const Bx = 128, Mx = 128, Rp = 16, Cs = 32, Cl = 80, yc = 65, Nx = 32, Px = 64, ja = 34, _x = 1 + 16 * 1024 * 1024, Ux = 165, Hx = 16, Ox = 16, Dx = 20, Fx = Ox + 2 + Dx, jx = Fx + 4, zx = _x + (Ux + Hx * jx);
var se;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(se || (se = {}));
var Tl;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Tl || (Tl = {}));
var pn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(pn || (pn = {}));
const zc = ["onChainOnly", "offChainOnly", "any"];
zc[0] + "", pn.OnChainOnly, zc[1] + "", pn.OffChainOnly, zc[2] + "", pn.Any, pn.OnChainOnly + "", pn.OnChainOnly, pn.OffChainOnly + "", pn.OffChainOnly, pn.Any + "", pn.Any;
var za;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(za || (za = {}));
var ye;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ye || (ye = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var ae;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ae || (ae = {}));
var Ee;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ee || (Ee = {}));
var po;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(po || (po = {}));
var Bl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Bl || (Bl = {}));
var Ml;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ml || (Ml = {}));
var Je;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Je || (Je = {}));
var Ld;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ld || (Ld = {}));
var Nl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Nl || (Nl = {}));
var On;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(On || (On = {}));
var Cd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Cd || (Cd = {}));
let wc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Si = class extends wc {
  constructor(e) {
    super(e);
  }
}, Ze = class extends wc {
  constructor(e) {
    super(e);
  }
}, Ra = class extends wc {
  constructor(e) {
    super(e);
  }
}, As = class extends wc {
  constructor(e) {
    super(e);
  }
};
function Pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Rx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Gp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Gx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Pl(t.outputLen), Pl(t.blockLen);
}
function Kx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Vx(t, e) {
  Gp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const vs = {
  number: Pl,
  bool: Rx,
  bytes: Gp,
  hash: Gx,
  exists: Kx,
  output: Vx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Rc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), qn = (t, e) => t << 32 - e | t >>> e, qx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!qx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Wx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uu(t) {
  if (typeof t == "string" && (t = Wx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Kp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ni(t) {
  const e = (r) => t().update(Uu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Vp = class extends Kp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, vs.hash(e);
    const r = Uu(n);
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
    return vs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    vs.exists(this), vs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const qp = (t, e, n) => new Vp(t, e).update(n).digest();
qp.create = (t, e) => new Vp(t, e);
function Xx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Hu = class extends Kp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Rc(this.buffer);
  }
  update(e) {
    vs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Uu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Rc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    vs.exists(this), vs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Xx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Rc(e), c = this.outputLen;
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
const Yx = (t, e, n) => t & e ^ ~t & n, Zx = (t, e, n) => t & e ^ t & n ^ e & n, Qx = new Uint32Array([
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
]), Wr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Xr = new Uint32Array(64);
let Wp = class extends Hu {
  constructor() {
    super(64, 32, 8, !1), this.A = Wr[0] | 0, this.B = Wr[1] | 0, this.C = Wr[2] | 0, this.D = Wr[3] | 0, this.E = Wr[4] | 0, this.F = Wr[5] | 0, this.G = Wr[6] | 0, this.H = Wr[7] | 0;
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
      Xr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Xr[l - 15], p = Xr[l - 2], v = qn(y, 7) ^ qn(y, 18) ^ y >>> 3, x = qn(p, 17) ^ qn(p, 19) ^ p >>> 10;
      Xr[l] = x + Xr[l - 7] + v + Xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = qn(a, 6) ^ qn(a, 11) ^ qn(a, 25), p = d + y + Yx(a, c, u) + Qx[l] + Xr[l] | 0, x = (qn(r, 2) ^ qn(r, 13) ^ qn(r, 22)) + Zx(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Jx = class extends Wp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Ou = ni(() => new Wp());
ni(() => new Jx());
const tS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Xp = Uint8Array.from({ length: 16 }, (t, e) => e), eS = Xp.map((t) => (9 * t + 5) % 16);
let Du = [Xp], Fu = [eS];
for (let t = 0; t < 4; t++)
  for (let e of [Du, Fu])
    e.push(e[t].map((n) => tS[n]));
const Yp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), nS = Du.map((t, e) => t.map((n) => Yp[e][n])), rS = Fu.map((t, e) => t.map((n) => Yp[e][n])), sS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), iS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ta = (t, e) => t << e | t >>> 32 - e;
function Td(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ea = new Uint32Array(16);
let oS = class extends Hu {
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
      ea[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, x = sS[p], T = iS[p], q = Du[p], W = Fu[p], E = nS[p], N = rS[p];
      for (let B = 0; B < 16; B++) {
        const tt = ta(r + Td(p, i, a, u) + ea[q[B]] + x, E[B]) + l | 0;
        r = l, l = u, u = ta(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = ta(s + Td(v, o, c, d) + ea[W[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = ta(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ea.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const aS = ni(() => new oS()), na = BigInt(2 ** 32 - 1), _l = BigInt(32);
function Zp(t, e = !1) {
  return e ? { h: Number(t & na), l: Number(t >> _l & na) } : { h: Number(t >> _l & na) | 0, l: Number(t & na) | 0 };
}
function cS(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Zp(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const lS = (t, e) => BigInt(t >>> 0) << _l | BigInt(e >>> 0), uS = (t, e, n) => t >>> n, fS = (t, e, n) => t << 32 - n | e >>> n, dS = (t, e, n) => t >>> n | e << 32 - n, hS = (t, e, n) => t << 32 - n | e >>> n, pS = (t, e, n) => t << 64 - n | e >>> n - 32, gS = (t, e, n) => t >>> n - 32 | e << 64 - n, yS = (t, e) => e, wS = (t, e) => t, bS = (t, e, n) => t << n | e >>> 32 - n, mS = (t, e, n) => e << n | t >>> 32 - n, xS = (t, e, n) => e << n - 32 | t >>> 64 - n, SS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ES(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const AS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), vS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, $S = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), kS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, IS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), LS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, _t = {
  fromBig: Zp,
  split: cS,
  toBig: lS,
  shrSH: uS,
  shrSL: fS,
  rotrSH: dS,
  rotrSL: hS,
  rotrBH: pS,
  rotrBL: gS,
  rotr32H: yS,
  rotr32L: wS,
  rotlSH: bS,
  rotlSL: mS,
  rotlBH: xS,
  rotlBL: SS,
  add: ES,
  add3L: AS,
  add3H: vS,
  add4L: $S,
  add4H: kS,
  add5H: LS,
  add5L: IS
}, [CS, TS] = _t.split([
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
].map((t) => BigInt(t))), Yr = new Uint32Array(80), Zr = new Uint32Array(80);
let bc = class extends Hu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: v, Hh: x, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Yr[E] = e.getUint32(n), Zr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const N = Yr[E - 15] | 0, B = Zr[E - 15] | 0, tt = _t.rotrSH(N, B, 1) ^ _t.rotrSH(N, B, 8) ^ _t.shrSH(N, B, 7), et = _t.rotrSL(N, B, 1) ^ _t.rotrSL(N, B, 8) ^ _t.shrSL(N, B, 7), K = Yr[E - 2] | 0, j = Zr[E - 2] | 0, $ = _t.rotrSH(K, j, 19) ^ _t.rotrBH(K, j, 61) ^ _t.shrSH(K, j, 6), P = _t.rotrSL(K, j, 19) ^ _t.rotrBL(K, j, 61) ^ _t.shrSL(K, j, 6), M = _t.add4L(et, P, Zr[E - 7], Zr[E - 16]), V = _t.add4H(M, tt, $, Yr[E - 7], Yr[E - 16]);
      Yr[E] = V | 0, Zr[E] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: v, Gh: x, Gl: T, Hh: q, Hl: W } = this;
    for (let E = 0; E < 80; E++) {
      const N = _t.rotrSH(l, y, 14) ^ _t.rotrSH(l, y, 18) ^ _t.rotrBH(l, y, 41), B = _t.rotrSL(l, y, 14) ^ _t.rotrSL(l, y, 18) ^ _t.rotrBL(l, y, 41), tt = l & p ^ ~l & x, et = y & v ^ ~y & T, K = _t.add5L(W, B, et, TS[E], Zr[E]), j = _t.add5H(K, q, N, tt, CS[E], Yr[E]), $ = K | 0, P = _t.rotrSH(r, s, 28) ^ _t.rotrBH(r, s, 34) ^ _t.rotrBH(r, s, 39), M = _t.rotrSL(r, s, 28) ^ _t.rotrBL(r, s, 34) ^ _t.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      q = x | 0, W = T | 0, x = p | 0, T = v | 0, p = l | 0, v = y | 0, { h: l, l: y } = _t.add(u | 0, d | 0, j | 0, $ | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = _t.add3L($, M, ct);
      r = _t.add3H(X, j, P, V), s = X | 0;
    }
    ({ h: r, l: s } = _t.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = _t.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = _t.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = _t.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = _t.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: v } = _t.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: x, l: T } = _t.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: q, l: W } = _t.add(this.Hh | 0, this.Hl | 0, q | 0, W | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, v, x, T, q, W);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, BS = class extends bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, MS = class extends bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, NS = class extends bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ni(() => new bc());
ni(() => new BS());
const PS = ni(() => new MS());
ni(() => new NS());
var Vt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Vt || (Vt = {}));
var Fe;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Fe || (Fe = {}));
function ju(t) {
  return Fe[t];
}
const _S = () => ({ type: Vt.BoolTrue }), US = () => ({ type: Vt.BoolFalse }), HS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Vt.Buffer, value: mt(t) };
}, Bd = BigInt("0xffffffffffffffffffffffffffffffff"), OS = BigInt(0), Md = BigInt("0x7fffffffffffffffffffffffffffffff"), Nd = BigInt("-170141183460469231731687303715884105728"), DS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = hl(Qt(t))), cn(t, Uint8Array) && (t = hl(t));
  const e = Ye(t);
  if (e > Md)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Md}`);
  if (e < Nd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Nd}`);
  return { type: Vt.Int, value: e };
}, FS = (t) => {
  const e = Ye(t);
  if (e < OS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Bd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Bd}`);
  return { type: Vt.UInt, value: e };
};
function jS(t) {
  return { type: Vt.List, value: t };
}
function Qp() {
  return { type: Vt.OptionalNone };
}
function Jp(t) {
  return { type: Vt.OptionalSome, value: t };
}
var ot;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ot || (ot = {}));
function zS() {
  return {
    type: ot.Address,
    version: Rs.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Pd(t) {
  if (t && cg(t, ja))
    throw new Error(`Memo exceeds maximum length of ${ja} bytes`);
  return { type: ot.MemoString, content: t };
}
function zu(t, e) {
  return {
    type: ot.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Ul(t) {
  if (Qt(t).byteLength != yc)
    throw Error("Invalid signature");
  return {
    type: ot.MessageSignature,
    data: t
  };
}
function RS(t, e, n) {
  return typeof t == "string" && (t = i3(t)), typeof n == "string" && (n = Pd(n)), {
    type: ot.Payload,
    payloadType: se.TokenTransfer,
    recipient: t,
    amount: Ye(e),
    memo: n ?? Pd("")
  };
}
function GS(t, e, n, r) {
  return typeof e == "string" && (e = jn(e)), typeof n == "string" && (n = jn(n)), {
    type: ot.Payload,
    payloadType: se.ContractCall,
    contractAddress: typeof t == "string" ? ys(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function KS(t) {
  return jn(t, 4, 1e5);
}
function _d(t, e, n) {
  return typeof t == "string" && (t = jn(t)), typeof e == "string" && (e = KS(e)), typeof n == "number" ? {
    type: ot.Payload,
    payloadType: se.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ot.Payload,
    payloadType: se.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function VS() {
  return { type: ot.Payload, payloadType: se.PoisonMicroblock };
}
function Ud(t, e) {
  if (t.byteLength != Cs)
    throw Error(`Coinbase buffer size must be ${Cs} bytes`);
  return e != null ? {
    type: ot.Payload,
    payloadType: se.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ot.Payload,
    payloadType: se.Coinbase,
    coinbaseBytes: t
  };
}
function qS(t, e, n) {
  if (t.byteLength != Cs)
    throw Error(`Coinbase buffer size must be ${Cs} bytes`);
  if (n.byteLength != Cl)
    throw Error(`VRF proof buffer size must be ${Cl} bytes`);
  return {
    type: ot.Payload,
    payloadType: se.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Vt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function WS(t, e, n, r, s, i, o) {
  return {
    type: ot.Payload,
    payloadType: se.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function jn(t, e, n) {
  const r = e || 1, s = n || Bx;
  if (cg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ot.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function XS(t, e, n) {
  return {
    type: ot.Asset,
    address: ys(t),
    contractName: jn(e),
    assetName: jn(n)
  };
}
function ys(t) {
  const e = ei.c32addressDecode(t);
  return {
    type: ot.Address,
    version: e[0],
    hash160: e[1]
  };
}
function YS(t, e) {
  const n = ys(t), r = jn(e);
  return {
    type: ot.Principal,
    prefix: Je.Contract,
    address: n,
    contractName: r
  };
}
function ZS(t) {
  const e = ys(t);
  return {
    type: ot.Principal,
    prefix: Je.Standard,
    address: e
  };
}
function Ei(t, e) {
  return {
    pubKeyEncoding: t,
    type: ot.TransactionAuthField,
    contents: e
  };
}
function Ar(t) {
  switch (t.type) {
    case ot.Address:
      return Uo(t);
    case ot.Principal:
      return tg(t);
    case ot.LengthPrefixedString:
      return Di(t);
    case ot.MemoString:
      return JS(t);
    case ot.Asset:
      return ng(t);
    case ot.PostCondition:
      return sg(t);
    case ot.PublicKey:
      return Dl(t);
    case ot.LengthPrefixedList:
      return Ru(t);
    case ot.Payload:
      return ig(t);
    case ot.TransactionAuthField:
      return s3(t);
    case ot.MessageSignature:
      return Gu(t);
  }
}
function Uo(t) {
  const e = [];
  return e.push(Qt(To(t.version, 1))), e.push(Qt(t.hash160)), Pe(e);
}
function Oi(t) {
  const e = cn(t, fe) ? t : new fe(t), n = rc(mt(e.readBytes(1))), r = mt(e.readBytes(20));
  return { type: ot.Address, version: n, hash160: r };
}
function tg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === Je.Standard || t.prefix === Je.Contract) && e.push(Uo(t.address)), t.prefix === Je.Contract && e.push(Di(t.contractName)), Pe(e);
}
function QS(t) {
  const e = cn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(Je, (i) => {
    throw new Ze(`Unexpected Principal payload type: ${i}`);
  });
  if (n === Je.Origin)
    return { type: ot.Principal, prefix: n };
  const r = Oi(e);
  if (n === Je.Standard)
    return { type: ot.Principal, prefix: n, address: r };
  const s = Cn(e);
  return {
    type: ot.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Di(t) {
  const e = [], n = Zs(t.content), r = n.byteLength;
  return e.push(Qt(To(r, t.lengthPrefixBytes))), e.push(n), Pe(e);
}
function Cn(t, e, n) {
  e = e || 1;
  const r = cn(t, fe) ? t : new fe(t), s = rc(mt(r.readBytes(e))), i = Bo(r.readBytes(s));
  return jn(i, e, n ?? 128);
}
function JS(t) {
  const e = [], n = Zs(t.content), r = I3(mt(n), ja * 2);
  return e.push(Qt(r)), Pe(e);
}
function eg(t) {
  const e = cn(t, fe) ? t : new fe(t);
  let n = Bo(e.readBytes(ja));
  return n = n.replace(/\u0000*$/, ""), { type: ot.MemoString, content: n };
}
function ng(t) {
  const e = [];
  return e.push(Uo(t.address)), e.push(Di(t.contractName)), e.push(Di(t.assetName)), Pe(e);
}
function Hl(t) {
  const e = cn(t, fe) ? t : new fe(t);
  return {
    type: ot.Asset,
    address: Oi(e),
    contractName: Cn(e),
    assetName: Cn(e)
  };
}
function Ru(t) {
  const e = t.values, n = [];
  n.push(Qt(To(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ar(r));
  return Pe(n);
}
function rg(t, e, n) {
  const r = cn(t, fe) ? t : new fe(t), s = rc(mt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case ot.Address:
        i.push(Oi(r));
        break;
      case ot.LengthPrefixedString:
        i.push(Cn(r));
        break;
      case ot.MemoString:
        i.push(eg(r));
        break;
      case ot.Asset:
        i.push(Hl(r));
        break;
      case ot.PostCondition:
        i.push(e3(r));
        break;
      case ot.PublicKey:
        i.push(Fl(r));
        break;
      case ot.TransactionAuthField:
        i.push(r3(r));
        break;
    }
  return zu(i, n);
}
function t3(t) {
  return mt(sg(t));
}
function sg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(tg(t.principal)), (t.conditionType === ye.Fungible || t.conditionType === ye.NonFungible) && e.push(ng(t.asset)), t.conditionType === ye.NonFungible && e.push(er(t.assetName)), e.push(t.conditionCode), t.conditionType === ye.STX || t.conditionType === ye.Fungible || t.conditionType === ye.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Si("The post-condition amount may not be larger than 8 bytes");
    e.push(ps(t.amount, 8));
  }
  return Pe(e);
}
function e3(t) {
  const e = cn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(ye, (a) => {
    throw new Ze(`Could not read ${a} as PostConditionType`);
  }), r = QS(e);
  let s, i, o;
  switch (n) {
    case ye.STX:
      return s = e.readUInt8Enum(po, (c) => {
        throw new Ze(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${mt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ye.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ye.Fungible:
      return i = Hl(e), s = e.readUInt8Enum(po, (c) => {
        throw new Ze(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${mt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ye.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case ye.NonFungible:
      i = Hl(e);
      const a = Qn(e);
      return s = e.readUInt8Enum(Bl, (c) => {
        throw new Ze(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ot.PostCondition,
        conditionType: ye.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case ye.Staking:
      return s = e.readUInt8Enum(po, (c) => {
        throw new Ze(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${mt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ye.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ye.PoX: {
      const c = e.readUInt8Enum(Ml, (u) => {
        throw new Ze(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ot.PostCondition,
        conditionType: ye.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function ig(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case se.TokenTransfer:
      e.push(er(t.recipient)), e.push(ps(t.amount, 8)), e.push(Ar(t.memo));
      break;
    case se.ContractCall:
      e.push(Ar(t.contractAddress)), e.push(Ar(t.contractName)), e.push(Ar(t.functionName));
      const n = new Uint8Array(4);
      Ns(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(er(r));
      });
      break;
    case se.SmartContract:
      e.push(Ar(t.contractName)), e.push(Ar(t.codeBody));
      break;
    case se.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ar(t.contractName)), e.push(Ar(t.codeBody));
      break;
    case se.PoisonMicroblock:
      break;
    case se.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case se.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(er(t.recipient));
      break;
    case se.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(er(t.recipient ? Jp(t.recipient) : Qp())), e.push(t.vrfProof);
      break;
    case se.TenureChange:
      e.push(Qt(t.tenureHash)), e.push(Qt(t.previousTenureHash)), e.push(Qt(t.burnViewHash)), e.push(Qt(t.previousTenureEnd)), e.push(Ns(new Uint8Array(4), t.previousTenureBlocks)), e.push(Qw(new Uint8Array(1), t.cause)), e.push(Qt(t.publicKeyHash));
      break;
  }
  return Pe(e);
}
function n3(t) {
  const e = cn(t, fe) ? t : new fe(t);
  switch (e.readUInt8Enum(se, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case se.TokenTransfer:
      const r = Qn(e), s = Ye(e.readBytes(8)), i = eg(e);
      return RS(r, s, i);
    case se.ContractCall:
      const o = Oi(e), a = Cn(e), c = Cn(e), u = [], d = e.readUInt32BE();
      for (let N = 0; N < d; N++) {
        const B = Qn(e);
        u.push(B);
      }
      return GS(o, a, c, u);
    case se.SmartContract:
      const l = Cn(e), y = Cn(e, 4, 1e5);
      return _d(l, y);
    case se.VersionedSmartContract: {
      const N = e.readUInt8Enum(Tl, (et) => {
        throw new Error(`Cannot recognize ClarityVersion: ${et}`);
      }), B = Cn(e), tt = Cn(e, 4, zx);
      return _d(B, tt, N);
    }
    case se.PoisonMicroblock:
      return VS();
    case se.Coinbase: {
      const N = e.readBytes(Cs);
      return Ud(N);
    }
    case se.CoinbaseToAltRecipient: {
      const N = e.readBytes(Cs), B = Qn(e);
      return Ud(N, B);
    }
    case se.NakamotoCoinbase: {
      const N = e.readBytes(Cs), B = Qn(e), tt = e.readBytes(Cl);
      return qS(N, B, tt);
    }
    case se.TenureChange:
      const p = mt(e.readBytes(20)), v = mt(e.readBytes(20)), x = mt(e.readBytes(20)), T = mt(e.readBytes(32)), q = e.readUInt32BE(), W = e.readUInt8Enum(Nl, (N) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${N}`);
      }), E = mt(e.readBytes(20));
      return WS(p, v, x, T, q, W, E);
  }
}
function Ol(t) {
  const e = cn(t, fe) ? t : new fe(t);
  return Ul(mt(e.readBytes(yc)));
}
function r3(t) {
  const e = cn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(On, (r) => {
    throw new Ze(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case On.PublicKeyCompressed:
      return Ei(Ee.Compressed, Fl(e));
    case On.PublicKeyUncompressed:
      return Ei(Ee.Uncompressed, qi(O3(Fl(e).data)));
    case On.SignatureCompressed:
      return Ei(Ee.Compressed, Ol(e));
    case On.SignatureUncompressed:
      return Ei(Ee.Uncompressed, Ol(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Gu(t) {
  return Qt(t.data);
}
function s3(t) {
  const e = [];
  switch (t.contents.type) {
    case ot.PublicKey:
      e.push(t.pubKeyEncoding === Ee.Compressed ? On.PublicKeyCompressed : On.PublicKeyUncompressed), e.push(Qt(H3(t.contents.data)));
      break;
    case ot.MessageSignature:
      e.push(t.pubKeyEncoding === Ee.Compressed ? On.SignatureCompressed : On.SignatureUncompressed), e.push(Gu(t.contents));
      break;
  }
  return Pe(e);
}
function Dl(t) {
  return t.data.slice();
}
function Fl(t) {
  const e = cn(t, fe) ? t : new fe(t), n = e.readUInt8(), r = n === 4 ? Px : Nx;
  return qi(Pe([n, e.readBytes(r)]));
}
function Ku(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ae.P2PKH || e === ae.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ae.P2WPKH || e === ae.P2WSH || e === ae.P2WSHNonSequential) && !r.map((s) => s.data).every(Wi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ae.P2PKH:
      return ra(t, L3(r[0].data));
    case ae.P2WPKH:
      return ra(t, C3(r[0].data));
    case ae.P2SH:
    case ae.P2SHNonSequential:
      return ra(t, T3(n, r.map(Dl)));
    case ae.P2WSH:
    case ae.P2WSHNonSequential:
      return ra(t, B3(n, r.map(Dl)));
  }
}
function ra(t, e) {
  return { type: ot.Address, version: t, hash160: e };
}
function Vu(t) {
  return ei.c32address(t.version, t.hash160);
}
function Hd(t) {
  const [e, n, r] = t.split(/\.|::/);
  return XS(e, n, r);
}
function so(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return YS(e, n);
  } else
    return ZS(t);
}
function i3(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return c3(e, n);
  } else
    return o3(t);
}
function o3(t) {
  const e = ys(t);
  return { type: Vt.PrincipalStandard, value: Vu(e) };
}
function a3(t) {
  return { type: Vt.PrincipalStandard, value: Vu(t) };
}
function c3(t, e) {
  const n = ys(t), r = jn(e);
  return og(n, r);
}
function og(t, e) {
  if (Zs(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Vt.PrincipalContract,
    value: `${Vu(t)}.${e.content}`
  };
}
function l3(t) {
  return { type: Vt.ResponseErr, value: t };
}
function u3(t) {
  return { type: Vt.ResponseOk, value: t };
}
const f3 = (t) => ({ type: Vt.StringASCII, value: t }), d3 = (t) => ({ type: Vt.StringUTF8, value: t });
function h3(t) {
  for (const e in t)
    if (!M3(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Vt.Tuple, value: t };
}
function Qn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new fe(Qt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new fe(t) : e = t;
  switch (e.readUInt8Enum(Fe, (r) => {
    throw new Ze(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Fe.int:
      return DS(hl(e.readBytes(16)));
    case Fe.uint:
      return FS(e.readBytes(16));
    case Fe.buffer:
      const r = e.readUInt32BE();
      return HS(e.readBytes(r));
    case Fe.true:
      return _S();
    case Fe.false:
      return US();
    case Fe.address:
      const s = Oi(e);
      return a3(s);
    case Fe.contract:
      const i = Oi(e), o = Cn(e);
      return og(i, o);
    case Fe.ok:
      return u3(Qn(e));
    case Fe.err:
      return l3(Qn(e));
    case Fe.none:
      return Qp();
    case Fe.some:
      return Jp(Qn(e));
    case Fe.list:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Qn(e));
      return jS(c);
    case Fe.tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const T = Cn(e).content;
        if (T === void 0)
          throw new Ze('"content" is undefined');
        d[T] = Qn(e);
      }
      return h3(d);
    case Fe.ascii:
      const l = e.readUInt32BE(), y = Gw(e.readBytes(l));
      return f3(y);
    case Fe.utf8:
      const p = e.readUInt32BE(), v = Bo(e.readBytes(p));
      return d3(v);
    default:
      throw new Ze("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function or(t, e) {
  return Pe([ju(t), e]);
}
function p3(t) {
  return new Uint8Array([ju(t.type)]);
}
function g3(t) {
  return t.type === Vt.OptionalNone ? new Uint8Array([ju(t.type)]) : or(t.type, er(t.value));
}
function y3(t) {
  const e = new Uint8Array(4);
  return Ns(e, Math.ceil(t.value.length / 2), 0), or(t.type, sr(e, Qt(t.value)));
}
function w3(t) {
  const e = yu(Dw(BigInt(t.value), BigInt(Mx)), Rp);
  return or(t.type, e);
}
function b3(t) {
  const e = yu(BigInt(t.value), Rp);
  return or(t.type, e);
}
function m3(t) {
  return or(t.type, Uo(ys(t.value)));
}
function x3(t) {
  const [e, n] = N3(t.value);
  return or(t.type, sr(Uo(ys(e)), Di(jn(n))));
}
function S3(t) {
  return or(t.type, er(t.value));
}
function E3(t) {
  const e = [], n = new Uint8Array(4);
  Ns(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = er(r);
    e.push(s);
  }
  return or(t.type, Pe(e));
}
function A3(t) {
  const e = [], n = new Uint8Array(4);
  Ns(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = jn(s);
    e.push(Di(i));
    const o = er(t.value[s]);
    e.push(o);
  }
  return or(t.type, Pe(e));
}
function ag(t, e) {
  const n = [], r = e == "ascii" ? Rw(t.value) : Zs(t.value), s = new Uint8Array(4);
  return Ns(s, r.length, 0), n.push(s), n.push(r), or(t.type, Pe(n));
}
function v3(t) {
  return ag(t, "ascii");
}
function $3(t) {
  return ag(t, "utf8");
}
function Od(t) {
  return mt(er(t));
}
function er(t) {
  switch (t.type) {
    case Vt.BoolTrue:
    case Vt.BoolFalse:
      return p3(t);
    case Vt.OptionalNone:
    case Vt.OptionalSome:
      return g3(t);
    case Vt.Buffer:
      return y3(t);
    case Vt.UInt:
      return b3(t);
    case Vt.Int:
      return w3(t);
    case Vt.PrincipalStandard:
      return m3(t);
    case Vt.PrincipalContract:
      return x3(t);
    case Vt.ResponseOk:
    case Vt.ResponseErr:
      return S3(t);
    case Vt.List:
      return E3(t);
    case Vt.Tuple:
      return A3(t);
    case Vt.StringASCII:
      return v3(t);
    case Vt.StringUTF8:
      return $3(t);
    default:
      throw new Si("Unable to serialize. Invalid Clarity Value.");
  }
}
const k3 = (t) => t.length % 2 ? `0${t}` : t, I3 = (t, e) => t.padEnd(e, "0"), cg = (t, e) => t ? Zs(t).length > e : !1;
function jl(t) {
  return Dp(t);
}
const mo = (t) => aS(Ou(t)), qu = (t) => mt(PS(t)), L3 = (t) => mt(mo(t)), C3 = (t) => {
  const e = mo(t), n = sr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = mo(n);
  return mt(r);
}, T3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = mo(r);
  return mt(s);
}, B3 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = Ou(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Pe(i), a = mo(o);
  return mt(a);
};
function M3(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function N3(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Be.hmacSha256Sync = (t, ...e) => {
  const n = qp.create(Ou, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function qi(t) {
  return t = typeof t == "string" ? Qt(t) : t, {
    type: ot.PublicKey,
    data: t
  };
}
function P3(t, e, n = Ee.Compressed) {
  const r = Ww(e), s = new mn(Of(r.r), Of(r.s)), i = jt.fromSignature(t, s, r.recoveryId), o = n === Ee.Compressed;
  return i.toHex(o);
}
function _3(t) {
  return typeof t == "string" ? t : mt(t);
}
const Wu = _3;
function lg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === qw;
}
function Wi(t) {
  return !Wu(t).startsWith("04");
}
function U3(t) {
  t = wu(t);
  const e = lg(t);
  return mt(Mo(t.slice(0, 32), e));
}
function H3(t) {
  return jt.fromHex(Wu(t)).toHex(!0);
}
function O3(t) {
  return jt.fromHex(Wu(t)).toHex(!1);
}
function D3(t, e) {
  t = wu(t);
  const [n, r] = ic(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return To(r, 1) + mn.fromHex(n).toCompactHex();
}
function Xu() {
  return {
    type: ot.MessageSignature,
    data: mt(new Uint8Array(yc))
  };
}
function ug(t, e, n, r) {
  const s = Ku(0, t, 1, [qi(e)]).hash160, i = Wi(e) ? Ee.Compressed : Ee.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: Ye(n),
    fee: Ye(r),
    keyEncoding: i,
    signature: Xu()
  };
}
function xo(t) {
  return "signature" in t;
}
function Dd(t) {
  return t === ae.P2SH || t === ae.P2WSH;
}
function F3(t) {
  return t === ae.P2SHNonSequential || t === ae.P2WSHNonSequential;
}
function Fd(t) {
  const e = jl(t);
  return e.nonce = 0, e.fee = 0, xo(e) ? e.signature = Xu() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function j3(t) {
  const e = [
    t.hashMode,
    Qt(t.signer),
    ps(t.nonce, 8),
    ps(t.fee, 8),
    t.keyEncoding,
    Gu(t.signature)
  ];
  return Pe(e);
}
function z3(t) {
  const e = [
    t.hashMode,
    Qt(t.signer),
    ps(t.nonce, 8),
    ps(t.fee, 8)
  ], n = zu(t.fields);
  e.push(Ru(n));
  const r = new Uint8Array(2);
  return Yw(r, t.signaturesRequired, 0), e.push(r), Pe(e);
}
function R3(t, e) {
  const n = mt(e.readBytes(20)), r = BigInt(`0x${mt(e.readBytes(8))}`), s = BigInt(`0x${mt(e.readBytes(8))}`), i = e.readUInt8Enum(Ee, (a) => {
    throw new Ze(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ae.P2WPKH && i != Ee.Compressed)
    throw new Ze("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Ol(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function G3(t, e) {
  const n = mt(e.readBytes(20)), r = BigInt("0x" + mt(e.readBytes(8))), s = BigInt("0x" + mt(e.readBytes(8))), i = rg(e, ot.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ot.PublicKey:
        Wi(u.contents.data) || (o = !0);
        break;
      case ot.MessageSignature:
        if (u.pubKeyEncoding === Ee.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new As("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ae.P2WSH || t === ae.P2WSHNonSequential))
    throw new As("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Gc(t) {
  return xo(t) ? j3(t) : z3(t);
}
function Kc(t) {
  const e = t.readUInt8Enum(ae, (n) => {
    throw new Ze(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ae.P2PKH || e === ae.P2WPKH ? R3(e, t) : G3(e, t);
}
function fg(t, e, n, r) {
  const i = t + mt(new Uint8Array([e])) + mt(ps(n, 8)) + mt(ps(r, 8));
  if (Qt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return qu(Qt(i));
}
function dg(t, e, n) {
  const r = 33 + yc, s = Wi(e.data) ? Ee.Compressed : Ee.Uncompressed, i = t + k3(s.toString(16)) + n, o = Qt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return qu(o);
}
function K3(t, e, n, r, s) {
  const i = fg(t, e, n, r), o = D3(s, i), a = qi(U3(s)), c = dg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function hg(t, e, n, r, s, i) {
  const o = fg(t, e, n, r), a = qi(P3(o, i, s)), c = dg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function V3() {
  const t = ug(ae.P2PKH, "", 0, 0);
  return t.signer = zS().hash160, t.keyEncoding = Ee.Compressed, t.signature = Xu(), t;
}
function jd(t, e, n) {
  return xo(t) ? q3(t, e, n) : W3(t, e, n);
}
function q3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = hg(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Ku(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new As(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function W3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ot.PublicKey:
        Wi(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case ot.MessageSignature:
        c.pubKeyEncoding === Ee.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = hg(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Dd(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new As("Too many signatures");
        break;
    }
  if (Dd(t.hashMode) && o !== t.signaturesRequired || F3(t.hashMode) && o < t.signaturesRequired)
    throw new As("Incorrect number of signatures");
  if (i && (t.hashMode === ae.P2WSH || t.hashMode === ae.P2WSHNonSequential))
    throw new As("Uncompressed keys are not allowed in this hash mode");
  const a = Ku(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new As(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function pg(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function gg(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ug(ae.P2PKH, "0".repeat(66), 0, 0)
  };
}
function zd(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return pg(Fd(t.spendingCondition));
      case Ce.Sponsored:
        return gg(Fd(t.spendingCondition), V3());
      default:
        throw new Ra("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function X3(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return jd(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return jd(t.spendingCondition, e, Ce.Standard);
    default:
      throw new Ra("Invalid origin auth type");
  }
}
function Y3(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: Ye(e)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: Ye(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function Z3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: Ye(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function Q3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: Ye(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function J3(t, e) {
  const n = {
    ...e,
    nonce: Ye(e.nonce),
    fee: Ye(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function tE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(Gc(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(Gc(t.spendingCondition)), e.push(Gc(t.sponsorSpendingCondition));
      break;
  }
  return Pe(e);
}
function eE(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new Ze(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = Kc(t), pg(n);
    case Ce.Sponsored:
      n = Kc(t);
      const r = Kc(t);
      return gg(n, r);
  }
}
class nE {
  constructor({ auth: e, payload: n, postConditions: r = zu([]), postConditionMode: s = za.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Cx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: Ye(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = pn.Any;
  }
  signBegin() {
    const e = jl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyBegin() {
    const e = jl(this);
    return e.auth = zd(e.auth), e.txid();
  }
  verifyOrigin() {
    return X3(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Ce.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Ce.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Ce.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = typeof e == "object" && "type" in e ? e : qi(e), r = this.auth.spendingCondition;
    if (r && !xo(r)) {
      const s = Wi(n.data);
      r.fields.push(Ei(s ? Ee.Compressed : Ee.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = K3(n, r, e.fee, e.nonce, s);
    if (xo(e))
      e.signature = Ul(i);
    else {
      const a = lg(s);
      e.fields.push(Ei(a ? Ee.Compressed : Ee.Uncompressed, Ul(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return qu(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = J3(this.auth, e);
  }
  setFee(e) {
    this.auth = Y3(this.auth, e);
  }
  setNonce(e) {
    this.auth = Z3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Ra("Cannot sponsor sign a non-sponsored transaction");
    this.auth = Q3(this.auth, e);
  }
  serialize() {
    return mt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Si('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Si('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Si('"auth" is undefined');
    if (this.payload === void 0)
      throw new Si('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Ns(n, this.chainId, 0), e.push(n), e.push(tE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Ru(this.postConditions)), e.push(ig(this.payload)), Pe(e);
  }
}
function rE(t) {
  const e = cn(t, fe) ? t : new fe(t), n = e.readUInt8Enum(zs, (d) => {
    throw new Error(`Could not parse ${d} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = eE(e), i = e.readUInt8Enum(pn, (d) => {
    throw new Error(`Could not parse ${d} as AnchorMode`);
  }), o = e.readUInt8Enum(za, (d) => {
    throw new Error(`Could not parse ${d} as PostConditionMode`);
  }), a = rg(e, ot.PostCondition), c = n3(e), u = new nE({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Rd = BigInt("18446744073709551615");
function Vc(t) {
  const e = Ye(t);
  if (e < 0n || e > Rd)
    throw new RangeError(`Post-condition amount must be between 0 and ${Rd} (u64 max), received: ${e}`);
  return e;
}
var zl;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(zl || (zl = {}));
var Rl;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Rl || (Rl = {}));
function sE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.STX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: Je.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.Fungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: Je.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount),
        asset: Hd(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.NonFungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: Je.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        asset: Hd(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.Staking,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: Je.Origin } : so(t.address),
        conditionCode: sa(t.condition),
        amount: Vc(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.PoX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: Je.Origin } : so(t.address),
        conditionCode: iE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function sa(t) {
  return zl[t];
}
function iE(t) {
  return Rl[t];
}
function yg(t) {
  const e = sE(t);
  return t3(e);
}
function oE(t, e, n) {
  return Zu(wg(t), n);
}
function wg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = So(r);
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
    return BigInt(`0x${lE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Yu(t, e = 8) {
  return (typeof t == "bigint" ? t : wg(t)).toString(16).padStart(e * 2, "0");
}
function Zu(t, e = 16) {
  const n = Yu(t, e);
  return So(n);
}
function aE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const cE = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += cE[n];
  return e;
}
function So(t) {
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
function Qu(t) {
  return new TextEncoder().encode(t);
}
function uE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function fE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Gd(t) {
  if (t.some(fE))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Ju(...t) {
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
function Tr(t) {
  return Ju(...t.map((e) => typeof e == "number" ? Gd([e]) : e instanceof Array ? Gd(e) : e));
}
function mc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Gl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Gl || (Gl = {}));
Gl.Mainnet;
const dE = 128, hE = 128, bg = 16;
var Kl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Kl || (Kl = {}));
var Kd;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Kd || (Kd = {}));
var Vd;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Vd || (Vd = {}));
var Hn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Hn || (Hn = {}));
const qc = ["onChainOnly", "offChainOnly", "any"];
qc[0] + "", Hn.OnChainOnly, qc[1] + "", Hn.OffChainOnly, qc[2] + "", Hn.Any, Hn.OnChainOnly + "", Hn.OnChainOnly, Hn.OffChainOnly + "", Hn.OffChainOnly, Hn.Any + "", Hn.Any;
var Vl;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Vl || (Vl = {}));
Vl.Mainnet;
var qd;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(qd || (qd = {}));
var ms;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(ms || (ms = {}));
var Wd;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Wd || (Wd = {}));
var Xd;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(Xd || (Xd = {}));
var Yd;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Yd || (Yd = {}));
var Zd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Zd || (Zd = {}));
var Qd;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Qd || (Qd = {}));
var Jd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Jd || (Jd = {}));
var ql;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ql || (ql = {}));
var th;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(th || (th = {}));
var eh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(eh || (eh = {}));
function Wl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function pE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function mg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function gE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Wl(t.outputLen), Wl(t.blockLen);
}
function yE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function wE(t, e) {
  mg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Wc = {
  number: Wl,
  bool: pE,
  bytes: mg,
  hash: gE,
  exists: yE,
  output: wE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Xc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Wn = (t, e) => t << 32 - e | t >>> e, bE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!bE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function mE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function xg(t) {
  if (typeof t == "string" && (t = mE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let xE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ri(t) {
  const e = (r) => t().update(xg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function SE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let tf = class extends xE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Xc(this.buffer);
  }
  update(e) {
    Wc.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = xg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Xc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Wc.exists(this), Wc.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    SE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Xc(e), c = this.outputLen;
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
const EE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Sg = Uint8Array.from({ length: 16 }, (t, e) => e), AE = Sg.map((t) => (9 * t + 5) % 16);
let ef = [Sg], nf = [AE];
for (let t = 0; t < 4; t++)
  for (let e of [ef, nf])
    e.push(e[t].map((n) => EE[n]));
const Eg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), vE = ef.map((t, e) => t.map((n) => Eg[e][n])), $E = nf.map((t, e) => t.map((n) => Eg[e][n])), kE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), IE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ia = (t, e) => t << e | t >>> 32 - e;
function nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const oa = new Uint32Array(16);
let LE = class extends tf {
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
      oa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, x = kE[p], T = IE[p], q = ef[p], W = nf[p], E = vE[p], N = $E[p];
      for (let B = 0; B < 16; B++) {
        const tt = ia(r + nh(p, i, a, u) + oa[q[B]] + x, E[B]) + l | 0;
        r = l, l = u, u = ia(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = ia(s + nh(v, o, c, d) + oa[W[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = ia(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
ri(() => new LE());
const CE = (t, e, n) => t & e ^ ~t & n, TE = (t, e, n) => t & e ^ t & n ^ e & n, BE = new Uint32Array([
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
]), Qr = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jr = new Uint32Array(64);
let Ag = class extends tf {
  constructor() {
    super(64, 32, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
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
      Jr[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Jr[l - 15], p = Jr[l - 2], v = Wn(y, 7) ^ Wn(y, 18) ^ y >>> 3, x = Wn(p, 17) ^ Wn(p, 19) ^ p >>> 10;
      Jr[l] = x + Jr[l - 7] + v + Jr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Wn(a, 6) ^ Wn(a, 11) ^ Wn(a, 25), p = d + y + CE(a, c, u) + BE[l] + Jr[l] | 0, x = (Wn(r, 2) ^ Wn(r, 13) ^ Wn(r, 22)) + TE(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    Jr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, ME = class extends Ag {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
ri(() => new Ag());
ri(() => new ME());
const aa = BigInt(2 ** 32 - 1), Xl = BigInt(32);
function vg(t, e = !1) {
  return e ? { h: Number(t & aa), l: Number(t >> Xl & aa) } : { h: Number(t >> Xl & aa) | 0, l: Number(t & aa) | 0 };
}
function NE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = vg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const PE = (t, e) => BigInt(t >>> 0) << Xl | BigInt(e >>> 0), _E = (t, e, n) => t >>> n, UE = (t, e, n) => t << 32 - n | e >>> n, HE = (t, e, n) => t >>> n | e << 32 - n, OE = (t, e, n) => t << 32 - n | e >>> n, DE = (t, e, n) => t << 64 - n | e >>> n - 32, FE = (t, e, n) => t >>> n - 32 | e << 64 - n, jE = (t, e) => e, zE = (t, e) => t, RE = (t, e, n) => t << n | e >>> 32 - n, GE = (t, e, n) => e << n | t >>> 32 - n, KE = (t, e, n) => e << n - 32 | t >>> 64 - n, VE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function qE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const WE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), XE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, YE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), ZE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, QE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), JE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ut = {
  fromBig: vg,
  split: NE,
  toBig: PE,
  shrSH: _E,
  shrSL: UE,
  rotrSH: HE,
  rotrSL: OE,
  rotrBH: DE,
  rotrBL: FE,
  rotr32H: jE,
  rotr32L: zE,
  rotlSH: RE,
  rotlSL: GE,
  rotlBH: KE,
  rotlBL: VE,
  add: qE,
  add3L: WE,
  add3H: XE,
  add4L: YE,
  add4H: ZE,
  add5H: JE,
  add5L: QE
}, [tA, eA] = Ut.split([
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
].map((t) => BigInt(t))), ts = new Uint32Array(80), es = new Uint32Array(80);
let xc = class extends tf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: v, Hh: x, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ts[E] = e.getUint32(n), es[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const N = ts[E - 15] | 0, B = es[E - 15] | 0, tt = Ut.rotrSH(N, B, 1) ^ Ut.rotrSH(N, B, 8) ^ Ut.shrSH(N, B, 7), et = Ut.rotrSL(N, B, 1) ^ Ut.rotrSL(N, B, 8) ^ Ut.shrSL(N, B, 7), K = ts[E - 2] | 0, j = es[E - 2] | 0, $ = Ut.rotrSH(K, j, 19) ^ Ut.rotrBH(K, j, 61) ^ Ut.shrSH(K, j, 6), P = Ut.rotrSL(K, j, 19) ^ Ut.rotrBL(K, j, 61) ^ Ut.shrSL(K, j, 6), M = Ut.add4L(et, P, es[E - 7], es[E - 16]), V = Ut.add4H(M, tt, $, ts[E - 7], ts[E - 16]);
      ts[E] = V | 0, es[E] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: v, Gh: x, Gl: T, Hh: q, Hl: W } = this;
    for (let E = 0; E < 80; E++) {
      const N = Ut.rotrSH(l, y, 14) ^ Ut.rotrSH(l, y, 18) ^ Ut.rotrBH(l, y, 41), B = Ut.rotrSL(l, y, 14) ^ Ut.rotrSL(l, y, 18) ^ Ut.rotrBL(l, y, 41), tt = l & p ^ ~l & x, et = y & v ^ ~y & T, K = Ut.add5L(W, B, et, eA[E], es[E]), j = Ut.add5H(K, q, N, tt, tA[E], ts[E]), $ = K | 0, P = Ut.rotrSH(r, s, 28) ^ Ut.rotrBH(r, s, 34) ^ Ut.rotrBH(r, s, 39), M = Ut.rotrSL(r, s, 28) ^ Ut.rotrBL(r, s, 34) ^ Ut.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      q = x | 0, W = T | 0, x = p | 0, T = v | 0, p = l | 0, v = y | 0, { h: l, l: y } = Ut.add(u | 0, d | 0, j | 0, $ | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = Ut.add3L($, M, ct);
      r = Ut.add3H(X, j, P, V), s = X | 0;
    }
    ({ h: r, l: s } = Ut.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ut.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ut.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ut.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ut.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: v } = Ut.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: x, l: T } = Ut.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: q, l: W } = Ut.add(this.Hh | 0, this.Hl | 0, q | 0, W | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, v, x, T, q, W);
  }
  roundClean() {
    ts.fill(0), es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, nA = class extends xc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, rA = class extends xc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, sA = class extends xc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ri(() => new xc());
ri(() => new nA());
ri(() => new rA());
ri(() => new sA());
function iA(t, e, n) {
  const s = dE;
  if (SA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Kl.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var ze;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(ze || (ze = {}));
let oA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, $g = class extends oA {
  constructor(e) {
    super(e);
  }
};
function Sc(t) {
  const e = [];
  return e.push(So(Yu(t.version, 1))), e.push(So(t.hash160)), Tr(e);
}
function aA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Sc(t.address)), t.prefix === ql.Contract && e.push(Eo(t.contractName)), Tr(e);
}
function Eo(t) {
  const e = [], n = Qu(t.content), r = n.byteLength;
  return e.push(So(Yu(r, t.lengthPrefixBytes))), e.push(n), Tr(e);
}
function cA(t) {
  const e = [];
  return e.push(Sc(t.address)), e.push(Eo(t.contractName)), e.push(Eo(t.assetName)), Tr(e);
}
function kg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(aA(t.principal)), (t.conditionType === ms.Fungible || t.conditionType === ms.NonFungible) && e.push(cA(t.assetInfo)), t.conditionType === ms.NonFungible && e.push(Gs(t.assetName)), e.push(t.conditionCode), t.conditionType === ms.STX || t.conditionType === ms.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new $g("The post-condition amount may not be larger than 8 bytes");
    e.push(oE(t.amount, !1, 8));
  }
  return Tr(e);
}
function ar(t, e) {
  return Tr([t, e]);
}
function lA(t) {
  return new Uint8Array([t.type]);
}
function uA(t) {
  return t.type === ze.OptionalNone ? new Uint8Array([t.type]) : ar(t.type, Gs(t.value));
}
function fA(t) {
  const e = new Uint8Array(4);
  return mc(e, t.buffer.length, 0), ar(t.type, Ju(e, t.buffer));
}
function dA(t) {
  const e = Zu(aE(t.value, BigInt(hE)), bg);
  return ar(t.type, e);
}
function hA(t) {
  const e = Zu(t.value, bg);
  return ar(t.type, e);
}
function pA(t) {
  return ar(t.type, Sc(t.address));
}
function gA(t) {
  return ar(t.type, Ju(Sc(t.address), Eo(t.contractName)));
}
function yA(t) {
  return ar(t.type, Gs(t.value));
}
function wA(t) {
  const e = [], n = new Uint8Array(4);
  mc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Gs(r);
    e.push(s);
  }
  return ar(t.type, Tr(e));
}
function bA(t) {
  const e = [], n = new Uint8Array(4);
  mc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = iA(s);
    e.push(Eo(i));
    const o = Gs(t.data[s]);
    e.push(o);
  }
  return ar(t.type, Tr(e));
}
function Ig(t, e) {
  const n = [], r = e == "ascii" ? uE(t.data) : Qu(t.data), s = new Uint8Array(4);
  return mc(s, r.length, 0), n.push(s), n.push(r), ar(t.type, Tr(n));
}
function mA(t) {
  return Ig(t, "ascii");
}
function xA(t) {
  return Ig(t, "utf8");
}
function Gs(t) {
  switch (t.type) {
    case ze.BoolTrue:
    case ze.BoolFalse:
      return lA(t);
    case ze.OptionalNone:
    case ze.OptionalSome:
      return uA(t);
    case ze.Buffer:
      return fA(t);
    case ze.UInt:
      return hA(t);
    case ze.Int:
      return dA(t);
    case ze.PrincipalStandard:
      return pA(t);
    case ze.PrincipalContract:
      return gA(t);
    case ze.ResponseOk:
    case ze.ResponseErr:
      return yA(t);
    case ze.List:
      return wA(t);
    case ze.Tuple:
      return bA(t);
    case ze.StringASCII:
      return mA(t);
    case ze.StringUTF8:
      return xA(t);
    default:
      throw new $g("Unable to serialize. Invalid Clarity Value.");
  }
}
const SA = (t, e) => t ? Qu(t).length > e : !1, EA = "connect-ui";
let va, Lg, gn = !1, Yl = !1;
const Cr = (t, e = "") => () => {
}, AA = (t, e) => () => {
}, vA = "{visibility:hidden}.hydrated{visibility:inherit}", rh = {}, $A = "http://www.w3.org/2000/svg", kA = "http://www.w3.org/1999/xhtml", IA = (t) => t != null, rf = (t) => (t = typeof t, t === "object" || t === "function");
function Cg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Bt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let d = 0; d < u.length; d++)
      r = u[d], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !rf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Zl(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((d) => u[d]).join(" "));
  }
  const c = Zl(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Zl = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, LA = {}, CA = (t) => t && t.$tag$ === LA, TA = (t, e) => t != null && !rf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, BA = (t) => Xi(t).$hostElement$, MA = (t, e, n) => {
  const r = Xe.ce(e, n);
  return t.dispatchEvent(r), r;
}, sh = /* @__PURE__ */ new WeakMap(), NA = (t, e, n) => {
  let r = Ga.get(t);
  JA && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Ga.set(t, r);
}, PA = (t, e, n, r) => {
  var s;
  let i = Tg(e);
  const o = Ga.get(i);
  if (t = t.nodeType === 11 ? t : nr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = sh.get(t), c;
      if (a || sh.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = nr.createElement("style"), c.innerHTML = o;
          const u = (s = Xe.$nonce$) !== null && s !== void 0 ? s : Cg(nr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, _A = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Cr("attachStyles", e.$tagName$), i = PA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Tg = (t, e) => "sc-" + t.$tagName$, ih = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = ah(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = oh(n), d = oh(r);
      c.remove(...u.filter((l) => l && !d.includes(l))), c.add(...d.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : ah(Ec, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && Xe.rel(t, e, n, !1), r && Xe.ael(t, e, r, !1);
    else {
      const c = rf(r);
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
}, UA = /\s/, oh = (t) => t ? t.split(UA) : [], Bg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || rh, o = e.$attrs$ || rh;
  for (r in i)
    r in o || ih(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    ih(s, r, i[r], o[r], n, e.$flags$);
}, sf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = nr.createTextNode(s.$text$);
  else {
    if (gn || (gn = s.$tag$ === "svg"), o = s.$elm$ = nr.createElementNS(gn ? $A : kA, s.$tag$), gn && s.$tag$ === "foreignObject" && (gn = !1), Bg(null, s, gn), IA(va) && o["s-si"] !== va && o.classList.add(o["s-si"] = va), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = sf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? gn = !1 : o.tagName === "foreignObject" && (gn = !0);
  }
  return o;
}, Mg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Lg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = sf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Ng = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, HA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, d = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : d == null ? d = r[++i] : l == null ? l = r[--u] : ca(a, d) ? (co(a, d), a = e[++s], d = r[++i]) : ca(c, l) ? (co(c, l), c = e[--o], l = r[--u]) : ca(a, l) ? (co(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : ca(c, d) ? (co(c, d), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], d = r[++i]) : (y = sf(e && e[i], n, i), d = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Mg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Ng(e, s, o);
}, ca = (t, e) => t.$tag$ === e.$tag$, co = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (gn = i === "svg" ? !0 : i === "foreignObject" ? !1 : gn, Bg(t, e, gn), r !== null && s !== null ? HA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Mg(n, null, e, s, 0, s.length - 1)) : r !== null && Ng(r, 0, r.length - 1), gn && i === "svg" && (gn = !1)) : t.$text$ !== o && (n.data = o);
}, OA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Zl(null, null), s = CA(e) ? e : Bt(null, null, e);
  Lg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, va = n["s-sc"], co(r, s);
}, Pg = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, of = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Pg(t, t.$ancestorComponent$), e4(() => DA(t, e));
}, DA = (t, e) => {
  const n = Cr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), RA(s, () => FA(t, r, e));
}, FA = async (t, e, n) => {
  const r = t.$hostElement$, s = Cr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && _A(t);
  const o = Cr("render", t.$cmpMeta$.$tagName$);
  jA(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => zA(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, jA = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, OA(t, e);
  } catch (r) {
    Ao(r, t.$hostElement$);
  }
  return null;
}, zA = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Cr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Ug(n), r(), t.$onReadyResolve$(n), s || _g()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && cf(() => of(t, !1)), t.$flags$ &= -517;
}, _g = (t) => {
  Ug(nr.documentElement), cf(() => MA(Ec, "appload", { detail: { namespace: EA } }));
}, RA = (t, e) => t && t.then ? t.then(e) : e(), Ug = (t) => t.classList.add("hydrated"), GA = (t, e) => Xi(t).$instanceValues$.get(e), KA = (t, e, n, r) => {
  const s = Xi(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = TA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && of(s, !1));
}, Hg = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return GA(this, i);
        },
        set(a) {
          KA(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        Xe.jmp(() => {
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
}, VA = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = QA(n), s.then) {
        const c = AA();
        s = await s, c();
      }
      s.isProxied || (Hg(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Cr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ao(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Tg(n);
      if (!Ga.has(c)) {
        const u = Cr("registerStyles", n.$tagName$);
        NA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => of(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, qA = (t) => {
  if (!(Xe.$flags$ & 1)) {
    const e = Xi(t), n = e.$cmpMeta$, r = Cr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Pg(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), VA(t, e, n);
    }
    r();
  }
}, WA = (t) => {
  Xe.$flags$ & 1 || Xi(t);
}, XA = (t, e = {}) => {
  var n;
  const r = Cr(), s = [], i = e.exclude || [], o = Ec.customElements, a = nr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ nr.createElement("style"), d = [];
  let l, y = !0;
  Object.assign(Xe, e), Xe.$resourcesUrl$ = new URL(e.resourcesUrl || "./", nr.baseURI).href, t.map((p) => {
    p[1].map((v) => {
      const x = {
        $flags$: v[0],
        $tagName$: v[1],
        $members$: v[2],
        $listeners$: v[3]
      };
      x.$members$ = v[2];
      const T = x.$tagName$, q = class extends HTMLElement {
        // StencilLazyHost
        constructor(W) {
          super(W), W = this, ZA(W, x), x.$flags$ & 1 && W.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? d.push(this) : Xe.jmp(() => qA(this));
        }
        disconnectedCallback() {
          Xe.jmp(() => WA(this));
        }
        componentOnReady() {
          return Xi(this).$onReadyPromise$;
        }
      };
      x.$lazyBundleId$ = p[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Hg(
        q,
        x,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + vA, u.setAttribute("data-styles", "");
    const p = (n = Xe.$nonce$) !== null && n !== void 0 ? n : Cg(nr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, d.length ? d.map((p) => p.connectedCallback()) : Xe.jmp(() => l = setTimeout(_g, 30)), r();
}, af = /* @__PURE__ */ new WeakMap(), Xi = (t) => af.get(t), YA = (t, e) => af.set(e.$lazyInstance$ = t, e), ZA = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], af.set(t, n);
}, ah = (t, e) => e in t, Ao = (t, e) => (0, console.error)(t, e), Yc = /* @__PURE__ */ new Map(), QA = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Yc.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Yc.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => $$).then(o, Ao);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Yc.set(s, o), o[r]), Ao);
}, Ga = /* @__PURE__ */ new Map(), Ec = typeof window < "u" ? window : {}, nr = Ec.document || { head: {} }, Xe = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Og = (t) => Promise.resolve(t), JA = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), ch = [], Dg = [], t4 = (t, e) => (n) => {
  t.push(n), Yl || (Yl = !0, Xe.$flags$ & 4 ? cf(Ql) : Xe.raf(Ql));
}, lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ao(n);
    }
  t.length = 0;
}, Ql = () => {
  lh(ch), lh(Dg), (Yl = ch.length > 0) && Xe.raf(Ql);
}, cf = (t) => Og().then(t), e4 = /* @__PURE__ */ t4(Dg), n4 = () => Og(), r4 = (t, e) => typeof window > "u" ? Promise.resolve() : n4().then(() => XA([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var s4 = Object.defineProperty, i4 = Object.defineProperties, o4 = Object.getOwnPropertyDescriptors, Ka = Object.getOwnPropertySymbols, Fg = Object.prototype.hasOwnProperty, jg = Object.prototype.propertyIsEnumerable, uh = (t, e, n) => e in t ? s4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Sn = (t, e) => {
  for (var n in e || (e = {})) Fg.call(e, n) && uh(t, n, e[n]);
  if (Ka) for (var n of Ka(e)) jg.call(e, n) && uh(t, n, e[n]);
  return t;
}, zn = (t, e) => i4(t, o4(e)), zg = (t, e) => {
  var n = {};
  for (var r in t) Fg.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ka) for (var r of Ka(t)) e.indexOf(r) < 0 && jg.call(t, r) && (n[r] = t[r]);
  return n;
};
function Rg() {
  return gc(Os()) || window.StacksProvider || window.BlockstackProvider;
}
function Ac(t) {
  return t ? typeof t == "string" ? Fs.fromName(t) : "version" in t ? t : "url" in t ? new kl({ url: t.url }) : t.transactionVersion === zs.Mainnet ? new kl({ url: t.client.baseUrl }) : new Il({ url: t.client.baseUrl }) : new Il();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var a4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(a4 || {}), c4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(c4 || {}), lf = (t) => {
  let e = t;
  if (!e) {
    let n = new x0(["store_write"], document.location.href);
    e = new $l({ appConfig: n });
  }
  return e;
};
function Gg(t) {
  try {
    return lf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var Kg = (t) => {
  let e = lf(t).loadUserData().appPrivateKey, n = qe.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function l4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [js.Mainnet]: "mainnet", [js.Testnet]: "testnet" }, a = Ac(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function u4(t) {
  let e = Ac(t.network), n = lf(t.userSession), r = zn(Sn({}, t), { network: e, userSession: n });
  return Sn({ stxAddress: l4(r) }, r);
}
async function f4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(yg) : n = n.map((r) => mt(kg(r)))), new qe.TokenSigner("ES256k", e).signAsync(zn(Sn({}, t), { postConditions: n }));
}
function d4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(yg) : e = e.map((n) => mt(kg(n)))), qe.createUnsecuredToken(zn(Sn({}, t), { postConditions: e }));
}
var h4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Qt(a.replace(/^0x/, "")), u = rE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, zn(Sn({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, zn(Sn({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, p4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = zg(e, ["amount", "appDetails", "userSession"]);
  if (Gg(s)) {
    let { privateKey: a, publicKey: c } = Kg(s), u = zn(Sn({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), f4(u, a);
  }
  let o = zn(Sn({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), d4(o);
};
async function g4(t, e, n) {
  let r = await e(zn(Sn(Sn({}, u4(t)), t), { network: Ac(t.network) }));
  return h4({ token: r, options: t }, n);
}
function y4(t, e = Rg()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return g4(t, p4, e);
}
function Vg(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? zn(Sn({}, t), { message: Od(e), domain: Od(n) }) : zn(Sn({}, t), { message: mt(Gs(e)), domain: mt(Gs(n)) });
}
async function w4(t, e) {
  return new qe.TokenSigner("ES256k", e).signAsync(Vg(t));
}
async function b4(t) {
  let e = t, { userSession: n } = e, r = zg(e, ["userSession"]);
  if (Gg(n)) {
    let { privateKey: s, publicKey: i } = Kg(n), o = zn(Sn({}, r), { publicKey: i });
    return w4(o, s);
  }
  return qe.createUnsecuredToken(Vg(t));
}
var m4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(m4 || {}), qg = "asigna-stx", fh = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === qg && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(S4(t, e), "*");
}), x4 = { authenticationRequest: async (t) => fh(t, "authenticationRequest"), transactionRequest: async (t) => fh(t, "transactionRequest") }, S4 = (t, e) => ({ source: qg, [e]: t }), E4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = x4);
};
E4();
var A4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function v4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = Os(), o = Rg();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    r4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : A4, c = gx(a), u = document.createElement("connect-modal");
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
    let y = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", y), u.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var la = v4(y4);
function gs(t, e, n) {
  return uf(en(t, e), n);
}
function en(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = be(r);
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
      const r = I4(BigInt(`0x${Rt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Rt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function dh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ho(t, e = 8) {
  return (typeof t == "bigint" ? t : en(t, !1)).toString(16).padStart(e * 2, "0");
}
function vc(t) {
  return parseInt(t, 16);
}
function uf(t, e = 16) {
  const n = Ho(t, e);
  return be(n);
}
function $4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function k4(t, e) {
  return t & BigInt(1) << e;
}
function I4(t, e) {
  return k4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const L4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Rt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += L4[n];
  return e;
}
function be(t) {
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
function Yi(t) {
  return new TextEncoder().encode(t);
}
function ff(t) {
  return new TextDecoder().decode(t);
}
function Wg(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function C4(t) {
  return String.fromCharCode.apply(null, t);
}
function T4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function hh(t) {
  if (t.some(T4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function $c(...t) {
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
function _e(t) {
  return $c(...t.map((e) => typeof e == "number" ? hh([e]) : e instanceof Array ? hh(e) : e));
}
var ph;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(yh || (yh = {}));
const Xg = 33, Zc = 32;
function B4(t) {
  if (t.length < Zc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Zc * 2), r = t.slice(2 + Zc * 2);
  return {
    recoveryId: vc(e),
    r: n,
    s: r
  };
}
function M4(t) {
  const e = typeof t == "string" ? be(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function N4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function P4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function _4(t, e) {
  return t[e];
}
function U4(t, e, n = 0) {
  return t[n] = e, t;
}
function H4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ks(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Jl;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Jl || (Jl = {}));
const O4 = Jl.Mainnet, D4 = 128, F4 = 128, Yg = 16, Ts = 32, tu = 80, kc = 65, j4 = 32, z4 = 64, Va = 34;
var ht;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ht || (ht = {}));
var Ft;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ft || (Ft = {}));
var eu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(eu || (eu = {}));
var on;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(on || (on = {}));
const $a = ["onChainOnly", "offChainOnly", "any"], wh = {
  [$a[0]]: on.OnChainOnly,
  [$a[1]]: on.OffChainOnly,
  [$a[2]]: on.Any,
  [on.OnChainOnly]: on.OnChainOnly,
  [on.OffChainOnly]: on.OffChainOnly,
  [on.Any]: on.Any
};
function R4(t) {
  if (t in wh)
    return wh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${$a.join(", ")}`);
}
var qa;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(qa || (qa = {}));
qa.Mainnet;
var Fi;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Fi || (Fi = {}));
var an;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(an || (an = {}));
var Te;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Te || (Te = {}));
var ce;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ce || (ce = {}));
var Wa;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Wa || (Wa = {}));
var Ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ae || (Ae = {}));
var vo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(vo || (vo = {}));
var nu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(nu || (nu = {}));
var $o;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($o || ($o = {}));
var bh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(bh || (bh = {}));
var mh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(mh || (mh = {}));
function ru(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function G4(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Zg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function K4(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ru(t.outputLen), ru(t.blockLen);
}
function V4(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function q4(t, e) {
  Zg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const $s = {
  number: ru,
  bool: G4,
  bytes: Zg,
  hash: K4,
  exists: V4,
  output: q4
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), Xn = (t, e) => t << 32 - e | t >>> e, W4 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!W4)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function X4(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function df(t) {
  if (typeof t == "string" && (t = X4(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class Qg {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function si(t) {
  const e = (r) => t().update(df(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Y4(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class hf extends Qg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qc(this.buffer);
  }
  update(e) {
    $s.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = df(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Qc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    $s.exists(this), $s.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Y4(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Qc(e), c = this.outputLen;
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
const Z4 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Jg = Uint8Array.from({ length: 16 }, (t, e) => e), Q4 = Jg.map((t) => (9 * t + 5) % 16);
let pf = [Jg], gf = [Q4];
for (let t = 0; t < 4; t++)
  for (let e of [pf, gf])
    e.push(e[t].map((n) => Z4[n]));
const ty = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), J4 = pf.map((t, e) => t.map((n) => ty[e][n])), tv = gf.map((t, e) => t.map((n) => ty[e][n])), ev = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), nv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ua = (t, e) => t << e | t >>> 32 - e;
function xh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const fa = new Uint32Array(16);
class rv extends hf {
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
      fa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, d = u, l = this.h4 | 0, y = l;
    for (let p = 0; p < 5; p++) {
      const v = 4 - p, x = ev[p], T = nv[p], q = pf[p], W = gf[p], E = J4[p], N = tv[p];
      for (let B = 0; B < 16; B++) {
        const tt = ua(r + xh(p, i, a, u) + fa[q[B]] + x, E[B]) + l | 0;
        r = l, l = u, u = ua(a, 10) | 0, a = i, i = tt;
      }
      for (let B = 0; B < 16; B++) {
        const tt = ua(s + xh(v, o, c, d) + fa[W[B]] + T, N[B]) + y | 0;
        s = y, y = d, d = ua(c, 10) | 0, c = o, o = tt;
      }
    }
    this.set(this.h1 + a + d | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    fa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const sv = si(() => new rv()), iv = (t, e, n) => t & e ^ ~t & n, ov = (t, e, n) => t & e ^ t & n ^ e & n, av = new Uint32Array([
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
]), ns = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), rs = new Uint32Array(64);
class ey extends hf {
  constructor() {
    super(64, 32, 8, !1), this.A = ns[0] | 0, this.B = ns[1] | 0, this.C = ns[2] | 0, this.D = ns[3] | 0, this.E = ns[4] | 0, this.F = ns[5] | 0, this.G = ns[6] | 0, this.H = ns[7] | 0;
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
      rs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = rs[l - 15], p = rs[l - 2], v = Xn(y, 7) ^ Xn(y, 18) ^ y >>> 3, x = Xn(p, 17) ^ Xn(p, 19) ^ p >>> 10;
      rs[l] = x + rs[l - 7] + v + rs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: d } = this;
    for (let l = 0; l < 64; l++) {
      const y = Xn(a, 6) ^ Xn(a, 11) ^ Xn(a, 25), p = d + y + iv(a, c, u) + av[l] + rs[l] | 0, x = (Xn(r, 2) ^ Xn(r, 13) ^ Xn(r, 22)) + ov(r, s, i) | 0;
      d = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + x | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, d = d + this.H | 0, this.set(r, s, i, o, a, c, u, d);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class cv extends ey {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const yf = si(() => new ey());
si(() => new cv());
const da = BigInt(2 ** 32 - 1), su = BigInt(32);
function ny(t, e = !1) {
  return e ? { h: Number(t & da), l: Number(t >> su & da) } : { h: Number(t >> su & da) | 0, l: Number(t & da) | 0 };
}
function lv(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ny(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const uv = (t, e) => BigInt(t >>> 0) << su | BigInt(e >>> 0), fv = (t, e, n) => t >>> n, dv = (t, e, n) => t << 32 - n | e >>> n, hv = (t, e, n) => t >>> n | e << 32 - n, pv = (t, e, n) => t << 32 - n | e >>> n, gv = (t, e, n) => t << 64 - n | e >>> n - 32, yv = (t, e, n) => t >>> n - 32 | e << 64 - n, wv = (t, e) => e, bv = (t, e) => t, mv = (t, e, n) => t << n | e >>> 32 - n, xv = (t, e, n) => e << n | t >>> 32 - n, Sv = (t, e, n) => e << n - 32 | t >>> 64 - n, Ev = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Av(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const vv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), $v = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, kv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Iv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Lv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Cv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ht = {
  fromBig: ny,
  split: lv,
  toBig: uv,
  shrSH: fv,
  shrSL: dv,
  rotrSH: hv,
  rotrSL: pv,
  rotrBH: gv,
  rotrBL: yv,
  rotr32H: wv,
  rotr32L: bv,
  rotlSH: mv,
  rotlSL: xv,
  rotlBH: Sv,
  rotlBL: Ev,
  add: Av,
  add3L: vv,
  add3H: $v,
  add4L: kv,
  add4H: Iv,
  add5H: Cv,
  add5L: Lv
}, [Tv, Bv] = Ht.split([
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
].map((t) => BigInt(t))), ss = new Uint32Array(80), is = new Uint32Array(80);
class Ic extends hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: d, Fh: l, Fl: y, Gh: p, Gl: v, Hh: x, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, d, l, y, p, v, x, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = d | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = p | 0, this.Gl = v | 0, this.Hh = x | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      ss[E] = e.getUint32(n), is[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const N = ss[E - 15] | 0, B = is[E - 15] | 0, tt = Ht.rotrSH(N, B, 1) ^ Ht.rotrSH(N, B, 8) ^ Ht.shrSH(N, B, 7), et = Ht.rotrSL(N, B, 1) ^ Ht.rotrSL(N, B, 8) ^ Ht.shrSL(N, B, 7), K = ss[E - 2] | 0, j = is[E - 2] | 0, $ = Ht.rotrSH(K, j, 19) ^ Ht.rotrBH(K, j, 61) ^ Ht.shrSH(K, j, 6), P = Ht.rotrSL(K, j, 19) ^ Ht.rotrBL(K, j, 61) ^ Ht.shrSL(K, j, 6), M = Ht.add4L(et, P, is[E - 7], is[E - 16]), V = Ht.add4H(M, tt, $, ss[E - 7], ss[E - 16]);
      ss[E] = V | 0, is[E] = M | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: d, Eh: l, El: y, Fh: p, Fl: v, Gh: x, Gl: T, Hh: q, Hl: W } = this;
    for (let E = 0; E < 80; E++) {
      const N = Ht.rotrSH(l, y, 14) ^ Ht.rotrSH(l, y, 18) ^ Ht.rotrBH(l, y, 41), B = Ht.rotrSL(l, y, 14) ^ Ht.rotrSL(l, y, 18) ^ Ht.rotrBL(l, y, 41), tt = l & p ^ ~l & x, et = y & v ^ ~y & T, K = Ht.add5L(W, B, et, Bv[E], is[E]), j = Ht.add5H(K, q, N, tt, Tv[E], ss[E]), $ = K | 0, P = Ht.rotrSH(r, s, 28) ^ Ht.rotrBH(r, s, 34) ^ Ht.rotrBH(r, s, 39), M = Ht.rotrSL(r, s, 28) ^ Ht.rotrBL(r, s, 34) ^ Ht.rotrBL(r, s, 39), V = r & i ^ r & a ^ i & a, ct = s & o ^ s & c ^ o & c;
      q = x | 0, W = T | 0, x = p | 0, T = v | 0, p = l | 0, v = y | 0, { h: l, l: y } = Ht.add(u | 0, d | 0, j | 0, $ | 0), u = a | 0, d = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const X = Ht.add3L($, M, ct);
      r = Ht.add3H(X, j, P, V), s = X | 0;
    }
    ({ h: r, l: s } = Ht.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ht.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ht.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: d } = Ht.add(this.Dh | 0, this.Dl | 0, u | 0, d | 0), { h: l, l: y } = Ht.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: p, l: v } = Ht.add(this.Fh | 0, this.Fl | 0, p | 0, v | 0), { h: x, l: T } = Ht.add(this.Gh | 0, this.Gl | 0, x | 0, T | 0), { h: q, l: W } = Ht.add(this.Hh | 0, this.Hl | 0, q | 0, W | 0), this.set(r, s, i, o, a, c, u, d, l, y, p, v, x, T, q, W);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Mv extends Ic {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Nv extends Ic {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Pv extends Ic {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
si(() => new Ic());
si(() => new Mv());
const _v = si(() => new Nv());
si(() => new Pv());
function ry(t) {
  if (be(t).byteLength != kc)
    throw Error("Invalid signature");
  return {
    type: ht.MessageSignature,
    data: t
  };
}
function lo(t, e) {
  return { type: ht.Address, version: t, hash160: e };
}
function Ai(t) {
  return ei.c32address(t.version, t.hash160);
}
function Vs(t, e, n) {
  const r = e || 1, s = n || D4;
  if (xy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ht.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function wf(t) {
  const e = ei.c32addressDecode(t);
  return {
    type: ht.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Uv(t) {
  if (t.type === Z.PrincipalStandard)
    return Ai(t.address);
  if (t.type === Z.PrincipalContract)
    return `${Ai(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function sy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Dv(e, n);
  } else
    return Hv(t);
}
function Hv(t) {
  const e = wf(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Ov(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Dv(t, e) {
  const n = wf(t), r = Vs(e);
  return iy(n, r);
}
function iy(t, e) {
  if (Yi(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function Jc(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${Rt(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return Jn(t.value);
    case Z.ResponseErr:
      return Jn(t.value);
    case Z.ResponseOk:
      return Jn(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return Uv(t);
    case Z.List:
      return t.list.map((r) => Jn(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Jn(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function Jn(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: cs(t), value: Jc(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: cs(t), value: Jc(t, !0), success: !0 };
    default:
      return { type: cs(t), value: Jc(t, !0) };
  }
}
function cs(t) {
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
      return `(optional ${cs(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${cs(t.value)})`;
    case Z.ResponseOk:
      return `(response ${cs(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? cs(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${cs(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${Wg(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${Yi(t.data).length})`;
  }
}
const oy = () => ({ type: Z.BoolTrue }), ay = () => ({ type: Z.BoolFalse }), Fv = (t) => t ? oy() : ay(), Sh = BigInt("0xffffffffffffffffffffffffffffffff"), jv = BigInt(0), Eh = BigInt("0x7fffffffffffffffffffffffffffffff"), Ah = BigInt("-170141183460469231731687303715884105728"), zv = (t) => {
  const e = en(t, !0);
  if (e > Eh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Eh}`);
  if (e < Ah)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Ah}`);
  return { type: Z.Int, value: e };
}, rr = (t) => {
  const e = en(t, !1);
  if (e < jv)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Sh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Sh}`);
  return { type: Z.UInt, value: e };
}, cy = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function ly() {
  return { type: Z.OptionalNone };
}
function uy(t) {
  return { type: Z.OptionalSome, value: t };
}
function Rv(t) {
  return { type: Z.ResponseErr, value: t };
}
function Gv(t) {
  return { type: Z.ResponseOk, value: t };
}
function Kv(t) {
  return { type: Z.List, list: t };
}
function qs(t) {
  for (const e in t)
    if (!P8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const Ve = (t) => ({ type: Z.StringASCII, data: t }), Vv = (t) => ({ type: Z.StringUTF8, data: t });
class fy extends Qg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, $s.hash(e);
    const r = df(n);
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
    return $s.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    $s.exists(this), $s.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const dy = (t, e, n) => new fy(t, e).update(n).digest();
dy.create = (t, e) => new fy(t, e);
Be.hmacSha256Sync = (t, ...e) => {
  const n = dy.create(yf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function ji(t) {
  return {
    type: ht.PublicKey,
    data: be(t)
  };
}
function qv(t, e, n = Ae.Compressed) {
  const r = B4(e.data), s = new mn(dh(r.r), dh(r.s)), i = jt.fromSignature(t, s, r.recoveryId), o = n === Ae.Compressed;
  return i.toHex(o);
}
function Wv(t) {
  return { type: ht.PublicKey, data: t };
}
function Zi(t) {
  return !Rt(t.data).startsWith("04");
}
function Xa(t) {
  return t.data.slice();
}
function Xv(t) {
  const e = Qv(t), n = Mo(e.data.slice(0, 32), e.compressed);
  return ji(Rt(n));
}
function Yv(t) {
  const e = typeof t == "string" ? t : Rt(t), n = jt.fromHex(e).toHex(!0);
  return ji(n);
}
function Zv(t) {
  const e = typeof t == "string" ? t : Rt(t), n = jt.fromHex(e).toHex(!1);
  return ji(n);
}
function iu(t) {
  const e = t.readUInt8(), n = e === 4 ? z4 : j4;
  return Wv(_e([e, t.readBytes(n)]));
}
function Qv(t) {
  const e = M4(t), n = e.length == Xg;
  return { data: e, compressed: n };
}
function Jv(t, e) {
  const [n, r] = ic(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Ho(r, 1) + mn.fromHex(n).toCompactHex();
  return ry(i);
}
function t8(t) {
  return Xv(t.data);
}
function e8(t, e, n) {
  return typeof t == "string" && (t = sy(t)), typeof n == "string" && (n = kh(n)), {
    type: ht.Payload,
    payloadType: Ft.TokenTransfer,
    recipient: t,
    amount: en(e, !1),
    memo: n ?? kh("")
  };
}
function n8(t, e, n, r) {
  return typeof t == "string" && (t = wf(t)), typeof e == "string" && (e = Vs(e)), typeof n == "string" && (n = Vs(n)), {
    type: ht.Payload,
    payloadType: Ft.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function vh(t, e, n) {
  return typeof t == "string" && (t = Vs(t)), typeof e == "string" && (e = f8(e)), typeof n == "number" ? {
    type: ht.Payload,
    payloadType: Ft.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ht.Payload,
    payloadType: Ft.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function r8() {
  return { type: ht.Payload, payloadType: Ft.PoisonMicroblock };
}
function $h(t, e) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  return e != null ? {
    type: ht.Payload,
    payloadType: Ft.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ht.Payload,
    payloadType: Ft.Coinbase,
    coinbaseBytes: t
  };
}
function s8(t, e, n) {
  if (t.byteLength != Ts)
    throw Error(`Coinbase buffer size must be ${Ts} bytes`);
  if (n.byteLength != tu)
    throw Error(`VRF proof buffer size must be ${tu} bytes`);
  return {
    type: ht.Payload,
    payloadType: Ft.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var ou;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(ou || (ou = {}));
function i8(t, e, n, r, s, i, o) {
  return {
    type: ht.Payload,
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
function hy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ft.TokenTransfer:
      e.push(Ne(t.recipient)), e.push(gs(t.amount, !1, 8)), e.push(vr(t.memo));
      break;
    case Ft.ContractCall:
      e.push(vr(t.contractAddress)), e.push(vr(t.contractName)), e.push(vr(t.functionName));
      const n = new Uint8Array(4);
      Ks(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ne(r));
      });
      break;
    case Ft.SmartContract:
      e.push(vr(t.contractName)), e.push(vr(t.codeBody));
      break;
    case Ft.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(vr(t.contractName)), e.push(vr(t.codeBody));
      break;
    case Ft.PoisonMicroblock:
      break;
    case Ft.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ft.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient));
      break;
    case Ft.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient ? uy(t.recipient) : ly())), e.push(t.vrfProof);
      break;
    case Ft.TenureChange:
      e.push(be(t.tenureHash)), e.push(be(t.previousTenureHash)), e.push(be(t.burnViewHash)), e.push(be(t.previousTenureEnd)), e.push(Ks(new Uint8Array(4), t.previousTenureBlocks)), e.push(U4(new Uint8Array(1), t.cause)), e.push(be(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function o8(t) {
  switch (t.readUInt8Enum(Ft, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ft.TokenTransfer:
      const n = Bn(t), r = en(t.readBytes(8), !1), s = gy(t);
      return e8(n, r, s);
    case Ft.ContractCall:
      const i = zi(t), o = Tn(t), a = Tn(t), c = [], u = t.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const N = Bn(t);
        c.push(N);
      }
      return n8(i, o, a, c);
    case Ft.SmartContract:
      const d = Tn(t), l = Tn(t, 4, 1e5);
      return vh(d, l);
    case Ft.VersionedSmartContract: {
      const E = t.readUInt8Enum(eu, (tt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${tt}`);
      }), N = Tn(t), B = Tn(t, 4, 1e5);
      return vh(N, B, E);
    }
    case Ft.PoisonMicroblock:
      return r8();
    case Ft.Coinbase: {
      const E = t.readBytes(Ts);
      return $h(E);
    }
    case Ft.CoinbaseToAltRecipient: {
      const E = t.readBytes(Ts), N = Bn(t);
      return $h(E, N);
    }
    case Ft.NakamotoCoinbase: {
      const E = t.readBytes(Ts), N = Bn(t), B = t.readBytes(tu);
      return s8(E, N, B);
    }
    case Ft.TenureChange:
      const y = Rt(t.readBytes(20)), p = Rt(t.readBytes(20)), v = Rt(t.readBytes(20)), x = Rt(t.readBytes(32)), T = t.readUInt32BE(), q = t.readUInt8Enum(ou, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), W = Rt(t.readBytes(20));
      return i8(y, p, v, x, T, q, W);
  }
}
class Lc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class xs extends Lc {
  constructor(e) {
    super(e);
  }
}
class bn extends Lc {
  constructor(e) {
    super(e);
  }
}
class Ya extends Lc {
  constructor(e) {
    super(e);
  }
}
class ks extends Lc {
  constructor(e) {
    super(e);
  }
}
var Dn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Dn || (Dn = {}));
function au(t) {
  return ry(Rt(t.readBytes(kc)));
}
function vi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ht.TransactionAuthField,
    contents: e
  };
}
function a8(t) {
  const e = t.readUInt8Enum(Dn, (n) => {
    throw new bn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case Dn.PublicKeyCompressed:
      return vi(Ae.Compressed, iu(t));
    case Dn.PublicKeyUncompressed:
      return vi(Ae.Uncompressed, Zv(iu(t).data));
    case Dn.SignatureCompressed:
      return vi(Ae.Compressed, au(t));
    case Dn.SignatureUncompressed:
      return vi(Ae.Uncompressed, au(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function bf(t) {
  return be(t.data);
}
function c8(t) {
  const e = [];
  switch (t.contents.type) {
    case ht.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? Dn.PublicKeyCompressed : Dn.PublicKeyUncompressed), e.push(Xa(Yv(t.contents.data)));
      break;
    case ht.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? Dn.SignatureCompressed : Dn.SignatureUncompressed), e.push(bf(t.contents));
      break;
  }
  return _e(e);
}
function vr(t) {
  switch (t.type) {
    case ht.Address:
      return Oo(t);
    case ht.Principal:
      return py(t);
    case ht.LengthPrefixedString:
      return Ri(t);
    case ht.MemoString:
      return d8(t);
    case ht.AssetInfo:
      return yy(t);
    case ht.PostCondition:
      return h8(t);
    case ht.PublicKey:
      return Xa(t);
    case ht.LengthPrefixedList:
      return Sf(t);
    case ht.Payload:
      return hy(t);
    case ht.TransactionAuthField:
      return c8(t);
    case ht.MessageSignature:
      return bf(t);
  }
}
function l8() {
  return {
    type: ht.Address,
    version: Wa.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function mf(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.SerializeP2WPKH || e === ce.SerializeP2WSH || e === ce.SerializeP2WSHNonSequential) && !r.every(Zi))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.SerializeP2PKH:
      return lo(t, T8(r[0].data));
    case ce.SerializeP2WPKH:
      return lo(t, B8(r[0].data));
    case ce.SerializeP2SH:
    case ce.SerializeP2SHNonSequential:
      return lo(t, M8(n, r.map(Xa)));
    case ce.SerializeP2WSH:
    case ce.SerializeP2WSHNonSequential:
      return lo(t, N8(n, r.map(Xa)));
  }
}
function Oo(t) {
  const e = [];
  return e.push(be(Ho(t.version, 1))), e.push(be(t.hash160)), _e(e);
}
function zi(t) {
  const e = vc(Rt(t.readBytes(1))), n = Rt(t.readBytes(20));
  return { type: ht.Address, version: e, hash160: n };
}
function py(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oo(t.address)), t.prefix === $o.Contract && e.push(Ri(t.contractName)), _e(e);
}
function u8(t) {
  const e = t.readUInt8Enum($o, (s) => {
    throw new bn(`Unexpected Principal payload type: ${s}`);
  }), n = zi(t);
  if (e === $o.Standard)
    return { type: ht.Principal, prefix: e, address: n };
  const r = Tn(t);
  return {
    type: ht.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ri(t) {
  const e = [], n = Yi(t.content), r = n.byteLength;
  return e.push(be(Ho(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function Tn(t, e, n) {
  e = e || 1;
  const r = vc(Rt(t.readBytes(e))), s = ff(t.readBytes(r));
  return Vs(s, e, n ?? 128);
}
function f8(t) {
  return Vs(t, 4, 1e5);
}
function kh(t) {
  if (t && xy(t, Va))
    throw new Error(`Memo exceeds maximum length of ${Va} bytes`);
  return { type: ht.MemoString, content: t };
}
function d8(t) {
  const e = [], n = Yi(t.content), r = C8(Rt(n), Va * 2);
  return e.push(be(r)), _e(e);
}
function gy(t) {
  let e = ff(t.readBytes(Va));
  return e = e.replace(/\u0000*$/, ""), { type: ht.MemoString, content: e };
}
function yy(t) {
  const e = [];
  return e.push(Oo(t.address)), e.push(Ri(t.contractName)), e.push(Ri(t.assetName)), _e(e);
}
function cu(t) {
  return {
    type: ht.AssetInfo,
    address: zi(t),
    contractName: Tn(t),
    assetName: Tn(t)
  };
}
function xf(t, e) {
  return {
    type: ht.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Sf(t) {
  const e = t.values, n = [];
  n.push(be(Ho(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(vr(r));
  return _e(n);
}
function wy(t, e, n) {
  const r = vc(Rt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case ht.Address:
        s.push(zi(t));
        break;
      case ht.LengthPrefixedString:
        s.push(Tn(t));
        break;
      case ht.MemoString:
        s.push(gy(t));
        break;
      case ht.AssetInfo:
        s.push(cu(t));
        break;
      case ht.PostCondition:
        s.push(p8(t));
        break;
      case ht.PublicKey:
        s.push(iu(t));
        break;
      case ht.TransactionAuthField:
        s.push(a8(t));
        break;
    }
  return xf(s, n);
}
function h8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(py(t.principal)), (t.conditionType === an.Fungible || t.conditionType === an.NonFungible) && e.push(yy(t.assetInfo)), t.conditionType === an.NonFungible && e.push(Ne(t.assetName)), e.push(t.conditionCode), t.conditionType === an.STX || t.conditionType === an.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new xs("The post-condition amount may not be larger than 8 bytes");
    e.push(gs(t.amount, !1, 8));
  }
  return _e(e);
}
function p8(t) {
  const e = t.readUInt8Enum(an, (o) => {
    throw new bn(`Could not read ${o} as PostConditionType`);
  }), n = u8(t);
  let r, s, i;
  switch (e) {
    case an.STX:
      return r = t.readUInt8Enum(vo, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: an.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case an.Fungible:
      return s = cu(t), r = t.readUInt8Enum(vo, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Rt(t.readBytes(8))}`), {
        type: ht.PostCondition,
        conditionType: an.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case an.NonFungible:
      s = cu(t);
      const o = Bn(t);
      return r = t.readUInt8Enum(nu, (a) => {
        throw new bn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ht.PostCondition,
        conditionType: an.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function cr(t, e) {
  return _e([t, e]);
}
function g8(t) {
  return new Uint8Array([t.type]);
}
function y8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : cr(t.type, Ne(t.value));
}
function w8(t) {
  const e = new Uint8Array(4);
  return Ks(e, t.buffer.length, 0), cr(t.type, $c(e, t.buffer));
}
function b8(t) {
  const e = uf($4(t.value, BigInt(F4)), Yg);
  return cr(t.type, e);
}
function m8(t) {
  const e = uf(t.value, Yg);
  return cr(t.type, e);
}
function x8(t) {
  return cr(t.type, Oo(t.address));
}
function S8(t) {
  return cr(t.type, $c(Oo(t.address), Ri(t.contractName)));
}
function E8(t) {
  return cr(t.type, Ne(t.value));
}
function A8(t) {
  const e = [], n = new Uint8Array(4);
  Ks(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ne(r);
    e.push(s);
  }
  return cr(t.type, _e(e));
}
function v8(t) {
  const e = [], n = new Uint8Array(4);
  Ks(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Vs(s);
    e.push(Ri(i));
    const o = Ne(t.data[s]);
    e.push(o);
  }
  return cr(t.type, _e(e));
}
function by(t, e) {
  const n = [], r = e == "ascii" ? Wg(t.data) : Yi(t.data), s = new Uint8Array(4);
  return Ks(s, r.length, 0), n.push(s), n.push(r), cr(t.type, _e(n));
}
function $8(t) {
  return by(t, "ascii");
}
function k8(t) {
  return by(t, "utf8");
}
function Ne(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return g8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return y8(t);
    case Z.Buffer:
      return w8(t);
    case Z.UInt:
      return m8(t);
    case Z.Int:
      return b8(t);
    case Z.PrincipalStandard:
      return x8(t);
    case Z.PrincipalContract:
      return S8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return E8(t);
    case Z.List:
      return A8(t);
    case Z.Tuple:
      return v8(t);
    case Z.StringASCII:
      return $8(t);
    case Z.StringUTF8:
      return k8(t);
    default:
      throw new xs("Unable to serialize. Invalid Clarity Value.");
  }
}
function I8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Ih = /* @__PURE__ */ new Map();
function my(t, e) {
  const n = Ih.get(t);
  if (n !== void 0)
    return n(e);
  const r = I8(t);
  return Ih.set(t, r), my(t, e);
}
class go {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return H4(this.readBytes(4), 0);
  }
  readUInt8() {
    return _4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return N4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Rt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Rt(n);
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
    if (my(e, r))
      return r;
    throw n(r);
  }
}
function Bn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new go(be(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new go(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new bn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return zv(e.readBytes(16));
    case Z.UInt:
      return rr(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return cy(e.readBytes(r));
    case Z.BoolTrue:
      return oy();
    case Z.BoolFalse:
      return ay();
    case Z.PrincipalStandard:
      const s = zi(e);
      return Ov(s);
    case Z.PrincipalContract:
      const i = zi(e), o = Tn(e);
      return iy(i, o);
    case Z.ResponseOk:
      return Gv(Bn(e));
    case Z.ResponseErr:
      return Rv(Bn(e));
    case Z.OptionalNone:
      return ly();
    case Z.OptionalSome:
      return uy(Bn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let x = 0; x < a; x++)
        c.push(Bn(e));
      return Kv(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), d = {};
      for (let x = 0; x < u; x++) {
        const T = Tn(e).content;
        if (T === void 0)
          throw new bn('"content" is undefined');
        d[T] = Bn(e);
      }
      return qs(d);
    case Z.StringASCII:
      const l = e.readUInt32BE(), y = C4(e.readBytes(l));
      return Ve(y);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), v = ff(e.readBytes(p));
      return Vv(v);
    default:
      throw new bn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const L8 = (t) => t.length % 2 == 0 ? t : `0${t}`, C8 = (t, e) => t.padEnd(e, "0"), xy = (t, e) => t ? Yi(t).length > e : !1;
function lu(t) {
  return Dp(t);
}
const ko = (t) => sv(yf(t)), Ef = (t) => Rt(_v(t)), T8 = (t) => Rt(ko(t)), B8 = (t) => {
  const e = ko(t), n = $c(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ko(n);
  return Rt(r);
}, M8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = ko(r);
  return Rt(s);
}, N8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = yf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = ko(o);
  return Rt(a);
};
function P8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Sy(t) {
  const e = Ne(t);
  return `0x${Rt(e)}`;
}
function _8(t) {
  return Bn(t);
}
const ki = (t) => {
  try {
    return ei.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Af() {
  return {
    type: ht.MessageSignature,
    data: Rt(new Uint8Array(kc))
  };
}
function Ey(t, e, n, r) {
  const s = mf(0, t, 1, [ji(e)]).hash160, i = Zi(ji(e)) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: en(n, !1),
    fee: en(r, !1),
    keyEncoding: i,
    signature: Af()
  };
}
function Io(t) {
  return "signature" in t;
}
function Lh(t) {
  return t === ce.SerializeP2SH || t === ce.SerializeP2WSH;
}
function U8(t) {
  return t === ce.SerializeP2SHNonSequential || t === ce.SerializeP2WSHNonSequential;
}
function Ch(t) {
  const e = lu(t);
  return e.nonce = 0, e.fee = 0, Io(e) ? e.signature = Af() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function H8(t) {
  const e = [
    t.hashMode,
    be(t.signer),
    gs(t.nonce, !1, 8),
    gs(t.fee, !1, 8),
    t.keyEncoding,
    bf(t.signature)
  ];
  return _e(e);
}
function O8(t) {
  const e = [
    t.hashMode,
    be(t.signer),
    gs(t.nonce, !1, 8),
    gs(t.fee, !1, 8)
  ], n = xf(t.fields);
  e.push(Sf(n));
  const r = new Uint8Array(2);
  return P4(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function D8(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt(`0x${Rt(e.readBytes(8))}`), s = BigInt(`0x${Rt(e.readBytes(8))}`), i = e.readUInt8Enum(Ae, (a) => {
    throw new bn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.SerializeP2WPKH && i != Ae.Compressed)
    throw new bn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = au(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function F8(t, e) {
  const n = Rt(e.readBytes(20)), r = BigInt("0x" + Rt(e.readBytes(8))), s = BigInt("0x" + Rt(e.readBytes(8))), i = wy(e, ht.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ht.PublicKey:
        Zi(u.contents) || (o = !0);
        break;
      case ht.MessageSignature:
        if (u.pubKeyEncoding === Ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ks("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.SerializeP2WSH || t === ce.SerializeP2WSHNonSequential))
    throw new ks("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function tl(t) {
  return Io(t) ? H8(t) : O8(t);
}
function el(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new bn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH ? D8(e, t) : F8(e, t);
}
function Ay(t, e, n, r) {
  const i = t + Rt(new Uint8Array([e])) + Rt(gs(n, !1, 8)) + Rt(gs(r, !1, 8));
  if (be(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Ef(be(i));
}
function vy(t, e, n) {
  const r = 33 + kc, s = Zi(e) ? Ae.Compressed : Ae.Uncompressed, i = t + L8(s.toString(16)) + n.data, o = be(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Ef(o);
}
function j8(t, e, n, r, s) {
  const i = Ay(t, e, n, r), o = Jv(s, i), a = t8(s), c = vy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function $y(t, e, n, r, s, i) {
  const o = Ay(t, e, n, r), a = ji(qv(o, i, s)), c = vy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function z8() {
  const t = Ey(ce.SerializeP2PKH, "", 0, 0);
  return t.signer = l8().hash160, t.keyEncoding = Ae.Compressed, t.signature = Af(), t;
}
function Th(t, e, n) {
  return Io(t) ? R8(t, e, n) : G8(t, e, n);
}
function R8(t, e, n) {
  const { pubKey: r, nextSigHash: s } = $y(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = mf(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ks(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function G8(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ht.PublicKey:
        Zi(c.contents) || (i = !0), r.push(c.contents);
        break;
      case ht.MessageSignature:
        c.pubKeyEncoding === Ae.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: d } = $y(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (Lh(t.hashMode) && (s = d), r.push(u), o += 1, o === 65536)
          throw new ks("Too many signatures");
        break;
    }
  if (Lh(t.hashMode) && o !== t.signaturesRequired || U8(t.hashMode) && o < t.signaturesRequired)
    throw new ks("Incorrect number of signatures");
  if (i && (t.hashMode === ce.SerializeP2WSH || t.hashMode === ce.SerializeP2WSHNonSequential))
    throw new ks("Uncompressed keys are not allowed in this hash mode");
  const a = mf(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ks(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function ky(t) {
  return {
    authType: Te.Standard,
    spendingCondition: t
  };
}
function Iy(t, e) {
  return {
    authType: Te.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ey(ce.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Bh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Te.Standard:
        return ky(Ch(t.spendingCondition));
      case Te.Sponsored:
        return Iy(Ch(t.spendingCondition), z8());
      default:
        throw new Ya("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function K8(t, e) {
  switch (t.authType) {
    case Te.Standard:
      return Th(t.spendingCondition, e, Te.Standard);
    case Te.Sponsored:
      return Th(t.spendingCondition, e, Te.Standard);
    default:
      throw new Ya("Invalid origin auth type");
  }
}
function V8(t, e) {
  switch (t.authType) {
    case Te.Standard:
      const n = {
        ...t.spendingCondition,
        fee: en(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Te.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: en(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function q8(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: en(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function W8(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: en(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function X8(t, e) {
  const n = {
    ...e,
    nonce: en(e.nonce, !1),
    fee: en(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function Y8(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Te.Standard:
      e.push(tl(t.spendingCondition));
      break;
    case Te.Sponsored:
      e.push(tl(t.spendingCondition)), e.push(tl(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function Z8(t) {
  const e = t.readUInt8Enum(Te, (r) => {
    throw new bn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Te.Standard:
      return n = el(t), ky(n);
    case Te.Sponsored:
      n = el(t);
      const r = el(t);
      return Iy(n, r);
  }
}
class Q8 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: en(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? O4, this.postConditionMode = i ?? Fi.Deny, this.postConditions = s ?? xf([]), o)
      this.anchorMode = R4(o);
    else
      switch (r.payloadType) {
        case Ft.Coinbase:
        case Ft.CoinbaseToAltRecipient:
        case Ft.NakamotoCoinbase:
        case Ft.PoisonMicroblock:
        case Ft.TenureChange:
          this.anchorMode = on.OnChainOnly;
          break;
        case Ft.ContractCall:
        case Ft.SmartContract:
        case Ft.VersionedSmartContract:
        case Ft.TokenTransfer:
          this.anchorMode = on.Any;
          break;
      }
  }
  signBegin() {
    const e = lu(this);
    return e.auth = Bh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = lu(this);
    return e.auth = Bh(e.auth), e.txid();
  }
  verifyOrigin() {
    return K8(this.auth, this.verifyBegin());
  }
  signNextOrigin(e, n) {
    if (this.auth.spendingCondition === void 0)
      throw new Error('"auth.spendingCondition" is undefined');
    if (this.auth.authType === void 0)
      throw new Error('"auth.authType" is undefined');
    return this.signAndAppend(this.auth.spendingCondition, e, Te.Standard, n);
  }
  signNextSponsor(e, n) {
    if (this.auth.authType === Te.Sponsored)
      return this.signAndAppend(this.auth.sponsorSpendingCondition, e, Te.Sponsored, n);
    throw new Error('"auth.sponsorSpendingCondition" is undefined');
  }
  appendPubkey(e) {
    const n = this.auth.spendingCondition;
    if (n && !Io(n)) {
      const r = Zi(e);
      n.fields.push(vi(r ? Ae.Compressed : Ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = j8(n, r, e.fee, e.nonce, s);
    return Io(e) ? e.signature = i : e.fields.push(vi(s.data.byteLength === Xg ? Ae.Compressed : Ae.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return Ef(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Ya("Cannot sponsor sign a non-sponsored transaction");
    this.auth = X8(this.auth, e);
  }
  setFee(e) {
    this.auth = V8(this.auth, e);
  }
  setNonce(e) {
    this.auth = q8(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Te.Sponsored)
      throw new Ya("Cannot sponsor sign a non-sponsored transaction");
    this.auth = W8(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new xs('"version" is undefined');
    if (this.chainId === void 0)
      throw new xs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new xs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new xs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new xs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Ks(n, this.chainId, 0), e.push(n), e.push(Y8(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Sf(this.postConditions)), e.push(hy(this.payload)), _e(e);
  }
}
function Za(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new go(be(t.slice(2))) : e = new go(be(t)) : t instanceof Uint8Array ? e = new go(t) : e = t;
  const n = e.readUInt8Enum(qa, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = Z8(e), i = e.readUInt8Enum(on, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Fi, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = wy(e, ht.PostCondition), c = o8(e);
  return new Q8(n, s, c, a, o, i, r);
}
const J8 = Fv, yo = rr, t5 = cy;
const e5 = /* @__PURE__ */ new Set([4001, -31001]), n5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], r5 = ["result", "data", "payload", "response", "params"], Mh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Cc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), ii = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Ir = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, s5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Ly = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => s5(i, r)) === s
  );
}, Cy = (t) => t ? Ly(ii()).some(
  (e) => {
    var n;
    return e.id === t && (Cc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ty = () => {
  if (typeof window > "u")
    return;
  const t = ii(), e = Ly(t).filter(
    (n) => {
      var r;
      return Cc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Ir(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of n5) {
    const r = Ir(t, n) ?? (t === window ? void 0 : Ir(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, i5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = ii(), n = Ir(e, t) ?? (e === window ? void 0 : Ir(window, t)) ?? gc(t);
  if (n)
    return n;
  if (Cc(t) || Cy(t))
    return Ty();
}, ha = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, o5 = ["blockstack-session", "blockstack"], a5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of o5) {
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
a5();
const By = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, yn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, c5 = (t) => {
  const e = yn(t);
  if (!e)
    return null;
  const n = By(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, l5 = (t) => {
  const e = yn(t);
  if (!e)
    return null;
  const n = By(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, uu = (t, e = "mainnet") => {
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
      return uu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return uu(r, e);
  }
  return e;
}, Bs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, Lo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return ki(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = Lo(s, e + 1);
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
    const i = Lo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && ki(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && ki(n.testnet) ? n.testnet.trim() : null;
}, Nh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, My = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && e5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Ws = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = yn(n == null ? void 0 : n.message) ?? yn(e.message) ?? yn(e.error) ?? yn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, Gi = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Ws(e);
    if (e.status === "error")
      throw Ws(e.result ?? e);
  }
  return t;
}, Ph = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return Gi(r);
  } catch (r) {
    throw Ws(r);
  }
}, Ny = () => Ty(), vf = () => {
  if (typeof window > "u")
    return;
  const t = ii();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Ir(t, e) ?? (t === window ? void 0 : Ir(window, e));
    if (n)
      return n;
  }
}, _h = () => {
  if (typeof window > "u")
    return;
  const t = vf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = ii();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Ir(e, n) ?? (e === window ? void 0 : Ir(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, ka = (t) => {
  var r, s;
  const e = Os();
  if (Cc(e) || Cy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = ii() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Ny();
}, nl = (t) => {
  const e = l5(t);
  if (!e)
    return null;
  try {
    const n = Za(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Qa = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = nl(t), r = c5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? yn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Qa(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Mh)
    if (nl(s[a])) {
      i = yn(s[a]);
      break;
    }
  const o = yn(s.txId) || yn(s.txid) || yn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? yn(s.txRaw) ?? void 0
    };
  for (const a of Mh) {
    const c = nl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: yn(s[a]) ?? void 0
      };
  }
  for (const a of r5) {
    const c = s[a], u = Qa(c, e + 1);
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
}, rl = (t) => {
  const e = Qa(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, u5 = (t) => {
  const e = Qa(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, f5 = (t) => ({
  ...t,
  fee: Bs(t.fee),
  nonce: Bs(t.nonce),
  sponsored: t.sponsored === !0
}), Uh = (t) => ({
  recipient: t.recipient,
  amount: Bs(t.amount) ?? "0",
  memo: t.memo,
  network: uu(t.network),
  address: t.stxAddress,
  fee: Bs(t.fee),
  nonce: Bs(t.nonce),
  sponsored: t.sponsored ?? !1
}), Py = "WALLET_ADDRESS_MISMATCH", d5 = 45e3;
let wo = null;
const fu = (t) => {
  t && (wo = { address: t, at: Date.now() });
}, h5 = () => {
  wo = null;
}, p5 = () => wo && Date.now() - wo.at <= d5 ? wo.address : null, g5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, y5 = async (t) => {
  h5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = Gi(await t.request("wallet_connect")), n = Lo(e);
  return fu(n), n;
}, w5 = async (t, e, n, r) => {
  try {
    return Gi(await t.request(e, n));
  } catch (s) {
    const i = Ws(s);
    if (!g5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await y5(t);
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
        { code: o ? Py : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return Gi(await t.request(e, n));
    } catch (a) {
      throw Ws(a);
    }
  }
};
let Hh = 3e4;
const b5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${Hh / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, Hh);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, m5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Py }
      );
    return c;
  }, s = p5();
  if (s)
    return ha(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  ha(n, "account-read");
  try {
    const c = Gi(
      await b5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = Lo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (My(c))
      throw Ws(c);
    ha(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return fu(i), r(i, "wallet_getAccount");
  let o;
  ha(n, "account-reconnect");
  try {
    o = Gi(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Ws(c);
  }
  const a = Lo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return fu(a), r(a, "wallet_connect");
}, x5 = async (t, e) => {
  if (!ka(t)) {
    const i = await Ph(
      t,
      "stx_transferStx",
      Uh(e)
    );
    return rl(i);
  }
  const n = vf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Ph(
      n,
      "stx_transferStx",
      Uh(e)
    );
    return rl(i);
  }
  const r = Ny();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await m5(r, e.stxAddress);
  const s = await w5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: Bs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: Bs(e.fee) } : {}
    },
    e.stxAddress
  );
  return rl(s);
}, S5 = () => Os(), _y = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = Os(), e = t ? i5(t) : void 0;
  if (e)
    return e;
  const n = ii() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Oh = (t, e) => {
  const n = _y(), r = f5({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, u5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return la(r, e);
  if (ka(n) && !vf()) {
    const s = _h();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: Os(),
        route: "legacy-transaction-request"
      }), la(r, s);
  }
  return void x5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Nh(s) && ka(n)) {
      const a = _h();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: Os(),
          route: "legacy-transaction-request"
        }), la(r, a);
        return;
      }
    }
    if (Nh(s) && !ka(n)) {
      la(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), My(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, Dh = (t) => Sy(t).replace(/^0x/, ""), Fh = "This wallet cannot sign messages. Try Xverse or Leather.", jh = (t) => typeof (t == null ? void 0 : t.request) == "function", zh = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", E5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, A5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function v5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Dh(e.message),
    domain: Dh(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function $5(t, e) {
  const n = await b4({
    domain: e.domain,
    message: e.message,
    network: Ac(e.network),
    stxAddress: e.stxAddress
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Rh(t) {
  var s, i;
  const e = S5() || "", n = /xverse/i.test(e);
  let r = _y();
  if (n && !zh(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (zh(r))
    try {
      return await $5(r, t);
    } catch (o) {
      if (n || !jh(r) || !A5(o)) throw o;
    }
  if (!n && jh(r))
    try {
      return await v5(r, t);
    } catch (o) {
      throw E5(o) ? new Error(Fh) : o;
    }
  throw new Error(Fh);
}
const Gh = 1000000n, Is = 1000000n, Ja = 50n, je = 3000n, oi = 300n, io = 3000n, k5 = 50000n, sl = 200n, Tc = 15000n, wn = (t) => t + Ja;
function Yn(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Gh}.${(n % Gh).toString().padStart(6, "0")}`;
}
function Kh(t, e = oi) {
  return t <= je ? 0 : Number((t - je) / wn(e));
}
function il(t, e = 0n) {
  const n = Is - t - e;
  return n > 0n ? n : 0n;
}
function I5(t, e = oi) {
  return t > Is ? "over" : t < je + wn(e) ? "empty" : t < k5 ? "low" : "ok";
}
const L5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", C5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", T5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function B5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || T5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== L5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Uy = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", ol = 3, M5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [du, Hy] = Uy.split("."), In = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function hu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function N5(t) {
  return In(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function hs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Oy(t, e = []) {
  const n = await hs(`/v2/contracts/call-read/${du}/${Hy}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: du, arguments: e.map((r) => "0x" + In(Ne(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Jn(Bn(n.result));
}
async function P5() {
  const t = await hs(`/v2/contracts/source/${du}/${Hy}?proof=0`);
  if (typeof t.source != "string" || await N5(t.source) !== C5) throw Error("Deployed source does not match the tested helper.");
  if (B5(await Oy("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Dy(t) {
  return t.startsWith("SP") && ki(t) && !t.includes(".");
}
async function _5(t) {
  var r;
  if (!Dy(t)) throw Error("Invalid mainnet wallet address.");
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await hs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function U5(t) {
  const e = await hs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function H5(t, e) {
  var s, i;
  const n = await Oy("get-owner", [yo(t), yo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Dy(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function O5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: hu(t), signal: AbortSignal.timeout(15e3) });
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
async function D5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function F5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = Za(hu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ai(lo(Wa.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ai(r.contractAddress) + "." + r.contractName.content !== Uy || r.functionName.content !== "play" || r.functionArgs.length !== 3 || In(Ne(r.functionArgs[0])) !== In(Ne(yo(t.core))) || In(Ne(r.functionArgs[1])) !== In(Ne(yo(t.song))) || In(Ne(r.functionArgs[2])) !== In(Ne(t5(hu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Fi.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== vo.Equal || i.principal.prefix !== 2 || Ai(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ai(r.contractAddress) + "." + r.contractName.content !== M5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || In(Ne(r.functionArgs[0])) !== In(Ne(yo(t.song))) || typeof t.liked != "boolean" || In(Ne(r.functionArgs[1])) !== In(Ne(J8(t.liked))) || t.amount !== "0" || e.postConditionMode !== Fi.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Jn(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const j5 = "xtrata.xyz/radio/listening-wallet", z5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Xs = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && ki(t), R5 = (t) => ({
  domain: qs({ name: Ve(j5), version: Ve("1"), "chain-id": rr(1) }),
  message: qs({
    purpose: Ve(z5),
    main: Ve(t.main),
    listening: Ve(t.listening),
    issued: rr(t.issued)
  })
}), Fy = 100000n, G5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function K5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Xs(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= Fy).sort(G5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const pa = 50;
function tc(t) {
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
async function V5(t, e, n = 4) {
  if (!Xs(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${pa}&offset=${o}`, s = tc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - pa);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= pa ? s : tc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = K5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - pa);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Sr = 50, q5 = 6, W5 = 20, Vh = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function qh(t, e) {
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
async function X5(t, e, n) {
  if (!Xs(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = tc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Sr}&offset=0`));
    if (!s || s.total > q5 * Sr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Sr; o < s.total; o += Sr) {
      const a = tc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Sr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Sr}&offset=${u}`, a = qh(await e(o(0)), t);
      if (!a || a.total > W5 * Sr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Sr; u < a.total; u += Sr) {
        const d = qh(await e(o(u)), t);
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
function Y5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(Vh).map((l, y) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: y } : Xs(l.sender) && p >= Fy ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: p, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Xs(l.recipient) && l.amount > 0n).sort(Vh), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let p = y;
    for (const v of l) {
      if (p <= 0n) break;
      const x = v.left < p ? v.left : p;
      v.left -= x, p -= x;
    }
    return p;
  };
  for (const l of o) {
    const y = u(s.filter((p) => p.to === l.recipient), l.amount);
    y > 0n && u(s, y);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const d = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, p = d.get(y);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : d.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...d.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function Z5(t, e) {
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
function Wh(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const Ia = [100, 250, 500], Q5 = (t, e) => BigInt(t) * wn(e), oo = ["prepared", "signed", "unknown", "pending"], J5 = 30 * 6e4, Xh = 6e4, yi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, t6 = 3e3, Yh = "Your main listener wallet is out of funds, so likes are paused. Top it up (it only needs a little) and your likes carry on.", al = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function e6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, d = !1, l = !1, y = !1, p = null, v = !1, x = "", T = "", q = 0, W, E = null, N, B = [], tt, et = -1 / 0;
  const K = /* @__PURE__ */ new Set();
  let j = null, $ = !1, P = 0, M = null, V = null, ct = !1, X = null, L = !1, rt = null, ne = !1, k = !1, U = !1, xt = !1, Ot = !1, Tt = 0, Yt = null, ie = Promise.resolve();
  const S = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? oi.toString()), _ = (w) => !!i && !(i.features ?? []).includes(w), J = (w, b) => `xtrata.ppp.v1.${w}:${b}`, O = (w = i == null ? void 0 : i.address) => {
    if (!w) return [];
    try {
      const b = JSON.parse(t.store.get(J("entries", w)) || "[]");
      return Array.isArray(b) ? b : [];
    } catch {
      return [];
    }
  }, it = (w) => {
    const b = [w, ...O(w.address).filter((I) => !(I.txid === w.txid && I.kind === w.kind))].slice(0, 200);
    t.store.set(J("entries", w.address), JSON.stringify(b));
  }, nt = (w = i == null ? void 0 : i.address) => !!w && t.store.get(J("on", w)) !== "0", It = (w) => {
    i != null && i.address && t.store.set(J("on", i.address), w ? "1" : "0");
  }, At = () => O().filter((w) => oo.includes(w.status)), qt = () => Mt() ? [...At(), ...O(yt()).filter((w) => oo.includes(w.status))] : At(), Gt = () => vt(i == null ? void 0 : i.address), vt = (w) => {
    if (!w) return null;
    try {
      return JSON.parse(t.store.get(J("deposit", w)) || "null");
    } catch {
      return null;
    }
  }, gt = (w, b = i == null ? void 0 : i.address) => {
    b && t.store.set(J("deposit", b), JSON.stringify(w));
  };
  let Lt = null;
  const pe = (w = Xh) => {
    const b = t.now();
    Lt = { since: Lt && b < Lt.until ? Lt.since : b, until: Math.max((Lt == null ? void 0 : Lt.until) ?? 0, b + w) };
  }, Dt = () => !!Lt && t.now() < Lt.until && (o === void 0 || o < je + wn(S())), le = () => !!Gt() || Dt(), yt = () => _("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Mt = () => !!(i != null && i.address) && yt() !== i.address, Ct = () => Mt() ? c && c.for === yt() ? c.value : void 0 : o, Oe = (w) => w !== void 0 && w < je + sl, Mn = () => At().filter((w) => t.now() - w.created > J5 && K.has(w.txid)), lr = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!t.main() || r === t.main() && !e.allowed), A = () => lr() && !(i != null && i.linked), F = () => {
    const w = t.main();
    return !A() && !!w && !!(i != null && i.linked) && i.linked !== w;
  }, z = (w) => J("return-to", w), G = (w = i == null ? void 0 : i.address) => {
    if (!w) return;
    const b = t.store.get(z(w));
    return b && Xs(b) && b !== w ? b : void 0;
  }, pt = (w = i == null ? void 0 : i.address) => j && j.for === w ? j.res : null;
  function kt() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const w = G();
    if (w) return { to: w, kind: "chosen" };
    const b = pt();
    if (b != null && b.ok && b.funder) return { to: b.funder, kind: "funder" };
  }
  const de = (w) => J("gift", w);
  function Wt() {
    const w = i == null ? void 0 : i.address;
    if (!w) return null;
    if ((X == null ? void 0 : X.for) === w) return X.info;
    try {
      const b = JSON.parse(t.store.get(de(w)) || "null");
      return b && typeof b.returnTo == "string" && typeof b.treasury == "string" ? b : null;
    } catch {
      return null;
    }
  }
  async function he() {
    var at;
    const w = i == null ? void 0 : i.address;
    if (!w || !t.giftInfo || !((at = e == null ? void 0 : e.gifts) != null && at.enabled) || L) return;
    const b = (X == null ? void 0 : X.for) === w ? X : null, I = b ? b.ok ? b.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (b && t.now() - b.at < I) return;
    L = !0;
    const Y = Wt();
    try {
      const R = await t.giftInfo(w);
      X = { for: w, info: R, ok: !0, at: t.now() }, t.store.set(de(w), JSON.stringify(R));
    } catch {
      X = { for: w, info: Y, ok: !1, at: t.now() };
    } finally {
      L = !1;
    }
  }
  const me = () => O().reduce((w, b) => oo.includes(b.status) ? w + BigInt(b.amount || "0") + BigInt(b.fee || "0") : w, 0n);
  function ve() {
    if (o === void 0) return 0;
    const w = o - me() - BigInt(ke.length) * wn(S());
    return w > 0n ? Kh(w, S()) : 0;
  }
  const Zt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Kt = "EMPTY — ADD STX TO PLAY";
  function zt() {
    var I;
    const w = (i == null ? void 0 : i.state) === "known" || (i == null ? void 0 : i.state) === "unlocked";
    if (!((I = Wt()) != null && I.player) && !w) return null;
    const b = (Y, at) => ({ reason: Y, text: at });
    switch (H()) {
      case "connect":
      case "wrong-wallet":
        return b("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "locked":
        return b("locked", "UNLOCK TO LISTEN");
      case "link":
        return b("link", "FINISH SETUP TO LISTEN");
      case "over":
        return b("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return le() ? b("arriving", "YOUR PLAYS ARE ARRIVING") : b("out", Mt() ? Zt : Kt);
      case "ready":
        return !nt() || !(i != null && i.session) || i.session.playsLeft < 1 ? b("off", "PAYING IS OFF — SWITCH ON TO LISTEN") : U ? ve() < 1 ? b("out", Mt() ? Zt : Kt) : null : b("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const xe = () => {
    var w;
    return !!(i != null && i.address) && Mt() && !!((w = Wt()) != null && w.player);
  };
  function ue() {
    return xe() ? { locked: !0, known: !0 } : null;
  }
  const ge = 3 * 6e4, h = () => !!Wt() && !!t.history && !(i != null && i.linked);
  async function m() {
    const w = i.address, b = Wt(), { balance: I, nonce: Y } = await t.chain.account(w), at = await t.history(w, !0);
    if (!at.ok) return null;
    const R = Y5({ self: w, balance: I, inbound: at.inbound, outgoing: at.outgoing, gift: { sender: b.treasury, payer: b.returnTo } });
    if (!R.ok) return null;
    const bt = Z5(R.parts, io);
    return { balance: I, nonce: Y, parts: R.parts, steps: bt.steps, tooSmall: bt.tooSmall.length };
  }
  const f = () => ne ? { state: "unavailable" } : !rt || t.now() - rt.at > ge || o !== void 0 && o !== rt.balance ? { state: "none" } : rt.plan;
  function H() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const w = t.main();
    if (!A()) {
      if (!w) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : F() ? "wrong-wallet" : i.state === "known" ? "locked" : !A() && i.linked !== w ? "link" : o === void 0 ? "loading" : o > Is ? "over" : o < je + wn(S()) ? "fund" : "ready" : "loading";
  }
  const lt = () => {
    var w, b, I, Y, at;
    return {
      step: H(),
      busy: u,
      message: x,
      error: T,
      notice: ft(),
      gate: e,
      main: t.main(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : I5(o, S()),
      playsLeft: o === void 0 ? 0 : Kh(o, S()),
      allowance: o === void 0 ? Is : il(o, BigInt(((w = Gt()) == null ? void 0 : w.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: nt(),
      entries: O(),
      depositTxid: ((b = Gt()) == null ? void 0 : b.txid) ?? W,
      depositPending: le(),
      arrival: le() ? { since: ((I = Gt()) == null ? void 0 : I.at) ?? (Lt == null ? void 0 : Lt.since) ?? t.now(), graceMs: Xh } : null,
      walletOutdated: _("like"),
      linkedListening: tt && tt === t.main() ? B.map((R) => R.listening) : [],
      serverLinked: !!E && N === `${t.main()}:${i == null ? void 0 : i.address}`,
      stuck: Mn().length,
      armed: xt,
      queued: ke.length,
      solo: A(),
      returnTo: (Y = kt()) == null ? void 0 : Y.to,
      returnToKind: (at = kt()) == null ? void 0 : at.kind,
      funderState: (() => {
        const R = pt();
        return R ? R.ok ? R.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const R = pt();
        return !!R && R.ok && R.distinct > 1;
      })(),
      walletCannotSolo: A() && _("standalone"),
      walletCannotMulti: _("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((R) => R !== t.main() && R !== (i == null ? void 0 : i.linked)),
      creditedTo: A() && (i != null && i.address) && (M == null ? void 0 : M.for) === i.address && M.main ? M.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(J("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (V == null ? void 0 : V.for) === i.address && V.unused,
      gift: (() => {
        const R = Wt();
        return R ? { player: R.player, from: R.from, source: R.source, amount: R.amount } : null;
      })(),
      giftPlays: Wt() ? ve() : 0,
      playCost: wn(S()),
      giftStop: zt(),
      albumLock: ue(),
      returnPlan: f(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: _("slots"),
      likeFunds: (() => {
        var wt;
        const R = yt();
        if (!R || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const bt = Ct();
        return { address: R, balance: bt, low: Oe(bt), album: Mt(), pending: !!vt(R), txid: (wt = vt(R)) == null ? void 0 : wt.txid, main: t.main() };
      })()
    };
  }, ft = () => q ? q < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", ut = (w, b = "") => {
    x = w, T = b, t.changed();
  };
  async function Jt(w, b) {
    if (!u) {
      u = w, T = "", t.changed();
      try {
        await b();
      } catch (I) {
        const Y = I instanceof Error ? I.message : String(I);
        T = /Cancelled in the listening wallet/.test(Y) ? "" : Y, T || (x = "Not now. Nothing was signed.", Ot = !0);
      } finally {
        u = null, await vn(!0);
      }
    }
  }
  const Ue = () => !!(e != null && e.enabled) && e.here && (A() || !!t.main() && e.allowed), De = () => Ue() && !F(), Nn = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Se = () => {
    if (F()) throw new Error(Nn());
  };
  async function ln() {
    if (!Ue()) throw new Error("Pay-per-play is not open to this wallet yet. Listening stays free.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now. Listening stays free.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Re = (w) => {
    const b = t.main();
    return w.request("listening.status", b ? { main: b } : void 0);
  };
  async function He(w = !1) {
    i != null && i.address && (!w && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await En(w)));
  }
  async function En(w = !1) {
    const b = yt();
    if (!(!Mt() || !b || (i == null ? void 0 : i.state) !== "unlocked") && !(!w && (c == null ? void 0 : c.for) === b && t.now() - c.at < 3e4))
      try {
        c = { for: b, value: await t.chain.balance(b), at: t.now() };
      } catch {
      }
  }
  async function ur(w) {
    if ((tt !== w || t.now() - et >= 6e4) && (B = await t.links(w), tt = w, et = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === w) return;
    const b = `${w}:${i.address}`;
    N === b && E || (E = B.find((I) => I.listening === i.address) ?? null, N = b);
  }
  async function Et() {
    const w = i == null ? void 0 : i.address;
    if (!A() || !w || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const b = pt(w);
    if (b != null && b.ok && b.funder) return;
    const I = b != null && b.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(j && j.for === w && t.now() - j.at < I)) {
      $ = !0;
      try {
        j = { for: w, res: await t.funder(w), at: t.now() };
      } catch {
        j = { for: w, res: { ok: !1 }, at: t.now() };
      } finally {
        $ = !1;
      }
      P = j.res.ok ? 0 : P + 1;
    }
  }
  async function re() {
    const w = i == null ? void 0 : i.address;
    if (!(!A() || !w || i != null && i.linked || !t.mainOf || ct) && !(M && M.for === w && (M.ok || t.now() - M.at < 6e4))) {
      ct = !0;
      try {
        M = { for: w, main: await t.mainOf(w), ok: !0, at: t.now() };
      } catch {
        M = { for: w, main: null, ok: !1, at: t.now() };
      } finally {
        ct = !1;
      }
    }
  }
  async function $e() {
    const w = i == null ? void 0 : i.address;
    if (!(!w || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (V == null ? void 0 : V.for) === w) && t.store.get(J("created", w)) !== "1")
      try {
        V = { for: w, unused: await t.chain.confirmedNonce(w) === 0n };
      } catch {
      }
  }
  async function An() {
    var at;
    const w = i == null ? void 0 : i.address;
    if (!w) return !1;
    let b, I = !1;
    const Y = /* @__PURE__ */ new Map();
    for (const R of qt())
      try {
        const bt = await t.chain.transaction(R.txid);
        if (!bt) {
          if (K.add(R.txid), t.now() - R.created > 15 * 6e4 && !Y.has(R.address) && Y.set(R.address, await t.chain.confirmedNonce(R.address)), b = Y.get(R.address), b !== void 0 && b > BigInt(R.nonce)) {
            it({ ...R, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((R.status === "unknown" || R.status === "signed") && R.raw)
            try {
              await t.chain.broadcast(R.raw, R.txid), it({ ...R, status: "pending" });
            } catch ($t) {
              yi($t) && it({ ...R, status: "failed", note: $t.message, raw: void 0 });
            }
          continue;
        }
        K.delete(R.txid);
        const wt = String(bt.tx_status);
        if (wt === "success" && bt.canonical !== !1 && bt.is_unanchored === !1) {
          if (it({ ...R, status: "confirmed", confirmedAt: t.now(), actualFee: String(bt.fee_rate ?? R.fee), raw: void 0 }), I = !0, R.kind === "like" && (v = !0, R.status !== "confirmed" && typeof R.liked == "boolean"))
            try {
              (at = t.likeConfirmed) == null || at.call(t, R.song, R.liked);
            } catch {
            }
        } else wt.startsWith("abort_") || wt.startsWith("dropped_") ? it({ ...R, status: "failed", note: wt, raw: void 0 }) : R.status !== "pending" && it({ ...R, status: "pending" });
      } catch {
      }
    for (const R of Mt() ? [w, yt()] : [w]) {
      const bt = vt(R);
      if (bt)
        try {
          const wt = await t.chain.transaction(bt.txid), $t = String((wt == null ? void 0 : wt.tx_status) ?? "");
          ($t === "success" && wt.is_unanchored === !1 || $t.startsWith("abort_") || $t.startsWith("dropped_") || !wt && t.now() - bt.at > 2 * 36e5) && (gt(null, R), $t === "success" && pe(2e4), a = -1 / 0, c = null, /on its way/i.test(x) && (x = ""));
        } catch {
        }
    }
    return I;
  }
  async function vn(w = !1) {
    var b;
    try {
      const I = t.main();
      if ((w || !e || r !== I || t.now() - n > 3e5) && (e = await t.config(I), n = t.now(), r = I), !e.enabled || !e.here || !A() && (!I || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), xt && Rn(), t.changed();
        return;
      }
      await ln(), i = await Re(s), F() && i.state === "unlocked" && (wr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Re(s)), I && e.allowed && await ur(I), await He(w), await Et(), await re(), await $e(), await he(), await An() && await He(!0), await En(), await ai(), q = 0;
    } catch {
      q++;
    }
    if (H() === "locked" ? fr() : xt && Rn(), v) {
      v = !1;
      try {
        (b = t.likesChanged) == null || b.call(t);
      } catch {
      }
    }
    t.changed(), ke.length && !yr && Ur();
  }
  async function Qi(w) {
    const b = i == null ? void 0 : i.root;
    if (!b || i != null && i.slot || !(i != null && i.address) || _("slots")) return;
    const I = Number(t.store.get(J("slot", b)));
    if (!(!Number.isSafeInteger(I) || I < 1))
      try {
        const { balance: Y } = await t.chain.account(i.address);
        if (Y >= je + wn(S())) return;
        await w.request("listening.openSlot", { slot: I }), i = await Re(w), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function $n(w, b) {
    var R;
    Se();
    const I = !(i != null && i.address) || nt(i.address), Y = i != null && i.linked ? (R = t.nameOf) == null ? void 0 : R.call(t, i.linked) : void 0;
    await w.request("listening.unlock", { mode: "unlock", terms: I ? Br() : void 0, anyPasskey: b, ...t.main() ? { main: t.main() } : {}, ...Y ? { label: Y } : {} }), i = await Re(w), I && (nt(i.address) ? await Mr() : await w.request("listening.stop")), await Qi(w), ut(I ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const at = p;
    p = null, at && t.now() - at.at < 12e4 && setTimeout(() => void vn(!0).then(() => br(at)), 0);
  }
  function fr() {
    xt || u || Ot || Tt >= 3 || !s || !(i != null && i.address) || (xt = !0, ie = (async () => {
      try {
        await $n(s, !1), Tt = 0;
      } catch (w) {
        const b = w instanceof Error ? w.message : String(w);
        /Cancelled in the listening wallet/.test(b) ? Yt || (Ot = !0, ut("Not now. Nothing was signed.")) : /did not answer/.test(b) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (Tt++, T = b);
      } finally {
        xt = !1;
        const w = Yt;
        Yt = null, w ? await w() : await vn(!0);
      }
    })());
  }
  async function Rn(w) {
    xt && (Yt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ie), w && await w(), t.changed();
  }
  const Br = () => ({
    fee: S().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Is.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Mr() {
    if (!(i != null && i.address)) return !1;
    if (U || (U = await t.tabLock(i.address)), !U)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. This tab plays free.");
    return !0;
  }
  async function dr(w, b) {
    const I = i.address, { balance: Y, nonce: at } = b ?? await t.chain.account(I);
    o = Y;
    const R = await s.request("listening.prepareReturn", {
      mode: w.mode,
      balance: Y.toString(),
      nonce: at.toString(),
      fee: io.toString(),
      ...w.amount !== void 0 ? { amount: w.amount.toString() } : {},
      ...w.linked ? {} : { destination: w.to }
    });
    if (R.recipient !== w.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const bt = w.mode === "amount" ? w.amount : w.mode === "all" ? Y - io : Y - Is - io, wt = Za(R.raw);
    if (Jn(wt.payload.recipient).value !== w.to || String(wt.payload.amount) !== R.amount || bt !== void 0 && R.amount !== bt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const $t = {
      id: al(),
      address: I,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: R.recipient,
      amount: R.amount,
      fee: R.fee,
      nonce: at.toString(),
      created: t.now(),
      status: "signed",
      raw: R.raw,
      txid: R.txid
    };
    t.validate($t), it($t);
    try {
      await t.chain.broadcast(R.raw, R.txid), it({ ...$t, status: "pending" });
    } catch (te) {
      throw it({ ...$t, status: "unknown", note: te.message }), te;
    }
    return R;
  }
  const hr = Tc, Pn = io;
  async function un(w, b, I) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (_("slots") || _("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Y = i.slot ?? 0;
    if (w === b || ![w, b].includes(Y) || ![w, b].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const at = i.root ?? i.address, R = w === 0 ? at : i.address, bt = b === 0 ? at : i.address, { balance: wt, nonce: $t } = await t.chain.account(R);
    if (wt < I + Pn + je) throw new Error(w === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const te = await s.request("listening.signMove", { from: w, to: b, amount: I.toString(), fee: Pn.toString(), nonce: $t.toString(), balance: wt.toString() }), Ie = Za(te.raw);
    if (te.from !== R || te.to !== bt || te.amount !== I.toString() || Jn(Ie.payload.recipient).value !== bt || String(Ie.payload.amount) !== I.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const fn = {
      id: al(),
      address: R,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: bt,
      amount: te.amount,
      fee: te.fee,
      nonce: $t.toString(),
      created: t.now(),
      status: "signed",
      raw: te.raw,
      txid: te.txid
    };
    t.validate(fn), it(fn);
    try {
      await t.chain.broadcast(te.raw, te.txid), it({ ...fn, status: "pending" });
    } catch (Me) {
      throw it({ ...fn, status: "unknown", note: Me.message }), Me;
    }
    return gt({ txid: te.txid, amount: te.amount, at: t.now() }, bt), bt === at && at !== i.address ? c = null : a = -1 / 0, te;
  }
  let pr = !1;
  const gr = /* @__PURE__ */ new Map(), Nr = (w) => J("float", w);
  async function ai() {
    if (pr || (i == null ? void 0 : i.state) !== "unlocked" || !Mt() || _("move") || _("rootLike") || !i.address) return;
    const w = i.address;
    if (t.store.get(Nr(w)) === "1") return;
    const b = Wt();
    if (!(b != null && b.player) || b.state !== "arrived") return;
    const I = Ct();
    if (I === void 0 || o === void 0) return;
    if (!Oe(I)) {
      t.store.set(Nr(w), "1");
      return;
    }
    if (vt(yt()) || _r() || qt().length || o < hr * 4n + je + Pn) return;
    const Y = gr.get(w);
    if (!(Y && (Y.n >= 3 || t.now() - Y.at < 5 * 6e4))) {
      pr = !0, gr.set(w, { n: ((Y == null ? void 0 : Y.n) ?? 0) + 1, at: t.now() });
      try {
        await un(i.slot ?? 0, 0, hr), t.store.set(Nr(w), "1");
      } catch (at) {
        console.warn("[radio] likes float not sent yet", at);
      } finally {
        pr = !1;
      }
    }
  }
  async function Ji(w) {
    if (At().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (_("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const b = await m().catch(() => null);
    if (!b)
      throw rt = null, ne = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    ne = !1, o = b.balance;
    const I = { balance: b.balance, nonce: b.nonce };
    if (w === "excess") {
      const wt = Wh(b.parts) ?? G();
      if (!wt) throw new Error("Choose where to send the excess first.");
      await dr({ mode: "excess", to: wt, linked: !1 }, I), rt = null, ut("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Y = b.steps;
    if (!Y.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!rt && rt.balance === b.balance && t.now() - rt.at <= ge && rt.steps.length === Y.length && rt.steps.every((wt, $t) => wt.to === Y[$t].to && wt.mode === Y[$t].mode && wt.send === Y[$t].send))) {
      rt = {
        at: t.now(),
        balance: b.balance,
        steps: Y,
        parts: b.parts,
        plan: { state: "ready", steps: Y.map((wt) => ({ to: wt.to, kind: wt.kind, send: wt.send.toString() })), kept: b.tooSmall, excess: Wh(b.parts) }
      }, ut(Y.length > 1 ? `This goes back in ${Y.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const R = Y[0], bt = R.to ?? G();
    if (!bt) throw new Error("Choose where to send the rest first.");
    if (R.mode === "amount" && _("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await dr({ mode: R.mode, to: bt, linked: !1, ...R.mode === "amount" ? { amount: R.send } : {} }, I), rt = null, Y.length === 1 ? (It(!1), ut("Returned ✓ Paying is off.")) : ut(`Returned ✓ ${Y.length - 1} more ${Y.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const ws = {
    forceRefresh: () => vn(!0),
    create: () => Jt("Waiting for your passkey…", async () => {
      const w = await ln();
      await w.request("listening.unlock", { mode: "create", terms: Br(), ...t.main() ? { main: t.main() } : {} }), i = await Re(w), i.address && t.store.set(J("created", i.address), "1"), It(!0), ut(A() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Mr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (w) => {
      w ? pe() : Lt = null, t.changed();
    },
    giftSent: (w, b) => {
      !(i != null && i.address) || Gt() || (gt({ txid: w, amount: b.toString(), at: t.now() }), a = -1 / 0, X = null, ut("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (w) => {
      if (Se(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await ln()).request("listening.bindSlot", { slot: w, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (w, b, I, Y) => {
      gt({ txid: I, amount: Y.toString(), at: t.now() }, b), X = null, await ws.openAlbum(w), ut("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (w) => Jt("Opening…", async () => {
      if (Se(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (_("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (d || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === w) return;
      wr(), await s.request("listening.openSlot", { slot: w }), i = await Re(s), o = void 0, a = -1 / 0, rt = null, ne = !1;
      const b = i.root;
      b && w > 0 && t.store.set(J("slot", b), String(w)), ut(w === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (w = !1) => {
      const b = () => Jt("Waiting for your passkey…", async () => $n(await ln(), w));
      return xt ? w ? _("cancel") ? (ut("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Rn(async () => {
        (H() === "locked" || H() === "intro") && await b();
      }) : ie : b();
    },
    link: () => Jt("Sign in your wallet…", async () => {
      Se();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const b = (await t.links(w)).find((I) => I.listening === i.address);
      if (b)
        await s.request("listening.link", { main: w, issued: b.issued, mainSignature: b.mainSignature });
      else {
        const I = { main: w, listening: i.address, issued: t.now() }, Y = await t.signWithMain(w, R5(I)), at = await s.request("listening.link", { main: w, issued: I.issued, mainSignature: Y });
        await t.saveLink({ ...I, mainSignature: Y, listeningSignature: at.listeningSignature }), et = -1 / 0;
      }
      ut("Linked ✓");
    }),
    deposit: () => Jt("Approve the deposit in your wallet…", async () => {
      Se();
      const w = t.main();
      if (!w || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Gt()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      await He(!0);
      const b = il(o ?? 0n);
      if (b <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      W = await t.deposit(w, i.address, b), W && gt({ txid: W, amount: b.toString(), at: t.now() }), ut("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Jt("Approve the top-up in your wallet…", async () => {
      Se();
      const w = t.main(), b = yt();
      if (!w || !b) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (vt(b)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const I = await t.chain.balance(b);
      Mt() ? c = { for: b, value: I, at: t.now() } : (o = I, a = t.now());
      const Y = il(I);
      if (Y <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const at = await t.deposit(w, b, Y);
      at && gt({ txid: at, amount: Y.toString(), at: t.now() }, b), ut("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (w) => Jt("Adding plays…", async () => {
      if (Se(), !Mt()) throw new Error("Open the album you want to add plays to first.");
      if (!Ia.includes(w)) throw new Error("Choose one of the amounts offered.");
      const b = Q5(w, S());
      if (d || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (qt().length || Gt()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await un(0, i.slot ?? 0, b), ut("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Jt("Confirm in the listening wallet…", async () => {
      if (!De()) throw new Error("Connect your wallet first.");
      await Mr(), await s.request("listening.approveSession", Br()), It(!0), ut("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Jt("Clearing…", async () => {
      for (const w of Mn())
        await t.chain.transaction(w.txid) || it({ ...w, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      ut("Cleared ✓");
    }),
    switchOff: () => Jt("Switching off…", async () => {
      wr(), await (s == null ? void 0 : s.request("listening.stop")), It(!1), ut("Paying is off. Music stays free.");
    }),
    lock: () => Jt("Locking…", async () => {
      wr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, ut("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (w) => {
      const b = String(w ?? "").trim();
      if (!(i != null && i.address)) return ut("", "Unlock the listening wallet first.");
      if (!Xs(b)) return ut("", "Enter a standard mainnet address (it starts with SP).");
      if (b === i.address) return ut("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(z(i.address), b), ut("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(z(i.address), ""), t.changed();
    },
    returnFunds: (w) => Jt("Check the return in the listening wallet…", async () => {
      if (!De()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (h()) return Ji(w);
      const b = kt();
      if (!b) throw new Error(A() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (b.kind !== "linked" && _("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (At().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await dr({ mode: w, to: b.to, linked: b.kind === "linked" }), w === "all" && It(!1), ut(w === "all" ? b.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ke = [], ci = 10, Pr = 30 * 6e4;
  let yr = !1;
  const _r = () => d || !!u || l || y, wr = () => {
    ke.length && (ke.length = 0, t.changed());
  };
  async function li(w) {
    if (!ke.some((b) => b.id === w.id) && !O().some((b) => b.id === w.id) && (ke.push({ ...w, at: t.now() }), ke.length > ci && ke.shift()), _r() || At().length) {
      const b = ke.length;
      x = `Queued ${b === 1 ? "this song" : b + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Ur();
  }
  async function Ur() {
    if (!yr) {
      yr = !0;
      try {
        for (; ke.length; ) {
          for (; ke.length && t.now() - ke[0].at > Pr; ) ke.shift();
          if (!ke.length || _r() || await ui(ke[0]) === "wait") return;
          ke.shift();
        }
      } finally {
        yr = !1, t.changed();
      }
    }
  }
  async function ui(w) {
    var b;
    d = !0;
    try {
      await vn();
      const I = H();
      if (I === "loading") return "wait";
      if (I !== "ready" || !nt() || !(i != null && i.session) || i.session.playsLeft < 1 || !U) return "done";
      if (At().length) return "wait";
      k || (await t.chain.verify(), k = !0);
      const Y = i.address, { balance: at, nonce: R } = await t.chain.account(Y);
      o = at, a = t.now();
      const bt = await t.chain.owner(ol, w.song);
      if (bt === Y || bt === t.main()) return "done";
      const wt = await s.request("listening.signPlay", {
        core: ol,
        song: w.song,
        receipt: w.id,
        fee: S().toString(),
        nonce: R.toString(),
        balance: at.toString()
      }), $t = {
        id: w.id,
        address: Y,
        kind: "play",
        core: ol,
        song: w.song,
        recipient: bt,
        amount: "50",
        fee: S().toString(),
        nonce: R.toString(),
        created: t.now(),
        status: "signed",
        raw: wt.raw,
        txid: wt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate($t), it($t);
      const te = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`;
      try {
        await t.chain.broadcast(wt.raw, wt.txid), it({ ...$t, status: "pending" }), x = `♪ Paid ${te}`, T = "";
      } catch (Ie) {
        it({ ...$t, status: yi(Ie) ? "failed" : "unknown", note: Ie.message, ...yi(Ie) ? { raw: void 0 } : {} }), T = Ie.message;
      }
      return i = await Re(s), "done";
    } catch (I) {
      const Y = I instanceof Error ? I.message : "payment unavailable";
      return (b = Wt()) != null && b.player ? (x = "Payment is taking a moment: " + Y, "wait") : (x = "This song played free: " + Y, "done");
    } finally {
      d = !1, t.changed();
    }
  }
  function fi(w) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(H()) || _("like") ? !1 : (br(w), !0);
  }
  async function br(w) {
    const b = w.title ? `“${w.title}”` : `song #${w.song}`, I = (Gn) => {
      var to;
      T = Gn, x = "";
      try {
        (to = t.likeFailed) == null || to.call(t, w.song);
      } catch {
      }
      t.changed();
    }, Y = Mt(), at = H(), R = t.main(), bt = Y && (at === "fund" || at === "over") ? "ready" : at, wt = A() ? yt() : R;
    if (bt === "locked") {
      p = { ...w, at: t.now() }, ut(`Unlock to like ${b}. It sends straight after.`);
      return;
    }
    if (bt === "wrong-wallet") return I(Nn());
    if (bt === "link") return I("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (A() && _("standalone")) return I("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (bt === "fund") return I("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (bt === "over") return I("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Y) {
      await En(!0);
      const Gn = Ct();
      if (Oe(Gn))
        return t.changed(), I(Yh);
    }
    if (bt !== "ready" || !wt) return I("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return I("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!U) return I("Pay-per-play is running in another tab. Like from that tab.");
    const $t = O(yt()).find((Gn) => Gn.kind === "like" && Gn.song === w.song);
    if ($t && oo.includes($t.status))
      return I(`Your last like for ${b} is still on its way. It can change again once it confirms.`);
    if (l) return I("One like at a time: your last one is still being sent.");
    if (($t == null ? void 0 : $t.status) === "confirmed" && t.now() - ($t.confirmedAt ?? 0) < t6)
      return I(`Your like for ${b} has only just confirmed. Try again in a moment.`);
    let te;
    y = !0;
    try {
      te = t.likeState ? (await t.likeState(wt, w.song)).by : w.likedBy ?? [];
    } catch {
      te = w.likedBy;
    } finally {
      y = !1;
    }
    if (!te) return I(`Could not check ${b} right now. Try the heart again.`);
    const Ie = yt(), Me = (($t == null ? void 0 : $t.status) === "confirmed" && typeof $t.liked == "boolean" && t.now() - ($t.confirmedAt ?? $t.created) < 5 * 6e4 ? $t.liked : void 0) ?? te.includes(Ie);
    if (!Me && te.some((Gn) => Gn !== Ie)) return I(A() ? `${b} was liked from another wallet of yours. Unlike it there.` : `${b} was liked from your main wallet${te.includes(R) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await di({ song: w.song, liked: !Me, title: w.title, artist: w.artist });
  }
  async function di(w) {
    var Y, at, R;
    if (l) {
      ut("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const b = w.title ? `“${w.title}”${w.artist ? ` by ${w.artist}` : ""}` : `song #${w.song}`, I = t.wait ?? ((bt) => new Promise((wt) => setTimeout(wt, bt)));
    try {
      ut(`${w.liked ? "Liking" : "Unliking"} ${b}…`);
      const bt = t.now() + 12e4;
      for (; d || (Mt() ? O(yt()).some((Me) => oo.includes(Me.status)) : At().length); ) {
        if (t.now() > bt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await I(5e3), await vn(!0);
      }
      if (!Mt() && H() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const wt = yt(), { balance: $t, nonce: te } = await t.chain.account(wt);
      if (Mt() ? c = { for: wt, value: $t, at: t.now() } : (o = $t, a = t.now()), Oe($t)) throw new Error(Yh);
      const Ie = await s.request("listening.signLike", {
        song: w.song,
        liked: w.liked,
        fee: sl.toString(),
        nonce: te.toString(),
        balance: $t.toString()
      }), fn = {
        id: al(),
        address: wt,
        kind: "like",
        core: 0,
        song: w.song,
        liked: w.liked,
        recipient: "",
        amount: "0",
        fee: sl.toString(),
        nonce: te.toString(),
        created: t.now(),
        status: "signed",
        raw: Ie.raw,
        txid: Ie.txid,
        ...w.title ? { title: String(w.title).slice(0, 120) } : {},
        ...w.artist ? { artist: String(w.artist).slice(0, 120) } : {}
      };
      t.validate(fn), it(fn);
      try {
        await t.chain.broadcast(Ie.raw, Ie.txid), it({ ...fn, status: "pending" }), x = `${w.liked ? "♥ Liked" : "Unliked"} ${b}`, T = "";
        try {
          (Y = t.likeSent) == null || Y.call(t, w.song, w.liked);
        } catch {
        }
      } catch (Me) {
        if (it({ ...fn, status: yi(Me) ? "failed" : "unknown", note: Me.message, ...yi(Me) ? { raw: void 0 } : {} }), T = Me.message, yi(Me)) try {
          (at = t.likeFailed) == null || at.call(t, w.song);
        } catch {
        }
      }
      i = await Re(s);
    } catch (bt) {
      T = "Like not sent: " + (bt instanceof Error ? bt.message : "the listening wallet is unavailable");
      try {
        (R = t.likeFailed) == null || R.call(t, w.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Ur();
    }
  }
  return { snapshot: lt, refresh: vn, onListened: li, heart: fi, toggleLike: br, ...ws };
}
const jy = ["Connect", "Passkey", "Link & fund", "Listen"], zy = ["Passkey", "Add 1 STX", "Listen"], pu = (t) => t ? zy : jy;
function n6(t) {
  if (t.solo) return r6(t);
  const e = jy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function r6(t) {
  const e = zy.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function s6(t, e) {
  return !e || e.at >= pu(!!t.solo).length || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const i6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function o6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !i6(r.id)));
}
const a6 = {}, c6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, l6 = (t) => {
  const e = a6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, u6 = (t) => `/hiro/${t}`, f6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, d6 = (t) => {
  const e = l6(t);
  if (e)
    return [f6(e)];
  const n = c6[t];
  return typeof window < "u" ? [`${window.location.origin}${u6(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, h6 = {}, Zh = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, p6 = "xtrata.log.enabled", g6 = "xtrata.log.level", y6 = "xtrata.log.tags", w6 = "xtrata.log.dedupe", ga = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, b6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, m6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, x6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, S6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, E6 = () => {
  const t = h6 ?? {}, e = ga(p6) ?? t.VITE_LOG_ENABLED, n = ga(g6) ?? t.VITE_LOG_LEVEL, r = ga(y6) ?? t.VITE_LOG_TAGS, s = ga(w6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: b6(e),
    level: m6(n) ?? "warn",
    tags: S6(r),
    dedupe: x6(s)
  };
}, A6 = (t, e, n) => !t.enabled || Zh[n] < Zh[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), v6 = (t, e, n, r) => {
  const s = E6();
  if (!A6(s, e, t) || k6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, $6 = /* @__PURE__ */ new Set();
let Qh = null;
const k6 = (t, e, n, r, s) => (Qh !== t && ($6.clear(), Qh = t), !1), I6 = (t, e, n) => v6("debug", t, e, n), L6 = {}, C6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, T6 = (t) => {
  const e = L6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : C6[t];
}, B6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, M6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return B6.test(n) ? n : null;
}, N6 = (t) => t.replace(/\/+$/, ""), P6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), Jh = (t) => {
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
}, wi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, _6 = (t) => {
  var c, u;
  let e;
  try {
    e = Jn(_8(t));
  } catch {
    return null;
  }
  const n = wi(e);
  if (!n || n.success === !1)
    return null;
  const r = wi(n.value), s = wi(r == null ? void 0 : r.value), i = wi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = Jh((c = wi(i.name)) == null ? void 0 : c.value), a = Jh((u = wi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : M6(`${o}.${a}`);
}, U6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${N6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Sy(sy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : _6(i.result);
}, H6 = async (t) => {
  const e = t.address.trim();
  if (!ki(e))
    return null;
  const n = T6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of d6(t.network))
    try {
      return await U6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return I6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: P6(r)
  }), null;
};
function O6(t, e, n = {}) {
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
const t0 = Object.freeze({
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
}), e0 = Object.freeze({ 139: "melophonic" });
function D6(t, e = "") {
  const n = String(t);
  return Object.hasOwn(t0, n) ? t0[n] : Object.hasOwn(e0, n) ? e0[n] : e;
}
const n0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function F6(t, e = "") {
  return Object.hasOwn(n0, String(t)) ? n0[String(t)] : e;
}
const Ry = 100000n, $f = 1000000n, ec = 3000n, j6 = (t, e) => `${t}#gift=${e}`, z6 = 100, ya = (t, e = oi) => t <= je ? 0 : Number((t - je) / wn(e)), r0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), Gy = "xtrata.xyz/radio/gifts", cl = z6, R6 = "Create a prefunded Xtrata radio gift batch", G6 = (t) => ({
  domain: qs({ name: Ve(Gy), version: Ve("1"), "chain-id": rr(1) }),
  message: qs({
    purpose: Ve(R6),
    creator: Ve(t.creator),
    count: rr(t.count),
    amount: rr(BigInt(t.amount)),
    label: Ve(t.label),
    issued: rr(t.issued),
    ...t.player ? { player: Ve(t.player) } : {}
  })
}), K6 = (t, e, n = oi) => je + BigInt(t) * wn(n) + (e ? Tc : 0n), V6 = (t, e = oi) => Number(($f - je - (t ? Tc : 0n)) / wn(e)), q6 = (t, e) => BigInt(t) * (e + ec);
function W6(t, e, n, r = oi) {
  const s = n ? Tc : 0n, i = e > je + s ? e - je - s : 0n, o = Number(i / wn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Ja,
    fees: BigInt(o) * r,
    reserve: je,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: ec,
    perCopy: e + ec,
    total: q6(t, e)
  };
}
const X6 = (t) => t >= Ry && t <= $f, s0 = 40, Y6 = "Create an Xtrata radio gift player", Z6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function i0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && Z6.test(t) : !n;
}
function Q6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!i0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!i0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > s0) throw new Error(`A player holds 1 to ${s0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const J6 = (t) => ap(hp(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), t$ = (t) => ({
  domain: qs({ name: Ve(Gy), version: Ve("1"), "chain-id": rr(1) }),
  message: qs({
    purpose: Ve(Y6),
    admin: Ve(t.admin),
    player: Ve(t.hash),
    issued: rr(t.issued)
  })
}), Co = (t) => t.tracks.filter((e) => !e.hidden), e$ = (t) => t.tracks.find((e) => e.hidden) ?? null, n$ = [300, 500, 1e3], o0 = 1800, ll = /* @__PURE__ */ new Map();
async function Ky(t) {
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
async function r$(t) {
  const e = navigator;
  if (e.share)
    try {
      return await e.share(t), { label: "Shared ✓", ok: !0 };
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError") return null;
    }
  return await Ky(t.url) ? { label: "Link copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 };
}
function Vy(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = ll.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      ll.set(t, { ...a, until: Date.now() + o0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ll.delete(t), s();
      }, o0 + 50);
    }
  }, i;
}
const Ls = (t, e, n, r, s) => Vy(t, e, async () => await Ky(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), bs = "xtrata.radio.gift.incoming.v1", a0 = (t) => "xtrata.radio.gift.mine.v1:" + t, c0 = (t) => "xtrata.radio.gift.batches.v1:" + t, St = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Er = (t, e, n = "") => {
  const r = St("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, wa = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, hn = (t) => Yn(t).replace(/\.?0+$/, "");
function s$(t) {
  let e = null;
  const n = (A) => [5e3, 1e4, 2e4, 3e4][A] ?? 6e4, r = (() => {
    try {
      const A = new URL(location.href), F = new URLSearchParams(A.hash.slice(1)).get("gift") ?? A.searchParams.get("gift");
      return F !== null && (A.searchParams.delete("gift"), history.replaceState(null, "", A.pathname + (A.search || ""))), r0(F) ? F : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const A = JSON.parse(t.store.get(bs) || "null");
      return r0(A == null ? void 0 : A.code) ? A.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(bs, JSON.stringify({ code: i, at: t.now() }));
    let A = 0;
    const F = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (z) => {
      const G = await z.json().catch(() => ({}));
      if (z.status === 404) {
        t.store.set(bs, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!z.ok) throw new Error("busy");
      const pt = G;
      e = { ...e, view: pt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(pt.status) && t.store.set(bs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void F(), n(A++)));
    });
    F();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const A = e == null ? void 0 : e.view;
    return !(A != null && A.player) || !o() ? null : { player: A.player, from: u(A), plays: ya(BigInt(A.amount)) };
  }, c = () => {
    e = null, t.store.set(bs, null), t.changed();
  }, u = (A) => A.from ? t.who(A.from) : A.label ? `Xtrata Radio · ${A.label}` : "Xtrata Radio";
  let d = {};
  const l = (A) => {
    if (d.box) return d.box;
    const F = St("div", "", "ppp-gift-check");
    d.box = F;
    const z = () => {
      const G = window.turnstile;
      !G || d.rendered || (d.rendered = !0, G.render(F, { sitekey: A, callback: (pt) => {
        d.token = pt, t.changed();
      }, "expired-callback": () => {
        d.token = void 0;
      } }));
    };
    if (window.turnstile) z();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = z, document.head.append(G);
    }
    return F;
  }, y = (A) => {
    queueMicrotask(() => void A());
  };
  let p;
  async function v(A) {
    var G, pt, kt, de, Wt, he, me, ve, Zt;
    if (!e || e.claiming || !A.listening) return;
    const F = !!((G = e.view) != null && G.player);
    if (F && !A.root) return;
    e.claiming = !0, e.error = void 0, (pt = t.claiming) == null || pt.call(t, !0), t.changed();
    const z = async (Kt) => {
      const zt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: d.token, ...Kt })
      });
      return { res: zt, r: await zt.json().catch(() => ({})) };
    };
    try {
      let Kt = 0, zt = A.listening, xe;
      if (F) {
        const h = Number((kt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(A.root))) == null ? void 0 : kt.next);
        if (!Number.isSafeInteger(h) || h < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Kt = h;
        for (let m = 0; ; m++) {
          const f = await t.album.bind(Kt);
          if (zt = f.address, xe = await z({ wallet: zt, binding: f }), xe.res.status === 409 && /just taken/.test(((de = xe.r) == null ? void 0 : de.error) || "") && m < 5) {
            Kt += 1;
            continue;
          }
          break;
        }
      } else xe = await z({ wallet: zt });
      const { res: ue, r: ge } = xe;
      if (ue.status === 503 && /sending another gift/.test((ge == null ? void 0 : ge.error) || "")) {
        e.waiting = !0, (Wt = t.claiming) == null || Wt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ue.ok) {
        const h = String((ge == null ? void 0 : ge.error) || "");
        if (ue.status === 404 || ue.status === 410 || ue.status === 409 && /already had a gift|brand-new/.test(h))
          throw t.store.set(bs, null), new Error(h || "This gift cannot be opened.");
        if (ue.status === 429 || ue.status === 403 || ue.status === 400 && !/wallet number/i.test(h)) throw new Error(h || `Could not open the gift (${ue.status}).`);
        const f = /topping up/.test(h) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(h) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(h) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(f), { retry: !0, slow: /topping up|not paid for yet/.test(h) });
      }
      e.done = !0, t.store.set(bs, null), F ? await t.album.arrived(Kt, zt, ge.txid, BigInt(ge.amount)) : t.giftSent(ge.txid, BigInt(ge.amount));
    } catch (Kt) {
      const zt = Kt, xe = zt.name === "TypeError" || zt.name === "AbortError" || zt.name === "TimeoutError" || /wallet number/i.test(zt.message);
      if (zt.retry || xe) {
        const ue = e.tries ?? 0;
        e.tries = ue + 1, e.retry = { text: zt.retry ? zt.message : "Still sending your gift… the network is slow, trying again." }, (he = t.claiming) == null || he.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, zt.slow ? 6e4 : n(ue));
      } else
        e.error = zt.message, (me = t.claiming) == null || me.call(t, !1);
      d.token = void 0;
      try {
        (Zt = (ve = window.turnstile) == null ? void 0 : ve.reset) == null || Zt.call(ve, d.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let x = null;
  function T(A) {
    if (!A.listening || !A.depositPending || A.step !== "fund")
      return x = null, [];
    if (!x || x.wallet !== A.listening || t.now() - x.at > 3e4) {
      const z = A.listening;
      x = { ...(x == null ? void 0 : x.wallet) === z ? x : {}, wallet: z, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(z)).then((G) => {
        var pt, kt;
        (x == null ? void 0 : x.wallet) === z && (x.state = (pt = G == null ? void 0 : G.gift) == null ? void 0 : pt.state, x.problem = ((kt = G == null ? void 0 : G.gift) == null ? void 0 : kt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(x.state === "sending" && x.problem)) return [];
    const F = St("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return F.title = `Network reply: ${x.problem}`, [F];
  }
  function q(A, F, z = !1) {
    var he, me;
    const G = F.player, pt = BigInt(F.amount), kt = z ? [] : [St("p", `🎁 ${u(F)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${Co(G).length} ${Co(G).length === 1 ? "song" : "songs"} and ${ya(pt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!A.root && ["fund", "ready", "over", "link"].includes(A.step)))
      return z || kt.push(St("p", A.step === "intro" ? "Tap below: your passkey makes a listening wallet, and the album arrives in its own wallet. You can keep as many albums as you like." : A.step === "locked" ? "Unlock your listening wallet and the album arrives in its own wallet." : "Open your listening wallet and the album arrives in its own wallet.", "ppp-mute")), kt;
    if (A.walletCannotAlbums)
      return kt.push(St("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), kt;
    const Wt = (me = (he = A.gate) == null ? void 0 : he.gifts) == null ? void 0 : me.turnstileSiteKey;
    return Wt && !d.token ? kt.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(Wt)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => v(A)), kt.push(...W(A, "Sending your album…")), kt;
  }
  function W(A, F) {
    const z = [];
    return e.claiming || e.waiting ? z.push(St("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : F, "ppp-cyan")) : e.retry && z.push(St("p", e.retry.text, "ppp-warn"), Er("Try now", () => {
      clearTimeout(p), e.retry = void 0, v(A);
    }, "quiet")), e.error && z.push(St("p", e.error, "ppp-bad"), Er("Try again", () => {
      e.error = void 0, v(A);
    })), z;
  }
  const E = (A) => {
    var F;
    return !!e && !e.done && !e.error && o() && !!A.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !A.linked && !A.creditedTo && (A.createdHere || A.brandNew || !!((F = e.view) != null && F.player)) && (A.balance ?? 0n) === 0n && !A.entries.length);
  };
  function N(A, F = {}) {
    var Zt, Kt;
    const z = T(A);
    if (!e || ["off", "elsewhere"].includes(A.step)) return z;
    const G = e.view;
    if (e.error && !G) return [St("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [St("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return z;
    if (G.status === "claimed" || G.status === "claiming") return [St("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [St("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [St("p", `🎁 ${u(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...q(A, G, !!F.bare), ...z];
    if (!!A.listening && (!(A.createdHere || A.brandNew) || !!A.linked || !!A.creditedTo || (A.balance ?? 0n) > 0n || A.entries.length > 0))
      return [St("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Er("Forget this gift link here", c, "quiet")];
    const kt = BigInt(G.amount), de = ya(kt).toLocaleString(), he = [St(
      "p",
      `🎁 ${u(G)} sent you ${hn(kt)} STX of on-chain music: about ${de} paid plays.`,
      "ppp-gift"
    )], me = !!A.listening && (A.createdHere || A.brandNew) && !A.linked && !A.creditedTo && A.step === "fund" && (A.balance ?? 1n) === 0n && !A.depositPending && !A.entries.length, ve = (Kt = (Zt = A.gate) == null ? void 0 : Zt.gifts) == null ? void 0 : Kt.turnstileSiteKey;
    return me ? (ve && !d.token ? he.push(St("p", "One quick check and it is yours:", "ppp-mute"), l(ve)) : !e.claiming && !e.error && !e.waiting && !e.retry && y(() => v(A)), he.push(...W(A, "Sending your gift…"))) : A.step === "intro" ? he.push(St("p", "Tap below: your passkey makes a listening wallet, and the gift lands in it.", "ppp-mute")) : A.listening && A.linked ? he.push(St("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Er("Forget this gift link here", c, "quiet")) : A.listening && (A.balance ?? 0n) > 0n && he.push(St("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Er("Forget this gift link here", c, "quiet")), he;
  }
  async function B(A, F, z) {
    var G;
    try {
      const pt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(A));
      if ((G = pt == null ? void 0 : pt.gift) != null && G.returnTo) return { ok: !0, funder: pt.gift.returnTo, txId: pt.gift.txid ?? void 0, amount: pt.gift.amount, distinct: 1 };
    } catch {
      if (z) return { ok: !1 };
    }
    return F();
  }
  const tt = St("div", "", "ppp-gift-fold");
  let et = 250000n, K = "", j = "";
  const $ = (A) => {
    try {
      const F = JSON.parse(t.store.get(a0(A)) || "[]");
      return Array.isArray(F) ? F : [];
    } catch {
      return [];
    }
  }, P = (A, F) => t.store.set(a0(A), JSON.stringify(F.slice(0, 50)));
  let M = 0;
  async function V(A) {
    const F = $(A);
    for (const z of F)
      if (!(z.view && ["claimed", "refunded", "expired"].includes(z.view.status)))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: z.id, ...z.txid ? { txid: z.txid } : {} }) }) : await t.json("/radio/gift?id=" + z.id), z.error = void 0;
        } catch (G) {
          z.error = G.message;
        }
    P(A, F), t.changed();
  }
  async function ct(A) {
    if (K) return;
    K = "Starting your gift…", j = "", t.changed();
    let F = null;
    try {
      F = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: A, amount: et.toString() }) });
      const z = $(A);
      z.unshift({ id: F.id, code: F.code, amount: et.toString(), at: t.now() }), P(A, z), K = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(A, F.depositTo, BigInt(F.deposit), F.memo), pt = $(A), kt = pt.find((de) => de.id === F.id);
      kt && (kt.txid = G, kt.view = { status: "pending-deposit", amount: et.toString(), source: "friend", from: A, label: "", expires: 0 }), P(A, pt), j = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", V(A);
    } catch (z) {
      j = z.message || "Not sent.";
    } finally {
      K = "", t.changed();
    }
  }
  const X = (A) => "xtrata.radio.gift.players.v1:" + A, L = (A) => {
    try {
      const F = JSON.parse(t.store.get(X(A)) || "[]");
      return Array.isArray(F) ? F.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id)) : [];
    } catch {
      return [];
    }
  };
  async function rt(A, F) {
    var z;
    if (!K) {
      K = "Checking the player…", j = "", t.changed();
      try {
        const G = F.tracks.split(/[\s,]+/).filter(Boolean).map((me) => Number(me.replace(/^#/, ""))), pt = Q6({ title: F.title.trim(), subtitle: F.subtitle.trim(), tracks: G, cover: (z = F.cover) != null && z.trim() ? Number(F.cover.trim().replace(/^#/, "")) : null });
        K = "Sign in your wallet…", t.changed();
        const kt = { admin: A, hash: J6(pt), issued: t.now() }, de = await t.sign(A, t$(kt));
        K = "Making the player…", t.changed();
        const Wt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: pt, request: kt, signature: de }) }), he = L(A).filter((me) => me.id !== Wt.id);
        he.unshift({ id: Wt.id, title: Wt.title, tracks: Wt.tracks }), t.store.set(X(A), JSON.stringify(he.slice(0, 30))), j = `${Wt.existing ? "That player already exists" : "Player made"} ✓ “${Wt.title}” · ${Wt.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        j = G.message || "Not made.";
      } finally {
        K = "", t.changed();
      }
    }
  }
  const ne = (A, F) => j6(A || location.origin + "/radio.html", F), k = (A) => r$({ title: "On-chain music for you", text: "I sent you some on-chain music on Xtrata Radio 🎁", url: A }), U = (A) => {
    try {
      const F = JSON.parse(t.store.get(c0(A)) || "[]");
      return Array.isArray(F) ? F.filter((z) => z && /^[0-9a-f]{16}$/.test(z.id) && Array.isArray(z.codes)) : [];
    } catch {
      return [];
    }
  }, xt = (A, F) => t.store.set(c0(A), JSON.stringify(F.slice(0, 20))), Ot = (A) => !!A.view && A.view.status === "live" && A.view.copies.waiting + A.view.copies.claiming + A.view.copies.refunding === 0, Tt = (A, F) => t.json(A, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(F) });
  let Yt = 0;
  async function ie(A) {
    const F = U(A);
    for (const z of F)
      if (!Ot(z))
        try {
          z.view = !z.view || z.view.status === "pending-deposit" ? await Tt("/radio/gift/batch/confirm", { id: z.id, ...z.txid ? { txid: z.txid } : {} }) : await t.json("/radio/gift/batch?id=" + z.id), z.error = void 0;
        } catch (G) {
          z.error = G.message;
        }
    try {
      const z = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(A));
      for (const G of (z == null ? void 0 : z.batches) ?? []) {
        const pt = F.find((kt) => kt.id === G.id);
        if (pt) {
          pt.error || (pt.view = G);
          continue;
        }
        F.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    xt(A, F), t.changed();
  }
  async function S(A, F) {
    const z = U(A).find((G) => G.id === F);
    if (!(!z || !z.depositTo || K)) {
      K = "Approve the payment in your wallet…", j = "", t.changed();
      try {
        const G = await t.pay(A, z.depositTo, BigInt(z.deposit), z.memo), pt = U(A), kt = pt.find((de) => de.id === F);
        kt && (kt.txid = G), xt(A, pt), j = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", K = "", ie(A);
      } catch (G) {
        j = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        K = "", t.changed();
      }
    }
  }
  async function _(A, F, z, G) {
    if (K) return;
    if (!F.ok) {
      j = F.reason, t.changed();
      return;
    }
    K = "Sign in your wallet…", j = "", t.changed();
    let pt = null;
    try {
      const kt = { creator: A, count: F.count, amount: F.amount.toString(), label: z, issued: t.now(), ...G ? { player: G } : {} }, de = await t.sign(A, G6(kt));
      K = "Making your links…", t.changed(), pt = await Tt("/radio/gift/batch", { request: kt, signature: de });
      const Wt = U(A);
      Wt.unshift({ id: pt.id, codes: pt.codes, count: F.count, amount: pt.amount, label: z, player: G ?? null, depositTo: pt.depositTo, deposit: pt.deposit, memo: pt.memo, at: t.now() }), xt(A, Wt);
    } catch (kt) {
      j = kt.message || "Not made.", K = "", t.changed();
      return;
    }
    K = "", t.changed(), await S(A, pt.id);
  }
  function J() {
    const A = !!Dt.value, F = le.value === "max" ? V6(A) : Number(le.value), z = K6(F, A), G = Number(yt.value);
    return !Number.isInteger(G) || G < 1 || G > cl ? { ok: !1, reason: `Make 1 to ${cl} copies at a time.`, album: A, plays: F, amount: z, count: G } : X6(z) ? { ok: !0, reason: "", album: A, plays: F, amount: z, count: G, bill: W6(G, z, A) } : { ok: !1, reason: "Each copy must be 0.1 to 1 STX.", album: A, plays: F, amount: z, count: G };
  }
  const O = () => {
    const A = J();
    if (!A.ok) return A.reason;
    const F = A.bill;
    return `Each copy: ${A.plays.toLocaleString()} paid plays (${hn(F.holders)} to song holders, ${hn(F.fees)} network fees)${A.album ? `, ${hn(F.float)} for the album’s likes` : ""}, ${hn(F.reserve)} kept so a listener can return what is left, + ${hn(F.sendFee)} to send it = ${hn(F.perCopy)} STX. ${A.count} copies = ${hn(F.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, it = (A, F) => F.codes.map((z) => ne(A, z)), nt = St("input");
  nt.type = "range", nt.min = String(Ry), nt.max = String($f), nt.step = "50000", nt.value = String(et), nt.setAttribute("aria-label", "Gift amount");
  const It = St("p", "", "ppp-gift-amount"), At = Er("", () => {
    const A = t.main();
    A && ct(A);
  }, "primary"), qt = () => {
    It.textContent = Gt(), At.textContent = `Gift ${hn(et)} STX`;
  };
  nt.oninput = () => {
    et = BigInt(nt.value), qt();
  };
  const Gt = () => `${hn(et)} STX · about ${ya(et).toLocaleString()} paid plays · you pay ${hn(et + ec)} STX with the network fee`;
  qt();
  const vt = St("input");
  vt.maxLength = 60, vt.placeholder = "Title, e.g. Proof of Sound", vt.setAttribute("aria-label", "Player title");
  const gt = St("input");
  gt.maxLength = 80, gt.placeholder = "Artist (optional)", gt.setAttribute("aria-label", "Player subtitle");
  const Lt = St("textarea");
  Lt.rows = 3, Lt.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Lt.setAttribute("aria-label", "Songs");
  const pe = St("input");
  pe.inputMode = "numeric", pe.placeholder = "Cover inscription number (optional), shown when the album loads", pe.setAttribute("aria-label", "Cover inscription");
  const Dt = St("select");
  Dt.setAttribute("aria-label", "Batch album");
  const le = St("select");
  le.setAttribute("aria-label", "Plays per copy");
  for (const A of n$) le.append(wa(`${A.toLocaleString()} plays`, String(A)));
  le.append(wa("Max (1 STX)", "max"));
  const yt = St("input");
  yt.type = "number", yt.min = "1", yt.max = String(cl), yt.value = "10", yt.setAttribute("aria-label", "Copies");
  const Mt = St("input");
  Mt.maxLength = 40, Mt.placeholder = "Label, e.g. Opera launch", Mt.setAttribute("aria-label", "Batch label");
  const Ct = St("p", "", "ppp-mute"), Oe = () => {
    Ct.textContent = O();
  };
  for (const A of [Dt, le, yt])
    A.oninput = Oe, A.onchange = Oe;
  Oe();
  function Mn(A) {
    var pt, kt, de, Wt, he, me;
    const F = (pt = A.gate) == null ? void 0 : pt.gifts;
    if (!(F != null && F.enabled) || ["off", "elsewhere", "unsupported"].includes(A.step)) return null;
    const z = t.main(), G = [St("p", "Give someone on-chain music. They need no wallet: a passkey and your link is all it takes.", "ppp-mute")];
    if (!z)
      G.push(St("p", "Connect a Stacks wallet (top right) to send a gift."));
    else {
      At.disabled = !!K, G.push(nt, It, At), t.now() - M > 3e4 && (M = t.now(), V(z));
      const ve = $(z);
      if (ve.length) {
        const Zt = St("ul", "", "ppp-gift-list");
        for (const Kt of ve.slice(0, 10)) {
          const zt = (kt = Kt.view) == null ? void 0 : kt.status, xe = Kt.error ? Kt.error : !zt || zt === "pending-deposit" ? Kt.txid ? "payment confirming…" : "waiting for your payment" : zt === "live" ? "ready to share" : zt === "claiming" || zt === "claimed" ? "claimed ✓" : zt === "refunding" ? "expired · refund on its way" : zt === "refunded" ? "expired · refunded to you" : zt, ue = St("li");
          if (ue.append(St("span", `${hn(BigInt(Kt.amount))} STX`, "t"), St("span", xe, ((de = Kt.view) == null ? void 0 : de.status) === "claimed" ? "ppp-ok" : "ppp-mute")), ((Wt = Kt.view) == null ? void 0 : Wt.status) === "live") {
            const ge = ne(((he = A.gate) == null ? void 0 : he.radioUrl) ?? null, Kt.code);
            ue.append(Ls("gift-copy:" + Kt.id, "Copy link", () => ge, "tiny", t.changed), Vy("gift-share:" + Kt.id, "Share", () => k(ge), "tiny", t.changed));
          }
          Zt.append(ue);
        }
        G.push(Zt);
      }
      if (F.admin) {
        const Zt = St("div", "", "ppp-gift-admin"), Kt = (h, m) => {
          const f = St("label", h);
          return f.append(m), f;
        }, zt = L(z);
        Zt.append(
          St("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
          vt,
          gt,
          Lt,
          pe,
          Er("Sign and make player", () => void rt(z, { title: vt.value, subtitle: gt.value, tracks: Lt.value, cover: pe.value }))
        );
        const xe = Er("Sign, pay and make links", () => {
          _(z, J(), Mt.value.trim(), Dt.value || void 0);
        });
        xe.disabled = !!K;
        const ue = Dt.value;
        Dt.replaceChildren(wa("No album (starter copies)", ""), ...zt.map((h) => wa(`${h.title} · ${h.tracks} songs`, h.id))), zt.some((h) => h.id === ue) && (Dt.value = ue), Oe(), Zt.append(
          St("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
          Kt("Album ", Dt),
          Kt("Plays each ", le),
          Kt("Copies ", yt),
          Mt,
          Ct,
          xe
        ), t.now() - Yt > 3e4 && (Yt = t.now(), ie(z));
        const ge = U(z);
        if (ge.length) {
          const h = St("ul", "", "ppp-gift-list");
          for (const m of ge.slice(0, 10)) {
            const f = m.view, H = f == null ? void 0 : f.copies, lt = m.error ? m.error : !f || f.status === "pending-deposit" ? m.txid ? "payment confirming…" : "waiting for your payment" : `${H.claimed} of ${f.count} claimed${H.refunding + H.refunded ? ` · ${H.refunded} refunded${H.refunding ? `, ${H.refunding} on their way` : ""}` : ""}`, ft = St("li");
            if (ft.append(St("span", `${m.label || "Batch"} · ${m.count} × ${hn(BigInt(m.amount))} STX`, "t"), St("span", lt, "ppp-mute")), !m.txid && m.depositTo && (!f || f.status === "pending-deposit") && ft.append(Er("Pay now", () => void S(z, m.id), "tiny")), m.codes.length && (f == null ? void 0 : f.status) === "live") {
              const ut = it(((me = A.gate) == null ? void 0 : me.radioUrl) ?? null, m);
              ft.append(
                Ls("batch-copy:" + m.id, "Copy all links", () => ut.join(`
`), "tiny", t.changed),
                Ls("batch-csv:" + m.id, "Copy as CSV", () => ["copy,link", ...ut.map((Jt, Ue) => `${Ue + 1},${Jt}`)].join(`
`), "tiny", t.changed)
              );
            } else m.codes.length || ft.append(St("span", "links were made on another device", "ppp-mute"));
            h.append(ft);
          }
          Zt.append(h);
        }
        G.push(Zt);
      }
    }
    return K && G.push(St("p", K, "ppp-cyan")), j && G.push(St("p", j, /✓/.test(j) ? "ppp-ok" : "ppp-warn")), tt.replaceChildren(...G), tt;
  }
  return { banner: N, funder: B, renderFold: Mn, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: E };
}
const i$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function o$(t) {
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
const a$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function c$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = a$(i);
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
function l$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const bi = 12, u$ = 5e3, sn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, mi = (t, e, n = "") => {
  const r = sn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function f$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, d = bi;
  const l = sn("div", "", "ppp-shelf-box"), y = (M) => "xtrata.radio.shelf.pins.v1:" + M, p = (M) => "xtrata.radio.shelf.recent.v1:" + M, v = (M, V) => {
    try {
      return JSON.parse(t.store.get(M) || "null") ?? V;
    } catch {
      return V;
    }
  }, x = (M) => new Set(v(y(M), []).filter((V) => Number.isSafeInteger(V))), T = (M) => {
    const V = v(p(M), {}), ct = {};
    for (const [X, L] of Object.entries(V)) Number.isSafeInteger(Number(X)) && typeof L == "number" && (ct[Number(X)] = L);
    return ct;
  };
  async function q(M) {
    if (!s) {
      s = !0, i = !1;
      try {
        const V = [];
        let ct = 0, X = 0;
        for (let L = 0; L < u$ / 100 + 1; L++) {
          const rt = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(M)}&after=${ct}&limit=100`);
          if (V.push(...o$(rt == null ? void 0 : rt.shelf)), X = Number(rt == null ? void 0 : rt.total) || V.length, !(rt != null && rt.next) || !Number.isSafeInteger(rt.next)) break;
          ct = rt.next;
        }
        M === e && (n = V, r = X, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const W = () => {
    o = -1 / 0;
  }, E = sn("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, d = bi, t.changed();
  };
  const N = sn("select");
  N.setAttribute("aria-label", "Sort albums");
  for (const M of i$) {
    const V = document.createElement("option");
    V.value = M.value, V.textContent = M.label, N.append(V);
  }
  N.onchange = () => {
    c = N.value, d = bi, t.changed();
  };
  const B = mi("", () => {
    u = !u, d = bi, t.changed();
  }, "tiny"), tt = sn("div", "", "ppp-shelf-tools");
  tt.append(E, N, B);
  const et = sn("div"), K = sn("div");
  function j(M) {
    const V = M.step === "off" || M.step === "elsewhere" ? void 0 : M.root;
    if (V !== e && (e = V, n = [], r = 0, o = -1 / 0, d = bi), !V || M.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && q(V), !n.length)
      return i ? (K.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), mi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(K), l) : null;
    const ct = x(V), X = T(V), L = c$(n, { query: a, sort: c, pinnedOnly: u, pins: ct, recents: X });
    E.value !== a && (E.value = a), N.value = c, B.textContent = u ? "★ Pinned only" : "☆ Pinned only", B.setAttribute("aria-pressed", String(u));
    const rt = [];
    if (M.slot > 0 && rt.push(mi("← My player", () => t.open(0), "quiet")), !L.length) rt.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const ne = sn("ul", "", "ppp-shelf-list");
      for (const k of L.slice(0, d)) {
        const U = sn("li", "", k.slot === M.slot ? "now" : ""), xt = ct.has(k.slot), Ot = mi(xt ? "★" : "☆", () => {
          const S = new Set(ct);
          xt ? S.delete(k.slot) : S.add(k.slot), t.store.set(y(V), JSON.stringify([...S])), t.changed();
        }, "tiny");
        Ot.setAttribute("aria-label", xt ? `Unpin ${k.player.title}` : `Pin ${k.player.title}`);
        const Tt = [k.player.subtitle, `${Co(k.player).length} ${Co(k.player).length === 1 ? "song" : "songs"}`, k.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Yt = k.slot === M.slot, ie = mi(Yt ? "Playing" : "Play", () => {
          t.store.set(p(V), JSON.stringify(l$({ ...X, [k.slot]: t.now() }))), t.open(k.slot);
        }, Yt ? "tiny" : "tiny primary");
        ie.disabled = Yt, U.append(Ot, sn("span", k.player.title, "t"), sn("span", " " + Tt, "ppp-mute"), ie), ne.append(U);
      }
      rt.push(ne), L.length > d && rt.push(mi(`Show more (${L.length - d} left)`, () => {
        d += bi, t.changed();
      }, "quiet"));
    }
    return i && rt.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), et.replaceChildren(...rt), l.firstChild !== tt && l.replaceChildren(tt, et), l;
  }
  return { render: j, invalidate: W, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const M = T(e), V = [...n].filter((ct) => ct.player).sort((ct, X) => (M[X.slot] ?? 0) - (M[ct.slot] ?? 0) || X.slot - ct.slot)[0];
    return V ? { slot: V.slot, title: V.player.title } : null;
  } };
}
const d$ = 20, Ke = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Le = {
  grid: Ke('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ke('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ke('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ke('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ke('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ke('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ke('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ke('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ke('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ke('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ke('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ke('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ke('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ke('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ke('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ke('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ke('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const We = (t, ...e) => Q("button", { type: "button", ...t }, ...e), ba = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, ao = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, h$ = { music: "My music", device: "This device", gifts: "Send music to a friend" }, p$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function l0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function d(S) {
    var J, O, it;
    if (!S || !Number.isSafeInteger(S)) return "";
    const _ = (it = (O = (J = e.radio()) == null ? void 0 : J.getState) == null ? void 0 : O.call(J)) == null ? void 0 : it.albumCover;
    return _ != null && _.url && Number(_.tokenId) === S ? _.url : c.has(S) ? c.get(S) : (u.has(S) || (u.add(S), fetch("/inscription/" + S, { signal: AbortSignal.timeout(2e4) }).then(async (nt) => {
      var At, qt, Gt, vt;
      const It = (nt.headers.get("content-type") || "").toLowerCase();
      if (!nt.ok)
        throw await ((At = nt.body) == null ? void 0 : At.cancel()), new Error("no cover");
      return It.startsWith("image/") ? (await ((qt = nt.body) == null ? void 0 : qt.cancel()), "/inscription/" + S) : It.includes("text/html") ? (((Gt = (await nt.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : Gt[1]) ?? "").replace(/&amp;/g, "&") : (await ((vt = nt.body) == null ? void 0 : vt.cancel()), "");
    }).then((nt) => {
      c.set(S, nt), ie();
    }).catch(() => {
      u.delete(S);
    })), "");
  }
  const l = "xtrata:al-thumb:v1:", y = "-", p = 96, v = 24 * 1024 * 1024, x = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Set(), q = [];
  let W = !1, E;
  const N = (S, _) => {
    try {
      if (_ === void 0) return window.localStorage.getItem(l + S);
      window.localStorage.setItem(l + S, _);
    } catch {
    }
    return null;
  };
  function B(S) {
    return new Promise((_) => {
      var J;
      try {
        const O = document.createElement("canvas"), it = (J = O.getContext) == null ? void 0 : J.call(O, "2d");
        if (!it) return _(S);
        const nt = new Image(), It = setTimeout(() => _(S), 8e3);
        nt.onload = () => {
          clearTimeout(It);
          try {
            const At = Math.min(nt.naturalWidth, nt.naturalHeight);
            if (!At) return _(S);
            O.width = O.height = p, it.fillStyle = "#143a40", it.fillRect(0, 0, p, p), it.drawImage(nt, (nt.naturalWidth - At) / 2, (nt.naturalHeight - At) / 2, At, At, 0, 0, p, p), _(O.toDataURL("image/jpeg", 0.82));
          } catch {
            _(S);
          }
        }, nt.onerror = () => {
          clearTimeout(It), _(S);
        }, nt.src = S;
      } catch {
        _(S);
      }
    });
  }
  async function tt(S) {
    var qt, Gt, vt, gt, Lt;
    const _ = await fetch("/inscription/" + S, { signal: AbortSignal.timeout(6e4) }), J = (_.headers.get("content-type") || "").toLowerCase();
    if (!_.ok)
      return await ((qt = _.body) == null ? void 0 : qt.cancel()), null;
    if (J.startsWith("image/"))
      return await ((Gt = _.body) == null ? void 0 : Gt.cancel()), "/inscription/" + S;
    if (!J.includes("text/html"))
      return await ((vt = _.body) == null ? void 0 : vt.cancel()), "";
    let O = "", it = 0;
    const nt = (pe) => {
      let Dt = 0;
      for (; ; ) {
        const le = O.slice(Dt).search(/<img\b/i);
        if (le < 0)
          return O = pe ? "" : O.slice(Math.max(0, O.length - 4)), null;
        const yt = Dt + le, Mt = O.indexOf(">", yt);
        if (Mt < 0)
          return O = O.slice(yt), null;
        const Ct = O.slice(yt, Mt + 1), Oe = Ct.match(/\bsrc="(data:image\/[^"]+)"/i);
        if (Oe) return Oe[1].replace(/&amp;/g, "&");
        const Mn = Ct.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
        if (Mn) return "/inscription/" + Mn[1];
        Dt = Mt + 1;
      }
    }, It = (Lt = (gt = _.body) == null ? void 0 : gt.getReader) == null ? void 0 : Lt.call(gt);
    if (!It)
      return O = await _.text(), nt(!0) ?? "";
    const At = new TextDecoder();
    for (; ; ) {
      const { done: pe, value: Dt } = await It.read();
      if (pe) break;
      it += Dt.byteLength, O += At.decode(Dt, { stream: !0 });
      const le = nt(!1);
      if (le)
        return await It.cancel(), le;
      if (it > v)
        return await It.cancel(), null;
    }
    return O += At.decode(), nt(!0) ?? "";
  }
  async function et() {
    if (!W) {
      W = !0;
      try {
        for (; q.length; ) {
          const S = q.shift();
          if (!x.has(S))
            try {
              const _ = await tt(S);
              if (_ === null) continue;
              if (!_) {
                x.set(S, ""), N(S, y), ie();
                continue;
              }
              const J = await B(_);
              x.set(S, J), J.startsWith("data:image/jpeg") && N(S, J), ie();
            } catch {
            }
        }
      } finally {
        W = !1;
      }
    }
  }
  function K(S, _) {
    if (_ && !x.get(S) ? (x.set(S, _), B(_).then((O) => {
      O !== _ && (x.set(S, O), O.startsWith("data:image/jpeg") && N(S, O), ie());
    })) : _ === "" && !x.has(S) && x.set(S, ""), x.has(S)) return x.get(S);
    const J = N(S);
    if (J != null) {
      const O = J === y ? "" : J;
      return x.set(S, O), O;
    }
    return T.has(S) || (T.add(S), q.push(S), E || (E = setTimeout(() => {
      E = void 0, et();
    }, 1200))), "";
  }
  function j(S) {
    var J;
    i = S, S ? a.dataset.sheet = S : delete a.dataset.sheet;
    const _ = document.querySelector(".side");
    if (S && S !== "more") {
      for (const nt of p$[S]) {
        const It = _ == null ? void 0 : _.querySelector(nt);
        It && (It.open = !0);
      }
      const O = document.getElementById("sheetTitle");
      O && (O.textContent = h$[S]);
      const it = document.getElementById("sheetExtra");
      it && it.replaceChildren(...S === "music" ? [P()] : []), (J = _ == null ? void 0 : _.scrollTo) == null || J.call(_, { top: 0 });
    }
    ie();
  }
  const $ = r ? null : document.getElementById("sheetClose");
  $ && ($.onclick = () => j("")), r || document.addEventListener("keydown", (S) => {
    S.key === "Escape" && i && a.dataset.view === "album" && j("");
  });
  const P = () => We(
    { class: "al-row", onClick: () => {
      j(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: Le.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: Le.right })
  );
  let M = null, V = !1;
  const ct = () => {
    var _;
    const S = e.radio();
    V || !(S != null && S.subscribe) || (V = !0, S.subscribe((J) => {
      M = J, (s == null ? void 0 : s.mode) === "open" && ie();
    }), M = ((_ = S.getState) == null ? void 0 : _.call(S)) ?? null);
  };
  r || setInterval(() => {
    var O, it;
    if ((s == null ? void 0 : s.mode) !== "open" || !(M != null && M.playing)) return;
    const S = (it = (O = e.radio()) == null ? void 0 : O.getPosition) == null ? void 0 : it.call(O), _ = t.querySelector(".al-bar > i"), J = t.querySelectorAll(".al-times span");
    !S || !_ || (_.style.width = S.duration ? `${Math.min(100, S.current / S.duration * 100)}%` : "0%", J.length === 2 && (J[0].textContent = ba(S.current || 0), J[1].textContent = S.duration ? ba(S.duration) : "–:––"));
  }, 500);
  let X = "", L = null;
  function rt(S, _, J = {}) {
    const O = J.song || d(S.cover), nt = [O ? Q("img", { src: O, alt: J.song ? "Song artwork" : `${S.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, S.title), S.subtitle ? Q("span", {}, S.subtitle) : null), J.paused ? Q("span", { class: "al-paused" }, Q("i", { html: Le.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], It = "al-cover" + (_ ? "" : " al-cover--small") + (J.paused ? " is-paused" : "");
    return J.flip ? (nt.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: Le.flip })), We({ class: It + " is-flippable", "aria-label": J.flipped ? "Show this song’s artwork" : `Show the ${S.title} cover`, onClick: J.flip }, ...nt)) : Q("div", { class: It }, ...nt);
  }
  function ne(S) {
    return S.plays === null || S.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, S.playsComing ? "Plays on their way…" : "…") : S.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, S.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (S.plays <= d$ ? " al-chip--low" : "") }, `${ao(S.plays, "play", "plays")} left`);
  }
  function k(S) {
    const _ = S.player, J = _.tracks.filter((it) => !it.hidden), O = [];
    return S.mode === "arrive" && S.from && O.push(Q("p", { class: "al-from" }, Q("span", { html: Le.gift }), Q("span", {}, Q("b", {}, S.from), " sent you an album"))), O.push(rt(_, !0)), O.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, _.title),
      _.subtitle ? Q("p", { class: "al-artist" }, _.subtitle) : null,
      J.length ? Q("p", { class: "al-songline" }, J.map((it) => it.title || `#${it.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [ao(J.length, "song", "songs"), S.offered ? ao(S.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), S.status.length && O.push(Q("div", { class: "al-status", role: "status" }, ...S.status)), O.push(Q("div", { class: "al-grow" })), S.asking ? O.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : S.primary && O.push(We({ class: "al-primary", onClick: S.primary.run, disabled: S.busy }, Q("span", { html: Le.playSmall }), S.primary.label)), S.hint && !S.asking && O.push(Q("p", { class: "al-hint" }, S.hint)), S.secondary && !S.asking && O.push(We({ class: "al-link", onClick: S.secondary.run, disabled: S.busy }, S.secondary.label)), O;
  }
  function U(S, _) {
    const { songs: J, current: O, started: it, own: nt, out: It, waiting: At } = _, qt = S.player, Gt = e.radio(), vt = [];
    vt.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, qt.title), ` · ${ao(J.length, "song", "songs")}`), ne(S)));
    const gt = d(qt.cover), Lt = "album:" + qt.cover;
    gt && !x.has(Lt) && (x.set(Lt, gt), B(gt).then((Dt) => {
      Dt !== gt && (x.set(Lt, Dt), ie());
    }));
    const pe = gt ? x.get(Lt) || gt : "";
    return vt.push(Q("ol", { class: "al-tracks" }, ...J.map((Dt, le) => {
      const yt = String(Dt.id) === O, Mt = K(String(Dt.id), yt && it ? nt : void 0);
      return Q("li", {}, We(
        { class: "al-track" + (yt ? " is-on" : ""), "aria-label": `Play ${Dt.title || "#" + Dt.id}`, "aria-current": yt ? "true" : void 0, disabled: It || At, onClick: () => {
          var Ct;
          return (Ct = Gt == null ? void 0 : Gt.playToken) == null ? void 0 : Ct.call(Gt, Dt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (Mt ? "" : " is-blank") },
          Mt ? Q("img", { src: Mt, alt: "", decoding: "async" }) : pe ? Q("img", { src: pe, alt: "", decoding: "async" }) : null,
          Mt ? null : Q("span", { class: "al-n" }, String(le + 1)),
          yt ? Q("span", { class: "al-eq", html: Le.eq }) : null
        ),
        Q("span", { class: "al-tt" }, Dt.title || `#${Dt.id}`)
      ));
    }))), vt;
  }
  function xt(S) {
    var Mt;
    const _ = S.player, J = _.tracks.filter((Ct) => !Ct.hidden), O = e.radio(), it = M == null ? void 0 : M.nowPlaying, nt = it && _.tracks.some((Ct) => String(Ct.id) === String(it.tokenId)) ? String(it.tokenId) : null, It = nt ? _.tracks.find((Ct) => String(Ct.id) === nt) : null, At = S.plays === 0 && !S.playsComing, qt = !!S.playsComing && !S.plays, Gt = !!(M != null && M.playing) && !!nt, vt = M == null ? void 0 : M.heart, gt = nt ? (Mt = O == null ? void 0 : O.getPosition) == null ? void 0 : Mt.call(O) : null;
    nt && (Gt || ((gt == null ? void 0 : gt.current) ?? 0) > 0.5) && (X = _.id);
    const Lt = !!nt && X === _.id;
    L && L !== nt && (L = null);
    const pe = Lt ? String((it == null ? void 0 : it.cover) || "") : "", Dt = !!pe && L === nt, yt = [rt(_, !At, { song: Dt ? "" : pe, paused: Lt && !Gt, flip: pe ? () => {
      L = L === nt ? null : nt, ie();
    } : void 0, flipped: Dt })];
    if (yt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, It ? It.title || (it == null ? void 0 : it.title) || `#${It.id}` : _.title),
        Q("div", { class: "al-artist" }, It ? It.artist || (it == null ? void 0 : it.artist) || _.subtitle : _.subtitle || "Press play")
      ),
      nt ? We({ class: "al-icon" + (vt != null && vt.liked ? " is-on" : ""), "aria-label": vt != null && vt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(vt != null && vt.liked)), disabled: !!(vt != null && vt.pending) || !!(vt != null && vt.locked) || qt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.toggleLike) == null ? void 0 : Ct.call(O);
      }, html: vt != null && vt.liked ? Le.heartOn : Le.heart }) : null
    )), At)
      yt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        Ot(S, !0)
      ));
    else {
      const Ct = gt != null && gt.duration ? Math.min(100, gt.current / gt.duration * 100) : 0;
      yt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Ct}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, ba((gt == null ? void 0 : gt.current) || 0)), Q("span", {}, gt != null && gt.duration ? ba(gt.duration) : "–:––"))
      ));
    }
    return yt.push(Q(
      "div",
      { class: "al-ctl" + (At || qt ? " is-off" : "") },
      We({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: At || qt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.prev) == null ? void 0 : Ct.call(O);
      }, html: Le.prev }),
      We({ class: "al-play", "aria-label": Gt ? "Pause" : "Play", disabled: At || qt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.playPause) == null ? void 0 : Ct.call(O);
      }, html: Gt ? Le.pause : Le.play }),
      We({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: At || qt, onClick: () => {
        var Ct;
        return (Ct = O == null ? void 0 : O.next) == null ? void 0 : Ct.call(O);
      }, html: Le.next })
    )), S.status.length && yt.push(Q("div", { class: "al-status", role: "status" }, ...S.status)), yt.push(...U(S, { songs: J, current: nt, started: Lt, own: pe, out: At, waiting: qt })), yt.push(Q("div", { class: "al-grow" })), yt.push(We(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => j(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: Le.down })
    )), yt;
  }
  function Ot(S, _) {
    const J = Q("div", { class: "al-topups" + (_ ? " al-topups--primary" : "") }), O = _ ? [S.topUps[1] ?? S.topUps[0]] : [...S.topUps];
    for (const it of O) {
      const nt = S.myPlays !== void 0 && S.myPlays >= it && !S.playsComing && !S.busy;
      J.append(We({ class: "al-topup", disabled: !nt, onClick: () => e.topUp(it) }, _ ? `Add ${it.toLocaleString()} plays` : `+${it.toLocaleString()}`));
    }
    return _ && J.append(We({ class: "al-link", onClick: () => j("more") }, "Other amounts")), J;
  }
  function Tt(S) {
    const _ = S.myPlays !== void 0 && S.myPlays >= (S.topUps[0] ?? 0), J = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${S.player.title}`), Q("span", { class: "al-mono" }, S.plays === null || S.plays === void 0 ? "" : `${S.plays.toLocaleString()} left`)),
      Ot(S, !1),
      Q("p", { class: "al-mute al-small" }, S.playsComing ? "Plays are on their way. Add more once they arrive." : S.myPlays === void 0 ? "Checking My player…" : _ ? `Moved from My player · ${ao(S.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !_ && !S.playsComing && S.myPlays !== void 0 ? We({ class: "al-link", onClick: () => {
        j(""), e.openPlayer();
      } }, "Open My player") : null
    ), O = (nt, It, At, qt) => We(
      { class: "al-row", onClick: qt },
      Q("span", { class: "al-row-i", html: nt }),
      Q("span", { class: "al-row-t" }, Q("b", {}, It), Q("small", {}, At)),
      Q("span", { class: "al-row-go", html: Le.right })
    ), it = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      O(Le.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, ie();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), We({ class: "al-icon", "aria-label": "Close", onClick: () => j(""), html: Le.close })),
      S.mode === "open" ? J : null,
      Q(
        "div",
        { class: "al-rows" },
        O(Le.grid, "My music", "Your albums and the radio", () => j("music")),
        O(Le.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          j(""), e.openPlayer();
        }),
        O(Le.gift, "Send music to a friend", "They open it with a link", () => j("gifts")),
        O(Le.device, "This device", "Backup, history, Stacks wallet, returns", () => j("device")),
        it
      )
    );
  }
  function Yt(S) {
    var At, qt;
    const _ = S.player, J = M == null ? void 0 : M.nowPlaying, O = J && _.tracks.some((Gt) => String(Gt.id) === String(J.tokenId)) ? String(J.tokenId) : null, it = !!(M != null && M.playing) && !!O, nt = O ? (qt = (At = e.radio()) == null ? void 0 : At.getPosition) == null ? void 0 : qt.call(At) : null;
    O && (it || ((nt == null ? void 0 : nt.current) ?? 0) > 0.5) && (X = _.id);
    const It = !!O && X === _.id;
    return U(S, {
      songs: _.tracks.filter((Gt) => !Gt.hidden),
      current: O,
      started: It,
      own: It ? String((J == null ? void 0 : J.cover) || "") : "",
      out: S.plays === 0 && !S.playsComing,
      waiting: !!S.playsComing && !S.plays
    });
  }
  function ie() {
    const S = s;
    if (r) {
      if (!S || S.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      ct(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...Yt(S));
      return;
    }
    if (!S) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    ct(), t.hidden = !1;
    const _ = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      S.mode === "open" ? We({ class: "al-icon", "aria-label": "My music", onClick: () => j("music"), html: Le.grid }) : null
    ), J = Q("div", { class: "al-body al-body--" + S.mode }, ...S.mode === "open" ? xt(S) : k(S));
    t.replaceChildren(_, J, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => j("") }), Tt(S)] : []);
  }
  return {
    render(S) {
      if (r) {
        s = S, ie();
        return;
      }
      const _ = !!s;
      s = S, !S && (_ || i) && (i = "", delete a.dataset.sheet), S ? a.dataset.view = "album" : delete a.dataset.view, S != null && S.asking ? a.dataset.asking = "1" : delete a.dataset.asking, ie();
    },
    sheet: () => i,
    setSheet: j
  };
}
const g$ = [
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
function y$(t) {
  for (const [e, n] of g$) if (n.test(t)) return e;
  return null;
}
const qy = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), Wy = (t) => /Android/.test(t);
function w$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : qy(e) ? "x-safari-" + n.href : Wy(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const b$ = (t) => qy(t) ? "Safari" : Wy(t) ? "Chrome" : "your browser", u0 = document.getElementById("ppp");
u0 && m$(u0);
function m$(t) {
  var ge;
  const e = Iw(), n = (h) => t.querySelector(h), r = n(".ppp-frame");
  let s = null;
  const i = async (h, m) => {
    const f = await fetch(h, { cache: "no-store", ...m, signal: AbortSignal.timeout(15e3) }), H = await f.json().catch(() => ({}));
    if (!f.ok) throw new Error((H == null ? void 0 : H.error) || `Request failed (${f.status}).`);
    return H;
  }, o = e6({
    now: Date.now,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    config: (h) => i("/radio/listening-wallet/config?main=" + encodeURIComponent(h || "")),
    links: async (h) => (await i("/radio/listening-wallet/link?main=" + encodeURIComponent(h))).links ?? [],
    mainOf: async (h) => {
      var f;
      const m = (await i("/radio/listening-wallet/link?listening=" + encodeURIComponent(h))).links;
      return ((f = m == null ? void 0 : m.find((H) => H.listening === h)) == null ? void 0 : f.main) ?? null;
    },
    saveLink: async (h) => {
      await i("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(h) });
    },
    bridge: async (h) => {
      s = document.createElement("iframe"), s.title = "Xtrata listening wallet", s.setAttribute("allow", `publickey-credentials-get ${h}; publickey-credentials-create ${h}`), s.referrerPolicy = "no-referrer";
      const m = new Promise((ft, ut) => {
        s.addEventListener("load", () => ft(), { once: !0 }), setTimeout(() => ut(new Error("The listening wallet did not load. Listening stays free.")), 15e3);
      });
      s.src = h + "/", r.replaceChildren(s), await m;
      const f = new bw({ walletOrigin: h, frame: s, timeoutMs: 30 * 6e4 }), H = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), lt = (ft, ut) => H.has(ft) ? f.request(ft, ut) : Promise.race([
        f.request(ft, ut),
        new Promise((Jt, Ue) => setTimeout(() => Ue(new Error("The listening wallet is not answering. Listening stays free.")), 1e4))
      ]);
      return await lt("listening.status"), { request: lt };
    },
    chain: {
      verify: P5,
      balance: U5,
      account: _5,
      owner: H5,
      broadcast: O5,
      transaction: D5,
      confirmedNonce: async (h) => {
        const m = await hs(`/v2/accounts/${h}?proof=0`);
        if (!Number.isSafeInteger(m == null ? void 0 : m.nonce) || m.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(m.nonce);
      }
    },
    signWithMain: (h, m) => Rh({ ...m, network: "mainnet", stxAddress: h }),
    deposit: (h, m, f) => new Promise((H, lt) => Oh({
      recipient: m,
      amount: f.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: h,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ft) => H(ft.txId || ""),
      onCancel: () => lt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: lt
    })),
    validate: F5,
    tabLock: (h) => new Promise((m) => {
      const f = navigator.locks;
      if (!(f != null && f.request)) {
        m(!0);
        return;
      }
      f.request("xtrata-ppp:" + h, { ifAvailable: !0 }, async (H) => {
        m(!!H), H && await new Promise(() => {
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
      set: (h, m) => {
        try {
          localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    changed: () => Zt(o.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (h) => {
      var m, f;
      return a.funder(h, () => V5(h, hs), !!((f = (m = o.snapshot().gate) == null ? void 0 : m.gifts) != null && f.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (h) => {
      const m = await i("/radio/gift/for?wallet=" + encodeURIComponent(h)), f = m == null ? void 0 : m.gift;
      if (!f) return null;
      if (typeof f.returnTo != "string" || typeof f.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: f.returnTo, from: typeof f.from == "string" ? f.from : null, source: String(f.source ?? ""), amount: String(f.amount ?? "0"), treasury: f.treasury, state: f.state === "sending" ? "sending" : "arrived", player: f.player ?? null };
    },
    history: (h, m) => X5(h, (f) => hs(f), m),
    likesChanged: () => {
      var h, m;
      (m = (h = window.XtrataRadio) == null ? void 0 : h.refreshLikes) == null || m.call(h);
    },
    likeState: async (h, m) => {
      const f = await i("/radio/chain-likes?" + new URLSearchParams({ wallet: h, ids: String(m) })), H = Array.isArray(f == null ? void 0 : f.rows) ? f.rows.find((lt) => (lt == null ? void 0 : lt.id) === m) : null;
      if (!H || typeof H.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: H.liked, by: Array.isArray(H.by) ? H.by.filter((lt) => typeof lt == "string") : H.liked ? [h] : [] };
    },
    likeSent: (h, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: h, liked: m } })),
    nameOf: (h) => Tt(h) ?? void 0,
    likeConfirmed: (h, m) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: h, liked: m } })),
    likeFailed: (h) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: h } }))
  }), a = s$({
    json: i,
    main: () => {
      const h = e.load();
      return h.isConnected && h.network === "mainnet" ? h.address : void 0;
    },
    pay: (h, m, f, H) => new Promise((lt, ft) => Oh({
      recipient: m,
      amount: f.toString(),
      memo: H,
      stxAddress: h,
      network: new ul(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (ut) => lt(ut.txId || ""),
      onCancel: () => ft(new Error("Gift cancelled. Nothing was sent.")),
      onError: ft
    })),
    sign: (h, m) => Rh({ ...m, network: "mainnet", stxAddress: h }),
    giftSent: (h, m) => o.giftSent(h, m),
    claiming: (h) => o.giftClaiming(h),
    album: { bind: (h) => o.bindAlbum(h), arrived: async (h, m, f, H) => {
      c.invalidate(), await o.albumArriving(h, m, f, H);
    } },
    who: (h) => S(h),
    changed: () => Zt(o.snapshot()),
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, m) => {
        try {
          m === null ? localStorage.removeItem(h) : localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    now: Date.now
  }), c = f$({
    json: i,
    open: (h) => {
      o.openAlbum(h);
    },
    store: {
      get: (h) => {
        try {
          return localStorage.getItem(h);
        } catch {
          return null;
        }
      },
      set: (h, m) => {
        try {
          m === null ? localStorage.removeItem(h) : localStorage.setItem(h, m);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => Zt(o.snapshot())
  }), u = (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), d = u ? document.getElementById("album") : null, l = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (h) => void o.topUpAlbum(h),
    openPlayer: () => void o.openAlbum(0)
  }, y = d ? l0(d, l) : null, p = document.getElementById("albumList"), v = p ? l0(p, l, { list: !0 }) : null, x = "xtrata.radio.album.last.v1", T = () => {
    try {
      const h = JSON.parse(localStorage.getItem(x) || "null");
      return h && typeof h.root == "string" && Number.isSafeInteger(h.slot) && h.slot > 0 && h.player && Array.isArray(h.player.tracks) ? h : null;
    } catch {
      return null;
    }
  };
  let q = "";
  const W = (h) => {
    const m = JSON.stringify(h);
    if (m !== q) {
      q = m;
      try {
        localStorage.setItem(x, m);
      } catch {
      }
    }
  };
  let E = null;
  window.XtrataRadioLikeHandler = (h) => {
    if (!h || !Number.isSafeInteger(h.song) || h.song < 0) return !1;
    nt();
    const m = It(h.song, { title: h.title, artist: h.artist });
    return o.heart({ song: h.song, title: m.title || void 0, artist: m.artist || void 0, likedBy: Array.isArray(h.likedBy) ? h.likedBy : void 0 });
  };
  let N;
  window.XtrataRadioListeningIdentity = () => {
    const h = o.snapshot();
    return h.solo && h.step !== "off" && h.step !== "elsewhere" ? h.listening : void 0;
  };
  const B = (h) => {
    var f, H;
    const m = window.XtrataRadioListeningIdentity();
    m !== N && (N = m, (H = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || H.call(f));
  };
  let tt = "", et = null, K = !1, j = !1;
  const $ = (h) => {
    var Jt, Ue, De, Nn, Se, ln, Re, He;
    const m = window.XtrataRadio;
    if (!(m != null && m.setGiftPlayer) || !(m != null && m.setGiftStop)) return;
    const f = h.step === "off" || h.step === "elsewhere" ? null : ((Jt = h.gift) == null ? void 0 : Jt.player) ?? null, H = f ? f.id + ":" + f.cover + ":" + f.tracks.map((En) => En.id).join(",") : "";
    H !== tt && (m.setGiftPlayer(f ? { id: f.id, title: f.title, subtitle: f.subtitle, tracks: Co(f).map((En) => En.id), hidden: ((Ue = e$(f)) == null ? void 0 : Ue.id) ?? null, cover: f.cover } : null), tt = H);
    const lt = ((De = h.giftStop) == null ? void 0 : De.text) ?? null;
    lt !== et && (m.setGiftStop(lt), et = lt);
    const ft = ((Nn = h.giftStop) == null ? void 0 : Nn.reason) === "arriving";
    ft !== j && ((Se = m.setGiftWait) == null || Se.call(m, ft), j = ft);
    const ut = !!f && !!((ln = h.albumLock) != null && ln.locked);
    ut !== K && ((Re = m.setGiftLock) == null || Re.call(m, ut), K = ut), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(h.step) && ((He = m.forgetWallets) == null || He.call(m));
  }, P = (h) => h ? h.slice(0, 6) + "…" + h.slice(-4) : "", M = (h) => {
    const m = o.snapshot().playCost || 350n;
    return h > je ? Number((h - je) / m) : 0;
  }, V = (h) => (Number(h) / 1e6).toFixed(h < 1000n ? 6 : 4), ct = (h) => {
    const m = Math.round((Date.now() - h) / 6e4);
    return m < 1 ? "now" : m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
  }, X = (h) => `https://explorer.hiro.so/txid/${h}?chain=mainnet`, L = (h, m = "", f = "") => {
    const H = document.createElement(h);
    return m && (H.textContent = m), f && (H.className = f), H;
  }, rt = (h, m, f = "") => {
    const H = L("button", h, f);
    return H.type = "button", H.onclick = m, H;
  }, ne = (h, m) => {
    const f = L("a", h);
    return f.href = m, f.target = "_blank", f.rel = "noopener", f;
  };
  let k = null, U = location.hash === "#give";
  U && history.replaceState(null, "", location.pathname + location.search);
  let xt = !1;
  const Ot = O6((h) => H6({ address: h, network: "mainnet" }), () => Zt(o.snapshot())), Tt = (h) => Ot.get(h), Yt = y$(navigator.userAgent), ie = (h, m) => {
    const f = navigator.userAgent, H = b$(f), lt = `${location.origin}${location.pathname}${m ? `#gift=${m}` : ""}`, ft = [L("p", `You are in ${h}'s built-in browser, where passkeys often do not work. Open this page in ${H} to make your listening wallet${m ? " and claim your gift" : ""}.`, "ppp-warn")], ut = L("div", "", "ppp-open-row"), Jt = w$(lt, f);
    if (Jt) {
      const Ue = L("a", `Open in ${H}`, "primary ppp-open-in");
      Ue.href = Jt, Ue.dataset.homeAction = "radio:open-in-browser", ut.append(Ue);
    }
    return ut.append(Ls("copy-page-link", "Copy link", () => lt, Jt ? "" : "primary", () => Zt(o.snapshot()))), ft.push(ut, L("p", `If that does not open ${H}, use ${h}'s menu (••• or ⋮) and choose "Open in ${H === "your browser" ? "browser" : H}", or paste the copied link there.`, "ppp-mute")), ft;
  }, S = (h) => Tt(h) ?? P(h), _ = (h) => h.slice(0, 2).map(S).join(" and ") + (h.length > 2 ? ` and ${h.length - 2} more` : ""), J = /* @__PURE__ */ new Map();
  let O = !1;
  const it = (h) => !h || /^(?:Inscription )?#\d+$/.test(h.trim()), nt = () => {
    O || (O = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((h) => h.ok ? h.json() : null).then((h) => {
      for (const m of Array.isArray(h == null ? void 0 : h.tracks) ? h.tracks : []) {
        const f = Number(m == null ? void 0 : m.id);
        Number.isSafeInteger(f) && J.set(f, { title: typeof m.title == "string" ? m.title : void 0, artist: typeof m.artist == "string" ? m.artist : void 0 });
      }
      Zt(o.snapshot());
    }).catch(() => {
      O = !1;
    }));
  }, It = (h, m) => {
    const f = J.get(h), H = F6(h, [f == null ? void 0 : f.title, m == null ? void 0 : m.title].find((ft) => !it(ft)) || ""), lt = D6(h, (f == null ? void 0 : f.artist) || (m == null ? void 0 : m.artist) || "");
    return { title: H, artist: lt };
  }, At = (h) => {
    const { title: m, artist: f } = It(h.song, h);
    return m ? `“${m}”${f ? ` — ${f}` : ""}` : `Song #${h.song}${f ? ` — ${f}` : ""}`;
  }, qt = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Gt = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function vt(h) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(h.step) ? ["", ""] : h.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : h.step === "over" ? ["TOO MUCH", "bad"] : h.step === "locked" ? ["LOCKED", "mute"] : h.step === "intro" || h.step === "link" ? ["", ""] : h.step === "fund" ? h.depositPending ? ["ON ITS WAY", "warn"] : h.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : h.payingOn && h.session && h.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function gt(h, m, f = "", H) {
    const lt = L("dt", h), ft = L("dd", m, f);
    return H && ft.append(" ", H), [lt, ft];
  }
  const Lt = document.getElementById("ppp-top"), pe = () => {
    (r.hidden || r.classList.contains("ppp-frame--rest") ? t : r).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Dt = () => {
    var m, f;
    const h = o.snapshot();
    if (h.step === "connect" || h.step === "wrong-wallet") {
      (m = document.getElementById("radio-wallet-connect")) == null || m.click();
      return;
    }
    if (h.step === "elsewhere" && ((f = h.gate) != null && f.radioUrl)) {
      location.href = h.gate.radioUrl;
      return;
    }
    h.step === "locked" && !h.armed && !h.busy && o.unlock(), h.step === "ready" && !h.payingOn && !h.busy && o.switchOn(), pe();
  };
  Lt && (Lt.onclick = Dt);
  function le(h) {
    if (!Lt) return;
    const m = (H, lt, ft) => {
      Lt.hidden = !1, Lt.className = "ppp-top" + (lt ? " is-" + lt : ""), Lt.replaceChildren(L("span", "", "dot"), document.createTextNode(H)), Lt.title = ft;
    }, f = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0;
    switch (h.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Lt.hidden = !0;
        return;
      case "elsewhere":
        return m("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Lt.hidden = !0;
        return;
      case "intro":
        return m("Start listening", "", "Make your player with a passkey: no app or account needed");
      case "wrong-wallet":
        return m(`Connect ${S(h.linked)}`, "warn", `This device's listening wallet belongs to ${S(h.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return m("Unlock", "", "One tap with your passkey");
      case "link":
        return m("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return h.depositPending ? m("Plays on their way", "quiet", "Plays start by themselves when they land") : m(h.entries.some((H) => H.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return m("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return m("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return h.payingOn && f > 0 ? m(`${f.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : m("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const yt = document.getElementById("pppNudge"), Mt = document.getElementById("onair");
  (ge = yt == null ? void 0 : yt.querySelector("button")) == null || ge.addEventListener("click", () => Dt());
  const Ct = {
    elsewhere: "Plays are not counted here",
    connect: "Plays are not counted",
    intro: "Plays are not counted",
    locked: "Locked · plays are not counted",
    "wrong-wallet": "Wrong wallet connected · plays are not counted",
    link: "Plays are not counted yet",
    fund: "No plays yet",
    over: "Paused · plays are not counted",
    ready: "Plays are off"
  }, Oe = {
    elsewhere: "Open",
    connect: "Connect",
    "wrong-wallet": "Switch wallet",
    intro: "Start",
    locked: "Unlock",
    link: "Finish setup",
    fund: "Add plays",
    over: "Fix it",
    ready: "Switch on"
  };
  function Mn(h) {
    if (h.step === "loading") return;
    const m = h.session ? Math.min(h.session.playsLeft, h.playsLeft) : 0, f = h.step === "ready" && h.payingOn && m > 0, H = h.step === "fund" && h.depositPending, lt = f || H ? "" : Ct[h.step] ?? "", ft = f ? "on" : lt ? "off" : "";
    ft ? document.documentElement.dataset.ppp = ft : delete document.documentElement.dataset.ppp, Mt && (Mt.hidden = !ft, Mt.querySelector(".onair-sub").textContent = f ? `${m.toLocaleString()} plays left` : "Plays off"), yt && (yt.hidden = ft !== "off", ft === "off" && (yt.querySelector(".nudge-t").textContent = lt, yt.querySelector(".nudge-s").textContent = "Every play you count goes to the song’s owner, on-chain.", yt.querySelector("button").textContent = Oe[h.step] ?? "Start"));
  }
  let lr = "";
  function A(h) {
    const m = L("div", "", "ppp-pick");
    h.funderMultiple && h.returnToKind === "funder" && m.append(L("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), h.returnToKind === "funder" && m.append(L("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const f = L("input");
    f.type = "text", f.placeholder = "SP… address to send returns to", f.autocomplete = "off", f.spellcheck = !1, f.setAttribute("aria-label", "Address to return funds to"), f.value = lr, f.oninput = () => {
      lr = f.value;
    };
    const H = rt(h.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      o.setReturnAddress(f.value), lr = "";
    }, "tiny");
    return m.append(f, " ", H), h.returnToKind === "chosen" && m.append(" ", rt("Back to the funder", () => o.clearReturnAddress(), "tiny")), m;
  }
  const F = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function z() {
    const h = L("p", F + " ", "ppp-mute");
    return h.append(ne("Xverse", "https://www.xverse.app/download"), " · ", ne("Leather", "https://leather.io/install-extension")), h;
  }
  let G = "";
  const pt = (h) => {
    const m = document.documentElement, f = h.solo && !h.main ? h.listening ? P(h.listening) : "new" : "", H = o6() ? "1" : "";
    `${f}|${H}` !== G && (G = `${f}|${H}`, f ? m.dataset.pppSolo = f : delete m.dataset.pppSolo, H ? m.dataset.pppWalletInstalled = H : delete m.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const h of [1500, 4e3, 9e3]) setTimeout(() => Zt(o.snapshot()), h);
  function kt(h, m = "") {
    const f = L("div", "", "ppp-topup"), H = de(h);
    f.append(L("span", "Add plays from My player: ", "ppp-mute"));
    for (const lt of Ia) {
      const ft = rt(`+${lt.toLocaleString()}`, () => void o.topUpAlbum(lt), m);
      ft.disabled = H === void 0 || H < lt || h.depositPending || !!h.busy, f.append(ft);
    }
    return H !== void 0 && H < Ia[0] && f.append(L("p", "My player needs plays first (switch to My player above).", "ppp-mute")), f;
  }
  const de = (h) => {
    var H;
    const m = (H = h.likeFunds) == null ? void 0 : H.balance;
    if (m === void 0 || !h.playCost) return;
    const f = m - je - 6000n;
    return f > 0n ? Number(f / h.playCost) : 0;
  };
  function Wt(h) {
    const m = h.likeFunds;
    if (!m || !m.album || !m.low && !m.pending) return [];
    const f = L("div", "", "ppp-pick ppp-lowbox");
    if (!m.low) {
      const lt = L("p", "Top-up for your main listener wallet is on its way. ", "ppp-warn");
      return m.txid && lt.append(ne("View", X(m.txid))), f.append(lt), [f];
    }
    f.append(L("p", "⚠ YOUR MAIN LISTENER WALLET IS OUT OF FUNDS", "ppp-bad ppp-lowtitle")), f.append(L("p", "It signs every like for all your albums, so they all count for you. Likes are paused until it has a little STX. 0.1 STX is hundreds of likes.")), f.append(L("p", m.address, "ppp-addr-full"));
    const H = L("div", "", "ppp-open-row");
    if (H.append(Ls("copy-likes-address", "Copy address", () => m.address, "primary", () => Zt(o.snapshot()))), m.main && !h.solo) {
      const lt = Is - (m.balance ?? 0n);
      lt > 0n && H.append(rt(`Pay ${Yn(lt)} STX from my wallet`, () => void o.topUpLikes(), "primary"));
    }
    return f.append(H), f.append(L("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [f];
  }
  const he = (h) => {
    const m = L("div", "", "ppp-wait");
    m.dataset.since = String(h.since), m.dataset.grace = String(h.graceMs), m.setAttribute("role", "progressbar"), m.setAttribute("aria-label", "Your plays are arriving");
    const f = L("p", "", "ppp-wait-t"), H = L("div", "", "ppp-wait-track");
    return H.append(L("div", "", "ppp-wait-fill")), m.append(f, H), me(m), m;
  };
  function me(h) {
    const m = Number(h.dataset.since), f = Number(h.dataset.grace) || 6e4, H = Math.max(0, Date.now() - m), lt = h.querySelector(".ppp-wait-fill"), ft = h.querySelector(".ppp-wait-t");
    if (H < f) {
      const ut = Math.ceil((f - H) / 1e3);
      lt.style.width = Math.max(4, Math.min(95, H / f * 100)).toFixed(0) + "%", ft.textContent = `Your plays are arriving… usually about a minute · ${ut}s`, h.classList.remove("is-long"), h.setAttribute("aria-valuenow", String(Math.round(H / f * 100)));
    } else
      lt.style.width = "", ft.textContent = "Still arriving… this can take a few minutes. Nothing for you to do: it starts by itself.", h.classList.add("is-long"), h.removeAttribute("aria-valuenow");
  }
  let ve = 0;
  setInterval(() => {
    const h = document.querySelectorAll(".ppp-wait");
    if (!h.length) {
      ve = 0;
      return;
    }
    h.forEach(me), ++ve % 10 === 0 && Zt(o.snapshot());
  }, 1e3);
  function Zt(h) {
    var ke, ci, Pr, yr, _r, wr, li, Ur, ui, fi, br, di, w;
    if (E && ["ready", "fund", "over"].includes(h.step) && !h.busy) {
      const b = E;
      E = null, h.root === b.root && h.slot !== b.slot && o.openAlbum(b.slot);
    }
    const m = a.inProgress(h), f = m && h.step === "fund" ? { ...h, depositPending: !0 } : h;
    if (B(), $(h), pt(f), !m && a.inProgress(h) || (le(f), Mn(f), t.hidden = f.step === "off", t.hidden)) return;
    const [H, lt] = vt(f), ft = n(".ppp-state");
    ft.textContent = H, ft.className = "ppp-state" + (lt ? " ppp-state--" + lt : ""), ft.hidden = !H;
    const ut = !!f.busy || f.armed, Jt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(f.step) && (ut || !["intro", "loading"].includes(f.step));
    r.hidden = !Jt, r.classList.toggle("ppp-frame--rest", !ut && !xt);
    const Ue = n(".ppp-frame-label");
    Ue.hidden = !0;
    const De = n6(f) ?? k;
    k = De;
    const Nn = s6(f, De);
    n(".ppp-badge").hidden = !Nn;
    const Se = n(".ppp-steps"), ln = n(".ppp-stage");
    Se.hidden = ln.hidden = !Nn, De && Nn && (Se.replaceChildren(...pu(f.solo).map((b, I) => {
      const Y = L("li", "", I < De.at ? "done" : I === De.at ? De.blocked ? "now blocked" : "now" : "");
      return Y.append(L("span", I < De.at ? "✓" : String(I + 1), "n"), b), I === De.at && Y.setAttribute("aria-current", "step"), Y;
    })), ln.textContent = De.caption, ln.className = "ppp-stage " + (De.at >= pu(f.solo).length ? "ppp-ok" : De.blocked ? "ppp-bad" : "ppp-cyan"));
    const Re = n(".ppp-facts"), He = [];
    f.main && ((ke = f.gate) != null && ke.here) && !f.solo && He.push(...gt("Your wallet", S(f.main), "ppp-addr-short"));
    const En = () => {
      if (!f.listening) return;
      const b = Ls("copy-listening", "Copy", () => f.listening || "", "tiny", () => Zt(o.snapshot()));
      He.push(...gt(f.slot > 0 ? "Album wallet" : f.linked ? "My player (technical)" : "My player wallet", P(f.listening), "ppp-addr-short", b));
    };
    if (f.linked || En(), f.listening && f.step !== "intro")
      if (f.linked)
        He.push(...gt("Credited to", `${S(f.linked)} · plays, likes and returns`, f.linked === f.main || f.solo ? "ppp-ok" : "ppp-warn")), En();
      else if (f.solo) {
        f.creditedTo && He.push(...gt("Credited to", `${S(f.creditedTo)} · plays and likes`, "ppp-ok"));
        const b = f.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : f.returnTo ? `${S(f.returnTo)} · ${f.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : f.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        He.push(...gt("Returns go to", f.gift ? b : f.returnTo && !Tt(f.returnTo) ? b.replace(P(f.returnTo), f.returnTo) : b, f.returnTo && !f.gift ? "ppp-addr-full" : "ppp-mute"));
      } else He.push(...gt("Linked to", "not linked yet", "ppp-warn"));
    if (f.linkedListening.length && ((ci = f.gate) != null && ci.here)) {
      const b = f.linkedListening.map((I) => P(I) + (I === f.listening ? " (this one)" : "")).join(", ");
      He.push(...gt(f.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", b, "ppp-addr-short"));
    }
    if (f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step)) {
      const b = f.step === "fund" && f.depositPending ? "ppp-mute" : f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      He.push(...gt("Balance", `${Yn(f.balance)} STX · about ${f.playsLeft.toLocaleString()} plays`, b));
    }
    const ur = f.entries.find((b) => b.kind === "play");
    ur && nt(), ur && He.push(...gt("Last paid song", `${At(ur)} → ${S(ur.recipient)}`, qt[ur.status] || "")), Re.replaceChildren(...He), Re.hidden = !He.length;
    const Et = [], re = [], $e = [], An = [], vn = wn(BigInt(((Pr = f.gate) == null ? void 0 : Pr.limits.playFee) ?? "300")), Qi = `Each song you listen to for 30 seconds sends ${Yn(Ja)} STX to whoever holds it, plus a ${Yn(vn - Ja)} STX network fee. It is optional and leaves a permanent on-chain record that you paid the artist.`, $n = !!f.busy;
    switch (f.step) {
      case "elsewhere": {
        if (Et.push(L("p", "Pay artists as you listen.")), (yr = f.gate) != null && yr.radioUrl) {
          const I = L("p");
          I.append(ne("Open the pay-per-play radio →", f.gate.radioUrl)), Et.push(I);
        }
        re.push(L("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (f.linked) {
          const I = [f.linked, ...f.others];
          Et.push(L("p", I.length > 1 ? `This device has listening wallets for ${_(I)}. Connect one of them to keep paying artists.` : `This device's listening wallet is linked to ${S(f.linked)}. Connect that wallet to keep paying artists.`)), re.push(L("p", "Connect a different wallet instead and it gets a listening wallet of its own: each address keeps its own plays, likes and funds. Listening is always free."));
        } else
          Et.push(L("p", "Connect your wallet to pay artists as you listen.")), re.push(L("p", "Every payment is recorded on-chain. Listening is always free."));
        break;
      case "wrong-wallet":
        Et.push(L("p", `This device's listening wallet belongs to ${S(f.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), re.push(L("p", `You are connected as ${S(f.main)}. Listening is still free, and nothing is paid from the listening wallet while this wallet is connected.`)), re.push(L("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), $e.push(rt("Switch wallet", () => {
          var I;
          return (I = document.getElementById("radio-wallet-connect")) == null ? void 0 : I.click();
        }, "primary"));
        break;
      case "not-invited":
        Et.push(L("p", "Coming soon. Listening is free.", "ppp-mute"));
        break;
      case "unsupported":
        Et.push(L("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        Et.push(L("p", "Every play counts for the song’s owner, on-chain.")), re.push(L("p", Qi)), re.push(L("p", "Once it has funds, every song you listen to for 30 seconds pays automatically until you switch it off or the wallet runs out. No popups while you listen.", "ppp-ok")), re.push(L("p", f.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !f.solo && f.main && f.others.length ? (Et.push(L("p", `This device already has a listening wallet for ${_(f.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), re.push(L("p", `Otherwise, set up a new listening wallet for ${S(f.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !f.solo && f.main && re.push(L("p", `This is the listening wallet for ${S(f.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), f.solo && re.push(L("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const b = a.liveGift();
        $e.push(rt(b ? "Claim my gift · no wallet needed" : f.solo ? "Start listening · no wallet needed" : f.others.length && f.main ? `Set up for ${S(f.main)}` : "Start listening", () => void o.create(), "primary")), !b && !f.solo && f.main && f.others.length && $e.push(rt("Switch wallet", () => {
          var I;
          return (I = document.getElementById("radio-wallet-connect")) == null ? void 0 : I.click();
        })), !b && f.solo && $e.push(rt("I have a Stacks wallet", () => {
          var I;
          return (I = document.getElementById("radio-wallet-connect")) == null ? void 0 : I.click();
        })), $e.push(rt("I already have a listening wallet", () => void o.unlock(!0))), b && $e.push(rt("Not now", () => a.setAside(), "quiet"));
        break;
      case "locked":
        f.armed || (Et.push(L("p", "Locked.", "ppp-mute")), $e.push(rt("Unlock", () => void o.unlock(), "primary"))), An.push(rt("Use a different listening wallet", () => void o.unlock(!0), "quiet"));
        break;
      case "link":
        Et.push(L("p", `Link to ${S(f.main)} · free`)), re.push(L("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), re.push(L("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), $e.push(rt(f.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void o.link(), "primary"));
        break;
      case "loading":
        Et.push(L("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (f.depositPending ? f.arrival && Et.push(he(f.arrival)) : (_r = f.gift) != null && _r.player ? Et.push(L("p", "Out of plays · add more to keep listening", "ppp-bad")) : f.entries.length ? Et.push(L("p", "No plays left · add plays to keep counting", "ppp-bad")) : Et.push(L("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / vn)).toLocaleString()} plays`)), (wr = f.gift) != null && wr.player ? re.push(L("p", "This player has no free mode: it carries on by itself once the plays arrive.")) : f.entries.length && re.push(L("p", "Songs play free until you top up. Paying carries on by itself once the top-up confirms.")), f.payingOn && !f.entries.length && re.push(L("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), m || (f.solo ? (re.push(L("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), re.push(L("p", f.listening || "", "ppp-addr-full")), f.listening && !f.depositPending && $e.push(Ls("copy-address", "Copy my address", () => f.listening || "", "primary", () => Zt(o.snapshot())))) : re.push(L("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute"))), f.depositPending && f.depositTxid) {
          const I = L("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          I.append(ne("View", X(f.depositTxid))), Et.push(I);
        } else f.allowance > 0n && !f.solo && $e.push(rt(`Deposit ${Yn(f.allowance)} STX from my wallet`, () => void o.deposit(), "primary"));
        break;
      }
      case "over":
        Et.push(L("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), f.solo && !f.returnTo && (Et.push(L("p", f.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), Et.push(A(f))), (!f.solo || f.returnTo) && $e.push(rt("Return excess", () => void o.returnFunds("excess"), "primary"), rt("Return all", () => void o.returnFunds("all")));
        break;
      case "ready":
        if (f.payingOn && f.session && f.session.playsLeft > 0) {
          const I = Math.min(f.session.playsLeft, f.playsLeft);
          Et.push(L("p", `${I.toLocaleString()} plays left`, "ppp-ok")), re.push(L("p", "Each song pays its holder once you have heard 30 seconds of it. Skips stay free. The heart likes or unlikes from this wallet for 0.0002 STX.")), $e.push(rt("Switch off", () => void o.switchOff()));
        } else
          Et.push(L("p", "Plays are off. Music stays free.", "ppp-mute")), $e.push(rt("Switch plays on", () => void o.switchOn(), "primary"));
        f.queued && Et.push(L("p", f.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${f.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), f.balanceState === "low" && Et.push(L("p", "Running low on plays", "ppp-warn")), f.depositPending ? Et.push(L("p", "Plays on their way…", "ppp-warn")) : f.allowance > 0n && f.balanceState !== "ok" && !f.solo && $e.push(rt(`Top up ${Yn(f.allowance)} STX`, () => void o.deposit()));
        break;
    }
    if (f.solo && f.walletCannotSolo && re.push(L("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), f.solo && ["fund", "ready"].includes(f.step) && ((f.balance ?? 0n) > 0n && f.slot === 0 && re.push(A(f)), re.push(z()), f.slot === 0 && f.step === "ready" && f.entries.some((b) => b.kind === "play" && b.status === "confirmed"))) {
      const b = L("p", "New to Stacks? ", "ppp-mute");
      b.append(ne("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), Et.push(b);
    }
    if (f.walletOutdated && re.push(L("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), f.stuck && (Et.push(L("p", f.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${f.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), $e.push(rt("Clear stuck payments", () => void o.clearStuck()))), ["ready", "fund"].includes(f.step) && (f.returnTo || f.gift) && (f.balance ?? 0n) > 0n && An.push(rt(f.linked ? "Return all to my wallet" : f.gift ? "Return what is left…" : `Return all to ${S(f.returnTo)}`, () => void o.returnFunds("all"), "quiet")), f.slot > 0 && ((li = f.gift) != null && li.player) && ["ready", "fund"].includes(f.step) && f.giftPlays > 20 && An.push(kt(f, "quiet")), ["ready", "fund", "link", "over"].includes(f.step) && An.push(rt("Lock", () => void o.lock(), "quiet")), Jt && !ut && An.push(rt(xt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      xt = !xt, Zt(o.snapshot());
    }, "quiet")), [...$e, ...An].forEach((b) => b.disabled = $n), $n && ($e.length = 0), f.balance !== void 0 && ["fund", "ready", "over"].includes(f.step) && !(f.step === "fund" && f.depositPending && f.balance === 0n) && !((Ur = f.gift) != null && Ur.player)) {
      const b = f.balanceState === "ok" ? "ppp-ok" : f.balanceState === "low" ? "ppp-warn" : "ppp-bad", I = Et.at(0);
      f.step === "ready" && I ? I.append(L("span", ` · ${V(f.balance)} STX`, b)) : Et.push(L("p", `Balance ${V(f.balance)} STX`, b));
    }
    if ((ui = f.gift) != null && ui.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(f.step)) {
      const b = L("p", "", "ppp-gift");
      b.append(`💿 Album · ${f.gift.player.title}`), f.gift.player.subtitle && b.append(" · ", f.gift.player.subtitle);
      const I = ["ready", "fund", "over"].includes(f.step) && f.balance !== void 0 ? f.giftPlays === 0 && f.depositPending ? L("span", " · plays on their way", "ppp-warn") : L("span", f.giftPlays === 0 ? " · no plays left" : ` · ${f.giftPlays.toLocaleString()} ${f.giftPlays === 1 ? "play" : "plays"} left`, f.giftPlays === 0 ? "ppp-bad" : f.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      I && b.append(I);
      const Y = (fi = Et.at(0)) == null ? void 0 : fi.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (f.step === "ready" && Y && /STX/.test(Y.textContent ?? "") && Y.remove(), Et.unshift(b), f.giftPlays <= 20 && ["ready", "fund"].includes(f.step) && !f.depositPending)
        if (f.slot > 0)
          Et.splice(1, 0, L("p", f.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), kt(f, "primary"));
        else {
          const at = L("p", f.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          at.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), at.append(ne("Xverse", "https://www.xverse.app/download"), " and ", ne("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), Et.splice(1, 0, at);
        }
    }
    if (f.gift && !f.linked && ["fund", "ready", "over"].includes(f.step) && f.returnPlan.state === "ready") {
      const b = f.returnPlan, I = L("div", "", "ppp-pick");
      I.append(L("p", b.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Y = L("ul", "", "ppp-gift-list");
      b.steps.forEach((at, R) => {
        const bt = at.kind === "gift" ? "the unused gift" : at.kind === "deposit" ? "what was added to it" : "the rest", wt = L("li");
        wt.append(L("span", `${R + 1}. ${Yn(BigInt(at.send))} STX · ${bt}`, "t"), L("span", at.to ? ` → ${S(at.to)}` : " → choose an address below", at.to ? "ppp-mute" : "ppp-warn")), Y.append(wt);
      }), I.append(Y), b.kept && I.append(L("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), b.steps.some((at) => !at.to) && I.append(A(f)), I.append(rt(b.steps.length > 1 ? `Confirm part 1 of ${b.steps.length}` : "Confirm and return", () => void o.returnFunds("all"), "primary")), Et.push(I);
    }
    const fr = Kt(f), Rn = u ? fr : null, Br = a.banner(h, { bare: !!Rn }), Mr = Yt && (a.pendingCode() || ["intro", "locked", "unsupported"].includes(f.step)) ? ie(Yt, a.pendingCode()) : [];
    Rn || (Et.unshift(...Br), Et.unshift(...Wt(f)), Et.unshift(...Mr)), f.solo && f.creditedTo && f.listening && !["intro", "off", "elsewhere", "loading"].includes(f.step) && Et.unshift(L("p", `This is ${S(f.creditedTo)}'s listening wallet. Plays and likes count for ${S(f.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), n(".ppp-key").replaceChildren(...Et);
    const dr = document.querySelector(".ppp-switch");
    if (dr) {
      const b = c.latest(), I = f.slot > 0, Y = ["fund", "ready", "over"].includes(f.step) && (I || !!b);
      if (dr.hidden = !Y, Y) {
        const at = (bt, wt, $t, te) => {
          const Ie = rt("", te, "ppp-tab");
          return Ie.setAttribute("aria-pressed", String($t)), Ie.append(L("span", bt, "tt"), L("span", wt === void 0 ? "…" : `${M(wt).toLocaleString()} plays`, "ts")), Ie.disabled = !!f.busy, Ie;
        }, R = I ? ((di = (br = f.gift) == null ? void 0 : br.player) == null ? void 0 : di.title) ?? "Album" : b.title;
        dr.replaceChildren(
          at("🎧 My player", I ? (w = f.likeFunds) == null ? void 0 : w.balance : f.balance, !I, () => {
            I && o.openAlbum(0);
          }),
          at("💿 " + R, I ? f.balance : void 0, I, () => {
            !I && b && o.openAlbum(b.slot);
          })
        );
      }
    }
    const hr = c.render(f), Pn = document.querySelector(".ppp-shelf");
    if (Pn) {
      Pn.hidden = !hr;
      const b = Pn.querySelector("summary");
      b && (b.textContent = c.count() > 0 ? `♪ My albums (${c.count()})` : "♪ My albums");
      const I = Pn.querySelector(".ppp-shelf-body");
      hr && I && !I.contains(hr) && I.replaceChildren(hr);
    }
    const un = a.renderFold(h);
    if (n(".ppp-gifts").hidden = !un, un && !n(".ppp-gift-body").contains(un) && n(".ppp-gift-body").replaceChildren(un), un && U) {
      U = !1;
      const b = n(".ppp-gifts");
      b.open = !0, requestAnimationFrame(() => b.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    n(".ppp-body").replaceChildren(...re), n(".ppp-actions").replaceChildren(...$e), n(".ppp-actions2").replaceChildren(...An);
    const pr = f.busy || f.message || "", gr = n(".ppp-msg"), Nr = pr && Et.some((b) => (b.textContent ?? "").startsWith(pr.replace(/[.✓\s]+$/, ""))) ? "" : pr, ai = !Nr && !f.error ? f.notice : "";
    gr.textContent = Nr || ai, gr.classList.toggle("is-warn", !!ai), n(".ppp-err").textContent = f.error;
    const Ji = f.entries.filter((b) => b.kind === "play");
    n(".ppp-recent").hidden = !f.entries.length, n(".ppp-recent-list").replaceChildren(...Ji.slice(0, 5).map((b) => {
      const I = L("li"), Y = b.status === "confirmed" ? "ok" : b.status === "failed" ? "bad" : "warn";
      return I.append(L("span", "", "d " + Y), L("span", At(b), "t"), L("span", ct(b.created), "ppp-mute")), b.txid && I.append(ne("tx", X(b.txid))), I;
    })), n(".ppp-wallets").hidden = !(Re.childElementCount || An.length), n(".ppp-more").hidden = !re.length;
    const ws = n(".ppp-history");
    ws.hidden = !f.entries.length, f.entries.length && nt(), ws.replaceChildren(L("summary", `All activity (${f.entries.length})`), ...f.entries.slice(0, 20).map((b) => {
      const I = L("div", "", "ppp-row"), Y = b.kind === "play" ? [L("span", At(b), "ppp-song"), L("span", ` · ${Yn(BigInt(b.amount))} STX to ${S(b.recipient)}`, "ppp-mute")] : b.kind === "like" ? [L("span", `${b.liked ? "♥ Liked" : "Unliked"} ${At(b)}`, "ppp-song"), L("span", ` · for ${f.linked ? S(f.linked) : "this listening wallet"}`, "ppp-mute")] : [L("span", `Returned ${Yn(BigInt(b.amount))} STX`, "ppp-song"), L("span", ` to ${S(b.recipient)}`, "ppp-mute")];
      return I.append(
        L("span", Gt[b.status] || b.status, "ppp-status " + (qt[b.status] || "")),
        ...Y,
        L("span", ` · ${new Date(b.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), b.txid && I.append(ne("tx ↗", X(b.txid))), I;
    })), y == null || y.render(Rn ? zt(f, Rn, [...Mr, ...Br]) : null), v == null || v.render((fr == null ? void 0 : fr.mode) === "open" ? zt(f, fr, []) : null);
  }
  function Kt(h) {
    var H;
    if (["off", "elsewhere", "not-invited"].includes(h.step)) return null;
    if (h.slot > 0 && ((H = h.gift) != null && H.player) && ["fund", "ready", "over", "link", "loading"].includes(h.step))
      return h.root && W({ root: h.root, slot: h.slot, player: h.gift.player }), { mode: "open", player: h.gift.player };
    const m = a.incomingAlbum();
    if (m) return { mode: "arrive", player: m.player, from: m.from, offered: m.plays };
    const f = T();
    return f && (h.step === "locked" || E && h.step === "loading") ? { mode: "locked", player: f.player } : null;
  }
  function zt(h, m, f) {
    var Ue;
    const H = !!h.busy || h.armed, lt = [...f];
    h.depositPending && h.arrival && lt.push(he(h.arrival)), h.error ? lt.push(L("p", h.error, "ppp-bad")) : h.message && !H ? lt.push(L("p", h.message, "ppp-cyan")) : h.notice && lt.push(L("p", h.notice, "ppp-warn")), m.mode === "open" && ((Ue = h.likeFunds) != null && Ue.album) && h.likeFunds.low && !h.likeFunds.pending && lt.push(L("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const ft = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let ut = null, Jt = null;
    return m.mode === "locked" ? (ut = { label: "Continue listening", run: () => {
      E = T(), o.unlock();
    } }, Jt = { label: "Use a different passkey", run: () => {
      E = null, o.unlock(!0);
    } }) : m.mode === "arrive" && (h.step === "intro" ? (ut = { label: "Open album", run: () => void o.create() }, Jt = { label: "I've used Xtrata Music here before", run: () => void o.unlock(!0) }) : h.step === "locked" ? (ut = { label: "Open album", run: () => void o.unlock() }, Jt = { label: "Use a different passkey", run: () => void o.unlock(!0) }) : h.step === "unsupported" ? lt.push(L("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : lt.length || lt.push(L("p", "Opening your album…", "ppp-cyan"))), {
      mode: m.mode,
      player: m.player,
      from: m.from,
      offered: m.offered,
      plays: m.mode === "open" ? h.balance === void 0 ? null : h.giftPlays : void 0,
      playsComing: h.depositPending,
      status: lt,
      primary: ut,
      secondary: Jt,
      hint: ut ? ft : void 0,
      asking: H,
      busy: !!h.busy,
      myPlays: de(h),
      topUps: Ia
    };
  }
  const xe = /* @__PURE__ */ new Map(), ue = () => {
    const h = window.XtrataRadio;
    return h != null && h.subscribe ? (h.subscribe((m) => {
      const f = m == null ? void 0 : m.nowPlaying;
      f && Number.isSafeInteger(Number(f.tokenId)) && xe.set(Number(f.tokenId), { title: f.title || void 0, artist: f.artist || void 0 });
    }), !0) : !1;
  };
  if (!ue()) {
    const h = setInterval(() => {
      ue() && clearInterval(h);
    }, 500);
    setTimeout(() => clearInterval(h), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (h) => {
    const m = h.detail;
    if (m && Number.isSafeInteger(m.song) && typeof m.id == "string" && /^[0-9a-f]{32}$/.test(m.id)) {
      nt();
      const f = It(m.song, xe.get(m.song));
      o.onListened({ song: m.song, id: m.id, title: f.title || void 0, artist: f.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void o.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || o.refresh();
  }), setInterval(() => {
    !document.hidden && o.snapshot().step !== "off" && o.refresh();
  }, 15e3), o.refresh();
}
const x$ = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", S$ = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, E$ = () => S$() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, A$ = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, v$ = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', Xy = class {
  constructor(t) {
    YA(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && yx(t), this.callback(gc(t));
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
    var r, s, i, o, a, c, u, d, l, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (d = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && d !== void 0 ? d : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = E$(), e = A$(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Bt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Bt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Bt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Bt("div", { class: "flex flex-col space-y-[10px]" }, Bt("div", { class: "flex items-center" }, Bt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Bt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Bt("span", { class: "sr-only" }, "Close popup"), Bt("img", { src: x$ }))), r ? Bt("p", null, "Select the wallet you want to connect to.") : Bt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Bt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Bt("div", { class: "mt-6" }, Bt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Bt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Bt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Bt("div", { class: "mt-6" }, r ? Bt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Bt("div", { class: "mb-5 flex justify-between" }, Bt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Bt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Bt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Bt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Bt("p", null, "What is a wallet? ", Bt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Bt("ul", { class: "space-y-3" }, n.map((i) => Bt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Bt("div", { class: "aspect-square basis-9 overflow-hidden" }, Bt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Bt("div", { class: "flex-1" }, Bt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Bt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Bt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return BA(this);
  }
};
Xy.style = v$;
const $$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: Xy
}, Symbol.toStringTag, { value: "Module" }));
