var wb = Object.defineProperty;
var bb = (t, e, n) => e in t ? wb(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Po = (t, e, n) => bb(t, typeof e != "symbol" ? e + "" : e, n);
var gn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ip(t) {
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
        var _ = {
          next: function() {
            var x = $.shift();
            return { done: x === void 0, value: x };
          }
        };
        return r.iterable && (_[Symbol.iterator] = function() {
          return _;
        }), _;
      }
      function h($) {
        this.map = {}, $ instanceof h ? $.forEach(function(_, x) {
          this.append(x, _);
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
        var x = this.map[$];
        this.map[$] = x ? x + ", " + _ : _;
      }, h.prototype.delete = function($) {
        delete this.map[a($)];
      }, h.prototype.get = function($) {
        return $ = a($), this.has($) ? this.map[$] : null;
      }, h.prototype.has = function($) {
        return this.map.hasOwnProperty(a($));
      }, h.prototype.set = function($, _) {
        this.map[a($)] = c(_);
      }, h.prototype.forEach = function($, _) {
        for (var x in this.map)
          this.map.hasOwnProperty(x) && $.call(_, this.map[x], x, this);
      }, h.prototype.keys = function() {
        var $ = [];
        return this.forEach(function(_, x) {
          $.push(x);
        }), u($);
      }, h.prototype.values = function() {
        var $ = [];
        return this.forEach(function(_) {
          $.push(_);
        }), u($);
      }, h.prototype.entries = function() {
        var $ = [];
        return this.forEach(function(_, x) {
          $.push([x, _]);
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
        return new Promise(function(_, x) {
          $.onload = function() {
            _($.result);
          }, $.onerror = function() {
            x($.error);
          };
        });
      }
      function g($) {
        var _ = new FileReader(), x = y(_);
        return _.readAsArrayBuffer($), x;
      }
      function S($) {
        var _ = new FileReader(), x = y(_), M = /charset=([A-Za-z0-9_-]+)/.exec($.type), K = M ? M[1] : "utf-8";
        return _.readAsText($, K), x;
      }
      function v($) {
        for (var _ = new Uint8Array($), x = new Array(_.length), M = 0; M < _.length; M++)
          x[M] = String.fromCharCode(_[M]);
        return x.join("");
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
          return this.text().then(P);
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
        var x = _.body;
        if ($ instanceof C) {
          if ($.bodyUsed)
            throw new TypeError("Already read");
          this.url = $.url, this.credentials = $.credentials, _.headers || (this.headers = new h($.headers)), this.method = $.method, this.mode = $.mode, this.signal = $.signal, !x && $._bodyInit != null && (x = $._bodyInit, $.bodyUsed = !0);
        } else
          this.url = String($);
        if (this.credentials = _.credentials || this.credentials || "same-origin", (_.headers || !this.headers) && (this.headers = new h(_.headers)), this.method = k(_.method || this.method || "GET"), this.mode = _.mode || this.mode || null, this.signal = _.signal || this.signal || function() {
          if ("AbortController" in n) {
            var N = new AbortController();
            return N.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && x)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(x), (this.method === "GET" || this.method === "HEAD") && (_.cache === "no-store" || _.cache === "no-cache")) {
          var M = /([?&])_=[^&]*/;
          if (M.test(this.url))
            this.url = this.url.replace(M, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
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
        return $.trim().split("&").forEach(function(x) {
          if (x) {
            var M = x.split("="), K = M.shift().replace(/\+/g, " "), N = M.join("=").replace(/\+/g, " ");
            _.append(decodeURIComponent(K), decodeURIComponent(N));
          }
        }), _;
      }
      function X($) {
        var _ = new h(), x = $.replace(/\r?\n[\t ]+/g, " ");
        return x.split("\r").map(function(M) {
          return M.indexOf(`
`) === 0 ? M.substr(1, M.length) : M;
        }).forEach(function(M) {
          var K = M.split(":"), N = K.shift().trim();
          if (N) {
            var nt = K.join(":").trim();
            try {
              _.append(N, nt);
            } catch (Z) {
              console.warn("Response " + Z.message);
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
        e.DOMException = function(_, x) {
          this.message = _, this.name = x;
          var M = Error(_);
          this.stack = M.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function W($, _) {
        return new Promise(function(x, M) {
          var K = new C($, _);
          if (K.signal && K.signal.aborted)
            return M(new e.DOMException("Aborted", "AbortError"));
          var N = new XMLHttpRequest();
          function nt() {
            N.abort();
          }
          N.onload = function() {
            var L = {
              statusText: N.statusText,
              headers: X(N.getAllResponseHeaders() || "")
            };
            K.url.indexOf("file://") === 0 && (N.status < 200 || N.status > 599) ? L.status = 200 : L.status = N.status, L.url = "responseURL" in N ? N.responseURL : L.headers.get("X-Request-URL");
            var D = "response" in N ? N.response : N.responseText;
            setTimeout(function() {
              x(new it(D, L));
            }, 0);
          }, N.onerror = function() {
            setTimeout(function() {
              M(new TypeError("Network request failed"));
            }, 0);
          }, N.ontimeout = function() {
            setTimeout(function() {
              M(new TypeError("Network request timed out"));
            }, 0);
          }, N.onabort = function() {
            setTimeout(function() {
              M(new e.DOMException("Aborted", "AbortError"));
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
            var kt = [];
            Object.getOwnPropertyNames(_.headers).forEach(function(L) {
              kt.push(a(L)), N.setRequestHeader(L, c(_.headers[L]));
            }), K.headers.forEach(function(L, D) {
              kt.indexOf(D) === -1 && N.setRequestHeader(D, L);
            });
          } else
            K.headers.forEach(function(L, D) {
              N.setRequestHeader(D, L);
            });
          K.signal && (K.signal.addEventListener("abort", nt), N.onreadystatechange = function() {
            N.readyState === 4 && K.signal.removeEventListener("abort", nt);
          }), N.send(typeof K._bodyInit > "u" ? null : K._bodyInit);
        });
      }
      return W.polyfill = !0, n.fetch || (n.fetch = W, n.Headers = h, n.Request = C, n.Response = it), e.Headers = h, e.Request = C, e.Response = it, e.fetch = W, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : gn);
})();
const mb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xb(t, e) {
  const n = {};
  return Object.assign(n, mb, e), await fetch(t, n);
}
function Sb(t) {
  let e = xb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Eb(...t) {
  const { fetchLib: e, middlewares: n } = Sb(t);
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
var ui;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ui || (ui = {}));
var jd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(jd || (jd = {}));
const Ab = "https://api.mainnet.hiro.so", vb = "https://api.testnet.hiro.so", kb = "http://localhost:3999", $b = ["mainnet", "testnet", "devnet", "mocknet"];
let so = class {
  constructor(e) {
    this.version = ui.Mainnet, this.chainId = ro.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ui.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Eb();
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
      return new Ib();
    case "devnet":
      return new Lb();
    case "mocknet":
      return new Lp();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$b.join(", ")}`);
  }
};
so.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : so.fromName(t);
let tu = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ab,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ui.Mainnet, this.chainId = ro.Mainnet;
  }
}, Ib = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ui.Testnet, this.chainId = ro.Testnet;
  }
}, Lp = class extends so {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kb,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ui.Testnet, this.chainId = ro.Testnet;
  }
};
const Lb = Lp, Cp = "xtrata.wallet.bridge.v1", Cb = (t) => typeof t == "object" && t !== null && t.protocol === Cp, Tb = (t) => Cb(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Bb = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class _o extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Rd = 12e4;
class Mb {
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
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Tb(e.data)) return;
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
    const s = Bb(), i = { protocol: Cp, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new _o(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Rd}ms.`
          )
        );
      }, this.options.timeoutMs ?? Rd);
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
const Nb = ["SP", "SM"], Pb = ["ST", "SN"], _b = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Nb.includes(n) ? "mainnet" : Pb.includes(n) ? "testnet" : null;
}, Ub = () => {
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
}, Ob = () => typeof window > "u" || !window.localStorage ? Ub() : window.localStorage, xl = "xtrata.v15.1.wallet.session", zd = "mainnet", dc = { isConnected: !1 }, Hb = (t) => t.address ? _b(t.address) ?? t.network : t.network, Tp = (t) => !t.isConnected || !t.address ? { ...dc } : Hb(t) !== zd ? { ...dc } : {
  isConnected: !0,
  address: t.address,
  network: zd,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Db = (t) => {
  if (!t)
    return { ...dc };
  try {
    const e = JSON.parse(t);
    return Tp(e);
  } catch {
    return { ...dc };
  }
}, Fb = (t) => {
  const e = Tp(t);
  return JSON.stringify(e);
}, jb = (t) => {
  const e = Ob();
  return {
    load: () => Db(e.getItem(xl)),
    save: (n) => {
      e.setItem(xl, Fb(n));
    },
    clear: () => {
      e.removeItem(xl);
    }
  };
}, Rb = "https://browser.blockstack.org/auth", zb = {
  "@type": "Person",
  "@context": "http://schema.org"
}, Bp = ["store_write"], Gb = "blockstack-session", Kb = {
  logLevel: "debug"
}, Ii = {
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
Object.freeze(Ii);
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
class Vb extends Eo {
  constructor(e, n = "") {
    super({ code: Ii.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class Gd extends Eo {
  constructor(e = "") {
    super({ code: Ii.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class va extends Eo {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: Ii.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class Kd extends Eo {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: Ii.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class eu extends Eo {
  constructor(e) {
    super({ code: Ii.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class Mp extends Eo {
  constructor(e) {
    super({ code: Ii.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const Vd = ["debug", "info", "warn", "error", "none"], nu = {};
for (let t = 0; t < Vd.length; t++) {
  const e = Vd[t];
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
    return nu[Kb.logLevel] <= nu[e];
  }
}
function Yb() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Xb() {
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
function qb() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Wb() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Zb(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function uf(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Wb(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Wi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Zb(s, t.toString(), n);
    throw Wi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function Hs(t, e) {
  return ff(sn(t), e);
}
function sn(t) {
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
  if (En(t, Uint8Array))
    return BigInt(`0x${yt(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Qb(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function Yd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function ua(t, e = 8) {
  return (typeof t == "bigint" ? t : sn(t)).toString(16).padStart(e * 2, "0");
}
function Gc(t) {
  return parseInt(t, 16);
}
function ff(t, e = 16) {
  const n = ua(t, e);
  return Gt(n);
}
function Jb(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function tm(t, e) {
  return t & BigInt(1) << e;
}
function ru(t) {
  return em(BigInt(`0x${yt(t)}`), BigInt(t.byteLength * 8));
}
function em(t, e) {
  return tm(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const nm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function yt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += nm[n];
  return e;
}
function Gt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Qb(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function Li(t) {
  return new TextEncoder().encode(t);
}
function fa(t) {
  return new TextDecoder().decode(t);
}
function rm(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function sm(t) {
  return String.fromCharCode.apply(null, t);
}
function im(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Xd(t) {
  if (t.some(im))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function vr(...t) {
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
  return vr(...t.map((e) => typeof e == "number" ? Xd([e]) : e instanceof Array ? Xd(e) : e));
}
function En(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const Np = "https://api.mainnet.hiro.so", Pp = "https://api.testnet.hiro.so", _p = "http://localhost:3999", om = "https://hub.blockstack.org", am = 33, El = 32;
function cm(t) {
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
  const e = typeof t == "string" ? Gt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function lm(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function um(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function fm(t, e) {
  return t[e];
}
function dm(t, e, n = 0) {
  return t[n] = e, t;
}
function hm(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function fi(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const pm = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function gm(t, e) {
  const n = {};
  return Object.assign(n, pm, e), await fetch(t, n);
}
function ym(t) {
  let e = gm, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function wm(...t) {
  const { fetchLib: e, middlewares: n } = ym(t);
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
class Up {
  constructor(e = Bp.slice(), n = ((a) => (a = uf("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = Rb) {
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
function bm(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Op(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mm(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  su(t.outputLen), su(t.blockLen);
}
function xm(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sm(t, e) {
  Op(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ei = {
  number: su,
  bool: bm,
  bytes: Op,
  hash: mm,
  exists: xm,
  output: Sm
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Al = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, Em = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Em)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Am(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function hf(t) {
  if (typeof t == "string" && (t = Am(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let Hp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ci(t) {
  const e = (r) => t().update(hf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Dp = class extends Hp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ei.hash(e);
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
    return ei.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ei.exists(this), ei.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Kc = (t, e, n) => new Dp(t, e).update(n).digest();
Kc.create = (t, e) => new Dp(t, e);
function vm(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let pf = class extends Hp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Al(this.buffer);
  }
  update(e) {
    ei.exists(this);
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
    ei.exists(this), ei.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    vm(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const km = (t, e, n) => t & e ^ ~t & n, $m = (t, e, n) => t & e ^ t & n ^ e & n, Im = new Uint32Array([
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
let Fp = class extends pf {
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
      const y = as[l - 15], g = as[l - 2], S = fr(y, 7) ^ fr(y, 18) ^ y >>> 3, v = fr(g, 17) ^ fr(g, 19) ^ g >>> 10;
      as[l] = v + as[l - 7] + S + as[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), g = h + y + km(a, c, u) + Im[l] + as[l] | 0, v = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + $m(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    as.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lm = class extends Fp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const io = Ci(() => new Fp());
Ci(() => new Lm());
const Cm = {}, jp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cm
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Ft = BigInt(0), we = BigInt(1), Ms = BigInt(2), Ko = BigInt(3), qd = BigInt(8), ne = Object.freeze({
  a: Ft,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: we,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), Wd = (t, e) => (t + e / Ms) / e, ka = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = ne, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -we * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = Wd(i * t, e), c = Wd(-r * t, e);
    let u = st(t - a * n - c * s, e), h = st(-a * r - c * i, e);
    const l = u > o, y = h > o;
    if (l && (u = e - u), y && (h = e - h), u > o || h > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: y, k2: h };
  }
}, or = 32, di = 32, Rp = 32, hc = or + 1, pc = 2 * or + 1;
function Zd(t) {
  const { a: e, b: n } = ne, r = st(t * t), s = st(r * t);
  return st(s + e * t + n);
}
const $a = ne.a === Ft;
class gf extends Error {
  constructor(e) {
    super(e);
  }
}
function Qd(t) {
  if (!(t instanceof Xt))
    throw new TypeError("JacobianPoint expected");
}
class Xt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ut))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ut.ZERO) ? Xt.ZERO : new Xt(e.x, e.y, we);
  }
  static toAffineBatch(e) {
    const n = Pm(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Xt.toAffineBatch(e).map(Xt.fromAffine);
  }
  equals(e) {
    Qd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = st(s * s), u = st(a * a), h = st(n * u), l = st(i * c), y = st(st(r * a) * u), g = st(st(o * s) * c);
    return h === l && y === g;
  }
  negate() {
    return new Xt(this.x, st(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = st(e * e), i = st(n * n), o = st(i * i), a = e + i, c = st(Ms * (st(a * a) - s - o)), u = st(Ko * s), h = st(u * u), l = st(h - Ms * c), y = st(u * (c - l) - qd * o), g = st(Ms * n * r);
    return new Xt(l, y, g);
  }
  add(e) {
    Qd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Ft || o === Ft)
      return this;
    if (n === Ft || r === Ft)
      return e;
    const c = st(s * s), u = st(a * a), h = st(n * u), l = st(i * c), y = st(st(r * a) * u), g = st(st(o * s) * c), S = st(l - h), v = st(g - y);
    if (S === Ft)
      return v === Ft ? this.double() : Xt.ZERO;
    const T = st(S * S), U = st(S * T), F = st(h * T), k = st(v * v - U - Ms * F), C = st(v * (F - k) - y * U), P = st(s * a * S);
    return new Xt(k, C, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Xt.ZERO;
    if (typeof e == "bigint" && e === Ft)
      return n;
    let r = eh(e);
    if (r === we)
      return this;
    if (!$a) {
      let l = n, y = this;
      for (; r > Ft; )
        r & we && (l = l.add(y)), y = y.double(), r >>= we;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = ka.splitScalar(r), c = n, u = n, h = this;
    for (; i > Ft || a > Ft; )
      i & we && (c = c.add(h)), a & we && (u = u.add(h)), h = h.double(), i >>= we, a >>= we;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Xt(st(u.x * ka.beta), u.y, u.z), c.add(u);
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
    !n && this.equals(Xt.BASE) && (n = Ut.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && iu.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Xt.normalizeZ(s), iu.set(n, s)));
    let i = Xt.ZERO, o = Xt.BASE;
    const a = 1 + ($a ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), h = 2 ** r, l = BigInt(r);
    for (let y = 0; y < a; y++) {
      const g = y * c;
      let S = Number(e & u);
      e >>= l, S > c && (S -= h, e += we);
      const v = g, T = g + Math.abs(S) - 1, U = y % 2 !== 0, F = S < 0;
      S === 0 ? o = o.add(Ia(U, s[v])) : i = i.add(Ia(F, s[T]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = eh(e), s, i;
    if ($a) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = ka.splitScalar(r);
      let { p: h, f: l } = this.wNAF(a, n), { p: y, f: g } = this.wNAF(u, n);
      h = Ia(o, h), y = Ia(c, y), y = new Xt(st(y.x * ka.beta), y.y, y.z), s = h.add(y), i = l.add(g);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Xt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Xt.ZERO);
    e == null && (e = i ? qd : Ao(s));
    const o = e, a = st(o * o), c = st(a * o), u = st(n * a), h = st(r * c), l = st(s * o);
    if (i)
      return Ut.ZERO;
    if (l !== we)
      throw new Error("invZ was invalid");
    return new Ut(u, h);
  }
}
Xt.BASE = new Xt(ne.Gx, ne.Gy, we);
Xt.ZERO = new Xt(Ft, we, Ft);
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
    return this.y % Ms === Ft;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = _n(n ? e : e.subarray(1));
    if (!nc(r))
      throw new Error("Point is not on curve");
    const s = Zd(r);
    let i = Nm(s);
    const o = (i & we) === we;
    n ? o && (i = st(-i)) : (e[0] & 1) === 1 !== o && (i = st(-i));
    const a = new Ut(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = _n(e.subarray(1, or + 1)), r = _n(e.subarray(or + 1, or * 2 + 1)), s = new Ut(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = kr(e), r = n.length, s = n[0];
    if (r === or)
      return this.fromCompressedHex(n);
    if (r === hc && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === pc && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${hc} compressed bytes or ${pc} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ut.BASE.multiply(hi(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = Kp(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = yf(kr(e)), { n: a } = ne, c = r === 2 || r === 3 ? s + a : s, u = Ao(c, a), h = st(-o * u, a), l = st(i * u, a), y = r & 1 ? "03" : "02", g = Ut.fromHex(y + Ps(c)), S = Ut.BASE.multiplyAndAddUnsafe(g, h, l);
    if (!S)
      throw new Error("Cannot recover signature: point at infinify");
    return S.assertValidity(), S;
  }
  toRawBytes(e = !1) {
    return _s(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ps(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ps(this.y)}`;
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
    const s = st(r * r), i = Zd(n);
    if (st(s - i) !== Ft)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ut(this.x, st(-this.y));
  }
  double() {
    return Xt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Xt.fromAffine(this).add(Xt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Xt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Xt.fromAffine(this), i = n === Ft || n === we || this !== Ut.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Xt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Xt.ZERO) ? void 0 : a.toAffine();
  }
}
Ut.BASE = new Ut(ne.Gx, ne.Gy);
Ut.ZERO = new Ut(Ft, Ft);
function Jd(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function th(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${oo(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: _n(n), left: t.subarray(e + 2) };
}
function Tm(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${oo(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = th(t.subarray(2)), { data: r, left: s } = th(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${oo(s)}`);
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
    const s = n ? oo(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Pn(gc(s.slice(0, 64)), gc(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Tm(n ? e : _s(e));
    return new Pn(r, s);
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
    const e = ne.n >> we;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Pn(this.r, st(-this.s, ne.n)) : this;
  }
  toDERRawBytes() {
    return _s(this.toDERHex());
  }
  toDERHex() {
    const e = Jd(Uo(this.s)), n = Jd(Uo(this.r)), r = e.length / 2, s = n.length / 2, i = Uo(r), o = Uo(s);
    return `30${Uo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return _s(this.toCompactHex());
  }
  toCompactHex() {
    return Ps(this.r) + Ps(this.s);
  }
}
function Ts(...t) {
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
const Bm = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function oo(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Bm[t[n]];
  return e;
}
const Mm = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ps(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Ft <= t && t < Mm))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function ao(t) {
  const e = _s(Ps(t));
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
function _s(t) {
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
  return gc(oo(t));
}
function kr(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : _s(t);
}
function eh(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && co(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function st(t, e = ne.P) {
  const n = t % e;
  return n >= Ft ? n : e + n;
}
function Rn(t, e) {
  const { P: n } = ne;
  let r = t;
  for (; e-- > Ft; )
    r *= r, r %= n;
  return r;
}
function Nm(t) {
  const { P: e } = ne, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, h = Rn(u, Ko) * u % e, l = Rn(h, Ko) * u % e, y = Rn(l, Ms) * c % e, g = Rn(y, r) * y % e, S = Rn(g, s) * g % e, v = Rn(S, o) * S % e, T = Rn(v, a) * v % e, U = Rn(T, o) * S % e, F = Rn(U, Ko) * u % e, k = Rn(F, i) * g % e, C = Rn(k, n) * c % e, P = Rn(C, Ms);
  if (P * P % e !== t)
    throw new Error("Cannot find square root");
  return P;
}
function Ao(t, e = ne.P) {
  if (t === Ft || e <= Ft)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = st(t, e), r = e, s = Ft, i = we;
  for (; n !== Ft; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== we)
    throw new Error("invert: does not exist");
  return st(s, e);
}
function Pm(t, e = ne.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Ft ? i : (n[a] = i, st(i * o, e)), we), s = Ao(r, e);
  return t.reduceRight((i, o, a) => o === Ft ? i : (n[a] = st(i * n[a], e), st(i * o, e)), s), n;
}
function _m(t) {
  const e = t.length * 8 - di * 8, n = _n(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function yf(t, e = !1) {
  const n = _m(t);
  if (e)
    return n;
  const { n: r } = ne;
  return n >= r ? n - r : n;
}
let eo, Vo;
class zp {
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
    return Ts(...n);
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
    return Ts(...n);
  }
}
function co(t) {
  return Ft < t && t < ne.n;
}
function nc(t) {
  return Ft < t && t < ne.P;
}
function Gp(t, e, n, r = !0) {
  const { n: s } = ne, i = yf(t, !0);
  if (!co(i))
    return;
  const o = Ao(i, s), a = Ut.BASE.multiply(i), c = st(a.x, s);
  if (c === Ft)
    return;
  const u = st(o * st(e + n * c, s), s);
  if (u === Ft)
    return;
  let h = new Pn(c, u), l = (a.x === h.r ? 0 : 2) | Number(a.y & we);
  return r && h.hasHighS() && (h = h.normalizeS(), l ^= 1), { sig: h, recovery: l };
}
function hi(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * di)
      throw new Error("Expected 32 bytes of private key");
    e = gc(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== di)
      throw new Error("Expected 32 bytes of private key");
    e = _n(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!co(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function wf(t) {
  return t instanceof Ut ? (t.assertValidity(), t) : Ut.fromHex(t);
}
function Kp(t) {
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
function Um(t, e, n, r = !1) {
  return Ut.fromSignature(t, e, n).toRawBytes(r);
}
function nh(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === hc || r === pc : n ? r === hc * 2 || r === pc * 2 : t instanceof Ut;
}
function bf(t, e, n = !1) {
  if (nh(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!nh(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = wf(e);
  return r.assertValidity(), r.multiply(hi(t)).toRawBytes(n);
}
function Vp(t) {
  const e = t.length > or ? t.slice(0, or) : t;
  return _n(e);
}
function Om(t) {
  const e = Vp(t), n = st(e, ne.n);
  return Yp(n < Ft ? e : n);
}
function Yp(t) {
  return ao(t);
}
function Xp(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = kr(t), s = hi(e), i = [Yp(s), Om(r)];
  if (n != null) {
    n === !0 && (n = Ce.randomBytes(or));
    const c = kr(n);
    if (c.length !== or)
      throw new Error(`sign: Expected ${or} bytes of extra data`);
    i.push(c);
  }
  const o = Ts(...i), a = Vp(r);
  return { seed: o, m: a, d: s };
}
function qp(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Hm(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Xp(t, e, n.extraEntropy), o = new zp(Rp, di);
  await o.reseed(r);
  let a;
  for (; !(a = Gp(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return qp(a, n);
}
function Vc(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Xp(t, e, n.extraEntropy), o = new zp(Rp, di);
  o.reseedSync(r);
  let a;
  for (; !(a = Gp(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return qp(a, n);
}
const Dm = { strict: !0 };
function Fm(t, e, n, r = Dm) {
  let s;
  try {
    s = Kp(t), e = kr(e);
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
  const { n: u } = ne, h = Ao(o, u), l = st(a * h, u), y = st(i * h, u), g = Ut.BASE.multiplyAndAddUnsafe(c, l, y);
  return g ? st(g.x, u) === i : !1;
}
function yc(t) {
  return st(_n(t), ne.n);
}
class lo {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = kr(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = _n(n.subarray(0, 32)), s = _n(n.subarray(32, 64));
    return new lo(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!nc(e) || !co(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ps(this.r) + Ps(this.s);
  }
  toRawBytes() {
    return _s(this.toHex());
  }
}
function jm(t) {
  return Ut.fromPrivateKey(t).toRawX();
}
class Wp {
  constructor(e, n, r = Ce.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = kr(e);
    const { x: s, scalar: i } = this.getScalar(hi(n));
    if (this.px = s, this.d = i, this.rand = kr(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ut.fromPrivateKey(e), r = n.hasEvenY() ? e : ne.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return ao(e ^ _n(n));
  }
  finalizeNonce(e) {
    const n = st(_n(e), ne.n);
    if (n === Ft)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new lo(e.x, st(n + r * s, ne.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHash, o = this.initNonce(n, await i(Cs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(Cs.nonce, o, r, e)), h = yc(await i(Cs.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return await Jp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Ce.taggedHashSync, o = this.initNonce(n, i(Cs.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(Cs.nonce, o, r, e)), h = yc(i(Cs.challenge, c, r, e)), l = this.finalizeSig(a, u, h, n);
    return tg(l, e, r) || this.error(), l;
  }
}
async function Rm(t, e, n) {
  return new Wp(t, e, n).calc();
}
function zm(t, e, n) {
  return new Wp(t, e, n).calcSync();
}
function Zp(t, e, n) {
  const r = t instanceof lo, s = r ? t : lo.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: kr(e),
    P: wf(n)
  };
}
function Qp(t, e, n, r) {
  const s = Ut.BASE.multiplyAndAddUnsafe(e, hi(n), st(-r, ne.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function Jp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Zp(t, e, n), a = yc(await Ce.taggedHash(Cs.challenge, ao(r), o.toRawX(), i));
    return Qp(r, o, s, a);
  } catch {
    return !1;
  }
}
function tg(t, e, n) {
  try {
    const { r, s, m: i, P: o } = Zp(t, e, n), a = yc(Ce.taggedHashSync(Cs.challenge, ao(r), o.toRawX(), i));
    return Qp(r, o, s, a);
  } catch (r) {
    if (r instanceof gf)
      throw r;
    return !1;
  }
}
const Gm = {
  Signature: lo,
  getPublicKey: jm,
  sign: Rm,
  verify: Jp,
  signSync: zm,
  verifySync: tg
};
Ut.BASE._setWindowSize(8);
const Cn = {
  node: jp,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, Cs = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, La = {}, Ce = {
  bytesToHex: oo,
  hexToBytes: _s,
  concatBytes: Ts,
  mod: st,
  invert: Ao,
  isValidPrivateKey(t) {
    try {
      return hi(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: ao,
  _normalizePrivateKey: hi,
  hashToPrivateKey: (t) => {
    t = kr(t);
    const e = di + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = st(_n(t), ne.n - we) + we;
    return ao(n);
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
  randomPrivateKey: () => Ce.hashToPrivateKey(Ce.randomBytes(di + 8)),
  precompute(t = 8, e = Ut.BASE) {
    const n = e === Ut.BASE ? e : new Ut(e.x, e.y);
    return n._setWindowSize(t), n.multiply(Ko), n;
  },
  sha256: async (...t) => {
    if (Cn.web) {
      const e = await Cn.web.subtle.digest("SHA-256", Ts(...t));
      return new Uint8Array(e);
    } else if (Cn.node) {
      const { createHash: e } = Cn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Cn.web) {
      const n = await Cn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = Ts(...e), s = await Cn.web.subtle.sign("HMAC", n, r);
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
      n = Ts(r, r), La[t] = n;
    }
    return Ce.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof eo != "function")
      throw new gf("sha256Sync is undefined, you need to set it");
    let n = La[t];
    if (n === void 0) {
      const r = eo(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = Ts(r, r), La[t] = n;
    }
    return eo(n, ...e);
  },
  _JacobianPoint: Xt
};
Object.defineProperties(Ce, {
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
      return Vo;
    },
    set(t) {
      Vo || (Vo = t);
    }
  }
});
const Km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: ne,
  Point: Ut,
  Signature: Pn,
  getPublicKey: da,
  getSharedSecret: bf,
  recoverPublicKey: Um,
  schnorr: Gm,
  sign: Hm,
  signSync: Vc,
  utils: Ce,
  verify: Fm
}, Symbol.toStringTag, { value: "Module" }));
var ha = {};
ha.byteLength = Wm;
var Vm = ha.toByteArray = Qm, Ym = ha.fromByteArray = e1, wr = [], Kn = [], Xm = typeof Uint8Array < "u" ? Uint8Array : Array, vl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var zi = 0, qm = vl.length; zi < qm; ++zi)
  wr[zi] = vl[zi], Kn[vl.charCodeAt(zi)] = zi;
Kn[45] = 62;
Kn[95] = 63;
function eg(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Wm(t) {
  var e = eg(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Zm(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Qm(t) {
  var e, n = eg(t), r = n[0], s = n[1], i = new Xm(Zm(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Kn[t.charCodeAt(c)] << 18 | Kn[t.charCodeAt(c + 1)] << 12 | Kn[t.charCodeAt(c + 2)] << 6 | Kn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Kn[t.charCodeAt(c)] << 2 | Kn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Kn[t.charCodeAt(c)] << 10 | Kn[t.charCodeAt(c + 1)] << 4 | Kn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Jm(t) {
  return wr[t >> 18 & 63] + wr[t >> 12 & 63] + wr[t >> 6 & 63] + wr[t & 63];
}
function t1(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Jm(r));
  return s.join("");
}
function e1(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(t1(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    wr[e >> 2] + wr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    wr[e >> 10] + wr[e >> 4 & 63] + wr[e << 2 & 63] + "="
  )), s.join("");
}
function n1() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const r1 = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function s1() {
  if (n1())
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
    throw new Error(r1);
  }
}
class i1 {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(vr(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class o1 {
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
async function ng() {
  const t = await s1();
  return t.name === "subtleCrypto" ? new o1(t.lib) : new i1(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function a1(t) {
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
      for (var C = g[T], P = 0, X = F - 1; (C !== 0 || P < v) && X !== -1; X--, P++)
        C += 256 * k[X] >>> 0, k[X] = C % o >>> 0, C = C / o >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      v = P, T++;
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
      for (var P = 0, X = U - 1; (C !== 0 || P < T) && X !== -1; X--, P++)
        C += o * F[X] >>> 0, F[X] = C % 256 >>> 0, C = C / 256 >>> 0;
      if (C !== 0)
        throw new Error("Non-zero carry");
      T = P, S++;
    }
    for (var it = U - T; it !== U && F[it] === 0; )
      it++;
    for (var q = new Uint8Array(v + (U - it)), W = v; it !== U; )
      q[W++] = F[it++];
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
var rg = a1;
const c1 = rg, l1 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var u1 = c1(l1);
const f1 = /* @__PURE__ */ Ip(u1), d1 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), sg = Uint8Array.from({ length: 16 }, (t, e) => e), h1 = sg.map((t) => (9 * t + 5) % 16);
let mf = [sg], xf = [h1];
for (let t = 0; t < 4; t++)
  for (let e of [mf, xf])
    e.push(e[t].map((n) => d1[n]));
const ig = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), p1 = mf.map((t, e) => t.map((n) => ig[e][n])), g1 = xf.map((t, e) => t.map((n) => ig[e][n])), y1 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), w1 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ca = (t, e) => t << e | t >>> 32 - e;
function rh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ta = new Uint32Array(16);
let b1 = class extends pf {
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
      const S = 4 - g, v = y1[g], T = w1[g], U = mf[g], F = xf[g], k = p1[g], C = g1[g];
      for (let P = 0; P < 16; P++) {
        const X = Ca(r + rh(g, i, a, u) + Ta[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Ca(a, 10) | 0, a = i, i = X;
      }
      for (let P = 0; P < 16; P++) {
        const X = Ca(s + rh(S, o, c, h) + Ta[F[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = Ca(c, 10) | 0, c = o, o = X;
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
const m1 = Ci(() => new b1());
function x1(t) {
  return m1(t);
}
const Ba = BigInt(2 ** 32 - 1), ou = BigInt(32);
function og(t, e = !1) {
  return e ? { h: Number(t & Ba), l: Number(t >> ou & Ba) } : { h: Number(t >> ou & Ba) | 0, l: Number(t & Ba) | 0 };
}
function S1(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = og(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const E1 = (t, e) => BigInt(t >>> 0) << ou | BigInt(e >>> 0), A1 = (t, e, n) => t >>> n, v1 = (t, e, n) => t << 32 - n | e >>> n, k1 = (t, e, n) => t >>> n | e << 32 - n, $1 = (t, e, n) => t << 32 - n | e >>> n, I1 = (t, e, n) => t << 64 - n | e >>> n - 32, L1 = (t, e, n) => t >>> n - 32 | e << 64 - n, C1 = (t, e) => e, T1 = (t, e) => t, B1 = (t, e, n) => t << n | e >>> 32 - n, M1 = (t, e, n) => e << n | t >>> 32 - n, N1 = (t, e, n) => e << n - 32 | t >>> 64 - n, P1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _1(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const U1 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), O1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, H1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), D1 = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, F1 = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), j1 = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: og,
  split: S1,
  toBig: E1,
  shrSH: A1,
  shrSL: v1,
  rotrSH: k1,
  rotrSL: $1,
  rotrBH: I1,
  rotrBL: L1,
  rotr32H: C1,
  rotr32L: T1,
  rotlSH: B1,
  rotlSL: M1,
  rotlBH: N1,
  rotlBL: P1,
  add: _1,
  add3L: U1,
  add3H: O1,
  add4L: H1,
  add4H: D1,
  add5H: j1,
  add5L: F1
}, [R1, z1] = Tt.split([
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
let Yc = class extends pf {
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
      cs[k] = e.getUint32(n), ls[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = cs[k - 15] | 0, P = ls[k - 15] | 0, X = Tt.rotrSH(C, P, 1) ^ Tt.rotrSH(C, P, 8) ^ Tt.shrSH(C, P, 7), it = Tt.rotrSL(C, P, 1) ^ Tt.rotrSL(C, P, 8) ^ Tt.shrSL(C, P, 7), q = cs[k - 2] | 0, W = ls[k - 2] | 0, $ = Tt.rotrSH(q, W, 19) ^ Tt.rotrBH(q, W, 61) ^ Tt.shrSH(q, W, 6), _ = Tt.rotrSL(q, W, 19) ^ Tt.rotrBL(q, W, 61) ^ Tt.shrSL(q, W, 6), x = Tt.add4L(it, _, ls[k - 7], ls[k - 16]), M = Tt.add4H(x, X, $, cs[k - 7], cs[k - 16]);
      cs[k] = M | 0, ls[k] = x | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Tt.rotrSH(l, y, 14) ^ Tt.rotrSH(l, y, 18) ^ Tt.rotrBH(l, y, 41), P = Tt.rotrSL(l, y, 14) ^ Tt.rotrSL(l, y, 18) ^ Tt.rotrBL(l, y, 41), X = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Tt.add5L(F, P, it, z1[k], ls[k]), W = Tt.add5H(q, U, C, X, R1[k], cs[k]), $ = q | 0, _ = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), x = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), M = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Tt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Tt.add3L($, x, K);
      r = Tt.add3H(N, W, _, M), s = N | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Tt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Tt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Tt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Tt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    cs.fill(0), ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, G1 = class extends Yc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, K1 = class extends Yc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, V1 = class extends Yc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const Y1 = Ci(() => new Yc());
Ci(() => new G1());
Ci(() => new K1());
Ci(() => new V1());
function ag(t) {
  return io(t);
}
function X1(t) {
  return Y1(t);
}
const q1 = 0;
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(io, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function W1() {
  return yt(Ce.randomPrivateKey());
}
function Z1(t) {
  const e = io(io(t));
  return f1.encode(vr(t, e).slice(0, t.length + 4));
}
function Q1(t, e) {
  return Z1(vr(new Uint8Array([t]), e.slice(0, 20)));
}
function cg(t, e = q1) {
  const n = typeof t == "string" ? Gt(t) : t, r = x1(ag(n));
  return Q1(e, r);
}
function lg(t) {
  const e = df(t);
  return yt(da(e.slice(0, 32), !0));
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kc.create(io, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var wc;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(wc || (wc = {}));
async function J1(t, e, n) {
  return await (await ng()).encrypt("aes-256-cbc", e, t, n);
}
async function t2(t, e, n) {
  return await (await ng()).decrypt("aes-256-cbc", e, t, n);
}
function ug(t, e) {
  return Kc(io, t, e);
}
function e2(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function fg(t) {
  const e = X1(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function n2(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function r2(t) {
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
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !n2(t))
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
async function s2(t, e, n, r) {
  const s = r2(t);
  if (!s.result)
    throw s;
  const i = Ce.randomPrivateKey(), o = da(i, !0);
  let a = bf(i, t, !0);
  a = a.slice(1);
  const c = fg(a), u = Ce.randomBytes(16), h = await J1(u, c.encryptionKey, e), l = vr(u, o, h), y = ug(c.hmacKey, l);
  let g;
  if (!r || r === "hex")
    g = yt(h);
  else if (r === "base64")
    g = Ym(h);
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
async function dg(t, e) {
  if (!e.ephemeralPK)
    throw new Kd("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = bf(t, n, !0);
  r = r.slice(1);
  const s = fg(r), i = Gt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Gt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Vm(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = vr(i, Gt(n), o), c = ug(s.hmacKey, a), u = Gt(e.mac);
  if (!e2(u, c))
    throw new Kd("Decryption failed: failure in MAC check");
  const h = await t2(i, s.encryptionKey, o);
  return e.wasString ? fa(h) : h;
}
function i2(t, e) {
  const n = typeof e == "string" ? Li(e) : e, r = lg(t), s = ag(n), i = Vc(s, t);
  return {
    signature: yt(i),
    publicKey: r
  };
}
async function o2(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = lg(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? Li(t) : t, o = await s2(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = i2(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function a2(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return dg(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var We = {}, uo = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.decode = hn.encode = hn.unescape = hn.escape = hn.pad = void 0;
const hg = ha;
function Sf(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
hn.pad = Sf;
function pg(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
hn.escape = pg;
function gg(t) {
  return Sf(t).replace(/-/g, "+").replace(/_/g, "/");
}
hn.unescape = gg;
function c2(t) {
  return pg((0, hg.fromByteArray)(new TextEncoder().encode(t)));
}
hn.encode = c2;
function l2(t) {
  return new TextDecoder().decode((0, hg.toByteArray)(Sf(gg(t))));
}
hn.decode = l2;
var Xc = {}, qc = {}, yg = {}, wg = {}, Wc = {};
Object.defineProperty(Wc, "__esModule", { value: !0 });
Wc.crypto = void 0;
Wc.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = h, t.createView = l, t.rotr = y, t.rotl = g, t.byteSwap = S, t.byteSwap32 = v, t.bytesToHex = F, t.hexToBytes = P, t.asyncLoop = it, t.utf8ToBytes = q, t.bytesToUtf8 = W, t.toBytes = $, t.kdfInputToBytes = _, t.concatBytes = x, t.checkOpts = M, t.createHasher = N, t.createOptHasher = nt, t.createXOFer = Z, t.randomBytes = kt;
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
  function P(L) {
    if (typeof L != "string")
      throw new Error("hex string expected, got " + typeof L);
    if (T)
      return Uint8Array.fromHex(L);
    const D = L.length, lt = D / 2;
    if (D % 2)
      throw new Error("hex string expected, got unpadded hex of length " + D);
    const dt = new Uint8Array(lt);
    for (let at = 0, It = 0; at < lt; at++, It += 2) {
      const fe = C(L.charCodeAt(It)), At = C(L.charCodeAt(It + 1));
      if (fe === void 0 || At === void 0) {
        const jt = L[It] + L[It + 1];
        throw new Error('hex string expected, got non-hex character "' + jt + '" at index ' + It);
      }
      dt[at] = fe * 16 + At;
    }
    return dt;
  }
  const X = async () => {
  };
  t.nextTick = X;
  async function it(L, D, lt) {
    let dt = Date.now();
    for (let at = 0; at < L; at++) {
      lt(at);
      const It = Date.now() - dt;
      It >= 0 && It < D || (await (0, t.nextTick)(), dt += It);
    }
  }
  function q(L) {
    if (typeof L != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(L));
  }
  function W(L) {
    return new TextDecoder().decode(L);
  }
  function $(L) {
    return typeof L == "string" && (L = q(L)), s(L), L;
  }
  function _(L) {
    return typeof L == "string" && (L = q(L)), s(L), L;
  }
  function x(...L) {
    let D = 0;
    for (let dt = 0; dt < L.length; dt++) {
      const at = L[dt];
      s(at), D += at.length;
    }
    const lt = new Uint8Array(D);
    for (let dt = 0, at = 0; dt < L.length; dt++) {
      const It = L[dt];
      lt.set(It, at), at += It.length;
    }
    return lt;
  }
  function M(L, D) {
    if (D !== void 0 && {}.toString.call(D) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(L, D);
  }
  class K {
  }
  t.Hash = K;
  function N(L) {
    const D = (dt) => L().update($(dt)).digest(), lt = L();
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = () => L(), D;
  }
  function nt(L) {
    const D = (dt, at) => L(at).update($(dt)).digest(), lt = L({});
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = (dt) => L(dt), D;
  }
  function Z(L) {
    const D = (dt, at) => L(at).update($(dt)).digest(), lt = L({});
    return D.outputLen = lt.outputLen, D.blockLen = lt.blockLen, D.create = (dt) => L(dt), D;
  }
  t.wrapConstructor = N, t.wrapConstructorWithOpts = nt, t.wrapXOFConstructorWithOpts = Z;
  function kt(L = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(L));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(L));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(wg);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = wg;
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
})(yg);
const Gi = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function bg(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function au(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function Ti(t, ...e) {
  if (!bg(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function u2(t) {
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
function mg(t, e) {
  Ti(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function f2(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function d2(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function bc(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function rc(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function tr(t, e) {
  return t << 32 - e | t >>> e;
}
function h2(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const Ef = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Af(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const xg = Ef ? (t) => t : (t) => Af(t), p2 = xg;
function Sg(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Af(t[e]);
  return t;
}
const g2 = Ef ? (t) => t : Sg, Eg = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", y2 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ag(t) {
  if (Ti(t), Eg)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y2[t[n]];
  return e;
}
const _r = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function sh(t) {
  if (t >= _r._0 && t <= _r._9)
    return t - _r._0;
  if (t >= _r.A && t <= _r.F)
    return t - (_r.A - 10);
  if (t >= _r.a && t <= _r.f)
    return t - (_r.a - 10);
}
function w2(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if (Eg)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = sh(t.charCodeAt(i)), a = sh(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const vg = async () => {
};
async function b2(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await vg(), r += i);
  }
}
function vf(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function m2(t) {
  return new TextDecoder().decode(t);
}
function pa(t) {
  return typeof t == "string" && (t = vf(t)), Ti(t), t;
}
function x2(t) {
  return typeof t == "string" && (t = vf(t)), Ti(t), t;
}
function S2(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    Ti(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function E2(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let kg = class {
};
function Zc(t) {
  const e = (r) => t().update(pa(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function $g(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Ig(t) {
  const e = (r, s) => t(s).update(pa(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const A2 = Zc, v2 = $g, k2 = Ig;
function $2(t = 32) {
  if (Gi && typeof Gi.getRandomValues == "function")
    return Gi.getRandomValues(new Uint8Array(t));
  if (Gi && typeof Gi.randomBytes == "function")
    return Uint8Array.from(Gi.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const I2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: kg,
  abytes: Ti,
  aexists: cu,
  ahash: u2,
  anumber: au,
  aoutput: mg,
  asyncLoop: b2,
  byteSwap: Af,
  byteSwap32: Sg,
  byteSwapIfBE: p2,
  bytesToHex: Ag,
  bytesToUtf8: m2,
  checkOpts: E2,
  clean: bc,
  concatBytes: S2,
  createHasher: Zc,
  createOptHasher: $g,
  createView: rc,
  createXOFer: Ig,
  hexToBytes: w2,
  isBytes: bg,
  isLE: Ef,
  kdfInputToBytes: x2,
  nextTick: vg,
  randomBytes: $2,
  rotl: h2,
  rotr: tr,
  swap32IfBE: g2,
  swap8IfBE: xg,
  toBytes: pa,
  u32: d2,
  u8: f2,
  utf8ToBytes: vf,
  wrapConstructor: A2,
  wrapConstructorWithOpts: v2,
  wrapXOFConstructorWithOpts: k2
}, Symbol.toStringTag, { value: "Module" }));
function L2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function C2(t, e, n) {
  return t & e ^ ~t & n;
}
function T2(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class B2 extends kg {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = rc(this.buffer);
  }
  update(e) {
    cu(this), e = pa(e), Ti(e);
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
    cu(this), mg(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, bc(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    L2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const us = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), fs = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), M2 = /* @__PURE__ */ Uint32Array.from([
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
]), ds = /* @__PURE__ */ new Uint32Array(64);
let kf = class extends B2 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = us[0] | 0, this.B = us[1] | 0, this.C = us[2] | 0, this.D = us[3] | 0, this.E = us[4] | 0, this.F = us[5] | 0, this.G = us[6] | 0, this.H = us[7] | 0;
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
      const y = ds[l - 15], g = ds[l - 2], S = tr(y, 7) ^ tr(y, 18) ^ y >>> 3, v = tr(g, 17) ^ tr(g, 19) ^ g >>> 10;
      ds[l] = v + ds[l - 7] + S + ds[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = tr(a, 6) ^ tr(a, 11) ^ tr(a, 25), g = h + y + C2(a, c, u) + M2[l] + ds[l] | 0, v = (tr(r, 2) ^ tr(r, 13) ^ tr(r, 22)) + T2(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    bc(ds);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), bc(this.buffer);
  }
}, Lg = class extends kf {
  constructor() {
    super(28), this.A = fs[0] | 0, this.B = fs[1] | 0, this.C = fs[2] | 0, this.D = fs[3] | 0, this.E = fs[4] | 0, this.F = fs[5] | 0, this.G = fs[6] | 0, this.H = fs[7] | 0;
  }
};
const N2 = /* @__PURE__ */ Zc(() => new kf()), P2 = /* @__PURE__ */ Zc(() => new Lg()), _2 = kf, Cg = N2, U2 = Lg, O2 = P2, H2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: U2,
  SHA256: _2,
  sha224: O2,
  sha256: Cg
}, Symbol.toStringTag, { value: "Module" })), Qc = /* @__PURE__ */ zc(H2), D2 = /* @__PURE__ */ zc(Km);
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
fo.joseToDer = fo.derToJose = void 0;
const Tg = ha, Bg = hn;
function kl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const F2 = {
  ES256: kl(256),
  ES384: kl(384),
  ES512: kl(521)
};
function Mg(t) {
  const e = F2[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const mc = 128, Ng = 0, j2 = 32, R2 = 16, z2 = 2, Pg = R2 | j2 | Ng << 6, xc = z2 | Ng << 6;
function _g(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Tg.toByteArray)((0, Bg.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function G2(t, e) {
  const n = _g(t), r = Mg(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Pg)
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
  return S.set(n.subarray(l + Math.max(-g, 0), l + h), o), (0, Bg.escape)((0, Tg.fromByteArray)(S));
}
fo.derToJose = G2;
function ih(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= mc && --r, r;
}
function K2(t, e) {
  t = _g(t);
  const n = Mg(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = ih(t, 0, n), i = ih(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < mc, h = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return h[l++] = Pg, u ? h[l++] = c : (h[l++] = mc | 1, h[l++] = c & 255), h[l++] = xc, h[l++] = o, s < 0 ? (h[l++] = 0, h.set(t.subarray(0, n), l), l += n) : (h.set(t.subarray(s, n), l), l += n - s), h[l++] = xc, h[l++] = a, i < 0 ? (h[l++] = 0, h.set(t.subarray(n), l)) : h.set(t.subarray(n + i), l), h;
}
fo.joseToDer = K2;
var Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.InvalidTokenError = Yr.MissingParametersError = void 0;
class V2 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
Yr.MissingParametersError = V2;
class Y2 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
Yr.InvalidTokenError = Y2;
const ga = /* @__PURE__ */ zc(I2);
Object.defineProperty(qc, "__esModule", { value: !0 });
qc.SECP256K1Client = void 0;
const X2 = yg, q2 = Qc, sc = D2, oh = fo, ah = Yr, ch = ga;
sc.utils.hmacSha256Sync = (t, ...e) => {
  const n = X2.hmac.create(q2.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Ug {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, ch.bytesToHex)(sc.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new ah.MissingParametersError("a signing input hash and private key are all required");
    const s = sc.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, ch.bytesToHex)(s);
    if (r === "jose")
      return (0, oh.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, oh.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new ah.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return sc.verify(n, e, r, { strict: !1 });
  }
}
qc.SECP256K1Client = Ug;
Ug.algorithmName = "ES256K";
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
var pi = {};
const W2 = /* @__PURE__ */ zc(jp);
var Z2 = gn && gn.__awaiter || function(t, e, n, r) {
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
Object.defineProperty(pi, "__esModule", { value: !0 });
pi.hashSha256Async = pi.hashSha256 = void 0;
const Q2 = Qc;
function Og(t) {
  return (0, Q2.sha256)(t);
}
pi.hashSha256 = Og;
function J2(t) {
  return Z2(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = W2;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(Og(t));
    }
  });
}
pi.hashSha256Async = J2;
var tx = gn && gn.__awaiter || function(t, e, n, r) {
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
const lu = hn, lh = Xc, ex = Yr, uh = pi;
function uu(t, e) {
  const n = [], r = lu.encode(JSON.stringify(e));
  n.push(r);
  const s = lu.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function nx(t) {
  return uu(t, { typ: "JWT", alg: "none" }) + ".";
}
uo.createUnsecuredToken = nx;
class rx {
  constructor(e, n) {
    if (!(e && n))
      throw new ex.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !lh.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = lh.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = uu(e, s), o = (0, uh.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return tx(this, void 0, void 0, function* () {
      const s = this.header(r), i = uu(e, s), o = yield (0, uh.hashSha256Async)(i);
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
uo.TokenSigner = rx;
var Jc = {};
Object.defineProperty(Jc, "__esModule", { value: !0 });
Jc.TokenVerifier = void 0;
const sx = hn, fh = Xc, ix = Yr, Ma = pi;
class ox {
  constructor(e, n) {
    if (!(e && n))
      throw new ix.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !fh.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = fh.cryptoClients[e], this.rawPublicKey = n;
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
    const r = [e.header.join("."), sx.encode(e.payload)].join(".");
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
Jc.TokenVerifier = ox;
var tl = {};
Object.defineProperty(tl, "__esModule", { value: !0 });
tl.decodeToken = void 0;
const Na = hn;
function ax(t) {
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
tl.decodeToken = ax;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(uo, t), n(Jc, t), n(tl, t), n(Yr, t), n(Xc, t);
})(We);
function cx(t) {
  return `did:btc-addr:${t}`;
}
function lx(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new Gd("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new Gd('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function Hg(t) {
  if (t)
    return lx(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const ux = "1.4.0";
function fx() {
  return W1();
}
function dx(t, e, n, r = Bp.slice(), s, i = Yb().getTime(), o = {}) {
  const a = (g) => {
    const S = uf("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${g}=undefined])`
    });
    return S == null ? void 0 : S.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: qb(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: ux,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = We.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const h = cg(u);
  return c.iss = cx(h), new We.TokenSigner("ES256k", t).sign(c);
}
async function dh(t, e) {
  const n = fa(Gt(e)), r = JSON.parse(n), s = await dg(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function hx(t) {
  const e = We.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new We.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function px(t) {
  const e = We.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = Hg(e.iss);
  if (n.length === 1) {
    if (cg(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function gx(t) {
  const e = We.decodeToken(t).payload;
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
function yx(t) {
  const e = We.decodeToken(t).payload;
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
function wx(t) {
  const e = [
    yx(t),
    gx(t),
    hx(t),
    px(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const hh = "1.0.0";
class Us {
  constructor(e) {
    this.version = hh, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== hh)
      throw new eu(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new Us(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Dg {
  constructor(e) {
    if (e) {
      const n = new Us(e);
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
class ph extends Dg {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new Us({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new Mp("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new Us({})), !0;
  }
}
class gh extends Dg {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Gb, !localStorage.getItem(this.key)) {
      const r = new Us({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new Mp("No session data was found in localStorage");
    const n = JSON.parse(e);
    return Us.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new Us({})), !0;
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
var Rr;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Rr || (Rr = {}));
var xr;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(xr || (xr = {}));
Rr.Mainnet;
const Fg = {
  chainId: Jo.Mainnet,
  transactionVersion: Rr.Mainnet,
  peerNetworkId: Sc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: xr.MainnetSingleSig,
    multiSig: xr.MainnetMultiSig
  },
  client: { baseUrl: Np }
}, fu = {
  chainId: Jo.Testnet,
  transactionVersion: Rr.Testnet,
  peerNetworkId: Sc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: xr.TestnetSingleSig,
    multiSig: xr.TestnetMultiSig
  },
  client: { baseUrl: Pp }
}, ic = {
  ...fu,
  addressVersion: { ...fu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: _p }
}, bx = {
  ...ic,
  addressVersion: { ...ic.addressVersion },
  client: { ...ic.client }
};
function mx(t) {
  switch (t) {
    case "mainnet":
      return Fg;
    case "testnet":
      return fu;
    case "devnet":
      return ic;
    case "mocknet":
      return bx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function jg(t) {
  return typeof t == "string" ? mx(t) : t;
}
var yh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(yh || (yh = {}));
var wh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(wh || (wh = {}));
var er;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(er || (er = {}));
const $l = ["onChainOnly", "offChainOnly", "any"];
$l[0] + "", er.OnChainOnly, $l[1] + "", er.OffChainOnly, $l[2] + "", er.Any, er.OnChainOnly + "", er.OnChainOnly, er.OffChainOnly + "", er.OffChainOnly, er.Any + "", er.Any;
var bh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(bh || (bh = {}));
var mh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(mh || (mh = {}));
var xh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(xh || (xh = {}));
var Fr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Fr || (Fr = {}));
var Sh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Sh || (Sh = {}));
var Eh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Eh || (Eh = {}));
var Ah;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Ah || (Ah = {}));
var vh;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(vh || (vh = {}));
var kh;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(kh || (kh = {}));
var $h;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})($h || ($h = {}));
var Ih;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Ih || (Ih = {}));
var Lh;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Lh || (Lh = {}));
var Ch;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Ch || (Ch = {}));
function du(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function xx(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Rg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function Sx(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  du(t.outputLen), du(t.blockLen);
}
function Ex(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ax(t, e) {
  Rg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ni = {
  number: du,
  bool: xx,
  bytes: Rg,
  hash: Sx,
  exists: Ex,
  output: Ax
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Il = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, vx = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!vx)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function kx(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function $f(t) {
  if (typeof t == "string" && (t = kx(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let zg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Bi(t) {
  const e = (r) => t().update($f(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Gg = class extends zg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ni.hash(e);
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
const Kg = (t, e, n) => new Gg(t, e).update(n).digest();
Kg.create = (t, e) => new Gg(t, e);
function $x(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let If = class extends zg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Il(this.buffer);
  }
  update(e) {
    ni.exists(this);
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
    ni.exists(this), ni.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    $x(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const Ix = (t, e, n) => t & e ^ ~t & n, Lx = (t, e, n) => t & e ^ t & n ^ e & n, Cx = new Uint32Array([
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
let Vg = class extends If {
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
      const y = ps[l - 15], g = ps[l - 2], S = dr(y, 7) ^ dr(y, 18) ^ y >>> 3, v = dr(g, 17) ^ dr(g, 19) ^ g >>> 10;
      ps[l] = v + ps[l - 7] + S + ps[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), g = h + y + Ix(a, c, u) + Cx[l] + ps[l] | 0, v = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + Lx(r, s, i) | 0;
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
}, Tx = class extends Vg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Yg = Bi(() => new Vg());
Bi(() => new Tx());
var Mi = {}, Lf = {};
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
})(Lf);
var gi = {};
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.c32checkDecode = gi.c32checkEncode = void 0;
const Th = Qc, Bh = ga, Yo = Lf;
function Xg(t) {
  const e = (0, Th.sha256)((0, Th.sha256)((0, Bh.hexToBytes)(t)));
  return (0, Bh.bytesToHex)(e.slice(0, 4));
}
function Bx(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Xg(`${n}${e}`), s = (0, Yo.c32encode)(`${e}${r}`);
  return `${Yo.c32[t]}${s}`;
}
gi.c32checkEncode = Bx;
function Mx(t) {
  t = (0, Yo.c32normalize)(t);
  const e = (0, Yo.c32decode)(t.slice(1)), n = t[0], r = Yo.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Xg(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
gi.c32checkDecode = Mx;
var qg = {}, ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
ho.decode = ho.encode = void 0;
const Ec = Qc, Mh = ga, Wg = rg, Zg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function Nx(t, e = "00") {
  const n = typeof t == "string" ? (0, Mh.hexToBytes)(t) : t, r = typeof e == "string" ? (0, Mh.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...r, ...n])));
  return Wg(Zg).encode([...r, ...n, ...s.slice(0, 4)]);
}
ho.encode = Nx;
function Px(t) {
  const e = Wg(Zg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Ec.sha256)((0, Ec.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
ho.decode = Px;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = gi, n = ho, r = ga;
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
})(qg);
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
  const n = gi;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = qg;
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
})(Mi);
function _x(t, e) {
  switch (e = jg(e ?? Fg), t) {
    case Fr.P2PKH:
      switch (e.transactionVersion) {
        case Rr.Mainnet:
          return xr.MainnetSingleSig;
        case Rr.Testnet:
          return xr.TestnetSingleSig;
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
          return xr.MainnetMultiSig;
        case Rr.Testnet:
          return xr.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const Ux = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Qg = Uint8Array.from({ length: 16 }, (t, e) => e), Ox = Qg.map((t) => (9 * t + 5) % 16);
let Cf = [Qg], Tf = [Ox];
for (let t = 0; t < 4; t++)
  for (let e of [Cf, Tf])
    e.push(e[t].map((n) => Ux[n]));
const Jg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), Hx = Cf.map((t, e) => t.map((n) => Jg[e][n])), Dx = Tf.map((t, e) => t.map((n) => Jg[e][n])), Fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), jx = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Pa = (t, e) => t << e | t >>> 32 - e;
function Nh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const _a = new Uint32Array(16);
let Rx = class extends If {
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
      const S = 4 - g, v = Fx[g], T = jx[g], U = Cf[g], F = Tf[g], k = Hx[g], C = Dx[g];
      for (let P = 0; P < 16; P++) {
        const X = Pa(r + Nh(g, i, a, u) + _a[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Pa(a, 10) | 0, a = i, i = X;
      }
      for (let P = 0; P < 16; P++) {
        const X = Pa(s + Nh(S, o, c, h) + _a[F[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = Pa(c, 10) | 0, c = o, o = X;
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
const zx = Bi(() => new Rx()), Ua = BigInt(2 ** 32 - 1), hu = BigInt(32);
function ty(t, e = !1) {
  return e ? { h: Number(t & Ua), l: Number(t >> hu & Ua) } : { h: Number(t >> hu & Ua) | 0, l: Number(t & Ua) | 0 };
}
function Gx(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = ty(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Kx = (t, e) => BigInt(t >>> 0) << hu | BigInt(e >>> 0), Vx = (t, e, n) => t >>> n, Yx = (t, e, n) => t << 32 - n | e >>> n, Xx = (t, e, n) => t >>> n | e << 32 - n, qx = (t, e, n) => t << 32 - n | e >>> n, Wx = (t, e, n) => t << 64 - n | e >>> n - 32, Zx = (t, e, n) => t >>> n - 32 | e << 64 - n, Qx = (t, e) => e, Jx = (t, e) => t, tS = (t, e, n) => t << n | e >>> 32 - n, eS = (t, e, n) => e << n | t >>> 32 - n, nS = (t, e, n) => e << n - 32 | t >>> 64 - n, rS = (t, e, n) => t << n - 32 | e >>> 64 - n;
function sS(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const iS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), oS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, aS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, lS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), uS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: ty,
  split: Gx,
  toBig: Kx,
  shrSH: Vx,
  shrSL: Yx,
  rotrSH: Xx,
  rotrSL: qx,
  rotrBH: Wx,
  rotrBL: Zx,
  rotr32H: Qx,
  rotr32L: Jx,
  rotlSH: tS,
  rotlSL: eS,
  rotlBH: nS,
  rotlBL: rS,
  add: sS,
  add3L: iS,
  add3H: oS,
  add4L: aS,
  add4H: cS,
  add5H: uS,
  add5L: lS
}, [fS, dS] = Bt.split([
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
let el = class extends If {
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
      const C = gs[k - 15] | 0, P = ys[k - 15] | 0, X = Bt.rotrSH(C, P, 1) ^ Bt.rotrSH(C, P, 8) ^ Bt.shrSH(C, P, 7), it = Bt.rotrSL(C, P, 1) ^ Bt.rotrSL(C, P, 8) ^ Bt.shrSL(C, P, 7), q = gs[k - 2] | 0, W = ys[k - 2] | 0, $ = Bt.rotrSH(q, W, 19) ^ Bt.rotrBH(q, W, 61) ^ Bt.shrSH(q, W, 6), _ = Bt.rotrSL(q, W, 19) ^ Bt.rotrBL(q, W, 61) ^ Bt.shrSL(q, W, 6), x = Bt.add4L(it, _, ys[k - 7], ys[k - 16]), M = Bt.add4H(x, X, $, gs[k - 7], gs[k - 16]);
      gs[k] = M | 0, ys[k] = x | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Bt.rotrSH(l, y, 14) ^ Bt.rotrSH(l, y, 18) ^ Bt.rotrBH(l, y, 41), P = Bt.rotrSL(l, y, 14) ^ Bt.rotrSL(l, y, 18) ^ Bt.rotrBL(l, y, 41), X = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Bt.add5L(F, P, it, dS[k], ys[k]), W = Bt.add5H(q, U, C, X, fS[k], gs[k]), $ = q | 0, _ = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), x = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), M = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Bt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Bt.add3L($, x, K);
      r = Bt.add3H(N, W, _, M), s = N | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Bt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Bt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Bt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Bt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    gs.fill(0), ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hS = class extends el {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, pS = class extends el {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gS = class extends el {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Bi(() => new el());
Bi(() => new hS());
Bi(() => new pS());
Bi(() => new gS());
var Ac = { exports: {} };
Ac.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", h = "[object Function]", l = "[object GeneratorFunction]", y = "[object Map]", g = "[object Number]", S = "[object Object]", v = "[object Promise]", T = "[object RegExp]", U = "[object Set]", F = "[object String]", k = "[object Symbol]", C = "[object WeakMap]", P = "[object ArrayBuffer]", X = "[object DataView]", it = "[object Float32Array]", q = "[object Float64Array]", W = "[object Int8Array]", $ = "[object Int16Array]", _ = "[object Int32Array]", x = "[object Uint8Array]", M = "[object Uint8ClampedArray]", K = "[object Uint16Array]", N = "[object Uint32Array]", nt = /[\\^$.*+?()[\]{}|]/g, Z = /\w*$/, kt = /^\[object .+?Constructor\]$/, L = /^(?:0|[1-9]\d*)$/, D = {};
  D[i] = D[o] = D[P] = D[X] = D[a] = D[c] = D[it] = D[q] = D[W] = D[$] = D[_] = D[y] = D[g] = D[S] = D[T] = D[U] = D[F] = D[k] = D[x] = D[M] = D[K] = D[N] = !0, D[u] = D[h] = D[C] = !1;
  var lt = typeof gn == "object" && gn && gn.Object === Object && gn, dt = typeof self == "object" && self && self.Object === Object && self, at = lt || dt || Function("return this")(), It = e && !e.nodeType && e, fe = It && !0 && t && !t.nodeType && t, At = fe && fe.exports === It;
  function jt(w, B) {
    return w.set(B[0], B[1]), w;
  }
  function Lt(w, B) {
    return w.add(B), w;
  }
  function de(w, B) {
    for (var j = -1, ct = w ? w.length : 0; ++j < ct && B(w[j], j, w) !== !1; )
      ;
    return w;
  }
  function Ht(w, B) {
    for (var j = -1, ct = B.length, Re = w.length; ++j < ct; )
      w[Re + j] = B[j];
    return w;
  }
  function Ct(w, B, j, ct) {
    for (var Re = -1, Ke = w ? w.length : 0; ++Re < Ke; )
      j = B(j, w[Re], Re, w);
    return j;
  }
  function on(w, B) {
    for (var j = -1, ct = Array(w); ++j < w; )
      ct[j] = B(j);
    return ct;
  }
  function vt(w, B) {
    return w == null ? void 0 : w[B];
  }
  function wn(w) {
    var B = !1;
    if (w != null && typeof w.toString != "function")
      try {
        B = !!(w + "");
      } catch {
      }
    return B;
  }
  function On(w) {
    var B = -1, j = Array(w.size);
    return w.forEach(function(ct, Re) {
      j[++B] = [Re, ct];
    }), j;
  }
  function ve(w, B) {
    return function(j) {
      return w(B(j));
    };
  }
  function an(w) {
    var B = -1, j = Array(w.size);
    return w.forEach(function(ct) {
      j[++B] = ct;
    }), j;
  }
  var Ue = Array.prototype, Ze = Function.prototype, Oe = Object.prototype, Jt = at["__core-js_shared__"], De = function() {
    var w = /[^.]+$/.exec(Jt && Jt.keys && Jt.keys.IE_PROTO || "");
    return w ? "Symbol(src)_1." + w : "";
  }(), Ge = Ze.toString, He = Oe.hasOwnProperty, me = Oe.toString, te = RegExp(
    "^" + Ge.call(He).replace(nt, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), qn = At ? at.Buffer : void 0, Wn = at.Symbol, I = at.Uint8Array, z = ve(Object.getPrototypeOf, Object), m = Object.create, H = Oe.propertyIsEnumerable, ut = Ue.splice, bt = Object.getOwnPropertySymbols, qt = qn ? qn.isBuffer : void 0, re = ve(Object.keys, Object), Kt = R(at, "DataView"), Vt = R(at, "Map"), Yt = R(at, "Promise"), Fe = R(at, "Set"), pt = R(at, "WeakMap"), xt = R(Object, "create"), Wt = Et(Kt), se = Et(Vt), je = Et(Yt), ie = Et(Fe), cn = Et(pt), Qe = Wn ? Wn.prototype : void 0, Cr = Qe ? Qe.valueOf : void 0;
  function Zn(w) {
    var B = -1, j = w ? w.length : 0;
    for (this.clear(); ++B < j; ) {
      var ct = w[B];
      this.set(ct[0], ct[1]);
    }
  }
  function An() {
    this.__data__ = xt ? xt(null) : {};
  }
  function vn(w) {
    return this.has(w) && delete this.__data__[w];
  }
  function kn(w) {
    var B = this.__data__;
    if (xt) {
      var j = B[w];
      return j === r ? void 0 : j;
    }
    return He.call(B, w) ? B[w] : void 0;
  }
  function Rt(w) {
    var B = this.__data__;
    return xt ? B[w] !== void 0 : He.call(B, w);
  }
  function Te(w, B) {
    var j = this.__data__;
    return j[w] = xt && B === void 0 ? r : B, this;
  }
  Zn.prototype.clear = An, Zn.prototype.delete = vn, Zn.prototype.get = kn, Zn.prototype.has = Rt, Zn.prototype.set = Te;
  function ln(w) {
    var B = -1, j = w ? w.length : 0;
    for (this.clear(); ++B < j; ) {
      var ct = w[B];
      this.set(ct[0], ct[1]);
    }
  }
  function Wr() {
    this.__data__ = [];
  }
  function js(w) {
    var B = this.__data__, j = Fn(B, w);
    if (j < 0)
      return !1;
    var ct = B.length - 1;
    return j == ct ? B.pop() : ut.call(B, j, 1), !0;
  }
  function un(w) {
    var B = this.__data__, j = Fn(B, w);
    return j < 0 ? void 0 : B[j][1];
  }
  function Tr(w) {
    return Fn(this.__data__, w) > -1;
  }
  function Hn(w, B) {
    var j = this.__data__, ct = Fn(j, w);
    return ct < 0 ? j.push([w, B]) : j[ct][1] = B, this;
  }
  ln.prototype.clear = Wr, ln.prototype.delete = js, ln.prototype.get = un, ln.prototype.has = Tr, ln.prototype.set = Hn;
  function xe(w) {
    var B = -1, j = w ? w.length : 0;
    for (this.clear(); ++B < j; ) {
      var ct = w[B];
      this.set(ct[0], ct[1]);
    }
  }
  function Br() {
    this.__data__ = {
      hash: new Zn(),
      map: new (Vt || ln)(),
      string: new Zn()
    };
  }
  function Co(w) {
    return d(this, w).delete(w);
  }
  function To(w) {
    return d(this, w).get(w);
  }
  function Bo(w) {
    return d(this, w).has(w);
  }
  function Rs(w, B) {
    return d(this, w).set(w, B), this;
  }
  xe.prototype.clear = Br, xe.prototype.delete = Co, xe.prototype.get = To, xe.prototype.has = Bo, xe.prototype.set = Rs;
  function Dn(w) {
    this.__data__ = new ln(w);
  }
  function $n() {
    this.__data__ = new ln();
  }
  function Mo(w) {
    return this.__data__.delete(w);
  }
  function zs(w) {
    return this.__data__.get(w);
  }
  function No(w) {
    return this.__data__.has(w);
  }
  function Zr(w, B) {
    var j = this.__data__;
    if (j instanceof ln) {
      var ct = j.__data__;
      if (!Vt || ct.length < n - 1)
        return ct.push([w, B]), this;
      j = this.__data__ = new xe(ct);
    }
    return j.set(w, B), this;
  }
  Dn.prototype.clear = $n, Dn.prototype.delete = Mo, Dn.prototype.get = zs, Dn.prototype.has = No, Dn.prototype.set = Zr;
  function Qr(w, B) {
    var j = ke(w) || ge(w) ? on(w.length, String) : [], ct = j.length, Re = !!ct;
    for (var Ke in w)
      He.call(w, Ke) && !(Re && (Ke == "length" || G(Ke, ct))) && j.push(Ke);
    return j;
  }
  function Jr(w, B, j) {
    var ct = w[B];
    (!(He.call(w, B) && oe(ct, j)) || j === void 0 && !(B in w)) && (w[B] = j);
  }
  function Fn(w, B) {
    for (var j = w.length; j--; )
      if (oe(w[j][0], B))
        return j;
    return -1;
  }
  function Gs(w, B) {
    return w && f(B, Je(B), w);
  }
  function ur(w, B, j, ct, Re, Ke, bn) {
    var Ve;
    if (ct && (Ve = Ke ? ct(w, Re, Ke, bn) : ct(w)), Ve !== void 0)
      return Ve;
    if (!zt(w))
      return w;
    var Xs = ke(w);
    if (Xs) {
      if (Ve = O(w), !B)
        return Di(w, Ve);
    } else {
      var Qn = A(w), rs = Qn == h || Qn == l;
      if (ma(w))
        return jn(w, B);
      if (Qn == S || Qn == i || rs && !Ke) {
        if (wn(w))
          return Ke ? w : {};
        if (Ve = V(rs ? {} : w), !B)
          return b(w, Gs(Ve, w));
      } else {
        if (!D[Qn])
          return Ke ? w : {};
        Ve = ht(w, Qn, ur, B);
      }
    }
    bn || (bn = new Dn());
    var Fi = bn.get(w);
    if (Fi)
      return Fi;
    if (bn.set(w, Ve), !Xs)
      var ji = j ? E(w) : Je(w);
    return de(ji || w, function(qs, Ws) {
      ji && (Ws = qs, qs = w[Ws]), Jr(Ve, Ws, ur(qs, B, j, ct, Ws, w, bn));
    }), Ve;
  }
  function ts(w) {
    return zt(w) ? m(w) : {};
  }
  function Ks(w, B, j) {
    var ct = B(w);
    return ke(w) ? ct : Ht(ct, j(w));
  }
  function he(w) {
    return me.call(w);
  }
  function Vs(w) {
    if (!zt(w) || ft(w))
      return !1;
    var B = ns(w) || wn(w) ? te : kt;
    return B.test(Et(w));
  }
  function Ys(w) {
    if (!et(w))
      return re(w);
    var B = [];
    for (var j in Object(w))
      He.call(w, j) && j != "constructor" && B.push(j);
    return B;
  }
  function jn(w, B) {
    if (B)
      return w.slice();
    var j = new w.constructor(w.length);
    return w.copy(j), j;
  }
  function Mr(w) {
    var B = new w.constructor(w.byteLength);
    return new I(B).set(new I(w)), B;
  }
  function pe(w, B) {
    var j = B ? Mr(w.buffer) : w.buffer;
    return new w.constructor(j, w.byteOffset, w.byteLength);
  }
  function Oi(w, B, j) {
    var ct = B ? j(On(w), !0) : On(w);
    return Ct(ct, jt, new w.constructor());
  }
  function Hi(w) {
    var B = new w.constructor(w.source, Z.exec(w));
    return B.lastIndex = w.lastIndex, B;
  }
  function Nr(w, B, j) {
    var ct = B ? j(an(w), !0) : an(w);
    return Ct(ct, Lt, new w.constructor());
  }
  function es(w) {
    return Cr ? Object(Cr.call(w)) : {};
  }
  function Pr(w, B) {
    var j = B ? Mr(w.buffer) : w.buffer;
    return new w.constructor(j, w.byteOffset, w.length);
  }
  function Di(w, B) {
    var j = -1, ct = w.length;
    for (B || (B = Array(ct)); ++j < ct; )
      B[j] = w[j];
    return B;
  }
  function f(w, B, j, ct) {
    j || (j = {});
    for (var Re = -1, Ke = B.length; ++Re < Ke; ) {
      var bn = B[Re], Ve = void 0;
      Jr(j, bn, Ve === void 0 ? w[bn] : Ve);
    }
    return j;
  }
  function b(w, B) {
    return f(w, p(w), B);
  }
  function E(w) {
    return Ks(w, Je, p);
  }
  function d(w, B) {
    var j = w.__data__;
    return tt(B) ? j[typeof B == "string" ? "string" : "hash"] : j.map;
  }
  function R(w, B) {
    var j = vt(w, B);
    return Vs(j) ? j : void 0;
  }
  var p = bt ? ve(bt, Object) : xa, A = he;
  (Kt && A(new Kt(new ArrayBuffer(1))) != X || Vt && A(new Vt()) != y || Yt && A(Yt.resolve()) != v || Fe && A(new Fe()) != U || pt && A(new pt()) != C) && (A = function(w) {
    var B = me.call(w), j = B == S ? w.constructor : void 0, ct = j ? Et(j) : void 0;
    if (ct)
      switch (ct) {
        case Wt:
          return X;
        case se:
          return y;
        case je:
          return v;
        case ie:
          return U;
        case cn:
          return C;
      }
    return B;
  });
  function O(w) {
    var B = w.length, j = w.constructor(B);
    return B && typeof w[0] == "string" && He.call(w, "index") && (j.index = w.index, j.input = w.input), j;
  }
  function V(w) {
    return typeof w.constructor == "function" && !et(w) ? ts(z(w)) : {};
  }
  function ht(w, B, j, ct) {
    var Re = w.constructor;
    switch (B) {
      case P:
        return Mr(w);
      case a:
      case c:
        return new Re(+w);
      case X:
        return pe(w, ct);
      case it:
      case q:
      case W:
      case $:
      case _:
      case x:
      case M:
      case K:
      case N:
        return Pr(w, ct);
      case y:
        return Oi(w, ct, j);
      case g:
      case F:
        return new Re(w);
      case T:
        return Hi(w);
      case U:
        return Nr(w, ct, j);
      case k:
        return es(w);
    }
  }
  function G(w, B) {
    return B = B ?? s, !!B && (typeof w == "number" || L.test(w)) && w > -1 && w % 1 == 0 && w < B;
  }
  function tt(w) {
    var B = typeof w;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? w !== "__proto__" : w === null;
  }
  function ft(w) {
    return !!De && De in w;
  }
  function et(w) {
    var B = w && w.constructor, j = typeof B == "function" && B.prototype || Oe;
    return w === j;
  }
  function Et(w) {
    if (w != null) {
      try {
        return Ge.call(w);
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
    return ur(w, !0, !0);
  }
  function oe(w, B) {
    return w === B || w !== w && B !== B;
  }
  function ge(w) {
    return Ln(w) && He.call(w, "callee") && (!H.call(w, "callee") || me.call(w) == i);
  }
  var ke = Array.isArray;
  function In(w) {
    return w != null && mt(w.length) && !ns(w);
  }
  function Ln(w) {
    return ae(w) && In(w);
  }
  var ma = qt || Sa;
  function ns(w) {
    var B = zt(w) ? me.call(w) : "";
    return B == h || B == l;
  }
  function mt(w) {
    return typeof w == "number" && w > -1 && w % 1 == 0 && w <= s;
  }
  function zt(w) {
    var B = typeof w;
    return !!w && (B == "object" || B == "function");
  }
  function ae(w) {
    return !!w && typeof w == "object";
  }
  function Je(w) {
    return In(w) ? Qr(w) : Ys(w);
  }
  function xa() {
    return [];
  }
  function Sa() {
    return !1;
  }
  t.exports = Zt;
})(Ac, Ac.exports);
var yS = Ac.exports;
const ey = /* @__PURE__ */ Ip(yS);
var pu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(pu || (pu = {}));
function wS(t, e) {
  return { type: pu.Address, version: t, hash160: e };
}
function bS(t) {
  return Mi.c32address(t.version, t.hash160);
}
const mS = (t) => zx(Yg(t)), xS = (t) => yt(mS(t));
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Kg.create(Yg, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function SS(t, e = "mainnet") {
  e = jg(e), t = typeof t == "string" ? Gt(t) : t;
  const n = _x(Fr.P2PKH, e), r = wS(n, xS(t));
  return bS(r);
}
function ES(t, e) {
  const n = We.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = SS(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new We.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function AS(t, e = null) {
  let n;
  e ? n = ES(t, e) : n = We.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Ph = "_blockstackDidCheckEchoReply", vS = "echoReply", kS = "authContinuation";
function $S(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function IS() {
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
  const n = $S(t.location.search), r = n[vS];
  if (r) {
    t[Ph] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[kS];
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
      this.appConfig = new Up();
    else
      throw new Vb("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new gh(e.sessionOptions) : this.store = new gh() : e ? this.store = new ph(e.sessionOptions) : this.store = new ph();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Xb().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new eu("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, dx(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = fx();
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
      if (IS())
        return Wi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Wi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = wm()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new va("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = We.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await wx(e))
      throw new va("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Sl(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await dh(s, i.private_key);
          } catch {
            if (Wi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Ce.isValidPrivateKey(i.private_key))
              throw new va("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await dh(s, c);
          } catch {
            Wi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new va("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = om, h;
    Sl(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Sl(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (h = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: Hg(i.iss),
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
        l.profile = Object.assign({}, zb);
      else {
        const S = await g.text(), v = JSON.parse(S);
        l.profile = AS(v[0].token);
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
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), o2(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), a2(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
gu.prototype.makeAuthRequest = gu.prototype.makeAuthRequestToken;
const LS = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], CS = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = LS(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!nl(r.id));
  return e.concat(n);
}, nl = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), ny = "STX_PROVIDER", yi = () => typeof window > "u" ? null : window.localStorage.getItem(ny), TS = (t) => {
  typeof window < "u" && window.localStorage.setItem(ny, t);
}, BS = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function MS(t, e) {
  const n = {};
  return Object.assign(n, BS, e), await fetch(t, n);
}
function NS(t) {
  let e = MS, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function PS(...t) {
  const { fetchLib: e, middlewares: n } = NS(t);
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
var wi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(wi || (wi = {}));
var _h;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_h || (_h = {}));
const _S = "https://api.mainnet.hiro.so", US = "https://api.testnet.hiro.so", OS = "http://localhost:3999", HS = ["mainnet", "testnet", "devnet", "mocknet"];
class bi {
  constructor(e) {
    this.version = wi.Mainnet, this.chainId = po.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === wi.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? PS();
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
bi.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new yu();
    case "testnet":
      return new wu();
    case "devnet":
      return new DS();
    case "mocknet":
      return new ry();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${HS.join(", ")}`);
  }
};
bi.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : bi.fromName(t);
class yu extends bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _S,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wi.Mainnet, this.chainId = po.Mainnet;
  }
}
class wu extends bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? US,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wi.Testnet, this.chainId = po.Testnet;
  }
}
class ry extends bi {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? OS,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = wi.Testnet, this.chainId = po.Testnet;
  }
}
const DS = ry;
var mi;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(mi || (mi = {}));
var vc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(vc || (vc = {}));
mi.Mainnet;
var xi;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(xi || (xi = {}));
var Si;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(Si || (Si = {}));
xi.Mainnet;
const FS = {
  chainId: mi.Mainnet,
  transactionVersion: xi.Mainnet,
  peerNetworkId: vc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: Si.MainnetSingleSig,
    multiSig: Si.MainnetMultiSig
  },
  client: { baseUrl: Np }
}, bu = {
  chainId: mi.Testnet,
  transactionVersion: xi.Testnet,
  peerNetworkId: vc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: Si.TestnetSingleSig,
    multiSig: Si.TestnetMultiSig
  },
  client: { baseUrl: Pp }
}, oc = {
  ...bu,
  addressVersion: { ...bu.addressVersion },
  magicBytes: "id",
  client: { baseUrl: _p }
}, jS = {
  ...oc,
  addressVersion: { ...oc.addressVersion },
  client: { ...oc.client }
};
function RS(t) {
  switch (t) {
    case "mainnet":
      return FS;
    case "testnet":
      return bu;
    case "devnet":
      return oc;
    case "mocknet":
      return jS;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function zS(t) {
  return typeof t == "string" ? RS(t) : t;
}
function GS(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Uh = /* @__PURE__ */ new Map();
function sy(t, e) {
  const n = Uh.get(t);
  if (n !== void 0)
    return n(e);
  const r = GS(t);
  return Uh.set(t, r), sy(t, e);
}
let ue = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Gt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return hm(this.readBytes(4), 0);
  }
  readUInt8() {
    return fm(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return lm(this.readBytes(2), 0);
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
    if (sy(e, r))
      return r;
    throw n(r);
  }
};
const KS = 128, VS = 128, iy = 16, ai = 32, mu = 80, rl = 65, YS = 32, XS = 64, kc = 34, qS = 1 + 16 * 1024 * 1024, WS = 165, ZS = 16, QS = 16, JS = 20, tE = QS + 2 + JS, eE = tE + 4, nE = qS + (WS + ZS * eE);
var Qt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Qt || (Qt = {}));
var xu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(xu || (xu = {}));
var Tn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Tn || (Tn = {}));
const Ll = ["onChainOnly", "offChainOnly", "any"];
Ll[0] + "", Tn.OnChainOnly, Ll[1] + "", Tn.OffChainOnly, Ll[2] + "", Tn.Any, Tn.OnChainOnly + "", Tn.OnChainOnly, Tn.OffChainOnly + "", Tn.OffChainOnly, Tn.Any + "", Tn.Any;
var $c;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})($c || ($c = {}));
var ye;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(ye || (ye = {}));
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
var Xo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Xo || (Xo = {}));
var Su;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Su || (Su = {}));
var Eu;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Eu || (Eu = {}));
var pn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(pn || (pn = {}));
var Oh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Oh || (Oh = {}));
var Au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Au || (Au = {}));
var sr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(sr || (sr = {}));
var Hh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Hh || (Hh = {}));
let sl = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Zi = class extends sl {
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
}, ri = class extends sl {
  constructor(e) {
    super(e);
  }
};
function vu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rE(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function oy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sE(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  vu(t.outputLen), vu(t.blockLen);
}
function iE(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function oE(t, e) {
  oy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const si = {
  number: vu,
  bool: rE,
  bytes: oy,
  hash: sE,
  exists: iE,
  output: oE
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Cl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, aE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!aE)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cE(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Bf(t) {
  if (typeof t == "string" && (t = cE(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let ay = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Ni(t) {
  const e = (r) => t().update(Bf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let cy = class extends ay {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, si.hash(e);
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
    return si.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    si.exists(this), si.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const ly = (t, e, n) => new cy(t, e).update(n).digest();
ly.create = (t, e) => new cy(t, e);
function lE(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Mf = class extends ay {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Cl(this.buffer);
  }
  update(e) {
    si.exists(this);
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
    si.exists(this), si.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    lE(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const uE = (t, e, n) => t & e ^ ~t & n, fE = (t, e, n) => t & e ^ t & n ^ e & n, dE = new Uint32Array([
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
let uy = class extends Mf {
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
      const y = bs[l - 15], g = bs[l - 2], S = hr(y, 7) ^ hr(y, 18) ^ y >>> 3, v = hr(g, 17) ^ hr(g, 19) ^ g >>> 10;
      bs[l] = v + bs[l - 7] + S + bs[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), g = h + y + uE(a, c, u) + dE[l] + bs[l] | 0, v = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + fE(r, s, i) | 0;
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
}, hE = class extends uy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Nf = Ni(() => new uy());
Ni(() => new hE());
const pE = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), fy = Uint8Array.from({ length: 16 }, (t, e) => e), gE = fy.map((t) => (9 * t + 5) % 16);
let Pf = [fy], _f = [gE];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, _f])
    e.push(e[t].map((n) => pE[n]));
const dy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), yE = Pf.map((t, e) => t.map((n) => dy[e][n])), wE = _f.map((t, e) => t.map((n) => dy[e][n])), bE = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mE = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Oa = (t, e) => t << e | t >>> 32 - e;
function Dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Ha = new Uint32Array(16);
let xE = class extends Mf {
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
      const S = 4 - g, v = bE[g], T = mE[g], U = Pf[g], F = _f[g], k = yE[g], C = wE[g];
      for (let P = 0; P < 16; P++) {
        const X = Oa(r + Dh(g, i, a, u) + Ha[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Oa(a, 10) | 0, a = i, i = X;
      }
      for (let P = 0; P < 16; P++) {
        const X = Oa(s + Dh(S, o, c, h) + Ha[F[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = Oa(c, 10) | 0, c = o, o = X;
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
const SE = Ni(() => new xE()), Da = BigInt(2 ** 32 - 1), ku = BigInt(32);
function hy(t, e = !1) {
  return e ? { h: Number(t & Da), l: Number(t >> ku & Da) } : { h: Number(t >> ku & Da) | 0, l: Number(t & Da) | 0 };
}
function EE(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = hy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const AE = (t, e) => BigInt(t >>> 0) << ku | BigInt(e >>> 0), vE = (t, e, n) => t >>> n, kE = (t, e, n) => t << 32 - n | e >>> n, $E = (t, e, n) => t >>> n | e << 32 - n, IE = (t, e, n) => t << 32 - n | e >>> n, LE = (t, e, n) => t << 64 - n | e >>> n - 32, CE = (t, e, n) => t >>> n - 32 | e << 64 - n, TE = (t, e) => e, BE = (t, e) => t, ME = (t, e, n) => t << n | e >>> 32 - n, NE = (t, e, n) => e << n | t >>> 32 - n, PE = (t, e, n) => e << n - 32 | t >>> 64 - n, _E = (t, e, n) => t << n - 32 | e >>> 64 - n;
function UE(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const OE = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), HE = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, DE = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), FE = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, jE = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), RE = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: hy,
  split: EE,
  toBig: AE,
  shrSH: vE,
  shrSL: kE,
  rotrSH: $E,
  rotrSL: IE,
  rotrBH: LE,
  rotrBL: CE,
  rotr32H: TE,
  rotr32L: BE,
  rotlSH: ME,
  rotlSL: NE,
  rotlBH: PE,
  rotlBL: _E,
  add: UE,
  add3L: OE,
  add3H: HE,
  add4L: DE,
  add4H: FE,
  add5H: RE,
  add5L: jE
}, [zE, GE] = Mt.split([
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
let il = class extends Mf {
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
      const C = ms[k - 15] | 0, P = xs[k - 15] | 0, X = Mt.rotrSH(C, P, 1) ^ Mt.rotrSH(C, P, 8) ^ Mt.shrSH(C, P, 7), it = Mt.rotrSL(C, P, 1) ^ Mt.rotrSL(C, P, 8) ^ Mt.shrSL(C, P, 7), q = ms[k - 2] | 0, W = xs[k - 2] | 0, $ = Mt.rotrSH(q, W, 19) ^ Mt.rotrBH(q, W, 61) ^ Mt.shrSH(q, W, 6), _ = Mt.rotrSL(q, W, 19) ^ Mt.rotrBL(q, W, 61) ^ Mt.shrSL(q, W, 6), x = Mt.add4L(it, _, xs[k - 7], xs[k - 16]), M = Mt.add4H(x, X, $, ms[k - 7], ms[k - 16]);
      ms[k] = M | 0, xs[k] = x | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Mt.rotrSH(l, y, 14) ^ Mt.rotrSH(l, y, 18) ^ Mt.rotrBH(l, y, 41), P = Mt.rotrSL(l, y, 14) ^ Mt.rotrSL(l, y, 18) ^ Mt.rotrBL(l, y, 41), X = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Mt.add5L(F, P, it, GE[k], xs[k]), W = Mt.add5H(q, U, C, X, zE[k], ms[k]), $ = q | 0, _ = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), x = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), M = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Mt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Mt.add3L($, x, K);
      r = Mt.add3H(N, W, _, M), s = N | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Mt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Mt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Mt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Mt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    ms.fill(0), xs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, KE = class extends il {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, VE = class extends il {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, YE = class extends il {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Ni(() => new il());
Ni(() => new KE());
const XE = Ni(() => new VE());
Ni(() => new YE());
var Dt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(Dt || (Dt = {}));
var ze;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(ze || (ze = {}));
function Uf(t) {
  return ze[t];
}
const qE = () => ({ type: Dt.BoolTrue }), WE = () => ({ type: Dt.BoolFalse }), ZE = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Dt.Buffer, value: yt(t) };
}, Fh = BigInt("0xffffffffffffffffffffffffffffffff"), QE = BigInt(0), jh = BigInt("0x7fffffffffffffffffffffffffffffff"), Rh = BigInt("-170141183460469231731687303715884105728"), JE = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = ru(Gt(t))), En(t, Uint8Array) && (t = ru(t));
  const e = sn(t);
  if (e > jh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jh}`);
  if (e < Rh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Rh}`);
  return { type: Dt.Int, value: e };
}, tA = (t) => {
  const e = sn(t);
  if (e < QE)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Fh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Fh}`);
  return { type: Dt.UInt, value: e };
};
function eA(t) {
  return { type: Dt.List, value: t };
}
function py() {
  return { type: Dt.OptionalNone };
}
function gy(t) {
  return { type: Dt.OptionalSome, value: t };
}
var ot;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ot || (ot = {}));
function nA() {
  return {
    type: ot.Address,
    version: Si.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function zh(t) {
  if (t && vy(t, kc))
    throw new Error(`Memo exceeds maximum length of ${kc} bytes`);
  return { type: ot.MemoString, content: t };
}
function Of(t, e) {
  return {
    type: ot.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function $u(t) {
  if (Gt(t).byteLength != rl)
    throw Error("Invalid signature");
  return {
    type: ot.MessageSignature,
    data: t
  };
}
function rA(t, e, n) {
  return typeof t == "string" && (t = mA(t)), typeof n == "string" && (n = zh(n)), {
    type: ot.Payload,
    payloadType: Qt.TokenTransfer,
    recipient: t,
    amount: sn(e),
    memo: n ?? zh("")
  };
}
function sA(t, e, n, r) {
  return typeof e == "string" && (e = ar(e)), typeof n == "string" && (n = ar(n)), {
    type: ot.Payload,
    payloadType: Qt.ContractCall,
    contractAddress: typeof t == "string" ? Fs(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function iA(t) {
  return ar(t, 4, 1e5);
}
function Gh(t, e, n) {
  return typeof t == "string" && (t = ar(t)), typeof e == "string" && (e = iA(e)), typeof n == "number" ? {
    type: ot.Payload,
    payloadType: Qt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ot.Payload,
    payloadType: Qt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function oA() {
  return { type: ot.Payload, payloadType: Qt.PoisonMicroblock };
}
function Kh(t, e) {
  if (t.byteLength != ai)
    throw Error(`Coinbase buffer size must be ${ai} bytes`);
  return e != null ? {
    type: ot.Payload,
    payloadType: Qt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ot.Payload,
    payloadType: Qt.Coinbase,
    coinbaseBytes: t
  };
}
function aA(t, e, n) {
  if (t.byteLength != ai)
    throw Error(`Coinbase buffer size must be ${ai} bytes`);
  if (n.byteLength != mu)
    throw Error(`VRF proof buffer size must be ${mu} bytes`);
  return {
    type: ot.Payload,
    payloadType: Qt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Dt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function cA(t, e, n, r, s, i, o) {
  return {
    type: ot.Payload,
    payloadType: Qt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function ar(t, e, n) {
  const r = e || 1, s = n || KS;
  if (vy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ot.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function lA(t, e, n) {
  return {
    type: ot.Asset,
    address: Fs(t),
    contractName: ar(e),
    assetName: ar(n)
  };
}
function Fs(t) {
  const e = Mi.c32addressDecode(t);
  return {
    type: ot.Address,
    version: e[0],
    hash160: e[1]
  };
}
function uA(t, e) {
  const n = Fs(t), r = ar(e);
  return {
    type: ot.Principal,
    prefix: pn.Contract,
    address: n,
    contractName: r
  };
}
function fA(t) {
  const e = Fs(t);
  return {
    type: ot.Principal,
    prefix: pn.Standard,
    address: e
  };
}
function Qi(t, e) {
  return {
    pubKeyEncoding: t,
    type: ot.TransactionAuthField,
    contents: e
  };
}
function Or(t) {
  switch (t.type) {
    case ot.Address:
      return ya(t);
    case ot.Principal:
      return yy(t);
    case ot.LengthPrefixedString:
      return yo(t);
    case ot.MemoString:
      return hA(t);
    case ot.Asset:
      return by(t);
    case ot.PostCondition:
      return xy(t);
    case ot.PublicKey:
      return Cu(t);
    case ot.LengthPrefixedList:
      return Hf(t);
    case ot.Payload:
      return Sy(t);
    case ot.TransactionAuthField:
      return bA(t);
    case ot.MessageSignature:
      return Df(t);
  }
}
function ya(t) {
  const e = [];
  return e.push(Gt(ua(t.version, 1))), e.push(Gt(t.hash160)), Pe(e);
}
function go(t) {
  const e = En(t, ue) ? t : new ue(t), n = Gc(yt(e.readBytes(1))), r = yt(e.readBytes(20));
  return { type: ot.Address, version: n, hash160: r };
}
function yy(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === pn.Standard || t.prefix === pn.Contract) && e.push(ya(t.address)), t.prefix === pn.Contract && e.push(yo(t.contractName)), Pe(e);
}
function dA(t) {
  const e = En(t, ue) ? t : new ue(t), n = e.readUInt8Enum(pn, (i) => {
    throw new dn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === pn.Origin)
    return { type: ot.Principal, prefix: n };
  const r = go(e);
  if (n === pn.Standard)
    return { type: ot.Principal, prefix: n, address: r };
  const s = Vn(e);
  return {
    type: ot.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function yo(t) {
  const e = [], n = Li(t.content), r = n.byteLength;
  return e.push(Gt(ua(r, t.lengthPrefixBytes))), e.push(n), Pe(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = En(t, ue) ? t : new ue(t), s = Gc(yt(r.readBytes(e))), i = fa(r.readBytes(s));
  return ar(i, e, n ?? 128);
}
function hA(t) {
  const e = [], n = Li(t.content), r = jA(yt(n), kc * 2);
  return e.push(Gt(r)), Pe(e);
}
function wy(t) {
  const e = En(t, ue) ? t : new ue(t);
  let n = fa(e.readBytes(kc));
  return n = n.replace(/\u0000*$/, ""), { type: ot.MemoString, content: n };
}
function by(t) {
  const e = [];
  return e.push(ya(t.address)), e.push(yo(t.contractName)), e.push(yo(t.assetName)), Pe(e);
}
function Iu(t) {
  const e = En(t, ue) ? t : new ue(t);
  return {
    type: ot.Asset,
    address: go(e),
    contractName: Vn(e),
    assetName: Vn(e)
  };
}
function Hf(t) {
  const e = t.values, n = [];
  n.push(Gt(ua(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Or(r));
  return Pe(n);
}
function my(t, e, n) {
  const r = En(t, ue) ? t : new ue(t), s = Gc(yt(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case ot.Address:
        i.push(go(r));
        break;
      case ot.LengthPrefixedString:
        i.push(Vn(r));
        break;
      case ot.MemoString:
        i.push(wy(r));
        break;
      case ot.Asset:
        i.push(Iu(r));
        break;
      case ot.PostCondition:
        i.push(gA(r));
        break;
      case ot.PublicKey:
        i.push(Tu(r));
        break;
      case ot.TransactionAuthField:
        i.push(wA(r));
        break;
    }
  return Of(i, n);
}
function pA(t) {
  return yt(xy(t));
}
function xy(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(yy(t.principal)), (t.conditionType === ye.Fungible || t.conditionType === ye.NonFungible) && e.push(by(t.asset)), t.conditionType === ye.NonFungible && e.push(Sr(t.assetName)), e.push(t.conditionCode), t.conditionType === ye.STX || t.conditionType === ye.Fungible || t.conditionType === ye.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Zi("The post-condition amount may not be larger than 8 bytes");
    e.push(Hs(t.amount, 8));
  }
  return Pe(e);
}
function gA(t) {
  const e = En(t, ue) ? t : new ue(t), n = e.readUInt8Enum(ye, (a) => {
    throw new dn(`Could not read ${a} as PostConditionType`);
  }), r = dA(e);
  let s, i, o;
  switch (n) {
    case ye.STX:
      return s = e.readUInt8Enum(Xo, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ye.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ye.Fungible:
      return i = Iu(e), s = e.readUInt8Enum(Xo, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ye.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case ye.NonFungible:
      i = Iu(e);
      const a = br(e);
      return s = e.readUInt8Enum(Su, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: ot.PostCondition,
        conditionType: ye.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case ye.Staking:
      return s = e.readUInt8Enum(Xo, (c) => {
        throw new dn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${yt(e.readBytes(8))}`), {
        type: ot.PostCondition,
        conditionType: ye.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case ye.PoX: {
      const c = e.readUInt8Enum(Eu, (u) => {
        throw new dn(`Could not read ${u} as PoxConditionCode`);
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
function Sy(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Qt.TokenTransfer:
      e.push(Sr(t.recipient)), e.push(Hs(t.amount, 8)), e.push(Or(t.memo));
      break;
    case Qt.ContractCall:
      e.push(Or(t.contractAddress)), e.push(Or(t.contractName)), e.push(Or(t.functionName));
      const n = new Uint8Array(4);
      fi(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Sr(r));
      });
      break;
    case Qt.SmartContract:
      e.push(Or(t.contractName)), e.push(Or(t.codeBody));
      break;
    case Qt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Or(t.contractName)), e.push(Or(t.codeBody));
      break;
    case Qt.PoisonMicroblock:
      break;
    case Qt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Qt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Sr(t.recipient));
      break;
    case Qt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Sr(t.recipient ? gy(t.recipient) : py())), e.push(t.vrfProof);
      break;
    case Qt.TenureChange:
      e.push(Gt(t.tenureHash)), e.push(Gt(t.previousTenureHash)), e.push(Gt(t.burnViewHash)), e.push(Gt(t.previousTenureEnd)), e.push(fi(new Uint8Array(4), t.previousTenureBlocks)), e.push(dm(new Uint8Array(1), t.cause)), e.push(Gt(t.publicKeyHash));
      break;
  }
  return Pe(e);
}
function yA(t) {
  const e = En(t, ue) ? t : new ue(t);
  switch (e.readUInt8Enum(Qt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Qt.TokenTransfer:
      const r = br(e), s = sn(e.readBytes(8)), i = wy(e);
      return rA(r, s, i);
    case Qt.ContractCall:
      const o = go(e), a = Vn(e), c = Vn(e), u = [], h = e.readUInt32BE();
      for (let C = 0; C < h; C++) {
        const P = br(e);
        u.push(P);
      }
      return sA(o, a, c, u);
    case Qt.SmartContract:
      const l = Vn(e), y = Vn(e, 4, 1e5);
      return Gh(l, y);
    case Qt.VersionedSmartContract: {
      const C = e.readUInt8Enum(xu, (it) => {
        throw new Error(`Cannot recognize ClarityVersion: ${it}`);
      }), P = Vn(e), X = Vn(e, 4, nE);
      return Gh(P, X, C);
    }
    case Qt.PoisonMicroblock:
      return oA();
    case Qt.Coinbase: {
      const C = e.readBytes(ai);
      return Kh(C);
    }
    case Qt.CoinbaseToAltRecipient: {
      const C = e.readBytes(ai), P = br(e);
      return Kh(C, P);
    }
    case Qt.NakamotoCoinbase: {
      const C = e.readBytes(ai), P = br(e), X = e.readBytes(mu);
      return aA(C, P, X);
    }
    case Qt.TenureChange:
      const g = yt(e.readBytes(20)), S = yt(e.readBytes(20)), v = yt(e.readBytes(20)), T = yt(e.readBytes(32)), U = e.readUInt32BE(), F = e.readUInt8Enum(Au, (C) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${C}`);
      }), k = yt(e.readBytes(20));
      return cA(g, S, v, T, U, F, k);
  }
}
function Lu(t) {
  const e = En(t, ue) ? t : new ue(t);
  return $u(yt(e.readBytes(rl)));
}
function wA(t) {
  const e = En(t, ue) ? t : new ue(t), n = e.readUInt8Enum(sr, (r) => {
    throw new dn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case sr.PublicKeyCompressed:
      return Qi(Ee.Compressed, Tu(e));
    case sr.PublicKeyUncompressed:
      return Qi(Ee.Uncompressed, vo(QA(Tu(e).data)));
    case sr.SignatureCompressed:
      return Qi(Ee.Compressed, Lu(e));
    case sr.SignatureUncompressed:
      return Qi(Ee.Uncompressed, Lu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function Df(t) {
  return Gt(t.data);
}
function bA(t) {
  const e = [];
  switch (t.contents.type) {
    case ot.PublicKey:
      e.push(t.pubKeyEncoding === Ee.Compressed ? sr.PublicKeyCompressed : sr.PublicKeyUncompressed), e.push(Gt(ZA(t.contents.data)));
      break;
    case ot.MessageSignature:
      e.push(t.pubKeyEncoding === Ee.Compressed ? sr.SignatureCompressed : sr.SignatureUncompressed), e.push(Df(t.contents));
      break;
  }
  return Pe(e);
}
function Cu(t) {
  return t.data.slice();
}
function Tu(t) {
  const e = En(t, ue) ? t : new ue(t), n = e.readUInt8(), r = n === 4 ? XS : YS;
  return vo(Pe([n, e.readBytes(r)]));
}
function Ff(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ce.P2PKH || e === ce.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ce.P2WPKH || e === ce.P2WSH || e === ce.P2WSHNonSequential) && !r.map((s) => s.data).every(ko))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ce.P2PKH:
      return Fa(t, RA(r[0].data));
    case ce.P2WPKH:
      return Fa(t, zA(r[0].data));
    case ce.P2SH:
    case ce.P2SHNonSequential:
      return Fa(t, GA(n, r.map(Cu)));
    case ce.P2WSH:
    case ce.P2WSHNonSequential:
      return Fa(t, KA(n, r.map(Cu)));
  }
}
function Fa(t, e) {
  return { type: ot.Address, version: t, hash160: e };
}
function jf(t) {
  return Mi.c32address(t.version, t.hash160);
}
function Vh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return lA(e, n, r);
}
function Oo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return uA(e, n);
  } else
    return fA(t);
}
function mA(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return EA(e, n);
  } else
    return xA(t);
}
function xA(t) {
  const e = Fs(t);
  return { type: Dt.PrincipalStandard, value: jf(e) };
}
function SA(t) {
  return { type: Dt.PrincipalStandard, value: jf(t) };
}
function EA(t, e) {
  const n = Fs(t), r = ar(e);
  return Ey(n, r);
}
function Ey(t, e) {
  if (Li(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: Dt.PrincipalContract,
    value: `${jf(t)}.${e.content}`
  };
}
function AA(t) {
  return { type: Dt.ResponseErr, value: t };
}
function vA(t) {
  return { type: Dt.ResponseOk, value: t };
}
const kA = (t) => ({ type: Dt.StringASCII, value: t }), $A = (t) => ({ type: Dt.StringUTF8, value: t });
function IA(t) {
  for (const e in t)
    if (!VA(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Dt.Tuple, value: t };
}
function br(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ue(Gt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ue(t) : e = t;
  switch (e.readUInt8Enum(ze, (r) => {
    throw new dn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case ze.int:
      return JE(ru(e.readBytes(16)));
    case ze.uint:
      return tA(e.readBytes(16));
    case ze.buffer:
      const r = e.readUInt32BE();
      return ZE(e.readBytes(r));
    case ze.true:
      return qE();
    case ze.false:
      return WE();
    case ze.address:
      const s = go(e);
      return SA(s);
    case ze.contract:
      const i = go(e), o = Vn(e);
      return Ey(i, o);
    case ze.ok:
      return vA(br(e));
    case ze.err:
      return AA(br(e));
    case ze.none:
      return py();
    case ze.some:
      return gy(br(e));
    case ze.list:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(br(e));
      return eA(c);
    case ze.tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Vn(e).content;
        if (T === void 0)
          throw new dn('"content" is undefined');
        h[T] = br(e);
      }
      return IA(h);
    case ze.ascii:
      const l = e.readUInt32BE(), y = sm(e.readBytes(l));
      return kA(y);
    case ze.utf8:
      const g = e.readUInt32BE(), S = fa(e.readBytes(g));
      return $A(S);
    default:
      throw new dn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function $r(t, e) {
  return Pe([Uf(t), e]);
}
function LA(t) {
  return new Uint8Array([Uf(t.type)]);
}
function CA(t) {
  return t.type === Dt.OptionalNone ? new Uint8Array([Uf(t.type)]) : $r(t.type, Sr(t.value));
}
function TA(t) {
  const e = new Uint8Array(4);
  return fi(e, Math.ceil(t.value.length / 2), 0), $r(t.type, vr(e, Gt(t.value)));
}
function BA(t) {
  const e = ff(Jb(BigInt(t.value), BigInt(VS)), iy);
  return $r(t.type, e);
}
function MA(t) {
  const e = ff(BigInt(t.value), iy);
  return $r(t.type, e);
}
function NA(t) {
  return $r(t.type, ya(Fs(t.value)));
}
function PA(t) {
  const [e, n] = YA(t.value);
  return $r(t.type, vr(ya(Fs(e)), yo(ar(n))));
}
function _A(t) {
  return $r(t.type, Sr(t.value));
}
function UA(t) {
  const e = [], n = new Uint8Array(4);
  fi(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = Sr(r);
    e.push(s);
  }
  return $r(t.type, Pe(e));
}
function OA(t) {
  const e = [], n = new Uint8Array(4);
  fi(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ar(s);
    e.push(yo(i));
    const o = Sr(t.value[s]);
    e.push(o);
  }
  return $r(t.type, Pe(e));
}
function Ay(t, e) {
  const n = [], r = e == "ascii" ? rm(t.value) : Li(t.value), s = new Uint8Array(4);
  return fi(s, r.length, 0), n.push(s), n.push(r), $r(t.type, Pe(n));
}
function HA(t) {
  return Ay(t, "ascii");
}
function DA(t) {
  return Ay(t, "utf8");
}
function Yh(t) {
  return yt(Sr(t));
}
function Sr(t) {
  switch (t.type) {
    case Dt.BoolTrue:
    case Dt.BoolFalse:
      return LA(t);
    case Dt.OptionalNone:
    case Dt.OptionalSome:
      return CA(t);
    case Dt.Buffer:
      return TA(t);
    case Dt.UInt:
      return MA(t);
    case Dt.Int:
      return BA(t);
    case Dt.PrincipalStandard:
      return NA(t);
    case Dt.PrincipalContract:
      return PA(t);
    case Dt.ResponseOk:
    case Dt.ResponseErr:
      return _A(t);
    case Dt.List:
      return UA(t);
    case Dt.Tuple:
      return OA(t);
    case Dt.StringASCII:
      return HA(t);
    case Dt.StringUTF8:
      return DA(t);
    default:
      throw new Zi("Unable to serialize. Invalid Clarity Value.");
  }
}
const FA = (t) => t.length % 2 ? `0${t}` : t, jA = (t, e) => t.padEnd(e, "0"), vy = (t, e) => t ? Li(t).length > e : !1;
function Bu(t) {
  return ey(t);
}
const ta = (t) => SE(Nf(t)), Rf = (t) => yt(XE(t)), RA = (t) => yt(ta(t)), zA = (t) => {
  const e = ta(t), n = vr(new Uint8Array([0]), new Uint8Array([e.length]), e), r = ta(n);
  return yt(r);
}, GA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = ta(r);
  return yt(s);
}, KA = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = Nf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Pe(i), a = ta(o);
  return yt(a);
};
function VA(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function YA(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Ce.hmacSha256Sync = (t, ...e) => {
  const n = ly.create(Nf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function vo(t) {
  return t = typeof t == "string" ? Gt(t) : t, {
    type: ot.PublicKey,
    data: t
  };
}
function XA(t, e, n = Ee.Compressed) {
  const r = cm(e), s = new Pn(Yd(r.r), Yd(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === Ee.Compressed;
  return i.toHex(o);
}
function qA(t) {
  return typeof t == "string" ? t : yt(t);
}
const zf = qA;
function ky(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === am;
}
function ko(t) {
  return !zf(t).startsWith("04");
}
function WA(t) {
  t = df(t);
  const e = ky(t);
  return yt(da(t.slice(0, 32), e));
}
function ZA(t) {
  return Ut.fromHex(zf(t)).toHex(!0);
}
function QA(t) {
  return Ut.fromHex(zf(t)).toHex(!1);
}
function JA(t, e) {
  t = df(t);
  const [n, r] = Vc(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return ua(r, 1) + Pn.fromHex(n).toCompactHex();
}
function Gf() {
  return {
    type: ot.MessageSignature,
    data: yt(new Uint8Array(rl))
  };
}
function $y(t, e, n, r) {
  const s = Ff(0, t, 1, [vo(e)]).hash160, i = ko(e) ? Ee.Compressed : Ee.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: sn(n),
    fee: sn(r),
    keyEncoding: i,
    signature: Gf()
  };
}
function ea(t) {
  return "signature" in t;
}
function Xh(t) {
  return t === ce.P2SH || t === ce.P2WSH;
}
function t3(t) {
  return t === ce.P2SHNonSequential || t === ce.P2WSHNonSequential;
}
function qh(t) {
  const e = Bu(t);
  return e.nonce = 0, e.fee = 0, ea(e) ? e.signature = Gf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function e3(t) {
  const e = [
    t.hashMode,
    Gt(t.signer),
    Hs(t.nonce, 8),
    Hs(t.fee, 8),
    t.keyEncoding,
    Df(t.signature)
  ];
  return Pe(e);
}
function n3(t) {
  const e = [
    t.hashMode,
    Gt(t.signer),
    Hs(t.nonce, 8),
    Hs(t.fee, 8)
  ], n = Of(t.fields);
  e.push(Hf(n));
  const r = new Uint8Array(2);
  return um(r, t.signaturesRequired, 0), e.push(r), Pe(e);
}
function r3(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt(`0x${yt(e.readBytes(8))}`), s = BigInt(`0x${yt(e.readBytes(8))}`), i = e.readUInt8Enum(Ee, (a) => {
    throw new dn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ce.P2WPKH && i != Ee.Compressed)
    throw new dn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function s3(t, e) {
  const n = yt(e.readBytes(20)), r = BigInt("0x" + yt(e.readBytes(8))), s = BigInt("0x" + yt(e.readBytes(8))), i = my(e, ot.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ot.PublicKey:
        ko(u.contents.data) || (o = !0);
        break;
      case ot.MessageSignature:
        if (u.pubKeyEncoding === Ee.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new ri("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ce.P2WSH || t === ce.P2WSHNonSequential))
    throw new ri("Uncompressed keys are not allowed in this hash mode");
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
  return ea(t) ? e3(t) : n3(t);
}
function Bl(t) {
  const e = t.readUInt8Enum(ce, (n) => {
    throw new dn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ce.P2PKH || e === ce.P2WPKH ? r3(e, t) : s3(e, t);
}
function Iy(t, e, n, r) {
  const i = t + yt(new Uint8Array([e])) + yt(Hs(n, 8)) + yt(Hs(r, 8));
  if (Gt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return Rf(Gt(i));
}
function Ly(t, e, n) {
  const r = 33 + rl, s = ko(e.data) ? Ee.Compressed : Ee.Uncompressed, i = t + FA(s.toString(16)) + n, o = Gt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return Rf(o);
}
function i3(t, e, n, r, s) {
  const i = Iy(t, e, n, r), o = JA(s, i), a = vo(WA(s)), c = Ly(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Cy(t, e, n, r, s, i) {
  const o = Iy(t, e, n, r), a = vo(XA(o, i, s)), c = Ly(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function o3() {
  const t = $y(ce.P2PKH, "", 0, 0);
  return t.signer = nA().hash160, t.keyEncoding = Ee.Compressed, t.signature = Gf(), t;
}
function Wh(t, e, n) {
  return ea(t) ? a3(t, e, n) : c3(t, e, n);
}
function a3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Cy(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = Ff(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new ri(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function c3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ot.PublicKey:
        ko(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case ot.MessageSignature:
        c.pubKeyEncoding === Ee.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = Cy(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (Xh(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new ri("Too many signatures");
        break;
    }
  if (Xh(t.hashMode) && o !== t.signaturesRequired || t3(t.hashMode) && o < t.signaturesRequired)
    throw new ri("Incorrect number of signatures");
  if (i && (t.hashMode === ce.P2WSH || t.hashMode === ce.P2WSHNonSequential))
    throw new ri("Uncompressed keys are not allowed in this hash mode");
  const a = Ff(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new ri(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Ty(t) {
  return {
    authType: Ie.Standard,
    spendingCondition: t
  };
}
function By(t, e) {
  return {
    authType: Ie.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || $y(ce.P2PKH, "0".repeat(66), 0, 0)
  };
}
function Zh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ie.Standard:
        return Ty(qh(t.spendingCondition));
      case Ie.Sponsored:
        return By(qh(t.spendingCondition), o3());
      default:
        throw new Ic("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function l3(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      return Wh(t.spendingCondition, e, Ie.Standard);
    case Ie.Sponsored:
      return Wh(t.spendingCondition, e, Ie.Standard);
    default:
      throw new Ic("Invalid origin auth type");
  }
}
function u3(t, e) {
  switch (t.authType) {
    case Ie.Standard:
      const n = {
        ...t.spendingCondition,
        fee: sn(e)
      };
      return { ...t, spendingCondition: n };
    case Ie.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: sn(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function f3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function d3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: sn(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function h3(t, e) {
  const n = {
    ...e,
    nonce: sn(e.nonce),
    fee: sn(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function p3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ie.Standard:
      e.push(Tl(t.spendingCondition));
      break;
    case Ie.Sponsored:
      e.push(Tl(t.spendingCondition)), e.push(Tl(t.sponsorSpendingCondition));
      break;
  }
  return Pe(e);
}
function g3(t) {
  const e = t.readUInt8Enum(Ie, (r) => {
    throw new dn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ie.Standard:
      return n = Bl(t), Ty(n);
    case Ie.Sponsored:
      n = Bl(t);
      const r = Bl(t);
      return By(n, r);
  }
}
class y3 {
  constructor({ auth: e, payload: n, postConditions: r = Of([]), postConditionMode: s = $c.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = zS(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: sn(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Tn.Any;
  }
  signBegin() {
    const e = Bu(this);
    return e.auth = Zh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Bu(this);
    return e.auth = Zh(e.auth), e.txid();
  }
  verifyOrigin() {
    return l3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : vo(e), r = this.auth.spendingCondition;
    if (r && !ea(r)) {
      const s = ko(n.data);
      r.fields.push(Qi(s ? Ee.Compressed : Ee.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = i3(n, r, e.fee, e.nonce, s);
    if (ea(e))
      e.signature = $u(i);
    else {
      const a = ky(s);
      e.fields.push(Qi(a ? Ee.Compressed : Ee.Uncompressed, $u(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return Rf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = h3(this.auth, e);
  }
  setFee(e) {
    this.auth = u3(this.auth, e);
  }
  setNonce(e) {
    this.auth = f3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ie.Sponsored)
      throw new Ic("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d3(this.auth, e);
  }
  serialize() {
    return yt(this.serializeBytes());
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
    return fi(n, this.chainId, 0), e.push(n), e.push(p3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(Hf(this.postConditions)), e.push(Sy(this.payload)), Pe(e);
  }
}
function w3(t) {
  const e = En(t, ue) ? t : new ue(t), n = e.readUInt8Enum(xi, (h) => {
    throw new Error(`Could not parse ${h} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = g3(e), i = e.readUInt8Enum(Tn, (h) => {
    throw new Error(`Could not parse ${h} as AnchorMode`);
  }), o = e.readUInt8Enum($c, (h) => {
    throw new Error(`Could not parse ${h} as PostConditionMode`);
  }), a = my(e, ot.PostCondition), c = yA(e), u = new y3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const Qh = BigInt("18446744073709551615");
function Ml(t) {
  const e = sn(t);
  if (e < 0n || e > Qh)
    throw new RangeError(`Post-condition amount must be between 0 and ${Qh} (u64 max), received: ${e}`);
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
function b3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.STX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Ml(t.amount)
      };
    case "ft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.Fungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Ml(t.amount),
        asset: Vh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.NonFungible,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        asset: Vh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.Staking,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: ja(t.condition),
        amount: Ml(t.amount)
      };
    case "pox-postcondition":
      return {
        type: ot.PostCondition,
        conditionType: ye.PoX,
        principal: t.address === "origin" ? { type: ot.Principal, prefix: pn.Origin } : Oo(t.address),
        conditionCode: m3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ja(t) {
  return Mu[t];
}
function m3(t) {
  return Nu[t];
}
function My(t) {
  const e = b3(t);
  return pA(e);
}
function x3(t, e, n) {
  return Vf(Ny(t), n);
}
function Ny(t, e) {
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
    return BigInt(`0x${A3(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Kf(t, e = 8) {
  return (typeof t == "bigint" ? t : Ny(t)).toString(16).padStart(e * 2, "0");
}
function Vf(t, e = 16) {
  const n = Kf(t, e);
  return na(n);
}
function S3(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
const E3 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function A3(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += E3[n];
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
function Yf(t) {
  return new TextEncoder().encode(t);
}
function v3(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function k3(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Jh(t) {
  if (t.some(k3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Xf(...t) {
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
  return Xf(...t.map((e) => typeof e == "number" ? Jh([e]) : e instanceof Array ? Jh(e) : e));
}
function ol(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var Pu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Pu || (Pu = {}));
Pu.Mainnet;
const $3 = 128, I3 = 128, Py = 16;
var _u;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(_u || (_u = {}));
var t0;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(t0 || (t0 = {}));
var e0;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(e0 || (e0 = {}));
var nr;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(nr || (nr = {}));
const Nl = ["onChainOnly", "offChainOnly", "any"];
Nl[0] + "", nr.OnChainOnly, Nl[1] + "", nr.OffChainOnly, Nl[2] + "", nr.Any, nr.OnChainOnly + "", nr.OnChainOnly, nr.OffChainOnly + "", nr.OffChainOnly, nr.Any + "", nr.Any;
var Uu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Uu || (Uu = {}));
Uu.Mainnet;
var n0;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(n0 || (n0 = {}));
var Js;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Js || (Js = {}));
var r0;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(r0 || (r0 = {}));
var s0;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(s0 || (s0 = {}));
var i0;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(i0 || (i0 = {}));
var o0;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(o0 || (o0 = {}));
var a0;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(a0 || (a0 = {}));
var c0;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(c0 || (c0 = {}));
var Ou;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Ou || (Ou = {}));
var l0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(l0 || (l0 = {}));
var u0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(u0 || (u0 = {}));
function Hu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function L3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function _y(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function C3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Hu(t.outputLen), Hu(t.blockLen);
}
function T3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function B3(t, e) {
  _y(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Pl = {
  number: Hu,
  bool: L3,
  bytes: _y,
  hash: C3,
  exists: T3,
  output: B3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _l = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), pr = (t, e) => t << 32 - e | t >>> e, M3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!M3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function N3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Uy(t) {
  if (typeof t == "string" && (t = N3(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let P3 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function Pi(t) {
  const e = (r) => t().update(Uy(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let qf = class extends P3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _l(this.buffer);
  }
  update(e) {
    Pl.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Uy(e);
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
    _3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
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
const U3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), Oy = Uint8Array.from({ length: 16 }, (t, e) => e), O3 = Oy.map((t) => (9 * t + 5) % 16);
let Wf = [Oy], Zf = [O3];
for (let t = 0; t < 4; t++)
  for (let e of [Wf, Zf])
    e.push(e[t].map((n) => U3[n]));
const Hy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), H3 = Wf.map((t, e) => t.map((n) => Hy[e][n])), D3 = Zf.map((t, e) => t.map((n) => Hy[e][n])), F3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ra = (t, e) => t << e | t >>> 32 - e;
function f0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const za = new Uint32Array(16);
let R3 = class extends qf {
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
      const S = 4 - g, v = F3[g], T = j3[g], U = Wf[g], F = Zf[g], k = H3[g], C = D3[g];
      for (let P = 0; P < 16; P++) {
        const X = Ra(r + f0(g, i, a, u) + za[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Ra(a, 10) | 0, a = i, i = X;
      }
      for (let P = 0; P < 16; P++) {
        const X = Ra(s + f0(S, o, c, h) + za[F[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = Ra(c, 10) | 0, c = o, o = X;
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
Pi(() => new R3());
const z3 = (t, e, n) => t & e ^ ~t & n, G3 = (t, e, n) => t & e ^ t & n ^ e & n, K3 = new Uint32Array([
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
let Dy = class extends qf {
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
      const y = Es[l - 15], g = Es[l - 2], S = pr(y, 7) ^ pr(y, 18) ^ y >>> 3, v = pr(g, 17) ^ pr(g, 19) ^ g >>> 10;
      Es[l] = v + Es[l - 7] + S + Es[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = pr(a, 6) ^ pr(a, 11) ^ pr(a, 25), g = h + y + z3(a, c, u) + K3[l] + Es[l] | 0, v = (pr(r, 2) ^ pr(r, 13) ^ pr(r, 22)) + G3(r, s, i) | 0;
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
}, V3 = class extends Dy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
Pi(() => new Dy());
Pi(() => new V3());
const Ga = BigInt(2 ** 32 - 1), Du = BigInt(32);
function Fy(t, e = !1) {
  return e ? { h: Number(t & Ga), l: Number(t >> Du & Ga) } : { h: Number(t >> Du & Ga) | 0, l: Number(t & Ga) | 0 };
}
function Y3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Fy(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const X3 = (t, e) => BigInt(t >>> 0) << Du | BigInt(e >>> 0), q3 = (t, e, n) => t >>> n, W3 = (t, e, n) => t << 32 - n | e >>> n, Z3 = (t, e, n) => t >>> n | e << 32 - n, Q3 = (t, e, n) => t << 32 - n | e >>> n, J3 = (t, e, n) => t << 64 - n | e >>> n - 32, tv = (t, e, n) => t >>> n - 32 | e << 64 - n, ev = (t, e) => e, nv = (t, e) => t, rv = (t, e, n) => t << n | e >>> 32 - n, sv = (t, e, n) => e << n | t >>> 32 - n, iv = (t, e, n) => e << n - 32 | t >>> 64 - n, ov = (t, e, n) => t << n - 32 | e >>> 64 - n;
function av(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cv = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), fv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, dv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: Fy,
  split: Y3,
  toBig: X3,
  shrSH: q3,
  shrSL: W3,
  rotrSH: Z3,
  rotrSL: Q3,
  rotrBH: J3,
  rotrBL: tv,
  rotr32H: ev,
  rotr32L: nv,
  rotlSH: rv,
  rotlSL: sv,
  rotlBH: iv,
  rotlBL: ov,
  add: av,
  add3L: cv,
  add3H: lv,
  add4L: uv,
  add4H: fv,
  add5H: hv,
  add5L: dv
}, [pv, gv] = Nt.split([
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
let al = class extends qf {
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
      const C = As[k - 15] | 0, P = vs[k - 15] | 0, X = Nt.rotrSH(C, P, 1) ^ Nt.rotrSH(C, P, 8) ^ Nt.shrSH(C, P, 7), it = Nt.rotrSL(C, P, 1) ^ Nt.rotrSL(C, P, 8) ^ Nt.shrSL(C, P, 7), q = As[k - 2] | 0, W = vs[k - 2] | 0, $ = Nt.rotrSH(q, W, 19) ^ Nt.rotrBH(q, W, 61) ^ Nt.shrSH(q, W, 6), _ = Nt.rotrSL(q, W, 19) ^ Nt.rotrBL(q, W, 61) ^ Nt.shrSL(q, W, 6), x = Nt.add4L(it, _, vs[k - 7], vs[k - 16]), M = Nt.add4H(x, X, $, As[k - 7], As[k - 16]);
      As[k] = M | 0, vs[k] = x | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Nt.rotrSH(l, y, 14) ^ Nt.rotrSH(l, y, 18) ^ Nt.rotrBH(l, y, 41), P = Nt.rotrSL(l, y, 14) ^ Nt.rotrSL(l, y, 18) ^ Nt.rotrBL(l, y, 41), X = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Nt.add5L(F, P, it, gv[k], vs[k]), W = Nt.add5H(q, U, C, X, pv[k], As[k]), $ = q | 0, _ = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), x = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), M = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Nt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Nt.add3L($, x, K);
      r = Nt.add3H(N, W, _, M), s = N | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Nt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Nt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Nt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Nt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    As.fill(0), vs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yv = class extends al {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wv = class extends al {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bv = class extends al {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
Pi(() => new al());
Pi(() => new yv());
Pi(() => new wv());
Pi(() => new bv());
function mv(t, e, n) {
  const s = $3;
  if (_v(t, s))
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
let xv = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, jy = class extends xv {
  constructor(e) {
    super(e);
  }
};
function cl(t) {
  const e = [];
  return e.push(na(Kf(t.version, 1))), e.push(na(t.hash160)), qr(e);
}
function Sv(t) {
  const e = [];
  return e.push(t.prefix), e.push(cl(t.address)), t.prefix === Ou.Contract && e.push(ra(t.contractName)), qr(e);
}
function ra(t) {
  const e = [], n = Yf(t.content), r = n.byteLength;
  return e.push(na(Kf(r, t.lengthPrefixBytes))), e.push(n), qr(e);
}
function Ev(t) {
  const e = [];
  return e.push(cl(t.address)), e.push(ra(t.contractName)), e.push(ra(t.assetName)), qr(e);
}
function Ry(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Sv(t.principal)), (t.conditionType === Js.Fungible || t.conditionType === Js.NonFungible) && e.push(Ev(t.assetInfo)), t.conditionType === Js.NonFungible && e.push(Ei(t.assetName)), e.push(t.conditionCode), t.conditionType === Js.STX || t.conditionType === Js.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new jy("The post-condition amount may not be larger than 8 bytes");
    e.push(x3(t.amount, !1, 8));
  }
  return qr(e);
}
function Ir(t, e) {
  return qr([t, e]);
}
function Av(t) {
  return new Uint8Array([t.type]);
}
function vv(t) {
  return t.type === Ye.OptionalNone ? new Uint8Array([t.type]) : Ir(t.type, Ei(t.value));
}
function kv(t) {
  const e = new Uint8Array(4);
  return ol(e, t.buffer.length, 0), Ir(t.type, Xf(e, t.buffer));
}
function $v(t) {
  const e = Vf(S3(t.value, BigInt(I3)), Py);
  return Ir(t.type, e);
}
function Iv(t) {
  const e = Vf(t.value, Py);
  return Ir(t.type, e);
}
function Lv(t) {
  return Ir(t.type, cl(t.address));
}
function Cv(t) {
  return Ir(t.type, Xf(cl(t.address), ra(t.contractName)));
}
function Tv(t) {
  return Ir(t.type, Ei(t.value));
}
function Bv(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ei(r);
    e.push(s);
  }
  return Ir(t.type, qr(e));
}
function Mv(t) {
  const e = [], n = new Uint8Array(4);
  ol(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = mv(s);
    e.push(ra(i));
    const o = Ei(t.data[s]);
    e.push(o);
  }
  return Ir(t.type, qr(e));
}
function zy(t, e) {
  const n = [], r = e == "ascii" ? v3(t.data) : Yf(t.data), s = new Uint8Array(4);
  return ol(s, r.length, 0), n.push(s), n.push(r), Ir(t.type, qr(n));
}
function Nv(t) {
  return zy(t, "ascii");
}
function Pv(t) {
  return zy(t, "utf8");
}
function Ei(t) {
  switch (t.type) {
    case Ye.BoolTrue:
    case Ye.BoolFalse:
      return Av(t);
    case Ye.OptionalNone:
    case Ye.OptionalSome:
      return vv(t);
    case Ye.Buffer:
      return kv(t);
    case Ye.UInt:
      return Iv(t);
    case Ye.Int:
      return $v(t);
    case Ye.PrincipalStandard:
      return Lv(t);
    case Ye.PrincipalContract:
      return Cv(t);
    case Ye.ResponseOk:
    case Ye.ResponseErr:
      return Tv(t);
    case Ye.List:
      return Bv(t);
    case Ye.Tuple:
      return Mv(t);
    case Ye.StringASCII:
      return Nv(t);
    case Ye.StringUTF8:
      return Pv(t);
    default:
      throw new jy("Unable to serialize. Invalid Clarity Value.");
  }
}
const _v = (t, e) => t ? Yf(t).length > e : !1, Uv = "connect-ui";
let ac, Gy, Bn = !1, Fu = !1;
const Xr = (t, e = "") => () => {
}, Ov = (t, e) => () => {
}, Hv = "{visibility:hidden}.hydrated{visibility:inherit}", d0 = {}, Dv = "http://www.w3.org/2000/svg", Fv = "http://www.w3.org/1999/xhtml", jv = (t) => t != null, Qf = (t) => (t = typeof t, t === "object" || t === "function");
function Ky(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const $t = (t, e, ...n) => {
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
}, Rv = {}, zv = (t) => t && t.$tag$ === Rv, Gv = (t, e) => t != null && !Qf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, Kv = (t) => $o(t).$hostElement$, Vv = (t, e, n) => {
  const r = nn.ce(e, n);
  return t.dispatchEvent(r), r;
}, h0 = /* @__PURE__ */ new WeakMap(), Yv = (t, e, n) => {
  let r = Lc.get(t);
  h4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, Lc.set(t, r);
}, Xv = (t, e, n, r) => {
  var s;
  let i = Vy(e);
  const o = Lc.get(i);
  if (t = t.nodeType === 11 ? t : Er, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = h0.get(t), c;
      if (a || h0.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = Er.createElement("style"), c.innerHTML = o;
          const u = (s = nn.$nonce$) !== null && s !== void 0 ? s : Ky(Er);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, qv = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = Xr("attachStyles", e.$tagName$), i = Xv(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Vy = (t, e) => "sc-" + t.$tagName$, p0 = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = y0(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = g0(n), h = g0(r);
      c.remove(...u.filter((l) => l && !h.includes(l))), c.add(...h.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : y0(ll, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && nn.rel(t, e, n, !1), r && nn.ael(t, e, r, !1);
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
}, Wv = /\s/, g0 = (t) => t ? t.split(Wv) : [], Yy = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || d0, o = e.$attrs$ || d0;
  for (r in i)
    r in o || p0(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    p0(s, r, i[r], o[r], n, e.$flags$);
}, Jf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = Er.createTextNode(s.$text$);
  else {
    if (Bn || (Bn = s.$tag$ === "svg"), o = s.$elm$ = Er.createElementNS(Bn ? Dv : Fv, s.$tag$), Bn && s.$tag$ === "foreignObject" && (Bn = !1), Yy(null, s, Bn), jv(ac) && o["s-si"] !== ac && o.classList.add(o["s-si"] = ac), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = Jf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Bn = !1 : o.tagName === "foreignObject" && (Bn = !0);
  }
  return o;
}, Xy = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Gy && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = Jf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, qy = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, Zv = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, h = r[0], l = r[u], y;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : h == null ? h = r[++i] : l == null ? l = r[--u] : Ka(a, h) ? (zo(a, h), a = e[++s], h = r[++i]) : Ka(c, l) ? (zo(c, l), c = e[--o], l = r[--u]) : Ka(a, l) ? (zo(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ka(c, h) ? (zo(c, h), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], h = r[++i]) : (y = Jf(e && e[i], n, i), h = r[++i], y && a.$elm$.parentNode.insertBefore(y, a.$elm$));
  s > o ? Xy(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && qy(e, s, o);
}, Ka = (t, e) => t.$tag$ === e.$tag$, zo = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Bn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Bn, Yy(t, e, Bn), r !== null && s !== null ? Zv(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Xy(n, null, e, s, 0, s.length - 1)) : r !== null && qy(r, 0, r.length - 1), Bn && i === "svg" && (Bn = !1)) : t.$text$ !== o && (n.data = o);
}, Qv = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || ju(null, null), s = zv(e) ? e : $t(null, null, e);
  Gy = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, ac = n["s-sc"], zo(r, s);
}, Wy = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, td = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return Wy(t, t.$ancestorComponent$), g4(() => Jv(t, e));
}, Jv = (t, e) => {
  const n = Xr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), r4(s, () => t4(t, r, e));
}, t4 = async (t, e, n) => {
  const r = t.$hostElement$, s = Xr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && qv(t);
  const o = Xr("render", t.$cmpMeta$.$tagName$);
  e4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => n4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, e4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, Qv(t, e);
  } catch (r) {
    sa(r, t.$hostElement$);
  }
  return null;
}, n4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = Xr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, Qy(n), r(), t.$onReadyResolve$(n), s || Zy()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && nd(() => td(t, !1)), t.$flags$ &= -517;
}, Zy = (t) => {
  Qy(Er.documentElement), nd(() => Vv(ll, "appload", { detail: { namespace: Uv } }));
}, r4 = (t, e) => t && t.then ? t.then(e) : e(), Qy = (t) => t.classList.add("hydrated"), s4 = (t, e) => $o(t).$instanceValues$.get(e), i4 = (t, e, n, r) => {
  const s = $o(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = Gv(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && td(s, !1));
}, Jy = (t, e, n) => {
  if (e.$members$) {
    const r = Object.entries(e.$members$), s = t.prototype;
    if (r.map(([i, [o]]) => {
      (o & 31 || n & 2 && o & 32) && Object.defineProperty(s, i, {
        get() {
          return s4(this, i);
        },
        set(a) {
          i4(this, i, a, e);
        },
        configurable: !0,
        enumerable: !0
      });
    }), n & 1) {
      const i = /* @__PURE__ */ new Map();
      s.attributeChangedCallback = function(o, a, c) {
        nn.jmp(() => {
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
}, o4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = d4(n), s.then) {
        const c = Ov();
        s = await s, c();
      }
      s.isProxied || (Jy(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = Xr("createInstance", n.$tagName$);
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
      const c = Vy(n);
      if (!Lc.has(c)) {
        const u = Xr("registerStyles", n.$tagName$);
        Yv(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => td(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, a4 = (t) => {
  if (!(nn.$flags$ & 1)) {
    const e = $o(t), n = e.$cmpMeta$, r = Xr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            Wy(e, e.$ancestorComponent$ = s);
            break;
          }
      }
      n.$members$ && Object.entries(n.$members$).map(([s, [i]]) => {
        if (i & 31 && t.hasOwnProperty(s)) {
          const o = t[s];
          delete t[s], t[s] = o;
        }
      }), o4(t, e, n);
    }
    r();
  }
}, c4 = (t) => {
  nn.$flags$ & 1 || $o(t);
}, l4 = (t, e = {}) => {
  var n;
  const r = Xr(), s = [], i = e.exclude || [], o = ll.customElements, a = Er.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ Er.createElement("style"), h = [];
  let l, y = !0;
  Object.assign(nn, e), nn.$resourcesUrl$ = new URL(e.resourcesUrl || "./", Er.baseURI).href, t.map((g) => {
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
          super(F), F = this, f4(F, v), v.$flags$ & 1 && F.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), y ? h.push(this) : nn.jmp(() => a4(this));
        }
        disconnectedCallback() {
          nn.jmp(() => c4(this));
        }
        componentOnReady() {
          return $o(this).$onReadyPromise$;
        }
      };
      v.$lazyBundleId$ = g[0], !i.includes(T) && !o.get(T) && (s.push(T), o.define(T, Jy(
        U,
        v,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + Hv, u.setAttribute("data-styles", "");
    const g = (n = nn.$nonce$) !== null && n !== void 0 ? n : Ky(Er);
    g != null && u.setAttribute("nonce", g), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  y = !1, h.length ? h.map((g) => g.connectedCallback()) : nn.jmp(() => l = setTimeout(Zy, 30)), r();
}, ed = /* @__PURE__ */ new WeakMap(), $o = (t) => ed.get(t), u4 = (t, e) => ed.set(e.$lazyInstance$ = t, e), f4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], ed.set(t, n);
}, y0 = (t, e) => e in t, sa = (t, e) => (0, console.error)(t, e), Ul = /* @__PURE__ */ new Map(), d4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = Ul.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (Ul.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => SI).then(o, sa);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (Ul.set(s, o), o[r]), sa);
}, Lc = /* @__PURE__ */ new Map(), ll = typeof window < "u" ? window : {}, Er = ll.document || { head: {} }, nn = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, tw = (t) => Promise.resolve(t), h4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), w0 = [], ew = [], p4 = (t, e) => (n) => {
  t.push(n), Fu || (Fu = !0, nn.$flags$ & 4 ? nd(Ru) : nn.raf(Ru));
}, b0 = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      sa(n);
    }
  t.length = 0;
}, Ru = () => {
  b0(w0), b0(ew), (Fu = w0.length > 0) && nn.raf(Ru);
}, nd = (t) => tw().then(t), g4 = /* @__PURE__ */ p4(ew), y4 = () => tw(), w4 = (t, e) => typeof window > "u" ? Promise.resolve() : y4().then(() => l4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var b4 = Object.defineProperty, m4 = Object.defineProperties, x4 = Object.getOwnPropertyDescriptors, Cc = Object.getOwnPropertySymbols, nw = Object.prototype.hasOwnProperty, rw = Object.prototype.propertyIsEnumerable, m0 = (t, e, n) => e in t ? b4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Un = (t, e) => {
  for (var n in e || (e = {})) nw.call(e, n) && m0(t, n, e[n]);
  if (Cc) for (var n of Cc(e)) rw.call(e, n) && m0(t, n, e[n]);
  return t;
}, cr = (t, e) => m4(t, x4(e)), sw = (t, e) => {
  var n = {};
  for (var r in t) nw.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Cc) for (var r of Cc(t)) e.indexOf(r) < 0 && rw.call(t, r) && (n[r] = t[r]);
  return n;
};
function iw() {
  return nl(yi()) || window.StacksProvider || window.BlockstackProvider;
}
function ul(t) {
  return t ? typeof t == "string" ? bi.fromName(t) : "version" in t ? t : "url" in t ? new yu({ url: t.url }) : t.transactionVersion === xi.Mainnet ? new yu({ url: t.client.baseUrl }) : new wu({ url: t.client.baseUrl }) : new wu();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var S4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(S4 || {}), E4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(E4 || {}), rd = (t) => {
  let e = t;
  if (!e) {
    let n = new Up(["store_write"], document.location.href);
    e = new gu({ appConfig: n });
  }
  return e;
};
function ow(t) {
  try {
    return rd(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var aw = (t) => {
  let e = rd(t).loadUserData().appPrivateKey, n = We.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function A4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [mi.Mainnet]: "mainnet", [mi.Testnet]: "testnet" }, a = ul(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function v4(t) {
  let e = ul(t.network), n = rd(t.userSession), r = cr(Un({}, t), { network: e, userSession: n });
  return Un({ stxAddress: A4(r) }, r);
}
async function k4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(My) : n = n.map((r) => yt(Ry(r)))), new We.TokenSigner("ES256k", e).signAsync(cr(Un({}, t), { postConditions: n }));
}
function $4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(My) : e = e.map((n) => yt(Ry(n)))), We.createUnsecuredToken(cr(Un({}, t), { postConditions: e }));
}
var I4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Gt(a.replace(/^0x/, "")), u = w3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, cr(Un({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, cr(Un({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, L4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = sw(e, ["amount", "appDetails", "userSession"]);
  if (ow(s)) {
    let { privateKey: a, publicKey: c } = aw(s), u = cr(Un({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), k4(u, a);
  }
  let o = cr(Un({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), $4(o);
};
async function C4(t, e, n) {
  let r = await e(cr(Un(Un({}, v4(t)), t), { network: ul(t.network) }));
  return I4({ token: r, options: t }, n);
}
function T4(t, e = iw()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return C4(t, L4, e);
}
function cw(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? cr(Un({}, t), { message: Yh(e), domain: Yh(n) }) : cr(Un({}, t), { message: yt(Ei(e)), domain: yt(Ei(n)) });
}
async function B4(t, e) {
  return new We.TokenSigner("ES256k", e).signAsync(cw(t));
}
async function M4(t) {
  let e = t, { userSession: n } = e, r = sw(e, ["userSession"]);
  if (ow(n)) {
    let { privateKey: s, publicKey: i } = aw(n), o = cr(Un({}, r), { publicKey: i });
    return B4(o, s);
  }
  return We.createUnsecuredToken(cw(t));
}
var N4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(N4 || {}), lw = "asigna-stx", x0 = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === lw && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(_4(t, e), "*");
}), P4 = { authenticationRequest: async (t) => x0(t, "authenticationRequest"), transactionRequest: async (t) => x0(t, "transactionRequest") }, _4 = (t, e) => ({ source: lw, [e]: t }), U4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = P4);
};
U4();
var O4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function H4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = yi(), o = iw();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    w4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : O4, c = CS(a), u = document.createElement("connect-modal");
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
var Va = H4(T4);
function Ds(t, e, n) {
  return sd(yn(t, e), n);
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
      const r = j4(BigInt(`0x${Ot(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Ot(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function S0(t) {
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
function sd(t, e = 16) {
  const n = wa(t, e);
  return be(n);
}
function D4(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function F4(t, e) {
  return t & BigInt(1) << e;
}
function j4(t, e) {
  return F4(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const R4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ot(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += R4[n];
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
function Io(t) {
  return new TextEncoder().encode(t);
}
function id(t) {
  return new TextDecoder().decode(t);
}
function uw(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function z4(t) {
  return String.fromCharCode.apply(null, t);
}
function G4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function E0(t) {
  if (t.some(G4))
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
function _e(t) {
  return dl(...t.map((e) => typeof e == "number" ? E0([e]) : e instanceof Array ? E0(e) : e));
}
var A0;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(A0 || (A0 = {}));
var v0;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(v0 || (v0 = {}));
var k0;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(k0 || (k0 = {}));
const fw = 33, Ol = 32;
function K4(t) {
  if (t.length < Ol * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Ol * 2), r = t.slice(2 + Ol * 2);
  return {
    recoveryId: fl(e),
    r: n,
    s: r
  };
}
function V4(t) {
  const e = typeof t == "string" ? be(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function Y4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function X4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function q4(t, e) {
  return t[e];
}
function W4(t, e, n = 0) {
  return t[n] = e, t;
}
function Z4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Ai(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var zu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(zu || (zu = {}));
const Q4 = zu.Mainnet, J4 = 128, tk = 128, dw = 16, ci = 32, Gu = 80, hl = 65, ek = 32, nk = 64, Tc = 34;
var gt;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(gt || (gt = {}));
var _t;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(_t || (_t = {}));
var Ku;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(Ku || (Ku = {}));
var xn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(xn || (xn = {}));
const cc = ["onChainOnly", "offChainOnly", "any"], $0 = {
  [cc[0]]: xn.OnChainOnly,
  [cc[1]]: xn.OffChainOnly,
  [cc[2]]: xn.Any,
  [xn.OnChainOnly]: xn.OnChainOnly,
  [xn.OffChainOnly]: xn.OffChainOnly,
  [xn.Any]: xn.Any
};
function rk(t) {
  if (t in $0)
    return $0[t];
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
var Sn;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Sn || (Sn = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var le;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(le || (le = {}));
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
var Vu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(Vu || (Vu = {}));
var oa;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(oa || (oa = {}));
var I0;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(I0 || (I0 = {}));
var L0;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(L0 || (L0 = {}));
function Yu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sk(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function hw(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function ik(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Yu(t.outputLen), Yu(t.blockLen);
}
function ok(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function ak(t, e) {
  hw(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ii = {
  number: Yu,
  bool: sk,
  bytes: hw,
  hash: ik,
  exists: ok,
  output: ak
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Hl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), gr = (t, e) => t << 32 - e | t >>> e, ck = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ck)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lk(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function od(t) {
  if (typeof t == "string" && (t = lk(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class pw {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function _i(t) {
  const e = (r) => t().update(od(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function uk(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class ad extends pw {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Hl(this.buffer);
  }
  update(e) {
    ii.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = od(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Hl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ii.exists(this), ii.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    uk(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Hl(e), c = this.outputLen;
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
const fk = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gw = Uint8Array.from({ length: 16 }, (t, e) => e), dk = gw.map((t) => (9 * t + 5) % 16);
let cd = [gw], ld = [dk];
for (let t = 0; t < 4; t++)
  for (let e of [cd, ld])
    e.push(e[t].map((n) => fk[n]));
const yw = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hk = cd.map((t, e) => t.map((n) => yw[e][n])), pk = ld.map((t, e) => t.map((n) => yw[e][n])), gk = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yk = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), Ya = (t, e) => t << e | t >>> 32 - e;
function C0(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const Xa = new Uint32Array(16);
class wk extends ad {
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
      const S = 4 - g, v = gk[g], T = yk[g], U = cd[g], F = ld[g], k = hk[g], C = pk[g];
      for (let P = 0; P < 16; P++) {
        const X = Ya(r + C0(g, i, a, u) + Xa[U[P]] + v, k[P]) + l | 0;
        r = l, l = u, u = Ya(a, 10) | 0, a = i, i = X;
      }
      for (let P = 0; P < 16; P++) {
        const X = Ya(s + C0(S, o, c, h) + Xa[F[P]] + T, C[P]) + y | 0;
        s = y, y = h, h = Ya(c, 10) | 0, c = o, o = X;
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
const bk = _i(() => new wk()), mk = (t, e, n) => t & e ^ ~t & n, xk = (t, e, n) => t & e ^ t & n ^ e & n, Sk = new Uint32Array([
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
]), ks = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), $s = new Uint32Array(64);
class ww extends ad {
  constructor() {
    super(64, 32, 8, !1), this.A = ks[0] | 0, this.B = ks[1] | 0, this.C = ks[2] | 0, this.D = ks[3] | 0, this.E = ks[4] | 0, this.F = ks[5] | 0, this.G = ks[6] | 0, this.H = ks[7] | 0;
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
      $s[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const y = $s[l - 15], g = $s[l - 2], S = gr(y, 7) ^ gr(y, 18) ^ y >>> 3, v = gr(g, 17) ^ gr(g, 19) ^ g >>> 10;
      $s[l] = v + $s[l - 7] + S + $s[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: h } = this;
    for (let l = 0; l < 64; l++) {
      const y = gr(a, 6) ^ gr(a, 11) ^ gr(a, 25), g = h + y + mk(a, c, u) + Sk[l] + $s[l] | 0, v = (gr(r, 2) ^ gr(r, 13) ^ gr(r, 22)) + xk(r, s, i) | 0;
      h = u, u = c, c = a, a = o + g | 0, o = i, i = s, s = r, r = g + v | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, h = h + this.H | 0, this.set(r, s, i, o, a, c, u, h);
  }
  roundClean() {
    $s.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Ek extends ww {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const ud = _i(() => new ww());
_i(() => new Ek());
const qa = BigInt(2 ** 32 - 1), Xu = BigInt(32);
function bw(t, e = !1) {
  return e ? { h: Number(t & qa), l: Number(t >> Xu & qa) } : { h: Number(t >> Xu & qa) | 0, l: Number(t & qa) | 0 };
}
function Ak(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = bw(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const vk = (t, e) => BigInt(t >>> 0) << Xu | BigInt(e >>> 0), kk = (t, e, n) => t >>> n, $k = (t, e, n) => t << 32 - n | e >>> n, Ik = (t, e, n) => t >>> n | e << 32 - n, Lk = (t, e, n) => t << 32 - n | e >>> n, Ck = (t, e, n) => t << 64 - n | e >>> n - 32, Tk = (t, e, n) => t >>> n - 32 | e << 64 - n, Bk = (t, e) => e, Mk = (t, e) => t, Nk = (t, e, n) => t << n | e >>> 32 - n, Pk = (t, e, n) => e << n | t >>> 32 - n, _k = (t, e, n) => e << n - 32 | t >>> 64 - n, Uk = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Ok(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Hk = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dk = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Fk = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jk = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Rk = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zk = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: bw,
  split: Ak,
  toBig: vk,
  shrSH: kk,
  shrSL: $k,
  rotrSH: Ik,
  rotrSL: Lk,
  rotrBH: Ck,
  rotrBL: Tk,
  rotr32H: Bk,
  rotr32L: Mk,
  rotlSH: Nk,
  rotlSL: Pk,
  rotlBH: _k,
  rotlBL: Uk,
  add: Ok,
  add3L: Hk,
  add3H: Dk,
  add4L: Fk,
  add4H: jk,
  add5H: zk,
  add5L: Rk
}, [Gk, Kk] = Pt.split([
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
].map((t) => BigInt(t))), Is = new Uint32Array(80), Ls = new Uint32Array(80);
class pl extends ad {
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
      Is[k] = e.getUint32(n), Ls[k] = e.getUint32(n += 4);
    for (let k = 16; k < 80; k++) {
      const C = Is[k - 15] | 0, P = Ls[k - 15] | 0, X = Pt.rotrSH(C, P, 1) ^ Pt.rotrSH(C, P, 8) ^ Pt.shrSH(C, P, 7), it = Pt.rotrSL(C, P, 1) ^ Pt.rotrSL(C, P, 8) ^ Pt.shrSL(C, P, 7), q = Is[k - 2] | 0, W = Ls[k - 2] | 0, $ = Pt.rotrSH(q, W, 19) ^ Pt.rotrBH(q, W, 61) ^ Pt.shrSH(q, W, 6), _ = Pt.rotrSL(q, W, 19) ^ Pt.rotrBL(q, W, 61) ^ Pt.shrSL(q, W, 6), x = Pt.add4L(it, _, Ls[k - 7], Ls[k - 16]), M = Pt.add4H(x, X, $, Is[k - 7], Is[k - 16]);
      Is[k] = M | 0, Ls[k] = x | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: h, Eh: l, El: y, Fh: g, Fl: S, Gh: v, Gl: T, Hh: U, Hl: F } = this;
    for (let k = 0; k < 80; k++) {
      const C = Pt.rotrSH(l, y, 14) ^ Pt.rotrSH(l, y, 18) ^ Pt.rotrBH(l, y, 41), P = Pt.rotrSL(l, y, 14) ^ Pt.rotrSL(l, y, 18) ^ Pt.rotrBL(l, y, 41), X = l & g ^ ~l & v, it = y & S ^ ~y & T, q = Pt.add5L(F, P, it, Kk[k], Ls[k]), W = Pt.add5H(q, U, C, X, Gk[k], Is[k]), $ = q | 0, _ = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), x = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), M = r & i ^ r & a ^ i & a, K = s & o ^ s & c ^ o & c;
      U = v | 0, F = T | 0, v = g | 0, T = S | 0, g = l | 0, S = y | 0, { h: l, l: y } = Pt.add(u | 0, h | 0, W | 0, $ | 0), u = a | 0, h = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const N = Pt.add3L($, x, K);
      r = Pt.add3H(N, W, _, M), s = N | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: h } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, h | 0), { h: l, l: y } = Pt.add(this.Eh | 0, this.El | 0, l | 0, y | 0), { h: g, l: S } = Pt.add(this.Fh | 0, this.Fl | 0, g | 0, S | 0), { h: v, l: T } = Pt.add(this.Gh | 0, this.Gl | 0, v | 0, T | 0), { h: U, l: F } = Pt.add(this.Hh | 0, this.Hl | 0, U | 0, F | 0), this.set(r, s, i, o, a, c, u, h, l, y, g, S, v, T, U, F);
  }
  roundClean() {
    Is.fill(0), Ls.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Vk extends pl {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class Yk extends pl {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Xk extends pl {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
_i(() => new pl());
_i(() => new Vk());
const qk = _i(() => new Yk());
_i(() => new Xk());
function mw(t) {
  if (be(t).byteLength != hl)
    throw Error("Invalid signature");
  return {
    type: gt.MessageSignature,
    data: t
  };
}
function Go(t, e) {
  return { type: gt.Address, version: t, hash160: e };
}
function Ji(t) {
  return Mi.c32address(t.version, t.hash160);
}
function vi(t, e, n) {
  const r = e || 1, s = n || J4;
  if (Uw(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: gt.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function fd(t) {
  const e = Mi.c32addressDecode(t);
  return {
    type: gt.Address,
    version: e[0],
    hash160: e[1]
  };
}
var J;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(J || (J = {}));
function Wk(t) {
  if (t.type === J.PrincipalStandard)
    return Ji(t.address);
  if (t.type === J.PrincipalContract)
    return `${Ji(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function xw(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Jk(e, n);
  } else
    return Zk(t);
}
function Zk(t) {
  const e = fd(t);
  return { type: J.PrincipalStandard, address: e };
}
function Qk(t) {
  return { type: J.PrincipalStandard, address: t };
}
function Jk(t, e) {
  const n = fd(t), r = vi(e);
  return Sw(n, r);
}
function Sw(t, e) {
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
      return `0x${Ot(t.buffer)}`;
    case J.OptionalNone:
      return null;
    case J.OptionalSome:
      return mr(t.value);
    case J.ResponseErr:
      return mr(t.value);
    case J.ResponseOk:
      return mr(t.value);
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return Wk(t);
    case J.List:
      return t.list.map((r) => mr(r));
    case J.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = mr(t.data[r]);
      }), n;
    case J.StringASCII:
      return t.data;
    case J.StringUTF8:
      return t.data;
  }
}
function mr(t) {
  switch (t.type) {
    case J.ResponseErr:
      return { type: Bs(t), value: Dl(t, !0), success: !1 };
    case J.ResponseOk:
      return { type: Bs(t), value: Dl(t, !0), success: !0 };
    default:
      return { type: Bs(t), value: Dl(t, !0) };
  }
}
function Bs(t) {
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
      return `(optional ${Bs(t.value)})`;
    case J.ResponseErr:
      return `(response UnknownType ${Bs(t.value)})`;
    case J.ResponseOk:
      return `(response ${Bs(t.value)} UnknownType)`;
    case J.PrincipalStandard:
    case J.PrincipalContract:
      return "principal";
    case J.List:
      return `(list ${t.list.length} ${t.list.length ? Bs(t.list[0]) : "UnknownType"})`;
    case J.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${Bs(t.data[e])})`).join(" ")})`;
    case J.StringASCII:
      return `(string-ascii ${uw(t.data).length})`;
    case J.StringUTF8:
      return `(string-utf8 ${Io(t.data).length})`;
  }
}
const Ew = () => ({ type: J.BoolTrue }), Aw = () => ({ type: J.BoolFalse }), t8 = (t) => t ? Ew() : Aw(), T0 = BigInt("0xffffffffffffffffffffffffffffffff"), e8 = BigInt(0), B0 = BigInt("0x7fffffffffffffffffffffffffffffff"), M0 = BigInt("-170141183460469231731687303715884105728"), n8 = (t) => {
  const e = yn(t, !0);
  if (e > B0)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${B0}`);
  if (e < M0)
    throw new RangeError(`Cannot construct clarity integer form value less than ${M0}`);
  return { type: J.Int, value: e };
}, Ar = (t) => {
  const e = yn(t, !1);
  if (e < e8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > T0)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${T0}`);
  return { type: J.UInt, value: e };
}, vw = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: J.Buffer, buffer: t };
};
function kw() {
  return { type: J.OptionalNone };
}
function $w(t) {
  return { type: J.OptionalSome, value: t };
}
function r8(t) {
  return { type: J.ResponseErr, value: t };
}
function s8(t) {
  return { type: J.ResponseOk, value: t };
}
function i8(t) {
  return { type: J.List, list: t };
}
function ki(t) {
  for (const e in t)
    if (!X8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: J.Tuple, data: t };
}
const qe = (t) => ({ type: J.StringASCII, data: t }), o8 = (t) => ({ type: J.StringUTF8, data: t });
class Iw extends pw {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, ii.hash(e);
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
    return ii.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    ii.exists(this), ii.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Lw = (t, e, n) => new Iw(t, e).update(n).digest();
Lw.create = (t, e) => new Iw(t, e);
Ce.hmacSha256Sync = (t, ...e) => {
  const n = Lw.create(ud, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function bo(t) {
  return {
    type: gt.PublicKey,
    data: be(t)
  };
}
function a8(t, e, n = Ae.Compressed) {
  const r = K4(e.data), s = new Pn(S0(r.r), S0(r.s)), i = Ut.fromSignature(t, s, r.recoveryId), o = n === Ae.Compressed;
  return i.toHex(o);
}
function c8(t) {
  return { type: gt.PublicKey, data: t };
}
function Lo(t) {
  return !Ot(t.data).startsWith("04");
}
function Nc(t) {
  return t.data.slice();
}
function l8(t) {
  const e = d8(t), n = da(e.data.slice(0, 32), e.compressed);
  return bo(Ot(n));
}
function u8(t) {
  const e = typeof t == "string" ? t : Ot(t), n = Ut.fromHex(e).toHex(!0);
  return bo(n);
}
function f8(t) {
  const e = typeof t == "string" ? t : Ot(t), n = Ut.fromHex(e).toHex(!1);
  return bo(n);
}
function qu(t) {
  const e = t.readUInt8(), n = e === 4 ? nk : ek;
  return c8(_e([e, t.readBytes(n)]));
}
function d8(t) {
  const e = V4(t), n = e.length == fw;
  return { data: e, compressed: n };
}
function h8(t, e) {
  const [n, r] = Vc(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = wa(r, 1) + Pn.fromHex(n).toCompactHex();
  return mw(i);
}
function p8(t) {
  return l8(t.data);
}
function g8(t, e, n) {
  return typeof t == "string" && (t = xw(t)), typeof n == "string" && (n = _0(n)), {
    type: gt.Payload,
    payloadType: _t.TokenTransfer,
    recipient: t,
    amount: yn(e, !1),
    memo: n ?? _0("")
  };
}
function y8(t, e, n, r) {
  return typeof t == "string" && (t = fd(t)), typeof e == "string" && (e = vi(e)), typeof n == "string" && (n = vi(n)), {
    type: gt.Payload,
    payloadType: _t.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function N0(t, e, n) {
  return typeof t == "string" && (t = vi(t)), typeof e == "string" && (e = k8(e)), typeof n == "number" ? {
    type: gt.Payload,
    payloadType: _t.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: gt.Payload,
    payloadType: _t.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function w8() {
  return { type: gt.Payload, payloadType: _t.PoisonMicroblock };
}
function P0(t, e) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  return e != null ? {
    type: gt.Payload,
    payloadType: _t.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: gt.Payload,
    payloadType: _t.Coinbase,
    coinbaseBytes: t
  };
}
function b8(t, e, n) {
  if (t.byteLength != ci)
    throw Error(`Coinbase buffer size must be ${ci} bytes`);
  if (n.byteLength != Gu)
    throw Error(`VRF proof buffer size must be ${Gu} bytes`);
  return {
    type: gt.Payload,
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
function m8(t, e, n, r, s, i, o) {
  return {
    type: gt.Payload,
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
function Cw(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case _t.TokenTransfer:
      e.push(Me(t.recipient)), e.push(Ds(t.amount, !1, 8)), e.push(Hr(t.memo));
      break;
    case _t.ContractCall:
      e.push(Hr(t.contractAddress)), e.push(Hr(t.contractName)), e.push(Hr(t.functionName));
      const n = new Uint8Array(4);
      Ai(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Me(r));
      });
      break;
    case _t.SmartContract:
      e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case _t.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Hr(t.contractName)), e.push(Hr(t.codeBody));
      break;
    case _t.PoisonMicroblock:
      break;
    case _t.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case _t.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Me(t.recipient));
      break;
    case _t.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Me(t.recipient ? $w(t.recipient) : kw())), e.push(t.vrfProof);
      break;
    case _t.TenureChange:
      e.push(be(t.tenureHash)), e.push(be(t.previousTenureHash)), e.push(be(t.burnViewHash)), e.push(be(t.previousTenureEnd)), e.push(Ai(new Uint8Array(4), t.previousTenureBlocks)), e.push(W4(new Uint8Array(1), t.cause)), e.push(be(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function x8(t) {
  switch (t.readUInt8Enum(_t, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case _t.TokenTransfer:
      const n = Xn(t), r = yn(t.readBytes(8), !1), s = Bw(t);
      return g8(n, r, s);
    case _t.ContractCall:
      const i = mo(t), o = Yn(t), a = Yn(t), c = [], u = t.readUInt32BE();
      for (let k = 0; k < u; k++) {
        const C = Xn(t);
        c.push(C);
      }
      return y8(i, o, a, c);
    case _t.SmartContract:
      const h = Yn(t), l = Yn(t, 4, 1e5);
      return N0(h, l);
    case _t.VersionedSmartContract: {
      const k = t.readUInt8Enum(Ku, (X) => {
        throw new Error(`Cannot recognize ClarityVersion: ${X}`);
      }), C = Yn(t), P = Yn(t, 4, 1e5);
      return N0(C, P, k);
    }
    case _t.PoisonMicroblock:
      return w8();
    case _t.Coinbase: {
      const k = t.readBytes(ci);
      return P0(k);
    }
    case _t.CoinbaseToAltRecipient: {
      const k = t.readBytes(ci), C = Xn(t);
      return P0(k, C);
    }
    case _t.NakamotoCoinbase: {
      const k = t.readBytes(ci), C = Xn(t), P = t.readBytes(Gu);
      return b8(k, C, P);
    }
    case _t.TenureChange:
      const y = Ot(t.readBytes(20)), g = Ot(t.readBytes(20)), S = Ot(t.readBytes(20)), v = Ot(t.readBytes(32)), T = t.readUInt32BE(), U = t.readUInt8Enum(Wu, (k) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${k}`);
      }), F = Ot(t.readBytes(20));
      return m8(y, g, S, v, T, U, F);
  }
}
class gl extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class ti extends gl {
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
class oi extends gl {
  constructor(e) {
    super(e);
  }
}
var ir;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(ir || (ir = {}));
function Zu(t) {
  return mw(Ot(t.readBytes(hl)));
}
function to(t, e) {
  return {
    pubKeyEncoding: t,
    type: gt.TransactionAuthField,
    contents: e
  };
}
function S8(t) {
  const e = t.readUInt8Enum(ir, (n) => {
    throw new Nn(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case ir.PublicKeyCompressed:
      return to(Ae.Compressed, qu(t));
    case ir.PublicKeyUncompressed:
      return to(Ae.Uncompressed, f8(qu(t).data));
    case ir.SignatureCompressed:
      return to(Ae.Compressed, Zu(t));
    case ir.SignatureUncompressed:
      return to(Ae.Uncompressed, Zu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function dd(t) {
  return be(t.data);
}
function E8(t) {
  const e = [];
  switch (t.contents.type) {
    case gt.PublicKey:
      e.push(t.pubKeyEncoding === Ae.Compressed ? ir.PublicKeyCompressed : ir.PublicKeyUncompressed), e.push(Nc(u8(t.contents.data)));
      break;
    case gt.MessageSignature:
      e.push(t.pubKeyEncoding === Ae.Compressed ? ir.SignatureCompressed : ir.SignatureUncompressed), e.push(dd(t.contents));
      break;
  }
  return _e(e);
}
function Hr(t) {
  switch (t.type) {
    case gt.Address:
      return ba(t);
    case gt.Principal:
      return Tw(t);
    case gt.LengthPrefixedString:
      return xo(t);
    case gt.MemoString:
      return $8(t);
    case gt.AssetInfo:
      return Mw(t);
    case gt.PostCondition:
      return I8(t);
    case gt.PublicKey:
      return Nc(t);
    case gt.LengthPrefixedList:
      return gd(t);
    case gt.Payload:
      return Cw(t);
    case gt.TransactionAuthField:
      return E8(t);
    case gt.MessageSignature:
      return dd(t);
  }
}
function A8() {
  return {
    type: gt.Address,
    version: Mc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function hd(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === le.SerializeP2PKH || e === le.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === le.SerializeP2WPKH || e === le.SerializeP2WSH || e === le.SerializeP2WSHNonSequential) && !r.every(Lo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case le.SerializeP2PKH:
      return Go(t, G8(r[0].data));
    case le.SerializeP2WPKH:
      return Go(t, K8(r[0].data));
    case le.SerializeP2SH:
    case le.SerializeP2SHNonSequential:
      return Go(t, V8(n, r.map(Nc)));
    case le.SerializeP2WSH:
    case le.SerializeP2WSHNonSequential:
      return Go(t, Y8(n, r.map(Nc)));
  }
}
function ba(t) {
  const e = [];
  return e.push(be(wa(t.version, 1))), e.push(be(t.hash160)), _e(e);
}
function mo(t) {
  const e = fl(Ot(t.readBytes(1))), n = Ot(t.readBytes(20));
  return { type: gt.Address, version: e, hash160: n };
}
function Tw(t) {
  const e = [];
  return e.push(t.prefix), e.push(ba(t.address)), t.prefix === oa.Contract && e.push(xo(t.contractName)), _e(e);
}
function v8(t) {
  const e = t.readUInt8Enum(oa, (s) => {
    throw new Nn(`Unexpected Principal payload type: ${s}`);
  }), n = mo(t);
  if (e === oa.Standard)
    return { type: gt.Principal, prefix: e, address: n };
  const r = Yn(t);
  return {
    type: gt.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function xo(t) {
  const e = [], n = Io(t.content), r = n.byteLength;
  return e.push(be(wa(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function Yn(t, e, n) {
  e = e || 1;
  const r = fl(Ot(t.readBytes(e))), s = id(t.readBytes(r));
  return vi(s, e, n ?? 128);
}
function k8(t) {
  return vi(t, 4, 1e5);
}
function _0(t) {
  if (t && Uw(t, Tc))
    throw new Error(`Memo exceeds maximum length of ${Tc} bytes`);
  return { type: gt.MemoString, content: t };
}
function $8(t) {
  const e = [], n = Io(t.content), r = z8(Ot(n), Tc * 2);
  return e.push(be(r)), _e(e);
}
function Bw(t) {
  let e = id(t.readBytes(Tc));
  return e = e.replace(/\u0000*$/, ""), { type: gt.MemoString, content: e };
}
function Mw(t) {
  const e = [];
  return e.push(ba(t.address)), e.push(xo(t.contractName)), e.push(xo(t.assetName)), _e(e);
}
function Qu(t) {
  return {
    type: gt.AssetInfo,
    address: mo(t),
    contractName: Yn(t),
    assetName: Yn(t)
  };
}
function pd(t, e) {
  return {
    type: gt.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function gd(t) {
  const e = t.values, n = [];
  n.push(be(wa(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Hr(r));
  return _e(n);
}
function Nw(t, e, n) {
  const r = fl(Ot(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case gt.Address:
        s.push(mo(t));
        break;
      case gt.LengthPrefixedString:
        s.push(Yn(t));
        break;
      case gt.MemoString:
        s.push(Bw(t));
        break;
      case gt.AssetInfo:
        s.push(Qu(t));
        break;
      case gt.PostCondition:
        s.push(L8(t));
        break;
      case gt.PublicKey:
        s.push(qu(t));
        break;
      case gt.TransactionAuthField:
        s.push(S8(t));
        break;
    }
  return pd(s, n);
}
function I8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Tw(t.principal)), (t.conditionType === Sn.Fungible || t.conditionType === Sn.NonFungible) && e.push(Mw(t.assetInfo)), t.conditionType === Sn.NonFungible && e.push(Me(t.assetName)), e.push(t.conditionCode), t.conditionType === Sn.STX || t.conditionType === Sn.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new ti("The post-condition amount may not be larger than 8 bytes");
    e.push(Ds(t.amount, !1, 8));
  }
  return _e(e);
}
function L8(t) {
  const e = t.readUInt8Enum(Sn, (o) => {
    throw new Nn(`Could not read ${o} as PostConditionType`);
  }), n = v8(t);
  let r, s, i;
  switch (e) {
    case Sn.STX:
      return r = t.readUInt8Enum(ia, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ot(t.readBytes(8))}`), {
        type: gt.PostCondition,
        conditionType: Sn.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case Sn.Fungible:
      return s = Qu(t), r = t.readUInt8Enum(ia, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Ot(t.readBytes(8))}`), {
        type: gt.PostCondition,
        conditionType: Sn.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case Sn.NonFungible:
      s = Qu(t);
      const o = Xn(t);
      return r = t.readUInt8Enum(Vu, (a) => {
        throw new Nn(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: gt.PostCondition,
        conditionType: Sn.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function Lr(t, e) {
  return _e([t, e]);
}
function C8(t) {
  return new Uint8Array([t.type]);
}
function T8(t) {
  return t.type === J.OptionalNone ? new Uint8Array([t.type]) : Lr(t.type, Me(t.value));
}
function B8(t) {
  const e = new Uint8Array(4);
  return Ai(e, t.buffer.length, 0), Lr(t.type, dl(e, t.buffer));
}
function M8(t) {
  const e = sd(D4(t.value, BigInt(tk)), dw);
  return Lr(t.type, e);
}
function N8(t) {
  const e = sd(t.value, dw);
  return Lr(t.type, e);
}
function P8(t) {
  return Lr(t.type, ba(t.address));
}
function _8(t) {
  return Lr(t.type, dl(ba(t.address), xo(t.contractName)));
}
function U8(t) {
  return Lr(t.type, Me(t.value));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  Ai(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Me(r);
    e.push(s);
  }
  return Lr(t.type, _e(e));
}
function H8(t) {
  const e = [], n = new Uint8Array(4);
  Ai(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = vi(s);
    e.push(xo(i));
    const o = Me(t.data[s]);
    e.push(o);
  }
  return Lr(t.type, _e(e));
}
function Pw(t, e) {
  const n = [], r = e == "ascii" ? uw(t.data) : Io(t.data), s = new Uint8Array(4);
  return Ai(s, r.length, 0), n.push(s), n.push(r), Lr(t.type, _e(n));
}
function D8(t) {
  return Pw(t, "ascii");
}
function F8(t) {
  return Pw(t, "utf8");
}
function Me(t) {
  switch (t.type) {
    case J.BoolTrue:
    case J.BoolFalse:
      return C8(t);
    case J.OptionalNone:
    case J.OptionalSome:
      return T8(t);
    case J.Buffer:
      return B8(t);
    case J.UInt:
      return N8(t);
    case J.Int:
      return M8(t);
    case J.PrincipalStandard:
      return P8(t);
    case J.PrincipalContract:
      return _8(t);
    case J.ResponseOk:
    case J.ResponseErr:
      return U8(t);
    case J.List:
      return O8(t);
    case J.Tuple:
      return H8(t);
    case J.StringASCII:
      return D8(t);
    case J.StringUTF8:
      return F8(t);
    default:
      throw new ti("Unable to serialize. Invalid Clarity Value.");
  }
}
function j8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const U0 = /* @__PURE__ */ new Map();
function _w(t, e) {
  const n = U0.get(t);
  if (n !== void 0)
    return n(e);
  const r = j8(t);
  return U0.set(t, r), _w(t, e);
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
    return Z4(this.readBytes(4), 0);
  }
  readUInt8() {
    return q4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return Y4(this.readBytes(2), 0);
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
    if (_w(e, r))
      return r;
    throw n(r);
  }
}
function Xn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new qo(be(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new qo(t) : e = t;
  switch (e.readUInt8Enum(J, (r) => {
    throw new Nn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case J.Int:
      return n8(e.readBytes(16));
    case J.UInt:
      return Ar(e.readBytes(16));
    case J.Buffer:
      const r = e.readUInt32BE();
      return vw(e.readBytes(r));
    case J.BoolTrue:
      return Ew();
    case J.BoolFalse:
      return Aw();
    case J.PrincipalStandard:
      const s = mo(e);
      return Qk(s);
    case J.PrincipalContract:
      const i = mo(e), o = Yn(e);
      return Sw(i, o);
    case J.ResponseOk:
      return s8(Xn(e));
    case J.ResponseErr:
      return r8(Xn(e));
    case J.OptionalNone:
      return kw();
    case J.OptionalSome:
      return $w(Xn(e));
    case J.List:
      const a = e.readUInt32BE(), c = [];
      for (let v = 0; v < a; v++)
        c.push(Xn(e));
      return i8(c);
    case J.Tuple:
      const u = e.readUInt32BE(), h = {};
      for (let v = 0; v < u; v++) {
        const T = Yn(e).content;
        if (T === void 0)
          throw new Nn('"content" is undefined');
        h[T] = Xn(e);
      }
      return ki(h);
    case J.StringASCII:
      const l = e.readUInt32BE(), y = z4(e.readBytes(l));
      return qe(y);
    case J.StringUTF8:
      const g = e.readUInt32BE(), S = id(e.readBytes(g));
      return o8(S);
    default:
      throw new Nn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const R8 = (t) => t.length % 2 == 0 ? t : `0${t}`, z8 = (t, e) => t.padEnd(e, "0"), Uw = (t, e) => t ? Io(t).length > e : !1;
function Ju(t) {
  return ey(t);
}
const aa = (t) => bk(ud(t)), yd = (t) => Ot(qk(t)), G8 = (t) => Ot(aa(t)), K8 = (t) => {
  const e = aa(t), n = dl(new Uint8Array([0]), new Uint8Array([e.length]), e), r = aa(n);
  return Ot(r);
}, V8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = aa(r);
  return Ot(s);
}, Y8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = ud(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = aa(o);
  return Ot(a);
};
function X8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function Ow(t) {
  const e = Me(t);
  return `0x${Ot(e)}`;
}
function q8(t) {
  return Xn(t);
}
const no = (t) => {
  try {
    return Mi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function wd() {
  return {
    type: gt.MessageSignature,
    data: Ot(new Uint8Array(hl))
  };
}
function Hw(t, e, n, r) {
  const s = hd(0, t, 1, [bo(e)]).hash160, i = Lo(bo(e)) ? Ae.Compressed : Ae.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: yn(n, !1),
    fee: yn(r, !1),
    keyEncoding: i,
    signature: wd()
  };
}
function ca(t) {
  return "signature" in t;
}
function O0(t) {
  return t === le.SerializeP2SH || t === le.SerializeP2WSH;
}
function W8(t) {
  return t === le.SerializeP2SHNonSequential || t === le.SerializeP2WSHNonSequential;
}
function H0(t) {
  const e = Ju(t);
  return e.nonce = 0, e.fee = 0, ca(e) ? e.signature = wd() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Z8(t) {
  const e = [
    t.hashMode,
    be(t.signer),
    Ds(t.nonce, !1, 8),
    Ds(t.fee, !1, 8),
    t.keyEncoding,
    dd(t.signature)
  ];
  return _e(e);
}
function Q8(t) {
  const e = [
    t.hashMode,
    be(t.signer),
    Ds(t.nonce, !1, 8),
    Ds(t.fee, !1, 8)
  ], n = pd(t.fields);
  e.push(gd(n));
  const r = new Uint8Array(2);
  return X4(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function J8(t, e) {
  const n = Ot(e.readBytes(20)), r = BigInt(`0x${Ot(e.readBytes(8))}`), s = BigInt(`0x${Ot(e.readBytes(8))}`), i = e.readUInt8Enum(Ae, (a) => {
    throw new Nn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === le.SerializeP2WPKH && i != Ae.Compressed)
    throw new Nn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
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
function t$(t, e) {
  const n = Ot(e.readBytes(20)), r = BigInt("0x" + Ot(e.readBytes(8))), s = BigInt("0x" + Ot(e.readBytes(8))), i = Nw(e, gt.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case gt.PublicKey:
        Lo(u.contents) || (o = !0);
        break;
      case gt.MessageSignature:
        if (u.pubKeyEncoding === Ae.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new oi("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === le.SerializeP2WSH || t === le.SerializeP2WSHNonSequential))
    throw new oi("Uncompressed keys are not allowed in this hash mode");
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
  return ca(t) ? Z8(t) : Q8(t);
}
function jl(t) {
  const e = t.readUInt8Enum(le, (n) => {
    throw new Nn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === le.SerializeP2PKH || e === le.SerializeP2WPKH ? J8(e, t) : t$(e, t);
}
function Dw(t, e, n, r) {
  const i = t + Ot(new Uint8Array([e])) + Ot(Ds(n, !1, 8)) + Ot(Ds(r, !1, 8));
  if (be(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return yd(be(i));
}
function Fw(t, e, n) {
  const r = 33 + hl, s = Lo(e) ? Ae.Compressed : Ae.Uncompressed, i = t + R8(s.toString(16)) + n.data, o = be(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return yd(o);
}
function e$(t, e, n, r, s) {
  const i = Dw(t, e, n, r), o = h8(s, i), a = p8(s), c = Fw(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function jw(t, e, n, r, s, i) {
  const o = Dw(t, e, n, r), a = bo(a8(o, i, s)), c = Fw(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function n$() {
  const t = Hw(le.SerializeP2PKH, "", 0, 0);
  return t.signer = A8().hash160, t.keyEncoding = Ae.Compressed, t.signature = wd(), t;
}
function D0(t, e, n) {
  return ca(t) ? r$(t, e, n) : s$(t, e, n);
}
function r$(t, e, n) {
  const { pubKey: r, nextSigHash: s } = jw(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = hd(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new oi(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function s$(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case gt.PublicKey:
        Lo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case gt.MessageSignature:
        c.pubKeyEncoding === Ae.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: h } = jw(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (O0(t.hashMode) && (s = h), r.push(u), o += 1, o === 65536)
          throw new oi("Too many signatures");
        break;
    }
  if (O0(t.hashMode) && o !== t.signaturesRequired || W8(t.hashMode) && o < t.signaturesRequired)
    throw new oi("Incorrect number of signatures");
  if (i && (t.hashMode === le.SerializeP2WSH || t.hashMode === le.SerializeP2WSHNonSequential))
    throw new oi("Uncompressed keys are not allowed in this hash mode");
  const a = hd(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new oi(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Rw(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function zw(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Hw(le.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function F0(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return Rw(H0(t.spendingCondition));
      case Le.Sponsored:
        return zw(H0(t.spendingCondition), n$());
      default:
        throw new Pc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function i$(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return D0(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return D0(t.spendingCondition, e, Le.Standard);
    default:
      throw new Pc("Invalid origin auth type");
  }
}
function o$(t, e) {
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
function a$(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: yn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function c$(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: yn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function l$(t, e) {
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
function u$(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(Fl(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(Fl(t.spendingCondition)), e.push(Fl(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function f$(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new Nn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = jl(t), Rw(n);
    case Le.Sponsored:
      n = jl(t);
      const r = jl(t);
      return zw(n, r);
  }
}
class d$ {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: yn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Q4, this.postConditionMode = i ?? wo.Deny, this.postConditions = s ?? pd([]), o)
      this.anchorMode = rk(o);
    else
      switch (r.payloadType) {
        case _t.Coinbase:
        case _t.CoinbaseToAltRecipient:
        case _t.NakamotoCoinbase:
        case _t.PoisonMicroblock:
        case _t.TenureChange:
          this.anchorMode = xn.OnChainOnly;
          break;
        case _t.ContractCall:
        case _t.SmartContract:
        case _t.VersionedSmartContract:
        case _t.TokenTransfer:
          this.anchorMode = xn.Any;
          break;
      }
  }
  signBegin() {
    const e = Ju(this);
    return e.auth = F0(e.auth), e.txid();
  }
  verifyBegin() {
    const e = Ju(this);
    return e.auth = F0(e.auth), e.txid();
  }
  verifyOrigin() {
    return i$(this.auth, this.verifyBegin());
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
      const r = Lo(e);
      n.fields.push(to(r ? Ae.Compressed : Ae.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = e$(n, r, e.fee, e.nonce, s);
    return ca(e) ? e.signature = i : e.fields.push(to(s.data.byteLength === fw ? Ae.Compressed : Ae.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return yd(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l$(this.auth, e);
  }
  setFee(e) {
    this.auth = o$(this.auth, e);
  }
  setNonce(e) {
    this.auth = a$(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new Pc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = c$(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new ti('"version" is undefined');
    if (this.chainId === void 0)
      throw new ti('"chainId" is undefined');
    if (this.auth === void 0)
      throw new ti('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new ti('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new ti('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return Ai(n, this.chainId, 0), e.push(n), e.push(u$(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(gd(this.postConditions)), e.push(Cw(this.payload)), _e(e);
  }
}
function _c(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new qo(be(t.slice(2))) : e = new qo(be(t)) : t instanceof Uint8Array ? e = new qo(t) : e = t;
  const n = e.readUInt8Enum(Bc, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = f$(e), i = e.readUInt8Enum(xn, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(wo, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Nw(e, gt.PostCondition), c = x8(e);
  return new d$(n, s, c, a, o, i, r);
}
const h$ = t8, Wo = Ar, p$ = vw;
const g$ = /* @__PURE__ */ new Set([4001, -31001]), y$ = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], w$ = ["result", "data", "payload", "response", "params"], j0 = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], yl = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), Ui = () => {
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
}, b$ = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Gw = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => b$(i, r)) === s
  );
}, Kw = (t) => t ? Gw(Ui()).some(
  (e) => {
    var n;
    return e.id === t && (yl(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Vw = () => {
  if (typeof window > "u")
    return;
  const t = Ui(), e = Gw(t).filter(
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
  for (const n of y$) {
    const r = Vr(t, n) ?? (t === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, m$ = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = Ui(), n = Vr(e, t) ?? (e === window ? void 0 : Vr(window, t)) ?? nl(t);
  if (n)
    return n;
  if (yl(t) || Kw(t))
    return Vw();
}, Wa = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, x$ = ["blockstack-session", "blockstack"], S$ = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of x$) {
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
S$();
const Yw = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Mn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, E$ = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Yw(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, A$ = (t) => {
  const e = Mn(t);
  if (!e)
    return null;
  const n = Yw(e);
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
}, li = (t) => {
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
    return no(s) ? s : null;
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
  return typeof n.mainnet == "string" && no(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && no(n.testnet) ? n.testnet.trim() : null;
}, R0 = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Xw = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && g$.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, $i = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Mn(n == null ? void 0 : n.message) ?? Mn(e.message) ?? Mn(e.error) ?? Mn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, So = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw $i(e);
    if (e.status === "error")
      throw $i(e.result ?? e);
  }
  return t;
}, z0 = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return So(r);
  } catch (r) {
    throw $i(r);
  }
}, qw = () => Vw(), bd = () => {
  if (typeof window > "u")
    return;
  const t = Ui();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Vr(t, e) ?? (t === window ? void 0 : Vr(window, e));
    if (n)
      return n;
  }
}, G0 = () => {
  if (typeof window > "u")
    return;
  const t = bd();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = Ui();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Vr(e, n) ?? (e === window ? void 0 : Vr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, lc = (t) => {
  var r, s;
  const e = yi();
  if (yl(e) || Kw(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = Ui() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === qw();
}, Rl = (t) => {
  const e = A$(t);
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
  const n = Rl(t), r = E$(t) ?? n;
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
  for (const a of j0)
    if (Rl(s[a])) {
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
  for (const a of j0) {
    const c = Rl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Mn(s[a]) ?? void 0
      };
  }
  for (const a of w$) {
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
}, v$ = (t) => {
  const e = Uc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, k$ = (t) => ({
  ...t,
  fee: li(t.fee),
  nonce: li(t.nonce),
  sponsored: t.sponsored === !0
}), K0 = (t) => ({
  recipient: t.recipient,
  amount: li(t.amount) ?? "0",
  memo: t.memo,
  network: tf(t.network),
  address: t.stxAddress,
  fee: li(t.fee),
  nonce: li(t.nonce),
  sponsored: t.sponsored ?? !1
}), Ww = "WALLET_ADDRESS_MISMATCH", $$ = 45e3;
let Zo = null;
const ef = (t) => {
  t && (Zo = { address: t, at: Date.now() });
}, I$ = () => {
  Zo = null;
}, L$ = () => Zo && Date.now() - Zo.at <= $$ ? Zo.address : null, C$ = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, T$ = async (t) => {
  I$();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = So(await t.request("wallet_connect")), n = la(e);
  return ef(n), n;
}, B$ = async (t, e, n, r) => {
  try {
    return So(await t.request(e, n));
  } catch (s) {
    const i = $i(s);
    if (!C$(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await T$(t);
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
        { code: o ? Ww : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return So(await t.request(e, n));
    } catch (a) {
      throw $i(a);
    }
  }
};
let V0 = 3e4;
const M$ = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${V0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, V0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, N$ = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: Ww }
      );
    return c;
  }, s = L$();
  if (s)
    return Wa(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Wa(n, "account-read");
  try {
    const c = So(
      await M$(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = la(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Xw(c))
      throw $i(c);
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
    }), $i(c);
  }
  const a = la(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return ef(a), r(a, "wallet_connect");
}, P$ = async (t, e) => {
  if (!lc(t)) {
    const i = await z0(
      t,
      "stx_transferStx",
      K0(e)
    );
    return zl(i);
  }
  const n = bd();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await z0(
      n,
      "stx_transferStx",
      K0(e)
    );
    return zl(i);
  }
  const r = qw();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await N$(r, e.stxAddress);
  const s = await B$(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: li(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: li(e.fee) } : {}
    },
    e.stxAddress
  );
  return zl(s);
}, _$ = () => yi(), Zw = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = yi(), e = t ? m$(t) : void 0;
  if (e)
    return e;
  const n = Ui() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, Y0 = (t, e) => {
  const n = Zw(), r = k$({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, v$(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Va(r, e);
  if (lc(n) && !bd()) {
    const s = G0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: yi(),
        route: "legacy-transaction-request"
      }), Va(r, s);
  }
  return void P$(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (R0(s) && lc(n)) {
      const a = G0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: yi(),
          route: "legacy-transaction-request"
        }), Va(r, a);
        return;
      }
    }
    if (R0(s) && !lc(n)) {
      Va(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Xw(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, U$ = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), X0 = (t) => Ow(t).replace(/^0x/, ""), q0 = "This wallet cannot sign messages. Try Xverse or Leather.", W0 = (t) => typeof (t == null ? void 0 : t.request) == "function", Z0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", O$ = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, H$ = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function D$(t, e) {
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
async function F$(t, e) {
  const n = await M4({
    domain: e.domain,
    message: e.message,
    network: ul(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? U$()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function Q0(t) {
  var s, i;
  const e = _$() || "", n = /xverse/i.test(e);
  let r = Zw();
  if (n && !Z0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (Z0(r))
    try {
      return await F$(r, t);
    } catch (o) {
      if (n || !W0(r) || !H$(o)) throw o;
    }
  if (!n && W0(r))
    try {
      return await D$(r, t);
    } catch (o) {
      throw O$(o) ? new Error(q0) : o;
    }
  throw new Error(q0);
}
const J0 = 1000000n, Ns = 1000000n, Oc = 50n, Ne = 3000n, lr = 300n, Ho = 3000n, j$ = 50000n, Gl = 200n, wl = 15000n, rn = (t) => t + Oc;
function rr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / J0}.${(n % J0).toString().padStart(6, "0")}`;
}
function tp(t, e = lr) {
  return t <= Ne ? 0 : Number((t - Ne) / rn(e));
}
function Kl(t, e = 0n) {
  const n = Ns - t - e;
  return n > 0n ? n : 0n;
}
function R$(t, e = lr) {
  return t > Ns ? "over" : t < Ne + rn(e) ? "empty" : t < j$ ? "low" : "ok";
}
const z$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", G$ = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", K$ = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function V$(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || K$.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== z$ + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const Qw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Vl = 3, Y$ = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [nf, Jw] = Qw.split("."), Gn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function rf(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function X$(t) {
  return Gn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function Os(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function tb(t, e = []) {
  const n = await Os(`/v2/contracts/call-read/${nf}/${Jw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: nf, arguments: e.map((r) => "0x" + Gn(Me(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return mr(Xn(n.result));
}
async function q$() {
  const t = await Os(`/v2/contracts/source/${nf}/${Jw}?proof=0`);
  if (typeof t.source != "string" || await X$(t.source) !== G$) throw Error("Deployed source does not match the tested helper.");
  if (V$(await tb("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function eb(t) {
  return t.startsWith("SP") && no(t) && !t.includes(".");
}
async function W$(t) {
  var r;
  if (!eb(t)) throw Error("Invalid mainnet wallet address.");
  const e = await Os(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await Os(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function Z$(t) {
  const e = await Os(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Q$(t, e) {
  var s, i;
  const n = await tb("get-owner", [Wo(t), Wo(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !eb(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function J$(t, e) {
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
async function t5(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function e5(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = _c(rf(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Ji(Go(Mc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Ji(r.contractAddress) + "." + r.contractName.content !== Qw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Gn(Me(r.functionArgs[0])) !== Gn(Me(Wo(t.core))) || Gn(Me(r.functionArgs[1])) !== Gn(Me(Wo(t.song))) || Gn(Me(r.functionArgs[2])) !== Gn(Me(p$(rf(t.id)))) || t.amount !== "50" || e.postConditionMode !== wo.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== ia.Equal || i.principal.prefix !== 2 || Ji(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Ji(r.contractAddress) + "." + r.contractName.content !== Y$ || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Gn(Me(r.functionArgs[0])) !== Gn(Me(Wo(t.song))) || typeof t.liked != "boolean" || Gn(Me(r.functionArgs[1])) !== Gn(Me(h$(t.liked))) || t.amount !== "0" || e.postConditionMode !== wo.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || mr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const n5 = "xtrata.xyz/radio/listening-wallet", r5 = "Link a temporary listening wallet for pay-per-play; no spending permission", zr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && no(t), s5 = (t) => ({
  domain: ki({ name: qe(n5), version: qe("1"), "chain-id": Ar(1) }),
  message: ki({
    purpose: qe(r5),
    main: qe(t.main),
    listening: qe(t.listening),
    issued: Ar(t.issued)
  })
}), nb = 100000n, i5 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function o5(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !zr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= nb).sort(i5);
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
async function a5(t, e, n = 4) {
  if (!zr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${Za}&offset=${o}`, s = Hc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - Za);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= Za ? s : Hc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = o5(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - Za);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Ur = 50, c5 = 6, l5 = 20, ep = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function np(t, e) {
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
async function u5(t, e, n) {
  if (!zr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = Hc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Ur}&offset=0`));
    if (!s || s.total > c5 * Ur) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Ur; o < s.total; o += Ur) {
      const a = Hc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Ur}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Ur}&offset=${u}`, a = np(await e(o(0)), t);
      if (!a || a.total > l5 * Ur) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Ur; u < a.total; u += Ur) {
        const h = np(await e(o(u)), t);
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
function f5(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(ep).map((l, y) => {
    const g = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: g, kind: "gift", to: r.payer, at: y } : zr(l.sender) && g >= nb ? { sender: l.sender, left: g, kind: "deposit", to: l.sender, at: y } : { sender: l.sender, left: g, kind: "dust", to: null, at: y };
  }), i = s.reduce((l, y) => l + y.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && zr(l.recipient) && l.amount > 0n).sort(ep), a = o.reduce((l, y) => l + y.amount, 0n), c = i - n - a;
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
function d5(t, e) {
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
function rp(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const uc = [100, 250, 500], h5 = (t, e) => BigInt(t) * rn(e), Do = ["prepared", "signed", "unknown", "pending"], p5 = 30 * 6e4, Dc = 6e4, Ki = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, g5 = 3e3, Fc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", Yl = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function y5(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, h = !1, l = !1, y = !1, g = null, S = !1, v = "", T = "", U = 0, F, k = null, C, P = [], X, it = -1 / 0;
  const q = /* @__PURE__ */ new Set();
  let W = null, $ = !1, _ = 0, x = null, M = null, K = !1, N = null, nt = !1, Z = null, kt = !1, L = !1, D = !1, lt = !1, dt = !1, at = 0, It = null, fe = Promise.resolve();
  const At = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? lr.toString()), jt = (p) => !!i && !(i.features ?? []).includes(p), Lt = (p, A) => `xtrata.ppp.v1.${p}:${A}`, de = "xtrata.ppp.v1.as-main", Ht = () => {
    if (t.main()) return;
    const p = t.store.get(de);
    return p && zr(p) ? p : void 0;
  }, Ct = () => t.main() ?? Ht(), on = (p = i == null ? void 0 : i.address) => {
    if (!p) return [];
    try {
      const A = JSON.parse(t.store.get(Lt("entries", p)) || "[]");
      return Array.isArray(A) ? A : [];
    } catch {
      return [];
    }
  }, vt = (p) => {
    const A = [p, ...on(p.address).filter((O) => !(O.txid === p.txid && O.kind === p.kind))].slice(0, 200);
    t.store.set(Lt("entries", p.address), JSON.stringify(A));
  }, wn = (p = i == null ? void 0 : i.address) => !!p && t.store.get(Lt("on", p)) !== "0", On = (p) => {
    i != null && i.address && t.store.set(Lt("on", i.address), p ? "1" : "0");
  }, ve = () => on().filter((p) => Do.includes(p.status)), an = () => te() ? [...ve(), ...on(me()).filter((p) => Do.includes(p.status))] : ve(), Ue = () => Ze(i == null ? void 0 : i.address), Ze = (p) => {
    if (!p) return null;
    try {
      return JSON.parse(t.store.get(Lt("deposit", p)) || "null");
    } catch {
      return null;
    }
  }, Oe = (p, A = i == null ? void 0 : i.address) => {
    A && t.store.set(Lt("deposit", A), JSON.stringify(p));
  };
  let Jt = null;
  const De = (p = Dc) => {
    const A = t.now();
    Jt = { since: Jt && A < Jt.until ? Jt.since : A, until: Math.max((Jt == null ? void 0 : Jt.until) ?? 0, A + p) };
  }, Ge = () => !!Jt && t.now() < Jt.until && (o === void 0 || o < Ne + rn(At())), He = () => !!Ue() || Ge(), me = () => jt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), te = () => !!(i != null && i.address) && me() !== i.address, qn = () => te() ? c && c.for === me() ? c.value : void 0 : o, Wn = (p) => p !== void 0 && p < Ne + Gl, I = () => ve().filter((p) => t.now() - p.created > p5 && q.has(p.txid)), z = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Ct() || r === Ct() && !e.allowed), m = () => z() && !(i != null && i.linked), H = () => {
    const p = Ct();
    return !m() && !!p && !!(i != null && i.linked) && i.linked !== p;
  }, ut = (p) => Lt("return-to", p), bt = (p = i == null ? void 0 : i.address) => {
    if (!p) return;
    const A = t.store.get(ut(p));
    return A && zr(A) && A !== p ? A : void 0;
  }, qt = (p = i == null ? void 0 : i.address) => W && W.for === p ? W.res : null;
  function re() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const p = bt();
    if (p) return { to: p, kind: "chosen" };
    const A = qt();
    if (A != null && A.ok && A.funder) return { to: A.funder, kind: "funder" };
  }
  const Kt = (p) => Lt("gift", p);
  function Vt() {
    const p = i == null ? void 0 : i.address;
    if (!p) return null;
    if ((N == null ? void 0 : N.for) === p) return N.info;
    try {
      const A = JSON.parse(t.store.get(Kt(p)) || "null");
      return A && typeof A.returnTo == "string" && typeof A.treasury == "string" ? A : null;
    } catch {
      return null;
    }
  }
  async function Yt() {
    var ht;
    const p = i == null ? void 0 : i.address;
    if (!p || !t.giftInfo || !((ht = e == null ? void 0 : e.gifts) != null && ht.enabled) || nt) return;
    const A = (N == null ? void 0 : N.for) === p ? N : null, O = A ? A.ok ? A.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (A && t.now() - A.at < O) return;
    nt = !0;
    const V = Vt();
    try {
      const G = await t.giftInfo(p);
      N = { for: p, info: G, ok: !0, at: t.now() }, t.store.set(Kt(p), JSON.stringify(G));
    } catch {
      N = { for: p, info: V, ok: !1, at: t.now() };
    } finally {
      nt = !1;
    }
  }
  const Fe = () => on().reduce((p, A) => Do.includes(A.status) ? p + BigInt(A.amount || "0") + BigInt(A.fee || "0") : p, 0n);
  function pt() {
    if (o === void 0) return 0;
    const p = o - Fe() - BigInt(pe.length) * rn(At());
    return p > 0n ? tp(p, At()) : 0;
  }
  const xt = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", Wt = "EMPTY — ADD STX TO PLAY";
  function se() {
    if (!(e != null && e.here)) return null;
    const p = (A, O) => ({ reason: A, text: O });
    switch (An()) {
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
        return He() ? p("arriving", "YOUR PLAYS ARE ARRIVING") : p("out", te() ? xt : Wt);
      case "ready":
        return !wn() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? p("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : D ? pt() < 1 ? p("out", te() ? xt : Wt) : null : p("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const je = () => {
    var p;
    return !!(i != null && i.address) && te() && !!((p = Vt()) != null && p.player);
  };
  function ie() {
    return je() ? { locked: !0, known: !0 } : null;
  }
  const cn = 3 * 6e4, Qe = () => !!Vt() && !!t.history && !(i != null && i.linked);
  async function Cr() {
    const p = i.address, A = Vt(), { balance: O, nonce: V } = await t.chain.account(p), ht = await t.history(p, !0);
    if (!ht.ok) return null;
    const G = f5({ self: p, balance: O, inbound: ht.inbound, outgoing: ht.outgoing, gift: { sender: A.treasury, payer: A.returnTo } });
    if (!G.ok) return null;
    const tt = d5(G.parts, Ho);
    return { balance: O, nonce: V, parts: G.parts, steps: tt.steps, tooSmall: tt.tooSmall.length };
  }
  const Zn = () => kt ? { state: "unavailable" } : !Z || t.now() - Z.at > cn || o !== void 0 && o !== Z.balance ? { state: "none" } : Z.plan;
  function An() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const p = Ct();
    if (!m()) {
      if (!p) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : H() ? "wrong-wallet" : i.state === "known" ? "locked" : !m() && i.linked !== p ? "link" : o === void 0 ? "loading" : o > Ns ? "over" : o < Ne + rn(At()) ? "fund" : "ready" : "loading";
  }
  const vn = () => {
    var p, A, O, V, ht;
    return {
      step: An(),
      busy: u,
      message: v,
      error: T,
      notice: kn(),
      gate: e,
      main: Ct(),
      mainConnected: !!t.main(),
      standIn: Ht(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : R$(o, At()),
      playsLeft: o === void 0 ? 0 : tp(o, At()),
      allowance: o === void 0 ? Ns : Kl(o, BigInt(((p = Ue()) == null ? void 0 : p.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: wn(),
      entries: on(),
      depositTxid: ((A = Ue()) == null ? void 0 : A.txid) ?? F,
      depositPending: He(),
      arrival: He() ? { since: ((O = Ue()) == null ? void 0 : O.at) ?? (Jt == null ? void 0 : Jt.since) ?? t.now(), graceMs: Dc } : null,
      walletOutdated: jt("like"),
      linkedListening: X && X === Ct() ? P.map((G) => G.listening) : [],
      serverLinked: !!k && C === `${Ct()}:${i == null ? void 0 : i.address}`,
      stuck: I().length,
      armed: lt,
      queued: pe.length,
      solo: m(),
      returnTo: (V = re()) == null ? void 0 : V.to,
      returnToKind: (ht = re()) == null ? void 0 : ht.kind,
      funderState: (() => {
        const G = qt();
        return G ? G.ok ? G.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const G = qt();
        return !!G && G.ok && G.distinct > 1;
      })(),
      walletCannotSolo: m() && jt("standalone"),
      walletCannotMulti: jt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((G) => G !== Ct() && G !== (i == null ? void 0 : i.linked)),
      creditedTo: m() && (i != null && i.address) && (x == null ? void 0 : x.for) === i.address && x.main ? x.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Lt("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (M == null ? void 0 : M.for) === i.address && M.unused,
      gift: (() => {
        const G = Vt();
        return G ? { player: G.player, from: G.from, source: G.source, amount: G.amount } : null;
      })(),
      giftPlays: Vt() ? pt() : 0,
      playCost: rn(At()),
      giftStop: se(),
      albumLock: ie(),
      returnPlan: Zn(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: jt("slots"),
      likeFunds: (() => {
        var ft;
        const G = me();
        if (!G || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const tt = qn();
        return { address: G, balance: tt, low: Wn(tt), album: te(), pending: !!Ze(G), txid: (ft = Ze(G)) == null ? void 0 : ft.txid, main: Ct() };
      })()
    };
  }, kn = () => U ? U < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Rt = (p, A = "") => {
    v = p, T = A, t.changed();
  };
  async function Te(p, A) {
    if (!u) {
      u = p, T = "", t.changed();
      try {
        await A();
      } catch (O) {
        const V = O instanceof Error ? O.message : String(O);
        T = /Cancelled in the listening wallet/.test(V) ? "" : V, T || (v = "Not now. Nothing was signed.", dt = !0);
      } finally {
        u = null, await $n(!0);
      }
    }
  }
  const ln = () => !!(e != null && e.enabled) && e.here && (m() || !!Ct() && e.allowed), Wr = () => ln() && !H(), js = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", un = () => {
    if (H()) throw new Error(js());
  };
  async function Tr() {
    if (!ln()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const Hn = (p) => {
    const A = Ct();
    return p.request("listening.status", A ? { main: A } : void 0);
  };
  async function xe(p = !1) {
    i != null && i.address && (!p && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await Br(p)));
  }
  async function Br(p = !1) {
    const A = me();
    if (!(!te() || !A || (i == null ? void 0 : i.state) !== "unlocked") && !(!p && (c == null ? void 0 : c.for) === A && t.now() - c.at < 3e4))
      try {
        c = { for: A, value: await t.chain.balance(A), at: t.now() };
      } catch {
      }
  }
  async function Co(p) {
    if ((X !== p || t.now() - it >= 6e4) && (P = await t.links(p), X = p, it = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === p) return;
    const A = `${p}:${i.address}`;
    C === A && k || (k = P.find((O) => O.listening === i.address) ?? null, C = A);
  }
  async function To() {
    const p = i == null ? void 0 : i.address;
    if (!m() || !p || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const A = qt(p);
    if (A != null && A.ok && A.funder) return;
    const O = A != null && A.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, _ - 1), 30 * 6e4);
    if (!(W && W.for === p && t.now() - W.at < O)) {
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
    if (!(!m() || !p || i != null && i.linked || !t.mainOf || K) && !(x && x.for === p && (x.ok || t.now() - x.at < 6e4))) {
      K = !0;
      try {
        x = { for: p, main: await t.mainOf(p), ok: !0, at: t.now() };
      } catch {
        x = { for: p, main: null, ok: !1, at: t.now() };
      } finally {
        K = !1;
      }
    }
  }
  async function Rs() {
    const p = i == null ? void 0 : i.address;
    if (!(!p || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (M == null ? void 0 : M.for) === p) && t.store.get(Lt("created", p)) !== "1")
      try {
        M = { for: p, unused: await t.chain.confirmedNonce(p) === 0n };
      } catch {
      }
  }
  async function Dn() {
    var ht;
    const p = i == null ? void 0 : i.address;
    if (!p) return !1;
    let A, O = !1;
    const V = /* @__PURE__ */ new Map();
    for (const G of an())
      try {
        const tt = await t.chain.transaction(G.txid);
        if (!tt) {
          if (q.add(G.txid), t.now() - G.created > 15 * 6e4 && !V.has(G.address) && V.set(G.address, await t.chain.confirmedNonce(G.address)), A = V.get(G.address), A !== void 0 && A > BigInt(G.nonce)) {
            vt({ ...G, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((G.status === "unknown" || G.status === "signed") && G.raw)
            try {
              await t.chain.broadcast(G.raw, G.txid), vt({ ...G, status: "pending" });
            } catch (et) {
              Ki(et) && vt({ ...G, status: "failed", note: et.message, raw: void 0 });
            }
          continue;
        }
        q.delete(G.txid);
        const ft = String(tt.tx_status);
        if (ft === "success" && tt.canonical !== !1 && tt.is_unanchored === !1) {
          if (vt({ ...G, status: "confirmed", confirmedAt: t.now(), actualFee: String(tt.fee_rate ?? G.fee), raw: void 0 }), O = !0, G.kind === "like" && (S = !0, G.status !== "confirmed" && typeof G.liked == "boolean"))
            try {
              (ht = t.likeConfirmed) == null || ht.call(t, G.song, G.liked);
            } catch {
            }
        } else ft.startsWith("abort_") || ft.startsWith("dropped_") ? vt({ ...G, status: "failed", note: ft, raw: void 0 }) : G.status !== "pending" && vt({ ...G, status: "pending" });
      } catch {
      }
    for (const G of te() ? [p, me()] : [p]) {
      const tt = Ze(G);
      if (tt)
        try {
          const ft = await t.chain.transaction(tt.txid), et = String((ft == null ? void 0 : ft.tx_status) ?? "");
          (et === "success" && ft.is_unanchored === !1 || et.startsWith("abort_") || et.startsWith("dropped_") || !ft && t.now() - tt.at > 2 * 36e5) && (Oe(null, G), et === "success" && De(2e4), a = -1 / 0, c = null, /on its way/i.test(v) && (v = ""));
        } catch {
        }
    }
    return O;
  }
  async function $n(p = !1) {
    var A;
    try {
      const O = Ct();
      if ((p || !e || r !== O || t.now() - n > 3e5) && (e = await t.config(O), n = t.now(), r = O), !e.enabled || !e.here || !m() && (!O || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), lt && Zr(), t.changed();
        return;
      }
      await Tr(), i = await Hn(s), H() && i.state === "unlocked" && (Pr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await Hn(s)), O && e.allowed && await Co(O), await xe(p), await To(), await Bo(), await Rs(), await Yt(), await Dn() && await xe(!0), await Br(), await Ys(), U = 0;
    } catch {
      U++;
    }
    if (An() === "locked" ? No() : lt && Zr(), S) {
      S = !1;
      try {
        (A = t.likesChanged) == null || A.call(t);
      } catch {
      }
    }
    t.changed(), pe.length && !Nr && f();
  }
  async function Mo(p) {
    const A = i == null ? void 0 : i.root;
    if (!A || i != null && i.slot || !(i != null && i.address) || jt("slots")) return;
    const O = Number(t.store.get(Lt("slot", A)));
    if (!(!Number.isSafeInteger(O) || O < 1))
      try {
        const { balance: V } = await t.chain.account(i.address);
        if (V >= Ne + rn(At())) return;
        await p.request("listening.openSlot", { slot: O }), i = await Hn(p), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function zs(p, A) {
    var G;
    un();
    const O = !(i != null && i.address) || wn(i.address), V = i != null && i.linked ? (G = t.nameOf) == null ? void 0 : G.call(t, i.linked) : void 0;
    await p.request("listening.unlock", { mode: "unlock", terms: O ? Qr() : void 0, anyPasskey: A, ...Ct() ? { main: Ct() } : {}, ...V ? { label: V } : {} }), i = await Hn(p), O && (wn(i.address) ? await Jr() : await p.request("listening.stop")), await Mo(p), Rt(O ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const ht = g;
    g = null, ht && t.now() - ht.at < 12e4 && setTimeout(() => void $n(!0).then(() => d(ht)), 0);
  }
  function No() {
    lt || u || dt || at >= 3 || !s || !(i != null && i.address) || (lt = !0, fe = (async () => {
      try {
        await zs(s, !1), at = 0;
      } catch (p) {
        const A = p instanceof Error ? p.message : String(p);
        /Cancelled in the listening wallet/.test(A) ? It || (dt = !0, Rt("Not now. Nothing was signed.")) : /did not answer/.test(A) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (at++, T = A);
      } finally {
        lt = !1;
        const p = It;
        It = null, p ? await p() : await $n(!0);
      }
    })());
  }
  async function Zr(p) {
    lt && (It = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await fe), p && await p(), t.changed();
  }
  const Qr = () => ({
    fee: At().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Ns.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function Jr() {
    if (!(i != null && i.address)) return !1;
    if (D || (D = await t.tabLock(i.address)), !D)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Fn(p, A) {
    const O = i.address, { balance: V, nonce: ht } = A ?? await t.chain.account(O);
    o = V;
    const G = await s.request("listening.prepareReturn", {
      mode: p.mode,
      balance: V.toString(),
      nonce: ht.toString(),
      fee: Ho.toString(),
      ...p.amount !== void 0 ? { amount: p.amount.toString() } : {},
      ...p.linked ? {} : { destination: p.to }
    });
    if (G.recipient !== p.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const tt = p.mode === "amount" ? p.amount : p.mode === "all" ? V - Ho : V - Ns - Ho, ft = _c(G.raw);
    if (mr(ft.payload.recipient).value !== p.to || String(ft.payload.amount) !== G.amount || tt !== void 0 && G.amount !== tt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const et = {
      id: Yl(),
      address: O,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: G.recipient,
      amount: G.amount,
      fee: G.fee,
      nonce: ht.toString(),
      created: t.now(),
      status: "signed",
      raw: G.raw,
      txid: G.txid
    };
    t.validate(et), vt(et);
    try {
      await t.chain.broadcast(G.raw, G.txid), vt({ ...et, status: "pending" });
    } catch (Et) {
      throw vt({ ...et, status: "unknown", note: Et.message }), Et;
    }
    return G;
  }
  const Gs = wl, ur = Ho;
  async function ts(p, A, O) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (jt("slots") || jt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const V = i.slot ?? 0;
    if (p === A || ![p, A].includes(V) || ![p, A].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const ht = i.root ?? i.address, G = p === 0 ? ht : i.address, tt = A === 0 ? ht : i.address, { balance: ft, nonce: et } = await t.chain.account(G);
    if (ft < O + ur + Ne) throw new Error(p === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const Et = await s.request("listening.signMove", { from: p, to: A, amount: O.toString(), fee: ur.toString(), nonce: et.toString(), balance: ft.toString() }), Zt = _c(Et.raw);
    if (Et.from !== G || Et.to !== tt || Et.amount !== O.toString() || mr(Zt.payload.recipient).value !== tt || String(Zt.payload.amount) !== O.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const oe = {
      id: Yl(),
      address: G,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: tt,
      amount: Et.amount,
      fee: Et.fee,
      nonce: et.toString(),
      created: t.now(),
      status: "signed",
      raw: Et.raw,
      txid: Et.txid
    };
    t.validate(oe), vt(oe);
    try {
      await t.chain.broadcast(Et.raw, Et.txid), vt({ ...oe, status: "pending" });
    } catch (ge) {
      throw vt({ ...oe, status: "unknown", note: ge.message }), ge;
    }
    return Oe({ txid: Et.txid, amount: Et.amount, at: t.now() }, tt), tt === ht && ht !== i.address ? c = null : a = -1 / 0, Et;
  }
  let Ks = !1;
  const he = /* @__PURE__ */ new Map(), Vs = (p) => Lt("float", p);
  async function Ys() {
    if (Ks || (i == null ? void 0 : i.state) !== "unlocked" || !te() || jt("move") || jt("rootLike") || !i.address) return;
    const p = i.address;
    if (t.store.get(Vs(p)) === "1") return;
    const A = Vt();
    if (!(A != null && A.player) || A.state !== "arrived") return;
    const O = qn();
    if (O === void 0 || o === void 0) return;
    if (!Wn(O)) {
      t.store.set(Vs(p), "1");
      return;
    }
    if (Ze(me()) || es() || an().length || o < Gs * 4n + Ne + ur) return;
    const V = he.get(p);
    if (!(V && (V.n >= 3 || t.now() - V.at < 5 * 6e4))) {
      Ks = !0, he.set(p, { n: ((V == null ? void 0 : V.n) ?? 0) + 1, at: t.now() });
      try {
        await ts(i.slot ?? 0, 0, Gs), t.store.set(Vs(p), "1");
      } catch (ht) {
        console.warn("[radio] likes float not sent yet", ht);
      } finally {
        Ks = !1;
      }
    }
  }
  async function jn(p) {
    if (ve().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const A = await Cr().catch(() => null);
    if (!A)
      throw Z = null, kt = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    kt = !1, o = A.balance;
    const O = { balance: A.balance, nonce: A.nonce };
    if (p === "excess") {
      const ft = rp(A.parts) ?? bt();
      if (!ft) throw new Error("Choose where to send the excess first.");
      await Fn({ mode: "excess", to: ft, linked: !1 }, O), Z = null, Rt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const V = A.steps;
    if (!V.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!Z && Z.balance === A.balance && t.now() - Z.at <= cn && Z.steps.length === V.length && Z.steps.every((ft, et) => ft.to === V[et].to && ft.mode === V[et].mode && ft.send === V[et].send))) {
      Z = {
        at: t.now(),
        balance: A.balance,
        steps: V,
        parts: A.parts,
        plan: { state: "ready", steps: V.map((ft) => ({ to: ft.to, kind: ft.kind, send: ft.send.toString() })), kept: A.tooSmall, excess: rp(A.parts) }
      }, Rt(V.length > 1 ? `This goes back in ${V.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const G = V[0], tt = G.to ?? bt();
    if (!tt) throw new Error("Choose where to send the rest first.");
    if (G.mode === "amount" && jt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Fn({ mode: G.mode, to: tt, linked: !1, ...G.mode === "amount" ? { amount: G.send } : {} }, O), Z = null, V.length === 1 ? (On(!1), Rt("Returned ✓ Paying is off.")) : Rt(`Returned ✓ ${V.length - 1} more ${V.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Mr = {
    forceRefresh: () => $n(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (p) => {
      if (!t.main() && !(p !== null && !zr(p))) {
        if (p === Ht()) return $n(!0);
        t.store.set(de, p ?? ""), T = "", v = "", o = void 0, a = -1 / 0, c = null, await $n(!0);
      }
    },
    create: () => Te("Waiting for your passkey…", async () => {
      const p = await Tr();
      await p.request("listening.unlock", { mode: "create", terms: Qr(), ...t.main() ? { main: t.main() } : {} }), i = await Hn(p), i.address && t.store.set(Lt("created", i.address), "1"), On(!0), Rt(m() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await Jr();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (p) => {
      p ? De() : Jt = null, t.changed();
    },
    giftSent: (p, A) => {
      !(i != null && i.address) || Ue() || (Oe({ txid: p, amount: A.toString(), at: t.now() }), a = -1 / 0, N = null, Rt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (p) => {
      if (un(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (jt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await Tr()).request("listening.bindSlot", { slot: p, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (p, A, O, V) => {
      Oe({ txid: O, amount: V.toString(), at: t.now() }, A), N = null, await Mr.openAlbum(p), Rt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (p) => Te("Opening…", async () => {
      if (un(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (jt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (h || l || y) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === p) return;
      Pr(), await s.request("listening.openSlot", { slot: p }), i = await Hn(s), o = void 0, a = -1 / 0, Z = null, kt = !1;
      const A = i.root;
      A && p > 0 && t.store.set(Lt("slot", A), String(p)), Rt(p === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (p = !1) => {
      const A = () => Te("Waiting for your passkey…", async () => zs(await Tr(), p));
      return lt ? p ? jt("cancel") ? (Rt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : Zr(async () => {
        (An() === "locked" || An() === "intro") && await A();
      }) : fe : A();
    },
    link: () => Te("Sign in your wallet…", async () => {
      un();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const A = (await t.links(p)).find((O) => O.listening === i.address);
      if (A)
        await s.request("listening.link", { main: p, issued: A.issued, mainSignature: A.mainSignature });
      else {
        const O = { main: p, listening: i.address, issued: t.now() }, V = await t.signWithMain(p, s5(O)), ht = await s.request("listening.link", { main: p, issued: O.issued, mainSignature: V });
        await t.saveLink({ ...O, mainSignature: V, listeningSignature: ht.listeningSignature }), it = -1 / 0;
      }
      Rt("Linked ✓");
    }),
    deposit: () => Te("Approve the deposit in your wallet…", async () => {
      un();
      const p = t.main();
      if (!p || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Ue()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (Ge()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await xe(!0);
      const A = Kl(o ?? 0n);
      if (A <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      F = await t.deposit(p, i.address, A), F && Oe({ txid: F, amount: A.toString(), at: t.now() }), Rt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Te("Approve the top-up in your wallet…", async () => {
      un();
      const p = t.main(), A = me();
      if (!p || !A) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Ze(A)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const O = await t.chain.balance(A);
      te() ? c = { for: A, value: O, at: t.now() } : (o = O, a = t.now());
      const V = Kl(O);
      if (V <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const ht = await t.deposit(p, A, V);
      ht && Oe({ txid: ht, amount: V.toString(), at: t.now() }, A), Rt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (p) => Te("Adding plays…", async () => {
      if (un(), !te()) throw new Error("Open the album you want to add plays to first.");
      if (!uc.includes(p)) throw new Error("Choose one of the amounts offered.");
      const A = h5(p, At());
      if (h || l || y) throw new Error("Still sending a payment. Try again in a moment.");
      if (an().length || Ue()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ts(0, i.slot ?? 0, A), Rt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Te("Confirm in the listening wallet…", async () => {
      if (!Wr()) throw new Error("Connect your wallet first.");
      await Jr(), await s.request("listening.approveSession", Qr()), On(!0), Rt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Te("Clearing…", async () => {
      for (const p of I())
        await t.chain.transaction(p.txid) || vt({ ...p, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Rt("Cleared ✓");
    }),
    switchOff: () => Te("Switching off…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.stop")), On(!1), Rt("Music support is off. Playback is paused.");
    }),
    lock: () => Te("Locking…", async () => {
      Pr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Rt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (p) => {
      const A = String(p ?? "").trim();
      if (!(i != null && i.address)) return Rt("", "Unlock the listening wallet first.");
      if (!zr(A)) return Rt("", "Enter a standard mainnet address (it starts with SP).");
      if (A === i.address) return Rt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(ut(i.address), A), Rt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(ut(i.address), ""), t.changed();
    },
    returnFunds: (p) => Te("Check the return in the listening wallet…", async () => {
      if (!Wr()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Qe()) return jn(p);
      const A = re();
      if (!A) throw new Error(m() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (A.kind !== "linked" && jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (ve().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Fn({ mode: p, to: A.to, linked: A.kind === "linked" }), p === "all" && On(!1), Rt(p === "all" ? A.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, pe = [], Oi = 10, Hi = 30 * 6e4;
  let Nr = !1;
  const es = () => h || !!u || l || y, Pr = () => {
    pe.length && (pe.length = 0, t.changed());
  };
  async function Di(p) {
    if (!pe.some((A) => A.id === p.id) && !on().some((A) => A.id === p.id) && (pe.push({ ...p, at: t.now() }), pe.length > Oi && pe.shift()), es() || ve().length) {
      const A = pe.length;
      v = `Queued ${A === 1 ? "this song" : A + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await f();
  }
  async function f() {
    if (!Nr) {
      Nr = !0;
      try {
        for (; pe.length; ) {
          for (; pe.length && t.now() - pe[0].at > Hi; ) pe.shift();
          if (!pe.length || es() || await b(pe[0]) === "wait") return;
          pe.shift();
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
      await $n();
      const O = An();
      if (O === "loading") return "wait";
      if (O !== "ready" || !wn() || !(i != null && i.session) || i.session.playsLeft < 1 || !D) return "done";
      if (ve().length) return "wait";
      L || (await t.chain.verify(), L = !0);
      const V = i.address, { balance: ht, nonce: G } = await t.chain.account(V);
      o = ht, a = t.now();
      const tt = await t.chain.owner(Vl, p.song);
      if (tt === V || tt === Ct()) return "done";
      const ft = await s.request("listening.signPlay", {
        core: Vl,
        song: p.song,
        receipt: p.id,
        fee: At().toString(),
        nonce: G.toString(),
        balance: ht.toString()
      }), et = {
        id: p.id,
        address: V,
        kind: "play",
        core: Vl,
        song: p.song,
        recipient: tt,
        amount: "50",
        fee: At().toString(),
        nonce: G.toString(),
        created: t.now(),
        status: "signed",
        raw: ft.raw,
        txid: ft.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(et), vt(et);
      const Et = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`;
      try {
        await t.chain.broadcast(ft.raw, ft.txid), vt({ ...et, status: "pending" }), v = `♪ Paid ${Et}`, T = "";
      } catch (Zt) {
        vt({ ...et, status: Ki(Zt) ? "failed" : "unknown", note: Zt.message, ...Ki(Zt) ? { raw: void 0 } : {} }), T = Zt.message;
      }
      return i = await Hn(s), "done";
    } catch (O) {
      const V = O instanceof Error ? O.message : "payment unavailable";
      return (A = Vt()) != null && A.player ? (v = "Payment is taking a moment: " + V, "wait") : (v = "This song played free: " + V, "done");
    } finally {
      h = !1, t.changed();
    }
  }
  function E(p) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(An()) || jt("like") ? !1 : (d(p), !0);
  }
  async function d(p) {
    const A = p.title ? `“${p.title}”` : `song #${p.song}`, O = (ke) => {
      var In;
      T = ke, v = "";
      try {
        (In = t.likeFailed) == null || In.call(t, p.song);
      } catch {
      }
      t.changed();
    }, V = te(), ht = An(), G = Ct(), tt = V && (ht === "fund" || ht === "over") ? "ready" : ht, ft = m() ? me() : G;
    if (tt === "locked") {
      g = { ...p, at: t.now() }, Rt(`Unlock to like ${A}. It sends straight after.`);
      return;
    }
    if (tt === "wrong-wallet") return O(js());
    if (tt === "link") return O("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (m() && jt("standalone")) return O("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (tt === "fund") return O("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (tt === "over") return O("Return the excess first: the listening wallet holds more than 1 STX.");
    if (V) {
      await Br(!0);
      const ke = qn();
      if (Wn(ke))
        return t.changed(), O(Fc);
    }
    if (tt !== "ready" || !ft) return O("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return O("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!D) return O("Pay-per-play is running in another tab. Like from that tab.");
    const et = on(me()).find((ke) => ke.kind === "like" && ke.song === p.song);
    if (et && Do.includes(et.status))
      return O(`Your last like for ${A} is still on its way. It can change again once it confirms.`);
    if (l) return O("One like at a time: your last one is still being sent.");
    if ((et == null ? void 0 : et.status) === "confirmed" && t.now() - (et.confirmedAt ?? 0) < g5)
      return O(`Your like for ${A} has only just confirmed. Try again in a moment.`);
    let Et;
    y = !0;
    try {
      Et = t.likeState ? (await t.likeState(ft, p.song)).by : p.likedBy ?? [];
    } catch {
      Et = p.likedBy;
    } finally {
      y = !1;
    }
    if (!Et) return O(`Could not check ${A} right now. Try the heart again.`);
    const Zt = me(), ge = ((et == null ? void 0 : et.status) === "confirmed" && typeof et.liked == "boolean" && t.now() - (et.confirmedAt ?? et.created) < 5 * 6e4 ? et.liked : void 0) ?? Et.includes(Zt);
    if (!ge && Et.some((ke) => ke !== Zt)) return O(m() ? `${A} was liked from another wallet of yours. Unlike it there.` : `${A} was liked from your main wallet${Et.includes(G) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await R({ song: p.song, liked: !ge, title: p.title, artist: p.artist });
  }
  async function R(p) {
    var V, ht, G;
    if (l) {
      Rt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const A = p.title ? `“${p.title}”${p.artist ? ` by ${p.artist}` : ""}` : `song #${p.song}`, O = t.wait ?? ((tt) => new Promise((ft) => setTimeout(ft, tt)));
    try {
      Rt(`${p.liked ? "Liking" : "Unliking"} ${A}…`);
      const tt = t.now() + 12e4;
      for (; h || (te() ? on(me()).some((ge) => Do.includes(ge.status)) : ve().length); ) {
        if (t.now() > tt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await O(5e3), await $n(!0);
      }
      if (!te() && An() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const ft = me(), { balance: et, nonce: Et } = await t.chain.account(ft);
      if (te() ? c = { for: ft, value: et, at: t.now() } : (o = et, a = t.now()), Wn(et)) throw new Error(Fc);
      const Zt = await s.request("listening.signLike", {
        song: p.song,
        liked: p.liked,
        fee: Gl.toString(),
        nonce: Et.toString(),
        balance: et.toString()
      }), oe = {
        id: Yl(),
        address: ft,
        kind: "like",
        core: 0,
        song: p.song,
        liked: p.liked,
        recipient: "",
        amount: "0",
        fee: Gl.toString(),
        nonce: Et.toString(),
        created: t.now(),
        status: "signed",
        raw: Zt.raw,
        txid: Zt.txid,
        ...p.title ? { title: String(p.title).slice(0, 120) } : {},
        ...p.artist ? { artist: String(p.artist).slice(0, 120) } : {}
      };
      t.validate(oe), vt(oe);
      try {
        await t.chain.broadcast(Zt.raw, Zt.txid), vt({ ...oe, status: "pending" }), v = `${p.liked ? "♥ Liked" : "Unliked"} ${A}`, T = "";
        try {
          (V = t.likeSent) == null || V.call(t, p.song, p.liked);
        } catch {
        }
      } catch (ge) {
        if (vt({ ...oe, status: Ki(ge) ? "failed" : "unknown", note: ge.message, ...Ki(ge) ? { raw: void 0 } : {} }), T = ge.message, Ki(ge)) try {
          (ht = t.likeFailed) == null || ht.call(t, p.song);
        } catch {
        }
      }
      i = await Hn(s);
    } catch (tt) {
      T = "Like not sent: " + (tt instanceof Error ? tt.message : "the listening wallet is unavailable");
      try {
        (G = t.likeFailed) == null || G.call(t, p.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), f();
    }
  }
  return { snapshot: vn, refresh: $n, onListened: Di, heart: E, toggleLike: d, ...Mr };
}
const rb = ["Connect", "Passkey", "Link & fund", "Listen"], sb = ["Passkey", "Add 1 STX", "Listen"], sf = (t) => t ? sb : rb;
function w5(t) {
  if (t.solo) return b5(t);
  const e = rb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function b5(t) {
  const e = sb.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function m5(t, e) {
  return !e || e.at >= sf(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const x5 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function S5(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !x5(r.id)));
}
const E5 = {}, A5 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, v5 = (t) => {
  const e = E5;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, k5 = (t) => `/hiro/${t}`, $5 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, I5 = (t) => {
  const e = v5(t);
  if (e)
    return [$5(e)];
  const n = A5[t];
  return typeof window < "u" ? [`${window.location.origin}${k5(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, L5 = {}, sp = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, C5 = "xtrata.log.enabled", T5 = "xtrata.log.level", B5 = "xtrata.log.tags", M5 = "xtrata.log.dedupe", Qa = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, N5 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, P5 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, _5 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, U5 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, O5 = () => {
  const t = L5 ?? {}, e = Qa(C5) ?? t.VITE_LOG_ENABLED, n = Qa(T5) ?? t.VITE_LOG_LEVEL, r = Qa(B5) ?? t.VITE_LOG_TAGS, s = Qa(M5) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: N5(e),
    level: P5(n) ?? "warn",
    tags: U5(r),
    dedupe: _5(s)
  };
}, H5 = (t, e, n) => !t.enabled || sp[n] < sp[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), D5 = (t, e, n, r) => {
  const s = O5();
  if (!H5(s, e, t) || j5(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, F5 = /* @__PURE__ */ new Set();
let ip = null;
const j5 = (t, e, n, r, s) => (ip !== t && (F5.clear(), ip = t), !1), R5 = (t, e, n) => D5("debug", t, e, n), z5 = {}, G5 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, K5 = (t) => {
  const e = z5, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : G5[t];
}, V5 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, Y5 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return V5.test(n) ? n : null;
}, X5 = (t) => t.replace(/\/+$/, ""), q5 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), op = (t) => {
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
}, Vi = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, W5 = (t) => {
  var c, u;
  let e;
  try {
    e = mr(q8(t));
  } catch {
    return null;
  }
  const n = Vi(e);
  if (!n || n.success === !1)
    return null;
  const r = Vi(n.value), s = Vi(r == null ? void 0 : r.value), i = Vi(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = op((c = Vi(i.name)) == null ? void 0 : c.value), a = op((u = Vi(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : Y5(`${o}.${a}`);
}, Z5 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${X5(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [Ow(xw(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : W5(i.result);
}, Q5 = async (t) => {
  const e = t.address.trim();
  if (!no(e))
    return null;
  const n = K5(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of I5(t.network))
    try {
      return await Z5({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return R5("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: q5(r)
  }), null;
};
function J5(t, e, n = {}) {
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
const ap = Object.freeze({
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
}), cp = Object.freeze({ 139: "melophonic" });
function lp(t, e = "") {
  const n = String(t);
  return Object.hasOwn(ap, n) ? ap[n] : Object.hasOwn(cp, n) ? cp[n] : e;
}
const up = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function fp(t, e = "") {
  return Object.hasOwn(up, String(t)) ? up[String(t)] : e;
}
const ib = 10000n, md = 1000000n, jc = 3000n, t6 = (t, e) => `${t}#gift=${e}`, e6 = 100, Fo = (t, e = lr) => t <= Ne ? 0 : Number((t - Ne) / rn(e)), dp = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), ob = "xtrata.xyz/radio/gifts", Xl = e6, n6 = "Create a prefunded Xtrata radio gift batch", r6 = (t) => ({
  domain: ki({ name: qe(ob), version: qe("1"), "chain-id": Ar(1) }),
  message: ki({
    purpose: qe(n6),
    creator: qe(t.creator),
    count: Ar(t.count),
    amount: Ar(BigInt(t.amount)),
    label: qe(t.label),
    issued: Ar(t.issued),
    ...t.player ? { player: qe(t.player) } : {}
  })
}), s6 = (t, e, n = lr) => Ne + BigInt(t) * rn(n) + (e ? wl : 0n), i6 = (t, e = lr) => Number((md - Ne - (t ? wl : 0n)) / rn(e)), o6 = (t, e) => BigInt(t) * (e + jc);
function a6(t, e, n, r = lr) {
  const s = n ? wl : 0n, i = e > Ne + s ? e - Ne - s : 0n, o = Number(i / rn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * Oc,
    fees: BigInt(o) * r,
    reserve: Ne,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: jc,
    perCopy: e + jc,
    total: o6(t, e)
  };
}
const c6 = (t) => t >= ib && t <= md, hp = 40, l6 = "Create an Xtrata radio gift player", u6 = /^[^\u0000-\u001f\u007f<>]+$/u;
function pp(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && u6.test(t) : !n;
}
function f6(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!pp(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!pp(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > hp) throw new Error(`A player holds 1 to ${hp} songs.`);
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
const d6 = (t) => {
  const e = [...new Set(t.explicit ?? [])].sort((n, r) => n - r);
  return Ag(Cg(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null, ...e.length ? { explicit: e } : {} }))));
}, h6 = (t) => ({
  domain: ki({ name: qe(ob), version: qe("1"), "chain-id": Ar(1) }),
  message: ki({
    purpose: qe(l6),
    admin: qe(t.admin),
    player: qe(t.hash),
    issued: Ar(t.issued)
  })
}), Gr = (t) => t.tracks.filter((e) => !e.hidden), p6 = (t) => t.tracks.find((e) => e.hidden) ?? null, gp = [300, 500, 1e3], yp = 1800, ql = /* @__PURE__ */ new Map();
async function g6(t) {
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
function y6(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = ql.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      ql.set(t, { ...a, until: Date.now() + yp });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        ql.delete(t), s();
      }, yp + 50);
    }
  }, i;
}
const jr = (t, e, n, r, s) => y6(t, e, async () => await g6(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), Zs = "xtrata.radio.gift.incoming.v1", wp = (t) => "xtrata.radio.gift.mine.v1:" + t, bp = (t) => "xtrata.radio.gift.batches.v1:" + t, wt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, yr = (t, e, n = "") => {
  const r = wt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ja = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, zn = (t) => rr(t).replace(/\.?0+$/, "");
function w6(t) {
  let e = null;
  const n = (I) => [5e3, 1e4, 2e4, 3e4][I] ?? 6e4, r = (() => {
    try {
      const I = new URL(location.href), z = new URLSearchParams(I.hash.slice(1)).get("gift") ?? I.searchParams.get("gift");
      return z !== null && (I.searchParams.delete("gift"), history.replaceState(null, "", I.pathname + (I.search || ""))), dp(z) ? z : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const I = JSON.parse(t.store.get(Zs) || "null");
      return dp(I == null ? void 0 : I.code) ? I.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(Zs, JSON.stringify({ code: i, at: t.now() }));
    let I = 0;
    const z = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (m) => {
      const H = await m.json().catch(() => ({}));
      if (m.status === 404) {
        t.store.set(Zs, null), e = { ...e, error: (H == null ? void 0 : H.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!m.ok) throw new Error("busy");
      const ut = H;
      e = { ...e, view: ut, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(ut.status) && t.store.set(Zs, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void z(), n(I++)));
    });
    z();
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
    const z = `${location.origin}${location.pathname}#gift=${I}`;
    return [jr("gift-pass-on", "Copy the link to pass on", () => z, "primary", t.changed)];
  }, h = () => {
    e = null, t.store.set(Zs, null), t.changed();
  }, l = (I) => I.from ? t.who(I.from) : I.label ? `Xtrata Radio · ${I.label}` : "Xtrata Radio";
  let y = {};
  const g = (I) => {
    if (y.box) return y.box;
    const z = wt("div", "", "ppp-gift-check");
    y.box = z;
    const m = () => {
      const H = window.turnstile;
      !H || y.rendered || (y.rendered = !0, H.render(z, { sitekey: I, callback: (ut) => {
        y.token = ut, t.changed();
      }, "expired-callback": () => {
        y.token = void 0;
      } }));
    };
    if (window.turnstile) m();
    else {
      const H = document.createElement("script");
      H.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", H.async = !0, H.onload = m, document.head.append(H);
    }
    return z;
  }, S = (I) => {
    queueMicrotask(() => void I());
  };
  let v;
  async function T(I) {
    var H, ut, bt, qt, re, Kt, Vt, Yt, Fe;
    if (!e || e.claiming || !I.listening) return;
    const z = !!((H = e.view) != null && H.player);
    if (z && !I.root) return;
    e.claiming = !0, e.error = void 0, (ut = t.claiming) == null || ut.call(t, !0), t.changed();
    const m = async (pt) => {
      const xt = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: y.token, ...pt })
      });
      return { res: xt, r: await xt.json().catch(() => ({})) };
    };
    try {
      let pt = 0, xt = I.listening, Wt;
      if (z) {
        const ie = Number((bt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(I.root))) == null ? void 0 : bt.next);
        if (!Number.isSafeInteger(ie) || ie < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        pt = ie;
        for (let cn = 0; ; cn++) {
          const Qe = await t.album.bind(pt);
          if (xt = Qe.address, Wt = await m({ wallet: xt, binding: Qe }), Wt.res.status === 409 && /just taken/.test(((qt = Wt.r) == null ? void 0 : qt.error) || "") && cn < 5) {
            pt += 1;
            continue;
          }
          break;
        }
      } else Wt = await m({ wallet: xt });
      const { res: se, r: je } = Wt;
      if (se.status === 503 && /sending another gift/.test((je == null ? void 0 : je.error) || "")) {
        e.waiting = !0, (re = t.claiming) == null || re.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!se.ok) {
        const ie = String((je == null ? void 0 : je.error) || "");
        if (se.status === 404 || se.status === 410 || se.status === 409 && /already had a gift|brand-new|already have this album/.test(ie))
          throw t.store.set(Zs, null), new Error(ie || "This gift cannot be opened.");
        if (se.status === 429 || se.status === 403 || se.status === 400 && !/wallet number/i.test(ie)) throw new Error(ie || `Could not open the gift (${se.status}).`);
        const Qe = /topping up/.test(ie) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ie) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ie) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error(Qe), { retry: !0, slow: /topping up|not paid for yet/.test(ie) });
      }
      e.done = !0, t.store.set(Zs, null), z ? await t.album.arrived(pt, xt, je.txid, BigInt(je.amount)) : t.giftSent(je.txid, BigInt(je.amount));
    } catch (pt) {
      const xt = pt, Wt = xt.name === "TypeError" || xt.name === "AbortError" || xt.name === "TimeoutError" || /wallet number/i.test(xt.message);
      if (xt.retry || Wt) {
        const se = e.tries ?? 0;
        e.tries = se + 1, e.retry = { text: xt.retry ? xt.message : "Still sending your gift… the network is slow, trying again." }, (Kt = t.claiming) == null || Kt.call(t, !0), clearTimeout(v), v = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, xt.slow ? 6e4 : n(se));
      } else
        e.error = xt.message, (Vt = t.claiming) == null || Vt.call(t, !1);
      y.token = void 0;
      try {
        (Fe = (Yt = window.turnstile) == null ? void 0 : Yt.reset) == null || Fe.call(Yt, y.box);
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
      const m = I.listening;
      U = { ...(U == null ? void 0 : U.wallet) === m ? U : {}, wallet: m, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(m)).then((H) => {
        var ut, bt;
        (U == null ? void 0 : U.wallet) === m && (U.state = (ut = H == null ? void 0 : H.gift) == null ? void 0 : ut.state, U.problem = ((bt = H == null ? void 0 : H.gift) == null ? void 0 : bt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(U.state === "sending" && U.problem)) return [];
    const z = wt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return z.title = `Network reply: ${U.problem}`, [z];
  }
  function k(I, z, m = !1) {
    var Kt, Vt;
    const H = z.player, ut = BigInt(z.amount), bt = m ? [] : [wt("p", `🎁 ${l(z)} sent you “${H.title}”${H.subtitle ? ` by ${H.subtitle}` : ""}: ${Gr(H).length} ${Gr(H).length === 1 ? "song" : "songs"} and ${Fo(ut).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!I.root && ["fund", "ready", "over", "link"].includes(I.step))) {
      if (m) return bt;
      if (bt.push(wt("p", I.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : I.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), I.step === "intro") {
        const Yt = document.createElement("details");
        Yt.className = "ppp-how";
        const Fe = document.createElement("summary");
        Fe.textContent = "How does this work?", Yt.append(Fe, wt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), bt.push(Yt);
      }
      return bt;
    }
    if (I.walletCannotAlbums)
      return bt.push(wt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), bt;
    const re = (Vt = (Kt = I.gate) == null ? void 0 : Kt.gifts) == null ? void 0 : Vt.turnstileSiteKey;
    return re && !y.token ? bt.push(wt("p", "One quick check and it is yours:", "ppp-mute"), g(re)) : !e.claiming && !e.error && !e.waiting && !e.retry && S(() => T(I)), bt.push(...C(I, "Sending your album…")), bt;
  }
  function C(I, z) {
    const m = [];
    return e.claiming || e.waiting ? m.push(wt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : z, "ppp-cyan")) : e.retry && m.push(wt("p", e.retry.text, "ppp-warn"), yr("Try now", () => {
      clearTimeout(v), e.retry = void 0, T(I);
    }, "quiet")), e.error && /already have this album/i.test(e.error) ? m.push(wt("p", "You already have this album: it is in My albums. This copy is still free, so pass it on to a friend who would love it.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")) : e.error && m.push(wt("p", e.error, "ppp-bad"), yr("Try again", () => {
      e.error = void 0, T(I);
    })), m;
  }
  const P = (I) => {
    var z;
    return !!e && !e.done && !e.error && o() && !!I.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !I.linked && !I.creditedTo && (I.createdHere || I.brandNew || !!((z = e.view) != null && z.player)) && (I.balance ?? 0n) === 0n && !I.entries.length);
  };
  function X(I, z = {}) {
    var Fe, pt;
    const m = F(I);
    if (!e || ["off", "elsewhere"].includes(I.step)) return m;
    const H = e.view;
    if (e.error && !H) return [wt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!H) return [wt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return m;
    if (H.status === "claimed" || H.status === "claiming") return [wt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(H.status)) return [wt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (H.status === "pending-deposit") return [wt("p", `🎁 ${l(H)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (H.player) return [...k(I, H, !!z.bare), ...m];
    if (!!I.listening && (!(I.createdHere || I.brandNew) || !!I.linked || !!I.creditedTo || (I.balance ?? 0n) > 0n || I.entries.length > 0))
      return [wt("p", "🎁 You already have a player, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")];
    const bt = BigInt(H.amount), qt = Fo(bt).toLocaleString(), re = wt(
      "p",
      `🎁 ${l(H)} sent you ${zn(bt)} STX of on-chain music: about ${qt} paid plays.`,
      "ppp-gift"
    ), Kt = z.bare ? [] : [re], Vt = !!I.listening && (I.createdHere || I.brandNew) && !I.linked && !I.creditedTo && I.step === "fund" && (I.balance ?? 1n) === 0n && !I.depositPending && !I.entries.length, Yt = (pt = (Fe = I.gate) == null ? void 0 : Fe.gifts) == null ? void 0 : pt.turnstileSiteKey;
    return Vt ? (Yt && !y.token ? Kt.push(wt("p", "One quick check and it is yours:", "ppp-mute"), g(Yt)) : !e.claiming && !e.error && !e.waiting && !e.retry && S(() => T(I)), Kt.push(...C(I, "Sending your gift…"))) : I.step === "intro" ? z.bare || Kt.push(wt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : I.listening && I.linked ? Kt.push(wt("p", "You already have a player linked to your Stacks wallet, so this free one is for someone new. Know a friend who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")) : I.listening && (I.balance ?? 0n) > 0n && Kt.push(wt("p", "Your player already has plays, so this free one is for someone new. Know a friend or someone in your family who loves music? Pass it on and bring them in.", "ppp-mute"), ...u(), yr("Forget this gift link here", h, "quiet")), Kt;
  }
  async function it(I, z, m) {
    var H;
    try {
      const ut = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(I));
      if ((H = ut == null ? void 0 : ut.gift) != null && H.returnTo) return { ok: !0, funder: ut.gift.returnTo, txId: ut.gift.txid ?? void 0, amount: ut.gift.amount, distinct: 1 };
    } catch {
      if (m) return { ok: !1 };
    }
    return z();
  }
  const q = wt("div", "", "ppp-gift-fold");
  let W = 250000n, $ = "", _ = "";
  const x = (I) => {
    try {
      const z = JSON.parse(t.store.get(wp(I)) || "[]");
      return Array.isArray(z) ? z : [];
    } catch {
      return [];
    }
  }, M = (I, z) => t.store.set(wp(I), JSON.stringify(z.slice(0, 50)));
  async function K(I) {
    const z = x(I);
    for (const m of z)
      if (!(m.view && ["claimed", "refunded", "expired"].includes(m.view.status)))
        try {
          m.view = !m.view || m.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: m.id, ...m.txid ? { txid: m.txid } : {} }) }) : await t.json("/radio/gift?id=" + m.id), m.error = void 0;
        } catch (H) {
          m.error = H.message;
        }
    M(I, z), t.changed();
  }
  async function N(I) {
    if ($) return;
    $ = "Starting your gift…", _ = "", t.changed();
    let z = null;
    try {
      z = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: I, amount: W.toString() }) });
      const m = x(I);
      m.unshift({ id: z.id, code: z.code, amount: W.toString(), at: t.now() }), M(I, m), $ = "Approve the gift in your wallet…", t.changed();
      const H = await t.pay(I, z.depositTo, BigInt(z.deposit), z.memo), ut = x(I), bt = ut.find((qt) => qt.id === z.id);
      bt && (bt.txid = H, bt.view = { status: "pending-deposit", amount: W.toString(), source: "friend", from: I, label: "", expires: 0 }), M(I, ut), _ = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", K(I);
    } catch (m) {
      _ = m.message || "Not sent.";
    } finally {
      $ = "", t.changed();
    }
  }
  const nt = (I) => "xtrata.radio.gift.players.v1:" + I, Z = (I) => {
    try {
      const z = JSON.parse(t.store.get(nt(I)) || "[]");
      return Array.isArray(z) ? z.filter((m) => m && /^[0-9a-f]{16}$/.test(m.id)) : [];
    } catch {
      return [];
    }
  };
  async function kt(I, z) {
    var m;
    if (!$) {
      $ = "Checking the player…", _ = "", t.changed();
      try {
        const H = z.tracks.split(/[\s,]+/).filter(Boolean).map((Yt) => Number(Yt.replace(/^#/, ""))), ut = (z.explicit ?? "").split(/[\s,]+/).map((Yt) => Yt.replace(/^#/, "")).filter(Boolean).map(Number), bt = f6({ title: z.title.trim(), subtitle: z.subtitle.trim(), tracks: H, cover: (m = z.cover) != null && m.trim() ? Number(z.cover.trim().replace(/^#/, "")) : null, ...ut.length ? { explicit: ut } : {} });
        $ = "Sign in your wallet…", t.changed();
        const qt = { admin: I, hash: d6(bt), issued: t.now() }, re = await t.sign(I, h6(qt));
        $ = "Making the player…", t.changed();
        const Kt = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: bt, request: qt, signature: re }) }), Vt = Z(I).filter((Yt) => Yt.id !== Kt.id);
        Vt.unshift({ id: Kt.id, title: Kt.title, tracks: Kt.tracks }), t.store.set(nt(I), JSON.stringify(Vt.slice(0, 30))), _ = `${Kt.existing ? "That player already exists" : "Player made"} ✓ “${Kt.title}” · ${Kt.tracks} songs. Pick it below for a batch.`;
      } catch (H) {
        _ = H.message || "Not made.";
      } finally {
        $ = "", t.changed();
      }
    }
  }
  const L = (I, z) => t6(I || location.origin + "/radio.html", z), D = (I) => {
    try {
      const z = JSON.parse(t.store.get(bp(I)) || "[]");
      return Array.isArray(z) ? z.filter((m) => m && /^[0-9a-f]{16}$/.test(m.id) && Array.isArray(m.codes)) : [];
    } catch {
      return [];
    }
  }, lt = (I, z) => t.store.set(bp(I), JSON.stringify(z.slice(0, 20))), dt = (I) => !!I.view && I.view.status === "live" && I.view.copies.waiting + I.view.copies.claiming + I.view.copies.refunding === 0, at = (I, z) => t.json(I, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(z) });
  let It = 0;
  async function fe(I) {
    const z = D(I);
    for (const m of z)
      if (!dt(m))
        try {
          m.view = !m.view || m.view.status === "pending-deposit" ? await at("/radio/gift/batch/confirm", { id: m.id, ...m.txid ? { txid: m.txid } : {} }) : await t.json("/radio/gift/batch?id=" + m.id), m.error = void 0;
        } catch (H) {
          m.error = H.message;
        }
    try {
      const m = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(I));
      for (const H of (m == null ? void 0 : m.batches) ?? []) {
        const ut = z.find((bt) => bt.id === H.id);
        if (ut) {
          ut.error || (ut.view = H);
          continue;
        }
        z.push({ id: H.id, codes: [], count: H.count, amount: H.amount, label: H.label, player: H.player, depositTo: "", deposit: H.deposit, memo: H.memo, at: 0, view: H });
      }
    } catch {
    }
    lt(I, z), t.changed();
  }
  async function At(I, z) {
    const m = D(I).find((H) => H.id === z);
    if (!(!m || !m.depositTo || $)) {
      $ = "Approve the payment in your wallet…", _ = "", t.changed();
      try {
        const H = await t.pay(I, m.depositTo, BigInt(m.deposit), m.memo), ut = D(I), bt = ut.find((qt) => qt.id === z);
        bt && (bt.txid = H), lt(I, ut), _ = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", $ = "", fe(I);
      } catch (H) {
        _ = `${/cancel/i.test(H.message) ? "Payment cancelled." : H.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        $ = "", t.changed();
      }
    }
  }
  async function jt(I, z, m, H) {
    if ($) return;
    if (!z.ok) {
      _ = z.reason, t.changed();
      return;
    }
    $ = "Sign in your wallet…", _ = "", t.changed();
    let ut = null;
    try {
      const bt = { creator: I, count: z.count, amount: z.amount.toString(), label: m, issued: t.now(), ...H ? { player: H } : {} }, qt = await t.sign(I, r6(bt));
      $ = "Making your links…", t.changed(), ut = await at("/radio/gift/batch", { request: bt, signature: qt });
      const re = D(I);
      re.unshift({ id: ut.id, codes: ut.codes, count: z.count, amount: ut.amount, label: m, player: H ?? null, depositTo: ut.depositTo, deposit: ut.deposit, memo: ut.memo, at: t.now() }), lt(I, re);
    } catch (bt) {
      _ = bt.message || "Not made.", $ = "", t.changed();
      return;
    }
    $ = "", t.changed(), await At(I, ut.id);
  }
  function Lt() {
    const I = !!Jt.value, z = De.value === "max" ? i6(I) : Number(De.value), m = s6(z, I), H = Number(Ge.value);
    return !Number.isInteger(H) || H < 1 || H > Xl ? { ok: !1, reason: `Make 1 to ${Xl} copies at a time.`, album: I, plays: z, amount: m, count: H } : c6(m) ? { ok: !0, reason: "", album: I, plays: z, amount: m, count: H, bill: a6(H, m, I) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: I, plays: z, amount: m, count: H };
  }
  const de = () => {
    const I = Lt();
    if (!I.ok) return I.reason;
    const z = I.bill;
    return `Each copy: ${I.plays.toLocaleString()} paid plays (${zn(z.holders)} to song holders, ${zn(z.fees)} network fees)${I.album ? `, ${zn(z.float)} for the album’s likes` : ""}, ${zn(z.reserve)} kept so a listener can return what is left, + ${zn(z.sendFee)} to send it = ${zn(z.perCopy)} STX. ${I.count} copies = ${zn(z.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ht = (I, z) => z.codes.map((m) => L(I, m)), Ct = wt("input");
  Ct.type = "range", Ct.min = String(ib), Ct.max = String(md), Ct.step = "10000", Ct.value = String(W), Ct.setAttribute("aria-label", "Gift amount");
  const on = wt("p", "", "ppp-gift-amount"), vt = yr("", () => {
    const I = t.main();
    I && N(I);
  }, "primary"), wn = () => {
    on.textContent = On(), vt.textContent = `Gift ${zn(W)} STX`;
  };
  Ct.oninput = () => {
    W = BigInt(Ct.value), wn();
  };
  const On = () => `${zn(W)} STX · about ${Fo(W).toLocaleString()} paid plays · you pay ${zn(W + jc)} STX with the network fee`;
  wn();
  const ve = wt("input");
  ve.maxLength = 60, ve.placeholder = "Title, e.g. Proof of Sound", ve.setAttribute("aria-label", "Player title");
  const an = wt("input");
  an.maxLength = 80, an.placeholder = "Artist (optional)", an.setAttribute("aria-label", "Player subtitle");
  const Ue = wt("textarea");
  Ue.rows = 3, Ue.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ue.setAttribute("aria-label", "Songs");
  const Ze = wt("input");
  Ze.placeholder = "Explicit songs (optional): their numbers, e.g. 1022. Never played unless asked for, with a warning", Ze.setAttribute("aria-label", "Explicit songs");
  const Oe = wt("input");
  Oe.inputMode = "numeric", Oe.placeholder = "Cover inscription number (optional), shown when the album loads", Oe.setAttribute("aria-label", "Cover inscription");
  const Jt = wt("select");
  Jt.setAttribute("aria-label", "Batch album");
  const De = wt("select");
  De.setAttribute("aria-label", "Plays per copy");
  for (const I of [.../* @__PURE__ */ new Set([50, 100, 250, ...gp])].sort((z, m) => z - m)) De.append(Ja(`${I.toLocaleString()} plays`, String(I)));
  De.append(Ja("Max (1 STX)", "max")), De.value = String(gp[0]);
  const Ge = wt("input");
  Ge.type = "number", Ge.min = "1", Ge.max = String(Xl), Ge.value = "10", Ge.setAttribute("aria-label", "Copies");
  const He = wt("input");
  He.maxLength = 40, He.placeholder = "Label, e.g. Opera launch", He.setAttribute("aria-label", "Batch label");
  const me = wt("p", "", "ppp-mute"), te = () => {
    me.textContent = de();
  };
  for (const I of [Jt, De, Ge])
    I.oninput = te, I.onchange = te;
  te();
  function qn(I) {
    var ut, bt;
    const z = (ut = I.gate) == null ? void 0 : ut.gifts;
    if (!(z != null && z.enabled) || !z.admin || ["off", "elsewhere", "unsupported"].includes(I.step)) return null;
    const m = t.main(), H = [wt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!m)
      H.push(wt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (z.admin) {
      const qt = wt("div", "", "ppp-gift-admin"), re = (pt, xt) => {
        const Wt = wt("label", pt);
        return Wt.append(xt), Wt;
      }, Kt = Z(m);
      qt.append(
        wt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        ve,
        an,
        Ue,
        Oe,
        Ze,
        yr("Sign and make player", () => void kt(m, { title: ve.value, subtitle: an.value, tracks: Ue.value, cover: Oe.value, explicit: Ze.value }))
      );
      const Vt = yr("Sign, pay and make links", () => {
        jt(m, Lt(), He.value.trim(), Jt.value || void 0);
      });
      Vt.disabled = !!$;
      const Yt = Jt.value;
      Jt.replaceChildren(Ja("No album (starter copies)", ""), ...Kt.map((pt) => Ja(`${pt.title} · ${pt.tracks} songs`, pt.id))), Kt.some((pt) => pt.id === Yt) && (Jt.value = Yt), te(), qt.append(
        wt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        re("Album ", Jt),
        re("Plays each ", De),
        re("Copies ", Ge),
        He,
        me,
        Vt
      ), t.now() - It > 3e4 && (It = t.now(), fe(m));
      const Fe = D(m);
      if (Fe.length) {
        const pt = wt("ul", "", "ppp-gift-list");
        for (const xt of Fe.slice(0, 10)) {
          const Wt = xt.view, se = Wt == null ? void 0 : Wt.copies, je = xt.error ? xt.error : !Wt || Wt.status === "pending-deposit" ? xt.txid ? "payment confirming…" : "waiting for your payment" : `${se.claimed} of ${Wt.count} claimed${se.refunding + se.refunded ? ` · ${se.refunded} refunded${se.refunding ? `, ${se.refunding} on their way` : ""}` : ""}`, ie = wt("li");
          if (ie.append(wt("span", `${xt.label || "Batch"} · ${xt.count} × ${zn(BigInt(xt.amount))} STX`, "t"), wt("span", je, "ppp-mute")), !xt.txid && xt.depositTo && (!Wt || Wt.status === "pending-deposit") && ie.append(yr("Pay now", () => void At(m, xt.id), "tiny")), xt.codes.length && (Wt == null ? void 0 : Wt.status) === "live") {
            const cn = Ht(((bt = I.gate) == null ? void 0 : bt.radioUrl) ?? null, xt);
            ie.append(
              jr("batch-copy:" + xt.id, "Copy all links", () => cn.join(`
`), "tiny", t.changed),
              jr("batch-csv:" + xt.id, "Copy as CSV", () => ["copy,link", ...cn.map((Qe, Cr) => `${Cr + 1},${Qe}`)].join(`
`), "tiny", t.changed)
            );
          } else xt.codes.length || ie.append(wt("span", "links were made on another device", "ppp-mute"));
          pt.append(ie);
        }
        qt.append(pt);
      }
      H.push(qt);
    }
    return $ && H.push(wt("p", $, "ppp-cyan")), _ && H.push(wt("p", _, /✓/.test(_) ? "ppp-ok" : "ppp-warn")), q.replaceChildren(...H), q;
  }
  return { banner: X, funder: it, renderFold: qn, liveGift: o, incomingAlbum: a, incomingStarter: c, setAside: h, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: P };
}
const b6 = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function m6(t) {
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
const x6 = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function S6(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = x6(i);
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
function E6(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const of = /* @__PURE__ */ new Set(), ab = (t) => (of.add(t), () => {
  of.delete(t);
}), af = () => {
  for (const t of [...of])
    try {
      t();
    } catch {
    }
}, mp = "xtrata:al-thumb:v1:", cb = "-", jo = 96, A6 = 24 * 1024 * 1024, fn = /* @__PURE__ */ new Map(), xp = /* @__PURE__ */ new Set(), cf = [];
let Wl = !1, Zl;
const Rc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem(mp + t);
    window.localStorage.setItem(mp + t, e);
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
async function v6(t) {
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
    if (s > A6)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function k6() {
  if (!Wl) {
    Wl = !0;
    try {
      for (; cf.length; ) {
        const t = cf.shift();
        if (!fn.has(t))
          try {
            const e = await v6(t);
            if (e === null) continue;
            if (!e) {
              fn.set(t, ""), Rc(t, cb), af();
              continue;
            }
            const n = await xd(e);
            fn.set(t, n), n.startsWith("data:image/jpeg") && Rc(t, n), af();
          } catch {
          }
      }
    } finally {
      Wl = !1;
    }
  }
}
function lb(t, e) {
  if (e && !fn.get(t) ? (fn.set(t, e), xd(e).then((r) => {
    r !== e && (fn.set(t, r), r.startsWith("data:image/jpeg") && Rc(t, r), af());
  })) : e === "" && !fn.has(t) && fn.set(t, ""), fn.has(t)) return fn.get(t);
  const n = Rc(t);
  if (n != null) {
    const r = n === cb ? "" : n;
    return fn.set(t, r), r;
  }
  return xp.has(t) || (xp.add(t), cf.push(t), Zl || (Zl = setTimeout(() => {
    Zl = void 0, k6();
  }, 1200))), "";
}
const Yi = 12, $6 = 5e3, en = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Xi = (t, e, n = "") => {
  const r = en("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function I6(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, h = Yi;
  const l = en("div", "", "ppp-shelf-box");
  ab(() => t.changed());
  const y = (x) => "xtrata.radio.shelf.pins.v1:" + x, g = (x) => "xtrata.radio.shelf.recent.v1:" + x, S = (x, M) => {
    try {
      return JSON.parse(t.store.get(x) || "null") ?? M;
    } catch {
      return M;
    }
  }, v = (x) => new Set(S(y(x), []).filter((M) => Number.isSafeInteger(M))), T = (x) => {
    const M = S(g(x), {}), K = {};
    for (const [N, nt] of Object.entries(M)) Number.isSafeInteger(Number(N)) && typeof nt == "number" && (K[Number(N)] = nt);
    return K;
  };
  async function U(x) {
    if (!s) {
      s = !0, i = !1;
      try {
        const M = [];
        let K = 0, N = 0;
        for (let nt = 0; nt < $6 / 100 + 1; nt++) {
          const Z = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(x)}&after=${K}&limit=100`);
          if (M.push(...m6(Z == null ? void 0 : Z.shelf)), N = Number(Z == null ? void 0 : Z.total) || M.length, !(Z != null && Z.next) || !Number.isSafeInteger(Z.next)) break;
          K = Z.next;
        }
        x === e && (n = M, r = N, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const F = () => {
    o = -1 / 0;
  }, k = en("input");
  k.type = "search", k.placeholder = "Search title, artist or #", k.setAttribute("aria-label", "Search your albums"), k.oninput = () => {
    a = k.value, h = Yi, t.changed();
  };
  const C = en("select");
  C.setAttribute("aria-label", "Sort albums");
  for (const x of b6) {
    const M = document.createElement("option");
    M.value = x.value, M.textContent = x.label, C.append(M);
  }
  C.onchange = () => {
    c = C.value, h = Yi, t.changed();
  };
  const P = Xi("", () => {
    u = !u, h = Yi, t.changed();
  }, "tiny"), X = en("div", "", "ppp-shelf-tools");
  X.append(k, C, P);
  const it = en("div"), q = en("div");
  function W(x) {
    const M = x.step === "off" || x.step === "elsewhere" ? void 0 : x.root;
    if (M !== e && (e = M, n = [], r = 0, o = -1 / 0, h = Yi), !M || x.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && U(M), !n.length)
      return i ? (q.replaceChildren(en("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Xi("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(q), l) : null;
    const K = v(M), N = T(M), nt = S6(n, { query: a, sort: c, pinnedOnly: u, pins: K, recents: N });
    k.value !== a && (k.value = a), C.value = c, P.textContent = u ? "★ Pinned only" : "☆ Pinned only", P.setAttribute("aria-pressed", String(u));
    const Z = [];
    if (x.slot > 0 && Z.push(Xi("← My player", () => t.open(0), "quiet")), !nt.length) Z.push(en("p", "No album matches that.", "ppp-mute"));
    else {
      const kt = en("ul", "", "ppp-shelf-list");
      for (const L of nt.slice(0, h)) {
        const D = en("li", "", L.slot === x.slot ? "now" : ""), lt = K.has(L.slot), dt = Xi(lt ? "★" : "☆", () => {
          const Ct = new Set(K);
          lt ? Ct.delete(L.slot) : Ct.add(L.slot), t.store.set(y(M), JSON.stringify([...Ct])), t.changed();
        }, "tiny");
        dt.setAttribute("aria-label", lt ? `Unpin ${L.player.title}` : `Pin ${L.player.title}`);
        const at = [L.player.subtitle, `${Gr(L.player).length} ${Gr(L.player).length === 1 ? "song" : "songs"}`, L.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), It = L.slot === x.slot, fe = Xi(It ? "Playing" : "Select", () => {
          t.store.set(g(M), JSON.stringify(E6({ ...N, [L.slot]: t.now() }))), t.open(L.slot);
        }, It ? "tiny ppp-pick" : "tiny primary ppp-pick");
        fe.disabled = It;
        const At = Gr(L.player)[0], jt = L.player.cover ?? (At == null ? void 0 : At.id), Lt = jt ? lb(String(jt)) : "", de = en("span", "", "ppp-shelf-art");
        if (Lt) {
          const Ct = document.createElement("img");
          Ct.src = Lt, Ct.alt = "", Ct.decoding = "async", de.append(Ct);
        } else de.textContent = "💿";
        const Ht = en("span", "", "ppp-shelf-txt");
        Ht.append(en("span", L.player.title, "t"), en("span", at, "ppp-mute")), D.append(dt, de, Ht, fe), kt.append(D);
      }
      Z.push(kt), nt.length > h && Z.push(Xi(`Show more (${nt.length - h} left)`, () => {
        h += Yi, t.changed();
      }, "quiet"));
    }
    return i && Z.push(en("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), it.replaceChildren(...Z), l.firstChild !== X && l.replaceChildren(X, it), l;
  }
  return { render: W, invalidate: F, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const x = T(e), M = [...n].filter((K) => K.player).sort((K, N) => (x[N.slot] ?? 0) - (x[K.slot] ?? 0) || N.slot - K.slot)[0];
    return M ? { slot: M.slot, title: M.player.title } : null;
  } };
}
const L6 = 20, Xe = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, $e = {
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
const tn = (t, ...e) => Q("button", { type: "button", ...t }, ...e), tc = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Ro = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, C6 = { music: "My music", device: "This device", gifts: "Albums (admin)" }, T6 = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function Sp(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function h(x) {
    var K, N, nt;
    if (!x || !Number.isSafeInteger(x)) return "";
    const M = (nt = (N = (K = e.radio()) == null ? void 0 : K.getState) == null ? void 0 : N.call(K)) == null ? void 0 : nt.albumCover;
    return M != null && M.url && Number(M.tokenId) === x ? M.url : c.has(x) ? c.get(x) : (u.has(x) || (u.add(x), fetch("/inscription/" + x, { signal: AbortSignal.timeout(2e4) }).then(async (Z) => {
      var L, D, lt, dt;
      const kt = (Z.headers.get("content-type") || "").toLowerCase();
      if (!Z.ok)
        throw await ((L = Z.body) == null ? void 0 : L.cancel()), new Error("no cover");
      return kt.startsWith("image/") ? (await ((D = Z.body) == null ? void 0 : D.cancel()), "/inscription/" + x) : kt.includes("text/html") ? (((lt = (await Z.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : lt[1]) ?? "").replace(/&amp;/g, "&") : (await ((dt = Z.body) == null ? void 0 : dt.cancel()), "");
    }).then((Z) => {
      c.set(x, Z), _();
    }).catch(() => {
      u.delete(x);
    })), "");
  }
  ab(() => _());
  function l(x) {
    var K;
    i = x, x ? a.dataset.sheet = x : delete a.dataset.sheet;
    const M = document.querySelector(".side");
    if (x && x !== "more") {
      for (const Z of T6[x]) {
        const kt = M == null ? void 0 : M.querySelector(Z);
        kt && (kt.open = !0);
      }
      const N = document.getElementById("sheetTitle");
      N && (N.textContent = C6[x]);
      const nt = document.getElementById("sheetExtra");
      nt && nt.replaceChildren(...x === "music" ? [g()] : []), (K = M == null ? void 0 : M.scrollTo) == null || K.call(M, { top: 0 });
    }
    _();
  }
  const y = r ? null : document.getElementById("sheetClose");
  y && (y.onclick = () => l("")), r || document.addEventListener("keydown", (x) => {
    x.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const g = () => tn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: $e.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: $e.right })
  );
  let S = null, v = !1;
  const T = () => {
    var M;
    const x = e.radio();
    v || !(x != null && x.subscribe) || (v = !0, x.subscribe((K) => {
      S = K, (s == null ? void 0 : s.mode) === "open" && _();
    }), S = ((M = x.getState) == null ? void 0 : M.call(x)) ?? null);
  };
  r || setInterval(() => {
    var N, nt;
    if ((s == null ? void 0 : s.mode) !== "open" || !(S != null && S.playing)) return;
    const x = (nt = (N = e.radio()) == null ? void 0 : N.getPosition) == null ? void 0 : nt.call(N), M = t.querySelector(".al-bar > i"), K = t.querySelectorAll(".al-times span");
    !x || !M || (M.style.width = x.duration ? `${Math.min(100, x.current / x.duration * 100)}%` : "0%", K.length === 2 && (K[0].textContent = tc(x.current || 0), K[1].textContent = x.duration ? tc(x.duration) : "–:––"));
  }, 500);
  let U = "", F = null;
  function k(x, M, K = {}) {
    const N = K.song || h(x.cover), Z = [N ? Q("img", { src: N, alt: K.song ? "Song artwork" : `${x.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, x.title), x.subtitle ? Q("span", {}, x.subtitle) : null), K.paused ? Q("span", { class: "al-paused" }, Q("i", { html: $e.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], kt = "al-cover" + (M ? "" : " al-cover--small") + (K.paused ? " is-paused" : "");
    return K.flip ? (Z.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: $e.flip })), tn({ class: kt + " is-flippable", "aria-label": K.flipped ? "Show this song’s artwork" : `Show the ${x.title} cover`, onClick: K.flip }, ...Z)) : Q("div", { class: kt }, ...Z);
  }
  function C(x) {
    return x.plays === null || x.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, x.playsComing ? "Plays on their way…" : "…") : x.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, x.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (x.plays <= L6 ? " al-chip--low" : "") }, `${Ro(x.plays, "play", "plays")} left`);
  }
  function P(x) {
    const M = x.player, K = M.tracks.filter((nt) => !nt.hidden), N = [];
    return x.mode === "arrive" && x.from && N.push(Q("p", { class: "al-from" }, Q("span", { html: $e.gift }), Q("span", {}, Q("b", {}, x.from), " sent you an album"))), N.push(k(M, !0)), N.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, M.title),
      M.subtitle ? Q("p", { class: "al-artist" }, M.subtitle) : null,
      K.length ? Q("p", { class: "al-songline" }, K.map((nt) => nt.title || `#${nt.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Ro(K.length, "song", "songs"), x.offered ? Ro(x.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), x.status.length && N.push(Q("div", { class: "al-status", role: "status" }, ...x.status)), N.push(Q("div", { class: "al-grow" })), x.asking ? N.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : x.primary && N.push(tn({ class: "al-primary", onClick: x.primary.run, disabled: x.busy }, Q("span", { html: $e.playSmall }), x.primary.label)), x.hint && !x.asking && N.push(Q("p", { class: "al-hint" }, x.hint)), x.secondary && !x.asking && N.push(tn({ class: "al-link", onClick: x.secondary.run, disabled: x.busy }, x.secondary.label)), N;
  }
  function X(x, M) {
    const { songs: K, current: N, started: nt, own: Z, out: kt, waiting: L } = M, D = x.player, lt = e.radio(), dt = [];
    dt.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, D.title), ` · ${Ro(K.length, "song", "songs")}`), C(x)));
    const at = h(D.cover), It = "album:" + D.cover;
    at && !fn.has(It) && (fn.set(It, at), xd(at).then((At) => {
      At !== at && (fn.set(It, At), _());
    }));
    const fe = at ? fn.get(It) || at : "";
    return dt.push(Q("ol", { class: "al-tracks" }, ...K.map((At, jt) => {
      const Lt = String(At.id) === N, de = lb(String(At.id), Lt && nt ? Z : void 0);
      return Q("li", {}, tn(
        { class: "al-track" + (Lt ? " is-on" : ""), "aria-label": `Play ${At.title || "#" + At.id}`, "aria-current": Lt ? "true" : void 0, disabled: kt || L, onClick: () => {
          var Ht;
          return (Ht = lt == null ? void 0 : lt.playToken) == null ? void 0 : Ht.call(lt, At.id);
        } },
        Q(
          "span",
          { class: "al-th" + (de ? "" : " is-blank") },
          de ? Q("img", { src: de, alt: "", decoding: "async" }) : fe ? Q("img", { src: fe, alt: "", decoding: "async" }) : null,
          de ? null : Q("span", { class: "al-n" }, String(jt + 1)),
          Lt ? Q("span", { class: "al-eq", html: $e.eq }) : null
        ),
        Q("span", { class: "al-tt" }, At.title || `#${At.id}`, At.explicit ? Q("span", { class: "exp", title: "Explicit lyrics: only plays when you choose it" }, "E") : null)
      ));
    }))), dt;
  }
  function it(x) {
    var de;
    const M = x.player, K = M.tracks.filter((Ht) => !Ht.hidden), N = e.radio(), nt = S == null ? void 0 : S.nowPlaying, Z = nt && M.tracks.some((Ht) => String(Ht.id) === String(nt.tokenId)) ? String(nt.tokenId) : null, kt = Z ? M.tracks.find((Ht) => String(Ht.id) === Z) : null, L = x.plays === 0 && !x.playsComing, D = !!x.playsComing && !x.plays, lt = !!(S != null && S.playing) && !!Z, dt = S == null ? void 0 : S.heart, at = Z ? (de = N == null ? void 0 : N.getPosition) == null ? void 0 : de.call(N) : null;
    Z && (lt || ((at == null ? void 0 : at.current) ?? 0) > 0.5) && (U = M.id);
    const It = !!Z && U === M.id;
    F && F !== Z && (F = null);
    const fe = It ? String((nt == null ? void 0 : nt.cover) || "") : "", At = !!fe && F === Z, Lt = [k(M, !L, { song: At ? "" : fe, paused: It && !lt, flip: fe ? () => {
      F = F === Z ? null : Z, _();
    } : void 0, flipped: At })];
    if (Lt.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, kt ? kt.title || (nt == null ? void 0 : nt.title) || `#${kt.id}` : M.title),
        Q("div", { class: "al-artist" }, kt ? kt.artist || (nt == null ? void 0 : nt.artist) || M.subtitle : M.subtitle || "Press play")
      ),
      Z ? tn({ class: "al-icon" + (dt != null && dt.liked ? " is-on" : ""), "aria-label": dt != null && dt.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(dt != null && dt.liked)), disabled: !!(dt != null && dt.pending) || !!(dt != null && dt.locked) || D, onClick: () => {
        var Ht;
        return (Ht = N == null ? void 0 : N.toggleLike) == null ? void 0 : Ht.call(N);
      }, html: dt != null && dt.liked ? $e.heartOn : $e.heart }) : null
    )), L)
      Lt.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        q(x, !0)
      ));
    else {
      const Ht = at != null && at.duration ? Math.min(100, at.current / at.duration * 100) : 0;
      Lt.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Ht}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, tc((at == null ? void 0 : at.current) || 0)), Q("span", {}, at != null && at.duration ? tc(at.duration) : "–:––"))
      ));
    }
    return Lt.push(Q(
      "div",
      { class: "al-ctl" + (L || D ? " is-off" : "") },
      tn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = N == null ? void 0 : N.prev) == null ? void 0 : Ht.call(N);
      }, html: $e.prev }),
      tn({ class: "al-play", "aria-label": lt ? "Pause" : "Play", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = N == null ? void 0 : N.playPause) == null ? void 0 : Ht.call(N);
      }, html: lt ? $e.pause : $e.play }),
      tn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: L || D, onClick: () => {
        var Ht;
        return (Ht = N == null ? void 0 : N.next) == null ? void 0 : Ht.call(N);
      }, html: $e.next })
    )), x.status.length && Lt.push(Q("div", { class: "al-status", role: "status" }, ...x.status)), Lt.push(...X(x, { songs: K, current: Z, started: It, own: fe, out: L, waiting: D })), Lt.push(Q("div", { class: "al-grow" })), Lt.push(tn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: $e.down })
    )), Lt;
  }
  function q(x, M) {
    const K = Q("div", { class: "al-topups" + (M ? " al-topups--primary" : "") }), N = M ? [x.topUps[1] ?? x.topUps[0]] : [...x.topUps];
    for (const nt of N) {
      const Z = x.myPlays !== void 0 && x.myPlays >= nt && !x.playsComing && !x.busy;
      K.append(tn({ class: "al-topup", disabled: !Z, onClick: () => e.topUp(nt) }, M ? `Add ${nt.toLocaleString()} plays` : `+${nt.toLocaleString()}`));
    }
    return M && K.append(tn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), K;
  }
  function W(x) {
    const M = x.myPlays !== void 0 && x.myPlays >= (x.topUps[0] ?? 0), K = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${x.player.title}`), Q("span", { class: "al-mono" }, x.plays === null || x.plays === void 0 ? "" : `${x.plays.toLocaleString()} left`)),
      q(x, !1),
      Q("p", { class: "al-mute al-small" }, x.playsComing ? "Plays are on their way. Add more once they arrive." : x.myPlays === void 0 ? "Checking My player…" : M ? `Moved from My player · ${Ro(x.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !M && !x.playsComing && x.myPlays !== void 0 ? tn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), N = (Z, kt, L, D) => tn(
      { class: "al-row", onClick: D },
      Q("span", { class: "al-row-i", html: Z }),
      Q("span", { class: "al-row-t" }, Q("b", {}, kt), Q("small", {}, L)),
      Q("span", { class: "al-row-go", html: $e.right })
    ), nt = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      N($e.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, _();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), tn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: $e.close })),
      x.mode === "open" ? K : null,
      Q(
        "div",
        { class: "al-rows" },
        N($e.grid, "My music", "Your albums and the radio", () => l("music")),
        N($e.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        x.canMake ? N($e.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        N($e.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        nt
      )
    );
  }
  function $(x) {
    var L, D;
    const M = x.player, K = S == null ? void 0 : S.nowPlaying, N = K && M.tracks.some((lt) => String(lt.id) === String(K.tokenId)) ? String(K.tokenId) : null, nt = !!(S != null && S.playing) && !!N, Z = N ? (D = (L = e.radio()) == null ? void 0 : L.getPosition) == null ? void 0 : D.call(L) : null;
    N && (nt || ((Z == null ? void 0 : Z.current) ?? 0) > 0.5) && (U = M.id);
    const kt = !!N && U === M.id;
    return X(x, {
      songs: M.tracks.filter((lt) => !lt.hidden),
      current: N,
      started: kt,
      own: kt ? String((K == null ? void 0 : K.cover) || "") : "",
      out: x.plays === 0 && !x.playsComing,
      waiting: !!x.playsComing && !x.plays
    });
  }
  function _() {
    const x = s;
    if (r) {
      if (!x || x.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      T(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...$(x));
      return;
    }
    if (!x) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    T(), t.hidden = !1;
    const M = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      x.mode === "open" ? tn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: $e.grid }) : null
    ), K = Q("div", { class: "al-body al-body--" + x.mode }, ...x.mode === "open" ? it(x) : P(x));
    t.replaceChildren(M, K, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), W(x)] : []);
  }
  return {
    render(x) {
      if (r) {
        s = x, _();
        return;
      }
      const M = !!s;
      s = x, !x && (M || i) && (i = "", delete a.dataset.sheet), x ? a.dataset.view = "album" : delete a.dataset.view, x != null && x.asking ? a.dataset.asking = "1" : delete a.dataset.asking, _();
    },
    sheet: () => i,
    setSheet: l
  };
}
const B6 = [
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
function M6(t) {
  for (const [e, n] of B6) if (n.test(t)) return e;
  return null;
}
const ub = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), fb = (t) => /Android/.test(t);
function N6(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : ub(e) ? "x-safari-" + n.href : fb(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const P6 = (t) => ub(t) ? "Safari" : fb(t) ? "Chrome" : "your browser", qi = "Xtrata Music Wallet", _6 = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function Ep(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: qi, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && _6.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${qi} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: qi, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: qi, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: qi, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: qi, detail: "Open on this device." });
    }
  return r;
}
const Ql = "xtrata.radio.novice", db = "xtrata.radio.novice.previewed.v1", Ap = 6 * 6e4;
function U6(t, e) {
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
const O6 = /\b(?:STX|wallets?|address(?:es)?|seed(?: phrase)?|sign(?:s|ed|ing|ature|atures)?)\b/i, vp = (t) => O6.test(t ?? ""), H6 = {
  "Start listening · no wallet needed": "Start listening",
  "Claim my gift · no wallet needed": "Open my gift",
  "I already have a listening wallet": "I’ve listened here before",
  "Use a different listening wallet": "Use a different passkey"
}, D6 = {
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
}, F6 = (t, e) => D6[t] ?? e;
function j6(t, e) {
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
const R6 = "Make your player once, with Face ID or your fingerprint, and the music starts.", z6 = "Checking your player…", lf = () => ({ album: null, phase: "idle", track: null, since: 0, heard: 0 });
function hb(t) {
  try {
    const e = JSON.parse(t.get(db) || "[]");
    return Array.isArray(e) ? e.filter((n) => typeof n == "string").slice(-50) : [];
  } catch {
    return [];
  }
}
function G6(t, e) {
  const n = hb(t).filter((r) => r !== e);
  n.push(e), t.set(db, JSON.stringify(n.slice(-50)));
}
function Jl(t, e) {
  switch (e.kind) {
    case "offer":
      return t.album === e.album && t.phase !== "idle" ? t : { ...lf(), album: e.album, phase: e.already ? "done" : "open" };
    case "withdraw":
      return t.phase === "idle" ? t : lf();
    case "now":
      return t.phase === "open" && e.playing && e.track ? { ...t, phase: "playing", track: e.track, since: e.at } : t.phase === "playing" && e.track && e.track !== t.track ? { ...t, phase: "done" } : t.phase === "playing" && e.at - t.since > Ap ? { ...t, phase: "done" } : t;
    case "listened":
      return t.phase !== "playing" ? t : t.heard >= 1 ? { ...t, phase: "done" } : { ...t, heard: t.heard + 1 };
    case "tick":
      return t.phase === "playing" && e.at - t.since > Ap ? { ...t, phase: "done" } : t;
  }
}
const ec = (t) => t.phase === "open" || t.phase === "playing", Be = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, Qs = (t, e, n, r = !1) => {
  const s = Be("button", t, e);
  return s.type = "button", s.disabled = r, s.onclick = n, s;
}, pb = (t) => t.toLocaleString(), K6 = [
  ["It pays the artist", "Each play goes straight to whoever owns the song. Nobody in the middle."],
  ["It’s yours", "It lives on this device, opened by your face or fingerprint. No account, no password."],
  ["Likes build your playlist", "Tap ♥ on a song and it joins your own station, in your order, saved on a public record no company can take away."]
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
}, V6 = (t, e, n = !1) => n ? `${e || "Xtrata Music"} has loaded it with plays. Classic, Bronze, Silver, Gold or Diamond? Claim it to find out which one is yours.` : `${e || "Xtrata Music"} has covered ${t ? `${pb(t)} plays` : "your first plays"}. Play any song you like, and every play pays the artist.`, Y6 = (t) => t ? `Your player holds ${pb(t)} plays. Play anything: each one pays the artist you’re hearing.` : "Your player is ready. Play anything: each play pays the artist you’re hearing.", X6 = (t) => t ? `You got a ${t.name} player` : Dr.landed.title;
function q6(t, e = !0) {
  const n = Be("div", "tier-disc" + (e ? " tier-disc--big" : ""));
  return n.dataset.tier = t.id, n.setAttribute("role", "img"), n.setAttribute("aria-label", `${t.name} player`), n.append(Be("span", "tier-disc__mark", t.mark)), n;
}
function W6(t) {
  const e = document.documentElement;
  let n = !1;
  const r = () => {
    const s = Be("ul", "al-welcome-points");
    for (const [i, o] of K6) {
      const a = Be("li");
      a.append(Be("b", "", i), Be("span", "", o)), s.append(a);
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
      const o = Be("header", "al-top"), a = Be("a", "al-brand");
      a.href = "/radio", a.append("Xtrata ", Be("b", "", "Music")), o.append(a);
      const c = Be("div", "al-body al-body--welcome"), u = Be("div", "al-welcome"), h = s.mode;
      if (h === "checking")
        u.append(Be("p", "al-welcome-wait", Dr.checking));
      else {
        if (s.tier && (h === "landed" || h === "back" || h === "empty") && u.append(q6(s.tier)), u.append(Be("h1", "", h === "landed" ? X6(s.tier) : h === "back" && s.tier ? `Your ${s.tier.name} player` : Dr[h].title)), u.append(Be("p", "", h === "gift" ? V6(s.plays, s.from, s.mystery) : h === "landed" ? Y6(s.plays) : Dr[h].body)), (h === "landed" || h === "gift") && u.append(r()), s.status.length) {
          const y = Be("div", "al-status");
          y.setAttribute("role", "status"), y.append(...s.status), u.append(y);
        }
        if (s.asking) u.append(Be("p", "al-hint al-hint--ask", Dr.asking));
        else if (h === "gift" || h === "new" || h === "back") {
          const y = Dr[h];
          s.canStart && u.append(Qs("al-primary", y.primary, h === "back" ? s.unlock : s.start, s.busy), Be("p", "al-hint", y.hint)), s.canStart && u.append(Qs("al-link", y.returning, s.returning, s.busy)), u.append(Qs("al-link", y.full, s.full));
        } else if (h === "landed") {
          if (u.append(Qs("al-primary", Dr.landed.primary, s.full)), (l = s.albums) != null && l.length) {
            u.append(Be("p", "al-hint", "Or start with an album that comes with your player:"));
            for (const y of s.albums) {
              const g = Qs("al-album", "", y.run);
              g.append(Be("b", "", y.title), Be("span", "", y.by)), u.append(g);
            }
          }
        } else h === "empty" && u.append(Qs("al-primary", Dr.empty.primary, s.restock), Qs("al-link", Dr.empty.full, s.full));
      }
      c.append(u), t.hidden = !1, t.replaceChildren(o, c);
    }
  };
}
function Z6(t = {}) {
  return [
    { id: "stx", label: "STX", blurb: "Send STX straight to your player.", unit: "microSTX", settles: "direct", on: !0 },
    { id: "card", label: "Card", blurb: "Pay by card or Apple Pay.", unit: "pence", settles: "converted", on: t.card === !0 },
    { id: "sbtc", label: "Bitcoin", blurb: "Pay with sBTC.", unit: "sats", settles: "converted", on: t.sbtc === !0 }
  ];
}
const Q6 = [100, 250, 500, 1e3], J6 = (t, e = lr) => BigInt(t) * rn(e);
function tI(t, e = lr, n = 0n) {
  const r = Ns - t - n;
  return r > 0n ? Number(r / rn(e)) : 0;
}
function eI(t, e = lr, n = 0n) {
  const r = t === void 0 ? 0 : tI(t, e, n);
  return Q6.map((s) => ({ plays: s, stx: J6(s, e), fits: t !== void 0 && s <= r }));
}
const nI = {
  microSTX: (t) => `${t / 1000000n}.${(t % 1000000n).toString().padStart(6, "0").replace(/0+$/, "").padEnd(2, "0")} STX`,
  sats: (t) => `${t.toLocaleString("en-GB")} sats`,
  pence: (t) => `£${t / 100n}.${(t % 100n).toString().padStart(2, "0")}`
}, rI = (t) => nI[t.unit](t.amount), Se = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, fc = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`;
function sI(t) {
  if (!t || t.plays < 1) return "";
  const e = [`paid for ${fc(t.plays, "play", "plays")}${t.artists > 0 ? ` to ${fc(t.artists, "artist", "artists")}` : ""}`];
  return t.likes > 0 && e.push(`saved ${fc(t.likes, "like", "likes")}`), `So far your player has ${e.join(" and ")}, all on the public record.`;
}
function iI(t) {
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
    const a = eI(o.balance, o.fee, o.incoming);
    s(a);
    const c = Z6(o.switches);
    (g = c.find((S) => S.id === r)) != null && g.on || (r = "stx");
    const u = [], h = Se("h2", "ppp-connect__title", "Add plays");
    h.id = "ppp-restock-title", u.push(h), u.push(Se("p", "ppp-restock__left", o.playsLeft === null ? "Checking your player…" : o.playsLeft === 0 ? "Your player is out of plays." : `Your player has ${fc(o.playsLeft, "play", "plays")} left.`));
    const l = sI(o.done);
    if (l && u.push(Se("p", "ppp-restock__done", l)), o.arriving)
      u.push(Se("p", "ppp-restock__wait", "Plays are already on their way to your player. They start by themselves when they land, so there is nothing to add right now."));
    else if (o.balance === void 0)
      u.push(Se("p", "ppp-restock__wait", "Your player’s balance is unavailable right now, so nothing can be worked out. Try again in a moment."));
    else if (!a.some((S) => S.fits))
      u.push(Se("p", "ppp-restock__wait", "Your player is full: it holds as many plays as one player can. Come back when you have used some."));
    else {
      const S = Se("div", "ppp-restock__packs");
      S.setAttribute("role", "group"), S.setAttribute("aria-label", "How many plays");
      for (const U of a) {
        const F = Se("button", "ppp-restock__pack" + (U.plays === n ? " is-on" : ""));
        F.type = "button", F.disabled = !U.fits, F.setAttribute("aria-pressed", String(U.plays === n)), F.append(Se("b", "", U.plays.toLocaleString()), Se("span", "", "plays")), F.onclick = () => {
          n = U.plays, i();
        }, S.append(F);
      }
      u.push(S);
      const v = Se("div", "ppp-restock__ways");
      v.setAttribute("role", "group"), v.setAttribute("aria-label", "How to pay");
      for (const U of c) {
        const F = Se("button", "ppp-restock__way" + (U.id === r ? " is-on" : ""));
        F.type = "button", F.disabled = !U.on, F.setAttribute("aria-pressed", String(U.id === r)), F.append(Se("b", "", U.label), Se("span", "", U.on ? U.blurb : "Soon")), F.onclick = () => {
          r = U.id, i();
        }, v.append(F);
      }
      u.push(v);
      const T = a.find((U) => U.plays === n);
      if (T && r === "stx") {
        const U = Se("div", "ppp-restock__pay"), F = rI({ unit: "microSTX", amount: T.stx }), k = Se("p", "ppp-restock__amount");
        k.append("Send ", Se("b", "", F), " to your player:"), U.append(k, Se("p", "ppp-addr-full ppp-restock__addr", o.address));
        const C = Se("div", "ppp-restock__row");
        C.append(t.copyButton("restock-address", "Copy address", () => o.address, "primary"), t.copyButton("restock-amount", "Copy amount", () => rr(T.stx), "")), U.append(C), U.append(Se("p", "ppp-restock__note", "From any Stacks wallet or an exchange, on the Stacks network. A different amount is fine: your player holds up to 1 STX. The plays appear here by themselves, usually within a few minutes, so you can close this.")), u.push(U);
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
const Kr = (t) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(), oI = (t) => !t || /^(?:Inscription )?#\d+$/.test(t.trim());
function aI(t, e) {
  const n = /* @__PURE__ */ new Set(), r = [];
  for (const s of Array.isArray(t) ? t : []) {
    const i = Number(s == null ? void 0 : s.id);
    if (!Number.isSafeInteger(i) || i < 0 || n.has(i)) continue;
    n.add(i);
    const o = e(i, { title: typeof s.title == "string" ? s.title : void 0, artist: typeof s.artist == "string" ? s.artist : void 0 });
    r.push({ id: i, title: oI(o.title) ? `#${i}` : o.title.trim(), artist: (o.artist || "").trim() });
  }
  return r.sort((s, i) => s.id - i.id);
}
function cI(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    if (!n.artist) continue;
    const r = Kr(n.artist), s = e.get(r);
    s ? s.songs++ : e.set(r, { name: n.artist, songs: 1 });
  }
  return [...e.values()].sort((n, r) => r.songs - n.songs || n.name.localeCompare(r.name));
}
function lI(t, e, n = "", r = 60) {
  const s = Kr(e).split(/\s+/).filter(Boolean), i = Kr(n);
  if (!s.length && !i) return { songs: [], total: 0 };
  const o = [];
  for (const a of t) {
    const c = Kr(a.artist), u = Kr(a.title), h = String(a.id);
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
const Jn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.className = e), n && (r.textContent = n), r;
}, kp = 12;
function uI(t, e) {
  let n = null, r = "idle", s = "", i = "", o = !1;
  const a = Jn("input", "find-q");
  a.type = "search", a.placeholder = "Search songs, artists or #", a.setAttribute("aria-label", "Search all music"), a.autocomplete = "off";
  const c = Jn("div", "hint"), u = Jn("div", "find-artists"), h = Jn("ol", "likesList find-list");
  c.setAttribute("role", "status");
  const l = Jn("div", "likesTools");
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
      const C = Jn("button", "", "Try again");
      C.type = "button", C.onclick = () => {
        r = "idle", y();
      }, c.append(C), u.replaceChildren(), h.replaceChildren();
      return;
    }
    const v = cI(n), T = o ? v : v.slice(0, kp), U = (C, P, X, it = "") => {
      const q = Jn("button", "find-chip" + (P ? " is-on" : ""), C);
      return q.type = "button", q.setAttribute("aria-pressed", String(P)), it && (q.title = it), q.onclick = X, q;
    };
    u.replaceChildren(
      ...T.map((C) => U(`${C.name} · ${C.songs}`, Kr(C.name) === Kr(i), () => {
        i = Kr(C.name) === Kr(i) ? "" : C.name, g();
      }, `Show ${C.name}’s ${C.songs === 1 ? "song" : `${C.songs} songs`}`)),
      ...v.length > kp ? [U(o ? "Fewer artists" : `All ${v.length} artists`, !1, () => {
        o = !o, g();
      })] : []
    );
    const F = lI(n, s, i), k = e.current();
    h.replaceChildren(...F.songs.map((C) => {
      var it;
      const P = Jn("li", "lrow" + (C.id === k ? " now" : "")), X = Jn("button", "lt", C.title);
      if (X.type = "button", X.title = `Play “${C.title}”${C.artist ? ` by ${C.artist}` : ""}`, X.onclick = () => e.play(C.id), (it = e.explicit) != null && it.call(e, C.id)) {
        const q = Jn("span", "exp", "E");
        q.title = "Explicit lyrics: only plays when you choose it", X.append(" ", q);
      }
      return P.append(X, Jn("span", "find-by", `${C.artist ? C.artist + " · " : ""}#${C.id}`)), P;
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
], fI = (t) => typeof t == "string" && Qo.some((e) => e.id === t), dI = (t) => Qo.find((e) => e.id === t), hI = (t) => Qo.find((e) => t >= e.min) ?? Qo[Qo.length - 1];
function pI(t, e = lr) {
  return hI(t <= Ne ? 0 : Number((t - Ne) / rn(e)));
}
const $p = document.getElementById("ppp");
$p && gI($p);
function gI(t) {
  var Di;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = jb(), s = (f) => t.querySelector(f), i = s(".ppp-frame");
  let o = null;
  const a = async (f, b) => {
    const E = await fetch(f, { cache: "no-store", ...b, signal: AbortSignal.timeout(15e3) }), d = await E.json().catch(() => ({}));
    if (!E.ok) throw new Error((d == null ? void 0 : d.error) || `Request failed (${E.status}).`);
    return d;
  }, c = y5({
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
      const E = new Mb({ walletOrigin: f, frame: o, timeoutMs: 30 * 6e4 }), d = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), R = (p, A) => d.has(p) ? E.request(p, A) : Promise.race([
        E.request(p, A),
        new Promise((O, V) => setTimeout(() => V(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await R("listening.status"), { request: R };
    },
    chain: {
      verify: q$,
      balance: Z$,
      account: W$,
      owner: Q$,
      broadcast: J$,
      transaction: t5,
      confirmedNonce: async (f) => {
        const b = await Os(`/v2/accounts/${f}?proof=0`);
        if (!Number.isSafeInteger(b == null ? void 0 : b.nonce) || b.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(b.nonce);
      }
    },
    signWithMain: (f, b) => Q0({ ...b, network: "mainnet", stxAddress: f }),
    deposit: (f, b, E) => new Promise((d, R) => Y0({
      recipient: b,
      amount: E.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: f,
      network: new tu(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (p) => d(p.txId || ""),
      onCancel: () => R(new Error("Deposit cancelled. Nothing was sent.")),
      onError: R
    })),
    validate: e5,
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
    changed: () => he(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (f) => {
      var b, E;
      return u.funder(f, () => a5(f, Os), !!((E = (b = c.snapshot().gate) == null ? void 0 : b.gifts) != null && E.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (f) => {
      const b = await a("/radio/gift/for?wallet=" + encodeURIComponent(f)), E = b == null ? void 0 : b.gift;
      if (!E) return null;
      if (typeof E.returnTo != "string" || typeof E.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: E.returnTo, from: typeof E.from == "string" ? E.from : null, source: String(E.source ?? ""), amount: String(E.amount ?? "0"), treasury: E.treasury, state: E.state === "sending" ? "sending" : "arrived", player: E.player ?? null };
    },
    history: (f, b) => u5(f, (E) => Os(E), b),
    likesChanged: () => {
      var f, b;
      (b = (f = window.XtrataRadio) == null ? void 0 : f.refreshLikes) == null || b.call(f);
    },
    likeState: async (f, b) => {
      const E = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: f, ids: String(b) })), d = Array.isArray(E == null ? void 0 : E.rows) ? E.rows.find((R) => (R == null ? void 0 : R.id) === b) : null;
      if (!d || typeof d.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: d.liked, by: Array.isArray(d.by) ? d.by.filter((R) => typeof R == "string") : d.liked ? [f] : [] };
    },
    likeSent: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: f, liked: b } })),
    nameOf: (f) => Vt(f) ?? void 0,
    likeConfirmed: (f, b) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: f, liked: b } })),
    likeFailed: (f) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: f } }))
  }), u = w6({
    json: a,
    main: () => {
      const f = r.load();
      return f.isConnected && f.network === "mainnet" ? f.address : void 0;
    },
    pay: (f, b, E, d) => new Promise((R, p) => Y0({
      recipient: b,
      amount: E.toString(),
      memo: d,
      stxAddress: f,
      network: new tu(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: (A) => R(A.txId || ""),
      onCancel: () => p(new Error("Gift cancelled. Nothing was sent.")),
      onError: p
    })),
    sign: (f, b) => Q0({ ...b, network: "mainnet", stxAddress: f }),
    giftSent: (f, b) => c.giftSent(f, b),
    claiming: (f) => c.giftClaiming(f),
    album: { bind: (f) => c.bindAlbum(f), arrived: async (f, b, E, d) => {
      h.invalidate(), await c.albumArriving(f, b, E, d);
    } },
    who: (f) => pt(f),
    changed: () => he(c.snapshot()),
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
  }), h = I6({
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
    changed: () => he(c.snapshot())
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
  }, y = U6(location.search, l);
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
  }, U = v ? Sp(v, T) : null, F = "xtrata.radio.tier.v1";
  let k = (() => {
    const f = l.get(F);
    return fI(f) ? dI(f) : null;
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
      let R = null;
      try {
        R = f.gift && !f.gift.player ? pI(BigInt(f.gift.amount)) : null;
      } catch {
        R = null;
      }
      ((R == null ? void 0 : R.id) ?? null) !== ((k == null ? void 0 : k.id) ?? null) && (k = R, l.set(F, R ? R.id : null));
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
    d || (d = m("span", "", "ppp-tier"), E.append(d)), d.dataset.tier = k.id, d.textContent = `${k.mark} ${k.name.toUpperCase()} PLAYER`, d.title = `A ${k.name} player from the Xtrata Music giveaway`;
  }
  const X = y.on && v ? W6(v) : null, it = Date.now();
  let q = !1, W = null, $ = (() => {
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
    he(c.snapshot());
  }, x = (f, b) => {
    var R;
    if (!X || b || $) return null;
    if (!f.gate || f.step === "loading" || (q = !0), !q) return Date.now() - it < 1e4 ? "checking" : null;
    if (!g(f)) return null;
    if (f.step === "intro" || f.step === "unsupported") return u.incomingStarter() ? "gift" : "new";
    if (f.step === "locked") return "back";
    const d = f.slot === 0 && !((R = f.gift) != null && R.player) && !f.entries.some((p) => p.kind === "play");
    return f.step === "fund" && d ? f.depositPending ? "arriving" : "empty" : f.step === "ready" && d && (W === "arriving" || W === "landed") ? "landed" : f.step === "loading" && W !== "checking" ? W : null;
  };
  let M = !1;
  function K(f, b, E = [], d) {
    if (!X) return;
    const R = d !== void 0 ? d : x(f, b);
    if (W = R, delete document.documentElement.dataset.noviceBoot, !R) {
      X.render(null, b);
      return;
    }
    const p = [...E];
    R === "arriving" && f.arrival && p.push(Fn(f.arrival)), f.step === "unsupported" ? p.push(m("p", "This browser cannot make a player. Open this page in Safari or Chrome.", "ppp-warn")) : f.error && p.push(m("p", f.error, "ppp-warn"));
    const A = R === "gift" ? u.incomingStarter() : null;
    A && !M && f.step === "intro" && !f.busy && !f.armed && !f.error && !Yt && (M = !0, c.create()), X.render({
      mode: R,
      status: p,
      asking: !!f.busy || f.armed,
      busy: !!f.busy,
      canStart: (f.step === "intro" || f.step === "locked") && !Yt,
      plays: A ? A.plays : R === "landed" ? f.playsLeft : null,
      from: (A == null ? void 0 : A.from) ?? null,
      tier: k,
      mystery: C,
      albums: R === "landed" ? At.map((O) => ({ title: O.title, by: O.subtitle, run: () => {
        _(), on(O, !0);
      } })) : [],
      start: () => void c.create(),
      unlock: () => void c.unlock(),
      returning: () => void c.unlock(!0),
      restock: () => nt.open(),
      full: () => {
        var ht, G, tt;
        const O = window.XtrataRadio, V = R === "landed" && !((G = (ht = O == null ? void 0 : O.getState) == null ? void 0 : ht.call(O)) != null && G.playing);
        _(), V && ((tt = O == null ? void 0 : O.playPause) == null || tt.call(O));
      }
    });
  }
  X && setTimeout(() => {
    q || he(c.snapshot());
  }, 10100);
  const nt = iI({
    input: () => {
      var R, p, A, O;
      const f = c.snapshot();
      if (!["fund", "ready", "over"].includes(f.step)) return null;
      const b = f.slot === 0 ? { address: f.listening, balance: f.balance } : { address: f.root, balance: (R = f.likeFunds) == null ? void 0 : R.balance };
      if (!b.address) return null;
      const E = f.slot === 0 ? f.entries : [], d = E.filter((V) => V.kind === "play" && V.status === "confirmed");
      return {
        playsLeft: b.balance === void 0 ? null : qn(b.balance),
        balance: b.balance,
        incoming: 0n,
        fee: BigInt(((p = f.gate) == null ? void 0 : p.limits.playFee) ?? "300"),
        address: b.address,
        switches: ((A = f.gate) == null ? void 0 : A.restock) ?? {},
        done: d.length ? { plays: d.length, artists: new Set(d.map((V) => V.recipient)).size, likes: E.filter((V) => V.kind === "like" && V.status === "confirmed" && V.liked).length } : null,
        arriving: f.slot === 0 ? f.depositPending : !!((O = f.likeFunds) != null && O.pending)
      };
    },
    copyButton: (f, b, E, d) => jr(f, b, E, d, () => {
      he(c.snapshot());
    })
  }), Z = document.getElementById("albumList"), kt = Z ? Sp(Z, T, { list: !0 }) : null, L = "xtrata.radio.album.last.v1", D = () => {
    try {
      const f = JSON.parse(localStorage.getItem(L) || "null");
      return f && typeof f.root == "string" && Number.isSafeInteger(f.slot) && f.slot > 0 && f.player && Array.isArray(f.player.tracks) ? f : null;
    } catch {
      return null;
    }
  };
  let lt = "";
  const dt = (f) => {
    const b = JSON.stringify(f);
    if (b !== lt) {
      lt = b;
      try {
        localStorage.setItem(L, b);
      } catch {
      }
    }
  };
  let at = null;
  window.XtrataRadioLikeHandler = (f) => {
    var E;
    if (!f || !Number.isSafeInteger(f.song) || f.song < 0) return !1;
    (E = c.snapshot().likeFunds) != null && E.album && (De = !0), ie();
    const b = cn(f.song, { title: f.title, artist: f.artist });
    return c.heart({ song: f.song, title: b.title || void 0, artist: b.artist || void 0, likedBy: Array.isArray(f.likedBy) ? f.likedBy : void 0 });
  };
  let It;
  window.XtrataRadioListeningIdentity = () => {
    const f = c.snapshot();
    return f.solo && f.step !== "off" && f.step !== "elsewhere" ? f.listening : void 0;
  };
  const fe = (f) => {
    var E, d;
    const b = window.XtrataRadioListeningIdentity();
    b !== It && (It = b, (d = (E = window.XtrataRadio) == null ? void 0 : E.refreshLikes) == null || d.call(E));
  };
  let At = [], jt = 0, Lt = !1, de = null;
  const Ht = (f) => {
    var b, E;
    Lt || !((E = (b = f.gate) == null ? void 0 : b.gifts) != null && E.enabled) || Date.now() - jt < 6e4 || (jt = Date.now(), a("/radio/gift/featured").then((d) => {
      At = (Array.isArray(d == null ? void 0 : d.players) ? d.players : []).filter((R) => R && typeof R.id == "string" && typeof R.title == "string" && Array.isArray(R.tracks) && R.tracks.length > 0).slice(0, 6), Lt = !0, At.length && he(c.snapshot());
    }).catch(() => {
    }));
  }, Ct = (f) => {
    var b;
    return de && f.slot === 0 && !((b = f.gift) != null && b.player) && ["ready", "fund", "loading"].includes(f.step) ? de : null;
  }, on = (f, b = !1) => {
    var d, R;
    de = f, he(c.snapshot());
    const E = f && b ? Gr(f)[0] : null;
    E && ((R = (d = window.XtrataRadio) == null ? void 0 : d.playToken) == null || R.call(d, E.id));
  };
  let vt = lf(), wn = null;
  const On = (f) => {
    const b = y.preview && !Yt && f.step === "intro" ? u.incomingAlbum() : null;
    return b ? (vt = Jl(vt, { kind: "offer", album: b.player.id, already: hb(l).includes(b.player.id) }), ec(vt) ? b.player : null) : (vt = Jl(vt, { kind: "withdraw" }), null);
  }, ve = (f) => {
    const b = vt.phase;
    vt = Jl(vt, f), vt.phase !== b && (vt.album && (vt.phase === "playing" || vt.phase === "done") && G6(l, vt.album), he(c.snapshot()));
  };
  setInterval(() => {
    vt.phase === "playing" && ve({ kind: "tick", at: Date.now() });
  }, 5e3);
  let an = "", Ue, Ze = !1, Oe = !1;
  const Jt = (f, b) => {
    var tt, ft, et, Et, Zt, oe, ge, ke;
    const E = window.XtrataRadio;
    if (!(E != null && E.setGiftPlayer) || !(E != null && E.setGiftStop)) return;
    const d = b.depositPending && f.step === "fund" && ((tt = f.giftStop) == null ? void 0 : tt.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : f.giftStop, R = wn, p = d ? g(f) ? F6(d.reason, d.text) : d.text : null, A = R ? null : p ?? (e && (!((ft = f.gate) != null && ft.here) || f.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    A && A !== Ue && (E.setGiftStop(A), Ue = A);
    const O = f.step === "off" || f.step === "elsewhere" ? null : ((et = f.gift) == null ? void 0 : et.player) ?? R ?? Ct(f) ?? null, V = O ? O.id + ":" + O.cover + ":" + O.tracks.map((In) => In.id).join(",") : "";
    V !== an && (E.setGiftPlayer(O ? { id: O.id, title: O.title, subtitle: O.subtitle, tracks: Gr(O).map((In) => In.id), hidden: ((Et = p6(O)) == null ? void 0 : Et.id) ?? null, cover: O.cover } : null), an = V), A !== Ue && (E.setGiftStop(A), Ue = A);
    const ht = (d == null ? void 0 : d.reason) === "arriving";
    ht !== Oe && ((Zt = E.setGiftWait) == null || Zt.call(E, ht), Oe = ht);
    const G = !!O && (!!R || !!((oe = f.albumLock) != null && oe.locked));
    G !== Ze && ((ge = E.setGiftLock) == null || ge.call(E, G), Ze = G), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(f.step) && ((ke = E.forgetWallets) == null || ke.call(E));
  };
  let De = !1;
  const Ge = /* @__PURE__ */ new Map(), He = (f) => {
    if (!(f.step === "fund" && !f.depositPending && !!f.gift && !!f.listening && f.balance === 0n && !f.entries.some((d) => d.kind === "play") && (f.brandNew || f.createdHere))) return null;
    let E = Ge.get(f.listening);
    return E === void 0 && (E = Date.now(), Ge.set(f.listening, E)), Date.now() - E < Dc ? E : null;
  }, me = (f) => f.step === "fund" && !f.depositPending && !!f.gift && f.balance === 0n && !f.entries.some((b) => b.kind === "play") && !!f.listening && Ge.has(f.listening), te = (f) => f ? f.slice(0, 6) + "…" + f.slice(-4) : "", qn = (f) => {
    const b = c.snapshot().playCost || 350n;
    return f > Ne ? Number((f - Ne) / b) : 0;
  }, Wn = (f) => (Number(f) / 1e6).toFixed(f < 1000n ? 6 : 4), I = (f) => {
    const b = Math.round((Date.now() - f) / 6e4);
    return b < 1 ? "now" : b < 60 ? `${b}m` : b < 1440 ? `${Math.round(b / 60)}h` : `${Math.round(b / 1440)}d`;
  }, z = (f) => `https://explorer.hiro.so/txid/${f}?chain=mainnet`, m = (f, b = "", E = "") => {
    const d = document.createElement(f);
    return b && (d.textContent = b), E && (d.className = E), d;
  }, H = (f, b, E = "") => {
    const d = m("button", f, E);
    return d.type = "button", d.onclick = b, d;
  }, ut = (f, b) => {
    const E = m("a", f);
    return E.href = b, E.target = "_blank", E.rel = "noopener", E;
  };
  let bt = null, qt = location.hash === "#give";
  qt && history.replaceState(null, "", location.pathname + location.search);
  let re = !1;
  const Kt = J5((f) => Q5({ address: f, network: "mainnet" }), () => he(c.snapshot())), Vt = (f) => Kt.get(f), Yt = M6(navigator.userAgent), Fe = (f, b) => {
    const E = navigator.userAgent, d = P6(E), R = `${location.origin}${location.pathname}${b ? `#gift=${b}` : ""}`, p = [m("p", `You are in ${f}'s built-in browser, where passkeys often do not work. Open this page in ${d} to make your ${y.on ? "player" : "listening wallet"}${b ? y.on ? " and open your gift" : " and claim your gift" : ""}.`, "ppp-warn")], A = m("div", "", "ppp-open-row"), O = N6(R, E);
    if (O) {
      const V = m("a", `Open in ${d}`, "primary ppp-open-in");
      V.href = O, V.dataset.homeAction = "radio:open-in-browser", A.append(V);
    }
    return A.append(jr("copy-page-link", "Copy link", () => R, O ? "" : "primary", () => he(c.snapshot()))), p.push(A, m("p", `If that does not open ${d}, use ${f}'s menu (••• or ⋮) and choose "Open in ${d === "your browser" ? "browser" : d}", or paste the copied link there.`, "ppp-mute")), p;
  }, pt = (f) => Vt(f) ?? te(f), xt = (f) => f.slice(0, 2).map(pt).join(" and ") + (f.length > 2 ? ` and ${f.length - 2} more` : ""), Wt = /* @__PURE__ */ new Map();
  let se = !1;
  const je = (f) => !f || /^(?:Inscription )?#\d+$/.test(f.trim()), ie = () => {
    se || (se = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : null).then((f) => {
      for (const b of Array.isArray(f == null ? void 0 : f.tracks) ? f.tracks : []) {
        const E = Number(b == null ? void 0 : b.id);
        Number.isSafeInteger(E) && Wt.set(E, { title: typeof b.title == "string" ? b.title : void 0, artist: typeof b.artist == "string" ? b.artist : void 0 });
      }
      he(c.snapshot());
    }).catch(() => {
      se = !1;
    }));
  }, cn = (f, b) => {
    const E = Wt.get(f), d = fp(f, [E == null ? void 0 : E.title, b == null ? void 0 : b.title].find((p) => !je(p)) || ""), R = lp(f, (E == null ? void 0 : E.artist) || (b == null ? void 0 : b.artist) || "");
    return { title: d, artist: R };
  }, Qe = (f) => {
    const { title: b, artist: E } = cn(f.song, f);
    return b ? `“${b}”${E ? ` — ${E}` : ""}` : `Song #${f.song}${E ? ` — ${E}` : ""}`;
  }, Cr = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, Zn = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function An(f) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(f.step) ? ["", ""] : f.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : f.step === "over" ? ["TOO MUCH", "bad"] : f.step === "locked" ? ["LOCKED", "mute"] : f.step === "intro" || f.step === "link" ? ["", ""] : f.step === "fund" ? f.depositPending ? ["ON ITS WAY", "warn"] : f.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : f.payingOn && f.session && f.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function vn(f, b, E = "", d) {
    const R = m("dt", f), p = m("dd", b, E);
    return d && p.append(" ", d), [R, p];
  }
  const kn = document.getElementById("ppp-top"), Rt = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, Te = () => {
    var b;
    const f = window.XtrataRadioConnectStacks;
    f ? f() : (b = document.getElementById("radio-wallet-connect")) == null || b.click();
  }, ln = () => {
    var b, E;
    const f = c.snapshot();
    if (f.step === "connect" || f.step === "wrong-wallet") {
      Te();
      return;
    }
    if (f.step === "elsewhere" && ((b = f.gate) != null && b.radioUrl)) {
      location.href = f.gate.radioUrl;
      return;
    }
    if (f.step === "locked" && !f.armed && !f.busy && c.unlock(), f.step === "ready" && ((E = f.giftStop) == null ? void 0 : E.reason) === "off" && !f.busy && c.switchOn(), f.step === "fund" && f.solo && !f.depositPending && !f.busy) {
      nt.open();
      return;
    }
    Rt();
  };
  kn && (kn.onclick = ln);
  const Wr = (f, b, E, d = "") => f.standIn && !f.mainConnected ? H(`Connect ${pt(f.standIn)} to add STX`, Te, d) : H(b, E, d), js = (f) => {
    c.useLinked(f).then(() => Rt());
  };
  let un = null;
  const Tr = () => {
    const f = Ep(c.snapshot(), pt);
    return f.length ? un || (un = new Promise((b) => {
      var G;
      const E = m("dialog", "", "ppp-connect");
      E.setAttribute("aria-labelledby", "ppp-connect-title");
      let d = null;
      const R = (tt) => {
        d = tt, E.close();
      };
      E.addEventListener("close", () => {
        E.remove(), un = null, b(d);
      }), E.addEventListener("click", (tt) => {
        tt.target === E && R(null);
      });
      const p = (tt, ft, et, Et, Zt = !1) => {
        const oe = m("button", "", "ppp-connect__opt " + et);
        return oe.type = "button", oe.disabled = Zt, oe.onclick = Et, oe.append(m("b", tt), m("span", ft)), oe;
      }, A = m("h2", "Connect", "ppp-connect__title");
      A.id = "ppp-connect-title";
      const O = f.map((tt) => p(tt.label, tt.detail, "is-music", () => {
        if (R("music"), tt.action === "linked" && tt.main) {
          js(tt.main);
          return;
        }
        const ft = Ep(c.snapshot(), pt).find((et) => et.action !== "linked");
        (ft == null ? void 0 : ft.action) === "create" ? c.create() : (ft == null ? void 0 : ft.action) === "unlock" && c.unlock(), Rt();
      }, !!tt.disabled)), V = p("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => R("stacks")), ht = H("Cancel", () => R(null), "quiet ppp-connect__cancel");
      E.append(A, ...O, V, ht), document.body.appendChild(E), E.showModal(), (G = O.find((tt) => !tt.disabled)) == null || G.focus();
    }), un) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = Tr;
  function Hn(f) {
    if (!kn) return;
    const b = (d, R, p) => {
      kn.hidden = !1, kn.className = "ppp-top" + (R ? " is-" + R : ""), kn.replaceChildren(m("span", "", "dot"), document.createTextNode(d)), kn.title = p;
    }, E = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0;
    switch (f.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        kn.hidden = !0;
        return;
      case "elsewhere":
        return b("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        kn.hidden = !0;
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
  const xe = document.getElementById("pppNudge"), Br = document.getElementById("onair");
  (Di = xe == null ? void 0 : xe.querySelector("button")) == null || Di.addEventListener("click", () => ln());
  const Co = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, To = {
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
  function Bo(f) {
    if (f.step === "loading") return;
    const b = f.session ? Math.min(f.session.playsLeft, f.playsLeft) : 0, E = f.step === "ready" && f.payingOn && b > 0 && !f.giftStop, d = f.step === "fund" && f.depositPending, R = f.step === "elsewhere" && !e, p = E || d || R ? "" : Co[f.step] ?? "", A = E ? "on" : R ? "free" : p ? "off" : "";
    A ? document.documentElement.dataset.ppp = A : delete document.documentElement.dataset.ppp, Br && (Br.hidden = !A || A === "free", Br.querySelector(".onair-sub").textContent = E ? `${b.toLocaleString()} plays left` : "Plays off"), xe && (xe.hidden = A !== "off" && A !== "free", xe.classList.toggle("is-free", A === "free"), A === "free" ? (xe.querySelector(".nudge-t").textContent = "You’re on the free player", xe.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", xe.querySelector("button").textContent = "Get a player") : A === "off" && (xe.querySelector(".nudge-t").textContent = p, xe.querySelector(".nudge-s").textContent = g(f) ? f.step === "intro" ? R6 : "" : "This radio requires a funded listening wallet with music support on.", xe.querySelector("button").textContent = To[f.step] ?? "Start"));
  }
  let Rs = "";
  function Dn(f) {
    const b = m("div", "", "ppp-pick");
    f.funderMultiple && f.returnToKind === "funder" && b.append(m("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), f.returnToKind === "funder" && b.append(m("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const E = m("input");
    E.type = "text", E.placeholder = "SP… address to send returns to", E.autocomplete = "off", E.spellcheck = !1, E.setAttribute("aria-label", "Address to return funds to"), E.value = Rs, E.oninput = () => {
      Rs = E.value;
    };
    const d = H(f.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(E.value), Rs = "";
    }, "tiny");
    return b.append(E, " ", d), f.returnToKind === "chosen" && b.append(" ", H("Back to the funder", () => c.clearReturnAddress(), "tiny")), b;
  }
  const $n = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Mo() {
    const f = m("p", $n + " ", "ppp-mute");
    return f.append(ut("Xverse", "https://www.xverse.app/download"), " · ", ut("Leather", "https://leather.io/install-extension")), f;
  }
  let zs = "";
  const No = (f) => {
    const b = document.documentElement, E = f.solo && !f.main ? f.listening ? te(f.listening) : "new" : "", d = S5() ? "1" : "", R = f.standIn && !f.mainConnected ? pt(f.standIn) : "";
    `${E}|${d}|${R}` !== zs && (zs = `${E}|${d}|${R}`, E ? b.dataset.pppSolo = E : delete b.dataset.pppSolo, R ? b.dataset.pppAs = R : delete b.dataset.pppAs, d ? b.dataset.pppWalletInstalled = d : delete b.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const f of [1500, 4e3, 9e3]) setTimeout(() => he(c.snapshot()), f);
  function Zr(f, b = "") {
    const E = m("div", "", "ppp-topup"), d = Qr(f);
    E.append(m("span", "Add plays from My player: ", "ppp-mute"));
    for (const R of uc) {
      const p = H(`+${R.toLocaleString()}`, () => void c.topUpAlbum(R), b);
      p.disabled = d === void 0 || d < R || f.depositPending || !!f.busy, E.append(p);
    }
    return d !== void 0 && d < uc[0] && E.append(m("p", "My player needs plays first (switch to My player above).", "ppp-mute")), E;
  }
  const Qr = (f) => {
    var d;
    const b = (d = f.likeFunds) == null ? void 0 : d.balance;
    if (b === void 0 || !f.playCost) return;
    const E = b - Ne - 6000n;
    return E > 0n ? Number(E / f.playCost) : 0;
  };
  function Jr(f) {
    const b = f.likeFunds;
    if (!b || !b.album || !b.low && !b.pending) return [];
    if (b.low || (De = !1), b.low && !De) return [];
    const E = m("div", "", "ppp-pick ppp-lowbox");
    if (!b.low) {
      if (!b.txid) return [];
      const R = m("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return b.txid && R.append(ut("View", z(b.txid))), E.append(R), [E];
    }
    E.append(m("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), E.append(m("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), E.append(m("p", b.address, "ppp-addr-full"));
    const d = m("div", "", "ppp-open-row");
    if (d.append(jr("copy-likes-address", "Copy address", () => b.address, "primary", () => he(c.snapshot()))), b.main && !f.solo) {
      const R = Ns - (b.balance ?? 0n);
      R > 0n && d.append(Wr(f, `Pay ${rr(R)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return E.append(d), E.append(m("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [E];
  }
  const Fn = (f) => {
    const b = m("div", "", "ppp-wait");
    b.dataset.since = String(f.since), b.dataset.grace = String(f.graceMs), b.setAttribute("role", "progressbar"), b.setAttribute("aria-label", "Your plays are arriving");
    const E = m("p", "", "ppp-wait-t"), d = m("div", "", "ppp-wait-track");
    return d.append(m("div", "", "ppp-wait-fill")), b.append(E, d), Gs(b), b;
  };
  function Gs(f) {
    const b = Number(f.dataset.since), E = Number(f.dataset.grace) || 6e4, d = Math.max(0, Date.now() - b), R = f.querySelector(".ppp-wait-fill"), p = f.querySelector(".ppp-wait-t");
    if (d < E) {
      const A = Math.ceil((E - d) / 1e3);
      R.style.width = Math.max(4, Math.min(95, d / E * 100)).toFixed(0) + "%", p.textContent = `Your plays are arriving… usually about a minute · ${A}s`, f.classList.remove("is-long"), f.setAttribute("aria-valuenow", String(Math.round(d / E * 100)));
    } else
      R.style.width = "", p.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", f.classList.add("is-long"), f.removeAttribute("aria-valuenow");
  }
  let ur = 0;
  setInterval(() => {
    const f = document.querySelectorAll(".ppp-wait");
    if (!f.length) {
      ur = 0;
      return;
    }
    f.forEach(Gs), ++ur % 10 === 0 && he(c.snapshot());
  }, 1e3);
  let ts = null;
  function Ks(f) {
    if (f.step === "loading" && ts !== null) return;
    const E = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(f.step) || !!f.busy || f.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(f.step);
    E !== ts && (ts = E, E ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function he(f) {
    var vd, kd, $d, Id, Ld, Cd, Td, Bd, Md, Nd, Pd, _d, Ud, Od, Hd, Dd;
    if (at && ["ready", "fund", "over"].includes(f.step) && !f.busy) {
      const Y = at;
      at = null, f.root === Y.root && f.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const b = u.inProgress(f), E = He(f), d = b && f.step === "fund" ? { ...f, depositPending: !0 } : E !== null ? { ...f, depositPending: !0, arrival: { since: E, graceMs: Dc } } : f, R = d.error === Fc;
    if (fe(), Ht(f), P(f), wn = On(f), Jt(f, d), Ks(d), No(d), !b && u.inProgress(f)) return;
    if (Hn(d), Bo(d), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(d.step), n.textContent = d.step === "loading" || !d.gate ? y.on ? z6 : "Checking your listening wallet…" : y.on ? "Xtrata Music is unavailable here. Reload to check again." : "Paid radio is unavailable. Reload to check again."), t.hidden = d.step === "off", t.hidden) {
      K(d, !1);
      return;
    }
    const [p, A] = An(d), O = s(".ppp-state");
    O.textContent = p, O.className = "ppp-state" + (A ? " ppp-state--" + A : ""), O.hidden = !p;
    const V = !!d.busy || d.armed, ht = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(d.step) && (V || !["intro", "loading"].includes(d.step));
    i.hidden = !ht, i.classList.toggle("ppp-frame--rest", !V && !re);
    const G = s(".ppp-frame-label");
    G.hidden = !0;
    const tt = w5(d) ?? bt;
    bt = tt;
    const ft = "xtrata.radio.ppp.heard.v1", et = (() => {
      try {
        return localStorage.getItem(ft) === "1";
      } catch {
        return !1;
      }
    })();
    if (!et && d.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(ft, "1");
      } catch {
      }
    const Et = et || d.slot > 0 && ((((vd = d.likeFunds) == null ? void 0 : vd.balance) ?? 0n) > 0n || h.count() > 1), Zt = g(d), oe = !Zt && m5({ ...d, heard: Et }, tt);
    s(".ppp-badge").hidden = !oe;
    const ge = s(".ppp-steps"), ke = s(".ppp-stage");
    ge.hidden = ke.hidden = !oe, tt && oe && (ge.replaceChildren(...sf(d.solo).map((Y, rt) => {
      const St = m("li", "", rt < tt.at ? "done" : rt === tt.at ? tt.blocked ? "now blocked" : "now" : "");
      return St.append(m("span", rt < tt.at ? "✓" : String(rt + 1), "n"), Y), rt === tt.at && St.setAttribute("aria-current", "step"), St;
    })), ke.textContent = tt.caption, ke.className = "ppp-stage " + (tt.at >= sf(d.solo).length ? "ppp-ok" : tt.blocked ? "ppp-bad" : "ppp-cyan"));
    const In = s(".ppp-facts"), Ln = [];
    d.main && ((kd = d.gate) != null && kd.here) && !d.solo && Ln.push(...vn("Your wallet", pt(d.main), "ppp-addr-short"));
    const ma = () => {
      if (!d.listening) return;
      const Y = jr("copy-listening", "Copy", () => d.listening || "", "tiny", () => he(c.snapshot()));
      Ln.push(...vn(d.slot > 0 ? "Album wallet" : d.linked ? "My player (technical)" : "My player wallet", te(d.listening), "ppp-addr-short", Y));
    };
    if (d.linked || ma(), d.listening && d.step !== "intro")
      if (d.linked)
        Ln.push(...vn("Credited to", `${pt(d.linked)} · plays, likes and returns`, d.linked === d.main || d.solo ? "ppp-ok" : "ppp-warn")), ma();
      else if (d.solo) {
        d.creditedTo && Ln.push(...vn("Credited to", `${pt(d.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = d.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : d.returnTo ? `${pt(d.returnTo)} · ${d.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : d.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        Ln.push(...vn("Returns go to", d.gift ? Y : d.returnTo && !Vt(d.returnTo) ? Y.replace(te(d.returnTo), d.returnTo) : Y, d.returnTo && !d.gift ? "ppp-addr-full" : "ppp-mute"));
      } else Ln.push(...vn("Linked to", "not linked yet", "ppp-warn"));
    if (d.linkedListening.length && (($d = d.gate) != null && $d.here)) {
      const Y = d.linkedListening.map((rt) => te(rt) + (rt === d.listening ? " (this one)" : "")).join(", ");
      Ln.push(...vn(d.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step)) {
      const Y = d.step === "fund" && d.depositPending ? "ppp-mute" : d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      Ln.push(...vn("Balance", `${rr(d.balance)} STX · about ${d.playsLeft.toLocaleString()} plays`, Y));
    }
    const ns = d.entries.find((Y) => Y.kind === "play");
    ns && ie(), ns && Ln.push(...vn("Last paid song", `${Qe(ns)} → ${pt(ns.recipient)}`, Cr[ns.status] || "")), In.replaceChildren(...Ln), In.hidden = !Ln.length;
    const mt = [], zt = [], ae = [], Je = [], xa = rn(BigInt(((Id = d.gate) == null ? void 0 : Id.limits.playFee) ?? "300")), Sa = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${rr(Oc)} STX to the song holder, plus a ${rr(xa - Oc)} STX network fee.`, w = !!d.busy;
    switch (d.step) {
      case "elsewhere": {
        if (mt.push(m("p", "Pay artists as you listen.")), (Ld = d.gate) != null && Ld.radioUrl) {
          const rt = m("p");
          rt.append(ut("Open the pay-per-play radio →", d.gate.radioUrl)), mt.push(rt);
        }
        zt.push(m("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (d.linked) {
          const rt = [d.linked, ...d.others];
          mt.push(m("p", rt.length > 1 ? `This device has listening wallets for ${xt(rt)}.` : `This device has a listening wallet for ${pt(d.linked)}.`)), zt.push(m("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), rt.slice(0, 3).forEach((St, ee) => ae.push(H(`Open ${pt(St)}`, () => js(St), ee === 0 ? "primary" : "")));
        } else
          mt.push(m("p", "Connect your wallet to pay artists as you listen.")), zt.push(m("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        mt.push(m("p", `This device's listening wallet belongs to ${pt(d.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), zt.push(m("p", `You are connected as ${pt(d.main)}. Switch to the linked wallet to continue listening.`)), zt.push(m("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), ae.push(H("Switch wallet", Te, "primary"));
        break;
      case "not-invited":
        mt.push(m("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        mt.push(m("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        mt.push(m("p", "Every play counts for the song’s owner, on-chain.")), zt.push(m("p", Sa)), zt.push(m("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), zt.push(m("p", d.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !d.solo && d.main && d.others.length ? (mt.push(m("p", `This device already has a listening wallet for ${xt(d.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), zt.push(m("p", `Otherwise, set up a new listening wallet for ${pt(d.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !d.solo && d.main && zt.push(m("p", `This is the listening wallet for ${pt(d.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), d.solo && zt.push(m("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = u.liveGift();
        ae.push(H(Y ? "Claim my gift · no wallet needed" : d.solo ? "Start listening · no wallet needed" : d.others.length && d.main ? `Set up for ${pt(d.main)}` : "Start listening", () => void c.create(), "primary")), !Y && !d.solo && d.main && d.others.length && ae.push(H("Switch wallet", Te)), !Y && d.solo && ae.push(H("I have a Stacks wallet", Te)), ae.push(H("I already have a listening wallet", () => void c.unlock(!0))), Y && ae.push(H("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        d.armed || (mt.push(m("p", "Locked.", "ppp-mute")), ae.push(H("Unlock", () => void c.unlock(), "primary"))), d.standIn ? Je.push(H("Use a different listening wallet", () => void Tr().then((rt) => {
          rt === "stacks" && Te();
        }), "quiet")) : Je.push(H("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        mt.push(m("p", `Link to ${pt(d.main)} · free`)), zt.push(m("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), zt.push(m("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), ae.push(H(d.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        mt.push(m("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (d.depositPending ? d.arrival && mt.push(Fn(d.arrival)) : me(d) ? mt.push(m("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (Cd = d.gift) != null && Cd.player ? mt.push(m("p", "Out of plays · add more to keep listening", "ppp-bad")) : d.entries.length ? mt.push(m("p", "No plays left · add plays to keep counting", "ppp-bad")) : mt.push(m("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / xa)).toLocaleString()} plays`)), d.entries.length && zt.push(m("p", "Playback is paused until your top-up confirms.")), d.payingOn && !d.entries.length && zt.push(m("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), b ? zt.push(m("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : d.depositPending ? zt.push(m("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : d.solo ? (zt.push(m("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), zt.push(m("p", d.listening || "", "ppp-addr-full")), d.listening && !d.depositPending && ae.push(jr("copy-address", "Copy my address", () => d.listening || "", "primary", () => he(c.snapshot())))) : zt.push(m("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), d.depositPending && d.depositTxid) {
          const rt = m("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          rt.append(ut("View", z(d.depositTxid))), mt.push(rt);
        } else d.allowance > 0n && !d.solo && !d.depositPending && ae.push(Wr(d, `Deposit ${rr(d.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        mt.push(m("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), d.solo && !d.returnTo && (mt.push(m("p", d.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), mt.push(Dn(d))), (!d.solo || d.returnTo) && ae.push(H("Return excess", () => void c.returnFunds("excess"), "primary"), H("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (d.payingOn && d.session && d.session.playsLeft > 0 && ((Td = d.giftStop) == null ? void 0 : Td.reason) !== "off") {
          const rt = Math.min(d.session.playsLeft, d.playsLeft);
          mt.push(m("p", `${rt.toLocaleString()} plays left`, "ppp-ok")), zt.push(m("p", Sa + " The heart likes or unlikes from this wallet for 0.0002 STX.")), ae.push(H("Switch off", () => void c.switchOff()));
        } else
          mt.push(m("p", "Switch on music support to listen.", "ppp-mute")), ae.push(H("Switch plays on", () => void c.switchOn(), "primary"));
        d.queued && mt.push(m("p", d.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${d.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), d.balanceState === "low" && mt.push(m("p", "Running low on plays", "ppp-warn")), d.depositPending ? mt.push(m("p", "Plays on their way…", "ppp-warn")) : d.allowance > 0n && d.balanceState !== "ok" && !d.solo && ae.push(Wr(d, `Top up ${rr(d.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (d.solo && d.listening && !d.depositPending) {
      const Y = d.step === "fund", rt = d.step === "ready" && (d.balanceState === "low" || !!d.gift && d.giftPlays <= 20);
      Y ? ae.unshift(H("Add plays", () => nt.open(), "primary")) : rt ? ae.push(H("Add plays", () => nt.open(), "primary")) : d.step === "ready" && Je.push(H("Add plays", () => nt.open(), "quiet"));
    }
    if (d.solo && d.walletCannotSolo && zt.push(m("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), d.solo && ["fund", "ready"].includes(d.step) && ((d.balance ?? 0n) > 0n && d.slot === 0 && zt.push(Dn(d)), zt.push(Mo()), d.slot === 0 && d.step === "ready" && d.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = m("p", "New to Stacks? ", "ppp-mute");
      Y.append(ut("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), mt.push(Y);
    }
    if (d.walletOutdated && zt.push(m("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), d.stuck && (mt.push(m("p", d.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${d.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), ae.push(H("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(d.step) && (d.returnTo || d.gift) && (d.balance ?? 0n) > 0n && Je.push(H(d.linked ? "Return all to my wallet" : d.gift ? "Return what is left…" : `Return all to ${pt(d.returnTo)}`, () => void c.returnFunds("all"), "quiet")), d.slot > 0 && ((Bd = d.gift) != null && Bd.player) && ["ready", "fund"].includes(d.step) && d.giftPlays > 20 && Je.push(Zr(d, "quiet")), ["ready", "fund", "link", "over"].includes(d.step) && Je.push(H("Lock", () => void c.lock(), "quiet")), ht && !V && Je.push(H(re ? "Hide listening wallet box" : "Show listening wallet box", () => {
      re = !re, he(c.snapshot());
    }, "quiet")), [...ae, ...Je].forEach((Y) => Y.disabled = w), w && (ae.length = 0), !Zt && d.balance !== void 0 && ["fund", "ready", "over"].includes(d.step) && !(d.step === "fund" && d.depositPending && d.balance === 0n) && !((Md = d.gift) != null && Md.player)) {
      const Y = d.balanceState === "ok" ? "ppp-ok" : d.balanceState === "low" ? "ppp-warn" : "ppp-bad", rt = mt.at(0);
      d.step === "ready" && rt ? rt.append(m("span", ` · ${Wn(d.balance)} STX`, Y)) : mt.push(m("p", `Balance ${Wn(d.balance)} STX`, Y));
    }
    if (Zt) {
      for (const St of [...ae, ...Je]) {
        const ee = H6[St.textContent ?? ""];
        ee && (St.textContent = ee);
      }
      for (let St = mt.length - 1; St >= 0; St--) vp(mt[St].textContent) && zt.unshift(...mt.splice(St, 1));
      for (let St = ae.length - 1; St >= 0; St--) vp(ae[St].textContent) && Je.unshift(...ae.splice(St, 1));
      const Y = d.entries.some((St) => St.kind === "play"), rt = j6(d.step, { played: Y, arriving: d.depositPending });
      rt.length && mt.length && rt.shift(), mt.push(...rt.map((St) => m("p", St, "ppp-mute")));
    }
    if ((Nd = d.gift) != null && Nd.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(d.step)) {
      const Y = m("p", "", "ppp-gift");
      Y.append(`💿 Album · ${d.gift.player.title}`), d.gift.player.subtitle && Y.append(" · ", d.gift.player.subtitle);
      const rt = ["ready", "fund", "over"].includes(d.step) && d.balance !== void 0 ? d.giftPlays === 0 && d.depositPending ? m("span", " · plays on their way", "ppp-warn") : m("span", d.giftPlays === 0 ? " · no plays left" : ` · ${d.giftPlays.toLocaleString()} ${d.giftPlays === 1 ? "play" : "plays"} left`, d.giftPlays === 0 ? "ppp-bad" : d.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      rt && Y.append(rt);
      const St = (Pd = mt.at(0)) == null ? void 0 : Pd.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (d.step === "ready" && St && /STX/.test(St.textContent ?? "") && St.remove(), mt.unshift(Y), d.giftPlays <= 20 && ["ready", "fund"].includes(d.step) && !d.depositPending)
        if (d.slot > 0)
          mt.splice(1, 0, m("p", d.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), Zr(d, "primary"));
        else {
          const ee = m("p", d.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          ee.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), ee.append(ut("Xverse", "https://www.xverse.app/download"), " and ", ut("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), mt.splice(1, 0, ee);
        }
    }
    if (d.gift && !d.linked && ["fund", "ready", "over"].includes(d.step) && d.returnPlan.state === "ready") {
      const Y = d.returnPlan, rt = m("div", "", "ppp-pick");
      rt.append(m("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const St = m("ul", "", "ppp-gift-list");
      Y.steps.forEach((ee, ss) => {
        const is = ee.kind === "gift" ? "the unused gift" : ee.kind === "deposit" ? "what was added to it" : "the rest", mn = m("li");
        mn.append(m("span", `${ss + 1}. ${rr(BigInt(ee.send))} STX · ${is}`, "t"), m("span", ee.to ? ` → ${pt(ee.to)}` : " → choose an address below", ee.to ? "ppp-mute" : "ppp-warn")), St.append(mn);
      }), rt.append(St), Y.kept && rt.append(m("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((ee) => !ee.to) && rt.append(Dn(d)), rt.append(H(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), mt.push(rt);
    }
    const B = Vs(d), j = S ? B : null, ct = x(d, !!j), Re = ct === "gift" || ct === "arriving" || ct === "new", Ke = u.banner(f, { bare: !!j || ct === "gift" || ct === "arriving" }), bn = Yt && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(d.step)) ? Fe(Yt, u.pendingCode()) : [];
    j || (mt.unshift(...Ke), mt.push(...Jr(d)), mt.unshift(...bn)), d.solo && d.creditedTo && d.listening && !["intro", "off", "elsewhere", "loading"].includes(d.step) && mt.unshift(m("p", `This is ${pt(d.creditedTo)}'s listening wallet. Plays and likes count for ${pt(d.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...mt);
    const Ve = document.querySelector(".ppp-switch");
    if (Ve) {
      const Y = h.latest(), rt = d.slot > 0, St = ["fund", "ready", "over"].includes(d.step) && (rt || !!Y);
      if (Ve.hidden = !St, St) {
        const ee = (mn, Ea, Aa, ml) => {
          const Ri = H("", ml, "ppp-tab");
          return Ri.setAttribute("aria-pressed", String(Aa)), Ri.append(m("span", mn, "tt"), m("span", Ea === void 0 ? "…" : `${qn(Ea).toLocaleString()} plays`, "ts")), Ri.disabled = !!d.busy, Ri;
        }, ss = rt ? ((Ud = (_d = d.gift) == null ? void 0 : _d.player) == null ? void 0 : Ud.title) ?? "Album" : Y.title, is = H("View all albums" + (h.count() > 1 ? ` (${h.count()})` : ""), () => {
          const mn = document.querySelector(".ppp-shelf");
          mn && (mn.hidden = !1, mn.open = !mn.open, is.setAttribute("aria-expanded", String(mn.open)), mn.open && requestAnimationFrame(() => mn.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        is.setAttribute("aria-expanded", String(!!((Od = document.querySelector(".ppp-shelf")) != null && Od.open))), Ve.replaceChildren(
          ee("🎧 My player", rt ? (Hd = d.likeFunds) == null ? void 0 : Hd.balance : d.balance, !rt, () => {
            rt && c.openAlbum(0);
          }),
          ee("💿 " + ss, rt ? d.balance : void 0, rt, () => {
            !rt && Y && c.openAlbum(Y.slot);
          }),
          is
        );
      }
    }
    const Xs = h.render(d), Qn = document.querySelector(".ppp-shelf");
    if (Qn) {
      Qn.hidden = !Xs;
      const Y = Qn.querySelector("summary");
      Y && (Y.textContent = h.count() > 0 ? `♪ My albums (${h.count()})` : "♪ My albums");
      const rt = Qn.querySelector(".ppp-shelf-body");
      Xs && rt && !rt.contains(Xs) && rt.replaceChildren(Xs);
    }
    const rs = u.renderFold(f);
    if (s(".ppp-gifts").hidden = !rs, rs && !s(".ppp-gift-body").contains(rs) && s(".ppp-gift-body").replaceChildren(rs), rs && qt) {
      qt = !1;
      const Y = s(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    const Fi = document.querySelector("#ppp .ppp-featured");
    if (Fi) {
      const Y = At.length > 0 && d.slot === 0 && !((Dd = d.gift) != null && Dd.player) && d.step === "ready";
      Fi.hidden = !Y, Y && Fi.replaceChildren(m("p", "Albums in your player", "ppp-featured__h"), ...At.map((rt) => {
        const St = (de == null ? void 0 : de.id) === rt.id, ee = H("", () => on(St ? null : rt, !St), "ppp-featured__a" + (St ? " is-on" : "")), ss = Gr(rt).length;
        return ee.append(m("b", rt.title), m("span", St ? "Playing now · tap to go back to the radio" : `${rt.subtitle ? rt.subtitle + " · " : ""}${ss} ${ss === 1 ? "song" : "songs"}`)), ee.setAttribute("aria-pressed", String(St)), ee.disabled = !!d.busy, ee;
      }));
    }
    const ji = document.querySelector("#ppp .ppp-yours");
    if (ji) {
      const Y = d.solo && !!d.listening && d.slot === 0 && ["fund", "ready"].includes(d.step);
      ji.hidden = !Y;
      const rt = ji.querySelector(".ppp-yours-body");
      if (Y && rt && rt.getAttribute("data-for") !== d.listening) {
        rt.setAttribute("data-for", d.listening);
        const St = (ml, ...Ri) => {
          const Fd = m("details", "", "ppp-yours-item");
          return Fd.append(m("summary", ml), ...Ri), Fd;
        }, ee = m("p", "Your player is a real account on Stacks, the network built on Bitcoin that Xtrata runs on. Right now it is known by a long code. A ");
        ee.append(m("b", ".btc name"), " (for example yourname.btc) is a name you own on that network. Give your player one and your plays, likes and station show under that name everywhere on Xtrata.");
        const ss = m("p", "Names are registered at BNS One. You need a little STX and a Stacks wallet to buy one; then send the name to your player using the code below.", "ppp-mute"), is = m("p");
        is.append(ut("Find a name at BNS One →", "https://bns.one"));
        const mn = m("p", "Already have a Stacks wallet with a name (Xverse or Leather)? Connect it (top right) and link this player to it. The player stays on this device and keeps its plays; everything it does is then credited to your name, like a second device on one account."), Ea = m("p", "Know someone who loves music? When there is a giveaway on, send them the page and they can claim a free player of their own."), Aa = m("p");
        Aa.append(ut("See the giveaway →", "https://xtrata.xyz/giveaway")), rt.replaceChildren(
          St("Give your player a name", ee, ss, m("p", d.listening, "ppp-addr-full"), jr("copy-yours-address", "Copy my player’s code", () => c.snapshot().listening || "", "tiny", () => he(c.snapshot())), is),
          St("Link it to a wallet you already have", mn),
          St("Bring a friend in", Ea, Aa)
        );
      }
    }
    s(".ppp-body").replaceChildren(...zt), s(".ppp-actions").replaceChildren(...ae), s(".ppp-actions2").replaceChildren(...Je);
    const qs = d.busy || d.message || "", Ws = s(".ppp-msg"), bl = qs && mt.some((Y) => (Y.textContent ?? "").startsWith(qs.replace(/[.✓\s]+$/, ""))) ? "" : qs, Sd = !bl && !d.error ? d.notice : R && !bl ? d.error : "";
    Ws.textContent = bl || Sd, Ws.classList.toggle("is-warn", !!Sd), s(".ppp-err").textContent = R ? "" : d.error;
    const yb = d.entries.filter((Y) => Y.kind === "play");
    s(".ppp-recent").hidden = !d.entries.length, s(".ppp-recent-list").replaceChildren(...yb.slice(0, 5).map((Y) => {
      const rt = m("li"), St = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return rt.append(m("span", "", "d " + St), m("span", Qe(Y), "t"), m("span", I(Y.created), "ppp-mute")), Y.txid && rt.append(ut("tx", z(Y.txid))), rt;
    })), s(".ppp-wallets").hidden = !(In.childElementCount || Je.length), s(".ppp-more").hidden = !zt.length;
    const Ed = s(".ppp-history");
    Ed.hidden = !d.entries.length, d.entries.length && ie(), Ed.replaceChildren(m("summary", `All activity (${d.entries.length})`), ...d.entries.slice(0, 20).map((Y) => {
      const rt = m("div", "", "ppp-row"), St = Y.kind === "play" ? [m("span", Qe(Y), "ppp-song"), m("span", ` · ${rr(BigInt(Y.amount))} STX to ${pt(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [m("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${Qe(Y)}`, "ppp-song"), m("span", ` · for ${d.linked ? pt(d.linked) : "this listening wallet"}`, "ppp-mute")] : [m("span", `Returned ${rr(BigInt(Y.amount))} STX`, "ppp-song"), m("span", ` to ${pt(Y.recipient)}`, "ppp-mute")];
      return rt.append(
        m("span", Zn[Y.status] || Y.status, "ppp-status " + (Cr[Y.status] || "")),
        ...St,
        m("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && rt.append(ut("tx ↗", z(Y.txid))), rt;
    })), U == null || U.render(j ? Ys(d, j, [...bn, ...Ke]) : null), K(d, !!j, Re ? [...bn, ...Ke] : bn, ct), nt.isOpen() && nt.refresh(), Hi();
    const Ad = (B == null ? void 0 : B.mode) === "open" ? null : Ct(d);
    kt == null || kt.render((B == null ? void 0 : B.mode) === "open" ? Ys(d, B, []) : Ad ? { ...Ys(d, { mode: "open", player: Ad }, []), plays: d.balance === void 0 ? null : d.playsLeft } : null);
  }
  function Vs(f) {
    var d;
    if (["off", "elsewhere", "not-invited"].includes(f.step)) return null;
    if (f.slot > 0 && ((d = f.gift) != null && d.player) && ["fund", "ready", "over", "link", "loading"].includes(f.step))
      return f.root && dt({ root: f.root, slot: f.slot, player: f.gift.player }), { mode: "open", player: f.gift.player };
    const b = u.incomingAlbum();
    if (b) return { mode: "arrive", player: b.player, from: b.from, offered: b.plays };
    const E = D();
    return E && (f.step === "locked" || at && f.step === "loading") ? { mode: "locked", player: E.player } : null;
  }
  function Ys(f, b, E) {
    var V, ht, G, tt, ft;
    const d = !!f.busy || f.armed, R = [...E];
    f.depositPending && f.arrival && R.push(Fn(f.arrival)), f.error ? R.push(m("p", f.error, f.error === Fc ? "ppp-warn" : "ppp-bad")) : f.message && !d ? R.push(m("p", f.message, "ppp-cyan")) : f.notice && R.push(m("p", f.notice, "ppp-warn")), b.mode === "open" && De && ((V = f.likeFunds) != null && V.album) && f.likeFunds.low && !f.likeFunds.pending && R.push(m("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    let p = "Kept on this device with Face ID or your passkey. No app or account needed.", A = null, O = null;
    if (b.mode === "locked")
      A = { label: "Continue listening", run: () => {
        at = D(), c.unlock();
      } }, O = { label: "Use a different passkey", run: () => {
        at = null, c.unlock(!0);
      } };
    else if (b.mode === "arrive")
      if (f.step === "intro" && ec(vt) && vt.album === b.player.id) {
        const et = window.XtrataRadio, Et = Gr(b.player)[0], Zt = vt.phase === "playing";
        A = { label: Zt && !!((G = (ht = et == null ? void 0 : et.getState) == null ? void 0 : ht.call(et)) != null && G.playing) ? "Pause" : Zt ? "Carry on" : "Play the first song", run: () => {
          var ge, ke;
          Zt ? (ge = et == null ? void 0 : et.playPause) == null || ge.call(et) : Et && ((ke = et == null ? void 0 : et.playToken) == null || ke.call(et, Et.id));
        } }, O = { label: "Make my player and hear it all", run: () => void c.create() }, p = "The first song is free. Nothing to set up yet.";
      } else if (f.step === "intro") {
        const et = vt.phase === "done" && vt.album === b.player.id;
        et && !R.length && R.push(m("p", "That was the first song. Make your player to hear the rest: one tap with Face ID or your fingerprint.", "ppp-cyan")), A = { label: et ? "Keep listening" : "Open album", run: () => void c.create() }, O = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) };
      } else f.step === "locked" ? (A = { label: "Open album", run: () => void c.unlock() }, O = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : f.step === "unsupported" ? R.push(m("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : R.length || R.push(m("p", "Opening your album…", "ppp-cyan"));
    return {
      mode: b.mode,
      player: b.player,
      from: b.from,
      offered: b.offered,
      plays: b.mode === "open" ? f.balance === void 0 ? null : f.giftPlays : void 0,
      playsComing: f.depositPending,
      status: R,
      primary: A,
      secondary: O,
      hint: A ? p : void 0,
      asking: d,
      busy: !!f.busy,
      myPlays: Qr(f),
      topUps: uc,
      canMake: !!((ft = (tt = f.gate) == null ? void 0 : tt.gifts) != null && ft.admin)
    };
  }
  const jn = document.getElementById("findBox"), Mr = document.getElementById("findBody"), pe = jn && Mr ? uI(Mr, {
    load: () => fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((f) => f.ok ? f.json() : Promise.reject(new Error("catalogue unavailable"))).then((f) => aI(f == null ? void 0 : f.tracks, (b, E) => ({ title: fp(b, je(E.title) ? "" : E.title), artist: lp(b, E.artist || "") }))),
    play: (f) => {
      var b, E;
      (E = (b = window.XtrataRadio) == null ? void 0 : b.playToken) == null || E.call(b, f);
    },
    current: () => {
      var b, E, d, R;
      const f = Number((R = (d = (E = (b = window.XtrataRadio) == null ? void 0 : b.getState) == null ? void 0 : E.call(b)) == null ? void 0 : d.nowPlaying) == null ? void 0 : R.tokenId);
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
  jn == null || jn.addEventListener("toggle", () => {
    jn.open && (pe == null || pe.load());
  });
  let Oi = "";
  const Hi = () => {
    var b, E, d, R, p;
    if (!pe || !(jn != null && jn.open)) return;
    const f = `${!!((b = c.snapshot().albumLock) != null && b.locked)}|${((p = (R = (d = (E = window.XtrataRadio) == null ? void 0 : E.getState) == null ? void 0 : d.call(E)) == null ? void 0 : R.nowPlaying) == null ? void 0 : p.tokenId) ?? ""}`;
    f !== Oi && (Oi = f, pe.refresh());
  }, Nr = /* @__PURE__ */ new Map();
  let es = !1;
  const Pr = () => {
    const f = window.XtrataRadio;
    return f != null && f.subscribe ? (f.subscribe((b) => {
      const E = b == null ? void 0 : b.nowPlaying;
      if (E && Number.isSafeInteger(Number(E.tokenId)) && Nr.set(Number(E.tokenId), { title: E.title || void 0, artist: E.artist || void 0 }), Hi(), ec(vt)) {
        const d = !!(b != null && b.playing);
        ve({ kind: "now", track: E && E.tokenId != null ? String(E.tokenId) : null, playing: d, at: Date.now() }), d !== es && (es = d, he(c.snapshot()));
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
    if (ec(vt) && ve({ kind: "listened", at: Date.now() }), b && Number.isSafeInteger(b.song) && typeof b.id == "string" && /^[0-9a-f]{32}$/.test(b.id)) {
      ie();
      const E = cn(b.song, Nr.get(b.song));
      c.onListened({ song: b.song, id: b.id, title: E.title || void 0, artist: E.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const yI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", wI = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, bI = () => wI() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, mI = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, xI = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', gb = class {
  constructor(t) {
    u4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && TS(t), this.callback(nl(t));
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
    const t = bI(), e = mI(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return $t("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, $t("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), $t("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, $t("div", { class: "flex flex-col space-y-[10px]" }, $t("div", { class: "flex items-center" }, $t("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), $t("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, $t("span", { class: "sr-only" }, "Close popup"), $t("img", { src: yI }))), r ? $t("p", null, "Select the wallet you want to connect to.") : $t("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && $t("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && $t("div", { class: "mt-6" }, $t("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), $t("ul", { class: "space-y-3" }, this.installedProviders.map((i) => $t("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, $t("div", { class: "aspect-square basis-9 overflow-hidden" }, $t("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), $t("div", { class: "flex-1" }, $t("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && $t("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), $t("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && $t("div", { class: "mt-6" }, r ? $t("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : $t("div", { class: "mb-5 flex justify-between" }, $t("p", { class: "text-sm font-medium" }, "Recommended wallets"), $t("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, $t("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, $t("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), $t("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), $t("p", null, "What is a wallet? ", $t("span", { class: "align-text-bottom text-[9px]" }, "↗")))), $t("ul", { class: "space-y-3" }, n.map((i) => $t("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, $t("div", { class: "aspect-square basis-9 overflow-hidden" }, $t("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), $t("div", { class: "flex-1" }, $t("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && $t("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && $t("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return Kv(this);
  }
};
gb.style = xI;
const SI = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: gb
}, Symbol.toStringTag, { value: "Module" }));
