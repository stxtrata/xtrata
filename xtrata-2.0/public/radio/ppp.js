var gb = Object.defineProperty;
var yb = (t, e, n) => e in t ? gb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var No = (t, e, n) => yb(t, typeof e != "symbol" ? e + "" : e, n);
var pn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function kp(t) {
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
      typeof pn < "u" && pn || {}, r = {
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
        var _ = {
          next: function() {
            var m = $.shift();
            return { done: m === void 0, value: m };
          }
        };
        return r.iterable && (_[Symbol.iterator] = function() {
          return _;
        }), _;
      }
      function h($) {
        this.map = {}, $ instanceof h ? $.forEach(function(_, m) {
          this.append(m, _);
        }, this) : Array.isArray($) ? $.forEach(function(_) {
          if (_.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + _.length);
          this.append(_[0], _[1]);
        }, this) : $ && Object.getOwnPropertyNames($).forEach(function(_) {
          this.append(_, $[_]);
        }, this);
      }
      h.prototype.append = function($, _) {
        $ = a($), _ = c(_);
        var m = this.map[$];
        this.map[$] = m ? m + ", " + _ : _;
      }, h.prototype.delete = function($) {
        delete this.map[a($)];
      }, h.prototype.get = function($) {
        return $ = a($), this.has($) ? this.map[$] : null;
      }, h.prototype.has = function($) {
        return this.map.hasOwnProperty(a($));
      }, h.prototype.set = function($, _) {
        this.map[a($)] = c(_);
      }, h.prototype.forEach = function($, _) {
        for (var m in this.map)
          this.map.hasOwnProperty(m) && $.call(_, this.map[m], m, this);
      }, h.prototype.keys = function() {
        var $ = [];
        return this.forEach(function(_, m) {
          $.push(m);
        }), u($);
      }, h.prototype.values = function() {
        var $ = [];
        return this.forEach(function(_) {
          $.push(_);
        }), u($);
      }, h.prototype.entries = function() {
        var $ = [];
        return this.forEach(function(_, m) {
          $.push([m, _]);
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
        return new Promise(function(_, m) {
          $.onload = function() {
            _($.result);
          }, $.onerror = function() {
            m($.error);
          };
        });
      }
      function g($) {
        var _ = new FileReader(), m = y(_);
        return _.readAsArrayBuffer($), m;
      }
      function S($) {
        var _ = new FileReader(), m = y(_), P = /charset=([A-Za-z0-9_-]+)/.exec($.type), K = P ? P[1] : "utf-8";
        return _.readAsText($, K), m;
      }
      function v($) {
        for (var _ = new Uint8Array($), m = new Array(_.length), P = 0; P < _.length; P++)
          m[P] = String.fromCharCode(_[P]);
        return m.join("");
      }
      function T($) {
        if ($.slice)
          return $.slice(0);
        var _ = new Uint8Array($.byteLength);
        return _.set(new Uint8Array($)), _.buffer;
      }
      function U() {
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
          return this.text().then(N);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var F = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function k($) {
        var _ = $.toUpperCase();
        return F.indexOf(_) > -1 ? _ : $;
      }
      function C($, _) {
        if (!(this instanceof C))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        _ = _ || {};
        var m = _.body;
        if ($ instanceof C) {
          if ($.bodyUsed)
            throw new TypeError("Already read");
          this.url = $.url, this.credentials = $.credentials, _.headers || (this.headers = new h($.headers)), this.method = $.method, this.mode = $.mode, this.signal = $.signal, !m && $._bodyInit != null && (m = $._bodyInit, $.bodyUsed = !0);
        } else
          this.url = String($);
        if (this.credentials = _.credentials || this.credentials || "same-origin", (_.headers || !this.headers) && (this.headers = new h(_.headers)), this.method = k(_.method || this.method || "GET"), this.mode = _.mode || this.mode || null, this.signal = _.signal || this.signal || function() {
          if ("AbortController" in n) {
            var B = new AbortController();
            return B.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && m)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(m), (this.method === "GET" || this.method === "HEAD") && (_.cache === "no-store" || _.cache === "no-cache")) {
          var P = /([?&])_=[^&]*/;
          if (P.test(this.url))
            this.url = this.url.replace(P, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      C.prototype.clone = function() {
        return new C(this, { body: this._bodyInit });
      };
      function N($) {
        var _ = new FormData();
        return $.trim().split("&").forEach(function(m) {
          if (m) {
            var P = m.split("="), K = P.shift().replace(/\+/g, " "), B = P.join("=").replace(/\+/g, " ");
            _.append(decodeURIComponent(K), decodeURIComponent(B));
          }
        }), _;
      }
      function Y($) {
        var _ = new h(), m = $.replace(/\r?\n[\t ]+/g, " ");
        return m.split("\r").map(function(P) {
          return P.indexOf(`
`) === 0 ? P.substr(1, P.length) : P;
        }).forEach(function(P) {
          var K = P.split(":"), B = K.shift().trim();
          if (B) {
            var st = K.join(":").trim();
            try {
              _.append(B, st);
            } catch (W) {
              console.warn("Response " + W.message);
            }
          }
        }), _;
      }
      U.call(C.prototype);
      function it($, _) {
        if (!(this instanceof it))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (_ || (_ = {}), this.type = "default", this.status = _.status === void 0 ? 200 : _.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = _.statusText === void 0 ? "" : "" + _.statusText, this.headers = new h(_.headers), this.url = _.url || "", this._initBody($);
      }
      U.call(it.prototype), it.prototype.clone = function() {
        return new it(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, it.error = function() {
        var $ = new it(null, { status: 200, statusText: "" });
        return $.ok = !1, $.status = 0, $.type = "error", $;
      };
      var q = [301, 302, 303, 307, 308];
      it.redirect = function($, _) {
        if (q.indexOf(_) === -1)
          throw new RangeError("Invalid status code");
        return new it(null, { status: _, headers: { location: $ } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(_, m) {
          this.message = _, this.name = m;
          var P = Error(_);
          this.stack = P.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function X($, _) {
        return new Promise(function(m, P) {
          var K = new C($, _);
          if (K.signal && K.signal.aborted)
            return P(new e.DOMException("Aborted", "AbortError"));
          var B = new XMLHttpRequest();
          function st() {
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
              m(new it(D, L));
            }, 0);
          }, B.onerror = function() {
            setTimeout(function() {
              P(new TypeError("Network request failed"));
            }, 0);
          }, B.ontimeout = function() {
            setTimeout(function() {
              P(new TypeError("Network request timed out"));
            }, 0);
          }, B.onabort = function() {
            setTimeout(function() {
              P(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function W(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (B.open(K.method, W(K.url), !0), K.credentials === "include" ? B.withCredentials = !0 : K.credentials === "omit" && (B.withCredentials = !1), "responseType" in B && (r.blob ? B.responseType = "blob" : r.arrayBuffer && (B.responseType = "arraybuffer")), _ && typeof _.headers == "object" && !(_.headers instanceof h || n.Headers && _.headers instanceof n.Headers)) {
            var kt = [];
            Object.getOwnPropertyNames(_.headers).forEach(function(L) {
              kt.push(a(L)), B.setRequestHeader(L, c(_.headers[L]));
            }), K.headers.forEach(function(L, D) {
              kt.indexOf(D) === -1 && B.setRequestHeader(D, L);
            });
          } else
            K.headers.forEach(function(L, D) {
              B.setRequestHeader(D, L);
            });
          K.signal && (K.signal.addEventListener("abort", st), B.onreadystatechange = function() {
            B.readyState === 4 && K.signal.removeEventListener("abort", st);
          }), B.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return X.polyfill = !0, n.fetch || (n.fetch = X, n.Headers = h, n.Request = C, n.Response = it), e.Headers = h, e.Request = C, e.Response = it, e.fetch = X, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : pn);
})();
const wb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function bb(t, e) {
  const n = {};
  return Object.assign(n, wb, e), await fetch(t, n);
}
function mb(t) {
  let e = bb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function xb(...t) {
  const { fetchLib: e, middlewares: n } = mb(t);
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
var si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(si || (si = {}));
var Fd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Fd || (Fd = {}));
const Sb = "https://api.mainnet.hiro.so", Eb = "https://api.testnet.hiro.so", Ab = "http://localhost:3999", vb = ["mainnet", "testnet", "devnet", "mocknet"];
let ao = class {
  constructor(e) {
    this.version = si.Mainnet, this.chainId = oo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === si.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? xb();
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
      return new kb();
    case "devnet":
      return new $b();
    case "mocknet":
      return new $p();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${vb.join(", ")}`);
  }
};
ao.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ao.fromName(t);
let Jl = class extends ao {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Sb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = si.Mainnet, this.chainId = oo.Mainnet;
  }
}, kb = class extends ao {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Eb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = si.Testnet, this.chainId = oo.Testnet;
  }
}, $p = class extends ao {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ab,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = si.Testnet, this.chainId = oo.Testnet;
  }
};
const $b = $p, Ip = "xtrata.wallet.bridge.v1", Ib = (t) => typeof t == "object" && t !== null && t.protocol === Ip, Lb = (t) => Ib(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Cb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class _o extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const jd = 12e4;
class Tb {
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
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Lb(e.data)) return;
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
    const s = Cb(), i = { protocol: Ip, kind: "request", id: s, method: e, params: n };
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
const Bb = ["SP", "SM"], Mb = ["ST", "SN"], Pb = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Bb.includes(n) ? "mainnet" : Mb.includes(n) ? "testnet" : null;
}, Nb = () => {
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
}, _b = () => typeof window > "u" || !window.localStorage ? Nb() : window.localStorage, ml = "xtrata.v15.1.wallet.session", Rd = "mainnet", dc = { isConnected: !1 }, Ub = (t) => t.address ? Pb(t.address) ?? t.network : t.network, Lp = (t) => !t.isConnected || !t.address ? { ...dc } : Ub(t) !== Rd ? { ...dc } : {
  isConnected: !0,
  address: t.address,
  network: Rd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Ob = (t) => {
  if (!t)
    return { ...dc };
  try {
    const e = JSON.parse(t);
    return Lp(e);
  } catch {
    return { ...dc };
  }
}, Hb = (t) => {
  const e = Lp(t);
  return JSON.stringify(e);
}, Db = (t) => {
  const e = _b();
  return {
    load: () => Ob(e.getItem(ml)),
    save: (n) => {
      e.setItem(ml, Hb(n));
    },
    clear: () => {
      e.removeItem(ml);
    }
  };
}, Fb = "https://browser.blockstack.org/auth", jb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Cp = ["store_write"], Rb = "blockstack-session", zb = {
  logLevel: "debug"
}, Si = {
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
Object.freeze(Si);
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
class Gb extends ko {
  constructor(e, n = "") {
    super({ code: Si.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class zd extends ko {
  constructor(e = "") {
    super({ code: Si.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class va extends ko {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Si.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Gd extends ko {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Si.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class tu extends ko {
  constructor(e) {
    super({ code: Si.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Tp extends ko {
  constructor(e) {
    super({ code: Si.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
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
    return eu[zb.logLevel] <= eu[e];
  }
}
function Kb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Vb() {
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
function Yb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Xb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function qb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function lf(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Xb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Ji.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = qb(s, t.toString(), n);
    throw Ji.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Ps(t, e) {
  return uf(ln(t), e);
}
function ln(t) {
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
  if (An(t, Uint8Array))
    return BigInt(`0x${wt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Wb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Vd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ua(t, e = 8) {
  return (typeof t == "bigint" ? t : ln(t)).toString(16).padStart(e * 2, "0");
}
function Gc(t) {
  return parseInt(t, 16);
}
function uf(t, e = 16) {
  const n = ua(t, e);
  return Yt(n);
}
function Zb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Qb(t, e) {
  return t & BigInt(1) << e;
}
function nu(t) {
  return Jb(BigInt(`0x${wt(t)}`), BigInt(t.byteLength * 8));
}
function Jb(t, e) {
  return Qb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const tm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function wt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += tm[n];
  return e;
}
function Yt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Wb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Ei(t) {
  return new TextEncoder().encode(t);
}
function fa(t) {
  return new TextDecoder().decode(t);
}
function em(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function nm(t) {
  return String.fromCharCode.apply(null, t);
}
function rm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Yd(t) {
  if (t.some(rm))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function kr(...t) {
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
function Ue(t) {
  return kr(...t.map((e) => typeof e == "number" ? Yd([e]) : e instanceof Array ? Yd(e) : e));
}
function An(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Bp = "https://api.mainnet.hiro.so", Mp = "https://api.testnet.hiro.so", Pp = "http://localhost:3999", sm = "https://hub.blockstack.org", im = 33, Sl = 32;
function om(t) {
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
  const e = typeof t == "string" ? Yt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function am(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function cm(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function lm(t, e) {
  return t[e];
}
function um(t, e, n = 0) {
  return t[n] = e, t;
}
function fm(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ii(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const dm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function hm(t, e) {
  const n = {};
  return Object.assign(n, dm, e), await fetch(t, n);
}
function pm(t) {
  let e = hm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function gm(...t) {
  const { fetchLib: e, middlewares: n } = pm(t);
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
class Np {
  constructor(e = Cp.slice(), n = ((a) => (a = lf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Fb) {
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
function ym(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _p(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function wm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  ru(t.outputLen), ru(t.blockLen);
}
function bm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function mm(t, e) {
  _p(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const qs = {
  number: ru,
  bool: ym,
  bytes: _p,
  hash: wm,
  exists: bm,
  output: mm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const El = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, xm = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!xm)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Sm(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function df(t) {
  if (typeof t == "string" && (t = Sm(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Up = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ai(t) {
  const e = (r) => t().update(df(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Op = class extends Up {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, qs.hash(e);
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
    return qs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    qs.exists(this), qs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Kc = (t, e, n) => new Op(t, e).update(n).digest();
Kc.create = (t, e) => new Op(t, e);
function Em(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let hf = class extends Up {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = El(this.buffer);
  }
  update(e) {
    qs.exists(this);
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
    qs.exists(this), qs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    Em(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const Am = (t, e, n) => t & e ^ ~t & n, vm = (t, e, n) => t & e ^ t & n ^ e & n, km = new Uint32Array([
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
]), es = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ns = new Uint32Array(64);
let Hp = class extends hf {
  constructor() {
    super(64, 32, 8, !1), this.A = es[0] | 0, this.B = es[1] | 0, this.C = es[2] | 0, this.D = es[3] | 0, this.E = es[4] | 0, this.F = es[5] | 0, this.G = es[6] | 0, this.H = es[7] | 0;
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
      ns[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ns[l - 15], g = ns[l - 2], S = fr(y, 7) ^ fr(y, 18) ^ y >>> 3, v = fr(g, 17) ^ fr(g, 19) ^ g >>> 10;
      ns[l] = v + ns[l - 7] + S + ns[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), g = h + y + Am(a, c, u) + km[l] + ns[l] | 0, v = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + vm(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, $m = class extends Hp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const co = Ai(() => new Hp());
Ai(() => new $m());
const Im = {}, Dp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Im
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Kt = BigInt(0), ye = BigInt(1), Is = BigInt(2), Ko = BigInt(3), Xd = BigInt(8), ie = Object.freeze({
  a: Kt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: ye,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), qd = (t, e) => (t + e / Is) / e, ka = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ie, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -ye * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = qd(i * t, e), c = qd(-r * t, e);
    let u = nt(t - a * n - c * s, e), h = nt(-a * r - c * i, e);
    const l = u > o, y = h > o;
    if (l && (u = e - u), y && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: h };
  }
}, rr = 32, oi = 32, Fp = 32, hc = rr + 1, pc = 2 * rr + 1;
function Wd(t) {
  const { a: e, b: n } = ie, r = nt(t * t), s = nt(r * t);
  return nt(s + e * t + n);
}
const $a = ie.a === Kt;
class pf extends Error {
  constructor(e) {
    super(e);
  }
}
function Zd(t) {
  if (!(t instanceof qt))
    throw new TypeError("JacobianPoint expected");
}
class qt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ut))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ut.ZERO) ? qt.ZERO : new qt(e.x, e.y, ye);
  }
  static toAffineBatch(e) {
    const n = Mm(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return qt.toAffineBatch(e).map(qt.fromAffine);
  }
  equals(e) {
    Zd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = nt(s * s), u = nt(a * a), h = nt(n * u), l = nt(i * c), y = nt(nt(r * a) * u), g = nt(nt(o * s) * c);
    return h === l && y === g;
  }
  negate() {
    return new qt(this.x, nt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = nt(e * e), i = nt(n * n), o = nt(i * i), a = e + i, c = nt(Is * (nt(a * a) - s - o)), u = nt(Ko * s), h = nt(u * u), l = nt(h - Is * c), y = nt(u * (c - l) - Xd * o), g = nt(Is * n * r);
    return new qt(l, y, g);
  }
  add(e) {
    Zd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Kt || o === Kt)
      return this;
    if (n === Kt || r === Kt)
      return e;
    const c = nt(s * s), u = nt(a * a), h = nt(n * u), l = nt(i * c), y = nt(nt(r * a) * u), g = nt(nt(o * s) * c), S = nt(l - h), v = nt(g - y);
    if (S === Kt)
      return v === Kt ? this.double() : qt.ZERO;
    const T = nt(S * S), U = nt(S * T), F = nt(h * T), k = nt(v * v - U - Is * F), C = nt(v * (F - k) - y * U), N = nt(s * a * S);
    return new qt(k, C, N);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = qt.ZERO;
    if (typeof e == "bigint" && e === Kt)
      return n;
    let r = th(e);
    if (r === ye)
      return this;
    if (!$a) {
      let l = n, y = this;
      for (; r > Kt; )
        r & ye && (l = l.add(y)), y = y.double(), r >>= ye;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ka.splitScalar(r), c = n, u = n, h = this;
    for (; i > Kt || a > Kt; )
      i & ye && (c = c.add(h)), a & ye && (u = u.add(h)), h = h.double(), i >>= ye, a >>= ye;
    return s && (c = c.negate()), o && (u = u.negate()), u = new qt(nt(u.x * ka.beta), u.y, u.z), c.add(u);
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
    !n && this.equals(qt.BASE) && (n = Ut.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && su.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = qt.normalizeZ(s), su.set(n, s)));
    let i = qt.ZERO, o = qt.BASE;
    const a = 1 + ($a ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const g = y * c;
      let S = Number(e & u);
      e >>= l, S > c && (S -= h, e += ye);
      const v = g, T = g + Math.abs(S) - 1, U = y % 2 !== 0, F = S < 0;
      S === 0 ? o = o.add(Ia(U, s[v])) : i = i.add(Ia(F, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = th(e), s, i;
    if ($a) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ka.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: y, f: g } = this.wNAF(u, n);
      h = Ia(o, h), y = Ia(c, y), y = new qt(nt(y.x * ka.beta), y.y, y.z), s = h.add(y), i = l.add(g);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return qt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(qt.ZERO);
    e == null && (e = i ? Xd : $o(s));
    const o = e, a = nt(o * o), c = nt(a * o), u = nt(n * a), h = nt(r * c), l = nt(s * o);
    if (i)
      return Ut.ZERO;
    if (l !== ye)
      throw new Error("invZ was invalid");
    return new Ut(u, h);
  }
}
qt.BASE = new qt(ie.Gx, ie.Gy, ye);
qt.ZERO = new qt(Kt, ye, Kt);
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
    return this.y % Is === Kt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _n(n ? e : e.subarray(1));
    if (!nc(r))
      throw new Error("Point is not on curve");
    const s = Wd(r);
    let i = Bm(s);
    const o = (i & ye) === ye;
    n ? o && (i = nt(-i)) : (e[0] & 1) === 1 !== o && (i = nt(-i));
    const a = new Ut(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _n(e.subarray(1, rr + 1)), r = _n(e.subarray(rr + 1, rr * 2 + 1)), s = new Ut(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = $r(e), r = n.length, s = n[0];
    if (r === rr)
      return this.fromCompressedHex(n);
    if (r === hc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === pc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${hc} compressed bytes or ${pc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ut.BASE.multiply(ai(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = zp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = gf($r(e)), { n: a } = ie, c = r === 2 || r === 3 ? s + a : s, u = $o(c, a), h = nt(-o * u, a), l = nt(i * u, a), y = r & 1 ? "03" : "02", g = Ut.fromHex(y + Cs(c)), S = Ut.BASE.multiplyAndAddUnsafe(g, h, l);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(e = !1) {
    return Ts(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Cs(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Cs(this.y)}`;
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
    if (nt(s - i) !== Kt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ut(this.x, nt(-this.y));
  }
  double() {
    return qt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return qt.fromAffine(this).add(qt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return qt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = qt.fromAffine(this), i = n === Kt || n === ye || this !== Ut.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = qt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(qt.ZERO) ? void 0 : a.toAffine();
  }
}
Ut.BASE = new Ut(ie.Gx, ie.Gy);
Ut.ZERO = new Ut(Kt, Kt);
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
function Lm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${lo(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = Jd(t.subarray(2)), { data: r, left: s } = Jd(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${lo(s)}`);
  return { r: e, s: r };
}
class Nn {
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
    return new Nn(gc(s.slice(0, 64)), gc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Lm(n ? e : Ts(e));
    return new Nn(r, s);
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
    const e = ie.n >> ye;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Nn(this.r, nt(-this.s, ie.n)) : this;
  }
  toDERRawBytes() {
    return Ts(this.toDERHex());
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
    return Ts(this.toCompactHex());
  }
  toCompactHex() {
    return Cs(this.r) + Cs(this.s);
  }
}
function ks(...t) {
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
const Cm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lo(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Cm[t[n]];
  return e;
}
const Tm = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Cs(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Kt <= t && t < Tm))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function uo(t) {
  const e = Ts(Cs(t));
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
function Ts(t) {
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
function $r(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ts(t);
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
  return n >= Kt ? n : e + n;
}
function jn(t, e) {
  const { P: n } = ie;
  let r = t;
  for (; e-- > Kt; )
    r *= r, r %= n;
  return r;
}
function Bm(t) {
  const { P: e } = ie, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = jn(u, Ko) * u % e, l = jn(h, Ko) * u % e, y = jn(l, Is) * c % e, g = jn(y, r) * y % e, S = jn(g, s) * g % e, v = jn(S, o) * S % e, T = jn(v, a) * v % e, U = jn(T, o) * S % e, F = jn(U, Ko) * u % e, k = jn(F, i) * g % e, C = jn(k, n) * c % e, N = jn(C, Is);
  if (N * N % e !== t)
    throw new Error("Cannot find square root");
  return N;
}
function $o(t, e = ie.P) {
  if (t === Kt || e <= Kt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = nt(t, e), r = e, s = Kt, i = ye;
  for (; n !== Kt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== ye)
    throw new Error("invert: does not exist");
  return nt(s, e);
}
function Mm(t, e = ie.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Kt ? i : (n[a] = i, nt(i * o, e)), ye), s = $o(r, e);
  return t.reduceRight((i, o, a) => o === Kt ? i : (n[a] = nt(i * n[a], e), nt(i * o, e)), s), n;
}
function Pm(t) {
  const e = t.length * 8 - oi * 8, n = _n(t);
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
class jp {
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
    return ks(...n);
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
    return ks(...n);
  }
}
function fo(t) {
  return Kt < t && t < ie.n;
}
function nc(t) {
  return Kt < t && t < ie.P;
}
function Rp(t, e, n, r = !0) {
  const { n: s } = ie, i = gf(t, !0);
  if (!fo(i))
    return;
  const o = $o(i, s), a = Ut.BASE.multiply(i), c = nt(a.x, s);
  if (c === Kt)
    return;
  const u = nt(o * nt(e + n * c, s), s);
  if (u === Kt)
    return;
  let h = new Nn(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & ye);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function ai(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * oi)
      throw new Error("Expected 32 bytes of private key");
    e = gc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== oi)
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
function zp(t) {
  if (t instanceof Nn)
    return t.assertValidity(), t;
  try {
    return Nn.fromDER(t);
  } catch {
    return Nn.fromCompact(t);
  }
}
function da(t, e = !1) {
  return Ut.fromPrivateKey(t).toRawBytes(e);
}
function Nm(t, e, n, r = !1) {
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
  return r.assertValidity(), r.multiply(ai(t)).toRawBytes(n);
}
function Gp(t) {
  const e = t.length > rr ? t.slice(0, rr) : t;
  return _n(e);
}
function _m(t) {
  const e = Gp(t), n = nt(e, ie.n);
  return Kp(n < Kt ? e : n);
}
function Kp(t) {
  return uo(t);
}
function Vp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = $r(t), s = ai(e), i = [Kp(s), _m(r)];
  if (n != null) {
    n === !0 && (n = Ce.randomBytes(rr));
    const c = $r(n);
    if (c.length !== rr)
      throw new Error(`sign: Expected ${rr} bytes of extra data`);
    i.push(c);
  }
  const o = ks(...i), a = Gp(r);
  return { seed: o, m: a, d: s };
}
function Yp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Um(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Vp(t, e, n.extraEntropy), o = new jp(Fp, oi);
  await o.reseed(r);
  let a;
  for (; !(a = Rp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Yp(a, n);
}
function Vc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Vp(t, e, n.extraEntropy), o = new jp(Fp, oi);
  o.reseedSync(r);
  let a;
  for (; !(a = Rp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Yp(a, n);
}
const Om = { strict: !0 };
function Hm(t, e, n, r = Om) {
  let s;
  try {
    s = zp(t), e = $r(e);
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
    const n = $r(e);
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
    return Cs(this.r) + Cs(this.s);
  }
  toRawBytes() {
    return Ts(this.toHex());
  }
}
function Dm(t) {
  return Ut.fromPrivateKey(t).toRawX();
}
class Xp {
  constructor(e, n, r = Ce.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = $r(e);
    const { x: s, scalar: i } = this.getScalar(ai(n));
    if (this.px = s, this.d = i, this.rand = $r(r), this.rand.length !== 32)
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
    if (n === Kt)
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
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHash, o = this.initNonce(n, await i(vs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(vs.nonce, o, r, e)), h = yc(await i(vs.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await Zp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHashSync, o = this.initNonce(n, i(vs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(vs.nonce, o, r, e)), h = yc(i(vs.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return Qp(l, e, r) || this.error(), l;
  }
}
async function Fm(t, e, n) {
  return new Xp(t, e, n).calc();
}
function jm(t, e, n) {
  return new Xp(t, e, n).calcSync();
}
function qp(t, e, n) {
  const r = t instanceof ho, s = r ? t : ho.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: $r(e),
    P: yf(n)
  };
}
function Wp(t, e, n, r) {
  const s = Ut.BASE.multiplyAndAddUnsafe(e, ai(n), nt(-r, ie.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Zp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = qp(t, e, n), a = yc(await Ce.taggedHash(vs.challenge, uo(r), o.toRawX(), i));
    return Wp(r, o, s, a);
  } catch {
    return !1;
  }
}
function Qp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = qp(t, e, n), a = yc(Ce.taggedHashSync(vs.challenge, uo(r), o.toRawX(), i));
    return Wp(r, o, s, a);
  } catch (r) {
    if (r instanceof pf)
      throw r;
    return !1;
  }
}
const Rm = {
  Signature: ho,
  getPublicKey: Dm,
  sign: Fm,
  verify: Zp,
  signSync: jm,
  verifySync: Qp
};
Ut.BASE._setWindowSize(8);
const Cn = {
  node: Dp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, vs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, La = {}, Ce = {
  bytesToHex: lo,
  hexToBytes: Ts,
  concatBytes: ks,
  mod: nt,
  invert: $o,
  isValidPrivateKey(t) {
    try {
      return ai(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: uo,
  _normalizePrivateKey: ai,
  hashToPrivateKey: (t) => {
    t = $r(t);
    const e = oi + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = nt(_n(t), ie.n - ye) + ye;
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
  randomPrivateKey: () => Ce.hashToPrivateKey(Ce.randomBytes(oi + 8)),
  precompute(t = 8, e = Ut.BASE) {
    const n = e === Ut.BASE ? e : new Ut(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ko), n;
  },
  sha256: async (...t) => {
    if (Cn.web) {
      const e = await Cn.web.subtle.digest("SHA-256", ks(...t));
      return new Uint8Array(e);
    } else if (Cn.node) {
      const { createHash: e } = Cn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Cn.web) {
      const n = await Cn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = ks(...e), s = await Cn.web.subtle.sign("HMAC", n, r);
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
      n = ks(r, r), La[t] = n;
    }
    return Ce.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof so != "function")
      throw new pf("sha256Sync is undefined, you need to set it");
    let n = La[t];
    if (n === void 0) {
      const r = so(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = ks(r, r), La[t] = n;
    }
    return so(n, ...e);
  },
  _JacobianPoint: qt
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
const zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ie,
  Point: Ut,
  Signature: Nn,
  getPublicKey: da,
  getSharedSecret: wf,
  recoverPublicKey: Nm,
  schnorr: Rm,
  sign: Um,
  signSync: Vc,
  utils: Ce,
  verify: Hm
}, Symbol.toStringTag, { value: "Module" }));
var ha = {};
ha.byteLength = Xm;
var Gm = ha.toByteArray = Wm, Km = ha.fromByteArray = Jm, br = [], Gn = [], Vm = typeof Uint8Array < "u" ? Uint8Array : Array, Al = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var Vi = 0, Ym = Al.length; Vi < Ym; ++Vi)
  br[Vi] = Al[Vi], Gn[Al.charCodeAt(Vi)] = Vi;
Gn[45] = 62;
Gn[95] = 63;
function Jp(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Xm(t) {
  var e = Jp(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function qm(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Wm(t) {
  var e, n = Jp(t), r = n[0], s = n[1], i = new Vm(qm(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Gn[t.charCodeAt(c)] << 18 | Gn[t.charCodeAt(c + 1)] << 12 | Gn[t.charCodeAt(c + 2)] << 6 | Gn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Gn[t.charCodeAt(c)] << 2 | Gn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Gn[t.charCodeAt(c)] << 10 | Gn[t.charCodeAt(c + 1)] << 4 | Gn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Zm(t) {
  return br[t >> 18 & 63] + br[t >> 12 & 63] + br[t >> 6 & 63] + br[t & 63];
}
function Qm(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Zm(r));
  return s.join("");
}
function Jm(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(Qm(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    br[e >> 2] + br[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    br[e >> 10] + br[e >> 4 & 63] + br[e << 2 & 63] + "="
  )), s.join("");
}
function t1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const e1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function n1() {
  if (t1())
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
    throw new Error(e1);
  }
}
class r1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(kr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(kr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class s1 {
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
async function tg() {
  const t = await n1();
  return t.name === "subtleCrypto" ? new s1(t.lib) : new r1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function i1(t) {
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
    for (var S = 0, v = 0, T = 0, U = g.length; T !== U && g[T] === 0; )
      T++, S++;
    for (var F = (U - T) * u + 1 >>> 0, k = new Uint8Array(F); T !== U; ) {
      for (var C = g[T], N = 0, Y = F - 1; (C !== 0 || N < v) && Y !== -1; Y--, N++)
        C += 256 * k[Y] >>> 0, k[Y] = C % o >>> 0, C = C / o >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      v = N, T++;
    }
    for (var it = F - v; it !== F && k[it] === 0; )
      it++;
    for (var q = a.repeat(S); it < F; ++it)
      q += t.charAt(k[it]);
    return q;
  }
  function l(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var S = 0, v = 0, T = 0; g[S] === a; )
      v++, S++;
    for (var U = (g.length - S) * c + 1 >>> 0, F = new Uint8Array(U); g[S]; ) {
      var k = g.charCodeAt(S);
      if (k > 255)
        return;
      var C = e[k];
      if (C === 255)
        return;
      for (var N = 0, Y = U - 1; (C !== 0 || N < T) && Y !== -1; Y--, N++)
        C += o * F[Y] >>> 0, F[Y] = C % 256 >>> 0, C = C / 256 >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      T = N, S++;
    }
    for (var it = U - T; it !== U && F[it] === 0; )
      it++;
    for (var q = new Uint8Array(v + (U - it)), X = v; it !== U; )
      q[X++] = F[it++];
    return q;
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
var eg = i1;
const o1 = eg, a1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var c1 = o1(a1);
const l1 = /* @__PURE__ */ kp(c1), u1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ng = Uint8Array.from({ length: 16 }, (t, e) => e), f1 = ng.map((t) => (9 * t + 5) % 16);
let bf = [ng], mf = [f1];
for (let t = 0; t < 4; t++)
  for (let e of [bf, mf])
    e.push(e[t].map((n) => u1[n]));
const rg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), d1 = bf.map((t, e) => t.map((n) => rg[e][n])), h1 = mf.map((t, e) => t.map((n) => rg[e][n])), p1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), g1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ca = (t, e) => t << e | t >>> 32 - e;
function nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ta = new Uint32Array(16);
let y1 = class extends hf {
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
      const S = 4 - g, v = p1[g], T = g1[g], U = bf[g], F = mf[g], k = d1[g], C = h1[g];
      for (let N = 0; N < 16; N++) {
        const Y = Ca(r + nh(g, i, a, u) + Ta[U[N]] + v, k[N]) + l | 0;
        r = l, l = u, u = Ca(a, 10) | 0, a = i, i = Y;
      }
      for (let N = 0; N < 16; N++) {
        const Y = Ca(s + nh(S, o, c, h) + Ta[F[N]] + T, C[N]) + y | 0;
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
const w1 = Ai(() => new y1());
function b1(t) {
  return w1(t);
}
const Ba = BigInt(2 ** 32 - 1), iu = BigInt(32);
function sg(t, e = !1) {
  return e ? { h: Number(t & Ba), l: Number(t >> iu & Ba) } : { h: Number(t >> iu & Ba) | 0, l: Number(t & Ba) | 0 };
}
function m1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = sg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const x1 = (t, e) => BigInt(t >>> 0) << iu | BigInt(e >>> 0), S1 = (t, e, n) => t >>> n, E1 = (t, e, n) => t << 32 - n | e >>> n, A1 = (t, e, n) => t >>> n | e << 32 - n, v1 = (t, e, n) => t << 32 - n | e >>> n, k1 = (t, e, n) => t << 64 - n | e >>> n - 32, $1 = (t, e, n) => t >>> n - 32 | e << 64 - n, I1 = (t, e) => e, L1 = (t, e) => t, C1 = (t, e, n) => t << n | e >>> 32 - n, T1 = (t, e, n) => e << n | t >>> 32 - n, B1 = (t, e, n) => e << n - 32 | t >>> 64 - n, M1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function P1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const N1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), _1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, U1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), O1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, H1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), D1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: sg,
  split: m1,
  toBig: x1,
  shrSH: S1,
  shrSL: E1,
  rotrSH: A1,
  rotrSL: v1,
  rotrBH: k1,
  rotrBL: $1,
  rotr32H: I1,
  rotr32L: L1,
  rotlSH: C1,
  rotlSL: T1,
  rotlBH: B1,
  rotlBL: M1,
  add: P1,
  add3L: N1,
  add3H: _1,
  add4L: U1,
  add4H: O1,
  add5H: D1,
  add5L: H1
}, [F1, j1] = Ct.split([
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
].map((t) => BigInt(t))), rs = new Uint32Array(80), ss = new Uint32Array(80);
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
      rs[k] = e.getUint32(n), ss[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = rs[k - 15] | 0, N = ss[k - 15] | 0, Y = Ct.rotrSH(C, N, 1) ^ Ct.rotrSH(C, N, 8) ^ Ct.shrSH(C, N, 7), it = Ct.rotrSL(C, N, 1) ^ Ct.rotrSL(C, N, 8) ^ Ct.shrSL(C, N, 7), q = rs[k - 2] | 0, X = ss[k - 2] | 0, $ = Ct.rotrSH(q, X, 19) ^ Ct.rotrBH(q, X, 61) ^ Ct.shrSH(q, X, 6), _ = Ct.rotrSL(q, X, 19) ^ Ct.rotrBL(q, X, 61) ^ Ct.shrSL(q, X, 6), m = Ct.add4L(it, _, ss[k - 7], ss[k - 16]), P = Ct.add4H(m, Y, $, rs[k - 7], rs[k - 16]);
      rs[k] = P | 0, ss[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Ct.rotrSH(l, y, 14) ^ Ct.rotrSH(l, y, 18) ^ Ct.rotrBH(l, y, 41), N = Ct.rotrSL(l, y, 14) ^ Ct.rotrSL(l, y, 18) ^ Ct.rotrBL(l, y, 41), Y = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Ct.add5L(F, N, it, j1[k], ss[k]), X = Ct.add5H(q, U, C, Y, F1[k], rs[k]), $ = q | 0, _ = Ct.rotrSH(r, s, 28) ^ Ct.rotrBH(r, s, 34) ^ Ct.rotrBH(r, s, 39), m = Ct.rotrSL(r, s, 28) ^ Ct.rotrBL(r, s, 34) ^ Ct.rotrBL(r, s, 39), P = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Ct.add(u | 0, h | 0, X | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Ct.add3L($, m, K);
      r = Ct.add3H(B, X, _, P), s = B | 0;
    }
    ({ h: r, l: s } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Ct.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Ct.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Ct.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    rs.fill(0), ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, R1 = class extends Yc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, z1 = class extends Yc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, G1 = class extends Yc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const K1 = Ai(() => new Yc());
Ai(() => new R1());
Ai(() => new z1());
Ai(() => new G1());
function ig(t) {
  return co(t);
}
function V1(t) {
  return K1(t);
}
const Y1 = 0;
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(co, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function X1() {
  return wt(Ce.randomPrivateKey());
}
function q1(t) {
  const e = co(co(t));
  return l1.encode(kr(t, e).slice(0, t.length + 4));
}
function W1(t, e) {
  return q1(kr(new Uint8Array([t]), e.slice(0, 20)));
}
function og(t, e = Y1) {
  const n = typeof t == "string" ? Yt(t) : t, r = b1(ig(n));
  return W1(e, r);
}
function ag(t) {
  const e = ff(t);
  return wt(da(e.slice(0, 32), !0));
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(co, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var wc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(wc || (wc = {}));
async function Z1(t, e, n) {
  return await (await tg()).encrypt("aes-256-cbc", e, t, n);
}
async function Q1(t, e, n) {
  return await (await tg()).decrypt("aes-256-cbc", e, t, n);
}
function cg(t, e) {
  return Kc(co, t, e);
}
function J1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function lg(t) {
  const e = V1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function t2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function e2(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !t2(t))
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
async function n2(t, e, n, r) {
  const s = e2(t);
  if (!s.result)
    throw s;
  const i = Ce.randomPrivateKey(), o = da(i, !0);
  let a = wf(i, t, !0);
  a = a.slice(1);
  const c = lg(a), u = Ce.randomBytes(16), h = await Z1(u, c.encryptionKey, e), l = kr(u, o, h), y = cg(c.hmacKey, l);
  let g;
  if (!r || r === "hex")
    g = wt(h);
  else if (r === "base64")
    g = Km(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const S = {
    iv: wt(u),
    ephemeralPK: wt(o),
    cipherText: g,
    mac: wt(y),
    wasString: n
  };
  return r && r !== "hex" && (S.cipherTextEncoding = r), S;
}
async function ug(t, e) {
  if (!e.ephemeralPK)
    throw new Gd("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = wf(t, n, !0);
  r = r.slice(1);
  const s = lg(r), i = Yt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Yt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Gm(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = kr(i, Yt(n), o), c = cg(s.hmacKey, a), u = Yt(e.mac);
  if (!J1(u, c))
    throw new Gd("Decryption failed: failure in MAC check");
  const h = await Q1(i, s.encryptionKey, o);
  return e.wasString ? fa(h) : h;
}
function r2(t, e) {
  const n = typeof e == "string" ? Ei(e) : e, r = ag(t), s = ig(n), i = Vc(s, t);
  return {
    signature: wt(i),
    publicKey: r
  };
}
async function s2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = ag(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Ei(t) : t, o = await n2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = r2(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function i2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return ug(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var en = {}, po = {}, dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.decode = dn.encode = dn.unescape = dn.escape = dn.pad = void 0;
const fg = ha;
function xf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
dn.pad = xf;
function dg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
dn.escape = dg;
function hg(t) {
  return xf(t).replace(/-/g, "+").replace(/_/g, "/");
}
dn.unescape = hg;
function o2(t) {
  return dg((0, fg.fromByteArray)(new TextEncoder().encode(t)));
}
dn.encode = o2;
function a2(t) {
  return new TextDecoder().decode((0, fg.toByteArray)(xf(hg(t))));
}
dn.decode = a2;
var Xc = {}, qc = {}, pg = {}, gg = {}, Wc = {};
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.crypto = void 0;
Wc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = y, t.rotl = g, t.byteSwap = S, t.byteSwap32 = v, t.bytesToHex = F, t.hexToBytes = N, t.asyncLoop = it, t.utf8ToBytes = q, t.bytesToUtf8 = X, t.toBytes = $, t.kdfInputToBytes = _, t.concatBytes = m, t.checkOpts = P, t.createHasher = B, t.createOptHasher = st, t.createXOFer = W, t.randomBytes = kt;
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
    const lt = D.outputLen;
    if (L.length < lt)
      throw new Error("digestInto() expects output buffer of length at least " + lt);
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
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (L, D) => D.toString(16).padStart(2, "0"));
  function F(L) {
    if (s(L), T)
      return L.toHex();
    let D = "";
    for (let lt = 0; lt < L.length; lt++)
      D += U[L[lt]];
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
  function N(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (T)
      return Uint8Array.fromHex(L);
    const D = L.length, lt = D / 2;
    if (D % 2)
      throw new Error("hex string expected, got unpadded hex of length " + D);
    const ot = new Uint8Array(lt);
    for (let ut = 0, Nt = 0; ut < lt; ut++, Nt += 2) {
      const te = C(L.charCodeAt(Nt)), $t = C(L.charCodeAt(Nt + 1));
      if (te === void 0 || $t === void 0) {
        const Vt = L[Nt] + L[Nt + 1];
        throw new Error('hex string expected, got non-hex character "' + Vt + '" at index ' + Nt);
      }
      ot[ut] = te * 16 + $t;
    }
    return ot;
  }
  const Y = async () => {
  };
  t.nextTick = Y;
  async function it(L, D, lt) {
    let ot = Date.now();
    for (let ut = 0; ut < L; ut++) {
      lt(ut);
      const Nt = Date.now() - ot;
      Nt >= 0 && Nt < D || (await (0, t.nextTick)(), ot += Nt);
    }
  }
  function q(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function X(L) {
    return new TextDecoder().decode(L);
  }
  function $(L) {
    return typeof L == "string" && (L = q(L)), s(L), L;
  }
  function _(L) {
    return typeof L == "string" && (L = q(L)), s(L), L;
  }
  function m(...L) {
    let D = 0;
    for (let ot = 0; ot < L.length; ot++) {
      const ut = L[ot];
      s(ut), D += ut.length;
    }
    const lt = new Uint8Array(D);
    for (let ot = 0, ut = 0; ot < L.length; ot++) {
      const Nt = L[ot];
      lt.set(Nt, ut), ut += Nt.length;
    }
    return lt;
  }
  function P(L, D) {
    if (D !== void 0 && {}.toString.call(D) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, D);
  }
  class K {
  }
  t.Hash = K;
  function B(L) {
    const D = (ot) => L().update($(ot)).digest(), lt = L();
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = () => L(), D;
  }
  function st(L) {
    const D = (ot, ut) => L(ut).update($(ot)).digest(), lt = L({});
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = (ot) => L(ot), D;
  }
  function W(L) {
    const D = (ot, ut) => L(ut).update($(ot)).digest(), lt = L({});
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = (ot) => L(ot), D;
  }
  t.wrapConstructor = B, t.wrapConstructorWithOpts = st, t.wrapXOFConstructorWithOpts = W;
  function kt(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(gg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = gg;
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
})(pg);
const Yi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function yg(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function ou(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function vi(t, ...e) {
  if (!yg(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function c2(t) {
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
function wg(t, e) {
  vi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function l2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function u2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function bc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Zn(t, e) {
  return t << 32 - e | t >>> e;
}
function f2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Sf = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Ef(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const bg = Sf ? (t) => t : (t) => Ef(t), d2 = bg;
function mg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Ef(t[e]);
  return t;
}
const h2 = Sf ? (t) => t : mg, xg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", p2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Sg(t) {
  if (vi(t), xg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += p2[t[n]];
  return e;
}
const Nr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function rh(t) {
  if (t >= Nr._0 && t <= Nr._9)
    return t - Nr._0;
  if (t >= Nr.A && t <= Nr.F)
    return t - (Nr.A - 10);
  if (t >= Nr.a && t <= Nr.f)
    return t - (Nr.a - 10);
}
function g2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (xg)
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
const Eg = async () => {
};
async function y2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Eg(), r += i);
  }
}
function Af(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function w2(t) {
  return new TextDecoder().decode(t);
}
function pa(t) {
  return typeof t == "string" && (t = Af(t)), vi(t), t;
}
function b2(t) {
  return typeof t == "string" && (t = Af(t)), vi(t), t;
}
function m2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    vi(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function x2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Ag = class {
};
function Zc(t) {
  const e = (r) => t().update(pa(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function vg(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function kg(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const S2 = Zc, E2 = vg, A2 = kg;
function v2(t = 32) {
  if (Yi && typeof Yi.getRandomValues == "function")
    return Yi.getRandomValues(new Uint8Array(t));
  if (Yi && typeof Yi.randomBytes == "function")
    return Uint8Array.from(Yi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const k2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Ag,
  abytes: vi,
  aexists: au,
  ahash: c2,
  anumber: ou,
  aoutput: wg,
  asyncLoop: y2,
  byteSwap: Ef,
  byteSwap32: mg,
  byteSwapIfBE: d2,
  bytesToHex: Sg,
  bytesToUtf8: w2,
  checkOpts: x2,
  clean: bc,
  concatBytes: m2,
  createHasher: Zc,
  createOptHasher: vg,
  createView: rc,
  createXOFer: kg,
  hexToBytes: g2,
  isBytes: yg,
  isLE: Sf,
  kdfInputToBytes: b2,
  nextTick: Eg,
  randomBytes: v2,
  rotl: f2,
  rotr: Zn,
  swap32IfBE: h2,
  swap8IfBE: bg,
  toBytes: pa,
  u32: u2,
  u8: l2,
  utf8ToBytes: Af,
  wrapConstructor: S2,
  wrapConstructorWithOpts: E2,
  wrapXOFConstructorWithOpts: A2
}, Symbol.toStringTag, { value: "Module" }));
function $2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function I2(t, e, n) {
  return t & e ^ ~t & n;
}
function L2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class C2 extends Ag {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rc(this.buffer);
  }
  update(e) {
    au(this), e = pa(e), vi(e);
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
    au(this), wg(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, bc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    $2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const is = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), os = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), T2 = /* @__PURE__ */ Uint32Array.from([
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
]), as = /* @__PURE__ */ new Uint32Array(64);
let vf = class extends C2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = is[0] | 0, this.B = is[1] | 0, this.C = is[2] | 0, this.D = is[3] | 0, this.E = is[4] | 0, this.F = is[5] | 0, this.G = is[6] | 0, this.H = is[7] | 0;
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
      const y = as[l - 15], g = as[l - 2], S = Zn(y, 7) ^ Zn(y, 18) ^ y >>> 3, v = Zn(g, 17) ^ Zn(g, 19) ^ g >>> 10;
      as[l] = v + as[l - 7] + S + as[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = Zn(a, 6) ^ Zn(a, 11) ^ Zn(a, 25), g = h + y + I2(a, c, u) + T2[l] + as[l] | 0, v = (Zn(r, 2) ^ Zn(r, 13) ^ Zn(r, 22)) + L2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    bc(as);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bc(this.buffer);
  }
}, $g = class extends vf {
  constructor() {
    super(28), this.A = os[0] | 0, this.B = os[1] | 0, this.C = os[2] | 0, this.D = os[3] | 0, this.E = os[4] | 0, this.F = os[5] | 0, this.G = os[6] | 0, this.H = os[7] | 0;
  }
};
const B2 = /* @__PURE__ */ Zc(() => new vf()), M2 = /* @__PURE__ */ Zc(() => new $g()), P2 = vf, Ig = B2, N2 = $g, _2 = M2, U2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: N2,
  SHA256: P2,
  sha224: _2,
  sha256: Ig
}, Symbol.toStringTag, { value: "Module" })), Qc = /* @__PURE__ */ zc(U2), O2 = /* @__PURE__ */ zc(zm);
var go = {};
Object.defineProperty(go, "__esModule", { value: !0 });
go.joseToDer = go.derToJose = void 0;
const Lg = ha, Cg = dn;
function vl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const H2 = {
  ES256: vl(256),
  ES384: vl(384),
  ES512: vl(521)
};
function Tg(t) {
  const e = H2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const mc = 128, Bg = 0, D2 = 32, F2 = 16, j2 = 2, Mg = F2 | D2 | Bg << 6, xc = j2 | Bg << 6;
function Pg(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Lg.toByteArray)((0, Cg.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function R2(t, e) {
  const n = Pg(t), r = Tg(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Mg)
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
  return S.set(n.subarray(l + Math.max(-g, 0), l + h), o), (0, Cg.escape)((0, Lg.fromByteArray)(S));
}
go.derToJose = R2;
function sh(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= mc && --r, r;
}
function z2(t, e) {
  t = Pg(t);
  const n = Tg(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = sh(t, 0, n), i = sh(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < mc, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Mg, u ? h[l++] = c : (h[l++] = mc | 1, h[l++] = c & 255), h[l++] = xc, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = xc, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
go.joseToDer = z2;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.InvalidTokenError = Vr.MissingParametersError = void 0;
class G2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Vr.MissingParametersError = G2;
class K2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Vr.InvalidTokenError = K2;
const ga = /* @__PURE__ */ zc(k2);
Object.defineProperty(qc, "__esModule", { value: !0 });
qc.SECP256K1Client = void 0;
const V2 = pg, Y2 = Qc, sc = O2, ih = go, oh = Vr, ah = ga;
sc.utils.hmacSha256Sync = (t, ...e) => {
  const n = V2.hmac.create(Y2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Ng {
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
qc.SECP256K1Client = Ng;
Ng.algorithmName = "ES256K";
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
var ci = {};
const X2 = /* @__PURE__ */ zc(Dp);
var q2 = pn && pn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.hashSha256Async = ci.hashSha256 = void 0;
const W2 = Qc;
function _g(t) {
  return (0, W2.sha256)(t);
}
ci.hashSha256 = _g;
function Z2(t) {
  return q2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = X2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(_g(t));
    }
  });
}
ci.hashSha256Async = Z2;
var Q2 = pn && pn.__awaiter || function(t, e, n, r) {
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
const cu = dn, ch = Xc, J2 = Vr, lh = ci;
function lu(t, e) {
  const n = [], r = cu.encode(JSON.stringify(e));
  n.push(r);
  const s = cu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function tx(t) {
  return lu(t, { typ: "JWT", alg: "none" }) + ".";
}
po.createUnsecuredToken = tx;
class ex {
  constructor(e, n) {
    if (!(e && n))
      throw new J2.MissingParametersError("a signing algorithm and private key are required");
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
    return Q2(this, void 0, void 0, function* () {
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
po.TokenSigner = ex;
var Jc = {};
Object.defineProperty(Jc, "__esModule", { value: !0 });
Jc.TokenVerifier = void 0;
const nx = dn, uh = Xc, rx = Vr, Ma = ci;
class sx {
  constructor(e, n) {
    if (!(e && n))
      throw new rx.MissingParametersError("a signing algorithm and public key are required");
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
    const r = [e.header.join("."), nx.encode(e.payload)].join(".");
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
Jc.TokenVerifier = sx;
var tl = {};
Object.defineProperty(tl, "__esModule", { value: !0 });
tl.decodeToken = void 0;
const Pa = dn;
function ix(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(Pa.decode(e[0])), r = JSON.parse(Pa.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = Pa.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(Pa.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
tl.decodeToken = ix;
(function(t) {
  var e = pn && pn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = pn && pn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(po, t), n(Jc, t), n(tl, t), n(Vr, t), n(Xc, t);
})(en);
function ox(t) {
  return `did:btc-addr:${t}`;
}
function ax(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new zd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new zd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Ug(t) {
  if (t)
    return ax(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const cx = "1.4.0";
function lx() {
  return X1();
}
function ux(t, e, n, r = Cp.slice(), s, i = Kb().getTime(), o = {}) {
  const a = (g) => {
    const S = lf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Yb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: cx,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = en.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = og(u);
  return c.iss = ox(h), new en.TokenSigner("ES256k", t).sign(c);
}
async function fh(t, e) {
  const n = fa(Yt(e)), r = JSON.parse(n), s = await ug(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function fx(t) {
  const e = en.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new en.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function dx(t) {
  const e = en.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Ug(e.iss);
  if (n.length === 1) {
    if (og(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function hx(t) {
  const e = en.decodeToken(t).payload;
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
function px(t) {
  const e = en.decodeToken(t).payload;
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
function gx(t) {
  const e = [
    px(t),
    hx(t),
    fx(t),
    dx(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const dh = "1.0.0";
class Bs {
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
    return new Bs(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Og {
  constructor(e) {
    if (e) {
      const n = new Bs(e);
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
class hh extends Og {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Bs({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Tp("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Bs({})), !0;
  }
}
class ph extends Og {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Rb, !localStorage.getItem(this.key)) {
      const r = new Bs({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Tp("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Bs.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Bs({})), !0;
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
var Sr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Sr || (Sr = {}));
jr.Mainnet;
const Hg = {
  chainId: Jo.Mainnet,
  transactionVersion: jr.Mainnet,
  peerNetworkId: Sc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Sr.MainnetSingleSig,
    multiSig: Sr.MainnetMultiSig
  },
  client: { baseUrl: Bp }
}, uu = {
  chainId: Jo.Testnet,
  transactionVersion: jr.Testnet,
  peerNetworkId: Sc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Sr.TestnetSingleSig,
    multiSig: Sr.TestnetMultiSig
  },
  client: { baseUrl: Mp }
}, ic = {
  ...uu,
  addressVersion: { ...uu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Pp }
}, yx = {
  ...ic,
  addressVersion: { ...ic.addressVersion },
  client: { ...ic.client }
};
function wx(t) {
  switch (t) {
    case "mainnet":
      return Hg;
    case "testnet":
      return uu;
    case "devnet":
      return ic;
    case "mocknet":
      return yx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Dg(t) {
  return typeof t == "string" ? wx(t) : t;
}
var gh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(yh || (yh = {}));
var Qn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Qn || (Qn = {}));
const kl = ["onChainOnly", "offChainOnly", "any"];
kl[0] + "", Qn.OnChainOnly, kl[1] + "", Qn.OffChainOnly, kl[2] + "", Qn.Any, Qn.OnChainOnly + "", Qn.OnChainOnly, Qn.OffChainOnly + "", Qn.OffChainOnly, Qn.Any + "", Qn.Any;
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
function bx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Fg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fu(t.outputLen), fu(t.blockLen);
}
function xx(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sx(t, e) {
  Fg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ws = {
  number: fu,
  bool: bx,
  bytes: Fg,
  hash: mx,
  exists: xx,
  output: Sx
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const $l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, Ex = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Ex)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ax(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function kf(t) {
  if (typeof t == "string" && (t = Ax(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let jg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function ki(t) {
  const e = (r) => t().update(kf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Rg = class extends jg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ws.hash(e);
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
const zg = (t, e, n) => new Rg(t, e).update(n).digest();
zg.create = (t, e) => new Rg(t, e);
function vx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let $f = class extends jg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = $l(this.buffer);
  }
  update(e) {
    Ws.exists(this);
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
    Ws.exists(this), Ws.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    vx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const kx = (t, e, n) => t & e ^ ~t & n, $x = (t, e, n) => t & e ^ t & n ^ e & n, Ix = new Uint32Array([
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
let Gg = class extends $f {
  constructor() {
    super(64, 32, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
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
      ls[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ls[l - 15], g = ls[l - 2], S = dr(y, 7) ^ dr(y, 18) ^ y >>> 3, v = dr(g, 17) ^ dr(g, 19) ^ g >>> 10;
      ls[l] = v + ls[l - 7] + S + ls[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), g = h + y + kx(a, c, u) + Ix[l] + ls[l] | 0, v = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + $x(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ls.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lx = class extends Gg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Kg = ki(() => new Gg());
ki(() => new Lx());
var $i = {}, If = {};
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
        const T = 1 + u, U = v % (1 << T) << 5 - T, F = t.c32[S + U];
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
      const U = (t.c32.indexOf(o[v]) << y) + l, F = n[U % 16];
      if (y += 1, l = U >> 4, l > 1 << y)
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
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.c32checkDecode = li.c32checkEncode = void 0;
const Ch = Qc, Th = ga, Yo = If;
function Vg(t) {
  const e = (0, Ch.sha256)((0, Ch.sha256)((0, Th.hexToBytes)(t)));
  return (0, Th.bytesToHex)(e.slice(0, 4));
}
function Cx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Vg(`${n}${e}`), s = (0, Yo.c32encode)(`${e}${r}`);
  return `${Yo.c32[t]}${s}`;
}
li.c32checkEncode = Cx;
function Tx(t) {
  t = (0, Yo.c32normalize)(t);
  const e = (0, Yo.c32decode)(t.slice(1)), n = t[0], r = Yo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Vg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
li.c32checkDecode = Tx;
var Yg = {}, yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
yo.decode = yo.encode = void 0;
const Ec = Qc, Bh = ga, Xg = eg, qg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Bx(t, e = "00") {
  const n = typeof t == "string" ? (0, Bh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Bh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...r, ...n])));
  return Xg(qg).encode([...r, ...n, ...s.slice(0, 4)]);
}
yo.encode = Bx;
function Mx(t) {
  const e = Xg(qg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
yo.decode = Mx;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = li, n = yo, r = ga;
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
})(Yg);
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
  const n = li;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Yg;
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
})($i);
function Px(t, e) {
  switch (e = Dg(e ?? Hg), t) {
    case Dr.P2PKH:
      switch (e.transactionVersion) {
        case jr.Mainnet:
          return Sr.MainnetSingleSig;
        case jr.Testnet:
          return Sr.TestnetSingleSig;
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
          return Sr.MainnetMultiSig;
        case jr.Testnet:
          return Sr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Nx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Wg = Uint8Array.from({ length: 16 }, (t, e) => e), _x = Wg.map((t) => (9 * t + 5) % 16);
let Lf = [Wg], Cf = [_x];
for (let t = 0; t < 4; t++)
  for (let e of [Lf, Cf])
    e.push(e[t].map((n) => Nx[n]));
const Zg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Ux = Lf.map((t, e) => t.map((n) => Zg[e][n])), Ox = Cf.map((t, e) => t.map((n) => Zg[e][n])), Hx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Dx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Na = (t, e) => t << e | t >>> 32 - e;
function Mh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _a = new Uint32Array(16);
let Fx = class extends $f {
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
      const S = 4 - g, v = Hx[g], T = Dx[g], U = Lf[g], F = Cf[g], k = Ux[g], C = Ox[g];
      for (let N = 0; N < 16; N++) {
        const Y = Na(r + Mh(g, i, a, u) + _a[U[N]] + v, k[N]) + l | 0;
        r = l, l = u, u = Na(a, 10) | 0, a = i, i = Y;
      }
      for (let N = 0; N < 16; N++) {
        const Y = Na(s + Mh(S, o, c, h) + _a[F[N]] + T, C[N]) + y | 0;
        s = y, y = h, h = Na(c, 10) | 0, c = o, o = Y;
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
const jx = ki(() => new Fx()), Ua = BigInt(2 ** 32 - 1), du = BigInt(32);
function Qg(t, e = !1) {
  return e ? { h: Number(t & Ua), l: Number(t >> du & Ua) } : { h: Number(t >> du & Ua) | 0, l: Number(t & Ua) | 0 };
}
function Rx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Qg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const zx = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), Gx = (t, e, n) => t >>> n, Kx = (t, e, n) => t << 32 - n | e >>> n, Vx = (t, e, n) => t >>> n | e << 32 - n, Yx = (t, e, n) => t << 32 - n | e >>> n, Xx = (t, e, n) => t << 64 - n | e >>> n - 32, qx = (t, e, n) => t >>> n - 32 | e << 64 - n, Wx = (t, e) => e, Zx = (t, e) => t, Qx = (t, e, n) => t << n | e >>> 32 - n, Jx = (t, e, n) => e << n | t >>> 32 - n, tS = (t, e, n) => e << n - 32 | t >>> 64 - n, eS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function nS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const rS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), sS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, iS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), oS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, aS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), cS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: Qg,
  split: Rx,
  toBig: zx,
  shrSH: Gx,
  shrSL: Kx,
  rotrSH: Vx,
  rotrSL: Yx,
  rotrBH: Xx,
  rotrBL: qx,
  rotr32H: Wx,
  rotr32L: Zx,
  rotlSH: Qx,
  rotlSL: Jx,
  rotlBH: tS,
  rotlBL: eS,
  add: nS,
  add3L: rS,
  add3H: sS,
  add4L: iS,
  add4H: oS,
  add5H: cS,
  add5L: aS
}, [lS, uS] = Tt.split([
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
].map((t) => BigInt(t))), us = new Uint32Array(80), fs = new Uint32Array(80);
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
      us[k] = e.getUint32(n), fs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = us[k - 15] | 0, N = fs[k - 15] | 0, Y = Tt.rotrSH(C, N, 1) ^ Tt.rotrSH(C, N, 8) ^ Tt.shrSH(C, N, 7), it = Tt.rotrSL(C, N, 1) ^ Tt.rotrSL(C, N, 8) ^ Tt.shrSL(C, N, 7), q = us[k - 2] | 0, X = fs[k - 2] | 0, $ = Tt.rotrSH(q, X, 19) ^ Tt.rotrBH(q, X, 61) ^ Tt.shrSH(q, X, 6), _ = Tt.rotrSL(q, X, 19) ^ Tt.rotrBL(q, X, 61) ^ Tt.shrSL(q, X, 6), m = Tt.add4L(it, _, fs[k - 7], fs[k - 16]), P = Tt.add4H(m, Y, $, us[k - 7], us[k - 16]);
      us[k] = P | 0, fs[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), N = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Tt.add5L(F, N, it, uS[k], fs[k]), X = Tt.add5H(q, U, C, Y, lS[k], us[k]), $ = q | 0, _ = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), m = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), P = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Tt.add(u | 0, h | 0, X | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Tt.add3L($, m, K);
      r = Tt.add3H(B, X, _, P), s = B | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Tt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Tt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Tt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    us.fill(0), fs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, fS = class extends el {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, dS = class extends el {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, hS = class extends el {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
ki(() => new el());
ki(() => new fS());
ki(() => new dS());
ki(() => new hS());
var Ac = { exports: {} };
Ac.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", g = "[object Number]", S = "[object Object]", v = "[object Promise]", T = "[object RegExp]", U = "[object Set]", F = "[object String]", k = "[object Symbol]", C = "[object WeakMap]", N = "[object ArrayBuffer]", Y = "[object DataView]", it = "[object Float32Array]", q = "[object Float64Array]", X = "[object Int8Array]", $ = "[object Int16Array]", _ = "[object Int32Array]", m = "[object Uint8Array]", P = "[object Uint8ClampedArray]", K = "[object Uint16Array]", B = "[object Uint32Array]", st = /[\\^$.*+?()[\]{}|]/g, W = /\w*$/, kt = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, D = {};
  D[i] = D[o] = D[N] = D[Y] = D[a] = D[c] = D[it] = D[q] = D[X] = D[$] = D[_] = D[y] = D[g] = D[S] = D[T] = D[U] = D[F] = D[k] = D[m] = D[P] = D[K] = D[B] = !0, D[u] = D[h] = D[C] = !1;
  var lt = typeof pn == "object" && pn && pn.Object === Object && pn, ot = typeof self == "object" && self && self.Object === Object && self, ut = lt || ot || Function("return this")(), Nt = e && !e.nodeType && e, te = Nt && !0 && t && !t.nodeType && t, $t = te && te.exports === Nt;
  function Vt(w, M) {
    return w.set(M[0], M[1]), w;
  }
  function vt(w, M) {
    return w.add(M), w;
  }
  function He(w, M) {
    for (var R = -1, dt = w ? w.length : 0; ++R < dt && M(w[R], R, w) !== !1; )
      ;
    return w;
  }
  function Ht(w, M) {
    for (var R = -1, dt = M.length, Me = w.length; ++R < dt; )
      w[Me + R] = M[R];
    return w;
  }
  function Lt(w, M, R, dt) {
    for (var Me = -1, Re = w ? w.length : 0; ++Me < Re; )
      R = M(R, w[Me], Me, w);
    return R;
  }
  function jt(w, M) {
    for (var R = -1, dt = Array(w); ++R < w; )
      dt[R] = M(R);
    return dt;
  }
  function le(w, M) {
    return w == null ? void 0 : w[M];
  }
  function vn(w) {
    var M = !1;
    if (w != null && typeof w.toString != "function")
      try {
        M = !!(w + "");
      } catch {
      }
    return M;
  }
  function yn(w) {
    var M = -1, R = Array(w.size);
    return w.forEach(function(dt, Me) {
      R[++M] = [Me, dt];
    }), R;
  }
  function Te(w, M) {
    return function(R) {
      return w(M(R));
    };
  }
  function Xe(w) {
    var M = -1, R = Array(w.size);
    return w.forEach(function(dt) {
      R[++M] = dt;
    }), R;
  }
  var Ke = Array.prototype, qe = Function.prototype, Ee = Object.prototype, Wt = ut["__core-js_shared__"], Ve = function() {
    var w = /[^.]+$/.exec(Wt && Wt.keys && Wt.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), kn = qe.toString, We = Ee.hasOwnProperty, ee = Ee.toString, Ae = RegExp(
    "^" + kn.call(We).replace(st, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ar = $t ? ut.Buffer : void 0, I = ut.Symbol, G = ut.Uint8Array, x = Te(Object.getPrototypeOf, Object), O = Object.create, at = Ee.propertyIsEnumerable, St = Ke.splice, ne = Object.getOwnPropertySymbols, Rt = ar ? ar.isBuffer : void 0, ue = Te(Object.keys, Object), he = ft(ut, "DataView"), zt = ft(ut, "Map"), Fe = ft(ut, "Promise"), pt = ft(ut, "Set"), At = ft(ut, "WeakMap"), Gt = ft(Object, "create"), re = bt(he), je = bt(zt), oe = bt(Fe), wn = bt(pt), nn = bt(At), Tr = I ? I.prototype : void 0, Bi = Tr ? Tr.valueOf : void 0;
  function Xn(w) {
    var M = -1, R = w ? w.length : 0;
    for (this.clear(); ++M < R; ) {
      var dt = w[M];
      this.set(dt[0], dt[1]);
    }
  }
  function Be() {
    this.__data__ = Gt ? Gt(null) : {};
  }
  function $n(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function Us(w) {
    var M = this.__data__;
    if (Gt) {
      var R = M[w];
      return R === r ? void 0 : R;
    }
    return We.call(M, w) ? M[w] : void 0;
  }
  function Dt(w) {
    var M = this.__data__;
    return Gt ? M[w] !== void 0 : We.call(M, w);
  }
  function Ze(w, M) {
    var R = this.__data__;
    return R[w] = Gt && M === void 0 ? r : M, this;
  }
  Xn.prototype.clear = Be, Xn.prototype.delete = $n, Xn.prototype.get = Us, Xn.prototype.has = Dt, Xn.prototype.set = Ze;
  function rn(w) {
    var M = -1, R = w ? w.length : 0;
    for (this.clear(); ++M < R; ) {
      var dt = w[M];
      this.set(dt[0], dt[1]);
    }
  }
  function Os() {
    this.__data__ = [];
  }
  function cr(w) {
    var M = this.__data__, R = qn(M, w);
    if (R < 0)
      return !1;
    var dt = M.length - 1;
    return R == dt ? M.pop() : St.call(M, R, 1), !0;
  }
  function On(w) {
    var M = this.__data__, R = qn(M, w);
    return R < 0 ? void 0 : M[R][1];
  }
  function qr(w) {
    return qn(this.__data__, w) > -1;
  }
  function be(w, M) {
    var R = this.__data__, dt = qn(R, w);
    return dt < 0 ? R.push([w, M]) : R[dt][1] = M, this;
  }
  rn.prototype.clear = Os, rn.prototype.delete = cr, rn.prototype.get = On, rn.prototype.has = qr, rn.prototype.set = be;
  function bn(w) {
    var M = -1, R = w ? w.length : 0;
    for (this.clear(); ++M < R; ) {
      var dt = w[M];
      this.set(dt[0], dt[1]);
    }
  }
  function Hs() {
    this.__data__ = {
      hash: new Xn(),
      map: new (zt || rn)(),
      string: new Xn()
    };
  }
  function Mo(w) {
    return z(this, w).delete(w);
  }
  function Po(w) {
    return z(this, w).get(w);
  }
  function Ds(w) {
    return z(this, w).has(w);
  }
  function Fs(w, M) {
    return z(this, w).set(w, M), this;
  }
  bn.prototype.clear = Hs, bn.prototype.delete = Mo, bn.prototype.get = Po, bn.prototype.has = Ds, bn.prototype.set = Fs;
  function lr(w) {
    this.__data__ = new rn(w);
  }
  function In() {
    this.__data__ = new rn();
  }
  function Mi(w) {
    return this.__data__.delete(w);
  }
  function Pi(w) {
    return this.__data__.get(w);
  }
  function Ni(w) {
    return this.__data__.has(w);
  }
  function Wr(w, M) {
    var R = this.__data__;
    if (R instanceof rn) {
      var dt = R.__data__;
      if (!zt || dt.length < n - 1)
        return dt.push([w, M]), this;
      R = this.__data__ = new bn(dt);
    }
    return R.set(w, M), this;
  }
  lr.prototype.clear = In, lr.prototype.delete = Mi, lr.prototype.get = Pi, lr.prototype.has = Ni, lr.prototype.set = Wr;
  function js(w, M) {
    var R = De(w) || pe(w) ? jt(w.length, String) : [], dt = R.length, Me = !!dt;
    for (var Re in w)
      We.call(w, Re) && !(Me && (Re == "length" || H(Re, dt))) && R.push(Re);
    return R;
  }
  function ur(w, M, R) {
    var dt = w[M];
    (!(We.call(w, M) && ke(dt, R)) || R === void 0 && !(M in w)) && (w[M] = R);
  }
  function qn(w, M) {
    for (var R = w.length; R--; )
      if (ke(w[R][0], M))
        return R;
    return -1;
  }
  function Rs(w, M) {
    return w && b(M, Fi(M), w);
  }
  function Wn(w, M, R, dt, Me, Re, Ln) {
    var ze;
    if (dt && (ze = Re ? dt(w, Me, Re, Ln) : dt(w)), ze !== void 0)
      return ze;
    if (!Qt(w))
      return w;
    var Gs = De(w);
    if (Gs) {
      if (ze = j(w), !M)
        return f(w, ze);
    } else {
      var Fn = A(w), ji = Fn == h || Fn == l;
      if (zs(w))
        return Oi(w, M);
      if (Fn == S || Fn == i || ji && !Re) {
        if (vn(w))
          return Re ? w : {};
        if (ze = Z(ji ? {} : w), !M)
          return E(w, Rs(ze, w));
      } else {
        if (!D[Fn])
          return Re ? w : {};
        ze = ht(w, Fn, Wn, M);
      }
    }
    Ln || (Ln = new lr());
    var Ri = Ln.get(w);
    if (Ri)
      return Ri;
    if (Ln.set(w, ze), !Gs)
      var zi = R ? d(w) : Fi(w);
    return He(zi || w, function(Gi, Qr) {
      zi && (Qr = Gi, Gi = w[Qr]), ur(ze, Qr, Wn(Gi, M, R, dt, Qr, w, Ln));
    }), ze;
  }
  function _i(w) {
    return Qt(w) ? O(w) : {};
  }
  function fe(w, M, R) {
    var dt = M(w);
    return De(w) ? dt : Ht(dt, R(w));
  }
  function Ui(w) {
    return ee.call(w);
  }
  function Br(w) {
    if (!Qt(w) || tt(w))
      return !1;
    var M = mt(w) || vn(w) ? Ae : kt;
    return M.test(bt(w));
  }
  function Hn(w) {
    if (!gt(w))
      return ue(w);
    var M = [];
    for (var R in Object(w))
      We.call(w, R) && R != "constructor" && M.push(R);
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
    return new G(M).set(new G(w)), M;
  }
  function ve(w, M) {
    var R = M ? Dn(w.buffer) : w.buffer;
    return new w.constructor(R, w.byteOffset, w.byteLength);
  }
  function Hi(w, M, R) {
    var dt = M ? R(yn(w), !0) : yn(w);
    return Lt(dt, Vt, new w.constructor());
  }
  function Di(w) {
    var M = new w.constructor(w.source, W.exec(w));
    return M.lastIndex = w.lastIndex, M;
  }
  function Mr(w, M, R) {
    var dt = M ? R(Xe(w), !0) : Xe(w);
    return Lt(dt, vt, new w.constructor());
  }
  function Zr(w) {
    return Bi ? Object(Bi.call(w)) : {};
  }
  function Pr(w, M) {
    var R = M ? Dn(w.buffer) : w.buffer;
    return new w.constructor(R, w.byteOffset, w.length);
  }
  function f(w, M) {
    var R = -1, dt = w.length;
    for (M || (M = Array(dt)); ++R < dt; )
      M[R] = w[R];
    return M;
  }
  function b(w, M, R, dt) {
    R || (R = {});
    for (var Me = -1, Re = M.length; ++Me < Re; ) {
      var Ln = M[Me], ze = void 0;
      ur(R, Ln, ze === void 0 ? w[Ln] : ze);
    }
    return R;
  }
  function E(w, M) {
    return b(w, p(w), M);
  }
  function d(w) {
    return fe(w, Fi, p);
  }
  function z(w, M) {
    var R = w.__data__;
    return ct(M) ? R[typeof M == "string" ? "string" : "hash"] : R.map;
  }
  function ft(w, M) {
    var R = le(w, M);
    return Br(R) ? R : void 0;
  }
  var p = ne ? Te(ne, Object) : xa, A = Ui;
  (he && A(new he(new ArrayBuffer(1))) != Y || zt && A(new zt()) != y || Fe && A(Fe.resolve()) != v || pt && A(new pt()) != U || At && A(new At()) != C) && (A = function(w) {
    var M = ee.call(w), R = M == S ? w.constructor : void 0, dt = R ? bt(R) : void 0;
    if (dt)
      switch (dt) {
        case re:
          return Y;
        case je:
          return y;
        case oe:
          return v;
        case wn:
          return U;
        case nn:
          return C;
      }
    return M;
  });
  function j(w) {
    var M = w.length, R = w.constructor(M);
    return M && typeof w[0] == "string" && We.call(w, "index") && (R.index = w.index, R.input = w.input), R;
  }
  function Z(w) {
    return typeof w.constructor == "function" && !gt(w) ? _i(x(w)) : {};
  }
  function ht(w, M, R, dt) {
    var Me = w.constructor;
    switch (M) {
      case N:
        return Dn(w);
      case a:
      case c:
        return new Me(+w);
      case Y:
        return ve(w, dt);
      case it:
      case q:
      case X:
      case $:
      case _:
      case m:
      case P:
      case K:
      case B:
        return Pr(w, dt);
      case y:
        return Hi(w, dt, R);
      case g:
      case F:
        return new Me(w);
      case T:
        return Di(w);
      case U:
        return Mr(w, dt, R);
      case k:
        return Zr(w);
    }
  }
  function H(w, M) {
    return M = M ?? s, !!M && (typeof w == "number" || L.test(w)) && w > -1 && w % 1 == 0 && w < M;
  }
  function ct(w) {
    var M = typeof w;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? w !== "__proto__" : w === null;
  }
  function tt(w) {
    return !!Ve && Ve in w;
  }
  function gt(w) {
    var M = w && w.constructor, R = typeof M == "function" && M.prototype || Ee;
    return w === R;
  }
  function bt(w) {
    if (w != null) {
      try {
        return kn.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function Xt(w) {
    return Wn(w, !0, !0);
  }
  function ke(w, M) {
    return w === M || w !== w && M !== M;
  }
  function pe(w) {
    return ma(w) && We.call(w, "callee") && (!at.call(w, "callee") || ee.call(w) == i);
  }
  var De = Array.isArray;
  function Qe(w) {
    return w != null && Zt(w.length) && !mt(w);
  }
  function ma(w) {
    return mn(w) && Qe(w);
  }
  var zs = Rt || Sa;
  function mt(w) {
    var M = Qt(w) ? ee.call(w) : "";
    return M == h || M == l;
  }
  function Zt(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function Qt(w) {
    var M = typeof w;
    return !!w && (M == "object" || M == "function");
  }
  function mn(w) {
    return !!w && typeof w == "object";
  }
  function Fi(w) {
    return Qe(w) ? js(w) : Hn(w);
  }
  function xa() {
    return [];
  }
  function Sa() {
    return !1;
  }
  t.exports = Xt;
})(Ac, Ac.exports);
var pS = Ac.exports;
const Jg = /* @__PURE__ */ kp(pS);
var hu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(hu || (hu = {}));
function gS(t, e) {
  return { type: hu.Address, version: t, hash160: e };
}
function yS(t) {
  return $i.c32address(t.version, t.hash160);
}
const wS = (t) => jx(Kg(t)), bS = (t) => wt(wS(t));
Ce.hmacSha256Sync = (t, ...e) => {
  const n = zg.create(Kg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function mS(t, e = "mainnet") {
  e = Dg(e), t = typeof t == "string" ? Yt(t) : t;
  const n = Px(Dr.P2PKH, e), r = gS(n, bS(t));
  return yS(r);
}
function xS(t, e) {
  const n = en.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = mS(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new en.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function SS(t, e = null) {
  let n;
  e ? n = xS(t, e) : n = en.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ph = "_blockstackDidCheckEchoReply", ES = "echoReply", AS = "authContinuation";
function vS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function kS() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Ph];
  if (typeof e == "boolean")
    return e;
  const n = vS(t.location.search), r = n[ES];
  if (r) {
    t[Ph] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[AS];
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
      this.appConfig = new Np();
    else
      throw new Gb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new ph(e.sessionOptions) : this.store = new ph() : e ? this.store = new hh(e.sessionOptions) : this.store = new hh();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Vb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new tu("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, ux(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = lx();
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
      if (kS())
        return Ji.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Ji.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = gm()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new va("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = en.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await gx(e))
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
    let u = sm, h;
    xl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), xl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Ug(i.iss),
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
        l.profile = Object.assign({}, jb);
      else {
        const S = await g.text(), v = JSON.parse(S);
        l.profile = SS(v[0].token);
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), s2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), i2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
pu.prototype.makeAuthRequest = pu.prototype.makeAuthRequestToken;
const $S = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], IS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = $S(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!nl(r.id));
  return e.concat(n);
}, nl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ty = "STX_PROVIDER", ui = () => typeof window > "u" ? null : window.localStorage.getItem(ty), LS = (t) => {
  typeof window < "u" && window.localStorage.setItem(ty, t);
}, CS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function TS(t, e) {
  const n = {};
  return Object.assign(n, CS, e), await fetch(t, n);
}
function BS(t) {
  let e = TS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function MS(...t) {
  const { fetchLib: e, middlewares: n } = BS(t);
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
var fi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(fi || (fi = {}));
var Nh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Nh || (Nh = {}));
const PS = "https://api.mainnet.hiro.so", NS = "https://api.testnet.hiro.so", _S = "http://localhost:3999", US = ["mainnet", "testnet", "devnet", "mocknet"];
class di {
  constructor(e) {
    this.version = fi.Mainnet, this.chainId = wo.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === fi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? MS();
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
di.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new gu();
    case "testnet":
      return new yu();
    case "devnet":
      return new OS();
    case "mocknet":
      return new ey();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${US.join(", ")}`);
  }
};
di.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : di.fromName(t);
class gu extends di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? PS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Mainnet, this.chainId = wo.Mainnet;
  }
}
class yu extends di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? NS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Testnet, this.chainId = wo.Testnet;
  }
}
class ey extends di {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _S,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = fi.Testnet, this.chainId = wo.Testnet;
  }
}
const OS = ey;
var hi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(hi || (hi = {}));
var vc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vc || (vc = {}));
hi.Mainnet;
var pi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(pi || (pi = {}));
var gi;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(gi || (gi = {}));
pi.Mainnet;
const HS = {
  chainId: hi.Mainnet,
  transactionVersion: pi.Mainnet,
  peerNetworkId: vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: gi.MainnetSingleSig,
    multiSig: gi.MainnetMultiSig
  },
  client: { baseUrl: Bp }
}, wu = {
  chainId: hi.Testnet,
  transactionVersion: pi.Testnet,
  peerNetworkId: vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: gi.TestnetSingleSig,
    multiSig: gi.TestnetMultiSig
  },
  client: { baseUrl: Mp }
}, oc = {
  ...wu,
  addressVersion: { ...wu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Pp }
}, DS = {
  ...oc,
  addressVersion: { ...oc.addressVersion },
  client: { ...oc.client }
};
function FS(t) {
  switch (t) {
    case "mainnet":
      return HS;
    case "testnet":
      return wu;
    case "devnet":
      return oc;
    case "mocknet":
      return DS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function jS(t) {
  return typeof t == "string" ? FS(t) : t;
}
function RS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const _h = /* @__PURE__ */ new Map();
function ny(t, e) {
  const n = _h.get(t);
  if (n !== void 0)
    return n(e);
  const r = RS(t);
  return _h.set(t, r), ny(t, e);
}
let de = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Yt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return fm(this.readBytes(4), 0);
  }
  readUInt8() {
    return lm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return am(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = wt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = wt(n);
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
    if (ny(e, r))
      return r;
    throw n(r);
  }
};
const zS = 128, GS = 128, ry = 16, ei = 32, bu = 80, rl = 65, KS = 32, VS = 64, kc = 34, YS = 1 + 16 * 1024 * 1024, XS = 165, qS = 16, WS = 16, ZS = 20, QS = WS + 2 + ZS, JS = QS + 4, tE = YS + (XS + qS * JS);
var Jt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Jt || (Jt = {}));
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
var ge;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ge || (ge = {}));
var Ie;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ie || (Ie = {}));
var ae;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ae || (ae = {}));
var xe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xe || (xe = {}));
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
var hn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(hn || (hn = {}));
var Uh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Uh || (Uh = {}));
var Eu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Eu || (Eu = {}));
var er;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(er || (er = {}));
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
}, fn = class extends sl {
  constructor(e) {
    super(e);
  }
}, Ic = class extends sl {
  constructor(e) {
    super(e);
  }
}, Zs = class extends sl {
  constructor(e) {
    super(e);
  }
};
function Au(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function eE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function sy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function nE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Au(t.outputLen), Au(t.blockLen);
}
function rE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function sE(t, e) {
  sy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Qs = {
  number: Au,
  bool: eE,
  bytes: sy,
  hash: nE,
  exists: rE,
  output: sE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ll = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, iE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!iE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Tf(t) {
  if (typeof t == "string" && (t = oE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let iy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ii(t) {
  const e = (r) => t().update(Tf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let oy = class extends iy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Qs.hash(e);
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
    return Qs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Qs.exists(this), Qs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ay = (t, e, n) => new oy(t, e).update(n).digest();
ay.create = (t, e) => new oy(t, e);
function aE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Bf = class extends iy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ll(this.buffer);
  }
  update(e) {
    Qs.exists(this);
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
    Qs.exists(this), Qs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    aE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const cE = (t, e, n) => t & e ^ ~t & n, lE = (t, e, n) => t & e ^ t & n ^ e & n, uE = new Uint32Array([
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
]), ds = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), hs = new Uint32Array(64);
let cy = class extends Bf {
  constructor() {
    super(64, 32, 8, !1), this.A = ds[0] | 0, this.B = ds[1] | 0, this.C = ds[2] | 0, this.D = ds[3] | 0, this.E = ds[4] | 0, this.F = ds[5] | 0, this.G = ds[6] | 0, this.H = ds[7] | 0;
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
      hs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = hs[l - 15], g = hs[l - 2], S = hr(y, 7) ^ hr(y, 18) ^ y >>> 3, v = hr(g, 17) ^ hr(g, 19) ^ g >>> 10;
      hs[l] = v + hs[l - 7] + S + hs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), g = h + y + cE(a, c, u) + uE[l] + hs[l] | 0, v = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + lE(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    hs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, fE = class extends cy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Mf = Ii(() => new cy());
Ii(() => new fE());
const dE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ly = Uint8Array.from({ length: 16 }, (t, e) => e), hE = ly.map((t) => (9 * t + 5) % 16);
let Pf = [ly], Nf = [hE];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, Nf])
    e.push(e[t].map((n) => dE[n]));
const uy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pE = Pf.map((t, e) => t.map((n) => uy[e][n])), gE = Nf.map((t, e) => t.map((n) => uy[e][n])), yE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oa = (t, e) => t << e | t >>> 32 - e;
function Hh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ha = new Uint32Array(16);
let bE = class extends Bf {
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
      const S = 4 - g, v = yE[g], T = wE[g], U = Pf[g], F = Nf[g], k = pE[g], C = gE[g];
      for (let N = 0; N < 16; N++) {
        const Y = Oa(r + Hh(g, i, a, u) + Ha[U[N]] + v, k[N]) + l | 0;
        r = l, l = u, u = Oa(a, 10) | 0, a = i, i = Y;
      }
      for (let N = 0; N < 16; N++) {
        const Y = Oa(s + Hh(S, o, c, h) + Ha[F[N]] + T, C[N]) + y | 0;
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
const mE = Ii(() => new bE()), Da = BigInt(2 ** 32 - 1), vu = BigInt(32);
function fy(t, e = !1) {
  return e ? { h: Number(t & Da), l: Number(t >> vu & Da) } : { h: Number(t >> vu & Da) | 0, l: Number(t & Da) | 0 };
}
function xE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = fy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const SE = (t, e) => BigInt(t >>> 0) << vu | BigInt(e >>> 0), EE = (t, e, n) => t >>> n, AE = (t, e, n) => t << 32 - n | e >>> n, vE = (t, e, n) => t >>> n | e << 32 - n, kE = (t, e, n) => t << 32 - n | e >>> n, $E = (t, e, n) => t << 64 - n | e >>> n - 32, IE = (t, e, n) => t >>> n - 32 | e << 64 - n, LE = (t, e) => e, CE = (t, e) => t, TE = (t, e, n) => t << n | e >>> 32 - n, BE = (t, e, n) => e << n | t >>> 32 - n, ME = (t, e, n) => e << n - 32 | t >>> 64 - n, PE = (t, e, n) => t << n - 32 | e >>> 64 - n;
function NE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const _E = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), UE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, OE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), HE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, DE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), FE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: fy,
  split: xE,
  toBig: SE,
  shrSH: EE,
  shrSL: AE,
  rotrSH: vE,
  rotrSL: kE,
  rotrBH: $E,
  rotrBL: IE,
  rotr32H: LE,
  rotr32L: CE,
  rotlSH: TE,
  rotlSL: BE,
  rotlBH: ME,
  rotlBL: PE,
  add: NE,
  add3L: _E,
  add3H: UE,
  add4L: OE,
  add4H: HE,
  add5H: FE,
  add5L: DE
}, [jE, RE] = Bt.split([
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
].map((t) => BigInt(t))), ps = new Uint32Array(80), gs = new Uint32Array(80);
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
      ps[k] = e.getUint32(n), gs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = ps[k - 15] | 0, N = gs[k - 15] | 0, Y = Bt.rotrSH(C, N, 1) ^ Bt.rotrSH(C, N, 8) ^ Bt.shrSH(C, N, 7), it = Bt.rotrSL(C, N, 1) ^ Bt.rotrSL(C, N, 8) ^ Bt.shrSL(C, N, 7), q = ps[k - 2] | 0, X = gs[k - 2] | 0, $ = Bt.rotrSH(q, X, 19) ^ Bt.rotrBH(q, X, 61) ^ Bt.shrSH(q, X, 6), _ = Bt.rotrSL(q, X, 19) ^ Bt.rotrBL(q, X, 61) ^ Bt.shrSL(q, X, 6), m = Bt.add4L(it, _, gs[k - 7], gs[k - 16]), P = Bt.add4H(m, Y, $, ps[k - 7], ps[k - 16]);
      ps[k] = P | 0, gs[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), N = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Bt.add5L(F, N, it, RE[k], gs[k]), X = Bt.add5H(q, U, C, Y, jE[k], ps[k]), $ = q | 0, _ = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), m = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), P = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Bt.add(u | 0, h | 0, X | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Bt.add3L($, m, K);
      r = Bt.add3H(B, X, _, P), s = B | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Bt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Bt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Bt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    ps.fill(0), gs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, zE = class extends il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, GE = class extends il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, KE = class extends il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ii(() => new il());
Ii(() => new zE());
const VE = Ii(() => new GE());
Ii(() => new KE());
var Ft;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ft || (Ft = {}));
var Ge;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ge || (Ge = {}));
function _f(t) {
  return Ge[t];
}
const YE = () => ({ type: Ft.BoolTrue }), XE = () => ({ type: Ft.BoolFalse }), qE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ft.Buffer, value: wt(t) };
}, Dh = BigInt("0xffffffffffffffffffffffffffffffff"), WE = BigInt(0), Fh = BigInt("0x7fffffffffffffffffffffffffffffff"), jh = BigInt("-170141183460469231731687303715884105728"), ZE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = nu(Yt(t))), An(t, Uint8Array) && (t = nu(t));
  const e = ln(t);
  if (e > Fh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Fh}`);
  if (e < jh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${jh}`);
  return { type: Ft.Int, value: e };
}, QE = (t) => {
  const e = ln(t);
  if (e < WE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Dh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Dh}`);
  return { type: Ft.UInt, value: e };
};
function JE(t) {
  return { type: Ft.List, value: t };
}
function dy() {
  return { type: Ft.OptionalNone };
}
function hy(t) {
  return { type: Ft.OptionalSome, value: t };
}
var rt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(rt || (rt = {}));
function tA() {
  return {
    type: rt.Address,
    version: gi.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Rh(t) {
  if (t && Ey(t, kc))
    throw new Error(`Memo exceeds maximum length of ${kc} bytes`);
  return { type: rt.MemoString, content: t };
}
function Uf(t, e) {
  return {
    type: rt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function ku(t) {
  if (Yt(t).byteLength != rl)
    throw Error("Invalid signature");
  return {
    type: rt.MessageSignature,
    data: t
  };
}
function eA(t, e, n) {
  return typeof t == "string" && (t = wA(t)), typeof n == "string" && (n = Rh(n)), {
    type: rt.Payload,
    payloadType: Jt.TokenTransfer,
    recipient: t,
    amount: ln(e),
    memo: n ?? Rh("")
  };
}
function nA(t, e, n, r) {
  return typeof e == "string" && (e = sr(e)), typeof n == "string" && (n = sr(n)), {
    type: rt.Payload,
    payloadType: Jt.ContractCall,
    contractAddress: typeof t == "string" ? _s(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function rA(t) {
  return sr(t, 4, 1e5);
}
function zh(t, e, n) {
  return typeof t == "string" && (t = sr(t)), typeof e == "string" && (e = rA(e)), typeof n == "number" ? {
    type: rt.Payload,
    payloadType: Jt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: rt.Payload,
    payloadType: Jt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function sA() {
  return { type: rt.Payload, payloadType: Jt.PoisonMicroblock };
}
function Gh(t, e) {
  if (t.byteLength != ei)
    throw Error(`Coinbase buffer size must be ${ei} bytes`);
  return e != null ? {
    type: rt.Payload,
    payloadType: Jt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: rt.Payload,
    payloadType: Jt.Coinbase,
    coinbaseBytes: t
  };
}
function iA(t, e, n) {
  if (t.byteLength != ei)
    throw Error(`Coinbase buffer size must be ${ei} bytes`);
  if (n.byteLength != bu)
    throw Error(`VRF proof buffer size must be ${bu} bytes`);
  return {
    type: rt.Payload,
    payloadType: Jt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ft.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function oA(t, e, n, r, s, i, o) {
  return {
    type: rt.Payload,
    payloadType: Jt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function sr(t, e, n) {
  const r = e || 1, s = n || zS;
  if (Ey(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: rt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function aA(t, e, n) {
  return {
    type: rt.Asset,
    address: _s(t),
    contractName: sr(e),
    assetName: sr(n)
  };
}
function _s(t) {
  const e = $i.c32addressDecode(t);
  return {
    type: rt.Address,
    version: e[0],
    hash160: e[1]
  };
}
function cA(t, e) {
  const n = _s(t), r = sr(e);
  return {
    type: rt.Principal,
    prefix: hn.Contract,
    address: n,
    contractName: r
  };
}
function lA(t) {
  const e = _s(t);
  return {
    type: rt.Principal,
    prefix: hn.Standard,
    address: e
  };
}
function eo(t, e) {
  return {
    pubKeyEncoding: t,
    type: rt.TransactionAuthField,
    contents: e
  };
}
function Ur(t) {
  switch (t.type) {
    case rt.Address:
      return ya(t);
    case rt.Principal:
      return py(t);
    case rt.LengthPrefixedString:
      return mo(t);
    case rt.MemoString:
      return fA(t);
    case rt.Asset:
      return yy(t);
    case rt.PostCondition:
      return by(t);
    case rt.PublicKey:
      return Lu(t);
    case rt.LengthPrefixedList:
      return Of(t);
    case rt.Payload:
      return my(t);
    case rt.TransactionAuthField:
      return yA(t);
    case rt.MessageSignature:
      return Hf(t);
  }
}
function ya(t) {
  const e = [];
  return e.push(Yt(ua(t.version, 1))), e.push(Yt(t.hash160)), Ue(e);
}
function bo(t) {
  const e = An(t, de) ? t : new de(t), n = Gc(wt(e.readBytes(1))), r = wt(e.readBytes(20));
  return { type: rt.Address, version: n, hash160: r };
}
function py(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === hn.Standard || t.prefix === hn.Contract) && e.push(ya(t.address)), t.prefix === hn.Contract && e.push(mo(t.contractName)), Ue(e);
}
function uA(t) {
  const e = An(t, de) ? t : new de(t), n = e.readUInt8Enum(hn, (i) => {
    throw new fn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === hn.Origin)
    return { type: rt.Principal, prefix: n };
  const r = bo(e);
  if (n === hn.Standard)
    return { type: rt.Principal, prefix: n, address: r };
  const s = Kn(e);
  return {
    type: rt.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function mo(t) {
  const e = [], n = Ei(t.content), r = n.byteLength;
  return e.push(Yt(ua(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Kn(t, e, n) {
  e = e || 1;
  const r = An(t, de) ? t : new de(t), s = Gc(wt(r.readBytes(e))), i = fa(r.readBytes(s));
  return sr(i, e, n ?? 128);
}
function fA(t) {
  const e = [], n = Ei(t.content), r = DA(wt(n), kc * 2);
  return e.push(Yt(r)), Ue(e);
}
function gy(t) {
  const e = An(t, de) ? t : new de(t);
  let n = fa(e.readBytes(kc));
  return n = n.replace(/\u0000*$/, ""), { type: rt.MemoString, content: n };
}
function yy(t) {
  const e = [];
  return e.push(ya(t.address)), e.push(mo(t.contractName)), e.push(mo(t.assetName)), Ue(e);
}
function $u(t) {
  const e = An(t, de) ? t : new de(t);
  return {
    type: rt.Asset,
    address: bo(e),
    contractName: Kn(e),
    assetName: Kn(e)
  };
}
function Of(t) {
  const e = t.values, n = [];
  n.push(Yt(ua(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ur(r));
  return Ue(n);
}
function wy(t, e, n) {
  const r = An(t, de) ? t : new de(t), s = Gc(wt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case rt.Address:
        i.push(bo(r));
        break;
      case rt.LengthPrefixedString:
        i.push(Kn(r));
        break;
      case rt.MemoString:
        i.push(gy(r));
        break;
      case rt.Asset:
        i.push($u(r));
        break;
      case rt.PostCondition:
        i.push(hA(r));
        break;
      case rt.PublicKey:
        i.push(Cu(r));
        break;
      case rt.TransactionAuthField:
        i.push(gA(r));
        break;
    }
  return Uf(i, n);
}
function dA(t) {
  return wt(by(t));
}
function by(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(py(t.principal)), (t.conditionType === ge.Fungible || t.conditionType === ge.NonFungible) && e.push(yy(t.asset)), t.conditionType === ge.NonFungible && e.push(Er(t.assetName)), e.push(t.conditionCode), t.conditionType === ge.STX || t.conditionType === ge.Fungible || t.conditionType === ge.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new to("The post-condition amount may not be larger than 8 bytes");
    e.push(Ps(t.amount, 8));
  }
  return Ue(e);
}
function hA(t) {
  const e = An(t, de) ? t : new de(t), n = e.readUInt8Enum(ge, (a) => {
    throw new fn(`Could not read ${a} as PostConditionType`);
  }), r = uA(e);
  let s, i, o;
  switch (n) {
    case ge.STX:
      return s = e.readUInt8Enum(Xo, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${wt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: ge.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ge.Fungible:
      return i = $u(e), s = e.readUInt8Enum(Xo, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${wt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: ge.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case ge.NonFungible:
      i = $u(e);
      const a = mr(e);
      return s = e.readUInt8Enum(xu, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: rt.PostCondition,
        conditionType: ge.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case ge.Staking:
      return s = e.readUInt8Enum(Xo, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${wt(e.readBytes(8))}`), {
        type: rt.PostCondition,
        conditionType: ge.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ge.PoX: {
      const c = e.readUInt8Enum(Su, (u) => {
        throw new fn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: rt.PostCondition,
        conditionType: ge.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function my(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Jt.TokenTransfer:
      e.push(Er(t.recipient)), e.push(Ps(t.amount, 8)), e.push(Ur(t.memo));
      break;
    case Jt.ContractCall:
      e.push(Ur(t.contractAddress)), e.push(Ur(t.contractName)), e.push(Ur(t.functionName));
      const n = new Uint8Array(4);
      ii(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Er(r));
      });
      break;
    case Jt.SmartContract:
      e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case Jt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case Jt.PoisonMicroblock:
      break;
    case Jt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Jt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Er(t.recipient));
      break;
    case Jt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Er(t.recipient ? hy(t.recipient) : dy())), e.push(t.vrfProof);
      break;
    case Jt.TenureChange:
      e.push(Yt(t.tenureHash)), e.push(Yt(t.previousTenureHash)), e.push(Yt(t.burnViewHash)), e.push(Yt(t.previousTenureEnd)), e.push(ii(new Uint8Array(4), t.previousTenureBlocks)), e.push(um(new Uint8Array(1), t.cause)), e.push(Yt(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function pA(t) {
  const e = An(t, de) ? t : new de(t);
  switch (e.readUInt8Enum(Jt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Jt.TokenTransfer:
      const r = mr(e), s = ln(e.readBytes(8)), i = gy(e);
      return eA(r, s, i);
    case Jt.ContractCall:
      const o = bo(e), a = Kn(e), c = Kn(e), u = [], h = e.readUInt32BE();
      for (let C = 0; C < h; C++) {
        const N = mr(e);
        u.push(N);
      }
      return nA(o, a, c, u);
    case Jt.SmartContract:
      const l = Kn(e), y = Kn(e, 4, 1e5);
      return zh(l, y);
    case Jt.VersionedSmartContract: {
      const C = e.readUInt8Enum(mu, (it) => {
        throw new Error(`Cannot recognize ClarityVersion: ${it}`);
      }), N = Kn(e), Y = Kn(e, 4, tE);
      return zh(N, Y, C);
    }
    case Jt.PoisonMicroblock:
      return sA();
    case Jt.Coinbase: {
      const C = e.readBytes(ei);
      return Gh(C);
    }
    case Jt.CoinbaseToAltRecipient: {
      const C = e.readBytes(ei), N = mr(e);
      return Gh(C, N);
    }
    case Jt.NakamotoCoinbase: {
      const C = e.readBytes(ei), N = mr(e), Y = e.readBytes(bu);
      return iA(C, N, Y);
    }
    case Jt.TenureChange:
      const g = wt(e.readBytes(20)), S = wt(e.readBytes(20)), v = wt(e.readBytes(20)), T = wt(e.readBytes(32)), U = e.readUInt32BE(), F = e.readUInt8Enum(Eu, (C) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${C}`);
      }), k = wt(e.readBytes(20));
      return oA(g, S, v, T, U, F, k);
  }
}
function Iu(t) {
  const e = An(t, de) ? t : new de(t);
  return ku(wt(e.readBytes(rl)));
}
function gA(t) {
  const e = An(t, de) ? t : new de(t), n = e.readUInt8Enum(er, (r) => {
    throw new fn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case er.PublicKeyCompressed:
      return eo(xe.Compressed, Cu(e));
    case er.PublicKeyUncompressed:
      return eo(xe.Uncompressed, Io(WA(Cu(e).data)));
    case er.SignatureCompressed:
      return eo(xe.Compressed, Iu(e));
    case er.SignatureUncompressed:
      return eo(xe.Uncompressed, Iu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Hf(t) {
  return Yt(t.data);
}
function yA(t) {
  const e = [];
  switch (t.contents.type) {
    case rt.PublicKey:
      e.push(t.pubKeyEncoding === xe.Compressed ? er.PublicKeyCompressed : er.PublicKeyUncompressed), e.push(Yt(qA(t.contents.data)));
      break;
    case rt.MessageSignature:
      e.push(t.pubKeyEncoding === xe.Compressed ? er.SignatureCompressed : er.SignatureUncompressed), e.push(Hf(t.contents));
      break;
  }
  return Ue(e);
}
function Lu(t) {
  return t.data.slice();
}
function Cu(t) {
  const e = An(t, de) ? t : new de(t), n = e.readUInt8(), r = n === 4 ? VS : KS;
  return Io(Ue([n, e.readBytes(r)]));
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
      return Fa(t, FA(r[0].data));
    case ae.P2WPKH:
      return Fa(t, jA(r[0].data));
    case ae.P2SH:
    case ae.P2SHNonSequential:
      return Fa(t, RA(n, r.map(Lu)));
    case ae.P2WSH:
    case ae.P2WSHNonSequential:
      return Fa(t, zA(n, r.map(Lu)));
  }
}
function Fa(t, e) {
  return { type: rt.Address, version: t, hash160: e };
}
function Ff(t) {
  return $i.c32address(t.version, t.hash160);
}
function Kh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return aA(e, n, r);
}
function Oo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return cA(e, n);
  } else
    return lA(t);
}
function wA(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return xA(e, n);
  } else
    return bA(t);
}
function bA(t) {
  const e = _s(t);
  return { type: Ft.PrincipalStandard, value: Ff(e) };
}
function mA(t) {
  return { type: Ft.PrincipalStandard, value: Ff(t) };
}
function xA(t, e) {
  const n = _s(t), r = sr(e);
  return xy(n, r);
}
function xy(t, e) {
  if (Ei(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ft.PrincipalContract,
    value: `${Ff(t)}.${e.content}`
  };
}
function SA(t) {
  return { type: Ft.ResponseErr, value: t };
}
function EA(t) {
  return { type: Ft.ResponseOk, value: t };
}
const AA = (t) => ({ type: Ft.StringASCII, value: t }), vA = (t) => ({ type: Ft.StringUTF8, value: t });
function kA(t) {
  for (const e in t)
    if (!GA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ft.Tuple, value: t };
}
function mr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new de(Yt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new de(t) : e = t;
  switch (e.readUInt8Enum(Ge, (r) => {
    throw new fn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ge.int:
      return ZE(nu(e.readBytes(16)));
    case Ge.uint:
      return QE(e.readBytes(16));
    case Ge.buffer:
      const r = e.readUInt32BE();
      return qE(e.readBytes(r));
    case Ge.true:
      return YE();
    case Ge.false:
      return XE();
    case Ge.address:
      const s = bo(e);
      return mA(s);
    case Ge.contract:
      const i = bo(e), o = Kn(e);
      return xy(i, o);
    case Ge.ok:
      return EA(mr(e));
    case Ge.err:
      return SA(mr(e));
    case Ge.none:
      return dy();
    case Ge.some:
      return hy(mr(e));
    case Ge.list:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(mr(e));
      return JE(c);
    case Ge.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Kn(e).content;
        if (T === void 0)
          throw new fn('"content" is undefined');
        h[T] = mr(e);
      }
      return kA(h);
    case Ge.ascii:
      const l = e.readUInt32BE(), y = nm(e.readBytes(l));
      return AA(y);
    case Ge.utf8:
      const g = e.readUInt32BE(), S = fa(e.readBytes(g));
      return vA(S);
    default:
      throw new fn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Ir(t, e) {
  return Ue([_f(t), e]);
}
function $A(t) {
  return new Uint8Array([_f(t.type)]);
}
function IA(t) {
  return t.type === Ft.OptionalNone ? new Uint8Array([_f(t.type)]) : Ir(t.type, Er(t.value));
}
function LA(t) {
  const e = new Uint8Array(4);
  return ii(e, Math.ceil(t.value.length / 2), 0), Ir(t.type, kr(e, Yt(t.value)));
}
function CA(t) {
  const e = uf(Zb(BigInt(t.value), BigInt(GS)), ry);
  return Ir(t.type, e);
}
function TA(t) {
  const e = uf(BigInt(t.value), ry);
  return Ir(t.type, e);
}
function BA(t) {
  return Ir(t.type, ya(_s(t.value)));
}
function MA(t) {
  const [e, n] = KA(t.value);
  return Ir(t.type, kr(ya(_s(e)), mo(sr(n))));
}
function PA(t) {
  return Ir(t.type, Er(t.value));
}
function NA(t) {
  const e = [], n = new Uint8Array(4);
  ii(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Er(r);
    e.push(s);
  }
  return Ir(t.type, Ue(e));
}
function _A(t) {
  const e = [], n = new Uint8Array(4);
  ii(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = sr(s);
    e.push(mo(i));
    const o = Er(t.value[s]);
    e.push(o);
  }
  return Ir(t.type, Ue(e));
}
function Sy(t, e) {
  const n = [], r = e == "ascii" ? em(t.value) : Ei(t.value), s = new Uint8Array(4);
  return ii(s, r.length, 0), n.push(s), n.push(r), Ir(t.type, Ue(n));
}
function UA(t) {
  return Sy(t, "ascii");
}
function OA(t) {
  return Sy(t, "utf8");
}
function Vh(t) {
  return wt(Er(t));
}
function Er(t) {
  switch (t.type) {
    case Ft.BoolTrue:
    case Ft.BoolFalse:
      return $A(t);
    case Ft.OptionalNone:
    case Ft.OptionalSome:
      return IA(t);
    case Ft.Buffer:
      return LA(t);
    case Ft.UInt:
      return TA(t);
    case Ft.Int:
      return CA(t);
    case Ft.PrincipalStandard:
      return BA(t);
    case Ft.PrincipalContract:
      return MA(t);
    case Ft.ResponseOk:
    case Ft.ResponseErr:
      return PA(t);
    case Ft.List:
      return NA(t);
    case Ft.Tuple:
      return _A(t);
    case Ft.StringASCII:
      return UA(t);
    case Ft.StringUTF8:
      return OA(t);
    default:
      throw new to("Unable to serialize. Invalid Clarity Value.");
  }
}
const HA = (t) => t.length % 2 ? `0${t}` : t, DA = (t, e) => t.padEnd(e, "0"), Ey = (t, e) => t ? Ei(t).length > e : !1;
function Tu(t) {
  return Jg(t);
}
const ta = (t) => mE(Mf(t)), jf = (t) => wt(VE(t)), FA = (t) => wt(ta(t)), jA = (t) => {
  const e = ta(t), n = kr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ta(n);
  return wt(r);
}, RA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = ta(r);
  return wt(s);
}, zA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = Mf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ue(i), a = ta(o);
  return wt(a);
};
function GA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function KA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = ay.create(Mf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Io(t) {
  return t = typeof t == "string" ? Yt(t) : t, {
    type: rt.PublicKey,
    data: t
  };
}
function VA(t, e, n = xe.Compressed) {
  const r = om(e), s = new Nn(Vd(r.r), Vd(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === xe.Compressed;
  return i.toHex(o);
}
function YA(t) {
  return typeof t == "string" ? t : wt(t);
}
const Rf = YA;
function Ay(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === im;
}
function Lo(t) {
  return !Rf(t).startsWith("04");
}
function XA(t) {
  t = ff(t);
  const e = Ay(t);
  return wt(da(t.slice(0, 32), e));
}
function qA(t) {
  return Ut.fromHex(Rf(t)).toHex(!0);
}
function WA(t) {
  return Ut.fromHex(Rf(t)).toHex(!1);
}
function ZA(t, e) {
  t = ff(t);
  const [n, r] = Vc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ua(r, 1) + Nn.fromHex(n).toCompactHex();
}
function zf() {
  return {
    type: rt.MessageSignature,
    data: wt(new Uint8Array(rl))
  };
}
function vy(t, e, n, r) {
  const s = Df(0, t, 1, [Io(e)]).hash160, i = Lo(e) ? xe.Compressed : xe.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: ln(n),
    fee: ln(r),
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
function QA(t) {
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
function JA(t) {
  const e = [
    t.hashMode,
    Yt(t.signer),
    Ps(t.nonce, 8),
    Ps(t.fee, 8),
    t.keyEncoding,
    Hf(t.signature)
  ];
  return Ue(e);
}
function t3(t) {
  const e = [
    t.hashMode,
    Yt(t.signer),
    Ps(t.nonce, 8),
    Ps(t.fee, 8)
  ], n = Uf(t.fields);
  e.push(Of(n));
  const r = new Uint8Array(2);
  return cm(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function e3(t, e) {
  const n = wt(e.readBytes(20)), r = BigInt(`0x${wt(e.readBytes(8))}`), s = BigInt(`0x${wt(e.readBytes(8))}`), i = e.readUInt8Enum(xe, (a) => {
    throw new fn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ae.P2WPKH && i != xe.Compressed)
    throw new fn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function n3(t, e) {
  const n = wt(e.readBytes(20)), r = BigInt("0x" + wt(e.readBytes(8))), s = BigInt("0x" + wt(e.readBytes(8))), i = wy(e, rt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case rt.PublicKey:
        Lo(u.contents.data) || (o = !0);
        break;
      case rt.MessageSignature:
        if (u.pubKeyEncoding === xe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Zs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ae.P2WSH || t === ae.P2WSHNonSequential))
    throw new Zs("Uncompressed keys are not allowed in this hash mode");
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
  return ea(t) ? JA(t) : t3(t);
}
function Tl(t) {
  const e = t.readUInt8Enum(ae, (n) => {
    throw new fn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ae.P2PKH || e === ae.P2WPKH ? e3(e, t) : n3(e, t);
}
function ky(t, e, n, r) {
  const i = t + wt(new Uint8Array([e])) + wt(Ps(n, 8)) + wt(Ps(r, 8));
  if (Yt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return jf(Yt(i));
}
function $y(t, e, n) {
  const r = 33 + rl, s = Lo(e.data) ? xe.Compressed : xe.Uncompressed, i = t + HA(s.toString(16)) + n, o = Yt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return jf(o);
}
function r3(t, e, n, r, s) {
  const i = ky(t, e, n, r), o = ZA(s, i), a = Io(XA(s)), c = $y(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Iy(t, e, n, r, s, i) {
  const o = ky(t, e, n, r), a = Io(VA(o, i, s)), c = $y(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function s3() {
  const t = vy(ae.P2PKH, "", 0, 0);
  return t.signer = tA().hash160, t.keyEncoding = xe.Compressed, t.signature = zf(), t;
}
function qh(t, e, n) {
  return ea(t) ? i3(t, e, n) : o3(t, e, n);
}
function i3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Iy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Df(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Zs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function o3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case rt.PublicKey:
        Lo(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case rt.MessageSignature:
        c.pubKeyEncoding === xe.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Iy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Yh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new Zs("Too many signatures");
        break;
    }
  if (Yh(t.hashMode) && o !== t.signaturesRequired || QA(t.hashMode) && o < t.signaturesRequired)
    throw new Zs("Incorrect number of signatures");
  if (i && (t.hashMode === ae.P2WSH || t.hashMode === ae.P2WSHNonSequential))
    throw new Zs("Uncompressed keys are not allowed in this hash mode");
  const a = Df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Zs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Ly(t) {
  return {
    authType: Ie.Standard,
    spendingCondition: t
  };
}
function Cy(t, e) {
  return {
    authType: Ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || vy(ae.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Wh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ie.Standard:
        return Ly(Xh(t.spendingCondition));
      case Ie.Sponsored:
        return Cy(Xh(t.spendingCondition), s3());
      default:
        throw new Ic("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function a3(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      return qh(t.spendingCondition, e, Ie.Standard);
    case Ie.Sponsored:
      return qh(t.spendingCondition, e, Ie.Standard);
    default:
      throw new Ic("Invalid origin auth type");
  }
}
function c3(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      const n = {
        ...t.spendingCondition,
        fee: ln(e)
      };
      return { ...t, spendingCondition: n };
    case Ie.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: ln(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function l3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: ln(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function u3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: ln(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function f3(t, e) {
  const n = {
    ...e,
    nonce: ln(e.nonce),
    fee: ln(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function d3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ie.Standard:
      e.push(Cl(t.spendingCondition));
      break;
    case Ie.Sponsored:
      e.push(Cl(t.spendingCondition)), e.push(Cl(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function h3(t) {
  const e = t.readUInt8Enum(Ie, (r) => {
    throw new fn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ie.Standard:
      return n = Tl(t), Ly(n);
    case Ie.Sponsored:
      n = Tl(t);
      const r = Tl(t);
      return Cy(n, r);
  }
}
class p3 {
  constructor({ auth: e, payload: n, postConditions: r = Uf([]), postConditionMode: s = $c.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = jS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: ln(n.amount)
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
    return a3(this.auth, this.verifyBegin());
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
      r.fields.push(eo(s ? xe.Compressed : xe.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = r3(n, r, e.fee, e.nonce, s);
    if (ea(e))
      e.signature = ku(i);
    else {
      const a = Ay(s);
      e.fields.push(eo(a ? xe.Compressed : xe.Uncompressed, ku(i)));
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
    this.auth = f3(this.auth, e);
  }
  setFee(e) {
    this.auth = c3(this.auth, e);
  }
  setNonce(e) {
    this.auth = l3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = u3(this.auth, e);
  }
  serialize() {
    return wt(this.serializeBytes());
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
    return ii(n, this.chainId, 0), e.push(n), e.push(d3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Of(this.postConditions)), e.push(my(this.payload)), Ue(e);
  }
}
function g3(t) {
  const e = An(t, de) ? t : new de(t), n = e.readUInt8Enum(pi, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = h3(e), i = e.readUInt8Enum(Tn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum($c, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = wy(e, rt.PostCondition), c = pA(e), u = new p3({
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
  const e = ln(t);
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
function y3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: ge.STX,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: hn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Bl(t.amount)
      };
    case "ft-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: ge.Fungible,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: hn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Bl(t.amount),
        asset: Kh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: ge.NonFungible,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: hn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        asset: Kh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: ge.Staking,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: hn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Bl(t.amount)
      };
    case "pox-postcondition":
      return {
        type: rt.PostCondition,
        conditionType: ge.PoX,
        principal: t.address === "origin" ? { type: rt.Principal, prefix: hn.Origin } : Oo(t.address),
        conditionCode: w3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ja(t) {
  return Bu[t];
}
function w3(t) {
  return Mu[t];
}
function Ty(t) {
  const e = y3(t);
  return dA(e);
}
function b3(t, e, n) {
  return Kf(By(t), n);
}
function By(t, e) {
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
    return BigInt(`0x${S3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Gf(t, e = 8) {
  return (typeof t == "bigint" ? t : By(t)).toString(16).padStart(e * 2, "0");
}
function Kf(t, e = 16) {
  const n = Gf(t, e);
  return na(n);
}
function m3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const x3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function S3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += x3[n];
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
function E3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function A3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Qh(t) {
  if (t.some(A3))
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
var Pu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pu || (Pu = {}));
Pu.Mainnet;
const v3 = 128, k3 = 128, My = 16;
var Nu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(Nu || (Nu = {}));
var Jh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Jh || (Jh = {}));
var t0;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(t0 || (t0 = {}));
var Jn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Jn || (Jn = {}));
const Ml = ["onChainOnly", "offChainOnly", "any"];
Ml[0] + "", Jn.OnChainOnly, Ml[1] + "", Jn.OffChainOnly, Ml[2] + "", Jn.Any, Jn.OnChainOnly + "", Jn.OnChainOnly, Jn.OffChainOnly + "", Jn.OffChainOnly, Jn.Any + "", Jn.Any;
var _u;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(_u || (_u = {}));
_u.Mainnet;
var e0;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(e0 || (e0 = {}));
var Ys;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ys || (Ys = {}));
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
function $3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Py(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function I3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ou(t.outputLen), Ou(t.blockLen);
}
function L3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function C3(t, e) {
  Py(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Pl = {
  number: Ou,
  bool: $3,
  bytes: Py,
  hash: I3,
  exists: L3,
  output: C3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Nl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, T3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!T3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function B3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ny(t) {
  if (typeof t == "string" && (t = B3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let M3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Li(t) {
  const e = (r) => t().update(Ny(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function P3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Xf = class extends M3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Nl(this.buffer);
  }
  update(e) {
    Pl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ny(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Nl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Pl.exists(this), Pl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    P3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Nl(e), c = this.outputLen;
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
const N3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), _y = Uint8Array.from({ length: 16 }, (t, e) => e), _3 = _y.map((t) => (9 * t + 5) % 16);
let qf = [_y], Wf = [_3];
for (let t = 0; t < 4; t++)
  for (let e of [qf, Wf])
    e.push(e[t].map((n) => N3[n]));
const Uy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), U3 = qf.map((t, e) => t.map((n) => Uy[e][n])), O3 = Wf.map((t, e) => t.map((n) => Uy[e][n])), H3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), D3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ra = (t, e) => t << e | t >>> 32 - e;
function u0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const za = new Uint32Array(16);
let F3 = class extends Xf {
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
      const S = 4 - g, v = H3[g], T = D3[g], U = qf[g], F = Wf[g], k = U3[g], C = O3[g];
      for (let N = 0; N < 16; N++) {
        const Y = Ra(r + u0(g, i, a, u) + za[U[N]] + v, k[N]) + l | 0;
        r = l, l = u, u = Ra(a, 10) | 0, a = i, i = Y;
      }
      for (let N = 0; N < 16; N++) {
        const Y = Ra(s + u0(S, o, c, h) + za[F[N]] + T, C[N]) + y | 0;
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
Li(() => new F3());
const j3 = (t, e, n) => t & e ^ ~t & n, R3 = (t, e, n) => t & e ^ t & n ^ e & n, z3 = new Uint32Array([
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
]), ys = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ws = new Uint32Array(64);
let Oy = class extends Xf {
  constructor() {
    super(64, 32, 8, !1), this.A = ys[0] | 0, this.B = ys[1] | 0, this.C = ys[2] | 0, this.D = ys[3] | 0, this.E = ys[4] | 0, this.F = ys[5] | 0, this.G = ys[6] | 0, this.H = ys[7] | 0;
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
      ws[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ws[l - 15], g = ws[l - 2], S = pr(y, 7) ^ pr(y, 18) ^ y >>> 3, v = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      ws[l] = v + ws[l - 7] + S + ws[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = h + y + j3(a, c, u) + z3[l] + ws[l] | 0, v = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + R3(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ws.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, G3 = class extends Oy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Li(() => new Oy());
Li(() => new G3());
const Ga = BigInt(2 ** 32 - 1), Hu = BigInt(32);
function Hy(t, e = !1) {
  return e ? { h: Number(t & Ga), l: Number(t >> Hu & Ga) } : { h: Number(t >> Hu & Ga) | 0, l: Number(t & Ga) | 0 };
}
function K3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Hy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const V3 = (t, e) => BigInt(t >>> 0) << Hu | BigInt(e >>> 0), Y3 = (t, e, n) => t >>> n, X3 = (t, e, n) => t << 32 - n | e >>> n, q3 = (t, e, n) => t >>> n | e << 32 - n, W3 = (t, e, n) => t << 32 - n | e >>> n, Z3 = (t, e, n) => t << 64 - n | e >>> n - 32, Q3 = (t, e, n) => t >>> n - 32 | e << 64 - n, J3 = (t, e) => e, tv = (t, e) => t, ev = (t, e, n) => t << n | e >>> 32 - n, nv = (t, e, n) => e << n | t >>> 32 - n, rv = (t, e, n) => e << n - 32 | t >>> 64 - n, sv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function iv(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ov = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), av = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, cv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), lv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, uv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), fv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: Hy,
  split: K3,
  toBig: V3,
  shrSH: Y3,
  shrSL: X3,
  rotrSH: q3,
  rotrSL: W3,
  rotrBH: Z3,
  rotrBL: Q3,
  rotr32H: J3,
  rotr32L: tv,
  rotlSH: ev,
  rotlSL: nv,
  rotlBH: rv,
  rotlBL: sv,
  add: iv,
  add3L: ov,
  add3H: av,
  add4L: cv,
  add4H: lv,
  add5H: fv,
  add5L: uv
}, [dv, hv] = Mt.split([
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
].map((t) => BigInt(t))), bs = new Uint32Array(80), ms = new Uint32Array(80);
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
      bs[k] = e.getUint32(n), ms[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = bs[k - 15] | 0, N = ms[k - 15] | 0, Y = Mt.rotrSH(C, N, 1) ^ Mt.rotrSH(C, N, 8) ^ Mt.shrSH(C, N, 7), it = Mt.rotrSL(C, N, 1) ^ Mt.rotrSL(C, N, 8) ^ Mt.shrSL(C, N, 7), q = bs[k - 2] | 0, X = ms[k - 2] | 0, $ = Mt.rotrSH(q, X, 19) ^ Mt.rotrBH(q, X, 61) ^ Mt.shrSH(q, X, 6), _ = Mt.rotrSL(q, X, 19) ^ Mt.rotrBL(q, X, 61) ^ Mt.shrSL(q, X, 6), m = Mt.add4L(it, _, ms[k - 7], ms[k - 16]), P = Mt.add4H(m, Y, $, bs[k - 7], bs[k - 16]);
      bs[k] = P | 0, ms[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Mt.rotrSH(l, y, 14) ^ Mt.rotrSH(l, y, 18) ^ Mt.rotrBH(l, y, 41), N = Mt.rotrSL(l, y, 14) ^ Mt.rotrSL(l, y, 18) ^ Mt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Mt.add5L(F, N, it, hv[k], ms[k]), X = Mt.add5H(q, U, C, Y, dv[k], bs[k]), $ = q | 0, _ = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), m = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), P = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Mt.add(u | 0, h | 0, X | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Mt.add3L($, m, K);
      r = Mt.add3H(B, X, _, P), s = B | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Mt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Mt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Mt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    bs.fill(0), ms.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, pv = class extends al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, gv = class extends al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, yv = class extends al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Li(() => new al());
Li(() => new pv());
Li(() => new gv());
Li(() => new yv());
function wv(t, e, n) {
  const s = v3;
  if (Pv(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: Nu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ye;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ye || (Ye = {}));
let bv = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Dy = class extends bv {
  constructor(e) {
    super(e);
  }
};
function cl(t) {
  const e = [];
  return e.push(na(Gf(t.version, 1))), e.push(na(t.hash160)), Xr(e);
}
function mv(t) {
  const e = [];
  return e.push(t.prefix), e.push(cl(t.address)), t.prefix === Uu.Contract && e.push(ra(t.contractName)), Xr(e);
}
function ra(t) {
  const e = [], n = Vf(t.content), r = n.byteLength;
  return e.push(na(Gf(r, t.lengthPrefixBytes))), e.push(n), Xr(e);
}
function xv(t) {
  const e = [];
  return e.push(cl(t.address)), e.push(ra(t.contractName)), e.push(ra(t.assetName)), Xr(e);
}
function Fy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(mv(t.principal)), (t.conditionType === Ys.Fungible || t.conditionType === Ys.NonFungible) && e.push(xv(t.assetInfo)), t.conditionType === Ys.NonFungible && e.push(yi(t.assetName)), e.push(t.conditionCode), t.conditionType === Ys.STX || t.conditionType === Ys.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Dy("The post-condition amount may not be larger than 8 bytes");
    e.push(b3(t.amount, !1, 8));
  }
  return Xr(e);
}
function Lr(t, e) {
  return Xr([t, e]);
}
function Sv(t) {
  return new Uint8Array([t.type]);
}
function Ev(t) {
  return t.type === Ye.OptionalNone ? new Uint8Array([t.type]) : Lr(t.type, yi(t.value));
}
function Av(t) {
  const e = new Uint8Array(4);
  return ol(e, t.buffer.length, 0), Lr(t.type, Yf(e, t.buffer));
}
function vv(t) {
  const e = Kf(m3(t.value, BigInt(k3)), My);
  return Lr(t.type, e);
}
function kv(t) {
  const e = Kf(t.value, My);
  return Lr(t.type, e);
}
function $v(t) {
  return Lr(t.type, cl(t.address));
}
function Iv(t) {
  return Lr(t.type, Yf(cl(t.address), ra(t.contractName)));
}
function Lv(t) {
  return Lr(t.type, yi(t.value));
}
function Cv(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = yi(r);
    e.push(s);
  }
  return Lr(t.type, Xr(e));
}
function Tv(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = wv(s);
    e.push(ra(i));
    const o = yi(t.data[s]);
    e.push(o);
  }
  return Lr(t.type, Xr(e));
}
function jy(t, e) {
  const n = [], r = e == "ascii" ? E3(t.data) : Vf(t.data), s = new Uint8Array(4);
  return ol(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, Xr(n));
}
function Bv(t) {
  return jy(t, "ascii");
}
function Mv(t) {
  return jy(t, "utf8");
}
function yi(t) {
  switch (t.type) {
    case Ye.BoolTrue:
    case Ye.BoolFalse:
      return Sv(t);
    case Ye.OptionalNone:
    case Ye.OptionalSome:
      return Ev(t);
    case Ye.Buffer:
      return Av(t);
    case Ye.UInt:
      return kv(t);
    case Ye.Int:
      return vv(t);
    case Ye.PrincipalStandard:
      return $v(t);
    case Ye.PrincipalContract:
      return Iv(t);
    case Ye.ResponseOk:
    case Ye.ResponseErr:
      return Lv(t);
    case Ye.List:
      return Cv(t);
    case Ye.Tuple:
      return Tv(t);
    case Ye.StringASCII:
      return Bv(t);
    case Ye.StringUTF8:
      return Mv(t);
    default:
      throw new Dy("Unable to serialize. Invalid Clarity Value.");
  }
}
const Pv = (t, e) => t ? Vf(t).length > e : !1, Nv = "connect-ui";
let ac, Ry, Bn = !1, Du = !1;
const Yr = (t, e = "") => () => {
}, _v = (t, e) => () => {
}, Uv = "{visibility:hidden}.hydrated{visibility:inherit}", f0 = {}, Ov = "http://www.w3.org/2000/svg", Hv = "http://www.w3.org/1999/xhtml", Dv = (t) => t != null, Zf = (t) => (t = typeof t, t === "object" || t === "function");
function zy(t) {
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
}, Fv = {}, jv = (t) => t && t.$tag$ === Fv, Rv = (t, e) => t != null && !Zf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, zv = (t) => Co(t).$hostElement$, Gv = (t, e, n) => {
  const r = an.ce(e, n);
  return t.dispatchEvent(r), r;
}, d0 = /* @__PURE__ */ new WeakMap(), Kv = (t, e, n) => {
  let r = Lc.get(t);
  f4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Lc.set(t, r);
}, Vv = (t, e, n, r) => {
  var s;
  let i = Gy(e);
  const o = Lc.get(i);
  if (t = t.nodeType === 11 ? t : Ar, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = d0.get(t), c;
      if (a || d0.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Ar.createElement("style"), c.innerHTML = o;
          const u = (s = an.$nonce$) !== null && s !== void 0 ? s : zy(Ar);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, Yv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Yr("attachStyles", e.$tagName$), i = Vv(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Gy = (t, e) => "sc-" + t.$tagName$, h0 = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = g0(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = p0(n), h = p0(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : g0(ll, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && an.rel(t, e, n, !1), r && an.ael(t, e, r, !1);
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
}, Xv = /\s/, p0 = (t) => t ? t.split(Xv) : [], Ky = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || f0, o = e.$attrs$ || f0;
  for (r in i)
    r in o || h0(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    h0(s, r, i[r], o[r], n, e.$flags$);
}, Qf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Ar.createTextNode(s.$text$);
  else {
    if (Bn || (Bn = s.$tag$ === "svg"), o = s.$elm$ = Ar.createElementNS(Bn ? Ov : Hv, s.$tag$), Bn && s.$tag$ === "foreignObject" && (Bn = !1), Ky(null, s, Bn), Dv(ac) && o["s-si"] !== ac && o.classList.add(o["s-si"] = ac), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Qf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Bn = !1 : o.tagName === "foreignObject" && (Bn = !0);
  }
  return o;
}, Vy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Ry && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Qf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Yy = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, qv = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : Ka(a, h) ? (zo(a, h), a = e[++s], h = r[++i]) : Ka(c, l) ? (zo(c, l), c = e[--o], l = r[--u]) : Ka(a, l) ? (zo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ka(c, h) ? (zo(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (y = Qf(e && e[i], n, i), h = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Vy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Yy(e, s, o);
}, Ka = (t, e) => t.$tag$ === e.$tag$, zo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Bn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Bn, Ky(t, e, Bn), r !== null && s !== null ? qv(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Vy(n, null, e, s, 0, s.length - 1)) : r !== null && Yy(r, 0, r.length - 1), Bn && i === "svg" && (Bn = !1)) : t.$text$ !== o && (n.data = o);
}, Wv = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || Fu(null, null), s = jv(e) ? e : It(null, null, e);
  Ry = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ac = n["s-sc"], zo(r, s);
}, Xy = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, Jf = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Xy(t, t.$ancestorComponent$), h4(() => Zv(t, e));
}, Zv = (t, e) => {
  const n = Yr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), e4(s, () => Qv(t, r, e));
}, Qv = async (t, e, n) => {
  const r = t.$hostElement$, s = Yr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && Yv(t);
  const o = Yr("render", t.$cmpMeta$.$tagName$);
  Jv(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => t4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, Jv = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Wv(t, e);
  } catch (r) {
    sa(r, t.$hostElement$);
  }
  return null;
}, t4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Yr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Wy(n), r(), t.$onReadyResolve$(n), s || qy()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && ed(() => Jf(t, !1)), t.$flags$ &= -517;
}, qy = (t) => {
  Wy(Ar.documentElement), ed(() => Gv(ll, "appload", { detail: { namespace: Nv } }));
}, e4 = (t, e) => t && t.then ? t.then(e) : e(), Wy = (t) => t.classList.add("hydrated"), n4 = (t, e) => Co(t).$instanceValues$.get(e), r4 = (t, e, n, r) => {
  const s = Co(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Rv(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && Jf(s, !1));
}, Zy = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return n4(this, i);
        },
        set(a) {
          r4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        an.jmp(() => {
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
}, s4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = u4(n), s.then) {
        const c = _v();
        s = await s, c();
      }
      s.isProxied || (Zy(
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
      const c = Gy(n);
      if (!Lc.has(c)) {
        const u = Yr("registerStyles", n.$tagName$);
        Kv(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => Jf(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, i4 = (t) => {
  if (!(an.$flags$ & 1)) {
    const e = Co(t), n = e.$cmpMeta$, r = Yr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Xy(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), s4(t, e, n);
    }
    r();
  }
}, o4 = (t) => {
  an.$flags$ & 1 || Co(t);
}, a4 = (t, e = {}) => {
  var n;
  const r = Yr(), s = [], i = e.exclude || [], o = ll.customElements, a = Ar.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Ar.createElement("style"), h = [];
  let l, y = !0;
  Object.assign(an, e), an.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Ar.baseURI).href, t.map((g) => {
    g[1].map((S) => {
      const v = {
        $flags$: S[0],
        $tagName$: S[1],
        $members$: S[2],
        $listeners$: S[3]
      };
      v.$members$ = S[2];
      const T = v.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(F) {
          super(F), F = this, l4(F, v), v.$flags$ & 1 && F.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? h.push(this) : an.jmp(() => i4(this));
        }
        disconnectedCallback() {
          an.jmp(() => o4(this));
        }
        componentOnReady() {
          return Co(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = g[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Zy(
        U,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + Uv, u.setAttribute("data-styles", "");
    const g = (n = an.$nonce$) !== null && n !== void 0 ? n : zy(Ar);
    g != null && u.setAttribute("nonce", g), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, h.length ? h.map((g) => g.connectedCallback()) : an.jmp(() => l = setTimeout(qy, 30)), r();
}, td = /* @__PURE__ */ new WeakMap(), Co = (t) => td.get(t), c4 = (t, e) => td.set(e.$lazyInstance$ = t, e), l4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], td.set(t, n);
}, g0 = (t, e) => e in t, sa = (t, e) => (0, console.error)(t, e), _l = /* @__PURE__ */ new Map(), u4 = (t, e, n) => {
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
}, Lc = /* @__PURE__ */ new Map(), ll = typeof window < "u" ? window : {}, Ar = ll.document || { head: {} }, an = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, Qy = (t) => Promise.resolve(t), f4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), y0 = [], Jy = [], d4 = (t, e) => (n) => {
  t.push(n), Du || (Du = !0, an.$flags$ & 4 ? ed(ju) : an.raf(ju));
}, w0 = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      sa(n);
    }
  t.length = 0;
}, ju = () => {
  w0(y0), w0(Jy), (Du = y0.length > 0) && an.raf(ju);
}, ed = (t) => Qy().then(t), h4 = /* @__PURE__ */ d4(Jy), p4 = () => Qy(), g4 = (t, e) => typeof window > "u" ? Promise.resolve() : p4().then(() => a4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var y4 = Object.defineProperty, w4 = Object.defineProperties, b4 = Object.getOwnPropertyDescriptors, Cc = Object.getOwnPropertySymbols, tw = Object.prototype.hasOwnProperty, ew = Object.prototype.propertyIsEnumerable, b0 = (t, e, n) => e in t ? y4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Un = (t, e) => {
  for (var n in e || (e = {})) tw.call(e, n) && b0(t, n, e[n]);
  if (Cc) for (var n of Cc(e)) ew.call(e, n) && b0(t, n, e[n]);
  return t;
}, ir = (t, e) => w4(t, b4(e)), nw = (t, e) => {
  var n = {};
  for (var r in t) tw.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Cc) for (var r of Cc(t)) e.indexOf(r) < 0 && ew.call(t, r) && (n[r] = t[r]);
  return n;
};
function rw() {
  return nl(ui()) || window.StacksProvider || window.BlockstackProvider;
}
function ul(t) {
  return t ? typeof t == "string" ? di.fromName(t) : "version" in t ? t : "url" in t ? new gu({ url: t.url }) : t.transactionVersion === pi.Mainnet ? new gu({ url: t.client.baseUrl }) : new yu({ url: t.client.baseUrl }) : new yu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var m4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(m4 || {}), x4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(x4 || {}), nd = (t) => {
  let e = t;
  if (!e) {
    let n = new Np(["store_write"], document.location.href);
    e = new pu({ appConfig: n });
  }
  return e;
};
function sw(t) {
  try {
    return nd(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var iw = (t) => {
  let e = nd(t).loadUserData().appPrivateKey, n = en.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function S4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [hi.Mainnet]: "mainnet", [hi.Testnet]: "testnet" }, a = ul(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function E4(t) {
  let e = ul(t.network), n = nd(t.userSession), r = ir(Un({}, t), { network: e, userSession: n });
  return Un({ stxAddress: S4(r) }, r);
}
async function A4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Ty) : n = n.map((r) => wt(Fy(r)))), new en.TokenSigner("ES256k", e).signAsync(ir(Un({}, t), { postConditions: n }));
}
function v4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Ty) : e = e.map((n) => wt(Fy(n)))), en.createUnsecuredToken(ir(Un({}, t), { postConditions: e }));
}
var k4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Yt(a.replace(/^0x/, "")), u = g3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, ir(Un({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, ir(Un({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, $4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = nw(e, ["amount", "appDetails", "userSession"]);
  if (sw(s)) {
    let { privateKey: a, publicKey: c } = iw(s), u = ir(Un({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), A4(u, a);
  }
  let o = ir(Un({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), v4(o);
};
async function I4(t, e, n) {
  let r = await e(ir(Un(Un({}, E4(t)), t), { network: ul(t.network) }));
  return k4({ token: r, options: t }, n);
}
function L4(t, e = rw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return I4(t, $4, e);
}
function ow(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? ir(Un({}, t), { message: Vh(e), domain: Vh(n) }) : ir(Un({}, t), { message: wt(yi(e)), domain: wt(yi(n)) });
}
async function C4(t, e) {
  return new en.TokenSigner("ES256k", e).signAsync(ow(t));
}
async function T4(t) {
  let e = t, { userSession: n } = e, r = nw(e, ["userSession"]);
  if (sw(n)) {
    let { privateKey: s, publicKey: i } = iw(n), o = ir(Un({}, r), { publicKey: i });
    return C4(o, s);
  }
  return en.createUnsecuredToken(ow(t));
}
var B4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(B4 || {}), aw = "asigna-stx", m0 = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === aw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(P4(t, e), "*");
}), M4 = { authenticationRequest: async (t) => m0(t, "authenticationRequest"), transactionRequest: async (t) => m0(t, "transactionRequest") }, P4 = (t, e) => ({ source: aw, [e]: t }), N4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = M4);
};
N4();
var _4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function U4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ui(), o = rw();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    g4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : _4, c = IS(a), u = document.createElement("connect-modal");
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
var Va = U4(L4);
function Ns(t, e, n) {
  return rd(gn(t, e), n);
}
function gn(t, e) {
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
      const r = D4(BigInt(`0x${Ot(n)}`), BigInt(n.byteLength * 8));
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
  return (typeof t == "bigint" ? t : gn(t, !1)).toString(16).padStart(e * 2, "0");
}
function fl(t) {
  return parseInt(t, 16);
}
function rd(t, e = 16) {
  const n = wa(t, e);
  return we(n);
}
function O4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function H4(t, e) {
  return t & BigInt(1) << e;
}
function D4(t, e) {
  return H4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const F4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += F4[n];
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
function To(t) {
  return new TextEncoder().encode(t);
}
function sd(t) {
  return new TextDecoder().decode(t);
}
function cw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function j4(t) {
  return String.fromCharCode.apply(null, t);
}
function R4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function S0(t) {
  if (t.some(R4))
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
function Oe(t) {
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
const lw = 33, Ul = 32;
function z4(t) {
  if (t.length < Ul * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ul * 2), r = t.slice(2 + Ul * 2);
  return {
    recoveryId: fl(e),
    r: n,
    s: r
  };
}
function G4(t) {
  const e = typeof t == "string" ? we(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function K4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function V4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Y4(t, e) {
  return t[e];
}
function X4(t, e, n = 0) {
  return t[n] = e, t;
}
function q4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function wi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Ru;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Ru || (Ru = {}));
const W4 = Ru.Mainnet, Z4 = 128, Q4 = 128, uw = 16, ni = 32, zu = 80, hl = 65, J4 = 32, tk = 64, Tc = 34;
var yt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(yt || (yt = {}));
var _t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_t || (_t = {}));
var Gu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Gu || (Gu = {}));
var Sn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Sn || (Sn = {}));
const cc = ["onChainOnly", "offChainOnly", "any"], k0 = {
  [cc[0]]: Sn.OnChainOnly,
  [cc[1]]: Sn.OffChainOnly,
  [cc[2]]: Sn.Any,
  [Sn.OnChainOnly]: Sn.OnChainOnly,
  [Sn.OffChainOnly]: Sn.OffChainOnly,
  [Sn.Any]: Sn.Any
};
function ek(t) {
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
var En;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(En || (En = {}));
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
var Se;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Se || (Se = {}));
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
function nk(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function fw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function rk(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Vu(t.outputLen), Vu(t.blockLen);
}
function sk(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ik(t, e) {
  fw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Js = {
  number: Vu,
  bool: nk,
  bytes: fw,
  hash: rk,
  exists: sk,
  output: ik
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ol = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, ok = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ok)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ak(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function id(t) {
  if (typeof t == "string" && (t = ak(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class dw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ci(t) {
  const e = (r) => t().update(id(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function ck(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class od extends dw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ol(this.buffer);
  }
  update(e) {
    Js.exists(this);
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
    Js.exists(this), Js.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    ck(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const lk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), hw = Uint8Array.from({ length: 16 }, (t, e) => e), uk = hw.map((t) => (9 * t + 5) % 16);
let ad = [hw], cd = [uk];
for (let t = 0; t < 4; t++)
  for (let e of [ad, cd])
    e.push(e[t].map((n) => lk[n]));
const pw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), fk = ad.map((t, e) => t.map((n) => pw[e][n])), dk = cd.map((t, e) => t.map((n) => pw[e][n])), hk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), pk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ya = (t, e) => t << e | t >>> 32 - e;
function L0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xa = new Uint32Array(16);
class gk extends od {
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
      const S = 4 - g, v = hk[g], T = pk[g], U = ad[g], F = cd[g], k = fk[g], C = dk[g];
      for (let N = 0; N < 16; N++) {
        const Y = Ya(r + L0(g, i, a, u) + Xa[U[N]] + v, k[N]) + l | 0;
        r = l, l = u, u = Ya(a, 10) | 0, a = i, i = Y;
      }
      for (let N = 0; N < 16; N++) {
        const Y = Ya(s + L0(S, o, c, h) + Xa[F[N]] + T, C[N]) + y | 0;
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
const yk = Ci(() => new gk()), wk = (t, e, n) => t & e ^ ~t & n, bk = (t, e, n) => t & e ^ t & n ^ e & n, mk = new Uint32Array([
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
]), xs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Ss = new Uint32Array(64);
class gw extends od {
  constructor() {
    super(64, 32, 8, !1), this.A = xs[0] | 0, this.B = xs[1] | 0, this.C = xs[2] | 0, this.D = xs[3] | 0, this.E = xs[4] | 0, this.F = xs[5] | 0, this.G = xs[6] | 0, this.H = xs[7] | 0;
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
      Ss[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = Ss[l - 15], g = Ss[l - 2], S = gr(y, 7) ^ gr(y, 18) ^ y >>> 3, v = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      Ss[l] = v + Ss[l - 7] + S + Ss[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = h + y + wk(a, c, u) + mk[l] + Ss[l] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + bk(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    Ss.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class xk extends gw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ld = Ci(() => new gw());
Ci(() => new xk());
const qa = BigInt(2 ** 32 - 1), Yu = BigInt(32);
function yw(t, e = !1) {
  return e ? { h: Number(t & qa), l: Number(t >> Yu & qa) } : { h: Number(t >> Yu & qa) | 0, l: Number(t & qa) | 0 };
}
function Sk(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = yw(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Ek = (t, e) => BigInt(t >>> 0) << Yu | BigInt(e >>> 0), Ak = (t, e, n) => t >>> n, vk = (t, e, n) => t << 32 - n | e >>> n, kk = (t, e, n) => t >>> n | e << 32 - n, $k = (t, e, n) => t << 32 - n | e >>> n, Ik = (t, e, n) => t << 64 - n | e >>> n - 32, Lk = (t, e, n) => t >>> n - 32 | e << 64 - n, Ck = (t, e) => e, Tk = (t, e) => t, Bk = (t, e, n) => t << n | e >>> 32 - n, Mk = (t, e, n) => e << n | t >>> 32 - n, Pk = (t, e, n) => e << n - 32 | t >>> 64 - n, Nk = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _k(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Uk = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Ok = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Hk = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dk = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Fk = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), jk = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: yw,
  split: Sk,
  toBig: Ek,
  shrSH: Ak,
  shrSL: vk,
  rotrSH: kk,
  rotrSL: $k,
  rotrBH: Ik,
  rotrBL: Lk,
  rotr32H: Ck,
  rotr32L: Tk,
  rotlSH: Bk,
  rotlSL: Mk,
  rotlBH: Pk,
  rotlBL: Nk,
  add: _k,
  add3L: Uk,
  add3H: Ok,
  add4L: Hk,
  add4H: Dk,
  add5H: jk,
  add5L: Fk
}, [Rk, zk] = Pt.split([
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
].map((t) => BigInt(t))), Es = new Uint32Array(80), As = new Uint32Array(80);
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
      Es[k] = e.getUint32(n), As[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = Es[k - 15] | 0, N = As[k - 15] | 0, Y = Pt.rotrSH(C, N, 1) ^ Pt.rotrSH(C, N, 8) ^ Pt.shrSH(C, N, 7), it = Pt.rotrSL(C, N, 1) ^ Pt.rotrSL(C, N, 8) ^ Pt.shrSL(C, N, 7), q = Es[k - 2] | 0, X = As[k - 2] | 0, $ = Pt.rotrSH(q, X, 19) ^ Pt.rotrBH(q, X, 61) ^ Pt.shrSH(q, X, 6), _ = Pt.rotrSL(q, X, 19) ^ Pt.rotrBL(q, X, 61) ^ Pt.shrSL(q, X, 6), m = Pt.add4L(it, _, As[k - 7], As[k - 16]), P = Pt.add4H(m, Y, $, Es[k - 7], Es[k - 16]);
      Es[k] = P | 0, As[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Pt.rotrSH(l, y, 14) ^ Pt.rotrSH(l, y, 18) ^ Pt.rotrBH(l, y, 41), N = Pt.rotrSL(l, y, 14) ^ Pt.rotrSL(l, y, 18) ^ Pt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Pt.add5L(F, N, it, zk[k], As[k]), X = Pt.add5H(q, U, C, Y, Rk[k], Es[k]), $ = q | 0, _ = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), m = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), P = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Pt.add(u | 0, h | 0, X | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const B = Pt.add3L($, m, K);
      r = Pt.add3H(B, X, _, P), s = B | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Pt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Pt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Pt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Pt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    Es.fill(0), As.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Gk extends pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Kk extends pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Vk extends pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ci(() => new pl());
Ci(() => new Gk());
const Yk = Ci(() => new Kk());
Ci(() => new Vk());
function ww(t) {
  if (we(t).byteLength != hl)
    throw Error("Invalid signature");
  return {
    type: yt.MessageSignature,
    data: t
  };
}
function Go(t, e) {
  return { type: yt.Address, version: t, hash160: e };
}
function no(t) {
  return $i.c32address(t.version, t.hash160);
}
function bi(t, e, n) {
  const r = e || 1, s = n || Z4;
  if (Nw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: yt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function ud(t) {
  const e = $i.c32addressDecode(t);
  return {
    type: yt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Q;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Q || (Q = {}));
function Xk(t) {
  if (t.type === Q.PrincipalStandard)
    return no(t.address);
  if (t.type === Q.PrincipalContract)
    return `${no(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function bw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Zk(e, n);
  } else
    return qk(t);
}
function qk(t) {
  const e = ud(t);
  return { type: Q.PrincipalStandard, address: e };
}
function Wk(t) {
  return { type: Q.PrincipalStandard, address: t };
}
function Zk(t, e) {
  const n = ud(t), r = bi(e);
  return mw(n, r);
}
function mw(t, e) {
  if (To(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Q.PrincipalContract, address: t, contractName: e };
}
function Hl(t, e = !1) {
  switch (t.type) {
    case Q.BoolTrue:
      return !0;
    case Q.BoolFalse:
      return !1;
    case Q.Int:
    case Q.UInt:
      return e ? t.value.toString() : t.value;
    case Q.Buffer:
      return `0x${Ot(t.buffer)}`;
    case Q.OptionalNone:
      return null;
    case Q.OptionalSome:
      return xr(t.value);
    case Q.ResponseErr:
      return xr(t.value);
    case Q.ResponseOk:
      return xr(t.value);
    case Q.PrincipalStandard:
    case Q.PrincipalContract:
      return Xk(t);
    case Q.List:
      return t.list.map((r) => xr(r));
    case Q.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = xr(t.data[r]);
      }), n;
    case Q.StringASCII:
      return t.data;
    case Q.StringUTF8:
      return t.data;
  }
}
function xr(t) {
  switch (t.type) {
    case Q.ResponseErr:
      return { type: $s(t), value: Hl(t, !0), success: !1 };
    case Q.ResponseOk:
      return { type: $s(t), value: Hl(t, !0), success: !0 };
    default:
      return { type: $s(t), value: Hl(t, !0) };
  }
}
function $s(t) {
  switch (t.type) {
    case Q.BoolTrue:
    case Q.BoolFalse:
      return "bool";
    case Q.Int:
      return "int";
    case Q.UInt:
      return "uint";
    case Q.Buffer:
      return `(buff ${t.buffer.length})`;
    case Q.OptionalNone:
      return "(optional none)";
    case Q.OptionalSome:
      return `(optional ${$s(t.value)})`;
    case Q.ResponseErr:
      return `(response UnknownType ${$s(t.value)})`;
    case Q.ResponseOk:
      return `(response ${$s(t.value)} UnknownType)`;
    case Q.PrincipalStandard:
    case Q.PrincipalContract:
      return "principal";
    case Q.List:
      return `(list ${t.list.length} ${t.list.length ? $s(t.list[0]) : "UnknownType"})`;
    case Q.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${$s(t.data[e])})`).join(" ")})`;
    case Q.StringASCII:
      return `(string-ascii ${cw(t.data).length})`;
    case Q.StringUTF8:
      return `(string-utf8 ${To(t.data).length})`;
  }
}
const xw = () => ({ type: Q.BoolTrue }), Sw = () => ({ type: Q.BoolFalse }), Qk = (t) => t ? xw() : Sw(), C0 = BigInt("0xffffffffffffffffffffffffffffffff"), Jk = BigInt(0), T0 = BigInt("0x7fffffffffffffffffffffffffffffff"), B0 = BigInt("-170141183460469231731687303715884105728"), t8 = (t) => {
  const e = gn(t, !0);
  if (e > T0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${T0}`);
  if (e < B0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${B0}`);
  return { type: Q.Int, value: e };
}, vr = (t) => {
  const e = gn(t, !1);
  if (e < Jk)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > C0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${C0}`);
  return { type: Q.UInt, value: e };
}, Ew = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Q.Buffer, buffer: t };
};
function Aw() {
  return { type: Q.OptionalNone };
}
function vw(t) {
  return { type: Q.OptionalSome, value: t };
}
function e8(t) {
  return { type: Q.ResponseErr, value: t };
}
function n8(t) {
  return { type: Q.ResponseOk, value: t };
}
function r8(t) {
  return { type: Q.List, list: t };
}
function mi(t) {
  for (const e in t)
    if (!V8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Q.Tuple, data: t };
}
const tn = (t) => ({ type: Q.StringASCII, data: t }), s8 = (t) => ({ type: Q.StringUTF8, data: t });
class kw extends dw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Js.hash(e);
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
}
const $w = (t, e, n) => new kw(t, e).update(n).digest();
$w.create = (t, e) => new kw(t, e);
Ce.hmacSha256Sync = (t, ...e) => {
  const n = $w.create(ld, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function So(t) {
  return {
    type: yt.PublicKey,
    data: we(t)
  };
}
function i8(t, e, n = Se.Compressed) {
  const r = z4(e.data), s = new Nn(x0(r.r), x0(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === Se.Compressed;
  return i.toHex(o);
}
function o8(t) {
  return { type: yt.PublicKey, data: t };
}
function Bo(t) {
  return !Ot(t.data).startsWith("04");
}
function Pc(t) {
  return t.data.slice();
}
function a8(t) {
  const e = u8(t), n = da(e.data.slice(0, 32), e.compressed);
  return So(Ot(n));
}
function c8(t) {
  const e = typeof t == "string" ? t : Ot(t), n = Ut.fromHex(e).toHex(!0);
  return So(n);
}
function l8(t) {
  const e = typeof t == "string" ? t : Ot(t), n = Ut.fromHex(e).toHex(!1);
  return So(n);
}
function Xu(t) {
  const e = t.readUInt8(), n = e === 4 ? tk : J4;
  return o8(Oe([e, t.readBytes(n)]));
}
function u8(t) {
  const e = G4(t), n = e.length == lw;
  return { data: e, compressed: n };
}
function f8(t, e) {
  const [n, r] = Vc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = wa(r, 1) + Nn.fromHex(n).toCompactHex();
  return ww(i);
}
function d8(t) {
  return a8(t.data);
}
function h8(t, e, n) {
  return typeof t == "string" && (t = bw(t)), typeof n == "string" && (n = N0(n)), {
    type: yt.Payload,
    payloadType: _t.TokenTransfer,
    recipient: t,
    amount: gn(e, !1),
    memo: n ?? N0("")
  };
}
function p8(t, e, n, r) {
  return typeof t == "string" && (t = ud(t)), typeof e == "string" && (e = bi(e)), typeof n == "string" && (n = bi(n)), {
    type: yt.Payload,
    payloadType: _t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function M0(t, e, n) {
  return typeof t == "string" && (t = bi(t)), typeof e == "string" && (e = A8(e)), typeof n == "number" ? {
    type: yt.Payload,
    payloadType: _t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: yt.Payload,
    payloadType: _t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function g8() {
  return { type: yt.Payload, payloadType: _t.PoisonMicroblock };
}
function P0(t, e) {
  if (t.byteLength != ni)
    throw Error(`Coinbase buffer size must be ${ni} bytes`);
  return e != null ? {
    type: yt.Payload,
    payloadType: _t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: yt.Payload,
    payloadType: _t.Coinbase,
    coinbaseBytes: t
  };
}
function y8(t, e, n) {
  if (t.byteLength != ni)
    throw Error(`Coinbase buffer size must be ${ni} bytes`);
  if (n.byteLength != zu)
    throw Error(`VRF proof buffer size must be ${zu} bytes`);
  return {
    type: yt.Payload,
    payloadType: _t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Q.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var qu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(qu || (qu = {}));
function w8(t, e, n, r, s, i, o) {
  return {
    type: yt.Payload,
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
function Iw(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case _t.TokenTransfer:
      e.push(Ne(t.recipient)), e.push(Ns(t.amount, !1, 8)), e.push(Or(t.memo));
      break;
    case _t.ContractCall:
      e.push(Or(t.contractAddress)), e.push(Or(t.contractName)), e.push(Or(t.functionName));
      const n = new Uint8Array(4);
      wi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ne(r));
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
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient));
      break;
    case _t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient ? vw(t.recipient) : Aw())), e.push(t.vrfProof);
      break;
    case _t.TenureChange:
      e.push(we(t.tenureHash)), e.push(we(t.previousTenureHash)), e.push(we(t.burnViewHash)), e.push(we(t.previousTenureEnd)), e.push(wi(new Uint8Array(4), t.previousTenureBlocks)), e.push(X4(new Uint8Array(1), t.cause)), e.push(we(t.publicKeyHash));
      break;
  }
  return Oe(e);
}
function b8(t) {
  switch (t.readUInt8Enum(_t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case _t.TokenTransfer:
      const n = Yn(t), r = gn(t.readBytes(8), !1), s = Cw(t);
      return h8(n, r, s);
    case _t.ContractCall:
      const i = Eo(t), o = Vn(t), a = Vn(t), c = [], u = t.readUInt32BE();
      for (let k = 0; k < u; k++) {
        const C = Yn(t);
        c.push(C);
      }
      return p8(i, o, a, c);
    case _t.SmartContract:
      const h = Vn(t), l = Vn(t, 4, 1e5);
      return M0(h, l);
    case _t.VersionedSmartContract: {
      const k = t.readUInt8Enum(Gu, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), C = Vn(t), N = Vn(t, 4, 1e5);
      return M0(C, N, k);
    }
    case _t.PoisonMicroblock:
      return g8();
    case _t.Coinbase: {
      const k = t.readBytes(ni);
      return P0(k);
    }
    case _t.CoinbaseToAltRecipient: {
      const k = t.readBytes(ni), C = Yn(t);
      return P0(k, C);
    }
    case _t.NakamotoCoinbase: {
      const k = t.readBytes(ni), C = Yn(t), N = t.readBytes(zu);
      return y8(k, C, N);
    }
    case _t.TenureChange:
      const y = Ot(t.readBytes(20)), g = Ot(t.readBytes(20)), S = Ot(t.readBytes(20)), v = Ot(t.readBytes(32)), T = t.readUInt32BE(), U = t.readUInt8Enum(qu, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), F = Ot(t.readBytes(20));
      return w8(y, g, S, v, T, U, F);
  }
}
class gl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Xs extends gl {
  constructor(e) {
    super(e);
  }
}
class Pn extends gl {
  constructor(e) {
    super(e);
  }
}
class Nc extends gl {
  constructor(e) {
    super(e);
  }
}
class ti extends gl {
  constructor(e) {
    super(e);
  }
}
var nr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(nr || (nr = {}));
function Wu(t) {
  return ww(Ot(t.readBytes(hl)));
}
function ro(t, e) {
  return {
    pubKeyEncoding: t,
    type: yt.TransactionAuthField,
    contents: e
  };
}
function m8(t) {
  const e = t.readUInt8Enum(nr, (n) => {
    throw new Pn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case nr.PublicKeyCompressed:
      return ro(Se.Compressed, Xu(t));
    case nr.PublicKeyUncompressed:
      return ro(Se.Uncompressed, l8(Xu(t).data));
    case nr.SignatureCompressed:
      return ro(Se.Compressed, Wu(t));
    case nr.SignatureUncompressed:
      return ro(Se.Uncompressed, Wu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function fd(t) {
  return we(t.data);
}
function x8(t) {
  const e = [];
  switch (t.contents.type) {
    case yt.PublicKey:
      e.push(t.pubKeyEncoding === Se.Compressed ? nr.PublicKeyCompressed : nr.PublicKeyUncompressed), e.push(Pc(c8(t.contents.data)));
      break;
    case yt.MessageSignature:
      e.push(t.pubKeyEncoding === Se.Compressed ? nr.SignatureCompressed : nr.SignatureUncompressed), e.push(fd(t.contents));
      break;
  }
  return Oe(e);
}
function Or(t) {
  switch (t.type) {
    case yt.Address:
      return ba(t);
    case yt.Principal:
      return Lw(t);
    case yt.LengthPrefixedString:
      return Ao(t);
    case yt.MemoString:
      return v8(t);
    case yt.AssetInfo:
      return Tw(t);
    case yt.PostCondition:
      return k8(t);
    case yt.PublicKey:
      return Pc(t);
    case yt.LengthPrefixedList:
      return pd(t);
    case yt.Payload:
      return Iw(t);
    case yt.TransactionAuthField:
      return x8(t);
    case yt.MessageSignature:
      return fd(t);
  }
}
function S8() {
  return {
    type: yt.Address,
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
      return Go(t, R8(r[0].data));
    case ce.SerializeP2WPKH:
      return Go(t, z8(r[0].data));
    case ce.SerializeP2SH:
    case ce.SerializeP2SHNonSequential:
      return Go(t, G8(n, r.map(Pc)));
    case ce.SerializeP2WSH:
    case ce.SerializeP2WSHNonSequential:
      return Go(t, K8(n, r.map(Pc)));
  }
}
function ba(t) {
  const e = [];
  return e.push(we(wa(t.version, 1))), e.push(we(t.hash160)), Oe(e);
}
function Eo(t) {
  const e = fl(Ot(t.readBytes(1))), n = Ot(t.readBytes(20));
  return { type: yt.Address, version: e, hash160: n };
}
function Lw(t) {
  const e = [];
  return e.push(t.prefix), e.push(ba(t.address)), t.prefix === oa.Contract && e.push(Ao(t.contractName)), Oe(e);
}
function E8(t) {
  const e = t.readUInt8Enum(oa, (s) => {
    throw new Pn(`Unexpected Principal payload type: ${s}`);
  }), n = Eo(t);
  if (e === oa.Standard)
    return { type: yt.Principal, prefix: e, address: n };
  const r = Vn(t);
  return {
    type: yt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function Ao(t) {
  const e = [], n = To(t.content), r = n.byteLength;
  return e.push(we(wa(r, t.lengthPrefixBytes))), e.push(n), Oe(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = fl(Ot(t.readBytes(e))), s = sd(t.readBytes(r));
  return bi(s, e, n ?? 128);
}
function A8(t) {
  return bi(t, 4, 1e5);
}
function N0(t) {
  if (t && Nw(t, Tc))
    throw new Error(`Memo exceeds maximum length of ${Tc} bytes`);
  return { type: yt.MemoString, content: t };
}
function v8(t) {
  const e = [], n = To(t.content), r = j8(Ot(n), Tc * 2);
  return e.push(we(r)), Oe(e);
}
function Cw(t) {
  let e = sd(t.readBytes(Tc));
  return e = e.replace(/\u0000*$/, ""), { type: yt.MemoString, content: e };
}
function Tw(t) {
  const e = [];
  return e.push(ba(t.address)), e.push(Ao(t.contractName)), e.push(Ao(t.assetName)), Oe(e);
}
function Zu(t) {
  return {
    type: yt.AssetInfo,
    address: Eo(t),
    contractName: Vn(t),
    assetName: Vn(t)
  };
}
function hd(t, e) {
  return {
    type: yt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function pd(t) {
  const e = t.values, n = [];
  n.push(we(wa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Or(r));
  return Oe(n);
}
function Bw(t, e, n) {
  const r = fl(Ot(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case yt.Address:
        s.push(Eo(t));
        break;
      case yt.LengthPrefixedString:
        s.push(Vn(t));
        break;
      case yt.MemoString:
        s.push(Cw(t));
        break;
      case yt.AssetInfo:
        s.push(Zu(t));
        break;
      case yt.PostCondition:
        s.push($8(t));
        break;
      case yt.PublicKey:
        s.push(Xu(t));
        break;
      case yt.TransactionAuthField:
        s.push(m8(t));
        break;
    }
  return hd(s, n);
}
function k8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Lw(t.principal)), (t.conditionType === En.Fungible || t.conditionType === En.NonFungible) && e.push(Tw(t.assetInfo)), t.conditionType === En.NonFungible && e.push(Ne(t.assetName)), e.push(t.conditionCode), t.conditionType === En.STX || t.conditionType === En.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Xs("The post-condition amount may not be larger than 8 bytes");
    e.push(Ns(t.amount, !1, 8));
  }
  return Oe(e);
}
function $8(t) {
  const e = t.readUInt8Enum(En, (o) => {
    throw new Pn(`Could not read ${o} as PostConditionType`);
  }), n = E8(t);
  let r, s, i;
  switch (e) {
    case En.STX:
      return r = t.readUInt8Enum(ia, (a) => {
        throw new Pn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ot(t.readBytes(8))}`), {
        type: yt.PostCondition,
        conditionType: En.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case En.Fungible:
      return s = Zu(t), r = t.readUInt8Enum(ia, (a) => {
        throw new Pn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ot(t.readBytes(8))}`), {
        type: yt.PostCondition,
        conditionType: En.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case En.NonFungible:
      s = Zu(t);
      const o = Yn(t);
      return r = t.readUInt8Enum(Ku, (a) => {
        throw new Pn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: yt.PostCondition,
        conditionType: En.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Cr(t, e) {
  return Oe([t, e]);
}
function I8(t) {
  return new Uint8Array([t.type]);
}
function L8(t) {
  return t.type === Q.OptionalNone ? new Uint8Array([t.type]) : Cr(t.type, Ne(t.value));
}
function C8(t) {
  const e = new Uint8Array(4);
  return wi(e, t.buffer.length, 0), Cr(t.type, dl(e, t.buffer));
}
function T8(t) {
  const e = rd(O4(t.value, BigInt(Q4)), uw);
  return Cr(t.type, e);
}
function B8(t) {
  const e = rd(t.value, uw);
  return Cr(t.type, e);
}
function M8(t) {
  return Cr(t.type, ba(t.address));
}
function P8(t) {
  return Cr(t.type, dl(ba(t.address), Ao(t.contractName)));
}
function N8(t) {
  return Cr(t.type, Ne(t.value));
}
function _8(t) {
  const e = [], n = new Uint8Array(4);
  wi(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ne(r);
    e.push(s);
  }
  return Cr(t.type, Oe(e));
}
function U8(t) {
  const e = [], n = new Uint8Array(4);
  wi(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = bi(s);
    e.push(Ao(i));
    const o = Ne(t.data[s]);
    e.push(o);
  }
  return Cr(t.type, Oe(e));
}
function Mw(t, e) {
  const n = [], r = e == "ascii" ? cw(t.data) : To(t.data), s = new Uint8Array(4);
  return wi(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, Oe(n));
}
function O8(t) {
  return Mw(t, "ascii");
}
function H8(t) {
  return Mw(t, "utf8");
}
function Ne(t) {
  switch (t.type) {
    case Q.BoolTrue:
    case Q.BoolFalse:
      return I8(t);
    case Q.OptionalNone:
    case Q.OptionalSome:
      return L8(t);
    case Q.Buffer:
      return C8(t);
    case Q.UInt:
      return B8(t);
    case Q.Int:
      return T8(t);
    case Q.PrincipalStandard:
      return M8(t);
    case Q.PrincipalContract:
      return P8(t);
    case Q.ResponseOk:
    case Q.ResponseErr:
      return N8(t);
    case Q.List:
      return _8(t);
    case Q.Tuple:
      return U8(t);
    case Q.StringASCII:
      return O8(t);
    case Q.StringUTF8:
      return H8(t);
    default:
      throw new Xs("Unable to serialize. Invalid Clarity Value.");
  }
}
function D8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const _0 = /* @__PURE__ */ new Map();
function Pw(t, e) {
  const n = _0.get(t);
  if (n !== void 0)
    return n(e);
  const r = D8(t);
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
    return q4(this.readBytes(4), 0);
  }
  readUInt8() {
    return Y4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return K4(this.readBytes(2), 0);
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
    e = new qo(we(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new qo(t) : e = t;
  switch (e.readUInt8Enum(Q, (r) => {
    throw new Pn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Q.Int:
      return t8(e.readBytes(16));
    case Q.UInt:
      return vr(e.readBytes(16));
    case Q.Buffer:
      const r = e.readUInt32BE();
      return Ew(e.readBytes(r));
    case Q.BoolTrue:
      return xw();
    case Q.BoolFalse:
      return Sw();
    case Q.PrincipalStandard:
      const s = Eo(e);
      return Wk(s);
    case Q.PrincipalContract:
      const i = Eo(e), o = Vn(e);
      return mw(i, o);
    case Q.ResponseOk:
      return n8(Yn(e));
    case Q.ResponseErr:
      return e8(Yn(e));
    case Q.OptionalNone:
      return Aw();
    case Q.OptionalSome:
      return vw(Yn(e));
    case Q.List:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Yn(e));
      return r8(c);
    case Q.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Vn(e).content;
        if (T === void 0)
          throw new Pn('"content" is undefined');
        h[T] = Yn(e);
      }
      return mi(h);
    case Q.StringASCII:
      const l = e.readUInt32BE(), y = j4(e.readBytes(l));
      return tn(y);
    case Q.StringUTF8:
      const g = e.readUInt32BE(), S = sd(e.readBytes(g));
      return s8(S);
    default:
      throw new Pn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const F8 = (t) => t.length % 2 == 0 ? t : `0${t}`, j8 = (t, e) => t.padEnd(e, "0"), Nw = (t, e) => t ? To(t).length > e : !1;
function Qu(t) {
  return Jg(t);
}
const aa = (t) => yk(ld(t)), gd = (t) => Ot(Yk(t)), R8 = (t) => Ot(aa(t)), z8 = (t) => {
  const e = aa(t), n = dl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = aa(n);
  return Ot(r);
}, G8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Oe(n), s = aa(r);
  return Ot(s);
}, K8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Oe(n), s = ld(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Oe(i), a = aa(o);
  return Ot(a);
};
function V8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function _w(t) {
  const e = Ne(t);
  return `0x${Ot(e)}`;
}
function Y8(t) {
  return Yn(t);
}
const io = (t) => {
  try {
    return $i.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function yd() {
  return {
    type: yt.MessageSignature,
    data: Ot(new Uint8Array(hl))
  };
}
function Uw(t, e, n, r) {
  const s = dd(0, t, 1, [So(e)]).hash160, i = Bo(So(e)) ? Se.Compressed : Se.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: gn(n, !1),
    fee: gn(r, !1),
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
function X8(t) {
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
function q8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    Ns(t.nonce, !1, 8),
    Ns(t.fee, !1, 8),
    t.keyEncoding,
    fd(t.signature)
  ];
  return Oe(e);
}
function W8(t) {
  const e = [
    t.hashMode,
    we(t.signer),
    Ns(t.nonce, !1, 8),
    Ns(t.fee, !1, 8)
  ], n = hd(t.fields);
  e.push(pd(n));
  const r = new Uint8Array(2);
  return V4(r, t.signaturesRequired, 0), e.push(r), Oe(e);
}
function Z8(t, e) {
  const n = Ot(e.readBytes(20)), r = BigInt(`0x${Ot(e.readBytes(8))}`), s = BigInt(`0x${Ot(e.readBytes(8))}`), i = e.readUInt8Enum(Se, (a) => {
    throw new Pn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.SerializeP2WPKH && i != Se.Compressed)
    throw new Pn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function Q8(t, e) {
  const n = Ot(e.readBytes(20)), r = BigInt("0x" + Ot(e.readBytes(8))), s = BigInt("0x" + Ot(e.readBytes(8))), i = Bw(e, yt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case yt.PublicKey:
        Bo(u.contents) || (o = !0);
        break;
      case yt.MessageSignature:
        if (u.pubKeyEncoding === Se.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ti("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.SerializeP2WSH || t === ce.SerializeP2WSHNonSequential))
    throw new ti("Uncompressed keys are not allowed in this hash mode");
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
  return ca(t) ? q8(t) : W8(t);
}
function Fl(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new Pn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.SerializeP2PKH || e === ce.SerializeP2WPKH ? Z8(e, t) : Q8(e, t);
}
function Ow(t, e, n, r) {
  const i = t + Ot(new Uint8Array([e])) + Ot(Ns(n, !1, 8)) + Ot(Ns(r, !1, 8));
  if (we(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return gd(we(i));
}
function Hw(t, e, n) {
  const r = 33 + hl, s = Bo(e) ? Se.Compressed : Se.Uncompressed, i = t + F8(s.toString(16)) + n.data, o = we(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return gd(o);
}
function J8(t, e, n, r, s) {
  const i = Ow(t, e, n, r), o = f8(s, i), a = d8(s), c = Hw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Dw(t, e, n, r, s, i) {
  const o = Ow(t, e, n, r), a = So(i8(o, i, s)), c = Hw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function t$() {
  const t = Uw(ce.SerializeP2PKH, "", 0, 0);
  return t.signer = S8().hash160, t.keyEncoding = Se.Compressed, t.signature = yd(), t;
}
function H0(t, e, n) {
  return ca(t) ? e$(t, e, n) : n$(t, e, n);
}
function e$(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Dw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = dd(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ti(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function n$(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case yt.PublicKey:
        Bo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case yt.MessageSignature:
        c.pubKeyEncoding === Se.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Dw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (U0(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new ti("Too many signatures");
        break;
    }
  if (U0(t.hashMode) && o !== t.signaturesRequired || X8(t.hashMode) && o < t.signaturesRequired)
    throw new ti("Incorrect number of signatures");
  if (i && (t.hashMode === ce.SerializeP2WSH || t.hashMode === ce.SerializeP2WSHNonSequential))
    throw new ti("Uncompressed keys are not allowed in this hash mode");
  const a = dd(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ti(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Fw(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function jw(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Uw(ce.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function D0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return Fw(O0(t.spendingCondition));
      case Le.Sponsored:
        return jw(O0(t.spendingCondition), t$());
      default:
        throw new Nc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function r$(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return H0(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return H0(t.spendingCondition, e, Le.Standard);
    default:
      throw new Nc("Invalid origin auth type");
  }
}
function s$(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: gn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: gn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function i$(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: gn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function o$(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: gn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function a$(t, e) {
  const n = {
    ...e,
    nonce: gn(e.nonce, !1),
    fee: gn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function c$(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(Dl(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(Dl(t.spendingCondition)), e.push(Dl(t.sponsorSpendingCondition));
      break;
  }
  return Oe(e);
}
function l$(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new Pn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = Fl(t), Fw(n);
    case Le.Sponsored:
      n = Fl(t);
      const r = Fl(t);
      return jw(n, r);
  }
}
class u$ {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: gn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? W4, this.postConditionMode = i ?? xo.Deny, this.postConditions = s ?? hd([]), o)
      this.anchorMode = ek(o);
    else
      switch (r.payloadType) {
        case _t.Coinbase:
        case _t.CoinbaseToAltRecipient:
        case _t.NakamotoCoinbase:
        case _t.PoisonMicroblock:
        case _t.TenureChange:
          this.anchorMode = Sn.OnChainOnly;
          break;
        case _t.ContractCall:
        case _t.SmartContract:
        case _t.VersionedSmartContract:
        case _t.TokenTransfer:
          this.anchorMode = Sn.Any;
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
    return r$(this.auth, this.verifyBegin());
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
      n.fields.push(ro(r ? Se.Compressed : Se.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = J8(n, r, e.fee, e.nonce, s);
    return ca(e) ? e.signature = i : e.fields.push(ro(s.data.byteLength === lw ? Se.Compressed : Se.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return gd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Nc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = a$(this.auth, e);
  }
  setFee(e) {
    this.auth = s$(this.auth, e);
  }
  setNonce(e) {
    this.auth = i$(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Nc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = o$(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Xs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Xs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Xs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Xs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Xs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return wi(n, this.chainId, 0), e.push(n), e.push(c$(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(pd(this.postConditions)), e.push(Iw(this.payload)), Oe(e);
  }
}
function _c(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new qo(we(t.slice(2))) : e = new qo(we(t)) : t instanceof Uint8Array ? e = new qo(t) : e = t;
  const n = e.readUInt8Enum(Bc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = l$(e), i = e.readUInt8Enum(Sn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(xo, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Bw(e, yt.PostCondition), c = b8(e);
  return new u$(n, s, c, a, o, i, r);
}
const f$ = Qk, Wo = vr, d$ = Ew;
const h$ = /* @__PURE__ */ new Set([4001, -31001]), p$ = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], g$ = ["result", "data", "payload", "response", "params"], F0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], yl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ti = () => {
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
}, y$ = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Rw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => y$(i, r)) === s
  );
}, zw = (t) => t ? Rw(Ti()).some(
  (e) => {
    var n;
    return e.id === t && (yl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Gw = () => {
  if (typeof window > "u")
    return;
  const t = Ti(), e = Rw(t).filter(
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
  for (const n of p$) {
    const r = Kr(t, n) ?? (t === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, w$ = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ti(), n = Kr(e, t) ?? (e === window ? void 0 : Kr(window, t)) ?? nl(t);
  if (n)
    return n;
  if (yl(t) || zw(t))
    return Gw();
}, Wa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, b$ = ["blockstack-session", "blockstack"], m$ = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of b$) {
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
m$();
const Kw = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Mn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, x$ = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Kw(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, S$ = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Kw(e);
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
}, ri = (t) => {
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
}, Vw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && h$.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, xi = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Mn(n == null ? void 0 : n.message) ?? Mn(e.message) ?? Mn(e.error) ?? Mn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, vo = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw xi(e);
    if (e.status === "error")
      throw xi(e.result ?? e);
  }
  return t;
}, R0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return vo(r);
  } catch (r) {
    throw xi(r);
  }
}, Yw = () => Gw(), wd = () => {
  if (typeof window > "u")
    return;
  const t = Ti();
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
  const e = Ti();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Kr(e, n) ?? (e === window ? void 0 : Kr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, lc = (t) => {
  var r, s;
  const e = ui();
  if (yl(e) || zw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ti() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Yw();
}, jl = (t) => {
  const e = S$(t);
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
  const n = jl(t), r = x$(t) ?? n;
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
  for (const a of g$) {
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
}, E$ = (t) => {
  const e = Uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, A$ = (t) => ({
  ...t,
  fee: ri(t.fee),
  nonce: ri(t.nonce),
  sponsored: t.sponsored === !0
}), G0 = (t) => ({
  recipient: t.recipient,
  amount: ri(t.amount) ?? "0",
  memo: t.memo,
  network: Ju(t.network),
  address: t.stxAddress,
  fee: ri(t.fee),
  nonce: ri(t.nonce),
  sponsored: t.sponsored ?? !1
}), Xw = "WALLET_ADDRESS_MISMATCH", v$ = 45e3;
let Zo = null;
const tf = (t) => {
  t && (Zo = { address: t, at: Date.now() });
}, k$ = () => {
  Zo = null;
}, $$ = () => Zo && Date.now() - Zo.at <= v$ ? Zo.address : null, I$ = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, L$ = async (t) => {
  k$();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = vo(await t.request("wallet_connect")), n = la(e);
  return tf(n), n;
}, C$ = async (t, e, n, r) => {
  try {
    return vo(await t.request(e, n));
  } catch (s) {
    const i = xi(s);
    if (!I$(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await L$(t);
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
        { code: o ? Xw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return vo(await t.request(e, n));
    } catch (a) {
      throw xi(a);
    }
  }
};
let K0 = 3e4;
const T$ = (t, e) => {
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
}, B$ = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Xw }
      );
    return c;
  }, s = $$();
  if (s)
    return Wa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Wa(n, "account-read");
  try {
    const c = vo(
      await T$(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = la(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Vw(c))
      throw xi(c);
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
    }), xi(c);
  }
  const a = la(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return tf(a), r(a, "wallet_connect");
}, M$ = async (t, e) => {
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
  const r = Yw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await B$(r, e.stxAddress);
  const s = await C$(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: ri(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: ri(e.fee) } : {}
    },
    e.stxAddress
  );
  return Rl(s);
}, P$ = () => ui(), qw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ui(), e = t ? w$(t) : void 0;
  if (e)
    return e;
  const n = Ti() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, V0 = (t, e) => {
  const n = qw(), r = A$({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, E$(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Va(r, e);
  if (lc(n) && !wd()) {
    const s = z0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ui(),
        route: "legacy-transaction-request"
      }), Va(r, s);
  }
  return void M$(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (j0(s) && lc(n)) {
      const a = z0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ui(),
          route: "legacy-transaction-request"
        }), Va(r, a);
        return;
      }
    }
    if (j0(s) && !lc(n)) {
      Va(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Vw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, N$ = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), Y0 = (t) => _w(t).replace(/^0x/, ""), X0 = "This wallet cannot sign messages. Try Xverse or Leather.", q0 = (t) => typeof (t == null ? void 0 : t.request) == "function", W0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", _$ = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, U$ = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function O$(t, e) {
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
async function H$(t, e) {
  const n = await T4({
    domain: e.domain,
    message: e.message,
    network: ul(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? N$()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Z0(t) {
  var s, i;
  const e = P$() || "", n = /xverse/i.test(e);
  let r = qw();
  if (n && !W0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (W0(r))
    try {
      return await H$(r, t);
    } catch (o) {
      if (n || !q0(r) || !U$(o)) throw o;
    }
  if (!n && q0(r))
    try {
      return await O$(r, t);
    } catch (o) {
      throw _$(o) ? new Error(X0) : o;
    }
  throw new Error(X0);
}
const Q0 = 1000000n, Ls = 1000000n, Oc = 50n, _e = 3000n, or = 300n, Ho = 3000n, D$ = 50000n, zl = 200n, wl = 15000n, cn = (t) => t + Oc;
function tr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / Q0}.${(n % Q0).toString().padStart(6, "0")}`;
}
function J0(t, e = or) {
  return t <= _e ? 0 : Number((t - _e) / cn(e));
}
function Gl(t, e = 0n) {
  const n = Ls - t - e;
  return n > 0n ? n : 0n;
}
function F$(t, e = or) {
  return t > Ls ? "over" : t < _e + cn(e) ? "empty" : t < D$ ? "low" : "ok";
}
const j$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", R$ = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", z$ = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function G$(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || z$.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== j$ + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Ww = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Kl = 3, K$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [ef, Zw] = Ww.split("."), zn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function nf(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function V$(t) {
  return zn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Ms(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function Qw(t, e = []) {
  const n = await Ms(`/v2/contracts/call-read/${ef}/${Zw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: ef, arguments: e.map((r) => "0x" + zn(Ne(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return xr(Yn(n.result));
}
async function Y$() {
  const t = await Ms(`/v2/contracts/source/${ef}/${Zw}?proof=0`);
  if (typeof t.source != "string" || await V$(t.source) !== R$) throw Error("Deployed source does not match the tested helper.");
  if (G$(await Qw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function Jw(t) {
  return t.startsWith("SP") && io(t) && !t.includes(".");
}
async function X$(t) {
  var r;
  if (!Jw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Ms(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Ms(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function q$(t) {
  const e = await Ms(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function W$(t, e) {
  var s, i;
  const n = await Qw("get-owner", [Wo(t), Wo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !Jw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function Z$(t, e) {
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
async function Q$(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function J$(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = _c(nf(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || no(Go(Mc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || no(r.contractAddress) + "." + r.contractName.content !== Ww || r.functionName.content !== "play" || r.functionArgs.length !== 3 || zn(Ne(r.functionArgs[0])) !== zn(Ne(Wo(t.core))) || zn(Ne(r.functionArgs[1])) !== zn(Ne(Wo(t.song))) || zn(Ne(r.functionArgs[2])) !== zn(Ne(d$(nf(t.id)))) || t.amount !== "50" || e.postConditionMode !== xo.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ia.Equal || i.principal.prefix !== 2 || no(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || no(r.contractAddress) + "." + r.contractName.content !== K$ || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || zn(Ne(r.functionArgs[0])) !== zn(Ne(Wo(t.song))) || typeof t.liked != "boolean" || zn(Ne(r.functionArgs[1])) !== zn(Ne(f$(t.liked))) || t.amount !== "0" || e.postConditionMode !== xo.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || xr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const t5 = "xtrata.xyz/radio/listening-wallet", e5 = "Link a temporary listening wallet for pay-per-play; no spending permission", Rr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && io(t), n5 = (t) => ({
  domain: mi({ name: tn(t5), version: tn("1"), "chain-id": vr(1) }),
  message: mi({
    purpose: tn(e5),
    main: tn(t.main),
    listening: tn(t.listening),
    issued: vr(t.issued)
  })
}), tb = 100000n, r5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function s5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Rr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= tb).sort(r5);
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
async function i5(t, e, n = 4) {
  if (!Rr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Za}&offset=${o}`, s = Hc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Za);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Za ? s : Hc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = s5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Za);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const _r = 50, o5 = 6, a5 = 20, tp = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
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
async function c5(t, e, n) {
  if (!Rr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Hc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${_r}&offset=0`));
    if (!s || s.total > o5 * _r) return { ok: !1 };
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
      if (!a || a.total > a5 * _r) return { ok: !1 };
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
function l5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(tp).map((l, y) => {
    const g = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: g, kind: "gift", to: r.payer, at: y } : Rr(l.sender) && g >= tb ? { sender: l.sender, left: g, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: g, kind: "dust", to: null, at: y };
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
function u5(t, e) {
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
const uc = [100, 250, 500], f5 = (t, e) => BigInt(t) * cn(e), Do = ["prepared", "signed", "unknown", "pending"], d5 = 30 * 6e4, Dc = 6e4, Xi = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, h5 = 3e3, Fc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Vl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function p5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, h = !1, l = !1, y = !1, g = null, S = !1, v = "", T = "", U = 0, F, k = null, C, N = [], Y, it = -1 / 0;
  const q = /* @__PURE__ */ new Set();
  let X = null, $ = !1, _ = 0, m = null, P = null, K = !1, B = null, st = !1, W = null, kt = !1, L = !1, D = !1, lt = !1, ot = !1, ut = 0, Nt = null, te = Promise.resolve();
  const $t = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? or.toString()), Vt = (p) => !!i && !(i.features ?? []).includes(p), vt = (p, A) => `xtrata.ppp.v1.${p}:${A}`, He = "xtrata.ppp.v1.as-main", Ht = () => {
    if (t.main()) return;
    const p = t.store.get(He);
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
  }, vn = (p = i == null ? void 0 : i.address) => !!p && t.store.get(vt("on", p)) !== "0", yn = (p) => {
    i != null && i.address && t.store.set(vt("on", i.address), p ? "1" : "0");
  }, Te = () => jt().filter((p) => Do.includes(p.status)), Xe = () => Ae() ? [...Te(), ...jt(ee()).filter((p) => Do.includes(p.status))] : Te(), Ke = () => qe(i == null ? void 0 : i.address), qe = (p) => {
    if (!p) return null;
    try {
      return JSON.parse(t.store.get(vt("deposit", p)) || "null");
    } catch {
      return null;
    }
  }, Ee = (p, A = i == null ? void 0 : i.address) => {
    A && t.store.set(vt("deposit", A), JSON.stringify(p));
  };
  let Wt = null;
  const Ve = (p = Dc) => {
    const A = t.now();
    Wt = { since: Wt && A < Wt.until ? Wt.since : A, until: Math.max((Wt == null ? void 0 : Wt.until) ?? 0, A + p) };
  }, kn = () => !!Wt && t.now() < Wt.until && (o === void 0 || o < _e + cn($t())), We = () => !!Ke() || kn(), ee = () => Vt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), Ae = () => !!(i != null && i.address) && ee() !== i.address, ar = () => Ae() ? c && c.for === ee() ? c.value : void 0 : o, I = (p) => p !== void 0 && p < _e + zl, G = () => Te().filter((p) => t.now() - p.created > d5 && q.has(p.txid)), x = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Lt() || r === Lt() && !e.allowed), O = () => x() && !(i != null && i.linked), at = () => {
    const p = Lt();
    return !O() && !!p && !!(i != null && i.linked) && i.linked !== p;
  }, St = (p) => vt("return-to", p), ne = (p = i == null ? void 0 : i.address) => {
    if (!p) return;
    const A = t.store.get(St(p));
    return A && Rr(A) && A !== p ? A : void 0;
  }, Rt = (p = i == null ? void 0 : i.address) => X && X.for === p ? X.res : null;
  function ue() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const p = ne();
    if (p) return { to: p, kind: "chosen" };
    const A = Rt();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const he = (p) => vt("gift", p);
  function zt() {
    const p = i == null ? void 0 : i.address;
    if (!p) return null;
    if ((B == null ? void 0 : B.for) === p) return B.info;
    try {
      const A = JSON.parse(t.store.get(he(p)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  async function Fe() {
    var ht;
    const p = i == null ? void 0 : i.address;
    if (!p || !t.giftInfo || !((ht = e == null ? void 0 : e.gifts) != null && ht.enabled) || st) return;
    const A = (B == null ? void 0 : B.for) === p ? B : null, j = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && t.now() - A.at < j) return;
    st = !0;
    const Z = zt();
    try {
      const H = await t.giftInfo(p);
      B = { for: p, info: H, ok: !0, at: t.now() }, t.store.set(he(p), JSON.stringify(H));
    } catch {
      B = { for: p, info: Z, ok: !1, at: t.now() };
    } finally {
      st = !1;
    }
  }
  const pt = () => jt().reduce((p, A) => Do.includes(A.status) ? p + BigInt(A.amount || "0") + BigInt(A.fee || "0") : p, 0n);
  function At() {
    if (o === void 0) return 0;
    const p = o - pt() - BigInt(ve.length) * cn($t());
    return p > 0n ? J0(p, $t()) : 0;
  }
  const Gt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", re = "EMPTY — ADD STX TO PLAY";
  function je() {
    if (!(e != null && e.here)) return null;
    const p = (A, j) => ({ reason: A, text: j });
    switch (Be()) {
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
        return We() ? p("arriving", "YOUR PLAYS ARE ARRIVING") : p("out", Ae() ? Gt : re);
      case "ready":
        return !vn() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? p("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : D ? At() < 1 ? p("out", Ae() ? Gt : re) : null : p("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const oe = () => {
    var p;
    return !!(i != null && i.address) && Ae() && !!((p = zt()) != null && p.player);
  };
  function wn() {
    return oe() ? { locked: !0, known: !0 } : null;
  }
  const nn = 3 * 6e4, Tr = () => !!zt() && !!t.history && !(i != null && i.linked);
  async function Bi() {
    const p = i.address, A = zt(), { balance: j, nonce: Z } = await t.chain.account(p), ht = await t.history(p, !0);
    if (!ht.ok) return null;
    const H = l5({ self: p, balance: j, inbound: ht.inbound, outgoing: ht.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!H.ok) return null;
    const ct = u5(H.parts, Ho);
    return { balance: j, nonce: Z, parts: H.parts, steps: ct.steps, tooSmall: ct.tooSmall.length };
  }
  const Xn = () => kt ? { state: "unavailable" } : !W || t.now() - W.at > nn || o !== void 0 && o !== W.balance ? { state: "none" } : W.plan;
  function Be() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const p = Lt();
    if (!O()) {
      if (!p) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : at() ? "wrong-wallet" : i.state === "known" ? "locked" : !O() && i.linked !== p ? "link" : o === void 0 ? "loading" : o > Ls ? "over" : o < _e + cn($t()) ? "fund" : "ready" : "loading";
  }
  const $n = () => {
    var p, A, j, Z, ht;
    return {
      step: Be(),
      busy: u,
      message: v,
      error: T,
      notice: Us(),
      gate: e,
      main: Lt(),
      mainConnected: !!t.main(),
      standIn: Ht(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : F$(o, $t()),
      playsLeft: o === void 0 ? 0 : J0(o, $t()),
      allowance: o === void 0 ? Ls : Gl(o, BigInt(((p = Ke()) == null ? void 0 : p.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: vn(),
      entries: jt(),
      depositTxid: ((A = Ke()) == null ? void 0 : A.txid) ?? F,
      depositPending: We(),
      arrival: We() ? { since: ((j = Ke()) == null ? void 0 : j.at) ?? (Wt == null ? void 0 : Wt.since) ?? t.now(), graceMs: Dc } : null,
      walletOutdated: Vt("like"),
      linkedListening: Y && Y === Lt() ? N.map((H) => H.listening) : [],
      serverLinked: !!k && C === `${Lt()}:${i == null ? void 0 : i.address}`,
      stuck: G().length,
      armed: lt,
      queued: ve.length,
      solo: O(),
      returnTo: (Z = ue()) == null ? void 0 : Z.to,
      returnToKind: (ht = ue()) == null ? void 0 : ht.kind,
      funderState: (() => {
        const H = Rt();
        return H ? H.ok ? H.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const H = Rt();
        return !!H && H.ok && H.distinct > 1;
      })(),
      walletCannotSolo: O() && Vt("standalone"),
      walletCannotMulti: Vt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((H) => H !== Lt() && H !== (i == null ? void 0 : i.linked)),
      creditedTo: O() && (i != null && i.address) && (m == null ? void 0 : m.for) === i.address && m.main ? m.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(vt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (P == null ? void 0 : P.for) === i.address && P.unused,
      gift: (() => {
        const H = zt();
        return H ? { player: H.player, from: H.from, source: H.source, amount: H.amount } : null;
      })(),
      giftPlays: zt() ? At() : 0,
      playCost: cn($t()),
      giftStop: je(),
      albumLock: wn(),
      returnPlan: Xn(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Vt("slots"),
      likeFunds: (() => {
        var tt;
        const H = ee();
        if (!H || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const ct = ar();
        return { address: H, balance: ct, low: I(ct), album: Ae(), pending: !!qe(H), txid: (tt = qe(H)) == null ? void 0 : tt.txid, main: Lt() };
      })()
    };
  }, Us = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Dt = (p, A = "") => {
    v = p, T = A, t.changed();
  };
  async function Ze(p, A) {
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
  const rn = () => !!(e != null && e.enabled) && e.here && (O() || !!Lt() && e.allowed), Os = () => rn() && !at(), cr = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", On = () => {
    if (at()) throw new Error(cr());
  };
  async function qr() {
    if (!rn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const be = (p) => {
    const A = Lt();
    return p.request("listening.status", A ? { main: A } : void 0);
  };
  async function bn(p = !1) {
    i != null && i.address && (!p && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Hs(p)));
  }
  async function Hs(p = !1) {
    const A = ee();
    if (!(!Ae() || !A || (i == null ? void 0 : i.state) !== "unlocked") && !(!p && (c == null ? void 0 : c.for) === A && t.now() - c.at < 3e4))
      try {
        c = { for: A, value: await t.chain.balance(A), at: t.now() };
      } catch {
      }
  }
  async function Mo(p) {
    if ((Y !== p || t.now() - it >= 6e4) && (N = await t.links(p), Y = p, it = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === p) return;
    const A = `${p}:${i.address}`;
    C === A && k || (k = N.find((j) => j.listening === i.address) ?? null, C = A);
  }
  async function Po() {
    const p = i == null ? void 0 : i.address;
    if (!O() || !p || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const A = Rt(p);
    if (A != null && A.ok && A.funder) return;
    const j = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, _ - 1), 30 * 6e4);
    if (!(X && X.for === p && t.now() - X.at < j)) {
      $ = !0;
      try {
        X = { for: p, res: await t.funder(p), at: t.now() };
      } catch {
        X = { for: p, res: { ok: !1 }, at: t.now() };
      } finally {
        $ = !1;
      }
      _ = X.res.ok ? 0 : _ + 1;
    }
  }
  async function Ds() {
    const p = i == null ? void 0 : i.address;
    if (!(!O() || !p || i != null && i.linked || !t.mainOf || K) && !(m && m.for === p && (m.ok || t.now() - m.at < 6e4))) {
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
  async function Fs() {
    const p = i == null ? void 0 : i.address;
    if (!(!p || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (P == null ? void 0 : P.for) === p) && t.store.get(vt("created", p)) !== "1")
      try {
        P = { for: p, unused: await t.chain.confirmedNonce(p) === 0n };
      } catch {
      }
  }
  async function lr() {
    var ht;
    const p = i == null ? void 0 : i.address;
    if (!p) return !1;
    let A, j = !1;
    const Z = /* @__PURE__ */ new Map();
    for (const H of Xe())
      try {
        const ct = await t.chain.transaction(H.txid);
        if (!ct) {
          if (q.add(H.txid), t.now() - H.created > 15 * 6e4 && !Z.has(H.address) && Z.set(H.address, await t.chain.confirmedNonce(H.address)), A = Z.get(H.address), A !== void 0 && A > BigInt(H.nonce)) {
            le({ ...H, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((H.status === "unknown" || H.status === "signed") && H.raw)
            try {
              await t.chain.broadcast(H.raw, H.txid), le({ ...H, status: "pending" });
            } catch (gt) {
              Xi(gt) && le({ ...H, status: "failed", note: gt.message, raw: void 0 });
            }
          continue;
        }
        q.delete(H.txid);
        const tt = String(ct.tx_status);
        if (tt === "success" && ct.canonical !== !1 && ct.is_unanchored === !1) {
          if (le({ ...H, status: "confirmed", confirmedAt: t.now(), actualFee: String(ct.fee_rate ?? H.fee), raw: void 0 }), j = !0, H.kind === "like" && (S = !0, H.status !== "confirmed" && typeof H.liked == "boolean"))
            try {
              (ht = t.likeConfirmed) == null || ht.call(t, H.song, H.liked);
            } catch {
            }
        } else tt.startsWith("abort_") || tt.startsWith("dropped_") ? le({ ...H, status: "failed", note: tt, raw: void 0 }) : H.status !== "pending" && le({ ...H, status: "pending" });
      } catch {
      }
    for (const H of Ae() ? [p, ee()] : [p]) {
      const ct = qe(H);
      if (ct)
        try {
          const tt = await t.chain.transaction(ct.txid), gt = String((tt == null ? void 0 : tt.tx_status) ?? "");
          (gt === "success" && tt.is_unanchored === !1 || gt.startsWith("abort_") || gt.startsWith("dropped_") || !tt && t.now() - ct.at > 2 * 36e5) && (Ee(null, H), gt === "success" && Ve(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return j;
  }
  async function In(p = !1) {
    var A;
    try {
      const j = Lt();
      if ((p || !e || r !== j || t.now() - n > 3e5) && (e = await t.config(j), n = t.now(), r = j), !e.enabled || !e.here || !O() && (!j || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), lt && Wr(), t.changed();
        return;
      }
      await qr(), i = await be(s), at() && i.state === "unlocked" && (Pr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await be(s)), j && e.allowed && await Mo(j), await bn(p), await Po(), await Ds(), await Fs(), await Fe(), await lr() && await bn(!0), await Hs(), await Hn(), U = 0;
    } catch {
      U++;
    }
    if (Be() === "locked" ? Ni() : lt && Wr(), S) {
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
    if (!A || i != null && i.slot || !(i != null && i.address) || Vt("slots")) return;
    const j = Number(t.store.get(vt("slot", A)));
    if (!(!Number.isSafeInteger(j) || j < 1))
      try {
        const { balance: Z } = await t.chain.account(i.address);
        if (Z >= _e + cn($t())) return;
        await p.request("listening.openSlot", { slot: j }), i = await be(p), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function Pi(p, A) {
    var H;
    On();
    const j = !(i != null && i.address) || vn(i.address), Z = i != null && i.linked ? (H = t.nameOf) == null ? void 0 : H.call(t, i.linked) : void 0;
    await p.request("listening.unlock", { mode: "unlock", terms: j ? js() : void 0, anyPasskey: A, ...Lt() ? { main: Lt() } : {}, ...Z ? { label: Z } : {} }), i = await be(p), j && (vn(i.address) ? await ur() : await p.request("listening.stop")), await Mi(p), Dt(j ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ht = g;
    g = null, ht && t.now() - ht.at < 12e4 && setTimeout(() => void In(!0).then(() => z(ht)), 0);
  }
  function Ni() {
    lt || u || ot || ut >= 3 || !s || !(i != null && i.address) || (lt = !0, te = (async () => {
      try {
        await Pi(s, !1), ut = 0;
      } catch (p) {
        const A = p instanceof Error ? p.message : String(p);
        /Cancelled in the listening wallet/.test(A) ? Nt || (ot = !0, Dt("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ut++, T = A);
      } finally {
        lt = !1;
        const p = Nt;
        Nt = null, p ? await p() : await In(!0);
      }
    })());
  }
  async function Wr(p) {
    lt && (Nt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await te), p && await p(), t.changed();
  }
  const js = () => ({
    fee: $t().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ls.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function ur() {
    if (!(i != null && i.address)) return !1;
    if (D || (D = await t.tabLock(i.address)), !D)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function qn(p, A) {
    const j = i.address, { balance: Z, nonce: ht } = A ?? await t.chain.account(j);
    o = Z;
    const H = await s.request("listening.prepareReturn", {
      mode: p.mode,
      balance: Z.toString(),
      nonce: ht.toString(),
      fee: Ho.toString(),
      ...p.amount !== void 0 ? { amount: p.amount.toString() } : {},
      ...p.linked ? {} : { destination: p.to }
    });
    if (H.recipient !== p.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const ct = p.mode === "amount" ? p.amount : p.mode === "all" ? Z - Ho : Z - Ls - Ho, tt = _c(H.raw);
    if (xr(tt.payload.recipient).value !== p.to || String(tt.payload.amount) !== H.amount || ct !== void 0 && H.amount !== ct.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const gt = {
      id: Vl(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: H.recipient,
      amount: H.amount,
      fee: H.fee,
      nonce: ht.toString(),
      created: t.now(),
      status: "signed",
      raw: H.raw,
      txid: H.txid
    };
    t.validate(gt), le(gt);
    try {
      await t.chain.broadcast(H.raw, H.txid), le({ ...gt, status: "pending" });
    } catch (bt) {
      throw le({ ...gt, status: "unknown", note: bt.message }), bt;
    }
    return H;
  }
  const Rs = wl, Wn = Ho;
  async function _i(p, A, j) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Vt("slots") || Vt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const Z = i.slot ?? 0;
    if (p === A || ![p, A].includes(Z) || ![p, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ht = i.root ?? i.address, H = p === 0 ? ht : i.address, ct = A === 0 ? ht : i.address, { balance: tt, nonce: gt } = await t.chain.account(H);
    if (tt < j + Wn + _e) throw new Error(p === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const bt = await s.request("listening.signMove", { from: p, to: A, amount: j.toString(), fee: Wn.toString(), nonce: gt.toString(), balance: tt.toString() }), Xt = _c(bt.raw);
    if (bt.from !== H || bt.to !== ct || bt.amount !== j.toString() || xr(Xt.payload.recipient).value !== ct || String(Xt.payload.amount) !== j.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const ke = {
      id: Vl(),
      address: H,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: ct,
      amount: bt.amount,
      fee: bt.fee,
      nonce: gt.toString(),
      created: t.now(),
      status: "signed",
      raw: bt.raw,
      txid: bt.txid
    };
    t.validate(ke), le(ke);
    try {
      await t.chain.broadcast(bt.raw, bt.txid), le({ ...ke, status: "pending" });
    } catch (pe) {
      throw le({ ...ke, status: "unknown", note: pe.message }), pe;
    }
    return Ee({ txid: bt.txid, amount: bt.amount, at: t.now() }, ct), ct === ht && ht !== i.address ? c = null : a = -1 / 0, bt;
  }
  let fe = !1;
  const Ui = /* @__PURE__ */ new Map(), Br = (p) => vt("float", p);
  async function Hn() {
    if (fe || (i == null ? void 0 : i.state) !== "unlocked" || !Ae() || Vt("move") || Vt("rootLike") || !i.address) return;
    const p = i.address;
    if (t.store.get(Br(p)) === "1") return;
    const A = zt();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const j = ar();
    if (j === void 0 || o === void 0) return;
    if (!I(j)) {
      t.store.set(Br(p), "1");
      return;
    }
    if (qe(ee()) || Zr() || Xe().length || o < Rs * 4n + _e + Wn) return;
    const Z = Ui.get(p);
    if (!(Z && (Z.n >= 3 || t.now() - Z.at < 5 * 6e4))) {
      fe = !0, Ui.set(p, { n: ((Z == null ? void 0 : Z.n) ?? 0) + 1, at: t.now() });
      try {
        await _i(i.slot ?? 0, 0, Rs), t.store.set(Br(p), "1");
      } catch (ht) {
        console.warn("[radio] likes float not sent yet", ht);
      } finally {
        fe = !1;
      }
    }
  }
  async function Oi(p) {
    if (Te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Vt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await Bi().catch(() => null);
    if (!A)
      throw W = null, kt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    kt = !1, o = A.balance;
    const j = { balance: A.balance, nonce: A.nonce };
    if (p === "excess") {
      const tt = np(A.parts) ?? ne();
      if (!tt) throw new Error("Choose where to send the excess first.");
      await qn({ mode: "excess", to: tt, linked: !1 }, j), W = null, Dt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const Z = A.steps;
    if (!Z.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!W && W.balance === A.balance && t.now() - W.at <= nn && W.steps.length === Z.length && W.steps.every((tt, gt) => tt.to === Z[gt].to && tt.mode === Z[gt].mode && tt.send === Z[gt].send))) {
      W = {
        at: t.now(),
        balance: A.balance,
        steps: Z,
        parts: A.parts,
        plan: { state: "ready", steps: Z.map((tt) => ({ to: tt.to, kind: tt.kind, send: tt.send.toString() })), kept: A.tooSmall, excess: np(A.parts) }
      }, Dt(Z.length > 1 ? `This goes back in ${Z.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const H = Z[0], ct = H.to ?? ne();
    if (!ct) throw new Error("Choose where to send the rest first.");
    if (H.mode === "amount" && Vt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await qn({ mode: H.mode, to: ct, linked: !1, ...H.mode === "amount" ? { amount: H.send } : {} }, j), W = null, Z.length === 1 ? (yn(!1), Dt("Returned ✓ Paying is off.")) : Dt(`Returned ✓ ${Z.length - 1} more ${Z.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
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
        t.store.set(He, p ?? ""), T = "", v = "", o = void 0, a = -1 / 0, c = null, await In(!0);
      }
    },
    create: () => Ze("Waiting for your passkey…", async () => {
      const p = await qr();
      await p.request("listening.unlock", { mode: "create", terms: js(), ...t.main() ? { main: t.main() } : {} }), i = await be(p), i.address && t.store.set(vt("created", i.address), "1"), yn(!0), Dt(O() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await ur();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (p) => {
      p ? Ve() : Wt = null, t.changed();
    },
    giftSent: (p, A) => {
      !(i != null && i.address) || Ke() || (Ee({ txid: p, amount: A.toString(), at: t.now() }), a = -1 / 0, B = null, Dt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (p) => {
      if (On(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Vt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await qr()).request("listening.bindSlot", { slot: p, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (p, A, j, Z) => {
      Ee({ txid: j, amount: Z.toString(), at: t.now() }, A), B = null, await Dn.openAlbum(p), Dt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (p) => Ze("Opening…", async () => {
      if (On(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Vt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === p) return;
      Pr(), await s.request("listening.openSlot", { slot: p }), i = await be(s), o = void 0, a = -1 / 0, W = null, kt = !1;
      const A = i.root;
      A && p > 0 && t.store.set(vt("slot", A), String(p)), Dt(p === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (p = !1) => {
      const A = () => Ze("Waiting for your passkey…", async () => Pi(await qr(), p));
      return lt ? p ? Vt("cancel") ? (Dt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Wr(async () => {
        (Be() === "locked" || Be() === "intro") && await A();
      }) : te : A();
    },
    link: () => Ze("Sign in your wallet…", async () => {
      On();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const A = (await t.links(p)).find((j) => j.listening === i.address);
      if (A)
        await s.request("listening.link", { main: p, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const j = { main: p, listening: i.address, issued: t.now() }, Z = await t.signWithMain(p, n5(j)), ht = await s.request("listening.link", { main: p, issued: j.issued, mainSignature: Z });
        await t.saveLink({ ...j, mainSignature: Z, listeningSignature: ht.listeningSignature }), it = -1 / 0;
      }
      Dt("Linked ✓");
    }),
    deposit: () => Ze("Approve the deposit in your wallet…", async () => {
      On();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ke()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (kn()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await bn(!0);
      const A = Gl(o ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      F = await t.deposit(p, i.address, A), F && Ee({ txid: F, amount: A.toString(), at: t.now() }), Dt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Ze("Approve the top-up in your wallet…", async () => {
      On();
      const p = t.main(), A = ee();
      if (!p || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (qe(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const j = await t.chain.balance(A);
      Ae() ? c = { for: A, value: j, at: t.now() } : (o = j, a = t.now());
      const Z = Gl(j);
      if (Z <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ht = await t.deposit(p, A, Z);
      ht && Ee({ txid: ht, amount: Z.toString(), at: t.now() }, A), Dt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (p) => Ze("Adding plays…", async () => {
      if (On(), !Ae()) throw new Error("Open the album you want to add plays to first.");
      if (!uc.includes(p)) throw new Error("Choose one of the amounts offered.");
      const A = f5(p, $t());
      if (h || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Xe().length || Ke()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await _i(0, i.slot ?? 0, A), Dt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Ze("Confirm in the listening wallet…", async () => {
      if (!Os()) throw new Error("Connect your wallet first.");
      await ur(), await s.request("listening.approveSession", js()), yn(!0), Dt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Ze("Clearing…", async () => {
      for (const p of G())
        await t.chain.transaction(p.txid) || le({ ...p, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Dt("Cleared ✓");
    }),
    switchOff: () => Ze("Switching off…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.stop")), yn(!1), Dt("Music support is off. Playback is paused.");
    }),
    lock: () => Ze("Locking…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Dt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (p) => {
      const A = String(p ?? "").trim();
      if (!(i != null && i.address)) return Dt("", "Unlock the listening wallet first.");
      if (!Rr(A)) return Dt("", "Enter a standard mainnet address (it starts with SP).");
      if (A === i.address) return Dt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(St(i.address), A), Dt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(St(i.address), ""), t.changed();
    },
    returnFunds: (p) => Ze("Check the return in the listening wallet…", async () => {
      if (!Os()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Tr()) return Oi(p);
      const A = ue();
      if (!A) throw new Error(O() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && Vt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Te().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await qn({ mode: p, to: A.to, linked: A.kind === "linked" }), p === "all" && yn(!1), Dt(p === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ve = [], Hi = 10, Di = 30 * 6e4;
  let Mr = !1;
  const Zr = () => h || !!u || l || y, Pr = () => {
    ve.length && (ve.length = 0, t.changed());
  };
  async function f(p) {
    if (!ve.some((A) => A.id === p.id) && !jt().some((A) => A.id === p.id) && (ve.push({ ...p, at: t.now() }), ve.length > Hi && ve.shift()), Zr() || Te().length) {
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
          if (!ve.length || Zr() || await E(ve[0]) === "wait") return;
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
      const j = Be();
      if (j === "loading") return "wait";
      if (j !== "ready" || !vn() || !(i != null && i.session) || i.session.playsLeft < 1 || !D) return "done";
      if (Te().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const Z = i.address, { balance: ht, nonce: H } = await t.chain.account(Z);
      o = ht, a = t.now();
      const ct = await t.chain.owner(Kl, p.song);
      if (ct === Z || ct === Lt()) return "done";
      const tt = await s.request("listening.signPlay", {
        core: Kl,
        song: p.song,
        receipt: p.id,
        fee: $t().toString(),
        nonce: H.toString(),
        balance: ht.toString()
      }), gt = {
        id: p.id,
        address: Z,
        kind: "play",
        core: Kl,
        song: p.song,
        recipient: ct,
        amount: "50",
        fee: $t().toString(),
        nonce: H.toString(),
        created: t.now(),
        status: "signed",
        raw: tt.raw,
        txid: tt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(gt), le(gt);
      const bt = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`;
      try {
        await t.chain.broadcast(tt.raw, tt.txid), le({ ...gt, status: "pending" }), v = `♪ Paid ${bt}`, T = "";
      } catch (Xt) {
        le({ ...gt, status: Xi(Xt) ? "failed" : "unknown", note: Xt.message, ...Xi(Xt) ? { raw: void 0 } : {} }), T = Xt.message;
      }
      return i = await be(s), "done";
    } catch (j) {
      const Z = j instanceof Error ? j.message : "payment unavailable";
      return (A = zt()) != null && A.player ? (v = "Payment is taking a moment: " + Z, "wait") : (v = "This song played free: " + Z, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function d(p) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Be()) || Vt("like") ? !1 : (z(p), !0);
  }
  async function z(p) {
    const A = p.title ? `“${p.title}”` : `song #${p.song}`, j = (De) => {
      var Qe;
      T = De, v = "";
      try {
        (Qe = t.likeFailed) == null || Qe.call(t, p.song);
      } catch {
      }
      t.changed();
    }, Z = Ae(), ht = Be(), H = Lt(), ct = Z && (ht === "fund" || ht === "over") ? "ready" : ht, tt = O() ? ee() : H;
    if (ct === "locked") {
      g = { ...p, at: t.now() }, Dt(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (ct === "wrong-wallet") return j(cr());
    if (ct === "link") return j("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (O() && Vt("standalone")) return j("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (ct === "fund") return j("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (ct === "over") return j("Return the excess first: the listening wallet holds more than 1 STX.");
    if (Z) {
      await Hs(!0);
      const De = ar();
      if (I(De))
        return t.changed(), j(Fc);
    }
    if (ct !== "ready" || !tt) return j("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return j("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!D) return j("Pay-per-play is running in another tab. Like from that tab.");
    const gt = jt(ee()).find((De) => De.kind === "like" && De.song === p.song);
    if (gt && Do.includes(gt.status))
      return j(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (l) return j("One like at a time: your last one is still being sent.");
    if ((gt == null ? void 0 : gt.status) === "confirmed" && t.now() - (gt.confirmedAt ?? 0) < h5)
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
    const Xt = ee(), pe = ((gt == null ? void 0 : gt.status) === "confirmed" && typeof gt.liked == "boolean" && t.now() - (gt.confirmedAt ?? gt.created) < 5 * 6e4 ? gt.liked : void 0) ?? bt.includes(Xt);
    if (!pe && bt.some((De) => De !== Xt)) return j(O() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${bt.includes(H) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await ft({ song: p.song, liked: !pe, title: p.title, artist: p.artist });
  }
  async function ft(p) {
    var Z, ht, H;
    if (l) {
      Dt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const A = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`, j = t.wait ?? ((ct) => new Promise((tt) => setTimeout(tt, ct)));
    try {
      Dt(`${p.liked ? "Liking" : "Unliking"} ${A}…`);
      const ct = t.now() + 12e4;
      for (; h || (Ae() ? jt(ee()).some((pe) => Do.includes(pe.status)) : Te().length); ) {
        if (t.now() > ct) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await j(5e3), await In(!0);
      }
      if (!Ae() && Be() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const tt = ee(), { balance: gt, nonce: bt } = await t.chain.account(tt);
      if (Ae() ? c = { for: tt, value: gt, at: t.now() } : (o = gt, a = t.now()), I(gt)) throw new Error(Fc);
      const Xt = await s.request("listening.signLike", {
        song: p.song,
        liked: p.liked,
        fee: zl.toString(),
        nonce: bt.toString(),
        balance: gt.toString()
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
        raw: Xt.raw,
        txid: Xt.txid,
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(ke), le(ke);
      try {
        await t.chain.broadcast(Xt.raw, Xt.txid), le({ ...ke, status: "pending" }), v = `${p.liked ? "♥ Liked" : "Unliked"} ${A}`, T = "";
        try {
          (Z = t.likeSent) == null || Z.call(t, p.song, p.liked);
        } catch {
        }
      } catch (pe) {
        if (le({ ...ke, status: Xi(pe) ? "failed" : "unknown", note: pe.message, ...Xi(pe) ? { raw: void 0 } : {} }), T = pe.message, Xi(pe)) try {
          (ht = t.likeFailed) == null || ht.call(t, p.song);
        } catch {
        }
      }
      i = await be(s);
    } catch (ct) {
      T = "Like not sent: " + (ct instanceof Error ? ct.message : "the listening wallet is unavailable");
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
const eb = ["Connect", "Passkey", "Link & fund", "Listen"], nb = ["Passkey", "Add 1 STX", "Listen"], rf = (t) => t ? nb : eb;
function g5(t) {
  if (t.solo) return y5(t);
  const e = eb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function y5(t) {
  const e = nb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function w5(t, e) {
  return !e || e.at >= rf(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const b5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function m5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !b5(r.id)));
}
const x5 = {}, S5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, E5 = (t) => {
  const e = x5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, A5 = (t) => `/hiro/${t}`, v5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, k5 = (t) => {
  const e = E5(t);
  if (e)
    return [v5(e)];
  const n = S5[t];
  return typeof window < "u" ? [`${window.location.origin}${A5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, $5 = {}, rp = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, I5 = "xtrata.log.enabled", L5 = "xtrata.log.level", C5 = "xtrata.log.tags", T5 = "xtrata.log.dedupe", Qa = (t) => {
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
}, M5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, P5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, N5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, _5 = () => {
  const t = $5 ?? {}, e = Qa(I5) ?? t.VITE_LOG_ENABLED, n = Qa(L5) ?? t.VITE_LOG_LEVEL, r = Qa(C5) ?? t.VITE_LOG_TAGS, s = Qa(T5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: B5(e),
    level: M5(n) ?? "warn",
    tags: N5(r),
    dedupe: P5(s)
  };
}, U5 = (t, e, n) => !t.enabled || rp[n] < rp[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), O5 = (t, e, n, r) => {
  const s = _5();
  if (!U5(s, e, t) || D5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, H5 = /* @__PURE__ */ new Set();
let sp = null;
const D5 = (t, e, n, r, s) => (sp !== t && (H5.clear(), sp = t), !1), F5 = (t, e, n) => O5("debug", t, e, n), j5 = {}, R5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, z5 = (t) => {
  const e = j5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : R5[t];
}, G5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, K5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return G5.test(n) ? n : null;
}, V5 = (t) => t.replace(/\/+$/, ""), Y5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), ip = (t) => {
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
}, qi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, X5 = (t) => {
  var c, u;
  let e;
  try {
    e = xr(Y8(t));
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
  return !o || !a ? null : K5(`${o}.${a}`);
}, q5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${V5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [_w(bw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : X5(i.result);
}, W5 = async (t) => {
  const e = t.address.trim();
  if (!io(e))
    return null;
  const n = z5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of k5(t.network))
    try {
      return await q5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return F5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: Y5(r)
  }), null;
};
function Z5(t, e, n = {}) {
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
const rb = 10000n, bd = 1000000n, jc = 3000n, Q5 = (t, e) => `${t}#gift=${e}`, J5 = 100, Fo = (t, e = or) => t <= _e ? 0 : Number((t - _e) / cn(e)), fp = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), sb = "xtrata.xyz/radio/gifts", Yl = J5, t6 = "Create a prefunded Xtrata radio gift batch", e6 = (t) => ({
  domain: mi({ name: tn(sb), version: tn("1"), "chain-id": vr(1) }),
  message: mi({
    purpose: tn(t6),
    creator: tn(t.creator),
    count: vr(t.count),
    amount: vr(BigInt(t.amount)),
    label: tn(t.label),
    issued: vr(t.issued),
    ...t.player ? { player: tn(t.player) } : {}
  })
}), n6 = (t, e, n = or) => _e + BigInt(t) * cn(n) + (e ? wl : 0n), r6 = (t, e = or) => Number((bd - _e - (t ? wl : 0n)) / cn(e)), s6 = (t, e) => BigInt(t) * (e + jc);
function i6(t, e, n, r = or) {
  const s = n ? wl : 0n, i = e > _e + s ? e - _e - s : 0n, o = Number(i / cn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Oc,
    fees: BigInt(o) * r,
    reserve: _e,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jc,
    perCopy: e + jc,
    total: s6(t, e)
  };
}
const o6 = (t) => t >= rb && t <= bd, dp = 40, a6 = "Create an Xtrata radio gift player", c6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function hp(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && c6.test(t) : !n;
}
function l6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!hp(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!hp(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > dp) throw new Error(`A player holds 1 to ${dp} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const u6 = (t) => Sg(Ig(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), f6 = (t) => ({
  domain: mi({ name: tn(sb), version: tn("1"), "chain-id": vr(1) }),
  message: mi({
    purpose: tn(a6),
    admin: tn(t.admin),
    player: tn(t.hash),
    issued: vr(t.issued)
  })
}), zr = (t) => t.tracks.filter((e) => !e.hidden), d6 = (t) => t.tracks.find((e) => e.hidden) ?? null, h6 = [300, 500, 1e3], pp = 1800, Xl = /* @__PURE__ */ new Map();
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
      Xl.set(t, { ...a, until: Date.now() + pp });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Xl.delete(t), s();
      }, pp + 50);
    }
  }, i;
}
const Fr = (t, e, n, r, s) => g6(t, e, async () => await p6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Ks = "xtrata.radio.gift.incoming.v1", gp = (t) => "xtrata.radio.gift.mine.v1:" + t, yp = (t) => "xtrata.radio.gift.batches.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, yr = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ja = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Rn = (t) => tr(t).replace(/\.?0+$/, "");
function y6(t) {
  let e = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), G = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return G !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), fp(G) ? G : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(t.store.get(Ks) || "null");
      return fp(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Ks, JSON.stringify({ code: i, at: t.now() }));
    let I = 0;
    const G = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (x) => {
      const O = await x.json().catch(() => ({}));
      if (x.status === 404) {
        t.store.set(Ks, null), e = { ...e, error: (O == null ? void 0 : O.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!x.ok) throw new Error("busy");
      const at = O;
      e = { ...e, view: at, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(at.status) && t.store.set(Ks, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void G(), n(I++)));
    });
    G();
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
    const G = `${location.origin}${location.pathname}#gift=${I}`;
    return [Fr("gift-pass-on", "Copy the link to pass on", () => G, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Ks, null), t.changed();
  }, l = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let y = {};
  const g = (I) => {
    if (y.box) return y.box;
    const G = xt("div", "", "ppp-gift-check");
    y.box = G;
    const x = () => {
      const O = window.turnstile;
      !O || y.rendered || (y.rendered = !0, O.render(G, { sitekey: I, callback: (at) => {
        y.token = at, t.changed();
      }, "expired-callback": () => {
        y.token = void 0;
      } }));
    };
    if (window.turnstile) x();
    else {
      const O = document.createElement("script");
      O.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", O.async = !0, O.onload = x, document.head.append(O);
    }
    return G;
  }, S = (I) => {
    queueMicrotask(() => void I());
  };
  let v;
  async function T(I) {
    var O, at, St, ne, Rt, ue, he, zt, Fe;
    if (!e || e.claiming || !I.listening) return;
    const G = !!((O = e.view) != null && O.player);
    if (G && !I.root) return;
    e.claiming = !0, e.error = void 0, (at = t.claiming) == null || at.call(t, !0), t.changed();
    const x = async (pt) => {
      const At = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: y.token, ...pt })
      });
      return { res: At, r: await At.json().catch(() => ({})) };
    };
    try {
      let pt = 0, At = I.listening, Gt;
      if (G) {
        const oe = Number((St = await t.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : St.next);
        if (!Number.isSafeInteger(oe) || oe < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        pt = oe;
        for (let wn = 0; ; wn++) {
          const nn = await t.album.bind(pt);
          if (At = nn.address, Gt = await x({ wallet: At, binding: nn }), Gt.res.status === 409 && /just taken/.test(((ne = Gt.r) == null ? void 0 : ne.error) || "") && wn < 5) {
            pt += 1;
            continue;
          }
          break;
        }
      } else Gt = await x({ wallet: At });
      const { res: re, r: je } = Gt;
      if (re.status === 503 && /sending another gift/.test((je == null ? void 0 : je.error) || "")) {
        e.waiting = !0, (Rt = t.claiming) == null || Rt.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!re.ok) {
        const oe = String((je == null ? void 0 : je.error) || "");
        if (re.status === 404 || re.status === 410 || re.status === 409 && /already had a gift|brand-new|already have this album/.test(oe))
          throw t.store.set(Ks, null), new Error(oe || "This gift cannot be opened.");
        if (re.status === 429 || re.status === 403 || re.status === 400 && !/wallet number/i.test(oe)) throw new Error(oe || `Could not open the gift (${re.status}).`);
        const nn = /topping up/.test(oe) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(oe) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(oe) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(nn), { retry: !0, slow: /topping up|not paid for yet/.test(oe) });
      }
      e.done = !0, t.store.set(Ks, null), G ? await t.album.arrived(pt, At, je.txid, BigInt(je.amount)) : t.giftSent(je.txid, BigInt(je.amount));
    } catch (pt) {
      const At = pt, Gt = At.name === "TypeError" || At.name === "AbortError" || At.name === "TimeoutError" || /wallet number/i.test(At.message);
      if (At.retry || Gt) {
        const re = e.tries ?? 0;
        e.tries = re + 1, e.retry = { text: At.retry ? At.message : "Still sending your gift… the network is slow, trying again." }, (ue = t.claiming) == null || ue.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, At.slow ? 6e4 : n(re));
      } else
        e.error = At.message, (he = t.claiming) == null || he.call(t, !1);
      y.token = void 0;
      try {
        (Fe = (zt = window.turnstile) == null ? void 0 : zt.reset) == null || Fe.call(zt, y.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let U = null;
  function F(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== I.listening || t.now() - U.at > 3e4) {
      const x = I.listening;
      U = { ...(U == null ? void 0 : U.wallet) === x ? U : {}, wallet: x, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(x)).then((O) => {
        var at, St;
        (U == null ? void 0 : U.wallet) === x && (U.state = (at = O == null ? void 0 : O.gift) == null ? void 0 : at.state, U.problem = ((St = O == null ? void 0 : O.gift) == null ? void 0 : St.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const G = xt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return G.title = `Network reply: ${U.problem}`, [G];
  }
  function k(I, G, x = !1) {
    var ue, he;
    const O = G.player, at = BigInt(G.amount), St = x ? [] : [xt("p", `🎁 ${l(G)} sent you “${O.title}”${O.subtitle ? ` by ${O.subtitle}` : ""}: ${zr(O).length} ${zr(O).length === 1 ? "song" : "songs"} and ${Fo(at).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (x) return St;
      if (St.push(xt("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const zt = document.createElement("details");
        zt.className = "ppp-how";
        const Fe = document.createElement("summary");
        Fe.textContent = "How does this work?", zt.append(Fe, xt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), St.push(zt);
      }
      return St;
    }
    if (I.walletCannotAlbums)
      return St.push(xt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), St;
    const Rt = (he = (ue = I.gate) == null ? void 0 : ue.gifts) == null ? void 0 : he.turnstileSiteKey;
    return Rt && !y.token ? St.push(xt("p", "One quick check and it is yours:", "ppp-mute"), g(Rt)) : !e.claiming && !e.error && !e.waiting && !e.retry && S(() => T(I)), St.push(...C(I, "Sending your album…")), St;
  }
  function C(I, G) {
    const x = [];
    return e.claiming || e.waiting ? x.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : G, "ppp-cyan")) : e.retry && x.push(xt("p", e.retry.text, "ppp-warn"), yr("Try now", () => {
      clearTimeout(v), e.retry = void 0, T(I);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? x.push(xt("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")) : e.error && x.push(xt("p", e.error, "ppp-bad"), yr("Try again", () => {
      e.error = void 0, T(I);
    })), x;
  }
  const N = (I) => {
    var G;
    return !!e && !e.done && !e.error && o() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((G = e.view) != null && G.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function Y(I, G = {}) {
    var Fe, pt;
    const x = F(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return x;
    const O = e.view;
    if (e.error && !O) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!O) return [xt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return x;
    if (O.status === "claimed" || O.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(O.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (O.status === "pending-deposit") return [xt("p", `🎁 ${l(O)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (O.player) return [...k(I, O, !!G.bare), ...x];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [xt("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")];
    const St = BigInt(O.amount), ne = Fo(St).toLocaleString(), Rt = xt(
      "p",
      `🎁 ${l(O)} sent you ${Rn(St)} STX of on-chain music: about ${ne} paid plays.`,
      "ppp-gift"
    ), ue = G.bare ? [] : [Rt], he = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, zt = (pt = (Fe = I.gate) == null ? void 0 : Fe.gifts) == null ? void 0 : pt.turnstileSiteKey;
    return he ? (zt && !y.token ? ue.push(xt("p", "One quick check and it is yours:", "ppp-mute"), g(zt)) : !e.claiming && !e.error && !e.waiting && !e.retry && S(() => T(I)), ue.push(...C(I, "Sending your gift…"))) : I.step === "intro" ? G.bare || ue.push(xt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? ue.push(xt("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && ue.push(xt("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")), ue;
  }
  async function it(I, G, x) {
    var O;
    try {
      const at = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((O = at == null ? void 0 : at.gift) != null && O.returnTo) return { ok: !0, funder: at.gift.returnTo, txId: at.gift.txid ?? void 0, amount: at.gift.amount, distinct: 1 };
    } catch {
      if (x) return { ok: !1 };
    }
    return G();
  }
  const q = xt("div", "", "ppp-gift-fold");
  let X = 250000n, $ = "", _ = "";
  const m = (I) => {
    try {
      const G = JSON.parse(t.store.get(gp(I)) || "[]");
      return Array.isArray(G) ? G : [];
    } catch {
      return [];
    }
  }, P = (I, G) => t.store.set(gp(I), JSON.stringify(G.slice(0, 50)));
  async function K(I) {
    const G = m(I);
    for (const x of G)
      if (!(x.view && ["claimed", "refunded", "expired"].includes(x.view.status)))
        try {
          x.view = !x.view || x.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: x.id, ...x.txid ? { txid: x.txid } : {} }) }) : await t.json("/radio/gift?id=" + x.id), x.error = void 0;
        } catch (O) {
          x.error = O.message;
        }
    P(I, G), t.changed();
  }
  async function B(I) {
    if ($) return;
    $ = "Starting your gift…", _ = "", t.changed();
    let G = null;
    try {
      G = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: X.toString() }) });
      const x = m(I);
      x.unshift({ id: G.id, code: G.code, amount: X.toString(), at: t.now() }), P(I, x), $ = "Approve the gift in your wallet…", t.changed();
      const O = await t.pay(I, G.depositTo, BigInt(G.deposit), G.memo), at = m(I), St = at.find((ne) => ne.id === G.id);
      St && (St.txid = O, St.view = { status: "pending-deposit", amount: X.toString(), source: "friend", from: I, label: "", expires: 0 }), P(I, at), _ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (x) {
      _ = x.message || "Not sent.";
    } finally {
      $ = "", t.changed();
    }
  }
  const st = (I) => "xtrata.radio.gift.players.v1:" + I, W = (I) => {
    try {
      const G = JSON.parse(t.store.get(st(I)) || "[]");
      return Array.isArray(G) ? G.filter((x) => x && /^[0-9a-f]{16}$/.test(x.id)) : [];
    } catch {
      return [];
    }
  };
  async function kt(I, G) {
    var x;
    if (!$) {
      $ = "Checking the player…", _ = "", t.changed();
      try {
        const O = G.tracks.split(/[\s,]+/).filter(Boolean).map((he) => Number(he.replace(/^#/, ""))), at = l6({ title: G.title.trim(), subtitle: G.subtitle.trim(), tracks: O, cover: (x = G.cover) != null && x.trim() ? Number(G.cover.trim().replace(/^#/, "")) : null });
        $ = "Sign in your wallet…", t.changed();
        const St = { admin: I, hash: u6(at), issued: t.now() }, ne = await t.sign(I, f6(St));
        $ = "Making the player…", t.changed();
        const Rt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: at, request: St, signature: ne }) }), ue = W(I).filter((he) => he.id !== Rt.id);
        ue.unshift({ id: Rt.id, title: Rt.title, tracks: Rt.tracks }), t.store.set(st(I), JSON.stringify(ue.slice(0, 30))), _ = `${Rt.existing ? "That player already exists" : "Player made"} ✓ “${Rt.title}” · ${Rt.tracks} songs. Pick it below for a batch.`;
      } catch (O) {
        _ = O.message || "Not made.";
      } finally {
        $ = "", t.changed();
      }
    }
  }
  const L = (I, G) => Q5(I || location.origin + "/radio.html", G), D = (I) => {
    try {
      const G = JSON.parse(t.store.get(yp(I)) || "[]");
      return Array.isArray(G) ? G.filter((x) => x && /^[0-9a-f]{16}$/.test(x.id) && Array.isArray(x.codes)) : [];
    } catch {
      return [];
    }
  }, lt = (I, G) => t.store.set(yp(I), JSON.stringify(G.slice(0, 20))), ot = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, ut = (I, G) => t.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(G) });
  let Nt = 0;
  async function te(I) {
    const G = D(I);
    for (const x of G)
      if (!ot(x))
        try {
          x.view = !x.view || x.view.status === "pending-deposit" ? await ut("/radio/gift/batch/confirm", { id: x.id, ...x.txid ? { txid: x.txid } : {} }) : await t.json("/radio/gift/batch?id=" + x.id), x.error = void 0;
        } catch (O) {
          x.error = O.message;
        }
    try {
      const x = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const O of (x == null ? void 0 : x.batches) ?? []) {
        const at = G.find((St) => St.id === O.id);
        if (at) {
          at.error || (at.view = O);
          continue;
        }
        G.push({ id: O.id, codes: [], count: O.count, amount: O.amount, label: O.label, player: O.player, depositTo: "", deposit: O.deposit, memo: O.memo, at: 0, view: O });
      }
    } catch {
    }
    lt(I, G), t.changed();
  }
  async function $t(I, G) {
    const x = D(I).find((O) => O.id === G);
    if (!(!x || !x.depositTo || $)) {
      $ = "Approve the payment in your wallet…", _ = "", t.changed();
      try {
        const O = await t.pay(I, x.depositTo, BigInt(x.deposit), x.memo), at = D(I), St = at.find((ne) => ne.id === G);
        St && (St.txid = O), lt(I, at), _ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", $ = "", te(I);
      } catch (O) {
        _ = `${/cancel/i.test(O.message) ? "Payment cancelled." : O.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        $ = "", t.changed();
      }
    }
  }
  async function Vt(I, G, x, O) {
    if ($) return;
    if (!G.ok) {
      _ = G.reason, t.changed();
      return;
    }
    $ = "Sign in your wallet…", _ = "", t.changed();
    let at = null;
    try {
      const St = { creator: I, count: G.count, amount: G.amount.toString(), label: x, issued: t.now(), ...O ? { player: O } : {} }, ne = await t.sign(I, e6(St));
      $ = "Making your links…", t.changed(), at = await ut("/radio/gift/batch", { request: St, signature: ne });
      const Rt = D(I);
      Rt.unshift({ id: at.id, codes: at.codes, count: G.count, amount: at.amount, label: x, player: O ?? null, depositTo: at.depositTo, deposit: at.deposit, memo: at.memo, at: t.now() }), lt(I, Rt);
    } catch (St) {
      _ = St.message || "Not made.", $ = "", t.changed();
      return;
    }
    $ = "", t.changed(), await $t(I, at.id);
  }
  function vt() {
    const I = !!Ee.value, G = Wt.value === "max" ? r6(I) : Number(Wt.value), x = n6(G, I), O = Number(Ve.value);
    return !Number.isInteger(O) || O < 1 || O > Yl ? { ok: !1, reason: `Make 1 to ${Yl} copies at a time.`, album: I, plays: G, amount: x, count: O } : o6(x) ? { ok: !0, reason: "", album: I, plays: G, amount: x, count: O, bill: i6(O, x, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: G, amount: x, count: O };
  }
  const He = () => {
    const I = vt();
    if (!I.ok) return I.reason;
    const G = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${Rn(G.holders)} to song holders, ${Rn(G.fees)} network fees)${I.album ? `, ${Rn(G.float)} for the album’s likes` : ""}, ${Rn(G.reserve)} kept so a listener can return what is left, + ${Rn(G.sendFee)} to send it = ${Rn(G.perCopy)} STX. ${I.count} copies = ${Rn(G.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ht = (I, G) => G.codes.map((x) => L(I, x)), Lt = xt("input");
  Lt.type = "range", Lt.min = String(rb), Lt.max = String(bd), Lt.step = "10000", Lt.value = String(X), Lt.setAttribute("aria-label", "Gift amount");
  const jt = xt("p", "", "ppp-gift-amount"), le = yr("", () => {
    const I = t.main();
    I && B(I);
  }, "primary"), vn = () => {
    jt.textContent = yn(), le.textContent = `Gift ${Rn(X)} STX`;
  };
  Lt.oninput = () => {
    X = BigInt(Lt.value), vn();
  };
  const yn = () => `${Rn(X)} STX · about ${Fo(X).toLocaleString()} paid plays · you pay ${Rn(X + jc)} STX with the network fee`;
  vn();
  const Te = xt("input");
  Te.maxLength = 60, Te.placeholder = "Title, e.g. Proof of Sound", Te.setAttribute("aria-label", "Player title");
  const Xe = xt("input");
  Xe.maxLength = 80, Xe.placeholder = "Artist (optional)", Xe.setAttribute("aria-label", "Player subtitle");
  const Ke = xt("textarea");
  Ke.rows = 3, Ke.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ke.setAttribute("aria-label", "Songs");
  const qe = xt("input");
  qe.inputMode = "numeric", qe.placeholder = "Cover inscription number (optional), shown when the album loads", qe.setAttribute("aria-label", "Cover inscription");
  const Ee = xt("select");
  Ee.setAttribute("aria-label", "Batch album");
  const Wt = xt("select");
  Wt.setAttribute("aria-label", "Plays per copy");
  for (const I of h6) Wt.append(Ja(`${I.toLocaleString()} plays`, String(I)));
  Wt.append(Ja("Max (1 STX)", "max"));
  const Ve = xt("input");
  Ve.type = "number", Ve.min = "1", Ve.max = String(Yl), Ve.value = "10", Ve.setAttribute("aria-label", "Copies");
  const kn = xt("input");
  kn.maxLength = 40, kn.placeholder = "Label, e.g. Opera launch", kn.setAttribute("aria-label", "Batch label");
  const We = xt("p", "", "ppp-mute"), ee = () => {
    We.textContent = He();
  };
  for (const I of [Ee, Wt, Ve])
    I.oninput = ee, I.onchange = ee;
  ee();
  function Ae(I) {
    var at, St;
    const G = (at = I.gate) == null ? void 0 : at.gifts;
    if (!(G != null && G.enabled) || !G.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const x = t.main(), O = [xt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!x)
      O.push(xt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (G.admin) {
      const ne = xt("div", "", "ppp-gift-admin"), Rt = (pt, At) => {
        const Gt = xt("label", pt);
        return Gt.append(At), Gt;
      }, ue = W(x);
      ne.append(
        xt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        Te,
        Xe,
        Ke,
        qe,
        yr("Sign and make player", () => void kt(x, { title: Te.value, subtitle: Xe.value, tracks: Ke.value, cover: qe.value }))
      );
      const he = yr("Sign, pay and make links", () => {
        Vt(x, vt(), kn.value.trim(), Ee.value || void 0);
      });
      he.disabled = !!$;
      const zt = Ee.value;
      Ee.replaceChildren(Ja("No album (starter copies)", ""), ...ue.map((pt) => Ja(`${pt.title} · ${pt.tracks} songs`, pt.id))), ue.some((pt) => pt.id === zt) && (Ee.value = zt), ee(), ne.append(
        xt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Rt("Album ", Ee),
        Rt("Plays each ", Wt),
        Rt("Copies ", Ve),
        kn,
        We,
        he
      ), t.now() - Nt > 3e4 && (Nt = t.now(), te(x));
      const Fe = D(x);
      if (Fe.length) {
        const pt = xt("ul", "", "ppp-gift-list");
        for (const At of Fe.slice(0, 10)) {
          const Gt = At.view, re = Gt == null ? void 0 : Gt.copies, je = At.error ? At.error : !Gt || Gt.status === "pending-deposit" ? At.txid ? "payment confirming…" : "waiting for your payment" : `${re.claimed} of ${Gt.count} claimed${re.refunding + re.refunded ? ` · ${re.refunded} refunded${re.refunding ? `, ${re.refunding} on their way` : ""}` : ""}`, oe = xt("li");
          if (oe.append(xt("span", `${At.label || "Batch"} · ${At.count} × ${Rn(BigInt(At.amount))} STX`, "t"), xt("span", je, "ppp-mute")), !At.txid && At.depositTo && (!Gt || Gt.status === "pending-deposit") && oe.append(yr("Pay now", () => void $t(x, At.id), "tiny")), At.codes.length && (Gt == null ? void 0 : Gt.status) === "live") {
            const wn = Ht(((St = I.gate) == null ? void 0 : St.radioUrl) ?? null, At);
            oe.append(
              Fr("batch-copy:" + At.id, "Copy all links", () => wn.join(`
`), "tiny", t.changed),
              Fr("batch-csv:" + At.id, "Copy as CSV", () => ["copy,link", ...wn.map((nn, Tr) => `${Tr + 1},${nn}`)].join(`
`), "tiny", t.changed)
            );
          } else At.codes.length || oe.append(xt("span", "links were made on another device", "ppp-mute"));
          pt.append(oe);
        }
        ne.append(pt);
      }
      O.push(ne);
    }
    return $ && O.push(xt("p", $, "ppp-cyan")), _ && O.push(xt("p", _, /✓/.test(_) ? "ppp-ok" : "ppp-warn")), q.replaceChildren(...O), q;
  }
  return { banner: Y, funder: it, renderFold: Ae, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: N };
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
const sf = /* @__PURE__ */ new Set(), ib = (t) => (sf.add(t), () => {
  sf.delete(t);
}), of = () => {
  for (const t of [...sf])
    try {
      t();
    } catch {
    }
}, wp = "xtrata:al-thumb:v1:", ob = "-", jo = 96, E6 = 24 * 1024 * 1024, un = /* @__PURE__ */ new Map(), bp = /* @__PURE__ */ new Set(), af = [];
let ql = !1, Wl;
const Rc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(wp + t);
    window.localStorage.setItem(wp + t, e);
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
      const T = S + v, U = r.indexOf(">", T);
      if (U < 0)
        return r = r.slice(T), null;
      const F = r.slice(T, U + 1), k = F.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (k) return k[1].replace(/&amp;/g, "&");
      const C = F.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (C) return "/inscription/" + C[1];
      S = U + 1;
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
        if (!un.has(t))
          try {
            const e = await A6(t);
            if (e === null) continue;
            if (!e) {
              un.set(t, ""), Rc(t, ob), of();
              continue;
            }
            const n = await md(e);
            un.set(t, n), n.startsWith("data:image/jpeg") && Rc(t, n), of();
          } catch {
          }
      }
    } finally {
      ql = !1;
    }
  }
}
function ab(t, e) {
  if (e && !un.get(t) ? (un.set(t, e), md(e).then((r) => {
    r !== e && (un.set(t, r), r.startsWith("data:image/jpeg") && Rc(t, r), of());
  })) : e === "" && !un.has(t) && un.set(t, ""), un.has(t)) return un.get(t);
  const n = Rc(t);
  if (n != null) {
    const r = n === ob ? "" : n;
    return un.set(t, r), r;
  }
  return bp.has(t) || (bp.add(t), af.push(t), Wl || (Wl = setTimeout(() => {
    Wl = void 0, v6();
  }, 1200))), "";
}
const Wi = 12, k6 = 5e3, on = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Zi = (t, e, n = "") => {
  const r = on("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function $6(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, h = Wi;
  const l = on("div", "", "ppp-shelf-box");
  ib(() => t.changed());
  const y = (m) => "xtrata.radio.shelf.pins.v1:" + m, g = (m) => "xtrata.radio.shelf.recent.v1:" + m, S = (m, P) => {
    try {
      return JSON.parse(t.store.get(m) || "null") ?? P;
    } catch {
      return P;
    }
  }, v = (m) => new Set(S(y(m), []).filter((P) => Number.isSafeInteger(P))), T = (m) => {
    const P = S(g(m), {}), K = {};
    for (const [B, st] of Object.entries(P)) Number.isSafeInteger(Number(B)) && typeof st == "number" && (K[Number(B)] = st);
    return K;
  };
  async function U(m) {
    if (!s) {
      s = !0, i = !1;
      try {
        const P = [];
        let K = 0, B = 0;
        for (let st = 0; st < k6 / 100 + 1; st++) {
          const W = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(m)}&after=${K}&limit=100`);
          if (P.push(...b6(W == null ? void 0 : W.shelf)), B = Number(W == null ? void 0 : W.total) || P.length, !(W != null && W.next) || !Number.isSafeInteger(W.next)) break;
          K = W.next;
        }
        m === e && (n = P, r = B, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const F = () => {
    o = -1 / 0;
  }, k = on("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = Wi, t.changed();
  };
  const C = on("select");
  C.setAttribute("aria-label", "Sort albums");
  for (const m of w6) {
    const P = document.createElement("option");
    P.value = m.value, P.textContent = m.label, C.append(P);
  }
  C.onchange = () => {
    c = C.value, h = Wi, t.changed();
  };
  const N = Zi("", () => {
    u = !u, h = Wi, t.changed();
  }, "tiny"), Y = on("div", "", "ppp-shelf-tools");
  Y.append(k, C, N);
  const it = on("div"), q = on("div");
  function X(m) {
    const P = m.step === "off" || m.step === "elsewhere" ? void 0 : m.root;
    if (P !== e && (e = P, n = [], r = 0, o = -1 / 0, h = Wi), !P || m.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(P), !n.length)
      return i ? (q.replaceChildren(on("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Zi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(q), l) : null;
    const K = v(P), B = T(P), st = x6(n, { query: a, sort: c, pinnedOnly: u, pins: K, recents: B });
    k.value !== a && (k.value = a), C.value = c, N.textContent = u ? "★ Pinned only" : "☆ Pinned only", N.setAttribute("aria-pressed", String(u));
    const W = [];
    if (m.slot > 0 && W.push(Zi("← My player", () => t.open(0), "quiet")), !st.length) W.push(on("p", "No album matches that.", "ppp-mute"));
    else {
      const kt = on("ul", "", "ppp-shelf-list");
      for (const L of st.slice(0, h)) {
        const D = on("li", "", L.slot === m.slot ? "now" : ""), lt = K.has(L.slot), ot = Zi(lt ? "★" : "☆", () => {
          const Lt = new Set(K);
          lt ? Lt.delete(L.slot) : Lt.add(L.slot), t.store.set(y(P), JSON.stringify([...Lt])), t.changed();
        }, "tiny");
        ot.setAttribute("aria-label", lt ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const ut = [L.player.subtitle, `${zr(L.player).length} ${zr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), Nt = L.slot === m.slot, te = Zi(Nt ? "Playing" : "Select", () => {
          t.store.set(g(P), JSON.stringify(S6({ ...B, [L.slot]: t.now() }))), t.open(L.slot);
        }, Nt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        te.disabled = Nt;
        const $t = zr(L.player)[0], Vt = L.player.cover ?? ($t == null ? void 0 : $t.id), vt = Vt ? ab(String(Vt)) : "", He = on("span", "", "ppp-shelf-art");
        if (vt) {
          const Lt = document.createElement("img");
          Lt.src = vt, Lt.alt = "", Lt.decoding = "async", He.append(Lt);
        } else He.textContent = "💿";
        const Ht = on("span", "", "ppp-shelf-txt");
        Ht.append(on("span", L.player.title, "t"), on("span", ut, "ppp-mute")), D.append(ot, He, Ht, te), kt.append(D);
      }
      W.push(kt), st.length > h && W.push(Zi(`Show more (${st.length - h} left)`, () => {
        h += Wi, t.changed();
      }, "quiet"));
    }
    return i && W.push(on("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), it.replaceChildren(...W), l.firstChild !== Y && l.replaceChildren(Y, it), l;
  }
  return { render: X, invalidate: F, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const m = T(e), P = [...n].filter((K) => K.player).sort((K, B) => (m[B.slot] ?? 0) - (m[K.slot] ?? 0) || B.slot - K.slot)[0];
    return P ? { slot: P.slot, title: P.player.title } : null;
  } };
}
const I6 = 20, Je = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, $e = {
  grid: Je('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Je('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Je('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Je('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Je('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Je('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Je('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Je('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Je('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Je('<path d="M6 9l6 6 6-6"/>', 18),
  right: Je('<path d="M9 6l6 6-6 6"/>', 16),
  close: Je('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Je('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Je('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Je('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Je('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Je('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function J(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const sn = (t, ...e) => J("button", { type: "button", ...t }, ...e), tc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Ro = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, L6 = { music: "My music", device: "This device", gifts: "Albums (admin)" }, C6 = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function mp(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function h(m) {
    var K, B, st;
    if (!m || !Number.isSafeInteger(m)) return "";
    const P = (st = (B = (K = e.radio()) == null ? void 0 : K.getState) == null ? void 0 : B.call(K)) == null ? void 0 : st.albumCover;
    return P != null && P.url && Number(P.tokenId) === m ? P.url : c.has(m) ? c.get(m) : (u.has(m) || (u.add(m), fetch("/inscription/" + m, { signal: AbortSignal.timeout(2e4) }).then(async (W) => {
      var L, D, lt, ot;
      const kt = (W.headers.get("content-type") || "").toLowerCase();
      if (!W.ok)
        throw await ((L = W.body) == null ? void 0 : L.cancel()), new Error("no cover");
      return kt.startsWith("image/") ? (await ((D = W.body) == null ? void 0 : D.cancel()), "/inscription/" + m) : kt.includes("text/html") ? (((lt = (await W.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : lt[1]) ?? "").replace(/&amp;/g, "&") : (await ((ot = W.body) == null ? void 0 : ot.cancel()), "");
    }).then((W) => {
      c.set(m, W), _();
    }).catch(() => {
      u.delete(m);
    })), "");
  }
  ib(() => _());
  function l(m) {
    var K;
    i = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const P = document.querySelector(".side");
    if (m && m !== "more") {
      for (const W of C6[m]) {
        const kt = P == null ? void 0 : P.querySelector(W);
        kt && (kt.open = !0);
      }
      const B = document.getElementById("sheetTitle");
      B && (B.textContent = L6[m]);
      const st = document.getElementById("sheetExtra");
      st && st.replaceChildren(...m === "music" ? [g()] : []), (K = P == null ? void 0 : P.scrollTo) == null || K.call(P, { top: 0 });
    }
    _();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const g = () => sn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    J("span", { class: "al-row-i", html: $e.radio }),
    J("span", { class: "al-row-t" }, J("b", {}, "Xtrata Radio"), J("small", {}, "Every song on-chain · FM, liked, all")),
    J("span", { class: "al-row-go", html: $e.right })
  );
  let S = null, v = !1;
  const T = () => {
    var P;
    const m = e.radio();
    v || !(m != null && m.subscribe) || (v = !0, m.subscribe((K) => {
      S = K, (s == null ? void 0 : s.mode) === "open" && _();
    }), S = ((P = m.getState) == null ? void 0 : P.call(m)) ?? null);
  };
  r || setInterval(() => {
    var B, st;
    if ((s == null ? void 0 : s.mode) !== "open" || !(S != null && S.playing)) return;
    const m = (st = (B = e.radio()) == null ? void 0 : B.getPosition) == null ? void 0 : st.call(B), P = t.querySelector(".al-bar > i"), K = t.querySelectorAll(".al-times span");
    !m || !P || (P.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", K.length === 2 && (K[0].textContent = tc(m.current || 0), K[1].textContent = m.duration ? tc(m.duration) : "–:––"));
  }, 500);
  let U = "", F = null;
  function k(m, P, K = {}) {
    const B = K.song || h(m.cover), W = [B ? J("img", { src: B, alt: K.song ? "Song artwork" : `${m.title} cover` }) : J("div", { class: "al-cover-fallback" }, J("b", {}, m.title), m.subtitle ? J("span", {}, m.subtitle) : null), K.paused ? J("span", { class: "al-paused" }, J("i", { html: $e.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], kt = "al-cover" + (P ? "" : " al-cover--small") + (K.paused ? " is-paused" : "");
    return K.flip ? (W.push(J("span", { class: "al-flip", "aria-hidden": "true", html: $e.flip })), sn({ class: kt + " is-flippable", "aria-label": K.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: K.flip }, ...W)) : J("div", { class: kt }, ...W);
  }
  function C(m) {
    return m.plays === null || m.plays === void 0 ? J("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? J("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : J("span", { class: "al-chip" + (m.plays <= I6 ? " al-chip--low" : "") }, `${Ro(m.plays, "play", "plays")} left`);
  }
  function N(m) {
    const P = m.player, K = P.tracks.filter((st) => !st.hidden), B = [];
    return m.mode === "arrive" && m.from && B.push(J("p", { class: "al-from" }, J("span", { html: $e.gift }), J("span", {}, J("b", {}, m.from), " sent you an album"))), B.push(k(P, !0)), B.push(J(
      "div",
      { class: "al-intro" },
      J("h1", {}, P.title),
      P.subtitle ? J("p", { class: "al-artist" }, P.subtitle) : null,
      K.length ? J("p", { class: "al-songline" }, K.map((st) => st.title || `#${st.id}`).join(" · ")) : null,
      J("span", { class: "al-chip" }, [Ro(K.length, "song", "songs"), m.offered ? Ro(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && B.push(J("div", { class: "al-status", role: "status" }, ...m.status)), B.push(J("div", { class: "al-grow" })), m.asking ? B.push(J("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && B.push(sn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, J("span", { html: $e.playSmall }), m.primary.label)), m.hint && !m.asking && B.push(J("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && B.push(sn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), B;
  }
  function Y(m, P) {
    const { songs: K, current: B, started: st, own: W, out: kt, waiting: L } = P, D = m.player, lt = e.radio(), ot = [];
    ot.push(J("div", { class: "al-listhead" }, J("span", {}, J("b", {}, D.title), ` · ${Ro(K.length, "song", "songs")}`), C(m)));
    const ut = h(D.cover), Nt = "album:" + D.cover;
    ut && !un.has(Nt) && (un.set(Nt, ut), md(ut).then(($t) => {
      $t !== ut && (un.set(Nt, $t), _());
    }));
    const te = ut ? un.get(Nt) || ut : "";
    return ot.push(J("ol", { class: "al-tracks" }, ...K.map(($t, Vt) => {
      const vt = String($t.id) === B, He = ab(String($t.id), vt && st ? W : void 0);
      return J("li", {}, sn(
        { class: "al-track" + (vt ? " is-on" : ""), "aria-label": `Play ${$t.title || "#" + $t.id}`, "aria-current": vt ? "true" : void 0, disabled: kt || L, onClick: () => {
          var Ht;
          return (Ht = lt == null ? void 0 : lt.playToken) == null ? void 0 : Ht.call(lt, $t.id);
        } },
        J(
          "span",
          { class: "al-th" + (He ? "" : " is-blank") },
          He ? J("img", { src: He, alt: "", decoding: "async" }) : te ? J("img", { src: te, alt: "", decoding: "async" }) : null,
          He ? null : J("span", { class: "al-n" }, String(Vt + 1)),
          vt ? J("span", { class: "al-eq", html: $e.eq }) : null
        ),
        J("span", { class: "al-tt" }, $t.title || `#${$t.id}`)
      ));
    }))), ot;
  }
  function it(m) {
    var He;
    const P = m.player, K = P.tracks.filter((Ht) => !Ht.hidden), B = e.radio(), st = S == null ? void 0 : S.nowPlaying, W = st && P.tracks.some((Ht) => String(Ht.id) === String(st.tokenId)) ? String(st.tokenId) : null, kt = W ? P.tracks.find((Ht) => String(Ht.id) === W) : null, L = m.plays === 0 && !m.playsComing, D = !!m.playsComing && !m.plays, lt = !!(S != null && S.playing) && !!W, ot = S == null ? void 0 : S.heart, ut = W ? (He = B == null ? void 0 : B.getPosition) == null ? void 0 : He.call(B) : null;
    W && (lt || ((ut == null ? void 0 : ut.current) ?? 0) > 0.5) && (U = P.id);
    const Nt = !!W && U === P.id;
    F && F !== W && (F = null);
    const te = Nt ? String((st == null ? void 0 : st.cover) || "") : "", $t = !!te && F === W, vt = [k(P, !L, { song: $t ? "" : te, paused: Nt && !lt, flip: te ? () => {
      F = F === W ? null : W, _();
    } : void 0, flipped: $t })];
    if (vt.push(J(
      "div",
      { class: "al-now" },
      J(
        "div",
        { class: "al-now-t" },
        J("div", { class: "al-song" }, kt ? kt.title || (st == null ? void 0 : st.title) || `#${kt.id}` : P.title),
        J("div", { class: "al-artist" }, kt ? kt.artist || (st == null ? void 0 : st.artist) || P.subtitle : P.subtitle || "Press play")
      ),
      W ? sn({ class: "al-icon" + (ot != null && ot.liked ? " is-on" : ""), "aria-label": ot != null && ot.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(ot != null && ot.liked)), disabled: !!(ot != null && ot.pending) || !!(ot != null && ot.locked) || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.toggleLike) == null ? void 0 : Ht.call(B);
      }, html: ot != null && ot.liked ? $e.heartOn : $e.heart }) : null
    )), L)
      vt.push(J(
        "div",
        { class: "al-out" },
        J("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        J("p", { class: "al-out-t" }, "You've played this album out"),
        J("p", { class: "al-out-s" }, "Add plays to keep listening."),
        q(m, !0)
      ));
    else {
      const Ht = ut != null && ut.duration ? Math.min(100, ut.current / ut.duration * 100) : 0;
      vt.push(J(
        "div",
        { class: "al-prog" },
        J("div", { class: "al-bar" }, J("i", { style: `width: ${Ht}%` })),
        J("div", { class: "al-times" }, J("span", {}, tc((ut == null ? void 0 : ut.current) || 0)), J("span", {}, ut != null && ut.duration ? tc(ut.duration) : "–:––"))
      ));
    }
    return vt.push(J(
      "div",
      { class: "al-ctl" + (L || D ? " is-off" : "") },
      sn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.prev) == null ? void 0 : Ht.call(B);
      }, html: $e.prev }),
      sn({ class: "al-play", "aria-label": lt ? "Pause" : "Play", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.playPause) == null ? void 0 : Ht.call(B);
      }, html: lt ? $e.pause : $e.play }),
      sn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = B == null ? void 0 : B.next) == null ? void 0 : Ht.call(B);
      }, html: $e.next })
    )), m.status.length && vt.push(J("div", { class: "al-status", role: "status" }, ...m.status)), vt.push(...Y(m, { songs: K, current: W, started: Nt, own: te, out: L, waiting: D })), vt.push(J("div", { class: "al-grow" })), vt.push(sn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      J("span", {}, "More ", J("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      J("span", { html: $e.down })
    )), vt;
  }
  function q(m, P) {
    const K = J("div", { class: "al-topups" + (P ? " al-topups--primary" : "") }), B = P ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const st of B) {
      const W = m.myPlays !== void 0 && m.myPlays >= st && !m.playsComing && !m.busy;
      K.append(sn({ class: "al-topup", disabled: !W, onClick: () => e.topUp(st) }, P ? `Add ${st.toLocaleString()} plays` : `+${st.toLocaleString()}`));
    }
    return P && K.append(sn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), K;
  }
  function X(m) {
    const P = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), K = J(
      "div",
      { class: "al-card" },
      J("div", { class: "al-card-h" }, J("b", {}, `Add plays to ${m.player.title}`), J("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      q(m, !1),
      J("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : P ? `Moved from My player · ${Ro(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !P && !m.playsComing && m.myPlays !== void 0 ? sn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), B = (W, kt, L, D) => sn(
      { class: "al-row", onClick: D },
      J("span", { class: "al-row-i", html: W }),
      J("span", { class: "al-row-t" }, J("b", {}, kt), J("small", {}, L)),
      J("span", { class: "al-row-go", html: $e.right })
    ), st = J(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      B($e.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, _();
      }),
      o ? J("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return J(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      J("div", { class: "al-sheet-h" }, J("b", {}, "More"), sn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: $e.close })),
      m.mode === "open" ? K : null,
      J(
        "div",
        { class: "al-rows" },
        B($e.grid, "My music", "Your albums and the radio", () => l("music")),
        B($e.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        m.canMake ? B($e.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        B($e.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        st
      )
    );
  }
  function $(m) {
    var L, D;
    const P = m.player, K = S == null ? void 0 : S.nowPlaying, B = K && P.tracks.some((lt) => String(lt.id) === String(K.tokenId)) ? String(K.tokenId) : null, st = !!(S != null && S.playing) && !!B, W = B ? (D = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : D.call(L) : null;
    B && (st || ((W == null ? void 0 : W.current) ?? 0) > 0.5) && (U = P.id);
    const kt = !!B && U === P.id;
    return Y(m, {
      songs: P.tracks.filter((lt) => !lt.hidden),
      current: B,
      started: kt,
      own: kt ? String((K == null ? void 0 : K.cover) || "") : "",
      out: m.plays === 0 && !m.playsComing,
      waiting: !!m.playsComing && !m.plays
    });
  }
  function _() {
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
    const P = J(
      "header",
      { class: "al-top" },
      J("a", { class: "al-brand", href: "/radio" }, "Xtrata ", J("b", {}, "Music")),
      m.mode === "open" ? sn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: $e.grid }) : null
    ), K = J("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? it(m) : N(m));
    t.replaceChildren(P, K, ...i === "more" ? [J("div", { class: "al-scrim", onClick: () => l("") }), X(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, _();
        return;
      }
      const P = !!s;
      s = m, !m && (P || i) && (i = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, _();
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
const cb = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), lb = (t) => /Android/.test(t);
function M6(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : cb(e) ? "x-safari-" + n.href : lb(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const P6 = (t) => cb(t) ? "Safari" : lb(t) ? "Chrome" : "your browser", Qi = "Xtrata Music Wallet", N6 = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function xp(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Qi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && N6.has(t.step);
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
const Zl = "xtrata.radio.novice", ub = "xtrata.radio.novice.previewed.v1", Sp = 6 * 6e4;
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
const U6 = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, Ep = (t) => U6.test(t ?? ""), O6 = {
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
function fb(t) {
  try {
    const e = JSON.parse(t.get(ub) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function z6(t, e) {
  const n = fb(t).filter((r) => r !== e);
  n.push(e), t.set(ub, JSON.stringify(n.slice(-50)));
}
function Ql(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...cf(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : cf();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > Sp ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > Sp ? { ...t, phase: "done" } : t;
  }
}
const ec = (t) => t.phase === "open" || t.phase === "playing", Pe = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Vs = (t, e, n, r = !1) => {
  const s = Pe("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, db = (t) => t.toLocaleString(), G6 = [
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
}, K6 = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${db(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, V6 = (t) => t ? `Your player holds ${db(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", Y6 = (t) => t ? `You got a ${t.name} player` : Hr.landed.title;
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
          s.canStart && u.append(Vs("al-primary", y.primary, h === "back" ? s.unlock : s.start, s.busy), Pe("p", "al-hint", y.hint)), s.canStart && u.append(Vs("al-link", y.returning, s.returning, s.busy)), u.append(Vs("al-link", y.full, s.full));
        } else if (h === "landed") {
          if (u.append(Vs("al-primary", Hr.landed.primary, s.full)), (l = s.albums) != null && l.length) {
            u.append(Pe("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const g = Vs("al-album", "", y.run);
              g.append(Pe("b", "", y.title), Pe("span", "", y.by)), u.append(g);
            }
          }
        } else h === "empty" && u.append(Vs("al-primary", Hr.empty.primary, s.restock), Vs("al-link", Hr.empty.full, s.full));
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
const Z6 = [100, 250, 500, 1e3], Q6 = (t, e = or) => BigInt(t) * cn(e);
function J6(t, e = or, n = 0n) {
  const r = Ls - t - n;
  return r > 0n ? Number(r / cn(e)) : 0;
}
function tI(t, e = or, n = 0n) {
  const r = t === void 0 ? 0 : J6(t, e, n);
  return Z6.map((s) => ({ plays: s, stx: Q6(s, e), fits: t !== void 0 && s <= r }));
}
const eI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, nI = (t) => eI[t.unit](t.amount), me = (t, e = "", n = "") => {
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
    const u = [], h = me("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(me("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fc(o.playsLeft, "play", "plays")} left.`));
    const l = rI(o.done);
    if (l && u.push(me("p", "ppp-restock__done", l)), o.arriving)
      u.push(me("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      u.push(me("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      u.push(me("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = me("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const F = me("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        F.type = "button", F.disabled = !U.fits, F.setAttribute("aria-pressed", String(U.plays === n)), F.append(me("b", "", U.plays.toLocaleString()), me("span", "", "plays")), F.onclick = () => {
          n = U.plays, i();
        }, S.append(F);
      }
      u.push(S);
      const v = me("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const F = me("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        F.type = "button", F.disabled = !U.on, F.setAttribute("aria-pressed", String(U.id === r)), F.append(me("b", "", U.label), me("span", "", U.on ? U.blurb : "Soon")), F.onclick = () => {
          r = U.id, i();
        }, v.append(F);
      }
      u.push(v);
      const T = a.find((U) => U.plays === n);
      if (T && r === "stx") {
        const U = me("div", "ppp-restock__pay"), F = nI({ unit: "microSTX", amount: T.stx }), k = me("p", "ppp-restock__amount");
        k.append("Send ", me("b", "", F), " to your player:"), U.append(k, me("p", "ppp-addr-full ppp-restock__addr", o.address));
        const C = me("div", "ppp-restock__row");
        C.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => tr(T.stx), "")), U.append(C), U.append(me("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), u.push(U);
      }
    }
    u.push(me("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const y = me("button", "quiet ppp-connect__cancel", "Close");
    y.type = "button", y.onclick = () => e == null ? void 0 : e.close(), u.push(y), e.replaceChildren(...u);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = me("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
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
const wr = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ap = 12;
function lI(t, e) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = wr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = wr("div", "hint"), u = wr("div", "find-artists"), h = wr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const l = wr("div", "likesTools");
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
      const C = wr("button", "", "Try again");
      C.type = "button", C.onclick = () => {
        r = "idle", y();
      }, c.append(C), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = aI(n), T = o ? v : v.slice(0, Ap), U = (C, N, Y, it = "") => {
      const q = wr("button", "find-chip" + (N ? " is-on" : ""), C);
      return q.type = "button", q.setAttribute("aria-pressed", String(N)), it && (q.title = it), q.onclick = Y, q;
    };
    u.replaceChildren(
      ...T.map((C) => U(`${C.name} · ${C.songs}`, Gr(C.name) === Gr(i), () => {
        i = Gr(C.name) === Gr(i) ? "" : C.name, g();
      }, `Show ${C.name}’s ${C.songs === 1 ? "song" : `${C.songs} songs`}`)),
      ...v.length > Ap ? [U(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, g();
      })] : []
    );
    const F = cI(n, s, i), k = e.current();
    h.replaceChildren(...F.songs.map((C) => {
      const N = wr("li", "lrow" + (C.id === k ? " now" : "")), Y = wr("button", "lt", C.title);
      return Y.type = "button", Y.title = `Play “${C.title}”${C.artist ? ` by ${C.artist}` : ""}`, Y.onclick = () => e.play(C.id), N.append(Y, wr("span", "find-by", `${C.artist ? C.artist + " · " : ""}#${C.id}`)), N;
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
function hI(t, e = or) {
  return dI(t <= _e ? 0 : Number((t - _e) / cn(e)));
}
const vp = document.getElementById("ppp");
vp && pI(vp);
function pI(t) {
  var Pr;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Db(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, b) => {
    const E = await fetch(f, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), d = await E.json().catch(() => ({}));
    if (!E.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${E.status}).`);
    return d;
  }, c = p5({
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
      const b = new Promise((ft, p) => {
        o.addEventListener("load", () => ft(), { once: !0 }), setTimeout(() => p(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await b;
      const E = new Tb({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), z = (ft, p) => d.has(ft) ? E.request(ft, p) : Promise.race([
        E.request(ft, p),
        new Promise((A, j) => setTimeout(() => j(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await z("listening.status"), { request: z };
    },
    chain: {
      verify: Y$,
      balance: q$,
      account: X$,
      owner: W$,
      broadcast: Z$,
      transaction: Q$,
      confirmedNonce: async (f) => {
        const b = await Ms(`/v2/accounts/${f}?proof=0`);
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
      onFinish: (ft) => d(ft.txId || ""),
      onCancel: () => z(new Error("Deposit cancelled. Nothing was sent.")),
      onError: z
    })),
    validate: J$,
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
    changed: () => fe(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var b, E;
      return u.funder(f, () => i5(f, Ms), !!((E = (b = c.snapshot().gate) == null ? void 0 : b.gifts) != null && E.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const b = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), E = b == null ? void 0 : b.gift;
      if (!E) return null;
      if (typeof E.returnTo != "string" || typeof E.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: E.returnTo, from: typeof E.from == "string" ? E.from : null, source: String(E.source ?? ""), amount: String(E.amount ?? "0"), treasury: E.treasury, state: E.state === "sending" ? "sending" : "arrived", player: E.player ?? null };
    },
    history: (f, b) => c5(f, (E) => Ms(E), b),
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
    nameOf: (f) => he(f) ?? void 0,
    likeConfirmed: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: b } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = y6({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, b, E, d) => new Promise((z, ft) => V0({
      recipient: b,
      amount: E.toString(),
      memo: d,
      stxAddress: f,
      network: new Jl(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (p) => z(p.txId || ""),
      onCancel: () => ft(new Error("Gift cancelled. Nothing was sent.")),
      onError: ft
    })),
    sign: (f, b) => Z0({ ...b, network: "mainnet", stxAddress: f }),
    giftSent: (f, b) => c.giftSent(f, b),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, b, E, d) => {
      h.invalidate(), await c.albumArriving(f, b, E, d);
    } },
    who: (f) => pt(f),
    changed: () => fe(c.snapshot()),
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
    changed: () => fe(c.snapshot())
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
  }, U = v ? mp(v, T) : null, F = "xtrata.radio.tier.v1";
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
  function N(f) {
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
  const Y = y.on && v ? q6(v) : null, it = Date.now();
  let q = !1, X = null, $ = (() => {
    try {
      return sessionStorage.getItem("xtrata.radio.novice.full") === "1";
    } catch {
      return !1;
    }
  })();
  const _ = () => {
    $ = !0;
    try {
      sessionStorage.setItem("xtrata.radio.novice.full", "1");
    } catch {
    }
    fe(c.snapshot());
  }, m = (f, b) => {
    var z;
    if (!Y || b || $) return null;
    if (!f.gate || f.step === "loading" || (q = !0), !q) return Date.now() - it < 1e4 ? "checking" : null;
    if (!g(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const d = f.slot === 0 && !((z = f.gift) != null && z.player) && !f.entries.some((ft) => ft.kind === "play");
    return f.step === "fund" && d ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && d && (X === "arriving" || X === "landed") ? "landed" : f.step === "loading" && X !== "checking" ? X : null;
  };
  function P(f, b, E = [], d) {
    if (!Y) return;
    const z = d !== void 0 ? d : m(f, b);
    if (X = z, delete document.documentElement.dataset.noviceBoot, !z) {
      Y.render(null, b);
      return;
    }
    const ft = [...E];
    z === "arriving" && f.arrival && ft.push(ur(f.arrival)), f.step === "unsupported" ? ft.push(x("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && ft.push(x("p", f.error, "ppp-warn"));
    const p = z === "gift" ? u.incomingStarter() : null;
    Y.render({
      mode: z,
      status: ft,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !zt,
      plays: p ? p.plays : z === "landed" ? f.playsLeft : null,
      from: (p == null ? void 0 : p.from) ?? null,
      tier: k,
      mystery: C,
      albums: z === "landed" ? te.map((A) => ({ title: A.title, by: A.subtitle, run: () => {
        _(), Lt(A, !0);
      } })) : [],
      start: () => void c.create(),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => B.open(),
      full: () => {
        var Z, ht, H;
        const A = window.XtrataRadio, j = z === "landed" && !((ht = (Z = A == null ? void 0 : A.getState) == null ? void 0 : Z.call(A)) != null && ht.playing);
        _(), j && ((H = A == null ? void 0 : A.playPause) == null || H.call(A));
      }
    });
  }
  Y && setTimeout(() => {
    q || fe(c.snapshot());
  }, 10100);
  const B = sI({
    input: () => {
      var z, ft, p, A;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const b = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (z = f.likeFunds) == null ? void 0 : z.balance };
      if (!b.address) return null;
      const E = f.slot === 0 ? f.entries : [], d = E.filter((j) => j.kind === "play" && j.status === "confirmed");
      return {
        playsLeft: b.balance === void 0 ? null : Ae(b.balance),
        balance: b.balance,
        incoming: 0n,
        fee: BigInt(((ft = f.gate) == null ? void 0 : ft.limits.playFee) ?? "300"),
        address: b.address,
        switches: ((p = f.gate) == null ? void 0 : p.restock) ?? {},
        done: d.length ? { plays: d.length, artists: new Set(d.map((j) => j.recipient)).size, likes: E.filter((j) => j.kind === "like" && j.status === "confirmed" && j.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((A = f.likeFunds) != null && A.pending)
      };
    },
    copyButton: (f, b, E, d) => Fr(f, b, E, d, () => {
      fe(c.snapshot());
    })
  }), st = document.getElementById("albumList"), W = st ? mp(st, T, { list: !0 }) : null, kt = "xtrata.radio.album.last.v1", L = () => {
    try {
      const f = JSON.parse(localStorage.getItem(kt) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let D = "";
  const lt = (f) => {
    const b = JSON.stringify(f);
    if (b !== D) {
      D = b;
      try {
        localStorage.setItem(kt, b);
      } catch {
      }
    }
  };
  let ot = null;
  window.XtrataRadioLikeHandler = (f) => {
    var E;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (E = c.snapshot().likeFunds) != null && E.album && (Wt = !0), oe();
    const b = wn(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let ut;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const Nt = (f) => {
    var E, d;
    const b = window.XtrataRadioListeningIdentity();
    b !== ut && (ut = b, (d = (E = window.XtrataRadio) == null ? void 0 : E.refreshLikes) == null || d.call(E));
  };
  let te = [], $t = 0, Vt = !1, vt = null;
  const He = (f) => {
    var b, E;
    Vt || !((E = (b = f.gate) == null ? void 0 : b.gifts) != null && E.enabled) || Date.now() - $t < 6e4 || ($t = Date.now(), a("/radio/gift/featured").then((d) => {
      te = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((z) => z && typeof z.id == "string" && typeof z.title == "string" && Array.isArray(z.tracks) && z.tracks.length > 0).slice(0, 6), Vt = !0, te.length && fe(c.snapshot());
    }).catch(() => {
    }));
  }, Ht = (f) => {
    var b;
    return vt && f.slot === 0 && !((b = f.gift) != null && b.player) && ["ready", "fund", "loading"].includes(f.step) ? vt : null;
  }, Lt = (f, b = !1) => {
    var d, z;
    vt = f, fe(c.snapshot());
    const E = f && b ? zr(f)[0] : null;
    E && ((z = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || z.call(d, E.id));
  };
  let jt = cf(), le = null;
  const vn = (f) => {
    const b = y.preview && !zt && f.step === "intro" ? u.incomingAlbum() : null;
    return b ? (jt = Ql(jt, { kind: "offer", album: b.player.id, already: fb(l).includes(b.player.id) }), ec(jt) ? b.player : null) : (jt = Ql(jt, { kind: "withdraw" }), null);
  }, yn = (f) => {
    const b = jt.phase;
    jt = Ql(jt, f), jt.phase !== b && (jt.album && (jt.phase === "playing" || jt.phase === "done") && z6(l, jt.album), fe(c.snapshot()));
  };
  setInterval(() => {
    jt.phase === "playing" && yn({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Te = "", Xe, Ke = !1, qe = !1;
  const Ee = (f, b) => {
    var H, ct, tt, gt, bt, Xt, ke, pe;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const d = b.depositPending && f.step === "fund" && ((H = f.giftStop) == null ? void 0 : H.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, z = le, ft = d ? g(f) ? D6(d.reason, d.text) : d.text : null, p = z ? null : ft ?? (e && (!((ct = f.gate) != null && ct.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    p && p !== Xe && (E.setGiftStop(p), Xe = p);
    const A = f.step === "off" || f.step === "elsewhere" ? null : ((tt = f.gift) == null ? void 0 : tt.player) ?? z ?? Ht(f) ?? null, j = A ? A.id + ":" + A.cover + ":" + A.tracks.map((De) => De.id).join(",") : "";
    j !== Te && (E.setGiftPlayer(A ? { id: A.id, title: A.title, subtitle: A.subtitle, tracks: zr(A).map((De) => De.id), hidden: ((gt = d6(A)) == null ? void 0 : gt.id) ?? null, cover: A.cover } : null), Te = j), p !== Xe && (E.setGiftStop(p), Xe = p);
    const Z = (d == null ? void 0 : d.reason) === "arriving";
    Z !== qe && ((bt = E.setGiftWait) == null || bt.call(E, Z), qe = Z);
    const ht = !!A && (!!z || !!((Xt = f.albumLock) != null && Xt.locked));
    ht !== Ke && ((ke = E.setGiftLock) == null || ke.call(E, ht), Ke = ht), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((pe = E.forgetWallets) == null || pe.call(E));
  };
  let Wt = !1;
  const Ve = /* @__PURE__ */ new Map(), kn = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((d) => d.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let E = Ve.get(f.listening);
    return E === void 0 && (E = Date.now(), Ve.set(f.listening, E)), Date.now() - E < Dc ? E : null;
  }, We = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((b) => b.kind === "play") && !!f.listening && Ve.has(f.listening), ee = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", Ae = (f) => {
    const b = c.snapshot().playCost || 350n;
    return f > _e ? Number((f - _e) / b) : 0;
  }, ar = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), I = (f) => {
    const b = Math.round((Date.now() - f) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, G = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, x = (f, b = "", E = "") => {
    const d = document.createElement(f);
    return b && (d.textContent = b), E && (d.className = E), d;
  }, O = (f, b, E = "") => {
    const d = x("button", f, E);
    return d.type = "button", d.onclick = b, d;
  }, at = (f, b) => {
    const E = x("a", f);
    return E.href = b, E.target = "_blank", E.rel = "noopener", E;
  };
  let St = null, ne = location.hash === "#give";
  ne && history.replaceState(null, "", location.pathname + location.search);
  let Rt = !1;
  const ue = Z5((f) => W5({ address: f, network: "mainnet" }), () => fe(c.snapshot())), he = (f) => ue.get(f), zt = B6(navigator.userAgent), Fe = (f, b) => {
    const E = navigator.userAgent, d = P6(E), z = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, ft = [x("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${y.on ? "player" : "listening wallet"}${b ? y.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], p = x("div", "", "ppp-open-row"), A = M6(z, E);
    if (A) {
      const j = x("a", `Open in ${d}`, "primary ppp-open-in");
      j.href = A, j.dataset.homeAction = "radio:open-in-browser", p.append(j);
    }
    return p.append(Fr("copy-page-link", "Copy link", () => z, A ? "" : "primary", () => fe(c.snapshot()))), ft.push(p, x("p", `If that does not open ${d}, use ${f}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), ft;
  }, pt = (f) => he(f) ?? ee(f), At = (f) => f.slice(0, 2).map(pt).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), Gt = /* @__PURE__ */ new Map();
  let re = !1;
  const je = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), oe = () => {
    re || (re = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const b of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const E = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(E) && Gt.set(E, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      fe(c.snapshot());
    }).catch(() => {
      re = !1;
    }));
  }, wn = (f, b) => {
    const E = Gt.get(f), d = up(f, [E == null ? void 0 : E.title, b == null ? void 0 : b.title].find((ft) => !je(ft)) || ""), z = cp(f, (E == null ? void 0 : E.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: d, artist: z };
  }, nn = (f) => {
    const { title: b, artist: E } = wn(f.song, f);
    return b ? `“${b}”${E ? ` — ${E}` : ""}` : `Song #${f.song}${E ? ` — ${E}` : ""}`;
  }, Tr = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Bi = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Xn(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function Be(f, b, E = "", d) {
    const z = x("dt", f), ft = x("dd", b, E);
    return d && ft.append(" ", d), [z, ft];
  }
  const $n = document.getElementById("ppp-top"), Us = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Dt = () => {
    var b;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (b = document.getElementById("radio-wallet-connect")) == null || b.click();
  }, Ze = () => {
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
    Us();
  };
  $n && ($n.onclick = Ze);
  const rn = (f, b, E, d = "") => f.standIn && !f.mainConnected ? O(`Connect ${pt(f.standIn)} to add STX`, Dt, d) : O(b, E, d), Os = (f) => {
    c.useLinked(f).then(() => Us());
  };
  let cr = null;
  const On = () => {
    const f = xp(c.snapshot(), pt);
    return f.length ? cr || (cr = new Promise((b) => {
      var ht;
      const E = x("dialog", "", "ppp-connect");
      E.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const z = (H) => {
        d = H, E.close();
      };
      E.addEventListener("close", () => {
        E.remove(), cr = null, b(d);
      }), E.addEventListener("click", (H) => {
        H.target === E && z(null);
      });
      const ft = (H, ct, tt, gt, bt = !1) => {
        const Xt = x("button", "", "ppp-connect__opt " + tt);
        return Xt.type = "button", Xt.disabled = bt, Xt.onclick = gt, Xt.append(x("b", H), x("span", ct)), Xt;
      }, p = x("h2", "Connect", "ppp-connect__title");
      p.id = "ppp-connect-title";
      const A = f.map((H) => ft(H.label, H.detail, "is-music", () => {
        if (z("music"), H.action === "linked" && H.main) {
          Os(H.main);
          return;
        }
        const ct = xp(c.snapshot(), pt).find((tt) => tt.action !== "linked");
        (ct == null ? void 0 : ct.action) === "create" ? c.create() : (ct == null ? void 0 : ct.action) === "unlock" && c.unlock(), Us();
      }, !!H.disabled)), j = ft("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => z("stacks")), Z = O("Cancel", () => z(null), "quiet ppp-connect__cancel");
      E.append(p, ...A, j, Z), document.body.appendChild(E), E.showModal(), (ht = A.find((H) => !H.disabled)) == null || ht.focus();
    }), cr) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = On;
  function qr(f) {
    if (!$n) return;
    const b = (d, z, ft) => {
      $n.hidden = !1, $n.className = "ppp-top" + (z ? " is-" + z : ""), $n.replaceChildren(x("span", "", "dot"), document.createTextNode(d)), $n.title = ft;
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
        return b(`Connect ${pt(f.linked)}`, "warn", `This device's listening wallet belongs to ${pt(f.linked)}. Connect that wallet to pay artists or like songs.`);
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
  const be = document.getElementById("pppNudge"), bn = document.getElementById("onair");
  (Pr = be == null ? void 0 : be.querySelector("button")) == null || Pr.addEventListener("click", () => Ze());
  const Hs = {
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
  function Po(f) {
    if (f.step === "loading") return;
    const b = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, E = f.step === "ready" && f.payingOn && b > 0 && !f.giftStop, d = f.step === "fund" && f.depositPending, z = f.step === "elsewhere" && !e, ft = E || d || z ? "" : Hs[f.step] ?? "", p = E ? "on" : z ? "free" : ft ? "off" : "";
    p ? document.documentElement.dataset.ppp = p : delete document.documentElement.dataset.ppp, bn && (bn.hidden = !p || p === "free", bn.querySelector(".onair-sub").textContent = E ? `${b.toLocaleString()} plays left` : "Plays off"), be && (be.hidden = p !== "off" && p !== "free", be.classList.toggle("is-free", p === "free"), p === "free" ? (be.querySelector(".nudge-t").textContent = "You’re on the free player", be.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", be.querySelector("button").textContent = "Get a player") : p === "off" && (be.querySelector(".nudge-t").textContent = ft, be.querySelector(".nudge-s").textContent = g(f) ? f.step === "intro" ? j6 : "" : "This radio requires a funded listening wallet with music support on.", be.querySelector("button").textContent = Mo[f.step] ?? "Start"));
  }
  let Ds = "";
  function Fs(f) {
    const b = x("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && b.append(x("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && b.append(x("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const E = x("input");
    E.type = "text", E.placeholder = "SP… address to send returns to", E.autocomplete = "off", E.spellcheck = !1, E.setAttribute("aria-label", "Address to return funds to"), E.value = Ds, E.oninput = () => {
      Ds = E.value;
    };
    const d = O(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(E.value), Ds = "";
    }, "tiny");
    return b.append(E, " ", d), f.returnToKind === "chosen" && b.append(" ", O("Back to the funder", () => c.clearReturnAddress(), "tiny")), b;
  }
  const lr = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function In() {
    const f = x("p", lr + " ", "ppp-mute");
    return f.append(at("Xverse", "https://www.xverse.app/download"), " · ", at("Leather", "https://leather.io/install-extension")), f;
  }
  let Mi = "";
  const Pi = (f) => {
    const b = document.documentElement, E = f.solo && !f.main ? f.listening ? ee(f.listening) : "new" : "", d = m5() ? "1" : "", z = f.standIn && !f.mainConnected ? pt(f.standIn) : "";
    `${E}|${d}|${z}` !== Mi && (Mi = `${E}|${d}|${z}`, E ? b.dataset.pppSolo = E : delete b.dataset.pppSolo, z ? b.dataset.pppAs = z : delete b.dataset.pppAs, d ? b.dataset.pppWalletInstalled = d : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => fe(c.snapshot()), f);
  function Ni(f, b = "") {
    const E = x("div", "", "ppp-topup"), d = Wr(f);
    E.append(x("span", "Add plays from My player: ", "ppp-mute"));
    for (const z of uc) {
      const ft = O(`+${z.toLocaleString()}`, () => void c.topUpAlbum(z), b);
      ft.disabled = d === void 0 || d < z || f.depositPending || !!f.busy, E.append(ft);
    }
    return d !== void 0 && d < uc[0] && E.append(x("p", "My player needs plays first (switch to My player above).", "ppp-mute")), E;
  }
  const Wr = (f) => {
    var d;
    const b = (d = f.likeFunds) == null ? void 0 : d.balance;
    if (b === void 0 || !f.playCost) return;
    const E = b - _e - 6000n;
    return E > 0n ? Number(E / f.playCost) : 0;
  };
  function js(f) {
    const b = f.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    if (b.low || (Wt = !1), b.low && !Wt) return [];
    const E = x("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      if (!b.txid) return [];
      const z = x("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return b.txid && z.append(at("View", G(b.txid))), E.append(z), [E];
    }
    E.append(x("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), E.append(x("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), E.append(x("p", b.address, "ppp-addr-full"));
    const d = x("div", "", "ppp-open-row");
    if (d.append(Fr("copy-likes-address", "Copy address", () => b.address, "primary", () => fe(c.snapshot()))), b.main && !f.solo) {
      const z = Ls - (b.balance ?? 0n);
      z > 0n && d.append(rn(f, `Pay ${tr(z)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return E.append(d), E.append(x("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [E];
  }
  const ur = (f) => {
    const b = x("div", "", "ppp-wait");
    b.dataset.since = String(f.since), b.dataset.grace = String(f.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const E = x("p", "", "ppp-wait-t"), d = x("div", "", "ppp-wait-track");
    return d.append(x("div", "", "ppp-wait-fill")), b.append(E, d), qn(b), b;
  };
  function qn(f) {
    const b = Number(f.dataset.since), E = Number(f.dataset.grace) || 6e4, d = Math.max(0, Date.now() - b), z = f.querySelector(".ppp-wait-fill"), ft = f.querySelector(".ppp-wait-t");
    if (d < E) {
      const p = Math.ceil((E - d) / 1e3);
      z.style.width = Math.max(4, Math.min(95, d / E * 100)).toFixed(0) + "%", ft.textContent = `Your plays are arriving… usually about a minute · ${p}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(d / E * 100)));
    } else
      z.style.width = "", ft.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let Rs = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      Rs = 0;
      return;
    }
    f.forEach(qn), ++Rs % 10 === 0 && fe(c.snapshot());
  }, 1e3);
  let Wn = null;
  function _i(f) {
    if (f.step === "loading" && Wn !== null) return;
    const E = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    E !== Wn && (Wn = E, E ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function fe(f) {
    var Ad, vd, kd, $d, Id, Ld, Cd, Td, Bd, Md, Pd, Nd, _d, Ud, Od, Hd;
    if (ot && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const V = ot;
      ot = null, f.root === V.root && f.slot !== V.slot && c.openAlbum(V.slot);
    }
    const b = u.inProgress(f), E = kn(f), d = b && f.step === "fund" ? { ...f, depositPending: !0 } : E !== null ? { ...f, depositPending: !0, arrival: { since: E, graceMs: Dc } } : f, z = d.error === Fc;
    if (Nt(), He(f), N(f), le = vn(f), Ee(f, d), _i(d), Pi(d), !b && u.inProgress(f)) return;
    if (qr(d), Po(d), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? y.on ? R6 : "Checking your listening wallet…" : y.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = d.step === "off", t.hidden) {
      P(d, !1);
      return;
    }
    const [ft, p] = Xn(d), A = s(".ppp-state");
    A.textContent = ft, A.className = "ppp-state" + (p ? " ppp-state--" + p : ""), A.hidden = !ft;
    const j = !!d.busy || d.armed, Z = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (j || !["intro", "loading"].includes(d.step));
    i.hidden = !Z, i.classList.toggle("ppp-frame--rest", !j && !Rt);
    const ht = s(".ppp-frame-label");
    ht.hidden = !0;
    const H = g5(d) ?? St;
    St = H;
    const ct = "xtrata.radio.ppp.heard.v1", tt = (() => {
      try {
        return localStorage.getItem(ct) === "1";
      } catch {
        return !1;
      }
    })();
    if (!tt && d.entries.some((V) => V.kind === "play"))
      try {
        localStorage.setItem(ct, "1");
      } catch {
      }
    const gt = tt || d.slot > 0 && ((((Ad = d.likeFunds) == null ? void 0 : Ad.balance) ?? 0n) > 0n || h.count() > 1), bt = g(d), Xt = !bt && w5({ ...d, heard: gt }, H);
    s(".ppp-badge").hidden = !Xt;
    const ke = s(".ppp-steps"), pe = s(".ppp-stage");
    ke.hidden = pe.hidden = !Xt, H && Xt && (ke.replaceChildren(...rf(d.solo).map((V, et) => {
      const Et = x("li", "", et < H.at ? "done" : et === H.at ? H.blocked ? "now blocked" : "now" : "");
      return Et.append(x("span", et < H.at ? "✓" : String(et + 1), "n"), V), et === H.at && Et.setAttribute("aria-current", "step"), Et;
    })), pe.textContent = H.caption, pe.className = "ppp-stage " + (H.at >= rf(d.solo).length ? "ppp-ok" : H.blocked ? "ppp-bad" : "ppp-cyan"));
    const De = s(".ppp-facts"), Qe = [];
    d.main && ((vd = d.gate) != null && vd.here) && !d.solo && Qe.push(...Be("Your wallet", pt(d.main), "ppp-addr-short"));
    const ma = () => {
      if (!d.listening) return;
      const V = Fr("copy-listening", "Copy", () => d.listening || "", "tiny", () => fe(c.snapshot()));
      Qe.push(...Be(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", ee(d.listening), "ppp-addr-short", V));
    };
    if (d.linked || ma(), d.listening && d.step !== "intro")
      if (d.linked)
        Qe.push(...Be("Credited to", `${pt(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), ma();
      else if (d.solo) {
        d.creditedTo && Qe.push(...Be("Credited to", `${pt(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const V = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${pt(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Qe.push(...Be("Returns go to", d.gift ? V : d.returnTo && !he(d.returnTo) ? V.replace(ee(d.returnTo), d.returnTo) : V, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Qe.push(...Be("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((kd = d.gate) != null && kd.here)) {
      const V = d.linkedListening.map((et) => ee(et) + (et === d.listening ? " (this one)" : "")).join(", ");
      Qe.push(...Be(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", V, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const V = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Qe.push(...Be("Balance", `${tr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, V));
    }
    const zs = d.entries.find((V) => V.kind === "play");
    zs && oe(), zs && Qe.push(...Be("Last paid song", `${nn(zs)} → ${pt(zs.recipient)}`, Tr[zs.status] || "")), De.replaceChildren(...Qe), De.hidden = !Qe.length;
    const mt = [], Zt = [], Qt = [], mn = [], Fi = cn(BigInt((($d = d.gate) == null ? void 0 : $d.limits.playFee) ?? "300")), xa = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${tr(Oc)} STX to the song holder, plus a ${tr(Fi - Oc)} STX network fee.`, Sa = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (mt.push(x("p", "Pay artists as you listen.")), (Id = d.gate) != null && Id.radioUrl) {
          const et = x("p");
          et.append(at("Open the pay-per-play radio →", d.gate.radioUrl)), mt.push(et);
        }
        Zt.push(x("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const et = [d.linked, ...d.others];
          mt.push(x("p", et.length > 1 ? `This device has listening wallets for ${At(et)}.` : `This device has a listening wallet for ${pt(d.linked)}.`)), Zt.push(x("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), et.slice(0, 3).forEach((Et, se) => Qt.push(O(`Open ${pt(Et)}`, () => Os(Et), se === 0 ? "primary" : "")));
        } else
          mt.push(x("p", "Connect your wallet to pay artists as you listen.")), Zt.push(x("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        mt.push(x("p", `This device's listening wallet belongs to ${pt(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Zt.push(x("p", `You are connected as ${pt(d.main)}. Switch to the linked wallet to continue listening.`)), Zt.push(x("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), Qt.push(O("Switch wallet", Dt, "primary"));
        break;
      case "not-invited":
        mt.push(x("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        mt.push(x("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        mt.push(x("p", "Every play counts for the song’s owner, on-chain.")), Zt.push(x("p", xa)), Zt.push(x("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Zt.push(x("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (mt.push(x("p", `This device already has a listening wallet for ${At(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Zt.push(x("p", `Otherwise, set up a new listening wallet for ${pt(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && Zt.push(x("p", `This is the listening wallet for ${pt(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && Zt.push(x("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const V = u.liveGift();
        Qt.push(O(V ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${pt(d.main)}` : "Start listening", () => void c.create(), "primary")), !V && !d.solo && d.main && d.others.length && Qt.push(O("Switch wallet", Dt)), !V && d.solo && Qt.push(O("I have a Stacks wallet", Dt)), Qt.push(O("I already have a listening wallet", () => void c.unlock(!0))), V && Qt.push(O("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (mt.push(x("p", "Locked.", "ppp-mute")), Qt.push(O("Unlock", () => void c.unlock(), "primary"))), d.standIn ? mn.push(O("Use a different listening wallet", () => void On().then((et) => {
          et === "stacks" && Dt();
        }), "quiet")) : mn.push(O("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        mt.push(x("p", `Link to ${pt(d.main)} · free`)), Zt.push(x("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Zt.push(x("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), Qt.push(O(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        mt.push(x("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && mt.push(ur(d.arrival)) : We(d) ? mt.push(x("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Ld = d.gift) != null && Ld.player ? mt.push(x("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? mt.push(x("p", "No plays left · add plays to keep counting", "ppp-bad")) : mt.push(x("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Fi)).toLocaleString()} plays`)), d.entries.length && Zt.push(x("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && Zt.push(x("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b ? Zt.push(x("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? Zt.push(x("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (Zt.push(x("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Zt.push(x("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && Qt.push(Fr("copy-address", "Copy my address", () => d.listening || "", "primary", () => fe(c.snapshot())))) : Zt.push(x("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const et = x("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          et.append(at("View", G(d.depositTxid))), mt.push(et);
        } else d.allowance > 0n && !d.solo && !d.depositPending && Qt.push(rn(d, `Deposit ${tr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        mt.push(x("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (mt.push(x("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), mt.push(Fs(d))), (!d.solo || d.returnTo) && Qt.push(O("Return excess", () => void c.returnFunds("excess"), "primary"), O("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((Cd = d.giftStop) == null ? void 0 : Cd.reason) !== "off") {
          const et = Math.min(d.session.playsLeft, d.playsLeft);
          mt.push(x("p", `${et.toLocaleString()} plays left`, "ppp-ok")), Zt.push(x("p", xa + " The heart likes or unlikes from this wallet for 0.0002 STX.")), Qt.push(O("Switch off", () => void c.switchOff()));
        } else
          mt.push(x("p", "Switch on music support to listen.", "ppp-mute")), Qt.push(O("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && mt.push(x("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && mt.push(x("p", "Running low on plays", "ppp-warn")), d.depositPending ? mt.push(x("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && Qt.push(rn(d, `Top up ${tr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const V = d.step === "fund", et = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      V ? Qt.unshift(O("Add plays", () => B.open(), "primary")) : et ? Qt.push(O("Add plays", () => B.open(), "primary")) : d.step === "ready" && mn.push(O("Add plays", () => B.open(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && Zt.push(x("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && Zt.push(Fs(d)), Zt.push(In()), d.slot === 0 && d.step === "ready" && d.entries.some((V) => V.kind === "play" && V.status === "confirmed"))) {
      const V = x("p", "New to Stacks? ", "ppp-mute");
      V.append(at("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), mt.push(V);
    }
    if (d.walletOutdated && Zt.push(x("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (mt.push(x("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), Qt.push(O("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && mn.push(O(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${pt(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((Td = d.gift) != null && Td.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && mn.push(Ni(d, "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && mn.push(O("Lock", () => void c.lock(), "quiet")), Z && !j && mn.push(O(Rt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Rt = !Rt, fe(c.snapshot());
    }, "quiet")), [...Qt, ...mn].forEach((V) => V.disabled = Sa), Sa && (Qt.length = 0), !bt && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Bd = d.gift) != null && Bd.player)) {
      const V = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", et = mt.at(0);
      d.step === "ready" && et ? et.append(x("span", ` · ${ar(d.balance)} STX`, V)) : mt.push(x("p", `Balance ${ar(d.balance)} STX`, V));
    }
    if (bt) {
      for (const Et of [...Qt, ...mn]) {
        const se = O6[Et.textContent ?? ""];
        se && (Et.textContent = se);
      }
      for (let Et = mt.length - 1; Et >= 0; Et--) Ep(mt[Et].textContent) && Zt.unshift(...mt.splice(Et, 1));
      for (let Et = Qt.length - 1; Et >= 0; Et--) Ep(Qt[Et].textContent) && mn.unshift(...Qt.splice(Et, 1));
      const V = d.entries.some((Et) => Et.kind === "play"), et = F6(d.step, { played: V, arriving: d.depositPending });
      et.length && mt.length && et.shift(), mt.push(...et.map((Et) => x("p", Et, "ppp-mute")));
    }
    if ((Md = d.gift) != null && Md.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const V = x("p", "", "ppp-gift");
      V.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && V.append(" · ", d.gift.player.subtitle);
      const et = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? x("span", " · plays on their way", "ppp-warn") : x("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      et && V.append(et);
      const Et = (Pd = mt.at(0)) == null ? void 0 : Pd.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && Et && /STX/.test(Et.textContent ?? "") && Et.remove(), mt.unshift(V), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          mt.splice(1, 0, x("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Ni(d, "primary"));
        else {
          const se = x("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          se.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), se.append(at("Xverse", "https://www.xverse.app/download"), " and ", at("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), mt.splice(1, 0, se);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const V = d.returnPlan, et = x("div", "", "ppp-pick");
      et.append(x("p", V.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const Et = x("ul", "", "ppp-gift-list");
      V.steps.forEach((se, Jr) => {
        const ts = se.kind === "gift" ? "the unused gift" : se.kind === "deposit" ? "what was added to it" : "the rest", xn = x("li");
        xn.append(x("span", `${Jr + 1}. ${tr(BigInt(se.send))} STX · ${ts}`, "t"), x("span", se.to ? ` → ${pt(se.to)}` : " → choose an address below", se.to ? "ppp-mute" : "ppp-warn")), Et.append(xn);
      }), et.append(Et), V.kept && et.append(x("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), V.steps.some((se) => !se.to) && et.append(Fs(d)), et.append(O(V.steps.length > 1 ? `Confirm part 1 of ${V.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), mt.push(et);
    }
    const w = Ui(d), M = S ? w : null, R = m(d, !!M), dt = R === "gift" || R === "arriving" || R === "new", Me = u.banner(f, { bare: !!M || R === "gift" || R === "arriving" }), Re = zt && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? Fe(zt, u.pendingCode()) : [];
    M || (mt.unshift(...Me), mt.push(...js(d)), mt.unshift(...Re)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && mt.unshift(x("p", `This is ${pt(d.creditedTo)}'s listening wallet. Plays and likes count for ${pt(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...mt);
    const Ln = document.querySelector(".ppp-switch");
    if (Ln) {
      const V = h.latest(), et = d.slot > 0, Et = ["fund", "ready", "over"].includes(d.step) && (et || !!V);
      if (Ln.hidden = !Et, Et) {
        const se = (xn, Ea, Aa, bl) => {
          const Ki = O("", bl, "ppp-tab");
          return Ki.setAttribute("aria-pressed", String(Aa)), Ki.append(x("span", xn, "tt"), x("span", Ea === void 0 ? "…" : `${Ae(Ea).toLocaleString()} plays`, "ts")), Ki.disabled = !!d.busy, Ki;
        }, Jr = et ? ((_d = (Nd = d.gift) == null ? void 0 : Nd.player) == null ? void 0 : _d.title) ?? "Album" : V.title, ts = O("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const xn = document.querySelector(".ppp-shelf");
          xn && (xn.hidden = !1, xn.open = !xn.open, ts.setAttribute("aria-expanded", String(xn.open)), xn.open && requestAnimationFrame(() => xn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        ts.setAttribute("aria-expanded", String(!!((Ud = document.querySelector(".ppp-shelf")) != null && Ud.open))), Ln.replaceChildren(
          se("🎧 My player", et ? (Od = d.likeFunds) == null ? void 0 : Od.balance : d.balance, !et, () => {
            et && c.openAlbum(0);
          }),
          se("💿 " + Jr, et ? d.balance : void 0, et, () => {
            !et && V && c.openAlbum(V.slot);
          }),
          ts
        );
      }
    }
    const ze = h.render(d), Gs = document.querySelector(".ppp-shelf");
    if (Gs) {
      Gs.hidden = !ze;
      const V = Gs.querySelector("summary");
      V && (V.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const et = Gs.querySelector(".ppp-shelf-body");
      ze && et && !et.contains(ze) && et.replaceChildren(ze);
    }
    const Fn = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !Fn, Fn && !s(".ppp-gift-body").contains(Fn) && s(".ppp-gift-body").replaceChildren(Fn), Fn && ne) {
      ne = !1;
      const V = s(".ppp-gifts");
      V.open = !0, requestAnimationFrame(() => V.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ji = document.querySelector("#ppp .ppp-featured");
    if (ji) {
      const V = te.length > 0 && d.slot === 0 && !((Hd = d.gift) != null && Hd.player) && d.step === "ready";
      ji.hidden = !V, V && ji.replaceChildren(x("p", "Albums in your player", "ppp-featured__h"), ...te.map((et) => {
        const Et = (vt == null ? void 0 : vt.id) === et.id, se = O("", () => Lt(Et ? null : et, !Et), "ppp-featured__a" + (Et ? " is-on" : "")), Jr = zr(et).length;
        return se.append(x("b", et.title), x("span", Et ? "Playing now · tap to go back to the radio" : `${et.subtitle ? et.subtitle + " · " : ""}${Jr} ${Jr === 1 ? "song" : "songs"}`)), se.setAttribute("aria-pressed", String(Et)), se.disabled = !!d.busy, se;
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
        const Jr = x("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), ts = x("p");
        ts.append(at("Find a name at BNS One →", "https://bns.one"));
        const xn = x("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ea = x("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Aa = x("p");
        Aa.append(at("See the giveaway →", "https://xtrata.xyz/giveaway")), et.replaceChildren(
          Et("Give your player a name", se, Jr, x("p", d.listening, "ppp-addr-full"), Fr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => fe(c.snapshot())), ts),
          Et("Link it to a wallet you already have", xn),
          Et("Bring a friend in", Ea, Aa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Zt), s(".ppp-actions").replaceChildren(...Qt), s(".ppp-actions2").replaceChildren(...mn);
    const zi = d.busy || d.message || "", Gi = s(".ppp-msg"), Qr = zi && mt.some((V) => (V.textContent ?? "").startsWith(zi.replace(/[.✓\s]+$/, ""))) ? "" : zi, xd = !Qr && !d.error ? d.notice : z && !Qr ? d.error : "";
    Gi.textContent = Qr || xd, Gi.classList.toggle("is-warn", !!xd), s(".ppp-err").textContent = z ? "" : d.error;
    const pb = d.entries.filter((V) => V.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...pb.slice(0, 5).map((V) => {
      const et = x("li"), Et = V.status === "confirmed" ? "ok" : V.status === "failed" ? "bad" : "warn";
      return et.append(x("span", "", "d " + Et), x("span", nn(V), "t"), x("span", I(V.created), "ppp-mute")), V.txid && et.append(at("tx", G(V.txid))), et;
    })), s(".ppp-wallets").hidden = !(De.childElementCount || mn.length), s(".ppp-more").hidden = !Zt.length;
    const Sd = s(".ppp-history");
    Sd.hidden = !d.entries.length, d.entries.length && oe(), Sd.replaceChildren(x("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((V) => {
      const et = x("div", "", "ppp-row"), Et = V.kind === "play" ? [x("span", nn(V), "ppp-song"), x("span", ` · ${tr(BigInt(V.amount))} STX to ${pt(V.recipient)}`, "ppp-mute")] : V.kind === "like" ? [x("span", `${V.liked ? "♥ Liked" : "Unliked"} ${nn(V)}`, "ppp-song"), x("span", ` · for ${d.linked ? pt(d.linked) : "this listening wallet"}`, "ppp-mute")] : [x("span", `Returned ${tr(BigInt(V.amount))} STX`, "ppp-song"), x("span", ` to ${pt(V.recipient)}`, "ppp-mute")];
      return et.append(
        x("span", Bi[V.status] || V.status, "ppp-status " + (Tr[V.status] || "")),
        ...Et,
        x("span", ` · ${new Date(V.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), V.txid && et.append(at("tx ↗", G(V.txid))), et;
    })), U == null || U.render(M ? Br(d, M, [...Re, ...Me]) : null), P(d, !!M, dt ? [...Re, ...Me] : Re, R), B.isOpen() && B.refresh(), Hi();
    const Ed = (w == null ? void 0 : w.mode) === "open" ? null : Ht(d);
    W == null || W.render((w == null ? void 0 : w.mode) === "open" ? Br(d, w, []) : Ed ? { ...Br(d, { mode: "open", player: Ed }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function Ui(f) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((d = f.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && lt({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const b = u.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const E = L();
    return E && (f.step === "locked" || ot && f.step === "loading") ? { mode: "locked", player: E.player } : null;
  }
  function Br(f, b, E) {
    var j, Z, ht, H, ct;
    const d = !!f.busy || f.armed, z = [...E];
    f.depositPending && f.arrival && z.push(ur(f.arrival)), f.error ? z.push(x("p", f.error, f.error === Fc ? "ppp-warn" : "ppp-bad")) : f.message && !d ? z.push(x("p", f.message, "ppp-cyan")) : f.notice && z.push(x("p", f.notice, "ppp-warn")), b.mode === "open" && Wt && ((j = f.likeFunds) != null && j.album) && f.likeFunds.low && !f.likeFunds.pending && z.push(x("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let ft = "Kept on this device with Face ID or your passkey. No app or account needed.", p = null, A = null;
    if (b.mode === "locked")
      p = { label: "Continue listening", run: () => {
        ot = L(), c.unlock();
      } }, A = { label: "Use a different passkey", run: () => {
        ot = null, c.unlock(!0);
      } };
    else if (b.mode === "arrive")
      if (f.step === "intro" && ec(jt) && jt.album === b.player.id) {
        const tt = window.XtrataRadio, gt = zr(b.player)[0], bt = jt.phase === "playing";
        p = { label: bt && !!((ht = (Z = tt == null ? void 0 : tt.getState) == null ? void 0 : Z.call(tt)) != null && ht.playing) ? "Pause" : bt ? "Carry on" : "Play the first song", run: () => {
          var ke, pe;
          bt ? (ke = tt == null ? void 0 : tt.playPause) == null || ke.call(tt) : gt && ((pe = tt == null ? void 0 : tt.playToken) == null || pe.call(tt, gt.id));
        } }, A = { label: "Make my player and hear it all", run: () => void c.create() }, ft = "The first song is free. Nothing to set up yet.";
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
      hint: p ? ft : void 0,
      asking: d,
      busy: !!f.busy,
      myPlays: Wr(f),
      topUps: uc,
      canMake: !!((ct = (H = f.gate) == null ? void 0 : H.gifts) != null && ct.admin)
    };
  }
  const Hn = document.getElementById("findBox"), Oi = document.getElementById("findBody"), Dn = Hn && Oi ? lI(Oi, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : Promise.reject(new Error("catalogue unavailable"))).then((f) => oI(f == null ? void 0 : f.tracks, (b, E) => ({ title: up(b, je(E.title) ? "" : E.title), artist: cp(b, E.artist || "") }))),
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
    }
  }) : null;
  Hn == null || Hn.addEventListener("toggle", () => {
    Hn.open && (Dn == null || Dn.load());
  });
  let ve = "";
  const Hi = () => {
    var b, E, d, z, ft;
    if (!Dn || !(Hn != null && Hn.open)) return;
    const f = `${!!((b = c.snapshot().albumLock) != null && b.locked)}|${((ft = (z = (d = (E = window.XtrataRadio) == null ? void 0 : E.getState) == null ? void 0 : d.call(E)) == null ? void 0 : z.nowPlaying) == null ? void 0 : ft.tokenId) ?? ""}`;
    f !== ve && (ve = f, Dn.refresh());
  }, Di = /* @__PURE__ */ new Map();
  let Mr = !1;
  const Zr = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((b) => {
      const E = b == null ? void 0 : b.nowPlaying;
      if (E && Number.isSafeInteger(Number(E.tokenId)) && Di.set(Number(E.tokenId), { title: E.title || void 0, artist: E.artist || void 0 }), Hi(), ec(jt)) {
        const d = !!(b != null && b.playing);
        yn({ kind: "now", track: E && E.tokenId != null ? String(E.tokenId) : null, playing: d, at: Date.now() }), d !== Mr && (Mr = d, fe(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Zr()) {
    const f = setInterval(() => {
      Zr() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const b = f.detail;
    if (ec(jt) && yn({ kind: "listened", at: Date.now() }), b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      oe();
      const E = wn(b.song, Di.get(b.song));
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
}, wI = () => yI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, bI = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, mI = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', hb = class {
  constructor(t) {
    c4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && LS(t), this.callback(nl(t));
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
    return zv(this);
  }
};
hb.style = mI;
const xI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: hb
}, Symbol.toStringTag, { value: "Module" }));
