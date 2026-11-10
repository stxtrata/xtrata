var ww = Object.defineProperty;
var bw = (t, e, n) => e in t ? ww(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var go = (t, e, n) => bw(t, typeof e != "symbol" ? e + "" : e, n);
var pn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function B0(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function mc(t) {
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
        var P = {
          next: function() {
            var b = $.shift();
            return { done: b === void 0, value: b };
          }
        };
        return r.iterable && (P[Symbol.iterator] = function() {
          return P;
        }), P;
      }
      function f($) {
        this.map = {}, $ instanceof f ? $.forEach(function(P, b) {
          this.append(b, P);
        }, this) : Array.isArray($) ? $.forEach(function(P) {
          if (P.length != 2)
            throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + P.length);
          this.append(P[0], P[1]);
        }, this) : $ && Object.getOwnPropertyNames($).forEach(function(P) {
          this.append(P, $[P]);
        }, this);
      }
      f.prototype.append = function($, P) {
        $ = a($), P = c(P);
        var b = this.map[$];
        this.map[$] = b ? b + ", " + P : P;
      }, f.prototype.delete = function($) {
        delete this.map[a($)];
      }, f.prototype.get = function($) {
        return $ = a($), this.has($) ? this.map[$] : null;
      }, f.prototype.has = function($) {
        return this.map.hasOwnProperty(a($));
      }, f.prototype.set = function($, P) {
        this.map[a($)] = c(P);
      }, f.prototype.forEach = function($, P) {
        for (var b in this.map)
          this.map.hasOwnProperty(b) && $.call(P, this.map[b], b, this);
      }, f.prototype.keys = function() {
        var $ = [];
        return this.forEach(function(P, b) {
          $.push(b);
        }), u($);
      }, f.prototype.values = function() {
        var $ = [];
        return this.forEach(function(P) {
          $.push(P);
        }), u($);
      }, f.prototype.entries = function() {
        var $ = [];
        return this.forEach(function(P, b) {
          $.push([b, P]);
        }), u($);
      }, r.iterable && (f.prototype[Symbol.iterator] = f.prototype.entries);
      function l($) {
        if (!$._noBody) {
          if ($.bodyUsed)
            return Promise.reject(new TypeError("Already read"));
          $.bodyUsed = !0;
        }
      }
      function w($) {
        return new Promise(function(P, b) {
          $.onload = function() {
            P($.result);
          }, $.onerror = function() {
            b($.error);
          };
        });
      }
      function p($) {
        var P = new FileReader(), b = w(P);
        return P.readAsArrayBuffer($), b;
      }
      function m($) {
        var P = new FileReader(), b = w(P), C = /charset=([A-Za-z0-9_-]+)/.exec($.type), O = C ? C[1] : "utf-8";
        return P.readAsText($, O), b;
      }
      function S($) {
        for (var P = new Uint8Array($), b = new Array(P.length), C = 0; C < P.length; C++)
          b[C] = String.fromCharCode(P[C]);
        return b.join("");
      }
      function M($) {
        if ($.slice)
          return $.slice(0);
        var P = new Uint8Array($.byteLength);
        return P.set(new Uint8Array($)), P.buffer;
      }
      function R() {
        return this.bodyUsed = !1, this._initBody = function($) {
          this.bodyUsed = this.bodyUsed, this._bodyInit = $, $ ? typeof $ == "string" ? this._bodyText = $ : r.blob && Blob.prototype.isPrototypeOf($) ? this._bodyBlob = $ : r.formData && FormData.prototype.isPrototypeOf($) ? this._bodyFormData = $ : r.searchParams && URLSearchParams.prototype.isPrototypeOf($) ? this._bodyText = $.toString() : r.arrayBuffer && r.blob && s($) ? (this._bodyArrayBuffer = M($.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer])) : r.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf($) || o($)) ? this._bodyArrayBuffer = M($) : this._bodyText = $ = Object.prototype.toString.call($) : (this._noBody = !0, this._bodyText = ""), this.headers.get("content-type") || (typeof $ == "string" ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : r.searchParams && URLSearchParams.prototype.isPrototypeOf($) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
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
            return m(this._bodyBlob);
          if (this._bodyArrayBuffer)
            return Promise.resolve(S(this._bodyArrayBuffer));
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }, r.formData && (this.formData = function() {
          return this.text().then(N);
        }), this.json = function() {
          return this.text().then(JSON.parse);
        }, this;
      }
      var z = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      function E($) {
        var P = $.toUpperCase();
        return z.indexOf(P) > -1 ? P : $;
      }
      function _($, P) {
        if (!(this instanceof _))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        P = P || {};
        var b = P.body;
        if ($ instanceof _) {
          if ($.bodyUsed)
            throw new TypeError("Already read");
          this.url = $.url, this.credentials = $.credentials, P.headers || (this.headers = new f($.headers)), this.method = $.method, this.mode = $.mode, this.signal = $.signal, !b && $._bodyInit != null && (b = $._bodyInit, $.bodyUsed = !0);
        } else
          this.url = String($);
        if (this.credentials = P.credentials || this.credentials || "same-origin", (P.headers || !this.headers) && (this.headers = new f(P.headers)), this.method = E(P.method || this.method || "GET"), this.mode = P.mode || this.mode || null, this.signal = P.signal || this.signal || function() {
          if ("AbortController" in n) {
            var T = new AbortController();
            return T.signal;
          }
        }(), this.referrer = null, (this.method === "GET" || this.method === "HEAD") && b)
          throw new TypeError("Body not allowed for GET or HEAD requests");
        if (this._initBody(b), (this.method === "GET" || this.method === "HEAD") && (P.cache === "no-store" || P.cache === "no-cache")) {
          var C = /([?&])_=[^&]*/;
          if (C.test(this.url))
            this.url = this.url.replace(C, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
          else {
            var O = /\?/;
            this.url += (O.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
          }
        }
      }
      _.prototype.clone = function() {
        return new _(this, { body: this._bodyInit });
      };
      function N($) {
        var P = new FormData();
        return $.trim().split("&").forEach(function(b) {
          if (b) {
            var C = b.split("="), O = C.shift().replace(/\+/g, " "), T = C.join("=").replace(/\+/g, " ");
            P.append(decodeURIComponent(O), decodeURIComponent(T));
          }
        }), P;
      }
      function J($) {
        var P = new f(), b = $.replace(/\r?\n[\t ]+/g, " ");
        return b.split("\r").map(function(C) {
          return C.indexOf(`
`) === 0 ? C.substr(1, C.length) : C;
        }).forEach(function(C) {
          var O = C.split(":"), T = O.shift().trim();
          if (T) {
            var it = O.join(":").trim();
            try {
              P.append(T, it);
            } catch (W) {
              console.warn("Response " + W.message);
            }
          }
        }), P;
      }
      R.call(_.prototype);
      function et($, P) {
        if (!(this instanceof et))
          throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
        if (P || (P = {}), this.type = "default", this.status = P.status === void 0 ? 200 : P.status, this.status < 200 || this.status > 599)
          throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
        this.ok = this.status >= 200 && this.status < 300, this.statusText = P.statusText === void 0 ? "" : "" + P.statusText, this.headers = new f(P.headers), this.url = P.url || "", this._initBody($);
      }
      R.call(et.prototype), et.prototype.clone = function() {
        return new et(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new f(this.headers),
          url: this.url
        });
      }, et.error = function() {
        var $ = new et(null, { status: 200, statusText: "" });
        return $.ok = !1, $.status = 0, $.type = "error", $;
      };
      var G = [301, 302, 303, 307, 308];
      et.redirect = function($, P) {
        if (G.indexOf(P) === -1)
          throw new RangeError("Invalid status code");
        return new et(null, { status: P, headers: { location: $ } });
      }, e.DOMException = n.DOMException;
      try {
        new e.DOMException();
      } catch {
        e.DOMException = function(P, b) {
          this.message = P, this.name = b;
          var C = Error(P);
          this.stack = C.stack;
        }, e.DOMException.prototype = Object.create(Error.prototype), e.DOMException.prototype.constructor = e.DOMException;
      }
      function V($, P) {
        return new Promise(function(b, C) {
          var O = new _($, P);
          if (O.signal && O.signal.aborted)
            return C(new e.DOMException("Aborted", "AbortError"));
          var T = new XMLHttpRequest();
          function it() {
            T.abort();
          }
          T.onload = function() {
            var k = {
              statusText: T.statusText,
              headers: J(T.getAllResponseHeaders() || "")
            };
            O.url.indexOf("file://") === 0 && (T.status < 200 || T.status > 599) ? k.status = 200 : k.status = T.status, k.url = "responseURL" in T ? T.responseURL : k.headers.get("X-Request-URL");
            var U = "response" in T ? T.response : T.responseText;
            setTimeout(function() {
              b(new et(U, k));
            }, 0);
          }, T.onerror = function() {
            setTimeout(function() {
              C(new TypeError("Network request failed"));
            }, 0);
          }, T.ontimeout = function() {
            setTimeout(function() {
              C(new TypeError("Network request timed out"));
            }, 0);
          }, T.onabort = function() {
            setTimeout(function() {
              C(new e.DOMException("Aborted", "AbortError"));
            }, 0);
          };
          function W(k) {
            try {
              return k === "" && n.location.href ? n.location.href : k;
            } catch {
              return k;
            }
          }
          if (T.open(O.method, W(O.url), !0), O.credentials === "include" ? T.withCredentials = !0 : O.credentials === "omit" && (T.withCredentials = !1), "responseType" in T && (r.blob ? T.responseType = "blob" : r.arrayBuffer && (T.responseType = "arraybuffer")), P && typeof P.headers == "object" && !(P.headers instanceof f || n.Headers && P.headers instanceof n.Headers)) {
            var Et = [];
            Object.getOwnPropertyNames(P.headers).forEach(function(k) {
              Et.push(a(k)), T.setRequestHeader(k, c(P.headers[k]));
            }), O.headers.forEach(function(k, U) {
              Et.indexOf(U) === -1 && T.setRequestHeader(U, k);
            });
          } else
            O.headers.forEach(function(k, U) {
              T.setRequestHeader(U, k);
            });
          O.signal && (O.signal.addEventListener("abort", it), T.onreadystatechange = function() {
            T.readyState === 4 && O.signal.removeEventListener("abort", it);
          }), T.send(typeof O._bodyInit > "u" ? null : O._bodyInit);
        });
      }
      return V.polyfill = !0, n.fetch || (n.fetch = V, n.Headers = f, n.Request = _, n.Response = et), e.Headers = f, e.Request = _, e.Response = et, e.fetch = V, Object.defineProperty(e, "__esModule", { value: !0 }), e;
    })({});
  })(typeof self < "u" ? self : pn);
})();
const mw = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function xw(t, e) {
  const n = {};
  return Object.assign(n, mw, e), await fetch(t, n);
}
function Sw(t) {
  let e = xw, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Ew(...t) {
  const { fetchLib: e, middlewares: n } = Sw(t);
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
var Fi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Fi || (Fi = {}));
var Ws;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ws || (Ws = {}));
var Zf;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Zf || (Zf = {}));
const Aw = "https://api.mainnet.hiro.so", vw = "https://api.testnet.hiro.so", kw = "http://localhost:3999", $w = ["mainnet", "testnet", "devnet", "mocknet"];
let ji = class {
  constructor(e) {
    this.version = Ws.Mainnet, this.chainId = Fi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === Ws.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Ew();
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
ji.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Il();
    case "testnet":
      return new Iw();
    case "devnet":
      return new Lw();
    case "mocknet":
      return new M0();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${$w.join(", ")}`);
  }
};
ji.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ji.fromName(t);
let Il = class extends ji {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Aw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ws.Mainnet, this.chainId = Fi.Mainnet;
  }
}, Iw = class extends ji {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? vw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Fi.Testnet;
  }
}, M0 = class extends ji {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? kw,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = Ws.Testnet, this.chainId = Fi.Testnet;
  }
};
const Lw = M0, N0 = "xtrata.wallet.bridge.v1", Cw = (t) => typeof t == "object" && t !== null && t.protocol === N0, Tw = (t) => Cw(t) && t.kind === "response" && typeof t.id == "string" && t.id.length > 0 && typeof t.ok == "boolean", Bw = () => {
  const t = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
};
class yo extends Error {
  constructor(e, n) {
    super(n), this.code = e, this.name = "BridgeClientError";
  }
}
const Qf = 12e4;
class Mw {
  constructor(e) {
    go(this, "pending", /* @__PURE__ */ new Map());
    go(this, "listenTarget");
    go(this, "closed", !1);
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
    go(this, "onMessage", (e) => {
      if (e.origin !== this.options.walletOrigin || e.source !== this.options.frame.contentWindow || !Tw(e.data)) return;
      const n = this.pending.get(e.data.id);
      if (n)
        if (this.pending.delete(e.data.id), clearTimeout(n.timer), e.data.ok)
          n.resolve(e.data.result);
        else {
          const r = e.data.error;
          n.reject(
            new yo("WALLET_ERROR", (r == null ? void 0 : r.message) ?? "The wallet rejected the request.")
          );
        }
    });
    this.options = e, this.listenTarget = e.listenTarget ?? window, this.listenTarget.addEventListener("message", this.onMessage);
  }
  /** Send a request and await its reply. */
  request(e, n) {
    if (this.closed)
      return Promise.reject(new yo("CLOSED", "Bridge client is closed."));
    const r = this.options.frame.contentWindow;
    if (!r)
      return Promise.reject(
        new yo("NO_FRAME", "Wallet iframe has no content window (not loaded?).")
      );
    const s = Bw(), i = { protocol: N0, kind: "request", id: s, method: e, params: n };
    return new Promise((o, a) => {
      const c = setTimeout(() => {
        this.pending.delete(s), a(
          new yo(
            "TIMEOUT",
            `Wallet did not answer "${e}" within ${this.options.timeoutMs ?? Qf}ms.`
          )
        );
      }, this.options.timeoutMs ?? Qf);
      this.pending.set(s, { resolve: o, reject: a, timer: c }), r.postMessage(i, this.options.walletOrigin);
    });
  }
  /** Drop the listener and fail everything outstanding. */
  close() {
    this.closed = !0, this.listenTarget.removeEventListener("message", this.onMessage);
    for (const [, e] of this.pending)
      clearTimeout(e.timer), e.reject(new yo("CLOSED", "Bridge client closed before the reply arrived."));
    this.pending.clear();
  }
  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount() {
    return this.pending.size;
  }
}
const Nw = ["SP", "SM"], Pw = ["ST", "SN"], _w = (t) => {
  const [e] = t.split(".");
  if (!e || e.length < 2)
    return null;
  const n = e.slice(0, 2).toUpperCase();
  return Nw.includes(n) ? "mainnet" : Pw.includes(n) ? "testnet" : null;
}, Uw = () => {
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
}, Hw = () => typeof window > "u" || !window.localStorage ? Uw() : window.localStorage, Xc = "xtrata.v15.1.wallet.session", Jf = "mainnet", za = { isConnected: !1 }, Ow = (t) => t.address ? _w(t.address) ?? t.network : t.network, P0 = (t) => !t.isConnected || !t.address ? { ...za } : Ow(t) !== Jf ? { ...za } : {
  isConnected: !0,
  address: t.address,
  network: Jf,
  ...typeof t.publicKey == "string" && /^[0-9a-f]{66}$/i.test(t.publicKey) ? { publicKey: t.publicKey } : {}
}, Dw = (t) => {
  if (!t)
    return { ...za };
  try {
    const e = JSON.parse(t);
    return P0(e);
  } catch {
    return { ...za };
  }
}, Fw = (t) => {
  const e = P0(t);
  return JSON.stringify(e);
}, jw = (t) => {
  const e = Hw();
  return {
    load: () => Dw(e.getItem(Xc)),
    save: (n) => {
      e.setItem(Xc, Fw(n));
    },
    clear: () => {
      e.removeItem(Xc);
    }
  };
}, zw = "https://browser.blockstack.org/auth", Rw = {
  "@type": "Person",
  "@context": "http://schema.org"
}, _0 = ["store_write"], Gw = "blockstack-session", Kw = {
  logLevel: "debug"
}, fi = {
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
Object.freeze(fi);
class so extends Error {
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
class Vw extends so {
  constructor(e, n = "") {
    super({ code: fi.MISSING_PARAMETER, message: n, parameter: e }), this.name = "MissingParametersError";
  }
}
class td extends so {
  constructor(e = "") {
    super({ code: fi.INVALID_DID_ERROR, message: e }), this.name = "InvalidDIDError";
  }
}
class ea extends so {
  constructor(e) {
    const n = `Failed to login: ${e}`;
    super({ code: fi.LOGIN_FAILED_ERROR, message: n }), this.message = n, this.name = "LoginFailedError";
  }
}
class ed extends so {
  constructor(e = "Unable to decrypt cipher object.") {
    super({ code: fi.FAILED_DECRYPTION_ERROR, message: e }), this.message = e, this.name = "FailedDecryptionError";
  }
}
class Ll extends so {
  constructor(e) {
    super({ code: fi.INVALID_STATE, message: e }), this.message = e, this.name = "InvalidStateError";
  }
}
class U0 extends so {
  constructor(e) {
    super({ code: fi.INVALID_STATE, message: e }), this.message = e, this.name = "NoSessionDataError";
  }
}
const nd = ["debug", "info", "warn", "error", "none"], Cl = {};
for (let t = 0; t < nd.length; t++) {
  const e = nd[t];
  Cl[e] = t;
}
class Bi {
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
    return Cl[Kw.logLevel] <= Cl[e];
  }
}
function qw() {
  return new Date((/* @__PURE__ */ new Date()).setMonth((/* @__PURE__ */ new Date()).getMonth() + 1));
}
function Ww() {
  return new Date((/* @__PURE__ */ new Date()).setHours((/* @__PURE__ */ new Date()).getHours() + 1));
}
function Yc(t, e) {
  (t === void 0 || t === "") && (t = "0.0.0"), (e === void 0 || t === "") && (e = "0.0.0");
  const n = t.split(".").map((s) => parseInt(s, 10)), r = e.split(".").map((s) => parseInt(s, 10));
  for (let s = 0; s < e.length; s++)
    if (s >= t.length && r.push(0), n[s] < r[s])
      return !1;
  return !0;
}
function Xw() {
  let t = (/* @__PURE__ */ new Date()).getTime();
  return typeof performance < "u" && typeof performance.now == "function" && (t += performance.now()), "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
    const n = (t + Math.random() * 16) % 16 | 0;
    return t = Math.floor(t / 16), (e === "x" ? n : n & 3 | 8).toString(16);
  });
}
function Yw() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("Unexpected runtime environment - no supported global scope (`window`, `self`, `global`) available");
}
function Zw(t, e, n) {
  return n ? `Use of '${n}' requires \`${e}\` which is unavailable on the '${t}' object within the currently executing environment.` : `\`${e}\` is unavailable on the '${t}' object within the currently executing environment.`;
}
function _u(t, { throwIfUnavailable: e, usageDesc: n, returnEmptyObject: r } = {}) {
  let s;
  try {
    if (s = Yw(), s) {
      const i = s[t];
      if (i)
        return i;
    }
  } catch (i) {
    Bi.error(`Error getting object '${t}' from global scope '${s}': ${i}`);
  }
  if (e) {
    const i = Zw(s, t.toString(), n);
    throw Bi.error(i), new Error(i);
  }
  if (r)
    return {};
}
function ks(t, e) {
  return Uu(an(t), e);
}
function an(t) {
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
    return BigInt(`0x${ht(t)}`);
  throw new TypeError("intToBigInt: Invalid value type. Must be a number, bigint, BigInt-compatible string, or Uint8Array.");
}
function Qw(t) {
  return /^0x/i.test(t) ? t.slice(2) : t;
}
function rd(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Ro(t, e = 8) {
  return (typeof t == "bigint" ? t : an(t)).toString(16).padStart(e * 2, "0");
}
function xc(t) {
  return parseInt(t, 16);
}
function Uu(t, e = 16) {
  const n = Ro(t, e);
  return Gt(n);
}
function Jw(t, e) {
  if (t < -(BigInt(1) << e - BigInt(1)) || (BigInt(1) << e - BigInt(1)) - BigInt(1) < t)
    throw `Unable to represent integer in width: ${e}`;
  return t >= BigInt(0) ? BigInt(t) : t + (BigInt(1) << e);
}
function tb(t, e) {
  return t & BigInt(1) << e;
}
function Tl(t) {
  return eb(BigInt(`0x${ht(t)}`), BigInt(t.byteLength * 8));
}
function eb(t, e) {
  return tb(t, e - BigInt(1)) ? t - (BigInt(1) << e) : t;
}
const nb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ht(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += nb[n];
  return e;
}
function Gt(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBytes: expected string, got ${typeof t}`);
  t = Qw(t), t = t.length % 2 ? `0${t}` : t;
  const e = new Uint8Array(t.length / 2);
  for (let n = 0; n < e.length; n++) {
    const r = n * 2, s = t.slice(r, r + 2), i = Number.parseInt(s, 16);
    if (Number.isNaN(i) || i < 0)
      throw new Error("Invalid byte sequence");
    e[n] = i;
  }
  return e;
}
function di(t) {
  return new TextEncoder().encode(t);
}
function Go(t) {
  return new TextDecoder().decode(t);
}
function rb(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function sb(t) {
  return String.fromCharCode.apply(null, t);
}
function ib(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function sd(t) {
  if (t.some(ib))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function Er(...t) {
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
  return Er(...t.map((e) => typeof e == "number" ? sd([e]) : e instanceof Array ? sd(e) : e));
}
function vn(t, e) {
  var n, r;
  return t instanceof e || ((r = (n = t == null ? void 0 : t.constructor) == null ? void 0 : n.name) == null ? void 0 : r.toLowerCase()) === e.name;
}
const H0 = "https://api.mainnet.hiro.so", O0 = "https://api.testnet.hiro.so", D0 = "http://localhost:3999", ob = "https://hub.blockstack.org", ab = 33, Zc = 32;
function cb(t) {
  if (t.length < Zc * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + Zc * 2), r = t.slice(2 + Zc * 2);
  return {
    recoveryId: xc(e),
    r: n,
    s: r
  };
}
function Hu(t) {
  const e = typeof t == "string" ? Gt(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function lb(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function ub(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function fb(t, e) {
  return t[e];
}
function db(t, e, n = 0) {
  return t[n] = e, t;
}
function hb(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function Xs(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
const pb = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function gb(t, e) {
  const n = {};
  return Object.assign(n, pb, e), await fetch(t, n);
}
function yb(t) {
  let e = gb, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function wb(...t) {
  const { fetchLib: e, middlewares: n } = yb(t);
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
class F0 {
  constructor(e = _0.slice(), n = ((a) => (a = _u("location", { returnEmptyObject: !0 })) == null ? void 0 : a.origin)(), r = "", s = "/manifest.json", i = void 0, o = zw) {
    this.appDomain = n, this.scopes = e, this.redirectPath = r, this.manifestPath = s, this.coreNode = i, this.authenticatorURL = o;
  }
  redirectURI() {
    return `${this.appDomain}${this.redirectPath}`;
  }
  manifestURI() {
    return `${this.appDomain}${this.manifestPath}`;
  }
}
function Bl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function bb(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function j0(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function mb(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Bl(t.outputLen), Bl(t.blockLen);
}
function xb(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Sb(t, e) {
  j0(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Os = {
  number: Bl,
  bool: bb,
  bytes: j0,
  hash: mb,
  exists: xb,
  output: Sb
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Qc = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), lr = (t, e) => t << 32 - e | t >>> e, Eb = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!Eb)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ab(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Ou(t) {
  if (typeof t == "string" && (t = Ab(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let z0 = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function hi(t) {
  const e = (r) => t().update(Ou(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let R0 = class extends z0 {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Os.hash(e);
    const r = Ou(n);
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
    return Os.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Os.exists(this), Os.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Sc = (t, e, n) => new R0(t, e).update(n).digest();
Sc.create = (t, e) => new R0(t, e);
function vb(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Du = class extends z0 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Qc(this.buffer);
  }
  update(e) {
    Os.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Ou(e);
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
    Os.exists(this), Os.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    vb(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Qc(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const kb = (t, e, n) => t & e ^ ~t & n, $b = (t, e, n) => t & e ^ t & n ^ e & n, Ib = new Uint32Array([
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
let G0 = class extends Du {
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
      const w = Xr[l - 15], p = Xr[l - 2], m = lr(w, 7) ^ lr(w, 18) ^ w >>> 3, S = lr(p, 17) ^ lr(p, 19) ^ p >>> 10;
      Xr[l] = S + Xr[l - 7] + m + Xr[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = lr(a, 6) ^ lr(a, 11) ^ lr(a, 25), p = f + w + kb(a, c, u) + Ib[l] + Xr[l] | 0, S = (lr(r, 2) ^ lr(r, 13) ^ lr(r, 22)) + $b(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Xr.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, Lb = class extends G0 {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const zi = hi(() => new G0());
hi(() => new Lb());
const Cb = {}, K0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cb
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const Rt = BigInt(0), pe = BigInt(1), xs = BigInt(2), ko = BigInt(3), id = BigInt(8), te = Object.freeze({
  a: Rt,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: pe,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), od = (t, e) => (t + e / xs) / e, na = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(t) {
    const { n: e } = te, n = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), r = -pe * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), i = n, o = BigInt("0x100000000000000000000000000000000"), a = od(i * t, e), c = od(-r * t, e);
    let u = rt(t - a * n - c * s, e), f = rt(-a * r - c * i, e);
    const l = u > o, w = f > o;
    if (l && (u = e - u), w && (f = e - f), u > o || f > o)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + t);
    return { k1neg: l, k1: u, k2neg: w, k2: f };
  }
}, er = 32, Ys = 32, V0 = 32, Ra = er + 1, Ga = 2 * er + 1;
function ad(t) {
  const { a: e, b: n } = te, r = rt(t * t), s = rt(r * t);
  return rt(s + e * t + n);
}
const ra = te.a === Rt;
class Fu extends Error {
  constructor(e) {
    super(e);
  }
}
function cd(t) {
  if (!(t instanceof Wt))
    throw new TypeError("JacobianPoint expected");
}
class Wt {
  constructor(e, n, r) {
    this.x = e, this.y = n, this.z = r;
  }
  static fromAffine(e) {
    if (!(e instanceof Ht))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(Ht.ZERO) ? Wt.ZERO : new Wt(e.x, e.y, pe);
  }
  static toAffineBatch(e) {
    const n = Pb(e.map((r) => r.z));
    return e.map((r, s) => r.toAffine(n[s]));
  }
  static normalizeZ(e) {
    return Wt.toAffineBatch(e).map(Wt.fromAffine);
  }
  equals(e) {
    cd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e, c = rt(s * s), u = rt(a * a), f = rt(n * u), l = rt(i * c), w = rt(rt(r * a) * u), p = rt(rt(o * s) * c);
    return f === l && w === p;
  }
  negate() {
    return new Wt(this.x, rt(-this.y), this.z);
  }
  double() {
    const { x: e, y: n, z: r } = this, s = rt(e * e), i = rt(n * n), o = rt(i * i), a = e + i, c = rt(xs * (rt(a * a) - s - o)), u = rt(ko * s), f = rt(u * u), l = rt(f - xs * c), w = rt(u * (c - l) - id * o), p = rt(xs * n * r);
    return new Wt(l, w, p);
  }
  add(e) {
    cd(e);
    const { x: n, y: r, z: s } = this, { x: i, y: o, z: a } = e;
    if (i === Rt || o === Rt)
      return this;
    if (n === Rt || r === Rt)
      return e;
    const c = rt(s * s), u = rt(a * a), f = rt(n * u), l = rt(i * c), w = rt(rt(r * a) * u), p = rt(rt(o * s) * c), m = rt(l - f), S = rt(p - w);
    if (m === Rt)
      return S === Rt ? this.double() : Wt.ZERO;
    const M = rt(m * m), R = rt(m * M), z = rt(f * M), E = rt(S * S - R - xs * z), _ = rt(S * (z - E) - w * R), N = rt(s * a * m);
    return new Wt(E, _, N);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const n = Wt.ZERO;
    if (typeof e == "bigint" && e === Rt)
      return n;
    let r = fd(e);
    if (r === pe)
      return this;
    if (!ra) {
      let l = n, w = this;
      for (; r > Rt; )
        r & pe && (l = l.add(w)), w = w.double(), r >>= pe;
      return l;
    }
    let { k1neg: s, k1: i, k2neg: o, k2: a } = na.splitScalar(r), c = n, u = n, f = this;
    for (; i > Rt || a > Rt; )
      i & pe && (c = c.add(f)), a & pe && (u = u.add(f)), f = f.double(), i >>= pe, a >>= pe;
    return s && (c = c.negate()), o && (u = u.negate()), u = new Wt(rt(u.x * na.beta), u.y, u.z), c.add(u);
  }
  precomputeWindow(e) {
    const n = ra ? 128 / e + 1 : 256 / e + 1, r = [];
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
    !n && this.equals(Wt.BASE) && (n = Ht.BASE);
    const r = n && n._WINDOW_SIZE || 1;
    if (256 % r)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let s = n && Ml.get(n);
    s || (s = this.precomputeWindow(r), n && r !== 1 && (s = Wt.normalizeZ(s), Ml.set(n, s)));
    let i = Wt.ZERO, o = Wt.BASE;
    const a = 1 + (ra ? 128 / r : 256 / r), c = 2 ** (r - 1), u = BigInt(2 ** r - 1), f = 2 ** r, l = BigInt(r);
    for (let w = 0; w < a; w++) {
      const p = w * c;
      let m = Number(e & u);
      e >>= l, m > c && (m -= f, e += pe);
      const S = p, M = p + Math.abs(m) - 1, R = w % 2 !== 0, z = m < 0;
      m === 0 ? o = o.add(sa(R, s[S])) : i = i.add(sa(z, s[M]));
    }
    return { p: i, f: o };
  }
  multiply(e, n) {
    let r = fd(e), s, i;
    if (ra) {
      const { k1neg: o, k1: a, k2neg: c, k2: u } = na.splitScalar(r);
      let { p: f, f: l } = this.wNAF(a, n), { p: w, f: p } = this.wNAF(u, n);
      f = sa(o, f), w = sa(c, w), w = new Wt(rt(w.x * na.beta), w.y, w.z), s = f.add(w), i = l.add(p);
    } else {
      const { p: o, f: a } = this.wNAF(r, n);
      s = o, i = a;
    }
    return Wt.normalizeZ([s, i])[0];
  }
  toAffine(e) {
    const { x: n, y: r, z: s } = this, i = this.equals(Wt.ZERO);
    e == null && (e = i ? id : io(s));
    const o = e, a = rt(o * o), c = rt(a * o), u = rt(n * a), f = rt(r * c), l = rt(s * o);
    if (i)
      return Ht.ZERO;
    if (l !== pe)
      throw new Error("invZ was invalid");
    return new Ht(u, f);
  }
}
Wt.BASE = new Wt(te.Gx, te.Gy, pe);
Wt.ZERO = new Wt(Rt, pe, Rt);
function sa(t, e) {
  const n = e.negate();
  return t ? n : e;
}
const Ml = /* @__PURE__ */ new WeakMap();
class Ht {
  constructor(e, n) {
    this.x = e, this.y = n;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, Ml.delete(this);
  }
  hasEvenY() {
    return this.y % xs === Rt;
  }
  static fromCompressedHex(e) {
    const n = e.length === 32, r = Hn(n ? e : e.subarray(1));
    if (!Na(r))
      throw new Error("Point is not on curve");
    const s = ad(r);
    let i = Nb(s);
    const o = (i & pe) === pe;
    n ? o && (i = rt(-i)) : (e[0] & 1) === 1 !== o && (i = rt(-i));
    const a = new Ht(r, i);
    return a.assertValidity(), a;
  }
  static fromUncompressedHex(e) {
    const n = Hn(e.subarray(1, er + 1)), r = Hn(e.subarray(er + 1, er * 2 + 1)), s = new Ht(n, r);
    return s.assertValidity(), s;
  }
  static fromHex(e) {
    const n = Ar(e), r = n.length, s = n[0];
    if (r === er)
      return this.fromCompressedHex(n);
    if (r === Ra && (s === 2 || s === 3))
      return this.fromCompressedHex(n);
    if (r === Ga && s === 4)
      return this.fromUncompressedHex(n);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Ra} compressed bytes or ${Ga} uncompressed bytes, not ${r}`);
  }
  static fromPrivateKey(e) {
    return Ht.BASE.multiply(Zs(e));
  }
  static fromSignature(e, n, r) {
    const { r: s, s: i } = X0(n);
    if (![0, 1, 2, 3].includes(r))
      throw new Error("Cannot recover: invalid recovery bit");
    const o = ju(Ar(e)), { n: a } = te, c = r === 2 || r === 3 ? s + a : s, u = io(c, a), f = rt(-o * u, a), l = rt(i * u, a), w = r & 1 ? "03" : "02", p = Ht.fromHex(w + Ss(c)), m = Ht.BASE.multiplyAndAddUnsafe(p, f, l);
    if (!m)
      throw new Error("Cannot recover signature: point at infinify");
    return m.assertValidity(), m;
  }
  toRawBytes(e = !1) {
    return Es(this.toHex(e));
  }
  toHex(e = !1) {
    const n = Ss(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${n}` : `04${n}${Ss(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: n, y: r } = this;
    if (!Na(n) || !Na(r))
      throw new Error(e);
    const s = rt(r * r), i = ad(n);
    if (rt(s - i) !== Rt)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new Ht(this.x, rt(-this.y));
  }
  double() {
    return Wt.fromAffine(this).double().toAffine();
  }
  add(e) {
    return Wt.fromAffine(this).add(Wt.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return Wt.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, n, r) {
    const s = Wt.fromAffine(this), i = n === Rt || n === pe || this !== Ht.BASE ? s.multiplyUnsafe(n) : s.multiply(n), o = Wt.fromAffine(e).multiplyUnsafe(r), a = i.add(o);
    return a.equals(Wt.ZERO) ? void 0 : a.toAffine();
  }
}
Ht.BASE = new Ht(te.Gx, te.Gy);
Ht.ZERO = new Ht(Rt, Rt);
function ld(t) {
  return Number.parseInt(t[0], 16) >= 8 ? "00" + t : t;
}
function ud(t) {
  if (t.length < 2 || t[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${Ri(t)}`);
  const e = t[1], n = t.subarray(2, e + 2);
  if (!e || n.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (n[0] === 0 && n[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: Hn(n), left: t.subarray(e + 2) };
}
function Tb(t) {
  if (t.length < 2 || t[0] != 48)
    throw new Error(`Invalid signature tag: ${Ri(t)}`);
  if (t[1] !== t.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: n } = ud(t.subarray(2)), { data: r, left: s } = ud(n);
  if (s.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${Ri(s)}`);
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
    const s = n ? Ri(e) : e;
    if (s.length !== 128)
      throw new Error(`${r}: Expected 64-byte hex`);
    return new Un(Ka(s.slice(0, 64)), Ka(s.slice(64, 128)));
  }
  static fromDER(e) {
    const n = e instanceof Uint8Array;
    if (typeof e != "string" && !n)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r, s } = Tb(n ? e : Es(e));
    return new Un(r, s);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Ki(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!Ki(n))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = te.n >> pe;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Un(this.r, rt(-this.s, te.n)) : this;
  }
  toDERRawBytes() {
    return Es(this.toDERHex());
  }
  toDERHex() {
    const e = ld(wo(this.s)), n = ld(wo(this.r)), r = e.length / 2, s = n.length / 2, i = wo(r), o = wo(s);
    return `30${wo(s + r + 4)}02${o}${n}02${i}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return Es(this.toCompactHex());
  }
  toCompactHex() {
    return Ss(this.r) + Ss(this.s);
  }
}
function bs(...t) {
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
const Bb = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ri(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += Bb[t[n]];
  return e;
}
const Mb = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function Ss(t) {
  if (typeof t != "bigint")
    throw new Error("Expected bigint");
  if (!(Rt <= t && t < Mb))
    throw new Error("Expected number 0 <= n < 2^256");
  return t.toString(16).padStart(64, "0");
}
function Gi(t) {
  const e = Es(Ss(t));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function wo(t) {
  const e = t.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ka(t) {
  if (typeof t != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof t);
  return BigInt(`0x${t}`);
}
function Es(t) {
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
  return Ka(Ri(t));
}
function Ar(t) {
  return t instanceof Uint8Array ? Uint8Array.from(t) : Es(t);
}
function fd(t) {
  if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    return BigInt(t);
  if (typeof t == "bigint" && Ki(t))
    return t;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function rt(t, e = te.P) {
  const n = t % e;
  return n >= Rt ? n : e + n;
}
function jn(t, e) {
  const { P: n } = te;
  let r = t;
  for (; e-- > Rt; )
    r *= r, r %= n;
  return r;
}
function Nb(t) {
  const { P: e } = te, n = BigInt(6), r = BigInt(11), s = BigInt(22), i = BigInt(23), o = BigInt(44), a = BigInt(88), c = t * t * t % e, u = c * c * t % e, f = jn(u, ko) * u % e, l = jn(f, ko) * u % e, w = jn(l, xs) * c % e, p = jn(w, r) * w % e, m = jn(p, s) * p % e, S = jn(m, o) * m % e, M = jn(S, a) * S % e, R = jn(M, o) * m % e, z = jn(R, ko) * u % e, E = jn(z, i) * p % e, _ = jn(E, n) * c % e, N = jn(_, xs);
  if (N * N % e !== t)
    throw new Error("Cannot find square root");
  return N;
}
function io(t, e = te.P) {
  if (t === Rt || e <= Rt)
    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
  let n = rt(t, e), r = e, s = Rt, i = pe;
  for (; n !== Rt; ) {
    const a = r / n, c = r % n, u = s - i * a;
    r = n, n = c, s = i, i = u;
  }
  if (r !== pe)
    throw new Error("invert: does not exist");
  return rt(s, e);
}
function Pb(t, e = te.P) {
  const n = new Array(t.length), r = t.reduce((i, o, a) => o === Rt ? i : (n[a] = i, rt(i * o, e)), pe), s = io(r, e);
  return t.reduceRight((i, o, a) => o === Rt ? i : (n[a] = rt(i * n[a], e), rt(i * o, e)), s), n;
}
function _b(t) {
  const e = t.length * 8 - Ys * 8, n = Hn(t);
  return e > 0 ? n >> BigInt(e) : n;
}
function ju(t, e = !1) {
  const n = _b(t);
  if (e)
    return n;
  const { n: r } = te;
  return n >= r ? n - r : n;
}
let Hi, $o;
class q0 {
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
    return $o(this.k, ...e);
  }
  checkSync() {
    if (typeof $o != "function")
      throw new Fu("hmacSha256Sync needs to be set");
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
    return bs(...n);
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
    return bs(...n);
  }
}
function Ki(t) {
  return Rt < t && t < te.n;
}
function Na(t) {
  return Rt < t && t < te.P;
}
function W0(t, e, n, r = !0) {
  const { n: s } = te, i = ju(t, !0);
  if (!Ki(i))
    return;
  const o = io(i, s), a = Ht.BASE.multiply(i), c = rt(a.x, s);
  if (c === Rt)
    return;
  const u = rt(o * rt(e + n * c, s), s);
  if (u === Rt)
    return;
  let f = new Un(c, u), l = (a.x === f.r ? 0 : 2) | Number(a.y & pe);
  return r && f.hasHighS() && (f = f.normalizeS(), l ^= 1), { sig: f, recovery: l };
}
function Zs(t) {
  let e;
  if (typeof t == "bigint")
    e = t;
  else if (typeof t == "number" && Number.isSafeInteger(t) && t > 0)
    e = BigInt(t);
  else if (typeof t == "string") {
    if (t.length !== 2 * Ys)
      throw new Error("Expected 32 bytes of private key");
    e = Ka(t);
  } else if (t instanceof Uint8Array) {
    if (t.length !== Ys)
      throw new Error("Expected 32 bytes of private key");
    e = Hn(t);
  } else
    throw new TypeError("Expected valid private key");
  if (!Ki(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function zu(t) {
  return t instanceof Ht ? (t.assertValidity(), t) : Ht.fromHex(t);
}
function X0(t) {
  if (t instanceof Un)
    return t.assertValidity(), t;
  try {
    return Un.fromDER(t);
  } catch {
    return Un.fromCompact(t);
  }
}
function Ko(t, e = !1) {
  return Ht.fromPrivateKey(t).toRawBytes(e);
}
function Ub(t, e, n, r = !1) {
  return Ht.fromSignature(t, e, n).toRawBytes(r);
}
function dd(t) {
  const e = t instanceof Uint8Array, n = typeof t == "string", r = (e || n) && t.length;
  return e ? r === Ra || r === Ga : n ? r === Ra * 2 || r === Ga * 2 : t instanceof Ht;
}
function Ru(t, e, n = !1) {
  if (dd(t))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!dd(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const r = zu(e);
  return r.assertValidity(), r.multiply(Zs(t)).toRawBytes(n);
}
function Y0(t) {
  const e = t.length > er ? t.slice(0, er) : t;
  return Hn(e);
}
function Hb(t) {
  const e = Y0(t), n = rt(e, te.n);
  return Z0(n < Rt ? e : n);
}
function Z0(t) {
  return Gi(t);
}
function Q0(t, e, n) {
  if (t == null)
    throw new Error(`sign: expected valid message hash, not "${t}"`);
  const r = Ar(t), s = Zs(e), i = [Z0(s), Hb(r)];
  if (n != null) {
    n === !0 && (n = Te.randomBytes(er));
    const c = Ar(n);
    if (c.length !== er)
      throw new Error(`sign: Expected ${er} bytes of extra data`);
    i.push(c);
  }
  const o = bs(...i), a = Y0(r);
  return { seed: o, m: a, d: s };
}
function J0(t, e) {
  const { sig: n, recovery: r } = t, { der: s, recovered: i } = Object.assign({ canonical: !0, der: !0 }, e), o = s ? n.toDERRawBytes() : n.toCompactRawBytes();
  return i ? [o, r] : o;
}
async function Ob(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Q0(t, e, n.extraEntropy), o = new q0(V0, Ys);
  await o.reseed(r);
  let a;
  for (; !(a = W0(await o.generate(), s, i, n.canonical)); )
    await o.reseed();
  return J0(a, n);
}
function Ec(t, e, n = {}) {
  const { seed: r, m: s, d: i } = Q0(t, e, n.extraEntropy), o = new q0(V0, Ys);
  o.reseedSync(r);
  let a;
  for (; !(a = W0(o.generateSync(), s, i, n.canonical)); )
    o.reseedSync();
  return J0(a, n);
}
const Db = { strict: !0 };
function Fb(t, e, n, r = Db) {
  let s;
  try {
    s = X0(t), e = Ar(e);
  } catch {
    return !1;
  }
  const { r: i, s: o } = s;
  if (r.strict && s.hasHighS())
    return !1;
  const a = ju(e);
  let c;
  try {
    c = zu(n);
  } catch {
    return !1;
  }
  const { n: u } = te, f = io(o, u), l = rt(a * f, u), w = rt(i * f, u), p = Ht.BASE.multiplyAndAddUnsafe(c, l, w);
  return p ? rt(p.x, u) === i : !1;
}
function Va(t) {
  return rt(Hn(t), te.n);
}
class Vi {
  constructor(e, n) {
    this.r = e, this.s = n, this.assertValidity();
  }
  static fromHex(e) {
    const n = Ar(e);
    if (n.length !== 64)
      throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);
    const r = Hn(n.subarray(0, 32)), s = Hn(n.subarray(32, 64));
    return new Vi(r, s);
  }
  assertValidity() {
    const { r: e, s: n } = this;
    if (!Na(e) || !Ki(n))
      throw new Error("Invalid signature");
  }
  toHex() {
    return Ss(this.r) + Ss(this.s);
  }
  toRawBytes() {
    return Es(this.toHex());
  }
}
function jb(t) {
  return Ht.fromPrivateKey(t).toRawX();
}
class tp {
  constructor(e, n, r = Te.randomBytes()) {
    if (e == null)
      throw new TypeError(`sign: Expected valid message, not "${e}"`);
    this.m = Ar(e);
    const { x: s, scalar: i } = this.getScalar(Zs(n));
    if (this.px = s, this.d = i, this.rand = Ar(r), this.rand.length !== 32)
      throw new TypeError("sign: Expected 32 bytes of aux randomness");
  }
  getScalar(e) {
    const n = Ht.fromPrivateKey(e), r = n.hasEvenY() ? e : te.n - e;
    return { point: n, scalar: r, x: n.toRawX() };
  }
  initNonce(e, n) {
    return Gi(e ^ Hn(n));
  }
  finalizeNonce(e) {
    const n = rt(Hn(e), te.n);
    if (n === Rt)
      throw new Error("sign: Creation of signature failed. k is zero");
    const { point: r, x: s, scalar: i } = this.getScalar(n);
    return { R: r, rx: s, k: i };
  }
  finalizeSig(e, n, r, s) {
    return new Vi(e.x, rt(n + r * s, te.n)).toRawBytes();
  }
  error() {
    throw new Error("sign: Invalid signature produced");
  }
  async calc() {
    const { m: e, d: n, px: r, rand: s } = this, i = Te.taggedHash, o = this.initNonce(n, await i(ws.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(await i(ws.nonce, o, r, e)), f = Va(await i(ws.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return await rp(l, e, r) || this.error(), l;
  }
  calcSync() {
    const { m: e, d: n, px: r, rand: s } = this, i = Te.taggedHashSync, o = this.initNonce(n, i(ws.aux, s)), { R: a, rx: c, k: u } = this.finalizeNonce(i(ws.nonce, o, r, e)), f = Va(i(ws.challenge, c, r, e)), l = this.finalizeSig(a, u, f, n);
    return sp(l, e, r) || this.error(), l;
  }
}
async function zb(t, e, n) {
  return new tp(t, e, n).calc();
}
function Rb(t, e, n) {
  return new tp(t, e, n).calcSync();
}
function ep(t, e, n) {
  const r = t instanceof Vi, s = r ? t : Vi.fromHex(t);
  return r && s.assertValidity(), {
    ...s,
    m: Ar(e),
    P: zu(n)
  };
}
function np(t, e, n, r) {
  const s = Ht.BASE.multiplyAndAddUnsafe(e, Zs(n), rt(-r, te.n));
  return !(!s || !s.hasEvenY() || s.x !== t);
}
async function rp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = ep(t, e, n), a = Va(await Te.taggedHash(ws.challenge, Gi(r), o.toRawX(), i));
    return np(r, o, s, a);
  } catch {
    return !1;
  }
}
function sp(t, e, n) {
  try {
    const { r, s, m: i, P: o } = ep(t, e, n), a = Va(Te.taggedHashSync(ws.challenge, Gi(r), o.toRawX(), i));
    return np(r, o, s, a);
  } catch (r) {
    if (r instanceof Fu)
      throw r;
    return !1;
  }
}
const Gb = {
  Signature: Vi,
  getPublicKey: jb,
  sign: zb,
  verify: rp,
  signSync: Rb,
  verifySync: sp
};
Ht.BASE._setWindowSize(8);
const Tn = {
  node: K0,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, ws = {
  challenge: "BIP0340/challenge",
  aux: "BIP0340/aux",
  nonce: "BIP0340/nonce"
}, ia = {}, Te = {
  bytesToHex: Ri,
  hexToBytes: Es,
  concatBytes: bs,
  mod: rt,
  invert: io,
  isValidPrivateKey(t) {
    try {
      return Zs(t), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: Gi,
  _normalizePrivateKey: Zs,
  hashToPrivateKey: (t) => {
    t = Ar(t);
    const e = Ys + 8;
    if (t.length < e || t.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const n = rt(Hn(t), te.n - pe) + pe;
    return Gi(n);
  },
  randomBytes: (t = 32) => {
    if (Tn.web)
      return Tn.web.getRandomValues(new Uint8Array(t));
    if (Tn.node) {
      const { randomBytes: e } = Tn.node;
      return Uint8Array.from(e(t));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Te.hashToPrivateKey(Te.randomBytes(Ys + 8)),
  precompute(t = 8, e = Ht.BASE) {
    const n = e === Ht.BASE ? e : new Ht(e.x, e.y);
    return n._setWindowSize(t), n.multiply(ko), n;
  },
  sha256: async (...t) => {
    if (Tn.web) {
      const e = await Tn.web.subtle.digest("SHA-256", bs(...t));
      return new Uint8Array(e);
    } else if (Tn.node) {
      const { createHash: e } = Tn.node, n = e("sha256");
      return t.forEach((r) => n.update(r)), Uint8Array.from(n.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (t, ...e) => {
    if (Tn.web) {
      const n = await Tn.web.subtle.importKey("raw", t, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), r = bs(...e), s = await Tn.web.subtle.sign("HMAC", n, r);
      return new Uint8Array(s);
    } else if (Tn.node) {
      const { createHmac: n } = Tn.node, r = n("sha256", t);
      return e.forEach((s) => r.update(s)), Uint8Array.from(r.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (t, ...e) => {
    let n = ia[t];
    if (n === void 0) {
      const r = await Te.sha256(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = bs(r, r), ia[t] = n;
    }
    return Te.sha256(n, ...e);
  },
  taggedHashSync: (t, ...e) => {
    if (typeof Hi != "function")
      throw new Fu("sha256Sync is undefined, you need to set it");
    let n = ia[t];
    if (n === void 0) {
      const r = Hi(Uint8Array.from(t, (s) => s.charCodeAt(0)));
      n = bs(r, r), ia[t] = n;
    }
    return Hi(n, ...e);
  },
  _JacobianPoint: Wt
};
Object.defineProperties(Te, {
  sha256Sync: {
    configurable: !1,
    get() {
      return Hi;
    },
    set(t) {
      Hi || (Hi = t);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return $o;
    },
    set(t) {
      $o || ($o = t);
    }
  }
});
const Kb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CURVE: te,
  Point: Ht,
  Signature: Un,
  getPublicKey: Ko,
  getSharedSecret: Ru,
  recoverPublicKey: Ub,
  schnorr: Gb,
  sign: Ob,
  signSync: Ec,
  utils: Te,
  verify: Fb
}, Symbol.toStringTag, { value: "Module" }));
var Vo = {};
Vo.byteLength = Yb;
var Vb = Vo.toByteArray = Qb, qb = Vo.fromByteArray = em, gr = [], Gn = [], Wb = typeof Uint8Array < "u" ? Uint8Array : Array, Jc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var vi = 0, Xb = Jc.length; vi < Xb; ++vi)
  gr[vi] = Jc[vi], Gn[Jc.charCodeAt(vi)] = vi;
Gn[45] = 62;
Gn[95] = 63;
function ip(t) {
  var e = t.length;
  if (e % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = t.indexOf("=");
  n === -1 && (n = e);
  var r = n === e ? 0 : 4 - n % 4;
  return [n, r];
}
function Yb(t) {
  var e = ip(t), n = e[0], r = e[1];
  return (n + r) * 3 / 4 - r;
}
function Zb(t, e, n) {
  return (e + n) * 3 / 4 - n;
}
function Qb(t) {
  var e, n = ip(t), r = n[0], s = n[1], i = new Wb(Zb(t, r, s)), o = 0, a = s > 0 ? r - 4 : r, c;
  for (c = 0; c < a; c += 4)
    e = Gn[t.charCodeAt(c)] << 18 | Gn[t.charCodeAt(c + 1)] << 12 | Gn[t.charCodeAt(c + 2)] << 6 | Gn[t.charCodeAt(c + 3)], i[o++] = e >> 16 & 255, i[o++] = e >> 8 & 255, i[o++] = e & 255;
  return s === 2 && (e = Gn[t.charCodeAt(c)] << 2 | Gn[t.charCodeAt(c + 1)] >> 4, i[o++] = e & 255), s === 1 && (e = Gn[t.charCodeAt(c)] << 10 | Gn[t.charCodeAt(c + 1)] << 4 | Gn[t.charCodeAt(c + 2)] >> 2, i[o++] = e >> 8 & 255, i[o++] = e & 255), i;
}
function Jb(t) {
  return gr[t >> 18 & 63] + gr[t >> 12 & 63] + gr[t >> 6 & 63] + gr[t & 63];
}
function tm(t, e, n) {
  for (var r, s = [], i = e; i < n; i += 3)
    r = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (t[i + 2] & 255), s.push(Jb(r));
  return s.join("");
}
function em(t) {
  for (var e, n = t.length, r = n % 3, s = [], i = 16383, o = 0, a = n - r; o < a; o += i)
    s.push(tm(t, o, o + i > a ? a : o + i));
  return r === 1 ? (e = t[n - 1], s.push(
    gr[e >> 2] + gr[e << 4 & 63] + "=="
  )) : r === 2 && (e = (t[n - 2] << 8) + t[n - 1], s.push(
    gr[e >> 10] + gr[e >> 4 & 63] + gr[e << 2 & 63] + "="
  )), s.join("");
}
function nm() {
  return typeof crypto < "u" && typeof crypto.subtle < "u";
}
const rm = 'Crypto lib not found. Either the WebCrypto "crypto.subtle" or Node.js "crypto" module must be available.';
async function sm() {
  if (nm())
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
    throw new Error(rm);
  }
}
class im {
  constructor(e, n) {
    this.createCipher = e, this.createDecipher = n;
  }
  async encrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createCipher(e, n, r), o = new Uint8Array(Er(i.update(s), i.final()));
    return Promise.resolve(o);
  }
  async decrypt(e, n, r, s) {
    if (e !== "aes-128-cbc" && e !== "aes-256-cbc")
      throw new Error(`Unsupported cipher algorithm "${e}"`);
    const i = this.createDecipher(e, n, r), o = new Uint8Array(Er(i.update(s), i.final()));
    return Promise.resolve(o);
  }
}
class om {
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
async function op() {
  const t = await sm();
  return t.name === "subtleCrypto" ? new om(t.lib) : new im(t.lib.createCipheriv, t.lib.createDecipheriv);
}
function am(t) {
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
  function f(p) {
    if (p instanceof Uint8Array || (ArrayBuffer.isView(p) ? p = new Uint8Array(p.buffer, p.byteOffset, p.byteLength) : Array.isArray(p) && (p = Uint8Array.from(p))), !(p instanceof Uint8Array))
      throw new TypeError("Expected Uint8Array");
    if (p.length === 0)
      return "";
    for (var m = 0, S = 0, M = 0, R = p.length; M !== R && p[M] === 0; )
      M++, m++;
    for (var z = (R - M) * u + 1 >>> 0, E = new Uint8Array(z); M !== R; ) {
      for (var _ = p[M], N = 0, J = z - 1; (_ !== 0 || N < S) && J !== -1; J--, N++)
        _ += 256 * E[J] >>> 0, E[J] = _ % o >>> 0, _ = _ / o >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      S = N, M++;
    }
    for (var et = z - S; et !== z && E[et] === 0; )
      et++;
    for (var G = a.repeat(m); et < z; ++et)
      G += t.charAt(E[et]);
    return G;
  }
  function l(p) {
    if (typeof p != "string")
      throw new TypeError("Expected String");
    if (p.length === 0)
      return new Uint8Array();
    for (var m = 0, S = 0, M = 0; p[m] === a; )
      S++, m++;
    for (var R = (p.length - m) * c + 1 >>> 0, z = new Uint8Array(R); p[m]; ) {
      var E = p.charCodeAt(m);
      if (E > 255)
        return;
      var _ = e[E];
      if (_ === 255)
        return;
      for (var N = 0, J = R - 1; (_ !== 0 || N < M) && J !== -1; J--, N++)
        _ += o * z[J] >>> 0, z[J] = _ % 256 >>> 0, _ = _ / 256 >>> 0;
      if (_ !== 0)
        throw new Error("Non-zero carry");
      M = N, m++;
    }
    for (var et = R - M; et !== R && z[et] === 0; )
      et++;
    for (var G = new Uint8Array(S + (R - et)), V = S; et !== R; )
      G[V++] = z[et++];
    return G;
  }
  function w(p) {
    var m = l(p);
    if (m)
      return m;
    throw new Error("Non-base" + o + " character");
  }
  return {
    encode: f,
    decodeUnsafe: l,
    decode: w
  };
}
var ap = am;
const cm = ap, lm = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var um = cm(lm);
const fm = /* @__PURE__ */ B0(um), dm = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), cp = Uint8Array.from({ length: 16 }, (t, e) => e), hm = cp.map((t) => (9 * t + 5) % 16);
let Gu = [cp], Ku = [hm];
for (let t = 0; t < 4; t++)
  for (let e of [Gu, Ku])
    e.push(e[t].map((n) => dm[n]));
const lp = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), pm = Gu.map((t, e) => t.map((n) => lp[e][n])), gm = Ku.map((t, e) => t.map((n) => lp[e][n])), ym = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), wm = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), oa = (t, e) => t << e | t >>> 32 - e;
function hd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const aa = new Uint32Array(16);
let bm = class extends Du {
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
      aa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, S = ym[p], M = wm[p], R = Gu[p], z = Ku[p], E = pm[p], _ = gm[p];
      for (let N = 0; N < 16; N++) {
        const J = oa(r + hd(p, i, a, u) + aa[R[N]] + S, E[N]) + l | 0;
        r = l, l = u, u = oa(a, 10) | 0, a = i, i = J;
      }
      for (let N = 0; N < 16; N++) {
        const J = oa(s + hd(m, o, c, f) + aa[z[N]] + M, _[N]) + w | 0;
        s = w, w = f, f = oa(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    aa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const mm = hi(() => new bm());
function xm(t) {
  return mm(t);
}
const ca = BigInt(2 ** 32 - 1), Nl = BigInt(32);
function up(t, e = !1) {
  return e ? { h: Number(t & ca), l: Number(t >> Nl & ca) } : { h: Number(t >> Nl & ca) | 0, l: Number(t & ca) | 0 };
}
function Sm(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = up(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const Em = (t, e) => BigInt(t >>> 0) << Nl | BigInt(e >>> 0), Am = (t, e, n) => t >>> n, vm = (t, e, n) => t << 32 - n | e >>> n, km = (t, e, n) => t >>> n | e << 32 - n, $m = (t, e, n) => t << 32 - n | e >>> n, Im = (t, e, n) => t << 64 - n | e >>> n - 32, Lm = (t, e, n) => t >>> n - 32 | e << 64 - n, Cm = (t, e) => e, Tm = (t, e) => t, Bm = (t, e, n) => t << n | e >>> 32 - n, Mm = (t, e, n) => e << n | t >>> 32 - n, Nm = (t, e, n) => e << n - 32 | t >>> 64 - n, Pm = (t, e, n) => t << n - 32 | e >>> 64 - n;
function _m(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Um = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Hm = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Om = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Dm = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, Fm = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), jm = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Tt = {
  fromBig: up,
  split: Sm,
  toBig: Em,
  shrSH: Am,
  shrSL: vm,
  rotrSH: km,
  rotrSL: $m,
  rotrBH: Im,
  rotrBL: Lm,
  rotr32H: Cm,
  rotr32L: Tm,
  rotlSH: Bm,
  rotlSL: Mm,
  rotlBH: Nm,
  rotlBL: Pm,
  add: _m,
  add3L: Um,
  add3H: Hm,
  add4L: Om,
  add4H: Dm,
  add5H: jm,
  add5L: Fm
}, [zm, Rm] = Tt.split([
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
let Ac = class extends Du {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: m, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      Yr[E] = e.getUint32(n), Zr[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = Yr[E - 15] | 0, N = Zr[E - 15] | 0, J = Tt.rotrSH(_, N, 1) ^ Tt.rotrSH(_, N, 8) ^ Tt.shrSH(_, N, 7), et = Tt.rotrSL(_, N, 1) ^ Tt.rotrSL(_, N, 8) ^ Tt.shrSL(_, N, 7), G = Yr[E - 2] | 0, V = Zr[E - 2] | 0, $ = Tt.rotrSH(G, V, 19) ^ Tt.rotrBH(G, V, 61) ^ Tt.shrSH(G, V, 6), P = Tt.rotrSL(G, V, 19) ^ Tt.rotrBL(G, V, 61) ^ Tt.shrSL(G, V, 6), b = Tt.add4L(et, P, Zr[E - 7], Zr[E - 16]), C = Tt.add4H(b, J, $, Yr[E - 7], Yr[E - 16]);
      Yr[E] = C | 0, Zr[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: m, Gh: S, Gl: M, Hh: R, Hl: z } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Tt.rotrSH(l, w, 14) ^ Tt.rotrSH(l, w, 18) ^ Tt.rotrBH(l, w, 41), N = Tt.rotrSL(l, w, 14) ^ Tt.rotrSL(l, w, 18) ^ Tt.rotrBL(l, w, 41), J = l & p ^ ~l & S, et = w & m ^ ~w & M, G = Tt.add5L(z, N, et, Rm[E], Zr[E]), V = Tt.add5H(G, R, _, J, zm[E], Yr[E]), $ = G | 0, P = Tt.rotrSH(r, s, 28) ^ Tt.rotrBH(r, s, 34) ^ Tt.rotrBH(r, s, 39), b = Tt.rotrSL(r, s, 28) ^ Tt.rotrBL(r, s, 34) ^ Tt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, O = s & o ^ s & c ^ o & c;
      R = S | 0, z = M | 0, S = p | 0, M = m | 0, p = l | 0, m = w | 0, { h: l, l: w } = Tt.add(u | 0, f | 0, V | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Tt.add3L($, b, O);
      r = Tt.add3H(T, V, P, C), s = T | 0;
    }
    ({ h: r, l: s } = Tt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Tt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Tt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Tt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Tt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: m } = Tt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: S, l: M } = Tt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: R, l: z } = Tt.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, m, S, M, R, z);
  }
  roundClean() {
    Yr.fill(0), Zr.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, Gm = class extends Ac {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, Km = class extends Ac {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, Vm = class extends Ac {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
const qm = hi(() => new Ac());
hi(() => new Gm());
hi(() => new Km());
hi(() => new Vm());
function fp(t) {
  return zi(t);
}
function Wm(t) {
  return qm(t);
}
const Xm = 0;
Te.hmacSha256Sync = (t, ...e) => {
  const n = Sc.create(zi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Ym() {
  return ht(Te.randomPrivateKey());
}
function Zm(t) {
  const e = zi(zi(t));
  return fm.encode(Er(t, e).slice(0, t.length + 4));
}
function Qm(t, e) {
  return Zm(Er(new Uint8Array([t]), e.slice(0, 20)));
}
function dp(t, e = Xm) {
  const n = typeof t == "string" ? Gt(t) : t, r = xm(fp(n));
  return Qm(e, r);
}
function hp(t) {
  const e = Hu(t);
  return ht(Ko(e.slice(0, 32), !0));
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = Sc.create(zi, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
var qa;
(function(t) {
  t.InvalidFormat = "InvalidFormat", t.IsNotPoint = "IsNotPoint";
})(qa || (qa = {}));
async function Jm(t, e, n) {
  return await (await op()).encrypt("aes-256-cbc", e, t, n);
}
async function t1(t, e, n) {
  return await (await op()).decrypt("aes-256-cbc", e, t, n);
}
function pp(t, e) {
  return Sc(zi, t, e);
}
function e1(t, e) {
  if (t.length !== e.length)
    return !1;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    n |= t[r] ^ e[r];
  return n === 0;
}
function gp(t) {
  const e = Wm(t);
  return {
    encryptionKey: e.slice(0, 32),
    hmacKey: e.slice(32)
  };
}
function n1(t) {
  return t.match(/^[0-9a-f]+$/i) !== null;
}
function r1(t) {
  const e = {
    result: !1,
    reason_data: "Invalid public key format",
    reason: qa.InvalidFormat
  }, n = {
    result: !1,
    reason_data: "Public key is not a point",
    reason: qa.IsNotPoint
  };
  if (t.length !== 66 && t.length !== 130)
    return e;
  const r = t.slice(0, 2);
  if (t.length === 130 && r !== "04" || t.length === 66 && r !== "02" && r !== "03" || !n1(t))
    return e;
  try {
    return Ht.fromHex(t).assertValidity(), {
      result: !0,
      reason_data: null,
      reason: null
    };
  } catch {
    return n;
  }
}
async function s1(t, e, n, r) {
  const s = r1(t);
  if (!s.result)
    throw s;
  const i = Te.randomPrivateKey(), o = Ko(i, !0);
  let a = Ru(i, t, !0);
  a = a.slice(1);
  const c = gp(a), u = Te.randomBytes(16), f = await Jm(u, c.encryptionKey, e), l = Er(u, o, f), w = pp(c.hmacKey, l);
  let p;
  if (!r || r === "hex")
    p = ht(f);
  else if (r === "base64")
    p = qb(f);
  else
    throw new Error(`Unexpected cipherTextEncoding "${r}"`);
  const m = {
    iv: ht(u),
    ephemeralPK: ht(o),
    cipherText: p,
    mac: ht(w),
    wasString: n
  };
  return r && r !== "hex" && (m.cipherTextEncoding = r), m;
}
async function yp(t, e) {
  if (!e.ephemeralPK)
    throw new ed("Unable to get public key from cipher object. You might be trying to decrypt an unencrypted object.");
  const n = e.ephemeralPK;
  let r = Ru(t, n, !0);
  r = r.slice(1);
  const s = gp(r), i = Gt(e.iv);
  let o;
  if (!e.cipherTextEncoding || e.cipherTextEncoding === "hex")
    o = Gt(e.cipherText);
  else if (e.cipherTextEncoding === "base64")
    o = Vb(e.cipherText);
  else
    throw new Error(`Unexpected cipherTextEncoding "${e.cipherText}"`);
  const a = Er(i, Gt(n), o), c = pp(s.hmacKey, a), u = Gt(e.mac);
  if (!e1(u, c))
    throw new ed("Decryption failed: failure in MAC check");
  const f = await t1(i, s.encryptionKey, o);
  return e.wasString ? Go(f) : f;
}
function i1(t, e) {
  const n = typeof e == "string" ? di(e) : e, r = hp(t), s = fp(n), i = Ec(s, t);
  return {
    signature: ht(i),
    publicKey: r
  };
}
async function o1(t, e) {
  const n = Object.assign({}, e);
  let r;
  if (!n.publicKey) {
    if (!n.privateKey)
      throw new Error("Either public key or private key must be supplied for encryption.");
    n.publicKey = hp(n.privateKey);
  }
  const s = typeof n.wasString == "boolean" ? n.wasString : typeof t == "string", i = typeof t == "string" ? di(t) : t, o = await s1(n.publicKey, i, s, n.cipherTextEncoding);
  let a = JSON.stringify(o);
  if (n.sign) {
    typeof n.sign == "string" ? r = n.sign : r || (r = n.privateKey);
    const c = i1(r, a), u = {
      signature: c.signature,
      publicKey: c.publicKey,
      cipherText: a
    };
    a = JSON.stringify(u);
  }
  return a;
}
function a1(t, e) {
  const n = Object.assign({}, e);
  if (!n.privateKey)
    throw new Error("Private key is required for decryption.");
  try {
    const r = JSON.parse(t);
    return yp(n.privateKey, r);
  } catch (r) {
    throw r instanceof SyntaxError ? new Error("Failed to parse encrypted content JSON. The content may not be encrypted. If using getFile, try passing { decrypt: false }.") : r;
  }
}
var Je = {}, qi = {}, dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.decode = dn.encode = dn.unescape = dn.escape = dn.pad = void 0;
const wp = Vo;
function Vu(t) {
  return `${t}${"=".repeat(4 - (t.length % 4 || 4))}`;
}
dn.pad = Vu;
function bp(t) {
  return t.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
dn.escape = bp;
function mp(t) {
  return Vu(t).replace(/-/g, "+").replace(/_/g, "/");
}
dn.unescape = mp;
function c1(t) {
  return bp((0, wp.fromByteArray)(new TextEncoder().encode(t)));
}
dn.encode = c1;
function l1(t) {
  return new TextDecoder().decode((0, wp.toByteArray)(Vu(mp(t))));
}
dn.decode = l1;
var vc = {}, kc = {}, xp = {}, Sp = {}, $c = {};
Object.defineProperty($c, "__esModule", { value: !0 });
$c.crypto = void 0;
$c.crypto = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
(function(t) {
  /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
  Object.defineProperty(t, "__esModule", { value: !0 }), t.wrapXOFConstructorWithOpts = t.wrapConstructorWithOpts = t.wrapConstructor = t.Hash = t.nextTick = t.swap32IfBE = t.byteSwapIfBE = t.swap8IfBE = t.isLE = void 0, t.isBytes = n, t.anumber = r, t.abytes = s, t.ahash = i, t.aexists = o, t.aoutput = a, t.u8 = c, t.u32 = u, t.clean = f, t.createView = l, t.rotr = w, t.rotl = p, t.byteSwap = m, t.byteSwap32 = S, t.bytesToHex = z, t.hexToBytes = N, t.asyncLoop = et, t.utf8ToBytes = G, t.bytesToUtf8 = V, t.toBytes = $, t.kdfInputToBytes = P, t.concatBytes = b, t.checkOpts = C, t.createHasher = T, t.createOptHasher = it, t.createXOFer = W, t.randomBytes = Et;
  const e = $c;
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
    const ot = U.outputLen;
    if (k.length < ot)
      throw new Error("digestInto() expects output buffer of length at least " + ot);
  }
  function c(k) {
    return new Uint8Array(k.buffer, k.byteOffset, k.byteLength);
  }
  function u(k) {
    return new Uint32Array(k.buffer, k.byteOffset, Math.floor(k.byteLength / 4));
  }
  function f(...k) {
    for (let U = 0; U < k.length; U++)
      k[U].fill(0);
  }
  function l(k) {
    return new DataView(k.buffer, k.byteOffset, k.byteLength);
  }
  function w(k, U) {
    return k << 32 - U | k >>> U;
  }
  function p(k, U) {
    return k << U | k >>> 32 - U >>> 0;
  }
  t.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  function m(k) {
    return k << 24 & 4278190080 | k << 8 & 16711680 | k >>> 8 & 65280 | k >>> 24 & 255;
  }
  t.swap8IfBE = t.isLE ? (k) => k : (k) => m(k), t.byteSwapIfBE = t.swap8IfBE;
  function S(k) {
    for (let U = 0; U < k.length; U++)
      k[U] = m(k[U]);
    return k;
  }
  t.swap32IfBE = t.isLE ? (k) => k : S;
  const M = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", R = /* @__PURE__ */ Array.from({ length: 256 }, (k, U) => U.toString(16).padStart(2, "0"));
  function z(k) {
    if (s(k), M)
      return k.toHex();
    let U = "";
    for (let ot = 0; ot < k.length; ot++)
      U += R[k[ot]];
    return U;
  }
  const E = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function _(k) {
    if (k >= E._0 && k <= E._9)
      return k - E._0;
    if (k >= E.A && k <= E.F)
      return k - (E.A - 10);
    if (k >= E.a && k <= E.f)
      return k - (E.a - 10);
  }
  function N(k) {
    if (typeof k != "string")
      throw new Error("hex string expected, got " + typeof k);
    if (M)
      return Uint8Array.fromHex(k);
    const U = k.length, ot = U / 2;
    if (U % 2)
      throw new Error("hex string expected, got unpadded hex of length " + U);
    const I = new Uint8Array(ot);
    for (let X = 0, wt = 0; X < ot; X++, wt += 2) {
      const oe = _(k.charCodeAt(wt)), At = _(k.charCodeAt(wt + 1));
      if (oe === void 0 || At === void 0) {
        const jt = k[wt] + k[wt + 1];
        throw new Error('hex string expected, got non-hex character "' + jt + '" at index ' + wt);
      }
      I[X] = oe * 16 + At;
    }
    return I;
  }
  const J = async () => {
  };
  t.nextTick = J;
  async function et(k, U, ot) {
    let I = Date.now();
    for (let X = 0; X < k; X++) {
      ot(X);
      const wt = Date.now() - I;
      wt >= 0 && wt < U || (await (0, t.nextTick)(), I += wt);
    }
  }
  function G(k) {
    if (typeof k != "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(k));
  }
  function V(k) {
    return new TextDecoder().decode(k);
  }
  function $(k) {
    return typeof k == "string" && (k = G(k)), s(k), k;
  }
  function P(k) {
    return typeof k == "string" && (k = G(k)), s(k), k;
  }
  function b(...k) {
    let U = 0;
    for (let I = 0; I < k.length; I++) {
      const X = k[I];
      s(X), U += X.length;
    }
    const ot = new Uint8Array(U);
    for (let I = 0, X = 0; I < k.length; I++) {
      const wt = k[I];
      ot.set(wt, X), X += wt.length;
    }
    return ot;
  }
  function C(k, U) {
    if (U !== void 0 && {}.toString.call(U) !== "[object Object]")
      throw new Error("options should be object or undefined");
    return Object.assign(k, U);
  }
  class O {
  }
  t.Hash = O;
  function T(k) {
    const U = (I) => k().update($(I)).digest(), ot = k();
    return U.outputLen = ot.outputLen, U.blockLen = ot.blockLen, U.create = () => k(), U;
  }
  function it(k) {
    const U = (I, X) => k(X).update($(I)).digest(), ot = k({});
    return U.outputLen = ot.outputLen, U.blockLen = ot.blockLen, U.create = (I) => k(I), U;
  }
  function W(k) {
    const U = (I, X) => k(X).update($(I)).digest(), ot = k({});
    return U.outputLen = ot.outputLen, U.blockLen = ot.blockLen, U.create = (I) => k(I), U;
  }
  t.wrapConstructor = T, t.wrapConstructorWithOpts = it, t.wrapXOFConstructorWithOpts = W;
  function Et(k = 32) {
    if (e.crypto && typeof e.crypto.getRandomValues == "function")
      return e.crypto.getRandomValues(new Uint8Array(k));
    if (e.crypto && typeof e.crypto.randomBytes == "function")
      return Uint8Array.from(e.crypto.randomBytes(k));
    throw new Error("crypto.getRandomValues must be defined");
  }
})(Sp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.hmac = t.HMAC = void 0;
  const e = Sp;
  class n extends e.Hash {
    constructor(i, o) {
      super(), this.finished = !1, this.destroyed = !1, (0, e.ahash)(i);
      const a = (0, e.toBytes)(o);
      if (this.iHash = i.create(), typeof this.iHash.update != "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
      const c = this.blockLen, u = new Uint8Array(c);
      u.set(a.length > c ? i.create().update(a).digest() : a);
      for (let f = 0; f < u.length; f++)
        u[f] ^= 54;
      this.iHash.update(u), this.oHash = i.create();
      for (let f = 0; f < u.length; f++)
        u[f] ^= 106;
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
      const { oHash: o, iHash: a, finished: c, destroyed: u, blockLen: f, outputLen: l } = this;
      return i = i, i.finished = c, i.destroyed = u, i.blockLen = f, i.outputLen = l, i.oHash = o._cloneInto(i.oHash), i.iHash = a._cloneInto(i.iHash), i;
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
})(xp);
const ki = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function Ep(t) {
  return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Pl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error("positive integer expected, got " + t);
}
function pi(t, ...e) {
  if (!Ep(t))
    throw new Error("Uint8Array expected");
  if (e.length > 0 && !e.includes(t.length))
    throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function u1(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  Pl(t.outputLen), Pl(t.blockLen);
}
function _l(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function Ap(t, e) {
  pi(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error("digestInto() expects output buffer of length at least " + n);
}
function f1(t) {
  return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
}
function d1(t) {
  return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Wa(...t) {
  for (let e = 0; e < t.length; e++)
    t[e].fill(0);
}
function Pa(t) {
  return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function Yn(t, e) {
  return t << 32 - e | t >>> e;
}
function h1(t, e) {
  return t << e | t >>> 32 - e >>> 0;
}
const qu = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Wu(t) {
  return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
const vp = qu ? (t) => t : (t) => Wu(t), p1 = vp;
function kp(t) {
  for (let e = 0; e < t.length; e++)
    t[e] = Wu(t[e]);
  return t;
}
const g1 = qu ? (t) => t : kp, $p = /* @ts-ignore */ typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", y1 = /* @__PURE__ */ Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ip(t) {
  if (pi(t), $p)
    return t.toHex();
  let e = "";
  for (let n = 0; n < t.length; n++)
    e += y1[t[n]];
  return e;
}
const Mr = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function pd(t) {
  if (t >= Mr._0 && t <= Mr._9)
    return t - Mr._0;
  if (t >= Mr.A && t <= Mr.F)
    return t - (Mr.A - 10);
  if (t >= Mr.a && t <= Mr.f)
    return t - (Mr.a - 10);
}
function w1(t) {
  if (typeof t != "string")
    throw new Error("hex string expected, got " + typeof t);
  if ($p)
    return Uint8Array.fromHex(t);
  const e = t.length, n = e / 2;
  if (e % 2)
    throw new Error("hex string expected, got unpadded hex of length " + e);
  const r = new Uint8Array(n);
  for (let s = 0, i = 0; s < n; s++, i += 2) {
    const o = pd(t.charCodeAt(i)), a = pd(t.charCodeAt(i + 1));
    if (o === void 0 || a === void 0) {
      const c = t[i] + t[i + 1];
      throw new Error('hex string expected, got non-hex character "' + c + '" at index ' + i);
    }
    r[s] = o * 16 + a;
  }
  return r;
}
const Lp = async () => {
};
async function b1(t, e, n) {
  let r = Date.now();
  for (let s = 0; s < t; s++) {
    n(s);
    const i = Date.now() - r;
    i >= 0 && i < e || (await Lp(), r += i);
  }
}
function Xu(t) {
  if (typeof t != "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(t));
}
function m1(t) {
  return new TextDecoder().decode(t);
}
function qo(t) {
  return typeof t == "string" && (t = Xu(t)), pi(t), t;
}
function x1(t) {
  return typeof t == "string" && (t = Xu(t)), pi(t), t;
}
function S1(...t) {
  let e = 0;
  for (let r = 0; r < t.length; r++) {
    const s = t[r];
    pi(s), e += s.length;
  }
  const n = new Uint8Array(e);
  for (let r = 0, s = 0; r < t.length; r++) {
    const i = t[r];
    n.set(i, s), s += i.length;
  }
  return n;
}
function E1(t, e) {
  if (e !== void 0 && {}.toString.call(e) !== "[object Object]")
    throw new Error("options should be object or undefined");
  return Object.assign(t, e);
}
let Cp = class {
};
function Ic(t) {
  const e = (r) => t().update(qo(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Tp(t) {
  const e = (r, s) => t(s).update(qo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Bp(t) {
  const e = (r, s) => t(s).update(qo(r)).digest(), n = t({});
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
const A1 = Ic, v1 = Tp, k1 = Bp;
function $1(t = 32) {
  if (ki && typeof ki.getRandomValues == "function")
    return ki.getRandomValues(new Uint8Array(t));
  if (ki && typeof ki.randomBytes == "function")
    return Uint8Array.from(ki.randomBytes(t));
  throw new Error("crypto.getRandomValues must be defined");
}
const I1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Hash: Cp,
  abytes: pi,
  aexists: _l,
  ahash: u1,
  anumber: Pl,
  aoutput: Ap,
  asyncLoop: b1,
  byteSwap: Wu,
  byteSwap32: kp,
  byteSwapIfBE: p1,
  bytesToHex: Ip,
  bytesToUtf8: m1,
  checkOpts: E1,
  clean: Wa,
  concatBytes: S1,
  createHasher: Ic,
  createOptHasher: Tp,
  createView: Pa,
  createXOFer: Bp,
  hexToBytes: w1,
  isBytes: Ep,
  isLE: qu,
  kdfInputToBytes: x1,
  nextTick: Lp,
  randomBytes: $1,
  rotl: h1,
  rotr: Yn,
  swap32IfBE: g1,
  swap8IfBE: vp,
  toBytes: qo,
  u32: d1,
  u8: f1,
  utf8ToBytes: Xu,
  wrapConstructor: A1,
  wrapConstructorWithOpts: v1,
  wrapXOFConstructorWithOpts: k1
}, Symbol.toStringTag, { value: "Module" }));
function L1(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
function C1(t, e, n) {
  return t & e ^ ~t & n;
}
function T1(t, e, n) {
  return t & e ^ t & n ^ e & n;
}
class B1 extends Cp {
  constructor(e, n, r, s) {
    super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.buffer = new Uint8Array(e), this.view = Pa(this.buffer);
  }
  update(e) {
    _l(this), e = qo(e), pi(e);
    const { view: n, buffer: r, blockLen: s } = this, i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = Pa(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    _l(this), Ap(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, Wa(this.buffer.subarray(o)), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    L1(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = Pa(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const Qr = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Jr = /* @__PURE__ */ Uint32Array.from([
  3238371032,
  914150663,
  812702999,
  4144912697,
  4290775857,
  1750603025,
  1694076839,
  3204075428
]), M1 = /* @__PURE__ */ Uint32Array.from([
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
]), ts = /* @__PURE__ */ new Uint32Array(64);
let Yu = class extends B1 {
  constructor(e = 32) {
    super(64, e, 8, !1), this.A = Qr[0] | 0, this.B = Qr[1] | 0, this.C = Qr[2] | 0, this.D = Qr[3] | 0, this.E = Qr[4] | 0, this.F = Qr[5] | 0, this.G = Qr[6] | 0, this.H = Qr[7] | 0;
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
      ts[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = ts[l - 15], p = ts[l - 2], m = Yn(w, 7) ^ Yn(w, 18) ^ w >>> 3, S = Yn(p, 17) ^ Yn(p, 19) ^ p >>> 10;
      ts[l] = S + ts[l - 7] + m + ts[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = Yn(a, 6) ^ Yn(a, 11) ^ Yn(a, 25), p = f + w + C1(a, c, u) + M1[l] + ts[l] | 0, S = (Yn(r, 2) ^ Yn(r, 13) ^ Yn(r, 22)) + T1(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    Wa(ts);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), Wa(this.buffer);
  }
}, Mp = class extends Yu {
  constructor() {
    super(28), this.A = Jr[0] | 0, this.B = Jr[1] | 0, this.C = Jr[2] | 0, this.D = Jr[3] | 0, this.E = Jr[4] | 0, this.F = Jr[5] | 0, this.G = Jr[6] | 0, this.H = Jr[7] | 0;
  }
};
const N1 = /* @__PURE__ */ Ic(() => new Yu()), P1 = /* @__PURE__ */ Ic(() => new Mp()), _1 = Yu, Np = N1, U1 = Mp, H1 = P1, O1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SHA224: U1,
  SHA256: _1,
  sha224: H1,
  sha256: Np
}, Symbol.toStringTag, { value: "Module" })), Lc = /* @__PURE__ */ mc(O1), D1 = /* @__PURE__ */ mc(Kb);
var Wi = {};
Object.defineProperty(Wi, "__esModule", { value: !0 });
Wi.joseToDer = Wi.derToJose = void 0;
const Pp = Vo, _p = dn;
function tl(t) {
  return (t / 8 | 0) + (t % 8 === 0 ? 0 : 1);
}
const F1 = {
  ES256: tl(256),
  ES384: tl(384),
  ES512: tl(521)
};
function Up(t) {
  const e = F1[t];
  if (e)
    return e;
  throw new Error(`Unknown algorithm "${t}"`);
}
const Xa = 128, Hp = 0, j1 = 32, z1 = 16, R1 = 2, Op = z1 | j1 | Hp << 6, Ya = R1 | Hp << 6;
function Dp(t) {
  if (t instanceof Uint8Array)
    return t;
  if (typeof t == "string")
    return (0, Pp.toByteArray)((0, _p.pad)(t));
  throw new TypeError("ECDSA signature must be a Base64 string or a Uint8Array");
}
function G1(t, e) {
  const n = Dp(t), r = Up(e), s = r + 1, i = n.length;
  let o = 0;
  if (n[o++] !== Op)
    throw new Error('Could not find expected "seq"');
  let a = n[o++];
  if (a === (Xa | 1) && (a = n[o++]), i - o < a)
    throw new Error(`"seq" specified length of "${a}", only "${i - o}" remaining`);
  if (n[o++] !== Ya)
    throw new Error('Could not find expected "int" for "r"');
  const c = n[o++];
  if (i - o - 2 < c)
    throw new Error(`"r" specified length of "${c}", only "${i - o - 2}" available`);
  if (s < c)
    throw new Error(`"r" specified length of "${c}", max of "${s}" is acceptable`);
  const u = o;
  if (o += c, n[o++] !== Ya)
    throw new Error('Could not find expected "int" for "s"');
  const f = n[o++];
  if (i - o !== f)
    throw new Error(`"s" specified length of "${f}", expected "${i - o}"`);
  if (s < f)
    throw new Error(`"s" specified length of "${f}", max of "${s}" is acceptable`);
  const l = o;
  if (o += f, o !== i)
    throw new Error(`Expected to consume entire array, but "${i - o}" bytes remain`);
  const w = r - c, p = r - f, m = new Uint8Array(w + c + p + f);
  for (o = 0; o < w; ++o)
    m[o] = 0;
  m.set(n.subarray(u + Math.max(-w, 0), u + c), o), o = r;
  for (const S = o; o < S + p; ++o)
    m[o] = 0;
  return m.set(n.subarray(l + Math.max(-p, 0), l + f), o), (0, _p.escape)((0, Pp.fromByteArray)(m));
}
Wi.derToJose = G1;
function gd(t, e, n) {
  let r = 0;
  for (; e + r < n && t[e + r] === 0; )
    ++r;
  return t[e + r] >= Xa && --r, r;
}
function K1(t, e) {
  t = Dp(t);
  const n = Up(e), r = t.length;
  if (r !== n * 2)
    throw new TypeError(`"${e}" signatures must be "${n * 2}" bytes, saw "${r}"`);
  const s = gd(t, 0, n), i = gd(t, n, t.length), o = n - s, a = n - i, c = 2 + o + 1 + 1 + a, u = c < Xa, f = new Uint8Array((u ? 2 : 3) + c);
  let l = 0;
  return f[l++] = Op, u ? f[l++] = c : (f[l++] = Xa | 1, f[l++] = c & 255), f[l++] = Ya, f[l++] = o, s < 0 ? (f[l++] = 0, f.set(t.subarray(0, n), l), l += n) : (f.set(t.subarray(s, n), l), l += n - s), f[l++] = Ya, f[l++] = a, i < 0 ? (f[l++] = 0, f.set(t.subarray(n), l)) : f.set(t.subarray(n + i), l), f;
}
Wi.joseToDer = K1;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.InvalidTokenError = jr.MissingParametersError = void 0;
class V1 extends Error {
  constructor(e) {
    super(), this.name = "MissingParametersError", this.message = e || "";
  }
}
jr.MissingParametersError = V1;
class q1 extends Error {
  constructor(e) {
    super(), this.name = "InvalidTokenError", this.message = e || "";
  }
}
jr.InvalidTokenError = q1;
const Wo = /* @__PURE__ */ mc(I1);
Object.defineProperty(kc, "__esModule", { value: !0 });
kc.SECP256K1Client = void 0;
const W1 = xp, X1 = Lc, _a = D1, yd = Wi, wd = jr, bd = Wo;
_a.utils.hmacSha256Sync = (t, ...e) => {
  const n = W1.hmac.create(X1.sha256, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
class Fp {
  static derivePublicKey(e, n = !0) {
    return e.length === 66 && (e = e.slice(0, 64)), e.length < 64 && (e = e.padStart(64, "0")), (0, bd.bytesToHex)(_a.getPublicKey(e, n));
  }
  static signHash(e, n, r = "jose") {
    if (!e || !n)
      throw new wd.MissingParametersError("a signing input hash and private key are all required");
    const s = _a.signSync(e, n.slice(0, 64), {
      der: !0,
      canonical: !1
    });
    if (r === "der")
      return (0, bd.bytesToHex)(s);
    if (r === "jose")
      return (0, yd.derToJose)(s, "ES256");
    throw Error("Invalid signature format");
  }
  static loadSignature(e) {
    return (0, yd.joseToDer)(e, "ES256");
  }
  static verifyHash(e, n, r) {
    if (!e || !n || !r)
      throw new wd.MissingParametersError("a signing input hash, der signature, and public key are all required");
    return _a.verify(n, e, r, { strict: !1 });
  }
}
kc.SECP256K1Client = Fp;
Fp.algorithmName = "ES256K";
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.cryptoClients = t.SECP256K1Client = void 0;
  const e = kc;
  Object.defineProperty(t, "SECP256K1Client", { enumerable: !0, get: function() {
    return e.SECP256K1Client;
  } });
  const n = {
    ES256K: e.SECP256K1Client
  };
  t.cryptoClients = n;
})(vc);
var Qs = {};
const Y1 = /* @__PURE__ */ mc(K0);
var Z1 = pn && pn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        u(r.next(f));
      } catch (l) {
        o(l);
      }
    }
    function c(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        o(l);
      }
    }
    function u(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(Qs, "__esModule", { value: !0 });
Qs.hashSha256Async = Qs.hashSha256 = void 0;
const Q1 = Lc;
function jp(t) {
  return (0, Q1.sha256)(t);
}
Qs.hashSha256 = jp;
function J1(t) {
  return Z1(this, void 0, void 0, function* () {
    try {
      if (typeof crypto < "u" && typeof crypto.subtle < "u") {
        const n = typeof t == "string" ? new TextEncoder().encode(t) : t, r = yield crypto.subtle.digest("SHA-256", n);
        return new Uint8Array(r);
      } else {
        const n = Y1;
        if (!n.createHash)
          throw new Error("`crypto` module does not contain `createHash`");
        return Promise.resolve(n.createHash("sha256").update(t).digest());
      }
    } catch (e) {
      return console.log(e), console.log('Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.'), Promise.resolve(jp(t));
    }
  });
}
Qs.hashSha256Async = J1;
var t2 = pn && pn.__awaiter || function(t, e, n, r) {
  function s(i) {
    return i instanceof n ? i : new n(function(o) {
      o(i);
    });
  }
  return new (n || (n = Promise))(function(i, o) {
    function a(f) {
      try {
        u(r.next(f));
      } catch (l) {
        o(l);
      }
    }
    function c(f) {
      try {
        u(r.throw(f));
      } catch (l) {
        o(l);
      }
    }
    function u(f) {
      f.done ? i(f.value) : s(f.value).then(a, c);
    }
    u((r = r.apply(t, e || [])).next());
  });
};
Object.defineProperty(qi, "__esModule", { value: !0 });
qi.TokenSigner = qi.createUnsecuredToken = void 0;
const Ul = dn, md = vc, e2 = jr, xd = Qs;
function Hl(t, e) {
  const n = [], r = Ul.encode(JSON.stringify(e));
  n.push(r);
  const s = Ul.encode(JSON.stringify(t));
  return n.push(s), n.join(".");
}
function n2(t) {
  return Hl(t, { typ: "JWT", alg: "none" }) + ".";
}
qi.createUnsecuredToken = n2;
class r2 {
  constructor(e, n) {
    if (!(e && n))
      throw new e2.MissingParametersError("a signing algorithm and private key are required");
    if (typeof e != "string")
      throw new Error("signing algorithm parameter must be a string");
    if (e = e.toUpperCase(), !md.cryptoClients.hasOwnProperty(e))
      throw new Error("invalid signing algorithm");
    this.tokenType = "JWT", this.cryptoClient = md.cryptoClients[e], this.rawPrivateKey = n;
  }
  header(e = {}) {
    const n = { typ: this.tokenType, alg: this.cryptoClient.algorithmName };
    return Object.assign({}, n, e);
  }
  sign(e, n = !1, r = {}) {
    const s = this.header(r), i = Hl(e, s), o = (0, xd.hashSha256)(i);
    return this.createWithSignedHash(e, n, s, i, o);
  }
  signAsync(e, n = !1, r = {}) {
    return t2(this, void 0, void 0, function* () {
      const s = this.header(r), i = Hl(e, s), o = yield (0, xd.hashSha256Async)(i);
      return this.createWithSignedHash(e, n, s, i, o);
    });
  }
  createWithSignedHash(e, n, r, s, i) {
    const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
    return n ? {
      header: [Ul.encode(JSON.stringify(r))],
      payload: JSON.stringify(e),
      signature: [o]
    } : [s, o].join(".");
  }
}
qi.TokenSigner = r2;
var Cc = {};
Object.defineProperty(Cc, "__esModule", { value: !0 });
Cc.TokenVerifier = void 0;
const s2 = dn, Sd = vc, i2 = jr, la = Qs;
class o2 {
  constructor(e, n) {
    if (!(e && n))
      throw new i2.MissingParametersError("a signing algorithm and public key are required");
    if (typeof e != "string")
      throw "signing algorithm parameter must be a string";
    if (e = e.toUpperCase(), !Sd.cryptoClients.hasOwnProperty(e))
      throw "invalid signing algorithm";
    this.tokenType = "JWT", this.cryptoClient = Sd.cryptoClients[e], this.rawPublicKey = n;
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
      return (0, la.hashSha256Async)(s).then((o) => i(o));
    {
      const o = (0, la.hashSha256)(s);
      return i(o);
    }
  }
  verifyExpanded(e, n) {
    const r = [e.header.join("."), s2.encode(e.payload)].join(".");
    let s = !0;
    const i = (o) => (e.signature.map((a) => {
      const c = this.cryptoClient.loadSignature(a);
      this.cryptoClient.verifyHash(o, c, this.rawPublicKey) || (s = !1);
    }), s);
    if (n)
      return (0, la.hashSha256Async)(r).then((o) => i(o));
    {
      const o = (0, la.hashSha256)(r);
      return i(o);
    }
  }
}
Cc.TokenVerifier = o2;
var Tc = {};
Object.defineProperty(Tc, "__esModule", { value: !0 });
Tc.decodeToken = void 0;
const ua = dn;
function a2(t) {
  if (typeof t == "string") {
    const e = t.split("."), n = JSON.parse(ua.decode(e[0])), r = JSON.parse(ua.decode(e[1])), s = e[2];
    return {
      header: n,
      payload: r,
      signature: s
    };
  } else if (typeof t == "object") {
    if (typeof t.payload != "string")
      throw new Error("Expected token payload to be a base64 or json string");
    let e = t.payload;
    t.payload[0] !== "{" && (e = ua.decode(e));
    const n = [];
    return t.header.map((r) => {
      const s = JSON.parse(ua.decode(r));
      n.push(s);
    }), {
      header: n,
      payload: JSON.parse(e),
      signature: t.signature
    };
  }
}
Tc.decodeToken = a2;
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
  Object.defineProperty(t, "__esModule", { value: !0 }), n(qi, t), n(Cc, t), n(Tc, t), n(jr, t), n(vc, t);
})(Je);
function c2(t) {
  return `did:btc-addr:${t}`;
}
function l2(t) {
  const e = t.split(":");
  if (e.length !== 3)
    throw new td("Decentralized IDs must have 3 parts");
  if (e[0].toLowerCase() !== "did")
    throw new td('Decentralized IDs must start with "did"');
  return e[1].toLowerCase();
}
function zp(t) {
  if (t)
    return l2(t) === "btc-addr" ? t.split(":")[2] : void 0;
}
const u2 = "1.4.0";
function f2() {
  return Ym();
}
function d2(t, e, n, r = _0.slice(), s, i = qw().getTime(), o = {}) {
  const a = (p) => {
    const m = _u("location", {
      throwIfUnavailable: !0,
      usageDesc: `makeAuthRequest([${p}=undefined])`
    });
    return m == null ? void 0 : m.origin;
  };
  e || (e = `${a("redirectURI")}/`), n || (n = `${a("manifestURI")}/manifest.json`), s || (s = a("appDomain"));
  const c = Object.assign({}, o, {
    jti: Xw(),
    iat: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3),
    exp: Math.floor(i / 1e3),
    iss: null,
    public_keys: [],
    domain_name: s,
    manifest_uri: n,
    redirect_uri: e,
    version: u2,
    do_not_include_profile: !0,
    supports_hub_url: !0,
    scopes: r
  }), u = Je.SECP256K1Client.derivePublicKey(t);
  c.public_keys = [u];
  const f = dp(u);
  return c.iss = c2(f), new Je.TokenSigner("ES256k", t).sign(c);
}
async function Ed(t, e) {
  const n = Go(Gt(e)), r = JSON.parse(n), s = await yp(t, r);
  if (typeof s != "string")
    throw new Error("Unable to correctly decrypt private key");
  return s;
}
function h2(t) {
  const e = Je.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys;
  if (n.length === 1) {
    const r = n[0];
    try {
      return new Je.TokenVerifier("ES256k", r).verify(t);
    } catch {
      return !1;
    }
  } else
    throw new Error("Multiple public keys are not supported");
}
function p2(t) {
  const e = Je.decodeToken(t).payload;
  if (typeof e == "string")
    throw new Error("Unexpected token payload type of string");
  const n = e.public_keys, r = zp(e.iss);
  if (n.length === 1) {
    if (dp(n[0]) === r)
      return !0;
  } else
    throw new Error("Multiple public keys are not supported");
  return !1;
}
function g2(t) {
  const e = Je.decodeToken(t).payload;
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
function y2(t) {
  const e = Je.decodeToken(t).payload;
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
function w2(t) {
  const e = [
    y2(t),
    g2(t),
    h2(t),
    p2(t)
  ];
  return Promise.resolve(e.every((n) => n));
}
const Ad = "1.0.0";
class As {
  constructor(e) {
    this.version = Ad, this.userData = e.userData, this.transitKey = e.transitKey, this.etags = e.etags ? e.etags : {};
  }
  static fromJSON(e) {
    if (e.version !== Ad)
      throw new Ll(`JSON data version ${e.version} not supported by SessionData`);
    const n = {
      coreNode: e.coreNode,
      userData: e.userData,
      transitKey: e.transitKey,
      etags: e.etags
    };
    return new As(n);
  }
  toString() {
    return JSON.stringify(this);
  }
}
class Rp {
  constructor(e) {
    if (e) {
      const n = new As(e);
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
class vd extends Rp {
  constructor(e) {
    super(e), this.sessionData || this.setSessionData(new As({}));
  }
  getSessionData() {
    if (!this.sessionData)
      throw new U0("No session data was found.");
    return this.sessionData;
  }
  setSessionData(e) {
    return this.sessionData = e, !0;
  }
  deleteSessionData() {
    return this.setSessionData(new As({})), !0;
  }
}
class kd extends Rp {
  constructor(e) {
    if (super(e), e && e.storeOptions && e.storeOptions.localStorageKey && typeof e.storeOptions.localStorageKey == "string" ? this.key = e.storeOptions.localStorageKey : this.key = Gw, !localStorage.getItem(this.key)) {
      const r = new As({});
      this.setSessionData(r);
    }
  }
  getSessionData() {
    const e = localStorage.getItem(this.key);
    if (!e)
      throw new U0("No session data was found in localStorage");
    const n = JSON.parse(e);
    return As.fromJSON(n);
  }
  setSessionData(e) {
    return localStorage.setItem(this.key, e.toString()), !0;
  }
  deleteSessionData() {
    return localStorage.removeItem(this.key), this.setSessionData(new As({})), !0;
  }
}
var Mo;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(Mo || (Mo = {}));
var Za;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Za || (Za = {}));
Mo.Mainnet;
var Or;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Or || (Or = {}));
var br;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(br || (br = {}));
Or.Mainnet;
const Gp = {
  chainId: Mo.Mainnet,
  transactionVersion: Or.Mainnet,
  peerNetworkId: Za.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: br.MainnetSingleSig,
    multiSig: br.MainnetMultiSig
  },
  client: { baseUrl: H0 }
}, Ol = {
  chainId: Mo.Testnet,
  transactionVersion: Or.Testnet,
  peerNetworkId: Za.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: br.TestnetSingleSig,
    multiSig: br.TestnetMultiSig
  },
  client: { baseUrl: O0 }
}, Ua = {
  ...Ol,
  addressVersion: { ...Ol.addressVersion },
  magicBytes: "id",
  client: { baseUrl: D0 }
}, b2 = {
  ...Ua,
  addressVersion: { ...Ua.addressVersion },
  client: { ...Ua.client }
};
function m2(t) {
  switch (t) {
    case "mainnet":
      return Gp;
    case "testnet":
      return Ol;
    case "devnet":
      return Ua;
    case "mocknet":
      return b2;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Kp(t) {
  return typeof t == "string" ? m2(t) : t;
}
var $d;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})($d || ($d = {}));
var Id;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(Id || (Id = {}));
var Zn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Zn || (Zn = {}));
const el = ["onChainOnly", "offChainOnly", "any"];
el[0] + "", Zn.OnChainOnly, el[1] + "", Zn.OffChainOnly, el[2] + "", Zn.Any, Zn.OnChainOnly + "", Zn.OnChainOnly, Zn.OffChainOnly + "", Zn.OffChainOnly, Zn.Any + "", Zn.Any;
var Ld;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(Ld || (Ld = {}));
var Cd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(Cd || (Cd = {}));
var Td;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Td || (Td = {}));
var Hr;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(Hr || (Hr = {}));
var Bd;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(Bd || (Bd = {}));
var Md;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Md || (Md = {}));
var Nd;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Nd || (Nd = {}));
var Pd;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Pd || (Pd = {}));
var _d;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(_d || (_d = {}));
var Ud;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Ud || (Ud = {}));
var Hd;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Hd || (Hd = {}));
var Od;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Od || (Od = {}));
var Dd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Dd || (Dd = {}));
function Dl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function x2(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Vp(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function S2(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Dl(t.outputLen), Dl(t.blockLen);
}
function E2(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function A2(t, e) {
  Vp(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const Ds = {
  number: Dl,
  bool: x2,
  bytes: Vp,
  hash: S2,
  exists: E2,
  output: A2
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const nl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), ur = (t, e) => t << 32 - e | t >>> e, v2 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!v2)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function k2(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Zu(t) {
  if (typeof t == "string" && (t = k2(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let qp = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function gi(t) {
  const e = (r) => t().update(Zu(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let Wp = class extends qp {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, Ds.hash(e);
    const r = Zu(n);
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
    return Ds.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    Ds.exists(this), Ds.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const Xp = (t, e, n) => new Wp(t, e).update(n).digest();
Xp.create = (t, e) => new Wp(t, e);
function $2(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Qu = class extends qp {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = nl(this.buffer);
  }
  update(e) {
    Ds.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Zu(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = nl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    Ds.exists(this), Ds.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    $2(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = nl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const I2 = (t, e, n) => t & e ^ ~t & n, L2 = (t, e, n) => t & e ^ t & n ^ e & n, C2 = new Uint32Array([
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
let Yp = class extends Qu {
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
      const w = ns[l - 15], p = ns[l - 2], m = ur(w, 7) ^ ur(w, 18) ^ w >>> 3, S = ur(p, 17) ^ ur(p, 19) ^ p >>> 10;
      ns[l] = S + ns[l - 7] + m + ns[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = ur(a, 6) ^ ur(a, 11) ^ ur(a, 25), p = f + w + I2(a, c, u) + C2[l] + ns[l] | 0, S = (ur(r, 2) ^ ur(r, 13) ^ ur(r, 22)) + L2(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    ns.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, T2 = class extends Yp {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const Zp = gi(() => new Yp());
gi(() => new T2());
var yi = {}, Ju = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32decode = t.c32normalize = t.c32encode = t.c32 = void 0;
  const e = Wo;
  t.c32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const n = "0123456789abcdef";
  function r(o, a) {
    if (!o.match(/^[0-9a-fA-F]*$/))
      throw new Error("Not a hex-encoded string");
    o.length % 2 !== 0 && (o = `0${o}`), o = o.toLowerCase();
    let c = [], u = 0;
    for (let p = o.length - 1; p >= 0; p--)
      if (u < 4) {
        const m = n.indexOf(o[p]) >> u;
        let S = 0;
        p !== 0 && (S = n.indexOf(o[p - 1]));
        const M = 1 + u, R = S % (1 << M) << 5 - M, z = t.c32[m + R];
        u = M, c.unshift(z);
      } else
        u = 0;
    let f = 0;
    for (let p = 0; p < c.length && c[p] === "0"; p++)
      f++;
    c = c.slice(f);
    const l = new TextDecoder().decode((0, e.hexToBytes)(o)).match(/^\u0000*/), w = l ? l[0].length : 0;
    for (let p = 0; p < w; p++)
      c.unshift(t.c32[0]);
    if (a) {
      const p = a - c.length;
      for (let m = 0; m < p; m++)
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
    let f = [], l = 0, w = 0;
    for (let S = o.length - 1; S >= 0; S--) {
      w === 4 && (f.unshift(n[l]), w = 0, l = 0);
      const R = (t.c32.indexOf(o[S]) << w) + l, z = n[R % 16];
      if (w += 1, l = R >> 4, l > 1 << w)
        throw new Error("Panic error in decoding.");
      f.unshift(z);
    }
    f.unshift(n[l]), f.length % 2 === 1 && f.unshift("0");
    let p = 0;
    for (let S = 0; S < f.length && f[S] === "0"; S++)
      p++;
    f = f.slice(p - p % 2);
    let m = f.join("");
    for (let S = 0; S < u; S++)
      m = `00${m}`;
    if (a) {
      const S = a * 2 - m.length;
      for (let M = 0; M < S; M += 2)
        m = `00${m}`;
    }
    return m;
  }
  t.c32decode = i;
})(Ju);
var Js = {};
Object.defineProperty(Js, "__esModule", { value: !0 });
Js.c32checkDecode = Js.c32checkEncode = void 0;
const Fd = Lc, jd = Wo, Io = Ju;
function Qp(t) {
  const e = (0, Fd.sha256)((0, Fd.sha256)((0, jd.hexToBytes)(t)));
  return (0, jd.bytesToHex)(e.slice(0, 4));
}
function B2(t, e) {
  if (t < 0 || t >= 32)
    throw new Error("Invalid version (must be between 0 and 31)");
  if (!e.match(/^[0-9a-fA-F]*$/))
    throw new Error("Invalid data (not a hex string)");
  e = e.toLowerCase(), e.length % 2 !== 0 && (e = `0${e}`);
  let n = t.toString(16);
  n.length === 1 && (n = `0${n}`);
  const r = Qp(`${n}${e}`), s = (0, Io.c32encode)(`${e}${r}`);
  return `${Io.c32[t]}${s}`;
}
Js.c32checkEncode = B2;
function M2(t) {
  t = (0, Io.c32normalize)(t);
  const e = (0, Io.c32decode)(t.slice(1)), n = t[0], r = Io.c32.indexOf(n), s = e.slice(-8);
  let i = r.toString(16);
  if (i.length === 1 && (i = `0${i}`), Qp(`${i}${e.substring(0, e.length - 8)}`) !== s)
    throw new Error("Invalid c32check string: checksum mismatch");
  return [r, e.substring(0, e.length - 8)];
}
Js.c32checkDecode = M2;
var Jp = {}, Xi = {};
Object.defineProperty(Xi, "__esModule", { value: !0 });
Xi.decode = Xi.encode = void 0;
const Qa = Lc, zd = Wo, tg = ap, eg = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function N2(t, e = "00") {
  const n = typeof t == "string" ? (0, zd.hexToBytes)(t) : t, r = typeof e == "string" ? (0, zd.hexToBytes)(e) : t;
  if (!(n instanceof Uint8Array) || !(r instanceof Uint8Array))
    throw new TypeError("Argument must be of type Uint8Array or string");
  const s = (0, Qa.sha256)((0, Qa.sha256)(new Uint8Array([...r, ...n])));
  return tg(eg).encode([...r, ...n, ...s.slice(0, 4)]);
}
Xi.encode = N2;
function P2(t) {
  const e = tg(eg).decode(t), n = e.slice(0, 1), r = e.slice(1, -4), s = (0, Qa.sha256)((0, Qa.sha256)(new Uint8Array([...n, ...r])));
  return e.slice(-4).forEach((i, o) => {
    if (i !== s[o])
      throw new Error("Invalid checksum");
  }), { prefix: n, data: r };
}
Xi.decode = P2;
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.c32ToB58 = t.b58ToC32 = t.c32addressDecode = t.c32address = t.versions = void 0;
  const e = Js, n = Xi, r = Wo;
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
  function o(f, l) {
    if (!l.match(/^[0-9a-fA-F]{40}$/))
      throw new Error("Invalid argument: not a hash160 hex string");
    return `S${(0, e.c32checkEncode)(f, l)}`;
  }
  t.c32address = o;
  function a(f) {
    if (f.length <= 5)
      throw new Error("Invalid c32 address: invalid length");
    if (f[0] != "S")
      throw new Error('Invalid c32 address: must start with "S"');
    return (0, e.c32checkDecode)(f.slice(1));
  }
  t.c32addressDecode = a;
  function c(f, l = -1) {
    const w = n.decode(f), p = (0, r.bytesToHex)(w.data), m = parseInt((0, r.bytesToHex)(w.prefix), 16);
    let S;
    return l < 0 ? (S = m, s[m] !== void 0 && (S = s[m])) : S = l, o(S, p);
  }
  t.b58ToC32 = c;
  function u(f, l = -1) {
    const w = a(f), p = w[0], m = w[1];
    let S;
    l < 0 ? (S = p, i[p] !== void 0 && (S = i[p])) : S = l;
    let M = S.toString(16);
    return M.length === 1 && (M = `0${M}`), n.encode(m, M);
  }
  t.c32ToB58 = u;
})(Jp);
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.b58ToC32 = t.c32ToB58 = t.versions = t.c32normalize = t.c32addressDecode = t.c32address = t.c32checkDecode = t.c32checkEncode = t.c32decode = t.c32encode = void 0;
  const e = Ju;
  Object.defineProperty(t, "c32encode", { enumerable: !0, get: function() {
    return e.c32encode;
  } }), Object.defineProperty(t, "c32decode", { enumerable: !0, get: function() {
    return e.c32decode;
  } }), Object.defineProperty(t, "c32normalize", { enumerable: !0, get: function() {
    return e.c32normalize;
  } });
  const n = Js;
  Object.defineProperty(t, "c32checkEncode", { enumerable: !0, get: function() {
    return n.c32checkEncode;
  } }), Object.defineProperty(t, "c32checkDecode", { enumerable: !0, get: function() {
    return n.c32checkDecode;
  } });
  const r = Jp;
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
})(yi);
function _2(t, e) {
  switch (e = Kp(e ?? Gp), t) {
    case Hr.P2PKH:
      switch (e.transactionVersion) {
        case Or.Mainnet:
          return br.MainnetSingleSig;
        case Or.Testnet:
          return br.TestnetSingleSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    case Hr.P2SH:
    case Hr.P2SHNonSequential:
    case Hr.P2WPKH:
    case Hr.P2WSH:
    case Hr.P2WSHNonSequential:
      switch (e.transactionVersion) {
        case Or.Mainnet:
          return br.MainnetMultiSig;
        case Or.Testnet:
          return br.TestnetMultiSig;
        default:
          throw new Error(`Unexpected transactionVersion ${e.transactionVersion} for hashMode ${t}`);
      }
    default:
      throw new Error(`Unexpected hashMode ${t}`);
  }
}
const U2 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), ng = Uint8Array.from({ length: 16 }, (t, e) => e), H2 = ng.map((t) => (9 * t + 5) % 16);
let tf = [ng], ef = [H2];
for (let t = 0; t < 4; t++)
  for (let e of [tf, ef])
    e.push(e[t].map((n) => U2[n]));
const rg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), O2 = tf.map((t, e) => t.map((n) => rg[e][n])), D2 = ef.map((t, e) => t.map((n) => rg[e][n])), F2 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j2 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), fa = (t, e) => t << e | t >>> 32 - e;
function Rd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const da = new Uint32Array(16);
let z2 = class extends Qu {
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
      da[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, S = F2[p], M = j2[p], R = tf[p], z = ef[p], E = O2[p], _ = D2[p];
      for (let N = 0; N < 16; N++) {
        const J = fa(r + Rd(p, i, a, u) + da[R[N]] + S, E[N]) + l | 0;
        r = l, l = u, u = fa(a, 10) | 0, a = i, i = J;
      }
      for (let N = 0; N < 16; N++) {
        const J = fa(s + Rd(m, o, c, f) + da[z[N]] + M, _[N]) + w | 0;
        s = w, w = f, f = fa(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    da.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const R2 = gi(() => new z2()), ha = BigInt(2 ** 32 - 1), Fl = BigInt(32);
function sg(t, e = !1) {
  return e ? { h: Number(t & ha), l: Number(t >> Fl & ha) } : { h: Number(t >> Fl & ha) | 0, l: Number(t & ha) | 0 };
}
function G2(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = sg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const K2 = (t, e) => BigInt(t >>> 0) << Fl | BigInt(e >>> 0), V2 = (t, e, n) => t >>> n, q2 = (t, e, n) => t << 32 - n | e >>> n, W2 = (t, e, n) => t >>> n | e << 32 - n, X2 = (t, e, n) => t << 32 - n | e >>> n, Y2 = (t, e, n) => t << 64 - n | e >>> n - 32, Z2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Q2 = (t, e) => e, J2 = (t, e) => t, tx = (t, e, n) => t << n | e >>> 32 - n, ex = (t, e, n) => e << n | t >>> 32 - n, nx = (t, e, n) => e << n - 32 | t >>> 64 - n, rx = (t, e, n) => t << n - 32 | e >>> 64 - n;
function sx(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const ix = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), ox = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, ax = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), cx = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, lx = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), ux = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Bt = {
  fromBig: sg,
  split: G2,
  toBig: K2,
  shrSH: V2,
  shrSL: q2,
  rotrSH: W2,
  rotrSL: X2,
  rotrBH: Y2,
  rotrBL: Z2,
  rotr32H: Q2,
  rotr32L: J2,
  rotlSH: tx,
  rotlSL: ex,
  rotlBH: nx,
  rotlBL: rx,
  add: sx,
  add3L: ix,
  add3H: ox,
  add4L: ax,
  add4H: cx,
  add5H: ux,
  add5L: lx
}, [fx, dx] = Bt.split([
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
let Bc = class extends Qu {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: m, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      rs[E] = e.getUint32(n), ss[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = rs[E - 15] | 0, N = ss[E - 15] | 0, J = Bt.rotrSH(_, N, 1) ^ Bt.rotrSH(_, N, 8) ^ Bt.shrSH(_, N, 7), et = Bt.rotrSL(_, N, 1) ^ Bt.rotrSL(_, N, 8) ^ Bt.shrSL(_, N, 7), G = rs[E - 2] | 0, V = ss[E - 2] | 0, $ = Bt.rotrSH(G, V, 19) ^ Bt.rotrBH(G, V, 61) ^ Bt.shrSH(G, V, 6), P = Bt.rotrSL(G, V, 19) ^ Bt.rotrBL(G, V, 61) ^ Bt.shrSL(G, V, 6), b = Bt.add4L(et, P, ss[E - 7], ss[E - 16]), C = Bt.add4H(b, J, $, rs[E - 7], rs[E - 16]);
      rs[E] = C | 0, ss[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: m, Gh: S, Gl: M, Hh: R, Hl: z } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Bt.rotrSH(l, w, 14) ^ Bt.rotrSH(l, w, 18) ^ Bt.rotrBH(l, w, 41), N = Bt.rotrSL(l, w, 14) ^ Bt.rotrSL(l, w, 18) ^ Bt.rotrBL(l, w, 41), J = l & p ^ ~l & S, et = w & m ^ ~w & M, G = Bt.add5L(z, N, et, dx[E], ss[E]), V = Bt.add5H(G, R, _, J, fx[E], rs[E]), $ = G | 0, P = Bt.rotrSH(r, s, 28) ^ Bt.rotrBH(r, s, 34) ^ Bt.rotrBH(r, s, 39), b = Bt.rotrSL(r, s, 28) ^ Bt.rotrBL(r, s, 34) ^ Bt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, O = s & o ^ s & c ^ o & c;
      R = S | 0, z = M | 0, S = p | 0, M = m | 0, p = l | 0, m = w | 0, { h: l, l: w } = Bt.add(u | 0, f | 0, V | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Bt.add3L($, b, O);
      r = Bt.add3H(T, V, P, C), s = T | 0;
    }
    ({ h: r, l: s } = Bt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Bt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Bt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Bt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Bt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: m } = Bt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: S, l: M } = Bt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: R, l: z } = Bt.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, m, S, M, R, z);
  }
  roundClean() {
    rs.fill(0), ss.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, hx = class extends Bc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, px = class extends Bc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, gx = class extends Bc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
gi(() => new Bc());
gi(() => new hx());
gi(() => new px());
gi(() => new gx());
var Ja = { exports: {} };
Ja.exports;
(function(t, e) {
  var n = 200, r = "__lodash_hash_undefined__", s = 9007199254740991, i = "[object Arguments]", o = "[object Array]", a = "[object Boolean]", c = "[object Date]", u = "[object Error]", f = "[object Function]", l = "[object GeneratorFunction]", w = "[object Map]", p = "[object Number]", m = "[object Object]", S = "[object Promise]", M = "[object RegExp]", R = "[object Set]", z = "[object String]", E = "[object Symbol]", _ = "[object WeakMap]", N = "[object ArrayBuffer]", J = "[object DataView]", et = "[object Float32Array]", G = "[object Float64Array]", V = "[object Int8Array]", $ = "[object Int16Array]", P = "[object Int32Array]", b = "[object Uint8Array]", C = "[object Uint8ClampedArray]", O = "[object Uint16Array]", T = "[object Uint32Array]", it = /[\\^$.*+?()[\]{}|]/g, W = /\w*$/, Et = /^\[object .+?Constructor\]$/, k = /^(?:0|[1-9]\d*)$/, U = {};
  U[i] = U[o] = U[N] = U[J] = U[a] = U[c] = U[et] = U[G] = U[V] = U[$] = U[P] = U[w] = U[p] = U[m] = U[M] = U[R] = U[z] = U[E] = U[b] = U[C] = U[O] = U[T] = !0, U[u] = U[f] = U[_] = !1;
  var ot = typeof pn == "object" && pn && pn.Object === Object && pn, I = typeof self == "object" && self && self.Object === Object && self, X = ot || I || Function("return this")(), wt = e && !e.nodeType && e, oe = wt && !0 && t && !t.nodeType && t, At = oe && oe.exports === wt;
  function jt(g, B) {
    return g.set(B[0], B[1]), g;
  }
  function Ot(g, B) {
    return g.add(B), g;
  }
  function Zt(g, B) {
    for (var H = -1, ct = g ? g.length : 0; ++H < ct && B(g[H], H, g) !== !1; )
      ;
    return g;
  }
  function Ft(g, B) {
    for (var H = -1, ct = B.length, $e = g.length; ++H < ct; )
      g[$e + H] = B[H];
    return g;
  }
  function Kt(g, B, H, ct) {
    for (var $e = -1, xn = g ? g.length : 0; ++$e < xn; )
      H = B(H, g[$e], $e, g);
    return H;
  }
  function vt(g, B) {
    for (var H = -1, ct = Array(g); ++H < g; )
      ct[H] = B(H);
    return ct;
  }
  function se(g, B) {
    return g == null ? void 0 : g[B];
  }
  function qe(g) {
    var B = !1;
    if (g != null && typeof g.toString != "function")
      try {
        B = !!(g + "");
      } catch {
      }
    return B;
  }
  function Re(g) {
    var B = -1, H = Array(g.size);
    return g.forEach(function(ct, $e) {
      H[++B] = [$e, ct];
    }), H;
  }
  function Ue(g, B) {
    return function(H) {
      return g(B(H));
    };
  }
  function We(g) {
    var B = -1, H = Array(g.size);
    return g.forEach(function(ct) {
      H[++B] = ct;
    }), H;
  }
  var Se = Array.prototype, Be = Function.prototype, ye = Object.prototype, ae = X["__core-js_shared__"], sr = function() {
    var g = /[^.]+$/.exec(ae && ae.keys && ae.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), He = Be.toString, ue = ye.hasOwnProperty, we = ye.toString, A = RegExp(
    "^" + He.call(ue).replace(it, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), D = At ? X.Buffer : void 0, F = X.Symbol, K = X.Uint8Array, dt = Ue(Object.getPrototypeOf, Object), lt = Object.create, ee = ye.propertyIsEnumerable, Ct = Se.splice, Qt = Object.getOwnPropertySymbols, be = D ? D.isBuffer : void 0, Ee = Ue(Object.keys, Object), Oe = Fn(X, "DataView"), kt = Fn(X, "Map"), St = Fn(X, "Promise"), Xt = Fn(X, "Set"), Jt = Fn(X, "WeakMap"), fe = Fn(Object, "create"), ce = _t(Oe), kn = _t(kt), $n = _t(St), Ls = _t(Xt), Cs = _t(Jt), Ts = F ? F.prototype : void 0, Bs = Ts ? Ts.valueOf : void 0;
  function In(g) {
    var B = -1, H = g ? g.length : 0;
    for (this.clear(); ++B < H; ) {
      var ct = g[B];
      this.set(ct[0], ct[1]);
    }
  }
  function Ln() {
    this.__data__ = fe ? fe(null) : {};
  }
  function tn(g) {
    return this.has(g) && delete this.__data__[g];
  }
  function fo(g) {
    var B = this.__data__;
    if (fe) {
      var H = B[g];
      return H === r ? void 0 : H;
    }
    return ue.call(B, g) ? B[g] : void 0;
  }
  function Vt(g) {
    var B = this.__data__;
    return fe ? B[g] !== void 0 : ue.call(B, g);
  }
  function Xe(g, B) {
    var H = this.__data__;
    return H[g] = fe && B === void 0 ? r : B, this;
  }
  In.prototype.clear = Ln, In.prototype.delete = tn, In.prototype.get = fo, In.prototype.has = Vt, In.prototype.set = Xe;
  function cn(g) {
    var B = -1, H = g ? g.length : 0;
    for (this.clear(); ++B < H; ) {
      var ct = g[B];
      this.set(ct[0], ct[1]);
    }
  }
  function Ms() {
    this.__data__ = [];
  }
  function d(g) {
    var B = this.__data__, H = Dn(B, g);
    if (H < 0)
      return !1;
    var ct = B.length - 1;
    return H == ct ? B.pop() : Ct.call(B, H, 1), !0;
  }
  function x(g) {
    var B = this.__data__, H = Dn(B, g);
    return H < 0 ? void 0 : B[H][1];
  }
  function v(g) {
    return Dn(this.__data__, g) > -1;
  }
  function h(g, B) {
    var H = this.__data__, ct = Dn(H, g);
    return ct < 0 ? H.push([g, B]) : H[ct][1] = B, this;
  }
  cn.prototype.clear = Ms, cn.prototype.delete = d, cn.prototype.get = x, cn.prototype.has = v, cn.prototype.set = h;
  function tt(g) {
    var B = -1, H = g ? g.length : 0;
    for (this.clear(); ++B < H; ) {
      var ct = g[B];
      this.set(ct[0], ct[1]);
    }
  }
  function ut() {
    this.__data__ = {
      hash: new In(),
      map: new (kt || cn)(),
      string: new In()
    };
  }
  function $t(g) {
    return Xn(this, g).delete(g);
  }
  function de(g) {
    return Xn(this, g).get(g);
  }
  function Ae(g) {
    return Xn(this, g).has(g);
  }
  function yn(g, B) {
    return Xn(this, g).set(g, B), this;
  }
  tt.prototype.clear = ut, tt.prototype.delete = $t, tt.prototype.get = de, tt.prototype.has = Ae, tt.prototype.set = yn;
  function Fe(g) {
    this.__data__ = new cn(g);
  }
  function It() {
    this.__data__ = new cn();
  }
  function Ge(g) {
    return this.__data__.delete(g);
  }
  function wn(g) {
    return this.__data__.get(g);
  }
  function ir(g) {
    return this.__data__.has(g);
  }
  function bn(g, B) {
    var H = this.__data__;
    if (H instanceof cn) {
      var ct = H.__data__;
      if (!kt || ct.length < n - 1)
        return ct.push([g, B]), this;
      H = this.__data__ = new tt(ct);
    }
    return H.set(g, B), this;
  }
  Fe.prototype.clear = It, Fe.prototype.delete = Ge, Fe.prototype.get = wn, Fe.prototype.has = ir, Fe.prototype.set = bn;
  function Ye(g, B) {
    var H = ln(g) || Ke(g) ? vt(g.length, String) : [], ct = H.length, $e = !!ct;
    for (var xn in g)
      ue.call(g, xn) && !($e && (xn == "length" || j(xn, ct))) && H.push(xn);
    return H;
  }
  function mn(g, B, H) {
    var ct = g[B];
    (!(ue.call(g, B) && nn(ct, H)) || H === void 0 && !(B in g)) && (g[B] = H);
  }
  function Dn(g, B) {
    for (var H = g.length; H--; )
      if (nn(g[H][0], B))
        return H;
    return -1;
  }
  function en(g, B) {
    return g && Wn(B, Me(B), g);
  }
  function or(g, B, H, ct, $e, xn, Br) {
    var Sn;
    if (ct && (Sn = xn ? ct(g, $e, xn, Br) : ct(g)), Sn !== void 0)
      return Sn;
    if (!at(g))
      return g;
    var qf = ln(g);
    if (qf) {
      if (Sn = q(g), !B)
        return Vr(g, Sn);
    } else {
      var Ai = L(g), Wf = Ai == f || Ai == l;
      if (Jo(g))
        return Ei(g, B);
      if (Ai == m || Ai == i || Wf && !xn) {
        if (qe(g))
          return xn ? g : {};
        if (Sn = nt(Wf ? {} : g), !B)
          return Tr(g, en(Sn, g));
      } else {
        if (!U[Ai])
          return xn ? g : {};
        Sn = mt(g, Ai, or, B);
      }
    }
    Br || (Br = new Fe());
    var Xf = Br.get(g);
    if (Xf)
      return Xf;
    if (Br.set(g, Sn), !qf)
      var Yf = H ? Ns(g) : Me(g);
    return Zt(Yf || g, function(Wc, ta) {
      Yf && (ta = Wc, Wc = g[ta]), mn(Sn, ta, or(Wc, B, H, ct, ta, g, Br));
    }), Sn;
  }
  function ar(g) {
    return at(g) ? lt(g) : {};
  }
  function bt(g, B, H) {
    var ct = B(g);
    return ln(g) ? ct : Ft(ct, H(g));
  }
  function qt(g) {
    return we.call(g);
  }
  function le(g) {
    if (!at(g) || gt(g))
      return !1;
    var B = ho(g) || qe(g) ? A : Et;
    return B.test(_t(g));
  }
  function Cn(g) {
    if (!yt(g))
      return Ee(g);
    var B = [];
    for (var H in Object(g))
      ue.call(g, H) && H != "constructor" && B.push(H);
    return B;
  }
  function Ei(g, B) {
    if (B)
      return g.slice();
    var H = new g.constructor(g.length);
    return g.copy(H), H;
  }
  function Ir(g) {
    var B = new g.constructor(g.byteLength);
    return new K(B).set(new K(g)), B;
  }
  function ve(g, B) {
    var H = B ? Ir(g.buffer) : g.buffer;
    return new g.constructor(H, g.byteOffset, g.byteLength);
  }
  function Lr(g, B, H) {
    var ct = B ? H(Re(g), !0) : Re(g);
    return Kt(ct, jt, new g.constructor());
  }
  function Gr(g) {
    var B = new g.constructor(g.source, W.exec(g));
    return B.lastIndex = g.lastIndex, B;
  }
  function Cr(g, B, H) {
    var ct = B ? H(We(g), !0) : We(g);
    return Kt(ct, Ot, new g.constructor());
  }
  function Kr(g) {
    return Bs ? Object(Bs.call(g)) : {};
  }
  function cr(g, B) {
    var H = B ? Ir(g.buffer) : g.buffer;
    return new g.constructor(H, g.byteOffset, g.length);
  }
  function Vr(g, B) {
    var H = -1, ct = g.length;
    for (B || (B = Array(ct)); ++H < ct; )
      B[H] = g[H];
    return B;
  }
  function Wn(g, B, H, ct) {
    H || (H = {});
    for (var $e = -1, xn = B.length; ++$e < xn; ) {
      var Br = B[$e], Sn = void 0;
      mn(H, Br, Sn === void 0 ? g[Br] : Sn);
    }
    return H;
  }
  function Tr(g, B) {
    return Wn(g, y(g), B);
  }
  function Ns(g) {
    return bt(g, Me, y);
  }
  function Xn(g, B) {
    var H = g.__data__;
    return pt(B) ? H[typeof B == "string" ? "string" : "hash"] : H.map;
  }
  function Fn(g, B) {
    var H = se(g, B);
    return le(H) ? H : void 0;
  }
  var y = Qt ? Ue(Qt, Object) : po, L = qt;
  (Oe && L(new Oe(new ArrayBuffer(1))) != J || kt && L(new kt()) != w || St && L(St.resolve()) != S || Xt && L(new Xt()) != R || Jt && L(new Jt()) != _) && (L = function(g) {
    var B = we.call(g), H = B == m ? g.constructor : void 0, ct = H ? _t(H) : void 0;
    if (ct)
      switch (ct) {
        case ce:
          return J;
        case kn:
          return w;
        case $n:
          return S;
        case Ls:
          return R;
        case Cs:
          return _;
      }
    return B;
  });
  function q(g) {
    var B = g.length, H = g.constructor(B);
    return B && typeof g[0] == "string" && ue.call(g, "index") && (H.index = g.index, H.input = g.input), H;
  }
  function nt(g) {
    return typeof g.constructor == "function" && !yt(g) ? ar(dt(g)) : {};
  }
  function mt(g, B, H, ct) {
    var $e = g.constructor;
    switch (B) {
      case N:
        return Ir(g);
      case a:
      case c:
        return new $e(+g);
      case J:
        return ve(g, ct);
      case et:
      case G:
      case V:
      case $:
      case P:
      case b:
      case C:
      case O:
      case T:
        return cr(g, ct);
      case w:
        return Lr(g, ct, H);
      case p:
      case z:
        return new $e(g);
      case M:
        return Gr(g);
      case R:
        return Cr(g, ct, H);
      case E:
        return Kr(g);
    }
  }
  function j(g, B) {
    return B = B ?? s, !!B && (typeof g == "number" || k.test(g)) && g > -1 && g % 1 == 0 && g < B;
  }
  function pt(g) {
    var B = typeof g;
    return B == "string" || B == "number" || B == "symbol" || B == "boolean" ? g !== "__proto__" : g === null;
  }
  function gt(g) {
    return !!sr && sr in g;
  }
  function yt(g) {
    var B = g && g.constructor, H = typeof B == "function" && B.prototype || ye;
    return g === H;
  }
  function _t(g) {
    if (g != null) {
      try {
        return He.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function De(g) {
    return or(g, !0, !0);
  }
  function nn(g, B) {
    return g === B || g !== g && B !== B;
  }
  function Ke(g) {
    return Qo(g) && ue.call(g, "callee") && (!ee.call(g, "callee") || we.call(g) == i);
  }
  var ln = Array.isArray;
  function qr(g) {
    return g != null && Y(g.length) && !ho(g);
  }
  function Qo(g) {
    return ke(g) && qr(g);
  }
  var Jo = be || Ps;
  function ho(g) {
    var B = at(g) ? we.call(g) : "";
    return B == f || B == l;
  }
  function Y(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= s;
  }
  function at(g) {
    var B = typeof g;
    return !!g && (B == "object" || B == "function");
  }
  function ke(g) {
    return !!g && typeof g == "object";
  }
  function Me(g) {
    return qr(g) ? Ye(g) : Cn(g);
  }
  function po() {
    return [];
  }
  function Ps() {
    return !1;
  }
  t.exports = De;
})(Ja, Ja.exports);
var yx = Ja.exports;
const ig = /* @__PURE__ */ B0(yx);
var jl;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(jl || (jl = {}));
function wx(t, e) {
  return { type: jl.Address, version: t, hash160: e };
}
function bx(t) {
  return yi.c32address(t.version, t.hash160);
}
const mx = (t) => R2(Zp(t)), xx = (t) => ht(mx(t));
Te.hmacSha256Sync = (t, ...e) => {
  const n = Xp.create(Zp, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function Sx(t, e = "mainnet") {
  e = Kp(e), t = typeof t == "string" ? Gt(t) : t;
  const n = _2(Hr.P2PKH, e), r = wx(n, xx(t));
  return bx(r);
}
function Ex(t, e) {
  const n = Je.decodeToken(t), r = n.payload;
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
  const s = r.issuer.publicKey, i = Sx(s);
  if (e !== s) {
    if (e !== i) throw new Error("Token issuer public key does not match the verifying value");
  }
  const o = new Je.TokenVerifier(n.header.alg, s);
  if (!o)
    throw new Error("Invalid token verifier");
  if (!o.verify(t))
    throw new Error("Token verification failed");
  return n;
}
function Ax(t, e = null) {
  let n;
  e ? n = Ex(t, e) : n = Je.decodeToken(t);
  let r = {};
  if (n.hasOwnProperty("payload")) {
    const s = n.payload;
    if (typeof s == "string")
      throw new Error("Unexpected token payload type of string");
    s.hasOwnProperty("claim") && (r = s.claim);
  }
  return r;
}
const Gd = "_blockstackDidCheckEchoReply", vx = "echoReply", kx = "authContinuation";
function $x(t) {
  return t ? (/^[?#]/.test(t) ? t.slice(1) : t).split("&").reduce((n, r) => {
    const [s, i] = r.split("=");
    return n[s] = i ? decodeURIComponent(i.replace(/\+/g, " ")) : "", n;
  }, {}) : {};
}
function Ix() {
  let t;
  if (typeof self < "u")
    t = self;
  else if (typeof window < "u")
    t = window;
  else
    return !1;
  if (!t.location || !t.localStorage)
    return !1;
  const e = t[Gd];
  if (typeof e == "boolean")
    return e;
  const n = $x(t.location.search), r = n[vx];
  if (r) {
    t[Gd] = !0;
    const s = `echo-reply-${r}`;
    return t.localStorage.setItem(s, "success"), t.setTimeout(() => {
      const i = n[kx];
      t.location.href = i;
    }, 10), !0;
  }
  return !1;
}
class zl {
  constructor(e) {
    let n = !0;
    if (typeof window > "u" && typeof self > "u" && (n = !1), e && e.appConfig)
      this.appConfig = e.appConfig;
    else if (n)
      this.appConfig = new F0();
    else
      throw new Vw("You need to specify options.appConfig");
    e && e.sessionStore ? this.store = e.sessionStore : n ? e ? this.store = new kd(e.sessionOptions) : this.store = new kd() : e ? this.store = new vd(e.sessionOptions) : this.store = new vd();
  }
  makeAuthRequestToken(e, n, r, s, i, o = Ww().getTime(), a = {}) {
    const c = this.appConfig;
    if (!c)
      throw new Ll("Missing AppConfig");
    return e = e || this.generateAndStoreTransitKey(), n = n || c.redirectURI(), r = r || c.manifestURI(), s = s || c.scopes, i = i || c.appDomain, d2(e, n, r, s, i, o, a);
  }
  generateAndStoreTransitKey() {
    const e = this.store.getSessionData(), n = f2();
    return e.transitKey = n, this.store.setSessionData(e), n;
  }
  getAuthResponseToken() {
    var r;
    const e = (r = _u("location", {
      throwIfUnavailable: !0,
      usageDesc: "getAuthResponseToken"
    })) == null ? void 0 : r.search;
    return new URLSearchParams(e).get("authResponse") ?? "";
  }
  isSignInPending() {
    try {
      if (Ix())
        return Bi.info("protocolEchoReply detected from isSignInPending call, the page is about to redirect."), !0;
    } catch (e) {
      Bi.error(`Error checking for protocol echo reply isSignInPending: ${e}`);
    }
    return !!this.getAuthResponseToken();
  }
  isUserSignedIn() {
    return !!this.store.getSessionData().userData;
  }
  async handlePendingSignIn(e = this.getAuthResponseToken(), n = wb()) {
    const r = this.store.getSessionData();
    if (r.userData)
      throw new ea("Existing user session found.");
    const s = this.store.getSessionData().transitKey;
    this.appConfig && this.appConfig.coreNode;
    const i = Je.decodeToken(e).payload;
    if (typeof i == "string")
      throw new Error("Unexpected token payload type of string");
    if (!await w2(e))
      throw new ea("Invalid authentication response.");
    let a = i.private_key, c = i.core_token;
    if (Yc(i.version, "1.1.0"))
      if (s !== void 0 && s != null) {
        if (i.private_key !== void 0 && i.private_key !== null)
          try {
            a = await Ed(s, i.private_key);
          } catch {
            if (Bi.warn("Failed decryption of appPrivateKey, will try to use as given"), !Te.isValidPrivateKey(i.private_key))
              throw new ea("Failed decrypting appPrivateKey. Usually means that the transit key has changed during login.");
          }
        if (c != null)
          try {
            c = await Ed(s, c);
          } catch {
            Bi.info("Failed decryption of coreSessionToken, will try to use as given");
          }
      } else
        throw new ea("Authenticating with protocol > 1.1.0 requires transit key, and none found.");
    let u = ob, f;
    Yc(i.version, "1.2.0") && i.hubUrl !== null && i.hubUrl !== void 0 && (u = i.hubUrl), Yc(i.version, "1.3.0") && i.associationToken !== null && i.associationToken !== void 0 && (f = i.associationToken);
    const l = {
      profile: i.profile,
      email: i.email,
      decentralizedID: i.iss,
      identityAddress: zp(i.iss),
      appPrivateKey: a,
      coreSessionToken: c,
      authResponseToken: e,
      hubUrl: u,
      appPrivateKeyFromWalletSalt: i.appPrivateKeyFromWalletSalt,
      coreNode: i.blockstackAPIUrl,
      gaiaAssociationToken: f
    }, w = i.profile_url;
    if (!l.profile && w) {
      const p = await n(w);
      if (!p.ok)
        l.profile = Object.assign({}, Rw);
      else {
        const m = await p.text(), S = JSON.parse(m);
        l.profile = Ax(S[0].token);
      }
    } else
      l.profile = i.profile;
    return r.userData = l, this.store.setSessionData(r), l;
  }
  loadUserData() {
    const e = this.store.getSessionData().userData;
    if (!e)
      throw new Ll("No user data found. Did the user sign in?");
    return e;
  }
  encryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), o1(e, r);
  }
  decryptContent(e, n) {
    const r = Object.assign({}, n);
    return r.privateKey || (r.privateKey = this.loadUserData().appPrivateKey), a1(e, r);
  }
  signUserOut(e) {
    this.store.deleteSessionData(), e && typeof location < "u" && location.href && (location.href = e);
  }
}
zl.prototype.makeAuthRequest = zl.prototype.makeAuthRequestToken;
const Lx = () => typeof window > "u" ? [] : window.webbtc_stx_providers ? window.webbtc_stx_providers : [], Cx = (t = []) => {
  if (typeof window > "u")
    return [];
  const e = Lx(), n = t.filter((r) => e.find((i) => i.id === r.id) ? !1 : !!Mc(r.id));
  return e.concat(n);
}, Mc = (t) => t == null ? void 0 : t.split(".").reduce((e, n) => e == null ? void 0 : e[n], window), og = "STX_PROVIDER", ti = () => typeof window > "u" ? null : window.localStorage.getItem(og), Tx = (t) => {
  typeof window < "u" && window.localStorage.setItem(og, t);
}, Bx = {
  referrerPolicy: "origin",
  headers: {
    "x-hiro-product": "stacksjs"
  }
};
async function Mx(t, e) {
  const n = {};
  return Object.assign(n, Bx, e), await fetch(t, n);
}
function Nx(t) {
  let e = Mx, n = [];
  return t.length > 0 && typeof t[0] == "function" && (e = t.shift()), t.length > 0 && (n = t), { fetchLib: e, middlewares: n };
}
function Px(...t) {
  const { fetchLib: e, middlewares: n } = Nx(t);
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
var Yi;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Yi || (Yi = {}));
var ei;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ei || (ei = {}));
var Kd;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(Kd || (Kd = {}));
const _x = "https://api.mainnet.hiro.so", Ux = "https://api.testnet.hiro.so", Hx = "http://localhost:3999", Ox = ["mainnet", "testnet", "devnet", "mocknet"];
class ni {
  constructor(e) {
    this.version = ei.Mainnet, this.chainId = Yi.Mainnet, this.bnsLookupUrl = "https://api.mainnet.hiro.so", this.broadcastEndpoint = "/v2/transactions", this.transferFeeEstimateEndpoint = "/v2/fees/transfer", this.transactionFeeEstimateEndpoint = "/v2/fees/transaction", this.accountEndpoint = "/v2/accounts", this.contractAbiEndpoint = "/v2/contracts/interface", this.readOnlyFunctionCallEndpoint = "/v2/contracts/call-read", this.isMainnet = () => this.version === ei.Mainnet, this.getBroadcastApiUrl = () => `${this.coreApiUrl}${this.broadcastEndpoint}`, this.getTransferFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transferFeeEstimateEndpoint}`, this.getTransactionFeeEstimateApiUrl = () => `${this.coreApiUrl}${this.transactionFeeEstimateEndpoint}`, this.getAccountApiUrl = (n) => `${this.coreApiUrl}${this.accountEndpoint}/${n}?proof=0`, this.getAccountExtendedBalancesApiUrl = (n) => `${this.coreApiUrl}/extended/v1/address/${n}/balances`, this.getAbiApiUrl = (n, r) => `${this.coreApiUrl}${this.contractAbiEndpoint}/${n}/${r}`, this.getReadOnlyFunctionCallApiUrl = (n, r, s) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}/${n}/${r}/${encodeURIComponent(s)}`, this.getInfoUrl = () => `${this.coreApiUrl}/v2/info`, this.getBlockTimeInfoUrl = () => `${this.coreApiUrl}/extended/v1/info/network_block_times`, this.getPoxInfoUrl = () => `${this.coreApiUrl}/v2/pox`, this.getRewardsUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getRewardsTotalUrl = (n) => `${this.coreApiUrl}/extended/v1/burnchain/rewards/${n}/total`, this.getRewardHoldersUrl = (n, r) => {
      let s = `${this.coreApiUrl}/extended/v1/burnchain/reward_slot_holders/${n}`;
      return r && (s = `${s}?limit=${r.limit}&offset=${r.offset}`), s;
    }, this.getStackerInfoUrl = (n, r) => `${this.coreApiUrl}${this.readOnlyFunctionCallEndpoint}
    ${n}/${r}/get-stacker-info`, this.getDataVarUrl = (n, r, s) => `${this.coreApiUrl}/v2/data_var/${n}/${r}/${s}?proof=0`, this.getMapEntryUrl = (n, r, s) => `${this.coreApiUrl}/v2/map_entry/${n}/${r}/${s}?proof=0`, this.coreApiUrl = e.url, this.fetchFn = e.fetchFn ?? Px();
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
ni.fromName = (t) => {
  switch (t) {
    case "mainnet":
      return new Rl();
    case "testnet":
      return new Gl();
    case "devnet":
      return new Dx();
    case "mocknet":
      return new ag();
    default:
      throw new Error(`Invalid network name provided. Must be one of the following: ${Ox.join(", ")}`);
  }
};
ni.fromNameOrNetwork = (t) => typeof t != "string" && "version" in t ? t : ni.fromName(t);
class Rl extends ni {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? _x,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ei.Mainnet, this.chainId = Yi.Mainnet;
  }
}
class Gl extends ni {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Ux,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ei.Testnet, this.chainId = Yi.Testnet;
  }
}
class ag extends ni {
  constructor(e) {
    super({
      url: (e == null ? void 0 : e.url) ?? Hx,
      fetchFn: e == null ? void 0 : e.fetchFn
    }), this.version = ei.Testnet, this.chainId = Yi.Testnet;
  }
}
const Dx = ag;
var ri;
(function(t) {
  t[t.Mainnet = 1] = "Mainnet", t[t.Testnet = 2147483648] = "Testnet";
})(ri || (ri = {}));
var tc;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(tc || (tc = {}));
ri.Mainnet;
var si;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(si || (si = {}));
var ii;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(ii || (ii = {}));
si.Mainnet;
const Fx = {
  chainId: ri.Mainnet,
  transactionVersion: si.Mainnet,
  peerNetworkId: tc.Mainnet,
  magicBytes: "X2",
  bootAddress: "SP000000000000000000002Q6VF78",
  addressVersion: {
    singleSig: ii.MainnetSingleSig,
    multiSig: ii.MainnetMultiSig
  },
  client: { baseUrl: H0 }
}, Kl = {
  chainId: ri.Testnet,
  transactionVersion: si.Testnet,
  peerNetworkId: tc.Testnet,
  magicBytes: "T2",
  bootAddress: "ST000000000000000000002AMW42H",
  addressVersion: {
    singleSig: ii.TestnetSingleSig,
    multiSig: ii.TestnetMultiSig
  },
  client: { baseUrl: O0 }
}, Ha = {
  ...Kl,
  addressVersion: { ...Kl.addressVersion },
  magicBytes: "id",
  client: { baseUrl: D0 }
}, jx = {
  ...Ha,
  addressVersion: { ...Ha.addressVersion },
  client: { ...Ha.client }
};
function zx(t) {
  switch (t) {
    case "mainnet":
      return Fx;
    case "testnet":
      return Kl;
    case "devnet":
      return Ha;
    case "mocknet":
      return jx;
    default:
      throw new Error(`Unknown network name: ${t}`);
  }
}
function Rx(t) {
  return typeof t == "string" ? zx(t) : t;
}
function Gx(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vd = /* @__PURE__ */ new Map();
function cg(t, e) {
  const n = Vd.get(t);
  if (n !== void 0)
    return n(e);
  const r = Gx(t);
  return Vd.set(t, r), cg(t, e);
}
let ie = class {
  constructor(e) {
    this.consumed = 0, this.source = typeof e == "string" ? Gt(e) : e;
  }
  readBytes(e) {
    const n = this.source.subarray(this.consumed, this.consumed + e);
    return this.consumed += e, n;
  }
  readUInt32BE() {
    return hb(this.readBytes(4), 0);
  }
  readUInt8() {
    return fb(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return lb(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = ht(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = ht(n);
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
    if (cg(e, r))
      return r;
    throw n(r);
  }
};
const Kx = 128, Vx = 128, lg = 16, Ks = 32, Vl = 80, Nc = 65, qx = 32, Wx = 64, ec = 34, Xx = 1 + 16 * 1024 * 1024, Yx = 165, Zx = 16, Qx = 16, Jx = 20, tS = Qx + 2 + Jx, eS = tS + 4, nS = Xx + (Yx + Zx * eS);
var Yt;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Yt || (Yt = {}));
var ql;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3", t[t.Clarity4 = 4] = "Clarity4", t[t.Clarity5 = 5] = "Clarity5", t[t.Clarity6 = 6] = "Clarity6";
})(ql || (ql = {}));
var Bn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Bn || (Bn = {}));
const rl = ["onChainOnly", "offChainOnly", "any"];
rl[0] + "", Bn.OnChainOnly, rl[1] + "", Bn.OffChainOnly, rl[2] + "", Bn.Any, Bn.OnChainOnly + "", Bn.OnChainOnly, Bn.OffChainOnly + "", Bn.OffChainOnly, Bn.Any + "", Bn.Any;
var nc;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny", t[t.Originator = 3] = "Originator";
})(nc || (nc = {}));
var he;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible", t[t.Staking = 3] = "Staking", t[t.PoX = 4] = "PoX";
})(he || (he = {}));
var Le;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Le || (Le = {}));
var ne;
(function(t) {
  t[t.P2PKH = 0] = "P2PKH", t[t.P2SH = 1] = "P2SH", t[t.P2WPKH = 2] = "P2WPKH", t[t.P2WSH = 3] = "P2WSH", t[t.P2SHNonSequential = 5] = "P2SHNonSequential", t[t.P2WSHNonSequential = 7] = "P2WSHNonSequential";
})(ne || (ne = {}));
var me;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(me || (me = {}));
var Lo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Lo || (Lo = {}));
var Wl;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend", t[t.MaybeSent = 18] = "MaybeSent";
})(Wl || (Wl = {}));
var Xl;
(function(t) {
  t[t.WillNotPerform = 48] = "WillNotPerform", t[t.MayPerform = 49] = "MayPerform", t[t.WillPerform = 50] = "WillPerform";
})(Xl || (Xl = {}));
var hn;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(hn || (hn = {}));
var qd;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(qd || (qd = {}));
var Yl;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended", t[t.ExtendedRuntime = 2] = "ExtendedRuntime", t[t.ExtendedReadCount = 3] = "ExtendedReadCount", t[t.ExtendedReadLength = 4] = "ExtendedReadLength", t[t.ExtendedWriteCount = 5] = "ExtendedWriteCount", t[t.ExtendedWriteLength = 6] = "ExtendedWriteLength";
})(Yl || (Yl = {}));
var Jn;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(Jn || (Jn = {}));
var Wd;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.ServerFailureDatabase = "ServerFailureDatabase", t.ServerFailureOther = "ServerFailureOther";
})(Wd || (Wd = {}));
let Pc = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Mi = class extends Pc {
  constructor(e) {
    super(e);
  }
}, fn = class extends Pc {
  constructor(e) {
    super(e);
  }
}, rc = class extends Pc {
  constructor(e) {
    super(e);
  }
}, Fs = class extends Pc {
  constructor(e) {
    super(e);
  }
};
function Zl(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function rS(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function ug(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function sS(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  Zl(t.outputLen), Zl(t.blockLen);
}
function iS(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function oS(t, e) {
  ug(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const js = {
  number: Zl,
  bool: rS,
  bytes: ug,
  hash: sS,
  exists: iS,
  output: oS
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const sl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), fr = (t, e) => t << 32 - e | t >>> e, aS = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!aS)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function cS(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function nf(t) {
  if (typeof t == "string" && (t = cS(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
let fg = class {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
};
function wi(t) {
  const e = (r) => t().update(nf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
let dg = class extends fg {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, js.hash(e);
    const r = nf(n);
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
    return js.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    js.exists(this), js.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const hg = (t, e, n) => new dg(t, e).update(n).digest();
hg.create = (t, e) => new dg(t, e);
function lS(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let rf = class extends fg {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = sl(this.buffer);
  }
  update(e) {
    js.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = nf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = sl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    js.exists(this), js.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    lS(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = sl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const uS = (t, e, n) => t & e ^ ~t & n, fS = (t, e, n) => t & e ^ t & n ^ e & n, dS = new Uint32Array([
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
]), is = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), os = new Uint32Array(64);
let pg = class extends rf {
  constructor() {
    super(64, 32, 8, !1), this.A = is[0] | 0, this.B = is[1] | 0, this.C = is[2] | 0, this.D = is[3] | 0, this.E = is[4] | 0, this.F = is[5] | 0, this.G = is[6] | 0, this.H = is[7] | 0;
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
      os[l] = e.getUint32(n, !1);
    for (let l = 16; l < 64; l++) {
      const w = os[l - 15], p = os[l - 2], m = fr(w, 7) ^ fr(w, 18) ^ w >>> 3, S = fr(p, 17) ^ fr(p, 19) ^ p >>> 10;
      os[l] = S + os[l - 7] + m + os[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = fr(a, 6) ^ fr(a, 11) ^ fr(a, 25), p = f + w + uS(a, c, u) + dS[l] + os[l] | 0, S = (fr(r, 2) ^ fr(r, 13) ^ fr(r, 22)) + fS(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    os.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, hS = class extends pg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
const sf = wi(() => new pg());
wi(() => new hS());
const pS = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), gg = Uint8Array.from({ length: 16 }, (t, e) => e), gS = gg.map((t) => (9 * t + 5) % 16);
let of = [gg], af = [gS];
for (let t = 0; t < 4; t++)
  for (let e of [of, af])
    e.push(e[t].map((n) => pS[n]));
const yg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), yS = of.map((t, e) => t.map((n) => yg[e][n])), wS = af.map((t, e) => t.map((n) => yg[e][n])), bS = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), mS = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), pa = (t, e) => t << e | t >>> 32 - e;
function Xd(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ga = new Uint32Array(16);
let xS = class extends rf {
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
      ga[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, S = bS[p], M = mS[p], R = of[p], z = af[p], E = yS[p], _ = wS[p];
      for (let N = 0; N < 16; N++) {
        const J = pa(r + Xd(p, i, a, u) + ga[R[N]] + S, E[N]) + l | 0;
        r = l, l = u, u = pa(a, 10) | 0, a = i, i = J;
      }
      for (let N = 0; N < 16; N++) {
        const J = pa(s + Xd(m, o, c, f) + ga[z[N]] + M, _[N]) + w | 0;
        s = w, w = f, f = pa(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ga.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
const SS = wi(() => new xS()), ya = BigInt(2 ** 32 - 1), Ql = BigInt(32);
function wg(t, e = !1) {
  return e ? { h: Number(t & ya), l: Number(t >> Ql & ya) } : { h: Number(t >> Ql & ya) | 0, l: Number(t & ya) | 0 };
}
function ES(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = wg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const AS = (t, e) => BigInt(t >>> 0) << Ql | BigInt(e >>> 0), vS = (t, e, n) => t >>> n, kS = (t, e, n) => t << 32 - n | e >>> n, $S = (t, e, n) => t >>> n | e << 32 - n, IS = (t, e, n) => t << 32 - n | e >>> n, LS = (t, e, n) => t << 64 - n | e >>> n - 32, CS = (t, e, n) => t >>> n - 32 | e << 64 - n, TS = (t, e) => e, BS = (t, e) => t, MS = (t, e, n) => t << n | e >>> 32 - n, NS = (t, e, n) => e << n | t >>> 32 - n, PS = (t, e, n) => e << n - 32 | t >>> 64 - n, _S = (t, e, n) => t << n - 32 | e >>> 64 - n;
function US(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const HS = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), OS = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, DS = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), FS = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, jS = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), zS = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Mt = {
  fromBig: wg,
  split: ES,
  toBig: AS,
  shrSH: vS,
  shrSL: kS,
  rotrSH: $S,
  rotrSL: IS,
  rotrBH: LS,
  rotrBL: CS,
  rotr32H: TS,
  rotr32L: BS,
  rotlSH: MS,
  rotlSL: NS,
  rotlBH: PS,
  rotlBL: _S,
  add: US,
  add3L: HS,
  add3H: OS,
  add4L: DS,
  add4H: FS,
  add5H: zS,
  add5L: jS
}, [RS, GS] = Mt.split([
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
].map((t) => BigInt(t))), as = new Uint32Array(80), cs = new Uint32Array(80);
let _c = class extends rf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: m, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      as[E] = e.getUint32(n), cs[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = as[E - 15] | 0, N = cs[E - 15] | 0, J = Mt.rotrSH(_, N, 1) ^ Mt.rotrSH(_, N, 8) ^ Mt.shrSH(_, N, 7), et = Mt.rotrSL(_, N, 1) ^ Mt.rotrSL(_, N, 8) ^ Mt.shrSL(_, N, 7), G = as[E - 2] | 0, V = cs[E - 2] | 0, $ = Mt.rotrSH(G, V, 19) ^ Mt.rotrBH(G, V, 61) ^ Mt.shrSH(G, V, 6), P = Mt.rotrSL(G, V, 19) ^ Mt.rotrBL(G, V, 61) ^ Mt.shrSL(G, V, 6), b = Mt.add4L(et, P, cs[E - 7], cs[E - 16]), C = Mt.add4H(b, J, $, as[E - 7], as[E - 16]);
      as[E] = C | 0, cs[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: m, Gh: S, Gl: M, Hh: R, Hl: z } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Mt.rotrSH(l, w, 14) ^ Mt.rotrSH(l, w, 18) ^ Mt.rotrBH(l, w, 41), N = Mt.rotrSL(l, w, 14) ^ Mt.rotrSL(l, w, 18) ^ Mt.rotrBL(l, w, 41), J = l & p ^ ~l & S, et = w & m ^ ~w & M, G = Mt.add5L(z, N, et, GS[E], cs[E]), V = Mt.add5H(G, R, _, J, RS[E], as[E]), $ = G | 0, P = Mt.rotrSH(r, s, 28) ^ Mt.rotrBH(r, s, 34) ^ Mt.rotrBH(r, s, 39), b = Mt.rotrSL(r, s, 28) ^ Mt.rotrBL(r, s, 34) ^ Mt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, O = s & o ^ s & c ^ o & c;
      R = S | 0, z = M | 0, S = p | 0, M = m | 0, p = l | 0, m = w | 0, { h: l, l: w } = Mt.add(u | 0, f | 0, V | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Mt.add3L($, b, O);
      r = Mt.add3H(T, V, P, C), s = T | 0;
    }
    ({ h: r, l: s } = Mt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Mt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Mt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Mt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Mt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: m } = Mt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: S, l: M } = Mt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: R, l: z } = Mt.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, m, S, M, R, z);
  }
  roundClean() {
    as.fill(0), cs.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, KS = class extends _c {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, VS = class extends _c {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, qS = class extends _c {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
wi(() => new _c());
wi(() => new KS());
const WS = wi(() => new VS());
wi(() => new qS());
var zt;
(function(t) {
  t.Int = "int", t.UInt = "uint", t.Buffer = "buffer", t.BoolTrue = "true", t.BoolFalse = "false", t.PrincipalStandard = "address", t.PrincipalContract = "contract", t.ResponseOk = "ok", t.ResponseErr = "err", t.OptionalNone = "none", t.OptionalSome = "some", t.List = "list", t.Tuple = "tuple", t.StringASCII = "ascii", t.StringUTF8 = "utf8";
})(zt || (zt = {}));
var je;
(function(t) {
  t[t.int = 0] = "int", t[t.uint = 1] = "uint", t[t.buffer = 2] = "buffer", t[t.true = 3] = "true", t[t.false = 4] = "false", t[t.address = 5] = "address", t[t.contract = 6] = "contract", t[t.ok = 7] = "ok", t[t.err = 8] = "err", t[t.none = 9] = "none", t[t.some = 10] = "some", t[t.list = 11] = "list", t[t.tuple = 12] = "tuple", t[t.ascii = 13] = "ascii", t[t.utf8 = 14] = "utf8";
})(je || (je = {}));
function cf(t) {
  return je[t];
}
const XS = () => ({ type: zt.BoolTrue }), YS = () => ({ type: zt.BoolFalse }), ZS = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: zt.Buffer, value: ht(t) };
}, Yd = BigInt("0xffffffffffffffffffffffffffffffff"), QS = BigInt(0), Zd = BigInt("0x7fffffffffffffffffffffffffffffff"), Qd = BigInt("-170141183460469231731687303715884105728"), JS = (t) => {
  typeof t == "string" && t.toLowerCase().startsWith("0x") && (t = Tl(Gt(t))), vn(t, Uint8Array) && (t = Tl(t));
  const e = an(t);
  if (e > Zd)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${Zd}`);
  if (e < Qd)
    throw new RangeError(`Cannot construct clarity integer form value less than ${Qd}`);
  return { type: zt.Int, value: e };
}, tE = (t) => {
  const e = an(t);
  if (e < QS)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Yd)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Yd}`);
  return { type: zt.UInt, value: e };
};
function eE(t) {
  return { type: zt.List, value: t };
}
function bg() {
  return { type: zt.OptionalNone };
}
function mg(t) {
  return { type: zt.OptionalSome, value: t };
}
var st;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.Asset = 4] = "Asset", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(st || (st = {}));
function nE() {
  return {
    type: st.Address,
    version: ii.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Jd(t) {
  if (t && Lg(t, ec))
    throw new Error(`Memo exceeds maximum length of ${ec} bytes`);
  return { type: st.MemoString, content: t };
}
function lf(t, e) {
  return {
    type: st.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function Jl(t) {
  if (Gt(t).byteLength != Nc)
    throw Error("Invalid signature");
  return {
    type: st.MessageSignature,
    data: t
  };
}
function rE(t, e, n) {
  return typeof t == "string" && (t = mE(t)), typeof n == "string" && (n = Jd(n)), {
    type: st.Payload,
    payloadType: Yt.TokenTransfer,
    recipient: t,
    amount: an(e),
    memo: n ?? Jd("")
  };
}
function sE(t, e, n, r) {
  return typeof e == "string" && (e = nr(e)), typeof n == "string" && (n = nr(n)), {
    type: st.Payload,
    payloadType: Yt.ContractCall,
    contractAddress: typeof t == "string" ? Is(t) : t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function iE(t) {
  return nr(t, 4, 1e5);
}
function th(t, e, n) {
  return typeof t == "string" && (t = nr(t)), typeof e == "string" && (e = iE(e)), typeof n == "number" ? {
    type: st.Payload,
    payloadType: Yt.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: st.Payload,
    payloadType: Yt.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function oE() {
  return { type: st.Payload, payloadType: Yt.PoisonMicroblock };
}
function eh(t, e) {
  if (t.byteLength != Ks)
    throw Error(`Coinbase buffer size must be ${Ks} bytes`);
  return e != null ? {
    type: st.Payload,
    payloadType: Yt.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: st.Payload,
    payloadType: Yt.Coinbase,
    coinbaseBytes: t
  };
}
function aE(t, e, n) {
  if (t.byteLength != Ks)
    throw Error(`Coinbase buffer size must be ${Ks} bytes`);
  if (n.byteLength != Vl)
    throw Error(`VRF proof buffer size must be ${Vl} bytes`);
  return {
    type: st.Payload,
    payloadType: Yt.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === zt.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
function cE(t, e, n, r, s, i, o) {
  return {
    type: st.Payload,
    payloadType: Yt.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function nr(t, e, n) {
  const r = e || 1, s = n || Kx;
  if (Lg(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: st.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function lE(t, e, n) {
  return {
    type: st.Asset,
    address: Is(t),
    contractName: nr(e),
    assetName: nr(n)
  };
}
function Is(t) {
  const e = yi.c32addressDecode(t);
  return {
    type: st.Address,
    version: e[0],
    hash160: e[1]
  };
}
function uE(t, e) {
  const n = Is(t), r = nr(e);
  return {
    type: st.Principal,
    prefix: hn.Contract,
    address: n,
    contractName: r
  };
}
function fE(t) {
  const e = Is(t);
  return {
    type: st.Principal,
    prefix: hn.Standard,
    address: e
  };
}
function Ni(t, e) {
  return {
    pubKeyEncoding: t,
    type: st.TransactionAuthField,
    contents: e
  };
}
function _r(t) {
  switch (t.type) {
    case st.Address:
      return Xo(t);
    case st.Principal:
      return xg(t);
    case st.LengthPrefixedString:
      return Qi(t);
    case st.MemoString:
      return hE(t);
    case st.Asset:
      return Eg(t);
    case st.PostCondition:
      return vg(t);
    case st.PublicKey:
      return nu(t);
    case st.LengthPrefixedList:
      return uf(t);
    case st.Payload:
      return kg(t);
    case st.TransactionAuthField:
      return bE(t);
    case st.MessageSignature:
      return ff(t);
  }
}
function Xo(t) {
  const e = [];
  return e.push(Gt(Ro(t.version, 1))), e.push(Gt(t.hash160)), Pe(e);
}
function Zi(t) {
  const e = vn(t, ie) ? t : new ie(t), n = xc(ht(e.readBytes(1))), r = ht(e.readBytes(20));
  return { type: st.Address, version: n, hash160: r };
}
function xg(t) {
  const e = [];
  return e.push(t.prefix), (t.prefix === hn.Standard || t.prefix === hn.Contract) && e.push(Xo(t.address)), t.prefix === hn.Contract && e.push(Qi(t.contractName)), Pe(e);
}
function dE(t) {
  const e = vn(t, ie) ? t : new ie(t), n = e.readUInt8Enum(hn, (i) => {
    throw new fn(`Unexpected Principal payload type: ${i}`);
  });
  if (n === hn.Origin)
    return { type: st.Principal, prefix: n };
  const r = Zi(e);
  if (n === hn.Standard)
    return { type: st.Principal, prefix: n, address: r };
  const s = Kn(e);
  return {
    type: st.Principal,
    prefix: n,
    address: r,
    contractName: s
  };
}
function Qi(t) {
  const e = [], n = di(t.content), r = n.byteLength;
  return e.push(Gt(Ro(r, t.lengthPrefixBytes))), e.push(n), Pe(e);
}
function Kn(t, e, n) {
  e = e || 1;
  const r = vn(t, ie) ? t : new ie(t), s = xc(ht(r.readBytes(e))), i = Go(r.readBytes(s));
  return nr(i, e, n ?? 128);
}
function hE(t) {
  const e = [], n = di(t.content), r = jE(ht(n), ec * 2);
  return e.push(Gt(r)), Pe(e);
}
function Sg(t) {
  const e = vn(t, ie) ? t : new ie(t);
  let n = Go(e.readBytes(ec));
  return n = n.replace(/\u0000*$/, ""), { type: st.MemoString, content: n };
}
function Eg(t) {
  const e = [];
  return e.push(Xo(t.address)), e.push(Qi(t.contractName)), e.push(Qi(t.assetName)), Pe(e);
}
function tu(t) {
  const e = vn(t, ie) ? t : new ie(t);
  return {
    type: st.Asset,
    address: Zi(e),
    contractName: Kn(e),
    assetName: Kn(e)
  };
}
function uf(t) {
  const e = t.values, n = [];
  n.push(Gt(Ro(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(_r(r));
  return Pe(n);
}
function Ag(t, e, n) {
  const r = vn(t, ie) ? t : new ie(t), s = xc(ht(r.readBytes(4))), i = [];
  for (let o = 0; o < s; o++)
    switch (e) {
      case st.Address:
        i.push(Zi(r));
        break;
      case st.LengthPrefixedString:
        i.push(Kn(r));
        break;
      case st.MemoString:
        i.push(Sg(r));
        break;
      case st.Asset:
        i.push(tu(r));
        break;
      case st.PostCondition:
        i.push(gE(r));
        break;
      case st.PublicKey:
        i.push(ru(r));
        break;
      case st.TransactionAuthField:
        i.push(wE(r));
        break;
    }
  return lf(i, n);
}
function pE(t) {
  return ht(vg(t));
}
function vg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(xg(t.principal)), (t.conditionType === he.Fungible || t.conditionType === he.NonFungible) && e.push(Eg(t.asset)), t.conditionType === he.NonFungible && e.push(mr(t.assetName)), e.push(t.conditionCode), t.conditionType === he.STX || t.conditionType === he.Fungible || t.conditionType === he.Staking) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Mi("The post-condition amount may not be larger than 8 bytes");
    e.push(ks(t.amount, 8));
  }
  return Pe(e);
}
function gE(t) {
  const e = vn(t, ie) ? t : new ie(t), n = e.readUInt8Enum(he, (a) => {
    throw new fn(`Could not read ${a} as PostConditionType`);
  }), r = dE(e);
  let s, i, o;
  switch (n) {
    case he.STX:
      return s = e.readUInt8Enum(Lo, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ht(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: he.STX,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case he.Fungible:
      return i = tu(e), s = e.readUInt8Enum(Lo, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ht(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: he.Fungible,
        principal: r,
        conditionCode: s,
        amount: o,
        asset: i
      };
    case he.NonFungible:
      i = tu(e);
      const a = yr(e);
      return s = e.readUInt8Enum(Wl, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), {
        type: st.PostCondition,
        conditionType: he.NonFungible,
        principal: r,
        conditionCode: s,
        asset: i,
        assetName: a
      };
    case he.Staking:
      return s = e.readUInt8Enum(Lo, (c) => {
        throw new fn(`Could not read ${c} as FungibleConditionCode`);
      }), o = BigInt(`0x${ht(e.readBytes(8))}`), {
        type: st.PostCondition,
        conditionType: he.Staking,
        principal: r,
        conditionCode: s,
        amount: o
      };
    case he.PoX: {
      const c = e.readUInt8Enum(Xl, (u) => {
        throw new fn(`Could not read ${u} as PoxConditionCode`);
      });
      return {
        type: st.PostCondition,
        conditionType: he.PoX,
        principal: r,
        conditionCode: c
      };
    }
  }
}
function kg(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Yt.TokenTransfer:
      e.push(mr(t.recipient)), e.push(ks(t.amount, 8)), e.push(_r(t.memo));
      break;
    case Yt.ContractCall:
      e.push(_r(t.contractAddress)), e.push(_r(t.contractName)), e.push(_r(t.functionName));
      const n = new Uint8Array(4);
      Xs(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(mr(r));
      });
      break;
    case Yt.SmartContract:
      e.push(_r(t.contractName)), e.push(_r(t.codeBody));
      break;
    case Yt.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(_r(t.contractName)), e.push(_r(t.codeBody));
      break;
    case Yt.PoisonMicroblock:
      break;
    case Yt.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Yt.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(mr(t.recipient));
      break;
    case Yt.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(mr(t.recipient ? mg(t.recipient) : bg())), e.push(t.vrfProof);
      break;
    case Yt.TenureChange:
      e.push(Gt(t.tenureHash)), e.push(Gt(t.previousTenureHash)), e.push(Gt(t.burnViewHash)), e.push(Gt(t.previousTenureEnd)), e.push(Xs(new Uint8Array(4), t.previousTenureBlocks)), e.push(db(new Uint8Array(1), t.cause)), e.push(Gt(t.publicKeyHash));
      break;
  }
  return Pe(e);
}
function yE(t) {
  const e = vn(t, ie) ? t : new ie(t);
  switch (e.readUInt8Enum(Yt, (r) => {
    throw new Error(`Cannot recognize PayloadType: ${r}`);
  })) {
    case Yt.TokenTransfer:
      const r = yr(e), s = an(e.readBytes(8)), i = Sg(e);
      return rE(r, s, i);
    case Yt.ContractCall:
      const o = Zi(e), a = Kn(e), c = Kn(e), u = [], f = e.readUInt32BE();
      for (let _ = 0; _ < f; _++) {
        const N = yr(e);
        u.push(N);
      }
      return sE(o, a, c, u);
    case Yt.SmartContract:
      const l = Kn(e), w = Kn(e, 4, 1e5);
      return th(l, w);
    case Yt.VersionedSmartContract: {
      const _ = e.readUInt8Enum(ql, (et) => {
        throw new Error(`Cannot recognize ClarityVersion: ${et}`);
      }), N = Kn(e), J = Kn(e, 4, nS);
      return th(N, J, _);
    }
    case Yt.PoisonMicroblock:
      return oE();
    case Yt.Coinbase: {
      const _ = e.readBytes(Ks);
      return eh(_);
    }
    case Yt.CoinbaseToAltRecipient: {
      const _ = e.readBytes(Ks), N = yr(e);
      return eh(_, N);
    }
    case Yt.NakamotoCoinbase: {
      const _ = e.readBytes(Ks), N = yr(e), J = e.readBytes(Vl);
      return aE(_, N, J);
    }
    case Yt.TenureChange:
      const p = ht(e.readBytes(20)), m = ht(e.readBytes(20)), S = ht(e.readBytes(20)), M = ht(e.readBytes(32)), R = e.readUInt32BE(), z = e.readUInt8Enum(Yl, (_) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${_}`);
      }), E = ht(e.readBytes(20));
      return cE(p, m, S, M, R, z, E);
  }
}
function eu(t) {
  const e = vn(t, ie) ? t : new ie(t);
  return Jl(ht(e.readBytes(Nc)));
}
function wE(t) {
  const e = vn(t, ie) ? t : new ie(t), n = e.readUInt8Enum(Jn, (r) => {
    throw new fn(`Could not read ${r} as AuthFieldType`);
  });
  switch (n) {
    case Jn.PublicKeyCompressed:
      return Ni(me.Compressed, ru(e));
    case Jn.PublicKeyUncompressed:
      return Ni(me.Uncompressed, oo(QE(ru(e).data)));
    case Jn.SignatureCompressed:
      return Ni(me.Compressed, eu(e));
    case Jn.SignatureUncompressed:
      return Ni(me.Uncompressed, eu(e));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(n)}`);
  }
}
function ff(t) {
  return Gt(t.data);
}
function bE(t) {
  const e = [];
  switch (t.contents.type) {
    case st.PublicKey:
      e.push(t.pubKeyEncoding === me.Compressed ? Jn.PublicKeyCompressed : Jn.PublicKeyUncompressed), e.push(Gt(ZE(t.contents.data)));
      break;
    case st.MessageSignature:
      e.push(t.pubKeyEncoding === me.Compressed ? Jn.SignatureCompressed : Jn.SignatureUncompressed), e.push(ff(t.contents));
      break;
  }
  return Pe(e);
}
function nu(t) {
  return t.data.slice();
}
function ru(t) {
  const e = vn(t, ie) ? t : new ie(t), n = e.readUInt8(), r = n === 4 ? Wx : qx;
  return oo(Pe([n, e.readBytes(r)]));
}
function df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === ne.P2PKH || e === ne.P2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === ne.P2WPKH || e === ne.P2WSH || e === ne.P2WSHNonSequential) && !r.map((s) => s.data).every(ao))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case ne.P2PKH:
      return wa(t, zE(r[0].data));
    case ne.P2WPKH:
      return wa(t, RE(r[0].data));
    case ne.P2SH:
    case ne.P2SHNonSequential:
      return wa(t, GE(n, r.map(nu)));
    case ne.P2WSH:
    case ne.P2WSHNonSequential:
      return wa(t, KE(n, r.map(nu)));
  }
}
function wa(t, e) {
  return { type: st.Address, version: t, hash160: e };
}
function hf(t) {
  return yi.c32address(t.version, t.hash160);
}
function nh(t) {
  const [e, n, r] = t.split(/\.|::/);
  return lE(e, n, r);
}
function bo(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return uE(e, n);
  } else
    return fE(t);
}
function mE(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return EE(e, n);
  } else
    return xE(t);
}
function xE(t) {
  const e = Is(t);
  return { type: zt.PrincipalStandard, value: hf(e) };
}
function SE(t) {
  return { type: zt.PrincipalStandard, value: hf(t) };
}
function EE(t, e) {
  const n = Is(t), r = nr(e);
  return $g(n, r);
}
function $g(t, e) {
  if (di(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return {
    type: zt.PrincipalContract,
    value: `${hf(t)}.${e.content}`
  };
}
function AE(t) {
  return { type: zt.ResponseErr, value: t };
}
function vE(t) {
  return { type: zt.ResponseOk, value: t };
}
const kE = (t) => ({ type: zt.StringASCII, value: t }), $E = (t) => ({ type: zt.StringUTF8, value: t });
function IE(t) {
  for (const e in t)
    if (!VE(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: zt.Tuple, value: t };
}
function yr(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new ie(Gt(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new ie(t) : e = t;
  switch (e.readUInt8Enum(je, (r) => {
    throw new fn(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case je.int:
      return JS(Tl(e.readBytes(16)));
    case je.uint:
      return tE(e.readBytes(16));
    case je.buffer:
      const r = e.readUInt32BE();
      return ZS(e.readBytes(r));
    case je.true:
      return XS();
    case je.false:
      return YS();
    case je.address:
      const s = Zi(e);
      return SE(s);
    case je.contract:
      const i = Zi(e), o = Kn(e);
      return $g(i, o);
    case je.ok:
      return vE(yr(e));
    case je.err:
      return AE(yr(e));
    case je.none:
      return bg();
    case je.some:
      return mg(yr(e));
    case je.list:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(yr(e));
      return eE(c);
    case je.tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const M = Kn(e).content;
        if (M === void 0)
          throw new fn('"content" is undefined');
        f[M] = yr(e);
      }
      return IE(f);
    case je.ascii:
      const l = e.readUInt32BE(), w = sb(e.readBytes(l));
      return kE(w);
    case je.utf8:
      const p = e.readUInt32BE(), m = Go(e.readBytes(p));
      return $E(m);
    default:
      throw new fn("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
function vr(t, e) {
  return Pe([cf(t), e]);
}
function LE(t) {
  return new Uint8Array([cf(t.type)]);
}
function CE(t) {
  return t.type === zt.OptionalNone ? new Uint8Array([cf(t.type)]) : vr(t.type, mr(t.value));
}
function TE(t) {
  const e = new Uint8Array(4);
  return Xs(e, Math.ceil(t.value.length / 2), 0), vr(t.type, Er(e, Gt(t.value)));
}
function BE(t) {
  const e = Uu(Jw(BigInt(t.value), BigInt(Vx)), lg);
  return vr(t.type, e);
}
function ME(t) {
  const e = Uu(BigInt(t.value), lg);
  return vr(t.type, e);
}
function NE(t) {
  return vr(t.type, Xo(Is(t.value)));
}
function PE(t) {
  const [e, n] = qE(t.value);
  return vr(t.type, Er(Xo(Is(e)), Qi(nr(n))));
}
function _E(t) {
  return vr(t.type, mr(t.value));
}
function UE(t) {
  const e = [], n = new Uint8Array(4);
  Xs(n, t.value.length, 0), e.push(n);
  for (const r of t.value) {
    const s = mr(r);
    e.push(s);
  }
  return vr(t.type, Pe(e));
}
function HE(t) {
  const e = [], n = new Uint8Array(4);
  Xs(n, Object.keys(t.value).length, 0), e.push(n);
  const r = Object.keys(t.value).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = nr(s);
    e.push(Qi(i));
    const o = mr(t.value[s]);
    e.push(o);
  }
  return vr(t.type, Pe(e));
}
function Ig(t, e) {
  const n = [], r = e == "ascii" ? rb(t.value) : di(t.value), s = new Uint8Array(4);
  return Xs(s, r.length, 0), n.push(s), n.push(r), vr(t.type, Pe(n));
}
function OE(t) {
  return Ig(t, "ascii");
}
function DE(t) {
  return Ig(t, "utf8");
}
function rh(t) {
  return ht(mr(t));
}
function mr(t) {
  switch (t.type) {
    case zt.BoolTrue:
    case zt.BoolFalse:
      return LE(t);
    case zt.OptionalNone:
    case zt.OptionalSome:
      return CE(t);
    case zt.Buffer:
      return TE(t);
    case zt.UInt:
      return ME(t);
    case zt.Int:
      return BE(t);
    case zt.PrincipalStandard:
      return NE(t);
    case zt.PrincipalContract:
      return PE(t);
    case zt.ResponseOk:
    case zt.ResponseErr:
      return _E(t);
    case zt.List:
      return UE(t);
    case zt.Tuple:
      return HE(t);
    case zt.StringASCII:
      return OE(t);
    case zt.StringUTF8:
      return DE(t);
    default:
      throw new Mi("Unable to serialize. Invalid Clarity Value.");
  }
}
const FE = (t) => t.length % 2 ? `0${t}` : t, jE = (t, e) => t.padEnd(e, "0"), Lg = (t, e) => t ? di(t).length > e : !1;
function su(t) {
  return ig(t);
}
const No = (t) => SS(sf(t)), pf = (t) => ht(WS(t)), zE = (t) => ht(No(t)), RE = (t) => {
  const e = No(t), n = Er(new Uint8Array([0]), new Uint8Array([e.length]), e), r = No(n);
  return ht(r);
}, GE = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = No(r);
  return ht(s);
}, KE = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = Pe(n), s = sf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = Pe(i), a = No(o);
  return ht(a);
};
function VE(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function qE(t) {
  const [e, n] = t.split(".");
  if (!e || !n)
    throw new Error(`Invalid contract identifier: ${t}`);
  return [e, n];
}
Te.hmacSha256Sync = (t, ...e) => {
  const n = hg.create(sf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function oo(t) {
  return t = typeof t == "string" ? Gt(t) : t, {
    type: st.PublicKey,
    data: t
  };
}
function WE(t, e, n = me.Compressed) {
  const r = cb(e), s = new Un(rd(r.r), rd(r.s)), i = Ht.fromSignature(t, s, r.recoveryId), o = n === me.Compressed;
  return i.toHex(o);
}
function XE(t) {
  return typeof t == "string" ? t : ht(t);
}
const gf = XE;
function Cg(t) {
  return (typeof t == "string" ? t.length / 2 : t.byteLength) === ab;
}
function ao(t) {
  return !gf(t).startsWith("04");
}
function YE(t) {
  t = Hu(t);
  const e = Cg(t);
  return ht(Ko(t.slice(0, 32), e));
}
function ZE(t) {
  return Ht.fromHex(gf(t)).toHex(!0);
}
function QE(t) {
  return Ht.fromHex(gf(t)).toHex(!1);
}
function JE(t, e) {
  t = Hu(t);
  const [n, r] = Ec(e, t.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  return Ro(r, 1) + Un.fromHex(n).toCompactHex();
}
function yf() {
  return {
    type: st.MessageSignature,
    data: ht(new Uint8Array(Nc))
  };
}
function Tg(t, e, n, r) {
  const s = df(0, t, 1, [oo(e)]).hash160, i = ao(e) ? me.Compressed : me.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: an(n),
    fee: an(r),
    keyEncoding: i,
    signature: yf()
  };
}
function Po(t) {
  return "signature" in t;
}
function sh(t) {
  return t === ne.P2SH || t === ne.P2WSH;
}
function t3(t) {
  return t === ne.P2SHNonSequential || t === ne.P2WSHNonSequential;
}
function ih(t) {
  const e = su(t);
  return e.nonce = 0, e.fee = 0, Po(e) ? e.signature = yf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function e3(t) {
  const e = [
    t.hashMode,
    Gt(t.signer),
    ks(t.nonce, 8),
    ks(t.fee, 8),
    t.keyEncoding,
    ff(t.signature)
  ];
  return Pe(e);
}
function n3(t) {
  const e = [
    t.hashMode,
    Gt(t.signer),
    ks(t.nonce, 8),
    ks(t.fee, 8)
  ], n = lf(t.fields);
  e.push(uf(n));
  const r = new Uint8Array(2);
  return ub(r, t.signaturesRequired, 0), e.push(r), Pe(e);
}
function r3(t, e) {
  const n = ht(e.readBytes(20)), r = BigInt(`0x${ht(e.readBytes(8))}`), s = BigInt(`0x${ht(e.readBytes(8))}`), i = e.readUInt8Enum(me, (a) => {
    throw new fn(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === ne.P2WPKH && i != me.Compressed)
    throw new fn("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = eu(e);
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
  const n = ht(e.readBytes(20)), r = BigInt("0x" + ht(e.readBytes(8))), s = BigInt("0x" + ht(e.readBytes(8))), i = Ag(e, st.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case st.PublicKey:
        ao(u.contents.data) || (o = !0);
        break;
      case st.MessageSignature:
        if (u.pubKeyEncoding === me.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Fs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === ne.P2WSH || t === ne.P2WSHNonSequential))
    throw new Fs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function il(t) {
  return Po(t) ? e3(t) : n3(t);
}
function ol(t) {
  const e = t.readUInt8Enum(ne, (n) => {
    throw new fn(`Could not parse ${n} as AddressHashMode`);
  });
  return e === ne.P2PKH || e === ne.P2WPKH ? r3(e, t) : s3(e, t);
}
function Bg(t, e, n, r) {
  const i = t + ht(new Uint8Array([e])) + ht(ks(n, 8)) + ht(ks(r, 8));
  if (Gt(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return pf(Gt(i));
}
function Mg(t, e, n) {
  const r = 33 + Nc, s = ao(e.data) ? me.Compressed : me.Uncompressed, i = t + FE(s.toString(16)) + n, o = Gt(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return pf(o);
}
function i3(t, e, n, r, s) {
  const i = Bg(t, e, n, r), o = JE(s, i), a = oo(YE(s)), c = Mg(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ng(t, e, n, r, s, i) {
  const o = Bg(t, e, n, r), a = oo(WE(o, i, s)), c = Mg(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function o3() {
  const t = Tg(ne.P2PKH, "", 0, 0);
  return t.signer = nE().hash160, t.keyEncoding = me.Compressed, t.signature = yf(), t;
}
function oh(t, e, n) {
  return Po(t) ? a3(t, e, n) : c3(t, e, n);
}
function a3(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ng(e, n, t.fee, t.nonce, t.keyEncoding, t.signature.data), i = df(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Fs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function c3(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case st.PublicKey:
        ao(c.contents.data) || (i = !0), r.push(c.contents);
        break;
      case st.MessageSignature:
        c.pubKeyEncoding === me.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Ng(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents.data);
        if (sh(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Fs("Too many signatures");
        break;
    }
  if (sh(t.hashMode) && o !== t.signaturesRequired || t3(t.hashMode) && o < t.signaturesRequired)
    throw new Fs("Incorrect number of signatures");
  if (i && (t.hashMode === ne.P2WSH || t.hashMode === ne.P2WSHNonSequential))
    throw new Fs("Uncompressed keys are not allowed in this hash mode");
  const a = df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Fs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Pg(t) {
  return {
    authType: Le.Standard,
    spendingCondition: t
  };
}
function _g(t, e) {
  return {
    authType: Le.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || Tg(ne.P2PKH, "0".repeat(66), 0, 0)
  };
}
function ah(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Le.Standard:
        return Pg(ih(t.spendingCondition));
      case Le.Sponsored:
        return _g(ih(t.spendingCondition), o3());
      default:
        throw new rc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function l3(t, e) {
  switch (t.authType) {
    case Le.Standard:
      return oh(t.spendingCondition, e, Le.Standard);
    case Le.Sponsored:
      return oh(t.spendingCondition, e, Le.Standard);
    default:
      throw new rc("Invalid origin auth type");
  }
}
function u3(t, e) {
  switch (t.authType) {
    case Le.Standard:
      const n = {
        ...t.spendingCondition,
        fee: an(e)
      };
      return { ...t, spendingCondition: n };
    case Le.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: an(e)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function f3(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: an(e)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function d3(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: an(e)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function h3(t, e) {
  const n = {
    ...e,
    nonce: an(e.nonce),
    fee: an(e.fee)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function p3(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Le.Standard:
      e.push(il(t.spendingCondition));
      break;
    case Le.Sponsored:
      e.push(il(t.spendingCondition)), e.push(il(t.sponsorSpendingCondition));
      break;
  }
  return Pe(e);
}
function g3(t) {
  const e = t.readUInt8Enum(Le, (r) => {
    throw new fn(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Le.Standard:
      return n = ol(t), Pg(n);
    case Le.Sponsored:
      n = ol(t);
      const r = ol(t);
      return _g(n, r);
  }
}
class y3 {
  constructor({ auth: e, payload: n, postConditions: r = lf([]), postConditionMode: s = nc.Deny, transactionVersion: i, chainId: o, network: a = "mainnet" }) {
    a = Rx(a), this.transactionVersion = i ?? a.transactionVersion, this.chainId = o ?? a.chainId, this.auth = e, "amount" in n ? this.payload = {
      ...n,
      amount: an(n.amount)
    } : this.payload = n, this.postConditionMode = s, this.postConditions = r, this.anchorMode = Bn.Any;
  }
  signBegin() {
    const e = su(this);
    return e.auth = ah(e.auth), e.txid();
  }
  verifyBegin() {
    const e = su(this);
    return e.auth = ah(e.auth), e.txid();
  }
  verifyOrigin() {
    return l3(this.auth, this.verifyBegin());
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
    const n = typeof e == "object" && "type" in e ? e : oo(e), r = this.auth.spendingCondition;
    if (r && !Po(r)) {
      const s = ao(n.data);
      r.fields.push(Ni(s ? me.Compressed : me.Uncompressed, n));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = i3(n, r, e.fee, e.nonce, s);
    if (Po(e))
      e.signature = Jl(i);
    else {
      const a = Cg(s);
      e.fields.push(Ni(a ? me.Compressed : me.Uncompressed, Jl(i)));
    }
    return o;
  }
  txid() {
    const e = this.serializeBytes();
    return pf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new rc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = h3(this.auth, e);
  }
  setFee(e) {
    this.auth = u3(this.auth, e);
  }
  setNonce(e) {
    this.auth = f3(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Le.Sponsored)
      throw new rc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = d3(this.auth, e);
  }
  serialize() {
    return ht(this.serializeBytes());
  }
  serializeBytes() {
    if (this.transactionVersion === void 0)
      throw new Mi('"transactionVersion" is undefined');
    if (this.chainId === void 0)
      throw new Mi('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Mi('"auth" is undefined');
    if (this.payload === void 0)
      throw new Mi('"payload" is undefined');
    const e = [];
    e.push(this.transactionVersion);
    const n = new Uint8Array(4);
    return Xs(n, this.chainId, 0), e.push(n), e.push(p3(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(uf(this.postConditions)), e.push(kg(this.payload)), Pe(e);
  }
}
function w3(t) {
  const e = vn(t, ie) ? t : new ie(t), n = e.readUInt8Enum(si, (f) => {
    throw new Error(`Could not parse ${f} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = g3(e), i = e.readUInt8Enum(Bn, (f) => {
    throw new Error(`Could not parse ${f} as AnchorMode`);
  }), o = e.readUInt8Enum(nc, (f) => {
    throw new Error(`Could not parse ${f} as PostConditionMode`);
  }), a = Ag(e, st.PostCondition), c = yE(e), u = new y3({
    transactionVersion: n,
    chainId: r,
    auth: s,
    payload: c,
    postConditions: a,
    postConditionMode: o
  });
  return u.anchorMode = i, u;
}
const ch = BigInt("18446744073709551615");
function al(t) {
  const e = an(t);
  if (e < 0n || e > ch)
    throw new RangeError(`Post-condition amount must be between 0 and ${ch} (u64 max), received: ${e}`);
  return e;
}
var iu;
(function(t) {
  t[t.eq = 1] = "eq", t[t.gt = 2] = "gt", t[t.lt = 4] = "lt", t[t.gte = 3] = "gte", t[t.lte = 5] = "lte", t[t.sent = 16] = "sent", t[t["not-sent"] = 17] = "not-sent", t[t["maybe-sent"] = 18] = "maybe-sent";
})(iu || (iu = {}));
var ou;
(function(t) {
  t[t["will-not-perform"] = 48] = "will-not-perform", t[t["may-perform"] = 49] = "may-perform", t[t["will-perform"] = 50] = "will-perform";
})(ou || (ou = {}));
function b3(t) {
  switch (t.type) {
    case "stx-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.STX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: hn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        amount: al(t.amount)
      };
    case "ft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.Fungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: hn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        amount: al(t.amount),
        asset: nh(t.asset)
      };
    case "nft-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.NonFungible,
        principal: t.address === "origin" ? { type: st.Principal, prefix: hn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        asset: nh(t.asset),
        assetName: t.assetId
      };
    case "staking-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.Staking,
        principal: t.address === "origin" ? { type: st.Principal, prefix: hn.Origin } : bo(t.address),
        conditionCode: ba(t.condition),
        amount: al(t.amount)
      };
    case "pox-postcondition":
      return {
        type: st.PostCondition,
        conditionType: he.PoX,
        principal: t.address === "origin" ? { type: st.Principal, prefix: hn.Origin } : bo(t.address),
        conditionCode: m3(t.condition)
      };
    default:
      throw new Error("Invalid post condition type");
  }
}
function ba(t) {
  return iu[t];
}
function m3(t) {
  return ou[t];
}
function Ug(t) {
  const e = b3(t);
  return pE(e);
}
function x3(t, e, n) {
  return bf(Hg(t), n);
}
function Hg(t, e) {
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
      r = r.padStart(r.length + r.length % 2, "0"), n = _o(r);
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
function wf(t, e = 8) {
  return (typeof t == "bigint" ? t : Hg(t)).toString(16).padStart(e * 2, "0");
}
function bf(t, e = 16) {
  const n = wf(t, e);
  return _o(n);
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
function _o(t) {
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
function mf(t) {
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
function lh(t) {
  if (t.some(k3))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function xf(...t) {
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
function Rr(t) {
  return xf(...t.map((e) => typeof e == "number" ? lh([e]) : e instanceof Array ? lh(e) : e));
}
function Uc(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var au;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(au || (au = {}));
au.Mainnet;
const $3 = 128, I3 = 128, Og = 16;
var cu;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(cu || (cu = {}));
var uh;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(uh || (uh = {}));
var fh;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(fh || (fh = {}));
var Qn;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(Qn || (Qn = {}));
const cl = ["onChainOnly", "offChainOnly", "any"];
cl[0] + "", Qn.OnChainOnly, cl[1] + "", Qn.OffChainOnly, cl[2] + "", Qn.Any, Qn.OnChainOnly + "", Qn.OnChainOnly, Qn.OffChainOnly + "", Qn.OffChainOnly, Qn.Any + "", Qn.Any;
var lu;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(lu || (lu = {}));
lu.Mainnet;
var dh;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(dh || (dh = {}));
var Us;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Us || (Us = {}));
var hh;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(hh || (hh = {}));
var ph;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(ph || (ph = {}));
var gh;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(gh || (gh = {}));
var yh;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(yh || (yh = {}));
var wh;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(wh || (wh = {}));
var bh;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(bh || (bh = {}));
var uu;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(uu || (uu = {}));
var mh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(mh || (mh = {}));
var xh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(xh || (xh = {}));
function fu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function L3(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function Dg(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function C3(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  fu(t.outputLen), fu(t.blockLen);
}
function T3(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function B3(t, e) {
  Dg(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const ll = {
  number: fu,
  bool: L3,
  bytes: Dg,
  hash: C3,
  exists: T3,
  output: B3
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const ul = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), dr = (t, e) => t << 32 - e | t >>> e, M3 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!M3)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function N3(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Fg(t) {
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
function bi(t) {
  const e = (r) => t().update(Fg(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function _3(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
let Sf = class extends P3 {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = ul(this.buffer);
  }
  update(e) {
    ll.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Fg(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = ul(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    ll.exists(this), ll.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    _3(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = ul(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const U3 = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), jg = Uint8Array.from({ length: 16 }, (t, e) => e), H3 = jg.map((t) => (9 * t + 5) % 16);
let Ef = [jg], Af = [H3];
for (let t = 0; t < 4; t++)
  for (let e of [Ef, Af])
    e.push(e[t].map((n) => U3[n]));
const zg = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), O3 = Ef.map((t, e) => t.map((n) => zg[e][n])), D3 = Af.map((t, e) => t.map((n) => zg[e][n])), F3 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), j3 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), ma = (t, e) => t << e | t >>> 32 - e;
function Sh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const xa = new Uint32Array(16);
let z3 = class extends Sf {
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
      xa[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, S = F3[p], M = j3[p], R = Ef[p], z = Af[p], E = O3[p], _ = D3[p];
      for (let N = 0; N < 16; N++) {
        const J = ma(r + Sh(p, i, a, u) + xa[R[N]] + S, E[N]) + l | 0;
        r = l, l = u, u = ma(a, 10) | 0, a = i, i = J;
      }
      for (let N = 0; N < 16; N++) {
        const J = ma(s + Sh(m, o, c, f) + xa[z[N]] + M, _[N]) + w | 0;
        s = w, w = f, f = ma(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    xa.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
};
bi(() => new z3());
const R3 = (t, e, n) => t & e ^ ~t & n, G3 = (t, e, n) => t & e ^ t & n ^ e & n, K3 = new Uint32Array([
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
let Rg = class extends Sf {
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
      const w = us[l - 15], p = us[l - 2], m = dr(w, 7) ^ dr(w, 18) ^ w >>> 3, S = dr(p, 17) ^ dr(p, 19) ^ p >>> 10;
      us[l] = S + us[l - 7] + m + us[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = dr(a, 6) ^ dr(a, 11) ^ dr(a, 25), p = f + w + R3(a, c, u) + K3[l] + us[l] | 0, S = (dr(r, 2) ^ dr(r, 13) ^ dr(r, 22)) + G3(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    us.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}, V3 = class extends Rg {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
};
bi(() => new Rg());
bi(() => new V3());
const Sa = BigInt(2 ** 32 - 1), du = BigInt(32);
function Gg(t, e = !1) {
  return e ? { h: Number(t & Sa), l: Number(t >> du & Sa) } : { h: Number(t >> du & Sa) | 0, l: Number(t & Sa) | 0 };
}
function q3(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Gg(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const W3 = (t, e) => BigInt(t >>> 0) << du | BigInt(e >>> 0), X3 = (t, e, n) => t >>> n, Y3 = (t, e, n) => t << 32 - n | e >>> n, Z3 = (t, e, n) => t >>> n | e << 32 - n, Q3 = (t, e, n) => t << 32 - n | e >>> n, J3 = (t, e, n) => t << 64 - n | e >>> n - 32, tA = (t, e, n) => t >>> n - 32 | e << 64 - n, eA = (t, e) => e, nA = (t, e) => t, rA = (t, e, n) => t << n | e >>> 32 - n, sA = (t, e, n) => e << n | t >>> 32 - n, iA = (t, e, n) => e << n - 32 | t >>> 64 - n, oA = (t, e, n) => t << n - 32 | e >>> 64 - n;
function aA(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const cA = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), lA = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, uA = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), fA = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, dA = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), hA = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Nt = {
  fromBig: Gg,
  split: q3,
  toBig: W3,
  shrSH: X3,
  shrSL: Y3,
  rotrSH: Z3,
  rotrSL: Q3,
  rotrBH: J3,
  rotrBL: tA,
  rotr32H: eA,
  rotr32L: nA,
  rotlSH: rA,
  rotlSL: sA,
  rotlBH: iA,
  rotlBL: oA,
  add: aA,
  add3L: cA,
  add3H: lA,
  add4L: uA,
  add4H: fA,
  add5H: hA,
  add5L: dA
}, [pA, gA] = Nt.split([
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
let Hc = class extends Sf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: m, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      fs[E] = e.getUint32(n), ds[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = fs[E - 15] | 0, N = ds[E - 15] | 0, J = Nt.rotrSH(_, N, 1) ^ Nt.rotrSH(_, N, 8) ^ Nt.shrSH(_, N, 7), et = Nt.rotrSL(_, N, 1) ^ Nt.rotrSL(_, N, 8) ^ Nt.shrSL(_, N, 7), G = fs[E - 2] | 0, V = ds[E - 2] | 0, $ = Nt.rotrSH(G, V, 19) ^ Nt.rotrBH(G, V, 61) ^ Nt.shrSH(G, V, 6), P = Nt.rotrSL(G, V, 19) ^ Nt.rotrBL(G, V, 61) ^ Nt.shrSL(G, V, 6), b = Nt.add4L(et, P, ds[E - 7], ds[E - 16]), C = Nt.add4H(b, J, $, fs[E - 7], fs[E - 16]);
      fs[E] = C | 0, ds[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: m, Gh: S, Gl: M, Hh: R, Hl: z } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Nt.rotrSH(l, w, 14) ^ Nt.rotrSH(l, w, 18) ^ Nt.rotrBH(l, w, 41), N = Nt.rotrSL(l, w, 14) ^ Nt.rotrSL(l, w, 18) ^ Nt.rotrBL(l, w, 41), J = l & p ^ ~l & S, et = w & m ^ ~w & M, G = Nt.add5L(z, N, et, gA[E], ds[E]), V = Nt.add5H(G, R, _, J, pA[E], fs[E]), $ = G | 0, P = Nt.rotrSH(r, s, 28) ^ Nt.rotrBH(r, s, 34) ^ Nt.rotrBH(r, s, 39), b = Nt.rotrSL(r, s, 28) ^ Nt.rotrBL(r, s, 34) ^ Nt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, O = s & o ^ s & c ^ o & c;
      R = S | 0, z = M | 0, S = p | 0, M = m | 0, p = l | 0, m = w | 0, { h: l, l: w } = Nt.add(u | 0, f | 0, V | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Nt.add3L($, b, O);
      r = Nt.add3H(T, V, P, C), s = T | 0;
    }
    ({ h: r, l: s } = Nt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Nt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Nt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Nt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Nt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: m } = Nt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: S, l: M } = Nt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: R, l: z } = Nt.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, m, S, M, R, z);
  }
  roundClean() {
    fs.fill(0), ds.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}, yA = class extends Hc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}, wA = class extends Hc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}, bA = class extends Hc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
};
bi(() => new Hc());
bi(() => new yA());
bi(() => new wA());
bi(() => new bA());
function mA(t, e, n) {
  const s = $3;
  if (_A(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: cu.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: 1,
    maxLengthBytes: s
  };
}
var Ve;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Ve || (Ve = {}));
let xA = class extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}, Kg = class extends xA {
  constructor(e) {
    super(e);
  }
};
function Oc(t) {
  const e = [];
  return e.push(_o(wf(t.version, 1))), e.push(_o(t.hash160)), Rr(e);
}
function SA(t) {
  const e = [];
  return e.push(t.prefix), e.push(Oc(t.address)), t.prefix === uu.Contract && e.push(Uo(t.contractName)), Rr(e);
}
function Uo(t) {
  const e = [], n = mf(t.content), r = n.byteLength;
  return e.push(_o(wf(r, t.lengthPrefixBytes))), e.push(n), Rr(e);
}
function EA(t) {
  const e = [];
  return e.push(Oc(t.address)), e.push(Uo(t.contractName)), e.push(Uo(t.assetName)), Rr(e);
}
function Vg(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(SA(t.principal)), (t.conditionType === Us.Fungible || t.conditionType === Us.NonFungible) && e.push(EA(t.assetInfo)), t.conditionType === Us.NonFungible && e.push(oi(t.assetName)), e.push(t.conditionCode), t.conditionType === Us.STX || t.conditionType === Us.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Kg("The post-condition amount may not be larger than 8 bytes");
    e.push(x3(t.amount, !1, 8));
  }
  return Rr(e);
}
function kr(t, e) {
  return Rr([t, e]);
}
function AA(t) {
  return new Uint8Array([t.type]);
}
function vA(t) {
  return t.type === Ve.OptionalNone ? new Uint8Array([t.type]) : kr(t.type, oi(t.value));
}
function kA(t) {
  const e = new Uint8Array(4);
  return Uc(e, t.buffer.length, 0), kr(t.type, xf(e, t.buffer));
}
function $A(t) {
  const e = bf(S3(t.value, BigInt(I3)), Og);
  return kr(t.type, e);
}
function IA(t) {
  const e = bf(t.value, Og);
  return kr(t.type, e);
}
function LA(t) {
  return kr(t.type, Oc(t.address));
}
function CA(t) {
  return kr(t.type, xf(Oc(t.address), Uo(t.contractName)));
}
function TA(t) {
  return kr(t.type, oi(t.value));
}
function BA(t) {
  const e = [], n = new Uint8Array(4);
  Uc(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = oi(r);
    e.push(s);
  }
  return kr(t.type, Rr(e));
}
function MA(t) {
  const e = [], n = new Uint8Array(4);
  Uc(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = mA(s);
    e.push(Uo(i));
    const o = oi(t.data[s]);
    e.push(o);
  }
  return kr(t.type, Rr(e));
}
function qg(t, e) {
  const n = [], r = e == "ascii" ? v3(t.data) : mf(t.data), s = new Uint8Array(4);
  return Uc(s, r.length, 0), n.push(s), n.push(r), kr(t.type, Rr(n));
}
function NA(t) {
  return qg(t, "ascii");
}
function PA(t) {
  return qg(t, "utf8");
}
function oi(t) {
  switch (t.type) {
    case Ve.BoolTrue:
    case Ve.BoolFalse:
      return AA(t);
    case Ve.OptionalNone:
    case Ve.OptionalSome:
      return vA(t);
    case Ve.Buffer:
      return kA(t);
    case Ve.UInt:
      return IA(t);
    case Ve.Int:
      return $A(t);
    case Ve.PrincipalStandard:
      return LA(t);
    case Ve.PrincipalContract:
      return CA(t);
    case Ve.ResponseOk:
    case Ve.ResponseErr:
      return TA(t);
    case Ve.List:
      return BA(t);
    case Ve.Tuple:
      return MA(t);
    case Ve.StringASCII:
      return NA(t);
    case Ve.StringUTF8:
      return PA(t);
    default:
      throw new Kg("Unable to serialize. Invalid Clarity Value.");
  }
}
const _A = (t, e) => t ? mf(t).length > e : !1, UA = "connect-ui";
let Oa, Wg, Mn = !1, hu = !1;
const zr = (t, e = "") => () => {
}, HA = (t, e) => () => {
}, OA = "{visibility:hidden}.hydrated{visibility:inherit}", Eh = {}, DA = "http://www.w3.org/2000/svg", FA = "http://www.w3.org/1999/xhtml", jA = (t) => t != null, vf = (t) => (t = typeof t, t === "object" || t === "function");
function Xg(t) {
  var e, n, r;
  return (r = (n = (e = t.head) === null || e === void 0 ? void 0 : e.querySelector('meta[name="csp-nonce"]')) === null || n === void 0 ? void 0 : n.getAttribute("content")) !== null && r !== void 0 ? r : void 0;
}
const Lt = (t, e, ...n) => {
  let r = null, s = !1, i = !1;
  const o = [], a = (u) => {
    for (let f = 0; f < u.length; f++)
      r = u[f], Array.isArray(r) ? a(r) : r != null && typeof r != "boolean" && ((s = typeof t != "function" && !vf(r)) && (r = String(r)), s && i ? o[o.length - 1].$text$ += r : o.push(s ? pu(null, r) : r), i = s);
  };
  if (a(n), e) {
    const u = e.className || e.class;
    u && (e.class = typeof u != "object" ? u : Object.keys(u).filter((f) => u[f]).join(" "));
  }
  const c = pu(t, null);
  return c.$attrs$ = e, o.length > 0 && (c.$children$ = o), c;
}, pu = (t, e) => {
  const n = {
    $flags$: 0,
    $tag$: t,
    $text$: e,
    $elm$: null,
    $children$: null
  };
  return n.$attrs$ = null, n;
}, zA = {}, RA = (t) => t && t.$tag$ === zA, GA = (t, e) => t != null && !vf(t) && e & 4 ? t === "false" ? !1 : t === "" || !!t : t, KA = (t) => co(t).$hostElement$, VA = (t, e, n) => {
  const r = on.ce(e, n);
  return t.dispatchEvent(r), r;
}, Ah = /* @__PURE__ */ new WeakMap(), qA = (t, e, n) => {
  let r = sc.get(t);
  h4 && n ? (r = r || new CSSStyleSheet(), typeof r == "string" ? r = e : r.replaceSync(e)) : r = e, sc.set(t, r);
}, WA = (t, e, n, r) => {
  var s;
  let i = Yg(e);
  const o = sc.get(i);
  if (t = t.nodeType === 11 ? t : xr, o)
    if (typeof o == "string") {
      t = t.head || t;
      let a = Ah.get(t), c;
      if (a || Ah.set(t, a = /* @__PURE__ */ new Set()), !a.has(i)) {
        {
          c = xr.createElement("style"), c.innerHTML = o;
          const u = (s = on.$nonce$) !== null && s !== void 0 ? s : Xg(xr);
          u != null && c.setAttribute("nonce", u), t.insertBefore(c, t.querySelector("link"));
        }
        a && a.add(i);
      }
    } else t.adoptedStyleSheets.includes(o) || (t.adoptedStyleSheets = [...t.adoptedStyleSheets, o]);
  return i;
}, XA = (t) => {
  const e = t.$cmpMeta$, n = t.$hostElement$, r = e.$flags$, s = zr("attachStyles", e.$tagName$), i = WA(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
  r & 10 && (n["s-sc"] = i, n.classList.add(i + "-h")), s();
}, Yg = (t, e) => "sc-" + t.$tagName$, vh = (t, e, n, r, s, i) => {
  if (n !== r) {
    let o = $h(t, e), a = e.toLowerCase();
    if (e === "class") {
      const c = t.classList, u = kh(n), f = kh(r);
      c.remove(...u.filter((l) => l && !f.includes(l))), c.add(...f.filter((l) => l && !u.includes(l)));
    } else if (!o && e[0] === "o" && e[1] === "n")
      e[2] === "-" ? e = e.slice(3) : $h(Dc, a) ? e = a.slice(2) : e = a[2] + e.slice(3), n && on.rel(t, e, n, !1), r && on.ael(t, e, r, !1);
    else {
      const c = vf(r);
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
}, YA = /\s/, kh = (t) => t ? t.split(YA) : [], Zg = (t, e, n, r) => {
  const s = e.$elm$.nodeType === 11 && e.$elm$.host ? e.$elm$.host : e.$elm$, i = t && t.$attrs$ || Eh, o = e.$attrs$ || Eh;
  for (r in i)
    r in o || vh(s, r, i[r], void 0, n, e.$flags$);
  for (r in o)
    vh(s, r, i[r], o[r], n, e.$flags$);
}, kf = (t, e, n, r) => {
  const s = e.$children$[n];
  let i = 0, o, a;
  if (s.$text$ !== null)
    o = s.$elm$ = xr.createTextNode(s.$text$);
  else {
    if (Mn || (Mn = s.$tag$ === "svg"), o = s.$elm$ = xr.createElementNS(Mn ? DA : FA, s.$tag$), Mn && s.$tag$ === "foreignObject" && (Mn = !1), Zg(null, s, Mn), jA(Oa) && o["s-si"] !== Oa && o.classList.add(o["s-si"] = Oa), s.$children$)
      for (i = 0; i < s.$children$.length; ++i)
        a = kf(t, s, i), a && o.appendChild(a);
    s.$tag$ === "svg" ? Mn = !1 : o.tagName === "foreignObject" && (Mn = !0);
  }
  return o;
}, Qg = (t, e, n, r, s, i) => {
  let o = t, a;
  for (o.shadowRoot && o.tagName === Wg && (o = o.shadowRoot); s <= i; ++s)
    r[s] && (a = kf(null, n, s), a && (r[s].$elm$ = a, o.insertBefore(a, e)));
}, Jg = (t, e, n, r, s) => {
  for (; e <= n; ++e)
    (r = t[e]) && (s = r.$elm$, s.remove());
}, ZA = (t, e, n, r) => {
  let s = 0, i = 0, o = e.length - 1, a = e[0], c = e[o], u = r.length - 1, f = r[0], l = r[u], w;
  for (; s <= o && i <= u; )
    a == null ? a = e[++s] : c == null ? c = e[--o] : f == null ? f = r[++i] : l == null ? l = r[--u] : Ea(a, f) ? (Ao(a, f), a = e[++s], f = r[++i]) : Ea(c, l) ? (Ao(c, l), c = e[--o], l = r[--u]) : Ea(a, l) ? (Ao(a, l), t.insertBefore(a.$elm$, c.$elm$.nextSibling), a = e[++s], l = r[--u]) : Ea(c, f) ? (Ao(c, f), t.insertBefore(c.$elm$, a.$elm$), c = e[--o], f = r[++i]) : (w = kf(e && e[i], n, i), f = r[++i], w && a.$elm$.parentNode.insertBefore(w, a.$elm$));
  s > o ? Qg(t, r[u + 1] == null ? null : r[u + 1].$elm$, n, r, i, u) : i > u && Jg(e, s, o);
}, Ea = (t, e) => t.$tag$ === e.$tag$, Ao = (t, e) => {
  const n = e.$elm$ = t.$elm$, r = t.$children$, s = e.$children$, i = e.$tag$, o = e.$text$;
  o === null ? (Mn = i === "svg" ? !0 : i === "foreignObject" ? !1 : Mn, Zg(t, e, Mn), r !== null && s !== null ? ZA(n, r, e, s) : s !== null ? (t.$text$ !== null && (n.textContent = ""), Qg(n, null, e, s, 0, s.length - 1)) : r !== null && Jg(r, 0, r.length - 1), Mn && i === "svg" && (Mn = !1)) : t.$text$ !== o && (n.data = o);
}, QA = (t, e) => {
  const n = t.$hostElement$, r = t.$vnode$ || pu(null, null), s = RA(e) ? e : Lt(null, null, e);
  Wg = n.tagName, s.$tag$ = null, s.$flags$ |= 4, t.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, Oa = n["s-sc"], Ao(r, s);
}, ty = (t, e) => {
  e && !t.$onRenderResolve$ && e["s-p"] && e["s-p"].push(new Promise((n) => t.$onRenderResolve$ = n));
}, $f = (t, e) => {
  if (t.$flags$ |= 16, t.$flags$ & 4) {
    t.$flags$ |= 512;
    return;
  }
  return ty(t, t.$ancestorComponent$), g4(() => JA(t, e));
}, JA = (t, e) => {
  const n = zr("scheduleUpdate", t.$cmpMeta$.$tagName$), r = t.$lazyInstance$;
  let s;
  return n(), r4(s, () => t4(t, r, e));
}, t4 = async (t, e, n) => {
  const r = t.$hostElement$, s = zr("update", t.$cmpMeta$.$tagName$), i = r["s-rc"];
  n && XA(t);
  const o = zr("render", t.$cmpMeta$.$tagName$);
  e4(t, e), i && (i.map((a) => a()), r["s-rc"] = void 0), o(), s();
  {
    const a = r["s-p"], c = () => n4(t);
    a.length === 0 ? c() : (Promise.all(a).then(c), t.$flags$ |= 4, a.length = 0);
  }
}, e4 = (t, e, n) => {
  try {
    e = e.render(), t.$flags$ &= -17, t.$flags$ |= 2, QA(t, e);
  } catch (r) {
    Ho(r, t.$hostElement$);
  }
  return null;
}, n4 = (t) => {
  const e = t.$cmpMeta$.$tagName$, n = t.$hostElement$, r = zr("postUpdate", e), s = t.$ancestorComponent$;
  t.$flags$ & 64 ? r() : (t.$flags$ |= 64, ny(n), r(), t.$onReadyResolve$(n), s || ey()), t.$onRenderResolve$ && (t.$onRenderResolve$(), t.$onRenderResolve$ = void 0), t.$flags$ & 512 && Lf(() => $f(t, !1)), t.$flags$ &= -517;
}, ey = (t) => {
  ny(xr.documentElement), Lf(() => VA(Dc, "appload", { detail: { namespace: UA } }));
}, r4 = (t, e) => t && t.then ? t.then(e) : e(), ny = (t) => t.classList.add("hydrated"), s4 = (t, e) => co(t).$instanceValues$.get(e), i4 = (t, e, n, r) => {
  const s = co(t), i = s.$instanceValues$.get(e), o = s.$flags$, a = s.$lazyInstance$;
  n = GA(n, r.$members$[e][0]);
  const c = Number.isNaN(i) && Number.isNaN(n), u = n !== i && !c;
  (!(o & 8) || i === void 0) && u && (s.$instanceValues$.set(e, n), a && (o & 18) === 2 && $f(s, !1));
}, ry = (t, e, n) => {
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
}, o4 = async (t, e, n, r, s) => {
  if (!(e.$flags$ & 32)) {
    {
      if (e.$flags$ |= 32, s = d4(n), s.then) {
        const c = HA();
        s = await s, c();
      }
      s.isProxied || (ry(
        s,
        n,
        2
        /* PROXY_FLAGS.proxyState */
      ), s.isProxied = !0);
      const a = zr("createInstance", n.$tagName$);
      e.$flags$ |= 8;
      try {
        new s(e);
      } catch (c) {
        Ho(c);
      }
      e.$flags$ &= -9, a();
    }
    if (s.style) {
      let a = s.style;
      const c = Yg(n);
      if (!sc.has(c)) {
        const u = zr("registerStyles", n.$tagName$);
        qA(c, a, !!(n.$flags$ & 1)), u();
      }
    }
  }
  const i = e.$ancestorComponent$, o = () => $f(e, !0);
  i && i["s-rc"] ? i["s-rc"].push(o) : o();
}, a4 = (t) => {
  if (!(on.$flags$ & 1)) {
    const e = co(t), n = e.$cmpMeta$, r = zr("connectedCallback", n.$tagName$);
    if (!(e.$flags$ & 1)) {
      e.$flags$ |= 1;
      {
        let s = t;
        for (; s = s.parentNode || s.host; )
          if (s["s-p"]) {
            ty(e, e.$ancestorComponent$ = s);
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
  on.$flags$ & 1 || co(t);
}, l4 = (t, e = {}) => {
  var n;
  const r = zr(), s = [], i = e.exclude || [], o = Dc.customElements, a = xr.head, c = /* @__PURE__ */ a.querySelector("meta[charset]"), u = /* @__PURE__ */ xr.createElement("style"), f = [];
  let l, w = !0;
  Object.assign(on, e), on.$resourcesUrl$ = new URL(e.resourcesUrl || "./", xr.baseURI).href, t.map((p) => {
    p[1].map((m) => {
      const S = {
        $flags$: m[0],
        $tagName$: m[1],
        $members$: m[2],
        $listeners$: m[3]
      };
      S.$members$ = m[2];
      const M = S.$tagName$, R = class extends HTMLElement {
        // StencilLazyHost
        constructor(z) {
          super(z), z = this, f4(z, S), S.$flags$ & 1 && z.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          l && (clearTimeout(l), l = null), w ? f.push(this) : on.jmp(() => a4(this));
        }
        disconnectedCallback() {
          on.jmp(() => c4(this));
        }
        componentOnReady() {
          return co(this).$onReadyPromise$;
        }
      };
      S.$lazyBundleId$ = p[0], !i.includes(M) && !o.get(M) && (s.push(M), o.define(M, ry(
        R,
        S,
        1
        /* PROXY_FLAGS.isElementConstructor */
      )));
    });
  });
  {
    u.innerHTML = s + OA, u.setAttribute("data-styles", "");
    const p = (n = on.$nonce$) !== null && n !== void 0 ? n : Xg(xr);
    p != null && u.setAttribute("nonce", p), a.insertBefore(u, c ? c.nextSibling : a.firstChild);
  }
  w = !1, f.length ? f.map((p) => p.connectedCallback()) : on.jmp(() => l = setTimeout(ey, 30)), r();
}, If = /* @__PURE__ */ new WeakMap(), co = (t) => If.get(t), u4 = (t, e) => If.set(e.$lazyInstance$ = t, e), f4 = (t, e) => {
  const n = {
    $flags$: 0,
    $hostElement$: t,
    $cmpMeta$: e,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return n.$onReadyPromise$ = new Promise((r) => n.$onReadyResolve$ = r), t["s-p"] = [], t["s-rc"] = [], If.set(t, n);
}, $h = (t, e) => e in t, Ho = (t, e) => (0, console.error)(t, e), fl = /* @__PURE__ */ new Map(), d4 = (t, e, n) => {
  const r = t.$tagName$.replace(/-/g, "_"), s = t.$lazyBundleId$, i = fl.get(s);
  if (i)
    return i[r];
  {
    const o = (a) => (fl.set(s, a), a[r]);
    switch (s) {
      case "connect-modal":
        return Promise.resolve().then(() => Kk).then(o, Ho);
    }
  }
  return import(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${s}.entry.js`
  ).then((o) => (fl.set(s, o), o[r]), Ho);
}, sc = /* @__PURE__ */ new Map(), Dc = typeof window < "u" ? window : {}, xr = Dc.document || { head: {} }, on = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t) => t(),
  raf: (t) => requestAnimationFrame(t),
  ael: (t, e, n, r) => t.addEventListener(e, n, r),
  rel: (t, e, n, r) => t.removeEventListener(e, n, r),
  ce: (t, e) => new CustomEvent(t, e)
}, sy = (t) => Promise.resolve(t), h4 = /* @__PURE__ */ (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return !1;
})(), Ih = [], iy = [], p4 = (t, e) => (n) => {
  t.push(n), hu || (hu = !0, on.$flags$ & 4 ? Lf(gu) : on.raf(gu));
}, Lh = (t) => {
  for (let e = 0; e < t.length; e++)
    try {
      t[e](performance.now());
    } catch (n) {
      Ho(n);
    }
  t.length = 0;
}, gu = () => {
  Lh(Ih), Lh(iy), (hu = Ih.length > 0) && on.raf(gu);
}, Lf = (t) => sy().then(t), g4 = /* @__PURE__ */ p4(iy), y4 = () => sy(), w4 = (t, e) => typeof window > "u" ? Promise.resolve() : y4().then(() => l4([["connect-modal", [[1, "connect-modal", { defaultProviders: [16], installedProviders: [16], persistSelection: [4, "persist-selection"], callback: [16], cancelCallback: [16] }]]]], e));
(function() {
  if (typeof window < "u" && window.Reflect !== void 0 && window.customElements !== void 0) {
    var t = HTMLElement;
    window.HTMLElement = function() {
      return Reflect.construct(t, [], this.constructor);
    }, HTMLElement.prototype = t.prototype, HTMLElement.prototype.constructor = HTMLElement, Object.setPrototypeOf(HTMLElement, t);
  }
})();
var b4 = Object.defineProperty, m4 = Object.defineProperties, x4 = Object.getOwnPropertyDescriptors, ic = Object.getOwnPropertySymbols, oy = Object.prototype.hasOwnProperty, ay = Object.prototype.propertyIsEnumerable, Ch = (t, e, n) => e in t ? b4(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, On = (t, e) => {
  for (var n in e || (e = {})) oy.call(e, n) && Ch(t, n, e[n]);
  if (ic) for (var n of ic(e)) ay.call(e, n) && Ch(t, n, e[n]);
  return t;
}, rr = (t, e) => m4(t, x4(e)), cy = (t, e) => {
  var n = {};
  for (var r in t) oy.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && ic) for (var r of ic(t)) e.indexOf(r) < 0 && ay.call(t, r) && (n[r] = t[r]);
  return n;
};
function ly() {
  return Mc(ti()) || window.StacksProvider || window.BlockstackProvider;
}
function Fc(t) {
  return t ? typeof t == "string" ? ni.fromName(t) : "version" in t ? t : "url" in t ? new Rl({ url: t.url }) : t.transactionVersion === si.Mainnet ? new Rl({ url: t.client.baseUrl }) : new Gl({ url: t.client.baseUrl }) : new Gl();
}
typeof window < "u" && (window.__CONNECT_VERSION__ = "__VERSION__");
var S4 = ((t) => (t.ContractCall = "contract_call", t.ContractDeploy = "smart_contract", t.STXTransfer = "token_transfer", t))(S4 || {}), E4 = ((t) => (t.BUFFER = "buffer", t.UINT = "uint", t.INT = "int", t.PRINCIPAL = "principal", t.BOOL = "bool", t))(E4 || {}), Cf = (t) => {
  let e = t;
  if (!e) {
    let n = new F0(["store_write"], document.location.href);
    e = new zl({ appConfig: n });
  }
  return e;
};
function uy(t) {
  try {
    return Cf(t).loadUserData().appPrivateKey;
  } catch {
    return !1;
  }
}
var fy = (t) => {
  let e = Cf(t).loadUserData().appPrivateKey, n = Je.SECP256K1Client.derivePublicKey(e);
  return { privateKey: e, publicKey: n };
};
function A4(t) {
  var e;
  let { stxAddress: n, userSession: r, network: s } = t;
  if (n) return n;
  if (!r || !s) return;
  let i = (e = r == null ? void 0 : r.loadUserData().profile) == null ? void 0 : e.stxAddress, o = { [ri.Mainnet]: "mainnet", [ri.Testnet]: "testnet" }, a = Fc(s);
  return i == null ? void 0 : i[o[a.chainId]];
}
function v4(t) {
  let e = Fc(t.network), n = Cf(t.userSession), r = rr(On({}, t), { network: e, userSession: n });
  return On({ stxAddress: A4(r) }, r);
}
async function k4(t, e) {
  let { postConditions: n } = t;
  return n && n.length > 0 && typeof n[0] != "string" && (typeof n[0].type == "string" ? n = n.map(Ug) : n = n.map((r) => ht(Vg(r)))), new Je.TokenSigner("ES256k", e).signAsync(rr(On({}, t), { postConditions: n }));
}
function $4(t) {
  let { postConditions: e } = t;
  return e && e.length > 0 && typeof e[0] != "string" && (typeof e[0].type == "string" ? e = e.map(Ug) : e = e.map((n) => ht(Vg(n)))), Je.createUnsecuredToken(rr(On({}, t), { postConditions: e }));
}
var I4 = async ({ token: t, options: e }, n) => {
  var r, s, i;
  try {
    let o = await n.transactionRequest(t), { txRaw: a } = o, c = Gt(a.replace(/^0x/, "")), u = w3(c);
    if ("sponsored" in e && e.sponsored) {
      (r = e.onFinish) == null || r.call(e, rr(On({}, o), { stacksTransaction: u }));
      return;
    }
    (s = e.onFinish) == null || s.call(e, rr(On({}, o), { stacksTransaction: u }));
  } catch (o) {
    console.error("[Connect] Error during transaction request", o), (i = e.onCancel) == null || i.call(e);
  }
}, L4 = async (t) => {
  let e = t, { amount: n, appDetails: r, userSession: s } = e, i = cy(e, ["amount", "appDetails", "userSession"]);
  if (uy(s)) {
    let { privateKey: a, publicKey: c } = fy(s), u = rr(On({}, i), { amount: n.toString(10), publicKey: c, txType: "token_transfer" });
    return r && (u.appDetails = r), k4(u, a);
  }
  let o = rr(On({}, i), { amount: n.toString(10), txType: "token_transfer" });
  return r && (o.appDetails = r), $4(o);
};
async function C4(t, e, n) {
  let r = await e(rr(On(On({}, v4(t)), t), { network: Fc(t.network) }));
  return I4({ token: r, options: t }, n);
}
function T4(t, e = ly()) {
  if (!e) throw new Error("[Connect] No installed Stacks wallet found");
  return C4(t, L4, e);
}
function dy(t) {
  let { message: e, domain: n } = t;
  return typeof e.type == "string" && typeof n.type == "string" ? rr(On({}, t), { message: rh(e), domain: rh(n) }) : rr(On({}, t), { message: ht(oi(e)), domain: ht(oi(n)) });
}
async function B4(t, e) {
  return new Je.TokenSigner("ES256k", e).signAsync(dy(t));
}
async function M4(t) {
  let e = t, { userSession: n } = e, r = cy(e, ["userSession"]);
  if (uy(n)) {
    let { privateKey: s, publicKey: i } = fy(n), o = rr(On({}, r), { publicKey: i });
    return B4(o, s);
  }
  return Je.createUnsecuredToken(dy(t));
}
var N4 = ((t) => (t[t.DEFAULT = 0] = "DEFAULT", t[t.ALL = 1] = "ALL", t[t.NONE = 2] = "NONE", t[t.SINGLE = 3] = "SINGLE", t[t.ANYONECANPAY = 128] = "ANYONECANPAY", t))(N4 || {}), hy = "asigna-stx", Th = (t, e) => new Promise((n) => {
  function r(s) {
    s.data.source === hy && s.data[e] && (n(s.data[e]), window.removeEventListener("message", r));
  }
  window.addEventListener("message", r), window.top.postMessage(_4(t, e), "*");
}), P4 = { authenticationRequest: async (t) => Th(t, "authenticationRequest"), transactionRequest: async (t) => Th(t, "transactionRequest") }, _4 = (t, e) => ({ source: hy, [e]: t }), U4 = () => {
  typeof window > "u" || window.top !== window.self && (window.AsignaProvider = P4);
};
U4();
var H4 = [{ id: "LeatherProvider", name: "Leather", icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=", webUrl: "https://leather.io", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj", mozillaAddOnsUrl: "https://leather.io/install-extension" }, { id: "XverseProviders.StacksProvider", name: "Xverse Wallet", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==", webUrl: "https://xverse.app", chromeWebStoreUrl: "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg", googlePlayStoreUrl: "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse", iOSAppStoreUrl: "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513", mozillaAddOnsUrl: "https://www.xverse.app/download" }, { id: "AsignaProvider", name: "Asigna Multisig", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzAwMDEwMCIgZD0iTTAgMGgzMnYzMkgweiIvPjxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNS4xMSA1LjU1YTMgMyAwIDAgMC0xLjgyIDEuM2wtLjA1LjA4LS40My43Mi0uMDcuMTEtLjUuODUtLjA1LjA5LTEuMjkgMi4xOC0uMDQuMDctLjQ3LjgtLjA2LjEtLjQ2Ljc4LS4wNy4xMS0xLjYzIDIuNzYtLjA3LjExLS4zOC42Ni0uMDUuMDgtLjczIDEuMjQtLjM1LjYtLjQuNjctLjA1LjA5TDUuMSAyMC43bC0uMTEuMTgtLjE0LjIzLS4wNy4xMy0uMzMuNTUtLjA0LjA3di4wMWExLjI2IDEuMjYgMCAwIDAtLjE0LjQ3IDEuMzEgMS4zMSAwIDAgMCAxLjI0IDEuNGgxLjVsLjA1LS4wNi4wNC0uMDYuODctMS4yMS4wNS0uMDguNzctMS4wNy4wNS0uMDcuNC0uNTcuMDUtLjA2LjI0LS4zNGExLjUyIDEuNTIgMCAwIDEgMS4zOS0uNjIgMS41IDEuNSAwIDAgMSAuNjQuMiAxLjQ3IDEuNDcgMCAwIDEgLjczIDEuMjcgMS40NCAxLjQ0IDAgMCAxLS4yNy44NGwtLjYzLjg4LS4wNS4wNy0uMzIuNDUtLjA2LjA4LS4wOC4xMi0uMTIuMTYtLjA1LjA4aDIuMTNhMi4zMiAyLjMyIDAgMCAwIDEuNzctLjk2bDEuMTgtMS42My43Ny0xLjA4IDEuMy0xLjhhMS4yNCAxLjI0IDAgMCAxIC41NS0uNDNsLjA4LS4wM2ExLjMgMS4zIDAgMCAxIC4zLS4wNiAxLjI4IDEuMjggMCAwIDEgMS4xNS41NGwuMTEuMmExLjEzIDEuMTMgMCAwIDEgLjEuNDEgMS4xOSAxLjE5IDAgMCAxLS4yMy43N2wtLjAzLjA1LS41Ny44LS43Ljk4LS4yNy4zN2ExLjIyIDEuMjIgMCAwIDAtLjIuNSAxLjA1IDEuMDUgMCAwIDAtLjAyLjIzdi4wNmExLjE3IDEuMTcgMCAwIDAgLjE0LjQzbC4wMi4wNS4wNy4xYTEuNDQgMS40NCAwIDAgMCAuMS4xMWwuMDUuMDYuMDEuMDFhMS44IDEuOCAwIDAgMCAuMTQuMWMwIC4wMi4wMi4wMy4wNC4wM2ExIDEgMCAwIDAgLjA4LjA1bC4wNy4wNGExLjI1IDEuMjUgMCAwIDAgLjUuMWg2LjljLjEgMCAuMi0uMDEuMjktLjAzbC4wNi0uMDJhMS4yNyAxLjI3IDAgMCAwIC4yNy0uMS41Ny41NyAwIDAgMCAuMDctLjAzIDEuMjEgMS4yMSAwIDAgMCAuMjYtLjE5bC4wOC0uMDdhLjkyLjkyIDAgMCAwIC4xNS0uMTkgMS41NSAxLjU1IDAgMCAwIC4wOS0uMTdsLjAyLS4wNWExLjIyIDEuMjIgMCAwIDAgLjA4LS4yNnYtLjA0bC4wMi0uMDh2LS4wOGExLjMyIDEuMzIgMCAwIDAtLjItLjc0bC0xLjYtMi42NC0uMDYtLjEtLjItLjMyLS4zMy0uNTR2LS4wMWwtLjA1LS4wOC0xLjMtMi4xNS0uMDctLjEtLjA0LS4wNi0uOC0xLjMyLS4wNC0uMDctLjItLjM0LS4xLS4xNC0uMS0uMTYtLjUzLS45LS4xMy0uMi0uMDktLjE0LTIuMTctMy41Ny0uMDQtLjA3LS43Mi0xLjE5LS4wNS0uMDctLjQtLjY1YTIuNjUgMi42NSAwIDAgMC0uMy0uNCAyLjk2IDIuOTYgMCAwIDAtLjk3LS43NCAzLjA0IDMuMDQgMCAwIDAtMS4zLS4zYy0uMjUgMC0uNS4wNC0uNzQuMVoiLz48cGF0aCBmaWxsPSJ1cmwoI2IpIiBkPSJNMTkgMTYuM2E1LjQ1IDUuNDUgMCAwIDAtLjgzIDEuNTZsLS4wNC4xNWExLjM2IDEuMzYgMCAwIDEgLjI4LS4xNiAxLjI0IDEuMjQgMCAwIDEgLjM4LS4wOGguMWExLjI4IDEuMjggMCAwIDEgMS4wNS41NGMuMDQuMDYuMDguMTMuMS4yYTEuMjQgMS4yNCAwIDAgMSAuMDkuMjcgMS4xOSAxLjE5IDAgMCAxLS4yLjkxbC0uMDQuMDUtLjU3Ljc5LS43Ljk5LS4yNy4zN2ExLjIzIDEuMjMgMCAwIDAtLjIuNDIgMS4wNiAxLjA2IDAgMCAwLS4wMi4zMXYuMDZhMS4xNyAxLjE3IDAgMCAwIC4xNi40Ny45My45MyAwIDAgMCAuMDcuMSAxLjUgMS41IDAgMCAwIC4xLjEybC4wNS4wNmguMDFhMS45NCAxLjk0IDAgMCAwIC4wOS4wOCAxIDEgMCAwIDAgLjE3LjFsLjA3LjA0YTEuMjUgMS4yNSAwIDAgMCAuNS4xaDYuOWMuMSAwIC4yIDAgLjI4LS4wMmwuMDctLjAyYTEuMzIgMS4zMiAwIDAgMCAuMzQtLjEzbC4xNi0uMS4wMy0uMDNhMS4yOSAxLjI5IDAgMCAwIC4yLS4yIDIuNDMgMi40MyAwIDAgMCAuMTItLjE3Yy4wMy0uMDMuMDUtLjA4LjA3LS4xMmwuMDItLjA1YTEuMjEgMS4yMSAwIDAgMCAuMDktLjN2LS4wOGwuMDEtLjA5YTEuMzIgMS4zMiAwIDAgMC0uMi0uNzNsLTEuNi0yLjY0LS4wNi0uMS0uMi0uMzItLjMzLS41NHYtLjAybC0uMDUtLjA3LTEuMy0yLjE1LS4xMi0uMDctLjA3LS4wNGE0Ljk0IDQuOTQgMCAwIDAtMi40Ni0uNjdjLTEuMDMgMC0xLjc2LjU3LTIuMjYgMS4yWiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yOSAyMS4wOGMwIC4yOS0uMDkuNTgtLjI3Ljg0bC0xLjMxIDEuODRIN2wyLjUyLTMuNTNhMS41NCAxLjU0IDAgMCAxIDIuMS0uMzZjLjQzLjI4LjY2Ljc0LjY2IDEuMloiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTEuMTYgMjEuMjVhLjU2LjU2IDAgMCAxLS41Ny41NS41Ni41NiAwIDAgMS0uNTctLjU2LjU2LjU2IDAgMCAxIC41Ny0uNTUuNTYuNTYgMCAwIDEgLjU3LjU2WiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjE1LjIzIiB4Mj0iMTkuMyIgeTE9IjI1Ljc4IiB5Mj0iNi4xMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM2NTIyRjQiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzlCNkJGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0E1ODVGRiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iMjIuNTkiIHgyPSIyNC44IiB5MT0iMjQuNzEiIHkyPSIxNS41MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiM0MjFGOEIiLz48c3RvcCBvZmZzZXQ9Ii41NSIgc3RvcC1jb2xvcj0iIzcyMzBGRiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzk3NzNGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==", webUrl: "https://asigna.io", chromeWebStoreUrl: "https://stx.asigna.io/" }];
function O4(t, e = !0) {
  return function(n, r) {
    var s;
    if (r) return t(n, r);
    let i = ti(), o = ly();
    if (i && o) return t(n, o);
    if (typeof window > "u") return;
    w4();
    let a = (s = n == null ? void 0 : n.defaultProviders) != null ? s : H4, c = Cx(a), u = document.createElement("connect-modal");
    u.defaultProviders = a, u.installedProviders = c, u.persistSelection = e;
    let f = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let l = () => {
      u.remove(), document.body.style.overflow = f;
    };
    u.callback = (p) => {
      l(), t(n, p);
    }, u.cancelCallback = () => {
      var p;
      l(), (p = n.onCancel) == null || p.call(n);
    }, document.body.appendChild(u);
    let w = (p) => {
      p.key === "Escape" && (document.removeEventListener("keydown", w), u.remove());
    };
    document.addEventListener("keydown", w);
  };
}
var Aa = O4(T4);
function $s(t, e, n) {
  return Tf(gn(t, e), n);
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
      r = r.padStart(r.length + r.length % 2, "0"), n = ge(r);
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
      const r = j4(BigInt(`0x${Dt(n)}`), BigInt(n.byteLength * 8));
      return BigInt(r.toString());
    } else
      return BigInt(`0x${Dt(n)}`);
  if (n != null && typeof n == "object" && n.constructor.name === "BN")
    return BigInt(n.toString());
  throw new TypeError("Invalid value type. Must be a number, bigint, integer-string, hex-string, or Uint8Array.");
}
function Bh(t) {
  if (typeof t != "string")
    throw new TypeError(`hexToBigInt: expected string, got ${typeof t}`);
  return BigInt(`0x${t}`);
}
function Yo(t, e = 8) {
  return (typeof t == "bigint" ? t : gn(t, !1)).toString(16).padStart(e * 2, "0");
}
function jc(t) {
  return parseInt(t, 16);
}
function Tf(t, e = 16) {
  const n = Yo(t, e);
  return ge(n);
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
const z4 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Dt(t) {
  if (!(t instanceof Uint8Array))
    throw new Error("Uint8Array expected");
  let e = "";
  for (const n of t)
    e += z4[n];
  return e;
}
function ge(t) {
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
function lo(t) {
  return new TextEncoder().encode(t);
}
function Bf(t) {
  return new TextDecoder().decode(t);
}
function py(t) {
  const e = [];
  for (let n = 0; n < t.length; n++)
    e.push(t.charCodeAt(n) & 255);
  return new Uint8Array(e);
}
function R4(t) {
  return String.fromCharCode.apply(null, t);
}
function G4(t) {
  return !Number.isInteger(t) || t < 0 || t > 255;
}
function Mh(t) {
  if (t.some(G4))
    throw new Error("Some values are invalid bytes.");
  return new Uint8Array(t);
}
function zc(...t) {
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
  return zc(...t.map((e) => typeof e == "number" ? Mh([e]) : e instanceof Array ? Mh(e) : e));
}
var Nh;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(Nh || (Nh = {}));
var Ph;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(Ph || (Ph = {}));
var _h;
(function(t) {
  t[t.Mainnet = 385875968] = "Mainnet", t[t.Testnet = 4278190080] = "Testnet";
})(_h || (_h = {}));
const gy = 33, dl = 32;
function K4(t) {
  if (t.length < dl * 2 * 2 + 1)
    throw new Error("Invalid signature");
  const e = t.slice(0, 2), n = t.slice(2, 2 + dl * 2), r = t.slice(2 + dl * 2);
  return {
    recoveryId: jc(e),
    r: n,
    s: r
  };
}
function V4(t) {
  const e = typeof t == "string" ? ge(t) : t;
  if (e.length != 32 && e.length != 33)
    throw new Error(`Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: ${e.length}`);
  if (e.length == 33 && e[32] !== 1)
    throw new Error("Improperly formatted private-key. 33 bytes indicate compressed key, but the last byte must be == 01");
  return e;
}
function q4(t, e) {
  return (t[e + 0] << 8 | t[e + 1]) >>> 0;
}
function W4(t, e, n = 0) {
  return t[n + 0] = e >>> 8, t[n + 1] = e >>> 0, t;
}
function X4(t, e) {
  return t[e];
}
function Y4(t, e, n = 0) {
  return t[n] = e, t;
}
function Z4(t, e) {
  return t[e] * 2 ** 24 + t[e + 1] * 2 ** 16 + t[e + 2] * 2 ** 8 + t[e + 3];
}
function ai(t, e, n = 0) {
  return t[n + 3] = e, e >>>= 8, t[n + 2] = e, e >>>= 8, t[n + 1] = e, e >>>= 8, t[n] = e, t;
}
var yu;
(function(t) {
  t[t.Testnet = 2147483648] = "Testnet", t[t.Mainnet = 1] = "Mainnet";
})(yu || (yu = {}));
const Q4 = yu.Mainnet, J4 = 128, tv = 128, yy = 16, Vs = 32, wu = 80, Rc = 65, ev = 32, nv = 64, oc = 34;
var ft;
(function(t) {
  t[t.Address = 0] = "Address", t[t.Principal = 1] = "Principal", t[t.LengthPrefixedString = 2] = "LengthPrefixedString", t[t.MemoString = 3] = "MemoString", t[t.AssetInfo = 4] = "AssetInfo", t[t.PostCondition = 5] = "PostCondition", t[t.PublicKey = 6] = "PublicKey", t[t.LengthPrefixedList = 7] = "LengthPrefixedList", t[t.Payload = 8] = "Payload", t[t.MessageSignature = 9] = "MessageSignature", t[t.StructuredDataSignature = 10] = "StructuredDataSignature", t[t.TransactionAuthField = 11] = "TransactionAuthField";
})(ft || (ft = {}));
var Ut;
(function(t) {
  t[t.TokenTransfer = 0] = "TokenTransfer", t[t.SmartContract = 1] = "SmartContract", t[t.VersionedSmartContract = 6] = "VersionedSmartContract", t[t.ContractCall = 2] = "ContractCall", t[t.PoisonMicroblock = 3] = "PoisonMicroblock", t[t.Coinbase = 4] = "Coinbase", t[t.CoinbaseToAltRecipient = 5] = "CoinbaseToAltRecipient", t[t.TenureChange = 7] = "TenureChange", t[t.NakamotoCoinbase = 8] = "NakamotoCoinbase";
})(Ut || (Ut = {}));
var bu;
(function(t) {
  t[t.Clarity1 = 1] = "Clarity1", t[t.Clarity2 = 2] = "Clarity2", t[t.Clarity3 = 3] = "Clarity3";
})(bu || (bu = {}));
var En;
(function(t) {
  t[t.OnChainOnly = 1] = "OnChainOnly", t[t.OffChainOnly = 2] = "OffChainOnly", t[t.Any = 3] = "Any";
})(En || (En = {}));
const Da = ["onChainOnly", "offChainOnly", "any"], Uh = {
  [Da[0]]: En.OnChainOnly,
  [Da[1]]: En.OffChainOnly,
  [Da[2]]: En.Any,
  [En.OnChainOnly]: En.OnChainOnly,
  [En.OffChainOnly]: En.OffChainOnly,
  [En.Any]: En.Any
};
function rv(t) {
  if (t in Uh)
    return Uh[t];
  throw new Error(`Invalid anchor mode "${t}", must be one of: ${Da.join(", ")}`);
}
var ac;
(function(t) {
  t[t.Mainnet = 0] = "Mainnet", t[t.Testnet = 128] = "Testnet";
})(ac || (ac = {}));
ac.Mainnet;
var Ji;
(function(t) {
  t[t.Allow = 1] = "Allow", t[t.Deny = 2] = "Deny";
})(Ji || (Ji = {}));
var An;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(An || (An = {}));
var Ce;
(function(t) {
  t[t.Standard = 4] = "Standard", t[t.Sponsored = 5] = "Sponsored";
})(Ce || (Ce = {}));
var re;
(function(t) {
  t[t.SerializeP2PKH = 0] = "SerializeP2PKH", t[t.SerializeP2SH = 1] = "SerializeP2SH", t[t.SerializeP2WPKH = 2] = "SerializeP2WPKH", t[t.SerializeP2WSH = 3] = "SerializeP2WSH", t[t.SerializeP2SHNonSequential = 5] = "SerializeP2SHNonSequential", t[t.SerializeP2WSHNonSequential = 7] = "SerializeP2WSHNonSequential";
})(re || (re = {}));
var cc;
(function(t) {
  t[t.MainnetSingleSig = 22] = "MainnetSingleSig", t[t.MainnetMultiSig = 20] = "MainnetMultiSig", t[t.TestnetSingleSig = 26] = "TestnetSingleSig", t[t.TestnetMultiSig = 21] = "TestnetMultiSig";
})(cc || (cc = {}));
var xe;
(function(t) {
  t[t.Compressed = 0] = "Compressed", t[t.Uncompressed = 1] = "Uncompressed";
})(xe || (xe = {}));
var Oo;
(function(t) {
  t[t.Equal = 1] = "Equal", t[t.Greater = 2] = "Greater", t[t.GreaterEqual = 3] = "GreaterEqual", t[t.Less = 4] = "Less", t[t.LessEqual = 5] = "LessEqual";
})(Oo || (Oo = {}));
var mu;
(function(t) {
  t[t.Sends = 16] = "Sends", t[t.DoesNotSend = 17] = "DoesNotSend";
})(mu || (mu = {}));
var Do;
(function(t) {
  t[t.Origin = 1] = "Origin", t[t.Standard = 2] = "Standard", t[t.Contract = 3] = "Contract";
})(Do || (Do = {}));
var Hh;
(function(t) {
  t[t.STX = 0] = "STX", t[t.Fungible = 1] = "Fungible", t[t.NonFungible = 2] = "NonFungible";
})(Hh || (Hh = {}));
var Oh;
(function(t) {
  t.Serialization = "Serialization", t.Deserialization = "Deserialization", t.SignatureValidation = "SignatureValidation", t.FeeTooLow = "FeeTooLow", t.BadNonce = "BadNonce", t.NotEnoughFunds = "NotEnoughFunds", t.NoSuchContract = "NoSuchContract", t.NoSuchPublicFunction = "NoSuchPublicFunction", t.BadFunctionArgument = "BadFunctionArgument", t.ContractAlreadyExists = "ContractAlreadyExists", t.PoisonMicroblocksDoNotConflict = "PoisonMicroblocksDoNotConflict", t.PoisonMicroblockHasUnknownPubKeyHash = "PoisonMicroblockHasUnknownPubKeyHash", t.PoisonMicroblockIsInvalid = "PoisonMicroblockIsInvalid", t.BadAddressVersionByte = "BadAddressVersionByte", t.NoCoinbaseViaMempool = "NoCoinbaseViaMempool", t.ServerFailureNoSuchChainTip = "ServerFailureNoSuchChainTip", t.TooMuchChaining = "TooMuchChaining", t.ConflictingNonceInMempool = "ConflictingNonceInMempool", t.BadTransactionVersion = "BadTransactionVersion", t.TransferRecipientCannotEqualSender = "TransferRecipientCannotEqualSender", t.TransferAmountMustBePositive = "TransferAmountMustBePositive", t.ServerFailureDatabase = "ServerFailureDatabase", t.EstimatorError = "EstimatorError", t.TemporarilyBlacklisted = "TemporarilyBlacklisted", t.ServerFailureOther = "ServerFailureOther";
})(Oh || (Oh = {}));
function xu(t) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new Error(`Wrong positive integer: ${t}`);
}
function sv(t) {
  if (typeof t != "boolean")
    throw new Error(`Expected boolean, not ${t}`);
}
function wy(t, ...e) {
  if (!(t instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(t.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${t.length}`);
}
function iv(t) {
  if (typeof t != "function" || typeof t.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  xu(t.outputLen), xu(t.blockLen);
}
function ov(t, e = !0) {
  if (t.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && t.finished)
    throw new Error("Hash#digest() has already been called");
}
function av(t, e) {
  wy(t);
  const n = e.outputLen;
  if (t.length < n)
    throw new Error(`digestInto() expects output buffer of length at least ${n}`);
}
const zs = {
  number: xu,
  bool: sv,
  bytes: wy,
  hash: iv,
  exists: ov,
  output: av
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const hl = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength), hr = (t, e) => t << 32 - e | t >>> e, cv = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!cv)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function lv(t) {
  if (typeof t != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof t}`);
  return new TextEncoder().encode(t);
}
function Mf(t) {
  if (typeof t == "string" && (t = lv(t)), !(t instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof t})`);
  return t;
}
class by {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function mi(t) {
  const e = (r) => t().update(Mf(r)).digest(), n = t();
  return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function uv(t, e, n, r) {
  if (typeof t.setBigUint64 == "function")
    return t.setBigUint64(e, n, r);
  const s = BigInt(32), i = BigInt(4294967295), o = Number(n >> s & i), a = Number(n & i), c = r ? 4 : 0, u = r ? 0 : 4;
  t.setUint32(e + c, o, r), t.setUint32(e + u, a, r);
}
class Nf extends by {
  constructor(e, n, r, s) {
    super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = s, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = hl(this.buffer);
  }
  update(e) {
    zs.exists(this);
    const { view: n, buffer: r, blockLen: s } = this;
    e = Mf(e);
    const i = e.length;
    for (let o = 0; o < i; ) {
      const a = Math.min(s - this.pos, i - o);
      if (a === s) {
        const c = hl(e);
        for (; s <= i - o; o += s)
          this.process(c, o);
        continue;
      }
      r.set(e.subarray(o, o + a), this.pos), this.pos += a, o += a, this.pos === s && (this.process(n, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    zs.exists(this), zs.output(e, this), this.finished = !0;
    const { buffer: n, view: r, blockLen: s, isLE: i } = this;
    let { pos: o } = this;
    n[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > s - o && (this.process(r, 0), o = 0);
    for (let l = o; l < s; l++)
      n[l] = 0;
    uv(r, s - 8, BigInt(this.length * 8), i), this.process(r, 0);
    const a = hl(e), c = this.outputLen;
    if (c % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const u = c / 4, f = this.get();
    if (u > f.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let l = 0; l < u; l++)
      a.setUint32(4 * l, f[l], i);
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
const fv = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), my = Uint8Array.from({ length: 16 }, (t, e) => e), dv = my.map((t) => (9 * t + 5) % 16);
let Pf = [my], _f = [dv];
for (let t = 0; t < 4; t++)
  for (let e of [Pf, _f])
    e.push(e[t].map((n) => fv[n]));
const xy = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((t) => new Uint8Array(t)), hv = Pf.map((t, e) => t.map((n) => xy[e][n])), pv = _f.map((t, e) => t.map((n) => xy[e][n])), gv = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), yv = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), va = (t, e) => t << e | t >>> 32 - e;
function Dh(t, e, n, r) {
  return t === 0 ? e ^ n ^ r : t === 1 ? e & n | ~e & r : t === 2 ? (e | ~n) ^ r : t === 3 ? e & r | n & ~r : e ^ (n | ~r);
}
const ka = new Uint32Array(16);
class wv extends Nf {
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
      ka[p] = e.getUint32(n, !0);
    let r = this.h0 | 0, s = r, i = this.h1 | 0, o = i, a = this.h2 | 0, c = a, u = this.h3 | 0, f = u, l = this.h4 | 0, w = l;
    for (let p = 0; p < 5; p++) {
      const m = 4 - p, S = gv[p], M = yv[p], R = Pf[p], z = _f[p], E = hv[p], _ = pv[p];
      for (let N = 0; N < 16; N++) {
        const J = va(r + Dh(p, i, a, u) + ka[R[N]] + S, E[N]) + l | 0;
        r = l, l = u, u = va(a, 10) | 0, a = i, i = J;
      }
      for (let N = 0; N < 16; N++) {
        const J = va(s + Dh(m, o, c, f) + ka[z[N]] + M, _[N]) + w | 0;
        s = w, w = f, f = va(c, 10) | 0, c = o, o = J;
      }
    }
    this.set(this.h1 + a + f | 0, this.h2 + u + w | 0, this.h3 + l + s | 0, this.h4 + r + o | 0, this.h0 + i + c | 0);
  }
  roundClean() {
    ka.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const bv = mi(() => new wv()), mv = (t, e, n) => t & e ^ ~t & n, xv = (t, e, n) => t & e ^ t & n ^ e & n, Sv = new Uint32Array([
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
class Sy extends Nf {
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
      const w = ps[l - 15], p = ps[l - 2], m = hr(w, 7) ^ hr(w, 18) ^ w >>> 3, S = hr(p, 17) ^ hr(p, 19) ^ p >>> 10;
      ps[l] = S + ps[l - 7] + m + ps[l - 16] | 0;
    }
    let { A: r, B: s, C: i, D: o, E: a, F: c, G: u, H: f } = this;
    for (let l = 0; l < 64; l++) {
      const w = hr(a, 6) ^ hr(a, 11) ^ hr(a, 25), p = f + w + mv(a, c, u) + Sv[l] + ps[l] | 0, S = (hr(r, 2) ^ hr(r, 13) ^ hr(r, 22)) + xv(r, s, i) | 0;
      f = u, u = c, c = a, a = o + p | 0, o = i, i = s, s = r, r = p + S | 0;
    }
    r = r + this.A | 0, s = s + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, a = a + this.E | 0, c = c + this.F | 0, u = u + this.G | 0, f = f + this.H | 0, this.set(r, s, i, o, a, c, u, f);
  }
  roundClean() {
    ps.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
class Ev extends Sy {
  constructor() {
    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28;
  }
}
const Uf = mi(() => new Sy());
mi(() => new Ev());
const $a = BigInt(2 ** 32 - 1), Su = BigInt(32);
function Ey(t, e = !1) {
  return e ? { h: Number(t & $a), l: Number(t >> Su & $a) } : { h: Number(t >> Su & $a) | 0, l: Number(t & $a) | 0 };
}
function Av(t, e = !1) {
  let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
  for (let s = 0; s < t.length; s++) {
    const { h: i, l: o } = Ey(t[s], e);
    [n[s], r[s]] = [i, o];
  }
  return [n, r];
}
const vv = (t, e) => BigInt(t >>> 0) << Su | BigInt(e >>> 0), kv = (t, e, n) => t >>> n, $v = (t, e, n) => t << 32 - n | e >>> n, Iv = (t, e, n) => t >>> n | e << 32 - n, Lv = (t, e, n) => t << 32 - n | e >>> n, Cv = (t, e, n) => t << 64 - n | e >>> n - 32, Tv = (t, e, n) => t >>> n - 32 | e << 64 - n, Bv = (t, e) => e, Mv = (t, e) => t, Nv = (t, e, n) => t << n | e >>> 32 - n, Pv = (t, e, n) => e << n | t >>> 32 - n, _v = (t, e, n) => e << n - 32 | t >>> 64 - n, Uv = (t, e, n) => t << n - 32 | e >>> 64 - n;
function Hv(t, e, n, r) {
  const s = (e >>> 0) + (r >>> 0);
  return { h: t + n + (s / 2 ** 32 | 0) | 0, l: s | 0 };
}
const Ov = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), Dv = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Fv = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jv = (t, e, n, r, s) => e + n + r + s + (t / 2 ** 32 | 0) | 0, zv = (t, e, n, r, s) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (s >>> 0), Rv = (t, e, n, r, s, i) => e + n + r + s + i + (t / 2 ** 32 | 0) | 0, Pt = {
  fromBig: Ey,
  split: Av,
  toBig: vv,
  shrSH: kv,
  shrSL: $v,
  rotrSH: Iv,
  rotrSL: Lv,
  rotrBH: Cv,
  rotrBL: Tv,
  rotr32H: Bv,
  rotr32L: Mv,
  rotlSH: Nv,
  rotlSL: Pv,
  rotlBH: _v,
  rotlBL: Uv,
  add: Hv,
  add3L: Ov,
  add3H: Dv,
  add4L: Fv,
  add4H: jv,
  add5H: Rv,
  add5L: zv
}, [Gv, Kv] = Pt.split([
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
class Gc extends Nf {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: n, Bh: r, Bl: s, Ch: i, Cl: o, Dh: a, Dl: c, Eh: u, El: f, Fh: l, Fl: w, Gh: p, Gl: m, Hh: S, Hl: M } = this;
    return [e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M];
  }
  // prettier-ignore
  set(e, n, r, s, i, o, a, c, u, f, l, w, p, m, S, M) {
    this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = s | 0, this.Ch = i | 0, this.Cl = o | 0, this.Dh = a | 0, this.Dl = c | 0, this.Eh = u | 0, this.El = f | 0, this.Fh = l | 0, this.Fl = w | 0, this.Gh = p | 0, this.Gl = m | 0, this.Hh = S | 0, this.Hl = M | 0;
  }
  process(e, n) {
    for (let E = 0; E < 16; E++, n += 4)
      gs[E] = e.getUint32(n), ys[E] = e.getUint32(n += 4);
    for (let E = 16; E < 80; E++) {
      const _ = gs[E - 15] | 0, N = ys[E - 15] | 0, J = Pt.rotrSH(_, N, 1) ^ Pt.rotrSH(_, N, 8) ^ Pt.shrSH(_, N, 7), et = Pt.rotrSL(_, N, 1) ^ Pt.rotrSL(_, N, 8) ^ Pt.shrSL(_, N, 7), G = gs[E - 2] | 0, V = ys[E - 2] | 0, $ = Pt.rotrSH(G, V, 19) ^ Pt.rotrBH(G, V, 61) ^ Pt.shrSH(G, V, 6), P = Pt.rotrSL(G, V, 19) ^ Pt.rotrBL(G, V, 61) ^ Pt.shrSL(G, V, 6), b = Pt.add4L(et, P, ys[E - 7], ys[E - 16]), C = Pt.add4H(b, J, $, gs[E - 7], gs[E - 16]);
      gs[E] = C | 0, ys[E] = b | 0;
    }
    let { Ah: r, Al: s, Bh: i, Bl: o, Ch: a, Cl: c, Dh: u, Dl: f, Eh: l, El: w, Fh: p, Fl: m, Gh: S, Gl: M, Hh: R, Hl: z } = this;
    for (let E = 0; E < 80; E++) {
      const _ = Pt.rotrSH(l, w, 14) ^ Pt.rotrSH(l, w, 18) ^ Pt.rotrBH(l, w, 41), N = Pt.rotrSL(l, w, 14) ^ Pt.rotrSL(l, w, 18) ^ Pt.rotrBL(l, w, 41), J = l & p ^ ~l & S, et = w & m ^ ~w & M, G = Pt.add5L(z, N, et, Kv[E], ys[E]), V = Pt.add5H(G, R, _, J, Gv[E], gs[E]), $ = G | 0, P = Pt.rotrSH(r, s, 28) ^ Pt.rotrBH(r, s, 34) ^ Pt.rotrBH(r, s, 39), b = Pt.rotrSL(r, s, 28) ^ Pt.rotrBL(r, s, 34) ^ Pt.rotrBL(r, s, 39), C = r & i ^ r & a ^ i & a, O = s & o ^ s & c ^ o & c;
      R = S | 0, z = M | 0, S = p | 0, M = m | 0, p = l | 0, m = w | 0, { h: l, l: w } = Pt.add(u | 0, f | 0, V | 0, $ | 0), u = a | 0, f = c | 0, a = i | 0, c = o | 0, i = r | 0, o = s | 0;
      const T = Pt.add3L($, b, O);
      r = Pt.add3H(T, V, P, C), s = T | 0;
    }
    ({ h: r, l: s } = Pt.add(this.Ah | 0, this.Al | 0, r | 0, s | 0)), { h: i, l: o } = Pt.add(this.Bh | 0, this.Bl | 0, i | 0, o | 0), { h: a, l: c } = Pt.add(this.Ch | 0, this.Cl | 0, a | 0, c | 0), { h: u, l: f } = Pt.add(this.Dh | 0, this.Dl | 0, u | 0, f | 0), { h: l, l: w } = Pt.add(this.Eh | 0, this.El | 0, l | 0, w | 0), { h: p, l: m } = Pt.add(this.Fh | 0, this.Fl | 0, p | 0, m | 0), { h: S, l: M } = Pt.add(this.Gh | 0, this.Gl | 0, S | 0, M | 0), { h: R, l: z } = Pt.add(this.Hh | 0, this.Hl | 0, R | 0, z | 0), this.set(r, s, i, o, a, c, u, f, l, w, p, m, S, M, R, z);
  }
  roundClean() {
    gs.fill(0), ys.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Vv extends Gc {
  constructor() {
    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28;
  }
}
class qv extends Gc {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class Wv extends Gc {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
mi(() => new Gc());
mi(() => new Vv());
const Xv = mi(() => new qv());
mi(() => new Wv());
function Ay(t) {
  if (ge(t).byteLength != Rc)
    throw Error("Invalid signature");
  return {
    type: ft.MessageSignature,
    data: t
  };
}
function vo(t, e) {
  return { type: ft.Address, version: t, hash160: e };
}
function Pi(t) {
  return yi.c32address(t.version, t.hash160);
}
function ci(t, e, n) {
  const r = e || 1, s = n || J4;
  if (Fy(t, s))
    throw new Error(`String length exceeds maximum bytes ${s}`);
  return {
    type: ft.LengthPrefixedString,
    content: t,
    lengthPrefixBytes: r,
    maxLengthBytes: s
  };
}
function Hf(t) {
  const e = yi.c32addressDecode(t);
  return {
    type: ft.Address,
    version: e[0],
    hash160: e[1]
  };
}
var Z;
(function(t) {
  t[t.Int = 0] = "Int", t[t.UInt = 1] = "UInt", t[t.Buffer = 2] = "Buffer", t[t.BoolTrue = 3] = "BoolTrue", t[t.BoolFalse = 4] = "BoolFalse", t[t.PrincipalStandard = 5] = "PrincipalStandard", t[t.PrincipalContract = 6] = "PrincipalContract", t[t.ResponseOk = 7] = "ResponseOk", t[t.ResponseErr = 8] = "ResponseErr", t[t.OptionalNone = 9] = "OptionalNone", t[t.OptionalSome = 10] = "OptionalSome", t[t.List = 11] = "List", t[t.Tuple = 12] = "Tuple", t[t.StringASCII = 13] = "StringASCII", t[t.StringUTF8 = 14] = "StringUTF8";
})(Z || (Z = {}));
function Yv(t) {
  if (t.type === Z.PrincipalStandard)
    return Pi(t.address);
  if (t.type === Z.PrincipalContract)
    return `${Pi(t.address)}.${t.contractName.content}`;
  throw new Error(`Unexpected principal data: ${JSON.stringify(t)}`);
}
function vy(t) {
  if (t.includes(".")) {
    const [e, n] = t.split(".");
    return Jv(e, n);
  } else
    return Zv(t);
}
function Zv(t) {
  const e = Hf(t);
  return { type: Z.PrincipalStandard, address: e };
}
function Qv(t) {
  return { type: Z.PrincipalStandard, address: t };
}
function Jv(t, e) {
  const n = Hf(t), r = ci(e);
  return ky(n, r);
}
function ky(t, e) {
  if (lo(e.content).byteLength >= 128)
    throw new Error("Contract name must be less than 128 bytes");
  return { type: Z.PrincipalContract, address: t, contractName: e };
}
function pl(t, e = !1) {
  switch (t.type) {
    case Z.BoolTrue:
      return !0;
    case Z.BoolFalse:
      return !1;
    case Z.Int:
    case Z.UInt:
      return e ? t.value.toString() : t.value;
    case Z.Buffer:
      return `0x${Dt(t.buffer)}`;
    case Z.OptionalNone:
      return null;
    case Z.OptionalSome:
      return wr(t.value);
    case Z.ResponseErr:
      return wr(t.value);
    case Z.ResponseOk:
      return wr(t.value);
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return Yv(t);
    case Z.List:
      return t.list.map((r) => wr(r));
    case Z.Tuple:
      const n = {};
      return Object.keys(t.data).forEach((r) => {
        n[r] = wr(t.data[r]);
      }), n;
    case Z.StringASCII:
      return t.data;
    case Z.StringUTF8:
      return t.data;
  }
}
function wr(t) {
  switch (t.type) {
    case Z.ResponseErr:
      return { type: ms(t), value: pl(t, !0), success: !1 };
    case Z.ResponseOk:
      return { type: ms(t), value: pl(t, !0), success: !0 };
    default:
      return { type: ms(t), value: pl(t, !0) };
  }
}
function ms(t) {
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
      return `(optional ${ms(t.value)})`;
    case Z.ResponseErr:
      return `(response UnknownType ${ms(t.value)})`;
    case Z.ResponseOk:
      return `(response ${ms(t.value)} UnknownType)`;
    case Z.PrincipalStandard:
    case Z.PrincipalContract:
      return "principal";
    case Z.List:
      return `(list ${t.list.length} ${t.list.length ? ms(t.list[0]) : "UnknownType"})`;
    case Z.Tuple:
      return `(tuple ${Object.keys(t.data).map((e) => `(${e} ${ms(t.data[e])})`).join(" ")})`;
    case Z.StringASCII:
      return `(string-ascii ${py(t.data).length})`;
    case Z.StringUTF8:
      return `(string-utf8 ${lo(t.data).length})`;
  }
}
const $y = () => ({ type: Z.BoolTrue }), Iy = () => ({ type: Z.BoolFalse }), t8 = (t) => t ? $y() : Iy(), Fh = BigInt("0xffffffffffffffffffffffffffffffff"), e8 = BigInt(0), jh = BigInt("0x7fffffffffffffffffffffffffffffff"), zh = BigInt("-170141183460469231731687303715884105728"), n8 = (t) => {
  const e = gn(t, !0);
  if (e > jh)
    throw new RangeError(`Cannot construct clarity integer from value greater than ${jh}`);
  if (e < zh)
    throw new RangeError(`Cannot construct clarity integer form value less than ${zh}`);
  return { type: Z.Int, value: e };
}, Sr = (t) => {
  const e = gn(t, !1);
  if (e < e8)
    throw new RangeError("Cannot construct unsigned clarity integer from negative value");
  if (e > Fh)
    throw new RangeError(`Cannot construct unsigned clarity integer greater than ${Fh}`);
  return { type: Z.UInt, value: e };
}, Ly = (t) => {
  if (t.byteLength > 1048576)
    throw new Error("Cannot construct clarity buffer that is greater than 1MB");
  return { type: Z.Buffer, buffer: t };
};
function Cy() {
  return { type: Z.OptionalNone };
}
function Ty(t) {
  return { type: Z.OptionalSome, value: t };
}
function r8(t) {
  return { type: Z.ResponseErr, value: t };
}
function s8(t) {
  return { type: Z.ResponseOk, value: t };
}
function i8(t) {
  return { type: Z.List, list: t };
}
function li(t) {
  for (const e in t)
    if (!W8(e))
      throw new Error(`"${e}" is not a valid Clarity name`);
  return { type: Z.Tuple, data: t };
}
const Qe = (t) => ({ type: Z.StringASCII, data: t }), o8 = (t) => ({ type: Z.StringUTF8, data: t });
class By extends by {
  constructor(e, n) {
    super(), this.finished = !1, this.destroyed = !1, zs.hash(e);
    const r = Mf(n);
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
    return zs.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    zs.exists(this), zs.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
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
const My = (t, e, n) => new By(t, e).update(n).digest();
My.create = (t, e) => new By(t, e);
Te.hmacSha256Sync = (t, ...e) => {
  const n = My.create(Uf, t);
  return e.forEach((r) => n.update(r)), n.digest();
};
function to(t) {
  return {
    type: ft.PublicKey,
    data: ge(t)
  };
}
function a8(t, e, n = xe.Compressed) {
  const r = K4(e.data), s = new Un(Bh(r.r), Bh(r.s)), i = Ht.fromSignature(t, s, r.recoveryId), o = n === xe.Compressed;
  return i.toHex(o);
}
function c8(t) {
  return { type: ft.PublicKey, data: t };
}
function uo(t) {
  return !Dt(t.data).startsWith("04");
}
function lc(t) {
  return t.data.slice();
}
function l8(t) {
  const e = d8(t), n = Ko(e.data.slice(0, 32), e.compressed);
  return to(Dt(n));
}
function u8(t) {
  const e = typeof t == "string" ? t : Dt(t), n = Ht.fromHex(e).toHex(!0);
  return to(n);
}
function f8(t) {
  const e = typeof t == "string" ? t : Dt(t), n = Ht.fromHex(e).toHex(!1);
  return to(n);
}
function Eu(t) {
  const e = t.readUInt8(), n = e === 4 ? nv : ev;
  return c8(_e([e, t.readBytes(n)]));
}
function d8(t) {
  const e = V4(t), n = e.length == gy;
  return { data: e, compressed: n };
}
function h8(t, e) {
  const [n, r] = Ec(e, t.data.slice(0, 32), {
    canonical: !0,
    recovered: !0
  });
  if (r == null)
    throw new Error("No signature recoveryId received");
  const i = Yo(r, 1) + Un.fromHex(n).toCompactHex();
  return Ay(i);
}
function p8(t) {
  return l8(t.data);
}
function g8(t, e, n) {
  return typeof t == "string" && (t = vy(t)), typeof n == "string" && (n = Kh(n)), {
    type: ft.Payload,
    payloadType: Ut.TokenTransfer,
    recipient: t,
    amount: gn(e, !1),
    memo: n ?? Kh("")
  };
}
function y8(t, e, n, r) {
  return typeof t == "string" && (t = Hf(t)), typeof e == "string" && (e = ci(e)), typeof n == "string" && (n = ci(n)), {
    type: ft.Payload,
    payloadType: Ut.ContractCall,
    contractAddress: t,
    contractName: e,
    functionName: n,
    functionArgs: r
  };
}
function Rh(t, e, n) {
  return typeof t == "string" && (t = ci(t)), typeof e == "string" && (e = k8(e)), typeof n == "number" ? {
    type: ft.Payload,
    payloadType: Ut.VersionedSmartContract,
    clarityVersion: n,
    contractName: t,
    codeBody: e
  } : {
    type: ft.Payload,
    payloadType: Ut.SmartContract,
    contractName: t,
    codeBody: e
  };
}
function w8() {
  return { type: ft.Payload, payloadType: Ut.PoisonMicroblock };
}
function Gh(t, e) {
  if (t.byteLength != Vs)
    throw Error(`Coinbase buffer size must be ${Vs} bytes`);
  return e != null ? {
    type: ft.Payload,
    payloadType: Ut.CoinbaseToAltRecipient,
    coinbaseBytes: t,
    recipient: e
  } : {
    type: ft.Payload,
    payloadType: Ut.Coinbase,
    coinbaseBytes: t
  };
}
function b8(t, e, n) {
  if (t.byteLength != Vs)
    throw Error(`Coinbase buffer size must be ${Vs} bytes`);
  if (n.byteLength != wu)
    throw Error(`VRF proof buffer size must be ${wu} bytes`);
  return {
    type: ft.Payload,
    payloadType: Ut.NakamotoCoinbase,
    coinbaseBytes: t,
    recipient: e.type === Z.OptionalSome ? e.value : void 0,
    vrfProof: n
  };
}
var Au;
(function(t) {
  t[t.BlockFound = 0] = "BlockFound", t[t.Extended = 1] = "Extended";
})(Au || (Au = {}));
function m8(t, e, n, r, s, i, o) {
  return {
    type: ft.Payload,
    payloadType: Ut.TenureChange,
    tenureHash: t,
    previousTenureHash: e,
    burnViewHash: n,
    previousTenureEnd: r,
    previousTenureBlocks: s,
    cause: i,
    publicKeyHash: o
  };
}
function Ny(t) {
  const e = [];
  switch (e.push(t.payloadType), t.payloadType) {
    case Ut.TokenTransfer:
      e.push(Ne(t.recipient)), e.push($s(t.amount, !1, 8)), e.push(Ur(t.memo));
      break;
    case Ut.ContractCall:
      e.push(Ur(t.contractAddress)), e.push(Ur(t.contractName)), e.push(Ur(t.functionName));
      const n = new Uint8Array(4);
      ai(n, t.functionArgs.length, 0), e.push(n), t.functionArgs.forEach((r) => {
        e.push(Ne(r));
      });
      break;
    case Ut.SmartContract:
      e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case Ut.VersionedSmartContract:
      e.push(t.clarityVersion), e.push(Ur(t.contractName)), e.push(Ur(t.codeBody));
      break;
    case Ut.PoisonMicroblock:
      break;
    case Ut.Coinbase:
      e.push(t.coinbaseBytes);
      break;
    case Ut.CoinbaseToAltRecipient:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient));
      break;
    case Ut.NakamotoCoinbase:
      e.push(t.coinbaseBytes), e.push(Ne(t.recipient ? Ty(t.recipient) : Cy())), e.push(t.vrfProof);
      break;
    case Ut.TenureChange:
      e.push(ge(t.tenureHash)), e.push(ge(t.previousTenureHash)), e.push(ge(t.burnViewHash)), e.push(ge(t.previousTenureEnd)), e.push(ai(new Uint8Array(4), t.previousTenureBlocks)), e.push(Y4(new Uint8Array(1), t.cause)), e.push(ge(t.publicKeyHash));
      break;
  }
  return _e(e);
}
function x8(t) {
  switch (t.readUInt8Enum(Ut, (n) => {
    throw new Error(`Cannot recognize PayloadType: ${n}`);
  })) {
    case Ut.TokenTransfer:
      const n = qn(t), r = gn(t.readBytes(8), !1), s = _y(t);
      return g8(n, r, s);
    case Ut.ContractCall:
      const i = eo(t), o = Vn(t), a = Vn(t), c = [], u = t.readUInt32BE();
      for (let E = 0; E < u; E++) {
        const _ = qn(t);
        c.push(_);
      }
      return y8(i, o, a, c);
    case Ut.SmartContract:
      const f = Vn(t), l = Vn(t, 4, 1e5);
      return Rh(f, l);
    case Ut.VersionedSmartContract: {
      const E = t.readUInt8Enum(bu, (J) => {
        throw new Error(`Cannot recognize ClarityVersion: ${J}`);
      }), _ = Vn(t), N = Vn(t, 4, 1e5);
      return Rh(_, N, E);
    }
    case Ut.PoisonMicroblock:
      return w8();
    case Ut.Coinbase: {
      const E = t.readBytes(Vs);
      return Gh(E);
    }
    case Ut.CoinbaseToAltRecipient: {
      const E = t.readBytes(Vs), _ = qn(t);
      return Gh(E, _);
    }
    case Ut.NakamotoCoinbase: {
      const E = t.readBytes(Vs), _ = qn(t), N = t.readBytes(wu);
      return b8(E, _, N);
    }
    case Ut.TenureChange:
      const w = Dt(t.readBytes(20)), p = Dt(t.readBytes(20)), m = Dt(t.readBytes(20)), S = Dt(t.readBytes(32)), M = t.readUInt32BE(), R = t.readUInt8Enum(Au, (E) => {
        throw new Error(`Cannot recognize TenureChangeCause: ${E}`);
      }), z = Dt(t.readBytes(20));
      return m8(w, p, m, S, M, R, z);
  }
}
class Kc extends Error {
  constructor(e) {
    super(e), this.message = e, this.name = this.constructor.name, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
}
class Hs extends Kc {
  constructor(e) {
    super(e);
  }
}
class _n extends Kc {
  constructor(e) {
    super(e);
  }
}
class uc extends Kc {
  constructor(e) {
    super(e);
  }
}
class Rs extends Kc {
  constructor(e) {
    super(e);
  }
}
var tr;
(function(t) {
  t[t.PublicKeyCompressed = 0] = "PublicKeyCompressed", t[t.PublicKeyUncompressed = 1] = "PublicKeyUncompressed", t[t.SignatureCompressed = 2] = "SignatureCompressed", t[t.SignatureUncompressed = 3] = "SignatureUncompressed";
})(tr || (tr = {}));
function vu(t) {
  return Ay(Dt(t.readBytes(Rc)));
}
function _i(t, e) {
  return {
    pubKeyEncoding: t,
    type: ft.TransactionAuthField,
    contents: e
  };
}
function S8(t) {
  const e = t.readUInt8Enum(tr, (n) => {
    throw new _n(`Could not read ${n} as AuthFieldType`);
  });
  switch (e) {
    case tr.PublicKeyCompressed:
      return _i(xe.Compressed, Eu(t));
    case tr.PublicKeyUncompressed:
      return _i(xe.Uncompressed, f8(Eu(t).data));
    case tr.SignatureCompressed:
      return _i(xe.Compressed, vu(t));
    case tr.SignatureUncompressed:
      return _i(xe.Uncompressed, vu(t));
    default:
      throw new Error(`Unknown auth field type: ${JSON.stringify(e)}`);
  }
}
function Of(t) {
  return ge(t.data);
}
function E8(t) {
  const e = [];
  switch (t.contents.type) {
    case ft.PublicKey:
      e.push(t.pubKeyEncoding === xe.Compressed ? tr.PublicKeyCompressed : tr.PublicKeyUncompressed), e.push(lc(u8(t.contents.data)));
      break;
    case ft.MessageSignature:
      e.push(t.pubKeyEncoding === xe.Compressed ? tr.SignatureCompressed : tr.SignatureUncompressed), e.push(Of(t.contents));
      break;
  }
  return _e(e);
}
function Ur(t) {
  switch (t.type) {
    case ft.Address:
      return Zo(t);
    case ft.Principal:
      return Py(t);
    case ft.LengthPrefixedString:
      return no(t);
    case ft.MemoString:
      return $8(t);
    case ft.AssetInfo:
      return Uy(t);
    case ft.PostCondition:
      return I8(t);
    case ft.PublicKey:
      return lc(t);
    case ft.LengthPrefixedList:
      return jf(t);
    case ft.Payload:
      return Ny(t);
    case ft.TransactionAuthField:
      return E8(t);
    case ft.MessageSignature:
      return Of(t);
  }
}
function A8() {
  return {
    type: ft.Address,
    version: cc.MainnetSingleSig,
    hash160: "0".repeat(40)
  };
}
function Df(t, e, n, r) {
  if (r.length === 0)
    throw Error("Invalid number of public keys");
  if ((e === re.SerializeP2PKH || e === re.SerializeP2WPKH) && (r.length !== 1 || n !== 1))
    throw Error("Invalid number of public keys or signatures");
  if ((e === re.SerializeP2WPKH || e === re.SerializeP2WSH || e === re.SerializeP2WSHNonSequential) && !r.every(uo))
    throw Error("Public keys must be compressed for segwit");
  switch (e) {
    case re.SerializeP2PKH:
      return vo(t, G8(r[0].data));
    case re.SerializeP2WPKH:
      return vo(t, K8(r[0].data));
    case re.SerializeP2SH:
    case re.SerializeP2SHNonSequential:
      return vo(t, V8(n, r.map(lc)));
    case re.SerializeP2WSH:
    case re.SerializeP2WSHNonSequential:
      return vo(t, q8(n, r.map(lc)));
  }
}
function Zo(t) {
  const e = [];
  return e.push(ge(Yo(t.version, 1))), e.push(ge(t.hash160)), _e(e);
}
function eo(t) {
  const e = jc(Dt(t.readBytes(1))), n = Dt(t.readBytes(20));
  return { type: ft.Address, version: e, hash160: n };
}
function Py(t) {
  const e = [];
  return e.push(t.prefix), e.push(Zo(t.address)), t.prefix === Do.Contract && e.push(no(t.contractName)), _e(e);
}
function v8(t) {
  const e = t.readUInt8Enum(Do, (s) => {
    throw new _n(`Unexpected Principal payload type: ${s}`);
  }), n = eo(t);
  if (e === Do.Standard)
    return { type: ft.Principal, prefix: e, address: n };
  const r = Vn(t);
  return {
    type: ft.Principal,
    prefix: e,
    address: n,
    contractName: r
  };
}
function no(t) {
  const e = [], n = lo(t.content), r = n.byteLength;
  return e.push(ge(Yo(r, t.lengthPrefixBytes))), e.push(n), _e(e);
}
function Vn(t, e, n) {
  e = e || 1;
  const r = jc(Dt(t.readBytes(e))), s = Bf(t.readBytes(r));
  return ci(s, e, n ?? 128);
}
function k8(t) {
  return ci(t, 4, 1e5);
}
function Kh(t) {
  if (t && Fy(t, oc))
    throw new Error(`Memo exceeds maximum length of ${oc} bytes`);
  return { type: ft.MemoString, content: t };
}
function $8(t) {
  const e = [], n = lo(t.content), r = R8(Dt(n), oc * 2);
  return e.push(ge(r)), _e(e);
}
function _y(t) {
  let e = Bf(t.readBytes(oc));
  return e = e.replace(/\u0000*$/, ""), { type: ft.MemoString, content: e };
}
function Uy(t) {
  const e = [];
  return e.push(Zo(t.address)), e.push(no(t.contractName)), e.push(no(t.assetName)), _e(e);
}
function ku(t) {
  return {
    type: ft.AssetInfo,
    address: eo(t),
    contractName: Vn(t),
    assetName: Vn(t)
  };
}
function Ff(t, e) {
  return {
    type: ft.LengthPrefixedList,
    lengthPrefixBytes: e || 4,
    values: t
  };
}
function jf(t) {
  const e = t.values, n = [];
  n.push(ge(Yo(e.length, t.lengthPrefixBytes)));
  for (const r of e)
    n.push(Ur(r));
  return _e(n);
}
function Hy(t, e, n) {
  const r = jc(Dt(t.readBytes(4))), s = [];
  for (let i = 0; i < r; i++)
    switch (e) {
      case ft.Address:
        s.push(eo(t));
        break;
      case ft.LengthPrefixedString:
        s.push(Vn(t));
        break;
      case ft.MemoString:
        s.push(_y(t));
        break;
      case ft.AssetInfo:
        s.push(ku(t));
        break;
      case ft.PostCondition:
        s.push(L8(t));
        break;
      case ft.PublicKey:
        s.push(Eu(t));
        break;
      case ft.TransactionAuthField:
        s.push(S8(t));
        break;
    }
  return Ff(s, n);
}
function I8(t) {
  const e = [];
  if (e.push(t.conditionType), e.push(Py(t.principal)), (t.conditionType === An.Fungible || t.conditionType === An.NonFungible) && e.push(Uy(t.assetInfo)), t.conditionType === An.NonFungible && e.push(Ne(t.assetName)), e.push(t.conditionCode), t.conditionType === An.STX || t.conditionType === An.Fungible) {
    if (t.amount > BigInt("0xffffffffffffffff"))
      throw new Hs("The post-condition amount may not be larger than 8 bytes");
    e.push($s(t.amount, !1, 8));
  }
  return _e(e);
}
function L8(t) {
  const e = t.readUInt8Enum(An, (o) => {
    throw new _n(`Could not read ${o} as PostConditionType`);
  }), n = v8(t);
  let r, s, i;
  switch (e) {
    case An.STX:
      return r = t.readUInt8Enum(Oo, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Dt(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: An.STX,
        principal: n,
        conditionCode: r,
        amount: i
      };
    case An.Fungible:
      return s = ku(t), r = t.readUInt8Enum(Oo, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), i = BigInt(`0x${Dt(t.readBytes(8))}`), {
        type: ft.PostCondition,
        conditionType: An.Fungible,
        principal: n,
        conditionCode: r,
        amount: i,
        assetInfo: s
      };
    case An.NonFungible:
      s = ku(t);
      const o = qn(t);
      return r = t.readUInt8Enum(mu, (a) => {
        throw new _n(`Could not read ${a} as FungibleConditionCode`);
      }), {
        type: ft.PostCondition,
        conditionType: An.NonFungible,
        principal: n,
        conditionCode: r,
        assetInfo: s,
        assetName: o
      };
  }
}
function $r(t, e) {
  return _e([t, e]);
}
function C8(t) {
  return new Uint8Array([t.type]);
}
function T8(t) {
  return t.type === Z.OptionalNone ? new Uint8Array([t.type]) : $r(t.type, Ne(t.value));
}
function B8(t) {
  const e = new Uint8Array(4);
  return ai(e, t.buffer.length, 0), $r(t.type, zc(e, t.buffer));
}
function M8(t) {
  const e = Tf(D4(t.value, BigInt(tv)), yy);
  return $r(t.type, e);
}
function N8(t) {
  const e = Tf(t.value, yy);
  return $r(t.type, e);
}
function P8(t) {
  return $r(t.type, Zo(t.address));
}
function _8(t) {
  return $r(t.type, zc(Zo(t.address), no(t.contractName)));
}
function U8(t) {
  return $r(t.type, Ne(t.value));
}
function H8(t) {
  const e = [], n = new Uint8Array(4);
  ai(n, t.list.length, 0), e.push(n);
  for (const r of t.list) {
    const s = Ne(r);
    e.push(s);
  }
  return $r(t.type, _e(e));
}
function O8(t) {
  const e = [], n = new Uint8Array(4);
  ai(n, Object.keys(t.data).length, 0), e.push(n);
  const r = Object.keys(t.data).sort((s, i) => s.localeCompare(i));
  for (const s of r) {
    const i = ci(s);
    e.push(no(i));
    const o = Ne(t.data[s]);
    e.push(o);
  }
  return $r(t.type, _e(e));
}
function Oy(t, e) {
  const n = [], r = e == "ascii" ? py(t.data) : lo(t.data), s = new Uint8Array(4);
  return ai(s, r.length, 0), n.push(s), n.push(r), $r(t.type, _e(n));
}
function D8(t) {
  return Oy(t, "ascii");
}
function F8(t) {
  return Oy(t, "utf8");
}
function Ne(t) {
  switch (t.type) {
    case Z.BoolTrue:
    case Z.BoolFalse:
      return C8(t);
    case Z.OptionalNone:
    case Z.OptionalSome:
      return T8(t);
    case Z.Buffer:
      return B8(t);
    case Z.UInt:
      return N8(t);
    case Z.Int:
      return M8(t);
    case Z.PrincipalStandard:
      return P8(t);
    case Z.PrincipalContract:
      return _8(t);
    case Z.ResponseOk:
    case Z.ResponseErr:
      return U8(t);
    case Z.List:
      return H8(t);
    case Z.Tuple:
      return O8(t);
    case Z.StringASCII:
      return D8(t);
    case Z.StringUTF8:
      return F8(t);
    default:
      throw new Hs("Unable to serialize. Invalid Clarity Value.");
  }
}
function j8(t) {
  const e = Object.values(t).filter((r) => typeof r == "number"), n = new Set(e);
  return (r) => n.has(r);
}
const Vh = /* @__PURE__ */ new Map();
function Dy(t, e) {
  const n = Vh.get(t);
  if (n !== void 0)
    return n(e);
  const r = j8(t);
  return Vh.set(t, r), Dy(t, e);
}
class Co {
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
    return X4(this.readBytes(1), 0);
  }
  readUInt16BE() {
    return q4(this.readBytes(2), 0);
  }
  readBigUIntLE(e) {
    const n = this.readBytes(e).slice().reverse(), r = Dt(n);
    return BigInt(`0x${r}`);
  }
  readBigUIntBE(e) {
    const n = this.readBytes(e), r = Dt(n);
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
    if (Dy(e, r))
      return r;
    throw n(r);
  }
}
function qn(t) {
  let e;
  if (typeof t == "string") {
    const r = t.slice(0, 2).toLowerCase() === "0x";
    e = new Co(ge(r ? t.slice(2) : t));
  } else t instanceof Uint8Array ? e = new Co(t) : e = t;
  switch (e.readUInt8Enum(Z, (r) => {
    throw new _n(`Cannot recognize Clarity Type: ${r}`);
  })) {
    case Z.Int:
      return n8(e.readBytes(16));
    case Z.UInt:
      return Sr(e.readBytes(16));
    case Z.Buffer:
      const r = e.readUInt32BE();
      return Ly(e.readBytes(r));
    case Z.BoolTrue:
      return $y();
    case Z.BoolFalse:
      return Iy();
    case Z.PrincipalStandard:
      const s = eo(e);
      return Qv(s);
    case Z.PrincipalContract:
      const i = eo(e), o = Vn(e);
      return ky(i, o);
    case Z.ResponseOk:
      return s8(qn(e));
    case Z.ResponseErr:
      return r8(qn(e));
    case Z.OptionalNone:
      return Cy();
    case Z.OptionalSome:
      return Ty(qn(e));
    case Z.List:
      const a = e.readUInt32BE(), c = [];
      for (let S = 0; S < a; S++)
        c.push(qn(e));
      return i8(c);
    case Z.Tuple:
      const u = e.readUInt32BE(), f = {};
      for (let S = 0; S < u; S++) {
        const M = Vn(e).content;
        if (M === void 0)
          throw new _n('"content" is undefined');
        f[M] = qn(e);
      }
      return li(f);
    case Z.StringASCII:
      const l = e.readUInt32BE(), w = R4(e.readBytes(l));
      return Qe(w);
    case Z.StringUTF8:
      const p = e.readUInt32BE(), m = Bf(e.readBytes(p));
      return o8(m);
    default:
      throw new _n("Unable to deserialize Clarity Value from Uint8Array. Could not find valid Clarity Type.");
  }
}
const z8 = (t) => t.length % 2 == 0 ? t : `0${t}`, R8 = (t, e) => t.padEnd(e, "0"), Fy = (t, e) => t ? lo(t).length > e : !1;
function $u(t) {
  return ig(t);
}
const Fo = (t) => bv(Uf(t)), zf = (t) => Dt(Xv(t)), G8 = (t) => Dt(Fo(t)), K8 = (t) => {
  const e = Fo(t), n = zc(new Uint8Array([0]), new Uint8Array([e.length]), e), r = Fo(n);
  return Dt(r);
}, V8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2SH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((i) => {
    n.push(i.length), n.push(i);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Fo(r);
  return Dt(s);
}, q8 = (t, e) => {
  if (t > 15 || e.length > 15)
    throw Error("P2WSH multisig address can only contain up to 15 public keys");
  const n = [];
  n.push(80 + t), e.forEach((c) => {
    n.push(c.length), n.push(c);
  }), n.push(80 + e.length), n.push(174);
  const r = _e(n), s = Uf(r), i = [];
  i.push(0), i.push(s.length), i.push(s);
  const o = _e(i), a = Fo(o);
  return Dt(a);
};
function W8(t) {
  return /^[a-zA-Z]([a-zA-Z0-9]|[-_!?+<>=/*])*$|^[-+=/*]$|^[<>]=?$/.test(t) && t.length < 128;
}
function jy(t) {
  const e = Ne(t);
  return `0x${Dt(e)}`;
}
function X8(t) {
  return qn(t);
}
const Oi = (t) => {
  try {
    return yi.c32addressDecode(t), !0;
  } catch {
    return !1;
  }
};
function Rf() {
  return {
    type: ft.MessageSignature,
    data: Dt(new Uint8Array(Rc))
  };
}
function zy(t, e, n, r) {
  const s = Df(0, t, 1, [to(e)]).hash160, i = uo(to(e)) ? xe.Compressed : xe.Uncompressed;
  return {
    hashMode: t,
    signer: s,
    nonce: gn(n, !1),
    fee: gn(r, !1),
    keyEncoding: i,
    signature: Rf()
  };
}
function jo(t) {
  return "signature" in t;
}
function qh(t) {
  return t === re.SerializeP2SH || t === re.SerializeP2WSH;
}
function Y8(t) {
  return t === re.SerializeP2SHNonSequential || t === re.SerializeP2WSHNonSequential;
}
function Wh(t) {
  const e = $u(t);
  return e.nonce = 0, e.fee = 0, jo(e) ? e.signature = Rf() : e.fields = [], {
    ...e,
    nonce: BigInt(0),
    fee: BigInt(0)
  };
}
function Z8(t) {
  const e = [
    t.hashMode,
    ge(t.signer),
    $s(t.nonce, !1, 8),
    $s(t.fee, !1, 8),
    t.keyEncoding,
    Of(t.signature)
  ];
  return _e(e);
}
function Q8(t) {
  const e = [
    t.hashMode,
    ge(t.signer),
    $s(t.nonce, !1, 8),
    $s(t.fee, !1, 8)
  ], n = Ff(t.fields);
  e.push(jf(n));
  const r = new Uint8Array(2);
  return W4(r, t.signaturesRequired, 0), e.push(r), _e(e);
}
function J8(t, e) {
  const n = Dt(e.readBytes(20)), r = BigInt(`0x${Dt(e.readBytes(8))}`), s = BigInt(`0x${Dt(e.readBytes(8))}`), i = e.readUInt8Enum(xe, (a) => {
    throw new _n(`Could not parse ${a} as PubKeyEncoding`);
  });
  if (t === re.SerializeP2WPKH && i != xe.Compressed)
    throw new _n("Failed to parse singlesig spending condition: incomaptible hash mode and key encoding");
  const o = vu(e);
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    keyEncoding: i,
    signature: o
  };
}
function t5(t, e) {
  const n = Dt(e.readBytes(20)), r = BigInt("0x" + Dt(e.readBytes(8))), s = BigInt("0x" + Dt(e.readBytes(8))), i = Hy(e, ft.TransactionAuthField).values;
  let o = !1, a = 0;
  for (const u of i)
    switch (u.contents.type) {
      case ft.PublicKey:
        uo(u.contents) || (o = !0);
        break;
      case ft.MessageSignature:
        if (u.pubKeyEncoding === xe.Uncompressed && (o = !0), a += 1, a === 65536)
          throw new Rs("Failed to parse multisig spending condition: too many signatures");
        break;
    }
  const c = e.readUInt16BE();
  if (o && (t === re.SerializeP2WSH || t === re.SerializeP2WSHNonSequential))
    throw new Rs("Uncompressed keys are not allowed in this hash mode");
  return {
    hashMode: t,
    signer: n,
    nonce: r,
    fee: s,
    fields: i,
    signaturesRequired: c
  };
}
function gl(t) {
  return jo(t) ? Z8(t) : Q8(t);
}
function yl(t) {
  const e = t.readUInt8Enum(re, (n) => {
    throw new _n(`Could not parse ${n} as AddressHashMode`);
  });
  return e === re.SerializeP2PKH || e === re.SerializeP2WPKH ? J8(e, t) : t5(e, t);
}
function Ry(t, e, n, r) {
  const i = t + Dt(new Uint8Array([e])) + Dt($s(n, !1, 8)) + Dt($s(r, !1, 8));
  if (ge(i).byteLength !== 49)
    throw Error("Invalid signature hash length");
  return zf(ge(i));
}
function Gy(t, e, n) {
  const r = 33 + Rc, s = uo(e) ? xe.Compressed : xe.Uncompressed, i = t + z8(s.toString(16)) + n.data, o = ge(i);
  if (o.byteLength > r)
    throw Error("Invalid signature hash length");
  return zf(o);
}
function e5(t, e, n, r, s) {
  const i = Ry(t, e, n, r), o = h8(s, i), a = p8(s), c = Gy(i, a, o);
  return {
    nextSig: o,
    nextSigHash: c
  };
}
function Ky(t, e, n, r, s, i) {
  const o = Ry(t, e, n, r), a = to(a8(o, i, s)), c = Gy(o, a, i);
  return {
    pubKey: a,
    nextSigHash: c
  };
}
function n5() {
  const t = zy(re.SerializeP2PKH, "", 0, 0);
  return t.signer = A8().hash160, t.keyEncoding = xe.Compressed, t.signature = Rf(), t;
}
function Xh(t, e, n) {
  return jo(t) ? r5(t, e, n) : s5(t, e, n);
}
function r5(t, e, n) {
  const { pubKey: r, nextSigHash: s } = Ky(e, n, t.fee, t.nonce, t.keyEncoding, t.signature), i = Df(0, t.hashMode, 1, [r]).hash160;
  if (i !== t.signer)
    throw new Rs(`Signer hash does not equal hash of public key(s): ${i} != ${t.signer}`);
  return s;
}
function s5(t, e, n) {
  const r = [];
  let s = e, i = !1, o = 0;
  for (const c of t.fields)
    switch (c.contents.type) {
      case ft.PublicKey:
        uo(c.contents) || (i = !0), r.push(c.contents);
        break;
      case ft.MessageSignature:
        c.pubKeyEncoding === xe.Uncompressed && (i = !0);
        const { pubKey: u, nextSigHash: f } = Ky(s, n, t.fee, t.nonce, c.pubKeyEncoding, c.contents);
        if (qh(t.hashMode) && (s = f), r.push(u), o += 1, o === 65536)
          throw new Rs("Too many signatures");
        break;
    }
  if (qh(t.hashMode) && o !== t.signaturesRequired || Y8(t.hashMode) && o < t.signaturesRequired)
    throw new Rs("Incorrect number of signatures");
  if (i && (t.hashMode === re.SerializeP2WSH || t.hashMode === re.SerializeP2WSHNonSequential))
    throw new Rs("Uncompressed keys are not allowed in this hash mode");
  const a = Df(0, t.hashMode, t.signaturesRequired, r).hash160;
  if (a !== t.signer)
    throw new Rs(`Signer hash does not equal hash of public key(s): ${a} != ${t.signer}`);
  return s;
}
function Vy(t) {
  return {
    authType: Ce.Standard,
    spendingCondition: t
  };
}
function qy(t, e) {
  return {
    authType: Ce.Sponsored,
    spendingCondition: t,
    sponsorSpendingCondition: e || zy(re.SerializeP2PKH, "0".repeat(66), 0, 0)
  };
}
function Yh(t) {
  if (t.spendingCondition)
    switch (t.authType) {
      case Ce.Standard:
        return Vy(Wh(t.spendingCondition));
      case Ce.Sponsored:
        return qy(Wh(t.spendingCondition), n5());
      default:
        throw new uc("Unexpected authorization type for signing");
    }
  throw new Error("Authorization missing SpendingCondition");
}
function i5(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      return Xh(t.spendingCondition, e, Ce.Standard);
    case Ce.Sponsored:
      return Xh(t.spendingCondition, e, Ce.Standard);
    default:
      throw new uc("Invalid origin auth type");
  }
}
function o5(t, e) {
  switch (t.authType) {
    case Ce.Standard:
      const n = {
        ...t.spendingCondition,
        fee: gn(e, !1)
      };
      return { ...t, spendingCondition: n };
    case Ce.Sponsored:
      const r = {
        ...t.sponsorSpendingCondition,
        fee: gn(e, !1)
      };
      return { ...t, sponsorSpendingCondition: r };
  }
}
function a5(t, e) {
  const n = {
    ...t.spendingCondition,
    nonce: gn(e, !1)
  };
  return {
    ...t,
    spendingCondition: n
  };
}
function c5(t, e) {
  const n = {
    ...t.sponsorSpendingCondition,
    nonce: gn(e, !1)
  };
  return {
    ...t,
    sponsorSpendingCondition: n
  };
}
function l5(t, e) {
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
function u5(t) {
  const e = [];
  switch (e.push(t.authType), t.authType) {
    case Ce.Standard:
      e.push(gl(t.spendingCondition));
      break;
    case Ce.Sponsored:
      e.push(gl(t.spendingCondition)), e.push(gl(t.sponsorSpendingCondition));
      break;
  }
  return _e(e);
}
function f5(t) {
  const e = t.readUInt8Enum(Ce, (r) => {
    throw new _n(`Could not parse ${r} as AuthType`);
  });
  let n;
  switch (e) {
    case Ce.Standard:
      return n = yl(t), Vy(n);
    case Ce.Sponsored:
      n = yl(t);
      const r = yl(t);
      return qy(n, r);
  }
}
class d5 {
  constructor(e, n, r, s, i, o, a) {
    if (this.version = e, this.auth = n, "amount" in r ? this.payload = {
      ...r,
      amount: gn(r.amount, !1)
    } : this.payload = r, this.chainId = a ?? Q4, this.postConditionMode = i ?? Ji.Deny, this.postConditions = s ?? Ff([]), o)
      this.anchorMode = rv(o);
    else
      switch (r.payloadType) {
        case Ut.Coinbase:
        case Ut.CoinbaseToAltRecipient:
        case Ut.NakamotoCoinbase:
        case Ut.PoisonMicroblock:
        case Ut.TenureChange:
          this.anchorMode = En.OnChainOnly;
          break;
        case Ut.ContractCall:
        case Ut.SmartContract:
        case Ut.VersionedSmartContract:
        case Ut.TokenTransfer:
          this.anchorMode = En.Any;
          break;
      }
  }
  signBegin() {
    const e = $u(this);
    return e.auth = Yh(e.auth), e.txid();
  }
  verifyBegin() {
    const e = $u(this);
    return e.auth = Yh(e.auth), e.txid();
  }
  verifyOrigin() {
    return i5(this.auth, this.verifyBegin());
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
    if (n && !jo(n)) {
      const r = uo(e);
      n.fields.push(_i(r ? xe.Compressed : xe.Uncompressed, e));
    } else
      throw new Error("Can't append public key to a singlesig condition");
  }
  signAndAppend(e, n, r, s) {
    const { nextSig: i, nextSigHash: o } = e5(n, r, e.fee, e.nonce, s);
    return jo(e) ? e.signature = i : e.fields.push(_i(s.data.byteLength === gy ? xe.Compressed : xe.Uncompressed, i)), o;
  }
  txid() {
    const e = this.serialize();
    return zf(e);
  }
  setSponsor(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new uc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = l5(this.auth, e);
  }
  setFee(e) {
    this.auth = o5(this.auth, e);
  }
  setNonce(e) {
    this.auth = a5(this.auth, e);
  }
  setSponsorNonce(e) {
    if (this.auth.authType != Ce.Sponsored)
      throw new uc("Cannot sponsor sign a non-sponsored transaction");
    this.auth = c5(this.auth, e);
  }
  serialize() {
    if (this.version === void 0)
      throw new Hs('"version" is undefined');
    if (this.chainId === void 0)
      throw new Hs('"chainId" is undefined');
    if (this.auth === void 0)
      throw new Hs('"auth" is undefined');
    if (this.anchorMode === void 0)
      throw new Hs('"anchorMode" is undefined');
    if (this.payload === void 0)
      throw new Hs('"payload" is undefined');
    const e = [];
    e.push(this.version);
    const n = new Uint8Array(4);
    return ai(n, this.chainId, 0), e.push(n), e.push(u5(this.auth)), e.push(this.anchorMode), e.push(this.postConditionMode), e.push(jf(this.postConditions)), e.push(Ny(this.payload)), _e(e);
  }
}
function fc(t) {
  let e;
  typeof t == "string" ? t.slice(0, 2).toLowerCase() === "0x" ? e = new Co(ge(t.slice(2))) : e = new Co(ge(t)) : t instanceof Uint8Array ? e = new Co(t) : e = t;
  const n = e.readUInt8Enum(ac, (u) => {
    throw new Error(`Could not parse ${u} as TransactionVersion`);
  }), r = e.readUInt32BE(), s = f5(e), i = e.readUInt8Enum(En, (u) => {
    throw new Error(`Could not parse ${u} as AnchorMode`);
  }), o = e.readUInt8Enum(Ji, (u) => {
    throw new Error(`Could not parse ${u} as PostConditionMode`);
  }), a = Hy(e, ft.PostCondition), c = x8(e);
  return new d5(n, s, c, a, o, i, r);
}
const h5 = t8, To = Sr, p5 = Ly;
const g5 = /* @__PURE__ */ new Set([4001, -31001]), y5 = [
  "XverseProviders.BitcoinProvider",
  "xverseProviders.BitcoinProvider",
  "BitcoinProvider"
], w5 = ["result", "data", "payload", "response", "params"], Zh = [
  "txRaw",
  "txHex",
  "rawTx",
  "rawTransaction",
  "transaction",
  "signedTransaction",
  "hex",
  "serializedTx"
], Vc = (t) => typeof t == "string" && t.toLowerCase().includes("xverse"), xi = () => {
  if (!(typeof window > "u")) {
    try {
      const t = window.top;
      if (t && t !== window.self && t.location.origin === window.location.origin)
        return t;
    } catch {
    }
    return window;
  }
}, Fr = (t, e) => {
  if (!(!t || !e))
    return e.split(".").reduce((n, r) => n == null ? void 0 : n[r], t);
}, b5 = (t, e) => t.id === e.id || !!(t.name && e.name && t.name.toLowerCase() === e.name.toLowerCase()), Wy = (t) => {
  if (!t)
    return [];
  const e = t, n = [
    ...e.btc_providers ?? [],
    ...e.webbtc_providers ?? [],
    ...e.webbtc_stx_providers ?? []
  ];
  return n.filter(
    (r, s) => !!(r != null && r.id) && n.findIndex((i) => b5(i, r)) === s
  );
}, Xy = (t) => t ? Wy(xi()).some(
  (e) => {
    var n;
    return e.id === t && (Vc(e.id) || ((n = e.name) == null ? void 0 : n.toLowerCase().includes("xverse")));
  }
) : !1, Yy = () => {
  if (typeof window > "u")
    return;
  const t = xi(), e = Wy(t).filter(
    (n) => {
      var r;
      return Vc(n.id) || ((r = n.name) == null ? void 0 : r.toLowerCase().includes("xverse"));
    }
  );
  for (const n of e) {
    const r = Fr(t, n.id);
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
  for (const n of y5) {
    const r = Fr(t, n) ?? (t === window ? void 0 : Fr(window, n));
    if (typeof (r == null ? void 0 : r.request) == "function")
      return r;
  }
}, m5 = (t) => {
  if (typeof window > "u" || !t)
    return;
  const e = xi(), n = Fr(e, t) ?? (e === window ? void 0 : Fr(window, t)) ?? Mc(t);
  if (n)
    return n;
  if (Vc(t) || Xy(t))
    return Yy();
}, Ia = (t, e) => {
  try {
    t == null || t(e);
  } catch {
  }
}, x5 = ["blockstack-session", "blockstack"], S5 = () => {
  if (!(typeof window > "u" || !window.localStorage))
    for (const t of x5) {
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
S5();
const Zy = (t) => t.startsWith("0x") || t.startsWith("0X") ? t.slice(2) : t, Nn = (t) => {
  if (typeof t != "string")
    return null;
  const e = t.trim();
  return e.length > 0 ? e : null;
}, E5 = (t) => {
  const e = Nn(t);
  if (!e)
    return null;
  const n = Zy(e);
  return !/^[0-9a-f]+$/i.test(n) || n.length !== 64 ? null : e.startsWith("0x") || e.startsWith("0X") ? e : `0x${n}`;
}, A5 = (t) => {
  const e = Nn(t);
  if (!e)
    return null;
  const n = Zy(e);
  return n.length < 128 || n.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(n) ? null : n;
}, Iu = (t, e = "mainnet") => {
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
      return Iu(n.network, e);
    const r = typeof n.coreApiUrl == "string" && n.coreApiUrl || typeof n.url == "string" && n.url || "";
    if (r)
      return Iu(r, e);
  }
  return e;
}, qs = (t) => {
  if (typeof t > "u" || t === null)
    return;
  if (typeof t == "bigint")
    return t.toString(10);
  if (typeof t == "number")
    return Number.isFinite(t) ? String(t) : void 0;
  const e = String(t).trim();
  return e.length > 0 ? e : void 0;
}, zo = (t, e = 0) => {
  if (e > 8)
    return null;
  if (typeof t == "string") {
    const s = t.trim();
    return Oi(s) ? s : null;
  }
  if (!t)
    return null;
  if (Array.isArray(t)) {
    for (const s of t) {
      const i = zo(s, e + 1);
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
    const i = zo(n[s], e + 1);
    if (i)
      return i;
  }
  return typeof n.mainnet == "string" && Oi(n.mainnet) ? n.mainnet.trim() : typeof n.testnet == "string" && Oi(n.testnet) ? n.testnet.trim() : null;
}, Qh = (t) => {
  const e = t && typeof t == "object" && "code" in t ? t.code : void 0, r = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || r.includes("method not found") || r.includes("not supported") || r.includes("unsupported") || r.includes("not available") || r.includes("not implemented") || r.includes("request function is not implemented");
}, Qy = (t) => {
  if (t && typeof t == "object") {
    const r = "code" in t ? t.code : void 0;
    if (typeof r == "number" && g5.has(r))
      return !0;
  }
  const n = (t instanceof Error ? t.message : String(t ?? "")).trim().toLowerCase();
  return /\buser (?:cancelled|canceled|rejected|denied|closed)\b/.test(n) || /\b(?:cancelled|canceled|rejected|denied) by (?:the )?user\b/.test(n) || /\b(?:wallet )?request (?:cancelled|canceled|rejected|denied)\b/.test(n) || n === "cancelled" || n === "canceled";
}, ui = (t) => {
  if (t instanceof Error)
    return t;
  const e = t && typeof t == "object" ? t : {}, n = e.error && typeof e.error == "object" ? e.error : null, r = Nn(n == null ? void 0 : n.message) ?? Nn(e.message) ?? Nn(e.error) ?? Nn(t) ?? "Wallet provider request failed.", s = new Error(r);
  return s.code = (n == null ? void 0 : n.code) ?? e.code, s.data = (n == null ? void 0 : n.data) ?? e.data, s;
}, ro = (t) => {
  if (t && typeof t == "object") {
    const e = t;
    if (e.error)
      throw ui(e);
    if (e.status === "error")
      throw ui(e.result ?? e);
  }
  return t;
}, Jh = async (t, e, n) => {
  if (typeof t.request != "function")
    throw new Error(`Wallet provider does not support request("${e}").`);
  try {
    const r = await t.request(e, n);
    return ro(r);
  } catch (r) {
    throw ui(r);
  }
}, Jy = () => Yy(), Gf = () => {
  if (typeof window > "u")
    return;
  const t = xi();
  for (const e of ["XverseProviders.StacksProvider", "xverseProviders.StacksProvider"]) {
    const n = Fr(t, e) ?? (t === window ? void 0 : Fr(window, e));
    if (n)
      return n;
  }
}, t0 = () => {
  if (typeof window > "u")
    return;
  const t = Gf();
  if (typeof (t == null ? void 0 : t.transactionRequest) == "function")
    return t;
  const e = xi();
  for (const n of ["StacksProvider", "BlockstackProvider"]) {
    const r = Fr(e, n) ?? (e === window ? void 0 : Fr(window, n));
    if (typeof (r == null ? void 0 : r.transactionRequest) == "function")
      return r;
  }
}, Fa = (t) => {
  var r, s;
  const e = ti();
  if (Vc(e) || Xy(e))
    return !0;
  if (typeof window > "u")
    return !1;
  const n = xi() ?? window;
  return t === ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) || t === ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) || t === Jy();
}, wl = (t) => {
  const e = A5(t);
  if (!e)
    return null;
  try {
    const n = fc(e).txid();
    return n.startsWith("0x") ? n : `0x${n}`;
  } catch {
    return null;
  }
}, dc = (t, e = 0) => {
  if (e > 6 || typeof t > "u" || t === null)
    return null;
  const n = wl(t), r = E5(t) ?? n;
  if (r)
    return {
      txId: r,
      txid: r,
      txRaw: n ? Nn(t) ?? void 0 : void 0
    };
  if (Array.isArray(t)) {
    for (const a of t) {
      const c = dc(a, e + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object")
    return null;
  const s = t;
  let i = null;
  for (const a of Zh)
    if (wl(s[a])) {
      i = Nn(s[a]);
      break;
    }
  const o = Nn(s.txId) || Nn(s.txid) || Nn(s.transactionId);
  if (o)
    return {
      ...s,
      txId: o,
      txid: o,
      txRaw: i ?? Nn(s.txRaw) ?? void 0
    };
  for (const a of Zh) {
    const c = wl(s[a]);
    if (c)
      return {
        ...s,
        txId: c,
        txid: c,
        txRaw: Nn(s[a]) ?? void 0
      };
  }
  for (const a of w5) {
    const c = s[a], u = dc(c, e + 1);
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
}, bl = (t) => {
  const e = dc(t);
  if (e)
    return e;
  throw new Error("Wallet response did not include a transaction id.");
}, v5 = (t) => {
  const e = dc(t);
  return e || (t && typeof t == "object" ? t : { result: t });
}, k5 = (t) => ({
  ...t,
  fee: qs(t.fee),
  nonce: qs(t.nonce),
  sponsored: t.sponsored === !0
}), e0 = (t) => ({
  recipient: t.recipient,
  amount: qs(t.amount) ?? "0",
  memo: t.memo,
  network: Iu(t.network),
  address: t.stxAddress,
  fee: qs(t.fee),
  nonce: qs(t.nonce),
  sponsored: t.sponsored ?? !1
}), tw = "WALLET_ADDRESS_MISMATCH", $5 = 45e3;
let Bo = null;
const Lu = (t) => {
  t && (Bo = { address: t, at: Date.now() });
}, I5 = () => {
  Bo = null;
}, L5 = () => Bo && Date.now() - Bo.at <= $5 ? Bo.address : null, C5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e.includes("network mismatch") || e.includes("mismatch") && e.includes("network");
}, T5 = async (t) => {
  I5();
  try {
    await t.request("wallet_disconnect");
  } catch {
  }
  const e = ro(await t.request("wallet_connect")), n = zo(e);
  return Lu(n), n;
}, B5 = async (t, e, n, r) => {
  try {
    return ro(await t.request(e, n));
  } catch (s) {
    const i = ui(s);
    if (!C5(i))
      throw i;
    console.info("[wallet:xverse-preflight]", {
      stage: "NETWORK_MISMATCH_RECOVERY",
      method: e,
      message: i.message
    });
    let o = null;
    try {
      o = await T5(t);
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
        { code: o ? tw : void 0 }
      );
    console.info("[wallet:xverse-preflight]", { stage: "RECOVERY_RETRY", method: e, address: o });
    try {
      return ro(await t.request(e, n));
    } catch (a) {
      throw ui(a);
    }
  }
};
let n0 = 3e4;
const M5 = (t, e) => {
  let n;
  const r = new Promise((s, i) => {
    n = setTimeout(() => {
      i(
        Object.assign(
          new Error(`Xverse did not answer ${e} within ${n0 / 1e3}s.`),
          { code: "XVERSE_ACCOUNT_READ_TIMEOUT" }
        )
      );
    }, n0);
  });
  return Promise.race([t, r]).finally(() => {
    n && clearTimeout(n);
  });
}, N5 = async (t, e, n) => {
  const r = (c, u) => {
    if (e && c !== e)
      throw Object.assign(
        new Error(
          `Xverse active account ${c} (via ${u}) does not match the connected address ${e}. Disconnect and reconnect the wallet, or switch back to the connected account.`
        ),
        { code: tw }
      );
    return c;
  }, s = L5();
  if (s)
    return Ia(n, "account-cached"), console.info("[wallet:xverse-preflight]", { stage: "CACHED_SESSION", address: s }), r(s, "cached-session");
  let i = null;
  Ia(n, "account-read");
  try {
    const c = ro(
      await M5(t.request("wallet_getAccount"), "wallet_getAccount")
    );
    i = zo(c), console.info("[wallet:xverse-preflight]", {
      stage: i ? "READ_OK" : "READ_EMPTY",
      method: "wallet_getAccount",
      address: i
    });
  } catch (c) {
    if (Qy(c))
      throw ui(c);
    Ia(n, "account-read-failed"), console.info("[wallet:xverse-preflight]", {
      stage: "READ_FAILED",
      method: "wallet_getAccount",
      message: c instanceof Error ? c.message : String(c)
    });
  }
  if (i)
    return Lu(i), r(i, "wallet_getAccount");
  let o;
  Ia(n, "account-reconnect");
  try {
    o = ro(await t.request("wallet_connect"));
  } catch (c) {
    throw console.info("[wallet:xverse-preflight]", {
      stage: "WALLET_CONNECT_FAILED",
      message: c instanceof Error ? c.message : String(c)
    }), ui(c);
  }
  const a = zo(o);
  if (console.info("[wallet:xverse-preflight]", { stage: "WALLET_CONNECT_OK", address: a }), !a)
    throw Object.assign(new Error("Xverse did not return a Stacks account from wallet_connect."), {
      code: "WALLET_ACCOUNT_UNAVAILABLE"
    });
  return Lu(a), r(a, "wallet_connect");
}, P5 = async (t, e) => {
  if (!Fa(t)) {
    const i = await Jh(
      t,
      "stx_transferStx",
      e0(e)
    );
    return bl(i);
  }
  const n = Gf();
  if (typeof (n == null ? void 0 : n.request) == "function") {
    const i = await Jh(
      n,
      "stx_transferStx",
      e0(e)
    );
    return bl(i);
  }
  const r = Jy();
  if (!r)
    throw Object.assign(new Error("Xverse payment provider is not available."), {
      code: "XVERSE_RPC_UNAVAILABLE"
    });
  await N5(r, e.stxAddress);
  const s = await B5(
    r,
    "stx_transferStx",
    {
      recipient: e.recipient,
      amount: qs(e.amount) ?? "0",
      ...e.memo ? { memo: e.memo } : {},
      ...e.fee !== void 0 ? { fee: qs(e.fee) } : {}
    },
    e.stxAddress
  );
  return bl(s);
}, _5 = () => ti(), ew = () => {
  var r, s;
  if (typeof window > "u")
    return;
  const t = ti(), e = t ? m5(t) : void 0;
  if (e)
    return e;
  const n = xi() ?? window;
  return n.LeatherProvider ?? ((r = n.XverseProviders) == null ? void 0 : r.StacksProvider) ?? ((s = n.xverseProviders) == null ? void 0 : s.StacksProvider) ?? n.StacksProvider ?? n.BlockstackProvider;
}, r0 = (t, e) => {
  const n = ew(), r = k5({
    ...t,
    onFinish: (s) => {
      var i;
      (i = t.onFinish) == null || i.call(t, v5(s));
    }
  });
  if (!n || typeof n.request != "function")
    return Aa(r, e);
  if (Fa(n) && !Gf()) {
    const s = t0();
    if (s)
      return console.info("[wallet:stx-transfer]", {
        stage: "PROVIDER_ROUTE",
        providerId: ti(),
        route: "legacy-transaction-request"
      }), Aa(r, s);
  }
  return void P5(n, t).then((s) => {
    var i;
    (i = t.onFinish) == null || i.call(t, s);
  }).catch((s) => {
    var i, o;
    if (Qh(s) && Fa(n)) {
      const a = t0();
      if (a) {
        console.info("[wallet:stx-transfer]", {
          stage: "PROVIDER_ROUTE_RECOVERY",
          providerId: ti(),
          route: "legacy-transaction-request"
        }), Aa(r, a);
        return;
      }
    }
    if (Qh(s) && !Fa(n)) {
      Aa(r, n);
      return;
    }
    if (console.error("[wallet] STX transfer request failed", s), Qy(s)) {
      (i = t.onCancel) == null || i.call(t);
      return;
    }
    if (t.onError) {
      t.onError(s);
      return;
    }
    (o = t.onCancel) == null || o.call(t);
  });
}, U5 = () => ({ name: "Xtrata", icon: `${typeof location < "u" && location.origin && location.origin !== "null" ? location.origin : "https://xtrata.xyz"}/favicons/xtrata-apple-touch-icon.png` }), s0 = (t) => jy(t).replace(/^0x/, ""), i0 = "This wallet cannot sign messages. Try Xverse or Leather.", o0 = (t) => typeof (t == null ? void 0 : t.request) == "function", a0 = (t) => typeof (t == null ? void 0 : t.structuredDataSignatureRequest) == "function", H5 = (t) => {
  const e = t && typeof t == "object" ? t.code : void 0, n = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return e === -32601 || n.includes("method not found") || n.includes("not supported") || n.includes("unsupported") || n.includes("not implemented") || n.includes("not available");
}, O5 = (t) => {
  const e = (t instanceof Error ? t.message : String(t ?? "")).toLowerCase();
  return /legacy (method|api|bridge)/.test(e) || e.includes("no longer supported") || e.includes("request() rpc") || e.includes("upgrade to the");
};
async function D5(t, e) {
  const n = await t.request("stx_signStructuredMessage", {
    message: s0(e.message),
    domain: s0(e.domain)
  });
  if (n != null && n.error)
    throw Object.assign(new Error(n.error.message || "The wallet rejected the signing request."), {
      code: n.error.code
    });
  const r = (n == null ? void 0 : n.result) ?? n;
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function F5(t, e) {
  const n = await M4({
    domain: e.domain,
    message: e.message,
    network: Fc(e.network),
    stxAddress: e.stxAddress,
    appDetails: e.appDetails ?? U5()
  }), r = await t.structuredDataSignatureRequest(n);
  if (!(r != null && r.signature)) throw new Error("The wallet did not return a signature. Nothing changed.");
  return String(r.signature);
}
async function c0(t) {
  var s, i;
  const e = _5() || "", n = /xverse/i.test(e);
  let r = ew();
  if (n && !a0(r)) {
    const o = window;
    r = ((s = o.XverseProviders) == null ? void 0 : s.StacksProvider) ?? ((i = o.xverseProviders) == null ? void 0 : i.StacksProvider);
  }
  if (a0(r))
    try {
      return await F5(r, t);
    } catch (o) {
      if (n || !o0(r) || !O5(o)) throw o;
    }
  if (!n && o0(r))
    try {
      return await D5(r, t);
    } catch (o) {
      throw H5(o) ? new Error(i0) : o;
    }
  throw new Error(i0);
}
const l0 = 1000000n, Gs = 1000000n, hc = 50n, ze = 3000n, Si = 300n, mo = 3000n, j5 = 50000n, ml = 200n, qc = 15000n, Pn = (t) => t + hc;
function pr(t) {
  const e = t < 0n ? "-" : "", n = t < 0n ? -t : t;
  return `${e}${n / l0}.${(n % l0).toString().padStart(6, "0")}`;
}
function u0(t, e = Si) {
  return t <= ze ? 0 : Number((t - ze) / Pn(e));
}
function xl(t, e = 0n) {
  const n = Gs - t - e;
  return n > 0n ? n : 0n;
}
function z5(t, e = Si) {
  return t > Gs ? "over" : t < ze + Pn(e) ? "empty" : t < j5 ? "low" : "ok";
}
const R5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X", G5 = "b81f1a0e1de406102e739f78d200041a270f498edab1bb3320aec54f33cbbbe1", K5 = ["xtrata-v1-1-1", "xtrata-v2-1-0", "xtrata-v3-2-3"];
function V5(t) {
  var n, r, s, i;
  const e = (t == null ? void 0 : t.success) === !0 ? (n = t.value) == null ? void 0 : n.value : null;
  return !e || ((r = e.version) == null ? void 0 : r.value) !== "1" || ((s = e["holder-payment"]) == null ? void 0 : s.value) !== "50" || ((i = e["receipt-bytes"]) == null ? void 0 : i.value) !== "16" || K5.some((o, a) => {
    var c;
    return ((c = e["core-" + (a + 1)]) == null ? void 0 : c.value) !== R5 + "." + o;
  }) ? ["Deployed paid-play configuration does not match the release."] : [];
}
const nw = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0", Sl = 3, q5 = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-likes-v1-0", [Cu, rw] = nw.split("."), Rn = (t) => Array.from(t, (e) => e.toString(16).padStart(2, "0")).join("");
function Tu(t) {
  if (!/^(?:[a-f0-9]{2})+$/i.test(t)) throw Error("Invalid encoded data.");
  return Uint8Array.from(t.match(/../g), (e) => parseInt(e, 16));
}
async function W5(t) {
  return Rn(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))));
}
async function vs(t, e = {}) {
  const n = await fetch("/hiro/mainnet" + t, { ...e, cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (!n.ok) throw Error(`Blockchain service HTTP ${n.status}; no automatic retry payment was made.`);
  return n.json();
}
async function sw(t, e = []) {
  const n = await vs(`/v2/contracts/call-read/${Cu}/${rw}/${t}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sender: Cu, arguments: e.map((r) => "0x" + Rn(Ne(r))) }) });
  if (!n.okay || !n.result) throw Error("Contract read unavailable.");
  return wr(qn(n.result));
}
async function X5() {
  const t = await vs(`/v2/contracts/source/${Cu}/${rw}?proof=0`);
  if (typeof t.source != "string" || await W5(t.source) !== G5) throw Error("Deployed source does not match the tested helper.");
  if (V5(await sw("get-config")).length) throw Error("Paid-play contract configuration mismatch.");
}
function iw(t) {
  return t.startsWith("SP") && Oi(t) && !t.includes(".");
}
async function Y5(t) {
  var r;
  if (!iw(t)) throw Error("Invalid mainnet wallet address.");
  const e = await vs(`/v2/accounts/${t}?proof=0`);
  if (!/^0x[0-9a-f]+$/i.test(e.balance) || !Number.isSafeInteger(e.nonce) || e.nonce < 0) throw Error("Malformed account data.");
  const n = await vs(`/extended/v1/address/${t}/nonces`);
  if (!Number.isSafeInteger(n.possible_next_nonce) || n.possible_next_nonce !== e.nonce || (r = n.detected_missing_nonces) != null && r.length || n.last_mempool_tx_nonce !== null && n.last_mempool_tx_nonce !== void 0 && n.last_mempool_tx_nonce >= e.nonce) throw Error("This wallet has an unresolved transaction or nonce gap. Reconcile first.");
  return { balance: BigInt(e.balance), nonce: BigInt(e.nonce) };
}
async function Z5(t) {
  const e = await vs(`/v2/accounts/${t}?proof=0`);
  return BigInt(e.balance);
}
async function Q5(t, e) {
  var s, i;
  const n = await sw("get-owner", [To(t), To(e)]), r = (n == null ? void 0 : n.success) === !0 ? (i = (s = n.value) == null ? void 0 : s.value) == null ? void 0 : i.value : null;
  if (typeof r != "string" || !iw(r)) throw Error("Master missing or held by an unsupported escrow contract.");
  return r;
}
async function J5(t, e) {
  let n;
  try {
    n = await fetch("/hiro/mainnet/v2/transactions", { method: "POST", headers: { "content-type": "application/octet-stream" }, body: Tu(t), signal: AbortSignal.timeout(15e3) });
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
async function t6(t) {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(t)) throw Error("Invalid transaction ID.");
  const e = await fetch(`/hiro/mainnet/extended/v1/tx/${t}?unanchored=false`, { cache: "no-store", signal: AbortSignal.timeout(15e3) });
  if (e.status === 404) return null;
  if (!e.ok) throw Error("Transaction lookup unavailable.");
  return e.json();
}
function e6(t) {
  if (!t.raw || t.raw.length > 16384 || !t.txid) throw Error("Missing or oversized signed transaction.");
  const e = fc(Tu(t.raw)), n = e.auth, r = e.payload, s = n.spendingCondition;
  if (e.version !== 0 || e.chainId !== 1 || n.authType !== 4 || s.hashMode !== 0 || Pi(vo(cc.MainnetSingleSig, s.signer)) !== t.address || s.fee !== BigInt(t.fee) || s.nonce !== BigInt(t.nonce) || e.txid() !== t.txid.replace(/^0x/, "")) throw Error("Saved transaction does not match its approved terms.");
  if (e.verifyOrigin(), t.kind === "play") {
    const i = e.postConditions.values[0];
    if (r.payloadType !== 2 || Pi(r.contractAddress) + "." + r.contractName.content !== nw || r.functionName.content !== "play" || r.functionArgs.length !== 3 || Rn(Ne(r.functionArgs[0])) !== Rn(Ne(To(t.core))) || Rn(Ne(r.functionArgs[1])) !== Rn(Ne(To(t.song))) || Rn(Ne(r.functionArgs[2])) !== Rn(Ne(p5(Tu(t.id)))) || t.amount !== "50" || e.postConditionMode !== Ji.Deny || e.postConditions.values.length !== 1 || i.conditionType !== 0 || i.amount !== 50n || i.conditionCode !== Oo.Equal || i.principal.prefix !== 2 || Pi(i.principal.address) !== t.address) throw Error("Saved play protection or master does not match.");
  } else if (t.kind === "like") {
    if (r.payloadType !== 2 || Pi(r.contractAddress) + "." + r.contractName.content !== q5 || r.functionName.content !== "set-liked" || r.functionArgs.length !== 2 || Rn(Ne(r.functionArgs[0])) !== Rn(Ne(To(t.song))) || typeof t.liked != "boolean" || Rn(Ne(r.functionArgs[1])) !== Rn(Ne(h5(t.liked))) || t.amount !== "0" || e.postConditionMode !== Ji.Deny || e.postConditions.values.length !== 0) throw Error("Saved like does not match.");
  } else if (r.payloadType !== 0 || wr(r.recipient).value !== t.recipient || r.amount !== BigInt(t.amount)) throw Error("Saved withdrawal does not match.");
}
const n6 = "xtrata.xyz/radio/listening-wallet", r6 = "Link a temporary listening wallet for pay-per-play; no spending permission", Dr = (t) => typeof t == "string" && /^SP[0-9A-HJKMNP-TV-Z]{20,41}$/.test(t) && Oi(t), s6 = (t) => ({
  domain: li({ name: Qe(n6), version: Qe("1"), "chain-id": Sr(1) }),
  message: li({
    purpose: Qe(r6),
    main: Qe(t.main),
    listening: Qe(t.listening),
    issued: Sr(t.issued)
  })
}), ow = 100000n, i6 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function o6(t, e) {
  const n = t.filter((s) => !s || typeof s.sender != "string" || s.sender === e || !Dr(s.sender) || !/^\d+$/.test(s.amount) ? !1 : BigInt(s.amount) >= ow).sort(i6);
  if (!n.length) return { ok: !0, funder: null, distinct: 0 };
  const r = n[0];
  return { ok: !0, funder: r.sender, txId: r.txId, amount: r.amount, distinct: new Set(n.map((s) => s.sender)).size };
}
const La = 50;
function pc(t) {
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
async function a6(t, e, n = 4) {
  if (!Dr(t)) return { ok: !1 };
  try {
    const r = (o) => `/extended/v1/address/${t}/stx_inbound?limit=${La}&offset=${o}`, s = pc(await e(r(0)));
    if (!s || s.total > 0 && !s.transfers.length) return { ok: !1 };
    if (s.total === 0) return { ok: !0, funder: null, distinct: 0 };
    let i = Math.max(0, s.total - La);
    for (let o = 0; o < n; o++) {
      const a = i === 0 && s.total <= La ? s : pc(await e(r(i)));
      if (!a || !a.transfers.length) return { ok: !1 };
      const c = o6(a.transfers, t);
      if (c.ok && c.funder) return i > 0 ? { ...c, distinct: Math.max(c.distinct, 2) } : c;
      if (i === 0) return c;
      i = Math.max(0, i - La);
    }
    return { ok: !1 };
  } catch {
    return { ok: !1 };
  }
}
const Nr = 50, c6 = 6, l6 = 20, f0 = (t, e) => t.blockHeight - e.blockHeight || t.txIndex - e.txIndex;
function d0(t, e) {
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
async function u6(t, e, n) {
  if (!Dr(t)) return { ok: !1 };
  try {
    const r = /* @__PURE__ */ new Map(), s = pc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Nr}&offset=0`));
    if (!s || s.total > c6 * Nr) return { ok: !1 };
    for (const o of s.transfers) r.set(o.txId + ":" + o.txIndex, o);
    for (let o = Nr; o < s.total; o += Nr) {
      const a = pc(await e(`/extended/v1/address/${t}/stx_inbound?limit=${Nr}&offset=${o}`));
      if (!a || !a.transfers.length) return { ok: !1 };
      for (const c of a.transfers) r.set(c.txId + ":" + c.txIndex, c);
    }
    if (r.size !== s.total) return { ok: !1 };
    const i = /* @__PURE__ */ new Map();
    if (n) {
      const o = (u) => `/extended/v1/address/${t}/transactions?limit=${Nr}&offset=${u}`, a = d0(await e(o(0)), t);
      if (!a || a.total > l6 * Nr) return { ok: !1 };
      const c = new Set(a.rows);
      for (const u of a.sent) i.set(u.txId, u);
      for (let u = Nr; u < a.total; u += Nr) {
        const f = d0(await e(o(u)), t);
        if (!f || !f.rows.length) return { ok: !1 };
        for (const l of f.rows) c.add(l);
        for (const l of f.sent) i.set(l.txId, l);
      }
      if (c.size !== a.total) return { ok: !1 };
    }
    return { ok: !0, inbound: [...r.values()], outgoing: [...i.values()] };
  } catch {
    return { ok: !1 };
  }
}
function f6(t) {
  const { self: e, balance: n, gift: r } = t;
  if (typeof n != "bigint" || n < 0n) return { ok: !1, reason: "balance" };
  const s = [...t.inbound].filter((l) => l && typeof l.sender == "string" && l.sender !== e && /^\d+$/.test(l.amount) && BigInt(l.amount) > 0n).sort(f0).map((l, w) => {
    const p = BigInt(l.amount);
    return r && l.sender === r.sender ? { sender: l.sender, left: p, kind: "gift", to: r.payer, at: w } : Dr(l.sender) && p >= ow ? { sender: l.sender, left: p, kind: "deposit", to: l.sender, at: w } : { sender: l.sender, left: p, kind: "dust", to: null, at: w };
  }), i = s.reduce((l, w) => l + w.left, 0n), o = [...t.outgoing].filter((l) => l && l.recipient !== e && Dr(l.recipient) && l.amount > 0n).sort(f0), a = o.reduce((l, w) => l + w.amount, 0n), c = i - n - a;
  if (c < 0n) return { ok: !1, reason: "balance is higher than the deposits and returns account for" };
  const u = (l, w) => {
    let p = w;
    for (const m of l) {
      if (p <= 0n) break;
      const S = m.left < p ? m.left : p;
      m.left -= S, p -= S;
    }
    return p;
  };
  for (const l of o) {
    const w = u(s.filter((p) => p.to === l.recipient), l.amount);
    w > 0n && u(s, w);
  }
  if (u(s, c) > 0n) return { ok: !1, reason: "more has left the wallet than was deposited" };
  if (s.reduce((l, w) => l + w.left, 0n) !== n) return { ok: !1, reason: "the ledger does not add up to the balance" };
  const f = /* @__PURE__ */ new Map();
  for (const l of s) {
    if (l.left <= 0n) continue;
    const w = `${l.kind}:${l.to ?? ""}`, p = f.get(w);
    p ? (p.amount += l.left, p.newest = Math.max(p.newest, l.at)) : f.set(w, { to: l.to, kind: l.kind, amount: l.left, newest: l.at });
  }
  return {
    ok: !0,
    parts: [...f.values()].sort((l, w) => l.newest - w.newest),
    hasTopUp: s.some((l) => l.kind === "deposit")
  };
}
function d6(t, e) {
  const n = t.filter((u) => u.kind === "deposit").sort((u, f) => u.newest - f.newest), r = t.find((u) => u.kind === "gift"), s = t.filter((u) => u.kind === "dust"), i = ((r == null ? void 0 : r.amount) ?? 0n) + s.reduce((u, f) => u + f.amount, 0n), o = [], a = [], c = i > e;
  return n.forEach((u, f) => {
    if (u.amount <= e) {
      a.push(u);
      return;
    }
    const l = f === n.length - 1 && !c;
    o.push({ to: u.to, kind: "deposit", mode: l ? "all" : "amount", send: u.amount - e });
  }), c ? o.push({ to: (r == null ? void 0 : r.to) ?? null, kind: r ? "gift" : "rest", mode: "all", send: i - e }) : (r && a.push(r), a.push(...s)), { steps: o, tooSmall: a };
}
function h0(t) {
  const e = t.filter((n) => n.kind === "deposit" && n.to).sort((n, r) => r.newest - n.newest)[0];
  return (e == null ? void 0 : e.to) ?? null;
}
const ja = [100, 250, 500], h6 = (t, e) => BigInt(t) * Pn(e), xo = ["prepared", "signed", "unknown", "pending"], p6 = 30 * 6e4, gc = 6e4, $i = (t) => {
  const e = t;
  return (e == null ? void 0 : e.feeRejected) === !0 || /\(400\)/.test((e == null ? void 0 : e.message) ?? "");
}, g6 = 3e3, yc = "Your album keeps playing. Likes need a little STX in your main listener wallet, which is empty right now: top it up and your likes carry on.", El = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (t) => t.toString(16).padStart(2, "0")).join("");
function y6(t) {
  let e = null, n = -1 / 0, r, s = null, i = null, o, a = -1 / 0, c = null, u = null, f = !1, l = !1, w = !1, p = null, m = !1, S = "", M = "", R = 0, z, E = null, _, N = [], J, et = -1 / 0;
  const G = /* @__PURE__ */ new Set();
  let V = null, $ = !1, P = 0, b = null, C = null, O = !1, T = null, it = !1, W = null, Et = !1, k = !1, U = !1, ot = !1, I = !1, X = 0, wt = null, oe = Promise.resolve();
  const At = () => BigInt((e == null ? void 0 : e.limits.playFee) ?? Si.toString()), jt = (y) => !!i && !(i.features ?? []).includes(y), Ot = (y, L) => `xtrata.ppp.v1.${y}:${L}`, Zt = "xtrata.ppp.v1.as-main", Ft = () => {
    if (t.main()) return;
    const y = t.store.get(Zt);
    return y && Dr(y) ? y : void 0;
  }, Kt = () => t.main() ?? Ft(), vt = (y = i == null ? void 0 : i.address) => {
    if (!y) return [];
    try {
      const L = JSON.parse(t.store.get(Ot("entries", y)) || "[]");
      return Array.isArray(L) ? L : [];
    } catch {
      return [];
    }
  }, se = (y) => {
    const L = [y, ...vt(y.address).filter((q) => !(q.txid === y.txid && q.kind === y.kind))].slice(0, 200);
    t.store.set(Ot("entries", y.address), JSON.stringify(L));
  }, qe = (y = i == null ? void 0 : i.address) => !!y && t.store.get(Ot("on", y)) !== "0", Re = (y) => {
    i != null && i.address && t.store.set(Ot("on", i.address), y ? "1" : "0");
  }, Ue = () => vt().filter((y) => xo.includes(y.status)), We = () => A() ? [...Ue(), ...vt(we()).filter((y) => xo.includes(y.status))] : Ue(), Se = () => Be(i == null ? void 0 : i.address), Be = (y) => {
    if (!y) return null;
    try {
      return JSON.parse(t.store.get(Ot("deposit", y)) || "null");
    } catch {
      return null;
    }
  }, ye = (y, L = i == null ? void 0 : i.address) => {
    L && t.store.set(Ot("deposit", L), JSON.stringify(y));
  };
  let ae = null;
  const sr = (y = gc) => {
    const L = t.now();
    ae = { since: ae && L < ae.until ? ae.since : L, until: Math.max((ae == null ? void 0 : ae.until) ?? 0, L + y) };
  }, He = () => !!ae && t.now() < ae.until && (o === void 0 || o < ze + Pn(At())), ue = () => !!Se() || He(), we = () => jt("rootLike") ? i == null ? void 0 : i.address : (i == null ? void 0 : i.root) ?? (i == null ? void 0 : i.address), A = () => !!(i != null && i.address) && we() !== i.address, D = () => A() ? c && c.for === we() ? c.value : void 0 : o, F = (y) => y !== void 0 && y < ze + ml, K = () => Ue().filter((y) => t.now() - y.created > p6 && G.has(y.txid)), dt = () => (e == null ? void 0 : e.passkeyOnly) === !0 && (!Kt() || r === Kt() && !e.allowed), lt = () => dt() && !(i != null && i.linked), ee = () => {
    const y = Kt();
    return !lt() && !!y && !!(i != null && i.linked) && i.linked !== y;
  }, Ct = (y) => Ot("return-to", y), Qt = (y = i == null ? void 0 : i.address) => {
    if (!y) return;
    const L = t.store.get(Ct(y));
    return L && Dr(L) && L !== y ? L : void 0;
  }, be = (y = i == null ? void 0 : i.address) => V && V.for === y ? V.res : null;
  function Ee() {
    if (!(i != null && i.address)) return;
    if (i.linked) return { to: i.linked, kind: "linked" };
    const y = Qt();
    if (y) return { to: y, kind: "chosen" };
    const L = be();
    if (L != null && L.ok && L.funder) return { to: L.funder, kind: "funder" };
  }
  const Oe = (y) => Ot("gift", y);
  function kt() {
    const y = i == null ? void 0 : i.address;
    if (!y) return null;
    if ((T == null ? void 0 : T.for) === y) return T.info;
    try {
      const L = JSON.parse(t.store.get(Oe(y)) || "null");
      return L && typeof L.returnTo == "string" && typeof L.treasury == "string" ? L : null;
    } catch {
      return null;
    }
  }
  async function St() {
    var mt;
    const y = i == null ? void 0 : i.address;
    if (!y || !t.giftInfo || !((mt = e == null ? void 0 : e.gifts) != null && mt.enabled) || it) return;
    const L = (T == null ? void 0 : T.for) === y ? T : null, q = L ? L.ok ? L.info ? 30 * 6e4 : 10 * 6e4 : 6e4 : 0;
    if (L && t.now() - L.at < q) return;
    it = !0;
    const nt = kt();
    try {
      const j = await t.giftInfo(y);
      T = { for: y, info: j, ok: !0, at: t.now() }, t.store.set(Oe(y), JSON.stringify(j));
    } catch {
      T = { for: y, info: nt, ok: !1, at: t.now() };
    } finally {
      it = !1;
    }
  }
  const Xt = () => vt().reduce((y, L) => xo.includes(L.status) ? y + BigInt(L.amount || "0") + BigInt(L.fee || "0") : y, 0n);
  function Jt() {
    if (o === void 0) return 0;
    const y = o - Xt() - BigInt(ve.length) * Pn(At());
    return y > 0n ? u0(y, At()) : 0;
  }
  const fe = "OUT OF PLAYS — ADD MORE TO KEEP LISTENING", ce = "EMPTY — ADD STX TO PLAY";
  function kn() {
    if (!(e != null && e.here)) return null;
    const y = (L, q) => ({ reason: L, text: q });
    switch (Ln()) {
      case "connect":
      case "wrong-wallet":
        return y("connect", "CONNECT YOUR WALLET TO LISTEN");
      case "intro":
        return y("setup", "SET UP YOUR PLAYER TO LISTEN");
      case "loading":
        return y("checking", "CHECKING YOUR LISTENING WALLET");
      case "unsupported":
        return y("unavailable", "OPEN IN A BROWSER THAT SUPPORTS PASSKEYS");
      case "not-invited":
      case "off":
        return y("unavailable", "PAID RADIO IS UNAVAILABLE");
      case "locked":
        return y("locked", "UNLOCK TO LISTEN");
      case "link":
        return y("link", "FINISH SETUP TO LISTEN");
      case "over":
        return y("over", "OVER 1 STX — RETURN THE EXCESS");
      case "fund":
        return ue() ? y("arriving", "YOUR PLAYS ARE ARRIVING") : y("out", A() ? fe : ce);
      case "ready":
        return !qe() || !(i != null && i.session) || i.session.playsLeft < 1 || i.session.expires <= t.now() ? y("off", "SWITCH ON MUSIC SUPPORT TO LISTEN") : U ? Jt() < 1 ? y("out", A() ? fe : ce) : null : y("tab", "PLAYING IN ANOTHER TAB");
      default:
        return null;
    }
  }
  const $n = () => {
    var y;
    return !!(i != null && i.address) && A() && !!((y = kt()) != null && y.player);
  };
  function Ls() {
    return $n() ? { locked: !0, known: !0 } : null;
  }
  const Cs = 3 * 6e4, Ts = () => !!kt() && !!t.history && !(i != null && i.linked);
  async function Bs() {
    const y = i.address, L = kt(), { balance: q, nonce: nt } = await t.chain.account(y), mt = await t.history(y, !0);
    if (!mt.ok) return null;
    const j = f6({ self: y, balance: q, inbound: mt.inbound, outgoing: mt.outgoing, gift: { sender: L.treasury, payer: L.returnTo } });
    if (!j.ok) return null;
    const pt = d6(j.parts, mo);
    return { balance: q, nonce: nt, parts: j.parts, steps: pt.steps, tooSmall: pt.tooSmall.length };
  }
  const In = () => Et ? { state: "unavailable" } : !W || t.now() - W.at > Cs || o !== void 0 && o !== W.balance ? { state: "none" } : W.plan;
  function Ln() {
    if (!(e != null && e.enabled)) return "off";
    if (!e.here) return "elsewhere";
    const y = Kt();
    if (!lt()) {
      if (!y) return "connect";
      if (!e.allowed) return "not-invited";
    }
    return i ? i.state === "unsupported" ? "unsupported" : i.state === "none" ? "intro" : ee() ? "wrong-wallet" : i.state === "known" ? "locked" : !lt() && i.linked !== y ? "link" : o === void 0 ? "loading" : o > Gs ? "over" : o < ze + Pn(At()) ? "fund" : "ready" : "loading";
  }
  const tn = () => {
    var y, L, q, nt, mt;
    return {
      step: Ln(),
      busy: u,
      message: S,
      error: M,
      notice: fo(),
      gate: e,
      main: Kt(),
      mainConnected: !!t.main(),
      standIn: Ft(),
      listening: i == null ? void 0 : i.address,
      linked: i == null ? void 0 : i.linked,
      balance: o,
      balanceState: o === void 0 ? void 0 : z5(o, At()),
      playsLeft: o === void 0 ? 0 : u0(o, At()),
      allowance: o === void 0 ? Gs : xl(o, BigInt(((y = Se()) == null ? void 0 : y.amount) ?? "0")),
      session: (i == null ? void 0 : i.session) ?? null,
      payingOn: qe(),
      entries: vt(),
      depositTxid: ((L = Se()) == null ? void 0 : L.txid) ?? z,
      depositPending: ue(),
      arrival: ue() ? { since: ((q = Se()) == null ? void 0 : q.at) ?? (ae == null ? void 0 : ae.since) ?? t.now(), graceMs: gc } : null,
      walletOutdated: jt("like"),
      linkedListening: J && J === Kt() ? N.map((j) => j.listening) : [],
      serverLinked: !!E && _ === `${Kt()}:${i == null ? void 0 : i.address}`,
      stuck: K().length,
      armed: ot,
      queued: ve.length,
      solo: lt(),
      returnTo: (nt = Ee()) == null ? void 0 : nt.to,
      returnToKind: (mt = Ee()) == null ? void 0 : mt.kind,
      funderState: (() => {
        const j = be();
        return j ? j.ok ? j.funder ? "found" : "none" : "failed" : "unknown";
      })(),
      funderMultiple: (() => {
        const j = be();
        return !!j && j.ok && j.distinct > 1;
      })(),
      walletCannotSolo: lt() && jt("standalone"),
      walletCannotMulti: jt("multi"),
      others: ((i == null ? void 0 : i.others) ?? []).filter((j) => j !== Kt() && j !== (i == null ? void 0 : i.linked)),
      creditedTo: lt() && (i != null && i.address) && (b == null ? void 0 : b.for) === i.address && b.main ? b.main : void 0,
      createdHere: !!(i != null && i.address) && t.store.get(Ot("created", i.address)) === "1",
      brandNew: !!(i != null && i.address) && o === 0n && (C == null ? void 0 : C.for) === i.address && C.unused,
      gift: (() => {
        const j = kt();
        return j ? { player: j.player, from: j.from, source: j.source, amount: j.amount } : null;
      })(),
      giftPlays: kt() ? Jt() : 0,
      playCost: Pn(At()),
      giftStop: kn(),
      albumLock: Ls(),
      returnPlan: In(),
      slot: (i == null ? void 0 : i.state) === "unlocked" ? i.slot ?? 0 : 0,
      root: (i == null ? void 0 : i.state) === "unlocked" ? i.root ?? i.address : void 0,
      walletCannotAlbums: jt("slots"),
      likeFunds: (() => {
        var gt;
        const j = we();
        if (!j || (i == null ? void 0 : i.state) !== "unlocked") return null;
        const pt = D();
        return { address: j, balance: pt, low: F(pt), album: A(), pending: !!Be(j), txid: (gt = Be(j)) == null ? void 0 : gt.txid, main: Kt() };
      })()
    };
  }, fo = () => R ? R < 3 ? "Checking the network…" : "The network is slow to answer. Still trying: nothing is lost." : "", Vt = (y, L = "") => {
    S = y, M = L, t.changed();
  };
  async function Xe(y, L) {
    if (!u) {
      u = y, M = "", t.changed();
      try {
        await L();
      } catch (q) {
        const nt = q instanceof Error ? q.message : String(q);
        M = /Cancelled in the listening wallet/.test(nt) ? "" : nt, M || (S = "Not now. Nothing was signed.", I = !0);
      } finally {
        u = null, await It(!0);
      }
    }
  }
  const cn = () => !!(e != null && e.enabled) && e.here && (lt() || !!Kt() && e.allowed), Ms = () => cn() && !ee(), d = () => "This device's listening wallet belongs to another wallet. Connect that wallet to pay artists or like songs.", x = () => {
    if (ee()) throw new Error(d());
  };
  async function v() {
    if (!cn()) throw new Error("Pay-per-play is not open to this wallet yet.");
    if (!(e != null && e.walletOrigin)) throw new Error("Pay-per-play is switched off right now.");
    return s ?? (s = await t.bridge(e.walletOrigin)), s;
  }
  const h = (y) => {
    const L = Kt();
    return y.request("listening.status", L ? { main: L } : void 0);
  };
  async function tt(y = !1) {
    i != null && i.address && (!y && t.now() - a < 3e4 || (o = await t.chain.balance(i.address), a = t.now(), await ut(y)));
  }
  async function ut(y = !1) {
    const L = we();
    if (!(!A() || !L || (i == null ? void 0 : i.state) !== "unlocked") && !(!y && (c == null ? void 0 : c.for) === L && t.now() - c.at < 3e4))
      try {
        c = { for: L, value: await t.chain.balance(L), at: t.now() };
      } catch {
      }
  }
  async function $t(y) {
    if ((J !== y || t.now() - et >= 6e4) && (N = await t.links(y), J = y, et = t.now()), (i == null ? void 0 : i.state) !== "unlocked" || i.linked === y) return;
    const L = `${y}:${i.address}`;
    _ === L && E || (E = N.find((q) => q.listening === i.address) ?? null, _ = L);
  }
  async function de() {
    const y = i == null ? void 0 : i.address;
    if (!lt() || !y || i != null && i.linked || !t.funder || $ || !o || o <= 0n) return;
    const L = be(y);
    if (L != null && L.ok && L.funder) return;
    const q = L != null && L.ok ? 3e4 : Math.min(6e4 * 2 ** Math.max(0, P - 1), 30 * 6e4);
    if (!(V && V.for === y && t.now() - V.at < q)) {
      $ = !0;
      try {
        V = { for: y, res: await t.funder(y), at: t.now() };
      } catch {
        V = { for: y, res: { ok: !1 }, at: t.now() };
      } finally {
        $ = !1;
      }
      P = V.res.ok ? 0 : P + 1;
    }
  }
  async function Ae() {
    const y = i == null ? void 0 : i.address;
    if (!(!lt() || !y || i != null && i.linked || !t.mainOf || O) && !(b && b.for === y && (b.ok || t.now() - b.at < 6e4))) {
      O = !0;
      try {
        b = { for: y, main: await t.mainOf(y), ok: !0, at: t.now() };
      } catch {
        b = { for: y, main: null, ok: !1, at: t.now() };
      } finally {
        O = !1;
      }
    }
  }
  async function yn() {
    const y = i == null ? void 0 : i.address;
    if (!(!y || (i == null ? void 0 : i.state) !== "unlocked" || o !== 0n || (C == null ? void 0 : C.for) === y) && t.store.get(Ot("created", y)) !== "1")
      try {
        C = { for: y, unused: await t.chain.confirmedNonce(y) === 0n };
      } catch {
      }
  }
  async function Fe() {
    var mt;
    const y = i == null ? void 0 : i.address;
    if (!y) return !1;
    let L, q = !1;
    const nt = /* @__PURE__ */ new Map();
    for (const j of We())
      try {
        const pt = await t.chain.transaction(j.txid);
        if (!pt) {
          if (G.add(j.txid), t.now() - j.created > 15 * 6e4 && !nt.has(j.address) && nt.set(j.address, await t.chain.confirmedNonce(j.address)), L = nt.get(j.address), L !== void 0 && L > BigInt(j.nonce)) {
            se({ ...j, status: "failed", note: "nonce used by another transaction", raw: void 0 });
            continue;
          }
          if ((j.status === "unknown" || j.status === "signed") && j.raw)
            try {
              await t.chain.broadcast(j.raw, j.txid), se({ ...j, status: "pending" });
            } catch (yt) {
              $i(yt) && se({ ...j, status: "failed", note: yt.message, raw: void 0 });
            }
          continue;
        }
        G.delete(j.txid);
        const gt = String(pt.tx_status);
        if (gt === "success" && pt.canonical !== !1 && pt.is_unanchored === !1) {
          if (se({ ...j, status: "confirmed", confirmedAt: t.now(), actualFee: String(pt.fee_rate ?? j.fee), raw: void 0 }), q = !0, j.kind === "like" && (m = !0, j.status !== "confirmed" && typeof j.liked == "boolean"))
            try {
              (mt = t.likeConfirmed) == null || mt.call(t, j.song, j.liked);
            } catch {
            }
        } else gt.startsWith("abort_") || gt.startsWith("dropped_") ? se({ ...j, status: "failed", note: gt, raw: void 0 }) : j.status !== "pending" && se({ ...j, status: "pending" });
      } catch {
      }
    for (const j of A() ? [y, we()] : [y]) {
      const pt = Be(j);
      if (pt)
        try {
          const gt = await t.chain.transaction(pt.txid), yt = String((gt == null ? void 0 : gt.tx_status) ?? "");
          (yt === "success" && gt.is_unanchored === !1 || yt.startsWith("abort_") || yt.startsWith("dropped_") || !gt && t.now() - pt.at > 2 * 36e5) && (ye(null, j), yt === "success" && sr(2e4), a = -1 / 0, c = null, /on its way/i.test(S) && (S = ""));
        } catch {
        }
    }
    return q;
  }
  async function It(y = !1) {
    var L;
    try {
      const q = Kt();
      if ((y || !e || r !== q || t.now() - n > 3e5) && (e = await t.config(q), n = t.now(), r = q), !e.enabled || !e.here || !lt() && (!q || !e.allowed)) {
        s && (i != null && i.session) && await s.request("listening.stop").catch(() => {
        }), ot && bn(), t.changed();
        return;
      }
      await v(), i = await h(s), ee() && i.state === "unlocked" && (cr(), await s.request("listening.lock").catch(() => {
      }), o = void 0, i = await h(s)), q && e.allowed && await $t(q), await tt(y), await de(), await Ae(), await yn(), await St(), await Fe() && await tt(!0), await ut(), await Cn(), R = 0;
    } catch {
      R++;
    }
    if (Ln() === "locked" ? ir() : ot && bn(), m) {
      m = !1;
      try {
        (L = t.likesChanged) == null || L.call(t);
      } catch {
      }
    }
    t.changed(), ve.length && !Cr && Wn();
  }
  async function Ge(y) {
    const L = i == null ? void 0 : i.root;
    if (!L || i != null && i.slot || !(i != null && i.address) || jt("slots")) return;
    const q = Number(t.store.get(Ot("slot", L)));
    if (!(!Number.isSafeInteger(q) || q < 1))
      try {
        const { balance: nt } = await t.chain.account(i.address);
        if (nt >= ze + Pn(At())) return;
        await y.request("listening.openSlot", { slot: q }), i = await h(y), o = void 0, a = -1 / 0;
      } catch {
      }
  }
  async function wn(y, L) {
    var j;
    x();
    const q = !(i != null && i.address) || qe(i.address), nt = i != null && i.linked ? (j = t.nameOf) == null ? void 0 : j.call(t, i.linked) : void 0;
    await y.request("listening.unlock", { mode: "unlock", terms: q ? Ye() : void 0, anyPasskey: L, ...Kt() ? { main: Kt() } : {}, ...nt ? { label: nt } : {} }), i = await h(y), q && (qe(i.address) ? await mn() : await y.request("listening.stop")), await Ge(y), Vt(q ? "Unlocked ✓" : "Unlocked ✓ Paying is off.");
    const mt = p;
    p = null, mt && t.now() - mt.at < 12e4 && setTimeout(() => void It(!0).then(() => Xn(mt)), 0);
  }
  function ir() {
    ot || u || I || X >= 3 || !s || !(i != null && i.address) || (ot = !0, oe = (async () => {
      try {
        await wn(s, !1), X = 0;
      } catch (y) {
        const L = y instanceof Error ? y.message : String(y);
        /Cancelled in the listening wallet/.test(L) ? wt || (I = !0, Vt("Not now. Nothing was signed.")) : /did not answer/.test(L) ? await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
        })) : (X++, M = L);
      } finally {
        ot = !1;
        const y = wt;
        wt = null, y ? await y() : await It(!0);
      }
    })());
  }
  async function bn(y) {
    ot && (wt = async () => {
    }, await (s == null ? void 0 : s.request("listening.cancel").catch(() => {
    })), await oe), y && await y(), t.changed();
  }
  const Ye = () => ({
    fee: At().toString(),
    maxPlays: e.limits.maxSessionPlays,
    budget: Gs.toString(),
    expires: t.now() + e.limits.sessionHours * 36e5
  });
  async function mn() {
    if (!(i != null && i.address)) return !1;
    if (U || (U = await t.tabLock(i.address)), !U)
      throw await (s == null ? void 0 : s.request("listening.stop").catch(() => {
      })), new Error("Pay-per-play is already running in another tab. Listen from that tab.");
    return !0;
  }
  async function Dn(y, L) {
    const q = i.address, { balance: nt, nonce: mt } = L ?? await t.chain.account(q);
    o = nt;
    const j = await s.request("listening.prepareReturn", {
      mode: y.mode,
      balance: nt.toString(),
      nonce: mt.toString(),
      fee: mo.toString(),
      ...y.amount !== void 0 ? { amount: y.amount.toString() } : {},
      ...y.linked ? {} : { destination: y.to }
    });
    if (j.recipient !== y.to) throw new Error("Return destination does not match what you approved. Nothing was sent.");
    const pt = y.mode === "amount" ? y.amount : y.mode === "all" ? nt - mo : nt - Gs - mo, gt = fc(j.raw);
    if (wr(gt.payload.recipient).value !== y.to || String(gt.payload.amount) !== j.amount || pt !== void 0 && j.amount !== pt.toString())
      throw new Error("Signed return does not match what you approved. Nothing was sent.");
    const yt = {
      id: El(),
      address: q,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: j.recipient,
      amount: j.amount,
      fee: j.fee,
      nonce: mt.toString(),
      created: t.now(),
      status: "signed",
      raw: j.raw,
      txid: j.txid
    };
    t.validate(yt), se(yt);
    try {
      await t.chain.broadcast(j.raw, j.txid), se({ ...yt, status: "pending" });
    } catch (_t) {
      throw se({ ...yt, status: "unknown", note: _t.message }), _t;
    }
    return j;
  }
  const en = qc, or = mo;
  async function ar(y, L, q) {
    if ((i == null ? void 0 : i.state) !== "unlocked" || !i.address) throw new Error("Unlock the listening wallet first.");
    if (jt("slots") || jt("move")) throw new Error("The listening wallet box needs an update before it can move funds. Try again shortly.");
    const nt = i.slot ?? 0;
    if (y === L || ![y, L].includes(nt) || ![y, L].includes(0)) throw new Error("Funds move between My player and the open album only.");
    const mt = i.root ?? i.address, j = y === 0 ? mt : i.address, pt = L === 0 ? mt : i.address, { balance: gt, nonce: yt } = await t.chain.account(j);
    if (gt < q + or + ze) throw new Error(y === 0 ? "My player does not hold enough for that. Add STX to it first." : "This album does not hold enough to move.");
    const _t = await s.request("listening.signMove", { from: y, to: L, amount: q.toString(), fee: or.toString(), nonce: yt.toString(), balance: gt.toString() }), De = fc(_t.raw);
    if (_t.from !== j || _t.to !== pt || _t.amount !== q.toString() || wr(De.payload.recipient).value !== pt || String(De.payload.amount) !== q.toString())
      throw new Error("Signed move does not match what was asked. Nothing was sent.");
    const nn = {
      id: El(),
      address: j,
      kind: "withdraw",
      core: 0,
      song: 0,
      recipient: pt,
      amount: _t.amount,
      fee: _t.fee,
      nonce: yt.toString(),
      created: t.now(),
      status: "signed",
      raw: _t.raw,
      txid: _t.txid
    };
    t.validate(nn), se(nn);
    try {
      await t.chain.broadcast(_t.raw, _t.txid), se({ ...nn, status: "pending" });
    } catch (Ke) {
      throw se({ ...nn, status: "unknown", note: Ke.message }), Ke;
    }
    return ye({ txid: _t.txid, amount: _t.amount, at: t.now() }, pt), pt === mt && mt !== i.address ? c = null : a = -1 / 0, _t;
  }
  let bt = !1;
  const qt = /* @__PURE__ */ new Map(), le = (y) => Ot("float", y);
  async function Cn() {
    if (bt || (i == null ? void 0 : i.state) !== "unlocked" || !A() || jt("move") || jt("rootLike") || !i.address) return;
    const y = i.address;
    if (t.store.get(le(y)) === "1") return;
    const L = kt();
    if (!(L != null && L.player) || L.state !== "arrived") return;
    const q = D();
    if (q === void 0 || o === void 0) return;
    if (!F(q)) {
      t.store.set(le(y), "1");
      return;
    }
    if (Be(we()) || Kr() || We().length || o < en * 4n + ze + or) return;
    const nt = qt.get(y);
    if (!(nt && (nt.n >= 3 || t.now() - nt.at < 5 * 6e4))) {
      bt = !0, qt.set(y, { n: ((nt == null ? void 0 : nt.n) ?? 0) + 1, at: t.now() });
      try {
        await ar(i.slot ?? 0, 0, en), t.store.set(le(y), "1");
      } catch (mt) {
        console.warn("[radio] likes float not sent yet", mt);
      } finally {
        bt = !1;
      }
    }
  }
  async function Ei(y) {
    if (Ue().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
    if (jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
    const L = await Bs().catch(() => null);
    if (!L)
      throw W = null, Et = !0, new Error("Could not check where the funds came from right now. Nothing was sent. Try again shortly.");
    Et = !1, o = L.balance;
    const q = { balance: L.balance, nonce: L.nonce };
    if (y === "excess") {
      const gt = h0(L.parts) ?? Qt();
      if (!gt) throw new Error("Choose where to send the excess first.");
      await Dn({ mode: "excess", to: gt, linked: !1 }, q), W = null, Vt("Excess returned ✓ Switch paying back on to continue.");
      return;
    }
    const nt = L.steps;
    if (!nt.length) throw new Error("What is left is too small to return: the network fee would take all of it.");
    if (!(!!W && W.balance === L.balance && t.now() - W.at <= Cs && W.steps.length === nt.length && W.steps.every((gt, yt) => gt.to === nt[yt].to && gt.mode === nt[yt].mode && gt.send === nt[yt].send))) {
      W = {
        at: t.now(),
        balance: L.balance,
        steps: nt,
        parts: L.parts,
        plan: { state: "ready", steps: nt.map((gt) => ({ to: gt.to, kind: gt.kind, send: gt.send.toString() })), kept: L.tooSmall, excess: h0(L.parts) }
      }, Vt(nt.length > 1 ? `This goes back in ${nt.length} parts, each to whoever it came from. Check below, then confirm.` : "Check where it goes, then confirm.");
      return;
    }
    const j = nt[0], pt = j.to ?? Qt();
    if (!pt) throw new Error("Choose where to send the rest first.");
    if (j.mode === "amount" && jt("partial")) throw new Error("The listening wallet box needs an update before it can return in parts. Try again shortly.");
    await Dn({ mode: j.mode, to: pt, linked: !1, ...j.mode === "amount" ? { amount: j.send } : {} }, q), W = null, nt.length === 1 ? (Re(!1), Vt("Returned ✓ Paying is off.")) : Vt(`Returned ✓ ${nt.length - 1} more ${nt.length === 2 ? "part" : "parts"} to go. Return again once this one confirms.`);
  }
  const Ir = {
    forceRefresh: () => It(!0),
    /**
     * Use this device's listening wallet for `main` without connecting that Stacks wallet (the connect pop-up's
     * "Xtrata Music Wallet · jim.btc"). `null` goes back to asking for a Stacks wallet. Ignored while one is connected.
     */
    useLinked: async (y) => {
      if (!t.main() && !(y !== null && !Dr(y))) {
        if (y === Ft()) return It(!0);
        t.store.set(Zt, y ?? ""), M = "", S = "", o = void 0, a = -1 / 0, c = null, await It(!0);
      }
    },
    create: () => Xe("Waiting for your passkey…", async () => {
      const y = await v();
      await y.request("listening.unlock", { mode: "create", terms: Ye(), ...t.main() ? { main: t.main() } : {} }), i = await h(y), i.address && t.store.set(Ot("created", i.address), "1"), Re(!0), Vt(lt() ? "Wallet created ✓ Next: add 1 STX." : "Wallet created ✓ Next: link it."), await mn();
    }),
    /**
     * A gift funded this wallet (the server sent it from the gift treasury): tracked exactly like a
     * deposit, so the panel says it is on its way and paying starts by itself once it confirms.
     */
    /** A gift claim started (true) or stopped for good (false): the plays are expected, so nothing reads as empty meanwhile. */
    giftClaiming: (y) => {
      y ? sr() : ae = null, t.changed();
    },
    giftSent: (y, L) => {
      !(i != null && i.address) || Se() || (ye({ txid: y, amount: L.toString(), at: t.now() }), a = -1 / 0, T = null, Vt("🎁 Gift on its way ✓ Usually arrives in a few minutes."));
    },
    /**
     * Albums live in numbered wallets of the open passkey. `bindAlbum` proves a number belongs to the passkey (both
     * signatures, no popup) so the server can credit its plays to this listener; the gift claim carries the proof.
     */
    bindAlbum: async (y) => {
      if (x(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (jt("slots")) throw new Error("The listening wallet box needs an update before it can hold albums. Try again shortly.");
      return (await v()).request("listening.bindSlot", { slot: y, issued: t.now() });
    },
    /** An album's gift was sent to its wallet (the server sent it from the gift treasury): track it, and open the album. */
    albumArriving: async (y, L, q, nt) => {
      ye({ txid: q, amount: nt.toString(), at: t.now() }, L), T = null, await Ir.openAlbum(y), Vt("🎁 Album on its way ✓ Usually arrives in a few minutes.");
    },
    /** Make a numbered wallet the open one (0 = the listener's own). Plays, funds and the heart's album follow it. */
    openAlbum: (y) => Xe("Opening…", async () => {
      if (x(), (i == null ? void 0 : i.state) !== "unlocked") throw new Error("Unlock the listening wallet first.");
      if (jt("slots")) throw new Error("The listening wallet box needs an update before it can open albums. Try again shortly.");
      if (f || l || w) throw new Error("Still sending a payment. Open the album again in a moment.");
      if ((i.slot ?? 0) === y) return;
      cr(), await s.request("listening.openSlot", { slot: y }), i = await h(s), o = void 0, a = -1 / 0, W = null, Et = !1;
      const L = i.root;
      L && y > 0 && t.store.set(Ot("slot", L), String(y)), Vt(y === 0 ? "My player ✓" : "Album opened ✓");
    }),
    unlock: (y = !1) => {
      const L = () => Xe("Waiting for your passkey…", async () => wn(await v(), y));
      return ot ? y ? jt("cancel") ? (Vt("Tap Cancel in the listening wallet box first, then choose a different wallet."), Promise.resolve()) : bn(async () => {
        (Ln() === "locked" || Ln() === "intro") && await L();
      }) : oe : L();
    },
    link: () => Xe("Sign in your wallet…", async () => {
      x();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      const L = (await t.links(y)).find((q) => q.listening === i.address);
      if (L)
        await s.request("listening.link", { main: y, issued: L.issued, mainSignature: L.mainSignature });
      else {
        const q = { main: y, listening: i.address, issued: t.now() }, nt = await t.signWithMain(y, s6(q)), mt = await s.request("listening.link", { main: y, issued: q.issued, mainSignature: nt });
        await t.saveLink({ ...q, mainSignature: nt, listeningSignature: mt.listeningSignature }), et = -1 / 0;
      }
      Vt("Linked ✓");
    }),
    deposit: () => Xe("Approve the deposit in your wallet…", async () => {
      x();
      const y = t.main();
      if (!y || !(i != null && i.address)) throw new Error("Connect your main wallet first.");
      if (Se()) throw new Error("A deposit is still confirming. Wait for it before adding more.");
      if (He()) throw new Error("Your plays are still arriving. There is nothing to add: wait for them, and add STX only once they are used up.");
      await tt(!0);
      const L = xl(o ?? 0n);
      if (L <= 0n) throw new Error("This wallet already holds 1 STX. No deposit needed.");
      z = await t.deposit(y, i.address, L), z && ye({ txid: z, amount: L.toString(), at: t.now() }), Vt("Deposit sent ✓ Usually confirms in a few minutes.");
    }),
    /**
     * Top up the main listener wallet (the one that signs every like) from the connected main wallet. Works whichever
     * album is open; with the main listener wallet open it is the same deposit as `deposit`.
     */
    topUpLikes: () => Xe("Approve the top-up in your wallet…", async () => {
      x();
      const y = t.main(), L = we();
      if (!y || !L) throw new Error("Connect your main wallet first, or send STX to the address shown.");
      if (Be(L)) throw new Error("A top-up is still confirming. Wait for it before adding more.");
      const q = await t.chain.balance(L);
      A() ? c = { for: L, value: q, at: t.now() } : (o = q, a = t.now());
      const nt = xl(q);
      if (nt <= 0n) throw new Error("Your main listener wallet already holds 1 STX. No top-up needed.");
      const mt = await t.deposit(y, L, nt);
      mt && ye({ txid: mt, amount: nt.toString(), at: t.now() }, L), Vt("Top-up sent ✓ Likes carry on once it confirms, usually a few minutes.");
    }),
    /** Add plays to the open album from My player (the first wallet). One of `TOP_UP_PLAYS`. */
    topUpAlbum: (y) => Xe("Adding plays…", async () => {
      if (x(), !A()) throw new Error("Open the album you want to add plays to first.");
      if (!ja.includes(y)) throw new Error("Choose one of the amounts offered.");
      const L = h6(y, At());
      if (f || l || w) throw new Error("Still sending a payment. Try again in a moment.");
      if (We().length || Se()) throw new Error("Wait for the pending payment to confirm, then add more.");
      await ar(0, i.slot ?? 0, L), Vt("Plays added ✓ They arrive in a few minutes.");
    }),
    switchOn: () => Xe("Confirm in the listening wallet…", async () => {
      if (!Ms()) throw new Error("Connect your wallet first.");
      await mn(), await s.request("listening.approveSession", Ye()), Re(!0), Vt("Paying is on ✓");
    }),
    /** Give up on payments the chain has never seen after 30 minutes. Their signed bytes are discarded. */
    clearStuck: () => Xe("Clearing…", async () => {
      for (const y of K())
        await t.chain.transaction(y.txid) || se({ ...y, status: "failed", note: "never seen on-chain; cleared by listener", raw: void 0 });
      Vt("Cleared ✓");
    }),
    switchOff: () => Xe("Switching off…", async () => {
      cr(), await (s == null ? void 0 : s.request("listening.stop")), Re(!1), Vt("Music support is off. Playback is paused.");
    }),
    lock: () => Xe("Locking…", async () => {
      cr(), await (s == null ? void 0 : s.request("listening.lock")), o = void 0, Vt("Locked ✓");
    }),
    /** Passkey-only: send returns to this address instead of the funder. Public data, kept on this device. */
    setReturnAddress: (y) => {
      const L = String(y ?? "").trim();
      if (!(i != null && i.address)) return Vt("", "Unlock the listening wallet first.");
      if (!Dr(L)) return Vt("", "Enter a standard mainnet address (it starts with SP).");
      if (L === i.address) return Vt("", "That is this listening wallet itself. Enter a different address.");
      t.store.set(Ct(i.address), L), Vt("Returns will go to that address. You confirm it in the listening wallet before anything is sent.");
    },
    clearReturnAddress: () => {
      i != null && i.address && t.store.set(Ct(i.address), ""), t.changed();
    },
    returnFunds: (y) => Xe("Check the return in the listening wallet…", async () => {
      if (!Ms()) throw new Error("Connect your wallet first.");
      if (!(i != null && i.address)) throw new Error("Unlock the listening wallet first.");
      if (Ts()) return Ei(y);
      const L = Ee();
      if (!L) throw new Error(lt() ? "Choose where to send the funds first." : "Link your main wallet first.");
      if (L.kind !== "linked" && jt("standalone")) throw new Error("The listening wallet box needs an update before it can return to another address. Try again shortly.");
      if (Ue().length) throw new Error("Wait for the pending payment to confirm, then return funds.");
      await Dn({ mode: y, to: L.to, linked: L.kind === "linked" }), y === "all" && Re(!1), Vt(y === "all" ? L.kind === "linked" ? "Returned to your wallet ✓ Paying is off." : "Returned ✓ Paying is off." : "Excess returned ✓ Switch paying back on to continue.");
    })
  }, ve = [], Lr = 10, Gr = 30 * 6e4;
  let Cr = !1;
  const Kr = () => f || !!u || l || w, cr = () => {
    ve.length && (ve.length = 0, t.changed());
  };
  async function Vr(y) {
    if (!ve.some((L) => L.id === y.id) && !vt().some((L) => L.id === y.id) && (ve.push({ ...y, at: t.now() }), ve.length > Lr && ve.shift()), Kr() || Ue().length) {
      const L = ve.length;
      S = `Queued ${L === 1 ? "this song" : L + " songs"}: paid as soon as the wallet is free.`, t.changed();
    }
    await Wn();
  }
  async function Wn() {
    if (!Cr) {
      Cr = !0;
      try {
        for (; ve.length; ) {
          for (; ve.length && t.now() - ve[0].at > Gr; ) ve.shift();
          if (!ve.length || Kr() || await Tr(ve[0]) === "wait") return;
          ve.shift();
        }
      } finally {
        Cr = !1, t.changed();
      }
    }
  }
  async function Tr(y) {
    var L;
    f = !0;
    try {
      await It();
      const q = Ln();
      if (q === "loading") return "wait";
      if (q !== "ready" || !qe() || !(i != null && i.session) || i.session.playsLeft < 1 || !U) return "done";
      if (Ue().length) return "wait";
      k || (await t.chain.verify(), k = !0);
      const nt = i.address, { balance: mt, nonce: j } = await t.chain.account(nt);
      o = mt, a = t.now();
      const pt = await t.chain.owner(Sl, y.song);
      if (pt === nt || pt === Kt()) return "done";
      const gt = await s.request("listening.signPlay", {
        core: Sl,
        song: y.song,
        receipt: y.id,
        fee: At().toString(),
        nonce: j.toString(),
        balance: mt.toString()
      }), yt = {
        id: y.id,
        address: nt,
        kind: "play",
        core: Sl,
        song: y.song,
        recipient: pt,
        amount: "50",
        fee: At().toString(),
        nonce: j.toString(),
        created: t.now(),
        status: "signed",
        raw: gt.raw,
        txid: gt.txid,
        // Display only: the radio's title and artist for this song, kept with the public history.
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(yt), se(yt);
      const _t = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`;
      try {
        await t.chain.broadcast(gt.raw, gt.txid), se({ ...yt, status: "pending" }), S = `♪ Paid ${_t}`, M = "";
      } catch (De) {
        se({ ...yt, status: $i(De) ? "failed" : "unknown", note: De.message, ...$i(De) ? { raw: void 0 } : {} }), M = De.message;
      }
      return i = await h(s), "done";
    } catch (q) {
      const nt = q instanceof Error ? q.message : "payment unavailable";
      return (L = kt()) != null && L.player ? (S = "Payment is taking a moment: " + nt, "wait") : (S = "This song played free: " + nt, "done");
    } finally {
      f = !1, t.changed();
    }
  }
  function Ns(y) {
    return !(e != null && e.here) || !["ready", "fund", "over", "locked", "link", "loading"].includes(Ln()) || jt("like") ? !1 : (Xn(y), !0);
  }
  async function Xn(y) {
    const L = y.title ? `“${y.title}”` : `song #${y.song}`, q = (ln) => {
      var qr;
      M = ln, S = "";
      try {
        (qr = t.likeFailed) == null || qr.call(t, y.song);
      } catch {
      }
      t.changed();
    }, nt = A(), mt = Ln(), j = Kt(), pt = nt && (mt === "fund" || mt === "over") ? "ready" : mt, gt = lt() ? we() : j;
    if (pt === "locked") {
      p = { ...y, at: t.now() }, Vt(`Unlock to like ${L}. It sends straight after.`);
      return;
    }
    if (pt === "wrong-wallet") return q(d());
    if (pt === "link") return q("Link the listening wallet to your main wallet first, so your likes count for it.");
    if (lt() && jt("standalone")) return q("The listening wallet box needs an update before it can like on its own. Try again shortly.");
    if (pt === "fund") return q("Top up the listening wallet to like: each like or unlike costs 0.0002 STX.");
    if (pt === "over") return q("Return the excess first: the listening wallet holds more than 1 STX.");
    if (nt) {
      await ut(!0);
      const ln = D();
      if (F(ln))
        return t.changed(), q(yc);
    }
    if (pt !== "ready" || !gt) return q("Still checking the listening wallet. Try the heart again in a moment.");
    if (!(i != null && i.session)) return q("Paying is switched off. Switch it on to like from the listening wallet.");
    if (!U) return q("Pay-per-play is running in another tab. Like from that tab.");
    const yt = vt(we()).find((ln) => ln.kind === "like" && ln.song === y.song);
    if (yt && xo.includes(yt.status))
      return q(`Your last like for ${L} is still on its way. It can change again once it confirms.`);
    if (l) return q("One like at a time: your last one is still being sent.");
    if ((yt == null ? void 0 : yt.status) === "confirmed" && t.now() - (yt.confirmedAt ?? 0) < g6)
      return q(`Your like for ${L} has only just confirmed. Try again in a moment.`);
    let _t;
    w = !0;
    try {
      _t = t.likeState ? (await t.likeState(gt, y.song)).by : y.likedBy ?? [];
    } catch {
      _t = y.likedBy;
    } finally {
      w = !1;
    }
    if (!_t) return q(`Could not check ${L} right now. Try the heart again.`);
    const De = we(), Ke = ((yt == null ? void 0 : yt.status) === "confirmed" && typeof yt.liked == "boolean" && t.now() - (yt.confirmedAt ?? yt.created) < 5 * 6e4 ? yt.liked : void 0) ?? _t.includes(De);
    if (!Ke && _t.some((ln) => ln !== De)) return q(lt() ? `${L} was liked from another wallet of yours. Unlike it there.` : `${L} was liked from your main wallet${_t.includes(j) ? "" : " or another listening wallet"}. Unlike it there (♥ ON-CHAIN).`);
    await Fn({ song: y.song, liked: !Ke, title: y.title, artist: y.artist });
  }
  async function Fn(y) {
    var nt, mt, j;
    if (l) {
      Vt("Still sending your last like. Try again in a moment.");
      return;
    }
    l = !0;
    const L = y.title ? `“${y.title}”${y.artist ? ` by ${y.artist}` : ""}` : `song #${y.song}`, q = t.wait ?? ((pt) => new Promise((gt) => setTimeout(gt, pt)));
    try {
      Vt(`${y.liked ? "Liking" : "Unliking"} ${L}…`);
      const pt = t.now() + 12e4;
      for (; f || (A() ? vt(we()).some((Ke) => xo.includes(Ke.status)) : Ue().length); ) {
        if (t.now() > pt) throw new Error("An earlier payment is still confirming. Try the like again shortly.");
        await q(5e3), await It(!0);
      }
      if (!A() && Ln() !== "ready" || (i == null ? void 0 : i.state) !== "unlocked" || !i.session) throw new Error("Paying stopped before the like was sent.");
      const gt = we(), { balance: yt, nonce: _t } = await t.chain.account(gt);
      if (A() ? c = { for: gt, value: yt, at: t.now() } : (o = yt, a = t.now()), F(yt)) throw new Error(yc);
      const De = await s.request("listening.signLike", {
        song: y.song,
        liked: y.liked,
        fee: ml.toString(),
        nonce: _t.toString(),
        balance: yt.toString()
      }), nn = {
        id: El(),
        address: gt,
        kind: "like",
        core: 0,
        song: y.song,
        liked: y.liked,
        recipient: "",
        amount: "0",
        fee: ml.toString(),
        nonce: _t.toString(),
        created: t.now(),
        status: "signed",
        raw: De.raw,
        txid: De.txid,
        ...y.title ? { title: String(y.title).slice(0, 120) } : {},
        ...y.artist ? { artist: String(y.artist).slice(0, 120) } : {}
      };
      t.validate(nn), se(nn);
      try {
        await t.chain.broadcast(De.raw, De.txid), se({ ...nn, status: "pending" }), S = `${y.liked ? "♥ Liked" : "Unliked"} ${L}`, M = "";
        try {
          (nt = t.likeSent) == null || nt.call(t, y.song, y.liked);
        } catch {
        }
      } catch (Ke) {
        if (se({ ...nn, status: $i(Ke) ? "failed" : "unknown", note: Ke.message, ...$i(Ke) ? { raw: void 0 } : {} }), M = Ke.message, $i(Ke)) try {
          (mt = t.likeFailed) == null || mt.call(t, y.song);
        } catch {
        }
      }
      i = await h(s);
    } catch (pt) {
      M = "Like not sent: " + (pt instanceof Error ? pt.message : "the listening wallet is unavailable");
      try {
        (j = t.likeFailed) == null || j.call(t, y.song);
      } catch {
      }
    } finally {
      l = !1, t.changed(), Wn();
    }
  }
  return { snapshot: tn, refresh: It, onListened: Vr, heart: Ns, toggleLike: Xn, ...Ir };
}
const aw = ["Connect", "Passkey", "Link & fund", "Listen"], cw = ["Passkey", "Add 1 STX", "Listen"], Bu = (t) => t ? cw : aw;
function w6(t) {
  if (t.solo) return b6(t);
  const e = aw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function b6(t) {
  const e = cw.length, n = (r, s, i = !1) => ({ at: r, blocked: i, caption: r >= e ? s : `Step ${r + 1} of ${e} · ${s}` });
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
function m6(t, e) {
  return !e || e.at >= Bu(!!t.solo).length || t.heard || t.step === "wrong-wallet" || t.entries.some((n) => n.kind === "play") || t.creditedTo ? !1 : !(t.step === "locked" && t.linked);
}
const x6 = (t) => typeof t == "string" && t.toLowerCase().includes("asigna");
function S6(t = typeof window > "u" ? void 0 : window) {
  if (!t) return !1;
  let e = t;
  try {
    const n = t;
    n.top && n.top !== n.self && n.top.location.origin === n.location.origin && (e = n.top);
  } catch {
  }
  return e.LeatherProvider || e.XverseProviders || e.HiroWalletProvider || e.StacksProvider ? !0 : [e.btc_providers, e.webbtc_providers, e.webbtc_stx_providers].some((n) => Array.isArray(n) && n.some((r) => (r == null ? void 0 : r.id) && !x6(r.id)));
}
const E6 = {}, A6 = {
  mainnet: [
    "https://stacks-node-api.mainnet.stacks.co",
    "https://api.mainnet.hiro.so"
  ],
  testnet: [
    "https://stacks-node-api.testnet.stacks.co",
    "https://api.testnet.hiro.so"
  ]
}, v6 = (t) => {
  const e = E6;
  return t === "mainnet" ? e.VITE_STACKS_API_MAINNET : e.VITE_STACKS_API_TESTNET;
}, k6 = (t) => `/hiro/${t}`, $6 = (t) => t.startsWith("/") && typeof window < "u" ? `${window.location.origin}${t}` : t, I6 = (t) => {
  const e = v6(t);
  if (e)
    return [$6(e)];
  const n = A6[t];
  return typeof window < "u" ? [`${window.location.origin}${k6(t)}`, ...n.filter((s) => !s.includes("hiro.so"))] : n;
}, L6 = {}, p0 = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}, C6 = "xtrata.log.enabled", T6 = "xtrata.log.level", B6 = "xtrata.log.tags", M6 = "xtrata.log.dedupe", Ca = (t) => {
  try {
    return typeof localStorage > "u" ? null : localStorage.getItem(t);
  } catch {
    return null;
  }
}, N6 = (t) => {
  if (!t)
    return !0;
  const e = t.toLowerCase();
  return e !== "false" && e !== "0" && e !== "off";
}, P6 = (t) => {
  if (!t)
    return null;
  const e = t.toLowerCase();
  return e === "debug" || e === "info" || e === "warn" || e === "error" ? e : null;
}, _6 = (t) => {
  if (!t)
    return !1;
  const e = t.toLowerCase();
  return e === "true" || e === "1" || e === "on";
}, U6 = (t) => {
  if (!t)
    return null;
  const e = t.split(",").map((n) => n.trim().toLowerCase()).filter((n) => n.length > 0);
  return e.length === 0 ? null : e.includes("*") || e.includes("all") ? /* @__PURE__ */ new Set(["*"]) : new Set(e);
}, H6 = () => {
  const t = L6 ?? {}, e = Ca(C6) ?? t.VITE_LOG_ENABLED, n = Ca(T6) ?? t.VITE_LOG_LEVEL, r = Ca(B6) ?? t.VITE_LOG_TAGS, s = Ca(M6) ?? t.VITE_LOG_DEDUPE;
  return {
    enabled: N6(e),
    level: P6(n) ?? "warn",
    tags: U6(r),
    dedupe: _6(s)
  };
}, O6 = (t, e, n) => !t.enabled || p0[n] < p0[t.level] ? !1 : !t.tags || t.tags.has("*") ? !0 : t.tags.has(e.toLowerCase()), D6 = (t, e, n, r) => {
  const s = H6();
  if (!O6(s, e, t) || j6(s.dedupe))
    return;
  const i = `[xtrata:${e}] ${n}`, o = console[t] ?? console.log;
  r !== void 0 ? o(i, r) : o(i);
}, F6 = /* @__PURE__ */ new Set();
let g0 = null;
const j6 = (t, e, n, r, s) => (g0 !== t && (F6.clear(), g0 = t), !1), z6 = (t, e, n) => D6("debug", t, e, n), R6 = {}, G6 = {
  mainnet: "SP2QEZ06AGJ3RKJPBV14SY1V5BBFNAW33D96YPGZF.BNS-V2",
  testnet: null
}, K6 = (t) => {
  const e = R6, n = t === "testnet" ? e.VITE_BNSV2_CONTRACT_TESTNET : e.VITE_BNSV2_CONTRACT_MAINNET, r = typeof n == "string" ? n.trim() : "";
  return r ? r.includes(".") ? r : null : G6[t];
}, V6 = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/, q6 = (t) => {
  if (!t)
    return null;
  const e = t.trim();
  if (!e)
    return null;
  const n = e.toLowerCase();
  return V6.test(n) ? n : null;
}, W6 = (t) => t.replace(/\/+$/, ""), X6 = (t) => t instanceof Error ? t.message || t.name || "Error" : typeof t == "string" ? t : String(t), y0 = (t) => {
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
}, Ii = (t) => t && typeof t == "object" && !Array.isArray(t) ? t : null, Y6 = (t) => {
  var c, u;
  let e;
  try {
    e = wr(X8(t));
  } catch {
    return null;
  }
  const n = Ii(e);
  if (!n || n.success === !1)
    return null;
  const r = Ii(n.value), s = Ii(r == null ? void 0 : r.value), i = Ii(s == null ? void 0 : s.value);
  if (!i)
    return null;
  const o = y0((c = Ii(i.name)) == null ? void 0 : c.value), a = y0((u = Ii(i.namespace)) == null ? void 0 : u.value);
  return !o || !a ? null : q6(`${o}.${a}`);
}, Z6 = async (t) => {
  const [e, n] = t.contractId.split("."), r = `${W6(
    t.baseUrl
  )}/v2/contracts/call-read/${e}/${n}/get-primary`, s = await fetch(r, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: t.address,
      arguments: [jy(vy(t.address))]
    }),
    signal: t.signal
  });
  if (!s.ok)
    throw new Error(`BNS primary lookup failed (${s.status})`);
  const i = await s.json();
  return !(i != null && i.okay) || typeof i.result != "string" ? null : Y6(i.result);
}, Q6 = async (t) => {
  const e = t.address.trim();
  if (!Oi(e))
    return null;
  const n = K6(t.network);
  if (!n)
    return null;
  let r = null;
  for (const s of I6(t.network))
    try {
      return await Z6({
        baseUrl: s,
        contractId: n,
        address: e,
        signal: t.signal
      });
    } catch (i) {
      r = i;
    }
  return z6("bns", "Primary BNS name lookup unavailable", {
    address: e,
    network: t.network,
    error: X6(r)
  }), null;
};
function J6(t, e, n = {}) {
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
const w0 = Object.freeze({
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
}), b0 = Object.freeze({ 139: "melophonic" });
function tk(t, e = "") {
  const n = String(t);
  return Object.hasOwn(w0, n) ? w0[n] : Object.hasOwn(b0, n) ? b0[n] : e;
}
const m0 = Object.freeze({ 139: "Subterranean (Extended Mix with Phil Hartnoll)", 312: "Smalltalk", 315: "Entertainment" });
function ek(t, e = "") {
  return Object.hasOwn(m0, String(t)) ? m0[String(t)] : e;
}
const lw = 10000n, Kf = 1000000n, wc = 3000n, nk = (t, e) => `${t}#gift=${e}`, rk = 100, Ta = (t, e = Si) => t <= ze ? 0 : Number((t - ze) / Pn(e)), x0 = (t) => typeof t == "string" && /^[A-Za-z0-9_-]{22}$/.test(t), uw = "xtrata.xyz/radio/gifts", Al = rk, sk = "Create a prefunded Xtrata radio gift batch", ik = (t) => ({
  domain: li({ name: Qe(uw), version: Qe("1"), "chain-id": Sr(1) }),
  message: li({
    purpose: Qe(sk),
    creator: Qe(t.creator),
    count: Sr(t.count),
    amount: Sr(BigInt(t.amount)),
    label: Qe(t.label),
    issued: Sr(t.issued),
    ...t.player ? { player: Qe(t.player) } : {}
  })
}), ok = (t, e, n = Si) => ze + BigInt(t) * Pn(n) + (e ? qc : 0n), ak = (t, e = Si) => Number((Kf - ze - (t ? qc : 0n)) / Pn(e)), ck = (t, e) => BigInt(t) * (e + wc);
function lk(t, e, n, r = Si) {
  const s = n ? qc : 0n, i = e > ze + s ? e - ze - s : 0n, o = Number(i / Pn(r));
  return {
    plays: o,
    /** Of one copy: what goes to song holders, and what is network fee, if all its plays are used. */
    holders: BigInt(o) * hc,
    fees: BigInt(o) * r,
    reserve: ze,
    float: s,
    /** Network fee the treasury spends sending the copy (or refunding it). */
    sendFee: wc,
    perCopy: e + wc,
    total: ck(t, e)
  };
}
const uk = (t) => t >= lw && t <= Kf, S0 = 40, fk = "Create an Xtrata radio gift player", dk = /^[^\u0000-\u001f\u007f<>]+$/u;
function E0(t, e, n) {
  return typeof t != "string" ? !1 : t.length ? t.length <= e && t === t.trim() && dk.test(t) : !n;
}
function hk(t) {
  if (!t || typeof t != "object") throw new Error("A player needs a definition.");
  if (!E0(t.title, 60, !0)) throw new Error("Title: 1 to 60 plain characters.");
  if (!E0(t.subtitle ?? "", 80, !1)) throw new Error("Subtitle: up to 80 plain characters.");
  if (!Array.isArray(t.tracks) || t.tracks.length < 1 || t.tracks.length > S0) throw new Error(`A player holds 1 to ${S0} songs.`);
  const e = /* @__PURE__ */ new Set();
  for (const n of t.tracks) {
    if (!Number.isSafeInteger(n) || n < 1) throw new Error("Songs are catalogue token numbers.");
    if (e.has(n)) throw new Error("A song appears twice in the list.");
    e.add(n);
  }
  if (t.cover !== null && t.cover !== void 0 && (!Number.isSafeInteger(t.cover) || t.cover < 1)) throw new Error("Cover is a catalogue token number.");
  return { title: t.title, subtitle: t.subtitle ?? "", tracks: [...t.tracks], cover: t.cover ?? null };
}
const pk = (t) => Ip(Np(new TextEncoder().encode(JSON.stringify({ title: t.title, subtitle: t.subtitle ?? "", tracks: t.tracks, cover: t.cover ?? null })))), gk = (t) => ({
  domain: li({ name: Qe(uw), version: Qe("1"), "chain-id": Sr(1) }),
  message: li({
    purpose: Qe(fk),
    admin: Qe(t.admin),
    player: Qe(t.hash),
    issued: Sr(t.issued)
  })
}), Di = (t) => t.tracks.filter((e) => !e.hidden), yk = (t) => t.tracks.find((e) => e.hidden) ?? null, wk = [300, 500, 1e3], A0 = 1800, vl = /* @__PURE__ */ new Map();
async function bk(t) {
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
function mk(t, e, n, r, s) {
  const i = document.createElement("button");
  return i.type = "button", i.className = r, i.dataset.feedback = t, (() => {
    const a = vl.get(t), c = !!a && a.until > Date.now();
    i.textContent = c ? a.label : e, i.classList.toggle("is-done", c && a.ok), i.classList.toggle("is-failed", c && !a.ok);
  })(), i.onclick = async () => {
    const a = await n();
    if (a) {
      vl.set(t, { ...a, until: Date.now() + A0 });
      for (const c of document.querySelectorAll("button[data-feedback]"))
        c.dataset.feedback === t && (c.textContent = a.label, c.classList.remove("is-done", "is-failed", "is-pop"), c.offsetWidth, c.classList.add(a.ok ? "is-done" : "is-failed", "is-pop"));
      setTimeout(() => {
        vl.delete(t), s();
      }, A0 + 50);
    }
  }, i;
}
const Ui = (t, e, n, r, s) => mk(t, e, async () => await bk(n()) ? { label: "Copied ✓", ok: !0 } : { label: "Copy failed", ok: !1 }, r, s), _s = "xtrata.radio.gift.incoming.v1", v0 = (t) => "xtrata.radio.gift.mine.v1:" + t, k0 = (t) => "xtrata.radio.gift.batches.v1:" + t, xt = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Pr = (t, e, n = "") => {
  const r = xt("button", t, n);
  return r.type = "button", r.onclick = e, r;
}, Ba = (t, e) => {
  const n = document.createElement("option");
  return n.textContent = t, n.value = e, n;
}, zn = (t) => pr(t).replace(/\.?0+$/, "");
function xk(t) {
  let e = null;
  const n = (A) => [5e3, 1e4, 2e4, 3e4][A] ?? 6e4, r = (() => {
    try {
      const A = new URL(location.href), D = new URLSearchParams(A.hash.slice(1)).get("gift") ?? A.searchParams.get("gift");
      return D !== null && (A.searchParams.delete("gift"), history.replaceState(null, "", A.pathname + (A.search || ""))), x0(D) ? D : null;
    } catch {
      return null;
    }
  })(), s = (() => {
    try {
      const A = JSON.parse(t.store.get(_s) || "null");
      return x0(A == null ? void 0 : A.code) ? A.code : null;
    } catch {
      return null;
    }
  })(), i = r ?? s;
  if (i) {
    e = { code: i }, t.store.set(_s, JSON.stringify({ code: i, at: t.now() }));
    let A = 0;
    const D = () => fetch("/radio/gift/status", { method: "POST", headers: { "content-type": "application/json" }, cache: "no-store", body: JSON.stringify({ code: i }), signal: AbortSignal.timeout(15e3) }).then(async (F) => {
      const K = await F.json().catch(() => ({}));
      if (F.status === 404) {
        t.store.set(_s, null), e = { ...e, error: (K == null ? void 0 : K.error) || "That gift link is not valid." }, t.changed();
        return;
      }
      if (!F.ok) throw new Error("busy");
      const dt = K;
      e = { ...e, view: dt, retry: void 0 }, ["claimed", "expired", "refunding", "refunded"].includes(dt.status) && t.store.set(_s, null), t.changed();
    }).catch(() => {
      !e || e.view || (e = { ...e, retry: { text: "Still looking up your gift… the network is slow, trying again." } }, t.changed(), setTimeout(() => void D(), n(A++)));
    });
    D();
  }
  const o = () => !!(e != null && e.view) && e.view.status === "live" && !e.done, a = () => {
    const A = e == null ? void 0 : e.view;
    return !(A != null && A.player) || !o() ? null : { player: A.player, from: u(A), plays: Ta(BigInt(A.amount)) };
  }, c = () => {
    e = null, t.store.set(_s, null), t.changed();
  }, u = (A) => A.from ? t.who(A.from) : A.label ? `Xtrata Radio · ${A.label}` : "Xtrata Radio";
  let f = {};
  const l = (A) => {
    if (f.box) return f.box;
    const D = xt("div", "", "ppp-gift-check");
    f.box = D;
    const F = () => {
      const K = window.turnstile;
      !K || f.rendered || (f.rendered = !0, K.render(D, { sitekey: A, callback: (dt) => {
        f.token = dt, t.changed();
      }, "expired-callback": () => {
        f.token = void 0;
      } }));
    };
    if (window.turnstile) F();
    else {
      const K = document.createElement("script");
      K.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", K.async = !0, K.onload = F, document.head.append(K);
    }
    return D;
  }, w = (A) => {
    queueMicrotask(() => void A());
  };
  let p;
  async function m(A) {
    var K, dt, lt, ee, Ct, Qt, be, Ee, Oe;
    if (!e || e.claiming || !A.listening) return;
    const D = !!((K = e.view) != null && K.player);
    if (D && !A.root) return;
    e.claiming = !0, e.error = void 0, (dt = t.claiming) == null || dt.call(t, !0), t.changed();
    const F = async (kt) => {
      const St = await fetch("/radio/gift/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(3e4),
        body: JSON.stringify({ code: e.code, turnstile: f.token, ...kt })
      });
      return { res: St, r: await St.json().catch(() => ({})) };
    };
    try {
      let kt = 0, St = A.listening, Xt;
      if (D) {
        const ce = Number((lt = await t.json("/radio/gift/slots?root=" + encodeURIComponent(A.root))) == null ? void 0 : lt.next);
        if (!Number.isSafeInteger(ce) || ce < 1) throw new Error("Could not pick a wallet number for this album. Try again.");
        kt = ce;
        for (let kn = 0; ; kn++) {
          const $n = await t.album.bind(kt);
          if (St = $n.address, Xt = await F({ wallet: St, binding: $n }), Xt.res.status === 409 && /just taken/.test(((ee = Xt.r) == null ? void 0 : ee.error) || "") && kn < 5) {
            kt += 1;
            continue;
          }
          break;
        }
      } else Xt = await F({ wallet: St });
      const { res: Jt, r: fe } = Xt;
      if (Jt.status === 503 && /sending another gift/.test((fe == null ? void 0 : fe.error) || "")) {
        e.waiting = !0, (Ct = t.claiming) == null || Ct.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.waiting = !1, t.changed());
        }, 12e3);
        return;
      }
      if (!Jt.ok) {
        const ce = String((fe == null ? void 0 : fe.error) || "");
        if (Jt.status === 404 || Jt.status === 410 || Jt.status === 409 && /already had a gift|brand-new|already have this album/.test(ce))
          throw t.store.set(_s, null), new Error(ce || "This gift cannot be opened.");
        if (Jt.status === 429 || Jt.status === 403 || Jt.status === 400 && !/wallet number/i.test(ce)) throw new Error(ce || `Could not open the gift (${Jt.status}).`);
        const $n = /topping up/.test(ce) ? "Your gift is waiting for the gift fund to be topped up. It arrives by itself once it is: you can leave this page open." : /not paid for yet/.test(ce) ? "Your gift is waiting for its sender’s payment to confirm. It arrives by itself once it does." : /being sent to another wallet/.test(ce) ? "Your gift is busy for a moment. Checking again…" : "Still sending your gift… the network is slow, trying again.";
        throw Object.assign(new Error($n), { retry: !0, slow: /topping up|not paid for yet/.test(ce) });
      }
      e.done = !0, t.store.set(_s, null), D ? await t.album.arrived(kt, St, fe.txid, BigInt(fe.amount)) : t.giftSent(fe.txid, BigInt(fe.amount));
    } catch (kt) {
      const St = kt, Xt = St.name === "TypeError" || St.name === "AbortError" || St.name === "TimeoutError" || /wallet number/i.test(St.message);
      if (St.retry || Xt) {
        const Jt = e.tries ?? 0;
        e.tries = Jt + 1, e.retry = { text: St.retry ? St.message : "Still sending your gift… the network is slow, trying again." }, (Qt = t.claiming) == null || Qt.call(t, !0), clearTimeout(p), p = setTimeout(() => {
          e && (e.retry = void 0, t.changed());
        }, St.slow ? 6e4 : n(Jt));
      } else
        e.error = St.message, (be = t.claiming) == null || be.call(t, !1);
      f.token = void 0;
      try {
        (Oe = (Ee = window.turnstile) == null ? void 0 : Ee.reset) == null || Oe.call(Ee, f.box);
      } catch {
      }
    } finally {
      e.claiming = !1, t.changed();
    }
  }
  let S = null;
  function M(A) {
    if (!A.listening || !A.depositPending || A.step !== "fund")
      return S = null, [];
    if (!S || S.wallet !== A.listening || t.now() - S.at > 3e4) {
      const F = A.listening;
      S = { ...(S == null ? void 0 : S.wallet) === F ? S : {}, wallet: F, at: t.now() }, t.json("/radio/gift/for?wallet=" + encodeURIComponent(F)).then((K) => {
        var dt, lt;
        (S == null ? void 0 : S.wallet) === F && (S.state = (dt = K == null ? void 0 : K.gift) == null ? void 0 : dt.state, S.problem = ((lt = K == null ? void 0 : K.gift) == null ? void 0 : lt.problem) ?? null, t.changed());
      }).catch(() => {
      });
    }
    if (!(S.state === "sending" && S.problem)) return [];
    const D = xt("p", "🎁 Your gift is taking a little longer than usual to go out. It is retried automatically: no need to do anything.", "ppp-warn");
    return D.title = `Network reply: ${S.problem}`, [D];
  }
  function R(A, D, F = !1) {
    var Qt, be;
    const K = D.player, dt = BigInt(D.amount), lt = F ? [] : [xt("p", `🎁 ${u(D)} sent you “${K.title}”${K.subtitle ? ` by ${K.subtitle}` : ""}: ${Di(K).length} ${Di(K).length === 1 ? "song" : "songs"} and ${Ta(dt).toLocaleString()} plays of on-chain music.`, "ppp-gift")];
    if (!(!!A.root && ["fund", "ready", "over", "link"].includes(A.step))) {
      if (F) return lt;
      if (lt.push(xt("p", A.step === "intro" ? "Tap below and use your face or fingerprint. Your album arrives in a few seconds." : A.step === "locked" ? "Unlock your player and the album arrives." : "Open your player and the album arrives.", "ppp-mute")), A.step === "intro") {
        const Ee = document.createElement("details");
        Ee.className = "ppp-how";
        const Oe = document.createElement("summary");
        Oe.textContent = "How does this work?", Ee.append(Oe, xt("p", "Your device makes a passkey: a private key that never leaves it, and that works as your wallet on Stacks. Each album goes into its own numbered wallet under that passkey, so you can keep as many albums as you like.", "ppp-mute")), lt.push(Ee);
      }
      return lt;
    }
    if (A.walletCannotAlbums)
      return lt.push(xt("p", "The listening wallet box is still updating. The album arrives as soon as it has: reload in a few minutes.", "ppp-warn")), lt;
    const Ct = (be = (Qt = A.gate) == null ? void 0 : Qt.gifts) == null ? void 0 : be.turnstileSiteKey;
    return Ct && !f.token ? lt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), l(Ct)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => m(A)), lt.push(...z(A, "Sending your album…")), lt;
  }
  function z(A, D) {
    const F = [];
    return e.claiming || e.waiting ? F.push(xt("p", e.waiting ? "Another gift is on its way out first. Yours is next…" : D, "ppp-cyan")) : e.retry && F.push(xt("p", e.retry.text, "ppp-warn"), Pr("Try now", () => {
      clearTimeout(p), e.retry = void 0, m(A);
    }, "quiet")), e.error && F.push(xt("p", e.error, "ppp-bad"), Pr("Try again", () => {
      e.error = void 0, m(A);
    })), F;
  }
  const E = (A) => {
    var D;
    return !!e && !e.done && !e.error && o() && !!A.listening && // A claim that is running (or waiting its turn, or retrying) is always a gift on its way, even for a wallet that
    // is already linked or has history: it is receiving the gift right now, so it must not read as empty.
    (!!(e.claiming || e.waiting || e.retry) || !A.linked && !A.creditedTo && (A.createdHere || A.brandNew || !!((D = e.view) != null && D.player)) && (A.balance ?? 0n) === 0n && !A.entries.length);
  };
  function _(A, D = {}) {
    var Oe, kt;
    const F = M(A);
    if (!e || ["off", "elsewhere"].includes(A.step)) return F;
    const K = e.view;
    if (e.error && !K) return [xt("p", `🎁 ${e.error}`, "ppp-warn")];
    if (!K) return [xt("p", e.retry ? `🎁 ${e.retry.text}` : "🎁 Checking your gift…", e.retry ? "ppp-warn" : "ppp-mute")];
    if (e.done) return F;
    if (K.status === "claimed" || K.status === "claiming") return [xt("p", "🎁 This gift link has already been used.", "ppp-mute")];
    if (["expired", "refunding", "refunded"].includes(K.status)) return [xt("p", "🎁 This gift link has expired.", "ppp-mute")];
    if (K.status === "pending-deposit") return [xt("p", `🎁 ${u(K)} is still sending this gift. Check back in a few minutes.`, "ppp-warn")];
    if (K.player) return [...R(A, K, !!D.bare), ...F];
    if (!!A.listening && (!(A.createdHere || A.brandNew) || !!A.linked || !!A.creditedTo || (A.balance ?? 0n) > 0n || A.entries.length > 0))
      return [xt("p", "🎁 A gift link is also waiting on this device. Gifts are for brand-new listening wallets, not this one: share the link with someone new.", "ppp-mute"), Pr("Forget this gift link here", c, "quiet")];
    const lt = BigInt(K.amount), ee = Ta(lt).toLocaleString(), Qt = [xt(
      "p",
      `🎁 ${u(K)} sent you ${zn(lt)} STX of on-chain music: about ${ee} paid plays.`,
      "ppp-gift"
    )], be = !!A.listening && (A.createdHere || A.brandNew) && !A.linked && !A.creditedTo && A.step === "fund" && (A.balance ?? 1n) === 0n && !A.depositPending && !A.entries.length, Ee = (kt = (Oe = A.gate) == null ? void 0 : Oe.gifts) == null ? void 0 : kt.turnstileSiteKey;
    return be ? (Ee && !f.token ? Qt.push(xt("p", "One quick check and it is yours:", "ppp-mute"), l(Ee)) : !e.claiming && !e.error && !e.waiting && !e.retry && w(() => m(A)), Qt.push(...z(A, "Sending your gift…"))) : A.step === "intro" ? Qt.push(xt("p", "Tap below and use your face or fingerprint. Your gift arrives in a few seconds.", "ppp-mute")) : A.listening && A.linked ? Qt.push(xt("p", "Gifts are for brand-new listening wallets, and this one is linked to a Stacks wallet. The link still works for someone new.", "ppp-mute"), Pr("Forget this gift link here", c, "quiet")) : A.listening && (A.balance ?? 0n) > 0n && Qt.push(xt("p", "Gifts are for brand-new listening wallets, and this one already has funds. Share the link with someone new instead.", "ppp-mute"), Pr("Forget this gift link here", c, "quiet")), Qt;
  }
  async function N(A, D, F) {
    var K;
    try {
      const dt = await t.json("/radio/gift/for?wallet=" + encodeURIComponent(A));
      if ((K = dt == null ? void 0 : dt.gift) != null && K.returnTo) return { ok: !0, funder: dt.gift.returnTo, txId: dt.gift.txid ?? void 0, amount: dt.gift.amount, distinct: 1 };
    } catch {
      if (F) return { ok: !1 };
    }
    return D();
  }
  const J = xt("div", "", "ppp-gift-fold");
  let et = 250000n, G = "", V = "";
  const $ = (A) => {
    try {
      const D = JSON.parse(t.store.get(v0(A)) || "[]");
      return Array.isArray(D) ? D : [];
    } catch {
      return [];
    }
  }, P = (A, D) => t.store.set(v0(A), JSON.stringify(D.slice(0, 50)));
  async function b(A) {
    const D = $(A);
    for (const F of D)
      if (!(F.view && ["claimed", "refunded", "expired"].includes(F.view.status)))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await t.json("/radio/gift/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: F.id, ...F.txid ? { txid: F.txid } : {} }) }) : await t.json("/radio/gift?id=" + F.id), F.error = void 0;
        } catch (K) {
          F.error = K.message;
        }
    P(A, D), t.changed();
  }
  async function C(A) {
    if (G) return;
    G = "Starting your gift…", V = "", t.changed();
    let D = null;
    try {
      D = await t.json("/radio/gift/create", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ gifter: A, amount: et.toString() }) });
      const F = $(A);
      F.unshift({ id: D.id, code: D.code, amount: et.toString(), at: t.now() }), P(A, F), G = "Approve the gift in your wallet…", t.changed();
      const K = await t.pay(A, D.depositTo, BigInt(D.deposit), D.memo), dt = $(A), lt = dt.find((ee) => ee.id === D.id);
      lt && (lt.txid = K, lt.view = { status: "pending-deposit", amount: et.toString(), source: "friend", from: A, label: "", expires: 0 }), P(A, dt), V = "Sent ✓ Your link works as soon as the payment confirms (a few minutes).", b(A);
    } catch (F) {
      V = F.message || "Not sent.";
    } finally {
      G = "", t.changed();
    }
  }
  const O = (A) => "xtrata.radio.gift.players.v1:" + A, T = (A) => {
    try {
      const D = JSON.parse(t.store.get(O(A)) || "[]");
      return Array.isArray(D) ? D.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id)) : [];
    } catch {
      return [];
    }
  };
  async function it(A, D) {
    var F;
    if (!G) {
      G = "Checking the player…", V = "", t.changed();
      try {
        const K = D.tracks.split(/[\s,]+/).filter(Boolean).map((be) => Number(be.replace(/^#/, ""))), dt = hk({ title: D.title.trim(), subtitle: D.subtitle.trim(), tracks: K, cover: (F = D.cover) != null && F.trim() ? Number(D.cover.trim().replace(/^#/, "")) : null });
        G = "Sign in your wallet…", t.changed();
        const lt = { admin: A, hash: pk(dt), issued: t.now() }, ee = await t.sign(A, gk(lt));
        G = "Making the player…", t.changed();
        const Ct = await t.json("/radio/gift/player", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ definition: dt, request: lt, signature: ee }) }), Qt = T(A).filter((be) => be.id !== Ct.id);
        Qt.unshift({ id: Ct.id, title: Ct.title, tracks: Ct.tracks }), t.store.set(O(A), JSON.stringify(Qt.slice(0, 30))), V = `${Ct.existing ? "That player already exists" : "Player made"} ✓ “${Ct.title}” · ${Ct.tracks} songs. Pick it below for a batch.`;
      } catch (K) {
        V = K.message || "Not made.";
      } finally {
        G = "", t.changed();
      }
    }
  }
  const W = (A, D) => nk(A || location.origin + "/radio.html", D), Et = (A) => {
    try {
      const D = JSON.parse(t.store.get(k0(A)) || "[]");
      return Array.isArray(D) ? D.filter((F) => F && /^[0-9a-f]{16}$/.test(F.id) && Array.isArray(F.codes)) : [];
    } catch {
      return [];
    }
  }, k = (A, D) => t.store.set(k0(A), JSON.stringify(D.slice(0, 20))), U = (A) => !!A.view && A.view.status === "live" && A.view.copies.waiting + A.view.copies.claiming + A.view.copies.refunding === 0, ot = (A, D) => t.json(A, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(D) });
  let I = 0;
  async function X(A) {
    const D = Et(A);
    for (const F of D)
      if (!U(F))
        try {
          F.view = !F.view || F.view.status === "pending-deposit" ? await ot("/radio/gift/batch/confirm", { id: F.id, ...F.txid ? { txid: F.txid } : {} }) : await t.json("/radio/gift/batch?id=" + F.id), F.error = void 0;
        } catch (K) {
          F.error = K.message;
        }
    try {
      const F = await t.json("/radio/gift/batches?creator=" + encodeURIComponent(A));
      for (const K of (F == null ? void 0 : F.batches) ?? []) {
        const dt = D.find((lt) => lt.id === K.id);
        if (dt) {
          dt.error || (dt.view = K);
          continue;
        }
        D.push({ id: K.id, codes: [], count: K.count, amount: K.amount, label: K.label, player: K.player, depositTo: "", deposit: K.deposit, memo: K.memo, at: 0, view: K });
      }
    } catch {
    }
    k(A, D), t.changed();
  }
  async function wt(A, D) {
    const F = Et(A).find((K) => K.id === D);
    if (!(!F || !F.depositTo || G)) {
      G = "Approve the payment in your wallet…", V = "", t.changed();
      try {
        const K = await t.pay(A, F.depositTo, BigInt(F.deposit), F.memo), dt = Et(A), lt = dt.find((ee) => ee.id === D);
        lt && (lt.txid = K), k(A, dt), V = "Paid ✓ Your links work as soon as the payment confirms (a few minutes).", G = "", X(A);
      } catch (K) {
        V = `${/cancel/i.test(K.message) ? "Payment cancelled." : K.message || "Not paid."} Your links are saved below. Tap Pay now when you are ready.`;
      } finally {
        G = "", t.changed();
      }
    }
  }
  async function oe(A, D, F, K) {
    if (G) return;
    if (!D.ok) {
      V = D.reason, t.changed();
      return;
    }
    G = "Sign in your wallet…", V = "", t.changed();
    let dt = null;
    try {
      const lt = { creator: A, count: D.count, amount: D.amount.toString(), label: F, issued: t.now(), ...K ? { player: K } : {} }, ee = await t.sign(A, ik(lt));
      G = "Making your links…", t.changed(), dt = await ot("/radio/gift/batch", { request: lt, signature: ee });
      const Ct = Et(A);
      Ct.unshift({ id: dt.id, codes: dt.codes, count: D.count, amount: dt.amount, label: F, player: K ?? null, depositTo: dt.depositTo, deposit: dt.deposit, memo: dt.memo, at: t.now() }), k(A, Ct);
    } catch (lt) {
      V = lt.message || "Not made.", G = "", t.changed();
      return;
    }
    G = "", t.changed(), await wt(A, dt.id);
  }
  function At() {
    const A = !!Se.value, D = Be.value === "max" ? ak(A) : Number(Be.value), F = ok(D, A), K = Number(ye.value);
    return !Number.isInteger(K) || K < 1 || K > Al ? { ok: !1, reason: `Make 1 to ${Al} copies at a time.`, album: A, plays: D, amount: F, count: K } : uk(F) ? { ok: !0, reason: "", album: A, plays: D, amount: F, count: K, bill: lk(K, F, A) } : { ok: !1, reason: "Each copy must be 0.01 to 1 STX.", album: A, plays: D, amount: F, count: K };
  }
  const jt = () => {
    const A = At();
    if (!A.ok) return A.reason;
    const D = A.bill;
    return `Each copy: ${A.plays.toLocaleString()} paid plays (${zn(D.holders)} to song holders, ${zn(D.fees)} network fees)${A.album ? `, ${zn(D.float)} for the album’s likes` : ""}, ${zn(D.reserve)} kept so a listener can return what is left, + ${zn(D.sendFee)} to send it = ${zn(D.perCopy)} STX. ${A.count} copies = ${zn(D.total)} STX, paid now in one payment. Copies nobody claims within 30 days come back to you.`;
  }, Ot = (A, D) => D.codes.map((F) => W(A, F)), Zt = xt("input");
  Zt.type = "range", Zt.min = String(lw), Zt.max = String(Kf), Zt.step = "10000", Zt.value = String(et), Zt.setAttribute("aria-label", "Gift amount");
  const Ft = xt("p", "", "ppp-gift-amount"), Kt = Pr("", () => {
    const A = t.main();
    A && C(A);
  }, "primary"), vt = () => {
    Ft.textContent = se(), Kt.textContent = `Gift ${zn(et)} STX`;
  };
  Zt.oninput = () => {
    et = BigInt(Zt.value), vt();
  };
  const se = () => `${zn(et)} STX · about ${Ta(et).toLocaleString()} paid plays · you pay ${zn(et + wc)} STX with the network fee`;
  vt();
  const qe = xt("input");
  qe.maxLength = 60, qe.placeholder = "Title, e.g. Proof of Sound", qe.setAttribute("aria-label", "Player title");
  const Re = xt("input");
  Re.maxLength = 80, Re.placeholder = "Artist (optional)", Re.setAttribute("aria-label", "Player subtitle");
  const Ue = xt("textarea");
  Ue.rows = 3, Ue.placeholder = "Radio song numbers in play order, e.g. 1021, 1022, 1023", Ue.setAttribute("aria-label", "Songs");
  const We = xt("input");
  We.inputMode = "numeric", We.placeholder = "Cover inscription number (optional), shown when the album loads", We.setAttribute("aria-label", "Cover inscription");
  const Se = xt("select");
  Se.setAttribute("aria-label", "Batch album");
  const Be = xt("select");
  Be.setAttribute("aria-label", "Plays per copy");
  for (const A of wk) Be.append(Ba(`${A.toLocaleString()} plays`, String(A)));
  Be.append(Ba("Max (1 STX)", "max"));
  const ye = xt("input");
  ye.type = "number", ye.min = "1", ye.max = String(Al), ye.value = "10", ye.setAttribute("aria-label", "Copies");
  const ae = xt("input");
  ae.maxLength = 40, ae.placeholder = "Label, e.g. Opera launch", ae.setAttribute("aria-label", "Batch label");
  const sr = xt("p", "", "ppp-mute"), He = () => {
    sr.textContent = jt();
  };
  for (const A of [Se, Be, ye])
    A.oninput = He, A.onchange = He;
  He();
  function ue(A) {
    var dt, lt;
    const D = (dt = A.gate) == null ? void 0 : dt.gifts;
    if (!(D != null && D.enabled) || !D.admin || ["off", "elsewhere", "unsupported"].includes(A.step)) return null;
    const F = t.main(), K = [xt("p", "Make an album and fund copies of it to give away.", "ppp-mute")];
    if (!F)
      K.push(xt("p", "Connect a Stacks wallet (top right) to make albums."));
    else if (D.admin) {
      const ee = xt("div", "", "ppp-gift-admin"), Ct = (kt, St) => {
        const Xt = xt("label", kt);
        return Xt.append(St), Xt;
      }, Qt = T(F);
      ee.append(
        xt("p", "Gift players (admin) · an album that comes with the gift", "ppp-cyan"),
        qe,
        Re,
        Ue,
        We,
        Pr("Sign and make player", () => void it(F, { title: qe.value, subtitle: Re.value, tracks: Ue.value, cover: We.value }))
      );
      const be = Pr("Sign, pay and make links", () => {
        oe(F, At(), ae.value.trim(), Se.value || void 0);
      });
      be.disabled = !!G;
      const Ee = Se.value;
      Se.replaceChildren(Ba("No album (starter copies)", ""), ...Qt.map((kt) => Ba(`${kt.title} · ${kt.tracks} songs`, kt.id))), Qt.some((kt) => kt.id === Ee) && (Se.value = Ee), He(), ee.append(
        xt("p", "Prefunded batch (admin) · you pay up front, unclaimed copies come back to you after 30 days", "ppp-cyan"),
        Ct("Album ", Se),
        Ct("Plays each ", Be),
        Ct("Copies ", ye),
        ae,
        sr,
        be
      ), t.now() - I > 3e4 && (I = t.now(), X(F));
      const Oe = Et(F);
      if (Oe.length) {
        const kt = xt("ul", "", "ppp-gift-list");
        for (const St of Oe.slice(0, 10)) {
          const Xt = St.view, Jt = Xt == null ? void 0 : Xt.copies, fe = St.error ? St.error : !Xt || Xt.status === "pending-deposit" ? St.txid ? "payment confirming…" : "waiting for your payment" : `${Jt.claimed} of ${Xt.count} claimed${Jt.refunding + Jt.refunded ? ` · ${Jt.refunded} refunded${Jt.refunding ? `, ${Jt.refunding} on their way` : ""}` : ""}`, ce = xt("li");
          if (ce.append(xt("span", `${St.label || "Batch"} · ${St.count} × ${zn(BigInt(St.amount))} STX`, "t"), xt("span", fe, "ppp-mute")), !St.txid && St.depositTo && (!Xt || Xt.status === "pending-deposit") && ce.append(Pr("Pay now", () => void wt(F, St.id), "tiny")), St.codes.length && (Xt == null ? void 0 : Xt.status) === "live") {
            const kn = Ot(((lt = A.gate) == null ? void 0 : lt.radioUrl) ?? null, St);
            ce.append(
              Ui("batch-copy:" + St.id, "Copy all links", () => kn.join(`
`), "tiny", t.changed),
              Ui("batch-csv:" + St.id, "Copy as CSV", () => ["copy,link", ...kn.map(($n, Ls) => `${Ls + 1},${$n}`)].join(`
`), "tiny", t.changed)
            );
          } else St.codes.length || ce.append(xt("span", "links were made on another device", "ppp-mute"));
          kt.append(ce);
        }
        ee.append(kt);
      }
      K.push(ee);
    }
    return G && K.push(xt("p", G, "ppp-cyan")), V && K.push(xt("p", V, /✓/.test(V) ? "ppp-ok" : "ppp-warn")), J.replaceChildren(...K), J;
  }
  return { banner: _, funder: N, renderFold: ue, liveGift: o, incomingAlbum: a, setAside: c, pendingCode: () => e && !e.done && (!e.view || e.view.status === "live") ? e.code : null, inProgress: E };
}
const Sk = [
  { value: "recent", label: "Recently played" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" }
];
function Ek(t) {
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
const Ak = (t) => {
  var e, n, r;
  return [(e = t.player) == null ? void 0 : e.title, (n = t.player) == null ? void 0 : n.subtitle, t.label, `#${t.slot}`, ...(((r = t.player) == null ? void 0 : r.tracks) ?? []).filter((s) => !s.hidden).flatMap((s) => [s.title, s.artist])].filter(Boolean).join(" ").toLowerCase();
};
function vk(t, e) {
  const n = e.query.toLowerCase().split(/\s+/).filter(Boolean), r = t.filter((i) => (!e.pinnedOnly || e.pins.has(i.slot)) && (() => {
    const o = Ak(i);
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
function kk(t, e = 100) {
  const n = Object.entries(t).sort((r, s) => s[1] - r[1]).slice(0, e);
  return Object.fromEntries(n.map(([r, s]) => [Number(r), s]));
}
const Mu = /* @__PURE__ */ new Set(), fw = (t) => (Mu.add(t), () => {
  Mu.delete(t);
}), Nu = () => {
  for (const t of [...Mu])
    try {
      t();
    } catch {
    }
}, $0 = "xtrata:al-thumb:v1:", dw = "-", So = 96, $k = 24 * 1024 * 1024, un = /* @__PURE__ */ new Map(), I0 = /* @__PURE__ */ new Set(), Pu = [];
let kl = !1, $l;
const bc = (t, e) => {
  try {
    if (e === void 0) return window.localStorage.getItem($0 + t);
    window.localStorage.setItem($0 + t, e);
  } catch {
  }
  return null;
};
function Vf(t) {
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
          r.width = r.height = So, s.fillStyle = "#143a40", s.fillRect(0, 0, So, So), s.drawImage(i, (i.naturalWidth - a) / 2, (i.naturalHeight - a) / 2, a, a, 0, 0, So, So), e(r.toDataURL("image/jpeg", 0.82));
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
async function Ik(t) {
  var c, u, f, l, w;
  const e = await fetch("/inscription/" + t, { signal: AbortSignal.timeout(6e4) }), n = (e.headers.get("content-type") || "").toLowerCase();
  if (!e.ok)
    return await ((c = e.body) == null ? void 0 : c.cancel()), null;
  if (n.startsWith("image/"))
    return await ((u = e.body) == null ? void 0 : u.cancel()), "/inscription/" + t;
  if (!n.includes("text/html"))
    return await ((f = e.body) == null ? void 0 : f.cancel()), "";
  let r = "", s = 0;
  const i = (p) => {
    let m = 0;
    for (; ; ) {
      const S = r.slice(m).search(/<img\b/i);
      if (S < 0)
        return r = p ? "" : r.slice(Math.max(0, r.length - 4)), null;
      const M = m + S, R = r.indexOf(">", M);
      if (R < 0)
        return r = r.slice(M), null;
      const z = r.slice(M, R + 1), E = z.match(/\bsrc="(data:image\/[^"]+)"/i);
      if (E) return E[1].replace(/&amp;/g, "&");
      const _ = z.match(/\bsrc=["'](?:https?:\/\/(?:radio\.)?xtrata\.xyz)?\/inscription\/(\d{1,9})["']/i);
      if (_) return "/inscription/" + _[1];
      m = R + 1;
    }
  }, o = (w = (l = e.body) == null ? void 0 : l.getReader) == null ? void 0 : w.call(l);
  if (!o)
    return r = await e.text(), i(!0) ?? "";
  const a = new TextDecoder();
  for (; ; ) {
    const { done: p, value: m } = await o.read();
    if (p) break;
    s += m.byteLength, r += a.decode(m, { stream: !0 });
    const S = i(!1);
    if (S)
      return await o.cancel(), S;
    if (s > $k)
      return await o.cancel(), null;
  }
  return r += a.decode(), i(!0) ?? "";
}
async function Lk() {
  if (!kl) {
    kl = !0;
    try {
      for (; Pu.length; ) {
        const t = Pu.shift();
        if (!un.has(t))
          try {
            const e = await Ik(t);
            if (e === null) continue;
            if (!e) {
              un.set(t, ""), bc(t, dw), Nu();
              continue;
            }
            const n = await Vf(e);
            un.set(t, n), n.startsWith("data:image/jpeg") && bc(t, n), Nu();
          } catch {
          }
      }
    } finally {
      kl = !1;
    }
  }
}
function hw(t, e) {
  if (e && !un.get(t) ? (un.set(t, e), Vf(e).then((r) => {
    r !== e && (un.set(t, r), r.startsWith("data:image/jpeg") && bc(t, r), Nu());
  })) : e === "" && !un.has(t) && un.set(t, ""), un.has(t)) return un.get(t);
  const n = bc(t);
  if (n != null) {
    const r = n === dw ? "" : n;
    return un.set(t, r), r;
  }
  return I0.has(t) || (I0.add(t), Pu.push(t), $l || ($l = setTimeout(() => {
    $l = void 0, Lk();
  }, 1200))), "";
}
const Li = 12, Ck = 5e3, sn = (t, e = "", n = "") => {
  const r = document.createElement(t);
  return e && (r.textContent = e), n && (r.className = n), r;
}, Ci = (t, e, n = "") => {
  const r = sn("button", t, n);
  return r.type = "button", r.onclick = e, r;
};
function Tk(t) {
  let e, n = [], r = 0, s = !1, i = !1, o = -1 / 0, a = "", c = "recent", u = !1, f = Li;
  const l = sn("div", "", "ppp-shelf-box");
  fw(() => t.changed());
  const w = (b) => "xtrata.radio.shelf.pins.v1:" + b, p = (b) => "xtrata.radio.shelf.recent.v1:" + b, m = (b, C) => {
    try {
      return JSON.parse(t.store.get(b) || "null") ?? C;
    } catch {
      return C;
    }
  }, S = (b) => new Set(m(w(b), []).filter((C) => Number.isSafeInteger(C))), M = (b) => {
    const C = m(p(b), {}), O = {};
    for (const [T, it] of Object.entries(C)) Number.isSafeInteger(Number(T)) && typeof it == "number" && (O[Number(T)] = it);
    return O;
  };
  async function R(b) {
    if (!s) {
      s = !0, i = !1;
      try {
        const C = [];
        let O = 0, T = 0;
        for (let it = 0; it < Ck / 100 + 1; it++) {
          const W = await t.json(`/radio/gift/shelf?root=${encodeURIComponent(b)}&after=${O}&limit=100`);
          if (C.push(...Ek(W == null ? void 0 : W.shelf)), T = Number(W == null ? void 0 : W.total) || C.length, !(W != null && W.next) || !Number.isSafeInteger(W.next)) break;
          O = W.next;
        }
        b === e && (n = C, r = T, o = t.now());
      } catch {
        i = !0;
      } finally {
        s = !1, t.changed();
      }
    }
  }
  const z = () => {
    o = -1 / 0;
  }, E = sn("input");
  E.type = "search", E.placeholder = "Search title, artist or #", E.setAttribute("aria-label", "Search your albums"), E.oninput = () => {
    a = E.value, f = Li, t.changed();
  };
  const _ = sn("select");
  _.setAttribute("aria-label", "Sort albums");
  for (const b of Sk) {
    const C = document.createElement("option");
    C.value = b.value, C.textContent = b.label, _.append(C);
  }
  _.onchange = () => {
    c = _.value, f = Li, t.changed();
  };
  const N = Ci("", () => {
    u = !u, f = Li, t.changed();
  }, "tiny"), J = sn("div", "", "ppp-shelf-tools");
  J.append(E, _, N);
  const et = sn("div"), G = sn("div");
  function V(b) {
    const C = b.step === "off" || b.step === "elsewhere" ? void 0 : b.root;
    if (C !== e && (e = C, n = [], r = 0, o = -1 / 0, f = Li), !C || b.walletCannotAlbums) return null;
    if (!s && t.now() - o > 5 * 6e4 && R(C), !n.length)
      return i ? (G.replaceChildren(sn("p", "Could not read your albums right now. They are safe in your wallet.", "ppp-warn"), Ci("Try again", () => {
        o = -1 / 0, t.changed();
      }, "quiet")), l.replaceChildren(G), l) : null;
    const O = S(C), T = M(C), it = vk(n, { query: a, sort: c, pinnedOnly: u, pins: O, recents: T });
    E.value !== a && (E.value = a), _.value = c, N.textContent = u ? "★ Pinned only" : "☆ Pinned only", N.setAttribute("aria-pressed", String(u));
    const W = [];
    if (b.slot > 0 && W.push(Ci("← My player", () => t.open(0), "quiet")), !it.length) W.push(sn("p", "No album matches that.", "ppp-mute"));
    else {
      const Et = sn("ul", "", "ppp-shelf-list");
      for (const k of it.slice(0, f)) {
        const U = sn("li", "", k.slot === b.slot ? "now" : ""), ot = O.has(k.slot), I = Ci(ot ? "★" : "☆", () => {
          const Kt = new Set(O);
          ot ? Kt.delete(k.slot) : Kt.add(k.slot), t.store.set(w(C), JSON.stringify([...Kt])), t.changed();
        }, "tiny");
        I.setAttribute("aria-label", ot ? `Unpin ${k.player.title}` : `Pin ${k.player.title}`);
        const X = [k.player.subtitle, `${Di(k.player).length} ${Di(k.player).length === 1 ? "song" : "songs"}`, k.state === "sending" ? "arriving…" : ""].filter(Boolean).join(" · "), wt = k.slot === b.slot, oe = Ci(wt ? "Playing" : "Select", () => {
          t.store.set(p(C), JSON.stringify(kk({ ...T, [k.slot]: t.now() }))), t.open(k.slot);
        }, wt ? "tiny ppp-pick" : "tiny primary ppp-pick");
        oe.disabled = wt;
        const At = Di(k.player)[0], jt = k.player.cover ?? (At == null ? void 0 : At.id), Ot = jt ? hw(String(jt)) : "", Zt = sn("span", "", "ppp-shelf-art");
        if (Ot) {
          const Kt = document.createElement("img");
          Kt.src = Ot, Kt.alt = "", Kt.decoding = "async", Zt.append(Kt);
        } else Zt.textContent = "💿";
        const Ft = sn("span", "", "ppp-shelf-txt");
        Ft.append(sn("span", k.player.title, "t"), sn("span", X, "ppp-mute")), U.append(I, Zt, Ft, oe), Et.append(U);
      }
      W.push(Et), it.length > f && W.push(Ci(`Show more (${it.length - f} left)`, () => {
        f += Li, t.changed();
      }, "quiet"));
    }
    return i && W.push(sn("p", "Could not refresh your albums just now. This is the last list read.", "ppp-mute")), et.replaceChildren(...W), l.firstChild !== J && l.replaceChildren(J, et), l;
  }
  return { render: V, invalidate: z, count: () => r || n.length, latest: () => {
    if (!e || !n.length) return null;
    const b = M(e), C = [...n].filter((O) => O.player).sort((O, T) => (b[T.slot] ?? 0) - (b[O.slot] ?? 0) || T.slot - O.slot)[0];
    return C ? { slot: C.slot, title: C.player.title } : null;
  } };
}
const Bk = 20, Ze = (t, e = 22, n = !1) => `<svg width="${e}" height="${e}" viewBox="0 0 24 24" ${n ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${t}</svg>`, Ie = {
  grid: Ze('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
  heart: Ze('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  heartOn: Ze('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', 22, !0),
  prev: Ze('<rect x="5" y="6" width="2.4" height="12" rx="1"/><path d="M19 6.5v11a.8.8 0 0 1-1.2.7L9.5 12.7a.8.8 0 0 1 0-1.4l8.3-5.5a.8.8 0 0 1 1.2.7z"/>', 26, !0),
  next: Ze('<rect x="16.6" y="6" width="2.4" height="12" rx="1"/><path d="M5 6.5v11a.8.8 0 0 0 1.2.7l8.3-5.5a.8.8 0 0 0 0-1.4L6.2 5.8A.8.8 0 0 0 5 6.5z"/>', 26, !0),
  play: Ze('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 26, !0),
  playSmall: Ze('<path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10-6.5a.8.8 0 0 0 0-1.4l-10-6.5A.8.8 0 0 0 8 5.5z"/>', 20, !0),
  pause: Ze('<rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/>', 26, !0),
  eq: Ze('<rect x="4" y="10" width="3" height="10" rx="1"/><rect x="10.5" y="5" width="3" height="15" rx="1"/><rect x="17" y="12" width="3" height="8" rx="1"/>', 16, !0),
  down: Ze('<path d="M6 9l6 6 6-6"/>', 18),
  right: Ze('<path d="M9 6l6 6-6 6"/>', 16),
  close: Ze('<path d="M6 6l12 12M18 6L6 18"/>', 20),
  gift: Ze('<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 13h17M12 9v11M12 9c-1.5-3-5-3.5-5-1.2C7 9 9.5 9 12 9zM12 9c1.5-3 5-3.5 5-1.2C17 9 14.5 9 12 9z"/>', 18),
  radio: Ze('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="15.5" cy="14.5" r="2.5"/><path d="M6 13h4M6 16h4"/>', 18),
  device: Ze('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>', 18),
  flip: Ze('<path d="M7 7h11l-3-3M17 17H6l3 3"/>', 16),
  info: Ze('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v5h1"/>', 18)
};
function Q(t, e = {}, ...n) {
  const r = document.createElement(t);
  for (const [s, i] of Object.entries(e))
    i == null || i === !1 || (s === "class" ? r.className = String(i) : s === "html" ? r.innerHTML = String(i) : s.startsWith("on") && typeof i == "function" ? r[s.toLowerCase()] = i : s === "disabled" ? r.disabled = !!i : r.setAttribute(s, i === !0 ? "" : String(i)));
  for (const s of n) s != null && s !== !1 && r.append(s);
  return r;
}
const rn = (t, ...e) => Q("button", { type: "button", ...t }, ...e), Ma = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`, Eo = (t, e, n) => `${t.toLocaleString()} ${t === 1 ? e : n}`, Mk = { music: "My music", device: "This device", gifts: "Albums (admin)" }, Nk = { music: [".ppp-shelf"], device: [".ppp-wallets", ".ppp-recent", ".ppp-more"], gifts: [".ppp-gifts"] };
function L0(t, e, n = {}) {
  const r = !!n.list;
  let s = null, i = "", o = !1;
  const a = document.documentElement, c = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Set();
  function f(b) {
    var O, T, it;
    if (!b || !Number.isSafeInteger(b)) return "";
    const C = (it = (T = (O = e.radio()) == null ? void 0 : O.getState) == null ? void 0 : T.call(O)) == null ? void 0 : it.albumCover;
    return C != null && C.url && Number(C.tokenId) === b ? C.url : c.has(b) ? c.get(b) : (u.has(b) || (u.add(b), fetch("/inscription/" + b, { signal: AbortSignal.timeout(2e4) }).then(async (W) => {
      var k, U, ot, I;
      const Et = (W.headers.get("content-type") || "").toLowerCase();
      if (!W.ok)
        throw await ((k = W.body) == null ? void 0 : k.cancel()), new Error("no cover");
      return Et.startsWith("image/") ? (await ((U = W.body) == null ? void 0 : U.cancel()), "/inscription/" + b) : Et.includes("text/html") ? (((ot = (await W.text()).match(/<img[^>]+src="(data:image\/[^"]+)"/i)) == null ? void 0 : ot[1]) ?? "").replace(/&amp;/g, "&") : (await ((I = W.body) == null ? void 0 : I.cancel()), "");
    }).then((W) => {
      c.set(b, W), P();
    }).catch(() => {
      u.delete(b);
    })), "");
  }
  fw(() => P());
  function l(b) {
    var O;
    i = b, b ? a.dataset.sheet = b : delete a.dataset.sheet;
    const C = document.querySelector(".side");
    if (b && b !== "more") {
      for (const W of Nk[b]) {
        const Et = C == null ? void 0 : C.querySelector(W);
        Et && (Et.open = !0);
      }
      const T = document.getElementById("sheetTitle");
      T && (T.textContent = Mk[b]);
      const it = document.getElementById("sheetExtra");
      it && it.replaceChildren(...b === "music" ? [p()] : []), (O = C == null ? void 0 : C.scrollTo) == null || O.call(C, { top: 0 });
    }
    P();
  }
  const w = r ? null : document.getElementById("sheetClose");
  w && (w.onclick = () => l("")), r || document.addEventListener("keydown", (b) => {
    b.key === "Escape" && i && a.dataset.view === "album" && l("");
  });
  const p = () => rn(
    { class: "al-row", onClick: () => {
      l(""), e.openPlayer();
    } },
    Q("span", { class: "al-row-i", html: Ie.radio }),
    Q("span", { class: "al-row-t" }, Q("b", {}, "Xtrata Radio"), Q("small", {}, "Every song on-chain · FM, liked, all")),
    Q("span", { class: "al-row-go", html: Ie.right })
  );
  let m = null, S = !1;
  const M = () => {
    var C;
    const b = e.radio();
    S || !(b != null && b.subscribe) || (S = !0, b.subscribe((O) => {
      m = O, (s == null ? void 0 : s.mode) === "open" && P();
    }), m = ((C = b.getState) == null ? void 0 : C.call(b)) ?? null);
  };
  r || setInterval(() => {
    var T, it;
    if ((s == null ? void 0 : s.mode) !== "open" || !(m != null && m.playing)) return;
    const b = (it = (T = e.radio()) == null ? void 0 : T.getPosition) == null ? void 0 : it.call(T), C = t.querySelector(".al-bar > i"), O = t.querySelectorAll(".al-times span");
    !b || !C || (C.style.width = b.duration ? `${Math.min(100, b.current / b.duration * 100)}%` : "0%", O.length === 2 && (O[0].textContent = Ma(b.current || 0), O[1].textContent = b.duration ? Ma(b.duration) : "–:––"));
  }, 500);
  let R = "", z = null;
  function E(b, C, O = {}) {
    const T = O.song || f(b.cover), W = [T ? Q("img", { src: T, alt: O.song ? "Song artwork" : `${b.title} cover` }) : Q("div", { class: "al-cover-fallback" }, Q("b", {}, b.title), b.subtitle ? Q("span", {}, b.subtitle) : null), O.paused ? Q("span", { class: "al-paused" }, Q("i", { html: Ie.pause.replace(/width="\d+" height="\d+"/, 'width="14" height="14"') }), "Paused") : null], Et = "al-cover" + (C ? "" : " al-cover--small") + (O.paused ? " is-paused" : "");
    return O.flip ? (W.push(Q("span", { class: "al-flip", "aria-hidden": "true", html: Ie.flip })), rn({ class: Et + " is-flippable", "aria-label": O.flipped ? "Show this song’s artwork" : `Show the ${b.title} cover`, onClick: O.flip }, ...W)) : Q("div", { class: Et }, ...W);
  }
  function _(b) {
    return b.plays === null || b.plays === void 0 ? Q("span", { class: "al-chip al-chip--quiet" }, b.playsComing ? "Plays on their way…" : "…") : b.plays === 0 ? Q("span", { class: "al-chip al-chip--out" }, b.playsComing ? "Plays on their way…" : "No plays left") : Q("span", { class: "al-chip" + (b.plays <= Bk ? " al-chip--low" : "") }, `${Eo(b.plays, "play", "plays")} left`);
  }
  function N(b) {
    const C = b.player, O = C.tracks.filter((it) => !it.hidden), T = [];
    return b.mode === "arrive" && b.from && T.push(Q("p", { class: "al-from" }, Q("span", { html: Ie.gift }), Q("span", {}, Q("b", {}, b.from), " sent you an album"))), T.push(E(C, !0)), T.push(Q(
      "div",
      { class: "al-intro" },
      Q("h1", {}, C.title),
      C.subtitle ? Q("p", { class: "al-artist" }, C.subtitle) : null,
      O.length ? Q("p", { class: "al-songline" }, O.map((it) => it.title || `#${it.id}`).join(" · ")) : null,
      Q("span", { class: "al-chip" }, [Eo(O.length, "song", "songs"), b.offered ? Eo(b.offered, "play", "plays") : ""].filter(Boolean).join(" · "))
    )), b.status.length && T.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), T.push(Q("div", { class: "al-grow" })), b.asking ? T.push(Q("p", { class: "al-hint al-hint--ask" }, "Continue in the box below.")) : b.primary && T.push(rn({ class: "al-primary", onClick: b.primary.run, disabled: b.busy }, Q("span", { html: Ie.playSmall }), b.primary.label)), b.hint && !b.asking && T.push(Q("p", { class: "al-hint" }, b.hint)), b.secondary && !b.asking && T.push(rn({ class: "al-link", onClick: b.secondary.run, disabled: b.busy }, b.secondary.label)), T;
  }
  function J(b, C) {
    const { songs: O, current: T, started: it, own: W, out: Et, waiting: k } = C, U = b.player, ot = e.radio(), I = [];
    I.push(Q("div", { class: "al-listhead" }, Q("span", {}, Q("b", {}, U.title), ` · ${Eo(O.length, "song", "songs")}`), _(b)));
    const X = f(U.cover), wt = "album:" + U.cover;
    X && !un.has(wt) && (un.set(wt, X), Vf(X).then((At) => {
      At !== X && (un.set(wt, At), P());
    }));
    const oe = X ? un.get(wt) || X : "";
    return I.push(Q("ol", { class: "al-tracks" }, ...O.map((At, jt) => {
      const Ot = String(At.id) === T, Zt = hw(String(At.id), Ot && it ? W : void 0);
      return Q("li", {}, rn(
        { class: "al-track" + (Ot ? " is-on" : ""), "aria-label": `Play ${At.title || "#" + At.id}`, "aria-current": Ot ? "true" : void 0, disabled: Et || k, onClick: () => {
          var Ft;
          return (Ft = ot == null ? void 0 : ot.playToken) == null ? void 0 : Ft.call(ot, At.id);
        } },
        Q(
          "span",
          { class: "al-th" + (Zt ? "" : " is-blank") },
          Zt ? Q("img", { src: Zt, alt: "", decoding: "async" }) : oe ? Q("img", { src: oe, alt: "", decoding: "async" }) : null,
          Zt ? null : Q("span", { class: "al-n" }, String(jt + 1)),
          Ot ? Q("span", { class: "al-eq", html: Ie.eq }) : null
        ),
        Q("span", { class: "al-tt" }, At.title || `#${At.id}`)
      ));
    }))), I;
  }
  function et(b) {
    var Zt;
    const C = b.player, O = C.tracks.filter((Ft) => !Ft.hidden), T = e.radio(), it = m == null ? void 0 : m.nowPlaying, W = it && C.tracks.some((Ft) => String(Ft.id) === String(it.tokenId)) ? String(it.tokenId) : null, Et = W ? C.tracks.find((Ft) => String(Ft.id) === W) : null, k = b.plays === 0 && !b.playsComing, U = !!b.playsComing && !b.plays, ot = !!(m != null && m.playing) && !!W, I = m == null ? void 0 : m.heart, X = W ? (Zt = T == null ? void 0 : T.getPosition) == null ? void 0 : Zt.call(T) : null;
    W && (ot || ((X == null ? void 0 : X.current) ?? 0) > 0.5) && (R = C.id);
    const wt = !!W && R === C.id;
    z && z !== W && (z = null);
    const oe = wt ? String((it == null ? void 0 : it.cover) || "") : "", At = !!oe && z === W, Ot = [E(C, !k, { song: At ? "" : oe, paused: wt && !ot, flip: oe ? () => {
      z = z === W ? null : W, P();
    } : void 0, flipped: At })];
    if (Ot.push(Q(
      "div",
      { class: "al-now" },
      Q(
        "div",
        { class: "al-now-t" },
        Q("div", { class: "al-song" }, Et ? Et.title || (it == null ? void 0 : it.title) || `#${Et.id}` : C.title),
        Q("div", { class: "al-artist" }, Et ? Et.artist || (it == null ? void 0 : it.artist) || C.subtitle : C.subtitle || "Press play")
      ),
      W ? rn({ class: "al-icon" + (I != null && I.liked ? " is-on" : ""), "aria-label": I != null && I.liked ? "Unlike this song" : "Like this song", "aria-pressed": String(!!(I != null && I.liked)), disabled: !!(I != null && I.pending) || !!(I != null && I.locked) || U, onClick: () => {
        var Ft;
        return (Ft = T == null ? void 0 : T.toggleLike) == null ? void 0 : Ft.call(T);
      }, html: I != null && I.liked ? Ie.heartOn : Ie.heart }) : null
    )), k)
      Ot.push(Q(
        "div",
        { class: "al-out" },
        Q("p", { class: "al-out-k" }, "0 PLAYS LEFT"),
        Q("p", { class: "al-out-t" }, "You've played this album out"),
        Q("p", { class: "al-out-s" }, "Add plays to keep listening."),
        G(b, !0)
      ));
    else {
      const Ft = X != null && X.duration ? Math.min(100, X.current / X.duration * 100) : 0;
      Ot.push(Q(
        "div",
        { class: "al-prog" },
        Q("div", { class: "al-bar" }, Q("i", { style: `width: ${Ft}%` })),
        Q("div", { class: "al-times" }, Q("span", {}, Ma((X == null ? void 0 : X.current) || 0)), Q("span", {}, X != null && X.duration ? Ma(X.duration) : "–:––"))
      ));
    }
    return Ot.push(Q(
      "div",
      { class: "al-ctl" + (k || U ? " is-off" : "") },
      rn({ class: "al-icon al-icon--big", "aria-label": "Previous song", disabled: k || U, onClick: () => {
        var Ft;
        return (Ft = T == null ? void 0 : T.prev) == null ? void 0 : Ft.call(T);
      }, html: Ie.prev }),
      rn({ class: "al-play", "aria-label": ot ? "Pause" : "Play", disabled: k || U, onClick: () => {
        var Ft;
        return (Ft = T == null ? void 0 : T.playPause) == null ? void 0 : Ft.call(T);
      }, html: ot ? Ie.pause : Ie.play }),
      rn({ class: "al-icon al-icon--big", "aria-label": "Next song", disabled: k || U, onClick: () => {
        var Ft;
        return (Ft = T == null ? void 0 : T.next) == null ? void 0 : Ft.call(T);
      }, html: Ie.next })
    )), b.status.length && Ot.push(Q("div", { class: "al-status", role: "status" }, ...b.status)), Ot.push(...J(b, { songs: O, current: W, started: wt, own: oe, out: k, waiting: U })), Ot.push(Q("div", { class: "al-grow" })), Ot.push(rn(
      { class: "al-more", "aria-expanded": String(i === "more"), onClick: () => l(i === "more" ? "" : "more") },
      Q("span", {}, "More ", Q("span", { class: "al-mute" }, "· add plays, send, radio, settings")),
      Q("span", { html: Ie.down })
    )), Ot;
  }
  function G(b, C) {
    const O = Q("div", { class: "al-topups" + (C ? " al-topups--primary" : "") }), T = C ? [b.topUps[1] ?? b.topUps[0]] : [...b.topUps];
    for (const it of T) {
      const W = b.myPlays !== void 0 && b.myPlays >= it && !b.playsComing && !b.busy;
      O.append(rn({ class: "al-topup", disabled: !W, onClick: () => e.topUp(it) }, C ? `Add ${it.toLocaleString()} plays` : `+${it.toLocaleString()}`));
    }
    return C && O.append(rn({ class: "al-link", onClick: () => l("more") }, "Other amounts")), O;
  }
  function V(b) {
    const C = b.myPlays !== void 0 && b.myPlays >= (b.topUps[0] ?? 0), O = Q(
      "div",
      { class: "al-card" },
      Q("div", { class: "al-card-h" }, Q("b", {}, `Add plays to ${b.player.title}`), Q("span", { class: "al-mono" }, b.plays === null || b.plays === void 0 ? "" : `${b.plays.toLocaleString()} left`)),
      G(b, !1),
      Q("p", { class: "al-mute al-small" }, b.playsComing ? "Plays are on their way. Add more once they arrive." : b.myPlays === void 0 ? "Checking My player…" : C ? `Moved from My player · ${Eo(b.myPlays, "play", "plays")} there.` : "My player needs plays first."),
      !C && !b.playsComing && b.myPlays !== void 0 ? rn({ class: "al-link", onClick: () => {
        l(""), e.openPlayer();
      } }, "Open My player") : null
    ), T = (W, Et, k, U) => rn(
      { class: "al-row", onClick: U },
      Q("span", { class: "al-row-i", html: W }),
      Q("span", { class: "al-row-t" }, Q("b", {}, Et), Q("small", {}, k)),
      Q("span", { class: "al-row-go", html: Ie.right })
    ), it = Q(
      "div",
      { class: "al-how" + (o ? " is-open" : "") },
      T(Ie.info, "How plays work", "Every play counts for the song’s owner", () => {
        o = !o, P();
      }),
      o ? Q("p", { class: "al-mute al-small" }, "A song counts as a play once you have heard 30 seconds of it, and that play goes to whoever owns the song, recorded on-chain for good. Skipping is free. When the plays run out the album waits for more: it never plays for free.") : null
    );
    return Q(
      "div",
      { class: "al-sheet", role: "dialog", "aria-label": "More" },
      Q("div", { class: "al-sheet-h" }, Q("b", {}, "More"), rn({ class: "al-icon", "aria-label": "Close", onClick: () => l(""), html: Ie.close })),
      b.mode === "open" ? O : null,
      Q(
        "div",
        { class: "al-rows" },
        T(Ie.grid, "My music", "Your albums and the radio", () => l("music")),
        T(Ie.radio, "Xtrata Radio", "FM · Liked · every song", () => {
          l(""), e.openPlayer();
        }),
        b.canMake ? T(Ie.gift, "Albums (admin)", "Make an album and fund copies", () => l("gifts")) : null,
        T(Ie.device, "This device", "Backup, history, Stacks wallet, returns", () => l("device")),
        it
      )
    );
  }
  function $(b) {
    var k, U;
    const C = b.player, O = m == null ? void 0 : m.nowPlaying, T = O && C.tracks.some((ot) => String(ot.id) === String(O.tokenId)) ? String(O.tokenId) : null, it = !!(m != null && m.playing) && !!T, W = T ? (U = (k = e.radio()) == null ? void 0 : k.getPosition) == null ? void 0 : U.call(k) : null;
    T && (it || ((W == null ? void 0 : W.current) ?? 0) > 0.5) && (R = C.id);
    const Et = !!T && R === C.id;
    return J(b, {
      songs: C.tracks.filter((ot) => !ot.hidden),
      current: T,
      started: Et,
      own: Et ? String((O == null ? void 0 : O.cover) || "") : "",
      out: b.plays === 0 && !b.playsComing,
      waiting: !!b.playsComing && !b.plays
    });
  }
  function P() {
    const b = s;
    if (r) {
      if (!b || b.mode !== "open") {
        t.hidden = !0, t.replaceChildren(), delete a.dataset.albumlist;
        return;
      }
      M(), t.hidden = !1, a.dataset.albumlist = "1", t.replaceChildren(...$(b));
      return;
    }
    if (!b) {
      t.hidden = !0, t.replaceChildren();
      return;
    }
    M(), t.hidden = !1;
    const C = Q(
      "header",
      { class: "al-top" },
      Q("a", { class: "al-brand", href: "/radio" }, "Xtrata ", Q("b", {}, "Music")),
      b.mode === "open" ? rn({ class: "al-icon", "aria-label": "My music", onClick: () => l("music"), html: Ie.grid }) : null
    ), O = Q("div", { class: "al-body al-body--" + b.mode }, ...b.mode === "open" ? et(b) : N(b));
    t.replaceChildren(C, O, ...i === "more" ? [Q("div", { class: "al-scrim", onClick: () => l("") }), V(b)] : []);
  }
  return {
    render(b) {
      if (r) {
        s = b, P();
        return;
      }
      const C = !!s;
      s = b, !b && (C || i) && (i = "", delete a.dataset.sheet), b ? a.dataset.view = "album" : delete a.dataset.view, b != null && b.asking ? a.dataset.asking = "1" : delete a.dataset.asking, P();
    },
    sheet: () => i,
    setSheet: l
  };
}
const Pk = [
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
function _k(t) {
  for (const [e, n] of Pk) if (n.test(t)) return e;
  return null;
}
const pw = (t) => /iP(hone|ad|od)/.test(t) || /Macintosh/.test(t) && /Mobile\//.test(t), gw = (t) => /Android/.test(t);
function Uk(t, e) {
  const n = new URL(t);
  return n.protocol !== "https:" ? null : pw(e) ? "x-safari-" + n.href : gw(e) ? `intent://${n.host}${n.pathname}${n.search}${n.hash}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(n.href)};end` : null;
}
const Hk = (t) => pw(t) ? "Safari" : gw(t) ? "Chrome" : "your browser", Ti = "Xtrata Music Wallet", Ok = /* @__PURE__ */ new Set(["fund", "over", "ready", "link", "wrong-wallet"]);
function C0(t, e = (n) => n) {
  var i, o, a;
  if (t.mainConnected ?? !!t.main) return [];
  if (t.step === "off" || t.step === "elsewhere") return [];
  if (t.gate && (t.gate.enabled === !1 || t.gate.here === !1)) return [];
  if (t.step === "unsupported")
    return ((i = t.gate) == null ? void 0 : i.passkeyOnly) || t.linked || ((o = t.others) == null ? void 0 : o.length) ? [{ action: null, label: Ti, detail: "This browser can't use one. Open the page in Safari or Chrome.", disabled: !0 }] : [];
  const r = [], s = [...new Set([t.standIn, t.linked, ...t.others ?? []].filter((c) => !!c))];
  for (const c of s) {
    const u = t.standIn === c && Ok.has(t.step);
    r.push({
      action: "linked",
      main: c,
      label: `${Ti} · ${e(c)}`,
      detail: u ? "Open on this device." : `Face ID or your fingerprint. Plays and likes count for ${e(c)}.`
    });
  }
  if ((a = t.gate) != null && a.passkeyOnly && t.solo)
    switch (t.step) {
      case "intro":
        r.push({ action: "create", label: Ti, detail: "Make one with Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "locked":
        r.push({ action: "unlock", label: Ti, detail: "Open the one on this device with Face ID or your fingerprint." });
        break;
      case "loading":
        r.push({ action: "show", label: Ti, detail: "Face ID or your fingerprint. No app or seed phrase." });
        break;
      case "connect":
      case "not-invited":
        break;
      default:
        r.push({ action: "show", label: Ti, detail: "Open on this device." });
    }
  return r;
}
const T0 = document.getElementById("ppp");
T0 && Dk(T0);
function Dk(t) {
  var Ms;
  const e = document.documentElement.dataset.radioPaidOnly === "true", n = document.getElementById("paidRadioStatus"), r = jw(), s = (d) => t.querySelector(d), i = s(".ppp-frame");
  let o = null;
  const a = async (d, x) => {
    const v = await fetch(d, { cache: "no-store", ...x, signal: AbortSignal.timeout(15e3) }), h = await v.json().catch(() => ({}));
    if (!v.ok) throw new Error((h == null ? void 0 : h.error) || `Request failed (${v.status}).`);
    return h;
  }, c = y6({
    now: Date.now,
    main: () => {
      const d = r.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    config: (d) => a("/radio/listening-wallet/config?main=" + encodeURIComponent(d || "")),
    links: async (d) => (await a("/radio/listening-wallet/link?main=" + encodeURIComponent(d))).links ?? [],
    mainOf: async (d) => {
      var v;
      const x = (await a("/radio/listening-wallet/link?listening=" + encodeURIComponent(d))).links;
      return ((v = x == null ? void 0 : x.find((h) => h.listening === d)) == null ? void 0 : v.main) ?? null;
    },
    saveLink: async (d) => {
      await a("/radio/listening-wallet/link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    },
    bridge: async (d) => {
      o = document.createElement("iframe"), o.title = "Xtrata listening wallet", o.setAttribute("allow", `publickey-credentials-get ${d}; publickey-credentials-create ${d}`), o.referrerPolicy = "no-referrer";
      const x = new Promise((ut, $t) => {
        o.addEventListener("load", () => ut(), { once: !0 }), setTimeout(() => $t(new Error("The listening wallet did not load.")), 15e3);
      });
      o.src = d + "/", i.replaceChildren(o), await x;
      const v = new Mw({ walletOrigin: d, frame: o, timeoutMs: 30 * 6e4 }), h = /* @__PURE__ */ new Set(["listening.unlock", "listening.link", "listening.approveSession", "listening.prepareReturn"]), tt = (ut, $t) => h.has(ut) ? v.request(ut, $t) : Promise.race([
        v.request(ut, $t),
        new Promise((de, Ae) => setTimeout(() => Ae(new Error("The listening wallet is not answering.")), 1e4))
      ]);
      return await tt("listening.status"), { request: tt };
    },
    chain: {
      verify: X5,
      balance: Z5,
      account: Y5,
      owner: Q5,
      broadcast: J5,
      transaction: t6,
      confirmedNonce: async (d) => {
        const x = await vs(`/v2/accounts/${d}?proof=0`);
        if (!Number.isSafeInteger(x == null ? void 0 : x.nonce) || x.nonce < 0) throw new Error("Malformed account data.");
        return BigInt(x.nonce);
      }
    },
    signWithMain: (d, x) => c0({ ...x, network: "mainnet", stxAddress: d }),
    deposit: (d, x, v) => new Promise((h, tt) => r0({
      recipient: x,
      amount: v.toString(),
      memo: "Xtrata listening wallet",
      stxAddress: d,
      network: new Il(),
      appDetails: { name: "Xtrata Radio · pay-per-play", icon: "/favicon.svg" },
      onFinish: (ut) => h(ut.txId || ""),
      onCancel: () => tt(new Error("Deposit cancelled. Nothing was sent.")),
      onError: tt
    })),
    validate: e6,
    tabLock: (d) => new Promise((x) => {
      const v = navigator.locks;
      if (!(v != null && v.request)) {
        x(!0);
        return;
      }
      v.request("xtrata-ppp:" + d, { ifAvailable: !0 }, async (h) => {
        x(!!h), h && await new Promise(() => {
        });
      });
    }),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, x) => {
        try {
          localStorage.setItem(d, x);
        } catch {
        }
      }
    },
    changed: () => tn(c.snapshot()),
    // A gifted wallet returns to whoever paid for the gift (the gift record), else to its first funder.
    funder: (d) => {
      var x, v;
      return u.funder(d, () => a6(d, vs), !!((v = (x = c.snapshot().gate) == null ? void 0 : x.gifts) != null && v.enabled));
    },
    // Was this wallet gifted, and with which album? A failed request throws: it is never read as "not a gift".
    giftInfo: async (d) => {
      const x = await a("/radio/gift/for?wallet=" + encodeURIComponent(d)), v = x == null ? void 0 : x.gift;
      if (!v) return null;
      if (typeof v.returnTo != "string" || typeof v.treasury != "string") throw new Error("Unreadable gift record.");
      return { returnTo: v.returnTo, from: typeof v.from == "string" ? v.from : null, source: String(v.source ?? ""), amount: String(v.amount ?? "0"), treasury: v.treasury, state: v.state === "sending" ? "sending" : "arrived", player: v.player ?? null };
    },
    history: (d, x) => u6(d, (v) => vs(v), x),
    likesChanged: () => {
      var d, x;
      (x = (d = window.XtrataRadio) == null ? void 0 : d.refreshLikes) == null || x.call(d);
    },
    likeState: async (d, x) => {
      const v = await a("/radio/chain-likes?" + new URLSearchParams({ wallet: d, ids: String(x) })), h = Array.isArray(v == null ? void 0 : v.rows) ? v.rows.find((tt) => (tt == null ? void 0 : tt.id) === x) : null;
      if (!h || typeof h.liked != "boolean") throw new Error("Like state unavailable.");
      return { liked: h.liked, by: Array.isArray(h.by) ? h.by.filter((tt) => typeof tt == "string") : h.liked ? [d] : [] };
    },
    likeSent: (d, x) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-sent", { detail: { song: d, liked: x } })),
    nameOf: (d) => Zt(d) ?? void 0,
    likeConfirmed: (d, x) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-confirmed", { detail: { song: d, liked: x } })),
    likeFailed: (d) => window.dispatchEvent(new CustomEvent("xtrata:radio-like-failed", { detail: { song: d } }))
  }), u = xk({
    json: a,
    main: () => {
      const d = r.load();
      return d.isConnected && d.network === "mainnet" ? d.address : void 0;
    },
    pay: (d, x, v, h) => new Promise((tt, ut) => r0({
      recipient: x,
      amount: v.toString(),
      memo: h,
      stxAddress: d,
      network: new Il(),
      appDetails: { name: "Xtrata Radio · gift", icon: "/favicon.svg" },
      onFinish: ($t) => tt($t.txId || ""),
      onCancel: () => ut(new Error("Gift cancelled. Nothing was sent.")),
      onError: ut
    })),
    sign: (d, x) => c0({ ...x, network: "mainnet", stxAddress: d }),
    giftSent: (d, x) => c.giftSent(d, x),
    claiming: (d) => c.giftClaiming(d),
    album: { bind: (d) => c.bindAlbum(d), arrived: async (d, x, v, h) => {
      f.invalidate(), await c.albumArriving(d, x, v, h);
    } },
    who: (d) => vt(d),
    changed: () => tn(c.snapshot()),
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, x) => {
        try {
          x === null ? localStorage.removeItem(d) : localStorage.setItem(d, x);
        } catch {
        }
      }
    },
    now: Date.now
  }), f = Tk({
    json: a,
    open: (d) => {
      c.openAlbum(d);
    },
    store: {
      get: (d) => {
        try {
          return localStorage.getItem(d);
        } catch {
          return null;
        }
      },
      set: (d, x) => {
        try {
          x === null ? localStorage.removeItem(d) : localStorage.setItem(d, x);
        } catch {
        }
      }
    },
    now: Date.now,
    changed: () => tn(c.snapshot())
  }), l = (() => {
    try {
      return /[?&]albumpage=1\b/.test(location.search) || localStorage.getItem("xtrata.radio.albumpage") === "1";
    } catch {
      return !1;
    }
  })(), w = l ? document.getElementById("album") : null, p = {
    radio: () => window.XtrataRadio ?? null,
    topUp: (d) => void c.topUpAlbum(d),
    openPlayer: () => void c.openAlbum(0)
  }, m = w ? L0(w, p) : null, S = document.getElementById("albumList"), M = S ? L0(S, p, { list: !0 }) : null, R = "xtrata.radio.album.last.v1", z = () => {
    try {
      const d = JSON.parse(localStorage.getItem(R) || "null");
      return d && typeof d.root == "string" && Number.isSafeInteger(d.slot) && d.slot > 0 && d.player && Array.isArray(d.player.tracks) ? d : null;
    } catch {
      return null;
    }
  };
  let E = "";
  const _ = (d) => {
    const x = JSON.stringify(d);
    if (x !== E) {
      E = x;
      try {
        localStorage.setItem(R, x);
      } catch {
      }
    }
  };
  let N = null;
  window.XtrataRadioLikeHandler = (d) => {
    var v;
    if (!d || !Number.isSafeInteger(d.song) || d.song < 0) return !1;
    (v = c.snapshot().likeFunds) != null && v.album && (C = !0), We();
    const x = Se(d.song, { title: d.title, artist: d.artist });
    return c.heart({ song: d.song, title: x.title || void 0, artist: x.artist || void 0, likedBy: Array.isArray(d.likedBy) ? d.likedBy : void 0 });
  };
  let J;
  window.XtrataRadioListeningIdentity = () => {
    const d = c.snapshot();
    return d.solo && d.step !== "off" && d.step !== "elsewhere" ? d.listening : void 0;
  };
  const et = (d) => {
    var v, h;
    const x = window.XtrataRadioListeningIdentity();
    x !== J && (J = x, (h = (v = window.XtrataRadio) == null ? void 0 : v.refreshLikes) == null || h.call(v));
  };
  let G = "", V, $ = !1, P = !1;
  const b = (d, x) => {
    var yn, Fe, It, Ge, wn, ir, bn, Ye;
    const v = window.XtrataRadio;
    if (!(v != null && v.setGiftPlayer) || !(v != null && v.setGiftStop)) return;
    const h = x.depositPending && d.step === "fund" && ((yn = d.giftStop) == null ? void 0 : yn.reason) === "out" ? { reason: "arriving", text: "YOUR PLAYS ARE ARRIVING" } : d.giftStop, tt = (h == null ? void 0 : h.text) ?? (e && (!((Fe = d.gate) != null && Fe.here) || d.step === "off") ? "PAID RADIO IS UNAVAILABLE" : null);
    tt && tt !== V && (v.setGiftStop(tt), V = tt);
    const ut = d.step === "off" || d.step === "elsewhere" ? null : ((It = d.gift) == null ? void 0 : It.player) ?? null, $t = ut ? ut.id + ":" + ut.cover + ":" + ut.tracks.map((mn) => mn.id).join(",") : "";
    $t !== G && (v.setGiftPlayer(ut ? { id: ut.id, title: ut.title, subtitle: ut.subtitle, tracks: Di(ut).map((mn) => mn.id), hidden: ((Ge = yk(ut)) == null ? void 0 : Ge.id) ?? null, cover: ut.cover } : null), G = $t), tt !== V && (v.setGiftStop(tt), V = tt);
    const de = (h == null ? void 0 : h.reason) === "arriving";
    de !== P && ((wn = v.setGiftWait) == null || wn.call(v, de), P = de);
    const Ae = !!ut && !!((ir = d.albumLock) != null && ir.locked);
    Ae !== $ && ((bn = v.setGiftLock) == null || bn.call(v, Ae), $ = Ae), ["locked", "intro", "wrong-wallet", "unsupported", "connect", "not-invited", "off", "elsewhere"].includes(d.step) && ((Ye = v.forgetWallets) == null || Ye.call(v));
  };
  let C = !1;
  const O = /* @__PURE__ */ new Map(), T = (d) => {
    if (!(d.step === "fund" && !d.depositPending && !!d.gift && !!d.listening && d.balance === 0n && !d.entries.some((h) => h.kind === "play") && (d.brandNew || d.createdHere))) return null;
    let v = O.get(d.listening);
    return v === void 0 && (v = Date.now(), O.set(d.listening, v)), Date.now() - v < gc ? v : null;
  }, it = (d) => d.step === "fund" && !d.depositPending && !!d.gift && d.balance === 0n && !d.entries.some((x) => x.kind === "play") && !!d.listening && O.has(d.listening), W = (d) => d ? d.slice(0, 6) + "…" + d.slice(-4) : "", Et = (d) => {
    const x = c.snapshot().playCost || 350n;
    return d > ze ? Number((d - ze) / x) : 0;
  }, k = (d) => (Number(d) / 1e6).toFixed(d < 1000n ? 6 : 4), U = (d) => {
    const x = Math.round((Date.now() - d) / 6e4);
    return x < 1 ? "now" : x < 60 ? `${x}m` : x < 1440 ? `${Math.round(x / 60)}h` : `${Math.round(x / 1440)}d`;
  }, ot = (d) => `https://explorer.hiro.so/txid/${d}?chain=mainnet`, I = (d, x = "", v = "") => {
    const h = document.createElement(d);
    return x && (h.textContent = x), v && (h.className = v), h;
  }, X = (d, x, v = "") => {
    const h = I("button", d, v);
    return h.type = "button", h.onclick = x, h;
  }, wt = (d, x) => {
    const v = I("a", d);
    return v.href = x, v.target = "_blank", v.rel = "noopener", v;
  };
  let oe = null, At = location.hash === "#give";
  At && history.replaceState(null, "", location.pathname + location.search);
  let jt = !1;
  const Ot = J6((d) => Q6({ address: d, network: "mainnet" }), () => tn(c.snapshot())), Zt = (d) => Ot.get(d), Ft = _k(navigator.userAgent), Kt = (d, x) => {
    const v = navigator.userAgent, h = Hk(v), tt = `${location.origin}${location.pathname}${x ? `#gift=${x}` : ""}`, ut = [I("p", `You are in ${d}'s built-in browser, where passkeys often do not work. Open this page in ${h} to make your listening wallet${x ? " and claim your gift" : ""}.`, "ppp-warn")], $t = I("div", "", "ppp-open-row"), de = Uk(tt, v);
    if (de) {
      const Ae = I("a", `Open in ${h}`, "primary ppp-open-in");
      Ae.href = de, Ae.dataset.homeAction = "radio:open-in-browser", $t.append(Ae);
    }
    return $t.append(Ui("copy-page-link", "Copy link", () => tt, de ? "" : "primary", () => tn(c.snapshot()))), ut.push($t, I("p", `If that does not open ${h}, use ${d}'s menu (••• or ⋮) and choose "Open in ${h === "your browser" ? "browser" : h}", or paste the copied link there.`, "ppp-mute")), ut;
  }, vt = (d) => Zt(d) ?? W(d), se = (d) => d.slice(0, 2).map(vt).join(" and ") + (d.length > 2 ? ` and ${d.length - 2} more` : ""), qe = /* @__PURE__ */ new Map();
  let Re = !1;
  const Ue = (d) => !d || /^(?:Inscription )?#\d+$/.test(d.trim()), We = () => {
    Re || (Re = !0, fetch("/radio/counts?range=all&chainLikes=0", { cache: "no-store", signal: AbortSignal.timeout(2e4) }).then((d) => d.ok ? d.json() : null).then((d) => {
      for (const x of Array.isArray(d == null ? void 0 : d.tracks) ? d.tracks : []) {
        const v = Number(x == null ? void 0 : x.id);
        Number.isSafeInteger(v) && qe.set(v, { title: typeof x.title == "string" ? x.title : void 0, artist: typeof x.artist == "string" ? x.artist : void 0 });
      }
      tn(c.snapshot());
    }).catch(() => {
      Re = !1;
    }));
  }, Se = (d, x) => {
    const v = qe.get(d), h = ek(d, [v == null ? void 0 : v.title, x == null ? void 0 : x.title].find((ut) => !Ue(ut)) || ""), tt = tk(d, (v == null ? void 0 : v.artist) || (x == null ? void 0 : x.artist) || "");
    return { title: h, artist: tt };
  }, Be = (d) => {
    const { title: x, artist: v } = Se(d.song, d);
    return x ? `“${x}”${v ? ` — ${v}` : ""}` : `Song #${d.song}${v ? ` — ${v}` : ""}`;
  }, ye = { confirmed: "ppp-ok", pending: "ppp-warn", signed: "ppp-warn", unknown: "ppp-warn", prepared: "ppp-warn", failed: "ppp-bad", cancelled: "ppp-mute" }, ae = { confirmed: "confirmed", pending: "confirming", signed: "sending", unknown: "checking", prepared: "preparing", failed: "failed", cancelled: "cancelled" };
  function sr(d) {
    return ["elsewhere", "connect", "not-invited", "unsupported", "loading"].includes(d.step) ? ["", ""] : d.step === "wrong-wallet" ? ["WRONG WALLET", "warn"] : d.step === "over" ? ["TOO MUCH", "bad"] : d.step === "locked" ? ["LOCKED", "mute"] : d.step === "intro" || d.step === "link" ? ["", ""] : d.step === "fund" ? d.depositPending ? ["ON ITS WAY", "warn"] : d.entries.length ? ["NO PLAYS", "bad"] : ["ADD PLAYS", "warn"] : d.payingOn && d.session && d.session.playsLeft > 0 ? ["ON", "ok"] : ["OFF", "mute"];
  }
  function He(d, x, v = "", h) {
    const tt = I("dt", d), ut = I("dd", x, v);
    return h && ut.append(" ", h), [tt, ut];
  }
  const ue = document.getElementById("ppp-top"), we = () => {
    (i.hidden || i.classList.contains("ppp-frame--rest") ? t : i).scrollIntoView({ behavior: "smooth", block: "center" }), t.classList.remove("ppp-flash"), t.offsetWidth, t.classList.add("ppp-flash");
  }, A = () => {
    var x;
    const d = window.XtrataRadioConnectStacks;
    d ? d() : (x = document.getElementById("radio-wallet-connect")) == null || x.click();
  }, D = () => {
    var x, v;
    const d = c.snapshot();
    if (d.step === "connect" || d.step === "wrong-wallet") {
      A();
      return;
    }
    if (d.step === "elsewhere" && ((x = d.gate) != null && x.radioUrl)) {
      location.href = d.gate.radioUrl;
      return;
    }
    d.step === "locked" && !d.armed && !d.busy && c.unlock(), d.step === "ready" && ((v = d.giftStop) == null ? void 0 : v.reason) === "off" && !d.busy && c.switchOn(), we();
  };
  ue && (ue.onclick = D);
  const F = (d, x, v, h = "") => d.standIn && !d.mainConnected ? X(`Connect ${vt(d.standIn)} to add STX`, A, h) : X(x, v, h), K = (d) => {
    c.useLinked(d).then(() => we());
  };
  let dt = null;
  const lt = () => {
    const d = C0(c.snapshot(), vt);
    return d.length ? dt || (dt = new Promise((x) => {
      var Fe;
      const v = I("dialog", "", "ppp-connect");
      v.setAttribute("aria-labelledby", "ppp-connect-title");
      let h = null;
      const tt = (It) => {
        h = It, v.close();
      };
      v.addEventListener("close", () => {
        v.remove(), dt = null, x(h);
      }), v.addEventListener("click", (It) => {
        It.target === v && tt(null);
      });
      const ut = (It, Ge, wn, ir, bn = !1) => {
        const Ye = I("button", "", "ppp-connect__opt " + wn);
        return Ye.type = "button", Ye.disabled = bn, Ye.onclick = ir, Ye.append(I("b", It), I("span", Ge)), Ye;
      }, $t = I("h2", "Connect", "ppp-connect__title");
      $t.id = "ppp-connect-title";
      const de = d.map((It) => ut(It.label, It.detail, "is-music", () => {
        if (tt("music"), It.action === "linked" && It.main) {
          K(It.main);
          return;
        }
        const Ge = C0(c.snapshot(), vt).find((wn) => wn.action !== "linked");
        (Ge == null ? void 0 : Ge.action) === "create" ? c.create() : (Ge == null ? void 0 : Ge.action) === "unlock" && c.unlock(), we();
      }, !!It.disabled)), Ae = ut("Xverse or Leather", "A Stacks wallet you already have.", "is-stacks", () => tt("stacks")), yn = X("Cancel", () => tt(null), "quiet ppp-connect__cancel");
      v.append($t, ...de, Ae, yn), document.body.appendChild(v), v.showModal(), (Fe = de.find((It) => !It.disabled)) == null || Fe.focus();
    }), dt) : Promise.resolve("stacks");
  };
  window.XtrataRadioConnectChooser = lt;
  function ee(d) {
    if (!ue) return;
    const x = (h, tt, ut) => {
      ue.hidden = !1, ue.className = "ppp-top" + (tt ? " is-" + tt : ""), ue.replaceChildren(I("span", "", "dot"), document.createTextNode(h)), ue.title = ut;
    }, v = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0;
    switch (d.step) {
      case "off":
      case "not-invited":
      case "unsupported":
        ue.hidden = !0;
        return;
      case "elsewhere":
        return x("Xtrata Music", "quiet", "Open Xtrata Music");
      case "connect":
        ue.hidden = !0;
        return;
      case "intro":
        return x("Set up your player", "", "Create a passkey listening wallet");
      case "wrong-wallet":
        return x(`Connect ${vt(d.linked)}`, "warn", `This device's listening wallet belongs to ${vt(d.linked)}. Connect that wallet to pay artists or like songs.`);
      case "locked":
        return x("Unlock", "", "One tap with your face or fingerprint");
      case "link":
        return x("Finish setup", "warn", "Link the listening wallet to your main wallet");
      case "fund":
        return d.depositPending ? x("Plays on their way", "quiet", "Plays start by themselves when they land") : x(d.entries.some((h) => h.kind === "play") ? "No plays left · add plays" : "Add plays", "warn", "Add plays to keep listening");
      case "over":
        return x("Too much in your player", "warn", "Return the extra to keep counting plays");
      case "loading":
        return x("Xtrata Music", "quiet", "Checking your player");
      case "ready":
        return d.payingOn && v > 0 && !d.giftStop ? x(`${v.toLocaleString()} plays left`, "on", "Every play counts for the song’s owner") : x("Plays off · switch on", "off", "Plays are switched off");
    }
  }
  const Ct = document.getElementById("pppNudge"), Qt = document.getElementById("onair");
  (Ms = Ct == null ? void 0 : Ct.querySelector("button")) == null || Ms.addEventListener("click", () => D());
  const be = {
    connect: "Connect your wallet to listen",
    intro: "Set up your player to listen",
    locked: "Unlock your player to listen",
    "wrong-wallet": "Switch wallets to listen",
    link: "Finish setup to listen",
    fund: "No plays yet",
    over: "Return the excess to listen",
    ready: "Music support is paused"
  }, Ee = {
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
  function Oe(d) {
    if (d.step === "loading") return;
    const x = d.session ? Math.min(d.session.playsLeft, d.playsLeft) : 0, v = d.step === "ready" && d.payingOn && x > 0 && !d.giftStop, h = d.step === "fund" && d.depositPending, tt = d.step === "elsewhere" && !e, ut = v || h || tt ? "" : be[d.step] ?? "", $t = v ? "on" : tt ? "free" : ut ? "off" : "";
    $t ? document.documentElement.dataset.ppp = $t : delete document.documentElement.dataset.ppp, Qt && (Qt.hidden = !$t || $t === "free", Qt.querySelector(".onair-sub").textContent = v ? `${x.toLocaleString()} plays left` : "Plays off"), Ct && (Ct.hidden = $t !== "off" && $t !== "free", Ct.classList.toggle("is-free", $t === "free"), $t === "free" ? (Ct.querySelector(".nudge-t").textContent = "You’re on the free player", Ct.querySelector(".nudge-s").textContent = "This one doesn’t pay anyone. To join the new music economy, where every play pays the artist on-chain, get yourself an album player.", Ct.querySelector("button").textContent = "Get a player") : $t === "off" && (Ct.querySelector(".nudge-t").textContent = ut, Ct.querySelector(".nudge-s").textContent = "This radio requires a funded listening wallet with music support on.", Ct.querySelector("button").textContent = Ee[d.step] ?? "Start"));
  }
  let kt = "";
  function St(d) {
    const x = I("div", "", "ppp-pick");
    d.funderMultiple && d.returnToKind === "funder" && x.append(I("p", "More than one address has sent funds. Returns go to the first. Choose another below if that is not right.", "ppp-warn")), d.returnToKind === "funder" && x.append(I("p", "If the funds came from an exchange, choose your own address instead: exchanges often cannot take a refund.", "ppp-mute"));
    const v = I("input");
    v.type = "text", v.placeholder = "SP… address to send returns to", v.autocomplete = "off", v.spellcheck = !1, v.setAttribute("aria-label", "Address to return funds to"), v.value = kt, v.oninput = () => {
      kt = v.value;
    };
    const h = X(d.returnToKind === "chosen" ? "Change address" : "Use this address", () => {
      c.setReturnAddress(v.value), kt = "";
    }, "tiny");
    return x.append(v, " ", h), d.returnToKind === "chosen" && x.append(" ", X("Back to the funder", () => c.clearReturnAddress(), "tiny")), x;
  }
  const Xt = "Your plays and likes are listed under this listening address. To keep them under a wallet of your own, get Xverse or Leather (both free), connect it here, and link this listening wallet to it.";
  function Jt() {
    const d = I("p", Xt + " ", "ppp-mute");
    return d.append(wt("Xverse", "https://www.xverse.app/download"), " · ", wt("Leather", "https://leather.io/install-extension")), d;
  }
  let fe = "";
  const ce = (d) => {
    const x = document.documentElement, v = d.solo && !d.main ? d.listening ? W(d.listening) : "new" : "", h = S6() ? "1" : "", tt = d.standIn && !d.mainConnected ? vt(d.standIn) : "";
    `${v}|${h}|${tt}` !== fe && (fe = `${v}|${h}|${tt}`, v ? x.dataset.pppSolo = v : delete x.dataset.pppSolo, tt ? x.dataset.pppAs = tt : delete x.dataset.pppAs, h ? x.dataset.pppWalletInstalled = h : delete x.dataset.pppWalletInstalled, window.dispatchEvent(new Event("xtrata:ppp-header")));
  };
  for (const d of [1500, 4e3, 9e3]) setTimeout(() => tn(c.snapshot()), d);
  function kn(d, x = "") {
    const v = I("div", "", "ppp-topup"), h = $n(d);
    v.append(I("span", "Add plays from My player: ", "ppp-mute"));
    for (const tt of ja) {
      const ut = X(`+${tt.toLocaleString()}`, () => void c.topUpAlbum(tt), x);
      ut.disabled = h === void 0 || h < tt || d.depositPending || !!d.busy, v.append(ut);
    }
    return h !== void 0 && h < ja[0] && v.append(I("p", "My player needs plays first (switch to My player above).", "ppp-mute")), v;
  }
  const $n = (d) => {
    var h;
    const x = (h = d.likeFunds) == null ? void 0 : h.balance;
    if (x === void 0 || !d.playCost) return;
    const v = x - ze - 6000n;
    return v > 0n ? Number(v / d.playCost) : 0;
  };
  function Ls(d) {
    const x = d.likeFunds;
    if (!x || !x.album || !x.low && !x.pending) return [];
    if (x.low || (C = !1), x.low && !C) return [];
    const v = I("div", "", "ppp-pick ppp-lowbox");
    if (!x.low) {
      if (!x.txid) return [];
      const tt = I("p", "Top-up for liking songs is on its way. ", "ppp-warn");
      return x.txid && tt.append(wt("View", ot(x.txid))), v.append(tt), [v];
    }
    v.append(I("p", "♥ Liking songs needs a little STX", "ppp-warn ppp-lowtitle")), v.append(I("p", "Your album keeps playing as normal. Likes are signed by your main listener wallet, which is empty right now. 0.1 STX there is hundreds of likes, for all your albums.")), v.append(I("p", x.address, "ppp-addr-full"));
    const h = I("div", "", "ppp-open-row");
    if (h.append(Ui("copy-likes-address", "Copy address", () => x.address, "primary", () => tn(c.snapshot()))), x.main && !d.solo) {
      const tt = Gs - (x.balance ?? 0n);
      tt > 0n && h.append(F(d, `Pay ${pr(tt)} STX from my wallet`, () => void c.topUpLikes(), "primary"));
    }
    return v.append(h), v.append(I("p", "Send STX to that address from any Stacks wallet or an exchange. Likes carry on by themselves once it arrives.", "ppp-mute")), [v];
  }
  const Cs = (d) => {
    const x = I("div", "", "ppp-wait");
    x.dataset.since = String(d.since), x.dataset.grace = String(d.graceMs), x.setAttribute("role", "progressbar"), x.setAttribute("aria-label", "Your plays are arriving");
    const v = I("p", "", "ppp-wait-t"), h = I("div", "", "ppp-wait-track");
    return h.append(I("div", "", "ppp-wait-fill")), x.append(v, h), Ts(x), x;
  };
  function Ts(d) {
    const x = Number(d.dataset.since), v = Number(d.dataset.grace) || 6e4, h = Math.max(0, Date.now() - x), tt = d.querySelector(".ppp-wait-fill"), ut = d.querySelector(".ppp-wait-t");
    if (h < v) {
      const $t = Math.ceil((v - h) / 1e3);
      tt.style.width = Math.max(4, Math.min(95, h / v * 100)).toFixed(0) + "%", ut.textContent = `Your plays are arriving… usually about a minute · ${$t}s`, d.classList.remove("is-long"), d.setAttribute("aria-valuenow", String(Math.round(h / v * 100)));
    } else
      tt.style.width = "", ut.textContent = "Your plays are taking longer than usual to arrive. Still watching for them: keep this page open and it starts by itself.", d.classList.add("is-long"), d.removeAttribute("aria-valuenow");
  }
  let Bs = 0;
  setInterval(() => {
    const d = document.querySelectorAll(".ppp-wait");
    if (!d.length) {
      Bs = 0;
      return;
    }
    d.forEach(Ts), ++Bs % 10 === 0 && tn(c.snapshot());
  }, 1e3);
  let In = null;
  function Ln(d) {
    if (d.step === "loading" && In !== null) return;
    const v = ["intro", "locked", "link", "connect", "wrong-wallet", "unsupported"].includes(d.step) || !!d.busy || d.armed || !!u.pendingCode() && !["ready", "fund", "over"].includes(d.step);
    v !== In && (In = v, v ? document.documentElement.dataset.pppFirst = "1" : delete document.documentElement.dataset.pppFirst);
  }
  function tn(d) {
    var nt, mt, j, pt, gt, yt, _t, De, nn, Ke, ln, qr, Qo, Jo, ho;
    if (N && ["ready", "fund", "over"].includes(d.step) && !d.busy) {
      const Y = N;
      N = null, d.root === Y.root && d.slot !== Y.slot && c.openAlbum(Y.slot);
    }
    const x = u.inProgress(d), v = T(d), h = x && d.step === "fund" ? { ...d, depositPending: !0 } : v !== null ? { ...d, depositPending: !0, arrival: { since: v, graceMs: gc } } : d, tt = h.error === yc;
    if (et(), b(d, h), Ln(h), ce(h), !x && u.inProgress(d) || (ee(h), Oe(h), e && n && (n.hidden = !["off", "elsewhere", "loading"].includes(h.step), n.textContent = h.step === "loading" || !h.gate ? "Checking your listening wallet…" : "Paid radio is unavailable. Reload to check again."), t.hidden = h.step === "off", t.hidden)) return;
    const [ut, $t] = sr(h), de = s(".ppp-state");
    de.textContent = ut, de.className = "ppp-state" + ($t ? " ppp-state--" + $t : ""), de.hidden = !ut;
    const Ae = !!h.busy || h.armed, yn = !["elsewhere", "connect", "wrong-wallet", "not-invited", "unsupported", "off"].includes(h.step) && (Ae || !["intro", "loading"].includes(h.step));
    i.hidden = !yn, i.classList.toggle("ppp-frame--rest", !Ae && !jt);
    const Fe = s(".ppp-frame-label");
    Fe.hidden = !0;
    const It = w6(h) ?? oe;
    oe = It;
    const Ge = "xtrata.radio.ppp.heard.v1", wn = (() => {
      try {
        return localStorage.getItem(Ge) === "1";
      } catch {
        return !1;
      }
    })();
    if (!wn && h.entries.some((Y) => Y.kind === "play"))
      try {
        localStorage.setItem(Ge, "1");
      } catch {
      }
    const ir = wn || h.slot > 0 && ((((nt = h.likeFunds) == null ? void 0 : nt.balance) ?? 0n) > 0n || f.count() > 1), bn = m6({ ...h, heard: ir }, It);
    s(".ppp-badge").hidden = !bn;
    const Ye = s(".ppp-steps"), mn = s(".ppp-stage");
    Ye.hidden = mn.hidden = !bn, It && bn && (Ye.replaceChildren(...Bu(h.solo).map((Y, at) => {
      const ke = I("li", "", at < It.at ? "done" : at === It.at ? It.blocked ? "now blocked" : "now" : "");
      return ke.append(I("span", at < It.at ? "✓" : String(at + 1), "n"), Y), at === It.at && ke.setAttribute("aria-current", "step"), ke;
    })), mn.textContent = It.caption, mn.className = "ppp-stage " + (It.at >= Bu(h.solo).length ? "ppp-ok" : It.blocked ? "ppp-bad" : "ppp-cyan"));
    const Dn = s(".ppp-facts"), en = [];
    h.main && ((mt = h.gate) != null && mt.here) && !h.solo && en.push(...He("Your wallet", vt(h.main), "ppp-addr-short"));
    const or = () => {
      if (!h.listening) return;
      const Y = Ui("copy-listening", "Copy", () => h.listening || "", "tiny", () => tn(c.snapshot()));
      en.push(...He(h.slot > 0 ? "Album wallet" : h.linked ? "My player (technical)" : "My player wallet", W(h.listening), "ppp-addr-short", Y));
    };
    if (h.linked || or(), h.listening && h.step !== "intro")
      if (h.linked)
        en.push(...He("Credited to", `${vt(h.linked)} · plays, likes and returns`, h.linked === h.main || h.solo ? "ppp-ok" : "ppp-warn")), or();
      else if (h.solo) {
        h.creditedTo && en.push(...He("Credited to", `${vt(h.creditedTo)} · plays and likes`, "ppp-ok"));
        const Y = h.gift ? "to whoever it came from: the unused gift to the sender, your own top-ups to you" : h.returnTo ? `${vt(h.returnTo)} · ${h.returnToKind === "chosen" ? "chosen by you" : "sent the first funds"}` : h.funderState === "failed" ? "could not check who funded it right now" : "set when it is funded";
        en.push(...He("Returns go to", h.gift ? Y : h.returnTo && !Zt(h.returnTo) ? Y.replace(W(h.returnTo), h.returnTo) : Y, h.returnTo && !h.gift ? "ppp-addr-full" : "ppp-mute"));
      } else en.push(...He("Linked to", "not linked yet", "ppp-warn"));
    if (h.linkedListening.length && ((j = h.gate) != null && j.here)) {
      const Y = h.linkedListening.map((at) => W(at) + (at === h.listening ? " (this one)" : "")).join(", ");
      en.push(...He(h.linkedListening.length === 1 ? "Listening wallet linked to you" : "Listening wallets linked to you", Y, "ppp-addr-short"));
    }
    if (h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step)) {
      const Y = h.step === "fund" && h.depositPending ? "ppp-mute" : h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad";
      en.push(...He("Balance", `${pr(h.balance)} STX · about ${h.playsLeft.toLocaleString()} plays`, Y));
    }
    const ar = h.entries.find((Y) => Y.kind === "play");
    ar && We(), ar && en.push(...He("Last paid song", `${Be(ar)} → ${vt(ar.recipient)}`, ye[ar.status] || "")), Dn.replaceChildren(...en), Dn.hidden = !en.length;
    const bt = [], qt = [], le = [], Cn = [], Ei = Pn(BigInt(((pt = h.gate) == null ? void 0 : pt.limits.playFee) ?? "300")), Ir = `After 30 seconds of audible listening (half the length for songs under a minute), an eligible play sends ${pr(hc)} STX to the song holder, plus a ${pr(Ei - hc)} STX network fee.`, ve = !!h.busy;
    switch (h.step) {
      case "elsewhere": {
        if (bt.push(I("p", "Pay artists as you listen.")), (gt = h.gate) != null && gt.radioUrl) {
          const at = I("p");
          at.append(wt("Open the pay-per-play radio →", h.gate.radioUrl)), bt.push(at);
        }
        qt.push(I("p", "Pay-per-play has its own address, where nothing else on Xtrata can reach your listening wallet."));
        break;
      }
      case "connect":
        if (h.linked) {
          const at = [h.linked, ...h.others];
          bt.push(I("p", at.length > 1 ? `This device has listening wallets for ${se(at)}.` : `This device has a listening wallet for ${vt(h.linked)}.`)), qt.push(I("p", "Open it with your passkey, or connect a different Stacks wallet to set up a separate player.")), at.slice(0, 3).forEach((ke, Me) => le.push(X(`Open ${vt(ke)}`, () => K(ke), Me === 0 ? "primary" : "")));
        } else
          bt.push(I("p", "Connect your wallet to pay artists as you listen.")), qt.push(I("p", "Every payment is recorded on-chain."));
        break;
      case "wrong-wallet":
        bt.push(I("p", `This device's listening wallet belongs to ${vt(h.linked)}. Connect that wallet to pay artists or like songs.`, "ppp-warn")), qt.push(I("p", `You are connected as ${vt(h.main)}. Switch to the linked wallet to continue listening.`)), qt.push(I("p", "The listening wallet box is updating. Once it has, each wallet address gets its own listening wallet on this device.", "ppp-mute")), le.push(X("Switch wallet", A, "primary"));
        break;
      case "not-invited":
        bt.push(I("p", "Paid radio access is unavailable for this wallet.", "ppp-mute"));
        break;
      case "unsupported":
        bt.push(I("p", "Needs a passkey this browser cannot make. Try Chrome or Safari.", "ppp-warn"));
        break;
      case "intro":
        bt.push(I("p", "Every play counts for the song’s owner, on-chain.")), qt.push(I("p", Ir)), qt.push(I("p", "Once your wallet is funded and music support is on, eligible plays pay automatically.", "ppp-ok")), qt.push(I("p", h.solo ? "You get a small listening wallet made from a passkey on this device: no app or Stacks wallet needed, and no key stored anywhere. Keep no more than 1 STX in it. Anything left can be sent back to whoever funded it." : "You get a small listening wallet made from a passkey on this device: nothing to install, and no key stored anywhere. Keep no more than 1 STX in it. You can return everything to your main wallet at any time.", "ppp-warn")), !h.solo && h.main && h.others.length ? (bt.push(I("p", `This device already has a listening wallet for ${se(h.others)}. If you meant to use that one, switch to that wallet.`, "ppp-warn")), qt.push(I("p", `Otherwise, set up a new listening wallet for ${vt(h.main)} below. Each address keeps its own plays, likes and funds, like a playlist per profile.`))) : !h.solo && h.main && qt.push(I("p", `This is the listening wallet for ${vt(h.main)}. Each wallet address you connect gets its own on this device, so plays and likes stay separate, like a playlist per profile.`, "ppp-mute")), h.solo && qt.push(I("p", "Already have a Stacks wallet? Connect it first (top right) so your plays and likes count for it. No wallet? Carry on: you do not need one.", "ppp-mute"));
        const Y = u.liveGift();
        le.push(X(Y ? "Claim my gift · no wallet needed" : h.solo ? "Start listening · no wallet needed" : h.others.length && h.main ? `Set up for ${vt(h.main)}` : "Start listening", () => void c.create(), "primary")), !Y && !h.solo && h.main && h.others.length && le.push(X("Switch wallet", A)), !Y && h.solo && le.push(X("I have a Stacks wallet", A)), le.push(X("I already have a listening wallet", () => void c.unlock(!0))), Y && le.push(X("Not now", () => u.setAside(), "quiet"));
        break;
      case "locked":
        h.armed || (bt.push(I("p", "Locked.", "ppp-mute")), le.push(X("Unlock", () => void c.unlock(), "primary"))), h.standIn ? Cn.push(X("Use a different listening wallet", () => void lt().then((at) => {
          at === "stacks" && A();
        }), "quiet")) : Cn.push(X("Use a different listening wallet", () => void c.unlock(!0), "quiet"));
        break;
      case "link":
        bt.push(I("p", `Link to ${vt(h.main)} · free`)), qt.push(I("p", "Linking is a signature, not a transaction: no fee and no spending permission. Afterwards, funds can only be returned to this main wallet, and your likes and paid plays count for it.")), qt.push(I("p", "The listening wallet will show the full address. Check it is yours before confirming.", "ppp-warn")), le.push(X(h.serverLinked ? "Confirm my wallet" : "Link to my wallet", () => void c.link(), "primary"));
        break;
      case "loading":
        bt.push(I("p", "Checking the listening wallet balance…", "ppp-mute"));
        break;
      case "fund": {
        if (h.depositPending ? h.arrival && bt.push(Cs(h.arrival)) : it(h) ? bt.push(I("p", "Your plays have not arrived yet. Keep this page open: they start by themselves when they land. If nothing happens in a few minutes, open your album link again.", "ppp-bad")) : (yt = h.gift) != null && yt.player ? bt.push(I("p", "Out of plays · add more to keep listening", "ppp-bad")) : h.entries.length ? bt.push(I("p", "No plays left · add plays to keep counting", "ppp-bad")) : bt.push(I("p", `Add plays · 1 STX ≈ ${Math.floor(Number(1000000n / Ei)).toLocaleString()} plays`)), h.entries.length && qt.push(I("p", "Playback is paused until your top-up confirms.")), h.payingOn && !h.entries.length && qt.push(I("p", "Paying is switched on. Once funds arrive it starts with the next song you listen to for 30 seconds.", "ppp-ok")), x ? qt.push(I("p", "Your gift is on its way, so there is nothing to add. STX is only needed once these plays are used up.", "ppp-mute")) : h.depositPending ? qt.push(I("p", "Nothing to add: your plays are on their way. Add STX only once they are used up.", "ppp-mute")) : h.solo ? (qt.push(I("p", "Ask a friend, or send from an exchange or any Stacks wallet, to this address. About 1 STX is plenty. Whatever is left can be returned to whoever sent it.")), qt.push(I("p", h.listening || "", "ppp-addr-full")), h.listening && !h.depositPending && le.push(Ui("copy-address", "Copy my address", () => h.listening || "", "primary", () => tn(c.snapshot())))) : qt.push(I("p", "Or send STX from an exchange to the listening wallet address (Copy above).", "ppp-mute")), h.depositPending && h.depositTxid) {
          const at = I("p", "Funds on their way · paying starts by itself when they land. ", "ppp-warn");
          at.append(wt("View", ot(h.depositTxid))), bt.push(at);
        } else h.allowance > 0n && !h.solo && !h.depositPending && le.push(F(h, `Deposit ${pr(h.allowance)} STX from my wallet`, () => void c.deposit(), "primary"));
        break;
      }
      case "over":
        bt.push(I("p", "Over 1 STX · return the excess to keep paying", "ppp-bad")), h.solo && !h.returnTo && (bt.push(I("p", h.funderState === "failed" ? "Could not check who funded this wallet. Enter an address to send the excess to." : "Enter an address to send the excess to.")), bt.push(St(h))), (!h.solo || h.returnTo) && le.push(X("Return excess", () => void c.returnFunds("excess"), "primary"), X("Return all", () => void c.returnFunds("all")));
        break;
      case "ready":
        if (h.payingOn && h.session && h.session.playsLeft > 0 && ((_t = h.giftStop) == null ? void 0 : _t.reason) !== "off") {
          const at = Math.min(h.session.playsLeft, h.playsLeft);
          bt.push(I("p", `${at.toLocaleString()} plays left`, "ppp-ok")), qt.push(I("p", Ir + " The heart likes or unlikes from this wallet for 0.0002 STX.")), le.push(X("Switch off", () => void c.switchOff()));
        } else
          bt.push(I("p", "Switch on music support to listen.", "ppp-mute")), le.push(X("Switch plays on", () => void c.switchOn(), "primary"));
        h.queued && bt.push(I("p", h.queued === 1 ? "1 song waiting to be paid · sends as soon as the last transaction confirms" : `${h.queued} songs waiting to be paid · sent one at a time as each transaction confirms`, "ppp-warn")), h.balanceState === "low" && bt.push(I("p", "Running low on plays", "ppp-warn")), h.depositPending ? bt.push(I("p", "Plays on their way…", "ppp-warn")) : h.allowance > 0n && h.balanceState !== "ok" && !h.solo && le.push(F(h, `Top up ${pr(h.allowance)} STX`, () => void c.deposit()));
        break;
    }
    if (h.solo && h.walletCannotSolo && qt.push(I("p", "The listening wallet box is still updating. Paid plays work; returning to another address and likes start working once it has.", "ppp-warn")), h.solo && ["fund", "ready"].includes(h.step) && ((h.balance ?? 0n) > 0n && h.slot === 0 && qt.push(St(h)), qt.push(Jt()), h.slot === 0 && h.step === "ready" && h.entries.some((Y) => Y.kind === "play" && Y.status === "confirmed"))) {
      const Y = I("p", "New to Stacks? ", "ppp-mute");
      Y.append(wt("Get Xverse or Leather", "https://www.xverse.app/download"), " (free) to keep your plays and likes under a wallet of your own."), bt.push(Y);
    }
    if (h.walletOutdated && qt.push(I("p", "The listening wallet box is an older version, so likes go through your main wallet for now. Paid plays work as normal.", "ppp-warn")), h.stuck && (bt.push(I("p", h.stuck === 1 ? "1 payment has not appeared on-chain after 30 minutes." : `${h.stuck} payments have not appeared on-chain after 30 minutes.`, "ppp-warn")), le.push(X("Clear stuck payments", () => void c.clearStuck()))), ["ready", "fund"].includes(h.step) && (h.returnTo || h.gift) && (h.balance ?? 0n) > 0n && Cn.push(X(h.linked ? "Return all to my wallet" : h.gift ? "Return what is left…" : `Return all to ${vt(h.returnTo)}`, () => void c.returnFunds("all"), "quiet")), h.slot > 0 && ((De = h.gift) != null && De.player) && ["ready", "fund"].includes(h.step) && h.giftPlays > 20 && Cn.push(kn(h, "quiet")), ["ready", "fund", "link", "over"].includes(h.step) && Cn.push(X("Lock", () => void c.lock(), "quiet")), yn && !Ae && Cn.push(X(jt ? "Hide listening wallet box" : "Show listening wallet box", () => {
      jt = !jt, tn(c.snapshot());
    }, "quiet")), [...le, ...Cn].forEach((Y) => Y.disabled = ve), ve && (le.length = 0), h.balance !== void 0 && ["fund", "ready", "over"].includes(h.step) && !(h.step === "fund" && h.depositPending && h.balance === 0n) && !((nn = h.gift) != null && nn.player)) {
      const Y = h.balanceState === "ok" ? "ppp-ok" : h.balanceState === "low" ? "ppp-warn" : "ppp-bad", at = bt.at(0);
      h.step === "ready" && at ? at.append(I("span", ` · ${k(h.balance)} STX`, Y)) : bt.push(I("p", `Balance ${k(h.balance)} STX`, Y));
    }
    if ((Ke = h.gift) != null && Ke.player && ["fund", "ready", "over", "locked", "link", "loading"].includes(h.step)) {
      const Y = I("p", "", "ppp-gift");
      Y.append(`💿 Album · ${h.gift.player.title}`), h.gift.player.subtitle && Y.append(" · ", h.gift.player.subtitle);
      const at = ["ready", "fund", "over"].includes(h.step) && h.balance !== void 0 ? h.giftPlays === 0 && h.depositPending ? I("span", " · plays on their way", "ppp-warn") : I("span", h.giftPlays === 0 ? " · no plays left" : ` · ${h.giftPlays.toLocaleString()} ${h.giftPlays === 1 ? "play" : "plays"} left`, h.giftPlays === 0 ? "ppp-bad" : h.giftPlays <= 20 ? "ppp-warn" : "ppp-ok") : null;
      at && Y.append(at);
      const ke = (ln = bt.at(0)) == null ? void 0 : ln.querySelector(":scope > span.ppp-ok, :scope > span.ppp-warn, :scope > span.ppp-bad");
      if (h.step === "ready" && ke && /STX/.test(ke.textContent ?? "") && ke.remove(), bt.unshift(Y), h.giftPlays <= 20 && ["ready", "fund"].includes(h.step) && !h.depositPending)
        if (h.slot > 0)
          bt.splice(1, 0, I("p", h.giftPlays === 0 ? "This album is out of plays." : "Running low on plays for this album.", "ppp-mute"), kn(h, "primary"));
        else {
          const Me = I("p", h.giftPlays === 0 ? "Your gift plays are all used. " : "Running low. ", "ppp-mute");
          Me.append("To keep going, send STX to your listening address (shown below) from any Stacks wallet or an exchange. "), Me.append(wt("Xverse", "https://www.xverse.app/download"), " and ", wt("Leather", "https://leather.io/install-extension"), " are free and make it one tap."), bt.splice(1, 0, Me);
        }
    }
    if (h.gift && !h.linked && ["fund", "ready", "over"].includes(h.step) && h.returnPlan.state === "ready") {
      const Y = h.returnPlan, at = I("div", "", "ppp-pick");
      at.append(I("p", Y.steps.length > 1 ? "This goes back in parts, each to whoever it came from:" : "This goes back to whoever it came from:", "ppp-cyan"));
      const ke = I("ul", "", "ppp-gift-list");
      Y.steps.forEach((Me, po) => {
        const Ps = Me.kind === "gift" ? "the unused gift" : Me.kind === "deposit" ? "what was added to it" : "the rest", g = I("li");
        g.append(I("span", `${po + 1}. ${pr(BigInt(Me.send))} STX · ${Ps}`, "t"), I("span", Me.to ? ` → ${vt(Me.to)}` : " → choose an address below", Me.to ? "ppp-mute" : "ppp-warn")), ke.append(g);
      }), at.append(ke), Y.kept && at.append(I("p", "A very small part is not worth its network fee, so it stays in the wallet or travels with the last part.", "ppp-mute")), Y.steps.some((Me) => !Me.to) && at.append(St(h)), at.append(X(Y.steps.length > 1 ? `Confirm part 1 of ${Y.steps.length}` : "Confirm and return", () => void c.returnFunds("all"), "primary")), bt.push(at);
    }
    const Lr = fo(h), Gr = l ? Lr : null, Cr = u.banner(d, { bare: !!Gr }), Kr = Ft && (u.pendingCode() || ["intro", "locked", "unsupported"].includes(h.step)) ? Kt(Ft, u.pendingCode()) : [];
    Gr || (bt.unshift(...Cr), bt.push(...Ls(h)), bt.unshift(...Kr)), h.solo && h.creditedTo && h.listening && !["intro", "off", "elsewhere", "loading"].includes(h.step) && bt.unshift(I("p", `This is ${vt(h.creditedTo)}'s listening wallet. Plays and likes count for ${vt(h.creditedTo)}. Connect it (top right) to see its likes here too.`, "ppp-ok")), s(".ppp-key").replaceChildren(...bt);
    const cr = document.querySelector(".ppp-switch");
    if (cr) {
      const Y = f.latest(), at = h.slot > 0, ke = ["fund", "ready", "over"].includes(h.step) && (at || !!Y);
      if (cr.hidden = !ke, ke) {
        const Me = (g, B, H, ct) => {
          const $e = X("", ct, "ppp-tab");
          return $e.setAttribute("aria-pressed", String(H)), $e.append(I("span", g, "tt"), I("span", B === void 0 ? "…" : `${Et(B).toLocaleString()} plays`, "ts")), $e.disabled = !!h.busy, $e;
        }, po = at ? ((Qo = (qr = h.gift) == null ? void 0 : qr.player) == null ? void 0 : Qo.title) ?? "Album" : Y.title, Ps = X("View all albums" + (f.count() > 1 ? ` (${f.count()})` : ""), () => {
          const g = document.querySelector(".ppp-shelf");
          g && (g.hidden = !1, g.open = !g.open, Ps.setAttribute("aria-expanded", String(g.open)), g.open && requestAnimationFrame(() => g.scrollIntoView({ block: "nearest", behavior: "smooth" })));
        }, "ppp-all-albums");
        Ps.setAttribute("aria-expanded", String(!!((Jo = document.querySelector(".ppp-shelf")) != null && Jo.open))), cr.replaceChildren(
          Me("🎧 My player", at ? (ho = h.likeFunds) == null ? void 0 : ho.balance : h.balance, !at, () => {
            at && c.openAlbum(0);
          }),
          Me("💿 " + po, at ? h.balance : void 0, at, () => {
            !at && Y && c.openAlbum(Y.slot);
          }),
          Ps
        );
      }
    }
    const Vr = f.render(h), Wn = document.querySelector(".ppp-shelf");
    if (Wn) {
      Wn.hidden = !Vr;
      const Y = Wn.querySelector("summary");
      Y && (Y.textContent = f.count() > 0 ? `♪ My albums (${f.count()})` : "♪ My albums");
      const at = Wn.querySelector(".ppp-shelf-body");
      Vr && at && !at.contains(Vr) && at.replaceChildren(Vr);
    }
    const Tr = u.renderFold(d);
    if (s(".ppp-gifts").hidden = !Tr, Tr && !s(".ppp-gift-body").contains(Tr) && s(".ppp-gift-body").replaceChildren(Tr), Tr && At) {
      At = !1;
      const Y = s(".ppp-gifts");
      Y.open = !0, requestAnimationFrame(() => Y.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
    s(".ppp-body").replaceChildren(...qt), s(".ppp-actions").replaceChildren(...le), s(".ppp-actions2").replaceChildren(...Cn);
    const Ns = h.busy || h.message || "", Xn = s(".ppp-msg"), Fn = Ns && bt.some((Y) => (Y.textContent ?? "").startsWith(Ns.replace(/[.✓\s]+$/, ""))) ? "" : Ns, y = !Fn && !h.error ? h.notice : tt && !Fn ? h.error : "";
    Xn.textContent = Fn || y, Xn.classList.toggle("is-warn", !!y), s(".ppp-err").textContent = tt ? "" : h.error;
    const L = h.entries.filter((Y) => Y.kind === "play");
    s(".ppp-recent").hidden = !h.entries.length, s(".ppp-recent-list").replaceChildren(...L.slice(0, 5).map((Y) => {
      const at = I("li"), ke = Y.status === "confirmed" ? "ok" : Y.status === "failed" ? "bad" : "warn";
      return at.append(I("span", "", "d " + ke), I("span", Be(Y), "t"), I("span", U(Y.created), "ppp-mute")), Y.txid && at.append(wt("tx", ot(Y.txid))), at;
    })), s(".ppp-wallets").hidden = !(Dn.childElementCount || Cn.length), s(".ppp-more").hidden = !qt.length;
    const q = s(".ppp-history");
    q.hidden = !h.entries.length, h.entries.length && We(), q.replaceChildren(I("summary", `All activity (${h.entries.length})`), ...h.entries.slice(0, 20).map((Y) => {
      const at = I("div", "", "ppp-row"), ke = Y.kind === "play" ? [I("span", Be(Y), "ppp-song"), I("span", ` · ${pr(BigInt(Y.amount))} STX to ${vt(Y.recipient)}`, "ppp-mute")] : Y.kind === "like" ? [I("span", `${Y.liked ? "♥ Liked" : "Unliked"} ${Be(Y)}`, "ppp-song"), I("span", ` · for ${h.linked ? vt(h.linked) : "this listening wallet"}`, "ppp-mute")] : [I("span", `Returned ${pr(BigInt(Y.amount))} STX`, "ppp-song"), I("span", ` to ${vt(Y.recipient)}`, "ppp-mute")];
      return at.append(
        I("span", ae[Y.status] || Y.status, "ppp-status " + (ye[Y.status] || "")),
        ...ke,
        I("span", ` · ${new Date(Y.created).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} `, "ppp-mute")
      ), Y.txid && at.append(wt("tx ↗", ot(Y.txid))), at;
    })), m == null || m.render(Gr ? Vt(h, Gr, [...Kr, ...Cr]) : null), M == null || M.render((Lr == null ? void 0 : Lr.mode) === "open" ? Vt(h, Lr, []) : null);
  }
  function fo(d) {
    var h;
    if (["off", "elsewhere", "not-invited"].includes(d.step)) return null;
    if (d.slot > 0 && ((h = d.gift) != null && h.player) && ["fund", "ready", "over", "link", "loading"].includes(d.step))
      return d.root && _({ root: d.root, slot: d.slot, player: d.gift.player }), { mode: "open", player: d.gift.player };
    const x = u.incomingAlbum();
    if (x) return { mode: "arrive", player: x.player, from: x.from, offered: x.plays };
    const v = z();
    return v && (d.step === "locked" || N && d.step === "loading") ? { mode: "locked", player: v.player } : null;
  }
  function Vt(d, x, v) {
    var Ae, yn, Fe;
    const h = !!d.busy || d.armed, tt = [...v];
    d.depositPending && d.arrival && tt.push(Cs(d.arrival)), d.error ? tt.push(I("p", d.error, d.error === yc ? "ppp-warn" : "ppp-bad")) : d.message && !h ? tt.push(I("p", d.message, "ppp-cyan")) : d.notice && tt.push(I("p", d.notice, "ppp-warn")), x.mode === "open" && C && ((Ae = d.likeFunds) != null && Ae.album) && d.likeFunds.low && !d.likeFunds.pending && tt.push(I("p", "Likes are paused: My player needs a few plays to sign them.", "ppp-warn"));
    const ut = "Kept on this device with Face ID or your passkey. No app or account needed.";
    let $t = null, de = null;
    return x.mode === "locked" ? ($t = { label: "Continue listening", run: () => {
      N = z(), c.unlock();
    } }, de = { label: "Use a different passkey", run: () => {
      N = null, c.unlock(!0);
    } }) : x.mode === "arrive" && (d.step === "intro" ? ($t = { label: "Open album", run: () => void c.create() }, de = { label: "I've used Xtrata Music here before", run: () => void c.unlock(!0) }) : d.step === "locked" ? ($t = { label: "Open album", run: () => void c.unlock() }, de = { label: "Use a different passkey", run: () => void c.unlock(!0) }) : d.step === "unsupported" ? tt.push(I("p", "This browser cannot keep albums. Open the link in Safari or Chrome.", "ppp-warn")) : tt.length || tt.push(I("p", "Opening your album…", "ppp-cyan"))), {
      mode: x.mode,
      player: x.player,
      from: x.from,
      offered: x.offered,
      plays: x.mode === "open" ? d.balance === void 0 ? null : d.giftPlays : void 0,
      playsComing: d.depositPending,
      status: tt,
      primary: $t,
      secondary: de,
      hint: $t ? ut : void 0,
      asking: h,
      busy: !!d.busy,
      myPlays: $n(d),
      topUps: ja,
      canMake: !!((Fe = (yn = d.gate) == null ? void 0 : yn.gifts) != null && Fe.admin)
    };
  }
  const Xe = /* @__PURE__ */ new Map(), cn = () => {
    const d = window.XtrataRadio;
    return d != null && d.subscribe ? (d.subscribe((x) => {
      const v = x == null ? void 0 : x.nowPlaying;
      v && Number.isSafeInteger(Number(v.tokenId)) && Xe.set(Number(v.tokenId), { title: v.title || void 0, artist: v.artist || void 0 });
    }), !0) : !1;
  };
  if (!cn()) {
    const d = setInterval(() => {
      cn() && clearInterval(d);
    }, 500);
    setTimeout(() => clearInterval(d), 6e4);
  }
  window.addEventListener("xtrata:radio-listened", (d) => {
    const x = d.detail;
    if (x && Number.isSafeInteger(x.song) && typeof x.id == "string" && /^[0-9a-f]{32}$/.test(x.id)) {
      We();
      const v = Se(x.song, Xe.get(x.song));
      c.onListened({ song: x.song, id: x.id, title: v.title || void 0, artist: v.artist || void 0 });
    }
  }), window.addEventListener("xtrata:wallet-changed", () => void c.refresh()), document.addEventListener("visibilitychange", () => {
    document.hidden || c.refresh();
  }), setInterval(() => {
    !document.hidden && (e || c.snapshot().step !== "off") && c.refresh();
  }, 15e3), c.refresh();
}
const Fk = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==", jk = () => {
  const t = !!window.chrome, e = window.navigator, n = e.vendor, r = typeof window.opr < "u", s = e.userAgent.includes("Edge"), i = /CriOS/.exec(e.userAgent), o = e.userAgent.includes("Mobile");
  return i ? !1 : t !== null && typeof t < "u" && n === "Google Inc." && r === !1 && s === !1 && o === !1;
}, zk = () => jk() ? "Chrome" : window.navigator.userAgent.includes("Firefox") ? "Firefox" : null, Rk = () => window.navigator.userAgent.includes("Mobile") ? window.navigator.userAgent.includes("iPhone") ? "IOS" : "Android" : null, Gk = '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}', yw = class {
  constructor(t) {
    u4(this, t), this.defaultProviders = void 0, this.installedProviders = void 0, this.persistSelection = void 0, this.callback = void 0, this.cancelCallback = void 0;
  }
  handleSelectProvider(t) {
    this.persistSelection && Tx(t), this.callback(Mc(t));
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
    var r, s, i, o, a, c, u, f, l, w;
    return n === "IOS" ? (s = (r = t.iOSAppStoreUrl) !== null && r !== void 0 ? r : this.getBrowserUrl(t)) !== null && s !== void 0 ? s : t.webUrl : e === "Chrome" ? (o = (i = t.chromeWebStoreUrl) !== null && i !== void 0 ? i : this.getMobileUrl(t)) !== null && o !== void 0 ? o : t.webUrl : e === "Firefox" ? (c = (a = t.mozillaAddOnsUrl) !== null && a !== void 0 ? a : this.getMobileUrl(t)) !== null && c !== void 0 ? c : t.webUrl : n === "Android" ? (f = (u = t.googlePlayStoreUrl) !== null && u !== void 0 ? u : this.getBrowserUrl(t)) !== null && f !== void 0 ? f : t.webUrl : (w = (l = this.getBrowserUrl(t)) !== null && l !== void 0 ? l : t.webUrl) !== null && w !== void 0 ? w : this.getMobileUrl(t);
  }
  render() {
    const t = zk(), e = Rk(), n = this.defaultProviders.filter(
      (i) => this.installedProviders.findIndex((o) => o.id === i.id) === -1
      // keep providers NOT already in installed list
    ), r = this.installedProviders.length > 0, s = n.length > 0;
    return Lt("div", { class: "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center" }, Lt("div", { class: "fixed inset-0 z-[8999]", onClick: () => this.handleCloseModal() }), Lt("div", { class: "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl" }, Lt("div", { class: "flex flex-col space-y-[10px]" }, Lt("div", { class: "flex items-center" }, Lt("div", { class: "flex-1 text-xl font-medium text-[#242629]" }, "Connect a wallet"), Lt("button", { class: "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95", onClick: () => this.handleCloseModal() }, Lt("span", { class: "sr-only" }, "Close popup"), Lt("img", { src: Fk }))), r ? Lt("p", null, "Select the wallet you want to connect to.") : Lt("p", null, "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.")), !e && !t && Lt("div", { class: "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500" }, "Unfortunately, your browser isn't supported"), r && Lt("div", { class: "mt-6" }, Lt("p", { class: "mb-4 text-sm font-medium" }, "Installed wallets"), Lt("ul", { class: "space-y-3" }, this.installedProviders.map((i) => Lt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Lt("div", { class: "aspect-square basis-9 overflow-hidden" }, Lt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Lt("div", { class: "flex-1" }, Lt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Lt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), Lt("button", { class: "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95", onClick: () => this.handleSelectProvider(i.id) }, "Connect"))))), s && Lt("div", { class: "mt-6" }, r ? Lt("p", { class: "mb-4 text-sm font-medium" }, "Other wallets") : Lt("div", { class: "mb-5 flex justify-between" }, Lt("p", { class: "text-sm font-medium" }, "Recommended wallets"), Lt("a", { class: "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline", href: "https://docs.hiro.so/what-is-a-wallet", rel: "noopener noreferrer", target: "_blank" }, Lt("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 16 16", fill: "none" }, Lt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" }), Lt("path", { stroke: "#74777D", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.2", d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01" })), Lt("p", null, "What is a wallet? ", Lt("span", { class: "align-text-bottom text-[9px]" }, "↗")))), Lt("ul", { class: "space-y-3" }, n.map((i) => Lt("li", { class: "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]" }, Lt("div", { class: "aspect-square basis-9 overflow-hidden" }, Lt("img", { src: i.icon, class: "h-full w-full rounded-[10px] bg-gray-700" })), Lt("div", { class: "flex-1" }, Lt("div", { class: "text-sm font-medium text-[#242629]" }, i.name), i.webUrl && Lt("a", { href: i.webUrl, class: "text-sm", rel: "noopener noreferrer" }, new URL(i.webUrl).hostname)), this.getInstallUrl(i, t, e) && Lt("a", { class: "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95", href: this.getInstallUrl(i, t, e), rel: "noopener noreferrer", target: "_blank" }, i.id === "AsignaProvider" ? "Open" : "Install", " →")))))));
  }
  static get assetsDirs() {
    return ["assets"];
  }
  get modalEl() {
    return KA(this);
  }
};
yw.style = Gk;
const Kk = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  connect_modal: yw
}, Symbol.toStringTag, { value: "Module" }));
