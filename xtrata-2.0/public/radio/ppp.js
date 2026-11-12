var yb = Object.defineProperty;
var wb = (t, e, n) => e in t ? yb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Po = (t, e, n) => wb(t, typeof e != "symbol" ? e + "" : e, n);
var gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function $p(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function zc(t) {
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
      typeof gn < "u" && gn || {}, r = {
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
        var U = {
          next: function() {
            var m = $.shift();
            return { done: m === void 0, value: m };
          }
        };
        return r.iterable && (U[Symbol.iterator] = function() {
          return U;
        }), U;
      }
      function h($) {
        this.map = {}, $ instanceof h ? $.forEach(function(U, m) {
          this.append(m, U);
        }, this) : Array.isArray($) ? $.forEach(function(U) {
          if (U.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + U.length);
          this.append(U[0], U[1]);
        }, this) : $ && Object.getOwnPropertyNames($).forEach(function(U) {
          this.append(U, $[U]);
        }, this);
      }
      h.prototype.append = function($, U) {
        $ = a($), U = c(U);
        var m = this.map[$];
        this.map[$] = m ? m + ", " + U : U;
      }, h.prototype.delete = function($) {
        delete this.map[a($)];
      }, h.prototype.get = function($) {
        return $ = a($), this.has($) ? this.map[$] : null;
      }, h.prototype.has = function($) {
        return this.map.hasOwnProperty(a($));
      }, h.prototype.set = function($, U) {
        this.map[a($)] = c(U);
      }, h.prototype.forEach = function($, U) {
        for (var m in this.map)
          this.map.hasOwnProperty(m) && $.call(U, this.map[m], m, this);
      }, h.prototype.keys = function() {
        var $ = [];
        return this.forEach(function(U, m) {
          $.push(m);
        }), u($);
      }, h.prototype.values = function() {
        var $ = [];
        return this.forEach(function(U) {
          $.push(U);
        }), u($);
      }, h.prototype.entries = function() {
        var $ = [];
        return this.forEach(function(U, m) {
          $.push([m, U]);
        }), u($);
      }, r.iterable && (h.prototype[Symbol.iterator] = h.prototype.entries);
      function l($) {
        if (!$._noBody) {
          if ($.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          $.bodyUsed = !0;
        }
      }
      function y($) {
        return new Promise(function(U, m) {
          $.onload = function() {
            U($.result);
          }, $.onerror = function() {
            m($.error);
          };
        });
      }
      function g($) {
        var U = new FileReader(), m = y(U);
        return U.readAsArrayBuffer($), m;
      }
      function S($) {
        var U = new FileReader(), m = y(U), N = /charset=([A-Za-z0-9_-]+)/.exec($.type), K = N ? N[1] : "utf-8";
        return U.readAsText($, K), m;
      }
      function v($) {
        for (var U = new Uint8Array($), m = new Array(U.length), N = 0; N < U.length; N++)
          m[N] = String.fromCharCode(U[N]);
        return m.join("");
      }
      function T($) {
        if ($.slice)
          return $.slice(0);
        var U = new Uint8Array($.byteLength);
        return U.set(new Uint8Array($)), U.buffer;
      }
      function O() {
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
              return this.blob().then(g);
            throw new Error("could not read as ArrayBuffer");
          }
        }, this.text = function() {
          var $ = l(this);
          if ($)
            return $;
          if (this._bodyBlob)
            return S(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(v(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(_);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var F = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function k($) {
        var U = $.toUpperCase();
        return F.indexOf(U) > -1 ? U : $;
      }
      function C($, U) {
        if (!(this instanceof C))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        U = U || {};
        var m = U.body;
        if ($ instanceof C) {
          if ($.bodyUsed)
            throw new TypeError("Already read");
          this.url = $.url, this.credentials = $.credentials, U.headers || (this.headers = new h($.headers)), this.method = $.method, this.mode = $.mode, this.signal = $.signal, !m && $._bodyInit != null && (m = $._bodyInit, $.bodyUsed = !0);
        } else
          this.url = String($);
        if (this.credentials = U.credentials || this.credentials || "same-origin", (U.headers || !this.headers) && (this.headers = new h(U.headers)), this.method = k(U.method || this.method || "GET"), this.mode = U.mode || this.mode || null, this.signal = U.signal || this.signal || function() {
          if ("AbortController" in n) {
            var B = new AbortController();
            return B.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && m)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(m), (this.method === "GET" || this.method === "HEAD") && (U.cache === "no-store" || U.cache === "no-cache")) {
          var N = /([?&])_=[^&]*/;
          if (N.test(this.url))
            this.url = this.url.replace(N, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      C.prototype.clone = function() {
        return new C(this, { body: this._bodyInit });
      };
      function _($) {
        var U = new FormData();
        return $.trim().split("&").forEach(function(m) {
          if (m) {
            var N = m.split("="), K = N.shift().replace(/\+/g, " "), B = N.join("=").replace(/\+/g, " ");
            U.append(decodeURIComponent(K), decodeURIComponent(B));
          }
        }), U;
      }
      function Y($) {
        var U = new h(), m = $.replace(/\r?\n[\t ]+/g, " ");
        return m.split("\r").map(function(N) {
          return N.indexOf(`
`) === 0 ? N.substr(1, N.length) : N;
        }).forEach(function(N) {
          var K = N.split(":"), B = K.shift().trim();
          if (B) {
            var it = K.join(":").trim();
            try {
              U.append(B, it);
            } catch (W) {
              console.warn("Response " + W.message);
            }
          }
        }), U;
      }
      O.call(C.prototype);
      function rt($, U) {
        if (!(this instanceof rt))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (U || (U = {}), this.type = "default", this.status = U.status === void 0 ? 200 : U.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = U.statusText === void 0 ? "" : "" + U.statusText, this.headers = new h(U.headers), this.url = U.url || "", this._initBody($);
      }
      O.call(rt.prototype), rt.prototype.clone = function() {
        return new rt(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, rt.error = function() {
        var $ = new rt(null, { status: 200, statusText: "" });
        return $.ok = !1, $.status = 0, $.type = "error", $;
      };
      var X = [301, 302, 303, 307, 308];
      rt.redirect = function($, U) {
        if (X.indexOf(U) === -1)
          throw new RangeError("Invalid status code");
        return new rt(null, { status: U, headers: { location: $ } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(U, m) {
          this.message = U, this.name = m;
          var N = Error(U);
          this.stack = N.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function q($, U) {
        return new Promise(function(m, N) {
          var K = new C($, U);
          if (K.signal && K.signal.aborted)
            return N(new e.DOMException("Aborted", "AbortError"));
          var B = new XMLHttpRequest();
          function it() {
            B.abort();
          }
          B.onload = function() {
            var L = {
              statusText: B.statusText,
              headers: Y(B.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (B.status < 200 || B.status > 599) ? L.status = 200 : L.status = B.status, L.url = "responseURL" in B ? B.responseURL : L.headers.get("X-Request-URL");
            var D = "response" in B ? B.response : B.responseText;
            setTimeout(function() {
              m(new rt(D, L));
            }, 0);
          }, B.onerror = function() {
            setTimeout(function() {
              N(new TypeError("Network request failed"));
            }, 0);
          }, B.ontimeout = function() {
            setTimeout(function() {
              N(new TypeError("Network request timed out"));
            }, 0);
          }, B.onabort = function() {
            setTimeout(function() {
              N(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function W(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (B.open(K.method, W(K.url), !0), K.credentials === "include" ? B.withCredentials = !0 : K.credentials === "omit" && (B.withCredentials = !1), "responseType" in B && (r.blob ? B.responseType = "blob" : r.arrayBuffer && (B.responseType = "arraybuffer")), U && typeof U.headers == "object" && !(U.headers instanceof h || n.Headers && U.headers instanceof n.Headers)) {
            var $t = [];
            Object.getOwnPropertyNames(U.headers).forEach(function(L) {
              $t.push(a(L)), B.setRequestHeader(L, c(U.headers[L]));
            }), K.headers.forEach(function(L, D) {
              $t.indexOf(D) === -1 && B.setRequestHeader(D, L);
            });
          } else
            K.headers.forEach(function(L, D) {
              B.setRequestHeader(D, L);
            });
          K.signal && (K.signal.addEventListener("abort", it), B.onreadystatechange = function() {
            B.readyState === 4 && K.signal.removeEventListener("abort", it);
          }), B.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return q.polyfill = !0, n.fetch || (n.fetch = q, n.Headers = h, n.Request = C, n.Response = rt), e.Headers = h, e.Request = C, e.Response = rt, e.fetch = q, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : gn);
})();
const bb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function mb(t, e) {
  const n = {};
  return Object.assign(n, bb, e), await fetch(t, n);
}
function xb(t) {
  let e = mb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sb(...t) {
  const { fetchLib: e, middlewares: n } = xb(t);
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
var oo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(oo || (oo = {}));
var ii;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ii || (ii = {}));
var Fd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Fd || (Fd = {}));
const Eb = "https://api.mainnet.hiro.so", Ab = "https://api.testnet.hiro.so", vb = "http://localhost:3999", kb = ["mainnet", "testnet", "devnet", "mocknet"];
let ao = class {
  constructor(e) {
    this.version = ii.Mainnet, this.chainId = oo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ii.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Sb();
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
ao.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Jl();
    case "testnet":
      return new $b();
    case "devnet":
      return new Ib();
    case "mocknet":
      return new Ip();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${kb.join(", ")}`);
  }
};
ao.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ao.fromName(t);
let Jl = class extends ao {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Eb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ii.Mainnet, this.chainId = oo.Mainnet;
  }
}, $b = class extends ao {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ab,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ii.Testnet, this.chainId = oo.Testnet;
  }
}, Ip = class extends ao {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ii.Testnet, this.chainId = oo.Testnet;
  }
};
const Ib = Ip, Lp = "xtrata.wallet.bridge.v1", Lb = (t) => typeof t == "object" && t !== null && t.protocol === Lp, Cb = (t) => Lb(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Tb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class _o extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const jd = 12e4;
class Bb {
  constructor(e) {
    Po(this, "pending", /* @__PURE__ */ new Map());
    Po(this, "listenTarget");
    Po(this, "closed", !1);
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
    Po(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Cb(e.data)) return;
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
    const s = Tb(), i = { protocol: Lp, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new _o(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? jd}ms.`
          )
        );
      }, this.options.timeoutMs ?? jd);
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
const Mb = ["SP", "SM"], Nb = ["ST", "SN"], Pb = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Mb.includes(n) ? "mainnet" : Nb.includes(n) ? "testnet" : null;
}, _b = () => {
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
}, Ub = () => typeof window > "u" || !window.localStorage ? _b() : window.localStorage, ml = "xtrata.v15.1.wallet.session", Rd = "mainnet", dc = { isConnected: !1 }, Ob = (t) => t.address ? Pb(t.address) ?? t.network : t.network, Cp = (t) => !t.isConnected || !t.address ? { ...dc } : Ob(t) !== Rd ? { ...dc } : {
  isConnected: !0,
  address: t.address,
  network: Rd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Hb = (t) => {
  if (!t)
    return { ...dc };
  try {
    const e = JSON.parse(t);
    return Cp(e);
  } catch {
    return { ...dc };
  }
}, Db = (t) => {
  const e = Cp(t);
  return JSON.stringify(e);
}, Fb = (t) => {
  const e = Ub();
  return {
    load: () => Hb(e.getItem(ml)),
    save: (n) => {
      e.setItem(ml, Db(n));
    },
    clear: () => {
      e.removeItem(ml);
    }
  };
}, jb = "https://browser.blockstack.org/auth", Rb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Tp = ["store_write"], zb = "blockstack-session", Gb = {
  logLevel: "debug"
}, Ei = {
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
Object.freeze(Ei);
class ko extends Error {
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
class Kb extends ko {
  constructor(e, n = "") {
    super({ code: Ei.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class zd extends ko {
  constructor(e = "") {
    super({ code: Ei.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class va extends ko {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ei.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Gd extends ko {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ei.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class tu extends ko {
  constructor(e) {
    super({ code: Ei.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Bp extends ko {
  constructor(e) {
    super({ code: Ei.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Kd = ["debug", "info", "warn", "error", "none"], eu = {};
for (let t = 0; t < Kd.length; t++) {
  const e = Kd[t];
  eu[e] = t;
}
class Ji {
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
    return eu[Gb.logLevel] <= eu[e];
  }
}
function Vb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Yb() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function xl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Xb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function qb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Wb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function lf(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = qb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ji.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Wb(s, t.toString(), n);
    throw Ji.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Ps(t, e) {
  return uf(un(t), e);
}
function un(t) {
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
  if (vn(t, Uint8Array))
    return BigInt(`0x${yt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Zb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Vd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ua(t, e = 8) {
  return (typeof t == "bigint" ? t : un(t)).toString(16).padStart(e * 2, "0");
}
function Gc(t) {
  return parseInt(t, 16);
}
function uf(t, e = 16) {
  const n = ua(t, e);
  return Vt(n);
}
function Qb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Jb(t, e) {
  return t & BigInt(1) << e;
}
function nu(t) {
  return tm(BigInt(`0x${yt(t)}`), BigInt(t.byteLength * 8));
}
function tm(t, e) {
  return Jb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const em = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += em[n];
  return e;
}
function Vt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Zb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Ai(t) {
  return new TextEncoder().encode(t);
}
function fa(t) {
  return new TextDecoder().decode(t);
}
function nm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function rm(t) {
  return String.fromCharCode.apply(null, t);
}
function sm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Yd(t) {
  if (t.some(sm))
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
function Oe(t) {
  return $r(...t.map((e) => typeof e == "number" ? Yd([e]) : e instanceof Array ? Yd(e) : e));
}
function vn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Mp = "https://api.mainnet.hiro.so", Np = "https://api.testnet.hiro.so", Pp = "http://localhost:3999", im = "https://hub.blockstack.org", om = 33, Sl = 32;
function am(t) {
  if (t.length < Sl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Sl * 2), r = t.slice(2 + Sl * 2);
  return {
    recoveryId: Gc(e),
    r: n,
    s: r
  };
}
function ff(t) {
  const e = typeof t == "string" ? Vt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function cm(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function lm(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function um(t, e) {
  return t[e];
}
function fm(t, e, n = 0) {
  return t[n] = e, t;
}
function dm(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function oi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const hm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function pm(t, e) {
  const n = {};
  return Object.assign(n, hm, e), await fetch(t, n);
}
function gm(t) {
  let e = pm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function ym(...t) {
  const { fetchLib: e, middlewares: n } = gm(t);
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
class _p {
  constructor(e = Tp.slice(), n = ((a) => (a = lf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = jb) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function ru(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function wm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Up(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function bm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ru(t.outputLen), ru(t.blockLen);
}
function mm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function xm(t, e) {
  Up(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ws = {
  number: ru,
  bool: wm,
  bytes: Up,
  hash: bm,
  exists: mm,
  output: xm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const El = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, Sm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Sm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Em(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function df(t) {
  if (typeof t == "string" && (t = Em(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Op = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function vi(t) {
  const e = (r) => t().update(df(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Hp = class extends Op {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ws.hash(e);
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
    return Ws.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ws.exists(this), Ws.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Kc = (t, e, n) => new Hp(t, e).update(n).digest();
Kc.create = (t, e) => new Hp(t, e);
function Am(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let hf = class extends Op {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = El(this.buffer);
  }
  update(e) {
    Ws.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = df(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = El(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ws.exists(this), Ws.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Am(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = El(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const vm = (t, e, n) => t & e ^ ~t & n, km = (t, e, n) => t & e ^ t & n ^ e & n, $m = new Uint32Array([
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
let Dp = class extends hf {
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
      const y = rs[l - 15], g = rs[l - 2], S = hr(y, 7) ^ hr(y, 18) ^ y >>> 3, v = hr(g, 17) ^ hr(g, 19) ^ g >>> 10;
      rs[l] = v + rs[l - 7] + S + rs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), g = h + y + vm(a, c, u) + $m[l] + rs[l] | 0, v = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + km(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    rs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Im = class extends Dp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const co = vi(() => new Dp());
vi(() => new Im());
const Lm = {}, Fp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Lm
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const zt = BigInt(0), be = BigInt(1), Ls = BigInt(2), Ko = BigInt(3), Xd = BigInt(8), ie = Object.freeze({
  a: zt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: be,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), qd = (t, e) => (t + e / Ls) / e, ka = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ie, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -be * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = qd(i * t, e), c = qd(-r * t, e);
    let u = nt(t - a * n - c * s, e), h = nt(-a * r - c * i, e);
    const l = u > o, y = h > o;
    if (l && (u = e - u), y && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: h };
  }
}, ir = 32, ai = 32, jp = 32, hc = ir + 1, pc = 2 * ir + 1;
function Wd(t) {
  const { a: e, b: n } = ie, r = nt(t * t), s = nt(r * t);
  return nt(s + e * t + n);
}
const $a = ie.a === zt;
class pf extends Error {
  constructor(e) {
    super(e);
  }
}
function Zd(t) {
  if (!(t instanceof Qt))
    throw new TypeError("JacobianPoint expected");
}
class Qt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ut))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ut.ZERO) ? Qt.ZERO : new Qt(e.x, e.y, be);
  }
  static toAffineBatch(e) {
    const n = Nm(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Qt.toAffineBatch(e).map(Qt.fromAffine);
  }
  equals(e) {
    Zd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = nt(s * s), u = nt(a * a), h = nt(n * u), l = nt(i * c), y = nt(nt(r * a) * u), g = nt(nt(o * s) * c);
    return h === l && y === g;
  }
  negate() {
    return new Qt(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = nt(e * e), i = nt(n * n), o = nt(i * i), a = e + i, c = nt(Ls * (nt(a * a) - s - o)), u = nt(Ko * s), h = nt(u * u), l = nt(h - Ls * c), y = nt(u * (c - l) - Xd * o), g = nt(Ls * n * r);
    return new Qt(l, y, g);
  }
  add(e) {
    Zd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === zt || o === zt)
      return this;
    if (n === zt || r === zt)
      return e;
    const c = nt(s * s), u = nt(a * a), h = nt(n * u), l = nt(i * c), y = nt(nt(r * a) * u), g = nt(nt(o * s) * c), S = nt(l - h), v = nt(g - y);
    if (S === zt)
      return v === zt ? this.double() : Qt.ZERO;
    const T = nt(S * S), O = nt(S * T), F = nt(h * T), k = nt(v * v - O - Ls * F), C = nt(v * (F - k) - y * O), _ = nt(s * a * S);
    return new Qt(k, C, _);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Qt.ZERO;
    if (typeof e == "bigint" && e === zt)
      return n;
    let r = th(e);
    if (r === be)
      return this;
    if (!$a) {
      let l = n, y = this;
      for (; r > zt; )
        r & be && (l = l.add(y)), y = y.double(), r >>= be;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ka.splitScalar(r), c = n, u = n, h = this;
    for (; i > zt || a > zt; )
      i & be && (c = c.add(h)), a & be && (u = u.add(h)), h = h.double(), i >>= be, a >>= be;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Qt(nt(u.x * ka.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = $a ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Qt.BASE) && (n = Ut.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && su.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Qt.normalizeZ(s), su.set(n, s)));
    let i = Qt.ZERO, o = Qt.BASE;
    const a = 1 + ($a ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const g = y * c;
      let S = Number(e & u);
      e >>= l, S > c && (S -= h, e += be);
      const v = g, T = g + Math.abs(S) - 1, O = y % 2 !== 0, F = S < 0;
      S === 0 ? o = o.add(Ia(O, s[v])) : i = i.add(Ia(F, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = th(e), s, i;
    if ($a) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ka.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: y, f: g } = this.wNAF(u, n);
      h = Ia(o, h), y = Ia(c, y), y = new Qt(nt(y.x * ka.beta), y.y, y.z), s = h.add(y), i = l.add(g);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Qt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Qt.ZERO);
    e == null && (e = i ? Xd : $o(s));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), h = nt(r * c), l = nt(s * o);
    if (i)
      return Ut.ZERO;
    if (l !== be)
      throw new Error("invZ was invalid");
    return new Ut(u, h);
  }
}
Qt.BASE = new Qt(ie.Gx, ie.Gy, be);
Qt.ZERO = new Qt(zt, be, zt);
function Ia(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const su = /* @__PURE__ */ new WeakMap();
class Ut {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, su.delete(this);
  }
  hasEvenY() {
    return this.y % Ls === zt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _n(n ? e : e.subarray(1));
    if (!nc(r))
      throw new Error("Point is not on curve");
    const s = Wd(r);
    let i = Mm(s);
    const o = (i & be) === be;
    n ? o && (i = nt(-i)) : (e[0] & 1) === 1 !== o && (i = nt(-i));
    const a = new Ut(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _n(e.subarray(1, ir + 1)), r = _n(e.subarray(ir + 1, ir * 2 + 1)), s = new Ut(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ir(e), r = n.length, s = n[0];
    if (r === ir)
      return this.fromCompressedHex(n);
    if (r === hc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === pc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${hc} compressed bytes or ${pc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ut.BASE.multiply(ci(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Gp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = gf(Ir(e)), { n: a } = ie, c = r === 2 || r === 3 ? s + a : s, u = $o(c, a), h = nt(-o * u, a), l = nt(i * u, a), y = r & 1 ? "03" : "02", g = Ut.fromHex(y + Ts(c)), S = Ut.BASE.multiplyAndAddUnsafe(g, h, l);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(e = !1) {
    return Bs(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ts(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ts(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!nc(n) || !nc(r))
      throw new Error(e);
    const s = nt(r * r), i = Wd(n);
    if (nt(s - i) !== zt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ut(this.x, nt(-this.y));
  }
  double() {
    return Qt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Qt.fromAffine(this).add(Qt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Qt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Qt.fromAffine(this), i = n === zt || n === be || this !== Ut.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Qt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Qt.ZERO) ? void 0 : a.toAffine();
  }
}
Ut.BASE = new Ut(ie.Gx, ie.Gy);
Ut.ZERO = new Ut(zt, zt);
function Qd(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function Jd(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${lo(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _n(n), left: t.subarray(e + 2) };
}
function Cm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${lo(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Jd(t.subarray(2)), { data: r, left: s } = Jd(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${lo(s)}`);
  return { r: e, s: r };
}
class Pn {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? lo(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Pn(gc(s.slice(0, 64)), gc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Cm(n ? e : Bs(e));
    return new Pn(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!fo(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!fo(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = ie.n >> be;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Pn(this.r, nt(-this.s, ie.n)) : this;
  }
  toDERRawBytes() {
    return Bs(this.toDERHex());
  }
  toDERHex() {
    const e = Qd(Uo(this.s)), n = Qd(Uo(this.r)), r = e.length / 2, s = n.length / 2, i = Uo(r), o = Uo(s);
    return `30${Uo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Bs(this.toCompactHex());
  }
  toCompactHex() {
    return Ts(this.r) + Ts(this.s);
  }
}
function $s(...t) {
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
const Tm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lo(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Tm[t[n]];
  return e;
}
const Bm = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ts(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(zt <= t && t < Bm))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function uo(t) {
  const e = Bs(Ts(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Uo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function gc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Bs(t) {
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
function _n(t) {
  return gc(lo(t));
}
function Ir(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Bs(t);
}
function th(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && fo(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function nt(t, e = ie.P) {
  const n = t % e;
  return n >= zt ? n : e + n;
}
function jn(t, e) {
  const { P: n } = ie;
  let r = t;
  for (; e-- > zt; )
    r *= r, r %= n;
  return r;
}
function Mm(t) {
  const { P: e } = ie, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = jn(u, Ko) * u % e, l = jn(h, Ko) * u % e, y = jn(l, Ls) * c % e, g = jn(y, r) * y % e, S = jn(g, s) * g % e, v = jn(S, o) * S % e, T = jn(v, a) * v % e, O = jn(T, o) * S % e, F = jn(O, Ko) * u % e, k = jn(F, i) * g % e, C = jn(k, n) * c % e, _ = jn(C, Ls);
  if (_ * _ % e !== t)
    throw new Error("Cannot find square root");
  return _;
}
function $o(t, e = ie.P) {
  if (t === zt || e <= zt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, s = zt, i = be;
  for (; n !== zt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== be)
    throw new Error("invert: does not exist");
  return nt(s, e);
}
function Nm(t, e = ie.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === zt ? i : (n[a] = i, nt(i * o, e)), be), s = $o(r, e);
  return t.reduceRight((i, o, a) => o === zt ? i : (n[a] = nt(i * n[a], e), nt(i * o, e)), s), n;
}
function Pm(t) {
  const e = t.length * 8 - ai * 8, n = _n(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function gf(t, e = !1) {
  const n = Pm(t);
  if (e)
    return n;
  const { n: r } = ie;
  return n >= r ? n - r : n;
}
let so, Vo;
class Rp {
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
      throw new pf("hmacSha256Sync needs to be set");
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
    return $s(...n);
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
    return $s(...n);
  }
}
function fo(t) {
  return zt < t && t < ie.n;
}
function nc(t) {
  return zt < t && t < ie.P;
}
function zp(t, e, n, r = !0) {
  const { n: s } = ie, i = gf(t, !0);
  if (!fo(i))
    return;
  const o = $o(i, s), a = Ut.BASE.multiply(i), c = nt(a.x, s);
  if (c === zt)
    return;
  const u = nt(o * nt(e + n * c, s), s);
  if (u === zt)
    return;
  let h = new Pn(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & be);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function ci(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ai)
      throw new Error("Expected 32 bytes of private key");
    e = gc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ai)
      throw new Error("Expected 32 bytes of private key");
    e = _n(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!fo(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function yf(t) {
  return t instanceof Ut ? (t.assertValidity(), t) : Ut.fromHex(t);
}
function Gp(t) {
  if (t instanceof Pn)
    return t.assertValidity(), t;
  try {
    return Pn.fromDER(t);
  } catch {
    return Pn.fromCompact(t);
  }
}
function da(t, e = !1) {
  return Ut.fromPrivateKey(t).toRawBytes(e);
}
function _m(t, e, n, r = !1) {
  return Ut.fromSignature(t, e, n).toRawBytes(r);
}
function eh(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === hc || r === pc : n ? r === hc * 2 || r === pc * 2 : t instanceof Ut;
}
function wf(t, e, n = !1) {
  if (eh(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!eh(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = yf(e);
  return r.assertValidity(), r.multiply(ci(t)).toRawBytes(n);
}
function Kp(t) {
  const e = t.length > ir ? t.slice(0, ir) : t;
  return _n(e);
}
function Um(t) {
  const e = Kp(t), n = nt(e, ie.n);
  return Vp(n < zt ? e : n);
}
function Vp(t) {
  return uo(t);
}
function Yp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ir(t), s = ci(e), i = [Vp(s), Um(r)];
  if (n != null) {
    n === !0 && (n = Ce.randomBytes(ir));
    const c = Ir(n);
    if (c.length !== ir)
      throw new Error(`sign: Expected ${ir} bytes of extra data`);
    i.push(c);
  }
  const o = $s(...i), a = Kp(r);
  return { seed: o, m: a, d: s };
}
function Xp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Om(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Yp(t, e, n.extraEntropy), o = new Rp(jp, ai);
  await o.reseed(r);
  let a;
  for (; !(a = zp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Xp(a, n);
}
function Vc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Yp(t, e, n.extraEntropy), o = new Rp(jp, ai);
  o.reseedSync(r);
  let a;
  for (; !(a = zp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Xp(a, n);
}
const Hm = { strict: !0 };
function Dm(t, e, n, r = Hm) {
  let s;
  try {
    s = Gp(t), e = Ir(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = gf(e);
  let c;
  try {
    c = yf(n);
  } catch {
    return !1;
  }
  const { n: u } = ie, h = $o(o, u), l = nt(a * h, u), y = nt(i * h, u), g = Ut.BASE.multiplyAndAddUnsafe(c, l, y);
  return g ? nt(g.x, u) === i : !1;
}
function yc(t) {
  return nt(_n(t), ie.n);
}
class ho {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ir(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _n(n.subarray(0, 32)), s = _n(n.subarray(32, 64));
    return new ho(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!nc(e) || !fo(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ts(this.r) + Ts(this.s);
  }
  toRawBytes() {
    return Bs(this.toHex());
  }
}
function Fm(t) {
  return Ut.fromPrivateKey(t).toRawX();
}
class qp {
  constructor(e, n, r = Ce.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ir(e);
    const { x: s, scalar: i } = this.getScalar(ci(n));
    if (this.px = s, this.d = i, this.rand = Ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ut.fromPrivateKey(e), r = n.hasEvenY() ? e : ie.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return uo(e ^ _n(n));
  }
  finalizeNonce(e) {
    const n = nt(_n(e), ie.n);
    if (n === zt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new ho(e.x, nt(n + r * s, ie.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHash, o = this.initNonce(n, await i(ks.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ks.nonce, o, r, e)), h = yc(await i(ks.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await Qp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHashSync, o = this.initNonce(n, i(ks.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ks.nonce, o, r, e)), h = yc(i(ks.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return Jp(l, e, r) || this.error(), l;
  }
}
async function jm(t, e, n) {
  return new qp(t, e, n).calc();
}
function Rm(t, e, n) {
  return new qp(t, e, n).calcSync();
}
function Wp(t, e, n) {
  const r = t instanceof ho, s = r ? t : ho.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ir(e),
    P: yf(n)
  };
}
function Zp(t, e, n, r) {
  const s = Ut.BASE.multiplyAndAddUnsafe(e, ci(n), nt(-r, ie.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Qp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Wp(t, e, n), a = yc(await Ce.taggedHash(ks.challenge, uo(r), o.toRawX(), i));
    return Zp(r, o, s, a);
  } catch {
    return !1;
  }
}
function Jp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Wp(t, e, n), a = yc(Ce.taggedHashSync(ks.challenge, uo(r), o.toRawX(), i));
    return Zp(r, o, s, a);
  } catch (r) {
    if (r instanceof pf)
      throw r;
    return !1;
  }
}
const zm = {
  Signature: ho,
  getPublicKey: Fm,
  sign: jm,
  verify: Qp,
  signSync: Rm,
  verifySync: Jp
};
Ut.BASE._setWindowSize(8);
const Cn = {
  node: Fp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ks = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, La = {}, Ce = {
  bytesToHex: lo,
  hexToBytes: Bs,
  concatBytes: $s,
  mod: nt,
  invert: $o,
  isValidPrivateKey(t) {
    try {
      return ci(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: uo,
  _normalizePrivateKey: ci,
  hashToPrivateKey: (t) => {
    t = Ir(t);
    const e = ai + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(_n(t), ie.n - be) + be;
    return uo(n);
  },
  randomBytes: (t = 32) => {
    if (Cn.web)
      return Cn.web.getRandomValues(new Uint8Array(t));
    if (Cn.node) {
      const { randomBytes: e } = Cn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Ce.hashToPrivateKey(Ce.randomBytes(ai + 8)),
  precompute(t = 8, e = Ut.BASE) {
    const n = e === Ut.BASE ? e : new Ut(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ko), n;
  },
  sha256: async (...t) => {
    if (Cn.web) {
      const e = await Cn.web.subtle.digest("SHA-256", $s(...t));
      return new Uint8Array(e);
    } else if (Cn.node) {
      const { createHash: e } = Cn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Cn.web) {
      const n = await Cn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = $s(...e), s = await Cn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Cn.node) {
      const { createHmac: n } = Cn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = La[t];
    if (n === void 0) {
      const r = await Ce.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = $s(r, r), La[t] = n;
    }
    return Ce.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof so != "function")
      throw new pf("sha256Sync is undefined, you need to set it");
    let n = La[t];
    if (n === void 0) {
      const r = so(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = $s(r, r), La[t] = n;
    }
    return so(n, ...e);
  },
  _JacobianPoint: Qt
};
Object.defineProperties(Ce, {
  sha256Sync: {
    configurable: !1,
    get() {
      return so;
    },
    set(t) {
      so || (so = t);
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
const Gm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ie,
  Point: Ut,
  Signature: Pn,
  getPublicKey: da,
  getSharedSecret: wf,
  recoverPublicKey: _m,
  schnorr: zm,
  sign: Om,
  signSync: Vc,
  utils: Ce,
  verify: Dm
}, Symbol.toStringTag, { value: "Module" }));
var ha = {};
ha.byteLength = qm;
var Km = ha.toByteArray = Zm, Vm = ha.fromByteArray = t1, mr = [], Gn = [], Ym = typeof Uint8Array < "u" ? Uint8Array : Array, Al = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Vi = 0, Xm = Al.length; Vi < Xm; ++Vi)
  mr[Vi] = Al[Vi], Gn[Al.charCodeAt(Vi)] = Vi;
Gn[45] = 62;
Gn[95] = 63;
function tg(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function qm(t) {
  var e = tg(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Wm(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Zm(t) {
  var e, n = tg(t), r = n[0], s = n[1], i = new Ym(Wm(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Gn[t.charCodeAt(c)] << 18 | Gn[t.charCodeAt(c + 1)] << 12 | Gn[t.charCodeAt(c + 2)] << 6 | Gn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Gn[t.charCodeAt(c)] << 2 | Gn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Gn[t.charCodeAt(c)] << 10 | Gn[t.charCodeAt(c + 1)] << 4 | Gn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Qm(t) {
  return mr[t >> 18 & 63] + mr[t >> 12 & 63] + mr[t >> 6 & 63] + mr[t & 63];
}
function Jm(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Qm(r));
  return s.join("");
}
function t1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Jm(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    mr[e >> 2] + mr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    mr[e >> 10] + mr[e >> 4 & 63] + mr[e << 2 & 63] + "="
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
async function eg() {
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
  function h(g) {
    if (g instanceof Uint8Array || (ArrayBuffer.isView(g) ? g = new Uint8Array(g.buffer, g.byteOffset, g.byteLength) : Array.isArray(g) && (g = Uint8Array.from(g))), !(g instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (g.length === 0)
      return "";
    for (var S = 0, v = 0, T = 0, O = g.length; T !== O && g[T] === 0; )
      T++, S++;
    for (var F = (O - T) * u + 1 >>> 0, k = new Uint8Array(F); T !== O; ) {
      for (var C = g[T], _ = 0, Y = F - 1; (C !== 0 || _ < v) && Y !== -1; Y--, _++)
        C += 256 * k[Y] >>> 0, k[Y] = C % o >>> 0, C = C / o >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      v = _, T++;
    }
    for (var rt = F - v; rt !== F && k[rt] === 0; )
      rt++;
    for (var X = a.repeat(S); rt < F; ++rt)
      X += t.charAt(k[rt]);
    return X;
  }
  function l(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var S = 0, v = 0, T = 0; g[S] === a; )
      v++, S++;
    for (var O = (g.length - S) * c + 1 >>> 0, F = new Uint8Array(O); g[S]; ) {
      var k = g.charCodeAt(S);
      if (k > 255)
        return;
      var C = e[k];
      if (C === 255)
        return;
      for (var _ = 0, Y = O - 1; (C !== 0 || _ < T) && Y !== -1; Y--, _++)
        C += o * F[Y] >>> 0, F[Y] = C % 256 >>> 0, C = C / 256 >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      T = _, S++;
    }
    for (var rt = O - T; rt !== O && F[rt] === 0; )
      rt++;
    for (var X = new Uint8Array(v + (O - rt)), q = v; rt !== O; )
      X[q++] = F[rt++];
    return X;
  }
  function y(g) {
    var S = l(g);
    if (S)
      return S;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: y
  };
}
var ng = o1;
const a1 = ng, c1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var l1 = a1(c1);
const u1 = /* @__PURE__ */ $p(l1), f1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), rg = Uint8Array.from({ length: 16 }, (t, e) => e), d1 = rg.map((t) => (9 * t + 5) % 16);
let bf = [rg], mf = [d1];
for (let t = 0; t < 4; t++)
  for (let e of [bf, mf])
    e.push(e[t].map((n) => f1[n]));
const sg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), h1 = bf.map((t, e) => t.map((n) => sg[e][n])), p1 = mf.map((t, e) => t.map((n) => sg[e][n])), g1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), y1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ca = (t, e) => t << e | t >>> 32 - e;
function nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ta = new Uint32Array(16);
let w1 = class extends hf {
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
    for (let g = 0; g < 16; g++, n += 4)
      Ta[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const S = 4 - g, v = g1[g], T = y1[g], O = bf[g], F = mf[g], k = h1[g], C = p1[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Ca(r + nh(g, i, a, u) + Ta[O[_]] + v, k[_]) + l | 0;
        r = l, l = u, u = Ca(a, 10) | 0, a = i, i = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Ca(s + nh(S, o, c, h) + Ta[F[_]] + T, C[_]) + y | 0;
        s = y, y = h, h = Ca(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ta.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const b1 = vi(() => new w1());
function m1(t) {
  return b1(t);
}
const Ba = BigInt(2 ** 32 - 1), iu = BigInt(32);
function ig(t, e = !1) {
  return e ? { h: Number(t & Ba), l: Number(t >> iu & Ba) } : { h: Number(t >> iu & Ba) | 0, l: Number(t & Ba) | 0 };
}
function x1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ig(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const S1 = (t, e) => BigInt(t >>> 0) << iu | BigInt(e >>> 0), E1 = (t, e, n) => t >>> n, A1 = (t, e, n) => t << 32 - n | e >>> n, v1 = (t, e, n) => t >>> n | e << 32 - n, k1 = (t, e, n) => t << 32 - n | e >>> n, $1 = (t, e, n) => t << 64 - n | e >>> n - 32, I1 = (t, e, n) => t >>> n - 32 | e << 64 - n, L1 = (t, e) => e, C1 = (t, e) => t, T1 = (t, e, n) => t << n | e >>> 32 - n, B1 = (t, e, n) => e << n | t >>> 32 - n, M1 = (t, e, n) => e << n - 32 | t >>> 64 - n, N1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function P1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), U1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, O1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), H1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, D1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), F1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: ig,
  split: x1,
  toBig: S1,
  shrSH: E1,
  shrSL: A1,
  rotrSH: v1,
  rotrSL: k1,
  rotrBH: $1,
  rotrBL: I1,
  rotr32H: L1,
  rotr32L: C1,
  rotlSH: T1,
  rotlSL: B1,
  rotlBH: M1,
  rotlBL: N1,
  add: P1,
  add3L: _1,
  add3H: U1,
  add4L: O1,
  add4H: H1,
  add5H: F1,
  add5L: D1
}, [j1, R1] = Ct.split([
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
let Yc = class extends hf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: S, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ss[k] = e.getUint32(n), is[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = ss[k - 15] | 0, _ = is[k - 15] | 0, Y = Ct.rotrSH(C, _, 1) ^ Ct.rotrSH(C, _, 8) ^ Ct.shrSH(C, _, 7), rt = Ct.rotrSL(C, _, 1) ^ Ct.rotrSL(C, _, 8) ^ Ct.shrSL(C, _, 7), X = ss[k - 2] | 0, q = is[k - 2] | 0, $ = Ct.rotrSH(X, q, 19) ^ Ct.rotrBH(X, q, 61) ^ Ct.shrSH(X, q, 6), U = Ct.rotrSL(X, q, 19) ^ Ct.rotrBL(X, q, 61) ^ Ct.shrSL(X, q, 6), m = Ct.add4L(rt, U, is[k - 7], is[k - 16]), N = Ct.add4H(m, Y, $, ss[k - 7], ss[k - 16]);
      ss[k] = N | 0, is[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: O, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Ct.rotrSH(l, y, 14) ^ Ct.rotrSH(l, y, 18) ^ Ct.rotrBH(l, y, 41), _ = Ct.rotrSL(l, y, 14) ^ Ct.rotrSL(l, y, 18) ^ Ct.rotrBL(l, y, 41), Y = l & g ^ ~l & v, rt = y & S ^ ~y & T, X = Ct.add5L(F, _, rt, R1[k], is[k]), q = Ct.add5H(X, O, C, Y, j1[k], ss[k]), $ = X | 0, U = Ct.rotrSH(r, s, 28) ^ Ct.rotrBH(r, s, 34) ^ Ct.rotrBH(r, s, 39), m = Ct.rotrSL(r, s, 28) ^ Ct.rotrBL(r, s, 34) ^ Ct.rotrBL(r, s, 39), N = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      O = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Ct.add(u | 0, h | 0, q | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Ct.add3L($, m, K);
      r = Ct.add3H(B, q, U, N), s = B | 0;
    }
    ({ h: r, l: s } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Ct.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Ct.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: O, l: F } = Ct.add(this.Hh | 0, this.Hl | 0, O | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, O, F);
  }
  roundClean() {
    ss.fill(0), is.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, z1 = class extends Yc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, G1 = class extends Yc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, K1 = class extends Yc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const V1 = vi(() => new Yc());
vi(() => new z1());
vi(() => new G1());
vi(() => new K1());
function og(t) {
  return co(t);
}
function Y1(t) {
  return V1(t);
}
const X1 = 0;
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(co, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function q1() {
  return yt(Ce.randomPrivateKey());
}
function W1(t) {
  const e = co(co(t));
  return u1.encode($r(t, e).slice(0, t.length + 4));
}
function Z1(t, e) {
  return W1($r(new Uint8Array([t]), e.slice(0, 20)));
}
function ag(t, e = X1) {
  const n = typeof t == "string" ? Vt(t) : t, r = m1(og(n));
  return Z1(e, r);
}
function cg(t) {
  const e = ff(t);
  return yt(da(e.slice(0, 32), !0));
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(co, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var wc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(wc || (wc = {}));
async function Q1(t, e, n) {
  return await (await eg()).encrypt("aes-256-cbc", e, t, n);
}
async function J1(t, e, n) {
  return await (await eg()).decrypt("aes-256-cbc", e, t, n);
}
function lg(t, e) {
  return Kc(co, t, e);
}
function t2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function ug(t) {
  const e = Y1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function e2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function n2(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: wc.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: wc.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !e2(t))
    return e;
  try {
    return Ut.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function r2(t, e, n, r) {
  const s = n2(t);
  if (!s.result)
    throw s;
  const i = Ce.randomPrivateKey(), o = da(i, !0);
  let a = wf(i, t, !0);
  a = a.slice(1);
  const c = ug(a), u = Ce.randomBytes(16), h = await Q1(u, c.encryptionKey, e), l = $r(u, o, h), y = lg(c.hmacKey, l);
  let g;
  if (!r || r === "hex")
    g = yt(h);
  else if (r === "base64")
    g = Vm(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: yt(u),
    ephemeralPK: yt(o),
    cipherText: g,
    mac: yt(y),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function fg(t, e) {
  if (!e.ephemeralPK)
    throw new Gd("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = wf(t, n, !0);
  r = r.slice(1);
  const s = ug(r), i = Vt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Vt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Km(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = $r(i, Vt(n), o), c = lg(s.hmacKey, a), u = Vt(e.mac);
  if (!t2(u, c))
    throw new Gd("Decryption failed: failure in MAC check");
  const h = await J1(i, s.encryptionKey, o);
  return e.wasString ? fa(h) : h;
}
function s2(t, e) {
  const n = typeof e == "string" ? Ai(e) : e, r = cg(t), s = og(n), i = Vc(s, t);
  return {
    signature: yt(i),
    publicKey: r
  };
}
async function i2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = cg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Ai(t) : t, o = await r2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = s2(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function o2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return fg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var tn = {}, po = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.decode = hn.encode = hn.unescape = hn.escape = hn.pad = void 0;
const dg = ha;
function xf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
hn.pad = xf;
function hg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
hn.escape = hg;
function pg(t) {
  return xf(t).replace(/-/g, "+").replace(/_/g, "/");
}
hn.unescape = pg;
function a2(t) {
  return hg((0, dg.fromByteArray)(new TextEncoder().encode(t)));
}
hn.encode = a2;
function c2(t) {
  return new TextDecoder().decode((0, dg.toByteArray)(xf(pg(t))));
}
hn.decode = c2;
var Xc = {}, qc = {}, gg = {}, yg = {}, Wc = {};
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.crypto = void 0;
Wc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = y, t.rotl = g, t.byteSwap = S, t.byteSwap32 = v, t.bytesToHex = F, t.hexToBytes = _, t.asyncLoop = rt, t.utf8ToBytes = X, t.bytesToUtf8 = q, t.toBytes = $, t.kdfInputToBytes = U, t.concatBytes = m, t.checkOpts = N, t.createHasher = B, t.createOptHasher = it, t.createXOFer = W, t.randomBytes = $t;
  const e = Wc;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...D) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (D.length > 0 && !D.includes(L.length))
      throw new Error("Uint8Array expected of length " + D + ", got length=" + L.length);
  }
  function i(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function o(L, D = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (D && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(L, D) {
    s(L);
    const ct = D.outputLen;
    if (L.length < ct)
      throw new Error("digestInto() expects output buffer of length at least " + ct);
  }
  function c(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function u(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function h(...L) {
    for (let D = 0; D < L.length; D++)
      L[D].fill(0);
  }
  function l(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function y(L, D) {
    return L << 32 - D | L >>> D;
  }
  function g(L, D) {
    return L << D | L >>> 32 - D >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function S(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (L) => L : (L) => S(L), t.byteSwapIfBE = t.swap8IfBE;
  function v(L) {
    for (let D = 0; D < L.length; D++)
      L[D] = S(L[D]);
    return L;
  }
  t.swap32IfBE = t.isLE ? (L) => L : v;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", O = /* @__PURE__ */ Array.from({ length: 256 }, (L, D) => D.toString(16).padStart(2, "0"));
  function F(L) {
    if (s(L), T)
      return L.toHex();
    let D = "";
    for (let ct = 0; ct < L.length; ct++)
      D += O[L[ct]];
    return D;
  }
  const k = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function C(L) {
    if (L >= k._0 && L <= k._9)
      return L - k._0;
    if (L >= k.A && L <= k.F)
      return L - (k.A - 10);
    if (L >= k.a && L <= k.f)
      return L - (k.a - 10);
  }
  function _(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (T)
      return Uint8Array.fromHex(L);
    const D = L.length, ct = D / 2;
    if (D % 2)
      throw new Error("hex string expected, got unpadded hex of length " + D);
    const ot = new Uint8Array(ct);
    for (let lt = 0, Pt = 0; lt < ct; lt++, Pt += 2) {
      const ne = C(L.charCodeAt(Pt)), kt = C(L.charCodeAt(Pt + 1));
      if (ne === void 0 || kt === void 0) {
        const Gt = L[Pt] + L[Pt + 1];
        throw new Error('hex string expected, got non-hex character "' + Gt + '" at index ' + Pt);
      }
      ot[lt] = ne * 16 + kt;
    }
    return ot;
  }
  const Y = async () => {
  };
  t.nextTick = Y;
  async function rt(L, D, ct) {
    let ot = Date.now();
    for (let lt = 0; lt < L; lt++) {
      ct(lt);
      const Pt = Date.now() - ot;
      Pt >= 0 && Pt < D || (await (0, t.nextTick)(), ot += Pt);
    }
  }
  function X(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function q(L) {
    return new TextDecoder().decode(L);
  }
  function $(L) {
    return typeof L == "string" && (L = X(L)), s(L), L;
  }
  function U(L) {
    return typeof L == "string" && (L = X(L)), s(L), L;
  }
  function m(...L) {
    let D = 0;
    for (let ot = 0; ot < L.length; ot++) {
      const lt = L[ot];
      s(lt), D += lt.length;
    }
    const ct = new Uint8Array(D);
    for (let ot = 0, lt = 0; ot < L.length; ot++) {
      const Pt = L[ot];
      ct.set(Pt, lt), lt += Pt.length;
    }
    return ct;
  }
  function N(L, D) {
    if (D !== void 0 && {}.toString.call(D) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, D);
  }
  class K {
  }
  t.Hash = K;
  function B(L) {
    const D = (ot) => L().update($(ot)).digest(), ct = L();
    return D.outputLen = ct.outputLen, D.blockLen = ct.blockLen, D.create = () => L(), D;
  }
  function it(L) {
    const D = (ot, lt) => L(lt).update($(ot)).digest(), ct = L({});
    return D.outputLen = ct.outputLen, D.blockLen = ct.blockLen, D.create = (ot) => L(ot), D;
  }
  function W(L) {
    const D = (ot, lt) => L(lt).update($(ot)).digest(), ct = L({});
    return D.outputLen = ct.outputLen, D.blockLen = ct.blockLen, D.create = (ot) => L(ot), D;
  }
  t.wrapConstructor = B, t.wrapConstructorWithOpts = it, t.wrapXOFConstructorWithOpts = W;
  function $t(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(yg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = yg;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let h = 0; h < u.length; h++)
        u[h] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let h = 0; h < u.length; h++)
        u[h] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: h, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = h, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(gg);
const Yi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function wg(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ou(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function ki(t, ...e) {
  if (!wg(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function l2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  ou(t.outputLen), ou(t.blockLen);
}
function au(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function bg(t, e) {
  ki(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function u2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function f2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function bc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Jn(t, e) {
  return t << 32 - e | t >>> e;
}
function d2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Sf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ef(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const mg = Sf ? (t) => t : (t) => Ef(t), h2 = mg;
function xg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ef(t[e]);
  return t;
}
const p2 = Sf ? (t) => t : xg, Sg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", g2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Eg(t) {
  if (ki(t), Sg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += g2[t[n]];
  return e;
}
const Pr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function rh(t) {
  if (t >= Pr._0 && t <= Pr._9)
    return t - Pr._0;
  if (t >= Pr.A && t <= Pr.F)
    return t - (Pr.A - 10);
  if (t >= Pr.a && t <= Pr.f)
    return t - (Pr.a - 10);
}
function y2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Sg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = rh(t.charCodeAt(i)), a = rh(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Ag = async () => {
};
async function w2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Ag(), r += i);
  }
}
function Af(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function b2(t) {
  return new TextDecoder().decode(t);
}
function pa(t) {
  return typeof t == "string" && (t = Af(t)), ki(t), t;
}
function m2(t) {
  return typeof t == "string" && (t = Af(t)), ki(t), t;
}
function x2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    ki(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function S2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let vg = class {
};
function Zc(t) {
  const e = (r) => t().update(pa(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function kg(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function $g(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const E2 = Zc, A2 = kg, v2 = $g;
function k2(t = 32) {
  if (Yi && typeof Yi.getRandomValues == "function")
    return Yi.getRandomValues(new Uint8Array(t));
  if (Yi && typeof Yi.randomBytes == "function")
    return Uint8Array.from(Yi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const $2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: vg,
  abytes: ki,
  aexists: au,
  ahash: l2,
  anumber: ou,
  aoutput: bg,
  asyncLoop: w2,
  byteSwap: Ef,
  byteSwap32: xg,
  byteSwapIfBE: h2,
  bytesToHex: Eg,
  bytesToUtf8: b2,
  checkOpts: S2,
  clean: bc,
  concatBytes: x2,
  createHasher: Zc,
  createOptHasher: kg,
  createView: rc,
  createXOFer: $g,
  hexToBytes: y2,
  isBytes: wg,
  isLE: Sf,
  kdfInputToBytes: m2,
  nextTick: Ag,
  randomBytes: k2,
  rotl: d2,
  rotr: Jn,
  swap32IfBE: p2,
  swap8IfBE: mg,
  toBytes: pa,
  u32: f2,
  u8: u2,
  utf8ToBytes: Af,
  wrapConstructor: E2,
  wrapConstructorWithOpts: A2,
  wrapXOFConstructorWithOpts: v2
}, Symbol.toStringTag, { value: "Module" }));
function I2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function L2(t, e, n) {
  return t & e ^ ~t & n;
}
function C2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class T2 extends vg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rc(this.buffer);
  }
  update(e) {
    au(this), e = pa(e), ki(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = rc(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    au(this), bg(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, bc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    I2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = rc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const os = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), as = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), B2 = /* @__PURE__ */ Uint32Array.from([
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
]), cs = /* @__PURE__ */ new Uint32Array(64);
let vf = class extends T2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = os[0] | 0, this.B = os[1] | 0, this.C = os[2] | 0, this.D = os[3] | 0, this.E = os[4] | 0, this.F = os[5] | 0, this.G = os[6] | 0, this.H = os[7] | 0;
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
      cs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = cs[l - 15], g = cs[l - 2], S = Jn(y, 7) ^ Jn(y, 18) ^ y >>> 3, v = Jn(g, 17) ^ Jn(g, 19) ^ g >>> 10;
      cs[l] = v + cs[l - 7] + S + cs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Jn(a, 6) ^ Jn(a, 11) ^ Jn(a, 25), g = h + y + L2(a, c, u) + B2[l] + cs[l] | 0, v = (Jn(r, 2) ^ Jn(r, 13) ^ Jn(r, 22)) + C2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    bc(cs);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bc(this.buffer);
  }
}, Ig = class extends vf {
  constructor() {
    super(28), this.A = as[0] | 0, this.B = as[1] | 0, this.C = as[2] | 0, this.D = as[3] | 0, this.E = as[4] | 0, this.F = as[5] | 0, this.G = as[6] | 0, this.H = as[7] | 0;
  }
};
const M2 = /* @__PURE__ */ Zc(() => new vf()), N2 = /* @__PURE__ */ Zc(() => new Ig()), P2 = vf, Lg = M2, _2 = Ig, U2 = N2, O2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: _2,
  SHA256: P2,
  sha224: U2,
  sha256: Lg
}, Symbol.toStringTag, { value: "Module" })), Qc = /* @__PURE__ */ zc(O2), H2 = /* @__PURE__ */ zc(Gm);
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
go.joseToDer = go.derToJose = void 0;
const Cg = ha, Tg = hn;
function vl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const D2 = {
  ES256: vl(256),
  ES384: vl(384),
  ES512: vl(521)
};
function Bg(t) {
  const e = D2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const mc = 128, Mg = 0, F2 = 32, j2 = 16, R2 = 2, Ng = j2 | F2 | Mg << 6, xc = R2 | Mg << 6;
function Pg(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Cg.toByteArray)((0, Tg.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function z2(t, e) {
  const n = Pg(t), r = Bg(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Ng)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (mc | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== xc)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== xc)
    throw new Error('Could not find expected "int" for "s"');
  const h = n[o++];
  if (i - o !== h)
    throw new Error(`"s" specified length of "${h}", expected "${i - o}"`);
  if (s < h)
    throw new Error(`"s" specified length of "${h}", max of "${s}" is acceptable`);
  const l = o;
  if (o += h, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const y = r - c, g = r - h, S = new Uint8Array(y + c + g + h);
  for (o = 0; o < y; ++o)
    S[o] = 0;
  S.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const v = o; o < v + g; ++o)
    S[o] = 0;
  return S.set(n.subarray(l + Math.max(-g, 0), l + h), o), (0, Tg.escape)((0, Cg.fromByteArray)(S));
}
go.derToJose = z2;
function sh(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= mc && --r, r;
}
function G2(t, e) {
  t = Pg(t);
  const n = Bg(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = sh(t, 0, n), i = sh(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < mc, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Ng, u ? h[l++] = c : (h[l++] = mc | 1, h[l++] = c & 255), h[l++] = xc, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = xc, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
go.joseToDer = G2;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.InvalidTokenError = Vr.MissingParametersError = void 0;
class K2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Vr.MissingParametersError = K2;
class V2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Vr.InvalidTokenError = V2;
const ga = /* @__PURE__ */ zc($2);
Object.defineProperty(qc, "__esModule", { value: !0 });
qc.SECP256K1Client = void 0;
const Y2 = gg, X2 = Qc, sc = H2, ih = go, oh = Vr, ah = ga;
sc.utils.hmacSha256Sync = (t, ...e) => {
  const n = Y2.hmac.create(X2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class _g {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ah.bytesToHex)(sc.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new oh.MissingParametersError("a signing input hash and private key are all required");
    const s = sc.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ah.bytesToHex)(s);
    if (r === "jose")
      return (0, ih.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ih.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new oh.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return sc.verify(n, e, r, { strict: !1 });
  }
}
qc.SECP256K1Client = _g;
_g.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = qc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Xc);
var li = {};
const q2 = /* @__PURE__ */ zc(Fp);
var W2 = gn && gn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function u(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(li, "__esModule", { value: !0 });
li.hashSha256Async = li.hashSha256 = void 0;
const Z2 = Qc;
function Ug(t) {
  return (0, Z2.sha256)(t);
}
li.hashSha256 = Ug;
function Q2(t) {
  return W2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = q2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Ug(t));
    }
  });
}
li.hashSha256Async = Q2;
var J2 = gn && gn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(h) {
      try {
        u(r.next(h));
      } catch (l) {
        o(l);
      }
    }
    function c(h) {
      try {
        u(r.throw(h));
      } catch (l) {
        o(l);
      }
    }
    function u(h) {
      h.done ? i(h.value) : s(h.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(po, "__esModule", { value: !0 });
po.TokenSigner = po.createUnsecuredToken = void 0;
const cu = hn, ch = Xc, tx = Vr, lh = li;
function lu(t, e) {
  const n = [], r = cu.encode(JSON.stringify(e));
  n.push(r);
  const s = cu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function ex(t) {
  return lu(t, { typ: "JWT", alg: "none" }) + ".";
}
po.createUnsecuredToken = ex;
class nx {
  constructor(e, n) {
    if (!(e && n))
      throw new tx.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !ch.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = ch.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = lu(e, s), o = (0, lh.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return J2(this, void 0, void 0, function* () {
      const s = this.header(r), i = lu(e, s), o = yield (0, lh.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [cu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
po.TokenSigner = nx;
var Jc = {};
Object.defineProperty(Jc, "__esModule", { value: !0 });
Jc.TokenVerifier = void 0;
const rx = hn, uh = Xc, sx = Vr, Ma = li;
class ix {
  constructor(e, n) {
    if (!(e && n))
      throw new sx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !uh.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = uh.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, Ma.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, Ma.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), rx.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, Ma.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, Ma.hashSha256)(r);
      return i(o);
    }
  }
}
Jc.TokenVerifier = ix;
var tl = {};
Object.defineProperty(tl, "__esModule", { value: !0 });
tl.decodeToken = void 0;
const Na = hn;
function ox(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Na.decode(e[0])), r = JSON.parse(Na.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Na.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Na.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
tl.decodeToken = ox;
(function(t) {
  var e = gn && gn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = gn && gn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(po, t), n(Jc, t), n(tl, t), n(Vr, t), n(Xc, t);
})(tn);
function ax(t) {
  return `did:btc-addr:${t}`;
}
function cx(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new zd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new zd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Og(t) {
  if (t)
    return cx(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const lx = "1.4.0";
function ux() {
  return q1();
}
function fx(t, e, n, r = Tp.slice(), s, i = Vb().getTime(), o = {}) {
  const a = (g) => {
    const S = lf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Xb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: lx,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = tn.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = ag(u);
  return c.iss = ax(h), new tn.TokenSigner("ES256k", t).sign(c);
}
async function fh(t, e) {
  const n = fa(Vt(e)), r = JSON.parse(n), s = await fg(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function dx(t) {
  const e = tn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new tn.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function hx(t) {
  const e = tn.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Og(e.iss);
  if (n.length === 1) {
    if (ag(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function px(t) {
  const e = tn.decodeToken(t).payload;
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
function gx(t) {
  const e = tn.decodeToken(t).payload;
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
function yx(t) {
  const e = [
    gx(t),
    px(t),
    dx(t),
    hx(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const dh = "1.0.0";
class Ms {
  constructor(e) {
    this.version = dh, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== dh)
      throw new tu(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ms(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Hg {
  constructor(e) {
    if (e) {
      const n = new Ms(e);
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
class hh extends Hg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ms({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Bp("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ms({})), !0;
  }
}
class ph extends Hg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = zb, !localStorage.getItem(this.key)) {
      const r = new Ms({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Bp("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ms.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ms({})), !0;
  }
}
var Jo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Jo || (Jo = {}));
var Sc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sc || (Sc = {}));
Jo.Mainnet;
var jr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(jr || (jr = {}));
var Er;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Er || (Er = {}));
jr.Mainnet;
const Dg = {
  chainId: Jo.Mainnet,
  transactionVersion: jr.Mainnet,
  peerNetworkId: Sc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Er.MainnetSingleSig,
    multiSig: Er.MainnetMultiSig
  },
  client: { baseUrl: Mp }
}, uu = {
  chainId: Jo.Testnet,
  transactionVersion: jr.Testnet,
  peerNetworkId: Sc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Er.TestnetSingleSig,
    multiSig: Er.TestnetMultiSig
  },
  client: { baseUrl: Np }
}, ic = {
  ...uu,
  addressVersion: { ...uu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Pp }
}, wx = {
  ...ic,
  addressVersion: { ...ic.addressVersion },
  client: { ...ic.client }
};
function bx(t) {
  switch (t) {
    case "mainnet":
      return Dg;
    case "testnet":
      return uu;
    case "devnet":
      return ic;
    case "mocknet":
      return wx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Fg(t) {
  return typeof t == "string" ? bx(t) : t;
}
var gh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(yh || (yh = {}));
var tr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(tr || (tr = {}));
const kl = ["onChainOnly", "offChainOnly", "any"];
kl[0] + "", tr.OnChainOnly, kl[1] + "", tr.OffChainOnly, kl[2] + "", tr.Any, tr.OnChainOnly + "", tr.OnChainOnly, tr.OffChainOnly + "", tr.OffChainOnly, tr.Any + "", tr.Any;
var wh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(wh || (wh = {}));
var bh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(bh || (bh = {}));
var mh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(mh || (mh = {}));
var Dr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Dr || (Dr = {}));
var xh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xh || (xh = {}));
var Sh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Sh || (Sh = {}));
var Eh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Eh || (Eh = {}));
var Ah;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Ah || (Ah = {}));
var vh;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(vh || (vh = {}));
var kh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(kh || (kh = {}));
var $h;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})($h || ($h = {}));
var Ih;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ih || (Ih = {}));
var Lh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Lh || (Lh = {}));
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function mx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function xx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fu(t.outputLen), fu(t.blockLen);
}
function Sx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ex(t, e) {
  jg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Zs = {
  number: fu,
  bool: mx,
  bytes: jg,
  hash: xx,
  exists: Sx,
  output: Ex
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, Ax = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ax)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function vx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function kf(t) {
  if (typeof t == "string" && (t = vx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Rg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function $i(t) {
  const e = (r) => t().update(kf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let zg = class extends Rg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Zs.hash(e);
    const r = kf(n);
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
    return Zs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Zs.exists(this), Zs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Gg = (t, e, n) => new zg(t, e).update(n).digest();
Gg.create = (t, e) => new zg(t, e);
function kx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let $f = class extends Rg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $l(this.buffer);
  }
  update(e) {
    Zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = kf(e);
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
    Zs.exists(this), Zs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    kx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = $l(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const $x = (t, e, n) => t & e ^ ~t & n, Ix = (t, e, n) => t & e ^ t & n ^ e & n, Lx = new Uint32Array([
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
let Kg = class extends $f {
  constructor() {
    super(64, 32, 8, !1), this.A = ls[0] | 0, this.B = ls[1] | 0, this.C = ls[2] | 0, this.D = ls[3] | 0, this.E = ls[4] | 0, this.F = ls[5] | 0, this.G = ls[6] | 0, this.H = ls[7] | 0;
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
      us[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = us[l - 15], g = us[l - 2], S = pr(y, 7) ^ pr(y, 18) ^ y >>> 3, v = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      us[l] = v + us[l - 7] + S + us[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = h + y + $x(a, c, u) + Lx[l] + us[l] | 0, v = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + Ix(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Cx = class extends Kg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Vg = $i(() => new Kg());
$i(() => new Cx());
var Ii = {}, If = {};
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
    for (let g = o.length - 1; g >= 0; g--)
      if (u < 4) {
        const S = n.indexOf(o[g]) >> u;
        let v = 0;
        g !== 0 && (v = n.indexOf(o[g - 1]));
        const T = 1 + u, O = v % (1 << T) << 5 - T, F = t.c32[S + O];
        u = T, c.unshift(F);
      } else
        u = 0;
    let h = 0;
    for (let g = 0; g < c.length && c[g] === "0"; g++)
      h++;
    c = c.slice(h);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), y = l ? l[0].length : 0;
    for (let g = 0; g < y; g++)
      c.unshift(t.c32[0]);
    if (a) {
      const g = a - c.length;
      for (let S = 0; S < g; S++)
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
    let h = [], l = 0, y = 0;
    for (let v = o.length - 1; v >= 0; v--) {
      y === 4 && (h.unshift(n[l]), y = 0, l = 0);
      const O = (t.c32.indexOf(o[v]) << y) + l, F = n[O % 16];
      if (y += 1, l = O >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      h.unshift(F);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let g = 0;
    for (let v = 0; v < h.length && h[v] === "0"; v++)
      g++;
    h = h.slice(g - g % 2);
    let S = h.join("");
    for (let v = 0; v < u; v++)
      S = `00${S}`;
    if (a) {
      const v = a * 2 - S.length;
      for (let T = 0; T < v; T += 2)
        S = `00${S}`;
    }
    return S;
  }
  t.c32decode = i;
})(If);
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.c32checkDecode = ui.c32checkEncode = void 0;
const Ch = Qc, Th = ga, Yo = If;
function Yg(t) {
  const e = (0, Ch.sha256)((0, Ch.sha256)((0, Th.hexToBytes)(t)));
  return (0, Th.bytesToHex)(e.slice(0, 4));
}
function Tx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Yg(`${n}${e}`), s = (0, Yo.c32encode)(`${e}${r}`);
  return `${Yo.c32[t]}${s}`;
}
ui.c32checkEncode = Tx;
function Bx(t) {
  t = (0, Yo.c32normalize)(t);
  const e = (0, Yo.c32decode)(t.slice(1)), n = t[0], r = Yo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Yg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
ui.c32checkDecode = Bx;
var Xg = {}, yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
yo.decode = yo.encode = void 0;
const Ec = Qc, Bh = ga, qg = ng, Wg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Mx(t, e = "00") {
  const n = typeof t == "string" ? (0, Bh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Bh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...r, ...n])));
  return qg(Wg).encode([...r, ...n, ...s.slice(0, 4)]);
}
yo.encode = Mx;
function Nx(t) {
  const e = qg(Wg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
yo.decode = Nx;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = ui, n = yo, r = ga;
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
  function o(h, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(h, l)}`;
  }
  t.c32address = o;
  function a(h) {
    if (h.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (h[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(h.slice(1));
  }
  t.c32addressDecode = a;
  function c(h, l = -1) {
    const y = n.decode(h), g = (0, r.bytesToHex)(y.data), S = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let v;
    return l < 0 ? (v = S, s[S] !== void 0 && (v = s[S])) : v = l, o(v, g);
  }
  t.b58ToC32 = c;
  function u(h, l = -1) {
    const y = a(h), g = y[0], S = y[1];
    let v;
    l < 0 ? (v = g, i[g] !== void 0 && (v = i[g])) : v = l;
    let T = v.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(S, T);
  }
  t.c32ToB58 = u;
})(Xg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = If;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = ui;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Xg;
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
})(Ii);
function Px(t, e) {
  switch (e = Fg(e ?? Dg), t) {
    case Dr.P2PKH:
      switch (e.transactionVersion) {
        case jr.Mainnet:
          return Er.MainnetSingleSig;
        case jr.Testnet:
          return Er.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Dr.P2SH:
    case Dr.P2SHNonSequential:
    case Dr.P2WPKH:
    case Dr.P2WSH:
    case Dr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case jr.Mainnet:
          return Er.MainnetMultiSig;
        case jr.Testnet:
          return Er.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const _x = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Zg = Uint8Array.from({ length: 16 }, (t, e) => e), Ux = Zg.map((t) => (9 * t + 5) % 16);
let Lf = [Zg], Cf = [Ux];
for (let t = 0; t < 4; t++)
  for (let e of [Lf, Cf])
    e.push(e[t].map((n) => _x[n]));
const Qg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ox = Lf.map((t, e) => t.map((n) => Qg[e][n])), Hx = Cf.map((t, e) => t.map((n) => Qg[e][n])), Dx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Fx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pa = (t, e) => t << e | t >>> 32 - e;
function Mh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _a = new Uint32Array(16);
let jx = class extends $f {
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
    for (let g = 0; g < 16; g++, n += 4)
      _a[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const S = 4 - g, v = Dx[g], T = Fx[g], O = Lf[g], F = Cf[g], k = Ox[g], C = Hx[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Pa(r + Mh(g, i, a, u) + _a[O[_]] + v, k[_]) + l | 0;
        r = l, l = u, u = Pa(a, 10) | 0, a = i, i = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Pa(s + Mh(S, o, c, h) + _a[F[_]] + T, C[_]) + y | 0;
        s = y, y = h, h = Pa(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    _a.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const Rx = $i(() => new jx()), Ua = BigInt(2 ** 32 - 1), du = BigInt(32);
function Jg(t, e = !1) {
  return e ? { h: Number(t & Ua), l: Number(t >> du & Ua) } : { h: Number(t >> du & Ua) | 0, l: Number(t & Ua) | 0 };
}
function zx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Jg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Gx = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), Kx = (t, e, n) => t >>> n, Vx = (t, e, n) => t << 32 - n | e >>> n, Yx = (t, e, n) => t >>> n | e << 32 - n, Xx = (t, e, n) => t << 32 - n | e >>> n, qx = (t, e, n) => t << 64 - n | e >>> n - 32, Wx = (t, e, n) => t >>> n - 32 | e << 64 - n, Zx = (t, e) => e, Qx = (t, e) => t, Jx = (t, e, n) => t << n | e >>> 32 - n, tS = (t, e, n) => e << n | t >>> 32 - n, eS = (t, e, n) => e << n - 32 | t >>> 64 - n, nS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function rS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const sS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), iS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, oS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), aS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, cS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), lS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: Jg,
  split: zx,
  toBig: Gx,
  shrSH: Kx,
  shrSL: Vx,
  rotrSH: Yx,
  rotrSL: Xx,
  rotrBH: qx,
  rotrBL: Wx,
  rotr32H: Zx,
  rotr32L: Qx,
  rotlSH: Jx,
  rotlSL: tS,
  rotlBH: eS,
  rotlBL: nS,
  add: rS,
  add3L: sS,
  add3H: iS,
  add4L: oS,
  add4H: aS,
  add5H: lS,
  add5L: cS
}, [uS, fS] = Tt.split([
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
].map((t) => BigInt(t))), fs = new Uint32Array(80), ds = new Uint32Array(80);
let el = class extends $f {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: S, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      fs[k] = e.getUint32(n), ds[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = fs[k - 15] | 0, _ = ds[k - 15] | 0, Y = Tt.rotrSH(C, _, 1) ^ Tt.rotrSH(C, _, 8) ^ Tt.shrSH(C, _, 7), rt = Tt.rotrSL(C, _, 1) ^ Tt.rotrSL(C, _, 8) ^ Tt.shrSL(C, _, 7), X = fs[k - 2] | 0, q = ds[k - 2] | 0, $ = Tt.rotrSH(X, q, 19) ^ Tt.rotrBH(X, q, 61) ^ Tt.shrSH(X, q, 6), U = Tt.rotrSL(X, q, 19) ^ Tt.rotrBL(X, q, 61) ^ Tt.shrSL(X, q, 6), m = Tt.add4L(rt, U, ds[k - 7], ds[k - 16]), N = Tt.add4H(m, Y, $, fs[k - 7], fs[k - 16]);
      fs[k] = N | 0, ds[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: O, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), _ = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, rt = y & S ^ ~y & T, X = Tt.add5L(F, _, rt, fS[k], ds[k]), q = Tt.add5H(X, O, C, Y, uS[k], fs[k]), $ = X | 0, U = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), m = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), N = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      O = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Tt.add(u | 0, h | 0, q | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Tt.add3L($, m, K);
      r = Tt.add3H(B, q, U, N), s = B | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Tt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Tt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: O, l: F } = Tt.add(this.Hh | 0, this.Hl | 0, O | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, O, F);
  }
  roundClean() {
    fs.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, dS = class extends el {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, hS = class extends el {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, pS = class extends el {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
$i(() => new el());
$i(() => new dS());
$i(() => new hS());
$i(() => new pS());
var Ac = { exports: {} };
Ac.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", g = "[object Number]", S = "[object Object]", v = "[object Promise]", T = "[object RegExp]", O = "[object Set]", F = "[object String]", k = "[object Symbol]", C = "[object WeakMap]", _ = "[object ArrayBuffer]", Y = "[object DataView]", rt = "[object Float32Array]", X = "[object Float64Array]", q = "[object Int8Array]", $ = "[object Int16Array]", U = "[object Int32Array]", m = "[object Uint8Array]", N = "[object Uint8ClampedArray]", K = "[object Uint16Array]", B = "[object Uint32Array]", it = /[\\^$.*+?()[\]{}|]/g, W = /\w*$/, $t = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, D = {};
  D[i] = D[o] = D[_] = D[Y] = D[a] = D[c] = D[rt] = D[X] = D[q] = D[$] = D[U] = D[y] = D[g] = D[S] = D[T] = D[O] = D[F] = D[k] = D[m] = D[N] = D[K] = D[B] = !0, D[u] = D[h] = D[C] = !1;
  var ct = typeof gn == "object" && gn && gn.Object === Object && gn, ot = typeof self == "object" && self && self.Object === Object && self, lt = ct || ot || Function("return this")(), Pt = e && !e.nodeType && e, ne = Pt && !0 && t && !t.nodeType && t, kt = ne && ne.exports === Pt;
  function Gt(w, M) {
    return w.set(M[0], M[1]), w;
  }
  function vt(w, M) {
    return w.add(M), w;
  }
  function De(w, M) {
    for (var R = -1, ft = w ? w.length : 0; ++R < ft && M(w[R], R, w) !== !1; )
      ;
    return w;
  }
  function Ht(w, M) {
    for (var R = -1, ft = M.length, Ne = w.length; ++R < ft; )
      w[Ne + R] = M[R];
    return w;
  }
  function Lt(w, M, R, ft) {
    for (var Ne = -1, ze = w ? w.length : 0; ++Ne < ze; )
      R = M(R, w[Ne], Ne, w);
    return R;
  }
  function jt(w, M) {
    for (var R = -1, ft = Array(w); ++R < w; )
      ft[R] = M(R);
    return ft;
  }
  function le(w, M) {
    return w == null ? void 0 : w[M];
  }
  function kn(w) {
    var M = !1;
    if (w != null && typeof w.toString != "function")
      try {
        M = !!(w + "");
      } catch {
      }
    return M;
  }
  function wn(w) {
    var M = -1, R = Array(w.size);
    return w.forEach(function(ft, Ne) {
      R[++M] = [Ne, ft];
    }), R;
  }
  function Te(w, M) {
    return function(R) {
      return w(M(R));
    };
  }
  function qe(w) {
    var M = -1, R = Array(w.size);
    return w.forEach(function(ft) {
      R[++M] = ft;
    }), R;
  }
  var Ve = Array.prototype, en = Function.prototype, Re = Object.prototype, Xt = lt["__core-js_shared__"], Ye = function() {
    var w = /[^.]+$/.exec(Xt && Xt.keys && Xt.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), nn = en.toString, Fe = Re.hasOwnProperty, oe = Re.toString, pe = RegExp(
    "^" + nn.call(Fe).replace(it, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Xn = kt ? lt.Buffer : void 0, lr = lt.Symbol, I = lt.Uint8Array, x = Te(Object.getPrototypeOf, Object), P = Object.create, G = Re.propertyIsEnumerable, gt = Ve.splice, wt = Object.getOwnPropertySymbols, qt = Xn ? Xn.isBuffer : void 0, ye = Te(Object.keys, Object), Rt = ut(lt, "DataView"), Kt = ut(lt, "Map"), re = ut(lt, "Promise"), At = ut(lt, "Set"), Yt = ut(lt, "WeakMap"), St = ut(Object, "create"), Wt = bt(Rt), ue = bt(Kt), Be = bt(re), fe = bt(At), rn = bt(Yt), bn = lr ? lr.prototype : void 0, qr = bn ? bn.valueOf : void 0;
  function qn(w) {
    var M = -1, R = w ? w.length : 0;
    for (this.clear(); ++M < R; ) {
      var ft = w[M];
      this.set(ft[0], ft[1]);
    }
  }
  function Me() {
    this.__data__ = St ? St(null) : {};
  }
  function $n(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function Os(w) {
    var M = this.__data__;
    if (St) {
      var R = M[w];
      return R === r ? void 0 : R;
    }
    return Fe.call(M, w) ? M[w] : void 0;
  }
  function Dt(w) {
    var M = this.__data__;
    return St ? M[w] !== void 0 : Fe.call(M, w);
  }
  function We(w, M) {
    var R = this.__data__;
    return R[w] = St && M === void 0 ? r : M, this;
  }
  qn.prototype.clear = Me, qn.prototype.delete = $n, qn.prototype.get = Os, qn.prototype.has = Dt, qn.prototype.set = We;
  function sn(w) {
    var M = -1, R = w ? w.length : 0;
    for (this.clear(); ++M < R; ) {
      var ft = w[M];
      this.set(ft[0], ft[1]);
    }
  }
  function Hs() {
    this.__data__ = [];
  }
  function ur(w) {
    var M = this.__data__, R = Wn(M, w);
    if (R < 0)
      return !1;
    var ft = M.length - 1;
    return R == ft ? M.pop() : gt.call(M, R, 1), !0;
  }
  function On(w) {
    var M = this.__data__, R = Wn(M, w);
    return R < 0 ? void 0 : M[R][1];
  }
  function Wr(w) {
    return Wn(this.__data__, w) > -1;
  }
  function xe(w, M) {
    var R = this.__data__, ft = Wn(R, w);
    return ft < 0 ? R.push([w, M]) : R[ft][1] = M, this;
  }
  sn.prototype.clear = Hs, sn.prototype.delete = ur, sn.prototype.get = On, sn.prototype.has = Wr, sn.prototype.set = xe;
  function mn(w) {
    var M = -1, R = w ? w.length : 0;
    for (this.clear(); ++M < R; ) {
      var ft = w[M];
      this.set(ft[0], ft[1]);
    }
  }
  function Ds() {
    this.__data__ = {
      hash: new qn(),
      map: new (Kt || sn)(),
      string: new qn()
    };
  }
  function Mo(w) {
    return z(this, w).delete(w);
  }
  function No(w) {
    return z(this, w).get(w);
  }
  function Fs(w) {
    return z(this, w).has(w);
  }
  function js(w, M) {
    return z(this, w).set(w, M), this;
  }
  mn.prototype.clear = Ds, mn.prototype.delete = Mo, mn.prototype.get = No, mn.prototype.has = Fs, mn.prototype.set = js;
  function fr(w) {
    this.__data__ = new sn(w);
  }
  function In() {
    this.__data__ = new sn();
  }
  function Mi(w) {
    return this.__data__.delete(w);
  }
  function Ni(w) {
    return this.__data__.get(w);
  }
  function Pi(w) {
    return this.__data__.has(w);
  }
  function Zr(w, M) {
    var R = this.__data__;
    if (R instanceof sn) {
      var ft = R.__data__;
      if (!Kt || ft.length < n - 1)
        return ft.push([w, M]), this;
      R = this.__data__ = new mn(ft);
    }
    return R.set(w, M), this;
  }
  fr.prototype.clear = In, fr.prototype.delete = Mi, fr.prototype.get = Ni, fr.prototype.has = Pi, fr.prototype.set = Zr;
  function Rs(w, M) {
    var R = je(w) || ge(w) ? jt(w.length, String) : [], ft = R.length, Ne = !!ft;
    for (var ze in w)
      Fe.call(w, ze) && !(Ne && (ze == "length" || H(ze, ft))) && R.push(ze);
    return R;
  }
  function dr(w, M, R) {
    var ft = w[M];
    (!(Fe.call(w, M) && ke(ft, R)) || R === void 0 && !(M in w)) && (w[M] = R);
  }
  function Wn(w, M) {
    for (var R = w.length; R--; )
      if (ke(w[R][0], M))
        return R;
    return -1;
  }
  function zs(w, M) {
    return w && b(M, Fi(M), w);
  }
  function Zn(w, M, R, ft, Ne, ze, Ln) {
    var Ge;
    if (ft && (Ge = ze ? ft(w, Ne, ze, Ln) : ft(w)), Ge !== void 0)
      return Ge;
    if (!te(w))
      return w;
    var Ks = je(w);
    if (Ks) {
      if (Ge = j(w), !M)
        return f(w, Ge);
    } else {
      var Fn = A(w), ji = Fn == h || Fn == l;
      if (Gs(w))
        return Oi(w, M);
      if (Fn == S || Fn == i || ji && !ze) {
        if (kn(w))
          return ze ? w : {};
        if (Ge = Z(ji ? {} : w), !M)
          return E(w, zs(Ge, w));
      } else {
        if (!D[Fn])
          return ze ? w : {};
        Ge = dt(w, Fn, Zn, M);
      }
    }
    Ln || (Ln = new fr());
    var Ri = Ln.get(w);
    if (Ri)
      return Ri;
    if (Ln.set(w, Ge), !Ks)
      var zi = R ? d(w) : Fi(w);
    return De(zi || w, function(Gi, Jr) {
      zi && (Jr = Gi, Gi = w[Jr]), dr(Ge, Jr, Zn(Gi, M, R, ft, Jr, w, Ln));
    }), Ge;
  }
  function _i(w) {
    return te(w) ? P(w) : {};
  }
  function de(w, M, R) {
    var ft = M(w);
    return je(w) ? ft : Ht(ft, R(w));
  }
  function Ui(w) {
    return oe.call(w);
  }
  function Br(w) {
    if (!te(w) || tt(w))
      return !1;
    var M = mt(w) || kn(w) ? pe : $t;
    return M.test(bt(w));
  }
  function Hn(w) {
    if (!ht(w))
      return ye(w);
    var M = [];
    for (var R in Object(w))
      Fe.call(w, R) && R != "constructor" && M.push(R);
    return M;
  }
  function Oi(w, M) {
    if (M)
      return w.slice();
    var R = new w.constructor(w.length);
    return w.copy(R), R;
  }
  function Dn(w) {
    var M = new w.constructor(w.byteLength);
    return new I(M).set(new I(w)), M;
  }
  function ve(w, M) {
    var R = M ? Dn(w.buffer) : w.buffer;
    return new w.constructor(R, w.byteOffset, w.byteLength);
  }
  function Hi(w, M, R) {
    var ft = M ? R(wn(w), !0) : wn(w);
    return Lt(ft, Gt, new w.constructor());
  }
  function Di(w) {
    var M = new w.constructor(w.source, W.exec(w));
    return M.lastIndex = w.lastIndex, M;
  }
  function Mr(w, M, R) {
    var ft = M ? R(qe(w), !0) : qe(w);
    return Lt(ft, vt, new w.constructor());
  }
  function Qr(w) {
    return qr ? Object(qr.call(w)) : {};
  }
  function Nr(w, M) {
    var R = M ? Dn(w.buffer) : w.buffer;
    return new w.constructor(R, w.byteOffset, w.length);
  }
  function f(w, M) {
    var R = -1, ft = w.length;
    for (M || (M = Array(ft)); ++R < ft; )
      M[R] = w[R];
    return M;
  }
  function b(w, M, R, ft) {
    R || (R = {});
    for (var Ne = -1, ze = M.length; ++Ne < ze; ) {
      var Ln = M[Ne], Ge = void 0;
      dr(R, Ln, Ge === void 0 ? w[Ln] : Ge);
    }
    return R;
  }
  function E(w, M) {
    return b(w, p(w), M);
  }
  function d(w) {
    return de(w, Fi, p);
  }
  function z(w, M) {
    var R = w.__data__;
    return at(M) ? R[typeof M == "string" ? "string" : "hash"] : R.map;
  }
  function ut(w, M) {
    var R = le(w, M);
    return Br(R) ? R : void 0;
  }
  var p = wt ? Te(wt, Object) : xa, A = Ui;
  (Rt && A(new Rt(new ArrayBuffer(1))) != Y || Kt && A(new Kt()) != y || re && A(re.resolve()) != v || At && A(new At()) != O || Yt && A(new Yt()) != C) && (A = function(w) {
    var M = oe.call(w), R = M == S ? w.constructor : void 0, ft = R ? bt(R) : void 0;
    if (ft)
      switch (ft) {
        case Wt:
          return Y;
        case ue:
          return y;
        case Be:
          return v;
        case fe:
          return O;
        case rn:
          return C;
      }
    return M;
  });
  function j(w) {
    var M = w.length, R = w.constructor(M);
    return M && typeof w[0] == "string" && Fe.call(w, "index") && (R.index = w.index, R.input = w.input), R;
  }
  function Z(w) {
    return typeof w.constructor == "function" && !ht(w) ? _i(x(w)) : {};
  }
  function dt(w, M, R, ft) {
    var Ne = w.constructor;
    switch (M) {
      case _:
        return Dn(w);
      case a:
      case c:
        return new Ne(+w);
      case Y:
        return ve(w, ft);
      case rt:
      case X:
      case q:
      case $:
      case U:
      case m:
      case N:
      case K:
      case B:
        return Nr(w, ft);
      case y:
        return Hi(w, ft, R);
      case g:
      case F:
        return new Ne(w);
      case T:
        return Di(w);
      case O:
        return Mr(w, ft, R);
      case k:
        return Qr(w);
    }
  }
  function H(w, M) {
    return M = M ?? s, !!M && (typeof w == "number" || L.test(w)) && w > -1 && w % 1 == 0 && w < M;
  }
  function at(w) {
    var M = typeof w;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? w !== "__proto__" : w === null;
  }
  function tt(w) {
    return !!Ye && Ye in w;
  }
  function ht(w) {
    var M = w && w.constructor, R = typeof M == "function" && M.prototype || Re;
    return w === R;
  }
  function bt(w) {
    if (w != null) {
      try {
        return nn.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function Zt(w) {
    return Zn(w, !0, !0);
  }
  function ke(w, M) {
    return w === M || w !== w && M !== M;
  }
  function ge(w) {
    return ma(w) && Fe.call(w, "callee") && (!G.call(w, "callee") || oe.call(w) == i);
  }
  var je = Array.isArray;
  function Ze(w) {
    return w != null && Jt(w.length) && !mt(w);
  }
  function ma(w) {
    return xn(w) && Ze(w);
  }
  var Gs = qt || Sa;
  function mt(w) {
    var M = te(w) ? oe.call(w) : "";
    return M == h || M == l;
  }
  function Jt(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function te(w) {
    var M = typeof w;
    return !!w && (M == "object" || M == "function");
  }
  function xn(w) {
    return !!w && typeof w == "object";
  }
  function Fi(w) {
    return Ze(w) ? Rs(w) : Hn(w);
  }
  function xa() {
    return [];
  }
  function Sa() {
    return !1;
  }
  t.exports = Zt;
})(Ac, Ac.exports);
var gS = Ac.exports;
const ty = /* @__PURE__ */ $p(gS);
var hu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(hu || (hu = {}));
function yS(t, e) {
  return { type: hu.Address, version: t, hash160: e };
}
function wS(t) {
  return Ii.c32address(t.version, t.hash160);
}
const bS = (t) => Rx(Vg(t)), mS = (t) => yt(bS(t));
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Gg.create(Vg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function xS(t, e = "mainnet") {
  e = Fg(e), t = typeof t == "string" ? Vt(t) : t;
  const n = Px(Dr.P2PKH, e), r = yS(n, mS(t));
  return wS(r);
}
function SS(t, e) {
  const n = tn.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = xS(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new tn.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function ES(t, e = null) {
  let n;
  e ? n = SS(t, e) : n = tn.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Nh = "_blockstackDidCheckEchoReply", AS = "echoReply", vS = "authContinuation";
function kS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function $S() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Nh];
  if (typeof e == "boolean")
    return e;
  const n = kS(t.location.search), r = n[AS];
  if (r) {
    t[Nh] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[vS];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class pu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new _p();
    else
      throw new Kb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ph(e.sessionOptions) : this.store = new ph() : e ? this.store = new hh(e.sessionOptions) : this.store = new hh();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Yb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new tu("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, fx(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = ux();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = lf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if ($S())
        return Ji.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ji.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = ym()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new va("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = tn.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await yx(e))
      throw new va("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (xl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await fh(s, i.private_key);
          } catch {
            if (Ji.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ce.isValidPrivateKey(i.private_key))
              throw new va("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await fh(s, c);
          } catch {
            Ji.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new va("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = im, h;
    xl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), xl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Og(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: h
    }, y = i.profile_url;
    if (!l.profile && y) {
      const g = await n(y);
      if (!g.ok)
        l.profile = Object.assign({}, Rb);
      else {
        const S = await g.text(), v = JSON.parse(S);
        l.profile = ES(v[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new tu("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), i2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), o2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
pu.prototype.makeAuthRequest = pu.prototype.makeAuthRequestToken;
const IS = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], LS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = IS(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!nl(r.id));
  return e.concat(n);
}, nl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ey = "STX_PROVIDER", fi = () => typeof window > "u" ? null : window.localStorage.getItem(ey), CS = (t) => {
  typeof window < "u" && window.localStorage.setItem(ey, t);
}, TS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function BS(t, e) {
  const n = {};
  return Object.assign(n, TS, e), await fetch(t, n);
}
function MS(t) {
  let e = BS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function NS(...t) {
  const { fetchLib: e, middlewares: n } = MS(t);
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
var wo;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(wo || (wo = {}));
var di;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(di || (di = {}));
var Ph;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Ph || (Ph = {}));
const PS = "https://api.mainnet.hiro.so", _S = "https://api.testnet.hiro.so", US = "http://localhost:3999", OS = ["mainnet", "testnet", "devnet", "mocknet"];
class hi {
  constructor(e) {
    this.version = di.Mainnet, this.chainId = wo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === di.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? NS();
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
hi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new gu();
    case "testnet":
      return new yu();
    case "devnet":
      return new HS();
    case "mocknet":
      return new ny();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${OS.join(", ")}`);
  }
};
hi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : hi.fromName(t);
class gu extends hi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? PS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = di.Mainnet, this.chainId = wo.Mainnet;
  }
}
class yu extends hi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _S,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = di.Testnet, this.chainId = wo.Testnet;
  }
}
class ny extends hi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? US,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = di.Testnet, this.chainId = wo.Testnet;
  }
}
const HS = ny;
var pi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(pi || (pi = {}));
var vc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vc || (vc = {}));
pi.Mainnet;
var gi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gi || (gi = {}));
var yi;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(yi || (yi = {}));
gi.Mainnet;
const DS = {
  chainId: pi.Mainnet,
  transactionVersion: gi.Mainnet,
  peerNetworkId: vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: yi.MainnetSingleSig,
    multiSig: yi.MainnetMultiSig
  },
  client: { baseUrl: Mp }
}, wu = {
  chainId: pi.Testnet,
  transactionVersion: gi.Testnet,
  peerNetworkId: vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: yi.TestnetSingleSig,
    multiSig: yi.TestnetMultiSig
  },
  client: { baseUrl: Np }
}, oc = {
  ...wu,
  addressVersion: { ...wu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Pp }
}, FS = {
  ...oc,
  addressVersion: { ...oc.addressVersion },
  client: { ...oc.client }
};
function jS(t) {
  switch (t) {
    case "mainnet":
      return DS;
    case "testnet":
      return wu;
    case "devnet":
      return oc;
    case "mocknet":
      return FS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function RS(t) {
  return typeof t == "string" ? jS(t) : t;
}
function zS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const _h = /* @__PURE__ */ new Map();
function ry(t, e) {
  const n = _h.get(t);
  if (n !== void 0)
    return n(e);
  const r = zS(t);
  return _h.set(t, r), ry(t, e);
}
let he = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Vt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return dm(this.readBytes(4), 0);
  }
  readUInt8() {
    return um(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return cm(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = yt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = yt(n);
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
    if (ry(e, r))
      return r;
    throw n(r);
  }
};
const GS = 128, KS = 128, sy = 16, ni = 32, bu = 80, rl = 65, VS = 32, YS = 64, kc = 34, XS = 1 + 16 * 1024 * 1024, qS = 165, WS = 16, ZS = 16, QS = 20, JS = ZS + 2 + QS, tE = JS + 4, eE = XS + (qS + WS * tE);
var ee;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(ee || (ee = {}));
var mu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(mu || (mu = {}));
var Tn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tn || (Tn = {}));
const Il = ["onChainOnly", "offChainOnly", "any"];
Il[0] + "", Tn.OnChainOnly, Il[1] + "", Tn.OffChainOnly, Il[2] + "", Tn.Any, Tn.OnChainOnly + "", Tn.OnChainOnly, Tn.OffChainOnly + "", Tn.OffChainOnly, Tn.Any + "", Tn.Any;
var $c;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})($c || ($c = {}));
var we;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(we || (we = {}));
var Ie;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ie || (Ie = {}));
var ae;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ae || (ae = {}));
var Ee;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ee || (Ee = {}));
var Xo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Xo || (Xo = {}));
var xu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(xu || (xu = {}));
var Su;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Su || (Su = {}));
var pn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(pn || (pn = {}));
var Uh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Uh || (Uh = {}));
var Eu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Eu || (Eu = {}));
var rr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(rr || (rr = {}));
var Oh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Oh || (Oh = {}));
let sl = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, to = class extends sl {
  constructor(e) {
    super(e);
  }
}, dn = class extends sl {
  constructor(e) {
    super(e);
  }
}, Ic = class extends sl {
  constructor(e) {
    super(e);
  }
}, Qs = class extends sl {
  constructor(e) {
    super(e);
  }
};
function Au(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function nE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function iy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Au(t.outputLen), Au(t.blockLen);
}
function sE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function iE(t, e) {
  iy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Js = {
  number: Au,
  bool: nE,
  bytes: iy,
  hash: rE,
  exists: sE,
  output: iE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ll = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, oE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!oE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function aE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Tf(t) {
  if (typeof t == "string" && (t = aE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let oy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Li(t) {
  const e = (r) => t().update(Tf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let ay = class extends oy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Js.hash(e);
    const r = Tf(n);
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
    return Js.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Js.exists(this), Js.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const cy = (t, e, n) => new ay(t, e).update(n).digest();
cy.create = (t, e) => new ay(t, e);
function cE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Bf = class extends oy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ll(this.buffer);
  }
  update(e) {
    Js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Tf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ll(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Js.exists(this), Js.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    cE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ll(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const lE = (t, e, n) => t & e ^ ~t & n, uE = (t, e, n) => t & e ^ t & n ^ e & n, fE = new Uint32Array([
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
]), hs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ps = new Uint32Array(64);
let ly = class extends Bf {
  constructor() {
    super(64, 32, 8, !1), this.A = hs[0] | 0, this.B = hs[1] | 0, this.C = hs[2] | 0, this.D = hs[3] | 0, this.E = hs[4] | 0, this.F = hs[5] | 0, this.G = hs[6] | 0, this.H = hs[7] | 0;
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
      ps[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ps[l - 15], g = ps[l - 2], S = gr(y, 7) ^ gr(y, 18) ^ y >>> 3, v = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      ps[l] = v + ps[l - 7] + S + ps[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = h + y + lE(a, c, u) + fE[l] + ps[l] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + uE(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ps.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, dE = class extends ly {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mf = Li(() => new ly());
Li(() => new dE());
const hE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), uy = Uint8Array.from({ length: 16 }, (t, e) => e), pE = uy.map((t) => (9 * t + 5) % 16);
let Nf = [uy], Pf = [pE];
for (let t = 0; t < 4; t++)
  for (let e of [Nf, Pf])
    e.push(e[t].map((n) => hE[n]));
const fy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), gE = Nf.map((t, e) => t.map((n) => fy[e][n])), yE = Pf.map((t, e) => t.map((n) => fy[e][n])), wE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), bE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oa = (t, e) => t << e | t >>> 32 - e;
function Hh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ha = new Uint32Array(16);
let mE = class extends Bf {
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
    for (let g = 0; g < 16; g++, n += 4)
      Ha[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const S = 4 - g, v = wE[g], T = bE[g], O = Nf[g], F = Pf[g], k = gE[g], C = yE[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Oa(r + Hh(g, i, a, u) + Ha[O[_]] + v, k[_]) + l | 0;
        r = l, l = u, u = Oa(a, 10) | 0, a = i, i = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Oa(s + Hh(S, o, c, h) + Ha[F[_]] + T, C[_]) + y | 0;
        s = y, y = h, h = Oa(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ha.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const xE = Li(() => new mE()), Da = BigInt(2 ** 32 - 1), vu = BigInt(32);
function dy(t, e = !1) {
  return e ? { h: Number(t & Da), l: Number(t >> vu & Da) } : { h: Number(t >> vu & Da) | 0, l: Number(t & Da) | 0 };
}
function SE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = dy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const EE = (t, e) => BigInt(t >>> 0) << vu | BigInt(e >>> 0), AE = (t, e, n) => t >>> n, vE = (t, e, n) => t << 32 - n | e >>> n, kE = (t, e, n) => t >>> n | e << 32 - n, $E = (t, e, n) => t << 32 - n | e >>> n, IE = (t, e, n) => t << 64 - n | e >>> n - 32, LE = (t, e, n) => t >>> n - 32 | e << 64 - n, CE = (t, e) => e, TE = (t, e) => t, BE = (t, e, n) => t << n | e >>> 32 - n, ME = (t, e, n) => e << n | t >>> 32 - n, NE = (t, e, n) => e << n - 32 | t >>> 64 - n, PE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _E(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const UE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), OE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, HE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), DE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, FE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), jE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: dy,
  split: SE,
  toBig: EE,
  shrSH: AE,
  shrSL: vE,
  rotrSH: kE,
  rotrSL: $E,
  rotrBH: IE,
  rotrBL: LE,
  rotr32H: CE,
  rotr32L: TE,
  rotlSH: BE,
  rotlSL: ME,
  rotlBH: NE,
  rotlBL: PE,
  add: _E,
  add3L: UE,
  add3H: OE,
  add4L: HE,
  add4H: DE,
  add5H: jE,
  add5L: FE
}, [RE, zE] = Bt.split([
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
].map((t) => BigInt(t))), gs = new Uint32Array(80), ys = new Uint32Array(80);
let il = class extends Bf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: S, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      gs[k] = e.getUint32(n), ys[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = gs[k - 15] | 0, _ = ys[k - 15] | 0, Y = Bt.rotrSH(C, _, 1) ^ Bt.rotrSH(C, _, 8) ^ Bt.shrSH(C, _, 7), rt = Bt.rotrSL(C, _, 1) ^ Bt.rotrSL(C, _, 8) ^ Bt.shrSL(C, _, 7), X = gs[k - 2] | 0, q = ys[k - 2] | 0, $ = Bt.rotrSH(X, q, 19) ^ Bt.rotrBH(X, q, 61) ^ Bt.shrSH(X, q, 6), U = Bt.rotrSL(X, q, 19) ^ Bt.rotrBL(X, q, 61) ^ Bt.shrSL(X, q, 6), m = Bt.add4L(rt, U, ys[k - 7], ys[k - 16]), N = Bt.add4H(m, Y, $, gs[k - 7], gs[k - 16]);
      gs[k] = N | 0, ys[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: O, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), _ = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, rt = y & S ^ ~y & T, X = Bt.add5L(F, _, rt, zE[k], ys[k]), q = Bt.add5H(X, O, C, Y, RE[k], gs[k]), $ = X | 0, U = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), m = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), N = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      O = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Bt.add(u | 0, h | 0, q | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Bt.add3L($, m, K);
      r = Bt.add3H(B, q, U, N), s = B | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Bt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Bt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: O, l: F } = Bt.add(this.Hh | 0, this.Hl | 0, O | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, O, F);
  }
  roundClean() {
    gs.fill(0), ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, GE = class extends il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, KE = class extends il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, VE = class extends il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Li(() => new il());
Li(() => new GE());
const YE = Li(() => new KE());
Li(() => new VE());
var Ft;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ft || (Ft = {}));
var Ke;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ke || (Ke = {}));
function _f(t) {
  return Ke[t];
}
const XE = () => ({ type: Ft.BoolTrue }), qE = () => ({ type: Ft.BoolFalse }), WE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ft.Buffer, value: yt(t) };
}, Dh = BigInt("0xffffffffffffffffffffffffffffffff"), ZE = BigInt(0), Fh = BigInt("0x7fffffffffffffffffffffffffffffff"), jh = BigInt("-170141183460469231731687303715884105728"), QE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = nu(Vt(t))), vn(t, Uint8Array) && (t = nu(t));
  const e = un(t);
  if (e > Fh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Fh}`);
  if (e < jh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${jh}`);
  return { type: Ft.Int, value: e };
}, JE = (t) => {
  const e = un(t);
  if (e < ZE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Dh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Dh}`);
  return { type: Ft.UInt, value: e };
};
function tA(t) {
  return { type: Ft.List, value: t };
}
function hy() {
  return { type: Ft.OptionalNone };
}
function py(t) {
  return { type: Ft.OptionalSome, value: t };
}
var st;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(st || (st = {}));
function eA() {
  return {
    type: st.Address,
    version: yi.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Rh(t) {
  if (t && Ay(t, kc))
    throw new Error(`Memo exceeds maximum length of ${kc} bytes`);
  return { type: st.MemoString, content: t };
}
function Uf(t, e) {
  return {
    type: st.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function ku(t) {
  if (Vt(t).byteLength != rl)
    throw Error("Invalid signature");
  return {
    type: st.MessageSignature,
    data: t
  };
}
function nA(t, e, n) {
  return typeof t == "string" && (t = bA(t)), typeof n == "string" && (n = Rh(n)), {
    type: st.Payload,
    payloadType: ee.TokenTransfer,
    recipient: t,
    amount: un(e),
    memo: n ?? Rh("")
  };
}
function rA(t, e, n, r) {
  return typeof e == "string" && (e = or(e)), typeof n == "string" && (n = or(n)), {
    type: st.Payload,
    payloadType: ee.ContractCall,
    contractAddress: typeof t == "string" ? Us(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function sA(t) {
  return or(t, 4, 1e5);
}
function zh(t, e, n) {
  return typeof t == "string" && (t = or(t)), typeof e == "string" && (e = sA(e)), typeof n == "number" ? {
    type: st.Payload,
    payloadType: ee.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: st.Payload,
    payloadType: ee.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function iA() {
  return { type: st.Payload, payloadType: ee.PoisonMicroblock };
}
function Gh(t, e) {
  if (t.byteLength != ni)
    throw Error(`Coinbase buffer size must be ${ni} bytes`);
  return e != null ? {
    type: st.Payload,
    payloadType: ee.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: st.Payload,
    payloadType: ee.Coinbase,
    coinbaseBytes: t
  };
}
function oA(t, e, n) {
  if (t.byteLength != ni)
    throw Error(`Coinbase buffer size must be ${ni} bytes`);
  if (n.byteLength != bu)
    throw Error(`VRF proof buffer size must be ${bu} bytes`);
  return {
    type: st.Payload,
    payloadType: ee.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ft.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function aA(t, e, n, r, s, i, o) {
  return {
    type: st.Payload,
    payloadType: ee.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function or(t, e, n) {
  const r = e || 1, s = n || GS;
  if (Ay(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: st.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function cA(t, e, n) {
  return {
    type: st.Asset,
    address: Us(t),
    contractName: or(e),
    assetName: or(n)
  };
}
function Us(t) {
  const e = Ii.c32addressDecode(t);
  return {
    type: st.Address,
    version: e[0],
    hash160: e[1]
  };
}
function lA(t, e) {
  const n = Us(t), r = or(e);
  return {
    type: st.Principal,
    prefix: pn.Contract,
    address: n,
    contractName: r
  };
}
function uA(t) {
  const e = Us(t);
  return {
    type: st.Principal,
    prefix: pn.Standard,
    address: e
  };
}
function eo(t, e) {
  return {
    pubKeyEncoding: t,
    type: st.TransactionAuthField,
    contents: e
  };
}
function Ur(t) {
  switch (t.type) {
    case st.Address:
      return ya(t);
    case st.Principal:
      return gy(t);
    case st.LengthPrefixedString:
      return mo(t);
    case st.MemoString:
      return dA(t);
    case st.Asset:
      return wy(t);
    case st.PostCondition:
      return my(t);
    case st.PublicKey:
      return Lu(t);
    case st.LengthPrefixedList:
      return Of(t);
    case st.Payload:
      return xy(t);
    case st.TransactionAuthField:
      return wA(t);
    case st.MessageSignature:
      return Hf(t);
  }
}
function ya(t) {
  const e = [];
  return e.push(Vt(ua(t.version, 1))), e.push(Vt(t.hash160)), Oe(e);
}
function bo(t) {
  const e = vn(t, he) ? t : new he(t), n = Gc(yt(e.readBytes(1))), r = yt(e.readBytes(20));
  return { type: st.Address, version: n, hash160: r };
}
function gy(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === pn.Standard || t.prefix === pn.Contract) && e.push(ya(t.address)), t.prefix === pn.Contract && e.push(mo(t.contractName)), Oe(e);
}
function fA(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(pn, (i) => {
    throw new dn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === pn.Origin)
    return { type: st.Principal, prefix: n };
  const r = bo(e);
  if (n === pn.Standard)
    return { type: st.Principal, prefix: n, address: r };
  const s = Kn(e);
  return {
    type: st.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function mo(t) {
  const e = [], n = Ai(t.content), r = n.byteLength;
  return e.push(Vt(ua(r, t.lengthPrefixBytes))), e.push(n), Oe(e);
}
function Kn(t, e, n) {
  e = e || 1;
  const r = vn(t, he) ? t : new he(t), s = Gc(yt(r.readBytes(e))), i = fa(r.readBytes(s));
  return or(i, e, n ?? 128);
}
function dA(t) {
  const e = [], n = Ai(t.content), r = FA(yt(n), kc * 2);
  return e.push(Vt(r)), Oe(e);
}
function yy(t) {
  const e = vn(t, he) ? t : new he(t);
  let n = fa(e.readBytes(kc));
  return n = n.replace(/\u0000*$/, ""), { type: st.MemoString, content: n };
}
function wy(t) {
  const e = [];
  return e.push(ya(t.address)), e.push(mo(t.contractName)), e.push(mo(t.assetName)), Oe(e);
}
function $u(t) {
  const e = vn(t, he) ? t : new he(t);
  return {
    type: st.Asset,
    address: bo(e),
    contractName: Kn(e),
    assetName: Kn(e)
  };
}
function Of(t) {
  const e = t.values, n = [];
  n.push(Vt(ua(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ur(r));
  return Oe(n);
}
function by(t, e, n) {
  const r = vn(t, he) ? t : new he(t), s = Gc(yt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case st.Address:
        i.push(bo(r));
        break;
      case st.LengthPrefixedString:
        i.push(Kn(r));
        break;
      case st.MemoString:
        i.push(yy(r));
        break;
      case st.Asset:
        i.push($u(r));
        break;
      case st.PostCondition:
        i.push(pA(r));
        break;
      case st.PublicKey:
        i.push(Cu(r));
        break;
      case st.TransactionAuthField:
        i.push(yA(r));
        break;
    }
  return Uf(i, n);
}
function hA(t) {
  return yt(my(t));
}
function my(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(gy(t.principal)), (t.conditionType === we.Fungible || t.conditionType === we.NonFungible) && e.push(wy(t.asset)), t.conditionType === we.NonFungible && e.push(Ar(t.assetName)), e.push(t.conditionCode), t.conditionType === we.STX || t.conditionType === we.Fungible || t.conditionType === we.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new to("The post-condition amount may not be larger than 8 bytes");
    e.push(Ps(t.amount, 8));
  }
  return Oe(e);
}
function pA(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(we, (a) => {
    throw new dn(`Could not read ${a} as PostConditionType`);
  }), r = fA(e);
  let s, i, o;
  switch (n) {
    case we.STX:
      return s = e.readUInt8Enum(Xo, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: we.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case we.Fungible:
      return i = $u(e), s = e.readUInt8Enum(Xo, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: we.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case we.NonFungible:
      i = $u(e);
      const a = xr(e);
      return s = e.readUInt8Enum(xu, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: st.PostCondition,
        conditionType: we.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case we.Staking:
      return s = e.readUInt8Enum(Xo, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: we.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case we.PoX: {
      const c = e.readUInt8Enum(Su, (u) => {
        throw new dn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: st.PostCondition,
        conditionType: we.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function xy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case ee.TokenTransfer:
      e.push(Ar(t.recipient)), e.push(Ps(t.amount, 8)), e.push(Ur(t.memo));
      break;
    case ee.ContractCall:
      e.push(Ur(t.contractAddress)), e.push(Ur(t.contractName)), e.push(Ur(t.functionName));
      const n = new Uint8Array(4);
      oi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ar(r));
      });
      break;
    case ee.SmartContract:
      e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case ee.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case ee.PoisonMicroblock:
      break;
    case ee.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case ee.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient));
      break;
    case ee.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient ? py(t.recipient) : hy())), e.push(t.vrfProof);
      break;
    case ee.TenureChange:
      e.push(Vt(t.tenureHash)), e.push(Vt(t.previousTenureHash)), e.push(Vt(t.burnViewHash)), e.push(Vt(t.previousTenureEnd)), e.push(oi(new Uint8Array(4), t.previousTenureBlocks)), e.push(fm(new Uint8Array(1), t.cause)), e.push(Vt(t.publicKeyHash));
      break;
  }
  return Oe(e);
}
function gA(t) {
  const e = vn(t, he) ? t : new he(t);
  switch (e.readUInt8Enum(ee, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case ee.TokenTransfer:
      const r = xr(e), s = un(e.readBytes(8)), i = yy(e);
      return nA(r, s, i);
    case ee.ContractCall:
      const o = bo(e), a = Kn(e), c = Kn(e), u = [], h = e.readUInt32BE();
      for (let C = 0; C < h; C++) {
        const _ = xr(e);
        u.push(_);
      }
      return rA(o, a, c, u);
    case ee.SmartContract:
      const l = Kn(e), y = Kn(e, 4, 1e5);
      return zh(l, y);
    case ee.VersionedSmartContract: {
      const C = e.readUInt8Enum(mu, (rt) => {
        throw new Error(`Cannot recognize ClarityVersion: ${rt}`);
      }), _ = Kn(e), Y = Kn(e, 4, eE);
      return zh(_, Y, C);
    }
    case ee.PoisonMicroblock:
      return iA();
    case ee.Coinbase: {
      const C = e.readBytes(ni);
      return Gh(C);
    }
    case ee.CoinbaseToAltRecipient: {
      const C = e.readBytes(ni), _ = xr(e);
      return Gh(C, _);
    }
    case ee.NakamotoCoinbase: {
      const C = e.readBytes(ni), _ = xr(e), Y = e.readBytes(bu);
      return oA(C, _, Y);
    }
    case ee.TenureChange:
      const g = yt(e.readBytes(20)), S = yt(e.readBytes(20)), v = yt(e.readBytes(20)), T = yt(e.readBytes(32)), O = e.readUInt32BE(), F = e.readUInt8Enum(Eu, (C) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${C}`);
      }), k = yt(e.readBytes(20));
      return aA(g, S, v, T, O, F, k);
  }
}
function Iu(t) {
  const e = vn(t, he) ? t : new he(t);
  return ku(yt(e.readBytes(rl)));
}
function yA(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(rr, (r) => {
    throw new dn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case rr.PublicKeyCompressed:
      return eo(Ee.Compressed, Cu(e));
    case rr.PublicKeyUncompressed:
      return eo(Ee.Uncompressed, Io(ZA(Cu(e).data)));
    case rr.SignatureCompressed:
      return eo(Ee.Compressed, Iu(e));
    case rr.SignatureUncompressed:
      return eo(Ee.Uncompressed, Iu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Hf(t) {
  return Vt(t.data);
}
function wA(t) {
  const e = [];
  switch (t.contents.type) {
    case st.PublicKey:
      e.push(t.pubKeyEncoding === Ee.Compressed ? rr.PublicKeyCompressed : rr.PublicKeyUncompressed), e.push(Vt(WA(t.contents.data)));
      break;
    case st.MessageSignature:
      e.push(t.pubKeyEncoding === Ee.Compressed ? rr.SignatureCompressed : rr.SignatureUncompressed), e.push(Hf(t.contents));
      break;
  }
  return Oe(e);
}
function Lu(t) {
  return t.data.slice();
}
function Cu(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8(), r = n === 4 ? YS : VS;
  return Io(Oe([n, e.readBytes(r)]));
}
function Df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ae.P2PKH || e === ae.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ae.P2WPKH || e === ae.P2WSH || e === ae.P2WSHNonSequential) && !r.map((s) => s.data).every(Lo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ae.P2PKH:
      return Fa(t, jA(r[0].data));
    case ae.P2WPKH:
      return Fa(t, RA(r[0].data));
    case ae.P2SH:
    case ae.P2SHNonSequential:
      return Fa(t, zA(n, r.map(Lu)));
    case ae.P2WSH:
    case ae.P2WSHNonSequential:
      return Fa(t, GA(n, r.map(Lu)));
  }
}
function Fa(t, e) {
  return { type: st.Address, version: t, hash160: e };
}
function Ff(t) {
  return Ii.c32address(t.version, t.hash160);
}
function Kh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return cA(e, n, r);
}
function Oo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return lA(e, n);
  } else
    return uA(t);
}
function bA(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return SA(e, n);
  } else
    return mA(t);
}
function mA(t) {
  const e = Us(t);
  return { type: Ft.PrincipalStandard, value: Ff(e) };
}
function xA(t) {
  return { type: Ft.PrincipalStandard, value: Ff(t) };
}
function SA(t, e) {
  const n = Us(t), r = or(e);
  return Sy(n, r);
}
function Sy(t, e) {
  if (Ai(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ft.PrincipalContract,
    value: `${Ff(t)}.${e.content}`
  };
}
function EA(t) {
  return { type: Ft.ResponseErr, value: t };
}
function AA(t) {
  return { type: Ft.ResponseOk, value: t };
}
const vA = (t) => ({ type: Ft.StringASCII, value: t }), kA = (t) => ({ type: Ft.StringUTF8, value: t });
function $A(t) {
  for (const e in t)
    if (!KA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ft.Tuple, value: t };
}
function xr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new he(Vt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new he(t) : e = t;
  switch (e.readUInt8Enum(Ke, (r) => {
    throw new dn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ke.int:
      return QE(nu(e.readBytes(16)));
    case Ke.uint:
      return JE(e.readBytes(16));
    case Ke.buffer:
      const r = e.readUInt32BE();
      return WE(e.readBytes(r));
    case Ke.true:
      return XE();
    case Ke.false:
      return qE();
    case Ke.address:
      const s = bo(e);
      return xA(s);
    case Ke.contract:
      const i = bo(e), o = Kn(e);
      return Sy(i, o);
    case Ke.ok:
      return AA(xr(e));
    case Ke.err:
      return EA(xr(e));
    case Ke.none:
      return hy();
    case Ke.some:
      return py(xr(e));
    case Ke.list:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(xr(e));
      return tA(c);
    case Ke.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Kn(e).content;
        if (T === void 0)
          throw new dn('"content" is undefined');
        h[T] = xr(e);
      }
      return $A(h);
    case Ke.ascii:
      const l = e.readUInt32BE(), y = rm(e.readBytes(l));
      return vA(y);
    case Ke.utf8:
      const g = e.readUInt32BE(), S = fa(e.readBytes(g));
      return kA(S);
    default:
      throw new dn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Lr(t, e) {
  return Oe([_f(t), e]);
}
function IA(t) {
  return new Uint8Array([_f(t.type)]);
}
function LA(t) {
  return t.type === Ft.OptionalNone ? new Uint8Array([_f(t.type)]) : Lr(t.type, Ar(t.value));
}
function CA(t) {
  const e = new Uint8Array(4);
  return oi(e, Math.ceil(t.value.length / 2), 0), Lr(t.type, $r(e, Vt(t.value)));
}
function TA(t) {
  const e = uf(Qb(BigInt(t.value), BigInt(KS)), sy);
  return Lr(t.type, e);
}
function BA(t) {
  const e = uf(BigInt(t.value), sy);
  return Lr(t.type, e);
}
function MA(t) {
  return Lr(t.type, ya(Us(t.value)));
}
function NA(t) {
  const [e, n] = VA(t.value);
  return Lr(t.type, $r(ya(Us(e)), mo(or(n))));
}
function PA(t) {
  return Lr(t.type, Ar(t.value));
}
function _A(t) {
  const e = [], n = new Uint8Array(4);
  oi(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ar(r);
    e.push(s);
  }
  return Lr(t.type, Oe(e));
}
function UA(t) {
  const e = [], n = new Uint8Array(4);
  oi(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = or(s);
    e.push(mo(i));
    const o = Ar(t.value[s]);
    e.push(o);
  }
  return Lr(t.type, Oe(e));
}
function Ey(t, e) {
  const n = [], r = e == "ascii" ? nm(t.value) : Ai(t.value), s = new Uint8Array(4);
  return oi(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, Oe(n));
}
function OA(t) {
  return Ey(t, "ascii");
}
function HA(t) {
  return Ey(t, "utf8");
}
function Vh(t) {
  return yt(Ar(t));
}
function Ar(t) {
  switch (t.type) {
    case Ft.BoolTrue:
    case Ft.BoolFalse:
      return IA(t);
    case Ft.OptionalNone:
    case Ft.OptionalSome:
      return LA(t);
    case Ft.Buffer:
      return CA(t);
    case Ft.UInt:
      return BA(t);
    case Ft.Int:
      return TA(t);
    case Ft.PrincipalStandard:
      return MA(t);
    case Ft.PrincipalContract:
      return NA(t);
    case Ft.ResponseOk:
    case Ft.ResponseErr:
      return PA(t);
    case Ft.List:
      return _A(t);
    case Ft.Tuple:
      return UA(t);
    case Ft.StringASCII:
      return OA(t);
    case Ft.StringUTF8:
      return HA(t);
    default:
      throw new to("Unable to serialize. Invalid Clarity Value.");
  }
}
const DA = (t) => t.length % 2 ? `0${t}` : t, FA = (t, e) => t.padEnd(e, "0"), Ay = (t, e) => t ? Ai(t).length > e : !1;
function Tu(t) {
  return ty(t);
}
const ta = (t) => xE(Mf(t)), jf = (t) => yt(YE(t)), jA = (t) => yt(ta(t)), RA = (t) => {
  const e = ta(t), n = $r(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ta(n);
  return yt(r);
}, zA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Oe(n), s = ta(r);
  return yt(s);
}, GA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Oe(n), s = Mf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Oe(i), a = ta(o);
  return yt(a);
};
function KA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function VA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = cy.create(Mf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Io(t) {
  return t = typeof t == "string" ? Vt(t) : t, {
    type: st.PublicKey,
    data: t
  };
}
function YA(t, e, n = Ee.Compressed) {
  const r = am(e), s = new Pn(Vd(r.r), Vd(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === Ee.Compressed;
  return i.toHex(o);
}
function XA(t) {
  return typeof t == "string" ? t : yt(t);
}
const Rf = XA;
function vy(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === om;
}
function Lo(t) {
  return !Rf(t).startsWith("04");
}
function qA(t) {
  t = ff(t);
  const e = vy(t);
  return yt(da(t.slice(0, 32), e));
}
function WA(t) {
  return Ut.fromHex(Rf(t)).toHex(!0);
}
function ZA(t) {
  return Ut.fromHex(Rf(t)).toHex(!1);
}
function QA(t, e) {
  t = ff(t);
  const [n, r] = Vc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ua(r, 1) + Pn.fromHex(n).toCompactHex();
}
function zf() {
  return {
    type: st.MessageSignature,
    data: yt(new Uint8Array(rl))
  };
}
function ky(t, e, n, r) {
  const s = Df(0, t, 1, [Io(e)]).hash160, i = Lo(e) ? Ee.Compressed : Ee.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: un(n),
    fee: un(r),
    keyEncoding: i,
    signature: zf()
  };
}
function ea(t) {
  return "signature" in t;
}
function Yh(t) {
  return t === ae.P2SH || t === ae.P2WSH;
}
function JA(t) {
  return t === ae.P2SHNonSequential || t === ae.P2WSHNonSequential;
}
function Xh(t) {
  const e = Tu(t);
  return e.nonce = 0, e.fee = 0, ea(e) ? e.signature = zf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function t3(t) {
  const e = [
    t.hashMode,
    Vt(t.signer),
    Ps(t.nonce, 8),
    Ps(t.fee, 8),
    t.keyEncoding,
    Hf(t.signature)
  ];
  return Oe(e);
}
function e3(t) {
  const e = [
    t.hashMode,
    Vt(t.signer),
    Ps(t.nonce, 8),
    Ps(t.fee, 8)
  ], n = Uf(t.fields);
  e.push(Of(n));
  const r = new Uint8Array(2);
  return lm(r, t.signaturesRequired, 0), e.push(r), Oe(e);
}
function n3(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt(`0x${yt(e.readBytes(8))}`), s = BigInt(`0x${yt(e.readBytes(8))}`), i = e.readUInt8Enum(Ee, (a) => {
    throw new dn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ae.P2WPKH && i != Ee.Compressed)
    throw new dn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Iu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function r3(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt("0x" + yt(e.readBytes(8))), s = BigInt("0x" + yt(e.readBytes(8))), i = by(e, st.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case st.PublicKey:
        Lo(u.contents.data) || (o = !0);
        break;
      case st.MessageSignature:
        if (u.pubKeyEncoding === Ee.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Qs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ae.P2WSH || t === ae.P2WSHNonSequential))
    throw new Qs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Cl(t) {
  return ea(t) ? t3(t) : e3(t);
}
function Tl(t) {
  const e = t.readUInt8Enum(ae, (n) => {
    throw new dn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ae.P2PKH || e === ae.P2WPKH ? n3(e, t) : r3(e, t);
}
function $y(t, e, n, r) {
  const i = t + yt(new Uint8Array([e])) + yt(Ps(n, 8)) + yt(Ps(r, 8));
  if (Vt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return jf(Vt(i));
}
function Iy(t, e, n) {
  const r = 33 + rl, s = Lo(e.data) ? Ee.Compressed : Ee.Uncompressed, i = t + DA(s.toString(16)) + n, o = Vt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return jf(o);
}
function s3(t, e, n, r, s) {
  const i = $y(t, e, n, r), o = QA(s, i), a = Io(qA(s)), c = Iy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ly(t, e, n, r, s, i) {
  const o = $y(t, e, n, r), a = Io(YA(o, i, s)), c = Iy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function i3() {
  const t = ky(ae.P2PKH, "", 0, 0);
  return t.signer = eA().hash160, t.keyEncoding = Ee.Compressed, t.signature = zf(), t;
}
function qh(t, e, n) {
  return ea(t) ? o3(t, e, n) : a3(t, e, n);
}
function o3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ly(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Df(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Qs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function a3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case st.PublicKey:
        Lo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case st.MessageSignature:
        c.pubKeyEncoding === Ee.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Ly(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Yh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new Qs("Too many signatures");
        break;
    }
  if (Yh(t.hashMode) && o !== t.signaturesRequired || JA(t.hashMode) && o < t.signaturesRequired)
    throw new Qs("Incorrect number of signatures");
  if (i && (t.hashMode === ae.P2WSH || t.hashMode === ae.P2WSHNonSequential))
    throw new Qs("Uncompressed keys are not allowed in this hash mode");
  const a = Df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Qs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Cy(t) {
  return {
    authType: Ie.Standard,
    spendingCondition: t
  };
}
function Ty(t, e) {
  return {
    authType: Ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || ky(ae.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Wh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ie.Standard:
        return Cy(Xh(t.spendingCondition));
      case Ie.Sponsored:
        return Ty(Xh(t.spendingCondition), i3());
      default:
        throw new Ic("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function c3(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      return qh(t.spendingCondition, e, Ie.Standard);
    case Ie.Sponsored:
      return qh(t.spendingCondition, e, Ie.Standard);
    default:
      throw new Ic("Invalid origin auth type");
  }
}
function l3(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      const n = {
        ...t.spendingCondition,
        fee: un(e)
      };
      return { ...t, spendingCondition: n };
    case Ie.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: un(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function u3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: un(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function f3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: un(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function d3(t, e) {
  const n = {
    ...e,
    nonce: un(e.nonce),
    fee: un(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function h3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ie.Standard:
      e.push(Cl(t.spendingCondition));
      break;
    case Ie.Sponsored:
      e.push(Cl(t.spendingCondition)), e.push(Cl(t.sponsorSpendingCondition));
      break;
  }
  return Oe(e);
}
function p3(t) {
  const e = t.readUInt8Enum(Ie, (r) => {
    throw new dn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ie.Standard:
      return n = Tl(t), Cy(n);
    case Ie.Sponsored:
      n = Tl(t);
      const r = Tl(t);
      return Ty(n, r);
  }
}
class g3 {
  constructor({ auth: e, payload: n, postConditions: r = Uf([]), postConditionMode: s = $c.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = RS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: un(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Tn.Any;
  }
  signBegin() {
    const e = Tu(this);
    return e.auth = Wh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Tu(this);
    return e.auth = Wh(e.auth), e.txid();
  }
  verifyOrigin() {
    return c3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : Io(e), r = this.auth.spendingCondition;
    if (r && !ea(r)) {
      const s = Lo(n.data);
      r.fields.push(eo(s ? Ee.Compressed : Ee.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = s3(n, r, e.fee, e.nonce, s);
    if (ea(e))
      e.signature = ku(i);
    else {
      const a = vy(s);
      e.fields.push(eo(a ? Ee.Compressed : Ee.Uncompressed, ku(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return jf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d3(this.auth, e);
  }
  setFee(e) {
    this.auth = l3(this.auth, e);
  }
  setNonce(e) {
    this.auth = u3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = f3(this.auth, e);
  }
  serialize() {
    return yt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new to('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new to('"chainId" is undefined');
    if (this.auth === void 0)
      throw new to('"auth" is undefined');
    if (this.payload === void 0)
      throw new to('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return oi(n, this.chainId, 0), e.push(n), e.push(h3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Of(this.postConditions)), e.push(xy(this.payload)), Oe(e);
  }
}
function y3(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(gi, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = p3(e), i = e.readUInt8Enum(Tn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum($c, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = by(e, st.PostCondition), c = gA(e), u = new g3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Zh = BigInt("18446744073709551615");
function Bl(t) {
  const e = un(t);
  if (e < 0n || e > Zh)
    throw new RangeError(`Post-condition amount must be between 0 and ${Zh} (u64 max), received: ${e}`);
  return e;
}
var Bu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Bu || (Bu = {}));
var Mu;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Mu || (Mu = {}));
function w3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: st.PostCondition,
        conditionType: we.STX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Bl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: we.Fungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Bl(t.amount),
        asset: Kh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: we.NonFungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        asset: Kh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: st.PostCondition,
        conditionType: we.Staking,
        principal: t.address === "origin" ? { type: st.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Bl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: st.PostCondition,
        conditionType: we.PoX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: b3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ja(t) {
  return Bu[t];
}
function b3(t) {
  return Mu[t];
}
function By(t) {
  const e = w3(t);
  return hA(e);
}
function m3(t, e, n) {
  return Kf(My(t), n);
}
function My(t, e) {
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
    return BigInt(`0x${E3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gf(t, e = 8) {
  return (typeof t == "bigint" ? t : My(t)).toString(16).padStart(e * 2, "0");
}
function Kf(t, e = 16) {
  const n = Gf(t, e);
  return na(n);
}
function x3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const S3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function E3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += S3[n];
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
function Vf(t) {
  return new TextEncoder().encode(t);
}
function A3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function v3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Qh(t) {
  if (t.some(v3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Yf(...t) {
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
function Xr(t) {
  return Yf(...t.map((e) => typeof e == "number" ? Qh([e]) : e instanceof Array ? Qh(e) : e));
}
function ol(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Nu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nu || (Nu = {}));
Nu.Mainnet;
const k3 = 128, $3 = 128, Ny = 16;
var Pu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Pu || (Pu = {}));
var Jh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Jh || (Jh = {}));
var t0;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(t0 || (t0 = {}));
var er;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(er || (er = {}));
const Ml = ["onChainOnly", "offChainOnly", "any"];
Ml[0] + "", er.OnChainOnly, Ml[1] + "", er.OffChainOnly, Ml[2] + "", er.Any, er.OnChainOnly + "", er.OnChainOnly, er.OffChainOnly + "", er.OffChainOnly, er.Any + "", er.Any;
var _u;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_u || (_u = {}));
_u.Mainnet;
var e0;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(e0 || (e0 = {}));
var Xs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Xs || (Xs = {}));
var n0;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(n0 || (n0 = {}));
var r0;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(r0 || (r0 = {}));
var s0;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(s0 || (s0 = {}));
var i0;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(i0 || (i0 = {}));
var o0;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(o0 || (o0 = {}));
var a0;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(a0 || (a0 = {}));
var Uu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Uu || (Uu = {}));
var c0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(c0 || (c0 = {}));
var l0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(l0 || (l0 = {}));
function Ou(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function I3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Py(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function L3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ou(t.outputLen), Ou(t.blockLen);
}
function C3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function T3(t, e) {
  Py(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Nl = {
  number: Ou,
  bool: I3,
  bytes: Py,
  hash: L3,
  exists: C3,
  output: T3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), yr = (t, e) => t << 32 - e | t >>> e, B3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!B3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function M3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function _y(t) {
  if (typeof t == "string" && (t = M3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let N3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ci(t) {
  const e = (r) => t().update(_y(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function P3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Xf = class extends N3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Pl(this.buffer);
  }
  update(e) {
    Nl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = _y(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Pl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Nl.exists(this), Nl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    P3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Pl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const _3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Uy = Uint8Array.from({ length: 16 }, (t, e) => e), U3 = Uy.map((t) => (9 * t + 5) % 16);
let qf = [Uy], Wf = [U3];
for (let t = 0; t < 4; t++)
  for (let e of [qf, Wf])
    e.push(e[t].map((n) => _3[n]));
const Oy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), O3 = qf.map((t, e) => t.map((n) => Oy[e][n])), H3 = Wf.map((t, e) => t.map((n) => Oy[e][n])), D3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), F3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ra = (t, e) => t << e | t >>> 32 - e;
function u0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const za = new Uint32Array(16);
let j3 = class extends Xf {
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
    for (let g = 0; g < 16; g++, n += 4)
      za[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const S = 4 - g, v = D3[g], T = F3[g], O = qf[g], F = Wf[g], k = O3[g], C = H3[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Ra(r + u0(g, i, a, u) + za[O[_]] + v, k[_]) + l | 0;
        r = l, l = u, u = Ra(a, 10) | 0, a = i, i = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Ra(s + u0(S, o, c, h) + za[F[_]] + T, C[_]) + y | 0;
        s = y, y = h, h = Ra(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    za.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
Ci(() => new j3());
const R3 = (t, e, n) => t & e ^ ~t & n, z3 = (t, e, n) => t & e ^ t & n ^ e & n, G3 = new Uint32Array([
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
]), ws = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), bs = new Uint32Array(64);
let Hy = class extends Xf {
  constructor() {
    super(64, 32, 8, !1), this.A = ws[0] | 0, this.B = ws[1] | 0, this.C = ws[2] | 0, this.D = ws[3] | 0, this.E = ws[4] | 0, this.F = ws[5] | 0, this.G = ws[6] | 0, this.H = ws[7] | 0;
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
      bs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = bs[l - 15], g = bs[l - 2], S = yr(y, 7) ^ yr(y, 18) ^ y >>> 3, v = yr(g, 17) ^ yr(g, 19) ^ g >>> 10;
      bs[l] = v + bs[l - 7] + S + bs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), g = h + y + R3(a, c, u) + G3[l] + bs[l] | 0, v = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + z3(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    bs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, K3 = class extends Hy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Ci(() => new Hy());
Ci(() => new K3());
const Ga = BigInt(2 ** 32 - 1), Hu = BigInt(32);
function Dy(t, e = !1) {
  return e ? { h: Number(t & Ga), l: Number(t >> Hu & Ga) } : { h: Number(t >> Hu & Ga) | 0, l: Number(t & Ga) | 0 };
}
function V3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Dy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Y3 = (t, e) => BigInt(t >>> 0) << Hu | BigInt(e >>> 0), X3 = (t, e, n) => t >>> n, q3 = (t, e, n) => t << 32 - n | e >>> n, W3 = (t, e, n) => t >>> n | e << 32 - n, Z3 = (t, e, n) => t << 32 - n | e >>> n, Q3 = (t, e, n) => t << 64 - n | e >>> n - 32, J3 = (t, e, n) => t >>> n - 32 | e << 64 - n, tv = (t, e) => e, ev = (t, e) => t, nv = (t, e, n) => t << n | e >>> 32 - n, rv = (t, e, n) => e << n | t >>> 32 - n, sv = (t, e, n) => e << n - 32 | t >>> 64 - n, iv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function ov(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const av = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), cv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, lv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), uv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, fv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), dv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: Dy,
  split: V3,
  toBig: Y3,
  shrSH: X3,
  shrSL: q3,
  rotrSH: W3,
  rotrSL: Z3,
  rotrBH: Q3,
  rotrBL: J3,
  rotr32H: tv,
  rotr32L: ev,
  rotlSH: nv,
  rotlSL: rv,
  rotlBH: sv,
  rotlBL: iv,
  add: ov,
  add3L: av,
  add3H: cv,
  add4L: lv,
  add4H: uv,
  add5H: dv,
  add5L: fv
}, [hv, pv] = Mt.split([
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
].map((t) => BigInt(t))), ms = new Uint32Array(80), xs = new Uint32Array(80);
let al = class extends Xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: S, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ms[k] = e.getUint32(n), xs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = ms[k - 15] | 0, _ = xs[k - 15] | 0, Y = Mt.rotrSH(C, _, 1) ^ Mt.rotrSH(C, _, 8) ^ Mt.shrSH(C, _, 7), rt = Mt.rotrSL(C, _, 1) ^ Mt.rotrSL(C, _, 8) ^ Mt.shrSL(C, _, 7), X = ms[k - 2] | 0, q = xs[k - 2] | 0, $ = Mt.rotrSH(X, q, 19) ^ Mt.rotrBH(X, q, 61) ^ Mt.shrSH(X, q, 6), U = Mt.rotrSL(X, q, 19) ^ Mt.rotrBL(X, q, 61) ^ Mt.shrSL(X, q, 6), m = Mt.add4L(rt, U, xs[k - 7], xs[k - 16]), N = Mt.add4H(m, Y, $, ms[k - 7], ms[k - 16]);
      ms[k] = N | 0, xs[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: O, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Mt.rotrSH(l, y, 14) ^ Mt.rotrSH(l, y, 18) ^ Mt.rotrBH(l, y, 41), _ = Mt.rotrSL(l, y, 14) ^ Mt.rotrSL(l, y, 18) ^ Mt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, rt = y & S ^ ~y & T, X = Mt.add5L(F, _, rt, pv[k], xs[k]), q = Mt.add5H(X, O, C, Y, hv[k], ms[k]), $ = X | 0, U = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), m = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), N = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      O = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Mt.add(u | 0, h | 0, q | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Mt.add3L($, m, K);
      r = Mt.add3H(B, q, U, N), s = B | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Mt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Mt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: O, l: F } = Mt.add(this.Hh | 0, this.Hl | 0, O | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, O, F);
  }
  roundClean() {
    ms.fill(0), xs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, gv = class extends al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, yv = class extends al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, wv = class extends al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ci(() => new al());
Ci(() => new gv());
Ci(() => new yv());
Ci(() => new wv());
function bv(t, e, n) {
  const s = k3;
  if (Pv(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Pu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Xe;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Xe || (Xe = {}));
let mv = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Fy = class extends mv {
  constructor(e) {
    super(e);
  }
};
function cl(t) {
  const e = [];
  return e.push(na(Gf(t.version, 1))), e.push(na(t.hash160)), Xr(e);
}
function xv(t) {
  const e = [];
  return e.push(t.prefix), e.push(cl(t.address)), t.prefix === Uu.Contract && e.push(ra(t.contractName)), Xr(e);
}
function ra(t) {
  const e = [], n = Vf(t.content), r = n.byteLength;
  return e.push(na(Gf(r, t.lengthPrefixBytes))), e.push(n), Xr(e);
}
function Sv(t) {
  const e = [];
  return e.push(cl(t.address)), e.push(ra(t.contractName)), e.push(ra(t.assetName)), Xr(e);
}
function jy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(xv(t.principal)), (t.conditionType === Xs.Fungible || t.conditionType === Xs.NonFungible) && e.push(Sv(t.assetInfo)), t.conditionType === Xs.NonFungible && e.push(wi(t.assetName)), e.push(t.conditionCode), t.conditionType === Xs.STX || t.conditionType === Xs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Fy("The post-condition amount may not be larger than 8 bytes");
    e.push(m3(t.amount, !1, 8));
  }
  return Xr(e);
}
function Cr(t, e) {
  return Xr([t, e]);
}
function Ev(t) {
  return new Uint8Array([t.type]);
}
function Av(t) {
  return t.type === Xe.OptionalNone ? new Uint8Array([t.type]) : Cr(t.type, wi(t.value));
}
function vv(t) {
  const e = new Uint8Array(4);
  return ol(e, t.buffer.length, 0), Cr(t.type, Yf(e, t.buffer));
}
function kv(t) {
  const e = Kf(x3(t.value, BigInt($3)), Ny);
  return Cr(t.type, e);
}
function $v(t) {
  const e = Kf(t.value, Ny);
  return Cr(t.type, e);
}
function Iv(t) {
  return Cr(t.type, cl(t.address));
}
function Lv(t) {
  return Cr(t.type, Yf(cl(t.address), ra(t.contractName)));
}
function Cv(t) {
  return Cr(t.type, wi(t.value));
}
function Tv(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = wi(r);
    e.push(s);
  }
  return Cr(t.type, Xr(e));
}
function Bv(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = bv(s);
    e.push(ra(i));
    const o = wi(t.data[s]);
    e.push(o);
  }
  return Cr(t.type, Xr(e));
}
function Ry(t, e) {
  const n = [], r = e == "ascii" ? A3(t.data) : Vf(t.data), s = new Uint8Array(4);
  return ol(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, Xr(n));
}
function Mv(t) {
  return Ry(t, "ascii");
}
function Nv(t) {
  return Ry(t, "utf8");
}
function wi(t) {
  switch (t.type) {
    case Xe.BoolTrue:
    case Xe.BoolFalse:
      return Ev(t);
    case Xe.OptionalNone:
    case Xe.OptionalSome:
      return Av(t);
    case Xe.Buffer:
      return vv(t);
    case Xe.UInt:
      return $v(t);
    case Xe.Int:
      return kv(t);
    case Xe.PrincipalStandard:
      return Iv(t);
    case Xe.PrincipalContract:
      return Lv(t);
    case Xe.ResponseOk:
    case Xe.ResponseErr:
      return Cv(t);
    case Xe.List:
      return Tv(t);
    case Xe.Tuple:
      return Bv(t);
    case Xe.StringASCII:
      return Mv(t);
    case Xe.StringUTF8:
      return Nv(t);
    default:
      throw new Fy("Unable to serialize. Invalid Clarity Value.");
  }
}
const Pv = (t, e) => t ? Vf(t).length > e : !1, _v = "connect-ui";
let ac, zy, Bn = !1, Du = !1;
const Yr = (t, e = "") => () => {
}, Uv = (t, e) => () => {
}, Ov = "{visibility:hidden}.hydrated{visibility:inherit}", f0 = {}, Hv = "http://www.w3.org/2000/svg", Dv = "http://www.w3.org/1999/xhtml", Fv = (t) => t != null, Zf = (t) => (t = typeof t, t === "object" || t === "function");
function Gy(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const It = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Zf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? Fu(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = Fu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, Fu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, jv = {}, Rv = (t) => t && t.$tag$ === jv, zv = (t, e) => t != null && !Zf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Gv = (t) => Co(t).$hostElement$, Kv = (t, e, n) => {
  const r = cn.ce(e, n);
  return t.dispatchEvent(r), r;
}, d0 = /* @__PURE__ */ new WeakMap(), Vv = (t, e, n) => {
  let r = Lc.get(t);
  d4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Lc.set(t, r);
}, Yv = (t, e, n, r) => {
  var s;
  let i = Ky(e);
  const o = Lc.get(i);
  if (t = t.nodeType === 11 ? t : vr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = d0.get(t), c;
      if (a || d0.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = vr.createElement("style"), c.innerHTML = o;
          const u = (s = cn.$nonce$) !== null && s !== void 0 ? s : Gy(vr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, Xv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Yr("attachStyles", e.$tagName$), i = Yv(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Ky = (t, e) => "sc-" + t.$tagName$, h0 = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = g0(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = p0(n), h = p0(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : g0(ll, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && cn.rel(t, e, n, !1), r && cn.ael(t, e, r, !1);
    else {
      const c = Zf(r);
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
}, qv = /\s/, p0 = (t) => t ? t.split(qv) : [], Vy = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || f0, o = e.$attrs$ || f0;
  for (r in i)
    r in o || h0(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    h0(s, r, i[r], o[r], n, e.$flags$);
}, Qf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = vr.createTextNode(s.$text$);
  else {
    if (Bn || (Bn = s.$tag$ === "svg"), o = s.$elm$ = vr.createElementNS(Bn ? Hv : Dv, s.$tag$), Bn && s.$tag$ === "foreignObject" && (Bn = !1), Vy(null, s, Bn), Fv(ac) && o["s-si"] !== ac && o.classList.add(o["s-si"] = ac), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Qf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Bn = !1 : o.tagName === "foreignObject" && (Bn = !0);
  }
  return o;
}, Yy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === zy && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Qf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Xy = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Wv = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : Ka(a, h) ? (zo(a, h), a = e[++s], h = r[++i]) : Ka(c, l) ? (zo(c, l), c = e[--o], l = r[--u]) : Ka(a, l) ? (zo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ka(c, h) ? (zo(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (y = Qf(e && e[i], n, i), h = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Yy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Xy(e, s, o);
}, Ka = (t, e) => t.$tag$ === e.$tag$, zo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Bn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Bn, Vy(t, e, Bn), r !== null && s !== null ? Wv(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Yy(n, null, e, s, 0, s.length - 1)) : r !== null && Xy(r, 0, r.length - 1), Bn && i === "svg" && (Bn = !1)) : t.$text$ !== o && (n.data = o);
}, Zv = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Fu(null, null), s = Rv(e) ? e : It(null, null, e);
  zy = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ac = n["s-sc"], zo(r, s);
}, qy = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Jf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return qy(t, t.$ancestorComponent$), p4(() => Qv(t, e));
}, Qv = (t, e) => {
  const n = Yr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), n4(s, () => Jv(t, r, e));
}, Jv = async (t, e, n) => {
  const r = t.$hostElement$, s = Yr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Xv(t);
  const o = Yr("render", t.$cmpMeta$.$tagName$);
  t4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => e4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, t4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Zv(t, e);
  } catch (r) {
    sa(r, t.$hostElement$);
  }
  return null;
}, e4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Yr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Zy(n), r(), t.$onReadyResolve$(n), s || Wy()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && ed(() => Jf(t, !1)), t.$flags$ &= -517;
}, Wy = (t) => {
  Zy(vr.documentElement), ed(() => Kv(ll, "appload", { detail: { namespace: _v } }));
}, n4 = (t, e) => t && t.then ? t.then(e) : e(), Zy = (t) => t.classList.add("hydrated"), r4 = (t, e) => Co(t).$instanceValues$.get(e), s4 = (t, e, n, r) => {
  const s = Co(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = zv(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Jf(s, !1));
}, Qy = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return r4(this, i);
        },
        set(a) {
          s4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        cn.jmp(() => {
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
}, i4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = f4(n), s.then) {
        const c = Uv();
        s = await s, c();
      }
      s.isProxied || (Qy(
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
      const c = Ky(n);
      if (!Lc.has(c)) {
        const u = Yr("registerStyles", n.$tagName$);
        Vv(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Jf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, o4 = (t) => {
  if (!(cn.$flags$ & 1)) {
    const e = Co(t), n = e.$cmpMeta$, r = Yr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            qy(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), i4(t, e, n);
    }
    r();
  }
}, a4 = (t) => {
  cn.$flags$ & 1 || Co(t);
}, c4 = (t, e = {}) => {
  var n;
  const r = Yr(), s = [], i = e.exclude || [], o = ll.customElements, a = vr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ vr.createElement("style"), h = [];
  let l, y = !0;
  Object.assign(cn, e), cn.$resourcesUrl$ = new URL(e.resourcesUrl || "./", vr.baseURI).href, t.map((g) => {
    g[1].map((S) => {
      const v = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      v.$members$ = S[2];
      const T = v.$tagName$, O = class extends HTMLElement {
        // StencilLazyHost
        constructor(F) {
          super(F), F = this, u4(F, v), v.$flags$ & 1 && F.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? h.push(this) : cn.jmp(() => o4(this));
        }
        disconnectedCallback() {
          cn.jmp(() => a4(this));
        }
        componentOnReady() {
          return Co(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = g[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Qy(
        O,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + Ov, u.setAttribute("data-styles", "");
    const g = (n = cn.$nonce$) !== null && n !== void 0 ? n : Gy(vr);
    g != null && u.setAttribute("nonce", g), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, h.length ? h.map((g) => g.connectedCallback()) : cn.jmp(() => l = setTimeout(Wy, 30)), r();
}, td = /* @__PURE__ */ new WeakMap(), Co = (t) => td.get(t), l4 = (t, e) => td.set(e.$lazyInstance$ = t, e), u4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], td.set(t, n);
}, g0 = (t, e) => e in t, sa = (t, e) => (0, console.error)(t, e), _l = /* @__PURE__ */ new Map(), f4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = _l.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (_l.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => xI).then(o, sa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (_l.set(s, o), o[r]), sa);
}, Lc = /* @__PURE__ */ new Map(), ll = typeof window < "u" ? window : {}, vr = ll.document || { head: {} }, cn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Jy = (t) => Promise.resolve(t), d4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), y0 = [], tw = [], h4 = (t, e) => (n) => {
  t.push(n), Du || (Du = !0, cn.$flags$ & 4 ? ed(ju) : cn.raf(ju));
}, w0 = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      sa(n);
    }
  t.length = 0;
}, ju = () => {
  w0(y0), w0(tw), (Du = y0.length > 0) && cn.raf(ju);
}, ed = (t) => Jy().then(t), p4 = /* @__PURE__ */ h4(tw), g4 = () => Jy(), y4 = (t, e) => typeof window > "u" ? Promise.resolve() : g4().then(() => c4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var w4 = Object.defineProperty, b4 = Object.defineProperties, m4 = Object.getOwnPropertyDescriptors, Cc = Object.getOwnPropertySymbols, ew = Object.prototype.hasOwnProperty, nw = Object.prototype.propertyIsEnumerable, b0 = (t, e, n) => e in t ? w4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Un = (t, e) => {
  for (var n in e || (e = {})) ew.call(e, n) && b0(t, n, e[n]);
  if (Cc) for (var n of Cc(e)) nw.call(e, n) && b0(t, n, e[n]);
  return t;
}, ar = (t, e) => b4(t, m4(e)), rw = (t, e) => {
  var n = {};
  for (var r in t) ew.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Cc) for (var r of Cc(t)) e.indexOf(r) < 0 && nw.call(t, r) && (n[r] = t[r]);
  return n;
};
function sw() {
  return nl(fi()) || window.StacksProvider || window.BlockstackProvider;
}
function ul(t) {
  return t ? typeof t == "string" ? hi.fromName(t) : "version" in t ? t : "url" in t ? new gu({ url: t.url }) : t.transactionVersion === gi.Mainnet ? new gu({ url: t.client.baseUrl }) : new yu({ url: t.client.baseUrl }) : new yu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var x4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(x4 || {}), S4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(S4 || {}), nd = (t) => {
  let e = t;
  if (!e) {
    let n = new _p(["store_write"], document.location.href);
    e = new pu({ appConfig: n });
  }
  return e;
};
function iw(t) {
  try {
    return nd(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var ow = (t) => {
  let e = nd(t).loadUserData().appPrivateKey, n = tn.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function E4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [pi.Mainnet]: "mainnet", [pi.Testnet]: "testnet" }, a = ul(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function A4(t) {
  let e = ul(t.network), n = nd(t.userSession), r = ar(Un({}, t), { network: e, userSession: n });
  return Un({ stxAddress: E4(r) }, r);
}
async function v4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(By) : n = n.map((r) => yt(jy(r)))), new tn.TokenSigner("ES256k", e).signAsync(ar(Un({}, t), { postConditions: n }));
}
function k4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(By) : e = e.map((n) => yt(jy(n)))), tn.createUnsecuredToken(ar(Un({}, t), { postConditions: e }));
}
var $4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Vt(a.replace(/^0x/, "")), u = y3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, ar(Un({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, ar(Un({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, I4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = rw(e, ["amount", "appDetails", "userSession"]);
  if (iw(s)) {
    let { privateKey: a, publicKey: c } = ow(s), u = ar(Un({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), v4(u, a);
  }
  let o = ar(Un({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), k4(o);
};
async function L4(t, e, n) {
  let r = await e(ar(Un(Un({}, A4(t)), t), { network: ul(t.network) }));
  return $4({ token: r, options: t }, n);
}
function C4(t, e = sw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return L4(t, I4, e);
}
function aw(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ar(Un({}, t), { message: Vh(e), domain: Vh(n) }) : ar(Un({}, t), { message: yt(wi(e)), domain: yt(wi(n)) });
}
async function T4(t, e) {
  return new tn.TokenSigner("ES256k", e).signAsync(aw(t));
}
async function B4(t) {
  let e = t, { userSession: n } = e, r = rw(e, ["userSession"]);
  if (iw(n)) {
    let { privateKey: s, publicKey: i } = ow(n), o = ar(Un({}, r), { publicKey: i });
    return T4(o, s);
  }
  return tn.createUnsecuredToken(aw(t));
}
var M4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(M4 || {}), cw = "asigna-stx", m0 = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === cw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(P4(t, e), "*");
}), N4 = { authenticationRequest: async (t) => m0(t, "authenticationRequest"), transactionRequest: async (t) => m0(t, "transactionRequest") }, P4 = (t, e) => ({ source: cw, [e]: t }), _4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = N4);
};
_4();
var U4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function O4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = fi(), o = sw();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    y4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : U4, c = LS(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let h = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = h;
    };
    u.callback = (g) => {
      l(), t(n, g);
    }, u.cancelCallback = () => {
      var g;
      l(), (g = n.onCancel) == null || g.call(n);
    }, document.body.appendChild(u);
    let y = (g) => {
      g.key === "Escape" && (document.removeEventListener("keydown", y), u.remove());
    };
    document.addEventListener("keydown", y);
  };
}
var Va = O4(C4);
function _s(t, e, n) {
  return rd(yn(t, e), n);
}
function yn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = me(r);
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
      const r = F4(BigInt(`0x${Ot(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ot(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function x0(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function wa(t, e = 8) {
  return (typeof t == "bigint" ? t : yn(t, !1)).toString(16).padStart(e * 2, "0");
}
function fl(t) {
  return parseInt(t, 16);
}
function rd(t, e = 16) {
  const n = wa(t, e);
  return me(n);
}
function H4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function D4(t, e) {
  return t & BigInt(1) << e;
}
function F4(t, e) {
  return D4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const j4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += j4[n];
  return e;
}
function me(t) {
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
function To(t) {
  return new TextEncoder().encode(t);
}
function sd(t) {
  return new TextDecoder().decode(t);
}
function lw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function R4(t) {
  return String.fromCharCode.apply(null, t);
}
function z4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function S0(t) {
  if (t.some(z4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function dl(...t) {
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
  return dl(...t.map((e) => typeof e == "number" ? S0([e]) : e instanceof Array ? S0(e) : e));
}
var E0;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(E0 || (E0 = {}));
var A0;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(A0 || (A0 = {}));
var v0;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(v0 || (v0 = {}));
const uw = 33, Ul = 32;
function G4(t) {
  if (t.length < Ul * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ul * 2), r = t.slice(2 + Ul * 2);
  return {
    recoveryId: fl(e),
    r: n,
    s: r
  };
}
function K4(t) {
  const e = typeof t == "string" ? me(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function V4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Y4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function X4(t, e) {
  return t[e];
}
function q4(t, e, n = 0) {
  return t[n] = e, t;
}
function W4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function bi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ru;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ru || (Ru = {}));
const Z4 = Ru.Mainnet, Q4 = 128, J4 = 128, fw = 16, ri = 32, zu = 80, hl = 65, tk = 32, ek = 64, Tc = 34;
var pt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pt || (pt = {}));
var _t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_t || (_t = {}));
var Gu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gu || (Gu = {}));
var En;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(En || (En = {}));
const cc = ["onChainOnly", "offChainOnly", "any"], k0 = {
  [cc[0]]: En.OnChainOnly,
  [cc[1]]: En.OffChainOnly,
  [cc[2]]: En.Any,
  [En.OnChainOnly]: En.OnChainOnly,
  [En.OffChainOnly]: En.OffChainOnly,
  [En.Any]: En.Any
};
function nk(t) {
  if (t in k0)
    return k0[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${cc.join(", ")}`);
}
var Bc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bc || (Bc = {}));
Bc.Mainnet;
var xo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(xo || (xo = {}));
var An;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(An || (An = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var ce;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ce || (ce = {}));
var Mc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mc || (Mc = {}));
var Ae;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Ae || (Ae = {}));
var ia;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(ia || (ia = {}));
var Ku;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Ku || (Ku = {}));
var oa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(oa || (oa = {}));
var $0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})($0 || ($0 = {}));
var I0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(I0 || (I0 = {}));
function Vu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rk(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function dw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sk(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vu(t.outputLen), Vu(t.blockLen);
}
function ik(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ok(t, e) {
  dw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ti = {
  number: Vu,
  bool: rk,
  bytes: dw,
  hash: sk,
  exists: ik,
  output: ok
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ol = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), wr = (t, e) => t << 32 - e | t >>> e, ak = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ak)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ck(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function id(t) {
  if (typeof t == "string" && (t = ck(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class hw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ti(t) {
  const e = (r) => t().update(id(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function lk(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class od extends hw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ol(this.buffer);
  }
  update(e) {
    ti.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = id(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Ol(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ti.exists(this), ti.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    lk(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Ol(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, h = this.get();
    if (u > h.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, h[l], i);
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
const uk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), pw = Uint8Array.from({ length: 16 }, (t, e) => e), fk = pw.map((t) => (9 * t + 5) % 16);
let ad = [pw], cd = [fk];
for (let t = 0; t < 4; t++)
  for (let e of [ad, cd])
    e.push(e[t].map((n) => uk[n]));
const gw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), dk = ad.map((t, e) => t.map((n) => gw[e][n])), hk = cd.map((t, e) => t.map((n) => gw[e][n])), pk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), gk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ya = (t, e) => t << e | t >>> 32 - e;
function L0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xa = new Uint32Array(16);
class yk extends od {
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
    for (let g = 0; g < 16; g++, n += 4)
      Xa[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const S = 4 - g, v = pk[g], T = gk[g], O = ad[g], F = cd[g], k = dk[g], C = hk[g];
      for (let _ = 0; _ < 16; _++) {
        const Y = Ya(r + L0(g, i, a, u) + Xa[O[_]] + v, k[_]) + l | 0;
        r = l, l = u, u = Ya(a, 10) | 0, a = i, i = Y;
      }
      for (let _ = 0; _ < 16; _++) {
        const Y = Ya(s + L0(S, o, c, h) + Xa[F[_]] + T, C[_]) + y | 0;
        s = y, y = h, h = Ya(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Xa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const wk = Ti(() => new yk()), bk = (t, e, n) => t & e ^ ~t & n, mk = (t, e, n) => t & e ^ t & n ^ e & n, xk = new Uint32Array([
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
]), Ss = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Es = new Uint32Array(64);
class yw extends od {
  constructor() {
    super(64, 32, 8, !1), this.A = Ss[0] | 0, this.B = Ss[1] | 0, this.C = Ss[2] | 0, this.D = Ss[3] | 0, this.E = Ss[4] | 0, this.F = Ss[5] | 0, this.G = Ss[6] | 0, this.H = Ss[7] | 0;
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
      Es[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Es[l - 15], g = Es[l - 2], S = wr(y, 7) ^ wr(y, 18) ^ y >>> 3, v = wr(g, 17) ^ wr(g, 19) ^ g >>> 10;
      Es[l] = v + Es[l - 7] + S + Es[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = wr(a, 6) ^ wr(a, 11) ^ wr(a, 25), g = h + y + bk(a, c, u) + xk[l] + Es[l] | 0, v = (wr(r, 2) ^ wr(r, 13) ^ wr(r, 22)) + mk(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Es.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Sk extends yw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ld = Ti(() => new yw());
Ti(() => new Sk());
const qa = BigInt(2 ** 32 - 1), Yu = BigInt(32);
function ww(t, e = !1) {
  return e ? { h: Number(t & qa), l: Number(t >> Yu & qa) } : { h: Number(t >> Yu & qa) | 0, l: Number(t & qa) | 0 };
}
function Ek(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ww(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Ak = (t, e) => BigInt(t >>> 0) << Yu | BigInt(e >>> 0), vk = (t, e, n) => t >>> n, kk = (t, e, n) => t << 32 - n | e >>> n, $k = (t, e, n) => t >>> n | e << 32 - n, Ik = (t, e, n) => t << 32 - n | e >>> n, Lk = (t, e, n) => t << 64 - n | e >>> n - 32, Ck = (t, e, n) => t >>> n - 32 | e << 64 - n, Tk = (t, e) => e, Bk = (t, e) => t, Mk = (t, e, n) => t << n | e >>> 32 - n, Nk = (t, e, n) => e << n | t >>> 32 - n, Pk = (t, e, n) => e << n - 32 | t >>> 64 - n, _k = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Uk(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ok = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hk = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Dk = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Fk = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, jk = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Rk = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: ww,
  split: Ek,
  toBig: Ak,
  shrSH: vk,
  shrSL: kk,
  rotrSH: $k,
  rotrSL: Ik,
  rotrBH: Lk,
  rotrBL: Ck,
  rotr32H: Tk,
  rotr32L: Bk,
  rotlSH: Mk,
  rotlSL: Nk,
  rotlBH: Pk,
  rotlBL: _k,
  add: Uk,
  add3L: Ok,
  add3H: Hk,
  add4L: Dk,
  add4H: Fk,
  add5H: Rk,
  add5L: jk
}, [zk, Gk] = Nt.split([
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
].map((t) => BigInt(t))), As = new Uint32Array(80), vs = new Uint32Array(80);
class pl extends od {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: S, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, S, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = S | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      As[k] = e.getUint32(n), vs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = As[k - 15] | 0, _ = vs[k - 15] | 0, Y = Nt.rotrSH(C, _, 1) ^ Nt.rotrSH(C, _, 8) ^ Nt.shrSH(C, _, 7), rt = Nt.rotrSL(C, _, 1) ^ Nt.rotrSL(C, _, 8) ^ Nt.shrSL(C, _, 7), X = As[k - 2] | 0, q = vs[k - 2] | 0, $ = Nt.rotrSH(X, q, 19) ^ Nt.rotrBH(X, q, 61) ^ Nt.shrSH(X, q, 6), U = Nt.rotrSL(X, q, 19) ^ Nt.rotrBL(X, q, 61) ^ Nt.shrSL(X, q, 6), m = Nt.add4L(rt, U, vs[k - 7], vs[k - 16]), N = Nt.add4H(m, Y, $, As[k - 7], As[k - 16]);
      As[k] = N | 0, vs[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: O, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Nt.rotrSH(l, y, 14) ^ Nt.rotrSH(l, y, 18) ^ Nt.rotrBH(l, y, 41), _ = Nt.rotrSL(l, y, 14) ^ Nt.rotrSL(l, y, 18) ^ Nt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, rt = y & S ^ ~y & T, X = Nt.add5L(F, _, rt, Gk[k], vs[k]), q = Nt.add5H(X, O, C, Y, zk[k], As[k]), $ = X | 0, U = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), m = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), N = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      O = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Nt.add(u | 0, h | 0, q | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Nt.add3L($, m, K);
      r = Nt.add3H(B, q, U, N), s = B | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Nt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Nt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Nt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: O, l: F } = Nt.add(this.Hh | 0, this.Hl | 0, O | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, O, F);
  }
  roundClean() {
    As.fill(0), vs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Kk extends pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Vk extends pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Yk extends pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ti(() => new pl());
Ti(() => new Kk());
const Xk = Ti(() => new Vk());
Ti(() => new Yk());
function bw(t) {
  if (me(t).byteLength != hl)
    throw Error("Invalid signature");
  return {
    type: pt.MessageSignature,
    data: t
  };
}
function Go(t, e) {
  return { type: pt.Address, version: t, hash160: e };
}
function no(t) {
  return Ii.c32address(t.version, t.hash160);
}
function mi(t, e, n) {
  const r = e || 1, s = n || Q4;
  if (_w(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: pt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ud(t) {
  const e = Ii.c32addressDecode(t);
  return {
    type: pt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
function qk(t) {
  if (t.type === J.PrincipalStandard)
    return no(t.address);
  if (t.type === J.PrincipalContract)
    return `${no(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function mw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Qk(e, n);
  } else
    return Wk(t);
}
function Wk(t) {
  const e = ud(t);
  return { type: J.PrincipalStandard, address: e };
}
function Zk(t) {
  return { type: J.PrincipalStandard, address: t };
}
function Qk(t, e) {
  const n = ud(t), r = mi(e);
  return xw(n, r);
}
function xw(t, e) {
  if (To(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: J.PrincipalContract, address: t, contractName: e };
}
function Hl(t, e = !1) {
  switch (t.type) {
    case J.BoolTrue:
      return !0;
    case J.BoolFalse:
      return !1;
    case J.Int:
    case J.UInt:
      return e ? t.value.toString() : t.value;
    case J.Buffer:
      return `0x${Ot(t.buffer)}`;
    case J.OptionalNone:
      return null;
    case J.OptionalSome:
      return Sr(t.value);
    case J.ResponseErr:
      return Sr(t.value);
    case J.ResponseOk:
      return Sr(t.value);
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return qk(t);
    case J.List:
      return t.list.map((r) => Sr(r));
    case J.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = Sr(t.data[r]);
      }), n;
    case J.StringASCII:
      return t.data;
    case J.StringUTF8:
      return t.data;
  }
}
function Sr(t) {
  switch (t.type) {
    case J.ResponseErr:
      return { type: Is(t), value: Hl(t, !0), success: !1 };
    case J.ResponseOk:
      return { type: Is(t), value: Hl(t, !0), success: !0 };
    default:
      return { type: Is(t), value: Hl(t, !0) };
  }
}
function Is(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return "bool";
    case J.Int:
      return "int";
    case J.UInt:
      return "uint";
    case J.Buffer:
      return `(buff ${t.buffer.length})`;
    case J.OptionalNone:
      return "(optional none)";
    case J.OptionalSome:
      return `(optional ${Is(t.value)})`;
    case J.ResponseErr:
      return `(response UnknownType ${Is(t.value)})`;
    case J.ResponseOk:
      return `(response ${Is(t.value)} UnknownType)`;
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return "principal";
    case J.List:
      return `(list ${t.list.length} ${t.list.length ? Is(t.list[0]) : "UnknownType"})`;
    case J.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Is(t.data[e])})`).join(" ")})`;
    case J.StringASCII:
      return `(string-ascii ${lw(t.data).length})`;
    case J.StringUTF8:
      return `(string-utf8 ${To(t.data).length})`;
  }
}
const Sw = () => ({ type: J.BoolTrue }), Ew = () => ({ type: J.BoolFalse }), Jk = (t) => t ? Sw() : Ew(), C0 = BigInt("0xffffffffffffffffffffffffffffffff"), t8 = BigInt(0), T0 = BigInt("0x7fffffffffffffffffffffffffffffff"), B0 = BigInt("-170141183460469231731687303715884105728"), e8 = (t) => {
  const e = yn(t, !0);
  if (e > T0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${T0}`);
  if (e < B0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${B0}`);
  return { type: J.Int, value: e };
}, kr = (t) => {
  const e = yn(t, !1);
  if (e < t8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > C0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${C0}`);
  return { type: J.UInt, value: e };
}, Aw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: J.Buffer, buffer: t };
};
function vw() {
  return { type: J.OptionalNone };
}
function kw(t) {
  return { type: J.OptionalSome, value: t };
}
function n8(t) {
  return { type: J.ResponseErr, value: t };
}
function r8(t) {
  return { type: J.ResponseOk, value: t };
}
function s8(t) {
  return { type: J.List, list: t };
}
function xi(t) {
  for (const e in t)
    if (!Y8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const Je = (t) => ({ type: J.StringASCII, data: t }), i8 = (t) => ({ type: J.StringUTF8, data: t });
class $w extends hw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ti.hash(e);
    const r = id(n);
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
    return ti.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ti.exists(this), ti.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Iw = (t, e, n) => new $w(t, e).update(n).digest();
Iw.create = (t, e) => new $w(t, e);
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Iw.create(ld, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function So(t) {
  return {
    type: pt.PublicKey,
    data: me(t)
  };
}
function o8(t, e, n = Ae.Compressed) {
  const r = G4(e.data), s = new Pn(x0(r.r), x0(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === Ae.Compressed;
  return i.toHex(o);
}
function a8(t) {
  return { type: pt.PublicKey, data: t };
}
function Bo(t) {
  return !Ot(t.data).startsWith("04");
}
function Nc(t) {
  return t.data.slice();
}
function c8(t) {
  const e = f8(t), n = da(e.data.slice(0, 32), e.compressed);
  return So(Ot(n));
}
function l8(t) {
  const e = typeof t == "string" ? t : Ot(t), n = Ut.fromHex(e).toHex(!0);
  return So(n);
}
function u8(t) {
  const e = typeof t == "string" ? t : Ot(t), n = Ut.fromHex(e).toHex(!1);
  return So(n);
}
function Xu(t) {
  const e = t.readUInt8(), n = e === 4 ? ek : tk;
  return a8(He([e, t.readBytes(n)]));
}
function f8(t) {
  const e = K4(t), n = e.length == uw;
  return { data: e, compressed: n };
}
function d8(t, e) {
  const [n, r] = Vc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = wa(r, 1) + Pn.fromHex(n).toCompactHex();
  return bw(i);
}
function h8(t) {
  return c8(t.data);
}
function p8(t, e, n) {
  return typeof t == "string" && (t = mw(t)), typeof n == "string" && (n = P0(n)), {
    type: pt.Payload,
    payloadType: _t.TokenTransfer,
    recipient: t,
    amount: yn(e, !1),
    memo: n ?? P0("")
  };
}
function g8(t, e, n, r) {
  return typeof t == "string" && (t = ud(t)), typeof e == "string" && (e = mi(e)), typeof n == "string" && (n = mi(n)), {
    type: pt.Payload,
    payloadType: _t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function M0(t, e, n) {
  return typeof t == "string" && (t = mi(t)), typeof e == "string" && (e = v8(e)), typeof n == "number" ? {
    type: pt.Payload,
    payloadType: _t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: pt.Payload,
    payloadType: _t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function y8() {
  return { type: pt.Payload, payloadType: _t.PoisonMicroblock };
}
function N0(t, e) {
  if (t.byteLength != ri)
    throw Error(`Coinbase buffer size must be ${ri} bytes`);
  return e != null ? {
    type: pt.Payload,
    payloadType: _t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: pt.Payload,
    payloadType: _t.Coinbase,
    coinbaseBytes: t
  };
}
function w8(t, e, n) {
  if (t.byteLength != ri)
    throw Error(`Coinbase buffer size must be ${ri} bytes`);
  if (n.byteLength != zu)
    throw Error(`VRF proof buffer size must be ${zu} bytes`);
  return {
    type: pt.Payload,
    payloadType: _t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === J.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var qu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(qu || (qu = {}));
function b8(t, e, n, r, s, i, o) {
  return {
    type: pt.Payload,
    payloadType: _t.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Lw(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case _t.TokenTransfer:
      e.push(_e(t.recipient)), e.push(_s(t.amount, !1, 8)), e.push(Or(t.memo));
      break;
    case _t.ContractCall:
      e.push(Or(t.contractAddress)), e.push(Or(t.contractName)), e.push(Or(t.functionName));
      const n = new Uint8Array(4);
      bi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(_e(r));
      });
      break;
    case _t.SmartContract:
      e.push(Or(t.contractName)), e.push(Or(t.codeBody));
      break;
    case _t.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Or(t.contractName)), e.push(Or(t.codeBody));
      break;
    case _t.PoisonMicroblock:
      break;
    case _t.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case _t.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient));
      break;
    case _t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(_e(t.recipient ? kw(t.recipient) : vw())), e.push(t.vrfProof);
      break;
    case _t.TenureChange:
      e.push(me(t.tenureHash)), e.push(me(t.previousTenureHash)), e.push(me(t.burnViewHash)), e.push(me(t.previousTenureEnd)), e.push(bi(new Uint8Array(4), t.previousTenureBlocks)), e.push(q4(new Uint8Array(1), t.cause)), e.push(me(t.publicKeyHash));
      break;
  }
  return He(e);
}
function m8(t) {
  switch (t.readUInt8Enum(_t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case _t.TokenTransfer:
      const n = Yn(t), r = yn(t.readBytes(8), !1), s = Tw(t);
      return p8(n, r, s);
    case _t.ContractCall:
      const i = Eo(t), o = Vn(t), a = Vn(t), c = [], u = t.readUInt32BE();
      for (let k = 0; k < u; k++) {
        const C = Yn(t);
        c.push(C);
      }
      return g8(i, o, a, c);
    case _t.SmartContract:
      const h = Vn(t), l = Vn(t, 4, 1e5);
      return M0(h, l);
    case _t.VersionedSmartContract: {
      const k = t.readUInt8Enum(Gu, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), C = Vn(t), _ = Vn(t, 4, 1e5);
      return M0(C, _, k);
    }
    case _t.PoisonMicroblock:
      return y8();
    case _t.Coinbase: {
      const k = t.readBytes(ri);
      return N0(k);
    }
    case _t.CoinbaseToAltRecipient: {
      const k = t.readBytes(ri), C = Yn(t);
      return N0(k, C);
    }
    case _t.NakamotoCoinbase: {
      const k = t.readBytes(ri), C = Yn(t), _ = t.readBytes(zu);
      return w8(k, C, _);
    }
    case _t.TenureChange:
      const y = Ot(t.readBytes(20)), g = Ot(t.readBytes(20)), S = Ot(t.readBytes(20)), v = Ot(t.readBytes(32)), T = t.readUInt32BE(), O = t.readUInt8Enum(qu, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), F = Ot(t.readBytes(20));
      return b8(y, g, S, v, T, O, F);
  }
}
class gl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class qs extends gl {
  constructor(e) {
    super(e);
  }
}
class Nn extends gl {
  constructor(e) {
    super(e);
  }
}
class Pc extends gl {
  constructor(e) {
    super(e);
  }
}
class ei extends gl {
  constructor(e) {
    super(e);
  }
}
var sr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sr || (sr = {}));
function Wu(t) {
  return bw(Ot(t.readBytes(hl)));
}
function ro(t, e) {
  return {
    pubKeyEncoding: t,
    type: pt.TransactionAuthField,
    contents: e
  };
}
function x8(t) {
  const e = t.readUInt8Enum(sr, (n) => {
    throw new Nn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case sr.PublicKeyCompressed:
      return ro(Ae.Compressed, Xu(t));
    case sr.PublicKeyUncompressed:
      return ro(Ae.Uncompressed, u8(Xu(t).data));
    case sr.SignatureCompressed:
      return ro(Ae.Compressed, Wu(t));
    case sr.SignatureUncompressed:
      return ro(Ae.Uncompressed, Wu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function fd(t) {
  return me(t.data);
}
function S8(t) {
  const e = [];
  switch (t.contents.type) {
    case pt.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? sr.PublicKeyCompressed : sr.PublicKeyUncompressed), e.push(Nc(l8(t.contents.data)));
      break;
    case pt.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? sr.SignatureCompressed : sr.SignatureUncompressed), e.push(fd(t.contents));
      break;
  }
  return He(e);
}
function Or(t) {
  switch (t.type) {
    case pt.Address:
      return ba(t);
    case pt.Principal:
      return Cw(t);
    case pt.LengthPrefixedString:
      return Ao(t);
    case pt.MemoString:
      return k8(t);
    case pt.AssetInfo:
      return Bw(t);
    case pt.PostCondition:
      return $8(t);
    case pt.PublicKey:
      return Nc(t);
    case pt.LengthPrefixedList:
      return pd(t);
    case pt.Payload:
      return Lw(t);
    case pt.TransactionAuthField:
      return S8(t);
    case pt.MessageSignature:
      return fd(t);
  }
}
function E8() {
  return {
    type: pt.Address,
    version: Mc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function dd(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.SerializeP2WPKH || e === ce.SerializeP2WSH || e === ce.SerializeP2WSHNonSequential) && !r.every(Bo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.SerializeP2PKH:
      return Go(t, z8(r[0].data));
    case ce.SerializeP2WPKH:
      return Go(t, G8(r[0].data));
    case ce.SerializeP2SH:
    case ce.SerializeP2SHNonSequential:
      return Go(t, K8(n, r.map(Nc)));
    case ce.SerializeP2WSH:
    case ce.SerializeP2WSHNonSequential:
      return Go(t, V8(n, r.map(Nc)));
  }
}
function ba(t) {
  const e = [];
  return e.push(me(wa(t.version, 1))), e.push(me(t.hash160)), He(e);
}
function Eo(t) {
  const e = fl(Ot(t.readBytes(1))), n = Ot(t.readBytes(20));
  return { type: pt.Address, version: e, hash160: n };
}
function Cw(t) {
  const e = [];
  return e.push(t.prefix), e.push(ba(t.address)), t.prefix === oa.Contract && e.push(Ao(t.contractName)), He(e);
}
function A8(t) {
  const e = t.readUInt8Enum(oa, (s) => {
    throw new Nn(`Unexpected Principal payload type: ${s}`);
  }), n = Eo(t);
  if (e === oa.Standard)
    return { type: pt.Principal, prefix: e, address: n };
  const r = Vn(t);
  return {
    type: pt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ao(t) {
  const e = [], n = To(t.content), r = n.byteLength;
  return e.push(me(wa(r, t.lengthPrefixBytes))), e.push(n), He(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = fl(Ot(t.readBytes(e))), s = sd(t.readBytes(r));
  return mi(s, e, n ?? 128);
}
function v8(t) {
  return mi(t, 4, 1e5);
}
function P0(t) {
  if (t && _w(t, Tc))
    throw new Error(`Memo exceeds maximum length of ${Tc} bytes`);
  return { type: pt.MemoString, content: t };
}
function k8(t) {
  const e = [], n = To(t.content), r = R8(Ot(n), Tc * 2);
  return e.push(me(r)), He(e);
}
function Tw(t) {
  let e = sd(t.readBytes(Tc));
  return e = e.replace(/\u0000*$/, ""), { type: pt.MemoString, content: e };
}
function Bw(t) {
  const e = [];
  return e.push(ba(t.address)), e.push(Ao(t.contractName)), e.push(Ao(t.assetName)), He(e);
}
function Zu(t) {
  return {
    type: pt.AssetInfo,
    address: Eo(t),
    contractName: Vn(t),
    assetName: Vn(t)
  };
}
function hd(t, e) {
  return {
    type: pt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function pd(t) {
  const e = t.values, n = [];
  n.push(me(wa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Or(r));
  return He(n);
}
function Mw(t, e, n) {
  const r = fl(Ot(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case pt.Address:
        s.push(Eo(t));
        break;
      case pt.LengthPrefixedString:
        s.push(Vn(t));
        break;
      case pt.MemoString:
        s.push(Tw(t));
        break;
      case pt.AssetInfo:
        s.push(Zu(t));
        break;
      case pt.PostCondition:
        s.push(I8(t));
        break;
      case pt.PublicKey:
        s.push(Xu(t));
        break;
      case pt.TransactionAuthField:
        s.push(x8(t));
        break;
    }
  return hd(s, n);
}
function $8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Cw(t.principal)), (t.conditionType === An.Fungible || t.conditionType === An.NonFungible) && e.push(Bw(t.assetInfo)), t.conditionType === An.NonFungible && e.push(_e(t.assetName)), e.push(t.conditionCode), t.conditionType === An.STX || t.conditionType === An.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new qs("The post-condition amount may not be larger than 8 bytes");
    e.push(_s(t.amount, !1, 8));
  }
  return He(e);
}
function I8(t) {
  const e = t.readUInt8Enum(An, (o) => {
    throw new Nn(`Could not read ${o} as PostConditionType`);
  }), n = A8(t);
  let r, s, i;
  switch (e) {
    case An.STX:
      return r = t.readUInt8Enum(ia, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ot(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: An.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case An.Fungible:
      return s = Zu(t), r = t.readUInt8Enum(ia, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ot(t.readBytes(8))}`), {
        type: pt.PostCondition,
        conditionType: An.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case An.NonFungible:
      s = Zu(t);
      const o = Yn(t);
      return r = t.readUInt8Enum(Ku, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: pt.PostCondition,
        conditionType: An.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Tr(t, e) {
  return He([t, e]);
}
function L8(t) {
  return new Uint8Array([t.type]);
}
function C8(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : Tr(t.type, _e(t.value));
}
function T8(t) {
  const e = new Uint8Array(4);
  return bi(e, t.buffer.length, 0), Tr(t.type, dl(e, t.buffer));
}
function B8(t) {
  const e = rd(H4(t.value, BigInt(J4)), fw);
  return Tr(t.type, e);
}
function M8(t) {
  const e = rd(t.value, fw);
  return Tr(t.type, e);
}
function N8(t) {
  return Tr(t.type, ba(t.address));
}
function P8(t) {
  return Tr(t.type, dl(ba(t.address), Ao(t.contractName)));
}
function _8(t) {
  return Tr(t.type, _e(t.value));
}
function U8(t) {
  const e = [], n = new Uint8Array(4);
  bi(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = _e(r);
    e.push(s);
  }
  return Tr(t.type, He(e));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  bi(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = mi(s);
    e.push(Ao(i));
    const o = _e(t.data[s]);
    e.push(o);
  }
  return Tr(t.type, He(e));
}
function Nw(t, e) {
  const n = [], r = e == "ascii" ? lw(t.data) : To(t.data), s = new Uint8Array(4);
  return bi(s, r.length, 0), n.push(s), n.push(r), Tr(t.type, He(n));
}
function H8(t) {
  return Nw(t, "ascii");
}
function D8(t) {
  return Nw(t, "utf8");
}
function _e(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return L8(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return C8(t);
    case J.Buffer:
      return T8(t);
    case J.UInt:
      return M8(t);
    case J.Int:
      return B8(t);
    case J.PrincipalStandard:
      return N8(t);
    case J.PrincipalContract:
      return P8(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return _8(t);
    case J.List:
      return U8(t);
    case J.Tuple:
      return O8(t);
    case J.StringASCII:
      return H8(t);
    case J.StringUTF8:
      return D8(t);
    default:
      throw new qs("Unable to serialize. Invalid Clarity Value.");
  }
}
function F8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const _0 = /* @__PURE__ */ new Map();
function Pw(t, e) {
  const n = _0.get(t);
  if (n !== void 0)
    return n(e);
  const r = F8(t);
  return _0.set(t, r), Pw(t, e);
}
class qo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return W4(this.readBytes(4), 0);
  }
  readUInt8() {
    return X4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return V4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Ot(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Ot(n);
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
    if (Pw(e, r))
      return r;
    throw n(r);
  }
}
function Yn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new qo(me(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new qo(t) : e = t;
  switch (e.readUInt8Enum(J, (r) => {
    throw new Nn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case J.Int:
      return e8(e.readBytes(16));
    case J.UInt:
      return kr(e.readBytes(16));
    case J.Buffer:
      const r = e.readUInt32BE();
      return Aw(e.readBytes(r));
    case J.BoolTrue:
      return Sw();
    case J.BoolFalse:
      return Ew();
    case J.PrincipalStandard:
      const s = Eo(e);
      return Zk(s);
    case J.PrincipalContract:
      const i = Eo(e), o = Vn(e);
      return xw(i, o);
    case J.ResponseOk:
      return r8(Yn(e));
    case J.ResponseErr:
      return n8(Yn(e));
    case J.OptionalNone:
      return vw();
    case J.OptionalSome:
      return kw(Yn(e));
    case J.List:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Yn(e));
      return s8(c);
    case J.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Vn(e).content;
        if (T === void 0)
          throw new Nn('"content" is undefined');
        h[T] = Yn(e);
      }
      return xi(h);
    case J.StringASCII:
      const l = e.readUInt32BE(), y = R4(e.readBytes(l));
      return Je(y);
    case J.StringUTF8:
      const g = e.readUInt32BE(), S = sd(e.readBytes(g));
      return i8(S);
    default:
      throw new Nn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const j8 = (t) => t.length % 2 == 0 ? t : `0${t}`, R8 = (t, e) => t.padEnd(e, "0"), _w = (t, e) => t ? To(t).length > e : !1;
function Qu(t) {
  return ty(t);
}
const aa = (t) => wk(ld(t)), gd = (t) => Ot(Xk(t)), z8 = (t) => Ot(aa(t)), G8 = (t) => {
  const e = aa(t), n = dl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = aa(n);
  return Ot(r);
}, K8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = aa(r);
  return Ot(s);
}, V8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = He(n), s = ld(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = He(i), a = aa(o);
  return Ot(a);
};
function Y8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Uw(t) {
  const e = _e(t);
  return `0x${Ot(e)}`;
}
function X8(t) {
  return Yn(t);
}
const io = (t) => {
  try {
    return Ii.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function yd() {
  return {
    type: pt.MessageSignature,
    data: Ot(new Uint8Array(hl))
  };
}
function Ow(t, e, n, r) {
  const s = dd(0, t, 1, [So(e)]).hash160, i = Bo(So(e)) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: yn(n, !1),
    fee: yn(r, !1),
    keyEncoding: i,
    signature: yd()
  };
}
function ca(t) {
  return "signature" in t;
}
function U0(t) {
  return t === ce.SerializeP2SH || t === ce.SerializeP2WSH;
}
function q8(t) {
  return t === ce.SerializeP2SHNonSequential || t === ce.SerializeP2WSHNonSequential;
}
function O0(t) {
  const e = Qu(t);
  return e.nonce = 0, e.fee = 0, ca(e) ? e.signature = yd() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function W8(t) {
  const e = [
    t.hashMode,
    me(t.signer),
    _s(t.nonce, !1, 8),
    _s(t.fee, !1, 8),
    t.keyEncoding,
    fd(t.signature)
  ];
  return He(e);
}
function Z8(t) {
  const e = [
    t.hashMode,
    me(t.signer),
    _s(t.nonce, !1, 8),
    _s(t.fee, !1, 8)
  ], n = hd(t.fields);
  e.push(pd(n));
  const r = new Uint8Array(2);
  return Y4(r, t.signaturesRequired, 0), e.push(r), He(e);
}
function Q8(t, e) {
  const n = Ot(e.readBytes(20)), r = BigInt(`0x${Ot(e.readBytes(8))}`), s = BigInt(`0x${Ot(e.readBytes(8))}`), i = e.readUInt8Enum(Ae, (a) => {
    throw new Nn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.SerializeP2WPKH && i != Ae.Compressed)
    throw new Nn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Wu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function J8(t, e) {
  const n = Ot(e.readBytes(20)), r = BigInt("0x" + Ot(e.readBytes(8))), s = BigInt("0x" + Ot(e.readBytes(8))), i = Mw(e, pt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case pt.PublicKey:
        Bo(u.contents) || (o = !0);
        break;
      case pt.MessageSignature:
        if (u.pubKeyEncoding === Ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ei("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.SerializeP2WSH || t === ce.SerializeP2WSHNonSequential))
    throw new ei("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Dl(t) {
  return ca(t) ? W8(t) : Z8(t);
}
function Fl(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new Nn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH ? Q8(e, t) : J8(e, t);
}
function Hw(t, e, n, r) {
  const i = t + Ot(new Uint8Array([e])) + Ot(_s(n, !1, 8)) + Ot(_s(r, !1, 8));
  if (me(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return gd(me(i));
}
function Dw(t, e, n) {
  const r = 33 + hl, s = Bo(e) ? Ae.Compressed : Ae.Uncompressed, i = t + j8(s.toString(16)) + n.data, o = me(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return gd(o);
}
function t$(t, e, n, r, s) {
  const i = Hw(t, e, n, r), o = d8(s, i), a = h8(s), c = Dw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Fw(t, e, n, r, s, i) {
  const o = Hw(t, e, n, r), a = So(o8(o, i, s)), c = Dw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function e$() {
  const t = Ow(ce.SerializeP2PKH, "", 0, 0);
  return t.signer = E8().hash160, t.keyEncoding = Ae.Compressed, t.signature = yd(), t;
}
function H0(t, e, n) {
  return ca(t) ? n$(t, e, n) : r$(t, e, n);
}
function n$(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Fw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = dd(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ei(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function r$(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case pt.PublicKey:
        Bo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case pt.MessageSignature:
        c.pubKeyEncoding === Ae.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Fw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (U0(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new ei("Too many signatures");
        break;
    }
  if (U0(t.hashMode) && o !== t.signaturesRequired || q8(t.hashMode) && o < t.signaturesRequired)
    throw new ei("Incorrect number of signatures");
  if (i && (t.hashMode === ce.SerializeP2WSH || t.hashMode === ce.SerializeP2WSHNonSequential))
    throw new ei("Uncompressed keys are not allowed in this hash mode");
  const a = dd(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ei(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function jw(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function Rw(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ow(ce.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function D0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return jw(O0(t.spendingCondition));
      case Le.Sponsored:
        return Rw(O0(t.spendingCondition), e$());
      default:
        throw new Pc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function s$(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return H0(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return H0(t.spendingCondition, e, Le.Standard);
    default:
      throw new Pc("Invalid origin auth type");
  }
}
function i$(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: yn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: yn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function o$(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: yn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function a$(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: yn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function c$(t, e) {
  const n = {
    ...e,
    nonce: yn(e.nonce, !1),
    fee: yn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function l$(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(Dl(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(Dl(t.spendingCondition)), e.push(Dl(t.sponsorSpendingCondition));
      break;
  }
  return He(e);
}
function u$(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new Nn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = Fl(t), jw(n);
    case Le.Sponsored:
      n = Fl(t);
      const r = Fl(t);
      return Rw(n, r);
  }
}
class f$ {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: yn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Z4, this.postConditionMode = i ?? xo.Deny, this.postConditions = s ?? hd([]), o)
      this.anchorMode = nk(o);
    else
      switch (r.payloadType) {
        case _t.Coinbase:
        case _t.CoinbaseToAltRecipient:
        case _t.NakamotoCoinbase:
        case _t.PoisonMicroblock:
        case _t.TenureChange:
          this.anchorMode = En.OnChainOnly;
          break;
        case _t.ContractCall:
        case _t.SmartContract:
        case _t.VersionedSmartContract:
        case _t.TokenTransfer:
          this.anchorMode = En.Any;
          break;
      }
  }
  signBegin() {
    const e = Qu(this);
    return e.auth = D0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Qu(this);
    return e.auth = D0(e.auth), e.txid();
  }
  verifyOrigin() {
    return s$(this.auth, this.verifyBegin());
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
      const r = Bo(e);
      n.fields.push(ro(r ? Ae.Compressed : Ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = t$(n, r, e.fee, e.nonce, s);
    return ca(e) ? e.signature = i : e.fields.push(ro(s.data.byteLength === uw ? Ae.Compressed : Ae.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return gd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = c$(this.auth, e);
  }
  setFee(e) {
    this.auth = i$(this.auth, e);
  }
  setNonce(e) {
    this.auth = o$(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = a$(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new qs('"version" is undefined');
    if (this.chainId === void 0)
      throw new qs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new qs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new qs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new qs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return bi(n, this.chainId, 0), e.push(n), e.push(l$(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(pd(this.postConditions)), e.push(Lw(this.payload)), He(e);
  }
}
function _c(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new qo(me(t.slice(2))) : e = new qo(me(t)) : t instanceof Uint8Array ? e = new qo(t) : e = t;
  const n = e.readUInt8Enum(Bc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = u$(e), i = e.readUInt8Enum(En, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(xo, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Mw(e, pt.PostCondition), c = m8(e);
  return new f$(n, s, c, a, o, i, r);
}
const d$ = Jk, Wo = kr, h$ = Aw;
const p$ = /* @__PURE__ */ new Set([4001, -31001]), g$ = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], y$ = ["result", "data", "payload", "response", "params"], F0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], yl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Bi = () => {
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
}, w$ = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), zw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => w$(i, r)) === s
  );
}, Gw = (t) => t ? zw(Bi()).some(
  (e) => {
    var n;
    return e.id === t && (yl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Kw = () => {
  if (typeof window > "u")
    return;
  const t = Bi(), e = zw(t).filter(
    (n) => {
      var r;
      return yl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Kr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of g$) {
    const r = Kr(t, n) ?? (t === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, b$ = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Bi(), n = Kr(e, t) ?? (e === window ? void 0 : Kr(window, t)) ?? nl(t);
  if (n)
    return n;
  if (yl(t) || Gw(t))
    return Kw();
}, Wa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, m$ = ["blockstack-session", "blockstack"], x$ = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of m$) {
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
x$();
const Vw = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Mn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, S$ = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Vw(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, E$ = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Vw(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Ju = (t, e = "mainnet") => {
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
      return Ju(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Ju(r, e);
  }
  return e;
}, si = (t) => {
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
    return io(s) ? s : null;
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
  return typeof n.mainnet == "string" && io(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && io(n.testnet) ? n.testnet.trim() : null;
}, j0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Yw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && p$.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, Si = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Mn(n == null ? void 0 : n.message) ?? Mn(e.message) ?? Mn(e.error) ?? Mn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, vo = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw Si(e);
    if (e.status === "error")
      throw Si(e.result ?? e);
  }
  return t;
}, R0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return vo(r);
  } catch (r) {
    throw Si(r);
  }
}, Xw = () => Kw(), wd = () => {
  if (typeof window > "u")
    return;
  const t = Bi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Kr(t, e) ?? (t === window ? void 0 : Kr(window, e));
    if (n)
      return n;
  }
}, z0 = () => {
  if (typeof window > "u")
    return;
  const t = wd();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Bi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Kr(e, n) ?? (e === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, lc = (t) => {
  var r, s;
  const e = fi();
  if (yl(e) || Gw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Bi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Xw();
}, jl = (t) => {
  const e = E$(t);
  if (!e)
    return null;
  try {
    const n = _c(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, Uc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = jl(t), r = S$(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Mn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = Uc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of F0)
    if (jl(s[a])) {
      i = Mn(s[a]);
      break;
    }
  const o = Mn(s.txId) || Mn(s.txid) || Mn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Mn(s.txRaw) ?? void 0
    };
  for (const a of F0) {
    const c = jl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Mn(s[a]) ?? void 0
      };
  }
  for (const a of y$) {
    const c = s[a], u = Uc(c, e + 1);
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
}, Rl = (t) => {
  const e = Uc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, A$ = (t) => {
  const e = Uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, v$ = (t) => ({
  ...t,
  fee: si(t.fee),
  nonce: si(t.nonce),
  sponsored: t.sponsored === !0
}), G0 = (t) => ({
  recipient: t.recipient,
  amount: si(t.amount) ?? "0",
  memo: t.memo,
  network: Ju(t.network),
  address: t.stxAddress,
  fee: si(t.fee),
  nonce: si(t.nonce),
  sponsored: t.sponsored ?? !1
}), qw = "WALLET_ADDRESS_MISMATCH", k$ = 45e3;
let Zo = null;
const tf = (t) => {
  t && (Zo = { address: t, at: Date.now() });
}, $$ = () => {
  Zo = null;
}, I$ = () => Zo && Date.now() - Zo.at <= k$ ? Zo.address : null, L$ = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, C$ = async (t) => {
  $$();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = vo(await t.request("wallet_connect")), n = la(e);
  return tf(n), n;
}, T$ = async (t, e, n, r) => {
  try {
    return vo(await t.request(e, n));
  } catch (s) {
    const i = Si(s);
    if (!L$(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await C$(t);
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
        { code: o ? qw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return vo(await t.request(e, n));
    } catch (a) {
      throw Si(a);
    }
  }
};
let K0 = 3e4;
const B$ = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${K0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, K0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, M$ = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: qw }
      );
    return c;
  }, s = I$();
  if (s)
    return Wa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Wa(n, "account-read");
  try {
    const c = vo(
      await B$(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = la(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Yw(c))
      throw Si(c);
    Wa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return tf(i), r(i, "wallet_getAccount");
  let o;
  Wa(n, "account-reconnect");
  try {
    o = vo(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), Si(c);
  }
  const a = la(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return tf(a), r(a, "wallet_connect");
}, N$ = async (t, e) => {
  if (!lc(t)) {
    const i = await R0(
      t,
      "stx_transferStx",
      G0(e)
    );
    return Rl(i);
  }
  const n = wd();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await R0(
      n,
      "stx_transferStx",
      G0(e)
    );
    return Rl(i);
  }
  const r = Xw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await M$(r, e.stxAddress);
  const s = await T$(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: si(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: si(e.fee) } : {}
    },
    e.stxAddress
  );
  return Rl(s);
}, P$ = () => fi(), Ww = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = fi(), e = t ? b$(t) : void 0;
  if (e)
    return e;
  const n = Bi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, V0 = (t, e) => {
  const n = Ww(), r = v$({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, A$(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Va(r, e);
  if (lc(n) && !wd()) {
    const s = z0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: fi(),
        route: "legacy-transaction-request"
      }), Va(r, s);
  }
  return void N$(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (j0(s) && lc(n)) {
      const a = z0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: fi(),
          route: "legacy-transaction-request"
        }), Va(r, a);
        return;
      }
    }
    if (j0(s) && !lc(n)) {
      Va(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Yw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, _$ = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Y0 = (t) => Uw(t).replace(/^0x/, ""), X0 = "This wallet cannot sign messages. Try Xverse or Leather.", q0 = (t) => typeof (t == null ? void 0 : t.request) == "function", W0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", U$ = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, O$ = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function H$(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: Y0(e.message),
    domain: Y0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function D$(t, e) {
  const n = await B4({
    domain: e.domain,
    message: e.message,
    network: ul(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? _$()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Z0(t) {
  var s, i;
  const e = P$() || "", n = /xverse/i.test(e);
  let r = Ww();
  if (n && !W0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (W0(r))
    try {
      return await D$(r, t);
    } catch (o) {
      if (n || !q0(r) || !O$(o)) throw o;
    }
  if (!n && q0(r))
    try {
      return await H$(r, t);
    } catch (o) {
      throw U$(o) ? new Error(X0) : o;
    }
  throw new Error(X0);
}
const Q0 = 1000000n, Cs = 1000000n, Oc = 50n, Ue = 3000n, cr = 300n, Ho = 3000n, F$ = 50000n, zl = 200n, wl = 15000n, ln = (t) => t + Oc;
function nr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Q0}.${(n % Q0).toString().padStart(6, "0")}`;
}
function J0(t, e = cr) {
  return t <= Ue ? 0 : Number((t - Ue) / ln(e));
}
function Gl(t, e = 0n) {
  const n = Cs - t - e;
  return n > 0n ? n : 0n;
}
function j$(t, e = cr) {
  return t > Cs ? "over" : t < Ue + ln(e) ? "empty" : t < F$ ? "low" : "ok";
}
const R$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", z$ = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", G$ = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function K$(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || G$.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== R$ + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Zw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Kl = 3, V$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [ef, Qw] = Zw.split("."), zn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function nf(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function Y$(t) {
  return zn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Ns(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Jw(t, e = []) {
  const n = await Ns(`/v2/contracts/call-read/${ef}/${Qw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ef, arguments: e.map((r) => "0x" + zn(_e(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Sr(Yn(n.result));
}
async function X$() {
  const t = await Ns(`/v2/contracts/source/${ef}/${Qw}?proof=0`);
  if (typeof t.source != "string" || await Y$(t.source) !== z$) throw Error("Deployed source does not match the tested helper.");
  if (K$(await Jw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function tb(t) {
  return t.startsWith("SP") && io(t) && !t.includes(".");
}
async function q$(t) {
  var r;
  if (!tb(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Ns(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Ns(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function W$(t) {
  const e = await Ns(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Z$(t, e) {
  var s, i;
  const n = await Jw("get-owner", [Wo(t), Wo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !tb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function Q$(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: nf(t), signal: AbortSignal.timeout(15e3) });
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
async function J$(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function t5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = _c(nf(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || no(Go(Mc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || no(r.contractAddress) + "." + r.contractName.content !== Zw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || zn(_e(r.functionArgs[0])) !== zn(_e(Wo(t.core))) || zn(_e(r.functionArgs[1])) !== zn(_e(Wo(t.song))) || zn(_e(r.functionArgs[2])) !== zn(_e(h$(nf(t.id)))) || t.amount !== "50" || e.postConditionMode !== xo.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ia.Equal || i.principal.prefix !== 2 || no(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || no(r.contractAddress) + "." + r.contractName.content !== V$ || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || zn(_e(r.functionArgs[0])) !== zn(_e(Wo(t.song))) || typeof t.liked != "boolean" || zn(_e(r.functionArgs[1])) !== zn(_e(d$(t.liked))) || t.amount !== "0" || e.postConditionMode !== xo.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Sr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const e5 = "xtrata.xyz/radio/listening-wallet", n5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Rr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && io(t), r5 = (t) => ({
  domain: xi({ name: Je(e5), version: Je("1"), "chain-id": kr(1) }),
  message: xi({
    purpose: Je(n5),
    main: Je(t.main),
    listening: Je(t.listening),
    issued: kr(t.issued)
  })
}), eb = 100000n, s5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function i5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Rr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= eb).sort(s5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Za = 50;
function Hc(t) {
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
async function o5(t, e, n = 4) {
  if (!Rr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Za}&offset=${o}`, s = Hc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Za);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Za ? s : Hc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = i5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Za);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const _r = 50, a5 = 6, c5 = 20, tp = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function ep(t, e) {
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
async function l5(t, e, n) {
  if (!Rr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Hc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=0`));
    if (!s || s.total > a5 * _r) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = _r; o < s.total; o += _r) {
      const a = Hc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${_r}&offset=${u}`, a = ep(await e(o(0)), t);
      if (!a || a.total > c5 * _r) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = _r; u < a.total; u += _r) {
        const h = ep(await e(o(u)), t);
        if (!h || !h.rows.length) return { ok: !1 };
        for (const l of h.rows) c.add(l);
        for (const l of h.sent) i.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function u5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(tp).map((l, y) => {
    const g = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: g, kind: "gift", to: r.payer, at: y } : Rr(l.sender) && g >= eb ? { sender: l.sender, left: g, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: g, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Rr(l.recipient) && l.amount > 0n).sort(tp), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let g = y;
    for (const S of l) {
      if (g <= 0n) break;
      const v = S.left < g ? S.left : g;
      S.left -= v, g -= v;
    }
    return g;
  };
  for (const l of o) {
    const y = u(s.filter((g) => g.to === l.recipient), l.amount);
    y > 0n && u(s, y);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, y) => l + y.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const h = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const y = `${l.kind}:${l.to ?? ""}`, g = h.get(y);
    g ? (g.amount += l.left, g.newest = Math.max(g.newest, l.at)) : h.set(y, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...h.values()].sort((l, y) => l.newest - y.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function f5(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, h) => u.newest - h.newest), r = t.find((u) => u.kind === "gift"), s = t.filter((u) => u.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, h) => u + h.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((u, h) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = h === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function np(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const uc = [100, 250, 500], d5 = (t, e) => BigInt(t) * ln(e), Do = ["prepared", "signed", "unknown", "pending"], h5 = 30 * 6e4, Dc = 6e4, Xi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, p5 = 3e3, Fc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Vl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function g5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, h = !1, l = !1, y = !1, g = null, S = !1, v = "", T = "", O = 0, F, k = null, C, _ = [], Y, rt = -1 / 0;
  const X = /* @__PURE__ */ new Set();
  let q = null, $ = !1, U = 0, m = null, N = null, K = !1, B = null, it = !1, W = null, $t = !1, L = !1, D = !1, ct = !1, ot = !1, lt = 0, Pt = null, ne = Promise.resolve();
  const kt = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? cr.toString()), Gt = (p) => !!i && !(i.features ?? []).includes(p), vt = (p, A) => `xtrata.ppp.v1.${p}:${A}`, De = "xtrata.ppp.v1.as-main", Ht = () => {
    if (t.main()) return;
    const p = t.store.get(De);
    return p && Rr(p) ? p : void 0;
  }, Lt = () => t.main() ?? Ht(), jt = (p = i == null ? void 0 : i.address) => {
    if (!p) return [];
    try {
      const A = JSON.parse(t.store.get(vt("entries", p)) || "[]");
      return Array.isArray(A) ? A : [];
    } catch {
      return [];
    }
  }, le = (p) => {
    const A = [p, ...jt(p.address).filter((j) => !(j.txid === p.txid && j.kind === p.kind))].slice(0, 200);
    t.store.set(vt("entries", p.address), JSON.stringify(A));
  }, kn = (p = i == null ? void 0 : i.address) => !!p && t.store.get(vt("on", p)) !== "0", wn = (p) => {
    i != null && i.address && t.store.set(vt("on", i.address), p ? "1" : "0");
  }, Te = () => jt().filter((p) => Do.includes(p.status)), qe = () => pe() ? [...Te(), ...jt(oe()).filter((p) => Do.includes(p.status))] : Te(), Ve = () => en(i == null ? void 0 : i.address), en = (p) => {
    if (!p) return null;
    try {
      return JSON.parse(t.store.get(vt("deposit", p)) || "null");
    } catch {
      return null;
    }
  }, Re = (p, A = i == null ? void 0 : i.address) => {
    A && t.store.set(vt("deposit", A), JSON.stringify(p));
  };
  let Xt = null;
  const Ye = (p = Dc) => {
    const A = t.now();
    Xt = { since: Xt && A < Xt.until ? Xt.since : A, until: Math.max((Xt == null ? void 0 : Xt.until) ?? 0, A + p) };
  }, nn = () => !!Xt && t.now() < Xt.until && (o === void 0 || o < Ue + ln(kt())), Fe = () => !!Ve() || nn(), oe = () => Gt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), pe = () => !!(i != null && i.address) && oe() !== i.address, Xn = () => pe() ? c && c.for === oe() ? c.value : void 0 : o, lr = (p) => p !== void 0 && p < Ue + zl, I = () => Te().filter((p) => t.now() - p.created > h5 && X.has(p.txid)), x = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Lt() || r === Lt() && !e.allowed), P = () => x() && !(i != null && i.linked), G = () => {
    const p = Lt();
    return !P() && !!p && !!(i != null && i.linked) && i.linked !== p;
  }, gt = (p) => vt("return-to", p), wt = (p = i == null ? void 0 : i.address) => {
    if (!p) return;
    const A = t.store.get(gt(p));
    return A && Rr(A) && A !== p ? A : void 0;
  }, qt = (p = i == null ? void 0 : i.address) => q && q.for === p ? q.res : null;
  function ye() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const p = wt();
    if (p) return { to: p, kind: "chosen" };
    const A = qt();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const Rt = (p) => vt("gift", p);
  function Kt() {
    const p = i == null ? void 0 : i.address;
    if (!p) return null;
    if ((B == null ? void 0 : B.for) === p) return B.info;
    try {
      const A = JSON.parse(t.store.get(Rt(p)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  async function re() {
    var dt;
    const p = i == null ? void 0 : i.address;
    if (!p || !t.giftInfo || !((dt = e == null ? void 0 : e.gifts) != null && dt.enabled) || it) return;
    const A = (B == null ? void 0 : B.for) === p ? B : null, j = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && t.now() - A.at < j) return;
    it = !0;
    const Z = Kt();
    try {
      const H = await t.giftInfo(p);
      B = { for: p, info: H, ok: !0, at: t.now() }, t.store.set(Rt(p), JSON.stringify(H));
    } catch {
      B = { for: p, info: Z, ok: !1, at: t.now() };
    } finally {
      it = !1;
    }
  }
  const At = () => jt().reduce((p, A) => Do.includes(A.status) ? p + BigInt(A.amount || "0") + BigInt(A.fee || "0") : p, 0n);
  function Yt() {
    if (o === void 0) return 0;
    const p = o - At() - BigInt(ve.length) * ln(kt());
    return p > 0n ? J0(p, kt()) : 0;
  }
  const St = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Wt = "EMPTY — ADD STX TO PLAY";
  function ue() {
    if (!(e != null && e.here)) return null;
    const p = (A, j) => ({ reason: A, text: j });
    switch (Me()) {
      case "connect":
      case "wrong-wallet":
        return p("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return p("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return p("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return p("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return p("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return p("locked", "UNLOCK TO LISTEN");
      case "link":
        return p("link", "FINISH SETUP TO LISTEN");
      case "over":
        return p("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return Fe() ? p("arriving", "YOUR PLAYS ARE ARRIVING") : p("out", pe() ? St : Wt);
      case "ready":
        return !kn() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? p("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : D ? Yt() < 1 ? p("out", pe() ? St : Wt) : null : p("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const Be = () => {
    var p;
    return !!(i != null && i.address) && pe() && !!((p = Kt()) != null && p.player);
  };
  function fe() {
    return Be() ? { locked: !0, known: !0 } : null;
  }
  const rn = 3 * 6e4, bn = () => !!Kt() && !!t.history && !(i != null && i.linked);
  async function qr() {
    const p = i.address, A = Kt(), { balance: j, nonce: Z } = await t.chain.account(p), dt = await t.history(p, !0);
    if (!dt.ok) return null;
    const H = u5({ self: p, balance: j, inbound: dt.inbound, outgoing: dt.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!H.ok) return null;
    const at = f5(H.parts, Ho);
    return { balance: j, nonce: Z, parts: H.parts, steps: at.steps, tooSmall: at.tooSmall.length };
  }
  const qn = () => $t ? { state: "unavailable" } : !W || t.now() - W.at > rn || o !== void 0 && o !== W.balance ? { state: "none" } : W.plan;
  function Me() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const p = Lt();
    if (!P()) {
      if (!p) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : G() ? "wrong-wallet" : i.state === "known" ? "locked" : !P() && i.linked !== p ? "link" : o === void 0 ? "loading" : o > Cs ? "over" : o < Ue + ln(kt()) ? "fund" : "ready" : "loading";
  }
  const $n = () => {
    var p, A, j, Z, dt;
    return {
      step: Me(),
      busy: u,
      message: v,
      error: T,
      notice: Os(),
      gate: e,
      main: Lt(),
      mainConnected: !!t.main(),
      standIn: Ht(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : j$(o, kt()),
      playsLeft: o === void 0 ? 0 : J0(o, kt()),
      allowance: o === void 0 ? Cs : Gl(o, BigInt(((p = Ve()) == null ? void 0 : p.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: kn(),
      entries: jt(),
      depositTxid: ((A = Ve()) == null ? void 0 : A.txid) ?? F,
      depositPending: Fe(),
      arrival: Fe() ? { since: ((j = Ve()) == null ? void 0 : j.at) ?? (Xt == null ? void 0 : Xt.since) ?? t.now(), graceMs: Dc } : null,
      walletOutdated: Gt("like"),
      linkedListening: Y && Y === Lt() ? _.map((H) => H.listening) : [],
      serverLinked: !!k && C === `${Lt()}:${i == null ? void 0 : i.address}`,
      stuck: I().length,
      armed: ct,
      queued: ve.length,
      solo: P(),
      returnTo: (Z = ye()) == null ? void 0 : Z.to,
      returnToKind: (dt = ye()) == null ? void 0 : dt.kind,
      funderState: (() => {
        const H = qt();
        return H ? H.ok ? H.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const H = qt();
        return !!H && H.ok && H.distinct > 1;
      })(),
      walletCannotSolo: P() && Gt("standalone"),
      walletCannotMulti: Gt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((H) => H !== Lt() && H !== (i == null ? void 0 : i.linked)),
      creditedTo: P() && (i != null && i.address) && (m == null ? void 0 : m.for) === i.address && m.main ? m.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(vt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (N == null ? void 0 : N.for) === i.address && N.unused,
      gift: (() => {
        const H = Kt();
        return H ? { player: H.player, from: H.from, source: H.source, amount: H.amount } : null;
      })(),
      giftPlays: Kt() ? Yt() : 0,
      playCost: ln(kt()),
      giftStop: ue(),
      albumLock: fe(),
      returnPlan: qn(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Gt("slots"),
      likeFunds: (() => {
        var tt;
        const H = oe();
        if (!H || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const at = Xn();
        return { address: H, balance: at, low: lr(at), album: pe(), pending: !!en(H), txid: (tt = en(H)) == null ? void 0 : tt.txid, main: Lt() };
      })()
    };
  }, Os = () => O ? O < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Dt = (p, A = "") => {
    v = p, T = A, t.changed();
  };
  async function We(p, A) {
    if (!u) {
      u = p, T = "", t.changed();
      try {
        await A();
      } catch (j) {
        const Z = j instanceof Error ? j.message : String(j);
        T = /Cancelled in the listening wallet/.test(Z) ? "" : Z, T || (v = "Not now. Nothing was signed.", ot = !0);
      } finally {
        u = null, await In(!0);
      }
    }
  }
  const sn = () => !!(e != null && e.enabled) && e.here && (P() || !!Lt() && e.allowed), Hs = () => sn() && !G(), ur = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", On = () => {
    if (G()) throw new Error(ur());
  };
  async function Wr() {
    if (!sn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const xe = (p) => {
    const A = Lt();
    return p.request("listening.status", A ? { main: A } : void 0);
  };
  async function mn(p = !1) {
    i != null && i.address && (!p && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Ds(p)));
  }
  async function Ds(p = !1) {
    const A = oe();
    if (!(!pe() || !A || (i == null ? void 0 : i.state) !== "unlocked") && !(!p && (c == null ? void 0 : c.for) === A && t.now() - c.at < 3e4))
      try {
        c = { for: A, value: await t.chain.balance(A), at: t.now() };
      } catch {
      }
  }
  async function Mo(p) {
    if ((Y !== p || t.now() - rt >= 6e4) && (_ = await t.links(p), Y = p, rt = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === p) return;
    const A = `${p}:${i.address}`;
    C === A && k || (k = _.find((j) => j.listening === i.address) ?? null, C = A);
  }
  async function No() {
    const p = i == null ? void 0 : i.address;
    if (!P() || !p || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const A = qt(p);
    if (A != null && A.ok && A.funder) return;
    const j = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, U - 1), 30 * 6e4);
    if (!(q && q.for === p && t.now() - q.at < j)) {
      $ = !0;
      try {
        q = { for: p, res: await t.funder(p), at: t.now() };
      } catch {
        q = { for: p, res: { ok: !1 }, at: t.now() };
      } finally {
        $ = !1;
      }
      U = q.res.ok ? 0 : U + 1;
    }
  }
  async function Fs() {
    const p = i == null ? void 0 : i.address;
    if (!(!P() || !p || i != null && i.linked || !t.mainOf || K) && !(m && m.for === p && (m.ok || t.now() - m.at < 6e4))) {
      K = !0;
      try {
        m = { for: p, main: await t.mainOf(p), ok: !0, at: t.now() };
      } catch {
        m = { for: p, main: null, ok: !1, at: t.now() };
      } finally {
        K = !1;
      }
    }
  }
  async function js() {
    const p = i == null ? void 0 : i.address;
    if (!(!p || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (N == null ? void 0 : N.for) === p) && t.store.get(vt("created", p)) !== "1")
      try {
        N = { for: p, unused: await t.chain.confirmedNonce(p) === 0n };
      } catch {
      }
  }
  async function fr() {
    var dt;
    const p = i == null ? void 0 : i.address;
    if (!p) return !1;
    let A, j = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const H of qe())
      try {
        const at = await t.chain.transaction(H.txid);
        if (!at) {
          if (X.add(H.txid), t.now() - H.created > 15 * 6e4 && !Z.has(H.address) && Z.set(H.address, await t.chain.confirmedNonce(H.address)), A = Z.get(H.address), A !== void 0 && A > BigInt(H.nonce)) {
            le({ ...H, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((H.status === "unknown" || H.status === "signed") && H.raw)
            try {
              await t.chain.broadcast(H.raw, H.txid), le({ ...H, status: "pending" });
            } catch (ht) {
              Xi(ht) && le({ ...H, status: "failed", note: ht.message, raw: void 0 });
            }
          continue;
        }
        X.delete(H.txid);
        const tt = String(at.tx_status);
        if (tt === "success" && at.canonical !== !1 && at.is_unanchored === !1) {
          if (le({ ...H, status: "confirmed", confirmedAt: t.now(), actualFee: String(at.fee_rate ?? H.fee), raw: void 0 }), j = !0, H.kind === "like" && (S = !0, H.status !== "confirmed" && typeof H.liked == "boolean"))
            try {
              (dt = t.likeConfirmed) == null || dt.call(t, H.song, H.liked);
            } catch {
            }
        } else tt.startsWith("abort_") || tt.startsWith("dropped_") ? le({ ...H, status: "failed", note: tt, raw: void 0 }) : H.status !== "pending" && le({ ...H, status: "pending" });
      } catch {
      }
    for (const H of pe() ? [p, oe()] : [p]) {
      const at = en(H);
      if (at)
        try {
          const tt = await t.chain.transaction(at.txid), ht = String((tt == null ? void 0 : tt.tx_status) ?? "");
          (ht === "success" && tt.is_unanchored === !1 || ht.startsWith("abort_") || ht.startsWith("dropped_") || !tt && t.now() - at.at > 2 * 36e5) && (Re(null, H), ht === "success" && Ye(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return j;
  }
  async function In(p = !1) {
    var A;
    try {
      const j = Lt();
      if ((p || !e || r !== j || t.now() - n > 3e5) && (e = await t.config(j), n = t.now(), r = j), !e.enabled || !e.here || !P() && (!j || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ct && Zr(), t.changed();
        return;
      }
      await Wr(), i = await xe(s), G() && i.state === "unlocked" && (Nr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await xe(s)), j && e.allowed && await Mo(j), await mn(p), await No(), await Fs(), await js(), await re(), await fr() && await mn(!0), await Ds(), await Hn(), O = 0;
    } catch {
      O++;
    }
    if (Me() === "locked" ? Pi() : ct && Zr(), S) {
      S = !1;
      try {
        (A = t.likesChanged) == null || A.call(t);
      } catch {
      }
    }
    t.changed(), ve.length && !Mr && b();
  }
  async function Mi(p) {
    const A = i == null ? void 0 : i.root;
    if (!A || i != null && i.slot || !(i != null && i.address) || Gt("slots")) return;
    const j = Number(t.store.get(vt("slot", A)));
    if (!(!Number.isSafeInteger(j) || j < 1))
      try {
        const { balance: Z } = await t.chain.account(i.address);
        if (Z >= Ue + ln(kt())) return;
        await p.request("listening.openSlot", { slot: j }), i = await xe(p), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Ni(p, A) {
    var H;
    On();
    const j = !(i != null && i.address) || kn(i.address), Z = i != null && i.linked ? (H = t.nameOf) == null ? void 0 : H.call(t, i.linked) : void 0;
    await p.request("listening.unlock", { mode: "unlock", terms: j ? Rs() : void 0, anyPasskey: A, ...Lt() ? { main: Lt() } : {}, ...Z ? { label: Z } : {} }), i = await xe(p), j && (kn(i.address) ? await dr() : await p.request("listening.stop")), await Mi(p), Dt(j ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const dt = g;
    g = null, dt && t.now() - dt.at < 12e4 && setTimeout(() => void In(!0).then(() => z(dt)), 0);
  }
  function Pi() {
    ct || u || ot || lt >= 3 || !s || !(i != null && i.address) || (ct = !0, ne = (async () => {
      try {
        await Ni(s, !1), lt = 0;
      } catch (p) {
        const A = p instanceof Error ? p.message : String(p);
        /Cancelled in the listening wallet/.test(A) ? Pt || (ot = !0, Dt("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (lt++, T = A);
      } finally {
        ct = !1;
        const p = Pt;
        Pt = null, p ? await p() : await In(!0);
      }
    })());
  }
  async function Zr(p) {
    ct && (Pt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await ne), p && await p(), t.changed();
  }
  const Rs = () => ({
    fee: kt().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Cs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function dr() {
    if (!(i != null && i.address)) return !1;
    if (D || (D = await t.tabLock(i.address)), !D)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Wn(p, A) {
    const j = i.address, { balance: Z, nonce: dt } = A ?? await t.chain.account(j);
    o = Z;
    const H = await s.request("listening.prepareReturn", {
      mode: p.mode,
      balance: Z.toString(),
      nonce: dt.toString(),
      fee: Ho.toString(),
      ...p.amount !== void 0 ? { amount: p.amount.toString() } : {},
      ...p.linked ? {} : { destination: p.to }
    });
    if (H.recipient !== p.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const at = p.mode === "amount" ? p.amount : p.mode === "all" ? Z - Ho : Z - Cs - Ho, tt = _c(H.raw);
    if (Sr(tt.payload.recipient).value !== p.to || String(tt.payload.amount) !== H.amount || at !== void 0 && H.amount !== at.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const ht = {
      id: Vl(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: H.recipient,
      amount: H.amount,
      fee: H.fee,
      nonce: dt.toString(),
      created: t.now(),
      status: "signed",
      raw: H.raw,
      txid: H.txid
    };
    t.validate(ht), le(ht);
    try {
      await t.chain.broadcast(H.raw, H.txid), le({ ...ht, status: "pending" });
    } catch (bt) {
      throw le({ ...ht, status: "unknown", note: bt.message }), bt;
    }
    return H;
  }
  const zs = wl, Zn = Ho;
  async function _i(p, A, j) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Gt("slots") || Gt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = i.slot ?? 0;
    if (p === A || ![p, A].includes(Z) || ![p, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const dt = i.root ?? i.address, H = p === 0 ? dt : i.address, at = A === 0 ? dt : i.address, { balance: tt, nonce: ht } = await t.chain.account(H);
    if (tt < j + Zn + Ue) throw new Error(p === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const bt = await s.request("listening.signMove", { from: p, to: A, amount: j.toString(), fee: Zn.toString(), nonce: ht.toString(), balance: tt.toString() }), Zt = _c(bt.raw);
    if (bt.from !== H || bt.to !== at || bt.amount !== j.toString() || Sr(Zt.payload.recipient).value !== at || String(Zt.payload.amount) !== j.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const ke = {
      id: Vl(),
      address: H,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: at,
      amount: bt.amount,
      fee: bt.fee,
      nonce: ht.toString(),
      created: t.now(),
      status: "signed",
      raw: bt.raw,
      txid: bt.txid
    };
    t.validate(ke), le(ke);
    try {
      await t.chain.broadcast(bt.raw, bt.txid), le({ ...ke, status: "pending" });
    } catch (ge) {
      throw le({ ...ke, status: "unknown", note: ge.message }), ge;
    }
    return Re({ txid: bt.txid, amount: bt.amount, at: t.now() }, at), at === dt && dt !== i.address ? c = null : a = -1 / 0, bt;
  }
  let de = !1;
  const Ui = /* @__PURE__ */ new Map(), Br = (p) => vt("float", p);
  async function Hn() {
    if (de || (i == null ? void 0 : i.state) !== "unlocked" || !pe() || Gt("move") || Gt("rootLike") || !i.address) return;
    const p = i.address;
    if (t.store.get(Br(p)) === "1") return;
    const A = Kt();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const j = Xn();
    if (j === void 0 || o === void 0) return;
    if (!lr(j)) {
      t.store.set(Br(p), "1");
      return;
    }
    if (en(oe()) || Qr() || qe().length || o < zs * 4n + Ue + Zn) return;
    const Z = Ui.get(p);
    if (!(Z && (Z.n >= 3 || t.now() - Z.at < 5 * 6e4))) {
      de = !0, Ui.set(p, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: t.now() });
      try {
        await _i(i.slot ?? 0, 0, zs), t.store.set(Br(p), "1");
      } catch (dt) {
        console.warn("[radio] likes float not sent yet", dt);
      } finally {
        de = !1;
      }
    }
  }
  async function Oi(p) {
    if (Te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Gt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await qr().catch(() => null);
    if (!A)
      throw W = null, $t = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    $t = !1, o = A.balance;
    const j = { balance: A.balance, nonce: A.nonce };
    if (p === "excess") {
      const tt = np(A.parts) ?? wt();
      if (!tt) throw new Error("Choose where to send the excess first.");
      await Wn({ mode: "excess", to: tt, linked: !1 }, j), W = null, Dt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = A.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!W && W.balance === A.balance && t.now() - W.at <= rn && W.steps.length === Z.length && W.steps.every((tt, ht) => tt.to === Z[ht].to && tt.mode === Z[ht].mode && tt.send === Z[ht].send))) {
      W = {
        at: t.now(),
        balance: A.balance,
        steps: Z,
        parts: A.parts,
        plan: { state: "ready", steps: Z.map((tt) => ({ to: tt.to, kind: tt.kind, send: tt.send.toString() })), kept: A.tooSmall, excess: np(A.parts) }
      }, Dt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const H = Z[0], at = H.to ?? wt();
    if (!at) throw new Error("Choose where to send the rest first.");
    if (H.mode === "amount" && Gt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Wn({ mode: H.mode, to: at, linked: !1, ...H.mode === "amount" ? { amount: H.send } : {} }, j), W = null, Z.length === 1 ? (wn(!1), Dt("Returned ✓ Paying is off.")) : Dt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Dn = {
    forceRefresh: () => In(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (p) => {
      if (!t.main() && !(p !== null && !Rr(p))) {
        if (p === Ht()) return In(!0);
        t.store.set(De, p ?? ""), T = "", v = "", o = void 0, a = -1 / 0, c = null, await In(!0);
      }
    },
    create: () => We("Waiting for your passkey…", async () => {
      const p = await Wr();
      await p.request("listening.unlock", { mode: "create", terms: Rs(), ...t.main() ? { main: t.main() } : {} }), i = await xe(p), i.address && t.store.set(vt("created", i.address), "1"), wn(!0), Dt(P() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await dr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (p) => {
      p ? Ye() : Xt = null, t.changed();
    },
    giftSent: (p, A) => {
      !(i != null && i.address) || Ve() || (Re({ txid: p, amount: A.toString(), at: t.now() }), a = -1 / 0, B = null, Dt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (p) => {
      if (On(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Gt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Wr()).request("listening.bindSlot", { slot: p, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (p, A, j, Z) => {
      Re({ txid: j, amount: Z.toString(), at: t.now() }, A), B = null, await Dn.openAlbum(p), Dt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (p) => We("Opening…", async () => {
      if (On(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Gt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === p) return;
      Nr(), await s.request("listening.openSlot", { slot: p }), i = await xe(s), o = void 0, a = -1 / 0, W = null, $t = !1;
      const A = i.root;
      A && p > 0 && t.store.set(vt("slot", A), String(p)), Dt(p === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (p = !1) => {
      const A = () => We("Waiting for your passkey…", async () => Ni(await Wr(), p));
      return ct ? p ? Gt("cancel") ? (Dt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Zr(async () => {
        (Me() === "locked" || Me() === "intro") && await A();
      }) : ne : A();
    },
    link: () => We("Sign in your wallet…", async () => {
      On();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const A = (await t.links(p)).find((j) => j.listening === i.address);
      if (A)
        await s.request("listening.link", { main: p, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const j = { main: p, listening: i.address, issued: t.now() }, Z = await t.signWithMain(p, r5(j)), dt = await s.request("listening.link", { main: p, issued: j.issued, mainSignature: Z });
        await t.saveLink({ ...j, mainSignature: Z, listeningSignature: dt.listeningSignature }), rt = -1 / 0;
      }
      Dt("Linked ✓");
    }),
    deposit: () => We("Approve the deposit in your wallet…", async () => {
      On();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ve()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (nn()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await mn(!0);
      const A = Gl(o ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      F = await t.deposit(p, i.address, A), F && Re({ txid: F, amount: A.toString(), at: t.now() }), Dt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => We("Approve the top-up in your wallet…", async () => {
      On();
      const p = t.main(), A = oe();
      if (!p || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (en(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const j = await t.chain.balance(A);
      pe() ? c = { for: A, value: j, at: t.now() } : (o = j, a = t.now());
      const Z = Gl(j);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const dt = await t.deposit(p, A, Z);
      dt && Re({ txid: dt, amount: Z.toString(), at: t.now() }, A), Dt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (p) => We("Adding plays…", async () => {
      if (On(), !pe()) throw new Error("Open the album you want to add plays to first.");
      if (!uc.includes(p)) throw new Error("Choose one of the amounts offered.");
      const A = d5(p, kt());
      if (h || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (qe().length || Ve()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await _i(0, i.slot ?? 0, A), Dt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => We("Confirm in the listening wallet…", async () => {
      if (!Hs()) throw new Error("Connect your wallet first.");
      await dr(), await s.request("listening.approveSession", Rs()), wn(!0), Dt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => We("Clearing…", async () => {
      for (const p of I())
        await t.chain.transaction(p.txid) || le({ ...p, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Dt("Cleared ✓");
    }),
    switchOff: () => We("Switching off…", async () => {
      Nr(), await (s == null ? void 0 : s.request("listening.stop")), wn(!1), Dt("Music support is off. Playback is paused.");
    }),
    lock: () => We("Locking…", async () => {
      Nr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Dt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (p) => {
      const A = String(p ?? "").trim();
      if (!(i != null && i.address)) return Dt("", "Unlock the listening wallet first.");
      if (!Rr(A)) return Dt("", "Enter a standard mainnet address (it starts with SP).");
      if (A === i.address) return Dt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(gt(i.address), A), Dt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(gt(i.address), ""), t.changed();
    },
    returnFunds: (p) => We("Check the return in the listening wallet…", async () => {
      if (!Hs()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (bn()) return Oi(p);
      const A = ye();
      if (!A) throw new Error(P() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && Gt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Wn({ mode: p, to: A.to, linked: A.kind === "linked" }), p === "all" && wn(!1), Dt(p === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ve = [], Hi = 10, Di = 30 * 6e4;
  let Mr = !1;
  const Qr = () => h || !!u || l || y, Nr = () => {
    ve.length && (ve.length = 0, t.changed());
  };
  async function f(p) {
    if (!ve.some((A) => A.id === p.id) && !jt().some((A) => A.id === p.id) && (ve.push({ ...p, at: t.now() }), ve.length > Hi && ve.shift()), Qr() || Te().length) {
      const A = ve.length;
      v = `Queued ${A === 1 ? "this song" : A + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await b();
  }
  async function b() {
    if (!Mr) {
      Mr = !0;
      try {
        for (; ve.length; ) {
          for (; ve.length && t.now() - ve[0].at > Di; ) ve.shift();
          if (!ve.length || Qr() || await E(ve[0]) === "wait") return;
          ve.shift();
        }
      } finally {
        Mr = !1, t.changed();
      }
    }
  }
  async function E(p) {
    var A;
    h = !0;
    try {
      await In();
      const j = Me();
      if (j === "loading") return "wait";
      if (j !== "ready" || !kn() || !(i != null && i.session) || i.session.playsLeft < 1 || !D) return "done";
      if (Te().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const Z = i.address, { balance: dt, nonce: H } = await t.chain.account(Z);
      o = dt, a = t.now();
      const at = await t.chain.owner(Kl, p.song);
      if (at === Z || at === Lt()) return "done";
      const tt = await s.request("listening.signPlay", {
        core: Kl,
        song: p.song,
        receipt: p.id,
        fee: kt().toString(),
        nonce: H.toString(),
        balance: dt.toString()
      }), ht = {
        id: p.id,
        address: Z,
        kind: "play",
        core: Kl,
        song: p.song,
        recipient: at,
        amount: "50",
        fee: kt().toString(),
        nonce: H.toString(),
        created: t.now(),
        status: "signed",
        raw: tt.raw,
        txid: tt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(ht), le(ht);
      const bt = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`;
      try {
        await t.chain.broadcast(tt.raw, tt.txid), le({ ...ht, status: "pending" }), v = `♪ Paid ${bt}`, T = "";
      } catch (Zt) {
        le({ ...ht, status: Xi(Zt) ? "failed" : "unknown", note: Zt.message, ...Xi(Zt) ? { raw: void 0 } : {} }), T = Zt.message;
      }
      return i = await xe(s), "done";
    } catch (j) {
      const Z = j instanceof Error ? j.message : "payment unavailable";
      return (A = Kt()) != null && A.player ? (v = "Payment is taking a moment: " + Z, "wait") : (v = "This song played free: " + Z, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function d(p) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Me()) || Gt("like") ? !1 : (z(p), !0);
  }
  async function z(p) {
    const A = p.title ? `“${p.title}”` : `song #${p.song}`, j = (je) => {
      var Ze;
      T = je, v = "";
      try {
        (Ze = t.likeFailed) == null || Ze.call(t, p.song);
      } catch {
      }
      t.changed();
    }, Z = pe(), dt = Me(), H = Lt(), at = Z && (dt === "fund" || dt === "over") ? "ready" : dt, tt = P() ? oe() : H;
    if (at === "locked") {
      g = { ...p, at: t.now() }, Dt(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (at === "wrong-wallet") return j(ur());
    if (at === "link") return j("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (P() && Gt("standalone")) return j("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (at === "fund") return j("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (at === "over") return j("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Ds(!0);
      const je = Xn();
      if (lr(je))
        return t.changed(), j(Fc);
    }
    if (at !== "ready" || !tt) return j("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return j("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!D) return j("Pay-per-play is running in another tab. Like from that tab.");
    const ht = jt(oe()).find((je) => je.kind === "like" && je.song === p.song);
    if (ht && Do.includes(ht.status))
      return j(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (l) return j("One like at a time: your last one is still being sent.");
    if ((ht == null ? void 0 : ht.status) === "confirmed" && t.now() - (ht.confirmedAt ?? 0) < p5)
      return j(`Your like for ${A} has only just confirmed. Try again in a moment.`);
    let bt;
    y = !0;
    try {
      bt = t.likeState ? (await t.likeState(tt, p.song)).by : p.likedBy ?? [];
    } catch {
      bt = p.likedBy;
    } finally {
      y = !1;
    }
    if (!bt) return j(`Could not check ${A} right now. Try the heart again.`);
    const Zt = oe(), ge = ((ht == null ? void 0 : ht.status) === "confirmed" && typeof ht.liked == "boolean" && t.now() - (ht.confirmedAt ?? ht.created) < 5 * 6e4 ? ht.liked : void 0) ?? bt.includes(Zt);
    if (!ge && bt.some((je) => je !== Zt)) return j(P() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${bt.includes(H) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ut({ song: p.song, liked: !ge, title: p.title, artist: p.artist });
  }
  async function ut(p) {
    var Z, dt, H;
    if (l) {
      Dt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const A = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`, j = t.wait ?? ((at) => new Promise((tt) => setTimeout(tt, at)));
    try {
      Dt(`${p.liked ? "Liking" : "Unliking"} ${A}…`);
      const at = t.now() + 12e4;
      for (; h || (pe() ? jt(oe()).some((ge) => Do.includes(ge.status)) : Te().length); ) {
        if (t.now() > at) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await j(5e3), await In(!0);
      }
      if (!pe() && Me() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const tt = oe(), { balance: ht, nonce: bt } = await t.chain.account(tt);
      if (pe() ? c = { for: tt, value: ht, at: t.now() } : (o = ht, a = t.now()), lr(ht)) throw new Error(Fc);
      const Zt = await s.request("listening.signLike", {
        song: p.song,
        liked: p.liked,
        fee: zl.toString(),
        nonce: bt.toString(),
        balance: ht.toString()
      }), ke = {
        id: Vl(),
        address: tt,
        kind: "like",
        core: 0,
        song: p.song,
        liked: p.liked,
        recipient: "",
        amount: "0",
        fee: zl.toString(),
        nonce: bt.toString(),
        created: t.now(),
        status: "signed",
        raw: Zt.raw,
        txid: Zt.txid,
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(ke), le(ke);
      try {
        await t.chain.broadcast(Zt.raw, Zt.txid), le({ ...ke, status: "pending" }), v = `${p.liked ? "♥ Liked" : "Unliked"} ${A}`, T = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, p.song, p.liked);
        } catch {
        }
      } catch (ge) {
        if (le({ ...ke, status: Xi(ge) ? "failed" : "unknown", note: ge.message, ...Xi(ge) ? { raw: void 0 } : {} }), T = ge.message, Xi(ge)) try {
          (dt = t.likeFailed) == null || dt.call(t, p.song);
        } catch {
        }
      }
      i = await xe(s);
    } catch (at) {
      T = "Like not sent: " + (at instanceof Error ? at.message : "the listening wallet is unavailable");
      try {
        (H = t.likeFailed) == null || H.call(t, p.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), b();
    }
  }
  return { snapshot: $n, refresh: In, onListened: f, heart: d, toggleLike: z, ...Dn };
}
const nb = ["Connect", "Passkey", "Link & fund", "Listen"], rb = ["Passkey", "Add 1 STX", "Listen"], rf = (t) => t ? rb : nb;
function y5(t) {
  if (t.solo) return w5(t);
  const e = nb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function w5(t) {
  const e = rb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function b5(t, e) {
  return !e || e.at >= rf(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const m5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function x5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !m5(r.id)));
}
const S5 = {}, E5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, A5 = (t) => {
  const e = S5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, v5 = (t) => `/hiro/${t}`, k5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, $5 = (t) => {
  const e = A5(t);
  if (e)
    return [k5(e)];
  const n = E5[t];
  return typeof window < "u" ? [`${window.location.origin}${v5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, I5 = {}, rp = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, L5 = "xtrata.log.enabled", C5 = "xtrata.log.level", T5 = "xtrata.log.tags", B5 = "xtrata.log.dedupe", Qa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, M5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, N5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, P5 = (t) => {
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
  const t = I5 ?? {}, e = Qa(L5) ?? t.VITE_LOG_ENABLED, n = Qa(C5) ?? t.VITE_LOG_LEVEL, r = Qa(T5) ?? t.VITE_LOG_TAGS, s = Qa(B5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: M5(e),
    level: N5(n) ?? "warn",
    tags: _5(r),
    dedupe: P5(s)
  };
}, O5 = (t, e, n) => !t.enabled || rp[n] < rp[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), H5 = (t, e, n, r) => {
  const s = U5();
  if (!O5(s, e, t) || F5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, D5 = /* @__PURE__ */ new Set();
let sp = null;
const F5 = (t, e, n, r, s) => (sp !== t && (D5.clear(), sp = t), !1), j5 = (t, e, n) => H5("debug", t, e, n), R5 = {}, z5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, G5 = (t) => {
  const e = R5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : z5[t];
}, K5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, V5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return K5.test(n) ? n : null;
}, Y5 = (t) => t.replace(/\/+$/, ""), X5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), ip = (t) => {
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
}, qi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, q5 = (t) => {
  var c, u;
  let e;
  try {
    e = Sr(X8(t));
  } catch {
    return null;
  }
  const n = qi(e);
  if (!n || n.success === !1)
    return null;
  const r = qi(n.value), s = qi(r == null ? void 0 : r.value), i = qi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = ip((c = qi(i.name)) == null ? void 0 : c.value), a = ip((u = qi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : V5(`${o}.${a}`);
}, W5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Y5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Uw(mw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : q5(i.result);
}, Z5 = async (t) => {
  const e = t.address.trim();
  if (!io(e))
    return null;
  const n = G5(t.network);
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
  return j5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: X5(r)
  }), null;
};
function Q5(t, e, n = {}) {
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
const op = Object.freeze({
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
}), ap = Object.freeze({ 139: "melophonic" });
function cp(t, e = "") {
  const n = String(t);
  return Object.hasOwn(op, n) ? op[n] : Object.hasOwn(ap, n) ? ap[n] : e;
}
const lp = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function up(t, e = "") {
  return Object.hasOwn(lp, String(t)) ? lp[String(t)] : e;
}
const sb = 10000n, bd = 1000000n, jc = 3000n, J5 = (t, e) => `${t}#gift=${e}`, t6 = 100, Fo = (t, e = cr) => t <= Ue ? 0 : Number((t - Ue) / ln(e)), fp = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), ib = "xtrata.xyz/radio/gifts", Yl = t6, e6 = "Create a prefunded Xtrata radio gift batch", n6 = (t) => ({
  domain: xi({ name: Je(ib), version: Je("1"), "chain-id": kr(1) }),
  message: xi({
    purpose: Je(e6),
    creator: Je(t.creator),
    count: kr(t.count),
    amount: kr(BigInt(t.amount)),
    label: Je(t.label),
    issued: kr(t.issued),
    ...t.player ? { player: Je(t.player) } : {}
  })
}), r6 = (t, e, n = cr) => Ue + BigInt(t) * ln(n) + (e ? wl : 0n), s6 = (t, e = cr) => Number((bd - Ue - (t ? wl : 0n)) / ln(e)), i6 = (t, e) => BigInt(t) * (e + jc);
function o6(t, e, n, r = cr) {
  const s = n ? wl : 0n, i = e > Ue + s ? e - Ue - s : 0n, o = Number(i / ln(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Oc,
    fees: BigInt(o) * r,
    reserve: Ue,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jc,
    perCopy: e + jc,
    total: i6(t, e)
  };
}
const a6 = (t) => t >= sb && t <= bd, dp = 40, c6 = "Create an Xtrata radio gift player", l6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function hp(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && l6.test(t) : !n;
}
function u6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!hp(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!hp(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > dp) throw new Error(`A player holds 1 to ${dp} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const s of t.tracks) {
    if (!Number.isSafeInteger(s) || s < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(s)) throw new Error("A song appears twice in the list.");
    e.add(s);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  const n = t.explicit ?? [];
  if (!Array.isArray(n)) throw new Error("Explicit songs: a list of song numbers from the album.");
  for (const s of n) if (!e.has(s)) throw new Error("An explicit song must be one of the album’s songs.");
  const r = [...new Set(n)].sort((s, i) => s - i);
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null, ...r.length ? { explicit: r } : {} };
}
const f6 = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return Eg(Lg(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, d6 = (t) => ({
  domain: xi({ name: Je(ib), version: Je("1"), "chain-id": kr(1) }),
  message: xi({
    purpose: Je(c6),
    admin: Je(t.admin),
    player: Je(t.hash),
    issued: kr(t.issued)
  })
}), zr = (t) => t.tracks.filter((e) => !e.hidden), h6 = (t) => t.tracks.find((e) => e.hidden) ?? null, pp = [300, 500, 1e3], gp = 1800, Xl = /* @__PURE__ */ new Map();
async function p6(t) {
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
function g6(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Xl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Xl.set(t, { ...a, until: Date.now() + gp });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Xl.delete(t), s();
      }, gp + 50);
    }
  }, i;
}
const Fr = (t, e, n, r, s) => g6(t, e, async () => await p6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Vs = "xtrata.radio.gift.incoming.v1", yp = (t) => "xtrata.radio.gift.mine.v1:" + t, wp = (t) => "xtrata.radio.gift.batches.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, br = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ja = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Rn = (t) => nr(t).replace(/\.?0+$/, "");
function y6(t) {
  let e = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), x = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return x !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), fp(x) ? x : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(t.store.get(Vs) || "null");
      return fp(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Vs, JSON.stringify({ code: i, at: t.now() }));
    let I = 0;
    const x = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (P) => {
      const G = await P.json().catch(() => ({}));
      if (P.status === 404) {
        t.store.set(Vs, null), e = { ...e, error: (G == null ? void 0 : G.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!P.ok) throw new Error("busy");
      const gt = G;
      e = { ...e, view: gt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(gt.status) && t.store.set(Vs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void x(), n(I++)));
    });
    x();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const I = e == null ? void 0 : e.view;
    return !(I != null && I.player) || !o() ? null : { player: I.player, from: l(I), plays: Fo(BigInt(I.amount)) };
  }, c = () => {
    const I = e == null ? void 0 : e.view;
    return !I || I.player || !o() ? null : { plays: Fo(BigInt(I.amount)), from: I.from ? t.who(I.from) : null };
  }, u = () => {
    const I = e == null ? void 0 : e.code;
    if (!I) return [];
    const x = `${location.origin}${location.pathname}#gift=${I}`;
    return [Fr("gift-pass-on", "Copy the link to pass on", () => x, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Vs, null), t.changed();
  }, l = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let y = {};
  const g = (I) => {
    if (y.box) return y.box;
    const x = xt("div", "", "ppp-gift-check");
    y.box = x;
    const P = () => {
      const G = window.turnstile;
      !G || y.rendered || (y.rendered = !0, G.render(x, { sitekey: I, callback: (gt) => {
        y.token = gt, t.changed();
      }, "expired-callback": () => {
        y.token = void 0;
      } }));
    };
    if (window.turnstile) P();
    else {
      const G = document.createElement("script");
      G.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", G.async = !0, G.onload = P, document.head.append(G);
    }
    return x;
  }, S = (I) => {
    queueMicrotask(() => void I());
  };
  let v;
  async function T(I) {
    var G, gt, wt, qt, ye, Rt, Kt, re, At;
    if (!e || e.claiming || !I.listening) return;
    const x = !!((G = e.view) != null && G.player);
    if (x && !I.root) return;
    e.claiming = !0, e.error = void 0, (gt = t.claiming) == null || gt.call(t, !0), t.changed();
    const P = async (Yt) => {
      const St = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: y.token, ...Yt })
      });
      return { res: St, r: await St.json().catch(() => ({})) };
    };
    try {
      let Yt = 0, St = I.listening, Wt;
      if (x) {
        const fe = Number((wt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : wt.next);
        if (!Number.isSafeInteger(fe) || fe < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Yt = fe;
        for (let rn = 0; ; rn++) {
          const bn = await t.album.bind(Yt);
          if (St = bn.address, Wt = await P({ wallet: St, binding: bn }), Wt.res.status === 409 && /just taken/.test(((qt = Wt.r) == null ? void 0 : qt.error) || "") && rn < 5) {
            Yt += 1;
            continue;
          }
          break;
        }
      } else Wt = await P({ wallet: St });
      const { res: ue, r: Be } = Wt;
      if (ue.status === 503 && /sending another gift/.test((Be == null ? void 0 : Be.error) || "")) {
        e.waiting = !0, (ye = t.claiming) == null || ye.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!ue.ok) {
        const fe = String((Be == null ? void 0 : Be.error) || "");
        if (ue.status === 404 || ue.status === 410 || ue.status === 409 && /already had a gift|brand-new|already have this album/.test(fe))
          throw t.store.set(Vs, null), new Error(fe || "This gift cannot be opened.");
        if (ue.status === 429 || ue.status === 403 || ue.status === 400 && !/wallet number/i.test(fe)) throw new Error(fe || `Could not open the gift (${ue.status}).`);
        const bn = /topping up/.test(fe) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(fe) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(fe) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(bn), { retry: !0, slow: /topping up|not paid for yet/.test(fe) });
      }
      e.done = !0, t.store.set(Vs, null), x ? await t.album.arrived(Yt, St, Be.txid, BigInt(Be.amount)) : t.giftSent(Be.txid, BigInt(Be.amount));
    } catch (Yt) {
      const St = Yt, Wt = St.name === "TypeError" || St.name === "AbortError" || St.name === "TimeoutError" || /wallet number/i.test(St.message);
      if (St.retry || Wt) {
        const ue = e.tries ?? 0;
        e.tries = ue + 1, e.retry = { text: St.retry ? St.message : "Still sending your gift… the network is slow, trying again." }, (Rt = t.claiming) == null || Rt.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, St.slow ? 6e4 : n(ue));
      } else
        e.error = St.message, (Kt = t.claiming) == null || Kt.call(t, !1);
      y.token = void 0;
      try {
        (At = (re = window.turnstile) == null ? void 0 : re.reset) == null || At.call(re, y.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let O = null;
  function F(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return O = null, [];
    if (!O || O.wallet !== I.listening || t.now() - O.at > 3e4) {
      const P = I.listening;
      O = { ...(O == null ? void 0 : O.wallet) === P ? O : {}, wallet: P, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(P)).then((G) => {
        var gt, wt;
        (O == null ? void 0 : O.wallet) === P && (O.state = (gt = G == null ? void 0 : G.gift) == null ? void 0 : gt.state, O.problem = ((wt = G == null ? void 0 : G.gift) == null ? void 0 : wt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(O.state === "sending" && O.problem)) return [];
    const x = xt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return x.title = `Network reply: ${O.problem}`, [x];
  }
  function k(I, x, P = !1) {
    var Rt, Kt;
    const G = x.player, gt = BigInt(x.amount), wt = P ? [] : [xt("p", `🎁 ${l(x)} sent you “${G.title}”${G.subtitle ? ` by ${G.subtitle}` : ""}: ${zr(G).length} ${zr(G).length === 1 ? "song" : "songs"} and ${Fo(gt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (P) return wt;
      if (wt.push(xt("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const re = document.createElement("details");
        re.className = "ppp-how";
        const At = document.createElement("summary");
        At.textContent = "How does this work?", re.append(At, xt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), wt.push(re);
      }
      return wt;
    }
    if (I.walletCannotAlbums)
      return wt.push(xt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), wt;
    const ye = (Kt = (Rt = I.gate) == null ? void 0 : Rt.gifts) == null ? void 0 : Kt.turnstileSiteKey;
    return ye && !y.token ? wt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), g(ye)) : !e.claiming && !e.error && !e.waiting && !e.retry && S(() => T(I)), wt.push(...C(I, "Sending your album…")), wt;
  }
  function C(I, x) {
    const P = [];
    return e.claiming || e.waiting ? P.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : x, "ppp-cyan")) : e.retry && P.push(xt("p", e.retry.text, "ppp-warn"), br("Try now", () => {
      clearTimeout(v), e.retry = void 0, T(I);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? P.push(xt("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")) : e.error && P.push(xt("p", e.error, "ppp-bad"), br("Try again", () => {
      e.error = void 0, T(I);
    })), P;
  }
  const _ = (I) => {
    var x;
    return !!e && !e.done && !e.error && o() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((x = e.view) != null && x.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function Y(I, x = {}) {
    var At, Yt;
    const P = F(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return P;
    const G = e.view;
    if (e.error && !G) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!G) return [xt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return P;
    if (G.status === "claimed" || G.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(G.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (G.status === "pending-deposit") return [xt("p", `🎁 ${l(G)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (G.player) return [...k(I, G, !!x.bare), ...P];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [xt("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")];
    const wt = BigInt(G.amount), qt = Fo(wt).toLocaleString(), ye = xt(
      "p",
      `🎁 ${l(G)} sent you ${Rn(wt)} STX of on-chain music: about ${qt} paid plays.`,
      "ppp-gift"
    ), Rt = x.bare ? [] : [ye], Kt = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, re = (Yt = (At = I.gate) == null ? void 0 : At.gifts) == null ? void 0 : Yt.turnstileSiteKey;
    return Kt ? (re && !y.token ? Rt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), g(re)) : !e.claiming && !e.error && !e.waiting && !e.retry && S(() => T(I)), Rt.push(...C(I, "Sending your gift…"))) : I.step === "intro" ? x.bare || Rt.push(xt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Rt.push(xt("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Rt.push(xt("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")), Rt;
  }
  async function rt(I, x, P) {
    var G;
    try {
      const gt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((G = gt == null ? void 0 : gt.gift) != null && G.returnTo) return { ok: !0, funder: gt.gift.returnTo, txId: gt.gift.txid ?? void 0, amount: gt.gift.amount, distinct: 1 };
    } catch {
      if (P) return { ok: !1 };
    }
    return x();
  }
  const X = xt("div", "", "ppp-gift-fold");
  let q = 250000n, $ = "", U = "";
  const m = (I) => {
    try {
      const x = JSON.parse(t.store.get(yp(I)) || "[]");
      return Array.isArray(x) ? x : [];
    } catch {
      return [];
    }
  }, N = (I, x) => t.store.set(yp(I), JSON.stringify(x.slice(0, 50)));
  async function K(I) {
    const x = m(I);
    for (const P of x)
      if (!(P.view && ["claimed", "refunded", "expired"].includes(P.view.status)))
        try {
          P.view = !P.view || P.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: P.id, ...P.txid ? { txid: P.txid } : {} }) }) : await t.json("/radio/gift?id=" + P.id), P.error = void 0;
        } catch (G) {
          P.error = G.message;
        }
    N(I, x), t.changed();
  }
  async function B(I) {
    if ($) return;
    $ = "Starting your gift…", U = "", t.changed();
    let x = null;
    try {
      x = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: q.toString() }) });
      const P = m(I);
      P.unshift({ id: x.id, code: x.code, amount: q.toString(), at: t.now() }), N(I, P), $ = "Approve the gift in your wallet…", t.changed();
      const G = await t.pay(I, x.depositTo, BigInt(x.deposit), x.memo), gt = m(I), wt = gt.find((qt) => qt.id === x.id);
      wt && (wt.txid = G, wt.view = { status: "pending-deposit", amount: q.toString(), source: "friend", from: I, label: "", expires: 0 }), N(I, gt), U = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (P) {
      U = P.message || "Not sent.";
    } finally {
      $ = "", t.changed();
    }
  }
  const it = (I) => "xtrata.radio.gift.players.v1:" + I, W = (I) => {
    try {
      const x = JSON.parse(t.store.get(it(I)) || "[]");
      return Array.isArray(x) ? x.filter((P) => P && /^[0-9a-f]{16}$/.test(P.id)) : [];
    } catch {
      return [];
    }
  };
  async function $t(I, x) {
    var P;
    if (!$) {
      $ = "Checking the player…", U = "", t.changed();
      try {
        const G = x.tracks.split(/[\s,]+/).filter(Boolean).map((re) => Number(re.replace(/^#/, ""))), gt = (x.explicit ?? "").split(/[\s,]+/).map((re) => re.replace(/^#/, "")).filter(Boolean).map(Number), wt = u6({ title: x.title.trim(), subtitle: x.subtitle.trim(), tracks: G, cover: (P = x.cover) != null && P.trim() ? Number(x.cover.trim().replace(/^#/, "")) : null, ...gt.length ? { explicit: gt } : {} });
        $ = "Sign in your wallet…", t.changed();
        const qt = { admin: I, hash: f6(wt), issued: t.now() }, ye = await t.sign(I, d6(qt));
        $ = "Making the player…", t.changed();
        const Rt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: wt, request: qt, signature: ye }) }), Kt = W(I).filter((re) => re.id !== Rt.id);
        Kt.unshift({ id: Rt.id, title: Rt.title, tracks: Rt.tracks }), t.store.set(it(I), JSON.stringify(Kt.slice(0, 30))), U = `${Rt.existing ? "That player already exists" : "Player made"} ✓ “${Rt.title}” · ${Rt.tracks} songs. Pick it below for a batch.`;
      } catch (G) {
        U = G.message || "Not made.";
      } finally {
        $ = "", t.changed();
      }
    }
  }
  const L = (I, x) => J5(I || location.origin + "/radio.html", x), D = (I) => {
    try {
      const x = JSON.parse(t.store.get(wp(I)) || "[]");
      return Array.isArray(x) ? x.filter((P) => P && /^[0-9a-f]{16}$/.test(P.id) && Array.isArray(P.codes)) : [];
    } catch {
      return [];
    }
  }, ct = (I, x) => t.store.set(wp(I), JSON.stringify(x.slice(0, 20))), ot = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, lt = (I, x) => t.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(x) });
  let Pt = 0;
  async function ne(I) {
    const x = D(I);
    for (const P of x)
      if (!ot(P))
        try {
          P.view = !P.view || P.view.status === "pending-deposit" ? await lt("/radio/gift/batch/confirm", { id: P.id, ...P.txid ? { txid: P.txid } : {} }) : await t.json("/radio/gift/batch?id=" + P.id), P.error = void 0;
        } catch (G) {
          P.error = G.message;
        }
    try {
      const P = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const G of (P == null ? void 0 : P.batches) ?? []) {
        const gt = x.find((wt) => wt.id === G.id);
        if (gt) {
          gt.error || (gt.view = G);
          continue;
        }
        x.push({ id: G.id, codes: [], count: G.count, amount: G.amount, label: G.label, player: G.player, depositTo: "", deposit: G.deposit, memo: G.memo, at: 0, view: G });
      }
    } catch {
    }
    ct(I, x), t.changed();
  }
  async function kt(I, x) {
    const P = D(I).find((G) => G.id === x);
    if (!(!P || !P.depositTo || $)) {
      $ = "Approve the payment in your wallet…", U = "", t.changed();
      try {
        const G = await t.pay(I, P.depositTo, BigInt(P.deposit), P.memo), gt = D(I), wt = gt.find((qt) => qt.id === x);
        wt && (wt.txid = G), ct(I, gt), U = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", $ = "", ne(I);
      } catch (G) {
        U = `${/cancel/i.test(G.message) ? "Payment cancelled." : G.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        $ = "", t.changed();
      }
    }
  }
  async function Gt(I, x, P, G) {
    if ($) return;
    if (!x.ok) {
      U = x.reason, t.changed();
      return;
    }
    $ = "Sign in your wallet…", U = "", t.changed();
    let gt = null;
    try {
      const wt = { creator: I, count: x.count, amount: x.amount.toString(), label: P, issued: t.now(), ...G ? { player: G } : {} }, qt = await t.sign(I, n6(wt));
      $ = "Making your links…", t.changed(), gt = await lt("/radio/gift/batch", { request: wt, signature: qt });
      const ye = D(I);
      ye.unshift({ id: gt.id, codes: gt.codes, count: x.count, amount: gt.amount, label: P, player: G ?? null, depositTo: gt.depositTo, deposit: gt.deposit, memo: gt.memo, at: t.now() }), ct(I, ye);
    } catch (wt) {
      U = wt.message || "Not made.", $ = "", t.changed();
      return;
    }
    $ = "", t.changed(), await kt(I, gt.id);
  }
  function vt() {
    const I = !!Xt.value, x = Ye.value === "max" ? s6(I) : Number(Ye.value), P = r6(x, I), G = Number(nn.value);
    return !Number.isInteger(G) || G < 1 || G > Yl ? { ok: !1, reason: `Make 1 to ${Yl} copies at a time.`, album: I, plays: x, amount: P, count: G } : a6(P) ? { ok: !0, reason: "", album: I, plays: x, amount: P, count: G, bill: o6(G, P, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: x, amount: P, count: G };
  }
  const De = () => {
    const I = vt();
    if (!I.ok) return I.reason;
    const x = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${Rn(x.holders)} to song holders, ${Rn(x.fees)} network fees)${I.album ? `, ${Rn(x.float)} for the album’s likes` : ""}, ${Rn(x.reserve)} kept so a listener can return what is left, + ${Rn(x.sendFee)} to send it = ${Rn(x.perCopy)} STX. ${I.count} copies = ${Rn(x.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ht = (I, x) => x.codes.map((P) => L(I, P)), Lt = xt("input");
  Lt.type = "range", Lt.min = String(sb), Lt.max = String(bd), Lt.step = "10000", Lt.value = String(q), Lt.setAttribute("aria-label", "Gift amount");
  const jt = xt("p", "", "ppp-gift-amount"), le = br("", () => {
    const I = t.main();
    I && B(I);
  }, "primary"), kn = () => {
    jt.textContent = wn(), le.textContent = `Gift ${Rn(q)} STX`;
  };
  Lt.oninput = () => {
    q = BigInt(Lt.value), kn();
  };
  const wn = () => `${Rn(q)} STX · about ${Fo(q).toLocaleString()} paid plays · you pay ${Rn(q + jc)} STX with the network fee`;
  kn();
  const Te = xt("input");
  Te.maxLength = 60, Te.placeholder = "Title, e.g. Proof of Sound", Te.setAttribute("aria-label", "Player title");
  const qe = xt("input");
  qe.maxLength = 80, qe.placeholder = "Artist (optional)", qe.setAttribute("aria-label", "Player subtitle");
  const Ve = xt("textarea");
  Ve.rows = 3, Ve.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ve.setAttribute("aria-label", "Songs");
  const en = xt("input");
  en.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", en.setAttribute("aria-label", "Explicit songs");
  const Re = xt("input");
  Re.inputMode = "numeric", Re.placeholder = "Cover inscription number (optional), shown when the album loads", Re.setAttribute("aria-label", "Cover inscription");
  const Xt = xt("select");
  Xt.setAttribute("aria-label", "Batch album");
  const Ye = xt("select");
  Ye.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...pp])].sort((x, P) => x - P)) Ye.append(Ja(`${I.toLocaleString()} plays`, String(I)));
  Ye.append(Ja("Max (1 STX)", "max")), Ye.value = String(pp[0]);
  const nn = xt("input");
  nn.type = "number", nn.min = "1", nn.max = String(Yl), nn.value = "10", nn.setAttribute("aria-label", "Copies");
  const Fe = xt("input");
  Fe.maxLength = 40, Fe.placeholder = "Label, e.g. Opera launch", Fe.setAttribute("aria-label", "Batch label");
  const oe = xt("p", "", "ppp-mute"), pe = () => {
    oe.textContent = De();
  };
  for (const I of [Xt, Ye, nn])
    I.oninput = pe, I.onchange = pe;
  pe();
  function Xn(I) {
    var gt, wt;
    const x = (gt = I.gate) == null ? void 0 : gt.gifts;
    if (!(x != null && x.enabled) || !x.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const P = t.main(), G = [xt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!P)
      G.push(xt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (x.admin) {
      const qt = xt("div", "", "ppp-gift-admin"), ye = (Yt, St) => {
        const Wt = xt("label", Yt);
        return Wt.append(St), Wt;
      }, Rt = W(P);
      qt.append(
        xt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Te,
        qe,
        Ve,
        Re,
        en,
        br("Sign and make player", () => void $t(P, { title: Te.value, subtitle: qe.value, tracks: Ve.value, cover: Re.value, explicit: en.value }))
      );
      const Kt = br("Sign, pay and make links", () => {
        Gt(P, vt(), Fe.value.trim(), Xt.value || void 0);
      });
      Kt.disabled = !!$;
      const re = Xt.value;
      Xt.replaceChildren(Ja("No album (starter copies)", ""), ...Rt.map((Yt) => Ja(`${Yt.title} · ${Yt.tracks} songs`, Yt.id))), Rt.some((Yt) => Yt.id === re) && (Xt.value = re), pe(), qt.append(
        xt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        ye("Album ", Xt),
        ye("Plays each ", Ye),
        ye("Copies ", nn),
        Fe,
        oe,
        Kt
      ), t.now() - Pt > 3e4 && (Pt = t.now(), ne(P));
      const At = D(P);
      if (At.length) {
        const Yt = xt("ul", "", "ppp-gift-list");
        for (const St of At.slice(0, 10)) {
          const Wt = St.view, ue = Wt == null ? void 0 : Wt.copies, Be = St.error ? St.error : !Wt || Wt.status === "pending-deposit" ? St.txid ? "payment confirming…" : "waiting for your payment" : `${ue.claimed} of ${Wt.count} claimed${ue.refunding + ue.refunded ? ` · ${ue.refunded} refunded${ue.refunding ? `, ${ue.refunding} on their way` : ""}` : ""}`, fe = xt("li");
          if (fe.append(xt("span", `${St.label || "Batch"} · ${St.count} × ${Rn(BigInt(St.amount))} STX`, "t"), xt("span", Be, "ppp-mute")), !St.txid && St.depositTo && (!Wt || Wt.status === "pending-deposit") && fe.append(br("Pay now", () => void kt(P, St.id), "tiny")), St.codes.length && (Wt == null ? void 0 : Wt.status) === "live") {
            const rn = Ht(((wt = I.gate) == null ? void 0 : wt.radioUrl) ?? null, St);
            fe.append(
              Fr("batch-copy:" + St.id, "Copy all links", () => rn.join(`
`), "tiny", t.changed),
              Fr("batch-csv:" + St.id, "Copy as CSV", () => ["copy,link", ...rn.map((bn, qr) => `${qr + 1},${bn}`)].join(`
`), "tiny", t.changed)
            );
          } else St.codes.length || fe.append(xt("span", "links were made on another device", "ppp-mute"));
          Yt.append(fe);
        }
        qt.append(Yt);
      }
      G.push(qt);
    }
    return $ && G.push(xt("p", $, "ppp-cyan")), U && G.push(xt("p", U, /✓/.test(U) ? "ppp-ok" : "ppp-warn")), X.replaceChildren(...G), X;
  }
  return { banner: Y, funder: rt, renderFold: Xn, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: _ };
}
const w6 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function b6(t) {
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
const m6 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function x6(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = m6(i);
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
function S6(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const sf = /* @__PURE__ */ new Set(), ob = (t) => (sf.add(t), () => {
  sf.delete(t);
}), of = () => {
  for (const t of [...sf])
    try {
      t();
    } catch {
    }
}, bp = "xtrata:al-thumb:v1:", ab = "-", jo = 96, E6 = 24 * 1024 * 1024, fn = /* @__PURE__ */ new Map(), mp = /* @__PURE__ */ new Set(), af = [];
let ql = !1, Wl;
const Rc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(bp + t);
    window.localStorage.setItem(bp + t, e);
  } catch {
  }
  return null;
};
function md(t) {
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
async function A6(t) {
  var c, u, h, l, y;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((h = e.body) == null ? void 0 : h.cancel()), "";
  let r = "", s = 0;
  const i = (g) => {
    let S = 0;
    for (; ; ) {
      const v = r.slice(S).search(/<img\b/i);
      if (v < 0)
        return r = g ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const T = S + v, O = r.indexOf(">", T);
      if (O < 0)
        return r = r.slice(T), null;
      const F = r.slice(T, O + 1), k = F.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (k) return k[1].replace(/&amp;/g, "&");
      const C = F.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (C) return "/inscription/" + C[1];
      S = O + 1;
    }
  }, o = (y = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : y.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: g, value: S } = await o.read();
    if (g) break;
    s += S.byteLength, r += a.decode(S, { stream: !0 });
    const v = i(!1);
    if (v)
      return await o.cancel(), v;
    if (s > E6)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function v6() {
  if (!ql) {
    ql = !0;
    try {
      for (; af.length; ) {
        const t = af.shift();
        if (!fn.has(t))
          try {
            const e = await A6(t);
            if (e === null) continue;
            if (!e) {
              fn.set(t, ""), Rc(t, ab), of();
              continue;
            }
            const n = await md(e);
            fn.set(t, n), n.startsWith("data:image/jpeg") && Rc(t, n), of();
          } catch {
          }
      }
    } finally {
      ql = !1;
    }
  }
}
function cb(t, e) {
  if (e && !fn.get(t) ? (fn.set(t, e), md(e).then((r) => {
    r !== e && (fn.set(t, r), r.startsWith("data:image/jpeg") && Rc(t, r), of());
  })) : e === "" && !fn.has(t) && fn.set(t, ""), fn.has(t)) return fn.get(t);
  const n = Rc(t);
  if (n != null) {
    const r = n === ab ? "" : n;
    return fn.set(t, r), r;
  }
  return mp.has(t) || (mp.add(t), af.push(t), Wl || (Wl = setTimeout(() => {
    Wl = void 0, v6();
  }, 1200))), "";
}
const Wi = 12, k6 = 5e3, an = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Zi = (t, e, n = "") => {
  const r = an("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function $6(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, h = Wi;
  const l = an("div", "", "ppp-shelf-box");
  ob(() => t.changed());
  const y = (m) => "xtrata.radio.shelf.pins.v1:" + m, g = (m) => "xtrata.radio.shelf.recent.v1:" + m, S = (m, N) => {
    try {
      return JSON.parse(t.store.get(m) || "null") ?? N;
    } catch {
      return N;
    }
  }, v = (m) => new Set(S(y(m), []).filter((N) => Number.isSafeInteger(N))), T = (m) => {
    const N = S(g(m), {}), K = {};
    for (const [B, it] of Object.entries(N)) Number.isSafeInteger(Number(B)) && typeof it == "number" && (K[Number(B)] = it);
    return K;
  };
  async function O(m) {
    if (!s) {
      s = !0, i = !1;
      try {
        const N = [];
        let K = 0, B = 0;
        for (let it = 0; it < k6 / 100 + 1; it++) {
          const W = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(m)}&after=${K}&limit=100`);
          if (N.push(...b6(W == null ? void 0 : W.shelf)), B = Number(W == null ? void 0 : W.total) || N.length, !(W != null && W.next) || !Number.isSafeInteger(W.next)) break;
          K = W.next;
        }
        m === e && (n = N, r = B, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const F = () => {
    o = -1 / 0;
  }, k = an("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = Wi, t.changed();
  };
  const C = an("select");
  C.setAttribute("aria-label", "Sort albums");
  for (const m of w6) {
    const N = document.createElement("option");
    N.value = m.value, N.textContent = m.label, C.append(N);
  }
  C.onchange = () => {
    c = C.value, h = Wi, t.changed();
  };
  const _ = Zi("", () => {
    u = !u, h = Wi, t.changed();
  }, "tiny"), Y = an("div", "", "ppp-shelf-tools");
  Y.append(k, C, _);
  const rt = an("div"), X = an("div");
  function q(m) {
    const N = m.step === "off" || m.step === "elsewhere" ? void 0 : m.root;
    if (N !== e && (e = N, n = [], r = 0, o = -1 / 0, h = Wi), !N || m.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && O(N), !n.length)
      return i ? (X.replaceChildren(an("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Zi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(X), l) : null;
    const K = v(N), B = T(N), it = x6(n, { query: a, sort: c, pinnedOnly: u, pins: K, recents: B });
    k.value !== a && (k.value = a), C.value = c, _.textContent = u ? "★ Pinned only" : "☆ Pinned only", _.setAttribute("aria-pressed", String(u));
    const W = [];
    if (m.slot > 0 && W.push(Zi("← My player", () => t.open(0), "quiet")), !it.length) W.push(an("p", "No album matches that.", "ppp-mute"));
    else {
      const $t = an("ul", "", "ppp-shelf-list");
      for (const L of it.slice(0, h)) {
        const D = an("li", "", L.slot === m.slot ? "now" : ""), ct = K.has(L.slot), ot = Zi(ct ? "★" : "☆", () => {
          const Lt = new Set(K);
          ct ? Lt.delete(L.slot) : Lt.add(L.slot), t.store.set(y(N), JSON.stringify([...Lt])), t.changed();
        }, "tiny");
        ot.setAttribute("aria-label", ct ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const lt = [L.player.subtitle, `${zr(L.player).length} ${zr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Pt = L.slot === m.slot, ne = Zi(Pt ? "Playing" : "Select", () => {
          t.store.set(g(N), JSON.stringify(S6({ ...B, [L.slot]: t.now() }))), t.open(L.slot);
        }, Pt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        ne.disabled = Pt;
        const kt = zr(L.player)[0], Gt = L.player.cover ?? (kt == null ? void 0 : kt.id), vt = Gt ? cb(String(Gt)) : "", De = an("span", "", "ppp-shelf-art");
        if (vt) {
          const Lt = document.createElement("img");
          Lt.src = vt, Lt.alt = "", Lt.decoding = "async", De.append(Lt);
        } else De.textContent = "💿";
        const Ht = an("span", "", "ppp-shelf-txt");
        Ht.append(an("span", L.player.title, "t"), an("span", lt, "ppp-mute")), D.append(ot, De, Ht, ne), $t.append(D);
      }
      W.push($t), it.length > h && W.push(Zi(`Show more (${it.length - h} left)`, () => {
        h += Wi, t.changed();
      }, "quiet"));
    }
    return i && W.push(an("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), rt.replaceChildren(...W), l.firstChild !== Y && l.replaceChildren(Y, rt), l;
  }
  return { render: q, invalidate: F, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const m = T(e), N = [...n].filter((K) => K.player).sort((K, B) => (m[B.slot] ?? 0) - (m[K.slot] ?? 0) || B.slot - K.slot)[0];
    return N ? { slot: N.slot, title: N.player.title } : null;
  } };
}
const I6 = 20, Qe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, $e = {
  grid: Qe('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Qe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Qe('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Qe('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Qe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Qe('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Qe('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Qe('<path d="M6 9l6 6 6-6"/>', 18),
  right: Qe('<path d="M9 6l6 6-6 6"/>', 16),
  close: Qe('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Qe('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Qe('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Qe('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Qe('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Qe('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const on = (t, ...e) => Q("button", { type: "button", ...t }, ...e), tc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Ro = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, L6 = { music: "My music", device: "This device", gifts: "Albums (admin)" }, C6 = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function xp(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function h(m) {
    var K, B, it;
    if (!m || !Number.isSafeInteger(m)) return "";
    const N = (it = (B = (K = e.radio()) == null ? void 0 : K.getState) == null ? void 0 : B.call(K)) == null ? void 0 : it.albumCover;
    return N != null && N.url && Number(N.tokenId) === m ? N.url : c.has(m) ? c.get(m) : (u.has(m) || (u.add(m), fetch("/inscription/" + m, { signal: AbortSignal.timeout(2e4) }).then(async (W) => {
      var L, D, ct, ot;
      const $t = (W.headers.get("content-type") || "").toLowerCase();
      if (!W.ok)
        throw await ((L = W.body) == null ? void 0 : L.cancel()), new Error("no cover");
      return $t.startsWith("image/") ? (await ((D = W.body) == null ? void 0 : D.cancel()), "/inscription/" + m) : $t.includes("text/html") ? (((ct = (await W.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : ct[1]) ?? "").replace(/&amp;/g, "&") : (await ((ot = W.body) == null ? void 0 : ot.cancel()), "");
    }).then((W) => {
      c.set(m, W), U();
    }).catch(() => {
      u.delete(m);
    })), "");
  }
  ob(() => U());
  function l(m) {
    var K;
    i = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const N = document.querySelector(".side");
    if (m && m !== "more") {
      for (const W of C6[m]) {
        const $t = N == null ? void 0 : N.querySelector(W);
        $t && ($t.open = !0);
      }
      const B = document.getElementById("sheetTitle");
      B && (B.textContent = L6[m]);
      const it = document.getElementById("sheetExtra");
      it && it.replaceChildren(...m === "music" ? [g()] : []), (K = N == null ? void 0 : N.scrollTo) == null || K.call(N, { top: 0 });
    }
    U();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const g = () => on(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: $e.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: $e.right })
  );
  let S = null, v = !1;
  const T = () => {
    var N;
    const m = e.radio();
    v || !(m != null && m.subscribe) || (v = !0, m.subscribe((K) => {
      S = K, (s == null ? void 0 : s.mode) === "open" && U();
    }), S = ((N = m.getState) == null ? void 0 : N.call(m)) ?? null);
  };
  r || setInterval(() => {
    var B, it;
    if ((s == null ? void 0 : s.mode) !== "open" || !(S != null && S.playing)) return;
    const m = (it = (B = e.radio()) == null ? void 0 : B.getPosition) == null ? void 0 : it.call(B), N = t.querySelector(".al-bar > i"), K = t.querySelectorAll(".al-times span");
    !m || !N || (N.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", K.length === 2 && (K[0].textContent = tc(m.current || 0), K[1].textContent = m.duration ? tc(m.duration) : "–:––"));
  }, 500);
  let O = "", F = null;
  function k(m, N, K = {}) {
    const B = K.song || h(m.cover), W = [B ? Q("img", { src: B, alt: K.song ? "Song artwork" : `${m.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, m.title), m.subtitle ? Q("span", {}, m.subtitle) : null), K.paused ? Q("span", { class: "al-paused" }, Q("i", { html: $e.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], $t = "al-cover" + (N ? "" : " al-cover--small") + (K.paused ? " is-paused" : "");
    return K.flip ? (W.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: $e.flip })), on({ class: $t + " is-flippable", "aria-label": K.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: K.flip }, ...W)) : Q("div", { class: $t }, ...W);
  }
  function C(m) {
    return m.plays === null || m.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (m.plays <= I6 ? " al-chip--low" : "") }, `${Ro(m.plays, "play", "plays")} left`);
  }
  function _(m) {
    const N = m.player, K = N.tracks.filter((it) => !it.hidden), B = [];
    return m.mode === "arrive" && m.from && B.push(Q("p", { class: "al-from" }, Q("span", { html: $e.gift }), Q("span", {}, Q("b", {}, m.from), " sent you an album"))), B.push(k(N, !0)), B.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, N.title),
      N.subtitle ? Q("p", { class: "al-artist" }, N.subtitle) : null,
      K.length ? Q("p", { class: "al-songline" }, K.map((it) => it.title || `#${it.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Ro(K.length, "song", "songs"), m.offered ? Ro(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && B.push(Q("div", { class: "al-status", role: "status" }, ...m.status)), B.push(Q("div", { class: "al-grow" })), m.asking ? B.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && B.push(on({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, Q("span", { html: $e.playSmall }), m.primary.label)), m.hint && !m.asking && B.push(Q("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && B.push(on({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), B;
  }
  function Y(m, N) {
    const { songs: K, current: B, started: it, own: W, out: $t, waiting: L } = N, D = m.player, ct = e.radio(), ot = [];
    ot.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, D.title), ` · ${Ro(K.length, "song", "songs")}`), C(m)));
    const lt = h(D.cover), Pt = "album:" + D.cover;
    lt && !fn.has(Pt) && (fn.set(Pt, lt), md(lt).then((kt) => {
      kt !== lt && (fn.set(Pt, kt), U());
    }));
    const ne = lt ? fn.get(Pt) || lt : "";
    return ot.push(Q("ol", { class: "al-tracks" }, ...K.map((kt, Gt) => {
      const vt = String(kt.id) === B, De = cb(String(kt.id), vt && it ? W : void 0);
      return Q("li", {}, on(
        { class: "al-track" + (vt ? " is-on" : ""), "aria-label": `Play ${kt.title || "#" + kt.id}`, "aria-current": vt ? "true" : void 0, disabled: $t || L, onClick: () => {
          var Ht;
          return (Ht = ct == null ? void 0 : ct.playToken) == null ? void 0 : Ht.call(ct, kt.id);
        } },
        Q(
          "span",
          { class: "al-th" + (De ? "" : " is-blank") },
          De ? Q("img", { src: De, alt: "", decoding: "async" }) : ne ? Q("img", { src: ne, alt: "", decoding: "async" }) : null,
          De ? null : Q("span", { class: "al-n" }, String(Gt + 1)),
          vt ? Q("span", { class: "al-eq", html: $e.eq }) : null
        ),
        Q("span", { class: "al-tt" }, kt.title || `#${kt.id}`, kt.explicit ? Q("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), ot;
  }
  function rt(m) {
    var De;
    const N = m.player, K = N.tracks.filter((Ht) => !Ht.hidden), B = e.radio(), it = S == null ? void 0 : S.nowPlaying, W = it && N.tracks.some((Ht) => String(Ht.id) === String(it.tokenId)) ? String(it.tokenId) : null, $t = W ? N.tracks.find((Ht) => String(Ht.id) === W) : null, L = m.plays === 0 && !m.playsComing, D = !!m.playsComing && !m.plays, ct = !!(S != null && S.playing) && !!W, ot = S == null ? void 0 : S.heart, lt = W ? (De = B == null ? void 0 : B.getPosition) == null ? void 0 : De.call(B) : null;
    W && (ct || ((lt == null ? void 0 : lt.current) ?? 0) > 0.5) && (O = N.id);
    const Pt = !!W && O === N.id;
    F && F !== W && (F = null);
    const ne = Pt ? String((it == null ? void 0 : it.cover) || "") : "", kt = !!ne && F === W, vt = [k(N, !L, { song: kt ? "" : ne, paused: Pt && !ct, flip: ne ? () => {
      F = F === W ? null : W, U();
    } : void 0, flipped: kt })];
    if (vt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, $t ? $t.title || (it == null ? void 0 : it.title) || `#${$t.id}` : N.title),
        Q("div", { class: "al-artist" }, $t ? $t.artist || (it == null ? void 0 : it.artist) || N.subtitle : N.subtitle || "Press play")
      ),
      W ? on({ class: "al-icon" + (ot != null && ot.liked ? " is-on" : ""), "aria-label": ot != null && ot.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ot != null && ot.liked)), disabled: !!(ot != null && ot.pending) || !!(ot != null && ot.locked) || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.toggleLike) == null ? void 0 : Ht.call(B);
      }, html: ot != null && ot.liked ? $e.heartOn : $e.heart }) : null
    )), L)
      vt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(m, !0)
      ));
    else {
      const Ht = lt != null && lt.duration ? Math.min(100, lt.current / lt.duration * 100) : 0;
      vt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Ht}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, tc((lt == null ? void 0 : lt.current) || 0)), Q("span", {}, lt != null && lt.duration ? tc(lt.duration) : "–:––"))
      ));
    }
    return vt.push(Q(
      "div",
      { class: "al-ctl" + (L || D ? " is-off" : "") },
      on({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.prev) == null ? void 0 : Ht.call(B);
      }, html: $e.prev }),
      on({ class: "al-play", "aria-label": ct ? "Pause" : "Play", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.playPause) == null ? void 0 : Ht.call(B);
      }, html: ct ? $e.pause : $e.play }),
      on({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.next) == null ? void 0 : Ht.call(B);
      }, html: $e.next })
    )), m.status.length && vt.push(Q("div", { class: "al-status", role: "status" }, ...m.status)), vt.push(...Y(m, { songs: K, current: W, started: Pt, own: ne, out: L, waiting: D })), vt.push(Q("div", { class: "al-grow" })), vt.push(on(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: $e.down })
    )), vt;
  }
  function X(m, N) {
    const K = Q("div", { class: "al-topups" + (N ? " al-topups--primary" : "") }), B = N ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const it of B) {
      const W = m.myPlays !== void 0 && m.myPlays >= it && !m.playsComing && !m.busy;
      K.append(on({ class: "al-topup", disabled: !W, onClick: () => e.topUp(it) }, N ? `Add ${it.toLocaleString()} plays` : `+${it.toLocaleString()}`));
    }
    return N && K.append(on({ class: "al-link", onClick: () => l("more") }, "Other amounts")), K;
  }
  function q(m) {
    const N = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), K = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${m.player.title}`), Q("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      X(m, !1),
      Q("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : N ? `Moved from My player · ${Ro(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !N && !m.playsComing && m.myPlays !== void 0 ? on({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), B = (W, $t, L, D) => on(
      { class: "al-row", onClick: D },
      Q("span", { class: "al-row-i", html: W }),
      Q("span", { class: "al-row-t" }, Q("b", {}, $t), Q("small", {}, L)),
      Q("span", { class: "al-row-go", html: $e.right })
    ), it = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      B($e.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, U();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), on({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: $e.close })),
      m.mode === "open" ? K : null,
      Q(
        "div",
        { class: "al-rows" },
        B($e.grid, "My music", "Your albums and the radio", () => l("music")),
        B($e.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        m.canMake ? B($e.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        B($e.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        it
      )
    );
  }
  function $(m) {
    var L, D;
    const N = m.player, K = S == null ? void 0 : S.nowPlaying, B = K && N.tracks.some((ct) => String(ct.id) === String(K.tokenId)) ? String(K.tokenId) : null, it = !!(S != null && S.playing) && !!B, W = B ? (D = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : D.call(L) : null;
    B && (it || ((W == null ? void 0 : W.current) ?? 0) > 0.5) && (O = N.id);
    const $t = !!B && O === N.id;
    return Y(m, {
      songs: N.tracks.filter((ct) => !ct.hidden),
      current: B,
      started: $t,
      own: $t ? String((K == null ? void 0 : K.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function U() {
    const m = s;
    if (r) {
      if (!m || m.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      T(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...$(m));
      return;
    }
    if (!m) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    T(), t.hidden = !1;
    const N = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      m.mode === "open" ? on({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: $e.grid }) : null
    ), K = Q("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? rt(m) : _(m));
    t.replaceChildren(N, K, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), q(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, U();
        return;
      }
      const N = !!s;
      s = m, !m && (N || i) && (i = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, U();
    },
    sheet: () => i,
    setSheet: l
  };
}
const T6 = [
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
function B6(t) {
  for (const [e, n] of T6) if (n.test(t)) return e;
  return null;
}
const lb = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), ub = (t) => /Android/.test(t);
function M6(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : lb(e) ? "x-safari-" + n.href : ub(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const N6 = (t) => lb(t) ? "Safari" : ub(t) ? "Chrome" : "your browser", Qi = "Xtrata Music Wallet", P6 = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Sp(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Qi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && P6.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Qi} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Qi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Qi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Qi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Qi, detail: "Open on this device." });
    }
  return r;
}
const Zl = "xtrata.radio.novice", fb = "xtrata.radio.novice.previewed.v1", Ep = 6 * 6e4;
function _6(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(Zl, r), n = r;
    else {
      if (r === "0")
        return e.set(Zl, null), { on: !1, preview: !1 };
      n = e.get(Zl);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const U6 = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Ap = (t) => U6.test(t ?? ""), O6 = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, H6 = {
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
}, D6 = (t, e) => H6[t] ?? e;
function F6(t, e) {
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
const j6 = "Make your player once, with Face ID or your fingerprint, and the music starts.", R6 = "Checking your player…", cf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function db(t) {
  try {
    const e = JSON.parse(t.get(fb) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function z6(t, e) {
  const n = db(t).filter((r) => r !== e);
  n.push(e), t.set(fb, JSON.stringify(n.slice(-50)));
}
function Ql(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...cf(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : cf();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > Ep ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > Ep ? { ...t, phase: "done" } : t;
  }
}
const ec = (t) => t.phase === "open" || t.phase === "playing", Pe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ys = (t, e, n, r = !1) => {
  const s = Pe("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, hb = (t) => t.toLocaleString(), G6 = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle."],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password."],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away."]
], Hr = {
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
}, K6 = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${hb(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, V6 = (t) => t ? `Your player holds ${hb(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", Y6 = (t) => t ? `You got a ${t.name} player` : Hr.landed.title;
function X6(t, e = !0) {
  const n = Pe("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(Pe("span", "tier-disc__mark", t.mark)), n;
}
function q6(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = Pe("ul", "al-welcome-points");
    for (const [i, o] of G6) {
      const a = Pe("li");
      a.append(Pe("b", "", i), Pe("span", "", o)), s.append(a);
    }
    return s;
  };
  return {
    showing: () => n,
    /** `albumActive`: the album view owns the mount right now, so this view only steps aside and touches nothing. */
    render(s, i = !1) {
      var l;
      if (!s) {
        n && !i && (t.hidden = !0, t.replaceChildren(), delete e.dataset.view, delete e.dataset.asking), n = !1, delete e.dataset.welcome;
        return;
      }
      n = !0, e.dataset.view = "album", e.dataset.welcome = s.mode, s.asking ? e.dataset.asking = "1" : delete e.dataset.asking;
      const o = Pe("header", "al-top"), a = Pe("a", "al-brand");
      a.href = "/radio", a.append("Xtrata ", Pe("b", "", "Music")), o.append(a);
      const c = Pe("div", "al-body al-body--welcome"), u = Pe("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        u.append(Pe("p", "al-welcome-wait", Hr.checking));
      else {
        if (s.tier && (h === "landed" || h === "back" || h === "empty") && u.append(X6(s.tier)), u.append(Pe("h1", "", h === "landed" ? Y6(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : Hr[h].title)), u.append(Pe("p", "", h === "gift" ? K6(s.plays, s.from, s.mystery) : h === "landed" ? V6(s.plays) : Hr[h].body)), (h === "landed" || h === "gift") && u.append(r()), s.status.length) {
          const y = Pe("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), u.append(y);
        }
        if (s.asking) u.append(Pe("p", "al-hint al-hint--ask", Hr.asking));
        else if (h === "gift" || h === "new" || h === "back") {
          const y = Hr[h];
          s.canStart && u.append(Ys("al-primary", y.primary, h === "back" ? s.unlock : s.start, s.busy), Pe("p", "al-hint", y.hint)), s.canStart && u.append(Ys("al-link", y.returning, s.returning, s.busy)), u.append(Ys("al-link", y.full, s.full));
        } else if (h === "landed") {
          if (u.append(Ys("al-primary", Hr.landed.primary, s.full)), (l = s.albums) != null && l.length) {
            u.append(Pe("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const g = Ys("al-album", "", y.run);
              g.append(Pe("b", "", y.title), Pe("span", "", y.by)), u.append(g);
            }
          }
        } else h === "empty" && u.append(Ys("al-primary", Hr.empty.primary, s.restock), Ys("al-link", Hr.empty.full, s.full));
      }
      c.append(u), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
function W6(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const Z6 = [100, 250, 500, 1e3], Q6 = (t, e = cr) => BigInt(t) * ln(e);
function J6(t, e = cr, n = 0n) {
  const r = Cs - t - n;
  return r > 0n ? Number(r / ln(e)) : 0;
}
function tI(t, e = cr, n = 0n) {
  const r = t === void 0 ? 0 : J6(t, e, n);
  return Z6.map((s) => ({ plays: s, stx: Q6(s, e), fits: t !== void 0 && s <= r }));
}
const eI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, nI = (t) => eI[t.unit](t.amount), Se = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, fc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function rI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${fc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${fc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${fc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function sI(t) {
  let e = null, n = 0, r = "stx";
  const s = (o) => {
    var c;
    if (o.some((u) => u.plays === n && u.fits)) return;
    const a = o.filter((u) => u.fits);
    n = ((c = a.find((u) => {
      var h;
      return u.plays === ((h = o[1]) == null ? void 0 : h.plays);
    }) ?? a.at(-1)) == null ? void 0 : c.plays) ?? 0;
  };
  function i() {
    var g;
    if (!e) return;
    const o = t.input();
    if (!o) {
      e.close();
      return;
    }
    const a = tI(o.balance, o.fee, o.incoming);
    s(a);
    const c = W6(o.switches);
    (g = c.find((S) => S.id === r)) != null && g.on || (r = "stx");
    const u = [], h = Se("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Se("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fc(o.playsLeft, "play", "plays")} left.`));
    const l = rI(o.done);
    if (l && u.push(Se("p", "ppp-restock__done", l)), o.arriving)
      u.push(Se("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      u.push(Se("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      u.push(Se("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = Se("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const O of a) {
        const F = Se("button", "ppp-restock__pack" + (O.plays === n ? " is-on" : ""));
        F.type = "button", F.disabled = !O.fits, F.setAttribute("aria-pressed", String(O.plays === n)), F.append(Se("b", "", O.plays.toLocaleString()), Se("span", "", "plays")), F.onclick = () => {
          n = O.plays, i();
        }, S.append(F);
      }
      u.push(S);
      const v = Se("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const O of c) {
        const F = Se("button", "ppp-restock__way" + (O.id === r ? " is-on" : ""));
        F.type = "button", F.disabled = !O.on, F.setAttribute("aria-pressed", String(O.id === r)), F.append(Se("b", "", O.label), Se("span", "", O.on ? O.blurb : "Soon")), F.onclick = () => {
          r = O.id, i();
        }, v.append(F);
      }
      u.push(v);
      const T = a.find((O) => O.plays === n);
      if (T && r === "stx") {
        const O = Se("div", "ppp-restock__pay"), F = nI({ unit: "microSTX", amount: T.stx }), k = Se("p", "ppp-restock__amount");
        k.append("Send ", Se("b", "", F), " to your player:"), O.append(k, Se("p", "ppp-addr-full ppp-restock__addr", o.address));
        const C = Se("div", "ppp-restock__row");
        C.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => nr(T.stx), "")), O.append(C), O.append(Se("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), u.push(O);
      }
    }
    u.push(Se("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const y = Se("button", "quiet ppp-connect__cancel", "Close");
    y.type = "button", y.onclick = () => e == null ? void 0 : e.close(), u.push(y), e.replaceChildren(...u);
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
const Gr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), iI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function oI(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = e(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: iI(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function aI(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Gr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function cI(t, e, n = "", r = 60) {
  const s = Gr(e).split(/\s+/).filter(Boolean), i = Gr(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of t) {
    const c = Gr(a.artist), u = Gr(a.title), h = String(a.id);
    if (i && c !== i) continue;
    let l = 0, y = !0;
    for (const g of s) {
      const S = g.replace(/^#/, "");
      if (u.includes(g)) l += u.startsWith(g) ? 0 : 1;
      else if (/^\d+$/.test(S) && h === S) l += 0;
      else if (c.includes(g)) l += 2;
      else if (/^\d+$/.test(S) && h.startsWith(S)) l += 3;
      else {
        y = !1;
        break;
      }
    }
    y && o.push({ s: a, rank: l });
  }
  return o.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: o.slice(0, r).map((a) => a.s), total: o.length };
}
const Qn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, vp = 12;
function lI(t, e) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = Qn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Qn("div", "hint"), u = Qn("div", "find-artists"), h = Qn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const l = Qn("div", "likesTools");
  l.append(a), t.replaceChildren(l, c, u, h), a.oninput = () => {
    s = a.value, g();
  };
  function y() {
    r === "loading" || r === "ready" || (r = "loading", g(), e.load().then((S) => {
      n = S, r = "ready", g();
    }, () => {
      r = "failed", g();
    }));
  }
  function g() {
    const S = e.locked();
    if (a.disabled = S, S) {
      c.textContent = "An album is open and plays only its own songs. Go back to My player to find other music.", u.replaceChildren(), h.replaceChildren();
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
      const C = Qn("button", "", "Try again");
      C.type = "button", C.onclick = () => {
        r = "idle", y();
      }, c.append(C), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = aI(n), T = o ? v : v.slice(0, vp), O = (C, _, Y, rt = "") => {
      const X = Qn("button", "find-chip" + (_ ? " is-on" : ""), C);
      return X.type = "button", X.setAttribute("aria-pressed", String(_)), rt && (X.title = rt), X.onclick = Y, X;
    };
    u.replaceChildren(
      ...T.map((C) => O(`${C.name} · ${C.songs}`, Gr(C.name) === Gr(i), () => {
        i = Gr(C.name) === Gr(i) ? "" : C.name, g();
      }, `Show ${C.name}’s ${C.songs === 1 ? "song" : `${C.songs} songs`}`)),
      ...v.length > vp ? [O(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, g();
      })] : []
    );
    const F = cI(n, s, i), k = e.current();
    h.replaceChildren(...F.songs.map((C) => {
      var rt;
      const _ = Qn("li", "lrow" + (C.id === k ? " now" : "")), Y = Qn("button", "lt", C.title);
      if (Y.type = "button", Y.title = `Play “${C.title}”${C.artist ? ` by ${C.artist}` : ""}`, Y.onclick = () => e.play(C.id), (rt = e.explicit) != null && rt.call(e, C.id)) {
        const X = Qn("span", "exp", "E");
        X.title = "Explicit lyrics: only plays when you choose it", Y.append(" ", X);
      }
      return _.append(Y, Qn("span", "find-by", `${C.artist ? C.artist + " · " : ""}#${C.id}`)), _;
    })), c.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${v.length.toLocaleString()} artists. Search, or pick an artist.` : F.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : F.total > F.songs.length ? `Showing ${F.songs.length} of ${F.total.toLocaleString()}. Type more to narrow it down.` : `${F.total} ${F.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: y, refresh: g };
}
const Qo = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], uI = (t) => typeof t == "string" && Qo.some((e) => e.id === t), fI = (t) => Qo.find((e) => e.id === t), dI = (t) => Qo.find((e) => t >= e.min) ?? Qo[Qo.length - 1];
function hI(t, e = cr) {
  return dI(t <= Ue ? 0 : Number((t - Ue) / ln(e)));
}
const kp = document.getElementById("ppp");
kp && pI(kp);
function pI(t) {
  var Nr;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Fb(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, b) => {
    const E = await fetch(f, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), d = await E.json().catch(() => ({}));
    if (!E.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${E.status}).`);
    return d;
  }, c = g5({
    now: Date.now,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    config: (f) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(f || "")),
    links: async (f) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(f))).links ?? [],
    mainOf: async (f) => {
      var E;
      const b = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(f))).links;
      return ((E = b == null ? void 0 : b.find((d) => d.listening === f)) == null ? void 0 : E.main) ?? null;
    },
    saveLink: async (f) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    },
    bridge: async (f) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${f}; publickey-credentials-create ${f}`), o.referrerPolicy = "no-referrer";
      const b = new Promise((ut, p) => {
        o.addEventListener("load", () => ut(), { once: !0 }), setTimeout(() => p(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await b;
      const E = new Bb({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), z = (ut, p) => d.has(ut) ? E.request(ut, p) : Promise.race([
        E.request(ut, p),
        new Promise((A, j) => setTimeout(() => j(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await z("listening.status"), { request: z };
    },
    chain: {
      verify: X$,
      balance: W$,
      account: q$,
      owner: Z$,
      broadcast: Q$,
      transaction: J$,
      confirmedNonce: async (f) => {
        const b = await Ns(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (f, b) => Z0({ ...b, network: "mainnet", stxAddress: f }),
    deposit: (f, b, E) => new Promise((d, z) => V0({
      recipient: b,
      amount: E.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new Jl(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ut) => d(ut.txId || ""),
      onCancel: () => z(new Error("Deposit cancelled. Nothing was sent.")),
      onError: z
    })),
    validate: t5,
    tabLock: (f) => new Promise((b) => {
      const E = navigator.locks;
      if (!(E != null && E.request)) {
        b(!0);
        return;
      }
      E.request("xtrata-ppp:" + f, { ifAvailable: !0 }, async (d) => {
        b(!!d), d && await new Promise(() => {
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
      set: (f, b) => {
        try {
          localStorage.setItem(f, b);
        } catch {
        }
      }
    },
    changed: () => de(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var b, E;
      return u.funder(f, () => o5(f, Ns), !!((E = (b = c.snapshot().gate) == null ? void 0 : b.gifts) != null && E.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const b = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), E = b == null ? void 0 : b.gift;
      if (!E) return null;
      if (typeof E.returnTo != "string" || typeof E.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: E.returnTo, from: typeof E.from == "string" ? E.from : null, source: String(E.source ?? ""), amount: String(E.amount ?? "0"), treasury: E.treasury, state: E.state === "sending" ? "sending" : "arrived", player: E.player ?? null };
    },
    history: (f, b) => l5(f, (E) => Ns(E), b),
    likesChanged: () => {
      var f, b;
      (b = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || b.call(f);
    },
    likeState: async (f, b) => {
      const E = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(b) })), d = Array.isArray(E == null ? void 0 : E.rows) ? E.rows.find((z) => (z == null ? void 0 : z.id) === b) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((z) => typeof z == "string") : d.liked ? [f] : [] };
    },
    likeSent: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: b } })),
    nameOf: (f) => Rt(f) ?? void 0,
    likeConfirmed: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: b } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = y6({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, b, E, d) => new Promise((z, ut) => V0({
      recipient: b,
      amount: E.toString(),
      memo: d,
      stxAddress: f,
      network: new Jl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (p) => z(p.txId || ""),
      onCancel: () => ut(new Error("Gift cancelled. Nothing was sent.")),
      onError: ut
    })),
    sign: (f, b) => Z0({ ...b, network: "mainnet", stxAddress: f }),
    giftSent: (f, b) => c.giftSent(f, b),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, b, E, d) => {
      h.invalidate(), await c.albumArriving(f, b, E, d);
    } },
    who: (f) => At(f),
    changed: () => de(c.snapshot()),
    store: {
      get: (f) => {
        try {
          return localStorage.getItem(f);
        } catch {
          return null;
        }
      },
      set: (f, b) => {
        try {
          b === null ? localStorage.removeItem(f) : localStorage.setItem(f, b);
        } catch {
        }
      }
    },
    now: Date.now
  }), h = $6({
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
      set: (f, b) => {
        try {
          b === null ? localStorage.removeItem(f) : localStorage.setItem(f, b);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => de(c.snapshot())
  }), l = {
    get: (f) => {
      try {
        return localStorage.getItem(f);
      } catch {
        return null;
      }
    },
    set: (f, b) => {
      try {
        b === null ? localStorage.removeItem(f) : localStorage.setItem(f, b);
      } catch {
      }
    }
  }, y = _6(location.search, l);
  y.on && (document.documentElement.dataset.novice = y.preview ? "preview" : "1");
  const g = (f) => y.on && f.solo, S = y.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), v = S ? document.getElementById("album") : null, T = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (f) => void c.topUpAlbum(f),
    openPlayer: () => void c.openAlbum(0)
  }, O = v ? xp(v, T) : null, F = "xtrata.radio.tier.v1";
  let k = (() => {
    const f = l.get(F);
    return uI(f) ? fI(f) : null;
  })();
  const C = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function _(f) {
    if (f.listening && f.slot === 0 && ["fund", "ready", "over"].includes(f.step)) {
      let z = null;
      try {
        z = f.gift && !f.gift.player ? hI(BigInt(f.gift.amount)) : null;
      } catch {
        z = null;
      }
      ((z == null ? void 0 : z.id) ?? null) !== ((k == null ? void 0 : k.id) ?? null) && (k = z, l.set(F, z ? z.id : null));
    }
    const b = document.documentElement;
    k ? b.dataset.tier = k.id : delete b.dataset.tier;
    const E = document.querySelector("#ppp .ppp-head h3");
    if (!E) return;
    let d = E.querySelector(".ppp-tier");
    if (!k) {
      d == null || d.remove();
      return;
    }
    d || (d = x("span", "", "ppp-tier"), E.append(d)), d.dataset.tier = k.id, d.textContent = `${k.mark} ${k.name.toUpperCase()} PLAYER`, d.title = `A ${k.name} player from the Xtrata Music giveaway`;
  }
  const Y = y.on && v ? q6(v) : null, rt = Date.now();
  let X = !1, q = null, $ = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const U = () => {
    $ = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    de(c.snapshot());
  }, m = (f, b) => {
    var z;
    if (!Y || b || $) return null;
    if (!f.gate || f.step === "loading" || (X = !0), !X) return Date.now() - rt < 1e4 ? "checking" : null;
    if (!g(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const d = f.slot === 0 && !((z = f.gift) != null && z.player) && !f.entries.some((ut) => ut.kind === "play");
    return f.step === "fund" && d ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && d && (q === "arriving" || q === "landed") ? "landed" : f.step === "loading" && q !== "checking" ? q : null;
  };
  function N(f, b, E = [], d) {
    if (!Y) return;
    const z = d !== void 0 ? d : m(f, b);
    if (q = z, delete document.documentElement.dataset.noviceBoot, !z) {
      Y.render(null, b);
      return;
    }
    const ut = [...E];
    z === "arriving" && f.arrival && ut.push(dr(f.arrival)), f.step === "unsupported" ? ut.push(x("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && ut.push(x("p", f.error, "ppp-warn"));
    const p = z === "gift" ? u.incomingStarter() : null;
    Y.render({
      mode: z,
      status: ut,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !Kt,
      plays: p ? p.plays : z === "landed" ? f.playsLeft : null,
      from: (p == null ? void 0 : p.from) ?? null,
      tier: k,
      mystery: C,
      albums: z === "landed" ? ne.map((A) => ({ title: A.title, by: A.subtitle, run: () => {
        U(), Lt(A, !0);
      } })) : [],
      start: () => void c.create(),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => B.open(),
      full: () => {
        var Z, dt, H;
        const A = window.XtrataRadio, j = z === "landed" && !((dt = (Z = A == null ? void 0 : A.getState) == null ? void 0 : Z.call(A)) != null && dt.playing);
        U(), j && ((H = A == null ? void 0 : A.playPause) == null || H.call(A));
      }
    });
  }
  Y && setTimeout(() => {
    X || de(c.snapshot());
  }, 10100);
  const B = sI({
    input: () => {
      var z, ut, p, A;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const b = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (z = f.likeFunds) == null ? void 0 : z.balance };
      if (!b.address) return null;
      const E = f.slot === 0 ? f.entries : [], d = E.filter((j) => j.kind === "play" && j.status === "confirmed");
      return {
        playsLeft: b.balance === void 0 ? null : pe(b.balance),
        balance: b.balance,
        incoming: 0n,
        fee: BigInt(((ut = f.gate) == null ? void 0 : ut.limits.playFee) ?? "300"),
        address: b.address,
        switches: ((p = f.gate) == null ? void 0 : p.restock) ?? {},
        done: d.length ? { plays: d.length, artists: new Set(d.map((j) => j.recipient)).size, likes: E.filter((j) => j.kind === "like" && j.status === "confirmed" && j.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((A = f.likeFunds) != null && A.pending)
      };
    },
    copyButton: (f, b, E, d) => Fr(f, b, E, d, () => {
      de(c.snapshot());
    })
  }), it = document.getElementById("albumList"), W = it ? xp(it, T, { list: !0 }) : null, $t = "xtrata.radio.album.last.v1", L = () => {
    try {
      const f = JSON.parse(localStorage.getItem($t) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let D = "";
  const ct = (f) => {
    const b = JSON.stringify(f);
    if (b !== D) {
      D = b;
      try {
        localStorage.setItem($t, b);
      } catch {
      }
    }
  };
  let ot = null;
  window.XtrataRadioLikeHandler = (f) => {
    var E;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (E = c.snapshot().likeFunds) != null && E.album && (Xt = !0), Be();
    const b = fe(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let lt;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const Pt = (f) => {
    var E, d;
    const b = window.XtrataRadioListeningIdentity();
    b !== lt && (lt = b, (d = (E = window.XtrataRadio) == null ? void 0 : E.refreshLikes) == null || d.call(E));
  };
  let ne = [], kt = 0, Gt = !1, vt = null;
  const De = (f) => {
    var b, E;
    Gt || !((E = (b = f.gate) == null ? void 0 : b.gifts) != null && E.enabled) || Date.now() - kt < 6e4 || (kt = Date.now(), a("/radio/gift/featured").then((d) => {
      ne = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((z) => z && typeof z.id == "string" && typeof z.title == "string" && Array.isArray(z.tracks) && z.tracks.length > 0).slice(0, 6), Gt = !0, ne.length && de(c.snapshot());
    }).catch(() => {
    }));
  }, Ht = (f) => {
    var b;
    return vt && f.slot === 0 && !((b = f.gift) != null && b.player) && ["ready", "fund", "loading"].includes(f.step) ? vt : null;
  }, Lt = (f, b = !1) => {
    var d, z;
    vt = f, de(c.snapshot());
    const E = f && b ? zr(f)[0] : null;
    E && ((z = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || z.call(d, E.id));
  };
  let jt = cf(), le = null;
  const kn = (f) => {
    const b = y.preview && !Kt && f.step === "intro" ? u.incomingAlbum() : null;
    return b ? (jt = Ql(jt, { kind: "offer", album: b.player.id, already: db(l).includes(b.player.id) }), ec(jt) ? b.player : null) : (jt = Ql(jt, { kind: "withdraw" }), null);
  }, wn = (f) => {
    const b = jt.phase;
    jt = Ql(jt, f), jt.phase !== b && (jt.album && (jt.phase === "playing" || jt.phase === "done") && z6(l, jt.album), de(c.snapshot()));
  };
  setInterval(() => {
    jt.phase === "playing" && wn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Te = "", qe, Ve = !1, en = !1;
  const Re = (f, b) => {
    var H, at, tt, ht, bt, Zt, ke, ge;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const d = b.depositPending && f.step === "fund" && ((H = f.giftStop) == null ? void 0 : H.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, z = le, ut = d ? g(f) ? D6(d.reason, d.text) : d.text : null, p = z ? null : ut ?? (e && (!((at = f.gate) != null && at.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    p && p !== qe && (E.setGiftStop(p), qe = p);
    const A = f.step === "off" || f.step === "elsewhere" ? null : ((tt = f.gift) == null ? void 0 : tt.player) ?? z ?? Ht(f) ?? null, j = A ? A.id + ":" + A.cover + ":" + A.tracks.map((je) => je.id).join(",") : "";
    j !== Te && (E.setGiftPlayer(A ? { id: A.id, title: A.title, subtitle: A.subtitle, tracks: zr(A).map((je) => je.id), hidden: ((ht = h6(A)) == null ? void 0 : ht.id) ?? null, cover: A.cover } : null), Te = j), p !== qe && (E.setGiftStop(p), qe = p);
    const Z = (d == null ? void 0 : d.reason) === "arriving";
    Z !== en && ((bt = E.setGiftWait) == null || bt.call(E, Z), en = Z);
    const dt = !!A && (!!z || !!((Zt = f.albumLock) != null && Zt.locked));
    dt !== Ve && ((ke = E.setGiftLock) == null || ke.call(E, dt), Ve = dt), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((ge = E.forgetWallets) == null || ge.call(E));
  };
  let Xt = !1;
  const Ye = /* @__PURE__ */ new Map(), nn = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((d) => d.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let E = Ye.get(f.listening);
    return E === void 0 && (E = Date.now(), Ye.set(f.listening, E)), Date.now() - E < Dc ? E : null;
  }, Fe = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((b) => b.kind === "play") && !!f.listening && Ye.has(f.listening), oe = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", pe = (f) => {
    const b = c.snapshot().playCost || 350n;
    return f > Ue ? Number((f - Ue) / b) : 0;
  }, Xn = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), lr = (f) => {
    const b = Math.round((Date.now() - f) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, I = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, x = (f, b = "", E = "") => {
    const d = document.createElement(f);
    return b && (d.textContent = b), E && (d.className = E), d;
  }, P = (f, b, E = "") => {
    const d = x("button", f, E);
    return d.type = "button", d.onclick = b, d;
  }, G = (f, b) => {
    const E = x("a", f);
    return E.href = b, E.target = "_blank", E.rel = "noopener", E;
  };
  let gt = null, wt = location.hash === "#give";
  wt && history.replaceState(null, "", location.pathname + location.search);
  let qt = !1;
  const ye = Q5((f) => Z5({ address: f, network: "mainnet" }), () => de(c.snapshot())), Rt = (f) => ye.get(f), Kt = B6(navigator.userAgent), re = (f, b) => {
    const E = navigator.userAgent, d = N6(E), z = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, ut = [x("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${y.on ? "player" : "listening wallet"}${b ? y.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], p = x("div", "", "ppp-open-row"), A = M6(z, E);
    if (A) {
      const j = x("a", `Open in ${d}`, "primary ppp-open-in");
      j.href = A, j.dataset.homeAction = "radio:open-in-browser", p.append(j);
    }
    return p.append(Fr("copy-page-link", "Copy link", () => z, A ? "" : "primary", () => de(c.snapshot()))), ut.push(p, x("p", `If that does not open ${d}, use ${f}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), ut;
  }, At = (f) => Rt(f) ?? oe(f), Yt = (f) => f.slice(0, 2).map(At).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), St = /* @__PURE__ */ new Map();
  let Wt = !1;
  const ue = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), Be = () => {
    Wt || (Wt = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const b of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const E = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(E) && St.set(E, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      de(c.snapshot());
    }).catch(() => {
      Wt = !1;
    }));
  }, fe = (f, b) => {
    const E = St.get(f), d = up(f, [E == null ? void 0 : E.title, b == null ? void 0 : b.title].find((ut) => !ue(ut)) || ""), z = cp(f, (E == null ? void 0 : E.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: d, artist: z };
  }, rn = (f) => {
    const { title: b, artist: E } = fe(f.song, f);
    return b ? `“${b}”${E ? ` — ${E}` : ""}` : `Song #${f.song}${E ? ` — ${E}` : ""}`;
  }, bn = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, qr = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function qn(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Me(f, b, E = "", d) {
    const z = x("dt", f), ut = x("dd", b, E);
    return d && ut.append(" ", d), [z, ut];
  }
  const $n = document.getElementById("ppp-top"), Os = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Dt = () => {
    var b;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (b = document.getElementById("radio-wallet-connect")) == null || b.click();
  }, We = () => {
    var b, E;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      Dt();
      return;
    }
    if (f.step === "elsewhere" && ((b = f.gate) != null && b.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    if (f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((E = f.giftStop) == null ? void 0 : E.reason) === "off" && !f.busy && c.switchOn(), f.step === "fund" && f.solo && !f.depositPending && !f.busy) {
      B.open();
      return;
    }
    Os();
  };
  $n && ($n.onclick = We);
  const sn = (f, b, E, d = "") => f.standIn && !f.mainConnected ? P(`Connect ${At(f.standIn)} to add STX`, Dt, d) : P(b, E, d), Hs = (f) => {
    c.useLinked(f).then(() => Os());
  };
  let ur = null;
  const On = () => {
    const f = Sp(c.snapshot(), At);
    return f.length ? ur || (ur = new Promise((b) => {
      var dt;
      const E = x("dialog", "", "ppp-connect");
      E.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const z = (H) => {
        d = H, E.close();
      };
      E.addEventListener("close", () => {
        E.remove(), ur = null, b(d);
      }), E.addEventListener("click", (H) => {
        H.target === E && z(null);
      });
      const ut = (H, at, tt, ht, bt = !1) => {
        const Zt = x("button", "", "ppp-connect__opt " + tt);
        return Zt.type = "button", Zt.disabled = bt, Zt.onclick = ht, Zt.append(x("b", H), x("span", at)), Zt;
      }, p = x("h2", "Connect", "ppp-connect__title");
      p.id = "ppp-connect-title";
      const A = f.map((H) => ut(H.label, H.detail, "is-music", () => {
        if (z("music"), H.action === "linked" && H.main) {
          Hs(H.main);
          return;
        }
        const at = Sp(c.snapshot(), At).find((tt) => tt.action !== "linked");
        (at == null ? void 0 : at.action) === "create" ? c.create() : (at == null ? void 0 : at.action) === "unlock" && c.unlock(), Os();
      }, !!H.disabled)), j = ut("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => z("stacks")), Z = P("Cancel", () => z(null), "quiet ppp-connect__cancel");
      E.append(p, ...A, j, Z), document.body.appendChild(E), E.showModal(), (dt = A.find((H) => !H.disabled)) == null || dt.focus();
    }), ur) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = On;
  function Wr(f) {
    if (!$n) return;
    const b = (d, z, ut) => {
      $n.hidden = !1, $n.className = "ppp-top" + (z ? " is-" + z : ""), $n.replaceChildren(x("span", "", "dot"), document.createTextNode(d)), $n.title = ut;
    }, E = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        $n.hidden = !0;
        return;
      case "elsewhere":
        return b("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        $n.hidden = !0;
        return;
      case "intro":
        return b("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return b(`Connect ${At(f.linked)}`, "warn", `This device's listening wallet belongs to ${At(f.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return b("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return b("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return f.depositPending ? b("Plays on their way", "quiet", "Plays start by themselves when they land") : b(f.entries.some((d) => d.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return b("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return b("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return f.payingOn && E > 0 && !f.giftStop ? b(`${E.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : b("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const xe = document.getElementById("pppNudge"), mn = document.getElementById("onair");
  (Nr = xe == null ? void 0 : xe.querySelector("button")) == null || Nr.addEventListener("click", () => We());
  const Ds = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Mo = {
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
  function No(f) {
    if (f.step === "loading") return;
    const b = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, E = f.step === "ready" && f.payingOn && b > 0 && !f.giftStop, d = f.step === "fund" && f.depositPending, z = f.step === "elsewhere" && !e, ut = E || d || z ? "" : Ds[f.step] ?? "", p = E ? "on" : z ? "free" : ut ? "off" : "";
    p ? document.documentElement.dataset.ppp = p : delete document.documentElement.dataset.ppp, mn && (mn.hidden = !p || p === "free", mn.querySelector(".onair-sub").textContent = E ? `${b.toLocaleString()} plays left` : "Plays off"), xe && (xe.hidden = p !== "off" && p !== "free", xe.classList.toggle("is-free", p === "free"), p === "free" ? (xe.querySelector(".nudge-t").textContent = "You’re on the free player", xe.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", xe.querySelector("button").textContent = "Get a player") : p === "off" && (xe.querySelector(".nudge-t").textContent = ut, xe.querySelector(".nudge-s").textContent = g(f) ? f.step === "intro" ? j6 : "" : "This radio requires a funded listening wallet with music support on.", xe.querySelector("button").textContent = Mo[f.step] ?? "Start"));
  }
  let Fs = "";
  function js(f) {
    const b = x("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && b.append(x("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && b.append(x("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const E = x("input");
    E.type = "text", E.placeholder = "SP… address to send returns to", E.autocomplete = "off", E.spellcheck = !1, E.setAttribute("aria-label", "Address to return funds to"), E.value = Fs, E.oninput = () => {
      Fs = E.value;
    };
    const d = P(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(E.value), Fs = "";
    }, "tiny");
    return b.append(E, " ", d), f.returnToKind === "chosen" && b.append(" ", P("Back to the funder", () => c.clearReturnAddress(), "tiny")), b;
  }
  const fr = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function In() {
    const f = x("p", fr + " ", "ppp-mute");
    return f.append(G("Xverse", "https://www.xverse.app/download"), " · ", G("Leather", "https://leather.io/install-extension")), f;
  }
  let Mi = "";
  const Ni = (f) => {
    const b = document.documentElement, E = f.solo && !f.main ? f.listening ? oe(f.listening) : "new" : "", d = x5() ? "1" : "", z = f.standIn && !f.mainConnected ? At(f.standIn) : "";
    `${E}|${d}|${z}` !== Mi && (Mi = `${E}|${d}|${z}`, E ? b.dataset.pppSolo = E : delete b.dataset.pppSolo, z ? b.dataset.pppAs = z : delete b.dataset.pppAs, d ? b.dataset.pppWalletInstalled = d : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => de(c.snapshot()), f);
  function Pi(f, b = "") {
    const E = x("div", "", "ppp-topup"), d = Zr(f);
    E.append(x("span", "Add plays from My player: ", "ppp-mute"));
    for (const z of uc) {
      const ut = P(`+${z.toLocaleString()}`, () => void c.topUpAlbum(z), b);
      ut.disabled = d === void 0 || d < z || f.depositPending || !!f.busy, E.append(ut);
    }
    return d !== void 0 && d < uc[0] && E.append(x("p", "My player needs plays first (switch to My player above).", "ppp-mute")), E;
  }
  const Zr = (f) => {
    var d;
    const b = (d = f.likeFunds) == null ? void 0 : d.balance;
    if (b === void 0 || !f.playCost) return;
    const E = b - Ue - 6000n;
    return E > 0n ? Number(E / f.playCost) : 0;
  };
  function Rs(f) {
    const b = f.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    if (b.low || (Xt = !1), b.low && !Xt) return [];
    const E = x("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      if (!b.txid) return [];
      const z = x("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return b.txid && z.append(G("View", I(b.txid))), E.append(z), [E];
    }
    E.append(x("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), E.append(x("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), E.append(x("p", b.address, "ppp-addr-full"));
    const d = x("div", "", "ppp-open-row");
    if (d.append(Fr("copy-likes-address", "Copy address", () => b.address, "primary", () => de(c.snapshot()))), b.main && !f.solo) {
      const z = Cs - (b.balance ?? 0n);
      z > 0n && d.append(sn(f, `Pay ${nr(z)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return E.append(d), E.append(x("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [E];
  }
  const dr = (f) => {
    const b = x("div", "", "ppp-wait");
    b.dataset.since = String(f.since), b.dataset.grace = String(f.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const E = x("p", "", "ppp-wait-t"), d = x("div", "", "ppp-wait-track");
    return d.append(x("div", "", "ppp-wait-fill")), b.append(E, d), Wn(b), b;
  };
  function Wn(f) {
    const b = Number(f.dataset.since), E = Number(f.dataset.grace) || 6e4, d = Math.max(0, Date.now() - b), z = f.querySelector(".ppp-wait-fill"), ut = f.querySelector(".ppp-wait-t");
    if (d < E) {
      const p = Math.ceil((E - d) / 1e3);
      z.style.width = Math.max(4, Math.min(95, d / E * 100)).toFixed(0) + "%", ut.textContent = `Your plays are arriving… usually about a minute · ${p}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(d / E * 100)));
    } else
      z.style.width = "", ut.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let zs = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      zs = 0;
      return;
    }
    f.forEach(Wn), ++zs % 10 === 0 && de(c.snapshot());
  }, 1e3);
  let Zn = null;
  function _i(f) {
    if (f.step === "loading" && Zn !== null) return;
    const E = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    E !== Zn && (Zn = E, E ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function de(f) {
    var Ad, vd, kd, $d, Id, Ld, Cd, Td, Bd, Md, Nd, Pd, _d, Ud, Od, Hd;
    if (ot && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const V = ot;
      ot = null, f.root === V.root && f.slot !== V.slot && c.openAlbum(V.slot);
    }
    const b = u.inProgress(f), E = nn(f), d = b && f.step === "fund" ? { ...f, depositPending: !0 } : E !== null ? { ...f, depositPending: !0, arrival: { since: E, graceMs: Dc } } : f, z = d.error === Fc;
    if (Pt(), De(f), _(f), le = kn(f), Re(f, d), _i(d), Ni(d), !b && u.inProgress(f)) return;
    if (Wr(d), No(d), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? y.on ? R6 : "Checking your listening wallet…" : y.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = d.step === "off", t.hidden) {
      N(d, !1);
      return;
    }
    const [ut, p] = qn(d), A = s(".ppp-state");
    A.textContent = ut, A.className = "ppp-state" + (p ? " ppp-state--" + p : ""), A.hidden = !ut;
    const j = !!d.busy || d.armed, Z = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (j || !["intro", "loading"].includes(d.step));
    i.hidden = !Z, i.classList.toggle("ppp-frame--rest", !j && !qt);
    const dt = s(".ppp-frame-label");
    dt.hidden = !0;
    const H = y5(d) ?? gt;
    gt = H;
    const at = "xtrata.radio.ppp.heard.v1", tt = (() => {
      try {
        return localStorage.getItem(at) === "1";
      } catch {
        return !1;
      }
    })();
    if (!tt && d.entries.some((V) => V.kind === "play"))
      try {
        localStorage.setItem(at, "1");
      } catch {
      }
    const ht = tt || d.slot > 0 && ((((Ad = d.likeFunds) == null ? void 0 : Ad.balance) ?? 0n) > 0n || h.count() > 1), bt = g(d), Zt = !bt && b5({ ...d, heard: ht }, H);
    s(".ppp-badge").hidden = !Zt;
    const ke = s(".ppp-steps"), ge = s(".ppp-stage");
    ke.hidden = ge.hidden = !Zt, H && Zt && (ke.replaceChildren(...rf(d.solo).map((V, et) => {
      const Et = x("li", "", et < H.at ? "done" : et === H.at ? H.blocked ? "now blocked" : "now" : "");
      return Et.append(x("span", et < H.at ? "✓" : String(et + 1), "n"), V), et === H.at && Et.setAttribute("aria-current", "step"), Et;
    })), ge.textContent = H.caption, ge.className = "ppp-stage " + (H.at >= rf(d.solo).length ? "ppp-ok" : H.blocked ? "ppp-bad" : "ppp-cyan"));
    const je = s(".ppp-facts"), Ze = [];
    d.main && ((vd = d.gate) != null && vd.here) && !d.solo && Ze.push(...Me("Your wallet", At(d.main), "ppp-addr-short"));
    const ma = () => {
      if (!d.listening) return;
      const V = Fr("copy-listening", "Copy", () => d.listening || "", "tiny", () => de(c.snapshot()));
      Ze.push(...Me(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", oe(d.listening), "ppp-addr-short", V));
    };
    if (d.linked || ma(), d.listening && d.step !== "intro")
      if (d.linked)
        Ze.push(...Me("Credited to", `${At(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), ma();
      else if (d.solo) {
        d.creditedTo && Ze.push(...Me("Credited to", `${At(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const V = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${At(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ze.push(...Me("Returns go to", d.gift ? V : d.returnTo && !Rt(d.returnTo) ? V.replace(oe(d.returnTo), d.returnTo) : V, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ze.push(...Me("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((kd = d.gate) != null && kd.here)) {
      const V = d.linkedListening.map((et) => oe(et) + (et === d.listening ? " (this one)" : "")).join(", ");
      Ze.push(...Me(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", V, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const V = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ze.push(...Me("Balance", `${nr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, V));
    }
    const Gs = d.entries.find((V) => V.kind === "play");
    Gs && Be(), Gs && Ze.push(...Me("Last paid song", `${rn(Gs)} → ${At(Gs.recipient)}`, bn[Gs.status] || "")), je.replaceChildren(...Ze), je.hidden = !Ze.length;
    const mt = [], Jt = [], te = [], xn = [], Fi = ln(BigInt((($d = d.gate) == null ? void 0 : $d.limits.playFee) ?? "300")), xa = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${nr(Oc)} STX to the song holder, plus a ${nr(Fi - Oc)} STX network fee.`, Sa = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (mt.push(x("p", "Pay artists as you listen.")), (Id = d.gate) != null && Id.radioUrl) {
          const et = x("p");
          et.append(G("Open the pay-per-play radio →", d.gate.radioUrl)), mt.push(et);
        }
        Jt.push(x("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const et = [d.linked, ...d.others];
          mt.push(x("p", et.length > 1 ? `This device has listening wallets for ${Yt(et)}.` : `This device has a listening wallet for ${At(d.linked)}.`)), Jt.push(x("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), et.slice(0, 3).forEach((Et, se) => te.push(P(`Open ${At(Et)}`, () => Hs(Et), se === 0 ? "primary" : "")));
        } else
          mt.push(x("p", "Connect your wallet to pay artists as you listen.")), Jt.push(x("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        mt.push(x("p", `This device's listening wallet belongs to ${At(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Jt.push(x("p", `You are connected as ${At(d.main)}. Switch to the linked wallet to continue listening.`)), Jt.push(x("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), te.push(P("Switch wallet", Dt, "primary"));
        break;
      case "not-invited":
        mt.push(x("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        mt.push(x("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        mt.push(x("p", "Every play counts for the song’s owner, on-chain.")), Jt.push(x("p", xa)), Jt.push(x("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Jt.push(x("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (mt.push(x("p", `This device already has a listening wallet for ${Yt(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Jt.push(x("p", `Otherwise, set up a new listening wallet for ${At(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && Jt.push(x("p", `This is the listening wallet for ${At(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && Jt.push(x("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const V = u.liveGift();
        te.push(P(V ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${At(d.main)}` : "Start listening", () => void c.create(), "primary")), !V && !d.solo && d.main && d.others.length && te.push(P("Switch wallet", Dt)), !V && d.solo && te.push(P("I have a Stacks wallet", Dt)), te.push(P("I already have a listening wallet", () => void c.unlock(!0))), V && te.push(P("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (mt.push(x("p", "Locked.", "ppp-mute")), te.push(P("Unlock", () => void c.unlock(), "primary"))), d.standIn ? xn.push(P("Use a different listening wallet", () => void On().then((et) => {
          et === "stacks" && Dt();
        }), "quiet")) : xn.push(P("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        mt.push(x("p", `Link to ${At(d.main)} · free`)), Jt.push(x("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Jt.push(x("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), te.push(P(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        mt.push(x("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && mt.push(dr(d.arrival)) : Fe(d) ? mt.push(x("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Ld = d.gift) != null && Ld.player ? mt.push(x("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? mt.push(x("p", "No plays left · add plays to keep counting", "ppp-bad")) : mt.push(x("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Fi)).toLocaleString()} plays`)), d.entries.length && Jt.push(x("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && Jt.push(x("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b ? Jt.push(x("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? Jt.push(x("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (Jt.push(x("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Jt.push(x("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && te.push(Fr("copy-address", "Copy my address", () => d.listening || "", "primary", () => de(c.snapshot())))) : Jt.push(x("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const et = x("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          et.append(G("View", I(d.depositTxid))), mt.push(et);
        } else d.allowance > 0n && !d.solo && !d.depositPending && te.push(sn(d, `Deposit ${nr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        mt.push(x("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (mt.push(x("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), mt.push(js(d))), (!d.solo || d.returnTo) && te.push(P("Return excess", () => void c.returnFunds("excess"), "primary"), P("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((Cd = d.giftStop) == null ? void 0 : Cd.reason) !== "off") {
          const et = Math.min(d.session.playsLeft, d.playsLeft);
          mt.push(x("p", `${et.toLocaleString()} plays left`, "ppp-ok")), Jt.push(x("p", xa + " The heart likes or unlikes from this wallet for 0.0002 STX.")), te.push(P("Switch off", () => void c.switchOff()));
        } else
          mt.push(x("p", "Switch on music support to listen.", "ppp-mute")), te.push(P("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && mt.push(x("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && mt.push(x("p", "Running low on plays", "ppp-warn")), d.depositPending ? mt.push(x("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && te.push(sn(d, `Top up ${nr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const V = d.step === "fund", et = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      V ? te.unshift(P("Add plays", () => B.open(), "primary")) : et ? te.push(P("Add plays", () => B.open(), "primary")) : d.step === "ready" && xn.push(P("Add plays", () => B.open(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && Jt.push(x("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && Jt.push(js(d)), Jt.push(In()), d.slot === 0 && d.step === "ready" && d.entries.some((V) => V.kind === "play" && V.status === "confirmed"))) {
      const V = x("p", "New to Stacks? ", "ppp-mute");
      V.append(G("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), mt.push(V);
    }
    if (d.walletOutdated && Jt.push(x("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (mt.push(x("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), te.push(P("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && xn.push(P(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${At(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((Td = d.gift) != null && Td.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && xn.push(Pi(d, "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && xn.push(P("Lock", () => void c.lock(), "quiet")), Z && !j && xn.push(P(qt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      qt = !qt, de(c.snapshot());
    }, "quiet")), [...te, ...xn].forEach((V) => V.disabled = Sa), Sa && (te.length = 0), !bt && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Bd = d.gift) != null && Bd.player)) {
      const V = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", et = mt.at(0);
      d.step === "ready" && et ? et.append(x("span", ` · ${Xn(d.balance)} STX`, V)) : mt.push(x("p", `Balance ${Xn(d.balance)} STX`, V));
    }
    if (bt) {
      for (const Et of [...te, ...xn]) {
        const se = O6[Et.textContent ?? ""];
        se && (Et.textContent = se);
      }
      for (let Et = mt.length - 1; Et >= 0; Et--) Ap(mt[Et].textContent) && Jt.unshift(...mt.splice(Et, 1));
      for (let Et = te.length - 1; Et >= 0; Et--) Ap(te[Et].textContent) && xn.unshift(...te.splice(Et, 1));
      const V = d.entries.some((Et) => Et.kind === "play"), et = F6(d.step, { played: V, arriving: d.depositPending });
      et.length && mt.length && et.shift(), mt.push(...et.map((Et) => x("p", Et, "ppp-mute")));
    }
    if ((Md = d.gift) != null && Md.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const V = x("p", "", "ppp-gift");
      V.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && V.append(" · ", d.gift.player.subtitle);
      const et = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? x("span", " · plays on their way", "ppp-warn") : x("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      et && V.append(et);
      const Et = (Nd = mt.at(0)) == null ? void 0 : Nd.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && Et && /STX/.test(Et.textContent ?? "") && Et.remove(), mt.unshift(V), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          mt.splice(1, 0, x("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Pi(d, "primary"));
        else {
          const se = x("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          se.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), se.append(G("Xverse", "https://www.xverse.app/download"), " and ", G("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), mt.splice(1, 0, se);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const V = d.returnPlan, et = x("div", "", "ppp-pick");
      et.append(x("p", V.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Et = x("ul", "", "ppp-gift-list");
      V.steps.forEach((se, ts) => {
        const es = se.kind === "gift" ? "the unused gift" : se.kind === "deposit" ? "what was added to it" : "the rest", Sn = x("li");
        Sn.append(x("span", `${ts + 1}. ${nr(BigInt(se.send))} STX · ${es}`, "t"), x("span", se.to ? ` → ${At(se.to)}` : " → choose an address below", se.to ? "ppp-mute" : "ppp-warn")), Et.append(Sn);
      }), et.append(Et), V.kept && et.append(x("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), V.steps.some((se) => !se.to) && et.append(js(d)), et.append(P(V.steps.length > 1 ? `Confirm part 1 of ${V.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), mt.push(et);
    }
    const w = Ui(d), M = S ? w : null, R = m(d, !!M), ft = R === "gift" || R === "arriving" || R === "new", Ne = u.banner(f, { bare: !!M || R === "gift" || R === "arriving" }), ze = Kt && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? re(Kt, u.pendingCode()) : [];
    M || (mt.unshift(...Ne), mt.push(...Rs(d)), mt.unshift(...ze)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && mt.unshift(x("p", `This is ${At(d.creditedTo)}'s listening wallet. Plays and likes count for ${At(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...mt);
    const Ln = document.querySelector(".ppp-switch");
    if (Ln) {
      const V = h.latest(), et = d.slot > 0, Et = ["fund", "ready", "over"].includes(d.step) && (et || !!V);
      if (Ln.hidden = !Et, Et) {
        const se = (Sn, Ea, Aa, bl) => {
          const Ki = P("", bl, "ppp-tab");
          return Ki.setAttribute("aria-pressed", String(Aa)), Ki.append(x("span", Sn, "tt"), x("span", Ea === void 0 ? "…" : `${pe(Ea).toLocaleString()} plays`, "ts")), Ki.disabled = !!d.busy, Ki;
        }, ts = et ? ((_d = (Pd = d.gift) == null ? void 0 : Pd.player) == null ? void 0 : _d.title) ?? "Album" : V.title, es = P("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const Sn = document.querySelector(".ppp-shelf");
          Sn && (Sn.hidden = !1, Sn.open = !Sn.open, es.setAttribute("aria-expanded", String(Sn.open)), Sn.open && requestAnimationFrame(() => Sn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        es.setAttribute("aria-expanded", String(!!((Ud = document.querySelector(".ppp-shelf")) != null && Ud.open))), Ln.replaceChildren(
          se("🎧 My player", et ? (Od = d.likeFunds) == null ? void 0 : Od.balance : d.balance, !et, () => {
            et && c.openAlbum(0);
          }),
          se("💿 " + ts, et ? d.balance : void 0, et, () => {
            !et && V && c.openAlbum(V.slot);
          }),
          es
        );
      }
    }
    const Ge = h.render(d), Ks = document.querySelector(".ppp-shelf");
    if (Ks) {
      Ks.hidden = !Ge;
      const V = Ks.querySelector("summary");
      V && (V.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const et = Ks.querySelector(".ppp-shelf-body");
      Ge && et && !et.contains(Ge) && et.replaceChildren(Ge);
    }
    const Fn = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !Fn, Fn && !s(".ppp-gift-body").contains(Fn) && s(".ppp-gift-body").replaceChildren(Fn), Fn && wt) {
      wt = !1;
      const V = s(".ppp-gifts");
      V.open = !0, requestAnimationFrame(() => V.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ji = document.querySelector("#ppp .ppp-featured");
    if (ji) {
      const V = ne.length > 0 && d.slot === 0 && !((Hd = d.gift) != null && Hd.player) && d.step === "ready";
      ji.hidden = !V, V && ji.replaceChildren(x("p", "Albums in your player", "ppp-featured__h"), ...ne.map((et) => {
        const Et = (vt == null ? void 0 : vt.id) === et.id, se = P("", () => Lt(Et ? null : et, !Et), "ppp-featured__a" + (Et ? " is-on" : "")), ts = zr(et).length;
        return se.append(x("b", et.title), x("span", Et ? "Playing now · tap to go back to the radio" : `${et.subtitle ? et.subtitle + " · " : ""}${ts} ${ts === 1 ? "song" : "songs"}`)), se.setAttribute("aria-pressed", String(Et)), se.disabled = !!d.busy, se;
      }));
    }
    const Ri = document.querySelector("#ppp .ppp-yours");
    if (Ri) {
      const V = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      Ri.hidden = !V;
      const et = Ri.querySelector(".ppp-yours-body");
      if (V && et && et.getAttribute("data-for") !== d.listening) {
        et.setAttribute("data-for", d.listening);
        const Et = (bl, ...Ki) => {
          const Dd = x("details", "", "ppp-yours-item");
          return Dd.append(x("summary", bl), ...Ki), Dd;
        }, se = x("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        se.append(x("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const ts = x("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), es = x("p");
        es.append(G("Find a name at BNS One →", "https://bns.one"));
        const Sn = x("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ea = x("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Aa = x("p");
        Aa.append(G("See the giveaway →", "https://xtrata.xyz/giveaway")), et.replaceChildren(
          Et("Give your player a name", se, ts, x("p", d.listening, "ppp-addr-full"), Fr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => de(c.snapshot())), es),
          Et("Link it to a wallet you already have", Sn),
          Et("Bring a friend in", Ea, Aa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Jt), s(".ppp-actions").replaceChildren(...te), s(".ppp-actions2").replaceChildren(...xn);
    const zi = d.busy || d.message || "", Gi = s(".ppp-msg"), Jr = zi && mt.some((V) => (V.textContent ?? "").startsWith(zi.replace(/[.✓\s]+$/, ""))) ? "" : zi, xd = !Jr && !d.error ? d.notice : z && !Jr ? d.error : "";
    Gi.textContent = Jr || xd, Gi.classList.toggle("is-warn", !!xd), s(".ppp-err").textContent = z ? "" : d.error;
    const gb = d.entries.filter((V) => V.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...gb.slice(0, 5).map((V) => {
      const et = x("li"), Et = V.status === "confirmed" ? "ok" : V.status === "failed" ? "bad" : "warn";
      return et.append(x("span", "", "d " + Et), x("span", rn(V), "t"), x("span", lr(V.created), "ppp-mute")), V.txid && et.append(G("tx", I(V.txid))), et;
    })), s(".ppp-wallets").hidden = !(je.childElementCount || xn.length), s(".ppp-more").hidden = !Jt.length;
    const Sd = s(".ppp-history");
    Sd.hidden = !d.entries.length, d.entries.length && Be(), Sd.replaceChildren(x("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((V) => {
      const et = x("div", "", "ppp-row"), Et = V.kind === "play" ? [x("span", rn(V), "ppp-song"), x("span", ` · ${nr(BigInt(V.amount))} STX to ${At(V.recipient)}`, "ppp-mute")] : V.kind === "like" ? [x("span", `${V.liked ? "♥ Liked" : "Unliked"} ${rn(V)}`, "ppp-song"), x("span", ` · for ${d.linked ? At(d.linked) : "this listening wallet"}`, "ppp-mute")] : [x("span", `Returned ${nr(BigInt(V.amount))} STX`, "ppp-song"), x("span", ` to ${At(V.recipient)}`, "ppp-mute")];
      return et.append(
        x("span", qr[V.status] || V.status, "ppp-status " + (bn[V.status] || "")),
        ...Et,
        x("span", ` · ${new Date(V.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), V.txid && et.append(G("tx ↗", I(V.txid))), et;
    })), O == null || O.render(M ? Br(d, M, [...ze, ...Ne]) : null), N(d, !!M, ft ? [...ze, ...Ne] : ze, R), B.isOpen() && B.refresh(), Hi();
    const Ed = (w == null ? void 0 : w.mode) === "open" ? null : Ht(d);
    W == null || W.render((w == null ? void 0 : w.mode) === "open" ? Br(d, w, []) : Ed ? { ...Br(d, { mode: "open", player: Ed }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function Ui(f) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((d = f.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && ct({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const b = u.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const E = L();
    return E && (f.step === "locked" || ot && f.step === "loading") ? { mode: "locked", player: E.player } : null;
  }
  function Br(f, b, E) {
    var j, Z, dt, H, at;
    const d = !!f.busy || f.armed, z = [...E];
    f.depositPending && f.arrival && z.push(dr(f.arrival)), f.error ? z.push(x("p", f.error, f.error === Fc ? "ppp-warn" : "ppp-bad")) : f.message && !d ? z.push(x("p", f.message, "ppp-cyan")) : f.notice && z.push(x("p", f.notice, "ppp-warn")), b.mode === "open" && Xt && ((j = f.likeFunds) != null && j.album) && f.likeFunds.low && !f.likeFunds.pending && z.push(x("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ut = "Kept on this device with Face ID or your passkey. No app or account needed.", p = null, A = null;
    if (b.mode === "locked")
      p = { label: "Continue listening", run: () => {
        ot = L(), c.unlock();
      } }, A = { label: "Use a different passkey", run: () => {
        ot = null, c.unlock(!0);
      } };
    else if (b.mode === "arrive")
      if (f.step === "intro" && ec(jt) && jt.album === b.player.id) {
        const tt = window.XtrataRadio, ht = zr(b.player)[0], bt = jt.phase === "playing";
        p = { label: bt && !!((dt = (Z = tt == null ? void 0 : tt.getState) == null ? void 0 : Z.call(tt)) != null && dt.playing) ? "Pause" : bt ? "Carry on" : "Play the first song", run: () => {
          var ke, ge;
          bt ? (ke = tt == null ? void 0 : tt.playPause) == null || ke.call(tt) : ht && ((ge = tt == null ? void 0 : tt.playToken) == null || ge.call(tt, ht.id));
        } }, A = { label: "Make my player and hear it all", run: () => void c.create() }, ut = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const tt = jt.phase === "done" && jt.album === b.player.id;
        tt && !z.length && z.push(x("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), p = { label: tt ? "Keep listening" : "Open album", run: () => void c.create() }, A = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (p = { label: "Open album", run: () => void c.unlock() }, A = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? z.push(x("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : z.length || z.push(x("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: b.mode,
      player: b.player,
      from: b.from,
      offered: b.offered,
      plays: b.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: z,
      primary: p,
      secondary: A,
      hint: p ? ut : void 0,
      asking: d,
      busy: !!f.busy,
      myPlays: Zr(f),
      topUps: uc,
      canMake: !!((at = (H = f.gate) == null ? void 0 : H.gifts) != null && at.admin)
    };
  }
  const Hn = document.getElementById("findBox"), Oi = document.getElementById("findBody"), Dn = Hn && Oi ? lI(Oi, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : Promise.reject(new Error("catalogue unavailable"))).then((f) => oI(f == null ? void 0 : f.tracks, (b, E) => ({ title: up(b, ue(E.title) ? "" : E.title), artist: cp(b, E.artist || "") }))),
    play: (f) => {
      var b, E;
      (E = (b = window.XtrataRadio) == null ? void 0 : b.playToken) == null || E.call(b, f);
    },
    current: () => {
      var b, E, d, z;
      const f = Number((z = (d = (E = (b = window.XtrataRadio) == null ? void 0 : b.getState) == null ? void 0 : E.call(b)) == null ? void 0 : d.nowPlaying) == null ? void 0 : z.tokenId);
      return Number.isSafeInteger(f) ? f : null;
    },
    locked: () => {
      var f;
      return !!((f = c.snapshot().albumLock) != null && f.locked);
    },
    explicit: (f) => {
      var b, E;
      return !!((E = (b = window.XtrataRadio) == null ? void 0 : b.isExplicit) != null && E.call(b, f));
    }
  }) : null;
  Hn == null || Hn.addEventListener("toggle", () => {
    Hn.open && (Dn == null || Dn.load());
  });
  let ve = "";
  const Hi = () => {
    var b, E, d, z, ut;
    if (!Dn || !(Hn != null && Hn.open)) return;
    const f = `${!!((b = c.snapshot().albumLock) != null && b.locked)}|${((ut = (z = (d = (E = window.XtrataRadio) == null ? void 0 : E.getState) == null ? void 0 : d.call(E)) == null ? void 0 : z.nowPlaying) == null ? void 0 : ut.tokenId) ?? ""}`;
    f !== ve && (ve = f, Dn.refresh());
  }, Di = /* @__PURE__ */ new Map();
  let Mr = !1;
  const Qr = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((b) => {
      const E = b == null ? void 0 : b.nowPlaying;
      if (E && Number.isSafeInteger(Number(E.tokenId)) && Di.set(Number(E.tokenId), { title: E.title || void 0, artist: E.artist || void 0 }), Hi(), ec(jt)) {
        const d = !!(b != null && b.playing);
        wn({ kind: "now", track: E && E.tokenId != null ? String(E.tokenId) : null, playing: d, at: Date.now() }), d !== Mr && (Mr = d, de(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Qr()) {
    const f = setInterval(() => {
      Qr() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const b = f.detail;
    if (ec(jt) && wn({ kind: "listened", at: Date.now() }), b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      Be();
      const E = fe(b.song, Di.get(b.song));
      c.onListened({ song: b.song, id: b.id, title: E.title || void 0, artist: E.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const gI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", yI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, wI = () => yI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, bI = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, mI = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', pb = class {
  constructor(t) {
    l4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && CS(t), this.callback(nl(t));
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
    var r, s, i, o, a, c, u, h, l, y;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (h = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && h !== void 0 ? h : t.webUrl : (y = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && y !== void 0 ? y : this.getMobileUrl(t);
  }
  render() {
    const t = wI(), e = bI(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return It("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, It("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), It("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, It("div", { class: "flex flex-col space-y-[10px]" }, It("div", { class: "flex items-center" }, It("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), It("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, It("span", { class: "sr-only" }, "Close popup"), It("img", { src: gI }))), r ? It("p", null, "Select the wallet you want to connect to.") : It("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && It("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && It("div", { class: "mt-6" }, It("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), It("ul", { class: "space-y-3" }, this.installedProviders.map((i) => It("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, It("div", { class: "aspect-square basis-9 overflow-hidden" }, It("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), It("div", { class: "flex-1" }, It("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && It("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), It("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && It("div", { class: "mt-6" }, r ? It("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : It("div", { class: "mb-5 flex justify-between" }, It("p", { class: "text-sm font-medium" }, "Recommended wallets"), It("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, It("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, It("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), It("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), It("p", null, "What is a wallet? ", It("span", { class: "align-text-bottom text-[9px]" }, "↗")))), It("ul", { class: "space-y-3" }, n.map((i) => It("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, It("div", { class: "aspect-square basis-9 overflow-hidden" }, It("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), It("div", { class: "flex-1" }, It("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && It("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && It("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Gv(this);
  }
};
pb.style = mI;
const xI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: pb
}, Symbol.toStringTag, { value: "Module" }));
