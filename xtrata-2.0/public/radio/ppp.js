var Sb = Object.defineProperty;
var Eb = (t, e, n) => e in t ? Sb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Uo = (t, e, n) => Eb(t, typeof e != "symbol" ? e + "" : e, n);
var yn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Bp(t) {
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
      typeof yn < "u" && yn || {}, r = {
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
      function x($) {
        var _ = new FileReader(), m = y(_), B = /charset=([A-Za-z0-9_-]+)/.exec($.type), K = B ? B[1] : "utf-8";
        return _.readAsText($, K), m;
      }
      function v($) {
        for (var _ = new Uint8Array($), m = new Array(_.length), B = 0; B < _.length; B++)
          m[B] = String.fromCharCode(_[B]);
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
            return x(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(v(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(P);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var D = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function k($) {
        var _ = $.toUpperCase();
        return D.indexOf(_) > -1 ? _ : $;
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
            var N = new AbortController();
            return N.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && m)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(m), (this.method === "GET" || this.method === "HEAD") && (_.cache === "no-store" || _.cache === "no-cache")) {
          var B = /([?&])_=[^&]*/;
          if (B.test(this.url))
            this.url = this.url.replace(B, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var K = /\?/;
            this.url += (K.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      C.prototype.clone = function() {
        return new C(this, { body: this._bodyInit });
      };
      function P($) {
        var _ = new FormData();
        return $.trim().split("&").forEach(function(m) {
          if (m) {
            var B = m.split("="), K = B.shift().replace(/\+/g, " "), N = B.join("=").replace(/\+/g, " ");
            _.append(decodeURIComponent(K), decodeURIComponent(N));
          }
        }), _;
      }
      function Y($) {
        var _ = new h(), m = $.replace(/\r?\n[\t ]+/g, " ");
        return m.split("\r").map(function(B) {
          return B.indexOf(`
`) === 0 ? B.substr(1, B.length) : B;
        }).forEach(function(B) {
          var K = B.split(":"), N = K.shift().trim();
          if (N) {
            var at = K.join(":").trim();
            try {
              _.append(N, at);
            } catch (Z) {
              console.warn("Response " + Z.message);
            }
          }
        }), _;
      }
      U.call(C.prototype);
      function ot($, _) {
        if (!(this instanceof ot))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (_ || (_ = {}), this.type = "default", this.status = _.status === void 0 ? 200 : _.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = _.statusText === void 0 ? "" : "" + _.statusText, this.headers = new h(_.headers), this.url = _.url || "", this._initBody($);
      }
      U.call(ot.prototype), ot.prototype.clone = function() {
        return new ot(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new h(this.headers),
          url: this.url
        });
      }, ot.error = function() {
        var $ = new ot(null, { status: 200, statusText: "" });
        return $.ok = !1, $.status = 0, $.type = "error", $;
      };
      var X = [301, 302, 303, 307, 308];
      ot.redirect = function($, _) {
        if (X.indexOf(_) === -1)
          throw new RangeError("Invalid status code");
        return new ot(null, { status: _, headers: { location: $ } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(_, m) {
          this.message = _, this.name = m;
          var B = Error(_);
          this.stack = B.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function W($, _) {
        return new Promise(function(m, B) {
          var K = new C($, _);
          if (K.signal && K.signal.aborted)
            return B(new e.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function at() {
            N.abort();
          }
          N.onload = function() {
            var L = {
              statusText: N.statusText,
              headers: Y(N.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? L.status = 200 : L.status = N.status, L.url = "responseURL" in N ? N.responseURL : L.headers.get("X-Request-URL");
            var O = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              m(new ot(O, L));
            }, 0);
          }, N.onerror = function() {
            setTimeout(function() {
              B(new TypeError("Network request failed"));
            }, 0);
          }, N.ontimeout = function() {
            setTimeout(function() {
              B(new TypeError("Network request timed out"));
            }, 0);
          }, N.onabort = function() {
            setTimeout(function() {
              B(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function Z(L) {
            try {
              return L === "" && n.location.href ? n.location.href : L;
            } catch {
              return L;
            }
          }
          if (N.open(K.method, Z(K.url), !0), K.credentials === "include" ? N.withCredentials = !0 : K.credentials === "omit" && (N.withCredentials = !1), "responseType" in N && (r.blob ? N.responseType = "blob" : r.arrayBuffer && (N.responseType = "arraybuffer")), _ && typeof _.headers == "object" && !(_.headers instanceof h || n.Headers && _.headers instanceof n.Headers)) {
            var Et = [];
            Object.getOwnPropertyNames(_.headers).forEach(function(L) {
              Et.push(a(L)), N.setRequestHeader(L, c(_.headers[L]));
            }), K.headers.forEach(function(L, O) {
              Et.indexOf(O) === -1 && N.setRequestHeader(O, L);
            });
          } else
            K.headers.forEach(function(L, O) {
              N.setRequestHeader(O, L);
            });
          K.signal && (K.signal.addEventListener("abort", at), N.onreadystatechange = function() {
            N.readyState === 4 && K.signal.removeEventListener("abort", at);
          }), N.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return W.polyfill = !0, n.fetch || (n.fetch = W, n.Headers = h, n.Request = C, n.Response = ot), e.Headers = h, e.Request = C, e.Response = ot, e.fetch = W, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : yn);
})();
const Ab = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function vb(t, e) {
  const n = {};
  return Object.assign(n, Ab, e), await fetch(t, n);
}
function kb(t) {
  let e = vb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function $b(...t) {
  const { fetchLib: e, middlewares: n } = kb(t);
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
var ro;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(ro || (ro = {}));
var ci;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ci || (ci = {}));
var Rd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Rd || (Rd = {}));
const Ib = "https://api.mainnet.hiro.so", Lb = "https://api.testnet.hiro.so", Cb = "http://localhost:3999", Tb = ["mainnet", "testnet", "devnet", "mocknet"];
let so = class {
  constructor(e) {
    this.version = ci.Mainnet, this.chainId = ro.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ci.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? $b();
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
so.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new tu();
    case "testnet":
      return new Bb();
    case "devnet":
      return new Mb();
    case "mocknet":
      return new Mp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Tb.join(", ")}`);
  }
};
so.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : so.fromName(t);
let tu = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ib,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ci.Mainnet, this.chainId = ro.Mainnet;
  }
}, Bb = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Lb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ci.Testnet, this.chainId = ro.Testnet;
  }
}, Mp = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Cb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ci.Testnet, this.chainId = ro.Testnet;
  }
};
const Mb = Mp, Np = "xtrata.wallet.bridge.v1", Nb = (t) => typeof t == "object" && t !== null && t.protocol === Np, Pb = (t) => Nb(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", _b = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class Ho extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const zd = 12e4;
class Ub {
  constructor(e) {
    Uo(this, "pending", /* @__PURE__ */ new Map());
    Uo(this, "listenTarget");
    Uo(this, "closed", !1);
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
    Uo(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Pb(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new Ho("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new Ho("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new Ho("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = _b(), i = { protocol: Np, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new Ho(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? zd}ms.`
          )
        );
      }, this.options.timeoutMs ?? zd);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new Ho("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Hb = ["SP", "SM"], Ob = ["ST", "SN"], Db = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Hb.includes(n) ? "mainnet" : Ob.includes(n) ? "testnet" : null;
}, Fb = () => {
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
}, jb = () => typeof window > "u" || !window.localStorage ? Fb() : window.localStorage, xl = "xtrata.v15.1.wallet.session", Gd = "mainnet", dc = { isConnected: !1 }, Rb = (t) => t.address ? Db(t.address) ?? t.network : t.network, Pp = (t) => !t.isConnected || !t.address ? { ...dc } : Rb(t) !== Gd ? { ...dc } : {
  isConnected: !0,
  address: t.address,
  network: Gd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, zb = (t) => {
  if (!t)
    return { ...dc };
  try {
    const e = JSON.parse(t);
    return Pp(e);
  } catch {
    return { ...dc };
  }
}, Gb = (t) => {
  const e = Pp(t);
  return JSON.stringify(e);
}, Kb = (t) => {
  const e = jb();
  return {
    load: () => zb(e.getItem(xl)),
    save: (n) => {
      e.setItem(xl, Gb(n));
    },
    clear: () => {
      e.removeItem(xl);
    }
  };
}, Vb = "https://browser.blockstack.org/auth", qb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, _p = ["store_write"], Yb = "blockstack-session", Xb = {
  logLevel: "debug"
}, ki = {
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
Object.freeze(ki);
class Eo extends Error {
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
class Wb extends Eo {
  constructor(e, n = "") {
    super({ code: ki.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Kd extends Eo {
  constructor(e = "") {
    super({ code: ki.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class va extends Eo {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: ki.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Vd extends Eo {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: ki.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class eu extends Eo {
  constructor(e) {
    super({ code: ki.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Up extends Eo {
  constructor(e) {
    super({ code: ki.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const qd = ["debug", "info", "warn", "error", "none"], nu = {};
for (let t = 0; t < qd.length; t++) {
  const e = qd[t];
  nu[e] = t;
}
class Wi {
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
    return nu[Xb.logLevel] <= nu[e];
  }
}
function Zb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Qb() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Sl(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Jb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function tm() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function em(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function uf(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = tm(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Wi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = em(s, t.toString(), n);
    throw Wi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Us(t, e) {
  return ff(cn(t), e);
}
function cn(t) {
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
    return BigInt(`0x${bt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function nm(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Yd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function da(t, e = 8) {
  return (typeof t == "bigint" ? t : cn(t)).toString(16).padStart(e * 2, "0");
}
function Gc(t) {
  return parseInt(t, 16);
}
function ff(t, e = 16) {
  const n = da(t, e);
  return zt(n);
}
function rm(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function sm(t, e) {
  return t & BigInt(1) << e;
}
function ru(t) {
  return im(BigInt(`0x${bt(t)}`), BigInt(t.byteLength * 8));
}
function im(t, e) {
  return sm(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const om = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function bt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += om[n];
  return e;
}
function zt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = nm(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function $i(t) {
  return new TextEncoder().encode(t);
}
function ha(t) {
  return new TextDecoder().decode(t);
}
function am(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function cm(t) {
  return String.fromCharCode.apply(null, t);
}
function lm(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Xd(t) {
  if (t.some(lm))
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
function _e(t) {
  return $r(...t.map((e) => typeof e == "number" ? Xd([e]) : e instanceof Array ? Xd(e) : e));
}
function vn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Hp = "https://api.mainnet.hiro.so", Op = "https://api.testnet.hiro.so", Dp = "http://localhost:3999", um = "https://hub.blockstack.org", fm = 33, El = 32;
function dm(t) {
  if (t.length < El * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + El * 2), r = t.slice(2 + El * 2);
  return {
    recoveryId: Gc(e),
    r: n,
    s: r
  };
}
function df(t) {
  const e = typeof t == "string" ? zt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function hm(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function pm(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function gm(t, e) {
  return t[e];
}
function ym(t, e, n = 0) {
  return t[n] = e, t;
}
function wm(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function li(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const bm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function mm(t, e) {
  const n = {};
  return Object.assign(n, bm, e), await fetch(t, n);
}
function xm(t) {
  let e = mm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Sm(...t) {
  const { fetchLib: e, middlewares: n } = xm(t);
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
class Fp {
  constructor(e = _p.slice(), n = ((a) => (a = uf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Vb) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function su(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function Em(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function jp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Am(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  su(t.outputLen), su(t.blockLen);
}
function vm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function km(t, e) {
  jp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Js = {
  number: su,
  bool: Em,
  bytes: jp,
  hash: Am,
  exists: vm,
  output: km
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Al = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, $m = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!$m)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Im(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hf(t) {
  if (typeof t == "string" && (t = Im(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Rp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ii(t) {
  const e = (r) => t().update(hf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let zp = class extends Rp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Js.hash(e);
    const r = hf(n);
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
const Kc = (t, e, n) => new zp(t, e).update(n).digest();
Kc.create = (t, e) => new zp(t, e);
function Lm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let pf = class extends Rp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Al(this.buffer);
  }
  update(e) {
    Js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = hf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Al(e);
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
    Lm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Al(e), c = this.outputLen;
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
const Cm = (t, e, n) => t & e ^ ~t & n, Tm = (t, e, n) => t & e ^ t & n ^ e & n, Bm = new Uint32Array([
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
let Gp = class extends pf {
  constructor() {
    super(64, 32, 8, !1), this.A = ss[0] | 0, this.B = ss[1] | 0, this.C = ss[2] | 0, this.D = ss[3] | 0, this.E = ss[4] | 0, this.F = ss[5] | 0, this.G = ss[6] | 0, this.H = ss[7] | 0;
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
      const y = is[l - 15], g = is[l - 2], x = hr(y, 7) ^ hr(y, 18) ^ y >>> 3, v = hr(g, 17) ^ hr(g, 19) ^ g >>> 10;
      is[l] = v + is[l - 7] + x + is[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), g = h + y + Cm(a, c, u) + Bm[l] + is[l] | 0, v = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + Tm(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    is.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Mm = class extends Gp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const io = Ii(() => new Gp());
Ii(() => new Mm());
const Nm = {}, Kp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Nm
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const jt = BigInt(0), me = BigInt(1), Ts = BigInt(2), qo = BigInt(3), Wd = BigInt(8), re = Object.freeze({
  a: jt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: me,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Zd = (t, e) => (t + e / Ts) / e, ka = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = re, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -me * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Zd(i * t, e), c = Zd(-r * t, e);
    let u = it(t - a * n - c * s, e), h = it(-a * r - c * i, e);
    const l = u > o, y = h > o;
    if (l && (u = e - u), y && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: h };
  }
}, ar = 32, ui = 32, Vp = 32, hc = ar + 1, pc = 2 * ar + 1;
function Qd(t) {
  const { a: e, b: n } = re, r = it(t * t), s = it(r * t);
  return it(s + e * t + n);
}
const $a = re.a === jt;
class gf extends Error {
  constructor(e) {
    super(e);
  }
}
function Jd(t) {
  if (!(t instanceof Vt))
    throw new TypeError("JacobianPoint expected");
}
class Vt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ut))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ut.ZERO) ? Vt.ZERO : new Vt(e.x, e.y, me);
  }
  static toAffineBatch(e) {
    const n = Om(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Vt.toAffineBatch(e).map(Vt.fromAffine);
  }
  equals(e) {
    Jd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = it(s * s), u = it(a * a), h = it(n * u), l = it(i * c), y = it(it(r * a) * u), g = it(it(o * s) * c);
    return h === l && y === g;
  }
  negate() {
    return new Vt(this.x, it(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = it(e * e), i = it(n * n), o = it(i * i), a = e + i, c = it(Ts * (it(a * a) - s - o)), u = it(qo * s), h = it(u * u), l = it(h - Ts * c), y = it(u * (c - l) - Wd * o), g = it(Ts * n * r);
    return new Vt(l, y, g);
  }
  add(e) {
    Jd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === jt || o === jt)
      return this;
    if (n === jt || r === jt)
      return e;
    const c = it(s * s), u = it(a * a), h = it(n * u), l = it(i * c), y = it(it(r * a) * u), g = it(it(o * s) * c), x = it(l - h), v = it(g - y);
    if (x === jt)
      return v === jt ? this.double() : Vt.ZERO;
    const T = it(x * x), U = it(x * T), D = it(h * T), k = it(v * v - U - Ts * D), C = it(v * (D - k) - y * U), P = it(s * a * x);
    return new Vt(k, C, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Vt.ZERO;
    if (typeof e == "bigint" && e === jt)
      return n;
    let r = nh(e);
    if (r === me)
      return this;
    if (!$a) {
      let l = n, y = this;
      for (; r > jt; )
        r & me && (l = l.add(y)), y = y.double(), r >>= me;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ka.splitScalar(r), c = n, u = n, h = this;
    for (; i > jt || a > jt; )
      i & me && (c = c.add(h)), a & me && (u = u.add(h)), h = h.double(), i >>= me, a >>= me;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Vt(it(u.x * ka.beta), u.y, u.z), c.add(u);
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
    !n && this.equals(Vt.BASE) && (n = Ut.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && iu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Vt.normalizeZ(s), iu.set(n, s)));
    let i = Vt.ZERO, o = Vt.BASE;
    const a = 1 + ($a ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const g = y * c;
      let x = Number(e & u);
      e >>= l, x > c && (x -= h, e += me);
      const v = g, T = g + Math.abs(x) - 1, U = y % 2 !== 0, D = x < 0;
      x === 0 ? o = o.add(Ia(U, s[v])) : i = i.add(Ia(D, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = nh(e), s, i;
    if ($a) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ka.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: y, f: g } = this.wNAF(u, n);
      h = Ia(o, h), y = Ia(c, y), y = new Vt(it(y.x * ka.beta), y.y, y.z), s = h.add(y), i = l.add(g);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Vt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Vt.ZERO);
    e == null && (e = i ? Wd : Ao(s));
    const o = e, a = it(o * o), c = it(a * o), u = it(n * a), h = it(r * c), l = it(s * o);
    if (i)
      return Ut.ZERO;
    if (l !== me)
      throw new Error("invZ was invalid");
    return new Ut(u, h);
  }
}
Vt.BASE = new Vt(re.Gx, re.Gy, me);
Vt.ZERO = new Vt(jt, me, jt);
function Ia(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const iu = /* @__PURE__ */ new WeakMap();
class Ut {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, iu.delete(this);
  }
  hasEvenY() {
    return this.y % Ts === jt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Hn(n ? e : e.subarray(1));
    if (!nc(r))
      throw new Error("Point is not on curve");
    const s = Qd(r);
    let i = Hm(s);
    const o = (i & me) === me;
    n ? o && (i = it(-i)) : (e[0] & 1) === 1 !== o && (i = it(-i));
    const a = new Ut(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Hn(e.subarray(1, ar + 1)), r = Hn(e.subarray(ar + 1, ar * 2 + 1)), s = new Ut(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ir(e), r = n.length, s = n[0];
    if (r === ar)
      return this.fromCompressedHex(n);
    if (r === hc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === pc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${hc} compressed bytes or ${pc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ut.BASE.multiply(fi(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Xp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = yf(Ir(e)), { n: a } = re, c = r === 2 || r === 3 ? s + a : s, u = Ao(c, a), h = it(-o * u, a), l = it(i * u, a), y = r & 1 ? "03" : "02", g = Ut.fromHex(y + Ms(c)), x = Ut.BASE.multiplyAndAddUnsafe(g, h, l);
    if (!x)
      throw new Error("Cannot recover signature: point at infinify");
    return x.assertValidity(), x;
  }
  toRawBytes(e = !1) {
    return Ns(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ms(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ms(this.y)}`;
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
    const s = it(r * r), i = Qd(n);
    if (it(s - i) !== jt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ut(this.x, it(-this.y));
  }
  double() {
    return Vt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Vt.fromAffine(this).add(Vt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Vt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Vt.fromAffine(this), i = n === jt || n === me || this !== Ut.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Vt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Vt.ZERO) ? void 0 : a.toAffine();
  }
}
Ut.BASE = new Ut(re.Gx, re.Gy);
Ut.ZERO = new Ut(jt, jt);
function th(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function eh(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${oo(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Hn(n), left: t.subarray(e + 2) };
}
function Pm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${oo(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = eh(t.subarray(2)), { data: r, left: s } = eh(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${oo(s)}`);
  return { r: e, s: r };
}
class Un {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromCompact(e) {
    const n = e instanceof Uint8Array, r = "Signature.fromCompact";
    if (typeof e != "string" && !n)
      throw new TypeError(`${r}: Expected string or Uint8Array`);
    const s = n ? oo(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Un(gc(s.slice(0, 64)), gc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Pm(n ? e : Ns(e));
    return new Un(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!co(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!co(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = re.n >> me;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Un(this.r, it(-this.s, re.n)) : this;
  }
  toDERRawBytes() {
    return Ns(this.toDERHex());
  }
  toDERHex() {
    const e = th(Oo(this.s)), n = th(Oo(this.r)), r = e.length / 2, s = n.length / 2, i = Oo(r), o = Oo(s);
    return `30${Oo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Ns(this.toCompactHex());
  }
  toCompactHex() {
    return Ms(this.r) + Ms(this.s);
  }
}
function Ls(...t) {
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
const _m = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oo(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += _m[t[n]];
  return e;
}
const Um = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ms(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(jt <= t && t < Um))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ao(t) {
  const e = Ns(Ms(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function Oo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function gc(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Ns(t) {
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
  return gc(oo(t));
}
function Ir(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Ns(t);
}
function nh(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && co(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function it(t, e = re.P) {
  const n = t % e;
  return n >= jt ? n : e + n;
}
function Gn(t, e) {
  const { P: n } = re;
  let r = t;
  for (; e-- > jt; )
    r *= r, r %= n;
  return r;
}
function Hm(t) {
  const { P: e } = re, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = Gn(u, qo) * u % e, l = Gn(h, qo) * u % e, y = Gn(l, Ts) * c % e, g = Gn(y, r) * y % e, x = Gn(g, s) * g % e, v = Gn(x, o) * x % e, T = Gn(v, a) * v % e, U = Gn(T, o) * x % e, D = Gn(U, qo) * u % e, k = Gn(D, i) * g % e, C = Gn(k, n) * c % e, P = Gn(C, Ts);
  if (P * P % e !== t)
    throw new Error("Cannot find square root");
  return P;
}
function Ao(t, e = re.P) {
  if (t === jt || e <= jt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = it(t, e), r = e, s = jt, i = me;
  for (; n !== jt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== me)
    throw new Error("invert: does not exist");
  return it(s, e);
}
function Om(t, e = re.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === jt ? i : (n[a] = i, it(i * o, e)), me), s = Ao(r, e);
  return t.reduceRight((i, o, a) => o === jt ? i : (n[a] = it(i * n[a], e), it(i * o, e)), s), n;
}
function Dm(t) {
  const e = t.length * 8 - ui * 8, n = Hn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function yf(t, e = !1) {
  const n = Dm(t);
  if (e)
    return n;
  const { n: r } = re;
  return n >= r ? n - r : n;
}
let eo, Yo;
class qp {
  constructor(e, n) {
    if (this.hashLen = e, this.qByteLen = n, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof n != "number" || n < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Te.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Yo(this.k, ...e);
  }
  checkSync() {
    if (typeof Yo != "function")
      throw new gf("hmacSha256Sync needs to be set");
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
    return Ls(...n);
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
    return Ls(...n);
  }
}
function co(t) {
  return jt < t && t < re.n;
}
function nc(t) {
  return jt < t && t < re.P;
}
function Yp(t, e, n, r = !0) {
  const { n: s } = re, i = yf(t, !0);
  if (!co(i))
    return;
  const o = Ao(i, s), a = Ut.BASE.multiply(i), c = it(a.x, s);
  if (c === jt)
    return;
  const u = it(o * it(e + n * c, s), s);
  if (u === jt)
    return;
  let h = new Un(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & me);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function fi(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * ui)
      throw new Error("Expected 32 bytes of private key");
    e = gc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== ui)
      throw new Error("Expected 32 bytes of private key");
    e = Hn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!co(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function wf(t) {
  return t instanceof Ut ? (t.assertValidity(), t) : Ut.fromHex(t);
}
function Xp(t) {
  if (t instanceof Un)
    return t.assertValidity(), t;
  try {
    return Un.fromDER(t);
  } catch {
    return Un.fromCompact(t);
  }
}
function pa(t, e = !1) {
  return Ut.fromPrivateKey(t).toRawBytes(e);
}
function Fm(t, e, n, r = !1) {
  return Ut.fromSignature(t, e, n).toRawBytes(r);
}
function rh(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === hc || r === pc : n ? r === hc * 2 || r === pc * 2 : t instanceof Ut;
}
function bf(t, e, n = !1) {
  if (rh(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!rh(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = wf(e);
  return r.assertValidity(), r.multiply(fi(t)).toRawBytes(n);
}
function Wp(t) {
  const e = t.length > ar ? t.slice(0, ar) : t;
  return Hn(e);
}
function jm(t) {
  const e = Wp(t), n = it(e, re.n);
  return Zp(n < jt ? e : n);
}
function Zp(t) {
  return ao(t);
}
function Qp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ir(t), s = fi(e), i = [Zp(s), jm(r)];
  if (n != null) {
    n === !0 && (n = Te.randomBytes(ar));
    const c = Ir(n);
    if (c.length !== ar)
      throw new Error(`sign: Expected ${ar} bytes of extra data`);
    i.push(c);
  }
  const o = Ls(...i), a = Wp(r);
  return { seed: o, m: a, d: s };
}
function Jp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Rm(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Qp(t, e, n.extraEntropy), o = new qp(Vp, ui);
  await o.reseed(r);
  let a;
  for (; !(a = Yp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return Jp(a, n);
}
function Vc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Qp(t, e, n.extraEntropy), o = new qp(Vp, ui);
  o.reseedSync(r);
  let a;
  for (; !(a = Yp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return Jp(a, n);
}
const zm = { strict: !0 };
function Gm(t, e, n, r = zm) {
  let s;
  try {
    s = Xp(t), e = Ir(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = yf(e);
  let c;
  try {
    c = wf(n);
  } catch {
    return !1;
  }
  const { n: u } = re, h = Ao(o, u), l = it(a * h, u), y = it(i * h, u), g = Ut.BASE.multiplyAndAddUnsafe(c, l, y);
  return g ? it(g.x, u) === i : !1;
}
function yc(t) {
  return it(Hn(t), re.n);
}
class lo {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ir(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Hn(n.subarray(0, 32)), s = Hn(n.subarray(32, 64));
    return new lo(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!nc(e) || !co(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ms(this.r) + Ms(this.s);
  }
  toRawBytes() {
    return Ns(this.toHex());
  }
}
function Km(t) {
  return Ut.fromPrivateKey(t).toRawX();
}
class tg {
  constructor(e, n, r = Te.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ir(e);
    const { x: s, scalar: i } = this.getScalar(fi(n));
    if (this.px = s, this.d = i, this.rand = Ir(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ut.fromPrivateKey(e), r = n.hasEvenY() ? e : re.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ao(e ^ Hn(n));
  }
  finalizeNonce(e) {
    const n = it(Hn(e), re.n);
    if (n === jt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new lo(e.x, it(n + r * s, re.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Te.taggedHash, o = this.initNonce(n, await i(Is.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Is.nonce, o, r, e)), h = yc(await i(Is.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await rg(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Te.taggedHashSync, o = this.initNonce(n, i(Is.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Is.nonce, o, r, e)), h = yc(i(Is.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return sg(l, e, r) || this.error(), l;
  }
}
async function Vm(t, e, n) {
  return new tg(t, e, n).calc();
}
function qm(t, e, n) {
  return new tg(t, e, n).calcSync();
}
function eg(t, e, n) {
  const r = t instanceof lo, s = r ? t : lo.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ir(e),
    P: wf(n)
  };
}
function ng(t, e, n, r) {
  const s = Ut.BASE.multiplyAndAddUnsafe(e, fi(n), it(-r, re.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function rg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = eg(t, e, n), a = yc(await Te.taggedHash(Is.challenge, ao(r), o.toRawX(), i));
    return ng(r, o, s, a);
  } catch {
    return !1;
  }
}
function sg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = eg(t, e, n), a = yc(Te.taggedHashSync(Is.challenge, ao(r), o.toRawX(), i));
    return ng(r, o, s, a);
  } catch (r) {
    if (r instanceof gf)
      throw r;
    return !1;
  }
}
const Ym = {
  Signature: lo,
  getPublicKey: Km,
  sign: Vm,
  verify: rg,
  signSync: qm,
  verifySync: sg
};
Ut.BASE._setWindowSize(8);
const Bn = {
  node: Kp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Is = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, La = {}, Te = {
  bytesToHex: oo,
  hexToBytes: Ns,
  concatBytes: Ls,
  mod: it,
  invert: Ao,
  isValidPrivateKey(t) {
    try {
      return fi(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ao,
  _normalizePrivateKey: fi,
  hashToPrivateKey: (t) => {
    t = Ir(t);
    const e = ui + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = it(Hn(t), re.n - me) + me;
    return ao(n);
  },
  randomBytes: (t = 32) => {
    if (Bn.web)
      return Bn.web.getRandomValues(new Uint8Array(t));
    if (Bn.node) {
      const { randomBytes: e } = Bn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Te.hashToPrivateKey(Te.randomBytes(ui + 8)),
  precompute(t = 8, e = Ut.BASE) {
    const n = e === Ut.BASE ? e : new Ut(e.x, e.y);
    return n._setWindowSize(t), n.multiply(qo), n;
  },
  sha256: async (...t) => {
    if (Bn.web) {
      const e = await Bn.web.subtle.digest("SHA-256", Ls(...t));
      return new Uint8Array(e);
    } else if (Bn.node) {
      const { createHash: e } = Bn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Bn.web) {
      const n = await Bn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ls(...e), s = await Bn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Bn.node) {
      const { createHmac: n } = Bn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = La[t];
    if (n === void 0) {
      const r = await Te.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ls(r, r), La[t] = n;
    }
    return Te.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof eo != "function")
      throw new gf("sha256Sync is undefined, you need to set it");
    let n = La[t];
    if (n === void 0) {
      const r = eo(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ls(r, r), La[t] = n;
    }
    return eo(n, ...e);
  },
  _JacobianPoint: Vt
};
Object.defineProperties(Te, {
  sha256Sync: {
    configurable: !1,
    get() {
      return eo;
    },
    set(t) {
      eo || (eo = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Yo;
    },
    set(t) {
      Yo || (Yo = t);
    }
  }
});
const Xm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: re,
  Point: Ut,
  Signature: Un,
  getPublicKey: pa,
  getSharedSecret: bf,
  recoverPublicKey: Fm,
  schnorr: Ym,
  sign: Rm,
  signSync: Vc,
  utils: Te,
  verify: Gm
}, Symbol.toStringTag, { value: "Module" }));
var ga = {};
ga.byteLength = t1;
var Wm = ga.toByteArray = n1, Zm = ga.fromByteArray = i1, mr = [], qn = [], Qm = typeof Uint8Array < "u" ? Uint8Array : Array, vl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var zi = 0, Jm = vl.length; zi < Jm; ++zi)
  mr[zi] = vl[zi], qn[vl.charCodeAt(zi)] = zi;
qn[45] = 62;
qn[95] = 63;
function ig(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function t1(t) {
  var e = ig(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function e1(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function n1(t) {
  var e, n = ig(t), r = n[0], s = n[1], i = new Qm(e1(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = qn[t.charCodeAt(c)] << 18 | qn[t.charCodeAt(c + 1)] << 12 | qn[t.charCodeAt(c + 2)] << 6 | qn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = qn[t.charCodeAt(c)] << 2 | qn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = qn[t.charCodeAt(c)] << 10 | qn[t.charCodeAt(c + 1)] << 4 | qn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function r1(t) {
  return mr[t >> 18 & 63] + mr[t >> 12 & 63] + mr[t >> 6 & 63] + mr[t & 63];
}
function s1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(r1(r));
  return s.join("");
}
function i1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(s1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    mr[e >> 2] + mr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    mr[e >> 10] + mr[e >> 4 & 63] + mr[e << 2 & 63] + "="
  )), s.join("");
}
function o1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const a1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function c1() {
  if (o1())
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
    throw new Error(a1);
  }
}
class l1 {
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
class u1 {
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
async function og() {
  const t = await c1();
  return t.name === "subtleCrypto" ? new u1(t.lib) : new l1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function f1(t) {
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
    for (var x = 0, v = 0, T = 0, U = g.length; T !== U && g[T] === 0; )
      T++, x++;
    for (var D = (U - T) * u + 1 >>> 0, k = new Uint8Array(D); T !== U; ) {
      for (var C = g[T], P = 0, Y = D - 1; (C !== 0 || P < v) && Y !== -1; Y--, P++)
        C += 256 * k[Y] >>> 0, k[Y] = C % o >>> 0, C = C / o >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      v = P, T++;
    }
    for (var ot = D - v; ot !== D && k[ot] === 0; )
      ot++;
    for (var X = a.repeat(x); ot < D; ++ot)
      X += t.charAt(k[ot]);
    return X;
  }
  function l(g) {
    if (typeof g != "string")
      throw new TypeError("Expected String");
    if (g.length === 0)
      return new Uint8Array();
    for (var x = 0, v = 0, T = 0; g[x] === a; )
      v++, x++;
    for (var U = (g.length - x) * c + 1 >>> 0, D = new Uint8Array(U); g[x]; ) {
      var k = g.charCodeAt(x);
      if (k > 255)
        return;
      var C = e[k];
      if (C === 255)
        return;
      for (var P = 0, Y = U - 1; (C !== 0 || P < T) && Y !== -1; Y--, P++)
        C += o * D[Y] >>> 0, D[Y] = C % 256 >>> 0, C = C / 256 >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      T = P, x++;
    }
    for (var ot = U - T; ot !== U && D[ot] === 0; )
      ot++;
    for (var X = new Uint8Array(v + (U - ot)), W = v; ot !== U; )
      X[W++] = D[ot++];
    return X;
  }
  function y(g) {
    var x = l(g);
    if (x)
      return x;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: h,
    decodeUnsafe: l,
    decode: y
  };
}
var ag = f1;
const d1 = ag, h1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var p1 = d1(h1);
const g1 = /* @__PURE__ */ Bp(p1), y1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cg = Uint8Array.from({ length: 16 }, (t, e) => e), w1 = cg.map((t) => (9 * t + 5) % 16);
let mf = [cg], xf = [w1];
for (let t = 0; t < 4; t++)
  for (let e of [mf, xf])
    e.push(e[t].map((n) => y1[n]));
const lg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), b1 = mf.map((t, e) => t.map((n) => lg[e][n])), m1 = xf.map((t, e) => t.map((n) => lg[e][n])), x1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), S1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ca = (t, e) => t << e | t >>> 32 - e;
function sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ta = new Uint32Array(16);
let E1 = class extends pf {
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
      const x = 4 - g, v = x1[g], T = S1[g], U = mf[g], D = xf[g], k = b1[g], C = m1[g];
      for (let P = 0; P < 16; P++) {
        const Y = Ca(r + sh(g, i, a, u) + Ta[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Ca(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Ca(s + sh(x, o, c, h) + Ta[D[P]] + T, C[P]) + y | 0;
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
const A1 = Ii(() => new E1());
function v1(t) {
  return A1(t);
}
const Ba = BigInt(2 ** 32 - 1), ou = BigInt(32);
function ug(t, e = !1) {
  return e ? { h: Number(t & Ba), l: Number(t >> ou & Ba) } : { h: Number(t >> ou & Ba) | 0, l: Number(t & Ba) | 0 };
}
function k1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ug(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const $1 = (t, e) => BigInt(t >>> 0) << ou | BigInt(e >>> 0), I1 = (t, e, n) => t >>> n, L1 = (t, e, n) => t << 32 - n | e >>> n, C1 = (t, e, n) => t >>> n | e << 32 - n, T1 = (t, e, n) => t << 32 - n | e >>> n, B1 = (t, e, n) => t << 64 - n | e >>> n - 32, M1 = (t, e, n) => t >>> n - 32 | e << 64 - n, N1 = (t, e) => e, P1 = (t, e) => t, _1 = (t, e, n) => t << n | e >>> 32 - n, U1 = (t, e, n) => e << n | t >>> 32 - n, H1 = (t, e, n) => e << n - 32 | t >>> 64 - n, O1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function D1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const F1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), j1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, R1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), z1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, G1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), K1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Lt = {
  fromBig: ug,
  split: k1,
  toBig: $1,
  shrSH: I1,
  shrSL: L1,
  rotrSH: C1,
  rotrSL: T1,
  rotrBH: B1,
  rotrBL: M1,
  rotr32H: N1,
  rotr32L: P1,
  rotlSH: _1,
  rotlSL: U1,
  rotlBH: H1,
  rotlBL: O1,
  add: D1,
  add3L: F1,
  add3H: j1,
  add4L: R1,
  add4H: z1,
  add5H: K1,
  add5L: G1
}, [V1, q1] = Lt.split([
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
].map((t) => BigInt(t))), os = new Uint32Array(80), as = new Uint32Array(80);
let qc = class extends pf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: x, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = x | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      os[k] = e.getUint32(n), as[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = os[k - 15] | 0, P = as[k - 15] | 0, Y = Lt.rotrSH(C, P, 1) ^ Lt.rotrSH(C, P, 8) ^ Lt.shrSH(C, P, 7), ot = Lt.rotrSL(C, P, 1) ^ Lt.rotrSL(C, P, 8) ^ Lt.shrSL(C, P, 7), X = os[k - 2] | 0, W = as[k - 2] | 0, $ = Lt.rotrSH(X, W, 19) ^ Lt.rotrBH(X, W, 61) ^ Lt.shrSH(X, W, 6), _ = Lt.rotrSL(X, W, 19) ^ Lt.rotrBL(X, W, 61) ^ Lt.shrSL(X, W, 6), m = Lt.add4L(ot, _, as[k - 7], as[k - 16]), B = Lt.add4H(m, Y, $, os[k - 7], os[k - 16]);
      os[k] = B | 0, as[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: x, Gh: v, Gl: T, Hh: U, Hl: D } = this;
    for (let k = 0; k < 80; k++) {
      const C = Lt.rotrSH(l, y, 14) ^ Lt.rotrSH(l, y, 18) ^ Lt.rotrBH(l, y, 41), P = Lt.rotrSL(l, y, 14) ^ Lt.rotrSL(l, y, 18) ^ Lt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, ot = y & x ^ ~y & T, X = Lt.add5L(D, P, ot, q1[k], as[k]), W = Lt.add5H(X, U, C, Y, V1[k], os[k]), $ = X | 0, _ = Lt.rotrSH(r, s, 28) ^ Lt.rotrBH(r, s, 34) ^ Lt.rotrBH(r, s, 39), m = Lt.rotrSL(r, s, 28) ^ Lt.rotrBL(r, s, 34) ^ Lt.rotrBL(r, s, 39), B = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, D = T | 0, v = g | 0, T = x | 0, g = l | 0, x = y | 0, { h: l, l: y } = Lt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Lt.add3L($, m, K);
      r = Lt.add3H(N, W, _, B), s = N | 0;
    }
    ({ h: r, l: s } = Lt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Lt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Lt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Lt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Lt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: x } = Lt.add(this.Fh | 0, this.Fl | 0, g | 0, x | 0), { h: v, l: T } = Lt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: D } = Lt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, x, v, T, U, D);
  }
  roundClean() {
    os.fill(0), as.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Y1 = class extends qc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, X1 = class extends qc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, W1 = class extends qc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Z1 = Ii(() => new qc());
Ii(() => new Y1());
Ii(() => new X1());
Ii(() => new W1());
function fg(t) {
  return io(t);
}
function Q1(t) {
  return Z1(t);
}
const J1 = 0;
Te.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(io, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function t2() {
  return bt(Te.randomPrivateKey());
}
function e2(t) {
  const e = io(io(t));
  return g1.encode($r(t, e).slice(0, t.length + 4));
}
function n2(t, e) {
  return e2($r(new Uint8Array([t]), e.slice(0, 20)));
}
function dg(t, e = J1) {
  const n = typeof t == "string" ? zt(t) : t, r = v1(fg(n));
  return n2(e, r);
}
function hg(t) {
  const e = df(t);
  return bt(pa(e.slice(0, 32), !0));
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(io, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var wc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(wc || (wc = {}));
async function r2(t, e, n) {
  return await (await og()).encrypt("aes-256-cbc", e, t, n);
}
async function s2(t, e, n) {
  return await (await og()).decrypt("aes-256-cbc", e, t, n);
}
function pg(t, e) {
  return Kc(io, t, e);
}
function i2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function gg(t) {
  const e = Q1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function o2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function a2(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !o2(t))
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
async function c2(t, e, n, r) {
  const s = a2(t);
  if (!s.result)
    throw s;
  const i = Te.randomPrivateKey(), o = pa(i, !0);
  let a = bf(i, t, !0);
  a = a.slice(1);
  const c = gg(a), u = Te.randomBytes(16), h = await r2(u, c.encryptionKey, e), l = $r(u, o, h), y = pg(c.hmacKey, l);
  let g;
  if (!r || r === "hex")
    g = bt(h);
  else if (r === "base64")
    g = Zm(h);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const x = {
    iv: bt(u),
    ephemeralPK: bt(o),
    cipherText: g,
    mac: bt(y),
    wasString: n
  };
  return r && r !== "hex" && (x.cipherTextEncoding = r), x;
}
async function yg(t, e) {
  if (!e.ephemeralPK)
    throw new Vd("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = bf(t, n, !0);
  r = r.slice(1);
  const s = gg(r), i = zt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = zt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Wm(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = $r(i, zt(n), o), c = pg(s.hmacKey, a), u = zt(e.mac);
  if (!i2(u, c))
    throw new Vd("Decryption failed: failure in MAC check");
  const h = await s2(i, s.encryptionKey, o);
  return e.wasString ? ha(h) : h;
}
function l2(t, e) {
  const n = typeof e == "string" ? $i(e) : e, r = hg(t), s = fg(n), i = Vc(s, t);
  return {
    signature: bt(i),
    publicKey: r
  };
}
async function u2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = hg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? $i(t) : t, o = await c2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = l2(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function f2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return yg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Ze = {}, uo = {}, pn = {};
Object.defineProperty(pn, "__esModule", { value: !0 });
pn.decode = pn.encode = pn.unescape = pn.escape = pn.pad = void 0;
const wg = ga;
function Sf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
pn.pad = Sf;
function bg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
pn.escape = bg;
function mg(t) {
  return Sf(t).replace(/-/g, "+").replace(/_/g, "/");
}
pn.unescape = mg;
function d2(t) {
  return bg((0, wg.fromByteArray)(new TextEncoder().encode(t)));
}
pn.encode = d2;
function h2(t) {
  return new TextDecoder().decode((0, wg.toByteArray)(Sf(mg(t))));
}
pn.decode = h2;
var Yc = {}, Xc = {}, xg = {}, Sg = {}, Wc = {};
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.crypto = void 0;
Wc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = y, t.rotl = g, t.byteSwap = x, t.byteSwap32 = v, t.bytesToHex = D, t.hexToBytes = P, t.asyncLoop = ot, t.utf8ToBytes = X, t.bytesToUtf8 = W, t.toBytes = $, t.kdfInputToBytes = _, t.concatBytes = m, t.checkOpts = B, t.createHasher = N, t.createOptHasher = at, t.createXOFer = Z, t.randomBytes = Et;
  const e = Wc;
  function n(L) {
    return L instanceof Uint8Array || ArrayBuffer.isView(L) && L.constructor.name === "Uint8Array";
  }
  function r(L) {
    if (!Number.isSafeInteger(L) || L < 0)
      throw new Error("positive integer expected, got " + L);
  }
  function s(L, ...O) {
    if (!n(L))
      throw new Error("Uint8Array expected");
    if (O.length > 0 && !O.includes(L.length))
      throw new Error("Uint8Array expected of length " + O + ", got length=" + L.length);
  }
  function i(L) {
    if (typeof L != "function" || typeof L.create != "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    r(L.outputLen), r(L.blockLen);
  }
  function o(L, O = !0) {
    if (L.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (O && L.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function a(L, O) {
    s(L);
    const ft = O.outputLen;
    if (L.length < ft)
      throw new Error("digestInto() expects output buffer of length at least " + ft);
  }
  function c(L) {
    return new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
  }
  function u(L) {
    return new Uint32Array(L.buffer, L.byteOffset, Math.floor(L.byteLength / 4));
  }
  function h(...L) {
    for (let O = 0; O < L.length; O++)
      L[O].fill(0);
  }
  function l(L) {
    return new DataView(L.buffer, L.byteOffset, L.byteLength);
  }
  function y(L, O) {
    return L << 32 - O | L >>> O;
  }
  function g(L, O) {
    return L << O | L >>> 32 - O >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function x(L) {
    return L << 24 & 4278190080 | L << 8 & 16711680 | L >>> 8 & 65280 | L >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (L) => L : (L) => x(L), t.byteSwapIfBE = t.swap8IfBE;
  function v(L) {
    for (let O = 0; O < L.length; O++)
      L[O] = x(L[O]);
    return L;
  }
  t.swap32IfBE = t.isLE ? (L) => L : v;
  const T = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", U = /* @__PURE__ */ Array.from({ length: 256 }, (L, O) => O.toString(16).padStart(2, "0"));
  function D(L) {
    if (s(L), T)
      return L.toHex();
    let O = "";
    for (let ft = 0; ft < L.length; ft++)
      O += U[L[ft]];
    return O;
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
  function P(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (T)
      return Uint8Array.fromHex(L);
    const O = L.length, ft = O / 2;
    if (O % 2)
      throw new Error("hex string expected, got unpadded hex of length " + O);
    const dt = new Uint8Array(ft);
    for (let ht = 0, St = 0; ht < ft; ht++, St += 2) {
      const oe = C(L.charCodeAt(St)), At = C(L.charCodeAt(St + 1));
      if (oe === void 0 || At === void 0) {
        const Ot = L[St] + L[St + 1];
        throw new Error('hex string expected, got non-hex character "' + Ot + '" at index ' + St);
      }
      dt[ht] = oe * 16 + At;
    }
    return dt;
  }
  const Y = async () => {
  };
  t.nextTick = Y;
  async function ot(L, O, ft) {
    let dt = Date.now();
    for (let ht = 0; ht < L; ht++) {
      ft(ht);
      const St = Date.now() - dt;
      St >= 0 && St < O || (await (0, t.nextTick)(), dt += St);
    }
  }
  function X(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function W(L) {
    return new TextDecoder().decode(L);
  }
  function $(L) {
    return typeof L == "string" && (L = X(L)), s(L), L;
  }
  function _(L) {
    return typeof L == "string" && (L = X(L)), s(L), L;
  }
  function m(...L) {
    let O = 0;
    for (let dt = 0; dt < L.length; dt++) {
      const ht = L[dt];
      s(ht), O += ht.length;
    }
    const ft = new Uint8Array(O);
    for (let dt = 0, ht = 0; dt < L.length; dt++) {
      const St = L[dt];
      ft.set(St, ht), ht += St.length;
    }
    return ft;
  }
  function B(L, O) {
    if (O !== void 0 && {}.toString.call(O) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, O);
  }
  class K {
  }
  t.Hash = K;
  function N(L) {
    const O = (dt) => L().update($(dt)).digest(), ft = L();
    return O.outputLen = ft.outputLen, O.blockLen = ft.blockLen, O.create = () => L(), O;
  }
  function at(L) {
    const O = (dt, ht) => L(ht).update($(dt)).digest(), ft = L({});
    return O.outputLen = ft.outputLen, O.blockLen = ft.blockLen, O.create = (dt) => L(dt), O;
  }
  function Z(L) {
    const O = (dt, ht) => L(ht).update($(dt)).digest(), ft = L({});
    return O.outputLen = ft.outputLen, O.blockLen = ft.blockLen, O.create = (dt) => L(dt), O;
  }
  t.wrapConstructor = N, t.wrapConstructorWithOpts = at, t.wrapXOFConstructorWithOpts = Z;
  function Et(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Sg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Sg;
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
})(xg);
const Gi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Eg(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function au(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Li(t, ...e) {
  if (!Eg(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function p2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  au(t.outputLen), au(t.blockLen);
}
function cu(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ag(t, e) {
  Li(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function g2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function y2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function bc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function er(t, e) {
  return t << 32 - e | t >>> e;
}
function w2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Ef = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Af(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const vg = Ef ? (t) => t : (t) => Af(t), b2 = vg;
function kg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Af(t[e]);
  return t;
}
const m2 = Ef ? (t) => t : kg, $g = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", x2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ig(t) {
  if (Li(t), $g)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += x2[t[n]];
  return e;
}
const _r = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function ih(t) {
  if (t >= _r._0 && t <= _r._9)
    return t - _r._0;
  if (t >= _r.A && t <= _r.F)
    return t - (_r.A - 10);
  if (t >= _r.a && t <= _r.f)
    return t - (_r.a - 10);
}
function S2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if ($g)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = ih(t.charCodeAt(i)), a = ih(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Lg = async () => {
};
async function E2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Lg(), r += i);
  }
}
function vf(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function A2(t) {
  return new TextDecoder().decode(t);
}
function ya(t) {
  return typeof t == "string" && (t = vf(t)), Li(t), t;
}
function v2(t) {
  return typeof t == "string" && (t = vf(t)), Li(t), t;
}
function k2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Li(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function $2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Cg = class {
};
function Zc(t) {
  const e = (r) => t().update(ya(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Tg(t) {
  const e = (r, s) => t(s).update(ya(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Bg(t) {
  const e = (r, s) => t(s).update(ya(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const I2 = Zc, L2 = Tg, C2 = Bg;
function T2(t = 32) {
  if (Gi && typeof Gi.getRandomValues == "function")
    return Gi.getRandomValues(new Uint8Array(t));
  if (Gi && typeof Gi.randomBytes == "function")
    return Uint8Array.from(Gi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const B2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Cg,
  abytes: Li,
  aexists: cu,
  ahash: p2,
  anumber: au,
  aoutput: Ag,
  asyncLoop: E2,
  byteSwap: Af,
  byteSwap32: kg,
  byteSwapIfBE: b2,
  bytesToHex: Ig,
  bytesToUtf8: A2,
  checkOpts: $2,
  clean: bc,
  concatBytes: k2,
  createHasher: Zc,
  createOptHasher: Tg,
  createView: rc,
  createXOFer: Bg,
  hexToBytes: S2,
  isBytes: Eg,
  isLE: Ef,
  kdfInputToBytes: v2,
  nextTick: Lg,
  randomBytes: T2,
  rotl: w2,
  rotr: er,
  swap32IfBE: m2,
  swap8IfBE: vg,
  toBytes: ya,
  u32: y2,
  u8: g2,
  utf8ToBytes: vf,
  wrapConstructor: I2,
  wrapConstructorWithOpts: L2,
  wrapXOFConstructorWithOpts: C2
}, Symbol.toStringTag, { value: "Module" }));
function M2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function N2(t, e, n) {
  return t & e ^ ~t & n;
}
function P2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class _2 extends Cg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rc(this.buffer);
  }
  update(e) {
    cu(this), e = ya(e), Li(e);
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
    cu(this), Ag(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, bc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    M2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const cs = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ls = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), U2 = /* @__PURE__ */ Uint32Array.from([
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
]), us = /* @__PURE__ */ new Uint32Array(64);
let kf = class extends _2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = cs[0] | 0, this.B = cs[1] | 0, this.C = cs[2] | 0, this.D = cs[3] | 0, this.E = cs[4] | 0, this.F = cs[5] | 0, this.G = cs[6] | 0, this.H = cs[7] | 0;
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
      const y = us[l - 15], g = us[l - 2], x = er(y, 7) ^ er(y, 18) ^ y >>> 3, v = er(g, 17) ^ er(g, 19) ^ g >>> 10;
      us[l] = v + us[l - 7] + x + us[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = er(a, 6) ^ er(a, 11) ^ er(a, 25), g = h + y + N2(a, c, u) + U2[l] + us[l] | 0, v = (er(r, 2) ^ er(r, 13) ^ er(r, 22)) + P2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    bc(us);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bc(this.buffer);
  }
}, Mg = class extends kf {
  constructor() {
    super(28), this.A = ls[0] | 0, this.B = ls[1] | 0, this.C = ls[2] | 0, this.D = ls[3] | 0, this.E = ls[4] | 0, this.F = ls[5] | 0, this.G = ls[6] | 0, this.H = ls[7] | 0;
  }
};
const H2 = /* @__PURE__ */ Zc(() => new kf()), O2 = /* @__PURE__ */ Zc(() => new Mg()), D2 = kf, Ng = H2, F2 = Mg, j2 = O2, R2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: F2,
  SHA256: D2,
  sha224: j2,
  sha256: Ng
}, Symbol.toStringTag, { value: "Module" })), Qc = /* @__PURE__ */ zc(R2), z2 = /* @__PURE__ */ zc(Xm);
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.joseToDer = fo.derToJose = void 0;
const Pg = ga, _g = pn;
function kl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const G2 = {
  ES256: kl(256),
  ES384: kl(384),
  ES512: kl(521)
};
function Ug(t) {
  const e = G2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const mc = 128, Hg = 0, K2 = 32, V2 = 16, q2 = 2, Og = V2 | K2 | Hg << 6, xc = q2 | Hg << 6;
function Dg(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Pg.toByteArray)((0, _g.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function Y2(t, e) {
  const n = Dg(t), r = Ug(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Og)
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
  const y = r - c, g = r - h, x = new Uint8Array(y + c + g + h);
  for (o = 0; o < y; ++o)
    x[o] = 0;
  x.set(n.subarray(u + Math.max(-y, 0), u + c), o), o = r;
  for (const v = o; o < v + g; ++o)
    x[o] = 0;
  return x.set(n.subarray(l + Math.max(-g, 0), l + h), o), (0, _g.escape)((0, Pg.fromByteArray)(x));
}
fo.derToJose = Y2;
function oh(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= mc && --r, r;
}
function X2(t, e) {
  t = Dg(t);
  const n = Ug(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = oh(t, 0, n), i = oh(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < mc, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Og, u ? h[l++] = c : (h[l++] = mc | 1, h[l++] = c & 255), h[l++] = xc, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = xc, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
fo.joseToDer = X2;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.InvalidTokenError = qr.MissingParametersError = void 0;
class W2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
qr.MissingParametersError = W2;
class Z2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
qr.InvalidTokenError = Z2;
const wa = /* @__PURE__ */ zc(B2);
Object.defineProperty(Xc, "__esModule", { value: !0 });
Xc.SECP256K1Client = void 0;
const Q2 = xg, J2 = Qc, sc = z2, ah = fo, ch = qr, lh = wa;
sc.utils.hmacSha256Sync = (t, ...e) => {
  const n = Q2.hmac.create(J2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Fg {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, lh.bytesToHex)(sc.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ch.MissingParametersError("a signing input hash and private key are all required");
    const s = sc.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, lh.bytesToHex)(s);
    if (r === "jose")
      return (0, ah.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, ah.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ch.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return sc.verify(n, e, r, { strict: !1 });
  }
}
Xc.SECP256K1Client = Fg;
Fg.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = Xc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(Yc);
var di = {};
const tx = /* @__PURE__ */ zc(Kp);
var ex = yn && yn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(di, "__esModule", { value: !0 });
di.hashSha256Async = di.hashSha256 = void 0;
const nx = Qc;
function jg(t) {
  return (0, nx.sha256)(t);
}
di.hashSha256 = jg;
function rx(t) {
  return ex(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = tx;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(jg(t));
    }
  });
}
di.hashSha256Async = rx;
var sx = yn && yn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(uo, "__esModule", { value: !0 });
uo.TokenSigner = uo.createUnsecuredToken = void 0;
const lu = pn, uh = Yc, ix = qr, fh = di;
function uu(t, e) {
  const n = [], r = lu.encode(JSON.stringify(e));
  n.push(r);
  const s = lu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function ox(t) {
  return uu(t, { typ: "JWT", alg: "none" }) + ".";
}
uo.createUnsecuredToken = ox;
class ax {
  constructor(e, n) {
    if (!(e && n))
      throw new ix.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !uh.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = uh.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = uu(e, s), o = (0, fh.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return sx(this, void 0, void 0, function* () {
      const s = this.header(r), i = uu(e, s), o = yield (0, fh.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [lu.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
uo.TokenSigner = ax;
var Jc = {};
Object.defineProperty(Jc, "__esModule", { value: !0 });
Jc.TokenVerifier = void 0;
const cx = pn, dh = Yc, lx = qr, Ma = di;
class ux {
  constructor(e, n) {
    if (!(e && n))
      throw new lx.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !dh.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = dh.cryptoClients[e], this.rawPublicKey = n;
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
    const r = [e.header.join("."), cx.encode(e.payload)].join(".");
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
Jc.TokenVerifier = ux;
var tl = {};
Object.defineProperty(tl, "__esModule", { value: !0 });
tl.decodeToken = void 0;
const Na = pn;
function fx(t) {
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
tl.decodeToken = fx;
(function(t) {
  var e = yn && yn.__createBinding || (Object.create ? function(r, s, i, o) {
    o === void 0 && (o = i);
    var a = Object.getOwnPropertyDescriptor(s, i);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[i];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, i, o) {
    o === void 0 && (o = i), r[o] = s[i];
  }), n = yn && yn.__exportStar || function(r, s) {
    for (var i in r) i !== "default" && !Object.prototype.hasOwnProperty.call(s, i) && e(s, r, i);
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), n(uo, t), n(Jc, t), n(tl, t), n(qr, t), n(Yc, t);
})(Ze);
function dx(t) {
  return `did:btc-addr:${t}`;
}
function hx(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Kd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Kd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Rg(t) {
  if (t)
    return hx(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const px = "1.4.0";
function gx() {
  return t2();
}
function yx(t, e, n, r = _p.slice(), s, i = Zb().getTime(), o = {}) {
  const a = (g) => {
    const x = uf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return x == null ? void 0 : x.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Jb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: px,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Ze.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = dg(u);
  return c.iss = dx(h), new Ze.TokenSigner("ES256k", t).sign(c);
}
async function hh(t, e) {
  const n = ha(zt(e)), r = JSON.parse(n), s = await yg(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function wx(t) {
  const e = Ze.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Ze.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function bx(t) {
  const e = Ze.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Rg(e.iss);
  if (n.length === 1) {
    if (dg(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function mx(t) {
  const e = Ze.decodeToken(t).payload;
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
function xx(t) {
  const e = Ze.decodeToken(t).payload;
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
function Sx(t) {
  const e = [
    xx(t),
    mx(t),
    wx(t),
    bx(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const ph = "1.0.0";
class Ps {
  constructor(e) {
    this.version = ph, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== ph)
      throw new eu(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Ps(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class zg {
  constructor(e) {
    if (e) {
      const n = new Ps(e);
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
class gh extends zg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Ps({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Up("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Ps({})), !0;
  }
}
class yh extends zg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Yb, !localStorage.getItem(this.key)) {
      const r = new Ps({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Up("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Ps.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Ps({})), !0;
  }
}
var ea;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ea || (ea = {}));
var Sc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Sc || (Sc = {}));
ea.Mainnet;
var Rr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rr || (Rr = {}));
var Er;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Er || (Er = {}));
Rr.Mainnet;
const Gg = {
  chainId: ea.Mainnet,
  transactionVersion: Rr.Mainnet,
  peerNetworkId: Sc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Er.MainnetSingleSig,
    multiSig: Er.MainnetMultiSig
  },
  client: { baseUrl: Hp }
}, fu = {
  chainId: ea.Testnet,
  transactionVersion: Rr.Testnet,
  peerNetworkId: Sc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Er.TestnetSingleSig,
    multiSig: Er.TestnetMultiSig
  },
  client: { baseUrl: Op }
}, ic = {
  ...fu,
  addressVersion: { ...fu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Dp }
}, Ex = {
  ...ic,
  addressVersion: { ...ic.addressVersion },
  client: { ...ic.client }
};
function Ax(t) {
  switch (t) {
    case "mainnet":
      return Gg;
    case "testnet":
      return fu;
    case "devnet":
      return ic;
    case "mocknet":
      return Ex;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Kg(t) {
  return typeof t == "string" ? Ax(t) : t;
}
var wh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(wh || (wh = {}));
var bh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(bh || (bh = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const $l = ["onChainOnly", "offChainOnly", "any"];
$l[0] + "", nr.OnChainOnly, $l[1] + "", nr.OffChainOnly, $l[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var mh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(mh || (mh = {}));
var xh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(xh || (xh = {}));
var Sh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Sh || (Sh = {}));
var Fr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Fr || (Fr = {}));
var Eh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Eh || (Eh = {}));
var Ah;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Ah || (Ah = {}));
var vh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(vh || (vh = {}));
var kh;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(kh || (kh = {}));
var $h;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})($h || ($h = {}));
var Ih;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ih || (Ih = {}));
var Lh;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Ch || (Ch = {}));
var Th;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Th || (Th = {}));
function du(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function vx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function kx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  du(t.outputLen), du(t.blockLen);
}
function $x(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ix(t, e) {
  Vg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ti = {
  number: du,
  bool: vx,
  bytes: Vg,
  hash: kx,
  exists: $x,
  output: Ix
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Il = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, Lx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Lx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Cx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function $f(t) {
  if (typeof t == "string" && (t = Cx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ci(t) {
  const e = (r) => t().update($f(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Yg = class extends qg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ti.hash(e);
    const r = $f(n);
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
};
const Xg = (t, e, n) => new Yg(t, e).update(n).digest();
Xg.create = (t, e) => new Yg(t, e);
function Tx(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let If = class extends qg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Il(this.buffer);
  }
  update(e) {
    ti.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = $f(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Il(e);
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
    Tx(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Il(e), c = this.outputLen;
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
const Bx = (t, e, n) => t & e ^ ~t & n, Mx = (t, e, n) => t & e ^ t & n ^ e & n, Nx = new Uint32Array([
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
]), fs = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), ds = new Uint32Array(64);
let Wg = class extends If {
  constructor() {
    super(64, 32, 8, !1), this.A = fs[0] | 0, this.B = fs[1] | 0, this.C = fs[2] | 0, this.D = fs[3] | 0, this.E = fs[4] | 0, this.F = fs[5] | 0, this.G = fs[6] | 0, this.H = fs[7] | 0;
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
      ds[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ds[l - 15], g = ds[l - 2], x = pr(y, 7) ^ pr(y, 18) ^ y >>> 3, v = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      ds[l] = v + ds[l - 7] + x + ds[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = h + y + Bx(a, c, u) + Nx[l] + ds[l] | 0, v = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + Mx(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ds.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Px = class extends Wg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zg = Ci(() => new Wg());
Ci(() => new Px());
var Ti = {}, Lf = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = wa;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let g = o.length - 1; g >= 0; g--)
      if (u < 4) {
        const x = n.indexOf(o[g]) >> u;
        let v = 0;
        g !== 0 && (v = n.indexOf(o[g - 1]));
        const T = 1 + u, U = v % (1 << T) << 5 - T, D = t.c32[x + U];
        u = T, c.unshift(D);
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
      for (let x = 0; x < g; x++)
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
      const U = (t.c32.indexOf(o[v]) << y) + l, D = n[U % 16];
      if (y += 1, l = U >> 4, l > 1 << y)
        throw new Error("Panic error in decoding.");
      h.unshift(D);
    }
    h.unshift(n[l]), h.length % 2 === 1 && h.unshift("0");
    let g = 0;
    for (let v = 0; v < h.length && h[v] === "0"; v++)
      g++;
    h = h.slice(g - g % 2);
    let x = h.join("");
    for (let v = 0; v < u; v++)
      x = `00${x}`;
    if (a) {
      const v = a * 2 - x.length;
      for (let T = 0; T < v; T += 2)
        x = `00${x}`;
    }
    return x;
  }
  t.c32decode = i;
})(Lf);
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.c32checkDecode = hi.c32checkEncode = void 0;
const Bh = Qc, Mh = wa, Xo = Lf;
function Qg(t) {
  const e = (0, Bh.sha256)((0, Bh.sha256)((0, Mh.hexToBytes)(t)));
  return (0, Mh.bytesToHex)(e.slice(0, 4));
}
function _x(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Qg(`${n}${e}`), s = (0, Xo.c32encode)(`${e}${r}`);
  return `${Xo.c32[t]}${s}`;
}
hi.c32checkEncode = _x;
function Ux(t) {
  t = (0, Xo.c32normalize)(t);
  const e = (0, Xo.c32decode)(t.slice(1)), n = t[0], r = Xo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Qg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
hi.c32checkDecode = Ux;
var Jg = {}, ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
ho.decode = ho.encode = void 0;
const Ec = Qc, Nh = wa, ty = ag, ey = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Hx(t, e = "00") {
  const n = typeof t == "string" ? (0, Nh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Nh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...r, ...n])));
  return ty(ey).encode([...r, ...n, ...s.slice(0, 4)]);
}
ho.encode = Hx;
function Ox(t) {
  const e = ty(ey).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ho.decode = Ox;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = hi, n = ho, r = wa;
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
    const y = n.decode(h), g = (0, r.bytesToHex)(y.data), x = parseInt((0, r.bytesToHex)(y.prefix), 16);
    let v;
    return l < 0 ? (v = x, s[x] !== void 0 && (v = s[x])) : v = l, o(v, g);
  }
  t.b58ToC32 = c;
  function u(h, l = -1) {
    const y = a(h), g = y[0], x = y[1];
    let v;
    l < 0 ? (v = g, i[g] !== void 0 && (v = i[g])) : v = l;
    let T = v.toString(16);
    return T.length === 1 && (T = `0${T}`), n.encode(x, T);
  }
  t.c32ToB58 = u;
})(Jg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Lf;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = hi;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Jg;
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
})(Ti);
function Dx(t, e) {
  switch (e = Kg(e ?? Gg), t) {
    case Fr.P2PKH:
      switch (e.transactionVersion) {
        case Rr.Mainnet:
          return Er.MainnetSingleSig;
        case Rr.Testnet:
          return Er.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Fr.P2SH:
    case Fr.P2SHNonSequential:
    case Fr.P2WPKH:
    case Fr.P2WSH:
    case Fr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Rr.Mainnet:
          return Er.MainnetMultiSig;
        case Rr.Testnet:
          return Er.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Fx = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ny = Uint8Array.from({ length: 16 }, (t, e) => e), jx = ny.map((t) => (9 * t + 5) % 16);
let Cf = [ny], Tf = [jx];
for (let t = 0; t < 4; t++)
  for (let e of [Cf, Tf])
    e.push(e[t].map((n) => Fx[n]));
const ry = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Rx = Cf.map((t, e) => t.map((n) => ry[e][n])), zx = Tf.map((t, e) => t.map((n) => ry[e][n])), Gx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), Kx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pa = (t, e) => t << e | t >>> 32 - e;
function Ph(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _a = new Uint32Array(16);
let Vx = class extends If {
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
      const x = 4 - g, v = Gx[g], T = Kx[g], U = Cf[g], D = Tf[g], k = Rx[g], C = zx[g];
      for (let P = 0; P < 16; P++) {
        const Y = Pa(r + Ph(g, i, a, u) + _a[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Pa(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Pa(s + Ph(x, o, c, h) + _a[D[P]] + T, C[P]) + y | 0;
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
const qx = Ci(() => new Vx()), Ua = BigInt(2 ** 32 - 1), hu = BigInt(32);
function sy(t, e = !1) {
  return e ? { h: Number(t & Ua), l: Number(t >> hu & Ua) } : { h: Number(t >> hu & Ua) | 0, l: Number(t & Ua) | 0 };
}
function Yx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = sy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Xx = (t, e) => BigInt(t >>> 0) << hu | BigInt(e >>> 0), Wx = (t, e, n) => t >>> n, Zx = (t, e, n) => t << 32 - n | e >>> n, Qx = (t, e, n) => t >>> n | e << 32 - n, Jx = (t, e, n) => t << 32 - n | e >>> n, tS = (t, e, n) => t << 64 - n | e >>> n - 32, eS = (t, e, n) => t >>> n - 32 | e << 64 - n, nS = (t, e) => e, rS = (t, e) => t, sS = (t, e, n) => t << n | e >>> 32 - n, iS = (t, e, n) => e << n | t >>> 32 - n, oS = (t, e, n) => e << n - 32 | t >>> 64 - n, aS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function cS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const lS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), uS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, fS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), dS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, hS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), pS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Ct = {
  fromBig: sy,
  split: Yx,
  toBig: Xx,
  shrSH: Wx,
  shrSL: Zx,
  rotrSH: Qx,
  rotrSL: Jx,
  rotrBH: tS,
  rotrBL: eS,
  rotr32H: nS,
  rotr32L: rS,
  rotlSH: sS,
  rotlSL: iS,
  rotlBH: oS,
  rotlBL: aS,
  add: cS,
  add3L: lS,
  add3H: uS,
  add4L: fS,
  add4H: dS,
  add5H: pS,
  add5L: hS
}, [gS, yS] = Ct.split([
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
].map((t) => BigInt(t))), hs = new Uint32Array(80), ps = new Uint32Array(80);
let el = class extends If {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: x, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = x | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      hs[k] = e.getUint32(n), ps[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = hs[k - 15] | 0, P = ps[k - 15] | 0, Y = Ct.rotrSH(C, P, 1) ^ Ct.rotrSH(C, P, 8) ^ Ct.shrSH(C, P, 7), ot = Ct.rotrSL(C, P, 1) ^ Ct.rotrSL(C, P, 8) ^ Ct.shrSL(C, P, 7), X = hs[k - 2] | 0, W = ps[k - 2] | 0, $ = Ct.rotrSH(X, W, 19) ^ Ct.rotrBH(X, W, 61) ^ Ct.shrSH(X, W, 6), _ = Ct.rotrSL(X, W, 19) ^ Ct.rotrBL(X, W, 61) ^ Ct.shrSL(X, W, 6), m = Ct.add4L(ot, _, ps[k - 7], ps[k - 16]), B = Ct.add4H(m, Y, $, hs[k - 7], hs[k - 16]);
      hs[k] = B | 0, ps[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: x, Gh: v, Gl: T, Hh: U, Hl: D } = this;
    for (let k = 0; k < 80; k++) {
      const C = Ct.rotrSH(l, y, 14) ^ Ct.rotrSH(l, y, 18) ^ Ct.rotrBH(l, y, 41), P = Ct.rotrSL(l, y, 14) ^ Ct.rotrSL(l, y, 18) ^ Ct.rotrBL(l, y, 41), Y = l & g ^ ~l & v, ot = y & x ^ ~y & T, X = Ct.add5L(D, P, ot, yS[k], ps[k]), W = Ct.add5H(X, U, C, Y, gS[k], hs[k]), $ = X | 0, _ = Ct.rotrSH(r, s, 28) ^ Ct.rotrBH(r, s, 34) ^ Ct.rotrBH(r, s, 39), m = Ct.rotrSL(r, s, 28) ^ Ct.rotrBL(r, s, 34) ^ Ct.rotrBL(r, s, 39), B = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, D = T | 0, v = g | 0, T = x | 0, g = l | 0, x = y | 0, { h: l, l: y } = Ct.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Ct.add3L($, m, K);
      r = Ct.add3H(N, W, _, B), s = N | 0;
    }
    ({ h: r, l: s } = Ct.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Ct.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Ct.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Ct.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Ct.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: x } = Ct.add(this.Fh | 0, this.Fl | 0, g | 0, x | 0), { h: v, l: T } = Ct.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: D } = Ct.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, x, v, T, U, D);
  }
  roundClean() {
    hs.fill(0), ps.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, wS = class extends el {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, bS = class extends el {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, mS = class extends el {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ci(() => new el());
Ci(() => new wS());
Ci(() => new bS());
Ci(() => new mS());
var Ac = { exports: {} };
Ac.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", g = "[object Number]", x = "[object Object]", v = "[object Promise]", T = "[object RegExp]", U = "[object Set]", D = "[object String]", k = "[object Symbol]", C = "[object WeakMap]", P = "[object ArrayBuffer]", Y = "[object DataView]", ot = "[object Float32Array]", X = "[object Float64Array]", W = "[object Int8Array]", $ = "[object Int16Array]", _ = "[object Int32Array]", m = "[object Uint8Array]", B = "[object Uint8ClampedArray]", K = "[object Uint16Array]", N = "[object Uint32Array]", at = /[\\^$.*+?()[\]{}|]/g, Z = /\w*$/, Et = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, O = {};
  O[i] = O[o] = O[P] = O[Y] = O[a] = O[c] = O[ot] = O[X] = O[W] = O[$] = O[_] = O[y] = O[g] = O[x] = O[T] = O[U] = O[D] = O[k] = O[m] = O[B] = O[K] = O[N] = !0, O[u] = O[h] = O[C] = !1;
  var ft = typeof yn == "object" && yn && yn.Object === Object && yn, dt = typeof self == "object" && self && self.Object === Object && self, ht = ft || dt || Function("return this")(), St = e && !e.nodeType && e, oe = St && !0 && t && !t.nodeType && t, At = oe && oe.exports === St;
  function Ot(w, M) {
    return w.set(M[0], M[1]), w;
  }
  function kt(w, M) {
    return w.add(M), w;
  }
  function Be(w, M) {
    for (var j = -1, ut = w ? w.length : 0; ++j < ut && M(w[j], j, w) !== !1; )
      ;
    return w;
  }
  function $t(w, M) {
    for (var j = -1, ut = M.length, we = w.length; ++j < ut; )
      w[we + j] = M[j];
    return w;
  }
  function Nt(w, M, j, ut) {
    for (var we = -1, nn = w ? w.length : 0; ++we < nn; )
      j = M(j, w[we], we, w);
    return j;
  }
  function ln(w, M) {
    for (var j = -1, ut = Array(w); ++j < w; )
      ut[j] = M(j);
    return ut;
  }
  function ae(w, M) {
    return w == null ? void 0 : w[M];
  }
  function Rt(w) {
    var M = !1;
    if (w != null && typeof w.toString != "function")
      try {
        M = !!(w + "");
      } catch {
      }
    return M;
  }
  function kn(w) {
    var M = -1, j = Array(w.size);
    return w.forEach(function(ut, we) {
      j[++M] = [we, ut];
    }), j;
  }
  function He(w, M) {
    return function(j) {
      return w(M(j));
    };
  }
  function Qe(w) {
    var M = -1, j = Array(w.size);
    return w.forEach(function(ut) {
      j[++M] = ut;
    }), j;
  }
  var Ke = Array.prototype, Ve = Function.prototype, Oe = Object.prototype, Qt = ht["__core-js_shared__"], Je = function() {
    var w = /[^.]+$/.exec(Qt && Qt.keys && Qt.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), Fe = Ve.toString, $e = Oe.hasOwnProperty, Se = Oe.toString, ye = RegExp(
    "^" + Fe.call($e).replace(at, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), bn = At ? ht.Buffer : void 0, Zn = ht.Symbol, I = ht.Uint8Array, z = He(Object.getPrototypeOf, Object), F = Object.create, S = Oe.propertyIsEnumerable, tt = Ke.splice, gt = Object.getOwnPropertySymbols, Jt = bn ? bn.isBuffer : void 0, ce = He(Object.keys, Object), Dt = d(ht, "DataView"), qt = d(ht, "Map"), Yt = d(ht, "Promise"), Ee = d(ht, "Set"), Gt = d(ht, "WeakMap"), st = d(Object, "create"), Xt = nt(Dt), le = nt(qt), De = nt(Yt), pe = nt(Ee), tn = nt(Gt), un = Zn ? Zn.prototype : void 0, Qn = un ? un.valueOf : void 0;
  function Dn(w) {
    var M = -1, j = w ? w.length : 0;
    for (this.clear(); ++M < j; ) {
      var ut = w[M];
      this.set(ut[0], ut[1]);
    }
  }
  function $n() {
    this.__data__ = st ? st(null) : {};
  }
  function Co(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function In(w) {
    var M = this.__data__;
    if (st) {
      var j = M[w];
      return j === r ? void 0 : j;
    }
    return $e.call(M, w) ? M[w] : void 0;
  }
  function Pt(w) {
    var M = this.__data__;
    return st ? M[w] !== void 0 : $e.call(M, w);
  }
  function je(w, M) {
    var j = this.__data__;
    return j[w] = st && M === void 0 ? r : M, this;
  }
  Dn.prototype.clear = $n, Dn.prototype.delete = Co, Dn.prototype.get = In, Dn.prototype.has = Pt, Dn.prototype.set = je;
  function Re(w) {
    var M = -1, j = w ? w.length : 0;
    for (this.clear(); ++M < j; ) {
      var ut = w[M];
      this.set(ut[0], ut[1]);
    }
  }
  function Ds() {
    this.__data__ = [];
  }
  function Wr(w) {
    var M = this.__data__, j = fr(M, w);
    if (j < 0)
      return !1;
    var ut = M.length - 1;
    return j == ut ? M.pop() : tt.call(M, j, 1), !0;
  }
  function Fn(w) {
    var M = this.__data__, j = fr(M, w);
    return j < 0 ? void 0 : M[j][1];
  }
  function Ln(w) {
    return fr(this.__data__, w) > -1;
  }
  function mn(w, M) {
    var j = this.__data__, ut = fr(j, w);
    return ut < 0 ? j.push([w, M]) : j[ut][1] = M, this;
  }
  Re.prototype.clear = Ds, Re.prototype.delete = Wr, Re.prototype.get = Fn, Re.prototype.has = Ln, Re.prototype.set = mn;
  function jn(w) {
    var M = -1, j = w ? w.length : 0;
    for (this.clear(); ++M < j; ) {
      var ut = w[M];
      this.set(ut[0], ut[1]);
    }
  }
  function qe() {
    this.__data__ = {
      hash: new Dn(),
      map: new (qt || Re)(),
      string: new Dn()
    };
  }
  function Fs(w) {
    return E(this, w).delete(w);
  }
  function To(w) {
    return E(this, w).get(w);
  }
  function Bo(w) {
    return E(this, w).has(w);
  }
  function Mo(w, M) {
    return E(this, w).set(w, M), this;
  }
  jn.prototype.clear = qe, jn.prototype.delete = Fs, jn.prototype.get = To, jn.prototype.has = Bo, jn.prototype.set = Mo;
  function Rn(w) {
    this.__data__ = new Re(w);
  }
  function fn() {
    this.__data__ = new Re();
  }
  function No(w) {
    return this.__data__.delete(w);
  }
  function _i(w) {
    return this.__data__.get(w);
  }
  function Ui(w) {
    return this.__data__.has(w);
  }
  function js(w, M) {
    var j = this.__data__;
    if (j instanceof Re) {
      var ut = j.__data__;
      if (!qt || ut.length < n - 1)
        return ut.push([w, M]), this;
      j = this.__data__ = new jn(ut);
    }
    return j.set(w, M), this;
  }
  Rn.prototype.clear = fn, Rn.prototype.delete = No, Rn.prototype.get = _i, Rn.prototype.has = Ui, Rn.prototype.set = js;
  function Zr(w, M) {
    var j = de(w) || fe(w) ? ln(w.length, String) : [], ut = j.length, we = !!ut;
    for (var nn in w)
      $e.call(w, nn) && !(we && (nn == "length" || pt(nn, ut))) && j.push(nn);
    return j;
  }
  function Br(w, M, j) {
    var ut = w[M];
    (!($e.call(w, M) && Kt(ut, j)) || j === void 0 && !(M in w)) && (w[M] = j);
  }
  function fr(w, M) {
    for (var j = w.length; j--; )
      if (Kt(w[j][0], M))
        return j;
    return -1;
  }
  function Qr(w, M) {
    return w && Ks(M, te(M), w);
  }
  function dr(w, M, j, ut, we, nn, Tn) {
    var ze;
    if (ut && (ze = nn ? ut(w, we, nn, Tn) : ut(w)), ze !== void 0)
      return ze;
    if (!wt(w))
      return w;
    var Fi = de(w);
    if (Fi) {
      if (ze = A(w), !M)
        return Pr(w, ze);
    } else {
      var Jn = p(w), qs = Jn == h || Jn == l;
      if (Cn(w))
        return zs(w, M);
      if (Jn == x || Jn == i || qs && !nn) {
        if (Rt(w))
          return nn ? w : {};
        if (ze = H(qs ? {} : w), !M)
          return f(w, Qr(ze, w));
      } else {
        if (!O[Jn])
          return nn ? w : {};
        ze = V(w, Jn, dr, M);
      }
    }
    Tn || (Tn = new Rn());
    var ts = Tn.get(w);
    if (ts)
      return ts;
    if (Tn.set(w, ze), !Fi)
      var ji = j ? b(w) : te(w);
    return Be(ji || w, function(Ys, es) {
      ji && (es = Ys, Ys = w[es]), Br(ze, es, dr(Ys, M, j, ut, es, w, Tn));
    }), ze;
  }
  function Rs(w) {
    return wt(w) ? F(w) : {};
  }
  function Mr(w, M, j) {
    var ut = M(w);
    return de(w) ? ut : $t(ut, j(w));
  }
  function Hi(w) {
    return Se.call(w);
  }
  function ue(w) {
    if (!wt(w) || et(w))
      return !1;
    var M = _o(w) || Rt(w) ? ye : Et;
    return M.test(nt(w));
  }
  function Po(w) {
    if (!lt(w))
      return ce(w);
    var M = [];
    for (var j in Object(w))
      $e.call(w, j) && j != "constructor" && M.push(j);
    return M;
  }
  function zs(w, M) {
    if (M)
      return w.slice();
    var j = new w.constructor(w.length);
    return w.copy(j), j;
  }
  function en(w) {
    var M = new w.constructor(w.byteLength);
    return new I(M).set(new I(w)), M;
  }
  function Gs(w, M) {
    var j = M ? en(w.buffer) : w.buffer;
    return new w.constructor(j, w.byteOffset, w.byteLength);
  }
  function ge(w, M, j) {
    var ut = M ? j(kn(w), !0) : kn(w);
    return Nt(ut, Ot, new w.constructor());
  }
  function Oi(w) {
    var M = new w.constructor(w.source, Z.exec(w));
    return M.lastIndex = w.lastIndex, M;
  }
  function Di(w, M, j) {
    var ut = M ? j(Qe(w), !0) : Qe(w);
    return Nt(ut, kt, new w.constructor());
  }
  function Nr(w) {
    return Qn ? Object(Qn.call(w)) : {};
  }
  function Jr(w, M) {
    var j = M ? en(w.buffer) : w.buffer;
    return new w.constructor(j, w.byteOffset, w.length);
  }
  function Pr(w, M) {
    var j = -1, ut = w.length;
    for (M || (M = Array(ut)); ++j < ut; )
      M[j] = w[j];
    return M;
  }
  function Ks(w, M, j, ut) {
    j || (j = {});
    for (var we = -1, nn = M.length; ++we < nn; ) {
      var Tn = M[we], ze = void 0;
      Br(j, Tn, ze === void 0 ? w[Tn] : ze);
    }
    return j;
  }
  function f(w, M) {
    return Ks(w, G(w), M);
  }
  function b(w) {
    return Mr(w, te, G);
  }
  function E(w, M) {
    var j = w.__data__;
    return R(M) ? j[typeof M == "string" ? "string" : "hash"] : j.map;
  }
  function d(w, M) {
    var j = ae(w, M);
    return ue(j) ? j : void 0;
  }
  var G = gt ? He(gt, Object) : xn, p = Hi;
  (Dt && p(new Dt(new ArrayBuffer(1))) != Y || qt && p(new qt()) != y || Yt && p(Yt.resolve()) != v || Ee && p(new Ee()) != U || Gt && p(new Gt()) != C) && (p = function(w) {
    var M = Se.call(w), j = M == x ? w.constructor : void 0, ut = j ? nt(j) : void 0;
    if (ut)
      switch (ut) {
        case Xt:
          return Y;
        case le:
          return y;
        case De:
          return v;
        case pe:
          return U;
        case tn:
          return C;
      }
    return M;
  });
  function A(w) {
    var M = w.length, j = w.constructor(M);
    return M && typeof w[0] == "string" && $e.call(w, "index") && (j.index = w.index, j.input = w.input), j;
  }
  function H(w) {
    return typeof w.constructor == "function" && !lt(w) ? Rs(z(w)) : {};
  }
  function V(w, M, j, ut) {
    var we = w.constructor;
    switch (M) {
      case P:
        return en(w);
      case a:
      case c:
        return new we(+w);
      case Y:
        return Gs(w, ut);
      case ot:
      case X:
      case W:
      case $:
      case _:
      case m:
      case B:
      case K:
      case N:
        return Jr(w, ut);
      case y:
        return ge(w, ut, j);
      case g:
      case D:
        return new we(w);
      case T:
        return Oi(w);
      case U:
        return Di(w, ut, j);
      case k:
        return Nr(w);
    }
  }
  function pt(w, M) {
    return M = M ?? s, !!M && (typeof w == "number" || L.test(w)) && w > -1 && w % 1 == 0 && w < M;
  }
  function R(w) {
    var M = typeof w;
    return M == "string" || M == "number" || M == "symbol" || M == "boolean" ? w !== "__proto__" : w === null;
  }
  function et(w) {
    return !!Je && Je in w;
  }
  function lt(w) {
    var M = w && w.constructor, j = typeof M == "function" && M.prototype || Oe;
    return w === j;
  }
  function nt(w) {
    if (w != null) {
      try {
        return Fe.call(w);
      } catch {
      }
      try {
        return w + "";
      } catch {
      }
    }
    return "";
  }
  function It(w) {
    return dr(w, !0, !0);
  }
  function Kt(w, M) {
    return w === M || w !== w && M !== M;
  }
  function fe(w) {
    return zn(w) && $e.call(w, "callee") && (!S.call(w, "callee") || Se.call(w) == i);
  }
  var de = Array.isArray;
  function Me(w) {
    return w != null && Vs(w.length) && !_o(w);
  }
  function zn(w) {
    return Wt(w) && Me(w);
  }
  var Cn = Jt || Sa;
  function _o(w) {
    var M = wt(w) ? Se.call(w) : "";
    return M == h || M == l;
  }
  function Vs(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function wt(w) {
    var M = typeof w;
    return !!w && (M == "object" || M == "function");
  }
  function Wt(w) {
    return !!w && typeof w == "object";
  }
  function te(w) {
    return Me(w) ? Zr(w) : Po(w);
  }
  function xn() {
    return [];
  }
  function Sa() {
    return !1;
  }
  t.exports = It;
})(Ac, Ac.exports);
var xS = Ac.exports;
const iy = /* @__PURE__ */ Bp(xS);
var pu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pu || (pu = {}));
function SS(t, e) {
  return { type: pu.Address, version: t, hash160: e };
}
function ES(t) {
  return Ti.c32address(t.version, t.hash160);
}
const AS = (t) => qx(Zg(t)), vS = (t) => bt(AS(t));
Te.hmacSha256Sync = (t, ...e) => {
  const n = Xg.create(Zg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function kS(t, e = "mainnet") {
  e = Kg(e), t = typeof t == "string" ? zt(t) : t;
  const n = Dx(Fr.P2PKH, e), r = SS(n, vS(t));
  return ES(r);
}
function $S(t, e) {
  const n = Ze.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = kS(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Ze.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function IS(t, e = null) {
  let n;
  e ? n = $S(t, e) : n = Ze.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const _h = "_blockstackDidCheckEchoReply", LS = "echoReply", CS = "authContinuation";
function TS(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function BS() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[_h];
  if (typeof e == "boolean")
    return e;
  const n = TS(t.location.search), r = n[LS];
  if (r) {
    t[_h] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[CS];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class gu {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new Fp();
    else
      throw new Wb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new yh(e.sessionOptions) : this.store = new yh() : e ? this.store = new gh(e.sessionOptions) : this.store = new gh();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Qb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new eu("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, yx(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = gx();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = uf("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (BS())
        return Wi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Wi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = Sm()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new va("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Ze.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await Sx(e))
      throw new va("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Sl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await hh(s, i.private_key);
          } catch {
            if (Wi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Te.isValidPrivateKey(i.private_key))
              throw new va("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await hh(s, c);
          } catch {
            Wi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new va("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = um, h;
    Sl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Sl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Rg(i.iss),
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
        l.profile = Object.assign({}, qb);
      else {
        const x = await g.text(), v = JSON.parse(x);
        l.profile = IS(v[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new eu("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), u2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), f2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
gu.prototype.makeAuthRequest = gu.prototype.makeAuthRequestToken;
const MS = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], NS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = MS(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!nl(r.id));
  return e.concat(n);
}, nl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), oy = "STX_PROVIDER", pi = () => typeof window > "u" ? null : window.localStorage.getItem(oy), PS = (t) => {
  typeof window < "u" && window.localStorage.setItem(oy, t);
}, _S = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function US(t, e) {
  const n = {};
  return Object.assign(n, _S, e), await fetch(t, n);
}
function HS(t) {
  let e = US, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function OS(...t) {
  const { fetchLib: e, middlewares: n } = HS(t);
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
var po;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(po || (po = {}));
var gi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(gi || (gi = {}));
var Uh;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Uh || (Uh = {}));
const DS = "https://api.mainnet.hiro.so", FS = "https://api.testnet.hiro.so", jS = "http://localhost:3999", RS = ["mainnet", "testnet", "devnet", "mocknet"];
class yi {
  constructor(e) {
    this.version = gi.Mainnet, this.chainId = po.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === gi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? OS();
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
yi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new yu();
    case "testnet":
      return new wu();
    case "devnet":
      return new zS();
    case "mocknet":
      return new ay();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${RS.join(", ")}`);
  }
};
yi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : yi.fromName(t);
class yu extends yi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? DS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = gi.Mainnet, this.chainId = po.Mainnet;
  }
}
class wu extends yi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? FS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = gi.Testnet, this.chainId = po.Testnet;
  }
}
class ay extends yi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? jS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = gi.Testnet, this.chainId = po.Testnet;
  }
}
const zS = ay;
var wi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(wi || (wi = {}));
var vc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vc || (vc = {}));
wi.Mainnet;
var bi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(bi || (bi = {}));
var mi;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(mi || (mi = {}));
bi.Mainnet;
const GS = {
  chainId: wi.Mainnet,
  transactionVersion: bi.Mainnet,
  peerNetworkId: vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: mi.MainnetSingleSig,
    multiSig: mi.MainnetMultiSig
  },
  client: { baseUrl: Hp }
}, bu = {
  chainId: wi.Testnet,
  transactionVersion: bi.Testnet,
  peerNetworkId: vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: mi.TestnetSingleSig,
    multiSig: mi.TestnetMultiSig
  },
  client: { baseUrl: Op }
}, oc = {
  ...bu,
  addressVersion: { ...bu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: Dp }
}, KS = {
  ...oc,
  addressVersion: { ...oc.addressVersion },
  client: { ...oc.client }
};
function VS(t) {
  switch (t) {
    case "mainnet":
      return GS;
    case "testnet":
      return bu;
    case "devnet":
      return oc;
    case "mocknet":
      return KS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function qS(t) {
  return typeof t == "string" ? VS(t) : t;
}
function YS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Hh = /* @__PURE__ */ new Map();
function cy(t, e) {
  const n = Hh.get(t);
  if (n !== void 0)
    return n(e);
  const r = YS(t);
  return Hh.set(t, r), cy(t, e);
}
let he = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? zt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return wm(this.readBytes(4), 0);
  }
  readUInt8() {
    return gm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return hm(this.readBytes(2), 0);
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
    if (cy(e, r))
      return r;
    throw n(r);
  }
};
const XS = 128, WS = 128, ly = 16, ii = 32, mu = 80, rl = 65, ZS = 32, QS = 64, kc = 34, JS = 1 + 16 * 1024 * 1024, t3 = 165, e3 = 16, n3 = 16, r3 = 20, s3 = n3 + 2 + r3, i3 = s3 + 4, o3 = JS + (t3 + e3 * i3);
var Zt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Zt || (Zt = {}));
var xu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(xu || (xu = {}));
var Mn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Mn || (Mn = {}));
const Ll = ["onChainOnly", "offChainOnly", "any"];
Ll[0] + "", Mn.OnChainOnly, Ll[1] + "", Mn.OffChainOnly, Ll[2] + "", Mn.Any, Mn.OnChainOnly + "", Mn.OnChainOnly, Mn.OffChainOnly + "", Mn.OffChainOnly, Mn.Any + "", Mn.Any;
var $c;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})($c || ($c = {}));
var be;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(be || (be = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var se;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(se || (se = {}));
var ve;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ve || (ve = {}));
var Wo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Wo || (Wo = {}));
var Su;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Su || (Su = {}));
var Eu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Eu || (Eu = {}));
var gn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(gn || (gn = {}));
var Oh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Oh || (Oh = {}));
var Au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Au || (Au = {}));
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
var Dh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dh || (Dh = {}));
let sl = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Zi = class extends sl {
  constructor(e) {
    super(e);
  }
}, hn = class extends sl {
  constructor(e) {
    super(e);
  }
}, Ic = class extends sl {
  constructor(e) {
    super(e);
  }
}, ei = class extends sl {
  constructor(e) {
    super(e);
  }
};
function vu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function a3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function uy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function c3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vu(t.outputLen), vu(t.blockLen);
}
function l3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function u3(t, e) {
  uy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ni = {
  number: vu,
  bool: a3,
  bytes: uy,
  hash: c3,
  exists: l3,
  output: u3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, f3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!f3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function d3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bf(t) {
  if (typeof t == "string" && (t = d3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let fy = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Bi(t) {
  const e = (r) => t().update(Bf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let dy = class extends fy {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ni.hash(e);
    const r = Bf(n);
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
    return ni.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ni.exists(this), ni.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const hy = (t, e, n) => new dy(t, e).update(n).digest();
hy.create = (t, e) => new dy(t, e);
function h3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Mf = class extends fy {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cl(this.buffer);
  }
  update(e) {
    ni.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Bf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Cl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ni.exists(this), ni.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    h3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Cl(e), c = this.outputLen;
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
const p3 = (t, e, n) => t & e ^ ~t & n, g3 = (t, e, n) => t & e ^ t & n ^ e & n, y3 = new Uint32Array([
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
let py = class extends Mf {
  constructor() {
    super(64, 32, 8, !1), this.A = gs[0] | 0, this.B = gs[1] | 0, this.C = gs[2] | 0, this.D = gs[3] | 0, this.E = gs[4] | 0, this.F = gs[5] | 0, this.G = gs[6] | 0, this.H = gs[7] | 0;
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
      ys[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = ys[l - 15], g = ys[l - 2], x = gr(y, 7) ^ gr(y, 18) ^ y >>> 3, v = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      ys[l] = v + ys[l - 7] + x + ys[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = h + y + p3(a, c, u) + y3[l] + ys[l] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + g3(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    ys.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, w3 = class extends py {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Nf = Bi(() => new py());
Bi(() => new w3());
const b3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gy = Uint8Array.from({ length: 16 }, (t, e) => e), m3 = gy.map((t) => (9 * t + 5) % 16);
let Pf = [gy], _f = [m3];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, _f])
    e.push(e[t].map((n) => b3[n]));
const yy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), x3 = Pf.map((t, e) => t.map((n) => yy[e][n])), S3 = _f.map((t, e) => t.map((n) => yy[e][n])), E3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), A3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ha = (t, e) => t << e | t >>> 32 - e;
function Fh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Oa = new Uint32Array(16);
let v3 = class extends Mf {
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
      Oa[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const x = 4 - g, v = E3[g], T = A3[g], U = Pf[g], D = _f[g], k = x3[g], C = S3[g];
      for (let P = 0; P < 16; P++) {
        const Y = Ha(r + Fh(g, i, a, u) + Oa[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Ha(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Ha(s + Fh(x, o, c, h) + Oa[D[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = Ha(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Oa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const k3 = Bi(() => new v3()), Da = BigInt(2 ** 32 - 1), ku = BigInt(32);
function wy(t, e = !1) {
  return e ? { h: Number(t & Da), l: Number(t >> ku & Da) } : { h: Number(t >> ku & Da) | 0, l: Number(t & Da) | 0 };
}
function $3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = wy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const I3 = (t, e) => BigInt(t >>> 0) << ku | BigInt(e >>> 0), L3 = (t, e, n) => t >>> n, C3 = (t, e, n) => t << 32 - n | e >>> n, T3 = (t, e, n) => t >>> n | e << 32 - n, B3 = (t, e, n) => t << 32 - n | e >>> n, M3 = (t, e, n) => t << 64 - n | e >>> n - 32, N3 = (t, e, n) => t >>> n - 32 | e << 64 - n, P3 = (t, e) => e, _3 = (t, e) => t, U3 = (t, e, n) => t << n | e >>> 32 - n, H3 = (t, e, n) => e << n | t >>> 32 - n, O3 = (t, e, n) => e << n - 32 | t >>> 64 - n, D3 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function F3(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const j3 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), R3 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, z3 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), G3 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, K3 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), V3 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: wy,
  split: $3,
  toBig: I3,
  shrSH: L3,
  shrSL: C3,
  rotrSH: T3,
  rotrSL: B3,
  rotrBH: M3,
  rotrBL: N3,
  rotr32H: P3,
  rotr32L: _3,
  rotlSH: U3,
  rotlSL: H3,
  rotlBH: O3,
  rotlBL: D3,
  add: F3,
  add3L: j3,
  add3H: R3,
  add4L: z3,
  add4H: G3,
  add5H: V3,
  add5L: K3
}, [q3, Y3] = Tt.split([
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
].map((t) => BigInt(t))), ws = new Uint32Array(80), bs = new Uint32Array(80);
let il = class extends Mf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: x, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = x | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ws[k] = e.getUint32(n), bs[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = ws[k - 15] | 0, P = bs[k - 15] | 0, Y = Tt.rotrSH(C, P, 1) ^ Tt.rotrSH(C, P, 8) ^ Tt.shrSH(C, P, 7), ot = Tt.rotrSL(C, P, 1) ^ Tt.rotrSL(C, P, 8) ^ Tt.shrSL(C, P, 7), X = ws[k - 2] | 0, W = bs[k - 2] | 0, $ = Tt.rotrSH(X, W, 19) ^ Tt.rotrBH(X, W, 61) ^ Tt.shrSH(X, W, 6), _ = Tt.rotrSL(X, W, 19) ^ Tt.rotrBL(X, W, 61) ^ Tt.shrSL(X, W, 6), m = Tt.add4L(ot, _, bs[k - 7], bs[k - 16]), B = Tt.add4H(m, Y, $, ws[k - 7], ws[k - 16]);
      ws[k] = B | 0, bs[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: x, Gh: v, Gl: T, Hh: U, Hl: D } = this;
    for (let k = 0; k < 80; k++) {
      const C = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), P = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, ot = y & x ^ ~y & T, X = Tt.add5L(D, P, ot, Y3[k], bs[k]), W = Tt.add5H(X, U, C, Y, q3[k], ws[k]), $ = X | 0, _ = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), m = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), B = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, D = T | 0, v = g | 0, T = x | 0, g = l | 0, x = y | 0, { h: l, l: y } = Tt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Tt.add3L($, m, K);
      r = Tt.add3H(N, W, _, B), s = N | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: x } = Tt.add(this.Fh | 0, this.Fl | 0, g | 0, x | 0), { h: v, l: T } = Tt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: D } = Tt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, x, v, T, U, D);
  }
  roundClean() {
    ws.fill(0), bs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, X3 = class extends il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, W3 = class extends il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Z3 = class extends il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Bi(() => new il());
Bi(() => new X3());
const Q3 = Bi(() => new W3());
Bi(() => new Z3());
var Ft;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Ft || (Ft = {}));
var Ge;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(Ge || (Ge = {}));
function Uf(t) {
  return Ge[t];
}
const J3 = () => ({ type: Ft.BoolTrue }), t4 = () => ({ type: Ft.BoolFalse }), e4 = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Ft.Buffer, value: bt(t) };
}, jh = BigInt("0xffffffffffffffffffffffffffffffff"), n4 = BigInt(0), Rh = BigInt("0x7fffffffffffffffffffffffffffffff"), zh = BigInt("-170141183460469231731687303715884105728"), r4 = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ru(zt(t))), vn(t, Uint8Array) && (t = ru(t));
  const e = cn(t);
  if (e > Rh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Rh}`);
  if (e < zh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${zh}`);
  return { type: Ft.Int, value: e };
}, s4 = (t) => {
  const e = cn(t);
  if (e < n4)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > jh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${jh}`);
  return { type: Ft.UInt, value: e };
};
function i4(t) {
  return { type: Ft.List, value: t };
}
function by() {
  return { type: Ft.OptionalNone };
}
function my(t) {
  return { type: Ft.OptionalSome, value: t };
}
var ct;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ct || (ct = {}));
function o4() {
  return {
    type: ct.Address,
    version: mi.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Gh(t) {
  if (t && Ly(t, kc))
    throw new Error(`Memo exceeds maximum length of ${kc} bytes`);
  return { type: ct.MemoString, content: t };
}
function Hf(t, e) {
  return {
    type: ct.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function $u(t) {
  if (zt(t).byteLength != rl)
    throw Error("Invalid signature");
  return {
    type: ct.MessageSignature,
    data: t
  };
}
function a4(t, e, n) {
  return typeof t == "string" && (t = A4(t)), typeof n == "string" && (n = Gh(n)), {
    type: ct.Payload,
    payloadType: Zt.TokenTransfer,
    recipient: t,
    amount: cn(e),
    memo: n ?? Gh("")
  };
}
function c4(t, e, n, r) {
  return typeof e == "string" && (e = cr(e)), typeof n == "string" && (n = cr(n)), {
    type: ct.Payload,
    payloadType: Zt.ContractCall,
    contractAddress: typeof t == "string" ? Os(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function l4(t) {
  return cr(t, 4, 1e5);
}
function Kh(t, e, n) {
  return typeof t == "string" && (t = cr(t)), typeof e == "string" && (e = l4(e)), typeof n == "number" ? {
    type: ct.Payload,
    payloadType: Zt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ct.Payload,
    payloadType: Zt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function u4() {
  return { type: ct.Payload, payloadType: Zt.PoisonMicroblock };
}
function Vh(t, e) {
  if (t.byteLength != ii)
    throw Error(`Coinbase buffer size must be ${ii} bytes`);
  return e != null ? {
    type: ct.Payload,
    payloadType: Zt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ct.Payload,
    payloadType: Zt.Coinbase,
    coinbaseBytes: t
  };
}
function f4(t, e, n) {
  if (t.byteLength != ii)
    throw Error(`Coinbase buffer size must be ${ii} bytes`);
  if (n.byteLength != mu)
    throw Error(`VRF proof buffer size must be ${mu} bytes`);
  return {
    type: ct.Payload,
    payloadType: Zt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Ft.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function d4(t, e, n, r, s, i, o) {
  return {
    type: ct.Payload,
    payloadType: Zt.TenureChange,
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
  const r = e || 1, s = n || XS;
  if (Ly(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ct.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function h4(t, e, n) {
  return {
    type: ct.Asset,
    address: Os(t),
    contractName: cr(e),
    assetName: cr(n)
  };
}
function Os(t) {
  const e = Ti.c32addressDecode(t);
  return {
    type: ct.Address,
    version: e[0],
    hash160: e[1]
  };
}
function p4(t, e) {
  const n = Os(t), r = cr(e);
  return {
    type: ct.Principal,
    prefix: gn.Contract,
    address: n,
    contractName: r
  };
}
function g4(t) {
  const e = Os(t);
  return {
    type: ct.Principal,
    prefix: gn.Standard,
    address: e
  };
}
function Qi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ct.TransactionAuthField,
    contents: e
  };
}
function Hr(t) {
  switch (t.type) {
    case ct.Address:
      return ba(t);
    case ct.Principal:
      return xy(t);
    case ct.LengthPrefixedString:
      return yo(t);
    case ct.MemoString:
      return w4(t);
    case ct.Asset:
      return Ey(t);
    case ct.PostCondition:
      return vy(t);
    case ct.PublicKey:
      return Cu(t);
    case ct.LengthPrefixedList:
      return Of(t);
    case ct.Payload:
      return ky(t);
    case ct.TransactionAuthField:
      return E4(t);
    case ct.MessageSignature:
      return Df(t);
  }
}
function ba(t) {
  const e = [];
  return e.push(zt(da(t.version, 1))), e.push(zt(t.hash160)), _e(e);
}
function go(t) {
  const e = vn(t, he) ? t : new he(t), n = Gc(bt(e.readBytes(1))), r = bt(e.readBytes(20));
  return { type: ct.Address, version: n, hash160: r };
}
function xy(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === gn.Standard || t.prefix === gn.Contract) && e.push(ba(t.address)), t.prefix === gn.Contract && e.push(yo(t.contractName)), _e(e);
}
function y4(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(gn, (i) => {
    throw new hn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === gn.Origin)
    return { type: ct.Principal, prefix: n };
  const r = go(e);
  if (n === gn.Standard)
    return { type: ct.Principal, prefix: n, address: r };
  const s = Yn(e);
  return {
    type: ct.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function yo(t) {
  const e = [], n = $i(t.content), r = n.byteLength;
  return e.push(zt(da(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function Yn(t, e, n) {
  e = e || 1;
  const r = vn(t, he) ? t : new he(t), s = Gc(bt(r.readBytes(e))), i = ha(r.readBytes(s));
  return cr(i, e, n ?? 128);
}
function w4(t) {
  const e = [], n = $i(t.content), r = K4(bt(n), kc * 2);
  return e.push(zt(r)), _e(e);
}
function Sy(t) {
  const e = vn(t, he) ? t : new he(t);
  let n = ha(e.readBytes(kc));
  return n = n.replace(/\u0000*$/, ""), { type: ct.MemoString, content: n };
}
function Ey(t) {
  const e = [];
  return e.push(ba(t.address)), e.push(yo(t.contractName)), e.push(yo(t.assetName)), _e(e);
}
function Iu(t) {
  const e = vn(t, he) ? t : new he(t);
  return {
    type: ct.Asset,
    address: go(e),
    contractName: Yn(e),
    assetName: Yn(e)
  };
}
function Of(t) {
  const e = t.values, n = [];
  n.push(zt(da(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Hr(r));
  return _e(n);
}
function Ay(t, e, n) {
  const r = vn(t, he) ? t : new he(t), s = Gc(bt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case ct.Address:
        i.push(go(r));
        break;
      case ct.LengthPrefixedString:
        i.push(Yn(r));
        break;
      case ct.MemoString:
        i.push(Sy(r));
        break;
      case ct.Asset:
        i.push(Iu(r));
        break;
      case ct.PostCondition:
        i.push(m4(r));
        break;
      case ct.PublicKey:
        i.push(Tu(r));
        break;
      case ct.TransactionAuthField:
        i.push(S4(r));
        break;
    }
  return Hf(i, n);
}
function b4(t) {
  return bt(vy(t));
}
function vy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(xy(t.principal)), (t.conditionType === be.Fungible || t.conditionType === be.NonFungible) && e.push(Ey(t.asset)), t.conditionType === be.NonFungible && e.push(Ar(t.assetName)), e.push(t.conditionCode), t.conditionType === be.STX || t.conditionType === be.Fungible || t.conditionType === be.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Zi("The post-condition amount may not be larger than 8 bytes");
    e.push(Us(t.amount, 8));
  }
  return _e(e);
}
function m4(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(be, (a) => {
    throw new hn(`Could not read ${a} as PostConditionType`);
  }), r = y4(e);
  let s, i, o;
  switch (n) {
    case be.STX:
      return s = e.readUInt8Enum(Wo, (c) => {
        throw new hn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: be.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.Fungible:
      return i = Iu(e), s = e.readUInt8Enum(Wo, (c) => {
        throw new hn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: be.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case be.NonFungible:
      i = Iu(e);
      const a = xr(e);
      return s = e.readUInt8Enum(Su, (c) => {
        throw new hn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ct.PostCondition,
        conditionType: be.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case be.Staking:
      return s = e.readUInt8Enum(Wo, (c) => {
        throw new hn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${bt(e.readBytes(8))}`), {
        type: ct.PostCondition,
        conditionType: be.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case be.PoX: {
      const c = e.readUInt8Enum(Eu, (u) => {
        throw new hn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: ct.PostCondition,
        conditionType: be.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function ky(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Zt.TokenTransfer:
      e.push(Ar(t.recipient)), e.push(Us(t.amount, 8)), e.push(Hr(t.memo));
      break;
    case Zt.ContractCall:
      e.push(Hr(t.contractAddress)), e.push(Hr(t.contractName)), e.push(Hr(t.functionName));
      const n = new Uint8Array(4);
      li(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ar(r));
      });
      break;
    case Zt.SmartContract:
      e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case Zt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case Zt.PoisonMicroblock:
      break;
    case Zt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Zt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient));
      break;
    case Zt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ar(t.recipient ? my(t.recipient) : by())), e.push(t.vrfProof);
      break;
    case Zt.TenureChange:
      e.push(zt(t.tenureHash)), e.push(zt(t.previousTenureHash)), e.push(zt(t.burnViewHash)), e.push(zt(t.previousTenureEnd)), e.push(li(new Uint8Array(4), t.previousTenureBlocks)), e.push(ym(new Uint8Array(1), t.cause)), e.push(zt(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function x4(t) {
  const e = vn(t, he) ? t : new he(t);
  switch (e.readUInt8Enum(Zt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Zt.TokenTransfer:
      const r = xr(e), s = cn(e.readBytes(8)), i = Sy(e);
      return a4(r, s, i);
    case Zt.ContractCall:
      const o = go(e), a = Yn(e), c = Yn(e), u = [], h = e.readUInt32BE();
      for (let C = 0; C < h; C++) {
        const P = xr(e);
        u.push(P);
      }
      return c4(o, a, c, u);
    case Zt.SmartContract:
      const l = Yn(e), y = Yn(e, 4, 1e5);
      return Kh(l, y);
    case Zt.VersionedSmartContract: {
      const C = e.readUInt8Enum(xu, (ot) => {
        throw new Error(`Cannot recognize ClarityVersion: ${ot}`);
      }), P = Yn(e), Y = Yn(e, 4, o3);
      return Kh(P, Y, C);
    }
    case Zt.PoisonMicroblock:
      return u4();
    case Zt.Coinbase: {
      const C = e.readBytes(ii);
      return Vh(C);
    }
    case Zt.CoinbaseToAltRecipient: {
      const C = e.readBytes(ii), P = xr(e);
      return Vh(C, P);
    }
    case Zt.NakamotoCoinbase: {
      const C = e.readBytes(ii), P = xr(e), Y = e.readBytes(mu);
      return f4(C, P, Y);
    }
    case Zt.TenureChange:
      const g = bt(e.readBytes(20)), x = bt(e.readBytes(20)), v = bt(e.readBytes(20)), T = bt(e.readBytes(32)), U = e.readUInt32BE(), D = e.readUInt8Enum(Au, (C) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${C}`);
      }), k = bt(e.readBytes(20));
      return d4(g, x, v, T, U, D, k);
  }
}
function Lu(t) {
  const e = vn(t, he) ? t : new he(t);
  return $u(bt(e.readBytes(rl)));
}
function S4(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(ir, (r) => {
    throw new hn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case ir.PublicKeyCompressed:
      return Qi(ve.Compressed, Tu(e));
    case ir.PublicKeyUncompressed:
      return Qi(ve.Uncompressed, vo(nE(Tu(e).data)));
    case ir.SignatureCompressed:
      return Qi(ve.Compressed, Lu(e));
    case ir.SignatureUncompressed:
      return Qi(ve.Uncompressed, Lu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Df(t) {
  return zt(t.data);
}
function E4(t) {
  const e = [];
  switch (t.contents.type) {
    case ct.PublicKey:
      e.push(t.pubKeyEncoding === ve.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(zt(eE(t.contents.data)));
      break;
    case ct.MessageSignature:
      e.push(t.pubKeyEncoding === ve.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(Df(t.contents));
      break;
  }
  return _e(e);
}
function Cu(t) {
  return t.data.slice();
}
function Tu(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8(), r = n === 4 ? QS : ZS;
  return vo(_e([n, e.readBytes(r)]));
}
function Ff(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === se.P2PKH || e === se.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === se.P2WPKH || e === se.P2WSH || e === se.P2WSHNonSequential) && !r.map((s) => s.data).every(ko))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case se.P2PKH:
      return Fa(t, V4(r[0].data));
    case se.P2WPKH:
      return Fa(t, q4(r[0].data));
    case se.P2SH:
    case se.P2SHNonSequential:
      return Fa(t, Y4(n, r.map(Cu)));
    case se.P2WSH:
    case se.P2WSHNonSequential:
      return Fa(t, X4(n, r.map(Cu)));
  }
}
function Fa(t, e) {
  return { type: ct.Address, version: t, hash160: e };
}
function jf(t) {
  return Ti.c32address(t.version, t.hash160);
}
function qh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return h4(e, n, r);
}
function Do(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return p4(e, n);
  } else
    return g4(t);
}
function A4(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return $4(e, n);
  } else
    return v4(t);
}
function v4(t) {
  const e = Os(t);
  return { type: Ft.PrincipalStandard, value: jf(e) };
}
function k4(t) {
  return { type: Ft.PrincipalStandard, value: jf(t) };
}
function $4(t, e) {
  const n = Os(t), r = cr(e);
  return $y(n, r);
}
function $y(t, e) {
  if ($i(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Ft.PrincipalContract,
    value: `${jf(t)}.${e.content}`
  };
}
function I4(t) {
  return { type: Ft.ResponseErr, value: t };
}
function L4(t) {
  return { type: Ft.ResponseOk, value: t };
}
const C4 = (t) => ({ type: Ft.StringASCII, value: t }), T4 = (t) => ({ type: Ft.StringUTF8, value: t });
function B4(t) {
  for (const e in t)
    if (!W4(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Ft.Tuple, value: t };
}
function xr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new he(zt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new he(t) : e = t;
  switch (e.readUInt8Enum(Ge, (r) => {
    throw new hn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Ge.int:
      return r4(ru(e.readBytes(16)));
    case Ge.uint:
      return s4(e.readBytes(16));
    case Ge.buffer:
      const r = e.readUInt32BE();
      return e4(e.readBytes(r));
    case Ge.true:
      return J3();
    case Ge.false:
      return t4();
    case Ge.address:
      const s = go(e);
      return k4(s);
    case Ge.contract:
      const i = go(e), o = Yn(e);
      return $y(i, o);
    case Ge.ok:
      return L4(xr(e));
    case Ge.err:
      return I4(xr(e));
    case Ge.none:
      return by();
    case Ge.some:
      return my(xr(e));
    case Ge.list:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(xr(e));
      return i4(c);
    case Ge.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Yn(e).content;
        if (T === void 0)
          throw new hn('"content" is undefined');
        h[T] = xr(e);
      }
      return B4(h);
    case Ge.ascii:
      const l = e.readUInt32BE(), y = cm(e.readBytes(l));
      return C4(y);
    case Ge.utf8:
      const g = e.readUInt32BE(), x = ha(e.readBytes(g));
      return T4(x);
    default:
      throw new hn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function Lr(t, e) {
  return _e([Uf(t), e]);
}
function M4(t) {
  return new Uint8Array([Uf(t.type)]);
}
function N4(t) {
  return t.type === Ft.OptionalNone ? new Uint8Array([Uf(t.type)]) : Lr(t.type, Ar(t.value));
}
function P4(t) {
  const e = new Uint8Array(4);
  return li(e, Math.ceil(t.value.length / 2), 0), Lr(t.type, $r(e, zt(t.value)));
}
function _4(t) {
  const e = ff(rm(BigInt(t.value), BigInt(WS)), ly);
  return Lr(t.type, e);
}
function U4(t) {
  const e = ff(BigInt(t.value), ly);
  return Lr(t.type, e);
}
function H4(t) {
  return Lr(t.type, ba(Os(t.value)));
}
function O4(t) {
  const [e, n] = Z4(t.value);
  return Lr(t.type, $r(ba(Os(e)), yo(cr(n))));
}
function D4(t) {
  return Lr(t.type, Ar(t.value));
}
function F4(t) {
  const e = [], n = new Uint8Array(4);
  li(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Ar(r);
    e.push(s);
  }
  return Lr(t.type, _e(e));
}
function j4(t) {
  const e = [], n = new Uint8Array(4);
  li(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = cr(s);
    e.push(yo(i));
    const o = Ar(t.value[s]);
    e.push(o);
  }
  return Lr(t.type, _e(e));
}
function Iy(t, e) {
  const n = [], r = e == "ascii" ? am(t.value) : $i(t.value), s = new Uint8Array(4);
  return li(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, _e(n));
}
function R4(t) {
  return Iy(t, "ascii");
}
function z4(t) {
  return Iy(t, "utf8");
}
function Yh(t) {
  return bt(Ar(t));
}
function Ar(t) {
  switch (t.type) {
    case Ft.BoolTrue:
    case Ft.BoolFalse:
      return M4(t);
    case Ft.OptionalNone:
    case Ft.OptionalSome:
      return N4(t);
    case Ft.Buffer:
      return P4(t);
    case Ft.UInt:
      return U4(t);
    case Ft.Int:
      return _4(t);
    case Ft.PrincipalStandard:
      return H4(t);
    case Ft.PrincipalContract:
      return O4(t);
    case Ft.ResponseOk:
    case Ft.ResponseErr:
      return D4(t);
    case Ft.List:
      return F4(t);
    case Ft.Tuple:
      return j4(t);
    case Ft.StringASCII:
      return R4(t);
    case Ft.StringUTF8:
      return z4(t);
    default:
      throw new Zi("Unable to serialize. Invalid Clarity Value.");
  }
}
const G4 = (t) => t.length % 2 ? `0${t}` : t, K4 = (t, e) => t.padEnd(e, "0"), Ly = (t, e) => t ? $i(t).length > e : !1;
function Bu(t) {
  return iy(t);
}
const na = (t) => k3(Nf(t)), Rf = (t) => bt(Q3(t)), V4 = (t) => bt(na(t)), q4 = (t) => {
  const e = na(t), n = $r(new Uint8Array([0]), new Uint8Array([e.length]), e), r = na(n);
  return bt(r);
}, Y4 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = na(r);
  return bt(s);
}, X4 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Nf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = na(o);
  return bt(a);
};
function W4(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Z4(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = hy.create(Nf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vo(t) {
  return t = typeof t == "string" ? zt(t) : t, {
    type: ct.PublicKey,
    data: t
  };
}
function Q4(t, e, n = ve.Compressed) {
  const r = dm(e), s = new Un(Yd(r.r), Yd(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === ve.Compressed;
  return i.toHex(o);
}
function J4(t) {
  return typeof t == "string" ? t : bt(t);
}
const zf = J4;
function Cy(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === fm;
}
function ko(t) {
  return !zf(t).startsWith("04");
}
function tE(t) {
  t = df(t);
  const e = Cy(t);
  return bt(pa(t.slice(0, 32), e));
}
function eE(t) {
  return Ut.fromHex(zf(t)).toHex(!0);
}
function nE(t) {
  return Ut.fromHex(zf(t)).toHex(!1);
}
function rE(t, e) {
  t = df(t);
  const [n, r] = Vc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return da(r, 1) + Un.fromHex(n).toCompactHex();
}
function Gf() {
  return {
    type: ct.MessageSignature,
    data: bt(new Uint8Array(rl))
  };
}
function Ty(t, e, n, r) {
  const s = Ff(0, t, 1, [vo(e)]).hash160, i = ko(e) ? ve.Compressed : ve.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: cn(n),
    fee: cn(r),
    keyEncoding: i,
    signature: Gf()
  };
}
function ra(t) {
  return "signature" in t;
}
function Xh(t) {
  return t === se.P2SH || t === se.P2WSH;
}
function sE(t) {
  return t === se.P2SHNonSequential || t === se.P2WSHNonSequential;
}
function Wh(t) {
  const e = Bu(t);
  return e.nonce = 0, e.fee = 0, ra(e) ? e.signature = Gf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function iE(t) {
  const e = [
    t.hashMode,
    zt(t.signer),
    Us(t.nonce, 8),
    Us(t.fee, 8),
    t.keyEncoding,
    Df(t.signature)
  ];
  return _e(e);
}
function oE(t) {
  const e = [
    t.hashMode,
    zt(t.signer),
    Us(t.nonce, 8),
    Us(t.fee, 8)
  ], n = Hf(t.fields);
  e.push(Of(n));
  const r = new Uint8Array(2);
  return pm(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function aE(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt(`0x${bt(e.readBytes(8))}`), s = BigInt(`0x${bt(e.readBytes(8))}`), i = e.readUInt8Enum(ve, (a) => {
    throw new hn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === se.P2WPKH && i != ve.Compressed)
    throw new hn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Lu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function cE(t, e) {
  const n = bt(e.readBytes(20)), r = BigInt("0x" + bt(e.readBytes(8))), s = BigInt("0x" + bt(e.readBytes(8))), i = Ay(e, ct.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ct.PublicKey:
        ko(u.contents.data) || (o = !0);
        break;
      case ct.MessageSignature:
        if (u.pubKeyEncoding === ve.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ei("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === se.P2WSH || t === se.P2WSHNonSequential))
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
function Tl(t) {
  return ra(t) ? iE(t) : oE(t);
}
function Bl(t) {
  const e = t.readUInt8Enum(se, (n) => {
    throw new hn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === se.P2PKH || e === se.P2WPKH ? aE(e, t) : cE(e, t);
}
function By(t, e, n, r) {
  const i = t + bt(new Uint8Array([e])) + bt(Us(n, 8)) + bt(Us(r, 8));
  if (zt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Rf(zt(i));
}
function My(t, e, n) {
  const r = 33 + rl, s = ko(e.data) ? ve.Compressed : ve.Uncompressed, i = t + G4(s.toString(16)) + n, o = zt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Rf(o);
}
function lE(t, e, n, r, s) {
  const i = By(t, e, n, r), o = rE(s, i), a = vo(tE(s)), c = My(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ny(t, e, n, r, s, i) {
  const o = By(t, e, n, r), a = vo(Q4(o, i, s)), c = My(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function uE() {
  const t = Ty(se.P2PKH, "", 0, 0);
  return t.signer = o4().hash160, t.keyEncoding = ve.Compressed, t.signature = Gf(), t;
}
function Zh(t, e, n) {
  return ra(t) ? fE(t, e, n) : dE(t, e, n);
}
function fE(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ny(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Ff(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ei(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function dE(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ct.PublicKey:
        ko(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case ct.MessageSignature:
        c.pubKeyEncoding === ve.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Ny(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Xh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new ei("Too many signatures");
        break;
    }
  if (Xh(t.hashMode) && o !== t.signaturesRequired || sE(t.hashMode) && o < t.signaturesRequired)
    throw new ei("Incorrect number of signatures");
  if (i && (t.hashMode === se.P2WSH || t.hashMode === se.P2WSHNonSequential))
    throw new ei("Uncompressed keys are not allowed in this hash mode");
  const a = Ff(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ei(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Py(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function _y(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Ty(se.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Qh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return Py(Wh(t.spendingCondition));
      case Le.Sponsored:
        return _y(Wh(t.spendingCondition), uE());
      default:
        throw new Ic("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function hE(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return Zh(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return Zh(t.spendingCondition, e, Le.Standard);
    default:
      throw new Ic("Invalid origin auth type");
  }
}
function pE(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: cn(e)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: cn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function gE(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: cn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function yE(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: cn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function wE(t, e) {
  const n = {
    ...e,
    nonce: cn(e.nonce),
    fee: cn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function bE(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(Tl(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(Tl(t.spendingCondition)), e.push(Tl(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function mE(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new hn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = Bl(t), Py(n);
    case Le.Sponsored:
      n = Bl(t);
      const r = Bl(t);
      return _y(n, r);
  }
}
class xE {
  constructor({ auth: e, payload: n, postConditions: r = Hf([]), postConditionMode: s = $c.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = qS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: cn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Mn.Any;
  }
  signBegin() {
    const e = Bu(this);
    return e.auth = Qh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Bu(this);
    return e.auth = Qh(e.auth), e.txid();
  }
  verifyOrigin() {
    return hE(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : vo(e), r = this.auth.spendingCondition;
    if (r && !ra(r)) {
      const s = ko(n.data);
      r.fields.push(Qi(s ? ve.Compressed : ve.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = lE(n, r, e.fee, e.nonce, s);
    if (ra(e))
      e.signature = $u(i);
    else {
      const a = Cy(s);
      e.fields.push(Qi(a ? ve.Compressed : ve.Uncompressed, $u(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Rf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = wE(this.auth, e);
  }
  setFee(e) {
    this.auth = pE(this.auth, e);
  }
  setNonce(e) {
    this.auth = gE(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = yE(this.auth, e);
  }
  serialize() {
    return bt(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Zi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Zi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Zi('"auth" is undefined');
    if (this.payload === void 0)
      throw new Zi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return li(n, this.chainId, 0), e.push(n), e.push(bE(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Of(this.postConditions)), e.push(ky(this.payload)), _e(e);
  }
}
function SE(t) {
  const e = vn(t, he) ? t : new he(t), n = e.readUInt8Enum(bi, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = mE(e), i = e.readUInt8Enum(Mn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum($c, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = Ay(e, ct.PostCondition), c = x4(e), u = new xE({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Jh = BigInt("18446744073709551615");
function Ml(t) {
  const e = cn(t);
  if (e < 0n || e > Jh)
    throw new RangeError(`Post-condition amount must be between 0 and ${Jh} (u64 max), received: ${e}`);
  return e;
}
var Mu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(Mu || (Mu = {}));
var Nu;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(Nu || (Nu = {}));
function EE(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: be.STX,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: gn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        amount: Ml(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: be.Fungible,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: gn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        amount: Ml(t.amount),
        asset: qh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: be.NonFungible,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: gn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        asset: qh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: be.Staking,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: gn.Origin } : Do(t.address),
        conditionCode: ja(t.condition),
        amount: Ml(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ct.PostCondition,
        conditionType: be.PoX,
        principal: t.address === "origin" ? { type: ct.Principal, prefix: gn.Origin } : Do(t.address),
        conditionCode: AE(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ja(t) {
  return Mu[t];
}
function AE(t) {
  return Nu[t];
}
function Uy(t) {
  const e = EE(t);
  return b4(e);
}
function vE(t, e, n) {
  return Vf(Hy(t), n);
}
function Hy(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = sa(r);
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
    return BigInt(`0x${IE(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Kf(t, e = 8) {
  return (typeof t == "bigint" ? t : Hy(t)).toString(16).padStart(e * 2, "0");
}
function Vf(t, e = 16) {
  const n = Kf(t, e);
  return sa(n);
}
function kE(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const $E = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function IE(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += $E[n];
  return e;
}
function sa(t) {
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
function qf(t) {
  return new TextEncoder().encode(t);
}
function LE(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function CE(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function t0(t) {
  if (t.some(CE))
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
  return Yf(...t.map((e) => typeof e == "number" ? t0([e]) : e instanceof Array ? t0(e) : e));
}
function ol(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Pu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pu || (Pu = {}));
Pu.Mainnet;
const TE = 128, BE = 128, Oy = 16;
var _u;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_u || (_u = {}));
var e0;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(e0 || (e0 = {}));
var n0;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(n0 || (n0 = {}));
var rr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(rr || (rr = {}));
const Nl = ["onChainOnly", "offChainOnly", "any"];
Nl[0] + "", rr.OnChainOnly, Nl[1] + "", rr.OffChainOnly, Nl[2] + "", rr.Any, rr.OnChainOnly + "", rr.OnChainOnly, rr.OffChainOnly + "", rr.OffChainOnly, rr.Any + "", rr.Any;
var Uu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Uu || (Uu = {}));
Uu.Mainnet;
var r0;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(r0 || (r0 = {}));
var Zs;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Zs || (Zs = {}));
var s0;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(s0 || (s0 = {}));
var i0;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(i0 || (i0 = {}));
var o0;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(o0 || (o0 = {}));
var a0;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(a0 || (a0 = {}));
var c0;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(c0 || (c0 = {}));
var l0;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(l0 || (l0 = {}));
var Hu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Hu || (Hu = {}));
var u0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(u0 || (u0 = {}));
var f0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(f0 || (f0 = {}));
function Ou(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function ME(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function NE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Ou(t.outputLen), Ou(t.blockLen);
}
function PE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function _E(t, e) {
  Dy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Pl = {
  number: Ou,
  bool: ME,
  bytes: Dy,
  hash: NE,
  exists: PE,
  output: _E
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), yr = (t, e) => t << 32 - e | t >>> e, UE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!UE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function HE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fy(t) {
  if (typeof t == "string" && (t = HE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let OE = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Mi(t) {
  const e = (r) => t().update(Fy(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function DE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Xf = class extends OE {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _l(this.buffer);
  }
  update(e) {
    Pl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Fy(e);
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
    Pl.exists(this), Pl.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    DE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = _l(e), c = this.outputLen;
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
const FE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jy = Uint8Array.from({ length: 16 }, (t, e) => e), jE = jy.map((t) => (9 * t + 5) % 16);
let Wf = [jy], Zf = [jE];
for (let t = 0; t < 4; t++)
  for (let e of [Wf, Zf])
    e.push(e[t].map((n) => FE[n]));
const Ry = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), RE = Wf.map((t, e) => t.map((n) => Ry[e][n])), zE = Zf.map((t, e) => t.map((n) => Ry[e][n])), GE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), KE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ra = (t, e) => t << e | t >>> 32 - e;
function d0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const za = new Uint32Array(16);
let VE = class extends Xf {
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
      const x = 4 - g, v = GE[g], T = KE[g], U = Wf[g], D = Zf[g], k = RE[g], C = zE[g];
      for (let P = 0; P < 16; P++) {
        const Y = Ra(r + d0(g, i, a, u) + za[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Ra(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = Ra(s + d0(x, o, c, h) + za[D[P]] + T, C[P]) + y | 0;
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
Mi(() => new VE());
const qE = (t, e, n) => t & e ^ ~t & n, YE = (t, e, n) => t & e ^ t & n ^ e & n, XE = new Uint32Array([
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
let zy = class extends Xf {
  constructor() {
    super(64, 32, 8, !1), this.A = ms[0] | 0, this.B = ms[1] | 0, this.C = ms[2] | 0, this.D = ms[3] | 0, this.E = ms[4] | 0, this.F = ms[5] | 0, this.G = ms[6] | 0, this.H = ms[7] | 0;
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
      xs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = xs[l - 15], g = xs[l - 2], x = yr(y, 7) ^ yr(y, 18) ^ y >>> 3, v = yr(g, 17) ^ yr(g, 19) ^ g >>> 10;
      xs[l] = v + xs[l - 7] + x + xs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = yr(a, 6) ^ yr(a, 11) ^ yr(a, 25), g = h + y + qE(a, c, u) + XE[l] + xs[l] | 0, v = (yr(r, 2) ^ yr(r, 13) ^ yr(r, 22)) + YE(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    xs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, WE = class extends zy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Mi(() => new zy());
Mi(() => new WE());
const Ga = BigInt(2 ** 32 - 1), Du = BigInt(32);
function Gy(t, e = !1) {
  return e ? { h: Number(t & Ga), l: Number(t >> Du & Ga) } : { h: Number(t >> Du & Ga) | 0, l: Number(t & Ga) | 0 };
}
function ZE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Gy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const QE = (t, e) => BigInt(t >>> 0) << Du | BigInt(e >>> 0), JE = (t, e, n) => t >>> n, tA = (t, e, n) => t << 32 - n | e >>> n, eA = (t, e, n) => t >>> n | e << 32 - n, nA = (t, e, n) => t << 32 - n | e >>> n, rA = (t, e, n) => t << 64 - n | e >>> n - 32, sA = (t, e, n) => t >>> n - 32 | e << 64 - n, iA = (t, e) => e, oA = (t, e) => t, aA = (t, e, n) => t << n | e >>> 32 - n, cA = (t, e, n) => e << n | t >>> 32 - n, lA = (t, e, n) => e << n - 32 | t >>> 64 - n, uA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function fA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const dA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), hA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, pA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), gA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, yA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), wA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: Gy,
  split: ZE,
  toBig: QE,
  shrSH: JE,
  shrSL: tA,
  rotrSH: eA,
  rotrSL: nA,
  rotrBH: rA,
  rotrBL: sA,
  rotr32H: iA,
  rotr32L: oA,
  rotlSH: aA,
  rotlSL: cA,
  rotlBH: lA,
  rotlBL: uA,
  add: fA,
  add3L: dA,
  add3H: hA,
  add4L: pA,
  add4H: gA,
  add5H: wA,
  add5L: yA
}, [bA, mA] = Bt.split([
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
].map((t) => BigInt(t))), Ss = new Uint32Array(80), Es = new Uint32Array(80);
let al = class extends Xf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: x, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = x | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      Ss[k] = e.getUint32(n), Es[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = Ss[k - 15] | 0, P = Es[k - 15] | 0, Y = Bt.rotrSH(C, P, 1) ^ Bt.rotrSH(C, P, 8) ^ Bt.shrSH(C, P, 7), ot = Bt.rotrSL(C, P, 1) ^ Bt.rotrSL(C, P, 8) ^ Bt.shrSL(C, P, 7), X = Ss[k - 2] | 0, W = Es[k - 2] | 0, $ = Bt.rotrSH(X, W, 19) ^ Bt.rotrBH(X, W, 61) ^ Bt.shrSH(X, W, 6), _ = Bt.rotrSL(X, W, 19) ^ Bt.rotrBL(X, W, 61) ^ Bt.shrSL(X, W, 6), m = Bt.add4L(ot, _, Es[k - 7], Es[k - 16]), B = Bt.add4H(m, Y, $, Ss[k - 7], Ss[k - 16]);
      Ss[k] = B | 0, Es[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: x, Gh: v, Gl: T, Hh: U, Hl: D } = this;
    for (let k = 0; k < 80; k++) {
      const C = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), P = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, ot = y & x ^ ~y & T, X = Bt.add5L(D, P, ot, mA[k], Es[k]), W = Bt.add5H(X, U, C, Y, bA[k], Ss[k]), $ = X | 0, _ = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), m = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), B = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, D = T | 0, v = g | 0, T = x | 0, g = l | 0, x = y | 0, { h: l, l: y } = Bt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Bt.add3L($, m, K);
      r = Bt.add3H(N, W, _, B), s = N | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: x } = Bt.add(this.Fh | 0, this.Fl | 0, g | 0, x | 0), { h: v, l: T } = Bt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: D } = Bt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, x, v, T, U, D);
  }
  roundClean() {
    Ss.fill(0), Es.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, xA = class extends al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, SA = class extends al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, EA = class extends al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Mi(() => new al());
Mi(() => new xA());
Mi(() => new SA());
Mi(() => new EA());
function AA(t, e, n) {
  const s = TE;
  if (DA(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: _u.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ye;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ye || (Ye = {}));
let vA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Ky = class extends vA {
  constructor(e) {
    super(e);
  }
};
function cl(t) {
  const e = [];
  return e.push(sa(Kf(t.version, 1))), e.push(sa(t.hash160)), Xr(e);
}
function kA(t) {
  const e = [];
  return e.push(t.prefix), e.push(cl(t.address)), t.prefix === Hu.Contract && e.push(ia(t.contractName)), Xr(e);
}
function ia(t) {
  const e = [], n = qf(t.content), r = n.byteLength;
  return e.push(sa(Kf(r, t.lengthPrefixBytes))), e.push(n), Xr(e);
}
function $A(t) {
  const e = [];
  return e.push(cl(t.address)), e.push(ia(t.contractName)), e.push(ia(t.assetName)), Xr(e);
}
function Vy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(kA(t.principal)), (t.conditionType === Zs.Fungible || t.conditionType === Zs.NonFungible) && e.push($A(t.assetInfo)), t.conditionType === Zs.NonFungible && e.push(xi(t.assetName)), e.push(t.conditionCode), t.conditionType === Zs.STX || t.conditionType === Zs.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Ky("The post-condition amount may not be larger than 8 bytes");
    e.push(vE(t.amount, !1, 8));
  }
  return Xr(e);
}
function Cr(t, e) {
  return Xr([t, e]);
}
function IA(t) {
  return new Uint8Array([t.type]);
}
function LA(t) {
  return t.type === Ye.OptionalNone ? new Uint8Array([t.type]) : Cr(t.type, xi(t.value));
}
function CA(t) {
  const e = new Uint8Array(4);
  return ol(e, t.buffer.length, 0), Cr(t.type, Yf(e, t.buffer));
}
function TA(t) {
  const e = Vf(kE(t.value, BigInt(BE)), Oy);
  return Cr(t.type, e);
}
function BA(t) {
  const e = Vf(t.value, Oy);
  return Cr(t.type, e);
}
function MA(t) {
  return Cr(t.type, cl(t.address));
}
function NA(t) {
  return Cr(t.type, Yf(cl(t.address), ia(t.contractName)));
}
function PA(t) {
  return Cr(t.type, xi(t.value));
}
function _A(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = xi(r);
    e.push(s);
  }
  return Cr(t.type, Xr(e));
}
function UA(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = AA(s);
    e.push(ia(i));
    const o = xi(t.data[s]);
    e.push(o);
  }
  return Cr(t.type, Xr(e));
}
function qy(t, e) {
  const n = [], r = e == "ascii" ? LE(t.data) : qf(t.data), s = new Uint8Array(4);
  return ol(s, r.length, 0), n.push(s), n.push(r), Cr(t.type, Xr(n));
}
function HA(t) {
  return qy(t, "ascii");
}
function OA(t) {
  return qy(t, "utf8");
}
function xi(t) {
  switch (t.type) {
    case Ye.BoolTrue:
    case Ye.BoolFalse:
      return IA(t);
    case Ye.OptionalNone:
    case Ye.OptionalSome:
      return LA(t);
    case Ye.Buffer:
      return CA(t);
    case Ye.UInt:
      return BA(t);
    case Ye.Int:
      return TA(t);
    case Ye.PrincipalStandard:
      return MA(t);
    case Ye.PrincipalContract:
      return NA(t);
    case Ye.ResponseOk:
    case Ye.ResponseErr:
      return PA(t);
    case Ye.List:
      return _A(t);
    case Ye.Tuple:
      return UA(t);
    case Ye.StringASCII:
      return HA(t);
    case Ye.StringUTF8:
      return OA(t);
    default:
      throw new Ky("Unable to serialize. Invalid Clarity Value.");
  }
}
const DA = (t, e) => t ? qf(t).length > e : !1, FA = "connect-ui";
let ac, Yy, Nn = !1, Fu = !1;
const Yr = (t, e = "") => () => {
}, jA = (t, e) => () => {
}, RA = "{visibility:hidden}.hydrated{visibility:inherit}", h0 = {}, zA = "http://www.w3.org/2000/svg", GA = "http://www.w3.org/1999/xhtml", KA = (t) => t != null, Qf = (t) => (t = typeof t, t === "object" || t === "function");
function Xy(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const vt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let h = 0; h < u.length; h++)
      r = u[h], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !Qf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? ju(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((h) => u[h]).join(" "));
  }
  const c = ju(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, ju = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, VA = {}, qA = (t) => t && t.$tag$ === VA, YA = (t, e) => t != null && !Qf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, XA = (t) => $o(t).$hostElement$, WA = (t, e, n) => {
  const r = on.ce(e, n);
  return t.dispatchEvent(r), r;
}, p0 = /* @__PURE__ */ new WeakMap(), ZA = (t, e, n) => {
  let r = Lc.get(t);
  wv && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Lc.set(t, r);
}, QA = (t, e, n, r) => {
  var s;
  let i = Wy(e);
  const o = Lc.get(i);
  if (t = t.nodeType === 11 ? t : vr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = p0.get(t), c;
      if (a || p0.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = vr.createElement("style"), c.innerHTML = o;
          const u = (s = on.$nonce$) !== null && s !== void 0 ? s : Xy(vr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, JA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Yr("attachStyles", e.$tagName$), i = QA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Wy = (t, e) => "sc-" + t.$tagName$, g0 = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = w0(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = y0(n), h = y0(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : w0(ll, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && on.rel(t, e, n, !1), r && on.ael(t, e, r, !1);
    else {
      const c = Qf(r);
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
}, tv = /\s/, y0 = (t) => t ? t.split(tv) : [], Zy = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || h0, o = e.$attrs$ || h0;
  for (r in i)
    r in o || g0(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    g0(s, r, i[r], o[r], n, e.$flags$);
}, Jf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = vr.createTextNode(s.$text$);
  else {
    if (Nn || (Nn = s.$tag$ === "svg"), o = s.$elm$ = vr.createElementNS(Nn ? zA : GA, s.$tag$), Nn && s.$tag$ === "foreignObject" && (Nn = !1), Zy(null, s, Nn), KA(ac) && o["s-si"] !== ac && o.classList.add(o["s-si"] = ac), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Jf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Nn = !1 : o.tagName === "foreignObject" && (Nn = !0);
  }
  return o;
}, Qy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Yy && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Jf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Jy = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, ev = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : Ka(a, h) ? (Ko(a, h), a = e[++s], h = r[++i]) : Ka(c, l) ? (Ko(c, l), c = e[--o], l = r[--u]) : Ka(a, l) ? (Ko(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ka(c, h) ? (Ko(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (y = Jf(e && e[i], n, i), h = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Qy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Jy(e, s, o);
}, Ka = (t, e) => t.$tag$ === e.$tag$, Ko = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Nn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Nn, Zy(t, e, Nn), r !== null && s !== null ? ev(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Qy(n, null, e, s, 0, s.length - 1)) : r !== null && Jy(r, 0, r.length - 1), Nn && i === "svg" && (Nn = !1)) : t.$text$ !== o && (n.data = o);
}, nv = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ju(null, null), s = qA(e) ? e : vt(null, null, e);
  Yy = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ac = n["s-sc"], Ko(r, s);
}, tw = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, td = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return tw(t, t.$ancestorComponent$), mv(() => rv(t, e));
}, rv = (t, e) => {
  const n = Yr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), av(s, () => sv(t, r, e));
}, sv = async (t, e, n) => {
  const r = t.$hostElement$, s = Yr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && JA(t);
  const o = Yr("render", t.$cmpMeta$.$tagName$);
  iv(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => ov(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, iv = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, nv(t, e);
  } catch (r) {
    oa(r, t.$hostElement$);
  }
  return null;
}, ov = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Yr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, nw(n), r(), t.$onReadyResolve$(n), s || ew()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && nd(() => td(t, !1)), t.$flags$ &= -517;
}, ew = (t) => {
  nw(vr.documentElement), nd(() => WA(ll, "appload", { detail: { namespace: FA } }));
}, av = (t, e) => t && t.then ? t.then(e) : e(), nw = (t) => t.classList.add("hydrated"), cv = (t, e) => $o(t).$instanceValues$.get(e), lv = (t, e, n, r) => {
  const s = $o(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = YA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && td(s, !1));
}, rw = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return cv(this, i);
        },
        set(a) {
          lv(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        on.jmp(() => {
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
}, uv = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = yv(n), s.then) {
        const c = jA();
        s = await s, c();
      }
      s.isProxied || (rw(
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
        oa(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Wy(n);
      if (!Lc.has(c)) {
        const u = Yr("registerStyles", n.$tagName$);
        ZA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => td(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, fv = (t) => {
  if (!(on.$flags$ & 1)) {
    const e = $o(t), n = e.$cmpMeta$, r = Yr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            tw(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), uv(t, e, n);
    }
    r();
  }
}, dv = (t) => {
  on.$flags$ & 1 || $o(t);
}, hv = (t, e = {}) => {
  var n;
  const r = Yr(), s = [], i = e.exclude || [], o = ll.customElements, a = vr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ vr.createElement("style"), h = [];
  let l, y = !0;
  Object.assign(on, e), on.$resourcesUrl$ = new URL(e.resourcesUrl || "./", vr.baseURI).href, t.map((g) => {
    g[1].map((x) => {
      const v = {
        $flags$: x[0],
        $tagName$: x[1],
        $members$: x[2],
        $listeners$: x[3]
      };
      v.$members$ = x[2];
      const T = v.$tagName$, U = class extends HTMLElement {
        // StencilLazyHost
        constructor(D) {
          super(D), D = this, gv(D, v), v.$flags$ & 1 && D.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? h.push(this) : on.jmp(() => fv(this));
        }
        disconnectedCallback() {
          on.jmp(() => dv(this));
        }
        componentOnReady() {
          return $o(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = g[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, rw(
        U,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + RA, u.setAttribute("data-styles", "");
    const g = (n = on.$nonce$) !== null && n !== void 0 ? n : Xy(vr);
    g != null && u.setAttribute("nonce", g), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, h.length ? h.map((g) => g.connectedCallback()) : on.jmp(() => l = setTimeout(ew, 30)), r();
}, ed = /* @__PURE__ */ new WeakMap(), $o = (t) => ed.get(t), pv = (t, e) => ed.set(e.$lazyInstance$ = t, e), gv = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], ed.set(t, n);
}, w0 = (t, e) => e in t, oa = (t, e) => (0, console.error)(t, e), Ul = /* @__PURE__ */ new Map(), yv = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Ul.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Ul.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => CI).then(o, oa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Ul.set(s, o), o[r]), oa);
}, Lc = /* @__PURE__ */ new Map(), ll = typeof window < "u" ? window : {}, vr = ll.document || { head: {} }, on = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, sw = (t) => Promise.resolve(t), wv = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), b0 = [], iw = [], bv = (t, e) => (n) => {
  t.push(n), Fu || (Fu = !0, on.$flags$ & 4 ? nd(Ru) : on.raf(Ru));
}, m0 = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      oa(n);
    }
  t.length = 0;
}, Ru = () => {
  m0(b0), m0(iw), (Fu = b0.length > 0) && on.raf(Ru);
}, nd = (t) => sw().then(t), mv = /* @__PURE__ */ bv(iw), xv = () => sw(), Sv = (t, e) => typeof window > "u" ? Promise.resolve() : xv().then(() => hv([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var Ev = Object.defineProperty, Av = Object.defineProperties, vv = Object.getOwnPropertyDescriptors, Cc = Object.getOwnPropertySymbols, ow = Object.prototype.hasOwnProperty, aw = Object.prototype.propertyIsEnumerable, x0 = (t, e, n) => e in t ? Ev(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, On = (t, e) => {
  for (var n in e || (e = {})) ow.call(e, n) && x0(t, n, e[n]);
  if (Cc) for (var n of Cc(e)) aw.call(e, n) && x0(t, n, e[n]);
  return t;
}, lr = (t, e) => Av(t, vv(e)), cw = (t, e) => {
  var n = {};
  for (var r in t) ow.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Cc) for (var r of Cc(t)) e.indexOf(r) < 0 && aw.call(t, r) && (n[r] = t[r]);
  return n;
};
function lw() {
  return nl(pi()) || window.StacksProvider || window.BlockstackProvider;
}
function ul(t) {
  return t ? typeof t == "string" ? yi.fromName(t) : "version" in t ? t : "url" in t ? new yu({ url: t.url }) : t.transactionVersion === bi.Mainnet ? new yu({ url: t.client.baseUrl }) : new wu({ url: t.client.baseUrl }) : new wu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var kv = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(kv || {}), $v = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))($v || {}), rd = (t) => {
  let e = t;
  if (!e) {
    let n = new Fp(["store_write"], document.location.href);
    e = new gu({ appConfig: n });
  }
  return e;
};
function uw(t) {
  try {
    return rd(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var fw = (t) => {
  let e = rd(t).loadUserData().appPrivateKey, n = Ze.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function Iv(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [wi.Mainnet]: "mainnet", [wi.Testnet]: "testnet" }, a = ul(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function Lv(t) {
  let e = ul(t.network), n = rd(t.userSession), r = lr(On({}, t), { network: e, userSession: n });
  return On({ stxAddress: Iv(r) }, r);
}
async function Cv(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Uy) : n = n.map((r) => bt(Vy(r)))), new Ze.TokenSigner("ES256k", e).signAsync(lr(On({}, t), { postConditions: n }));
}
function Tv(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Uy) : e = e.map((n) => bt(Vy(n)))), Ze.createUnsecuredToken(lr(On({}, t), { postConditions: e }));
}
var Bv = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = zt(a.replace(/^0x/, "")), u = SE(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, lr(On({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, lr(On({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, Mv = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = cw(e, ["amount", "appDetails", "userSession"]);
  if (uw(s)) {
    let { privateKey: a, publicKey: c } = fw(s), u = lr(On({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), Cv(u, a);
  }
  let o = lr(On({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), Tv(o);
};
async function Nv(t, e, n) {
  let r = await e(lr(On(On({}, Lv(t)), t), { network: ul(t.network) }));
  return Bv({ token: r, options: t }, n);
}
function Pv(t, e = lw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return Nv(t, Mv, e);
}
function dw(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? lr(On({}, t), { message: Yh(e), domain: Yh(n) }) : lr(On({}, t), { message: bt(xi(e)), domain: bt(xi(n)) });
}
async function _v(t, e) {
  return new Ze.TokenSigner("ES256k", e).signAsync(dw(t));
}
async function Uv(t) {
  let e = t, { userSession: n } = e, r = cw(e, ["userSession"]);
  if (uw(n)) {
    let { privateKey: s, publicKey: i } = fw(n), o = lr(On({}, r), { publicKey: i });
    return _v(o, s);
  }
  return Ze.createUnsecuredToken(dw(t));
}
var Hv = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(Hv || {}), hw = "asigna-stx", S0 = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === hw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(Dv(t, e), "*");
}), Ov = { authenticationRequest: async (t) => S0(t, "authenticationRequest"), transactionRequest: async (t) => S0(t, "transactionRequest") }, Dv = (t, e) => ({ source: hw, [e]: t }), Fv = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = Ov);
};
Fv();
var jv = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function Rv(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = pi(), o = lw();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    Sv();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : jv, c = NS(a), u = document.createElement("connect-modal");
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
var Va = Rv(Pv);
function Hs(t, e, n) {
  return sd(wn(t, e), n);
}
function wn(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = xe(r);
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
      const r = Kv(BigInt(`0x${Ht(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ht(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function E0(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ma(t, e = 8) {
  return (typeof t == "bigint" ? t : wn(t, !1)).toString(16).padStart(e * 2, "0");
}
function fl(t) {
  return parseInt(t, 16);
}
function sd(t, e = 16) {
  const n = ma(t, e);
  return xe(n);
}
function zv(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function Gv(t, e) {
  return t & BigInt(1) << e;
}
function Kv(t, e) {
  return Gv(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const Vv = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ht(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += Vv[n];
  return e;
}
function xe(t) {
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
function Io(t) {
  return new TextEncoder().encode(t);
}
function id(t) {
  return new TextDecoder().decode(t);
}
function pw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function qv(t) {
  return String.fromCharCode.apply(null, t);
}
function Yv(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function A0(t) {
  if (t.some(Yv))
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
function Ue(t) {
  return dl(...t.map((e) => typeof e == "number" ? A0([e]) : e instanceof Array ? A0(e) : e));
}
var v0;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(v0 || (v0 = {}));
var k0;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(k0 || (k0 = {}));
var $0;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})($0 || ($0 = {}));
const gw = 33, Hl = 32;
function Xv(t) {
  if (t.length < Hl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Hl * 2), r = t.slice(2 + Hl * 2);
  return {
    recoveryId: fl(e),
    r: n,
    s: r
  };
}
function Wv(t) {
  const e = typeof t == "string" ? xe(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Zv(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function Qv(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function Jv(t, e) {
  return t[e];
}
function t8(t, e, n = 0) {
  return t[n] = e, t;
}
function e8(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Si(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var zu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zu || (zu = {}));
const n8 = zu.Mainnet, r8 = 128, s8 = 128, yw = 16, oi = 32, Gu = 80, hl = 65, i8 = 32, o8 = 64, Tc = 34;
var yt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(yt || (yt = {}));
var _t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_t || (_t = {}));
var Ku;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ku || (Ku = {}));
var En;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(En || (En = {}));
const cc = ["onChainOnly", "offChainOnly", "any"], I0 = {
  [cc[0]]: En.OnChainOnly,
  [cc[1]]: En.OffChainOnly,
  [cc[2]]: En.Any,
  [En.OnChainOnly]: En.OnChainOnly,
  [En.OffChainOnly]: En.OffChainOnly,
  [En.Any]: En.Any
};
function a8(t) {
  if (t in I0)
    return I0[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${cc.join(", ")}`);
}
var Bc;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Bc || (Bc = {}));
Bc.Mainnet;
var wo;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(wo || (wo = {}));
var An;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(An || (An = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var ie;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ie || (ie = {}));
var Mc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Mc || (Mc = {}));
var ke;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(ke || (ke = {}));
var aa;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(aa || (aa = {}));
var Vu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Vu || (Vu = {}));
var ca;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(ca || (ca = {}));
var L0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(L0 || (L0 = {}));
var C0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(C0 || (C0 = {}));
function qu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function c8(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ww(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function l8(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  qu(t.outputLen), qu(t.blockLen);
}
function u8(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function f8(t, e) {
  ww(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ri = {
  number: qu,
  bool: c8,
  bytes: ww,
  hash: l8,
  exists: u8,
  output: f8
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Ol = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), wr = (t, e) => t << 32 - e | t >>> e, d8 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!d8)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function h8(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function od(t) {
  if (typeof t == "string" && (t = h8(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class bw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function Ni(t) {
  const e = (r) => t().update(od(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function p8(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class ad extends bw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Ol(this.buffer);
  }
  update(e) {
    ri.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = od(e);
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
    ri.exists(this), ri.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    p8(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const g8 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), mw = Uint8Array.from({ length: 16 }, (t, e) => e), y8 = mw.map((t) => (9 * t + 5) % 16);
let cd = [mw], ld = [y8];
for (let t = 0; t < 4; t++)
  for (let e of [cd, ld])
    e.push(e[t].map((n) => g8[n]));
const xw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), w8 = cd.map((t, e) => t.map((n) => xw[e][n])), b8 = ld.map((t, e) => t.map((n) => xw[e][n])), m8 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), x8 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), qa = (t, e) => t << e | t >>> 32 - e;
function T0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ya = new Uint32Array(16);
class S8 extends ad {
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
      Ya[g] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, h = u, l = this.h4 | 0, y = l;
    for (let g = 0; g < 5; g++) {
      const x = 4 - g, v = m8[g], T = x8[g], U = cd[g], D = ld[g], k = w8[g], C = b8[g];
      for (let P = 0; P < 16; P++) {
        const Y = qa(r + T0(g, i, a, u) + Ya[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = qa(a, 10) | 0, a = i, i = Y;
      }
      for (let P = 0; P < 16; P++) {
        const Y = qa(s + T0(x, o, c, h) + Ya[D[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = qa(c, 10) | 0, c = o, o = Y;
      }
    }
    this.set(this.h1 + a + h | 0, this.h2 + u + y | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    Ya.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const E8 = Ni(() => new S8()), A8 = (t, e, n) => t & e ^ ~t & n, v8 = (t, e, n) => t & e ^ t & n ^ e & n, k8 = new Uint32Array([
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
]), As = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), vs = new Uint32Array(64);
class Sw extends ad {
  constructor() {
    super(64, 32, 8, !1), this.A = As[0] | 0, this.B = As[1] | 0, this.C = As[2] | 0, this.D = As[3] | 0, this.E = As[4] | 0, this.F = As[5] | 0, this.G = As[6] | 0, this.H = As[7] | 0;
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
      vs[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = vs[l - 15], g = vs[l - 2], x = wr(y, 7) ^ wr(y, 18) ^ y >>> 3, v = wr(g, 17) ^ wr(g, 19) ^ g >>> 10;
      vs[l] = v + vs[l - 7] + x + vs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = wr(a, 6) ^ wr(a, 11) ^ wr(a, 25), g = h + y + A8(a, c, u) + k8[l] + vs[l] | 0, v = (wr(r, 2) ^ wr(r, 13) ^ wr(r, 22)) + v8(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    vs.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class $8 extends Sw {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ud = Ni(() => new Sw());
Ni(() => new $8());
const Xa = BigInt(2 ** 32 - 1), Yu = BigInt(32);
function Ew(t, e = !1) {
  return e ? { h: Number(t & Xa), l: Number(t >> Yu & Xa) } : { h: Number(t >> Yu & Xa) | 0, l: Number(t & Xa) | 0 };
}
function I8(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ew(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const L8 = (t, e) => BigInt(t >>> 0) << Yu | BigInt(e >>> 0), C8 = (t, e, n) => t >>> n, T8 = (t, e, n) => t << 32 - n | e >>> n, B8 = (t, e, n) => t >>> n | e << 32 - n, M8 = (t, e, n) => t << 32 - n | e >>> n, N8 = (t, e, n) => t << 64 - n | e >>> n - 32, P8 = (t, e, n) => t >>> n - 32 | e << 64 - n, _8 = (t, e) => e, U8 = (t, e) => t, H8 = (t, e, n) => t << n | e >>> 32 - n, O8 = (t, e, n) => e << n | t >>> 32 - n, D8 = (t, e, n) => e << n - 32 | t >>> 64 - n, F8 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function j8(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const R8 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), z8 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, G8 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), K8 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, V8 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), q8 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: Ew,
  split: I8,
  toBig: L8,
  shrSH: C8,
  shrSL: T8,
  rotrSH: B8,
  rotrSL: M8,
  rotrBH: N8,
  rotrBL: P8,
  rotr32H: _8,
  rotr32L: U8,
  rotlSH: H8,
  rotlSL: O8,
  rotlBH: D8,
  rotlBL: F8,
  add: j8,
  add3L: R8,
  add3H: z8,
  add4L: G8,
  add4H: K8,
  add5H: q8,
  add5L: V8
}, [Y8, X8] = Mt.split([
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
].map((t) => BigInt(t))), ks = new Uint32Array(80), $s = new Uint32Array(80);
class pl extends ad {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: h, Fh: l, Fl: y, Gh: g, Gl: x, Hh: v, Hl: T } = this;
    return [e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, h, l, y, g, x, v, T) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = h | 0, this.Fh = l | 0, this.Fl = y | 0, this.Gh = g | 0, this.Gl = x | 0, this.Hh = v | 0, this.Hl = T | 0;
  }
  process(e, n) {
    for (let k = 0; k < 16; k++, n += 4)
      ks[k] = e.getUint32(n), $s[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = ks[k - 15] | 0, P = $s[k - 15] | 0, Y = Mt.rotrSH(C, P, 1) ^ Mt.rotrSH(C, P, 8) ^ Mt.shrSH(C, P, 7), ot = Mt.rotrSL(C, P, 1) ^ Mt.rotrSL(C, P, 8) ^ Mt.shrSL(C, P, 7), X = ks[k - 2] | 0, W = $s[k - 2] | 0, $ = Mt.rotrSH(X, W, 19) ^ Mt.rotrBH(X, W, 61) ^ Mt.shrSH(X, W, 6), _ = Mt.rotrSL(X, W, 19) ^ Mt.rotrBL(X, W, 61) ^ Mt.shrSL(X, W, 6), m = Mt.add4L(ot, _, $s[k - 7], $s[k - 16]), B = Mt.add4H(m, Y, $, ks[k - 7], ks[k - 16]);
      ks[k] = B | 0, $s[k] = m | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: x, Gh: v, Gl: T, Hh: U, Hl: D } = this;
    for (let k = 0; k < 80; k++) {
      const C = Mt.rotrSH(l, y, 14) ^ Mt.rotrSH(l, y, 18) ^ Mt.rotrBH(l, y, 41), P = Mt.rotrSL(l, y, 14) ^ Mt.rotrSL(l, y, 18) ^ Mt.rotrBL(l, y, 41), Y = l & g ^ ~l & v, ot = y & x ^ ~y & T, X = Mt.add5L(D, P, ot, X8[k], $s[k]), W = Mt.add5H(X, U, C, Y, Y8[k], ks[k]), $ = X | 0, _ = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), m = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), B = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, D = T | 0, v = g | 0, T = x | 0, g = l | 0, x = y | 0, { h: l, l: y } = Mt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Mt.add3L($, m, K);
      r = Mt.add3H(N, W, _, B), s = N | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: x } = Mt.add(this.Fh | 0, this.Fl | 0, g | 0, x | 0), { h: v, l: T } = Mt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: D } = Mt.add(this.Hh | 0, this.Hl | 0, U | 0, D | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, x, v, T, U, D);
  }
  roundClean() {
    ks.fill(0), $s.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class W8 extends pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Z8 extends pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Q8 extends pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
Ni(() => new pl());
Ni(() => new W8());
const J8 = Ni(() => new Z8());
Ni(() => new Q8());
function Aw(t) {
  if (xe(t).byteLength != hl)
    throw Error("Invalid signature");
  return {
    type: yt.MessageSignature,
    data: t
  };
}
function Vo(t, e) {
  return { type: yt.Address, version: t, hash160: e };
}
function Ji(t) {
  return Ti.c32address(t.version, t.hash160);
}
function Ei(t, e, n) {
  const r = e || 1, s = n || r8;
  if (Fw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: yt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function fd(t) {
  const e = Ti.c32addressDecode(t);
  return {
    type: yt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
function tk(t) {
  if (t.type === J.PrincipalStandard)
    return Ji(t.address);
  if (t.type === J.PrincipalContract)
    return `${Ji(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function vw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return rk(e, n);
  } else
    return ek(t);
}
function ek(t) {
  const e = fd(t);
  return { type: J.PrincipalStandard, address: e };
}
function nk(t) {
  return { type: J.PrincipalStandard, address: t };
}
function rk(t, e) {
  const n = fd(t), r = Ei(e);
  return kw(n, r);
}
function kw(t, e) {
  if (Io(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: J.PrincipalContract, address: t, contractName: e };
}
function Dl(t, e = !1) {
  switch (t.type) {
    case J.BoolTrue:
      return !0;
    case J.BoolFalse:
      return !1;
    case J.Int:
    case J.UInt:
      return e ? t.value.toString() : t.value;
    case J.Buffer:
      return `0x${Ht(t.buffer)}`;
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
      return tk(t);
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
      return { type: Cs(t), value: Dl(t, !0), success: !1 };
    case J.ResponseOk:
      return { type: Cs(t), value: Dl(t, !0), success: !0 };
    default:
      return { type: Cs(t), value: Dl(t, !0) };
  }
}
function Cs(t) {
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
      return `(optional ${Cs(t.value)})`;
    case J.ResponseErr:
      return `(response UnknownType ${Cs(t.value)})`;
    case J.ResponseOk:
      return `(response ${Cs(t.value)} UnknownType)`;
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return "principal";
    case J.List:
      return `(list ${t.list.length} ${t.list.length ? Cs(t.list[0]) : "UnknownType"})`;
    case J.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Cs(t.data[e])})`).join(" ")})`;
    case J.StringASCII:
      return `(string-ascii ${pw(t.data).length})`;
    case J.StringUTF8:
      return `(string-utf8 ${Io(t.data).length})`;
  }
}
const $w = () => ({ type: J.BoolTrue }), Iw = () => ({ type: J.BoolFalse }), sk = (t) => t ? $w() : Iw(), B0 = BigInt("0xffffffffffffffffffffffffffffffff"), ik = BigInt(0), M0 = BigInt("0x7fffffffffffffffffffffffffffffff"), N0 = BigInt("-170141183460469231731687303715884105728"), ok = (t) => {
  const e = wn(t, !0);
  if (e > M0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${M0}`);
  if (e < N0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${N0}`);
  return { type: J.Int, value: e };
}, kr = (t) => {
  const e = wn(t, !1);
  if (e < ik)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > B0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${B0}`);
  return { type: J.UInt, value: e };
}, Lw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: J.Buffer, buffer: t };
};
function Cw() {
  return { type: J.OptionalNone };
}
function Tw(t) {
  return { type: J.OptionalSome, value: t };
}
function ak(t) {
  return { type: J.ResponseErr, value: t };
}
function ck(t) {
  return { type: J.ResponseOk, value: t };
}
function lk(t) {
  return { type: J.List, list: t };
}
function Ai(t) {
  for (const e in t)
    if (!Qk(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const We = (t) => ({ type: J.StringASCII, data: t }), uk = (t) => ({ type: J.StringUTF8, data: t });
class Bw extends bw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ri.hash(e);
    const r = od(n);
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
    return ri.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ri.exists(this), ri.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Mw = (t, e, n) => new Bw(t, e).update(n).digest();
Mw.create = (t, e) => new Bw(t, e);
Te.hmacSha256Sync = (t, ...e) => {
  const n = Mw.create(ud, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function bo(t) {
  return {
    type: yt.PublicKey,
    data: xe(t)
  };
}
function fk(t, e, n = ke.Compressed) {
  const r = Xv(e.data), s = new Un(E0(r.r), E0(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === ke.Compressed;
  return i.toHex(o);
}
function dk(t) {
  return { type: yt.PublicKey, data: t };
}
function Lo(t) {
  return !Ht(t.data).startsWith("04");
}
function Nc(t) {
  return t.data.slice();
}
function hk(t) {
  const e = yk(t), n = pa(e.data.slice(0, 32), e.compressed);
  return bo(Ht(n));
}
function pk(t) {
  const e = typeof t == "string" ? t : Ht(t), n = Ut.fromHex(e).toHex(!0);
  return bo(n);
}
function gk(t) {
  const e = typeof t == "string" ? t : Ht(t), n = Ut.fromHex(e).toHex(!1);
  return bo(n);
}
function Xu(t) {
  const e = t.readUInt8(), n = e === 4 ? o8 : i8;
  return dk(Ue([e, t.readBytes(n)]));
}
function yk(t) {
  const e = Wv(t), n = e.length == gw;
  return { data: e, compressed: n };
}
function wk(t, e) {
  const [n, r] = Vc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = ma(r, 1) + Un.fromHex(n).toCompactHex();
  return Aw(i);
}
function bk(t) {
  return hk(t.data);
}
function mk(t, e, n) {
  return typeof t == "string" && (t = vw(t)), typeof n == "string" && (n = U0(n)), {
    type: yt.Payload,
    payloadType: _t.TokenTransfer,
    recipient: t,
    amount: wn(e, !1),
    memo: n ?? U0("")
  };
}
function xk(t, e, n, r) {
  return typeof t == "string" && (t = fd(t)), typeof e == "string" && (e = Ei(e)), typeof n == "string" && (n = Ei(n)), {
    type: yt.Payload,
    payloadType: _t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function P0(t, e, n) {
  return typeof t == "string" && (t = Ei(t)), typeof e == "string" && (e = Ck(e)), typeof n == "number" ? {
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
function Sk() {
  return { type: yt.Payload, payloadType: _t.PoisonMicroblock };
}
function _0(t, e) {
  if (t.byteLength != oi)
    throw Error(`Coinbase buffer size must be ${oi} bytes`);
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
function Ek(t, e, n) {
  if (t.byteLength != oi)
    throw Error(`Coinbase buffer size must be ${oi} bytes`);
  if (n.byteLength != Gu)
    throw Error(`VRF proof buffer size must be ${Gu} bytes`);
  return {
    type: yt.Payload,
    payloadType: _t.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === J.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Wu;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Wu || (Wu = {}));
function Ak(t, e, n, r, s, i, o) {
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
function Nw(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case _t.TokenTransfer:
      e.push(Ne(t.recipient)), e.push(Hs(t.amount, !1, 8)), e.push(Or(t.memo));
      break;
    case _t.ContractCall:
      e.push(Or(t.contractAddress)), e.push(Or(t.contractName)), e.push(Or(t.functionName));
      const n = new Uint8Array(4);
      Si(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
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
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient ? Tw(t.recipient) : Cw())), e.push(t.vrfProof);
      break;
    case _t.TenureChange:
      e.push(xe(t.tenureHash)), e.push(xe(t.previousTenureHash)), e.push(xe(t.burnViewHash)), e.push(xe(t.previousTenureEnd)), e.push(Si(new Uint8Array(4), t.previousTenureBlocks)), e.push(t8(new Uint8Array(1), t.cause)), e.push(xe(t.publicKeyHash));
      break;
  }
  return Ue(e);
}
function vk(t) {
  switch (t.readUInt8Enum(_t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case _t.TokenTransfer:
      const n = Wn(t), r = wn(t.readBytes(8), !1), s = _w(t);
      return mk(n, r, s);
    case _t.ContractCall:
      const i = mo(t), o = Xn(t), a = Xn(t), c = [], u = t.readUInt32BE();
      for (let k = 0; k < u; k++) {
        const C = Wn(t);
        c.push(C);
      }
      return xk(i, o, a, c);
    case _t.SmartContract:
      const h = Xn(t), l = Xn(t, 4, 1e5);
      return P0(h, l);
    case _t.VersionedSmartContract: {
      const k = t.readUInt8Enum(Ku, (Y) => {
        throw new Error(`Cannot recognize ClarityVersion: ${Y}`);
      }), C = Xn(t), P = Xn(t, 4, 1e5);
      return P0(C, P, k);
    }
    case _t.PoisonMicroblock:
      return Sk();
    case _t.Coinbase: {
      const k = t.readBytes(oi);
      return _0(k);
    }
    case _t.CoinbaseToAltRecipient: {
      const k = t.readBytes(oi), C = Wn(t);
      return _0(k, C);
    }
    case _t.NakamotoCoinbase: {
      const k = t.readBytes(oi), C = Wn(t), P = t.readBytes(Gu);
      return Ek(k, C, P);
    }
    case _t.TenureChange:
      const y = Ht(t.readBytes(20)), g = Ht(t.readBytes(20)), x = Ht(t.readBytes(20)), v = Ht(t.readBytes(32)), T = t.readUInt32BE(), U = t.readUInt8Enum(Wu, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), D = Ht(t.readBytes(20));
      return Ak(y, g, x, v, T, U, D);
  }
}
class gl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Qs extends gl {
  constructor(e) {
    super(e);
  }
}
class _n extends gl {
  constructor(e) {
    super(e);
  }
}
class Pc extends gl {
  constructor(e) {
    super(e);
  }
}
class si extends gl {
  constructor(e) {
    super(e);
  }
}
var or;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(or || (or = {}));
function Zu(t) {
  return Aw(Ht(t.readBytes(hl)));
}
function to(t, e) {
  return {
    pubKeyEncoding: t,
    type: yt.TransactionAuthField,
    contents: e
  };
}
function kk(t) {
  const e = t.readUInt8Enum(or, (n) => {
    throw new _n(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case or.PublicKeyCompressed:
      return to(ke.Compressed, Xu(t));
    case or.PublicKeyUncompressed:
      return to(ke.Uncompressed, gk(Xu(t).data));
    case or.SignatureCompressed:
      return to(ke.Compressed, Zu(t));
    case or.SignatureUncompressed:
      return to(ke.Uncompressed, Zu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function dd(t) {
  return xe(t.data);
}
function $k(t) {
  const e = [];
  switch (t.contents.type) {
    case yt.PublicKey:
      e.push(t.pubKeyEncoding === ke.Compressed ? or.PublicKeyCompressed : or.PublicKeyUncompressed), e.push(Nc(pk(t.contents.data)));
      break;
    case yt.MessageSignature:
      e.push(t.pubKeyEncoding === ke.Compressed ? or.SignatureCompressed : or.SignatureUncompressed), e.push(dd(t.contents));
      break;
  }
  return Ue(e);
}
function Or(t) {
  switch (t.type) {
    case yt.Address:
      return xa(t);
    case yt.Principal:
      return Pw(t);
    case yt.LengthPrefixedString:
      return xo(t);
    case yt.MemoString:
      return Tk(t);
    case yt.AssetInfo:
      return Uw(t);
    case yt.PostCondition:
      return Bk(t);
    case yt.PublicKey:
      return Nc(t);
    case yt.LengthPrefixedList:
      return gd(t);
    case yt.Payload:
      return Nw(t);
    case yt.TransactionAuthField:
      return $k(t);
    case yt.MessageSignature:
      return dd(t);
  }
}
function Ik() {
  return {
    type: yt.Address,
    version: Mc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function hd(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ie.SerializeP2WPKH || e === ie.SerializeP2WSH || e === ie.SerializeP2WSHNonSequential) && !r.every(Lo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ie.SerializeP2PKH:
      return Vo(t, Yk(r[0].data));
    case ie.SerializeP2WPKH:
      return Vo(t, Xk(r[0].data));
    case ie.SerializeP2SH:
    case ie.SerializeP2SHNonSequential:
      return Vo(t, Wk(n, r.map(Nc)));
    case ie.SerializeP2WSH:
    case ie.SerializeP2WSHNonSequential:
      return Vo(t, Zk(n, r.map(Nc)));
  }
}
function xa(t) {
  const e = [];
  return e.push(xe(ma(t.version, 1))), e.push(xe(t.hash160)), Ue(e);
}
function mo(t) {
  const e = fl(Ht(t.readBytes(1))), n = Ht(t.readBytes(20));
  return { type: yt.Address, version: e, hash160: n };
}
function Pw(t) {
  const e = [];
  return e.push(t.prefix), e.push(xa(t.address)), t.prefix === ca.Contract && e.push(xo(t.contractName)), Ue(e);
}
function Lk(t) {
  const e = t.readUInt8Enum(ca, (s) => {
    throw new _n(`Unexpected Principal payload type: ${s}`);
  }), n = mo(t);
  if (e === ca.Standard)
    return { type: yt.Principal, prefix: e, address: n };
  const r = Xn(t);
  return {
    type: yt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function xo(t) {
  const e = [], n = Io(t.content), r = n.byteLength;
  return e.push(xe(ma(r, t.lengthPrefixBytes))), e.push(n), Ue(e);
}
function Xn(t, e, n) {
  e = e || 1;
  const r = fl(Ht(t.readBytes(e))), s = id(t.readBytes(r));
  return Ei(s, e, n ?? 128);
}
function Ck(t) {
  return Ei(t, 4, 1e5);
}
function U0(t) {
  if (t && Fw(t, Tc))
    throw new Error(`Memo exceeds maximum length of ${Tc} bytes`);
  return { type: yt.MemoString, content: t };
}
function Tk(t) {
  const e = [], n = Io(t.content), r = qk(Ht(n), Tc * 2);
  return e.push(xe(r)), Ue(e);
}
function _w(t) {
  let e = id(t.readBytes(Tc));
  return e = e.replace(/\u0000*$/, ""), { type: yt.MemoString, content: e };
}
function Uw(t) {
  const e = [];
  return e.push(xa(t.address)), e.push(xo(t.contractName)), e.push(xo(t.assetName)), Ue(e);
}
function Qu(t) {
  return {
    type: yt.AssetInfo,
    address: mo(t),
    contractName: Xn(t),
    assetName: Xn(t)
  };
}
function pd(t, e) {
  return {
    type: yt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function gd(t) {
  const e = t.values, n = [];
  n.push(xe(ma(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Or(r));
  return Ue(n);
}
function Hw(t, e, n) {
  const r = fl(Ht(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case yt.Address:
        s.push(mo(t));
        break;
      case yt.LengthPrefixedString:
        s.push(Xn(t));
        break;
      case yt.MemoString:
        s.push(_w(t));
        break;
      case yt.AssetInfo:
        s.push(Qu(t));
        break;
      case yt.PostCondition:
        s.push(Mk(t));
        break;
      case yt.PublicKey:
        s.push(Xu(t));
        break;
      case yt.TransactionAuthField:
        s.push(kk(t));
        break;
    }
  return pd(s, n);
}
function Bk(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Pw(t.principal)), (t.conditionType === An.Fungible || t.conditionType === An.NonFungible) && e.push(Uw(t.assetInfo)), t.conditionType === An.NonFungible && e.push(Ne(t.assetName)), e.push(t.conditionCode), t.conditionType === An.STX || t.conditionType === An.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Qs("The post-condition amount may not be larger than 8 bytes");
    e.push(Hs(t.amount, !1, 8));
  }
  return Ue(e);
}
function Mk(t) {
  const e = t.readUInt8Enum(An, (o) => {
    throw new _n(`Could not read ${o} as PostConditionType`);
  }), n = Lk(t);
  let r, s, i;
  switch (e) {
    case An.STX:
      return r = t.readUInt8Enum(aa, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ht(t.readBytes(8))}`), {
        type: yt.PostCondition,
        conditionType: An.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case An.Fungible:
      return s = Qu(t), r = t.readUInt8Enum(aa, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ht(t.readBytes(8))}`), {
        type: yt.PostCondition,
        conditionType: An.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case An.NonFungible:
      s = Qu(t);
      const o = Wn(t);
      return r = t.readUInt8Enum(Vu, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: yt.PostCondition,
        conditionType: An.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Tr(t, e) {
  return Ue([t, e]);
}
function Nk(t) {
  return new Uint8Array([t.type]);
}
function Pk(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : Tr(t.type, Ne(t.value));
}
function _k(t) {
  const e = new Uint8Array(4);
  return Si(e, t.buffer.length, 0), Tr(t.type, dl(e, t.buffer));
}
function Uk(t) {
  const e = sd(zv(t.value, BigInt(s8)), yw);
  return Tr(t.type, e);
}
function Hk(t) {
  const e = sd(t.value, yw);
  return Tr(t.type, e);
}
function Ok(t) {
  return Tr(t.type, xa(t.address));
}
function Dk(t) {
  return Tr(t.type, dl(xa(t.address), xo(t.contractName)));
}
function Fk(t) {
  return Tr(t.type, Ne(t.value));
}
function jk(t) {
  const e = [], n = new Uint8Array(4);
  Si(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ne(r);
    e.push(s);
  }
  return Tr(t.type, Ue(e));
}
function Rk(t) {
  const e = [], n = new Uint8Array(4);
  Si(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = Ei(s);
    e.push(xo(i));
    const o = Ne(t.data[s]);
    e.push(o);
  }
  return Tr(t.type, Ue(e));
}
function Ow(t, e) {
  const n = [], r = e == "ascii" ? pw(t.data) : Io(t.data), s = new Uint8Array(4);
  return Si(s, r.length, 0), n.push(s), n.push(r), Tr(t.type, Ue(n));
}
function zk(t) {
  return Ow(t, "ascii");
}
function Gk(t) {
  return Ow(t, "utf8");
}
function Ne(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return Nk(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return Pk(t);
    case J.Buffer:
      return _k(t);
    case J.UInt:
      return Hk(t);
    case J.Int:
      return Uk(t);
    case J.PrincipalStandard:
      return Ok(t);
    case J.PrincipalContract:
      return Dk(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return Fk(t);
    case J.List:
      return jk(t);
    case J.Tuple:
      return Rk(t);
    case J.StringASCII:
      return zk(t);
    case J.StringUTF8:
      return Gk(t);
    default:
      throw new Qs("Unable to serialize. Invalid Clarity Value.");
  }
}
function Kk(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const H0 = /* @__PURE__ */ new Map();
function Dw(t, e) {
  const n = H0.get(t);
  if (n !== void 0)
    return n(e);
  const r = Kk(t);
  return H0.set(t, r), Dw(t, e);
}
class Zo {
  constructor(e) {
    this.consumed = 0, this.source = e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return e8(this.readBytes(4), 0);
  }
  readUInt8() {
    return Jv(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Zv(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Ht(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Ht(n);
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
    if (Dw(e, r))
      return r;
    throw n(r);
  }
}
function Wn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Zo(xe(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Zo(t) : e = t;
  switch (e.readUInt8Enum(J, (r) => {
    throw new _n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case J.Int:
      return ok(e.readBytes(16));
    case J.UInt:
      return kr(e.readBytes(16));
    case J.Buffer:
      const r = e.readUInt32BE();
      return Lw(e.readBytes(r));
    case J.BoolTrue:
      return $w();
    case J.BoolFalse:
      return Iw();
    case J.PrincipalStandard:
      const s = mo(e);
      return nk(s);
    case J.PrincipalContract:
      const i = mo(e), o = Xn(e);
      return kw(i, o);
    case J.ResponseOk:
      return ck(Wn(e));
    case J.ResponseErr:
      return ak(Wn(e));
    case J.OptionalNone:
      return Cw();
    case J.OptionalSome:
      return Tw(Wn(e));
    case J.List:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Wn(e));
      return lk(c);
    case J.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Xn(e).content;
        if (T === void 0)
          throw new _n('"content" is undefined');
        h[T] = Wn(e);
      }
      return Ai(h);
    case J.StringASCII:
      const l = e.readUInt32BE(), y = qv(e.readBytes(l));
      return We(y);
    case J.StringUTF8:
      const g = e.readUInt32BE(), x = id(e.readBytes(g));
      return uk(x);
    default:
      throw new _n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const Vk = (t) => t.length % 2 == 0 ? t : `0${t}`, qk = (t, e) => t.padEnd(e, "0"), Fw = (t, e) => t ? Io(t).length > e : !1;
function Ju(t) {
  return iy(t);
}
const la = (t) => E8(ud(t)), yd = (t) => Ht(J8(t)), Yk = (t) => Ht(la(t)), Xk = (t) => {
  const e = la(t), n = dl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = la(n);
  return Ht(r);
}, Wk = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = la(r);
  return Ht(s);
}, Zk = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Ue(n), s = ud(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Ue(i), a = la(o);
  return Ht(a);
};
function Qk(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function jw(t) {
  const e = Ne(t);
  return `0x${Ht(e)}`;
}
function Jk(t) {
  return Wn(t);
}
const no = (t) => {
  try {
    return Ti.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function wd() {
  return {
    type: yt.MessageSignature,
    data: Ht(new Uint8Array(hl))
  };
}
function Rw(t, e, n, r) {
  const s = hd(0, t, 1, [bo(e)]).hash160, i = Lo(bo(e)) ? ke.Compressed : ke.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: wn(n, !1),
    fee: wn(r, !1),
    keyEncoding: i,
    signature: wd()
  };
}
function ua(t) {
  return "signature" in t;
}
function O0(t) {
  return t === ie.SerializeP2SH || t === ie.SerializeP2WSH;
}
function t6(t) {
  return t === ie.SerializeP2SHNonSequential || t === ie.SerializeP2WSHNonSequential;
}
function D0(t) {
  const e = Ju(t);
  return e.nonce = 0, e.fee = 0, ua(e) ? e.signature = wd() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function e6(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    Hs(t.nonce, !1, 8),
    Hs(t.fee, !1, 8),
    t.keyEncoding,
    dd(t.signature)
  ];
  return Ue(e);
}
function n6(t) {
  const e = [
    t.hashMode,
    xe(t.signer),
    Hs(t.nonce, !1, 8),
    Hs(t.fee, !1, 8)
  ], n = pd(t.fields);
  e.push(gd(n));
  const r = new Uint8Array(2);
  return Qv(r, t.signaturesRequired, 0), e.push(r), Ue(e);
}
function r6(t, e) {
  const n = Ht(e.readBytes(20)), r = BigInt(`0x${Ht(e.readBytes(8))}`), s = BigInt(`0x${Ht(e.readBytes(8))}`), i = e.readUInt8Enum(ke, (a) => {
    throw new _n(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ie.SerializeP2WPKH && i != ke.Compressed)
    throw new _n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = Zu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function s6(t, e) {
  const n = Ht(e.readBytes(20)), r = BigInt("0x" + Ht(e.readBytes(8))), s = BigInt("0x" + Ht(e.readBytes(8))), i = Hw(e, yt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case yt.PublicKey:
        Lo(u.contents) || (o = !0);
        break;
      case yt.MessageSignature:
        if (u.pubKeyEncoding === ke.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new si("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ie.SerializeP2WSH || t === ie.SerializeP2WSHNonSequential))
    throw new si("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function Fl(t) {
  return ua(t) ? e6(t) : n6(t);
}
function jl(t) {
  const e = t.readUInt8Enum(ie, (n) => {
    throw new _n(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ie.SerializeP2PKH || e === ie.SerializeP2WPKH ? r6(e, t) : s6(e, t);
}
function zw(t, e, n, r) {
  const i = t + Ht(new Uint8Array([e])) + Ht(Hs(n, !1, 8)) + Ht(Hs(r, !1, 8));
  if (xe(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return yd(xe(i));
}
function Gw(t, e, n) {
  const r = 33 + hl, s = Lo(e) ? ke.Compressed : ke.Uncompressed, i = t + Vk(s.toString(16)) + n.data, o = xe(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return yd(o);
}
function i6(t, e, n, r, s) {
  const i = zw(t, e, n, r), o = wk(s, i), a = bk(s), c = Gw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Kw(t, e, n, r, s, i) {
  const o = zw(t, e, n, r), a = bo(fk(o, i, s)), c = Gw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function o6() {
  const t = Rw(ie.SerializeP2PKH, "", 0, 0);
  return t.signer = Ik().hash160, t.keyEncoding = ke.Compressed, t.signature = wd(), t;
}
function F0(t, e, n) {
  return ua(t) ? a6(t, e, n) : c6(t, e, n);
}
function a6(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Kw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = hd(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new si(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function c6(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case yt.PublicKey:
        Lo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case yt.MessageSignature:
        c.pubKeyEncoding === ke.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Kw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (O0(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new si("Too many signatures");
        break;
    }
  if (O0(t.hashMode) && o !== t.signaturesRequired || t6(t.hashMode) && o < t.signaturesRequired)
    throw new si("Incorrect number of signatures");
  if (i && (t.hashMode === ie.SerializeP2WSH || t.hashMode === ie.SerializeP2WSHNonSequential))
    throw new si("Uncompressed keys are not allowed in this hash mode");
  const a = hd(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new si(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Vw(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function qw(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Rw(ie.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function j0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return Vw(D0(t.spendingCondition));
      case Ce.Sponsored:
        return qw(D0(t.spendingCondition), o6());
      default:
        throw new Pc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function l6(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return F0(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return F0(t.spendingCondition, e, Ce.Standard);
    default:
      throw new Pc("Invalid origin auth type");
  }
}
function u6(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: wn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: wn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function f6(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: wn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function d6(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: wn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function h6(t, e) {
  const n = {
    ...e,
    nonce: wn(e.nonce, !1),
    fee: wn(e.fee, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function p6(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(Fl(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(Fl(t.spendingCondition)), e.push(Fl(t.sponsorSpendingCondition));
      break;
  }
  return Ue(e);
}
function g6(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new _n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = jl(t), Vw(n);
    case Ce.Sponsored:
      n = jl(t);
      const r = jl(t);
      return qw(n, r);
  }
}
class y6 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: wn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? n8, this.postConditionMode = i ?? wo.Deny, this.postConditions = s ?? pd([]), o)
      this.anchorMode = a8(o);
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
    const e = Ju(this);
    return e.auth = j0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ju(this);
    return e.auth = j0(e.auth), e.txid();
  }
  verifyOrigin() {
    return l6(this.auth, this.verifyBegin());
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
    const n = this.auth.spendingCondition;
    if (n && !ua(n)) {
      const r = Lo(e);
      n.fields.push(to(r ? ke.Compressed : ke.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = i6(n, r, e.fee, e.nonce, s);
    return ua(e) ? e.signature = i : e.fields.push(to(s.data.byteLength === gw ? ke.Compressed : ke.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return yd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = h6(this.auth, e);
  }
  setFee(e) {
    this.auth = u6(this.auth, e);
  }
  setNonce(e) {
    this.auth = f6(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d6(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Qs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Qs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Qs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Qs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Qs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Si(n, this.chainId, 0), e.push(n), e.push(p6(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(gd(this.postConditions)), e.push(Nw(this.payload)), Ue(e);
  }
}
function _c(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Zo(xe(t.slice(2))) : e = new Zo(xe(t)) : t instanceof Uint8Array ? e = new Zo(t) : e = t;
  const n = e.readUInt8Enum(Bc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = g6(e), i = e.readUInt8Enum(En, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(wo, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Hw(e, yt.PostCondition), c = vk(e);
  return new y6(n, s, c, a, o, i, r);
}
const w6 = sk, Qo = kr, b6 = Lw;
const m6 = /* @__PURE__ */ new Set([4001, -31001]), x6 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], S6 = ["result", "data", "payload", "response", "params"], R0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], yl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Pi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Vr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, E6 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Yw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => E6(i, r)) === s
  );
}, Xw = (t) => t ? Yw(Pi()).some(
  (e) => {
    var n;
    return e.id === t && (yl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Ww = () => {
  if (typeof window > "u")
    return;
  const t = Pi(), e = Yw(t).filter(
    (n) => {
      var r;
      return yl(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Vr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of x6) {
    const r = Vr(t, n) ?? (t === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, A6 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Pi(), n = Vr(e, t) ?? (e === window ? void 0 : Vr(window, t)) ?? nl(t);
  if (n)
    return n;
  if (yl(t) || Xw(t))
    return Ww();
}, Wa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, v6 = ["blockstack-session", "blockstack"], k6 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of v6) {
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
k6();
const Zw = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Pn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, $6 = (t) => {
  const e = Pn(t);
  if (!e)
    return null;
  const n = Zw(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, I6 = (t) => {
  const e = Pn(t);
  if (!e)
    return null;
  const n = Zw(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, tf = (t, e = "mainnet") => {
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
      return tf(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return tf(r, e);
  }
  return e;
}, ai = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, fa = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return no(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = fa(s, e + 1);
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
    const i = fa(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && no(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && no(n.testnet) ? n.testnet.trim() : null;
}, z0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Qw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && m6.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, vi = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Pn(n == null ? void 0 : n.message) ?? Pn(e.message) ?? Pn(e.error) ?? Pn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, So = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw vi(e);
    if (e.status === "error")
      throw vi(e.result ?? e);
  }
  return t;
}, G0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return So(r);
  } catch (r) {
    throw vi(r);
  }
}, Jw = () => Ww(), bd = () => {
  if (typeof window > "u")
    return;
  const t = Pi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Vr(t, e) ?? (t === window ? void 0 : Vr(window, e));
    if (n)
      return n;
  }
}, K0 = () => {
  if (typeof window > "u")
    return;
  const t = bd();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Pi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Vr(e, n) ?? (e === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, lc = (t) => {
  var r, s;
  const e = pi();
  if (yl(e) || Xw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Pi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Jw();
}, Rl = (t) => {
  const e = I6(t);
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
  const n = Rl(t), r = $6(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Pn(t) ?? void 0 : void 0
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
  for (const a of R0)
    if (Rl(s[a])) {
      i = Pn(s[a]);
      break;
    }
  const o = Pn(s.txId) || Pn(s.txid) || Pn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Pn(s.txRaw) ?? void 0
    };
  for (const a of R0) {
    const c = Rl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Pn(s[a]) ?? void 0
      };
  }
  for (const a of S6) {
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
}, zl = (t) => {
  const e = Uc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, L6 = (t) => {
  const e = Uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, C6 = (t) => ({
  ...t,
  fee: ai(t.fee),
  nonce: ai(t.nonce),
  sponsored: t.sponsored === !0
}), V0 = (t) => ({
  recipient: t.recipient,
  amount: ai(t.amount) ?? "0",
  memo: t.memo,
  network: tf(t.network),
  address: t.stxAddress,
  fee: ai(t.fee),
  nonce: ai(t.nonce),
  sponsored: t.sponsored ?? !1
}), tb = "WALLET_ADDRESS_MISMATCH", T6 = 45e3;
let Jo = null;
const ef = (t) => {
  t && (Jo = { address: t, at: Date.now() });
}, B6 = () => {
  Jo = null;
}, M6 = () => Jo && Date.now() - Jo.at <= T6 ? Jo.address : null, N6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, P6 = async (t) => {
  B6();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = So(await t.request("wallet_connect")), n = fa(e);
  return ef(n), n;
}, _6 = async (t, e, n, r) => {
  try {
    return So(await t.request(e, n));
  } catch (s) {
    const i = vi(s);
    if (!N6(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await P6(t);
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
        { code: o ? tb : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return So(await t.request(e, n));
    } catch (a) {
      throw vi(a);
    }
  }
};
let q0 = 3e4;
const U6 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${q0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, q0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, H6 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: tb }
      );
    return c;
  }, s = M6();
  if (s)
    return Wa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Wa(n, "account-read");
  try {
    const c = So(
      await U6(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = fa(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Qw(c))
      throw vi(c);
    Wa(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return ef(i), r(i, "wallet_getAccount");
  let o;
  Wa(n, "account-reconnect");
  try {
    o = So(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), vi(c);
  }
  const a = fa(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return ef(a), r(a, "wallet_connect");
}, O6 = async (t, e) => {
  if (!lc(t)) {
    const i = await G0(
      t,
      "stx_transferStx",
      V0(e)
    );
    return zl(i);
  }
  const n = bd();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await G0(
      n,
      "stx_transferStx",
      V0(e)
    );
    return zl(i);
  }
  const r = Jw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await H6(r, e.stxAddress);
  const s = await _6(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: ai(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: ai(e.fee) } : {}
    },
    e.stxAddress
  );
  return zl(s);
}, D6 = () => pi(), eb = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = pi(), e = t ? A6(t) : void 0;
  if (e)
    return e;
  const n = Pi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Y0 = (t, e) => {
  const n = eb(), r = C6({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, L6(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Va(r, e);
  if (lc(n) && !bd()) {
    const s = K0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: pi(),
        route: "legacy-transaction-request"
      }), Va(r, s);
  }
  return void O6(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (z0(s) && lc(n)) {
      const a = K0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: pi(),
          route: "legacy-transaction-request"
        }), Va(r, a);
        return;
      }
    }
    if (z0(s) && !lc(n)) {
      Va(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Qw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, F6 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), X0 = (t) => jw(t).replace(/^0x/, ""), W0 = "This wallet cannot sign messages. Try Xverse or Leather.", Z0 = (t) => typeof (t == null ? void 0 : t.request) == "function", Q0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", j6 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, R6 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function z6(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: X0(e.message),
    domain: X0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function G6(t, e) {
  const n = await Uv({
    domain: e.domain,
    message: e.message,
    network: ul(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? F6()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function J0(t) {
  var s, i;
  const e = D6() || "", n = /xverse/i.test(e);
  let r = eb();
  if (n && !Q0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Q0(r))
    try {
      return await G6(r, t);
    } catch (o) {
      if (n || !Z0(r) || !R6(o)) throw o;
    }
  if (!n && Z0(r))
    try {
      return await z6(r, t);
    } catch (o) {
      throw j6(o) ? new Error(W0) : o;
    }
  throw new Error(W0);
}
const tp = 1000000n, Bs = 1000000n, Hc = 50n, Pe = 3000n, ur = 300n, Fo = 3000n, K6 = 50000n, Gl = 200n, wl = 15000n, an = (t) => t + Hc;
function sr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / tp}.${(n % tp).toString().padStart(6, "0")}`;
}
function ep(t, e = ur) {
  return t <= Pe ? 0 : Number((t - Pe) / an(e));
}
function Kl(t, e = 0n) {
  const n = Bs - t - e;
  return n > 0n ? n : 0n;
}
function V6(t, e = ur) {
  return t > Bs ? "over" : t < Pe + an(e) ? "empty" : t < K6 ? "low" : "ok";
}
const q6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", Y6 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", X6 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function W6(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || X6.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== q6 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const nb = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Vl = 3, Z6 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [nf, rb] = nb.split("."), Vn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function rf(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function Q6(t) {
  return Vn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function _s(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function sb(t, e = []) {
  const n = await _s(`/v2/contracts/call-read/${nf}/${rb}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: nf, arguments: e.map((r) => "0x" + Vn(Ne(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return Sr(Wn(n.result));
}
async function J6() {
  const t = await _s(`/v2/contracts/source/${nf}/${rb}?proof=0`);
  if (typeof t.source != "string" || await Q6(t.source) !== Y6) throw Error("Deployed source does not match the tested helper.");
  if (W6(await sb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function ib(t) {
  return t.startsWith("SP") && no(t) && !t.includes(".");
}
async function t5(t) {
  var r;
  if (!ib(t)) throw Error("Invalid mainnet wallet address.");
  const e = await _s(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await _s(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function e5(t) {
  const e = await _s(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function n5(t, e) {
  var s, i;
  const n = await sb("get-owner", [Qo(t), Qo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !ib(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function r5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: rf(t), signal: AbortSignal.timeout(15e3) });
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
async function s5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function i5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = _c(rf(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ji(Vo(Mc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ji(r.contractAddress) + "." + r.contractName.content !== nb || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Vn(Ne(r.functionArgs[0])) !== Vn(Ne(Qo(t.core))) || Vn(Ne(r.functionArgs[1])) !== Vn(Ne(Qo(t.song))) || Vn(Ne(r.functionArgs[2])) !== Vn(Ne(b6(rf(t.id)))) || t.amount !== "50" || e.postConditionMode !== wo.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== aa.Equal || i.principal.prefix !== 2 || Ji(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ji(r.contractAddress) + "." + r.contractName.content !== Z6 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Vn(Ne(r.functionArgs[0])) !== Vn(Ne(Qo(t.song))) || typeof t.liked != "boolean" || Vn(Ne(r.functionArgs[1])) !== Vn(Ne(w6(t.liked))) || t.amount !== "0" || e.postConditionMode !== wo.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || Sr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const o5 = "xtrata.xyz/radio/listening-wallet", a5 = "Link a temporary listening wallet for pay-per-play; no spending permission", zr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && no(t), c5 = (t) => ({
  domain: Ai({ name: We(o5), version: We("1"), "chain-id": kr(1) }),
  message: Ai({
    purpose: We(a5),
    main: We(t.main),
    listening: We(t.listening),
    issued: kr(t.issued)
  })
}), ob = 100000n, l5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function u5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !zr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= ob).sort(l5);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const Za = 50;
function Oc(t) {
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
async function f5(t, e, n = 4) {
  if (!zr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Za}&offset=${o}`, s = Oc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Za);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Za ? s : Oc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = u5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Za);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Ur = 50, d5 = 6, h5 = 20, np = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function rp(t, e) {
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
async function p5(t, e, n) {
  if (!zr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Oc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Ur}&offset=0`));
    if (!s || s.total > d5 * Ur) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Ur; o < s.total; o += Ur) {
      const a = Oc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Ur}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Ur}&offset=${u}`, a = rp(await e(o(0)), t);
      if (!a || a.total > h5 * Ur) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Ur; u < a.total; u += Ur) {
        const h = rp(await e(o(u)), t);
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
function g5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(np).map((l, y) => {
    const g = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: g, kind: "gift", to: r.payer, at: y } : zr(l.sender) && g >= ob ? { sender: l.sender, left: g, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: g, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && zr(l.recipient) && l.amount > 0n).sort(np), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, y) => {
    let g = y;
    for (const x of l) {
      if (g <= 0n) break;
      const v = x.left < g ? x.left : g;
      x.left -= v, g -= v;
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
function y5(t, e) {
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
function sp(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const uc = [100, 250, 500], w5 = (t, e) => BigInt(t) * an(e), jo = ["prepared", "signed", "unknown", "pending"], b5 = 30 * 6e4, Dc = 6e4, Ki = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, m5 = 3e3, Fc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", ql = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function x5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, h = !1, l = !1, y = !1, g = null, x = !1, v = "", T = "", U = 0, D, k = null, C, P = [], Y, ot = -1 / 0;
  const X = /* @__PURE__ */ new Set();
  let W = null, $ = !1, _ = 0, m = null, B = null, K = !1, N = null, at = !1, Z = null, Et = !1, L = !1, O = !1, ft = !1, dt = !1, ht = 0, St = null, oe = Promise.resolve();
  const At = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? ur.toString()), Ot = (p) => !!i && !(i.features ?? []).includes(p), kt = (p, A) => `xtrata.ppp.v1.${p}:${A}`, Be = "xtrata.ppp.v1.as-main", $t = () => {
    if (t.main()) return;
    const p = t.store.get(Be);
    return p && zr(p) ? p : void 0;
  }, Nt = () => t.main() ?? $t(), ln = (p = i == null ? void 0 : i.address) => {
    if (!p) return [];
    try {
      const A = JSON.parse(t.store.get(kt("entries", p)) || "[]");
      return Array.isArray(A) ? A : [];
    } catch {
      return [];
    }
  }, ae = (p) => {
    const A = [p, ...ln(p.address).filter((H) => !(H.txid === p.txid && H.kind === p.kind))].slice(0, 200);
    t.store.set(kt("entries", p.address), JSON.stringify(A));
  }, Rt = (p = i == null ? void 0 : i.address) => !!p && t.store.get(kt("on", p)) !== "0", kn = (p) => {
    i != null && i.address && t.store.set(kt("on", i.address), p ? "1" : "0");
  }, He = () => ln().filter((p) => jo.includes(p.status)), Qe = () => ye() ? [...He(), ...ln(Se()).filter((p) => jo.includes(p.status))] : He(), Ke = () => Ve(i == null ? void 0 : i.address), Ve = (p) => {
    if (!p) return null;
    try {
      return JSON.parse(t.store.get(kt("deposit", p)) || "null");
    } catch {
      return null;
    }
  }, Oe = (p, A = i == null ? void 0 : i.address) => {
    A && t.store.set(kt("deposit", A), JSON.stringify(p));
  };
  let Qt = null;
  const Je = (p = Dc) => {
    const A = t.now();
    Qt = { since: Qt && A < Qt.until ? Qt.since : A, until: Math.max((Qt == null ? void 0 : Qt.until) ?? 0, A + p) };
  }, Fe = () => !!Qt && t.now() < Qt.until && (o === void 0 || o < Pe + an(At())), $e = () => !!Ke() || Fe(), Se = () => Ot("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), ye = () => !!(i != null && i.address) && Se() !== i.address, bn = () => ye() ? c && c.for === Se() ? c.value : void 0 : o, Zn = (p) => p !== void 0 && p < Pe + Gl, I = () => He().filter((p) => t.now() - p.created > b5 && X.has(p.txid)), z = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Nt() || r === Nt() && !e.allowed), F = () => z() && !(i != null && i.linked), S = () => {
    const p = Nt();
    return !F() && !!p && !!(i != null && i.linked) && i.linked !== p;
  }, tt = (p) => kt("return-to", p), gt = (p = i == null ? void 0 : i.address) => {
    if (!p) return;
    const A = t.store.get(tt(p));
    return A && zr(A) && A !== p ? A : void 0;
  }, Jt = (p = i == null ? void 0 : i.address) => W && W.for === p ? W.res : null;
  function ce() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const p = gt();
    if (p) return { to: p, kind: "chosen" };
    const A = Jt();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const Dt = (p) => kt("gift", p);
  function qt() {
    const p = i == null ? void 0 : i.address;
    if (!p) return null;
    if ((N == null ? void 0 : N.for) === p) return N.info;
    try {
      const A = JSON.parse(t.store.get(Dt(p)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  async function Yt() {
    var pt;
    const p = i == null ? void 0 : i.address;
    if (!p || !t.giftInfo || !((pt = e == null ? void 0 : e.gifts) != null && pt.enabled) || at) return;
    const A = (N == null ? void 0 : N.for) === p ? N : null, H = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && t.now() - A.at < H) return;
    at = !0;
    const V = qt();
    try {
      const R = await t.giftInfo(p);
      N = { for: p, info: R, ok: !0, at: t.now() }, t.store.set(Dt(p), JSON.stringify(R));
    } catch {
      N = { for: p, info: V, ok: !1, at: t.now() };
    } finally {
      at = !1;
    }
  }
  const Ee = () => ln().reduce((p, A) => jo.includes(A.status) ? p + BigInt(A.amount || "0") + BigInt(A.fee || "0") : p, 0n);
  function Gt() {
    if (o === void 0) return 0;
    const p = o - Ee() - BigInt(ge.length) * an(At());
    return p > 0n ? ep(p, At()) : 0;
  }
  const st = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Xt = "EMPTY — ADD STX TO PLAY";
  function le() {
    if (!(e != null && e.here)) return null;
    const p = (A, H) => ({ reason: A, text: H });
    switch ($n()) {
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
        return $e() ? p("arriving", "YOUR PLAYS ARE ARRIVING") : p("out", ye() ? st : Xt);
      case "ready":
        return !Rt() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? p("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : O ? Gt() < 1 ? p("out", ye() ? st : Xt) : null : p("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const De = () => {
    var p;
    return !!(i != null && i.address) && ye() && !!((p = qt()) != null && p.player);
  };
  function pe() {
    return De() ? { locked: !0, known: !0 } : null;
  }
  const tn = 3 * 6e4, un = () => !!qt() && !!t.history && !(i != null && i.linked);
  async function Qn() {
    const p = i.address, A = qt(), { balance: H, nonce: V } = await t.chain.account(p), pt = await t.history(p, !0);
    if (!pt.ok) return null;
    const R = g5({ self: p, balance: H, inbound: pt.inbound, outgoing: pt.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!R.ok) return null;
    const et = y5(R.parts, Fo);
    return { balance: H, nonce: V, parts: R.parts, steps: et.steps, tooSmall: et.tooSmall.length };
  }
  const Dn = () => Et ? { state: "unavailable" } : !Z || t.now() - Z.at > tn || o !== void 0 && o !== Z.balance ? { state: "none" } : Z.plan;
  function $n() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const p = Nt();
    if (!F()) {
      if (!p) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : S() ? "wrong-wallet" : i.state === "known" ? "locked" : !F() && i.linked !== p ? "link" : o === void 0 ? "loading" : o > Bs ? "over" : o < Pe + an(At()) ? "fund" : "ready" : "loading";
  }
  const Co = () => {
    var p, A, H, V, pt;
    return {
      step: $n(),
      busy: u,
      message: v,
      error: T,
      notice: In(),
      gate: e,
      main: Nt(),
      mainConnected: !!t.main(),
      standIn: $t(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      unproven: !!(i != null && i.unproven),
      balance: o,
      balanceState: o === void 0 ? void 0 : V6(o, At()),
      playsLeft: o === void 0 ? 0 : ep(o, At()),
      allowance: o === void 0 ? Bs : Kl(o, BigInt(((p = Ke()) == null ? void 0 : p.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: Rt(),
      entries: ln(),
      depositTxid: ((A = Ke()) == null ? void 0 : A.txid) ?? D,
      depositPending: $e(),
      arrival: $e() ? { since: ((H = Ke()) == null ? void 0 : H.at) ?? (Qt == null ? void 0 : Qt.since) ?? t.now(), graceMs: Dc } : null,
      walletOutdated: Ot("like"),
      linkedListening: Y && Y === Nt() ? P.map((R) => R.listening) : [],
      serverLinked: !!k && C === `${Nt()}:${i == null ? void 0 : i.address}`,
      stuck: I().length,
      armed: ft,
      queued: ge.length,
      solo: F(),
      returnTo: (V = ce()) == null ? void 0 : V.to,
      returnToKind: (pt = ce()) == null ? void 0 : pt.kind,
      funderState: (() => {
        const R = Jt();
        return R ? R.ok ? R.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const R = Jt();
        return !!R && R.ok && R.distinct > 1;
      })(),
      walletCannotSolo: F() && Ot("standalone"),
      walletCannotMulti: Ot("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((R) => R !== Nt() && R !== (i == null ? void 0 : i.linked)),
      creditedTo: F() && (i != null && i.address) && (m == null ? void 0 : m.for) === i.address && m.main ? m.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(kt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (B == null ? void 0 : B.for) === i.address && B.unused,
      gift: (() => {
        const R = qt();
        return R ? { player: R.player, from: R.from, source: R.source, amount: R.amount } : null;
      })(),
      giftPlays: qt() ? Gt() : 0,
      playCost: an(At()),
      giftStop: le(),
      albumLock: pe(),
      returnPlan: Dn(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: Ot("slots"),
      likeFunds: (() => {
        var lt;
        const R = Se();
        if (!R || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const et = bn();
        return { address: R, balance: et, low: Zn(et), album: ye(), pending: !!Ve(R), txid: (lt = Ve(R)) == null ? void 0 : lt.txid, main: Nt() };
      })()
    };
  }, In = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Pt = (p, A = "") => {
    v = p, T = A, t.changed();
  };
  async function je(p, A) {
    if (!u) {
      u = p, T = "", t.changed();
      try {
        await A();
      } catch (H) {
        const V = H instanceof Error ? H.message : String(H);
        T = /Cancelled in the listening wallet/.test(V) ? "" : V, T || (v = "Not now. Nothing was signed.", dt = !0);
      } finally {
        u = null, await fn(!0);
      }
    }
  }
  const Re = () => !!(e != null && e.enabled) && e.here && (F() || !!Nt() && e.allowed), Ds = () => Re() && !S(), Wr = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", Fn = () => {
    if (S()) throw new Error(Wr());
  };
  async function Ln() {
    if (!Re()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const mn = (p) => {
    const A = Nt();
    return p.request("listening.status", A ? { main: A } : void 0);
  };
  async function jn(p = !1) {
    i != null && i.address && (!p && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await qe(p)));
  }
  async function qe(p = !1) {
    const A = Se();
    if (!(!ye() || !A || (i == null ? void 0 : i.state) !== "unlocked") && !(!p && (c == null ? void 0 : c.for) === A && t.now() - c.at < 3e4))
      try {
        c = { for: A, value: await t.chain.balance(A), at: t.now() };
      } catch {
      }
  }
  async function Fs(p) {
    if ((Y !== p || t.now() - ot >= 6e4) && (P = await t.links(p), Y = p, ot = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === p) return;
    const A = `${p}:${i.address}`;
    C === A && k || (k = P.find((H) => H.listening === i.address) ?? null, C = A);
  }
  async function To() {
    const p = i == null ? void 0 : i.address;
    if (!F() || !p || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const A = Jt(p);
    if (A != null && A.ok && A.funder) return;
    const H = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, _ - 1), 30 * 6e4);
    if (!(W && W.for === p && t.now() - W.at < H)) {
      $ = !0;
      try {
        W = { for: p, res: await t.funder(p), at: t.now() };
      } catch {
        W = { for: p, res: { ok: !1 }, at: t.now() };
      } finally {
        $ = !1;
      }
      _ = W.res.ok ? 0 : _ + 1;
    }
  }
  async function Bo() {
    const p = i == null ? void 0 : i.address;
    if (!(!F() || !p || i != null && i.linked || !t.mainOf || K) && !(m && m.for === p && (m.ok || t.now() - m.at < 6e4))) {
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
  async function Mo() {
    const p = i == null ? void 0 : i.address;
    if (!(!p || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (B == null ? void 0 : B.for) === p) && t.store.get(kt("created", p)) !== "1")
      try {
        B = { for: p, unused: await t.chain.confirmedNonce(p) === 0n };
      } catch {
      }
  }
  async function Rn() {
    var pt;
    const p = i == null ? void 0 : i.address;
    if (!p) return !1;
    let A, H = !1;
    const V = /* @__PURE__ */ new Map();
    for (const R of Qe())
      try {
        const et = await t.chain.transaction(R.txid);
        if (!et) {
          if (X.add(R.txid), t.now() - R.created > 15 * 6e4 && !V.has(R.address) && V.set(R.address, await t.chain.confirmedNonce(R.address)), A = V.get(R.address), A !== void 0 && A > BigInt(R.nonce)) {
            ae({ ...R, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((R.status === "unknown" || R.status === "signed") && R.raw)
            try {
              await t.chain.broadcast(R.raw, R.txid), ae({ ...R, status: "pending" });
            } catch (nt) {
              Ki(nt) && ae({ ...R, status: "failed", note: nt.message, raw: void 0 });
            }
          continue;
        }
        X.delete(R.txid);
        const lt = String(et.tx_status);
        if (lt === "success" && et.canonical !== !1 && et.is_unanchored === !1) {
          if (ae({ ...R, status: "confirmed", confirmedAt: t.now(), actualFee: String(et.fee_rate ?? R.fee), raw: void 0 }), H = !0, R.kind === "like" && (x = !0, R.status !== "confirmed" && typeof R.liked == "boolean"))
            try {
              (pt = t.likeConfirmed) == null || pt.call(t, R.song, R.liked);
            } catch {
            }
        } else lt.startsWith("abort_") || lt.startsWith("dropped_") ? ae({ ...R, status: "failed", note: lt, raw: void 0 }) : R.status !== "pending" && ae({ ...R, status: "pending" });
      } catch {
      }
    for (const R of ye() ? [p, Se()] : [p]) {
      const et = Ve(R);
      if (et)
        try {
          const lt = await t.chain.transaction(et.txid), nt = String((lt == null ? void 0 : lt.tx_status) ?? "");
          (nt === "success" && lt.is_unanchored === !1 || nt.startsWith("abort_") || nt.startsWith("dropped_") || !lt && t.now() - et.at > 2 * 36e5) && (Oe(null, R), nt === "success" && Je(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return H;
  }
  async function fn(p = !1) {
    var A;
    try {
      const H = Nt();
      if ((p || !e || r !== H || t.now() - n > 3e5) && (e = await t.config(H), n = t.now(), r = H), !e.enabled || !e.here || !F() && (!H || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ft && js(), t.changed();
        return;
      }
      await Ln(), i = await mn(s), S() && i.state === "unlocked" && (Pr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await mn(s)), H && e.allowed && await Fs(H), await jn(p), await To(), await Bo(), await Mo(), await Yt(), await Rn() && await jn(!0), await qe(), await Po(), U = 0;
    } catch {
      U++;
    }
    if ($n() === "locked" ? Ui() : ft && js(), x) {
      x = !1;
      try {
        (A = t.likesChanged) == null || A.call(t);
      } catch {
      }
    }
    t.changed(), ge.length && !Nr && f();
  }
  async function No(p) {
    const A = i == null ? void 0 : i.root;
    if (!A || i != null && i.slot || !(i != null && i.address) || Ot("slots")) return;
    const H = Number(t.store.get(kt("slot", A)));
    if (!(!Number.isSafeInteger(H) || H < 1))
      try {
        const { balance: V } = await t.chain.account(i.address);
        if (V >= Pe + an(At())) return;
        await p.request("listening.openSlot", { slot: H }), i = await mn(p), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function _i(p, A) {
    var R;
    Fn();
    const H = !(i != null && i.address) || Rt(i.address), V = i != null && i.linked ? (R = t.nameOf) == null ? void 0 : R.call(t, i.linked) : void 0;
    await p.request("listening.unlock", { mode: "unlock", terms: H ? Zr() : void 0, anyPasskey: A, ...Nt() ? { main: Nt() } : {}, ...V ? { label: V } : {} }), i = await mn(p), H && (Rt(i.address) ? await Br() : await p.request("listening.stop")), await No(p), Pt(H ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const pt = g;
    g = null, pt && t.now() - pt.at < 12e4 && setTimeout(() => void fn(!0).then(() => d(pt)), 0);
  }
  function Ui() {
    ft || u || dt || ht >= 3 || !s || !(i != null && i.address) || (ft = !0, oe = (async () => {
      try {
        await _i(s, !1), ht = 0;
      } catch (p) {
        const A = p instanceof Error ? p.message : String(p);
        /Cancelled in the listening wallet/.test(A) ? St || (dt = !0, Pt("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (ht++, T = A);
      } finally {
        ft = !1;
        const p = St;
        St = null, p ? await p() : await fn(!0);
      }
    })());
  }
  async function js(p) {
    ft && (St = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await oe), p && await p(), t.changed();
  }
  const Zr = () => ({
    fee: At().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Bs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Br() {
    if (!(i != null && i.address)) return !1;
    if (O || (O = await t.tabLock(i.address)), !O)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function fr(p, A) {
    const H = i.address, { balance: V, nonce: pt } = A ?? await t.chain.account(H);
    o = V;
    const R = await s.request("listening.prepareReturn", {
      mode: p.mode,
      balance: V.toString(),
      nonce: pt.toString(),
      fee: Fo.toString(),
      ...p.amount !== void 0 ? { amount: p.amount.toString() } : {},
      ...p.linked ? {} : { destination: p.to }
    });
    if (R.recipient !== p.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const et = p.mode === "amount" ? p.amount : p.mode === "all" ? V - Fo : V - Bs - Fo, lt = _c(R.raw);
    if (Sr(lt.payload.recipient).value !== p.to || String(lt.payload.amount) !== R.amount || et !== void 0 && R.amount !== et.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const nt = {
      id: ql(),
      address: H,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: R.recipient,
      amount: R.amount,
      fee: R.fee,
      nonce: pt.toString(),
      created: t.now(),
      status: "signed",
      raw: R.raw,
      txid: R.txid
    };
    t.validate(nt), ae(nt);
    try {
      await t.chain.broadcast(R.raw, R.txid), ae({ ...nt, status: "pending" });
    } catch (It) {
      throw ae({ ...nt, status: "unknown", note: It.message }), It;
    }
    return R;
  }
  const Qr = wl, dr = Fo;
  async function Rs(p, A, H) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (Ot("slots") || Ot("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const V = i.slot ?? 0;
    if (p === A || ![p, A].includes(V) || ![p, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const pt = i.root ?? i.address, R = p === 0 ? pt : i.address, et = A === 0 ? pt : i.address, { balance: lt, nonce: nt } = await t.chain.account(R);
    if (lt < H + dr + Pe) throw new Error(p === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const It = await s.request("listening.signMove", { from: p, to: A, amount: H.toString(), fee: dr.toString(), nonce: nt.toString(), balance: lt.toString() }), Kt = _c(It.raw);
    if (It.from !== R || It.to !== et || It.amount !== H.toString() || Sr(Kt.payload.recipient).value !== et || String(Kt.payload.amount) !== H.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const fe = {
      id: ql(),
      address: R,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: et,
      amount: It.amount,
      fee: It.fee,
      nonce: nt.toString(),
      created: t.now(),
      status: "signed",
      raw: It.raw,
      txid: It.txid
    };
    t.validate(fe), ae(fe);
    try {
      await t.chain.broadcast(It.raw, It.txid), ae({ ...fe, status: "pending" });
    } catch (de) {
      throw ae({ ...fe, status: "unknown", note: de.message }), de;
    }
    return Oe({ txid: It.txid, amount: It.amount, at: t.now() }, et), et === pt && pt !== i.address ? c = null : a = -1 / 0, It;
  }
  let Mr = !1;
  const Hi = /* @__PURE__ */ new Map(), ue = (p) => kt("float", p);
  async function Po() {
    if (Mr || (i == null ? void 0 : i.state) !== "unlocked" || !ye() || Ot("move") || Ot("rootLike") || !i.address) return;
    const p = i.address;
    if (t.store.get(ue(p)) === "1") return;
    const A = qt();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const H = bn();
    if (H === void 0 || o === void 0) return;
    if (!Zn(H)) {
      t.store.set(ue(p), "1");
      return;
    }
    if (Ve(Se()) || Jr() || Qe().length || o < Qr * 4n + Pe + dr) return;
    const V = Hi.get(p);
    if (!(V && (V.n >= 3 || t.now() - V.at < 5 * 6e4))) {
      Mr = !0, Hi.set(p, { n: ((V == null ? void 0 : V.n) ?? 0) + 1, at: t.now() });
      try {
        await Rs(i.slot ?? 0, 0, Qr), t.store.set(ue(p), "1");
      } catch (pt) {
        console.warn("[radio] likes float not sent yet", pt);
      } finally {
        Mr = !1;
      }
    }
  }
  async function zs(p) {
    if (He().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (Ot("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await Qn().catch(() => null);
    if (!A)
      throw Z = null, Et = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Et = !1, o = A.balance;
    const H = { balance: A.balance, nonce: A.nonce };
    if (p === "excess") {
      const lt = sp(A.parts) ?? gt();
      if (!lt) throw new Error("Choose where to send the excess first.");
      await fr({ mode: "excess", to: lt, linked: !1 }, H), Z = null, Pt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const V = A.steps;
    if (!V.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!Z && Z.balance === A.balance && t.now() - Z.at <= tn && Z.steps.length === V.length && Z.steps.every((lt, nt) => lt.to === V[nt].to && lt.mode === V[nt].mode && lt.send === V[nt].send))) {
      Z = {
        at: t.now(),
        balance: A.balance,
        steps: V,
        parts: A.parts,
        plan: { state: "ready", steps: V.map((lt) => ({ to: lt.to, kind: lt.kind, send: lt.send.toString() })), kept: A.tooSmall, excess: sp(A.parts) }
      }, Pt(V.length > 1 ? `This goes back in ${V.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const R = V[0], et = R.to ?? gt();
    if (!et) throw new Error("Choose where to send the rest first.");
    if (R.mode === "amount" && Ot("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await fr({ mode: R.mode, to: et, linked: !1, ...R.mode === "amount" ? { amount: R.send } : {} }, H), Z = null, V.length === 1 ? (kn(!1), Pt("Returned ✓ Paying is off.")) : Pt(`Returned ✓ ${V.length - 1} more ${V.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  async function en() {
    if (!(i != null && i.unproven)) return;
    const p = await Ln();
    await p.request("listening.prove"), i = await mn(p);
  }
  const Gs = {
    forceRefresh: () => fn(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (p) => {
      if (!t.main() && !(p !== null && !zr(p))) {
        if (p === $t()) return fn(!0);
        t.store.set(Be, p ?? ""), T = "", v = "", o = void 0, a = -1 / 0, c = null, await fn(!0);
      }
    },
    /** `quick`: a free starter player is being claimed, so the wallet box may put off its second passkey check. */
    create: (p) => je("Waiting for your passkey…", async () => {
      const A = await Ln();
      await A.request("listening.unlock", { mode: "create", terms: Zr(), ...t.main() ? { main: t.main() } : {}, ...p != null && p.quick && !t.main() ? { quick: !0 } : {} }), i = await mn(A), i.address && t.store.set(kt("created", i.address), "1"), kn(!0), Pt(F() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Br();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (p) => {
      p ? Je() : Qt = null, t.changed();
    },
    giftSent: (p, A) => {
      !(i != null && i.address) || Ke() || (Oe({ txid: p, amount: A.toString(), at: t.now() }), a = -1 / 0, N = null, Pt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (p) => {
      if (Fn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ot("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Ln()).request("listening.bindSlot", { slot: p, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (p, A, H, V) => {
      Oe({ txid: H, amount: V.toString(), at: t.now() }, A), N = null, await Gs.openAlbum(p), Pt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (p) => je("Opening…", async () => {
      if (Fn(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (Ot("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === p) return;
      Pr(), await s.request("listening.openSlot", { slot: p }), i = await mn(s), o = void 0, a = -1 / 0, Z = null, Et = !1;
      const A = i.root;
      A && p > 0 && t.store.set(kt("slot", A), String(p)), Pt(p === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (p = !1) => {
      const A = () => je("Waiting for your passkey…", async () => _i(await Ln(), p));
      return ft ? p ? Ot("cancel") ? (Pt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : js(async () => {
        ($n() === "locked" || $n() === "intro") && await A();
      }) : oe : A();
    },
    link: () => je("Sign in your wallet…", async () => {
      Fn();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const A = (await t.links(p)).find((H) => H.listening === i.address);
      if (A)
        await s.request("listening.link", { main: p, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const H = { main: p, listening: i.address, issued: t.now() }, V = await t.signWithMain(p, c5(H)), pt = await s.request("listening.link", { main: p, issued: H.issued, mainSignature: V });
        await t.saveLink({ ...H, mainSignature: V, listeningSignature: pt.listeningSignature }), ot = -1 / 0;
      }
      Pt("Linked ✓");
    }),
    /**
     * Before the listener adds anything of their own: a starter player whose passkey was checked once gets its second
     * check now. Resolves true once the wallet is proven (or always was); false if the check failed or was closed.
     */
    prove: async () => i != null && i.unproven ? (await je("One more passkey check…", en), !(i != null && i.unproven)) : !0,
    deposit: () => je("Approve the deposit in your wallet…", async () => {
      Fn(), await en();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ke()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Fe()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await jn(!0);
      const A = Kl(o ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      D = await t.deposit(p, i.address, A), D && Oe({ txid: D, amount: A.toString(), at: t.now() }), Pt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => je("Approve the top-up in your wallet…", async () => {
      Fn(), await en();
      const p = t.main(), A = Se();
      if (!p || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ve(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const H = await t.chain.balance(A);
      ye() ? c = { for: A, value: H, at: t.now() } : (o = H, a = t.now());
      const V = Kl(H);
      if (V <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const pt = await t.deposit(p, A, V);
      pt && Oe({ txid: pt, amount: V.toString(), at: t.now() }, A), Pt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (p) => je("Adding plays…", async () => {
      if (Fn(), !ye()) throw new Error("Open the album you want to add plays to first.");
      if (!uc.includes(p)) throw new Error("Choose one of the amounts offered.");
      const A = w5(p, At());
      if (h || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (Qe().length || Ke()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await Rs(0, i.slot ?? 0, A), Pt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => je("Confirm in the listening wallet…", async () => {
      if (!Ds()) throw new Error("Connect your wallet first.");
      await Br(), await s.request("listening.approveSession", Zr()), kn(!0), Pt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => je("Clearing…", async () => {
      for (const p of I())
        await t.chain.transaction(p.txid) || ae({ ...p, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Pt("Cleared ✓");
    }),
    switchOff: () => je("Switching off…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.stop")), kn(!1), Pt("Music support is off. Playback is paused.");
    }),
    lock: () => je("Locking…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Pt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (p) => {
      const A = String(p ?? "").trim();
      if (!(i != null && i.address)) return Pt("", "Unlock the listening wallet first.");
      if (!zr(A)) return Pt("", "Enter a standard mainnet address (it starts with SP).");
      if (A === i.address) return Pt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(tt(i.address), A), Pt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(tt(i.address), ""), t.changed();
    },
    returnFunds: (p) => je("Check the return in the listening wallet…", async () => {
      if (!Ds()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (un()) return zs(p);
      const A = ce();
      if (!A) throw new Error(F() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && Ot("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (He().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await fr({ mode: p, to: A.to, linked: A.kind === "linked" }), p === "all" && kn(!1), Pt(p === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ge = [], Oi = 10, Di = 30 * 6e4;
  let Nr = !1;
  const Jr = () => h || !!u || l || y, Pr = () => {
    ge.length && (ge.length = 0, t.changed());
  };
  async function Ks(p) {
    if (!ge.some((A) => A.id === p.id) && !ln().some((A) => A.id === p.id) && (ge.push({ ...p, at: t.now() }), ge.length > Oi && ge.shift()), Jr() || He().length) {
      const A = ge.length;
      v = `Queued ${A === 1 ? "this song" : A + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await f();
  }
  async function f() {
    if (!Nr) {
      Nr = !0;
      try {
        for (; ge.length; ) {
          for (; ge.length && t.now() - ge[0].at > Di; ) ge.shift();
          if (!ge.length || Jr() || await b(ge[0]) === "wait") return;
          ge.shift();
        }
      } finally {
        Nr = !1, t.changed();
      }
    }
  }
  async function b(p) {
    var A;
    h = !0;
    try {
      await fn();
      const H = $n();
      if (H === "loading") return "wait";
      if (H !== "ready" || !Rt() || !(i != null && i.session) || i.session.playsLeft < 1 || !O) return "done";
      if (He().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const V = i.address, { balance: pt, nonce: R } = await t.chain.account(V);
      o = pt, a = t.now();
      const et = await t.chain.owner(Vl, p.song);
      if (et === V || et === Nt()) return "done";
      const lt = await s.request("listening.signPlay", {
        core: Vl,
        song: p.song,
        receipt: p.id,
        fee: At().toString(),
        nonce: R.toString(),
        balance: pt.toString()
      }), nt = {
        id: p.id,
        address: V,
        kind: "play",
        core: Vl,
        song: p.song,
        recipient: et,
        amount: "50",
        fee: At().toString(),
        nonce: R.toString(),
        created: t.now(),
        status: "signed",
        raw: lt.raw,
        txid: lt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(nt), ae(nt);
      const It = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`;
      try {
        await t.chain.broadcast(lt.raw, lt.txid), ae({ ...nt, status: "pending" }), v = `♪ Paid ${It}`, T = "";
      } catch (Kt) {
        ae({ ...nt, status: Ki(Kt) ? "failed" : "unknown", note: Kt.message, ...Ki(Kt) ? { raw: void 0 } : {} }), T = Kt.message;
      }
      return i = await mn(s), "done";
    } catch (H) {
      const V = H instanceof Error ? H.message : "payment unavailable";
      return (A = qt()) != null && A.player ? (v = "Payment is taking a moment: " + V, "wait") : (v = "This song played free: " + V, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function E(p) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes($n()) || Ot("like") ? !1 : (d(p), !0);
  }
  async function d(p) {
    const A = p.title ? `“${p.title}”` : `song #${p.song}`, H = (Me) => {
      var zn;
      T = Me, v = "";
      try {
        (zn = t.likeFailed) == null || zn.call(t, p.song);
      } catch {
      }
      t.changed();
    }, V = ye(), pt = $n(), R = Nt(), et = V && (pt === "fund" || pt === "over") ? "ready" : pt, lt = F() ? Se() : R;
    if (et === "locked") {
      g = { ...p, at: t.now() }, Pt(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (et === "wrong-wallet") return H(Wr());
    if (et === "link") return H("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (F() && Ot("standalone")) return H("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (et === "fund") return H("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (et === "over") return H("Return the excess first: the listening wallet holds more than 1 STX.");
    if (V) {
      await qe(!0);
      const Me = bn();
      if (Zn(Me))
        return t.changed(), H(Fc);
    }
    if (et !== "ready" || !lt) return H("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return H("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!O) return H("Pay-per-play is running in another tab. Like from that tab.");
    const nt = ln(Se()).find((Me) => Me.kind === "like" && Me.song === p.song);
    if (nt && jo.includes(nt.status))
      return H(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (l) return H("One like at a time: your last one is still being sent.");
    if ((nt == null ? void 0 : nt.status) === "confirmed" && t.now() - (nt.confirmedAt ?? 0) < m5)
      return H(`Your like for ${A} has only just confirmed. Try again in a moment.`);
    let It;
    y = !0;
    try {
      It = t.likeState ? (await t.likeState(lt, p.song)).by : p.likedBy ?? [];
    } catch {
      It = p.likedBy;
    } finally {
      y = !1;
    }
    if (!It) return H(`Could not check ${A} right now. Try the heart again.`);
    const Kt = Se(), de = ((nt == null ? void 0 : nt.status) === "confirmed" && typeof nt.liked == "boolean" && t.now() - (nt.confirmedAt ?? nt.created) < 5 * 6e4 ? nt.liked : void 0) ?? It.includes(Kt);
    if (!de && It.some((Me) => Me !== Kt)) return H(F() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${It.includes(R) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await G({ song: p.song, liked: !de, title: p.title, artist: p.artist });
  }
  async function G(p) {
    var V, pt, R;
    if (l) {
      Pt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const A = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`, H = t.wait ?? ((et) => new Promise((lt) => setTimeout(lt, et)));
    try {
      Pt(`${p.liked ? "Liking" : "Unliking"} ${A}…`);
      const et = t.now() + 12e4;
      for (; h || (ye() ? ln(Se()).some((de) => jo.includes(de.status)) : He().length); ) {
        if (t.now() > et) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await H(5e3), await fn(!0);
      }
      if (!ye() && $n() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const lt = Se(), { balance: nt, nonce: It } = await t.chain.account(lt);
      if (ye() ? c = { for: lt, value: nt, at: t.now() } : (o = nt, a = t.now()), Zn(nt)) throw new Error(Fc);
      const Kt = await s.request("listening.signLike", {
        song: p.song,
        liked: p.liked,
        fee: Gl.toString(),
        nonce: It.toString(),
        balance: nt.toString()
      }), fe = {
        id: ql(),
        address: lt,
        kind: "like",
        core: 0,
        song: p.song,
        liked: p.liked,
        recipient: "",
        amount: "0",
        fee: Gl.toString(),
        nonce: It.toString(),
        created: t.now(),
        status: "signed",
        raw: Kt.raw,
        txid: Kt.txid,
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(fe), ae(fe);
      try {
        await t.chain.broadcast(Kt.raw, Kt.txid), ae({ ...fe, status: "pending" }), v = `${p.liked ? "♥ Liked" : "Unliked"} ${A}`, T = "";
        try {
          (V = t.likeSent) == null || V.call(t, p.song, p.liked);
        } catch {
        }
      } catch (de) {
        if (ae({ ...fe, status: Ki(de) ? "failed" : "unknown", note: de.message, ...Ki(de) ? { raw: void 0 } : {} }), T = de.message, Ki(de)) try {
          (pt = t.likeFailed) == null || pt.call(t, p.song);
        } catch {
        }
      }
      i = await mn(s);
    } catch (et) {
      T = "Like not sent: " + (et instanceof Error ? et.message : "the listening wallet is unavailable");
      try {
        (R = t.likeFailed) == null || R.call(t, p.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), f();
    }
  }
  return { snapshot: Co, refresh: fn, onListened: Ks, heart: E, toggleLike: d, ...Gs };
}
const ab = ["Connect", "Passkey", "Link & fund", "Listen"], cb = ["Passkey", "Add 1 STX", "Listen"], sf = (t) => t ? cb : ab;
function S5(t) {
  if (t.solo) return E5(t);
  const e = ab.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function E5(t) {
  const e = cb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function A5(t, e) {
  return !e || e.at >= sf(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const v5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function k5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !v5(r.id)));
}
const $5 = {}, I5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, L5 = (t) => {
  const e = $5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, C5 = (t) => `/hiro/${t}`, T5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, B5 = (t) => {
  const e = L5(t);
  if (e)
    return [T5(e)];
  const n = I5[t];
  return typeof window < "u" ? [`${window.location.origin}${C5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, M5 = {}, ip = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, N5 = "xtrata.log.enabled", P5 = "xtrata.log.level", _5 = "xtrata.log.tags", U5 = "xtrata.log.dedupe", Qa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, H5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, O5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, D5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, F5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, j5 = () => {
  const t = M5 ?? {}, e = Qa(N5) ?? t.VITE_LOG_ENABLED, n = Qa(P5) ?? t.VITE_LOG_LEVEL, r = Qa(_5) ?? t.VITE_LOG_TAGS, s = Qa(U5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: H5(e),
    level: O5(n) ?? "warn",
    tags: F5(r),
    dedupe: D5(s)
  };
}, R5 = (t, e, n) => !t.enabled || ip[n] < ip[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), z5 = (t, e, n, r) => {
  const s = j5();
  if (!R5(s, e, t) || K5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, G5 = /* @__PURE__ */ new Set();
let op = null;
const K5 = (t, e, n, r, s) => (op !== t && (G5.clear(), op = t), !1), V5 = (t, e, n) => z5("debug", t, e, n), q5 = {}, Y5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, X5 = (t) => {
  const e = q5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : Y5[t];
}, W5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Z5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return W5.test(n) ? n : null;
}, Q5 = (t) => t.replace(/\/+$/, ""), J5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), ap = (t) => {
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
}, Vi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, t$ = (t) => {
  var c, u;
  let e;
  try {
    e = Sr(Jk(t));
  } catch {
    return null;
  }
  const n = Vi(e);
  if (!n || n.success === !1)
    return null;
  const r = Vi(n.value), s = Vi(r == null ? void 0 : r.value), i = Vi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = ap((c = Vi(i.name)) == null ? void 0 : c.value), a = ap((u = Vi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : Z5(`${o}.${a}`);
}, e$ = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${Q5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [jw(vw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : t$(i.result);
}, n$ = async (t) => {
  const e = t.address.trim();
  if (!no(e))
    return null;
  const n = X5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of B5(t.network))
    try {
      return await e$({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return V5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: J5(r)
  }), null;
};
function r$(t, e, n = {}) {
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
const cp = Object.freeze({
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
}), lp = Object.freeze({ 139: "melophonic" });
function up(t, e = "") {
  const n = String(t);
  return Object.hasOwn(cp, n) ? cp[n] : Object.hasOwn(lp, n) ? lp[n] : e;
}
const fp = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function dp(t, e = "") {
  return Object.hasOwn(fp, String(t)) ? fp[String(t)] : e;
}
const lb = 10000n, md = 1000000n, jc = 3000n, s$ = (t, e) => `${t}#gift=${e}`, i$ = 100, Ro = (t, e = ur) => t <= Pe ? 0 : Number((t - Pe) / an(e)), hp = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), ub = "xtrata.xyz/radio/gifts", Yl = i$, o$ = "Create a prefunded Xtrata radio gift batch", a$ = (t) => ({
  domain: Ai({ name: We(ub), version: We("1"), "chain-id": kr(1) }),
  message: Ai({
    purpose: We(o$),
    creator: We(t.creator),
    count: kr(t.count),
    amount: kr(BigInt(t.amount)),
    label: We(t.label),
    issued: kr(t.issued),
    ...t.player ? { player: We(t.player) } : {}
  })
}), c$ = (t, e, n = ur) => Pe + BigInt(t) * an(n) + (e ? wl : 0n), l$ = (t, e = ur) => Number((md - Pe - (t ? wl : 0n)) / an(e)), u$ = (t, e) => BigInt(t) * (e + jc);
function f$(t, e, n, r = ur) {
  const s = n ? wl : 0n, i = e > Pe + s ? e - Pe - s : 0n, o = Number(i / an(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Hc,
    fees: BigInt(o) * r,
    reserve: Pe,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jc,
    perCopy: e + jc,
    total: u$(t, e)
  };
}
const d$ = (t) => t >= lb && t <= md, pp = 40, h$ = "Create an Xtrata radio gift player", p$ = /^[^\u0000-\u001f\u007f<>]+$/u;
function gp(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && p$.test(t) : !n;
}
function g$(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!gp(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!gp(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > pp) throw new Error(`A player holds 1 to ${pp} songs.`);
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
const y$ = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return Ig(Ng(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, w$ = (t) => ({
  domain: Ai({ name: We(ub), version: We("1"), "chain-id": kr(1) }),
  message: Ai({
    purpose: We(h$),
    admin: We(t.admin),
    player: We(t.hash),
    issued: kr(t.issued)
  })
}), Gr = (t) => t.tracks.filter((e) => !e.hidden), b$ = (t) => t.tracks.find((e) => e.hidden) ?? null, yp = [300, 500, 1e3], wp = 1800, Xl = /* @__PURE__ */ new Map();
async function m$(t) {
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
function x$(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = Xl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      Xl.set(t, { ...a, until: Date.now() + wp });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        Xl.delete(t), s();
      }, wp + 50);
    }
  }, i;
}
const jr = (t, e, n, r, s) => x$(t, e, async () => await m$(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Xs = "xtrata.radio.gift.incoming.v1", bp = (t) => "xtrata.radio.gift.mine.v1:" + t, mp = (t) => "xtrata.radio.gift.batches.v1:" + t, mt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, br = (t, e, n = "") => {
  const r = mt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ja = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, Kn = (t) => sr(t).replace(/\.?0+$/, "");
function S$(t) {
  let e = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), z = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return z !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), hp(z) ? z : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(t.store.get(Xs) || "null");
      return hp(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Xs, JSON.stringify({ code: i, at: t.now() }));
    let I = 0;
    const z = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (F) => {
      const S = await F.json().catch(() => ({}));
      if (F.status === 404) {
        t.store.set(Xs, null), e = { ...e, error: (S == null ? void 0 : S.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!F.ok) throw new Error("busy");
      const tt = S;
      e = { ...e, view: tt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(tt.status) && t.store.set(Xs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void z(), n(I++)));
    });
    z();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const I = e == null ? void 0 : e.view;
    return !(I != null && I.player) || !o() ? null : { player: I.player, from: l(I), plays: Ro(BigInt(I.amount)) };
  }, c = () => {
    const I = e == null ? void 0 : e.view;
    return !I || I.player || !o() ? null : { plays: Ro(BigInt(I.amount)), from: I.from ? t.who(I.from) : null };
  }, u = () => {
    const I = e == null ? void 0 : e.code;
    if (!I) return [];
    const z = `${location.origin}${location.pathname}#gift=${I}`;
    return [jr("gift-pass-on", "Copy the link to pass on", () => z, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Xs, null), t.changed();
  }, l = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let y = {};
  const g = (I) => {
    if (y.box) return y.box;
    const z = mt("div", "", "ppp-gift-check");
    y.box = z;
    const F = () => {
      const S = window.turnstile;
      !S || y.rendered || (y.rendered = !0, S.render(z, { sitekey: I, callback: (tt) => {
        y.token = tt, t.changed();
      }, "expired-callback": () => {
        y.token = void 0;
      } }));
    };
    if (window.turnstile) F();
    else {
      const S = document.createElement("script");
      S.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", S.async = !0, S.onload = F, document.head.append(S);
    }
    return z;
  }, x = (I) => {
    queueMicrotask(() => void I());
  };
  let v;
  async function T(I) {
    var S, tt, gt, Jt, ce, Dt, qt, Yt, Ee;
    if (!e || e.claiming || !I.listening) return;
    const z = !!((S = e.view) != null && S.player);
    if (z && !I.root) return;
    e.claiming = !0, e.error = void 0, (tt = t.claiming) == null || tt.call(t, !0), t.changed();
    const F = async (Gt) => {
      const st = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: y.token, ...Gt })
      });
      return { res: st, r: await st.json().catch(() => ({})) };
    };
    try {
      let Gt = 0, st = I.listening, Xt;
      if (z) {
        const pe = Number((gt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : gt.next);
        if (!Number.isSafeInteger(pe) || pe < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        Gt = pe;
        for (let tn = 0; ; tn++) {
          const un = await t.album.bind(Gt);
          if (st = un.address, Xt = await F({ wallet: st, binding: un }), Xt.res.status === 409 && /just taken/.test(((Jt = Xt.r) == null ? void 0 : Jt.error) || "") && tn < 5) {
            Gt += 1;
            continue;
          }
          break;
        }
      } else Xt = await F({ wallet: st });
      const { res: le, r: De } = Xt;
      if (le.status === 503 && /sending another gift/.test((De == null ? void 0 : De.error) || "")) {
        e.waiting = !0, (ce = t.claiming) == null || ce.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!le.ok) {
        const pe = String((De == null ? void 0 : De.error) || "");
        if (le.status === 404 || le.status === 410 || le.status === 409 && /already had a gift|brand-new|already have this album/.test(pe))
          throw t.store.set(Xs, null), new Error(pe || "This gift cannot be opened.");
        if (le.status === 429 || le.status === 403 || le.status === 400 && !/wallet number/i.test(pe)) throw new Error(pe || `Could not open the gift (${le.status}).`);
        const un = /topping up/.test(pe) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(pe) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(pe) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(un), { retry: !0, slow: /topping up|not paid for yet/.test(pe) });
      }
      e.done = !0, t.store.set(Xs, null), z ? await t.album.arrived(Gt, st, De.txid, BigInt(De.amount)) : t.giftSent(De.txid, BigInt(De.amount));
    } catch (Gt) {
      const st = Gt, Xt = st.name === "TypeError" || st.name === "AbortError" || st.name === "TimeoutError" || /wallet number/i.test(st.message);
      if (st.retry || Xt) {
        const le = e.tries ?? 0;
        e.tries = le + 1, e.retry = { text: st.retry ? st.message : "Still sending your gift… the network is slow, trying again." }, (Dt = t.claiming) == null || Dt.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, st.slow ? 6e4 : n(le));
      } else
        e.error = st.message, (qt = t.claiming) == null || qt.call(t, !1);
      y.token = void 0;
      try {
        (Ee = (Yt = window.turnstile) == null ? void 0 : Yt.reset) == null || Ee.call(Yt, y.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let U = null;
  function D(I) {
    if (!I.listening || !I.depositPending || I.step !== "fund")
      return U = null, [];
    if (!U || U.wallet !== I.listening || t.now() - U.at > 3e4) {
      const F = I.listening;
      U = { ...(U == null ? void 0 : U.wallet) === F ? U : {}, wallet: F, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(F)).then((S) => {
        var tt, gt;
        (U == null ? void 0 : U.wallet) === F && (U.state = (tt = S == null ? void 0 : S.gift) == null ? void 0 : tt.state, U.problem = ((gt = S == null ? void 0 : S.gift) == null ? void 0 : gt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const z = mt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return z.title = `Network reply: ${U.problem}`, [z];
  }
  function k(I, z, F = !1) {
    var Dt, qt;
    const S = z.player, tt = BigInt(z.amount), gt = F ? [] : [mt("p", `🎁 ${l(z)} sent you “${S.title}”${S.subtitle ? ` by ${S.subtitle}` : ""}: ${Gr(S).length} ${Gr(S).length === 1 ? "song" : "songs"} and ${Ro(tt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (F) return gt;
      if (gt.push(mt("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const Yt = document.createElement("details");
        Yt.className = "ppp-how";
        const Ee = document.createElement("summary");
        Ee.textContent = "How does this work?", Yt.append(Ee, mt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), gt.push(Yt);
      }
      return gt;
    }
    if (I.walletCannotAlbums)
      return gt.push(mt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), gt;
    const ce = (qt = (Dt = I.gate) == null ? void 0 : Dt.gifts) == null ? void 0 : qt.turnstileSiteKey;
    return ce && !y.token ? gt.push(mt("p", "One quick check and it is yours:", "ppp-mute"), g(ce)) : !e.claiming && !e.error && !e.waiting && !e.retry && x(() => T(I)), gt.push(...C(I, "Sending your album…")), gt;
  }
  function C(I, z) {
    const F = [];
    return e.claiming || e.waiting ? F.push(mt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : z, "ppp-cyan")) : e.retry && F.push(mt("p", e.retry.text, "ppp-warn"), br("Try now", () => {
      clearTimeout(v), e.retry = void 0, T(I);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? F.push(mt("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")) : e.error && F.push(mt("p", e.error, "ppp-bad"), br("Try again", () => {
      e.error = void 0, T(I);
    })), F;
  }
  const P = (I) => {
    var z;
    return !!e && !e.done && !e.error && o() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((z = e.view) != null && z.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function Y(I, z = {}) {
    var Ee, Gt;
    const F = D(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return F;
    const S = e.view;
    if (e.error && !S) return [mt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!S) return [mt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return F;
    if (S.status === "claimed" || S.status === "claiming") return [mt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(S.status)) return [mt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (S.status === "pending-deposit") return [mt("p", `🎁 ${l(S)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (S.player) return [...k(I, S, !!z.bare), ...F];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [mt("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")];
    const gt = BigInt(S.amount), Jt = Ro(gt).toLocaleString(), ce = mt(
      "p",
      `🎁 ${l(S)} sent you ${Kn(gt)} STX of on-chain music: about ${Jt} paid plays.`,
      "ppp-gift"
    ), Dt = z.bare ? [] : [ce], qt = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, Yt = (Gt = (Ee = I.gate) == null ? void 0 : Ee.gifts) == null ? void 0 : Gt.turnstileSiteKey;
    return qt ? (Yt && !y.token ? Dt.push(mt("p", "One quick check and it is yours:", "ppp-mute"), g(Yt)) : !e.claiming && !e.error && !e.waiting && !e.retry && x(() => T(I)), Dt.push(...C(I, "Sending your gift…"))) : I.step === "intro" ? z.bare || Dt.push(mt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Dt.push(mt("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Dt.push(mt("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), br("Forget this gift link here", h, "quiet")), Dt;
  }
  async function ot(I, z, F) {
    var S;
    try {
      const tt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((S = tt == null ? void 0 : tt.gift) != null && S.returnTo) return { ok: !0, funder: tt.gift.returnTo, txId: tt.gift.txid ?? void 0, amount: tt.gift.amount, distinct: 1 };
    } catch {
      if (F) return { ok: !1 };
    }
    return z();
  }
  const X = mt("div", "", "ppp-gift-fold");
  let W = 250000n, $ = "", _ = "";
  const m = (I) => {
    try {
      const z = JSON.parse(t.store.get(bp(I)) || "[]");
      return Array.isArray(z) ? z : [];
    } catch {
      return [];
    }
  }, B = (I, z) => t.store.set(bp(I), JSON.stringify(z.slice(0, 50)));
  async function K(I) {
    const z = m(I);
    for (const F of z)
      if (!(F.view && ["claimed", "refunded", "expired"].includes(F.view.status)))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: F.id, ...F.txid ? { txid: F.txid } : {} }) }) : await t.json("/radio/gift?id=" + F.id), F.error = void 0;
        } catch (S) {
          F.error = S.message;
        }
    B(I, z), t.changed();
  }
  async function N(I) {
    if ($) return;
    $ = "Starting your gift…", _ = "", t.changed();
    let z = null;
    try {
      z = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: W.toString() }) });
      const F = m(I);
      F.unshift({ id: z.id, code: z.code, amount: W.toString(), at: t.now() }), B(I, F), $ = "Approve the gift in your wallet…", t.changed();
      const S = await t.pay(I, z.depositTo, BigInt(z.deposit), z.memo), tt = m(I), gt = tt.find((Jt) => Jt.id === z.id);
      gt && (gt.txid = S, gt.view = { status: "pending-deposit", amount: W.toString(), source: "friend", from: I, label: "", expires: 0 }), B(I, tt), _ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (F) {
      _ = F.message || "Not sent.";
    } finally {
      $ = "", t.changed();
    }
  }
  const at = (I) => "xtrata.radio.gift.players.v1:" + I, Z = (I) => {
    try {
      const z = JSON.parse(t.store.get(at(I)) || "[]");
      return Array.isArray(z) ? z.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id)) : [];
    } catch {
      return [];
    }
  };
  async function Et(I, z) {
    var F;
    if (!$) {
      $ = "Checking the player…", _ = "", t.changed();
      try {
        const S = z.tracks.split(/[\s,]+/).filter(Boolean).map((Yt) => Number(Yt.replace(/^#/, ""))), tt = (z.explicit ?? "").split(/[\s,]+/).map((Yt) => Yt.replace(/^#/, "")).filter(Boolean).map(Number), gt = g$({ title: z.title.trim(), subtitle: z.subtitle.trim(), tracks: S, cover: (F = z.cover) != null && F.trim() ? Number(z.cover.trim().replace(/^#/, "")) : null, ...tt.length ? { explicit: tt } : {} });
        $ = "Sign in your wallet…", t.changed();
        const Jt = { admin: I, hash: y$(gt), issued: t.now() }, ce = await t.sign(I, w$(Jt));
        $ = "Making the player…", t.changed();
        const Dt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: gt, request: Jt, signature: ce }) }), qt = Z(I).filter((Yt) => Yt.id !== Dt.id);
        qt.unshift({ id: Dt.id, title: Dt.title, tracks: Dt.tracks }), t.store.set(at(I), JSON.stringify(qt.slice(0, 30))), _ = `${Dt.existing ? "That player already exists" : "Player made"} ✓ “${Dt.title}” · ${Dt.tracks} songs. Pick it below for a batch.`;
      } catch (S) {
        _ = S.message || "Not made.";
      } finally {
        $ = "", t.changed();
      }
    }
  }
  const L = (I, z) => s$(I || location.origin + "/radio.html", z), O = (I) => {
    try {
      const z = JSON.parse(t.store.get(mp(I)) || "[]");
      return Array.isArray(z) ? z.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id) && Array.isArray(F.codes)) : [];
    } catch {
      return [];
    }
  }, ft = (I, z) => t.store.set(mp(I), JSON.stringify(z.slice(0, 20))), dt = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, ht = (I, z) => t.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(z) });
  let St = 0;
  async function oe(I) {
    const z = O(I);
    for (const F of z)
      if (!dt(F))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await ht("/radio/gift/batch/confirm", { id: F.id, ...F.txid ? { txid: F.txid } : {} }) : await t.json("/radio/gift/batch?id=" + F.id), F.error = void 0;
        } catch (S) {
          F.error = S.message;
        }
    try {
      const F = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const S of (F == null ? void 0 : F.batches) ?? []) {
        const tt = z.find((gt) => gt.id === S.id);
        if (tt) {
          tt.error || (tt.view = S);
          continue;
        }
        z.push({ id: S.id, codes: [], count: S.count, amount: S.amount, label: S.label, player: S.player, depositTo: "", deposit: S.deposit, memo: S.memo, at: 0, view: S });
      }
    } catch {
    }
    ft(I, z), t.changed();
  }
  async function At(I, z) {
    const F = O(I).find((S) => S.id === z);
    if (!(!F || !F.depositTo || $)) {
      $ = "Approve the payment in your wallet…", _ = "", t.changed();
      try {
        const S = await t.pay(I, F.depositTo, BigInt(F.deposit), F.memo), tt = O(I), gt = tt.find((Jt) => Jt.id === z);
        gt && (gt.txid = S), ft(I, tt), _ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", $ = "", oe(I);
      } catch (S) {
        _ = `${/cancel/i.test(S.message) ? "Payment cancelled." : S.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        $ = "", t.changed();
      }
    }
  }
  async function Ot(I, z, F, S) {
    if ($) return;
    if (!z.ok) {
      _ = z.reason, t.changed();
      return;
    }
    $ = "Sign in your wallet…", _ = "", t.changed();
    let tt = null;
    try {
      const gt = { creator: I, count: z.count, amount: z.amount.toString(), label: F, issued: t.now(), ...S ? { player: S } : {} }, Jt = await t.sign(I, a$(gt));
      $ = "Making your links…", t.changed(), tt = await ht("/radio/gift/batch", { request: gt, signature: Jt });
      const ce = O(I);
      ce.unshift({ id: tt.id, codes: tt.codes, count: z.count, amount: tt.amount, label: F, player: S ?? null, depositTo: tt.depositTo, deposit: tt.deposit, memo: tt.memo, at: t.now() }), ft(I, ce);
    } catch (gt) {
      _ = gt.message || "Not made.", $ = "", t.changed();
      return;
    }
    $ = "", t.changed(), await At(I, tt.id);
  }
  function kt() {
    const I = !!Qt.value, z = Je.value === "max" ? l$(I) : Number(Je.value), F = c$(z, I), S = Number(Fe.value);
    return !Number.isInteger(S) || S < 1 || S > Yl ? { ok: !1, reason: `Make 1 to ${Yl} copies at a time.`, album: I, plays: z, amount: F, count: S } : d$(F) ? { ok: !0, reason: "", album: I, plays: z, amount: F, count: S, bill: f$(S, F, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: z, amount: F, count: S };
  }
  const Be = () => {
    const I = kt();
    if (!I.ok) return I.reason;
    const z = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${Kn(z.holders)} to song holders, ${Kn(z.fees)} network fees)${I.album ? `, ${Kn(z.float)} for the album’s likes` : ""}, ${Kn(z.reserve)} kept so a listener can return what is left, + ${Kn(z.sendFee)} to send it = ${Kn(z.perCopy)} STX. ${I.count} copies = ${Kn(z.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, $t = (I, z) => z.codes.map((F) => L(I, F)), Nt = mt("input");
  Nt.type = "range", Nt.min = String(lb), Nt.max = String(md), Nt.step = "10000", Nt.value = String(W), Nt.setAttribute("aria-label", "Gift amount");
  const ln = mt("p", "", "ppp-gift-amount"), ae = br("", () => {
    const I = t.main();
    I && N(I);
  }, "primary"), Rt = () => {
    ln.textContent = kn(), ae.textContent = `Gift ${Kn(W)} STX`;
  };
  Nt.oninput = () => {
    W = BigInt(Nt.value), Rt();
  };
  const kn = () => `${Kn(W)} STX · about ${Ro(W).toLocaleString()} paid plays · you pay ${Kn(W + jc)} STX with the network fee`;
  Rt();
  const He = mt("input");
  He.maxLength = 60, He.placeholder = "Title, e.g. Proof of Sound", He.setAttribute("aria-label", "Player title");
  const Qe = mt("input");
  Qe.maxLength = 80, Qe.placeholder = "Artist (optional)", Qe.setAttribute("aria-label", "Player subtitle");
  const Ke = mt("textarea");
  Ke.rows = 3, Ke.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ke.setAttribute("aria-label", "Songs");
  const Ve = mt("input");
  Ve.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ve.setAttribute("aria-label", "Explicit songs");
  const Oe = mt("input");
  Oe.inputMode = "numeric", Oe.placeholder = "Cover inscription number (optional), shown when the album loads", Oe.setAttribute("aria-label", "Cover inscription");
  const Qt = mt("select");
  Qt.setAttribute("aria-label", "Batch album");
  const Je = mt("select");
  Je.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...yp])].sort((z, F) => z - F)) Je.append(Ja(`${I.toLocaleString()} plays`, String(I)));
  Je.append(Ja("Max (1 STX)", "max")), Je.value = String(yp[0]);
  const Fe = mt("input");
  Fe.type = "number", Fe.min = "1", Fe.max = String(Yl), Fe.value = "10", Fe.setAttribute("aria-label", "Copies");
  const $e = mt("input");
  $e.maxLength = 40, $e.placeholder = "Label, e.g. Opera launch", $e.setAttribute("aria-label", "Batch label");
  const Se = mt("p", "", "ppp-mute"), ye = () => {
    Se.textContent = Be();
  };
  for (const I of [Qt, Je, Fe])
    I.oninput = ye, I.onchange = ye;
  ye();
  function bn(I) {
    var tt, gt;
    const z = (tt = I.gate) == null ? void 0 : tt.gifts;
    if (!(z != null && z.enabled) || !z.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const F = t.main(), S = [mt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!F)
      S.push(mt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (z.admin) {
      const Jt = mt("div", "", "ppp-gift-admin"), ce = (Gt, st) => {
        const Xt = mt("label", Gt);
        return Xt.append(st), Xt;
      }, Dt = Z(F);
      Jt.append(
        mt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        He,
        Qe,
        Ke,
        Oe,
        Ve,
        br("Sign and make player", () => void Et(F, { title: He.value, subtitle: Qe.value, tracks: Ke.value, cover: Oe.value, explicit: Ve.value }))
      );
      const qt = br("Sign, pay and make links", () => {
        Ot(F, kt(), $e.value.trim(), Qt.value || void 0);
      });
      qt.disabled = !!$;
      const Yt = Qt.value;
      Qt.replaceChildren(Ja("No album (starter copies)", ""), ...Dt.map((Gt) => Ja(`${Gt.title} · ${Gt.tracks} songs`, Gt.id))), Dt.some((Gt) => Gt.id === Yt) && (Qt.value = Yt), ye(), Jt.append(
        mt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        ce("Album ", Qt),
        ce("Plays each ", Je),
        ce("Copies ", Fe),
        $e,
        Se,
        qt
      ), t.now() - St > 3e4 && (St = t.now(), oe(F));
      const Ee = O(F);
      if (Ee.length) {
        const Gt = mt("ul", "", "ppp-gift-list");
        for (const st of Ee.slice(0, 10)) {
          const Xt = st.view, le = Xt == null ? void 0 : Xt.copies, De = st.error ? st.error : !Xt || Xt.status === "pending-deposit" ? st.txid ? "payment confirming…" : "waiting for your payment" : `${le.claimed} of ${Xt.count} claimed${le.refunding + le.refunded ? ` · ${le.refunded} refunded${le.refunding ? `, ${le.refunding} on their way` : ""}` : ""}`, pe = mt("li");
          if (pe.append(mt("span", `${st.label || "Batch"} · ${st.count} × ${Kn(BigInt(st.amount))} STX`, "t"), mt("span", De, "ppp-mute")), !st.txid && st.depositTo && (!Xt || Xt.status === "pending-deposit") && pe.append(br("Pay now", () => void At(F, st.id), "tiny")), st.codes.length && (Xt == null ? void 0 : Xt.status) === "live") {
            const tn = $t(((gt = I.gate) == null ? void 0 : gt.radioUrl) ?? null, st);
            pe.append(
              jr("batch-copy:" + st.id, "Copy all links", () => tn.join(`
`), "tiny", t.changed),
              jr("batch-csv:" + st.id, "Copy as CSV", () => ["copy,link", ...tn.map((un, Qn) => `${Qn + 1},${un}`)].join(`
`), "tiny", t.changed)
            );
          } else st.codes.length || pe.append(mt("span", "links were made on another device", "ppp-mute"));
          Gt.append(pe);
        }
        Jt.append(Gt);
      }
      S.push(Jt);
    }
    return $ && S.push(mt("p", $, "ppp-cyan")), _ && S.push(mt("p", _, /✓/.test(_) ? "ppp-ok" : "ppp-warn")), X.replaceChildren(...S), X;
  }
  return { banner: Y, funder: ot, renderFold: bn, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: P };
}
const E$ = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function A$(t) {
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
const v$ = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function k$(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = v$(i);
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
function $$(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const of = /* @__PURE__ */ new Set(), fb = (t) => (of.add(t), () => {
  of.delete(t);
}), af = () => {
  for (const t of [...of])
    try {
      t();
    } catch {
    }
}, xp = "xtrata:al-thumb:v1:", db = "-", zo = 96, I$ = 24 * 1024 * 1024, dn = /* @__PURE__ */ new Map(), Sp = /* @__PURE__ */ new Set(), cf = [];
let Wl = !1, Zl;
const Rc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(xp + t);
    window.localStorage.setItem(xp + t, e);
  } catch {
  }
  return null;
};
function xd(t) {
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
          r.width = r.height = zo, s.fillStyle = "#143a40", s.fillRect(0, 0, zo, zo), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, zo, zo), e(r.toDataURL("image/jpeg", 0.82));
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
async function L$(t) {
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
    let x = 0;
    for (; ; ) {
      const v = r.slice(x).search(/<img\b/i);
      if (v < 0)
        return r = g ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const T = x + v, U = r.indexOf(">", T);
      if (U < 0)
        return r = r.slice(T), null;
      const D = r.slice(T, U + 1), k = D.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (k) return k[1].replace(/&amp;/g, "&");
      const C = D.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (C) return "/inscription/" + C[1];
      x = U + 1;
    }
  }, o = (y = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : y.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: g, value: x } = await o.read();
    if (g) break;
    s += x.byteLength, r += a.decode(x, { stream: !0 });
    const v = i(!1);
    if (v)
      return await o.cancel(), v;
    if (s > I$)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function C$() {
  if (!Wl) {
    Wl = !0;
    try {
      for (; cf.length; ) {
        const t = cf.shift();
        if (!dn.has(t))
          try {
            const e = await L$(t);
            if (e === null) continue;
            if (!e) {
              dn.set(t, ""), Rc(t, db), af();
              continue;
            }
            const n = await xd(e);
            dn.set(t, n), n.startsWith("data:image/jpeg") && Rc(t, n), af();
          } catch {
          }
      }
    } finally {
      Wl = !1;
    }
  }
}
function hb(t, e) {
  if (e && !dn.get(t) ? (dn.set(t, e), xd(e).then((r) => {
    r !== e && (dn.set(t, r), r.startsWith("data:image/jpeg") && Rc(t, r), af());
  })) : e === "" && !dn.has(t) && dn.set(t, ""), dn.has(t)) return dn.get(t);
  const n = Rc(t);
  if (n != null) {
    const r = n === db ? "" : n;
    return dn.set(t, r), r;
  }
  return Sp.has(t) || (Sp.add(t), cf.push(t), Zl || (Zl = setTimeout(() => {
    Zl = void 0, C$();
  }, 1200))), "";
}
const qi = 12, T$ = 5e3, sn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Yi = (t, e, n = "") => {
  const r = sn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function B$(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, h = qi;
  const l = sn("div", "", "ppp-shelf-box");
  fb(() => t.changed());
  const y = (m) => "xtrata.radio.shelf.pins.v1:" + m, g = (m) => "xtrata.radio.shelf.recent.v1:" + m, x = (m, B) => {
    try {
      return JSON.parse(t.store.get(m) || "null") ?? B;
    } catch {
      return B;
    }
  }, v = (m) => new Set(x(y(m), []).filter((B) => Number.isSafeInteger(B))), T = (m) => {
    const B = x(g(m), {}), K = {};
    for (const [N, at] of Object.entries(B)) Number.isSafeInteger(Number(N)) && typeof at == "number" && (K[Number(N)] = at);
    return K;
  };
  async function U(m) {
    if (!s) {
      s = !0, i = !1;
      try {
        const B = [];
        let K = 0, N = 0;
        for (let at = 0; at < T$ / 100 + 1; at++) {
          const Z = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(m)}&after=${K}&limit=100`);
          if (B.push(...A$(Z == null ? void 0 : Z.shelf)), N = Number(Z == null ? void 0 : Z.total) || B.length, !(Z != null && Z.next) || !Number.isSafeInteger(Z.next)) break;
          K = Z.next;
        }
        m === e && (n = B, r = N, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const D = () => {
    o = -1 / 0;
  }, k = sn("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = qi, t.changed();
  };
  const C = sn("select");
  C.setAttribute("aria-label", "Sort albums");
  for (const m of E$) {
    const B = document.createElement("option");
    B.value = m.value, B.textContent = m.label, C.append(B);
  }
  C.onchange = () => {
    c = C.value, h = qi, t.changed();
  };
  const P = Yi("", () => {
    u = !u, h = qi, t.changed();
  }, "tiny"), Y = sn("div", "", "ppp-shelf-tools");
  Y.append(k, C, P);
  const ot = sn("div"), X = sn("div");
  function W(m) {
    const B = m.step === "off" || m.step === "elsewhere" ? void 0 : m.root;
    if (B !== e && (e = B, n = [], r = 0, o = -1 / 0, h = qi), !B || m.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(B), !n.length)
      return i ? (X.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Yi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(X), l) : null;
    const K = v(B), N = T(B), at = k$(n, { query: a, sort: c, pinnedOnly: u, pins: K, recents: N });
    k.value !== a && (k.value = a), C.value = c, P.textContent = u ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(u));
    const Z = [];
    if (m.slot > 0 && Z.push(Yi("← My player", () => t.open(0), "quiet")), !at.length) Z.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const Et = sn("ul", "", "ppp-shelf-list");
      for (const L of at.slice(0, h)) {
        const O = sn("li", "", L.slot === m.slot ? "now" : ""), ft = K.has(L.slot), dt = Yi(ft ? "★" : "☆", () => {
          const Nt = new Set(K);
          ft ? Nt.delete(L.slot) : Nt.add(L.slot), t.store.set(y(B), JSON.stringify([...Nt])), t.changed();
        }, "tiny");
        dt.setAttribute("aria-label", ft ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const ht = [L.player.subtitle, `${Gr(L.player).length} ${Gr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), St = L.slot === m.slot, oe = Yi(St ? "Playing" : "Select", () => {
          t.store.set(g(B), JSON.stringify($$({ ...N, [L.slot]: t.now() }))), t.open(L.slot);
        }, St ? "tiny ppp-pick" : "tiny primary ppp-pick");
        oe.disabled = St;
        const At = Gr(L.player)[0], Ot = L.player.cover ?? (At == null ? void 0 : At.id), kt = Ot ? hb(String(Ot)) : "", Be = sn("span", "", "ppp-shelf-art");
        if (kt) {
          const Nt = document.createElement("img");
          Nt.src = kt, Nt.alt = "", Nt.decoding = "async", Be.append(Nt);
        } else Be.textContent = "💿";
        const $t = sn("span", "", "ppp-shelf-txt");
        $t.append(sn("span", L.player.title, "t"), sn("span", ht, "ppp-mute")), O.append(dt, Be, $t, oe), Et.append(O);
      }
      Z.push(Et), at.length > h && Z.push(Yi(`Show more (${at.length - h} left)`, () => {
        h += qi, t.changed();
      }, "quiet"));
    }
    return i && Z.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), ot.replaceChildren(...Z), l.firstChild !== Y && l.replaceChildren(Y, ot), l;
  }
  return { render: W, invalidate: D, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const m = T(e), B = [...n].filter((K) => K.player).sort((K, N) => (m[N.slot] ?? 0) - (m[K.slot] ?? 0) || N.slot - K.slot)[0];
    return B ? { slot: B.slot, title: B.player.title } : null;
  } };
}
const M$ = 20, Xe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ie = {
  grid: Xe('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Xe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Xe('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Xe('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Xe('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Xe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Xe('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Xe('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Xe('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Xe('<path d="M6 9l6 6 6-6"/>', 18),
  right: Xe('<path d="M9 6l6 6-6 6"/>', 16),
  close: Xe('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Xe('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Xe('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Xe('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Xe('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Xe('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const rn = (t, ...e) => Q("button", { type: "button", ...t }, ...e), tc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Go = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, N$ = { music: "My music", device: "This device", gifts: "Albums (admin)" }, P$ = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Ep(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function h(m) {
    var K, N, at;
    if (!m || !Number.isSafeInteger(m)) return "";
    const B = (at = (N = (K = e.radio()) == null ? void 0 : K.getState) == null ? void 0 : N.call(K)) == null ? void 0 : at.albumCover;
    return B != null && B.url && Number(B.tokenId) === m ? B.url : c.has(m) ? c.get(m) : (u.has(m) || (u.add(m), fetch("/inscription/" + m, { signal: AbortSignal.timeout(2e4) }).then(async (Z) => {
      var L, O, ft, dt;
      const Et = (Z.headers.get("content-type") || "").toLowerCase();
      if (!Z.ok)
        throw await ((L = Z.body) == null ? void 0 : L.cancel()), new Error("no cover");
      return Et.startsWith("image/") ? (await ((O = Z.body) == null ? void 0 : O.cancel()), "/inscription/" + m) : Et.includes("text/html") ? (((ft = (await Z.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : ft[1]) ?? "").replace(/&amp;/g, "&") : (await ((dt = Z.body) == null ? void 0 : dt.cancel()), "");
    }).then((Z) => {
      c.set(m, Z), _();
    }).catch(() => {
      u.delete(m);
    })), "");
  }
  fb(() => _());
  function l(m) {
    var K;
    i = m, m ? a.dataset.sheet = m : delete a.dataset.sheet;
    const B = document.querySelector(".side");
    if (m && m !== "more") {
      for (const Z of P$[m]) {
        const Et = B == null ? void 0 : B.querySelector(Z);
        Et && (Et.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = N$[m]);
      const at = document.getElementById("sheetExtra");
      at && at.replaceChildren(...m === "music" ? [g()] : []), (K = B == null ? void 0 : B.scrollTo) == null || K.call(B, { top: 0 });
    }
    _();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (m) => {
    m.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const g = () => rn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: Ie.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: Ie.right })
  );
  let x = null, v = !1;
  const T = () => {
    var B;
    const m = e.radio();
    v || !(m != null && m.subscribe) || (v = !0, m.subscribe((K) => {
      x = K, (s == null ? void 0 : s.mode) === "open" && _();
    }), x = ((B = m.getState) == null ? void 0 : B.call(m)) ?? null);
  };
  r || setInterval(() => {
    var N, at;
    if ((s == null ? void 0 : s.mode) !== "open" || !(x != null && x.playing)) return;
    const m = (at = (N = e.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : at.call(N), B = t.querySelector(".al-bar > i"), K = t.querySelectorAll(".al-times span");
    !m || !B || (B.style.width = m.duration ? `${Math.min(100, m.current / m.duration * 100)}%` : "0%", K.length === 2 && (K[0].textContent = tc(m.current || 0), K[1].textContent = m.duration ? tc(m.duration) : "–:––"));
  }, 500);
  let U = "", D = null;
  function k(m, B, K = {}) {
    const N = K.song || h(m.cover), Z = [N ? Q("img", { src: N, alt: K.song ? "Song artwork" : `${m.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, m.title), m.subtitle ? Q("span", {}, m.subtitle) : null), K.paused ? Q("span", { class: "al-paused" }, Q("i", { html: Ie.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], Et = "al-cover" + (B ? "" : " al-cover--small") + (K.paused ? " is-paused" : "");
    return K.flip ? (Z.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: Ie.flip })), rn({ class: Et + " is-flippable", "aria-label": K.flipped ? "Show this song’s artwork" : `Show the ${m.title} cover`, onClick: K.flip }, ...Z)) : Q("div", { class: Et }, ...Z);
  }
  function C(m) {
    return m.plays === null || m.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, m.playsComing ? "Plays on their way…" : "…") : m.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, m.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (m.plays <= M$ ? " al-chip--low" : "") }, `${Go(m.plays, "play", "plays")} left`);
  }
  function P(m) {
    const B = m.player, K = B.tracks.filter((at) => !at.hidden), N = [];
    return m.mode === "arrive" && m.from && N.push(Q("p", { class: "al-from" }, Q("span", { html: Ie.gift }), Q("span", {}, Q("b", {}, m.from), " sent you an album"))), N.push(k(B, !0)), N.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, B.title),
      B.subtitle ? Q("p", { class: "al-artist" }, B.subtitle) : null,
      K.length ? Q("p", { class: "al-songline" }, K.map((at) => at.title || `#${at.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Go(K.length, "song", "songs"), m.offered ? Go(m.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), m.status.length && N.push(Q("div", { class: "al-status", role: "status" }, ...m.status)), N.push(Q("div", { class: "al-grow" })), m.asking ? N.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : m.primary && N.push(rn({ class: "al-primary", onClick: m.primary.run, disabled: m.busy }, Q("span", { html: Ie.playSmall }), m.primary.label)), m.hint && !m.asking && N.push(Q("p", { class: "al-hint" }, m.hint)), m.secondary && !m.asking && N.push(rn({ class: "al-link", onClick: m.secondary.run, disabled: m.busy }, m.secondary.label)), N;
  }
  function Y(m, B) {
    const { songs: K, current: N, started: at, own: Z, out: Et, waiting: L } = B, O = m.player, ft = e.radio(), dt = [];
    dt.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, O.title), ` · ${Go(K.length, "song", "songs")}`), C(m)));
    const ht = h(O.cover), St = "album:" + O.cover;
    ht && !dn.has(St) && (dn.set(St, ht), xd(ht).then((At) => {
      At !== ht && (dn.set(St, At), _());
    }));
    const oe = ht ? dn.get(St) || ht : "";
    return dt.push(Q("ol", { class: "al-tracks" }, ...K.map((At, Ot) => {
      const kt = String(At.id) === N, Be = hb(String(At.id), kt && at ? Z : void 0);
      return Q("li", {}, rn(
        { class: "al-track" + (kt ? " is-on" : ""), "aria-label": `Play ${At.title || "#" + At.id}`, "aria-current": kt ? "true" : void 0, disabled: Et || L, onClick: () => {
          var $t;
          return ($t = ft == null ? void 0 : ft.playToken) == null ? void 0 : $t.call(ft, At.id);
        } },
        Q(
          "span",
          { class: "al-th" + (Be ? "" : " is-blank") },
          Be ? Q("img", { src: Be, alt: "", decoding: "async" }) : oe ? Q("img", { src: oe, alt: "", decoding: "async" }) : null,
          Be ? null : Q("span", { class: "al-n" }, String(Ot + 1)),
          kt ? Q("span", { class: "al-eq", html: Ie.eq }) : null
        ),
        Q("span", { class: "al-tt" }, At.title || `#${At.id}`, At.explicit ? Q("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), dt;
  }
  function ot(m) {
    var Be;
    const B = m.player, K = B.tracks.filter(($t) => !$t.hidden), N = e.radio(), at = x == null ? void 0 : x.nowPlaying, Z = at && B.tracks.some(($t) => String($t.id) === String(at.tokenId)) ? String(at.tokenId) : null, Et = Z ? B.tracks.find(($t) => String($t.id) === Z) : null, L = m.plays === 0 && !m.playsComing, O = !!m.playsComing && !m.plays, ft = !!(x != null && x.playing) && !!Z, dt = x == null ? void 0 : x.heart, ht = Z ? (Be = N == null ? void 0 : N.getPosition) == null ? void 0 : Be.call(N) : null;
    Z && (ft || ((ht == null ? void 0 : ht.current) ?? 0) > 0.5) && (U = B.id);
    const St = !!Z && U === B.id;
    D && D !== Z && (D = null);
    const oe = St ? String((at == null ? void 0 : at.cover) || "") : "", At = !!oe && D === Z, kt = [k(B, !L, { song: At ? "" : oe, paused: St && !ft, flip: oe ? () => {
      D = D === Z ? null : Z, _();
    } : void 0, flipped: At })];
    if (kt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, Et ? Et.title || (at == null ? void 0 : at.title) || `#${Et.id}` : B.title),
        Q("div", { class: "al-artist" }, Et ? Et.artist || (at == null ? void 0 : at.artist) || B.subtitle : B.subtitle || "Press play")
      ),
      Z ? rn({ class: "al-icon" + (dt != null && dt.liked ? " is-on" : ""), "aria-label": dt != null && dt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(dt != null && dt.liked)), disabled: !!(dt != null && dt.pending) || !!(dt != null && dt.locked) || O, onClick: () => {
        var $t;
        return ($t = N == null ? void 0 : N.toggleLike) == null ? void 0 : $t.call(N);
      }, html: dt != null && dt.liked ? Ie.heartOn : Ie.heart }) : null
    )), L)
      kt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        X(m, !0)
      ));
    else {
      const $t = ht != null && ht.duration ? Math.min(100, ht.current / ht.duration * 100) : 0;
      kt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${$t}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, tc((ht == null ? void 0 : ht.current) || 0)), Q("span", {}, ht != null && ht.duration ? tc(ht.duration) : "–:––"))
      ));
    }
    return kt.push(Q(
      "div",
      { class: "al-ctl" + (L || O ? " is-off" : "") },
      rn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: L || O, onClick: () => {
        var $t;
        return ($t = N == null ? void 0 : N.prev) == null ? void 0 : $t.call(N);
      }, html: Ie.prev }),
      rn({ class: "al-play", "aria-label": ft ? "Pause" : "Play", disabled: L || O, onClick: () => {
        var $t;
        return ($t = N == null ? void 0 : N.playPause) == null ? void 0 : $t.call(N);
      }, html: ft ? Ie.pause : Ie.play }),
      rn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: L || O, onClick: () => {
        var $t;
        return ($t = N == null ? void 0 : N.next) == null ? void 0 : $t.call(N);
      }, html: Ie.next })
    )), m.status.length && kt.push(Q("div", { class: "al-status", role: "status" }, ...m.status)), kt.push(...Y(m, { songs: K, current: Z, started: St, own: oe, out: L, waiting: O })), kt.push(Q("div", { class: "al-grow" })), kt.push(rn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: Ie.down })
    )), kt;
  }
  function X(m, B) {
    const K = Q("div", { class: "al-topups" + (B ? " al-topups--primary" : "") }), N = B ? [m.topUps[1] ?? m.topUps[0]] : [...m.topUps];
    for (const at of N) {
      const Z = m.myPlays !== void 0 && m.myPlays >= at && !m.playsComing && !m.busy;
      K.append(rn({ class: "al-topup", disabled: !Z, onClick: () => e.topUp(at) }, B ? `Add ${at.toLocaleString()} plays` : `+${at.toLocaleString()}`));
    }
    return B && K.append(rn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), K;
  }
  function W(m) {
    const B = m.myPlays !== void 0 && m.myPlays >= (m.topUps[0] ?? 0), K = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${m.player.title}`), Q("span", { class: "al-mono" }, m.plays === null || m.plays === void 0 ? "" : `${m.plays.toLocaleString()} left`)),
      X(m, !1),
      Q("p", { class: "al-mute al-small" }, m.playsComing ? "Plays are on their way. Add more once they arrive." : m.myPlays === void 0 ? "Checking My player…" : B ? `Moved from My player · ${Go(m.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !B && !m.playsComing && m.myPlays !== void 0 ? rn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), N = (Z, Et, L, O) => rn(
      { class: "al-row", onClick: O },
      Q("span", { class: "al-row-i", html: Z }),
      Q("span", { class: "al-row-t" }, Q("b", {}, Et), Q("small", {}, L)),
      Q("span", { class: "al-row-go", html: Ie.right })
    ), at = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      N(Ie.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, _();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), rn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Ie.close })),
      m.mode === "open" ? K : null,
      Q(
        "div",
        { class: "al-rows" },
        N(Ie.grid, "My music", "Your albums and the radio", () => l("music")),
        N(Ie.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        m.canMake ? N(Ie.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        N(Ie.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        at
      )
    );
  }
  function $(m) {
    var L, O;
    const B = m.player, K = x == null ? void 0 : x.nowPlaying, N = K && B.tracks.some((ft) => String(ft.id) === String(K.tokenId)) ? String(K.tokenId) : null, at = !!(x != null && x.playing) && !!N, Z = N ? (O = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : O.call(L) : null;
    N && (at || ((Z == null ? void 0 : Z.current) ?? 0) > 0.5) && (U = B.id);
    const Et = !!N && U === B.id;
    return Y(m, {
      songs: B.tracks.filter((ft) => !ft.hidden),
      current: N,
      started: Et,
      own: Et ? String((K == null ? void 0 : K.cover) || "") : "",
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
    const B = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      m.mode === "open" ? rn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Ie.grid }) : null
    ), K = Q("div", { class: "al-body al-body--" + m.mode }, ...m.mode === "open" ? ot(m) : P(m));
    t.replaceChildren(B, K, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), W(m)] : []);
  }
  return {
    render(m) {
      if (r) {
        s = m, _();
        return;
      }
      const B = !!s;
      s = m, !m && (B || i) && (i = "", delete a.dataset.sheet), m ? a.dataset.view = "album" : delete a.dataset.view, m != null && m.asking ? a.dataset.asking = "1" : delete a.dataset.asking, _();
    },
    sheet: () => i,
    setSheet: l
  };
}
const _$ = [
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
function U$(t) {
  for (const [e, n] of _$) if (n.test(t)) return e;
  return null;
}
const pb = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), gb = (t) => /Android/.test(t);
function H$(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : pb(e) ? "x-safari-" + n.href : gb(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const O$ = (t) => pb(t) ? "Safari" : gb(t) ? "Chrome" : "your browser", Xi = "Xtrata Music Wallet", D$ = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Ap(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Xi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && D$.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Xi} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Xi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Xi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Xi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Xi, detail: "Open on this device." });
    }
  return r;
}
const Ql = "xtrata.radio.novice", yb = "xtrata.radio.novice.previewed.v1", vp = 6 * 6e4;
function F$(t, e) {
  let n = null;
  try {
    const r = new URLSearchParams(t).get("novice");
    if (r === "1" || r === "preview")
      e.set(Ql, r), n = r;
    else {
      if (r === "0")
        return e.set(Ql, null), { on: !1, preview: !1 };
      n = e.get(Ql);
    }
  } catch {
    n = null;
  }
  return { on: n === "1" || n === "preview", preview: n === "preview" };
}
const j$ = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, kp = (t) => j$.test(t ?? ""), R$ = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, z$ = {
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
}, G$ = (t, e) => z$[t] ?? e;
function K$(t, e) {
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
const V$ = "Make your player once, with Face ID or your fingerprint, and the music starts.", q$ = "Checking your player…", lf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function wb(t) {
  try {
    const e = JSON.parse(t.get(yb) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function Y$(t, e) {
  const n = wb(t).filter((r) => r !== e);
  n.push(e), t.set(yb, JSON.stringify(n.slice(-50)));
}
function Jl(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...lf(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : lf();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > vp ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > vp ? { ...t, phase: "done" } : t;
  }
}
const ec = (t) => t.phase === "open" || t.phase === "playing", $p = "http://www.w3.org/2000/svg", X$ = [
  ["#ececec", "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"],
  ["#3a7db5", "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"],
  ["#e98a32", "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"]
];
function Ip(t = "", e = !1) {
  const n = document.createElementNS($p, "svg");
  n.setAttribute("viewBox", "0 40 850 770"), n.setAttribute("aria-hidden", "true"), t && n.setAttribute("class", t);
  for (const [r, s] of X$) {
    const i = document.createElementNS($p, "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("fill", e ? "currentColor" : r), i.setAttribute("d", s), n.append(i);
  }
  return n;
}
const ee = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Ws = (t, e, n, r = !1) => {
  const s = ee("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, bb = (t) => t.toLocaleString(), Lp = { gift: ["Picked", "Passkey", "Listen"], fresh: ["Welcome", "Passkey", "Listen"] }, W$ = (t) => t === "gift" || t === "new" ? 1 : t === "arriving" ? 2 : t === "landed" ? 3 : -1;
function Z$(t, e) {
  const n = ee("ol", "al-steps");
  return n.setAttribute("aria-label", e >= t.length ? "All steps done" : `Step ${e + 1} of ${t.length}: ${t[e]}`), t.forEach((r, s) => {
    const i = ee("li", s < e ? "is-done" : s === e ? "is-now" : "");
    i.append(ee("i", "", s < e ? "✓" : String(s + 1)), ee("span", "", r)), n.append(i);
  }), n;
}
function Q$() {
  const t = ee("div", "tier-disc tier-disc--mid");
  return t.dataset.tier = "mystery", t.setAttribute("role", "img"), t.setAttribute("aria-label", "A player waiting to be opened"), t.append(ee("span", "tier-disc__mark", "?")), t;
}
const J$ = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle.", "♪"],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password.", "◉"],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away.", "♥"]
], Dr = {
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
}, tI = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${bb(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, eI = (t) => t ? `Your player holds ${bb(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", nI = (t) => t ? `You got a ${t.name} player` : Dr.landed.title;
function rI(t, e = !0) {
  const n = ee("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(ee("span", "tier-disc__mark", t.mark)), n;
}
function sI(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = ee("ul", "al-welcome-points");
    for (const [i, o, a] of J$) {
      const c = ee("li");
      c.title = o;
      const u = ee("em", "", a);
      u.setAttribute("aria-hidden", "true"), c.append(u, ee("b", "", i), ee("span", "", o)), s.append(c);
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
      const o = ee("header", "al-top"), a = ee("a", "al-brand");
      a.href = "/radio", a.append(Ip("al-logo"), ee("span", "", "Xtrata "), ee("b", "", "Music")), o.append(a);
      const c = ee("div", "al-body al-body--welcome"), u = ee("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        u.append(ee("p", "al-welcome-wait", Dr.checking));
      else {
        const y = W$(h);
        if (y >= 0 && u.append(Z$(h === "new" ? Lp.fresh : Lp.gift, y)), s.tier && (h === "landed" || h === "back" || h === "empty") ? u.append(rI(s.tier)) : h === "gift" || h === "arriving" ? u.append(Q$()) : h === "new" && u.append(Ip("al-hero-mark")), u.append(ee("h1", "", h === "landed" ? nI(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : Dr[h].title)), u.append(ee("p", "", h === "gift" ? tI(s.plays, s.from, s.mystery) : h === "landed" ? eI(s.plays) : Dr[h].body)), (h === "landed" || h === "gift") && u.append(r()), s.status.length) {
          const g = ee("div", "al-status");
          g.setAttribute("role", "status"), g.append(...s.status), u.append(g);
        }
        if (s.asking) u.append(ee("p", "al-hint al-hint--ask", Dr.asking));
        else if (h === "gift" || h === "new" || h === "back") {
          const g = Dr[h];
          s.canStart && u.append(Ws("al-primary", g.primary, h === "back" ? s.unlock : s.start, s.busy), ee("p", "al-hint", g.hint)), s.canStart && u.append(Ws("al-link", g.returning, s.returning, s.busy)), u.append(Ws("al-link", g.full, s.full));
        } else if (h === "landed") {
          if (u.append(Ws("al-primary", Dr.landed.primary, s.full)), (l = s.albums) != null && l.length) {
            u.append(ee("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const g of s.albums) {
              const x = Ws("al-album", "", g.run);
              x.append(ee("b", "", g.title), ee("span", "", g.by)), u.append(x);
            }
          }
        } else h === "empty" && u.append(Ws("al-primary", Dr.empty.primary, s.restock), Ws("al-link", Dr.empty.full, s.full));
      }
      c.append(u), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
function iI(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const oI = [100, 250, 500, 1e3], aI = (t, e = ur) => BigInt(t) * an(e);
function cI(t, e = ur, n = 0n) {
  const r = Bs - t - n;
  return r > 0n ? Number(r / an(e)) : 0;
}
function lI(t, e = ur, n = 0n) {
  const r = t === void 0 ? 0 : cI(t, e, n);
  return oI.map((s) => ({ plays: s, stx: aI(s, e), fits: t !== void 0 && s <= r }));
}
const uI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, fI = (t) => uI[t.unit](t.amount), Ae = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, fc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function dI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${fc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${fc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${fc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function hI(t) {
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
    const a = lI(o.balance, o.fee, o.incoming);
    s(a);
    const c = iI(o.switches);
    (g = c.find((x) => x.id === r)) != null && g.on || (r = "stx");
    const u = [], h = Ae("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Ae("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fc(o.playsLeft, "play", "plays")} left.`));
    const l = dI(o.done);
    if (l && u.push(Ae("p", "ppp-restock__done", l)), o.arriving)
      u.push(Ae("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      u.push(Ae("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((x) => x.fits))
      u.push(Ae("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const x = Ae("div", "ppp-restock__packs");
      x.setAttribute("role", "group"), x.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const D = Ae("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        D.type = "button", D.disabled = !U.fits, D.setAttribute("aria-pressed", String(U.plays === n)), D.append(Ae("b", "", U.plays.toLocaleString()), Ae("span", "", "plays")), D.onclick = () => {
          n = U.plays, i();
        }, x.append(D);
      }
      u.push(x);
      const v = Ae("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const D = Ae("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        D.type = "button", D.disabled = !U.on, D.setAttribute("aria-pressed", String(U.id === r)), D.append(Ae("b", "", U.label), Ae("span", "", U.on ? U.blurb : "Soon")), D.onclick = () => {
          r = U.id, i();
        }, v.append(D);
      }
      u.push(v);
      const T = a.find((U) => U.plays === n);
      if (T && r === "stx") {
        const U = Ae("div", "ppp-restock__pay"), D = fI({ unit: "microSTX", amount: T.stx }), k = Ae("p", "ppp-restock__amount");
        k.append("Send ", Ae("b", "", D), " to your player:"), U.append(k, Ae("p", "ppp-addr-full ppp-restock__addr", o.address));
        const C = Ae("div", "ppp-restock__row");
        C.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => sr(T.stx), "")), U.append(C), U.append(Ae("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), u.push(U);
      }
    }
    u.push(Ae("p", "ppp-restock__why", "Every play pays whoever owns the song, directly. Nobody sits in between, and anyone can check it."));
    const y = Ae("button", "quiet ppp-connect__cancel", "Close");
    y.type = "button", y.onclick = () => e == null ? void 0 : e.close(), u.push(y), e.replaceChildren(...u);
  }
  return {
    isOpen: () => !!e,
    open() {
      if (e || !t.input()) return;
      e = Ae("dialog", "ppp-connect ppp-restock"), e.setAttribute("aria-labelledby", "ppp-restock-title");
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
const Kr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), pI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function gI(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = e(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: pI(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function yI(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Kr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function wI(t, e, n = "", r = 60) {
  const s = Kr(e).split(/\s+/).filter(Boolean), i = Kr(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of t) {
    const c = Kr(a.artist), u = Kr(a.title), h = String(a.id);
    if (i && c !== i) continue;
    let l = 0, y = !0;
    for (const g of s) {
      const x = g.replace(/^#/, "");
      if (u.includes(g)) l += u.startsWith(g) ? 0 : 1;
      else if (/^\d+$/.test(x) && h === x) l += 0;
      else if (c.includes(g)) l += 2;
      else if (/^\d+$/.test(x) && h.startsWith(x)) l += 3;
      else {
        y = !1;
        break;
      }
    }
    y && o.push({ s: a, rank: l });
  }
  return o.sort((a, c) => a.rank - c.rank || a.s.id - c.s.id), { songs: o.slice(0, r).map((a) => a.s), total: o.length };
}
const tr = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Cp = 12;
function bI(t, e) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = tr("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = tr("div", "hint"), u = tr("div", "find-artists"), h = tr("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const l = tr("div", "likesTools");
  l.append(a), t.replaceChildren(l, c, u, h), a.oninput = () => {
    s = a.value, g();
  };
  function y() {
    r === "loading" || r === "ready" || (r = "loading", g(), e.load().then((x) => {
      n = x, r = "ready", g();
    }, () => {
      r = "failed", g();
    }));
  }
  function g() {
    const x = e.locked();
    if (a.disabled = x, x) {
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
      const C = tr("button", "", "Try again");
      C.type = "button", C.onclick = () => {
        r = "idle", y();
      }, c.append(C), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = yI(n), T = o ? v : v.slice(0, Cp), U = (C, P, Y, ot = "") => {
      const X = tr("button", "find-chip" + (P ? " is-on" : ""), C);
      return X.type = "button", X.setAttribute("aria-pressed", String(P)), ot && (X.title = ot), X.onclick = Y, X;
    };
    u.replaceChildren(
      ...T.map((C) => U(`${C.name} · ${C.songs}`, Kr(C.name) === Kr(i), () => {
        i = Kr(C.name) === Kr(i) ? "" : C.name, g();
      }, `Show ${C.name}’s ${C.songs === 1 ? "song" : `${C.songs} songs`}`)),
      ...v.length > Cp ? [U(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, g();
      })] : []
    );
    const D = wI(n, s, i), k = e.current();
    h.replaceChildren(...D.songs.map((C) => {
      var ot;
      const P = tr("li", "lrow" + (C.id === k ? " now" : "")), Y = tr("button", "lt", C.title);
      if (Y.type = "button", Y.title = `Play “${C.title}”${C.artist ? ` by ${C.artist}` : ""}`, Y.onclick = () => e.play(C.id), (ot = e.explicit) != null && ot.call(e, C.id)) {
        const X = tr("span", "exp", "E");
        X.title = "Explicit lyrics: only plays when you choose it", Y.append(" ", X);
      }
      return P.append(Y, tr("span", "find-by", `${C.artist ? C.artist + " · " : ""}#${C.id}`)), P;
    })), c.textContent = !s.trim() && !i ? `${n.length.toLocaleString()} songs by ${v.length.toLocaleString()} artists. Search, or pick an artist.` : D.total === 0 ? "Nothing matches. Try fewer words, or pick an artist." : D.total > D.songs.length ? `Showing ${D.songs.length} of ${D.total.toLocaleString()}. Type more to narrow it down.` : `${D.total} ${D.total === 1 ? "song" : "songs"}${i ? ` by ${i}` : ""}. Tap one to play it.`;
  }
  return { load: y, refresh: g };
}
const ta = [
  { id: "diamond", name: "Diamond", min: 1e3, mark: "◆" },
  { id: "gold", name: "Gold", min: 500, mark: "★" },
  { id: "silver", name: "Silver", min: 250, mark: "✦" },
  { id: "bronze", name: "Bronze", min: 100, mark: "●" },
  { id: "classic", name: "Classic", min: 0, mark: "♪" }
], mI = (t) => typeof t == "string" && ta.some((e) => e.id === t), xI = (t) => ta.find((e) => e.id === t), SI = (t) => ta.find((e) => t >= e.min) ?? ta[ta.length - 1];
function EI(t, e = ur) {
  return SI(t <= Pe ? 0 : Number((t - Pe) / an(e)));
}
const Tp = document.getElementById("ppp");
Tp && AI(Tp);
function AI(t) {
  var Ks;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = Kb(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, b) => {
    const E = await fetch(f, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), d = await E.json().catch(() => ({}));
    if (!E.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${E.status}).`);
    return d;
  }, c = x5({
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
      const b = new Promise((p, A) => {
        o.addEventListener("load", () => p(), { once: !0 }), setTimeout(() => A(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = f + "/", i.replaceChildren(o), await b;
      const E = new Ub({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.prove", "listening.approveSession", "listening.prepareReturn"]), G = (p, A) => d.has(p) ? E.request(p, A) : Promise.race([
        E.request(p, A),
        new Promise((H, V) => setTimeout(() => V(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await G("listening.status"), { request: G };
    },
    chain: {
      verify: J6,
      balance: e5,
      account: t5,
      owner: n5,
      broadcast: r5,
      transaction: s5,
      confirmedNonce: async (f) => {
        const b = await _s(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (f, b) => J0({ ...b, network: "mainnet", stxAddress: f }),
    deposit: (f, b, E) => new Promise((d, G) => Y0({
      recipient: b,
      amount: E.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new tu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (p) => d(p.txId || ""),
      onCancel: () => G(new Error("Deposit cancelled. Nothing was sent.")),
      onError: G
    })),
    validate: i5,
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
    changed: () => ue(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var b, E;
      return u.funder(f, () => f5(f, _s), !!((E = (b = c.snapshot().gate) == null ? void 0 : b.gifts) != null && E.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const b = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), E = b == null ? void 0 : b.gift;
      if (!E) return null;
      if (typeof E.returnTo != "string" || typeof E.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: E.returnTo, from: typeof E.from == "string" ? E.from : null, source: String(E.source ?? ""), amount: String(E.amount ?? "0"), treasury: E.treasury, state: E.state === "sending" ? "sending" : "arrived", player: E.player ?? null };
    },
    history: (f, b) => p5(f, (E) => _s(E), b),
    likesChanged: () => {
      var f, b;
      (b = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || b.call(f);
    },
    likeState: async (f, b) => {
      const E = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(b) })), d = Array.isArray(E == null ? void 0 : E.rows) ? E.rows.find((G) => (G == null ? void 0 : G.id) === b) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((G) => typeof G == "string") : d.liked ? [f] : [] };
    },
    likeSent: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: b } })),
    nameOf: (f) => Yt(f) ?? void 0,
    likeConfirmed: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: b } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = S$({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, b, E, d) => new Promise((G, p) => Y0({
      recipient: b,
      amount: E.toString(),
      memo: d,
      stxAddress: f,
      network: new tu(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (A) => G(A.txId || ""),
      onCancel: () => p(new Error("Gift cancelled. Nothing was sent.")),
      onError: p
    })),
    sign: (f, b) => J0({ ...b, network: "mainnet", stxAddress: f }),
    giftSent: (f, b) => c.giftSent(f, b),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, b, E, d) => {
      h.invalidate(), await c.albumArriving(f, b, E, d);
    } },
    who: (f) => st(f),
    changed: () => ue(c.snapshot()),
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
  }), h = B$({
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
    changed: () => ue(c.snapshot())
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
  }, y = F$(location.search, l);
  y.on && (document.documentElement.dataset.novice = y.preview ? "preview" : "1");
  const g = (f) => y.on && f.solo, x = y.on || (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), v = x ? document.getElementById("album") : null, T = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (f) => void c.topUpAlbum(f),
    openPlayer: () => void c.openAlbum(0)
  }, U = v ? Ep(v, T) : null, D = "xtrata.radio.tier.v1";
  let k = (() => {
    const f = l.get(D);
    return mI(f) ? xI(f) : null;
  })();
  const C = (() => {
    try {
      return new URLSearchParams(location.search).get("mystery") === "1" && sessionStorage.setItem("xtrata.radio.mystery", "1"), sessionStorage.getItem("xtrata.radio.mystery") === "1";
    } catch {
      return !1;
    }
  })();
  function P(f) {
    if (f.listening && f.slot === 0 && ["fund", "ready", "over"].includes(f.step)) {
      let G = null;
      try {
        G = f.gift && !f.gift.player ? EI(BigInt(f.gift.amount)) : null;
      } catch {
        G = null;
      }
      ((G == null ? void 0 : G.id) ?? null) !== ((k == null ? void 0 : k.id) ?? null) && (k = G, l.set(D, G ? G.id : null));
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
    d || (d = S("span", "", "ppp-tier"), E.append(d)), d.dataset.tier = k.id, d.textContent = `${k.mark} ${k.name.toUpperCase()} PLAYER`, d.title = `A ${k.name} player from the Xtrata Music giveaway`;
  }
  const Y = y.on && v ? sI(v) : null, ot = Date.now();
  let X = !1, W = null, $ = (() => {
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
    ue(c.snapshot());
  }, m = (f, b) => {
    var G;
    if (!Y || b || $) return null;
    if (!f.gate || f.step === "loading" || (X = !0), !X) return Date.now() - ot < 1e4 ? "checking" : null;
    if (!g(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const d = f.slot === 0 && !((G = f.gift) != null && G.player) && !f.entries.some((p) => p.kind === "play");
    return f.step === "fund" && d ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && d && (W === "arriving" || W === "landed") ? "landed" : f.step === "loading" && W !== "checking" ? W : null;
  };
  let B = !1;
  function K(f, b, E = [], d) {
    if (!Y) return;
    const G = d !== void 0 ? d : m(f, b);
    if (W = G, delete document.documentElement.dataset.noviceBoot, !G) {
      Y.render(null, b);
      return;
    }
    const p = [...E];
    G === "arriving" && f.arrival && p.push(Qr(f.arrival)), f.step === "unsupported" ? p.push(S("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && p.push(S("p", f.error, "ppp-warn"));
    const A = G === "gift" ? u.incomingStarter() : null;
    A && !B && f.step === "intro" && !f.busy && !f.armed && !f.error && !Ee && (B = !0, c.create({ quick: !0 })), Y.render({
      mode: G,
      status: p,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !Ee,
      plays: A ? A.plays : G === "landed" ? f.playsLeft : null,
      from: (A == null ? void 0 : A.from) ?? null,
      tier: k,
      mystery: C,
      albums: G === "landed" ? Ot.map((H) => ({ title: H.title, by: H.subtitle, run: () => {
        _(), ae(H, !0);
      } })) : [],
      start: () => void c.create({ quick: !!u.incomingStarter() }),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => Z(),
      full: () => {
        var pt, R, et;
        const H = window.XtrataRadio, V = G === "landed" && !((R = (pt = H == null ? void 0 : H.getState) == null ? void 0 : pt.call(H)) != null && R.playing);
        _(), V && ((et = H == null ? void 0 : H.playPause) == null || et.call(H));
      }
    });
  }
  Y && setTimeout(() => {
    X || ue(c.snapshot());
  }, 10100);
  const at = hI({
    input: () => {
      var G, p, A, H;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const b = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (G = f.likeFunds) == null ? void 0 : G.balance };
      if (!b.address) return null;
      const E = f.slot === 0 ? f.entries : [], d = E.filter((V) => V.kind === "play" && V.status === "confirmed");
      return {
        playsLeft: b.balance === void 0 ? null : Zn(b.balance),
        balance: b.balance,
        incoming: 0n,
        fee: BigInt(((p = f.gate) == null ? void 0 : p.limits.playFee) ?? "300"),
        address: b.address,
        switches: ((A = f.gate) == null ? void 0 : A.restock) ?? {},
        done: d.length ? { plays: d.length, artists: new Set(d.map((V) => V.recipient)).size, likes: E.filter((V) => V.kind === "like" && V.status === "confirmed" && V.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((H = f.likeFunds) != null && H.pending)
      };
    },
    copyButton: (f, b, E, d) => jr(f, b, E, d, () => {
      ue(c.snapshot());
    })
  }), Z = () => {
    if (!c.snapshot().unproven) {
      at.open();
      return;
    }
    c.prove().then((f) => {
      f && at.open();
    });
  }, Et = document.getElementById("albumList"), L = Et ? Ep(Et, T, { list: !0 }) : null, O = "xtrata.radio.album.last.v1", ft = () => {
    try {
      const f = JSON.parse(localStorage.getItem(O) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let dt = "";
  const ht = (f) => {
    const b = JSON.stringify(f);
    if (b !== dt) {
      dt = b;
      try {
        localStorage.setItem(O, b);
      } catch {
      }
    }
  };
  let St = null;
  window.XtrataRadioLikeHandler = (f) => {
    var E;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (E = c.snapshot().likeFunds) != null && E.album && (Fe = !0), tn();
    const b = un(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let oe;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const At = (f) => {
    var E, d;
    const b = window.XtrataRadioListeningIdentity();
    b !== oe && (oe = b, (d = (E = window.XtrataRadio) == null ? void 0 : E.refreshLikes) == null || d.call(E));
  };
  let Ot = [], kt = 0, Be = !1, $t = null;
  const Nt = (f) => {
    var b, E;
    Be || !((E = (b = f.gate) == null ? void 0 : b.gifts) != null && E.enabled) || Date.now() - kt < 6e4 || (kt = Date.now(), a("/radio/gift/featured").then((d) => {
      Ot = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((G) => G && typeof G.id == "string" && typeof G.title == "string" && Array.isArray(G.tracks) && G.tracks.length > 0).slice(0, 6), Be = !0, Ot.length && ue(c.snapshot());
    }).catch(() => {
    }));
  }, ln = (f) => {
    var b;
    return $t && f.slot === 0 && !((b = f.gift) != null && b.player) && ["ready", "fund", "loading"].includes(f.step) ? $t : null;
  }, ae = (f, b = !1) => {
    var d, G;
    $t = f, ue(c.snapshot());
    const E = f && b ? Gr(f)[0] : null;
    E && ((G = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || G.call(d, E.id));
  };
  let Rt = lf(), kn = null;
  const He = (f) => {
    const b = y.preview && !Ee && f.step === "intro" ? u.incomingAlbum() : null;
    return b ? (Rt = Jl(Rt, { kind: "offer", album: b.player.id, already: wb(l).includes(b.player.id) }), ec(Rt) ? b.player : null) : (Rt = Jl(Rt, { kind: "withdraw" }), null);
  }, Qe = (f) => {
    const b = Rt.phase;
    Rt = Jl(Rt, f), Rt.phase !== b && (Rt.album && (Rt.phase === "playing" || Rt.phase === "done") && Y$(l, Rt.album), ue(c.snapshot()));
  };
  setInterval(() => {
    Rt.phase === "playing" && Qe({ kind: "tick", at: Date.now() });
  }, 5e3);
  let Ke = "", Ve, Oe = !1, Qt = !1;
  const Je = (f, b) => {
    var et, lt, nt, It, Kt, fe, de, Me;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const d = b.depositPending && f.step === "fund" && ((et = f.giftStop) == null ? void 0 : et.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, G = kn, p = d ? g(f) ? G$(d.reason, d.text) : d.text : null, A = G ? null : p ?? (e && (!((lt = f.gate) != null && lt.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    A && A !== Ve && (E.setGiftStop(A), Ve = A);
    const H = f.step === "off" || f.step === "elsewhere" ? null : ((nt = f.gift) == null ? void 0 : nt.player) ?? G ?? ln(f) ?? null, V = H ? H.id + ":" + H.cover + ":" + H.tracks.map((zn) => zn.id).join(",") : "";
    V !== Ke && (E.setGiftPlayer(H ? { id: H.id, title: H.title, subtitle: H.subtitle, tracks: Gr(H).map((zn) => zn.id), hidden: ((It = b$(H)) == null ? void 0 : It.id) ?? null, cover: H.cover } : null), Ke = V), A !== Ve && (E.setGiftStop(A), Ve = A);
    const pt = (d == null ? void 0 : d.reason) === "arriving";
    pt !== Qt && ((Kt = E.setGiftWait) == null || Kt.call(E, pt), Qt = pt);
    const R = !!H && (!!G || !!((fe = f.albumLock) != null && fe.locked));
    R !== Oe && ((de = E.setGiftLock) == null || de.call(E, R), Oe = R), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((Me = E.forgetWallets) == null || Me.call(E));
  };
  let Fe = !1;
  const $e = /* @__PURE__ */ new Map(), Se = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((d) => d.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let E = $e.get(f.listening);
    return E === void 0 && (E = Date.now(), $e.set(f.listening, E)), Date.now() - E < Dc ? E : null;
  }, ye = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((b) => b.kind === "play") && !!f.listening && $e.has(f.listening), bn = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", Zn = (f) => {
    const b = c.snapshot().playCost || 350n;
    return f > Pe ? Number((f - Pe) / b) : 0;
  }, I = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), z = (f) => {
    const b = Math.round((Date.now() - f) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, F = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, S = (f, b = "", E = "") => {
    const d = document.createElement(f);
    return b && (d.textContent = b), E && (d.className = E), d;
  }, tt = (f, b, E = "") => {
    const d = S("button", f, E);
    return d.type = "button", d.onclick = b, d;
  }, gt = (f, b) => {
    const E = S("a", f);
    return E.href = b, E.target = "_blank", E.rel = "noopener", E;
  };
  let Jt = null, ce = location.hash === "#give";
  ce && history.replaceState(null, "", location.pathname + location.search);
  let Dt = !1;
  const qt = r$((f) => n$({ address: f, network: "mainnet" }), () => ue(c.snapshot())), Yt = (f) => qt.get(f), Ee = U$(navigator.userAgent), Gt = (f, b) => {
    const E = navigator.userAgent, d = O$(E), G = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, p = [S("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${y.on ? "player" : "listening wallet"}${b ? y.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], A = S("div", "", "ppp-open-row"), H = H$(G, E);
    if (H) {
      const V = S("a", `Open in ${d}`, "primary ppp-open-in");
      V.href = H, V.dataset.homeAction = "radio:open-in-browser", A.append(V);
    }
    return A.append(jr("copy-page-link", "Copy link", () => G, H ? "" : "primary", () => ue(c.snapshot()))), p.push(A, S("p", `If that does not open ${d}, use ${f}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), p;
  }, st = (f) => Yt(f) ?? bn(f), Xt = (f) => f.slice(0, 2).map(st).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), le = /* @__PURE__ */ new Map();
  let De = !1;
  const pe = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), tn = () => {
    De || (De = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const b of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const E = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(E) && le.set(E, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      ue(c.snapshot());
    }).catch(() => {
      De = !1;
    }));
  }, un = (f, b) => {
    const E = le.get(f), d = dp(f, [E == null ? void 0 : E.title, b == null ? void 0 : b.title].find((p) => !pe(p)) || ""), G = up(f, (E == null ? void 0 : E.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: d, artist: G };
  }, Qn = (f) => {
    const { title: b, artist: E } = un(f.song, f);
    return b ? `“${b}”${E ? ` — ${E}` : ""}` : `Song #${f.song}${E ? ` — ${E}` : ""}`;
  }, Dn = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, $n = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function Co(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function In(f, b, E = "", d) {
    const G = S("dt", f), p = S("dd", b, E);
    return d && p.append(" ", d), [G, p];
  }
  const Pt = document.getElementById("ppp-top"), je = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Re = () => {
    var b;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (b = document.getElementById("radio-wallet-connect")) == null || b.click();
  }, Ds = () => {
    var b, E;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      Re();
      return;
    }
    if (f.step === "elsewhere" && ((b = f.gate) != null && b.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    if (f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((E = f.giftStop) == null ? void 0 : E.reason) === "off" && !f.busy && c.switchOn(), f.step === "fund" && f.solo && !f.depositPending && !f.busy) {
      Z();
      return;
    }
    je();
  };
  Pt && (Pt.onclick = Ds);
  const Wr = (f, b, E, d = "") => f.standIn && !f.mainConnected ? tt(`Connect ${st(f.standIn)} to add STX`, Re, d) : tt(b, E, d), Fn = (f) => {
    c.useLinked(f).then(() => je());
  };
  let Ln = null;
  const mn = () => {
    const f = Ap(c.snapshot(), st);
    return f.length ? Ln || (Ln = new Promise((b) => {
      var R;
      const E = S("dialog", "", "ppp-connect");
      E.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const G = (et) => {
        d = et, E.close();
      };
      E.addEventListener("close", () => {
        E.remove(), Ln = null, b(d);
      }), E.addEventListener("click", (et) => {
        et.target === E && G(null);
      });
      const p = (et, lt, nt, It, Kt = !1) => {
        const fe = S("button", "", "ppp-connect__opt " + nt);
        return fe.type = "button", fe.disabled = Kt, fe.onclick = It, fe.append(S("b", et), S("span", lt)), fe;
      }, A = S("h2", "Connect", "ppp-connect__title");
      A.id = "ppp-connect-title";
      const H = f.map((et) => p(et.label, et.detail, "is-music", () => {
        if (G("music"), et.action === "linked" && et.main) {
          Fn(et.main);
          return;
        }
        const lt = Ap(c.snapshot(), st).find((nt) => nt.action !== "linked");
        (lt == null ? void 0 : lt.action) === "create" ? c.create() : (lt == null ? void 0 : lt.action) === "unlock" && c.unlock(), je();
      }, !!et.disabled)), V = p("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => G("stacks")), pt = tt("Cancel", () => G(null), "quiet ppp-connect__cancel");
      E.append(A, ...H, V, pt), document.body.appendChild(E), E.showModal(), (R = H.find((et) => !et.disabled)) == null || R.focus();
    }), Ln) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = mn;
  function jn(f) {
    if (!Pt) return;
    const b = (d, G, p) => {
      Pt.hidden = !1, Pt.className = "ppp-top" + (G ? " is-" + G : ""), Pt.replaceChildren(S("span", "", "dot"), document.createTextNode(d)), Pt.title = p;
    }, E = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        Pt.hidden = !0;
        return;
      case "elsewhere":
        return b("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        Pt.hidden = !0;
        return;
      case "intro":
        return b("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return b(`Connect ${st(f.linked)}`, "warn", `This device's listening wallet belongs to ${st(f.linked)}. Connect that wallet to pay artists or like songs.`);
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
  const qe = document.getElementById("pppNudge"), Fs = document.getElementById("onair");
  (Ks = qe == null ? void 0 : qe.querySelector("button")) == null || Ks.addEventListener("click", () => Ds());
  const To = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Bo = {
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
  function Mo(f) {
    if (f.step === "loading") return;
    const b = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, E = f.step === "ready" && f.payingOn && b > 0 && !f.giftStop, d = f.step === "fund" && f.depositPending, G = f.step === "elsewhere" && !e, p = E || d || G ? "" : To[f.step] ?? "", A = E ? "on" : G ? "free" : p ? "off" : "";
    A ? document.documentElement.dataset.ppp = A : delete document.documentElement.dataset.ppp, Fs && (Fs.hidden = !A || A === "free", Fs.querySelector(".onair-sub").textContent = E ? `${b.toLocaleString()} plays left` : "Plays off"), qe && (qe.hidden = A !== "off" && A !== "free", qe.classList.toggle("is-free", A === "free"), A === "free" ? (qe.querySelector(".nudge-t").textContent = "You’re on the free player", qe.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", qe.querySelector("button").textContent = "Get a player") : A === "off" && (qe.querySelector(".nudge-t").textContent = p, qe.querySelector(".nudge-s").textContent = g(f) ? f.step === "intro" ? V$ : "" : "This radio requires a funded listening wallet with music support on.", qe.querySelector("button").textContent = Bo[f.step] ?? "Start"));
  }
  let Rn = "";
  function fn(f) {
    const b = S("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && b.append(S("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && b.append(S("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const E = S("input");
    E.type = "text", E.placeholder = "SP… address to send returns to", E.autocomplete = "off", E.spellcheck = !1, E.setAttribute("aria-label", "Address to return funds to"), E.value = Rn, E.oninput = () => {
      Rn = E.value;
    };
    const d = tt(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(E.value), Rn = "";
    }, "tiny");
    return b.append(E, " ", d), f.returnToKind === "chosen" && b.append(" ", tt("Back to the funder", () => c.clearReturnAddress(), "tiny")), b;
  }
  const No = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function _i() {
    const f = S("p", No + " ", "ppp-mute");
    return f.append(gt("Xverse", "https://www.xverse.app/download"), " · ", gt("Leather", "https://leather.io/install-extension")), f;
  }
  let Ui = "";
  const js = (f) => {
    const b = document.documentElement, E = f.solo && !f.main ? f.listening ? bn(f.listening) : "new" : "", d = k5() ? "1" : "", G = f.standIn && !f.mainConnected ? st(f.standIn) : "";
    `${E}|${d}|${G}` !== Ui && (Ui = `${E}|${d}|${G}`, E ? b.dataset.pppSolo = E : delete b.dataset.pppSolo, G ? b.dataset.pppAs = G : delete b.dataset.pppAs, d ? b.dataset.pppWalletInstalled = d : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => ue(c.snapshot()), f);
  function Zr(f, b = "") {
    const E = S("div", "", "ppp-topup"), d = Br(f);
    E.append(S("span", "Add plays from My player: ", "ppp-mute"));
    for (const G of uc) {
      const p = tt(`+${G.toLocaleString()}`, () => void c.topUpAlbum(G), b);
      p.disabled = d === void 0 || d < G || f.depositPending || !!f.busy, E.append(p);
    }
    return d !== void 0 && d < uc[0] && E.append(S("p", "My player needs plays first (switch to My player above).", "ppp-mute")), E;
  }
  const Br = (f) => {
    var d;
    const b = (d = f.likeFunds) == null ? void 0 : d.balance;
    if (b === void 0 || !f.playCost) return;
    const E = b - Pe - 6000n;
    return E > 0n ? Number(E / f.playCost) : 0;
  };
  function fr(f) {
    const b = f.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    if (b.low || (Fe = !1), b.low && !Fe) return [];
    const E = S("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      if (!b.txid) return [];
      const G = S("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return b.txid && G.append(gt("View", F(b.txid))), E.append(G), [E];
    }
    E.append(S("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), E.append(S("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), E.append(S("p", b.address, "ppp-addr-full"));
    const d = S("div", "", "ppp-open-row");
    if (d.append(jr("copy-likes-address", "Copy address", () => b.address, "primary", () => ue(c.snapshot()))), b.main && !f.solo) {
      const G = Bs - (b.balance ?? 0n);
      G > 0n && d.append(Wr(f, `Pay ${sr(G)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return E.append(d), E.append(S("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [E];
  }
  const Qr = (f) => {
    const b = S("div", "", "ppp-wait");
    b.dataset.since = String(f.since), b.dataset.grace = String(f.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const E = S("p", "", "ppp-wait-t"), d = S("div", "", "ppp-wait-track");
    return d.append(S("div", "", "ppp-wait-fill")), b.append(E, d), dr(b), b;
  };
  function dr(f) {
    const b = Number(f.dataset.since), E = Number(f.dataset.grace) || 6e4, d = Math.max(0, Date.now() - b), G = f.querySelector(".ppp-wait-fill"), p = f.querySelector(".ppp-wait-t");
    if (d < E) {
      const A = Math.ceil((E - d) / 1e3);
      G.style.width = Math.max(4, Math.min(95, d / E * 100)).toFixed(0) + "%", p.textContent = `Your plays are arriving… usually about a minute · ${A}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(d / E * 100)));
    } else
      G.style.width = "", p.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let Rs = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      Rs = 0;
      return;
    }
    f.forEach(dr), ++Rs % 10 === 0 && ue(c.snapshot());
  }, 1e3);
  let Mr = null;
  function Hi(f) {
    if (f.step === "loading" && Mr !== null) return;
    const E = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    E !== Mr && (Mr = E, E ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function ue(f) {
    var kd, $d, Id, Ld, Cd, Td, Bd, Md, Nd, Pd, _d, Ud, Hd, Od, Dd, Fd;
    if (St && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const q = St;
      St = null, f.root === q.root && f.slot !== q.slot && c.openAlbum(q.slot);
    }
    const b = u.inProgress(f), E = Se(f), d = b && f.step === "fund" ? { ...f, depositPending: !0 } : E !== null ? { ...f, depositPending: !0, arrival: { since: E, graceMs: Dc } } : f, G = d.error === Fc;
    if (At(), Nt(f), P(f), kn = He(f), Je(f, d), Hi(d), js(d), !b && u.inProgress(f)) return;
    if (jn(d), Mo(d), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? y.on ? q$ : "Checking your listening wallet…" : y.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = d.step === "off", t.hidden) {
      K(d, !1);
      return;
    }
    const [p, A] = Co(d), H = s(".ppp-state");
    H.textContent = p, H.className = "ppp-state" + (A ? " ppp-state--" + A : ""), H.hidden = !p;
    const V = !!d.busy || d.armed, pt = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (V || !["intro", "loading"].includes(d.step));
    i.hidden = !pt, i.classList.toggle("ppp-frame--rest", !V && !Dt);
    const R = s(".ppp-frame-label");
    R.hidden = !0;
    const et = S5(d) ?? Jt;
    Jt = et;
    const lt = "xtrata.radio.ppp.heard.v1", nt = (() => {
      try {
        return localStorage.getItem(lt) === "1";
      } catch {
        return !1;
      }
    })();
    if (!nt && d.entries.some((q) => q.kind === "play"))
      try {
        localStorage.setItem(lt, "1");
      } catch {
      }
    const It = nt || d.slot > 0 && ((((kd = d.likeFunds) == null ? void 0 : kd.balance) ?? 0n) > 0n || h.count() > 1), Kt = g(d), fe = !Kt && A5({ ...d, heard: It }, et);
    s(".ppp-badge").hidden = !fe;
    const de = s(".ppp-steps"), Me = s(".ppp-stage");
    de.hidden = Me.hidden = !fe, et && fe && (de.replaceChildren(...sf(d.solo).map((q, rt) => {
      const xt = S("li", "", rt < et.at ? "done" : rt === et.at ? et.blocked ? "now blocked" : "now" : "");
      return xt.append(S("span", rt < et.at ? "✓" : String(rt + 1), "n"), q), rt === et.at && xt.setAttribute("aria-current", "step"), xt;
    })), Me.textContent = et.caption, Me.className = "ppp-stage " + (et.at >= sf(d.solo).length ? "ppp-ok" : et.blocked ? "ppp-bad" : "ppp-cyan"));
    const zn = s(".ppp-facts"), Cn = [];
    d.main && (($d = d.gate) != null && $d.here) && !d.solo && Cn.push(...In("Your wallet", st(d.main), "ppp-addr-short"));
    const _o = () => {
      if (!d.listening) return;
      const q = jr("copy-listening", "Copy", () => d.listening || "", "tiny", () => ue(c.snapshot()));
      Cn.push(...In(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", bn(d.listening), "ppp-addr-short", q));
    };
    if (d.linked || _o(), d.listening && d.step !== "intro")
      if (d.linked)
        Cn.push(...In("Credited to", `${st(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), _o();
      else if (d.solo) {
        d.creditedTo && Cn.push(...In("Credited to", `${st(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const q = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${st(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Cn.push(...In("Returns go to", d.gift ? q : d.returnTo && !Yt(d.returnTo) ? q.replace(bn(d.returnTo), d.returnTo) : q, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Cn.push(...In("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && ((Id = d.gate) != null && Id.here)) {
      const q = d.linkedListening.map((rt) => bn(rt) + (rt === d.listening ? " (this one)" : "")).join(", ");
      Cn.push(...In(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", q, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const q = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Cn.push(...In("Balance", `${sr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, q));
    }
    const Vs = d.entries.find((q) => q.kind === "play");
    Vs && tn(), Vs && Cn.push(...In("Last paid song", `${Qn(Vs)} → ${st(Vs.recipient)}`, Dn[Vs.status] || "")), zn.replaceChildren(...Cn), zn.hidden = !Cn.length;
    const wt = [], Wt = [], te = [], xn = [], Sa = an(BigInt(((Ld = d.gate) == null ? void 0 : Ld.limits.playFee) ?? "300")), w = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${sr(Hc)} STX to the song holder, plus a ${sr(Sa - Hc)} STX network fee.`, M = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (wt.push(S("p", "Pay artists as you listen.")), (Cd = d.gate) != null && Cd.radioUrl) {
          const rt = S("p");
          rt.append(gt("Open the pay-per-play radio →", d.gate.radioUrl)), wt.push(rt);
        }
        Wt.push(S("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const rt = [d.linked, ...d.others];
          wt.push(S("p", rt.length > 1 ? `This device has listening wallets for ${Xt(rt)}.` : `This device has a listening wallet for ${st(d.linked)}.`)), Wt.push(S("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), rt.slice(0, 3).forEach((xt, ne) => te.push(tt(`Open ${st(xt)}`, () => Fn(xt), ne === 0 ? "primary" : "")));
        } else
          wt.push(S("p", "Connect your wallet to pay artists as you listen.")), Wt.push(S("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        wt.push(S("p", `This device's listening wallet belongs to ${st(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), Wt.push(S("p", `You are connected as ${st(d.main)}. Switch to the linked wallet to continue listening.`)), Wt.push(S("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), te.push(tt("Switch wallet", Re, "primary"));
        break;
      case "not-invited":
        wt.push(S("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        wt.push(S("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        wt.push(S("p", "Every play counts for the song’s owner, on-chain.")), Wt.push(S("p", w)), Wt.push(S("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), Wt.push(S("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (wt.push(S("p", `This device already has a listening wallet for ${Xt(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), Wt.push(S("p", `Otherwise, set up a new listening wallet for ${st(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && Wt.push(S("p", `This is the listening wallet for ${st(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && Wt.push(S("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const q = u.liveGift();
        te.push(tt(q ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${st(d.main)}` : "Start listening", () => void c.create(), "primary")), !q && !d.solo && d.main && d.others.length && te.push(tt("Switch wallet", Re)), !q && d.solo && te.push(tt("I have a Stacks wallet", Re)), te.push(tt("I already have a listening wallet", () => void c.unlock(!0))), q && te.push(tt("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (wt.push(S("p", "Locked.", "ppp-mute")), te.push(tt("Unlock", () => void c.unlock(), "primary"))), d.standIn ? xn.push(tt("Use a different listening wallet", () => void mn().then((rt) => {
          rt === "stacks" && Re();
        }), "quiet")) : xn.push(tt("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        wt.push(S("p", `Link to ${st(d.main)} · free`)), Wt.push(S("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), Wt.push(S("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), te.push(tt(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        wt.push(S("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && wt.push(Qr(d.arrival)) : ye(d) ? wt.push(S("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Td = d.gift) != null && Td.player ? wt.push(S("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? wt.push(S("p", "No plays left · add plays to keep counting", "ppp-bad")) : wt.push(S("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Sa)).toLocaleString()} plays`)), d.entries.length && Wt.push(S("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && Wt.push(S("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b ? Wt.push(S("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? Wt.push(S("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (Wt.push(S("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), Wt.push(S("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && te.push(jr("copy-address", "Copy my address", () => d.listening || "", "primary", () => ue(c.snapshot())))) : Wt.push(S("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const rt = S("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append(gt("View", F(d.depositTxid))), wt.push(rt);
        } else d.allowance > 0n && !d.solo && !d.depositPending && te.push(Wr(d, `Deposit ${sr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        wt.push(S("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (wt.push(S("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), wt.push(fn(d))), (!d.solo || d.returnTo) && te.push(tt("Return excess", () => void c.returnFunds("excess"), "primary"), tt("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((Bd = d.giftStop) == null ? void 0 : Bd.reason) !== "off") {
          const rt = Math.min(d.session.playsLeft, d.playsLeft);
          wt.push(S("p", `${rt.toLocaleString()} plays left`, "ppp-ok")), Wt.push(S("p", w + " The heart likes or unlikes from this wallet for 0.0002 STX.")), te.push(tt("Switch off", () => void c.switchOff()));
        } else
          wt.push(S("p", "Switch on music support to listen.", "ppp-mute")), te.push(tt("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && wt.push(S("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && wt.push(S("p", "Running low on plays", "ppp-warn")), d.depositPending ? wt.push(S("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && te.push(Wr(d, `Top up ${sr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const q = d.step === "fund", rt = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      q ? te.unshift(tt("Add plays", () => Z(), "primary")) : rt ? te.push(tt("Add plays", () => Z(), "primary")) : d.step === "ready" && xn.push(tt("Add plays", () => Z(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && Wt.push(S("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && Wt.push(fn(d)), Wt.push(_i()), d.slot === 0 && d.step === "ready" && d.entries.some((q) => q.kind === "play" && q.status === "confirmed"))) {
      const q = S("p", "New to Stacks? ", "ppp-mute");
      q.append(gt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), wt.push(q);
    }
    if (d.walletOutdated && Wt.push(S("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (wt.push(S("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), te.push(tt("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && xn.push(tt(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${st(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((Md = d.gift) != null && Md.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && xn.push(Zr(d, "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && xn.push(tt("Lock", () => void c.lock(), "quiet")), pt && !V && xn.push(tt(Dt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      Dt = !Dt, ue(c.snapshot());
    }, "quiet")), [...te, ...xn].forEach((q) => q.disabled = M), M && (te.length = 0), !Kt && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Nd = d.gift) != null && Nd.player)) {
      const q = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = wt.at(0);
      d.step === "ready" && rt ? rt.append(S("span", ` · ${I(d.balance)} STX`, q)) : wt.push(S("p", `Balance ${I(d.balance)} STX`, q));
    }
    if (Kt) {
      for (const xt of [...te, ...xn]) {
        const ne = R$[xt.textContent ?? ""];
        ne && (xt.textContent = ne);
      }
      for (let xt = wt.length - 1; xt >= 0; xt--) kp(wt[xt].textContent) && Wt.unshift(...wt.splice(xt, 1));
      for (let xt = te.length - 1; xt >= 0; xt--) kp(te[xt].textContent) && xn.unshift(...te.splice(xt, 1));
      const q = d.entries.some((xt) => xt.kind === "play"), rt = K$(d.step, { played: q, arriving: d.depositPending });
      rt.length && wt.length && rt.shift(), wt.push(...rt.map((xt) => S("p", xt, "ppp-mute")));
    }
    if ((Pd = d.gift) != null && Pd.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const q = S("p", "", "ppp-gift");
      q.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && q.append(" · ", d.gift.player.subtitle);
      const rt = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? S("span", " · plays on their way", "ppp-warn") : S("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      rt && q.append(rt);
      const xt = (_d = wt.at(0)) == null ? void 0 : _d.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && xt && /STX/.test(xt.textContent ?? "") && xt.remove(), wt.unshift(q), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          wt.splice(1, 0, S("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Zr(d, "primary"));
        else {
          const ne = S("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ne.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ne.append(gt("Xverse", "https://www.xverse.app/download"), " and ", gt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), wt.splice(1, 0, ne);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const q = d.returnPlan, rt = S("div", "", "ppp-pick");
      rt.append(S("p", q.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const xt = S("ul", "", "ppp-gift-list");
      q.steps.forEach((ne, ns) => {
        const rs = ne.kind === "gift" ? "the unused gift" : ne.kind === "deposit" ? "what was added to it" : "the rest", Sn = S("li");
        Sn.append(S("span", `${ns + 1}. ${sr(BigInt(ne.send))} STX · ${rs}`, "t"), S("span", ne.to ? ` → ${st(ne.to)}` : " → choose an address below", ne.to ? "ppp-mute" : "ppp-warn")), xt.append(Sn);
      }), rt.append(xt), q.kept && rt.append(S("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), q.steps.some((ne) => !ne.to) && rt.append(fn(d)), rt.append(tt(q.steps.length > 1 ? `Confirm part 1 of ${q.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), wt.push(rt);
    }
    const j = Po(d), ut = x ? j : null, we = m(d, !!ut), nn = we === "gift" || we === "arriving" || we === "new", Tn = u.banner(f, { bare: !!ut || we === "gift" || we === "arriving" }), ze = Ee && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? Gt(Ee, u.pendingCode()) : [];
    ut || (wt.unshift(...Tn), wt.push(...fr(d)), wt.unshift(...ze)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && wt.unshift(S("p", `This is ${st(d.creditedTo)}'s listening wallet. Plays and likes count for ${st(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...wt);
    const Fi = document.querySelector(".ppp-switch");
    if (Fi) {
      const q = h.latest(), rt = d.slot > 0, xt = ["fund", "ready", "over"].includes(d.step) && (rt || !!q);
      if (Fi.hidden = !xt, xt) {
        const ne = (Sn, Ea, Aa, ml) => {
          const Ri = tt("", ml, "ppp-tab");
          return Ri.setAttribute("aria-pressed", String(Aa)), Ri.append(S("span", Sn, "tt"), S("span", Ea === void 0 ? "…" : `${Zn(Ea).toLocaleString()} plays`, "ts")), Ri.disabled = !!d.busy, Ri;
        }, ns = rt ? ((Hd = (Ud = d.gift) == null ? void 0 : Ud.player) == null ? void 0 : Hd.title) ?? "Album" : q.title, rs = tt("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const Sn = document.querySelector(".ppp-shelf");
          Sn && (Sn.hidden = !1, Sn.open = !Sn.open, rs.setAttribute("aria-expanded", String(Sn.open)), Sn.open && requestAnimationFrame(() => Sn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        rs.setAttribute("aria-expanded", String(!!((Od = document.querySelector(".ppp-shelf")) != null && Od.open))), Fi.replaceChildren(
          ne("🎧 My player", rt ? (Dd = d.likeFunds) == null ? void 0 : Dd.balance : d.balance, !rt, () => {
            rt && c.openAlbum(0);
          }),
          ne("💿 " + ns, rt ? d.balance : void 0, rt, () => {
            !rt && q && c.openAlbum(q.slot);
          }),
          rs
        );
      }
    }
    const Jn = h.render(d), qs = document.querySelector(".ppp-shelf");
    if (qs) {
      qs.hidden = !Jn;
      const q = qs.querySelector("summary");
      q && (q.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const rt = qs.querySelector(".ppp-shelf-body");
      Jn && rt && !rt.contains(Jn) && rt.replaceChildren(Jn);
    }
    const ts = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !ts, ts && !s(".ppp-gift-body").contains(ts) && s(".ppp-gift-body").replaceChildren(ts), ts && ce) {
      ce = !1;
      const q = s(".ppp-gifts");
      q.open = !0, requestAnimationFrame(() => q.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const ji = document.querySelector("#ppp .ppp-featured");
    if (ji) {
      const q = Ot.length > 0 && d.slot === 0 && !((Fd = d.gift) != null && Fd.player) && d.step === "ready";
      ji.hidden = !q, q && ji.replaceChildren(S("p", "Albums in your player", "ppp-featured__h"), ...Ot.map((rt) => {
        const xt = ($t == null ? void 0 : $t.id) === rt.id, ne = tt("", () => ae(xt ? null : rt, !xt), "ppp-featured__a" + (xt ? " is-on" : "")), ns = Gr(rt).length;
        return ne.append(S("b", rt.title), S("span", xt ? "Playing now · tap to go back to the radio" : `${rt.subtitle ? rt.subtitle + " · " : ""}${ns} ${ns === 1 ? "song" : "songs"}`)), ne.setAttribute("aria-pressed", String(xt)), ne.disabled = !!d.busy, ne;
      }));
    }
    const Ys = document.querySelector("#ppp .ppp-yours");
    if (Ys) {
      const q = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      Ys.hidden = !q;
      const rt = Ys.querySelector(".ppp-yours-body");
      if (q && rt && rt.getAttribute("data-for") !== d.listening) {
        rt.setAttribute("data-for", d.listening);
        const xt = (ml, ...Ri) => {
          const jd = S("details", "", "ppp-yours-item");
          return jd.append(S("summary", ml), ...Ri), jd;
        }, ne = S("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ne.append(S("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const ns = S("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), rs = S("p");
        rs.append(gt("Find a name at BNS One →", "https://bns.one"));
        const Sn = S("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ea = S("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Aa = S("p");
        Aa.append(gt("See the giveaway →", "https://xtrata.xyz/giveaway")), rt.replaceChildren(
          xt("Give your player a name", ne, ns, S("p", d.listening, "ppp-addr-full"), jr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => ue(c.snapshot())), rs),
          xt("Link it to a wallet you already have", Sn),
          xt("Bring a friend in", Ea, Aa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...Wt), s(".ppp-actions").replaceChildren(...te), s(".ppp-actions2").replaceChildren(...xn);
    const es = d.busy || d.message || "", Sd = s(".ppp-msg"), bl = es && wt.some((q) => (q.textContent ?? "").startsWith(es.replace(/[.✓\s]+$/, ""))) ? "" : es, Ed = !bl && !d.error ? d.notice : G && !bl ? d.error : "";
    Sd.textContent = bl || Ed, Sd.classList.toggle("is-warn", !!Ed), s(".ppp-err").textContent = G ? "" : d.error;
    const xb = d.entries.filter((q) => q.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...xb.slice(0, 5).map((q) => {
      const rt = S("li"), xt = q.status === "confirmed" ? "ok" : q.status === "failed" ? "bad" : "warn";
      return rt.append(S("span", "", "d " + xt), S("span", Qn(q), "t"), S("span", z(q.created), "ppp-mute")), q.txid && rt.append(gt("tx", F(q.txid))), rt;
    })), s(".ppp-wallets").hidden = !(zn.childElementCount || xn.length), s(".ppp-more").hidden = !Wt.length;
    const Ad = s(".ppp-history");
    Ad.hidden = !d.entries.length, d.entries.length && tn(), Ad.replaceChildren(S("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((q) => {
      const rt = S("div", "", "ppp-row"), xt = q.kind === "play" ? [S("span", Qn(q), "ppp-song"), S("span", ` · ${sr(BigInt(q.amount))} STX to ${st(q.recipient)}`, "ppp-mute")] : q.kind === "like" ? [S("span", `${q.liked ? "♥ Liked" : "Unliked"} ${Qn(q)}`, "ppp-song"), S("span", ` · for ${d.linked ? st(d.linked) : "this listening wallet"}`, "ppp-mute")] : [S("span", `Returned ${sr(BigInt(q.amount))} STX`, "ppp-song"), S("span", ` to ${st(q.recipient)}`, "ppp-mute")];
      return rt.append(
        S("span", $n[q.status] || q.status, "ppp-status " + (Dn[q.status] || "")),
        ...xt,
        S("span", ` · ${new Date(q.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), q.txid && rt.append(gt("tx ↗", F(q.txid))), rt;
    })), U == null || U.render(ut ? zs(d, ut, [...ze, ...Tn]) : null), K(d, !!ut, nn ? [...ze, ...Tn] : ze, we), at.isOpen() && at.refresh(), Di();
    const vd = (j == null ? void 0 : j.mode) === "open" ? null : ln(d);
    L == null || L.render((j == null ? void 0 : j.mode) === "open" ? zs(d, j, []) : vd ? { ...zs(d, { mode: "open", player: vd }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function Po(f) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((d = f.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && ht({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const b = u.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const E = ft();
    return E && (f.step === "locked" || St && f.step === "loading") ? { mode: "locked", player: E.player } : null;
  }
  function zs(f, b, E) {
    var V, pt, R, et, lt;
    const d = !!f.busy || f.armed, G = [...E];
    f.depositPending && f.arrival && G.push(Qr(f.arrival)), f.error ? G.push(S("p", f.error, f.error === Fc ? "ppp-warn" : "ppp-bad")) : f.message && !d ? G.push(S("p", f.message, "ppp-cyan")) : f.notice && G.push(S("p", f.notice, "ppp-warn")), b.mode === "open" && Fe && ((V = f.likeFunds) != null && V.album) && f.likeFunds.low && !f.likeFunds.pending && G.push(S("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let p = "Kept on this device with Face ID or your passkey. No app or account needed.", A = null, H = null;
    if (b.mode === "locked")
      A = { label: "Continue listening", run: () => {
        St = ft(), c.unlock();
      } }, H = { label: "Use a different passkey", run: () => {
        St = null, c.unlock(!0);
      } };
    else if (b.mode === "arrive")
      if (f.step === "intro" && ec(Rt) && Rt.album === b.player.id) {
        const nt = window.XtrataRadio, It = Gr(b.player)[0], Kt = Rt.phase === "playing";
        A = { label: Kt && !!((R = (pt = nt == null ? void 0 : nt.getState) == null ? void 0 : pt.call(nt)) != null && R.playing) ? "Pause" : Kt ? "Carry on" : "Play the first song", run: () => {
          var de, Me;
          Kt ? (de = nt == null ? void 0 : nt.playPause) == null || de.call(nt) : It && ((Me = nt == null ? void 0 : nt.playToken) == null || Me.call(nt, It.id));
        } }, H = { label: "Make my player and hear it all", run: () => void c.create() }, p = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const nt = Rt.phase === "done" && Rt.album === b.player.id;
        nt && !G.length && G.push(S("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), A = { label: nt ? "Keep listening" : "Open album", run: () => void c.create() }, H = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (A = { label: "Open album", run: () => void c.unlock() }, H = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? G.push(S("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : G.length || G.push(S("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: b.mode,
      player: b.player,
      from: b.from,
      offered: b.offered,
      plays: b.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: G,
      primary: A,
      secondary: H,
      hint: A ? p : void 0,
      asking: d,
      busy: !!f.busy,
      myPlays: Br(f),
      topUps: uc,
      canMake: !!((lt = (et = f.gate) == null ? void 0 : et.gifts) != null && lt.admin)
    };
  }
  const en = document.getElementById("findBox"), Gs = document.getElementById("findBody"), ge = en && Gs ? bI(Gs, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : Promise.reject(new Error("catalogue unavailable"))).then((f) => gI(f == null ? void 0 : f.tracks, (b, E) => ({ title: dp(b, pe(E.title) ? "" : E.title), artist: up(b, E.artist || "") }))),
    play: (f) => {
      var b, E;
      (E = (b = window.XtrataRadio) == null ? void 0 : b.playToken) == null || E.call(b, f);
    },
    current: () => {
      var b, E, d, G;
      const f = Number((G = (d = (E = (b = window.XtrataRadio) == null ? void 0 : b.getState) == null ? void 0 : E.call(b)) == null ? void 0 : d.nowPlaying) == null ? void 0 : G.tokenId);
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
  en == null || en.addEventListener("toggle", () => {
    en.open && (ge == null || ge.load());
  });
  let Oi = "";
  const Di = () => {
    var b, E, d, G, p;
    if (!ge || !(en != null && en.open)) return;
    const f = `${!!((b = c.snapshot().albumLock) != null && b.locked)}|${((p = (G = (d = (E = window.XtrataRadio) == null ? void 0 : E.getState) == null ? void 0 : d.call(E)) == null ? void 0 : G.nowPlaying) == null ? void 0 : p.tokenId) ?? ""}`;
    f !== Oi && (Oi = f, ge.refresh());
  }, Nr = /* @__PURE__ */ new Map();
  let Jr = !1;
  const Pr = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((b) => {
      const E = b == null ? void 0 : b.nowPlaying;
      if (E && Number.isSafeInteger(Number(E.tokenId)) && Nr.set(Number(E.tokenId), { title: E.title || void 0, artist: E.artist || void 0 }), Di(), ec(Rt)) {
        const d = !!(b != null && b.playing);
        Qe({ kind: "now", track: E && E.tokenId != null ? String(E.tokenId) : null, playing: d, at: Date.now() }), d !== Jr && (Jr = d, ue(c.snapshot()));
      }
    }), !0) : !1;
  };
  if (!Pr()) {
    const f = setInterval(() => {
      Pr() && clearInterval(f);
    }, 500);
    setTimeout(() => clearInterval(f), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (f) => {
    const b = f.detail;
    if (ec(Rt) && Qe({ kind: "listened", at: Date.now() }), b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      tn();
      const E = un(b.song, Nr.get(b.song));
      c.onListened({ song: b.song, id: b.id, title: E.title || void 0, artist: E.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const vI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", kI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, $I = () => kI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, II = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, LI = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', mb = class {
  constructor(t) {
    pv(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && PS(t), this.callback(nl(t));
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
    const t = $I(), e = II(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return vt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, vt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), vt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, vt("div", { class: "flex flex-col space-y-[10px]" }, vt("div", { class: "flex items-center" }, vt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), vt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, vt("span", { class: "sr-only" }, "Close popup"), vt("img", { src: vI }))), r ? vt("p", null, "Select the wallet you want to connect to.") : vt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && vt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && vt("div", { class: "mt-6" }, vt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), vt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => vt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, vt("div", { class: "aspect-square basis-9 overflow-hidden" }, vt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), vt("div", { class: "flex-1" }, vt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && vt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), vt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && vt("div", { class: "mt-6" }, r ? vt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : vt("div", { class: "mb-5 flex justify-between" }, vt("p", { class: "text-sm font-medium" }, "Recommended wallets"), vt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, vt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, vt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), vt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), vt("p", null, "What is a wallet? ", vt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), vt("ul", { class: "space-y-3" }, n.map((i) => vt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, vt("div", { class: "aspect-square basis-9 overflow-hidden" }, vt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), vt("div", { class: "flex-1" }, vt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && vt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && vt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return XA(this);
  }
};
mb.style = LI;
const CI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: mb
}, Symbol.toStringTag, { value: "Module" }));
